import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import ContentAge from "@/components/ContentAge";
import AnswerCapsule from "@/components/AnswerCapsule";
import { LIBRARIES_FETCHED_ON } from "@/data/libraries";
import {
  LIBRARIES_BASE,
  LIBRARIES_VERIFIED_ON,
  LIBRARY_COMPARISONS,
  LIBRARY_GROUPS,
  LIBRARIES_HUB_FAQS as FAQS,
  ECOSYSTEM_LABEL,
  daysBetween,
  libraryPages,
  librariesModified,
} from "@/data/librariesEditorial";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * The hub for open-source health and fitness packages.
 *
 * Grouped by the framework a reader arrives with, because that is the first
 * filter anyone applies: a Flutter developer does not want to wade through
 * Capacitor plugins. Within a group, the table shows dates rather than a
 * health verdict — "N days before our read" is a fact; "maintained" would be
 * our opinion, and the README-stated status (deprecated, inactive, frozen)
 * is shown on each package page in the project's own words.
 *
 * No markdown mirror exists for this section (it is not a cluster), so the
 * CollectionPage carries no `encoding` and there is no text/markdown link.
 */

const TITLE = "Open-Source Health & Fitness Libraries";
const DESCRIPTION =
  "Open-source packages for HealthKit, Health Connect and fitness APIs: latest versions, release dates, licences and README caveats, read from the registries.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: LIBRARIES_BASE },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: LIBRARIES_BASE },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};


export default function LibrariesHub() {
  const pages = libraryPages();
  const url = absoluteUrl(LIBRARIES_BASE);
  const modified = librariesModified();
  const deprecatedCount = pages.filter((p) => p.lib.deprecated || p.lib.registryStatus?.includes("Inactive")).length;
  const byEco = (e: string) => pages.filter((p) => p.lib.ecosystem === e).length;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    dateModified: modified,
    lastReviewed: LIBRARIES_VERIFIED_ON,
    reviewedBy: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pages.length + LIBRARY_COMPARISONS.length,
      itemListElement: [
        ...pages.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.lib.name,
          url: absoluteUrl(`${LIBRARIES_BASE}/${p.lib.slug}`),
        })),
        ...LIBRARY_COMPARISONS.map((c, i) => ({
          "@type": "ListItem",
          position: pages.length + i + 1,
          name: c.h1,
          url: absoluteUrl(`${LIBRARIES_BASE}/compare/${c.slug}`),
        })),
      ],
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Libraries", path: LIBRARIES_BASE }]} />
        <ClusterHero label="Open-source libraries" seed={11} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Open-source health and fitness libraries
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {pages.length} packages ({byEco("npm")} npm, {byEco("pub")} pub.dev, {byEco("pypi")} PyPI) ·{" "}
          {LIBRARY_COMPARISONS.length} comparisons · registries read {LIBRARIES_FETCHED_ON}
          <ContentAge date={LIBRARIES_FETCHED_ON} />
        </p>

        <AnswerCapsule>
          Most apps reach Apple HealthKit or Android Health Connect through an open-source wrapper rather
          than native code, and the wrapper decides which data types, frameworks and OS versions you get.
          This page tracks {pages.length} packages — wrappers for React Native, Capacitor, Cordova and
          Flutter, plus Python clients for vendor APIs — with every version, date and licence read from
          npm, pub.dev and PyPI by a script. {deprecatedCount} of them are marked deprecated or inactive in their own registry
          entry, and several more carry a status note in their README — each page quotes it in the
          project&rsquo;s words.
        </AnswerCapsule>

        <nav aria-label="Platforms" className="mt-6 flex flex-wrap gap-2 text-sm">
          {LIBRARY_GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              {g.label}{" "}
              <span className="font-semibold tabular-nums text-[var(--fg)]">
                {pages.filter((p) => p.lib.group === g.id).length}
              </span>
            </a>
          ))}
          <a
            href="#compare"
            className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
          >
            Comparisons
          </a>
        </nav>

        {LIBRARY_GROUPS.map((g) => {
          const rows = pages.filter((p) => p.lib.group === g.id);
          return (
            <section key={g.id} id={g.id} className="mt-14 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{g.label}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{g.blurb}</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                      <th scope="col" className="py-2 pr-4 font-semibold">Package</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Wraps</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Latest</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Published</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Licence</th>
                      <th scope="col" className="py-2 font-semibold">Registry status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ lib: l }) => {
                      const gap = daysBetween(l.latestPublished, LIBRARIES_FETCHED_ON);
                      return (
                        <tr key={l.slug} className="border-b border-[var(--border)] align-top">
                          <td className="py-2 pr-4">
                            <Link
                              href={`${LIBRARIES_BASE}/${l.slug}`}
                              className="break-all font-mono text-[13px] font-semibold text-brand-600 hover:text-brand-500"
                            >
                              {l.name}
                            </Link>
                            <span className="block text-[11px] text-[var(--muted)]">{ECOSYSTEM_LABEL[l.ecosystem]}</span>
                          </td>
                          <td className="py-2 pr-4 text-xs text-[var(--muted)]">{l.wraps?.join(", ") ?? "—"}</td>
                          <td className="py-2 pr-4 font-mono text-xs text-[var(--muted)]">{l.latestVersion}</td>
                          <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                            {l.latestPublished}
                            <span className="block text-[11px]">
                              {gap <= 0 ? "day of our read" : `no release in the ${gap.toLocaleString("en-US")} days to our read`}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-xs text-[var(--muted)]">{l.license ?? "not stated"}</td>
                          <td className="py-2 text-xs text-[var(--muted)]">
                            {l.deprecated
                              ? "Deprecated (registry)"
                              : l.registryStatus?.includes("Inactive")
                                ? "Inactive (PyPI classifier)"
                                : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <section id="compare" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Side-by-side comparisons</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Only for packages that answer the same need on the same platform. Facts from the registries, points from
            each README, and no winner row.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {LIBRARY_COMPARISONS.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`${LIBRARIES_BASE}/compare/${c.slug}`}
                  className="group block h-full rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="block break-words text-sm font-semibold text-[var(--fg)] group-hover:text-brand-600">{c.h1} →</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">{c.metaDescription}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The native layer and the release record</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                href: "/integrate/healthkit",
                name: "HealthKit integration guide",
                blurb: "What every iOS wrapper here calls into, and the behaviour no wrapper can hide.",
              },
              {
                href: "/integrate/google-health-connect",
                name: "Health Connect integration guide",
                blurb: "The Android API the Health Connect wrappers sit on: permissions, records, history.",
              },
              {
                href: "/sdk-releases",
                name: "SDK release tracker",
                blurb: "Tagged GitHub releases for the main bridges, refreshed daily from the GitHub API.",
              },
            ].map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="group block h-full rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="block text-sm font-semibold text-[var(--fg)] group-hover:text-brand-600">{t.name} →</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">{t.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterCta
          pitch="A wrapper release is usually where a new HealthKit or Health Connect type becomes reachable from your framework. Subscribe and we'll tell you when one ships or a package is deprecated."
          source="pillar-inline"
          id="cta-libraries"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          Read by <code className="font-mono text-xs">scripts/fetch-libraries.mjs</code> from the npm registry,
          pub.dev, PyPI and the packages&rsquo; repositories, and refreshed weekly. The list is curated, not
          exhaustive: packages that were placeholders, empty, or had no repository were left out. README notes on
          each page were checked on {LIBRARIES_VERIFIED_ON}. Compiled by {site.name}, which publishes none of these
          packages.
        </p>
      </div>
    </Container>
  );
}
