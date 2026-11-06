import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { DIGEST_PATH, getDigest } from "@/data/digest";
import {
  WEEKLY_FEED_PATH,
  WEEKLY_PATH,
  WEEK_HEADINGS,
  getWeek,
  weekDataDate,
  weekGroups,
  weekHeading,
  weekPath,
  weekSummary,
  weekTitle,
  weeks,
  type WeeklyItem,
} from "@/lib/weekly";

/**
 * One week of the roundup (ops/VIRAL-20-2026-11-06.md item 9). noindex,
 * follow and out of the sitemap: the monthly digest is the indexed archive of
 * the same records (src/lib/weekly.ts). Weeks under the floor in
 * src/lib/weeklyCore.mjs are not built at all.
 */

export const dynamicParams = false;

type Params = { week: string };

export function generateStaticParams(): Params[] {
  return weeks().map((w) => ({ week: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { week } = await params;
  const w = getWeek(week);
  if (!w) return {};
  const title = weekTitle(w);
  const description = weekSummary(w);
  const canonical = weekPath(w.id);
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: true },
    alternates: { canonical, types: { "application/rss+xml": WEEKLY_FEED_PATH } },
    openGraph: { type: "article", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const H2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";

function ItemList({ items }: { items: WeeklyItem[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((i) => (
        <li key={i.key} className="rounded-xl border border-[var(--border)] p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            <time dateTime={i.date}>{i.date}</time> · {i.note}
          </span>
          <Link href={i.href} className="mt-1 block text-sm font-medium text-[var(--fg)] hover:text-brand-600">
            {i.title}
          </Link>
          {i.source && (
            <a href={i.source.url} rel="noopener" className="mt-1 inline-block text-xs text-brand-600 hover:text-brand-500">
              Source: {i.source.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function WeekPage({ params }: { params: Promise<Params> }) {
  const { week } = await params;
  const w = getWeek(week);
  if (!w) notFound();

  const path = weekPath(w.id);
  const url = absoluteUrl(path);
  const all = weeks();
  const i = all.findIndex((x) => x.id === w.id);
  const newer = all[i - 1];
  const older = all[i + 1];
  const g = weekGroups(w);
  const month = getDigest(w.end.slice(0, 7)) ?? getDigest(w.start.slice(0, 7));
  const digestHref = month ? `${DIGEST_PATH}/${month.month}` : DIGEST_PATH;

  const graph = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: weekTitle(w),
    description: weekSummary(w),
    datePublished: w.start,
    dateModified: weekDataDate(w),
    author: orgRef(),
    publisher: orgRef(),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <article className="mx-auto max-w-2xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Weekly roundup", path: WEEKLY_PATH },
            { name: weekHeading(w), path },
          ]}
        />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">{weekHeading(w)}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {w.range} · generated from the record, not written from memory
        </p>

        <AnswerCapsule>{weekSummary(w)}</AnswerCapsule>

        <p className="mt-6 text-sm text-[var(--muted)]">
          <a href={WEEKLY_FEED_PATH} className={linkCls}>
            Follow the weekly RSS feed
          </a>{" "}
          · the month in one issue:{" "}
          <Link href={digestHref} className={linkCls}>
            the monthly digest
          </Link>
        </p>

        {g.changes.length > 0 && (
          <section className="mt-12">
            <h2 className={H2}>{WEEK_HEADINGS.changes}</h2>
            <ItemList items={g.changes} />
          </section>
        )}
        {g.graveyard.length > 0 && (
          <section className="mt-12">
            <h2 className={H2}>{WEEK_HEADINGS.graveyard}</h2>
            <ItemList items={g.graveyard} />
          </section>
        )}
        {g.releases.length > 0 && (
          <section className="mt-12">
            <h2 className={H2}>{WEEK_HEADINGS.releases}</h2>
            <ItemList items={g.releases} />
          </section>
        )}
        {g.pages.length > 0 && (
          <section className="mt-12">
            <h2 className={H2}>{WEEK_HEADINGS.pages}</h2>
            <div className="mt-5 space-y-8">
              {g.pages.map((s) => (
                <div key={s.section}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                    {s.section} ({s.pages.length})
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {s.pages.map((p) => (
                      <li key={p.key}>
                        <Link href={p.href} className="text-sm text-brand-600 hover:text-brand-500">
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <nav aria-label="Other weeks" className="mt-12 grid gap-3 sm:grid-cols-2">
          {older ? (
            <Link href={weekPath(older.id)} className="rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400">
              <span className="text-xs uppercase tracking-wider text-[var(--muted)]">← Earlier</span>
              <span className="mt-1 block text-sm font-medium text-[var(--fg)]">{weekHeading(older)}</span>
            </Link>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
          {newer && (
            <Link href={weekPath(newer.id)} className="rounded-xl border border-[var(--border)] p-4 text-right transition-colors hover:border-brand-400">
              <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Later →</span>
              <span className="mt-1 block text-sm font-medium text-[var(--fg)]">{weekHeading(newer)}</span>
            </Link>
          )}
        </nav>
      </article>
    </Container>
  );
}
