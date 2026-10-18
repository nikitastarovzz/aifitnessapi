import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { getLibraryLanding, landingOgLine } from "@/data/librariesLandings";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Capacitor and Cordova health plugins";

export default function Image() {
  const l = getLibraryLanding("capacitor-cordova");
  return new ImageResponse(ogCard({ eyebrow: "Open-source libraries", title: l.h1, line: landingOgLine(l) }), { ...OG_SIZE });
}
