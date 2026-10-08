import type { Metadata } from 'next';
import { getPortfolioData, getProjectById, getProjects } from '@/lib/services';
import JsonLd from '@/components/JsonLd';
import { PERSON_ID, SITE_NAME, SITE_URL, projectUrl } from '@/lib/seo';
import ProjectDetailsClient from './ProjectDetailsClient';

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return {
      title: 'Project Not Found',
      robots: { index: false, follow: false },
    };
  }

  const image = project.projectImage ? [{ url: project.projectImage, alt: project.projectName }] : undefined;

  return {
    title: project.projectName,
    description: project.projectDescription,
    alternates: { canonical: `/projects/${encodeURIComponent(id)}` },
    openGraph: {
      type: 'article',
      url: `/projects/${encodeURIComponent(id)}`,
      siteName: SITE_NAME,
      title: `${project.projectName} | Muhammad Essam`,
      description: project.projectDescription,
      images: image,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.projectName} | Muhammad Essam`,
      description: project.projectDescription,
      images: project.projectImage ? [project.projectImage] : undefined,
    },
  };
}

export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const [project, portfolio] = await Promise.all([getProjectById(id), getPortfolioData()]);

  const url = projectUrl(id);
  const schema = project
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'SoftwareApplication',
            '@id': `${url}#app`,
            name: project.projectName,
            description: project.overview || project.projectDescription,
            url,
            applicationCategory: 'MobileApplication',
            ...(project.projectImage ? { image: project.projectImage } : {}),
            ...(project.techStack?.length ? { keywords: project.techStack.join(', ') } : {}),
            ...(project.keyFeaturesAndBenefits?.length ? { featureList: project.keyFeaturesAndBenefits } : {}),
            author: { '@id': PERSON_ID },
            ...(project.links?.length ? { sameAs: project.links.map((link) => link.link).filter(Boolean) } : {}),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/#projects` },
              { '@type': 'ListItem', position: 3, name: project.projectName, item: url },
            ],
          },
        ],
      }
    : null;

  return (
    <>
      {schema && <JsonLd data={schema} />}
      <ProjectDetailsClient project={project} projectId={id} portfolio={portfolio} />
    </>
  );
}
