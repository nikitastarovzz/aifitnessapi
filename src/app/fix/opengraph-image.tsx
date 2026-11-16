import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedFixes, FIX_CONFIG } from "@/data/fix";
import { clusterHubOgImage } from "@/lib/clusterOgImage";

/** Hub social card (src/lib/clusterOgImage.ts): the supporting line counts the
 *  released pages at build time, so it can never claim more than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fix Fitness API Errors: 401s, 429s, Webhooks";

export default clusterHubOgImage(FIX_CONFIG, releasedFixes, alt);
