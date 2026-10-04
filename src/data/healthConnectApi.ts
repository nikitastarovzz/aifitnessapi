import { healthConnectApiEntries } from "./healthConnectApi.entries";
import { healthConnectApiMoreEntries } from "./healthConnectApi.more.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

/**
 * Cluster 25 — the Health Connect Jetpack API, one method or class per page.
 * The Android twin of /healthkit-queries.
 *
 * WHY THIS CLUSTER EXISTS. Search Console shows that exact developer strings
 * (a method name, a request class, a permission constant) reach page one for
 * this site where generic phrasing does not. A developer stuck on Health
 * Connect pastes "ReadRecordsRequest" or "aggregateGroupByPeriod" into a
 * search box, and the answer they need is narrow: how this one call behaves
 * and where it bites. Each page owns one method or class (or one tightly
 * bound pair, such as getChangesToken with getChanges) and its primaryQuery
 * is that exact string.
 *
 * BOUNDARY RULES, because several sections are adjacent:
 * - /integrate/google-health-connect owns setup: the dependency, manifest
 *   permissions, getSdkStatus, the first permission request and the first
 *   read. Pages here link to it and do not repeat it.
 * - /fix/health-connect-* owns error strings and "X is not working"
 *   diagnoses (no data, SecurityException, rate limits, an expired changes
 *   token). Pages here explain the mechanism and link to the fix.
 * - /health-connect/<record> owns each record's fields, ranges, permission
 *   strings and aggregate metrics; /health-connect/permissions and
 *   /health-connect/aggregate-metrics own the full lists.
 * - /test/health-connect-test-data owns testing, /migrate/google-fit-to-
 *   health-connect owns migration, /compliance/google-play-health-connect-
 *   publishing-requirements owns Play policy.
 * - /architecture and /cookbook own sync design and tested implementations.
 *   This cluster owns "how does call X work, and what are its traps".
 *
 * EVIDENCE RULES (ops/GEO.md, CLAUDE.md):
 * - Every claim traces to developer.android.com fetched on 2026-10-04: the
 *   Health Connect guides (read, aggregate, sync, write, delete, get started,
 *   metadata, permissions UI) and the androidx.health.connect.client Kotlin
 *   reference pages. Quoted spans are Google's words.
 * - Availability is the "Added in" label the Jetpack reference carries. Where
 *   a member carries no label of its own (most HealthConnectClient methods),
 *   the page says so rather than supplying a version from memory.
 * - Where Google's pages are silent (how a record straddling a bucket edge is
 *   split, whether priority dedupe survives a dataOriginFilter, what an
 *   id-based delete does with another app's id), the page says "Google does
 *   not document" and stops. Where two of Google's pages disagree, the page
 *   quotes both.
 * - Kotlin sketches use only constructors and methods documented on those
 *   pages; helper types and calls are marked as your code.
 */
export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const HCAPI_PATH = "/health-connect-api";
export const HCAPI_CONFIG: ClusterConfig = {
  basePath: HCAPI_PATH,
  hubLabel: "Health Connect API",
};

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_HCAPI = new Set<string>([
  "readrecords-pagination",
  "aggregate-request",
  "aggregategroupbyduration-vs-period",
  "getchanges-incremental-sync",
  "insertrecords-clientrecordid-upsert",
  "deleterecords",
  "permissioncontroller-request-permissions",
  "read-health-data-in-background",
  "read-health-data-history",
  "metadata-recording-method",
  "getfeaturestatus-feature-availability",
  "exercise-route-consent",
  "planned-exercise-session-training-plans",
  "permission-ui-guidelines",
  "healthkit-vs-health-connect-api-equivalents",
]);

export const allHealthConnectApi: ClusterEntry[] = [...healthConnectApiEntries, ...healthConnectApiMoreEntries];

export function releasedHealthConnectApi(): ClusterEntry[] {
  return allHealthConnectApi.filter((e) => RELEASED_HCAPI.has(e.slug));
}

export function getHealthConnectApi(slug: string): ClusterEntry | undefined {
  return releasedHealthConnectApi().find((e) => e.slug === slug);
}
