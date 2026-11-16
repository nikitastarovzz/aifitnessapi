import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedBuilds, getBuild, BUILD_PATH, BUILD_CONFIG } from "@/data/build";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedBuilds);
}

export const generateMetadata = clusterMetadata(BUILD_PATH, getBuild);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getBuild(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={BUILD_CONFIG} />;
}
