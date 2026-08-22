import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { API_ENTRIES } from "@/data/apis";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — compare two fitness APIs";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Compare",
      title: "Two fitness APIs, side by side",
      line: `${API_ENTRIES.length} products · billing, user-side cost, approval gates`,
    }),
    { ...OG_SIZE },
  );
}
