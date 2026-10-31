import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { EVENTS } from "@/lib/shipIt";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Ship It, a fitness-app survival game";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Game",
      title: "Ship It: can your fitness app survive 2026?",
      line: `${EVENTS.length} real, dated API events · pick a stack · keep your users`,
    }),
    { ...OG_SIZE },
  );
}
