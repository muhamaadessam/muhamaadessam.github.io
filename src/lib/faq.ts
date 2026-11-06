import type { Experience, PortfolioData, Project } from './services';
import { CV_DOWNLOAD_URL, GITHUB_URL, LINKEDIN_URL } from './constants';
import { KNOWS_ABOUT, PERSON_NAME, SITE_URL, YEARS_OF_EXPERIENCE } from './seo';

export type FaqEntry = { id: string; question: string; answer: string };

// One source for the on-page FAQ, the FAQPage schema and llms.txt, so answer engines see the same answers everywhere.
// Each answer opens with the direct fact, then adds context, which is the shape answer engines quote.
export function buildFaqs(portfolio: PortfolioData | null, projects: Project[], experiences: Experience[]): FaqEntry[] {
  const name = portfolio?.name || PERSON_NAME;
  const jobTitle = portfolio?.jop_title?.trim() || 'Flutter Developer';
  const current = experiences.find((exp) => !exp.endDate);
  const projectNames = projects.map((project) => project.projectName).filter(Boolean);

  return [
    {
      id: 'who',
      question: `Who is ${name}?`,
      answer: `${name} is a ${jobTitle} with ${YEARS_OF_EXPERIENCE} years of experience building and shipping production Android and iOS applications using Flutter, Dart, BLoC, Firebase, and Clean Architecture.`,
    },
    {
      id: 'stack',
      question: `What technologies does ${name} work with?`,
      answer: `${name} works with ${KNOWS_ABOUT.join(', ')}. State management is done with BLoC and codebases follow Clean Architecture so features stay easy to change as a product grows.`,
    },
    ...(projectNames.length > 0
      ? [{
          id: 'projects',
          question: `What apps has ${name} built?`,
          answer: `${name} has built ${projectNames.join(', ')}. Each project has its own page on ${SITE_URL} with the tech stack, key features, and store links.`,
        }]
      : []),
    ...(current
      ? [{
          id: 'work',
          question: `Where does ${name} work?`,
          answer: `${name} currently works as ${current.title} at ${current.company}${current.location ? ` (${current.location})` : ''}.`,
        }]
      : []),
    {
      id: 'stores',
      question: `Does ${name} publish apps to Google Play and the App Store?`,
      answer: `Yes. ${name} ships production apps to both Google Play and the App Store and owns features end-to-end, from UI to API integration.`,
    },
    {
      id: 'cv',
      question: `Where can I download ${name}'s CV?`,
      answer: `The latest CV is always available at ${SITE_URL}${CV_DOWNLOAD_URL} as a PDF.`,
    },
    {
      id: 'contact',
      question: `How can I contact ${name}?`,
      answer: `Send a message through the contact form at ${SITE_URL}/#contact, or connect on LinkedIn (${portfolio?.linkedin || LINKEDIN_URL}) or GitHub (${portfolio?.github || GITHUB_URL}).`,
    },
  ];
}
