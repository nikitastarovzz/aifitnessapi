import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { getWeek, weekHeading, weeks } from "@/lib/weekly";
import { joinList, weekSummaryParts } from "@/lib/weeklyCore.mjs";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI weekly roundup";

export function generateStaticParams() {
  return weeks().map((w) => ({ week: w.id }));
}

export default async function Image({ params }: { params: Promise<{ week: string }> }) {
  const { week } = await params;
  const w = getWeek(week);
  return new ImageResponse(
    ogCard({
      eyebrow: w ? `Weekly roundup · ${w.range}` : "Weekly roundup",
      title: w ? weekHeading(w) : "The week in fitness APIs",
      line: w ? joinList(weekSummaryParts(w.counts)) : undefined,
    }),
    { ...OG_SIZE },
  );
}
