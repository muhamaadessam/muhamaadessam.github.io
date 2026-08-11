'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, trackProjectEvent } from '@/lib/services';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Code2, LayoutDashboard, Sparkles, Database, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';

export default function ProjectDetailsClient({ project, projectId }: { project: Project | null; projectId: string }) {
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
            <h1 className="text-6xl md:text-8xl font-black mb-2 text-red-400">
              DATA NOT FOUND
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
              The project document you are querying does not exist in the database.
            </p>
            
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 mb-8 font-mono text-sm text-left flex flex-col gap-2">
              <span className="text-red-400">&gt; Query failed for ID:</span>
              <span className="text-primary break-all pl-4">{projectId}</span>
            </div>

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
    <main className="min-h-screen bg-dark-bg text-white pb-32">
      <Header />
      
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

      <div className="container mx-auto px-6 relative z-10 pt-36">
        
        {/* Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-32">
          
          {/* Text content - Order 2 on mobile, Order 1 on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 glass text-primary border border-primary/30 rounded-full text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(102,252,241,0.2)]">
                <Sparkles className="w-4 h-4" />
                {project.category}
              </span>
              {project.status && (
                <span className="inline-flex items-center px-4 py-1.5 glass text-blue-400 border border-blue-500/30 rounded-full text-sm font-bold uppercase tracking-widest">
                  {project.status.replaceAll('-', ' ')}
                </span>
              )}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
              {project.projectName}
            </h1>
            
            <div className="glass p-8 rounded-2xl border-white/5 shadow-xl mb-10 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/> Overview</h2>
                <p className="text-lg text-gray-300 leading-relaxed font-light">
                  {project.overview || project.projectDescription}
                </p>
              </div>
              
              {project.challenge && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Challenge</h2>
                  <p className="text-lg text-gray-300 leading-relaxed font-light">{project.challenge}</p>
                </div>
              )}
              
              {project.solution && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Solution</h2>
                  <p className="text-lg text-gray-300 leading-relaxed font-light">{project.solution}</p>
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">My Role</h2>
                <p className="text-lg text-gray-300 leading-relaxed font-medium mb-3 text-primary">
                  {project.myRole || 'Flutter Developer'}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 font-light text-lg">
                  {project.myContribution?.map((cont, idx) => (
                    <li key={idx}>{cont}</li>
                  ))}
                </ul>
              </div>
            </div>

              {project.status?.toLowerCase() === 'testing' && (
                <div className="mb-8 p-4 glass border border-blue-500/30 rounded-xl bg-blue-500/5">
                  <p className="text-blue-200 text-sm">
                    <strong>Note:</strong> This application is currently available through Google Play Closed Testing. 
                    Join the tester group first using the button below, then you can access the Play Store installation link.
                  </p>
                </div>
              )}

            <div className="flex flex-wrap items-center gap-4 mb-10">
              {project.status?.toLowerCase() === 'testing' && project.testingGroupLink?.startsWith('https://') && (
                <a
                  href={project.testingGroupLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackProjectEvent('external_link_click', project.id, project.projectName || project.id, 'Join Testing Group')}
                  className="px-8 py-4 font-bold rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg bg-blue-500 text-white hover:bg-blue-400"
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
                  className={`px-8 py-4 font-bold rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg ${i === 0 ? 'bg-primary text-dark-bg hover:bg-primary-dark hover:shadow-primary/30' : 'glass text-white border border-white/10 hover:border-primary/50 hover:bg-white/5'}`}
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

            {project.techStack && project.techStack.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">Technical Implementation</h2>
                <div className="flex flex-wrap gap-2.5">
                  {project.techStack.map((tech, idx) => (
                    <motion.span 
                      key={tech} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + (idx * 0.1) }}
                      className="text-sm px-5 py-2 rounded-full glass border border-white/10 text-gray-200 font-medium hover:border-primary/40 hover:text-primary transition-colors cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {project.keyFeaturesAndBenefits && project.keyFeaturesAndBenefits.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {project.keyFeaturesAndBenefits.map((feature, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (idx * 0.1) }}
                    >
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Image content - Order 1 on mobile, Order 2 on large screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 order-1 lg:order-2 relative perspective-1000"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-accent-light to-accent rounded-[2rem] blur-2xl opacity-10"></div>
            <div className="glass rounded-[2rem] relative overflow-hidden border border-white/20 shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              {project.projectImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={project.projectImage} 
                  alt={project.projectName} 
                  loading="eager"
                  className="w-full h-auto object-cover rounded-xl shadow-inner max-h-[800px]"
                />
              )}
            </div>
          </motion.div>
        </div>

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
            
            <div className="pt-16 mb-12 flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl glass mb-6 border border-primary/20 text-primary">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Project Gallery</h2>
              <p className="text-gray-400 max-w-2xl text-lg font-light">A closer look at the interfaces and features built for this project.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {project.screenshots!.map((shot, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          >
            <button 
              onClick={() => setSelectedScreenshotIndex(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-red-500/80 hover:text-white text-white rounded-full transition-all duration-300 z-50 border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); handlePrevScreenshot(); }}
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
              className="absolute right-4 md:right-12 p-3 bg-white/10 hover:bg-primary/80 hover:text-dark-bg text-gray-300 rounded-full transition-all duration-300 z-50 border border-white/10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
