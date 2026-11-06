import type { Metadata, Viewport } from 'next';
import { Fira_Code } from 'next/font/google';
import './globals.css';
import JsonLd from '@/components/JsonLd';
import VisitorTracker from '@/components/VisitorTracker';
import MotionProvider from '@/components/MotionProvider';
import { ALTERNATE_NAMES, DEFAULT_DESCRIPTION, DEFAULT_TITLE, KNOWS_ABOUT, PERSON_ID, PERSON_NAME, SAME_AS, SITE_NAME, SITE_URL, WEBSITE_ID } from '@/lib/seo';

const firaCode = Fira_Code({ subsets: ['latin'] });

// Lets the browser paint the dark canvas before the stylesheet arrives, instead of a white flash.
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#282C33',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: '%s | Muhammad Essam' },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['Muhammad Essam', 'Mohamed Essam', 'محمد عصام', 'Flutter Developer', 'Flutter Developer Egypt', 'Mobile Application Engineer', 'Dart', 'BLoC', 'Clean Architecture', 'Firebase', 'Android', 'iOS'],
  authors: [{ name: PERSON_NAME, url: SITE_URL }],
  creator: PERSON_NAME,
  category: 'technology',
  // The llms.txt link lets AI crawlers find the plain-text summary from any page.
  alternates: { canonical: '/', types: { 'text/plain': [{ url: '/llms.txt', title: 'LLM summary' }] } },
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    creator: '@muhammadessam',
  },
  // AdSense ownership check for this domain and its subdomains (FPL Pro shows the ads).
  verification: {
    other: { 'google-adsense-account': 'ca-pub-7614735907221714' },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: PERSON_NAME,
        jobTitle: 'Flutter Developer',
        description: DEFAULT_DESCRIPTION,
        alternateName: ALTERNATE_NAMES,
        url: `${SITE_URL}/`,
        mainEntityOfPage: `${SITE_URL}/`,
        image: { '@type': 'ImageObject', url: `${SITE_URL}/profilePic.webp`, caption: PERSON_NAME },
        sameAs: SAME_AS,
        knowsAbout: KNOWS_ABOUT,
        knowsLanguage: ['en', 'ar'],
        hasOccupation: {
          '@type': 'Occupation',
          name: 'Flutter Developer',
          occupationalCategory: '15-1252.00 Software Developers',
          skills: KNOWS_ABOUT.join(', '),
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': PERSON_ID },
        author: { '@id': PERSON_ID },
      },
    ],
  };

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" style={{ backgroundColor: '#282C33' }} suppressHydrationWarning>
      <body className={`${firaCode.className} antialiased selection:bg-primary/30 selection:text-primary-dark`}>
        <JsonLd data={siteSchema} />
        <MotionProvider>{children}</MotionProvider>
        <VisitorTracker />
      </body>
    </html>
  );
}
