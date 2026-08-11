'use client';

import { useEffect, useState } from 'react';
import { getTelegramLogs, TelegramLog } from '@/lib/adminServices';
import { Activity, BarChart3, Clock3, Download, Eye, Globe2, Mail, MapPin, MessageSquare, Monitor, Navigation, UserRound, UsersRound } from 'lucide-react';

const labels = {
  contact: 'Contact message',
  visitor: 'Visitor notification',
  cv_download: 'CV download',
};

const fieldLabels: Record<string, string> = {
  visitorId: 'Visitor ID',
  totalVisits: 'Total visits',
  totalUnique: 'Unique visitors',
  userAgent: 'Browser signature',
};

function valueOf(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'Unavailable';
  return String(value);
}

function getTime(log: TelegramLog): number {
  return log.createdAt?.toDate().getTime() || 0;
}

function Detail({ icon: Icon, label, value, wide = false }: { icon: typeof MapPin; label: string; value: unknown; wide?: boolean }) {
  return (
    <div className={`min-w-0 ${wide ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
        <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="text-sm text-white break-words">{valueOf(value)}</p>
    </div>
  );
}

function Metric({ icon: Icon, label, value, note }: { icon: typeof Eye; label: string; value: string | number; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-dark-card/55 p-5 shadow-lg shadow-black/10">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{note}</p>
    </div>
  );
}

function RankedList({ items, empty }: { items: { label: string; count: number }[]; empty: string }) {
  const max = items[0]?.count || 1;

  if (!items.length) return <p className="text-sm text-gray-500">{empty}</p>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex justify-between gap-3 text-sm">
            <span className="truncate text-gray-300">{item.label}</span>
            <span className="font-semibold text-primary">{item.count}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max((item.count / max) * 100, 8)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TelegramLogManager() {
  const [logs, setLogs] = useState<TelegramLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'visitor' | 'cv_download' | 'contact'>('all');

  useEffect(() => {
    getTelegramLogs().then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const formatDate = (timestamp: TelegramLog['createdAt']) => {
    if (!timestamp) return 'Just now';
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp.toDate());
  };

  const visitorLogs = logs.filter((log) => log.type === 'visitor');
  const visitorGroups = Object.entries(visitorLogs.reduce<Record<string, TelegramLog[]>>((groups, log) => {
    const visitorId = String(log.payload.visitorId || log.id);
    groups[visitorId] = groups[visitorId] || [];
    groups[visitorId].push(log);
    return groups;
  }, {})).map(([visitorId, visits]) => {
    const orderedVisits = visits.sort((a, b) => getTime(b) - getTime(a));
    return { visitorId, visits: orderedVisits, latest: orderedVisits[0] };
  }).sort((a, b) => getTime(b.latest) - getTime(a.latest));
  const uniqueVisitorIds = new Set(visitorGroups.map((group) => group.visitorId));
  const newVisitors = new Set(visitorLogs.filter((log) => log.payload.isNewVisitor === true).map((log) => log.payload.visitorId).filter(Boolean)).size;
  const returningVisits = visitorLogs.filter((log) => log.payload.isNewVisitor !== true).length;
  const cvDownloads = logs.filter((log) => log.type === 'cv_download').length;
  const contactMessages = logs.filter((log) => log.type === 'contact').length;
  const visitorCount = uniqueVisitorIds.size;
  const cvRate = visitorCount ? Math.round((cvDownloads / visitorCount) * 100) : 0;
  const contactRate = visitorCount ? Math.round((contactMessages / visitorCount) * 100) : 0;

  const rank = (getValue: (log: TelegramLog) => string) => Object.entries(
    logs.filter((log) => log.type === 'visitor').reduce<Record<string, number>>((counts, log) => {
      const value = getValue(log);
      if (value && value !== 'Unknown') counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {}),
  ).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 4);

  const locations = rank((log) => [log.payload.city, log.payload.country].filter(Boolean).join(', '));
  const devices = rank((log) => valueOf(log.payload.device));
  const visibleGroups = filter === 'all' || filter === 'visitor' ? visitorGroups : [];
  const visibleLogs = filter === 'all' ? logs.filter((log) => log.type !== 'visitor') : logs.filter((log) => log.type === filter);
  const activityItems = [
    ...visibleGroups.map((group) => ({ kind: 'visitor' as const, time: getTime(group.latest), group })),
    ...visibleLogs.map((log) => ({ kind: 'log' as const, time: getTime(log), log })),
  ].sort((a, b) => b.time - a.time);

  const filters = [
    ['all', 'All activity', logs.length],
    ['visitor', 'Visitors', visitorGroups.length],
    ['cv_download', 'CV downloads', cvDownloads],
    ['contact', 'Messages', contactMessages],
  ] as const;

  const renderPayload = (log: TelegramLog, visitorVisitCount?: number) => {
    const payload = log.payload || {};
    const location = [payload.city, payload.region, payload.country].filter(Boolean).join(', ');
    const hasCoordinates = payload.latitude && payload.longitude && payload.latitude !== 'Unknown' && payload.longitude !== 'Unknown';
    const coordinates = hasCoordinates ? `${payload.latitude}, ${payload.longitude}` : null;
    const knownFields = new Set([
      'visitorId', 'totalVisits', 'totalUnique', 'isNewVisitor', 'city', 'region', 'country', 'flag',
      'timezone', 'device', 'ip', 'latitude', 'longitude', 'userAgent', 'name', 'email', 'message',
    ]);
    const extraFields = Object.entries(payload).filter(([key]) => !knownFields.has(key));

    return (
      <>
        {log.type === 'contact' ? (
          <div className="border-b border-white/10 pb-5 mb-5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
              <div className="flex items-center gap-2 text-white font-semibold">
                <UserRound className="w-4 h-4 text-primary" aria-hidden="true" />
                {valueOf(payload.name)}
              </div>
              <a href={`mailto:${valueOf(payload.email)}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Mail className="w-4 h-4" aria-hidden="true" />
                {valueOf(payload.email)}
              </a>
            </div>
            <div className="rounded-xl bg-black/20 p-4">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" aria-hidden="true" />
                Message
              </div>
              <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">{valueOf(payload.message)}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-5 mb-5">
            <div className="flex items-center gap-2 text-white font-semibold">
              {log.type === 'cv_download' ? <Download className="w-5 h-5 text-primary" aria-hidden="true" /> : <Eye className="w-5 h-5 text-primary" aria-hidden="true" />}
              {log.type === 'visitor' && payload.isNewVisitor === true ? 'New unique visitor' : log.type === 'visitor' ? 'Returning visitor' : 'CV downloaded'}
            </div>
            {log.type === 'visitor' && (
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-primary">{visitorVisitCount || 1} visits by this visitor</span>
                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-gray-300">{valueOf(payload.totalUnique)} unique visitors</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
          <Detail icon={MapPin} label="Location" value={`${valueOf(payload.flag)} ${location || 'Unavailable'}`} wide />
          <Detail icon={Clock3} label="Timezone" value={payload.timezone} />
          <Detail icon={Monitor} label="Device" value={payload.device} />
          <Detail icon={Globe2} label="IP address" value={payload.ip} />
          <Detail icon={Navigation} label="Coordinates" value={coordinates} />
          <Detail icon={UserRound} label="Visitor ID" value={payload.visitorId} wide />
          <Detail icon={Monitor} label="Browser signature" value={payload.userAgent} wide />
          {log.type === 'visitor' && <Detail icon={Eye} label="New visitor" value={payload.isNewVisitor === true ? 'Yes' : 'No'} />}
        </div>

        {coordinates && (
          <a
            href={`https://www.google.com/maps?q=${payload.latitude},${payload.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-sm text-primary hover:underline"
          >
            <Navigation className="w-4 h-4" aria-hidden="true" /> Open location in Maps
          </a>
        )}

        {extraFields.length > 0 && (
          <div className="border-t border-white/10 mt-5 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {extraFields.map(([key, value]) => (
              <Detail key={key} icon={Globe2} label={fieldLabels[key] || key.replaceAll('_', ' ')} value={value} />
            ))}
          </div>
        )}
      </>
    );
  };

  const renderVisitHistory = (visits: TelegramLog[]) => (
    <div className="mt-6 border-t border-white/10 pt-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
        Visit history <span className="text-xs font-normal text-gray-500">({visits.length})</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {visits.map((visit, index) => (
          <div key={visit.id} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-300">
            <span className="mr-2 text-gray-500">#{visits.length - index}</span>
            {formatDate(visit.createdAt)}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-white/10" />
        <div className="h-4 w-96 max-w-full rounded bg-white/10" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <div key={item} className="h-32 rounded-2xl bg-white/5" />)}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Engagement center</p>
          <h2 className="text-3xl font-bold tracking-tight text-white">Telegram intelligence</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">A readable view of visitor signals, recruiter interest, and contact activity captured after Telegram notifications succeed.</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary md:self-auto">
          <Activity className="h-4 w-4" aria-hidden="true" />
          {logs.length} records tracked
        </div>
      </div>

      {!logs.length ? (
        <div className="rounded-2xl border border-white/10 bg-dark-card/40 py-16 text-center">
          <Activity className="mx-auto mb-4 h-8 w-8 text-primary" aria-hidden="true" />
          <h3 className="font-semibold text-white">No Telegram activity yet</h3>
          <p className="mt-2 text-sm text-gray-400">New visitor, CV, and contact notifications will appear here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric icon={UsersRound} label="Reach" value={visitorCount} note="unique visitor IDs" />
            <Metric icon={Eye} label="Visits" value={visitorLogs.length} note={`${newVisitors} new · ${returningVisits} returning`} />
            <Metric icon={Download} label="CV interest" value={cvDownloads} note={`${cvRate}% of unique visitors`} />
            <Metric icon={MessageSquare} label="Conversations" value={contactMessages} note={`${contactRate}% contact rate`} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-dark-card/45 p-6 lg:col-span-3">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" /> Audience pulse</h3>
                  <p className="mt-1 text-sm text-gray-400">How visitors are behaving when they reach the portfolio.</p>
                </div>
                <span className="text-xs text-gray-500">All logged visits</span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <div className="mb-3 flex justify-between text-sm"><span className="text-gray-300">New visitors</span><span className="font-semibold text-primary">{newVisitors}</span></div>
                  <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-primary" style={{ width: `${visitorLogs.length ? Math.max((newVisitors / visitorLogs.length) * 100, 4) : 0}%` }} /></div>
                  <p className="mt-2 text-xs text-gray-500">First-time visitor notifications</p>
                </div>
                <div>
                  <div className="mb-3 flex justify-between text-sm"><span className="text-gray-300">Returning visits</span><span className="font-semibold text-primary">{returningVisits}</span></div>
                  <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-accent" style={{ width: `${visitorLogs.length ? Math.max((returningVisits / visitorLogs.length) * 100, 4) : 0}%` }} /></div>
                  <p className="mt-2 text-xs text-gray-500">Repeat sessions from known IDs</p>
                </div>
              </div>
              <div className="mt-7 border-t border-white/10 pt-5 text-sm text-gray-300">
                <span className="text-primary font-semibold">{visitorCount ? (visitorLogs.length / visitorCount).toFixed(1) : '0.0'}×</span> average logged visits per unique visitor
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-dark-card/45 p-6 lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Conversion snapshot</h3>
                <p className="mt-1 text-sm text-gray-400">Interest signals compared with unique reach.</p>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4"><span className="text-sm text-gray-300">CV download rate</span><strong className="text-2xl text-primary">{cvRate}%</strong></div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4"><span className="text-sm text-gray-300">Contact rate</span><strong className="text-2xl text-primary">{contactRate}%</strong></div>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-300">Total notifications</span><strong className="text-2xl text-white">{logs.length}</strong></div>
              </div>
              <p className="mt-6 text-xs leading-5 text-gray-500">Rates use unique visitor IDs as the denominator. They are directional signals, not a replacement for a full analytics platform.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-dark-card/45 p-6"><h3 className="mb-5 text-lg font-semibold text-white">Top locations</h3><RankedList items={locations} empty="Location data is not available yet." /></div>
            <div className="rounded-2xl border border-white/10 bg-dark-card/45 p-6"><h3 className="mb-5 text-lg font-semibold text-white">Devices</h3><RankedList items={devices} empty="Device data is not available yet." /></div>
          </div>

          <div>
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><h3 className="text-xl font-semibold text-white">Activity log</h3><p className="mt-1 text-sm text-gray-400">Readable notification records with full client context.</p></div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter activity">
                {filters.map(([key, label, count]) => (
                  <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)} className={`rounded-full border px-3 py-1.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary/60 ${filter === key ? 'border-primary bg-primary text-dark-bg' : 'border-white/10 bg-white/5 text-gray-300 hover:border-primary/40 hover:text-white'}`}>
                    {label} <span className={filter === key ? 'text-dark-bg/70' : 'text-gray-500'}>({count})</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-5">
              {activityItems.map((item) => (
                <article key={item.kind === 'visitor' ? item.group.visitorId : item.log.id} className="glass rounded-2xl border border-primary/20 p-6 md:p-7">
                  <div className="mb-4 flex flex-wrap justify-between gap-2">
                    <h3 className="text-lg font-bold text-primary">{item.kind === 'visitor' ? labels.visitor : labels[item.log.type] || item.log.type}</h3>
                    <span className="text-xs text-gray-400">{formatDate(item.kind === 'visitor' ? item.group.latest.createdAt : item.log.createdAt)}</span>
                  </div>
                  {item.kind === 'visitor' ? renderPayload(item.group.latest, item.group.visits.length) : renderPayload(item.log)}
                  {item.kind === 'visitor' && renderVisitHistory(item.group.visits)}
                </article>
              ))}
              {!activityItems.length && <p className="rounded-2xl border border-white/10 py-10 text-center text-sm text-gray-500">No records match this filter.</p>}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
