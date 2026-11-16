import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import InlineSignup from "@/components/InlineSignup";
import { releasedPricing, getPricing, PRICING_PATH, PRICING_CONFIG } from "@/data/pricing";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedPricing);
}

export const generateMetadata = clusterMetadata(PRICING_PATH, getPricing);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getPricing(slug);
  if (!entry) notFound();
  return (
    <ClusterPage
      entry={entry}
      config={PRICING_CONFIG}
      signup={<InlineSignup pitch={entry.cta.pitch} section="pricing" />}
    />
  );
}
