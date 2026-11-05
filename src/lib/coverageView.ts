import { allIntegrations } from "@/data/integrate";
import { COVERAGE_METRICS, COVERAGE_VENDORS, cellState, pushes, type CoverageVendor } from "@/lib/vendorCoverage.mjs";
import { NOT_DOCUMENTED, RATE_LIMIT_VENDORS, windowLabel, type NotDocumented, type RateLimitVendor } from "@/lib/rateLimitCalc.mjs";
import {
  FITBIT_TURNED_OFF,
  GHAPI_COVERAGE_FETCHED_ON,
  GHAPI_COVERAGE_VENDOR,
  GHAPI_RATE_VENDOR,
} from "@/lib/ghapiCoverage";

/**
 * What /tools/api-coverage-matrix and /tools/rate-limit-calculator render, and
 * what their markdown mirrors print: the hand-curated vendor modules plus the
 * Google Health API entries built from the generated dataset, and the date each
 * vendor's sources were read (its integration guide's `updated`, or Google's
 * fetch date). One module so the page and the mirror cannot disagree.
 */

export const COVERAGE_PATH = "/tools/api-coverage-matrix";
export const RATE_LIMIT_PATH = "/tools/rate-limit-calculator";

export const ALL_COVERAGE_VENDORS: CoverageVendor[] = [...COVERAGE_VENDORS, GHAPI_COVERAGE_VENDOR];
export const ALL_RATE_VENDORS: RateLimitVendor[] = [...RATE_LIMIT_VENDORS, GHAPI_RATE_VENDOR];
export const ALL_NOT_DOCUMENTED: NotDocumented[] = [...NOT_DOCUMENTED, FITBIT_TURNED_OFF];

function readOn(guide: string): string | null {
  if (!guide.startsWith("/integrate/")) return GHAPI_COVERAGE_FETCHED_ON;
  return allIntegrations.find((e) => e.slug === guide.slice("/integrate/".length))?.updated ?? null;
}

const dates = (list: { id: string; guide: string }[]) =>
  Object.fromEntries(list.map((v) => [v.id, readOn(v.guide) ?? "unknown"]));

export const COVERAGE_CHECKED: Record<string, string> = dates(ALL_COVERAGE_VENDORS);
export const RATE_CHECKED: Record<string, string> = dates([...ALL_RATE_VENDORS, ...ALL_NOT_DOCUMENTED]);

const latest = (d: Record<string, string>) => Object.values(d).filter((x) => /^\d{4}-/.test(x)).sort().at(-1) ?? GHAPI_COVERAGE_FETCHED_ON;
const earliest = (d: Record<string, string>) => Object.values(d).filter((x) => /^\d{4}-/.test(x)).sort()[0] ?? GHAPI_COVERAGE_FETCHED_ON;

export const COVERAGE_UPDATED = latest(COVERAGE_CHECKED);
export const RATE_UPDATED = latest(RATE_CHECKED);
export const COVERAGE_OLDEST = earliest(COVERAGE_CHECKED);
export const RATE_OLDEST = earliest(RATE_CHECKED);

const SCOPE_TEXT: Record<string, string> = { app: "whole app", user: "per user", unstated: "not stated (applied to whole app)" };

/** One row per limit of every tier, as the page's "Every documented limit"
 *  tables and the mirror both print them. */
export function limitRows(v: RateLimitVendor) {
  return v.tiers.flatMap((t) =>
    t.limits.map((l) => ({
      tier: t.label,
      label: l.label,
      allowed: `${l.max.toLocaleString("en-US")}${l.perUser ? ` + ${l.perUser} × users` : ""} ${l.unit === "days" ? "requested days" : "requests"} per ${windowLabel(l.window)}`,
      scope: SCOPE_TEXT[l.scope],
      src: l.src,
    })),
  );
}

export function coverageCounts() {
  let yes = 0;
  let no = 0;
  let unknown = 0;
  for (const v of ALL_COVERAGE_VENDORS)
    for (const m of COVERAGE_METRICS) {
      const s = cellState(v, m.id).state;
      if (s === "yes") yes++;
      else if (s === "no") no++;
      else unknown++;
    }
  return { vendors: ALL_COVERAGE_VENDORS.length, metrics: COVERAGE_METRICS.length, yes, no, unknown, pushing: ALL_COVERAGE_VENDORS.filter(pushes).length };
}

export function coverageCapsule(): string {
  const c = coverageCounts();
  return `Which wearable and fitness APIs document which health metrics, at what data resolution, how far back you can read, and whether they push data by webhook: ${c.vendors} vendors by ${c.metrics} metrics, each mark linked to the vendor page that states it and quoted. ${c.yes} cells are documented, ${c.no} are ones the vendor says it does not offer, and ${c.unknown} are not stated in the pages read and shown as unknown rather than guessed. ${c.pushing} of the ${c.vendors} document a webhook or push. Sources were read between ${COVERAGE_OLDEST} and ${COVERAGE_UPDATED}; filter by metric or vendor and share the view by URL.`;
}

export function rateLimitCapsule(): string {
  const n = ALL_RATE_VENDORS.length;
  return `Enter your active users, how often each syncs and how many endpoints a sync calls, and this works out the requests you make per window against the rate limits ${n} fitness and health APIs document, including WHOOP's 100 a minute and 10,000 a day, Strava's 15-minute and daily limits, Oura's 5,000 per 5 minutes and Polar's limits that grow with registered users. It shows which limit binds first, the most users that sync pattern supports, and the mitigations each vendor documents, such as webhooks or backoff. ${ALL_NOT_DOCUMENTED.length} APIs whose limits are not published are listed as not documented. Every number is quoted from the vendor's page, read between ${RATE_OLDEST} and ${RATE_UPDATED}; it runs in your browser.`;
}
