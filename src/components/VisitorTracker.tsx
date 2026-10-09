'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { beginAnalyticsPage, sendTracking } from '@/lib/analyticsClient';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.doNotTrack === '1' || pathname.startsWith('/admin')) return;
    let stop: (() => void) | undefined;
    let idle: number | undefined;
    const start = () => {
      beginAnalyticsPage(pathname);
      let visibleSince = document.visibilityState === 'visible' ? performance.now() : null;
      let scrollDepth = 0;
      const seen = new Set<string>();
      const scroll = () => {
        const height = document.documentElement.scrollHeight - innerHeight;
        scrollDepth = Math.max(scrollDepth, height <= 0 ? 100 : Math.min(100, Math.round(scrollY / height * 100)));
      };
      const flush = () => {
        scroll();
        const durationMs = visibleSince === null ? 0 : Math.min(300_000, Math.round(performance.now() - visibleSince));
        visibleSince = null;
        if (!durationMs) return;
        sendTracking('engagement', pathname, { durationMs, scrollDepth }, true);
      };
      const visibility = () => {
        if (document.visibilityState === 'hidden') flush();
        else visibleSince = performance.now();
      };
      const resume = () => { visibleSince = performance.now(); };
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !seen.has(entry.target.id) && document.visibilityState === 'visible') {
            seen.add(entry.target.id);
            sendTracking('section_view', entry.target.id);
          }
        });
      }, { threshold: 0 });
      ['experience', 'projects', 'contact'].forEach(id => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
      scroll();
      window.addEventListener('scroll', scroll, { passive: true });
      window.addEventListener('pagehide', flush);
      window.addEventListener('pageshow', resume);
      document.addEventListener('visibilitychange', visibility);
      const heartbeat = window.setInterval(() => {
        if (visibleSince !== null) { flush(); visibleSince = performance.now(); }
      }, 60_000);
      stop = () => {
        flush();
        clearInterval(heartbeat);
        observer.disconnect();
        window.removeEventListener('scroll', scroll);
        window.removeEventListener('pagehide', flush);
        window.removeEventListener('pageshow', resume);
        document.removeEventListener('visibilitychange', visibility);
      };
    };
    const schedule = () => {
      const requestIdle = window.requestIdleCallback;
      if (typeof requestIdle === 'function') idle = requestIdle(start, { timeout: 1500 });
      else idle = window.setTimeout(start, 0);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      if (idle !== undefined) {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(idle);
        else clearTimeout(idle);
      }
      stop?.();
    };
  }, [pathname]);

  return null;
}
