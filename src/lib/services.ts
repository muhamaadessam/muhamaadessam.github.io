import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { type PortfolioEvent } from './analytics';
import { sendTracking } from './analyticsClient';
export { toAnalyticsKey } from './analytics';

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

export async function trackPortfolioEvent(event: PortfolioEvent, target = 'site'): Promise<void> {
  sendTracking(event, target);
}

export async function trackProjectEvent(
  event: 'project_click' | 'external_link_click',
  projectId: string,
  projectName: string,
  button?: string,
): Promise<void> {
  sendTracking(event, projectName, { projectId, projectName, ...(button ? { button } : {}) });
}

export async function incrementCvDownloadCount(): Promise<void> {
  sendTracking('cv_download', 'cv');
}
