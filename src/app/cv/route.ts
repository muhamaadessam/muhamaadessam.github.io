import { after } from 'next/server';
import { deviceInfo, trafficSource } from '@/lib/analytics';
import { commitWrites, incrementFields } from '@/lib/analyticsServer';
import { notify, requestGeography } from '@/lib/notifications';
import { CV_DRIVE_FILE_ID } from '@/lib/constants';
import { SITE_URL } from '@/lib/seo';

export const runtime = 'nodejs';

// The CV lives in Google Drive so it can be replaced in place; this link always serves the current file.
const DRIVE_DOWNLOAD_URL = `https://drive.usercontent.google.com/download?id=${CV_DRIVE_FILE_ID}&export=download`;
const DRIVE_VIEW_URL = `https://drive.google.com/file/d/${CV_DRIVE_FILE_ID}/view`;
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

const PREVIEW_TITLE = 'Muhammad Essam | CV';
const PREVIEW_DESCRIPTION = 'Flutter Developer and Mobile Engineer. Open to view or download the latest CV (PDF).';

// Chat apps can't preview a PDF, so link-preview bots get a card with the title and the CV's first page instead.
function previewPage() {
  const image = `${SITE_URL}/cv-card.png`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${PREVIEW_TITLE}</title>
<meta name="description" content="${PREVIEW_DESCRIPTION}">
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Muhammad Essam">
<meta property="og:url" content="${SITE_URL}/cv">
<meta property="og:title" content="${PREVIEW_TITLE}">
<meta property="og:description" content="${PREVIEW_DESCRIPTION}">
<meta property="og:image" content="${image}">
<meta property="og:image:secure_url" content="${image}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Muhammad Essam's CV with its first page">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${PREVIEW_TITLE}">
<meta name="twitter:description" content="${PREVIEW_DESCRIPTION}">
<meta name="twitter:image" content="${image}">
</head><body><a href="${SITE_URL}/cv">${PREVIEW_TITLE}</a></body></html>`;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}

export async function GET(request: Request) {
  if (BOT_PATTERN.test(request.headers.get('user-agent') || '')) return previewPage();
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
