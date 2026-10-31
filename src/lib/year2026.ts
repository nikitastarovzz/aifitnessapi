import { CHANGE_EVENTS, type ChangeEvent, type ChangeStatus } from "@/data/changes";
import { SDK_REPOS, SDK_CHECKED_ON } from "@/data/sdkReleases";
import { LIBRARIES, LIBRARIES_FETCHED_ON } from "@/data/libraries";
import { HC_RELEASES, HC_RELEASES_FETCHED_ON, HC_RELEASES_SOURCE } from "@/data/hcReleases";
import { GHAPI_DATA_TYPES, GHAPI_FETCHED_ON, GHAPI_RELEASE_NOTES, GHAPI_TIMELINE } from "@/data/googleHealthApi";
import { LIBRARIES_BASE, LIBRARY_GROUPS } from "@/data/librariesEditorial";

const REGISTRY: Record<string, string> = { npm: "npm", pub: "pub.dev", pypi: "PyPI" };
import { allSpokes } from "@/lib/clusterRegistry";
import { daysBetween, shortDate } from "@/lib/ecosystemDerive";

/**
 * The data behind /2026, "Fitness APIs in 2026": one computed stat per slide.
 *
 * Every value is counted or read from a module the repo already holds, at
 * build time; nothing is typed in by hand, so a rebuild is the update. The
 * page is titled "so far" while the build date is before 2027-01-01 and
 * becomes the full-year recap on the first build in 2027, with no edit.
 *
 * Rules this file keeps:
 * - Date precision is the tracker's. An entry dated "2026" is counted in the
 *   year but never placed in a month: its sortDate is a sort key, not a date.
 * - A count that is a lower bound says so. sdkReleases.ts keeps a repo's five
 *   newest GitHub releases, and libraries.ts keeps only each package's latest
 *   publish, so neither can say how many times a package released in a year.
 * - Server HTML makes no upcoming-or-past claim (see UpcomingDeadlines.tsx):
 *   "dated after the build date" names the date, so it stays true when read.
 * - A slide whose stat would rest on a single item is dropped, not padded.
 */

export const YEAR_PATH = "/2026";
export const YEAR = "2026";
const NEXT_YEAR_START = "2027-01-01";

export type SlideSource = { file: string; date: string; dateLabel: string; url?: string };
export type Slide = {
  id: string;
  kicker: string;
  /** The headline value, as printed. */
  value: string;
  /** What the value counts, one line. */
  label: string;
  /** One or two sentences of context, all computed. */
  detail: string;
  /** Caveat that travels with the stat when it is shared. */
  caveat?: string;
  source: SlideSource;
  link: { href: string; label: string };
  chart?: "changes-months" | "release-months" | "freshness";
  /** The rows a count is made of, so it can be checked by hand. */
  items?: { text: string; href: string; note: string }[];
  /** The plain-text version for "copy stat". */
  shareText: string;
};

export type MonthBucket = { month: string; label: string; confirmed: number; reported: number; entries: ChangeEvent[] };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function buildDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** True while the year is still running on the build date. */
export function isSoFar(asOf = buildDate()): boolean {
  return asOf < NEXT_YEAR_START;
}

export function storyTitle(asOf = buildDate()): string {
  return isSoFar(asOf) ? `Fitness APIs in ${YEAR}, so far` : `Fitness APIs in ${YEAR}: the year in numbers`;
}

const inYear = (d: string | null | undefined): d is string => Boolean(d && d.startsWith(YEAR));
const monthOf = (d: string) => (/^\d{4}-\d{2}/.test(d) ? parseInt(d.slice(5, 7), 10) - 1 : null);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const listJoin = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

/* ───────────────────────────── Changes ───────────────────────────── */

/** Tracker entries whose date (at its own precision) falls in the year. Watch items are undated and excluded. */
export function yearChanges(): ChangeEvent[] {
  return CHANGE_EVENTS.filter((e) => e.status !== "watch" && inYear(e.date)).sort((a, b) =>
    a.sortDate < b.sortDate ? -1 : a.sortDate > b.sortDate ? 1 : 0,
  );
}

/** Twelve month buckets plus the year-only entries, which keep their precision. */
export function changeMonths(): { months: MonthBucket[]; yearOnly: ChangeEvent[] } {
  const months: MonthBucket[] = MONTHS.map((label, i) => ({
    month: `${YEAR}-${String(i + 1).padStart(2, "0")}`,
    label,
    confirmed: 0,
    reported: 0,
    entries: [],
  }));
  const yearOnly: ChangeEvent[] = [];
  for (const e of yearChanges()) {
    const m = monthOf(e.date);
    if (m === null) {
      yearOnly.push(e);
      continue;
    }
    months[m].entries.push(e);
    if (e.status === "confirmed") months[m].confirmed++;
    else months[m].reported++;
  }
  return { months, yearOnly };
}

/**
 * Pricing changes: a tracker entry whose title names a plan, tier, price,
 * subscription, membership or free offer. The matched word is kept beside
 * each entry as the evidence for counting it, and shown on the page.
 */
const PRICING_TERM = /\b(plans?|tiers?|pric(?:e|es|ing)|subscriptions?|memberships?|free|paid)\b/i;
export function pricingChanges(): { e: ChangeEvent; term: string }[] {
  return yearChanges().flatMap((e) => {
    const m = PRICING_TERM.exec(e.title);
    return m ? [{ e, term: m[1] }] : [];
  });
}

/* ───────────────────────────── Releases ───────────────────────────── */

export type ReleaseEvent = { pkg: string; version: string; date: string; source: string; href: string | null };

const normVersion = (v: string) => v.replace(/^v/i, "");

/**
 * Every dated release in the year that the repo holds, de-duplicated by
 * package and version: Health Connect's connect-client (Google's full list),
 * GitHub releases in sdkReleases.ts (five newest per repo), and each
 * libraries.ts package's latest registry publish.
 */
export function yearReleases(asOf = buildDate()): ReleaseEvent[] {
  const out = new Map<string, ReleaseEvent>();
  const put = (r: ReleaseEvent) => {
    if (!inYear(r.date) || r.date > asOf) return;
    const k = `${r.pkg}@${normVersion(r.version)}`;
    if (!out.has(k)) out.set(k, r);
  };
  for (const r of HC_RELEASES) {
    if (r.date) put({ pkg: "androidx.health.connect:connect-client", version: r.version, date: r.date, source: "hcReleases.ts", href: "/health-connect-releases" });
  }
  for (const repo of SDK_REPOS) {
    const lib = LIBRARIES.find((l) => l.repoFullName === repo.repo || l.repo === repo.repo);
    for (const r of repo.releases) {
      if (r.publishedAt) {
        put({ pkg: lib?.name ?? repo.label, version: r.tag, date: r.publishedAt, source: "sdkReleases.ts", href: lib ? `${LIBRARIES_BASE}/${lib.slug}` : "/sdk-releases" });
      }
    }
  }
  for (const l of LIBRARIES) {
    put({ pkg: l.name, version: l.latestVersion, date: l.latestPublished, source: "libraries.ts", href: `${LIBRARIES_BASE}/${l.slug}` });
  }
  return [...out.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export function releaseMonths(asOf = buildDate()): { label: string; count: number; events: ReleaseEvent[] }[] {
  const ev = yearReleases(asOf);
  return MONTHS.map((label, i) => {
    const events = ev.filter((r) => monthOf(r.date) === i);
    return { label, count: events.length, events };
  });
}

/** Packages whose 2026 release count can be stated, with whether it is a floor. */
function releaseCounts(asOf: string) {
  const rows: { pkg: string; count: number; floor: boolean; first: string; last: string; href: string; source: string }[] = [];
  const hc = HC_RELEASES.filter((r) => inYear(r.date) && (r.date as string) <= asOf).map((r) => r.date as string).sort();
  if (hc.length) rows.push({ pkg: "androidx.health.connect:connect-client", count: hc.length, floor: false, first: hc[0], last: hc.at(-1)!, href: "/health-connect-releases", source: "hcReleases.ts" });
  for (const repo of SDK_REPOS) {
    const held = repo.releases.filter((r) => r.publishedAt);
    const y = held.filter((r) => inYear(r.publishedAt) && (r.publishedAt as string) <= asOf).map((r) => r.publishedAt as string).sort();
    if (!y.length) continue;
    // Five held and every one in the year: older 2026 releases may exist that the file does not keep.
    const floor = held.length >= 5 && held.every((r) => inYear(r.publishedAt));
    const lib = LIBRARIES.find((l) => l.repoFullName === repo.repo || l.repo === repo.repo);
    rows.push({ pkg: lib?.name ?? repo.label, count: y.length, floor, first: y[0], last: y.at(-1)!, href: lib ? `${LIBRARIES_BASE}/${lib.slug}` : "/sdk-releases", source: "sdkReleases.ts" });
  }
  return rows.sort((a, b) => b.count - a.count);
}

/* ───────────────────────────── Freshness ───────────────────────────── */

export function freshness(asOf = buildDate()) {
  const stamps = allSpokes().map(({ entry }) => entry.updated).filter((d): d is string => /^\d{4}-\d{2}-\d{2}$/.test(d ?? ""));
  const ages = stamps.map((d) => Math.max(0, daysBetween(d, asOf))).sort((a, b) => a - b);
  return {
    pages: ages.length,
    median: ages.length ? ages[Math.floor(ages.length / 2)] : null,
    within90: ages.filter((a) => a < 90).length,
    due: ages.filter((a) => a >= 90).length,
    inYear: stamps.filter((d) => inYear(d) && d <= asOf).length,
    /** Age histogram in 30-day bands, for the chart. */
    bands: [0, 30, 60, 90, 120].map((lo, i, all) => {
      const hi = all[i + 1] ?? Infinity;
      return { label: hi === Infinity ? `${lo}+ d` : `${lo}–${hi - 1} d`, count: ages.filter((a) => a >= lo && a < hi).length, due: lo >= 90 };
    }),
  };
}

/* ───────────────────────────── Slides ───────────────────────────── */

const SITE = "aifitnessapi.com/2026";
const share = (title: string, value: string, label: string, caveat: string | undefined, src: SlideSource, id: string) =>
  `${title}: ${value} ${label}${caveat ? ` (${caveat})` : ""}. Source: ${src.file}, ${src.dateLabel}. ${SITE}#${id}`;

export function slides(asOf = buildDate()): Slide[] {
  const title = storyTitle(asOf);
  const out: (Slide | null)[] = [];
  const add = (s: Omit<Slide, "shareText"> | null) => {
    if (!s) return out.push(null);
    out.push({ ...s, shareText: share(title, s.value, s.label, s.caveat, s.source, s.id) });
  };
  const changesVerified = CHANGE_EVENTS.map((e) => e.verifiedOn).sort().at(-1) as string;
  const changesSrc: SlideSource = { file: "src/data/changes.ts", date: changesVerified, dateLabel: `newest entry checked ${shortDate(changesVerified)}` };

  // 1. Dated changes in the year.
  const ch = yearChanges();
  const confirmed = ch.filter((e) => e.status === "confirmed").length;
  const ahead = ch.filter((e) => e.sortDate > asOf && monthOf(e.date) !== null).length;
  add(
    ch.length < 2
      ? null
      : {
          id: "changes",
          kicker: "The record",
          value: String(ch.length),
          label: `dated changes to fitness and health APIs in ${YEAR}`,
          detail: `${confirmed} confirmed in the vendor's own words, ${ch.length - confirmed} reported. ${ahead > 0 ? `${plural(ahead, "is", "are")} dated after ${shortDate(asOf)}, the day this page was built.` : ""}`.trim(),
          source: changesSrc,
          link: { href: "/changes", label: "Every entry on the changes tracker" },
        },
  );

  // 2. Month by month.
  const { months, yearOnly } = changeMonths();
  const max = Math.max(...months.map((m) => m.entries.length));
  const busiest = months.filter((m) => m.entries.length === max);
  add(
    max < 2
      ? null
      : {
          id: "busiest-month",
          kicker: "Month by month",
          value: busiest.map((m) => MONTHS_LONG[MONTHS.indexOf(m.label)]).join(" & "),
          label: `${busiest.length > 1 ? "tie as the busiest months" : "is the busiest month"} on the tracker, ${plural(max, "change")} ${busiest.length > 1 ? "each" : ""}`.replace(/\s+/g, " ").trim(),
          detail: `Counted by the month each entry is dated in. ${yearOnly.length > 0 ? `${yearOnly.length === 1 ? `1 entry is dated only "${YEAR}" by its source and stays` : `${yearOnly.length} entries are dated only "${YEAR}" by their sources and stay`} out of every month.` : ""}`.trim(),
          source: changesSrc,
          link: { href: "/changes", label: "The changes tracker" },
          chart: "changes-months",
        },
  );

  // 3. Pricing changes.
  const pr = pricingChanges();
  const prConfirmed = pr.filter((p) => p.e.status === "confirmed").length;
  add(
    pr.length < 2
      ? null
      : {
          id: "pricing",
          kicker: "Who pays",
          value: String(pr.length),
          label: `pricing or plan changes logged in ${YEAR}`,
          detail: `${prConfirmed} confirmed in the vendor's own words, ${pr.length - prConfirmed} reported. Each one, with the word that put it on this list:`,
          items: pr.map((p) => ({ text: p.e.title, href: p.e.page.href, note: `${shortDate(p.e.date)} · ${p.e.status} · "${p.term}"` })),
          caveat: "an entry counts when its title names a plan, tier, price, subscription, membership or free offer",
          source: changesSrc,
          link: { href: "/changes", label: "Read each entry on the tracker" },
        },
  );

  // 4. Google Health API arrival.
  const launch = [...GHAPI_RELEASE_NOTES]
    .filter((n) => n.intro.some((b) => /launch/i.test(String((b as { text?: unknown }).text ?? ""))))
    .sort((a, b) => (a.date < b.date ? -1 : 1))[0];
  const ghSrc: SlideSource = {
    file: "src/data/googleHealthApi.ts",
    date: GHAPI_FETCHED_ON,
    dateLabel: `Google's release notes read ${shortDate(GHAPI_FETCHED_ON)}`,
    url: "https://developers.google.com/health/release-notes",
  };
  // The first paragraph of that entry, verbatim: the sentence that makes it the launch.
  const launchLine = launch ? String((launch.intro.find((b) => /launch/i.test(String((b as { text?: unknown }).text ?? ""))) as { text?: unknown } | undefined)?.text ?? "") : "";
  const notesInYear = GHAPI_RELEASE_NOTES.filter((n) => inYear(n.date) && n.date <= asOf).length;
  add(
    !launch || !inYear(launch.date)
      ? null
      : {
          id: "google-health-api",
          kicker: "The arrival",
          value: shortDate(launch.date),
          label: "the Google Health API launch, the Fitbit Web API's successor",
          detail: `Google's release-notes entry for ${launch.dateText} opens "${launchLine}". ${notesInYear} release-note entries are dated ${YEAR}, and Google's data-types table lists ${GHAPI_DATA_TYPES.length} data types.`,
          source: ghSrc,
          link: { href: "/google-health-api", label: "The Google Health API reference" },
        },
  );

  // 5. Fitbit Web API turn-off.
  const off = GHAPI_TIMELINE.find((t) => /turn-off/i.test(t.label));
  const eos = GHAPI_TIMELINE.find((t) => /end of support/i.test(t.label));
  // Google's own sentence about what a request gets after the turn-off, verbatim minus code backticks.
  const offQuote = off?.text.split(/(?<=\.)\s+/).find((s) => /\b4\d\d\b/.test(s))?.replace(/`/g, "") ?? null;
  add(
    !off || !inYear(off.date)
      ? null
      : {
          id: "fitbit-turn-off",
          kicker: "The exit",
          value: shortDate(off.date),
          label: "the Fitbit Web API turn-off date Google gives",
          detail: `${launch && inYear(launch.date) ? `${daysBetween(launch.date, off.date)} days after the Google Health API launch. ` : ""}${eos ? `Support ended ${shortDate(eos.date)}. ` : ""}${offQuote ? `Google: "${offQuote}"` : ""}`.trim(),
          source: { ...ghSrc, dateLabel: `Google's About page read ${shortDate(GHAPI_FETCHED_ON)}`, url: "https://developers.google.com/health/about" },
          link: { href: "/fitbit-api-shutdown", label: "The Fitbit API shutdown center" },
        },
  );

  // 6. Health Connect's own client.
  const hc = HC_RELEASES.filter((r) => inYear(r.date) && (r.date as string) <= asOf);
  const hcStable = hc.filter((r) => r.stage === "stable").length;
  const hcStages = [...new Set(hc.map((r) => r.stage))];
  add(
    hc.length < 2
      ? null
      : {
          id: "health-connect-client",
          kicker: "Platform SDKs",
          value: String(hc.length),
          label: `releases of Health Connect's connect-client in ${YEAR}`,
          detail: `${hcStable === 0 ? `None stable: every one is ${hcStages.length === 1 ? `an ${hcStages[0]}` : listJoin(hcStages)}` : `${hcStable} stable`}, from ${hc.at(-1)!.version} to ${hc[0].version}. Google's full release list, so this count is complete.`,
          source: { file: "src/data/hcReleases.ts", date: HC_RELEASES_FETCHED_ON, dateLabel: `read ${shortDate(HC_RELEASES_FETCHED_ON)}`, url: HC_RELEASES_SOURCE },
          link: { href: "/health-connect-releases", label: "Every Health Connect SDK release" },
        },
  );

  // 7. Open-source packages.
  const shipped = LIBRARIES.filter((l) => inYear(l.latestPublished) && l.latestPublished <= asOf);
  const quiet = LIBRARIES.filter((l) => l.latestPublished < `${YEAR}-01-01`);
  add(
    shipped.length < 2
      ? null
      : {
          id: "packages",
          kicker: "Open source",
          value: `${shipped.length} of ${LIBRARIES.length}`,
          label: `tracked open-source health packages published a release in ${YEAR}`,
          detail: `The other ${quiet.length} last released in ${quiet.length ? `${quiet.map((l) => l.latestPublished.slice(0, 4)).sort()[0]}–${quiet.map((l) => l.latestPublished.slice(0, 4)).sort().at(-1)}` : "—"}. ${listJoin(LIBRARY_GROUPS.filter((g) => LIBRARIES.some((l) => l.group === g.id)).map((g) => g.label))} packages, read from ${listJoin([...new Set(LIBRARIES.map((l) => REGISTRY[l.ecosystem]))])}.`,
          source: { file: "src/data/libraries.ts", date: LIBRARIES_FETCHED_ON, dateLabel: `registries read ${shortDate(LIBRARIES_FETCHED_ON)}` },
          link: { href: "/libraries", label: "The open-source library tracker" },
        },
  );

  // 8. Busiest month for releases.
  const rm = releaseMonths(asOf);
  const rmMax = Math.max(...rm.map((m) => m.count));
  const rmTop = rm.filter((m) => m.count === rmMax);
  const rmTotal = rm.reduce((n, m) => n + m.count, 0);
  add(
    rmMax < 2
      ? null
      : {
          id: "release-month",
          kicker: "Release rhythm",
          value: rmTop.map((m) => MONTHS_LONG[MONTHS.indexOf(m.label)]).join(" & "),
          label: `holds ${rmMax} of the ${rmTotal} dated ${YEAR} releases on record`,
          detail: `Releases of Health Connect's client, the GitHub releases of the tracked SDK repos, and each tracked package's latest registry publish, counted once per version.`,
          caveat: "skews recent: for most packages only the latest release is on record",
          source: { file: "hcReleases.ts, sdkReleases.ts, libraries.ts", date: [HC_RELEASES_FETCHED_ON, SDK_CHECKED_ON, LIBRARIES_FETCHED_ON].sort().at(-1)!, dateLabel: `read ${shortDate(SDK_CHECKED_ON)} to ${shortDate([HC_RELEASES_FETCHED_ON, LIBRARIES_FETCHED_ON].sort().at(-1)!)}` },
          link: { href: "/sdk-releases", label: "The health SDK release tracker" },
          chart: "release-months",
        },
  );

  // 9. Most releases on record.
  const counts = releaseCounts(asOf);
  const top = counts[0];
  add(
    !top || top.count < 2 || (counts[1] && counts[1].count === top.count)
      ? null
      : {
          id: "most-releases",
          kicker: "Busiest package",
          value: `${top.floor ? "≥ " : ""}${top.count}`,
          label: `${YEAR} releases of ${top.pkg}, the most this site can count`,
          detail: `${top.floor ? "The releases on file are" : "All"} dated ${shortDate(top.first)}${top.first !== top.last ? ` to ${shortDate(top.last)}` : ""}. ${counts
            .slice(1)
            .map((c) => `${c.pkg}: ${c.floor ? "at least " : ""}${c.count}`)
            .join("; ")}${counts.length > 1 ? "." : ""}`,
          caveat: `counted only for packages whose release list is on file${top.floor ? "; the file keeps five releases per repo, so this is a floor" : ""}`,
          source: { file: `src/data/${top.source}`, date: top.source === "hcReleases.ts" ? HC_RELEASES_FETCHED_ON : SDK_CHECKED_ON, dateLabel: `read ${shortDate(top.source === "hcReleases.ts" ? HC_RELEASES_FETCHED_ON : SDK_CHECKED_ON)}` },
          link: { href: top.href, label: `${top.pkg} on this site` },
        },
  );

  // 10. This site's own freshness.
  const f = freshness(asOf);
  add(
    f.pages < 2 || f.median === null
      ? null
      : {
          id: "freshness",
          kicker: "Our own clock",
          value: `${f.median} days`,
          label: "median age of this site's verification stamps",
          detail: `Across ${f.pages} cluster pages on ${shortDate(asOf)}: ${f.within90} were re-checked against their sources in the previous 90 days, ${f.due} are due (90 days or older), and ${f.inYear === f.pages ? `every one carries a ${YEAR} stamp` : `${f.inYear} carry a ${YEAR} stamp`}.`,
          source: { file: "src/data/*.entries.ts (updated stamps)", date: asOf, dateLabel: `as of build ${shortDate(asOf)}` },
          link: { href: "/methodology", label: "How pages are verified" },
          chart: "freshness",
        },
  );

  return out.filter((s): s is Slide => s !== null);
}

export type { ChangeStatus };

/**
 * The newest date any input to the story was written or checked: the page's
 * dateModified and its sitemap lastmod. The numbers can only move when one of
 * these does (or when the build date crosses a dated entry, which the page
 * states in words rather than by re-dating itself).
 */
export function yearDataDate(): string {
  const spokes = allSpokes().map(({ entry }) => entry.updated);
  return [
    CHANGE_EVENTS.map((e) => e.verifiedOn).sort().at(-1),
    GHAPI_FETCHED_ON,
    HC_RELEASES_FETCHED_ON,
    SDK_CHECKED_ON,
    LIBRARIES_FETCHED_ON,
    spokes.sort().at(-1),
  ]
    .filter((x): x is string => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x))
    .sort()
    .at(-1) as string;
}
