import type { Metadata } from "next";
import Link from "next/link";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import ResearchStudy from "@/components/ResearchStudy";
import ResearchTable from "@/components/ResearchTable";
import { StackedBars } from "@/components/ResearchCharts";
import { PRICING_ROWS } from "@/data/researchStudies";
import { PRICING_CLASS_ORDER } from "@/lib/researchStats.mjs";
import { PRICING_CLASS_LABEL, PRICING_PATH_R, PRICING_DISCLOSURE, pricingFindings, pricingStudy } from "@/lib/researchPages";

/**
 * /research/pricing-transparency — which vendors on the /pricing pages publish
 * a price, name one without a price, or are free (ops/VIRAL-20-2026-11-06.md
 * item 3). Rows: src/data/researchStudies.ts (scripts/build-research.mjs, from
 * ops/research/pricing-transparency.json checked against the evidence files);
 * figures: src/lib/researchStats.mjs.
 */

const study = pricingStudy();

export const metadata: Metadata = {
  title: { absolute: study.metaTitle },
  description: study.description,
  alternates: pageMirrorAlternates(PRICING_PATH_R),
  openGraph: { type: "article", title: study.h1, description: study.description, url: PRICING_PATH_R },
};

export default function PricingTransparencyPage() {
  const f = pricingFindings();
  const h2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";
  const p = "mt-3 leading-relaxed text-[var(--muted)]";
  const link = "font-medium text-brand-600 hover:text-brand-500";
  const legend = PRICING_CLASS_ORDER.map((c) => PRICING_CLASS_LABEL[c]);
  return (
    <ResearchStudy
      study={study}
      rows={PRICING_ROWS.length}
      disclosure={
        <aside
          className="mt-8 rounded-2xl border border-amber-400/40 bg-amber-500/5 p-5 text-sm leading-relaxed text-[var(--fg)]"
          data-research-disclosure
        >
          <p className="font-semibold">{PRICING_DISCLOSURE.title}</p>
          <p className="mt-1 text-[var(--muted)]">
            {PRICING_DISCLOSURE.text}{" "}
            <Link href="/about#funding" className={link}>
              How we stay independent →
            </Link>
          </p>
        </aside>
      }
    >
      <section className="mt-12" id="by-category">
        <h2 className={h2}>By category</h2>
        <p className={p}>{f.categoryIntro}</p>
        <StackedBars
          id="pricing-by-category"
          title="Vendors by category: publishes a price, no published price, free"
          legend={legend}
          rows={f.byCategory.map((c) => ({ label: c.label, parts: PRICING_CLASS_ORDER.map((k) => c[k]) }))}
        />
        <ResearchTable
          caption="Vendors by category and class"
          head={["Category", ...legend, "Counted"]}
          rows={f.byCategory.map((c) => [c.label, ...PRICING_CLASS_ORDER.map((k) => c[k]), c.total])}
        />
      </section>

      <section className="mt-12" id="vendors">
        <h2 className={h2}>Every vendor, with its line</h2>
        <p className={p}>{f.vendorsIntro}</p>
        <ResearchTable
          caption="Every counted vendor"
          head={["Vendor", "Category", "Class", "The vendor's line", "Free plan or trial", "Tier with no price"]}
          rows={f.vendors.map((r) => [
            <Link key="v" href={r.pricingPage} className={link}>
              {r.vendor}
            </Link>,
            r.categoryLabel,
            r.classLabel,
            <a key="l" href={r.url as string} className="text-[var(--fg)] hover:text-brand-600">
              “{r.line}”
            </a>,
            r.freeEntry ? `“${r.freeEntry}”` : "",
            r.unpricedTier ? `“${r.unpricedTier}”` : "",
          ])}
        />
      </section>

      <section className="mt-12" id="not-counted">
        <h2 className={h2}>Not counted</h2>
        <p className={p}>{f.excludedIntro}</p>
        <ResearchTable
          caption="Vendors listed but not counted"
          head={["Vendor", "Category", "Reason"]}
          rows={f.excluded.map((r) => [
            <Link key="v" href={r.pricingPage} className={link}>
              {r.vendor}
            </Link>,
            r.categoryLabel,
            r.excluded,
          ])}
        />
      </section>
    </ResearchStudy>
  );
}
