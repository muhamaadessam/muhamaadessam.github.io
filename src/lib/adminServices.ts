import { collection, doc, setDoc, updateDoc, deleteDoc, addDoc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Project, Skill, PortfolioData, Experience, Message, TelegramLogType, toAnalyticsKey } from './services';

export interface PortfolioStats {
  totalVisitors: number;
  totalVisits: number;
  cvDownloads: number;
  events: Record<string, number>;
  visitors: { id: string; visits: number }[];
  projectAnalytics: ProjectAnalytics[];
}

export interface ProjectAnalytics {
  id: string;
  name: string;
  opens: number;
  buttons: { name: string; clicks: number }[];
}

export interface TelegramLog {
  id: string;
  type: TelegramLogType;
  payload: Record<string, unknown>;
  createdAt?: { toDate(): Date };
}

export async function getTelegramLogs(): Promise<TelegramLog[]> {
  try {
    const snapshot = await getDocs(query(collection(db, 'telegram_logs'), orderBy('createdAt', 'desc')));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as TelegramLog[];
  } catch (error) {
    console.error('Error fetching Telegram logs:', error);
    return [];
  }
}

export async function getPortfolioStats(): Promise<PortfolioStats> {
  try {
    const [visitorsSnapshot, downloadsSnapshot, eventsSnapshot, projectEventsSnapshot, projectsSnapshot] = await Promise.all([
      getDoc(doc(db, 'stats', 'visitors')),
      getDoc(doc(db, 'stats', 'cv_downloads')),
      getDoc(doc(db, 'stats', 'events')),
      getDoc(doc(db, 'stats', 'project_events')),
      getDocs(collection(db, 'projects')),
    ]);

    const visitorsData = visitorsSnapshot.data() || {};
    const users = visitorsData.users && typeof visitorsData.users === 'object' ? visitorsData.users : {};
    const visitors = Object.entries(users)
      .map(([id, visits]) => ({ id, visits: Number(visits) || 0 }))
      .sort((a, b) => b.visits - a.visits);

    const projectNames = Object.fromEntries(projectsSnapshot.docs.map((item) => {
      const data = item.data();
      return [String(data.id || item.id), String(data.projectName || item.id)];
    }));

    const rawEvents = eventsSnapshot.data() || {};
    const projectEvents = projectEventsSnapshot.data() || {};
    const events = Object.entries(rawEvents)
      .filter(([, value]) => typeof value === 'number')
      .reduce((result, [event, count]) => {
        const legacyPrefix = event.startsWith('project_click_') || event.startsWith('external_link_click_')
          ? event.slice(0, event.lastIndexOf('_') + 1)
          : '';
        const legacyId = legacyPrefix ? event.slice(legacyPrefix.length) : '';
        const label = legacyPrefix && projectNames[legacyId] ? `${legacyPrefix}${projectNames[legacyId]}` : event;
        result[label] = (result[label] || 0) + Number(count);
        return result;
      }, {} as Record<string, number>);

    const projectAnalytics = projectsSnapshot.docs.map((item) => {
      const data = item.data();
      const id = String(data.id || item.id);
      const name = String(data.projectName || id);
      const prefix = `project_${toAnalyticsKey(id)}`;
      const legacyNameKey = name.trim().replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').slice(0, 80);
      const legacyOpens = Number(
        rawEvents[`project_click_${toAnalyticsKey(name)}`] ||
        rawEvents[`project_click_${legacyNameKey}`] ||
        rawEvents[`project_click_${id}`],
      ) || 0;
      const buttons = Object.entries(projectEvents)
        .filter(([key, value]) => key.startsWith(`${prefix}_button_`) && !key.startsWith(`${prefix}_button_label_`) && typeof value === 'number')
        .map(([key, value]) => ({
          name: String(projectEvents[`${prefix}_button_label_${key.slice(`${prefix}_button_`.length)}`] || key.slice(`${prefix}_button_`.length).replaceAll('_', ' ')),
          clicks: Number(value),
        }))
        .sort((a, b) => b.clicks - a.clicks);
      const legacyExternalClicks = Object.entries(rawEvents)
        .filter(([key, value]) => {
          const nameMatches = key === `external_link_click_${toAnalyticsKey(name)}` || key.startsWith(`external_link_click_${toAnalyticsKey(name)}_`);
          const legacyNameMatches = legacyNameKey && (key === `external_link_click_${legacyNameKey}` || key.startsWith(`external_link_click_${legacyNameKey}_`));
          const idMatches = key === `external_link_click_${toAnalyticsKey(id)}` || key.startsWith(`external_link_click_${toAnalyticsKey(id)}_`);
          return typeof value === 'number' && (nameMatches || legacyNameMatches || idMatches);
        })
        .reduce((total, [, value]) => total + Number(value), 0);

      return {
        id,
        name: String(projectEvents[`${prefix}_name`] || name),
        opens: Number(projectEvents[`${prefix}_opens`]) || legacyOpens,
        buttons: buttons.length || !legacyExternalClicks
          ? buttons
          : [{ name: 'Legacy external links', clicks: legacyExternalClicks }],
      };
    }).sort((a, b) => b.opens - a.opens);

    return {
      totalVisitors: Number(visitorsData.total_visitors) || visitors.length,
      totalVisits: Number(visitorsData.total_visites ?? visitorsData.total_visits) || 0,
      cvDownloads: Number(downloadsSnapshot.data()?.count) || 0,
      events,
      visitors,
      projectAnalytics,
    };
  } catch (error) {
    console.error('Error fetching portfolio stats:', error);
    return { totalVisitors: 0, totalVisits: 0, cvDownloads: 0, events: {}, visitors: [], projectAnalytics: [] };
  }
}

// Helper to remove undefined fields which Firebase doesn't support
const cleanObject = (obj: object) => {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
};

// --- Projects CRUD ---
export async function addProject(project: Omit<Project, 'id'>): Promise<string> {
  const projectsCol = collection(db, 'projects');
  const cleanedProject = cleanObject(project);
  const docRef = await addDoc(projectsCol, cleanedProject);
  // Also update the 'id' field in the document to match the doc.id for consistency
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
  const docRef = doc(db, 'projects', id);
  const cleanedProject = cleanObject(project);
  await updateDoc(docRef, cleanedProject);
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, 'projects', id);
  await deleteDoc(docRef);
}

// --- Skills CRUD ---
export async function addSkill(skill: Omit<Skill, 'id'>): Promise<string> {
  const skillsCol = collection(db, 'skills');
  const cleanedSkill = cleanObject(skill);
  const docRef = await addDoc(skillsCol, cleanedSkill);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
  const docRef = doc(db, 'skills', id);
  const cleanedSkill = cleanObject(skill);
  await updateDoc(docRef, cleanedSkill);
}

export async function deleteSkill(id: string): Promise<void> {
  const docRef = doc(db, 'skills', id);
  await deleteDoc(docRef);
}

// --- Experience CRUD ---
export async function addExperience(experience: Omit<Experience, 'id'>): Promise<string> {
  const expCol = collection(db, 'experiences');
  const cleanedExp = cleanObject(experience);
  const docRef = await addDoc(expCol, cleanedExp);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

export async function updateExperience(id: string, experience: Partial<Experience>): Promise<void> {
  const docRef = doc(db, 'experiences', id);
  const cleanedExp = cleanObject(experience);
  await updateDoc(docRef, cleanedExp);
}

export async function deleteExperience(id: string): Promise<void> {
  const docRef = doc(db, 'experiences', id);
  await deleteDoc(docRef);
}

// --- Portfolio Data CRUD ---
export async function updatePortfolioData(data: Partial<PortfolioData>): Promise<void> {
  const docRef = doc(db, 'portfolio', 'user_data');
  const cleanedData = cleanObject(data);
  await setDoc(docRef, cleanedData, { merge: true });
}

// --- Fun Facts CRUD ---
export async function updateFunFacts(facts: string[]): Promise<void> {
  const docRef = doc(db, 'fun_facts', 'main');
  await setDoc(docRef, { facts }, { merge: true });
}

// --- Messages CRUD ---
export async function getMessages(): Promise<Message[]> {
  const messagesCol = collection(db, 'messages');
  const q = query(messagesCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Message[];
}

export async function deleteMessage(id: string): Promise<void> {
  const docRef = doc(db, 'messages', id);
  await deleteDoc(docRef);
}

export async function markMessageAsRead(id: string): Promise<void> {
  const docRef = doc(db, 'messages', id);
  await updateDoc(docRef, { read: true });
}

// --- Cloudinary Upload ---
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = 'dxty2amiw';
  const uploadPreset = 'portfolio_uploads';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('upload_preset', uploadPreset);
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}
