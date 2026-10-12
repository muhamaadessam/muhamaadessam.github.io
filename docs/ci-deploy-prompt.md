# Task: Enable automatic deployment to Stellar from GitHub Actions

Read `AGENTS.md` first. Then read `docs/DEPLOY-STELLAR.md` and `docs/STELLAR-DEPLOYMENT-REVIEW.md` (your earlier work). The site is live at `https://muhammadessam.me` on Namecheap Stellar (cPanel Node app `portfolio-app`, Passenger) behind Cloudflare. The repo is `muhamaadessam/muhamaadessam.github.io`.

## Context

- Claude added two local commits on top of `origin/main` (not pushed yet):
  - `5f1dc44`: visits and the Telegram visitor notification are now counted once per session, on the first `page_view` only, instead of on every page view.
  - `9a956be`: `.github/workflows/deploy-stellar.yml`, which on every push to `main` runs lint, typecheck and tests, builds the release with `scripts/package-stellar.sh`, uploads it to Stellar with rsync over SSH, restarts the app by touching `tmp/restart.txt`, and smoke-tests the site.
- That workflow needs these GitHub settings, which do not exist yet:
  - Secrets: `STELLAR_HOST`, `STELLAR_USER`, `STELLAR_PORT`, `STELLAR_SSH_KEY`, `STELLAR_KNOWN_HOSTS`
  - Variables: `STELLAR_APP_DIR`, `NEXT_PUBLIC_CONTACT_ENDPOINT`
- Goal: make this pipeline actually work, with the user's approval at each sensitive step.

## Do this

1. **Review the workflow and the two commits.** Read `deploy-stellar.yml` critically. Check the rsync excludes against the real layout of `/home/konobbue/portfolio-app` on Stellar. A `--delete` run must never remove runtime-owned paths (`.next/cache`, `tmp`, `stderr.log`, `.htaccess`, anything cPanel created) and must keep the app working under Passenger. Also check the `node_modules` handling: the report mentioned that cPanel's Node selector can create a symlink named `node_modules`. If rsync would replace or break it, fix the workflow and explain how. Fix any bug you find and say what you changed.
2. **Check SSH access on the Stellar account.** In cPanel, find out whether SSH access is enabled, what the real SSH port is (Namecheap shared hosting normally uses 21098), and whether `rsync` exists on the server. If SSH is not enabled, tell me how to enable it. If `rsync` is missing, change the workflow to a safe fallback (for example `scp`/`sftp` of the zip plus an extract step over SSH) and keep the same exclusions.
3. **Create a dedicated deploy key.** Generate a new SSH key pair used only for this deployment (for example `ed25519`, no passphrase, comment `github-actions-portfolio-deploy`). Authorize the public key in cPanel. Keep the private key only in `~/.config/portfolio-stellar/` with mode 600 until it is in GitHub. If the server supports it, restrict the key (for example with a `from=` or `command=` limit) and say what you did. Do not reuse my personal key. Do not print the private key anywhere.
4. **Set the GitHub secrets and variables.** Use `gh` if it is authenticated and I approve, or give me exact commands/steps if not. The `STELLAR_KNOWN_HOSTS` value must come from `ssh-keyscan -p <port> server144.web-hosting.com`. Verify the fingerprint against what cPanel reports before trusting it. Set `STELLAR_APP_DIR=/home/konobbue/portfolio-app` and `NEXT_PUBLIC_CONTACT_ENDPOINT` to the Vercel backend's `/api/contact` URL (the same one used when the current release was built). Confirm the names exist without printing secret values.
5. **Dry run before the real deploy.** Before pushing, test the upload step safely: run rsync with `--dry-run` against the real app directory using the new key, and show me the list of files it would add, change or delete. Stop and show me if it would delete anything unexpected. Also confirm that the build in CI would use the same `NEXT_PUBLIC_CONTACT_ENDPOINT` as the current production build.
6. **Push and watch.** After my approval, push `main` (this includes `5f1dc44` and `9a956be`). Watch the "Deploy to Stellar" run to the end. If it fails, read the logs, fix the cause in a new commit and re-run. Do not retry blindly.
7. **Verify in production after the first deploy:**
   - the site loads and a new static asset hash matches the new build;
   - `cPanel Resource Usage` and `stderr.log` look normal;
   - open the site once with `?utm_source=deploy-check`, click through two or three pages, and confirm that exactly **one** Telegram visitor notification arrives for that session, and that the visit counter increased by exactly one. Ask me to confirm what I received. Remove that test session afterwards the same way you did last time, and keep the earlier history intact.
8. **Update docs.** Add a "Automatic deploy" section to `docs/DEPLOY-STELLAR.md` covering: how the pipeline works, the secrets/variables table (names only), how to rotate the deploy key, how to roll back (re-run an older commit's workflow, or restore the previous zip), what to do if a deploy leaves the site down, and how to disable the workflow quickly. Keep `.github/workflows/nextjs.yml` as the pull-request check, and make sure the two workflows do not do duplicate heavy work on the same push without a reason. If they overlap, say so and propose how to avoid it.

## Rules

- Ask before each action that changes something outside the repo: creating the SSH key on the server, writing GitHub secrets, pushing, and the first real deploy.
- Never print the private key, the known-hosts content is fine, and no other secret values either.
- Do not touch other apps on the Stellar account (jahez-dev, konoz-app, twafok-landing) or Cloudflare/DNS.
- Do not change the Firestore rules or indexes.
- Keep repo changes in small commits with clear messages.

## Final summary

End with a table: item, status (done / verified / not verified / needs my action), and evidence. List clearly anything I must do myself.
