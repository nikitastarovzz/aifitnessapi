import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedCompliance, COMPLIANCE_CONFIG } from "@/data/compliance";
import { clusterHubOgImage } from "@/lib/clusterOgImage";

/** Hub social card (src/lib/clusterOgImage.ts): the supporting line counts the
 *  released pages at build time, so it can never claim more than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Health-Data Compliance & Privacy for Fitness Apps";

export default clusterHubOgImage(COMPLIANCE_CONFIG, releasedCompliance, alt);
