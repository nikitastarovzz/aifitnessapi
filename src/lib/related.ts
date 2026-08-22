import type { ClusterEntry } from "./cluster";
import { allSpokes, CLUSTER_LABELS } from "./clusterRegistry";
import { ALL_TERMS } from "@/data/glossary";

/**
 * Cross-cluster "related reading", computed rather than curated.
 *
 * Every spoke already carries a hand-written `related` list, but those stay
 * inside their own cluster and inside the writer's head at the time. This
 * derives a second, wider set from three signals the pages themselves carry:
 * the glossary concepts they discuss, the vendor documentation they cite, and
 * the vocabulary of their titles. Cross-cluster pairs are preferred — a
 * sibling is already one click away via prev/next and the hub.
 *
 * Computed once per process and cached: the whole site is 240 spokes, so the
 * pairwise pass is cheap, but it must not run 240 times.
 */

export type RelatedPage = {
  href: string;
  h1: string;
  clusterLabel: string;
  metaDescription: string;
};

const STOP = new Set([
  "a","an","the","and","or","of","for","to","in","on","with","without","your","you",
  "is","are","how","what","why","when","which is","do","does","it","that","this",
  "from","by","at","as","be","can","should","not","but","into","using","use","vs",
  "guide","api","apis","app","apps","data","best","2026","2025","one","two","get",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

/** A glossary term reduced to the phrase that actually appears in prose. */
const TERM_PHRASES: { id: string; phrase: string }[] = ALL_TERMS.map((t) => ({
  id: t.term,
  phrase: t.term.replace(/\s*\([^)]*\)\s*/g, " ").trim().toLowerCase(),
})).filter((t) => t.phrase.length > 3);

function hostsOf(body: string): string[] {
  const out = new Set<string>();
  for (const m of body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
    try {
      out.add(new URL(m[1]).hostname.replace(/^www\./, ""));
    } catch {
      /* malformed link in body — ignore */
    }
  }
  return [...out];
}

type Features = {
  basePath: string;
  entry: ClusterEntry;
  terms: Set<string>;
  hosts: Set<string>;
  words: Set<string>;
};

function featuresOf(basePath: string, entry: ClusterEntry): Features {
  const hay = `${entry.h1} ${entry.answer} ${entry.body}`.toLowerCase();
  return {
    basePath,
    entry,
    terms: new Set(TERM_PHRASES.filter((t) => hay.includes(t.phrase)).map((t) => t.id)),
    hosts: new Set(hostsOf(entry.body)),
    words: new Set([
      ...tokens(entry.h1),
      ...tokens(entry.primaryQuery),
      ...tokens(entry.metaDescription),
    ]),
  };
}

function overlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return n;
}

let CACHE: Map<string, RelatedPage[]> | null = null;

function build(): Map<string, RelatedPage[]> {
  const feats = allSpokes().map(({ basePath, entry }) => featuresOf(basePath, entry));
  const out = new Map<string, RelatedPage[]>();

  for (const a of feats) {
    const aHref = `${a.basePath}/${a.entry.slug}`;
    // Anything the page already links to, in prose or in its curated list,
    // would be a duplicate suggestion.
    const already = new Set<string>([
      ...a.entry.related.map((r) => r.href.split("#")[0]),
      ...[...a.entry.body.matchAll(/\]\((\/[a-z0-9/-]+)\)/g)].map((m) => m[1]),
    ]);

    const scored: { score: number; f: Features }[] = [];
    for (const b of feats) {
      const bHref = `${b.basePath}/${b.entry.slug}`;
      if (bHref === aHref || already.has(bHref)) continue;
      const score =
        3 * overlap(a.terms, b.terms) +
        2 * overlap(a.hosts, b.hosts) +
        overlap(a.words, b.words);
      if (score < 6) continue;
      // A sibling is already reachable from the hub and prev/next; the value
      // here is the jump into another part of the site.
      scored.push({ score: a.basePath === b.basePath ? score * 0.7 : score, f: b });
    }

    scored.sort((x, y) => y.score - x.score);
    // At most one page per other cluster, so the block is a spread of the
    // site rather than four pages from whichever cluster overlaps most.
    const seenCluster = new Set<string>();
    const picks: RelatedPage[] = [];
    for (const { f } of scored) {
      if (seenCluster.has(f.basePath)) continue;
      seenCluster.add(f.basePath);
      picks.push({
        href: `${f.basePath}/${f.entry.slug}`,
        h1: f.entry.h1,
        clusterLabel: CLUSTER_LABELS[f.basePath] ?? f.basePath,
        metaDescription: f.entry.metaDescription,
      });
      if (picks.length === 4) break;
    }
    out.set(aHref, picks);
  }
  return out;
}

/** Up to four computed cross-cluster reads for a spoke. */
export function relatedAcrossSite(basePath: string, slug: string): RelatedPage[] {
  CACHE ??= build();
  return CACHE.get(`${basePath}/${slug}`) ?? [];
}
