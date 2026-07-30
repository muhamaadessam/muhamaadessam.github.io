import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/services';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const now = new Date();

  return [
    {
      url: 'https://muhamaadessam.github.io/',
      lastModified: now,
    },
    ...projects.map((project) => ({
      url: `https://muhamaadessam.github.io/projects/${project.id}`,
      lastModified: now,
    })),
  ];
}
