import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import ContentAge from "@/components/ContentAge";
import AnswerCapsule from "@/components/AnswerCapsule";
import { LIBRARIES_FETCHED_ON } from "@/data/libraries";
import {
  LIBRARIES_BASE,
  LIBRARIES_PUBLISHED,
  LIBRARIES_VERIFIED_ON,
  LIBRARY_GROUPS,
  ECOSYSTEM_LABEL,
  comparisonsFor,
  getLibraryPage,
  libraryPages,
  librariesModified,
} from "@/data/librariesEditorial";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";
import { CommandItem, FactList, Inline, LANGUAGE, NoteItem, factRows, githubUrl, sinceRead, spdxUrl } from "../_shared";

/**
 * One page per open-source package. Every registry and repository fact on
 * the page is rendered from the generated src/data/libraries.ts; the install
 * commands, caveats and questions come from src/data/librariesEditorial.ts,
 * each with the README or registry URL it was read from.
 *
 * No markdown mirror exists for these pages (they are not a cluster), so no
 * `text/markdown` alternate and no `encoding` node.
 */

export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return libraryPages().map((p) => ({ slug: p.lib.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getLibraryPage(slug);
  if (!page) return {};
  const { ed } = page;
  const canonical = `${LIBRARIES_BASE}/${slug}`;
  return {
    title: { absolute: ed.title },
    description: ed.metaDescription,
    alternates: { canonical },
    openGraph: { type: "article", title: ed.title, description: ed.metaDescription, url: canonical },
    twitter: { card: "summary_large_image", title: ed.title, description: ed.metaDescription },
  };
}

export default async function LibraryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getLibraryPage(slug);
  if (!page) notFound();
  const { lib: l, ed } = page;

  const path = `${LIBRARIES_BASE}/${slug}`;
  const url = absoluteUrl(path);
  const modified = librariesModified();
  const published = LIBRARIES_PUBLISHED > modified ? modified : LIBRARIES_PUBLISHED;
  const group = LIBRARY_GROUPS.find((g) => g.id === l.group);
  const alternatives = libraryPages().filter((p) => p.lib.group === l.group && p.lib.slug !== slug);
  const comparisons = comparisonsFor(slug);
  const gh = githubUrl(l);
  const faqId = (i: number) => `faq-${i + 1}`;

  // Documentation a note cites becomes `citation`; the package's own registry
  // entry and repository are what the page is about, so they are `mentions`.
  const docSources = [...new Set([ed.wraps, ...ed.notes].map((n) => n.source))].filter((u) =>
    u.startsWith("https://developer.android.com/") || u.startsWith("https://developer.apple.com/"),
  );

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: ed.title,
        alternativeHeadline: ed.primaryQuery,
        description: ed.metaDescription,
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
        about: { "@id": `${url}#software` },
        ...(docSources.length ? { citation: docSources } : {}),
        mentions: [l.registryUrl, ...(gh ? [gh] : [])],
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${url}#software`,
        name: l.name,
        url: l.registryUrl,
        ...(gh ? { codeRepository: gh } : {}),
        programmingLanguage: LANGUAGE[l.ecosystem],
        version: l.latestVersion,
        ...(l.description ? { description: l.description } : {}),
        ...(spdxUrl(l.license) ? { license: spdxUrl(l.license) } : {}),
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: ed.title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: LIBRARIES_VERIFIED_ON,
        reviewedBy: orgRef(),
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ed.faqs.map((f, i) => ({
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

      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Libraries", path: LIBRARIES_BASE },
            { name: l.name, path },
          ]}
        />
        <ClusterHero label={group ? `${group.label} library` : "Library"} seed={stringSeed(slug)} />

        <h1 className="break-words font-mono text-3xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl">
          {ed.h1}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {ECOSYSTEM_LABEL[l.ecosystem]} · latest {l.latestVersion} ({l.latestPublished}) · registry read{" "}
          {LIBRARIES_FETCHED_ON}
          <ContentAge date={LIBRARIES_FETCHED_ON} />
          {LIBRARIES_VERIFIED_ON !== LIBRARIES_FETCHED_ON && <> · README notes checked {LIBRARIES_VERIFIED_ON}</>}
        </p>

        {l.deprecated && (
          <aside
            role="note"
            className="mt-6 rounded-xl border border-amber-400/50 bg-amber-500/10 px-4 py-3 text-sm text-[var(--fg)]"
          >
            <strong>Deprecated in the registry.</strong> {l.deprecated.message}{" "}
            <span className="text-[var(--muted)]">({l.deprecated.source})</span>
          </aside>
        )}

        <AnswerCapsule>{ed.answer}</AnswerCapsule>

        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2 text-sm">
          {[
            ["#install", ed.commandsHeading],
            ["#facts", "Registry facts"],
            ["#caveats", "README caveats"],
            ["#native", "Native API"],
            ["#alternatives", "Alternatives"],
            ["#faq", "Questions"],
          ].map(([href, text]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              {text}
            </a>
          ))}
        </nav>

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What it wraps</h2>
          <ul className="mt-2">
            <NoteItem note={ed.wraps} />
          </ul>
          {l.wraps && (
            <p className="text-xs text-[var(--muted)]">
              Named in the registry description: {l.wraps.join(", ")}.
            </p>
          )}
        </section>

        <section id="install" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{ed.commandsHeading}</h2>
          {ed.commands.length > 0 ? (
            ed.commands.map((c) => <CommandItem key={c.command} c={c} />)
          ) : (
            <p className="mt-3 text-[var(--muted)]">{ed.noCommandNote}</p>
          )}
        </section>

        <section id="facts" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Registry and repository facts</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Read from {ECOSYSTEM_LABEL[l.ecosystem]} and the repository by a script, not typed by hand. Where the
            metadata does not state something, the row says so. Dates are shown as dates, with the gap to our read,
            rather than as a verdict on whether the project is alive.
          </p>
          <FactList rows={factRows(l)} />
          {l.description && (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Registry description: &ldquo;{l.description}&rdquo;
            </p>
          )}
        </section>

        <section id="caveats" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the README warns about</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Each item is the project&rsquo;s own statement, checked on {LIBRARIES_VERIFIED_ON}, quoted where the
            wording matters.
          </p>
          <ul className="mt-2">
            {ed.notes.map((n) => (
              <NoteItem key={n.text} note={n} />
            ))}
          </ul>
        </section>

        <section id="native" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The API underneath</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            A wrapper inherits every rule of the API it calls. These pages cover that layer directly.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ed.nativeLinks.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="group block h-full rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="block text-sm font-semibold text-[var(--fg)] group-hover:text-brand-600">{n.label} →</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">{n.why}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="alternatives" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Other {group?.label ?? ""} packages on this list
          </h2>
          {comparisons.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {comparisons.map((c) => (
                <li key={c.slug}>
                  <Link href={`${LIBRARIES_BASE}/compare/${c.slug}`} className="font-medium text-brand-600 hover:text-brand-500">
                    {c.h1}: side by side →
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <ul className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {alternatives.map(({ lib: a, ed: aEd }) => (
              <li key={a.slug} className="py-3 text-sm">
                <Link href={`${LIBRARIES_BASE}/${a.slug}`} className="font-mono font-semibold text-brand-600 hover:text-brand-500">
                  {a.name}
                </Link>
                <span className="ml-2 text-[var(--muted)]">
                  {a.latestVersion} · {a.latestPublished}
                  {a.deprecated ? " · deprecated" : ""}
                </span>
                <span className="mt-0.5 block text-[var(--muted)]">
                  <Inline text={aEd.wraps.text.split(". ")[0].replace(/\.$/, "") + "."} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {ed.faqs.map((f, i) => (
              <div key={f.q} id={faqId(i)} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterCta
          pitch="Bridge releases are where support for a new data type actually lands. Subscribe and we'll tell you when one of these packages ships, deprecates or changes what it wraps."
          source="spoke-inline"
          id={`cta-lib-${slug}`}
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          Registry facts read by <code className="font-mono text-xs">scripts/fetch-libraries.mjs</code> on{" "}
          {LIBRARIES_FETCHED_ON} and refreshed weekly; the latest release was published {sinceRead(l.latestPublished)}.
          README quotes identify the project&rsquo;s own statements; the selection, grouping and comparisons are{" "}
          {site.name}&rsquo;s. For tagged releases of the main bridges, see the{" "}
          <Link href="/sdk-releases" className="font-medium text-brand-600 hover:text-brand-500">
            SDK release tracker
          </Link>
          .
        </p>

        <p className="mt-8 text-sm">
          <Link href={LIBRARIES_BASE} className="text-brand-600 hover:text-brand-500">
            ← All health and fitness libraries
          </Link>
        </p>
      </article>
    </Container>
  );
}
