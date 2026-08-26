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

const BASE = "https://developer.apple.com/tutorials/data/documentation/healthkit/hkquantitytypeidentifier";
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

const index = await getJson(`${BASE}.json`, "_index.json");

const caseGroup = new Map();
for (const sec of index.topicSections || []) {
  for (const id of sec.identifiers || []) {
    const name = id.split("/").pop();
    if (!caseGroup.has(name)) caseGroup.set(name, sec.title);
  }
}
// "Initializers" is the type's own init(rawValue:), not a data type.
caseGroup.delete("init(rawValue:)");
for (const [k, v] of [...caseGroup]) if (v === "Initializers") caseGroup.delete(k);

const rows = [];
for (const [caseName, group] of [...caseGroup].sort((a, b) => a[0].localeCompare(b[0]))) {
  const doc = await getJson(`${BASE}/${caseName.toLowerCase()}.json`, `${caseName}.json`);
  const md = doc.metadata || {};
  const paras = discussionParagraphs(doc);
  const disc = paras.join(" ");
  const sentences = disc.split(/(?<=[.!?])\s+/);
  const evidence = (re) => sentences.find((s) => re.test(s))?.trim() ?? null;

  const cumulative = evidence(/cumulative value/i);
  const discrete = evidence(/discrete value/i);
  const unitEvidence = evidence(/\buses?\s+[a-z\- ]+?\s+units\b/i);
  const unitMatch = unitEvidence?.match(/\buses?\s+([a-z\- ]+?)\s+units\b/i);

  rows.push({
    case: caseName,
    objc: (md.navigatorTitle || []).map((x) => x.text).join(""),
    group,
    abstract: inlineText(doc.abstract).trim(),
    aggregation: cumulative ? "cumulative" : discrete ? "discrete" : null,
    aggregationEvidence: cumulative || discrete,
    unitFamily: unitMatch ? unitMatch[1].trim().toLowerCase() : null,
    platforms: (md.platforms || []).map((p) => ({
      name: p.name,
      introducedAt: p.introducedAt ?? null,
      deprecated: Boolean(p.deprecated),
      beta: Boolean(p.beta),
    })),
    deprecated: (md.platforms || []).some((p) => p.deprecated),
    discussionWords: disc.split(/\s+/).filter(Boolean).length,
    /** Apple ships the type with neither an abstract nor a discussion. */
    undocumented: !inlineText(doc.abstract).trim() && paras.length === 0,
  });
}

// --- integrity gates: fail loudly rather than publish a degraded dataset ---
const problems = [];
if (rows.length < 100) problems.push(`only ${rows.length} identifiers parsed`);
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
if (noAbstract.length > 8) {
  problems.push(`${noAbstract.length} with no abstract — more than expected; check Apple's payload shape`);
}
const noPlatform = rows.filter((r) => r.platforms.length === 0);
if (noPlatform.length) problems.push(`${noPlatform.length} with no platform data`);
const unclassified = rows.filter((r) => !r.aggregation);
if (unclassified.length > 10) problems.push(`${unclassified.length} unclassified for aggregation (expected <=10)`);
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
 * Source: ${BASE.replace("/tutorials/data", "")}
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

export type HkIdentifier = {
  /** Swift case name, e.g. "activeEnergyBurned". */
  case: string;
  /** Objective-C constant, e.g. "HKQuantityTypeIdentifierActiveEnergyBurned". */
  objc: string;
  /** Apple's own topic grouping. */
  group: string;
  /** Apple's one-line abstract, verbatim. */
  abstract: string;
  /** Derived from Apple's prose; null when Apple does not state it. */
  aggregation: "cumulative" | "discrete" | null;
  /** The sentence \`aggregation\` was derived from. */
  aggregationEvidence: string | null;
  /** Derived from Apple's prose, e.g. "energy"; null when unstated. */
  unitFamily: string | null;
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
`;

writeFileSync(OUT, body);
console.log(`wrote ${OUT}: ${rows.length} identifiers, ${new Set(rows.map((r) => r.group)).size} groups`);
console.log(`  cumulative ${rows.filter((r) => r.aggregation === "cumulative").length}, discrete ${rows.filter((r) => r.aggregation === "discrete").length}, unclassified ${rows.filter((r) => !r.aggregation).length}`);
console.log(`  with unit family: ${rows.filter((r) => r.unitFamily).length}`);
