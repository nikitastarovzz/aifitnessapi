import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import InlineSignup from "@/components/InlineSignup";
import { releasedAlternatives, getAlternative, ALTERNATIVES_PATH, ALTERNATIVES_CONFIG } from "@/data/alternatives";
import { clusterMetadata, clusterStaticParams, type SlugParams } from "@/lib/clusterRoute";

export const dynamicParams = false;

export function generateStaticParams(): SlugParams[] {
  return clusterStaticParams(releasedAlternatives);
}

export const generateMetadata = clusterMetadata(ALTERNATIVES_PATH, getAlternative);

export default async function Page({ params }: { params: Promise<SlugParams> }) {
  const { slug } = await params;
  const entry = getAlternative(slug);
  if (!entry) notFound();
  return (
    <ClusterPage
      entry={entry}
      config={ALTERNATIVES_CONFIG}
      signup={<InlineSignup pitch={entry.cta.pitch} section="alternatives" />}
    />
  );
}
