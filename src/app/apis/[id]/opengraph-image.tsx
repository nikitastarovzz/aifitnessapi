import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { API_ENTRIES, getApi, DEV_COST_LABELS } from "@/data/apis";
import { pageCount } from "@/lib/apiCoverage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return API_ENTRIES.map((a) => ({ id: a.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const api = getApi(id);
  return new ImageResponse(
    ogCard({
      eyebrow: "API directory",
      title: api?.label ?? "AIFitnessAPI",
      line: api
        ? `${DEV_COST_LABELS[api.devCost]}${api.approvalGate ? " · approval gate" : ""} · ${pageCount(api.id)} pages here`
        : undefined,
    }),
    { ...OG_SIZE },
  );
}
