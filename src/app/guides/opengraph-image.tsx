import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedGuides, GUIDES_CONFIG } from "@/data/guides";

/** Hub social card. The supporting line is derived from the release gate at
 *  build time, so it can never claim more pages than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "How to Add AI Workout Tracking to Your App";

export default function Image() {
  const released = releasedGuides();
  const dates = released.map((e) => e.updated).sort();
  const line = released.length
    ? `${released.length} page${released.length === 1 ? "" : "s"}, last reviewed ${dates[dates.length - 1]}`
    : undefined;
  return new ImageResponse(
    ogCard({
      eyebrow: GUIDES_CONFIG.hubLabel,
      title: "How to Add AI Workout Tracking to Your App",
      line,
    }),
    { ...OG_SIZE },
  );
}
