import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import CodeBlock from "./CodeBlock";
import TableEmbed from "./TableEmbed";
import { absoluteUrl } from "@/lib/site";
import { tableAnchor } from "@/lib/embedSnippets";
import { rehypeKeepTable, rehypeNumberTables } from "@/lib/tablePlugins";

/** The text inside a <pre>, for the copy button. MDX renders a single <code>
 *  child whose own child is the raw string. */
function rawText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(rawText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return rawText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/** Component overrides available inside every MDX post. */
const components = {
  a: ({ href = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return <Link href={href} {...props} />;
    }
    return <a href={href} target="_blank" rel="noreferrer" {...props} />;
  },
  // A comparison table is often wider than a phone. Give it its own scroll
  // container so it never widens the document — a page that scrolls sideways
  // as a whole is unusable, a table that does is normal.
  table: (props: HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
  pre: ({ children, ...props }: HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock raw={rawText(children)}>
      <pre {...props}>{children}</pre>
    </CodeBlock>
  ),
};

/** The page a body belongs to, when its tables offer the Embed control. */
export type TableEmbedSource = { basePath: string; slug: string; title: string };

type TableProps = HTMLAttributes<HTMLTableElement> & Record<string, unknown>;

/**
 * Components for a page whose tables are embeddable: each table keeps its own
 * scroll container, gains a deep-link id, and gets the Embed control under it.
 * The number, row count and section come from rehypeNumberTables.
 */
function embedComponents(src: TableEmbedSource) {
  return {
    ...components,
    table: (props: TableProps) => {
      const { "data-table-rows": rows, "data-table-section": section, ...rest } = props;
      const n = Number(props["data-table-index"]);
      return (
        <div id={tableAnchor(n)} className="scroll-mt-24">
          <div className="overflow-x-auto">
            <table {...(rest as HTMLAttributes<HTMLTableElement>)} />
          </div>
          <TableEmbed
            basePath={src.basePath}
            slug={src.slug}
            title={src.title}
            n={n}
            rows={Number(rows) || 0}
            section={typeof section === "string" && section ? section : null}
          />
        </div>
      );
    },
  };
}

/**
 * Components for the /embed/table widget. The widget sits inside someone
 * else's page, so every link is absolute and opens a new tab — a relative
 * href would resolve against their site, and a same-tab link would navigate
 * their frame.
 */
function widgetComponents(pagePath: string) {
  return {
    ...components,
    a: ({ href = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const abs = href.startsWith("#")
        ? absoluteUrl(`${pagePath}${href}`)
        : href.startsWith("/")
          ? absoluteUrl(href)
          : href;
      return <a href={abs} target="_blank" rel="noreferrer" {...props} />;
    },
  };
}

const headingPlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      // Appended rather than wrapping: a visible ¶-style handle a
      // reader can right-click and copy, instead of a whole heading
      // that is silently a link.
      behavior: "append",
      properties: {
        className: "heading-anchor",
        ariaLabel: "Copy link to this section",
      },
      content: {
        type: "element",
        tagName: "span",
        properties: {},
        children: [{ type: "text", value: "#" }],
      },
    },
  ],
];

export function Mdx({
  source,
  tableEmbeds,
  onlyTable,
}: {
  source: string;
  /** Give every table the Embed control (comparison and pricing clusters). */
  tableEmbeds?: TableEmbedSource;
  /**
   * Render only the n-th table of `source`, for the /embed/table widget. The
   * path is the source page, which in-table "#fragment" links resolve against.
   */
  onlyTable?: { n: number; pagePath: string };
}) {
  // rehypeNumberTables runs first, so the section it records is the heading's
  // own text, before rehype-autolink-headings appends its "#" handle.
  const rehypePlugins = onlyTable
    ? [rehypeKeepTable(onlyTable.n)]
    : tableEmbeds
      ? [rehypeNumberTables, ...headingPlugins]
      : headingPlugins;
  return (
    <MDXRemote
      source={source}
      components={
        onlyTable
          ? widgetComponents(onlyTable.pagePath)
          : tableEmbeds
            ? embedComponents(tableEmbeds)
            : components
      }
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          // The unified plugin tuple types do not survive being built up as
          // an array; the entries are the same plugins as before.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rehypePlugins: rehypePlugins as any,
        },
      }}
    />
  );
}
