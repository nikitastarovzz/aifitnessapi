// Tests for src/data/privacyLabels.mjs — the privacy label helper on
// /tools/store-submission-checklist: every quote is an evidence row, and the
// answers follow the platforms' own rules.
// Run: node --test scripts/privacy-labels.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ALWAYS,
  APPLE_URL,
  GOOGLE_URL,
  PRIVACY_ITEMS,
  PRIVACY_SOURCES,
  PURPOSES,
  decodeSelection,
  encodeSelection,
  privacyAnswers,
} from "../src/data/privacyLabels.mjs";
import { checkAll } from "./lib/evidence-check.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const on = (where = "stored", f = {}) => ({ where, linked: false, tracking: false, shared: false, optional: false, ...f });
const labels = (flags) => flags.map((f) => f.label);

test("every quote the helper shows is a row of the checklist's evidence file under the same URL", () => {
  assert.deepEqual(checkAll(ROOT, { PRIVACY_SOURCES, PRIVACY_ITEMS, PURPOSES, ALWAYS }), []);
});

test("every quote comes from Apple's App privacy details page or Google's Data safety article", () => {
  for (const [k, s] of Object.entries(PRIVACY_SOURCES)) assert.ok([APPLE_URL, GOOGLE_URL].includes(s.url), `${k}: ${s.url}`);
});

test("every item names a type on each platform, or states the gap with a quote", () => {
  for (const i of PRIVACY_ITEMS) {
    for (const side of ["apple", "google"]) {
      if (i[side]) assert.ok(i[side].length && i[side].every((t) => t.category && t.type && t.src.quote), `${i.id}.${side}`);
      else assert.ok(i.gap?.text && i.gap.src?.quote, `${i.id}: no ${side} type and no gap`);
    }
  }
  assert.equal(new Set(PRIVACY_ITEMS.map((i) => i.id)).size, PRIVACY_ITEMS.length);
});

test("health data kept and linked: Health & Fitness › Health on Apple, Health info, required, on Google", () => {
  const { apple, google } = privacyAnswers({ health: on("stored", { linked: true }) });
  assert.deepEqual(apple.declare[0].types.map((t) => [t.category, t.type]), [["Health & Fitness", "Health"]]);
  assert.deepEqual(labels(apple.declare[0].flags), ["Linked to the user's identity"]);
  assert.deepEqual(google.declare[0].types.map((t) => [t.category, t.type]), [["Health and fitness", "Health info"]]);
  assert.deepEqual(labels(google.declare[0].flags), ["Collected", "Required"]);
});

test("data that never leaves the device is declared on neither", () => {
  const { apple, google } = privacyAnswers({ photos: on("device", { linked: true, shared: true }) });
  assert.equal(apple.declare.length + google.declare.length, 0);
  assert.equal(apple.omit[0].why, PRIVACY_SOURCES.appleOnDevice);
  assert.equal(google.omit[0].why, PRIVACY_SOURCES.googleOnDevice);
});

test("sent only to answer a request: off Apple's label, in Google's form as ephemeral", () => {
  const { apple, google } = privacyAnswers({ photos: on("ephemeral") });
  assert.equal(apple.omit[0].why, PRIVACY_SOURCES.appleNotRetained);
  assert.equal(google.declare.length, 1);
  assert.ok(google.declare[0].ephemeral);
  assert.ok(labels(google.declare[0].flags).includes("Processed ephemerally"));
  assert.ok(google.declare[0].rules.includes(PRIVACY_SOURCES.googleEphemeralLimit));
  assert.deepEqual(google.declare[0].types.map((t) => t.type), ["Photos", "Videos"]);
});

test("tracking, sharing and optional collection carry their rules", () => {
  const { apple, google } = privacyAnswers({ "device-id": on("stored", { linked: true, tracking: true, shared: true, optional: true }) });
  assert.deepEqual(labels(apple.declare[0].flags), ["Linked to the user's identity", "Used for tracking"]);
  assert.ok(apple.declare[0].rules.includes(PRIVACY_SOURCES.appleOptionalAll));
  assert.deepEqual(labels(google.declare[0].flags), ["Collected", "Shared", "Optional"]);
  assert.ok(google.declare[0].rules.includes(PRIVACY_SOURCES.googleServiceProviders));
  assert.ok(google.declare[0].rules.includes(PRIVACY_SOURCES.googleOptionalAll));
  assert.ok(google.declare[0].rules.includes(PRIVACY_SOURCES.googlePurposeAds));
});

test("not linked on Apple brings the personal-data rule; pseudonymous data still counts on Google", () => {
  const { apple, google } = privacyAnswers({ interactions: on("stored") });
  assert.deepEqual(labels(apple.declare[0].flags), ["Not linked to the user's identity"]);
  assert.ok(apple.declare[0].rules.includes(PRIVACY_SOURCES.applePersonalData));
  assert.ok(google.declare[0].rules.includes(PRIVACY_SOURCES.googlePseudonymous));
});

test("gaps are stated, never filled", () => {
  const s = privacyAnswers({ sensitive: on(), profile: on() });
  assert.deepEqual(s.apple.declare.map((d) => d.item.id), ["sensitive"]);
  assert.deepEqual(s.apple.gaps.map((g) => g.item.id), ["profile"]);
  assert.deepEqual(s.google.declare.map((d) => d.item.id), ["profile"]);
  assert.deepEqual(s.google.gaps.map((g) => g.item.id), ["sensitive"]);
});

test("the share string round-trips and drops what it does not know", () => {
  const sel = { health: on("stored", { linked: true, shared: true }), photos: on("device"), crashes: on("ephemeral") };
  const enc = encodeSelection(sel);
  assert.equal(enc, "health:stored:ls;photos:device;crashes:ephemeral");
  assert.deepEqual(decodeSelection(enc), sel);
  assert.deepEqual(decodeSelection("nope:stored;health:moon;fitness:device:lt"), { fitness: on("device") });
});
