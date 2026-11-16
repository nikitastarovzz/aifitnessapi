import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedHealthConnectApi, getHealthConnectApi, HCAPI_CONFIG } from "@/data/healthConnectApi";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedHealthConnectApi);
}

export default clusterOgImage(HCAPI_CONFIG, getHealthConnectApi);
