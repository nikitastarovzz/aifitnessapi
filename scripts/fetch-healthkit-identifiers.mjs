#!/usr/bin/env node
/**
 * Regenerate src/data/healthkitIdentifiers.ts from Apple's own documentation.
 *
 * Apple serves the JSON that powers developer.apple.com at
 * /tutorials/data/documentation/..., so this reads the same bytes the docs
 * render. There is no model in this loop: every published field is either
 * copied from Apple's JSON or derived by a literal substring match against
 * Apple's own sentence, and that sentence is stored beside the derived value
 * so any claim on the site can be traced back to the wording it came from.
 *
 * Two fields are derived rather than copied:
 *
 *   aggregation  — "cumulative" or "discrete". Apple states this in prose
 *                  ("measure cumulative values"), not as a machine field, but
 *                  it is the single most consequential fact about a quantity
 *                  type: it decides whether you sum with .cumulativeSum or
 *                  average with .discreteAverage in HKStatisticsQuery. Getting
 *                  it wrong silently returns plausible, wrong numbers.
 *   unitFamily   — likewise stated in prose ("use energy units").
 *
 * Both are null when Apple's wording does not state them. We do not guess.
 *
 * Usage: node scripts/fetch-healthkit-identifiers.mjs [--offline]
 *   --offline reparses the cache in .cache/healthkit without refetching.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DOC = "https://developer.apple.com/tutorials/data/documentation/healthkit";

/**
 * The four identifier families that name a *kind of data*. Each is a separate
 * API surface with its own rules, which is why the family travels with every
 * row rather than being flattened away:
 *
 *   quantity       — numeric samples. The only family with an aggregation
 *                    style, and the only one where HKStatisticsQuery applies.
 *   category       — samples drawn from a fixed value enum (sleep stages,
 *                    mindful sessions, symptom severities).
 *   characteristic — read-only facts about the user that do not change with
 *                    time (date of birth, blood type). No samples, no writes.
 *   workoutActivity— the activity a workout represents.
 */
const FAMILIES = [
  { key: "quantity", slug: "hkquantitytypeidentifier", label: "HKQuantityTypeIdentifier" },
  { key: "category", slug: "hkcategorytypeidentifier", label: "HKCategoryTypeIdentifier" },
  { key: "characteristic", slug: "hkcharacteristictypeidentifier", label: "HKCharacteristicTypeIdentifier" },
  { key: "workoutActivity", slug: "hkworkoutactivitytype", label: "HKWorkoutActivityType" },
];

const BASE = `${DOC}/hkquantitytypeidentifier`;
const CACHE = ".cache/healthkit";
const OUT = "src/data/healthkitIdentifiers.ts";
const OFFLINE = process.argv.includes("--offline");

mkdirSync(CACHE, { recursive: true });

async function getJson(url, cacheFile) {
  const path = join(CACHE, cacheFile);
  if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  if (OFFLINE) throw new Error(`offline and ${path} is not cached`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  const text = await res.text();
  writeFileSync(path, text);
  await new Promise((r) => setTimeout(r, 150));
  return JSON.parse(text);
}

/** Flatten Apple's inline content tree to plain text. */
function inlineText(nodes) {
  let out = "";
  for (const n of nodes || []) {
    if (!n || typeof n !== "object") continue;
    if (n.type === "text") out += n.text ?? "";
    else if (n.type === "codeVoice") out += "`" + (n.code ?? "") + "`";
    else if (n.title && Array.isArray(n.title)) out += inlineText(n.title);
    else if (n.inlineContent) out += inlineText(n.inlineContent);
    else if (n.content) out += inlineText(n.content);
  }
  return out;
}

function discussionParagraphs(doc) {
  const paras = [];
  for (const sec of doc.primaryContentSections || []) {
    if (sec.kind !== "content") continue;
    for (const node of sec.content || []) {
      if (node.type === "paragraph") {
        const t = inlineText(node.inlineContent).trim();
        if (t) paras.push(t);
      }
    }
  }
  return paras;
}

const rows = [];

for (const family of FAMILIES) {
  const index = await getJson(`${DOC}/${family.slug}.json`, `_index-${family.key}.json`);

  const caseGroup = new Map();
  for (const sec of index.topicSections || []) {
    // "Initializers" is the type's own init(rawValue:), not a data type.
    if (sec.title === "Initializers") continue;
    for (const id of sec.identifiers || []) {
      // Apple's topic sections also list *related* symbols that are not cases
      // of this type — the category index, for instance, links the
      // HKCategoryValue* enums that decode its samples. Those live under a
      // different documentation path, so only keep identifiers nested under
      // this family's own namespace.
      if (!id.includes(`/${family.label}/`)) continue;
      const name = id.split("/").pop();
      if (name === "init(rawValue:)") continue;
      if (!caseGroup.has(name)) caseGroup.set(name, sec.title);
    }
  }

  for (const [caseName, group] of [...caseGroup].sort((a, b) => a[0].localeCompare(b[0]))) {
    const doc = await getJson(
      `${DOC}/${family.slug}/${caseName.toLowerCase()}.json`,
      `${family.key}-${caseName}.json`,
    );
    const md = doc.metadata || {};
    const paras = discussionParagraphs(doc);
    const disc = paras.join(" ");
    const sentences = disc.split(/(?<=[.!?])\s+/);
    const evidence = (re) => sentences.find((s) => re.test(s))?.trim() ?? null;

    // Aggregation and unit family are meaningful ONLY for quantity types.
    // Recording them as null elsewhere would imply Apple declined to state
    // them, when in fact the concept does not apply — so they stay null and
    // the family column is what tells a reader which reading is correct.
    const isQuantity = family.key === "quantity";
    const cumulative = isQuantity ? evidence(/cumulative value/i) : null;
    const discrete = isQuantity ? evidence(/discrete value/i) : null;
    const unitEvidence = isQuantity ? evidence(/\buses?\s+[a-z\- ]+?\s+units\b/i) : null;
    const unitMatch = unitEvidence?.match(/\buses?\s+([a-z\- ]+?)\s+units\b/i);

    // Category types draw from a value enum; naming it is the single most
    // useful thing about them, because reading the sample is meaningless
    // without knowing which enum decodes it.
    //
    // Selecting it needs care. Apple's reference block also contains
    // CROSS-LINKS to other types' enums — mindfulSession's page mentions
    // HKCategoryValueSleepAnalysisAsleepValues — so "first thing starting
    // with HKCategoryValue" would happily attach a neighbouring type's enum.
    // Only two things are accepted: an enum named after this very case, or
    // the generic HKCategoryValue (which is what types carrying only
    // .notApplicable actually use). Anything else yields null.
    let valueEnum = null;
    if (family.key === "category") {
      const titles = Object.values(doc.references || {})
        .map((r) => (typeof r?.title === "string" ? r.title : null))
        .filter((t) => t && /^HKCategoryValue/.test(t));
      const own = `HKCategoryValue${caseName[0].toUpperCase()}${caseName.slice(1)}`;
      // Types with no meaningful value reference the MEMBER
      // HKCategoryValue.notApplicable rather than the bare enum title, so
      // both forms count as "uses the generic enum".
      const generic = titles.some((t) => t === "HKCategoryValue" || t.startsWith("HKCategoryValue."));
      valueEnum = titles.includes(own) ? own : generic ? "HKCategoryValue" : null;
    }

    rows.push({
      case: caseName,
      objc: (md.navigatorTitle || []).map((x) => x.text).join(""),
      family: family.key,
      familyType: family.label,
      group,
      abstract: inlineText(doc.abstract).trim(),
      aggregation: cumulative ? "cumulative" : discrete ? "discrete" : null,
      aggregationEvidence: cumulative || discrete,
      unitFamily: unitMatch ? unitMatch[1].trim().toLowerCase() : null,
      valueEnum,
      platforms: (md.platforms || []).map((p) => ({
        name: p.name,
        introducedAt: p.introducedAt ?? null,
        deprecated: Boolean(p.deprecated),
        beta: Boolean(p.beta),
      })),
      deprecated: (md.platforms || []).some((p) => p.deprecated),
      discussionWords: disc.split(/\s+/).filter(Boolean).length,
      undocumented: !inlineText(doc.abstract).trim() && paras.length === 0,
    });
  }
  console.log(`  ${family.label}: ${rows.filter((r) => r.family === family.key).length} cases`);
}

// --- HKError.Code -----------------------------------------------------------
// The error names a HealthKit call can fail with. Apple documents the names,
// the abstracts and the discussions, but NOT the numeric raw values — and the
// numbers are what a developer actually sees in "Error Domain=com.apple.
// healthkit Code=5". We publish the set and state that Apple does not publish
// the mapping, rather than inferring numbers from declaration order, which is
// not the order the documentation lists them in.
const errorIndex = await getJson(`${DOC}/hkerror.json`, "_index-errors.json");
const errorCases = [];
for (const sec of errorIndex.topicSections || []) {
  for (const id of sec.identifiers || []) {
    if (!id.includes("/HKError/")) continue;
    const name = id.split("/").pop();
    // "Code" is the enum itself and errorDomain is the domain string, not a
    // failure mode. Neither is an error a call can return.
    if (name === "Code" || name === "errorDomain") continue;
    errorCases.push([name, sec.title]);
  }
}

const errors = [];
for (const [name, group] of errorCases) {
  const doc = await getJson(`${DOC}/hkerror/${name.toLowerCase()}.json`, `error-${name}.json`);
  const paras = discussionParagraphs(doc);
  errors.push({
    case: name,
    group,
    abstract: inlineText(doc.abstract).trim(),
    discussion: paras.join(" ") || null,
    undocumented: !inlineText(doc.abstract).trim() && paras.length === 0,
    platforms: (doc.metadata?.platforms || []).map((pl) => ({
      name: pl.name,
      introducedAt: pl.introducedAt ?? null,
      deprecated: Boolean(pl.deprecated),
      beta: Boolean(pl.beta),
    })),
    docUrl: `https://developer.apple.com/documentation/healthkit/hkerror/${name.toLowerCase()}`,
  });
}
console.log(`  HKError.Code: ${errors.length} cases`);

// --- integrity gates: fail loudly rather than publish a degraded dataset ---
const problems = [];
if (rows.length < 240) problems.push(`only ${rows.length} identifiers parsed across ${FAMILIES.length} families`);
// Apple genuinely ships a handful of newer types with no abstract AND no
// discussion — as of the last fetch, three iOS 18 effort/breathing types.
// That is a fact about Apple's docs, not a parse failure, so it is allowed
// but bounded: an undocumented type must be undocumented in BOTH fields. One
// with a discussion but no abstract would mean our parser broke.
const noAbstract = rows.filter((r) => !r.abstract);
const suspicious = noAbstract.filter((r) => r.discussionWords > 0);
if (suspicious.length) {
  problems.push(`${suspicious.length} have discussion but no abstract (parser likely broken): ${suspicious.slice(0, 5).map((r) => r.case)}`);
}
if (noAbstract.length > 20) {
  problems.push(`${noAbstract.length} with no abstract — more than expected; check Apple's payload shape`);
}
const noPlatform = rows.filter((r) => r.platforms.length === 0);
if (noPlatform.length) problems.push(`${noPlatform.length} with no platform data`);
const quantity = rows.filter((r) => r.family === "quantity");
const unclassified = quantity.filter((r) => !r.aggregation);
if (quantity.length < 100) problems.push(`only ${quantity.length} quantity types parsed`);
if (unclassified.length > 10) problems.push(`${unclassified.length} quantity types unclassified for aggregation (expected <=10)`);
for (const f of FAMILIES) {
  if (!rows.some((r) => r.family === f.key)) problems.push(`no rows parsed for ${f.label}`);
}
if (errors.length < 12) problems.push(`only ${errors.length} HKError cases parsed`);
// Same allowance as the identifiers: Apple ships some error cases with a
// declaration and nothing else. Allowed, but only when BOTH fields are empty
// — an abstract-less case that still has a discussion means we broke the
// parser, not that Apple was silent.
const errNoAbstract = errors.filter((e) => !e.abstract);
const errSuspicious = errNoAbstract.filter((e) => e.discussion);
if (errSuspicious.length) problems.push(`HKError cases with discussion but no abstract (parser broken): ${errSuspicious.map((e) => e.case)}`);
if (errNoAbstract.length > 8) problems.push(`${errNoAbstract.length} HKError cases with no abstract — more than expected`);
if (problems.length) {
  console.error("REFUSING TO WRITE — Apple's payload shape may have changed:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

if (noAbstract.length) {
  console.log(`note: ${noAbstract.length} identifier(s) Apple documents with neither abstract nor discussion: ${noAbstract.map((r) => r.case).join(", ")}`);
}

const fetchedOn = new Date().toISOString().slice(0, 10);
const body = `/**
 * Every HKQuantityTypeIdentifier, read from Apple's own documentation JSON.
 *
 * GENERATED — do not hand-edit. Regenerate with:
 *   node scripts/fetch-healthkit-identifiers.mjs
 *
 * Source: ${DOC.replace("/tutorials/data", "")} (${FAMILIES.map((f) => f.label).join(", ")})
 * Fetched: ${fetchedOn}
 *
 * \`aggregation\` and \`unitFamily\` are the only derived fields. Apple states
 * both in prose rather than as machine-readable properties, and the sentence
 * each was derived from is kept in \`aggregationEvidence\` so the claim stays
 * auditable. Where Apple's wording does not state it, the value is null — it
 * is never guessed.
 *
 * Why aggregation matters enough to derive: it decides whether a developer
 * sums a type with .cumulativeSum or averages it with .discreteAverage. Pick
 * wrong and HKStatisticsQuery returns a plausible, wrong number rather than
 * an error.
 */

export type HkPlatform = {
  name: string;
  introducedAt: string | null;
  deprecated: boolean;
  beta: boolean;
};

/** The identifier families this dataset covers. */
export type HkFamily = "quantity" | "category" | "characteristic" | "workoutActivity";

export type HkIdentifier = {
  /** Swift case name, e.g. "activeEnergyBurned". */
  case: string;
  /** Objective-C constant, e.g. "HKQuantityTypeIdentifierActiveEnergyBurned". */
  objc: string;
  /** Which identifier family the case belongs to. */
  family: HkFamily;
  /** The Apple type it is a case of, e.g. "HKQuantityTypeIdentifier". */
  familyType: string;
  /** Apple's own topic grouping. */
  group: string;
  /** Apple's one-line abstract, verbatim. */
  abstract: string;
  /** Derived from Apple's prose; null when Apple does not state it.
   *  Only quantity types have an aggregation style at all — for the other
   *  families this is null because the concept does not apply, not because
   *  Apple declined to say. Read it together with the family field. */
  aggregation: "cumulative" | "discrete" | null;
  /** The sentence \`aggregation\` was derived from. */
  aggregationEvidence: string | null;
  /** Derived from Apple's prose, e.g. "energy"; null when unstated.
   *  Only meaningful for quantity types. */
  unitFamily: string | null;
  /** For category types: the HKCategoryValue enum that decodes the sample.
   *  Reading a category sample without it is meaningless. Null elsewhere. */
  valueEnum: string | null;
  platforms: HkPlatform[];
  deprecated: boolean;
  /** Word count of Apple's discussion — how much depth the source offers. */
  discussionWords: number;
  /** True when Apple documents the type with no abstract and no discussion. */
  undocumented: boolean;
};

/** The date the generator last read Apple's documentation. */
export const HK_FETCHED_ON = ${JSON.stringify(fetchedOn)};

export const HK_IDENTIFIERS: HkIdentifier[] = ${JSON.stringify(rows, null, 2)};

/** Apple's grouping, in Apple's order, with our merges applied downstream. */
export const HK_GROUPS: string[] = ${JSON.stringify([...new Set(rows.map((r) => r.group))], null, 2)};

export type HkError = {
  /** Swift case on HKError.Code, e.g. "errorAuthorizationDenied". */
  case: string;
  group: string;
  /** Apple's one-line abstract, verbatim. */
  abstract: string;
  /** Apple's discussion, where it offers one. */
  discussion: string | null;
  /** True when Apple ships the case with a declaration and nothing else. */
  undocumented: boolean;
  platforms: HkPlatform[];
  docUrl: string;
};

/**
 * Every HKError.Code case Apple documents.
 *
 * Apple does NOT publish the numeric raw values in its documentation, and the
 * order cases are listed in is not declaration order — so this deliberately
 * carries no numbers. A developer holding "Code=5" cannot be matched to a
 * name from anything Apple states publicly, and guessing would be worse than
 * saying so.
 */
export const HK_ERRORS: HkError[] = ${JSON.stringify(errors, null, 2)};

/** Family key → the Apple type name, in the order the generator crawls them. */
export const HK_FAMILIES: { key: HkFamily; label: string; count: number }[] = ${JSON.stringify(
  FAMILIES.map((f) => ({ key: f.key, label: f.label, count: rows.filter((r) => r.family === f.key).length })),
  null,
  2,
)};
`;

writeFileSync(OUT, body);
console.log(`wrote ${OUT}: ${rows.length} identifiers across ${FAMILIES.length} families`);
for (const f of FAMILIES) console.log(`  ${f.label}: ${rows.filter((r) => r.family === f.key).length}`);
console.log(`  quantity aggregation — cumulative ${quantity.filter((r) => r.aggregation === "cumulative").length}, discrete ${quantity.filter((r) => r.aggregation === "discrete").length}, unstated ${unclassified.length}`);
console.log(`  category value enums resolved: ${rows.filter((r) => r.valueEnum).length}`);
console.log(`  HKError.Code cases: ${errors.length}`);
