/**
 * The /tools/apple-health-explorer reader, tested through the same modules
 * the page's worker imports (src/lib/appleHealthExport.mjs and
 * src/lib/appleHealthRead.mjs), against the SYNTHETIC sample the page ships
 * (public/samples/apple-health-export-synthetic.zip, written by
 * scripts/build-own-data-samples.mjs) and small hand-made XML strings.
 *
 *   node --test scripts/apple-health-export.test.mjs   (npm run test:health-export)
 *
 * What is pinned: a tag split across any chunk boundary parses the same as
 * one whole string; entities decode; comments, the DOCTYPE subset, Me and
 * child elements are skipped; the ZIP path finds export.xml and inflates it;
 * the per-type summary and the CSV second pass agree on row counts.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import zlib from "node:zlib";
import {
  createAggregator,
  createCsvCollector,
  createScanner,
  csvField,
  dayOf,
  decodeXml,
  parseDevice,
  parseExportDate,
} from "../src/lib/appleHealthExport.mjs";
import { scanExport } from "../src/lib/appleHealthRead.mjs";

const SAMPLE = new URL("../public/samples/apple-health-export-synthetic.zip", import.meta.url);

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE HealthData [
<!ELEMENT HealthData (ExportDate,Me,(Record|Workout)*)>
<!ATTLIST Record type CDATA #REQUIRED>
]>
<HealthData locale="en_US">
 <!-- a comment with <Record type="Fake"/> inside -->
 <ExportDate value="2026-01-05 09:00:00 -0800"/>
 <Me HKCharacteristicTypeIdentifierDateOfBirth="1990-01-01"/>
 <Record type="HKQuantityTypeIdentifierStepCount" sourceName="Phone &amp; Co" unit="count" startDate="2026-01-01 23:50:00 -0800" endDate="2026-01-01 23:59:00 -0800" value="100" device="&lt;&lt;HKDevice: 0x1&gt;, name:iPhone, manufacturer:Apple Inc., model:iPhone, hardware:iPhone14,2, software:17.0&gt;"/>
 <Record type="HKQuantityTypeIdentifierStepCount" sourceName="Watch" unit="count" startDate="2026-01-02 08:00:00 -0800" endDate="2026-01-02 08:10:00 -0800" value="250"/>
 <Record type="HKQuantityTypeIdentifierHeartRate" sourceName="Watch" unit="count/min" startDate="2026-01-02 08:00:00 -0800" endDate="2026-01-02 08:00:00 -0800" value="61">
  <MetadataEntry key="HKMetadataKeyHeartRateMotionContext" value="1"/>
 </Record>
 <Record type="HKCategoryTypeIdentifierSleepAnalysis" sourceName="Watch" startDate="2026-01-02 00:00:00 -0800" endDate="2026-01-02 01:30:00 -0800" value="HKCategoryValueSleepAnalysisAsleepCore"/>
 <Workout workoutActivityType="HKWorkoutActivityTypeRunning" duration="30" durationUnit="min" sourceName="Watch" startDate="2026-01-03 07:00:00 -0800" endDate="2026-01-03 07:30:00 -0800">
  <WorkoutStatistics type="HKQuantityTypeIdentifierHeartRate" average="140"/>
 </Workout>
</HealthData>
`;

function scanString(xml, chunk) {
  const agg = createAggregator();
  const names = [];
  const s = createScanner((n, a) => {
    names.push(n);
    agg.add(n, a);
  });
  for (let i = 0; i < xml.length; i += chunk) s.push(xml.slice(i, i + chunk));
  const end = s.end();
  return { names, summary: agg.result(), end };
}

test("entities and dates", () => {
  assert.equal(decodeXml("a &amp; b &lt;&gt; &#65;&#x42;"), "a & b <> AB");
  assert.equal(parseExportDate("2026-01-01 23:50:00 -0800"), Date.parse("2026-01-02T07:50:00Z"));
  assert.equal(dayOf("2026-01-01 23:50:00 -0800"), "2026-01-01");
  assert.deepEqual(parseDevice("<<HKDevice: 0x1>, name:Apple Watch, manufacturer:Apple Inc., model:Watch, hardware:Watch6,1, software:9.0>"), {
    name: "Apple Watch",
    manufacturer: "Apple Inc.",
    model: "Watch",
    hardware: "Watch6,1",
    software: "9.0",
  });
  assert.equal(csvField('a,"b"'), '"a,""b"""');
});

test("every chunk size yields the same elements and summary", () => {
  const whole = scanString(XML, XML.length);
  assert.deepEqual(whole.names, ["ExportDate", "Record", "Record", "Record", "Record", "Workout"]);
  assert.equal(whole.end.leftover, 0);
  for (const chunk of [1, 2, 3, 7, 13, 64, 257]) {
    const r = scanString(XML, chunk);
    assert.deepEqual(r.names, whole.names, `chunk ${chunk}`);
    assert.deepEqual(r.summary, whole.summary, `chunk ${chunk}`);
  }
});

test("summary: counts, ranges, sources, devices, daily rows", () => {
  const { summary } = scanString(XML, 50);
  assert.equal(summary.exportDate, "2026-01-05 09:00:00 -0800");
  assert.equal(summary.records, 4);
  assert.equal(summary.workouts, 1);
  const steps = summary.types.find((t) => t.type === "HKQuantityTypeIdentifierStepCount");
  assert.equal(steps.count, 2);
  assert.equal(steps.first, "2026-01-01 23:50:00 -0800");
  assert.equal(steps.last, "2026-01-02 08:10:00 -0800");
  assert.deepEqual(steps.sources.map((s) => s.name).sort(), ["Phone & Co", "Watch"]);
  // Days are the record's own calendar day, never shifted to UTC.
  assert.deepEqual(steps.days.count.map((d) => [d[0], d[1], d[2]]), [
    ["2026-01-01", 100, 1],
    ["2026-01-02", 250, 1],
  ]);
  const sleep = summary.types.find((t) => t.type === "HKCategoryTypeIdentifierSleepAnalysis");
  assert.equal(sleep.numeric, 0);
  assert.equal(sleep.days[""][0][5], 90);
  const run = summary.types.find((t) => t.type === "HKWorkoutActivityTypeRunning");
  assert.equal(run.kind, "workout");
  assert.equal(run.days.min[0][1], 30);
  assert.equal(summary.devices[0].hardware, "iPhone14,2");
  // The Me element is never reported.
  assert.ok(!JSON.stringify(summary).includes("1990-01-01"));
});

test("synthetic sample zip: located, inflated, summarized, and CSV agrees", async () => {
  const buf = fs.readFileSync(SAMPLE);
  const blob = new Blob([buf]);
  const agg = createAggregator();
  let last = 0;
  const stats = await scanExport(blob, [agg], (f) => (last = f));
  assert.equal(last, 1);
  assert.match(stats.entryName, /export\.xml$/);
  assert.equal(stats.leftover, 0);
  const summary = agg.result();
  assert.ok(summary.records > 10000, `records ${summary.records}`);
  const steps = summary.types.find((t) => t.type === "HKQuantityTypeIdentifierStepCount");
  assert.ok(steps && steps.count > 1000);
  // Synthetic sources only.
  assert.ok(summary.sources.every((s) => s.name.startsWith("Synthetic")));

  const col = createCsvCollector("HKQuantityTypeIdentifierStepCount");
  await scanExport(blob, [col]);
  const { rows, chunks } = col.result();
  assert.equal(rows, steps.count);
  const text = chunks.join("");
  assert.equal(text.trimEnd().split("\n").length, rows + 1);

  // The same XML read directly (not zipped) gives the same summary.
  const xml = zlib.inflateRawSync(buf.subarray(30 + buf.readUInt16LE(26), 30 + buf.readUInt16LE(26) + buf.readUInt32LE(18)));
  const agg2 = createAggregator();
  await scanExport(new Blob([xml]), [agg2]);
  assert.deepEqual(agg2.result(), summary);
});
