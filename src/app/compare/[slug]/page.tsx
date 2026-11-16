import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import InlineSignup from "@/components/InlineSignup";
import { releasedCompare, getComparison, COMPARE_PATH, COMPARE_CONFIG } from "@/data/compare";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedCompare);
}

export const generateMetadata = clusterMetadata(COMPARE_PATH, getComparison);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getComparison(slug);
  if (!entry) notFound();
  return (
    <ClusterPage
      entry={entry}
      config={COMPARE_CONFIG}
      signup={<InlineSignup pitch={entry.cta.pitch} section="compare" />}
    />
  );
}
