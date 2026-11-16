import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedCookbook, getRecipe, COOKBOOK_PATH, COOKBOOK_CONFIG } from "@/data/cookbook";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedCookbook);
}

export const generateMetadata = clusterMetadata(COOKBOOK_PATH, getRecipe);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getRecipe(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={COOKBOOK_CONFIG} />;
}
