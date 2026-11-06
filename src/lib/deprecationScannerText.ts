/**
 * The sentences /tools/deprecation-scanner shares with its markdown mirror,
 * the search index, /llms-index.txt and /llms-full.txt (ops/VIRAL-20-2026-11-06.md
 * items 14 and 15). Every count and date is read from the generated rule
 * bundle, so the page cannot say one number and the Action run another.
 */
import bundleJson from "@/data/deprecationRules.json";

export type DsReplacement = { label: string; href?: string };
export type DsBasis = { url: string; publisher: string; quote: string; literal: string; checkedOn: string; via: string; capturedOn?: string };
export type DsRule = {
  id: string;
  entry: string;
  kind: string;
  label: string;
  patterns: { re: string; flags?: string }[];
  contexts?: string[];
  requiresFile?: string;
  fallback?: boolean;
  specificity: number;
  replacement: DsReplacement[];
  replacementNote: string | null;
  replacementQuotes: { url: string; quote: string }[];
  basis: DsBasis[];
  more?: { href: string; label: string };
  endpoints?: { title: string; method: string | null; status: string; notice?: string | null }[];
  example: string;
};
export type DsEntry = {
  id: string;
  name: string;
  vendor: string;
  kind: string;
  status: "dead" | "dying" | "deprecated";
  statusLabel: string;
  end: string | null;
  endText: string;
  endLast: string | null;
  endLabel: string;
  quote: string;
  url: string;
  publisher: string;
  checkedOn: string;
  replacedBy: DsReplacement[];
  graveyard: string;
  migrate: { href: string; label: string } | null;
};
export type DsBundle = {
  generatedBy: string;
  site: string;
  updated: string;
  inputs: Record<string, string>;
  counts: { rules: number; fitbitEndpointRules: number; fitbitEndpoints: number; entries: number };
  entries: Record<string, DsEntry>;
  rules: DsRule[];
  notScanned: { entry: string; name: string; reason: string }[];
};

export const DS_BUNDLE = bundleJson as DsBundle;
export const DS_PATH = "/tools/deprecation-scanner";
export const DS_ACTION_DIR = "actions/fitness-api-deprecation-check";
export const DS_ACTION_USES = "nikitastarovzz/aifitnessapi/actions/fitness-api-deprecation-check@main";
export const DS_REPO_URL = "https://github.com/nikitastarovzz/aifitnessapi";
export const DS_ACTION_URL = `${DS_REPO_URL}/tree/main/${DS_ACTION_DIR}`;
export const DS_TITLE = "Fitbit & Google Fit Deprecation Scanner";
export const DS_H1 = "Fitness API deprecation scanner: find Fitbit Web API, Google Fit and other dead calls";
export const DS_DESCRIPTION =
  "Paste code or a manifest and find Fitbit Web API, Google Fit and other retired fitness API calls, each with its replacement. Runs in your browser.";
export const DS_PRIMARY_QUERY = "find deprecated fitbit web api calls in my code";
export const DS_UPDATED = DS_BUNDLE.updated;

const fitbit = DS_BUNDLE.entries["fitbit-web-api"];
const fit = DS_BUNDLE.entries["google-fit-apis"];

/** Graveyard entries the scanner has at least one rule for, in graveyard order. */
export function dsScannedEntries(): DsEntry[] {
  const ids = new Set(DS_BUNDLE.rules.map((r) => r.entry));
  return Object.values(DS_BUNDLE.entries).filter((e) => ids.has(e.id));
}

export function dsCapsule(): string {
  const others = dsScannedEntries().filter((e) => !["fitbit-web-api", "google-fit-apis", "google-fit-goals-api", "google-fit-sensors-ble-apis"].includes(e.id));
  return `Paste code, a package.json, build.gradle, Podfile or requirements.txt, or a list of URLs, and this scanner finds references to fitness APIs and SDKs their vendors have shut down, scheduled to shut down or deprecated: all ${DS_BUNDLE.counts.fitbitEndpoints} Fitbit Web API endpoints (${fitbit.endLabel.toLowerCase()} ${fitbit.endText}, per Google), the Google Fit REST and Android APIs (${fit.endLabel.toLowerCase()} ${fit.endText}), and ${others.length} more from this site's Fitness API Graveyard, ${DS_BUNDLE.counts.rules} patterns in all. Each hit shows the line, what happened in the vendor's own words at the precision the vendor gave, and the replacement the vendor or Google's migration tables name, with the migration guide. The scan runs in your browser; nothing is uploaded. The same rules run in CI as a GitHub Action.`;
}

/** "How a hit is decided", shared word for word by the page and its mirror. */
export const DS_HOW: { title: string; text: string }[] = [
  {
    title: "Only strings a vendor prints.",
    text: "Every pattern is a written form of something on a vendor page (a path in Fitbit's request tables, a host or a Gradle coordinate in Google's Fit docs, a package name on its registry page), and “Why this pattern” under each hit quotes that page. An API the site has not sourced is not guessed at.",
  },
  {
    title: "Most specific wins.",
    text: "A Fitbit URL is matched against every endpoint path, placeholders and all ({date}, ${id}, %s), and the longest fixed text wins. The bare host, or a /1/user/ path in a file that names Fitbit, reports only when no endpoint matched the line, which is how a URL built by string concatenation is still found.",
  },
  {
    title: "Packages by registry.",
    text: "npm names match in code and package.json; PyPI names only on a line of a Python manifest (requirements.txt, pyproject.toml, Pipfile), since a Python import name need not be the package name.",
  },
  {
    title: "Severity from the vendor's date.",
    text: "Red (an error in CI) when the vendor says it is gone, or it is dying and the date given has passed; a year counts as passed only after December 31. Amber (a warning) for deprecated, or dying with the date ahead.",
  },
  {
    title: "The replacement is the vendor's.",
    text: "For Fitbit endpoints, the Google Health API data type and method from Google's migration tables, the same rows as the Fitbit to Google Health API map; where the tables have no row, the hit says so.",
  },
];

/** The workflow a reader copies. */
export function dsActionYaml(): string {
  return [
    "name: Fitness API deprecation check",
    "on: [pull_request]",
    "jobs:",
    "  scan:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@v4",
    `      - uses: ${DS_ACTION_USES}`,
    "        with:",
    "          path: .",
    "          fail-on: error # or: warning, never",
    "",
  ].join("\n");
}

/** One line on the Action, for the mirror and llms surfaces. */
export function dsActionText(): string {
  return `GitHub Action: uses: ${DS_ACTION_USES} (inputs path, exclude, fail-on = error | warning | never; outputs hits, errors, warnings). It writes an annotation on each line and a job summary table, with no dependencies and nothing sent anywhere. "error" means the vendor says the API is gone, or it is dying and the date the vendor gave has passed; "warning" means deprecated, or dying with the date still ahead. A line containing fitness-api-deprecation-ignore is skipped.`;
}
