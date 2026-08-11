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

const eventLabels: Record<string, string> = {
  page_view: 'Page views',
  project_click: 'Project opens',
  external_link_click: 'External link clicks',
  cv_download: 'CV downloads',
  contact_submit: 'Contact submissions',
};

function formatEventLabel(event: string): string {
  const base = Object.keys(eventLabels).find((name) => event === name || event.startsWith(`${name}_`));
  if (!base) return event.replaceAll('_', ' ');
  if (event === base) return `${eventLabels[base]} (total)`;
  return `${eventLabels[base]} — ${event.slice(base.length + 1).replaceAll('_', ' ')}`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'telegram' | 'projects' | 'skills' | 'experience' | 'messages'>('analytics');
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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

  const selectedProject = stats?.projectAnalytics.find((project) => project.id === selectedProjectId);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Verifying Access...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto min-w-0">
      <div className="flex flex-col gap-4 mb-6 sm:mb-8 border-b border-white/10 pb-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="-mx-4 flex min-w-0 max-w-full gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0" role="tablist" aria-label="Dashboard sections">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`min-h-11 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold transition-colors sm:px-4 ${activeTab === 'analytics' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`min-h-11 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold transition-colors sm:px-4 ${activeTab === 'projects' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Manage Projects
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('telegram')}
            className={`min-h-11 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold transition-colors sm:px-4 ${activeTab === 'telegram' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Telegram Data
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`min-h-11 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold transition-colors sm:px-4 ${activeTab === 'skills' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Manage Skills
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`min-h-11 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold transition-colors sm:px-4 ${activeTab === 'experience' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Manage Experience
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`min-h-11 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold transition-colors flex items-center gap-2 sm:px-4 ${activeTab === 'messages' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Messages
          </button>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="min-h-11 self-end px-3 py-2 text-sm text-red-500 hover:underline sm:self-auto sm:px-4"
        >
          Logout
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'analytics' && (
          <section>
            <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
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

            {!!stats?.projectAnalytics.length && (
              <section className="glass rounded-2xl border border-primary/20 p-4 mb-8 sm:p-6">
                <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Project performance</h3>
                    <p className="text-sm text-gray-400 mt-1">اختار مشروع عشان تشوف فتحاته وكل زرار اتداس عليه.</p>
                  </div>
                  {selectedProject && (
                    <button
                      type="button"
                      onClick={() => setSelectedProjectId(null)}
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      All projects
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stats.projectAnalytics.map((project) => {
                    const buttonClicks = project.buttons.reduce((total, button) => total + button.clicks, 0);
                    const isSelected = selectedProjectId === project.id;
                    return (
                      <button
                        key={project.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedProjectId(project.id)}
                        className={`text-left rounded-xl border p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/60 ${isSelected ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/[0.03] hover:border-primary/40'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-semibold text-white">{project.name}</span>
                          <span className="text-primary font-bold whitespace-nowrap">{project.opens} opens</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">{buttonClicks} button clicks</p>
                      </button>
                    );
                  })}
                </div>

                {selectedProject && (
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                      <div className="rounded-xl bg-white/[0.04] p-4">
                        <p className="text-xs text-gray-400">Project opens</p>
                        <p className="text-2xl font-bold text-primary mt-1">{selectedProject.opens}</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.04] p-4">
                        <p className="text-xs text-gray-400">Button clicks</p>
                        <p className="text-2xl font-bold text-primary mt-1">{selectedProject.buttons.reduce((total, button) => total + button.clicks, 0)}</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.04] p-4">
                        <p className="text-xs text-gray-400">Most clicked</p>
                        <p className="text-lg font-bold text-white mt-1 truncate">{selectedProject.buttons[0]?.name || 'No button data yet'}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedProject.buttons.map((button) => {
                        const maxClicks = selectedProject.buttons[0]?.clicks || 1;
                        return (
                          <div key={button.name}>
                            <div className="flex justify-between gap-4 text-sm mb-1">
                              <span className="text-gray-300">{button.name}</span>
                              <span className="font-bold text-primary">{button.clicks}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (button.clicks / maxClicks) * 100)}%` }} />
                            </div>
                          </div>
                        );
                      })}
                      {!selectedProject.buttons.length && <p className="text-sm text-gray-500">No button clicks recorded for this project yet.</p>}
                    </div>
                  </div>
                )}
              </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass min-w-0 rounded-2xl border border-white/10 p-4 sm:p-6">
                <h3 className="font-bold text-lg mb-4">All tracked events</h3>
                <div className="space-y-3 max-h-80 overflow-auto">
                  {Object.entries(stats?.events || {}).sort(([, a], [, b]) => b - a).map(([event, count]) => (
                    <div key={event} className="flex justify-between gap-4 border-b border-white/10 pb-2">
                      <span className="text-gray-300 break-all">{formatEventLabel(event)}</span>
                      <span className="font-bold text-primary">{count}</span>
                    </div>
                  ))}
                  {!statsLoading && !Object.keys(stats?.events || {}).length && <p className="text-gray-500">No events yet.</p>}
                </div>
              </div>

              <div className="glass min-w-0 rounded-2xl border border-white/10 p-4 sm:p-6">
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
