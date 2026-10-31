/**
 * The /tools/webhook-verifier core, tested through the same module the page
 * imports (src/lib/webhookVerifier.mjs).
 *
 *   node --test scripts/webhook-verifier.test.mjs     (npm run test:webhooks)
 *
 * For every vendor: the example the page's "Load an example" button builds
 * verifies, and changing a single byte makes it fail. For HMAC vendors the
 * byte is in the signed body (and, separately, in the signature header); for
 * token and handshake vendors it is in the token, wherever the vendor carries
 * it — changing an unprotected body byte there is not supposed to fail, and a
 * test asserting that it does would be asserting a guarantee the vendor does
 * not give.
 *
 * Fixed vectors pin each construction to its documented shape, so a refactor
 * that keeps example and verifier consistent with each other but wrong
 * (say, hex where WHOOP says base64) still fails.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import {
  WEBHOOK_VENDORS,
  buildExample,
  verifyWebhook,
  explainPayload,
  safeEqual,
  DEMO_SECRET,
} from "../src/lib/webhookVerifier.mjs";

/** Flip one byte of `s` at `i` to a different printable character. */
function flipAt(s, i) {
  const c = s.charCodeAt(i);
  const n = c === 0x61 ? 0x62 : 0x61; // 'a' <-> 'b', or anything -> 'a'
  return s.slice(0, i) + String.fromCharCode(n) + s.slice(i + 1);
}

/** Index of a byte inside the first occurrence of `needle` (raw or URL-encoded). */
function indexInside(hay, needle) {
  for (const n of [needle, encodeURIComponent(needle)]) {
    const i = hay.indexOf(n);
    if (i >= 0) return i + Math.floor(n.length / 2);
  }
  return -1;
}

/** A byte inside a JSON string value, so the tampered body still parses. */
function indexInJsonValue(body) {
  const m = /"[A-Za-z_]+"\s*:\s*"([^"]{3,})"/.exec(body);
  assert.ok(m, "example body has a string value to tamper");
  return m.index + m[0].length - 2;
}

const EXPECTED_VENDORS = ["oura", "whoop", "terra", "polar", "strava", "withings", "wahoo", "google-health"];

test("vendor list is the sourced set, each with a source URL, date and quote", () => {
  assert.deepEqual(WEBHOOK_VENDORS.map((v) => v.id), EXPECTED_VENDORS);
  for (const v of WEBHOOK_VENDORS) {
    assert.match(v.source.url, /^https:\/\//, v.id);
    assert.match(v.source.fetched, /^\d{4}-\d{2}-\d{2}$/, v.id);
    assert.ok(v.source.quote.length > 0, `${v.id} quotes its rule`);
    assert.ok(v.respond.length > 0, `${v.id} states the expected response`);
  }
});

for (const v of WEBHOOK_VENDORS) {
  test(`${v.id}: example verifies`, async () => {
    const ex = await buildExample(v.id);
    const r = await verifyWebhook(v.id, ex);
    assert.equal(r.status, "valid", `${v.id}: ${r.title} — ${r.detail.join(" ")}`);
  });

  test(`${v.id}: one tampered byte fails`, async () => {
    const ex = await buildExample(v.id);
    let tampered;
    if (v.kind === "hmac") {
      tampered = { ...ex, body: flipAt(ex.body, indexInJsonValue(ex.body)) };
    } else {
      const field = ex.tamperField;
      const i = indexInside(ex[field], DEMO_SECRET);
      assert.ok(i >= 0, `${v.id}: the token is carried in ${field}`);
      tampered = { ...ex, [field]: flipAt(ex[field], i) };
    }
    const r = await verifyWebhook(v.id, tampered);
    assert.equal(r.status, "invalid", `${v.id}: expected invalid, got ${r.status} (${r.title})`);
  });

  test(`${v.id}: wrong secret fails`, async () => {
    const ex = await buildExample(v.id);
    const r = await verifyWebhook(v.id, { ...ex, secret: ex.secret + "x" });
    assert.equal(r.status, "invalid", v.id);
  });

  test(`${v.id}: example payload is explained from the vendor's own field list`, async () => {
    const ex = await buildExample(v.id);
    const { rows } = explainPayload(v.id, ex.body, ex.url);
    assert.ok(rows.length > 0, v.id);
    assert.ok(rows.some((r) => r.meaning), `${v.id}: at least one field has a documented meaning`);
    assert.ok(v.next(explainPayload(v.id, ex.body, ex.url).parsed).length > 0, `${v.id}: names the next call`);
  });
}

test("HMAC vendors: a tampered signature header fails too", async () => {
  for (const v of WEBHOOK_VENDORS.filter((x) => x.kind === "hmac")) {
    const ex = await buildExample(v.id);
    const lines = ex.headers.split("\n");
    const at = lines.findIndex((l) => /signature:/i.test(l));
    const line = lines[at];
    lines[at] = flipAt(line, line.length - 3);
    const r = await verifyWebhook(v.id, { ...ex, headers: lines.join("\n") });
    assert.equal(r.status, "invalid", v.id);
  }
});

/* Fixed vectors: the construction each vendor documents, computed with Node's
 * own crypto, independent of the module's WebCrypto path. */
const KEY = "k3y";
test("Oura: upper-case hex of HMAC(timestamp + JSON.stringify(body))", async () => {
  const body = '{"event_type": "update", "data_type": "sleep"}';
  const sig = createHmac("sha256", KEY).update("1700000000" + JSON.stringify(JSON.parse(body))).digest("hex").toUpperCase();
  const r = await verifyWebhook("oura", { method: "POST", url: "", headers: `x-oura-signature: ${sig}\nx-oura-timestamp: 1700000000`, body, secret: KEY });
  assert.equal(r.status, "valid");
});
test("WHOOP: base64 of HMAC(timestamp + raw body)", async () => {
  const body = '{"user_id":1,"id":"x","type":"sleep.updated","trace_id":"t"}';
  const sig = createHmac("sha256", KEY).update("1700000000000" + body).digest("base64");
  const r = await verifyWebhook("whoop", { method: "POST", url: "", headers: `X-WHOOP-Signature: ${sig}\nX-WHOOP-Signature-Timestamp: 1700000000000`, body, secret: KEY });
  assert.equal(r.status, "valid");
  const hex = createHmac("sha256", KEY).update("1700000000000" + body).digest("hex");
  const r2 = await verifyWebhook("whoop", { method: "POST", url: "", headers: `X-WHOOP-Signature: ${hex}\nX-WHOOP-Signature-Timestamp: 1700000000000`, body, secret: KEY });
  assert.equal(r2.status, "invalid", "hex is not WHOOP's encoding");
});
test("Terra: hex of HMAC(t + '.' + raw body); any v1 may match; other schemes ignored", async () => {
  const body = '{"type":"healthcheck"}';
  const sig = createHmac("sha256", KEY).update(`1723808700.${body}`).digest("hex");
  const r = await verifyWebhook("terra", { method: "POST", url: "", headers: `terra-signature: t=1723808700,v0=${sig},v1=deadbeef,v1=${sig}`, body, secret: KEY });
  assert.equal(r.status, "valid");
  const r2 = await verifyWebhook("terra", { method: "POST", url: "", headers: `terra-signature: t=1723808700,v0=${sig}`, body, secret: KEY });
  assert.equal(r2.status, "error", "a v0-only header is not accepted");
});
test("Polar: hex of HMAC(raw body), case-insensitive", async () => {
  const body = '{"event":"PING","timestamp":"2019-01-11T08:25:10.02Z"}';
  const sig = createHmac("sha256", KEY).update(body).digest("hex").toUpperCase();
  const r = await verifyWebhook("polar", { method: "POST", url: "", headers: `Polar-Webhook-Signature: ${sig}`, body, secret: KEY });
  assert.equal(r.status, "valid");
});
test("Strava: validation reply echoes hub.challenge; event POSTs are reported unsigned", async () => {
  const r = await verifyWebhook("strava", { method: "GET", url: "https://x.example?hub.verify_token=STRAVA&hub.challenge=abc&hub.mode=subscribe", headers: "", body: "", secret: "STRAVA" });
  assert.equal(r.status, "valid");
  assert.equal(r.reply, '{"hub.challenge":"abc"}');
  const e = await verifyWebhook("strava", { method: "POST", url: "", headers: "", body: '{"object_type":"activity"}', secret: "STRAVA" });
  assert.equal(e.status, "unsigned");
});
test("Google Health API: unauthenticated verification request is told to answer 401/403", async () => {
  const r = await verifyWebhook("google-health", { method: "POST", url: "", headers: "", body: '{"type": "verification"}', secret: "Bearer s" });
  assert.equal(r.status, "invalid");
  assert.match(r.detail.join(" "), /401 Unauthorized or 403 Forbidden/);
});
test("safeEqual", () => {
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abd"), false);
  assert.equal(safeEqual("abc", "abcd"), false);
});
