import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedArchitecture, getArchitecture, ARCHITECTURE_PATH, ARCHITECTURE_CONFIG } from "@/data/architecture";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedArchitecture);
}

export const generateMetadata = clusterMetadata(ARCHITECTURE_PATH, getArchitecture);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getArchitecture(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={ARCHITECTURE_CONFIG} />;
}
