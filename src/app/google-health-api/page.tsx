import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import StatCard from "@/components/StatCard";
import Countdown from "@/components/Countdown";
import PageActions from "@/components/PageActions";
import {
  GHAPI_FETCHED_ON,
  GHAPI_METHODS,
  GHAPI_RATE_LIMITS,
  GHAPI_RELEASE_NOTES,
  GHAPI_TIMELINE,
  GHAPI_DISCOVERY,
} from "@/data/googleHealthApi";
import {
  GHAPI_BASE,
  GHAPI_PATHS,
  GHAPI_TOPICS,
  dataPointMethods,
  familyAnchor,
  fitDescription,
  fitTitle,
  flagLabel,
  flagsByKind,
  getType,
  ghapiTotals,
  joinList,
  opNames,
  quote,
  sectionFlags,
  sectionUrl,
  source,
  typePath,
  typesByFamily,
  allTypes,
  isWritable,
} from "@/data/ghapiPages";
import { absoluteUrl } from "@/lib/site";
import { stringSeed } from "@/lib/cluster";
import { FaqSection, JsonLd, faqGraph, type Faq } from "../error-codes/_shared";
import { CAPSULE, Code, FetchedLine, FlagList, H2, Inline, LINK, SourcesChecked, TH, ghapiGraph } from "./_shared";

/**
 * The Google Health API hub: Google's own description and turn-down
 * timeline, what changes for a Fitbit Web API integration (each point quoted
 * from Google's guides), every data type grouped by scope family, the
 * methods with how many types list each, the rate limits, the release
 * history, and where Google's pages disagree. Every number is computed from
 * the generated module, so the copy cannot go stale against it.
 *
 * The how-to of a migration is owned by /migrate/fitbit-web-api-to-google-health
 * and the deadline by /fitbit-api-shutdown; this is the reference, and it
 * links to both rather than competing with them.
 */

const PATH = GHAPI_BASE;
const T = ghapiTotals();
const TITLE = fitTitle([`Google Health API: All ${T.types} Data Types, Scopes and Methods`, `Google Health API: ${T.types} Data Types and Scopes`]);
const H1 = "Google Health API reference: every data type, scope and method";
const DESCRIPTION = fitDescription([
  `The Google Health API, the Fitbit Web API's successor, read from Google's docs: ${T.types} data types with operations, scopes, fields and rollups, and limits.`,
  `The Google Health API from Google's docs: ${T.types} data types with operations, scopes, fields and rollups, plus methods and limits.`,
]);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const ABOUT_LEAD = quote("about", null, "is now called the Google Health API");
const RESTRICTED_ALL = quote("about", "what-you-get", "Restricted");
const RESTRICTED_MOST = quote("appVerification", null, "Most scopes for the Google Health API are restricted");
const UNVERIFIED_CAP = quote("appVerification", null, "limited to 100 users");
const OAUTH = quote("about", "what-you-get", "Replace legacy Fitbit Authorization");
const TOKENS = quote("migration", "why-migrate", "cannot be transferred");
const IDENTITY = quote("migration", "ensure-data-continuity", "6-character alphanumeric string");
const GET_IDENTITY = quote("migration", "ensure-data-continuity", "to get the Fitbit and Health user IDs");
const RANGE_14 = quote("dataTypes", "query_constraints", "14 days", true);
const RANGE_90 = quote("dataTypes", "query_constraints", "90 days", true);
const DUAL = quote("migration", "support_both_login_methods", "Never allow a single user");
const LINKING = quote("migration", "handle-http-412", "must sign in to the Google Health mobile app");
const BASE_URL = quote("apiSpecifications", "endpoints", "base HTTP URL");
const RATE_429 = quote("rateLimits", "handle_rate_limit_errors", "429 Too Many Requests");

const turnOff = GHAPI_TIMELINE.find((t) => /turn-off/i.test(t.label)) ?? GHAPI_TIMELINE[GHAPI_TIMELINE.length - 1];
const endOfSupport = GHAPI_TIMELINE.find((t) => /end of support/i.test(t.label)) ?? GHAPI_TIMELINE[0];

const writable = allTypes().filter(isWritable);

const FAQS: Faq[] = [
  {
    q: "How many data types does the Google Health API have?",
    a: `Google's data-types table listed ${T.types} on ${GHAPI_FETCHED_ON}: ${T.v4} in the stable v4 channel and ${T.beta} tagged v4beta${
      T.beta ? ` (${allTypes().filter((t) => t.channel !== "v4").map((t) => t.dataType).join(", ")})` : ""
    }, across ${T.families} scope families. The v4 discovery document (revision ${GHAPI_DISCOVERY.revision}) defines ${GHAPI_DISCOVERY.dataPointPropertyCount} fields on its DataPoint schema; not every table type has one, and not every field has a table row — the differences are published on this page as flags.`,
  },
  {
    q: "Where is the Google Health API discovery document?",
    a: `At ${GHAPI_DISCOVERY.url}, with the preview channel at ${GHAPI_DISCOVERY.betaUrl}. Read on ${source("discoveryV4").fetchedOn}, the v4 document ("${GHAPI_DISCOVERY.title}", revision ${GHAPI_DISCOVERY.revision}) defined ${GHAPI_DISCOVERY.methodCount} methods and ${GHAPI_DISCOVERY.schemaCount} schemas; the v4beta document (revision ${GHAPI_DISCOVERY.betaRevision}) defined ${GHAPI_DISCOVERY.betaSchemaCount} schemas, ${GHAPI_DISCOVERY.betaOnlySchemas.length} of them (${joinList(GHAPI_DISCOVERY.betaOnlySchemas)}) not in v4. This reference is generated from both.`,
  },
  {
    q: "Which Google Health API data types can apps write to?",
    a: `${writable.length} of the ${T.types} list a write operation (create, update or batchDelete) in Google's data-types table: ${joinList(
      writable.map((t) => t.dataType),
    )}. The table lists no write operation for the other ${T.types - writable.length}.${
      writable.every((t) => t.scopes.some((s) => s.access === "write")) ? " Each writable type lists a .writeonly scope." : ""
    } Google's Scopes page: "${quote("scopes", "implementation", "if you are sending data to Google Health").replace(/`/g, "")}"`,
  },
  {
    q: "What is the Google Health API base URL?",
    a: `Google's Fitbit migration specification: "${BASE_URL.replace(/`/g, "")}" The v4 discovery document's rootUrl is ${GHAPI_DISCOVERY.rootUrl}${
      GHAPI_METHODS.every((m) => m.flatPath?.startsWith("v4/")) ? ", and every method path in it starts with v4/" : ""
    }.`,
  },
];

const FITBIT_PAGES: { href: string; label: string; blurb: string }[] = [
  { href: "/fitbit-api-shutdown", label: "Fitbit Web API retirement", blurb: "The turn-off dates graded confirmed against reported, and the migration path by integration shape." },
  { href: "/migrate/fitbit-web-api-to-google-health", label: "Migrate to the Google Health API", blurb: "The move step by step: audit, new console and OAuth, endpoint mapping, re-consent in cohorts." },
  { href: "/integrate/fitbit-api", label: "Integrate the Fitbit API", blurb: "How the legacy Fitbit Web API integration is built, and what its successor changes." },
  { href: "/alternatives/fitbit-api-alternatives", label: "Fitbit API alternatives", blurb: "The Google Health API against aggregators and single-device APIs, by use case." },
  { href: "/pricing/fitbit-api-pricing", label: "Fitbit API pricing", blurb: "What the Fitbit integration costs, and what is and is not public about its successor." },
];

export default function GoogleHealthApiHub() {
  const url = absoluteUrl(PATH);
  const groups = typesByFamily();
  const coverage = (method: string) => allTypes().filter((t) => t.operations.some((o) => o.method === method));
  const otherMethods = GHAPI_METHODS.filter((m) => m.resource !== "users.dataTypes.dataPoints");
  const about = source("about");
  const dataTypes = source("dataTypes");
  const flagGroups = flagsByKind();

  return (
    <Container className="py-14">
      <JsonLd
        data={ghapiGraph({
          path: PATH,
          title: TITLE,
          headline: H1,
          description: DESCRIPTION,
          sources: ["about", "dataTypes", "discoveryV4", "discoveryV4beta", "migration", "appVerification", "apiSpecifications", "rateLimits", "releaseNotes"],
          items: allTypes().map((t) => ({ name: `${t.name} (${t.dataType})`, path: typePath(t) })),
        })}
      />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Google Health API", path: PATH }]} />
        <ClusterHero label="Google Health API reference" seed={stringSeed("google-health-api")} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <FetchedLine extra={dataTypes.lastUpdated ? <> · Google’s data-types page last updated {dataTypes.lastUpdated}</> : null} />

        <p id="answer" className={CAPSULE}>
          Google’s About page: “{ABOUT_LEAD.replace(/`/g, "")}” It replaces Fitbit authorization with Google OAuth 2.0,
          and Google’s data-types table listed {T.types} data types on {GHAPI_FETCHED_ON}. Google’s timeline puts the end
          of support on {endOfSupport.dateText} and the API turn-off on {turnOff.dateText}: “{turnOff.text}”
        </p>

        <PageActions path={PATH} url={url} title={H1} updated={GHAPI_FETCHED_ON} markdown={false} />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            value={String(T.types)}
            label={`data types in Google's table (${T.beta} v4beta)`}
            claim={`Google's Google Health API data-types table lists ${T.types} data types, ${T.beta} of them tagged v4beta, as read on ${GHAPI_FETCHED_ON}.`}
            anchor={`${url}#types`}
          />
          <StatCard
            value={String(T.webhook)}
            label="with webhook support"
            claim={`${T.webhook} of the ${T.types} Google Health API data types carry the Webhook support badge in Google's data-types table, as read on ${GHAPI_FETCHED_ON}.`}
            anchor={absoluteUrl(GHAPI_PATHS.webhooks)}
          />
          <StatCard
            value={String(T.writable)}
            label="that apps can write"
            claim={`${T.writable} of the ${T.types} Google Health API data types list a create, update or batchDelete operation in Google's data-types table, as read on ${GHAPI_FETCHED_ON}.`}
            anchor={`${url}#types`}
          />
          <StatCard
            value={String(T.flags)}
            label="places Google’s own pages disagree"
            claim={`Comparing Google's data-types table, Scopes page, Fitbit mapping tables, webhooks guide and the v4 discovery document (revision ${GHAPI_DISCOVERY.revision}) finds ${T.flags} disagreements, as read on ${GHAPI_FETCHED_ON}.`}
            anchor={`${url}#flags`}
          />
        </div>

        <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2 text-sm">
          {[
            ["#timeline", "Timeline"],
            ["#changes", "What changes"],
            ["#types", "Data types"],
            ["#methods", "Methods"],
            ["#limits", "Rate limits"],
            ["#releases", "Release history"],
            ["#flags", "Where Google’s pages disagree"],
            ["#faq", "Questions"],
          ].map(([href, text]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              {text}
            </a>
          ))}
        </nav>

        <section id="timeline" className="mt-14 scroll-mt-24">
          <h2 className={H2}>The Fitbit Web API turn-down</h2>
          <p className="mt-2 text-[var(--muted)]">As Google’s About page states it:</p>
          <ol className="mt-4 space-y-3">
            {GHAPI_TIMELINE.map((t) => (
              <li key={t.date} className="rounded-2xl border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--fg)]">
                  {t.dateText} — {t.label} <Countdown date={t.date} />
                </p>
                <p className="mt-1 text-[var(--muted)]">“{t.text}”</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Quoted from{" "}
            <a href={sectionUrl("about", "what-about-fitbit")} className={LINK} rel="noopener">
              Google’s About page
            </a>
            {about.lastUpdated ? `, last updated ${about.lastUpdated}` : ""}, read {about.fetchedOn}. What else is confirmed
            and what is only reported:{" "}
            <Link href="/fitbit-api-shutdown" className={LINK}>
              the Fitbit Web API retirement page
            </Link>
            .
          </p>
        </section>

        <section id="changes" className="mt-14 scroll-mt-24">
          <h2 className={H2}>What changes from the Fitbit Web API</h2>
          <p className="mt-2 text-[var(--muted)]">Each point in Google’s words, with the page it comes from.</p>
          <dl className="mt-6 space-y-5">
            {[
              { k: "Google OAuth 2.0 replaces Fitbit authorization", qs: [{ q: OAUTH, src: sectionUrl("about", "what-you-get"), by: "About" }] },
              {
                k: "Restricted scopes and a review",
                qs: [
                  { q: RESTRICTED_ALL, src: sectionUrl("about", "what-you-get"), by: "About" },
                  { q: RESTRICTED_MOST, src: sectionUrl("appVerification", null), by: "App verification" },
                ],
              },
              { k: "Unverified apps are capped", qs: [{ q: UNVERIFIED_CAP, src: sectionUrl("appVerification", null), by: "App verification" }] },
              { k: "Every user re-consents", qs: [{ q: TOKENS, src: sectionUrl("migration", "why-migrate"), by: "Migration guide" }] },
              {
                k: "A new user identifier",
                qs: [
                  { q: IDENTITY, src: sectionUrl("migration", "ensure-data-continuity"), by: "Migration guide" },
                  { q: GET_IDENTITY, src: sectionUrl("migration", "ensure-data-continuity"), by: "Migration guide" },
                ],
              },
              { k: "No dual-linking", qs: [{ q: DUAL, src: sectionUrl("migration", "support_both_login_methods"), by: "Migration guide" }] },
              { k: "Accounts must be linked first", qs: [{ q: LINKING, src: sectionUrl("migration", "handle-http-412"), by: "Migration guide" }] },
              { k: "A new base URL", qs: [{ q: BASE_URL, src: sectionUrl("apiSpecifications", "endpoints"), by: "API specifications" }] },
            ].map((c) => (
              <div key={c.k} className="rounded-2xl border border-[var(--border)] p-5">
                <dt className="font-semibold text-[var(--fg)]">{c.k}</dt>
                {c.qs.map((x) => (
                  <dd key={x.q} className="mt-2 text-[var(--muted)]">
                    “<Inline text={x.q} />”{" "}
                    <a href={x.src} className="text-xs text-brand-600 hover:text-brand-500" rel="noopener">
                      Google — {x.by}
                    </a>
                  </dd>
                ))}
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-[var(--muted)]">
            The two restricted-scope sentences do not say the same thing — “all” on the About page, “most” on the
            app-verification page — so this page quotes both and{" "}
            <a href="#flags" className={LINK}>
              lists the difference
            </a>{" "}
            with the other disagreements. Verification, the security assessment and the quotas in full:{" "}
            <Link href={GHAPI_PATHS.access} className={LINK}>
              access and rate limits
            </Link>
            . The move itself, step by step:{" "}
            <Link href="/migrate/fitbit-web-api-to-google-health" className={LINK}>
              migrating from the Fitbit Web API to the Google Health API
            </Link>
            .
          </p>
        </section>

        <section id="types" className="mt-14 scroll-mt-24">
          <h2 className={H2}>All {T.types} data types, by scope family</h2>
          <p className="mt-2 text-[var(--muted)]">
            Grouped by the scope family Google’s table lists for each type (Google’s own scope ids, in the Scopes page’s
            order); within a family, in the table’s order. Operations are as the table prints them.
          </p>
          <nav aria-label="Scope families" className="mt-4 flex flex-wrap gap-2 text-sm">
            {groups.map((g) => (
              <a
                key={g.family}
                href={`#${familyAnchor(g.family)}`}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
              >
                {g.label} <span className="font-semibold tabular-nums text-[var(--fg)]">{g.types.length}</span>
              </a>
            ))}
          </nav>
          {groups.map((g) => (
            <div key={g.family} id={familyAnchor(g.family)} className="mt-10 scroll-mt-24">
              <h3 className="text-xl font-bold tracking-tight text-[var(--fg)]">
                {g.label} <span className="ml-1 text-base font-normal tabular-nums text-[var(--muted)]">{g.types.length}</span>
              </h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Scope family <Code>{g.family}</Code>
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[44rem] border-collapse text-left text-sm" data-ghapi-hub-table>
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th scope="col" className={TH}>
                        Data type
                      </th>
                      <th scope="col" className={TH}>
                        Record type
                      </th>
                      <th scope="col" className={TH}>
                        Operations
                      </th>
                      <th scope="col" className={TH}>
                        Storage
                      </th>
                      <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                        Badges
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.types.map((t) => (
                      <tr key={t.dataType} id={`type-${t.dataType}`} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                        <td className="py-2 pr-4">
                          <Link href={typePath(t)} className="font-medium text-brand-600 hover:text-brand-500">
                            {t.name}
                          </Link>
                          <span className="block font-mono text-[11px] text-[var(--muted)]">{t.dataType}</span>
                        </td>
                        <td className="py-2 pr-4 text-[var(--muted)]">{t.recordType}</td>
                        <td className="py-2 pr-4 font-mono text-[11px] text-[var(--muted)]">{opNames(t).join(", ")}</td>
                        <td className="py-2 pr-4 text-[var(--muted)]">{t.storageResolution ?? "—"}</td>
                        <td className="py-2 text-xs text-[var(--muted)]">
                          {[
                            t.channel !== "v4" ? t.channel : null,
                            t.webhookSupport ? "webhooks" : null,
                            t.trueZerosSupport ? "true zeros" : null,
                            t.flags.length ? `${t.flags.length} flag${t.flags.length > 1 ? "s" : ""}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        <section id="methods" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Methods</h2>
          <p className="mt-2 text-[var(--muted)]">
            The v4 discovery document (revision {GHAPI_DISCOVERY.revision}) defines {T.methods} methods, {T.dataPointMethods} of
            them on <Code>users.dataTypes.dataPoints</Code>. The count is how many of the {T.types} table types list an
            operation that maps to the method.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>
                    Method
                  </th>
                  <th scope="col" className={TH}>
                    Path template
                  </th>
                  <th scope="col" className={TH}>
                    Types
                  </th>
                  <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                    Google’s description
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataPointMethods().map((m) => (
                  <tr key={m.name} id={`method-${m.name.toLowerCase()}`} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4">
                      <Code>{m.name}</Code>
                    </td>
                    <td className="py-2 pr-4">
                      <Code>{`${m.httpMethod} ${m.flatPath}`}</Code>
                    </td>
                    <td className="py-2 pr-4 tabular-nums text-[var(--muted)]">{coverage(m.name).length}</td>
                    <td className="py-2 text-[var(--muted)]">
                      <Inline text={(m.description ?? "").split(" ## ")[0]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Google’s data-types page on the rollup range: “<Inline text={RANGE_14} />” and “<Inline text={RANGE_90} />” The
            table’s “update” has no method of that name; Google’s endpoint-mapping table points updates at{" "}
            <Code>patch</Code>, and each type that lists it carries a flag saying so.
          </p>
          <h3 className="mt-8 text-lg font-bold tracking-tight text-[var(--fg)]">The other {otherMethods.length} methods</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            {otherMethods.map((m) => (
              <li key={`${m.resource}.${m.name}`}>
                <Code>{`${m.resource}.${m.name}`}</Code> — <Code>{`${m.httpMethod} ${m.flatPath}`}</Code>
                {m.description ? (
                  <>
                    {" "}
                    — <Inline text={m.description.split(" **")[0]} />
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section id="limits" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Rate limits</h2>
          <p className="mt-2 text-[var(--muted)]">Google’s default quotas, as its rate-limits page prints them:</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>
                    Metric
                  </th>
                  <th scope="col" className={TH}>
                    Default limit
                  </th>
                  <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                    Google’s QPS impact analysis
                  </th>
                </tr>
              </thead>
              <tbody>
                {GHAPI_RATE_LIMITS.map((r) => (
                  <tr key={r.metric} className="border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4 text-[var(--fg)]">{r.metric}</td>
                    <td className="py-2 pr-4 tabular-nums text-[var(--fg)]">{r.defaultLimit}</td>
                    <td className="py-2 text-[var(--muted)]">
                      <Inline text={r.qpsImpact} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            “<Inline text={RATE_429} />” — Google’s rate-limits page, last updated {source("rateLimits").lastUpdated}.{" "}
            <Link href={GHAPI_PATHS.access} className={LINK}>
              Verification, quota increases and 429 handling
            </Link>
            .
          </p>
        </section>

        <section id="releases" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Release history</h2>
          <p className="mt-2 text-[var(--muted)]">
            The {GHAPI_RELEASE_NOTES.length} dated entries in{" "}
            <a href={source("releaseNotes").url} className={LINK} rel="noopener">
              Google’s release notes
            </a>
            , newest first, with the headings Google gives each.
          </p>
          <ol className="mt-4 space-y-3">
            {GHAPI_RELEASE_NOTES.map((r) => (
              <li key={r.date} id={`release-${r.date}`} className="scroll-mt-24 rounded-xl border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--fg)]">
                  <a href={sectionUrl("releaseNotes", r.id)} className="hover:text-brand-600" rel="noopener">
                    {r.dateText}
                  </a>
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {r.sections.length ? r.sections.map((s) => s.heading).join(" · ") : r.intro.map((b) => ("text" in b ? b.text : "")).join(" ").slice(0, 160)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section id="flags" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Where Google’s pages disagree</h2>
          <p className="mt-2 text-[var(--muted)]">
            Comparing the data-types table with the Scopes page, the Fitbit mapping tables, the webhooks guide, the
            release notes and the discovery documents finds {T.flags} disagreements, across {T.typesWithFlags} data types
            and the scope lists. They are published as found; none is corrected here.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {flagGroups.map((g) => {
              const types = [...new Set(g.flags.map((f) => f.dataType).filter((d): d is string => Boolean(d && getType(d))))];
              return (
                <li key={g.kind}>
                  <strong className="text-[var(--fg)]">{flagLabel(g.kind)}</strong> ({g.flags.length})
                  {types.length > 0 && (
                    <>
                      {": "}
                      {types.map((id, i) => (
                        <span key={id}>
                          {i > 0 ? ", " : ""}
                          <Link href={`${typePath({ dataType: id })}#flags`} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">
                            {id}
                          </Link>
                        </span>
                      ))}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <h3 className="mt-8 text-lg font-bold tracking-tight text-[var(--fg)]">The ones that concern no single data type</h3>
          <FlagList flags={sectionFlags()} />
        </section>

        <section className="mt-14">
          <h2 className={H2}>Topics</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {GHAPI_TOPICS.map((p) => (
              <li key={p.path}>
                <Link
                  href={p.path}
                  className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="font-semibold text-[var(--fg)]">{p.label}</span>
                  <span className="mt-2 text-sm text-[var(--muted)]">{p.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className={H2}>The Fitbit side, on this site</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {FITBIT_PAGES.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="font-semibold text-[var(--fg)]">{p.label}</span>
                  <span className="mt-2 text-sm text-[var(--muted)]">{p.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FaqSection faqs={FAQS} />

        <ClusterCta
          pitch="This reference is generated from Google's discovery document and developer guide by a script, not typed by hand. Subscribe to hear when Google adds a data type, a scope or a method, or moves a Fitbit Web API date."
          source="pillar-inline"
          id="cta-google-health-api-hub"
        />

        <SourcesChecked keys={["about", "dataTypes", "discoveryV4", "discoveryV4beta", "migration", "appVerification", "apiSpecifications", "rateLimits", "webhooks", "scopes", "releaseNotes"]} />
      </div>
    </Container>
  );
}
