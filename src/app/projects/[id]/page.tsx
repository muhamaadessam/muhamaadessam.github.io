import type { Metadata } from 'next';
import { getProjectById, getProjects } from '@/lib/services';
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
      title: 'Project Not Found | Muhammad Essam',
    };
  }

  return {
    title: `${project.projectName} | Muhammad Essam`,
    description: project.projectDescription,
    openGraph: {
      title: `${project.projectName} | Muhammad Essam`,
      description: project.projectDescription,
      images: project.projectImage ? [{ url: project.projectImage }] : undefined,
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
  const project = await getProjectById(id);

  return <ProjectDetailsClient project={project} projectId={id} />;
}
