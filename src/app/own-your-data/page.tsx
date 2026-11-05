import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import HubFreshness from "@/components/HubFreshness";
import EntryBadge from "@/components/EntryBadge";
import HubJsonLd from "@/components/HubJsonLd";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import {
  getOwnYourData,
  releasedOwnYourData,
  OWN_DATA_PATH,
  OWN_DATA_CONFIG,
  NOTEBOOKS,
  notebookColabUrl,
  notebookGithubUrl,
  notebookRawPath,
} from "@/data/ownYourData";
import { LIBRARIES, LIBRARIES_FETCHED_ON } from "@/data/libraries";

/**
 * /own-your-data — the hub for people downloading their own data
 * (ops/AUDIENCE-30-2026-11-05.md item 11).
 *
 * Every cell in the table is a sentence from the vendor's own page, read
 * 2026-11-05 (the per-source pages carry the sources and quotes). WHOOP and
 * Withings have rows but no pages: their export help could not be read from
 * the writing environment, so their export cells say so and only what their
 * developer pages state is given.
 */

const UPDATED = "2026-11-05";
const TITLE = "Export Your Own Health and Fitness Data";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "How to download your own data from Apple Health, Health Connect, Samsung, Garmin, Fitbit, Oura, Polar, Strava, Suunto and COROS, from each vendor's docs.",
  alternates: { canonical: OWN_DATA_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Each platform's official export path, format and gaps, any personal-use API, the Python libraries, an in-browser Apple Health explorer and pandas notebooks.",
    url: OWN_DATA_PATH,
  },
};

const QUESTION_COUNT = releasedOwnYourData().reduce((n, e) => n + e.faqs.length, 0);

type Row = { source: string; slug?: string; export: string; format: string; api: string; apiHref?: string };

/** One row per source. Cells restate the source pages; see each page for quotes. */
const ROWS: Row[] = [
  {
    source: "Apple Health",
    slug: "apple-health-export",
    export: "iPhone Health app: Summary, your picture, Export All Health Data",
    format: "XML (Apple's guide)",
    api: "None for a person; HealthKit is read by apps on the device",
    apiHref: "/integrate/healthkit",
  },
  {
    source: "Health Connect",
    slug: "health-connect-export",
    export: "Settings: Health Connect, Manage data, Backup and restore, Scheduled export (Android 14+)",
    format: "A zip in your cloud storage, for restore; contents not documented",
    api: "None for a person; read by apps on the device",
    apiHref: "/health-connect-api",
  },
  {
    source: "Samsung Health",
    slug: "samsung-health-export",
    export: "Samsung Health: More options, Settings, Download personal data",
    format: "Files in My Files, Downloads, Samsung Health; format not stated",
    api: "Developer route only",
    apiHref: "/integrate/samsung-health-api",
  },
  {
    source: "Garmin Connect",
    slug: "garmin-connect-export",
    export: "Could not verify: Garmin's export help could not be read",
    format: "Personal API: activity JSON and FIT, health JSON",
    api: "Garmin's Personal API: a key from Garmin Connect web, pull only",
    apiHref: "/fix/garmin-api-personal-use",
  },
  {
    source: "Fitbit / Google Health",
    slug: "fitbit-google-health-export",
    export: "Google Account: Google Takeout with Google Health selected. Fitbit login: Data Export, Request Data",
    format: "Takeout zip or tgz; single GPS workouts as TCX",
    api: "Fitbit Web API Personal app type: your own account, intraday included",
    apiHref: "/integrate/fitbit-api",
  },
  {
    source: "Oura",
    slug: "oura-export",
    export: "Membership Hub: Export data, Request your data (any user, up to 10 days)",
    format: "Durations in seconds; fields per the Oura API V2 docs",
    api: "OAuth2 Oura API; personal access tokens deprecated",
    apiHref: "/fix/oura-personal-access-token-deprecated",
  },
  {
    source: "Polar",
    slug: "polar-flow-export",
    export: "account.polar.com: Download your data (two weeks to download)",
    format: "No activity or sleep summaries (derived data excluded)",
    api: "AccessLink: any registered Polar Flow user can create a client",
    apiHref: "/integrate/polar-api",
  },
  {
    source: "Strava",
    slug: "strava-export",
    export: "Strava.com: Settings, My Account, Download your account (website only)",
    format: "Per activity: original (often FIT), TCX, GPX",
    api: "New apps start in single-player mode (your account only)",
    apiHref: "/integrate/strava-api",
  },
  {
    source: "Suunto",
    slug: "suunto-export",
    export: "Suunto app, per workout: the three-dot menu",
    format: "FIT (everything) or GPX (location, time, heart rate); no-GPS workouts FIT only",
    api: "Not offered for personal use",
    apiHref: "/alternatives/suunto-api-alternatives",
  },
  {
    source: "COROS",
    slug: "coros-export",
    export: "Training Hub on a desktop: Activity List, Export Data; daily and sleep data by support request",
    format: "FIT or TCX by email",
    api: "Developer routes, compared in the integration guide",
    apiHref: "/integrate/coros-api",
  },
  {
    source: "WHOOP",
    export: "Could not verify: WHOOP's export help could not be read",
    format: "Could not verify",
    api: "WHOOP Developer Dashboard: create an App (up to 5), OAuth 2.0",
    apiHref: "/integrate/whoop-api",
  },
  {
    source: "Withings",
    export: "Could not verify: Withings's export help could not be read",
    format: "Could not verify",
    api: "Public API, which Withings says is designed for individuals and partners without a formal contract",
    apiHref: "/integrate/withings-api",
  },
];

/** The sources behind the two rows without a page (the pages list their own). */
const ROW_SOURCES = [
  { label: "WHOOP Developer Platform: Getting Started", url: "https://developer.whoop.com/docs/developing/getting-started/" },
  { label: "Withings developer site", url: "https://developer.withings.com/api-reference/" },
];

const FAQS = [
  {
    q: "Which fitness platforms let me download all of my own data myself?",
    a: "From the vendors' own help pages read on November 5, 2026: Apple Health (Export All Health Data on the iPhone), Health Connect (a scheduled zip export on Android 14 and up, for restoring), Samsung Health (Download personal data), Fitbit and Google Health (Google Takeout or Fitbit's Data Export), Oura (Membership Hub, for any user), Polar (account.polar.com, without derived activity and sleep), Strava (Download your account, on the website) and COROS (Training Hub, activities as FIT or TCX). Suunto documents per-workout FIT and GPX export. Garmin's, WHOOP's and Withings's export help could not be read for this page.",
  },
  {
    q: "Which wearables offer an API for a person's own data without a company contract?",
    a: "As their developer pages read on November 5, 2026 put it: Garmin's Personal API gives an individual a key from Garmin Connect web; the Fitbit Web API's Personal app type reads only the developer's own account; Strava apps start in single-player mode, limited to your own account, and need a Strava subscription; any registered Polar Flow user can create an AccessLink client; Withings describes its Public API as designed for individuals and partners without a formal contract. Oura's API works through OAuth2 now that personal access tokens are deprecated. Suunto does not offer its API for personal use.",
  },
  {
    q: "What is the easiest way to analyze a wearable data export in Python?",
    a: "Read the export into pandas, parse the dates, and roll up by day or week before charting. The notebooks on this page do that with pandas and matplotlib only: one streams an Apple Health export.zip with iterparse, one handles a one-row-per-day summary CSV, and one a one-row-per-workout CSV. They run on synthetic samples, so swap in your own file's path and column names.",
  },
];

const linkCls = "text-brand-600 hover:text-brand-500";

export default function OwnYourDataHub() {
  const released = releasedOwnYourData();
  if (released.length === 0) notFound();
  const url = absoluteUrl(OWN_DATA_PATH);
  const python = LIBRARIES.filter((l) => l.group === "python");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: metadata.description,
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@id": `${url}#collection` },
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#faq-${i + 1}`,
      url: `${url}#faq-${i + 1}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };

  return (
    <Container className="py-14">
      <HubJsonLd basePath={OWN_DATA_PATH} description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: OWN_DATA_CONFIG.hubLabel, path: OWN_DATA_PATH }]} />

        <ClusterHero label={OWN_DATA_CONFIG.hubLabel} seed={heroSeed(OWN_DATA_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Export your own health and fitness data
        </h1>

        <HubFreshness entries={released} basePath={OWN_DATA_PATH} />

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Most platforms let you download your own data, but each in its own place and shape. Apple
          Health exports an XML archive from the iPhone; Health Connect writes a scheduled zip to your
          cloud storage for restoring on another phone; Samsung Health, Oura, Polar, Strava and COROS
          prepare an archive on request; Fitbit data comes through Google Takeout once the account is a
          Google Account; Suunto exports one workout at a time. Several also offer an API for your own
          account: Garmin&rsquo;s Personal API, Fitbit&rsquo;s Personal app type, Strava&rsquo;s
          single-player mode and Polar&rsquo;s AccessLink. Each page here gives the vendor&rsquo;s own
          steps, what the export leaves out, and what could not be verified.
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Every source at a glance</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            From each vendor&rsquo;s help center or developer page, read {UPDATED}. &ldquo;Could not
            verify&rdquo; means the vendor&rsquo;s page could not be read from where this was written, not
            that the feature is missing.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                  <th className="py-2 pr-3 font-medium">Source</th>
                  <th className="py-2 pr-3 font-medium">Official export</th>
                  <th className="py-2 pr-3 font-medium">Format and gaps</th>
                  <th className="py-2 font-medium">API for your own data</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => {
                  const entry = r.slug ? getOwnYourData(r.slug) : undefined;
                  return (
                    <tr key={r.source} className="border-b border-[var(--border)] align-top">
                      <td className="py-3 pr-3 font-medium text-[var(--fg)]">
                        {entry ? (
                          <Link href={`${OWN_DATA_PATH}/${entry.slug}`} className={linkCls}>
                            {r.source}
                          </Link>
                        ) : (
                          r.source
                        )}
                      </td>
                      <td className="py-3 pr-3 text-[var(--muted)]">{r.export}</td>
                      <td className="py-3 pr-3 text-[var(--muted)]">{r.format}</td>
                      <td className="py-3 text-[var(--muted)]">
                        {r.apiHref ? (
                          <Link href={r.apiHref} className={linkCls}>
                            {r.api}
                          </Link>
                        ) : (
                          r.api
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Sources for the WHOOP and Withings rows:{" "}
            {ROW_SOURCES.map((s, i) => (
              <span key={s.url}>
                {i > 0 ? "; " : ""}
                <a href={s.url} className={linkCls} rel="noopener">
                  {s.label}
                </a>
              </span>
            ))}
            . Every other row&rsquo;s sources are listed on its page.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">One page per source</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {released.map((e) => (
              <li key={e.slug} className="min-w-0">
                <Link
                  href={`${OWN_DATA_PATH}/${e.slug}`}
                  className="flex h-full min-w-0 flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="font-semibold text-[var(--fg)] [overflow-wrap:anywhere]">{e.h1}</span>
                  <span className="mt-2 text-sm text-[var(--muted)]">{e.metaDescription}</span>
                  <EntryBadge updated={e.updated} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Look inside an Apple Health export</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The{" "}
            <Link href="/tools/apple-health-explorer" className={linkCls}>
              Apple Health export explorer
            </Link>{" "}
            opens your export.zip or export.xml in the browser, in a background worker that reads it in
            chunks, and lists every record type with its count, first and last date, units and sources,
            with a daily chart and a CSV download per type. The file never leaves your computer. A
            synthetic sample is one click away if you want to try it first.
          </p>
        </section>

        <section id="notebooks" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Analysis notebooks</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Three Jupyter notebooks that use only pandas and matplotlib. Each one was run against this
            site&rsquo;s synthetic samples before publishing, so the outputs you see on GitHub are real
            runs. The samples are generated data, labeled synthetic in their first line, and the CSVs use
            column names chosen here, not any vendor&rsquo;s layout: point the notebook at your own file
            and adjust the column names it lists at the top.
          </p>
          <ul className="mt-5 space-y-4">
            {NOTEBOOKS.map((n) => (
              <li key={n.file} className="rounded-2xl border border-[var(--border)] p-5">
                <p className="font-semibold text-[var(--fg)]">{n.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Reads {n.reads}; {n.does}.
                </p>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <a href={notebookColabUrl(n)} className={linkCls} rel="noopener">
                    Open in Colab
                  </a>
                  <a href={notebookGithubUrl(n)} className={linkCls} rel="noopener">
                    View on GitHub
                  </a>
                  <a href={notebookRawPath(n)} className={linkCls} download>
                    Download .ipynb
                  </a>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Synthetic inputs:{" "}
            <a href="/samples/apple-health-export-synthetic.zip" className={linkCls} download>
              apple-health-export-synthetic.zip
            </a>
            ,{" "}
            <a href="/notebooks/data/daily-summary-synthetic.csv" className={linkCls} download>
              daily-summary-synthetic.csv
            </a>
            ,{" "}
            <a href="/notebooks/data/activities-synthetic.csv" className={linkCls} download>
              activities-synthetic.csv
            </a>
            . Generated by <code className="font-mono">scripts/build-own-data-samples.mjs</code>{" "}from a fixed seed; not anyone&rsquo;s data.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Python libraries</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The Python packages this site tracks are clients for vendors&rsquo; web APIs. Registry facts as
            read on {LIBRARIES_FETCHED_ON}; each links to its page with license, repository activity and
            caveats. The full comparison is{" "}
            <Link href="/libraries/python" className={linkCls}>
              Python libraries for fitness APIs
            </Link>
            .
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {python.map((l) => (
              <li key={l.slug}>
                <Link href={`/libraries/${l.slug}`} className={`font-mono ${linkCls}`}>
                  {l.name}
                </Link>{" "}
                {l.latestVersion} ({l.latestPublished}){l.description ? `: ${l.description}` : ""}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <h3 className="text-base font-semibold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--muted)]">
            <Link href="/questions/own-your-data" className={linkCls}>
              All {QUESTION_COUNT} questions in {OWN_DATA_CONFIG.hubLabel}, answered
            </Link>
          </p>
        </section>

        <ClusterDisclaimer updated={UPDATED} />

        <ClusterCta
          pitch="Export options, personal-use APIs and the libraries around them change without notice. We track the changes that decide whether you can still get your data out."
          source="pillar-inline"
          id="cta-own-your-data"
        />
      </div>
    </Container>
  );
}
