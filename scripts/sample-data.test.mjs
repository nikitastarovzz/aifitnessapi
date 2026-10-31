/**
 * Tests for src/lib/sampleData.mjs, the generator behind /tools/sample-data.
 *
 * Run: npm run test:sample-data   (node --test; Node strips the data modules' types)
 *
 * It builds the specs from the real generated datasets, so a regeneration
 * that renames a field this tool writes fails here as well as in the build.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const src = new URL("../src/", import.meta.url);
const load = (p) => import(new URL(p, src).href);

const [hk, hkMeta, hc, gh, wt, lib] = await Promise.all([
  load("data/healthkitIdentifiers.ts"),
  load("data/healthkitMetadataKeys.ts"),
  load("data/healthConnectRecords.ts"),
  load("data/googleHealthApi.ts"),
  load("data/workoutTypes.ts"),
  load("lib/sampleData.mjs"),
]);
const { specs } = lib.buildSampleSpecs({ ...hk, ...hkMeta, ...hc, ...gh, ...wt });
const ALL = lib.METRICS.map((m) => m.metric);
const opts = { specs, metrics: ALL, start: "2026-10-31", end: "2026-11-02", timeZone: "America/New_York", seed: "test" };

test("every offered type name exists in its generated module", () => {
  for (const s of specs) {
    if (s.platform === "healthkit") {
      const fam = s.metric === "workout" ? "workoutActivity" : "quantity";
      if (fam === "quantity") assert.ok(hk.HK_IDENTIFIERS.some((r) => r.objc === s.typeName), s.typeName);
      else for (const w of s.workouts) assert.ok(hk.HK_IDENTIFIERS.some((r) => r.family === fam && r.objc === w.objc), w.objc);
    } else if (s.platform === "health-connect") {
      assert.ok(hc.HC_RECORDS.some((r) => r.className === s.typeName), s.typeName);
    } else {
      assert.ok(gh.GHAPI_DATA_TYPES.some((d) => d.dataType === s.typeName), s.typeName);
    }
  }
  assert.ok(specs.filter((s) => s.platform === "healthkit").length >= 6);
  assert.ok(specs.filter((s) => s.platform === "health-connect").length >= 8);
  assert.ok(specs.filter((s) => s.platform === "google-health-api").length >= 8);
});

test("Health Connect records carry only properties the record class declares", () => {
  const out = lib.generateSampleData({ ...opts, platform: "health-connect" });
  for (const [cls, recs] of Object.entries(out.records)) {
    const props = new Set(hc.HC_RECORDS.find((r) => r.className === cls).properties.map((p) => p.name));
    for (const r of recs) for (const k of Object.keys(r)) if (k !== "exerciseTypeName") assert.ok(props.has(k), `${cls}.${k}`);
  }
});

test("Google data points carry only fields the discovery schema declares", () => {
  const out = lib.generateSampleData({ ...opts, platform: "google-health-api" });
  const S = gh.GHAPI_SCHEMAS;
  for (const s of specs.filter((x) => x.platform === "google-health-api")) {
    for (const p of out.records[s.typeName].dataPoints) {
      assert.deepEqual(Object.keys(p), [s.dataPointProperty]);
      const body = p[s.dataPointProperty];
      const names = new Set(S[s.schemaId].fields.map((f) => f.name));
      for (const k of Object.keys(body)) assert.ok(names.has(k), `${s.schemaId}.${k}`);
      const t = body[s.timeField];
      const tnames = new Set(S[s.timeSchema].fields.map((f) => f.name));
      for (const k of Object.keys(t)) assert.ok(tnames.has(k), `${s.timeSchema}.${k}`);
    }
  }
});

test("same seed gives the same file; another seed does not", () => {
  for (const platform of ["healthkit", "health-connect", "google-health-api"]) {
    const a = JSON.stringify(lib.generateSampleData({ ...opts, platform }));
    const b = JSON.stringify(lib.generateSampleData({ ...opts, platform }));
    const c = JSON.stringify(lib.generateSampleData({ ...opts, platform, seed: "other" }));
    assert.equal(a, b);
    assert.notEqual(a, c);
  }
});

test("adding a type does not change another type's values", () => {
  const one = lib.generateSampleData({ ...opts, platform: "health-connect", metrics: ["steps"] });
  const many = lib.generateSampleData({ ...opts, platform: "health-connect" });
  assert.deepEqual(one.records.StepsRecord, many.records.StepsRecord);
});

test("a night across the end of DST starts and ends on different offsets", () => {
  const out = lib.generateSampleData({ ...opts, platform: "health-connect", metrics: ["sleep"], end: "2026-10-31" });
  const [night] = out.records.SleepSessionRecord;
  assert.equal(night.startZoneOffset, "-04:00");
  assert.equal(night.endZoneOffset, "-05:00");
  assert.deepEqual(night.stages, []);
  assert.deepEqual(out._synthetic.offsetTransitions, [{ at: "2026-11-01T06:00:00Z", from: "-04:00", to: "-05:00" }]);

  const g = lib.generateSampleData({ ...opts, platform: "google-health-api", metrics: ["sleep"], end: "2026-10-31" });
  const sleep = g.records.sleep.dataPoints[0].sleep;
  assert.equal(sleep.interval.startUtcOffset, "-14400s");
  assert.equal(sleep.interval.endUtcOffset, "-18000s");
  // Stages are contiguous and cover the session.
  assert.equal(sleep.stages[0].startTime, sleep.interval.startTime);
  assert.equal(sleep.stages.at(-1).endTime, sleep.interval.endTime);
  for (let i = 1; i < sleep.stages.length; i++) assert.equal(sleep.stages[i].startTime, sleep.stages[i - 1].endTime);
});

test("unticking offsets writes null ZoneOffsets and no HealthKit zone metadata", () => {
  const h = lib.generateSampleData({ ...opts, platform: "health-connect", metrics: ["steps"], offsets: false });
  assert.ok(h.records.StepsRecord.every((r) => r.startZoneOffset === null && r.endZoneOffset === null));
  const k = lib.generateSampleData({ ...opts, platform: "healthkit", metrics: ["steps"], offsets: false });
  assert.ok(k.records.HKQuantityTypeIdentifierStepCount.every((r) => !("metadata" in r)));
});

test("values stay inside the documented validation ranges", () => {
  const h = lib.generateSampleData({ ...opts, platform: "health-connect" });
  assert.ok(h.records.StepsRecord.every((r) => r.count >= 1 && r.count <= 1000000));
  const g = lib.generateSampleData({ ...opts, platform: "google-health-api" });
  assert.ok(g.records["heart-rate"].dataPoints.every((p) => +p.heartRate.beatsPerMinute >= 1 && +p.heartRate.beatsPerMinute <= 300));
  // int64 fields are strings, as Google's own example prints them.
  assert.equal(typeof g.records.steps.dataPoints[0].steps.count, "string");
});

test("every file and CSV row is labelled synthetic", () => {
  const out = lib.generateSampleData({ ...opts, platform: "health-connect" });
  assert.match(out._synthetic.notice, /^SYNTHETIC TEST DATA/);
  const csv = lib.toCsv(out.records.StepsRecord).trim().split("\n");
  assert.equal(csv[0].split(",")[0], "_synthetic");
  assert.ok(csv.slice(1).every((l) => l.startsWith("SYNTHETIC TEST DATA,")));
});

test("rejects reversed and over-long ranges", () => {
  assert.throws(() => lib.generateSampleData({ ...opts, platform: "healthkit", start: "2026-11-02", end: "2026-10-31" }));
  assert.throws(() => lib.generateSampleData({ ...opts, platform: "healthkit", start: "2026-01-01", end: "2026-03-01" }));
});
