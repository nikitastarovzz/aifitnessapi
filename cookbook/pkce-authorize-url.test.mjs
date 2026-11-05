/**
 * pkce-authorize-url.test.mjs
 *
 * The contract for pkce-authorize-url.mjs. The PKCE vector is RFC 7636
 * Appendix B, byte for byte: those 32 octets must give the verifier
 * dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk and the challenge
 * E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM. The vendor URLs are checked
 * against the authorize endpoints, separators and parameters the site's
 * integration guides quote.
 *
 * Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  VENDORS,
  VERIFIER_PATTERN,
  base64url,
  challengeS256,
  createState,
  createVerifier,
  readCallback,
  startAuthorization,
} from "./pkce-authorize-url.mjs";

const RFC_OCTETS = [116, 24, 223, 180, 151, 153, 224, 37, 79, 250, 96, 125, 216, 173, 187, 186, 22, 212, 37, 77, 105, 214, 191, 240, 91, 88, 5, 88, 83, 132, 141, 121];
const RFC_VERIFIER = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
const RFC_CHALLENGE = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM";

/** A deterministic randomBytes that returns the RFC octets first, then a counter. */
function fakeRandom() {
  let calls = 0;
  return (n) => {
    calls++;
    if (calls === 1 && n === 32) return Buffer.from(RFC_OCTETS);
    return Buffer.from(Array.from({ length: n }, (_, i) => (i * 7 + calls) % 248));
  };
}

test("RFC 7636 Appendix B: octets → verifier → challenge", () => {
  assert.equal(createVerifier({ randomBytes: () => Buffer.from(RFC_OCTETS) }), RFC_VERIFIER);
  assert.equal(challengeS256(RFC_VERIFIER), RFC_CHALLENGE);
});

test("RFC 7636 Appendix A: base64url without padding", () => {
  assert.equal(base64url([3, 236, 255, 224, 193]), "A-z_4ME");
});

test("verifiers are 43 characters by default and outside 43-128 are refused", () => {
  const v = createVerifier();
  assert.equal(v.length, 43);
  assert.match(v, VERIFIER_PATTERN);
  assert.throws(() => challengeS256("a".repeat(42)), RangeError);
  assert.throws(() => challengeS256("a".repeat(129)), RangeError);
  assert.throws(() => challengeS256(`${"a".repeat(42)}+`), RangeError);
  assert.equal(challengeS256("a".repeat(128)).length, 43);
});

test("Oura: S256 challenge, space-separated scopes, encoded as %20", () => {
  const { url, verifier, state } = startAuthorization("oura", {
    clientId: "CID",
    redirectUri: "https://yourapp.example.com/callback",
    scopes: ["daily", "heartrate", "workout", "spo2"],
    randomBytes: fakeRandom(),
  });
  const u = new URL(url);
  assert.equal(`${u.origin}${u.pathname}`, "https://cloud.ouraring.com/oauth/authorize");
  assert.equal(u.searchParams.get("scope"), "daily heartrate workout spo2");
  assert.ok(url.includes("scope=daily%20heartrate%20workout%20spo2"));
  assert.equal(u.searchParams.get("code_challenge_method"), "S256");
  assert.equal(u.searchParams.get("code_challenge"), challengeS256(verifier));
  assert.equal(u.searchParams.get("state"), state);
  assert.equal(u.searchParams.get("response_type"), "code");
});

test("WHOOP: an 8-character state, offline in the scope list, no PKCE parameters", () => {
  const { url, state, verifier } = startAuthorization("whoop", {
    clientId: "CID",
    redirectUri: "https://yourapp.example.com/cb",
    scopes: ["read:recovery", "read:sleep", "read:workout", "offline"],
  });
  const u = new URL(url);
  assert.equal(state.length, 8);
  assert.equal(`${u.origin}${u.pathname}`, "https://api.prod.whoop.com/oauth/oauth2/auth");
  assert.equal(u.searchParams.get("scope"), "read:recovery read:sleep read:workout offline");
  assert.equal(u.searchParams.has("code_challenge"), false);
  assert.equal(verifier, null);
});

test("Strava: comma-separated scopes and approval_prompt=auto", () => {
  const u = new URL(startAuthorization("strava", { clientId: "1", redirectUri: "https://x.example/exchange_token", scopes: ["read", "activity:read_all"] }).url);
  assert.equal(u.searchParams.get("scope"), "read,activity:read_all");
  assert.equal(u.searchParams.get("approval_prompt"), "auto");
  const forced = new URL(startAuthorization("strava", { clientId: "1", redirectUri: "https://x.example/e", extra: { approval_prompt: "force" } }).url);
  assert.equal(forced.searchParams.get("approval_prompt"), "force");
});

test("Wahoo sends PKCE; Polar and Withings use their own endpoints and separators", () => {
  assert.equal(new URL(startAuthorization("wahoo", { clientId: "c", redirectUri: "https://x.example/cb" }).url).searchParams.get("code_challenge_method"), "S256");
  const polar = new URL(startAuthorization("polar", { clientId: "c", redirectUri: "https://x.example/oauth2_callback", scopes: ["accesslink.read_all"] }).url);
  assert.equal(`${polar.origin}${polar.pathname}`, "https://flow.polar.com/oauth2/authorization");
  const withings = new URL(startAuthorization("withings", { clientId: "c", redirectUri: "https://x.example/cb", scopes: ["user.info", "user.metrics", "user.activity"] }).url);
  assert.equal(withings.searchParams.get("scope"), "user.info,user.metrics,user.activity");
  assert.equal(`${withings.origin}${withings.pathname}`, "https://account.withings.com/oauth2_user/authorize2");
});

test("only vendors whose guides document PKCE get it", () => {
  assert.deepEqual(
    Object.entries(VENDORS).filter(([, v]) => v.pkce).map(([k]) => k),
    ["oura", "wahoo"],
  );
});

test("state uses only letters and digits, at the vendor's length", () => {
  for (let i = 0; i < 50; i++) assert.match(createState("oura"), /^[A-Za-z0-9]{32}$/);
  assert.match(createState("whoop"), /^[A-Za-z0-9]{8}$/);
});

test("readCallback: a code with the right state", () => {
  const r = readCallback("https://x.example/cb?code=abc&state=S1&scope=read,activity:read", { state: "S1" });
  assert.deepEqual(r, { ok: true, code: "abc", grantedScope: "read,activity:read" });
});

test("readCallback: access_denied is a refusal, a wrong state is a mismatch, no code is reported", () => {
  assert.deepEqual(readCallback({ error: "access_denied", state: "S1" }, { state: "S1" }), { ok: false, reason: "denied", error: "access_denied" });
  assert.equal(readCallback({ code: "abc", state: "S2" }, { state: "S1" }).reason, "state-mismatch");
  assert.equal(readCallback({ code: "abc" }, { state: "S1" }).reason, "state-mismatch");
  assert.equal(readCallback({ state: "S1" }, { state: "S1" }).reason, "no-code");
});

test("missing client id or redirect URI, or an unknown vendor, throws", () => {
  assert.throws(() => startAuthorization("oura", { redirectUri: "https://x" }), TypeError);
  assert.throws(() => startAuthorization("garmin", { clientId: "c", redirectUri: "https://x" }), /no authorize rule/);
});
