import type { Metadata } from "next";
import Link from "next/link";
import EvidenceMatrixPage from "@/components/tools/EvidenceMatrixPage";
import { AGGREGATOR_MATRIX } from "@/data/aggregatorChooser";
import { AGG_DESCRIPTION, AGG_H1, AGG_PATH, AGG_TITLE, aggregatorCapsule, aggregatorFaqs, useCases } from "@/lib/aggregatorChooserView";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { absoluteUrl } from "@/lib/site";

/**
 * /tools/aggregator-chooser — ops/VIRAL-20-2026-11-06.md item 16.
 *
 * Search Console (Oct 28 – Nov 3) put aggregator selection at the top of the
 * site's query groups with almost no clicks, on pages whose titles are held
 * for a retitle test, so the answer is a tool rather than a retitle. Every
 * cell is a row of an existing page's evidence file
 * (src/data/aggregatorChooser.ts); the use cases and FAQ answers are built
 * from those cells (src/lib/aggregatorChooserView.ts). No vendor is crowned.
 */

export const metadata: Metadata = {
  title: { absolute: AGG_TITLE },
  description: AGG_DESCRIPTION,
  alternates: pageMirrorAlternates(AGG_PATH),
  openGraph: { type: "website", title: AGG_TITLE, description: AGG_DESCRIPTION, url: AGG_PATH, images: ["/opengraph-image"] },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function AggregatorChooserPage() {
  const faqs = aggregatorFaqs();
  const url = absoluteUrl(AGG_PATH);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#faq-${i + 1}`,
      url: `${url}#faq-${i + 1}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };

  return (
    <EvidenceMatrixPage
      matrix={AGGREGATOR_MATRIX}
      path={AGG_PATH}
      h1={AGG_H1}
      crumb="Aggregator chooser"
      capsule={aggregatorCapsule()}
      title={AGG_TITLE}
      description={AGG_DESCRIPTION}
      alternativeHeadline="health data aggregator API comparison: Terra alternatives"
      rowLabel="Aggregator"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="mt-14 max-w-4xl" aria-labelledby="use-cases">
        <h2 id="use-cases" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
          Trade-offs by use case
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--muted)]">
          No aggregator wins every case. Each case below lists what every vendor&apos;s cell says for the column that decides it, and names the
          vendors whose pages do not say. The quotes behind each line are in the table above.
        </p>
        <div className="mt-6 space-y-8">
          {useCases().map((u) => (
            <div key={u.id} id={`case-${u.id}`} className="scroll-mt-24">
              <h3 className="text-lg font-semibold text-[var(--fg)]">{u.title}</h3>
              <p className="mt-2 leading-relaxed text-[var(--muted)]">{u.intro}</p>
              {u.lines.length ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--fg)]">
                  {u.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              ) : null}
              {u.silent.length ? (
                <p className="mt-2 text-sm text-[var(--muted)]">Not stated in the pages read: {u.silent.join(", ")}.</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 max-w-4xl" aria-labelledby="faq">
        <h2 id="faq" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
          How to choose: questions
        </h2>
        <div className="mt-6 divide-y divide-[var(--border)]">
          {faqs.map((f, i) => (
            <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
              <h3 className="text-base font-semibold text-[var(--fg)]">{f.q}</h3>
              <p className="mt-2 leading-relaxed text-[var(--muted)]">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">
          Prices at your own user count:{" "}
          <Link href="/pricing/health-data-aggregator-pricing" className={linkCls}>
            health data aggregator pricing
          </Link>
          . Head to head:{" "}
          <Link href="/compare/terra-vs-rook" className={linkCls}>
            Terra vs ROOK
          </Link>
          ,{" "}
          <Link href="/compare/terra-vs-spike" className={linkCls}>
            Terra vs Spike
          </Link>
          ,{" "}
          <Link href="/compare/terra-vs-thryve" className={linkCls}>
            Terra vs Thryve
          </Link>
          ,{" "}
          <Link href="/compare/terra-vs-sahha" className={linkCls}>
            Terra vs Sahha
          </Link>
          ,{" "}
          <Link href="/compare/terra-vs-open-wearables" className={linkCls}>
            Terra vs Open Wearables
          </Link>
          ,{" "}
          <Link href="/fitness-apis/terra-vs-vital" className={linkCls}>
            Terra vs Junction (Vital)
          </Link>{" "}
          and{" "}
          <Link href="/compare/rook-vs-spike" className={linkCls}>
            ROOK vs Spike
          </Link>
          . Replacing one:{" "}
          <Link href="/alternatives/terra-alternatives" className={linkCls}>
            Terra alternatives
          </Link>
          .
        </p>
      </section>
    </EvidenceMatrixPage>
  );
}
