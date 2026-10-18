/**
 * Google Health API reference — /google-health-api, /google-health-api/<dataType>,
 * and the five topic pages under it (scopes, fitbit-web-api-mapping,
 * access-and-limits, webhooks, errors).
 *
 * Everything a page states about the API is read out of
 * src/data/googleHealthApi.ts, which scripts/fetch-google-health-api.mjs
 * GENERATES from Google's discovery documents and developer guide — never
 * hand-edited — so a page cannot say anything Google's pages do not. This
 * file holds only the hand-written half: paths, ordering, the grouping by
 * scope family (Google's own scope ids), titles and descriptions built from
 * the data, the answer capsule and FAQ templates (every clause is a field of
 * the data), labels for the cross-check flags, and the links to this site's
 * /data metric pages.
 *
 * There is no markdown mirror for this section (same as /health-connect), so
 * the pages carry no text/markdown alternate and the graph no `encoding`.
 */
import {
  GHAPI_DATA_TYPES,
  GHAPI_DOCUMENTED_SCOPES,
  GHAPI_DISCOVERY,
  GHAPI_DISCOVERY_SCOPES,
  GHAPI_FETCHED_ON,
  GHAPI_FLAGS,
  GHAPI_METHODS,
  GHAPI_PAGES,
  GHAPI_SCHEMAS,
  GHAPI_SOURCES,
  GHAPI_DATA_TYPE_MAPPING,
  GHAPI_ERRORS,
  GHAPI_RELEASE_NOTES,
  GHAPI_WEBHOOK_TYPES,
  type GhapiDataType,
  type GhapiFlag,
  type GhapiSchema,
  type GhapiSection,
  type GhapiSource,
  type GhapiSourceKey,
} from "./googleHealthApi";
import { getDataPage, DATA_PATH } from "./healthData";
import { publishedDate } from "@/lib/schema";

export const GHAPI_BASE = "/google-health-api";
export const GHAPI_PATHS = {
  hub: GHAPI_BASE,
  scopes: `${GHAPI_BASE}/scopes`,
  mapping: `${GHAPI_BASE}/fitbit-web-api-mapping`,
  access: `${GHAPI_BASE}/access-and-limits`,
  webhooks: `${GHAPI_BASE}/webhooks`,
  errors: `${GHAPI_BASE}/errors`,
} as const;

/** The topic pages, in the order the hub and the type pages list them. */
export const GHAPI_TOPICS: { path: string; label: string; blurb: string }[] = [
  {
    path: GHAPI_PATHS.scopes,
    label: "Scopes",
    blurb: "Every scope Google documents, the data types each covers, the ones only the discovery document defines, and the Fitbit Web API scope each replaces.",
  },
  {
    path: GHAPI_PATHS.mapping,
    label: "Fitbit Web API mapping",
    blurb: "Google's own tables: Fitbit Web API scopes, data types and endpoints to their Google Health API equivalents, plus the calculation rules that changed.",
  },
  {
    path: GHAPI_PATHS.access,
    label: "Access and rate limits",
    blurb: "OAuth app verification, the CASA security assessment, the 100-user cap on unverified apps, the default quotas and what to do on a 429.",
  },
  {
    path: GHAPI_PATHS.webhooks,
    label: "Webhooks",
    blurb: "Subscribers, endpoint verification, automatic and manual subscriptions, the notification payload, signatures and the 7-day retry window.",
  },
  {
    path: GHAPI_PATHS.errors,
    label: "Errors and troubleshooting",
    blurb: "Every reason in Google's v4 error catalog, the troubleshooting tables by status code, and ACCOUNT_NOT_LINKED in full.",
  },
];

/** A dataType id equal to one of these would be shadowed by the static page. */
const RESERVED = new Set(Object.values(GHAPI_PATHS).map((p) => p.split("/").pop()));

/**
 * Page dates. Every page in this section renders the generated data and the
 * Google text it carries, so dateModified is the date that data was fetched.
 * datePublished comes from the git-derived map (scripts/backfill-published.mjs
 * dates each route from the commit that first served it); a route newer than
 * the last backfill falls back to the fetch date.
 */
export const ghapiModified = () => GHAPI_FETCHED_ON;
export const ghapiPublished = (path: string) => publishedDate(path.replace(/^\//, ""), ghapiModified());

const SITE_SUFFIX = " · AIFitnessAPI";
const TITLE_MAX = 60;
const DESC_MAX = 155;

export function fit(candidates: string[], max: number): string {
  for (const c of candidates) if (c.length <= max) return c;
  const last = candidates[candidates.length - 1];
  return last.length <= max ? last : `${last.slice(0, max - 1).trimEnd()}…`;
}
export const fitTitle = (c: string[]) => fit(c, TITLE_MAX);
export const fitDescription = (c: string[]) => fit(c, DESC_MAX);

/** "a, b and c". */
export function joinList(xs: string[], last = "and"): string {
  if (xs.length <= 1) return xs.join("");
  if (xs.length === 2) return `${xs[0]} ${last} ${xs[1]}`;
  return `${xs.slice(0, -1).join(", ")} ${last} ${xs[xs.length - 1]}`;
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

/** How the pages name each source in prose. */
export const SOURCE_LABEL: Record<GhapiSourceKey, string> = {
  discoveryV4: "the v4 discovery document",
  discoveryV4beta: "the v4beta discovery document",
  dataTypes: "Google's data-types page",
  scopes: "Google's Scopes page",
  apiSpecifications: "Google's Fitbit migration API specifications",
  about: "Google's About page",
  migration: "Google's Fitbit Web API migration guide",
  rateLimits: "Google's rate-limits page",
  appVerification: "Google's app-verification page",
  webhooks: "Google's webhooks guide",
  errors: "Google's v4 error catalog",
  troubleshooting: "Google's troubleshooting guide",
  releaseNotes: "Google's release notes",
  endpoints: "Google's endpoints guide",
};

export function source(key: GhapiSourceKey): GhapiSource {
  const s = GHAPI_SOURCES.find((x) => x.key === key);
  if (!s) throw new Error(`googleHealthApi.ts has no source ${key}`);
  return s;
}

type PageKey = keyof typeof GHAPI_PAGES;

/** A prose section by id. The generator refuses to write without every
 *  section a page quotes, so a miss here means code and data drifted. */
export function section(page: PageKey, id: string): GhapiSection {
  const s = GHAPI_PAGES[page].sections.find((x) => x.id === id);
  if (!s) throw new Error(`GHAPI_PAGES.${page} has no section #${id} — regenerate or update the page`);
  return s;
}

/** The URL of a section on Google's page. */
export const sectionUrl = (page: GhapiSourceKey, id: string | null) => `${source(page).url}${id ? `#${id}` : ""}`;

/** Every quotable unit of a section: paragraphs, list items, notes, table rows. */
function unitsOf(page: PageKey, id: string | null): string[] {
  const blocks = id === null ? GHAPI_PAGES[page].intro : section(page, id).blocks;
  return blocks.flatMap((b) =>
    b.kind === "p" || b.kind === "note"
      ? [b.text]
      : b.kind === "list"
        ? b.items.flatMap((i) => [i.text, ...(i.sub ?? [])])
        : b.kind === "table"
          ? b.rows.map((r) => r.join(" | "))
          : [],
  );
}

/**
 * The sentence of a Google section that contains `needle`, verbatim. Pages
 * quote Google through this rather than retyping it, so a reworded source
 * fails the build (the weekly regeneration PR stays red) instead of leaving
 * a quotation Google no longer prints.
 */
export function quote(page: PageKey, id: string | null, needle: string, whole = false): string {
  const unit = unitsOf(page, id).find((u) => u.includes(needle));
  if (!unit) throw new Error(`GHAPI_PAGES.${page}#${id ?? "intro"} no longer contains "${needle}" — re-read Google's page and update the quote`);
  if (whole) return unit;
  return sentencesOf(unit).find((s) => s.includes(needle)) ?? unit;
}

/** Split at ". " / "! " / "? " followed by a capital, quote, code span or
 *  parenthesis — the sentence ends Google's prose uses. */
function sentencesOf(s: string): string[] {
  const out: string[] = [];
  const re = /[.!?]\s+(?=[A-Z"“`(])/g;
  let start = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    out.push(s.slice(start, m.index + 1).trim());
    start = m.index + m[0].length;
  }
  out.push(s.slice(start).trim());
  return out.filter(Boolean);
}

// ---------------------------------------------------------------------------
// Data types: order, grouping, lookups
// ---------------------------------------------------------------------------

export function allTypes(): GhapiDataType[] {
  return GHAPI_DATA_TYPES;
}

export function getType(id: string): GhapiDataType | undefined {
  return GHAPI_DATA_TYPES.find((t) => t.dataType === id);
}

export function typePath(t: Pick<GhapiDataType, "dataType">): string {
  return `${GHAPI_BASE}/${t.dataType}`;
}

/** Static params for the type pages; refuses a type a static page would shadow. */
export function typeParams(): { dataType: string }[] {
  for (const t of GHAPI_DATA_TYPES) {
    if (RESERVED.has(t.dataType)) throw new Error(`dataType "${t.dataType}" collides with the static page ${GHAPI_BASE}/${t.dataType}`);
  }
  return GHAPI_DATA_TYPES.map((t) => ({ dataType: t.dataType }));
}

const FAMILY_LABEL: Record<string, string> = {
  activity_and_fitness: "Activity and fitness",
  ecg: "ECG",
  health_metrics_and_measurements: "Health metrics and measurements",
  irn: "Irregular rhythm notifications (IRN)",
  location: "Location",
  logged_symptoms: "Logged symptoms",
  mindfulness: "Mindfulness",
  nutrition: "Nutrition",
  profile: "Profile",
  reproductive_health: "Reproductive health",
  settings: "Settings",
  sleep: "Sleep",
};

/** A scope family's display name. The family is Google's own scope id
 *  ("activity_and_fitness"); the label is presentation only. */
export function familyLabel(f: string): string {
  return FAMILY_LABEL[f] ?? f.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

export const familyAnchor = (f: string) => `family-${f.replace(/_/g, "-")}`;

/** A type's scope family: the family of its first listed scope. */
export const familyOf = (t: GhapiDataType) => t.scopes[0]?.family ?? "other";

/** Families in the order Google's Scopes page lists them. */
export function familyOrder(): string[] {
  const out: string[] = [];
  for (const s of GHAPI_DOCUMENTED_SCOPES) if (!out.includes(s.family)) out.push(s.family);
  for (const t of GHAPI_DATA_TYPES) if (!out.includes(familyOf(t))) out.push(familyOf(t));
  return out;
}

/** Types grouped by scope family, families in Google's order, types in the
 *  table's (alphabetical) order. Families with no data type are omitted. */
export function typesByFamily(): { family: string; label: string; types: GhapiDataType[] }[] {
  return familyOrder()
    .map((family) => ({ family, label: familyLabel(family), types: GHAPI_DATA_TYPES.filter((t) => familyOf(t) === family) }))
    .filter((g) => g.types.length > 0);
}

/** Every data type a documented scope's family covers. */
export function typesForScope(url: string): GhapiDataType[] {
  return GHAPI_DATA_TYPES.filter((t) => t.scopes.some((s) => s.url === url));
}

export function schema(id: string | null | undefined): GhapiSchema | null {
  return id ? (GHAPI_SCHEMAS[id] ?? null) : null;
}

/** Operations a type supports by method name ("create", "patch", "rollUp"…). */
export const hasMethod = (t: GhapiDataType, method: string) => t.operations.some((o) => o.method === method);
export const opNames = (t: GhapiDataType) => t.operations.map((o) => o.op);
export const isWritable = (t: GhapiDataType) => hasMethod(t, "create") || hasMethod(t, "patch") || hasMethod(t, "batchDelete");

export function dataPointMethods() {
  return GHAPI_METHODS.filter((m) => m.resource === "users.dataTypes.dataPoints");
}

/** The users.dataTypes.dataPoints method a table operation names. */
export const methodOf = (name: string | null) => (name ? (dataPointMethods().find((m) => m.name === name) ?? null) : null);

// ---------------------------------------------------------------------------
// This site's metric pages — editorial pairings, linked only when released.
// ---------------------------------------------------------------------------

const METRIC_PAGES: Record<string, string> = {
  "heart-rate": "heart-rate-api",
  steps: "step-counting-api",
  sleep: "sleep-tracking-api",
  "blood-glucose": "blood-glucose-api",
  "oxygen-saturation": "blood-oxygen-api",
  "daily-oxygen-saturation": "blood-oxygen-api",
  "daily-resting-heart-rate": "resting-heart-rate-api",
  "heart-rate-variability": "hrv-api",
  "daily-heart-rate-variability": "hrv-api",
  "vo2-max": "vo2-max-api",
  "run-vo2-max": "vo2-max-api",
  "daily-vo2-max": "vo2-max-api",
  "daily-respiratory-rate": "respiratory-rate-api",
  "respiratory-rate-sleep-summary": "respiratory-rate-api",
  "menstrual-period": "menstrual-cycle-api",
  weight: "body-composition-api",
  "body-fat": "body-composition-api",
  exercise: "workout-detection-api",
};

export function metricPage(t: GhapiDataType): { href: string; label: string } | null {
  const slug = METRIC_PAGES[t.dataType];
  const e = slug ? getDataPage(slug) : undefined;
  return e ? { href: `${DATA_PATH}/${slug}`, label: e.h1 } : null;
}

// ---------------------------------------------------------------------------
// Cross-check flags
// ---------------------------------------------------------------------------

/** A short heading per flag kind; the flag's own summary carries the facts. */
export const FLAG_LABEL: Record<string, string> = {
  "scope-not-in-discovery": "Scope missing from the discovery document",
  "scope-not-on-scopes-page": "Scope missing from the Scopes page",
  "scope-not-accepted-by-method": "Scope not accepted by the method",
  "mapping-type-not-in-table": "Mapped type missing from the data-types table",
  "datapoint-property-without-table-row": "DataPoint field with no table row",
  "no-v4-datapoint-property": "No v4 DataPoint field",
  "operation-name-differs": "Operation name differs",
  "operation-without-method": "Operation with no method",
  "method-not-in-table": "Method missing from the table",
  "rollup-not-in-table": "Rollup missing from the table",
  "rollup-not-in-discovery": "Rollup missing from the discovery document",
  "webhook-support-differs": "Webhook support differs",
  "release-note-webhook-type-not-listed": "Release note and webhook pages differ",
  "reference-anchor-differs": "Reference link points elsewhere",
  "restricted-scope-wording": "Restricted-scope wording differs",
};
export const flagLabel = (kind: string) => FLAG_LABEL[kind] ?? kind;

/** Flags by kind, in first-seen order, for the hub's summary. */
export function flagsByKind(): { kind: string; flags: GhapiFlag[] }[] {
  const out: { kind: string; flags: GhapiFlag[] }[] = [];
  for (const f of GHAPI_FLAGS) {
    const g = out.find((x) => x.kind === f.kind);
    if (g) g.flags.push(f);
    else out.push({ kind: f.kind, flags: [f] });
  }
  return out;
}

/** Flags that concern no single data type (scope lists, wording). */
export const sectionFlags = () => GHAPI_FLAGS.filter((f) => !f.dataType || !getType(f.dataType));

// ---------------------------------------------------------------------------
// Titles, descriptions, capsule, FAQs — built from the type's own fields.
// ---------------------------------------------------------------------------

/** Display name lower-cased for prose, acronyms kept ("VO2 Max" → "VO2 max"). */
export function nameLower(t: GhapiDataType): string {
  return t.name
    .split(" ")
    .map((w) => (/^[A-Z0-9]{2,}/.test(w) || /\(/.test(w) ? w : w.toLowerCase()))
    .join(" ");
}

const article = (w: string) => (/^[AEIOU]/i.test(w) ? "an" : "a");

export function typeTitle(t: GhapiDataType): string {
  return fitTitle([
    `Google Health API ${t.name} (${t.dataType})${SITE_SUFFIX}`,
    `Google Health API ${t.name} (${t.dataType})`,
    `${t.name} (${t.dataType}) · Google Health API`,
    `${t.name} · Google Health API data type`,
    `${t.name} · Google Health API`,
  ]);
}

export function typeH1(t: GhapiDataType): string {
  return `${t.name}: the Google Health API ${t.dataType} data type`;
}

function scopeFamilyPhrase(t: GhapiDataType): string {
  const fams = [...new Set(t.scopes.map((s) => s.family))];
  return fams.map((f) => `${f} scope${t.scopes.filter((s) => s.family === f).length > 1 ? "s" : ""}`).join(" and ");
}

export function typeDescription(t: GhapiDataType): string {
  const ops = joinList(opNames(t));
  const res = t.storageResolution ? `, ${t.storageResolution} storage` : "";
  const n = t.operations.length;
  return fitDescription([
    `Google Health API ${t.name} (${t.dataType}): ${t.recordType} record${res}, ${ops}. Scopes, fields, rollups and the Fitbit predecessor, from Google's docs.`,
    `Google Health API ${t.name} (${t.dataType}): ${t.recordType} record${res}, ${ops}. Scopes, fields and request paths from Google's docs.`,
    `Google Health API ${t.dataType}: ${t.recordType} record, ${ops}. Scopes, fields and request paths, read from Google's documentation.`,
    `Google Health API ${t.dataType}: ${t.recordType} record, ${n} operation${n === 1 ? "" : "s"}, scopes, fields and request paths, from Google's documentation.`,
  ]);
}

/** Every clause is a field of the type. Plain text (it renders speakable). */
export function typeCapsule(t: GhapiDataType): string {
  const ops = opNames(t);
  const scopes = t.scopes.map((s) => s.shorthand);
  const parts: string[] = [];
  parts.push(
    `${t.name} (${t.dataType}) is ${article(t.recordType)} ${t.recordType} data type in the Google Health API${
      t.channel === "v4beta" ? ", tagged v4beta: Google's preview channel, not the stable v4" : ""
    }.`,
  );
  parts.push(
    `Google's data-types table lists ${joinList(ops)} for it under the ${joinList(scopes)} scope${scopes.length > 1 ? "s" : ""}${
      t.storageResolution ? `, with a storage resolution of ${t.storageResolution}` : ""
    }.`,
  );
  const badges = [t.webhookSupport ? "webhook support" : null, t.trueZerosSupport ? "true-zeros support" : null].filter(Boolean) as string[];
  parts.push(badges.length ? `The table marks it with ${joinList(badges)}.` : "The table marks it with neither webhook nor true-zeros support.");
  parts.push(
    t.fitbit
      ? `Google's Fitbit migration table maps the Fitbit Web API's ${t.fitbit.fitbitDataType.replace(/`/g, "")} data to it.`
      : "Google's Fitbit migration table names no Fitbit Web API predecessor for it.",
  );
  return parts.join(" ");
}

/** FAQ answers are plain text; every clause comes from the data. */
export function typeFaqs(t: GhapiDataType): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  const write = t.scopes.filter((s) => s.access === "write");
  const scopeFlags = t.flags.filter((f) => f.kind === "scope-not-in-discovery");

  const consent = t.scopes.filter((s) => s.permission).map((s) => `${s.shorthand}, "${s.permission}"`);
  faqs.push({
    q: `Which OAuth scopes does the Google Health API ${t.dataType} data type need?`,
    a: `Google's data-types table (read ${GHAPI_FETCHED_ON}) lists ${joinList(t.scopes.map((s) => s.url))} for ${t.dataType}.${
      consent.length ? ` The Scopes page's consent text: ${consent.join("; ")}` : ""
    }${
      scopeFlags.length
        ? ` Note that ${joinList(scopeFlags.map((f) => f.scope ?? ""))} ${scopeFlags.length > 1 ? "are" : "is"} not defined in the v4 discovery document, and none of its methods lists ${scopeFlags.length > 1 ? "them" : "it"} among accepted scopes.`
        : ""
    }`,
  });

  const create = t.operations.find((o) => o.method === "create");
  const patch = t.operations.find((o) => o.method === "patch");
  const del = t.operations.find((o) => o.method === "batchDelete");
  if (create || patch || del) {
    faqs.push({
      q: `Can apps write ${nameLower(t)} data to the Google Health API?`,
      a: `Yes. Google's data-types table lists ${joinList([create, patch, del].filter(Boolean).map((o) => o!.op))} for ${t.dataType}.${
        create ? ` create is ${create.httpMethod} ${create.path}.` : ""
      }${patch ? ` The table's "${patch.op}" has no method of that name in the discovery document; Google's endpoint-mapping table points updates at patch, which is ${patch.httpMethod} ${patch.path}.` : ""}${
        del ? ` batchDelete is ${del.httpMethod} ${del.path}.` : ""
      }${write.length ? ` Writes need ${joinList(write.map((s) => s.url))}.` : ""}`,
    });
  } else {
    faqs.push({
      q: `Can apps write ${nameLower(t)} data to the Google Health API?`,
      a: `Not according to Google's data-types table, read ${GHAPI_FETCHED_ON}: it lists only ${joinList(opNames(t))} for ${t.dataType}, and no create, update or batchDelete operation.`,
    });
  }

  const rollFlags = t.flags.filter((f) => f.kind === "rollup-not-in-table");
  if (t.rollup || t.dailyRollup) {
    const bits: string[] = [];
    const rollOp = t.operations.find((o) => o.method === "rollUp");
    const dailyOp = t.operations.find((o) => o.method === "dailyRollUp");
    if (t.rollup && rollOp) {
      const s = schema(t.rollup.schema?.id);
      bits.push(`rollUp (${rollOp.httpMethod} ${rollOp.path}) returns RollupDataPoint.${t.rollup.property}, a ${t.rollup.schema?.id} with ${joinList((s?.fields ?? []).map((f) => f.name))}`);
    }
    if (t.dailyRollup && dailyOp) {
      const s = schema(t.dailyRollup.schema?.id);
      bits.push(`dailyRollUp (${dailyOp.httpMethod} ${dailyOp.path}) returns DailyRollupDataPoint.${t.dailyRollup.property}, a ${t.dailyRollup.schema?.id} with ${joinList((s?.fields ?? []).map((f) => f.name))}`);
    }
    faqs.push({
      q: `How do you aggregate ${t.dataType} data with the Google Health API?`,
      a: `With the rollup methods Google's table lists for it. ${bits.join("; ")}. Each field is described on this page as the discovery document describes it.`,
    });
  } else {
    faqs.push({
      q: `How do you aggregate ${t.dataType} data with the Google Health API?`,
      a: `Not with rollUp or dailyRollUp, going by Google's data-types table: it lists only ${joinList(opNames(t))} for ${t.dataType}.${
        rollFlags.length
          ? ` The discovery document disagrees: ${rollFlags.map((f) => f.summary.replace(/^The discovery document's /, "its ")).join(" ")} Test before relying on either reading.`
          : " Read the data points with list (or reconcile, where listed) and compute any summary yourself."
      }`,
    });
  }

  if (t.fitbit) {
    faqs.push({
      q: `What did the Google Health API ${t.dataType} data type replace in the Fitbit Web API?`,
      a: `Google's Fitbit Web API migration table maps the Fitbit Web API's "${t.fitbit.fitbitDataType.replace(/`/g, "")}" to ${t.dataType}.${
        t.fitbit.description ? ` Google's note on the row: "${t.fitbit.description.replace(/`/g, "")}"` : ""
      }${t.fitbitScopes.length ? ` The Fitbit Web API scope${t.fitbitScopes.length > 1 ? "s" : ""} Google maps to its scopes: ${joinList(t.fitbitScopes)}.` : ""}`,
    });
  } else {
    faqs.push({
      q: `Does the Google Health API send webhooks for ${t.dataType}?`,
      a: t.webhookSupport
        ? `Yes. Google's data-types table marks ${t.dataType} with webhook support, the webhooks guide lists it${t.webhookToken ? `, and automatic subscriptions name it with the token ${t.webhookToken}` : ""}.`
        : `Not according to Google's data-types table, which does not mark ${t.dataType} with webhook support${t.webhookOnWebhooksPage ? ", although the webhooks guide lists it" : ", and the webhooks guide does not list it"}.`,
    });
  }
  return faqs.slice(0, 4);
}

// ---------------------------------------------------------------------------
// Totals, computed so no page states a stale count.
// ---------------------------------------------------------------------------

export function ghapiTotals() {
  const T = GHAPI_DATA_TYPES;
  return {
    types: T.length,
    v4: T.filter((t) => t.channel === "v4").length,
    beta: T.filter((t) => t.channel !== "v4").length,
    families: typesByFamily().length,
    webhook: T.filter((t) => t.webhookSupport).length,
    trueZeros: T.filter((t) => t.trueZerosSupport).length,
    writable: T.filter(isWritable).length,
    rollup: T.filter((t) => t.rollup || t.dailyRollup).length,
    withFitbit: T.filter((t) => t.fitbit).length,
    devices: new Set(T.flatMap((t) => t.compatibleDevices.map((d) => d.name))).size,
    flags: GHAPI_FLAGS.length,
    typesWithFlags: T.filter((t) => t.flags.length).length,
    documentedScopes: GHAPI_DOCUMENTED_SCOPES.length,
    discoveryScopes: GHAPI_DISCOVERY_SCOPES.filter((s) => s.googleHealth).length,
    discoveryOnlyScopes: GHAPI_DISCOVERY_SCOPES.filter((s) => s.googleHealth && !s.onScopesPage).length,
    methods: GHAPI_METHODS.length,
    dataPointMethods: dataPointMethods().length,
    mappingRows: GHAPI_DATA_TYPE_MAPPING.length,
    errors: GHAPI_ERRORS.length,
    releases: GHAPI_RELEASE_NOTES.length,
    webhookPageTypes: GHAPI_WEBHOOK_TYPES.length,
    revision: GHAPI_DISCOVERY.revision,
  };
}
