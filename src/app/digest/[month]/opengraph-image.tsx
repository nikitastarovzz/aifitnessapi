import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { digests, getDigest } from "@/data/digest";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI digest";

export function generateStaticParams() {
  return digests().map((d) => ({ month: d.month }));
}

export default async function Image({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const d = getDigest(month);
  return new ImageResponse(
    ogCard({
      eyebrow: "Digest",
      title: d?.label ?? "AIFitnessAPI digest",
      line: d
        ? `${d.changes.length} tracked change${d.changes.length === 1 ? "" : "s"} · ${d.pages.length} pages verified`
        : undefined,
    }),
    { ...OG_SIZE },
  );
}
