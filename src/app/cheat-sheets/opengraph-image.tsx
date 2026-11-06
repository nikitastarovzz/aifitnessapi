import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — printable cheat sheets for HealthKit, Health Connect and pose keypoints";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Cheat sheets",
      title: "HealthKit, Health Connect and pose keypoints on one page each",
      line: "PDF and PNG · generated from Apple's, Google's and the model sources · CC BY 4.0",
    }),
    { ...OG_SIZE },
  );
}
