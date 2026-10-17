import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import {
  MCP_HEALTH_SERVERS,
  MCP_REGISTRY_SCAN,
  MCP_SERVERS_CONTEXT_DROPPED,
  MCP_SERVERS_EXCLUDED,
  MCP_SERVERS_FETCHED_ON,
  MCP_SERVERS_SOURCES,
  MCP_SERVER_GROUPS,
  MCP_SERVER_TERMS,
  MCP_SITE_SERVER_CHECK,
  type McpHealthServer,
  type McpPackage,
} from "@/data/mcpHealthServers";
import { siteMcpServer } from "@/lib/siteMcpServer";
import { absoluteUrl } from "@/lib/site";
import { CAPSULE, FaqSection, JsonLd, LINK, TH, articleGraph, count, faqGraph, listOf, site, type Faq } from "../error-codes/_shared";

/**
 * MCP servers for health and fitness data, from the official MCP Registry.
 *
 * Generated from src/data/mcpHealthServers.ts
 * (scripts/fetch-mcp-health-servers.mjs). Every number in the copy is
 * computed from the data; server descriptions are the publishers' own words.
 * "Official" is printed only where the generator set publisherIsVendor, and
 * qa's MCP-SERVER-OFFICIAL gate holds the rendered rows to that.
 *
 * This site's own server (@aifitnessapi/mcp) is first-party: it is described
 * from its own package files in a separate, disclosed section after the
 * registry's servers, never inside a group or ahead of them.
 */

const PATH = "/health-mcp-servers";
const TITLE = "MCP Servers for Health and Fitness Data";
const FETCHED = MCP_SERVERS_FETCHED_ON;
const SCAN = MCP_REGISTRY_SCAN;

const SERVERS = MCP_HEALTH_SERVERS;
const LABEL = new Map(MCP_SERVER_GROUPS.map((g) => [g.key, g.label]));
const labelOf = (key: string) => LABEL.get(key) ?? key;
const VENDOR_GROUPS = MCP_SERVER_GROUPS.filter((g) => g.key !== "several" && g.key !== "general");

/** Servers that name a source at all (their home group or a multi-source row). */
const naming = (key: string) => SERVERS.filter((s) => s.sources.includes(key));
const homeRows = (key: string) => SERVERS.filter((s) => s.group === key);
const VENDOR_COUNTS = VENDOR_GROUPS.map((g) => ({ ...g, n: naming(g.key).length })).filter((g) => g.n > 0);
const UNNAMED = VENDOR_GROUPS.filter((g) => naming(g.key).length === 0);
const TOP = [...VENDOR_COUNTS].sort((a, b) => b.n - a.n || a.label.localeCompare(b.label)).slice(0, 4);
const VENDOR_NAMED = SERVERS.filter((s) => s.group !== "general");
const GENERAL_ONLY = SERVERS.filter((s) => s.group === "general");
const OFFICIAL = SERVERS.filter((s) => s.publisherIsVendor);
const GITHUB_NS = SERVERS.filter((s) => s.namespace.startsWith("io.github."));
const WITH_PACKAGE = SERVERS.filter((s) => s.packages.length > 0);
const WITH_REMOTE = SERVERS.filter((s) => s.remotes.length > 0);
const NOT_ACTIVE = SERVERS.filter((s) => s.status && s.status !== "active");
const WITH_SECRET = SERVERS.filter(
  (s) =>
    s.packages.some((p) => p.secretEnvironmentVariables.length > 0) ||
    s.remotes.some((r) => r.secretHeaders.length > 0 || r.secretUrlVariables.length > 0),
);
const SECRET_IN_URL = SERVERS.filter((s) => s.remotes.some((r) => r.secretUrlVariables.length > 0));
const CHECKED_PACKAGES = SERVERS.flatMap((s) => s.packages.filter((p) => p.facts));
const MISSING_PACKAGES = CHECKED_PACKAGES.filter((p) => p.facts && !p.facts.found);
const DROPPED_NAMES = [...new Set(MCP_SERVERS_CONTEXT_DROPPED.map((d) => d.name))];
const AMBIGUOUS_TERMS = MCP_SERVER_TERMS.filter((t) => t.needsContext).flatMap((t) => t.terms.map((x) => x.label));
const GENERAL_TERMS = MCP_SERVER_TERMS.filter((t) => t.source === "general").flatMap((t) => t.terms.map((x) => x.label));
const SITE = siteMcpServer();
const SITE_CHECK = MCP_SITE_SERVER_CHECK;

/** Groups that have something to show, in the generator's order. */
const SHOWN_GROUPS = MCP_SERVER_GROUPS.filter((g) => homeRows(g.key).length > 0 || (g.key !== "several" && g.key !== "general" && naming(g.key).length > 0));

const rowId = (s: McpHealthServer) => `server-${s.slug}`;
const shortName = (s: McpHealthServer) => s.title ?? s.name.split("/")[1] ?? s.name;

const DESCRIPTION = `${SERVERS.length} MCP servers that name a health or fitness data source in the official MCP Registry, grouped by source, with each package's facts and publisher.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/** "Garmin (31), WHOOP (20) and Oura (16)". */
const topList = listOf(TOP.map((g) => `${g.label} (${g.n})`));
/** "a, b or c" — listOf with the last joint as "or". */
const orList = (items: string[]) => listOf(items).replace(/ and ([^,]+)$/, " or $1");

function officialSentence(names: string[]): string {
  const keys = VENDOR_COUNTS.filter((g) => names.includes(g.key));
  const rows = SERVERS.filter((s) => s.sources.some((k) => names.includes(k)));
  const official = rows.filter((s) => s.publisherIsVendor);
  if (rows.length === 0) return `The registry held no entry naming ${listOf(names.map(labelOf))} on ${FETCHED}.`;
  const github = rows.filter((s) => s.namespace.startsWith("io.github.")).length;
  return official.length === 0
    ? `Not in the official MCP Registry as read on ${FETCHED}. ${count(rows.length, "entry names", "entries name")} ${orList(keys.map((g) => g.label))}, and none is published under the vendor's own domain namespace: ${github} sit under a GitHub account or organisation (io.github.<name>) and ${rows.length - github} under other publishers' domains. The registry records who published an entry, not whether the vendor endorses it.`
    : `As read on ${FETCHED}, ${count(official.length, "entry is", "entries are")} published under the vendor's own domain namespace: ${listOf(official.map((s) => s.name))}. The other ${rows.length - official.length} that name ${orList(keys.map((g) => g.label))} are published by others.`;
}

const PLATFORM_KEYS = ["apple-health", "health-connect"];
const platformRows = SERVERS.filter((s) => s.sources.some((k) => PLATFORM_KEYS.includes(k)));

const FAQS: Faq[] = [
  {
    q: "Is there an official Garmin, Oura or WHOOP MCP server?",
    a: officialSentence(["garmin", "oura", "whoop"]),
  },
  {
    q: "What does unofficial mean for a health MCP server?",
    a: `On this page it means the server's registry name is not under the vendor's own domain. The registry's authentication guide lets a publisher use a domain namespace such as com.example only after proving control of the domain by DNS or HTTP, and an io.github.<name> namespace only through the GitHub account or organisation called <name>, so a vendor-domain name is the registry's evidence that the vendor published it. Unofficial says nothing about quality or safety either way: ${GITHUB_NS.length} of the ${SERVERS.length} servers here sit under a personal or organisation GitHub namespace.`,
  },
  {
    q: "Why not use the MCP Registry's search to find health servers?",
    a: `Because it only searches names. The registry's OpenAPI document describes the search parameter as "Search servers by name (substring match)", so a server that names Garmin only in its description never appears for "garmin", while unrelated names that happen to contain the letters do. This list reads all ${SCAN.entries.toLocaleString("en-US")} latest-version entries (${SCAN.pages} pages) and matches whole words in the name, title and description instead.`,
  },
  {
    q: "How many MCP servers name Apple Health or Health Connect?",
    a: `${count(naming("apple-health").length, "entry names", "entries name")} Apple Health or HealthKit and ${count(naming("health-connect").length, "names", "name")} Health Connect in the registry as read on ${FETCHED}${platformRows.length ? `; ${platformRows.filter((s) => s.packages.length > 0).length} of those ${platformRows.length} list a package to run locally and ${platformRows.filter((s) => s.remotes.length > 0).length} a remote URL` : ""}. Their descriptions are quoted on this page; where one says how it reaches the data, that is its publisher's account, and this site has not run or tested any of them.`,
  },
  {
    q: "Is the aifitnessapi MCP server listed in the MCP Registry?",
    a: `${SITE_CHECK.registryNames.length ? `Yes, as ${listOf(SITE_CHECK.registryNames)}.` : "No."} As read on ${FETCHED}, ${SITE_CHECK.registryNames.length ? "" : "no registry entry names it, and "}${SITE_CHECK.onNpm ? `npm has ${SITE_CHECK.package} ${SITE_CHECK.npmVersion}` : `npm answered 404 for ${SITE_CHECK.package}`}. It is this site's own server, described in its own section of this page with that disclosure, and it is not one of the ${SERVERS.length} registry entries counted here.`,
  },
];

function Transport({ s }: { s: McpHealthServer }) {
  if (!s.packages.length && !s.remotes.length) {
    return <span className="text-xs">No package or remote listed</span>;
  }
  return (
    <ul className="space-y-1 text-xs">
      {s.packages.map((p) => (
        <li key={`${p.registryType}:${p.identifier}`}>
          <span className="text-[var(--fg)]">{p.registryType}</span> <code className="break-all font-mono text-[11px]">{p.identifier}</code>
          {p.version ? ` ${p.version}` : ""}
          {p.transport ? ` · ${p.transport}` : ""}
          {p.secretEnvironmentVariables.length > 0 && (
            <span className="block">
              Secret it reads: <code className="break-all font-mono text-[11px]">{p.secretEnvironmentVariables.join(", ")}</code>
            </span>
          )}
        </li>
      ))}
      {s.remotes.map((r) => (
        <li key={`${r.type}:${r.url}`}>
          <span className="text-[var(--fg)]">remote</span> {r.type} <code className="break-all font-mono text-[11px]">{r.url}</code>
          {r.secretHeaders.length > 0 && (
            <span className="block">
              Secret header: <code className="break-all font-mono text-[11px]">{r.secretHeaders.join(", ")}</code>
            </span>
          )}
          {r.secretUrlVariables.length > 0 && (
            <span className="block">
              Secret in the URL: <code className="break-all font-mono text-[11px]">{r.secretUrlVariables.join(", ")}</code>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function PackageFacts({ p }: { p: McpPackage }) {
  const f = p.facts;
  if (!f) {
    return (
      <li>
        {p.registryType} <code className="break-all font-mono text-[11px]">{p.identifier}</code>: not checked
      </li>
    );
  }
  if (!f.found) {
    return (
      <li>
        <a href={f.url} rel="nofollow" className={LINK}>
          {f.registry === "npm" ? "npm" : "PyPI"}
        </a>{" "}
        has no package named <code className="break-all font-mono text-[11px]">{p.identifier}</code>
      </li>
    );
  }
  return (
    <li>
      <a href={f.url} rel="nofollow" className={LINK}>
        {f.registry === "npm" ? "npm" : "PyPI"}
      </a>
      {f.latestVersion ? `: latest ${f.latestVersion}` : ": no latest version named"}
      {f.lastPublished ? `, published ${f.lastPublished}` : ""}
      {`, licence ${f.license ?? "not stated"}`}
      {f.deprecated ? <span className="block text-amber-700 dark:text-amber-400">Deprecated: {f.deprecated}</span> : null}
    </li>
  );
}

function matchText(s: McpHealthServer): string {
  return s.matches
    .map((m) => `${m.term} (${m.field}${m.context ? `, with “${m.context.text}” in the ${m.context.field}` : ""})`)
    .join(", ");
}

function ServerTable({ rows }: { rows: McpHealthServer[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[56rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-left">
            <th className={TH}>Server</th>
            <th className={TH}>The registry’s description</th>
            <th className={TH}>How it runs</th>
            <th className={TH}>Package and source</th>
            <th className="py-2 font-semibold text-[var(--fg)]">Publisher</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr
              key={s.name}
              id={rowId(s)}
              data-mcp-server={s.name}
              data-publisher={s.publisherIsVendor ? "official" : "unofficial"}
              className="scroll-mt-24 border-b border-[var(--border)] align-top"
            >
              <td className="w-56 py-3 pr-4">
                <span className="block font-semibold text-[var(--fg)]">{shortName(s)}</span>
                <code className="mt-0.5 block break-all font-mono text-[11px] text-[var(--muted)]">{s.name}</code>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  {s.version}
                  {s.publishedOn ? ` · published ${s.publishedOn}` : ""}
                </span>
                {s.status && s.status !== "active" && (
                  <span className="mt-1 block text-xs text-amber-700 dark:text-amber-400">
                    Registry status: {s.status}
                    {s.statusMessage ? ` (${s.statusMessage})` : ""}
                  </span>
                )}
                <a href={s.registryEntryUrl} rel="nofollow" className="mt-1 block text-xs text-brand-600 hover:text-brand-500">
                  Registry record
                </a>
              </td>
              <td className="py-3 pr-4 text-[var(--muted)]">
                <span className="text-[var(--fg)]">“{s.description}”</span>
                <span className="mt-1 block text-xs">Matched: {matchText(s)}</span>
              </td>
              <td className="w-52 py-3 pr-4 text-[var(--muted)]">
                <Transport s={s} />
              </td>
              <td className="w-56 py-3 pr-4 text-xs text-[var(--muted)]">
                {s.packages.length > 0 && (
                  <ul className="space-y-1">
                    {s.packages.map((p) => (
                      <PackageFacts key={`${p.registryType}:${p.identifier}`} p={p} />
                    ))}
                  </ul>
                )}
                {s.repositoryUrl && (
                  <a href={s.repositoryUrl} rel="nofollow" className={`mt-1 block break-all ${LINK}`}>
                    Repository, as listed
                  </a>
                )}
                {s.websiteUrl && (
                  <a href={s.websiteUrl} rel="nofollow" className={`mt-1 block break-all ${LINK}`}>
                    Website, as listed
                  </a>
                )}
                {!s.packages.length && !s.repositoryUrl && !s.websiteUrl && <span>None listed</span>}
              </td>
              <td className="w-32 py-3 text-xs">
                {s.publisherIsVendor ? (
                  <span className="font-semibold text-[var(--fg)]" title={s.publisherEvidence ?? undefined}>
                    Official
                  </span>
                ) : (
                  <span className="text-[var(--muted)]">Unofficial</span>
                )}
                <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">{s.namespace}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HealthMcpServersPage() {
  const url = absoluteUrl(PATH);
  return (
    <Container className="py-14">
      <JsonLd data={articleGraph({ path: PATH, title: TITLE, description: DESCRIPTION, modified: FETCHED, section: "AI Features" })} />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "AI Features", path: "/ai" },
            { name: "Health MCP servers", path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          MCP servers for health and fitness data
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {count(SERVERS.length, "server")} · {count(VENDOR_COUNTS.length, "named data source")} · read from the official MCP
          Registry on {FETCHED}
          <ContentAge date={FETCHED} />
        </p>

        <p id="answer" className={CAPSULE}>
          When this site read all {SCAN.entries.toLocaleString("en-US")} latest-version entries in the official MCP Registry on{" "}
          {FETCHED}, {SERVERS.length} named a health or fitness data source in their name, title or description. The
          sources named most often are {topList}; {VENDOR_NAMED.length} servers name a specific platform, device, app or
          aggregator, and {GENERAL_ONLY.length} only describe wearable, fitness or health data in general.{" "}
          {OFFICIAL.length === 0
            ? "None is published under the vendor’s own domain namespace, which is how this page tells an official server from an unofficial one."
            : `${count(OFFICIAL.length, "is", "are")} published under the vendor’s own domain namespace; the rest are unofficial.`}{" "}
          The registry stores each server’s metadata and points to its package or URL; it does not host the code.
        </p>

        <PageActions path={PATH} url={url} title={TITLE} updated={FETCHED} markdown={false} />

        <p className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm leading-relaxed text-[var(--muted)]">
          What to check before connecting one of these to an assistant (where the data goes, read and write tools, tokens,
          revocation) is the subject of{" "}
          <Link href="/ai/connect-wearable-data-to-ai-assistants" className={LINK}>
            connecting wearable data to AI assistants
          </Link>
          . This site’s own MCP server is described{" "}
          <a href="#this-sites-server" className={LINK}>
            in its own section
          </a>
          , with a disclosure, after the registry’s servers.
        </p>

        <section id="what-is-mcp" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What MCP is</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The Model Context Protocol specification (version 2026-07-28) describes MCP as “an open protocol that enables
            seamless integration between LLM applications and external data sources and tools.” It names three roles: hosts,
            the LLM applications that start connections; clients, the connectors inside a host; and servers, the services
            that provide context and capabilities. A server can offer resources, prompts and tools, the last of which the
            specification describes as functions for the AI model to execute, and it says hosts “must obtain explicit user
            consent before invoking any tool”. A server runs either as a subprocess the client launches, talking over
            standard input and output (stdio), or at a URL the client reaches over HTTP. In the tables below, a package is
            something you run yourself and a remote is a URL someone else runs, each with the transport its entry states.
          </p>
        </section>

        <section id="official" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Official and unofficial</h2>
          <div className="mt-3 space-y-3 leading-relaxed text-[var(--muted)]">
            <p>
              Every registry name has a namespace before the slash. The registry’s authentication guide says a publisher
              who signs in with GitHub gets {"io.github.<username>"} (or an organisation they own), and one who proves
              control of a domain by DNS or HTTP gets that domain in reverse order, so com.example for example.com. This
              page marks a server official only when its namespace is the vendor’s own domain as this site already cites it
              for that vendor’s developer documentation (garmin.com for Garmin, ouraring.com for Oura and so on).{" "}
              {OFFICIAL.length === 0
                ? `No server in this list qualifies: ${GITHUB_NS.length} of the ${SERVERS.length} are published under a GitHub namespace and the rest under other domains.`
                : `${count(OFFICIAL.length, "server qualifies", "servers qualify")}: ${listOf(OFFICIAL.map((s) => s.name))}.`}
            </p>
            <p>
              Unofficial describes who published the entry, not whether the code works, is safe, or uses the vendor’s
              approved API. Descriptions are quoted exactly as the publishers wrote them, and this site has not run, tested
              or audited any server listed here. The registry itself says it is in preview and that breaking changes or data
              resets may happen before general availability.
            </p>
          </div>
        </section>

        <section id="servers" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Servers by data source</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Each server appears once: under the one source it names, under “Several sources” when it names more than one,
            or under the general group when it names none. Within a group the order is alphabetical by registry name, not a
            ranking. {WITH_PACKAGE.length} list a package to run locally and {WITH_REMOTE.length} a remote URL.{" "}
            {WITH_SECRET.length} declare an environment variable, header or URL placeholder they mark as secret, which the
            registry’s schema defines as a value such as a password or token that clients should handle securely; the
            names are shown, never a value.
            {SECRET_IN_URL.length > 0 &&
              ` In ${count(SECRET_IN_URL.length, "remote entry", "remote entries")} the secret is part of the URL itself, so the URL is the credential.`}
            {NOT_ACTIVE.length > 0 &&
              ` ${count(NOT_ACTIVE.length, "entry carries", "entries carry")} a registry status other than active, shown on ${NOT_ACTIVE.length === 1 ? "its row" : "their rows"}.`}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {SHOWN_GROUPS.map((g) => (
              <li key={g.key}>
                <a
                  href={`#group-${g.key}`}
                  className="inline-block rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] hover:border-brand-400 hover:text-[var(--fg)]"
                >
                  {g.label} ({g.key === "several" || g.key === "general" ? homeRows(g.key).length : naming(g.key).length})
                </a>
              </li>
            ))}
          </ul>
          {UNNAMED.length > 0 && (
            <p className="mt-3 text-sm text-[var(--muted)]">
              No entry named {orList(UNNAMED.map((g) => g.label))}.
            </p>
          )}

          {SHOWN_GROUPS.map((g) => {
            const home = homeRows(g.key);
            const alsoIn = g.key === "several" || g.key === "general" ? [] : naming(g.key).filter((s) => s.group !== g.key);
            return (
              <section key={g.key} id={`group-${g.key}`} className="mt-10 scroll-mt-24">
                <h3 className="text-xl font-bold tracking-tight text-[var(--fg)]">
                  {g.label} ({g.key === "several" || g.key === "general" ? home.length : naming(g.key).length})
                </h3>
                {g.key === "several" && (
                  <p className="mt-1 text-sm text-[var(--muted)]">Servers whose entry names two or more of the sources above.</p>
                )}
                {g.key === "general" && (
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Servers that name none of the sources above but whose entry uses one of the general terms:{" "}
                    {orList(GENERAL_TERMS)}.
                  </p>
                )}
                {alsoIn.length > 0 && (
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {home.length === 0 ? `No entry names ${g.label} alone. ` : ""}
                    Also named, with other sources, by{" "}
                    {alsoIn.map((s, i) => (
                      <span key={s.name}>
                        {i > 0 && (i === alsoIn.length - 1 ? " and " : ", ")}
                        <a href={`#${rowId(s)}`} className={LINK}>
                          {s.name}
                        </a>
                      </span>
                    ))}
                    .
                  </p>
                )}
                {home.length > 0 && <ServerTable rows={home} />}
              </section>
            );
          })}
        </section>

        <section id="this-sites-server" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">This site’s own MCP server</h2>
          <aside
            role="note"
            className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-[var(--fg)]"
          >
            <strong>Disclosure:</strong> {site.name} publishes this server. It is listed here, after the registry’s servers
            and outside their groups, because it is ours, and it is not compared with them.
          </aside>
          <div className="mt-4 space-y-3 leading-relaxed text-[var(--muted)]">
            <p>
              <code className="font-mono text-base text-[var(--fg)]">{SITE.name}</code> {SITE.version}, licence{" "}
              {SITE.license}. It reads no wearable or personal data. It
              {SITE.stdio ? " runs over stdio and" : ""} exposes {count(SITE.tools.length, "tool")},{" "}
              {listOf(SITE.tools)}, which answer from {count(SITE.datasets.length, "dataset")} bundled with the package (
              {listOf(SITE.datasets)}), the same CC BY 4.0 files listed on{" "}
              <Link href="/datasets" className={LINK}>
                open datasets
              </Link>
              . Its README says there is no model and no network call in the server.
              {SITE.hostedUrl && (
                <>
                  {" "}
                  The same tools also run at <code className="font-mono text-sm">{SITE.hostedUrl}</code>, a hosted read-only
                  endpoint over Streamable HTTP that reads the same datasets from this site (
                  <Link href="/developers" className={LINK}>
                    developer docs
                  </Link>
                  ).
                </>
              )}
              {SITE.allReadOnly
                ? " Every tool declares readOnlyHint: true, which, like any server’s annotations, is its publisher’s claim."
                : !SITE.declaresAnnotations
                  ? " Its tools declare no annotations, so a client reads the specification’s default for readOnlyHint, which is false, even though every tool only reads the bundled data."
                  : ""}
            </p>
            <p>
              As read on {FETCHED},{" "}
              {SITE_CHECK.registryNames.length
                ? `the registry lists it as ${listOf(SITE_CHECK.registryNames)}`
                : "the MCP Registry has no entry for it"}{" "}
              and{" "}
              {SITE_CHECK.onNpm
                ? `npm has ${SITE_CHECK.package} ${SITE_CHECK.npmVersion}`
                : `npm answered 404 for ${SITE_CHECK.package}, so it cannot be installed with npx until it is published`}
              .
              {SITE.repositoryUrl &&
                ` Its source is the ${SITE.repositoryDirectory ?? ""}${SITE.repositoryDirectory ? " directory of the " : ""}repository its package.json names, ${SITE.repositoryUrl.replace(/\.git$/, "")}.`}
            </p>
          </div>
        </section>

        <section id="method" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How this list is built</h2>
          <div className="mt-3 space-y-3 leading-relaxed text-[var(--muted)]">
            <p>
              <code className="font-mono text-sm">scripts/fetch-mcp-health-servers.mjs</code> requests every page of the
              registry’s listing with version=latest, {SCAN.pages} pages and {SCAN.entries.toLocaleString("en-US")} entries
              on {FETCHED}, and keeps one entry per name: the one the registry marks isLatest, or the highest version if a
              name ever appears twice ({count(SCAN.duplicateNames, "name did", "names did")} this run).
            </p>
            <p>
              A server is kept when one of these terms matches a whole word in its name, title or description:{" "}
              {listOf(MCP_SERVER_TERMS.flatMap((t) => t.terms.map((x) => x.label)))}. {listOf(AMBIGUOUS_TERMS)} count only
              when the entry also uses a health or fitness word, because each is also an everyday word or another product
              {DROPPED_NAMES.length > 0
                ? `; ${count(DROPPED_NAMES.length, "entry", "entries")} matched one of them without such a word and ${DROPPED_NAMES.length === 1 ? "is" : "are"} not listed: ${listOf(DROPPED_NAMES)}.`
                : "."}
            </p>
            <p>
              Package facts come from npm and PyPI for the npm and PyPI packages an entry names ({SCAN.npmLookups} npm and{" "}
              {SCAN.pypiLookups} PyPI lookups{MISSING_PACKAGES.length > 0 ? `; ${MISSING_PACKAGES.length} of the names had no package there` : ""}).
              Other package types are shown as listed. Repositories were not read, so a repository link is exactly what the
              entry lists. A GitHub Actions workflow reruns the generator on demand and opens a pull request when the
              data changes; the date at the top of this page is the last run.
            </p>
          </div>
          {MCP_SERVERS_EXCLUDED.length > 0 && (
            <>
              <h3 className="mt-6 text-lg font-bold text-[var(--fg)]">
                Matched a term but left out ({MCP_SERVERS_EXCLUDED.length})
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Each of these uses one of the words above in another sense. Nothing else is filtered by hand.
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left">
                      <th className={TH}>Entry</th>
                      <th className={TH}>Matched</th>
                      <th className="py-2 font-semibold text-[var(--fg)]">Why it is not listed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MCP_SERVERS_EXCLUDED.map((x) => (
                      <tr key={x.name} className="border-b border-[var(--border)] align-top">
                        <td className="py-2 pr-4 font-mono text-xs text-[var(--fg)]">{x.name}</td>
                        <td className="py-2 pr-4 text-xs text-[var(--muted)]">{x.matched.join(", ")}</td>
                        <td className="py-2 text-[var(--muted)]">{x.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <FaqSection faqs={FAQS} />

        <p className="mt-12 text-sm text-[var(--muted)]">
          Read on {FETCHED} from the{" "}
          <a href={MCP_SERVERS_SOURCES.registryApi} rel="nofollow" className={LINK}>
            official MCP Registry API
          </a>{" "}
          (its{" "}
          <a href={MCP_SERVERS_SOURCES.registryOpenApi} rel="nofollow" className={LINK}>
            OpenAPI document
          </a>{" "}
          and{" "}
          <a href={MCP_SERVERS_SOURCES.registryAuthentication} rel="nofollow" className={LINK}>
            authentication guide
          </a>{" "}
          explain the fields), the npm registry and PyPI, by{" "}
          <code className="font-mono text-xs">scripts/fetch-mcp-health-servers.mjs</code>. Server descriptions are their
          publishers’ words. Compiled by {site.name}.
        </p>
      </div>
    </Container>
  );
}
