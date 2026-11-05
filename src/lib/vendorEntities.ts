import ENTITIES from "@/data/wikidataEntities.json";

/**
 * Vendor entities for the vendor pages (ops/MORE-30-2026-11-05.md item 21).
 *
 * Each row of src/data/wikidataEntities.json is a Wikidata item this site
 * fetched (through .github/workflows/source-snapshot.yml, because
 * www.wikidata.org is blocked from the dev environment) with its English
 * label and description and every P856 "official website" claim, verbatim,
 * plus the run and timestamp that read them. A vendor is listed only when one
 * of its P856 values is on the same registrable domain the site's own pages
 * already cite for that vendor (`matchedDomain`), linked from at least one of
 * the vendor's pages here; a vendor with no item, no P856, an item that is
 * not the vendor (the HealthKit search found the Apple Health app, not the
 * framework) or no such link (Fitbit, Google Fit) is left out. ops/GEO.md,
 * decision of 2026-11-05, lists every exclusion and its reason.
 * KinesteX has no Wikidata item that a search found, so it has none here.
 *
 * The JSON is hand-assembled from the snapshot, never typed from memory, and
 * qa's ENTITY-* gates hold it: every sameAs on a built page points at a row,
 * every row's official site is one of its P856 values on its matched domain,
 * every page a row names carries it, and that domain is linked on its pages.
 */

export type VendorEntity = {
  id: string;
  qid: string;
  label: string;
  description: string;
  schemaType: "Organization" | "SoftwareApplication";
  officialSite: string;
  matchedDomain: string;
  p856: { value: string; rank: string }[];
  evidence: { claimsUrl: string; claimsFetched: string; labelUrl: string; labelFetched: string; via: string };
  pages: string[];
};

export const VENDOR_ENTITIES = ENTITIES as VendorEntity[];

export const wikidataUrl = (qid: string) => `https://www.wikidata.org/wiki/${qid}`;

/** The entities a page is about, in data order. */
export function vendorEntitiesFor(path: string): VendorEntity[] {
  return VENDOR_ENTITIES.filter((e) => e.pages.includes(path));
}

/** A schema.org node for the vendor: its Wikidata label, its official site
 *  (the P856 value chosen) and sameAs both. */
export function vendorEntityNode(e: VendorEntity) {
  return {
    "@type": e.schemaType,
    name: e.label,
    url: e.officialSite,
    sameAs: [wikidataUrl(e.qid), e.officialSite],
  };
}
