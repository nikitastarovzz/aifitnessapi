import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedArchitecture, ARCHITECTURE_CONFIG } from "@/data/architecture";
import { clusterHubOgImage } from "@/lib/clusterOgImage";

/** Hub social card (src/lib/clusterOgImage.ts): the supporting line counts the
 *  released pages at build time, so it can never claim more than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Health Data Architecture for Fitness Apps";

export default clusterHubOgImage(ARCHITECTURE_CONFIG, releasedArchitecture, alt);
