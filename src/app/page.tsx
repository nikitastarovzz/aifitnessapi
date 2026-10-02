import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PostCard from "@/components/PostCard";
import Newsletter from "@/components/Newsletter";
import ApiTerminal from "@/components/ApiTerminal";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import { getAllPosts } from "@/lib/posts";
import { clusterMap } from "@/lib/clusterRegistry";
import { HK_IDENTIFIERS, HK_ERRORS } from "@/data/healthkitIdentifiers";
import { releasedHkGroups } from "@/data/hkGroupPages";
import { READING_PATHS } from "@/data/readingPaths";
import { changesSorted, type ChangeStatus } from "@/data/changes";
import UpcomingDeadlines, { DeadlinesLabel, type DatedNode } from "@/components/UpcomingDeadlines";
import { site, absoluteUrl } from "@/lib/site";

/**
 * The landing page is the pitch: who this site is for, what they get, and one
 * conversion goal — the Decision Kit signup (#subscribe). Counts are derived
 * from the cluster registry so they never go stale; deadlines come from the
 * changes tracker so urgency is real, not manufactured.
 */

/**
 * The root layout names no page, so the homepage states its own canonical and
 * og:url like every other route. Both objects replace the layout's rather than
 * merging into it, which is why the rest is restated here:
 * - `alternates.types` mirrors the feed and markdown links in layout.tsx —
 *   without it the homepage, where feed readers look first, would lose its
 *   autodiscovery links. Keep the two lists in step.
 * - `openGraph` restates type, site name, locale and the card image, or the
 *   homepage's share card would drop them.
 */
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: absoluteUrl("/feed.xml"), title: `${site.name} — blog` },
        { url: absoluteUrl("/changes.xml"), title: `${site.name} — API changes & deadlines` },
      ],
      "application/feed+json": absoluteUrl("/feed.json"),
      "text/markdown": absoluteUrl("/index.md"),
    },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: site.title,
    description: site.description,
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.title }],
  },
};

/** Every content cluster, surfaced from the homepage so the highest-
 *  authority page links directly to every pillar hub (discovery + link equity). */
const CLUSTERS: { href: string; title: string; blurb: string }[] = [
  { href: "/fitness-apis", title: "Fitness & workout APIs", blurb: "Compare and choose an API by the job — exercise content, wearables, aggregators, nutrition, or AI motion tracking." },
  { href: "/guides", title: "Add AI workout tracking", blurb: "The capture → pose → interpret pipeline: camera pose, rep counting, form feedback, and per-platform wiring." },
  { href: "/build", title: "Build a workout app", blurb: "End-to-end build playbooks by app type — home workout, coaching, strength, running, rehab, and more." },
  { href: "/integrate", title: "Integration guides", blurb: "Register, OAuth, fetch, and webhooks — a hands-on guide per provider, from HealthKit to Terra." },
  { href: "/fix", title: "Troubleshooting", blurb: "Symptom-to-fix for the common errors: 401s, rate limits, empty data, dead webhooks, and OAuth snags." },
  { href: "/learn", title: "Concepts explained", blurb: "Plain-English explainers for the health-tech vocabulary — OAuth, aggregators, HRV, VO2 max, and more." },
  { href: "/alternatives", title: "Alternatives", blurb: "Anchored on one product: why teams look to switch, and the realistic options — with links to the comparisons." },
  { href: "/compliance", title: "Compliance & privacy", blurb: "Which rules apply — HIPAA, GDPR, FDA, app-store policy — and how to build for consent, storage, and deletion." },
  { href: "/migrate", title: "Migration guides", blurb: "Step-by-step playbooks for moving an integration — Google Fit to Health Connect, direct-to-aggregator, and more." },
  { href: "/pricing", title: "Pricing", blurb: "What fitness and health APIs really cost — which are free to call, which charge, and what drives your bill." },
  { href: "/compare", title: "Comparisons", blurb: "Head-to-heads through the developer lens — Oura vs WHOOP, Fitbit vs Apple Watch, Terra vs Rook, and more." },
  { href: "/data", title: "Health data by metric", blurb: "Which API gives you each metric — heart rate, steps, sleep, calories, HRV, VO2 max — and measured vs estimated." },
  { href: "/motion", title: "AI motion & pose estimation", blurb: "The tech behind camera fitness — pose models, 2D vs 3D, on-device vs cloud, rep counting, and form scoring." },
  { href: "/ai", title: "AI & LLM features", blurb: "Plan generation, natural-language food logging, coaching prompts — plus guardrails, model choice, and cost." },
  { href: "/architecture", title: "Health data architecture", blurb: "The layer after the integration works — dedupe, normalization, timezones, sync, storage, and data quality." },
  { href: "/test", title: "Testing health apps", blurb: "HealthKit has no test double, CI cannot fire background delivery, the simulator has no camera. What to do instead." },
  { href: "/cookbook", title: "Cookbook: tested code", blurb: "Runnable, dependency-free reference implementations — token rotation, webhooks, DST-safe rollups — CI-tested." },
  { href: "/devices", title: "Connected devices", blurb: "Straps, treadmills, trainers, and the watch as a live sensor — BLE heart rate, FTMS, and the testing story." },
  { href: "/engagement", title: "Engagement & retention", blurb: "Getting people back: notifications, Live Activities, widgets, streaks, leaderboards — and measuring lift honestly." },
  { href: "/watch-apps", title: "Watch apps", blurb: "Writing the app on the wrist: workout sessions, background execution, WorkoutKit, Wear OS tiles, battery, testing." },
  { href: "/accessibility", title: "Accessibility", blurb: "Screen readers over live workout metrics, text scaling, touch targets, contrast outdoors, reduced motion, haptics, captions." },
];

/** The providers and SDKs people actually arrive searching for. Every href is
 *  a released page; blurbs stay qualitative so nothing here can go stale. */
const POPULAR: { href: string; name: string; tag: string; blurb: string }[] = [
  { href: "/integrate/healthkit", name: "Apple HealthKit", tag: "On-device · iOS", blurb: "No OAuth, no servers — and read-denial is invisible by design. The full Swift integration guide." },
  { href: "/integrate/google-health-connect", name: "Google Health Connect", tag: "On-device · Android", blurb: "The successor to Google Fit on Android: permissions, the 30-day read window, and the quirks." },
  { href: "/integrate/fitbit-api", name: "Fitbit Web API", tag: "Turndown reported 2026", blurb: "Widely integrated, with a turndown reported for around September 2026. The guide, plus the migration path to Google's cloud API." },
  { href: "/integrate/strava-api", name: "Strava API", tag: "Cloud · OAuth", blurb: "Activities, segments, and webhooks — under developer terms that have tightened. What's still allowed." },
  { href: "/integrate/garmin-api", name: "Garmin Health API", tag: "Cloud · approval-gated", blurb: "Deep wearable data behind a developer-program approval. How to apply, integrate, and pass review." },
  { href: "/integrate/oura-api", name: "Oura API", tag: "Cloud · OAuth", blurb: "Sleep, readiness, and HRV from the ring — including the personal-access-token deprecation." },
  { href: "/integrate/whoop-api", name: "WHOOP API", tag: "Cloud · OAuth", blurb: "Recovery, strain, and sleep via OAuth — and what changed in the developer platform restructure." },
  { href: "/integrate/terra-api", name: "Terra", tag: "Aggregator", blurb: "One integration, many wearables. When an aggregator earns its fee — and when direct is better." },
  { href: "/integrate/polar-api", name: "Polar AccessLink", tag: "Cloud · OAuth", blurb: "Training, sleep, and recharge data from Polar devices — registration through webhooks." },
  { href: "/integrate/nutritionix-api", name: "Nutritionix", tag: "Nutrition", blurb: "Natural-language food logging and a large verified food database — pricing model included." },
  { href: "/motion/pose-estimation-models-compared", name: "MediaPipe, MoveNet & pose models", tag: "Open-source models", blurb: "The open pose-estimation stacks compared: accuracy, platforms, and maintenance status." },
  { href: "/fitness-apis/ai-workout-tracking-apis", name: "AI motion SDKs", tag: "KinesteX · Sency · QuickPose", blurb: "Camera-based rep counting and form feedback as a product decision: build on models or buy an SDK." },
];

const STATUS_STYLES: Record<ChangeStatus, string> = {
  confirmed: "border-brand-400 bg-brand-500/10",
  reported: "border-amber-400/50 bg-amber-500/10",
  watch: "border-[var(--border)] bg-[var(--bg)]",
};

function fmtChangeDate(d: string): string {
  if (/^\d{4}$/.test(d)) return d;
  const [y, m, day] = d.split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const mn = months[parseInt(m, 10) - 1];
  return day ? `${mn} ${parseInt(day, 10)}, ${y}` : `${mn} ${y}`;
}

export default function Home() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const recent = rest.slice(0, 2);

  const clusters = clusterMap();
  const clusterCount = Object.keys(clusters).length;
  const guideCount = Object.values(clusters).reduce((n, list) => n + list.length, 0);
  const recipeCount = (clusters["/cookbook"] ?? []).length;
  const countByPath = (p: string) => clusters[p]?.length ?? 0;
  const newestByPath = (p: string) =>
    (clusters[p] ?? []).map((e) => e.updated).sort().at(-1) ?? "";
  // Counted the way /questions counts them, so the two never disagree.
  const questionCount = Object.values(clusters)
    .flat()
    .reduce((n, e) => n + e.faqs.length, 0);
  const hkGroupCount = releasedHkGroups().length;

  // Freshness, stated from data rather than claimed. "Recently" is measured
  // against build time, which on a static site is deploy time, so the number
  // cannot rot into a lie between deploys.
  const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
  const freshPages = Object.values(clusters)
    .flat()
    .filter((e) => e.updated >= THIRTY_DAYS_AGO).length;

  // Deadlines: which dated events are still ahead is decided in the browser
  // (UpcomingDeadlines). Decided here, "today" would freeze at deploy and keep
  // presenting passed dates as next until the following build. The server
  // HTML lists the tracker latest date first and says which build it is from.
  const events = changesSorted();
  const buildDate = new Date().toISOString().slice(0, 10);
  // Only ship the cards the browser could pick. An entry already past at
  // build time can never come back into the future, so the candidates are the
  // entries still ahead at build plus the three latest of the rest (shown if
  // everything has passed). `events` is latest first, so that is a prefix.
  const aheadAtBuild = events.filter((e) => e.sortDate >= buildDate).length;
  const deadlineItems: DatedNode[] = events.slice(0, aheadAtBuild + 3).map((e) => ({
    key: `${e.sortDate}-${e.title}`,
    sortDate: e.sortDate,
    node: (
      <Link
        href={e.page.href}
        className="group flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[var(--fg)]">{fmtChangeDate(e.date)}</span>
          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold text-[var(--fg)] ${STATUS_STYLES[e.status]}`}>
            {e.status}
          </span>
        </div>
        <span className="mt-2 font-semibold text-[var(--fg)]">{e.title}</span>
        <span className="mt-2 flex-1 text-sm text-[var(--muted)] line-clamp-3">{e.summary}</span>
        <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">
          {e.page.label} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </Link>
    ),
  }));
  // Most recently re-checked tracker entries — freshness of the record itself,
  // which is a different claim from the freshness of the deadlines above.
  const recentlyVerified = [...events]
    .sort((a, b) => (a.verifiedOn < b.verifiedOn ? 1 : -1))
    .slice(0, 3);

  return (
    <>
      {/* ——— Hero: who it's for, what they get, one primary action ——— */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.18),transparent)]"
        />
        <Container className="py-20 text-center sm:py-24">
          <span className="inline-flex items-center rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-300">
            For builders in health, wellness &amp; fitness
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-6xl">
            Pick the right fitness API.
            <br className="hidden sm:block" /> Ship without the surprises.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
            Wearables, health data, nutrition, AI motion tracking — compared, priced, and
            documented down to the failure modes, with the deprecations and deadline traps
            called out before they cost you a rewrite.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#subscribe"
              className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-500"
            >
              Get the free Decision Kit
            </Link>
            <Link
              href="/picker"
              className="rounded-xl border border-[var(--border)] px-6 py-3 font-semibold text-[var(--fg)] transition-colors hover:bg-[var(--surface)]"
            >
              Find your API in 60 seconds
            </Link>
          </div>
          <ApiTerminal className="mx-auto mt-12 max-w-xl" />
          <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
            <div>
              <dt className="text-2xl font-bold text-[var(--fg)]">
                <StatCounter value={guideCount} suffix="+" />
              </dt>
              <dd className="mt-1 text-xs text-[var(--muted)]">verified guides &amp; comparisons</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-[var(--fg)]">
                <StatCounter value={clusterCount} />
              </dt>
              <dd className="mt-1 text-xs text-[var(--muted)]">topic hubs, hero to edge case</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-[var(--fg)]">
                <StatCounter value={recipeCount} />
              </dt>
              <dd className="mt-1 text-xs text-[var(--muted)]">CI-tested code recipes</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-[var(--fg)]">CC BY</dt>
              <dd className="mt-1 text-xs text-[var(--muted)]">open datasets, free to reuse</dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* ——— Start where you are ——— */}
      <Container className="pt-16">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Start where you are
        </h2>
        <Reveal>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-[var(--border)] p-6">
            <h3 className="text-xl font-bold tracking-tight text-[var(--fg)]">
              I&rsquo;m choosing an API
            </h3>
            <p className="mt-2 flex-1 text-sm text-[var(--muted)]">
              Compare the field by the job you&rsquo;re hiring for — data coverage, pricing
              model, approval gates — before you write a line of integration code.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href="/picker" className="inline-block py-1 font-semibold text-brand-600 hover:text-brand-500">Run the picker →</Link>
              <Link href="/fitness-apis" className="inline-block py-1 font-medium text-[var(--muted)] hover:text-[var(--fg)]">Browse the roundups</Link>
              <Link href="/pricing" className="inline-block py-1 font-medium text-[var(--muted)] hover:text-[var(--fg)]">Check pricing</Link>
            </div>
          </div>
          <div className="flex flex-col rounded-2xl border border-[var(--border)] p-6">
            <h3 className="text-xl font-bold tracking-tight text-[var(--fg)]">
              I&rsquo;m building AI features
            </h3>
            <p className="mt-2 flex-1 text-sm text-[var(--muted)]">
              Camera rep counting, form feedback, LLM coaching — the whole pipeline from
              pose model or SDK choice to guardrails, latency, and cost.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href="/ai-fitness-app" className="inline-block py-1 font-semibold text-brand-600 hover:text-brand-500">Build an AI fitness app →</Link>
              <Link href="/motion" className="inline-block py-1 font-medium text-[var(--muted)] hover:text-[var(--fg)]">Motion &amp; pose tech</Link>
              <Link href="/ai" className="inline-block py-1 font-medium text-[var(--muted)] hover:text-[var(--fg)]">LLM features</Link>
            </div>
          </div>
          <div className="flex flex-col rounded-2xl border border-[var(--border)] p-6">
            <h3 className="text-xl font-bold tracking-tight text-[var(--fg)]">
              Something broke — or a deadline looms
            </h3>
            <p className="mt-2 flex-1 text-sm text-[var(--muted)]">
              401s, dead webhooks, empty reads — symptom-to-fix pages. And when a platform
              is being retired, the dated migration playbook is already written.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href="/fix" className="inline-block py-1 font-semibold text-brand-600 hover:text-brand-500">Troubleshoot it →</Link>
              <Link href="/changes" className="inline-block py-1 font-medium text-[var(--muted)] hover:text-[var(--fg)]">Deadline tracker</Link>
              <Link href="/migrate" className="inline-block py-1 font-medium text-[var(--muted)] hover:text-[var(--fg)]">Migration playbooks</Link>
            </div>
          </div>
        </div>
        </Reveal>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Handed a whole job rather than one question?{" "}
          <Link href="/paths" className="font-medium text-brand-600 hover:text-brand-500">
            {READING_PATHS.length} reading paths
          </Link>{" "}
          put the pages for one task in working order, with a sentence per step on why it comes
          there.
        </p>
      </Container>

      {/* ——— Popular APIs & SDKs ——— */}
      <Container className="pt-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Popular APIs &amp; SDKs
          </h2>
          <Link href="/integrate" className="inline-block py-1 text-sm font-medium text-brand-600 hover:text-brand-500">
            All integration guides →
          </Link>
        </div>
        <Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-semibold text-[var(--fg)]">{p.name}</span>
                <span className="shrink-0 rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {p.tag}
                </span>
              </div>
              <span className="mt-2 flex-1 text-sm text-[var(--muted)]">{p.blurb}</span>
              <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">
                Read the guide <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
        </Reveal>
      </Container>

      {/* ——— Free interactive tools ——— */}
      <Container className="pt-16">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Free tools — no signup needed
        </h2>
        <Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/apis"
            className="group flex flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
          >
            <h3 className="font-bold tracking-tight text-[var(--fg)]">API Directory</h3>
            <p className="mt-1 flex-1 text-sm text-[var(--muted)]">
              One page per API: how it bills you, what your users must own, what gates launch.
            </p>
            <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">Browse it <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span></span>
          </Link>
          <Link
            href="/picker"
            className="group flex flex-col rounded-2xl border border-brand-400/40 bg-brand-500/5 p-5 transition hover:-translate-y-0.5 hover:bg-brand-500/10"
          >
            <h3 className="font-bold tracking-tight text-[var(--fg)]">API Picker</h3>
            <p className="mt-1 flex-1 text-sm text-[var(--muted)]">
              Three questions, a tailored recommendation with next steps — and the reasoning shown.
            </p>
            <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">Try it <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span></span>
          </Link>
          <Link
            href="/cost-planner"
            className="group flex flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
          >
            <h3 className="font-bold tracking-tight text-[var(--fg)]">Cost Planner</h3>
            <p className="mt-1 flex-1 text-sm text-[var(--muted)]">
              Model what your stack costs at your user count — every price traced to its source.
            </p>
            <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">Plan costs <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span></span>
          </Link>
          <Link
            href="/matrix"
            className="group flex flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
          >
            <h3 className="font-bold tracking-tight text-[var(--fg)]">Type Matrix</h3>
            <p className="mt-1 flex-1 text-sm text-[var(--muted)]">
              Every metric&rsquo;s HealthKit ↔ Health Connect type — and where they quietly disagree.
            </p>
            <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">Open it <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span></span>
          </Link>
          <Link
            href="/day-boundaries"
            className="group flex flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
          >
            <h3 className="font-bold tracking-tight text-[var(--fg)]">Day-Boundary Demo</h3>
            <p className="mt-1 flex-1 text-sm text-[var(--muted)]">
              Watch a naive daily rollup break on DST and timezones — interactively, then fix it.
            </p>
            <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">See it break <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span></span>
          </Link>
          {/* Blurbs below restate the /tools hub's own, so a tool is described
              the same way wherever it is mentioned. */}
          <Link
            href="/tools/error-diagnoser"
            className="group flex flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
          >
            <h3 className="font-bold tracking-tight text-[var(--fg)]">Error Diagnoser</h3>
            <p className="mt-1 flex-1 text-sm text-[var(--muted)]">
              Paste an error string; get the matching HKError.Code case in Apple&rsquo;s wording, plus the guide that covers it.
            </p>
            <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">Diagnose it <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span></span>
          </Link>
          <Link
            href="/tools/stack-generator"
            className="group flex flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
          >
            <h3 className="font-bold tracking-tight text-[var(--fg)]">Stack Generator</h3>
            <p className="mt-1 flex-1 text-sm text-[var(--muted)]">
              Answer four questions; get the HealthKit types and APIs that survive them, with the exclusions shown.
            </p>
            <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">Generate it <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span></span>
          </Link>
          <Link
            href="/tools"
            className="group flex flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
          >
            <h3 className="font-bold tracking-tight text-[var(--fg)]">All Free Tools</h3>
            <p className="mt-1 flex-1 text-sm text-[var(--muted)]">
              Plus the aggregation checker, identifier translator, permission builder and query generator — all on one page, all running in your browser.
            </p>
            <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">See every tool <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span></span>
          </Link>
        </div>
        </Reveal>
      </Container>

      {/* ——— Reference: the facts, not the guides ——— */}
      <Container className="pt-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Reference — read from the platforms&rsquo; own documentation
        </h2>
        <p className="mb-6 max-w-2xl text-sm text-[var(--muted)]">
          Generated, not written. Every value below is read from Apple&rsquo;s documentation JSON or
          verified against both platforms&rsquo; docs, and regenerating the dataset updates every page
          that cites it.
        </p>
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              // The lead: the map of the group pages, each one an anchor for the
              // exact identifier strings developers paste into a search box.
              {
                href: "/healthkit",
                title: "HealthKit, mapped",
                body: `All ${HK_IDENTIFIERS.length} identifiers across ${hkGroupCount} group pages — the unit each comes back in, whether you sum or average it, iOS availability, and the Health Connect record where one is verified.`,
                lead: true,
              },
              {
                href: "/healthkit-identifiers",
                title: `All ${HK_IDENTIFIERS.length} HealthKit types`,
                body: "Quantity, category, characteristic and workout identifiers — with units, availability, and whether you sum or average each one.",
              },
              {
                href: "/healthkit-errors",
                title: `All ${HK_ERRORS.length} HealthKit errors`,
                body: "What each failure means — including why a denied read raises no error at all, and returns an empty result instead.",
              },
              {
                href: "/matrix",
                title: "HealthKit ↔ Health Connect",
                body: "The cross-platform mapping for the metrics we verified on both, and the pairs that look equivalent but are not.",
              },
            ].map((c: { href: string; title: string; body: string; lead?: boolean }) => (
              <Link
                key={c.href}
                href={c.href}
                className={
                  c.lead
                    ? "group flex flex-col rounded-2xl border border-brand-400/40 bg-brand-500/5 p-5 transition hover:-translate-y-0.5 hover:bg-brand-500/10"
                    : "group flex flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
                }
              >
                <h3 className="font-bold tracking-tight text-[var(--fg)]">{c.title}</h3>
                <p className="mt-1 flex-1 text-sm text-[var(--muted)]">{c.body}</p>
                <span className="mt-3 text-sm font-semibold text-brand-600 group-hover:text-brand-500 dark:text-brand-300">
                  Open the reference{" "}
                  <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Also in the reference:{" "}
          <Link href="/healthkit-versions" className="font-medium text-brand-600 hover:text-brand-500">
            HealthKit by iOS version
          </Link>{" "}
          ·{" "}
          <Link href="/health-connect-records" className="font-medium text-brand-600 hover:text-brand-500">
            Health Connect records, verified
          </Link>
        </p>
      </Container>


      {/* ——— Freshness: what moved recently ——— */}
      <Container className="pt-16">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Verified in the last 30 days
            </h2>
            <Link
              href="/changes"
              className="py-1 text-sm font-medium text-brand-600 hover:text-brand-500"
            >
              The full tracker →
            </Link>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {freshPages} of {guideCount} pages were re-checked against their sources in the
            last 30 days, and these are the most recently verified entries in the changes
            tracker. Both numbers are computed at build time from the pages themselves — if
            we stop doing the work, this section says so.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {recentlyVerified.map((e) => (
              <li key={e.title}>
                <Link
                  href={e.page.href}
                  className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 transition-colors hover:border-brand-400"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    {e.status} · checked {e.verifiedOn}
                  </span>
                  <span className="mt-1 text-sm font-medium text-[var(--fg)]">{e.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* ——— Everything we cover ——— */}
      <Container className="pt-16">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Everything we cover
          </h2>
          <div className="flex flex-wrap justify-end gap-x-4">
            <Link href="/questions" className="inline-block py-1 text-sm font-medium text-brand-600 hover:text-brand-500">
              All {questionCount.toLocaleString("en-US")} questions, answered →
            </Link>
            <Link href="/site-index" className="inline-block py-1 text-sm font-medium text-brand-600 hover:text-brand-500">
              Full site index →
            </Link>
          </div>
        </div>
        <Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CLUSTERS.filter((c) => countByPath(c.href) > 0).map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-[var(--fg)]">{c.title}</span>
                {countByPath(c.href) > 0 && (
                  <span className="shrink-0 text-xs font-medium text-[var(--muted)]">
                    {countByPath(c.href)} guides
                  </span>
                )}
              </div>
              <span className="mt-2 text-sm text-[var(--muted)]">{c.blurb}</span>
              <span className="mt-3 text-xs text-[var(--muted)]">
                Newest verified {newestByPath(c.href)}
              </span>
            </Link>
          ))}
        </div>
        </Reveal>
      </Container>

      {/* ——— Why builders trust it ——— */}
      <Container className="pt-16">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Why builders trust this site
        </h2>
        <Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] p-6">
            <h3 className="font-bold tracking-tight text-[var(--fg)]">Sourced, or it doesn&rsquo;t ship</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Every price, limit, and deadline traces to a primary source checked when the page
              was written. When we can&rsquo;t verify a claim, the page says so instead of
              rounding up to certainty.{" "}
              <Link href="/methodology" className="font-medium text-brand-600 hover:text-brand-500">
                How we verify →
              </Link>
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] p-6">
            <h3 className="font-bold tracking-tight text-[var(--fg)]">Dates graded, not sharpened</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              The changes tracker labels every deadline <em>confirmed</em> — vendor&rsquo;s own
              words, quoted — or <em>reported</em>, and keeps each date at the precision its
              evidence supports.{" "}
              <Link href="/changes" className="font-medium text-brand-600 hover:text-brand-500">
                See the tracker →
              </Link>
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] p-6">
            <h3 className="font-bold tracking-tight text-[var(--fg)]">Code that actually runs</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Cookbook recipes are dependency-free files with node:test suites, run in CI on
              every change — the code on the page is a byte-verbatim copy of the file that
              passed.{" "}
              <Link href="/cookbook" className="font-medium text-brand-600 hover:text-brand-500">
                Open the cookbook →
              </Link>
            </p>
          </div>
          <div className="rounded-2xl border border-amber-400/40 bg-amber-500/5 p-6">
            <h3 className="font-bold tracking-tight text-[var(--fg)]">Funding, disclosed</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              KinesteX, an AI motion SDK, funds this site. Every page that features it says so
              in a banner like this one, our comparisons list where its competitors win, and
              nothing here ever crowns the sponsor.{" "}
              <Link href="/methodology" className="font-medium text-brand-600 hover:text-brand-500">
                Read the rules we follow →
              </Link>
            </p>
          </div>
        </div>
        </Reveal>
      </Container>

      {/* ——— The 2026 report + open data ——— */}
      <Container className="pt-16">
        <Reveal>
        <div className="overflow-hidden rounded-3xl border border-[var(--border)]">
          <div className="grid lg:grid-cols-2">
            <div className="gradient-pan bg-gradient-to-br from-brand-600 to-brand-800 p-8 sm:p-10">
              <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                Annual report
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                The State of Fitness APIs 2026
              </h2>
              <p className="mt-3 text-brand-50/90">
                The year the free ride ended: shutdowns, paywalls, and model freezes across the
                ecosystem — what changed, what it costs now, and where the risk sits next.
              </p>
              <Link
                href="/state-of-fitness-apis-2026"
                className="mt-6 inline-block rounded-xl bg-white px-5 py-2.5 font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                Read the report →
              </Link>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <h3 className="font-bold tracking-tight text-[var(--fg)]">The data behind it is open</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Pricing, access models, and status for the ecosystem in one dataset — CC BY 4.0,
                so you can cite it, load it, or build on it.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a href="/datasets/fitness-apis-2026.json" className="rounded-lg border border-[var(--border)] px-4 py-2 font-semibold text-[var(--fg)] transition-colors hover:border-brand-400">
                  fitness-apis-2026.json
                </a>
                <a href="/datasets/fitness-apis-2026.csv" className="rounded-lg border border-[var(--border)] px-4 py-2 font-semibold text-[var(--fg)] transition-colors hover:border-brand-400">
                  fitness-apis-2026.csv
                </a>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </Container>

      {/* ——— What's changing right now ——— */}
      <Container className="pt-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            <DeadlinesLabel
              dates={deadlineItems.map((d) => d.sortDate)}
              asOf={`Dated changes, latest first — as of ${fmtChangeDate(buildDate)}`}
              ahead="On the clock — next deadlines"
              recent="Most recent dated changes"
            />
          </h2>
          <Link href="/changes" className="inline-block py-1 text-sm font-medium text-brand-600 hover:text-brand-500">
            Full tracker →
          </Link>
        </div>
        <Reveal>
        <div className="grid gap-4 lg:grid-cols-3">
          <UpcomingDeadlines items={deadlineItems} limit={3} />
        </div>
        </Reveal>
        <p className="mt-4 text-sm text-[var(--muted)]">
          When a reported date firms up or a term changes, subscribers hear first — with the
          source, not the panic.{" "}
          <Link href="/#subscribe" className="font-medium text-brand-600 hover:text-brand-500">
            Join them below ↓
          </Link>
        </p>
      </Container>

      {/* ——— Latest writing ——— */}
      <Container className="pt-16 pb-16">
        {posts.length > 0 && (
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                Latest writing
              </h2>
              <Link href="/blog" className="inline-block py-1 text-sm font-medium text-brand-600 hover:text-brand-500">
                View all →
              </Link>
            </div>
            <div className="grid gap-6">
              {featured && <PostCard post={featured} />}
              {recent.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {recent.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <Reveal>
          <Newsletter />
        </Reveal>
      </Container>
    </>
  );
}
