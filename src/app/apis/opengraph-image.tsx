import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { API_ENTRIES } from "@/data/apis";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Fitness & health API directory";

export default function Image() {
  const gated = API_ENTRIES.filter((a) => a.approvalGate).length;
  return new ImageResponse(
    ogCard({
      eyebrow: "API directory",
      title: "Fitness & health API directory",
      line: `${API_ENTRIES.length} products — ${gated} of them gated by an approval`,
    }),
    { ...OG_SIZE },
  );
}
