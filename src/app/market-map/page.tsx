import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import MarketMap from "@/components/MarketMap";
import CopySnippet from "@/components/CopySnippet";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { PAGE_H1 } from "@/data/pageTitles";
import { DEV_COST_LABELS } from "@/data/apis";
import { LIBRARIES_FETCHED_ON } from "@/data/libraries";
import { LIBRARY_GROUPS } from "@/data/librariesEditorial";
import {
  ACCESS_DATASET,
  API_INDEX_PATH,
  CATEGORIES,
  FIRST_PARTY_ID,
  MARKET_MAP_EMBED_PATH,
  MARKET_MAP_PATH,
  marketMapItems,
} from "@/lib/ecosystemSignals";

/**
 * The market map: the API directory drawn as a landscape.
 *
 * It adds no facts. Every tile is a directory entry (src/data/apis.ts, itself
 * the provenance-tracked cost model) and every marker on a tile is one of that
 * entry's fields, or a join against src/data/libraries.ts by the product's
 * proper name. The map's job is to make the shape of the market visible at a
 * glance and to be the page people link and embed when they want "the
 * landscape" — so it ranks nothing, and the funder's tile is the same tile.
 *
 * No dateModified: the directory records no verification date of its own
 * (see the sitemap's note on /apis), and a map borrowing one would claim a
 * check that did not happen.
 */

const H1 = PAGE_H1[MARKET_MAP_PATH];
const META_TITLE = "Fitness & Health API Market Map: Every Product by Category";
const DESCRIPTION =
  "Every fitness and health API in our directory on one map, grouped by category and filterable by billing model, approval gate and tracked library.";

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: DESCRIPTION,
  alternates: { canonical: MARKET_MAP_PATH },
  openGraph: {
    type: "website",
    title: "The fitness & health API market map",
    description:
      "The fitness and health API landscape as one map: wearables, aggregators, platform stores, nutrition, exercise content, motion SDKs and pose models.",
    url: MARKET_MAP_PATH,
  },
};

const EMBED_SNIPPET = `<iframe src="${absoluteUrl(MARKET_MAP_EMBED_PATH)}"
        title="Fitness and health API market map"
        width="100%" height="720" loading="lazy" style="border:0"></iframe>`;

export default function MarketMapPage() {
  const url = absoluteUrl(MARKET_MAP_PATH);
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

  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: H1,
    description: DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: items.map((i, n) => ({
        "@type": "ListItem",
        position: n + 1,
        name: i.label,
        url: absoluteUrl(i.href),
      })),
    },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Market map", path: MARKET_MAP_PATH }]} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Generated from the <Link href="/apis" className="text-brand-600 hover:text-brand-500">API directory</Link>{" "}
          at every build · {total} products in {CATEGORIES.length} categories · library data read{" "}
          {LIBRARIES_FETCHED_ON}
        </p>

        <aside
          role="note"
          className="mt-6 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-[var(--fg)]"
        >
          <strong>Disclosure:</strong> KinesteX, the company that funds this site, is one of the {total}{" "}
          products. Its tile sits in its own category{funderCategory ? ` (${funderCategory})` : ""}, drawn
          like every other tile, with a &ldquo;funds this site&rdquo; marker. The map orders nothing by merit:
          tiles keep the directory&rsquo;s order within each category.
        </aside>

        <AnswerCapsule>
          The {total} fitness and health products this site keeps a directory page for, grouped into{" "}
          {CATEGORIES.length} categories by how they fit into an app: {CATEGORIES.map((c) => c.label).join("; ")}.
          The largest is {largest.label}, with {largest.n}. By the directory&rsquo;s billing
          field, {byCost("free")} are free to call, {byCost("free-tier-then-paid")} start on a free tier,{" "}
          {byCost("usage-based")} bill by usage and {byCost("contact-sales")} require a sales conversation;{" "}
          {gated} document an approval gate before launch and {userCost}{" "}need the end user to own or pay for
          something. Every tile links to the product&rsquo;s directory page, where each field is sourced.
        </AnswerCapsule>
      </div>

      <section className="mx-auto mt-10 max-w-6xl" aria-labelledby="map-heading">
        <h2 id="map-heading" className="sr-only">
          The map
        </h2>
        <MarketMap
          items={items}
          categories={CATEGORIES}
          devCosts={(Object.keys(DEV_COST_LABELS) as (keyof typeof DEV_COST_LABELS)[]).map((k) => ({
            id: k,
            label: DEV_COST_LABELS[k],
          }))}
          groups={LIBRARY_GROUPS.map((g) => ({ id: g.id, label: g.label }))}
        />
      </section>

      <div className="mx-auto max-w-3xl">
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Where every tile and marker comes from</h2>
          <div className="mt-4 space-y-3 leading-relaxed text-[var(--muted)]">
            <p>
              <strong className="font-semibold text-[var(--fg)]">Tiles and categories:</strong> one tile per
              entry in <code className="text-xs">src/data/apis.ts</code>, which is the provenance-tracked cost
              model in <code className="text-xs">src/data/costModel.ts</code>{" "}minus its one non-product row (the
              generic LLM API line). The categories and their order are the cost model&rsquo;s{" "}
              <code className="text-xs">category</code> field. No product is added, renamed or regrouped for the
              map.
            </p>
            <p>
              <strong className="font-semibold text-[var(--fg)]">Billing dot:</strong> the cost model&rsquo;s{" "}
              <code className="text-xs">devCost</code> — free (no fee documented for calling it), free tier (a
              real free entry point that runs out), usage-based (the bill scales with users, events or tokens),
              contact sales (no public price). No prices, by design.
            </p>
            <p>
              <strong className="font-semibold text-[var(--fg)]">Gate and user-cost markers:</strong>{" "}shown when
              the entry&rsquo;s <code className="text-xs">approvalGate</code> or{" "}
              <code className="text-xs">userSideCost</code> field is filled. An empty field means none
              documented in the sources we checked, which is not the same as none existing.
            </p>
            <p>
              <strong className="font-semibold text-[var(--fg)]">Tracked library filter:</strong> a product
              matches a group when a package in <code className="text-xs">src/data/libraries.ts</code> (read from
              npm, pub.dev and PyPI on {LIBRARIES_FETCHED_ON}) names it in the registry metadata the generator
              stores as <code className="text-xs">wraps</code>. {withLibrary} of {total} products match at least
              one package. It says which libraries this site tracks, not which platforms a product supports.
            </p>
            <p>
              The map is the directory and nothing more. A vendor this site discusses only inside a comparison
              or a pricing page has no tile until it has a directory entry, so the map is a census of what we
              cover, not of the market.
            </p>
          </div>
        </section>

        <section className="mt-12" id="download">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Download the data</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The fields on these tiles are published as an open dataset generated from the same cost model,
            under CC BY 4.0:{" "}
            <a href={`/datasets/${ACCESS_DATASET}.json`} className="font-medium text-brand-600 hover:text-brand-500">
              {ACCESS_DATASET}.json
            </a>{" "}
            and{" "}
            <a href={`/datasets/${ACCESS_DATASET}.csv`} className="font-medium text-brand-600 hover:text-brand-500">
              {ACCESS_DATASET}.csv
            </a>{" "}
            (it also carries the generic LLM API row the map leaves out). Every dataset is listed on{" "}
            <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
              open datasets
            </Link>
            .
          </p>
        </section>

        <section className="mt-12" id="embed">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Embed this map</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            A compact copy of the map for your own article or deck, without the site chrome and with a link
            back to this page. It is free to use with that attribution link left intact, and it shows the
            directory as it stands when your reader opens it — it changes when the directory does.{" "}
            <Link href={MARKET_MAP_EMBED_PATH} target="_blank" className="text-brand-600 hover:text-brand-500">
              Preview the widget
            </Link>
            . Other widgets and the terms in full: <Link href="/badges" className="text-brand-600 hover:text-brand-500">embeds &amp; badges</Link>.
          </p>
          <CopySnippet code={EMBED_SNIPPET} label="Embed code for the market map" />
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Related</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: API_INDEX_PATH, label: "Fitness API index: the measurable signals per product" },
              { href: "/apis", label: "The fitness API list, product by product" },
              { href: "/compare-apis", label: "Compare two APIs side by side" },
              { href: "/state-of-fitness-apis-2026", label: "The State of Fitness APIs 2026" },
            ].map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="block rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-xs leading-relaxed text-[var(--muted)]">
          By {site.name}. Product and company names are trademarks of their respective owners; {site.name}{" "}is
          not affiliated with, endorsed by, or sponsored by any product on this map, with one exception stated
          above: KinesteX funds this site. Access terms change — confirm current details in each
          provider&rsquo;s documentation.
        </p>
      </div>
    </Container>
  );
}
