import { collection, doc, getDoc, getDocs, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface LinkModel {
  title?: string;
  link: string;
}

export interface Project {
  docId?: string;
  id: string;
  projectName: string;
  projectDescription: string;
  projectImage: string;
  techStack: string[];
  keyFeaturesAndBenefits: string[];
  links: LinkModel[];
  category: string;
  status: string;
  testingGroupLink?: string;
  isFeatured: boolean;
  screenshots?: string[];
  overview?: string;
  challenge?: string;
  solution?: string;
  myRole?: string;
  myContribution?: string[];
}

export interface Skill {
  docId?: string;
  id: string;
  title: string;
  skills: string[];
}

export interface Experience {
  docId?: string;
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string; // 'YYYY-MM'
  endDate: string | null; // 'YYYY-MM' or null for Present
  employmentType: string; // e.g., 'Full-time', 'Part-time', 'Internship'
  description: string[]; // Bullet points
  skills: string[];
  companyUrl?: string; // Link to the company's website or LinkedIn
}



export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: { toDate(): Date };
  read: boolean;
}

export type TelegramLogType = 'contact' | 'visitor' | 'cv_download';

export async function getProjects(): Promise<Project[]> {
  try {
    const projectsCol = collection(db, 'projects');
    const projectSnapshot = await getDocs(projectsCol);
    const projects = projectSnapshot.docs.map(doc => ({
      docId: doc.id,
      id: doc.id,
      ...doc.data()
    })) as Project[];

    return projects.sort((a, b) => {
      const idA = parseInt(String(a.id), 10);
      const idB = parseInt(String(b.id), 10);

      if (!isNaN(idA) && !isNaN(idB)) {
        return idA - idB;
      }

      return String(a.id).localeCompare(String(b.id));
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Project;
    }

    const allProjects = await getProjects();
    const project = allProjects.find(p => String(p.id) === String(id));
    return project || null;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const skillsCol = collection(db, 'skills');
    const skillSnapshot = await getDocs(skillsCol);
    return skillSnapshot.docs.map(doc => ({
      docId: doc.id,
      id: doc.id,
      ...doc.data()
    })) as Skill[];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const expCol = collection(db, 'experiences');
    // Using simple getDocs and sorting on the client to avoid needing a composite index
    const expSnapshot = await getDocs(expCol);
    const experiences = expSnapshot.docs.map(doc => ({
      docId: doc.id,
      id: doc.id,
      ...doc.data()
    })) as Experience[];

    // Sort by endDate descending (null is highest/present), then startDate descending
    return experiences.sort((a, b) => {
      const aEnd = a.endDate || '9999-99'; // 'Present'
      const bEnd = b.endDate || '9999-99'; // 'Present'

      if (aEnd !== bEnd) {
        return bEnd.localeCompare(aEnd);
      }

      const aStart = a.startDate || '';
      const bStart = b.startDate || '';
      return bStart.localeCompare(aStart);
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}

export interface PortfolioData {
  objective?: string;
  company?: string;
  phone?: string;
  email?: string;
  name?: string;
  linkedin?: string;
  github?: string;
  jop_title?: string;
  image?: string;
}

export async function getPortfolioData(): Promise<PortfolioData | null> {
  try {
    const docSnap = await getDoc(doc(db, 'portfolio', 'user_data'));
    if (docSnap.exists()) {
      return docSnap.data() as PortfolioData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return null;
  }
}

type PortfolioEvent = 'page_view' | 'project_click' | 'cv_download' | 'contact_submit' | 'external_link_click';

export function toAnalyticsKey(value: string): string {
  return value.trim().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_+|_+$/g, '').slice(0, 80) || 'unknown';
}

export async function trackVisitor(): Promise<void> {
  try {
    if (typeof window === 'undefined') return;

    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = Date.now().toString();
      localStorage.setItem('visitor_id', visitorId);
    }

    // Each visitor has its own document so stats/visitors stays small; it only
    // keeps the totals. The legacy stats/visitors.users map is read-only now and
    // is used to carry over visit counts recorded before this change.
    const statsRef = doc(db, 'stats', 'visitors');
    const visitorRef = doc(db, 'visitors', visitorId);
    const [statsSnapshot, visitorSnapshot] = await Promise.all([getDoc(statsRef), getDoc(visitorRef)]);
    const statsData = statsSnapshot.data() || {};
    const legacyVisits = Number(statsData.users?.[visitorId]) || 0;
    const previousVisits = visitorSnapshot.exists() ? Number(visitorSnapshot.data().visits) || 0 : legacyVisits;
    const isNewVisitor = previousVisits === 0;

    if (visitorSnapshot.exists()) {
      await updateDoc(visitorRef, { visits: increment(1), lastSeen: serverTimestamp() });
    } else {
      await setDoc(visitorRef, { visits: legacyVisits + 1, firstSeen: serverTimestamp(), lastSeen: serverTimestamp() });
    }

    await setDoc(statsRef, {
      total_visitors: increment(isNewVisitor ? 1 : 0),
      total_visites: increment(1),
    }, { merge: true });

    const totalUnique = (Number(statsData.total_visitors) || 0) + (isNewVisitor ? 1 : 0);
    const totalVisits = (Number(statsData.total_visites) || 0) + 1;

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT 
        ? process.env.NEXT_PUBLIC_CONTACT_ENDPOINT.replace('/contact', '/visitor')
        : 'https://portfolio-contact-api-muhammad-essam.vercel.app/api/visitor';

      const payload = {
        visitorId,
        isNewVisitor,
        totalUnique,
        totalVisits,
      };
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (apiError) {
      console.error('Failed to send visitor Telegram notification:', apiError);
    }

    await trackPortfolioEvent('page_view', 'homepage');
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
}

export async function trackPortfolioEvent(event: PortfolioEvent, target = 'site'): Promise<void> {
  try {
    if (typeof window === 'undefined') return;

    const safeTarget = toAnalyticsKey(target);
    await setDoc(doc(db, 'stats', 'events'), {
      [event]: increment(1),
      [`${event}_${safeTarget}`]: increment(1),
    }, { merge: true });
  } catch (error) {
    console.error(`Error tracking ${event}:`, error);
  }
}

export async function trackProjectEvent(
  event: 'project_click' | 'external_link_click',
  projectId: string,
  projectName: string,
  button?: string,
): Promise<void> {
  await trackPortfolioEvent(event, projectName);

  try {
    if (typeof window === 'undefined') return;

    const projectKey = toAnalyticsKey(projectId);
    const fields: Record<string, unknown> = { [`project_${projectKey}_name`]: projectName };

    if (event === 'project_click') {
      fields[`project_${projectKey}_opens`] = increment(1);
    }

    if (button) {
      const buttonKey = toAnalyticsKey(button);
      fields[`project_${projectKey}_button_${buttonKey}`] = increment(1);
      fields[`project_${projectKey}_button_label_${buttonKey}`] = button;
    }

    await setDoc(doc(db, 'stats', 'project_events'), fields, { merge: true });
  } catch (error) {
    console.error(`Error tracking project ${event}:`, error);
  }
}

export async function incrementCvDownloadCount(): Promise<void> {
  try {
    const visitorId = typeof window !== 'undefined' ? localStorage.getItem('visitor_id') : null;

    const statsDoc = doc(db, 'stats', 'cv_downloads');
    await setDoc(statsDoc, {
      count: increment(1)
    }, { merge: true });

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT 
        ? process.env.NEXT_PUBLIC_CONTACT_ENDPOINT.replace('/contact', '/cv-download')
        : 'https://portfolio-contact-api-muhammad-essam.vercel.app/api/cv-download';

      const payload = { visitorId };
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (apiError) {
      console.error('Failed to send CV download Telegram notification:', apiError);
    }

    await trackPortfolioEvent('cv_download', 'cv');
  } catch (error) {
    console.error('Error incrementing CV download count:', error);
  }
}
