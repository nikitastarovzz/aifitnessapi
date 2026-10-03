import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { hcTotals } from "@/data/hcPages";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — every Health Connect aggregate metric";

export default function Image() {
  const t = hcTotals();
  return new ImageResponse(
    ogCard({
      eyebrow: "Health Connect reference",
      title: "Health Connect aggregate metrics",
      line: `${t.aggregates} AggregateMetric constants across ${t.recordsWithAggregates} records, with value types`,
    }),
    { ...OG_SIZE },
  );
}
