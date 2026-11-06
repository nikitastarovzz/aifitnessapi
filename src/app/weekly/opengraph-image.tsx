import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { weeks } from "@/lib/weekly";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — the weekly fitness API roundup";

export default function Image() {
  const all = weeks();
  return new ImageResponse(
    ogCard({
      eyebrow: "Weekly roundup",
      title: "The week in fitness APIs",
      line: `${all.length} week${all.length === 1 ? "" : "s"} of changes, shutdowns and releases, generated from the record`,
    }),
    { ...OG_SIZE },
  );
}
