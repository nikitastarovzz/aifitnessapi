import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { GHAPI_DATA_TYPE_MAPPING, GHAPI_ENDPOINT_MAPPING, GHAPI_SCOPE_MAPPING } from "@/data/googleHealthApi";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Fitbit Web API to Google Health API mapping";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Google Health API reference",
      title: "Fitbit Web API to Google Health API",
      line: `Google's tables: ${GHAPI_DATA_TYPE_MAPPING.length} data types, ${GHAPI_SCOPE_MAPPING.length} scopes, ${GHAPI_ENDPOINT_MAPPING.length} endpoint types`,
    }),
    { ...OG_SIZE },
  );
}
