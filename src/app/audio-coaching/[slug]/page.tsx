import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedAudioCoaching, getAudioCoaching, AUDIO_PATH, AUDIO_CONFIG } from "@/data/audioCoaching";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedAudioCoaching);
}

export const generateMetadata = clusterMetadata(AUDIO_PATH, getAudioCoaching);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getAudioCoaching(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={AUDIO_CONFIG} />;
}
