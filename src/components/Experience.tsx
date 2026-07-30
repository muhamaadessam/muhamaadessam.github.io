'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getExperiences, Experience as ExperienceType } from '@/lib/services';
import { ExternalLink } from 'lucide-react';

function formatMonthYear(dateString: string): string {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function calculateDuration(start: string, end: string | null): string {
  if (!start) return '';
  
  const [sYear, sMonth] = start.split('-');
  const startDate = new Date(parseInt(sYear), parseInt(sMonth) - 1);
  
  let endDate: Date;
  if (end) {
    const [eYear, eMonth] = end.split('-');
    endDate = new Date(parseInt(eYear), parseInt(eMonth) - 1);
  } else {
    endDate = new Date();
  }
  
  // +1 month to make it inclusive
  const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0) {
    return `${months} mos`;
  } else if (months === 0) {
    return `${years} yrs`;
  }
  return `${years} yrs ${months} mos`;
}

export default function Experience({ experiences: initialExperiences }: { experiences: ExperienceType[] }) {
  const [experiences, setExperiences] = useState(initialExperiences);

  useEffect(() => {
    getExperiences().then(setExperiences);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section 
      id="experience" 
      className="py-24 relative bg-dark-bg bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/experience_bg.png")' }}
    >
      <div className="absolute inset-0 bg-dark-bg/85"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        {experiences.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8 relative"
          >
            {experiences.map((exp) => (
              <motion.div 
                key={exp.id} 
                variants={itemVariants}
                className="relative group"
              >
                <div className="glass p-6 md:p-8 rounded-2xl transition-all duration-300 hover:border-primary/50 relative shadow-lg">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl md:text-2xl text-white">{exp.title}</h3>
                    <div className="text-primary font-medium text-base md:text-lg mt-1 flex items-center gap-2 flex-wrap">
                      {exp.companyUrl ? (
                        <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors">
                          {exp.company} <ExternalLink className="w-4 h-4 text-primary" />
                        </a>
                      ) : (
                        exp.company
                      )}
                      <span className="text-gray-400 text-sm md:text-base">• {exp.employmentType}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400 mb-4 font-mono">
                    {exp.startDate ? formatMonthYear(exp.startDate) : ''} - {exp.endDate ? formatMonthYear(exp.endDate) : 'Present'} 
                    {exp.startDate && <span className="text-primary/80 ml-2">({calculateDuration(exp.startDate, exp.endDate)})</span>} 
                    <span className="mx-2">•</span> {exp.location}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {exp.description?.map((point, idx) => (
                      <li key={idx} className="text-gray-300 text-sm md:text-base flex gap-3">
                        <span className="text-primary mt-1">▸</span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {exp.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-medium hover:bg-white/10 hover:text-white transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-400">No experience records found.</div>
        )}
      </div>
    </section>
  );
}
