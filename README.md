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

Telegram notifications are sent through a server-side endpoint. Telegram credentials must never be stored in Firestore or bundled into frontend code.

This repo includes a deployable endpoint at `api/send-telegram.ts`. Configure these environment variables on the server that hosts that endpoint:

```bash
TELEGRAM_BOT_TOKEN=your-regenerated-token
TELEGRAM_CHAT_ID=your-chat-id
CONTACT_ALLOWED_ORIGIN=https://muhamaadessam.github.io
```

Configure the static portfolio build with the public endpoint URL:

```bash
NEXT_PUBLIC_CONTACT_ENDPOINT=https://your-secure-api.example.com/api/send-telegram
```

GitHub Pages cannot run server-side API routes, so the endpoint must be hosted on a serverless/backend platform and the static site must call it via `NEXT_PUBLIC_CONTACT_ENDPOINT`.

The contact form saves messages to Firestore, then requires Telegram to respond successfully before showing success.

After the previous exposure, regenerate the Telegram bot token in BotFather and delete the old `config/telegram` Firestore document.

## Contact

- Portfolio: https://muhamaadessam.github.io/
- LinkedIn: https://www.linkedin.com/in/muhammadessam159/
- GitHub: https://github.com/muhamaadessam
