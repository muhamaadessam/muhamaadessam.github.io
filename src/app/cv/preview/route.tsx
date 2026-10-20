import { ImageResponse } from 'next/og';
import { CV_DRIVE_FILE_ID } from '@/lib/constants';

export const runtime = 'nodejs';

// Drive renders the first page of a shared PDF as an image; the preview card shows it beside the title.
const DRIVE_THUMBNAIL_URL = `https://drive.google.com/thumbnail?id=${CV_DRIVE_FILE_ID}&sz=w800`;
const CACHE_MS = 60 * 60 * 1000;

let cached: { dataUrl: string; fetchedAt: number } | null = null;

async function firstPage() {
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) return cached.dataUrl;
  try {
    const response = await fetch(DRIVE_THUMBNAIL_URL, { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    const type = response.headers.get('content-type') || '';
    if (!response.ok || !type.startsWith('image/')) throw new Error(`Drive returned ${response.status}`);
    const image = Buffer.from(await response.arrayBuffer()).toString('base64');
    cached = { dataUrl: `data:${type.split(';')[0]};base64,${image}`, fetchedAt: Date.now() };
  } catch (error) {
    console.error('CV thumbnail fetch failed:', error instanceof Error ? error.message : 'unknown error');
  }
  return cached?.dataUrl ?? null;
}

export async function GET() {
  const page = await firstPage();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: '#282C33', color: '#FFFFFF', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 0 0 72px', width: 680 }}>
          <div style={{ display: 'flex', fontSize: 30, color: '#42A5F5', letterSpacing: 4 }}>CURRICULUM VITAE</div>
          <div style={{ display: 'flex', fontSize: 66, fontWeight: 700, marginTop: 20, lineHeight: 1.1 }}>Muhammad Essam</div>
          <div style={{ display: 'flex', fontSize: 36, color: '#ABB2BF', marginTop: 24 }}>Flutter Developer · Mobile Engineer</div>
          <div style={{ display: 'flex', fontSize: 28, color: '#64B5F6', marginTop: 56 }}>muhammadessam.me/cv</div>
        </div>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', paddingTop: 56, overflow: 'hidden' }}>
          {page ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page} width={420} height={594} style={{ borderRadius: 12, objectFit: 'cover', objectPosition: 'top', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} alt="" />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 420, height: 594, borderRadius: 12, backgroundColor: '#333842', fontSize: 64, color: '#42A5F5', fontWeight: 700 }}>PDF</div>
          )}
        </div>
      </div>
    ),
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
