import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteUrl } from "@/lib/site";
import { GROUPS, termId } from "@/data/glossary";

const PATH = "/glossary";
const UPDATED = "2026-07-31";

export const metadata: Metadata = {
  title: "Fitness & Health API Glossary",
  description:
    "Every term you hit building a fitness app, defined in one or two honest sentences and linked to the page that treats it properly.",
  alternates: { canonical: PATH },
};

/**
 * One page, every term, one link each. Definitions are compressed from the
 * site's own already-verified pages — this page introduces no new factual
 * claim, so it cannot rot independently of the pages it links. Emitted as a
 * DefinedTermSet for machine citation, and a cheap internal-linking hub.
 */




const alpha = GROUPS.flatMap((g) => g.terms)
  .map((t) => t.term)
  .sort((a, b) => a.localeCompare(b));

export default function GlossaryPage() {
  const url = absoluteUrl(PATH);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Fitness & Health API Glossary",
    url,
    hasDefinedTerm: GROUPS.flatMap((g) =>
      g.terms.map((t) => ({
        "@type": "DefinedTerm",
        "@id": termId(t.term),
        name: t.term,
        description: t.def,
        url: absoluteUrl(t.href),
      })),
    ),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Glossary", path: PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitness &amp; Health API Glossary
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
          Every term you hit building a health or fitness product, in one or two honest sentences —
          each linked to the page that treats it properly. {alpha.length} terms and counting; nothing
          here is a claim we don&rsquo;t back on its own page.
        </p>

        <div className="mt-12 space-y-12">
          {GROUPS.map((g) => (
            <section key={g.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">{g.title}</h2>
              <dl className="mt-5 divide-y divide-[var(--border)]">
                {g.terms.map((t) => (
                  <div key={t.term} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6">
                    <dt className="font-semibold text-[var(--fg)]">
                      <Link href={t.href} className="hover:text-brand-600">{t.term}</Link>
                    </dt>
                    <dd className="text-sm leading-relaxed text-[var(--muted)]">{t.def}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <p className="mt-12 text-sm text-[var(--muted)]">
          Missing a term? Tell us what tripped you up and we&rsquo;ll add it — the definition will link
          to a page that earns it. Last reviewed {UPDATED}.
        </p>
      </div>
    </Container>
  );
}
