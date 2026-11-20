import {
  HEALTH_LIBRARY_SUPPORT,
  HEALTH_LIBRARY_SUPPORT_COMPLETE,
  HEALTH_LIBRARY_SUPPORT_EXCLUDED,
  HEALTH_LIBRARY_SUPPORT_FETCHED_ON,
  type LibrarySupport,
  type LibrarySupportExcluded,
  type LibrarySupportItem,
} from "./healthLibrarySupport";
import { HK_ID_BASE, hkIdentifierPagePath } from "./hkIdentifierPages";
import { HC_RECORDS } from "./healthConnectRecords";
import { HK_IDENTIFIERS } from "./healthkitIdentifiers";
import { recordPath } from "./hcPages";

/**
 * Views over the generated wrapper-library support dataset
 * (src/data/healthLibrarySupport.ts) for the pages that show it: a library's
 * own page, the per-identifier and per-record pages, and the library
 * comparisons. Nothing here adds a fact; every row it returns carries the
 * source line the generator read.
 */

export const LIBRARY_DATA_TYPES_READ_ON = HEALTH_LIBRARY_SUPPORT_FETCHED_ON;
/** Where the method and the full file are described. */
export const LIBRARY_DATA_TYPES_DATASET = "/datasets#health-library-support-2026";

export type Store = "healthkit" | "healthConnect";

export function librarySupport(slug: string): LibrarySupport | undefined {
  return HEALTH_LIBRARY_SUPPORT.find((l) => l.slug === slug);
}

export function librarySupportExcluded(slug: string): LibrarySupportExcluded | undefined {
  return HEALTH_LIBRARY_SUPPORT_EXCLUDED.find((l) => l.slug === slug);
}

/** This site's page for a row: the identifier's own page, or its row in the full table; the record's page. */
export function sitePathFor(item: Pick<LibrarySupportItem, "store" | "id" | "name">): string {
  if (item.store === "healthConnect") {
    const r = HC_RECORDS.find((x) => x.className === item.id);
    if (!r) throw new Error(`libraryDataTypes: ${item.id} is not in healthConnectRecords.ts`);
    return recordPath(r);
  }
  const id = HK_IDENTIFIERS.find((x) => x.objc === item.id);
  if (!id) throw new Error(`libraryDataTypes: ${item.id} is not in healthkitIdentifiers.ts`);
  // The table on /healthkit-identifiers gives every identifier a row anchor.
  return hkIdentifierPagePath(id.case) ?? `${HK_ID_BASE}#id-${id.case.toLowerCase()}`;
}

/** The trimmed row the client-side table renders. */
export type SupportRow = {
  /** hk | hc */
  s: "hk" | "hc";
  /** Swift case or record class */
  n: string;
  /** Objective-C constant (HealthKit only) */
  o: string | null;
  /** quantity | category | characteristic | record */
  f: string;
  /** This site's page */
  p: string;
  /** The source line on GitHub */
  u: string;
  /** path:line */
  w: string;
  /** The source line, verbatim */
  q: string;
};

export function supportRows(l: LibrarySupport): SupportRow[] {
  return [...l.healthkit, ...l.healthConnect].map((i) => ({
    s: i.store === "healthkit" ? "hk" : "hc",
    n: i.name,
    o: i.store === "healthkit" ? i.id : null,
    f: i.family ?? "record",
    p: sitePathFor(i),
    u: i.url,
    w: `${i.path}:${i.line}`,
    q: i.quote,
  }));
}

export type Wrapper = { slug: string; name: string; item: LibrarySupportItem };

/** Every covered library whose read files map this identifier (HealthKit: Objective-C constant; Health Connect: class). */
export function wrappersOf(store: Store, id: string): Wrapper[] {
  const out: Wrapper[] = [];
  for (const l of HEALTH_LIBRARY_SUPPORT) {
    const item = l[store].find((i) => i.id === id);
    if (item) out.push({ slug: l.slug, name: l.name, item });
  }
  return out;
}

/** The covered libraries that read a store at all, for the "of N" count. */
export function librariesReading(store: Store): LibrarySupport[] {
  return HEALTH_LIBRARY_SUPPORT.filter((l) => l.stores.includes(store));
}

/** True when a "no tracked library maps this" line is safe for the store. */
export function noneStatementAllowed(store: Store): boolean {
  return HEALTH_LIBRARY_SUPPORT_COMPLETE[store];
}

export type StoreDiff = { onlyA: LibrarySupportItem[]; onlyB: LibrarySupportItem[]; both: { a: LibrarySupportItem; b: LibrarySupportItem }[] };

/** Types only in A, only in B, and in both, per store both libraries read. */
export function supportDiff(a: LibrarySupport, b: LibrarySupport): { store: Store; diff: StoreDiff }[] {
  const out: { store: Store; diff: StoreDiff }[] = [];
  for (const store of ["healthkit", "healthConnect"] as const) {
    if (!a.stores.includes(store) || !b.stores.includes(store)) continue;
    const inB = new Map(b[store].map((i) => [i.id, i]));
    const inA = new Set(a[store].map((i) => i.id));
    out.push({
      store,
      diff: {
        onlyA: a[store].filter((i) => !inB.has(i.id)),
        onlyB: b[store].filter((i) => !inA.has(i.id)),
        both: a[store].filter((i) => inB.has(i.id)).map((i) => ({ a: i, b: inB.get(i.id)! })),
      },
    });
  }
  return out;
}

export const STORE_LABEL: Record<Store, string> = { healthkit: "HealthKit", healthConnect: "Health Connect" };
