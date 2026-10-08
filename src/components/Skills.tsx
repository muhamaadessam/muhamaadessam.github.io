'use client';

import { motion } from 'framer-motion';
import { Skill } from '@/lib/services';

export default function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section 
      id="skills" 
      className="py-24 relative bg-dark-bg md:bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/skills_bg.webp")' }}
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
          <h2 className="text-3xl md:text-5xl font-bold mb-4">My Skills</h2>
          <div className="h-0.5 w-16 bg-primary rounded-full" />
        </motion.div>

        {skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skillGroup) => (
              <section key={skillGroup.id} className="skill-group rounded-2xl bg-dark-card/40 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-5">{skillGroup.title}</h3>
                <div className="flex flex-wrap gap-2.5">
                  {skillGroup.skills.map((skill, index) => (
                    <motion.span key={skill} initial={{ y: 16 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.06 }} className="skill-tag px-3 py-2 border border-white/10 rounded-lg text-sm text-gray-200">
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No skills found.</div>
        )}
      </div>
    </section>
  );
}
