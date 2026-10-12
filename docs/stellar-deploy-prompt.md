# Task: Prepare the portfolio for deployment on Namecheap Stellar (shared hosting) behind Cloudflare

Before writing any code, read `AGENTS.md` and the relevant guides in `node_modules/next/dist/docs/`. This Next.js version has breaking changes compared to what you may know.

## Context

- The site is a Next.js app (App Router) that now needs a running Node server, because `POST /api/track` and ISR are used. `output: 'export'` was removed earlier.
- It will NOT be deployed on Vercel. It will run on **Namecheap Stellar shared hosting** through **cPanel -> Setup Node.js App** (CloudLinux + Passenger), on the same account that already hosts another Node project (an interviews dev tool) on a different domain or subdomain.
- **Cloudflare** will sit in front of the domain (proxied). It provides geo headers: `cf-ipcountry` always, and `cf-ipcity` / `cf-region-code` when the "Add visitor location headers" Managed Transform is on.
- The notification backend (`/Users/muhammadessam/Projects/portfolio-contact-api`) stays on **Vercel** and is not part of this task, except for documenting env changes.
- Already done in the working tree (uncommitted unless you see them in `git log`):
  - `src/app/api/track/route.ts` reads `cf-ipcountry`, `cf-ipcity`, `cf-region-code` first, then falls back to the `x-vercel-ip-*` headers. It ignores Cloudflare's placeholder values `XX` and `T1`.
  - The same-origin check uses `SITE_ORIGIN` when set (falls back to `request.url` origin), because behind a proxy the internal URL can differ from the public one.
  - `next.config.ts` has `output: 'standalone'`.
  - `.env.example` documents `SITE_ORIGIN`.
  - Typecheck, the 11 tests and `npm run build -- --webpack` passed.
  Review these changes first and commit them if they are correct.

## What to do

### 1. Packaging script
Add `scripts/package-stellar.sh` (or an npm script) that:
- runs a production build using webpack (`npm run build -- --webpack`; Turbopack failed in a restricted environment earlier);
- assembles a clean upload folder, for example `deploy/stellar/`, containing the standalone output, `.next/static` copied to `.next/static` inside it, and `public/`;
- produces a zip, for example `deploy/portfolio-stellar.zip`, ready to upload through cPanel File Manager;
- fails loudly with a clear message if `NEXT_PUBLIC_CONTACT_ENDPOINT` is unset, because `NEXT_PUBLIC_*` values are inlined at build time and changing them on the server has no effect;
- never copies `.env*` files, service-account keys or the `design-system`, `docs`, `functions` and `tests` folders into the bundle;
- adds `deploy/` to `.gitignore`.

### 2. Passenger compatibility
- Verify how the standalone `server.js` binds to its port and host, and whether it works under Passenger. Passenger sets `PORT` (sometimes to a socket path) and expects the app to listen on it.
- If the stock `server.js` is not safe under Passenger, add a small wrapper startup file (for example `scripts/passenger-server.js`, copied into the bundle as `app.js`) that:
  - sets `HOSTNAME` and `PORT` correctly;
  - requires the standalone server;
  - logs startup errors.
- Keep dependencies at zero.

### 3. Memory and process limits
- Stellar has tight memory and process limits (CloudLinux LVE) and shares them with the interviews project.
- Find where the app can run leaner without hurting behaviour: for example `NODE_OPTIONS=--max-old-space-size=...` guidance, and checking that `/api/track` does not keep large data in memory.
- Document the expected memory use, and the symptom of hitting the limit (503 / app restarting).

### 4. ISR cache
- ISR (revalidate = 86400) writes to `.next/cache`. Confirm the folder exists and is writable in the bundle layout, and document the behaviour if it is not.

### 5. Cloudflare compatibility
- Make sure nothing in the app breaks behind Cloudflare: HTTPS redirect loops, `x-forwarded-proto` handling, caching of `/api/track` responses (it must never be cached), and static asset caching headers for `/_next/static`.
- Add `Cache-Control: no-store` to `/api/track` responses if missing.
- Check that `robots.ts`, `sitemap.ts`, canonical URLs and Open Graph images use the final public domain (derive it from `SITE_ORIGIN` or the existing config; do not hard-code a new value if one already exists).
- Cloudflare note: with "Add visitor location headers" enabled, city and region arrive in `cf-ipcity` and `cf-region-code`. Without it, only the country does. Make the Telegram message and admin dashboard cope with a country-only value (no "Unknown, Egypt" style output).

### 6. Environment variables
Write `docs/DEPLOY-STELLAR.md` (Arabic is fine; keep commands in English) with a table of every env var, where it is set, and whether it is build-time or runtime:
- build-time: `NEXT_PUBLIC_CONTACT_ENDPOINT`
- runtime on Stellar (set in the cPanel Node.js App UI): `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (check how newlines in the private key are handled when entered through the cPanel UI, and make `src/lib/analyticsServer.ts` tolerate both literal `\n` and real newlines), `VISITOR_NOTIFICATION_SECRET`, `SITE_ORIGIN`
- on the Vercel backend: `CONTACT_ALLOWED_ORIGIN` set to the new public origin, and the same `VISITOR_NOTIFICATION_SECRET`.

### 7. Deployment guide
In the same doc, write the step-by-step runbook:
1. Cloudflare: add the domain, change nameservers at Namecheap, orange-cloud proxy on, SSL mode **Full (strict)**, enable the Managed Transform "Add visitor location headers".
2. Build and zip locally with the script.
3. cPanel: Setup Node.js App (Node 20 or 22, application root, startup file, domain), upload and extract the zip, add env vars, restart.
4. Update the Vercel backend env vars and redeploy it.
5. Smoke test with real requests (commands included): page loads, `POST /api/track` returns 2xx from the site origin and 403 from another origin, a Telegram notification arrives with country/city/source, a document appears in Firestore `visitor_sessions`, and the admin dashboard shows data.
6. Only after everything works, deploy Firestore:
   ```bash
   firebase deploy --only firestore:indexes   # wait until the index is ready
   firebase deploy --only firestore:rules
   ```
   Explain clearly that the rules block browser writes, so they must go last or tracking breaks.
7. Rollback steps for each stage.
8. Troubleshooting: 503 or app restarts (memory limit), wrong port under Passenger, `cf-ipcity` missing, 403 from `/api/track` (wrong `SITE_ORIGIN`), ISR not refreshing.

### 8. CI
`.github/workflows/nextjs.yml` currently only verifies (lint, tests, build, typecheck). Keep it that way. Optionally add a manual `workflow_dispatch` job that builds the Stellar zip and uploads it as a workflow artifact. Do not add automatic deployment or store credentials.

## Constraints

- Match the existing code style, naming and comment density.
- No new dependencies.
- Do not touch or deploy anything outside this repo. You cannot access cPanel, Cloudflare or Firebase, so do not pretend to run them. Write instructions instead.
- Do not send real Telegram messages or write test data to the production Firestore.
- Do not echo secrets from `.env*` files into docs or output.
- Run `npm run lint`, `npx tsc --noEmit`, `node --test tests/*.test.mjs` and the production build at the end, and fix what you break.
- Commit in small logical steps.

## Deliverable

Summarize what changed and anything I must do manually. Be explicit about what you could not verify, in particular Passenger behaviour on real Stellar hosting, Cloudflare headers in production, and the memory use under the shared account's limits.
