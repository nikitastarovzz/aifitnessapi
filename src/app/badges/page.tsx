import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { ROWS } from "@/data/matrix";
import CountdownEmbed from "@/components/CountdownEmbed";
import { countdownTargets } from "@/lib/vendorDeadlines";
import { allEmbeddableTables, clusterLabel, EMBED_TABLE_CLUSTERS, embedSnippets, embedTablePath } from "@/lib/embedTables";
import { GRAVEYARD, GRAVEYARD_PATH } from "@/data/graveyard";
import { opennessVendors } from "@/lib/openness";
import { OPENNESS_PATH, vendorAnchor } from "@/lib/opennessIndex.mjs";
import {
  badgeAlt,
  badgeMarkdown,
  opennessBadge,
  opennessBadgeAlt,
  opennessBadgePath,
  stoneBadge,
  stoneBadgeAlt,
  stoneBadgePath,
} from "@/lib/statusBadges.mjs";

/**
 * The embed page: the three iframe widgets under /embed plus the link badge,
 * each with a copy-paste snippet.
 *
 * What this page must not do is oversell. An embed is our content living on
 * someone else's page — it changes when we change it, and we run no service
 * behind it. So the copy states that plainly instead of implying versioning,
 * uptime or an SLA we do not offer.
 */
const PAGE_PATH = "/badges";
const UPDATED = "2026-11-04";
const TITLE = "Fitness API Embeds & Badges";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · ${site.name}` },
  description:
    "Copy-paste widgets: the HealthKit ↔ Health Connect type table, the API deadline tracker, the API market map and a link badge. Attribution only.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Three embeddable widgets — the HealthKit ↔ Health Connect type table, the deadline tracker and the API market map — plus a link badge. Attribution required.",
    url: PAGE_PATH,
  },
};

const MATRIX_SNIPPET = `<iframe src="https://aifitnessapi.com/embed/matrix"
        title="HealthKit and Health Connect data-type reference"
        width="100%" height="620" loading="lazy" style="border:0"></iframe>`;

const DEADLINES_SNIPPET = `<iframe src="https://aifitnessapi.com/embed/deadlines"
        title="Fitness API changes and deadlines"
        width="100%" height="460" loading="lazy" style="border:0"></iframe>`;

/**
 * The live-value badges. `width` is only the intrinsic size hint for layout —
 * the SVG sizes itself from its own text, so a stale number here shifts
 * nothing but the pre-load reservation.
 */
const LIVE_BADGES = [
  {
    file: "healthkit-types.svg",
    alt: "HealthKit types tracked",
    width: 210,
    href: "/healthkit-identifiers",
    note: "Every HKQuantityType, category, characteristic and workout activity we track.",
  },
  {
    file: "tracked-changes.svg",
    alt: "API changes tracked",
    width: 210,
    href: "/changes",
    note: "Dated deprecations and deadlines in the tracker.",
  },
  {
    file: "last-verified.svg",
    alt: "Last verified",
    width: 190,
    href: "/methodology",
    note: "The newest verification date across the datasets — not today's date.",
  },
];

const MARKET_MAP_SNIPPET = `<iframe src="https://aifitnessapi.com/embed/market-map"
        title="Fitness and health API market map"
        width="100%" height="720" loading="lazy" style="border:0"></iframe>`;

const BADGE_SNIPPET = `<a href="https://aifitnessapi.com/apis" target="_blank" rel="noreferrer">
  <img src="https://aifitnessapi.com/badges/badge.svg"
       alt="Listed on AIFitnessAPI" width="200" height="40" loading="lazy">
</a>`;

function Snippet({ code, label }: { code: string; label: string }) {
  return (
    <pre
      aria-label={label}
      className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs leading-relaxed text-[var(--fg)]"
    >
      <code>{code}</code>
    </pre>
  );
}

export default async function BadgesPage() {
  // The build day: the status badges are computed with it, so this page
  // states the same day the badges do.
  const asOf = new Date().toISOString().slice(0, 10);
  const tables = await allEmbeddableTables();
  const tablePages = new Set(tables.map((t) => `${t.basePath}/${t.entry.slug}`)).size;
  // The first pricing table: the kind of table people quote most.
  const example = tables.find((t) => t.basePath === "/pricing") ?? tables[0];
  const url = absoluteUrl(PAGE_PATH);

  const graph = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: TITLE,
    description: String(metadata.description),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    lastReviewed: UPDATED,
    reviewedBy: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Embeds & badges", path: PAGE_PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Embeds &amp; badges
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Updated November 4, 2026</p>

        <AnswerCapsule>
          Three of our reference pages are available as iframe widgets you can drop into your own
          site — the HealthKit ↔ Health Connect type table, the dated fitness-API deadline
          tracker and the fitness &amp; health API market map — plus a small badge if you just want to
          link back. Every comparison and pricing table on the site can be embedded the same way,
          one table per frame. All of it is free. The only
          condition is attribution: the widgets carry a visible link back to the source page, and
          that link stays.
        </AnswerCapsule>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            1. HealthKit ↔ Health Connect type table
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            All {ROWS.length} metrics with their Apple HealthKit and Android Health Connect type
            identifiers and the cross-platform gotchas — the same data as{" "}
            <Link href="/matrix" className="text-brand-600 hover:text-brand-500">
              the type reference
            </Link>
            , rendered without the site chrome. The table scrolls sideways inside the frame, so it
            stays usable in a narrow column.{" "}
            <Link
              href="/embed/matrix"
              target="_blank"
              className="text-brand-600 hover:text-brand-500"
            >
              Preview the widget
            </Link>
            .
          </p>
          <Snippet code={MATRIX_SNIPPET} label="Embed code for the type reference table" />
          <p className="mt-2 text-sm text-[var(--muted)]">
            620px is a starting point, not a measurement — the table is {ROWS.length} rows of
            variable-length notes, so pick a height that suits your layout and let the frame scroll.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            2. Changes &amp; deadlines tracker
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            The next dated ecosystem changes still ahead — deprecations, turndowns, term changes —
            each showing whether we grade it <strong className="font-semibold text-[var(--fg)]">confirmed</strong>{" "}
            (the vendor&rsquo;s own words, quoted on the linked page) or{" "}
            <strong className="font-semibold text-[var(--fg)]">reported</strong> (consistent notices
            with no official page we could verify). The grading travels with the widget, because a
            deadline without its evidence class is a rumor with a date on it. Full record:{" "}
            <Link href="/changes" className="text-brand-600 hover:text-brand-500">
              changes &amp; deadlines
            </Link>
            .{" "}
            <Link
              href="/embed/deadlines"
              target="_blank"
              className="text-brand-600 hover:text-brand-500"
            >
              Preview the widget
            </Link>
            .
          </p>
          <Snippet code={DEADLINES_SNIPPET} label="Embed code for the deadlines tracker" />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            3. Fitness &amp; health API market map
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Every product in the{" "}
            <Link href="/apis" className="text-brand-600 hover:text-brand-500">
              API directory
            </Link>{" "}
            as a compact tile, grouped by category, with a dot for how each bills developers — the
            same data as{" "}
            <Link href="/market-map" className="text-brand-600 hover:text-brand-500">
              the market map
            </Link>
            , without its filters. Nothing is ranked. The product made by the company that funds
            this site carries a marker saying so inside the widget, because an embed travels without
            the page&rsquo;s disclosure.{" "}
            <Link
              href="/embed/market-map"
              target="_blank"
              className="text-brand-600 hover:text-brand-500"
            >
              Preview the widget
            </Link>
            .
          </p>
          <Snippet code={MARKET_MAP_SNIPPET} label="Embed code for the market map" />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            4. &ldquo;Listed on AIFitnessAPI&rdquo; badge
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            A 200×40 SVG for anyone whose product we cover in the{" "}
            <Link href="/apis" className="text-brand-600 hover:text-brand-500">
              API directory
            </Link>
            . It is a link badge and nothing more: it says we have written about a product, not that
            we endorse, certify, rank or partner with it. Point it wherever makes sense — the
            directory, or your own page on it.
          </p>
          <p className="mt-4">
            {/* A route-served SVG, not an optimizable raster — next/image would
                add a loader for no benefit. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/badges/badge.svg"
              alt="Listed on AIFitnessAPI"
              width={200}
              height={40}
              loading="lazy"
            />
          </p>
          <Snippet code={BADGE_SNIPPET} label="HTML for the link badge" />
        </section>

        <section id="countdowns" className="mt-12 scroll-mt-24" data-countdown-list="">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Deadline countdowns</h2>
          <p className="mt-3 text-[var(--muted)]">
            A live countdown to one dated deadline, for a post or a status page: the end date of an API in{" "}
            <Link href="/graveyard" className="text-brand-600 hover:text-brand-500">
              the Fitness API Graveyard
            </Link>
            , or the next dated item for one product in{" "}
            <Link href="/changes" className="text-brand-600 hover:text-brand-500">
              the changes tracker
            </Link>
            . Every date is one of those two records&rsquo; own, at the precision the source gives: the count runs to
            00:00 UTC on a stated day, or to the last day of a stated month or year, and says which under the number.
            A stone&rsquo;s widget quotes the vendor; a product&rsquo;s widget shows whether its entry is confirmed or
            reported. Once a date passes, the widget says how long ago, rather than disappearing from your page.
          </p>
          <div className="mt-5 space-y-3">
            {countdownTargets().map((t) => (
              <CountdownEmbed key={t.id} id={t.id} />
            ))}
          </div>
        </section>

        <section id="tables" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            5. Any comparison or pricing table
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Every table on our{" "}
            {EMBED_TABLE_CLUSTERS.map((b, i) => (
              <span key={b}>
                {i > 0 && (i === EMBED_TABLE_CLUSTERS.length - 1 ? " and " : ", ")}
                <Link href={b} className="text-brand-600 hover:text-brand-500">
                  {clusterLabel(b)}
                </Link>
              </span>
            ))}{" "}
            pages — {tables.length} tables on {tablePages} pages — has a small{" "}
            <strong className="font-semibold text-[var(--fg)]">Embed</strong> button under it.
            It gives you the iframe code for that one table and a plain link for places that do
            not allow iframes. The widget shows the table as the page shows it, the date the page
            was last verified, and a link back to the page.
          </p>
          {example && (
            <>
              <p className="mt-3 text-[var(--muted)]">
                For example, table {example.table.n} of{" "}
                <Link
                  href={`${example.basePath}/${example.entry.slug}`}
                  className="text-brand-600 hover:text-brand-500"
                >
                  {example.entry.h1}
                </Link>
                .{" "}
                <Link
                  href={embedTablePath(example.basePath, example.entry.slug, example.table.n)}
                  target="_blank"
                  className="text-brand-600 hover:text-brand-500"
                >
                  Preview the widget
                </Link>
                .
              </p>
              <Snippet
                code={
                  embedSnippets({
                    basePath: example.basePath,
                    slug: example.entry.slug,
                    title: example.entry.h1,
                    n: example.table.n,
                    rows: example.table.rows,
                    section: example.table.section,
                  }).iframe
                }
                label="Example embed code for a pricing table"
              />
            </>
          )}
          <p className="mt-2 text-sm text-[var(--muted)]">
            The snippet ends with an ordinary link to the source page. Keep it: it is the
            attribution, and it is the part that still works where the frame does not load.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Live count badges</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            These read from the same data the pages render, so the number in your README is the
            number on the site. They change when the data changes — nothing to update by hand, and
            nothing that can quietly go stale while still looking current.
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            The <span className="font-medium text-[var(--fg)]">last verified</span>{" "}badge shows the
            most recent date something here was actually checked against a source, not today&rsquo;s
            date. A freshness badge that always reads &ldquo;today&rdquo; is decoration.
          </p>
          <div className="mt-6 space-y-6">
            {LIVE_BADGES.map((b) => (
              <div key={b.file}>
                <p className="flex flex-wrap items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/badges/${b.file}`} alt={b.alt} width={b.width} height={20} />
                  <span className="text-sm text-[var(--muted)]">{b.note}</span>
                </p>
                <Snippet
                  code={`[![${b.alt}](https://aifitnessapi.com/badges/${b.file})](${`https://aifitnessapi.com${b.href}`})`}
                  label={`Markdown for the ${b.alt} badge`}
                />
              </div>
            ))}
          </div>
        </section>

        <section id="status-badges" className="mt-14 scroll-mt-24" data-status-badges="">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">API status badges</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            One badge per API in{" "}
            <Link href="/graveyard" className="text-brand-600 hover:text-brand-500">
              the Fitness API Graveyard
            </Link>
            , for the README of a project that depends on it. The badge shows the API&rsquo;s name and the
            vendor&rsquo;s own words for its end, with the date at the precision the vendor gives (a day, a month or a
            year), never sharper. For an end that is still scheduled it adds the days left, and because that number is
            computed when this site is built, the badge names the day it was computed: &ldquo;(as of{" "}
            {asOf})&rdquo; on the current build. A cached copy can be out of date; it cannot pass for today&rsquo;s. A
            year or month counts to its last day and reads &ldquo;within&rdquo;; once the date is reached the badge
            says &ldquo;date passed&rdquo; and claims nothing the vendor has not announced.
          </p>
          <div className="mt-6 space-y-6">
            {GRAVEYARD.map((g) => {
              const b = stoneBadge(g, asOf);
              return (
                <div key={g.id} data-badge={stoneBadgePath(g.id)} data-badge-alt={badgeAlt(b)}>
                  <p className="flex flex-wrap items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stoneBadgePath(g.id)} alt={badgeAlt(b)} height={20} loading="lazy" />
                  </p>
                  <Snippet
                    code={badgeMarkdown(stoneBadgeAlt(g), stoneBadgePath(g.id), g.page?.href ?? `${GRAVEYARD_PATH}#${g.id}`)}
                    label={`Markdown for the ${g.name} status badge`}
                  />
                </div>
              );
            })}
          </div>

          <h3 className="mt-10 text-lg font-bold tracking-tight text-[var(--fg)]">Openness badges</h3>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The count from{" "}
            <Link href={OPENNESS_PATH} className="text-brand-600 hover:text-brand-500">
              the fitness API openness index
            </Link>
            : how many of eight developer basics the vendor&rsquo;s own pages document, out of those that apply. It is
            a count of what the pages read state, not a rating, and it links to the row with every quote.
          </p>
          <div className="mt-6 space-y-6">
            {opennessVendors().map((v) => {
              const b = opennessBadge(v);
              return (
                <div key={v.id} data-badge={opennessBadgePath(v.id)} data-badge-alt={badgeAlt(b)}>
                  <p className="flex flex-wrap items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={opennessBadgePath(v.id)} alt={badgeAlt(b)} height={20} loading="lazy" />
                  </p>
                  <Snippet
                    code={badgeMarkdown(opennessBadgeAlt(v), opennessBadgePath(v.id), `${OPENNESS_PATH}#${vendorAnchor(v.id)}`)}
                    label={`Markdown for the ${v.name} openness badge`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            What you are actually embedding
          </h2>
          <div className="mt-4 space-y-4 text-[var(--muted)]">
            <p>
              <strong className="font-semibold text-[var(--fg)]">It is our page inside yours.</strong>{" "}
              An iframe loads the widget from aifitnessapi.com at the moment your reader opens the
              page. You are not copying a snapshot — you are pointing at a live URL.
            </p>
            <p>
              <strong className="font-semibold text-[var(--fg)]">It changes when we change it.</strong>{" "}
              When a type identifier moves or a reported date firms up, the widget on your page
              shows the new version without you doing anything. That is the useful part and the
              risk, so it is worth saying out loud: there is no pinned version, and we do not
              publish versioned embed URLs.
            </p>
            <p>
              <strong className="font-semibold text-[var(--fg)]">There is no service behind it.</strong>{" "}
              These are static pages on the same host as the rest of the site. We are not promising
              uptime, a response time, or notice before a change, and there is no support contract
              attached. If that is not good enough for your page, link to{" "}
              <Link href="/matrix" className="text-brand-600 hover:text-brand-500">
                /matrix
              </Link>{" "}
              or{" "}
              <Link href="/changes" className="text-brand-600 hover:text-brand-500">
                /changes
              </Link>{" "}
              instead — a link never breaks in a layout.
            </p>
            <p>
              <strong className="font-semibold text-[var(--fg)]">The license is attribution.</strong>{" "}
              Use the widgets on commercial or personal sites, no permission needed, as long as the
              attribution link inside each one stays visible and intact. Do not restyle the frame to
              hide it, and do not present the content as your own research. If you would rather
              reproduce the table in your own markup, that is fine too — credit{" "}
              {site.name} and link the source page.
            </p>
            <p>
              <strong className="font-semibold text-[var(--fg)]">Where the numbers come from.</strong>{" "}
              Every cell in the table and every entry in the tracker traces to a primary source we
              read, with unverifiable claims marked as such rather than smoothed over.{" "}
              <Link href="/methodology" className="text-brand-600 hover:text-brand-500">
                How we verify and grade
              </Link>{" "}
              explains the rules the widgets inherit.
            </p>
            <p>
              The widget pages are <code className="text-xs">noindex</code> and canonical to their
              human pages, so embedding one cannot create a duplicate of our content competing with
              us — or with you — in search.
            </p>
          </div>
        </section>
      </div>
    </Container>
  );
}
