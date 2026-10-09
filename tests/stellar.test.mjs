import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const startup = readFileSync(new URL('../scripts/passenger-server.cjs', import.meta.url), 'utf8');
test('startup preserves TCP and socket binding, defers to Passenger and reports failure', () => {
  for (const [port, passenger, expected] of [['8080', false, 8080], ['/tmp/stellar.sock', false, '/tmp/stellar.sock'], ['/tmp/passenger.sock', true, 3000]]) {
    const calls = [];
    class Server { listen(...args) { calls.push(args); } }
    const process = { env: { PORT: port, HOSTNAME: 'machine-name' } };
    vm.runInNewContext(startup, { global: { PhusionPassenger: passenger }, process, console, require: name => {
      if (name === 'node:http') return { Server };
      assert.equal(name, './server.js');
      new Server().listen(parseInt(process.env.PORT, 10), process.env.HOSTNAME);
    } });
    assert.equal(calls[0][0], expected);
    assert.equal(process.env.HOSTNAME, '0.0.0.0');
    if (typeof expected === 'string') assert.equal(calls[0].length, 1);
  }
  let exit;
  let logged;
  vm.runInNewContext(startup, { global: {}, process: { env: {}, exit: code => { exit = code; } }, console: { error: (...args) => { logged = args; } }, require: name => {
    if (name === 'node:http') return {};
    throw Object.assign(new Error('private details'), { code: 'ENOENT' });
  } });
  assert.equal(exit, 1);
  assert.deepEqual(Array.from(logged), ['Stellar startup failed:', 'ENOENT']);
});

test('packaging requires build env, excludes private files and creates a clean zip', () => {
  const dir = mkdtempSync(join(tmpdir(), 'stellar-package-'));
  try {
    for (const folder of ['scripts', 'bin', '.next/standalone/.next/server/app', '.next/static', 'public', '.next/standalone/docs']) mkdirSync(join(dir, folder), { recursive: true });
    writeFileSync(join(dir, 'scripts/package-stellar.sh'), readFileSync(new URL('../scripts/package-stellar.sh', import.meta.url)));
    writeFileSync(join(dir, 'scripts/passenger-server.cjs'), startup);
    writeFileSync(join(dir, 'bin/npm'), '#!/bin/sh\n[ "$*" = "run build -- --webpack" ]\n', { mode: 0o755 });
    for (const file of ['.next/standalone/server.js', '.next/static/test.js', 'public/test.txt', '.next/standalone/.env.production', '.next/standalone/docs/private.txt', 'public/key.pem', 'public/service-account.json']) writeFileSync(join(dir, file), 'fixture');
    const env = { ...process.env, PATH: `${join(dir, 'bin')}:${process.env.PATH}`, NEXT_PUBLIC_CONTACT_ENDPOINT: '' };
    const run = () => spawnSync('bash', ['scripts/package-stellar.sh'], { cwd: dir, env, encoding: 'utf8' });
    assert.equal(run().status, 1);
    env.NEXT_PUBLIC_CONTACT_ENDPOINT = 'https://api.example.test/api/contact';
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.ok(existsSync(join(dir, 'deploy/portfolio-stellar.zip')));
    for (const file of ['server.js', 'app.js', '.next/static/test.js', 'public/test.txt', '.next/cache']) assert.ok(existsSync(join(dir, 'deploy/stellar', file)));
    for (const file of ['.env.production', 'docs', 'public/key.pem', 'public/service-account.json']) assert.equal(existsSync(join(dir, 'deploy/stellar', file)), false);
    writeFileSync(join(dir, 'public/credentials.json'), '{"private_key":"secret"}');
    assert.notEqual(run().status, 0);
    assert.equal(existsSync(join(dir, 'deploy/portfolio-stellar.zip')), false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
