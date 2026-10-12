'use client';

import { useEffect, useState } from 'react';
import { getTelegramLogs, TelegramLog } from '@/lib/adminServices';

// CV opens are read from the Telegram logs: each one already stores the company tag, location and device.
type CvOpen = { id: string; date?: Date; via: 'CV link' | 'Portfolio button'; company: string; location: string; device: string };

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });

function text(value: unknown) {
  return typeof value === 'string' && value && value !== 'Unknown' ? value : '';
}

function toOpen(log: TelegramLog): CvOpen {
  const payload = log.payload || {};
  const source = (payload.source || {}) as Record<string, unknown>;
  const country = text(payload.country);
  const countryName = /^[A-Z]{2}$/.test(country) ? countryNames.of(country) || country : country;
  return {
    id: log.id,
    date: log.createdAt?.toDate(),
    via: payload.path === '/cv' ? 'CV link' : 'Portfolio button',
    company: text(source.ref),
    location: [text(payload.city), countryName].filter(Boolean).join(', ') || 'Unknown',
    device: [text(payload.device), [text(payload.browser), text(payload.os)].filter(Boolean).join(' on ')].filter(Boolean).join(' · ') || 'Unknown',
  };
}

function ranked(opens: CvOpen[], key: (open: CvOpen) => string) {
  const counts = opens.reduce<Record<string, number>>((all, open) => {
    const value = key(open);
    if (value) all[value] = (all[value] || 0) + 1;
    return all;
  }, {});
  return Object.entries(counts).sort(([, a], [, b]) => b - a);
}

export default function CvAnalytics() {
  const [opens, setOpens] = useState<CvOpen[] | null>(null);

  useEffect(() => {
    getTelegramLogs().then((logs) => setOpens(logs.filter((log) => log.type === 'cv_download').map(toOpen)));
  }, []);

  if (!opens) return <section className="glass rounded-2xl border border-white/10 p-4 sm:p-6 text-sm text-gray-400">Loading CV opens…</section>;

  const companies = ranked(opens, (open) => open.company);
  const fromLink = opens.filter((open) => open.via === 'CV link').length;
  const formatDate = (date?: Date) => date ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date) : 'Just now';

  return (
    <section className="glass min-w-0 rounded-2xl border border-white/10 p-4 sm:p-6">
      <h3 className="font-bold text-lg mb-4">Who opened the CV</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          ['Total opens', opens.length],
          ['From the CV link', fromLink],
          ['From portfolio buttons', opens.length - fromLink],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white/[0.04] p-4">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-primary mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="min-w-0">
          <h4 className="font-semibold mb-3">By company link</h4>
          <div className="space-y-2 max-h-72 overflow-auto">
            {companies.map(([company, count]) => (
              <div key={company} className="flex justify-between gap-3 text-sm border-b border-white/10 pb-2">
                <span className="text-gray-300 break-all">{company}</span>
                <span className="font-bold text-primary">{count}</span>
              </div>
            ))}
            {!companies.length && <p className="text-sm text-gray-500">No company links yet. Send muhammadessam.me/cv?ref=company-name to see them here.</p>}
          </div>
        </div>

        <div className="min-w-0 lg:col-span-2">
          <h4 className="font-semibold mb-3">Recent opens</h4>
          <div className="max-h-72 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-gray-400">
                <tr><th className="pb-2 pr-3 font-medium">When</th><th className="pb-2 pr-3 font-medium">Company</th><th className="pb-2 pr-3 font-medium">Location</th><th className="pb-2 pr-3 font-medium">Device</th><th className="pb-2 font-medium">Via</th></tr>
              </thead>
              <tbody>
                {opens.map((open) => (
                  <tr key={open.id} className="border-t border-white/10 align-top">
                    <td className="py-2 pr-3 text-gray-300 whitespace-nowrap">{formatDate(open.date)}</td>
                    <td className="py-2 pr-3 text-white break-all">{open.company || '—'}</td>
                    <td className="py-2 pr-3 text-gray-300">{open.location}</td>
                    <td className="py-2 pr-3 text-gray-300">{open.device}</td>
                    <td className="py-2 text-gray-400 whitespace-nowrap">{open.via}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!opens.length && <p className="text-sm text-gray-500 mt-2">Nobody has opened the CV yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
