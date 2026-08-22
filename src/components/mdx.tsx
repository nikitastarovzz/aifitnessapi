import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import CodeBlock from "./CodeBlock";

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

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
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
          ],
        },
      }}
    />
  );
}
