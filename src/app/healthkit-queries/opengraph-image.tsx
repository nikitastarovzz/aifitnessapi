import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedHealthkitQueries, HKQ_CONFIG } from "@/data/healthkitQueries";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — HealthKit query classes";

export default function Image() {
  const entries = releasedHealthkitQueries();
  const newest = entries.map((e) => e.updated).sort().at(-1) ?? "";
  return new ImageResponse(
    ogCard({
      eyebrow: HKQ_CONFIG.hubLabel,
      title: "HealthKit Query Classes Explained",
      line: `${entries.length} page${entries.length === 1 ? "" : "s"}, last reviewed ${newest}`,
    }),
    { ...OG_SIZE },
  );
}
