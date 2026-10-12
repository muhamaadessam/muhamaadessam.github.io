import { after } from 'next/server';
import { deviceInfo, trafficSource } from '@/lib/analytics';
import { commitWrites, incrementFields } from '@/lib/analyticsServer';
import { notify, requestGeography } from '@/lib/notifications';

export const runtime = 'nodejs';

// The CV lives in Google Drive so it can be replaced in place; this link always serves the current file.
const DRIVE_FILE_ID = '11R3XbF-0bTpnFe4wCdOYy9Qgw4ISQKEc';
const DRIVE_DOWNLOAD_URL = `https://drive.usercontent.google.com/download?id=${DRIVE_FILE_ID}&export=download`;
const DRIVE_VIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/view`;
const CACHE_MS = 5 * 60 * 1000;
const BOT_PATTERN = /bot|crawl|spider|preview|slurp|facebookexternalhit|whatsapp|telegram|slack|discord|linkedin|google-?inspection|headless/i;

let cached: { pdf: ArrayBuffer; fetchedAt: number } | null = null;

async function currentCv() {
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) return cached.pdf;
  try {
    const response = await fetch(DRIVE_DOWNLOAD_URL, { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    const pdf = await response.arrayBuffer();
    // Drive answers with an HTML page instead of the file when sharing or quota is off; never serve that as a PDF.
    if (!response.ok || new TextDecoder().decode(pdf.slice(0, 5)) !== '%PDF-') throw new Error(`Drive returned ${response.status}`);
    cached = { pdf, fetchedAt: Date.now() };
  } catch (error) {
    console.error('CV fetch failed:', error instanceof Error ? error.message : 'unknown error');
  }
  return cached?.pdf ?? null;
}

// Only a person opening the link counts: skip link-preview bots and the PDF viewer's follow-up range requests.
function isHumanOpen(request: Request) {
  const range = request.headers.get('range');
  const dest = request.headers.get('sec-fetch-dest');
  return request.headers.get('dnt') !== '1'
    && !BOT_PATTERN.test(request.headers.get('user-agent') || '')
    && (!range || range.startsWith('bytes=0-'))
    && (!dest || dest === 'document');
}

function recordOpen(request: Request) {
  const source = trafficSource(request.url, request.headers.get('referer') || '');
  if (!source.utmSource) source.utmSource = 'cv-link';
  const payload = {
    visitorId: crypto.randomUUID(), source, firstTouch: source, ...requestGeography(request),
    ...deviceInfo(request.headers.get('user-agent') || ''),
    language: (request.headers.get('accept-language') || '').split(',')[0] || 'Unknown',
    timezone: 'Unknown', screen: 'Unknown', path: '/cv',
  };
  after(async () => {
    await notify('cv-download', payload);
    try {
      await commitWrites([
        incrementFields('stats/cv_downloads', { count: 1 }),
        incrementFields('stats/events', { cv_download: 1, cv_download_cv_link: 1 }),
      ]);
    } catch { console.error('CV open count failed'); }
  });
}

export async function GET(request: Request) {
  const pdf = await currentCv();
  if (!pdf) return Response.redirect(DRIVE_VIEW_URL, 302);
  // The site's own Download CV buttons already report the click through /api/track.
  if (isHumanOpen(request) && request.headers.get('sec-fetch-site') !== 'same-origin') recordOpen(request);
  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Muhammad-Essam-CV.pdf"',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
