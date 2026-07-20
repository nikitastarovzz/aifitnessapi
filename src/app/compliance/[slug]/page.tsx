import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import {
  releasedCompliance,
  getCompliance,
  clampTitle,
  clampDescription,
  COMPLIANCE_PATH,
  COMPLIANCE_CONFIG,
} from "@/data/compliance";

export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return releasedCompliance().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCompliance(slug);
  if (!entry) return {};
  const canonical = `${COMPLIANCE_PATH}/${entry.slug}`;
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
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = getCompliance(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={COMPLIANCE_CONFIG} />;
}
