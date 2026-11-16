import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedHealthkitQueries, getHealthkitQuery, HKQ_PATH, HKQ_CONFIG } from "@/data/healthkitQueries";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedHealthkitQueries);
}

export const generateMetadata = clusterMetadata(HKQ_PATH, getHealthkitQuery);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getHealthkitQuery(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={HKQ_CONFIG} />;
}
