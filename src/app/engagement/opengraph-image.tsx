import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedEngagement, ENGAGEMENT_CONFIG } from "@/data/engagement";

/** Hub social card. The supporting line is derived from the release gate at
 *  build time, so it can never claim more pages than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fitness App Engagement & Retention";

export default function Image() {
  const released = releasedEngagement();
  const dates = released.map((e) => e.updated).sort();
  const line = released.length
    ? `${released.length} page${released.length === 1 ? "" : "s"}, last reviewed ${dates[dates.length - 1]}`
    : undefined;
  return new ImageResponse(
    ogCard({
      eyebrow: ENGAGEMENT_CONFIG.hubLabel,
      title: "Fitness App Engagement & Retention",
      line,
    }),
    { ...OG_SIZE },
  );
}
