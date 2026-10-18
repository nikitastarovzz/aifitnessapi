import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { getLibraryLanding, landingOgLine } from "@/data/librariesLandings";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Flutter health data packages";

export default function Image() {
  const l = getLibraryLanding("flutter");
  return new ImageResponse(ogCard({ eyebrow: "Open-source libraries", title: l.h1, line: landingOgLine(l) }), { ...OG_SIZE });
}
