import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedHealthConnectApi, getHealthConnectApi, HCAPI_PATH, HCAPI_CONFIG } from "@/data/healthConnectApi";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedHealthConnectApi);
}

export const generateMetadata = clusterMetadata(HCAPI_PATH, getHealthConnectApi);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getHealthConnectApi(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={HCAPI_CONFIG} />;
}
