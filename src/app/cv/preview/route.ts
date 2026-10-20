import { CV_DRIVE_FILE_ID } from '@/lib/constants';

export const runtime = 'nodejs';

// Drive renders the first page of a shared PDF as an image; serving it as-is keeps the host from drawing anything.
const DRIVE_THUMBNAIL_URL = `https://drive.google.com/thumbnail?id=${CV_DRIVE_FILE_ID}&sz=w800`;
const CACHE_MS = 60 * 60 * 1000;

let cached: { image: ArrayBuffer; type: string; fetchedAt: number } | null = null;

async function firstPage() {
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) return cached;
  try {
    const response = await fetch(DRIVE_THUMBNAIL_URL, { cache: 'no-store', signal: AbortSignal.timeout(8_000) });
    const type = (response.headers.get('content-type') || '').split(';')[0];
    if (!response.ok || !type.startsWith('image/')) throw new Error(`Drive returned ${response.status}`);
    cached = { image: await response.arrayBuffer(), type, fetchedAt: Date.now() };
  } catch (error) {
    console.error('CV thumbnail fetch failed:', error instanceof Error ? error.message : 'unknown error');
  }
  return cached;
}

export async function GET(request: Request) {
  const page = await firstPage();
  if (!page) return Response.redirect(new URL('/opengraph-image.png', request.url), 302);
  return new Response(page.image, {
    headers: { 'Content-Type': page.type, 'Cache-Control': 'public, max-age=3600', 'X-Robots-Tag': 'noindex' },
  });
}
