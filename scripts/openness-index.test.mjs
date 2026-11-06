/**
 * The openness index (/openness-index) and the README status badges.
 *
 *   node --test scripts/openness-index.test.mjs     (npm run test:openness)
 *
 * - Every cell derives from the source modules; a curated cell that a
 *   structured module covers throws.
 * - Every quote is a row of its evidence file under the same URL (or, for a
 *   fact read directly, appears in the module that states it), and a
 *   documented quote carries a word of its check.
 * - The four structured checks follow their rules on hand-built inputs.
 * - The score is the plain count over applicable cells.
 * - Badge text: the date at the stone's own precision, the countdown with its
 *   as-of day, "within" for a month or year, "date passed" once reached.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { loadOpennessSources } from "./lib/openness-sources.mjs";
import { checkSource } from "./lib/evidence-check.mjs";
import {
  CHECK_WORDS,
  CURATED,
  OPENNESS_CHECKS,
  OPENNESS_VENDORS,
  deriveOpenness,
  opennessScore,
  opennessSources,
  scoreText,
} from "../src/lib/opennessIndex.mjs";
import { daysBetween, lastDay, opennessBadge, stoneBadge, badgeMarkdown, stoneBadgeAlt } from "../src/lib/statusBadges.mjs";
import { GRAVEYARD } from "../src/data/graveyard.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const sources = await loadOpennessSources();
const vendors = deriveOpenness(sources);

test("every vendor has all eight cells and a count", () => {
  assert.equal(vendors.length, OPENNESS_VENDORS.length);
  for (const v of vendors) {
    assert.deepEqual(Object.keys(v.cells).sort(), OPENNESS_CHECKS.map((c) => c.id).sort(), v.id);
    for (const c of Object.values(v.cells)) assert.ok(["documented", "absent", "not-documented", "n/a"].includes(c.status), `${v.id}: ${c.status}`);
    assert.equal(v.documented, Object.values(v.cells).filter((c) => c.status === "documented").length);
    assert.equal(v.applicable, Object.values(v.cells).filter((c) => c.status !== "n/a").length);
  }
});

test("vendors are listed alphabetically, so the order ranks nothing", () => {
  const names = OPENNESS_VENDORS.map((v) => v.name.toLowerCase());
  assert.deepEqual(names, [...names].sort());
});

test("every quote is in its evidence file under the same URL", () => {
  const bad = opennessSources(vendors).flatMap((s) => checkSource(ROOT, s));
  assert.deepEqual(bad, []);
});

test("a documented or absent cell always carries its quote; a documented quote has a word of its check", () => {
  for (const v of vendors)
    for (const [k, c] of Object.entries(v.cells)) {
      if (c.status === "documented" || c.status === "absent") assert.ok(c.src?.quote, `${v.id}.${k} has no quote`);
      if (c.status === "documented") assert.match(c.src.quote, CHECK_WORDS[k], `${v.id}.${k}: "${c.src.quote}"`);
    }
});

test("curated cells never stand in for a structured module", () => {
  const withExtra = structuredClone(CURATED);
  // Oura is in the OAuth playground, so a curated PKCE cell must throw.
  withExtra.oura.pkce = { status: "documented", note: "x" };
  const backup = CURATED.oura.pkce;
  CURATED.oura.pkce = withExtra.oura.pkce;
  try {
    assert.throws(() => deriveOpenness(sources), /covered by oauthVendors/);
  } finally {
    if (backup === undefined) delete CURATED.oura.pkce;
    else CURATED.oura.pkce = backup;
  }
});

test("structured rules: PKCE, refresh, webhooks, rate limits", () => {
  const src = { url: "https://example.com/a", via: "snapshot" };
  const base = {
    oauth: [
      { id: "oura", pkce: { status: "supported", text: "Yes.", quote: "PKCE with S256 is supported.", source: "s" }, refresh: { text: "R.", quote: "Use the refresh token.", source: "s", curl: true, rotates: true } },
      { id: "polar", pkce: { status: "not-documented", text: "No mention.", quote: null, source: null }, refresh: { text: "N.", quote: "Access tokens will not expire unless revoked.", source: "s", curl: false, rotates: null } },
      { id: "suunto", pkce: { status: "not-documented", text: "No mention.", quote: null, source: null }, refresh: { text: "N.", quote: "\"refresh_token\": \"x\"", source: "s", curl: false, rotates: null } },
    ],
    oauthSources: { s: src },
    webhooks: [
      { id: "oura", signature: { text: "HMAC.", quote: "hmac.update(body)", source: "w" } },
      { id: "withings", signature: { text: "Token.", quote: "Your handler reads token.", source: "w" } },
      { id: "strava", signature: { text: "None.", quote: "Echo the challenge.", source: "w" } },
      { id: "google-health", signature: { text: "Tink.", quote: "the payload is signed with a private key", source: "w" } },
    ],
    webhookSources: { w: src },
    verifierKinds: { oura: "hmac", withings: "token", strava: "handshake", "google-health": "token" },
    rateLimits: [
      { id: "whoop", tiers: [{ id: "d", label: "Default", limits: [{ label: "per minute", max: 100, src: { url: "u", quote: "100 requests per minute", ev: "e" } }] }] },
      { id: "concept2", tiers: [], unlimited: { text: "Not limited.", src: { url: "u", quote: "not currently rate limited", ev: "e" } } },
    ],
    rateNotDocumented: [{ id: "garmin", reason: "No number.", src: { url: "u", quote: "Limited", ev: "e" } }],
    ghapi: { rateLimits: [{ metric: "Per user (minutely)", defaultLimit: "300 requests / minute", qpsImpact: "" }], sources: [{ key: "rateLimits", url: "https://g/rl" }] },
  };
  const out = Object.fromEntries(deriveOpenness(base).map((v) => [v.id, v.cells]));
  assert.equal(out.oura.pkce.status, "documented");
  assert.equal(out.polar.pkce.status, "not-documented");
  assert.equal(out.oura.refresh.status, "documented");
  assert.equal(out.polar.refresh.status, "n/a");
  assert.equal(out.suunto.refresh.status, "not-documented");
  assert.equal(out.oura["signed-webhooks"].status, "documented");
  assert.equal(out.withings["signed-webhooks"].status, "absent");
  assert.equal(out.strava["signed-webhooks"].status, "not-documented");
  assert.equal(out["google-health"]["signed-webhooks"].status, "documented");
  assert.equal(out.whoop["rate-limits"].status, "documented");
  assert.equal(out.concept2["rate-limits"].status, "documented");
  assert.equal(out.garmin["rate-limits"].status, "not-documented");
  assert.equal(out["google-health"]["rate-limits"].src.quote, "300 requests / minute");
  // A vendor no module covers and no curated cell names is not documented, never "no".
  assert.equal(out.suunto["rate-limits"].status, "not-documented");
});

test("the score is a plain count over applicable cells", () => {
  const s = opennessScore({ a: { status: "documented" }, b: { status: "n/a" }, c: { status: "absent" }, d: { status: "not-documented" } });
  assert.deepEqual(s, { documented: 1, applicable: 3 });
  assert.equal(scoreText(s), "1/3 documented");
});

test("openness badge text", () => {
  const v = vendors.find((x) => x.id === "oura");
  const b = opennessBadge(v);
  assert.equal(b.label, "Oura openness");
  assert.equal(b.value, `${v.documented}/${v.applicable} documented`);
});

test("stone badge text keeps the source's precision and names its as-of day", () => {
  assert.equal(lastDay("2026"), "2026-12-31");
  assert.equal(lastDay("2025-02"), "2025-02-28");
  assert.equal(lastDay("2026-11-02"), "2026-11-02");
  assert.equal(daysBetween("2026-11-06", "2026-12-31"), 55);
  const dying = { id: "x", name: "X API", status: "dying", end: "2026-11-10", endLabel: "Turn-off" };
  assert.equal(stoneBadge(dying, "2026-11-06").value, "turn-off 2026-11-10 · in 4 days (as of 2026-11-06)");
  assert.equal(stoneBadge(dying, "2026-11-09").value, "turn-off 2026-11-10 · in 1 day (as of 2026-11-09)");
  assert.equal(stoneBadge(dying, "2026-11-10").value, "turn-off 2026-11-10 · date passed (as of 2026-11-10)");
  const year = { id: "y", name: "Y", status: "dying", end: "2026", endLabel: "End of support" };
  assert.equal(stoneBadge(year, "2026-11-06").value, "end of support 2026 · within 55 days (as of 2026-11-06)");
  const dead = { id: "z", name: "Z", status: "dead", end: "2024-01-22", endLabel: "Removed" };
  assert.equal(stoneBadge(dead, "2026-11-06").value, "removed 2024-01-22");
  const undated = { id: "w", name: "W", status: "deprecated", end: null, endLabel: "No longer supported" };
  assert.equal(stoneBadge(undated, "2026-11-06").value, "no longer supported");
  assert.throws(() => stoneBadge(dead, "11/06/2026"));
});

test("every graveyard stone has a badge whose date is the stone's own end", () => {
  for (const g of GRAVEYARD) {
    const b = stoneBadge(g, "2026-11-06");
    assert.equal(b.label, g.name);
    if (g.end) assert.ok(b.value.includes(` ${g.end}`), `${g.id}: ${b.value}`);
  }
});

test("the README snippet's alt text does not carry the changing value", () => {
  const g = GRAVEYARD[0];
  const md = badgeMarkdown(stoneBadgeAlt(g), `/badges/api/${g.id}.svg`, "/graveyard");
  assert.equal(md, `[![${g.name} status](https://aifitnessapi.com/badges/api/${g.id}.svg)](https://aifitnessapi.com/graveyard)`);
});
