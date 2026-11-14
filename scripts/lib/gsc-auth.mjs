/**
 * Search Console credentials for the scripts that read the Search Analytics
 * API (scripts/search-pull.mjs, scripts/index-governor.mjs).
 *
 * Two paths, chosen by the environment:
 *   - GSC_SERVICE_ACCOUNT_JSON set (the GitHub workflows, from the repository
 *     secret of the same name): the service account's JSON key, raw or
 *     base64. serviceAccountToken signs a JWT with node:crypto, trades it at
 *     Google's OAuth token endpoint for a one-hour token with the
 *     webmasters.readonly scope, and returns it for a Bearer header.
 *   - Unset: serviceAccountToken returns null and the caller sends no
 *     Authorization header. Inside the aifitnessapi cloud environment the
 *     egress proxy injects a read-only credential for
 *     https://www.googleapis.com/webmasters/v3/; anywhere else the API
 *     answers 401/403 and the caller says so.
 *
 * The key and the token are never printed. Errors name the problem and, at
 * most, the service account's email address and Google's error code, which
 * never echoes the key.
 *
 * Failures throw an Error whose message is ready to print; each caller turns
 * it into its own exit message.
 */
import crypto from "node:crypto";

export const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
export const TOKEN_URL = "https://oauth2.googleapis.com/token";

/**
 * Service-account path (OAuth 2.0 for server-to-server applications): an
 * RS256-signed JWT whose aud is the token endpoint and whose exp is at most
 * an hour after iat, posted as grant_type
 * urn:ietf:params:oauth:grant-type:jwt-bearer. Returns null when no key is
 * configured, so the proxy-injected path runs instead. Uses the global fetch,
 * so a test can stub it.
 */
export async function serviceAccountToken(env = process.env) {
  const raw = env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  let key;
  try {
    key = JSON.parse(raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    throw new Error("GSC_SERVICE_ACCOUNT_JSON is set but is not a service-account JSON key (raw or base64).");
  }
  if (!key?.client_email || !key?.private_key) throw new Error("GSC_SERVICE_ACCOUNT_JSON has no client_email or private_key.");
  const b64url = (v) => Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");
  const iat = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url({ alg: "RS256", typ: "JWT" })}.${b64url({ iss: key.client_email, scope: GSC_SCOPE, aud: TOKEN_URL, iat, exp: iat + 3600 })}`;
  let signature;
  try {
    signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(key.private_key).toString("base64url");
  } catch {
    throw new Error("GSC_SERVICE_ACCOUNT_JSON's private_key could not sign a JWT.");
  }
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  // Google's error body names the problem (invalid_grant, a disabled key)
  // and never echoes the key, so its error code is safe to print.
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) throw new Error(`Google's token endpoint answered HTTP ${res.status} (${json.error ?? "no error code"}) for ${key.client_email}.`);
  return { token: json.access_token, account: key.client_email };
}
