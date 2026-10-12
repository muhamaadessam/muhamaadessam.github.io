# Task: Improve visitor analytics on the portfolio site

Before writing any code, read `AGENTS.md` and the relevant guides in `node_modules/next/dist/docs/`. This Next.js version has breaking changes compared to what you may know.

## Current state

- `src/components/VisitorTracker.tsx` calls `trackVisitor()` from `src/lib/services.ts`.
- It is mounted only in `src/app/page.tsx`, so `/projects/[id]` pages are not tracked.
- `trackVisitor()` runs on the client and does this:
  - It creates `visitor_id = Date.now().toString()` in localStorage.
  - It does 2 Firestore reads and 2-3 writes directly from the browser: `visitors/{id}` and `stats/visitors`.
  - It POSTs `{ visitorId, isNewVisitor, totalUnique, totalVisits }` to `/api/visitor` on the external contact-API project, which sends a Telegram notification.
  - It then calls `trackPortfolioEvent('page_view', 'homepage')`.
- Other tracking functions in `services.ts`: `trackPortfolioEvent`, `trackProjectEvent`, `incrementCvDownloadCount`. Current events: `page_view`, `project_click`, `cv_download`, `contact_submit`, `external_link_click`.
- `src/lib/adminServices.ts` reads these stats for the admin dashboard (`src/app/admin/dashboard/page.tsx`).

We only know that someone visited. We do not know who they roughly are, where they came from, or what they did. Existing data is aggregate counters only, so there is no per-visitor timeline.

## Goal

Collect richer visitor data without asking the visitor for anything. Do not store IPs, do not fingerprint, and do not use third-party cookies. Because of that, a cookie banner should not be needed.

### Phase 1 (do this first)

1. **Traffic source**
   - Capture `document.referrer` (hostname only), plus `utm_source`, `utm_medium` and `utm_campaign` from the URL.
   - Support a custom `?ref=<name>` param, for example `?ref=acme`, so I can see when a specific company opens the portfolio. I will put `?utm_source=cv` in my CV and `?utm_source=linkedin` on my LinkedIn profile.
   - Persist the first-touch source for the visitor, and also send it for each session.
2. **Country and city**
   - The `/api/visitor` endpoint is a separate Vercel project (`portfolio-contact-api-muhammad-essam`). If its source is not in this repo, do not guess at it.
   - Instead, add a small Next.js route handler in this repo, for example `src/app/api/track/route.ts`, that reads `x-vercel-ip-country`, `x-vercel-ip-city` and `x-vercel-ip-country-region`. It should return them or write them directly. Never store the IP.
3. **Device info**
   - Device type (mobile, tablet or desktop), browser, OS, screen size, `navigator.language` and timezone.
   - Parse the user agent server-side in the route handler, or use a tiny helper. Do not add a heavy dependency.
4. **Telegram message**
   - Include the new data in the visitor notification payload.
   - Example: "New visitor from Egypt (Cairo), came from LinkedIn, mobile Safari, Arabic".
   - If the Telegram sender lives in the external API repo, extend the payload from this side and list the exact fields the other side must read.

### Phase 2

5. **Session and event timeline**
   - Add a `sessionId` generated per browser session (`sessionStorage` with `crypto.randomUUID()`).
   - Store events with `visitorId`, `sessionId`, event name, target and timestamp, so each visitor has a timeline (for example: viewed project X, then downloaded CV).
   - Keep the existing aggregate counters working so the admin dashboard does not break.
6. **Engagement**
   - Time on page: send on `visibilitychange` and `pagehide` using `navigator.sendBeacon`.
   - Scroll depth, plus which sections were actually seen (Experience, Projects, Contact), via IntersectionObserver. This should show, for example, that 70% of visitors leave before reaching Projects.
7. **Track all pages**
   - Mount the tracker in the root layout, or equivalent, so `/projects/[id]` visits count. Do not double-count page views.

### Fixes to the current code

- Replace `Date.now()` visitor IDs with `crypto.randomUUID()`. Two visitors in the same millisecond currently get the same ID. Keep existing IDs for returning visitors, because old data is keyed by them.
- Move the Firestore writes from the client to the server (the route handler), so the numbers cannot be spoofed from the browser. Check `firestore.rules` and tighten them if the client no longer needs write access. Do not break the admin dashboard reads.
- Reduce the number of Firestore reads and writes per visit.
- Send tracking calls non-blocking, and never let a tracking failure affect page rendering.

### Admin dashboard

Show the new data in `src/app/admin/dashboard/page.tsx` and `adminServices.ts`:
- top sources and referrers, including `ref` values per company
- top countries and cities
- device, browser and OS split
- average time on page
- section reach, as a funnel
- a per-visitor timeline if Phase 2 is implemented

## Optional alternative

If building all of this by hand turns out too heavy, mention it in the summary instead of silently switching. `@vercel/analytics` or PostHog give source, country, device, time on page and funnels out of the box. They could run alongside the current system, which would stay responsible for Telegram notifications and the admin dashboard. Do not add either unless I ask.

## Constraints

- Match the existing code style, naming and comment density.
- No new heavy dependencies.
- Keep the page fast. Tracking must not hurt LCP, so run it after load or idle.
- Respect Do Not Track (`navigator.doNotTrack === '1'`): skip the detailed tracking in that case.
- Run lint, typecheck and build at the end. Fix whatever you broke.
- Commit in small logical steps.

## Deliverable

Summarize what changed, which env vars or external-API changes I need to make myself, and any Firestore rules or index changes I need to deploy.
