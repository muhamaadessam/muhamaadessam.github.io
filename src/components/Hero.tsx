'use client';

import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { PortfolioData, incrementCvDownloadCount, trackPortfolioEvent } from '@/lib/services';
import Image from 'next/image';

export default function Hero({ data }: { data: PortfolioData | null }) {
  const handleDownloadCV = () => {
    incrementCvDownloadCount();
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-bg pt-20">
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

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left Content (Text) */}
        <motion.div
          className="flex-1 text-center lg:text-left order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-5 tracking-tight leading-[1.08]">
            {data?.name || 'Muhammad Essam'}
            <span className="text-primary block mt-3">Flutter Developer</span>
          </h1>

          <p className="text-gray-300 mb-6 max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed">
            Flutter Developer with 3+ years of experience building and shipping production mobile applications for Android and iOS.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
            {['Flutter', 'Dart', 'BLoC', 'Clean Architecture', 'Firebase', 'REST APIs', 'Production Apps'].map((keyword) => (
              <span key={keyword} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                {keyword}
              </span>
            ))}
          </div>

          <p className="text-sm md:text-base text-primary mb-10 font-semibold">
            3+ Years Experience <span className="text-gray-500">|</span> Production Apps <span className="text-gray-500">|</span> Android &amp; iOS
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start flex-wrap">
            <a
              href="#projects"
              className="px-8 py-4 bg-primary text-white font-medium rounded-2xl hover:bg-primary-dark hover:scale-105 transition-all flex items-center justify-center gap-4 w-full sm:w-auto min-w-[200px]"
            >
              <span className="whitespace-nowrap">View Production Apps</span>
              <ChevronRight className="w-5 h-5" />
            </a>

            <a
              href="#contact"
              className="px-8 py-4 bg-dark-card text-white font-medium rounded-2xl hover:bg-gray-700 hover:scale-105 transition-all flex items-center justify-center gap-4 border border-white/5 w-full sm:w-auto min-w-[200px]"
            >
              <span className="whitespace-nowrap">Contact Me</span>
            </a>

            <a
              href="https://drive.google.com/uc?export=download&id=11R3XbF-0bTpnFe4wCdOYy9Qgw4ISQKEc"
              target="_blank"
              rel="noreferrer"
              onClick={handleDownloadCV}
              className="px-8 py-4 bg-dark-card text-white font-medium rounded-2xl hover:bg-gray-700 hover:scale-105 transition-all flex items-center justify-center gap-4 border border-white/5 w-full sm:w-auto min-w-[200px]"
            >
              <FileText className="w-5 h-5 text-gray-300" />
              <span className="whitespace-nowrap">Download CV</span>
            </a>

            <a
              href={data?.linkedin || "https://www.linkedin.com/in/muhammadessam159/"}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackPortfolioEvent('external_link_click', 'linkedin')}
              className="px-8 py-4 bg-dark-card text-white font-medium rounded-2xl hover:bg-gray-700 hover:scale-105 transition-all flex items-center justify-center gap-4 border border-white/5 w-full sm:w-auto min-w-[200px]"
            >
              <FaLinkedin className="w-5 h-5 text-white" />
              <span className="whitespace-nowrap">LinkedIn</span>
            </a>

            <a
              href={data?.github || "https://github.com/muhamaadessam"}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackPortfolioEvent('external_link_click', 'github')}
              aria-label="View Muhammad Essam's GitHub profile"
              className="px-5 py-4 text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-3"
            >
              <FaGithub className="w-6 h-6" />
              <span>GitHub</span>
            </a>
          </div>
        </motion.div>

        {/* Right Content - Image */}
        <motion.div
          className="flex-1 flex justify-center items-center order-2 mt-4 lg:mt-0 mb-12 lg:mb-0 w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-60 h-60 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
            {/* Simple Glow Blob Behind */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-30 blur-2xl rounded-full" />

            {/* Image Container */}
            <div className="relative w-[85%] h-[85%] overflow-hidden border-4 border-primary/30 shadow-[0_0_30px_rgba(66,165,245,0.2)] glass rounded-full z-10 hover:border-primary/60 transition-colors duration-300">
              <Image
                src="/profilePic.webp"
                alt={data?.name || 'Muhammad Essam'}
                fill
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 250px, 320px"
                priority
                className="object-cover object-top pt-[10px]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
