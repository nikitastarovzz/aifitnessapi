/**
 * vendor-webhook-signatures.test.mjs
 *
 * The contract for vendor-webhook-signatures.mjs. Each vendor is checked
 * three ways: a body this file signs verifies; one changed byte, a wrong
 * secret or a missing header does not; and the site's own verifier
 * (src/lib/webhookVerifier.mjs, the module behind /tools/webhook-verifier)
 * agrees in both directions — it accepts what this file signs, and this file
 * accepts the examples that module builds from each vendor's documentation.
 *
 * Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";

import { REASON, parseTerraHeader, signLikeVendor, verifyVendorSignature } from "./vendor-webhook-signatures.mjs";
import { buildExample, parseHeaders, verifyWebhook } from "../src/lib/webhookVerifier.mjs";

const SECRET = "test-secret-123";
const NOW = Date.UTC(2026, 10, 5, 12, 0, 0);
const TS = {
  oura: String(Math.floor(NOW / 1000)),
  whoop: String(NOW),
  terra: String(Math.floor(NOW / 1000)),
  polar: null,
};
const BODIES = {
  oura: '{"event_type":"update","data_type":"sleep","object_id":"abc","event_time":"2026-11-05T08:00:00+00:00","user_id":"u1"}',
  whoop: '{"user_id":456,"id":"550e8400-e29b-41d4-a716-446655440000","type":"sleep.updated","trace_id":"t-1"}',
  terra: '{"type":"healthcheck","status":"healthy"}',
  polar: '{"event":"EXERCISE","user_id":475,"entity_id":"aQlC83"}',
};
const VENDORS = Object.keys(BODIES);

for (const vendor of VENDORS) {
  const rawBody = Buffer.from(BODIES[vendor]);
  const headers = signLikeVendor(vendor, { rawBody, secret: SECRET, timestamp: TS[vendor] });

  test(`${vendor}: a body signed with the secret verifies`, () => {
    const r = verifyVendorSignature(vendor, { rawBody, headers, secret: SECRET, now: () => NOW });
    assert.equal(r.ok, true);
    assert.equal(r.reason, REASON.OK);
  });

  test(`${vendor}: one changed byte fails`, () => {
    const tampered = Buffer.from(BODIES[vendor].replace(/"(\w)/, '"X'));
    const r = verifyVendorSignature(vendor, { rawBody: tampered, headers, secret: SECRET });
    assert.equal(r.ok, false);
    assert.equal(r.reason, REASON.MISMATCH);
  });

  test(`${vendor}: the wrong secret fails, a rotated list with the right one passes`, () => {
    assert.equal(verifyVendorSignature(vendor, { rawBody, headers, secret: "nope" }).ok, false);
    assert.equal(verifyVendorSignature(vendor, { rawBody, headers, secret: ["nope", SECRET] }).ok, true);
  });

  test(`${vendor}: a missing signature header is reported, not thrown`, () => {
    const r = verifyVendorSignature(vendor, { rawBody, headers: {}, secret: SECRET });
    assert.equal(r.reason, REASON.MISSING_HEADER);
  });

  test(`${vendor}: the site's webhook verifier accepts what this file signs`, async () => {
    const out = await verifyWebhook(vendor, { method: "POST", url: "", headers, body: BODIES[vendor], secret: SECRET });
    assert.equal(out.status, "valid", out.title);
  });

  test(`${vendor}: this file accepts the site verifier's documented example`, async () => {
    const ex = await buildExample(vendor, NOW);
    const r = verifyVendorSignature(vendor, { rawBody: ex.body, headers: parseHeaders(ex.headers), secret: ex.secret });
    assert.equal(r.ok, true, r.reason);
  });
}

test("header names are case-insensitive", () => {
  const rawBody = BODIES.whoop;
  const h = signLikeVendor("whoop", { rawBody, secret: SECRET, timestamp: TS.whoop });
  const lower = Object.fromEntries(Object.entries(h).map(([k, v]) => [k.toLowerCase(), v]));
  assert.equal(verifyVendorSignature("whoop", { rawBody, headers: lower, secret: SECRET }).ok, true);
  assert.equal(verifyVendorSignature("whoop", { rawBody, headers: new Headers(h), secret: SECRET }).ok, true);
});

test("WHOOP: a stale millisecond timestamp is refused only when a window is set", () => {
  const rawBody = BODIES.whoop;
  const headers = signLikeVendor("whoop", { rawBody, secret: SECRET, timestamp: TS.whoop });
  const later = () => NOW + 10 * 60 * 1000;
  assert.equal(verifyVendorSignature("whoop", { rawBody, headers, secret: SECRET, now: later }).ok, true);
  const r = verifyVendorSignature("whoop", { rawBody, headers, secret: SECRET, now: later, maxAgeMs: 5 * 60 * 1000 });
  assert.equal(r.reason, REASON.STALE);
  assert.equal(r.ageMs, 10 * 60 * 1000);
});

test("Oura and Terra: no window is applied until you state the timestamp unit", () => {
  const rawBody = BODIES.terra;
  const headers = signLikeVendor("terra", { rawBody, secret: SECRET, timestamp: TS.terra });
  const later = () => NOW + 3600 * 1000;
  assert.equal(verifyVendorSignature("terra", { rawBody, headers, secret: SECRET, now: later, maxAgeMs: 1000 }).ok, true);
  const r = verifyVendorSignature("terra", { rawBody, headers, secret: SECRET, now: later, maxAgeMs: 1000, timestampUnit: "s" });
  assert.equal(r.reason, REASON.STALE);
});

test("Oura signs the re-serialized body, so whitespace in the raw bytes still verifies", () => {
  const compact = BODIES.oura;
  const pretty = JSON.stringify(JSON.parse(compact), null, 2);
  const headers = signLikeVendor("oura", { rawBody: compact, secret: SECRET, timestamp: TS.oura });
  assert.equal(verifyVendorSignature("oura", { rawBody: pretty, headers, secret: SECRET }).ok, true);
  assert.equal(verifyVendorSignature("oura", { rawBody: "not json", headers, secret: SECRET }).reason, REASON.BODY_NOT_JSON);
});

test("WHOOP, Terra and Polar sign raw bytes, so re-serializing breaks them", () => {
  for (const vendor of ["whoop", "terra", "polar"]) {
    const headers = signLikeVendor(vendor, { rawBody: BODIES[vendor], secret: SECRET, timestamp: TS[vendor] });
    const pretty = JSON.stringify(JSON.parse(BODIES[vendor]), null, 2);
    assert.equal(verifyVendorSignature(vendor, { rawBody: pretty, headers, secret: SECRET }).ok, false, vendor);
  }
});

test("Terra: every v1 value is tried, other schemes are ignored", () => {
  const rawBody = BODIES.terra;
  const good = signLikeVendor("terra", { rawBody, secret: SECRET, timestamp: TS.terra })["terra-signature"];
  const sig = good.split("v1=")[1];
  const header = `t=${TS.terra},v0=${sig},v1=deadbeef,v1=${sig}`;
  assert.deepEqual(parseTerraHeader(header), { t: TS.terra, v1: ["deadbeef", sig] });
  assert.equal(verifyVendorSignature("terra", { rawBody, headers: { "terra-signature": header }, secret: SECRET }).ok, true);
  const downgrade = `t=${TS.terra},v0=${sig}`;
  assert.equal(verifyVendorSignature("terra", { rawBody, headers: { "terra-signature": downgrade }, secret: SECRET }).reason, REASON.MALFORMED_HEADER);
});

test("Polar: hex is compared case-insensitively", () => {
  const rawBody = BODIES.polar;
  const h = signLikeVendor("polar", { rawBody, secret: SECRET });
  const upper = { "Polar-Webhook-Signature": h["Polar-Webhook-Signature"].toUpperCase() };
  assert.equal(verifyVendorSignature("polar", { rawBody, headers: upper, secret: SECRET }).ok, true);
});

test("unknown vendors and empty secrets are refused", () => {
  assert.equal(verifyVendorSignature("garmin", { rawBody: "{}", headers: {}, secret: SECRET }).reason, REASON.UNKNOWN_VENDOR);
  assert.equal(verifyVendorSignature("polar", { rawBody: "{}", headers: {}, secret: "" }).reason, REASON.NO_SECRET);
});
