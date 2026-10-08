import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import './globals.css';
import JsonLd from '@/components/JsonLd';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, KNOWS_ABOUT, PERSON_ID, PERSON_NAME, SITE_NAME, SITE_URL, WEBSITE_ID } from '@/lib/seo';

const firaCode = Fira_Code({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: '%s | Muhammad Essam' },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['Muhammad Essam', 'Flutter Developer', 'Mobile Application Engineer', 'Dart', 'BLoC', 'Clean Architecture', 'Firebase', 'Android', 'iOS'],
  authors: [{ name: PERSON_NAME, url: SITE_URL }],
  creator: PERSON_NAME,
  category: 'technology',
  alternates: { canonical: '/' },
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
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/profilePic.webp`,
        sameAs: [
          'https://github.com/muhamaadessam',
          'https://www.linkedin.com/in/muhammadessam159/',
        ],
        knowsAbout: KNOWS_ABOUT,
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': PERSON_ID },
      },
    ],
  };

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${firaCode.className} antialiased selection:bg-primary/30 selection:text-primary-dark`}>
        <JsonLd data={siteSchema} />
        {children}
      </body>
    </html>
  );
}
