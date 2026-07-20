import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import {
  releasedAlternatives,
  getAlternative,
  clampTitle,
  clampDescription,
  ALTERNATIVES_PATH,
  ALTERNATIVES_CONFIG,
} from "@/data/alternatives";

export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return releasedAlternatives().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getAlternative(slug);
  if (!entry) return {};
  const canonical = `${ALTERNATIVES_PATH}/${entry.slug}`;
  const title = clampTitle(entry.metaTitle);
  const description = clampDescription(entry.metaDescription);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
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
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = getAlternative(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={ALTERNATIVES_CONFIG} />;
}
