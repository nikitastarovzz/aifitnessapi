import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedMotion, MOTION_CONFIG } from "@/data/motion";

/** Hub social card. The supporting line is derived from the release gate at
 *  build time, so it can never claim more pages than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AI Motion & Pose Estimation for Fitness Apps";

export default function Image() {
  const released = releasedMotion();
  const dates = released.map((e) => e.updated).sort();
  const line = released.length
    ? `${released.length} page${released.length === 1 ? "" : "s"}, last reviewed ${dates[dates.length - 1]}`
    : undefined;
  return new ImageResponse(
    ogCard({
      eyebrow: MOTION_CONFIG.hubLabel,
      title: "AI Motion & Pose Estimation for Fitness Apps",
      line,
    }),
    { ...OG_SIZE },
  );
}
