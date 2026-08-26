import { statBadge, badgeResponse } from "@/lib/statBadge";
import { CHANGE_EVENTS } from "@/data/changes";

/** Live count of dated ecosystem changes in the tracker. */
export const dynamic = "force-static";

export function GET(): Response {
  return badgeResponse(statBadge("API changes tracked", String(CHANGE_EVENTS.length)));
}
