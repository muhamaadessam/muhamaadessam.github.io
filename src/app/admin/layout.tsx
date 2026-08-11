'use client';

import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-dark-bg text-white font-sans">
      <nav className="border-b border-white/10 glass px-4 py-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-base sm:text-xl font-bold text-primary tracking-[0.16em] sm:tracking-widest uppercase">Admin Dashboard</h1>
      </nav>
      <main className="p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
