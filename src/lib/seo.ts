export const SITE_URL = 'https://muhammadessam.me';
export const SITE_NAME = 'Muhammad Essam Portfolio';
export const PERSON_NAME = 'Muhammad Essam';
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const DEFAULT_TITLE = 'Muhammad Essam | Flutter Developer | Mobile Application Engineer';
export const DEFAULT_DESCRIPTION =
  'Flutter Developer with 3+ years experience building production Android and iOS applications using Flutter, Dart, BLoC, Firebase, and Clean Architecture.';
export const KNOWS_ABOUT = ['Flutter', 'Dart', 'BLoC', 'Clean Architecture', 'Firebase', 'REST APIs', 'Android', 'iOS'];

// Escapes "<" so a value can never close the surrounding <script> tag.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function projectUrl(id: string): string {
  return `${SITE_URL}/projects/${encodeURIComponent(id)}`;
}
