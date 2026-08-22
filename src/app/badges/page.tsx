import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { ROWS } from "@/data/matrix";

/**
 * The embed page: the two iframe widgets under /embed plus the link badge,
 * each with a copy-paste snippet.
 *
 * What this page must not do is oversell. An embed is our content living on
 * someone else's page — it changes when we change it, and we run no service
 * behind it. So the copy states that plainly instead of implying versioning,
 * uptime or an SLA we do not offer.
 */
const PAGE_PATH = "/badges";
const UPDATED = "2026-08-22";
const TITLE = "Fitness API Embeds & Badges";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · ${site.name}` },
  description:
    "Copy-paste widgets for your site: the HealthKit ↔ Health Connect type table, the fitness-API deadline tracker, and a small link badge. Attribution only.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Two embeddable widgets — the HealthKit ↔ Health Connect type table and the deadline tracker — plus a link badge. Free to use, attribution required.",
    url: PAGE_PATH,
  },
};

const MATRIX_SNIPPET = `<iframe src="https://aifitnessapi.com/embed/matrix"
        title="HealthKit and Health Connect data-type reference"
        width="100%" height="620" loading="lazy" style="border:0"></iframe>`;

const DEADLINES_SNIPPET = `<iframe src="https://aifitnessapi.com/embed/deadlines"
        title="Fitness API changes and deadlines"
        width="100%" height="460" loading="lazy" style="border:0"></iframe>`;

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

export default function BadgesPage() {
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
        <p className="mt-3 text-sm text-[var(--muted)]">Updated August 22, 2026</p>

        <AnswerCapsule>
          Two of our reference pages are available as iframe widgets you can drop into your own
          site — the HealthKit ↔ Health Connect type table and the dated fitness-API deadline
          tracker — plus a small badge if you just want to link back. All three are free. The only
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
            deadline without its evidence class is a rumour with a date on it. Full record:{" "}
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
            3. &ldquo;Listed on AIFitnessAPI&rdquo; badge
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
              <strong className="font-semibold text-[var(--fg)]">The licence is attribution.</strong>{" "}
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
