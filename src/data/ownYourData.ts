import { ownYourDataEntries } from "./ownYourData.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";
import { site } from "@/lib/site";

/**
 * Cluster — getting your OWN data out of a phone, wearable or fitness app.
 *
 * WHY THIS CLUSTER EXISTS. Search Console shows a self-tracker audience
 * (garth, python-garminconnect, "garmin personal api": impressions, no
 * clicks) that the developer-facing pages answer only sideways: they explain
 * how an app reads other people's data, not how a person downloads their
 * own. ops/AUDIENCE-30-2026-11-05.md items 11-13.
 *
 * BOUNDARY RULES, because neighbors answer adjacent questions:
 * - /integrate/<vendor> owns "how do I integrate the X API". Pages here
 *   name a vendor's personal-use API route only as far as its own docs say,
 *   then link the integration guide.
 * - /fix/garmin-api-personal-use and /fix/oura-personal-access-token-deprecated
 *   own those two questions; the Garmin and Oura pages link them.
 * - /libraries owns the Python packages; pages here render the registry
 *   facts from src/data/libraries.ts and never retype a version.
 *
 * EVIDENCE RULES (ops/GEO.md, CLAUDE.md):
 * - Every step comes from the vendor's own help center or developer page,
 *   fetched 2026-11-05: directly where the host was reachable (Apple, Google),
 *   otherwise through .github/workflows/source-snapshot.yml, with the quoted
 *   passages in ops/sources/evidence/own-your-data-<slug>.json.
 * - Where the vendor's page could not be read (Garmin's account export,
 *   WHOOP's and Withings's export articles), the page says "could not
 *   verify" and gives no steps. Those two vendors have no page here yet:
 *   a page whose main answer is "could not verify" would be thin.
 * - No file layouts, column names or turnaround times beyond what the
 *   vendor states.
 */
export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const OWN_DATA_PATH = "/own-your-data";
export const OWN_DATA_CONFIG: ClusterConfig = {
  basePath: OWN_DATA_PATH,
  hubLabel: "Own Your Data",
};

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_OWN_DATA = new Set<string>([
  "apple-health-export",
  "health-connect-export",
  "samsung-health-export",
  "garmin-connect-export",
  "fitbit-google-health-export",
  "oura-export",
  "polar-flow-export",
  "strava-export",
  "suunto-export",
  "coros-export",
]);

export const allOwnYourData: ClusterEntry[] = ownYourDataEntries;

export function releasedOwnYourData(): ClusterEntry[] {
  return allOwnYourData.filter((e) => RELEASED_OWN_DATA.has(e.slug));
}

export function getOwnYourData(slug: string): ClusterEntry | undefined {
  return releasedOwnYourData().find((e) => e.slug === slug);
}

/**
 * The analysis notebooks (public/notebooks/*.ipynb), run against the
 * synthetic samples by scripts/build-notebooks.py so their outputs are real.
 * Colab and GitHub links are built from the repository URL in site.ts.
 */
export type Notebook = { file: string; title: string; reads: string; does: string };
export const NOTEBOOKS: Notebook[] = [
  {
    file: "apple-health-export.ipynb",
    title: "Apple Health export.zip to pandas",
    reads: "export.zip or export.xml from the iPhone Health app",
    does: "streams the Record elements into a DataFrame, counts every type, and charts daily steps, resting heart rate and nightly sleep",
  },
  {
    file: "wearable-daily-summary.ipynb",
    title: "A daily-summary CSV: trends and a weekly view",
    reads: "a one-row-per-day CSV (steps, sleep, resting heart rate, weight)",
    does: "parses dates, adds 7-day rolling means, compares sleep with next-morning resting heart rate, and resamples by week",
  },
  {
    file: "activities-log.ipynb",
    title: "An activity-list CSV: weekly training volume",
    reads: "a one-row-per-workout CSV (start time, type, duration, distance, heart rate)",
    does: "sums minutes and distance per week and activity type, and charts the stacked weekly volume",
  },
];

const REPO = site.social.github.replace(/\/$/, "");
const REPO_PATH = REPO.replace(/^https:\/\/github\.com\//, "");
export const notebookGithubUrl = (n: Notebook) => `${REPO}/blob/main/public/notebooks/${n.file}`;
export const notebookColabUrl = (n: Notebook) => `https://colab.research.google.com/github/${REPO_PATH}/blob/main/public/notebooks/${n.file}`;
export const notebookRawPath = (n: Notebook) => `/notebooks/${n.file}`;
