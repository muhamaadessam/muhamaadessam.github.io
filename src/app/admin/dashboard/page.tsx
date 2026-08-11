'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import ProjectsManager from '@/components/admin/ProjectsManager';
import SkillsManager from '@/components/admin/SkillsManager';
import ExperienceManager from '@/components/admin/ExperienceManager';
import MessageManager from '@/components/admin/MessageManager';
import TelegramLogManager from '@/components/admin/TelegramLogManager';
import { getPortfolioStats, PortfolioStats } from '@/lib/adminServices';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'telegram' | 'projects' | 'skills' | 'experience' | 'messages'>('analytics');
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/admin');
      } else {
        setLoading(false);
        setStatsLoading(true);
        const portfolioStats = await getPortfolioStats();
        if (mounted) {
          setStats(portfolioStats);
          setStatsLoading(false);
        }
      }
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Verifying Access...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Manage Projects
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'telegram' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Telegram Data
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'skills' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Manage Skills
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'experience' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Manage Experience
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'messages' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Messages
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline px-4 py-2"
        >
          Logout
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'analytics' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Portfolio Analytics</h2>
                <p className="text-gray-400 text-sm mt-1">Visitors, CV downloads, and tracked interactions.</p>
              </div>
              {statsLoading && <span className="text-sm text-gray-400">Loading...</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                ['Unique visitors', stats?.totalVisitors || 0],
                ['Total visits', stats?.totalVisits || 0],
                ['CV downloads', stats?.cvDownloads || 0],
                ['Page views', stats?.events.page_view || 0],
              ].map(([label, value]) => (
                <div key={label} className="glass rounded-2xl p-5 border border-white/10">
                  <p className="text-sm text-gray-400">{label}</p>
                  <p className="text-3xl font-bold text-primary mt-2">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-lg mb-4">All tracked events</h3>
                <div className="space-y-3 max-h-80 overflow-auto">
                  {Object.entries(stats?.events || {}).sort(([, a], [, b]) => b - a).map(([event, count]) => (
                    <div key={event} className="flex justify-between gap-4 border-b border-white/10 pb-2">
                      <span className="text-gray-300 break-all">{event.replaceAll('_', ' ')}</span>
                      <span className="font-bold text-primary">{count}</span>
                    </div>
                  ))}
                  {!statsLoading && !Object.keys(stats?.events || {}).length && <p className="text-gray-500">No events yet.</p>}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-lg mb-4">Visitors</h3>
                <div className="overflow-auto max-h-80">
                  <table className="w-full text-sm">
                    <thead className="text-gray-400 text-left">
                      <tr><th className="pb-3">Visitor</th><th className="pb-3 text-right">Visits</th></tr>
                    </thead>
                    <tbody>
                      {(stats?.visitors || []).map((visitor) => {
                        const date = new Date(Number(visitor.id));
                        const label = Number.isNaN(date.getTime()) ? visitor.id : date.toLocaleString();
                        return (
                          <tr key={visitor.id} className="border-t border-white/10">
                            <td className="py-3 text-gray-300">{label}</td>
                            <td className="py-3 text-right font-bold text-primary">{visitor.visits}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {!statsLoading && !stats?.visitors.length && <p className="text-gray-500">No visitors yet.</p>}
                </div>
              </div>
            </div>
          </section>
        )}
        {activeTab === 'telegram' && <TelegramLogManager />}
        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'skills' && <SkillsManager />}
        {activeTab === 'experience' && <ExperienceManager />}
        {activeTab === 'messages' && <MessageManager />}
      </div>
    </div>
  );
}
