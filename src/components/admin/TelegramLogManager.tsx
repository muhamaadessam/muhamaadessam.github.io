'use client';

import { useEffect, useState } from 'react';
import { getTelegramLogs, TelegramLog } from '@/lib/adminServices';
import { Clock3, Download, Eye, Globe2, Mail, MapPin, MessageSquare, Monitor, Navigation, UserRound } from 'lucide-react';

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

export default function TelegramLogManager() {
  const [logs, setLogs] = useState<TelegramLog[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderPayload = (log: TelegramLog) => {
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
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-primary">{valueOf(payload.totalVisits)} visits</span>
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

  if (loading) return <div>Loading Telegram data...</div>;

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Telegram Data ({logs.length})</h2>
        <p className="text-gray-400 text-sm mt-1">The payloads saved after Telegram notifications succeeded.</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center text-gray-400 py-12 glass rounded-xl border border-white/10">No Telegram data found.</div>
      ) : (
        <div className="grid gap-4">
          {logs.map((log) => (
            <article key={log.id} className="glass p-6 md:p-7 rounded-2xl border border-primary/20">
              <div className="flex flex-wrap justify-between gap-2 mb-4">
                <h3 className="font-bold text-lg text-primary">{labels[log.type] || log.type}</h3>
                <span className="text-xs text-gray-400">{formatDate(log.createdAt)}</span>
              </div>
              {renderPayload(log)}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
