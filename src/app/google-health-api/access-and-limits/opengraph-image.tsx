import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { GHAPI_RATE_LIMITS } from "@/data/googleHealthApi";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Google Health API verification and rate limits";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Google Health API reference",
      title: "Google Health API verification and limits",
      line: GHAPI_RATE_LIMITS.map((r) => `${r.metric}: ${r.defaultLimit}`).join(" · "),
    }),
    { ...OG_SIZE },
  );
}
