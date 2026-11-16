import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedTesting, getTesting, TEST_PATH, TEST_CONFIG } from "@/data/testing";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedTesting);
}

export const generateMetadata = clusterMetadata(TEST_PATH, getTesting);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getTesting(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={TEST_CONFIG} />;
}
