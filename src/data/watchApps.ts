import { watchAppsEntries } from "./watchApps.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

/**
 * Cluster 20 — building the app that runs ON the watch.
 *
 * Boundary rule, because three clusters now touch the wrist and they must not
 * compete: /devices covers the watch as a data source for a phone app,
 * /engagement covers the surfaces that bring somebody back (Ongoing Activity,
 * complications as engagement), and this cluster covers writing and shipping
 * the watch app itself — session lifecycle, background execution, tiles,
 * pairing, distribution, battery, and testing.
 *
 * Every platform claim traces to Apple's or Google's own documentation. No
 * battery or performance numbers: battery is the defining constraint of this
 * platform and is discussed as a design force, never as a measurement we
 * cannot make.
 */
export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const WATCH_PATH = "/watch-apps";
export const WATCH_CONFIG: ClusterConfig = { basePath: WATCH_PATH, hubLabel: "Watch Apps" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_WATCH = new Set<string>([
  "watchos-workout-app-anatomy",
  "healthkit-on-apple-watch",
  "apple-watch-background-execution",
  "workoutkit-scheduled-workouts",
  "mirroring-workouts-to-iphone",
  "wear-os-app-anatomy",
  "wear-os-exercise-tracking",
  "wear-os-tiles",
  "wear-os-phone-sync",
  "watch-platform-differences",
  "watch-app-battery",
  "testing-watch-apps",
]);

export const allWatchApps: ClusterEntry[] = watchAppsEntries;

export function releasedWatchApps(): ClusterEntry[] {
  return allWatchApps.filter((e) => RELEASED_WATCH.has(e.slug));
}

export function getWatchApp(slug: string): ClusterEntry | undefined {
  return releasedWatchApps().find((e) => e.slug === slug);
}
