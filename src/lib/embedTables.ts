import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { autolinkGlossary } from "@/lib/autolink";
import { rehypeCollectTables, type TableInfo } from "@/lib/tablePlugins";
import type { ClusterEntry } from "@/lib/cluster";
export { embedTablePath, tableAnchor, embedSnippets, suggestedHeight } from "@/lib/embedSnippets";
import { PRICING_PATH } from "@/data/pricing";
import { ALTERNATIVES_PATH } from "@/data/alternatives";
import { COMPARE_PATH } from "@/data/compare";
import { PILLAR_PATH } from "@/data/fitnessApis";
import { INTEGRATE_PATH } from "@/data/integrate";

/**
 * "Embed this table" (ops/NEXT-10-2026-11-04.md item 7): every markdown table
 * in the comparison and pricing clusters is also served as a chromeless,
 * noindex iframe widget at /embed/table/<cluster>/<slug>/<n>, canonical to
 * the page it comes from. Server-only.
 *
 * The clusters are the ones whose tables are comparisons or price lists other
 * people cite. A cluster added here gets Embed controls and routes together —
 * qa holds the two to each other in both directions (EMBED-TABLE-*).
 */
export const EMBED_TABLE_CLUSTERS = [
  PRICING_PATH,
  ALTERNATIVES_PATH,
  COMPARE_PATH,
  PILLAR_PATH,
  INTEGRATE_PATH,
] as const;

export function offersTableEmbeds(basePath: string): boolean {
  return (EMBED_TABLE_CLUSTERS as readonly string[]).includes(basePath);
}

/**
 * The body exactly as the page renders it: ClusterPage runs the glossary
 * autolinker before MDX, so the embed and the counting pass do too.
 */
export const renderedBody = (basePath: string, entry: ClusterEntry) =>
  autolinkGlossary(entry.body, `${basePath}/${entry.slug}`);

const cache = new Map<string, Promise<TableInfo[]>>();

/**
 * The tables in an entry's body, counted by the page's own MDX pipeline
 * (remark-gfm, same source), so a route exists for exactly the tables the
 * page shows. Memoised per page for the build worker's lifetime.
 */
export function tablesOf(basePath: string, entry: ClusterEntry): Promise<TableInfo[]> {
  const key = `${basePath}/${entry.slug}`;
  let p = cache.get(key);
  if (!p) {
    p = (async () => {
      const out: TableInfo[] = [];
      await compileMDX({
        source: renderedBody(basePath, entry),
        options: {
          mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeCollectTables(out)] },
        },
      });
      return out;
    })();
    cache.set(key, p);
  }
  return p;
}

export type EmbeddableTable = {
  basePath: string;
  entry: ClusterEntry;
  table: TableInfo;
};

/** Every embeddable table on the site, in registry order. */
export async function allEmbeddableTables(): Promise<EmbeddableTable[]> {
  const map = clusterMap();
  const out: EmbeddableTable[] = [];
  for (const basePath of EMBED_TABLE_CLUSTERS) {
    for (const entry of map[basePath] ?? []) {
      for (const table of await tablesOf(basePath, entry)) out.push({ basePath, entry, table });
    }
  }
  return out;
}

export const clusterLabel = (basePath: string) => CLUSTER_LABELS[basePath] ?? basePath;
