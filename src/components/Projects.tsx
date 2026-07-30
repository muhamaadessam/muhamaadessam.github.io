'use client';

import { motion } from 'framer-motion';
import { CircleAlert, ExternalLink, UsersRound } from 'lucide-react';
import { Project, trackPortfolioEvent } from '@/lib/services';
import { useRouter } from 'next/navigation';

export default function Projects({ projects }: { projects: Project[] }) {
  const router = useRouter();

  return (
    <section 
      id="projects" 
      className="py-24 relative bg-dark-bg bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/projects_bg.webp")' }}
    >
      <div className="absolute inset-0 bg-dark-bg/90"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => {
                  trackPortfolioEvent('project_click', project.id);
                  router.push(`/projects/${project.id}`);
                }}
                className="cursor-pointer glass rounded-2xl overflow-hidden group flex flex-col h-full hover:border-primary/50 hover:shadow-[0_0_25px_rgba(102,252,241,0.15)] transition-all duration-500"
              >
                {project.projectImage && (
                  <div className="w-full h-48 overflow-hidden relative bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={project.projectImage} 
                      alt={project.projectName} 
                      loading={index < 3 ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                      <span className="text-white text-sm font-bold tracking-widest uppercase bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                        Read Case Study
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-grow relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.projectName}</h3>
                    <div className="flex flex-col items-end gap-2">
                      {project.category && (
                        <span className="text-[10px] px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold uppercase tracking-wider">
                          {project.category}
                        </span>
                      )}
                      {project.status && (
                        <span
                          title={project.status === 'testing' ? 'Join the testing group first' : undefined}
                          className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-bold uppercase tracking-wider"
                        >
                          {project.status.replaceAll('-', ' ')}
                          {project.status === 'testing' && <CircleAlert className="w-3 h-3" aria-hidden="true" />}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 mb-6 flex-grow text-sm leading-relaxed line-clamp-3">{project.projectDescription}</p>

                  <div className="mb-5">
                    <span className="text-sm font-semibold text-white mb-2 block">My Contribution:</span>
                    <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                      {project.myContribution?.length ? project.myContribution.slice(0, 4).map((cont, idx) => (
                        <li key={idx} className="line-clamp-1">{cont}</li>
                      )) : (
                        <>
                          <li>Developed Flutter mobile application</li>
                          <li>Implemented BLoC state management</li>
                          <li>Integrated REST APIs</li>
                          <li>Managed production release process</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.slice(0, 4).map(tech => (
                        <span key={tech} className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 font-medium tracking-wide">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-500 font-medium">
                          +{project.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {(project.status === 'testing' && project.testingGroupLink?.startsWith('https://') || project.links?.length > 0) && (
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/10">
                      {project.status === 'testing' && project.testingGroupLink?.startsWith('https://') && (
                        <a
                          href={project.testingGroupLink}
                          target="_blank"
                          rel="noreferrer"
                          title="Join the testing group first"
                          onClick={(e) => {
                            e.stopPropagation();
                            trackPortfolioEvent('external_link_click', project.id);
                          }}
                          className="z-10 relative flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-500 text-[11px] font-bold text-white rounded-full hover:bg-blue-400 transition-colors"
                        >
                          <UsersRound className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Join Testing Group</span>
                        </a>
                      )}
                      {project.links.map((lnk, i) => (
                        <a 
                          key={i}
                          href={lnk.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            trackPortfolioEvent('external_link_click', project.id);
                          }}
                          className="z-10 relative flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-primary text-[11px] font-bold text-gray-300 hover:text-dark-bg rounded-full border border-white/10 hover:border-primary transition-all duration-300 shadow-sm"
                        >
                          <span>{lnk.title || 'Live Demo'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No projects found.</div>
        )}
      </div>
    </section>
  );
}
