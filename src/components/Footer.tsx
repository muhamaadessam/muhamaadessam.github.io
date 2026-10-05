'use client';

import Link from 'next/link';
import { PortfolioData } from '@/lib/services';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { Mail, Phone } from 'lucide-react';
import { GITHUB_URL, LINKEDIN_URL } from '@/lib/constants';

export default function Footer({ data }: { data: PortfolioData | null }) {
  const currentYear = new Date().getFullYear();
  const github = data?.github || GITHUB_URL;
  const linkedin = data?.linkedin || LINKEDIN_URL;

  return (
    <footer className="relative mt-auto pt-16 pb-8 overflow-hidden bg-dark-bg border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/5 rounded-[100%] blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand/About */}
          <div className="flex flex-col items-center md:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/essamLogoWithText.webp" alt="M.Essam" className="h-12 object-contain mb-4" />
            <p className="text-gray-400 text-center md:text-left text-sm max-w-xs">
              {data?.objective || 'Flutter Developer building production-ready Android and iOS apps with Flutter, Dart, BLoC, and Firebase.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/#about" className="hover:text-primary transition-colors">About Me</Link></li>
              <li><Link href="/#projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/#experience" className="hover:text-primary transition-colors">Experience</Link></li>
              <li><Link href="/#skills" className="hover:text-primary transition-colors">Skills</Link></li>
              <li><Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link></li>
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
                <li className="flex items-center gap-3">
                  <a href={`tel:${data.phone}`} aria-label={`Call ${data.phone}`} className="flex items-center gap-3 hover:text-primary transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                    </div>
                    <span>{data.phone}</span>
                  </a>
                  <a href={`https://api.whatsapp.com/send/?phone=${data.phone.replace('+', '')}&text&type=phone_number&app_absent=0`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#25D366]/20 transition-colors group">
                    <FaWhatsapp className="w-4 h-4 text-gray-300 group-hover:text-[#25D366]" />
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
            <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub profile" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/50 transition-all hover:-translate-y-1">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/50 transition-all hover:-translate-y-1">
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
