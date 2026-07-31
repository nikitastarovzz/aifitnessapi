/**
 * Export all signups from Firestore to CSV on stdout.
 *
 *   node scripts/export-signups.mjs > signups.csv
 *
 * Uses the same three FIREBASE_* env vars as the site (reads .env.local
 * itself, so it works outside `next dev`). Read-only; touches nothing.
 */
import { createSign } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";

// Minimal .env.local loader — no dependency needed for three variables.
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  }
}

const PID = process.env.FIREBASE_PROJECT_ID;
const EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const KEY = (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
if (!PID || !EMAIL || !KEY) {
  console.error("Missing FIREBASE_* env vars (see .env.local.example).");
  process.exit(1);
}

const b64url = (s) => Buffer.from(s).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
const claims = b64url(
  JSON.stringify({
    iss: EMAIL,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }),
);
const signer = createSign("RSA-SHA256");
signer.update(`${header}.${claims}`);
const jwt = `${header}.${claims}.${signer.sign(KEY, "base64url")}`;

const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  }),
});
if (!tokenRes.ok) {
  console.error("token exchange failed:", tokenRes.status, await tokenRes.text());
  process.exit(1);
}
const { access_token } = await tokenRes.json();

const COLS = [
  "email", "firstName", "lastName", "country", "city", "fieldOfWork",
  "position", "interests", "interestNote", "source", "createdAt", "updatedAt",
];
const csv = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
console.log(COLS.join(","));

let pageToken = "";
let count = 0;
do {
  const url = new URL(
    `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/signups`,
  );
  url.searchParams.set("pageSize", "300");
  if (pageToken) url.searchParams.set("pageToken", pageToken);
  const res = await fetch(url, {
    headers: { authorization: `Bearer ${access_token}` },
  });
  if (!res.ok) {
    console.error("list failed:", res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  for (const doc of data.documents ?? []) {
    const row = {};
    for (const [k, v] of Object.entries(doc.fields ?? {})) {
      if (v.stringValue !== undefined) row[k] = v.stringValue;
      else if (v.timestampValue !== undefined) row[k] = v.timestampValue;
      else if (v.arrayValue) {
        row[k] = (v.arrayValue.values ?? []).map((x) => x.stringValue).join("; ");
      }
    }
    console.log(COLS.map((c) => csv(row[c])).join(","));
    count++;
  }
  pageToken = data.nextPageToken ?? "";
} while (pageToken);

console.error(`${count} signup(s) exported.`);
