/**
 * Tests for src/lib/evidenceMatrixCore.mjs and the two matrices built on it:
 * /tools/gym-software-api-matrix (src/data/gymApiMatrix.ts) and
 * /tools/research-platform-chooser (src/data/researchPlatformMatrix.ts).
 *
 * Run: npm run test:matrices   (node --test; Node strips the data modules' types)
 *
 * It runs on the real data and the real evidence files, so a cell citing an
 * evidence row that does not exist, a value with no evidence, or a text
 * column marked "no" fails here as well as in the build.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const src = new URL("../src/", import.meta.url);
const core = await import(new URL("lib/evidenceMatrixCore.mjs", src).href);
const { GYM_API_MATRIX } = await import(new URL("data/gymApiMatrix.ts", src).href);
const { RESEARCH_PLATFORM_MATRIX } = await import(new URL("data/researchPlatformMatrix.ts", src).href);
const evidence = (file) => JSON.parse(fs.readFileSync(new URL(`../ops/sources/evidence/${file}.json`, import.meta.url), "utf8"));

for (const m of [GYM_API_MATRIX, RESEARCH_PLATFORM_MATRIX]) {
  test(`${m.id}: every cell is present and cites existing evidence`, () => {
    assert.deepEqual(core.matrixProblems(m, evidence(m.evidenceFile)), []);
  });

  test(`${m.id}: resolve attaches each cited quote`, () => {
    const ev = evidence(m.evidenceFile);
    const r = core.resolveWith(m, ev);
    for (const row of r.rows)
      for (const [k, cell] of Object.entries(row.cells)) {
        assert.equal(cell.sources.length, m.rows.find((x) => x.id === row.id).cells[k].ev.length);
        for (const s of cell.sources) assert.ok(s.quote.length >= 3 && /^https:\/\//.test(s.url));
      }
  });

  test(`${m.id}: feature columns have a filter wording, text columns are never "no"`, () => {
    for (const c of m.columns) if (c.kind === "feature") assert.ok(c.need, c.id);
    for (const row of m.rows) for (const c of m.columns) if (c.kind === "text") assert.notEqual(row.cells[c.id].value, "no");
  });
}

test("matrixProblems catches a dangling index, an unsupported yes and a missing cell", () => {
  const m = {
    id: "t",
    columns: [
      { id: "a", kind: "feature" },
      { id: "b", kind: "text" },
    ],
    rows: [
      { id: "x", cells: { a: core.yes("ok", 0), b: core.yes("bad", 5) } },
      { id: "y", cells: { a: { value: "yes", text: "nothing", ev: [] } } },
      { id: "z", cells: { a: core.unknown(), b: { value: "unknown", text: "a claim with no quote", ev: [] } } },
    ],
  };
  const p = core.matrixProblems(m, [{ url: "https://e.test/", quote: "a quote here" }]);
  assert.equal(p.length, 4);
  assert.ok(p.some((x) => x.includes("cites evidence row 5")));
  assert.ok(p.some((x) => x.includes("says yes with no evidence")));
  assert.ok(p.some((x) => x.includes("has no b cell")));
  assert.ok(p.some((x) => x.includes("carries its own text")));
  assert.throws(() => core.resolveWith(m, []));
});

test("rankRows orders by documented features met, then name, and lists what is missing", () => {
  const rows = [
    { name: "B", cells: { w: { value: "yes" }, s: { value: "unknown" } } },
    { name: "A", cells: { w: { value: "unknown" }, s: { value: "no" } } },
    { name: "C", cells: { w: { value: "yes" }, s: { value: "yes" } } },
  ];
  const r = core.rankRows(rows, ["w", "s"]);
  assert.deepEqual(r.map((x) => [x.row.name, x.met]), [["C", 2], ["B", 1], ["A", 0]]);
  assert.deepEqual(r[1].missing, ["s"]);
  assert.deepEqual(core.rankRows(rows, []).map((x) => x.row.name), ["A", "B", "C"]);
});

test("the gym matrix covers the five vendors the site has integrate pages for", () => {
  const pages = GYM_API_MATRIX.rows.filter((r) => r.page).map((r) => r.page.href).sort();
  assert.deepEqual(pages, ["/integrate/glofox-api", "/integrate/mariana-tek-api", "/integrate/mindbody-api", "/integrate/teamup-api", "/integrate/wodify-api"]);
});
