import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { OPENNESS_CHECKS, OPENNESS_VENDORS } from "@/lib/opennessIndex.mjs";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — the fitness API openness index";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Openness index",
      title: "Which developer basics each wearable API documents",
      line: `${OPENNESS_VENDORS.length} APIs · ${OPENNESS_CHECKS.length} checks · every mark linked to the vendor's own words · no rank`,
    }),
    { ...OG_SIZE },
  );
}
