/**
 * The one list of this site's interactive tools.
 *
 * It lives here rather than inside `/tools/page.tsx` because two surfaces need
 * it now: the hub, which groups it into lookups and planners, and the
 * sibling-nav block at the foot of each tool page. A second copy of these
 * names and blurbs would drift — one of them would gain a tool and the other
 * would keep describing nine.
 *
 * The blurbs are the sentences the site search index uses for these tools, so
 * a tool reads identically wherever it is mentioned. Changing one here changes
 * it everywhere, which is the point.
 */
export type Tool = { path: string; name: string; blurb: string };

/** The lookups and generators built on the identifier and matrix datasets. */
export const TOOL_LOOKUPS: Tool[] = [
  {
    path: "/tools/error-diagnoser",
    name: "Which error is this?",
    blurb:
      "Paste an error string and get the matching HKError.Code case in Apple's wording, plus the guide that covers it.",
  },
  {
    path: "/tools/aggregation-checker",
    name: "Sum it or average it?",
    blurb:
      "Whether Apple describes a quantity type as cumulative or discrete, with the sentence that says so.",
  },
  {
    path: "/tools/identifier-translator",
    name: "Apple type, Android record",
    blurb:
      "Two-way lookup between HealthKit identifiers and Health Connect records — verified pairs only.",
  },
  {
    path: "/tools/permission-builder",
    name: "HealthKit permission builder",
    blurb:
      "Pick the types your app touches: the Info.plist keys, the toShare/toRead Swift, and the Health Connect record names.",
  },
  {
    path: "/tools/query-generator",
    name: "HealthKit query generator",
    blurb:
      "Pick a quantity type and a window; get the HKStatisticsQuery with the aggregation option Apple's own prose states.",
  },
  {
    path: "/tools/stack-generator",
    name: "Fitness app stack generator",
    blurb:
      "Answer four questions and get the HealthKit types and APIs that survive them, with the exclusions shown.",
  },
];

/** The planners and demos already published on the site. Blurbs match the
 *  descriptions used in the site search index. */
export const TOOL_PLANNERS: Tool[] = [
  {
    path: "/picker",
    name: "Which fitness API should I use?",
    blurb: "Three questions, a tailored recommendation.",
  },
  {
    path: "/cost-planner",
    name: "Fitness API cost planner",
    blurb:
      "The cost structure of your stack: billing models, user-side costs, approval gates, eng effort.",
  },
  {
    path: "/compare-apis",
    name: "Compare two fitness APIs side by side",
    blurb:
      "Access structure, user-side cost and approval gates for any two products in the directory.",
  },
  {
    path: "/day-boundaries",
    name: "Why “today’s steps” is a bug",
    blurb:
      "Interactive: DST days aren't 24 hours, so a fixed UTC window drops or double-counts an hour.",
  },
];

export const ALL_TOOLS: Tool[] = [...TOOL_LOOKUPS, ...TOOL_PLANNERS];

/**
 * The other lookups, for the sibling nav on a tool page.
 *
 * Lookups only. A tool page listing all nine siblings would be a longer block
 * than the tool itself, and the planners are reached from the hub line below
 * it — a reader who landed on the error diagnoser from a search is looking for
 * another lookup, not a cost model.
 */
export function otherLookups(path: string): Tool[] {
  return TOOL_LOOKUPS.filter((t) => t.path !== path);
}
