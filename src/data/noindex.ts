import type { Metadata } from "next";
import { NOINDEX_GENERATED } from "./indexDemand";

/**
 * Hand-written pages kept out of search indexes (noindex, follow) and out of
 * the sitemap. ops/SEO-10-2026-10-27.md item 4(b), decided 2026-10-27 from
 * the Google and Bing pull for 2026-09-27 to 2026-10-24; the per-page table
 * is the "Item 4 decisions" section of that file.
 *
 * Each page here was published before 2026-08-26 (60 days before the pull's
 * end, the same age bar the generated-page rule uses), had no Google and no
 * Bing impression in that pull, no Google impression in the pull before it
 * (2026-09-22 to 2026-10-19), and no stronger sibling it could be folded into
 * without losing content that sibling lacks. These pages stay live for
 * readers, the hubs, site search, llms.txt and the markdown mirrors, and keep
 * every inbound link (follow). Re-judged at the 2026-11-10 pull: a page that
 * shows on either engine comes back.
 *
 * The generated reference pages are judged by data, not by hand:
 * NOINDEX_GENERATED in ./indexDemand.ts (scripts/build-index-demand.mjs).
 * qa's NOINDEX-PAGE-* and INDEX-DEMAND-* gates hold the rendered robots meta
 * and the sitemap to both lists.
 */
export const NOINDEX_PAGES: ReadonlySet<string> = new Set([
  "/accessibility/accessible-health-charts",
  "/accessibility/dynamic-type-workout-screens",
  "/accessibility/haptics-when-audio-is-busy",
  "/accessibility/labelling-exercises-and-sets",
  "/accessibility/testing-accessibility-fitness-app",
  "/ai/ai-vs-rules-based-coaching",
  "/ai/ground-llm-in-exercise-database",
  "/architecture/caching-fitness-api-responses",
  "/architecture/metric-versioning-and-recompute",
  "/build/ai-fitness-coaching-app",
  "/build/home-workout-app",
  "/build/personal-training-app",
  "/build/running-app",
  "/build/strength-training-app",
  "/build/yoga-app",
  "/compare/kinestex-vs-mediapipe",
  "/compare/strava-vs-garmin-connect",
  "/cookbook/rate-limit-fetcher",
  "/cookbook/rep-counter",
  "/engagement/ab-testing-engagement-features",
  "/engagement/camera-coaching-engagement",
  "/engagement/engagement-sdks-compared",
  "/engagement/measuring-retention-fitness-app",
  "/engagement/streaks-and-habit-loops",
  "/fitness-apis/fitness-api-vs-build-your-own",
  "/fix/fitbit-api-429-rate-limit",
  "/fix/refresh-token-not-working",
  "/guides/add-rep-counting",
  "/guides/ai-workout-tracking-flutter",
  "/learn/webhooks-vs-polling-for-fitness-data",
  "/learn/what-are-sleep-stages",
  "/migrate/aggregator-to-direct-integration",
  "/migrate/keep-users-connected-during-migration",
  "/migrate/migrate-off-a-deprecated-fitness-api",
  "/migrate/polling-to-webhooks",
  "/motion/how-form-feedback-works",
  "/test/data-deletion",
  "/test/healthkit-integration",
  "/test/provider-sandboxes",
  "/test/webhooks-locally",
]);

/** True when a page asks not to be indexed by either rule. */
export function isNoindexed(path: string): boolean {
  return NOINDEX_PAGES.has(path) || NOINDEX_GENERATED.has(path);
}

/** The metadata fragment a page spreads into generateMetadata: noindex,
 *  follow when either rule names it, nothing otherwise. */
export function robotsFor(path: string): Pick<Metadata, "robots"> {
  return isNoindexed(path) ? { robots: { index: false, follow: true } } : {};
}
