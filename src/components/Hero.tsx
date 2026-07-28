'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { getPortfolioData, PortfolioData, incrementCvDownloadCount } from '@/lib/services';
import Image from 'next/image';

export default function Hero() {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    getPortfolioData().then(res => setData(res));
  }, []);

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
          backgroundImage: 'url("/logos/essamLogoBorder.png")',
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
          className="flex-1 text-center lg:text-left order-2 lg:order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-5 py-2 rounded-full mb-8 border border-primary">
            <span className="text-primary font-semibold tracking-wider text-xs uppercase">Welcome to my portfolio</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Hi, I&apos;m <br />
            <span className="text-primary block mt-2">
              {data?.name ? data.name.split(' ')[0] : 'Muhammad'}
            </span>
            <span className="text-primary block">
              {data?.name ? data.name.split(' ').slice(1).join(' ') : 'Essam'}
            </span>
          </h1>

          <h2 className="text-3xl md:text-4xl text-gray-400 font-normal mb-8">
            {data?.jop_title || 'Flutter Developer'}
          </h2>

          <p className="text-gray-400 mb-12 max-w-lg mx-auto lg:mx-0 text-lg leading-relaxed font-light">
            {data?.objective || 'Building beautiful, scalable, and high-performance applications.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start flex-wrap">
            <a
              href="#projects"
              className="px-8 py-4 bg-primary text-white font-medium rounded-2xl hover:bg-primary-dark hover:scale-105 transition-all flex items-center justify-center gap-4 w-full sm:w-auto min-w-[200px]"
            >
              <span className="whitespace-nowrap">View My Work</span>
              <ChevronRight className="w-5 h-5" />
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
              className="px-8 py-4 bg-dark-card text-white font-medium rounded-2xl hover:bg-gray-700 hover:scale-105 transition-all flex items-center justify-center gap-4 border border-white/5 w-full sm:w-auto min-w-[200px]"
            >
              <FaLinkedin className="w-5 h-5 text-white" />
              <span className="whitespace-nowrap">LinkedIn</span>
            </a>
          </div>
        </motion.div>

        {/* Right Content - Image */}
        <motion.div
          className="flex-1 flex justify-center items-center order-1 lg:order-2 mt-20 lg:mt-0 mb-12 lg:mb-0 w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
            {/* Animated Glow Blob Behind */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-40 blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 90, 180, 270, 360],
                borderRadius: [
                  "60% 40% 30% 70% / 60% 30% 70% 40%",
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                  "50% 50% 20% 80% / 25% 80% 20% 75%",
                  "60% 40% 30% 70% / 60% 30% 70% 40%",
                ]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Morphing Gelatinous Image Container */}
            <motion.div
              className="relative w-[95%] h-[95%] overflow-hidden border-4 border-primary/50 shadow-[0_0_40px_rgba(66,165,245,0.4)] glass z-10"
              animate={{
                borderRadius: [
                  "40% 60% 70% 30% / 40% 50% 60% 50%",
                  "70% 30% 50% 50% / 30% 30% 70% 70%",
                  "30% 70% 70% 30% / 50% 60% 30% 60%",
                  "40% 60% 70% 30% / 40% 50% 60% 50%",
                ],
                y: [-10, 10, -10]
              }}
              transition={{
                borderRadius: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Image
                src="/profilePic.webp"
                alt={data?.name || 'Muhammad Essam'}
                fill
                sizes="(max-width: 640px) 274px, (max-width: 1024px) 304px, 365px"
                preload
                className="object-cover object-top pt-[10px]"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
