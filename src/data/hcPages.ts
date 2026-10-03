/**
 * Health Connect record reference — /health-connect, /health-connect/<record>,
 * /health-connect/permissions, /health-connect/aggregate-metrics.
 *
 * The Android twin of the HealthKit reference. Everything a page states about
 * a record is read out of src/data/healthConnectRecords.ts (GENERATED from
 * Google's data-types page and the Jetpack reference — never hand-edited), so
 * a page cannot say anything Google's pages do not. This file holds only the
 * hand-written half: slugs, ordering, page titles and descriptions built from
 * the data, the FAQ templates, the Kotlin snippet templates, the HealthKit
 * pairing (taken ONLY from the verified matrix), and the handful of sentences
 * quoted from Google's guides, each with the URL it was read from.
 *
 * Grouping: Google's data-types page publishes its own seven categories and
 * puts every record in one, so the hub groups by Google's category as
 * printed — no editorial regrouping.
 *
 * There is no markdown mirror for this section (same as /healthkit), so the
 * pages carry no text/markdown alternate and the graph no `encoding` node.
 */
import {
  HC_RECORDS,
  HC_CATEGORIES,
  HC_FETCHED_ON,
  HC_FRAMEWORK_PERMISSIONS,
  type HcRecord,
} from "./healthConnectRecords";
import { ROWS as MATRIX_ROWS, type Row as MatrixRow } from "./matrix";
import { HK_IDENTIFIERS } from "./healthkitIdentifiers";
import { hkGroupSlugOf, releasedHkGroups, HK_BASE } from "./hkGroupPages";

export const HC_BASE = "/health-connect";
export const HC_PERMISSIONS_PATH = `${HC_BASE}/permissions`;
export const HC_AGGREGATES_PATH = `${HC_BASE}/aggregate-metrics`;

/**
 * Page dates. Every page in this section was first built on the day its data
 * was fetched, and renders nothing but that fetch plus the guide quotes
 * below (read the same day), so datePublished = dateModified = the fetch
 * date. When the generator is re-run and the data changes, HC_FETCHED_ON
 * moves with it — that IS a content change for these pages, because every
 * fact on them is the data.
 */
export const HC_PUBLISHED = "2026-10-03";
export const hcModified = () => HC_FETCHED_ON;

const SITE_SUFFIX = " · AIFitnessAPI";
const TITLE_MAX = 60;
const DESC_MAX = 155;

/** Google's categories in Google's order; records within a category in
 *  Google's table order (which is alphabetical by data type name). */
export function categoryOrder(): string[] {
  return HC_CATEGORIES.map((c) => c.name);
}

export function categorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

let ORDERED: HcRecord[] | null = null;
/** All records in hub order: by Google's category order, then table order. */
export function orderedRecords(): HcRecord[] {
  if (ORDERED) return ORDERED;
  const order = categoryOrder();
  ORDERED = HC_RECORDS.map((r, i) => ({ r, i }))
    .sort((a, b) => order.indexOf(a.r.category ?? "") - order.indexOf(b.r.category ?? "") || a.i - b.i)
    .map((x) => x.r);
  return ORDERED;
}

export function recordsInCategory(name: string): HcRecord[] {
  return orderedRecords().filter((r) => r.category === name);
}

export function getRecord(slug: string): HcRecord | undefined {
  return HC_RECORDS.find((r) => r.slug === slug);
}

export function recordPath(r: Pick<HcRecord, "slug">): string {
  return `${HC_BASE}/${r.slug}`;
}

/** The class that owns a permission string, for linking from lists. */
export function recordsForPermission(permission: string): HcRecord[] {
  return orderedRecords().filter((r) => r.readPermissions.includes(permission) || r.writePermissions.includes(permission));
}

/** android.permission.health.READ_STEPS → READ_STEPS */
export function shortPermission(p: string): string {
  return p.replace(/^android\.permission\.health\./, "");
}

export function aggregateAnchor(className: string, metric: string): string {
  return `metric-${className.toLowerCase()}-${metric.toLowerCase().replace(/_/g, "-")}`;
}

export function permissionAnchor(p: string): string {
  return `perm-${shortPermission(p).toLowerCase().replace(/_/g, "-")}`;
}

// ---------------------------------------------------------------------------
// Titles and descriptions — built from the data, held to the qa limits.
// ---------------------------------------------------------------------------

function fit(candidates: string[], max: number): string {
  for (const c of candidates) if (c.length <= max) return c;
  const last = candidates[candidates.length - 1];
  return last.length <= max ? last : `${last.slice(0, max - 1).trimEnd()}…`;
}

/** The data type's name as Google's table prints it, lower-cased for prose,
 *  e.g. "steps", "VO2 max" (acronyms kept). */
export function labelLower(r: HcRecord): string {
  return r.dataTypeLabel.replace(/^([A-Z])([a-z])/, (_, a: string, b: string) => a.toLowerCase() + b);
}

/** <title>, absolute (the layout template is bypassed so the class name —
 *  the query — gets the whole budget). */
export function recordTitle(r: HcRecord): string {
  const l = labelLower(r);
  return fit(
    [
      `${r.className}: Health Connect ${l} data${SITE_SUFFIX}`,
      `${r.className}: Health Connect ${l}${SITE_SUFFIX}`,
      `${r.className}: Health Connect ${l} data`,
      `${r.className}: Health Connect ${l}`,
      `${r.className} · Health Connect record`,
      `${r.className} (Health Connect)`,
    ],
    TITLE_MAX,
  );
}

export function recordH1(r: HcRecord): string {
  return `${r.className}: Health Connect ${labelLower(r)} data`;
}

export function recordDescription(r: HcRecord): string {
  const read = r.readPermissions.map(shortPermission);
  const write = r.writePermissions.map(shortPermission);
  const perms = [...read, ...write].join(", ");
  const n = r.properties.length;
  const metrics = r.aggregateMetrics.length;
  const m = metrics ? `, ${metrics} aggregate metric${metrics === 1 ? "" : "s"}` : "";
  return fit(
    [
      `${r.className} fields and ranges, permissions (${perms})${m} and Kotlin read code, from Google's Jetpack reference.`,
      `${r.className}: ${n} fields, permissions (${perms})${m}, Kotlin read code. From Google's reference.`,
      `${r.className}: fields, ${read[0]} / ${write[0]}${m} and Kotlin read code, from Google's reference.`,
      `${r.className}: fields, permissions${m} and Kotlin read code, from Google's Jetpack reference.`,
    ],
    DESC_MAX,
  );
}

// ---------------------------------------------------------------------------
// The answer capsule — every clause is a field of the record.
// ---------------------------------------------------------------------------

function joinList(xs: string[]): string {
  if (xs.length <= 1) return xs.join("");
  if (xs.length === 2) return `${xs[0]} and ${xs[1]}`;
  return `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}

export function recordCapsule(r: HcRecord): string {
  const shape = r.recordShape ? `${/^[AEIOU]/.test(r.recordShape) ? "an" : "a"} ${r.recordShape} record` : "a record";
  const cat = r.category ? ` in Google's ${r.category} category` : "";
  const read = joinList(r.readPermissions);
  const write = joinList(r.writePermissions);
  const readLead = r.readPermissions.length > 1 ? "Its read permissions are" : "Its read permission is";
  const writeLead = r.writePermissions.length > 1 ? "its write permissions are" : "its write permission is";
  const metrics = r.aggregateMetrics.length
    ? ` It supports ${r.aggregateMetrics.length} aggregate metric${r.aggregateMetrics.length === 1 ? "" : "s"} (${joinList(
        r.aggregateMetrics.slice(0, 4).map((a) => a.name),
      )}${r.aggregateMetrics.length > 4 ? " and more" : ""}).`
    : " Google's reference defines no aggregate metrics on it, so it is read with readRecords rather than aggregate.";
  return `${r.className} is Health Connect's ${labelLower(r)} record — ${shape}${cat}. ${readLead} ${read}; ${writeLead} ${write}.${metrics} Mandatory fields per Google's table: ${joinList(r.mandatoryFields)}.`;
}

// ---------------------------------------------------------------------------
// Kotlin snippets. API names verified on developer.android.com on 2026-10-03:
//   ReadRecordsRequest(recordType: KClass<T>, timeRangeFilter, … pageSize: Int = 1000 …)
//     https://developer.android.com/reference/kotlin/androidx/health/connect/client/request/ReadRecordsRequest
//   TimeRangeFilter.between(startTime: Instant, endTime: Instant)
//     https://developer.android.com/reference/kotlin/androidx/health/connect/client/time/TimeRangeFilter
//   AggregateRequest(metrics: Set<AggregateMetric<*>>, timeRangeFilter, dataOriginFilter = emptySet())
//     https://developer.android.com/reference/kotlin/androidx/health/connect/client/request/AggregateRequest
//   AggregationResult: operator fun <T : Any> get(metric: AggregateMetric<T>): T?
//     https://developer.android.com/reference/kotlin/androidx/health/connect/client/aggregate/AggregationResult
//   HealthConnectClient.getOrCreate(context), readRecords(request), aggregate(request)
//     https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient
//   HealthPermission.getReadPermission(recordType: KClass<Record>)
//     https://developer.android.com/reference/kotlin/androidx/health/connect/client/permission/HealthPermission
// The shape follows Google's own read-data guide example
// (https://developer.android.com/health-and-fitness/health-connect/read-data).
// ---------------------------------------------------------------------------

export function readSnippet(r: HcRecord): string {
  return `import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.records.${r.className}
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.Instant

suspend fun read${r.className.replace(/Record$/, "")}(
    client: HealthConnectClient,
    startTime: Instant,
    endTime: Instant,
): List<${r.className}> {
    val response = client.readRecords(
        ReadRecordsRequest(
            ${r.className}::class,
            timeRangeFilter = TimeRangeFilter.between(startTime, endTime),
        )
    )
    // One page of up to pageSize records (default 1000); follow
    // response.pageToken for the rest.
    return response.records
}`;
}

export function aggregateSnippet(r: HcRecord): string | null {
  const m = r.aggregateMetrics[0];
  if (!m) return null;
  // The value type's import comes from the link on T in Google's signature;
  // kotlin.* types need none.
  const typeImport =
    m.valueTypeQualified && !m.valueTypeQualified.startsWith("kotlin.") ? `\nimport ${m.valueTypeQualified}` : "";
  return `import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.records.${r.className}
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.Instant${typeImport}

suspend fun aggregate${r.className.replace(/Record$/, "")}(
    client: HealthConnectClient,
    startTime: Instant,
    endTime: Instant,
): ${m.valueType}? {
    val response = client.aggregate(
        AggregateRequest(
            metrics = setOf(${r.className}.${m.name}),
            timeRangeFilter = TimeRangeFilter.between(startTime, endTime),
        )
    )
    // get() is declared as returning a nullable value.
    return response[${r.className}.${m.name}]
}`;
}

export function manifestSnippet(r: HcRecord): string {
  return [...r.readPermissions, ...r.writePermissions]
    .map((p) => `<uses-permission android:name="${p}" />`)
    .join("\n");
}

export function permissionHelperSnippet(r: HcRecord): string {
  return `import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.${r.className}

val permissions = setOf(
    HealthPermission.getReadPermission(${r.className}::class),
    HealthPermission.getWritePermission(${r.className}::class),
)`;
}

// ---------------------------------------------------------------------------
// Sentences quoted from Google's guides. Each was read on the date given,
// at the URL given; the pages render them as quotations with attribution.
// ---------------------------------------------------------------------------

export const READ_DATA_GUIDE = "https://developer.android.com/health-and-fitness/health-connect/read-data";

export const GUIDE_QUOTES = {
  /** read-data guide, "Read data" section, read 2026-10-03. */
  aggregateOverRead: {
    text: "For cumulative types like StepsRecord, use aggregate() instead of readRecords() to avoid double counting from multiple sources and improve accuracy.",
    url: READ_DATA_GUIDE,
    read: "2026-10-03",
  },
  /** read-data guide, under the aggregate example, read 2026-10-03. */
  dedup: {
    text: "The aggregation API also contains logic to handle duplicate records, and lessens the chances of rate limiting.",
    url: READ_DATA_GUIDE,
    read: "2026-10-03",
  },
  /** data-types page, "Health and fitness data types", read 2026-10-03. */
  declareFirst: {
    text: "Before requesting any permissions, your app must declare them in the manifest.",
    url: "https://developer.android.com/health-and-fitness/health-connect/data-types",
    read: "2026-10-03",
  },
} as const;

// ---------------------------------------------------------------------------
// HealthKit counterparts — ONLY from the verified matrix (src/data/matrix.ts),
// extracted exactly as the HealthKit group pages extract them, so the two
// sections can never disagree about what is verified.
// ---------------------------------------------------------------------------

export type HkCounterpart = {
  row: MatrixRow;
  /** True when the row names this record as its only Android type — the
   *  only case where the row reads as a pairing of this record. A row with
   *  several Android records groups types; it does not pair them one-to-one. */
  oneToOne: boolean;
  /** Apple identifiers named in the row that have a HealthKit group page. */
  identifiers: { case: string; href: string }[];
};

const RELEASED_HK = new Set(releasedHkGroups().map((e) => e.slug));

export function hkCounterpart(r: HcRecord): HkCounterpart | null {
  const word = new RegExp(`\\b${r.className}\\b`);
  const row = MATRIX_ROWS.find((x) => word.test(x.android));
  if (!row) return null;
  const identifiers: { case: string; href: string }[] = [];
  for (const m of row.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
    const id = HK_IDENTIFIERS.find((i) => i.case === m[1]);
    if (!id) continue;
    const slug = hkGroupSlugOf(id);
    if (!slug || !RELEASED_HK.has(slug)) continue;
    if (identifiers.some((x) => x.case === id.case)) continue;
    identifiers.push({ case: id.case, href: `${HK_BASE}/${slug}#id-${id.case.toLowerCase()}` });
  }
  const androidTypes = row.android.split(",").map((x) => x.trim()).filter(Boolean);
  return { row, oneToOne: androidTypes.length === 1, identifiers };
}

// ---------------------------------------------------------------------------
// Shared permissions — records whose read or write string is also another
// record's (Steps + StepsCadence share READ_STEPS; CyclingPedalingCadence
// uses the exercise permissions).
// ---------------------------------------------------------------------------

/** For each other record that declares any of r's strings, the strings shared. */
export function sharedPermissionDetail(r: HcRecord): { record: HcRecord; strings: string[] }[] {
  const mine = [...r.readPermissions, ...r.writePermissions];
  return sharesPermissionWith(r).map((o) => {
    const theirs = new Set([...o.readPermissions, ...o.writePermissions]);
    return { record: o, strings: mine.filter((p) => theirs.has(p)) };
  });
}

export function sharesPermissionWith(r: HcRecord): HcRecord[] {
  const mine = new Set([...r.readPermissions, ...r.writePermissions]);
  return orderedRecords().filter(
    (o) => o.className !== r.className && [...o.readPermissions, ...o.writePermissions].some((p) => mine.has(p)),
  );
}

// ---------------------------------------------------------------------------
// FAQs — plain text (the FAQ block renders text, not markdown), every answer
// assembled from the record's own fields.
// ---------------------------------------------------------------------------

export function recordFaqs(r: HcRecord): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  const shared = sharedPermissionDetail(r);
  const unresolved = r.permissionCheck.filter((c) => !c.inFrameworkReference && !c.inJetpackConstants);
  faqs.push({
    q: `What permission does ${r.className} need?`,
    a: `Google's Health Connect data-types table (read ${HC_FETCHED_ON}) declares ${joinList(r.readPermissions)} for reading ${
      r.className
    } and ${joinList(r.writePermissions)} for writing it, and says apps must declare permissions in the manifest before requesting them.${shared
      .map(
        (x) =>
          ` ${joinList(x.strings.map(shortPermission))} ${x.strings.length > 1 ? "are" : "is"} also declared for ${x.record.className}.`,
      )
      .join("")}${unresolved
      .map((u) => {
        const fix = HC_FRAMEWORK_PERMISSIONS.find((f) => f.value === `${u.permission}S`);
        return ` Note that ${shortPermission(u.permission)} is not defined by the HealthPermissions reference${
          fix ? `, which defines ${shortPermission(fix.value)} instead` : ""
        }.`;
      })
      .join("")}`,
  });

  if (r.aggregateMetrics.length) {
    faqs.push({
      q: `Which aggregate metrics does ${r.className} support?`,
      a: `Google's Jetpack reference defines ${r.aggregateMetrics.length} on ${r.className}: ${joinList(
        r.aggregateMetrics.map((a) => `${a.name} (AggregateMetric<${a.valueType}>)`),
      )}. Pass ${r.aggregateMetrics.length === 1 ? "it" : "them"} in the metrics set of an AggregateRequest and read ${
        r.aggregateMetrics.length === 1 ? "it" : "each"
      } back from the AggregationResult.`,
    });
  } else {
    faqs.push({
      q: `Can you aggregate ${r.className} with AggregateRequest?`,
      a: `Not directly. As read on ${HC_FETCHED_ON}, Google's Jetpack reference defines no AggregateMetric constants on ${r.className}, so there is no metric to put in an AggregateRequest. Read the records with readRecords and a ReadRecordsRequest, and compute any summary yourself.`,
    });
  }

  const ranged = r.properties.find((p) => p.rangeStatement || p.range);
  if (ranged) {
    const parts = [`Google's reference types ${ranged.name} as ${ranged.type}`];
    if (ranged.range) parts.push(`annotated ${ranged.range.annotation}`);
    let ans = parts.join(", ") + ".";
    if (ranged.description) ans += ` Its description reads: "${ranged.description}"`;
    faqs.push({ q: `What values does ${r.className}.${ranged.name} accept?`, a: ans });
  } else if (r.constants.length) {
    const shown = r.constants.slice(0, 8);
    faqs.push({
      q: `Which constants does ${r.className} define?`,
      a: `Google's reference lists ${r.constants.length} constant${r.constants.length === 1 ? "" : "s"} on ${r.className}, including ${joinList(
        shown.map((c) => `${c.name} = ${c.value}`),
      )}${r.constants.length > shown.length ? " and more" : ""}. Store the constant name or the value it maps to, and treat values you do not recognise as unknown.`,
    });
  }

  const hk = hkCounterpart(r);
  if (hk && hk.oneToOne) {
    faqs.push({
      q: `What is the HealthKit equivalent of ${r.className}?`,
      a: `This site's verified cross-platform matrix pairs ${r.className} with ${hk.row.apple} in its ${hk.row.label} row.${
        hk.row.watchOut ? ` The caveat recorded with that pairing: ${hk.row.watchOut}` : ""
      }`,
    });
  } else if (r.recordShape) {
    faqs.push({
      q: `Is ${r.className} an interval, instantaneous or series record?`,
      a: `Google's data-types table lists ${r.className} as ${r.recordShape}, and defines that column as indicating "whether the data is recorded at an instant in time or over an interval". Its mandatory fields are ${joinList(
        r.mandatoryFields,
      )}.`,
    });
  }
  return faqs.slice(0, 4);
}

// ---------------------------------------------------------------------------
// Permission groups for /health-connect/permissions. The grouping is by the
// literal constant name and by whether a record on Google's data-types page
// declares the string — mechanical, not editorial.
// ---------------------------------------------------------------------------

export type PermissionGroupKey = "record" | "additional" | "medical" | "symptom" | "framework-record" | "system";

export const PERMISSION_GROUPS: { key: PermissionGroupKey; title: string; blurb: string }[] = [
  {
    key: "record",
    title: "Record permissions",
    blurb: "The read and write strings Google's data-types table declares for the record classes on this site, each linked to its record.",
  },
  {
    key: "additional",
    title: "Additional read permissions",
    blurb: "Permissions that are not tied to one record type: background reads, history beyond the default window, and exercise routes.",
  },
  {
    key: "medical",
    title: "Medical records",
    blurb: "The medical-data strings on the framework reference (personal health records), separate from the fitness record types.",
  },
  {
    key: "symptom",
    title: "Symptoms",
    blurb: "Symptom strings the framework reference defines. No Jetpack record class for symptoms appears on Google's data-types page as of this read.",
  },
  {
    key: "framework-record",
    title: "Other framework-only data types",
    blurb: "Data types the framework reference has permissions for but Google's Jetpack data-types table does not list as a record class as of this read.",
  },
  {
    key: "system",
    title: "System and device permissions",
    blurb: "Strings that are not data-type permissions at all.",
  },
];

const ADDITIONAL = new Set([
  "android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND",
  "android.permission.health.READ_HEALTH_DATA_HISTORY",
  "android.permission.health.READ_EXERCISE_ROUTES",
  "android.permission.health.WRITE_EXERCISE_ROUTE",
]);

export function permissionGroupOf(value: string, constant: string, protectionLevel: string | null): PermissionGroupKey {
  if (recordsForPermission(value).length) return "record";
  if (ADDITIONAL.has(value)) return "additional";
  if (/_MEDICAL_DATA/.test(constant)) return "medical";
  if (/_SYMPTOM_/.test(constant)) return "symptom";
  if (/^(READ|WRITE)_/.test(constant) && protectionLevel === "dangerous") return "framework-record";
  return "system";
}

export function groupedFrameworkPermissions() {
  const out = new Map<PermissionGroupKey, typeof HC_FRAMEWORK_PERMISSIONS>();
  for (const g of PERMISSION_GROUPS) out.set(g.key, []);
  for (const p of [...HC_FRAMEWORK_PERMISSIONS].sort((a, b) => a.value.localeCompare(b.value))) {
    out.get(permissionGroupOf(p.value, p.constant, p.protectionLevel))!.push(p);
  }
  return out;
}

/** "Added in API level 34 Also in U Extensions 7" → "API 34 · U Ext 7". */
export function shortAvailability(added: string | null): string | null {
  if (!added) return null;
  const api = added.match(/API level (\d+)/)?.[1];
  const ver = added.match(/Added in version ([0-9.]+)/)?.[1];
  const ext = added.match(/U Extensions (\d+)/)?.[1];
  const head = api ? `API ${api}` : ver ? `version ${ver}` : null;
  return [head, ext ? `U Ext ${ext}` : null].filter(Boolean).join(" · ") || null;
}

/** Totals, computed so the pages never state a stale count. */
export function hcTotals() {
  const permStrings = new Set(HC_RECORDS.flatMap((r) => [...r.readPermissions, ...r.writePermissions]));
  return {
    records: HC_RECORDS.length,
    categories: HC_CATEGORIES.length,
    aggregates: HC_RECORDS.reduce((n, r) => n + r.aggregateMetrics.length, 0),
    recordsWithAggregates: HC_RECORDS.filter((r) => r.aggregateMetrics.length).length,
    recordPermissionStrings: permStrings.size,
    /** Of those, the ones the framework HealthPermissions reference defines. */
    recordPermissionStringsInFramework: [...permStrings].filter((p) => HC_FRAMEWORK_PERMISSIONS.some((f) => f.value === p)).length,
    frameworkPermissions: HC_FRAMEWORK_PERMISSIONS.length,
    properties: HC_RECORDS.reduce((n, r) => n + r.properties.length, 0),
    constants: HC_RECORDS.reduce((n, r) => n + r.constants.length, 0),
  };
}
