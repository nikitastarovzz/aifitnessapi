import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedData, getDataPage, DATA_CONFIG } from "@/data/healthData";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedData);
}

export default clusterOgImage(DATA_CONFIG, getDataPage);
