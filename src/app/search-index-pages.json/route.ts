import { GET as fullIndex } from "../search-index.json/route";
import { MACHINE_CACHE_CONTROL } from "@/lib/machineHeaders";

/**
 * The search index without its FAQ answers: one record per page, about a
 * third of the full file (83 KB against 262 KB gzipped on 2026-11-12).
 *
 * The Doherty threshold (Doherty and Thadani, IBM Systems Journal, 1982):
 * a reply inside about 400 ms keeps a person in the flow of the task. The
 * palette used to wait for the whole 1 MB index before it could answer
 * anything, which on a throttled phone put the first result 1.35 s after
 * the last keystroke. It now loads this file first, answers from page titles
 * as soon as it lands, and swaps in the full index (FAQ answers included)
 * when that arrives. Same records, same order, same scorer: a query that
 * matches a page title ranks it the same way in both.
 *
 * Built from the full index's own output rather than a second list, so the
 * two files cannot drift apart.
 */
export const dynamic = "force-static";

type Rec = [string, string, string, string] | [string, string, string, string, string];

export async function GET() {
  const all = (await fullIndex().json()) as Rec[];
  const pages = all.filter((r) => r[4] !== "faq");
  return Response.json(pages, {
    headers: { "cache-control": MACHINE_CACHE_CONTROL },
  });
}
