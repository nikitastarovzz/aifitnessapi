import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EmbedFrame from "@/components/EmbedFrame";
import ContentAge from "@/components/ContentAge";
import { Mdx } from "@/components/mdx";
import { clusterMap } from "@/lib/clusterRegistry";
import { clampDescription, clampTitle } from "@/lib/cluster";
import {
  allEmbeddableTables,
  offersTableEmbeds,
  renderedBody,
  tableAnchor,
  tablesOf,
} from "@/lib/embedTables";
import { formatDate } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";

/**
 * One table from a comparison or pricing page, as an iframe widget
 * (ops/NEXT-10-2026-11-04.md item 7). The table is rendered out of the page's
 * own body through the page's own MDX pipeline, keeping only the n-th table,
 * so the widget cannot drift from the page: there is no second copy to edit.
 *
 * Not indexable, like every widget under /embed: noindex, canonical and
 * og:url to the source page, out of the sitemap. Routes exist only for tables
 * that exist (dynamicParams = false).
 */
export const dynamicParams = false;

type Params = { cluster: string; slug: string; n: string };

const withoutYearMarker = (s: string) =>
  s.replace(/\s*\([^()]*\b(?:19|20)\d{2}\b[^()]*\)/g, "").trim();

export async function generateStaticParams(): Promise<Params[]> {
  return (await allEmbeddableTables()).map(({ basePath, entry, table }) => ({
    cluster: basePath.slice(1),
    slug: entry.slug,
    n: String(table.n),
  }));
}

async function resolve(params: Promise<Params>) {
  const { cluster, slug, n } = await params;
  const basePath = `/${cluster}`;
  if (!offersTableEmbeds(basePath)) return null;
  const entry = (clusterMap()[basePath] ?? []).find((e) => e.slug === slug);
  if (!entry) return null;
  const table = (await tablesOf(basePath, entry)).find((t) => String(t.n) === n);
  if (!table) return null;
  // The page title without its "(2026)" marker: that marker is a freshness
  // claim backed by the page's own dateModified, which a widget does not carry
  // (qa YEAR-MARKER), and the verification date is printed under the table.
  const name = withoutYearMarker(entry.h1);
  return { basePath, entry, table, name, path: `${basePath}/${entry.slug}` };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  const { table, name, path } = r;
  const suffix = ` · table ${table.n} (embed)`;
  const title = `${clampTitle(name, 60 - suffix.length)}${suffix}`;
  const description = clampDescription(
    `Embeddable widget: table ${table.n} of ${path}${table.section ? ` (${table.section})` : ""}, with its verification date and a link back. Canonical page: ${path}.`,
  );
  return {
    title: { absolute: title },
    description,
    robots: { index: false },
    alternates: { canonical: path },
    // og:url follows the canonical: a share of the iframe URL should resolve
    // to the page that ranks, not to a chromeless widget.
    openGraph: { type: "website", title, description, url: path, images: ["/opengraph-image"] },
  };
}

export default async function EmbedTable({ params }: { params: Promise<Params> }) {
  const r = await resolve(params);
  if (!r) notFound();
  const { basePath, entry, table, name, path } = r;
  // An embed travels without the page's disclosure, so a table that names the
  // company funding this site says so inside the frame (ops/GEO.md).
  const namesFunder = /KinesteX/i.test(table.text);
  return (
    <EmbedFrame
      heading={table.section ? withoutYearMarker(table.section) : name}
      canonicalPath={path}
      ctaLabel={`via ${site.name}: ${name}`}
    >
      <div
        data-embed-source={path}
        data-embed-n={table.n}
        className="prose prose-sm prose-neutral max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-table:my-0"
      >
        <Mdx source={renderedBody(basePath, entry)} onlyTable={{ n: table.n, pagePath: path }} />
      </div>
      {namesFunder && (
        <p data-embed-funder className="mt-2 text-[11px] leading-relaxed text-[var(--muted)]">
          Disclosure: KinesteX, which appears in this table, funds this site, {site.name}.
        </p>
      )}
      <p className="mt-2 text-[11px] leading-relaxed text-[var(--muted)]">
        <span data-embed-verified={entry.updated}>Last verified {formatDate(entry.updated)}</span>
        <ContentAge date={entry.updated} /> · Source:{" "}
        <a
          href={absoluteUrl(`${path}#${tableAnchor(table.n)}`)}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 hover:text-brand-500"
        >
          {name}
        </a>
      </p>
    </EmbedFrame>
  );
}
