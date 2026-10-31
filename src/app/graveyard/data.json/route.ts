import { absoluteUrl, site } from "@/lib/site";
import { GRAVEYARD_PATH, graveyardCheckedOn, graveyardSorted } from "@/data/graveyard";

/**
 * /graveyard as JSON: every entry the page renders, written once per build.
 * `as_of` is the build date; qa's GRAVEYARD-DYING reads it to hold every
 * "dying" entry to an end date still ahead of the build.
 */
export const dynamic = "force-static";

export function GET() {
  const body = {
    name: "The Fitness API Graveyard",
    publisher: `${site.name} (${site.url})`,
    page: absoluteUrl(GRAVEYARD_PATH),
    as_of: new Date().toISOString().slice(0, 10),
    sources_last_read: graveyardCheckedOn(),
    license_note:
      "Our fields are free to reuse with a link to the page. Each `source.quote` is the publisher's own text, quoted to attribute the date.",
    status_meaning: {
      dead: "The vendor says it was removed, turned off or can no longer be used.",
      dying: "The vendor names a future end date.",
      deprecated: "The vendor says deprecated or unsupported but names no end, or it keeps running as-is.",
    },
    date_precision:
      "`end` keeps the source's precision: YYYY-MM-DD, YYYY-MM or YYYY. null means the vendor gives no date.",
    items: graveyardSorted().map((e) => ({ ...e, url: `${absoluteUrl(GRAVEYARD_PATH)}#${e.id}` })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
