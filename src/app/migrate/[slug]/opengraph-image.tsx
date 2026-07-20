import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedMigrate, getMigration, MIGRATE_CONFIG } from "@/data/migrate";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return releasedMigrate().map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getMigration(slug);
  return new ImageResponse(
    ogCard({ eyebrow: MIGRATE_CONFIG.hubLabel, title: entry?.h1 ?? "AIFitnessAPI" }),
    { ...OG_SIZE },
  );
}
