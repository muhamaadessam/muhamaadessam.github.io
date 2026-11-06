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
import { DEFAULT_DESCRIPTION, PERSON_ID, PERSON_NAME, SITE_URL, WEBSITE_ID, projectUrl } from '@/lib/seo';
import { buildFaqs } from '@/lib/faq';
import { CV_DOWNLOAD_URL, GITHUB_URL, LINKEDIN_URL } from '@/lib/constants';
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

  const faqs: FaqItem[] = buildFaqs(portfolio, projects, experiences).map((faq) => (faq.id === 'contact'
    ? {
        ...faq,
        answerContent: <>
          Have a project in mind? Send me a message through the{' '}
          <a href="#contact" className="text-primary underline underline-offset-4 hover:text-white">contact form</a>, or connect with me on{' '}
          <a href={portfolio?.linkedin || LINKEDIN_URL} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-white">LinkedIn</a> or{' '}
          <a href={portfolio?.github || GITHUB_URL} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-white">GitHub</a>.
        </>,
      }
    : faq.id === 'cv'
      ? {
          ...faq,
          answerContent: <>
            The latest CV is always available as a PDF:{' '}
            <a href={CV_DOWNLOAD_URL} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-white">download the CV</a>.
          </>,
        }
      : faq));

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
        about: { '@id': PERSON_ID },
        mainEntity: { '@id': PERSON_ID },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}/opengraph-image.png` },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name,
        jobTitle,
        ...(portfolio?.image ? { image: portfolio.image } : {}),
        ...(skills.length ? { knowsAbout: [...new Set(skills.flatMap((group) => group.skills))] } : {}),
        ...(current ? { worksFor: { '@type': 'Organization', name: current.company, ...(current.companyUrl ? { url: current.companyUrl } : {}) } } : {}),
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#projects`,
        name: `Projects by ${name}`,
        numberOfItems: projects.length,
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
        url: `${SITE_URL}/#faq`,
        inLanguage: 'en',
        isPartOf: { '@id': WEBSITE_ID },
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
