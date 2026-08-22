import { API_ENTRIES, type ApiEntry } from "@/data/apis";
import { allSpokes, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { CHANGE_EVENTS, type ChangeEvent } from "@/data/changes";

/**
 * What this site actually says about a given product, computed rather than
 * curated: which pages cover it, and which tracked changes touch it.
 *
 * Matching is case-sensitive with word boundaries. Product names are proper
 * nouns and the false positives from case-insensitive matching are exactly
 * the words that would embarrass us — "spike in requests" is not the Spike
 * aggregator, "polar coordinates" is not Polar. A page qualifies only when
 * the product is in its title or query, or it is mentioned in the body more
 * than once in passing; a single incidental mention in a list is not
 * coverage, and pretending otherwise would build a directory of thin
 * promises.
 */

export type Coverage = {
  clusterLabel: string;
  basePath: string;
  pages: { href: string; h1: string; metaDescription: string; score: number }[];
};

const BODY_MENTION_FLOOR = 2;

function countMatches(hay: string, alias: string): number {
  const re = new RegExp(`(?<![\\w-])${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`, "g");
  return (hay.match(re) ?? []).length;
}

let CACHE: Map<string, Coverage[]> | null = null;

function build(): Map<string, Coverage[]> {
  const spokes = allSpokes();
  const out = new Map<string, Coverage[]>();

  for (const api of API_ENTRIES) {
    const byCluster = new Map<string, Coverage>();
    for (const { basePath, entry } of spokes) {
      const inTitle = api.aliases.some((a) => countMatches(entry.h1, a) > 0);
      const inQuery = api.aliases.some(
        (a) => countMatches(entry.primaryQuery, a) > 0 || countMatches(entry.answer, a) > 0,
      );
      const body = api.aliases.reduce((n, a) => n + countMatches(entry.body, a), 0);
      if (!inTitle && !inQuery && body < BODY_MENTION_FLOOR) continue;
      const score = (inTitle ? 20 : 0) + (inQuery ? 6 : 0) + Math.min(body, 12);
      const bucket = byCluster.get(basePath) ?? {
        basePath,
        clusterLabel: CLUSTER_LABELS[basePath] ?? basePath,
        pages: [],
      };
      bucket.pages.push({
        href: `${basePath}/${entry.slug}`,
        h1: entry.h1,
        metaDescription: entry.metaDescription,
        score,
      });
      byCluster.set(basePath, bucket);
    }
    const clusters = [...byCluster.values()]
      .map((c) => ({ ...c, pages: c.pages.sort((a, b) => b.score - a.score) }))
      .sort(
        (a, b) =>
          Math.max(...b.pages.map((p) => p.score)) - Math.max(...a.pages.map((p) => p.score)),
      );
    out.set(api.id, clusters);
  }
  return out;
}

/** Every page on the site that covers this product, grouped by section. */
export function coverageFor(id: string): Coverage[] {
  CACHE ??= build();
  return CACHE.get(id) ?? [];
}

export function pageCount(id: string): number {
  return coverageFor(id).reduce((n, c) => n + c.pages.length, 0);
}

/**
 * The inverse view: which products a given page covers. Rendered on the page
 * as links into the directory, so the entity layer is reachable from the
 * prose that discusses it rather than only from its own index.
 */
export function apisOnPage(basePath: string, slug: string): { id: string; short: string }[] {
  CACHE ??= build();
  const href = `${basePath}/${slug}`;
  const out: { id: string; short: string; score: number }[] = [];
  for (const api of API_ENTRIES) {
    for (const c of CACHE.get(api.id) ?? []) {
      const hit = c.pages.find((p) => p.href === href);
      if (hit) out.push({ id: api.id, short: api.short, score: hit.score });
    }
  }
  return out
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ id, short }) => ({ id, short }));
}

/** Tracked ecosystem changes whose title or summary names this product. */
export function changesFor(api: ApiEntry): ChangeEvent[] {
  return CHANGE_EVENTS.filter((e) =>
    api.aliases.some(
      (a) => countMatches(e.title, a) > 0 || countMatches(e.summary, a) > 0,
    ),
  ).sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
}
