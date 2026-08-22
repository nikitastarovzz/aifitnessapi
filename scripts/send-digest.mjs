/**
 * Newsletter digest and change-alert sender.
 *
 *   node scripts/send-digest.mjs drafts/digest.md --subject "What changed in fitness APIs"
 *   node scripts/send-digest.mjs https://aifitnessapi.com/digest/2026-08/digest.md --subject "..."
 *   node scripts/send-digest.mjs drafts/motion.md --subject "..." --interest motion-tracking
 *   node scripts/send-digest.mjs drafts/fitbit.md --subject "..." --watching fitbit
 *   ... --send                    # actually send; DRY RUN is the default
 *
 * `--interest` filters by a declared newsletter interest; `--watching`
 * filters by a product on the reader's change-alert watch list (/alerts), so
 * a Fitbit deprecation reaches the people who said they depend on Fitbit and
 * nobody else. The published digest is fetchable by URL because the site
 * serves each issue as plain text — sending the same document that is
 * published beats maintaining a second copy of it.
 *
 * Reads recipients from Firestore (same FIREBASE_* env as the site, loaded
 * from .env.local), optionally filtered by declared interest, and sends the
 * markdown file as a plain-text email via Resend (RESEND_API_KEY).
 *
 * Deliberately conservative: dry-run by default, prints the exact recipient
 * list and rendered body before anything leaves, sends sequentially, and
 * stops on the first Resend error rather than spraying failures.
 */
import { createSign } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const SUBJECT = flag("subject");
const INTEREST = flag("interest");
const WATCHING = flag("watching");
const SEND = args.includes("--send");

if (!file || !SUBJECT) {
  console.error(
    'Usage: node scripts/send-digest.mjs <file.md|url> --subject "..." [--interest <id>] [--watching <productId>] [--send]',
  );
  process.exit(1);
}
const source = /^https?:\/\//.test(file)
  ? await (async () => {
      const r = await fetch(file);
      if (!r.ok) {
        console.error(`Could not fetch ${file}: ${r.status}`);
        process.exit(1);
      }
      return r.text();
    })()
  : readFileSync(file, "utf8");

const BODY = source.trim() +
  "\n\n—\nAIFitnessAPI · https://aifitnessapi.com\nUnsubscribe: reply \"unsubscribe\" and a human removes you.";

const PID = process.env.FIREBASE_PROJECT_ID;
const EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const KEY = (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
const RESEND = process.env.RESEND_API_KEY;
const FROM = process.env.NEWSLETTER_FROM ?? "AIFitnessAPI <hello@aifitnessapi.com>";
if (!PID || !EMAIL || !KEY) { console.error("Missing FIREBASE_* env."); process.exit(1); }
if (SEND && !RESEND) { console.error("--send requires RESEND_API_KEY."); process.exit(1); }

const b64 = (s) => Buffer.from(s).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const h = b64(JSON.stringify({ alg: "RS256", typ: "JWT" }));
const c = b64(JSON.stringify({ iss: EMAIL, scope: "https://www.googleapis.com/auth/datastore", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
const signer = createSign("RSA-SHA256");
signer.update(`${h}.${c}`);
const jwt = `${h}.${c}.${signer.sign(KEY, "base64url")}`;
const tr = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
});
const { access_token } = await tr.json();

// Collect recipients (paginated), filter by interest if asked.
const recipients = [];
let pageToken = "";
do {
  const url = new URL(`https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/signups`);
  url.searchParams.set("pageSize", "300");
  if (pageToken) url.searchParams.set("pageToken", pageToken);
  const res = await fetch(url, { headers: { authorization: `Bearer ${access_token}` } });
  const data = await res.json();
  for (const doc of data.documents ?? []) {
    const f = doc.fields ?? {};
    const email = f.email?.stringValue;
    const first = f.firstName?.stringValue ?? "";
    const interests = (f.interests?.arrayValue?.values ?? []).map((v) => v.stringValue);
    if (!email) continue;
    const watching = (f.watching?.arrayValue?.values ?? []).map((v) => v.stringValue);
    if (INTEREST && !interests.includes(INTEREST)) continue;
    if (WATCHING && !watching.includes(WATCHING)) continue;
    recipients.push({ email, first });
  }
  pageToken = data.nextPageToken ?? "";
} while (pageToken);

const filterNote = [
  INTEREST ? `interest: ${INTEREST}` : "",
  WATCHING ? `watching: ${WATCHING}` : "",
].filter(Boolean).join(", ");
console.log(`Recipients${filterNote ? ` (${filterNote})` : ""}: ${recipients.length}`);
recipients.forEach((r) => console.log("  " + r.email));
console.log(`\nSubject: ${SUBJECT}\n\n${BODY.slice(0, 600)}${BODY.length > 600 ? "\n…" : ""}\n`);

if (!SEND) {
  console.log("DRY RUN — nothing sent. Re-run with --send to deliver.");
  process.exit(0);
}

let sent = 0;
for (const r of recipients) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${RESEND}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [r.email],
      subject: SUBJECT,
      text: `Hi ${r.first || "there"},\n\n${BODY}`,
    }),
  });
  if (!res.ok) {
    console.error(`FAILED at ${r.email}: ${res.status} ${await res.text()}`);
    console.error(`Sent ${sent}/${recipients.length} before stopping.`);
    process.exit(1);
  }
  sent++;
  await new Promise((r2) => setTimeout(r2, 600)); // stay well under rate limits
}
console.log(`Sent ${sent}/${recipients.length}.`);
