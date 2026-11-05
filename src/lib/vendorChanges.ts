import { API_ENTRIES, getApi, type ApiEntry } from "@/data/apis";
import type { ChangeEvent } from "@/data/changes";
import { changesFor } from "@/lib/apiCoverage";

/**
 * Per-vendor change timelines (ops/MORE-30-2026-11-05.md item 15): one page at
 * /changes/<id> and one RSS feed at /feeds/vendors/<id>.xml for each directory
 * product that the changes tracker names often enough to fill one.
 *
 * Nothing is curated here. Which entries belong to a vendor is decided by
 * changesFor() in lib/apiCoverage.ts, the same word-boundary alias match the
 * /apis directory pages, the market map and /fitness-api-index already use,
 * so a timeline can never list an entry its directory page leaves out, or the
 * other way round. A new entry in src/data/changes.ts that names a vendor
 * joins its timeline, and a vendor's page appears once a second entry names
 * it, with no edit here.
 *
 * The floor is two entries. A one-entry timeline is the /changes row it
 * repeats, with a page around it: a thin page, which this site does not
 * publish. qa (VENDOR-CHANGES-*) holds every built page and feed to it.
 */

export const VENDOR_CHANGES_MIN = 2;

export const vendorChangesPath = (id: string) => `/changes/${id}`;
export const vendorFeedPath = (id: string) => `/feeds/vendors/${id}.xml`;

export type VendorTimeline = { api: ApiEntry; events: ChangeEvent[] };

/** Every vendor with a timeline, in directory order. Events newest first. */
export function vendorTimelines(): VendorTimeline[] {
  return API_ENTRIES.map((api) => ({ api, events: changesFor(api) })).filter(
    (t) => t.events.length >= VENDOR_CHANGES_MIN,
  );
}

/** One vendor's timeline, or null when it has none (unknown id, or under the floor). */
export function vendorTimeline(id: string): VendorTimeline | null {
  const api = getApi(id);
  if (!api) return null;
  const events = changesFor(api);
  return events.length >= VENDOR_CHANGES_MIN ? { api, events } : null;
}

/** The newest day any of the timeline's entries was checked against its source page. */
export function timelineCheckedOn(t: VendorTimeline): string {
  return t.events.map((e) => e.verifiedOn).sort().at(-1) as string;
}

/** The oldest such day: every entry was checked on or after it. */
export function timelineOldestCheck(t: VendorTimeline): string {
  return t.events.map((e) => e.verifiedOn).sort()[0];
}
