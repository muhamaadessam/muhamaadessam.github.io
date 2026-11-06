import type { MetadataRoute } from 'next';
import { DEFAULT_DESCRIPTION, PERSON_NAME, SITE_NAME } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: PERSON_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    lang: 'en',
    background_color: '#282C33',
    theme_color: '#282C33',
    categories: ['portfolio', 'technology'],
    icons: [{ src: '/icon.png', sizes: '2250x2250', type: 'image/png', purpose: 'any' }],
  };
}
