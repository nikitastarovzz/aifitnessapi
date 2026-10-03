import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { hcTotals } from "@/data/hcPages";
import { HC_FETCHED_ON } from "@/data/healthConnectRecords";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Health Connect record reference";

export default function Image() {
  const t = hcTotals();
  return new ImageResponse(
    ogCard({
      eyebrow: "Health Connect reference",
      title: "Health Connect record types",
      line: `${t.records} records · ${t.aggregates} aggregate metrics · read from Google's docs ${HC_FETCHED_ON}`,
    }),
    { ...OG_SIZE },
  );
}
