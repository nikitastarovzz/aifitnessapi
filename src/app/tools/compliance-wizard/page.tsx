import type { Metadata } from "next";
import ComplianceWizardTool from "@/components/tools/ComplianceWizardTool";
import PlannerPageShell from "@/components/tools/PlannerPageShell";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { COMPLIANCE_WIZARD_PAGE as PAGE } from "@/lib/plannerPages";
import { plannerBundle } from "@/lib/plannerBundle";
import { site } from "@/lib/site";

/**
 * The compliance wizard (ops/AUDIENCE-30-2026-11-05.md item 20). Answers route
 * to regimes whose statements are quoted from HHS, the FTC, the eCFR, the GDPR
 * text, Washington's code and AG, the FDA and the stores
 * (src/data/plannerSources.mjs, evidence in
 * ops/sources/evidence/tools-compliance-wizard.json). Not legal advice.
 */

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.description,
  alternates: pageMirrorAlternates(PAGE.path),
  openGraph: {
    type: "website",
    title: PAGE.title,
    description: "Which health-data rules likely apply to your fitness or health app, each quoted from HHS, the FTC, the GDPR, Washington, the FDA or the stores.",
    url: PAGE.path,
    images: ["/opengraph-image"],
  },
};

export default function ComplianceWizardPage() {
  const b = plannerBundle();
  return (
    <PlannerPageShell page={PAGE} crumb="Compliance wizard" toolId="compliance-wizard" alternativeHeadline="does HIPAA, GDPR or the FTC Health Breach Notification Rule apply to my app">
      <ComplianceWizardTool regimes={b.regimes} sources={b.sources} pageLabels={b.labels} origin={site.url} />
    </PlannerPageShell>
  );
}
