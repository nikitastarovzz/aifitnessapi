/**
 * workout-type-crosswalk.test.mjs
 *
 * The contract for workout-type-crosswalk.mjs, against the site's published
 * dataset (public/datasets/workout-types-crosswalk-2026.json, CC BY 4.0):
 * rebuilding the crosswalk from the dataset's constant names alone
 * reproduces every row's derived crosswalkKey and sameNameOn exactly; each
 * fallback is a real constant on its platform, and the sentence that makes
 * it the fallback is in the site's generated copy of the vendor reference.
 *
 * Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { FALLBACK, PLATFORMS, createCrosswalk, crosswalkKey, fallbackLabel } from "./workout-type-crosswalk.mjs";

const dataset = JSON.parse(readFileSync(new URL("../public/datasets/workout-types-crosswalk-2026.json", import.meta.url), "utf8"));
const rows = dataset.items;
const cw = createCrosswalk(rows);

test("the dataset has rows for all four platforms", () => {
  assert.deepEqual([...new Set(rows.map((r) => r.platform))].sort(), [...PLATFORMS].sort());
});

test("crosswalkKey reproduces the dataset's derived key for every row", () => {
  const wrong = rows.filter((r) => crosswalkKey(r.constant) !== r.crosswalkKey);
  assert.deepEqual(wrong.map((r) => `${r.platform}:${r.constant}`), []);
});

test("sameNameOn reproduces the dataset's column for every row", () => {
  const wrong = [];
  for (const r of rows) {
    const mine = cw.sameNameOn(r.platform, r.constant).sort().join("; ") || null;
    if (mine !== r.sameNameOn) wrong.push(`${r.platform}:${r.constant} → ${mine} vs ${r.sameNameOn}`);
  }
  assert.deepEqual(wrong, []);
});

test("same-name pairs translate; prefixes and case do not matter", () => {
  assert.deepEqual(cw.translate("healthkit", "running", "health-connect"), { constant: "EXERCISE_TYPE_RUNNING", matched: true });
  assert.deepEqual(cw.translate("health-connect", "EXERCISE_TYPE_RUNNING", "wear-os"), { constant: "RUNNING", matched: true });
  assert.deepEqual(cw.translate("wear-os", "BADMINTON", "healthkit"), { constant: "badminton", matched: true });
});

test("no match lands on the target's documented catch-all and keeps the original", () => {
  const unmatched = rows.find((r) => r.platform === "healthkit" && !r.sameNameOn?.includes("health-connect:"));
  assert.ok(unmatched, "the dataset has a HealthKit type with no Health Connect namesake");
  const r = cw.translate("healthkit", unmatched.constant, "health-connect");
  assert.deepEqual(r, { constant: "EXERCISE_TYPE_OTHER_WORKOUT", matched: false, original: unmatched.constant });
  assert.deepEqual(fallbackLabel(r, "health-connect"), { title: unmatched.constant });
  const g = cw.translate("healthkit", unmatched.constant, "google-health-api");
  if (!g.matched) assert.deepEqual(fallbackLabel(g, "google-health-api"), { displayName: unmatched.constant });
  assert.equal(fallbackLabel({ matched: true, constant: "RUNNING" }, "wear-os"), null);
});

test("every fallback is a constant on its own platform", () => {
  for (const p of PLATFORMS) assert.ok(rows.some((r) => r.platform === p && r.constant === FALLBACK[p]), `${p}:${FALLBACK[p]}`);
});

test("each fallback's reason is in the site's generated copy of the vendor reference", () => {
  const src = readFileSync(new URL("../src/data/workoutTypes.ts", import.meta.url), "utf8");
  for (const sentence of [
    "The constant for a workout that does not match any of the other workout activity types.",
    "Any unknown new value definition will also fall automatically into `EXERCISE_TYPE_OTHER_WORKOUT`.",
    "If the `id` doesn't map to an particular `ExerciseType`, then `ExerciseType.UNKNOWN` is returned by default.",
    "If `exercise_type` is `OTHER`, this field can contain the user's custom, free-form display name.",
  ]) {
    assert.ok(src.includes(sentence), sentence);
  }
});

test("coverage reports what share of one platform has namesakes on another", () => {
  const { matched, total } = cw.coverage("healthkit", "health-connect");
  assert.equal(total, rows.filter((r) => r.platform === "healthkit").length);
  assert.equal(matched, rows.filter((r) => r.platform === "healthkit" && r.sameNameOn?.includes("health-connect:")).length);
  assert.ok(matched > 0 && matched < total);
});

test("an unknown platform or constant is an error, not a silent fallback", () => {
  assert.throws(() => cw.translate("garmin", "running", "healthkit"), RangeError);
  assert.throws(() => cw.translate("healthkit", "Running", "wear-os"), /not a healthkit constant/);
});
