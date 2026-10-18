#!/usr/bin/env node
/**
 * Regenerate src/data/workoutTypes.ts — the four workout-type enumerations a
 * developer has to map when moving workouts between platforms, each copied
 * from its own source, and the crosswalk between them:
 *
 *   Apple HealthKit           HKWorkoutActivityType. The 84 cases, abstracts,
 *                             groups, availability and deprecation notes come
 *                             from src/data/healthkitIdentifiers.ts (Apple's
 *                             docs JSON, read by its own generator); this
 *                             script adds what that module does not keep —
 *                             Apple's discussion paragraphs, read from each
 *                             case's own JSON — and re-reads Apple's
 *                             HKWorkoutActivityType index to check the case
 *                             list has not moved.
 *   Android Health Connect    ExerciseSessionRecord.EXERCISE_TYPE_* from the
 *                             Jetpack reference (names, values, Google's
 *                             description); the platform API's
 *                             ExerciseSessionType reference (its own values,
 *                             descriptions and API level); and, from the
 *                             androidx source the references link as "View
 *                             Source", the constant list (a cross-check), the
 *                             Jetpack-to-platform mapping (IntDefMappings.kt)
 *                             and the table behind
 *                             ExerciseSegment.isSegmentTypeCompatibleWithSessionType
 *                             (ExerciseSegment.kt).
 *   Wear OS Health Services   ExerciseType from the Jetpack reference (Java
 *                             and Kotlin pages: names, Google's descriptions)
 *                             and the androidx ExerciseType.kt source, which
 *                             is where Google prints each constant's id.
 *   Google Health API         Exercise.exerciseType from
 *                             src/data/googleHealthApi.ts (the v4 discovery
 *                             document, read by its own generator).
 *
 * No model in this loop. Names, values and descriptions are copied exactly.
 * The crosswalk joins constants in exactly two ways, kept apart:
 *
 *   stated  a mapping a fetched source states between two of the four
 *           enumerations, with the source and the row it came from. The pages
 *           read on the last run state none; WT_MAPPING_SEARCH lists them,
 *           and the script refuses to write when one of them grows a table
 *           row or list item naming constants of two enumerations, so a
 *           mapping Google or Apple publishes later is read by a person
 *           instead of being missed.
 *   name    name identity after one normalisation: remove a leading
 *           EXERCISE_TYPE_ (Health Connect's constant prefix, also on the
 *           Google Health API's EXERCISE_TYPE_UNSPECIFIED), lowercase, and
 *           remove every character outside a-z and 0-9. HealthKit's cycling
 *           and Health Connect's EXERCISE_TYPE_BIKING are different names,
 *           so they stay apart; nothing is joined by meaning.
 *
 * Where two sources disagree — a reference and the source it links, a guide
 * and the reference, a module read on an earlier date and today's page, a
 * guide's sample and the API it calls, or a description that reads like the
 * constant before it — the disagreement is published as a flag with the
 * texts concerned, never resolved here. A short parse,
 * a count that differs from the last verified read, or a normalisation
 * that would put two constants of one platform on the same row makes the
 * script refuse to write.
 *
 * Usage: NODE_USE_ENV_PROXY=1 node scripts/fetch-workout-types.mjs [--offline]
 *   --offline reparses the cache in .cache/workout-types without refetching.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const CACHE = ".cache/workout-types";
const META = join(CACHE, "meta.json");
const OUT = "src/data/workoutTypes.ts";
const OFFLINE = process.argv.includes("--offline");

const HK_MODULE = "src/data/healthkitIdentifiers.ts";
const GHAPI_MODULE = "src/data/googleHealthApi.ts";
const HC_MODULE = "src/data/healthConnectRecords.ts";

const APPLE_DATA = "https://developer.apple.com/tutorials/data/documentation/healthkit";
const APPLE_DOCS = "https://developer.apple.com/documentation/healthkit";
const ANDROID = "https://developer.android.com";

const devsite = (path, origin = ANDROID) => ({ kind: "devsite", url: `${origin}${path}?hl=en`, page: `${origin}${path}`, repo: null, branch: null, path: null });
const androidx = (path) => ({
  kind: "github",
  url: `https://raw.githubusercontent.com/androidx/androidx/androidx-main/${path}`,
  page: `https://github.com/androidx/androidx/blob/androidx-main/${path}`,
  repo: "androidx/androidx",
  branch: "androidx-main",
  path,
});
const apple = (path) => ({ kind: "apple", url: `${APPLE_DATA}/${path}.json`, page: `${APPLE_DOCS}/${path}`, repo: null, branch: null, path: null });

const HC_RECORDS = "health/connect/connect-client/src/main/java/androidx/health/connect/client";

/**
 * Every page this generator reads itself. `role` says why: a platform's list
 * or a cross-check of it ("list"), a fact the pages quote ("fact"), or a page
 * read while looking for a published mapping between the enumerations
 * ("search"). Apple's per-case JSON documents are read in addition, one per
 * HealthKit case.
 */
const SOURCES = {
  hkIndex: { ...apple("hkworkoutactivitytype"), title: "HKWorkoutActivityType", platform: "healthkit", role: "list" },
  hcSessionRef: { ...devsite("/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord"), title: "ExerciseSessionRecord (Jetpack reference)", platform: "health-connect", role: "list" },
  hcSegmentRef: { ...devsite("/reference/kotlin/androidx/health/connect/client/records/ExerciseSegment"), title: "ExerciseSegment (Jetpack reference)", platform: "health-connect", role: "fact" },
  hcPlatformRef: { ...devsite("/reference/android/health/connect/datatypes/ExerciseSessionType"), title: "ExerciseSessionType (Android platform reference)", platform: "health-connect", role: "list" },
  hcSessionSrc: { ...androidx(`${HC_RECORDS}/records/ExerciseSessionRecord.kt`), title: "ExerciseSessionRecord.kt (androidx source)", platform: "health-connect", role: "list" },
  hcSegmentSrc: { ...androidx(`${HC_RECORDS}/records/ExerciseSegment.kt`), title: "ExerciseSegment.kt (androidx source)", platform: "health-connect", role: "fact" },
  hcMappingSrc: { ...androidx(`${HC_RECORDS}/impl/platform/records/IntDefMappings.kt`), title: "IntDefMappings.kt (androidx source)", platform: "health-connect", role: "fact" },
  hsJavaRef: { ...devsite("/reference/androidx/health/services/client/data/ExerciseType"), title: "ExerciseType (Jetpack reference, Java)", platform: "wear-os", role: "list" },
  hsKotlinRef: { ...devsite("/reference/kotlin/androidx/health/services/client/data/ExerciseType"), title: "ExerciseType (Jetpack reference, Kotlin)", platform: "wear-os", role: "list" },
  hsSrc: { ...androidx("health/health-services-client/src/main/java/androidx/health/services/client/data/ExerciseType.kt"), title: "ExerciseType.kt (androidx source)", platform: "wear-os", role: "list" },
  hsExerciseGuide: { ...devsite("/health-and-fitness/health-services/active-data"), title: "Record an exercise with ExerciseClient", platform: "wear-os", role: "fact" },
  hcDataTypesGuide: { ...devsite("/health-and-fitness/health-connect/data-types"), title: "Health Connect data types", platform: "health-connect", role: "list", search: true },
  searchHcWorkouts: { ...devsite("/health-and-fitness/health-connect/experiences/workouts"), title: "Develop Workout Experiences with Health Connect", platform: null, role: "search", search: true },
  searchHcRoutes: { ...devsite("/health-and-fitness/health-connect/features/exercise-routes"), title: "Add exercise routes (Health Connect)", platform: null, role: "search", search: true },
  searchHcPlans: { ...devsite("/health-and-fitness/health-connect/features/training-plans"), title: "Training plans (Health Connect)", platform: null, role: "search", search: true },
  searchFitMigration: { ...devsite("/health-and-fitness/health-connect/migration/fit"), title: "Fit migration guide", platform: null, role: "search", search: true },
  searchHsOverview: { ...devsite("/health-and-fitness/health-services"), title: "Health Services on Wear OS", platform: null, role: "search", search: true },
  searchWearModule: { ...devsite("/health-and-fitness/fitness/basic-app/integrate-wear-os"), title: "Integrate a Wear OS module", platform: null, role: "search", search: true },
  searchGhapiWorkouts: { ...devsite("/health/data-types/workouts", "https://developers.google.com"), title: "Develop Workout Experiences with Google Health API", platform: null, role: "search", search: true },
};

/**
 * Counts of the last verified read (2026-10-18). Exact in both directions: a
 * different count is either a changed enumeration, which a person should
 * read before it is published, or a parse that went wrong. Change a number
 * only after reading the source and confirming the enumeration changed.
 */
const EXPECTED = {
  healthkit: 84, // HKWorkoutActivityType cases in healthkitIdentifiers.ts and Apple's index
  healthConnect: 61, // ExerciseSessionRecord.EXERCISE_TYPE_* on the Jetpack reference
  healthConnectPlatform: 62, // ExerciseSessionType.EXERCISE_SESSION_TYPE_* on the platform reference, deprecated ones included
  healthConnectSegments: 68, // ExerciseSegment.EXERCISE_SEGMENT_TYPE_* on the Jetpack reference
  healthConnectGuide: 62, // names under "Exercise types" on Google's Health Connect data-types guide
  wearOs: 85, // public ExerciseType constants on the Jetpack reference
  wearOsSource: 93, // ExerciseType(...) declarations in ExerciseType.kt, public and internal
  googleHealthApi: 182, // Exercise.exerciseType enum values in the v4 discovery document
};

mkdirSync(CACHE, { recursive: true });
const meta = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};
const problems = [];
const flags = [];
const sha256 = (s) => createHash("sha256").update(s).digest("hex");
const today = () => new Date().toISOString().slice(0, 10);

function trimDevsite(html) {
  const a = html.indexOf("<article");
  const footEnd = html.indexOf("</devsite-content-footer>");
  if (a < 0 || footEnd < 0) return html;
  return html.slice(a, footEnd + "</devsite-content-footer>".length);
}

async function fetchText(url, kind) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "aifitnessapi-generator (+https://aifitnessapi.com)" },
      });
      if (!res.ok) throw new Error(`${res.status} for ${url}`);
      const raw = await res.text();
      let text = raw;
      if (kind === "devsite") {
        text = trimDevsite(raw);
        if (/devsite-banner-translated/.test(text)) throw new Error(`translated page served for ${url}`);
      }
      if (kind === "apple") JSON.parse(text);
      await new Promise((r) => setTimeout(r, 150));
      return { text, hash: sha256(raw) };
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

/** Read one listed source (cached), recording when and what was read. */
async function read(id) {
  const src = SOURCES[id];
  const file = join(CACHE, `${id}.txt`);
  if (existsSync(file)) return readFileSync(file, "utf8");
  if (OFFLINE) throw new Error(`offline and ${file} is not cached`);
  const { text, hash } = await fetchText(src.url, src.kind);
  writeFileSync(file, text);
  meta[id] = { url: src.url, fetchedOn: today(), sha256: hash };
  writeFileSync(META, JSON.stringify(meta, null, 2));
  return text;
}

/** Apple's JSON for one HKWorkoutActivityType case (cached). */
async function readAppleCase(caseName) {
  const id = `hkCase-${caseName}`;
  const file = join(CACHE, `${id}.json`);
  const url = `${APPLE_DATA}/hkworkoutactivitytype/${caseName.toLowerCase()}.json`;
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  if (OFFLINE) throw new Error(`offline and ${file} is not cached`);
  const { text, hash } = await fetchText(url, "apple");
  writeFileSync(file, text);
  meta[id] = { url, fetchedOn: today(), sha256: hash };
  writeFileSync(META, JSON.stringify(meta, null, 2));
  return JSON.parse(text);
}

// ── Text helpers ───────────────────────────────────────────────────────────

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}
const squash = (s) => s.replace(/\s+/g, " ").trim();
/** HTML to text, with <code> runs kept as `code` so the pages can render them. */
const textOf = (html) =>
  squash(
    decodeEntities(
      html
        .replace(/<code[^>]*>([\s\S]*?)<\/code>/g, (_, c) => "`" + c.replace(/<[^>]+>/g, "") + "`")
        .replace(/<[^>]+>/g, " "),
    ),
  )
    .replace(/\s+([.,;:)])/g, "$1")
    .replace(/\(\s+/g, "(");
const googleLastUpdated = (html) => /Last updated (\d{4}-\d{2}-\d{2}) UTC/.exec(html)?.[1] ?? null;
/** Kotlin source with the block and line comments removed. */
const uncomment = (code) => code.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");

/** The crosswalk key: drop a leading EXERCISE_TYPE_, lowercase, keep only a-z0-9. */
const keyOf = (name) => name.replace(/^EXERCISE_TYPE_/, "").toLowerCase().replace(/[^a-z0-9]/g, "");
/** URL slug for a crosswalk row, from one spelling: camelCase and SNAKE_CASE to kebab-case. */
const slugOf = (name) =>
  name
    .replace(/^EXERCISE_TYPE_/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();

/** Find `needle` (string or RegExp) in `text`; record a problem when it is absent. */
function evidence(text, needle, what) {
  const hay = squash(text);
  if (typeof needle === "string") {
    if (hay.includes(squash(needle))) return squash(needle);
  } else {
    const m = needle.exec(hay);
    if (m) return m[0];
  }
  problems.push(`${what}: evidence ${needle} not found in the source`);
  return null;
}

function flag(kind, platform, subject, summary, ev) {
  flags.push({ kind, platform, subject, summary, evidence: ev.filter((e) => e && e.text) });
}

/** A JSON literal exported by a generated module (`export const NAME: T = <json>;`). */
function moduleLiteral(src, file, name) {
  const m = new RegExp(`export const ${name}: [^=]+= `).exec(src);
  if (!m) {
    problems.push(`${file}: no export ${name}`);
    return null;
  }
  const start = m.index + m[0].length;
  const close = src[start] === "{" ? "\n};" : "\n];";
  const end = src.indexOf(close, start);
  try {
    return JSON.parse(src.slice(start, end + 2));
  } catch (e) {
    problems.push(`${file}: ${name} is not parseable JSON (${e.message})`);
    return null;
  }
}
const moduleString = (src, name) => new RegExp(`export const ${name}\\s*=\\s*"([^"]*)"`).exec(src)?.[1] ?? null;

/** The (...) body that opens at `open` (an index of "("), quotes respected. */
function parenBody(s, open) {
  let depth = 0;
  let q = null;
  for (let i = open; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === "\\") i++;
      else if (c === q) q = null;
      continue;
    }
    if (c === '"') q = c;
    else if (c === "(" || c === "{") depth++;
    else if ((c === ")" || c === "}") && --depth === 0) return s.slice(open + 1, i);
  }
  return null;
}
/** Split a Kotlin argument list at its top-level commas. */
function topLevelSplit(body) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const c of body) {
    if (c === "(" || c === "{") depth++;
    if (c === ")" || c === "}") depth--;
    if (c === "," && depth === 0) {
      if (cur.trim()) out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// ── Read everything ────────────────────────────────────────────────────────
const T = {};
for (const id of Object.keys(SOURCES)) T[id] = await read(id);
const hkIndex = JSON.parse(T.hkIndex);

const hkModuleSrc = readFileSync(HK_MODULE, "utf8");
const ghModuleSrc = readFileSync(GHAPI_MODULE, "utf8");
const hcModuleSrc = readFileSync(HC_MODULE, "utf8");
const HK_MODULE_FETCHED = moduleString(hkModuleSrc, "HK_FETCHED_ON");
const GHAPI_MODULE_FETCHED = moduleString(ghModuleSrc, "GHAPI_FETCHED_ON");
const HC_MODULE_FETCHED = moduleString(hcModuleSrc, "HC_FETCHED_ON");

// ── 1. HealthKit ───────────────────────────────────────────────────────────
/** Apple inline content to text: references resolved to their titles, code kept as `code`. */
function appleInline(nodes, refs) {
  let out = "";
  for (const n of nodes ?? []) {
    if (!n || typeof n !== "object") continue;
    if (n.type === "text") out += n.text ?? "";
    else if (n.type === "codeVoice") out += "`" + (n.code ?? "") + "`";
    else if (n.type === "reference") out += "`" + (refs?.[n.identifier]?.title ?? String(n.identifier).split("/").pop()) + "`";
    else if (n.type === "emphasis" || n.type === "strong") out += appleInline(n.inlineContent, refs);
    else if (n.inlineContent) out += appleInline(n.inlineContent, refs);
  }
  return out;
}
/** Every paragraph of an Apple page's content sections, in order (lists and asides included). */
function appleParagraphs(doc) {
  const refs = doc.references ?? {};
  const out = [];
  const walk = (nodes) => {
    for (const node of nodes ?? []) {
      if (node.type === "paragraph") {
        const t = squash(appleInline(node.inlineContent, refs));
        if (t) out.push(t);
      } else if (node.type === "aside" || node.type === "unorderedList" || node.type === "orderedList") {
        walk(node.content ?? node.items?.flatMap((i) => i.content ?? []) ?? []);
      } else if (node.items) walk(node.items.flatMap((i) => i.content ?? []));
    }
  };
  for (const sec of doc.primaryContentSections ?? []) if (sec.kind === "content") walk(sec.content);
  return out;
}
const appleAbstract = (doc) => squash(appleInline(doc.abstract, doc.references));

const hkModuleRows = (moduleLiteral(hkModuleSrc, HK_MODULE, "HK_IDENTIFIERS") ?? []).filter((r) => r.family === "workoutActivity");
// How Apple declares the type itself, in Swift and in the Objective-C variant.
const hkTypeDecl = (() => {
  const swift = (hkIndex.primaryContentSections ?? []).filter((x) => x.kind === "declarations").flatMap((x) => x.declarations ?? []).map((d) => (d.tokens ?? []).map((t) => t.text).join(""));
  const objc = (hkIndex.variantOverrides ?? []).flatMap((v) => v.patch ?? []).filter((x) => x.path === "/primaryContentSections/0").flatMap((x) => x.value?.declarations ?? []).map((d) => (d.tokens ?? []).map((t) => t.text).join(""));
  if (!swift[0] || !objc[0]) problems.push("healthkit: Apple's HKWorkoutActivityType page carries no Swift or Objective-C declaration");
  return { swift: swift[0] ?? null, objc: objc[0] ?? null, abstract: appleAbstract(hkIndex) || null };
})();
// Apple's index: every case it files under a topic, and the group it files it under.
const hkIndexCases = new Map();
for (const sec of hkIndex.topicSections ?? []) {
  if (sec.title === "Initializers") continue;
  for (const id of sec.identifiers ?? []) {
    if (!id.includes("/HKWorkoutActivityType/")) continue;
    const name = id.split("/").pop();
    if (name === "init(rawValue:)") continue;
    if (!hkIndexCases.has(name)) hkIndexCases.set(name, { group: sec.title, abstract: squash(appleInline(hkIndex.references?.[id]?.abstract, hkIndex.references)) });
  }
}
for (const name of hkIndexCases.keys()) {
  if (!hkModuleRows.some((r) => r.case === name)) {
    flag("new-in-source", "healthkit", name, `Apple's HKWorkoutActivityType index lists ${name}, which ${HK_MODULE} (read ${HK_MODULE_FETCHED}) does not have; regenerate it with node scripts/fetch-healthkit-identifiers.mjs.`, [
      { sourceId: "hkIndex", text: `${name} — filed under "${hkIndexCases.get(name).group}"` },
    ]);
  }
}
const healthkit = [];
for (const r of [...hkModuleRows].sort((a, b) => a.case.localeCompare(b.case))) {
  const doc = await readAppleCase(r.case);
  const abstract = appleAbstract(doc);
  const discussion = appleParagraphs(doc);
  const idx = hkIndexCases.get(r.case);
  if (!idx) {
    flag("missing-in-source", "healthkit", r.case, `${HK_MODULE} (read ${HK_MODULE_FETCHED}) lists ${r.case}, but Apple's HKWorkoutActivityType index read on ${meta.hkIndex?.fetchedOn} does not file it under any topic.`, [
      { sourceId: "hkModule", text: r.abstract },
    ]);
  } else if (idx.group !== r.group) {
    flag("changed-in-source", "healthkit", r.case, `Apple's index now files ${r.case} under "${idx.group}"; ${HK_MODULE} (read ${HK_MODULE_FETCHED}) has "${r.group}".`, [
      { sourceId: "hkIndex", text: idx.group },
      { sourceId: "hkModule", text: r.group },
    ]);
  }
  if (abstract !== squash(r.abstract)) {
    flag("changed-in-source", "healthkit", r.case, `Apple's page for ${r.case} now reads differently from the abstract in ${HK_MODULE} (read ${HK_MODULE_FETCHED}).`, [
      { sourceId: `hkCase-${r.case}`, text: abstract },
      { sourceId: "hkModule", text: r.abstract },
    ]);
  }
  const deprecatedNow = (doc.metadata?.platforms ?? []).some((p) => p.deprecated || p.deprecatedAt != null);
  if (deprecatedNow !== r.deprecated) {
    flag("changed-in-source", "healthkit", r.case, `Apple's page for ${r.case} ${deprecatedNow ? "now marks it deprecated" : "no longer marks it deprecated"}; ${HK_MODULE} (read ${HK_MODULE_FETCHED}) says ${r.deprecated ? "deprecated" : "not deprecated"}.`, [
      { sourceId: `hkCase-${r.case}`, text: (doc.metadata?.platforms ?? []).map((p) => `${p.name} ${p.introducedAt ?? "?"}${p.deprecatedAt ? `–${p.deprecatedAt}` : ""}`).join(", ") },
    ]);
  }
  // "Apple prints no raw value" is checked, not assumed: every declaration
  // Apple's page carries (Swift, and the Objective-C variant's patch) must be
  // the bare case name with no value after it.
  const declarations = [
    ...(doc.primaryContentSections ?? []).filter((x) => x.kind === "declarations").flatMap((x) => x.declarations ?? []),
    ...(doc.variantOverrides ?? []).flatMap((v) => v.patch ?? []).filter((x) => x.path === "/primaryContentSections/0").flatMap((x) => x.value?.declarations ?? []),
  ].map((d) => (d.tokens ?? []).map((t) => t.text).join(""));
  if (declarations.length < 2) problems.push(`healthkit: Apple's page for ${r.case} carries ${declarations.length} declarations, expected the Swift and the Objective-C one`);
  for (const d of declarations) {
    if (d !== `case ${r.case}` && d !== r.objc) problems.push(`healthkit: Apple's declaration for ${r.case} reads "${d}", not the bare name; read it before publishing that Apple prints no raw value`);
  }
  if (discussion.length && r.discussionWords === 0) {
    flag("changed-in-source", "healthkit", r.case, `Apple's page for ${r.case} now has a discussion; ${HK_MODULE} (read ${HK_MODULE_FETCHED}) recorded none.`, [{ sourceId: `hkCase-${r.case}`, text: discussion[0] }]);
  } else if (!discussion.length && r.discussionWords > 0) {
    flag("changed-in-source", "healthkit", r.case, `${HK_MODULE} (read ${HK_MODULE_FETCHED}) recorded a discussion for ${r.case}; Apple's page read today has none.`, []);
  }
  // Availability, platform by platform: the module's versions against today's page.
  const nowPlatforms = (doc.metadata?.platforms ?? []).map((p) => `${p.name} ${p.introducedAt ?? "?"}${p.deprecatedAt ? ` deprecated ${p.deprecatedAt}` : ""}`).join(", ");
  const thenPlatforms = r.platforms.map((p) => `${p.name} ${p.introducedAt ?? "?"}${p.deprecatedAt ? ` deprecated ${p.deprecatedAt}` : ""}`).join(", ");
  if (nowPlatforms !== thenPlatforms) {
    flag("changed-in-source", "healthkit", r.case, `Apple's availability for ${r.case} reads differently today from ${HK_MODULE} (read ${HK_MODULE_FETCHED}).`, [
      { sourceId: `hkCase-${r.case}`, text: nowPlatforms },
      { sourceId: "hkModule", text: thenPlatforms },
    ]);
  }
  healthkit.push({
    case: r.case,
    objc: r.objc,
    qualified: `HKWorkoutActivityType.${r.case}`,
    group: r.group,
    abstract: r.abstract,
    discussion,
    platforms: r.platforms.map((p) => ({ name: p.name, introducedAt: p.introducedAt, deprecatedAt: p.deprecatedAt })),
    deprecated: r.deprecated,
    deprecation: r.deprecation ? { message: r.deprecation.message, replacements: r.deprecation.replacements } : null,
    docUrl: r.docUrl,
    key: keyOf(r.case),
  });
}
if (healthkit.length !== EXPECTED.healthkit) problems.push(`healthkit: ${healthkit.length} cases from ${HK_MODULE}, expected exactly ${EXPECTED.healthkit}`);
if (hkIndexCases.size !== EXPECTED.healthkit) problems.push(`healthkit: Apple's index lists ${hkIndexCases.size} cases, expected exactly ${EXPECTED.healthkit}`);
const hkNoAbstract = healthkit.filter((h) => !h.abstract);
if (hkNoAbstract.length) problems.push(`healthkit: ${hkNoAbstract.length} cases with no abstract (${hkNoAbstract.map((h) => h.case).join(", ")})`);

// ── 2. Health Connect ──────────────────────────────────────────────────────
/** Detail items of one Dackka (Kotlin/Java reference) section: name, signature, description paragraphs. */
function dackkaItems(html, sectionId) {
  const at = html.indexOf(`id="${sectionId}"`);
  if (at < 0) return null;
  const next = html.slice(at + 10).search(/<h2 [^>]*id="/);
  const sec = html.slice(at, next < 0 ? undefined : at + 10 + next);
  return sec
    .split('<div class="api-item">')
    .slice(1)
    .map((block) => {
      const name = /<h3 id="[^"]*" data-text="([^"]+)"/.exec(block)?.[1] ?? null;
      const sig = /<pre class="api-signature[^"]*"[^>]*>([\s\S]*?)<\/pre>/.exec(block)?.[1] ?? "";
      const after = block.split("</devsite-code>").slice(1).join("</devsite-code>");
      const paras = [...after.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => textOf(m[1])).filter(Boolean);
      return {
        name: name ? decodeEntities(name) : null,
        signature: squash(decodeEntities(sig.replace(/<[^>]+>/g, ""))),
        paragraphs: paras,
        deprecated: /class="deprecated"|This [a-z]+ is deprecated/i.test(block),
        addedIn: /Added in <a[^>]*>([^<]+)<\/a>/.exec(block)?.[1] ?? null,
      };
    });
}

const hcSessionItems = dackkaItems(T.hcSessionRef, "constants_1") ?? [];
if (!hcSessionItems.length) problems.push("health connect: the Jetpack reference's constants section did not parse");
const hcJetpack = [];
for (const it of hcSessionItems) {
  if (!it.name?.startsWith("EXERCISE_TYPE_")) continue;
  const m = /^const val (EXERCISE_TYPE_[A-Z0-9_]+) = (-?\d+): Int$/.exec(it.signature);
  if (!m || m[1] !== it.name) {
    problems.push(`health connect: ${it.name} has a signature that did not parse: ${it.signature}`);
    continue;
  }
  hcJetpack.push({ name: it.name, value: Number(m[2]), paragraphs: it.paragraphs, deprecated: it.deprecated });
}
const hcSessionUpdated = googleLastUpdated(T.hcSessionRef);

// The platform API's ExerciseSessionType: its own values, descriptions and API level.
const hcPlatform = [];
for (const m of T.hcPlatformRef.matchAll(/<div data-version-added="(\d+)"(?:\s+data-version-deprecated="(\d+)")?\s*>\s*<h3 class="api-name" id="([A-Z0-9_]+)"([\s\S]*?)(?=<div data-version-added=|<!-- Fields -->|<\/article>)/g)) {
  const [, , deprecatedAttr, name, body] = m;
  const added = /Added in <a[^>]*>API level (\d+)<\/a>/.exec(body)?.[1] ?? null;
  const ext = /Also in <a[^>]*>([^<]+)<\/a>/.exec(body)?.[1] ?? null;
  const deprecatedIn = /Deprecated in\s*<a[^>]*>API level\s*(\d+)<\/a>/.exec(body)?.[1] ?? null;
  const value = /Constant Value:\s*(-?\d+)/.exec(body)?.[1];
  const sig = /<pre class="api-signature[^"]*"[^>]*>([\s\S]*?)<\/pre>/.exec(body)?.[1] ?? "";
  let after = body.split("</devsite-code>").slice(1).join("");
  // Google prints a deprecation as a <p class="caution"> inside the description's <p>.
  const caution = /<p class="caution">([\s\S]*?)<\/p>/.exec(after)?.[1] ?? null;
  if (caution) after = after.replace(/<p class="caution">[\s\S]*?<\/p>/, "");
  const desc = [...after.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((x) => textOf(x[1])).filter((t) => t && !/^Constant Value/.test(t));
  if (!name.startsWith("EXERCISE_SESSION_TYPE_") || value === undefined || !/public static final int/.test(decodeEntities(sig))) {
    problems.push(`health connect platform: block ${name} did not parse`);
    continue;
  }
  if (!!deprecatedAttr !== !!deprecatedIn || !!deprecatedIn !== !!caution) problems.push(`health connect platform: ${name}'s deprecation markers disagree (attribute ${deprecatedAttr}, line ${deprecatedIn}, note ${caution ? "present" : "absent"})`);
  hcPlatform.push({
    name,
    value: Number(value),
    description: desc.join(" ") || null,
    apiLevel: added ? Number(added) : null,
    extension: ext,
    deprecatedIn: deprecatedIn ? Number(deprecatedIn) : null,
    deprecationNote: caution ? textOf(caution) : null,
  });
}
const hcPlatformUpdated = googleLastUpdated(T.hcPlatformRef);

// The androidx source the references link: its constants (a cross-check).
const hcSourceConsts = [...T.hcSessionSrc.matchAll(/public const val (EXERCISE_TYPE_[A-Z0-9_]+): Int = (-?\d+)/g)].map((m) => ({ name: m[1], value: Number(m[2]) }));
{
  const ref = new Map(hcJetpack.map((c) => [c.name, c.value]));
  const src = new Map(hcSourceConsts.map((c) => [c.name, c.value]));
  for (const [n, v] of src) {
    if (!ref.has(n)) flag("source-only", "health-connect", n, `The androidx source declares ${n} = ${v}; the Jetpack reference (last updated ${hcSessionUpdated}) does not list it.`, [{ sourceId: "hcSessionSrc", text: `public const val ${n}: Int = ${v}` }]);
    else if (ref.get(n) !== v) flag("value-mismatch", "health-connect", n, `The Jetpack reference gives ${n} the value ${ref.get(n)}; the androidx source declares ${v}.`, [
      { sourceId: "hcSessionRef", text: `const val ${n} = ${ref.get(n)}: Int` },
      { sourceId: "hcSessionSrc", text: `public const val ${n}: Int = ${v}` },
    ]);
  }
  for (const [n, v] of ref) {
    if (!src.has(n)) flag("reference-only", "health-connect", n, `The Jetpack reference lists ${n} = ${v}; the androidx source on androidx-main does not declare it.`, [{ sourceId: "hcSessionRef", text: `const val ${n} = ${v}: Int` }]);
  }
}
// Against the record module read on an earlier date.
{
  const recs = moduleLiteral(hcModuleSrc, HC_MODULE, "HC_RECORDS") ?? [];
  const esr = recs.find((r) => r.className === "ExerciseSessionRecord");
  const old = new Map((esr?.constants ?? []).filter((c) => c.name.startsWith("EXERCISE_TYPE_")).map((c) => [c.name, Number(c.value)]));
  if (!old.size) problems.push(`${HC_MODULE}: no ExerciseSessionRecord constants to cross-check`);
  for (const c of hcJetpack) {
    if (!old.has(c.name)) flag("new-in-source", "health-connect", c.name, `The Jetpack reference read today lists ${c.name}; ${HC_MODULE} (read ${HC_MODULE_FETCHED}) does not.`, [{ sourceId: "hcSessionRef", text: `const val ${c.name} = ${c.value}: Int` }]);
    else if (old.get(c.name) !== c.value) flag("value-mismatch", "health-connect", c.name, `${HC_MODULE} (read ${HC_MODULE_FETCHED}) has ${c.name} = ${old.get(c.name)}; the Jetpack reference read today has ${c.value}.`, [{ sourceId: "hcSessionRef", text: `const val ${c.name} = ${c.value}: Int` }]);
  }
  for (const n of old.keys()) if (!hcJetpack.some((c) => c.name === n)) flag("missing-in-source", "health-connect", n, `${HC_MODULE} (read ${HC_MODULE_FETCHED}) lists ${n}; the Jetpack reference read today does not.`, []);
}

// Google's data-types guide prints its own list of exercise types under the
// ExerciseSessionRecord row ("Exercise types", "View all exercise types").
const hcGuideList = (() => {
  const html = T.hcDataTypesGuide;
  const at = html.indexOf('id="exercise-types"');
  const end = at < 0 ? -1 : html.indexOf("</devsite-expandable>", at);
  if (at < 0 || end < 0) {
    problems.push("health connect: the data-types guide's Exercise types list was not found");
    return [];
  }
  return [...html.slice(at, end).matchAll(/<code[^>]*>(EXERCISE_TYPE_[A-Z0-9_]+)<\/code>/g)].map((m) => m[1]);
})();
{
  const ref = new Set(hcJetpack.map((c) => c.name));
  const guideUpdated = googleLastUpdated(T.hcDataTypesGuide);
  for (const n of hcGuideList) {
    if (!ref.has(n)) {
      flag("guide-only", "health-connect", n, `Google's Health Connect data-types guide (last updated ${guideUpdated}) lists ${n} under "Exercise types" in its ExerciseSessionRecord row, one of ${hcGuideList.length} names there; the Jetpack ExerciseSessionRecord reference does not define it${hcSourceConsts.some((c) => c.name === n) ? "" : ", and neither does the androidx source"}.`, [
        { sourceId: "hcDataTypesGuide", text: n },
      ]);
    }
  }
  for (const n of ref) {
    if (!hcGuideList.includes(n)) flag("reference-only", "health-connect", n, `The Jetpack reference defines ${n}; Google's data-types guide (last updated ${guideUpdated}) does not list it among the exercise types.`, []);
  }
}

if (hcGuideList.length !== EXPECTED.healthConnectGuide) problems.push(`health connect: the data-types guide lists ${hcGuideList.length} exercise types, expected exactly ${EXPECTED.healthConnectGuide}`);

// Jetpack → platform: SDK_TO_PLATFORM_EXERCISE_SESSION_TYPE in IntDefMappings.kt.
const hcMapping = new Map();
{
  const code = uncomment(T.hcMappingSrc);
  const at = code.indexOf("SDK_TO_PLATFORM_EXERCISE_SESSION_TYPE: Map<Int, Int> =");
  const open = at < 0 ? -1 : code.indexOf("mapOf(", at) + "mapOf".length;
  const body = open > 0 ? parenBody(code, open) : null;
  if (!body) problems.push("health connect: SDK_TO_PLATFORM_EXERCISE_SESSION_TYPE not found in IntDefMappings.kt");
  for (const entry of topLevelSplit(body ?? "")) {
    // An annotation between the two sides (@Suppress("DEPRECATION") on a
    // deprecated platform constant) is part of the row as printed; it is
    // kept in the evidence and skipped for the match.
    const m = /^ExerciseSessionRecord\.(EXERCISE_TYPE_[A-Z0-9_]+)\s+to\s+(?:@Suppress\("[A-Z_]+"\)\s+)?PlatformExerciseSessionType\.(EXERCISE_SESSION_TYPE_[A-Z0-9_]+)$/.exec(squash(entry));
    if (!m) {
      problems.push(`health connect: a SDK_TO_PLATFORM_EXERCISE_SESSION_TYPE entry did not parse: ${squash(entry)}`);
      continue;
    }
    hcMapping.set(m[1], { platform: m[2], evidence: squash(entry) });
  }
}
const hcToPlatformFallback = evidence(uncomment(T.hcMappingSrc), /internal fun Int\.toPlatformExerciseSessionType\(\): Int \{ return SDK_TO_PLATFORM_EXERCISE_SESSION_TYPE\[this\] \?: PlatformExerciseSessionType\.EXERCISE_SESSION_TYPE_UNKNOWN \}/, "IntDefMappings toPlatformExerciseSessionType");
const hcToSdkFallback = evidence(uncomment(T.hcMappingSrc), /internal fun Int\.toSdkExerciseSessionType\(\): Int \{ return PLATFORM_TO_SDK_EXERCISE_SESSION_TYPE\[this\] \?: ExerciseSessionRecord\.EXERCISE_TYPE_OTHER_WORKOUT \}/, "IntDefMappings toSdkExerciseSessionType");

// Segment types: the Jetpack reference's constants, and the table in ExerciseSegment.kt.
const hcSegmentItems = dackkaItems(T.hcSegmentRef, "constants_1") ?? [];
const hcSegments = [];
for (const it of hcSegmentItems) {
  if (!it.name?.startsWith("EXERCISE_SEGMENT_TYPE_")) continue;
  const m = /^const val (EXERCISE_SEGMENT_TYPE_[A-Z0-9_]+) = (-?\d+): Int$/.exec(it.signature);
  if (!m) {
    problems.push(`health connect: segment ${it.name} signature did not parse: ${it.signature}`);
    continue;
  }
  hcSegments.push({ name: it.name, value: Number(m[2]), description: it.paragraphs.join(" ") || null });
}
// A description that reads like the constant before it. Google's reference
// prints each KDoc comment above the constant it sits on in the source, and
// in two places a comment sits one constant too low: the constant before has
// no description, and this one's describes the other. The rule is literal:
// the description contains every word of the previous constant's name and
// none of the words that set this constant apart from it.
{
  const nameWords = (n) => n.replace(/^EXERCISE_SEGMENT_TYPE_/, "").toLowerCase().split("_").filter(Boolean);
  const textWords = (d) => (d ?? "").toLowerCase().replace(/[^a-z\s-]/g, " ").split(/[\s-]+/).filter(Boolean);
  const has = (ws, w) => ws.some((x) => x.startsWith(w));
  const byValue = [...hcSegments].sort((a, b) => a.value - b.value);
  for (let i = 1; i < byValue.length; i++) {
    const prev = byValue[i - 1];
    const cur = byValue[i];
    if (prev.description || !cur.description) continue;
    const dw = textWords(cur.description);
    const own = nameWords(cur.name).filter((w) => !nameWords(prev.name).includes(w));
    if (own.every((w) => !has(dw, w)) && nameWords(prev.name).every((w) => has(dw, w))) {
      const esc = cur.description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const line = new RegExp(`/\\*\\*\\s*${esc}\\s*\\*/\\s*public const val ${cur.name}: Int = ${cur.value}`).exec(T.hcSegmentSrc)?.[0];
      flag(
        "description-mismatch",
        "health-connect",
        cur.name,
        `Google's ExerciseSegment reference describes ${cur.name} (${cur.value}) as "${cur.description}", the words of the constant before it, ${prev.name} (${prev.value}), which it gives no description; the androidx source has the same comment above ${cur.name}.`,
        [
          { sourceId: "hcSegmentRef", text: cur.description },
          ...(line ? [{ sourceId: "hcSegmentSrc", text: squash(line) }] : []),
        ],
      );
    }
  }
}

const compatibleFn = (dackkaItems(T.hcSegmentRef, "public-companion-functions_1") ?? []).find((x) => x.name === "isSegmentTypeCompatibleWithSessionType");
if (!compatibleFn) problems.push("health connect: ExerciseSegment.isSegmentTypeCompatibleWithSessionType not found on the reference");
const segmentFunctionDoc = compatibleFn ? compatibleFn.paragraphs.filter((p) => !/^Parameters|^Returns/.test(p))[0] ?? null : null;
const segmentFunctionAdded = compatibleFn?.addedIn ?? null;
const segmentRequire = evidence(
  uncomment(T.hcSessionSrc),
  /require\( isSegmentTypeCompatibleWithSessionType\(segment\.segmentType, exerciseType\) \) \{ "segmentType and sessionType is not compatible\." \}/,
  "ExerciseSessionRecord segment check",
);
// The constructor runs that check only on the branch that does not build a
// platform record; the condition is kept so the pages can say when it applies.
const segmentCheckBranch = evidence(
  uncomment(T.hcSessionSrc),
  /init \{ if \( Build\.VERSION\.SDK_INT >= Build\.VERSION_CODES\.UPSIDE_DOWN_CAKE && isAtLeastSdkExtension21\(\) \) \{ @Suppress\("CheckReturnValue"\) this\.toPlatformRecord\(\) \} else \{/,
  "ExerciseSessionRecord init branch",
);
const segmentSourceConsts = new Map([...T.hcSegmentSrc.matchAll(/public const val (EXERCISE_SEGMENT_TYPE_[A-Z0-9_]+): Int = (-?\d+)/g)].map((m) => [m[1], Number(m[2])]));
for (const s of hcSegments) {
  if (!segmentSourceConsts.has(s.name)) flag("reference-only", "health-connect", s.name, `The ExerciseSegment reference lists ${s.name}; the androidx source on androidx-main does not declare it.`, []);
  else if (segmentSourceConsts.get(s.name) !== s.value) flag("value-mismatch", "health-connect", s.name, `The ExerciseSegment reference gives ${s.name} the value ${s.value}; the androidx source declares ${segmentSourceConsts.get(s.name)}.`, []);
}
for (const n of segmentSourceConsts.keys()) if (!hcSegments.some((s) => s.name === n)) flag("source-only", "health-connect", n, `The androidx source declares ${n}; the ExerciseSegment reference does not list it.`, []);

const segCode = uncomment(T.hcSegmentSrc);
/** A `setOf(...)` (or named set) in ExerciseSegment.kt, as segment constant names. */
function segmentSet(expr, sets, what) {
  const e = squash(expr);
  if (sets[e]) return sets[e];
  const so = /^setOf\(([\s\S]*)\)$/.exec(e);
  if (so) return topLevelSplit(so[1]).map((x) => x.replace(/^ExerciseSegment\./, ""));
  const bs = /^buildSet \{([\s\S]*)\}$/.exec(e);
  if (bs) {
    const out = [];
    for (const m of bs[1].matchAll(/\b(add|addAll)\(([A-Z0-9_]+)\)/g)) {
      if (m[1] === "add") out.push(m[2]);
      else if (sets[m[2]]) out.push(...sets[m[2]]);
      else problems.push(`${what}: addAll(${m[2]}) names no set this script read`);
    }
    return out;
  }
  problems.push(`${what}: the expression ${e} is not a form this script reads`);
  return [];
}
const namedSets = {};
for (const setName of ["UNIVERSAL_SESSION_TYPES", "UNIVERSAL_SEGMENTS", "EXERCISE_SEGMENTS", "SWIMMING_SEGMENTS"]) {
  const at = segCode.indexOf(`internal val ${setName} =`);
  const open = at < 0 ? -1 : segCode.indexOf("setOf(", at) + "setOf".length;
  const body = open > 0 ? parenBody(segCode, open) : null;
  if (!body) {
    problems.push(`health connect: ${setName} not found in ExerciseSegment.kt`);
    namedSets[setName] = [];
    continue;
  }
  namedSets[setName] = topLevelSplit(body).map((x) => x.replace(/^ExerciseSessionRecord\./, "").replace(/^ExerciseSegment\./, ""));
}
const segmentRules = new Map();
{
  const at = segCode.indexOf("private val SESSION_TO_SEGMENTS_MAPPING =");
  const open = at < 0 ? -1 : segCode.indexOf("mapOf(", at) + "mapOf".length;
  const body = open > 0 ? parenBody(segCode, open) : null;
  if (!body) problems.push("health connect: SESSION_TO_SEGMENTS_MAPPING not found in ExerciseSegment.kt");
  for (const entry of topLevelSplit(body ?? "")) {
    const m = /^ExerciseSessionRecord\.(EXERCISE_TYPE_[A-Z0-9_]+)\s+to\s+([\s\S]+)$/.exec(squash(entry));
    if (!m) {
      problems.push(`health connect: a SESSION_TO_SEGMENTS_MAPPING entry did not parse: ${squash(entry)}`);
      continue;
    }
    segmentRules.set(m[1], { segments: segmentSet(m[2], namedSets, m[1]), via: /^[A-Z_]+$/.test(m[2].trim()) ? m[2].trim() : null, evidence: squash(entry) });
  }
}
const universalSessionEvidence = evidence(segCode, /internal val UNIVERSAL_SESSION_TYPES = setOf\([^)]*\)/, "UNIVERSAL_SESSION_TYPES");
const universalSegmentEvidence = evidence(segCode, /internal val UNIVERSAL_SEGMENTS = setOf\([^)]*\)/, "UNIVERSAL_SEGMENTS");
const segmentNames = new Set(hcSegments.map((s) => s.name));
for (const [setName, members] of Object.entries(namedSets)) {
  for (const n of members) {
    const known = setName === "UNIVERSAL_SESSION_TYPES" ? hcJetpack.some((c) => c.name === n) : segmentNames.has(n);
    if (!known) problems.push(`health connect: ${setName} names ${n}, which the reference does not list`);
  }
}
for (const [session, rule] of segmentRules) {
  if (!hcJetpack.some((c) => c.name === session)) problems.push(`health connect: SESSION_TO_SEGMENTS_MAPPING names ${session}, which the reference does not list`);
  for (const s of rule.segments) if (!segmentNames.has(s)) problems.push(`health connect: ${session}'s segments name ${s}, which the reference does not list`);
}

const platformByName = new Map(hcPlatform.map((p) => [p.name, p]));
const healthConnect = hcJetpack.map((c) => {
  const map = hcMapping.get(c.name) ?? null;
  const p = map ? platformByName.get(map.platform) ?? null : null;
  if (!map) flag("unmapped", "health-connect", c.name, `IntDefMappings.kt has no platform ExerciseSessionType for ${c.name}; the library's toPlatformExerciseSessionType() then returns EXERCISE_SESSION_TYPE_UNKNOWN.`, [{ sourceId: "hcMappingSrc", text: hcToPlatformFallback }]);
  else if (!p) flag("reference-only", "health-connect", map.platform, `IntDefMappings.kt maps ${c.name} to ${map.platform}, which the platform ExerciseSessionType reference does not list.`, [{ sourceId: "hcMappingSrc", text: map.evidence }]);
  if (p?.deprecatedIn && !c.deprecated) {
    flag("deprecation-mismatch", "health-connect", c.name, `The platform API deprecates ${p.name} in API level ${p.deprecatedIn}; the Jetpack reference does not mark ${c.name}, which the library converts to it, deprecated.`, [
      { sourceId: "hcPlatformRef", text: p.deprecationNote },
      { sourceId: "hcMappingSrc", text: map.evidence },
    ]);
  }
  const universal = namedSets.UNIVERSAL_SESSION_TYPES.includes(c.name);
  const listed = segmentRules.get(c.name) ?? null;
  return {
    name: c.name,
    qualified: `ExerciseSessionRecord.${c.name}`,
    value: c.value,
    description: c.paragraphs.join(" ") || null,
    deprecated: c.deprecated,
    docUrl: `${SOURCES.hcSessionRef.page}#${c.name}()`,
    platform: map && p ? { name: p.name, value: p.value, description: p.description, apiLevel: p.apiLevel, extension: p.extension, deprecatedIn: p.deprecatedIn, deprecationNote: p.deprecationNote, evidence: map.evidence } : null,
    segments: universal
      ? { rule: "any", segments: [], via: "UNIVERSAL_SESSION_TYPES", evidence: universalSessionEvidence }
      : listed
        ? { rule: "listed", segments: listed.segments, via: listed.via, evidence: listed.evidence }
        : { rule: "universal-only", segments: [], via: null, evidence: null },
    key: keyOf(c.name),
  };
});
// Platform constants nothing in the Jetpack library maps to.
for (const p of hcPlatform) {
  if (![...hcMapping.values()].some((m) => m.platform === p.name)) {
    flag("platform-only", "health-connect", p.name, `The platform ExerciseSessionType reference lists ${p.name} = ${p.value}; no Jetpack constant maps to it in IntDefMappings.kt, and the library's toSdkExerciseSessionType() turns an unmapped platform value into EXERCISE_TYPE_OTHER_WORKOUT.`, [
      { sourceId: "hcPlatformRef", text: p.description },
      { sourceId: "hcMappingSrc", text: hcToSdkFallback },
    ]);
  }
}
if (healthConnect.length !== EXPECTED.healthConnect) problems.push(`health connect: ${healthConnect.length} EXERCISE_TYPE_* constants parsed, expected exactly ${EXPECTED.healthConnect}`);
if (hcPlatform.length !== EXPECTED.healthConnectPlatform) problems.push(`health connect platform: ${hcPlatform.length} EXERCISE_SESSION_TYPE_* constants parsed, expected exactly ${EXPECTED.healthConnectPlatform}`);
if (hcSegments.length !== EXPECTED.healthConnectSegments) problems.push(`health connect: ${hcSegments.length} EXERCISE_SEGMENT_TYPE_* constants parsed, expected exactly ${EXPECTED.healthConnectSegments}`);
if (hcSourceConsts.length !== EXPECTED.healthConnect) problems.push(`health connect: the androidx source declares ${hcSourceConsts.length} EXERCISE_TYPE_* constants, expected exactly ${EXPECTED.healthConnect}`);
const hcOther = healthConnect.find((c) => c.name === "EXERCISE_TYPE_OTHER_WORKOUT");
if (!hcOther?.description) problems.push("health connect: EXERCISE_TYPE_OTHER_WORKOUT has no description on the reference");

// ── 3. Wear OS Health Services ─────────────────────────────────────────────
const hsJava = (dackkaItems(T.hsJavaRef, "public-fields_1") ?? []).filter((x) => x.name);
const hsKotlin = (dackkaItems(T.hsKotlinRef, "public-companion-properties_1") ?? []).filter((x) => x.name);
const hsFromId = (dackkaItems(T.hsJavaRef, "public-methods_1") ?? []).find((x) => x.name === "fromId");
for (const f of hsJava) if (!/^public static final @NonNull ExerciseType [A-Z0-9_]+$/.test(f.signature.replace(/\s+/g, " ").replace(/@ NonNull/, "@NonNull"))) problems.push(`wear os: field ${f.name} has an unexpected signature: ${f.signature}`);
const hsSourceDecls = [...T.hsSrc.matchAll(/@JvmField\s+(public|internal)\s+val\s+([A-Z0-9_]+):\s*ExerciseType\s*=\s*ExerciseType\((\d+),\s*"([A-Z0-9_]+)"\)/g)].map((m) => ({
  visibility: m[1],
  name: m[2],
  id: Number(m[3]),
  printedName: m[4],
  evidence: squash(m[0]),
}));
const hsNextId = /\/\/\s*Next ID:\s*(\d+)/.exec(T.hsSrc)?.[1] ?? null;
// "The reference does not print the ids" is checked, not assumed.
if (/Constant Value/i.test(T.hsJavaRef) || /Constant Value/i.test(T.hsKotlinRef)) problems.push("wear os: the ExerciseType reference now prints a Constant Value; read the ids from it rather than the source");
for (const d of hsSourceDecls) if (d.name !== d.printedName) problems.push(`wear os: ${d.name} is declared with the name string "${d.printedName}"`);
const hsJavaNames = new Set(hsJava.map((f) => f.name));
const hsKotlinNames = new Set(hsKotlin.map((f) => f.name));
for (const n of hsJavaNames) if (!hsKotlinNames.has(n)) flag("reference-mismatch", "wear-os", n, `The Java ExerciseType reference lists ${n}; the Kotlin reference does not.`, []);
for (const n of hsKotlinNames) if (!hsJavaNames.has(n)) flag("reference-mismatch", "wear-os", n, `The Kotlin ExerciseType reference lists ${n}; the Java reference does not.`, []);
const hsPublicSource = hsSourceDecls.filter((d) => d.visibility === "public");
for (const d of hsPublicSource) if (!hsJavaNames.has(d.name)) flag("source-only", "wear-os", d.name, `The androidx source declares ${d.name} public with id ${d.id}; the ExerciseType reference does not list it.`, [{ sourceId: "hsSrc", text: d.evidence }]);
const wearOs = hsJava.map((f) => {
  const d = hsSourceDecls.find((x) => x.name === f.name);
  if (!d) flag("reference-only", "wear-os", f.name, `The ExerciseType reference lists ${f.name}; the androidx source on androidx-main does not declare it, so its id is not printed anywhere this script read.`, []);
  else if (d.visibility !== "public") flag("visibility-mismatch", "wear-os", f.name, `The reference lists ${f.name} as public; the androidx source declares it ${d.visibility}.`, [{ sourceId: "hsSrc", text: d.evidence }]);
  return {
    name: f.name,
    qualified: `ExerciseType.${f.name}`,
    id: d ? d.id : null,
    idEvidence: d ? d.evidence : null,
    description: f.paragraphs.join(" ") || null,
    deprecated: f.deprecated,
    docUrl: `${SOURCES.hsJavaRef.page}#${f.name}()`,
    key: keyOf(f.name),
  };
});
const wearOsInternal = hsSourceDecls.filter((d) => d.visibility === "internal").map((d) => ({ name: d.name, id: d.id, evidence: d.evidence }));
if (wearOs.length !== EXPECTED.wearOs) problems.push(`wear os: ${wearOs.length} public ExerciseType fields parsed from the reference, expected exactly ${EXPECTED.wearOs}`);
if (hsSourceDecls.length !== EXPECTED.wearOsSource) problems.push(`wear os: ${hsSourceDecls.length} ExerciseType declarations in the androidx source, expected exactly ${EXPECTED.wearOsSource}`);
if (!hsFromId?.paragraphs.length) problems.push("wear os: ExerciseType.fromId has no description on the reference");
const hsUnknown = wearOs.find((t) => t.name === "UNKNOWN");
if (!hsUnknown?.description) problems.push("wear os: ExerciseType.UNKNOWN has no description on the reference");
const hsCapabilities = evidence(
  textOf(T.hsExerciseGuide).replace(/`/g, ""),
  "Each ExerciseType supports certain data types for metrics and for exercise goals. Check these capabilities at startup, because they can vary depending on the device. A device might not support a certain exercise type, or it might not support a specific function, such as auto-pause.",
  "Health Services capabilities sentence",
);

// ── 4. Google Health API ───────────────────────────────────────────────────
const ghSchemas = moduleLiteral(ghModuleSrc, GHAPI_MODULE, "GHAPI_SCHEMAS") ?? {};
const ghSources = moduleLiteral(ghModuleSrc, GHAPI_MODULE, "GHAPI_SOURCES") ?? [];
const ghDiscovery = ghSources.find((s) => s.key === "discoveryV4");
const ghExercise = ghSchemas.Exercise;
const ghField = ghExercise?.fields.find((f) => f.name === "exerciseType");
const ghDisplayName = ghExercise?.fields.find((f) => f.name === "displayName");
if (!ghField?.enum?.length) problems.push(`google health api: ${GHAPI_MODULE} has no Exercise.exerciseType enum`);
if (ghExercise?.source !== "v4") problems.push(`google health api: the Exercise schema in ${GHAPI_MODULE} was not read from the v4 discovery document`);
const googleHealthApi = (ghField?.enum ?? []).map((e) => ({ value: e.value, description: e.description, key: keyOf(e.value) }));
if (googleHealthApi.length !== EXPECTED.googleHealthApi) problems.push(`google health api: ${googleHealthApi.length} exerciseType values, expected exactly ${EXPECTED.googleHealthApi}`);
if (!/exercise_type` is `OTHER`/.test(ghDisplayName?.description ?? "")) problems.push("google health api: displayName's description no longer states the OTHER rule this script quotes");

// ── 5. The crosswalk ───────────────────────────────────────────────────────
const PLATFORM_ORDER = ["healthkit", "health-connect", "wear-os", "google-health-api"];
const nameOf = { healthkit: (r) => r.case, "health-connect": (r) => r.name, "wear-os": (r) => r.name, "google-health-api": (r) => r.value };
const LISTS = { healthkit, "health-connect": healthConnect, "wear-os": wearOs, "google-health-api": googleHealthApi };
for (const p of PLATFORM_ORDER) {
  const seen = new Map();
  for (const r of LISTS[p]) {
    if (seen.has(r.key)) problems.push(`${p}: ${nameOf[p](r)} and ${seen.get(r.key)} normalise to the same key ${r.key}, so the crosswalk rule cannot place them`);
    seen.set(r.key, nameOf[p](r));
  }
}
const byKey = new Map();
for (const p of PLATFORM_ORDER) for (const r of LISTS[p]) (byKey.get(r.key) ?? byKey.set(r.key, []).get(r.key)).push({ platform: p, name: nameOf[p](r) });
/** Row label and slug: the first spelling in this order. */
const LABEL_ORDER = ["health-connect", "wear-os", "google-health-api", "healthkit"];
const crosswalk = [];
for (const [key, cells] of byKey) {
  if (cells.length < 2) continue;
  const first = LABEL_ORDER.map((p) => cells.find((c) => c.platform === p)).find(Boolean);
  crosswalk.push({ key, slug: slugOf(first.name), label: first.name.replace(/^EXERCISE_TYPE_/, ""), cells: PLATFORM_ORDER.flatMap((p) => cells.filter((c) => c.platform === p)) });
}
crosswalk.sort((a, b) => b.cells.length - a.cells.length || a.slug.localeCompare(b.slug));
const slugs = new Set();
for (const r of crosswalk) {
  if (slugs.has(r.slug)) problems.push(`crosswalk: two rows share the slug ${r.slug}`);
  slugs.add(r.slug);
}
for (const p of PLATFORM_ORDER) for (const r of LISTS[p]) r.counterparts = byKey.get(r.key).filter((c) => c.platform !== p);

// Same name, Health Connect and Wear OS: do the integers agree? A literal comparison of two printed values.
const intComparison = crosswalk
  .filter((r) => r.cells.some((c) => c.platform === "health-connect") && r.cells.some((c) => c.platform === "wear-os"))
  .map((r) => {
    const hc = healthConnect.find((c) => c.name === r.cells.find((x) => x.platform === "health-connect").name);
    const hs = wearOs.find((t) => t.name === r.cells.find((x) => x.platform === "wear-os").name);
    return { key: r.key, healthConnect: { name: hc.name, value: hc.value }, wearOs: { name: hs.name, id: hs.id }, same: hs.id !== null && hs.id === hc.value };
  });

// ── 6. Pages searched for a published mapping ──────────────────────────────
// Each page read while looking for a mapping between two of the four
// enumerations. A table row or list item that names constants of two of them
// is a mapping a person must read, so it stops the write.
const PATTERNS = {
  healthkit: /HKWorkoutActivityType/,
  "health-connect": /\bEXERCISE_TYPE_[A-Z][A-Z_]*\b|ExerciseSessionRecord\.EXERCISE/,
  // Not preceded by a dot: ExerciseSessionRecord.ExerciseType.RUNNING, which
  // two Health Connect guides print, is not Health Services' class.
  "wear-os": /(?<![.\w])ExerciseType\.[A-Z][A-Z_]*\b/,
};
const mappingSearch = [];
for (const id of [...Object.keys(SOURCES).filter((k) => SOURCES[k].search), "hkIndex"]) {
  const html = id === "hkIndex" ? JSON.stringify(hkIndex) : T[id];
  const text = id === "hkIndex" ? "" : textOf(html);
  const mentions = Object.fromEntries(Object.entries(PATTERNS).map(([p, re]) => [p, (id === "hkIndex" ? html : text).match(new RegExp(re.source, "g"))?.length ?? 0]));
  const units = id === "hkIndex" ? [] : [...html.matchAll(/<(tr|li)\b[\s\S]*?<\/\1>/g)].map((m) => textOf(m[0]));
  const mixed = units.filter((u) => Object.values(PATTERNS).filter((re) => re.test(u)).length >= 2);
  if (mixed.length) problems.push(`${id}: a table row or list item names constants of two enumerations — read it before publishing: ${mixed[0].slice(0, 200)}`);
  mappingSearch.push({ sourceId: id, mentions, mixedRows: mixed.length });
}

// Google's guide samples that name a Health Connect member the reference does
// not define: ExerciseSessionRecord.ExerciseType.<NAME>. The reference's
// constants are EXERCISE_TYPE_<NAME>, and it lists no ExerciseType member.
{
  const refText = textOf(T.hcSessionRef);
  const refHasMember = /\bclass ExerciseType\b|ExerciseSessionRecord\.ExerciseType\b/.test(refText);
  const seen = new Map();
  for (const id of Object.keys(SOURCES).filter((k) => SOURCES[k].search)) {
    const t = textOf(T[id]);
    for (const m of t.matchAll(/exerciseType = ExerciseSessionRecord\.ExerciseType\.([A-Z_]+),?/g)) {
      const k = m[1];
      (seen.get(k) ?? seen.set(k, []).get(k)).push({ sourceId: id, text: m[0].replace(/,$/, "") });
    }
  }
  if (!refHasMember) {
    for (const [name, ev] of seen) {
      const c = hcJetpack.find((x) => x.name === `EXERCISE_TYPE_${name}`);
      flag(
        "sample-mismatch",
        "health-connect",
        `ExerciseSessionRecord.ExerciseType.${name}`,
        `${ev.length === 1 ? "A Health Connect guide's sample writes" : `${ev.length} Health Connect guides' samples write`} exerciseType = ExerciseSessionRecord.ExerciseType.${name}; the ExerciseSessionRecord reference lists no ExerciseType member${c ? `, and its constant is ${c.name} = ${c.value}` : ""}.`,
        [...ev, ...(c ? [{ sourceId: "hcSessionRef", text: `const val ${c.name} = ${c.value}: Int` }] : [])],
      );
    }
  }
}

/**
 * Mappings a fetched source states between two of the four enumerations.
 * The pages and files read on 2026-10-18 state none: the one table that maps
 * exercise types in the androidx source (IntDefMappings.kt) maps Health
 * Connect's Jetpack constants to Health Connect's own platform constants,
 * which is the same enumeration twice, and is published per constant on the
 * Health Connect rows instead. A future source that states one is added
 * here with its row as evidence, and the pages show it apart from the
 * name-identity rows.
 */
const statedMappings = [];

// The library-internal name table in ExerciseSessionRecord.kt. It maps
// lowercase strings to EXERCISE_TYPE_* constants; it is not documented as a
// mapping from any of the other enumerations, so nothing is joined by it.
const stringMapAt = uncomment(T.hcSessionSrc).indexOf("EXERCISE_TYPE_STRING_TO_INT_MAP: Map<String, Int> =");
const stringMapEntries = (() => {
  if (stringMapAt < 0) {
    problems.push("health connect: EXERCISE_TYPE_STRING_TO_INT_MAP not found in ExerciseSessionRecord.kt");
    return [];
  }
  const code = uncomment(T.hcSessionSrc);
  const open = code.indexOf("mapOf(", stringMapAt) + "mapOf".length;
  return topLevelSplit(parenBody(code, open) ?? "").map((e) => /^"([a-z_]+)" to (EXERCISE_TYPE_[A-Z_]+)$/.exec(squash(e))).filter(Boolean).map((m) => ({ key: m[1], value: m[2] }));
})();
const stringMapRestricted = /@RestrictTo\(RestrictTo\.Scope\.LIBRARY\)\s*@JvmField\s*public val EXERCISE_TYPE_STRING_TO_INT_MAP/.test(T.hcSessionSrc);
const stringMapComment = evidence(T.hcSessionSrc, /"para_gliding" to\s+EXERCISE_TYPE_PARAGLIDING, \/\/ Historic typo in whs with para_gliding/, "EXERCISE_TYPE_STRING_TO_INT_MAP para_gliding comment");
if (!stringMapRestricted) problems.push("health connect: EXERCISE_TYPE_STRING_TO_INT_MAP is no longer @RestrictTo(LIBRARY); re-read it before describing it as library-internal");

// ── Sources, fallbacks and the write ──────────────────────────────────────
for (const id of Object.keys(SOURCES)) if (!meta[id]?.sha256) problems.push(`${id}: no fetch record in ${META}`);
const caseDates = healthkit.map((h) => meta[`hkCase-${h.case}`]?.fetchedOn).filter(Boolean);
if (caseDates.length !== healthkit.length) problems.push(`healthkit: ${healthkit.length - caseDates.length} case pages have no fetch record`);

if (problems.length) {
  console.error("REFUSING TO WRITE — a source's shape may have changed:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

const fetchedDates = [...Object.keys(SOURCES).map((id) => meta[id].fetchedOn), ...caseDates].sort();
const fetchedOn = fetchedDates.at(-1);
const sources = [
  ...Object.entries(SOURCES).map(([id, s]) => ({
    id,
    title: s.title,
    platform: s.platform,
    role: s.role,
    url: s.url,
    page: s.page,
    repo: s.repo,
    branch: s.branch,
    path: s.path,
    fetchedOn: meta[id].fetchedOn,
    sha256: meta[id].sha256,
    sourceUpdated: s.kind === "devsite" ? googleLastUpdated(T[id]) : null,
  })),
  {
    id: "hkCases",
    title: `Apple's page for each HKWorkoutActivityType case (${healthkit.length} JSON documents)`,
    platform: "healthkit",
    role: "list",
    url: `${APPLE_DATA}/hkworkoutactivitytype/<case>.json`,
    page: `${APPLE_DOCS}/hkworkoutactivitytype`,
    repo: null,
    branch: null,
    path: null,
    fetchedOn: caseDates.sort().at(-1),
    sha256: sha256(healthkit.map((h) => meta[`hkCase-${h.case}`].sha256).join("\n")),
    sourceUpdated: null,
  },
  {
    id: "hkModule",
    title: "Apple's HealthKit documentation JSON, as read for this site's HealthKit identifier reference",
    platform: "healthkit",
    role: "list",
    url: `${APPLE_DOCS}/hkworkoutactivitytype`,
    page: `${APPLE_DOCS}/hkworkoutactivitytype`,
    repo: null,
    branch: null,
    path: HK_MODULE,
    fetchedOn: HK_MODULE_FETCHED,
    sha256: sha256(hkModuleSrc),
    sourceUpdated: null,
  },
  {
    id: "ghapiModule",
    title: `Google Health API v4 discovery document (revision ${ghDiscovery?.revision ?? "unknown"}), as read for this site's Google Health API reference`,
    platform: "google-health-api",
    role: "list",
    url: ghDiscovery?.url ?? null,
    page: "https://developers.google.com/health/reference/rest",
    repo: null,
    branch: null,
    path: GHAPI_MODULE,
    fetchedOn: ghDiscovery?.fetchedOn ?? GHAPI_MODULE_FETCHED,
    sha256: sha256(ghModuleSrc),
    sourceUpdated: null,
  },
];

const PLATFORMS = [
  {
    slug: "healthkit",
    name: "Apple HealthKit",
    short: "HealthKit",
    enumeration: "HKWorkoutActivityType",
    kind: `declared as \`${hkTypeDecl.swift}\` in Swift and \`${hkTypeDecl.objc}\` in Objective-C`,
    count: healthkit.length,
    prefix: null,
    valueNote: "Apple's documentation prints no raw value for any case, so this reference carries none.",
    readOn: caseDates.sort().at(-1),
    sourceIds: ["hkModule", "hkIndex", "hkCases"],
  },
  {
    slug: "health-connect",
    name: "Android Health Connect",
    short: "Health Connect",
    enumeration: "ExerciseSessionRecord.EXERCISE_TYPE_*",
    kind: "Int constants on the Jetpack ExerciseSessionRecord class",
    count: healthConnect.length,
    prefix: "EXERCISE_TYPE_",
    valueNote: "The Jetpack reference prints every value; the platform API (android.health.connect, API level 34) numbers the same types differently in ExerciseSessionType, and the library converts between the two.",
    readOn: meta.hcSessionRef.fetchedOn,
    sourceIds: ["hcSessionRef", "hcPlatformRef", "hcSessionSrc", "hcMappingSrc", "hcSegmentRef", "hcSegmentSrc"],
  },
  {
    slug: "wear-os",
    name: "Wear OS Health Services",
    short: "Wear OS",
    enumeration: "ExerciseType",
    kind: "ExerciseType objects, each with an int id and a name, on the Jetpack ExerciseType class",
    count: wearOs.length,
    prefix: null,
    valueNote: "The reference does not print the ids; the androidx source it links as View Source does, and the ids here are read from it.",
    readOn: meta.hsJavaRef.fetchedOn,
    sourceIds: ["hsJavaRef", "hsKotlinRef", "hsSrc"],
  },
  {
    slug: "google-health-api",
    name: "Google Health API",
    short: "Google Health API",
    enumeration: "Exercise.exerciseType",
    kind: "string enum values on the exercise data type's exerciseType field",
    count: googleHealthApi.length,
    prefix: "EXERCISE_TYPE_ (on EXERCISE_TYPE_UNSPECIFIED only)",
    valueNote: "A REST enum: the value is the string itself.",
    readOn: ghDiscovery?.fetchedOn ?? GHAPI_MODULE_FETCHED,
    sourceIds: ["ghapiModule"],
  },
];

/** What each source says about a type with no better match: copied text only. */
const FALLBACKS = [
  {
    platform: "healthkit",
    constant: "other",
    statements: [
      { sourceId: "hkCases", text: healthkit.find((h) => h.case === "other")?.abstract ?? null },
      ...(healthkit.find((h) => h.case === "other")?.discussion ?? []).map((t) => ({ sourceId: "hkCases", text: t })),
    ],
  },
  {
    platform: "health-connect",
    constant: "EXERCISE_TYPE_OTHER_WORKOUT",
    statements: [
      { sourceId: "hcSessionRef", text: hcOther.description },
      { sourceId: "hcMappingSrc", text: hcToSdkFallback },
    ],
  },
  {
    platform: "wear-os",
    constant: "UNKNOWN",
    statements: [
      { sourceId: "hsJavaRef", text: `UNKNOWN: ${hsUnknown.description}` },
      { sourceId: "hsJavaRef", text: `fromId(id): ${hsFromId.paragraphs.join(" ")}` },
      { sourceId: "hsExerciseGuide", text: hsCapabilities },
    ],
  },
  {
    platform: "google-health-api",
    constant: "OTHER",
    statements: [
      { sourceId: "ghapiModule", text: `OTHER: ${googleHealthApi.find((g) => g.value === "OTHER")?.description}` },
      { sourceId: "ghapiModule", text: `displayName: ${ghDisplayName.description}` },
    ],
  },
].map((f) => ({ ...f, statements: f.statements.filter((s) => s.text) }));

const NORMALISATION =
  "Two constants share a crosswalk row only when their names are identical after removing a leading EXERCISE_TYPE_ (Health Connect's prefix, which the Google Health API also uses on EXERCISE_TYPE_UNSPECIFIED), lowercasing, and removing every character that is not a letter or a digit.";

/** A JSON array literal whose closing bracket starts a line, so readers that look for "\n];" find the right one. */
const arr = (x) => (x.length ? JSON.stringify(x, null, 2) : "[\n]");

const body = `/**
 * Workout and exercise types on four platforms — every constant as its own
 * source spells it — and the crosswalk between them.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-workout-types.mjs
 *
 * Sources (GitHub files on the branch shown; sha256 is of the bytes read):
${sources.map((s) => ` *   ${s.title}: ${s.page}${s.branch ? ` (branch ${s.branch})` : ""} — read ${s.fetchedOn}`).join("\n")}
 * Fetched: ${fetchedOn}
 *
 * Copied verbatim: names, values, ids, descriptions, Apple's abstracts,
 * groups, discussions, availability and deprecation notes, Google's API
 * levels, the Jetpack-to-platform mapping rows and the segment table rows.
 *
 * Derived, with the text kept beside it:
 *   key — the crosswalk key (WT_NORMALISATION). A row joins constants whose
 *     keys are identical and nothing else.
 *   segments — the segment types a Health Connect session type can contain,
 *     read from the table ExerciseSegment.isSegmentTypeCompatibleWithSessionType
 *     uses; the source line is in \`evidence\`.
 *   platform — the platform ExerciseSessionType constant the Jetpack library
 *     converts each constant to; the IntDefMappings.kt row is in \`evidence\`.
 *   intComparison — whether a Health Connect value and the Wear OS id of the
 *     same name are equal. A comparison of two printed numbers, not a claim
 *     that either platform accepts the other's.
 *   flags — where two sources disagree, published with both texts.
 */

/** The date the generator last read its sources (the latest fetch date). */
export const WT_FETCHED_ON = ${JSON.stringify(fetchedOn)};

/** The one normalisation the crosswalk applies, stated once. */
export const WT_NORMALISATION = ${JSON.stringify(NORMALISATION)};

export type WtPlatformSlug = "healthkit" | "health-connect" | "wear-os" | "google-health-api";

export type WtSource = {
  id: string;
  title: string;
  platform: WtPlatformSlug | null;
  /** "list": a platform's constants or a cross-check of them; "fact": a statement the pages quote; "search": read while looking for a published mapping. */
  role: "list" | "fact" | "search";
  url: string | null;
  page: string;
  repo: string | null;
  branch: string | null;
  path: string | null;
  fetchedOn: string;
  sha256: string;
  /** Google's "Last updated" footer stamp, for developer.android.com and developers.google.com pages. */
  sourceUpdated: string | null;
};

export const WT_SOURCES: WtSource[] = ${JSON.stringify(sources, null, 2)};

export type WtPlatform = {
  slug: WtPlatformSlug;
  name: string;
  short: string;
  enumeration: string;
  kind: string;
  count: number;
  prefix: string | null;
  /** Where the platform's numbers come from, or why there are none. */
  valueNote: string;
  readOn: string;
  sourceIds: string[];
};

export const WT_PLATFORMS: WtPlatform[] = ${JSON.stringify(PLATFORMS, null, 2)};

export type WtCounterpart = { platform: WtPlatformSlug; name: string };

export type WtHealthKitType = {
  case: string;
  objc: string;
  qualified: string;
  /** Apple's topic group. */
  group: string;
  /** Apple's abstract, verbatim. */
  abstract: string;
  /** Apple's discussion paragraphs, verbatim (symbol links as their names in backticks); empty when Apple gives none. */
  discussion: string[];
  platforms: { name: string; introducedAt: string | null; deprecatedAt: string | null }[];
  deprecated: boolean;
  /** Apple's deprecation note and the symbols it names; null when not deprecated. */
  deprecation: { message: string | null; replacements: string[] } | null;
  docUrl: string;
  /** DERIVED: the crosswalk key. */
  key: string;
  /** Constants of the other platforms with the same key. */
  counterparts: WtCounterpart[];
};

export const WT_HEALTHKIT: WtHealthKitType[] = ${JSON.stringify(healthkit, null, 2)};

export type WtHealthConnectType = {
  name: string;
  qualified: string;
  /** The Jetpack reference's value. */
  value: number;
  /** The Jetpack reference's description; null where it gives none. */
  description: string | null;
  deprecated: boolean;
  docUrl: string;
  /** The platform ExerciseSessionType constant the library converts to (IntDefMappings.kt), with that reference's value, description and API level. */
  platform: {
    name: string;
    value: number;
    description: string | null;
    apiLevel: number | null;
    extension: string | null;
    /** The API level the platform reference says the constant was deprecated in; null when it is not. */
    deprecatedIn: number | null;
    /** The platform reference's deprecation note, verbatim. */
    deprecationNote: string | null;
    evidence: string;
  } | null;
  /**
   * The segment types a session of this type can contain, from the table
   * behind ExerciseSegment.isSegmentTypeCompatibleWithSessionType:
   * "any" — the session type is in UNIVERSAL_SESSION_TYPES and accepts every
   * segment type; "listed" — the table names its segments (plus the
   * universal segments every session accepts); "universal-only" — the table
   * does not name it, so only the universal segments are accepted.
   */
  segments: { rule: "any" | "listed" | "universal-only"; segments: string[]; via: string | null; evidence: string | null };
  key: string;
  counterparts: WtCounterpart[];
};

export const WT_HEALTH_CONNECT: WtHealthConnectType[] = ${JSON.stringify(healthConnect, null, 2)};

/** Every ExerciseSegment.EXERCISE_SEGMENT_TYPE_* constant on the Jetpack reference. */
export const WT_HC_SEGMENT_TYPES: { name: string; value: number; description: string | null }[] = ${JSON.stringify(hcSegments, null, 2)};

/** The segment types every Health Connect session accepts (UNIVERSAL_SEGMENTS), and the source line. */
export const WT_HC_UNIVERSAL_SEGMENTS: { segments: string[]; evidence: string } = ${JSON.stringify({ segments: namedSets.UNIVERSAL_SEGMENTS, evidence: universalSegmentEvidence }, null, 2)};

/** What Google's reference and the library source say about segment compatibility, verbatim. */
export const WT_HC_SEGMENT_RULE: {
  functionDoc: string | null;
  addedIn: string | null;
  /** The constructor's check, verbatim (whitespace collapsed). */
  requireLine: string | null;
  /** The condition under which the constructor builds a platform record instead of running that check. */
  platformBranch: string | null;
} = ${JSON.stringify({ functionDoc: segmentFunctionDoc, addedIn: segmentFunctionAdded, requireLine: segmentRequire, platformBranch: segmentCheckBranch }, null, 2)};

export type WtWearOsType = {
  name: string;
  qualified: string;
  /** The id ExerciseType.kt passes to the constructor; null where the source does not declare the constant. */
  id: number | null;
  /** The declaration the id was read from. */
  idEvidence: string | null;
  /** The reference's description; null where it gives none. */
  description: string | null;
  deprecated: boolean;
  docUrl: string;
  key: string;
  counterparts: WtCounterpart[];
};

export const WT_WEAR_OS: WtWearOsType[] = ${JSON.stringify(wearOs, null, 2)};

/** ExerciseType constants the source declares internal: not on the reference, not usable from an app. */
export const WT_WEAR_OS_INTERNAL: { name: string; id: number; evidence: string }[] = ${arr(wearOsInternal)};

/** The "Next ID" comment in ExerciseType.kt. */
export const WT_WEAR_OS_NEXT_ID = ${JSON.stringify(hsNextId)};

export type WtGoogleHealthApiType = {
  value: string;
  /** Google's description from the discovery document, verbatim. */
  description: string | null;
  key: string;
  counterparts: WtCounterpart[];
};

export const WT_GOOGLE_HEALTH_API: WtGoogleHealthApiType[] = ${JSON.stringify(googleHealthApi, null, 2)};

/** The Exercise schema's exerciseType and displayName descriptions, verbatim. */
export const WT_GHAPI_FIELDS: { exerciseType: string | null; displayName: string | null } = ${JSON.stringify({ exerciseType: ghField?.description ?? null, displayName: ghDisplayName?.description ?? null }, null, 2)};

export type WtCrosswalkRow = {
  /** The shared key. */
  key: string;
  /** URL slug: kebab-case of the label's spelling. */
  slug: string;
  /** Display label: the first spelling in the order Health Connect, Wear OS, Google Health API, HealthKit (prefix removed). */
  label: string;
  /** One cell per platform with a constant of this key, in platform order. */
  cells: WtCounterpart[];
};

/** Name-identity rows: keys shared by at least two platforms. */
export const WT_CROSSWALK: WtCrosswalkRow[] = ${JSON.stringify(crosswalk, null, 2)};

export type WtStatedMapping = { from: WtCounterpart; to: WtCounterpart; sourceId: string; url: string; evidence: string };

/** Mappings a fetched source states between two of the four enumerations. None of the pages read states one. */
export const WT_STATED_MAPPINGS: WtStatedMapping[] = ${arr(statedMappings)};

/** Pages read while looking for a published mapping, with how often each names each enumeration's constants and how many table rows or list items name two (always 0: one stops the write). */
export const WT_MAPPING_SEARCH: { sourceId: string; mentions: Record<string, number>; mixedRows: number }[] = ${JSON.stringify(mappingSearch, null, 2)};

/** The library-internal name table in ExerciseSessionRecord.kt, kept as evidence and joined by nothing. */
export const WT_HC_STRING_MAP: { restrictedToLibrary: boolean; comment: string | null; entries: { key: string; value: string }[] } = ${JSON.stringify({ restrictedToLibrary: stringMapRestricted, comment: stringMapComment, entries: stringMapEntries }, null, 2)};

export type WtIntComparison = { key: string; healthConnect: { name: string; value: number }; wearOs: { name: string; id: number | null }; same: boolean };

/** Rows with both a Health Connect and a Wear OS constant: do the printed integers match? */
export const WT_INT_COMPARISON: WtIntComparison[] = ${JSON.stringify(intComparison, null, 2)};

export type WtFallback = { platform: WtPlatformSlug; constant: string; statements: { sourceId: string; text: string }[] };

/** Each platform's catch-all constant and what its sources say about it, verbatim. */
export const WT_FALLBACKS: WtFallback[] = ${JSON.stringify(FALLBACKS, null, 2)};

export type WtFlag = { kind: string; platform: WtPlatformSlug; subject: string; summary: string; evidence: { sourceId: string; text: string }[] };

/** Where two sources disagree, published as found. */
export const WT_FLAGS: WtFlag[] = ${arr(flags)};
`;

writeFileSync(OUT, body);
const dist = {};
for (const r of crosswalk) dist[r.cells.length] = (dist[r.cells.length] ?? 0) + 1;
console.log(`wrote ${OUT}: ${healthkit.length} HealthKit, ${healthConnect.length} Health Connect, ${wearOs.length} Wear OS, ${googleHealthApi.length} Google Health API; ${crosswalk.length} crosswalk rows (${Object.entries(dist).map(([n, c]) => `${c} on ${n} platforms`).join(", ")}), ${flags.length} flags`);
for (const p of PLATFORM_ORDER) console.log(`  ${p.padEnd(18)} ${LISTS[p].filter((r) => r.counterparts.length).length} matched, ${LISTS[p].filter((r) => !r.counterparts.length).length} unmatched`);
console.log(`  same-name Health Connect / Wear OS pairs: ${intComparison.length}, same integer ${intComparison.filter((c) => c.same).length}`);
console.log("read:");
for (const s of sources) console.log(`  ${s.fetchedOn} ${s.url}`);
