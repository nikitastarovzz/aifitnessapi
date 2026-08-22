import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedCookbook, COOKBOOK_CONFIG } from "@/data/cookbook";

/** Hub social card. The supporting line is derived from the release gate at
 *  build time, so it can never claim more pages than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fitness API Cookbook: Tested Reference Code";

export default function Image() {
  const released = releasedCookbook();
  const dates = released.map((e) => e.updated).sort();
  const line = released.length
    ? `${released.length} page${released.length === 1 ? "" : "s"}, last reviewed ${dates[dates.length - 1]}`
    : undefined;
  return new ImageResponse(
    ogCard({
      eyebrow: COOKBOOK_CONFIG.hubLabel,
      title: "Fitness API Cookbook: Tested Reference Code",
      line,
    }),
    { ...OG_SIZE },
  );
}
