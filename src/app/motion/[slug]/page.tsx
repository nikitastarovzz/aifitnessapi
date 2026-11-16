import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedMotion, getMotion, MOTION_PATH, MOTION_CONFIG } from "@/data/motion";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedMotion);
}

export const generateMetadata = clusterMetadata(MOTION_PATH, getMotion);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getMotion(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={MOTION_CONFIG} />;
}
