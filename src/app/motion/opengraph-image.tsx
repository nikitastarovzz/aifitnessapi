import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedMotion, MOTION_CONFIG } from "@/data/motion";
import { clusterHubOgImage } from "@/lib/clusterOgImage";

/** Hub social card (src/lib/clusterOgImage.ts): the supporting line counts the
 *  released pages at build time, so it can never claim more than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AI Motion & Pose Estimation for Fitness Apps";

export default clusterHubOgImage(MOTION_CONFIG, releasedMotion, alt);
