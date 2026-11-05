import { MACHINE_CACHE_CONTROL } from "@/lib/machineHeaders";
import { bundle } from "@/lib/webhooksPage";

/**
 * /webhooks/schemas.json — every documented webhook payload's JSON Schema in
 * one draft 2020-12 bundle ($defs, each with an $anchor), built at deploy time
 * from src/data/webhookPayloads.ts by src/lib/webhookSchemas.ts.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(bundle(), null, 2) + "\n", {
    headers: { "Content-Type": "application/schema+json; charset=utf-8", "Cache-Control": MACHINE_CACHE_CONTROL },
  });
}
