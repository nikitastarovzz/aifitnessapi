import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedOwnYourData, OWN_DATA_CONFIG } from "@/data/ownYourData";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Export your own health and fitness data";

export default function Image() {
  const entries = releasedOwnYourData();
  const newest = entries.map((e) => e.updated).sort().at(-1) ?? "";
  return new ImageResponse(
    ogCard({
      eyebrow: OWN_DATA_CONFIG.hubLabel,
      title: "Export Your Own Health and Fitness Data",
      line: `${entries.length} page${entries.length === 1 ? "" : "s"}, last reviewed ${newest}`,
    }),
    { ...OG_SIZE },
  );
}
