# Muhammad Essam Portfolio

Professional portfolio for Muhammad Essam, a Flutter Developer focused on production-ready Android and iOS applications.

Live site: https://muhamaadessam.github.io/

## About

This portfolio is built to help recruiters and clients quickly understand Muhammad's mobile development experience, technical stack, project work, and contact paths.

## Features

- Recruiter-focused hero with Flutter, Dart, BLoC, Clean Architecture, Firebase, REST APIs, and production app positioning
- Featured project cards with role, stack, project type/status, links, and testing-group calls to action
- Static project detail pages generated for GitHub Pages refresh/direct-link support
- Contact form delivered through a secure external notification endpoint
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
- `src/lib/constants.ts` holds shared links (CV, LinkedIn, GitHub) so they are updated in one place.

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

## Content Updates

Projects, experience, skills, and profile data live in Firestore and are edited from the `/admin` dashboard. Because the site is a static export, Firestore changes go live on the next build. The deploy workflow runs on every push to `main`, once a day on a schedule, and can be triggered manually from the Actions tab (`workflow_dispatch`).

## Firestore Security Rules

`firestore.rules` only lets the portfolio owner write content and read private data (messages, Telegram logs). Before deploying the rules, replace `REPLACE_WITH_ADMIN_UID` with your Firebase Auth UID (Firebase Console → Authentication → Users), then run:

```bash
firebase deploy --only firestore:rules
```

Also disable public sign-up in Firebase Console (Authentication → Settings → User actions) so only the existing admin account can sign in.

## Contact Notification Endpoint

The contact form, visitor notifications, and CV download notifications are sent to a separate serverless API (hosted outside this repo) that forwards them to Telegram. Telegram credentials must never be stored in Firestore or bundled into frontend code; configure them only on the server that hosts the API:

```bash
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
CONTACT_ALLOWED_ORIGIN=https://muhamaadessam.github.io
```

Configure the static portfolio build with the public endpoint URL:

```bash
NEXT_PUBLIC_CONTACT_ENDPOINT=https://your-secure-api.example.com/api/contact
```

The `/visitor` and `/cv-download` endpoints are derived from this URL by replacing `/contact`. GitHub Pages cannot run server-side API routes, so the endpoint must be hosted on a serverless/backend platform.

## Contact

- Portfolio: https://muhamaadessam.github.io/
- LinkedIn: https://www.linkedin.com/in/muhammadessam159/
- GitHub: https://github.com/muhamaadessam
