import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageSummary from "@/components/PageSummary";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { formatDate } from "@/lib/posts";
import { PAGE_H1 } from "@/data/pageTitles";
import {
  API_BASE,
  CACHE_CONTROL,
  LICENSE_URL,
  MCP_PATH,
  OPENAPI_PATH,
  apiDocument,
  collections,
} from "@/lib/publicApi";
import { SERVER_INFO, TOOLS } from "../../../mcp/src/tools.js";

/**
 * /developers — how to read the site's verified data by machine: the JSON API
 * at /api/v1, its OpenAPI document, the hosted MCP endpoint at /mcp, the
 * stdio package, and the datasets they are all built from.
 *
 * Every number and example here is read from the same modules the endpoints
 * are built from (src/lib/publicApi.ts, mcp/src/tools.js) when the page is
 * built: the collection table, the row counts, the verified dates, the payload
 * sizes and the example response cannot disagree with what the API serves.
 *
 * The client instructions are limited to what could be checked on 2026-10-17:
 * Claude Code's `claude mcp add` syntax and .mcp.json shape from
 * https://code.claude.com/docs/en/mcp, and the Streamable HTTP rules from the
 * MCP specification (2025-11-25). Other clients' config formats were not
 * reachable to verify, so they are described, not quoted.
 */

const PAGE_PATH = "/developers";
const UPDATED = "2026-10-17";
/** @aifitnessapi/mcp is not on npm yet (npm view returned 404 on 2026-10-17).
 *  Flip this when it is published, so the page stops saying so. */
const NPM_PUBLISHED = false;
const NPM_CHECKED = "2026-10-17";
const REPO = site.social.github;

const TITLE = "Developer API & MCP Server";
const DESCRIPTION =
  "Free read-only JSON API, OpenAPI 3.1 spec and hosted MCP server over verified HealthKit, Health Connect, Wear OS and fitness API data. No key, CC BY 4.0.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    title: "AIFitnessAPI Developer API & MCP Server",
    description:
      "The site's verified fitness and health API data as static JSON with an OpenAPI 3.1 document, and as MCP tools for AI assistants. No key; CC BY 4.0.",
    url: PAGE_PATH,
    images: ["/opengraph-image"],
  },
};

const FAQS = [
  {
    q: "Does the AIFitnessAPI data API need a key or an account?",
    a: `No. Every /api/v1 response is a static JSON file that anyone can GET from any origin (Access-Control-Allow-Origin: *), with no key, no sign-up and no write methods. The MCP endpoint at ${absoluteUrl(MCP_PATH)} likewise takes no key or OAuth step.`,
  },
  {
    q: "How do I connect an AI assistant to aifitnessapi.com's verified data?",
    a: `Point any MCP client that supports the Streamable HTTP transport at ${absoluteUrl(MCP_PATH)}. In Claude Code that is one command: claude mcp add --transport http aifitnessapi ${absoluteUrl(MCP_PATH)}. The server exposes ${TOOLS.length} read-only tools that answer only from the published datasets and end every answer with the page to cite.`,
  },
  {
    q: "Can I use the AIFitnessAPI API data in a commercial product?",
    a: "Yes. The data is published under CC BY 4.0, whose one condition is attribution: credit aifitnessapi.com and link the page or dataset you used. Every response carries a ready-made citeAs string for that.",
  },
  {
    q: "What does null mean in an AIFitnessAPI API response?",
    a: "That the source does not state the value or it could not be verified. A null is never a zero and never a guess; where a value is derived from a vendor's prose rather than copied, the sentence it came from ships beside it.",
  },
];

const kb = (s: string) => `${Math.round(Buffer.byteLength(s, "utf8") / 1024)} KB`;

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card,transparent)] p-4 text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export default function DevelopersPage() {
  const url = absoluteUrl(PAGE_PATH);
  const all = collections();
  const rows = all.reduce((n, c) => n + c.rows.length, 0);
  const sizes = all.map((c) => ({ c, bytes: JSON.stringify(apiDocument(c.path)?.body ?? {}, null, 2) }));
  const largest = sizes.reduce((a, b) => (Buffer.byteLength(b.bytes) > Buffer.byteLength(a.bytes) ? b : a));

  const hk = all.find((c) => c.path === "healthkit/types");
  const exampleId = hk ? (hk.rows.some((r) => r.identifier === "stepCount") ? "stepCount" : hk.key(hk.rows[0])) : null;
  const example = hk && exampleId ? apiDocument(`${hk.path}/${exampleId}`) : undefined;
  if (!example) throw new Error("/developers: no HealthKit item to show as the example response");
  const exampleUrl = absoluteUrl(`${API_BASE}/${example.path}`);

  const mcpUrl = absoluteUrl(MCP_PATH);
  const remoteJson = JSON.stringify({ mcpServers: { aifitnessapi: { type: "http", url: mcpUrl } } }, null, 2);
  const npxJson = JSON.stringify({ mcpServers: { aifitnessapi: { command: "npx", args: ["-y", "@aifitnessapi/mcp"] } } }, null, 2);
  const rpc = (body: object) =>
    `curl -s ${mcpUrl} \\\n  -H 'Content-Type: application/json' \\\n  -H 'Accept: application/json, text/event-stream' \\\n  -d '${JSON.stringify(body)}'`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "The AIFitnessAPI data API and MCP server",
    description: DESCRIPTION,
    url,
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    about: {
      "@type": "WebAPI",
      name: "AI Fitness API (aifitnessapi.com)",
      url: absoluteUrl(API_BASE),
      documentation: url,
      provider: orgRef(),
    },
    license: LICENSE_URL,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#faq-${i + 1}`,
      url: `${url}#faq-${i + 1}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };

  const ext = "text-brand-600 hover:text-brand-500 break-words";

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Developers", path: PAGE_PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {PAGE_H1[PAGE_PATH]}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {all.length} collections · {rows} rows · OpenAPI 3.1 · MCP · CC BY 4.0 · updated {formatDate(UPDATED)}
        </p>

        <PageSummary
          path={PAGE_PATH}
          name="The AIFitnessAPI data API and MCP server"
          updated={UPDATED}
          className="mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          AIFitnessAPI serves its verified data to programs two ways, free and without a key: a read-only
          JSON API at {absoluteUrl(API_BASE)}, described by an OpenAPI 3.1 document, and a hosted MCP
          server at {mcpUrl} that AI assistants connect to directly. Both answer only from the CC BY 4.0
          datasets this site publishes, {all.length} collections and {rows} rows in all, and every
          response carries the page holding the sourced claim, the licence, the attribution and the date
          the data was verified.
        </PageSummary>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What is available</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-[var(--fg)]">
            <li>
              <strong>JSON API.</strong> Index at{" "}
              <a href={absoluteUrl(API_BASE)} className={ext}>
                {absoluteUrl(API_BASE)}
              </a>
              , then one collection per dataset and one URL per row. GET only.
            </li>
            <li>
              <strong>OpenAPI 3.1.</strong>{" "}
              <a href={absoluteUrl(OPENAPI_PATH)} className={ext}>
                {absoluteUrl(OPENAPI_PATH)}
              </a>{" "}
              describes every path and schema. It is generated from the same list as the endpoints, and
              each item path enumerates its ids, so it is also the complete list of item URLs.
            </li>
            <li>
              <strong>Hosted MCP server.</strong>{" "}
              <a href={mcpUrl} className={ext}>
                {mcpUrl}
              </a>{" "}
              speaks Streamable HTTP, statelessly, with {TOOLS.length} read-only tools. POST only; a GET
              answers 405 because there is no event stream to open.
            </li>
            <li>
              <strong>Local MCP server.</strong> The same tools over stdio, from the{" "}
              <code>@aifitnessapi/mcp</code> package in{" "}
              <a href={`${REPO}/tree/main/mcp`} className={ext}>
                this site’s repository
              </a>
              , with the data bundled so it works offline.
            </li>
            <li>
              <strong>Datasets.</strong> The JSON and CSV downloads the API is built from, with their
              methodology, on <Link href="/datasets" className="text-brand-600 hover:text-brand-500">Open Datasets</Link>.
            </li>
          </ul>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[40rem] text-left text-sm" data-api-collections>
              <thead className="bg-[var(--card,transparent)] text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2 font-semibold">Data</th>
                  <th className="px-3 py-2 font-semibold">Collection and one item</th>
                  <th className="px-3 py-2 font-semibold">Rows</th>
                  <th className="px-3 py-2 font-semibold">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {all.map((c) => (
                  <tr key={c.path} className="align-top">
                    <td className="px-3 py-2">
                      <Link href={c.page} className="font-semibold text-[var(--fg)] hover:text-brand-500">
                        {c.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      <a href={c.url} className={ext}>
                        {`${API_BASE}/${c.path}`}
                      </a>
                      <br />
                      <span className="text-[var(--muted)]">{`${API_BASE}/${c.path}/{${c.param}}`}</span>
                    </td>
                    <td className="px-3 py-2">{c.rows.length}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{c.verifiedNow.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            “Verified” is the date each collection’s data was last checked or read from its primary
            source; each response says which of those it is. Generated datasets carry the day the
            generator read the vendor’s documentation, hand-maintained ones the review date of the page
            that carries them, and per-row dates where rows have their own.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Example requests</h2>
          <p className="mt-3 text-[var(--fg)]">The index, one HealthKit type, one directory entry:</p>
          <Code>{`curl ${absoluteUrl(API_BASE)}
curl ${exampleUrl}
curl ${absoluteUrl(`${API_BASE}/apis/garmin`)}`}</Code>
          <p className="mt-5 text-[var(--fg)]">From JavaScript, in a browser or on a server:</p>
          <Code>{`const res = await fetch("${absoluteUrl(`${API_BASE}/health-connect/records/StepsRecord`)}");
if (!res.ok) throw new Error(\`HTTP \${res.status}\`); // an unknown id is a 404
const { item, source, verified, citeAs } = await res.json();`}</Code>
          <p className="mt-5 text-[var(--fg)]">
            The response to <a href={exampleUrl} className={ext}>{exampleUrl}</a>, exactly as the API
            serves it today:
          </p>
          <Code>{JSON.stringify(example.body, null, 2)}</Code>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Collections share the same envelope and add <code>description</code>, <code>methodology</code>,{" "}
            <code>count</code>, <code>fields</code> (what each column means) and <code>items</code>. A
            directory entry adds the pages on this site that cover the product and the tracked changes that
            name it.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Connect an AI assistant (MCP)</h2>
          <p className="mt-3 text-[var(--fg)]">
            The hosted server needs no key and no OAuth. In Claude Code, add it with one command:
          </p>
          <Code>{`claude mcp add --transport http aifitnessapi ${mcpUrl}`}</Code>
          <p className="mt-5 text-[var(--fg)]">
            or check it into a project’s <code>.mcp.json</code> so a whole team gets it:
          </p>
          <Code>{remoteJson}</Code>
          <p className="mt-5 text-[var(--fg)]">
            Any other client that supports the Streamable HTTP transport connects to the same URL; use its
            own setting for a remote server. Without a client, the protocol is plain JSON over POST, and in
            stateless mode a tool call needs no session first:
          </p>
          <Code>{rpc({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "healthkit_type", arguments: { query: "stepCount" } } })}</Code>

          <h3 className="mt-8 text-lg font-semibold text-[var(--fg)]">The tools</h3>
          <dl className="mt-3 divide-y divide-[var(--border)]" data-mcp-tools>
            {TOOLS.map((t) => (
              <div key={t.name} className="py-3">
                <dt className="font-mono text-sm font-semibold text-[var(--fg)]">{t.name}</dt>
                <dd className="mt-1 text-sm text-[var(--muted)]">{t.description}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-8 text-lg font-semibold text-[var(--fg)]">Run it locally over stdio</h3>
          <p className="mt-3 text-[var(--fg)]">
            The stdio server runs the same tools from the same code, against the datasets bundled in the
            package, so it works offline and a pinned version keeps answering what that version said.{" "}
            {NPM_PUBLISHED
              ? "Install it with npx:"
              : `As of ${formatDate(NPM_CHECKED)} @aifitnessapi/mcp is not published on npm, so run it from a clone of the repository:`}
          </p>
          {NPM_PUBLISHED ? null : (
            <Code>{`git clone ${REPO}.git
cd aifitnessapi/mcp && npm ci
claude mcp add --transport stdio aifitnessapi -- node "$PWD/src/index.js"`}</Code>
          )}
          <p className="mt-5 text-[var(--fg)]">
            {NPM_PUBLISHED
              ? "Or in a client's JSON configuration:"
              : "Once the package is on npm, this configuration replaces the clone:"}
          </p>
          <Code>{npxJson}</Code>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Server {SERVER_INFO.name} {SERVER_INFO.version}. Both servers answer the same questions the same
            way; if they ever disagree, the hosted one has newer data.
          </p>
        </section>

        <section className="mt-12 space-y-4 text-[var(--fg)]">
          <h2 className="text-2xl font-bold tracking-tight">Licence and attribution</h2>
          <p>
            The data is{" "}
            <a href={LICENSE_URL} rel="license noopener" className="text-brand-600 hover:text-brand-500">
              Creative Commons Attribution 4.0
            </a>
            : reuse it, including commercially, and credit aifitnessapi.com with a link to the page or
            dataset you used. Every response carries <code>license</code>, <code>attribution</code>,{" "}
            <code>source</code> and a ready-made <code>citeAs</code> string. Vendor text quoted in the
            data, such as Apple’s and Google’s descriptions, is reproduced to identify the API surface and
            remains theirs.
          </p>
          {all
            .filter((c) => c.doc.licenseNote)
            .map((c) => (
              <p key={c.path} data-api-licence-note={c.path}>
                <strong>{c.title}:</strong> {c.doc.licenseNote}{" "}
                {c.doc.sourceTerms
                  ? "Every response from this collection carries that note as licenseNote, and the collection response carries the source’s notice, verbatim, as sourceTerms."
                  : "Every response from this collection carries that note as licenseNote."}
              </p>
            ))}
        </section>

        <section className="mt-12 space-y-4 text-[var(--fg)]">
          <h2 className="text-2xl font-bold tracking-tight">Rates, caching and versions</h2>
          <p>
            Every /api/v1 response is a file written when the site is built, not computed per request,
            and is sent with <code>Cache-Control: {CACHE_CONTROL}</code>. There are no keys and no quotas
            of ours; please cache responses, and download the dataset instead of fetching every item one by
            one. Collections are served whole, with no pagination: the largest, {largest.c.title}, is about{" "}
            {kb(largest.bytes)} before compression. The MCP endpoint is the one part that runs per request,
            as a short stateless function.
          </p>
          <p>
            The path carries the interface version (v1). The data carries its dataset edition, shown in
            every response, and field names are the datasets’ own column names. An unknown id answers
            HTTP 404 with the site’s HTML not-found page, so check the status code before parsing.
          </p>
        </section>

        <section className="mt-12 space-y-4 text-[var(--fg)]">
          <h2 className="text-2xl font-bold tracking-tight">Only verified data, and it says so</h2>
          <p>
            No API response is computed per request and nothing is inferred to fill a gap. Every value is
            copied from a published dataset row, every row links the page that carries its sourced claim,
            and a field the site could not verify is <code>null</code>: never zero, never a guess. The MCP
            tools follow the same rule: when the data has no answer, the tool says so instead of producing a
            plausible one. How the data is verified is on{" "}
            <Link href="/methodology" className="text-brand-600 hover:text-brand-500">our methodology page</Link>, and what the
            build refuses to publish is on{" "}
            <Link href="/gates" className="text-brand-600 hover:text-brand-500">the gates page</Link>.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-10 text-sm text-[var(--muted)]">
          Published by {site.name}. Independent and not sponsored; this site is funded by KinesteX, which is
          one row of the API directory and is recorded there on the same terms as every other product.
        </p>
      </div>
    </Container>
  );
}
