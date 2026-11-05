/**
 * pkce-authorize-url.mjs — the first leg of an OAuth authorization-code flow
 * for fitness APIs: a PKCE verifier and S256 challenge, a state value, the
 * vendor's authorize URL with its own scope separator, and the callback
 * check that turns `?code=…&state=…` into a code or a reason.
 *
 * WHAT THIS IMPLEMENTS
 *   PKCE, per RFC 7636:
 *     - a verifier is 43 to 128 characters from A-Z a-z 0-9 - . _ ~; the RFC
 *       recommends 32 random octets, base64url-encoded, which is 43 characters
 *     - S256: code_challenge = BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))
 *     - a client that can use S256 MUST use it, and must not fall back to
 *       "plain", so this file has no plain mode at all
 *   Vendors, as quoted on the site's integration guides:
 *     oura      cloud.ouraring.com/oauth/authorize; space-separated scopes;
 *               PKCE recommended with S256
 *     whoop     api.prod.whoop.com/oauth/oauth2/auth; add `offline` to get a
 *               refresh token; a state you generate must be 8 characters
 *     wahoo     api.wahooligan.com/oauth/authorize; PKCE for apps that are
 *               not confidential (Wahoo accepts plain or S256: S256 here)
 *     strava    www.strava.com/oauth/authorize; comma-separated scopes;
 *               approval_prompt auto (default) or force
 *     polar     flow.polar.com/oauth2/authorization; response type "code"
 *               only; one scope, accesslink.read_all
 *     withings  account.withings.com/oauth2_user/authorize2; comma-separated
 *               scopes. Its token exchange is a signed requesttoken call,
 *               which this file does not cover.
 *   PKCE is sent only to vendors whose guide documents it, so a vendor that
 *   ignores unknown parameters is never relied on to ignore them.
 *
 *   `readCallback(query, expected)` compares state in constant time and maps
 *   `error=access_denied` (documented by Oura and Strava) to a refusal rather
 *   than an exception: a user saying no is not a bug.
 *
 * PAGES THIS SUPPORTS
 *   https://aifitnessapi.com/integrate/oura-api   (and whoop-api, wahoo-api,
 *   strava-api, polar-api, withings-api)
 *   https://aifitnessapi.com/fix/oauth-redirect-uri-mismatch
 *
 * Randomness is injectable for tests. No dependencies. Node 20+.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import { createHash, randomBytes as nodeRandomBytes, timingSafeEqual } from "node:crypto";

export const VERIFIER_PATTERN = /^[A-Za-z0-9\-._~]{43,128}$/;

export const VENDORS = Object.freeze({
  oura: { authorize: "https://cloud.ouraring.com/oauth/authorize", scopeSeparator: " ", pkce: true },
  whoop: { authorize: "https://api.prod.whoop.com/oauth/oauth2/auth", scopeSeparator: " ", pkce: false, stateLength: 8 },
  wahoo: { authorize: "https://api.wahooligan.com/oauth/authorize", scopeSeparator: " ", pkce: true },
  strava: { authorize: "https://www.strava.com/oauth/authorize", scopeSeparator: ",", pkce: false, extra: { approval_prompt: "auto" } },
  polar: { authorize: "https://flow.polar.com/oauth2/authorization", scopeSeparator: " ", pkce: false },
  withings: { authorize: "https://account.withings.com/oauth2_user/authorize2", scopeSeparator: ",", pkce: false },
});

/** RFC 4648 base64url without padding. */
export function base64url(bytes) {
  return Buffer.from(bytes).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/** A verifier from 32 random octets (43 characters), as RFC 7636 recommends. */
export function createVerifier({ randomBytes = nodeRandomBytes } = {}) {
  return base64url(randomBytes(32));
}

/** S256 challenge for a verifier; refuses a verifier RFC 7636 would not accept. */
export function challengeS256(verifier) {
  if (!VERIFIER_PATTERN.test(verifier)) throw new RangeError("code_verifier must be 43-128 characters of A-Z a-z 0-9 - . _ ~");
  return base64url(createHash("sha256").update(verifier, "ascii").digest());
}

const STATE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** An unguessable state; WHOOP's is exactly 8 characters. */
export function createState(vendor, { randomBytes = nodeRandomBytes, length } = {}) {
  const n = length ?? VENDORS[vendor]?.stateLength ?? 32;
  // Rejection sampling: 62 does not divide 256, so bytes >= 248 are redrawn.
  let out = "";
  while (out.length < n) {
    for (const b of randomBytes(n * 2)) {
      if (b < 248 && out.length < n) out += STATE_ALPHABET[b % 62];
    }
  }
  return out;
}

/**
 * Everything the redirect needs, plus what to keep server-side until the
 * callback: the state and (where used) the verifier.
 */
export function startAuthorization(vendor, { clientId, redirectUri, scopes = [], randomBytes = nodeRandomBytes, extra = {} }) {
  const v = VENDORS[vendor];
  if (!v) throw new Error(`no authorize rule for ${vendor}`);
  if (!clientId || !redirectUri) throw new TypeError("clientId and redirectUri are required");
  const state = createState(vendor, { randomBytes });
  const params = new URLSearchParams({ response_type: "code", client_id: clientId, redirect_uri: redirectUri, state });
  if (scopes.length) params.set("scope", scopes.join(v.scopeSeparator));
  let verifier = null;
  if (v.pkce) {
    verifier = createVerifier({ randomBytes });
    params.set("code_challenge", challengeS256(verifier));
    params.set("code_challenge_method", "S256");
  }
  for (const [k, val] of Object.entries({ ...(v.extra ?? {}), ...extra })) params.set(k, val);
  return { url: `${v.authorize}?${params.toString().replace(/\+/g, "%20")}`, state, verifier };
}

function sameString(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * @param {URLSearchParams|Record<string,string>|string} query  the callback's query
 * @param {{ state: string }} expected  what startAuthorization returned
 * @returns {{ ok: true, code: string, grantedScope: string|null } | { ok: false, reason: "denied"|"state-mismatch"|"no-code", error?: string }}
 */
export function readCallback(query, expected) {
  const q = query instanceof URLSearchParams ? query : new URLSearchParams(typeof query === "string" ? query.replace(/^.*\?/, "") : query);
  if (!sameString(q.get("state") ?? "", expected.state)) return { ok: false, reason: "state-mismatch" };
  const error = q.get("error");
  if (error) return { ok: false, reason: "denied", error };
  const code = q.get("code");
  if (!code) return { ok: false, reason: "no-code" };
  return { ok: true, code, grantedScope: q.get("scope") };
}
