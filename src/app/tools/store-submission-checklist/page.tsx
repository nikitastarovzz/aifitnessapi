import type { Metadata } from "next";
import StoreChecklistTool from "@/components/tools/StoreChecklistTool";
import PrivacyLabelHelper from "@/components/tools/PrivacyLabelHelper";
import PlannerPageShell from "@/components/tools/PlannerPageShell";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { STORE_CHECKLIST_PAGE as PAGE } from "@/lib/plannerPages";
import { plannerBundle } from "@/lib/plannerBundle";
import { site } from "@/lib/site";

/**
 * The App Store / Google Play submission checklist (ops/AUDIENCE-30-2026-11-05.md
 * item 19). Every item is quoted from the store's own page
 * (src/data/plannerSources.mjs, evidence in
 * ops/sources/evidence/tools-store-submission-checklist.json). Progress is kept
 * in the reader's localStorage only.
 *
 * Below it, the privacy label helper (2026-11-24): the Apple App Privacy and
 * Google Play Data safety data types to declare for what the app collects,
 * each quoted from the platform's page (src/data/privacyLabels.mjs, evidence
 * in the same file). It runs in the browser; the ticks live in the address
 * hash.
 */

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.description,
  alternates: pageMirrorAlternates(PAGE.path),
  openGraph: {
    type: "website",
    title: PAGE.title,
    description: "App Review Guidelines and Google Play health policies, quoted item by item, narrowed to what your app does, with progress saved in your browser.",
    url: PAGE.path,
    images: ["/opengraph-image"],
  },
};

export default function StoreChecklistPage() {
  const b = plannerBundle();
  return (
    <PlannerPageShell page={PAGE} crumb="Store submission checklist" toolId="store-submission-checklist" alternativeHeadline="App Store and Google Play review checklist for health and fitness apps">
      <StoreChecklistTool items={b.storeItems} sources={b.sources} traitLabels={b.traitLabels} pageLabels={b.labels} origin={site.url} />
      <PrivacyLabelHelper />
    </PlannerPageShell>
  );
}
