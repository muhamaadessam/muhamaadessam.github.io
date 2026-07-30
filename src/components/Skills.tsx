'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSkills, Skill } from '@/lib/services';
import { Code2 } from 'lucide-react';

export default function Skills({ skills: initialSkills }: { skills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills);

  useEffect(() => {
    getSkills().then(setSkills);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section 
      id="skills" 
      className="py-24 relative bg-dark-bg bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/skills_bg.png")' }}
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        {skills.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {skills.map((skillGroup) => (
              <motion.div 
                key={skillGroup.id} 
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass p-6 rounded-2xl flex flex-col items-start gap-4 transition-all duration-300 hover:border-primary/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary transition-colors duration-300">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium text-xl text-primary">{skillGroup.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillGroup.skills.map((s, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-400">No skills found.</div>
        )}
      </div>
    </section>
  );
}
