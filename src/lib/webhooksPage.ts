/**
 * Text and helpers shared by /webhooks (src/app/webhooks/page.tsx) and its
 * markdown mirror (src/lib/pageMirrors/webhooks.ts), so the two render one
 * copy of every sentence.
 */
import { WEBHOOK_SOURCES, WEBHOOK_VENDORS, WEBHOOKS_FETCHED_ON, type DocumentedPayload, type WebhookVendorDoc } from "@/data/webhookPayloads";
import { payloadSchema, schemaBundle, schemaId } from "@/lib/webhookSchemas";
import { absoluteUrl } from "@/lib/site";

export const WEBHOOKS_PATH = "/webhooks";
export const WEBHOOKS_TITLE = "Wearable Webhook Payload Examples and Schemas";
export const WEBHOOKS_DESCRIPTION =
  "Documented webhook payloads from Oura, WHOOP, Strava, Polar, Withings, Wahoo, Terra and Google Health, with JSON Schemas, retries and a local mock sender.";
export const SCHEMAS_PATH = "/webhooks/schemas.json";
export const SENDER_PATH = "/webhooks/send-sample.mjs";

export function payloadCount(): number {
  return WEBHOOK_VENDORS.reduce((n, v) => n + v.payloads.length, 0);
}

export function webhooksCapsule(): string {
  const withPayloads = WEBHOOK_VENDORS.filter((v) => v.payloads.length);
  const names = withPayloads.map((v) => v.name);
  return `${payloadCount()} webhook payload examples from the documentation of ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}, each reproduced as published with a link to the page it came from, plus a JSON Schema for each built from the fields the vendor documents. Each vendor's section states its signature scheme, the response it expects and its retry behavior in its current wording; Terra, for example, now says it retries "with exponential backoff for several hours". A zero-dependency Node script posts any of these examples, correctly signed, to a local URL so you can test your handler. Read on ${WEBHOOKS_FETCHED_ON}.`;
}

export function sourceUrl(_v: WebhookVendorDoc, p: DocumentedPayload): string {
  return WEBHOOK_SOURCES[p.evidence.source].url;
}

export function schemaFor(v: WebhookVendorDoc, p: DocumentedPayload): string {
  return JSON.stringify(payloadSchema(v, p, sourceUrl(v, p)), null, 2);
}

export function bundle() {
  return schemaBundle(WEBHOOK_VENDORS, absoluteUrl(SCHEMAS_PATH), sourceUrl);
}

export { schemaId };

export function verifierHref(v: WebhookVendorDoc): string | null {
  return v.verifier ? `/tools/webhook-verifier#vendor-${v.verifier}` : null;
}

export function headerLines(p: DocumentedPayload): string | null {
  return p.headers ? Object.entries(p.headers).map(([k, val]) => `${k}: ${val}`).join("\n") : null;
}

/** Usage lines for the mock sender, shown on the page and in the mirror. */
export const SENDER_USAGE = [
  `curl -O ${absoluteUrl(SENDER_PATH)}`,
  "node send-sample.mjs --list",
  "node send-sample.mjs whoop v2-sleep-updated --url http://localhost:3000/webhooks/whoop --secret \"$WHOOP_CLIENT_SECRET\"",
  "node send-sample.mjs withings appli-44 --url http://localhost:3000/webhooks/withings --secret my-callback-token",
  "node send-sample.mjs terra s3_payload --dry-run",
];

export const SENDER_TEXT = [
  "It needs Node 18 or newer and nothing else. It sends only to localhost, 127.0.0.1 or ::1 unless you pass --allow-remote, and --dry-run prints the request without sending it.",
  "Each request is a vendor's published example, signed now with your --secret the way that vendor documents: HMAC for Oura, WHOOP, Terra and Polar, the token on the URL for Withings, webhook_token in the body for Wahoo, the Authorization header for the Google Health API. Strava's events are unsigned. Without --secret it uses the demo secret the webhook verifier's examples use, so a --dry-run request pasted into the verifier checks as valid.",
  "It cannot produce Google's GOOGLE-HEALTH-API-SIGNATURE header, which Google signs with its own private key, so it sends none; test that check against a real delivery.",
];

/** Existing pages that own the neighboring questions; this page links them rather than repeating them. */
export const RELATED = [
  { href: "/learn/what-are-webhooks", text: "What webhooks are and why fitness APIs use them" },
  { href: "/learn/webhooks-vs-polling-for-fitness-data", text: "Webhooks or polling for fitness data" },
  { href: "/architecture/webhook-ingestion", text: "Designing idempotent webhook ingestion" },
  { href: "/cookbook/webhook-receiver", text: "A replay-safe webhook receiver, in code" },
  { href: "/test/webhooks-locally", text: "Testing webhook handlers locally with replays" },
  { href: "/fix/strava-webhook-not-firing", text: "Why a Strava webhook stops firing" },
  { href: "/tools/webhook-verifier", text: "Check a received webhook's signature" },
  { href: "/tools/oauth-playground", text: "Build each vendor's OAuth request" },
];
