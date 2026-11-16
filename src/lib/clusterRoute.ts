import type { Metadata } from "next";
import { clampTitle, clampDescription, type ClusterEntry } from "@/lib/cluster";
import { robotsFor } from "@/data/noindex";
import { languageAlternates } from "@/lib/translations";

/**
 * Shared route helpers for every cluster's `[slug]/page.tsx` and
 * `[slug]/opengraph-image.tsx`. The OG image helper lives in
 * ./clusterOgImage so page bundles never import `next/og`.
 */

export type SlugParams = { slug: string };

export function clusterStaticParams(released: () => ClusterEntry[]): SlugParams[] {
  return released().map((e) => ({ slug: e.slug }));
}

export function clusterMetadata(
  basePath: string,
  get: (slug: string) => ClusterEntry | undefined,
) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<SlugParams>;
  }): Promise<Metadata> {
    const { slug } = await params;
    const entry = get(slug);
    if (!entry) return {};
    const canonical = `${basePath}/${entry.slug}`;
    const title = clampTitle(entry.metaTitle);
    const description = clampDescription(entry.metaDescription);
    return {
      title: { absolute: title },
      description,
      // hreflang to the Portuguese edition, only while it is current; `{}`
      // for a page with no current translation.
      alternates: { canonical, ...languageAlternates(canonical) },
      ...robotsFor(canonical),
      openGraph: {
        type: "article",
        title,
        description,
        url: canonical,
        publishedTime: entry.updated,
        modifiedTime: entry.updated,
      },
      twitter: { card: "summary_large_image", title, description },
    };
  };
}
