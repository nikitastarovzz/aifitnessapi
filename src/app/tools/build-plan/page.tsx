import type { Metadata } from "next";
import BuildPlanTool from "@/components/tools/BuildPlanTool";
import PlannerPageShell from "@/components/tools/PlannerPageShell";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { BUILD_PLAN_PAGE as PAGE } from "@/lib/plannerPages";
import { plannerBundle } from "@/lib/plannerBundle";
import { decodePlan } from "@/lib/plannerLogic.mjs";
import { site } from "@/lib/site";

/**
 * The build-plan generator and PRD template (ops/AUDIENCE-30-2026-11-05.md
 * items 17 and 18). The server builds the data bundle from the site's own
 * modules (src/lib/plannerBundle.ts) and renders the default plan; the client
 * component re-plans in the browser as answers change and writes the spec and
 * PRD as Markdown. No API route, nothing stored.
 */

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.description,
  alternates: pageMirrorAlternates(PAGE.path),
  openGraph: {
    type: "website",
    title: PAGE.title,
    description: "Answers in, a shareable fitness-app build plan out: architecture, the APIs that fit, compliance items, store rules and a PRD template.",
    url: PAGE.path,
    images: ["/opengraph-image"],
  },
};

export default function BuildPlanPage() {
  const bundle = plannerBundle();
  const initial = decodePlan("", bundle.appTypes.map((t) => t.id));
  return (
    <PlannerPageShell page={PAGE} crumb="Build plan generator" toolId="build-plan" alternativeHeadline="fitness app PRD template and build plan generator">
      <BuildPlanTool bundle={bundle} origin={site.url} initial={initial} date={PAGE.updated} />
    </PlannerPageShell>
  );
}
