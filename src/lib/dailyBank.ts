/**
 * The /daily puzzle bank, built at build time from the generated datasets.
 *
 * A thin wrapper: the selection rules live in ./dailyPuzzle (pure, tested by
 * scripts/daily-puzzle.test.mjs from the same modules). This file only wires
 * in the data and the one site-specific lookup the pure module cannot import
 * (which HealthKit identifiers have a page of their own).
 */
import { HK_ERROR_CODES, HC_ERROR_CONSTANTS, ERROR_CODES_FETCHED_ON } from "@/data/errorCodes";
import { GHAPI_ERRORS, GHAPI_SOURCES, GHAPI_FETCHED_ON } from "@/data/googleHealthApi";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { hkIdentifierPagePath } from "@/data/hkIdentifierPages";
import { POSE_SCHEMES, POSE_SOURCES, POSE_KEYPOINTS_FETCHED_ON } from "@/data/poseKeypoints";
import { LAUNCH_DATE, QUESTIONS_PER_DAY, buildDailyBank, type DailyBank } from "./dailyPuzzle";

export const DAILY_PATH = "/daily";

const GHA_ERRORS_URL = GHAPI_SOURCES.find((s) => s.key === "errors")?.url;
if (!GHA_ERRORS_URL) throw new Error("googleHealthApi.ts no longer lists its error catalog source");

let BANK: DailyBank | null = null;

export function dailyBank(): DailyBank {
  BANK ??= buildDailyBank({
    hkErrors: HK_ERROR_CODES,
    hcErrors: HC_ERROR_CONSTANTS,
    ghaErrors: GHAPI_ERRORS,
    ghaErrorsUrl: GHA_ERRORS_URL!,
    matrixRows: MATRIX_ROWS,
    hkIdentifiers: HK_IDENTIFIERS,
    hkPagePath: hkIdentifierPagePath,
    poseSchemes: POSE_SCHEMES,
    poseSources: POSE_SOURCES,
  });
  return BANK;
}

/** The read dates of the generated datasets the bank draws from. The matrix
 *  is hand-verified and records no date of its own, so it adds none. */
export const DAILY_SOURCE_DATES = {
  errorCodes: ERROR_CODES_FETCHED_ON,
  googleHealthApi: GHAPI_FETCHED_ON,
  healthkitIdentifiers: HK_FETCHED_ON,
  poseKeypoints: POSE_KEYPOINTS_FETCHED_ON,
};

/** The newest of those dates: what the page declares as dateModified. */
export function dailyDataDate(): string {
  return Object.values(DAILY_SOURCE_DATES).sort().at(-1)!;
}

/** The answer capsule, as one string so the page and llms-full.txt say the
 *  same thing. */
export const DAILY_CAPSULE =
  "Five questions a day, the same for everyone on a given UTC date, drawn only from data this site publishes: which platform's error reference uses a message (HealthKit, Health Connect or the Google Health API), which Health Connect record the verified matrix pairs with a HealthKit identifier, whether Apple describes a quantity type as cumulative or discrete, and which keypoint sits at an index in a pose model's scheme. Every answer comes with the source sentence it rests on and a link to the page that holds it, and the result copies as a grid that spoils nothing.";

export const DAILY_PRIMARY_QUERY = "daily healthkit health connect developer puzzle";

export function dailyFaqs(): { q: string; a: string }[] {
  return [
    {
      q: "Is the daily puzzle the same for everyone?",
      a: `Yes, for everyone on the same UTC calendar date. The browser picks the ${QUESTIONS_PER_DAY} questions with a random-number generator seeded by the date, from a question bank built at deploy time, so there is no server and no account. Puzzle #1 was ${LAUNCH_DATE}; a new one starts at 00:00 UTC.`,
    },
    {
      q: "Where do the daily puzzle's answers come from?",
      a: "Only from datasets this site already publishes: error messages from Apple's HKError.Code reference, Google's HealthConnectException reference and the Google Health API v4 error catalog; HealthKit to Health Connect pairs from the verified type matrix; cumulative or discrete from the sentence in Apple's documentation that states it; keypoint indices from each pose model's own source file. Every answer shows that sentence and links the page that holds the row.",
    },
    {
      q: "Why are some HealthKit types and error codes never asked?",
      a: "A question is only asked where the dataset holds its answer. HealthKit error cases Apple ships with no description, quantity types whose aggregation style Apple's wording does not state, Apple Vision joints (which have no numeric index) and error messages that name their own platform are left out rather than guessed.",
    },
    {
      q: "Does the daily puzzle store my answers or track my streak on a server?",
      a: "No. Your picks and streak are kept in your own browser's localStorage and nowhere else; clearing site data or using a private window resets them. The share text carries only the puzzle number and a green or red square per question, never an answer.",
    },
  ];
}
