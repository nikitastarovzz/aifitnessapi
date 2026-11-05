/**
 * multi-window-rate-pacer.mjs — spend a vendor's documented request budget
 * on purpose, across every window it enforces at once, instead of finding the
 * limit by collecting 429s.
 *
 * WHAT THIS IMPLEMENTS
 *   `createPacer({ policies })` checks each request against every policy
 *   that applies to it before it is sent. `reserve(req)` either records the
 *   request and returns `{ ok: true }`, or returns `{ ok: false, waitMs,
 *   policy }` naming the window that is full and when a slot opens. `run(req,
 *   fn)` waits and then calls `fn`.
 *
 *   Two kinds of window:
 *     fixed    resets on a clock boundary. Strava documents its 15-minute
 *              window resetting at 0, 15, 30 and 45 past the hour and its
 *              daily window at midnight UTC.
 *     sliding  no boundary documented. A sliding log of N per W is the safe
 *              reading: if no W-long stretch holds more than N requests, no
 *              aligned window can either, wherever the vendor puts it.
 *
 *   Every request a policy covers counts once it is sent, whatever the
 *   response. Strava says requests that break the short-term limit still
 *   count toward the daily one, so a 429 is not a refund.
 *
 *   Presets carry only the numbers the vendors publish, as quoted on the
 *   site's integration guides:
 *     STRAVA (new app)   overall 200 / 15 min and 2,000 / day; non-upload
 *                        100 / 15 min and 1,000 / day (every endpoint except
 *                        creating activities, uploads and media uploads)
 *     WHOOP (default)    100 / minute and 10,000 / day
 *     WAHOO sandbox      25 / 5 min, 100 / hour, 250 / day
 *     WAHOO production   200 / 5 min, 1,000 / hour, 5,000 / day; auth,
 *                        token refreshes and file downloads do not count
 *   `parseWhoopLimitHeader` reads WHOOP's X-RateLimit-Limit ("100,
 *   100;window=60, 10000;window=86400") so the policies can follow what the
 *   server reports rather than what was true when this file was written.
 *
 * PAGES THIS SUPPORTS
 *   https://aifitnessapi.com/integrate/strava-api
 *   https://aifitnessapi.com/integrate/whoop-api
 *   https://aifitnessapi.com/integrate/wahoo-api
 *   https://aifitnessapi.com/cookbook/rate-limit-fetcher (what to do on a 429)
 *
 * Clock and sleep are injectable. No dependencies. Node 20+.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

const MIN = 60_000;
const DAY = 86_400_000;

/** @typedef {{ name: string, limit: number, windowMs: number, kind: "fixed"|"sliding", appliesTo?: (req: object) => boolean }} Policy */

const isStravaUpload = (req) => req.upload === true;
const wahooCounts = (req) => !["auth", "refresh", "file"].includes(req.kind);

export const PRESETS = Object.freeze({
  STRAVA: [
    { name: "strava overall 15 min", limit: 200, windowMs: 15 * MIN, kind: "fixed" },
    { name: "strava overall daily", limit: 2000, windowMs: DAY, kind: "fixed" },
    { name: "strava non-upload 15 min", limit: 100, windowMs: 15 * MIN, kind: "fixed", appliesTo: (r) => !isStravaUpload(r) },
    { name: "strava non-upload daily", limit: 1000, windowMs: DAY, kind: "fixed", appliesTo: (r) => !isStravaUpload(r) },
  ],
  WHOOP: [
    { name: "whoop minute", limit: 100, windowMs: MIN, kind: "sliding" },
    { name: "whoop day", limit: 10000, windowMs: DAY, kind: "sliding" },
  ],
  WAHOO_SANDBOX: [
    { name: "wahoo 5 min", limit: 25, windowMs: 5 * MIN, kind: "sliding", appliesTo: wahooCounts },
    { name: "wahoo hour", limit: 100, windowMs: 60 * MIN, kind: "sliding", appliesTo: wahooCounts },
    { name: "wahoo day", limit: 250, windowMs: DAY, kind: "sliding", appliesTo: wahooCounts },
  ],
  WAHOO_PRODUCTION: [
    { name: "wahoo 5 min", limit: 200, windowMs: 5 * MIN, kind: "sliding", appliesTo: wahooCounts },
    { name: "wahoo hour", limit: 1000, windowMs: 60 * MIN, kind: "sliding", appliesTo: wahooCounts },
    { name: "wahoo day", limit: 5000, windowMs: DAY, kind: "sliding", appliesTo: wahooCounts },
  ],
});

/**
 * WHOOP's X-RateLimit-Limit: the first value is the current quota, then one
 * `limit;window=seconds` item per window.
 * @returns {{ limit: number, windowMs: number }[]}
 */
export function parseWhoopLimitHeader(value) {
  if (typeof value !== "string") return [];
  const out = [];
  for (const item of value.split(",")) {
    const [count, ...params] = item.trim().split(";");
    const window = params.map((p) => p.trim()).find((p) => p.startsWith("window="));
    if (!window) continue;
    const limit = Number(count);
    const seconds = Number(window.slice("window=".length));
    if (Number.isInteger(limit) && limit > 0 && Number.isFinite(seconds) && seconds > 0) out.push({ limit, windowMs: seconds * 1000 });
  }
  return out;
}

/** Policies for WHOOP from a header value, falling back to the published defaults. */
export function whoopPoliciesFromHeader(value) {
  const parsed = parseWhoopLimitHeader(value);
  if (!parsed.length) return PRESETS.WHOOP;
  return parsed.map((p) => ({ name: `whoop ${p.windowMs / 1000}s`, limit: p.limit, windowMs: p.windowMs, kind: "sliding" }));
}

/** Start of the fixed window holding `t` (epoch-aligned, so UTC quarter hours and UTC midnight). */
export function fixedWindowStart(t, windowMs) {
  return Math.floor(t / windowMs) * windowMs;
}

/**
 * @param {{ policies: Policy[], now?: () => number, sleep?: (ms: number) => Promise<void> }} opts
 */
export function createPacer({ policies, now = Date.now, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  if (!Array.isArray(policies) || !policies.length) throw new TypeError("give at least one policy");
  for (const p of policies) {
    if (!(p.limit > 0) || !(p.windowMs > 0) || !["fixed", "sliding"].includes(p.kind)) throw new TypeError(`bad policy ${p.name}`);
  }
  /** Per policy: sent timestamps (sliding) or { start, count } (fixed). */
  const state = policies.map((p) => (p.kind === "sliding" ? { log: [] } : { start: -1, count: 0 }));

  function waitFor(i, t) {
    const p = policies[i];
    const s = state[i];
    if (p.kind === "fixed") {
      const start = fixedWindowStart(t, p.windowMs);
      const count = s.start === start ? s.count : 0;
      return count < p.limit ? 0 : start + p.windowMs - t;
    }
    while (s.log.length && s.log[0] <= t - p.windowMs) s.log.shift();
    return s.log.length < p.limit ? 0 : s.log[0] + p.windowMs - t;
  }

  function applicable(req) {
    return policies.map((p, i) => [p, i]).filter(([p]) => !p.appliesTo || p.appliesTo(req));
  }

  function reserve(req = {}) {
    const t = now();
    let worst = null;
    for (const [p, i] of applicable(req)) {
      const w = waitFor(i, t);
      if (w > 0 && (!worst || w > worst.waitMs)) worst = { ok: false, waitMs: w, policy: p.name };
    }
    if (worst) return worst;
    for (const [p, i] of applicable(req)) {
      const s = state[i];
      if (p.kind === "sliding") s.log.push(t);
      else {
        const start = fixedWindowStart(t, p.windowMs);
        if (s.start !== start) Object.assign(s, { start, count: 0 });
        s.count++;
      }
    }
    return { ok: true };
  }

  /** Wait until every applicable window has room, then send. */
  async function run(req, fn) {
    for (;;) {
      const r = reserve(req);
      if (r.ok) return fn();
      await sleep(r.waitMs);
    }
  }

  /**
   * Adopt a server-reported usage for a fixed window (e.g. Strava's
   * X-RateLimit-Usage "15-minute, daily" pair) when it is higher than ours:
   * other processes sharing the app's quota are invisible otherwise.
   */
  function observeUsage(policyName, used) {
    const i = policies.findIndex((p) => p.name === policyName);
    if (i < 0 || policies[i].kind !== "fixed") return;
    const start = fixedWindowStart(now(), policies[i].windowMs);
    const s = state[i];
    if (s.start !== start) Object.assign(s, { start, count: 0 });
    s.count = Math.max(s.count, used);
  }

  /** How much each policy has left right now. */
  function remaining() {
    const t = now();
    return policies.map((p, i) => {
      waitFor(i, t);
      const s = state[i];
      const used = p.kind === "sliding" ? s.log.length : s.start === fixedWindowStart(t, p.windowMs) ? s.count : 0;
      return { policy: p.name, remaining: p.limit - used };
    });
  }

  return { reserve, run, observeUsage, remaining };
}

/** Strava's usage headers are a "15-minute, daily" pair. */
export function parseStravaUsage(value) {
  if (typeof value !== "string") return null;
  const [short, daily] = value.split(",").map((s) => Number(s.trim()));
  return Number.isFinite(short) && Number.isFinite(daily) ? { short, daily } : null;
}
