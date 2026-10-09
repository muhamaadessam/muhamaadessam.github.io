import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { randomUUID, generateKeyPairSync } from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';
import { trafficSource, deviceInfo, validTrackingEvent } from '../src/lib/analytics.ts';

const require = createRequire(import.meta.url);
function loadTs(path, overrides = {}, globals = {}) {
  const source = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(source, { exports, require: name => name in overrides ? overrides[name] : require(name), Buffer, Date, URL, URLSearchParams, Request, Response, AbortSignal, console, process, ...globals });
  return exports;
}
const analytics = { trafficSource, deviceInfo, validTrackingEvent, toAnalyticsKey: value => value.replace(/[^a-z0-9]+/gi, '_') };
const source = trafficSource('https://portfolio.test/?utm_source=linkedin&utm_medium=cv&utm_campaign=hiring&ref=acme', 'https://example.com/path?private=secret');
function event(fields = {}) {
  const pageId = randomUUID();
  return { visitorId: randomUUID(), sessionId: randomUUID(), eventId: pageId, pageId, event: 'page_view', target: 'homepage', path: '/', source, firstTouch: source, language: 'ar-EG', timezone: 'Africa/Cairo', screen: '390x844', ...fields };
}

test('source stores only referrer hostname, custom ref and bounded campaign values', () => {
  assert.equal(source.referrer, 'example.com');
  assert.equal(source.ref, 'acme');
  assert.equal(source.utmSource, 'linkedin');
  assert.equal(trafficSource(`https://portfolio.test/?utm_source=${'a'.repeat(200)}`, '').utmSource.length, 80);
  assert.equal(trafficSource('https://portfolio.test/', 'invalid').referrer, '');
});

test('device parser handles browser precedence and mobile/tablet OS', () => {
  assert.deepEqual(deviceInfo('Mozilla iPhone Mobile AppleWebKit Safari'), { device: 'mobile', browser: 'Safari', os: 'iOS' });
  assert.equal(deviceInfo('Windows Chrome Safari Edg/120').browser, 'Edge');
  assert.equal(deviceInfo('Android Tablet Chrome').device, 'tablet');
  assert.equal(deviceInfo('iPad Mac OS Safari').os, 'iOS');
  assert.equal(deviceInfo('iPhone CriOS/120 Mobile Safari').browser, 'Chrome');
});

test('validation accepts legacy IDs and rejects invalid IDs, private paths and spoofed duration', () => {
  const data = event({ visitorId: '1720000000000' });
  assert.equal(validTrackingEvent(data), true);
  for (const patch of [{ visitorId: '../admin' }, { path: '/admin' }, { path: '/?email=secret' }, { event: 'delete' }, { eventId: randomUUID() }, { durationMs: 100 }, { event: 'engagement', durationMs: 300001 }, { event: 'section_view', target: 'projects', path: '/projects/1' }, { source: { ...source, referrer: 'https://private/path' } }]) {
    assert.equal(validTrackingEvent({ ...data, ...patch }), false);
  }
});

function storage() {
  const docs = new Map();
  let revision = 0;
  let fail = false;
  class FirestoreError extends Error { constructor(status, code) { super(); this.status = status; this.code = code; } }
  return {
    docs,
    conflict: () => { fail = true; },
    FirestoreError,
    readDocument: async path => structuredClone(docs.get(path) || { data: {} }),
    writeDocument: (path, data, previous) => ({ path, data: structuredClone(data), previous }),
    quotedField: value => `\`${value}\``,
    incrementFields: (path, fields) => ({ path, increments: fields, transform: { fieldTransforms: Object.entries(fields).map(([fieldPath, value]) => ({ fieldPath, increment: { integerValue: String(value) } })) } }),
    commitWrites: async writes => {
      if (fail) { fail = false; throw new FirestoreError(400, 'FAILED_PRECONDITION'); }
      for (const write of writes) {
        if (write.previous && docs.get(write.path)?.updateTime !== write.previous.updateTime) throw new FirestoreError(409);
      }
      const results = [];
      for (const write of writes) {
        const data = write.updateMask ? { ...docs.get(write.path)?.data, ...write.data } : write.data || { ...docs.get(write.path)?.data };
        const transformResults = [];
        for (const [key, value] of Object.entries(write.increments || Object.fromEntries((write.updateTransforms || []).map(item => [item.fieldPath, Number(item.increment.integerValue)])))) {
          const parts = key.match(/`(?:\\.|[^`])*`|[^.]+/g).map(part => part.replace(/^`|`$/g, '').replace(/\\(.)/g, '$1'));
          let target = data;
          for (const part of parts.slice(0, -1)) target = target[part] ||= {};
          const leaf = parts.at(-1);
          target[leaf] = (target[leaf] || 0) + value;
          transformResults.push({ integerValue: String(target[leaf]) });
        }
        docs.set(write.path, { data, updateTime: String(++revision) });
        results.push({ transformResults });
      }
      return { writeResults: results };
    },
  };
}
function route(db) {
  const notifications = [];
  const pending = [];
  const handlerModule = loadTs('../src/app/api/track/route.ts', { '@/lib/analytics': analytics, '@/lib/analyticsServer': db, 'next/server': { after: callback => pending.push(callback) } }, { fetch: async (url, options) => { notifications.push({ url, payload: JSON.parse(options.body) }); return new Response('{}'); } });
  return {
    notifications,
    send: async data => {
      const response = await handlerModule.POST(new Request('https://portfolio.test/api/track', { method: 'POST', headers: { origin: 'https://portfolio.test', 'content-type': 'application/json', 'x-vercel-ip-country': 'EG', 'x-vercel-ip-city': 'Cairo', 'user-agent': 'iPhone Mobile Safari' }, body: JSON.stringify(data) }));
      for (const callback of pending.splice(0)) await callback();
      return response.status;
    },
    POST: handlerModule.POST,
  };
}

test('atomic recording preserves legacy visits and first touch, deduplicates and retries conflicts', async () => {
  const db = storage();
  db.docs.set('stats/visitors', { data: { users: { '1720000000000': 3 }, total_visitors: 1, total_visites: 3 }, updateTime: 'legacy' });
  const api = route(db);
  const first = event({ visitorId: '1720000000000' });
  db.conflict();
  assert.equal(await api.send(first), 204);
  assert.equal(await api.send(first), 204);
  assert.equal(db.docs.get('visitors/1720000000000').data.visits, 4);
  assert.equal(db.docs.get('stats/visitors').data.total_visitors, 1);
  assert.equal(db.docs.get('stats/visitors').data.total_visites, 4);
  assert.equal(db.docs.get('stats/events').data.page_view, 1);
  assert.equal(api.notifications.length, 1);
  assert.equal(api.notifications[0].payload.totalVisits, 4);
  assert.equal(api.notifications[0].payload.city, 'Cairo');
  assert.equal(api.notifications[0].payload.browser, 'Safari');
  const pageId = randomUUID();
  assert.equal(await api.send({ ...first, pageId, eventId: pageId, path: '/projects/1', firstTouch: { ...source, utmSource: 'spoof' } }), 204);
  assert.equal(db.docs.get('visitors/1720000000000').data.firstTouch.utmSource, 'linkedin');
  assert.equal(db.docs.get('stats/analytics').data.sessions, 1);
  assert.equal(db.docs.get('stats/analytics').data.sources.linkedin, 1);
  assert.equal(db.docs.get('stats/analytics').data.pageViews, 2);
  assert.equal(db.docs.get('stats/visitors').data.users['1720000000000'], 3);
  assert.ok(!JSON.stringify(api.notifications).includes('userAgent'));
});

test('engagement and section reach count per session, project/CV counters remain compatible', async () => {
  const db = storage();
  const api = route(db);
  const first = event();
  assert.equal(await api.send(first), 204);
  const send = patch => api.send({ ...first, eventId: randomUUID(), ...patch });
  await send({ event: 'section_view', target: 'projects' });
  await send({ event: 'section_view', target: 'projects' });
  await send({ event: 'engagement', durationMs: 2000, scrollDepth: 70 });
  await send({ event: 'engagement', durationMs: 1000, scrollDepth: 50 });
  await send({ event: 'project_click', target: 'App', projectId: '1', projectName: 'App' });
  await send({ event: 'cv_download', target: 'cv' });
  const stats = db.docs.get('stats/analytics').data;
  assert.equal(stats.durationMs, 3000);
  assert.equal(stats.scrollDepth, 70);
  assert.equal(stats.sections.projects, 1);
  assert.equal(stats.homepageSessions, 1);
  assert.equal(db.docs.get('stats/cv_downloads').data.count, 1);
  assert.equal(db.docs.get('stats/events').data.cv_download, 1);
  assert.equal(db.docs.get('stats/project_events').data.project_1_opens, 1);
  assert.equal(db.docs.get(`visitor_sessions/${first.sessionId}`).data.durationMs, 3000);
});

test('route rejects cross-origin, DNT, invalid bodies, exhausted sessions and storage failures safely', async () => {
  const db = storage();
  const api = route(db);
  const request = (headers, body = event()) => new Request('https://portfolio.test/api/track', { method: 'POST', headers: { origin: 'https://portfolio.test', 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
  assert.equal((await api.POST(request({ origin: 'https://other.test' }))).status, 403);
  assert.equal((await api.POST(request({ dnt: '1' }))).status, 204);
  assert.equal((await api.POST(request({ 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await api.POST(request({}, '{'))).status, 400);
  assert.equal((await api.POST(request({}, 'a'.repeat(9000)))).status, 413);
  const data = event();
  db.docs.set(`visitor_sessions/${data.sessionId}`, { data: { visitorId: data.visitorId, eventCount: 600 }, updateTime: 'limit' });
  assert.equal(await api.send(data), 429);
  assert.equal(db.docs.size, 1);
});

test('REST service uses OAuth and the atomic commit URL, preserving timestamps and false/zero values', async () => {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
  const urls = [];
  const server = loadTs('../src/lib/analyticsServer.ts', { 'server-only': {} }, {
    process: { env: { FIREBASE_PROJECT_ID: 'test', FIREBASE_CLIENT_EMAIL: 'test@example.com', FIREBASE_PRIVATE_KEY: privateKey } },
    fetch: async url => { urls.push(url); return new Response(JSON.stringify(url.includes('oauth2') ? { access_token: 'test', expires_in: 3600 } : { writeResults: [] })); },
  });
  const value = { timestamp: new Date('2026-01-01T00:00:00Z'), nested: { false: false, zero: 0, list: ['x', 2] } };
  assert.deepEqual(structuredClone(server.decodeValue(server.encodeValue(value))), value);
  assert.equal(server.incrementFields('stats/events', { project_click_تجربة: 1 }).transform.fieldTransforms[0].fieldPath, '`project_click_تجربة`');
  await server.commitWrites([server.incrementFields('stats/visitors', { total_visites: 1 })]);
  await server.commitWrites([]);
  assert.equal(urls[1], 'https://firestore.googleapis.com/v1/projects/test/databases/(default)/documents:commit');
  assert.equal(urls.filter(url => url.includes('oauth2')).length, 1);
});


test('browser preserves IDs and first/session source, uses beacon and isolates tracking failures', () => {
  const local = new Map([['visitor_id', '1720000000000']]);
  const session = new Map();
  const store = values => ({ getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) });
  const sent = [];
  const location = { pathname: '/', href: 'https://portfolio.test/?utm_source=cv&ref=acme' };
  const navigator = { language: 'ar-EG', doNotTrack: '0', sendBeacon: (url, blob) => { sent.push({ url, blob }); return true; } };
  const client = loadTs('../src/lib/analyticsClient.ts', { './analytics': analytics }, { window: {}, navigator, location, document: { referrer: 'https://linkedin.com/private' }, localStorage: store(local), sessionStorage: store(session), crypto: { randomUUID }, screen: { width: 390, height: 844 }, Blob, fetch: (url, options) => { sent.push(JSON.parse(options.body)); return Promise.reject(new Error('offline')); } });
  client.beginAnalyticsPage('/');
  client.sendTracking('cv_download', 'cv');
  assert.equal(sent[0].visitorId, '1720000000000');
  assert.equal(sent[0].pageId, sent[1].pageId);
  location.href = 'https://portfolio.test/projects/1?utm_source=changed';
  location.pathname = '/projects/1';
  client.beginAnalyticsPage('/projects/1');
  assert.equal(sent[2].source.utmSource, 'cv');
  assert.equal(sent[2].firstTouch.ref, 'acme');
  assert.equal(sent[2].sessionId, sent[0].sessionId);
  assert.notEqual(sent[2].pageId, sent[0].pageId);
  client.sendTracking('engagement', '/projects/1', { durationMs: 1000, scrollDepth: 50 }, true);
  assert.ok(sent[3].blob instanceof Blob);
  navigator.doNotTrack = '1';
  client.sendTracking('cv_download', 'cv');
  assert.equal(sent.length, 4);
});

test('blocked browser storage disables tracking without blocking actions', () => {
  const client = loadTs('../src/lib/analyticsClient.ts', { './analytics': analytics }, { window: {}, navigator: { doNotTrack: '0' }, location: { pathname: '/' }, localStorage: { getItem: () => { throw new Error('blocked'); } }, crypto: { randomUUID } });
  assert.doesNotThrow(() => client.sendTracking('cv_download', 'cv'));
});


test('parallel page views and section events preserve exact counters', async () => {
  const db = storage();
  const api = route(db);
  const first = event();
  assert.deepEqual(await Promise.all([api.send(first), api.send(first)]), [204, 204]);
  const section = () => ({ ...first, eventId: randomUUID(), event: 'section_view', target: 'projects' });
  assert.deepEqual(await Promise.all([api.send(section()), api.send(section())]), [204, 204]);
  assert.equal(db.docs.get('stats/analytics').data.sections.projects, 1);
  assert.equal(db.docs.get('stats/visitors').data.total_visites, 1);
  assert.equal(api.notifications.length, 1);
});

test('proxy origin, Cloudflare priority, placeholders and country-only sessions', async () => {
  const db = storage();
  const handler = loadTs('../src/app/api/track/route.ts', { '@/lib/analytics': analytics, '@/lib/analyticsServer': db, 'next/server': { after: () => {} } }, { process: { env: { SITE_ORIGIN: 'https://portfolio.test/' } } });
  const request = (data, headers) => new Request('http://localhost:3000/api/track', { method: 'POST', headers: { origin: 'https://portfolio.test', 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) });
  const first = event();
  const result = await handler.POST(request(first, { 'cf-ipcountry': 'EG', 'cf-ipcity': 'Cairo', 'cf-region-code': 'C', 'x-vercel-ip-country': 'US', 'x-vercel-ip-city': 'Boston' }));
  assert.equal(result.status, 204);
  assert.equal(result.headers.get('cache-control'), 'no-store');
  assert.equal(db.docs.get(`visitor_sessions/${first.sessionId}`).data.country, 'EG');
  assert.equal(db.docs.get(`visitor_sessions/${first.sessionId}`).data.city, 'Cairo');
  const second = event();
  await handler.POST(request(second, { 'cf-ipcountry': 'XX', 'cf-ipcity': 'T1', 'x-vercel-ip-country': 'EG' }));
  assert.equal(db.docs.get(`visitor_sessions/${second.sessionId}`).data.city, '');
  assert.equal(db.docs.get('stats/analytics').data.cities.EG, 1);
  const rejected = await handler.POST(request(event(), { origin: 'https://other.test' }));
  assert.equal(rejected.status, 403);
  assert.equal(rejected.headers.get('cache-control'), 'no-store');
  const invalid = await handler.POST(request({}, {}));
  assert.equal(invalid.status, 400);
  assert.equal(invalid.headers.get('cache-control'), 'no-store');
});

test('service account accepts literal backslash newlines from cPanel', async () => {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
  const server = loadTs('../src/lib/analyticsServer.ts', { 'server-only': {} }, {
    process: { env: { FIREBASE_PROJECT_ID: 'test', FIREBASE_CLIENT_EMAIL: 'test@example.com', FIREBASE_PRIVATE_KEY: privateKey.replaceAll('\n', '\\n') } },
    fetch: async url => new Response(JSON.stringify(url.includes('oauth2') ? { access_token: 'test', expires_in: 3600 } : { writeResults: [] })),
  });
  await server.commitWrites([]);
});
