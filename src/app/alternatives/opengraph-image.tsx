import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedAlternatives, ALTERNATIVES_CONFIG } from "@/data/alternatives";

/** Hub social card. The supporting line is derived from the release gate at
 *  build time, so it can never claim more pages than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fitness & Health API Alternatives";

export default function Image() {
  const released = releasedAlternatives();
  const dates = released.map((e) => e.updated).sort();
  const line = released.length
    ? `${released.length} page${released.length === 1 ? "" : "s"}, last reviewed ${dates[dates.length - 1]}`
    : undefined;
  return new ImageResponse(
    ogCard({
      eyebrow: ALTERNATIVES_CONFIG.hubLabel,
      title: "Fitness & Health API Alternatives",
      line,
    }),
    { ...OG_SIZE },
  );
}
