import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { hkPageIdentifiers, getHkIdentifierPage, hkSlug, hkFamilyNoun, iosEntry } from "@/data/hkIdentifierPages";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return hkPageIdentifiers().map((id) => ({ case: hkSlug(id.case) }));
}

export default async function Image({ params }: { params: Promise<{ case: string }> }) {
  const { case: slug } = await params;
  const id = getHkIdentifierPage(slug);
  const ios = id ? iosEntry(id)?.introducedAt : null;
  const line = id
    ? [
        id.family === "quantity" && id.aggregation ? id.aggregation : null,
        id.family === "quantity" && id.unitFamily ? `${id.unitFamily} units` : null,
        id.family === "category" ? id.valueEnum : null,
        ios ? `iOS ${ios}+` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : undefined;
  return new ImageResponse(
    ogCard({
      eyebrow: id ? `HealthKit · ${hkFamilyNoun(id)}` : "HealthKit reference",
      title: id?.case ?? "AIFitnessAPI",
      line,
    }),
    { ...OG_SIZE },
  );
}
