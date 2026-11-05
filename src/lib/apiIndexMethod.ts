import { WINDOW_DAYS } from "@/lib/ecosystemDerive";

/** The fitness API index's column rules and its median, shared by
 *  src/app/fitness-api-index/page.tsx and its markdown mirror. */
export function median(xs: number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

export const INDEX_METHOD: { col: string; from: string; rule: string }[] = [
  {
    col: "Product, category",
    from: "src/data/apis.ts (from src/data/costModel.ts)",
    rule: "One row per directory entry; the cost model's category label. The generic LLM API row is not a product and is not listed.",
  },
  {
    col: "Billing",
    from: "src/data/costModel.ts — devCost",
    rule: "Copied. \"Contact sales\" is the cost model's \"no public price; you have to ask for a quote\", so those rows say no public price.",
  },
  {
    col: "Approval gate, user-side cost",
    from: "src/data/costModel.ts — approvalGate, userSideCost",
    rule: "Yes when the field is filled; None documented when it is null. Null means none in the sources checked, not none at all. The wording is on each product's directory page.",
  },
  {
    col: "Pricing page here",
    from: "the /pricing cluster (src/data/pricing.entries.ts via the cluster registry)",
    rule: "Yes, linked, when a /pricing page's H1 names the product. Says whether this site has a pricing page, not whether the vendor publishes prices.",
  },
  {
    col: "Vendor SDK releases, last vendor SDK release",
    from: "src/data/hcReleases.ts",
    rule: `Releases of androidx.health.connect:connect-client dated in the ${WINDOW_DAYS} days to the as-of date, read from Google's Jetpack release notes. Only Health Connect has a generator for its vendor SDK's releases; every other row says not tracked, which is not zero.`,
  },
  {
    col: "Packages tracked, newest package release",
    from: "src/data/libraries.ts and src/data/sdkReleases.ts",
    rule: `Packages whose registry metadata (the generator's wraps field) names the product, plus sdkReleases.ts repositories whose covers field names it, de-duplicated by repository. In brackets: how many had a release in the ${WINDOW_DAYS} days to the as-of date. Newest release is the later of the registry publish date and the newest non-prerelease GitHub release.`,
  },
  {
    col: "Tracked changes, latest tracked change",
    from: "src/data/changes.ts",
    rule: `Entries of the changes tracker whose title or summary names the product, matched as lib/apiCoverage.ts matches them; counted when the sort date falls in the ${WINDOW_DAYS} days to the as-of date, with later-dated entries shown as dated ahead. Every status counts (confirmed and reported); the per-product list below shows each one's status.`,
  },
  {
    col: "Pages here",
    from: "lib/apiCoverage.ts over every cluster page",
    rule: "The directory's coverage count: pages naming the product in the title or query, or more than once in the body. A measure of this site's coverage, not of the product.",
  },
  {
    col: "Last verified (age)",
    from: "the `updated` stamp of the page each cost-model entry cites as sourceHref",
    rule: "The date that page was last re-verified against its sources, and its age in days on the as-of date, flagged past 90 days as everywhere on this site.",
  },
];

