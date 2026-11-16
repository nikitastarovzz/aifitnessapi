import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedLearn, getLearn, LEARN_PATH, LEARN_CONFIG } from "@/data/learn";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedLearn);
}

export const generateMetadata = clusterMetadata(LEARN_PATH, getLearn);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getLearn(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={LEARN_CONFIG} />;
}
