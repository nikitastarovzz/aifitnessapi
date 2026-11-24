/**
 * "Are vendor APIs up?" on /alerts: the per-endpoint rules in
 * src/lib/vendorStatus.mjs, read against the answers each endpoint gave on
 * 2026-11-24 (source-snapshot run 45496019485), and the wiring that keeps the
 * check from blocking the page.
 *
 *   node --test scripts/vendor-status.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  MAX_REDIRECTS,
  REVALIDATE_SECONDS,
  RULES,
  STATUS_ENDPOINTS,
  TIMEOUT_MS,
  answerLabel,
  errorWord,
  statusClass,
  verdict,
  whoopFallback,
} from "../src/lib/vendorStatus.mjs";
import { OAUTH_SOURCES, OAUTH_VENDORS } from "../src/data/oauthVendors.ts";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const ok = (status, finalUrl = "https://example.com/") => ({ status, finalUrl, error: null, timedOut: false });

test("each endpoint names a URL the site documents and a rule that exists", () => {
  const ids = new Set();
  for (const e of STATUS_ENDPOINTS) {
    assert.ok(!ids.has(e.id), `${e.id} twice`);
    ids.add(e.id);
    assert.ok(RULES[e.rule], `${e.id} rule ${e.rule}`);
    assert.ok(e.observed.length > 0, `${e.id} records what was observed`);
    if (e.source.module === "oauth") assert.ok(OAUTH_VENDORS.some((v) => v.id === e.source.vendorId && v.authorizeUrl.startsWith("https://")), e.id);
    if (e.source.module === "oauthSource") assert.ok(OAUTH_SOURCES[e.source.key]?.url.startsWith("https://"), e.id);
    if (e.source.module === "ghapi") assert.ok(read("src/data/googleHealthApi.ts").includes(`"key": "${e.source.key}"`), e.id);
  }
  // Every vendor the OAuth playground documents is checked.
  for (const v of OAUTH_VENDORS) assert.ok(STATUS_ENDPOINTS.some((e) => e.source.module === "oauth" && e.source.vendorId === v.id), v.id);
});

test("the rules read the answers observed on 2026-11-24 as up", () => {
  const seen = {
    "oura-authorize": ok(400),
    "oura-openapi": ok(200),
    "whoop-authorize": ok(500, "https://api.prod.whoop.com/oauth/oauth2/fallbacks/error?error=invalid_client&error_description=Client+authentication+failed"),
    "strava-authorize": ok(400),
    "polar-authorize": ok(200),
    "withings-authorize": ok(200, "https://account.withings.com/oauth2_user/login?b=authorize2"),
    "wahoo-authorize": ok(200),
    "dexcom-authorize": ok(400, "https://uam1.dexcom.com/identity/connect/authorize?prompt=login"),
    "suunto-authorize": ok(400),
    "google-authorize": ok(200),
    "google-health-discovery": ok(200),
  };
  for (const e of STATUS_ENDPOINTS) {
    assert.ok(seen[e.id], `no observation recorded in this test for ${e.id}`);
    assert.equal(verdict(e.rule, seen[e.id]), "up", e.id);
  }
});

test("a 5xx, a failed document, a timeout and a network error are not up", () => {
  assert.equal(verdict("up-unless-5xx", ok(503)), "unexpected");
  assert.equal(verdict("up-unless-5xx", ok(500)), "unexpected");
  assert.equal(verdict("2xx", ok(404)), "unexpected");
  assert.equal(verdict("2xx", ok(301)), "unexpected", "redirects are followed, so a 3xx at the end is a dead end");
  assert.equal(verdict("whoop", ok(500, "https://api.prod.whoop.com/oauth/oauth2/auth")), "unexpected", "a 500 anywhere but the fallback page");
  assert.equal(verdict("whoop", ok(500, "https://api.prod.whoop.com/oauth/oauth2/fallbacks/error?error=server_error")), "unexpected");
  assert.equal(verdict("whoop", ok(502, "https://api.prod.whoop.com/oauth/oauth2/fallbacks/error?error=invalid_client")), "unexpected");
  assert.equal(verdict("whoop", ok(400)), "up");
  assert.equal(verdict("up-unless-5xx", { status: null, finalUrl: null, error: null, timedOut: true }), "no-answer");
  assert.equal(verdict("2xx", { status: null, finalUrl: null, error: "DNS", timedOut: false }), "no-answer");
  assert.equal(whoopFallback("not a url"), false);
  assert.equal(whoopFallback("https://evil.example/oauth/oauth2/fallbacks/error?error=invalid_client"), false);
});

test("labels are fixed words, never an exception message", () => {
  assert.equal(statusClass(204), "2xx");
  assert.equal(statusClass(503), "5xx");
  assert.equal(statusClass(null), null);
  assert.equal(statusClass(42), null);
  assert.equal(answerLabel(ok(400)), "4xx (400)");
  assert.equal(answerLabel({ status: null, timedOut: true }), "no answer in 5 s");
  assert.equal(answerLabel({ status: null, timedOut: false, error: "DNS" }), "no answer (DNS)");
  assert.equal(errorWord("ENOTFOUND"), "DNS");
  assert.equal(errorWord("ERR_TLS_CERT_ALTNAME_INVALID"), "TLS");
  assert.equal(errorWord("getaddrinfo ENOTFOUND 10.0.0.1 at /var/task/x.js"), "network error");
  assert.equal(errorWord(undefined), "network error");
});

test("the check is bounded and cached by the page, not by a new route", () => {
  assert.equal(TIMEOUT_MS, 5000);
  assert.ok(MAX_REDIRECTS >= 3 && MAX_REDIRECTS <= 10);
  const page = read("src/app/alerts/page.tsx");
  assert.match(page, new RegExp(`export const revalidate = ${REVALIDATE_SECONDS};`), "the page's literal revalidate matches REVALIDATE_SECONDS");
  assert.equal(REVALIDATE_SECONDS, 600);
  assert.ok(/<Suspense fallback=\{<VendorStatusPending \/>\}>\s*<VendorStatus \/>/.test(page), "the section streams behind Suspense");
  assert.ok(page.includes("not a status page"), "the page says what the check is not");
  const probe = read("src/lib/vendorStatusProbe.ts");
  assert.ok(probe.includes("Promise.all("), "all endpoints at once");
  assert.ok(!/\bfetch\(/.test(probe), "node:https, so Next's data cache cannot replay an old answer");
  assert.ok(!fs.existsSync(new URL("../src/app/api/vendor-status", import.meta.url)), "no route of its own");
});
