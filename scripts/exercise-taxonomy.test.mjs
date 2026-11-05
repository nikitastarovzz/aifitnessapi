/**
 * Tests for the exercise taxonomy crosswalk: the matching rule in
 * scripts/fetch-exercise-taxonomy.mjs and the generated
 * src/data/exerciseTaxonomy.ts it wrote.
 *
 * Run: npm run test:exercise-taxonomy
 *
 * The data checks re-derive every mapping from the published rule, so a
 * hand edit of the generated file, or a generator change that starts joining
 * by meaning, fails here.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const gen = await import(new URL("./fetch-exercise-taxonomy.mjs", import.meta.url).href);
const data = await import(new URL("../src/data/exerciseTaxonomy.ts", import.meta.url).href);
const wt = await import(new URL("../src/data/workoutTypes.ts", import.meta.url).href);

const TARGETS = {
  healthkit: wt.WT_HEALTHKIT.map((r) => r.case),
  healthConnect: wt.WT_HEALTH_CONNECT.map((r) => r.name),
  hcSegment: wt.WT_HC_SEGMENT_TYPES.map((r) => r.name),
};

test("key: prefixes removed, lowercased, non-alphanumerics removed", () => {
  assert.equal(gen.key("EXERCISE_TYPE_STRENGTH_TRAINING"), "strengthtraining");
  assert.equal(gen.key("EXERCISE_SEGMENT_TYPE_SIT_UP"), "situp");
  assert.equal(gen.key("Sit-Up"), "situp");
  assert.equal(gen.key("traditionalStrengthTraining"), "traditionalstrengthtraining");
});

test("constantWords splits camelCase and SNAKE_CASE", () => {
  assert.deepEqual(gen.constantWords("mixedMetabolicCardioTraining"), ["mixed", "metabolic", "cardio", "training"]);
  assert.deepEqual(gen.constantWords("EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING"), ["kettlebell", "swing"]);
});

test("nameContains needs whole words in order, not substrings", () => {
  assert.deepEqual(gen.nameContains("kettlebell", ["EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING", "EXERCISE_SEGMENT_TYPE_BELL"]), ["EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING"]);
  assert.deepEqual(gen.nameContains("bell", ["EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING"]), []);
  assert.deepEqual(gen.nameContains("swing kettlebell", ["EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING"]), []);
});

test("matchTerm never maps a term that cannot name an activity", () => {
  const m = gen.matchTerm(["other"], ["other", "EXERCISE_TYPE_OTHER_WORKOUT"], false);
  assert.deepEqual(m.exact, []);
  assert.deepEqual(m.nameContains, ["other", "EXERCISE_TYPE_OTHER_WORKOUT"]);
  assert.deepEqual(gen.matchTerm(["strength"], ["EXERCISE_TYPE_STRENGTH_TRAINING"], true).exact, []);
  assert.deepEqual(gen.matchTerm(["stretching"], ["EXERCISE_TYPE_STRETCHING"], true).exact, ["EXERCISE_TYPE_STRETCHING"]);
});

test("every published mapping re-derives from the rule", () => {
  for (const t of data.ET_TERMS) {
    const names = [t.term, ...(t.alias ? [t.alias] : [])];
    for (const [k, list] of Object.entries(TARGETS)) {
      const expect = gen.matchTerm(names, list, t.matchable);
      assert.deepEqual(t[k], expect, `${t.id} ${k}`);
    }
    assert.equal(t.matchable, t.facet === "category", t.id);
    assert.equal(t.status, [t.healthkit, t.healthConnect, t.hcSegment].some((m) => m.exact.length) ? "mapped" : "unmapped", t.id);
    assert.equal(t.key, gen.key(t.term));
  }
});

test("exercise matches are exact keys only, and every one is real", () => {
  for (const e of data.ET_EXERCISE_MATCHES) {
    const hits = [...e.healthkit, ...e.healthConnect, ...e.hcSegment];
    assert.ok(hits.length > 0, e.name);
    for (const h of hits) assert.equal(gen.key(h), gen.key(e.name), `${e.name} -> ${h}`);
    for (const [k, list] of Object.entries(TARGETS)) for (const h of e[k]) assert.ok(list.includes(h), h);
  }
});

test("declared shape: 149 terms over three databases, ids unique", () => {
  assert.equal(data.ET_TERMS.length, 149);
  assert.equal(new Set(data.ET_TERMS.map((t) => t.id)).size, data.ET_TERMS.length);
  assert.deepEqual([...new Set(data.ET_TERMS.map((t) => t.database))].sort(), ["exercisedb-v1", "free-exercise-db", "wger"]);
  assert.equal(data.ET_EXERCISE_COUNT, 876);
});
