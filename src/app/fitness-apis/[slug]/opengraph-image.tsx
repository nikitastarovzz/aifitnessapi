import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedEntries, getEntry, FITNESS_APIS_CONFIG } from "@/data/fitnessApis";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedEntries);
}

export default clusterOgImage(FITNESS_APIS_CONFIG, getEntry);
