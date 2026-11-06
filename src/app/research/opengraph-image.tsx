import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { HUB, studies } from "@/lib/researchPages";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI research";

export default function Image() {
  const n = studies().length;
  return new ImageResponse(ogCard({ eyebrow: "Research", title: HUB.h1, line: `${n} studies computed from this site's own data, each with an open dataset` }), { ...OG_SIZE });
}
