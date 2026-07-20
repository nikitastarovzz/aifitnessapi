import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedEntries, getEntry, FITNESS_APIS_CONFIG } from "@/data/fitnessApis";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return releasedEntries().map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  return new ImageResponse(
    ogCard({ eyebrow: FITNESS_APIS_CONFIG.hubLabel, title: entry?.h1 ?? "AIFitnessAPI" }),
    { ...OG_SIZE },
  );
}
