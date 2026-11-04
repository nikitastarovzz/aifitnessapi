import { llmsFullText } from "@/lib/llmsFull";

/**
 * llms-full.txt — every section's capsules and FAQs in one file. Built by
 * src/lib/llmsFull.ts, which also serves each section on its own at
 * /llms-full/<section>.txt (ops/GEO.md, decision of 2026-11-04).
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullText(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
