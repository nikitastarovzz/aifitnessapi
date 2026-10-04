import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedHealthConnectApi, HCAPI_CONFIG } from "@/data/healthConnectApi";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Health Connect Jetpack API";

export default function Image() {
  const entries = releasedHealthConnectApi();
  const newest = entries.map((e) => e.updated).sort().at(-1) ?? "";
  return new ImageResponse(
    ogCard({
      eyebrow: HCAPI_CONFIG.hubLabel,
      title: "Health Connect Jetpack API, Method by Method",
      line: `${entries.length} page${entries.length === 1 ? "" : "s"}, last reviewed ${newest}`,
    }),
    { ...OG_SIZE },
  );
}
