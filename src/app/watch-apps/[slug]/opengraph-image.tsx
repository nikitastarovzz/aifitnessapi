import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedWatchApps, getWatchApp, WATCH_CONFIG } from "@/data/watchApps";
import { clusterStaticParams } from "@/lib/clusterRoute";
import { clusterOgImage } from "@/lib/clusterOgImage";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI";

export function generateStaticParams() {
  return clusterStaticParams(releasedWatchApps);
}

export default clusterOgImage(WATCH_CONFIG, getWatchApp);
