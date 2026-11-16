import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedOwnYourData, getOwnYourData, OWN_DATA_PATH, OWN_DATA_CONFIG } from "@/data/ownYourData";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedOwnYourData);
}

export const generateMetadata = clusterMetadata(OWN_DATA_PATH, getOwnYourData);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getOwnYourData(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={OWN_DATA_CONFIG} />;
}
