import type { Metadata } from "next";
import EvidenceMatrixPage from "@/components/tools/EvidenceMatrixPage";
import { RESEARCH_PLATFORM_MATRIX } from "@/data/researchPlatformMatrix";
import { RESEARCH_DESCRIPTION, RESEARCH_H1, RESEARCH_PATH, RESEARCH_TITLE, researchCapsule } from "@/lib/audienceTools";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";

/**
 * /tools/research-platform-chooser — ops/AUDIENCE-30-2026-11-05.md item 29.
 * Every cell is a row of the research-platforms roundup's evidence file
 * (src/data/researchPlatformMatrix.ts), each quote re-found in its live
 * source on 2026-11-05.
 */

export const metadata: Metadata = {
  title: { absolute: RESEARCH_TITLE },
  description: RESEARCH_DESCRIPTION,
  alternates: pageMirrorAlternates(RESEARCH_PATH),
  openGraph: { type: "website", title: RESEARCH_TITLE, description: RESEARCH_DESCRIPTION, url: RESEARCH_PATH, images: ["/opengraph-image"] },
};

export default function ResearchPlatformChooserPage() {
  return (
    <EvidenceMatrixPage
      matrix={RESEARCH_PLATFORM_MATRIX}
      path={RESEARCH_PATH}
      h1={RESEARCH_H1}
      crumb="Research platform chooser"
      capsule={researchCapsule()}
      title={RESEARCH_TITLE}
      description={RESEARCH_DESCRIPTION}
      alternativeHeadline="wearable research data platform comparison"
      rowLabel="Platform"
    />
  );
}
