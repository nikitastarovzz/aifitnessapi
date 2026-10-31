import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ShipIt from "@/components/play/ShipIt";
import { PAGE_H1 } from "@/data/pageTitles";
import { absoluteUrl, site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";
import {
  EVENTS,
  KICKOFF,
  MAX_STACKS,
  PATH,
  PLANNED_LAUNCH,
  RULES,
  RULE_NOTES,
  RUNWAY_WEEKS,
  STACKS,
  START_USERS,
  SURVIVE_SHARE,
  type EventKind,
} from "@/lib/shipIt";

/**
 * "Ship It": a short survival game played on this site's own dated record.
 *
 * The facts are not authored here. Every event, quote and date lives in
 * src/lib/shipIt.ts and is held by scripts/ship-it-check.mjs (qa gate
 * SHIP-IT) to the page on this site that sources it — a /changes entry or a
 * released cluster entry. What this page adds is the game: weeks, users and
 * the runway, which are invented and labelled so wherever they appear.
 */

const UPDATED = "2026-10-31";
const H1 = PAGE_H1[PATH];
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "Ship It: A Fitness App Survival Game";
const DESCRIPTION =
  "Pick a fitness app and its data stack, then survive the real, dated API changes of 2025–26, from Oura's token deprecation to the Fitbit Web API turn-off.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "A 3–5 minute browser game: every event is a real, dated vendor change quoted from its source page; the weeks and users are game rules.",
    url: PATH,
  },
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function human(d: string): string {
  const [y, m, day] = d.split("-");
  if (!m) return y;
  return day ? `${MONTHS[Number(m) - 1]} ${Number(day)}, ${y}` : `${MONTHS[Number(m) - 1]} ${y}`;
}

const stackName = (id: string) => STACKS.find((s) => s.id === id)?.name ?? id;
const sorted = [...EVENTS].sort((a, b) => (a.sortDate < b.sortDate ? -1 : a.sortDate > b.sortDate ? 1 : 0));
const KIND_LABEL: Record<EventKind, string> = {
  "turn-off": "Turn-off",
  "end-of-support": "End of support",
  deprecation: "Deprecation",
  gate: "Approval or review gate",
  policy: "Policy rule",
  limit: "Documented limit",
};
const pct = (n: number) => `${Math.round(n * 100)}%`;
const linkCls = "font-medium text-brand-600 hover:text-brand-500";

const FAQS = [
  {
    q: "Are the events in the Ship It game real?",
    a: `Yes. Each of the ${EVENTS.length} events is a dated change or a documented rule that this site has already sourced, on its changes tracker or on a guide, and the card quotes the words the source page carries, with a link to that page. Where the quote is this site's summary rather than the vendor's own sentence, the card says so. A build check fails if a quote or a date stops appearing on its source page, so an event cannot outlive its evidence.`,
  },
  {
    q: "Are the weeks and user numbers in Ship It estimates?",
    a: `No. They are game rules: ${START_USERS.toLocaleString("en-US")} starting users, a ${RUNWAY_WEEKS}-week runway and a fixed cost for each kind of choice, all invented to make the trade-offs playable. They do not estimate how long a real migration takes or how many users a real app loses, and the scoring table on the page prints them as rules.`,
  },
  {
    q: "Why does acting at the Fitbit end of support make the turn-off free in the game?",
    a: "Because Google gave two dates. Support for the Fitbit Web API ended on September 30, 2026, while the API kept operating, and the turn-off, after which requests fail with HTTP 410 Gone, follows on November 2, 2026. A team that started its Google Health API migration at the first date has nothing left to do at the second, so the game marks the turn-off as already handled.",
  },
  {
    q: "Why is Google Fit marked as existing projects only in Ship It?",
    a: "Google closed Google Fit API sign-ups for new developers on May 1, 2024, before the game's kickoff, so a team in the game can only be on Google Fit if it already had a project. Google's Fit migration guide says the Google Fit APIs will be supported until the end of 2026 and publishes no switch-off date, which is why ignoring that event costs fewer users than ignoring a turn-off.",
  },
  {
    q: "Does Ship It send my choices or results anywhere?",
    a: "No. The game runs in your browser from data shipped with the page. The share card is drawn on a canvas in the tab and the share text is copied to your clipboard only when you press the button; nothing is uploaded or stored, and the page has no server code behind it.",
  },
];

export default function ShipItPage() {
  const url = absoluteUrl(PATH);
  const jsonLd = toolGraph({
    path: PATH,
    name: H1,
    alternativeHeadline: "fitness API deprecation game",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Ship It", path: PATH },
          ]}
        />
        <ClusterHero label="Game" seed={7} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Ship It is a three-to-five-minute browser game about getting a fitness app to launch through the
          API changes of late 2025 and 2026. You pick a product and up to {MAX_STACKS}{" "}data stacks, then every
          real, dated event that hit those stacks plays out, from Oura deprecating personal access tokens in
          December 2025 to the Fitbit Web API turn-off on November 2, 2026 and Google Fit&rsquo;s end of support at
          the end
          of 2026. Each card quotes the page on this site that sources it. The weeks and users you spend are game
          rules, not estimates.
        </p>

        <section data-ship-it-game aria-label="Ship It game">
          <ShipIt />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Every event in the game</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            {EVENTS.length}{" "}events, in date order. A run only meets the ones that hit the stacks it picked, and a
            few apply to one product only. The date is the vendor&rsquo;s where it gives one; for a standing rule it
            is the day the rule&rsquo;s page was last updated or read, and the card says which. The full record,
            graded confirmed or reported, is the{" "}
            <Link href="/changes" className={linkCls}>
              changes and deadlines tracker
            </Link>
            .
          </p>
          <ol className="mt-6 space-y-4">
            {sorted.map((e) => (
              <li key={e.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4" data-ship-it-event={e.id}>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  <time dateTime={e.sortDate}>{human(e.date)}</time> · {KIND_LABEL[e.kind]} · {e.stacks.map(stackName).join(", ")}
                  {e.products ? ` · ${e.products.length === 1 ? "one product" : "some products"}` : ""}
                </p>
                <h3 className="mt-1 font-semibold text-[var(--fg)]">{e.title}</h3>
                <blockquote className="mt-2 border-l-2 border-brand-400/50 pl-3 text-sm italic text-[var(--muted)]">
                  &ldquo;{e.quote}&rdquo;
                  <span className="mt-1 block not-italic">
                    {e.quoteBy === "vendor" ? e.speaker : `${e.speaker} (not the vendor's words)`}, via{" "}
                    <Link href={e.source.href} className={linkCls}>
                      {e.source.label}
                    </Link>
                  </span>
                </blockquote>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How the game is scored (game rules)</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            These numbers are invented to make the choices trade off against each other. They are not estimates of
            real engineering time or user churn. The game starts on {human(KICKOFF)} with{" "}
            {START_USERS.toLocaleString("en-US")} connected users split evenly across your stacks, and a launch planned
            for {human(PLANNED_LAUNCH)}. Every week of slip moves the launch a week. More than {RUNWAY_WEEKS} weeks and
            the money runs out; lose every user and there is nothing to launch; keep {pct(SURVIVE_SHARE)} or more and
            you survived.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[34rem] text-left text-sm" data-ship-it-rules>
              <thead className="bg-[var(--surface)] text-[var(--muted)]">
                <tr>
                  <th className="p-3 font-semibold">Kind of event</th>
                  <th className="p-3 font-semibold">Act now</th>
                  <th className="p-3 font-semibold">Hedge</th>
                  <th className="p-3 font-semibold">Ignore</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(RULES) as EventKind[]).map((k) => (
                  <tr key={k} className="border-t border-[var(--border)] align-top">
                    <td className="p-3">
                      <span className="font-medium text-[var(--fg)]">{KIND_LABEL[k]}</span>
                      <span className="mt-1 block text-xs text-[var(--muted)]">{RULE_NOTES[k]}</span>
                    </td>
                    {(["act", "hedge", "ignore"] as const).map((c) => (
                      <td key={c} className="p-3 text-[var(--fg)]">
                        {RULES[k][c].weeks} wk, {pct(RULES[k][c].lose)}{" "}of that stack&rsquo;s users
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Acting or hedging at the Fitbit end of support counts the later turn-off as already handled, because the
            migration it starts is the one the turn-off forces. Nothing else carries over between events.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">After the game</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The real versions of these moves are the{" "}
            <Link href="/migrate" className={linkCls}>
              migration guides
            </Link>
            : start with{" "}
            <Link href="/migrate/fitbit-web-api-to-google-health" className={linkCls}>
              Fitbit Web API to the Google Health API
            </Link>{" "}
            and{" "}
            <Link href="/migrate/google-fit-to-health-connect" className={linkCls}>
              Google Fit to Health Connect
            </Link>
            , or the shutdown centres for{" "}
            <Link href="/fitbit-api-shutdown" className={linkCls}>
              Fitbit
            </Link>{" "}
            and{" "}
            <Link href="/google-fit-shutdown" className={linkCls}>
              Google Fit
            </Link>
            . To hear about the next dated change before it reaches your app, use{" "}
            <Link href="/alerts" className={linkCls}>
              API change alerts
            </Link>
            .
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <div className="mt-6 space-y-6">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24">
                <h3 className="font-semibold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-sm text-[var(--muted)]">
          A game from {site.name}, built on the{" "}
          <Link href="/changes" className={linkCls}>
            changes tracker
          </Link>
          . More at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
