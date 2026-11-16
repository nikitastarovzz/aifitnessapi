import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import InlineSignup from "@/components/InlineSignup";
import { releasedIntegrations, getIntegration, INTEGRATE_PATH, INTEGRATE_CONFIG } from "@/data/integrate";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedIntegrations);
}

export const generateMetadata = clusterMetadata(INTEGRATE_PATH, getIntegration);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getIntegration(slug);
  if (!entry) notFound();
  return (
    <ClusterPage
      entry={entry}
      config={INTEGRATE_CONFIG}
      signup={<InlineSignup pitch={entry.cta.pitch} section="integrate" />}
    />
  );
}
