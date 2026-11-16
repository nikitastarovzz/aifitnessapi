import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedGuides, GUIDES_CONFIG } from "@/data/guides";
import { clusterHubOgImage } from "@/lib/clusterOgImage";

/** Hub social card (src/lib/clusterOgImage.ts): the supporting line counts the
 *  released pages at build time, so it can never claim more than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "How to Add AI Workout Tracking to Your App";

export default clusterHubOgImage(GUIDES_CONFIG, releasedGuides, alt);
