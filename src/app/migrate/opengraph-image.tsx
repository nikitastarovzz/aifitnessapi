import { OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { releasedMigrate, MIGRATE_CONFIG } from "@/data/migrate";
import { clusterHubOgImage } from "@/lib/clusterOgImage";

/** Hub social card (src/lib/clusterOgImage.ts): the supporting line counts the
 *  released pages at build time, so it can never claim more than the cluster ships. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Fitness & Health API Migration Guides";

export default clusterHubOgImage(MIGRATE_CONFIG, releasedMigrate, alt);
