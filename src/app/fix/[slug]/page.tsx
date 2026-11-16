import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedFixes, getFix, FIX_PATH, FIX_CONFIG } from "@/data/fix";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedFixes);
}

export const generateMetadata = clusterMetadata(FIX_PATH, getFix);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getFix(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={FIX_CONFIG} />;
}
