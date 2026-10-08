'use client';

import { FileText, ChevronRight, ArrowDown } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import TiltSurface from '@/components/TiltSurface';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { PortfolioData, incrementCvDownloadCount, trackPortfolioEvent } from '@/lib/services';
import Image from 'next/image';
import { CV_DOWNLOAD_URL, GITHUB_URL, LINKEDIN_URL } from '@/lib/constants';

export default function Hero({ data }: { data: PortfolioData | null }) {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const portraitRotate = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const backdropX = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const handleDownloadCV = () => {
    incrementCvDownloadCount();
  };

  return (
    <section ref={section} className="hero-scene min-h-svh flex items-center justify-center relative overflow-hidden bg-dark-bg pt-28 pb-48 lg:pb-24 lg:pt-32">
      {/* Tech Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Floating Logo Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'url("/logos/essamLogoBorder.webp")',
          backgroundSize: '150px 150px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          transform: 'rotate(-5deg) scale(1.2)',
        }}
      ></div>

      {/* Gradients to fade edges */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-dark-bg via-transparent to-dark-bg pointer-events-none"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-dark-bg via-transparent to-dark-bg pointer-events-none"></div>
      <motion.div aria-hidden="true" className="hero-wordmark" style={{ x: reducedMotion ? 0 : backdropX }}>ESSAM</motion.div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left Content (Text) */}
        {/* Rendered visible in the server HTML: this block holds the LCP element, so it must not wait for JS to fade in. */}
        <motion.div className="flex-1 min-w-0 text-center lg:text-left order-1" style={{ y: reducedMotion ? 0 : textY }}>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-5 tracking-tight leading-[1.08]">
            <span className="hero-line"><span className="hero-name block">{data?.name || 'Muhammad Essam'}</span></span>
            <span className="hero-line mt-3"><span className="hero-title text-primary block">{data?.jop_title?.trim() || 'Flutter Developer'}</span></span>
          </h1>

          <p className="hero-description text-gray-300 mb-6 max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed">
            Flutter Developer with 3+ years of experience building and shipping production mobile applications for Android and iOS.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {['Flutter', 'Dart', 'BLoC', 'Clean Architecture', 'Firebase', 'REST APIs'].map((keyword) => (
              <span key={keyword} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                {keyword}
              </span>
            ))}
          </div>

          <div className="hero-actions flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start flex-wrap mt-10">
            <a
              href="#projects"
              className="hero-button group px-8 py-4 bg-primary text-white font-medium rounded-2xl hover:bg-primary-dark flex items-center justify-center gap-4 w-full sm:w-auto min-w-[200px]"
            >
              <span className="whitespace-nowrap">View Projects</span>
              <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
            </a>

            <a
              href={CV_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
              onClick={handleDownloadCV}
              className="hero-button px-8 py-4 bg-dark-card text-white font-medium rounded-2xl hover:bg-gray-700 flex items-center justify-center gap-4 border border-white/5 w-full sm:w-auto min-w-[200px]"
            >
              <FileText className="w-5 h-5 text-gray-300" />
              <span className="whitespace-nowrap">Download CV</span>
            </a>

            <div className="flex items-center gap-3">
              <a
                href={data?.linkedin || LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackPortfolioEvent('external_link_click', 'linkedin')}
                aria-label="View Muhammad Essam's LinkedIn profile"
                className="w-14 h-14 rounded-2xl bg-dark-card border border-white/5 text-gray-300 hover:text-white hover:border-primary/50 transition-colors flex items-center justify-center"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a
                href={data?.github || GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackPortfolioEvent('external_link_click', 'github')}
                aria-label="View Muhammad Essam's GitHub profile"
                className="w-14 h-14 rounded-2xl bg-dark-card border border-white/5 text-gray-300 hover:text-white hover:border-primary/50 transition-colors flex items-center justify-center"
              >
                <FaGithub className="w-6 h-6" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Image */}
        <motion.div className="flex-1 min-w-0 flex justify-center items-center order-2 mt-4 lg:mt-0 w-full" style={{ y: reducedMotion ? 0 : portraitY, rotate: reducedMotion ? 0 : portraitRotate }}>
          <TiltSurface className="hero-portrait portrait-stage relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <svg className="portrait-frame absolute inset-0 w-full h-full text-primary pointer-events-none" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.3" />
              <circle className="portrait-stroke" cx="50" cy="50" r="48" pathLength="1" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
              <circle cx="50" cy="50" r="43" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.3" strokeDasharray="1 3" />
            </svg>
            {/* Simple Glow Blob Behind */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-30 blur-2xl rounded-full" />

            {/* Image Container */}
            <div className="portrait-photo relative w-[85%] h-[85%] overflow-hidden border-4 border-primary/30 shadow-[0_0_30px_rgba(66,165,245,0.2)] glass rounded-full z-10 hover:border-primary/60 transition-colors duration-300">
              <Image
                src="/profilePic.webp"
                alt={data?.name || 'Muhammad Essam'}
                fill
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 250px, 320px"
                priority
                className="object-cover object-top pt-[10px]"
              />
            </div>
            <span className="portrait-chip chip-flutter" aria-hidden="true">Flutter <span>↗</span></span>
            <span className="portrait-chip chip-dart" aria-hidden="true">Dart <span>{'{ }'}</span></span>
            <span className="portrait-chip chip-bloc" aria-hidden="true">BLoC <span>⌘</span></span>
          </TiltSurface>
        </motion.div>
      </div>
      <a href="#about" className="hero-scroll absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-3 text-xs text-gray-300">
        <span className="scroll-track"><ArrowDown size={14} /></span> Scroll to explore
      </a>
    </section>
  );
}
