import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedPhoneSensors, SENSORS_CONFIG } from "@/data/phoneSensors";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Fitness features from phone motion sensors";

export default function Image() {
  const entries = releasedPhoneSensors();
  const newest = entries.map((e) => e.updated).sort().at(-1) ?? "";
  return new ImageResponse(
    ogCard({
      eyebrow: SENSORS_CONFIG.hubLabel,
      title: "Phone Motion Sensors for Fitness Apps",
      line: `${entries.length} page${entries.length === 1 ? "" : "s"}, last reviewed ${newest}`,
    }),
    { ...OG_SIZE },
  );
}
