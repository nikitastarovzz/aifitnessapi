import { llmsIndexText } from "@/lib/llmsIndex";
import { MACHINE_CACHE_CONTROL } from "@/lib/machineHeaders";

/**
 * /llms-index.txt — every page, each with its "best cited for" query and
 * capsule: what /llms.txt held until 2026-11-04, moved here whole when
 * /llms.txt became the curated map (ops/GEO.md). Built by src/lib/llmsIndex.ts.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsIndexText(), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": MACHINE_CACHE_CONTROL },
  });
}
