/**
 * HealthKit group reference pages — /healthkit/<group>.
 *
 * The flagship /healthkit-identifiers page deliberately keeps all 240
 * identifiers on one URL; that page ranks for the set, not for the strings.
 * These twelve pages are the middle layer: one per group, each substantial
 * enough to stand alone (7–84 identifiers with real synthesis), each an
 * anchor surface for the exact identifier strings developers paste into a
 * search box. 240 pages stays rejected — Apple's median discussion is 23
 * words and per-identifier pages would be thin.
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
 * week after the 2026-08-28 corpus read their tables come from, and their
 * content has not changed since (later edits added the age display and these
 * stamps, not claims). Putting the data date in dateModified would therefore
 * say the page changed before it existed, and lifting it to the publish date
 * with a max() would be a rule for manufacturing freshness, not recording it. So
 * structured data and the sitemap carry these two dates, and the reader sees
 * the data date with its age beside it. Move HK_GROUP_MODIFIED when a page's
 * content changes; a re-verification that changes nothing is an `updated`
 * matter only.
 */
export const HK_GROUP_PUBLISHED = "2026-09-04";
export const HK_GROUP_MODIFIED = "2026-09-04";

/**
 * Apple group → page slug. Editorial in exactly one place: hypertensionEvent
 * sits in a docs-generated section on Apple's side and belongs with vital
 * signs; the three environment-adjacent groups share a page; sleep,
 * mindfulness, self-care and alcohol share a page. Every Apple group must
 * appear here — buildHkGroups() throws on an unmapped group rather than
 * silently dropping identifiers, so a new group in a dataset refresh fails
 * the build instead of vanishing.
 */
export const GROUP_TO_SLUG: Record<string, string> = {
  Activity: "activity",
  Nutrition: "nutrition",
  "Vital signs": "vital-signs",
  "Vital Signs": "vital-signs",
  "Type Properties - generated": "vital-signs",
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

/** slug → members. Throws on an unmapped Apple group (see GROUP_TO_SLUG). */
export function buildHkGroups(): Map<string, HkIdentifier[]> {
  if (CACHE) return CACHE;
  const m = new Map<string, HkIdentifier[]>();
  for (const id of HK_IDENTIFIERS) {
    const slug = GROUP_TO_SLUG[id.group];
    if (!slug) {
      throw new Error(
        `hkGroupPages: Apple group "${id.group}" (${id.case}) has no page mapping — add it to GROUP_TO_SLUG`,
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
