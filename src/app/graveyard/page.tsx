import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import ContentAge from "@/components/ContentAge";
import CopySnippet from "@/components/CopySnippet";
import Graveyard from "@/components/Graveyard";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { PAGE_H1 } from "@/data/pageTitles";
import { graveyardCopy } from "@/lib/graveyardCopy";
import {
  fmtGraveDate,
  GRAVEYARD_EMBED_PATH,
  GRAVEYARD_JSON_PATH,
  GRAVEYARD_PATH,
  graveyardSorted,
  graveyardVendors,
} from "@/data/graveyard";

/**
 * The Fitness API Graveyard: the Killed-by-Google pattern for fitness and
 * health developer APIs, drawn from src/data/graveyard.ts and nothing else.
 *
 * Every stone quotes its vendor (the sourcing rule is in the data module's
 * header and held by qa's GRAVEYARD-* gates). dateModified is the newest day
 * an entry's source was read, so the sitemap row and this page agree.
 *
 * Static: the grid, filters, countdowns and share cards run in the browser;
 * the JSON download is written once per build by ./data.json/route.ts.
 */

const H1 = PAGE_H1[GRAVEYARD_PATH];
const META_TITLE = "Fitness API Graveyard: Shut-Down Health & Fitness APIs";
const DESCRIPTION =
  "Shut-down, dying and deprecated fitness and health APIs, from Fitbit and Google Fit to Oura and Strava: end dates, replacements, each vendor's own words.";

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: DESCRIPTION,
  alternates: { canonical: GRAVEYARD_PATH },
  openGraph: {
    type: "website",
    title: "The Fitness API Graveyard",
    description:
      "Every fitness and health API we could source that has been shut down, is about to be, or is deprecated, with the vendor's own words.",
    url: GRAVEYARD_PATH,
  },
};

const EMBED_SNIPPET = `<iframe src="${absoluteUrl(GRAVEYARD_EMBED_PATH)}"
        title="The Fitness API Graveyard"
        width="100%" height="640" loading="lazy" style="border:0"></iframe>`;

export default function GraveyardPage() {
  const url = absoluteUrl(GRAVEYARD_PATH);
  const entries = graveyardSorted();
  const { checkedOn, capsule, faqs } = graveyardCopy();
  const vendors = graveyardVendors();

  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: H1,
    description: DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    dateModified: checkedOn,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    citation: [...new Set(entries.map((e) => e.source.url))].map((u) => ({ "@type": "WebPage", url: u })),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: entries.length,
      itemListElement: entries.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${e.name} (${e.vendor})`,
        url: `${url}#${e.id}`,
      })),
    },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f, i) => ({
      "@type": "Question",
      name: f.q,
      url: `${url}#faq-${i + 1}`,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "API Graveyard", path: GRAVEYARD_PATH }]} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {entries.length} APIs, SDKs and endpoints from {vendors.length} vendors · sources read{" "}
          {fmtGraveDate(checkedOn)}
          <ContentAge date={checkedOn} staleAfterDays={30} />
        </p>

        <AnswerCapsule>{capsule}</AnswerCapsule>
      </div>

      <section className="mx-auto mt-10 max-w-6xl" aria-labelledby="graves-heading">
        <h2 id="graves-heading" className="sr-only">
          The graveyard
        </h2>
        <Graveyard entries={entries} vendors={vendors} pageUrl={url} />
      </section>

      <div className="mx-auto max-w-3xl">
        <section className="mt-14" id="method">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How an API gets a stone</h2>
          <div className="mt-4 space-y-3 leading-relaxed text-[var(--muted)]">
            <p>
              <strong className="font-semibold text-[var(--fg)]">The vendor&rsquo;s words or nothing.</strong>{" "}Every
              entry quotes a passage from the vendor&rsquo;s own documentation, changelog, specification or blog,
              read on the date the stone shows. Where the vendor has taken its notice down, the source is an Internet
              Archive capture of the vendor&rsquo;s page, with the capture date. Shutdowns we know of but could not
              read on a vendor page this way are not here yet; press coverage is not a source.
            </p>
            <p>
              <strong className="font-semibold text-[var(--fg)]">Dates are never sharpened.</strong>{" "}&ldquo;Until
              the end of 2026&rdquo; is recorded as 2026, and its countdown says it counts to the end of the year.
              Launch dates appear only where a primary record dates them, such as a package&rsquo;s first publication
              on npm; otherwise the stone shows a question mark.
            </p>
            <p>
              <strong className="font-semibold text-[var(--fg)]">Endpoints count.</strong>{" "}A removed endpoint breaks
              an integration as surely as a removed API, so Strava&rsquo;s retired endpoints sit beside whole
              platforms. Symbol-level deprecations inside a live SDK, such as renamed HealthKit identifiers, are left
              to the reference pages.
            </p>
            <p>
              Dated changes that are not endings, such as pricing and terms changes, are on the{" "}
              <Link href="/changes" className="font-medium text-brand-600 hover:text-brand-500">
                changes and deadlines tracker
              </Link>
              . The two deadlines most readers arrive for have their own pages:{" "}
              <Link href="/fitbit-api-shutdown" className="font-medium text-brand-600 hover:text-brand-500">
                the Fitbit Web API turn-off
              </Link>{" "}
              and{" "}
              <Link href="/google-fit-shutdown" className="font-medium text-brand-600 hover:text-brand-500">
                the Google Fit end of support
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mt-12" id="download">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Download the data</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Every entry, with its status, dates, replacement, source URL, check date and quote, as one JSON file
            written at each build:{" "}
            <a href={GRAVEYARD_JSON_PATH} className="font-medium text-brand-600 hover:text-brand-500">
              graveyard/data.json
            </a>
            . Our fields are free to reuse with a link to this page; the quoted passages belong to their publishers.
          </p>
        </section>

        <section className="mt-12" id="embed">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Embed the graveyard</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            A compact list for your own article or docs, without the site chrome, with each entry&rsquo;s status,
            end date and replacement and a link back here. It shows the graveyard as it stands when your reader opens
            it.{" "}
            <Link href={GRAVEYARD_EMBED_PATH} target="_blank" className="text-brand-600 hover:text-brand-500">
              Preview the widget
            </Link>
            . Other widgets:{" "}
            <Link href="/badges" className="text-brand-600 hover:text-brand-500">
              embeds &amp; badges
            </Link>
            .
          </p>
          <CopySnippet code={EMBED_SNIPPET} label="Embed code for the Fitness API Graveyard" />
        </section>

        <section className="mt-14" id="faq">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {faqs.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Related</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/changes", label: "Fitness API changes & deadlines tracker" },
              { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown: what's confirmed" },
              { href: "/google-fit-shutdown", label: "Google Fit shutdown: timeline and paths" },
              { href: "/migrate/migrate-off-a-deprecated-fitness-api", label: "Migrate off a deprecated fitness API" },
            ].map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="block rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-xs leading-relaxed text-[var(--muted)]">
          By {site.name}. Product and company names are trademarks of their respective owners; quoted passages are
          the publishers&rsquo; own words, reproduced to attribute each date. Vendors change their notices: check the
          linked source before you plan around a date.
        </p>
      </div>
    </Container>
  );
}
