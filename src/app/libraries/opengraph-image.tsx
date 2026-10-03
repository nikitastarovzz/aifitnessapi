import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { LIBRARIES, LIBRARIES_FETCHED_ON } from "@/data/libraries";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Open-source health and fitness libraries";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Open-source libraries",
      title: "Health & Fitness Libraries",
      line: `${LIBRARIES.length} packages from npm, pub.dev and PyPI, read ${LIBRARIES_FETCHED_ON}`,
    }),
    { ...OG_SIZE },
  );
}
