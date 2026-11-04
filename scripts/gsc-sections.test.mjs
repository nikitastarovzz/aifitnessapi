// node --test scripts/gsc-sections.test.mjs
// Pins the weekly health checks in scripts/lib/gsc-sections.mjs.
import test from "node:test";
import assert from "node:assert/strict";
import {
  CTR_CURVE,
  expectedCtr,
  normalisePath,
  mergeByPath,
  ctrAnomalies,
  cannibalisation,
  decay,
  parseSitemap,
  parsePublished,
  indexLag,
  overlapDays,
} from "./lib/gsc-sections.mjs";

test("expectedCtr follows the curve on page one and flattens after", () => {
  assert.equal(expectedCtr(1), CTR_CURVE[0]);
  assert.equal(expectedCtr(1.4), CTR_CURVE[0]);
  assert.equal(expectedCtr(1.6), CTR_CURVE[1]);
  assert.equal(expectedCtr(10), CTR_CURVE[9]);
  assert.equal(expectedCtr(10.4), 0.012); // page one ends at 10.0, as it always has
  assert.equal(expectedCtr(15), 0.012);
  assert.equal(expectedCtr(25), 0.006);
  assert.equal(expectedCtr(80), 0.003);
  assert.equal(expectedCtr(0), CTR_CURVE[0]);
  assert.equal(expectedCtr(NaN), CTR_CURVE[0]);
});

test("normalisePath drops host and trailing slash", () => {
  assert.equal(normalisePath("https://www.aifitnessapi.com/integrate/oura-api/"), "/integrate/oura-api");
  assert.equal(normalisePath("https://aifitnessapi.com/"), "/");
  assert.equal(normalisePath("/fix"), "/fix");
  assert.equal(normalisePath("fix/"), "/fix");
});

test("mergeByPath joins www and apex with an impression-weighted position", () => {
  const [row] = mergeByPath([
    { keys: ["https://aifitnessapi.com/a"], clicks: 1, impressions: 90, position: 4 },
    { keys: ["https://www.aifitnessapi.com/a/"], clicks: 0, impressions: 10, position: 14 },
  ]);
  assert.equal(row.path, "/a");
  assert.equal(row.impressions, 100);
  assert.equal(row.clicks, 1);
  assert.equal(row.position, 5);
  assert.equal(row.ctr, 0.01);
});

test("ctrAnomalies flags page-one pages under half the curve, ranked by shortfall", () => {
  const rows = [
    { path: "/low", clicks: 0, impressions: 400, position: 5 }, // exp 6%, short 24
    { path: "/fine", clicks: 30, impressions: 400, position: 5 }, // 7.5% ≥ 3%
    { path: "/edge", clicks: 6, impressions: 200, position: 5 }, // 3% = half: not under
    { path: "/deep", clicks: 0, impressions: 900, position: 14 }, // past page one
    { path: "/thin", clicks: 0, impressions: 49, position: 3 }, // under the impression floor
    { path: "/mid", clicks: 1, impressions: 300, position: 9 }, // 0.33% vs 3%, short 8
  ];
  const out = ctrAnomalies(rows);
  assert.deepEqual(out.map((r) => r.path), ["/low", "/mid"]);
  assert.equal(out[0].expected, 0.06);
  assert.equal(Math.round(out[0].shortfall), 24);
  assert.equal(ctrAnomalies(rows, { minImpressions: 1 }).some((r) => r.path === "/thin"), true);
});

test("cannibalisation needs ≥10 impressions over 2+ distinct pages", () => {
  const qp = [
    { keys: ["fitness api", "https://aifitnessapi.com/"], clicks: 0, impressions: 8, position: 20 },
    { keys: ["fitness api", "https://aifitnessapi.com/learn"], clicks: 1, impressions: 4, position: 40 },
    // same page via www: must not count as a second page
    { keys: ["oura api", "https://aifitnessapi.com/integrate/oura-api"], clicks: 0, impressions: 9, position: 9 },
    { keys: ["oura api", "https://www.aifitnessapi.com/integrate/oura-api"], clicks: 0, impressions: 6, position: 9 },
    // two pages but too few impressions
    { keys: ["rare", "https://aifitnessapi.com/a"], clicks: 0, impressions: 5, position: 9 },
    { keys: ["rare", "https://aifitnessapi.com/b"], clicks: 0, impressions: 4, position: 9 },
  ];
  const out = cannibalisation(qp);
  assert.equal(out.length, 1);
  assert.equal(out[0].query, "fitness api");
  assert.equal(out[0].impressions, 12);
  assert.deepEqual(out[0].pages.map((p) => p.path), ["/", "/learn"]);
  assert.equal(out[0].topShare, 8 / 12);
});

test("decay: ≥30% fewer impressions at a position within ±1.5", () => {
  const before = [
    { path: "/decayed", clicks: 2, impressions: 100, position: 6 },
    { path: "/dropped-rank", clicks: 2, impressions: 100, position: 6 },
    { path: "/small-dip", clicks: 2, impressions: 100, position: 6 },
    { path: "/gone", clicks: 0, impressions: 50, position: 8 },
    { path: "/tiny", clicks: 0, impressions: 10, position: 8 },
  ];
  const after = [
    { path: "/decayed", clicks: 1, impressions: 70, position: 7.5 }, // -30%, Δpos 1.5 → in
    { path: "/dropped-rank", clicks: 0, impressions: 40, position: 12 }, // rank moved → out
    { path: "/small-dip", clicks: 2, impressions: 80, position: 6 }, // -20% → out
    { path: "/tiny", clicks: 0, impressions: 1, position: 8 }, // below floor → out
  ];
  const { decayed, vanished } = decay(after, before);
  assert.deepEqual(decayed.map((d) => d.path), ["/decayed"]);
  assert.equal(decayed[0].change, -0.3);
  assert.equal(decayed[0].lost, 30);
  assert.deepEqual(vanished.map((v) => v.path), ["/gone"]);
});

test("parseSitemap and parsePublished read paths in one shape", () => {
  const xml = `<urlset><url><loc>https://aifitnessapi.com/</loc></url><url><loc> https://aifitnessapi.com/fix/a </loc></url></urlset>`;
  assert.deepEqual(parseSitemap(xml), ["/", "/fix/a"]);
  const src = `export const PUBLISHED: Record<string, string> = {\n  "fix/a": "2026-08-01",\n  "blog/b": "2026-10-20",\n};\n`;
  const pub = parsePublished(src);
  assert.equal(pub.get("/fix/a"), "2026-08-01");
  assert.equal(pub.get("/blog/b"), "2026-10-20");
  assert.equal(pub.size, 2);
});

test("indexLag buckets unseen sitemap URLs by first-published date against the window", () => {
  const range = { start: "2026-10-04", end: "2026-10-31" };
  const published = new Map([
    ["/old", "2026-08-01"],
    ["/older", "2026-07-01"],
    ["/mid", "2026-10-15"],
    ["/new", "2026-11-02"],
    ["/seen", "2026-07-01"],
  ]);
  const out = indexLag(["/old", "/older", "/mid", "/new", "/seen", "/hub", "/old"], new Set(["/seen"]), published, range);
  assert.deepEqual(out.lagging.map((r) => r.path), ["/older", "/old"]);
  assert.equal(out.lagging[1].ageDays, 91);
  assert.deepEqual(out.partial.map((r) => r.path), ["/mid"]);
  assert.deepEqual(out.tooNew.map((r) => r.path), ["/new"]);
  assert.deepEqual(out.unknown.map((r) => r.path), ["/hub"]);
});

test("overlapDays counts shared calendar days", () => {
  assert.equal(overlapDays({ start: "2026-09-27", end: "2026-10-24" }, { start: "2026-10-04", end: "2026-10-31" }), 21);
  assert.equal(overlapDays({ start: "2026-09-01", end: "2026-09-28" }, { start: "2026-10-04", end: "2026-10-31" }), 0);
  assert.equal(overlapDays(null, { start: "2026-10-04", end: "2026-10-31" }), 0);
});
