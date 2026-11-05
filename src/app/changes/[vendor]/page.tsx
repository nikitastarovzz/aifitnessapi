import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import Countdown from "@/components/Countdown";
import { WhenUpcoming } from "@/components/UpcomingDeadlines";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { clampDescription } from "@/lib/cluster";
import { APIS_PATH, NOINDEX_APIS } from "@/data/apis";
import { VENDOR_HUBS } from "@/data/vendorHubs";
import { menuLabel } from "@/lib/vendorMenu";
import type { ChangeStatus } from "@/data/changes";
import {
  vendorChangesPath,
  vendorFeedPath,
  vendorTimeline,
  vendorTimelines,
  timelineCheckedOn,
  timelineOldestCheck,
  type VendorTimeline,
} from "@/lib/vendorChanges";
import { API_BASE } from "@/lib/publicApi";

/**
 * One vendor's slice of the changes tracker (ops/MORE-30-2026-11-05.md item
 * 15). Every entry is a /changes entry, chosen by the directory's alias match
 * (lib/vendorChanges.ts), shown with the same grade, date precision and source
 * link, and nothing is added to it: the page states no more than /changes,
 * which states no more than the pages it links. Only vendors with two or more
 * entries get one.
 */

export const dynamicParams = false;

type Params = { vendor: string };

export function generateStaticParams(): Params[] {
  return vendorTimelines().map((t) => ({ vendor: t.api.id }));
}

const STATUS_STYLES: Record<ChangeStatus, string> = {
  confirmed: "border-brand-400 bg-brand-500/10 text-[var(--fg)]",
  reported: "border-amber-400/50 bg-amber-500/10 text-[var(--fg)]",
  watch: "border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function fmtDate(d: string): string {
  if (/^\d{4}$/.test(d)) return d;
  const [y, m, day] = d.split("-");
  const mn = MONTHS[parseInt(m, 10) - 1];
  return day ? `${mn} ${parseInt(day, 10)}, ${y}` : `${mn} ${y}`;
}

const pageTitle = (t: VendorTimeline) => `${t.api.short} API Changes & Deadlines Timeline`;

function pageDescription(t: VendorTimeline): string {
  const n = t.events.length;
  return clampDescription(
    `${n} dated ${t.api.short} API changes from the tracker: deprecations, deadlines and term changes, graded confirmed or reported, each linked to its source.`,
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { vendor } = await params;
  const t = vendorTimeline(vendor);
  if (!t) return {};
  const title = pageTitle(t);
  const description = pageDescription(t);
  const canonical = vendorChangesPath(t.api.id);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      types: { "application/rss+xml": [{ url: vendorFeedPath(t.api.id), title: `${title} (RSS)` }] },
    },
    // A product without search demand of its own is noindex in the directory
    // (NOINDEX_APIS); its timeline follows the same decision.
    ...(NOINDEX_APIS.has(t.api.id) ? { robots: { index: false, follow: true } } : {}),
    openGraph: { type: "website", title, description, url: canonical, images: ["/changes/opengraph-image"] },
  };
}

export default async function VendorChangesPage({ params }: { params: Promise<Params> }) {
  const { vendor } = await params;
  const t = vendorTimeline(vendor);
  if (!t) notFound();

  const { api, events } = t;
  const path = vendorChangesPath(api.id);
  const url = absoluteUrl(path);
  const title = pageTitle(t);
  const checked = timelineCheckedOn(t);
  const oldestCheck = timelineOldestCheck(t);
  const confirmed = events.filter((e) => e.status === "confirmed").length;
  const reported = events.filter((e) => e.status === "reported").length;
  const hub = VENDOR_HUBS.find((v) => v.id === api.id)?.hub ?? null;
  const isFirstParty = api.id === "kinestex";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: pageDescription(t),
    // The page's content is its entries, so it changed last when an entry
    // was last checked against its source.
    dateModified: checked,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    about: { "@type": "SoftwareApplication", name: api.label, applicationCategory: "DeveloperApplication" },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: events.length,
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${e.date}: ${e.title}`,
      url: absoluteUrl(e.page.href),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl" data-vendor-timeline={api.id} data-vendor-timeline-count={events.length}>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Changes & Deadlines", path: "/changes" },
            { name: api.short, path },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {events.length} entries · checked against their source pages between {fmtDate(oldestCheck)} and {fmtDate(checked)}
        </p>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          The changes tracker holds {events.length} dated entries that name {api.label}: {confirmed} confirmed, where
          the vendor’s own words are quoted on the linked page, and {reported} reported, where the claim comes
          from notices we could not confirm on an official page. They are listed newest first, each date at the
          precision its source gives, and each links the page on this site that carries the sourced detail.
        </div>

        {isFirstParty && (
          <p className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/5 p-4 text-sm text-[var(--fg)]">
            Disclosure: KinesteX funds this site. Its entries are graded and sourced on the same terms as every other
            vendor&rsquo;s.
          </p>
        )}

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
          <h2 className="text-sm font-bold tracking-tight text-[var(--fg)]">Follow {api.short} changes</h2>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <a href={vendorFeedPath(api.id)} className="font-medium text-brand-600 hover:text-brand-500" data-vendor-feed={api.id}>
              {api.short} RSS feed →
            </a>
            <Link href={`/alerts?watch=${api.id}`} className="font-medium text-brand-600 hover:text-brand-500">
              Email alerts for {api.short} →
            </Link>
            <a href={absoluteUrl(`${API_BASE}/vendors/${api.id}`)} className="font-medium text-brand-600 hover:text-brand-500">
              As JSON →
            </a>
          </p>
        </div>

        <section className="mt-10">
          <ol className="relative space-y-6 border-l border-[var(--border)] pl-6">
            {events.map((e) => (
              <li key={`${e.sortDate}-${e.title}`} className="relative" data-vendor-change>
                <span aria-hidden className="absolute -left-[1.85rem] top-1.5 h-3 w-3">
                  <WhenUpcoming date={e.sortDate}>
                    <span className="ping-slow absolute inset-0 rounded-full bg-brand-400/70" />
                  </WhenUpcoming>
                  <span className="absolute inset-0 rounded-full border-2 border-brand-400 bg-[var(--bg)]" />
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--fg)]">{fmtDate(e.date)}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[e.status]}`}>{e.status}</span>
                  <Countdown date={e.sortDate} fuzzy={!/^\d{4}-\d{2}-\d{2}$/.test(e.date)} />
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

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Where these entries come from</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            An entry is on this page when its title or summary on{" "}
            <Link href="/changes" className="text-brand-600 hover:text-brand-500">
              the changes tracker
            </Link>{" "}
            names {api.short} as a whole word, the same rule that lists it on the{" "}
            <Link href={`${APIS_PATH}/${api.id}`} className="text-brand-600 hover:text-brand-500">
              {api.short} directory entry
            </Link>
            . A vendor gets a timeline once two entries name it.
            {hub && (
              <>
                {" "}
                For everything else on this site about {api.short}, start at{" "}
                <Link href={hub} className="text-brand-600 hover:text-brand-500">
                  {menuLabel(hub)}
                </Link>
                .
              </>
            )}
          </p>
        </section>

        <p className="mt-10 text-sm">
          <Link href="/changes" className="text-brand-600 hover:text-brand-500">
            ← Every vendor&rsquo;s changes and deadlines
          </Link>
        </p>
        <p className="mt-4 text-xs text-[var(--muted)]">
          Maintained by {site.name}. Confirm current details in {api.short}&rsquo;s own documentation before you act on
          a date.
        </p>
      </div>
    </Container>
  );
}
