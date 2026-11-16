import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedDevices, getDevice, DEVICES_CONFIG } from "@/data/devices";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedDevices);
}

export default clusterOgImage(DEVICES_CONFIG, getDevice);
