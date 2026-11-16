import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedAccessibility, getAccessibility, A11Y_PATH, A11Y_CONFIG } from "@/data/accessibility";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedAccessibility);
}

export const generateMetadata = clusterMetadata(A11Y_PATH, getAccessibility);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getAccessibility(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={A11Y_CONFIG} />;
}
