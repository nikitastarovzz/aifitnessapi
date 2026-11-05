#!/usr/bin/env node
/**
 * Generate the unified health-data schema (ops/AUDIENCE-30-2026-11-05.md
 * item 1): a vendor-neutral shape for nine common records, each field mapped
 * to Apple HealthKit, Android Health Connect, the Google Health API and Wear
 * OS Health Services.
 *
 * What is editorial and what is sourced. The shape of the unified records —
 * their names, their fields, the unit each field is held in — is this
 * site's design, written in RECORDS below. Every platform name a mapping
 * points at is looked up in this site's generated datasets, and the script
 * fails when one is missing, so a regeneration that renames a field breaks
 * the build instead of shipping a stale mapping:
 *
 *   src/data/healthkitIdentifiers.ts      HealthKit type identifiers, unit families
 *   src/data/healthConnectRecords.ts      Health Connect record properties and constants
 *   src/data/googleHealthApi.ts           Google Health API data types, discovery schemas,
 *                                         and the migration guide's unit sentences
 *   src/data/healthServicesDataTypes.ts   Wear OS Health Services DataType constants
 *   src/data/workoutTypes.ts              the workout activity-type crosswalk
 *
 * A few facts the datasets do not hold are read from the vendors' own
 * reference pages, cached in .cache/unified-schema (--offline reparses it):
 * Health Connect's HeartRateRecord.Sample and SleepSessionRecord.Stage
 * classes (Jetpack reference, ?hl=en), and Apple's documentation JSON for
 * HKCategoryValueSleepAnalysis, HKUnit.percent(), HKSample's startDate and
 * endDate, HKQuantitySample.quantity, HKCategorySample.value and HKWorkout's
 * workoutActivityType, totalEnergyBurned and totalDistance.
 *
 * Every mapped cell carries the platform's own sentence as `evidence`.
 * Every cell that is not mapped says why in `reason`; nothing is guessed. A
 * conversion factor is used only where a source states it (Apple's 0.0–1.0
 * percent, Google's "divide by 1,000" and "divide by 453.59237"), or where a
 * field name states its unit and the factor is an SI prefix.
 *
 * Outputs (never edit by hand):
 *   src/data/unifiedSchema.ts                         the page and tool data
 *   public/schema/v1/unified-health-data.schema.json  JSON Schema, draft 2020-12
 *   public/schema/v1/unified-health-data.d.ts         TypeScript types
 *   public/schema/v1/mappings.json                    the mappings + converter lookups
 *
 * Usage: NODE_USE_ENV_PROXY=1 node scripts/build-unified-schema.mjs [--offline]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const OFFLINE = process.argv.includes("--offline");
const CACHE = ".cache/unified-schema";
const SITE = "https://aifitnessapi.com";
const VERSION = "1.0.0";
const MAJOR = "v1";
const SCHEMA_ID = `${SITE}/schema/${MAJOR}/unified-health-data.schema.json`;
const OUT_TS = "src/data/unifiedSchema.ts";
const OUT_DIR = `public/schema/${MAJOR}`;

function fail(msg) {
  console.error(`build-unified-schema: ${msg}`);
  process.exit(1);
}

// ── Generated modules, read as text (the same parse scripts/qa.mjs uses) ──
const src = (f) => readFileSync(f, "utf8");
function literal(text, name, close) {
  const m = new RegExp(`export const ${name}: [^=]+= `).exec(text);
  if (!m) fail(`${name} not found`);
  const open = m.index + m[0].length;
  const end = text.indexOf(close, open);
  return JSON.parse(text.slice(open, end + close.length - 1));
}
const strConst = (text, name) => new RegExp(`export const ${name}\\s*=\\s*"([^"]*)"`).exec(text)?.[1] ?? fail(`${name} not found`);

const hkSrc = src("src/data/healthkitIdentifiers.ts");
const hcSrc = src("src/data/healthConnectRecords.ts");
const gSrc = src("src/data/googleHealthApi.ts");
const hsSrc = src("src/data/healthServicesDataTypes.ts");
const wtSrc = src("src/data/workoutTypes.ts");

const HK = literal(hkSrc, "HK_IDENTIFIERS", "\n];");
const HK_FETCHED_ON = strConst(hkSrc, "HK_FETCHED_ON");
const HC = literal(hcSrc, "HC_RECORDS", "\n];");
const HC_FETCHED_ON = strConst(hcSrc, "HC_FETCHED_ON");
const G_TYPES = literal(gSrc, "GHAPI_DATA_TYPES", "\n];");
const G_SCHEMAS = literal(gSrc, "GHAPI_SCHEMAS", "\n};");
const G_PAGES = literal(gSrc, "GHAPI_PAGES", "\n};");
const G_SOURCES = literal(gSrc, "GHAPI_SOURCES", "\n];");
const GHAPI_FETCHED_ON = strConst(gSrc, "GHAPI_FETCHED_ON");
const HS = literal(hsSrc, "HS_DATA_TYPES", "\n];");
const HS_FETCHED_ON = strConst(hsSrc, "HS_DATA_TYPES_FETCHED_ON");
const WT_HK = literal(wtSrc, "WT_HEALTHKIT", "\n];");
const WT_HC = literal(wtSrc, "WT_HEALTH_CONNECT", "\n];");
const WT_HS = literal(wtSrc, "WT_WEAR_OS", "\n];");
const WT_G = literal(wtSrc, "WT_GOOGLE_HEALTH_API", "\n];");
const WT_CROSSWALK = literal(wtSrc, "WT_CROSSWALK", "\n];");
const WT_FETCHED_ON = strConst(wtSrc, "WT_FETCHED_ON");
const WT_NORMALISATION = strConst(wtSrc, "WT_NORMALISATION");

// Floors: a short read of any input fails rather than publishing a thin schema.
if (HK.length < 241 || HC.length < 42 || G_TYPES.length < 44 || HS.length < 65 || WT_CROSSWALK.length < 80) {
  fail(`short input: ${HK.length} HK, ${HC.length} HC, ${G_TYPES.length} GHAPI, ${HS.length} HS, ${WT_CROSSWALK.length} crosswalk rows`);
}

// ── Vendor pages the datasets do not hold ────────────────────────────────
mkdirSync(CACHE, { recursive: true });
const fetched = [];
async function get(url, file) {
  const path = join(CACHE, file);
  fetched.push(url);
  if (existsSync(path)) return readFileSync(path, "utf8");
  if (OFFLINE) fail(`offline and ${path} is not cached`);
  const res = await fetch(url, { headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "aifitnessapi-generator (+https://aifitnessapi.com)" } });
  if (!res.ok) fail(`${res.status} for ${url}`);
  const text = await res.text();
  writeFileSync(path, text);
  return text;
}
const today = new Date().toISOString().slice(0, 10);
const metaPath = join(CACHE, "meta.json");
const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};

const JETPACK = "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records";
const APPLE = "https://developer.apple.com/tutorials/data/documentation/healthkit";
const APPLE_DOC = "https://developer.apple.com/documentation/healthkit";

const htmlText = (html) => {
  const a = html.indexOf("<article");
  const body = a === -1 ? html : html.slice(a);
  return body
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * A Jetpack nested class page → its constructor parameters and the sentence
 * Google prints for each property. Anchored on "Public constructors <Name> (".
 */
function jetpackClass(html, simpleName, url) {
  if (/devsite-banner-translated/.test(html)) fail(`${url} is machine-translated`);
  const t = htmlText(html);
  const start = t.indexOf(`Public constructors ${simpleName} (`);
  if (start === -1) fail(`${url}: no "Public constructors ${simpleName} (" summary`);
  let i = t.indexOf("(", start);
  let depth = 0;
  let j = i;
  for (; j < t.length; j++) {
    if (t[j] === "(") depth++;
    else if (t[j] === ")" && --depth === 0) break;
  }
  const sig = t.slice(i + 1, j);
  const params = [];
  let cur = "";
  depth = 0;
  for (const ch of sig) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      params.push(cur);
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) params.push(cur);
  const out = params.map((p) => {
    const k = p.indexOf(":");
    const name = p.slice(0, k).trim();
    const type = p.slice(k + 1).replace(/\s+/g, " ").replace(/@ /g, "@").replace(/ ,/g, ",").trim();
    // The property's own entry: "val <name> : <type> <sentence>".
    const prop = new RegExp(`val ${name} : ([^]*?)(?= [a-zA-Z]+ Added in | Content and code samples|$)`).exec(t);
    let description = null;
    if (prop) {
      const rest = prop[1].replace(type.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "").trim();
      const s = rest.replace(/^@?\s*IntRange \(from = \d+, to = \d+\) \w+\s*/, "").replace(/^(Instant|Int|Long|Double)\s*/, "").trim();
      description = s || null;
    }
    return { name, type, description };
  });
  const updated = /Last updated (\d{4}-\d{2}-\d{2})/.exec(t)?.[1] ?? null;
  return { params: out, updated };
}

const appleText = (inline) => (inline ?? []).map((x) => x.text ?? x.code ?? "").join("");
async function appleJson(path) {
  const url = `${APPLE}/${path}.json`;
  const d = JSON.parse(await get(url, path.replace(/[^a-z0-9]+/gi, "_") + ".json"));
  return { d, url, docUrl: `${APPLE_DOC}/${path}` };
}

const hrSampleHtml = await get(`${JETPACK}/HeartRateRecord.Sample?hl=en`, "hc-heart-rate-sample.html");
const stageHtml = await get(`${JETPACK}/SleepSessionRecord.Stage?hl=en`, "hc-sleep-stage.html");
const HR_SAMPLE = jetpackClass(hrSampleHtml, "Sample", `${JETPACK}/HeartRateRecord.Sample`);
const STAGE = jetpackClass(stageHtml, "Stage", `${JETPACK}/SleepSessionRecord.Stage`);
for (const n of ["time", "beatsPerMinute"]) if (!HR_SAMPLE.params.some((p) => p.name === n)) fail(`HeartRateRecord.Sample has no ${n}`);
for (const n of ["startTime", "endTime", "stage"]) if (!STAGE.params.some((p) => p.name === n)) fail(`SleepSessionRecord.Stage has no ${n}`);

const A = {
  sleepEnum: await appleJson("hkcategoryvaluesleepanalysis"),
  asleep: await appleJson("hkcategoryvaluesleepanalysis/asleep"),
  percent: await appleJson("hkunit/percent()"),
  startDate: await appleJson("hksample/startdate"),
  endDate: await appleJson("hksample/enddate"),
  quantity: await appleJson("hkquantitysample/quantity"),
  categoryValue: await appleJson("hkcategorysample/value"),
  workoutActivityType: await appleJson("hkworkout/workoutactivitytype"),
  totalEnergyBurned: await appleJson("hkworkout/totalenergyburned"),
  totalDistance: await appleJson("hkworkout/totaldistance"),
};
const abstractOf = (a) => appleText(a.d.abstract) || fail(`${a.url}: no abstract`);
const PERCENT_SENTENCE = (() => {
  const paras = (a) => (a.d.primaryContentSections ?? []).flatMap((s) => (s.content ?? []).filter((c) => c.type === "paragraph").map((c) => appleText(c.inlineContent)));
  const s = paras(A.percent).find((p) => /0\.0 and 1\.0/.test(p));
  if (!s) fail("HKUnit.percent() no longer says 0.0 and 1.0");
  return s.split(/(?<=\.)\s+/)[0];
})();
const deprecationOf = (a) => {
  const p = (a.d.metadata.platforms ?? []).find((x) => x.name === "iOS");
  return p?.deprecatedAt ? { deprecatedAt: p.deprecatedAt, message: p.message ?? null } : null;
};

/** HKCategoryValueSleepAnalysis: Swift case, Objective-C name, abstract, deprecated. */
// The cases are the identifiers Apple lists under its "Values …" topic
// sections (the deprecated one is a static var, under "Deprecated values").
const SLEEP_VALUE_IDS = (A.sleepEnum.d.topicSections ?? []).filter((s) => /values/i.test(s.title ?? "")).flatMap((s) => s.identifiers);
const HK_SLEEP_VALUES = SLEEP_VALUE_IDS.map((id) => A.sleepEnum.d.references[id] ?? fail(`${id} has no reference entry`))
  .map((r) => ({
    case: r.identifier.split("/").pop(),
    objc: appleText(r.navigatorTitle) || null,
    abstract: appleText(r.abstract),
    deprecated: Boolean(r.deprecated),
    url: `https://developer.apple.com${r.url}`,
  }));
if (HK_SLEEP_VALUES.length < 7) fail(`HKCategoryValueSleepAnalysis: ${HK_SLEEP_VALUES.length} cases, expected 7`);
const asleepRenamed = (A.asleep.d.metadata.platforms ?? []).find((p) => p.name === "iOS")?.renamed ?? null;
if (asleepRenamed !== "HKCategoryValueSleepAnalysis.asleepUnspecified") fail(`asleep's rename is now ${asleepRenamed}`);

// ── Lookup helpers: each returns a mapping cell or fails ─────────────────
const hkSlug = (c) => c.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
function hkType(c) {
  const i = HK.find((x) => x.case === c && x.family !== "workoutActivity");
  if (!i) fail(`HealthKit ${c} not in the dataset`);
  if (i.deprecated) fail(`HealthKit ${c} is deprecated`);
  return i;
}
function hcRecord(name) {
  return HC.find((r) => r.className === name) ?? fail(`Health Connect ${name} not in the dataset`);
}
function hcProp(rec, name) {
  return rec.properties.find((p) => p.name === name) ?? fail(`${rec.className}.${name} not in the dataset`);
}
function gType(id) {
  const t = G_TYPES.find((x) => x.dataType === id) ?? fail(`Google Health API ${id} not in the dataset`);
  if (!t.schema) fail(`${id} has no schema`);
  return t;
}
function gField(schemaId, name) {
  const s = G_SCHEMAS[schemaId] ?? fail(`schema ${schemaId} missing`);
  return s.fields.find((f) => f.name === name) ?? fail(`${schemaId}.${name} missing`);
}
function hsType(name) {
  return HS.find((x) => x.name === name) ?? fail(`Health Services ${name} not in the dataset`);
}
/** Sentences from the Google Health API pages (migration guide etc.). */
const G_SENTENCES = (() => {
  const out = [];
  const walk = (blocks, page) => {
    for (const b of blocks ?? []) {
      if (typeof b.text === "string") out.push({ page, text: b.text });
      if (Array.isArray(b.items)) for (const it of b.items) out.push({ page, text: typeof it === "string" ? it : it.text ?? "" });
      if (Array.isArray(b.rows)) for (const row of b.rows) for (const c of row) if (typeof c === "string") out.push({ page, text: c });
    }
  };
  for (const [key, p] of Object.entries(G_PAGES)) {
    walk(p.intro, key);
    for (const s of p.sections ?? []) walk(s.blocks, key);
  }
  return out;
})();
const gSourceUrl = (key) => G_SOURCES.find((s) => s.key === key)?.url ?? fail(`GHAPI source ${key} missing`);
function gSentence(re) {
  const hit = G_SENTENCES.find((s) => re.test(s.text));
  if (!hit) fail(`no Google Health API sentence matches ${re}`);
  return { quote: hit.text, url: gSourceUrl(hit.page) };
}

const ev = (quote, url) => ({ quote, url });
const mapped = (o) => ({ status: "mapped", conversion: null, factor: null, ...o });
const notMapped = (reason, extra = {}) => ({ status: "not-mapped", type: null, field: null, platformType: null, conversion: null, factor: null, evidence: null, reason, ...extra });

// Conversion facts, each tied to its sentence.
const G_GRAMS_TO_KG = gSentence(/weightGrams.*divide by 1,000\).*453\.59237/);
const G_MM_TO_M = gSentence(/heightMillimeters.*meters \(divide by 1,000\).*25\.4/);
const LB_GRAMS = Number(/divide by ([\d.]+)\)\.?$/.exec(G_GRAMS_TO_KG.quote)?.[1]);
const IN_MM = Number(/inches \(divide by ([\d.]+)\)/.exec(G_MM_TO_M.quote)?.[1]);
if (LB_GRAMS !== 453.59237 || IN_MM !== 25.4) fail(`unit sentences changed: lb=${LB_GRAMS} g, in=${IN_MM} mm`);
const G_LB_APPROX = G_SENTENCES.find((s) => /pounds to kilograms, divide by 2\.2/.test(s.text)) ?? null;

// ── Time fields ──────────────────────────────────────────────────────────
const SAMPLE_TIME = [
  { name: "time", type: "string", format: "date-time", required: true, description: "The instant of the reading, RFC 3339 in UTC (a trailing Z)." },
  { name: "utcOffset", type: ["string", "null"], pattern: "^[+-]\\d{2}:\\d{2}$", required: false, description: "The user's UTC offset at that instant as ±HH:MM; null when the source does not carry one." },
];
const INTERVAL_TIME = [
  { name: "startTime", type: "string", format: "date-time", required: true, description: "Start of the interval, RFC 3339 in UTC." },
  { name: "endTime", type: "string", format: "date-time", required: true, description: "End of the interval, RFC 3339 in UTC." },
  { name: "startUtcOffset", type: ["string", "null"], pattern: "^[+-]\\d{2}:\\d{2}$", required: false, description: "UTC offset at the start as ±HH:MM; null when unknown." },
  { name: "endUtcOffset", type: ["string", "null"], pattern: "^[+-]\\d{2}:\\d{2}$", required: false, description: "UTC offset at the end as ±HH:MM; null when unknown." },
];

const HK_EXPORT_NOTE =
  "Apple does not publish export.xml's element and attribute names; the converter reads the attribute names the file itself carries (startDate, endDate, value, unit), whose dates include the device's UTC offset.";

function hkTime(shape) {
  const start = mapped({ type: "HKSample", field: "startDate", platformType: "Date", evidence: ev(abstractOf(A.startDate), A.startDate.docUrl) });
  const end = mapped({ type: "HKSample", field: "endDate", platformType: "Date", evidence: ev(abstractOf(A.endDate), A.endDate.docUrl) });
  const offset = notMapped("HealthKit samples carry no UTC offset field. An export.xml date includes the offset (the converter reads it); in the API, the optional HKMetadataKeyTimeZone metadata is a zone name, not an offset.");
  return shape === "sample"
    ? { time: { ...start, conversion: "a sample at one moment has startDate equal to endDate" }, utcOffset: offset }
    : { startTime: start, endTime: end, startUtcOffset: offset, endUtcOffset: offset };
}
function hcTime(rec) {
  const p = (n) => {
    const q = hcProp(rec, n);
    return mapped({ type: rec.className, field: n, platformType: q.type, evidence: ev(q.description, rec.sourceUrl) });
  };
  if (rec.recordShape === "Instantaneous") return { time: p("time"), utcOffset: { ...p("zoneOffset"), conversion: "ZoneOffset → ±HH:MM; null stays null" } };
  return {
    startTime: p("startTime"),
    endTime: p("endTime"),
    startUtcOffset: { ...p("startZoneOffset"), conversion: "ZoneOffset → ±HH:MM; null stays null" },
    endUtcOffset: { ...p("endZoneOffset"), conversion: "ZoneOffset → ±HH:MM; null stays null" },
  };
}
function gTime(t, timeFieldName) {
  const tf = gField(t.schema.id, timeFieldName);
  const ts = tf.ref ?? fail(`${t.schema.id}.${timeFieldName} has no ref`);
  const f = (n) => {
    const x = gField(ts, n);
    return mapped({ type: t.dataType, field: `${t.dataPointProperty}.${timeFieldName}.${n}`, platformType: x.type, evidence: ev(x.description, t.referenceUrl) });
  };
  const dur = "google-duration seconds (\"3600s\") → ±HH:MM";
  if (ts === "ObservationSampleTime") return { time: f("physicalTime"), utcOffset: { ...f("utcOffset"), conversion: dur } };
  return { startTime: f("startTime"), endTime: f("endTime"), startUtcOffset: { ...f("startUtcOffset"), conversion: dur }, endUtcOffset: { ...f("endUtcOffset"), conversion: dur } };
}
function hsTime(shape) {
  const why = "Health Services DataPoint time fields are not in this site's Health Services dataset, and Health Services has no JSON form to convert.";
  return shape === "sample" ? { time: notMapped(why), utcOffset: notMapped(why) } : { startTime: notMapped(why), endTime: notMapped(why), startUtcOffset: notMapped(why), endUtcOffset: notMapped(why) };
}
/** No Health Services constant's description mentions any of these words. */
function hsAbsent(words, what) {
  const hits = HS.filter((t) => words.some((w) => new RegExp(`\\b${w}\\b`, "i").test(`${t.name} ${t.description ?? ""}`)));
  if (hits.length) fail(`Health Services ${hits.map((h) => h.name).join(", ")} mention ${words.join("/")}: map it or change the reason`);
  return `None of the ${HS.length} Health Services DataType constants (Jetpack reference, read ${HS_FETCHED_ON}) has a name or description mentioning ${words.map((w) => `“${w}”`).join(" or ")}: no ${what} type to map.`;
}

// ── HealthKit quantity value cell ────────────────────────────────────────
function hkQuantity(c, unified, extra = {}) {
  const i = hkType(c);
  return {
    type: mapped({ type: `HKQuantityTypeIdentifier.${i.case}`, field: null, platformType: i.objc, evidence: ev(i.abstract, i.docUrl), href: `/healthkit-identifiers/${hkSlug(i.case)}` }),
    value: mapped({
      type: `HKQuantityTypeIdentifier.${i.case}`,
      field: "quantity",
      platformType: `HKQuantity (${i.unitFamily} unit family)`,
      evidence: ev(i.aggregationEvidence, i.docUrl),
      conversion: `read with doubleValue(for:) in ${unified}`,
      ...extra,
    }),
    objc: i.objc,
  };
}

// ── The records ──────────────────────────────────────────────────────────
const records = [];

/* Heart rate */
{
  const hk = hkQuantity("heartRate", "count/min");
  const hcRec = hcRecord("HeartRateRecord");
  const hcSamples = hcProp(hcRec, "samples");
  const bpm = HR_SAMPLE.params.find((p) => p.name === "beatsPerMinute");
  const sTime = HR_SAMPLE.params.find((p) => p.name === "time");
  const g = gType("heart-rate");
  const gb = gField(g.schema.id, "beatsPerMinute");
  const hs = hsType("HEART_RATE_BPM");
  const hcSampleUrl = `${JETPACK}/HeartRateRecord.Sample`;
  records.push({
    id: "heartRate",
    title: "Heart rate sample",
    shape: "sample",
    description: "One heart-rate reading at one instant, in beats per minute.",
    valueFields: [{ name: "beatsPerMinute", type: "number", unit: "count/min", minimum: 0, required: true, description: "Heart beats per minute." }],
    platforms: {
      healthkit: { type: hk.type, fields: { ...hkTime("sample"), beatsPerMinute: hk.value } },
      "health-connect": {
        type: mapped({ type: "HeartRateRecord", field: null, platformType: hcRec.recordShape, evidence: ev(hcRec.description[0], hcRec.sourceUrl), href: `/health-connect/${hcRec.slug}`, conversion: "one record holds a series: each element of samples becomes one unified sample" }),
        fields: {
          time: mapped({ type: "HeartRateRecord.Sample", field: "samples[].time", platformType: sTime.type, evidence: ev(sTime.description, hcSampleUrl) }),
          utcOffset: { ...hcTime(hcRec).startUtcOffset, conversion: "the record's startZoneOffset, applied to every sample (a Sample has no offset of its own)" },
          beatsPerMinute: mapped({ type: "HeartRateRecord.Sample", field: "samples[].beatsPerMinute", platformType: bpm.type, evidence: ev(bpm.description, hcSampleUrl) }),
        },
        container: { field: "samples", platformType: hcSamples.type },
      },
      "google-health-api": {
        type: mapped({ type: g.dataType, field: g.dataPointProperty, platformType: g.recordType, evidence: ev(G_SCHEMAS[g.schema.id].description, g.referenceUrl), href: `/google-health-api/${g.dataType}` }),
        fields: { ...gTime(g, "sampleTime"), beatsPerMinute: mapped({ type: g.dataType, field: "heartRate.beatsPerMinute", platformType: gb.type, evidence: ev(gb.description, g.referenceUrl), conversion: "int64 arrives as a JSON string: parse to a number" }) },
      },
      "wear-os": {
        type: mapped({ type: `DataType.${hs.name}`, field: null, platformType: hs.kotlinType, evidence: ev(hs.description, hs.docUrl), href: `/wear-os-data-types/${hs.name.toLowerCase().replace(/_/g, "-")}` }),
        fields: { ...hsTime("sample"), beatsPerMinute: mapped({ type: `DataType.${hs.name}`, field: "SampleDataPoint.value", platformType: hs.valueType, evidence: ev(hs.description, hs.docUrl) }) },
      },
    },
    notes: [],
  });
}

/* Steps */
{
  const hk = hkQuantity("stepCount", "count");
  const hcRec = hcRecord("StepsRecord");
  const hcCount = hcProp(hcRec, "count");
  const g = gType("steps");
  const gc = gField(g.schema.id, "count");
  const hs = hsType("STEPS");
  records.push({
    id: "steps",
    title: "Step count over an interval",
    shape: "interval",
    description: "The number of steps taken between two instants.",
    valueFields: [{ name: "count", type: "integer", unit: "count", minimum: 0, required: true, description: "Steps in the interval." }],
    platforms: {
      healthkit: { type: hk.type, fields: { ...hkTime("interval"), count: hk.value } },
      "health-connect": {
        type: mapped({ type: "StepsRecord", field: null, platformType: hcRec.recordShape, evidence: ev(hcRec.description[0], hcRec.sourceUrl), href: `/health-connect/${hcRec.slug}` }),
        fields: { ...hcTime(hcRec), count: mapped({ type: "StepsRecord", field: "count", platformType: hcCount.type, evidence: ev(hcCount.description, hcRec.sourceUrl) }) },
      },
      "google-health-api": {
        type: mapped({ type: g.dataType, field: g.dataPointProperty, platformType: g.recordType, evidence: ev(G_SCHEMAS[g.schema.id].description, g.referenceUrl), href: `/google-health-api/${g.dataType}` }),
        fields: { ...gTime(g, "interval"), count: mapped({ type: g.dataType, field: "steps.count", platformType: gc.type, evidence: ev(gc.description, g.referenceUrl), conversion: "int64 arrives as a JSON string: parse to an integer" }) },
      },
      "wear-os": {
        type: mapped({ type: `DataType.${hs.name}`, field: null, platformType: hs.kotlinType, evidence: ev(hs.description, hs.docUrl), href: `/wear-os-data-types/${hs.name.toLowerCase().replace(/_/g, "-")}` }),
        fields: { ...hsTime("interval"), count: mapped({ type: `DataType.${hs.name}`, field: "IntervalDataPoint.value", platformType: hs.valueType, evidence: ev(hs.description, hs.docUrl) }) },
      },
    },
    notes: [`Google prints different lower bounds: Health Connect's count is “${hcCount.rangeStatement ?? hcCount.description}”, the Google Health API's “${gc.description}” A zero-step interval converts to the unified shape, but cannot be written back to Health Connect.`],
  });
}

/* Sleep */
const STAGES = ["awake", "awakeInBed", "outOfBed", "inBed", "asleep", "light", "deep", "rem", "restless", "unknown"];
let sleepMaps;
{
  const hcRec = hcRecord("SleepSessionRecord");
  const hcStages = hcProp(hcRec, "stages");
  const g = gType("sleep");
  const gStages = gField(g.schema.id, "stages");
  const gStageType = gField(gStages.itemsRef ?? "SleepStage", "type");
  const stageUrl = `${JETPACK}/SleepSessionRecord.Stage`;
  const hkV = (c) => HK_SLEEP_VALUES.find((v) => v.case === c) ?? fail(`HKCategoryValueSleepAnalysis.${c} missing`);
  const hcC = (n) => hcRec.constants.find((k) => k.name === n) ?? fail(`SleepSessionRecord.${n} missing`);
  const gE = (v) => gStageType.enum?.find((e) => e.value === v) ?? fail(`SleepStage.type ${v} missing`);
  const row = (unified, platformValue, evidence, url, note = null) => ({ unified, value: platformValue, evidence, url, note });
  sleepMaps = {
    healthkit: [
      row("inBed", hkV("inBed").objc, hkV("inBed").abstract, hkV("inBed").url),
      row("awake", hkV("awake").objc, hkV("awake").abstract, hkV("awake").url),
      row("light", hkV("asleepCore").objc, hkV("asleepCore").abstract, hkV("asleepCore").url, "Apple's core stage is “light or intermediate”; the unified vocabulary has no intermediate stage, so it lands on light."),
      row("deep", hkV("asleepDeep").objc, hkV("asleepDeep").abstract, hkV("asleepDeep").url),
      row("rem", hkV("asleepREM").objc, hkV("asleepREM").abstract, hkV("asleepREM").url),
      row("asleep", hkV("asleepUnspecified").objc, hkV("asleepUnspecified").abstract, hkV("asleepUnspecified").url),
      row("asleep", hkV("asleep").objc, hkV("asleep").abstract, hkV("asleep").url, `Deprecated in iOS 16.0; Apple's availability data names ${asleepRenamed} as its new name.`),
    ].map((r) => ({ ...r, value: r.value ?? fail("a sleep value lacks its Objective-C name") })),
    "health-connect": [
      row("unknown", Number(hcC("STAGE_TYPE_UNKNOWN").value), hcC("STAGE_TYPE_UNKNOWN").description, hcRec.sourceUrl),
      row("awake", Number(hcC("STAGE_TYPE_AWAKE").value), hcC("STAGE_TYPE_AWAKE").description, hcRec.sourceUrl),
      row("asleep", Number(hcC("STAGE_TYPE_SLEEPING").value), hcC("STAGE_TYPE_SLEEPING").description, hcRec.sourceUrl),
      row("outOfBed", Number(hcC("STAGE_TYPE_OUT_OF_BED").value), hcC("STAGE_TYPE_OUT_OF_BED").description, hcRec.sourceUrl),
      row("light", Number(hcC("STAGE_TYPE_LIGHT").value), hcC("STAGE_TYPE_LIGHT").description, hcRec.sourceUrl),
      row("deep", Number(hcC("STAGE_TYPE_DEEP").value), hcC("STAGE_TYPE_DEEP").description, hcRec.sourceUrl),
      row("rem", Number(hcC("STAGE_TYPE_REM").value), hcC("STAGE_TYPE_REM").description, hcRec.sourceUrl),
      row("awakeInBed", Number(hcC("STAGE_TYPE_AWAKE_IN_BED").value), hcC("STAGE_TYPE_AWAKE_IN_BED").description, hcRec.sourceUrl),
    ].map((r) => ({ ...r, name: hcRec.constants.find((k) => Number(k.value) === r.value).name })),
    "google-health-api": [
      row("unknown", "SLEEP_STAGE_TYPE_UNSPECIFIED", gE("SLEEP_STAGE_TYPE_UNSPECIFIED").description, g.referenceUrl),
      row("awake", "AWAKE", gE("AWAKE").description, g.referenceUrl),
      row("light", "LIGHT", gE("LIGHT").description, g.referenceUrl),
      row("deep", "DEEP", gE("DEEP").description, g.referenceUrl),
      row("rem", "REM", gE("REM").description, g.referenceUrl),
      row("asleep", "ASLEEP", gE("ASLEEP").description, g.referenceUrl),
      row("restless", "RESTLESS", gE("RESTLESS").description, g.referenceUrl),
    ],
  };
  // Every platform value must be covered exactly once.
  if (sleepMaps["health-connect"].length !== hcRec.constants.filter((k) => k.name.startsWith("STAGE_TYPE_")).length) fail("a Health Connect STAGE_TYPE_ constant is unmapped");
  if (sleepMaps["google-health-api"].length !== gStageType.enum.length) fail("a Google SleepStage.type value is unmapped");
  if (sleepMaps.healthkit.length !== HK_SLEEP_VALUES.length) fail("an HKCategoryValueSleepAnalysis case is unmapped");
  for (const list of Object.values(sleepMaps)) for (const r of list) if (!STAGES.includes(r.unified)) fail(`stage ${r.unified} not in the vocabulary`);

  const hkCat = HK.find((x) => x.case === "sleepAnalysis") ?? fail("sleepAnalysis missing");
  const st = (n) => STAGE.params.find((p) => p.name === n);
  records.push({
    id: "sleepSession",
    title: "Sleep session with stages",
    shape: "session",
    description: "One sleep period and the stages inside it, each stage an interval with one value from the unified stage vocabulary.",
    valueFields: [
      {
        name: "stages",
        type: "array",
        required: true,
        description: "Non-overlapping stage intervals inside the session; empty when the source has none.",
        items: {
          startTime: { type: "string", format: "date-time" },
          endTime: { type: "string", format: "date-time" },
          stage: { type: "string", enum: STAGES },
        },
      },
    ],
    platforms: {
      healthkit: {
        type: mapped({ type: "HKCategoryTypeIdentifier.sleepAnalysis", field: null, platformType: hkCat.objc, evidence: ev(hkCat.abstract, hkCat.docUrl), href: `/healthkit-identifiers/${hkSlug(hkCat.case)}`, conversion: "HealthKit writes one category sample per stage: the converter groups the samples you paste into one session, from the earliest start to the latest end" }),
        fields: {
          ...hkTime("interval"),
          stages: mapped({ type: "HKCategorySample", field: "value (HKCategoryValueSleepAnalysis)", platformType: "Int", evidence: ev(abstractOf(A.categoryValue), A.categoryValue.docUrl), conversion: "each sample's startDate, endDate and value become one stage" }),
        },
      },
      "health-connect": {
        type: mapped({ type: "SleepSessionRecord", field: null, platformType: hcRec.recordShape, evidence: ev(hcRec.description[0], hcRec.sourceUrl), href: `/health-connect/${hcRec.slug}` }),
        fields: {
          ...hcTime(hcRec),
          stages: mapped({ type: "SleepSessionRecord.Stage", field: "stages[].startTime, stages[].endTime, stages[].stage", platformType: `${hcStages.type}; stage: ${st("stage").type}`, evidence: ev(STAGE.params.map((p) => `${p.name}: ${p.type}`).join(", "), stageUrl), conversion: "stage Int → the unified vocabulary (table below)" }),
        },
      },
      "google-health-api": {
        type: mapped({ type: g.dataType, field: g.dataPointProperty, platformType: g.recordType, evidence: ev(G_SCHEMAS[g.schema.id].description, g.referenceUrl), href: `/google-health-api/${g.dataType}` }),
        fields: {
          ...gTime(g, "interval"),
          stages: mapped({ type: g.dataType, field: "sleep.stages[] (startTime, endTime, type)", platformType: gStages.type, evidence: ev(gStages.description, g.referenceUrl), conversion: "type string → the unified vocabulary (table below); outOfBedSegments are not read" }),
        },
      },
      "wear-os": { type: notMapped(hsAbsent(["sleep"], "sleep")), fields: { ...hsTime("interval"), stages: notMapped("No sleep type in Health Services.") } },
    },
    notes: [
      "Stage vocabularies differ: Health Connect separates awake from awake-in-bed and out-of-bed, the Google Health API adds restless, and Apple's core stage is “light or intermediate”. The unified vocabulary keeps every distinction any source makes, so a conversion never merges two source values — except Apple's core into light, stated in the table.",
    ],
  });
}

/* Workout */
let workoutLookups;
{
  const hcRec = hcRecord("ExerciseSessionRecord");
  const et = hcProp(hcRec, "exerciseType");
  const g = gType("exercise");
  const get = gField(g.schema.id, "exerciseType");
  const ms = gField(g.schema.id, "metricsSummary");
  const kcal = gField(ms.ref ?? "MetricsSummary", "caloriesKcal");
  const dist = gField(ms.ref ?? "MetricsSummary", "distanceMillimeters");
  const shared = new Set(WT_CROSSWALK.map((r) => r.key));
  workoutLookups = {
    normalisation: WT_NORMALISATION,
    healthkit: Object.fromEntries(WT_HK.map((w) => [w.objc, w.key])),
    "health-connect": Object.fromEntries(WT_HC.map((w) => [String(w.value), { name: w.name, key: w.key }])),
    "google-health-api": Object.fromEntries(WT_G.map((w) => [w.value, w.key])),
    "wear-os": Object.fromEntries(WT_HS.map((w) => [w.name, w.key])),
    shared: [...shared].sort(),
  };
  const teb = deprecationOf(A.totalEnergyBurned);
  const td = deprecationOf(A.totalDistance);
  if (!teb || !td) fail("HKWorkout totalEnergyBurned / totalDistance are no longer deprecated: revisit the mapping");
  const hcNoTotals = ["energy", "totalEnergyBurned", "distance"].filter((n) => hcRec.properties.some((p) => p.name === n));
  if (hcNoTotals.length) fail(`ExerciseSessionRecord now has ${hcNoTotals.join(", ")}: map it`);
  records.push({
    id: "workout",
    title: "Workout session",
    shape: "session",
    description: "One exercise session: when it ran, what it was, and the totals where the source states them.",
    valueFields: [
      { name: "activityType", type: ["string", "null"], required: true, description: `The activity as this site's workout crosswalk key (${WT_NORMALISATION.replace(/\.$/, "")}). null when the source value is not in the crosswalk data.` },
      { name: "nativeActivityType", type: "string", required: true, description: "The source's own activity value, unchanged (an Objective-C constant, an Int as text, or an enum string)." },
      { name: "energyKcal", type: ["number", "null"], unit: "kcal", minimum: 0, required: false, description: "Total energy for the session in kilocalories; null when the source carries none." },
      { name: "distanceMeters", type: ["number", "null"], unit: "m", minimum: 0, required: false, description: "Total distance in meters; null when the source carries none." },
    ],
    platforms: {
      healthkit: {
        type: mapped({ type: "HKWorkout", field: null, platformType: "HKWorkout", evidence: ev(abstractOf(A.workoutActivityType), A.workoutActivityType.docUrl), href: "/workout-types" }),
        fields: {
          ...hkTime("interval"),
          activityType: mapped({ type: "HKWorkout", field: "workoutActivityType", platformType: "HKWorkoutActivityType", evidence: ev(abstractOf(A.workoutActivityType), A.workoutActivityType.docUrl), conversion: "Objective-C constant → crosswalk key" }),
          nativeActivityType: mapped({ type: "HKWorkout", field: "workoutActivityType", platformType: "HKWorkoutActivityType", evidence: ev(abstractOf(A.workoutActivityType), A.workoutActivityType.docUrl) }),
          energyKcal: notMapped(`HKWorkout.totalEnergyBurned is deprecated as of iOS ${teb.deprecatedAt} (Apple: “${teb.message}”); per-type statistics are not in this site's datasets, so the converter does not read energy from HealthKit.`),
          distanceMeters: notMapped(`HKWorkout.totalDistance is deprecated as of iOS ${td.deprecatedAt} (Apple: “${td.message}”); not read.`),
        },
      },
      "health-connect": {
        type: mapped({ type: "ExerciseSessionRecord", field: null, platformType: hcRec.recordShape, evidence: ev(hcRec.description[0], hcRec.sourceUrl), href: `/health-connect/${hcRec.slug}` }),
        fields: {
          ...hcTime(hcRec),
          activityType: mapped({ type: "ExerciseSessionRecord", field: "exerciseType", platformType: et.type, evidence: ev(et.description, hcRec.sourceUrl), conversion: "Int value → EXERCISE_TYPE_ constant → crosswalk key" }),
          nativeActivityType: mapped({ type: "ExerciseSessionRecord", field: "exerciseType", platformType: et.type, evidence: ev(et.description, hcRec.sourceUrl) }),
          energyKcal: notMapped("ExerciseSessionRecord has no energy property: Health Connect stores it as separate calories records over the same interval."),
          distanceMeters: notMapped("ExerciseSessionRecord has no distance property: Health Connect stores it as separate DistanceRecord records."),
        },
      },
      "google-health-api": {
        type: mapped({ type: g.dataType, field: g.dataPointProperty, platformType: g.recordType, evidence: ev(G_SCHEMAS[g.schema.id].description, g.referenceUrl), href: `/google-health-api/${g.dataType}` }),
        fields: {
          ...gTime(g, "interval"),
          activityType: mapped({ type: g.dataType, field: "exercise.exerciseType", platformType: get.type, evidence: ev(get.description, g.referenceUrl), conversion: "enum string → crosswalk key" }),
          nativeActivityType: mapped({ type: g.dataType, field: "exercise.exerciseType", platformType: get.type, evidence: ev(get.description, g.referenceUrl) }),
          energyKcal: mapped({ type: g.dataType, field: "exercise.metricsSummary.caloriesKcal", platformType: kcal.type, evidence: ev(kcal.description, g.referenceUrl) }),
          distanceMeters: mapped({ type: g.dataType, field: "exercise.metricsSummary.distanceMillimeters", platformType: dist.type, evidence: ev(dist.description, g.referenceUrl), conversion: "÷ 1,000 (the field name states millimeters)", factor: 0.001 }),
        },
      },
      "wear-os": {
        type: mapped({ type: "ExerciseType", field: null, platformType: "ExerciseType", evidence: ev(`ExerciseType objects, each with an int id and a name, on the Jetpack ExerciseType class`, "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType"), href: "/workout-types" }),
        fields: {
          ...hsTime("interval"),
          activityType: mapped({ type: "ExerciseType", field: "name", platformType: "String", evidence: ev(`${WT_HS.length} ExerciseType constants read from the androidx source on ${WT_FETCHED_ON}`, "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType"), conversion: "constant name → crosswalk key" }),
          nativeActivityType: mapped({ type: "ExerciseType", field: "name", platformType: "String", evidence: null }),
          energyKcal: notMapped("Exercise totals in Health Services arrive as DataType values during the exercise (CALORIES_TOTAL and similar), not on a session object; not mapped here."),
          distanceMeters: notMapped("As for energy: DISTANCE_TOTAL-style values arrive during the exercise; not mapped here."),
        },
      },
    },
    notes: [
      `activityType uses the workout crosswalk's key (${workoutLookups.shared.length} keys are shared by two or more platforms). A key shared by name is not a claim that two platforms mean the same activity; /workout-types shows each platform's own description.`,
    ],
  });
}

/* Body mass */
{
  const hk = hkQuantity("bodyMass", "kg");
  const hcRec = hcRecord("WeightRecord");
  const w = hcProp(hcRec, "weight");
  const g = gType("weight");
  const gw = gField(g.schema.id, "weightGrams");
  records.push({
    id: "bodyMass",
    title: "Body mass (weight)",
    shape: "sample",
    description: "The user's weight at one instant, in kilograms.",
    valueFields: [{ name: "kilograms", type: "number", unit: "kg", minimum: 0, required: true, description: "Body mass in kilograms." }],
    platforms: {
      healthkit: { type: hk.type, fields: { ...hkTime("sample"), kilograms: hk.value } },
      "health-connect": {
        type: mapped({ type: "WeightRecord", field: null, platformType: hcRec.recordShape, evidence: ev(hcRec.description[0] ?? w.description, hcRec.sourceUrl), href: `/health-connect/${hcRec.slug}` }),
        fields: { ...hcTime(hcRec), kilograms: mapped({ type: "WeightRecord", field: "weight", platformType: w.type, evidence: ev(w.description, hcRec.sourceUrl), conversion: "Mass → kilograms (inKilograms)" }) },
      },
      "google-health-api": {
        type: mapped({ type: g.dataType, field: g.dataPointProperty, platformType: g.recordType, evidence: ev(G_SCHEMAS[g.schema.id].description, g.referenceUrl), href: `/google-health-api/${g.dataType}` }),
        fields: { ...gTime(g, "sampleTime"), kilograms: mapped({ type: g.dataType, field: "weight.weightGrams", platformType: gw.type, evidence: ev(G_GRAMS_TO_KG.quote, G_GRAMS_TO_KG.url), conversion: "÷ 1,000", factor: 0.001 }) },
      },
      "wear-os": { type: notMapped(hsAbsent(["weight", "body mass"], "body-mass")), fields: { ...hsTime("sample"), kilograms: notMapped("No body-mass type in Health Services.") } },
    },
    notes: G_LB_APPROX
      ? [`Pounds: Google's migration guide divides grams by 453.59237 (“${G_GRAMS_TO_KG.quote}”), and elsewhere says “${G_LB_APPROX.text}” The converter uses 453.59237 g per pound.`]
      : [],
  });
}

/* Body fat */
{
  const hk = hkQuantity("bodyFatPercentage", "percent (0–100)", { conversion: `× 100 (Apple: “${PERCENT_SENTENCE}”)`, factor: 100, evidence: ev(PERCENT_SENTENCE, A.percent.docUrl) });
  const hcRec = hcRecord("BodyFatRecord");
  const p = hcProp(hcRec, "percentage");
  const g = gType("body-fat");
  const gp = gField(g.schema.id, "percentage");
  records.push({
    id: "bodyFat",
    title: "Body fat percentage",
    shape: "sample",
    description: "Body fat as a percentage from 0 to 100.",
    valueFields: [{ name: "percent", type: "number", unit: "%", minimum: 0, maximum: 100, required: true, description: "Body fat, 0–100." }],
    platforms: {
      healthkit: { type: hk.type, fields: { ...hkTime("sample"), percent: hk.value } },
      "health-connect": {
        type: mapped({ type: "BodyFatRecord", field: null, platformType: hcRec.recordShape, evidence: ev(hcRec.description[0] ?? p.description, hcRec.sourceUrl), href: `/health-connect/${hcRec.slug}` }),
        fields: { ...hcTime(hcRec), percent: mapped({ type: "BodyFatRecord", field: "percentage", platformType: p.type, evidence: ev(p.description, hcRec.sourceUrl) }) },
      },
      "google-health-api": {
        type: mapped({ type: g.dataType, field: g.dataPointProperty, platformType: g.recordType, evidence: ev(G_SCHEMAS[g.schema.id].description, g.referenceUrl), href: `/google-health-api/${g.dataType}` }),
        fields: { ...gTime(g, "sampleTime"), percent: mapped({ type: g.dataType, field: "bodyFat.percentage", platformType: gp.type, evidence: ev(gp.description, g.referenceUrl) }) },
      },
      "wear-os": { type: notMapped(hsAbsent(["fat"], "body-fat")), fields: { ...hsTime("sample"), percent: notMapped("No body-fat type in Health Services.") } },
    },
    notes: ["HealthKit's percent unit is a fraction (0.0–1.0); Health Connect and the Google Health API state 0–100. Mixing them is the classic 0.23-percent body-fat bug."],
  });
}

/* Height */
{
  const hk = hkQuantity("height", "m");
  const hcRec = hcRecord("HeightRecord");
  const h = hcProp(hcRec, "height");
  const g = gType("height");
  const gh = gField(g.schema.id, "heightMillimeters");
  records.push({
    id: "height",
    title: "Height",
    shape: "sample",
    description: "The user's height at one instant, in meters.",
    valueFields: [{ name: "meters", type: "number", unit: "m", minimum: 0, required: true, description: "Height in meters." }],
    platforms: {
      healthkit: { type: hk.type, fields: { ...hkTime("sample"), meters: hk.value } },
      "health-connect": {
        type: mapped({ type: "HeightRecord", field: null, platformType: hcRec.recordShape, evidence: ev(hcRec.description[0] ?? h.description, hcRec.sourceUrl), href: `/health-connect/${hcRec.slug}` }),
        fields: { ...hcTime(hcRec), meters: mapped({ type: "HeightRecord", field: "height", platformType: h.type, evidence: ev(h.description, hcRec.sourceUrl), conversion: "Length → meters (inMeters)" }) },
      },
      "google-health-api": {
        type: mapped({ type: g.dataType, field: g.dataPointProperty, platformType: g.recordType, evidence: ev(G_SCHEMAS[g.schema.id].description, g.referenceUrl), href: `/google-health-api/${g.dataType}` }),
        fields: { ...gTime(g, "sampleTime"), meters: mapped({ type: g.dataType, field: "height.heightMillimeters", platformType: gh.type, evidence: ev(G_MM_TO_M.quote, G_MM_TO_M.url), conversion: "÷ 1,000 (int64 arrives as a JSON string)", factor: 0.001 }) },
      },
      "wear-os": { type: notMapped(hsAbsent(["height"], "height")), fields: { ...hsTime("sample"), meters: notMapped("No height type in Health Services.") } },
    },
    notes: [],
  });
}

/* HRV */
{
  const hkI = hkType("heartRateVariabilitySDNN");
  const hcRec = hcRecord("HeartRateVariabilityRmssdRecord");
  const hcV = hcProp(hcRec, "heartRateVariabilityMillis");
  const g = gType("heart-rate-variability");
  const gr = gField(g.schema.id, "rootMeanSquareOfSuccessiveDifferencesMilliseconds");
  const gsd = gField(g.schema.id, "standardDeviationMilliseconds");
  records.push({
    id: "heartRateVariability",
    title: "Heart rate variability",
    shape: "sample",
    description: "One HRV reading in milliseconds, tagged with the statistic it is. SDNN and RMSSD are different measures and never convert into each other.",
    valueFields: [
      { name: "metric", type: "string", enum: ["sdnn", "rmssd"], required: true, description: "sdnn: standard deviation of heartbeat intervals. rmssd: root mean square of successive differences." },
      { name: "milliseconds", type: "number", unit: "ms", minimum: 0, required: true, description: "The value in milliseconds." },
    ],
    platforms: {
      healthkit: {
        type: mapped({ type: `HKQuantityTypeIdentifier.${hkI.case}`, field: null, platformType: hkI.objc, evidence: ev(hkI.abstract, hkI.docUrl), href: `/healthkit-identifiers/${hkSlug(hkI.case)}` }),
        fields: {
          ...hkTime("sample"),
          metric: mapped({ type: `HKQuantityTypeIdentifier.${hkI.case}`, field: "(the type)", platformType: "sdnn", evidence: ev(hkI.abstract, hkI.docUrl), conversion: "always sdnn" }),
          milliseconds: mapped({ type: `HKQuantityTypeIdentifier.${hkI.case}`, field: "quantity", platformType: `HKQuantity (${hkI.unitFamily} unit family)`, evidence: ev(hkI.aggregationEvidence, hkI.docUrl), conversion: "read with doubleValue(for:) in ms" }),
        },
      },
      "health-connect": {
        type: mapped({ type: "HeartRateVariabilityRmssdRecord", field: null, platformType: hcRec.recordShape, evidence: ev(hcRec.description[0] ?? hcV.description, hcRec.sourceUrl), href: `/health-connect/${hcRec.slug}` }),
        fields: {
          ...hcTime(hcRec),
          metric: mapped({ type: "HeartRateVariabilityRmssdRecord", field: "(the record class)", platformType: "rmssd", evidence: ev(hcRec.description[0] ?? hcV.description, hcRec.sourceUrl), conversion: "always rmssd" }),
          milliseconds: mapped({ type: "HeartRateVariabilityRmssdRecord", field: "heartRateVariabilityMillis", platformType: hcV.type, evidence: ev(hcV.description, hcRec.sourceUrl) }),
        },
      },
      "google-health-api": {
        type: mapped({ type: g.dataType, field: g.dataPointProperty, platformType: g.recordType, evidence: ev(G_SCHEMAS[g.schema.id].description, g.referenceUrl), href: `/google-health-api/${g.dataType}` }),
        fields: {
          ...gTime(g, "sampleTime"),
          metric: mapped({ type: g.dataType, field: "heartRateVariability.rootMeanSquareOfSuccessiveDifferencesMilliseconds", platformType: "rmssd", evidence: ev(gr.description, g.referenceUrl), conversion: "rmssd when this field is present" }),
          milliseconds: mapped({ type: g.dataType, field: "heartRateVariability.rootMeanSquareOfSuccessiveDifferencesMilliseconds", platformType: gr.type, evidence: ev(gr.description, g.referenceUrl) }),
        },
        unmappedFields: [{ field: "heartRateVariability.standardDeviationMilliseconds", reason: `Not mapped to sdnn. Google describes it as “${gsd.description}” — the deviation of the measurement, not of the heartbeat intervals — so calling it SDNN would be a guess.` }],
      },
      "wear-os": { type: notMapped(hsAbsent(["variability"], "heart-rate-variability")), fields: { ...hsTime("sample"), metric: notMapped("No HRV type in Health Services."), milliseconds: notMapped("No HRV type in Health Services.") } },
    },
    notes: ["HealthKit publishes SDNN; Health Connect and the Google Health API publish RMSSD. A pipeline that stores both in one column without the metric tag mixes two different numbers."],
  });
}

/* SpO2 */
{
  const hk = hkQuantity("oxygenSaturation", "percent (0–100)", { conversion: `× 100 (Apple: “${PERCENT_SENTENCE}”)`, factor: 100, evidence: ev(PERCENT_SENTENCE, A.percent.docUrl) });
  const hcRec = hcRecord("OxygenSaturationRecord");
  const p = hcProp(hcRec, "percentage");
  const g = gType("oxygen-saturation");
  const gp = gField(g.schema.id, "percentage");
  records.push({
    id: "oxygenSaturation",
    title: "Blood oxygen saturation (SpO2)",
    shape: "sample",
    description: "One SpO2 reading as a percentage from 0 to 100.",
    valueFields: [{ name: "percent", type: "number", unit: "%", minimum: 0, maximum: 100, required: true, description: "Oxygen saturation, 0–100." }],
    platforms: {
      healthkit: { type: hk.type, fields: { ...hkTime("sample"), percent: hk.value } },
      "health-connect": {
        type: mapped({ type: "OxygenSaturationRecord", field: null, platformType: hcRec.recordShape, evidence: ev(hcRec.description[0] ?? p.description, hcRec.sourceUrl), href: `/health-connect/${hcRec.slug}` }),
        fields: { ...hcTime(hcRec), percent: mapped({ type: "OxygenSaturationRecord", field: "percentage", platformType: p.type, evidence: ev(p.description, hcRec.sourceUrl) }) },
      },
      "google-health-api": {
        type: mapped({ type: g.dataType, field: g.dataPointProperty, platformType: g.recordType, evidence: ev(G_SCHEMAS[g.schema.id].description, g.referenceUrl), href: `/google-health-api/${g.dataType}` }),
        fields: { ...gTime(g, "sampleTime"), percent: mapped({ type: g.dataType, field: "oxygenSaturation.percentage", platformType: gp.type, evidence: ev(gp.description, g.referenceUrl) }) },
      },
      "wear-os": { type: notMapped(hsAbsent(["spo2", "saturation"], "oxygen-saturation")), fields: { ...hsTime("sample"), percent: notMapped("No SpO2 type in Health Services.") } },
    },
    notes: [],
  });
}

for (const r of records) for (const [pl, m] of Object.entries(r.platforms)) for (const [f, cell] of Object.entries(m.fields)) {
  if (cell.status === "mapped" && pl !== "wear-os" && !cell.evidence?.quote && f !== "nativeActivityType") fail(`${r.id}.${f} on ${pl}: mapped without evidence`);
  if (cell.status === "not-mapped" && !cell.reason) fail(`${r.id}.${f} on ${pl}: not mapped without a reason`);
}

// ── HealthKit lookups for the converter ──────────────────────────────────
const HK_TYPE_RECORD = {
  HKQuantityTypeIdentifierHeartRate: "heartRate",
  HKQuantityTypeIdentifierStepCount: "steps",
  HKQuantityTypeIdentifierBodyMass: "bodyMass",
  HKQuantityTypeIdentifierBodyFatPercentage: "bodyFat",
  HKQuantityTypeIdentifierHeight: "height",
  HKQuantityTypeIdentifierHeartRateVariabilitySDNN: "heartRateVariability",
  HKQuantityTypeIdentifierOxygenSaturation: "oxygenSaturation",
  HKCategoryTypeIdentifierSleepAnalysis: "sleepSession",
};
for (const objc of Object.keys(HK_TYPE_RECORD)) if (!HK.some((i) => i.objc === objc)) fail(`${objc} not in the HealthKit dataset`);
const HC_CLASS_RECORD = {
  HeartRateRecord: "heartRate",
  StepsRecord: "steps",
  SleepSessionRecord: "sleepSession",
  ExerciseSessionRecord: "workout",
  WeightRecord: "bodyMass",
  BodyFatRecord: "bodyFat",
  HeightRecord: "height",
  HeartRateVariabilityRmssdRecord: "heartRateVariability",
  OxygenSaturationRecord: "oxygenSaturation",
};
const G_PROPERTY_RECORD = Object.fromEntries(
  [
    ["heart-rate", "heartRate"],
    ["steps", "steps"],
    ["sleep", "sleepSession"],
    ["exercise", "workout"],
    ["weight", "bodyMass"],
    ["body-fat", "bodyFat"],
    ["height", "height"],
    ["heart-rate-variability", "heartRateVariability"],
    ["oxygen-saturation", "oxygenSaturation"],
  ].map(([id, rec]) => [gType(id).dataPointProperty ?? fail(`${id} has no DataPoint property`), rec]),
);

const units = {
  // Factors to the unified unit. SI prefixes, and the two Google states.
  mass: { kg: 1, g: 0.001, mg: 0.000001, lb: LB_GRAMS / 1000, kilograms: 1, grams: 0.001, pounds: LB_GRAMS / 1000 },
  length: { m: 1, cm: 0.01, mm: 0.001, km: 1000, in: IN_MM / 1000, meters: 1, centimeters: 0.01, millimeters: 0.001, inches: IN_MM / 1000 },
  time: { ms: 1, s: 1000 },
  rate: { "count/min": 1 },
  count: { count: 1 },
  percent: { "%": 100 },
  unitEvidence: {
    lb: G_GRAMS_TO_KG,
    in: G_MM_TO_M,
    percent: { quote: PERCENT_SENTENCE, url: A.percent.docUrl },
  },
};

// ── JSON Schema ──────────────────────────────────────────────────────────
const PLATFORMS = ["healthkit", "health-connect", "google-health-api", "wear-os"];
function propSchema(f) {
  const s = {};
  if (f.type === "array") {
    s.type = "array";
    s.items = { type: "object", additionalProperties: false, required: Object.keys(f.items), properties: f.items };
  } else s.type = f.type;
  if (f.format) s.format = f.format;
  if (f.pattern) s.pattern = f.pattern;
  if (f.enum) s.enum = f.enum;
  if (f.minimum !== undefined) s.minimum = f.minimum;
  if (f.maximum !== undefined) s.maximum = f.maximum;
  if (f.unit) s["x-unit"] = f.unit;
  s.description = f.description;
  return s;
}
const defName = (id) => id.charAt(0).toUpperCase() + id.slice(1);
const defs = {
  Source: {
    type: "object",
    additionalProperties: false,
    required: ["platform", "nativeType"],
    properties: {
      platform: { type: "string", enum: PLATFORMS, description: "Where the record came from." },
      nativeType: { type: "string", description: "The source's own type name (an HK identifier, a Health Connect class, a Google Health API data type)." },
      sourceName: { type: ["string", "null"], description: "The app or device that wrote it, when the source says." },
    },
  },
};
for (const r of records) {
  const time = r.shape === "sample" ? SAMPLE_TIME : INTERVAL_TIME;
  const fields = [...time, ...r.valueFields];
  defs[defName(r.id)] = {
    type: "object",
    title: r.title,
    description: r.description,
    additionalProperties: false,
    required: ["type", "source", ...fields.filter((f) => f.required).map((f) => f.name)],
    properties: {
      type: { const: r.id },
      source: { $ref: "#/$defs/Source" },
      ...Object.fromEntries(fields.map((f) => [f.name, propSchema(f)])),
    },
  };
}
const jsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: SCHEMA_ID,
  title: "Unified health-data record (aifitnessapi.com, v1)",
  description: `A vendor-neutral shape for ${records.length} common health records, each field mapped to HealthKit, Health Connect, the Google Health API and Wear OS Health Services at ${SITE}/schema. Version ${VERSION}. License: CC BY 4.0 (attribution: aifitnessapi.com).`,
  "x-version": VERSION,
  "x-license": "CC-BY-4.0",
  oneOf: records.map((r) => ({ $ref: `#/$defs/${defName(r.id)}` })),
  $defs: defs,
};

// ── TypeScript types ─────────────────────────────────────────────────────
const tsType = (f) => {
  const one = (t) => (t === "integer" ? "number" : t);
  if (f.type === "array") return `Array<{ startTime: string; endTime: string; stage: UnifiedSleepStage }>`;
  if (f.enum) return f.enum.map((e) => JSON.stringify(e)).join(" | ");
  return Array.isArray(f.type) ? f.type.map(one).join(" | ") : one(f.type);
};
const dts = [
  `/**`,
  ` * Unified health-data record types, v${VERSION} — generated by scripts/build-unified-schema.mjs.`,
  ` * Schema: ${SCHEMA_ID}`,
  ` * Mappings to HealthKit, Health Connect, the Google Health API and Wear OS: ${SITE}/schema`,
  ` * License: CC BY 4.0 (attribution: aifitnessapi.com).`,
  ` */`,
  ``,
  `export type UnifiedPlatform = ${PLATFORMS.map((p) => JSON.stringify(p)).join(" | ")};`,
  `export type UnifiedSleepStage = ${STAGES.map((s) => JSON.stringify(s)).join(" | ")};`,
  ``,
  `export interface UnifiedSource {`,
  `  platform: UnifiedPlatform;`,
  `  nativeType: string;`,
  `  sourceName?: string | null;`,
  `}`,
  ``,
];
for (const r of records) {
  const time = r.shape === "sample" ? SAMPLE_TIME : INTERVAL_TIME;
  dts.push(`/** ${r.title}. ${r.description} */`, `export interface ${defName(r.id)} {`, `  type: ${JSON.stringify(r.id)};`, `  source: UnifiedSource;`);
  for (const f of [...time, ...r.valueFields]) {
    dts.push(`  /** ${f.description}${f.unit ? ` Unit: ${f.unit}.` : ""} */`, `  ${f.name}${f.required ? "" : "?"}: ${tsType(f)};`);
  }
  dts.push(`}`, ``);
}
dts.push(`export type UnifiedRecord = ${records.map((r) => defName(r.id)).join(" | ")};`, ``);

// ── Outputs ──────────────────────────────────────────────────────────────
const sources = {
  healthkit: { name: "Apple HealthKit", dataset: "src/data/healthkitIdentifiers.ts", readOn: HK_FETCHED_ON },
  "health-connect": { name: "Android Health Connect", dataset: "src/data/healthConnectRecords.ts", readOn: HC_FETCHED_ON },
  "google-health-api": { name: "Google Health API", dataset: "src/data/googleHealthApi.ts", readOn: GHAPI_FETCHED_ON },
  "wear-os": { name: "Wear OS Health Services", dataset: "src/data/healthServicesDataTypes.ts", readOn: HS_FETCHED_ON },
  workouts: { name: "Workout activity-type crosswalk", dataset: "src/data/workoutTypes.ts", readOn: WT_FETCHED_ON },
};
for (const u of fetched) if (!meta[u]) meta[u] = today;
writeFileSync(metaPath, JSON.stringify(meta, null, 2));
const pageReads = [...new Set(fetched)].map((url) => ({ url: url.replace(/\?hl=en$/, ""), readOn: meta[url] }));
const readOn = [...Object.values(sources).map((s) => s.readOn), ...pageReads.map((p) => p.readOn)].sort().pop();

const mappingsDoc = {
  $comment: `Generated by scripts/build-unified-schema.mjs. Mappings for ${SCHEMA_ID}. CC BY 4.0 (attribution: aifitnessapi.com); vendor sentences quoted as evidence remain their publishers'.`,
  version: VERSION,
  schema: SCHEMA_ID,
  readOn,
  platforms: PLATFORMS,
  sources,
  pageReads,
  stages: STAGES,
  records,
  sleepStageMaps: sleepMaps,
  converter: {
    healthkitTypes: HK_TYPE_RECORD,
    healthConnectClasses: HC_CLASS_RECORD,
    googleProperties: G_PROPERTY_RECORD,
    workouts: workoutLookups,
    units,
    healthkitExportNote: HK_EXPORT_NOTE,
  },
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "unified-health-data.schema.json"), JSON.stringify(jsonSchema, null, 2) + "\n");
writeFileSync(join(OUT_DIR, "unified-health-data.d.ts"), dts.join("\n"));
writeFileSync(join(OUT_DIR, "mappings.json"), JSON.stringify(mappingsDoc, null, 1) + "\n");

const ts = `// GENERATED by scripts/build-unified-schema.mjs — do not edit by hand.
// The unified health-data schema v${VERSION}: records, per-platform mappings with
// evidence, and the converter's lookups. Also published as
// public/schema/${MAJOR}/{unified-health-data.schema.json,unified-health-data.d.ts,mappings.json}.

export type UsPlatform = "healthkit" | "health-connect" | "google-health-api" | "wear-os";
export type UsEvidence = { quote: string; url: string } | null;
export type UsCell = {
  status: "mapped" | "not-mapped";
  type: string | null;
  field: string | null;
  platformType: string | null;
  conversion: string | null;
  factor: number | null;
  evidence: UsEvidence;
  reason?: string | null;
  href?: string;
};
export type UsValueField = {
  name: string;
  type: string | string[];
  unit?: string;
  minimum?: number;
  maximum?: number;
  enum?: string[];
  required: boolean;
  description: string;
  items?: Record<string, unknown>;
};
export type UsPlatformMapping = {
  type: UsCell;
  fields: Record<string, UsCell>;
  container?: { field: string; platformType: string };
  unmappedFields?: { field: string; reason: string }[];
};
export type UsRecord = {
  id: string;
  title: string;
  shape: "sample" | "interval" | "session";
  description: string;
  valueFields: UsValueField[];
  platforms: Record<UsPlatform, UsPlatformMapping>;
  notes: string[];
};
export type UsStageRow = { unified: string; value: string | number; evidence: string; url: string; note: string | null; name?: string };

export const UNIFIED_SCHEMA_VERSION = ${JSON.stringify(VERSION)};
export const UNIFIED_SCHEMA_ID = ${JSON.stringify(SCHEMA_ID)};
export const UNIFIED_SCHEMA_FILES = ${JSON.stringify({ schema: `/schema/${MAJOR}/unified-health-data.schema.json`, types: `/schema/${MAJOR}/unified-health-data.d.ts`, mappings: `/schema/${MAJOR}/mappings.json` })};
/** The newest read date among the inputs. */
export const UNIFIED_READ_ON = ${JSON.stringify(readOn)};
export const UNIFIED_SOURCES = ${JSON.stringify(sources, null, 2)};
export const UNIFIED_PAGE_READS: { url: string; readOn: string }[] = ${JSON.stringify(pageReads, null, 2)};
export const UNIFIED_TIME_FIELDS = ${JSON.stringify({ sample: SAMPLE_TIME, interval: INTERVAL_TIME }, null, 2)};
export const UNIFIED_STAGES: string[] = ${JSON.stringify(STAGES)};
export const UNIFIED_RECORDS: UsRecord[] = ${JSON.stringify(records, null, 1)};
export const UNIFIED_SLEEP_STAGE_MAPS: Record<"healthkit" | "health-connect" | "google-health-api", UsStageRow[]> = ${JSON.stringify(sleepMaps, null, 1)};
/** The converter's lookups (src/lib/unifiedConvert.mjs). */
export const UNIFIED_CONVERTER = ${JSON.stringify(mappingsDoc.converter)};
`;
writeFileSync(OUT_TS, ts);
console.log(`build-unified-schema: ${records.length} records, ${STAGES.length} sleep stages, ${Object.keys(workoutLookups.healthkit).length + Object.keys(workoutLookups["health-connect"]).length + Object.keys(workoutLookups["google-health-api"]).length + Object.keys(workoutLookups["wear-os"]).length} workout lookups → ${OUT_TS}, ${OUT_DIR}/`);
