import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import ContentAge from "@/components/ContentAge";
import AnswerCapsule from "@/components/AnswerCapsule";
import { LIBRARIES_FETCHED_ON, type Library } from "@/data/libraries";
import {
  ECOSYSTEM_LABEL,
  LIBRARIES_BASE,
  LIBRARIES_VERIFIED_ON,
  daysBetween,
  lib,
  librariesModified,
} from "@/data/librariesEditorial";
import {
  LIBRARY_LANDINGS,
  getLibraryLanding,
  landingComparisons,
  landingDescription,
  landingNativeLinks,
  landingPackages,
  landingPath,
  landingTitle,
} from "@/data/librariesLandings";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, publishedDate, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";
import { Inline, LANGUAGE, githubUrl } from "./_shared";

/**
 * One landing page per framework or language under /libraries (the route
 * files in python/, react-native/, flutter/ and capacitor-cordova/ only name
 * their slug). Every row of the table comes from the generated registry data,
 * every sentence from src/data/librariesLandings.ts, which restates the
 * package notes and registry facts and asserts the ones its prose depends on.
 *
 * Each package row carries data-lib-row="<slug>": qa's LIBS-LANDING-ROWS holds
 * the built page to one row per package of the landing's groups, each linking
 * its package page.
 *
 * Like the rest of /libraries this is not a cluster, so there is no markdown
 * mirror and no text/markdown alternate.
 */

export function landingMetadata(slug: string): Metadata {
  const l = getLibraryLanding(slug);
  const title = landingTitle(l);
  const description = landingDescription(l);
  const canonical = landingPath(l);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { type: "website", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** The first sentence of a note, for a table cell. */
const firstSentence = (s: string) => `${s.split(". ")[0].replace(/\.$/, "")}.`;

/** What the registry itself says about the package's status; README-stated
 *  statuses are in "How to choose" and on each package page. */
function registryStatus(l: Library): string {
  const parts: string[] = [];
  if (l.deprecated) parts.push("Deprecated (registry)");
  if (l.registryStatus?.includes("Inactive")) parts.push("Inactive (PyPI classifier)");
  if (l.repoStats?.archived) parts.push(`Repository archived (GitHub, read ${l.repoStats.checkedOn})`);
  return parts.length ? parts.join(" · ") : "—";
}

const pill =
  "rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]";
const card =
  "group block h-full rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]";
const ext = "text-brand-600 hover:text-brand-500";

export function LandingPage({ slug }: { slug: string }) {
  const landing = getLibraryLanding(slug);
  const path = landingPath(landing);
  const url = absoluteUrl(path);
  const pages = landingPackages(landing);
  const comparisons = landingComparisons(landing);
  const nativeLinks = landingNativeLinks(landing);
  const others = LIBRARY_LANDINGS.filter((x) => x.slug !== landing.slug);
  const modified = librariesModified();
  const published = publishedDate(path.slice(1), modified);
  const title = landingTitle(landing);
  const description = landingDescription(landing);
  const faqId = (i: number) => `faq-${i + 1}`;

  const ecosystems = [...new Set(pages.map((p) => p.lib.ecosystem))];
  const ecoCounts = ecosystems.map((e) => `${pages.filter((p) => p.lib.ecosystem === e).length} ${ECOSYSTEM_LABEL[e]}`);
  const commitReads = [...new Set(pages.map((p) => p.lib.lastCommitOnDefaultBranch?.checkedOn).filter(Boolean))].sort();
  const githubReads = [...new Set(pages.map((p) => p.lib.repoStats?.checkedOn).filter(Boolean))].sort();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: title,
    alternativeHeadline: landing.primaryQuery,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    datePublished: published,
    dateModified: modified,
    lastReviewed: LIBRARIES_VERIFIED_ON,
    reviewedBy: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pages.length + comparisons.length,
      itemListElement: [
        ...pages.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.lib.name,
          url: absoluteUrl(`${LIBRARIES_BASE}/${p.lib.slug}`),
        })),
        ...comparisons.map((c, i) => ({
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
    mainEntity: landing.faqs.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#${faqId(i)}`,
      url: `${url}#${faqId(i)}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#${faqId(i)}` },
    })),
  };

  const nav: [string, string][] = [
    ["#packages", "Packages"],
    ["#choose", "How to choose"],
    ["#platform", "Platform rules"],
    ...(comparisons.length ? ([["#compare", "Comparisons"]] as [string, string][]) : []),
    ["#faq", "Questions"],
  ];

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Libraries", path: LIBRARIES_BASE },
            { name: landing.label, path },
          ]}
        />
        <ClusterHero label={`${landing.label} libraries`} seed={stringSeed(landing.slug)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{landing.h1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {pages.length} packages ({ecoCounts.join(", ")}) · {comparisons.length}{" "}
          {comparisons.length === 1 ? "comparison" : "comparisons"} · registries read {LIBRARIES_FETCHED_ON}
          <ContentAge date={LIBRARIES_FETCHED_ON} /> · README notes checked {LIBRARIES_VERIFIED_ON}
        </p>

        <AnswerCapsule>{landing.answer}</AnswerCapsule>

        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2 text-sm">
          {nav.map(([href, text]) => (
            <a key={href} href={href} className={pill}>
              {text}
            </a>
          ))}
        </nav>

        <section id="packages" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Every {landing.label} package on this list</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Read from the registries and repositories by a script, not typed by hand. Release dates are shown as dates,
            with the gap to our read, rather than as a verdict on whether a project is alive; what each README says about
            its own status is under How to choose and on each package page.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th scope="col" className="py-2 pr-4 font-semibold">Package</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Connects to</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Repository</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Latest release</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Licence</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Registry status</th>
                  <th scope="col" className="py-2 font-semibold">Last commit</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(({ lib: l, ed }) => {
                  const gap = daysBetween(l.latestPublished, LIBRARIES_FETCHED_ON);
                  const gh = githubUrl(l);
                  const repoName = l.repoFullName ?? l.repo;
                  const renamed = Boolean(l.repo && l.repoFullName && l.repo.toLowerCase() !== l.repoFullName.toLowerCase());
                  return (
                    <tr key={l.slug} data-lib-row={l.slug} className="border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4">
                        <Link
                          href={`${LIBRARIES_BASE}/${l.slug}`}
                          className="break-all font-mono text-[13px] font-semibold text-brand-600 hover:text-brand-500"
                        >
                          {l.name}
                        </Link>
                        <span className="block text-[11px] text-[var(--muted)]">
                          {ECOSYSTEM_LABEL[l.ecosystem]} · {LANGUAGE[l.ecosystem]}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                        {l.wraps ? l.wraps.join(", ") : <Inline text={firstSentence(ed.wraps.text)} />}
                      </td>
                      <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                        {gh && repoName ? (
                          <a href={gh} className={`break-all font-mono ${ext}`} rel="nofollow noreferrer" target="_blank">
                            {repoName}
                          </a>
                        ) : (
                          "not stated"
                        )}
                        {renamed && <span className="block text-[11px]">registry metadata names {l.repo}</span>}
                      </td>
                      <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                        <span className="font-mono">{l.latestVersion}</span>, {l.latestPublished}
                        <span className="block text-[11px]">
                          {gap <= 0 ? "day of our read" : `${gap.toLocaleString("en-US")} days before our read`}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs text-[var(--muted)]">{l.license ?? "not stated"}</td>
                      <td className="py-2 pr-4 text-xs text-[var(--muted)]">{registryStatus(l)}</td>
                      <td className="py-2 text-xs text-[var(--muted)]">
                        {l.lastCommitOnDefaultBranch?.date ?? "could not read"}
                        {l.lastCommitOnDefaultBranch && (
                          <span className="block text-[11px]">default branch, read {l.lastCommitOnDefaultBranch.checkedOn}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            {`Versions, dates and licences read from ${ecosystems.map((e) => ECOSYSTEM_LABEL[e]).join(" and ")} on ${LIBRARIES_FETCHED_ON}; last-commit dates read by git on ${commitReads.join(", ") || "no date"}; archive flags from the GitHub API, read ${githubReads.join(", ") || "never"}. This data records no download counts, so the table has no downloads column. Repository is the GitHub owner and name as GitHub reports it, which is how the data names a maintainer.`}
          </p>
        </section>

        <section id="choose" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How to choose: our reading</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Judgement, labelled as such, drawn only from the README notes and registry facts on each package’s page
            and from the comparisons. No package is ranked first.
          </p>
          <div className="mt-6 space-y-8">
            {landing.choose.map((c) => {
              const cmp = c.compare ? comparisons.find((x) => x.slug === c.compare) : undefined;
              return (
                <div key={c.heading}>
                  <h3 className="text-lg font-semibold text-[var(--fg)]">{c.heading}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {c.slugs.map((s, i) => (
                      <span key={s}>
                        {i > 0 && " · "}
                        <Link href={`${LIBRARIES_BASE}/${s}`} className={`font-mono ${ext}`}>
                          {lib(s).name}
                        </Link>
                      </span>
                    ))}
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--fg)]">
                    {c.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  {cmp && (
                    <p className="mt-3 text-sm">
                      <Link href={`${LIBRARIES_BASE}/compare/${cmp.slug}`} className={`font-medium ${ext}`}>
                        {cmp.h1}: side by side →
                      </Link>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section id="platform" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Platform rules these packages inherit</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            A wrapper inherits every rule of the API it calls. Each rule below is stated, with its sources, on the page it
            links.
          </p>
          <ul className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {landing.constraints.map((r) => (
              <li key={r.text} className="py-3">
                <p className="text-[var(--fg)]">{r.text}</p>
                <p className="mt-1 text-sm">
                  {r.links.map((k, i) => (
                    <span key={k.href}>
                      {i > 0 && " · "}
                      <Link href={k.href} className={ext}>
                        {k.label} →
                      </Link>
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {comparisons.length > 0 && (
          <section id="compare" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Side-by-side comparisons</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {comparisons.map((c) => (
                <li key={c.slug}>
                  <Link href={`${LIBRARIES_BASE}/compare/${c.slug}`} className={card}>
                    <span className="block break-words text-sm font-semibold text-[var(--fg)] group-hover:text-brand-600">
                      {c.h1} →
                    </span>
                    <span className="mt-1 block text-sm text-[var(--muted)]">{c.metaDescription}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {nativeLinks.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The APIs underneath</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">The pages these packages’ own pages point to for the API each one wraps.</p>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {nativeLinks.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={ext}>
                    {n.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {landing.faqs.map((f, i) => (
              <div key={f.q} id={faqId(i)} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav aria-label="Other languages and frameworks" className="mt-12">
          <h2 className="text-lg font-semibold text-[var(--fg)]">Other languages and frameworks</h2>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={landingPath(o)} className={pill}>
                  {o.h1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ClusterCta
          pitch="A wrapper release is usually where a new HealthKit or Health Connect type becomes reachable from your framework. Subscribe and we'll tell you when one ships or a package is deprecated."
          source="pillar-inline"
          id={`cta-libraries-${landing.slug}`}
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          {`Registry facts read by scripts/fetch-libraries.mjs on ${LIBRARIES_FETCHED_ON}; README notes checked on ${LIBRARIES_VERIFIED_ON}. README quotes and notes are each project's own statements; the selection, grouping and reading are ${site.name}'s, which publishes none of these packages.`}
        </p>

        <p className="mt-8 text-sm">
          <Link href={LIBRARIES_BASE} className={ext}>
            ← All health and fitness libraries
          </Link>
        </p>
      </div>
    </Container>
  );
}
