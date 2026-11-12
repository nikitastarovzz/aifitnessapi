import Link from "next/link";
import CopySnippet from "@/components/CopySnippet";
import { embedSnippets, embedTablePath } from "@/lib/embedSnippets";

/**
 * The "Embed" control under a comparison or pricing table: a closed
 * <details> that reveals the iframe code and a plain-link fallback.
 *
 * Server-rendered and closed by default, so it occupies one small line from
 * first paint and hydration moves nothing; it only grows when a reader opens
 * it. `data-embed-table` names the route it offers — qa holds every such
 * control to a built embed of the same table (EMBED-TABLE-ROUTE).
 */
export default function TableEmbed({
  basePath,
  slug,
  title,
  n,
  rows,
  section,
}: {
  basePath: string;
  slug: string;
  title: string;
  n: number;
  rows: number;
  section: string | null;
}) {
  const route = embedTablePath(basePath, slug, n);
  const { iframe, link } = embedSnippets({ basePath, slug, title, n, rows, section });
  return (
    <details data-embed-table={route} className="not-prose group -mt-5 mb-8 text-sm">
      <summary className="ml-auto flex min-h-[44px] w-fit cursor-pointer list-none select-none items-center rounded-full border border-[var(--border)] px-3 py-0.5 text-xs sm:min-h-[32px] text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)] [&::-webkit-details-marker]:hidden">
        Embed<span className="sr-only"> this table</span>
        <span aria-hidden className="ml-1 inline-block transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-2 rounded-xl border border-[var(--border)] p-3 text-[var(--muted)]">
        <p className="text-xs leading-relaxed">
          Free to embed with attribution: the frame loads this table from aifitnessapi.com, shows
          its verification date and links back here. It changes when this page changes. The
          height is a guess from the row count; set your own and the frame scrolls.{" "}
          <Link href={route} target="_blank" className="text-brand-600 hover:text-brand-500">
            Preview
          </Link>{" "}
          ·{" "}
          <Link href="/badges#tables" className="text-brand-600 hover:text-brand-500">
            Terms
          </Link>
        </p>
        <CopySnippet
          code={iframe}
          label="Embed code for this table"
          buttonLabel="Copy embed code"
          trackId="embed_table_copy"
        />
        <p className="mt-4 text-xs leading-relaxed">
          Where iframes are not allowed, link to the table instead:
        </p>
        <CopySnippet
          code={link}
          label="HTML link to this table"
          buttonLabel="Copy link HTML"
          trackId="embed_table_link_copy"
        />
      </div>
    </details>
  );
}
