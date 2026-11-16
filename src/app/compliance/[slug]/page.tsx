import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedCompliance, getCompliance, COMPLIANCE_PATH, COMPLIANCE_CONFIG } from "@/data/compliance";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedCompliance);
}

export const generateMetadata = clusterMetadata(COMPLIANCE_PATH, getCompliance);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getCompliance(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={COMPLIANCE_CONFIG} />;
}
