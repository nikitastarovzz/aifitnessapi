import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedGuides, getGuide, GUIDES_CONFIG } from "@/data/guides";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return releasedGuides().map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getGuide(slug);
  return new ImageResponse(
    ogCard({ eyebrow: GUIDES_CONFIG.hubLabel, title: entry?.h1 ?? "AIFitnessAPI" }),
    { ...OG_SIZE },
  );
}
