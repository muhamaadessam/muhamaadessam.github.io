'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioData, Project, trackProjectEvent } from '@/lib/services';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Code2, Database, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import TiltSurface from '@/components/TiltSurface';

export default function ProjectDetailsClient({ project, projectId, portfolio }: { project: Project | null; projectId: string; portfolio: PortfolioData | null }) {
  const router = useRouter();
  
  // Lightbox state
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(null);
  const screenshotCount = project?.screenshots?.length ?? 0;

  // Handle escape key for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedScreenshotIndex(null);
      if (e.key === 'ArrowLeft' && screenshotCount) {
        setSelectedScreenshotIndex((index) => index === null ? null : (index - 1 + screenshotCount) % screenshotCount);
      }
      if (e.key === 'ArrowRight' && screenshotCount) {
        setSelectedScreenshotIndex((index) => index === null ? null : (index + 1) % screenshotCount);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenshotCount]);

  const handleNextScreenshot = () => {
    if (!screenshotCount) return;
    setSelectedScreenshotIndex(prev => 
      prev !== null ? (prev + 1) % screenshotCount : null
    );
  };

  const handlePrevScreenshot = () => {
    if (!screenshotCount) return;
    setSelectedScreenshotIndex(prev => 
      prev !== null ? (prev - 1 + screenshotCount) % screenshotCount : null
    );
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B0C10] text-white relative overflow-hidden flex flex-col justify-center items-center">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 mt-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Background glowing text */}
            <h1 className="text-5xl md:text-7xl font-black mb-2 text-red-400">
              Project Not Found
            </h1>
            
            <div className="absolute -top-12 -left-12 text-red-500/20 rotate-[-15deg] blur-[2px]">
              <Database className="w-32 h-32" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass p-8 rounded-3xl border border-red-500/20 shadow-2xl shadow-red-500/10 mt-8 max-w-lg w-full relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
            
            <p className="text-xl text-gray-300 mb-6 font-light">
              This project couldn&apos;t be found. It may have been moved or removed.
            </p>
            <p className="sr-only">Requested project: {projectId}</p>

            <button 
              onClick={() => router.push('/#projects')} 
              className="group relative w-full inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-red-500/10 border border-red-500/30 rounded-xl overflow-hidden hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:border-red-500/50"
            >
              <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 bg-gradient-to-r from-red-500 to-primary transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Projects</span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const hasScreenshots = project.screenshots && project.screenshots.length > 0;

  return (
    <>
      <main className="min-h-screen bg-dark-bg text-white pb-32">
      
        {/* Premium Dynamic Background */}
        <div className="absolute top-0 inset-x-0 h-[70vh] z-0 overflow-hidden">
          {project.projectImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={project.projectImage} 
              alt={`${project.projectName} preview background`} 
              className="w-full h-full object-cover blur-[120px] opacity-40 scale-125 translate-y-[-10%]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/40 via-dark-bg/80 to-dark-bg"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        </div>

        <div className="project-detail container max-w-6xl mx-auto px-6 relative z-10 pt-12 md:pt-16">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-gray-300 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to projects
          </Link>

          <header className="project-intro mb-8 md:mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-medium">
              {project.category && <span className="text-primary">{project.category}</span>}
              {project.status && <span className="rounded-full border border-white/15 px-3 py-1 text-gray-300">{project.status.replaceAll('-', ' ')}</span>}
            </div>
            <h1 className="detail-title text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.15] break-words">
              <span>{project.projectName}</span>
            </h1>
          </header>

          <div className="project-summary grid grid-cols-1 md:grid-cols-12 items-center gap-8 lg:gap-12 border-y border-white/10 py-8 md:py-10 mb-12 md:mb-16">
            {project.projectImage && (
              <motion.div
                initial={{ scale: 0.92, rotateY: -16 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:col-span-5 min-w-0 [perspective:1200px]"
              >
                <TiltSurface className="rounded-2xl overflow-hidden border border-white/15 bg-dark-card shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.projectImage} alt={project.projectName} loading="eager" className="block w-full h-80 lg:h-96 object-cover" />
                </TiltSurface>
              </motion.div>
            )}
            <div className={`${project.projectImage ? 'md:col-span-7' : 'md:col-span-12'} min-w-0`}>
              <h2 className="detail-heading">Overview</h2>
              <p className="detail-copy text-lg leading-relaxed text-gray-200 max-w-[60ch]">
                {project.overview || project.projectDescription}
              </p>
            </div>
            {(project.status?.toLowerCase() === 'testing' || Boolean(project.links?.length)) && (
            <div className="project-actions md:col-span-12 flex flex-col gap-5 border-t border-white/10 pt-6">
                {project.status?.toLowerCase() === 'testing' && (
                  <div className="max-w-[75ch]">
                    <p className="text-blue-200 text-sm leading-relaxed">
                      <strong>Note:</strong> This application is currently available through Google Play Closed Testing. 
                      Join the tester group first using the button below, then you can access the Play Store installation link.
                    </p>
                  </div>
                )}

              <div className="flex flex-wrap items-center gap-3">
                {project.status?.toLowerCase() === 'testing' && project.testingGroupLink?.startsWith('https://') && (
                  <a
                    href={project.testingGroupLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackProjectEvent('external_link_click', project.id, project.projectName || project.id, 'Join Testing Group')}
                    className="px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 hover:-translate-y-1 shadow-lg bg-blue-500 text-white hover:bg-blue-400"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Join Testing Group
                  </a>
                )}
                {project.links && project.links.map((lnk, i) => (
                  <a 
                    key={i}
                    href={lnk.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={() => trackProjectEvent('external_link_click', project.id, project.projectName || project.id, lnk.title || 'Visit Project')}
                    className={`px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 hover:-translate-y-1 shadow-lg ${i === 0 ? 'bg-primary text-dark-bg hover:bg-primary-dark hover:shadow-primary/30' : 'glass text-white border border-white/10 hover:border-primary/50 hover:bg-white/5'}`}
                  >
                    {lnk.title?.toLowerCase().includes('github') || lnk.title?.toLowerCase().includes('source') ? (
                      <Code2 className="w-5 h-5" />
                    ) : (
                      <ExternalLink className="w-5 h-5" />
                    )}
                    {lnk.title || 'Visit Project'}
                  </a>
                ))}
              </div>

            </div>
            )}
          </div>

          {(project.challenge || project.solution) && (
            <div className={`grid grid-cols-1 ${project.challenge && project.solution ? 'md:grid-cols-2' : ''} gap-8 lg:gap-12 mb-12 md:mb-16`}>
              {project.challenge && <section className="detail-section min-w-0"><h2 className="detail-heading">Challenge</h2><p className="detail-copy">{project.challenge}</p></section>}
              {project.solution && <section className="detail-section min-w-0"><h2 className="detail-heading">Solution</h2><p className="detail-copy">{project.solution}</p></section>}
            </div>
          )}

          <div className={`project-story grid grid-cols-1 ${project.techStack?.length ? 'md:grid-cols-2' : ''} gap-10 lg:gap-16 mb-12 md:mb-16`}>
            <section className="detail-section min-w-0">
              <h2 className="detail-heading">My Role</h2>
              <p className="text-primary font-medium text-lg mb-5">{project.myRole || 'Flutter Developer'}</p>
              <ul className="detail-list space-y-3 list-disc pl-5 marker:text-primary">
                {project.myContribution?.map((contribution, index) => <li key={index}>{contribution}</li>)}
              </ul>
            </section>
            {project.techStack && project.techStack.length > 0 && (
              <section className="detail-section min-w-0">
                <h2 className="detail-heading">Technical Implementation</h2>
                <div className="flex flex-wrap gap-2.5">
                  {project.techStack.map((tech, index) => (
                    <motion.span key={tech} initial={{ y: 12 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.06 }} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm leading-relaxed text-gray-200 break-words max-w-full">
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {project.keyFeaturesAndBenefits && project.keyFeaturesAndBenefits.length > 0 && (
            <section className="detail-section border-t border-white/10 pt-8 mb-12 md:mb-16">
              <h2 className="detail-heading">Features</h2>
              <ul className="detail-list grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-3 list-disc pl-5 marker:text-primary">
                {project.keyFeaturesAndBenefits.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>
            </section>
          )}

          {/* Screenshots Section */}
          {hasScreenshots && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            
              <div className="pt-10 mb-8">
                <h2 className="detail-heading">Project Gallery</h2>
                <p className="detail-copy text-gray-300 max-w-2xl">A closer look at the interfaces and features built for this project.</p>
              </div>
            
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {project.screenshots!.map((shot, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % 4) * 0.08, duration: 0.6 }}
                    onClick={() => setSelectedScreenshotIndex(index)}
                    className="group relative rounded-2xl overflow-hidden glass aspect-[9/16] cursor-pointer border border-white/10 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(102,252,241,0.2)] hover:-translate-y-2 bg-black/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={shot} 
                      alt={`${project.projectName} screenshot ${index + 1}`} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <span className="text-white font-medium text-sm glass px-4 py-1.5 rounded-full border border-white/20">
                        View Full
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Fullscreen Lightbox Overlay */}
        <AnimatePresence>
          {selectedScreenshotIndex !== null && project?.screenshots && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScreenshotIndex(null)}
              role="dialog"
              aria-modal="true"
              aria-label={`${project.projectName} screenshots`}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            >
              <button 
                onClick={() => setSelectedScreenshotIndex(null)}
                aria-label="Close gallery"
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-red-500/80 hover:text-white text-white rounded-full transition-all duration-300 z-50 border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); handlePrevScreenshot(); }}
                aria-label="Previous screenshot"
                className="absolute left-4 md:left-12 p-3 bg-white/10 hover:bg-primary/80 hover:text-dark-bg text-gray-300 rounded-full transition-all duration-300 z-50 border border-white/10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <motion.div 
                key={selectedScreenshotIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90vh] max-w-[90vw] md:max-w-[80vw]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={project.screenshots[selectedScreenshotIndex]} 
                  alt={`${project.projectName} screenshot ${selectedScreenshotIndex + 1}`}
                  className="max-h-[90vh] w-auto object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                />
                <div className="absolute -bottom-10 left-0 right-0 text-center text-gray-400 text-sm font-medium">
                  {selectedScreenshotIndex + 1} / {project.screenshots.length}
                </div>
              </motion.div>

              <button 
                onClick={(e) => { e.stopPropagation(); handleNextScreenshot(); }}
                aria-label="Next screenshot"
                className="absolute right-4 md:right-12 p-3 bg-white/10 hover:bg-primary/80 hover:text-dark-bg text-gray-300 rounded-full transition-all duration-300 z-50 border border-white/10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer data={portfolio} />
    </>
  );
}
