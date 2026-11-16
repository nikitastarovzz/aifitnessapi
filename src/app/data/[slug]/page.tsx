import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedData, getDataPage, DATA_PATH, DATA_CONFIG } from "@/data/healthData";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedData);
}

export const generateMetadata = clusterMetadata(DATA_PATH, getDataPage);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getDataPage(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={DATA_CONFIG} />;
}
