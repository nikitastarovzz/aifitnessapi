import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedHealthConnectApi, getHealthConnectApi, HCAPI_CONFIG } from "@/data/healthConnectApi";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return releasedHealthConnectApi().map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getHealthConnectApi(slug);
  return new ImageResponse(
    ogCard({
      eyebrow: HCAPI_CONFIG.hubLabel,
      title: entry?.h1 ?? "AIFitnessAPI",
      line: entry?.primaryQuery,
    }),
    { ...OG_SIZE },
  );
}
