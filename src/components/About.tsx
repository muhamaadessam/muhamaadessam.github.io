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
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="section-heading mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">About Me</h2>
          <div className="h-0.5 w-16 bg-primary rounded-full" />
        </motion.div>

        <div className="about-composition grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <h3 className="about-statement text-3xl md:text-5xl font-semibold text-white leading-tight tracking-tight max-w-[16ch]">
            Building mobile apps people <span className="about-emphasis text-primary">actually use</span>
          </h3>
          <div className="space-y-5 text-gray-300 text-base md:text-lg leading-relaxed max-w-[65ch]">
            <p>
              I&apos;m a Flutter developer who turns product ideas into fast, reliable Android and iOS apps. Over the past 3+ years I&apos;ve worked on production applications from the first screen to the store release, taking care of UI, state management, API integration, and the details that make an app feel polished.
            </p>
            <p>
              I care about code that stays easy to change as a product grows, which is why I build with BLoC and Clean Architecture, and I enjoy working closely with designers and backend engineers to ship features on time.
            </p>
          </div>

          <div className="lg:col-span-2 border-t border-white/10 pt-8">
          <h4 className="text-xl font-medium mb-6 text-white">What I bring</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {highlights.map((highlight, index) => (
              <motion.li key={highlight} initial={{ y: 16 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 3) * 0.08 }} className="flex items-start gap-3 text-base text-gray-200">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span>{highlight}</span>
              </motion.li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
