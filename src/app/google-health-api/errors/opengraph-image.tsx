import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { GHAPI_ERRORS } from "@/data/googleHealthApi";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Google Health API error codes";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Google Health API reference",
      title: "Google Health API error codes",
      line: `${GHAPI_ERRORS.length} reasons in Google's v4 error catalog · troubleshooting · ACCOUNT_NOT_LINKED`,
    }),
    { ...OG_SIZE },
  );
}
