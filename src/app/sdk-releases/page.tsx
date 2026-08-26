import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import { SDK_REPOS, SDK_CHECKED_ON } from "@/data/sdkReleases";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";

/**
 * Release activity for the health-store bridge SDKs.
 *
 * Follows the empty-cluster rule: with no data the page 404s rather than
 * publishing an empty shell. The data can only be gathered in CI, so the
 * seeded state is genuinely empty and this page does not exist until the
 * first scheduled run lands.
 */

const PATH = "/sdk-releases";

export const metadata: Metadata = {
  title: { absolute: "Health SDK Release Tracker" },
  description:
    "Latest releases for the SDKs that bridge apps to Apple HealthKit and Android Health Connect, refreshed from the GitHub API.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: "Health SDK Release Tracker",
    description:
      "What shipped recently in the libraries that connect React Native and Android apps to the platform health stores.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

export default function SdkReleasesPage() {
  if (SDK_REPOS.length === 0) notFound();

  const url = absoluteUrl(PATH);
  const totalReleases = SDK_REPOS.reduce((n, r) => n + r.releases.length, 0);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Health SDK release tracker",
    itemListElement: SDK_REPOS.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.label,
      url: r.url,
    })),
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Health SDK release tracker",
    description: metadata.description,
    dateModified: SDK_CHECKED_ON ?? undefined,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "SDK releases", path: PATH }]} />
        <ClusterHero label="Tracker" seed={13} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Health SDK release tracker
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {SDK_REPOS.length} repositories · {totalReleases} releases
          {SDK_CHECKED_ON ? ` · checked ${SDK_CHECKED_ON}` : ""}
        </p>

        <div id="answer" className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6">
          Between your app and a platform health store sits a bridge library, and it is usually the
          bridge — not the platform — that decides which data types you can actually reach this
          month. This tracks the releases of those libraries, read from the GitHub API rather than
          from anybody&rsquo;s changelog prose. It deliberately covers the bridges only: the vendor
          APIs publish release notes that are not machine-readable, and this site does not publish
          what it cannot fetch. Our{" "}
          <Link href="/changes" className="font-medium text-brand-600 hover:text-brand-500">
            changes &amp; deadlines tracker
          </Link>{" "}
          carries the vendor-side events, each graded and sourced by hand.
        </div>

        <section className="mt-12 space-y-8">
          {SDK_REPOS.map((r) => (
            <div key={r.repo} id={r.repo.replace(/[^a-z0-9]+/gi, "-").toLowerCase()} className="scroll-mt-24 rounded-2xl border border-[var(--border)] p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-mono text-lg font-bold tracking-tight text-[var(--fg)]">{r.label}</h2>
                {r.archived && (
                  <span className="rounded-full border border-amber-400/50 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold">
                    archived
                  </span>
                )}
                {r.stars !== null && (
                  <span className="text-xs tabular-nums text-[var(--muted)]">{r.stars.toLocaleString()} stars</span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{r.why}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Bridges to: {r.covers}</p>

              {r.releases.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {r.releases.map((rel) => (
                    <li key={rel.tag} className="flex flex-wrap items-baseline gap-x-3 border-t border-[var(--border)] pt-2 text-sm">
                      <a href={rel.url} className="font-mono font-semibold text-brand-600 hover:text-brand-500" rel="nofollow">
                        {rel.tag}
                      </a>
                      {rel.publishedAt && <span className="tabular-nums text-xs text-[var(--muted)]">{rel.publishedAt}</span>}
                      {rel.prerelease && <span className="text-xs text-[var(--muted)]">pre-release</span>}
                      {rel.name && <span className="min-w-0 break-words text-[var(--muted)]">{rel.name}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted)]">
                  No tagged releases published. {r.pushedAt ? `Last push to the default branch: ${r.pushedAt}.` : ""}{" "}
                  A repository can be actively maintained without cutting releases — read the commit
                  history rather than assuming it is dormant.
                </p>
              )}
            </div>
          ))}
        </section>

        <ClusterCta
          pitch="Bridge releases are where HealthKit and Health Connect support actually lands. Subscribe and we'll tell you when one ships something that changes what your app can read."
          source="pillar-inline"
          id="cta-sdk-releases"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          Read from the GitHub Releases API by{" "}
          <code className="font-mono text-xs">scripts/fetch-sdk-releases.mjs</code> and refreshed on a
          schedule. The tracked list is short because every repository on it was verified to exist —
          it is not an attempt at a complete index. Compiled by {site.name}.
        </p>
      </div>
    </Container>
  );
}
