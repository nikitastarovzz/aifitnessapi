/**
 * Tests for the unified health-data schema and its converter
 * (src/lib/unifiedConvert.mjs, behind /tools/schema-converter).
 *
 * Run: npm run test:schema-converter
 *
 * Every converted record is validated against the published JSON Schema
 * (public/schema/v1/unified-health-data.schema.json) with the same small
 * validator the page uses, and the converter is fed both its own synthetic
 * samples and real /tools/sample-data output built from the generated
 * datasets — so a regeneration that renames a field fails here.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = new URL("../src/", import.meta.url);
const load = (p) => import(new URL(p, src).href);
const spec = JSON.parse(readFileSync(new URL("../public/schema/v1/mappings.json", import.meta.url), "utf8"));
const schema = JSON.parse(readFileSync(new URL("../public/schema/v1/unified-health-data.schema.json", import.meta.url), "utf8"));

const [conv, samples, mini, gen, hk, hkMeta, hc, gh, wt, us] = await Promise.all([
  load("lib/unifiedConvert.mjs"),
  load("lib/converterSamples.mjs"),
  load("lib/miniJsonSchema.mjs"),
  load("lib/sampleData.mjs"),
  load("data/healthkitIdentifiers.ts"),
  load("data/healthkitMetadataKeys.ts"),
  load("data/healthConnectRecords.ts"),
  load("data/googleHealthApi.ts"),
  load("data/workoutTypes.ts"),
  load("data/unifiedSchema.ts"),
]);
const { convert, detectFormat, durationToOffset, parseDate, zoneOffset, zoneOffsetAt } = conv;

const valid = (r) => {
  const errs = mini.validate(schema, r);
  assert.deepEqual(errs, [], `${JSON.stringify(r)} → ${errs.join("; ")}`);
};
const only = (text) => {
  const out = convert(text, spec);
  assert.deepEqual(out.errors, []);
  assert.equal(out.results.length, 1);
  valid(out.results[0].record);
  return out.results[0];
};

test("the TS module and the published mappings are the same data", () => {
  assert.equal(us.UNIFIED_RECORDS.length, spec.records.length);
  assert.deepEqual(us.UNIFIED_CONVERTER, spec.converter);
  assert.equal(us.UNIFIED_SCHEMA_ID, schema.$id);
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
});

test("every record maps every platform, and each cell is mapped with evidence or not mapped with a reason", () => {
  assert.ok(spec.records.length >= 9);
  for (const id of ["heartRate", "steps", "sleepSession", "workout", "bodyMass", "heartRateVariability", "oxygenSaturation"]) assert.ok(spec.records.some((r) => r.id === id), id);
  for (const r of spec.records) {
    for (const p of spec.platforms) {
      const m = r.platforms[p];
      assert.ok(m, `${r.id} lacks ${p}`);
      for (const [f, c] of Object.entries(m.fields)) {
        if (c.status === "mapped") assert.ok(c.field, `${r.id}.${f} on ${p}: no platform field`);
        else assert.ok(c.reason && c.reason.length > 20, `${r.id}.${f} on ${p}: no reason`);
      }
    }
  }
});

test("time helpers", () => {
  assert.equal(durationToOffset("7200s"), "+02:00");
  assert.equal(durationToOffset("-18000s"), "-05:00");
  assert.equal(durationToOffset("19800s"), "+05:30");
  assert.equal(durationToOffset("0s"), "+00:00");
  assert.equal(durationToOffset("+02:00"), null);
  assert.deepEqual(parseDate("2026-03-01 07:12:00 -0800"), { ms: Date.parse("2026-03-01T15:12:00Z"), offset: "-08:00" });
  assert.equal(parseDate("2026-03-01T15:12:00Z").offset, null);
  assert.equal(parseDate("yesterday"), null);
  assert.equal(zoneOffset("Z"), "+00:00");
  assert.equal(zoneOffset(null), null);
  assert.equal(zoneOffset("+0530"), "+05:30");
  assert.equal(zoneOffset("bogus"), undefined);
  assert.equal(zoneOffsetAt("America/New_York", Date.parse("2026-07-01T12:00:00Z")), "-04:00");
  assert.equal(zoneOffsetAt("America/New_York", Date.parse("2026-12-01T12:00:00Z")), "-05:00");
  assert.equal(zoneOffsetAt("Not/AZone", 0), null);
});

test("format detection", () => {
  const [x, h, g] = samples.buildSamples(spec);
  assert.equal(detectFormat(x.text, spec), "healthkit-xml");
  assert.equal(detectFormat(h.text, spec), "health-connect");
  assert.equal(detectFormat(g.text, spec), "google-health-api");
  assert.equal(detectFormat('{"type":"HKQuantityTypeIdentifierStepCount"}', spec), "healthkit-json");
  assert.equal(detectFormat("not json", spec), null);
  assert.equal(detectFormat('{"hello":1}', spec), null);
});

test("HealthKit export rows: offsets from the dates, percent × 100, pounds by Google's factor, sleep grouped", () => {
  const [x] = samples.buildSamples(spec);
  const out = convert(x.text, spec);
  assert.deepEqual(out.errors, []);
  for (const r of out.results) valid(r.record);
  const by = (t) => out.results.find((r) => r.record.type === t).record;
  assert.deepEqual(by("heartRate"), {
    type: "heartRate",
    source: { platform: "healthkit", nativeType: "HKQuantityTypeIdentifierHeartRate", sourceName: "Synthetic Watch" },
    time: "2026-10-14T05:31:12Z",
    utcOffset: "+02:00",
    beatsPerMinute: 64,
  });
  assert.equal(by("oxygenSaturation").percent, 97);
  assert.equal(by("bodyMass").kilograms, Math.round(160.2 * 0.45359237 * 1e6) / 1e6);
  const sleep = by("sleepSession");
  assert.equal(sleep.startTime, "2026-10-13T21:40:00Z");
  assert.equal(sleep.endTime, "2026-10-13T23:35:00Z");
  assert.deepEqual(sleep.stages.map((s) => s.stage), ["light", "deep", "rem"]);
  const w = by("workout");
  assert.equal(w.activityType, "running");
  assert.equal(w.nativeActivityType, "HKWorkoutActivityTypeRunning");
  assert.equal(w.energyKcal, null);
});

test("HealthKit percent above 1.0 is refused, not silently scaled", () => {
  const row = `<Record type="HKQuantityTypeIdentifierOxygenSaturation" unit="%" startDate="2026-10-14 03:12:40 +0200" endDate="2026-10-14 03:12:40 +0200" value="97"/>`;
  const out = convert(row, spec);
  assert.equal(out.results.length, 0);
  assert.match(out.errors[0], /0\.0–1\.0/);
});

test("HealthKit units without a sourced factor are refused", () => {
  const row = `<Record type="HKQuantityTypeIdentifierHeight" unit="ft" startDate="2026-10-14 03:12:40 +0200" endDate="2026-10-14 03:12:40 +0200" value="5.9"/>`;
  const out = convert(row, spec);
  assert.equal(out.results.length, 0);
  assert.match(out.errors[0], /sourced factor/);
  assert.equal(only(row.replace('unit="ft"', 'unit="in"').replace("5.9", "70")).record.meters, 1.778);
});

test("Health Connect: a series becomes samples, stages map one-to-one, Mass converts", () => {
  const [, h] = samples.buildSamples(spec);
  const out = convert(h.text, spec);
  assert.deepEqual(out.errors, []);
  for (const r of out.results) valid(r.record);
  const hr = out.results.filter((r) => r.record.type === "heartRate");
  assert.equal(hr.length, 2);
  assert.deepEqual(hr.map((r) => r.record.beatsPerMinute), [62, 65]);
  assert.equal(hr[0].record.utcOffset, "+02:00");
  const sleep = out.results.find((r) => r.record.type === "sleepSession").record;
  assert.deepEqual(sleep.stages.map((s) => s.stage), ["light", "deep", "awakeInBed"]);
  assert.equal(out.results.find((r) => r.record.type === "bodyMass").record.kilograms, 72.4);
  const hrv = out.results.find((r) => r.record.type === "heartRateVariability").record;
  assert.equal(hrv.metric, "rmssd");
  assert.equal(hrv.utcOffset, null);
  const w = out.results.find((r) => r.record.type === "workout").record;
  assert.equal(w.activityType, "running");
  assert.equal(w.nativeActivityType, "EXERCISE_TYPE_RUNNING");
});

test("Google Health API: int64 strings, grams, millimeters, google-duration offsets", () => {
  const [, , g] = samples.buildSamples(spec);
  const out = convert(g.text, spec);
  assert.deepEqual(out.errors, []);
  for (const r of out.results) valid(r.record);
  const by = (t) => out.results.find((r) => r.record.type === t).record;
  assert.equal(by("heartRate").beatsPerMinute, 64);
  assert.equal(by("heartRate").utcOffset, "+02:00");
  assert.equal(by("steps").count, 812);
  assert.equal(by("bodyMass").kilograms, 72.4);
  assert.equal(by("oxygenSaturation").percent, 97);
  assert.deepEqual(by("sleepSession").stages.map((s) => s.stage), ["light", "deep", "restless"]);
  assert.equal(by("workout").distanceMeters, 6120);
  assert.equal(by("workout").energyKcal, 389);
});

test("HRV: Google's standard deviation is never relabelled SDNN", () => {
  const dp = { heartRateVariability: { sampleTime: { physicalTime: "2026-10-14T03:00:00Z", utcOffset: "0s" }, standardDeviationMilliseconds: 50 } };
  const out = convert(JSON.stringify(dp), spec);
  assert.equal(out.results.length, 0);
  assert.match(out.errors[0], /rootMeanSquareOfSuccessiveDifferencesMilliseconds/);
});

test("unmapped and malformed input says so", () => {
  const bad = convert(JSON.stringify({ dataPoints: [{ hydrationLog: {} }] }), spec);
  assert.equal(bad.results.length, 0);
  assert.match(bad.errors[0], /no data type the unified schema maps/);
  const hcBad = convert(JSON.stringify({ NutritionRecord: [{}] }), spec, { format: "health-connect" });
  assert.match(hcBad.errors[0], /not one of the/);
  const stage = convert(JSON.stringify({ SleepSessionRecord: [{ startTime: "2026-10-13T21:40:00Z", endTime: "2026-10-13T22:40:00Z", stages: [{ startTime: "2026-10-13T21:40:00Z", endTime: "2026-10-13T22:40:00Z", stage: 99 }] }] }), spec);
  assert.match(stage.errors[0], /STAGE_TYPE_/);
});

test("every explanation step names its source path and the unified field", () => {
  for (const s of samples.buildSamples(spec)) {
    for (const r of convert(s.text, spec).results) {
      const fields = new Set(r.steps.map((x) => x.field));
      for (const k of Object.keys(r.record)) if (k !== "type" && k !== "source") assert.ok(fields.has(k), `${r.recordId}.${k} has no explanation step`);
    }
  }
});

test("real /tools/sample-data output converts and validates, platform by platform", () => {
  const { specs } = gen.buildSampleSpecs({ ...hk, ...hkMeta, ...hc, ...gh, ...wt });
  const metrics = gen.METRICS.map((m) => m.metric);
  for (const platform of ["healthkit", "health-connect", "google-health-api"]) {
    const data = gen.generateSampleData({ specs, platform, metrics, start: "2026-10-31", end: "2026-11-02", timeZone: "America/New_York", seed: "unified" });
    const out = convert(JSON.stringify(data), spec);
    assert.equal(out.format, "sample-data");
    assert.ok(out.results.length > 10, `${platform}: ${out.results.length} records`);
    for (const r of out.results) valid(r.record);
    // Types the unified schema does not cover are reported, never dropped silently.
    for (const e of out.errors) assert.match(e, /not one of the|no data type the unified schema maps|no quantity rule|unit "/, `${platform}: ${e}`);
    if (platform === "healthkit") {
      // Sample-data's HealthKit zone is a metadata name: offsets come from the tz database across DST.
      const hr = out.results.filter((r) => r.record.type === "heartRate").map((r) => r.record.utcOffset);
      assert.ok(hr.includes("-04:00") && hr.includes("-05:00"), `offsets ${[...new Set(hr)]}`);
    }
  }
});
