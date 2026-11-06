import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import {
  WEEKLY_DESCRIPTION,
  WEEKLY_FEED_PATH,
  WEEKLY_H1,
  WEEKLY_PATH,
  WEEKLY_TITLE,
  weekHeading,
  weekPath,
  weekSummary,
  weeklyCapsule,
  weeklyDataDate,
  weeklyMethodLines,
  weeks,
} from "@/lib/weekly";

/**
 * /weekly — the hub of the weekly roundup (ops/VIRAL-20-2026-11-06.md item 9).
 * Indexed: it is the only page here that answers "what happened in fitness
 * APIs this week". The week pages under it are noindex (see src/lib/weekly.ts
 * for why), so this hub and the feed are their entry points.
 */

export const metadata: Metadata = {
  title: { absolute: WEEKLY_TITLE },
  description: WEEKLY_DESCRIPTION,
  alternates: { ...pageMirrorAlternates(WEEKLY_PATH), types: { ...pageMirrorAlternates(WEEKLY_PATH).types, "application/rss+xml": WEEKLY_FEED_PATH } },
  openGraph: { type: "website", title: WEEKLY_TITLE, description: WEEKLY_DESCRIPTION, url: WEEKLY_PATH },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const H2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";

export default function WeeklyHub() {
  const all = weeks();
  const url = absoluteUrl(WEEKLY_PATH);
  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: WEEKLY_H1,
    description: WEEKLY_DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    dateModified: weeklyDataDate(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: all.length,
      itemListElement: all.map((w, i) => ({ "@type": "ListItem", position: i + 1, name: weekHeading(w), url: absoluteUrl(weekPath(w.id)) })),
    },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Weekly roundup", path: WEEKLY_PATH }]} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">{WEEKLY_H1}</h1>
        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {weeklyCapsule()}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a href={WEEKLY_FEED_PATH} className="rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-500" data-cta="weekly-rss">
            RSS feed
          </a>
          <Link href="/digest" className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
            The monthly digest
          </Link>
          <Link href="/changes" className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
            Changes and deadlines
          </Link>
        </div>

        <section className="mt-12">
          <h2 className={H2}>Every week with a roundup</h2>
          <ul className="mt-5 space-y-4">
            {all.map((w) => (
              <li key={w.id}>
                <Link
                  href={weekPath(w.id)}
                  className="flex flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="text-lg font-semibold text-[var(--fg)]">{weekHeading(w)}</span>
                  <span className="mt-1 text-sm text-[var(--muted)]">{weekSummary(w)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className={H2}>How the roundup is made</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            {weeklyMethodLines().map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            For a whole month in one issue, read the{" "}
            <Link href="/digest" className={linkCls}>
              monthly digest
            </Link>
            ; for every dated change, the{" "}
            <Link href="/changes" className={linkCls}>
              changes tracker
            </Link>
            .
          </p>
        </section>
      </div>
    </Container>
  );
}
