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
  return { country: geoValue(request, 'cf-ipcountry', 'x-vercel-ip-country') || 'Unknown', city: geoValue(request, 'cf-ipcity', 'x-vercel-ip-city'), region: geoValue(request, 'cf-region-code', 'cf-region', 'x-vercel-ip-country-region'), ipTimezone: geoValue(request, 'cf-timezone', 'x-vercel-ip-timezone') };
}

function utcOffset(timeZone: string) {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' }).formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value || null;
  } catch { return null; }
}

// A device clock set to a different UTC offset than the IP's location usually means a VPN, proxy or corporate exit node.
// Offsets are compared rather than zone names so neighbours like Asia/Riyadh and Asia/Kuwait never count as a mismatch.
export function timezoneMismatch(deviceTimezone: unknown, ipTimezone: unknown) {
  if (typeof deviceTimezone !== 'string' || typeof ipTimezone !== 'string' || !deviceTimezone || !ipTimezone) return false;
  const device = utcOffset(deviceTimezone);
  const ip = utcOffset(ipTimezone);
  return Boolean(device && ip && device !== ip);
}

export async function notify(kind: 'visitor' | 'cv-download', payload: object) {
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || 'https://portfolio-contact-api-three.vercel.app/api/contact';
  try {
    const response = await fetch(endpoint.replace(/\/contact\/?$/, `/${kind}`), { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.VISITOR_NOTIFICATION_SECRET ? { Authorization: `Bearer ${process.env.VISITOR_NOTIFICATION_SECRET}` } : {}) }, body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
    if (!response.ok) console.error(`Analytics ${kind} notification failed (${response.status})`);
  } catch { console.error(`Analytics ${kind} notification failed`); }
}
