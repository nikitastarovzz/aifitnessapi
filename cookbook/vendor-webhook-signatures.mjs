/**
 * vendor-webhook-signatures.mjs — check an Oura, WHOOP, Terra or Polar
 * webhook signature on your server, each the way that vendor documents it.
 *
 * WHAT THIS IMPLEMENTS
 *   `verifyVendorSignature(vendor, { rawBody, headers, secret })` returns
 *   `{ ok, reason, ageMs }`. Four vendors sign with HMAC-SHA256, and no two
 *   sign the same string:
 *     oura   x-oura-signature = HEX_UPPER(HMAC(client secret,
 *              x-oura-timestamp + JSON.stringify(JSON.parse(body))))
 *     whoop  X-WHOOP-Signature = BASE64(HMAC(client secret,
 *              X-WHOOP-Signature-Timestamp + raw body)); the timestamp is
 *              milliseconds since epoch
 *     terra  terra-signature: t=<ts>,v1=<sig>[,v1=<sig>...]; HEX(HMAC(signing
 *              secret, t + "." + raw body)), compared with every v1 value;
 *              every other scheme is ignored
 *     polar  Polar-Webhook-Signature = HEX(HMAC(signature_secret_key, raw
 *              body)); hex case is compared case-insensitively because
 *              Polar's sample does not state a case
 *   Every comparison is constant-time over equal-length buffers. Secrets are
 *   a list so a rotation can accept the old and new secret for a while.
 *
 *   Replay window: none of the four pages states a tolerance, so `maxAgeMs`
 *   is yours to choose and is off by default. It is applied only where the
 *   timestamp's unit is documented (WHOOP's milliseconds); for Oura and Terra
 *   pass `timestampUnit` yourself once you have confirmed it from a captured
 *   delivery.
 *
 * WHERE THE RULES COME FROM
 *   Each rule is the one https://aifitnessapi.com/tools/webhook-verifier
 *   quotes from the vendor's own page (read 2026-10-31). The test suite signs
 *   with this file and verifies with that tool's module, and the other way
 *   round, so the two cannot drift apart silently.
 *
 * No dependencies. Node 20+.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import { createHmac, timingSafeEqual } from "node:crypto";

/** Why a request failed, as stable strings a caller can switch on. */
export const REASON = Object.freeze({
  OK: "ok",
  MISSING_HEADER: "missing-header",
  MALFORMED_HEADER: "malformed-header",
  BODY_NOT_JSON: "body-not-json",
  MISMATCH: "mismatch",
  STALE: "stale-timestamp",
  UNKNOWN_VENDOR: "unknown-vendor",
  NO_SECRET: "no-secret",
});

/**
 * The documented scheme per vendor. `timestampUnit` is filled in only where
 * the vendor's page states it.
 */
export const SCHEMES = Object.freeze({
  oura: { signatureHeader: "x-oura-signature", timestampHeader: "x-oura-timestamp", encoding: "hex-upper", timestampUnit: null },
  whoop: { signatureHeader: "x-whoop-signature", timestampHeader: "x-whoop-signature-timestamp", encoding: "base64", timestampUnit: "ms" },
  terra: { signatureHeader: "terra-signature", timestampHeader: null, encoding: "hex", timestampUnit: null },
  polar: { signatureHeader: "polar-webhook-signature", timestampHeader: null, encoding: "hex-any-case", timestampUnit: null },
});

function toBuffer(raw) {
  if (Buffer.isBuffer(raw)) return raw;
  if (raw instanceof Uint8Array) return Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength);
  if (typeof raw === "string") return Buffer.from(raw, "utf8");
  throw new TypeError("rawBody must be a Buffer, Uint8Array or string: capture it before any JSON parser runs");
}

/** Plain object, Map or WHATWG Headers; names are case-insensitive. */
export function readHeader(headers, name) {
  if (!headers) return null;
  if (typeof headers.get === "function") return headers.get(name) ?? headers.get(name.toLowerCase()) ?? null;
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === name.toLowerCase()) return Array.isArray(v) ? v[0] : String(v);
  }
  return null;
}

/** Constant-time equality of two strings, false on any length difference. */
export function constantTimeEqual(a, b) {
  const x = Buffer.from(String(a), "utf8");
  const y = Buffer.from(String(b), "utf8");
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

function hmac(secret, parts) {
  const h = createHmac("sha256", secret);
  for (const p of parts) h.update(p);
  return h.digest();
}

/** Parse `t=...,v1=...,v1=...`; other schemes are dropped (Terra: ignore all but v1). */
export function parseTerraHeader(value) {
  let t = null;
  const v1 = [];
  for (const part of String(value).split(",")) {
    const i = part.indexOf("=");
    if (i <= 0) continue;
    const k = part.slice(0, i).trim();
    const val = part.slice(i + 1).trim();
    if (k === "t") t = val;
    else if (k === "v1" && val) v1.push(val);
  }
  return t && v1.length ? { t, v1 } : null;
}

/** The expected signature(s) for one secret, as the strings the header carries. */
export function expectedSignature(vendor, { rawBody, timestamp, secret }) {
  const body = toBuffer(rawBody);
  switch (vendor) {
    case "oura": {
      // Oura's sample signs JSON.stringify of the parsed body, not the bytes.
      const reserialized = JSON.stringify(JSON.parse(body.toString("utf8")));
      return hmac(secret, [String(timestamp), reserialized]).toString("hex").toUpperCase();
    }
    case "whoop":
      return hmac(secret, [String(timestamp), body]).toString("base64");
    case "terra":
      return hmac(secret, [String(timestamp), ".", body]).toString("hex");
    case "polar":
      return hmac(secret, [body]).toString("hex");
    default:
      throw new Error(`unknown vendor ${vendor}`);
  }
}

function ageOf(timestamp, unit, nowMs) {
  if (!unit) return null;
  const n = Number(timestamp);
  if (!Number.isFinite(n)) return null;
  return nowMs - (unit === "s" ? n * 1000 : n);
}

/**
 * @param {"oura"|"whoop"|"terra"|"polar"} vendor
 * @param {{ rawBody: Buffer|Uint8Array|string, headers: object, secret: string|string[],
 *           maxAgeMs?: number, timestampUnit?: "s"|"ms", now?: () => number }} input
 * @returns {{ ok: boolean, reason: string, ageMs: number|null }}
 */
export function verifyVendorSignature(vendor, { rawBody, headers, secret, maxAgeMs = null, timestampUnit, now = Date.now }) {
  const scheme = SCHEMES[vendor];
  if (!scheme) return { ok: false, reason: REASON.UNKNOWN_VENDOR, ageMs: null };
  const secrets = (Array.isArray(secret) ? secret : [secret]).filter((s) => typeof s === "string" && s.length > 0);
  if (!secrets.length) return { ok: false, reason: REASON.NO_SECRET, ageMs: null };

  const sigHeader = readHeader(headers, scheme.signatureHeader);
  if (!sigHeader) return { ok: false, reason: REASON.MISSING_HEADER, ageMs: null };

  let timestamp = null;
  let received = [sigHeader.trim()];
  if (vendor === "terra") {
    const parsed = parseTerraHeader(sigHeader);
    if (!parsed) return { ok: false, reason: REASON.MALFORMED_HEADER, ageMs: null };
    timestamp = parsed.t;
    received = parsed.v1;
  } else if (scheme.timestampHeader) {
    timestamp = readHeader(headers, scheme.timestampHeader);
    if (!timestamp) return { ok: false, reason: REASON.MISSING_HEADER, ageMs: null };
  }

  const ageMs = ageOf(timestamp, timestampUnit ?? scheme.timestampUnit, now());
  if (maxAgeMs != null && ageMs != null && Math.abs(ageMs) > maxAgeMs) {
    return { ok: false, reason: REASON.STALE, ageMs };
  }

  for (const s of secrets) {
    let expected;
    try {
      expected = expectedSignature(vendor, { rawBody, timestamp, secret: s });
    } catch (err) {
      if (err instanceof SyntaxError) return { ok: false, reason: REASON.BODY_NOT_JSON, ageMs };
      throw err;
    }
    for (const r of received) {
      const candidate = scheme.encoding === "hex-any-case" || scheme.encoding === "hex" ? r.toLowerCase() : r;
      const want = scheme.encoding === "hex-any-case" ? expected.toLowerCase() : expected;
      if (constantTimeEqual(candidate, want)) return { ok: true, reason: REASON.OK, ageMs };
    }
  }
  return { ok: false, reason: REASON.MISMATCH, ageMs };
}

/**
 * Sign a body the way a vendor would, for fixtures and local replay tools.
 * Returns the headers the vendor would send.
 */
export function signLikeVendor(vendor, { rawBody, secret, timestamp }) {
  const sig = expectedSignature(vendor, { rawBody, timestamp, secret });
  switch (vendor) {
    case "oura":
      return { "x-oura-signature": sig, "x-oura-timestamp": String(timestamp) };
    case "whoop":
      return { "X-WHOOP-Signature": sig, "X-WHOOP-Signature-Timestamp": String(timestamp) };
    case "terra":
      return { "terra-signature": `t=${timestamp},v1=${sig}` };
    case "polar":
      return { "Polar-Webhook-Signature": sig };
    default:
      throw new Error(`unknown vendor ${vendor}`);
  }
}
