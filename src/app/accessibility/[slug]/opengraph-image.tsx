import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedAccessibility, getAccessibility, A11Y_CONFIG } from "@/data/accessibility";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedAccessibility);
}

export default clusterOgImage(A11Y_CONFIG, getAccessibility);
