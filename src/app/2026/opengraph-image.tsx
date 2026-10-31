import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { slides, storyTitle } from "@/lib/year2026";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Fitness APIs in 2026, the year in numbers";

/** Static at build, like every other opengraph-image here: the card names the year's headline counts. */
export default function Image() {
  const s = slides();
  const changes = s.find((x) => x.id === "changes");
  return new ImageResponse(
    ogCard({
      eyebrow: "The year in numbers",
      title: storyTitle(),
      line: `${s.length} computed stats${changes ? ` · ${changes.value} dated changes on the tracker` : ""} · each with its source`,
    }),
    { ...OG_SIZE },
  );
}
