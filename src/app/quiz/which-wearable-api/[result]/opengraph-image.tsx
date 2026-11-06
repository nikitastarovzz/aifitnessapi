import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { quizOutcomePage, quizOutcomePages } from "@/lib/wearableQuizPages";

/** The social card for one quiz result, written by `next build`. */
export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — which wearable API quiz result";

export function generateStaticParams() {
  return quizOutcomePages().map((p) => ({ result: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ result: string }> }) {
  const { result } = await params;
  const p = quizOutcomePage(result);
  return new ImageResponse(
    ogCard({
      eyebrow: "Which wearable API? · quiz result",
      title: p ? p.label : "Which wearable API should you use?",
      line: "Eight questions, one approach, every option listed with its sources",
    }),
    { ...OG_SIZE },
  );
}
