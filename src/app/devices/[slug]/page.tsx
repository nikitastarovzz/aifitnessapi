import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedDevices, getDevice, DEVICES_PATH, DEVICES_CONFIG } from "@/data/devices";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedDevices);
}

export const generateMetadata = clusterMetadata(DEVICES_PATH, getDevice);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getDevice(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={DEVICES_CONFIG} />;
}
