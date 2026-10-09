export type PortfolioEvent = 'page_view' | 'project_click' | 'cv_download' | 'contact_submit' | 'external_link_click' | 'engagement' | 'section_view';
export interface TrafficSource {
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  ref: string;
}
export interface TrackingEvent {
  visitorId: string;
  sessionId: string;
  eventId: string;
  pageId: string;
  event: PortfolioEvent;
  target: string;
  path: string;
  source: TrafficSource;
  firstTouch: TrafficSource;
  language: string;
  timezone: string;
  screen: string;
  durationMs?: number;
  scrollDepth?: number;
  projectId?: string;
  projectName?: string;
  button?: string;
}

export function toAnalyticsKey(value: string): string {
  return value.trim().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_+|_+$/g, '').slice(0, 80) || 'unknown';
}

export function trafficSource(url: string, referrer: string): TrafficSource {
  const params = new URL(url).searchParams;
  let hostname = '';
  try { hostname = new URL(referrer).hostname; } catch { /* Direct visit. */ }
  return {
    referrer: hostname.slice(0, 120),
    utmSource: (params.get('utm_source') || '').slice(0, 80),
    utmMedium: (params.get('utm_medium') || '').slice(0, 80),
    utmCampaign: (params.get('utm_campaign') || '').slice(0, 80),
    ref: (params.get('ref') || '').slice(0, 80),
  };
}

// shortcut: UA labels are approximate (including desktop-mode tablets); use a parser only if finer attribution is needed.
export function deviceInfo(ua: string) {
  const device = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua) ? 'tablet' : /Mobi|iPhone|Android/i.test(ua) ? 'mobile' : 'desktop';
  const browser = /Edg(?:e|A|iOS)?\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /Chrome|CriOS/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'Unknown';
  const os = /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /CrOS/.test(ua) ? 'Chrome OS' : /Macintosh|Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown';
  return { device, browser, os };
}

export function validTrackingEvent(value: unknown): value is TrackingEvent {
  if (!value || typeof value !== 'object') return false;
  const data = value as TrackingEvent;
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const text = (value: unknown, length: number) => typeof value === 'string' && value.length <= length && !/[\u0000-\u001f]/.test(value);
  const source = (value: TrafficSource) => value && ['referrer', 'utmSource', 'utmMedium', 'utmCampaign', 'ref'].every(key => text(value[key as keyof TrafficSource], key === 'referrer' ? 120 : 80)) && (!value.referrer || /^[a-z0-9.-]+$/i.test(value.referrer));
  return typeof data.visitorId === 'string' && (uuid.test(data.visitorId) || /^\d{13}$/.test(data.visitorId)) &&
    [data.sessionId, data.eventId, data.pageId].every(id => typeof id === 'string' && uuid.test(id)) &&
    ['page_view', 'project_click', 'cv_download', 'contact_submit', 'external_link_click', 'engagement', 'section_view'].includes(data.event) &&
    text(data.target, 120) && typeof data.path === 'string' && /^(\/|\/projects\/[a-zA-Z0-9_%.-]+)\/?$/.test(data.path) && data.path.length <= 200 &&
    !!source(data.source) && !!source(data.firstTouch) && text(data.language, 40) && text(data.timezone, 80) && typeof data.screen === 'string' && /^\d{1,5}x\d{1,5}$/.test(data.screen) &&
    (data.durationMs === undefined || (data.event === 'engagement' && Number.isInteger(data.durationMs) && data.durationMs >= 0 && data.durationMs <= 300_000)) &&
    (data.scrollDepth === undefined || (data.event === 'engagement' && Number.isInteger(data.scrollDepth) && data.scrollDepth >= 0 && data.scrollDepth <= 100)) &&
    (data.event !== 'section_view' || (data.path === '/' && ['experience', 'projects', 'contact'].includes(data.target))) &&
    (data.event !== 'page_view' || data.eventId === data.pageId) &&
    ['projectId', 'projectName', 'button'].every(key => data[key as 'projectId'] === undefined || text(data[key as 'projectId'], 120));
}
