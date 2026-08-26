import { statBadge, badgeResponse } from "@/lib/statBadge";
import { HK_IDENTIFIERS } from "@/data/healthkitIdentifiers";

/** Live count of HealthKit identifiers this site tracks. */
export const dynamic = "force-static";

export function GET(): Response {
  return badgeResponse(statBadge("HealthKit types", String(HK_IDENTIFIERS.length)));
}
