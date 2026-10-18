import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { ghapiTotals } from "@/data/ghapiPages";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — every Google Health API scope";

export default function Image() {
  const t = ghapiTotals();
  return new ImageResponse(
    ogCard({
      eyebrow: "Google Health API reference",
      title: "Every Google Health API scope",
      line: `${t.documentedScopes} documented scopes · ${t.discoveryOnlyScopes} only in the discovery document · the data types each covers`,
    }),
    { ...OG_SIZE },
  );
}
