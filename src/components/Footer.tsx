'use client';

import { PortfolioData } from '@/lib/services';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { Mail, Phone } from 'lucide-react';

export default function Footer({ data }: { data: PortfolioData | null }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto pt-16 pb-8 overflow-hidden bg-dark-bg border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/5 rounded-[100%] blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand/About */}
          <div className="flex flex-col items-center md:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/essamLogoWithText.png" alt="M.Essam" className="h-12 object-contain mb-4" />
            <p className="text-gray-400 text-center md:text-left text-sm max-w-xs">
              {data?.objective || 'Building beautiful, scalable, and high-performance applications. Creating digital experiences that leave a lasting impact.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-primary transition-colors">About Me</a></li>
              <li><a href="#skills" className="hover:text-primary transition-colors">My Skills</a></li>
              <li><a href="#projects" className="hover:text-primary transition-colors">Projects</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              {data?.email && (
                <li>
                  <a href={`mailto:${data.email}`} className="flex items-center gap-3 hover:text-primary transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                    </div>
                    <span>{data.email}</span>
                  </a>
                </li>
              )}
              {data?.phone && (
                <li>
                  <a href={`https://api.whatsapp.com/send/?phone=${data.phone.replace('+', '')}&text&type=phone_number&app_absent=0`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                      <FaWhatsapp className="w-4 h-4 text-gray-300 group-hover:text-[#25D366]" />
                    </div>
                    <span>{data.phone}</span>
                  </a>
                </li>
              )}
              {data?.phone && (
                <li>
                  <a href={`tel:${data.phone}`} className="flex items-center gap-3 hover:text-primary transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                    </div>
                    <span>{data.phone}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} {data?.name || 'Muhammad Essam'}. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {data?.github && (
              <a href={data.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/50 transition-all hover:-translate-y-1">
                <FaGithub className="w-5 h-5" />
              </a>
            )}
            {data?.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/50 transition-all hover:-translate-y-1">
                <FaLinkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
