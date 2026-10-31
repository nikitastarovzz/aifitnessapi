import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { CHALLENGE_SECONDS } from "@/lib/repCounter.mjs";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — the 30-second webcam rep challenge";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Rep challenge",
      title: `How many squats can you do in ${CHALLENGE_SECONDS} seconds?`,
      line: "Counted live by a pose model in your browser · nothing uploaded",
    }),
    { ...OG_SIZE },
  );
}
