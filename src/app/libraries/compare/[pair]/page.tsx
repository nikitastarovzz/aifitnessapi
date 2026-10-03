import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ContentAge from "@/components/ContentAge";
import AnswerCapsule from "@/components/AnswerCapsule";
import { LIBRARIES_FETCHED_ON, type Library } from "@/data/libraries";
import {
  LIBRARIES_BASE,
  LIBRARIES_PUBLISHED,
  LIBRARIES_VERIFIED_ON,
  LIBRARY_COMPARISONS,
  ECOSYSTEM_LABEL,
  getLibraryComparison,
  lib,
  librariesModified,
} from "@/data/librariesEditorial";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";
import { NoteItem, githubUrl, sinceRead } from "../../_shared";

/**
 * Two packages that answer the same need on the same platform, side by side.
 *
 * Only real choices get a page: same framework, same store or vendor API.
 * The table is rendered from the generated registry data; the points are
 * each README's own statements; the "how to choose" list is labelled as our
 * reading of those facts. There is deliberately no winner row — a verdict
 * beyond what the dates, licences and READMEs show would be invented.
 */

export const dynamicParams = false;

type Params = { pair: string };

export function generateStaticParams(): Params[] {
  return LIBRARY_COMPARISONS.map((c) => ({ pair: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { pair } = await params;
  const c = getLibraryComparison(pair);
  if (!c) return {};
  const canonical = `${LIBRARIES_BASE}/compare/${c.slug}`;
  return {
    title: { absolute: c.title },
    description: c.metaDescription,
    alternates: { canonical },
    openGraph: { type: "article", title: c.title, description: c.metaDescription, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.metaDescription },
  };
}

type Row = { label: string; cell: (l: Library) => string };

const ROWS: Row[] = [
  { label: "Registry", cell: (l) => `${ECOSYSTEM_LABEL[l.ecosystem]}: ${l.name}` },
  { label: "Latest version", cell: (l) => l.latestVersion },
  { label: "Latest published", cell: (l) => `${l.latestPublished} (${sinceRead(l.latestPublished)})` },
  { label: "First published", cell: (l) => l.firstPublished },
  { label: "Versions published", cell: (l) => String(l.versionCount) },
  { label: "Licence", cell: (l) => (l.license ? `${l.license} (${l.licenseEvidence})` : "not stated") },
  {
    label: "Platforms",
    cell: (l) => (l.platforms ? `${l.platforms.join(", ")} (${l.platformsEvidence})` : "not stated in registry metadata"),
  },
  {
    label: "Requires",
    cell: (l) =>
      l.requires
        ? `${Object.entries(l.requires)
            .map(([k, v]) => `${k} ${v}`)
            .join("; ")} (${l.requiresSource})`
        : "not stated",
  },
  { label: "Deprecated", cell: (l) => (l.deprecated ? l.deprecated.message : "no deprecation in the registry") },
  { label: "Status classifier", cell: (l) => l.registryStatus ?? "—" },
  {
    label: "Last commit, default branch",
    cell: (l) => (l.lastCommitOnDefaultBranch?.date ? l.lastCommitOnDefaultBranch.date : "could not read"),
  },
  {
    label: "GitHub stars / archived",
    cell: (l) =>
      l.repoStats
        ? `${l.repoStats.stars ?? "—"} stars · ${l.repoStats.archived ? "archived" : "not archived"} (read ${l.repoStats.checkedOn})`
        : "not yet read from the GitHub API",
  },
];

export default async function LibraryComparisonPage({ params }: { params: Promise<Params> }) {
  const { pair } = await params;
  const c = getLibraryComparison(pair);
  if (!c) notFound();
  const A = lib(c.a);
  const B = lib(c.b);

  const path = `${LIBRARIES_BASE}/compare/${c.slug}`;
  const url = absoluteUrl(path);
  const modified = librariesModified();
  const published = LIBRARIES_PUBLISHED > modified ? modified : LIBRARIES_PUBLISHED;
  const faqId = (i: number) => `faq-${i + 1}`;
  const side = (s: "a" | "b") => (s === "a" ? A : B);

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: c.title,
        alternativeHeadline: c.primaryQuery,
        description: c.metaDescription,
        datePublished: published,
        dateModified: modified,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "Open-source libraries",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": `${url}#webpage` },
        url,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
        about: [A, B].map((l) => ({
          "@type": "SoftwareSourceCode",
          name: l.name,
          url: l.registryUrl,
          ...(githubUrl(l) ? { codeRepository: githubUrl(l) } : {}),
        })),
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: c.title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: LIBRARIES_VERIFIED_ON,
        reviewedBy: orgRef(),
      },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#${faqId(i)}`,
      url: `${url}#${faqId(i)}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#${faqId(i)}` },
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <article className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Libraries", path: LIBRARIES_BASE },
            { name: c.h1, path },
          ]}
        />
        <ClusterHero label="Library comparison" seed={stringSeed(c.slug)} />

        <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl">
          {c.h1}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Registry data read {LIBRARIES_FETCHED_ON}
          <ContentAge date={LIBRARIES_FETCHED_ON} />
          {LIBRARIES_VERIFIED_ON !== LIBRARIES_FETCHED_ON && <> · README notes checked {LIBRARIES_VERIFIED_ON}</>}
        </p>

        <AnswerCapsule>{c.answer}</AnswerCapsule>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Side by side</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Every cell is read from the registries and the repositories by a script. There is no winner row.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th scope="col" className="py-2 pr-4 font-semibold">Fact</th>
                  {[A, B].map((l) => (
                    <th key={l.slug} scope="col" className="py-2 pr-4 font-semibold normal-case">
                      <Link href={`${LIBRARIES_BASE}/${l.slug}`} className="font-mono text-brand-600 hover:text-brand-500">
                        {l.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.label} className="border-b border-[var(--border)] align-top">
                    <th scope="row" className="py-2 pr-4 font-semibold text-[var(--fg)]">{r.label}</th>
                    <td className="break-words py-2 pr-4 text-[var(--muted)]">{r.cell(A)}</td>
                    <td className="break-words py-2 pr-4 text-[var(--muted)]">{r.cell(B)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What each README says</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {(["a", "b"] as const).map((s) => (
              <div key={s} className="rounded-2xl border border-[var(--border)] p-5">
                <h3 className="font-mono text-base font-bold text-[var(--fg)]">{side(s).name}</h3>
                <ul className="mt-2 text-sm">
                  {c.points
                    .filter((p) => p.side === s)
                    .map((p) => (
                      <NoteItem key={p.note.text} note={p.note} />
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How to choose: our reading</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Judgement, labelled as such, drawn only from the facts above.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--fg)]">
            {c.choose.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {c.faqs.map((f, i) => (
              <div key={f.q} id={faqId(i)} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav aria-label="Package pages" className="mt-10 grid gap-3 sm:grid-cols-2">
          {[A, B].map((l) => (
            <Link
              key={l.slug}
              href={`${LIBRARIES_BASE}/${l.slug}`}
              className="group rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
            >
              <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Package page</span>
              <span className="mt-1 block break-words font-mono text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">
                {l.name} →
              </span>
            </Link>
          ))}
        </nav>

        <p className="mt-8 text-sm">
          <Link href={LIBRARIES_BASE} className="text-brand-600 hover:text-brand-500">
            ← All health and fitness libraries
          </Link>
        </p>
      </article>
    </Container>
  );
}
