import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — which wearable API should you use? An eight-question quiz";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Quiz",
      title: "Which wearable API should you use?",
      line: "Eight questions: HealthKit, Health Connect, direct APIs, aggregators, Bluetooth or camera",
    }),
    { ...OG_SIZE },
  );
}
