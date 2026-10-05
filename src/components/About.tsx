'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  const highlights = [
    'Ships production apps to Google Play & the App Store',
    'Owns features end-to-end, from UI to API integration',
    'Scalable state management with BLoC',
    'Maintainable code with Clean Architecture',
    'Firebase & REST API integration',
  ];

  return (
    <section 
      id="about" 
      className="py-24 relative bg-dark-bg md:bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/about_bg.webp")' }}
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
          <h3 className="text-2xl font-semibold mb-6 text-white">
            Building mobile apps people <span className="text-primary">actually use</span>
          </h3>
          <div className="space-y-4 text-gray-300 leading-relaxed mb-10">
            <p>
              I&apos;m a Flutter developer who turns product ideas into fast, reliable Android and iOS apps. Over the past 3+ years I&apos;ve worked on production applications from the first screen to the store release, taking care of UI, state management, API integration, and the details that make an app feel polished.
            </p>
            <p>
              I care about code that stays easy to change as a product grows, which is why I build with BLoC and Clean Architecture, and I enjoy working closely with designers and backend engineers to ship features on time.
            </p>
          </div>

          <h4 className="text-xl font-medium mb-4 text-primary">What I bring</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
