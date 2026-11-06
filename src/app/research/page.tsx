import type { Metadata } from "next";
import Link from "next/link";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { shortDate } from "@/lib/ecosystemDerive";
import { HUB, HUB_FAQS, HUB_OTHER, RESEARCH_PATH, hubCapsule, hubDataDate, studies } from "@/lib/researchPages";

/**
 * /research — the hub for the site's original studies
 * (ops/VIRAL-20-2026-11-06.md items 1-3). Each card shows the study's first
 * two headline figures, computed as the study page computes them.
 */

export const metadata: Metadata = {
  title: { absolute: HUB.metaTitle },
  description: HUB.description,
  alternates: pageMirrorAlternates(RESEARCH_PATH),
  openGraph: { type: "website", title: HUB.h1, description: HUB.description, url: RESEARCH_PATH },
};

export default function ResearchHub() {
  const url = absoluteUrl(RESEARCH_PATH);
  const all = studies();
  const date = hubDataDate();
  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: HUB.h1,
    description: HUB.description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    dateModified: date,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(s.path), name: s.h1 })),
    },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HUB_FAQS.map((f, i) => ({
      "@type": "Question",
      name: f.q,
      url: `${url}#faq-${i + 1}`,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };
  const link = "font-medium text-brand-600 hover:text-brand-500";
  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Research", path: RESEARCH_PATH }]} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{HUB.h1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {all.length} studies · newest data read {shortDate(date)}
        </p>
        <AnswerCapsule>{hubCapsule()}</AnswerCapsule>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The studies</h2>
          <ul className="mt-6 space-y-5">
            {all.map((s) => (
              <li key={s.id} className="rounded-2xl border border-[var(--border)] p-6">
                <h3 className="text-xl font-semibold text-[var(--fg)]">
                  <Link href={s.path} className="hover:text-brand-600">
                    {s.h1}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{s.description}</p>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {s.headlines.slice(0, 2).map((h) => (
                    <div key={h.id}>
                      <dt className="text-2xl font-bold text-[var(--fg)]">{h.value}</dt>
                      <dd className="text-sm text-[var(--muted)]">{h.label}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-[var(--muted)]">{s.dataDateLabel}</p>
                <Link href={s.path} className={`mt-2 inline-block text-sm ${link}`}>
                  Read the study →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How these are made</h2>
          <div className="mt-4 space-y-3 leading-relaxed text-[var(--muted)]">
            {HUB_OTHER.how.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Other numbers on this site</h2>
          <ul className="mt-4 space-y-2 leading-relaxed text-[var(--muted)]">
            {HUB_OTHER.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
                : {l.text}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" id="faq">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-[var(--border)]">
            {HUB_FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <h3 className="text-base font-semibold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
