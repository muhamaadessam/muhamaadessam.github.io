import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import './globals.css';

const firaCode = Fira_Code({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://muhamaadessam.github.io'),
  title: 'Muhammad Essam | Flutter Developer | Mobile Application Engineer',
  description: 'Flutter Developer with 3+ years experience building production Android and iOS applications using Flutter, Dart, BLoC, Firebase, and Clean Architecture.',
  keywords: ['Muhammad Essam', 'Flutter Developer', 'Mobile Application Engineer', 'Dart', 'BLoC', 'Clean Architecture', 'Firebase', 'Android', 'iOS'],
  authors: [{ name: 'Muhammad Essam' }],
  creator: 'Muhammad Essam',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://muhamaadessam.github.io/',
    title: 'Muhammad Essam | Flutter Developer | Mobile Application Engineer',
    description: 'Flutter Developer with 3+ years experience building production Android and iOS applications using Flutter, Dart, BLoC, Firebase, and Clean Architecture.',
    siteName: 'Muhammad Essam Portfolio',
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Essam | Flutter Developer | Mobile Application Engineer',
    description: 'Flutter Developer with 3+ years experience building production Android and iOS applications using Flutter, Dart, BLoC, Firebase, and Clean Architecture.',
    creator: '@muhammadessam',
    images: ['/twitter-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Muhammad Essam',
    jobTitle: 'Flutter Developer',
    url: 'https://muhamaadessam.github.io/',
    sameAs: [
      'https://github.com/muhamaadessam',
      'https://www.linkedin.com/in/muhammadessam159/',
    ],
    knowsAbout: ['Flutter', 'Dart', 'BLoC', 'Clean Architecture', 'Firebase', 'REST APIs', 'Android', 'iOS'],
  };

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${firaCode.className} antialiased selection:bg-primary/30 selection:text-primary-dark`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
