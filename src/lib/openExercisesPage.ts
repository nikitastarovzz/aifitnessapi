import fs from "node:fs";
import path from "node:path";
import { ABBREVIATIONS, MATCH_RULES } from "@/lib/exerciseNameMatch.mjs";

/**
 * What /tools/exercise-taxonomy-crosswalk#normalize says about the Open
 * Exercises dataset, shared by the page and its markdown mirror. Read from the
 * published file (public/datasets/open-exercises-2026.json, written by
 * scripts/build-datasets.mjs from src/data/openExercises.ts) rather than the
 * 1.2 MB module, so neither the page nor its mirror bundles the exercises; the
 * search box fetches the same file in the browser.
 */

export const OPEN_EXERCISES_DATASET = "open-exercises-2026";
export const NORMALIZER_H2 = "Normalize a gym-floor exercise name";
export const ABBREVIATIONS_H3 = "Abbreviations we expand";
export const MATCH_RULES_H3 = "How a name is matched";
export { ABBREVIATIONS, MATCH_RULES };

type Stats = { totalItems: number; commit: string; withCrosswalkType: number; withHealthkitType: number; byExerciseName: number; byCategory: number };

export function openExercisesStats(): Stats & { readOn: string } {
  const file = path.join(process.cwd(), "public", "datasets", `${OPEN_EXERCISES_DATASET}.json`);
  if (!fs.existsSync(file)) throw new Error(`public/datasets/${OPEN_EXERCISES_DATASET}.json is missing — run \`npm run datasets\` before building.`);
  const doc = JSON.parse(fs.readFileSync(file, "utf8")) as { stats: Stats; sourceReadOn: string };
  return { ...doc.stats, readOn: doc.sourceReadOn };
}

export function normalizerIntro(): string {
  const s = openExercisesStats();
  return (
    `Type a name the way people say it on the gym floor, such as DB incline press, RDL or lat pulldown wide, and get the closest of the ${s.totalItems} exercises in free-exercise-db, ` +
    `read at commit ${s.commit.slice(0, 7)} on ${s.readOn}, with their muscles, equipment and any HealthKit or Health Connect type the crosswalk above already matched ` +
    `(${s.withCrosswalkType} of them have one, ${s.withHealthkitType === 0 ? "and none has a HealthKit type" : `${s.withHealthkitType} of them a HealthKit type`}). free-exercise-db's license file says it is "released into the public domain" ` +
    'for anyone to use "for any purpose, commercial or non-commercial". The search runs in your browser on the downloaded file; what you type is not sent anywhere.'
  );
}
