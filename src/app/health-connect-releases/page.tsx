import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import {
  HC_RELEASES,
  HC_RELEASES_FETCHED_ON,
  HC_RELEASES_SOURCE,
  HC_RELEASES_SOURCE_UPDATED,
  type HcRelease,
  type HcReleaseStage,
} from "@/data/hcReleases";
import { absoluteUrl } from "@/lib/site";
import { CAPSULE, FaqSection, JsonLd, LINK, TH, articleGraph, count, faqGraph, listOf, site, type Faq } from "../error-codes/_shared";

/**
 * Every androidx.health.connect:connect-client release, from Google's
 * Jetpack release notes. Generated from src/data/hcReleases.ts
 * (scripts/fetch-hc-releases.mjs); every number in the copy is computed.
 *
 * Google files releases by series, not by date (1.2.0-alpha01 shipped before
 * 1.1.0 stable), so "newest" here always means newest by date, computed.
 */

const PATH = "/health-connect-releases";
const TITLE = "Health Connect SDK Releases: connect-client";
const FETCHED = HC_RELEASES_FETCHED_ON;
const ARTIFACT = "androidx.health.connect:connect-client";

const ALL = HC_RELEASES;
const byDateDesc = (a: HcRelease, b: HcRelease) => (b.date ?? "").localeCompare(a.date ?? "");
const NEWEST = [...ALL].sort(byDateDesc)[0];
const OLDEST = [...ALL].sort(byDateDesc).at(-1)!;
const STABLE = ALL.filter((r) => r.stage === "stable").sort(byDateDesc);
const LATEST_STABLE = STABLE[0];
const FIRST_STABLE = STABLE.at(-1);
const SERIES = [...new Set(ALL.map((r) => r.series))];
const STAGES: HcReleaseStage[] = ["alpha", "beta", "rc", "stable"];
const STAGE_LABEL: Record<HcReleaseStage, string> = {
  alpha: "alpha",
  beta: "beta",
  rc: "release candidate",
  stable: "stable",
};
const stageCount = (s: HcReleaseStage) => ALL.filter((r) => r.stage === s).length;
const STABLE_SERIES = new Set(STABLE.map((r) => r.series));
const NEVER_STABLE_SERIES = SERIES.filter((s) => !STABLE_SERIES.has(s));
const MIGRATED = OLDEST.headings.some((h) => /^Migration/i.test(h));
const byDateAsc = (a: HcRelease, b: HcRelease) => (a.date ?? "").localeCompare(b.date ?? "");
const SERIES_1_0 = ALL.filter((r) => r.series === "1.0").sort(byDateAsc);
const FIRST_OF_1_0 = SERIES_1_0[0];
const LAST_OF_1_0 = SERIES_1_0.at(-1);
const AFTER_1_0 = LAST_OF_1_0
  ? ALL.filter((r) => r.series !== "1.0" && (r.date ?? "") > (LAST_OF_1_0.date ?? "")).sort(byDateAsc)[0]
  : undefined;

function monthsBetween(a: string, b: string): number {
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return (by - ay) * 12 + (bm - am);
}

const DESCRIPTION = `All ${ALL.length} connect-client releases from Google's Jetpack notes: version, date, stage and what changed. Latest stable ${LATEST_STABLE?.version ?? "none"}, newest ${NEWEST.version}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS: Faq[] = [
  {
    q: "What is the latest stable version of the Health Connect Jetpack library?",
    a: LATEST_STABLE
      ? `${LATEST_STABLE.version}, released ${LATEST_STABLE.dateText}, per Google's release notes as read on ${FETCHED}. Google's note for it: “${LATEST_STABLE.releaseSentence}”`
      : `None: no stable ${ARTIFACT} release appears in Google's release notes as read on ${FETCHED}.`,
  },
  {
    q: "What is the newest connect-client release?",
    a: `${NEWEST.version} (${STAGE_LABEL[NEWEST.stage]}), dated ${NEWEST.dateText}.${
      NEWEST.firstNote ? ` Its notes open with: “${NEWEST.firstNote}”` : ""
    } ${
      NEWEST.stage !== "stable"
        ? `It is a pre-release; the newest stable build is ${LATEST_STABLE?.version ?? "not yet published"}.`
        : ""
    }`.trim(),
  },
  {
    q: "Was there ever a connect-client 1.0.0 stable release?",
    a: ALL.some((r) => r.version === "1.0.0")
      ? `Yes — 1.0.0 appears in Google's release notes.`
      : `No. On Google's page the 1.0 series runs from ${FIRST_OF_1_0?.version} to ${LAST_OF_1_0?.version} and stops; the next release by date is ${AFTER_1_0?.version} (${AFTER_1_0?.dateText}). ${
          FIRST_STABLE ? `The first stable connect-client is ${FIRST_STABLE.version} (${FIRST_STABLE.dateText}).` : ""
        }${NEVER_STABLE_SERIES.length ? ` Series with no stable release: ${listOf(NEVER_STABLE_SERIES)}.` : ""}`,
  },
  {
    q: "How long did connect-client take to reach a stable release?",
    a:
      FIRST_STABLE?.date && OLDEST.date
        ? `About ${monthsBetween(OLDEST.date, FIRST_STABLE.date)} months, counted from ${OLDEST.version} (${OLDEST.dateText}), the first release under this coordinate, to ${FIRST_STABLE.version} (${FIRST_STABLE.dateText}). In between Google shipped ${
            ALL.filter((r) => r.date && r.date > OLDEST.date! && r.date < FIRST_STABLE.date! && r.stage !== "stable").length
          } pre-releases.`
        : `It has not: no stable release appears in the ${FETCHED} read.`,
  },
  ...(MIGRATED
    ? [
        {
          q: "Why does the connect-client history start at 1.0.0-alpha04?",
          a: `Because that is where the coordinate begins. Google's notes for ${OLDEST.version} carry a “${OLDEST.headings.find((h) => /^Migration/i.test(h))}” section: the library previously shipped as androidx.health:health-connect-client, and moved to ${ARTIFACT} at that release. Earlier versions are on Google's androidx.health release page, not this one.`,
        },
      ]
    : []),
];

export default function HealthConnectReleasesPage() {
  const url = absoluteUrl(PATH);
  return (
    <Container className="py-14">
      <JsonLd
        data={articleGraph({ path: PATH, title: TITLE, description: DESCRIPTION, modified: FETCHED, section: "Health Connect" })}
      />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Health Connect SDK releases", path: PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Health Connect SDK releases
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {count(ALL.length, "release")} · newest {NEWEST.version} ({NEWEST.date}) · last fetched from Google&rsquo;s
          release notes on {FETCHED}
          <ContentAge date={FETCHED} />
        </p>

        <p id="answer" className={CAPSULE}>
          Google has published {ALL.length} releases of <code className="font-mono text-base">{ARTIFACT}</code>, from{" "}
          {OLDEST.version} ({OLDEST.dateText}) to {NEWEST.version} ({NEWEST.dateText}).{" "}
          {LATEST_STABLE
            ? `${STABLE.length} ${STABLE.length === 1 ? "is" : "are"} stable — the latest stable is ${LATEST_STABLE.version} (${LATEST_STABLE.dateText}). `
            : "None is stable yet. "}
          The rest are {listOf(STAGES.filter((s) => s !== "stable" && stageCount(s)).map((s) => `${stageCount(s)} ${STAGE_LABEL[s]}`))}{" "}
          builds.
          {NEWEST.stage !== "stable" && ` The ${NEWEST.series} series is still in ${STAGE_LABEL[NEWEST.stage]}.`}
        </p>

        <PageActions path={PATH} url={url} title={TITLE} updated={FETCHED} markdown={false} />

        <p className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm leading-relaxed text-[var(--muted)]">
          The errors the library documents are listed on{" "}
          <Link href="/error-codes/health-connect" className={LINK}>
            Health Connect error codes
          </Link>
          . Community SDKs that wrap Health Connect for React Native and other stacks are tracked separately on{" "}
          <Link href="/sdk-releases" className={LINK}>
            the health SDK release tracker
          </Link>
          .
        </p>

        <section id="stages" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">By stage</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The stage is read from the version string: an <code className="font-mono text-sm">-alphaNN</code>,{" "}
            <code className="font-mono text-sm">-betaNN</code> or <code className="font-mono text-sm">-rcNN</code> suffix,
            and none for stable.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STAGES.map((s) => (
              <div key={s} className="rounded-xl border border-[var(--border)] p-4">
                <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{STAGE_LABEL[s]}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-[var(--fg)]">{stageCount(s)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {SERIES.map((series) => {
          const rows = ALL.filter((r) => r.series === series);
          return (
            <section key={series} id={`series-${series.replace(".", "-")}`} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
                {series} series — {count(rows.length, "release")}
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left">
                      <th className={TH}>Version</th>
                      <th className={TH}>Date</th>
                      <th className={TH}>Stage</th>
                      <th className="py-2 font-semibold text-[var(--fg)]">What Google&rsquo;s notes cover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.version} id={`release-${r.version}`} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                        <td className="py-3 pr-4">
                          <a href={r.url} rel="nofollow" className="font-mono text-xs font-semibold text-[var(--fg)] hover:text-brand-600">
                            {r.version}
                          </a>
                        </td>
                        <td className="whitespace-nowrap py-3 pr-4 tabular-nums text-[var(--muted)]">{r.date ?? "—"}</td>
                        <td className="py-3 pr-4 text-[var(--muted)]">{STAGE_LABEL[r.stage]}</td>
                        <td className="py-3 text-[var(--muted)]">
                          {r.headings.length > 0 && (
                            <span className="block text-xs font-semibold text-[var(--fg)]">{r.headings.join(" · ")}</span>
                          )}
                          {r.firstNote ? (
                            <span className="mt-0.5 block text-xs leading-relaxed">
                              {r.firstNote}
                              {r.noteCount > 1 && ` (+${r.noteCount - 1} more)`}
                            </span>
                          ) : (
                            <span className="mt-0.5 block text-xs leading-relaxed">{r.releaseSentence}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <FaqSection faqs={FAQS} />

        <p className="mt-12 text-sm text-[var(--muted)]">
          Read from Google&rsquo;s{" "}
          <a href={HC_RELEASES_SOURCE} rel="nofollow" className={LINK}>
            Health Connect release notes
          </a>{" "}
          on {FETCHED}
          {HC_RELEASES_SOURCE_UPDATED && ` (the page's footer says it was last updated ${HC_RELEASES_SOURCE_UPDATED})`} by{" "}
          <code className="font-mono text-xs">scripts/fetch-hc-releases.mjs</code>. Releases of the companion
          connect-testing artifact on the same page are excluded. Compiled by {site.name}; Google&rsquo;s release notes
          remain the authority.
        </p>
      </div>
    </Container>
  );
}
