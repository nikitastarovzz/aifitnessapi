import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { CHANGE_EVENTS } from "@/data/changes";
import { API_ENTRIES } from "@/data/apis";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — API change alerts";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Change alerts",
      title: "Watch the APIs you depend on",
      line: `${API_ENTRIES.length} products · ${CHANGE_EVENTS.length} dated changes tracked so far`,
    }),
    { ...OG_SIZE },
  );
}
