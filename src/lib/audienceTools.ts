import {
  ET_DATABASES,
  ET_EXERCISE_COUNT,
  ET_EXERCISE_MATCHES,
  ET_FETCHED_ON,
  ET_TERMS,
  type EtFacet,
} from "@/data/exerciseTaxonomy";
import { GYM_API_MATRIX } from "@/data/gymApiMatrix";
import { RESEARCH_PLATFORM_MATRIX } from "@/data/researchPlatformMatrix";
import { columnCounts, type EvidenceMatrix } from "@/lib/evidenceMatrix";
import { constantId, platformPath } from "@/data/workoutTypePages";

/**
 * What the three AUDIENCE-30 wave-3 tools say about their data
 * (ops/AUDIENCE-30-2026-11-05.md items 27-29), shared by each page, its
 * markdown mirror and the llms files so all of them print the same counts.
 */

/* ── /tools/exercise-taxonomy-crosswalk ─────────────────────────────────── */

export const TAXONOMY_PATH = "/tools/exercise-taxonomy-crosswalk";
export const TAXONOMY_DATASET = "exercise-taxonomy-crosswalk-2026";
export const TAXONOMY_H1 = "Exercise taxonomy crosswalk: exercise databases to HealthKit and Health Connect";
export const TAXONOMY_TITLE = "Exercise Database to HealthKit Type Crosswalk";
export const TAXONOMY_DESCRIPTION =
  "ExerciseDB, wger and free-exercise-db categories, equipment and muscles set against HealthKit and Health Connect workout types, by name only. JSON and CSV.";
export const TAXONOMY_PRIMARY_QUERY = "map exercisedb categories to healthkit workout types";

export const FACET_LABEL: Record<EtFacet, string> = {
  category: "Category",
  equipment: "Equipment",
  muscle: "Muscle",
  "body-part": "Body part",
};

export const dbName = (id: string) => ET_DATABASES.find((d) => d.id === id)?.name ?? id;

export function taxonomyCounts() {
  const mapped = ET_TERMS.filter((t) => t.status === "mapped");
  const categories = ET_TERMS.filter((t) => t.facet === "category");
  return { terms: ET_TERMS.length, mapped, categories, exercises: ET_EXERCISE_MATCHES.length, exercisesRead: ET_EXERCISE_COUNT };
}

export function taxonomyCapsule(): string {
  const c = taxonomyCounts();
  const mappedText = c.mapped.map((t) => `${dbName(t.database)}'s "${t.term}"`).join(", ");
  return (
    `Almost none of it maps. Of the ${c.terms} category, equipment, muscle and body-part terms that free-exercise-db, wger and ExerciseDB v1 publish (read ${ET_FETCHED_ON}), ` +
    `only ${c.mapped.length === 1 ? "one" : c.mapped.length} has the same name as a HealthKit or Health Connect workout type: ${mappedText}. ` +
    `Their categories are body regions and training styles (Arms, Legs, strength, plyometrics), while HealthKit and Health Connect name activities, so a name-only crosswalk leaves "strength" unmapped rather than guessing STRENGTH_TRAINING. ` +
    `Exercise names do slightly better: ${c.exercises} of free-exercise-db's ${c.exercisesRead} match a Health Connect exercise or segment type exactly. CC BY 4.0, JSON and CSV.`
  );
}

export type TaxonomyLink = { label: string; href: string; name: string };

/** A constant's row on this site's workout-types reference. */
export function constantLinks(m: { healthkit: string[]; healthConnect: string[]; hcSegment: string[] }): TaxonomyLink[] {
  return [
    ...m.healthkit.map((n) => ({ label: "HealthKit", name: n, href: `${platformPath("healthkit")}#${constantId(n)}` })),
    ...m.healthConnect.map((n) => ({ label: "Health Connect", name: n, href: `${platformPath("health-connect")}#${constantId(n)}` })),
    ...m.hcSegment.map((n) => ({ label: "Health Connect segment", name: n, href: `${platformPath("health-connect")}#segment-${n.toLowerCase()}` })),
  ];
}

export function taxonomyRows() {
  return ET_TERMS.map((t) => ({
    id: t.id,
    database: t.database,
    databaseName: dbName(t.database),
    facet: t.facet,
    facetLabel: FACET_LABEL[t.facet],
    term: t.term,
    alias: t.alias,
    status: t.status,
    reason: t.reason,
    exact: constantLinks({ healthkit: t.healthkit.exact, healthConnect: t.healthConnect.exact, hcSegment: t.hcSegment.exact }),
    contains: constantLinks({ healthkit: t.healthkit.nameContains, healthConnect: t.healthConnect.nameContains, hcSegment: t.hcSegment.nameContains }),
  }));
}

/** The "limits" list on the page and in its mirror. */
export function taxonomyLimits(): string[] {
  return [
    "Names are matched, not meanings. A category such as \"strength\" or \"cardio\" describes many activities, so it is left unmapped even where a constant's name contains it; those constants are listed under \"name contains it\" for browsing, and that column is a text coincidence, never a mapping.",
    "Equipment, muscle and body-part terms are never mapped, because they describe how or where an exercise works, not which activity a workout session records.",
    "wger's and ExerciseDB's exercise lists are not read, only their category, equipment, muscle and body-part lists; ExerciseDB v2, which its documentation says is accessed through RapidAPI, is not read either.",
    "wger and ExerciseDB v1 were read through this site's source-snapshot workflow, because their hosts are blocked from where the site is built; each term's quote is kept in ops/sources/evidence/tools-exercise-taxonomy-crosswalk.json and re-checked against the live API.",
    "The generator declares how many terms each list must have and refuses to write a shorter or longer one.",
  ];
}

export function taxonomyText(): string {
  return `${taxonomyCapsule()} Every term is listed with the reason it is unmapped and, for browsing only, the constants whose names contain it as whole words (labelled a text coincidence, not a mapping). Generated by scripts/fetch-exercise-taxonomy.mjs with declared row counts; dataset at /datasets/${TAXONOMY_DATASET}.json.`;
}

/* ── evidence matrices ─────────────────────────────────────────────────── */

const featureColumns = (m: EvidenceMatrix) => m.columns.filter((c) => c.kind === "feature");
const yesCells = (m: EvidenceMatrix) => featureColumns(m).reduce((n, c) => n + columnCounts(m, c.id).yes, 0);

export const GYM_PATH = "/tools/gym-software-api-matrix";
export const GYM_H1 = "Gym software API matrix: auth, access, webhooks and coverage";
export const GYM_TITLE = "Gym Software API Matrix: Mindbody, Glofox & More";
export const GYM_DESCRIPTION =
  "Filter 11 gym and studio platforms by webhooks, sandbox, bookings, members, payments and check-ins. Every cell quotes its vendor source.";
export const GYM_PRIMARY_QUERY = "gym management software api comparison";

export function gymCapsule(): string {
  const m = GYM_API_MATRIX;
  const wh = m.rows.filter((r) => r.cells.webhooks.value === "yes").map((r) => r.name);
  const priced = m.rows.filter((r) => r.cells.pricing.value === "yes" && r.id !== "abc-partner").map((r) => r.name);
  return (
    `Of the ${m.rows.length} gym and studio platforms here, ${wh.length} document webhooks (${wh.join(", ")}), and ${priced.length} state an API price on the pages read: ${priced.join(" and ")}. ` +
    `Mindbody charges past 1,000 calls a day; TeamUp says there is no extra fee. Authentication ranges from a single x-api-key header (Wodify) to OAuth with PKCE (Mariana Tek). ` +
    `Each cell quotes the vendor passage behind it; "not stated" means the pages read do not say, not that the feature is missing. Every quote was re-found in its live source on ${m.checkedOn}.`
  );
}

export const RESEARCH_PATH = "/tools/research-platform-chooser";
export const RESEARCH_H1 = "Research wearable platform chooser: Fitabase, Labfront, Empatica, Ametris";
export const RESEARCH_TITLE = "Fitabase vs Labfront vs Empatica: Platform Chooser";
export const RESEARCH_DESCRIPTION =
  "Tick what your study needs (participants' own Fitbit or Garmin, beat-to-beat, ECG, EDA, CGM, raw motion, an API) and see which platforms document it.";
export const RESEARCH_PRIMARY_QUERY = "fitabase vs labfront";

export function researchCapsule(): string {
  const m = RESEARCH_PLATFORM_MATRIX;
  const consumer = m.rows.filter((r) => r.cells.consumer.value === "yes").map((r) => r.name);
  const fda = m.rows.filter((r) => r.cells.fda.value === "yes").map((r) => r.name);
  return (
    `Pick by device first. ${consumer.join(" and ")} collect from consumer wearables participants can already own (Fitabase from Fitbit and Garmin, Labfront from Garmin, plus Movesense and Dexcom devices); ` +
    `${fda.join(" and ")} supply their own research devices, with FDA 510(k)-cleared models. ` +
    `Of the four, only Labfront's pages state a free plan (up to 5 participants), and Fitabase documents moving its Fitbit exports to the Google Health API for the Fitbit Web API turn-off. ` +
    `Every answer quotes the vendor's own page, each re-found in its live source on ${m.checkedOn}; anything the pages do not state is shown as not stated.`
  );
}

export function matrixText(m: EvidenceMatrix): string {
  return `${m.rows.length} platforms × ${m.columns.length} columns, ${yesCells(m)} documented feature cells, each citing a verbatim quote from ${m.evidenceFile}.json (the evidence behind ${m.roundup.href}), every quote re-found in its live source by source-quotes.yml run ${m.checkRun} on ${m.checkedOn}. Filters run in the browser; "not stated" is never read as "no".`;
}

/** The "How this matrix is built" list, on the page and in its mirror. */
export function matrixMethodLines(m: EvidenceMatrix): string[] {
  return [
    `Every cell cites rows of ops/sources/evidence/${m.evidenceFile}.json, the evidence the roundup page was written from, and the page prints each row's verbatim quote under the cell. No fact here is new.`,
    `Every quote in that file was found again in its live source by the source-quotes workflow (run ${m.checkRun}) on ${m.checkedOn}.`,
    `"Not stated" means the vendor passages read do not say. It is not a "no": a cell says no only where a quoted passage does.`,
    "The order after you tick needs counts documented features only. It ranks documentation, not products, and nothing on this page is a recommendation.",
  ];
}

/* ── /atlas ────────────────────────────────────────────────────────────── */

export const ATLAS_PATH = "/atlas";
export const ATLAS_H1 = "The Fitness API Atlas: a printable poster";
export const ATLAS_TITLE = "Fitness API Atlas: Printable Poster (PDF, SVG)";
export const ATLAS_DESCRIPTION =
  "Every API in the directory by category, how each bills developers, and the dated shutdowns and deadlines, on one printable poster. SVG and PDF.";
