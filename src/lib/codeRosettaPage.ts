import { UNIFIED_RECORDS } from "@/data/unifiedSchema";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { HK_IDENTIFIERS } from "@/data/healthkitIdentifiers";
import { HC_RECORDS } from "@/data/healthConnectRecords";
import { buildPairs, ROSETTA_READ_ON, type RosettaTable } from "@/lib/codeRosetta.mjs";

/**
 * The code-translation section of /tools/identifier-translator, shared by the
 * page and its markdown mirror (src/lib/pageMirrors/identifierTranslator.ts)
 * so the two state the same counts and the same prose.
 */

let cached: RosettaTable | null = null;

/** The pair table the client component runs on, built from the site's data. */
export function rosettaTable(): RosettaTable {
  cached ??= buildPairs({
    unifiedRecords: UNIFIED_RECORDS,
    matrixRows: MATRIX_ROWS,
    hkIdentifiers: HK_IDENTIFIERS,
    hcRecords: HC_RECORDS,
  });
  return cached;
}

export function rosettaCounts() {
  const t = rosettaTable();
  const pairs = t.pairs.filter((p) => p.status === "pair");
  const refused = t.pairs.filter((p) => p.status === "different-measure");
  return { pairs: pairs.length, refused, readOn: ROSETTA_READ_ON, pairList: pairs };
}

export const ROSETTA_HEADING = "Translate a query, Swift and Kotlin";

/** The section's paragraphs, as plain text (the page renders the same words). */
export function rosettaParagraphs(): string[] {
  const c = rosettaCounts();
  const refused = c.refused.map((p) => `${p.hk.case} and ${p.hc.className}`).join(", ");
  return [
    `Paste a HealthKit read in Swift (HKSampleQuery, HKStatisticsQuery, HKStatisticsCollectionQuery or HKAnchoredObjectQuery) and get the Health Connect call in Kotlin (readRecords, aggregate, aggregateGroupByDuration or aggregateGroupByPeriod, or a changes token), or paste the Kotlin and get the Swift. A small parser reads the query's type, statistics options, bucket size and date range and fills a template; it is not a language model, and it runs in this tab.`,
    `It writes code for ${c.pairs} one-to-one pairs: a HealthKit identifier and a Health Connect record in the same row of the verified matrix, where the row holds one of each or this site's unified schema maps the two with field-level evidence. ${refused ? `It refuses ${refused}, which the unified schema tags as different measures. ` : ""}For any other type the output is a comment saying there is no verified pair, with the matrix row where one exists.`,
    `Sum or average is never guessed. The statistics option comes from the aggregation Apple states for the identifier, quoted in the output, and the Health Connect metric is the one whose own description says total, average, minimum or maximum. A cumulative sum asked of a discrete type is flagged with Apple's sentence. Every API name the templates write was read from Apple's and Google's reference pages on ${c.readOn}, and the tool's source lists each page.`,
  ];
}
