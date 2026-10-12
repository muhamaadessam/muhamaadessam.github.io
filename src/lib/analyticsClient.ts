import { trafficSource, type PortfolioEvent, type TrackingEvent } from './analytics';

let context: Omit<TrackingEvent, 'event' | 'target' | 'eventId'> | null = null;

const attributionParams = ['utm_source', 'utm_medium', 'utm_campaign', 'ref'];

// The source is already captured in storage, so the campaign params only make the visible URL noisy to copy or share.
function stripAttributionParams() {
  try {
    const url = new URL(location.href);
    if (!attributionParams.some(key => url.searchParams.has(key))) return;
    attributionParams.forEach(key => url.searchParams.delete(key));
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
  } catch { /* Leaving the URL as is is harmless. */ }
}

function trackingContext() {
  if (typeof window === 'undefined' || navigator.doNotTrack === '1' || location.pathname.startsWith('/admin')) return null;
  if (context) return context;
  try {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitor_id', visitorId);
    }
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    const source = trafficSource(location.href, document.referrer);
    const firstTouch = JSON.parse(localStorage.getItem('analytics_first_touch') || 'null') || source;
    const sessionSource = JSON.parse(sessionStorage.getItem('analytics_source') || 'null') || source;
    localStorage.setItem('analytics_first_touch', JSON.stringify(firstTouch));
    sessionStorage.setItem('analytics_source', JSON.stringify(sessionSource));
    stripAttributionParams();
    context = { visitorId, sessionId, pageId: crypto.randomUUID(), path: location.pathname, source: sessionSource, firstTouch, language: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, screen: `${screen.width}x${screen.height}` };
    return context;
  } catch {
    return null;
  }
}

export function beginAnalyticsPage(path: string) {
  const data = trackingContext();
  if (!data) return;
  context = { ...data, path, pageId: data.path === path ? data.pageId : crypto.randomUUID() };
  sendTracking('page_view', path === '/' ? 'homepage' : path, {}, false, context.pageId);
}

export function sendTracking(event: PortfolioEvent, target: string, fields: Partial<TrackingEvent> = {}, beacon = false, eventId?: string): void {
  try {
    const data = trackingContext();
    if (!data) return;
    const payload = JSON.stringify({ ...data, ...fields, event, target, eventId: eventId || crypto.randomUUID() });
    if (beacon && navigator.sendBeacon?.('/api/track', new Blob([payload], { type: 'application/json' }))) return;
    void fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
  } catch { /* Tracking must never interrupt a visitor action. */ }
}
