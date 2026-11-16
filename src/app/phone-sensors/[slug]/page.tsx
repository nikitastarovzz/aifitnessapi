import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedPhoneSensors, getPhoneSensor, SENSORS_PATH, SENSORS_CONFIG } from "@/data/phoneSensors";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedPhoneSensors);
}

export const generateMetadata = clusterMetadata(SENSORS_PATH, getPhoneSensor);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getPhoneSensor(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={SENSORS_CONFIG} />;
}
