import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { LIBRARIES } from "@/data/libraries";
import { ECOSYSTEM_LABEL } from "@/data/librariesEditorial";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return LIBRARIES.map((l) => ({ slug: l.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = LIBRARIES.find((x) => x.slug === slug);
  return new ImageResponse(
    ogCard({
      eyebrow: "Open-source library",
      title: l?.name ?? "AIFitnessAPI",
      line: l
        ? `${ECOSYSTEM_LABEL[l.ecosystem]} · latest ${l.latestVersion} (${l.latestPublished})${l.deprecated ? " · deprecated" : ""}`
        : undefined,
    }),
    { ...OG_SIZE },
  );
}
