import {
  GHAPI_DATA_TYPES,
  GHAPI_FETCHED_ON,
  GHAPI_PAGES,
  GHAPI_RATE_LIMITS,
  GHAPI_SOURCES,
  GHAPI_TABLE_KEY,
  GHAPI_TIMELINE,
  GHAPI_WEBHOOK_TYPES,
} from "@/data/googleHealthApi";
import { GHAPI_PATHS } from "@/data/ghapiPages";
import type { CoverageCell, CoverageMetricId, CoverageVendor } from "@/lib/vendorCoverage.mjs";
import { parsePublishedLimit, type Limit, type NotDocumented, type RateLimitVendor } from "@/lib/rateLimitCalc.mjs";

/**
 * The Google Health API's column of the coverage matrix and its entry in the
 * rate-limit calculator, built from the generated src/data/googleHealthApi.ts
 * (Google's data-types table, rate-limits table and pages, fetched
 * GHAPI_FETCHED_ON) rather than typed by hand.
 *
 * The one editorial step is METRIC_TYPES: which of Google's data types sit
 * under each matrix row. Everything a cell says (the type's name, record type,
 * storage resolution and webhook support) is read from Google's table row,
 * and the link is the row's reference URL. A name listed here that the table
 * does not contain, or a limit text parsePublishedLimit cannot read, throws
 * and fails the build rather than publishing a guess.
 */

const EV = "src/data/googleHealthApi.ts";
export const GHAPI_COVERAGE_FETCHED_ON = GHAPI_FETCHED_ON;

const METRIC_TYPES: Partial<Record<CoverageMetricId, string[]>> = {
  "heart-rate": ["heart-rate"],
  hrv: ["heart-rate-variability", "daily-heart-rate-variability"],
  sleep: ["sleep"],
  steps: ["steps"],
  workouts: ["exercise"],
  spo2: ["oxygen-saturation", "daily-oxygen-saturation"],
  respiration: ["daily-respiratory-rate", "respiratory-rate-sleep-summary"],
  temperature: ["core-body-temperature", "skin-temperature-sensors"],
  body: ["weight", "body-fat"],
  vo2max: ["run-vo2-max"],
  glucose: ["blood-glucose"],
};

const sourceUrl = (key: string): string => {
  const s = GHAPI_SOURCES.find((x) => x.key === key);
  if (!s) throw new Error(`ghapiCoverage: no GHAPI source "${key}"`);
  return s.url;
};

function pageText(key: keyof typeof GHAPI_PAGES, needle: string): string {
  const page = GHAPI_PAGES[key];
  const blocks = [...page.intro, ...page.sections.flatMap((s) => s.blocks)];
  for (const b of blocks) {
    if ("text" in b && typeof b.text === "string" && b.text.includes(needle)) return b.text;
    if (b.kind === "list") for (const i of b.items) if (i.text.includes(needle)) return i.text;
  }
  throw new Error(`ghapiCoverage: "${needle}" not found on the ${key} page`);
}

function cellFor(metric: CoverageMetricId, ids: string[]): CoverageCell {
  const rows = ids.map((id) => {
    const r = GHAPI_DATA_TYPES.find((d) => d.dataType === id);
    if (!r) throw new Error(`ghapiCoverage: data type "${id}" (${metric}) is not in Google's table`);
    return r;
  });
  const res = rows
    .map((r) => (r.storageResolution ? `${r.name}: ${r.storageResolution}` : r.recordType === "Daily" ? `${r.name}: daily` : null))
    .filter(Boolean)
    .join("; ");
  const hooks = rows.filter((r) => r.webhookSupport).map((r) => r.name);
  const note = `${rows.map((r) => `${r.name}${r.channel === "v4beta" ? " (v4beta)" : ""}`).join(", ")}; webhook support: ${
    hooks.length === rows.length ? "yes" : hooks.length === 0 ? "no" : hooks.join(", ")
  }`;
  return {
    note,
    ...(res ? { res } : {}),
    src: {
      url: rows[0].referenceUrl ?? sourceUrl("dataTypes"),
      quote: rows
        .map((r) => [r.name, r.recordType, r.storageResolution, r.webhookSupport ? "webhook support" : null].filter(Boolean).join(" · "))
        .join(" | "),
      ev: EV,
      table: true,
    },
  };
}

const webhookKey = GHAPI_TABLE_KEY.find((k) => k.field === "Webhook support");
const resolutionKey = GHAPI_TABLE_KEY.find((k) => k.field === "Storage resolution");
if (!webhookKey || !resolutionKey) throw new Error("ghapiCoverage: Google's table key lost its webhook or resolution row");

export const GHAPI_COVERAGE_VENDOR: CoverageVendor = {
  id: "google-health-api",
  name: "Google Health API",
  guide: GHAPI_PATHS.hub,
  kind: "cloud",
  cells: Object.fromEntries(
    Object.entries(METRIC_TYPES).map(([m, ids]) => [m, cellFor(m as CoverageMetricId, ids as string[])]),
  ),
  no: {},
  delivery: [
    {
      mode: "webhook",
      note: `Webhooks for ${GHAPI_WEBHOOK_TYPES.length} data types`,
      src: { url: sourceUrl("dataTypes"), quote: webhookKey.description, ev: EV },
    },
    {
      mode: "pull",
      note: "REST: list, roll up and reconcile data points per data type",
      src: { url: sourceUrl("dataTypes"), quote: GHAPI_TABLE_KEY.find((k) => k.field === "Available operations")?.description ?? "", ev: EV },
    },
  ],
  history: [
    {
      note: "Backfill historical data after a user re-authenticates; depth not stated",
      src: { url: sourceUrl("migration"), quote: pageText("migration", "backfill their historical data"), ev: EV },
    },
  ],
  resolution: [{ note: "Each data type states a storage resolution where Google gives one", src: { url: sourceUrl("dataTypes"), quote: resolutionKey.description, ev: EV } }],
};

function rateRow(metric: string) {
  const r = GHAPI_RATE_LIMITS.find((x) => x.metric === metric);
  if (!r) throw new Error(`ghapiCoverage: rate-limit row "${metric}" missing`);
  return r;
}

function limitFrom(metric: string, label: string, scope: Limit["scope"]): Limit {
  const row = rateRow(metric);
  const { max, window } = parsePublishedLimit(row.defaultLimit);
  return { label, max, window, scope, src: { url: sourceUrl("rateLimits"), quote: row.defaultLimit, ev: EV } };
}

/** Google's unverified-app ceiling, read out of the per-user row's QPS text. */
function unverifiedLimits(): Limit[] {
  const row = rateRow("Per user (minutely)");
  const total = /Max ([\d.]+) QPS total/.exec(row.qpsImpact);
  const per = /@ ([\d.]+) QPS per user/.exec(row.qpsImpact);
  const cap = /capped at (\d+) users/.exec(row.qpsImpact);
  if (!total || !per || !cap) throw new Error(`ghapiCoverage: unverified-app text changed: ${row.qpsImpact}`);
  const src = { url: sourceUrl("rateLimits"), quote: row.qpsImpact.split("\n").find((l) => l.includes("Unverified")) ?? row.qpsImpact, ev: EV };
  return [
    { label: "per second, all users (unverified app)", max: Number(total[1]), window: 1, scope: "app", src },
    { label: "per second, per user (unverified app)", max: Number(per[1]), window: 1, scope: "user", src },
  ];
}

/** The unverified-app user cap, for the page's note. */
export const GHAPI_UNVERIFIED_USER_CAP = Number(/capped at (\d+) users/.exec(rateRow("Per user (minutely)").qpsImpact)?.[1]);

const baseLimits = [
  limitFrom("Per user (minutely)", "per minute, per user", "user"),
  limitFrom("Per project (minutely)", "per minute, per project", "app"),
  limitFrom("Per project (daily)", "per day, per project", "app"),
];

export const GHAPI_RATE_VENDOR: RateLimitVendor = {
  id: "google-health-api",
  name: "Google Health API",
  guide: GHAPI_PATHS.access,
  tiers: [
    { id: "default", label: "Default quotas", limits: baseLimits },
    { id: "unverified", label: "Unverified app", limits: [...baseLimits, ...unverifiedLimits()] },
  ],
  scopeNote: {
    text: "Google states per-project and per-user limits; the per-project ones are applied here to all of your app's traffic.",
    src: { url: sourceUrl("rateLimits"), quote: pageText("rateLimits", "Rate limits are evaluated across daily, minutely, and per-user intervals"), ev: EV },
  },
  mitigations: [
    { text: "Back off and retry on 429", src: { url: sourceUrl("rateLimits"), quote: pageText("rateLimits", "backoff sending requests"), ev: EV } },
    { text: `Webhooks for ${GHAPI_WEBHOOK_TYPES.length} data types`, src: { url: sourceUrl("dataTypes"), quote: webhookKey.description, ev: EV } },
  ],
};

const turnOff = GHAPI_TIMELINE.find((t) => t.label === "API turn-off");
if (!turnOff) throw new Error("ghapiCoverage: the Fitbit Web API turn-off is gone from Google's timeline");

/** The Fitbit Web API, for the calculator's not-documented list. */
export const FITBIT_TURNED_OFF: NotDocumented = {
  id: "fitbit",
  name: "Fitbit Web API",
  guide: GHAPI_PATHS.hub,
  reason: `Google's timeline sets its turn-off for ${turnOff.dateText}; its successor, the Google Health API, is in the table above.`,
  src: { url: sourceUrl("about"), quote: turnOff.text, ev: EV },
};
