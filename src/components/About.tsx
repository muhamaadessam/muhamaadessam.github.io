'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FunFacts } from '@/lib/services';

export default function About({ funFacts }: { funFacts: FunFacts | null }) {
  const highlights = [
    '3+ Years Flutter Development',
    'Production Mobile Applications',
    'Android & iOS Delivery',
    'API & Firebase Integration',
    'Clean Architecture Implementation',
  ];

  return (
    <section 
      id="about" 
      className="py-24 relative bg-dark-bg bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/about_bg.png")' }}
    >
      <div className="absolute inset-0 bg-dark-bg/90"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

          <div className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-semibold mb-2 text-white">Flutter Developer for production mobile apps</h3>
                <h4 className="text-primary text-lg mb-6">Mobile Application Engineer</h4>
                <p className="text-gray-300 leading-relaxed mb-8">
                  I specialize in scalable mobile applications using Flutter, Dart, BLoC, Clean Architecture, Firebase, and API integrations. I focus on production-ready delivery: clear architecture, reliable integrations, readable code, and mobile experiences teams can maintain after launch.
                </p>

                <h4 className="text-xl font-medium mb-4 text-primary">Professional Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {highlights.map((highlight) => (
                    <div key={highlight} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
                      {highlight}
                    </div>
                  ))}
                </div>
                
                {funFacts?.facts?.length ? <div className="mt-8">
                    <h4 className="text-xl font-medium mb-4 text-primary">Fun Facts</h4>
                    <ul className="text-gray-400 space-y-2">
                      {funFacts.facts.slice(0, 4).map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                  </div> : null}
              </div>
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <a href="https://github.com/muhamaadessam" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-3 px-4 glass rounded-xl hover:bg-white/10 transition-colors text-white">
                  <FaGithub className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/muhammadessam159/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-3 px-4 glass rounded-xl hover:bg-white/10 transition-colors text-white">
                  <FaLinkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
                <a href="https://drive.google.com/uc?export=download&id=11R3XbF-0bTpnFe4wCdOYy9Qgw4ISQKEc" target="_blank" rel="noreferrer" onClick={() => import('@/lib/services').then(m => m.incrementCvDownloadCount())} className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl transition-colors mt-2">
                  <FileText className="w-5 h-5" />
                  <span>Download CV</span>
                </a>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
