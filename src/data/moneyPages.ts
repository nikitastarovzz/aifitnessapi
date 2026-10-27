import { allSpokes, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import type { ClusterEntry } from "@/lib/cluster";
import { PUBLISHED } from "./published";
import { sentences } from "./hubGlance";

/**
 * The pages that earn clicks, listed first on the answer surfaces (llms.txt,
 * llms-full.txt, answers.json, claims.json) with a one-line answer each —
 * ops/SEO-10-2026-10-27.md #9.
 *
 * Membership is a rule, never a hand list, so a page added to one of these
 * clusters tomorrow is listed with no edit here:
 *
 * - every released page in the commercial clusters (/pricing, /alternatives,
 *   /compare) and every per-vendor integration guide (/integrate), the
 *   formats ops/DAILY-CONTENT.md names as the ones that convert;
 * - the vendor head-to-heads filed under /fitness-apis (slug "x-vs-y");
 * - any other page from the newest batch: first published on the newest date
 *   in src/data/published.ts (2026-10-22 when this was written), or missing
 *   from it — the backfill names a missing key as a page that postdates its
 *   last regeneration, i.e. added since. RECENT_WINDOW_DAYS widens the batch.
 *
 * The one-line answer is the opening of the page's own capsule — its first
 * sentence, or the first two when the first is a bare lead-in under
 * ONE_LINE_MIN characters — so it says nothing the page does not.
 */

export const MONEY_CLUSTERS = ["/pricing", "/alternatives", "/compare", "/integrate"] as const;
export const RECENT_WINDOW_DAYS = 0;
export const ONE_LINE_MIN = 80;

/** The capsule's opening: whole sentences until ONE_LINE_MIN characters. */
export function oneLineAnswer(answer: string): string {
  const out: string[] = [];
  for (const s of sentences(answer)) {
    out.push(s);
    if (out.join(" ").length >= ONE_LINE_MIN) break;
  }
  return out.join(" ") || answer.trim();
}

export type MoneyGroup = "pricing" | "alternatives" | "comparisons" | "integrations" | "new";
export type MoneyPage = {
  path: string;
  basePath: string;
  entry: ClusterEntry;
  oneLine: string;
  /** datePublished from published.ts, or null when the page postdates it. */
  published: string | null;
  group: MoneyGroup;
};

export const MONEY_GROUP_LABELS: Record<MoneyGroup, string> = {
  pricing: "Pricing: what each API costs",
  alternatives: "Alternatives: what to switch to, and why teams leave",
  comparisons: "Head-to-heads: two products, the developer's view",
  integrations: "Integration guides: one per vendor",
  new: "Newest pages in other sections",
};

/** Newest first-published date in the backfill, and the batch window's start. */
export function recentCutoff(): { newest: string; since: string } {
  const newest = Object.values(PUBLISHED).sort().at(-1) ?? "1970-01-01";
  const d = new Date(`${newest}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - RECENT_WINDOW_DAYS);
  return { newest, since: d.toISOString().slice(0, 10) };
}

export function moneyPages(): MoneyPage[] {
  const { since } = recentCutoff();
  const out: MoneyPage[] = [];
  const add = (basePath: string, entry: ClusterEntry, group: MoneyGroup) => {
    const key = `${basePath.slice(1)}/${entry.slug}`;
    out.push({
      path: `${basePath}/${entry.slug}`,
      basePath,
      entry,
      oneLine: oneLineAnswer(entry.answer),
      published: PUBLISHED[key] ?? null,
      group,
    });
  };
  const spokes = allSpokes();
  const byBase = (b: string) => spokes.filter((s) => s.basePath === b);

  for (const { basePath, entry } of byBase("/pricing")) add(basePath, entry, "pricing");
  for (const { basePath, entry } of byBase("/alternatives")) add(basePath, entry, "alternatives");
  for (const { basePath, entry } of byBase("/compare")) add(basePath, entry, "comparisons");
  // Vendor head-to-heads only: "fitness-api-vs-build-your-own" is a decision guide, not two products.
  for (const { basePath, entry } of byBase("/fitness-apis")) {
    if (entry.slug.includes("-vs-") && !entry.slug.startsWith("fitness-api-")) add(basePath, entry, "comparisons");
  }
  for (const { basePath, entry } of byBase("/integrate")) add(basePath, entry, "integrations");

  const listed = new Set(out.map((m) => m.path));
  for (const { basePath, entry } of spokes) {
    const path = `${basePath}/${entry.slug}`;
    if (listed.has(path)) continue;
    const pub = PUBLISHED[path.slice(1)];
    if (pub === undefined || pub >= since) add(basePath, entry, "new");
  }
  return out;
}

/** The cluster label a money page sits in. */
export function moneyCluster(m: MoneyPage): string {
  return CLUSTER_LABELS[m.basePath] ?? m.basePath;
}

export const MONEY_GROUP_ORDER: MoneyGroup[] = ["pricing", "alternatives", "comparisons", "integrations", "new"];
