import { createSign, createHash } from "node:crypto";

/**
 * Minimal Firestore REST client for the signup store. Server-side only.
 *
 * Deliberately NOT the firebase-admin SDK: we need exactly two operations
 * (get + upsert a document), and a service-account JWT signed with Node's
 * built-in crypto keeps the dependency count at zero. All writes go through
 * the API route with these credentials — the browser never talks to
 * Firestore, so the client SDK, public API keys, and permissive security
 * rules are all unnecessary. Rules can stay locked (deny all).
 *
 * Env (server only — set in Vercel and .env.local, never NEXT_PUBLIC_*):
 *   FIREBASE_PROJECT_ID    e.g. "aifitnessapi-leads"
 *   FIREBASE_CLIENT_EMAIL  from the service-account JSON
 *   FIREBASE_PRIVATE_KEY   from the same JSON; \n escapes are handled here
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/datastore";

export function firestoreConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

const b64url = (s: Buffer | string) =>
  Buffer.from(s).toString("base64url");

/** Access token, cached for its lifetime minus a safety margin. */
let cached: { token: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp > now + 60) return cached.token;

  const key = (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: process.env.FIREBASE_CLIENT_EMAIL,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${signer.sign(key, "base64url")}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`token exchange failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: data.access_token, exp: now + data.expires_in };
  return data.access_token;
}

function docUrl(collection: string, id: string): string {
  const pid = process.env.FIREBASE_PROJECT_ID;
  return `https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/${collection}/${id}`;
}

/** Stable doc ID from an email — idempotent upserts, no PII in the ID. */
export function emailDocId(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

// --- Firestore REST value encoding (strings, string arrays, timestamps) ---

type FsValue =
  | { stringValue: string }
  | { timestampValue: string }
  | { arrayValue: { values: { stringValue: string }[] } };

function encode(v: string | string[] | Date): FsValue {
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v))
    return { arrayValue: { values: v.map((s) => ({ stringValue: s })) } };
  return { stringValue: v };
}

function decodeDoc(fields: Record<string, FsValue> | undefined) {
  const out: Record<string, string | string[]> = {};
  for (const [k, v] of Object.entries(fields ?? {})) {
    if ("stringValue" in v) out[k] = v.stringValue;
    else if ("timestampValue" in v) out[k] = v.timestampValue;
    else if ("arrayValue" in v)
      out[k] = (v.arrayValue.values ?? []).map((x) => x.stringValue);
  }
  return out;
}

export async function getSignup(
  id: string,
): Promise<Record<string, string | string[]> | null> {
  const res = await fetch(docUrl("signups", id), {
    headers: { authorization: `Bearer ${await accessToken()}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`firestore get failed: ${res.status}`);
  const doc = (await res.json()) as { fields?: Record<string, FsValue> };
  return decodeDoc(doc.fields);
}

export async function putSignup(
  id: string,
  data: Record<string, string | string[] | Date>,
): Promise<void> {
  const fields: Record<string, FsValue> = {};
  for (const [k, v] of Object.entries(data)) fields[k] = encode(v);
  const res = await fetch(docUrl("signups", id), {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${await accessToken()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    throw new Error(`firestore write failed: ${res.status} ${await res.text()}`);
  }
}

/**
 * Append a document to a collection with a server-generated ID. Used for
 * append-only event streams (page feedback, search misses) where there is no
 * natural key to make the write idempotent.
 */
export async function createDoc(
  collection: string,
  data: Record<string, string | string[] | Date>,
): Promise<void> {
  const fields: Record<string, FsValue> = {};
  for (const [k, v] of Object.entries(data)) fields[k] = encode(v);
  const pid = process.env.FIREBASE_PROJECT_ID;
  const url = `https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/${collection}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${await accessToken()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    throw new Error(`firestore create failed: ${res.status} ${await res.text()}`);
  }
}
