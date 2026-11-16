import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedCookbook, COOKBOOK_CONFIG } from "@/data/cookbook";
import { clusterHubOgImage } from "@/lib/clusterOgImage";

/** Hub social card (src/lib/clusterOgImage.ts): the supporting line counts the
 *  released pages at build time, so it can never claim more than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fitness API Cookbook: Tested Reference Code";

export default clusterHubOgImage(COOKBOOK_CONFIG, releasedCookbook, alt);
