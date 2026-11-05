/**
 * The logic behind /tools/oauth-playground: authorize URLs, PKCE pairs and
 * the token-exchange and refresh commands, built from src/data/oauthVendors.ts.
 *
 * Pure functions, no network. PKCE uses WebCrypto (crypto.getRandomValues and
 * crypto.subtle.digest), present in every current browser and in Node 20+,
 * so scripts/oauth-playground.test.mjs runs this exact module. The commands
 * never contain the client secret: they read it from $CLIENT_SECRET in the
 * reader's shell, and the code and refresh token from $AUTH_CODE and
 * $REFRESH_TOKEN, so nothing secret is typed into the page.
 *
 * Only `import type` here, which Node's type stripping erases.
 */
import type { OAuthVendor } from "../data/oauthVendors";

export type AuthorizeInput = {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  state: string;
  /** Present when PKCE is on. */
  pkce?: { challenge: string; method: "S256" | "plain" } | null;
  /** Use one of the vendor's documented alternative authorization URLs instead. */
  authorizeUrl?: string;
};

export type TokenInput = {
  clientId: string;
  redirectUri: string;
  /** The PKCE verifier, when PKCE is on. */
  verifier?: string | null;
};

const B64URL = /[+/=]/g;

/** Base64url without padding (RFC 4648 §5), the encoding Oura and Wahoo describe for the challenge. */
export function base64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(B64URL, (c) => (c === "+" ? "-" : c === "/" ? "_" : ""));
}

function cryptoObj(): Crypto {
  const c = globalThis.crypto;
  if (!c?.getRandomValues || !c.subtle) throw new Error("WebCrypto is not available in this environment.");
  return c;
}

/**
 * A code verifier: `bytes` random bytes as base64url. 48 bytes give 64
 * characters, inside Oura's documented 43–128 range, all of them from the
 * unreserved set (letters, digits, "-" and "_") that Wahoo lists.
 */
export function generateVerifier(bytes = 48): string {
  const buf = new Uint8Array(bytes);
  cryptoObj().getRandomValues(buf);
  return base64Url(buf);
}

/** S256 challenge: base64url(SHA-256(ASCII verifier)), no padding. */
export async function challengeS256(verifier: string): Promise<string> {
  const digest = await cryptoObj().subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

export async function pkcePair(method: "S256" | "plain" = "S256", bytes = 48) {
  const verifier = generateVerifier(bytes);
  const challenge = method === "S256" ? await challengeS256(verifier) : verifier;
  return { verifier, challenge, method };
}

const STATE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Random state. WHOOP requires eight characters if you generate it, so that vendor gets eight. */
export function generateState(vendor: Pick<OAuthVendor, "id">, length?: number): string {
  const n = length ?? (vendor.id === "whoop" ? 8 : 24);
  const buf = new Uint8Array(n);
  cryptoObj().getRandomValues(buf);
  let s = "";
  for (const b of buf) s += STATE_CHARS[b % STATE_CHARS.length];
  return s;
}

/** Scopes as the vendor joins them, with required ones first and no duplicates. */
export function scopeString(vendor: OAuthVendor, scopes: string[]): string {
  const all = [...(vendor.requiredScopes ?? []), ...scopes.map((s) => s.trim()).filter(Boolean)];
  return [...new Set(all)].join(vendor.scopeSeparator);
}

/** Percent-encode a query value, leaving "," and ":" readable (both are legal in a query). */
function encScope(v: string): string {
  return encodeURIComponent(v).replace(/%2C/g, ",").replace(/%3A/g, ":");
}

/** The authorization URL, parameters in a fixed order so the output is stable. */
export function buildAuthorizeUrl(vendor: OAuthVendor, input: AuthorizeInput): string {
  const base = input.authorizeUrl ?? vendor.authorizeUrl;
  const parts: [string, string, boolean?][] = [
    ["response_type", "code"],
    ["client_id", input.clientId],
  ];
  if (input.redirectUri) parts.push(["redirect_uri", input.redirectUri]);
  const scope = scopeString(vendor, input.scopes);
  if (scope) parts.push(["scope", scope, true]);
  if (input.state) parts.push(["state", input.state]);
  if (input.pkce) {
    parts.push(["code_challenge", input.pkce.challenge]);
    parts.push(["code_challenge_method", input.pkce.method]);
  }
  for (const [k, v] of Object.entries(vendor.extraAuthorizeParams ?? {})) parts.push([k, v]);
  const qs = parts.map(([k, v, isScope]) => `${k}=${isScope ? encScope(v) : encodeURIComponent(v)}`).join("&");
  return `${base}?${qs}`;
}

/* ---------------------------------------------------------------------- *
 * curl commands
 * ---------------------------------------------------------------------- */

/** POSIX single-quoted literal. */
export function sq(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

/** Double-quoted, for values that include a $VAR the shell must expand. Escapes ", \ and backticks. */
function dq(s: string): string {
  return `"${s.replace(/(["\\`])/g, "\\$1")}"`;
}

type Field = [name: string, value: string, expand?: boolean];

function lines(head: string, rest: string[]): string {
  return [head, ...rest].join(" \\\n  ");
}

function headerArgs(vendor: OAuthVendor): string[] {
  return Object.entries(vendor.extraHeaders ?? {}).map(([k, v]) => `-H ${sq(`${k}: ${v}`)}`);
}

function formCommand(vendor: OAuthVendor, url: string, fields: Field[], basic: boolean, clientId: string): string {
  const args: string[] = [];
  if (basic) args.push(`-u ${dq(`${clientId}:$CLIENT_SECRET`)}`);
  args.push(`-H ${sq("Content-Type: application/x-www-form-urlencoded")}`);
  args.push(...headerArgs(vendor));
  for (const [k, v, expand] of fields) args.push(`--data-urlencode ${expand ? dq(`${k}=${v}`) : sq(`${k}=${v}`)}`);
  return lines(`curl -X POST ${sq(url)}`, args);
}

/** Query-string POST, as Wahoo documents its token calls. $VARS stay expandable inside double quotes. */
function queryCommand(vendor: OAuthVendor, url: string, fields: Field[]): string {
  const qs = fields
    .map(([k, v, expand]) => `${k}=${expand ? v : encodeURIComponent(v)}`)
    .join("&");
  return lines(`curl -X POST ${dq(`${url}?${qs}`)}`, headerArgs(vendor));
}

/** Client credential fields for vendors that take them in the body. */
function bodyCreds(vendor: OAuthVendor, clientId: string, withSecret: boolean): Field[] {
  if (vendor.clientAuth === "basic") return [];
  const f: Field[] = [["client_id", clientId]];
  if (withSecret) f.push(["client_secret", "$CLIENT_SECRET", true]);
  return f;
}

/**
 * The code-for-token exchange, as a shell command. Withings' exchange also
 * needs a nonce and a signature computed with the secret (its "Request
 * Signature" page); the command marks both as values to fill in.
 */
export function tokenCurl(vendor: OAuthVendor, input: TokenInput): string {
  const pkce = Boolean(input.verifier);
  const basic = vendor.clientAuth === "basic";
  if (vendor.tokenStyle === "query") {
    // Wahoo: PKCE apps (Confidential = No) send code_verifier and no client_secret.
    const fields: Field[] = pkce
      ? [["client_id", input.clientId], ["code", "$AUTH_CODE", true], ["redirect_uri", input.redirectUri], ["grant_type", "authorization_code"], ["code_verifier", input.verifier!]]
      : [["client_secret", "$CLIENT_SECRET", true], ["code", "$AUTH_CODE", true], ["redirect_uri", input.redirectUri], ["grant_type", "authorization_code"], ["client_id", input.clientId]];
    return queryCommand(vendor, vendor.tokenUrl, fields);
  }
  if (vendor.tokenStyle === "withings") {
    const fields: Field[] = [
      ["action", "requesttoken"],
      ["client_id", input.clientId],
      ["grant_type", "authorization_code"],
      ["code", "$AUTH_CODE", true],
      ["redirect_uri", input.redirectUri],
      ["nonce", "$NONCE", true],
      ["signature", "$SIGNATURE", true],
    ];
    if (pkce) fields.push(["code_verifier", input.verifier!]);
    return [
      "# Withings signs this request: get $NONCE from its signature service and compute $SIGNATURE",
      "# with your client secret as its \"Request Signature\" page describes (not computed here).",
      formCommand(vendor, vendor.tokenUrl, fields, false, input.clientId),
    ].join("\n");
  }
  const fields: Field[] = [["grant_type", "authorization_code"], ["code", "$AUTH_CODE", true]];
  if (input.redirectUri) fields.push(["redirect_uri", input.redirectUri]);
  fields.push(...bodyCreds(vendor, input.clientId, true));
  if (pkce) fields.push(["code_verifier", input.verifier!]);
  return formCommand(vendor, vendor.tokenUrl, fields, basic, input.clientId);
}

/** The refresh call, or null where the vendor documents none (the page shows `vendor.refresh.text`). */
export function refreshCurl(vendor: OAuthVendor, input: TokenInput): string | null {
  if (!vendor.refresh.curl) return null;
  const pkce = Boolean(input.verifier);
  if (vendor.tokenStyle === "query") {
    const fields: Field[] = pkce
      ? [["client_id", input.clientId], ["grant_type", "refresh_token"], ["refresh_token", "$REFRESH_TOKEN", true], ["code_verifier", input.verifier!]]
      : [["client_secret", "$CLIENT_SECRET", true], ["client_id", input.clientId], ["grant_type", "refresh_token"], ["refresh_token", "$REFRESH_TOKEN", true]];
    return queryCommand(vendor, vendor.tokenUrl, fields);
  }
  const fields: Field[] = [["grant_type", "refresh_token"], ["refresh_token", "$REFRESH_TOKEN", true]];
  fields.push(...bodyCreds(vendor, input.clientId, true));
  // WHOOP's sample refresh payload carries scope=offline.
  if (vendor.id === "whoop") fields.push(["scope", "offline"]);
  return formCommand(vendor, vendor.tokenUrl, fields, vendor.clientAuth === "basic", input.clientId);
}

/** Whether a PKCE pair should be offered by default. */
export function pkceDefault(vendor: OAuthVendor): boolean {
  return vendor.pkce.status !== "not-documented";
}
