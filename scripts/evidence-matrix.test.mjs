/**
 * Tests for src/lib/evidenceMatrixCore.mjs and the three matrices built on it:
 * /tools/gym-software-api-matrix (src/data/gymApiMatrix.ts),
 * /tools/research-platform-chooser (src/data/researchPlatformMatrix.ts) and
 * /tools/aggregator-chooser (src/data/aggregatorChooser.ts).
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
const { AGGREGATOR_MATRIX } = await import(new URL("data/aggregatorChooser.ts", src).href);
const evidence = (file) => JSON.parse(fs.readFileSync(new URL(`../ops/sources/evidence/${file}.json`, import.meta.url), "utf8"));
/** Every evidence file a matrix cites, by name. */
const filesOf = (m) => Object.fromEntries(core.filesCited(m).map((f) => [f, evidence(f)]));

for (const m of [GYM_API_MATRIX, RESEARCH_PLATFORM_MATRIX, AGGREGATOR_MATRIX]) {
  test(`${m.id}: every cell is present and cites existing evidence`, () => {
    assert.deepEqual(core.matrixProblems(m, evidence(m.evidenceFile), filesOf(m)), []);
  });

  test(`${m.id}: resolve attaches each cited quote`, () => {
    const ev = evidence(m.evidenceFile);
    const r = core.resolveWith(m, ev, filesOf(m));
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

test("cross-file references resolve, and a dangling file or index is caught", () => {
  const files = { "other-file": [{ url: "https://vendor.test/a", quote: "a quote from another file" }] };
  const own = [{ url: "https://vendor.test/b", quote: "a quote from the own file" }];
  const m = {
    id: "x",
    evidenceFile: "own-file",
    columns: [{ id: "a", kind: "feature" }],
    rows: [
      { id: "ok", cells: { a: core.yes("both", 0, core.at("other-file", 0)) } },
      { id: "bad", cells: { a: core.yes("dangling", core.at("other-file", 3), core.at("missing-file", 0), -1) } },
    ],
  };
  assert.equal(core.at("other-file", 0), "other-file#0");
  assert.deepEqual(core.filesCited(m), ["own-file", "other-file", "missing-file"]);
  const p = core.matrixProblems(m, own, files);
  assert.equal(p.length, 3);
  assert.ok(p.every((x) => x.startsWith("x: bad.a cites evidence row")));
  const r = core.resolveWith({ ...m, rows: [m.rows[0]] }, own, files);
  assert.deepEqual(r.rows[0].cells.a.sources.map((s) => s.quote), ["a quote from the own file", "a quote from another file"]);
});

test("a row's hosts reject a quote from another vendor's site, subdomains allowed", () => {
  const ev = [
    { url: "https://docs.vendor.test/x", quote: "a docs quote here" },
    { url: "https://rival.test/y", quote: "a rival's quote" },
  ];
  const m = { id: "h", columns: [{ id: "a", kind: "feature" }], rows: [{ id: "v", hosts: ["vendor.test"], cells: { a: core.yes("t", 0, 1) } }] };
  const p = core.matrixProblems(m, ev);
  assert.equal(p.length, 1);
  assert.match(p[0], /a quote from rival\.test, not from vendor\.test/);
});

test("the aggregator chooser: every vendor row is host-pinned, and no cell says no without a quote", () => {
  const ids = AGGREGATOR_MATRIX.rows.map((r) => r.id);
  assert.deepEqual(ids, ["terra", "rook", "junction", "spike", "thryve", "sahha", "open-wearables", "validic"]);
  for (const r of AGGREGATOR_MATRIX.rows) {
    assert.ok(r.hosts?.length, `${r.id} has no hosts`);
    for (const [k, c] of Object.entries(r.cells)) if (c.value === "no") assert.ok(c.ev.length, `${r.id}.${k}`);
  }
  // The chooser cites more than its roundup's file; every file it names exists.
  for (const f of core.filesCited(AGGREGATOR_MATRIX)) assert.ok(fs.existsSync(new URL(`../ops/sources/evidence/${f}.json`, import.meta.url)), f);
});
