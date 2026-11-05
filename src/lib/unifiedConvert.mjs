/**
 * The /tools/schema-converter engine: platform payloads → unified health-data
 * records (public/schema/v1), with a field-by-field explanation.
 *
 * Inputs it reads, each in a shape this site documents:
 *   - HealthKit export.xml rows: <Record type="HK…" … /> and <Workout … />
 *     start tags, read with the Apple Health export explorer's scanner
 *     (src/lib/appleHealthExport.mjs). Apple does not publish the file's
 *     element and attribute names; the converter reads the names the file
 *     itself carries, as the explorer does.
 *   - HealthKit JSON in /tools/sample-data's encoding ({ type, startDate,
 *     endDate, value, valueUnit } and { workoutActivityType, … }).
 *   - Health Connect records in /tools/sample-data's JSON encoding of the
 *     Kotlin classes, keyed by class name ({ "StepsRecord": [ … ] }), or one
 *     record with a "recordType" naming its class.
 *   - Google Health API data points ({ "heartRate": { … } }), a list
 *     response ({ dataPoints: [ … ] }), or an array of data points.
 *   - A whole /tools/sample-data download ({ _synthetic, records: { … } }).
 *
 * `spec` is public/schema/v1/mappings.json (or the same object from
 * src/data/unifiedSchema.ts): every lookup — HealthKit type names, Health
 * Connect classes, Google DataPoint properties, sleep stage values, workout
 * activity keys, unit factors — comes from it, so the engine holds no vendor
 * fact of its own.
 *
 * Pure: no DOM, no network. scripts/unified-convert.test.mjs runs it.
 */
import { createScanner } from "./appleHealthExport.mjs";

/** Instant (ms) → RFC 3339 UTC, without .000. */
export function isoInstant(ms) {
  return new Date(ms).toISOString().replace(".000Z", "Z");
}

/** "+05:30" from minutes east of UTC. */
export function offsetString(min) {
  const s = min < 0 ? "-" : "+";
  const a = Math.abs(Math.round(min));
  return `${s}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

/** google-duration ("3600s", "-18000s", "19800.000s") → "+01:00"; null for anything else. */
export function durationToOffset(d) {
  const m = /^(-?\d+(?:\.\d+)?)s$/.exec(String(d ?? "").trim());
  return m ? offsetString(Number(m[1]) / 60) : null;
}

/** A ZoneOffset as /tools/sample-data writes it ("+02:00", "Z") → "+HH:MM"; null stays null. */
export function zoneOffset(z) {
  if (z === null || z === undefined) return null;
  const s = String(z).trim();
  if (s === "Z") return "+00:00";
  const m = /^([+-])(\d{2}):?(\d{2})(?::?\d{2})?$/.exec(s);
  return m ? `${m[1]}${m[2]}:${m[3]}` : undefined;
}

/**
 * An export.xml date ("2026-03-01 07:12:00 -0800") or an ISO 8601 instant →
 * { ms, offset } where offset is the date's own ±HH:MM, or null when the
 * string carries none (a trailing Z states UTC, not the user's offset).
 */
export function parseDate(s) {
  if (typeof s !== "string") return null;
  const t = s.trim();
  const ex = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2}(?:\.\d+)?)\s*([+-])(\d{2}):?(\d{2})$/.exec(t);
  if (ex) {
    const ms = Date.parse(`${ex[1]}T${ex[2]}${ex[3]}${ex[4]}:${ex[5]}`);
    return Number.isNaN(ms) ? null : { ms, offset: `${ex[3]}${ex[4]}:${ex[5]}` };
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(t)) return null;
  const ms = Date.parse(t);
  if (Number.isNaN(ms)) return null;
  const off = /([+-]\d{2}:\d{2})$/.exec(t)?.[1] ?? null;
  return { ms, offset: off };
}

/** The UTC offset of an IANA zone at an instant, through the runtime's tz database; null if unknown. */
export function zoneOffsetAt(timeZone, ms) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" }).formatToParts(new Date(ms));
    const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    if (name === "GMT") return "+00:00";
    const m = /^GMT([+-])(\d{1,2}):?(\d{2})?$/.exec(name);
    return m ? `${m[1]}${m[2].padStart(2, "0")}:${m[3] ?? "00"}` : null;
  } catch {
    return null;
  }
}

const num = (v) => (typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)) ? Number(v) : NaN);
const round = (x) => Math.round(x * 1e6) / 1e6;

/** A conversion context: one per output record. */
function ctx(spec, recordId, platform) {
  const rec = spec.records.find((r) => r.id === recordId);
  if (!rec) throw new Error(`no unified record ${recordId}`);
  const map = rec.platforms[platform];
  const steps = [];
  const warnings = [];
  return {
    rec,
    map,
    steps,
    warnings,
    /** Record one field's provenance. */
    put(out, field, value, from, raw, rule) {
      out[field] = value;
      const cell = map.fields[field] ?? null;
      steps.push({
        field,
        value,
        from,
        raw: raw === undefined ? null : raw,
        rule: rule ?? cell?.conversion ?? null,
        evidence: cell?.evidence ?? null,
      });
    },
  };
}

function finish(c, out) {
  return { record: out, recordId: c.rec.id, title: c.rec.title, steps: c.steps, warnings: c.warnings };
}

/* ── Units ── */

function toUnit(spec, family, unit, value) {
  const table = spec.converter.units[family] ?? {};
  const f = table[unit];
  return f === undefined ? null : round(value * f);
}

/* ── HealthKit ── */

function hkQuantityValue(spec, c, recordId, unit, value, from) {
  const v = num(value);
  if (Number.isNaN(v)) throw new Error(`${from}: value ${JSON.stringify(value)} is not a number`);
  const u = String(unit ?? "").trim();
  switch (recordId) {
    case "heartRate":
      if (u !== "count/min") throw new Error(`${from}: unit "${u}" — this converter reads heart rate in count/min only`);
      return { field: "beatsPerMinute", value: v, rule: "count/min, unchanged" };
    case "steps":
      if (u !== "count") throw new Error(`${from}: unit "${u}" — steps are a count`);
      return { field: "count", value: Math.round(v), rule: "count, unchanged" };
    case "bodyMass": {
      const kg = toUnit(spec, "mass", u, v);
      if (kg === null) throw new Error(`${from}: unit "${u}" is not one this converter has a sourced factor for (kg, g, mg, lb)`);
      return { field: "kilograms", value: kg, rule: u === "kg" ? "kg, unchanged" : u === "lb" ? `lb × 453.59237 g ÷ 1,000 (Google: “${spec.converter.units.unitEvidence.lb.quote}”)` : `${u} → kg (SI prefix)` };
    }
    case "height": {
      const m = toUnit(spec, "length", u, v);
      if (m === null) throw new Error(`${from}: unit "${u}" is not one this converter has a sourced factor for (m, cm, mm, in)`);
      return { field: "meters", value: m, rule: u === "m" ? "m, unchanged" : u === "in" ? `in × 25.4 mm ÷ 1,000 (Google: “${spec.converter.units.unitEvidence.in.quote}”)` : `${u} → m (SI prefix)` };
    }
    case "heartRateVariability": {
      const ms = toUnit(spec, "time", u, v);
      if (ms === null) throw new Error(`${from}: unit "${u}" — this converter reads HRV in ms or s`);
      return { field: "milliseconds", value: ms, rule: u === "ms" ? "ms, unchanged" : "s × 1,000" };
    }
    case "bodyFat":
    case "oxygenSaturation": {
      if (u !== "%") throw new Error(`${from}: unit "${u}" — HealthKit percent values carry unit "%"`);
      if (v > 1) throw new Error(`${from}: ${v} is outside the 0.0–1.0 range Apple states for its percent unit (“${spec.converter.units.unitEvidence.percent.quote}”); not converted`);
      return { field: "percent", value: round(v * 100), rule: `× 100 (Apple: “${spec.converter.units.unitEvidence.percent.quote}”)` };
    }
    default:
      throw new Error(`${from}: no quantity rule for ${recordId}`);
  }
}

function hkTimes(c, out, a, shape, from, zone) {
  const s = parseDate(a.startDate);
  const e = parseDate(a.endDate ?? a.startDate);
  if (!s) throw new Error(`${from}: startDate ${JSON.stringify(a.startDate)} is not a date`);
  if (!e) throw new Error(`${from}: endDate ${JSON.stringify(a.endDate)} is not a date`);
  const off = (p, ms) => {
    if (p.offset && !/Z$/.test(String(a.startDate))) return { v: p.offset, rule: "the offset printed in the date" };
    if (zone) {
      const z = zoneOffsetAt(zone, ms);
      if (z) return { v: z, rule: `computed from metadata.HKMetadataKeyTimeZone "${zone}" at that instant (runtime tz database)` };
    }
    return { v: null, rule: "the date carries no offset" };
  };
  if (shape === "sample") {
    if (s.ms !== e.ms) c.warnings.push(`${from}: startDate and endDate differ; the unified sample takes startDate`);
    c.put(out, "time", isoInstant(s.ms), `${from}.startDate`, a.startDate, "→ RFC 3339 UTC");
    const o = off(s, s.ms);
    c.put(out, "utcOffset", o.v, `${from}.startDate`, a.startDate, o.rule);
  } else {
    if (e.ms < s.ms) throw new Error(`${from}: endDate is before startDate`);
    c.put(out, "startTime", isoInstant(s.ms), `${from}.startDate`, a.startDate, "→ RFC 3339 UTC");
    c.put(out, "endTime", isoInstant(e.ms), `${from}.endDate`, a.endDate, "→ RFC 3339 UTC");
    const os = off(s, s.ms);
    const oe = off(e, e.ms);
    c.put(out, "startUtcOffset", os.v, `${from}.startDate`, a.startDate, os.rule);
    c.put(out, "endUtcOffset", oe.v, `${from}.endDate`, a.endDate, oe.rule);
  }
}

/** HealthKit items: { kind: "Record" | "Workout", attrs, label }. */
function convertHealthKit(spec, items) {
  const results = [];
  const errors = [];
  const sleep = [];
  for (const { kind, attrs: a, label } of items) {
    try {
      if (kind === "Workout" || a.workoutActivityType) {
        const c = ctx(spec, "workout", "healthkit");
        const out = { type: "workout", source: { platform: "healthkit", nativeType: "HKWorkout", ...(a.sourceName ? { sourceName: a.sourceName } : {}) } };
        hkTimes(c, out, a, "session", label, a.metadata?.HKMetadataKeyTimeZone);
        const native = String(a.workoutActivityType ?? "");
        const key = spec.converter.workouts.healthkit[native] ?? null;
        c.put(out, "activityType", key, `${label}.workoutActivityType`, native, key ? "Objective-C constant → crosswalk key" : "not in the HealthKit workout data: null");
        c.put(out, "nativeActivityType", native, `${label}.workoutActivityType`, native, "unchanged");
        if (!key) c.warnings.push(`${native} is not an HKWorkoutActivityType in this site's data`);
        c.put(out, "energyKcal", null, null, null, c.map.fields.energyKcal.reason);
        c.put(out, "distanceMeters", null, null, null, c.map.fields.distanceMeters.reason);
        results.push(finish(c, out));
        continue;
      }
      const type = String(a.type ?? "");
      const recordId = spec.converter.healthkitTypes[type];
      if (!recordId) throw new Error(`${label}: type ${JSON.stringify(type)} is not one of the ${Object.keys(spec.converter.healthkitTypes).length} HealthKit types the unified schema maps`);
      if (recordId === "sleepSession") {
        sleep.push({ a, label });
        continue;
      }
      const c = ctx(spec, recordId, "healthkit");
      const out = { type: recordId, source: { platform: "healthkit", nativeType: type, ...(a.sourceName ? { sourceName: a.sourceName } : {}) } };
      hkTimes(c, out, a, c.rec.shape, label, a.metadata?.HKMetadataKeyTimeZone);
      if (recordId === "heartRateVariability") c.put(out, "metric", "sdnn", label + ".type", type, "HKQuantityTypeIdentifierHeartRateVariabilitySDNN is SDNN");
      const unit = a.unit ?? a.valueUnit;
      const q = hkQuantityValue(spec, c, recordId, unit, a.value, label);
      c.put(out, q.field, q.value, `${label}.value (${unit})`, a.value, q.rule);
      results.push(finish(c, out));
    } catch (e) {
      errors.push(e.message);
    }
  }
  if (sleep.length) {
    try {
      const c = ctx(spec, "sleepSession", "healthkit");
      const map = spec.sleepStageMaps.healthkit;
      const stages = [];
      let first = null;
      let last = null;
      for (const { a, label } of sleep) {
        const s = parseDate(a.startDate);
        const e = parseDate(a.endDate);
        if (!s || !e) throw new Error(`${label}: unreadable startDate/endDate`);
        const row = map.find((r) => r.value === a.value);
        if (!row) throw new Error(`${label}: value ${JSON.stringify(a.value)} is not an HKCategoryValueSleepAnalysis constant`);
        stages.push({ startTime: isoInstant(s.ms), endTime: isoInstant(e.ms), stage: row.unified, _from: label, _raw: a.value, _note: row.note });
        if (!first || s.ms < first.p.ms) first = { p: s, a };
        if (!last || e.ms > last.p.ms) last = { p: e, a };
      }
      stages.sort((x, y) => x.startTime.localeCompare(y.startTime));
      const out = { type: "sleepSession", source: { platform: "healthkit", nativeType: "HKCategoryTypeIdentifierSleepAnalysis" } };
      const src = first.a.sourceName ?? null;
      if (src) out.source.sourceName = src;
      hkTimes(c, out, { startDate: first.a.startDate, endDate: last.a.endDate }, "session", `${sleep.length} sleepAnalysis sample${sleep.length === 1 ? "" : "s"}`, null);
      const clean = stages.map(({ startTime, endTime, stage }) => ({ startTime, endTime, stage }));
      c.put(out, "stages", clean, "each sample's value", stages.map((s) => s._raw), stages.map((s) => `${s._raw} → ${s.stage}${s._note ? ` (${s._note})` : ""}`).join("; "));
      results.push(finish(c, out));
    } catch (e) {
      errors.push(e.message);
    }
  }
  return { results, errors };
}

/** export.xml text → items, through the export explorer's scanner. */
export function healthKitXmlItems(text) {
  const items = [];
  const sc = createScanner((name, attrs) => {
    if (name === "Record" || name === "Workout") items.push({ kind: name, attrs, label: `${name} #${items.length + 1}` });
  });
  sc.push(text);
  sc.end();
  return items;
}

/* ── Health Connect ── */

function hcTimes(c, out, r, shape, from) {
  if (shape === "sample") {
    const t = parseDate(r.time);
    if (!t) throw new Error(`${from}: time ${JSON.stringify(r.time)} is not an ISO 8601 instant`);
    c.put(out, "time", isoInstant(t.ms), `${from}.time`, r.time, "Instant → RFC 3339 UTC");
    const z = zoneOffset(r.zoneOffset);
    if (z === undefined) throw new Error(`${from}: zoneOffset ${JSON.stringify(r.zoneOffset)} is not ±HH:MM`);
    c.put(out, "utcOffset", z, `${from}.zoneOffset`, r.zoneOffset ?? null);
  } else {
    const s = parseDate(r.startTime);
    const e = parseDate(r.endTime);
    if (!s) throw new Error(`${from}: startTime ${JSON.stringify(r.startTime)} is not an ISO 8601 instant`);
    if (!e) throw new Error(`${from}: endTime ${JSON.stringify(r.endTime)} is not an ISO 8601 instant`);
    if (e.ms < s.ms) throw new Error(`${from}: endTime is before startTime`);
    c.put(out, "startTime", isoInstant(s.ms), `${from}.startTime`, r.startTime, "Instant → RFC 3339 UTC");
    c.put(out, "endTime", isoInstant(e.ms), `${from}.endTime`, r.endTime, "Instant → RFC 3339 UTC");
    const zs = zoneOffset(r.startZoneOffset);
    const ze = zoneOffset(r.endZoneOffset);
    if (zs === undefined || ze === undefined) throw new Error(`${from}: a zone offset is not ±HH:MM`);
    c.put(out, "startUtcOffset", zs, `${from}.startZoneOffset`, r.startZoneOffset ?? null);
    c.put(out, "endUtcOffset", ze, `${from}.endZoneOffset`, r.endZoneOffset ?? null);
  }
}

/** A Kotlin unit-class value as { value, unit } (or a bare number in the class's base unit). */
function hcMeasure(spec, family, v, from, baseUnit) {
  if (typeof v === "number") return { value: v, rule: `a bare number, read as ${baseUnit} (the unit Google's sentence names)` };
  if (v && typeof v === "object" && "value" in v) {
    const out = toUnit(spec, family, String(v.unit ?? baseUnit), num(v.value));
    if (out === null || Number.isNaN(out)) throw new Error(`${from}: { value: ${JSON.stringify(v.value)}, unit: ${JSON.stringify(v.unit)} } — not a unit this converter has a sourced factor for`);
    return { value: out, rule: String(v.unit) === baseUnit ? `${baseUnit}, unchanged` : `${v.unit} → ${baseUnit}` };
  }
  throw new Error(`${from}: expected { value, unit } or a number`);
}

function convertHealthConnectRecord(spec, cls, r, from) {
  const recordId = spec.converter.healthConnectClasses[cls];
  if (!recordId) throw new Error(`${from}: ${cls} is not one of the ${Object.keys(spec.converter.healthConnectClasses).length} Health Connect classes the unified schema maps`);
  const base = { type: recordId, source: { platform: "health-connect", nativeType: cls } };
  if (recordId === "heartRate") {
    // One series record → one unified sample per element.
    if (!Array.isArray(r.samples)) throw new Error(`${from}: HeartRateRecord needs samples[] ({ time, beatsPerMinute })`);
    const zs = zoneOffset(r.startZoneOffset);
    if (zs === undefined) throw new Error(`${from}: startZoneOffset is not ±HH:MM`);
    return r.samples.map((s, i) => {
      const c = ctx(spec, recordId, "health-connect");
      const out = structuredClone(base);
      const t = parseDate(s.time);
      if (!t) throw new Error(`${from}.samples[${i}]: time is not an ISO 8601 instant`);
      c.put(out, "time", isoInstant(t.ms), `${from}.samples[${i}].time`, s.time, "Instant → RFC 3339 UTC");
      c.put(out, "utcOffset", zs, `${from}.startZoneOffset`, r.startZoneOffset ?? null);
      const bpm = num(s.beatsPerMinute);
      if (Number.isNaN(bpm)) throw new Error(`${from}.samples[${i}]: beatsPerMinute is not a number`);
      c.put(out, "beatsPerMinute", bpm, `${from}.samples[${i}].beatsPerMinute`, s.beatsPerMinute, "Long, unchanged");
      return finish(c, out);
    });
  }
  const c = ctx(spec, recordId, "health-connect");
  const out = base;
  hcTimes(c, out, r, c.rec.shape, from);
  switch (recordId) {
    case "steps": {
      const n = num(r.count);
      if (!Number.isInteger(n)) throw new Error(`${from}: count is not an integer`);
      c.put(out, "count", n, `${from}.count`, r.count, "Long, unchanged");
      break;
    }
    case "sleepSession": {
      const map = spec.sleepStageMaps["health-connect"];
      const st = Array.isArray(r.stages) ? r.stages : [];
      const stages = st.map((s, i) => {
        const a = parseDate(s.startTime);
        const b = parseDate(s.endTime);
        if (!a || !b) throw new Error(`${from}.stages[${i}]: startTime/endTime are not instants`);
        const row = map.find((m) => m.value === num(s.stage) || m.name === s.stage);
        if (!row) throw new Error(`${from}.stages[${i}]: stage ${JSON.stringify(s.stage)} is not a STAGE_TYPE_ value`);
        return { startTime: isoInstant(a.ms), endTime: isoInstant(b.ms), stage: row.unified, _rule: `${row.name} (${row.value}) → ${row.unified}` };
      });
      c.put(out, "stages", stages.map(({ _rule, ...x }) => x), `${from}.stages`, st.length ? st.map((s) => s.stage) : [], stages.length ? stages.map((s) => s._rule).join("; ") : "no stages in the record: []");
      break;
    }
    case "workout": {
      const raw = r.exerciseType;
      const hit = spec.converter.workouts["health-connect"][String(num(raw))] ?? null;
      c.put(out, "activityType", hit?.key ?? null, `${from}.exerciseType`, raw, hit ? `${raw} = ${hit.name} → crosswalk key` : "not an EXERCISE_TYPE_ value in this site's data: null");
      c.put(out, "nativeActivityType", hit?.name ?? String(raw), `${from}.exerciseType`, raw, hit ? "the constant's name" : "the value as given");
      if (!hit) c.warnings.push(`exerciseType ${raw} is not in the Health Connect workout data`);
      c.put(out, "energyKcal", null, null, null, c.map.fields.energyKcal.reason);
      c.put(out, "distanceMeters", null, null, null, c.map.fields.distanceMeters.reason);
      break;
    }
    case "bodyMass": {
      const m = hcMeasure(spec, "mass", r.weight, `${from}.weight`, "kilograms");
      c.put(out, "kilograms", m.value, `${from}.weight`, r.weight, m.rule);
      break;
    }
    case "height": {
      const m = hcMeasure(spec, "length", r.height, `${from}.height`, "meters");
      c.put(out, "meters", m.value, `${from}.height`, r.height, m.rule);
      break;
    }
    case "bodyFat":
    case "oxygenSaturation": {
      const v = typeof r.percentage === "object" && r.percentage !== null ? num(r.percentage.value) : num(r.percentage);
      if (Number.isNaN(v)) throw new Error(`${from}: percentage is not a number`);
      if (v < 0 || v > 100) c.warnings.push(`${from}: percentage ${v} is outside Google's stated 0-100`);
      c.put(out, "percent", v, `${from}.percentage`, r.percentage, "Percentage (0–100), unchanged");
      break;
    }
    case "heartRateVariability": {
      c.put(out, "metric", "rmssd", `${from} (class)`, cls, "HeartRateVariabilityRmssdRecord is RMSSD");
      const v = num(r.heartRateVariabilityMillis);
      if (Number.isNaN(v)) throw new Error(`${from}: heartRateVariabilityMillis is not a number`);
      c.put(out, "milliseconds", v, `${from}.heartRateVariabilityMillis`, r.heartRateVariabilityMillis, "Double, unchanged");
      break;
    }
  }
  return [finish(c, out)];
}

/* ── Google Health API ── */

function gTimes(c, out, body, shape, from) {
  if (shape === "sample") {
    const st = body.sampleTime;
    if (!st || typeof st !== "object") throw new Error(`${from}: sampleTime missing`);
    const t = parseDate(st.physicalTime);
    if (!t) throw new Error(`${from}: sampleTime.physicalTime is not an instant`);
    c.put(out, "time", isoInstant(t.ms), `${from}.sampleTime.physicalTime`, st.physicalTime, "→ RFC 3339 UTC");
    const o = st.utcOffset === undefined ? null : durationToOffset(st.utcOffset);
    if (st.utcOffset !== undefined && o === null) throw new Error(`${from}: sampleTime.utcOffset ${JSON.stringify(st.utcOffset)} is not a google-duration like "3600s"`);
    c.put(out, "utcOffset", o, `${from}.sampleTime.utcOffset`, st.utcOffset ?? null);
  } else {
    const iv = body.interval;
    if (!iv || typeof iv !== "object") throw new Error(`${from}: interval missing`);
    const s = parseDate(iv.startTime);
    const e = parseDate(iv.endTime);
    if (!s || !e) throw new Error(`${from}: interval.startTime/endTime are not instants`);
    if (e.ms < s.ms) throw new Error(`${from}: interval ends before it starts`);
    c.put(out, "startTime", isoInstant(s.ms), `${from}.interval.startTime`, iv.startTime, "→ RFC 3339 UTC");
    c.put(out, "endTime", isoInstant(e.ms), `${from}.interval.endTime`, iv.endTime, "→ RFC 3339 UTC");
    const os = iv.startUtcOffset === undefined ? null : durationToOffset(iv.startUtcOffset);
    const oe = iv.endUtcOffset === undefined ? null : durationToOffset(iv.endUtcOffset);
    if ((iv.startUtcOffset !== undefined && os === null) || (iv.endUtcOffset !== undefined && oe === null)) throw new Error(`${from}: an interval offset is not a google-duration like "3600s"`);
    c.put(out, "startUtcOffset", os, `${from}.interval.startUtcOffset`, iv.startUtcOffset ?? null);
    c.put(out, "endUtcOffset", oe, `${from}.interval.endUtcOffset`, iv.endUtcOffset ?? null);
  }
}

function convertGoogleDataPoint(spec, dp, from) {
  const props = spec.converter.googleProperties;
  const keys = Object.keys(dp).filter((k) => k in props);
  if (!keys.length) {
    const named = Object.keys(dp).filter((k) => !["name", "dataSource", "createTime", "updateTime"].includes(k));
    throw new Error(`${from}: no data type the unified schema maps (found ${named.join(", ") || "nothing"}; mapped: ${Object.keys(props).join(", ")})`);
  }
  const prop = keys[0];
  const recordId = props[prop];
  const body = dp[prop];
  const c = ctx(spec, recordId, "google-health-api");
  const at = `${from}.${prop}`;
  const out = { type: recordId, source: { platform: "google-health-api", nativeType: c.map.type.type } };
  gTimes(c, out, body, c.rec.shape, at);
  const f = (name) => {
    const v = num(body[name]);
    if (Number.isNaN(v)) throw new Error(`${at}.${name} is missing or not a number`);
    return v;
  };
  switch (recordId) {
    case "heartRate":
      c.put(out, "beatsPerMinute", f("beatsPerMinute"), `${at}.beatsPerMinute`, body.beatsPerMinute, typeof body.beatsPerMinute === "string" ? "int64 string → number" : "number, unchanged");
      break;
    case "steps":
      c.put(out, "count", Math.round(f("count")), `${at}.count`, body.count, typeof body.count === "string" ? "int64 string → integer" : "integer, unchanged");
      break;
    case "bodyMass":
      c.put(out, "kilograms", round(f("weightGrams") / 1000), `${at}.weightGrams`, body.weightGrams);
      break;
    case "height":
      c.put(out, "meters", round(f("heightMillimeters") / 1000), `${at}.heightMillimeters`, body.heightMillimeters);
      break;
    case "bodyFat":
    case "oxygenSaturation":
      c.put(out, "percent", f("percentage"), `${at}.percentage`, body.percentage, "0–100, unchanged");
      break;
    case "heartRateVariability": {
      if (body.rootMeanSquareOfSuccessiveDifferencesMilliseconds === undefined) {
        throw new Error(`${at}: no rootMeanSquareOfSuccessiveDifferencesMilliseconds — ${c.map.unmappedFields?.[0]?.reason ?? "standardDeviationMilliseconds is not mapped"}`);
      }
      c.put(out, "metric", "rmssd", `${at}.rootMeanSquareOfSuccessiveDifferencesMilliseconds`, "(present)");
      c.put(out, "milliseconds", f("rootMeanSquareOfSuccessiveDifferencesMilliseconds"), `${at}.rootMeanSquareOfSuccessiveDifferencesMilliseconds`, body.rootMeanSquareOfSuccessiveDifferencesMilliseconds, "number, unchanged");
      if (body.standardDeviationMilliseconds !== undefined) c.warnings.push(`standardDeviationMilliseconds dropped: ${c.map.unmappedFields?.[0]?.reason ?? "not mapped"}`);
      break;
    }
    case "sleepSession": {
      const map = spec.sleepStageMaps["google-health-api"];
      const st = Array.isArray(body.stages) ? body.stages : [];
      const stages = st.map((s, i) => {
        const a = parseDate(s.startTime);
        const b = parseDate(s.endTime);
        if (!a || !b) throw new Error(`${at}.stages[${i}]: startTime/endTime are not instants`);
        const row = map.find((m) => m.value === s.type);
        if (!row) throw new Error(`${at}.stages[${i}]: type ${JSON.stringify(s.type)} is not a SleepStage type`);
        return { startTime: isoInstant(a.ms), endTime: isoInstant(b.ms), stage: row.unified, _rule: `${row.value} → ${row.unified}` };
      });
      c.put(out, "stages", stages.map(({ _rule, ...x }) => x), `${at}.stages`, st.map((s) => s.type), stages.length ? stages.map((s) => s._rule).join("; ") : "no stages: []");
      if (Array.isArray(body.outOfBedSegments) && body.outOfBedSegments.length) c.warnings.push("outOfBedSegments are not read (they can overlap stages)");
      break;
    }
    case "workout": {
      const raw = body.exerciseType;
      const key = spec.converter.workouts["google-health-api"][raw] ?? null;
      c.put(out, "activityType", key, `${at}.exerciseType`, raw, key ? "enum string → crosswalk key" : "not an exerciseType value in this site's data: null");
      c.put(out, "nativeActivityType", String(raw ?? ""), `${at}.exerciseType`, raw, "unchanged");
      if (!key) c.warnings.push(`exerciseType ${raw} is not in the Google Health API workout data`);
      const ms = body.metricsSummary ?? {};
      const kcal = ms.caloriesKcal === undefined ? null : num(ms.caloriesKcal);
      c.put(out, "energyKcal", kcal, `${at}.metricsSummary.caloriesKcal`, ms.caloriesKcal ?? null, kcal === null ? "absent: null" : "kcal, unchanged");
      const mm = ms.distanceMillimeters === undefined ? null : num(ms.distanceMillimeters);
      c.put(out, "distanceMeters", mm === null ? null : round(mm / 1000), `${at}.metricsSummary.distanceMillimeters`, ms.distanceMillimeters ?? null, mm === null ? "absent: null" : undefined);
      break;
    }
  }
  return finish(c, out);
}

/* ── Format detection and the entry point ── */

export const FORMATS = {
  "healthkit-xml": "HealthKit export.xml rows",
  "healthkit-json": "HealthKit JSON (sample-data encoding)",
  "health-connect": "Health Connect record JSON",
  "google-health-api": "Google Health API data points",
  "sample-data": "A /tools/sample-data download",
};

/** Which input shape `text` is; null when none fits. */
export function detectFormat(text, spec) {
  const t = String(text ?? "").trim();
  if (!t) return null;
  if (t.startsWith("<")) return "healthkit-xml";
  let j;
  try {
    j = JSON.parse(t);
  } catch {
    return null;
  }
  if (j && typeof j === "object" && !Array.isArray(j) && j.records && typeof j.records === "object" && j._synthetic) return "sample-data";
  const first = Array.isArray(j) ? j[0] : j;
  if (!first || typeof first !== "object") return null;
  if (Array.isArray(first.dataPoints) || Object.keys(first).some((k) => k in spec.converter.googleProperties)) return "google-health-api";
  if (typeof first.type === "string" && /^HK/.test(first.type)) return "healthkit-json";
  if (first.workoutActivityType) return "healthkit-json";
  if (first.recordType || Object.keys(first).some((k) => k in spec.converter.healthConnectClasses)) return "health-connect";
  return null;
}

function hcEntries(j) {
  // { "StepsRecord": [ … ] } | { recordType: "StepsRecord", … } | [ either ]
  const list = Array.isArray(j) ? j : [j];
  const out = [];
  list.forEach((o, i) => {
    if (o && typeof o.recordType === "string") {
      const { recordType, ...rest } = o;
      out.push({ cls: recordType, r: rest, from: `${recordType}[${i}]` });
      return;
    }
    for (const [cls, v] of Object.entries(o ?? {})) {
      if (cls.startsWith("_")) continue; // _note, _synthetic: annotations, not records
      (Array.isArray(v) ? v : [v]).forEach((r, k) => out.push({ cls, r, from: `${cls}[${k}]` }));
    }
  });
  return out;
}

function gPoints(j) {
  const list = Array.isArray(j) ? j : [j];
  const out = [];
  list.forEach((o) => {
    if (o && Array.isArray(o.dataPoints)) o.dataPoints.forEach((dp) => out.push(dp));
    else out.push(o);
  });
  return out;
}

/**
 * Convert `text` (one of FORMATS) to unified records.
 * Returns { format, results: [{ record, recordId, title, steps, warnings }], errors }.
 */
export function convert(text, spec, opts = {}) {
  const format = opts.format ?? detectFormat(text, spec);
  if (!format) return { format: null, results: [], errors: ["Could not tell which format this is. Paste export.xml rows (starting with <Record), or JSON from Health Connect, the Google Health API or /tools/sample-data."] };
  const errors = [];
  const results = [];
  const run = (fn) => {
    try {
      fn();
    } catch (e) {
      errors.push(e.message);
    }
  };
  if (format === "healthkit-xml") {
    const items = healthKitXmlItems(text);
    if (!items.length) return { format, results, errors: ["No <Record> or <Workout> start tags found."] };
    const r = convertHealthKit(spec, items);
    return { format, results: r.results, errors: r.errors };
  }
  let j;
  try {
    j = JSON.parse(text);
  } catch (e) {
    return { format, results, errors: [`Not valid JSON: ${e.message}`] };
  }
  if (format === "healthkit-json") {
    const list = (Array.isArray(j) ? j : [j]).map((a, i) => ({ kind: a.workoutActivityType ? "Workout" : "Record", attrs: a, label: `item[${i}]` }));
    const r = convertHealthKit(spec, list);
    return { format, results: r.results, errors: r.errors };
  }
  if (format === "health-connect") {
    for (const { cls, r, from } of hcEntries(j)) run(() => results.push(...convertHealthConnectRecord(spec, cls, r, from)));
    return { format, results, errors };
  }
  if (format === "google-health-api") {
    gPoints(j).forEach((dp, i) => run(() => results.push(convertGoogleDataPoint(spec, dp, `dataPoints[${i}]`))));
    return { format, results, errors };
  }
  // sample-data envelope: dispatch on its platform.
  const platform = j._synthetic?.platform;
  const recs = j.records ?? {};
  if (platform === "health-connect") {
    for (const { cls, r, from } of hcEntries(recs)) run(() => results.push(...convertHealthConnectRecord(spec, cls, r, from)));
  } else if (platform === "google-health-api") {
    for (const [dt, v] of Object.entries(recs)) gPoints(v).forEach((dp, i) => run(() => results.push(convertGoogleDataPoint(spec, dp, `${dt}.dataPoints[${i}]`))));
  } else if (platform === "healthkit") {
    const items = [];
    for (const [t, v] of Object.entries(recs)) (Array.isArray(v) ? v : [v]).forEach((a, i) => items.push({ kind: a.workoutActivityType ? "Workout" : "Record", attrs: a, label: `${t}[${i}]` }));
    const r = convertHealthKit(spec, items);
    results.push(...r.results);
    errors.push(...r.errors);
  } else errors.push(`Unknown sample-data platform ${JSON.stringify(platform)}`);
  return { format, results, errors };
}
