import type { Metadata } from "next";
import EvidenceMatrixPage from "@/components/tools/EvidenceMatrixPage";
import { GYM_API_MATRIX } from "@/data/gymApiMatrix";
import { GYM_DESCRIPTION, GYM_H1, GYM_PATH, GYM_TITLE, gymCapsule } from "@/lib/audienceTools";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";

/**
 * /tools/gym-software-api-matrix — ops/AUDIENCE-30-2026-11-05.md item 28.
 * Every cell is a row of the gym roundup's evidence file (src/data/gymApiMatrix.ts).
 */

export const metadata: Metadata = {
  title: { absolute: GYM_TITLE },
  description: GYM_DESCRIPTION,
  alternates: pageMirrorAlternates(GYM_PATH),
  openGraph: { type: "website", title: GYM_TITLE, description: GYM_DESCRIPTION, url: GYM_PATH, images: ["/opengraph-image"] },
};

export default function GymSoftwareApiMatrixPage() {
  return (
    <EvidenceMatrixPage
      matrix={GYM_API_MATRIX}
      path={GYM_PATH}
      h1={GYM_H1}
      crumb="Gym software API matrix"
      capsule={gymCapsule()}
      title={GYM_TITLE}
      description={GYM_DESCRIPTION}
      alternativeHeadline="gym and studio management software API comparison"
      rowLabel="Platform"
    />
  );
}
