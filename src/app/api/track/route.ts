import { after } from 'next/server';
import { deviceInfo, toAnalyticsKey, validTrackingEvent, type TrackingEvent } from '@/lib/analytics';
import { commitWrites, FirestoreError, incrementFields, quotedField, readDocument, writeDocument } from '@/lib/analyticsServer';

export const runtime = 'nodejs';

function geoValue(request: Request, ...headers: string[]) {
  for (const header of headers) {
    try {
      const value = decodeURIComponent(request.headers.get(header) || '').slice(0, 120);
      if (value && value !== 'XX' && value !== 'T1') return value;
    } catch { /* try the next header */ }
  }
  return '';
}

// Behind Cloudflare/Passenger, request.url can carry the internal origin, so the public one can be set explicitly.
function allowedOrigin(request: Request) {
  return process.env.SITE_ORIGIN?.replace(/\/$/, '') || new URL(request.url).origin;
}

async function notify(kind: 'visitor' | 'cv-download', payload: object) {
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || 'https://portfolio-contact-api-muhammad-essam.vercel.app/api/contact';
  try {
    const response = await fetch(endpoint.replace(/\/contact\/?$/, `/${kind}`), { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.VISITOR_NOTIFICATION_SECRET ? { Authorization: `Bearer ${process.env.VISITOR_NOTIFICATION_SECRET}` } : {}) }, body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
    if (!response.ok) console.error(`Analytics ${kind} notification failed (${response.status})`);
  } catch { console.error(`Analytics ${kind} notification failed`); }
}

async function record(event: TrackingEvent, request: Request) {
  const eventPath = `visitor_events/${event.eventId}`;
  const sessionPath = `visitor_sessions/${event.sessionId}`;
  const visitorPath = `visitors/${event.visitorId}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const session = await readDocument(sessionPath);
    if (session.updateTime && session.data.visitorId !== event.visitorId) throw new FirestoreError(400);
    if (Number(session.data.eventCount || 0) >= 600) throw new FirestoreError(429);
    const now = new Date().toISOString();
    const firstSessionEvent = !session.updateTime;
    const geography = { country: geoValue(request, 'cf-ipcountry', 'x-vercel-ip-country') || 'Unknown', city: geoValue(request, 'cf-ipcity', 'x-vercel-ip-city'), region: geoValue(request, 'cf-region-code', 'cf-region', 'x-vercel-ip-country-region') };
    const device = deviceInfo(request.headers.get('user-agent') || '');
    const sessionData = firstSessionEvent ? {
      visitorId: event.visitorId, source: event.source, firstTouch: event.firstTouch, ...geography, ...device,
      language: event.language, timezone: event.timezone, screen: event.screen, startedAt: now, pageViewCounted: false,
    } : session.data;
    const analytics: Record<string, number> = {};
    if (firstSessionEvent) {
      analytics.sessions = 1;
      // shortcut: dimension counters share a document; partition them if source/city cardinality approaches Firestore's 1 MiB limit.
      const dimensions = { sources: event.source.utmSource || event.source.referrer || 'Direct', referrers: event.source.referrer || 'Direct', companies: event.source.ref || 'Unspecified', countries: geography.country, cities: geography.city ? `${geography.country} / ${geography.city}` : geography.country, devices: device.device, browsers: device.browser, operatingSystems: device.os };
      for (const [dimension, label] of Object.entries(dimensions)) analytics[`${dimension}.${quotedField(label)}`] = 1;
    }
    const sections = Array.isArray(sessionData.sections) ? sessionData.sections as string[] : [];
    if (event.path === '/' && !sessionData.homepage) analytics.homepageSessions = 1;
    if (event.event === 'section_view' && !sections.includes(event.target)) {
      sections.push(event.target);
      analytics[`sections.${event.target}`] = 1;
    }
    if (event.event === 'engagement') {
      analytics.durationMs = event.durationMs || 0;
      analytics.scrollDepth = Math.max(0, (event.scrollDepth || 0) - Number(sessionData.scrollDepth || 0));
    }
    const writes: object[] = [
      writeDocument(eventPath, { visitorId: event.visitorId, sessionId: event.sessionId, pageId: event.pageId, event: event.event, target: event.target, path: event.path, timestamp: now, ...(event.durationMs !== undefined ? { durationMs: event.durationMs, scrollDepth: event.scrollDepth || 0 } : {}), ...(event.projectId ? { projectId: event.projectId } : {}), ...(event.projectName ? { projectName: event.projectName } : {}), ...(event.button ? { button: event.button } : {}) }, { data: {} }),
    ];
    let notification: Record<string, unknown> | undefined;
    let visitorTotalsWrite = -1;
    if (event.event === 'page_view') analytics.pageViews = 1;
    // Visits and the Telegram notice count sessions, not every page view inside one.
    if (event.event === 'page_view') {
      const countVisit = firstSessionEvent || sessionData.pageViewCounted === false;
      analytics.pageViews = 1;
      sessionData.pageViewCounted = true;
      if (countVisit) {
        const visitor = await readDocument(visitorPath);
        const totals = visitor.updateTime ? { data: {} as Record<string, unknown> } : await readDocument('stats/visitors');
        const legacy = totals.data.users as Record<string, number> | undefined;
        const visits = Number(visitor.data.visits ?? legacy?.[event.visitorId]) || 0;
        const isNewVisitor = visits === 0;
        sessionData.firstTouch = visitor.data.firstTouch || event.firstTouch;
        writes.push(writeDocument(visitorPath, { ...visitor.data, visits: visits + 1, firstSeen: visitor.data.firstSeen || new Date(now), lastSeen: new Date(now), firstTouch: visitor.data.firstTouch || event.firstTouch }, visitor));
        visitorTotalsWrite = writes.length;
        writes.push(incrementFields('stats/visitors', { total_visitors: isNewVisitor ? 1 : 0, total_visites: 1 }));
        notification = { visitorId: event.visitorId, sessionId: event.sessionId, isNewVisitor, source: sessionData.source, firstTouch: visitor.data.firstTouch || event.firstTouch, country: sessionData.country, city: sessionData.city, region: sessionData.region, device: sessionData.device, browser: sessionData.browser, os: sessionData.os, screen: sessionData.screen, language: sessionData.language, timezone: sessionData.timezone, path: event.path };
      }
    }
    if (!['engagement', 'section_view'].includes(event.event)) {
      writes.push(incrementFields('stats/events', { [event.event]: 1, [`${event.event}_${toAnalyticsKey(event.target)}`]: 1 }));
    }
    if (event.projectId && ['project_click', 'external_link_click'].includes(event.event)) {
      const prefix = `project_${toAnalyticsKey(event.projectId)}`;
      const fields = { [`${prefix}_name`]: event.projectName || event.projectId, ...(event.button ? { [`${prefix}_button_label_${toAnalyticsKey(event.button)}`]: event.button } : {}) };
      const counts: Record<string, number> = {};
      if (event.event === 'project_click') counts[`${prefix}_opens`] = 1;
      if (event.button) counts[`${prefix}_button_${toAnalyticsKey(event.button)}`] = 1;
      writes.push({ ...writeDocument('stats/project_events', fields), updateMask: { fieldPaths: Object.keys(fields).map(quotedField) }, updateTransforms: incrementFields('stats/project_events', counts).transform.fieldTransforms });
    }
    if (event.event === 'cv_download') writes.push(incrementFields('stats/cv_downloads', { count: 1 }));
    if (Object.keys(analytics).length) writes.push(incrementFields('stats/analytics', analytics));
    writes.push(writeDocument(sessionPath, { ...sessionData, sections, homepage: Boolean(sessionData.homepage || event.path === '/'), eventCount: Number(sessionData.eventCount || 0) + 1, lastSeen: now, durationMs: Number(sessionData.durationMs || 0) + (event.durationMs || 0), scrollDepth: Math.max(Number(sessionData.scrollDepth || 0), event.scrollDepth || 0) }, session));
    try {
      const result = await commitWrites(writes);
      if (notification) {
        const totals = result.writeResults[visitorTotalsWrite].transformResults;
        notification.totalUnique = Number(totals[0].integerValue ?? totals[0].doubleValue);
        notification.totalVisits = Number(totals[1].integerValue ?? totals[1].doubleValue);
        after(() => notify('visitor', notification!));
      }
      if (event.event === 'cv_download') after(() => notify('cv-download', { visitorId: event.visitorId, sessionId: event.sessionId, source: sessionData.source, firstTouch: sessionData.firstTouch, country: sessionData.country, city: sessionData.city, region: sessionData.region, device: sessionData.device, browser: sessionData.browser, os: sessionData.os, screen: sessionData.screen, language: sessionData.language, timezone: sessionData.timezone, path: event.path }));
      return;
    } catch (error) {
      if (!(error instanceof FirestoreError) || (!['ABORTED', 'ALREADY_EXISTS', 'FAILED_PRECONDITION'].includes(error.code || '') && ![409, 412].includes(error.status))) throw error;
      if ((await readDocument(eventPath)).updateTime) return;
      if (attempt === 3) throw error;
    }
  }
}

function response(status: number) {
  return new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (request.headers.get('dnt') === '1') return response(204);
  if (request.headers.get('origin') !== allowedOrigin(request) || request.headers.get('sec-fetch-site') === 'cross-site') return response(403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return response(415);
  try {
    if (Number(request.headers.get('content-length') || 0) > 8192) return response(413);
    const body = await request.text();
    if (body.length > 8192) return response(413);
    const event: unknown = JSON.parse(body);
    if (!validTrackingEvent(event)) return response(400);
    await record(event, request);
    return response(204);
  } catch (error) {
    if (error instanceof SyntaxError) return response(400);
    if (error instanceof FirestoreError && !error.code && [400, 429].includes(error.status)) return response(error.status);
    console.error('Analytics recording failed');
    return response(503);
  }
}
