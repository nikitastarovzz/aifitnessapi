/**
 * The vendor list /tools/oauth-playground and its markdown mirror render:
 * src/data/oauthVendors.ts with the Google Health API's scopes joined in from
 * the generated Google Health API dataset (GHAPI_DOCUMENTED_SCOPES, read from
 * Google's Scopes page on GHAPI_FETCHED_ON), so the scope list is one copy.
 */
import { OAUTH_VENDORS, OAUTH_SOURCES, type OAuthVendor, type OAuthSource } from "@/data/oauthVendors";
import { GHAPI_DOCUMENTED_SCOPES, GHAPI_FETCHED_ON } from "@/data/googleHealthApi";

export const PLAYGROUND_PATH = "/tools/oauth-playground";
export const PLAYGROUND_TITLE = "Wearable OAuth Playground";
export const PLAYGROUND_H1 = "Build a wearable API's OAuth request";
export const PLAYGROUND_DESCRIPTION =
  "Authorize URLs, scopes, PKCE and token curl for Oura, WHOOP, Strava, Polar, Withings, Wahoo, Dexcom, Suunto and Google Health, from their own docs.";

export const GOOGLE_SCOPES_SOURCE: OAuthSource = {
  url: "https://developers.google.com/health/scopes",
  label: "Google Health API, “Scopes” (via this site's generated Google Health API dataset)",
  fetched: GHAPI_FETCHED_ON,
  via: "direct",
};

/** Vendors with every scope list filled in; Google's scopes carry the Scopes page's own permission sentence. */
export const PLAYGROUND_VENDORS: OAuthVendor[] = OAUTH_VENDORS.map((v) =>
  v.id === "google-health"
    ? {
        ...v,
        scopes: GHAPI_DOCUMENTED_SCOPES.map((s) => ({ scope: s.url, grants: s.permission, quote: s.permission, source: "googleWebServer" as const })),
      }
    : v,
);

export function sourceFor(id: keyof typeof OAUTH_SOURCES, vendorId?: string, isScope = false): OAuthSource {
  if (vendorId === "google-health" && isScope) return GOOGLE_SCOPES_SOURCE;
  return OAUTH_SOURCES[id];
}

export function vendorNames(): string {
  const names = PLAYGROUND_VENDORS.map((v) => v.name);
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** The page's #answer capsule; the mirror uses the same string. */
export function playgroundCapsule(): string {
  const pkce = PLAYGROUND_VENDORS.filter((v) => v.pkce.status !== "not-documented").map((v) => v.name);
  return `Pick a vendor and this shows its documented authorization URL, token URL, scopes with what each grants, PKCE support, refresh-token behavior and token lifetime, each with a link to the vendor page it came from. Enter your client_id and redirect_uri, tick scopes, and it builds the authorize URL, generates a PKCE verifier and challenge in your browser, and prints the token-exchange and refresh curl commands. It covers ${vendorNames()}, read from their own documentation on ${OAUTH_SOURCES.ouraAuth.fetched}; only ${pkce.join(" and ")} document PKCE. The page sends no request and never asks for your client secret.`;
}

export const HOW_IT_WORKS = [
  "Nothing here makes a network request. The authorize URL is text for you to open; the commands are text for you to run. The PKCE verifier is 48 random bytes from your browser's crypto.getRandomValues, base64url-encoded to 64 characters, and the S256 challenge is the base64url SHA-256 of it without padding, the construction Oura's Authentication page spells out. The code is checked against the verifier and challenge pair printed on that page.",
  "The commands read your client secret from $CLIENT_SECRET and the code from $AUTH_CODE, so neither is typed into this page. Where a vendor documents the token request but not the refresh call (Withings, Suunto), or documents no refresh at all (Polar), no refresh command is printed.",
  "Where a page does not state something, the row says not documented. PKCE marked not documented means the vendor's page does not mention it, not that the vendor rejects it.",
];

export const PKCE_LABEL: Record<OAuthVendor["pkce"]["status"], string> = {
  recommended: "Recommended",
  supported: "Supported",
  "not-documented": "Not documented",
};

const CLIENT_AUTH_TEXT: Record<OAuthVendor["clientAuth"], string> = {
  basic: "HTTP Basic (client_id:client_secret) on the token request",
  body: "client_id and client_secret in the token request body",
  "basic-or-body": "In the token request body, or as HTTP Basic",
  query: "In the token request's query string (PKCE apps send code_verifier instead of client_secret)",
};

/** The fact rows each vendor block shows, in order; the page and the mirror both render these. */
export function vendorRows(v: OAuthVendor): { label: string; text: string; source: OAuthSource }[] {
  const s = (id: keyof typeof OAUTH_SOURCES) => OAUTH_SOURCES[id];
  return [
    { label: "Authorization URL", text: `${v.authorizeUrl}. ${v.authorize.text}`, source: s(v.authorize.source) },
    ...v.altAuthorize.map((a) => ({ label: "Also", text: `${a.url}. ${a.text}`, source: s(a.source) })),
    { label: "Token URL", text: `${v.tokenUrl}. ${v.token.text}`, source: s(v.token.source) },
    ...(v.scopeNote ? [{ label: "Scope parameter", text: v.scopeNote.text, source: s(v.scopeNote.source) }] : []),
    { label: "PKCE", text: `${PKCE_LABEL[v.pkce.status]}. ${v.pkce.text}`, source: s(v.pkce.source ?? v.authorize.source) },
    { label: "Client credentials", text: `${CLIENT_AUTH_TEXT[v.clientAuth]}.`, source: s(v.token.source) },
    { label: "Refresh", text: v.refresh.text, source: s(v.refresh.source) },
    { label: "Token lifetime", text: v.lifetime.text, source: s(v.lifetime.source) },
    ...v.notes.map((n) => ({ label: "Note", text: n.text, source: s(n.source) })),
  ];
}

export function scopeSource(v: OAuthVendor, sc: OAuthVendor["scopes"][number]): OAuthSource {
  return sourceFor(sc.source, v.id, true);
}
