/**
 * The Fitbit Web API → Google Health API mapping behind
 * /tools/fitbit-to-google-health (ops/AUDIENCE-30-2026-11-05.md item 10).
 *
 * Two generated modules meet here, at build time, so a regeneration of
 * either side updates the tool:
 *   - src/data/fitbitWebApi.ts: Fitbit's 121 endpoint pages, read through
 *     source snapshots, each with the rows of Google's migration tables this
 *     site paired it with (scripts/build-fitbit-web-api.mjs);
 *   - src/data/googleHealthApi.ts: Google's migration tables (data types,
 *     scopes, endpoint types), its data-types table with each type's methods,
 *     and the discovery document's methods.
 *
 * Nothing is matched here that is not in one of those. A pairing whose
 * Google side has gone missing throws, so the build fails rather than ship a
 * row that points at nothing.
 */
import { FITBIT_ENDPOINTS, FITBIT_CATEGORIES, FITBIT_FETCHED_ON, FITBIT_REFERENCE_URL, type FitbitEndpoint } from "@/data/fitbitWebApi";
import {
  GHAPI_DATA_TYPES,
  GHAPI_DATA_TYPE_MAPPING,
  GHAPI_ENDPOINT_MAPPING,
  GHAPI_METHODS,
  GHAPI_SCOPE_MAPPING,
  GHAPI_SOURCES,
  GHAPI_FETCHED_ON,
} from "@/data/googleHealthApi";

export type FgMethod = { label: string; httpMethod: string | null; path: string | null };
export type FgDataType = {
  /** The Fitbit data type as Google's migration table names it. */
  fitbitName: string;
  googleName: string;
  googleDataType: string;
  /** This site's page for the type; null when Google's data-types table does not list it. */
  href: string | null;
  inDataTypesTable: boolean;
  /** Google's own note on the pairing, where the table has one. */
  googleNote: string | null;
  /** The field or resource name on Fitbit's page this pairing rests on. */
  term: string;
  termEvidence: string;
  /** Methods Google's endpoint-type row names that this data type lists. */
  methods: FgMethod[];
  /** Methods Google's endpoint-type row names that the data-types table does not list for this type. */
  missing: string[];
};
export type FgStatus = "mapped" | "partial" | "name-match" | "unmapped";
export type FgRow = {
  id: string;
  category: string;
  categoryTitle: string;
  title: string;
  /** A heading Fitbit prints above the page title (e.g. a deprecation notice), verbatim; null for none. */
  notice: string | null;
  description: string;
  url: string;
  method: string | null;
  paths: string[];
  scope: string | null;
  /** Google's endpoint-type row (verbatim) and its Google Health API answer (verbatim). */
  kind: { fitbit: string; google: string } | null;
  googleScopes: string[];
  dataTypes: FgDataType[];
  /** Methods a named row (profile, devices, subscriptions) points at. */
  methods: FgMethod[];
  nameMatch: FgMethod | null;
  status: FgStatus;
  /** One sentence on why the row has the status it has. */
  why: string;
};

const fail = (m: string): never => {
  throw new Error(`fitbit-to-google-health: ${m}`);
};

/** Backtick tokens in a cell of Google's endpoint table. */
const tokens = (s: string) => [...s.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

/** Google's method word → the data-type operation key it names. */
const OP_OF: Record<string, string> = { list: "list", rollup: "rollup", dailyrollup: "dailyRollup", patch: "update", batchdelete: "batchDelete" };

function dataTypeMethods(dataType: string, words: string[]): { methods: FgMethod[]; missing: string[] } {
  const t = GHAPI_DATA_TYPES.find((d) => d.dataType === dataType);
  // Google's migration table can name a type its data-types table does not
  // list (basal-energy-burned, read 2026-10-31): no methods to show, and the
  // row says so rather than inventing them.
  if (!t) return { methods: [], missing: [] };
  const methods: FgMethod[] = [];
  const missing: string[] = [];
  for (const w of words) {
    const op = OP_OF[w.toLowerCase()];
    if (!op) continue;
    const o = t.operations.find((x) => x.op === op);
    if (o) methods.push({ label: o.method ?? o.op, httpMethod: o.httpMethod, path: o.path });
    else missing.push(w);
  }
  return { methods, missing };
}

function discoveryMethod(token: string): FgMethod[] {
  const id = `health.${token}`;
  const exact = GHAPI_METHODS.find((m) => m.id === id);
  const list = exact ? [exact] : GHAPI_METHODS.filter((m) => m.id?.startsWith(`${id}.`));
  if (!list.length) fail(`${token} is not a discovery method`);
  return list.map((m) => ({ label: (m.id ?? "").replace(/^health\./, ""), httpMethod: m.httpMethod, path: m.flatPath }));
}

function rowOf(e: FitbitEndpoint): FgRow {
  const kindRow = e.kind ? (GHAPI_ENDPOINT_MAPPING.find((k) => k.fitbitEndpointType === e.kind) ?? fail(`endpoint type "${e.kind}" gone`)) : null;
  const words = kindRow ? tokens(kindRow.googleHealthApi) : [];
  const dataTypes: FgDataType[] = e.rows.map((r) => {
    const g = GHAPI_DATA_TYPE_MAPPING.find((x) => x.fitbitDataType === r.google) ?? fail(`"${r.google}" gone from Google's data-type table`);
    const listed = GHAPI_DATA_TYPES.some((d) => d.dataType === g.googleDataType);
    const m = dataTypeMethods(g.googleDataType, words);
    return {
      fitbitName: r.google,
      googleName: g.googleName,
      googleDataType: g.googleDataType,
      href: listed ? `/google-health-api/${g.googleDataType}` : null,
      inDataTypesTable: listed,
      googleNote: g.description,
      term: r.term,
      termEvidence: r.termEvidence,
      methods: m.methods,
      missing: m.missing,
    };
  });
  // Profile, devices and subscriptions name discovery methods directly.
  const methods = kindRow && !e.rows.length ? words.flatMap(discoveryMethod) : [];
  const scopes = (e.scope ?? "")
    .split(/\s+and\s+|,\s*/)
    .map((s) => s.trim())
    .flatMap((s) => GHAPI_SCOPE_MAPPING.find((m) => m.fitbitScope === s)?.googleScopes ?? []);
  const nameMatch = e.nameMatch ? discoveryMethod(e.nameMatch.replace(/^health\./, ""))[0] : null;

  let status: FgStatus;
  let why: string;
  if (kindRow && (dataTypes.length || methods.length)) {
    status = "mapped";
    why = dataTypes.length
      ? `Google's migration tables cover both halves: the data (${dataTypes.map((d) => d.fitbitName).join(", ")}) and the endpoint type (“${kindRow.fitbitEndpointType}”).`
      : `Google's endpoint table names this endpoint (“${kindRow.fitbitEndpointType}”).`;
  } else if (dataTypes.length) {
    status = "partial";
    why = "Google's data-type table maps the data, but its endpoint table has no row for this kind of endpoint, so which method replaces it is not stated.";
  } else if (nameMatch) {
    status = "name-match";
    why = "Google's migration tables do not list this endpoint. The discovery document has a method of the same name; that pairing is this site's name match, not Google's statement.";
  } else {
    status = "unmapped";
    why =
      e.category === "authorization"
        ? "Not in Google's migration tables: the Google Health API uses Google OAuth 2.0, not Fitbit's OAuth endpoints."
        : "Not in Google's migration tables: no row maps this endpoint's data or endpoint type to the Google Health API.";
  }
  return {
    id: e.id,
    category: e.category,
    categoryTitle: e.categoryTitle,
    title: e.title,
    notice: e.notice,
    description: e.description,
    url: e.url,
    method: e.method,
    paths: e.paths,
    scope: e.scope,
    kind: kindRow ? { fitbit: kindRow.fitbitEndpointType, google: kindRow.googleHealthApi } : null,
    googleScopes: [...new Set(scopes)],
    dataTypes,
    methods,
    nameMatch,
    status,
    why,
  };
}

export const FG_ROWS: FgRow[] = FITBIT_ENDPOINTS.map(rowOf);
export const FG_CATEGORIES = FITBIT_CATEGORIES;
export const FG_COUNTS = {
  endpoints: FG_ROWS.length,
  categories: FITBIT_CATEGORIES.length,
  mapped: FG_ROWS.filter((r) => r.status === "mapped").length,
  partial: FG_ROWS.filter((r) => r.status === "partial").length,
  nameMatch: FG_ROWS.filter((r) => r.status === "name-match").length,
  unmapped: FG_ROWS.filter((r) => r.status === "unmapped").length,
  googleRows: GHAPI_DATA_TYPE_MAPPING.length,
  googleRowsUsed: new Set(FG_ROWS.flatMap((r) => r.dataTypes.map((d) => d.fitbitName))).size,
};
/** Google's data-type rows no Fitbit endpoint page here was paired with. */
export const FG_UNUSED_GOOGLE_ROWS = GHAPI_DATA_TYPE_MAPPING.filter((g) => !FG_ROWS.some((r) => r.dataTypes.some((d) => d.fitbitName === g.fitbitDataType))).map((g) => ({
  ...g,
  href: GHAPI_DATA_TYPES.some((d) => d.dataType === g.googleDataType) ? `/google-health-api/${g.googleDataType}` : null,
}));
export const FG_FITBIT_READ_ON = FITBIT_FETCHED_ON;
export const FG_GOOGLE_READ_ON = GHAPI_FETCHED_ON;
export const FG_FITBIT_URL = FITBIT_REFERENCE_URL;
export const FG_MIGRATION_URL = GHAPI_SOURCES.find((s) => s.key === "migration")?.url ?? fail("migration source missing");
export const FG_SPECS_URL = GHAPI_SOURCES.find((s) => s.key === "apiSpecifications")?.url ?? fail("apiSpecifications source missing");
/** The date the page declares: the newer of the two reads. */
export const FG_UPDATED = [FITBIT_FETCHED_ON, GHAPI_FETCHED_ON].sort().pop()!;
