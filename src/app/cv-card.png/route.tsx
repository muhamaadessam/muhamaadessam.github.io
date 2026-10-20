import { ImageResponse } from 'next/og';
import { CV_DRIVE_FILE_ID } from '@/lib/constants';

// Drawn once during `next build`: the shared host can't run the image renderer, so it only serves this file.
export const dynamic = 'force-static';

// Drive renders the first page of a shared PDF as an image; the card shows it beside the title.
const DRIVE_THUMBNAIL_URL = `https://drive.google.com/thumbnail?id=${CV_DRIVE_FILE_ID}&sz=w800`;

async function firstPage() {
  try {
    const response = await fetch(DRIVE_THUMBNAIL_URL, { signal: AbortSignal.timeout(15_000) });
    const type = (response.headers.get('content-type') || '').split(';')[0];
    if (!response.ok || !type.startsWith('image/')) throw new Error(`Drive returned ${response.status}`);
    return `data:${type};base64,${Buffer.from(await response.arrayBuffer()).toString('base64')}`;
  } catch (error) {
    console.error('CV thumbnail fetch failed:', error instanceof Error ? error.message : 'unknown error');
    return null;
  }
}

export async function GET() {
  const page = await firstPage();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: '#282C33', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 72, width: 680 }}>
          <div style={{ display: 'flex', fontSize: 30, color: '#42A5F5', letterSpacing: 4 }}>CURRICULUM VITAE</div>
          <div style={{ display: 'flex', fontSize: 66, fontWeight: 700, marginTop: 20, lineHeight: 1.1 }}>Muhammad Essam</div>
          <div style={{ display: 'flex', fontSize: 36, color: '#ABB2BF', marginTop: 24 }}>Flutter Developer · Mobile Engineer</div>
          <div style={{ display: 'flex', fontSize: 28, color: '#64B5F6', marginTop: 56 }}>muhammadessam.me/cv</div>
        </div>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', paddingTop: 56, overflow: 'hidden' }}>
          {page ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page} width={420} height={594} style={{ borderRadius: 12, objectFit: 'cover', objectPosition: 'top' }} alt="" />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 420, height: 594, borderRadius: 12, backgroundColor: '#333842', fontSize: 64, color: '#42A5F5', fontWeight: 700 }}>CV</div>
          )}
        </div>
      </div>
    ),
  );
}
