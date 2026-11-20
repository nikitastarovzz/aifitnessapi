#!/usr/bin/env node
/**
 * Regenerate src/data/healthLibrarySupport.ts — which HealthKit identifiers
 * and Health Connect record classes each mobile wrapper library tracked in
 * src/data/libraries.ts maps — from each library's own source code.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-health-library-support.mjs [--offline]
 *     --offline reparses the cache in .cache/health-library-support without
 *     touching the network (pins and files from the last online run).
 *   Then `npm run datasets` to publish public/datasets/health-library-support-2026.*.
 *
 * Pin. Every library is read at one commit, recorded in the output: the tag
 * whose name is the registry's latest version (v1.2.3, 1.2.3, <name>-v1.2.3 or
 * <name>@1.2.3), peeled to its commit, or, where the repository has no such
 * tag, the default branch's head. `git ls-remote` against github.com names
 * the commit (the GitHub REST API is not reachable from the dev environment);
 * the files are read from raw.githubusercontent.com at that SHA, so a source
 * link opens the exact line that was read. The version in the package's own
 * manifest at that commit is stored beside the registry's, because a head
 * pin can be ahead of (or behind) the release.
 *
 * What counts as support. For each library, SCANS names the source files that
 * map the library's own data-type names onto the platform's: a permission
 * switch, a type dictionary, a TypeScript union of identifier strings, an
 * import list. Every identifier those files name in code (comments removed) is
 * one row, with the file, line and verbatim line it was read from. The file
 * choice is a reviewer's reading of the repository and is stated per library
 * in `method`; the identifiers are the files' own.
 *
 * Patterns, and nothing else:
 *   hk-objc    HK{Quantity,Category,Characteristic,Correlation}TypeIdentifier<Name>
 *              (Objective-C constants, and the same strings in JS/TS/Dart)
 *   hk-swift   HKQuantityTypeIdentifier.<case> (and the other three families),
 *              <family>Type(forIdentifier: .<case>), HK<Family>Type(.<case>)
 *   bare       a scan-specific pattern for `.case` members whose family is
 *              fixed by a declaration the scan quotes (`typedBy`), checked
 *              against the file like every other quote
 *   hc-import  import androidx.health.connect.client.records.<Name>Record
 *   hc-class   <Name>Record::class (Kotlin) or <Name>Record.class (Java)
 * HKWorkoutActivityType cases are exercise kinds, not data types, and are
 * not read (src/data/workoutTypes.ts covers them).
 *
 * Exact match only. A HealthKit token counts when it is, character for
 * character, an Objective-C constant in src/data/healthkitIdentifiers.ts, or
 * a Swift (family, case) pair there; a Health Connect token when it is a
 * class name in src/data/healthConnectRecords.ts. Anything else the patterns
 * find (correlation types, which the site's identifier list does not cover;
 * a type newer than that list; a misspelling) is kept in `unmatched` with its
 * line, never fuzzy-matched onto a neighbour.
 *
 * A short parse fails: EXPECTED holds the matched count of the last verified
 * read per library and store, and fewer refuses to write. Every candidate
 * library (every non-Python row of libraries.ts) must be in LIBS or in
 * EXCLUDED with a reason, so a new row cannot be silently skipped.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadTs } from "./lib/load-ts.mjs";

const CACHE = ".cache/health-library-support";
const META = join(CACHE, "meta.json");
const OUT = "src/data/healthLibrarySupport.ts";

/* ─────────────────────────────── config ──────────────────────────────── */

/**
 * One entry per covered library. `manifest` is the package's own manifest at
 * the pin (its version line is quoted). `scans` are read in order; the first
 * line that names an identifier is its evidence.
 */
export const LIBS = {
  "react-native-health": {
    manifest: "package.json",
    method:
      "RCTAppleHealthKit+TypesAndPermissions.m, the Objective-C switch that turns each permission name the JavaScript API accepts into the HealthKit type it requests.",
    scans: [{ path: "RCTAppleHealthKit/RCTAppleHealthKit+TypesAndPermissions.m", patterns: ["hk-objc"] }],
  },
  "kingstinct-react-native-healthkit": {
    manifest: "packages/react-native-healthkit/package.json",
    method:
      "The TypeScript unions of identifier strings the API accepts: the generated quantity and category unions (read-only and writeable) in healthkit.generated.ts, CharacteristicTypeIdentifier and CorrelationTypeIdentifier. The native side resolves each string by its raw value.",
    scans: [
      {
        path: "packages/react-native-healthkit/src/generated/healthkit.generated.ts",
        patterns: ["hk-objc"],
        region: { start: "export type QuantityTypeIdentifierReadOnly =", end: "export const QUANTITY_IDENTIFIER_IOS_AVAILABILITY = {" },
      },
      { path: "packages/react-native-healthkit/src/types/Characteristics.ts", patterns: ["hk-objc"] },
      { path: "packages/react-native-healthkit/src/types/CorrelationType.ts", patterns: ["hk-objc"] },
    ],
  },
  "react-native-health-connect": {
    manifest: "package.json",
    method:
      "reactRecordTypeToClassMap in HealthConnectUtils.kt, the map from each recordType string the JavaScript API accepts to its Health Connect record class.",
    scans: [
      {
        path: "android/src/main/java/dev/matinzd/healthconnect/utils/HealthConnectUtils.kt",
        patterns: ["hc-class"],
        region: { start: "val reactRecordTypeToClassMap: Map<String, KClass<out Record>> = mapOf(", end: ")" },
      },
    ],
  },
  "capacitor-health": {
    manifest: "package.json",
    method:
      "iOS: HealthPlugin.swift (the permission switch, the record and aggregate type switches, workouts) and NutritionMapper.swift. Android: the record classes HealthPlugin.kt and NutritionMapper.kt import.",
    scans: [
      {
        path: "ios/Sources/HealthPluginPlugin/HealthPlugin.swift",
        patterns: ["hk-swift"],
        bare: { re: /\bidentifier: \.([a-z][A-Za-z0-9]*)\b/g, familyType: "HKQuantityTypeIdentifier", typedBy: "let identifier: HKQuantityTypeIdentifier" },
      },
      {
        path: "ios/Sources/HealthPluginPlugin/NutritionMapper.swift",
        patterns: ["hk-swift"],
        bare: { re: /\bidentifier: \.([a-z][A-Za-z0-9]*)\b/g, familyType: "HKQuantityTypeIdentifier", typedBy: "let identifier: HKQuantityTypeIdentifier" },
      },
      { path: "android/src/main/java/com/fit_up/health/capacitor/HealthPlugin.kt", patterns: ["hc-import"] },
      { path: "android/src/main/java/com/fit_up/health/capacitor/NutritionMapper.kt", patterns: ["hc-import"] },
    ],
  },
  "capgo-capacitor-health": {
    manifest: "package.json",
    method:
      "iOS: Health.swift, the HealthDataType enum's sampleType() and quantityType() switches and the other typed HealthKit calls in that file. Android: the HealthDataType enum's record classes and the record classes HealthManager.kt imports.",
    scans: [
      { path: "ios/Sources/HealthPlugin/Health.swift", patterns: ["hk-swift"] },
      {
        path: "ios/Sources/HealthPlugin/Health.swift",
        patterns: [],
        region: { start: "func quantityType() throws -> HKQuantityType {", end: "guard let type = HKObjectType.quantityType(forIdentifier: identifier) else {" },
        bare: { re: /\bidentifier = \.([a-z][A-Za-z0-9]*)\b/g, familyType: "HKQuantityTypeIdentifier", typedBy: "let identifier: HKQuantityTypeIdentifier" },
      },
      { path: "android/src/main/java/app/capgo/plugin/health/HealthDataType.kt", patterns: ["hc-class"] },
      { path: "android/src/main/java/app/capgo/plugin/health/HealthManager.kt", patterns: ["hc-import"] },
    ],
  },
  "perfood-capacitor-healthkit": {
    manifest: "package.json",
    method: "CapacitorHealthkitPlugin.swift, the switches that turn each sample name and permission the plugin accepts into a HealthKit type.",
    scans: [{ path: "ios/Plugin/CapacitorHealthkitPlugin.swift", patterns: ["hk-swift"] }],
  },
  "cordova-plugin-health": {
    manifest: "package.json",
    method:
      "iOS: www/ios/health.js, the dataTypes table from the plugin's data-type names to HealthKit identifier strings and the extra types it requests or queries, and HealthKit.m, the native bridge it calls (which reads the characteristic types, such as gender and date of birth, directly). Android: the record classes HealthPlugin.java imports.",
    scans: [
      { path: "www/ios/health.js", patterns: ["hk-objc"] },
      { path: "src/ios/HealthKit.m", patterns: ["hk-objc"] },
      { path: "src/android/HealthPlugin.java", patterns: ["hc-import"] },
    ],
  },
  "flutter-health": {
    manifest: "pubspec.yaml",
    method:
      "iOS: HealthPlugin.swift, where each HealthDataType key is assigned its HealthKit type, and HealthConstants.swift's NUTRITION_KEYS. Android: mapToType in HealthConstants.kt, the map from HealthDataType names to record classes.",
    scans: [
      { path: "ios/health/Sources/health/HealthPlugin.swift", patterns: ["hk-swift"] },
      {
        path: "ios/health/Sources/health/HealthConstants.swift",
        patterns: [],
        region: { start: "static let NUTRITION_KEYS: [String: HKQuantityTypeIdentifier] = [", end: "]" },
        bare: { re: /:\s*\.([a-z][A-Za-z0-9]*)\s*,?\s*$/g, familyType: "HKQuantityTypeIdentifier", typedBy: "static let NUTRITION_KEYS: [String: HKQuantityTypeIdentifier] = [" },
      },
      {
        path: "android/src/main/kotlin/cachet/plugins/health/HealthConstants.kt",
        patterns: ["hc-class"],
        region: { start: "val mapToType: Map<String, KClass<out Record>> = hashMapOf(", end: ")" },
      },
    ],
  },
  "health-connector": {
    manifest: "packages/health_connector/pubspec.yaml",
    method:
      "The two platform packages' type mappers: toHKSampleType() and its appleActivityCategoryTypeIdentifier helper in health_connector_hk_ios's HealthDataTypeMapper.swift, and toHealthConnectRecordClass() in health_connector_hc_android's HealthDataTypeMapper.kt.",
    scans: [
      {
        path: "packages/health_connector_hk_ios/ios/health_connector_hk_ios/Sources/health_connector_hk_ios/mappers/HealthDataTypeMapper.swift",
        patterns: ["hk-swift"],
        // HKQuantityType.make(from: .stepCount): the package's own factory,
        // declared per family in utils/HealthKitExtensions.swift.
        familyCall: {
          re: /\bHK(Quantity|Category|Correlation|Characteristic)Type\.make\(\s*from:\s*\.([a-z][A-Za-z0-9]*)\s*\)/g,
          declaredIn: "packages/health_connector_hk_ios/ios/health_connector_hk_ios/Sources/health_connector_hk_ios/utils/HealthKitExtensions.swift",
          typedBy: [
            "static func make(from identifier: HKQuantityTypeIdentifier) throws -> HKQuantityType {",
            "static func make(from identifier: HKCategoryTypeIdentifier) throws -> HKCategoryType {",
            "static func make(from identifier: HKCorrelationTypeIdentifier) throws -> HKCorrelationType {",
          ],
        },
      },
      {
        // Stand hour and walking-steadiness events go through one helper.
        path: "packages/health_connector_hk_ios/ios/health_connector_hk_ios/Sources/health_connector_hk_ios/mappers/HealthDataTypeMapper.swift",
        patterns: [],
        region: { start: "var appleActivityCategoryTypeIdentifier: HKCategoryTypeIdentifier {", end: "}" },
        bare: {
          re: /[?:]\s*\.([a-z][A-Za-z0-9]*)\b/g,
          familyType: "HKCategoryTypeIdentifier",
          typedBy: "var appleActivityCategoryTypeIdentifier: HKCategoryTypeIdentifier {",
        },
      },
      {
        path: "packages/health_connector_hc_android/android/src/main/kotlin/com/phamtunglam/health_connector_hc_android/mappers/HealthDataTypeMapper.kt",
        patterns: ["hc-class"],
      },
    ],
  },
  "health-kit-reporter": {
    manifest: "pubspec.yaml",
    method:
      "The Dart enums' identifier strings in lib/model/type: quantity_type.dart, category_type.dart, characteristic_type.dart and correlation_type.dart.",
    scans: [
      { path: "lib/model/type/quantity_type.dart", patterns: ["hk-objc"] },
      { path: "lib/model/type/category_type.dart", patterns: ["hk-objc"] },
      { path: "lib/model/type/characteristic_type.dart", patterns: ["hk-objc"] },
      { path: "lib/model/type/correlation_type.dart", patterns: ["hk-objc"] },
    ],
  },
  "flutter-health-connect": {
    manifest: "pubspec.yaml",
    method: "HealthConnectRecordTypeMap in Consts.kt, the map from the plugin's type names to record classes.",
    scans: [
      {
        path: "android/src/main/kotlin/dev/duynp/flutter_health_connect/Consts.kt",
        patterns: ["hc-class"],
        region: { start: "val HealthConnectRecordTypeMap = hashMapOf(", end: ")" },
      },
    ],
  },
};

/**
 * Candidates left out, each with the reason and a line that shows it. The
 * quote is checked against the fetched file like every other.
 */
export const EXCLUDED = {
  "expo-health-connect": {
    reason:
      "An Expo config plugin for react-native-health-connect: it edits the Android project and maps no data type itself, so its coverage is react-native-health-connect's.",
    file: "package.json",
    quote: '"description": "Expo config plugin for react-native-health-connect",',
    affectsCompleteness: false,
  },
  "react-native-google-fit": {
    reason:
      "Wraps the Google Fit APIs, neither HealthKit nor Health Connect (libraries.ts records its registry description as naming Google Fit only).",
    file: null,
    quote: null,
    affectsCompleteness: false,
  },
};

/**
 * Matched identifiers per library and store at the last verified read
 * (2026-11-19). Fewer fails the run; more is printed so a reviewer can raise
 * the floor after checking the new rows.
 */
export const EXPECTED = {
  "react-native-health": { healthkit: 80, healthConnect: 0 },
  "kingstinct-react-native-healthkit": { healthkit: 157, healthConnect: 0 },
  "react-native-health-connect": { healthkit: 0, healthConnect: 40 },
  "capacitor-health": { healthkit: 20, healthConnect: 12 },
  "capgo-capacitor-health": { healthkit: 27, healthConnect: 24 },
  "perfood-capacitor-healthkit": { healthkit: 19, healthConnect: 0 },
  "cordova-plugin-health": { healthkit: 52, healthConnect: 26 },
  "flutter-health": { healthkit: 85, healthConnect: 27 },
  "health-connector": { healthkit: 123, healthConnect: 41 },
  "health-kit-reporter": { healthkit: 153, healthConnect: 0 },
  "flutter-health-connect": { healthkit: 0, healthConnect: 38 },
};

/* ─────────────────────────────── parsing ─────────────────────────────── */

/**
 * Split a C-family source file (ObjC, Swift, Kotlin, Java, JS, TS, Dart) into
 * lines with comments removed. String literals are kept — identifier strings
 * are the data in JS, TS and Dart — and a `//` inside one is not a comment.
 * Returns [{ n, raw, code }], n 1-based.
 */
export function codeLines(text) {
  const out = [];
  const lines = text.split("\n");
  let inBlock = false;
  let inStr = null; // the quote char of a string that spans lines (template literals)
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].replace(/\r$/, "");
    let code = "";
    for (let j = 0; j < raw.length; j++) {
      const c = raw[j];
      const d = raw[j + 1];
      if (inBlock) {
        if (c === "*" && d === "/") {
          inBlock = false;
          j++;
        }
        continue;
      }
      if (inStr) {
        code += c;
        if (c === "\\") {
          code += d ?? "";
          j++;
        } else if (c === inStr) inStr = null;
        continue;
      }
      if (c === "/" && d === "/") break;
      if (c === "/" && d === "*") {
        inBlock = true;
        j++;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") inStr = c;
      code += c;
    }
    // Only template literals may span lines; an unclosed ' or " is a
    // character the scanner misread (an apostrophe in a Swift string, say).
    if (inStr && inStr !== "`") inStr = null;
    out.push({ n: i + 1, raw, code });
  }
  return out;
}

/** Lines from the one whose trimmed text is `start` through the first later one whose trimmed text is `end`. */
export function regionOf(lines, region) {
  if (!region) return { lines, problem: null };
  const s = lines.findIndex((l) => l.raw.trim() === region.start);
  if (s < 0) return { lines: [], problem: `region start not found: ${region.start}` };
  const e = lines.findIndex((l, i) => i > s && l.raw.trim() === region.end);
  if (e < 0) return { lines: [], problem: `region end not found after line ${s + 1}: ${region.end}` };
  return { lines: lines.slice(s, e + 1), problem: null };
}

const FAMILY = (kind) => `HK${kind[0].toUpperCase()}${kind.slice(1)}TypeIdentifier`;

const PATTERNS = {
  "hk-objc": [{ re: /\bHK(Quantity|Category|Characteristic|Correlation)TypeIdentifier([A-Z][A-Za-z0-9]*)\b/g, kind: "objc" }],
  "hk-swift": [
    { re: /\bHK(Quantity|Category|Characteristic|Correlation)TypeIdentifier\.([a-z][A-Za-z0-9]*)\b/g, kind: "swift" },
    { re: /\b(quantity|category|characteristic|correlation)Type\(\s*forIdentifier:\s*\.([a-z][A-Za-z0-9]*)\b/g, kind: "swift" },
    { re: /\bHK(Quantity|Category|Correlation)Type\(\s*\.([a-z][A-Za-z0-9]*)\s*\)/g, kind: "swift" },
  ],
  "hc-import": [{ re: /^\s*import\s+androidx\.health\.connect\.client\.records\.([A-Z][A-Za-z0-9]*Record)\s*;?\s*$/g, kind: "hc" }],
  "hc-class": [{ re: /\b([A-Z][A-Za-z0-9]*Record)(?:::class|\.class)\b/g, kind: "hc" }],
};

/**
 * Every token a scan's patterns find, in line order:
 * [{ store, token, family?, swiftCase?, line, raw }].
 */
export function extract(lines, scan) {
  const hits = [];
  const add = (store, m, line, extra) => hits.push({ store, token: m, line: line.n, raw: line.raw, ...extra });
  for (const line of lines) {
    const found = [];
    for (const p of scan.patterns.flatMap((k) => PATTERNS[k] ?? (() => { throw new Error(`unknown pattern ${k}`); })())) {
      p.re.lastIndex = 0;
      for (const m of line.code.matchAll(p.re)) {
        if (p.kind === "objc") found.push({ at: m.index, store: "healthkit", token: m[0], extra: { objc: m[0] } });
        else if (p.kind === "swift") found.push({ at: m.index, store: "healthkit", token: m[0], extra: { familyType: FAMILY(m[1]), swiftCase: m[2] } });
        else found.push({ at: m.index, store: "healthConnect", token: m[1], extra: { className: m[1] } });
      }
    }
    if (scan.bare) {
      scan.bare.re.lastIndex = 0;
      for (const m of line.code.matchAll(scan.bare.re)) found.push({ at: m.index, store: "healthkit", token: m[0].trim(), extra: { familyType: scan.bare.familyType, swiftCase: m[1] } });
    }
    if (scan.familyCall) {
      scan.familyCall.re.lastIndex = 0;
      for (const m of line.code.matchAll(scan.familyCall.re)) found.push({ at: m.index, store: "healthkit", token: m[0], extra: { familyType: FAMILY(m[1]), swiftCase: m[2] } });
    }
    // One token per position: a qualified Swift name inside a typed call is
    // found by two patterns.
    const seen = new Set();
    for (const f of found.sort((a, b) => a.at - b.at)) {
      const key = `${f.store}|${f.extra.objc ?? f.extra.className ?? `${f.extra.familyType}.${f.extra.swiftCase}`}|${f.at}`;
      if (seen.has(key)) continue;
      seen.add(key);
      add(f.store, f.token, line, f.extra);
    }
  }
  return hits;
}

/** Index the site's canonical lists for exact matching. */
export function canonical(hkIdentifiers, hcRecords) {
  const hk = hkIdentifiers.filter((i) => ["quantity", "category", "characteristic"].includes(i.family));
  return {
    hkByObjc: new Map(hk.map((i) => [i.objc, i])),
    hkBySwift: new Map(hk.map((i) => [`${i.familyType}.${i.case}`, i])),
    hcByClass: new Map(hcRecords.map((r) => [r.className, r])),
  };
}

/** The canonical row a hit names, by exact match only; null otherwise. */
export function resolve(hit, canon) {
  if (hit.store === "healthConnect") return canon.hcByClass.get(hit.className) ?? null;
  if (hit.objc) return canon.hkByObjc.get(hit.objc) ?? null;
  return canon.hkBySwift.get(`${hit.familyType}.${hit.swiftCase}`) ?? null;
}

/** The tag that names a registry version, peeled to its commit; null when the repository has none. */
export function pickTag(refs, version, name) {
  const bare = name.replace(/^@[^/]+\//, "");
  const names = [`v${version}`, version, `${name}-v${version}`, `${name}@${version}`, `${bare}-v${version}`, `${bare}@${version}`];
  for (const t of names) {
    const peeled = refs.get(`refs/tags/${t}^{}`);
    const direct = refs.get(`refs/tags/${t}`);
    if (peeled || direct) return { tag: t, sha: peeled ?? direct };
  }
  return null;
}

/** Problems with a library's matched counts against its floor. */
export function countProblems(slug, counts, expected) {
  const out = [];
  if (!expected) return [`${slug}: no EXPECTED entry`];
  for (const store of ["healthkit", "healthConnect"]) {
    if (counts[store] < expected[store]) out.push(`${slug}: ${counts[store]} ${store} identifiers matched, expected at least ${expected[store]} — a short parse`);
  }
  return out;
}

const collapse = (s) => s.replace(/\s+/g, " ").trim();

/* ─────────────────────────────── fetching ────────────────────────────── */

const sha256 = (s) => createHash("sha256").update(s).digest("hex");

function lsRemote(repo) {
  const out = execFileSync("git", ["ls-remote", `https://github.com/${repo}`, "HEAD", "refs/tags/*"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 60000,
  });
  const refs = new Map();
  for (const line of out.trim().split("\n")) {
    const [sha, ref] = line.split("\t");
    if (sha && ref) refs.set(ref, sha);
  }
  return refs;
}

async function readRaw(meta, slug, repo, sha, path, offline) {
  const url = `https://raw.githubusercontent.com/${repo}/${sha}/${path}`;
  const file = join(CACHE, slug, sha.slice(0, 12), path.replace(/[^A-Za-z0-9._-]/g, "_"));
  if (existsSync(file) && meta.files[url]) return readFileSync(file, "utf8");
  if (offline) throw new Error(`offline and ${file} is not cached`);
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "aifitnessapi-generator (+https://aifitnessapi.com)" } });
      if (!res.ok) throw new Error(`${res.status} for ${url}`);
      const text = await res.text();
      mkdirSync(join(CACHE, slug, sha.slice(0, 12)), { recursive: true });
      writeFileSync(file, text);
      meta.files[url] = { fetchedOn: new Date().toISOString().slice(0, 10), sha256: sha256(text) };
      writeFileSync(META, JSON.stringify(meta, null, 2));
      return text;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

/* ───────────────────────────────── main ──────────────────────────────── */

async function main() {
  const OFFLINE = process.argv.includes("--offline");
  mkdirSync(CACHE, { recursive: true });
  const meta = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};
  meta.pins ??= {};
  meta.files ??= {};
  const problems = [];

  const { LIBRARIES } = await loadTs("src/data/libraries.ts");
  const { HK_IDENTIFIERS, HK_FETCHED_ON } = await loadTs("src/data/healthkitIdentifiers.ts");
  const { HC_RECORDS, HC_FETCHED_ON } = await loadTs("src/data/healthConnectRecords.ts");
  const canon = canonical(HK_IDENTIFIERS, HC_RECORDS);

  const candidates = LIBRARIES.filter((l) => l.group !== "python");
  for (const l of candidates) {
    if (!LIBS[l.slug] && !EXCLUDED[l.slug]) problems.push(`${l.slug}: a mobile library in libraries.ts with no LIBS or EXCLUDED entry`);
  }
  for (const slug of [...Object.keys(LIBS), ...Object.keys(EXCLUDED)]) {
    if (!candidates.some((l) => l.slug === slug)) problems.push(`${slug}: configured here but not a mobile library in libraries.ts`);
  }

  const covered = [];
  const excluded = [];

  for (const l of candidates) {
    const cfg = LIBS[l.slug];
    const ex = EXCLUDED[l.slug];
    const repo = l.repoFullName ?? l.repo;
    if (!repo) {
      problems.push(`${l.slug}: libraries.ts names no repository`);
      continue;
    }

    // Pin.
    let pin = meta.pins[l.slug];
    if (!OFFLINE) {
      const refs = lsRemote(repo);
      const head = refs.get("HEAD");
      if (!head) {
        problems.push(`${l.slug}: git ls-remote returned no HEAD for ${repo}`);
        continue;
      }
      const t = pickTag(refs, l.latestVersion, l.name);
      pin = t
        ? { kind: "tag", tag: t.tag, sha: t.sha, readOn: new Date().toISOString().slice(0, 10) }
        : { kind: "head", tag: null, sha: head, readOn: new Date().toISOString().slice(0, 10) };
      meta.pins[l.slug] = pin;
      writeFileSync(META, JSON.stringify(meta, null, 2));
    }
    if (!pin) {
      problems.push(`${l.slug}: offline and no pin cached`);
      continue;
    }
    const blob = (path, line) => `https://github.com/${repo}/blob/${pin.sha}/${path}${line ? `#L${line}` : ""}`;

    if (ex) {
      let evidence = null;
      if (ex.file) {
        const text = await readRaw(meta, l.slug, repo, pin.sha, ex.file, OFFLINE);
        const ln = codeLines(text).find((x) => collapse(x.raw) === collapse(ex.quote));
        if (!ln) problems.push(`${l.slug}: exclusion quote not found in ${ex.file}: ${ex.quote}`);
        else evidence = { path: ex.file, line: ln.n, quote: ln.raw.trim(), url: blob(ex.file, ln.n) };
      }
      excluded.push({ slug: l.slug, name: l.name, reason: ex.reason, affectsCompleteness: ex.affectsCompleteness, evidence });
      continue;
    }

    // Manifest version at the pin.
    const manifestText = await readRaw(meta, l.slug, repo, pin.sha, cfg.manifest, OFFLINE);
    const vLine = codeLines(manifestText).find((x) => (cfg.manifest.endsWith(".json") ? /^\s*"version":\s*"[^"]+"/ : /^version:\s*\S+/).test(x.raw));
    const sourceVersion = vLine ? (/"version":\s*"([^"]+)"/.exec(vLine.raw) ?? /^version:\s*(\S+)/.exec(vLine.raw))[1] : null;
    if (!vLine) problems.push(`${l.slug}: no version line in ${cfg.manifest}`);

    const files = [];
    const items = new Map();
    const unmatched = new Map();
    for (const scan of cfg.scans) {
      const text = await readRaw(meta, l.slug, repo, pin.sha, scan.path, OFFLINE);
      const all = codeLines(text);
      if (!files.some((f) => f.path === scan.path)) {
        const url = `https://raw.githubusercontent.com/${repo}/${pin.sha}/${scan.path}`;
        files.push({ path: scan.path, url: blob(scan.path), sha256: meta.files[url]?.sha256 ?? null, fetchedOn: meta.files[url]?.fetchedOn ?? null });
      }
      const { lines, problem } = regionOf(all, scan.region);
      if (problem) {
        problems.push(`${l.slug}: ${scan.path}: ${problem}`);
        continue;
      }
      // A bare `.case` pattern needs the declaration that fixes its family.
      if (scan.bare && !all.some((x) => collapse(x.raw) === collapse(scan.bare.typedBy))) {
        problems.push(`${l.slug}: ${scan.path}: bare members are typed by "${scan.bare.typedBy}", which the file does not contain`);
        continue;
      }
      if (scan.familyCall) {
        const decl = codeLines(await readRaw(meta, l.slug, repo, pin.sha, scan.familyCall.declaredIn, OFFLINE));
        const missing = scan.familyCall.typedBy.filter((q) => !decl.some((x) => collapse(x.raw) === collapse(q)));
        if (missing.length) {
          problems.push(`${l.slug}: ${scan.familyCall.declaredIn} does not declare ${missing.join("; ")}`);
          continue;
        }
      }
      for (const hit of extract(lines, scan)) {
        const row = resolve(hit, canon);
        const where = { path: scan.path, line: hit.line, quote: hit.raw.trim(), url: blob(scan.path, hit.line) };
        if (!row) {
          const k = `${hit.store}|${hit.token}`;
          const u = unmatched.get(k);
          if (u) u.occurrences++;
          else unmatched.set(k, { store: hit.store, token: hit.token, ...where, occurrences: 1 });
          continue;
        }
        const id = hit.store === "healthkit" ? row.objc : row.className;
        const k = `${hit.store}|${id}`;
        const it = items.get(k);
        if (it) it.occurrences++;
        else
          items.set(k, {
            store: hit.store,
            id,
            name: hit.store === "healthkit" ? row.case : row.className,
            family: hit.store === "healthkit" ? row.family : null,
            token: hit.token,
            ...where,
            occurrences: 1,
          });
      }
    }

    const hk = [...items.values()].filter((i) => i.store === "healthkit").sort((a, b) => a.id.localeCompare(b.id));
    const hc = [...items.values()].filter((i) => i.store === "healthConnect").sort((a, b) => a.id.localeCompare(b.id));
    const counts = { healthkit: hk.length, healthConnect: hc.length, unmatched: unmatched.size };
    problems.push(...countProblems(l.slug, counts, EXPECTED[l.slug]));
    const exp = EXPECTED[l.slug];
    if (exp && (counts.healthkit > exp.healthkit || counts.healthConnect > exp.healthConnect)) {
      console.log(`  note: ${l.slug} matched ${counts.healthkit} HealthKit / ${counts.healthConnect} Health Connect, above the floor ${exp.healthkit} / ${exp.healthConnect}; raise EXPECTED after checking.`);
    }
    covered.push({
      slug: l.slug,
      name: l.name,
      group: l.group,
      repo,
      repoUrl: `https://github.com/${repo}`,
      ref: { kind: pin.kind, tag: pin.tag, sha: pin.sha, readOn: pin.readOn },
      registryVersion: l.latestVersion,
      sourceVersion,
      sourceVersionEvidence: vLine ? { path: cfg.manifest, line: vLine.n, quote: vLine.raw.trim(), url: blob(cfg.manifest, vLine.n) } : null,
      stores: [...(cfg.scans.some((s) => s.patterns.some((p) => p.startsWith("hk")) || s.bare || s.familyCall) ? ["healthkit"] : []), ...(cfg.scans.some((s) => s.patterns.some((p) => p.startsWith("hc"))) ? ["healthConnect"] : [])],
      method: cfg.method,
      files,
      counts,
      healthkit: hk,
      healthConnect: hc,
      unmatched: [...unmatched.values()].sort((a, b) => a.token.localeCompare(b.token)),
    });
  }

  if (problems.length) {
    console.error("REFUSING TO WRITE — a source moved, a pin failed, or a parse came up short:");
    for (const p of problems) console.error("  - " + p);
    process.exit(1);
  }

  for (const e of excluded) console.log(`  left out: ${e.slug} — ${e.reason}`);

  // A negative claim ("no tracked library maps this type") holds for a store
  // only when every library that could map it was parsed.
  const complete = {
    healthkit: !excluded.some((e) => e.affectsCompleteness),
    healthConnect: !excluded.some((e) => e.affectsCompleteness),
  };
  const fetchedOn = Object.values(meta.files).map((f) => f.fetchedOn).sort().at(-1);

  const body = `/**
 * Which HealthKit identifiers and Health Connect record classes each mobile
 * wrapper library in src/data/libraries.ts maps, read from the library's own
 * source at a pinned commit, each with the file, line and verbatim line.
 *
 * GENERATED — do not hand-edit; regenerate with
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-health-library-support.mjs
 * (then \`npm run datasets\`). Files read: ${fetchedOn}
 *
 * A row counts only when its token is exactly an identifier in
 * src/data/healthkitIdentifiers.ts (read ${HK_FETCHED_ON}) or a class in
 * src/data/healthConnectRecords.ts (read ${HC_FETCHED_ON}); everything else the
 * patterns found is in \`unmatched\`. \`method\` names the files read per
 * library: the support list is what those files map, not a test of every API
 * call the library makes.
 */

/** The date the generator last read a source file. */
export const HEALTH_LIBRARY_SUPPORT_FETCHED_ON = ${JSON.stringify(fetchedOn)};

export type LibrarySourceLine = {
  path: string;
  line: number;
  /** The source line, verbatim (trimmed). */
  quote: string;
  /** The line on GitHub at the pinned commit. */
  url: string;
};

export type LibrarySupportItem = LibrarySourceLine & {
  store: "healthkit" | "healthConnect";
  /** HealthKit: the Objective-C constant; Health Connect: the class name. */
  id: string;
  /** HealthKit: the Swift case; Health Connect: the class name. */
  name: string;
  /** HealthKit identifier family; null for Health Connect. */
  family: "quantity" | "category" | "characteristic" | null;
  /** The text the pattern matched on that line. */
  token: string;
  /** Lines in the scanned files that name it. */
  occurrences: number;
};

export type LibraryUnmatched = LibrarySourceLine & {
  store: "healthkit" | "healthConnect";
  token: string;
  occurrences: number;
};

export type LibrarySupport = {
  slug: string;
  name: string;
  group: string;
  repo: string;
  repoUrl: string;
  /** The commit read: the release tag's, or the default branch head where no tag names the registry version. */
  ref: { kind: "tag" | "head"; tag: string | null; sha: string; readOn: string };
  registryVersion: string;
  /** The version in the package's own manifest at that commit. */
  sourceVersion: string | null;
  sourceVersionEvidence: LibrarySourceLine | null;
  stores: ("healthkit" | "healthConnect")[];
  /** Which files were read and why they hold the mapping. */
  method: string;
  files: { path: string; url: string; sha256: string | null; fetchedOn: string | null }[];
  counts: { healthkit: number; healthConnect: number; unmatched: number };
  healthkit: LibrarySupportItem[];
  healthConnect: LibrarySupportItem[];
  unmatched: LibraryUnmatched[];
};

export const HEALTH_LIBRARY_SUPPORT: LibrarySupport[] = ${JSON.stringify(covered, null, 2)};

export type LibrarySupportExcluded = {
  slug: string;
  name: string;
  reason: string;
  /** True when leaving it out makes a "no library maps this" statement unsafe. */
  affectsCompleteness: boolean;
  evidence: LibrarySourceLine | null;
};

export const HEALTH_LIBRARY_SUPPORT_EXCLUDED: LibrarySupportExcluded[] = ${JSON.stringify(excluded, null, 2)};

/** Per store: true when every candidate library that could map it was parsed. */
export const HEALTH_LIBRARY_SUPPORT_COMPLETE: { healthkit: boolean; healthConnect: boolean } = ${JSON.stringify(complete)};
`;
  writeFileSync(OUT, body);
  const sum = covered.map((c) => `${c.slug} ${c.ref.kind === "tag" ? c.ref.tag : `head ${c.ref.sha.slice(0, 12)}`}: ${c.counts.healthkit} HK / ${c.counts.healthConnect} HC / ${c.counts.unmatched} unmatched`);
  console.log(`✓ ${OUT}: ${covered.length} libraries, ${excluded.length} left out.\n  ${sum.join("\n  ")}`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
