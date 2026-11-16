import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedEntries, FITNESS_APIS_CONFIG } from "@/data/fitnessApis";
import { clusterHubOgImage } from "@/lib/clusterOgImage";

/** Hub social card (src/lib/clusterOgImage.ts): the supporting line counts the
 *  released pages at build time, so it can never claim more than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fitness API Guide: Which Fitness API to Use (2026)";

export default clusterHubOgImage(FITNESS_APIS_CONFIG, releasedEntries, alt);
