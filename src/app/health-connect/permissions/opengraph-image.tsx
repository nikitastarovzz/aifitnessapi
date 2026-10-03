import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { hcTotals } from "@/data/hcPages";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — every Health Connect permission string";

export default function Image() {
  const t = hcTotals();
  return new ImageResponse(
    ogCard({
      eyebrow: "Health Connect reference",
      title: "Every Health Connect permission",
      line: `${t.frameworkPermissions} android.permission.health strings, grouped, with the record each unlocks`,
    }),
    { ...OG_SIZE },
  );
}
