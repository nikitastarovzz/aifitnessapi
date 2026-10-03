import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { LIBRARY_COMPARISONS, getLibraryComparison } from "@/data/librariesEditorial";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return LIBRARY_COMPARISONS.map((c) => ({ pair: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const c = getLibraryComparison(pair);
  return new ImageResponse(
    ogCard({
      eyebrow: "Library comparison",
      title: c?.h1 ?? "AIFitnessAPI",
      line: c ? "Registry facts side by side, from npm, pub.dev and PyPI" : undefined,
    }),
    { ...OG_SIZE },
  );
}
