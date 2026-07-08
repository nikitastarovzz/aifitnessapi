/**
 * The "Best Fitness & Workout APIs" cluster — one data shape for every spoke.
 * The template (components/ClusterPage) and the [slug] route depend only on this
 * shape, so they can be built before the content is written.
 *
 * Content rules baked into the data (see each entry):
 *  - `answer` is the speakable answer-capsule: 2-4 plain sentences, no markdown.
 *  - `body` is markdown substance (GFM tables allowed), rendered below the capsule.
 *  - `faqs[].a` is plain text and MUST match the on-page text exactly (schema parity).
 *  - `metaTitle`/`metaDescription` are clamped programmatically as a safety net.
 */
import { entries } from "./fitnessApis.entries";
import { RELEASED_FITNESS_APIS } from "./release";

export type RelatedLink = { href: string; label: string };
export type Faq = { q: string; a: string };

export type ClusterEntry = {
  /** URL slug under /fitness-apis/. */
  slug: string;
  /** The one long-tail query this page owns (used for llms.txt + notes). */
  primaryQuery: string;
  /** H1 — the primary query phrased like a human. */
  h1: string;
  /** SEO title, front-loaded keyword. Clamped to 60 chars at render. */
  metaTitle: string;
  /** SEO description, a complete sentence. Clamped to 155 chars at render. */
  metaDescription: string;
  /** ISO date the facts were last verified — shown in the trust line. */
  updated: string;
  /** Answer-first capsule: 2-4 plain sentences, no markdown. */
  answer: string;
  /** Markdown substance rendered under the capsule (sections + comparison table). */
  body: string;
  /** 3-5 FAQs; answers plain text, must match on-page + FAQPage schema. */
  faqs: Faq[];
  /** 2-4 sibling/hub/pillar links. */
  related: RelatedLink[];
  /** Contextual CTA line shown before the subscribe button. */
  cta: { pitch: string };
};

export const PILLAR_PATH = "/fitness-apis";

/** All authored entries, in a stable display order. */
export const allEntries: ClusterEntry[] = entries;

/** Only released entries (respect the release gate). */
export function releasedEntries(): ClusterEntry[] {
  return allEntries.filter((e) => RELEASED_FITNESS_APIS.has(e.slug));
}

export function getEntry(slug: string): ClusterEntry | undefined {
  return releasedEntries().find((e) => e.slug === slug);
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
