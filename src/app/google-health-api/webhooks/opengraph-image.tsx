import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { GHAPI_WEBHOOK_TYPES } from "@/data/googleHealthApi";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Google Health API webhooks";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Google Health API reference",
      title: "Google Health API webhooks",
      line: `${GHAPI_WEBHOOK_TYPES.length} data types that notify · subscribers, verification, payloads, retries`,
    }),
    { ...OG_SIZE },
  );
}
