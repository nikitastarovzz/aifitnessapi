import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedOwnYourData, getOwnYourData, OWN_DATA_CONFIG } from "@/data/ownYourData";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedOwnYourData);
}

export default clusterOgImage(OWN_DATA_CONFIG, getOwnYourData);
