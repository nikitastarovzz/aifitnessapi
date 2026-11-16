import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedGuides, getGuide, GUIDES_PATH, GUIDES_CONFIG } from "@/data/guides";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedGuides);
}

export const generateMetadata = clusterMetadata(GUIDES_PATH, getGuide);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getGuide(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={GUIDES_CONFIG} />;
}
