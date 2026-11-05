import { absoluteUrl } from "@/lib/site";
import { answersBody, answersJson } from "@/lib/answersIndex";
import { MACHINE_CACHE_CONTROL } from "@/lib/machineHeaders";

/**
 * /answers.json — every question this site owns, in one document. Built by
 * src/lib/answersIndex.ts, which also serves the same records per section at
 * /answers/<section>.json with a listing at /answers/index.json. This file
 * stays whole (ops/GEO.md, decision of 2026-11-04).
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(answersJson(answersBody()), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": MACHINE_CACHE_CONTROL,
      link: `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}
