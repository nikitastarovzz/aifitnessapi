import Link from "next/link";
import ContentAge from "@/components/ContentAge";
import CodeBlock from "@/components/CodeBlock";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import {
  GHAPI_DISCOVERY,
  GHAPI_FETCHED_ON,
  GHAPI_SOURCES,
  type GhapiBlock,
  type GhapiFlag,
  type GhapiSchema,
  type GhapiSourceKey,
} from "@/data/googleHealthApi";
import {
  GHAPI_BASE,
  GHAPI_TOPICS,
  SOURCE_LABEL,
  flagLabel,
  ghapiModified,
  ghapiPublished,
  getType,
  section,
  sectionUrl,
  source,
  typePath,
} from "@/data/ghapiPages";

/**
 * Shared scaffolding for the Google Health API reference: the renderer for
 * Google's prose blocks (copied verbatim by the generator — code spans arrive
 * in backticks), the fields table, the flag box, the "read on" line, the
 * source list and the JSON-LD graph. Not a route: Next only treats
 * page/layout/route/opengraph-image files as route segments.
 */

export const LINK = "font-medium text-brand-600 hover:text-brand-500";
export const TH = "py-2 pr-4 font-semibold text-[var(--fg)]";
export const H2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";
export const CAPSULE =
  "speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6";

/** Plain text with the discovery document's **bold** markers rendered. */
function Bold({ text }: { text: string }) {
  const parts = text.split("**");
  if (parts.length < 3 || parts.length % 2 === 0) return <>{text}</>;
  return <>{parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>))}</>;
}

/** Text with `code` spans and line breaks, as the generator stores it. */
export function Inline({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {line.split("`").map((part, i) =>
            i % 2 === 1 ? (
              <code key={i} className="break-words rounded bg-[var(--surface)] px-1 font-mono text-[0.85em] text-[var(--fg)]">
                {part}
              </code>
            ) : (
              <Bold key={i} text={part} />
            ),
          )}
        </span>
      ))}
    </>
  );
}

export function Code({ children }: { children: string }) {
  return <code className="break-all font-mono text-[13px] text-[var(--fg)]">{children}</code>;
}

export function Snippet({ code, label }: { code: string; label?: string }) {
  return (
    <figure className="mt-4">
      {label && <figcaption className="mb-2 text-xs uppercase tracking-wide text-[var(--muted)]">{label}</figcaption>}
      <CodeBlock raw={code}>
        <pre className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[13px] leading-relaxed">
          <code>{code}</code>
        </pre>
      </CodeBlock>
    </figure>
  );
}

/** Google's blocks, rendered in order. */
export function Blocks({ blocks }: { blocks: GhapiBlock[] }) {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.kind === "p") {
      out.push(
        <p key={i} className="mt-3 leading-relaxed">
          <Inline text={b.text} />
        </p>,
      );
    } else if (b.kind === "list") {
      const items = b.items.map((it, j) => (
        <li key={j} className="mt-1.5">
          <Inline text={it.text} />
          {it.sub && (
            <ul className="mt-1 list-[circle] space-y-1 pl-5">
              {it.sub.map((s, k) => (
                <li key={k}>
                  <Inline text={s} />
                </li>
              ))}
            </ul>
          )}
        </li>
      ));
      out.push(
        b.ordered ? (
          <ol key={i} className="mt-3 list-decimal pl-5 leading-relaxed">
            {items}
          </ol>
        ) : (
          <ul key={i} className="mt-3 list-disc pl-5 leading-relaxed">
            {items}
          </ul>
        ),
      );
    } else if (b.kind === "table") {
      out.push(
        <div key={i} className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            {b.head.length > 0 && (
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {b.head.map((h, j) => (
                    <th key={j} scope="col" className={TH}>
                      <Inline text={h} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {b.rows.map((r, j) => (
                <tr key={j} className="border-b border-[var(--border)] align-top">
                  {r.map((c, k) => (
                    <td key={k} className="py-2 pr-4">
                      <Inline text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    } else if (b.kind === "note") {
      out.push(
        <div key={i} className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed">
          <Inline text={b.text} />
        </div>,
      );
    } else if (b.kind === "code") {
      const prev = blocks[i - 1];
      out.push(<Snippet key={i} code={b.text} label={prev?.kind === "label" ? prev.text : undefined} />);
    } else if (b.kind === "label") {
      if (blocks[i + 1]?.kind !== "code") {
        out.push(
          <p key={i} className="mt-4 text-xs uppercase tracking-wide text-[var(--muted)]">
            {b.text}
          </p>,
        );
      }
    }
  }
  return <>{out}</>;
}

/** "Quoted from Google's X, last updated D, read R." with the link. */
export function QuotedFrom({ page, id }: { page: GhapiSourceKey; id?: string | null }) {
  const s = source(page);
  return (
    <p className="mt-3 text-xs text-[var(--muted)]">
      Quoted from{" "}
      <a href={sectionUrl(page, id ?? null)} className={LINK} rel="noopener">
        {SOURCE_LABEL[page]}
      </a>
      {s.lastUpdated ? `, last updated ${s.lastUpdated}` : ""}, read {s.fetchedOn}.
    </p>
  );
}

/**
 * One of Google's sections, verbatim, under our own heading level, with its
 * subsections (the h3/h4s that follow it on Google's page) when `withChildren`.
 */
export function GoogleSection({
  page,
  id,
  as = "h3",
  heading,
  childIds = [],
}: {
  page: Parameters<typeof section>[0];
  id: string;
  as?: "h2" | "h3";
  heading?: string;
  childIds?: string[];
}) {
  const s = section(page, id);
  const Tag = as;
  return (
    <div id={`g-${id}`} className="scroll-mt-24">
      <Tag className={as === "h2" ? `mt-12 ${H2}` : "mt-8 text-lg font-bold tracking-tight text-[var(--fg)]"}>{heading ?? s.heading}</Tag>
      <div className="text-[var(--muted)]">
        <Blocks blocks={s.blocks} />
        {childIds.map((cid) => {
          const c = section(page, cid);
          return (
            <div key={cid}>
              <h4 className="mt-6 font-semibold text-[var(--fg)]">{c.heading}</h4>
              <Blocks blocks={c.blocks} />
            </div>
          );
        })}
      </div>
      <QuotedFrom page={page as GhapiSourceKey} id={id} />
    </div>
  );
}

/** One schema's fields: name, type, Google's label and description, enums. */
export function FieldsTable({ schema, idPrefix }: { schema: GhapiSchema; idPrefix?: string }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
            <th scope="col" className="py-2 pr-4 font-semibold">
              Field
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold">
              Type
            </th>
            <th scope="col" className="py-2 font-semibold">
              Google’s description
            </th>
          </tr>
        </thead>
        <tbody>
          {schema.fields.map((f) => (
            <tr
              key={f.name}
              id={idPrefix ? `${idPrefix}-${f.name.toLowerCase()}` : undefined}
              className="scroll-mt-24 border-b border-[var(--border)] align-top"
            >
              <td className="py-2 pr-4">
                <Code>{f.name}</Code>
                {f.label && (
                  <span className="ml-2 inline-block rounded-full border border-[var(--border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                    {f.label}
                  </span>
                )}
              </td>
              <td className="py-2 pr-4">
                <Code>{f.type}</Code>
              </td>
              <td className="py-2 text-[var(--muted)]">
                {f.description ? <Inline text={f.description} /> : <em>Google gives no description.</em>}
                {f.enum && (
                  <ul className="mt-2 space-y-1 text-xs">
                    {f.enum.map((e) => (
                      <li key={e.value}>
                        <Code>{e.value}</Code>
                        {e.description ? (
                          <>
                            {" "}
                            — <Inline text={e.description} />
                          </>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Where Google's own pages disagree: the summary, then the texts verbatim. */
export function FlagList({ flags, linkTypes = false }: { flags: GhapiFlag[]; linkTypes?: boolean }) {
  if (!flags.length) return null;
  return (
    <ul className="mt-4 space-y-3">
      {flags.map((f, i) => {
        const t = linkTypes && f.dataType ? getType(f.dataType) : undefined;
        return (
          <li
            key={i}
            data-ghapi-flag={f.kind}
            className="rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm text-[var(--fg)]"
          >
            <p className="font-semibold">
              {flagLabel(f.kind)}
              {t && (
                <>
                  {" · "}
                  <Link href={typePath(t)} className={LINK}>
                    {t.dataType}
                  </Link>
                </>
              )}
            </p>
            <p className="mt-1">
              <Inline text={f.summary} />
            </p>
            <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
              {f.evidence.map((e, j) => (
                <li key={j}>
                  {SOURCE_LABEL[e.source]}: “<Inline text={e.text} />”
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

/** The "read on" line every page in the section carries. */
export function FetchedLine({ extra }: { extra?: React.ReactNode }) {
  return (
    <p className="mt-3 text-sm text-[var(--muted)]">
      Read from Google’s documentation on {GHAPI_FETCHED_ON}
      <ContentAge date={GHAPI_FETCHED_ON} />
      {" · "}discovery document revision {GHAPI_DISCOVERY.revision}
      {extra}
    </p>
  );
}

/** The sources a page used, each with Google's "Last updated" and our read date. */
export function SourcesChecked({ keys }: { keys: GhapiSourceKey[] }) {
  const list = keys.map((k) => source(k));
  // The guide pages' own footer sentence, quoted only when they all say the same.
  const licences = [...new Set(list.map((s) => s.license).filter((l): l is string => Boolean(l)))];
  return (
    <section className="mt-12">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Sources checked</h2>
      <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
        {list.map((s) => (
          <li key={s.key}>
            <a href={s.url} className={LINK} rel="noopener">
              {s.title}
            </a>
            {s.lastUpdated ? ` — last updated ${s.lastUpdated}` : ""}
            {s.revision ? ` — revision ${s.revision}` : ""} · read {s.fetchedOn}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Google’s text is quoted for identification
        {licences.length === 1 ? <>; each guide page’s footer reads: “{licences[0]}”</> : null}. Generated from
        Google’s pages by <code className="font-mono text-xs">scripts/fetch-google-health-api.mjs</code>, not typed by
        hand; Google’s documentation remains the authority.
      </p>
    </section>
  );
}

/** Links to the hub and the topic pages, the current one marked. */
export function TopicNav({ current }: { current: string }) {
  return (
    <nav aria-label="Google Health API reference" className="mt-6 flex flex-wrap gap-2 text-sm">
      {[{ path: GHAPI_BASE, label: "All data types" }, ...GHAPI_TOPICS].map((t) =>
        t.path === current ? (
          <span key={t.path} className="rounded-full border border-brand-400 px-3 py-1 font-medium text-[var(--fg)]" aria-current="page">
            {t.label}
          </span>
        ) : (
          <Link
            key={t.path}
            href={t.path}
            className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
          >
            {t.label}
          </Link>
        ),
      )}
    </nav>
  );
}

/** TechArticle + WebPage (or CollectionPage with an ItemList for the hub). */
export function ghapiGraph({
  path,
  title,
  headline,
  description,
  sources,
  items,
}: {
  path: string;
  title: string;
  headline: string;
  description: string;
  sources: GhapiSourceKey[];
  items?: { name: string; path: string }[];
}) {
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  const modified = ghapiModified();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline,
        description,
        datePublished: ghapiPublished(path),
        dateModified: modified,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "Google Health API reference",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        about: { "@type": "Thing", name: "Google Health API", sameAs: "https://developers.google.com/health" },
        citation: sources.map((k) => {
          const s = GHAPI_SOURCES.find((x) => x.key === k)!;
          return { "@type": "TechArticle", url: s.url, name: s.title };
        }),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": items ? "CollectionPage" : "WebPage",
        "@id": pageId,
        url,
        name: title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: modified,
        reviewedBy: orgRef(),
        primaryImageOfPage: { "@type": "ImageObject", url: `${url}/opengraph-image` },
        ...(items
          ? {
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: items.length,
                itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absoluteUrl(it.path) })),
              },
            }
          : {}),
      },
    ],
  };
}
