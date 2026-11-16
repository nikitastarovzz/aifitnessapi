import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedPricing, getPricing, PRICING_CONFIG } from "@/data/pricing";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedPricing);
}

export default clusterOgImage(PRICING_CONFIG, getPricing);
