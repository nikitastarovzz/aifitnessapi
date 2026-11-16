import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { releasedMigrate, getMigration, MIGRATE_PATH, MIGRATE_CONFIG } from "@/data/migrate";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedMigrate);
}

export const generateMetadata = clusterMetadata(MIGRATE_PATH, getMigration);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getMigration(slug);
  if (!entry) notFound();
  return <ClusterPage entry={entry} config={MIGRATE_CONFIG} />;
}
