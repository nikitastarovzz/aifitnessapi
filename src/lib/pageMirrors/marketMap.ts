import { LIBRARIES_FETCHED_ON } from "@/data/libraries";
import { PAGE_H1 } from "@/data/pageTitles";
import { ACCESS_DATASET, API_INDEX_PATH, CATEGORIES, FIRST_PARTY_ID, MARKET_MAP_EMBED_PATH, MARKET_MAP_PATH, marketMapItems } from "@/lib/ecosystemSignals";
import { site } from "@/lib/site";
import { interactiveNote, link, table, type MirrorDoc } from "./core";

/** /market-map.md — mirrors src/app/market-map/page.tsx: every tile, by
 *  category, with the same markers, and the funder disclosure. */
export function marketMapMirror(): MirrorDoc {
  const items = marketMapItems();
  const total = items.length;
  const gated = items.filter((i) => i.gated).length;
  const userCost = items.filter((i) => i.userSideCost).length;
  const byCost = (k: string) => items.filter((i) => i.devCost === k).length;
  const funder = items.find((i) => i.id === FIRST_PARTY_ID);
  const funderCategory = CATEGORIES.find((c) => c.id === funder?.category)?.label;
  const withLibrary = items.filter((i) => i.groups.length > 0).length;
  const largest = [...CATEGORIES]
    .map((c) => ({ ...c, n: items.filter((i) => i.category === c.id).length }))
    .sort((a, b) => b.n - a.n)[0];

  const tiles = CATEGORIES.flatMap((c) => {
    const inCat = items.filter((i) => i.category === c.id);
    return [
      `### ${c.label}`,
      "",
      ...table(
        ["Product", "Billing", "Approval gate", "End-user cost", "Note"],
        inCat.map((i) => [link(i.label, i.href), i.devCostLabel, i.gated ? "gate" : "", i.userSideCost ? "user cost" : "", i.firstParty ? "funds this site" : ""]),
      ),
    ];
  });

  return {
    path: MARKET_MAP_PATH,
    title: PAGE_H1[MARKET_MAP_PATH],
    description:
      "Every fitness and health API in our directory on one map, grouped by category and filterable by billing model, approval gate and tracked library.",
    updated: LIBRARIES_FETCHED_ON,
    dateKind: "data_read",
    type: "record",
    capsule: `The ${total} fitness and health products this site keeps a directory page for, grouped into ${CATEGORIES.length} categories by how they fit into an app: ${CATEGORIES.map((c) => c.label).join("; ")}. The largest is ${largest.label}, with ${largest.n}. By the directory’s billing field, ${byCost("free")} are free to call, ${byCost("free-tier-then-paid")} start on a free tier, ${byCost("usage-based")} bill by usage and ${byCost("contact-sales")} require a sales conversation; ${gated} document an approval gate before launch and ${userCost} need the end user to own or pay for something. Every tile links to the product’s directory page, where each field is sourced.`,
    body: [
      `Generated from the ${link("API directory", "/apis")} at every build · ${total} products in ${CATEGORIES.length} categories · library data read ${LIBRARIES_FETCHED_ON}`,
      "",
      `**Disclosure:** KinesteX, the company that funds this site, is one of the ${total} products. Its tile sits in its own category${funderCategory ? ` (${funderCategory})` : ""}, drawn like every other tile, with a “funds this site” marker. The map orders nothing by merit: tiles keep the directory’s order within each category.`,
      "",
      interactiveNote(MARKET_MAP_PATH, "the filterable map"),
      "",
      "## The map",
      "",
      ...tiles,
      "## Where every tile and marker comes from",
      "",
      "**Tiles and categories:** one tile per entry in `src/data/apis.ts`, which is the provenance-tracked cost model in `src/data/costModel.ts` minus its one non-product row (the generic LLM API line). The categories and their order are the cost model’s `category` field. No product is added, renamed or regrouped for the map.",
      "",
      "**Billing dot:** the cost model’s `devCost` — free (no fee documented for calling it), free tier (a real free entry point that runs out), usage-based (the bill scales with users, events or tokens), contact sales (no public price). No prices, by design.",
      "",
      "**Gate and user-cost markers:** shown when the entry’s `approvalGate` or `userSideCost` field is filled. An empty field means none documented in the sources we checked, which is not the same as none existing.",
      "",
      `**Tracked library filter:** a product matches a group when a package in \`src/data/libraries.ts\` (read from npm, pub.dev and PyPI on ${LIBRARIES_FETCHED_ON}) names it in the registry metadata the generator stores as \`wraps\`. ${withLibrary} of ${total} products match at least one package. It says which libraries this site tracks, not which platforms a product supports.`,
      "",
      "The map is the directory and nothing more. A vendor this site discusses only inside a comparison or a pricing page has no tile until it has a directory entry, so the map is a census of what we cover, not of the market.",
      "",
      "## Download the data",
      "",
      `The fields on these tiles are published as an open dataset generated from the same cost model, under CC BY 4.0: ${link(`${ACCESS_DATASET}.json`, `/datasets/${ACCESS_DATASET}.json`)} and ${link(`${ACCESS_DATASET}.csv`, `/datasets/${ACCESS_DATASET}.csv`)} (it also carries the generic LLM API row the map leaves out). Every dataset is listed on ${link("open datasets", "/datasets")}.`,
      "",
      "## Embed this map",
      "",
      `A compact copy of the map for your own article or deck, without the site chrome and with a link back to this page. It is free to use with that attribution link left intact, and it shows the directory as it stands when your reader opens it — it changes when the directory does. ${link("Preview the widget", MARKET_MAP_EMBED_PATH)}. Other widgets and the terms in full: ${link("embeds & badges", "/badges")}.`,
      "",
      "## Related",
      "",
      `- ${link("Fitness API index: the measurable signals per product", API_INDEX_PATH)}`,
      `- ${link("The fitness API list, product by product", "/apis")}`,
      `- ${link("Compare two APIs side by side", "/compare-apis")}`,
      `- ${link("The State of Fitness APIs 2026", "/state-of-fitness-apis-2026")}`,
      "",
      `By ${site.name}. Product and company names are trademarks of their respective owners; ${site.name} is not affiliated with, endorsed by, or sponsored by any product on this map, with one exception stated above: KinesteX funds this site. Access terms change — confirm current details in each provider’s documentation.`,
    ],
  };
}
