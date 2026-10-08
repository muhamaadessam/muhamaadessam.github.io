'use client';

import { motion } from 'framer-motion';
import { Experience as ExperienceType } from '@/lib/services';
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
  
  const yearLabel = `${years} ${years === 1 ? 'yr' : 'yrs'}`;
  const monthLabel = `${months} ${months === 1 ? 'mo' : 'mos'}`;

  if (years === 0) {
    return monthLabel;
  } else if (months === 0) {
    return yearLabel;
  }
  return `${yearLabel} ${monthLabel}`;
}

export default function Experience({ experiences }: { experiences: ExperienceType[] }) {
  return (
    <section 
      id="experience" 
      className="py-24 relative bg-dark-bg md:bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/experience_bg.webp")' }}
    >
      <div className="absolute inset-0 bg-dark-bg/85"></div>
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="section-heading mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Experience</h2>
          <div className="h-0.5 w-16 bg-primary rounded-full" />
        </motion.div>

        {experiences.length > 0 ? (
          <div className="experience-timeline relative pl-7 md:pl-10">
            <span className="timeline-track absolute left-0 top-2 bottom-0 w-px bg-white/15" aria-hidden="true" />
            {experiences.map((exp) => (
              <motion.div 
                key={exp.id} 
                initial={{ x: 24 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6 }}
                className="experience-entry relative group grid grid-cols-1 md:grid-cols-[15rem_1fr] gap-5 md:gap-10 pb-12 mb-10 border-b border-white/10 last:border-0 last:mb-0 last:pb-0"
              >
                <span className="timeline-node" aria-hidden="true" />
                <div>
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

                </div>
                <div className="min-w-0">
                  <ul className="space-y-3 mb-6">
                    {exp.description?.map((point, idx) => (
                      <li key={idx} className="text-gray-300 text-base flex gap-3">
                        <span className="text-primary mt-1">▸</span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {exp.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No experience records found.</div>
        )}
      </div>
    </section>
  );
}
