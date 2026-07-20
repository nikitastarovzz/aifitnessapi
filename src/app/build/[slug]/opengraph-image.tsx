import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedBuilds, getBuild, BUILD_CONFIG } from "@/data/build";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return releasedBuilds().map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getBuild(slug);
  return new ImageResponse(
    ogCard({ eyebrow: BUILD_CONFIG.hubLabel, title: entry?.h1 ?? "AIFitnessAPI" }),
    { ...OG_SIZE },
  );
}
