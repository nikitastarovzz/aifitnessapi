import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { hubGraph, markdownUrl } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

/**
 * The machine layer for a cluster hub: a CollectionPage whose ItemList
 * enumerates every page in the cluster (so a model reading one hub learns the
 * whole cluster without crawling it), plus the markdown-mirror link relation.
 *
 * Everything is derived from the cluster registry, so a hub can never
 * advertise a stale membership list — adding a spoke updates its hub's
 * structured data with no edit here.
 */
export default function HubJsonLd({
  basePath,
  description,
  name,
  updated,
  capsuleId = "answer",
}: {
  basePath: string;
  description: string;
  /** Defaults to the cluster's own hub label. */
  name?: string;
  /** Defaults to the newest review date among the cluster's pages. */
  updated?: string;
  capsuleId?: string;
}) {
  const entries = clusterMap()[basePath] ?? [];
  if (entries.length === 0) return null;

  const newest = updated ?? entries.map((e) => e.updated).sort().at(-1) ?? "";
  const label = name ?? CLUSTER_LABELS[basePath] ?? basePath;
  const graph = hubGraph({
    basePath,
    name: label,
    description,
    updated: newest,
    entries,
    capsuleId,
  });

  return (
    <>
      <link rel="alternate" type="text/markdown" href={markdownUrl(basePath)} />
      {/* This cluster's own RSS feed. Somebody who cares about wearables does
          not want the whole site in their reader, and a per-section feed is
          the cheapest way to let them subscribe to exactly the part they
          follow. */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${label} — new and updated pages`}
        href={absoluteUrl(`/feeds${basePath}.xml`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
    </>
  );
}
