import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedGuides, getGuide, GUIDES_CONFIG } from "@/data/guides";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedGuides);
}

export default clusterOgImage(GUIDES_CONFIG, getGuide);
