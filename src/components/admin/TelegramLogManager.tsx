'use client';

import { useEffect, useState } from 'react';
import { getTelegramLogs, TelegramLog } from '@/lib/adminServices';

const labels = {
  contact: 'Contact message',
  visitor: 'Visitor notification',
  cv_download: 'CV download',
};

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
            <article key={log.id} className="glass p-6 rounded-xl border border-white/10">
              <div className="flex flex-wrap justify-between gap-2 mb-4">
                <h3 className="font-bold text-lg text-primary">{labels[log.type] || log.type}</h3>
                <span className="text-xs text-gray-400">{formatDate(log.createdAt)}</span>
              </div>
              <pre className="bg-black/20 p-4 rounded-lg text-gray-300 text-sm whitespace-pre-wrap break-words overflow-auto">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
