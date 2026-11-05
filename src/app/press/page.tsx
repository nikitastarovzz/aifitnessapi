import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageSummary from "@/components/PageSummary";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { bibtexCitation, plainCitation } from "@/lib/cite";
import { shortDate } from "@/lib/ecosystemDerive";
import { buildDate } from "@/lib/year2026";
import { PRESS_PATH, YEAR_PATH, indexStats, pressDataDate, siteStats, yearStats, type PressSource } from "@/lib/press";

/**
 * /press — numbers about this site and the ecosystem it tracks, for anyone
 * who wants to quote one (ops/MORE-30-2026-11-05.md item 16). Every figure is
 * computed at build time by src/lib/press.ts from a file in the repository,
 * and printed with that file and the date its contents were last written or
 * checked; the ecosystem figures are /2026's and /fitness-api-index's own,
 * read through the same functions. Nothing on the page is a number typed by
 * hand, so a rebuild is the update. qa (PRESS-*) holds every stat to a
 * source file and a date.
 */

const TITLE = "Press Kit: Citable Fitness API Numbers";
const H1 = "Fitness API numbers you can cite";
const DESCRIPTION =
  "Counts of the APIs, changes, deprecations, datasets and fresh pages this site tracks, computed from the repo at each build with source file and date.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PRESS_PATH },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: PRESS_PATH, images: ["/opengraph-image"] },
};

function Source({ s, url }: { s: PressSource; url?: string }) {
  return (
    <p className="mt-2 text-xs text-[var(--muted)]">
      Source: <code className="text-[11px]">{s.file}</code>, {s.dateLabel}
      {url && (
        <>
          {" "}
          ·{" "}
          <a href={url} className="hover:text-[var(--fg)]">
            original
          </a>
        </>
      )}
    </p>
  );
}

export default function PressPage() {
  const asOf = buildDate();
  const dataDate = pressDataDate();
  const own = siteStats(asOf);
  const index = indexStats(asOf);
  const year = yearStats(asOf);
  const url = absoluteUrl(PRESS_PATH);
  const byId = Object.fromEntries(own.map((s) => [s.id, s]));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: H1,
    description: DESCRIPTION,
    dateModified: dataDate,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage` },
    url,
  };

  const stat = (s: { id: string; value: string; label: string; detail: string; source: PressSource; link: { href: string; label: string } }, url?: string) => (
    <li
      key={s.id}
      id={s.id}
      className="scroll-mt-24 rounded-2xl border border-[var(--border)] p-5"
      data-press-stat={s.id}
      data-press-source={s.source.file}
      data-press-date={s.source.date}
    >
      <p className="text-3xl font-bold tracking-tight text-[var(--fg)]">{s.value}</p>
      <p className="mt-1 font-semibold text-[var(--fg)]">{s.label}</p>
      {s.detail && <p className="mt-2 text-sm text-[var(--muted)]">{s.detail}</p>}
      <Source s={s.source} url={url} />
      <Link href={s.link.href} className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-500">
        {s.link.label} →
      </Link>
    </li>
  );

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Press", path: PRESS_PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Computed when this page was built, {shortDate(asOf)}. Newest input written or checked {shortDate(dataDate)}.
        </p>

        <PageSummary path={PRESS_PATH} name={H1}>
          {site.name} tracks {byId["apis-tracked"].value} fitness and health APIs, SDKs and models, has logged{" "}
          {byId["changes-logged"].value} dated ecosystem changes and recorded {byId["deprecations"].value} shut-down,
          dying or deprecated APIs, and publishes {byId["datasets"].value} open CC BY 4.0 datasets. Every number on
          this page is counted from a file in the site’s repository at build time and printed with that file and
          the date its contents were last checked, so a figure here is only as old as its source line says.
        </PageSummary>

        <aside
          className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-500/5 p-5 text-sm leading-relaxed text-[var(--fg)]"
          data-press-disclosure
        >
          <p className="font-semibold">Disclosure: who funds this site</p>
          <p className="mt-1 text-[var(--muted)]">
            {site.name} is funded by KinesteX, which makes an AI motion-tracking SDK. KinesteX is one row of the
            directory and is counted on the same terms as every other product; it is left out of the cross-product
            comparisons below, as the fitness API index leaves it unranked. Nothing here ranks products or names a
            best one.{" "}
            <Link href="/about#funding" className="text-brand-600 hover:text-brand-500">
              How we stay independent →
            </Link>
          </p>
        </aside>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What this site tracks</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">{own.map((s) => stat(s))}</ul>
        </section>

        {index.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Across the directory</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              From{" "}
              <Link href="/fitness-api-index" className="text-brand-600 hover:text-brand-500">
                the fitness API index
              </Link>
              , which publishes the raw signals per product and no composite score.
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">{index.map((s) => stat(s))}</ul>
          </section>
        )}

        {year.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The year so far</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Every stat of{" "}
              <Link href={YEAR_PATH} className="text-brand-600 hover:text-brand-500">
                the 2026 story
              </Link>
              , with its caveat where it has one.
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {year.map((s) =>
                stat(
                  {
                    id: `year-${s.id}`,
                    value: s.value,
                    label: s.label,
                    detail: [s.detail, s.caveat ? `Caveat: ${s.caveat}.` : ""].filter(Boolean).join(" "),
                    source: s.source,
                    link: s.link,
                  },
                  s.source.url,
                ),
              )}
            </ul>
          </section>
        )}

        <section id="how-to-cite" className="mt-14 scroll-mt-24 rounded-2xl border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How to cite</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Quote the number with its source line, and link the page it points to: that page carries the sourced
            detail and its own review date. Each stat above has an anchor (for example{" "}
            <code className="text-xs">{`${url}#changes-logged`}</code>). For this page:
          </p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs" data-cite="plain">
            {plainCitation({ title: H1, url, verified: dataDate, verifiedLabel: "Data as of" })}
          </pre>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs" data-cite="bibtex">
            {bibtexCitation({ path: PRESS_PATH, title: H1, url, verified: dataDate, note: `Data as of ${dataDate}` })}
          </pre>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Citing a dataset rather than a count? Each one has its own citation string and BibTeX entry on{" "}
            <Link href="/datasets#cite" className="text-brand-600 hover:text-brand-500">
              the datasets page
            </Link>
            , and the repository carries a CITATION.cff generated with the files. Spotted a wrong number? The{" "}
            <Link href="/corrections" className="text-brand-600 hover:text-brand-500">
              corrections log
            </Link>{" "}
            is where fixes are recorded.
          </p>
        </section>
      </div>
    </Container>
  );
}
