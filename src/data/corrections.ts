/**
 * The corrections log. Only entries that were PUBLISHED wrong belong in
 * CORRECTIONS — a mistake caught by a gate before deploy is a different
 * thing, recorded in NEAR_MISSES so the distinction stays honest. Padding
 * this list with near-misses would inflate the site's error rate; hiding
 * them would inflate its accuracy. Both lists are real.
 */
export type Correction = {
  date: string; // when corrected
  page: { href: string; label: string };
  was: string;
  now: string;
  how: string;
};

export const CORRECTIONS: Correction[] = [
  {
    date: "2026-09-01",
    page: { href: "/blog/react-native-health-stale", label: "Your HealthKit Bridge Last Shipped in 2024" },
    was: "The post stated the SDK release tracker's read date as 2026-08-31.",
    now: "The tracker re-ran on a schedule between writing and publish, moving its read date to 2026-09-01; the post now matches. No release fact changed.",
    how: "Caught while reconciling a push conflict against the CI commit that refreshed the tracker.",
  },
  {
    date: "2026-08-30",
    page: { href: "/healthkit-identifiers", label: "Every HealthKit Type Identifier" },
    was: "Ten published citation anchors pointed at row ids the table never rendered, so deep links landed at the top of the page.",
    now: "Every row renders its id; a build gate now fails if any published anchor stops resolving.",
    how: "Found by the FACTS-DEAD-ANCHOR gate when it was written — the defect predated the gate.",
  },
];

export type NearMiss = {
  date: string;
  what: string;
  caught: string;
};

export const NEAR_MISSES: NearMiss[] = [
  {
    date: "2026-08-28",
    what: "The first heuristic for matching a category type to its value enum resolved 29 of 30 and was wrong — a cross-linked symbol on the pregnancy page would have shipped the wrong enum.",
    caught: "Spot-checking the one type whose result looked too convenient, before publish. The shipped rule leaves 2 honest nulls instead.",
  },
  {
    date: "2026-08-28",
    what: "The unit regex excluded '/', so compound units like count/time resolved to nothing and heart rate would have rendered with no unit.",
    caught: "Reading the rendered table before publish; the widened rule takes resolved units to 116 of 120.",
  },
  {
    date: "2026-09-01",
    what: "An internal note claimed an intermediate enum-matching attempt resolved 17 of 30. A re-run could not reproduce 17 under four definitions of an exact match.",
    caught: "The writer assigned to cite it refused to, re-ran the heuristics, and the number was withdrawn before publish.",
  },
  {
    date: "2026-08-28",
    what: "Adding a second dataset to the same file inflated a row counter, which would have published an identifier count of 257 instead of 240.",
    caught: "The build's own row-count assertion failed the build.",
  },
];
