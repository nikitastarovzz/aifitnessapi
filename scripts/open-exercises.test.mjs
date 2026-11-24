/**
 * Tests for the Open Exercises dataset and the two tools built on it:
 *   - scripts/fetch-open-exercises.mjs and the src/data/openExercises.ts it wrote,
 *   - the exercise-name normalizer (src/lib/exerciseNameMatch.mjs) on
 *     /tools/exercise-taxonomy-crosswalk#normalize,
 *   - the "Which ExerciseDB is this?" sniffer (src/lib/exerciseDbSniffer.mjs)
 *     on /pricing/exercise-database-api-pricing.
 *
 * Run: npm run test:open-exercises (also part of npm test).
 *
 * The data checks re-derive every crosswalk column from
 * src/data/exerciseTaxonomy.ts, so a hand edit of the generated module, or a
 * generator change that starts matching on its own, fails here.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const gen = await import(new URL("./fetch-open-exercises.mjs", import.meta.url).href);
const data = await import(new URL("../src/data/openExercises.ts", import.meta.url).href);
const match = await import(new URL("../src/lib/exerciseNameMatch.mjs", import.meta.url).href);
const sniffer = await import(new URL("../src/lib/exerciseDbSniffer.mjs", import.meta.url).href);
const { fold } = await import(new URL("../src/lib/contentLicencesCore.mjs", import.meta.url).href);
const licences = await import(new URL("../src/data/contentLicences.ts", import.meta.url).href);

const ET_SRC = fs.readFileSync(new URL("../src/data/exerciseTaxonomy.ts", import.meta.url), "utf8");
const cross = gen.crosswalkFrom(ET_SRC);
const ex = data.OE_EXERCISES;

/* ── dataset ─────────────────────────────────────────────────────────────── */

test("at least the declared floor of exercises, unique ids, pinned to one commit", () => {
  assert.ok(ex.length >= gen.EXPECTED_MIN, `${ex.length} < ${gen.EXPECTED_MIN}`);
  assert.equal(data.OE_COUNT, ex.length);
  assert.equal(new Set(ex.map((e) => e.id)).size, ex.length);
  assert.match(data.OE_COMMIT, /^[0-9a-f]{40}$/);
  for (const e of ex) {
    assert.equal(e.source, gen.sourceUrl(data.OE_COMMIT, e.id));
    for (const u of e.images) assert.ok(u.startsWith(`https://raw.githubusercontent.com/yuhonas/free-exercise-db/${data.OE_COMMIT}/exercises/`), u);
  }
});

test("the license ships whole and says public domain, any purpose", () => {
  assert.equal(data.OE_LICENSE_FIRST_LINE, "This is free and unencumbered software released into the public domain.");
  assert.ok(data.OE_LICENSE_TEXT.startsWith(data.OE_LICENSE_FIRST_LINE));
  assert.match(data.OE_LICENSE_TEXT.replace(/\s+/g, " "), /for any purpose, commercial or non-commercial/);
  assert.match(data.OE_PROVENANCE.upstreamLicenseFirstLine, /released into the public domain/);
});

test("crosswalk columns are copied from the taxonomy crosswalk, never matched here", () => {
  let byName = 0;
  let byCategory = 0;
  for (const e of ex) {
    const n = cross.exercise.get(e.id);
    const c = cross.category.get(e.category);
    const want = n ?? c ?? { healthkit: [], healthConnect: [], hcSegment: [] };
    assert.deepEqual([e.healthkit, e.healthConnect, e.hcSegment], [want.healthkit, want.healthConnect, want.hcSegment], e.id);
    assert.equal(e.crosswalkBasis, n ? "exercise-name" : c ? "category" : null, e.id);
    if (n) byName++;
    else if (c) byCategory++;
  }
  assert.equal(byName, cross.exercise.size, "every crosswalk exercise is in the dataset");
  assert.equal(data.OE_TYPED_COUNT, byName + byCategory);
});

test("normalize() copies fields and refuses a step containing the separator", () => {
  const rec = { id: "X", name: "X", category: "strength", level: "beginner", equipment: null, mechanic: null, force: null, primaryMuscles: ["abdominals"], secondaryMuscles: [], instructions: ["a"], images: ["X/0.jpg"] };
  const empty = { exercise: new Map(), category: new Map() };
  const n = gen.normalize(rec, "c".repeat(40), empty);
  assert.equal(n.equipment, null);
  assert.deepEqual(n.images, [`https://raw.githubusercontent.com/yuhonas/free-exercise-db/${"c".repeat(40)}/exercises/X/0.jpg`]);
  assert.equal(n.crosswalkBasis, null);
  for (const e of ex) for (const s of e.instructions) assert.ok(!s.includes("|"), e.id);
});

test("the published dataset matches the module row for row", () => {
  const file = new URL("../public/datasets/open-exercises-2026.json", import.meta.url);
  const doc = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.equal(doc.items.length, ex.length);
  assert.equal(doc.sourceTerms, data.OE_LICENSE_TEXT);
  const byId = new Map(ex.map((e) => [e.id, e]));
  for (const i of doc.items) {
    const e = byId.get(i.id);
    assert.ok(e, i.id);
    assert.equal(i.name, e.name);
    assert.equal(i.steps, e.instructions.length);
    assert.equal(i.healthConnectExerciseType, e.healthConnect.length ? e.healthConnect.join("; ") : null);
  }
});

/* ── normalizer ──────────────────────────────────────────────────────────── */

const pool = ex.map((e) => ({ ...e }));
const top = (q) => match.matchExercises(q, pool, { limit: 3 }).results.map((r) => r.exercise.name);

test("abbreviations expand, in queries and in names", () => {
  assert.deepEqual(match.expandQuery("DB incline press").map((t) => t.word), ["dumbbell", "incline", "press"]);
  assert.deepEqual(match.expandQuery("RDL").map((t) => [t.word, t.from]), [["romanian", "rdl"], ["deadlift", "rdl"]]);
  assert.equal(top("DB incline press")[0], "Incline Dumbbell Press");
  assert.ok(top("DB incline press").includes("Hammer Grip Incline DB Bench Press"));
  assert.equal(top("RDL")[0], "Romanian Deadlift");
  assert.equal(top("lat pulldown wide")[0], "Wide-Grip Lat Pulldown");
});

test("joined and split words match, plural s is dropped, stopwords are ignored", () => {
  assert.equal(match.stem("curls"), "curl");
  assert.equal(match.stem("press"), "press");
  assert.equal(match.stem("abs"), "abs");
  assert.ok(top("pullups").includes("Pullups"));
  const r = match.matchExercises("pull down", pool).results[0];
  assert.match(r.exercise.name, /Pulldown/);
  assert.equal(r.reasons[0].how, "joined");
  const s = match.matchExercises("pullup", [{ name: "Scapular Pull-Up" }]).results[0];
  assert.equal(s.reasons[0].how, "split");
  assert.deepEqual(match.expandQuery("the press with a bar").map((t) => t.word), ["press", "bar"]);
  assert.deepEqual(match.matchExercises("", pool).results, []);
});

test("equipment, category and muscles match at half weight, and say so", () => {
  const r = match.matchExercises("glute", [{ name: "Hip Thrust", primaryMuscles: ["glutes"] }]).results[0];
  assert.equal(r.score, 0.5);
  assert.equal(r.reasons[0].field, "muscles");
});

test("the rules printed on the page describe the code", () => {
  const rules = match.MATCH_RULES.join(" ");
  for (const w of match.STOPWORDS) assert.ok(new RegExp(`\\b${w}\\b`).test(rules.split("filler words")[1] ?? ""), w);
  const abbrs = match.ABBREVIATIONS.map((a) => a.abbr);
  assert.equal(new Set(abbrs).size, abbrs.length, "an abbreviation is listed twice");
  for (const a of match.ABBREVIATIONS) assert.ok(match.words(a.expansion).length > 0);
});

/* ── sniffer ─────────────────────────────────────────────────────────────── */

const EV = new URL("../ops/sources/evidence/", import.meta.url);
const evidence = (f) => JSON.parse(fs.readFileSync(new URL(`${f}.json`, EV), "utf8"));

test("every rule cites an evidence row whose quote has its wording", () => {
  for (const [file, i, key] of sniffer.citedRefs()) {
    const row = evidence(file)[i];
    assert.ok(row, `${file}[${i}] missing`);
    assert.ok(fold(row.quote).includes(fold(key)), `${file}[${i}] lacks "${key}"`);
  }
});

test("every variant shows a real row, notes that exist and site links", () => {
  const rows = new Set(licences.CONTENT_LICENCES.rows.map((r) => r.id));
  for (const [id, v] of Object.entries(sniffer.VARIANTS)) {
    if (v.row) assert.ok(rows.has(v.row), `${id}: no row ${v.row}`);
    for (const n of v.notes) assert.ok(licences.CONTENT_LICENCES.notes[n], `${id}: no note ${n}`);
    for (const m of sniffer.MIGRATION[id] ?? []) assert.ok(m.href.startsWith("/"), m.href);
  }
  assert.match(licences.CONTENT_LICENCES.notes[sniffer.UNVERIFIED_RAPIDAPI_NOTE].text, /RapidAPI/);
});

test("the integration guide's AscendAPI heading slugs to the anchor the links use", async () => {
  const { default: GithubSlugger } = await import("github-slugger");
  const anchor = new GithubSlugger().slug("AscendAPI's ExerciseDB V1 and V2 (formerly exercisedb.dev)");
  const src = fs.readFileSync(new URL("../src/data/integrate.entries.ts", import.meta.url), "utf8");
  assert.ok(src.includes("## AscendAPI's ExerciseDB V1 and V2 (formerly exercisedb.dev)"));
  for (const list of Object.values(sniffer.MIGRATION)) for (const m of list) if (m.href.startsWith("/integrate/exercisedb-api#")) assert.equal(m.href.split("#")[1], anchor);
});

const v = (input) => sniffer.sniff(input)?.variant ?? null;

test("hosts: each documented host names its variant", () => {
  assert.equal(v("https://oss.exercisedb.dev/api/v1/exercises?limit=10"), "exercisedb-v1-free");
  assert.equal(v("oss.exercisedb.dev/api/v1/exercises"), "exercisedb-v1-free");
  assert.equal(v("curl -H 'X-RapidAPI-Host: edb-with-gifs-and-images-by-ascendapi.p.rapidapi.com' https://edb-with-gifs-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises"), "exercisedb-v1-paid");
  assert.equal(v("X-RapidAPI-Host: edb-with-videos-and-images-by-ascendapi.p.rapidapi.com"), "exercisedb-v2");
  assert.equal(v("https://static.exercisedb.dev/media/01qpYSe.gif"), "exercisedb-v1-free");
  assert.equal(sniffer.sniff("https://static.exercisedb.dev/media/01qpYSe.gif").media, true);
  assert.equal(v("https://assets.exercisedb.dev/media/uc9UW4p.png"), "exercisedb-v1-paid");
  assert.equal(v("https://exercisedb.dev/"), "ascendapi-site");
  assert.equal(v("https://docs.ascendapi.com/products/edb-v1/overview"), "ascendapi-site");
  assert.equal(v("https://github.com/ExerciseDB/exercisedb-api"), "exercisedb-repo");
  assert.equal(v("https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"), "free-exercise-db");
  assert.equal(v("https://wger.de/api/v2/exerciseinfo/12/"), "wger");
});

test("hosts: an undocumented RapidAPI host or any other host is not recognized", () => {
  const r = sniffer.sniff("https://exercisedb.p.rapidapi.com/exercises/bodyPart/back");
  assert.equal(r.status, "not-recognized");
  assert.equal(r.rapidapiNote, sniffer.UNVERIFIED_RAPIDAPI_NOTE);
  assert.equal(sniffer.sniff("https://example.com/exercises").status, "not-recognized");
  assert.equal(sniffer.sniff("hello").status, "not-recognized");
  assert.equal(sniffer.sniff("  "), null);
  assert.equal(v("https://github.com/someone/else"), null);
});

test("shapes: real free V1 responses, the paid and V2 documented fields, the two open sources", () => {
  const read = (f) => fs.readFileSync(new URL(`../packages/exercise-adapter/test/fixtures/${f}`, import.meta.url), "utf8");
  assert.equal(v(read("exercisedb-v1-list.json")), "exercisedb-v1-free");
  assert.equal(v(read("exercisedb-v1-get.json")), "exercisedb-v1-free");
  assert.equal(v('{"success":true,"data":[{"exerciseId":"mnzcrIB","name":"dumbbell bench squat","gifUrl":"https://static.exercisedb.dev/media/mnzcrIB.gif"}]}'), "exercisedb-v1-free");
  assert.equal(v('{"success":true,"meta":{"total":1500,"hasNextPage":true,"nextCursor":"x"},"data":[]}'), "exercisedb-v1-free");
  assert.equal(v('{"exerciseId":"edb_T5uXtLj","name":"barbell bench press","difficulty":"intermediate","imageUrls":{"360p":"x"}}'), "exercisedb-v1-paid");
  assert.equal(v('{"exerciseId":"x","name":"y","videoUrl":"https://example.com/a.mp4"}'), "exercisedb-v2");
  assert.equal(v(read("free-exercise-db-sample.json")), "free-exercise-db");
  assert.equal(v(read("wger-exerciseinfo-12.json")), "wger");
  assert.equal(v(read("wger-exerciseinfo-list.json")), "wger");
});

test("shapes: the RapidAPI listing's singular fields are not recognized (no response or doc quoted)", () => {
  const r = sniffer.sniff('[{"id":"0001","name":"3/4 sit-up","bodyPart":"waist","target":"abs","equipment":"body weight"}]');
  assert.equal(r.status, "not-recognized");
  assert.deepEqual(r.fields, ["id", "name", "bodyPart", "target", "equipment"]);
});
