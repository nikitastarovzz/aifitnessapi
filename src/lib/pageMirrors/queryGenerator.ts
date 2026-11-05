import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, type MirrorDoc } from "./core";

const PATH = "/tools/query-generator";
const UPDATED = "2026-09-04";

/** /tools/query-generator.md — mirrors src/app/tools/query-generator/page.tsx. */
export function queryGeneratorMirror(): MirrorDoc {
  const quantity = HK_IDENTIFIERS.filter((r) => r.family === "quantity");
  const unstated = quantity.filter((r) => r.aggregation === null);
  return {
    path: PATH,
    title: "HealthKit Query Generator",
    description:
      "Pick a HealthKit quantity type and a window; get the HKStatisticsQuery with the aggregation option Apple's own prose states — or an honest refusal.",
    updated: UPDATED,
    type: "tool",
    capsule: `Pick one HealthKit quantity type and a time window and this returns the HKStatisticsQuery for it, with the aggregation option taken from what Apple's own documentation says about that type: .cumulativeSum where Apple describes the values as cumulative, .discreteAverage where it describes them as discrete. For the ${unstated.length} quantity types Apple never states it for, the tool refuses to generate anything, because the wrong option does not throw — it returns a plausible, wrong number. Category types get a refusal too: a category sample carries an enum case, not a value to aggregate.`,
    body: [
      `${quantity.length} quantity types, ${unstated.length} of them with no aggregation style stated · read from Apple’s documentation on ${HK_FETCHED_ON}`,
      "",
      interactiveNote(PATH, "the type and window picker"),
      "",
      "## Why the refusal is the feature",
      "",
      "Apple states whether a quantity type accumulates or is measured point-in-time inside the type’s discussion prose, not as a property you can read at compile time. The distinction decides which `HKStatisticsQuery` option is correct: cumulative types are summed with `.cumulativeSum`, discrete types are reduced with `.discreteAverage`, `.discreteMin` or `.discreteMax`.",
      "",
      `Pick the wrong one and nothing throws. You get a number, it renders in your UI, and it is wrong — a summed week of heart rate reads in the tens of thousands and looks like a bug in someone else’s code. That is why, for the ${unstated.length} quantity types Apple’s wording does not cover${unstated.length > 0 ? ` — ${unstated.map((r) => r.case).join(", ")} — ` : " "}this tool emits nothing at all. A generator that guesses is worse than no generator.`,
      "",
      `- ${link("What Apple leaves undocumented", "/healthkit-status")} — the beta, undocumented and deprecated edges of the catalog.`,
      `- ${link("Every HealthKit category value enum", "/healthkit-category-values")} — what to read instead when the type is a category type.`,
      `- ${link("HealthKit unit families", "/healthkit-units")} — which \`HKUnit\` a type will actually accept.`,
      `- ${link("How to integrate Apple HealthKit", "/integrate/healthkit")} — the guide this query shape comes from, including authorization.`,
      "",
      "## Where this output comes from, and where it runs",
      "",
      "Everything on this page runs client-side. Your selection never leaves the browser: there is no request to a server, nothing is stored, and no health data is involved — you are picking a type *name*, not data.",
      "",
      `The identifiers, their aggregation style and their unit family are parsed from Apple’s developer documentation on ${HK_FETCHED_ON} and published in full at ${link("every HealthKit type identifier", "/healthkit-identifiers")}. Aggregation and unit family are the only derived fields in that dataset, and the Apple sentence each was derived from is stored beside it — which is the sentence this tool quotes back at you under the verdict.`,
      "",
      `The query shape is the one published in the ${link("HealthKit integration guide", "/integrate/healthkit")}. \`HKQuantityType(.case)\` is the iOS 16+ initializer; on older targets build the same type with \`HKObjectType.quantityType(forIdentifier:)\`. \`HKUnit.count()\` is the only unit constructor this site has verified, so it is emitted only for count-family types and every other family gets a comment naming the family instead of a guessed constructor. Date arithmetic beyond \`Calendar.current.startOfDay(for:)\` is left to you for the same reason — and because ${link("where a day starts", "/day-boundaries")} is a decision, not a default. Verify every signature against Apple’s current documentation before you ship.`,
      "",
      `A free tool from ${site.name}. Data read from Apple’s published documentation on ${HK_FETCHED_ON}; the machine-readable export is on ${link("datasets", "/datasets")}.`,
      "",
      ...moreToolsSection(PATH),
    ],
  };
}
