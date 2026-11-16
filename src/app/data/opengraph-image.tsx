import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedData, DATA_CONFIG } from "@/data/healthData";
import { clusterHubOgImage } from "@/lib/clusterOgImage";

/** Hub social card (src/lib/clusterOgImage.ts): the supporting line counts the
 *  released pages at build time, so it can never claim more than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Health Data by Metric: Which API for Each";

export default clusterHubOgImage(DATA_CONFIG, releasedData, alt);
