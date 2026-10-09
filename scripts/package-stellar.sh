#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

endpoint="${NEXT_PUBLIC_CONTACT_ENDPOINT:-}"
if [[ -z "${endpoint//[[:space:]]/}" ]]; then
  echo 'Error: export NEXT_PUBLIC_CONTACT_ENDPOINT before packaging; it is inlined at build time.' >&2
  exit 1
fi
for tool in node npm rsync zip; do
  command -v "$tool" >/dev/null || { echo "Error: missing required tool: $tool" >&2; exit 1; }
done
npm run build -- --webpack
test -f .next/standalone/server.js || { echo 'Error: standalone server.js is missing.' >&2; exit 1; }
rm -rf deploy/stellar deploy/portfolio-stellar.zip
mkdir -p deploy/stellar/.next/cache
exclude=(--exclude='.env*' --exclude='*.pem' --exclude='*.key' --exclude='*service-account*' --exclude='*serviceAccount*' --exclude='design-system' --exclude='docs' --exclude='functions' --exclude='tests' --exclude='.DS_Store')
node <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
function check(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (/^(?:\.env|.*service-account|.*serviceAccount)/.test(entry.name) || /\.(?:pem|key)$/.test(entry.name) || ['design-system', 'docs', 'functions', 'tests'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Bundle contains a symlink: ${file}`);
    if (entry.isDirectory()) check(file);
    else if (entry.name.endsWith('.json') && /"private_key"\s*:/.test(fs.readFileSync(file, 'utf8'))) {
      throw new Error(`Bundle contains a possible service-account key: ${file}`);
    }
  }
}
for (const dir of ['.next/standalone', '.next/static', 'public']) check(dir);
NODE
rsync -a "${exclude[@]}" .next/standalone/ deploy/stellar/
rsync -a "${exclude[@]}" .next/static/ deploy/stellar/.next/static/
rsync -a "${exclude[@]}" public/ deploy/stellar/public/
cp scripts/passenger-server.cjs deploy/stellar/app.js
node <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
for (const dir of ['.next/cache', '.next/server', '.next/server/app']) {
  fs.accessSync(path.join('deploy/stellar', dir), fs.constants.W_OK);
}
NODE
(cd deploy/stellar && zip -qr ../portfolio-stellar.zip .)
echo 'Ready: deploy/portfolio-stellar.zip (extract directly into the cPanel application root).'
