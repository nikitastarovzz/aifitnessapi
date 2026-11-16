import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedEntries, getEntry, PILLAR_PATH, FITNESS_APIS_CONFIG } from "@/data/fitnessApis";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedEntries);
}

export const generateMetadata = clusterMetadata(PILLAR_PATH, getEntry);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={FITNESS_APIS_CONFIG} />;
}
