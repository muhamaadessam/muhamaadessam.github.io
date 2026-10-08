'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CircleAlert } from 'lucide-react';
import { Project, trackProjectEvent } from '@/lib/services';
import { useRouter } from 'next/navigation';
import { optimizedImageUrl } from '@/lib/images';
import TiltSurface from '@/components/TiltSurface';

export default function Projects({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  // Featured projects first; Array.prototype.sort is stable, so the existing order is kept otherwise.
  const sortedProjects = [...projects].sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)));
  const isTesting = (project: Project) => project.status?.toLowerCase() === 'testing';
  const openProject = (project: Project) => {
    trackProjectEvent('project_click', project.id, project.projectName || project.id);
    router.push(`/projects/${project.id}`);
  };

  return (
    <section 
      id="projects" 
      className="py-24 relative bg-dark-bg md:bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/projects_bg.webp")' }}
    >
      <div className="absolute inset-0 bg-dark-bg/90"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Projects</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sortedProjects.map((project, index) => (
              <TiltSurface
                key={project.id}
                initial={{ opacity: 1, y: 60, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.7, delay: (index % 3) * 0.09 }}
                whileHover={{ y: -12 }}
                whileFocus={{ y: -12 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => openProject(project)}
                onKeyDown={(e) => {
                  if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    openProject(project);
                  }
                }}
                role="link"
                tabIndex={0}
                aria-label={`View ${project.projectName} case study`}
                className="project-card cursor-pointer glass rounded-2xl overflow-hidden group flex flex-col h-full hover:border-primary/50 hover:shadow-[0_24px_48px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-[border-color,box-shadow] duration-200"
              >
                {project.projectImage && (
                  <motion.div initial={false} whileInView={{ clipPath: ['inset(0% 0% 35% 0%)', 'inset(0% 0% 0% 0%)'] }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : (index % 3) * 0.09 }} className="w-full h-48 shrink-0 overflow-hidden relative bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={optimizedImageUrl(project.projectImage, 800)} 
                      alt={project.projectName} 
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-4">
                      <span className="text-white text-sm font-bold tracking-widest uppercase bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                        Read Case Study
                      </span>
                    </div>
                  </motion.div>
                )}
                
                <div className="p-6 flex flex-col flex-grow gap-3 relative">
                  <h3 className="text-2xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {project.projectName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2">
                    {project.category && (
                      <span className="text-[10px] px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                    )}
                    {project.status && (
                      <span
                        title={isTesting(project) ? 'Join the testing group first' : undefined}
                        className="inline-flex max-w-full items-center gap-1 text-[10px] px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-bold uppercase tracking-wider"
                      >
                        {project.status.replaceAll('-', ' ')}
                        {isTesting(project) && <CircleAlert className="w-3 h-3 shrink-0" aria-hidden="true" />}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 break-words text-base leading-relaxed line-clamp-2">
                    {project.projectDescription}
                  </p>

                  <span className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-sm font-medium text-primary">
                    View Project
                    <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1" aria-hidden="true" />
                  </span>
                </div>
              </TiltSurface>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No projects found.</div>
        )}
      </div>
    </section>
  );
}
