#!/usr/bin/env node
/**
 * Writes the SYNTHETIC sample files the own-your-data tools and notebooks use:
 *
 *   public/samples/apple-health-export-synthetic.zip   (an export.zip-shaped archive holding one export.xml,
 *                                                       read by /tools/apple-health-explorer and the notebooks)
 *   public/notebooks/data/daily-summary-synthetic.csv  (a generic wearable daily-summary CSV)
 *   public/notebooks/data/activities-synthetic.csv     (a generic per-activity CSV)
 *
 *   node scripts/build-own-data-samples.mjs
 *
 * Nothing here is anyone's data. Every value comes from a seeded generator,
 * so a rerun writes byte-identical files. The XML imitates the element and
 * attribute names a Health export uses (Record, Workout, ActivitySummary,
 * ExportDate) so the explorer has something realistic to read; the two CSVs
 * are deliberately generic, with column names chosen here, because no
 * vendor's CSV layout was verified for this page and pretending otherwise
 * would teach a reader the wrong columns. Every file says SYNTHETIC in its
 * first line (or root comment).
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DAYS = 120;
const START = Date.UTC(2026, 5, 1); // 2026-06-01, a fixed, made-up window
const OFFSET = "-0700";
const OFFSET_MS = -7 * 3600 * 1000;

// Seeded PRNG (mulberry32), so every run is identical.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(20261105);
const between = (lo, hi) => lo + (hi - lo) * rand();
const int = (lo, hi) => Math.floor(between(lo, hi + 1));

/** Local wall-clock "YYYY-MM-DD HH:MM:SS -0700" for an instant. */
function stamp(ms) {
  const d = new Date(ms + OFFSET_MS);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} ${OFFSET}`;
}
const dayStr = (ms) => stamp(ms).slice(0, 10);
const localMidnight = (i) => START + i * 86400000 - OFFSET_MS; // instant of local 00:00

const WATCH = "&lt;&lt;HKDevice: 0x000000000&gt;, name:Synthetic Watch, manufacturer:Example Inc., model:Watch, hardware:Watch0,0, software:1.0, creation date:2026-06-01 00:00:00 +0000&gt;";
const PHONE = "&lt;&lt;HKDevice: 0x000000001&gt;, name:Synthetic Phone, manufacturer:Example Inc., model:Phone, hardware:Phone0,0, software:1.0, creation date:2026-06-01 00:00:00 +0000&gt;";
const SRC_WATCH = 'sourceName="Synthetic Watch" sourceVersion="1.0"';
const SRC_PHONE = 'sourceName="Synthetic Phone" sourceVersion="1.0"';
const SRC_SCALE = 'sourceName="Synthetic Scale App" sourceVersion="2.3"';

const lines = [];
const daily = [];
const activities = [];
const rec = (type, unit, value, startMs, endMs, src, device) =>
  lines.push(
    ` <Record type="${type}" ${src} ${unit ? `unit="${unit}" ` : ""}creationDate="${stamp(endMs + 60000)}" startDate="${stamp(startMs)}" endDate="${stamp(endMs)}" value="${value}"${device ? ` device="${device}"` : ""}/>`,
  );

let weight = 72.4;
for (let i = 0; i < DAYS; i++) {
  const mid = localMidnight(i);
  const weekday = new Date(mid + OFFSET_MS).getUTCDay();
  let steps = 0;
  let energy = 0;
  // Steps: hourly phone + watch chunks between 07:00 and 22:00.
  for (let h = 7; h < 22; h++) {
    const s = Math.max(0, Math.round(between(80, 900) * (weekday === 0 ? 0.6 : 1)));
    const t0 = mid + h * 3600000 + int(0, 20) * 60000;
    rec("HKQuantityTypeIdentifierStepCount", "count", s, t0, t0 + 10 * 60000, h % 3 ? SRC_WATCH : SRC_PHONE, h % 3 ? WATCH : PHONE);
    steps += s;
    const kcal = Math.round(between(8, 45) * 100) / 100;
    rec("HKQuantityTypeIdentifierActiveEnergyBurned", "kcal", kcal, t0, t0 + 60 * 60000, SRC_WATCH, WATCH);
    energy += kcal;
    const dist = Math.round(s * 0.00075 * 1000) / 1000;
    rec("HKQuantityTypeIdentifierDistanceWalkingRunning", "km", dist, t0, t0 + 10 * 60000, SRC_WATCH, WATCH);
  }
  // Heart rate: every 20 minutes through the day.
  let hrSum = 0;
  let hrN = 0;
  for (let m = 6 * 60; m < 23 * 60; m += 20) {
    const t = mid + m * 60000;
    const bpm = int(58, 96);
    rec("HKQuantityTypeIdentifierHeartRate", "count/min", bpm, t, t, SRC_WATCH, WATCH);
    hrSum += bpm;
    hrN++;
  }
  const resting = int(52, 62);
  rec("HKQuantityTypeIdentifierRestingHeartRate", "count/min", resting, mid + 6 * 3600000, mid + 23 * 3600000, SRC_WATCH, WATCH);
  const hrv = Math.round(between(28, 75) * 10) / 10;
  rec("HKQuantityTypeIdentifierHeartRateVariabilitySDNN", "ms", hrv, mid + 3 * 3600000, mid + 3 * 3600000 + 60000, SRC_WATCH, WATCH);
  // Sleep: the night ending this morning, in a few staged blocks.
  let t = mid - int(60, 110) * 60000; // bedtime the previous evening
  lines.push(` <Record type="HKCategoryTypeIdentifierSleepAnalysis" ${SRC_WATCH} creationDate="${stamp(t + 9 * 3600000)}" startDate="${stamp(t)}" endDate="${stamp(t + 15 * 60000)}" value="HKCategoryValueSleepAnalysisInBed" device="${WATCH}"/>`);
  t += 15 * 60000;
  let asleep = 0;
  for (const stage of ["Core", "Deep", "Core", "REM", "Core", "Awake", "Core", "REM"]) {
    const dur = (stage === "Awake" ? int(3, 12) : int(25, 70)) * 60000;
    lines.push(` <Record type="HKCategoryTypeIdentifierSleepAnalysis" ${SRC_WATCH} creationDate="${stamp(t + dur)}" startDate="${stamp(t)}" endDate="${stamp(t + dur)}" value="${stage === "Awake" ? "HKCategoryValueSleepAnalysisAwake" : `HKCategoryValueSleepAnalysisAsleep${stage}`}" device="${WATCH}"/>`);
    if (stage !== "Awake") asleep += dur;
    t += dur;
  }
  // Weight every third morning from a scale app.
  if (i % 3 === 0) {
    weight = Math.round((weight + between(-0.35, 0.3)) * 10) / 10;
    rec("HKQuantityTypeIdentifierBodyMass", "kg", weight, mid + 7 * 3600000, mid + 7 * 3600000, SRC_SCALE, null);
  }
  // A workout on four days a week.
  let workoutMin = 0;
  if ([1, 3, 5, 6].includes(weekday)) {
    const kind = weekday === 6 ? "HKWorkoutActivityTypeCycling" : weekday === 3 ? "HKWorkoutActivityTypeTraditionalStrengthTraining" : "HKWorkoutActivityTypeRunning";
    const start = mid + int(17, 19) * 3600000 + int(0, 50) * 60000;
    const dur = Math.round(between(25, 70) * 100) / 100;
    const end = start + dur * 60000;
    lines.push(` <Workout workoutActivityType="${kind}" duration="${dur}" durationUnit="min" ${SRC_WATCH} device="${WATCH}" creationDate="${stamp(end + 60000)}" startDate="${stamp(start)}" endDate="${stamp(end)}">`);
    lines.push(`  <MetadataEntry key="HKIndoorWorkout" value="${kind.endsWith("TraditionalStrengthTraining") ? 1 : 0}"/>`);
    lines.push(`  <WorkoutStatistics type="HKQuantityTypeIdentifierHeartRate" startDate="${stamp(start)}" endDate="${stamp(end)}" average="${int(120, 150)}" minimum="${int(90, 110)}" maximum="${int(160, 182)}" unit="count/min"/>`);
    lines.push(" </Workout>");
    workoutMin = dur;
    const label = kind.replace("HKWorkoutActivityType", "");
    activities.push([stamp(start), label, (dur).toFixed(1), label === "Running" ? (dur * between(0.15, 0.19)).toFixed(2) : label === "Cycling" ? (dur * between(0.4, 0.5)).toFixed(2) : "", int(120, 150), Math.round(dur * between(7, 11))]);
  }
  lines.push(` <ActivitySummary dateComponents="${dayStr(mid)}" activeEnergyBurned="${energy.toFixed(2)}" activeEnergyBurnedGoal="450" activeEnergyBurnedUnit="kcal" appleExerciseTime="${Math.round(workoutMin)}" appleExerciseTimeGoal="30" appleStandHours="${int(8, 14)}" appleStandHoursGoal="12"/>`);
  daily.push([dayStr(mid), steps, Math.round(steps * 0.00075 * 100) / 100, Math.round(energy), resting, Math.round(hrSum / hrN), (asleep / 3600000).toFixed(2), i % 3 === 0 ? weight : ""]);
}

const exportDate = stamp(START + DAYS * 86400000 + 9 * 3600000);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- SYNTHETIC SAMPLE: generated by scripts/build-own-data-samples.mjs for aifitnessapi.com. Not anyone's health data. -->
<!DOCTYPE HealthData [
<!ELEMENT HealthData (ExportDate,Me,(Record|Workout|ActivitySummary)*)>
<!ATTLIST HealthData locale CDATA #REQUIRED>
<!ELEMENT ExportDate EMPTY>
<!ATTLIST ExportDate value CDATA #REQUIRED>
]>
<HealthData locale="en_US">
 <ExportDate value="${exportDate}"/>
 <Me HKCharacteristicTypeIdentifierBiologicalSex="HKBiologicalSexNotSet" HKCharacteristicTypeIdentifierDateOfBirth=""/>
${lines.join("\n")}
</HealthData>
`;

const write = (rel, data) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
  console.log(`${rel}  ${fs.statSync(f).size} bytes`);
};

write("public/samples/apple-health-export-synthetic.zip", zipOne("apple_health_export_synthetic/export.xml", Buffer.from(xml)));

const csv = (header, rows, note) => `# SYNTHETIC SAMPLE (${note}). Generated by scripts/build-own-data-samples.mjs; not anyone's data and not any vendor's exact column layout.\n${header.join(",")}\n${rows.map((r) => r.join(",")).join("\n")}\n`;
write("public/notebooks/data/daily-summary-synthetic.csv", csv(["date", "steps", "distance_km", "active_kcal", "resting_hr_bpm", "avg_hr_bpm", "sleep_hours", "weight_kg"], daily, "generic wearable daily summary"));
write("public/notebooks/data/activities-synthetic.csv", csv(["start_time", "activity_type", "duration_min", "distance_km", "avg_hr_bpm", "active_kcal"], activities, "generic per-activity list"));

/** A minimal one-entry ZIP (deflate, fixed timestamp) so the bytes are stable. */
function zipOne(name, data) {
  const nameBuf = Buffer.from(name);
  const deflated = zlib.deflateRawSync(data, { level: 9 });
  const crc = crc32(data);
  const DOS_TIME = 0;
  const DOS_DATE = ((2026 - 1980) << 9) | (6 << 5) | 1;
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0, 6);
  local.writeUInt16LE(8, 8);
  local.writeUInt16LE(DOS_TIME, 10);
  local.writeUInt16LE(DOS_DATE, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(deflated.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  local.writeUInt16LE(0, 28);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0, 8);
  central.writeUInt16LE(8, 10);
  central.writeUInt16LE(DOS_TIME, 12);
  central.writeUInt16LE(DOS_DATE, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(deflated.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt32LE(0, 42);
  const cdOffset = local.length + nameBuf.length + deflated.length;
  const cdSize = central.length + nameBuf.length;
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(1, 8);
  end.writeUInt16LE(1, 10);
  end.writeUInt32LE(cdSize, 12);
  end.writeUInt32LE(cdOffset, 16);
  return Buffer.concat([local, nameBuf, deflated, central, nameBuf, end]);
}

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
