import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { clampTitle, clampDescription } from "@/lib/cluster";
import { site } from "@/lib/site";
import {
  ptPages,
  ptEntry,
  ptView,
  ptConfig,
  ptOgImage,
  PT,
} from "@/lib/translations";

/**
 * The Brazilian Portuguese edition of a cluster spoke (src/lib/translations.ts).
 * One route for every translated cluster: the English address with /pt-br in
 * front. Only translations whose English page exists are built.
 */
export const dynamicParams = false;

type Params = { cluster: string; slug: string };

export function generateStaticParams(): Params[] {
  return ptPages().map((p) => ({ cluster: p.basePath.slice(1), slug: p.slug }));
}

function find(cluster: string, slug: string) {
  return ptPages().find((p) => p.basePath === `/${cluster}` && p.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { cluster, slug } = await params;
  const p = find(cluster, slug);
  if (!p) return {};
  const canonical = p.t.path;
  const title = clampTitle(p.t.metaTitle);
  const description = clampDescription(p.t.metaDescription);
  const current = p.status === "current";
  const image = ptOgImage(p);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      // Only a current translation is offered as the English page's
      // equivalent; a stale one names neither itself nor the English page.
      ...(current
        ? { languages: { en: p.t.enPath, "pt-BR": canonical, "x-default": p.t.enPath } }
        : {}),
    },
    // A stale translation stays readable (with its notice) but asks not to
    // be indexed; following its links is still fine.
    ...(current ? {} : { robots: { index: false, follow: true } }),
    // Replaces the layout's openGraph whole, so type and image are restated.
    openGraph: {
      type: "article",
      siteName: site.name,
      locale: PT.ogLocale,
      title,
      description,
      url: canonical,
      publishedTime: p.t.translatedOn,
      modifiedTime: p.t.translatedOn,
      images: [{ url: image, width: 1200, height: 630, alt: p.t.h1 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { cluster, slug } = await params;
  const p = find(cluster, slug);
  if (!p) notFound();
  return (
    <div data-ptbr-status={p.status} data-ptbr-hash={p.t.sourceHash} data-ptbr-current-hash={p.currentHash}>
      <ClusterPage entry={ptEntry(p)} config={ptConfig(p)} translation={ptView(p)} sourceBody={p.en.body} />
    </div>
  );
}
