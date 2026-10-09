'use client';

import { useRef, useState } from 'react';
import { type QueryDocumentSnapshot } from 'firebase/firestore';
import { getVisitorTimeline, type VisitorAnalyticsStats, type VisitorTimelineEvent } from '@/lib/adminServices';

export default function VisitorAnalytics({ analytics, visitors }: { analytics: VisitorAnalyticsStats; visitors: { id: string; visits: number }[] }) {
  const [visitorId, setVisitorId] = useState('');
  const [events, setEvents] = useState<VisitorTimelineEvent[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const load = async (id: string, more = false) => {
    const request = ++requestId.current;
    setVisitorId(id);
    setError('');
    if (!more) { setEvents([]); setCursor(undefined); }
    if (!id) { setLoading(false); return; }
    setLoading(true);
    try {
      const result = await getVisitorTimeline(id, more ? cursor : undefined);
      if (request !== requestId.current) return;
      setEvents(previous => more ? [...previous, ...result.events] : result.events);
      setCursor(result.cursor);
    } catch {
      if (request === requestId.current) setError('Could not load timeline. Check your connection, admin access and Firestore index.');
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  };
  const splits: [string, Record<string, number> | undefined][] = [
    ['Traffic sources', analytics.sources], ['Referrer hosts', analytics.referrers], ['Company links (?ref)', analytics.companies],
    ['Countries', analytics.countries], ['Cities', analytics.cities], ['Devices', analytics.devices], ['Browsers', analytics.browsers], ['Operating systems', analytics.operatingSystems],
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ['Tracked sessions', analytics.sessions || 0],
          ['Average visible time / page', `${Math.round((analytics.durationMs || 0) / Math.max(1, analytics.pageViews || 0) / 1000)}s`],
          ['Average session scroll depth', `${Math.round((analytics.scrollDepth || 0) / Math.max(1, analytics.sessions || 0))}%`],
        ].map(([label, value]) => <div key={label} className="glass rounded-2xl border border-white/10 p-4"><p className="text-sm text-gray-400">{label}</p><p className="text-2xl font-bold text-primary mt-2">{value}</p></div>)}
      </div>
      <p className="text-sm text-gray-400">Detailed analytics start with this release and exclude Do Not Track visitors. Source and device splits count browser sessions. Visible time excludes background tabs.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {splits.map(([label, counts]) => <section key={label} className="glass min-w-0 rounded-2xl border border-white/10 p-4">
          <h3 className="font-bold mb-3">{label}</h3>
          <div className="max-h-64 overflow-auto space-y-2">
            {Object.entries(counts || {}).sort(([, a], [, b]) => b - a).map(([name, count]) => <div key={name} className="flex justify-between gap-3 text-sm"><span className="text-gray-300 break-all">{label === 'Cities' ? name.replace(/ \/ Unknown$/, '') : name}</span><span className="text-primary">{count} ({Math.round(count / Math.max(1, analytics.sessions || 0) * 100)}%)</span></div>)}
            {!Object.keys(counts || {}).length && <p className="text-sm text-gray-500">No detailed data yet.</p>}
          </div>
        </section>)}
      </div>
      <section className="glass rounded-2xl border border-white/10 p-4 sm:p-6">
        <h3 className="font-bold text-lg mb-2">Homepage section reach</h3>
        <p className="text-sm text-gray-400 mb-4">Percentage of homepage sessions that saw each section, in page order. Each section counts once per session; visitors may jump between sections.</p>
        {['projects', 'experience', 'contact'].map(section => {
          const count = analytics.sections?.[section] || 0;
          const percent = Math.min(100, Math.round(count / Math.max(1, analytics.homepageSessions || 0) * 100));
          return <div key={section} className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="capitalize">{section}</span><span>{count} / {analytics.homepageSessions || 0} ({percent}%)</span></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} /></div></div>;
        })}
        {!!analytics.homepageSessions && <p className="text-sm text-gray-400">{Math.round((1 - (analytics.sections?.projects || 0) / analytics.homepageSessions) * 100)}% of homepage sessions did not reach Projects.</p>}
      </section>
      <section className="glass rounded-2xl border border-white/10 p-4 sm:p-6">
        <label htmlFor="visitor-timeline" className="block font-bold text-lg mb-3">Visitor timeline</label>
        <select id="visitor-timeline" value={visitorId} onChange={event => void load(event.target.value)} className="w-full rounded-xl border border-white/10 bg-dark-bg p-3 text-sm">
          <option value="">Select a visitor</option>
          {visitors.map(visitor => <option key={visitor.id} value={visitor.id}>{visitor.id} — {visitor.visits} visits</option>)}
        </select>
        <div aria-live="polite" className="mt-4 space-y-3 max-h-96 overflow-auto">
          {events.map(event => <div key={event.id} className="border-b border-white/10 pb-3 text-sm"><p className="text-primary">{event.event.replaceAll('_', ' ')} — {event.target}</p><p className="text-gray-400 break-all">{new Date(event.timestamp).toLocaleString()} · {event.path} · Session {event.sessionId}</p>{event.durationMs !== undefined && <p className="text-gray-300">Visible time: {Math.round(event.durationMs / 1000)}s · Scroll: {event.scrollDepth}%</p>}</div>)}
          {loading && <p className="text-gray-400">Loading timeline...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {visitorId && !loading && !error && !events.length && <p className="text-gray-500">No detailed events yet. Older visits only have counters.</p>}
        </div>
        {cursor && <button type="button" disabled={loading} onClick={() => void load(visitorId, true)} className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-primary disabled:opacity-50">Load older events</button>}
      </section>
    </div>
  );
}
