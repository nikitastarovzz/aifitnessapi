import {
  WT_CROSSWALK,
  WT_FALLBACKS,
  WT_FETCHED_ON,
  WT_FLAGS,
  WT_GHAPI_FIELDS,
  WT_GOOGLE_HEALTH_API,
  WT_HC_SEGMENT_RULE,
  WT_HC_SEGMENT_TYPES,
  WT_HC_STRING_MAP,
  WT_HC_UNIVERSAL_SEGMENTS,
  WT_HEALTHKIT,
  WT_HEALTH_CONNECT,
  WT_INT_COMPARISON,
  WT_MAPPING_SEARCH,
  WT_NORMALISATION,
  WT_PLATFORMS,
  WT_SOURCES,
  WT_STATED_MAPPINGS,
  WT_WEAR_OS,
  WT_WEAR_OS_INTERNAL,
  WT_WEAR_OS_NEXT_ID,
  type WtCounterpart,
  type WtCrosswalkRow,
  type WtFlag,
  type WtGoogleHealthApiType,
  type WtHealthConnectType,
  type WtHealthKitType,
  type WtPlatform,
  type WtPlatformSlug,
  type WtSource,
  type WtWearOsType,
} from "./workoutTypes";

/**
 * Page copy for /workout-types, the four platform list pages and the
 * per-activity pages, derived from the generated src/data/workoutTypes.ts
 * (scripts/fetch-workout-types.mjs). Every name, number and quoted sentence
 * is read from that module. What is written here by hand is the framing:
 * titles, the order of sections, which page on this site covers each
 * platform, and the rule that decides which crosswalk rows get a page.
 *
 * Nothing here joins two constants. The crosswalk in the module is name
 * identity under WT_NORMALISATION and nothing else; these helpers only read it.
 */

export const WT_BASE = "/workout-types";
export const WT_FETCHED = WT_FETCHED_ON;
export const WT_DATASET = "workout-types-crosswalk-2026";

const TITLE_MAX = 60;
const DESC_MAX = 155;

/** The first candidate that fits; the last one clamped as a final resort. */
export function fit(candidates: string[], max: number): string {
  for (const c of candidates) if (c.length <= max) return c;
  const last = candidates[candidates.length - 1];
  return last.length <= max ? last : `${last.slice(0, max - 1).trimEnd()}…`;
}
const fitTitle = (c: string[]) => fit(c, TITLE_MAX);
const fitDescription = (c: string[]) => fit(c, DESC_MAX);

/** "a, b and c". */
export function listOf(items: string[], last = "and"): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} ${last} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} ${last} ${items.at(-1)}`;
}
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
/** The first `max` items, then "and N more" when the list is longer. */
export function firstOf(items: string[], max: number): string {
  if (items.length <= max) return listOf(items);
  return `${items.slice(0, max).join(", ")} and ${items.length - max} more`;
}
const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");
/** Apple's two calorie sentences, matched exactly. */
export const HK_OPTIMIZED = "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors.";
export const HK_ESTIMATES = "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving.";

// ── Platforms ───────────────────────────────────────────────────────────────

export const PLATFORM_ORDER: WtPlatformSlug[] = ["healthkit", "health-connect", "wear-os", "google-health-api"];

export function getPlatform(slug: string): WtPlatform | undefined {
  return WT_PLATFORMS.find((p) => p.slug === slug);
}
export function platform(slug: WtPlatformSlug): WtPlatform {
  const p = getPlatform(slug);
  if (!p) throw new Error(`workout types: no platform ${slug}`);
  return p;
}
export const platformPath = (slug: WtPlatformSlug) => `${WT_BASE}/${slug}`;
export const isPlatformSlug = (slug: string): slug is WtPlatformSlug => PLATFORM_ORDER.includes(slug as WtPlatformSlug);

/** How a constant is written in code on its platform. */
export function qualified(c: WtCounterpart): string {
  switch (c.platform) {
    case "healthkit":
      return `HKWorkoutActivityType.${c.name}`;
    case "health-connect":
      return `ExerciseSessionRecord.${c.name}`;
    case "wear-os":
      return `ExerciseType.${c.name}`;
    default:
      return c.name;
  }
}

/** The row anchor of a constant on its platform's list page. */
export const constantId = (name: string) => `t-${name.toLowerCase()}`;
export const constantHref = (c: WtCounterpart) => `${platformPath(c.platform)}#${constantId(c.name)}`;
export const crosswalkId = (key: string) => `xw-${key}`;

export type AnyConstant = WtHealthKitType | WtHealthConnectType | WtWearOsType | WtGoogleHealthApiType;

export function healthkitCase(name: string) {
  return WT_HEALTHKIT.find((h) => h.case === name);
}
export function healthConnectConstant(name: string) {
  return WT_HEALTH_CONNECT.find((h) => h.name === name);
}
export function wearOsConstant(name: string) {
  return WT_WEAR_OS.find((h) => h.name === name);
}
export function ghapiValue(name: string) {
  return WT_GOOGLE_HEALTH_API.find((h) => h.value === name);
}

/** The number a platform prints for a constant, as text; null where none is printed. */
export function printedNumber(c: WtCounterpart): string | null {
  if (c.platform === "health-connect") return String(healthConnectConstant(c.name)?.value ?? "");
  if (c.platform === "wear-os") {
    const id = wearOsConstant(c.name)?.id;
    return id === null || id === undefined ? null : String(id);
  }
  return null;
}

/** Every constant of one platform, with its name and counterparts, in source order. */
export function constantsOf(slug: WtPlatformSlug): { name: string; counterparts: WtCounterpart[] }[] {
  switch (slug) {
    case "healthkit":
      return WT_HEALTHKIT.map((h) => ({ name: h.case, counterparts: h.counterparts }));
    case "health-connect":
      return WT_HEALTH_CONNECT.map((h) => ({ name: h.name, counterparts: h.counterparts }));
    case "wear-os":
      return WT_WEAR_OS.map((h) => ({ name: h.name, counterparts: h.counterparts }));
    default:
      return WT_GOOGLE_HEALTH_API.map((h) => ({ name: h.value, counterparts: h.counterparts }));
  }
}
export const unmatchedOf = (slug: WtPlatformSlug) => constantsOf(slug).filter((c) => c.counterparts.length === 0);
export const matchedOf = (slug: WtPlatformSlug) => constantsOf(slug).filter((c) => c.counterparts.length > 0);

/** Constants of `slug` whose name matches a constant of `other`. */
export function sharedWith(slug: WtPlatformSlug, other: WtPlatformSlug) {
  return constantsOf(slug).filter((c) => c.counterparts.some((x) => x.platform === other));
}

// ── Sources ─────────────────────────────────────────────────────────────────

export function source(id: string): WtSource {
  const s = WT_SOURCES.find((x) => x.id === id);
  if (!s) throw new Error(`workout types: unknown source ${id}`);
  return s;
}
export const sourcesFor = (slug: WtPlatformSlug) => WT_SOURCES.filter((s) => s.platform === slug);

// ── Crosswalk numbers ───────────────────────────────────────────────────────

export function hubTotals() {
  const byPlatforms = (n: number) => WT_CROSSWALK.filter((r) => r.cells.length === n).length;
  return {
    rows: WT_CROSSWALK.length,
    onAll: byPlatforms(4),
    onThree: byPlatforms(3),
    onTwo: byPlatforms(2),
    flags: WT_FLAGS.length,
    searched: WT_MAPPING_SEARCH.length,
    stated: WT_STATED_MAPPINGS.length,
    constants: PLATFORM_ORDER.reduce((n, p) => n + platform(p).count, 0),
  };
}

/** Same name on Health Connect and Wear OS, different printed integers. */
export const intMismatches = () => WT_INT_COMPARISON.filter((c) => !c.same);
/** Health Connect constants whose platform-API value differs from the Jetpack value. */
export const platformValueMismatches = () => WT_HEALTH_CONNECT.filter((c) => c.platform && c.platform.value !== c.value);

/**
 * A pair the rule leaves apart, shown so the reader sees the rule bite: the
 * first listed HealthKit case and Health Connect constant that both exist
 * and have no counterpart on each other's platform. Purely a statement about
 * two names; it says nothing about the activities.
 */
export function apartExamples(): { a: WtCounterpart; b: WtCounterpart }[] {
  const pairs: [WtCounterpart, WtCounterpart][] = [
    [{ platform: "healthkit", name: "cycling" }, { platform: "health-connect", name: "EXERCISE_TYPE_BIKING" }],
    [{ platform: "healthkit", name: "americanFootball" }, { platform: "health-connect", name: "EXERCISE_TYPE_FOOTBALL_AMERICAN" }],
    [{ platform: "healthkit", name: "pickleball" }, { platform: "google-health-api", name: "PICKELBALL" }],
  ];
  const exists = (c: WtCounterpart) => constantsOf(c.platform).find((x) => x.name === c.name);
  return pairs
    .filter(([a, b]) => {
      const x = exists(a);
      const y = exists(b);
      return x && y && !x.counterparts.some((k) => k.platform === b.platform && k.name === b.name);
    })
    .map(([a, b]) => ({ a, b }));
}

// ── Per-activity pages ──────────────────────────────────────────────────────

/**
 * THE RULE for a page of its own. A crosswalk row gets one only when it
 * joins at least ACTIVITY_MIN_PLATFORMS platforms AND the sources give at
 * least ACTIVITY_MIN_FACTS facts about the activity beyond names. A fact is
 * one of:
 *
 *   hk-discussion            Apple's discussion paragraph on the HealthKit case
 *   hk-deprecation           Apple's deprecation note on the HealthKit case
 *   hc-segments              the Health Connect library's segment table names
 *                            the session type (its own segment list, or every
 *                            segment type)
 *   hc-description           the Jetpack reference describes the constant
 *   hc-platform-deprecation  the platform reference deprecates the platform
 *                            constant the library converts it to
 *   hs-description           the Wear OS reference describes the constant
 *
 * Not facts: a name, a value or id, Apple's one-line abstract, the Google
 * Health API's "<Name> type." description, availability. Every other row
 * stays a row on the hub and the four list pages. qa.mjs recomputes this
 * rule from the generated module and fails the build when the pages built
 * differ from it in either direction (WORKOUT-TYPE-PAGE-RULE).
 */
export const ACTIVITY_MIN_PLATFORMS = 3;
export const ACTIVITY_MIN_FACTS = 2;
export const ACTIVITY_RULE = `A crosswalk row gets a page of its own only when it joins at least ${ACTIVITY_MIN_PLATFORMS} platforms and the sources state at least ${ACTIVITY_MIN_FACTS} things about the activity beyond its names: Apple's discussion or deprecation note on the HealthKit case, the Health Connect library's segment table naming the session type, a Jetpack or Wear OS reference description, or a platform deprecation. Names, numbers, one-line abstracts and availability do not count.`;

export type ActivityFact =
  | { kind: "hk-discussion"; constant: string; texts: string[] }
  | { kind: "hk-deprecation"; constant: string; texts: string[] }
  | { kind: "hc-segments"; constant: string; texts: string[]; rule: WtHealthConnectType["segments"] }
  | { kind: "hc-description"; constant: string; texts: string[] }
  | { kind: "hc-platform-deprecation"; constant: string; texts: string[] }
  | { kind: "hs-description"; constant: string; texts: string[] };

export function factsOf(row: WtCrosswalkRow): ActivityFact[] {
  const facts: ActivityFact[] = [];
  for (const c of row.cells) {
    if (c.platform === "healthkit") {
      const h = healthkitCase(c.name);
      if (h?.discussion.length) facts.push({ kind: "hk-discussion", constant: c.name, texts: h.discussion });
      if (h?.deprecation?.message) facts.push({ kind: "hk-deprecation", constant: c.name, texts: [h.deprecation.message] });
    } else if (c.platform === "health-connect") {
      const h = healthConnectConstant(c.name);
      if (h && h.segments.rule !== "universal-only" && h.segments.evidence) {
        facts.push({ kind: "hc-segments", constant: c.name, texts: [h.segments.evidence], rule: h.segments });
      }
      if (h?.description) facts.push({ kind: "hc-description", constant: c.name, texts: [h.description] });
      if (h?.platform?.deprecationNote) facts.push({ kind: "hc-platform-deprecation", constant: c.name, texts: [h.platform.deprecationNote] });
    } else if (c.platform === "wear-os") {
      const h = wearOsConstant(c.name);
      if (h?.description) facts.push({ kind: "hs-description", constant: c.name, texts: [h.description] });
    }
  }
  return facts;
}

export const qualifiesForPage = (row: WtCrosswalkRow) =>
  row.cells.length >= ACTIVITY_MIN_PLATFORMS && factsOf(row).length >= ACTIVITY_MIN_FACTS;

/** Rows with a page, in crosswalk order. Throws if a slug would shadow a platform page. */
export function activityRows(): WtCrosswalkRow[] {
  const rows = WT_CROSSWALK.filter(qualifiesForPage);
  for (const r of rows) if (isPlatformSlug(r.slug)) throw new Error(`workout types: activity slug ${r.slug} collides with a platform page`);
  return rows;
}
export const activityPath = (row: { slug: string }) => `${WT_BASE}/${row.slug}`;
export const getActivity = (slug: string) => activityRows().find((r) => r.slug === slug);
export const rowOf = (key: string) => WT_CROSSWALK.find((r) => r.key === key);
/** The activity page for a crosswalk key, if the rule gives it one. */
export const activityPageForKey = (key: string) => activityRows().find((r) => r.key === key);

/** "Running", "High intensity interval training", "Stair climbing". */
export function activityLabel(row: WtCrosswalkRow): string {
  const words = row.slug.split("-").join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// ── Titles, descriptions, H1s ───────────────────────────────────────────────

export const HUB_TITLE = "Workout Type Crosswalk: HealthKit, Health Connect, Wear OS";
export const HUB_H1 = "Workout types on HealthKit, Health Connect, Wear OS and the Google Health API";

export function hubDescription(): string {
  const t = hubTotals();
  const [hk, hc, hs, gh] = PLATFORM_ORDER.map((p) => platform(p).count);
  return fitDescription([
    `${hk} HealthKit, ${hc} Health Connect, ${hs} Wear OS and ${gh} Google Health API workout types side by side, joined only where names match: ${t.rows} rows.`,
    `${hk} HealthKit, ${hc} Health Connect, ${hs} Wear OS and ${gh} Google Health API workout types, joined only where names match.`,
  ]);
}

export function hubCapsule(): string {
  const t = hubTotals();
  const [hk, hc, hs, gh] = PLATFORM_ORDER.map((p) => platform(p));
  const apart = apartExamples()[0];
  return `HealthKit has ${hk.count} ${hk.enumeration} cases, Health Connect ${hc.count} ${hc.enumeration} constants, Wear OS Health Services ${hs.count} ${hs.enumeration} constants and the Google Health API ${gh.count} ${gh.enumeration} values. None of the ${t.searched} Apple and Google pages read for this reference maps one list onto another, so its crosswalk joins two constants only when their names match once the EXERCISE_TYPE_ prefix, letter case and separators are removed: ${t.rows} rows, ${t.onAll} of them on all four platforms.${
    apart ? ` ${qualified(apart.a)} and ${qualified(apart.b)} have different names, so they stay apart.` : ""
  } Read from the sources on ${WT_FETCHED}.`;
}

type PlatformCopy = { title: string[]; h1: string; description: string[]; label: string };

function platformCopy(slug: WtPlatformSlug): PlatformCopy {
  const p = platform(slug);
  const n = p.count;
  const matched = matchedOf(slug).length;
  switch (slug) {
    case "healthkit":
      return {
        label: "HealthKit",
        title: [`HKWorkoutActivityType: All ${n} Cases and Android Name Matches`, `HKWorkoutActivityType: All ${n} Cases, Name Matches`],
        h1: `HKWorkoutActivityType: all ${n} cases and their same-name constants on Health Connect, Wear OS and the Google Health API`,
        description: [
          `All ${n} HKWorkoutActivityType cases with Apple's wording, groups and availability, and the Health Connect, Wear OS or Google Health API name each shares.`,
          `All ${n} HKWorkoutActivityType cases with Apple's wording and the Health Connect, Wear OS or Google Health API constant of the same name.`,
        ],
      };
    case "health-connect":
      return {
        label: "Health Connect",
        title: [`Health Connect Exercise Types: All ${n} Values and Segments`, `Health Connect Exercise Types: All ${n} Values`],
        h1: `Health Connect exercise types: all ${n} EXERCISE_TYPE_ constants, their platform values, allowed segments and same-name constants elsewhere`,
        description: [
          `All ${n} ExerciseSessionRecord.EXERCISE_TYPE_ values, the different numbers the platform API uses, the segments each session type accepts, and ${matched} name matches.`,
          `All ${n} ExerciseSessionRecord.EXERCISE_TYPE_ values, their platform API numbers, allowed segments and same-name constants elsewhere.`,
        ],
      };
    case "wear-os":
      return {
        label: "Wear OS",
        title: [`Wear OS ExerciseType: All ${n} Health Services Exercise Types`, `Wear OS ExerciseType: All ${n} Exercise Types`],
        h1: `Wear OS Health Services ExerciseType: all ${n} constants with their ids and same-name constants on the other platforms`,
        description: [
          `All ${n} Health Services ExerciseType constants with the ids Google's source assigns, and the Health Connect, HealthKit or Google Health API name each shares.`,
          `All ${n} Health Services ExerciseType constants with their ids and the same-name constants on Health Connect, HealthKit and the Google Health API.`,
        ],
      };
    default:
      return {
        label: "Google Health API",
        title: [`Google Health API exerciseType: All ${n} Values Mapped`, `Google Health API exerciseType Values`],
        h1: `Google Health API exerciseType: all ${n} values and their same-name constants on HealthKit, Health Connect and Wear OS`,
        description: [
          `All ${n} Google Health API exerciseType values with Google's descriptions, and the HealthKit, Health Connect or Wear OS constant of the same name for ${matched}.`,
          `All ${n} Google Health API exerciseType values with Google's descriptions and the same-name constants on HealthKit, Health Connect and Wear OS.`,
        ],
      };
  }
}
export const platformTitle = (slug: WtPlatformSlug) => fitTitle(platformCopy(slug).title);
export const platformH1 = (slug: WtPlatformSlug) => platformCopy(slug).h1;
export const platformDescription = (slug: WtPlatformSlug) => fitDescription(platformCopy(slug).description);
export const platformLabel = (slug: WtPlatformSlug) => platformCopy(slug).label;

/** The platform's name inside a sentence ("the Google Health API"). */
export const inSentence = (slug: WtPlatformSlug) => (slug === "google-health-api" ? "the Google Health API" : platform(slug).short);
export const unitOf = (slug: WtPlatformSlug) => (slug === "google-health-api" ? "values" : slug === "healthkit" ? "cases" : "constants");

const CAPSULE_HEAD: Record<WtPlatformSlug, (n: number) => string> = {
  healthkit: (n) => `HealthKit names a workout's activity with ${n} HKWorkoutActivityType cases.`,
  "health-connect": (n) => `Health Connect names an exercise session's type with ${n} ExerciseSessionRecord.EXERCISE_TYPE_ constants.`,
  "wear-os": (n) => `Wear OS Health Services names an exercise with ${n} public ExerciseType constants.`,
  "google-health-api": (n) => `The Google Health API names an exercise's type with ${n} exerciseType values.`,
};

export function platformCapsule(slug: WtPlatformSlug): string {
  const p = platform(slug);
  const matched = matchedOf(slug);
  const un = unmatchedOf(slug);
  const others = PLATFORM_ORDER.filter((x) => x !== slug).map(inSentence);
  const examples = un.slice(0, 2).map((c) => qualified({ platform: slug, name: c.name }));
  const rest =
    un.length === 0
      ? "every one does."
      : un.length === 1
        ? `the other one, ${examples[0]}, has no same-name counterpart.`
        : `the other ${un.length}, such as ${listOf(examples)}, have none.`;
  const join = `${matched.length} share a name with a constant on ${listOf(others, "or")} once the EXERCISE_TYPE_ prefix, case and separators are removed; ${rest}`;
  return `${CAPSULE_HEAD[slug](p.count)} ${join} ${p.valueNote} Read from the sources on ${p.readOn}.`;
}

type ActivityCells = Partial<Record<WtPlatformSlug, string>>;
export function activityCells(row: WtCrosswalkRow): ActivityCells {
  return Object.fromEntries(row.cells.map((c) => [c.platform, c.name]));
}

export function activityTitle(row: WtCrosswalkRow): string {
  const l = activityLabel(row).replace(/\b\w/g, (c) => c.toUpperCase());
  return fitTitle([
    `${l} Workout Type: HealthKit, Health Connect, Wear OS`,
    `${l} Workout Type on Every Platform`,
    `${l}: Workout Type Constants`,
  ]);
}
export function activityH1(row: WtCrosswalkRow): string {
  return `${activityLabel(row)} as a workout type on ${listOf(row.cells.map((c) => inSentence(c.platform)))}`;
}
export function activityDescription(row: WtCrosswalkRow): string {
  const parts = row.cells.map((c) => {
    const n = printedNumber(c);
    return `${qualified(c)}${n !== null ? ` (${n})` : ""}`;
  });
  const facts = factsOf(row);
  const tail = [
    facts.some((f) => f.kind === "hk-discussion") ? "Apple's calorie note" : null,
    facts.some((f) => f.kind === "hc-segments") ? "the segments Health Connect accepts" : null,
    facts.some((f) => f.kind === "hs-description") ? "Google's Wear OS description" : null,
  ].filter(Boolean) as string[];
  return fitDescription([
    `${listOf(parts)} side by side${tail.length ? `, with ${listOf(tail)}` : ""}.`,
    `${activityLabel(row)} on ${row.cells.length} platforms: ${listOf(parts)}.`,
    `${activityLabel(row)} as a workout type on ${row.cells.length} platforms, with each constant, its number and what the sources say about it.`,
  ]);
}

export function activityCapsule(row: WtCrosswalkRow): string {
  const l = activityLabel(row);
  const parts = row.cells.map((c) => {
    const n = printedNumber(c);
    return `${qualified(c)}${n !== null ? ` (${n})` : ""}`;
  });
  const cmp = WT_INT_COMPARISON.find((x) => x.key === row.key);
  const nums = cmp
    ? cmp.same
      ? `, and the Health Connect and Wear OS numbers are equal`
      : `, but the Health Connect and Wear OS numbers differ (${cmp.healthConnect.value} and ${cmp.wearOs.id})`
    : "";
  const sentences: string[] = [
    `${l} has a constant on ${row.cells.length === 4 ? "all four platforms" : `${row.cells.length} of the four platforms`}: ${listOf(parts)}.`,
    `The names match once the EXERCISE_TYPE_ prefix, case and separators are removed${nums}; none of the Apple and Google pages read for this reference maps them to each other.`,
  ];
  const facts = factsOf(row);
  const hk = facts.find((f) => f.kind === "hk-discussion");
  const seg = facts.find((f) => f.kind === "hc-segments");
  const hs = facts.find((f) => f.kind === "hs-description");
  if (hk) sentences.push(`Apple says: “${hk.texts[0].replace(/`/g, "")}”`);
  if (seg && seg.kind === "hc-segments") sentences.push(segmentSentence(seg.constant, seg.rule));
  if (hs) sentences.push(`Google describes ExerciseType.${hs.constant} as “${hs.texts[0]}”`);
  return sentences.slice(0, 4).join(" ");
}

/** One sentence on what a Health Connect session type's segments may be. */
export function segmentSentence(constant: string, rule: WtHealthConnectType["segments"]): string {
  const universal = WT_HC_UNIVERSAL_SEGMENTS.segments.length;
  if (rule.rule === "any") return `A Health Connect session of type ${constant} accepts any segment type.`;
  if (rule.rule === "universal-only") return `Health Connect's segment table does not name ${constant}, so its sessions accept only the ${universal} segment types every session accepts.`;
  const own = rule.via ? `the ${rule.segments.length} segment types in ${rule.via}` : `${listOf(rule.segments)} segments`;
  return `A Health Connect session of type ${constant} accepts ${own}, besides the ${universal} segment types every session accepts.`;
}

// ── FAQs ────────────────────────────────────────────────────────────────────

export type Faq = { q: string; a: string };

export function hubFaqs(): Faq[] {
  const t = hubTotals();
  const mism = intMismatches();
  const pv = platformValueMismatches();
  const hcOnHk = sharedWith("healthkit", "health-connect").length;
  const hk = platform("healthkit");
  const faqs: Faq[] = [
    {
      q: "Is there an official mapping between HealthKit workout types and Health Connect exercise types?",
      a: `Not on any page this reference read. Apple documents ${hk.count} HKWorkoutActivityType cases and Google ${platform("health-connect").count} ExerciseSessionRecord constants, and none of the ${t.searched} Apple and Google pages checked on ${WT_FETCHED} maps one list onto the other. Going by names alone, ${hcOnHk} of the HealthKit cases match a Health Connect constant once the EXERCISE_TYPE_ prefix, case and separators are removed; the rest have no same-name counterpart.`,
    },
  ];
  if (mism.length) {
    const ex = mism.slice(0, 3).map((m) => `${m.healthConnect.name.replace(/^EXERCISE_TYPE_/, "")} is ${m.healthConnect.value} on Health Connect and ${m.wearOs.id} on Wear OS`);
    faqs.push({
      q: "Can a Wear OS ExerciseType id be stored as a Health Connect exercise type value?",
      a: `Not by number. ${WT_INT_COMPARISON.length} constants have the same name on both, and ${mism.length} of them carry different integers: ${ex.join("; ")}. Neither Google page says the two numberings are interchangeable; the names line up, the numbers do not.`,
    });
  }
  if (pv.length) {
    const r = healthConnectConstant("EXERCISE_TYPE_RUNNING");
    faqs.push({
      q: "Why does a Health Connect exercise type have two different integer values?",
      a: `Health Connect has two APIs. The Jetpack library's ExerciseSessionRecord constants and the platform API's ExerciseSessionType constants (API level 34) number the same types differently: ${pv.length} of ${WT_HEALTH_CONNECT.length} pairs differ${
        r?.platform ? `, for example EXERCISE_TYPE_RUNNING is ${r.value} in the library and EXERCISE_SESSION_TYPE_RUNNING is ${r.platform.value} on the platform` : ""
      }. The library converts between them in IntDefMappings.kt, with toPlatformExerciseSessionType() one way and toSdkExerciseSessionType() the other.`,
    });
  }
  const gh = platform("google-health-api");
  faqs.push({
    q: "Which platform has the most workout types: HealthKit, Health Connect, Wear OS or the Google Health API?",
    a: `In the sources as read for this reference (the Google Health API's on ${gh.readOn}, the others on ${hk.readOn}): the Google Health API's exerciseType enum has ${gh.count} values (one of them EXERCISE_TYPE_UNSPECIFIED), Wear OS Health Services ${platform("wear-os").count} public ExerciseType constants, HealthKit ${hk.count} HKWorkoutActivityType cases and Health Connect ${platform("health-connect").count} EXERCISE_TYPE_ constants. ${unmatchedOf("google-health-api").length} of the Google Health API values match no other platform's names.`,
  });
  return faqs;
}

export function platformFaqs(slug: WtPlatformSlug): Faq[] {
  const p = platform(slug);
  const faqs: Faq[] = [];
  if (slug === "healthkit") {
    const optimized = WT_HEALTHKIT.filter((h) => h.discussion.some((d) => d.includes(HK_OPTIMIZED)));
    const estimates = WT_HEALTHKIT.filter((h) => h.discussion.some((d) => d.includes(HK_ESTIMATES)));
    const both = sharedWith("healthkit", "health-connect");
    faqs.push({
      q: "Which HKWorkoutActivityType cases have a Health Connect constant with the same name?",
      a: `${both.length} of the ${p.count}, once the EXERCISE_TYPE_ prefix, case and separators are removed: ${firstOf(both.map((c) => c.name), 8)}, all in the table on this page. The match is by name only; none of the Apple and Google pages read for this reference maps the two lists.`,
    });
    faqs.push({
      q: "Does Apple publish the raw values of HKWorkoutActivityType?",
      a: `Not in its documentation. The ${p.count} case pages read on ${p.readOn} give each case's name, abstract and availability but no raw value, so this reference carries none and joins the platforms by name.`,
    });
    if (optimized.length) {
      faqs.push({
        q: "Which HealthKit workout activity types get optimized calorie calculations from Apple Watch?",
        a: `Apple's discussion says “${HK_OPTIMIZED}” on ${optimized.length} cases: ${listOf(optimized.map((h) => h.case))}.${
          estimates.length ? ` On ${estimates.length} others (${listOf(estimates.map((h) => h.case))}) it says “${HK_ESTIMATES}”` : ""
        }`,
      });
    }
    return faqs;
  }
  if (slug === "health-connect") {
    const any = WT_HEALTH_CONNECT.filter((c) => c.segments.rule === "any");
    const guide = WT_FLAGS.find((f) => f.kind === "guide-only" && f.subject === "EXERCISE_TYPE_UNKNOWN");
    const platformUnknown = WT_FLAGS.find((f) => f.kind === "platform-only" && f.subject === "EXERCISE_SESSION_TYPE_UNKNOWN");
    const other = healthConnectConstant("EXERCISE_TYPE_OTHER_WORKOUT");
    if (guide) {
      faqs.push({
        q: "Is EXERCISE_TYPE_UNKNOWN a Health Connect exercise type?",
        a: `Google's Health Connect data-types guide lists it, but the Jetpack ExerciseSessionRecord reference does not define it. ${
          platformUnknown ? "The platform API does have EXERCISE_SESSION_TYPE_UNKNOWN (0), and the library turns a platform value it has no constant for into EXERCISE_TYPE_OTHER_WORKOUT. " : ""
        }In Jetpack code the catch-all is EXERCISE_TYPE_OTHER_WORKOUT${other ? ` (${other.value})` : ""}.`,
      });
    }
    if (any.length) {
      faqs.push({
        q: "Which Health Connect exercise types accept any segment type?",
        a: `${listOf(any.map((c) => c.name))}. The library's segment table lists them in UNIVERSAL_SESSION_TYPES, and isSegmentTypeCompatibleWithSessionType returns true for any segment in a session of those types. Every other session type accepts the ${WT_HC_UNIVERSAL_SEGMENTS.segments.length} universal segment types plus the ones the table names for it.`,
      });
    }
    if (other?.description) {
      faqs.push({
        q: "What happens to an exercise type Health Connect does not recognise?",
        a: `Google's reference for EXERCISE_TYPE_OTHER_WORKOUT says: “${other.description.replace(/`/g, "")}” When the library converts a platform record, it also maps any platform value it has no constant for to EXERCISE_TYPE_OTHER_WORKOUT (toSdkExerciseSessionType in IntDefMappings.kt).`,
      });
    }
    return faqs;
  }
  if (slug === "wear-os") {
    const running = wearOsConstant("RUNNING");
    const hcOnly = unmatchedOf("wear-os").filter((c) => !c.counterparts.length);
    const notOnHc = WT_WEAR_OS.filter((t) => !t.counterparts.some((c) => c.platform === "health-connect") && t.name !== "UNKNOWN");
    faqs.push({
      q: "Where does Google print the Wear OS ExerciseType ids?",
      a: `Not on the ExerciseType reference, which lists the ${p.count} public constants without numbers. The androidx source it links declares each one as ExerciseType(id, name)${running?.id !== null && running?.id !== undefined ? `, for example RUNNING with id ${running.id}` : ""}, and ExerciseType.fromId(id) returns UNKNOWN for an id that matches none. The source also declares ${WT_WEAR_OS_INTERNAL.length} internal constants the reference does not list.`,
    });
    faqs.push({
      q: "How many exercise types does Wear OS Health Services define?",
      a: `Google's ExerciseType reference lists ${p.count} public constants, read on ${p.readOn}. The androidx source declares ${p.count + WT_WEAR_OS_INTERNAL.length} in all: those ${p.count} and ${WT_WEAR_OS_INTERNAL.length} internal ones an app cannot reference (${listOf(WT_WEAR_OS_INTERNAL.map((t) => t.name))})${
        WT_WEAR_OS_NEXT_ID ? `, under the comment “Next ID: ${WT_WEAR_OS_NEXT_ID}”` : ""
      }.`,
    });
    faqs.push({
      q: "Which Wear OS exercise types have no Health Connect constant with the same name?",
      a: `${notOnHc.length} of the ${p.count}, not counting UNKNOWN: ${listOf(notOnHc.map((t) => t.name))}. Of all ${p.count}, ${hcOnly.length} (UNKNOWN among them) match no name on any of the other three platforms.`,
    });
    return faqs;
  }
  const other = ghapiValue("OTHER");
  const unspecified = ghapiValue("EXERCISE_TYPE_UNSPECIFIED");
  const hkShared = sharedWith("google-health-api", "healthkit");
  faqs.push({
    q: "How many exercise types does the Google Health API have?",
    a: `${p.count} values in the exerciseType enum of the exercise data type, as the v4 discovery document read on ${p.readOn} lists them${unspecified ? `, including EXERCISE_TYPE_UNSPECIFIED (“${unspecified.description}”)` : ""}. ${matchedOf("google-health-api").length} of them share a name with a HealthKit, Health Connect or Wear OS constant.`,
  });
  if (WT_GHAPI_FIELDS.displayName && other) {
    faqs.push({
      q: "When can a Google Health API exercise keep its own display name?",
      a: `Only when exerciseType is OTHER. Google's description of displayName: “${WT_GHAPI_FIELDS.displayName.replace(/`/g, "")}”`,
    });
  }
  faqs.push({
    q: "Which Google Health API exercise types match a HealthKit workout activity type by name?",
    a: `${hkShared.length} of the ${p.count}: ${firstOf(hkShared.map((c) => c.name), 10)}, all in the table on this page. Names are compared after removing case and separators, so CROSS_TRAINING and crossTraining match; nothing is matched by meaning.`,
  });
  return faqs;
}

export function activityFaqs(row: WtCrosswalkRow): Faq[] {
  const l = activityLabel(row);
  const lower = l.toLowerCase();
  const cells = activityCells(row);
  const faqs: Faq[] = [];
  const facts = factsOf(row);
  if (cells.healthkit && cells["health-connect"]) {
    const hc = healthConnectConstant(cells["health-connect"]);
    faqs.push({
      q: `What is the Health Connect constant for HKWorkoutActivityType.${cells.healthkit}?`,
      a: `ExerciseSessionRecord.${cells["health-connect"]}${hc ? `, value ${hc.value}` : ""}. The two names match once the EXERCISE_TYPE_ prefix, case and separators are removed; none of the Apple and Google pages read for this reference maps one to the other, so this is a name match, not a documented equivalence.`,
    });
  } else {
    const parts = row.cells.map((c) => qualified(c));
    faqs.push({
      q: `Which platforms have a ${lower} workout type constant?`,
      a: `${row.cells.length} of the four: ${listOf(parts)}. ${PLATFORM_ORDER.filter((p) => !cells[p]).map((p) => platform(p).short).join(" and ")} ${PLATFORM_ORDER.filter((p) => !cells[p]).length === 1 ? "has" : "have"} no constant of the same name.`,
    });
  }
  const cmp = WT_INT_COMPARISON.find((x) => x.key === row.key);
  if (cmp) {
    faqs.push({
      q: `Is the Wear OS ExerciseType.${cmp.wearOs.name} id the same number as Health Connect's ${cmp.healthConnect.name}?`,
      a: cmp.same
        ? `Yes, both are ${cmp.healthConnect.value}: Health Connect's Jetpack reference prints ${cmp.healthConnect.value} and the androidx ExerciseType.kt source passes ${cmp.wearOs.id}. Google does not say the numberings are shared, and ${intMismatches().length} other same-name pairs differ.`
        : `No. Health Connect's Jetpack reference prints ${cmp.healthConnect.value}; the androidx ExerciseType.kt source gives ExerciseType.${cmp.wearOs.name} the id ${cmp.wearOs.id}. The names match and the numbers do not.`,
    });
  }
  const seg = facts.find((f) => f.kind === "hc-segments");
  if (seg && seg.kind === "hc-segments") {
    faqs.push({
      q: `Which exercise segment types can a Health Connect ${lower} session contain?`,
      a: `${segmentSentence(seg.constant, seg.rule)} The universal ones are ${listOf(WT_HC_UNIVERSAL_SEGMENTS.segments)}. ExerciseSegment.isSegmentTypeCompatibleWithSessionType() answers the question in code${
        WT_HC_SEGMENT_RULE.requireLine ? ", and on devices where the record is not handed to the platform API the ExerciseSessionRecord constructor fails with “segmentType and sessionType is not compatible.”" : "."
      }`,
    });
  }
  const hk = facts.find((f) => f.kind === "hk-discussion");
  if (hk) {
    faqs.push({
      q: `How does HealthKit estimate calories for ${article(lower)} ${lower} workout?`,
      a: `Apple's documentation for HKWorkoutActivityType.${hk.constant} says: “${hk.texts.join(" ").replace(/`/g, "")}”`,
    });
  }
  const hs = facts.find((f) => f.kind === "hs-description");
  if (hs) {
    faqs.push({
      q: `What does Wear OS ExerciseType.${hs.constant} cover?`,
      a: `Google's ExerciseType reference describes it as “${hs.texts[0]}”`,
    });
  }
  return faqs.slice(0, 5);
}

// ── Links to the rest of the site ───────────────────────────────────────────

/** Existing reference pages on this site for each platform (paths verified by qa's PHANTOM-LINK). */
export const PLATFORM_REFERENCES: Record<WtPlatformSlug, { href: string; label: string }[]> = {
  healthkit: [
    { href: "/healthkit/workout-activities", label: "HealthKit workout activity types, by Apple's groups" },
    { href: "/healthkit/exercise-and-fitness", label: "HealthKit exercise and fitness activities" },
    { href: "/healthkit-identifiers", label: "Every HealthKit type identifier" },
    { href: "/healthkit-metadata-keys", label: "Every HealthKit metadata key (workout keys included)" },
  ],
  "health-connect": [
    { href: "/health-connect/exercise-session-record", label: "ExerciseSessionRecord: fields, permissions and constants" },
    { href: "/health-connect", label: "Every Health Connect record type" },
  ],
  "wear-os": [{ href: "/wear-os-data-types", label: "Every Wear OS Health Services data type" }],
  "google-health-api": [
    { href: "/google-health-api/exercise", label: "The Google Health API exercise data type" },
    { href: "/google-health-api", label: "Google Health API reference" },
  ],
};

/** The row for a HealthKit case on this site's HealthKit group pages. */
export function healthkitGroupRow(caseName: string, group: string): string | null {
  const bySport = new Set([
    "Team sports",
    "Individual sports",
    "Racket sports",
    "Studio activities",
    "Martial arts",
    "Outdoor activities",
    "Snow and ice sports",
    "Water activities",
    "Multisport activities",
    "Deprecated activity types",
    "Other activities",
  ]);
  const slug = bySport.has(group) ? "workout-activities" : group === "Exercise and fitness" ? "exercise-and-fitness" : null;
  return slug ? `/healthkit/${slug}#id-${caseName.toLowerCase()}` : null;
}

/** Flags that concern one platform, for its list page. */
export const flagsFor = (slug: WtPlatformSlug): WtFlag[] => WT_FLAGS.filter((f) => f.platform === slug);

export const FLAG_LABEL: Record<string, string> = {
  "guide-only": "Listed by a guide, not by the reference",
  "deprecation-mismatch": "Deprecated on one API, not the other",
  "platform-only": "Platform constant with no Jetpack counterpart",
  "sample-mismatch": "Guide sample names a member the reference lacks",
  "description-mismatch": "A description that reads like another constant's",
  "source-only": "In the source, not on the reference",
  "reference-only": "On the reference, not in the source",
  "value-mismatch": "Two sources print different values",
  "new-in-source": "New since an earlier read",
  "missing-in-source": "Gone since an earlier read",
  "changed-in-source": "Changed since an earlier read",
  "reference-mismatch": "Java and Kotlin references disagree",
  "visibility-mismatch": "Public on the reference, internal in the source",
  unmapped: "No platform counterpart in the library",
};
export const flagLabel = (kind: string) => FLAG_LABEL[kind] ?? kind;

export {
  WT_CROSSWALK,
  WT_FALLBACKS,
  WT_FLAGS,
  WT_GHAPI_FIELDS,
  WT_GOOGLE_HEALTH_API,
  WT_HC_SEGMENT_RULE,
  WT_HC_SEGMENT_TYPES,
  WT_HC_STRING_MAP,
  WT_HC_UNIVERSAL_SEGMENTS,
  WT_HEALTHKIT,
  WT_HEALTH_CONNECT,
  WT_INT_COMPARISON,
  WT_MAPPING_SEARCH,
  WT_NORMALISATION,
  WT_PLATFORMS,
  WT_SOURCES,
  WT_STATED_MAPPINGS,
  WT_WEAR_OS,
  WT_WEAR_OS_INTERNAL,
};
