/**
 * /tools/oauth-playground: the PKCE, authorize-URL and curl builders, run
 * through the same modules the page imports.
 *
 *   node --test scripts/oauth-playground.test.mjs     (npm run test:oauth)
 *
 * The S256 code is pinned to Oura's own worked example (its Authentication
 * page prints a verifier and the challenge derived from it), so a change
 * that produced a well-formed but wrong challenge still fails. Every
 * generated command is parsed by `bash -n`, never run: the page sends no
 * request, and neither do these tests.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { OAUTH_VENDORS, OAUTH_SOURCES, OURA_PKCE_VECTOR } from "../src/data/oauthVendors.ts";
import {
  base64Url,
  buildAuthorizeUrl,
  challengeS256,
  generateState,
  generateVerifier,
  pkceDefault,
  pkcePair,
  refreshCurl,
  scopeString,
  tokenCurl,
} from "../src/lib/oauthPlayground.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const vendor = (id) => OAUTH_VENDORS.find((v) => v.id === id);
const INPUT = { clientId: "my-client-id", redirectUri: "https://example.com/callback" };

test("S256 reproduces Oura's documented example pair", async () => {
  assert.equal(await challengeS256(OURA_PKCE_VECTOR.verifier), OURA_PKCE_VECTOR.challenge);
});

test("verifiers are 43-128 unreserved characters, challenges are unpadded base64url", async () => {
  for (let i = 0; i < 20; i++) {
    const v = generateVerifier();
    assert.match(v, /^[A-Za-z0-9\-_]{43,128}$/);
    const { challenge } = await pkcePair("S256");
    assert.match(challenge, /^[A-Za-z0-9\-_]{43}$/);
  }
  assert.equal(generateVerifier(32).length, 43);
  assert.equal(base64Url(new Uint8Array([251, 255])), "-_8");
  const plain = await pkcePair("plain");
  assert.equal(plain.challenge, plain.verifier);
});

test("WHOOP state is eight characters; others are longer and random", () => {
  assert.equal(generateState(vendor("whoop")).length, 8);
  const a = generateState(vendor("oura"));
  assert.equal(a.length, 24);
  assert.notEqual(a, generateState(vendor("oura")));
});

test("Oura's authorize URL carries the same parameters as Oura's own example", () => {
  const url = buildAuthorizeUrl(vendor("oura"), {
    clientId: "E55QJ2DGMZUXK6TN",
    redirectUri: "https://example.com/callback",
    scopes: ["email", "personal"],
    state: "3PgHyjNECEu5YgTQP33NC5tZJ0onm2",
    pkce: { challenge: OURA_PKCE_VECTOR.challenge, method: "S256" },
  });
  const documented = new URL(
    "https://cloud.ouraring.com/oauth/authorize?response_type=code&client_id=E55QJ2DGMZUXK6TN&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=email+personal&state=3PgHyjNECEu5YgTQP33NC5tZJ0onm2&code_challenge=43Kb1gELSIjkvwzrPtAg0Lz2HqCG3BtS_SUMAQhjv7c&code_challenge_method=S256",
  );
  const ours = new URL(url);
  assert.equal(ours.origin + ours.pathname, documented.origin + documented.pathname);
  assert.deepEqual(Object.fromEntries(ours.searchParams), Object.fromEntries(documented.searchParams));
});

test("every vendor's authorize URL starts at its documented address with its own scope separator", () => {
  for (const v of OAUTH_VENDORS) {
    const scopes = v.scopes.slice(0, 2).map((s) => s.scope);
    const url = new URL(buildAuthorizeUrl(v, { ...INPUT, scopes, state: "abcdefgh", pkce: null }));
    assert.equal(url.origin + url.pathname, v.authorizeUrl, v.id);
    assert.equal(url.searchParams.get("response_type"), "code", v.id);
    assert.equal(url.searchParams.get("client_id"), INPUT.clientId, v.id);
    assert.equal(url.searchParams.get("redirect_uri"), INPUT.redirectUri, v.id);
    assert.equal(url.searchParams.get("code_challenge"), null, v.id);
    const expected = scopeString(v, scopes);
    assert.equal(url.searchParams.get("scope") ?? "", expected, v.id);
    if (scopes.length === 2) assert.ok(expected.includes(v.scopeSeparator), v.id);
    for (const [k, val] of Object.entries(v.extraAuthorizeParams ?? {})) assert.equal(url.searchParams.get(k), val, `${v.id} ${k}`);
  }
});

test("Dexcom always sends offline_access, its only scope", () => {
  const url = new URL(buildAuthorizeUrl(vendor("dexcom"), { ...INPUT, scopes: [], state: "s" }));
  assert.equal(url.searchParams.get("scope"), "offline_access");
});

test("PKCE parameters appear only when asked for, and default on only where documented", () => {
  for (const v of OAUTH_VENDORS) {
    const url = new URL(buildAuthorizeUrl(v, { ...INPUT, scopes: [], state: "s", pkce: { challenge: "c".repeat(43), method: "S256" } }));
    assert.equal(url.searchParams.get("code_challenge_method"), "S256");
    assert.equal(pkceDefault(v), v.pkce.status !== "not-documented", v.id);
  }
  assert.equal(pkceDefault(vendor("oura")), true);
  assert.equal(pkceDefault(vendor("wahoo")), true);
  assert.equal(pkceDefault(vendor("strava")), false);
});

function bashParses(cmd) {
  const r = spawnSync("bash", ["-n", "-c", cmd], { encoding: "utf8" });
  return r.status === 0 ? null : r.stderr;
}

test("token and refresh commands parse as shell and never contain a secret value", () => {
  for (const v of OAUTH_VENDORS) {
    for (const verifier of [null, "v".repeat(64)]) {
      const t = tokenCurl(v, { ...INPUT, verifier });
      assert.equal(bashParses(t), null, `${v.id} token: ${t}`);
      assert.ok(t.includes(v.tokenUrl), v.id);
      assert.ok(t.includes("$AUTH_CODE"), v.id);
      assert.ok(!/demo-secret|client_secret=[^$]/.test(t), `${v.id} token leaks a literal secret`);
      if (verifier) assert.ok(t.includes(`code_verifier=${verifier}`), `${v.id} token without verifier`);
      const r = refreshCurl(v, { ...INPUT, verifier });
      if (!v.refresh.curl) {
        assert.equal(r, null, v.id);
        continue;
      }
      assert.equal(bashParses(r), null, `${v.id} refresh: ${r}`);
      assert.ok(r.includes("$REFRESH_TOKEN") && r.includes("grant_type=refresh_token"), v.id);
    }
  }
});

test("client credentials go where each vendor says", () => {
  for (const v of OAUTH_VENDORS) {
    const t = tokenCurl(v, { ...INPUT, verifier: null });
    if (v.tokenStyle === "withings") {
      // Withings signs the request with the secret instead of sending it.
      assert.ok(t.includes("signature=$SIGNATURE") && !t.includes("client_secret="), v.id);
    } else if (v.clientAuth === "basic") {
      assert.ok(t.includes(`-u "${INPUT.clientId}:$CLIENT_SECRET"`), v.id);
      assert.ok(!t.includes("client_secret="), v.id);
    } else assert.ok(t.includes("client_secret=$CLIENT_SECRET"), v.id);
  }
  // Wahoo with PKCE (Confidential = No) sends the verifier and no secret, in the query string.
  const w = tokenCurl(vendor("wahoo"), { ...INPUT, verifier: "x".repeat(64) });
  assert.ok(!w.includes("CLIENT_SECRET") && w.includes("oauth/token?client_id="), w);
  assert.ok(tokenCurl(vendor("withings"), { ...INPUT }).includes("action=requesttoken"));
  assert.ok(refreshCurl(vendor("whoop"), INPUT).includes("scope=offline"));
});

test("no refresh command where the vendor documents none", () => {
  for (const id of ["polar", "withings", "suunto"]) assert.equal(refreshCurl(vendor(id), INPUT), null, id);
});

test("every fact names a source and a quote, and the snapshot-sourced ones are in the evidence file", () => {
  const evidence = JSON.parse(readFileSync(path.join(ROOT, "ops/sources/evidence/tools-oauth-playground.json"), "utf8"));
  const have = new Set(evidence.map((r) => `${r.url}\n${r.quote}`));
  for (const r of evidence) assert.ok(r.quote.length >= 12 && r.claim && r.url.startsWith("https://"), JSON.stringify(r));
  for (const v of OAUTH_VENDORS) {
    const facts = [v.authorize, v.token, ...v.altAuthorize, ...v.scopes, v.refresh, v.lifetime, ...v.notes, v.scopeNote].filter(Boolean);
    if (v.pkce.quote) facts.push(v.pkce);
    else assert.equal(v.pkce.status, "not-documented", v.id);
    for (const f of facts) {
      const src = OAUTH_SOURCES[f.source];
      assert.ok(src, `${v.id}: unknown source ${f.source}`);
      assert.ok(f.quote && f.quote.length >= 12, `${v.id}: short quote ${f.quote}`);
      if (src.via === "snapshot") assert.ok(have.has(`${src.url}\n${f.quote}`), `${v.id}: not in evidence: ${f.quote}`);
    }
    if (v.id !== "google-health" && v.id !== "suunto" && v.id !== "dexcom") assert.ok(v.scopes.length > 0, `${v.id} has no scopes`);
  }
  assert.ok(have.has(`${OAUTH_SOURCES.ouraAuth.url}\n${OURA_PKCE_VECTOR.quote}`));
});
