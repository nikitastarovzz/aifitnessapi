import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import ApiIndexTable from "@/components/ApiIndexTable";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { formatDate } from "@/lib/posts";
import { PAGE_H1 } from "@/data/pageTitles";
import { HC_RELEASES_SOURCE } from "@/data/hcReleases";
import { CATEGORIES, API_INDEX_PATH, MARKET_MAP_PATH, indexDataDate, indexInputDates, indexRows } from "@/lib/ecosystemSignals";
import { derive, shortDate, WINDOW_DAYS } from "@/lib/ecosystemDerive";

/**
 * The fitness API index: measurable ecosystem signals per directory product,
 * shown raw and sortable, with no score.
 *
 * Every number is computed at build time by src/lib/ecosystemSignals.ts from
 * modules the repo already holds; nothing on this page is typed by hand, so
 * it stays current by being rebuilt. The windowed counts and ages are also
 * recomputed in the reader's browser (src/lib/ecosystemDerive.ts), because a
 * static page's "last 12 months" otherwise freezes on the build date.
 *
 * Deliberately no composite. A weighted "best API" number would be a
 * judgement dressed as arithmetic, and on a site funded by one of the
 * products it would be worse than that. KinesteX, the funder, is shown with
 * the same columns but kept out of every sort and given no position.
 *
 * dateModified is the newest date any input was written or checked
 * (indexDataDate), and the sitemap reads the same function, so the two agree.
 */

const H1 = PAGE_H1[API_INDEX_PATH];
const META_TITLE = "Fitness API Index: Releases, Changes & Verification Age";
const DESCRIPTION =
  "Sortable signals for every fitness API we track: SDK and library releases, dated changes in the last 12 months, approval gates and verification age.";

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: DESCRIPTION,
  alternates: { canonical: API_INDEX_PATH },
  openGraph: {
    type: "website",
    title: "The fitness API index",
    description:
      "Raw, reproducible ecosystem signals per fitness and health API, computed from this site's data files at every build. No score, no winner.",
    url: API_INDEX_PATH,
  },
};

function median(xs: number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

const METHOD: { col: string; from: string; rule: string }[] = [
  {
    col: "Product, category",
    from: "src/data/apis.ts (from src/data/costModel.ts)",
    rule: "One row per directory entry; the cost model's category label. The generic LLM API row is not a product and is not listed.",
  },
  {
    col: "Billing",
    from: "src/data/costModel.ts — devCost",
    rule: "Copied. \"Contact sales\" is the cost model's \"no public price; you have to ask for a quote\", so those rows say no public price.",
  },
  {
    col: "Approval gate, user-side cost",
    from: "src/data/costModel.ts — approvalGate, userSideCost",
    rule: "Yes when the field is filled; None documented when it is null. Null means none in the sources checked, not none at all. The wording is on each product's directory page.",
  },
  {
    col: "Pricing page here",
    from: "the /pricing cluster (src/data/pricing.entries.ts via the cluster registry)",
    rule: "Yes, linked, when a /pricing page's H1 names the product. Says whether this site has a pricing page, not whether the vendor publishes prices.",
  },
  {
    col: "Vendor SDK releases, last vendor SDK release",
    from: "src/data/hcReleases.ts",
    rule: `Releases of androidx.health.connect:connect-client dated in the ${WINDOW_DAYS} days to the as-of date, read from Google's Jetpack release notes. Only Health Connect has a generator for its vendor SDK's releases; every other row says not tracked, which is not zero.`,
  },
  {
    col: "Packages tracked, newest package release",
    from: "src/data/libraries.ts and src/data/sdkReleases.ts",
    rule: `Packages whose registry metadata (the generator's wraps field) names the product, plus sdkReleases.ts repositories whose covers field names it, de-duplicated by repository. In brackets: how many had a release in the ${WINDOW_DAYS} days to the as-of date. Newest release is the later of the registry publish date and the newest non-prerelease GitHub release.`,
  },
  {
    col: "Tracked changes, latest tracked change",
    from: "src/data/changes.ts",
    rule: `Entries of the changes tracker whose title or summary names the product, matched as lib/apiCoverage.ts matches them; counted when the sort date falls in the ${WINDOW_DAYS} days to the as-of date, with later-dated entries shown as dated ahead. Every status counts (confirmed and reported); the per-product list below shows each one's status.`,
  },
  {
    col: "Pages here",
    from: "lib/apiCoverage.ts over every cluster page",
    rule: "The directory's coverage count: pages naming the product in the title or query, or more than once in the body. A measure of this site's coverage, not of the product.",
  },
  {
    col: "Last verified (age)",
    from: "the `updated` stamp of the page each cost-model entry cites as sourceHref",
    rule: "The date that page was last re-verified against its sources, and its age in days on the as-of date, flagged past 90 days as everywhere on this site.",
  },
];

export default function FitnessApiIndexPage() {
  const url = absoluteUrl(API_INDEX_PATH);
  const buildDate = new Date().toISOString().slice(0, 10);
  const rows = indexRows();
  const inputs = indexInputDates();
  const modified = indexDataDate();

  const ranked = rows.filter((r) => !r.firstParty);
  const d = ranked.map((r) => ({ r, d: derive(r, buildDate) }));
  const withChange = d.filter((x) => x.d.changes12 > 0);
  const changeTotal = d.reduce((n, x) => n + x.d.changes12, 0);
  const withPackages = d.filter((x) => x.d.packageCount > 0);
  const activePackages = withPackages.filter((x) => x.d.packagesActive12 > 0);
  const ages = d.flatMap((x) => (x.d.verifiedAge !== null ? [x.d.verifiedAge] : []));
  const over90 = ages.filter((a) => a > 90).length;
  const gated = ranked.filter((r) => r.approvalGate).length;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: H1,
        description: DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: orgRef(),
        dateModified: modified,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
        mainEntity: { "@id": `${url}#dataset` },
      },
      {
        "@type": "Dataset",
        "@id": `${url}#dataset`,
        name: "Fitness API index: ecosystem signals per product",
        description:
          "Release, change, access and verification signals per fitness and health API product, computed from aifitnessapi.com's data modules at every build. Raw signals only, no composite score.",
        url,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: orgRef(),
        publisher: orgRef(),
        dateModified: modified,
        isAccessibleForFree: true,
        variableMeasured: METHOD.map((m) => m.col),
        distribution: [
          { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: absoluteUrl(`${API_INDEX_PATH}/data.json`) },
          { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: absoluteUrl(`${API_INDEX_PATH}/data.csv`) },
        ],
      },
    ],
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Fitness API index", path: API_INDEX_PATH }]} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Computed {formatDate(buildDate)} from this site&rsquo;s data files · inputs last written{" "}
          {formatDate(modified)} · {rows.length} products · CC BY 4.0
        </p>

        <aside
          role="note"
          className="mt-6 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-[var(--fg)]"
        >
          <strong>Disclosure:</strong>{" "}KinesteX, the company that funds this site, is one of the products in the
          directory. Its row is shown and computed exactly like the others, but it is kept out of every sort
          and given no position: it sits below the ranked rows, labelled &ldquo;funds this site — not
          ranked&rdquo;.
        </aside>

        <AnswerCapsule>
          As of {formatDate(buildDate)}, {withChange.length} of the {ranked.length}{" "}ranked fitness and health
          products had at least one dated change in this site&rsquo;s tracker in the previous 12 months (
          {changeTotal} entries in all), {activePackages.length} of the {withPackages.length} products with a
          tracked open-source package had a package release in that window, and {gated}{" "}document an approval
          gate before launch. The page each product&rsquo;s facts come from was last re-verified a median of{" "}
          {median(ages)} days earlier; {over90}{" "}are past 90 days. There is no score: every column is a raw
          signal computed from the repository&rsquo;s data files at each build, sortable, with its source
          file named below.
        </AnswerCapsule>
      </div>

      <section className="mx-auto mt-10 max-w-6xl" aria-labelledby="table-heading">
        <h2 id="table-heading" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
          The signals
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          Click a column header to sort; click again to reverse. The number on the left is the position in the
          current sort and nothing more. A dash or &ldquo;not tracked&rdquo; means the repository holds no data
          for that cell — it sorts last either way and is not a zero.
        </p>
        <div className="mt-4">
          <ApiIndexTable rows={rows} buildDate={buildDate} categories={CATEGORIES.map((c) => c.label)} />
        </div>
      </section>

      <div className="mx-auto max-w-3xl">
        <section className="mt-14" id="evidence">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Per-product evidence</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            The records each row counts, so any number in the table can be checked by hand.
          </p>
          <div className="mt-4 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)]">
            {rows.map((r) => (
              <details key={r.id} className="group px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">
                  {r.label}
                  <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                    {r.packages.length} packages · {r.changes.length} tracked changes
                    {r.firstParty ? " · funds this site, not ranked" : ""}
                  </span>
                </summary>
                <div className="mt-3 space-y-3 text-sm text-[var(--muted)]">
                  <p>
                    Directory entry:{" "}
                    <Link href={r.href} className="text-brand-600 hover:text-brand-500">
                      {r.label}
                    </Link>
                    {r.verified && (
                      <>
                        {" "}· facts from{" "}
                        <Link href={r.verified.href} className="text-brand-600 hover:text-brand-500">
                          {r.verified.label}
                        </Link>
                        , verified {shortDate(r.verified.date)}
                      </>
                    )}
                  </p>
                  {r.officialSdk && (
                    <p>
                      Vendor SDK: <code className="text-xs">{r.officialSdk.name}</code>, {r.officialSdk.dates.length}{" "}
                      dated releases on{" "}
                      <a href={r.officialSdk.source} className="text-brand-600 hover:text-brand-500" rel="noreferrer">
                        Google&rsquo;s release notes
                      </a>
                      , newest {r.officialSdk.latestVersion} (
                      <Link href="/health-connect-releases" className="text-brand-600 hover:text-brand-500">
                        every release
                      </Link>
                      ).
                    </p>
                  )}
                  {r.packages.length > 0 && (
                    <ul className="list-disc space-y-1 pl-5">
                      {r.packages.map((p) => (
                        <li key={p.name}>
                          {p.href ? (
                            <Link href={p.href} className="text-brand-600 hover:text-brand-500">
                              {p.name}
                            </Link>
                          ) : (
                            <span className="text-[var(--fg)]">{p.name}</span>
                          )}{" "}
                          — newest release {p.latest ? shortDate(p.latest) : "none recorded"} ({p.source})
                          {p.deprecated ? " · deprecated or archived" : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                  {r.changes.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5">
                      {r.changes.map((c) => (
                        <li key={`${c.sortDate}-${c.title}`}>
                          {shortDate(c.date)} · {c.status} ·{" "}
                          <Link href={c.href} className="text-brand-600 hover:text-brand-500">
                            {c.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tracked change names this product.</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14" id="methodology">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Methodology</h2>
          <div className="mt-4 space-y-3 leading-relaxed text-[var(--muted)]">
            <p>
              Every column is computed by <code className="text-xs">src/lib/ecosystemSignals.ts</code> and{" "}
              <code className="text-xs">src/lib/ecosystemDerive.ts</code>{" "}from files already in the repository,
              at every build. Nothing is entered by hand, and no generator was added for this page: the inputs are
              the outputs of the existing ones. Products are joined to packages and changes by their proper
              names (the directory&rsquo;s aliases), case-sensitive with word boundaries.
            </p>
            <p>
              Windows are the {WINDOW_DAYS} days ending on the as-of date. The server renders the table as of
              the build date; your browser then recomputes the windows and ages for today, and the line above the
              table says which date is in use.
            </p>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead className="bg-[var(--surface)] text-left text-[11px] uppercase tracking-wider text-[var(--muted)]">
                <tr>
                  <th scope="col" className="px-3 py-2">Column</th>
                  <th scope="col" className="px-3 py-2">Source file</th>
                  <th scope="col" className="px-3 py-2">Rule</th>
                </tr>
              </thead>
              <tbody>
                {METHOD.map((m) => (
                  <tr key={m.col} className="border-t border-[var(--border)] align-top">
                    <th scope="row" className="px-3 py-2 text-left font-semibold text-[var(--fg)]">{m.col}</th>
                    <td className="px-3 py-2 text-xs text-[var(--fg)]"><code>{m.from}</code></td>
                    <td className="px-3 py-2 text-[var(--muted)]">{m.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-8 text-lg font-bold tracking-tight text-[var(--fg)]">Data dates</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
            <li>
              <code className="text-xs">libraries.ts</code> last written from npm, pub.dev, PyPI and GitHub:{" "}
              {formatDate(inputs.libraries)}
            </li>
            <li>
              <code className="text-xs">sdkReleases.ts</code> last reached the GitHub Releases API:{" "}
              {formatDate(inputs.sdkReleases)}
            </li>
            <li>
              <code className="text-xs">hcReleases.ts</code> last read{" "}
              <a href={HC_RELEASES_SOURCE} className="text-brand-600 hover:text-brand-500" rel="noreferrer">
                Google&rsquo;s release notes
              </a>
              : {formatDate(inputs.hcReleases)}
            </li>
            {inputs.changes && (
              <li>
                <code className="text-xs">changes.ts</code> newest entry check: {formatDate(inputs.changes)}
              </li>
            )}
            {inputs.verifiedOldest && inputs.verifiedNewest && (
              <li>
                Source-page verification stamps range from {formatDate(inputs.verifiedOldest)} to{" "}
                {formatDate(inputs.verifiedNewest)}
              </li>
            )}
          </ul>

          <h3 className="mt-8 text-lg font-bold tracking-tight text-[var(--fg)]">Why there is no score</h3>
          <div className="mt-3 space-y-3 leading-relaxed text-[var(--muted)]">
            <p>
              None of these signals says a product is good. More tracked changes can mean an unstable API or a
              vendor that documents what it changes; an approval gate protects users as often as it slows
              builders; a package with no release this year may be finished rather than abandoned. Any weighting
              would be our judgement presented as a measurement, so the index publishes the measurements and
              leaves the weighting to you. Download the rows and apply your own.
            </p>
            <p>
              The funder is held to the same rule from the other side: KinesteX&rsquo;s row is computed
              identically and shown, but never sorted among the others and never given a position.
            </p>
          </div>

          <h3 className="mt-8 text-lg font-bold tracking-tight text-[var(--fg)]">Download and reproduce</h3>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The rows as of the build, with every input date:{" "}
            <a href={`${API_INDEX_PATH}/data.json`} className="font-medium text-brand-600 hover:text-brand-500">
              data.json
            </a>{" "}
            and{" "}
            <a href={`${API_INDEX_PATH}/data.csv`} className="font-medium text-brand-600 hover:text-brand-500">
              data.csv
            </a>
            , CC BY 4.0. They are regenerated with the page, so they carry an as-of date rather than a
            version. To reproduce from source, regenerate the inputs with the generators named in the
            repository&rsquo;s instructions, then run <code className="text-xs">npm run build</code>.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Related</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: MARKET_MAP_PATH, label: "The fitness & health API market map" },
              { href: "/changes", label: "Changes & deadlines tracker" },
              { href: "/libraries", label: "Open-source health & fitness libraries" },
              { href: "/state-of-fitness-apis-2026", label: "The State of Fitness APIs 2026" },
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
          By {site.name}. Cite as: {site.name}, &ldquo;The fitness API index,&rdquo; {absoluteUrl(API_INDEX_PATH)},
          as of {formatDate(buildDate)}. Product and company names are trademarks of their respective owners;
          KinesteX funds this site.
        </p>
      </div>
    </Container>
  );
}
