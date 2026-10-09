import 'server-only';
import { createSign } from 'node:crypto';

type FirestoreValue = { stringValue?: string; integerValue?: string; doubleValue?: number; booleanValue?: boolean; timestampValue?: string; mapValue?: { fields?: Record<string, FirestoreValue> }; arrayValue?: { values?: FirestoreValue[] }; nullValue?: null };
export interface StoredDocument { data: Record<string, unknown>; updateTime?: string }
export class FirestoreError extends Error {
  constructor(public status: number, public code?: string) { super(`Analytics storage failed (${status})`); }
}
let token: { value: string; expires: number } | undefined;

async function accessToken() {
  if (token && token.expires > Date.now()) return token.value;
  const email = process.env.FIREBASE_CLIENT_EMAIL;
  const key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key || !process.env.FIREBASE_PROJECT_ID) throw new Error('Analytics server credentials are missing');
  const now = Math.floor(Date.now() / 1000);
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const claim = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({ iss: email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })}`;
  const signature = createSign('RSA-SHA256').update(claim).sign(key, 'base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${claim}.${signature}` }), signal: AbortSignal.timeout(8000), cache: 'no-store' });
  if (!response.ok) throw new Error('Analytics server authentication failed');
  const result = await response.json();
  if (typeof result.access_token !== 'string') throw new Error('Invalid analytics access token');
  token = { value: result.access_token, expires: Date.now() + (Number(result.expires_in) - 60) * 1000 };
  return token.value;
}

export function encodeValue(value: unknown): FirestoreValue {
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (value && typeof value === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([key, value]) => [key, encodeValue(value)])) } };
  throw new Error('Unsupported analytics value');
}

export function decodeValue(value: FirestoreValue): unknown {
  if (value.timestampValue) return new Date(value.timestampValue);
  if (value.mapValue) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key, value]) => [key, decodeValue(value)]));
  if (value.arrayValue) return (value.arrayValue.values || []).map(decodeValue);
  if (value.integerValue !== undefined) return Number(value.integerValue);
  return value.stringValue ?? value.doubleValue ?? value.booleanValue ?? value.timestampValue ?? null;
}

export function documentName(path: string) {
  return `projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${path}`;
}

async function firestore(path: string, body?: object) {
  const response = await fetch(`https://firestore.googleapis.com/v1/${path === ':commit' ? documentName('').slice(0, -1) + ':commit' : documentName(path)}`, {
    method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(8000), cache: 'no-store',
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new FirestoreError(response.status, result.error?.status);
  }
  return response.json();
}

export async function readDocument(path: string): Promise<StoredDocument> {
  try {
    const result = await firestore(path);
    return { data: decodeValue({ mapValue: { fields: result.fields || {} } }) as Record<string, unknown>, updateTime: result.updateTime };
  } catch (error) {
    if (error instanceof FirestoreError && error.status === 404) return { data: {} };
    throw error;
  }
}

export function writeDocument(path: string, data: object, previous?: StoredDocument) {
  return {
    update: { name: documentName(path), fields: (encodeValue(data).mapValue!).fields },
    ...(previous ? { currentDocument: previous.updateTime ? { updateTime: previous.updateTime } : { exists: false } } : {}),
  };
}

export function quotedField(value: string) {
  return `\`${value.replaceAll('\\', '\\\\').replaceAll('`', '\\`')}\``;
}

export function incrementFields(path: string, fields: Record<string, number>) {
  return { transform: { document: documentName(path), fieldTransforms: Object.entries(fields).map(([fieldPath, value]) => ({ fieldPath: fieldPath.includes('.') ? fieldPath : quotedField(fieldPath), increment: { integerValue: String(value) } })) } };
}

export async function commitWrites(writes: object[]) {
  return firestore(':commit', { writes });
}
