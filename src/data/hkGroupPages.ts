/**
 * HealthKit group reference pages — /healthkit/<group>.
 *
 * The flagship /healthkit-identifiers page deliberately keeps every
 * identifier on one URL; that page ranks for the set, not for the strings.
 * These twelve pages are the middle layer: one per group, each substantial
 * enough to stand alone (7–84 identifiers with real synthesis), each an
 * anchor surface for the exact identifier strings developers paste into a
 * search box. A page per identifier stays rejected — Apple's median
 * discussion is 23 words and per-identifier pages would be thin.
 *
 * The derived half (tables) comes from the generated dataset at render time
 * so it cannot drift; the authored half (intro, traps, FAQs) lives in
 * hkGroupPages.entries.ts and was written against per-group fact packs with
 * every number checked. qa asserts the partition: every identifier appears
 * in exactly one group.
 */
import { HK_IDENTIFIERS, HK_FETCHED_ON, type HkIdentifier } from "./healthkitIdentifiers";
import { hkGroupEntries } from "./hkGroupPages.entries";

export type HkGroupEntry = {
  slug: string;
  /** ≤45 chars — the layout appends the site suffix. */
  title: string;
  metaDescription: string;
  primaryQuery: string;
  /**
   * The date of the data this page renders: the HK_FETCHED_ON of the corpus
   * read its authored numbers were checked against. Never later than
   * HK_FETCHED_ON, and never the writing date — the synthesis was written on
   * 2026-09-04, but what it describes is the 2026-08-28 read. A dataset
   * refresh nobody re-checked the prose against leaves this behind, which is
   * the truth about the prose. Kept as a literal "YYYY-MM-DD" in the entries
   * file because stale-report parses it with a regex, not an import.
   */
  updated: string;
  /** Markdown. The synthesis above the derived table. */
  intro: string;
  /** Markdown. Rendered under "What will bite you". */
  traps: string;
  faqs: { q: string; a: string }[];
};

export const HK_BASE = "/healthkit";

/**
 * The page's own dates, as distinct from the data date in `updated`.
 *
 * All twelve group pages were first published in 35bc67c on 2026-09-04, a
 * week after the 2026-08-28 corpus read their tables first came from, and
 * their content did not change again until the 2026-10-02 re-read (earlier
 * edits added the age display and these stamps, not claims). Putting the data date in dateModified would therefore
 * say the page changed before it existed, and lifting it to the publish date
 * with a max() would be a rule for manufacturing freshness, not recording it. So
 * structured data and the sitemap carry these two dates, and the reader sees
 * the data date with its age beside it. When a page's content changes, give
 * it its own date in HK_GROUP_MODIFIED_BY_SLUG below rather than moving this
 * shared one; a re-verification that changes nothing is an `updated` matter
 * only.
 */
export const HK_GROUP_PUBLISHED = "2026-09-04";
export const HK_GROUP_MODIFIED = "2026-09-04";

/**
 * Pages whose authored content changed after HK_GROUP_MODIFIED, each with its
 * own date — one shared constant would either understate these or claim the
 * other pages changed too. 2026-10-02: vital-signs and reproductive-health
 * were rewritten against the re-read corpus (heartRateVariabilityRMSSD; the
 * iOS 27.0 beta flags clearing), and one false sentence on nutrition was
 * corrected.
 */
const HK_GROUP_MODIFIED_BY_SLUG: Record<string, string> = {
  "vital-signs": "2026-10-02",
  "reproductive-health": "2026-10-02",
  nutrition: "2026-10-02",
  // Same day, once the generator read Apple's deprecatedAt: the deprecation
  // versions and Apple's replacement notes were added to both pages' prose.
  "environment-and-hearing": "2026-10-02",
  "workout-activities": "2026-10-02",
};

/** A group page's own dateModified (JSON-LD and sitemap use this, never `updated`). */
export function hkGroupModified(slug: string): string {
  return HK_GROUP_MODIFIED_BY_SLUG[slug] ?? HK_GROUP_MODIFIED;
}

/**
 * Apple group → page slug. The three environment-adjacent groups share a
 * page; sleep, mindfulness, self-care and alcohol share a page. Every Apple
 * SUBJECT group must appear here — buildHkGroups() throws on an unmapped
 * group rather than silently dropping identifiers, so a new group in a
 * dataset refresh fails the build instead of vanishing.
 *
 * Apple's generic, docs-generated topic headings ("Type Properties",
 * "Type Properties - generated") are deliberately NOT mapped. They say
 * nothing about subject, so mapping one wholesale would silently file every
 * future identifier Apple drops under it onto a page nobody chose. Those
 * identifiers are placed one at a time in CASE_OVERRIDES below.
 */
export const GROUP_TO_SLUG: Record<string, string> = {
  Activity: "activity",
  Nutrition: "nutrition",
  "Vital signs": "vital-signs",
  "Vital Signs": "vital-signs",
  Mobility: "mobility",
  "Body measurements": "body-measurements",
  "Lab and test results": "lab-and-test-results",
  "Reproductive Health": "reproductive-health",
  "Reproductive health": "reproductive-health",
  Hearing: "environment-and-hearing",
  "UV exposure": "environment-and-hearing",
  Diving: "environment-and-hearing",
  "Mindfulness and Sleep": "sleep-mindfulness-self-care",
  "Self Care": "sleep-mindfulness-self-care",
  "Alcohol consumption": "sleep-mindfulness-self-care",
  "Characteristic Types": "characteristics",
  "Exercise and fitness": "exercise-and-fitness",
  "Team sports": "workout-activities",
  "Individual sports": "workout-activities",
  "Racket sports": "workout-activities",
  "Studio activities": "workout-activities",
  "Martial arts": "workout-activities",
  "Outdoor activities": "workout-activities",
  "Snow and ice sports": "workout-activities",
  "Water activities": "workout-activities",
  "Multisport activities": "workout-activities",
  "Deprecated activity types": "workout-activities",
  "Other activities": "workout-activities",
};

/**
 * Per-identifier placements — the editorial exceptions, one line each. Only
 * for identifiers Apple files under a generic topic heading instead of a
 * subject group. Each override names the Apple group it was read under and
 * applies only while Apple still files the identifier there: if Apple
 * re-files it, the override stops applying and GROUP_TO_SLUG (or its throw)
 * decides again, so a stale override can never silently pin an identifier
 * to the wrong page. Keyed by Swift case; cases are unique across the four
 * families in the dataset.
 */
export const CASE_OVERRIDES: Record<string, { appleGroup: string; slug: string }> = {
  // iOS 26.2 category type with no abstract and no discussion. Apple lists it
  // under a docs-generated "Type Properties - generated" topic, not under
  // "Vital Signs" with the other heart-event category types; it belongs with
  // vital signs.
  hypertensionEvent: { appleGroup: "Type Properties - generated", slug: "vital-signs" },
  // iOS 27.0 quantity type. Apple's HKQuantityTypeIdentifier index
  // (https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier,
  // read 2026-10-02) lists it under a generic "Type Properties" topic rather
  // than "Vital signs", and its own page carries a declaration only — no
  // abstract, no discussion — so Apple says nothing about its subject. It is
  // placed beside its namesake heartRateVariabilitySDNN, which Apple files
  // under "Vital signs". The placement is ours, not Apple's.
  heartRateVariabilityRMSSD: { appleGroup: "Type Properties", slug: "vital-signs" },
};

/** The page slug an identifier is rendered on, or undefined if unmapped. */
export function hkGroupSlugOf(id: Pick<HkIdentifier, "case" | "group">): string | undefined {
  const override = CASE_OVERRIDES[id.case];
  if (override && override.appleGroup === id.group) return override.slug;
  return GROUP_TO_SLUG[id.group];
}

const SLUG_LABEL: Record<string, string> = {
  activity: "Activity",
  nutrition: "Nutrition",
  "vital-signs": "Vital signs",
  mobility: "Mobility",
  "body-measurements": "Body measurements",
  "lab-and-test-results": "Lab and test results",
  "reproductive-health": "Reproductive health",
  "environment-and-hearing": "Environment, hearing and diving",
  "sleep-mindfulness-self-care": "Sleep, mindfulness and self-care",
  characteristics: "Characteristics",
  "exercise-and-fitness": "Exercise and fitness activities",
  "workout-activities": "Workout activity types",
};

export function hkGroupLabel(slug: string): string {
  return SLUG_LABEL[slug] ?? slug;
}

let CACHE: Map<string, HkIdentifier[]> | null = null;

/** slug → members. Throws on an unmapped identifier (see GROUP_TO_SLUG and CASE_OVERRIDES). */
export function buildHkGroups(): Map<string, HkIdentifier[]> {
  if (CACHE) return CACHE;
  const m = new Map<string, HkIdentifier[]>();
  for (const id of HK_IDENTIFIERS) {
    const slug = hkGroupSlugOf(id);
    if (!slug) {
      throw new Error(
        `hkGroupPages: Apple group "${id.group}" (${id.case}) has no page mapping — add a subject group to GROUP_TO_SLUG, or place a generic-topic identifier in CASE_OVERRIDES`,
      );
    }
    const list = m.get(slug) ?? [];
    list.push(id);
    m.set(slug, list);
  }
  CACHE = m;
  return m;
}

export function releasedHkGroups(): HkGroupEntry[] {
  const groups = buildHkGroups();
  return hkGroupEntries.filter((e) => groups.has(e.slug));
}

export function getHkGroup(slug: string): { entry: HkGroupEntry; members: HkIdentifier[] } | undefined {
  const entry = hkGroupEntries.find((e) => e.slug === slug);
  const members = buildHkGroups().get(slug);
  if (!entry || !members) return undefined;
  return { entry, members };
}

export { HK_FETCHED_ON };
