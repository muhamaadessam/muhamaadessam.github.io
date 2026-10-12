# Task: Finish and verify the Stellar deployment (follow-up)

Read `AGENTS.md` first. Then read `docs/STELLAR-DEPLOYMENT-REVIEW.md`, which is your own report of the deployment. The site is live at `https://muhammadessam.me` (Namecheap Stellar + Passenger + Cloudflare). The notification backend stays on Vercel.

The report lists what was left unverified. This task closes those gaps. Be honest in the final summary: say what you verified, what you could not, and why.

## Ground rules

- I (the user) approve one real test visit now. Use it **once**. If the automatic reviewer blocks opening the browser or sending the request, do not work around it with another browser, a different tool or a forged request. Stop, tell me exactly what to do manually, and wait.
- Do not write test data into production beyond that one visit, and clean up that one test session afterwards if you can do it safely (identify it by `utm_source=stellar-smoke`).
- Never print private keys, tokens or the notification secret, not even partially. Check secrets by existence or length only.
- Do not change nameservers or the registrar. Do not touch the other apps on the Stellar account (jahez-dev, konoz-app, twafok-landing).
- Commit repo changes in small logical steps. The backend folder `/Users/muhammadessam/Projects/portfolio-contact-api` is not a git repo: describe any change there precisely instead of committing.

## 1. Verify real tracking end to end (highest priority)

Open `https://muhammadessam.me/?utm_source=stellar-smoke&ref=smoke` once, in a real browser session, and scroll through the page. Then confirm each of these and report the evidence:

1. A `visitor_sessions` document exists with the right `utm_source`/`ref`, country, device, browser and OS. If the city is missing, check whether the Cloudflare "Add visitor location headers" Managed Transform actually reaches the origin (`cf-ipcity`, `cf-region-code`).
2. `visitor_events` has the events for that session, and `stats/*` counters incremented.
3. Exactly one Telegram visitor notification arrived, with correct location, source and company tag. Ask me to confirm what I received if you cannot read Telegram.
4. The admin dashboard (login at `/admin`; ask me to log in if needed) shows the session, the source breakdown, the country and the timeline.
5. Time on page and scroll depth are recorded when the tab is closed (`sendBeacon`).

If the write path fails, diagnose from cPanel Node logs and fix the cause. The usual suspects: private-key newline handling, IAM, `SITE_ORIGIN` mismatch, or a Cloudflare WAF rule blocking `POST /api/track`.

## 2. Close the security and cleanup gaps

1. Delete `/tmp/stellar-secrets` if it still exists. Keep only `~/.config/portfolio-stellar` (mode 700 directory, 600 files). Check shell history and any logs you control for leaked key fragments.
2. Check that the service account `portfolio-stellar@...` has only `roles/datastore.user`. Say so if broader access was granted anywhere.
3. Tell me whether the gcloud OAuth login with broad scopes is still active, and give me the exact revoke command. Do not run it without asking.
4. Check whether the old Firebase Admin SDK key (`firebase-adminsdk-fbsvc`) is still valid. Do not rotate or delete anything. Just report what exists.
5. Origin lockdown: the origin IP `162.213.255.30` is directly reachable. Investigate whether Stellar/cPanel allows restricting access to Cloudflare IP ranges (`.htaccess` or equivalent). Look at what is possible and document it. Only implement it if it is safe and cannot affect the other apps on the account, and ask me before applying.

## 3. Fix the stale documentation

- `docs/DEPLOY-STELLAR.md` was written before deployment. Update it to describe the final state: it is deployed, Passenger works on Stellar (note what was actually verified), the real env vars, the Cloudflare rules that exist (cache bypass for `/api/*` and `/admin*`, the 308 canonical redirect), the origin certificate expiry on **9 Oct 2027**, and a short renewal procedure.
- Remove statements like "services were not deployed" or "Passenger was not tested on Stellar".
- In `.env.example`, change the `CONTACT_ALLOWED_ORIGIN` example from the old GitHub Pages origin to `https://muhammadessam.me`.
- Add a short "Operations" section to the deployment guide: how to ship an update (build, zip, upload, extract over the app root, restart), how to roll back (keep the previous zip), how to check logs and resource usage, and where the backup DNS file is.
- Do not put secrets, account IDs of private value, or key IDs in the guide. Zone/account IDs may stay only if they are already in the review report.

## 4. Remaining verification (do what you safely can)

1. **Contact form:** do not submit a real message. Verify via code and a read-only check that the form posts to the right endpoint and that Vercel `CONTACT_ALLOWED_ORIGIN` equals `https://muhammadessam.me`. Ask me before any real submission.
2. **CV download notification:** same rule: verify the wiring, and ask me before a real download event.
3. **ISR:** confirm the `.next/server` and `.next/cache` paths are writable by the app user on Stellar and that there are no cache write errors in the logs. A full 86400 s revalidation test is not required; say it is untested.
4. **Resource usage:** take another cPanel Resource Usage snapshot after a few real page loads and report memory, NPROC, entry processes and faults, next to the earlier numbers.
5. **Cert renewal reminder:** add a calendar reminder for 2 weeks before 9 Oct 2027 if I have a calendar tool connected. Otherwise tell me to add it.

## 5. Reconcile git

- Commit the doc and `.env.example` updates.
- `docs/visitor-analytics-prompt.md` and `docs/stellar-deploy-prompt.md` are untracked prompt files. Leave them alone unless I ask.
- Commit `docs/STELLAR-DEPLOYMENT-REVIEW.md` if it is still accurate after this task, and update it with the new verification results and a clear "verified / not verified" table.

## Final summary

End with a table: item, status (verified / fixed / not verified / needs my action), evidence. Be explicit about anything that still needs me.
