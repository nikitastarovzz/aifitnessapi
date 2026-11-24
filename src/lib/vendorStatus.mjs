/**
 * "Are vendor APIs up?" on /alerts: one GET to each public, unauthenticated
 * endpoint the site already documents, and what that answer means.
 *
 * Pure and dependency-free (no network, no clock), so the page and
 * scripts/vendor-status.test.mjs run the same rules; the request itself is in
 * src/lib/vendorStatusProbe.ts.
 *
 * What it checks is narrow on purpose: whether a vendor's public sign-in or
 * documentation endpoint answers our server, from where our server runs. An
 * OAuth authorize URL opened with no client_id is supposed to refuse, so a
 * 4xx there is the server working, not failing. It says nothing about the
 * vendor's data API, webhooks, token exchange or any app's credentials.
 *
 * Each rule below was written from the answer the endpoint gave on
 * 2026-11-24 to a plain GET that follows redirects, the request
 * src/lib/vendorStatusProbe.ts makes: GitHub's runner fetched every URL
 * (source-snapshot run 45496019485, because most of these hosts are blocked
 * from the dev environment), and Google's two were also fetched directly.
 * `observed` records that answer beside the rule it led to. A vendor that
 * changes how it answers a bare request will show "unexpected" until the rule
 * is re-checked; that is the honest reading, not an outage.
 */

/**
 * up-unless-5xx: the endpoint answered with any status below 500. Used for
 *   authorize URLs, which refuse a request without parameters (400, or a
 *   sign-in or error page with 200).
 * 2xx: a document that should simply load.
 * whoop: WHOOP's authorize URL redirects a request without a client to its
 *   OAuth error page, which answers 500 with `error=invalid_client` in its
 *   address. That page answering is the server working; any other 5xx is not.
 */
export const RULES = {
  "up-unless-5xx": "Up when it answers with a status below 500. Opened without a client_id, an authorize URL is meant to refuse.",
  "2xx": "Up when it answers 2xx: a public document that should load.",
  whoop:
    "Up when it answers below 500, or when it redirects to WHOOP's OAuth error page (/oauth/oauth2/fallbacks/error with error=invalid_client), which answers 500 to every request that names no client.",
};

/**
 * The endpoints, in the order the page lists them. `source` says where on the
 * site the URL comes from; src/lib/vendorStatusProbe.ts reads the URL from
 * that module, so a corrected URL there moves here too.
 *
 * @type {{ id: string, vendor: string, what: string, source: { module: "oauth", vendorId: string } | { module: "oauthSource", key: string } | { module: "ghapi", key: string }, rule: keyof typeof RULES, observed: string }[]}
 */
export const STATUS_ENDPOINTS = [
  { id: "oura-authorize", vendor: "Oura", what: "OAuth authorize URL", source: { module: "oauth", vendorId: "oura" }, rule: "up-unless-5xx", observed: "400, body “invalid_request”" },
  { id: "oura-openapi", vendor: "Oura", what: "API v2 OpenAPI document (1.43)", source: { module: "oauthSource", key: "ouraSpec" }, rule: "2xx", observed: "200, the JSON document" },
  { id: "whoop-authorize", vendor: "WHOOP", what: "OAuth authorize URL", source: { module: "oauth", vendorId: "whoop" }, rule: "whoop", observed: "500 at /oauth/oauth2/fallbacks/error?error=invalid_client after a redirect" },
  { id: "strava-authorize", vendor: "Strava", what: "OAuth authorize URL", source: { module: "oauth", vendorId: "strava" }, rule: "up-unless-5xx", observed: "400, JSON naming client_id as invalid" },
  { id: "polar-authorize", vendor: "Polar AccessLink", what: "OAuth authorize URL (Polar Flow)", source: { module: "oauth", vendorId: "polar" }, rule: "up-unless-5xx", observed: "200, a Polar Flow error page" },
  { id: "withings-authorize", vendor: "Withings", what: "OAuth authorize URL", source: { module: "oauth", vendorId: "withings" }, rule: "up-unless-5xx", observed: "200 at the Withings sign-in page after a redirect" },
  { id: "wahoo-authorize", vendor: "Wahoo", what: "OAuth authorize URL", source: { module: "oauth", vendorId: "wahoo" }, rule: "up-unless-5xx", observed: "200 at the Wahoo sign-in page after a redirect" },
  { id: "dexcom-authorize", vendor: "Dexcom", what: "OAuth login URL", source: { module: "oauth", vendorId: "dexcom" }, rule: "up-unless-5xx", observed: "400 at Dexcom's identity server after a redirect" },
  { id: "suunto-authorize", vendor: "Suunto", what: "OAuth authorize URL", source: { module: "oauth", vendorId: "suunto" }, rule: "up-unless-5xx", observed: "400, JSON naming response_type as missing" },
  { id: "google-authorize", vendor: "Google (Google Health API sign-in)", what: "OAuth 2.0 authorization endpoint", source: { module: "oauth", vendorId: "google-health" }, rule: "up-unless-5xx", observed: "200 at Google's sign-in error page after a redirect (302 on the first hop)" },
  { id: "google-health-discovery", vendor: "Google Health API", what: "v4 discovery document", source: { module: "ghapi", key: "discoveryV4" }, rule: "2xx", observed: "200, the JSON document (a HEAD request answered 404, so the check uses GET)" },
];

/** Per-request time limit, milliseconds, redirects included. */
export const TIMEOUT_MS = 5000;
/** At most this many redirects are followed. */
export const MAX_REDIRECTS = 5;
/** How long the page keeps one round of results, in seconds (the page's `revalidate`). */
export const REVALIDATE_SECONDS = 600;
export const USER_AGENT = "aifitnessapi-status-check/1.0 (+https://aifitnessapi.com/alerts)";

/** "2xx", "3xx", "4xx", "5xx", or null for no HTTP answer. */
export function statusClass(status) {
  return Number.isInteger(status) && status >= 100 && status <= 599 ? `${Math.floor(status / 100)}xx` : null;
}

/**
 * The verdict for one probe result.
 *
 * @param {keyof typeof RULES} rule
 * @param {{ status: number | null, finalUrl: string | null, error: string | null, timedOut: boolean }} r
 * @returns {"up" | "unexpected" | "no-answer"}
 *   up: answered the way the rule expects; unexpected: answered, but not that
 *   way (a 5xx, or a document that did not load); no-answer: a timeout, a
 *   DNS or TLS failure, or too many redirects.
 */
export function verdict(rule, r) {
  if (r.timedOut || r.status === null || r.status === undefined) return "no-answer";
  const s = r.status;
  if (rule === "2xx") return s >= 200 && s < 300 ? "up" : "unexpected";
  if (s < 500) return "up";
  if (rule === "whoop" && s === 500 && whoopFallback(r.finalUrl)) return "up";
  return "unexpected";
}

/** True for WHOOP's OAuth error page answering a request with no client. */
export function whoopFallback(finalUrl) {
  try {
    const u = new URL(finalUrl);
    return u.hostname === "api.prod.whoop.com" && u.pathname === "/oauth/oauth2/fallbacks/error" && u.searchParams.get("error") === "invalid_client";
  } catch {
    return false;
  }
}

/** What the page prints for a result's HTTP column. */
export function answerLabel(r) {
  if (r.timedOut) return `no answer in ${TIMEOUT_MS / 1000} s`;
  if (r.status === null || r.status === undefined) return r.error ? `no answer (${r.error})` : "no answer";
  return `${statusClass(r.status)} (${r.status})`;
}

/**
 * Short, fixed error words for a failed request: the page prints these, never
 * an exception message (which can carry a hostname, an address or a stack).
 */
export function errorWord(code) {
  const c = String(code ?? "");
  if (c === "ENOTFOUND" || c === "EAI_AGAIN") return "DNS";
  if (c === "ECONNREFUSED") return "refused";
  if (c === "ECONNRESET" || c === "EPIPE") return "reset";
  if (/CERT|SSL|TLS/i.test(c)) return "TLS";
  if (c === "TOO_MANY_REDIRECTS") return "too many redirects";
  return "network error";
}
