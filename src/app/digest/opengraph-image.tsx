import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { digests } from "@/data/digest";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — monthly digest archive";

export default function Image() {
  const all = digests();
  return new ImageResponse(
    ogCard({
      eyebrow: "Digest",
      title: "The monthly digest",
      line: `${all.length} issue${all.length === 1 ? "" : "s"}, generated from the record — not written from memory`,
    }),
    { ...OG_SIZE },
  );
}
