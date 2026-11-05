// Tests for src/lib/vendorCoverage.mjs — the sourcing of every cell on
// /tools/api-coverage-matrix and the filters and URL state it runs on.
// Run: npm run test:coverage
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  COVERAGE_METRICS,
  COVERAGE_VENDORS,
  cellState,
  pushes,
  filterVendors,
  visibleMetrics,
  parseCoverageState,
  coverageStateToSearch,
} from "../src/lib/vendorCoverage.mjs";
import { checkAll } from "./lib/evidence-check.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ids = COVERAGE_VENDORS.map((v) => v.id);
const metricIds = COVERAGE_METRICS.map((m) => m.id);

test("every cell, delivery, history and resolution quote is in its evidence file under the same URL", () => {
  assert.deepEqual(checkAll(ROOT, COVERAGE_VENDORS), []);
});

test("cells use known metrics, and no metric is both documented and denied", () => {
  for (const v of COVERAGE_VENDORS) {
    for (const k of [...Object.keys(v.cells), ...Object.keys(v.no)]) assert.ok(metricIds.includes(k), `${v.id}: unknown metric ${k}`);
    for (const k of Object.keys(v.no)) assert.ok(!v.cells[k], `${v.id}: ${k} is in both cells and no`);
    assert.ok(v.delivery.length > 0, `${v.id}: no delivery fact`);
  }
});

test("every vendor links a released integration guide", () => {
  const released = fs.readFileSync(path.join(ROOT, "src/data/integrate.ts"), "utf8");
  for (const v of COVERAGE_VENDORS) assert.ok(released.includes(`"${v.guide.replace(/^\/integrate\//, "")}"`), v.guide);
});

test("matrix row ids exist in the HealthKit/Health Connect reference", () => {
  const matrix = fs.readFileSync(path.join(ROOT, "src/data/matrix.ts"), "utf8");
  for (const m of COVERAGE_METRICS) if (m.matrix) assert.ok(matrix.includes(`id: "${m.matrix}"`), m.matrix);
});

test("cellState reports yes, no and unknown", () => {
  const suunto = COVERAGE_VENDORS.find((v) => v.id === "suunto");
  assert.equal(cellState(suunto, "workouts").state, "yes");
  assert.equal(cellState(suunto, "sleep").state, "no");
  assert.equal(cellState(suunto, "glucose").state, "unknown");
  assert.equal(cellState(suunto, "glucose").cell, null);
});

test("filters: metrics are ANDed, push keeps vendors with a webhook or push", () => {
  const both = filterVendors(COVERAGE_VENDORS, { metrics: ["sleep", "spo2"] }).map((v) => v.id);
  for (const id of both) {
    const v = COVERAGE_VENDORS.find((x) => x.id === id);
    assert.equal(cellState(v, "sleep").state, "yes");
    assert.equal(cellState(v, "spo2").state, "yes");
  }
  assert.ok(both.includes("oura"));
  assert.ok(!both.includes("whoop"));
  const pushed = filterVendors(COVERAGE_VENDORS, { push: true });
  assert.ok(pushed.every(pushes));
  assert.ok(!pushed.some((v) => v.id === "dexcom"));
  assert.deepEqual(filterVendors(COVERAGE_VENDORS, { vendors: ["oura", "whoop"] }).map((v) => v.id), ["oura", "whoop"]);
});

test("search matches vendor names and documented cells only", () => {
  assert.deepEqual(filterVendors(COVERAGE_VENDORS, { q: "dexcom" }).map((v) => v.id), ["dexcom"]);
  const glucose = filterVendors(COVERAGE_VENDORS, { q: "glucose" }).map((v) => v.id);
  for (const id of glucose) assert.equal(cellState(COVERAGE_VENDORS.find((v) => v.id === id), "glucose").state, "yes");
  assert.equal(filterVendors(COVERAGE_VENDORS, { q: "zzzz-nothing" }).length, 0);
});

test("visibleMetrics shows the picked rows, else all", () => {
  assert.equal(visibleMetrics({}).length, COVERAGE_METRICS.length);
  assert.deepEqual(visibleMetrics({ metrics: ["sleep", "hrv"] }).map((m) => m.id), ["hrv", "sleep"]);
});

test("URL state round-trips and drops unknown ids", () => {
  const state = { q: "sleep", metrics: ["sleep", "hrv"], vendors: ["oura", "polar"], push: true };
  const search = coverageStateToSearch(state);
  assert.equal(search, "?q=sleep&m=sleep,hrv&v=oura,polar&push=1");
  assert.deepEqual(parseCoverageState(search, ids), state);
  assert.equal(coverageStateToSearch({ q: "", metrics: [], vendors: [], push: false }), "");
  assert.deepEqual(parseCoverageState("?m=sleep,made-up,sleep&v=nobody", ids), { q: "", metrics: ["sleep"], vendors: [], push: false });
});
