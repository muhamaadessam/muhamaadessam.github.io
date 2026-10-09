import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Faq, { FaqItem } from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { DEFAULT_DESCRIPTION, KNOWS_ABOUT, PERSON_ID, PERSON_NAME, SITE_URL, WEBSITE_ID, projectUrl } from '@/lib/seo';
import { getExperiences, getPortfolioData, getProjects, getSkills } from '@/lib/services';

// Preserve the daily content refresh previously provided by the Pages rebuild.
export const revalidate = 86400;

export default async function Home() {
  const [portfolio, projects, experiences, skills] = await Promise.all([
    getPortfolioData(),
    getProjects(),
    getExperiences(),
    getSkills(),
  ]);

  const name = portfolio?.name || PERSON_NAME;
  const jobTitle = portfolio?.jop_title?.trim() || 'Flutter Developer';
  const current = experiences.find((exp) => !exp.endDate);
  const projectNames = projects.map((project) => project.projectName).filter(Boolean);

  const faqs: FaqItem[] = [
    {
      question: `Who is ${name}?`,
      answer: `${name} is a ${jobTitle} with 3+ years of experience building and shipping production Android and iOS applications using Flutter, Dart, BLoC, Firebase, and Clean Architecture.`,
    },
    {
      question: `What technologies does ${name} work with?`,
      answer: `${name} works with ${KNOWS_ABOUT.join(', ')}. State management is done with BLoC and codebases follow Clean Architecture so features stay easy to change as a product grows.`,
    },
    ...(projectNames.length > 0
      ? [{
          question: `What apps has ${name} built?`,
          answer: `Projects include ${projectNames.join(', ')}. Each one has its own page with the tech stack, key features, and links.`,
        }]
      : []),
    ...(current
      ? [{
          question: `Where does ${name} work?`,
          answer: `${name} currently works as ${current.title} at ${current.company}${current.location ? ` (${current.location})` : ''}.`,
        }]
      : []),
    {
      question: `Does ${name} publish apps to Google Play and the App Store?`,
      answer: `Yes. ${name} ships production apps to both Google Play and the App Store and owns features end-to-end, from UI to API integration.`,
    },
    {
      question: `How can I contact ${name}?`,
      answer: 'Have a project in mind? Send me a message through the contact form, or connect with me on LinkedIn or GitHub.',
      answerContent: <>
        Have a project in mind? Send me a message through the{' '}
        <a href="#contact" className="text-primary underline underline-offset-4 hover:text-white">contact form</a>, or connect with me on{' '}
        <a href={portfolio?.linkedin || 'https://www.linkedin.com/in/muhammadessam159/'} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-white">LinkedIn</a> or{' '}
        <a href={portfolio?.github || 'https://github.com/muhamaadessam'} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-white">GitHub</a>.
      </>,
    },
  ];

  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profile`,
        url: `${SITE_URL}/`,
        name: `${name} | ${jobTitle}`,
        description: DEFAULT_DESCRIPTION,
        inLanguage: 'en',
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name,
        jobTitle,
        ...(current ? { worksFor: { '@type': 'Organization', name: current.company, ...(current.companyUrl ? { url: current.companyUrl } : {}) } } : {}),
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#projects`,
        name: `Projects by ${name}`,
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: projectUrl(project.id),
          name: project.projectName,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen flex flex-col">
      <JsonLd data={pageSchema} />
      <Header />
      <Hero data={portfolio} />
      <About />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Skills skills={skills} />
      <Faq items={faqs} />
      <Contact data={portfolio} />
      <Footer data={portfolio} />
    </main>
  );
}
