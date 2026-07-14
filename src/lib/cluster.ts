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
   * compliance cluster (YMYL).
   */
  disclaimer?: "comparison" | "legal";
};

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
