/**
 * HealthKit identifier pages — /healthkit-identifiers/<slug>, one page per
 * quantity, category and characteristic identifier that clears the thin-page
 * rule below. Workout activity types are built by a separate page set and are
 * never given a page here.
 *
 * The flagship /healthkit-identifiers table used to be the only address for
 * an identifier, on the argument that Apple's median discussion is 23 words
 * and a page per identifier would restate one-liners. That argument still
 * holds for most category and characteristic types, which is why the rule
 * exists: a page is built only where the generated data holds enough
 * type-specific, evidence-backed facts to answer a question on its own. The
 * rest stay rows on the table, with no page and no sitemap row.
 *
 * Everything a page states is read out of generated data, never typed here:
 *   - healthkitIdentifiers.ts — Apple's documentation JSON (abstract,
 *     platforms, deprecation, the derived aggregation and unit family with
 *     the sentence they came from);
 *   - healthkitWritability.ts — Apple's own "read-only" sentences;
 *   - healthkitMetadataKeys.ts — metadata keys whose Apple text names the type;
 *   - matrix.ts — the HealthKit ↔ Health Connect rows verified on both sides.
 * This file is the hand-written half: slugs, the rule, and the title,
 * description, capsule and FAQ templates, every clause of which is a field.
 *
 * No markdown mirror exists for this section (as for /health-connect), so
 * the pages carry no text/markdown alternate.
 */
import {
  HK_IDENTIFIERS,
  HK_FETCHED_ON,
  type HkFamily,
  type HkIdentifier,
  type HkPlatform,
} from "./healthkitIdentifiers";
import { HK_READONLY } from "./healthkitWritability";
import { HK_METADATA_KEYS, HK_METADATA_KEYS_FETCHED_ON, type HkMetadataKey } from "./healthkitMetadataKeys";
import { ROWS as MATRIX_ROWS, type Row as MatrixRow } from "./matrix";
import { hkGroupSlugOf, hkGroupLabel } from "./hkGroupPages";
import { appleCases } from "@/components/MetricFacts";
import { clampDescription, clampTitle } from "@/lib/cluster";

export const HK_ID_BASE = "/healthkit-identifiers";

/** The families this page set covers. Workout activity types are built elsewhere. */
export const HK_PAGE_FAMILIES: HkFamily[] = ["quantity", "category", "characteristic"];

const SITE_SUFFIX = " · AIFitnessAPI";

// ---------------------------------------------------------------------------
// Slugs and lookups
// ---------------------------------------------------------------------------

/** Swift case → URL slug: activeEnergyBurned → active-energy-burned,
 *  heartRateVariabilitySDNN → heart-rate-variability-sdnn. The same kebab
 *  rule the Health Connect generator uses for record classes. Lower-case
 *  ASCII and hyphens only, because qa's link checks read exactly that. */
export function hkSlug(caseName: string): string {
  return caseName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

const READONLY = new Map(HK_READONLY.map((r) => [r.case, r.evidence]));

/** Apple's read-only sentence for this identifier, verbatim; null when Apple
 *  states none (which means unknown, not writable — see healthkitWritability). */
export function hkReadOnlyEvidence(id: Pick<HkIdentifier, "case">): string | null {
  return READONLY.get(id.case) ?? null;
}

const FAMILY_NOUN: Record<HkFamily, string> = {
  quantity: "quantity type",
  category: "category type",
  characteristic: "characteristic type",
  workoutActivity: "workout activity type",
};

export function hkFamilyNoun(id: Pick<HkIdentifier, "family">): string {
  return FAMILY_NOUN[id.family];
}

export function iosEntry(id: HkIdentifier): HkPlatform | undefined {
  return id.platforms.find((p) => p.name === "iOS");
}

// ---------------------------------------------------------------------------
// The evidence behind each derived field
// ---------------------------------------------------------------------------

/**
 * The sentence that states this identifier's unit family, when the generated
 * data holds it. The generator stores one sentence per identifier,
 * `aggregationEvidence`; for 112 of the 116 quantity types with a unit family
 * that same sentence also names the unit ("…use energy units … and measure
 * cumulative values…"), matched here with the generator's own pattern. For
 * the other four the unit was read from a different sentence of Apple's
 * discussion that the dataset does not keep, so this returns null and the page
 * says the sentence is not stored rather than quoting one that does not say it.
 */
export function hkUnitEvidence(id: HkIdentifier): string | null {
  if (!id.unitFamily || !id.aggregationEvidence) return null;
  const esc = id.unitFamily.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\buses?\\s+${esc}\\s+units\\b`, "i").test(id.aggregationEvidence)
    ? id.aggregationEvidence
    : null;
}

/** The verified matrix row that names this identifier on its Apple side.
 *  Parsed with the same function the /data guides use (MetricFacts), so the
 *  two surfaces cannot disagree about which identifiers a row covers. */
export type HkMatrixMatch = {
  row: MatrixRow;
  /** Every Apple identifier the row names, in the row's order. */
  appleCases: string[];
  /** True when the row names exactly this one Apple identifier and one
   *  Android record — the only case where the row reads as a pairing. A row
   *  with several types on either side groups a metric; it does not pair. */
  oneToOne: boolean;
};

export function hkMatrixMatch(id: Pick<HkIdentifier, "case">): HkMatrixMatch | null {
  for (const row of MATRIX_ROWS) {
    const cases = appleCases(row.apple);
    if (!cases.includes(id.case)) continue;
    const android = row.android.split(",").map((s) => s.trim()).filter(Boolean);
    return { row, appleCases: cases, oneToOne: cases.length === 1 && android.length === 1 };
  }
  return null;
}

/** A metadata key whose own Apple text names this identifier, with the
 *  sentences that do. Matching is on the whole Swift case or Objective-C
 *  constant, so heartRate does not match heartRateRecoveryOneMinute. */
export type HkKeyTie = { key: HkMetadataKey; sentences: string[] };

let TIES: Map<string, HkKeyTie[]> | null = null;

export function hkMetadataTies(id: Pick<HkIdentifier, "case">): HkKeyTie[] {
  if (!TIES) {
    TIES = new Map();
    for (const target of HK_IDENTIFIERS) {
      if (!HK_PAGE_FAMILIES.includes(target.family)) continue;
      const re = new RegExp(`\\b(?:${target.case}|${target.objc})\\b`);
      for (const key of HK_METADATA_KEYS) {
        const text = [key.abstract, key.discussion].filter(Boolean).join(" ");
        if (!re.test(text)) continue;
        const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => re.test(s));
        const list = TIES.get(target.case) ?? [];
        list.push({ key, sentences });
        TIES.set(target.case, list);
      }
    }
  }
  return TIES.get(id.case) ?? [];
}

// ---------------------------------------------------------------------------
// THE THIN-PAGE RULE
//
// A HealthKit identifier gets its own page only when ALL of these hold:
//   1. it is a quantity, category or characteristic type;
//   2. Apple documents it: its abstract is non-empty;
//   3. Apple's availability data gives at least one platform an
//      introducedAt version;
//   4. the generated data holds at least TWO of these type-specific facts,
//      each with its evidence:
//        aggregation     — the aggregation style, with Apple's sentence
//                          (quantity types);
//        unit-family     — the unit family, with a stored sentence that
//                          names it (hkUnitEvidence; quantity types);
//        value-enum      — the HKCategoryValue enum Apple's page names
//                          (category types);
//        read-only       — Apple's sentence that the samples are read-only;
//        cross-platform  — a row of the verified HealthKit ↔ Health Connect
//                          matrix that names it;
//        deprecation     — Apple's deprecation note;
//        metadata-key    — a metadata key whose Apple text names it.
//
// Not counted, though every page links them: the group page (every
// identifier has one — buildHkGroups throws otherwise — so counting it would
// lower the bar to a single fact), and related pages elsewhere on the site
// (links, not facts about the type).
//
// An identifier that fails stays a row on /healthkit-identifiers, its group
// page and the other references, and gets no page and no sitemap row. qa's
// TYPE-PAGE-RULE recomputes this rule from the generated files and fails the
// build when the set of built pages differs from it.
// ---------------------------------------------------------------------------

export type HkFactKey =
  | "aggregation"
  | "unit-family"
  | "value-enum"
  | "read-only"
  | "cross-platform"
  | "deprecation"
  | "metadata-key";

export const HK_MIN_FACTS = 2;

export function hkFacts(id: HkIdentifier): HkFactKey[] {
  const facts: HkFactKey[] = [];
  if (id.family === "quantity" && id.aggregation && id.aggregationEvidence) facts.push("aggregation");
  if (id.family === "quantity" && hkUnitEvidence(id)) facts.push("unit-family");
  if (id.family === "category" && id.valueEnum) facts.push("value-enum");
  if (hkReadOnlyEvidence(id)) facts.push("read-only");
  if (hkMatrixMatch(id)) facts.push("cross-platform");
  if (id.deprecated && id.deprecation?.message) facts.push("deprecation");
  if (hkMetadataTies(id).length > 0) facts.push("metadata-key");
  return facts;
}

export function hkPageEligible(id: HkIdentifier): boolean {
  return (
    HK_PAGE_FAMILIES.includes(id.family) &&
    id.abstract.trim().length > 0 &&
    id.platforms.some((p) => p.introducedAt) &&
    hkFacts(id).length >= HK_MIN_FACTS
  );
}

let PAGES: HkIdentifier[] | null = null;

/** The identifiers that get a page, in the table's order (Apple's family
 *  order, then case). */
export function hkPageIdentifiers(): HkIdentifier[] {
  PAGES ??= HK_IDENTIFIERS.filter(hkPageEligible);
  return PAGES;
}

/** The identifiers in the covered families that the rule holds back. */
export function hkHeldBack(): HkIdentifier[] {
  return HK_IDENTIFIERS.filter((id) => HK_PAGE_FAMILIES.includes(id.family) && !hkPageEligible(id));
}

let BY_SLUG: Map<string, HkIdentifier> | null = null;
let PATH_BY_CASE: Map<string, string> | null = null;

export function getHkIdentifierPage(slug: string): HkIdentifier | undefined {
  BY_SLUG ??= new Map(hkPageIdentifiers().map((id) => [hkSlug(id.case), id]));
  return BY_SLUG.get(slug);
}

export function hkIdentifierPath(id: Pick<HkIdentifier, "case">): string {
  return `${HK_ID_BASE}/${hkSlug(id.case)}`;
}

/** The page for a Swift case, or null when the rule holds it back. */
export function hkIdentifierPagePath(caseName: string): string | null {
  PATH_BY_CASE ??= new Map(hkPageIdentifiers().map((id) => [id.case, hkIdentifierPath(id)]));
  return PATH_BY_CASE.get(caseName) ?? null;
}

/** The group page row for an identifier (every identifier has one). */
export function hkGroupRowHref(id: HkIdentifier): string | null {
  const slug = hkGroupSlugOf(id);
  return slug ? `/healthkit/${slug}#id-${id.case.toLowerCase()}` : null;
}

export function hkGroupName(id: HkIdentifier): string | null {
  const slug = hkGroupSlugOf(id);
  return slug ? hkGroupLabel(slug) : null;
}

// ---------------------------------------------------------------------------
// Dates. Every fact on a page is the identifier corpus read on HK_FETCHED_ON,
// plus — on the pages that list metadata keys — the metadata-key read on
// HK_METADATA_KEYS_FETCHED_ON. dateModified is the newer of the reads the page
// actually renders, so a regenerated source moves exactly the pages it
// changes. datePublished comes from publishedDate(), which clamps to it.
// ---------------------------------------------------------------------------

export function hkPageModified(id: HkIdentifier): string {
  const dates = [HK_FETCHED_ON];
  if (hkMetadataTies(id).length) dates.push(HK_METADATA_KEYS_FETCHED_ON);
  return dates.sort().at(-1)!;
}

// ---------------------------------------------------------------------------
// Titles, descriptions, capsule, FAQs — every clause a field.
// ---------------------------------------------------------------------------

function fit(candidates: string[], max: number, clamp: (s: string, max: number) => string): string {
  for (const c of candidates) if (c.length <= max) return c;
  return clamp(candidates[candidates.length - 1], max);
}

function joinList(xs: string[]): string {
  if (xs.length <= 1) return xs.join("");
  if (xs.length === 2) return `${xs[0]} and ${xs[1]}`;
  return `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}

/** <title>, absolute: the Swift case is the query, so it leads. */
export function hkPageTitle(id: HkIdentifier): string {
  const noun = hkFamilyNoun(id);
  return fit(
    [
      `${id.case}: HealthKit ${noun}${SITE_SUFFIX}`,
      `${id.case}: HealthKit ${noun}`,
      `${id.case} (HealthKit)`,
    ],
    60,
    clampTitle,
  );
}

export function hkPageH1(id: HkIdentifier): string {
  return `${id.case}: HealthKit ${hkFamilyNoun(id)}`;
}

/** The facts a description or capsule leads with, as short phrases. */
function factPhrases(id: HkIdentifier): string[] {
  const out: string[] = [];
  if (id.family === "quantity" && id.aggregation) out.push(id.aggregation);
  if (id.family === "quantity" && id.unitFamily) out.push(`${id.unitFamily} units`);
  if (id.family === "category" && id.valueEnum) out.push(id.valueEnum);
  if (hkReadOnlyEvidence(id)) out.push("read-only");
  if (id.deprecated) out.push("deprecated");
  const ios = iosEntry(id)?.introducedAt;
  if (ios) out.push(`iOS ${ios}+`);
  return out;
}

export function hkPageDescription(id: HkIdentifier): string {
  const facts = factPhrases(id).join(", ");
  return fit(
    [
      `${id.case} (${id.objc}): ${facts}. Apple's abstract, availability on every platform, and the sentence behind each fact.`,
      `${id.case} (${id.objc}): ${facts}. Apple's abstract and availability, with the sentence behind each fact.`,
      `${id.case}: HealthKit ${hkFamilyNoun(id)} — ${facts}. Apple's abstract, availability and the sentence behind each fact.`,
      `${id.case}: HealthKit ${hkFamilyNoun(id)} — ${facts}, from Apple's documentation.`,
      `${id.case}: HealthKit ${hkFamilyNoun(id)} — ${facts}.`,
    ],
    155,
    clampDescription,
  );
}

/** "iOS 8.0, iPadOS 8.0, …" in Apple's platform order. */
export function availabilityList(id: HkIdentifier): string {
  return joinList(id.platforms.filter((p) => p.introducedAt).map((p) => `${p.name} ${p.introducedAt}`));
}

/** The answer capsule. Every sentence is a field of the identifier or a row
 *  of a generated file; nothing is paraphrased beyond naming the field. */
export function hkPageCapsule(id: HkIdentifier): string {
  const parts: string[] = [];
  parts.push(
    `${id.familyType}.${id.case} (Objective-C ${id.objc}) is a HealthKit ${hkFamilyNoun(id)} in Apple's "${id.group}" group. Apple's abstract: “${id.abstract}”`,
  );
  if (id.family === "quantity" && id.aggregation) {
    const claim = id.unitFamily
      ? `its samples use ${id.unitFamily} units and measure ${id.aggregation} values`
      : `its samples measure ${id.aggregation} values`;
    parts.push(
      `Apple's discussion says ${claim}, so in HKStatisticsQuery it takes ${
        id.aggregation === "cumulative" ? ".cumulativeSum" : ".discreteAverage, .discreteMin or .discreteMax"
      }.`,
    );
  }
  if (id.family === "category" && id.valueEnum) {
    parts.push(
      id.valueEnum === "HKCategoryValue"
        ? "Apple's page names the generic HKCategoryValue for its sample values rather than an enum of its own."
        : `Apple's page names ${id.valueEnum} as the enum its sample values come from.`,
    );
  }
  const ro = hkReadOnlyEvidence(id);
  if (ro) parts.push(`Apple states that apps cannot save it: “${ro}”`);
  const ios = iosEntry(id);
  if (ios?.introducedAt) {
    const watch = id.platforms.find((p) => p.name === "watchOS")?.introducedAt;
    parts.push(`It is available from iOS ${ios.introducedAt}${watch ? ` and watchOS ${watch}` : ""}.`);
  }
  if (id.deprecated && id.deprecation?.message) {
    parts.push(
      `Apple marks it deprecated${ios?.deprecatedAt ? ` from iOS ${ios.deprecatedAt}` : ""}: “${id.deprecation.message}”`,
    );
  }
  const m = hkMatrixMatch(id);
  if (m) {
    const caveat = m.row.watchOut ? firstSentence(m.row.watchOut) : null;
    parts.push(
      `${
        m.oneToOne
          ? `This site's verified cross-platform matrix pairs it with ${m.row.android} on Android Health Connect in its ${m.row.label} row`
          : `This site's verified cross-platform matrix lists it in its ${m.row.label} row, beside ${m.row.android} on Android Health Connect`
      }${caveat ? `, with the caveat “${caveat}”` : "."}`,
    );
  }
  return parts.join(" ");
}

/** The first sentence of a matrix caveat, for the capsule; the page and the
 *  FAQ carry the whole caveat. */
function firstSentence(s: string): string {
  return s.split(/(?<=[.!?])\s+/)[0];
}

export type HkFaq = { q: string; a: string };

/** 3–5 questions, each answered only from fields. */
export function hkPageFaqs(id: HkIdentifier): HkFaq[] {
  const faqs: HkFaq[] = [];
  const ios = iosEntry(id);

  if (id.family === "quantity" && id.aggregation && id.aggregationEvidence) {
    faqs.push({
      q: `Should I sum or average ${id.case} in HealthKit?`,
      a:
        id.aggregation === "cumulative"
          ? `Sum it. Apple's documentation for ${id.case} describes it as measuring cumulative values, so an HKStatisticsQuery over it takes .cumulativeSum. Apple's sentence, as read on ${HK_FETCHED_ON}: "${id.aggregationEvidence}"`
          : `Average it, or take its minimum or maximum — do not sum it. Apple's documentation for ${id.case} describes it as measuring discrete values, so an HKStatisticsQuery over it takes .discreteAverage, .discreteMin or .discreteMax. Apple's sentence, as read on ${HK_FETCHED_ON}: "${id.aggregationEvidence}"`,
    });
  }

  if (id.family === "quantity" && id.unitFamily) {
    const ev = hkUnitEvidence(id);
    const head = `${id.unitFamily[0].toUpperCase()}${id.unitFamily.slice(1)}.`;
    faqs.push({
      q: `Which unit family does Apple give ${id.case}?`,
      a: ev
        ? `${head} Apple's discussion of ${id.case} says its samples use ${id.unitFamily} units: "${ev}"`
        : `${head} The dataset this site generates from Apple's documentation derived that from a sentence of Apple's discussion it does not store, so the sentence is not quoted here; Apple's page for ${id.case} carries it.`,
    });
  }

  if (id.family === "category" && id.valueEnum) {
    faqs.push({
      q: `Which enum decodes ${id.case} sample values?`,
      a:
        id.valueEnum === "HKCategoryValue"
          ? `The generic HKCategoryValue. Apple's page for ${id.case} names it rather than an enum of its own; this site's HKCategoryValue reference lists every category type that resolves the same way and what that means for reading the samples.`
          : `${id.valueEnum}. Apple's page for ${id.case} names that enum as the one its sample values come from.`,
    });
  }

  const ro = hkReadOnlyEvidence(id);
  if (ro) {
    faqs.push({
      q: `Can my app write ${id.case} samples to HealthKit?`,
      a: `No. Apple's documentation for ${id.case} states: "${ro}" (read ${HK_FETCHED_ON}).`,
    });
  }

  const m = hkMatrixMatch(id);
  if (m) {
    faqs.push({
      q: `Does ${id.case} have a Health Connect equivalent?`,
      a: `${
        m.oneToOne
          ? `This site's verified cross-platform matrix pairs HealthKit's ${id.case} with ${m.row.android} in its ${m.row.label} row.`
          : `This site's verified cross-platform matrix lists ${id.case} in its ${m.row.label} row, which groups ${m.row.apple} on Apple with ${m.row.android} on Android; the row groups the metric and does not pair each Apple type with one Android record.`
      }${m.row.watchOut ? ` The caveat recorded with that row: ${m.row.watchOut}` : ""}`,
    });
  }

  if (id.deprecated && id.deprecation?.message) {
    faqs.push({
      q: `Is HealthKit's ${id.case} deprecated?`,
      a: `Yes. Apple's availability data marks ${id.case} deprecated${
        ios?.deprecatedAt ? ` from iOS ${ios.deprecatedAt}` : ""
      }, and Apple's note reads: "${id.deprecation.message}"${
        id.deprecation.renamedTo ? ` Its platform entries record the rename target ${id.deprecation.renamedTo}.` : ""
      }`,
    });
  }

  const ties = hkMetadataTies(id);
  if (ties.length) {
    faqs.push({
      q: `Which HealthKit metadata keys mention ${id.case}?`,
      a: `${joinList(ties.map((t) => t.key.swiftName))}. ${ties
        .map((t) => `Apple's text for ${t.key.swiftName}: "${t.sentences[0]}"`)
        .join(" ")}`,
    });
  }

  if (ios?.introducedAt) {
    faqs.push({
      q: `Which iOS version added ${id.case}?`,
      a: `iOS ${ios.introducedAt}. Apple's availability data for ${id.case} lists ${availabilityList(id)}.`,
    });
  }

  return faqs.slice(0, 5);
}

/** Apple's reference index for the identifier's family — the page the
 *  generator crawled to find it, i.e. the identifier's own page minus its
 *  last path segment. */
export function hkFamilyIndexUrl(id: HkIdentifier): string {
  return id.docUrl.replace(/\/[^/]+$/, "");
}

export { HK_FETCHED_ON, HK_METADATA_KEYS_FETCHED_ON };
