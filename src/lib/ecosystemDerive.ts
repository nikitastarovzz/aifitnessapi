/**
 * The client-safe half of lib/ecosystemSignals.ts: row types and the pure
 * functions that turn a row's dates into the numbers /fitness-api-index shows.
 *
 * Split out so the browser bundle carries these few functions and not the
 * cluster registry the server half reads. The server renders the table with
 * `derive(row, buildDate)`; the browser re-runs the same function with
 * today's date, so a page built weeks ago still shows a true "last 12 months"
 * and a true age, and the server HTML and first client render agree.
 */

export type DevCostId = "free" | "free-tier-then-paid" | "usage-based" | "contact-sales";
export type ChangeStatusId = "confirmed" | "reported" | "watch";

export type PackageSignal = {
  name: string;
  /** On-site page for the package, when it has one. */
  href: string | null;
  /** Newest release date we hold: registry publish (libraries.ts) or GitHub release (sdkReleases.ts). */
  latest: string | null;
  source: "libraries.ts" | "sdkReleases.ts" | "libraries.ts + sdkReleases.ts";
  /** Registry deprecation notice, or the repository is archived. */
  deprecated: boolean;
};

export type IndexRow = {
  id: string;
  label: string;
  short: string;
  href: string;
  categoryLabel: string;
  firstParty: boolean;
  devCost: DevCostId;
  devCostLabel: string;
  /** devCost "contact-sales", which the cost model defines as "no public price". */
  quoteOnly: boolean;
  approvalGate: string | null;
  userSideCost: string | null;
  /** A /pricing page here whose H1 names the product. */
  pricingPage: { href: string; label: string } | null;
  /** Vendor SDK release dates, where a generator reads them. */
  officialSdk: { name: string; source: string; dates: string[]; latestVersion: string | null } | null;
  packages: PackageSignal[];
  changes: { date: string; sortDate: string; title: string; status: ChangeStatusId; href: string }[];
  pages: number;
  /** The `updated` stamp of the page the directory entry's facts come from. */
  verified: { date: string; href: string; label: string } | null;
};

export const WINDOW_DAYS = 365;

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** True when `date` falls in the WINDOW_DAYS days ending on `asOf` (inclusive). */
export function inWindow(date: string, asOf: string): boolean {
  const d = daysBetween(date, asOf);
  return d >= 0 && d < WINDOW_DAYS;
}

export type Derived = {
  /** Vendor SDK releases in the window; null when no generator reads that vendor's releases. */
  sdkReleases12: number | null;
  sdkLatest: string | null;
  packageCount: number;
  /** Tracked packages whose newest release falls in the window. */
  packagesActive12: number;
  packageLatest: string | null;
  /** Tracked changes whose sort date falls in the window. */
  changes12: number;
  /** Tracked changes dated after `asOf`. */
  changesAhead: number;
  /** The most recent tracked change on or before `asOf`, at the precision its source states. */
  changeLatest: { date: string; sortDate: string } | null;
  verifiedAge: number | null;
};

/** Every number the index table shows for a row, as of a given day. Pure. */
export function derive(r: IndexRow, asOf: string): Derived {
  const pkgDates = r.packages.flatMap((p) => (p.latest ? [p.latest] : [])).sort();
  const past = r.changes.filter((c) => c.sortDate <= asOf).sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
  return {
    sdkReleases12: r.officialSdk ? r.officialSdk.dates.filter((d) => inWindow(d, asOf)).length : null,
    sdkLatest: r.officialSdk ? ([...r.officialSdk.dates].sort().at(-1) ?? null) : null,
    packageCount: r.packages.length,
    packagesActive12: r.packages.filter((p) => p.latest && inWindow(p.latest, asOf)).length,
    packageLatest: pkgDates.at(-1) ?? null,
    changes12: r.changes.filter((c) => inWindow(c.sortDate, asOf)).length,
    changesAhead: r.changes.filter((c) => c.sortDate > asOf).length,
    changeLatest: past[0] ? { date: past[0].date, sortDate: past[0].sortDate } : null,
    verifiedAge: r.verified ? Math.max(0, daysBetween(r.verified.date, asOf)) : null,
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-04" → "Oct 4, 2026"; keeps a month- or year-precision date at its precision. */
export function shortDate(d: string): string {
  if (/^\d{4}$/.test(d)) return d;
  const [y, m, day] = d.split("-");
  const mn = MONTHS[parseInt(m, 10) - 1];
  return day ? `${mn} ${parseInt(day, 10)}, ${y}` : `${mn} ${y}`;
}
