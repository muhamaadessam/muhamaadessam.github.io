export function geoValue(request: Request, ...headers: string[]) {
  for (const header of headers) {
    try {
      const value = decodeURIComponent(request.headers.get(header) || '').slice(0, 120);
      if (value && value !== 'XX' && value !== 'T1') return value;
    } catch { /* try the next header */ }
  }
  return '';
}

export function requestGeography(request: Request) {
  return { country: geoValue(request, 'cf-ipcountry', 'x-vercel-ip-country') || 'Unknown', city: geoValue(request, 'cf-ipcity', 'x-vercel-ip-city'), region: geoValue(request, 'cf-region-code', 'cf-region', 'x-vercel-ip-country-region') };
}

export async function notify(kind: 'visitor' | 'cv-download', payload: object) {
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || 'https://portfolio-contact-api-three.vercel.app/api/contact';
  try {
    const response = await fetch(endpoint.replace(/\/contact\/?$/, `/${kind}`), { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.VISITOR_NOTIFICATION_SECRET ? { Authorization: `Bearer ${process.env.VISITOR_NOTIFICATION_SECRET}` } : {}) }, body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
    if (!response.ok) console.error(`Analytics ${kind} notification failed (${response.status})`);
  } catch { console.error(`Analytics ${kind} notification failed`); }
}
