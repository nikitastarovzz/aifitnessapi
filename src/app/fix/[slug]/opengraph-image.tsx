import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedFixes, getFix, FIX_CONFIG } from "@/data/fix";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedFixes);
}

export default clusterOgImage(FIX_CONFIG, getFix);
