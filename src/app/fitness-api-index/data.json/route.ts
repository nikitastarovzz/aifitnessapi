import { absoluteUrl, site } from "@/lib/site";
import { API_INDEX_PATH, indexDataDate, indexExport, indexInputDates } from "@/lib/ecosystemSignals";
import { WINDOW_DAYS } from "@/lib/ecosystemDerive";

/**
 * /fitness-api-index as JSON: the rows the page renders, as of the build.
 * Written once per build like every other static file here.
 */
export const dynamic = "force-static";

export function GET() {
  const asOf = new Date().toISOString().slice(0, 10);
  const body = {
    name: "Fitness API index",
    publisher: `${site.name} (${site.url})`,
    license: "CC BY 4.0",
    page: absoluteUrl(API_INDEX_PATH),
    as_of: asOf,
    window_days: WINDOW_DAYS,
    inputs_last_written: indexDataDate(),
    input_dates: indexInputDates(),
    methodology: `${absoluteUrl(API_INDEX_PATH)}#methodology`,
    score: null,
    note: "Raw signals only. No composite score is published; KinesteX funds this site and is not ranked. null = the repository holds no data for that cell, which is not zero.",
    items: indexExport(asOf),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
