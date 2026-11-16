import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedWatchApps, getWatchApp, WATCH_PATH, WATCH_CONFIG } from "@/data/watchApps";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedWatchApps);
}

export const generateMetadata = clusterMetadata(WATCH_PATH, getWatchApp);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getWatchApp(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={WATCH_CONFIG} />;
}
