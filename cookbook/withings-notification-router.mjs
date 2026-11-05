/**
 * withings-notification-router.mjs — turn a Withings notification into the
 * one Data API call that fetches what changed, after checking the secret on
 * the callback URL.
 *
 * WHAT THIS IMPLEMENTS
 *   Withings notifications are pointers, not data: a form-encoded POST with
 *   `userid`, `appli` (the category), and `startdate`/`enddate` (epoch
 *   seconds) or `date`. `routeWithingsNotification({ url, body }, { secret })`
 *     1. checks the secret query parameter Withings suggests you append to
 *        the callback URL (its example: `?token=<random-secret>`), in
 *        constant time — there is no signature to check;
 *     2. parses the form body;
 *     3. returns `{ call, userid, appli, range }`, where `call` names the
 *        Data API service for that category:
 *          1, 2, 4, 58, 61, 62, 63  Measure - Getmeas (startdate-enddate)
 *          16                       Measure v2 - Getactivity, Getintradayactivity
 *                                   or Getworkouts
 *          44                       Sleep v2 - Get or Sleep v2 - Getsummary
 *          54                       Heart v2 - List
 *          55                       nothing to fetch (notification-only)
 *        and `{ call: null, reason }` for a category this table does not
 *        know, so an unrouted notification is logged rather than dropped.
 *
 *   Withings says missed notifications are not redelivered and that you
 *   should backfill "via the Data API using lastupdate" once your endpoint
 *   is back, so the router also returns the range to fetch rather than
 *   fetching it: the queue that does the fetch can be replayed; the
 *   notification cannot.
 *
 * WHERE THE TABLE COMES FROM
 *   The category-to-call routing the site's /tools/webhook-verifier module
 *   encodes from Withings' notification pages (read 2026-10-31 through the
 *   source-snapshot workflow). The test asserts this table and that one
 *   agree for every category, so they cannot drift.
 *
 * No dependencies. Node 20+.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import { timingSafeEqual } from "node:crypto";

export const CALLS = Object.freeze({
  GETMEAS: "Measure - Getmeas",
  ACTIVITY: "Measure v2 - Getactivity, Getintradayactivity or Getworkouts",
  SLEEP: "Sleep v2 - Get or Sleep v2 - Getsummary",
  HEART: "Heart v2 - List",
  NONE: "none (notification-only)",
});

export const APPLI_ROUTES = Object.freeze({
  1: CALLS.GETMEAS,
  2: CALLS.GETMEAS,
  4: CALLS.GETMEAS,
  58: CALLS.GETMEAS,
  61: CALLS.GETMEAS,
  62: CALLS.GETMEAS,
  63: CALLS.GETMEAS,
  16: CALLS.ACTIVITY,
  44: CALLS.SLEEP,
  54: CALLS.HEART,
  55: CALLS.NONE,
});

function sameSecret(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || !b) return false;
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function epoch(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

/**
 * @param {{ url: string, body: string|Buffer }} request
 * @param {{ secret: string, tokenParam?: string }} config
 */
export function routeWithingsNotification({ url, body }, { secret, tokenParam = "token" }) {
  const given = new URL(url, "https://callback.invalid").searchParams.get(tokenParam);
  if (!sameSecret(given ?? "", secret)) return { ok: false, status: 403, reason: "callback secret missing or wrong" };

  const form = new URLSearchParams(typeof body === "string" ? body : Buffer.from(body ?? "").toString("utf8"));
  const userid = form.get("userid");
  const appli = Number(form.get("appli"));
  if (!userid || !Number.isInteger(appli)) return { ok: false, status: 400, reason: "userid and appli are required" };

  const range = { startdate: epoch(form.get("startdate")), enddate: epoch(form.get("enddate")), date: form.get("date") || null };
  const action = form.get("action");
  const call = APPLI_ROUTES[appli] ?? null;
  const base = { ok: true, status: 200, userid, appli, range, deviceid: form.get("deviceid"), action: action || null };
  if (!call) return { ...base, call: null, reason: `appli ${appli} is not in this routing table: log it and look it up on Withings' Payload and Categories page` };
  return { ...base, call, fetch: call !== CALLS.NONE };
}

/** A queue job for the fetch, keyed so a duplicate notification collapses into one. */
export function jobFor(route) {
  if (!route.ok || !route.fetch) return null;
  const { userid, appli, range } = route;
  const window = range.startdate != null ? `${range.startdate}-${range.enddate ?? ""}` : range.date ?? "all";
  return { key: `withings:${userid}:${appli}:${window}`, userid, appli, call: route.call, range };
}
