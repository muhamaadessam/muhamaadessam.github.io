'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0B0C10] text-white relative overflow-hidden flex flex-col justify-center items-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        
        {/* Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        
        {/* Scanning line effect */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.5)] z-0"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Glitchy 404 Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.h1 
            className="text-[150px] md:text-[250px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/0 select-none"
            animate={{ 
              textShadow: [
                "0 0 0px rgba(239,68,68,0)",
                "0 0 20px rgba(239,68,68,0.8)",
                "0 0 0px rgba(239,68,68,0)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            404
          </motion.h1>
          
          <div className="absolute inset-0 flex items-center justify-center mix-blend-overlay opacity-50">
            <h1 className="text-[150px] md:text-[250px] font-black leading-none tracking-tighter text-red-500 translate-x-2 -translate-y-1">404</h1>
          </div>
          <div className="absolute inset-0 flex items-center justify-center mix-blend-overlay opacity-50">
            <h1 className="text-[150px] md:text-[250px] font-black leading-none tracking-tighter text-primary -translate-x-2 translate-y-1">404</h1>
          </div>
        </motion.div>

        {/* Floating elements around 404 */}
        <motion.div 
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-1/4 -left-12 md:-left-24 glass p-4 rounded-2xl border-red-500/30 text-red-400 rotate-12"
        >
          <AlertTriangle className="w-8 h-8" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Page <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Not Found</span>
          </h2>
          <div className="glass px-6 py-4 rounded-xl border-white/5 mb-10 max-w-lg mx-auto">
            <p className="text-gray-400 text-sm md:text-base">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-primary/20 border border-primary/50 rounded-xl overflow-hidden hover:scale-105 hover:shadow-[0_0_40px_rgba(102,252,241,0.4)]">
            <div className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-primary"></div>
            <div className="relative flex items-center gap-3">
              <Home className="w-5 h-5 text-primary group-hover:animate-bounce" />
              <span>Back to Home</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
