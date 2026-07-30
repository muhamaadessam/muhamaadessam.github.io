# Muhammad Essam Portfolio

Professional portfolio for Muhammad Essam, a Flutter Developer focused on production-ready Android and iOS applications.

Live site: https://muhamaadessam.github.io/

## About

This portfolio is built to help recruiters and clients quickly understand Muhammad's mobile development experience, technical stack, project work, and contact paths.

## Features

- Recruiter-focused hero with Flutter, Dart, BLoC, Clean Architecture, Firebase, REST APIs, and production app positioning
- Featured project cards with role, stack, project type/status, links, and testing-group calls to action
- Static project detail pages generated for GitHub Pages refresh/direct-link support
- Contact form with Firestore message saving and optional secure external notification endpoint
- Lightweight event tracking for page views, project clicks, CV downloads, contact submits, and external links
- SEO metadata, Open Graph/Twitter cards, sitemap, robots, and JSON-LD Person schema

## Tech Stack

- Next.js static export
- React
- TypeScript
- Tailwind CSS
- Firebase Firestore
- Framer Motion

## Architecture

- `src/app/page.tsx` fetches portfolio data once at build time and passes it to client sections.
- `src/app/projects/[id]/page.tsx` generates static project routes with `generateStaticParams()`.
- `src/app/projects/[id]/ProjectDetailsClient.tsx` owns interactive project UI such as screenshots and lightbox behavior.
- `src/lib/services.ts` contains Firebase reads, Firestore writes, and privacy-light analytics helpers.

## Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run lint
npm run build
```

The static export is emitted by Next.js for GitHub Pages.

## Contact Notification Endpoint

Telegram notifications are sent from the frontend using the Firestore document `config/telegram`.

Expected fields:

- `bot_token`
- `chat_id`

This keeps the notification flow simple for GitHub Pages, but it means the bot token can be exposed to visitors who inspect network traffic if your Firestore rules allow this document to be read publicly. For stronger security, move this back behind a backend endpoint later.

The contact form saves messages to Firestore, then requires Telegram to respond successfully before showing success.

## Contact

- Portfolio: https://muhamaadessam.github.io/
- LinkedIn: https://www.linkedin.com/in/muhammadessam159/
- GitHub: https://github.com/muhamaadessam
