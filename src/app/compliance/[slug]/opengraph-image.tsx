import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedCompliance, getCompliance, COMPLIANCE_CONFIG } from "@/data/compliance";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedCompliance);
}

export default clusterOgImage(COMPLIANCE_CONFIG, getCompliance);
