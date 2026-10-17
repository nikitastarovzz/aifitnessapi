import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { hsPageTypes, getHsDataTypePage, hsSlug } from "@/data/hsDataTypePages";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return hsPageTypes().map((t) => ({ name: hsSlug(t.name) }));
}

export default async function Image({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const t = getHsDataTypePage(name);
  return new ImageResponse(
    ogCard({
      eyebrow: "Wear OS · Health Services",
      title: t ? `DataType.${t.name}` : "AIFitnessAPI",
      line: t ? `${t.kotlinType}${t.permission ? ` · ${t.permission}` : ""}` : undefined,
    }),
    { ...OG_SIZE },
  );
}
