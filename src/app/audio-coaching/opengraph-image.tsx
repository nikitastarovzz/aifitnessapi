import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedAudioCoaching, AUDIO_CONFIG } from "@/data/audioCoaching";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Audio cues and ducking for workout apps";

export default function Image() {
  const entries = releasedAudioCoaching();
  const newest = entries.map((e) => e.updated).sort().at(-1) ?? "";
  return new ImageResponse(
    ogCard({
      eyebrow: AUDIO_CONFIG.hubLabel,
      title: "Audio Cues & Ducking for Workout Apps",
      line: `${entries.length} page${entries.length === 1 ? "" : "s"}, last reviewed ${newest}`,
    }),
    { ...OG_SIZE },
  );
}
