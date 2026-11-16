import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedIntegrations, INTEGRATE_CONFIG } from "@/data/integrate";
import { clusterHubOgImage } from "@/lib/clusterOgImage";

/** Hub social card (src/lib/clusterOgImage.ts): the supporting line counts the
 *  released pages at build time, so it can never claim more than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "How to Integrate a Fitness or Health API";

export default clusterHubOgImage(INTEGRATE_CONFIG, releasedIntegrations, alt);
