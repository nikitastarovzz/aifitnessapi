import type { ReactNode } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ToolNextStep from "@/components/ToolNextStep";
import PlannerProse from "@/components/tools/PlannerProse";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";
import type { PlannerPage } from "@/lib/plannerPages";

/**
 * The frame the three planning tools share: breadcrumbs, H1, the answer
 * capsule, the interactive tool inside data-tool, the static sections from
 * src/lib/plannerPages.ts and the next-step block.
 */
export default function PlannerPageShell({
  page,
  crumb,
  toolId,
  alternativeHeadline,
  children,
}: {
  page: PlannerPage;
  crumb: string;
  toolId: string;
  alternativeHeadline: string;
  children: ReactNode;
}) {
  const jsonLd = toolGraph({
    path: page.path,
    name: page.title,
    alternativeHeadline,
    description: page.description,
    datePublished: page.updated,
    dateModified: page.updated,
    webPage: { lastReviewed: page.updated },
  });
  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: crumb, path: page.path },
          ]}
        />
        <ClusterHero label="Free Tool" seed={6} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{page.h1}</h1>
        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {page.capsule}
        </p>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Sources read {page.updated}. Not legal advice.
        </p>

        <section data-tool={toolId} aria-label={crumb} className="mt-8">
          {children}
        </section>

        <PlannerProse sections={page.sections} />

        <ToolNextStep path={page.path} />

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. More at{" "}
          <Link href="/tools" className="font-medium text-brand-600 hover:text-brand-500">
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
