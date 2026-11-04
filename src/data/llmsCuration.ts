import fs from "node:fs";
import path from "node:path";
import { allSpokes } from "@/lib/clusterRegistry";
import type { ClusterEntry } from "@/lib/cluster";
import { site } from "@/lib/site";

/**
 * Which pages the curated /llms.txt names first, chosen by Search Console
 * rather than by hand (ops/NEXT-10-2026-11-04.md item 4; ops/GEO.md).
 *
 * Input: data/gsc/latest.json, the `byPage` rows scripts/search-pull.mjs
 * writes (Google clicks and impressions per URL over the pull's range). It
 * is read when the site is built, so each pull re-ranks the list on the next
 * build with no edit here.
 *
 * The rule, in full:
 * 1. Rows are keyed by path; the apex and www hosts are merged (the www rows
 *    are the same page reached by an older address), clicks and impressions
 *    summed. Only cluster spokes qualify, because the list prints each page's
 *    own one-line answer and only spokes have one; hubs and tools have their
 *    own sections in /llms.txt.
 * 2. "Most visited": spokes with at least one click, by clicks, then
 *    impressions, then path; the first TOP_VISITED.
 * 3. "Integration and troubleshooting pages searchers reach": /integrate and
 *    /fix spokes not already in (2), by impressions, then clicks, then path;
 *    the first TOP_INTEGRATE_FIX with at least one impression. These are
 *    ranked by impressions because that is where they stand: /integrate drew
 *    2,999 Google impressions at 0.53% CTR over Oct 4–31 (the audit in
 *    ops/NEXT-10-2026-11-04.md), so impressions say what searchers ask for.
 *
 * A missing or unreadable file throws: the build must not quietly ship an
 * llms.txt whose "chosen by Search Console" list was chosen by nothing.
 */

export const SEARCH_CONSOLE_FILE = "data/gsc/latest.json";
export const TOP_VISITED = 15;
export const TOP_INTEGRATE_FIX = 10;
const INTEGRATE_FIX = ["/integrate", "/fix"];

type Row = { keys: string[]; clicks: number; impressions: number };
type Pull = { range?: { start: string; end: string }; byPage?: Row[] };

export type CuratedPage = { path: string; basePath: string; entry: ClusterEntry; clicks: number; impressions: number };

function readPull(): Pull {
  const file = path.join(process.cwd(), SEARCH_CONSOLE_FILE);
  if (!fs.existsSync(file)) throw new Error(`${SEARCH_CONSOLE_FILE} is missing: /llms.txt ranks its first section from it.`);
  const pull = JSON.parse(fs.readFileSync(file, "utf8")) as Pull;
  if (!Array.isArray(pull.byPage) || pull.byPage.length === 0) throw new Error(`${SEARCH_CONSOLE_FILE} has no byPage rows.`);
  return pull;
}

export function searchConsoleCuration(): {
  range: { start: string; end: string } | null;
  visited: CuratedPage[];
  integrateFix: CuratedPage[];
} {
  const pull = readPull();
  const host = new URL(site.url).hostname.replace(/^www\./, "");
  const totals = new Map<string, { clicks: number; impressions: number }>();
  for (const r of pull.byPage ?? []) {
    let u: URL;
    try {
      u = new URL(r.keys[0]);
    } catch {
      continue;
    }
    if (u.hostname.replace(/^www\./, "") !== host) continue;
    const p = u.pathname.replace(/\/$/, "") || "/";
    const t = totals.get(p) ?? { clicks: 0, impressions: 0 };
    t.clicks += r.clicks;
    t.impressions += r.impressions;
    totals.set(p, t);
  }
  const pages: CuratedPage[] = allSpokes().map(({ basePath, entry }) => {
    const p = `${basePath}/${entry.slug}`;
    const t = totals.get(p) ?? { clicks: 0, impressions: 0 };
    return { path: p, basePath, entry, ...t };
  });
  const visited = pages
    .filter((p) => p.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions || a.path.localeCompare(b.path))
    .slice(0, TOP_VISITED);
  const taken = new Set(visited.map((p) => p.path));
  const integrateFix = pages
    .filter((p) => INTEGRATE_FIX.includes(p.basePath) && !taken.has(p.path) && p.impressions > 0)
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks || a.path.localeCompare(b.path))
    .slice(0, TOP_INTEGRATE_FIX);
  return { range: pull.range ?? null, visited, integrateFix };
}
