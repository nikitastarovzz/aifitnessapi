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
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry, RelatedLink, Faq } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const PILLAR_PATH = "/fitness-apis";
/** Shared-template config for this cluster. */
export const FITNESS_APIS_CONFIG = { basePath: PILLAR_PATH, hubLabel: "Fitness APIs" };

/** All authored entries, in a stable display order. */
export const allEntries: ClusterEntry[] = entries;

/** Only released entries (respect the release gate). */
export function releasedEntries(): ClusterEntry[] {
  return allEntries.filter((e) => RELEASED_FITNESS_APIS.has(e.slug));
}

export function getEntry(slug: string): ClusterEntry | undefined {
  return releasedEntries().find((e) => e.slug === slug);
}
