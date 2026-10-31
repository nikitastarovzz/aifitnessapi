import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import YearStoryShare from "@/components/YearStoryShare";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { formatDate } from "@/lib/posts";
import { shortDate } from "@/lib/ecosystemDerive";
import {
  YEAR,
  YEAR_PATH,
  buildDate,
  changeMonths,
  freshness,
  isSoFar,
  releaseMonths,
  slides,
  storyTitle,
  yearDataDate,
  type Slide,
} from "@/lib/year2026";

/**
 * /2026 — "Fitness APIs in 2026": a scroll story of one computed stat per
 * slide, built at every build from the repo's data modules
 * (src/lib/year2026.ts). The visual, shareable companion to two pages that
 * own the questions it touches:
 *
 * - /changes owns "what changed and what is due": every entry, its quote and
 *   its grade. This page only counts those entries and links each count back.
 * - /state-of-fitness-apis-2026 owns "how is access to these APIs structured"
 *   (free, gated, contact-sales). This page repeats none of that report.
 *
 * What it answers that neither does is the year's totals, which no page here
 * states: how many, which month, which package, how fresh. Its FAQs are about
 * the story itself, so they cannot compete with either page's.
 *
 * Motion is CSS only (scroll-driven animations inside @supports and
 * prefers-reduced-motion: no-preference, in globals.css). Without support,
 * without JS or with reduced motion, the slides are a static list.
 */

const H1_SOFAR = isSoFar();
const TITLE = storyTitle();
const META_TITLE = H1_SOFAR ? `Fitness APIs in ${YEAR}, So Far: The Year in Numbers` : `Fitness APIs in ${YEAR}: The Year in Numbers`;
const DESCRIPTION = `Fitness and health APIs in ${YEAR} as shareable numbers: changes, launches, shutdowns and releases, computed at each build from this site's own data.`;

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: DESCRIPTION,
  alternates: { canonical: YEAR_PATH },
  openGraph: {
    type: "article",
    title: TITLE,
    description: `One computed number per slide, each with its source file and date and a copy-as-image button.`,
    url: YEAR_PATH,
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: `How is the Fitness APIs in ${YEAR} story different from the changes tracker and the State of Fitness APIs report?`,
    a: `It counts; they explain. The changes tracker is the record of every dated change, each with the vendor's words and a confirmed-or-reported grade, and the State of Fitness APIs ${YEAR} report surveys how access to 25 APIs is structured. This page adds up the year: how many tracked changes, which month was busiest, how many releases are on file, how fresh this site's own checks are. Each number links to the page that owns the detail behind it, and none of the report's findings is repeated here.`,
  },
  {
    q: `Where do the numbers in the ${YEAR} story come from?`,
    a: `Only from data files already in this site's repository, read at build time: src/data/changes.ts for the tracked changes, src/data/googleHealthApi.ts for the Google Health API launch and the Fitbit turn-off date, src/data/hcReleases.ts, sdkReleases.ts and libraries.ts for releases, and the updated stamp on every cluster page for freshness. Every slide names its file and the date that file was last read from its source. Nothing is typed in by hand, and a slide whose number would rest on a single item is left out.`,
  },
  {
    q: `Why does the ${YEAR} story say "so far", and when does it become a full-year recap?`,
    a: `The title is computed from the build date. Every build before January 1, ${Number(YEAR) + 1} calls the page "so far"; the first build after that date titles it as the year in numbers, with the same code and no edit. Release counts also stop at the date each data file was last read, which every slide states.`,
  },
  {
    q: `Why are some ${YEAR} changes in the story not placed in any month?`,
    a: `Because their sources do not give one. The tracker keeps a date at the precision its evidence states, and several ${YEAR} entries are dated only by year. They count toward the year's total and appear in their own column on the month chart, but placing them in a month would sharpen a date beyond what the source says.`,
  },
];

const H = (s: Slide) => `slide-${s.id}`;

function ChangesChart() {
  const { months, yearOnly } = changeMonths();
  const cols = [...months.map((m) => ({ label: m.label, c: m.confirmed, r: m.reported, entries: m.entries, title: `${m.label} ${YEAR}` })), {
    label: "Year",
    c: yearOnly.filter((e) => e.status === "confirmed").length,
    r: yearOnly.filter((e) => e.status !== "confirmed").length,
    entries: yearOnly,
    title: `Dated only "${YEAR}"`,
  }];
  const max = Math.max(1, ...cols.map((c) => c.c + c.r));
  const W = 440, Hh = 200, top = 22, base = 170, unit = (base - top) / max, cw = W / cols.length;
  return (
    <figure className="mt-8">
      <svg viewBox={`0 0 ${W} ${Hh}`} className="h-auto w-full max-w-xl" role="img" aria-labelledby="chg-title">
        <title id="chg-title">{`Tracked ${YEAR} changes per month, confirmed and reported, plus entries dated only by year`}</title>
        <line x1="0" x2={W} y1={base} y2={base} stroke="var(--border)" strokeWidth="1" />
        {cols.map((c, i) => {
          const x = i * cw + cw * 0.2, w = cw * 0.6;
          const hc = c.c * unit, hr = c.r * unit;
          const total = c.c + c.r;
          return (
            <g key={c.title}>
              <title>{`${c.title}: ${total} (${c.c} confirmed, ${c.r} reported)`}</title>
              <rect x={i * cw} y={top - 10} width={cw} height={base - top + 30} fill="transparent" />
              {c.c > 0 && <rect className="year-bar" x={x} y={base - hc} width={w} height={hc} rx="4" fill="var(--color-brand-500)" />}
              {c.r > 0 && <rect className="year-bar" x={x} y={base - hc - hr} width={w} height={Math.max(0, hr - 2)} rx="4" fill="#fbbf24" />}
              {total > 0 && (
                <text x={x + w / 2} y={base - hc - hr - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--fg)">
                  {total}
                </text>
              )}
              <text x={x + w / 2} y={base + 18} textAnchor="middle" fontSize="12" fill={i === 12 ? "var(--fg)" : "var(--muted)"}>
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
        <span><span aria-hidden className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-brand-500 align-middle" />confirmed</span>
        <span><span aria-hidden className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-amber-400 align-middle" />reported</span>
        <span>{`"Year" = dated only ${YEAR} by the source, no month`}</span>
      </figcaption>
      <details className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
        <summary className="cursor-pointer font-semibold text-[var(--fg)]">Every entry, by month</summary>
        <ul className="mt-3 space-y-1.5 text-[var(--muted)]">
          {cols.flatMap((c) =>
            c.entries.map((e) => (
              <li key={`${e.sortDate}-${e.title}`}>
                <span className="font-mono text-xs">{shortDate(e.date)}</span> · {e.status} ·{" "}
                <Link href={e.page.href} className="text-brand-600 hover:text-brand-500">{e.title}</Link>
              </li>
            )),
          )}
        </ul>
      </details>
    </figure>
  );
}

function ReleaseChart({ asOf }: { asOf: string }) {
  const months = releaseMonths(asOf);
  const max = Math.max(1, ...months.map((m) => m.count));
  const W = 420, top = 22, base = 170, unit = (base - top) / max, cw = W / 12;
  return (
    <figure className="mt-8">
      <svg viewBox={`0 0 ${W} 200`} className="h-auto w-full max-w-xl" role="img" aria-labelledby="rel-title">
        <title id="rel-title">{`Dated ${YEAR} releases on record, per month`}</title>
        <line x1="0" x2={W} y1={base} y2={base} stroke="var(--border)" strokeWidth="1" />
        {months.map((m, i) => {
          const x = i * cw + cw * 0.2, w = cw * 0.6, h = m.count * unit;
          return (
            <g key={m.label}>
              <title>{`${m.label} ${YEAR}: ${m.count} releases${m.count ? ` (${m.events.map((e) => `${e.pkg} ${e.version}`).join(", ")})` : ""}`}</title>
              <rect x={i * cw} y={top - 10} width={cw} height={base - top + 30} fill="transparent" />
              {m.count > 0 && <rect className="year-bar" x={x} y={base - h} width={w} height={h} rx="4" fill="var(--color-brand-500)" />}
              {m.count > 0 && (
                <text x={x + w / 2} y={base - h - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--fg)">{m.count}</text>
              )}
              <text x={x + w / 2} y={base + 18} textAnchor="middle" fontSize="12" fill="var(--muted)">{m.label}</text>
            </g>
          );
        })}
      </svg>
      <details className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
        <summary className="cursor-pointer font-semibold text-[var(--fg)]">Every release counted</summary>
        <ul className="mt-3 space-y-1.5 text-[var(--muted)]">
          {months.flatMap((m) =>
            m.events.map((e) => (
              <li key={`${e.pkg}@${e.version}`}>
                <span className="font-mono text-xs">{shortDate(e.date)}</span> ·{" "}
                {e.href ? <Link href={e.href} className="text-brand-600 hover:text-brand-500">{e.pkg}</Link> : e.pkg}{" "}
                <code className="text-xs">{e.version}</code> · {e.source}
              </li>
            )),
          )}
        </ul>
      </details>
    </figure>
  );
}

function FreshnessChart({ asOf }: { asOf: string }) {
  const f = freshness(asOf);
  const max = Math.max(1, ...f.bands.map((b) => b.count));
  return (
    <figure className="mt-8">
      <ul className="space-y-2" aria-label="Pages by age of their verification stamp">
        {f.bands.map((b) => (
          <li key={b.label} className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-3 text-xs">
            <span className="text-[var(--muted)]">{b.label}</span>
            <span className="h-3 overflow-hidden rounded-full bg-[var(--surface)]">
              <span
                className={`year-bar-h block h-full rounded-full ${b.due ? "bg-amber-400" : "bg-brand-500"}`}
                style={{ width: `${(b.count / max) * 100}%` }}
                title={`${b.count} pages ${b.label} old${b.due ? ", due a re-check" : ""}`}
              />
            </span>
            <span className="text-right font-semibold text-[var(--fg)]">{b.count}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 text-xs text-[var(--muted)]">
        Days since each page&rsquo;s sources were last re-checked, on the build date. Amber bands are 90 days or older, the age at which every page here flags itself.
      </figcaption>
    </figure>
  );
}

export default function YearPage() {
  const asOf = buildDate();
  const url = absoluteUrl(YEAR_PATH);
  const all = slides(asOf);
  const by = Object.fromEntries(all.map((s) => [s.id, s]));

  const capsule = [
    by.changes && `As of ${formatDate(asOf)}, this site's changes tracker holds ${by.changes.value} ${by.changes.label}${by["busiest-month"] ? `, and ${by["busiest-month"].value} ${by["busiest-month"].label}` : ""}.`,
    by["google-health-api"] && by["fitbit-turn-off"] &&
      `Google's release notes date the Google Health API launch to ${by["google-health-api"].value}, ${YEAR}, and Google gives ${by["fitbit-turn-off"].value}, ${YEAR} for the Fitbit Web API turn-off.`,
    by["health-connect-client"] && by.packages &&
      `Health Connect's connect-client shipped ${by["health-connect-client"].value} releases in ${YEAR}, and ${by.packages.value} ${by.packages.label}.`,
    by.freshness && `The median verification stamp on this site was ${by.freshness.value} old on the build date.`,
  ]
    .filter(Boolean)
    .join(" ");

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: orgRef(),
        dateModified: yearDataDate(),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
        relatedLink: [absoluteUrl("/changes"), absoluteUrl("/state-of-fitness-apis-2026")],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: FAQS.map((f, i) => ({
          "@type": "Question",
          name: f.q,
          url: `${url}#faq-${i + 1}`,
          acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
        })),
      },
    ],
  };

  return (
    <>
      <div aria-hidden className="year-progress" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <header className="year-hero relative overflow-hidden border-b border-[var(--border)]">
        <Container className="py-14 sm:py-20">
          <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: `Fitness APIs in ${YEAR}`, path: YEAR_PATH }]} />
          <p aria-hidden className="year-numeral select-none font-black leading-none tracking-tighter">
            {YEAR}
          </p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-6xl">{TITLE}</h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
            {`${all.length} numbers about the fitness and health API ecosystem, one per slide, each computed from this site's own data files at the build of ${formatDate(asOf)}${H1_SOFAR ? `. It becomes the full-year recap on the first build of ${Number(YEAR) + 1}.` : "."}`}
          </p>
          <nav aria-label="Slides" className="mt-8 flex flex-wrap gap-2">
            {all.map((s, i) => (
              <a
                key={s.id}
                href={`#${H(s)}`}
                className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
              >
                {String(i + 1).padStart(2, "0")} {s.kicker}
              </a>
            ))}
          </nav>
        </Container>
      </header>

      <Container className="py-10">
        <div className="mx-auto max-w-3xl">
          <AnswerCapsule>{capsule}</AnswerCapsule>
          <aside role="note" className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--fg)]">What this page is, and is not.</strong>{" "}
            {`It counts the year; it does not re-tell it. Each change, with the vendor's words and its grade, lives on the `}
            <Link href="/changes" className="font-medium text-brand-600 hover:text-brand-500">changes tracker</Link>
            {`, and how access to 25 APIs is structured (free, gated, contact-sales) is the `}
            <Link href="/state-of-fitness-apis-2026" className="font-medium text-brand-600 hover:text-brand-500">State of Fitness APIs {YEAR}</Link>
            {` report. Every slide below links to the page that owns its detail.`}
          </aside>
        </div>

        <ol className="mx-auto mt-6 max-w-5xl">
          {all.map((s, i) => (
            <li key={s.id} id={H(s)} className="year-slide scroll-mt-20 border-b border-[var(--border)] py-16 sm:py-24">
              <div className="year-reveal grid gap-6 sm:grid-cols-[7rem_1fr]">
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                  <span className="block font-mono text-3xl text-[var(--muted)] sm:text-4xl">{String(i + 1).padStart(2, "0")}</span>
                  {s.kicker}
                </p>
                <div className="min-w-0">
                  <h2 className="text-balance">
                    <span className="year-value block font-black leading-[0.95] tracking-tight">{s.value}</span>
                    <span className="mt-3 block text-2xl font-semibold leading-snug text-[var(--fg)] sm:text-3xl">{s.label}</span>
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)]">{s.detail}</p>
                  {s.items && (
                    <ul className="mt-4 max-w-2xl space-y-1.5 text-sm text-[var(--muted)]">
                      {s.items.map((it) => (
                        <li key={it.text}>
                          <Link href={it.href} className="font-medium text-brand-600 hover:text-brand-500">{it.text}</Link>
                          <span className="ml-1 text-xs">{`(${it.note})`}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.caveat && <p className="mt-3 max-w-2xl text-sm italic text-[var(--muted)]">{`Note: ${s.caveat}.`}</p>}
                  {s.chart === "changes-months" && <ChangesChart />}
                  {s.chart === "release-months" && <ReleaseChart asOf={asOf} />}
                  {s.chart === "freshness" && <FreshnessChart asOf={asOf} />}
                  <p className="mt-6 text-xs text-[var(--muted)]">
                    Source: <code className="text-[11px] text-[var(--fg)]">{s.source.file}</code>
                    {`, ${s.source.dateLabel}`}
                    {s.source.url && (
                      <>
                        {" · "}
                        <a href={s.source.url} className="text-brand-600 hover:text-brand-500" rel="noreferrer">original</a>
                      </>
                    )}
                    {" · "}
                    <Link href={s.link.href} className="font-medium text-brand-600 hover:text-brand-500">{`${s.link.label} →`}</Link>
                  </p>
                  <YearStoryShare
                    card={{
                      id: s.id,
                      title: TITLE,
                      kicker: s.kicker,
                      value: s.value,
                      label: s.label,
                      caveat: s.caveat,
                      source: `${s.source.file}, ${s.source.dateLabel}`,
                      url: `aifitnessapi.com${YEAR_PATH}`,
                      text: s.shareText,
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mx-auto max-w-3xl">
          <section className="mt-16" id="method">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How the story is computed</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-[var(--muted)]">
              <p>
                {`Every slide is produced by src/lib/year2026.ts from modules the repository already holds, at build time, with no generator of its own. A change counts in ${YEAR} when its tracker date, at the precision its source states, falls in ${YEAR}; undated watch items are excluded. A release counts once per package and version, whichever file holds it. A slide whose number would rest on one item is dropped instead of shown.`}
              </p>
              <p>
                {`Two limits are stated on the slides they affect. sdkReleases.ts keeps each repository's five newest GitHub releases, so a count that fills all five is a floor. libraries.ts keeps only each package's latest registry publish, so it says whether a package released in ${YEAR}, never how often. The freshness slide reads the updated stamp of every cluster page, with ages counted in whole days between UTC midnights, the same arithmetic as the site's own staleness flags.`}
              </p>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
            <dl className="mt-6 divide-y divide-[var(--border)]">
              {FAQS.map((f, i) => (
                <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                  <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                  <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Keep reading</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { href: "/changes", label: "Changes & deadlines tracker" },
                { href: "/state-of-fitness-apis-2026", label: `The State of Fitness APIs ${YEAR}` },
                { href: "/digest", label: "Monthly digest archive" },
                { href: "/fitness-api-index", label: "The fitness API index" },
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
            {`By ${site.name}. Cite as: ${site.name}, "${TITLE}," ${absoluteUrl(YEAR_PATH)}, as of ${formatDate(asOf)}. Product and company names are trademarks of their respective owners.`}
          </p>
        </div>
      </Container>
    </>
  );
}
