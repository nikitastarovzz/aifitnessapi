import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE } from "@/lib/og-card";
import type { ClusterConfig, ClusterEntry } from "@/lib/cluster";
import type { SlugParams } from "@/lib/clusterRoute";

/** The default export of every cluster's `[slug]/opengraph-image.tsx`. Kept
 *  apart from ./clusterRoute so page bundles do not pull in `next/og`. */
export function clusterOgImage(
  config: ClusterConfig,
  get: (slug: string) => ClusterEntry | undefined,
) {
  return async function Image({ params }: { params: Promise<SlugParams> }) {
    const { slug } = await params;
    const entry = get(slug);
    return new ImageResponse(
      ogCard({
        eyebrow: config.hubLabel,
        title: entry?.h1 ?? "AIFitnessAPI",
        line: entry?.primaryQuery,
      }),
      { ...OG_SIZE },
    );
  };
}
