import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — embeds and badges";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Embeds",
      title: "Put our tables on your site",
      line: "Two copy-paste iframe widgets and a link badge — attribution is the licence",
    }),
    { ...OG_SIZE },
  );
}
