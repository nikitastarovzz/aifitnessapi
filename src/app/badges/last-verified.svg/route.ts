import { statBadge, badgeResponse } from "@/lib/statBadge";
import { HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { changesSorted } from "@/data/changes";

/**
 * The most recent date anything on this site was checked against a source.
 *
 * Deliberately the MAXIMUM across the verification dates rather than today:
 * a badge that always reads "today" says nothing, and would claim a freshness
 * the data does not have.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const dates = [HK_FETCHED_ON, ...changesSorted().map((c) => c.verifiedOn)].filter(Boolean).sort();
  return badgeResponse(statBadge("last verified", dates.at(-1) ?? "unknown"));
}
