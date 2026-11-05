/**
 * webhook-handshakes.mjs — answer the subscription-validation requests that
 * Oura, Strava, Polar, Withings and the Google Health API send before they
 * deliver a single event.
 *
 * WHAT THIS IMPLEMENTS
 *   `answerHandshake(vendor, request, config)` takes a framework-neutral
 *   request `{ method, url, headers, body }` and returns either
 *   `{ handled: true, status, headers, body }` — the exact response the vendor
 *   expects — or `{ handled: false }`, meaning "this is a normal event, carry
 *   on to signature checks and ingestion". A subscription that never gets the
 *   right answer is never created, and nothing tells you why.
 *
 *     oura      GET ?verification_token=…&challenge=… → 200 {"challenge": …}
 *               when the token matches; Oura's sample answers a mismatch 401
 *     strava    GET ?hub.mode=subscribe&hub.challenge=…&hub.verify_token=…
 *               → 200 application/json {"hub.challenge": …}, within 2 s
 *     polar     POST whose body is {"event": "PING", …} → 200; without it the
 *               webhook is not created or modified
 *     withings  HEAD to the callback URL → 2xx, before Withings registers it
 *     google    POST {"type": "verification"} twice: with your configured
 *               Authorization header → 200 (or 201); without credentials →
 *               401 (or 403)
 *
 *   Every secret comparison is constant-time. The handler does no I/O, so it
 *   answers inside every vendor's time limit by construction.
 *
 * WHERE THE RULES COME FROM
 *   The vendor pages quoted on https://aifitnessapi.com/tools/webhook-verifier
 *   (read 2026-10-31), whose evidence file holds the sentence behind each
 *   line above.
 *
 * No dependencies. Node 20+ (or any runtime with Buffer and URL).
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import { timingSafeEqual } from "node:crypto";

const JSON_HEADERS = Object.freeze({ "content-type": "application/json" });

function same(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  return x.length === y.length && timingSafeEqual(x, y);
}

function header(headers, name) {
  if (!headers) return null;
  if (typeof headers.get === "function") return headers.get(name);
  for (const [k, v] of Object.entries(headers)) if (k.toLowerCase() === name) return Array.isArray(v) ? v[0] : String(v);
  return null;
}

function query(url) {
  return new URL(url, "http://callback.invalid").searchParams;
}

function parseJson(body) {
  if (body == null || body === "") return null;
  try {
    return JSON.parse(typeof body === "string" ? body : Buffer.from(body).toString("utf8"));
  } catch {
    return null;
  }
}

const reply = (status, body = "", headers = {}) => ({ handled: true, status, headers, body });
const PASS = Object.freeze({ handled: false });

/** Oura: GET with verification_token and challenge. */
export function oura({ method, url }, { verificationToken }) {
  if (method !== "GET") return PASS;
  const q = query(url);
  if (!q.has("verification_token") || !q.has("challenge")) return PASS;
  if (!same(q.get("verification_token"), verificationToken)) return reply(401);
  return reply(200, JSON.stringify({ challenge: q.get("challenge") }), JSON_HEADERS);
}

/** Strava: GET with hub.mode, hub.challenge and hub.verify_token. */
export function strava({ method, url }, { verifyToken }) {
  if (method !== "GET") return PASS;
  const q = query(url);
  if (q.get("hub.mode") !== "subscribe" || !q.has("hub.challenge")) return PASS;
  if (!same(q.get("hub.verify_token"), verifyToken)) return reply(403);
  return reply(200, JSON.stringify({ "hub.challenge": q.get("hub.challenge") }), JSON_HEADERS);
}

/** Polar: a PING event must get 200 OK or the webhook is not created. */
export function polar({ method, body }) {
  if (method !== "POST") return PASS;
  const json = parseJson(body);
  return json && json.event === "PING" ? reply(200) : PASS;
}

/** Withings: a HEAD to the callback URL must answer 2xx. */
export function withings({ method }) {
  return method === "HEAD" ? reply(200) : PASS;
}

/**
 * Google Health API: two verification POSTs, one with your configured
 * Authorization value and one without credentials. `authorization` is the
 * exact value you configured (for example "Bearer …").
 */
export function google({ method, headers, body }, { authorization }) {
  if (method !== "POST") return PASS;
  const json = parseJson(body);
  if (!json || Array.isArray(json) || json.type !== "verification") return PASS;
  const sent = header(headers, "authorization");
  return same(sent, authorization) ? reply(200) : reply(401);
}

export const HANDSHAKES = Object.freeze({ oura, strava, polar, withings, google });

/**
 * @param {"oura"|"strava"|"polar"|"withings"|"google"} vendor
 * @param {{ method: string, url: string, headers?: object, body?: string|Buffer }} request
 * @param {object} config  verificationToken (oura), verifyToken (strava), authorization (google)
 */
export function answerHandshake(vendor, request, config = {}) {
  const fn = HANDSHAKES[vendor];
  if (!fn) throw new Error(`no handshake rule for ${vendor}`);
  const req = { ...request, method: String(request.method || "GET").toUpperCase() };
  return fn(req, config);
}
