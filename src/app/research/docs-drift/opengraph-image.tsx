import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { driftStudy } from "@/lib/researchPages";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI research";

export default function Image() {
  const s = driftStudy();
  const h = s.headlines[0];
  return new ImageResponse(ogCard({ eyebrow: "Research", title: s.h1, line: `${h.value} ${h.label}` }), { ...OG_SIZE });
}
