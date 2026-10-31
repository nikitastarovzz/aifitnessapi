import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { GRAVEYARD } from "@/data/graveyard";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — the Fitness API Graveyard";

export default function Image() {
  const n = (s: string) => GRAVEYARD.filter((e) => e.status === s).length;
  return new ImageResponse(
    ogCard({
      eyebrow: "API Graveyard",
      title: "The Fitness API Graveyard",
      line: `${GRAVEYARD.length} APIs: ${n("dead")} dead, ${n("dying")} dying, ${n("deprecated")} deprecated · in the vendors' own words`,
    }),
    { ...OG_SIZE },
  );
}
