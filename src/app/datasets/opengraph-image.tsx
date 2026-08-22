import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — open fitness and health API datasets";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Open data",
      title: "Open Datasets",
      line: "Fitness & health API data in JSON and CSV — CC BY 4.0, version 2026.1",
    }),
    { ...OG_SIZE },
  );
}
