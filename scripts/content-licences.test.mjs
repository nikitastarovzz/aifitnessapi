/**
 * "Can I ship it?" (src/data/contentLicences.ts): every cited evidence row
 * exists, its verbatim quote contains the cell's key wording, it comes from
 * the row's own vendor, and "not stated" never carries an unsourced note.
 *
 *   npm run test:content-licences   (also part of npm test)
 *
 * Runs on the real data and the real evidence files (Node strips the data
 * module's types).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const src = new URL("../src/", import.meta.url);
const core = await import(new URL("lib/contentLicencesCore.mjs", src).href);
const { CONTENT_LICENCES } = await import(new URL("data/contentLicences.ts", src).href);
const evidence = (file) => JSON.parse(fs.readFileSync(new URL(`../ops/sources/evidence/${file}.json`, import.meta.url), "utf8"));
const files = Object.fromEntries(core.filesCited(CONTENT_LICENCES).map((f) => [f, evidence(f)]));

test("every cell is present, in its column's values, and cites quotes that contain its key wording", () => {
  assert.deepEqual(core.licenceProblems(CONTENT_LICENCES, files), []);
});

test("every cited row exists and its quote contains the key, case and quotes folded", () => {
  let refs = 0;
  for (const r of CONTENT_LICENCES.rows)
    for (const c of Object.values(r.cells))
      for (const [file, i, key] of c.ev) {
        refs++;
        const row = files[file]?.[i];
        assert.ok(row, `${r.id}: ${file}#${i} does not exist`);
        assert.ok(core.fold(row.quote).includes(core.fold(key)), `${r.id}: ${file}#${i} lacks ${JSON.stringify(key)}`);
      }
  assert.ok(refs >= 60, `only ${refs} citations`);
});

test("the rows the exercise and nutrition pages cover are all here", () => {
  const ids = new Set(CONTENT_LICENCES.rows.map((r) => r.id));
  for (const id of [
    "exercisedb-v1",
    "exercisedb-v2",
    "api-ninjas",
    "your-move-api",
    "wger",
    "free-exercise-db",
    "usda-fooddata-central",
    "open-food-facts",
    "nutritionix",
    "edamam",
    "spoonacular",
  ])
    assert.ok(ids.has(id), id);
  for (const k of core.KINDS) assert.ok(CONTENT_LICENCES.rows.some((r) => r.kind === k), k);
});

test("the checker catches a missing row, a quote without the key, a foreign host and an unsourced note", () => {
  const f = { e: [{ url: "https://a.test/x", quote: "Commercial use Yes" }] };
  const cells = (over) =>
    Object.fromEntries(core.COLUMNS.map((c) => [c.id, over[c.id] ?? core.unstated()]));
  const table = {
    rows: [
      { id: "ok", name: "ok", kind: "exercise", hosts: ["a.test"], cells: cells({ commercial: { value: "allowed", text: "t", ev: [["e", 0, "commercial use yes"]] } }) },
      { id: "nokey", name: "n", kind: "exercise", hosts: ["a.test"], cells: cells({ commercial: { value: "allowed", text: "t", ev: [["e", 0, "Commercial use No"]] } }) },
      { id: "gone", name: "g", kind: "exercise", hosts: ["a.test"], cells: cells({ free: { value: "yes", text: "t", ev: [["e", 3, "x"]] } }) },
      { id: "host", name: "h", kind: "nutrition", hosts: ["b.test"], cells: cells({ free: { value: "yes", text: "t", ev: [["e", 0, "Yes"]] } }) },
      { id: "note", name: "o", kind: "nutrition", hosts: ["a.test"], cells: cells({ paid: { value: core.NOT_STATED, text: "a guess", ev: [] } }) },
      { id: "bare", name: "b", kind: "nutrition", hosts: ["a.test"], cells: cells({ media: { value: "yes", ev: [] } }) },
    ],
  };
  const p = core.licenceProblems(table, f).join("\n");
  assert.doesNotMatch(p, /^ok\./m);
  assert.match(p, /nokey\.commercial: e#0: quote does not contain/);
  assert.match(p, /gone\.free: e#3: the file has no row 3/);
  assert.match(p, /host\.free: e#0: a quote from a\.test, not from b\.test/);
  assert.match(p, /note\.paid: a "not stated" cell carries text only/);
  assert.match(p, /bare\.media: says yes with no evidence/);
});

test("unstatedCounts adds up", () => {
  const n = core.unstatedCounts(CONTENT_LICENCES);
  assert.equal(n.cells, CONTENT_LICENCES.rows.length * core.COLUMNS.length);
  assert.equal(Object.values(n.by).reduce((a, b) => a + b, 0), n.total);
  console.log(`# ${CONTENT_LICENCES.rows.length} rows, ${n.total} of ${n.cells} cells not stated`, JSON.stringify(n.by));
});
