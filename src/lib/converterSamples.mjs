/**
 * Synthetic sample inputs for /tools/schema-converter, one per platform shape.
 *
 * The values are made up. The names are not: every type name, field name and
 * enum value is read from the unified schema's mappings (public/schema/v1/
 * mappings.json, generated from this site's datasets), and building a sample
 * throws when a name it needs is missing — so a regeneration that renames a
 * field breaks the build rather than shipping a sample the converter would
 * reject.
 */

export const SYNTHETIC_NOTE = "SYNTHETIC — made-up values in the documented field names, for trying the converter. Not real user data.";

function cell(spec, recordId, platform, field) {
  const r = spec.records.find((x) => x.id === recordId) ?? fail(`record ${recordId}`);
  const c = r.platforms[platform]?.fields?.[field] ?? fail(`${recordId}.${field} on ${platform}`);
  if (c.status !== "mapped" || !c.field) fail(`${recordId}.${field} on ${platform} is not mapped`);
  return c;
}
function fail(what) {
  throw new Error(`converter samples: ${what} missing from the mappings`);
}
const leaf = (c) => c.field.split(".").pop().replace(/\[\]$/, "");
/** The last segment of a path like "samples[].beatsPerMinute". */
const lastName = (c) => c.field.split(/[.\s,]+/).filter(Boolean).pop().replace(/^.*\]\./, "");

function objcOf(spec, recordId) {
  return Object.entries(spec.converter.healthkitTypes).find(([, id]) => id === recordId)?.[0] ?? fail(`HealthKit type for ${recordId}`);
}
function gProp(spec, recordId) {
  return Object.entries(spec.converter.googleProperties).find(([, id]) => id === recordId)?.[0] ?? fail(`Google property for ${recordId}`);
}
function hcClass(spec, recordId) {
  return Object.entries(spec.converter.healthConnectClasses).find(([, id]) => id === recordId)?.[0] ?? fail(`Health Connect class for ${recordId}`);
}
const stageValue = (spec, platform, unified) => spec.sleepStageMaps[platform].find((r) => r.unified === unified && !r.note?.startsWith("Deprecated"))?.value ?? fail(`${platform} stage ${unified}`);
function workoutNative(spec, platform, key) {
  const t = spec.converter.workouts[platform];
  const hit = Object.entries(t).find(([, v]) => (typeof v === "string" ? v : v.key) === key);
  return hit ? hit[0] : fail(`${platform} workout ${key}`);
}

/** The three samples: { id, label, format, text }. */
export function buildSamples(spec) {
  // HealthKit export.xml rows — attribute names as the file carries them.
  const hkRows = [
    `<!-- ${SYNTHETIC_NOTE} -->`,
    `<Record type="${objcOf(spec, "heartRate")}" sourceName="Synthetic Watch" unit="count/min" startDate="2026-10-14 07:31:12 +0200" endDate="2026-10-14 07:31:12 +0200" value="64"/>`,
    `<Record type="${objcOf(spec, "steps")}" sourceName="Synthetic Phone" unit="count" startDate="2026-10-14 08:00:00 +0200" endDate="2026-10-14 08:10:00 +0200" value="812"/>`,
    `<Record type="${objcOf(spec, "oxygenSaturation")}" sourceName="Synthetic Watch" unit="%" startDate="2026-10-14 03:12:40 +0200" endDate="2026-10-14 03:12:40 +0200" value="0.97"/>`,
    `<Record type="${objcOf(spec, "bodyMass")}" sourceName="Synthetic Scale" unit="lb" startDate="2026-10-14 06:55:00 +0200" endDate="2026-10-14 06:55:00 +0200" value="160.2"/>`,
    `<Record type="${objcOf(spec, "sleepSession")}" sourceName="Synthetic Watch" startDate="2026-10-13 23:40:00 +0200" endDate="2026-10-14 00:25:00 +0200" value="${stageValue(spec, "healthkit", "light")}"/>`,
    `<Record type="${objcOf(spec, "sleepSession")}" sourceName="Synthetic Watch" startDate="2026-10-14 00:25:00 +0200" endDate="2026-10-14 01:10:00 +0200" value="${stageValue(spec, "healthkit", "deep")}"/>`,
    `<Record type="${objcOf(spec, "sleepSession")}" sourceName="Synthetic Watch" startDate="2026-10-14 01:10:00 +0200" endDate="2026-10-14 01:35:00 +0200" value="${stageValue(spec, "healthkit", "rem")}"/>`,
    `<Workout workoutActivityType="${workoutNative(spec, "healthkit", "running")}" sourceName="Synthetic Watch" startDate="2026-10-14 18:02:00 +0200" endDate="2026-10-14 18:38:30 +0200"/>`,
  ].join("\n");

  // Health Connect, in /tools/sample-data's JSON encoding of the classes.
  const t = (id, f) => leaf(cell(spec, id, "health-connect", f));
  const hrBpm = lastName(cell(spec, "heartRate", "health-connect", "beatsPerMinute"));
  const hrTime = lastName(cell(spec, "heartRate", "health-connect", "time"));
  const hc = {
    _note: SYNTHETIC_NOTE,
    [hcClass(spec, "heartRate")]: [
      {
        startTime: "2026-10-14T05:30:00Z",
        endTime: "2026-10-14T05:32:00Z",
        startZoneOffset: "+02:00",
        endZoneOffset: "+02:00",
        samples: [
          { [hrTime]: "2026-10-14T05:30:00Z", [hrBpm]: 62 },
          { [hrTime]: "2026-10-14T05:31:00Z", [hrBpm]: 65 },
        ],
      },
    ],
    [hcClass(spec, "sleepSession")]: [
      {
        [t("sleepSession", "startTime")]: "2026-10-13T21:40:00Z",
        [t("sleepSession", "startUtcOffset")]: "+02:00",
        [t("sleepSession", "endTime")]: "2026-10-13T23:35:00Z",
        [t("sleepSession", "endUtcOffset")]: "+02:00",
        stages: [
          { startTime: "2026-10-13T21:40:00Z", endTime: "2026-10-13T22:25:00Z", stage: stageValue(spec, "health-connect", "light") },
          { startTime: "2026-10-13T22:25:00Z", endTime: "2026-10-13T23:10:00Z", stage: stageValue(spec, "health-connect", "deep") },
          { startTime: "2026-10-13T23:10:00Z", endTime: "2026-10-13T23:35:00Z", stage: stageValue(spec, "health-connect", "awakeInBed") },
        ],
      },
    ],
    [hcClass(spec, "bodyMass")]: [{ [t("bodyMass", "time")]: "2026-10-14T04:55:00Z", [t("bodyMass", "utcOffset")]: "+02:00", [t("bodyMass", "kilograms")]: { value: 72.4, unit: "kilograms" } }],
    [hcClass(spec, "heartRateVariability")]: [{ [t("heartRateVariability", "time")]: "2026-10-14T03:00:00Z", [t("heartRateVariability", "utcOffset")]: null, [t("heartRateVariability", "milliseconds")]: 41.5 }],
    [hcClass(spec, "workout")]: [
      {
        [t("workout", "startTime")]: "2026-10-14T16:02:00Z",
        [t("workout", "startUtcOffset")]: "+02:00",
        [t("workout", "endTime")]: "2026-10-14T16:38:30Z",
        [t("workout", "endUtcOffset")]: "+02:00",
        [t("workout", "activityType")]: Number(workoutNative(spec, "health-connect", "running")),
      },
    ],
  };
  // JSON has no comments; the note rides as a key the converter skips.
  const hcText = JSON.stringify(hc, null, 2);

  // Google Health API: a list-shaped response of data points.
  const g = (id) => gProp(spec, id);
  const gv = (id, f) => leaf(cell(spec, id, "google-health-api", f));
  const gt = (id, f) => cell(spec, id, "google-health-api", f).field.split(".").slice(1); // [timeField, name]
  const sample = (id, physical, offset) => {
    const [tf, a] = gt(id, "time");
    const [, b] = gt(id, "utcOffset");
    return { [tf]: { [a]: physical, [b]: offset } };
  };
  const interval = (id, s, e, off) => {
    const [tf, a] = gt(id, "startTime");
    const [, b] = gt(id, "endTime");
    const [, c] = gt(id, "startUtcOffset");
    const [, d] = gt(id, "endUtcOffset");
    return { [tf]: { [a]: s, [c]: off, [b]: e, [d]: off } };
  };
  const exKcal = cell(spec, "workout", "google-health-api", "energyKcal").field.split(".");
  const exDist = cell(spec, "workout", "google-health-api", "distanceMeters").field.split(".");
  const google = {
    _note: SYNTHETIC_NOTE,
    dataPoints: [
      { [g("heartRate")]: { ...sample("heartRate", "2026-10-14T05:31:12Z", "7200s"), [gv("heartRate", "beatsPerMinute")]: "64" } },
      { [g("steps")]: { ...interval("steps", "2026-10-14T06:00:00Z", "2026-10-14T06:10:00Z", "7200s"), [gv("steps", "count")]: "812" } },
      {
        [g("sleepSession")]: {
          ...interval("sleepSession", "2026-10-13T21:40:00Z", "2026-10-13T23:35:00Z", "7200s"),
          type: "STAGES",
          stages: [
            { startTime: "2026-10-13T21:40:00Z", startUtcOffset: "7200s", endTime: "2026-10-13T22:25:00Z", endUtcOffset: "7200s", type: stageValue(spec, "google-health-api", "light") },
            { startTime: "2026-10-13T22:25:00Z", startUtcOffset: "7200s", endTime: "2026-10-13T23:10:00Z", endUtcOffset: "7200s", type: stageValue(spec, "google-health-api", "deep") },
            { startTime: "2026-10-13T23:10:00Z", startUtcOffset: "7200s", endTime: "2026-10-13T23:35:00Z", endUtcOffset: "7200s", type: stageValue(spec, "google-health-api", "restless") },
          ],
        },
      },
      { [g("bodyMass")]: { ...sample("bodyMass", "2026-10-14T04:55:00Z", "7200s"), [gv("bodyMass", "kilograms")]: 72400 } },
      { [g("oxygenSaturation")]: { ...sample("oxygenSaturation", "2026-10-14T01:12:40Z", "7200s"), [gv("oxygenSaturation", "percent")]: 97 } },
      {
        [g("workout")]: {
          ...interval("workout", "2026-10-14T16:02:00Z", "2026-10-14T16:38:30Z", "7200s"),
          [gv("workout", "activityType")]: workoutNative(spec, "google-health-api", "running"),
          [exKcal[1]]: { [exKcal[2]]: 389, [exDist[2]]: 6120000 },
        },
      },
    ],
  };
  return [
    { id: "healthkit-xml", label: "HealthKit export.xml rows", format: "healthkit-xml", text: hkRows },
    { id: "health-connect", label: "Health Connect records", format: "health-connect", text: hcText },
    { id: "google-health-api", label: "Google Health API data points", format: "google-health-api", text: JSON.stringify(google, null, 2) },
  ];
}
