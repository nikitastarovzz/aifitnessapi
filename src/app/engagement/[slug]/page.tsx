import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedEngagement, getEngagement, ENGAGEMENT_PATH, ENGAGEMENT_CONFIG } from "@/data/engagement";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedEngagement);
}

export const generateMetadata = clusterMetadata(ENGAGEMENT_PATH, getEngagement);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getEngagement(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={ENGAGEMENT_CONFIG} />;
}
