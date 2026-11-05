import { site, absoluteUrl } from "@/lib/site";
import { changesSorted, WATCH_ITEMS } from "@/data/changes";
import { buildCalendar } from "@/lib/stackFeeds.mjs";

/**
 * A subscribable calendar of the dated ecosystem events (/changes/calendar.ics).
 *
 * The tracker already answers "what is changing"; this answers "remind me".
 * A developer subscribes once in Google or Apple Calendar and every deadline
 * we verify afterwards arrives in the place they already look, which is the
 * one distribution channel a static site otherwise has no way to reach.
 *
 * HONESTY RULE (this file inherits src/data/changes.ts):
 * `date` precision varies — "2026-09" means a reported month, not a day. ICS
 * has no way to express "sometime in September", so every event is PLACED at
 * `sortDate` (already the designated sort key) but is NAMED and DESCRIBED
 * with its stated precision. A fuzzy event is prefixed so the calendar entry
 * itself carries the hedge:
 *
 *     [reported month] Fitbit Web API turndown — stated as 2026-09
 *
 * That way a consumer who only ever sees the calendar entry — never the
 * page — still inherits the grading. We never sharpen a date into a
 * commitment the source did not make.
 *
 * The formatting (escaping, folding, VEVENT shape) lives in
 * src/lib/stackFeeds.mjs, which /my-stack also runs in the browser to build a
 * reader's own calendar, so the two cannot format an entry differently.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const body = buildCalendar({
    events: changesSorted(),
    absolute: absoluteUrl,
    name: `${site.name} — API deadlines`,
    description: `Dated fitness-API ecosystem changes: deprecations, turndowns and term changes. Events marked [reported month] have no confirmed day. ${WATCH_ITEMS.length} undated risks are tracked on the site but are deliberately not in this calendar — they have no date to place.`,
    caldesc: "Fitness API deprecations, turndowns and deadlines. Graded confirmed vs reported.",
    fallbackDay: new Date().toISOString().slice(0, 10),
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="aifitnessapi-deadlines.ics"',
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
