import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { familyLabel, familyOf, getType, opNames, typeParams } from "@/data/ghapiPages";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return typeParams();
}

export default async function Image({ params }: { params: Promise<{ dataType: string }> }) {
  const { dataType } = await params;
  const t = getType(dataType);
  return new ImageResponse(
    ogCard({
      eyebrow: t ? `Google Health API · ${familyLabel(familyOf(t))}` : "Google Health API reference",
      title: t ? `${t.name} (${t.dataType})` : "AIFitnessAPI",
      line: t ? `${t.recordType} · ${opNames(t).join(", ")}` : undefined,
    }),
    { ...OG_SIZE },
  );
}
