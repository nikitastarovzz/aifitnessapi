/**
 * Tests for @aifitnessapi/exercise-adapter, against real responses saved in
 * test/fixtures (URLs, dates and snapshot run ids in test/fixtures/sources.json),
 * never the network:
 *
 *   node --test packages/exercise-adapter/test/run.mjs   (npm run test:exercise-adapter;
 *   also run by `npm test` through scripts/exercise-adapter.test.mjs)
 *
 * 1. The package type-checks on its own with tsconfig.build.json.
 * 2. Each provider, given a fetch that serves the fixture for the exact URL it
 *    asks for, maps every field the fixture has, pages with the source's own
 *    cursor, and answers null for a 404.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FIX = path.join(PKG, "test/fixtures");
const ts = createRequire(import.meta.url)("typescript");
const fixture = (f) => JSON.parse(fs.readFileSync(path.join(FIX, f), "utf8"));
const SOURCES = fixture("sources.json").fixtures;

function compile() {
  const cfg = ts.readConfigFile(path.join(PKG, "tsconfig.build.json"), ts.sys.readFile).config;
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "exercise-adapter-"));
  const parsed = ts.parseJsonConfigFileContent(cfg, ts.sys, PKG);
  const program = ts.createProgram(parsed.fileNames, { ...parsed.options, outDir, declaration: false });
  const emit = program.emit();
  const diags = ts.getPreEmitDiagnostics(program).concat(emit.diagnostics);
  fs.writeFileSync(path.join(outDir, "package.json"), '{"type":"module"}');
  return { diags: diags.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"), index: pathToFileURL(path.join(outDir, "index.js")).href };
}

const compiled = compile();
const m = await import(compiled.index);

/** A fetch that serves fixtures by exact URL and records what was asked. */
function fakeFetch(routes) {
  const asked = [];
  const f = async (url) => {
    asked.push(url);
    const r = routes[url];
    if (!r) return { ok: false, status: 599, json: async () => ({}) };
    const status = r.status ?? 200;
    return { ok: status >= 200 && status < 300, status, json: async () => fixture(r.file) };
  };
  f.asked = asked;
  return f;
}

test("the package type-checks on its own", () => {
  assert.equal(compiled.diags, "");
});

test("every fixture names the URL it was read from", () => {
  for (const f of fs.readdirSync(FIX).filter((x) => x.endsWith(".json") && x !== "sources.json")) {
    assert.ok(SOURCES[f]?.url?.startsWith("https://"), `${f} has no source URL in sources.json`);
  }
});

test("free-exercise-db: fields, absolute image URLs at the ref, offset paging", async () => {
  const data = fixture("free-exercise-db-sample.json");
  const ref = "f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5";
  const p = m.freeExerciseDb({ data, ref });
  const page = await p.list({ limit: 2 });
  assert.equal(page.items.length, 2);
  assert.equal(page.next, "2");
  assert.equal(page.total, 3);
  const e = page.items[0];
  assert.equal(e.provider, "free-exercise-db");
  assert.equal(e.id, "3_4_Sit-Up");
  assert.equal(e.name, "3/4 Sit-Up");
  assert.equal(e.category, "strength");
  assert.deepEqual(e.equipment, ["body only"]);
  assert.deepEqual(e.primaryMuscles, ["abdominals"]);
  assert.deepEqual(e.secondaryMuscles, []);
  assert.equal(e.level, "beginner");
  assert.equal(e.instructions.length, 5);
  assert.deepEqual(e.media[0], { url: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/${ref}/exercises/3_4_Sit-Up/0.jpg`, kind: "image" });
  assert.equal(e.license.name, "Unlicense (public domain)");
  assert.equal(e.sourceUrl, `https://github.com/yuhonas/free-exercise-db/blob/${ref}/exercises/3_4_Sit-Up.json`);
  assert.equal(e.raw, data[0]);
  const last = await p.list({ limit: 2, cursor: page.next });
  assert.equal(last.items.length, 1);
  assert.equal(last.next, null);
  assert.equal((await p.get(data[2].id)).name, data[2].name);
  assert.equal(await p.get("nope"), null);
});

test("free-exercise-db: fetched once from raw.githubusercontent.com at the ref", async () => {
  const ref = "f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5";
  const f = fakeFetch({ [`https://raw.githubusercontent.com/yuhonas/free-exercise-db/${ref}/dist/exercises.json`]: { file: "free-exercise-db-sample.json" } });
  const p = m.freeExerciseDb({ ref, fetch: f });
  await p.list();
  await p.get("3_4_Sit-Up");
  assert.equal(f.asked.length, 1);
});

test("wger: English translation, muscles' English names, license, offset cursor", async () => {
  const f = fakeFetch({
    "https://wger.de/api/v2/exerciseinfo/?format=json&limit=2&offset=0": { file: "wger-exerciseinfo-list.json" },
    "https://wger.de/api/v2/exerciseinfo/12/?format=json": { file: "wger-exerciseinfo-12.json" },
    "https://wger.de/api/v2/exerciseinfo/99999999/?format=json": { file: "wger-not-found.json", status: 404 },
  });
  const p = m.wger({ fetch: f });
  const page = await p.list({ limit: 2 });
  assert.equal(page.next, "2");
  assert.equal(page.total, fixture("wger-exerciseinfo-list.json").count);
  assert.equal(page.items.length + page.skipped, 2);

  const e = await p.get("12");
  assert.equal(e.provider, "wger");
  assert.equal(e.id, "12");
  assert.equal(e.name, "Seated Hip Adduction");
  assert.equal(e.category, "Legs");
  assert.deepEqual(e.primaryMuscles, ["Glutes"]);
  assert.deepEqual(e.secondaryMuscles, []);
  assert.deepEqual(e.equipment, []);
  assert.ok(e.description.startsWith("<p>Starting Position:"));
  assert.deepEqual(e.instructions, []);
  assert.deepEqual(e.media, [{ url: "https://wger.de/media/exercise-images/12/4a42cc6f-648d-40cc-a72a-c49dd47e1667.webp", kind: "image" }]);
  assert.deepEqual(e.license, { name: "CC-BY-SA 3", url: "https://creativecommons.org/licenses/by-sa/3.0/deed.en", author: "flori" });
  assert.equal(e.sourceUrl, "https://wger.de/api/v2/exerciseinfo/12/");
  assert.equal(await p.get("99999999"), null);
  assert.equal(await p.get("../etc"), null);
});

test("wger: another language, and a record without it is skipped, not invented", async () => {
  const rec = fixture("wger-exerciseinfo-12.json");
  assert.equal(m.fromWger(rec, { language: 1 }).name, "Adduktoren-Maschine");
  assert.equal(m.fromWger(rec, { language: 99 }), null);
});

test("wger: equipment and the kettlebell record from the list", async () => {
  const list = fixture("wger-exerciseinfo-list.json");
  const e = m.fromWger(list.results.find((r) => r.id === 9));
  assert.equal(e.name, "2 Handed Kettlebell Swing");
  assert.deepEqual(e.equipment, ["Kettlebell"]);
  assert.deepEqual(e.primaryMuscles, ["Hamstrings", "Glutes"]);
  assert.deepEqual(e.secondaryMuscles, ["Quads", "Abs"]);
});

test("ExerciseDB V1: fields, gif media, after cursor, 404 is null", async () => {
  const f = fakeFetch({
    "https://oss.exercisedb.dev/api/v1/exercises?limit=2": { file: "exercisedb-v1-list.json" },
    "https://oss.exercisedb.dev/api/v1/exercises?limit=2&after=05Cf2v8": { file: "exercisedb-v1-list-after.json" },
    "https://oss.exercisedb.dev/api/v1/exercises/01qpYSe": { file: "exercisedb-v1-get.json" },
    "https://oss.exercisedb.dev/api/v1/exercises/zzzzzzz": { file: "exercisedb-v1-not-found.json", status: 404 },
  });
  const p = m.exerciseDbV1({ fetch: f });
  const page = await p.list({ limit: 2 });
  assert.equal(page.total, 1500);
  assert.equal(page.next, "05Cf2v8");
  const e = page.items[0];
  assert.equal(e.provider, "exercisedb-v1");
  assert.equal(e.id, "01qpYSe");
  assert.equal(e.name, "upward facing dog");
  assert.equal(e.category, null);
  assert.deepEqual(e.bodyParts, ["back"]);
  assert.deepEqual(e.equipment, ["bodyweight"]);
  assert.deepEqual(e.primaryMuscles, ["erector spinae"]);
  assert.deepEqual(e.secondaryMuscles, ["deltoids", "pectorals"]);
  assert.ok(e.instructions[0].startsWith("Step:1 "));
  assert.deepEqual(e.media, [{ url: "https://static.exercisedb.dev/media/01qpYSe.gif", kind: "gif" }]);
  assert.equal(e.license, null);
  const next = await p.list({ limit: 2, cursor: page.next });
  assert.equal(next.items[0].id, "0br45wL");
  assert.equal(next.next, "0CXGHya");
  assert.equal((await p.get("01qpYSe")).name, "upward facing dog");
  assert.equal(await p.get("zzzzzzz"), null);
});

test("a non-404 error is a ProviderError, not an empty result", async () => {
  const p = m.exerciseDbV1({ fetch: fakeFetch({}) });
  await assert.rejects(p.list(), (e) => e instanceof m.ProviderError && e.status === 599);
});

test("all() walks every page", async () => {
  const p = m.freeExerciseDb({ data: fixture("free-exercise-db-sample.json") });
  const ids = [];
  for await (const e of m.all(p, { limit: 1 })) ids.push(e.id);
  assert.equal(ids.length, 3);
});
