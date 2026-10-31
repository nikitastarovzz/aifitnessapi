import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { API_ENTRIES } from "@/data/apis";
import { CATEGORIES } from "@/lib/ecosystemSignals";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — the fitness & health API market map";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Market map",
      title: "The fitness & health API landscape",
      line: `${API_ENTRIES.length} products in ${CATEGORIES.length} categories · not ranked`,
    }),
    { ...OG_SIZE },
  );
}
