import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedAi, getAi, AI_PATH, AI_CONFIG } from "@/data/ai";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedAi);
}

export const generateMetadata = clusterMetadata(AI_PATH, getAi);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getAi(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={AI_CONFIG} />;
}
