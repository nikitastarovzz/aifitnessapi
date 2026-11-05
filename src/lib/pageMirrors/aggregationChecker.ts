import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, type MirrorDoc } from "./core";

const PATH = "/tools/aggregation-checker";

/** /tools/aggregation-checker.md — mirrors src/app/tools/aggregation-checker/page.tsx. */
export function aggregationCheckerMirror(): MirrorDoc {
  const rows = HK_IDENTIFIERS.filter((r) => r.family === "quantity" || r.family === "category");
  const quantity = rows.filter((r) => r.family === "quantity");
  const cumulative = quantity.filter((r) => r.aggregation === "cumulative").length;
  const discrete = quantity.filter((r) => r.aggregation === "discrete").length;
  const unstated = quantity.filter((r) => !r.aggregation).length;
  return {
    path: PATH,
    title: "Sum it or average it?",
    description:
      "Type a HealthKit identifier and see whether Apple describes it as cumulative or discrete, with the sentence that says so — and where Apple is silent.",
    updated: HK_FETCHED_ON,
    type: "tool",
    capsule: `Apple states whether a quantity type accumulates or is measured point-in-time in the type’s prose, not as a property you can read — so the wrong \`HKStatisticsQuery\` option returns a plausible, wrong number instead of an error. Type an identifier below and this returns the answer for it, with Apple’s own sentence as the evidence. Of the ${quantity.length} quantity types read from Apple’s documentation on ${HK_FETCHED_ON}, ${cumulative} are described as cumulative and ${discrete} as discrete; for ${unstated} Apple’s wording does not say and neither does this tool.`,
    body: [
      interactiveNote(PATH, "the identifier type-ahead"),
      "",
      "## Why the wrong choice stays silent",
      "",
      "Most products do not aggregate inside HealthKit. They read raw samples, write them into their own database and roll them up later in SQL or a worker, and from then on nothing in the table remembers which kind of quantity a row holds, so a `SUM()` runs happily over heart rates. Averaging a cumulative type gives the mean of whatever chunks the device chose to write, which changes between a phone and a watch. Summing a discrete type gives a number that grows with how many samples exist. Neither throws, and neither fails a test written against a fixture built on the same wrong assumption.",
      "",
      "The test that needs no lookup: should doubling the time window roughly double the number? Distance and energy do; a heart rate or a body weight does not. When the answer is not obvious, look the type up above, then store its aggregation style next to every value you write into your own schema, so the rollup code can refuse to sum something it should not. Where Apple states no style, do not build a rollup on an assumption. As of September 1, 2026 that meant three quantity types, appleSleepingBreathingDisturbances, estimatedWorkoutEffortScore and workoutEffortScore, and the October 2, 2026 read added heartRateVariabilityRMSSD. Show the samples you have, or probe the behavior yourself and write down what you found.",
      "",
      "## How this works",
      "",
      `Everything runs client-side from this site’s published dataset — no API call and no lookup service. The ${rows.length} rows behind the type-ahead were read from Apple’s documentation on ${HK_FETCHED_ON} by \`scripts/fetch-healthkit-identifiers.mjs\`.`,
      "",
      "Aggregation style and unit family are the only derived fields in that dataset: Apple states both in prose rather than as machine-readable properties, so the sentence each was derived from is stored beside it and shown here verbatim. Where Apple’s wording does not state a value, the field is null and this tool renders *not stated* rather than a guess. The read-only flag works the same way — it is set only where Apple explicitly says the samples cannot be saved, and its evidence sentence sits behind the chip.",
      "",
      `The whole dataset is downloadable as JSON and CSV — ${link("open datasets, CC BY 4.0", "/datasets")}.`,
      "",
      `A free tool from ${site.name}. The full table is ${link("every HealthKit type identifier", "/healthkit-identifiers")}; the enums that decode a category sample are at ${link("every HKCategoryValue enum", "/healthkit-category-values")}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(PATH),
    ],
  };
}
