import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { orderedRecords, getRecord, shortPermission } from "@/data/hcPages";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return orderedRecords().map((r) => ({ record: r.slug }));
}

export default async function Image({ params }: { params: Promise<{ record: string }> }) {
  const { record } = await params;
  const r = getRecord(record);
  return new ImageResponse(
    ogCard({
      eyebrow: r?.category ? `Health Connect · ${r.category}` : "Health Connect reference",
      title: r?.className ?? "AIFitnessAPI",
      line: r ? `${r.readPermissions.map(shortPermission).join(", ")} · ${r.properties.length} fields` : undefined,
    }),
    { ...OG_SIZE },
  );
}
