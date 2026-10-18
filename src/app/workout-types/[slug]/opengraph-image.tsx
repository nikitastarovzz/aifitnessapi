import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { PLATFORM_ORDER, WT_FETCHED, activityLabel, activityRows, getActivity, getPlatform, isPlatformSlug, matchedOf } from "@/data/workoutTypePages";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Workout types across platforms";

export function generateStaticParams() {
  return [...PLATFORM_ORDER.map((slug) => ({ slug })), ...activityRows().map((r) => ({ slug: r.slug }))];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (isPlatformSlug(slug)) {
    const p = getPlatform(slug);
    return new ImageResponse(
      ogCard({
        eyebrow: "Workout types",
        title: p ? p.enumeration : "Workout types",
        line: p ? `${p.count} on ${p.name} · ${matchedOf(slug).length} share a name elsewhere · read ${p.readOn}` : undefined,
      }),
      { ...OG_SIZE },
    );
  }
  const row = getActivity(slug);
  return new ImageResponse(
    ogCard({
      eyebrow: "Workout types",
      title: row ? activityLabel(row) : "Workout types",
      line: row ? `${row.cells.map((c) => c.name).join(" · ")} · read ${WT_FETCHED}` : undefined,
    }),
    { ...OG_SIZE },
  );
}
