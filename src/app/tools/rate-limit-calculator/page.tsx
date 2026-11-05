import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import MoreTools from "@/components/tools/MoreTools";
import ToolNextStep from "@/components/ToolNextStep";
import RateLimitCalculator from "@/components/tools/RateLimitCalculator";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";
import { RATE_LIMIT_VENDORS } from "@/lib/rateLimitCalc.mjs";
import { GHAPI_UNVERIFIED_USER_CAP } from "@/lib/ghapiCoverage";
import {
  ALL_NOT_DOCUMENTED,
  ALL_RATE_VENDORS,
  COVERAGE_PATH,
  RATE_CHECKED,
  RATE_LIMIT_PATH,
  RATE_UPDATED,
  limitRows,
  rateLimitCapsule,
} from "@/lib/coverageView";

/**
 * "Will my sync schedule fit under this API's rate limit?" The arithmetic is
 * lib/rateLimitCalc.mjs (scripts/rate-limit-calc.test.mjs); every limit is a
 * number quoted from the vendor's page via its integration guide's evidence
 * file, or from the generated Google Health API dataset. Vendors that publish
 * no number are listed as not documented, never estimated.
 */

const TITLE = "Wearable API Rate-Limit Calculator";
const DESCRIPTION =
  "Users × sync frequency × endpoints against WHOOP, Strava, Oura, Polar, Withings, Google Health and more: which documented limit binds first, what to do.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageMirrorAlternates(RATE_LIMIT_PATH),
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Requests per window against each fitness API's documented rate limits, with the limit that binds first and the vendor's own mitigations. Runs in your browser.",
    url: RATE_LIMIT_PATH,
    images: ["/opengraph-image"],
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const unlimited = RATE_LIMIT_VENDORS.filter((v) => v.unlimited);

export default function RateLimitCalculatorPage() {
  const jsonLd = toolGraph({
    path: RATE_LIMIT_PATH,
    name: TITLE,
    alternativeHeadline: "fitness API rate limit and quota calculator",
    description: DESCRIPTION,
    datePublished: RATE_UPDATED,
    dateModified: RATE_UPDATED,
    webPage: { lastReviewed: RATE_UPDATED },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Rate-limit calculator", path: RATE_LIMIT_PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={10} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Will your sync schedule fit the API&rsquo;s rate limit?
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {rateLimitCapsule()}
        </p>

        <section data-tool="rate-limit-calculator" aria-label="Rate-limit and quota calculator">
          <RateLimitCalculator vendors={ALL_RATE_VENDORS} />
        </section>

        <section className="mt-14" aria-labelledby="limits">
          <h2 id="limits" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Every documented limit
          </h2>
          <div className="mt-6 space-y-6">
            {ALL_RATE_VENDORS.filter((v) => v.tiers.length).map((v) => (
              <article key={v.id} id={`limits-${v.id}`} data-rate-vendor={v.id} className="scroll-mt-20 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="text-lg font-bold text-[var(--fg)]">{v.name}</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="text-xs text-[var(--muted)]">
                      <tr>
                        <th className="py-1 pr-3 font-medium">Tier</th>
                        <th className="py-1 pr-3 font-medium">Limit</th>
                        <th className="py-1 pr-3 font-medium">Allowed</th>
                        <th className="py-1 pr-3 font-medium">Scope</th>
                        <th className="py-1 font-medium">Vendor&rsquo;s words</th>
                      </tr>
                    </thead>
                    <tbody>
                      {limitRows(v).map((row) => (
                        <tr key={`${row.tier}-${row.label}`} className="border-t border-[var(--border)] align-top">
                          <td className="py-1.5 pr-3">{row.tier}</td>
                          <td className="py-1.5 pr-3">{row.label}</td>
                          <td className="py-1.5 pr-3">{row.allowed}</td>
                          <td className="py-1.5 pr-3">{row.scope}</td>
                          <td className="py-1.5 font-mono text-[11.5px] text-[var(--muted)]">
                            “{row.src.quote}” (
                            <a href={row.src.url} rel="noopener" className={linkCls}>
                              source
                            </a>
                            )
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {v.scopeNote ? <p className="mt-3 text-sm text-[var(--muted)]">{v.scopeNote.text}</p> : null}
                <h4 className="mt-4 text-sm font-bold text-[var(--fg)]">Mitigations {v.name} documents</h4>
                {v.mitigations.length === 0 ? (
                  <p className="mt-1 text-sm text-[var(--muted)]">None in the pages read.</p>
                ) : (
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-[var(--fg)]">
                    {v.mitigations.map((m) => (
                      <li key={m.text}>
                        {m.text} (
                        <a href={m.src.url} rel="noopener" className={linkCls} title={`“${m.src.quote}”`}>
                          source
                        </a>
                        )
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-xs text-[var(--muted)]">
                  Sources read {RATE_CHECKED[v.id] ?? "unknown"} ·{" "}
                  <Link href={v.guide} className={linkCls}>
                    guide
                  </Link>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="none">
          <h2 id="none" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            No limit, or not documented
          </h2>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            {unlimited.map((v) => (
              <li key={v.id} data-rate-unlimited={v.id}>
                <strong className="text-[var(--fg)]">{v.name}: no limit today.</strong> {v.unlimited!.text}{" "}
                <a href={v.unlimited!.src.url} rel="noopener" className={linkCls}>
                  source
                </a>
{" "}
                <Link href={v.guide} className={linkCls}>
                  Guide
                </Link>
                .
              </li>
            ))}
            {ALL_NOT_DOCUMENTED.map((v) => (
              <li key={v.id} data-rate-undocumented={v.id}>
                <strong className="text-[var(--fg)]">{v.name}: not documented.</strong> {v.reason}{" "}
                {v.src ? (
                  <a href={v.src.url} rel="noopener" className={linkCls} title={`“${v.src.quote}”`}>
                    source
                  </a>
                ) : null}{" "}
                <Link href={v.guide} className={linkCls}>
                  Guide
                </Link>
                {RATE_CHECKED[v.id] && RATE_CHECKED[v.id] !== "unknown" ? `, read ${RATE_CHECKED[v.id]}` : ""}.
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="model">
          <h2 id="model" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            What the calculator assumes
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              Each user syncs the number of times you set, and each sync makes the number of requests you set.
              Paging, retries and token refreshes are extra requests the calculator does not add for you; count
              them in &ldquo;endpoints per sync&rdquo;.
            </li>
            <li>
              &ldquo;Spread evenly&rdquo; is the average load in each window. &ldquo;All at once&rdquo; is a cron
              that syncs every user at the same moment, the worst case for per-minute limits, which is how a
              schedule that fits the daily limit can still get 429s.
            </li>
            <li>
              A limit is applied to your whole app or to each user as the vendor states. Where the vendor gives a
              number without saying which (Oura, COROS, Wodify, Wahoo), it is applied to the whole app, the stricter
              reading, and labeled.
            </li>
            <li>
              Polar&rsquo;s limits grow with registered users; the users you enter stand in for that count. The
              Google Health API&rsquo;s unverified-app tier caps an app at {GHAPI_UNVERIFIED_USER_CAP} users, per
              Google, so its user count is not a free choice.
            </li>
            <li>
              Terra counts days of data requested rather than requests, so set the days each request asks for.
              Strava&rsquo;s figures assume read requests; uploads count only against its overall limit.
            </li>
            <li>
              On-device stores are not modeled: their quotas are per app on the phone, not per server. Health
              Connect&rsquo;s are covered in{" "}
              <Link href="/fix/health-connect-rate-limit" className={linkCls}>
                Health Connect ERROR_RATE_LIMIT_EXCEEDED
              </Link>
              .
            </li>
          </ul>
        </section>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Which of these APIs carry the metrics you need, and which push them by webhook:{" "}
          <Link href={COVERAGE_PATH} className={linkCls}>
            the API coverage matrix
          </Link>
          . A retrying fetch wrapper that reads these headers:{" "}
          <Link href="/cookbook/rate-limit-fetcher" className={linkCls}>
            the rate-limit fetcher recipe
          </Link>
          . More at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>

        <MoreTools path={RATE_LIMIT_PATH} />
        <ToolNextStep path={RATE_LIMIT_PATH} />
      </div>
    </Container>
  );
}
