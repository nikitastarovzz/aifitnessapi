import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import Countdown from "@/components/Countdown";
import { changesSorted, WATCH_ITEMS, type ChangeStatus } from "@/data/changes";

/**
 * The living record behind the site's "we track the changes" promise:
 * every dated ecosystem event we've verified, confirmed-vs-reported graded,
 * each linking the page that carries the sourced claim. The daily routine
 * appends to src/data/changes.ts as changes are verified; the weekly digest
 * is generated from this feed.
 */

const PAGE_PATH = "/changes";
const UPDATED = "2026-08-12";

export const metadata: Metadata = {
  title: { absolute: "Fitness API Changes & Deadlines Tracker" },
  description:
    "The dated record of fitness-API ecosystem changes: deprecations, term changes, deadlines — graded confirmed vs reported, each linked to its source.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    title: "Fitness API Changes & Deadlines Tracker",
    description:
      "Deprecations, deadlines, and term changes across the fitness-API ecosystem, graded confirmed vs reported and kept current.",
    url: PAGE_PATH,
    images: ["/opengraph-image"],
  },
};

const STATUS_STYLES: Record<ChangeStatus, string> = {
  confirmed: "border-brand-400 bg-brand-500/10 text-[var(--fg)]",
  reported: "border-amber-400/50 bg-amber-500/10 text-[var(--fg)]",
  watch: "border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]",
};

function fmtDate(d: string): string {
  if (/^\d{4}$/.test(d)) return d;
  const [y, m, day] = d.split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const mn = months[parseInt(m, 10) - 1];
  return day ? `${mn} ${parseInt(day, 10)}, ${y}` : `${mn} ${y}`;
}

export default function ChangesPage() {
  const url = absoluteUrl(PAGE_PATH);
  const events = changesSorted();
  const today = new Date().toISOString().slice(0, 10);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fitness API Changes & Deadlines",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${e.date}: ${e.title}`,
      url: absoluteUrl(e.page.href),
    })),
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fitness API Changes & Deadlines Tracker",
    description: metadata.description,
    datePublished: "2026-08-12",
    dateModified: UPDATED,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Changes & Deadlines", path: PAGE_PATH }]} />

        <ClusterHero label="Deadline Watch" seed={7} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitness API Changes &amp; Deadlines
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Updated {fmtDate(UPDATED)} — new entries added as we verify them.</p>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          This is the dated record of what is changing in the fitness-API ecosystem: deprecations,
          deadlines, pricing-model shifts, and model freezes. Every entry is graded — confirmed means a
          vendor&rsquo;s own words are quoted on the linked page; reported means the claim comes from
          vendor or community notices we could not confirm on an official page. Each entry links the
          page on this site that carries the sourced detail, and every date keeps the precision of its
          evidence rather than being sharpened for effect.
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full border px-2.5 py-0.5 font-semibold ${STATUS_STYLES.confirmed}`}>confirmed — vendor&rsquo;s own words, quoted and dated</span>
          <span className={`rounded-full border px-2.5 py-0.5 font-semibold ${STATUS_STYLES.reported}`}>reported — consistent notices, no official page verified</span>
        </div>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
          <h2 className="text-sm font-bold tracking-tight text-[var(--fg)]">Get the deadlines in your calendar</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Subscribe once and every deadline we verify afterwards shows up where you already look.
            Events with no confirmed day are titled <span className="font-medium text-[var(--fg)]">[reported month]</span>{" "}
            and placed on a nominal date for planning only — the calendar carries the same grading this page does.
          </p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <a
              href="/changes/calendar.ics"
              className="font-medium text-brand-600 hover:text-brand-500"
              data-track="calendar-subscribe"
            >
              Subscribe (.ics) →
            </a>
            <a href="/changes.xml" className="font-medium text-brand-600 hover:text-brand-500">
              RSS feed →
            </a>
          </p>
        </div>

        <section className="mt-10">
          <ol className="relative space-y-6 border-l border-[var(--border)] pl-6">
            {events.map((e) => (
              <li key={`${e.sortDate}-${e.title}`} className="relative">
                <span aria-hidden className="absolute -left-[1.85rem] top-1.5 h-3 w-3">
                  {e.sortDate >= today && (
                    <span className="ping-slow absolute inset-0 rounded-full bg-brand-400/70" />
                  )}
                  <span className="absolute inset-0 rounded-full border-2 border-brand-400 bg-[var(--bg)]" />
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--fg)]">{fmtDate(e.date)}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[e.status]}`}>{e.status}</span>
                  {e.sortDate >= today && (
                    <Countdown date={e.sortDate} fuzzy={!/^\d{4}-\d{2}-\d{2}$/.test(e.date)} />
                  )}
                </div>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-[var(--fg)]">{e.title}</h2>
                <p className="mt-1.5 text-sm text-[var(--muted)]">{e.summary}</p>
                <p className="mt-2 text-sm">
                  <Link href={e.page.href} className="font-medium text-brand-600 hover:text-brand-500">
                    {e.page.label} →
                  </Link>{" "}
                  <span className="text-xs text-[var(--muted)]">· checked {fmtDate(e.verifiedOn)}</span>
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">On watch — undated, not predictions</h2>
          <ul className="mt-5 grid gap-3">
            {WATCH_ITEMS.map((w) => (
              <li key={w.title} className="rounded-xl border border-[var(--border)] p-4">
                <span className="font-semibold text-[var(--fg)]">{w.title}</span>
                <p className="mt-1 text-sm text-[var(--muted)]">{w.summary}</p>
                <Link href={w.page.href} className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-500">
                  {w.page.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ClusterCta
          pitch="This page is the subscribe pitch: when a reported date firms up, a term changes, or a deprecation lands, subscribers hear first — with the source, not the panic."
          source="pillar-inline"
          id="cta-changes"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          Maintained by {site.name}. Grading rules live in the repo alongside the data — an entry never
          states more than the page it links.
        </p>
      </div>
    </Container>
  );
}
