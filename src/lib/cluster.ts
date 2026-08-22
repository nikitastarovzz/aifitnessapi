/**
 * Shared cluster primitives — used by every content cluster (fitness-apis,
 * guides, …). One entry shape + one template + one config, so a new cluster is
 * a data file plus a route, not a new system.
 */
export type RelatedLink = { href: string; label: string };
export type Faq = { q: string; a: string };
/** A HowTo step (optional; presence switches on HowTo JSON-LD for how-to pages). */
export type Step = { name: string; text: string };

export type ClusterEntry = {
  slug: string;
  primaryQuery: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  updated: string;
  /** Answer-first capsule: 2-4 plain sentences, no markdown. Speakable. */
  answer: string;
  /** Markdown substance rendered under the capsule (GFM tables, fenced code). */
  body: string;
  faqs: Faq[];
  related: RelatedLink[];
  cta: { pitch: string };
  /** How-to steps for HowTo schema. Omit for non-how-to (roundup/comparison). */
  steps?: Step[];
  /**
   * Page is about this site's own product (KinesteX funds AIFitnessAPI).
   * Setting this renders a permanent disclosure banner above the capsule.
   * ops/GEO.md makes it mandatory for any page that features KinesteX;
   * the FIRSTPARTY qa gate enforces the rendered result.
   */
  firstParty?: boolean;
};

/** Per-cluster wiring the shared template needs. */
export type ClusterConfig = {
  /** e.g. "/fitness-apis" or "/guides". */
  basePath: string;
  /** Breadcrumb + "all X" label, e.g. "Fitness APIs" or "Guides". */
  hubLabel: string;
  /**
   * Which trust line to show. "comparison" (default) is the not-affiliated /
   * verify-the-docs line; "legal" is the not-legal-advice line for the
   * compliance cluster (YMYL); "health-ai" is the models-are-confidently-wrong
   * line for the LLM cluster.
   */
  disclaimer?: "comparison" | "legal" | "health-ai";
};

/** Per-cluster hero-art seed (varies the decorative motif so clusters look
 *  distinct). One stable index per basePath. */
export const CLUSTER_SEED: Record<string, number> = {
  "/fitness-apis": 0,
  "/guides": 1,
  "/build": 2,
  "/integrate": 3,
  "/fix": 4,
  "/learn": 5,
  "/alternatives": 6,
  "/compliance": 7,
  "/migrate": 8,
  "/pricing": 9,
  "/compare": 10,
  "/data": 11,
  "/motion": 12,
  "/ai": 13,
  "/architecture": 14,
  "/test": 15,
  "/cookbook": 16,
  "/devices": 17,
  "/engagement": 18,
  "/watch-apps": 19,
};
export function heroSeed(basePath: string): number {
  return CLUSTER_SEED[basePath] ?? 0;
}
/** Stable hero seed from an arbitrary string (e.g. a blog slug). */
export function stringSeed(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) n = (n + s.charCodeAt(i)) % 9;
  return n;
}

/** Metadata clamps (§6). Break on the last space before the limit; add ellipsis. */
export function clampTitle(s: string, max = 60): string {
  return clamp(s, max);
}
export function clampDescription(s: string, max = 155): string {
  return clamp(s, max);
}
function clamp(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
