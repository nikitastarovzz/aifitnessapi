#!/usr/bin/env node
/**
 * Regenerate src/data/healthkitMetadataKeys.ts from Apple's own documentation.
 *
 * Apple serves the JSON that powers developer.apple.com at
 * /tutorials/data/documentation/..., so this reads the same bytes the docs
 * render:
 *
 *   1. The "Metadata Keys" collection (metadata-keys.json). Its topic
 *      sections are Apple's own grouping ("General Keys", "Weather Keys", …).
 *      One entry, "Workout Keys", is itself a collection
 *      (workout-metadata-keys.json) with its own topic sections; those keys
 *      keep "Workout Keys" as their group and carry the sub-collection's
 *      section as `subgroup`.
 *   2. One JSON per key, followed from the collection's own `references`
 *      url (never rebuilt from the name).
 *
 * The collections also file a few symbols that are not HKMetadataKey
 * constants (an enum such as HKDevicePlacementSide, predicate key paths such
 * as HKPredicateKeyPathAverageHeartRate). Those are not keys, so they are not
 * rows; they are listed in HK_METADATA_OTHER_SYMBOLS with the group Apple put
 * them in, so the count of keys can be checked against Apple's page.
 *
 * No model in this loop. Every field is copied from Apple's JSON except one,
 * which is derived by a literal match against Apple's own sentence:
 *
 *   valueType — what a key's VALUE is (the key itself is always a String /
 *     NSString constant). Apple states it in prose, e.g. "This key takes an
 *     NSNumber containing an HKHeartRateSensorLocation as its value." The
 *     first sentence of the abstract or discussion that both names a value
 *     and names a type is the evidence; it is stored verbatim in
 *     `valueTypeEvidence`, and `valueType` is the first type that sentence
 *     names (see VALUE_TYPES). Both are null where Apple does not say. We do
 *     not guess.
 *
 * Deprecation is read from the platform entries' `deprecatedAt` as well as
 * the `deprecated` boolean — Apple sets the former and leaves the latter
 * false (see scripts/fetch-healthkit-identifiers.mjs).
 *
 * Usage: node scripts/fetch-healthkit-metadata-keys.mjs [--offline]
 *   --offline reparses the cache in .cache/healthkit-metadata-keys without
 *   refetching.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ORIGIN = "https://developer.apple.com";
const DATA = `${ORIGIN}/tutorials/data`;
const INDEX_PATH = "/documentation/healthkit/metadata-keys";
const CACHE = ".cache/healthkit-metadata-keys";
const META = join(CACHE, "meta.json");
const OUT = "src/data/healthkitMetadataKeys.ts";
const OFFLINE = process.argv.includes("--offline");

// Floor = the count of the last verified read (2026-10-04): 67 HKMetadataKey
// constants (45 on the Metadata Keys page itself, 22 in its Workout Metadata
// Keys sub-collection) across 15 topic groups, plus 5 non-key symbols Apple
// files beside them (HKDevicePlacementSide, HKAppleECGAlgorithmVersion and
// three HKPredicateKeyPath… constants). Raise after a verified read;
// lower only after confirming on Apple's site that a key really was removed —
// never to get a write through.
const EXPECTED_MIN_KEYS = 67;
const EXPECTED_MIN_GROUPS = 15;

mkdirSync(CACHE, { recursive: true });
const meta = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};

/** Every URL read this run, in order. */
const fetched = [];

async function getJson(url, cacheFile) {
  const path = join(CACHE, cacheFile);
  fetched.push(url);
  if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  if (OFFLINE) throw new Error(`offline and ${path} is not cached`);
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} for ${url}`);
      const text = await res.text();
      const json = JSON.parse(text);
      writeFileSync(path, text);
      meta[cacheFile] = { url, fetchedOn: new Date().toISOString().slice(0, 10) };
      writeFileSync(META, JSON.stringify(meta, null, 2));
      await new Promise((r) => setTimeout(r, 150));
      return json;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

const problems = [];

/** Apple inline content → text, resolving symbol links to their titles. */
function linkedText(nodes, refs) {
  let out = "";
  for (const n of nodes || []) {
    if (!n || typeof n !== "object") continue;
    if (n.type === "text") out += n.text ?? "";
    else if (n.type === "codeVoice") out += n.code ?? "";
    else if (n.type === "reference") out += refs?.[n.identifier]?.title ?? String(n.identifier).split("/").pop();
    else if (n.inlineContent) out += linkedText(n.inlineContent, refs);
  }
  return out;
}
const clean = (s) => s.replace(/\s+/g, " ").trim();

/** Discussion paragraphs (asides prefixed with their name). An unhandled node
 *  shape is a problem, not a silent hole in the published text. */
function discussionOf(doc, label) {
  const refs = doc.references || {};
  const paras = [];
  for (const sec of doc.primaryContentSections || []) {
    if (sec.kind !== "content") continue;
    for (const node of sec.content || []) {
      if (node.type === "heading") continue;
      if (node.type === "paragraph") {
        const t = clean(linkedText(node.inlineContent, refs));
        if (t) paras.push(t);
      } else if (node.type === "aside") {
        const inner = (node.content || [])
          .filter((c) => c.type === "paragraph")
          .map((c) => clean(linkedText(c.inlineContent, refs)))
          .filter(Boolean)
          .join(" ");
        if (inner) paras.push(`${node.name || node.style || "Note"}: ${inner}`);
      } else if (node.type === "unorderedList" || node.type === "orderedList") {
        for (const item of node.items || []) {
          const t = clean(
            (item.content || [])
              .filter((c) => c.type === "paragraph")
              .map((c) => linkedText(c.inlineContent, refs))
              .join(" "),
          );
          if (t) paras.push(`• ${t}`);
        }
      } else {
        problems.push(`${label}: discussion has an unhandled "${node.type}" node`);
      }
    }
  }
  return paras;
}

function platformOf(p) {
  return {
    name: p.name,
    introducedAt: p.introducedAt ?? null,
    deprecated: Boolean(p.deprecated) || p.deprecatedAt != null,
    deprecatedAt: p.deprecatedAt ?? null,
    beta: Boolean(p.beta),
  };
}

/**
 * The value types a sentence can name. `valueType` is the label of the type
 * mentioned EARLIEST after the sentence's value cue, so "an NSNumber
 * containing an HKHeartRateSensorLocation" is NSNumber, and "a string value
 * compatible with the NSTimeZone class" is NSString. Labels follow Apple's
 * Objective-C class names; Apple's own word is in the evidence sentence.
 */
const VALUE_TYPES = [
  { label: "HKQuantity", re: /\bHKQuantity\b/ },
  { label: "NSNumber", re: /\bNSNumber\b/ },
  { label: "NSString", re: /\b(NSString|String|string)\b/ },
  { label: "NSDate", re: /\b(NSDate|Date)\b/ },
  { label: "Boolean", re: /\bBoolean\b/ },
];
/** A sentence states a value type only if it carries one of these cues and a
 *  VALUE_TYPES match follows the cue. */
const VALUE_CUE = /\b(this key takes|it takes|the value of this key is|set (?:its|it’s|it's|this key’s|this key's) value to)\b/i;
/** Apple's Boolean keys say so without naming a type: "Set this key’s value
 *  to true if …; otherwise, set it to false." Literal true/false values are
 *  a statement that the value is a Boolean, so that sentence is the evidence. */
// No \b before "false": one of Apple's pages renders "set it tofalse".
const BOOLEAN_CUE = /\bvalue to true\b[^.]*false\b/;

function valueTypeOf(sentences) {
  for (const s of sentences) {
    const cue = VALUE_CUE.exec(s);
    if (cue) {
      // The type must appear after the cue: "Set its value to an HKQuantity"
      // names it; "the value of an HKQuantity sample" elsewhere does not.
      const tail = s.slice(cue.index + cue[0].length);
      let best = null;
      for (const t of VALUE_TYPES) {
        const m = t.re.exec(tail);
        if (m && (best === null || m.index < best.index)) best = { label: t.label, index: m.index };
      }
      if (best) return { valueType: best.label, evidence: s };
    }
    if (BOOLEAN_CUE.test(s)) return { valueType: "Boolean", evidence: s };
  }
  return { valueType: null, evidence: null };
}
const sentencesOf = (text) =>
  text
    // Apple sometimes drops the space after a full stop ("…value.Medical
    // professionals…"), so a capitalised word straight after a lowercase
    // word's full stop also starts a sentence.
    .split(/(?<=[.!?])\s+(?=[A-Z“"])|(?<=[a-z]\.)(?=[A-Z][a-z]+\s)/)
    .map((s) => s.trim())
    .filter(Boolean);

// ── 1. Walk Apple's collection(s) ──────────────────────────────────────────
const index = await getJson(`${DATA}${INDEX_PATH}.json`, "metadata-keys.json");
const indexAbstract = clean(linkedText(index.abstract, index.references));

/** {name, group, subgroup, url} for every symbol Apple files, in Apple's
 *  order — a sub-collection's symbols sit where the sub-collection is filed. */
const filed = [];
/** Apple's topic group titles, in order. */
const groupOrder = [];
for (const sec of index.topicSections || []) {
  groupOrder.push(sec.title);
  for (const id of sec.identifiers || []) {
    const ref = index.references?.[id];
    if (!ref?.url) {
      problems.push(`index: ${id} has no url in references`);
      continue;
    }
    if (ref.kind !== "article" && ref.role !== "collectionGroup") {
      filed.push({ name: ref.title, group: sec.title, subgroup: null, url: ref.url });
      continue;
    }
    const slug = ref.url.split("/").pop();
    const doc = await getJson(`${DATA}${ref.url}.json`, `${slug}.json`);
    for (const sub of doc.topicSections || []) {
      for (const subId of sub.identifiers || []) {
        const r = doc.references?.[subId];
        if (!r?.url) {
          problems.push(`${slug}: ${subId} has no url in references`);
          continue;
        }
        if (r.kind === "article" || r.role === "collectionGroup") {
          problems.push(`${slug}: nested collection ${r.title} — the walker only descends one level`);
          continue;
        }
        filed.push({ name: r.title, group: sec.title, subgroup: sub.title, url: r.url });
      }
    }
  }
}

const isKey = (name) => /^HKMetadataKey[A-Z0-9]/.test(name);
const otherSymbols = [];
const seen = new Map();
const keyEntries = [];
for (const f of filed) {
  if (!isKey(f.name)) {
    otherSymbols.push(f);
    continue;
  }
  if (seen.has(f.name)) {
    seen.get(f.name).alsoIn.push(f.subgroup ? `${f.group} › ${f.subgroup}` : f.group);
    continue;
  }
  const e = { ...f, alsoIn: [] };
  seen.set(f.name, e);
  keyEntries.push(e);
}

// ── 2. One JSON per key ────────────────────────────────────────────────────
const rows = [];
for (const k of keyEntries) {
  const slug = k.url.split("/").pop();
  const doc = await getJson(`${DATA}${k.url}.json`, `${slug}.json`);
  const md = doc.metadata || {};
  const refs = doc.references || {};
  const swiftName = md.title ?? null;
  if (swiftName !== k.name) problems.push(`${k.name}: page title is ${swiftName}`);
  let objcName = null;
  const declarations = [];
  const declOf = (sec) => {
    for (const d of sec?.declarations || []) {
      declarations.push({ language: (d.languages || []).join(","), text: (d.tokens || []).map((t) => t.text).join("") });
    }
  };
  for (const sec of doc.primaryContentSections || []) if (sec.kind === "declarations") declOf(sec);
  for (const v of doc.variantOverrides || []) {
    const occ = (v.traits || []).some((t) => t.interfaceLanguage === "occ");
    for (const p of v.patch || []) {
      if (occ && p.path === "/metadata/title" && typeof p.value === "string") objcName = p.value;
      if (p.path === "/primaryContentSections/0" && p.value?.kind === "declarations") declOf(p.value);
    }
  }
  if (!declarations.length) problems.push(`${k.name}: no declaration parsed`);
  const abstract = clean(linkedText(doc.abstract, refs)) || null;
  const paras = discussionOf(doc, k.name);
  const platforms = (md.platforms || []).map(platformOf);
  const deprecated = platforms.some((p) => p.deprecated);
  const summary = clean(
    (doc.deprecationSummary || []).map((node) => linkedText(node.inlineContent ?? [node], refs)).join(" "),
  );
  if (!deprecated && summary) problems.push(`${k.name}: deprecation note but no platform marks it deprecated`);
  const vt = valueTypeOf(sentencesOf([abstract ?? "", ...paras].join(" ")));
  rows.push({
    swiftName,
    objcName,
    group: k.group,
    subgroup: k.subgroup,
    alsoIn: k.alsoIn,
    roleHeading: md.roleHeading ?? null,
    abstract,
    discussion: paras.join(" ") || null,
    valueType: vt.valueType,
    valueTypeEvidence: vt.evidence,
    platforms,
    deprecated,
    deprecation: deprecated ? { message: summary || null } : null,
    declarations,
    docUrl: `${ORIGIN}${k.url}`,
  });
}

// ── Integrity gates ────────────────────────────────────────────────────────
// Apple's group order, keeping only groups that hold at least one key.
const groups = groupOrder.filter((g) => rows.some((r) => r.group === g));
const emptyGroups = groupOrder.filter((g) => !groups.includes(g));
if (emptyGroups.length) console.log(`note: topic groups holding no HKMetadataKey constant: ${emptyGroups.join(", ")}`);
if (rows.length < EXPECTED_MIN_KEYS) problems.push(`only ${rows.length} keys parsed (expected >= ${EXPECTED_MIN_KEYS})`);
if (groups.length < EXPECTED_MIN_GROUPS) problems.push(`only ${groups.length} topic groups (expected >= ${EXPECTED_MIN_GROUPS})`);
const noPlatforms = rows.filter((r) => r.platforms.length === 0);
if (noPlatforms.length) problems.push(`keys with no platform data: ${noPlatforms.map((r) => r.swiftName)}`);
const noObjc = rows.filter((r) => !r.objcName);
if (noObjc.length) problems.push(`keys with no Objective-C variant title: ${noObjc.map((r) => r.swiftName)}`);
const discNoAbstract = rows.filter((r) => !r.abstract && r.discussion);
if (discNoAbstract.length) problems.push(`keys with a discussion but no abstract (abstract parse broken?): ${discNoAbstract.map((r) => r.swiftName)}`);
const noAbstract = rows.filter((r) => !r.abstract);
if (noAbstract.length > rows.length / 4) problems.push(`${noAbstract.length} keys with no abstract — more than a quarter; check Apple's payload shape`);
for (const r of rows) {
  if ((r.valueType === null) !== (r.valueTypeEvidence === null)) problems.push(`${r.swiftName}: valueType and its evidence disagree on null`);
  if (r.valueTypeEvidence && !`${r.abstract ?? ""} ${r.discussion ?? ""}`.includes(r.valueTypeEvidence))
    problems.push(`${r.swiftName}: valueType evidence is not a substring of Apple's text`);
}
if (problems.length) {
  console.error("REFUSING TO WRITE — Apple's payload shape may have changed:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

const fetchedOn = meta["metadata-keys.json"]?.fetchedOn ?? new Date().toISOString().slice(0, 10);
const SOURCE = `${ORIGIN}${INDEX_PATH}`;

const body = `/**
 * HealthKit metadata keys (HKMetadataKey… constants), read from Apple's own
 * documentation JSON.
 *
 * GENERATED — do not hand-edit; regenerate with node scripts/fetch-healthkit-metadata-keys.mjs
 *
 * Source: ${SOURCE} (and its Workout Metadata Keys sub-collection, and each
 * key's own page)
 * Fetched: ${fetchedOn}
 *
 * The one derived field is \`valueType\`, copied from Apple's sentence that
 * names what the key's value is; that sentence is stored beside it in
 * \`valueTypeEvidence\`. Both are null where Apple does not say.
 */

/** The date the generator last read the sources (the index's fetch date). */
export const HK_METADATA_KEYS_FETCHED_ON = ${JSON.stringify(fetchedOn)};

/** The page this file was read from. */
export const HK_METADATA_KEYS_SOURCE = ${JSON.stringify(SOURCE)};

/** Apple's abstract for the Metadata Keys collection, verbatim. */
export const HK_METADATA_KEYS_ABSTRACT = ${JSON.stringify(indexAbstract)};

/** Apple's topic groups, in Apple's order. */
export const HK_METADATA_KEY_GROUPS: string[] = ${JSON.stringify(groups, null, 2)};

export type HkMetadataKeyPlatform = {
  name: string;
  introducedAt: string | null;
  deprecated: boolean;
  /** The evidence for \`deprecated\`; null where Apple gives none. */
  deprecatedAt: string | null;
  beta: boolean;
};

export type HkMetadataKey = {
  /** The Swift name, e.g. "HKMetadataKeyExternalUUID". */
  swiftName: string;
  /** The Objective-C name from Apple's occ variant. */
  objcName: string | null;
  /** Apple's topic group on the Metadata Keys page. */
  group: string;
  /** The section inside a sub-collection (Workout Keys only); else null. */
  subgroup: string | null;
  /** Other groups Apple also files the key under. */
  alsoIn: string[];
  /** Apple's role heading ("Global Variable"). */
  roleHeading: string | null;
  /** Apple's abstract, verbatim; null when Apple publishes none. */
  abstract: string | null;
  /** Apple's discussion, symbol links resolved to names; null when none. */
  discussion: string | null;
  /** Derived: the value type \`valueTypeEvidence\` names. Null when unstated. */
  valueType: string | null;
  /** Apple's sentence \`valueType\` was read from, verbatim. */
  valueTypeEvidence: string | null;
  platforms: HkMetadataKeyPlatform[];
  deprecated: boolean;
  deprecation: { message: string | null } | null;
  /** Declarations as Apple prints them ("swift", "occ"). */
  declarations: { language: string; text: string }[];
  docUrl: string;
};

/** Every HKMetadataKey constant, in Apple's topic order. */
export const HK_METADATA_KEYS: HkMetadataKey[] = ${JSON.stringify(rows, null, 2)};

/** Symbols Apple files on the same pages that are not HKMetadataKey
 *  constants (enums, predicate key paths). Not rows; listed for the count. */
export const HK_METADATA_OTHER_SYMBOLS: { name: string; group: string; subgroup: string | null; url: string }[] = ${JSON.stringify(
  otherSymbols.map((s) => ({ name: s.name, group: s.group, subgroup: s.subgroup, url: `${ORIGIN}${s.url}` })),
  null,
  2,
)};
`;
writeFileSync(OUT, body);
const withType = rows.filter((r) => r.valueType).length;
console.log(
  `wrote ${OUT}: ${rows.length} keys in ${groups.length} groups; ${withType} with a stated value type; ${noAbstract.length} without an abstract; ${rows.filter((r) => r.deprecated).length} deprecated; ${otherSymbols.length} other symbols`,
);
console.log("fetched:");
for (const u of [...new Set(fetched)]) console.log("  " + u);
