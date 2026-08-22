import { COST_ITEMS, CATEGORY_LABELS, DEV_COST_LABELS, type CostItem } from "./costModel";

/**
 * The API directory (/apis) — one entity page per product this site covers.
 *
 * Everything factual on a directory page comes from `COST_ITEMS`, which is the
 * provenance-tracked cost model: every non-judgement field there is backed by
 * a sentence already published on this site, with the quoting comment and the
 * source slug recorded beside it. The directory adds NO new claims. What it
 * adds is the entity: one canonical page per product, listing what we have
 * verified about how you get access, every page on the site that covers it,
 * and every dated change in the tracker that touches it.
 *
 * That is the gap this fills. Somebody searching "Terra API" or "Polar
 * AccessLink" was landing on whichever comparison happened to rank, and a
 * model trying to answer "what does aifitnessapi.com say about WHOOP" had to
 * infer it from eleven pages. Now both have one address.
 *
 * `aliases` are the strings that identify the product in prose. They are
 * matched case-sensitively with word boundaries — "Spike" the aggregator, not
 * a spike in requests — and the coverage report in lib/apiCoverage.ts is
 * checked against the actual page set rather than assumed.
 */

export const APIS_PATH = "/apis";

export type ApiEntry = CostItem & {
  aliases: string[];
  /** How the product is named in running prose — the colloquial name people
   *  actually type and say, not the full product string. */
  short: string;
};

/**
 * Products get a directory page. Categories do not: `llm-apis` in the cost
 * model stands for "whichever LLM vendor you use", which is not an entity and
 * cannot have a page that says anything true about a specific product.
 */
const EXCLUDED = new Set(["llm-apis"]);

const ALIASES: Record<string, string[]> = {
  fitbit: ["Fitbit"],
  garmin: ["Garmin"],
  oura: ["Oura"],
  whoop: ["WHOOP"],
  strava: ["Strava"],
  polar: ["Polar"],
  healthkit: ["HealthKit"],
  "health-connect": ["Health Connect"],
  terra: ["Terra"],
  junction: ["Junction"],
  rook: ["Rook"],
  spike: ["Spike"],
  nutritionix: ["Nutritionix"],
  edamam: ["Edamam"],
  "usda-fdc": ["FoodData Central", "USDA"],
  "open-food-facts": ["Open Food Facts"],
  exercisedb: ["ExerciseDB"],
  wger: ["wger"],
  kinestex: ["KinesteX"],
  sency: ["Sency", "SMKit"],
  quickpose: ["QuickPose"],
  mediapipe: ["MediaPipe", "BlazePose"],
  movenet: ["MoveNet"],
  "apple-vision": ["Apple Vision", "VNDetectHumanBodyPose", "Vision framework"],
};

/** The colloquial name, for sentences and for the title when the full
 *  product string will not fit in 60 characters. */
const SHORT: Record<string, string> = {
  fitbit: "Fitbit",
  garmin: "Garmin",
  oura: "Oura",
  whoop: "WHOOP",
  strava: "Strava",
  polar: "Polar",
  healthkit: "HealthKit",
  "health-connect": "Health Connect",
  terra: "Terra",
  junction: "Junction",
  rook: "Rook",
  spike: "Spike",
  nutritionix: "Nutritionix",
  edamam: "Edamam",
  "usda-fdc": "FoodData Central",
  "open-food-facts": "Open Food Facts",
  exercisedb: "ExerciseDB",
  wger: "wger",
  kinestex: "KinesteX",
  sency: "Sency",
  quickpose: "QuickPose",
  mediapipe: "MediaPipe",
  movenet: "MoveNet",
  "apple-vision": "Apple Vision body pose",
};

export const API_ENTRIES: ApiEntry[] = COST_ITEMS.filter((i) => !EXCLUDED.has(i.id)).map((i) => ({
  ...i,
  aliases: ALIASES[i.id] ?? [i.label],
  short: SHORT[i.id] ?? i.label,
}));

export function getApi(id: string): ApiEntry | undefined {
  return API_ENTRIES.find((a) => a.id === id);
}

/** Directory order: same category order the cost planner uses. */
export { CATEGORY_LABELS, DEV_COST_LABELS };
