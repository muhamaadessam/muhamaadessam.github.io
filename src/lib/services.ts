import { collection, doc, getDoc, getDocs, setDoc, updateDoc, increment } from 'firebase/firestore';
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

const IGNORED_VISITOR_IDS = new Set(['1777640653418', '1777681421611', '1783389357146']);
type PortfolioEvent = 'page_view' | 'project_click' | 'cv_download' | 'contact_submit' | 'external_link_click';

function isIgnoredVisitor(visitorId: string | null): boolean {
  return visitorId !== null && IGNORED_VISITOR_IDS.has(visitorId);
}

export async function trackVisitor(): Promise<void> {
  try {
    if (typeof window === 'undefined') return;

    let visitorId = localStorage.getItem('visitor_id');
    if (isIgnoredVisitor(visitorId)) return;

    let isNewVisitor = false;

    if (!visitorId) {
      visitorId = Date.now().toString();
      localStorage.setItem('visitor_id', visitorId);
      isNewVisitor = true;
    }

    const docRef = doc(db, 'stats', 'visitors');
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      const users = data.users || {};
      const currentCount = users[visitorId] || 0;

      isNewVisitor = currentCount === 0;

      await setDoc(docRef, {
        total_visitors: isNewVisitor ? increment(1) : Object.keys(users).length,
        total_visites: increment(1),
        users: {
          ...users,
          [visitorId]: currentCount + 1,
        }
      }, { merge: true });
    } else {
      await setDoc(docRef, {
        total_visitors: 1,
        total_visites: 1,
        users: {
          [visitorId]: 1,
        }
      });
    }

    await trackPortfolioEvent('page_view');
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
}

export async function trackPortfolioEvent(event: PortfolioEvent, target = 'site'): Promise<void> {
  try {
    if (typeof window === 'undefined') return;

    const visitorId = localStorage.getItem('visitor_id');
    if (isIgnoredVisitor(visitorId)) return;

    const safeTarget = target.replace(/[^a-z0-9_-]/gi, '_').slice(0, 80) || 'site';
    await setDoc(doc(db, 'stats', 'events'), {
      [event]: increment(1),
      [`${event}_${safeTarget}`]: increment(1),
    }, { merge: true });
  } catch (error) {
    console.error(`Error tracking ${event}:`, error);
  }
}

export async function incrementCvDownloadCount(): Promise<void> {
  try {
    const visitorId = typeof window !== 'undefined' ? localStorage.getItem('visitor_id') : null;
    if (isIgnoredVisitor(visitorId)) return;

    const statsDoc = doc(db, 'stats', 'cv_downloads');
    await updateDoc(statsDoc, {
      count: increment(1)
    }).catch(() => { });

    await trackPortfolioEvent('cv_download');
  } catch (error) {
    console.error('Error incrementing CV download count:', error);
  }
}
