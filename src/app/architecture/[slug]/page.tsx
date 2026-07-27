import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import {
  releasedArchitecture,
  getArchitecture,
  clampTitle,
  clampDescription,
  ARCHITECTURE_PATH,
  ARCHITECTURE_CONFIG,
} from "@/data/architecture";

export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return releasedArchitecture().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArchitecture(slug);
  if (!entry) return {};
  const canonical = `${ARCHITECTURE_PATH}/${entry.slug}`;
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
  const entry = getArchitecture(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={ARCHITECTURE_CONFIG} />;
}
