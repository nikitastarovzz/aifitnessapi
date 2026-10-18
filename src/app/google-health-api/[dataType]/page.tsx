import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import { GHAPI_MENTIONS, GHAPI_TABLE_KEY, type GhapiDataType } from "@/data/googleHealthApi";
import {
  GHAPI_BASE,
  GHAPI_PATHS,
  SOURCE_LABEL,
  allTypes,
  dataPointMethods,
  familyAnchor,
  familyLabel,
  familyOf,
  getType,
  ghapiModified,
  ghapiPublished,
  metricPage,
  schema,
  source,
  typeCapsule,
  typeDescription,
  typeFaqs,
  typeH1,
  typeParams,
  typePath,
  typeTitle,
  typesByFamily,
} from "@/data/ghapiPages";
import { absoluteUrl } from "@/lib/site";
import { stringSeed } from "@/lib/cluster";
import { FaqSection, JsonLd, faqGraph } from "../../error-codes/_shared";
import { CAPSULE, Code, FetchedLine, FieldsTable, FlagList, H2, Inline, LINK, SourcesChecked, TH, ghapiGraph } from "../_shared";

/**
 * One page per data type in Google's Google Health API data-types table. The
 * query is the type ("google health api heart rate"), so the display name
 * and the dataType id lead the title, the H1 and the capsule.
 *
 * Every table here is the generated dataset (googleHealthApi.ts) rendered
 * as-is: Google's table row, the discovery document's schema for the type
 * and its rollup, the documented path template with the id filled in, and a
 * visible flag wherever Google's own pages disagree about the type.
 */

export const dynamicParams = false;

type Params = { dataType: string };

export function generateStaticParams(): Params[] {
  return typeParams();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { dataType } = await params;
  const t = getType(dataType);
  if (!t) return {};
  const canonical = typePath(t);
  const title = typeTitle(t);
  const description = typeDescription(t);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      publishedTime: ghapiPublished(canonical),
      modifiedTime: ghapiModified(),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** The sentence of the list method's parent parameter that says what {user} can be. */
function userSentence(): string | null {
  const parent = dataPointMethods()
    .find((m) => m.name === "list")
    ?.parameters.find((p) => p.name === "parent")?.description;
  return parent?.match(/The `\{user\}` can be either[^.]*\./)?.[0] ?? null;
}

const keyText = (field: RegExp) => GHAPI_TABLE_KEY.find((k) => field.test(k.field))?.description ?? null;

function Facts({ t }: { t: GhapiDataType }) {
  const dp = schema(t.schema?.id);
  const rows: [string, React.ReactNode][] = [
    ["Display name", t.name],
    [
      "dataType (in endpoint URLs)",
      <span key="d">
        <Code>{t.dataType}</Code>
      </span>,
    ],
    [
      "filter parameter",
      <span key="f">
        <Code>{t.filterParam}</Code>
        {keyText(/^`?filter`? parameter$/) && (
          <span className="mt-1 block text-xs">
            Google: “<Inline text={keyText(/^`?filter`? parameter$/)!} />”
          </span>
        )}
      </span>,
    ],
    [
      "Record type",
      <span key="r">
        {t.recordType}
        {t.recordTypeDefinition && <span className="text-xs"> — Google: “{t.recordTypeDefinition}”</span>}
      </span>,
    ],
    ["Storage resolution", t.storageResolution ?? "not stated in Google’s table"],
    ["Webhook support", t.webhookSupport ? `Yes${t.webhookToken ? ` · automatic-subscription token ${t.webhookToken}` : ""}` : "Not marked in Google’s table"],
    ["True zeros support", t.trueZerosSupport ? "Yes" : "Not marked in Google’s table"],
    ["Channel", t.channel === "v4beta" ? "v4beta (Google’s preview channel)" : "v4"],
    [
      "DataPoint field",
      t.dataPointProperty ? (
        <span key="p">
          <Code>{`DataPoint.${t.dataPointProperty}`}</Code> → <Code>{dp?.id ?? "?"}</Code>
          {t.dataPointSource === "v4beta" ? " (v4beta discovery document)" : ""}
          {t.dataPointEvidence && (
            <span className="mt-1 block text-xs">
              {t.dataPointMatch === "description" ? "Its description: " : "Matched by the kebab-case rule; its description: "}“
              <Inline text={t.dataPointEvidence} />”
            </span>
          )}
        </span>
      ) : (
        "none in the discovery documents — see the flags below"
      ),
    ],
    ["Compatible devices", `${t.compatibleDevices.length} in Google’s table`],
  ];
  return (
    <dl className="mt-4 grid gap-x-6 gap-y-3 rounded-2xl border border-[var(--border)] p-5 text-sm sm:grid-cols-[13rem_1fr]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-semibold text-[var(--fg)]">{k}</dt>
          <dd className="break-words text-[var(--muted)]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function SchemaBlock({ id, nested, idPrefix }: { id: string; nested: string[]; idPrefix: string }) {
  const s = schema(id);
  if (!s) return null;
  return (
    <div>
      <p className="mt-3 text-sm text-[var(--muted)]">
        <Code>{s.id}</Code>
        {s.description ? (
          <>
            {" "}
            — Google: “<Inline text={s.description} />”
          </>
        ) : null}
      </p>
      <FieldsTable schema={s} idPrefix={idPrefix} />
      {nested.map((n) => {
        const c = schema(n);
        if (!c) return null;
        return (
          <div key={n} className="mt-6">
            <h4 className="font-semibold text-[var(--fg)]">
              <Code>{c.id}</Code>
            </h4>
            {c.description && (
              <p className="mt-1 text-sm text-[var(--muted)]">
                Google: “<Inline text={c.description} />”
              </p>
            )}
            <FieldsTable schema={c} />
          </div>
        );
      })}
    </div>
  );
}

export default async function GhapiTypePage({ params }: { params: Promise<Params> }) {
  const { dataType } = await params;
  const t = getType(dataType);
  if (!t) notFound();

  const path = typePath(t);
  const url = absoluteUrl(path);
  const h1 = typeH1(t);
  const title = typeTitle(t);
  const description = typeDescription(t);
  const capsule = typeCapsule(t);
  const faqs = typeFaqs(t);
  const metric = metricPage(t);
  const mentions = GHAPI_MENTIONS[t.dataType] ?? [];
  const family = familyOf(t);
  const siblings = (typesByFamily().find((g) => g.family === family)?.types ?? []).filter((o) => o.dataType !== t.dataType);
  const all = allTypes();
  const at = all.findIndex((o) => o.dataType === t.dataType);
  const prev = at > 0 ? all[at - 1] : null;
  const next = at >= 0 ? (all[at + 1] ?? null) : null;
  const user = userSentence();
  const dataTypes = source("dataTypes");

  const sourceKeys = ["dataTypes", t.dataPointSource === "v4beta" ? "discoveryV4beta" : "discoveryV4", "scopes", ...(t.fitbit ? (["apiSpecifications"] as const) : [])] as const;

  const toc: [string, string][] = [
    ["#facts", "Facts"],
    ["#operations", "Operations"],
    ["#scopes", "Scopes"],
    ...(t.schema ? ([["#fields", "Fields"]] as [string, string][]) : []),
    ...(t.rollup || t.dailyRollup ? ([["#rollups", "Rollups"]] as [string, string][]) : []),
    ["#fitbit", "Fitbit Web API"],
    ...(t.flags.length ? ([["#flags", "Where Google’s pages disagree"]] as [string, string][]) : []),
    ["#faq", "Questions"],
  ];

  return (
    <Container className="py-14">
      <JsonLd
        data={ghapiGraph({ path, title, headline: h1, description, sources: [...sourceKeys] })}
      />
      <JsonLd data={faqGraph(path, faqs)} />

      <div className="mx-auto max-w-4xl" data-ghapi-type={t.dataType}>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Google Health API", path: GHAPI_BASE },
            { name: t.name, path },
          ]}
        />

        <ClusterHero label="Google Health API reference" seed={stringSeed(t.dataType)} />

        <h1 className="break-words text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{h1}</h1>
        <FetchedLine extra={dataTypes.lastUpdated ? <> · Google’s data-types page last updated {dataTypes.lastUpdated}</> : null} />

        <p id="answer" className={CAPSULE}>
          {capsule}
        </p>

        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2 text-sm">
          {toc.map(([href, text]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              {text}
            </a>
          ))}
        </nav>

        <section id="facts" className="mt-12 scroll-mt-24">
          <h2 className={H2}>{t.name} at a glance</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            From the{" "}
            <a href={t.referenceUrl ?? dataTypes.url} className={LINK} rel="noopener">
              {t.name}
            </a>{" "}
            row of{" "}
            <a href={dataTypes.url} className={LINK} rel="noopener">
              Google’s data-types table
            </a>
            , joined to the discovery document’s DataPoint schema.
          </p>
          <Facts t={t} />
        </section>

        <section id="operations" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Operations and request paths</h2>
          <p className="mt-2 text-[var(--muted)]">
            The operations Google’s table lists for {t.dataType}, each matched to its{" "}
            <Code>users.dataTypes.dataPoints</Code> method in the discovery document. The path is the documented path
            template (the method’s <Code>flatPath</Code> on <Code>https://health.googleapis.com/</Code>) with{" "}
            <Code>{"{dataTypesId}"}</Code> filled in as <Code>{t.dataType}</Code>.
            {user ? (
              <>
                {" "}
                Google on <Code>{"{user}"}</Code>: “<Inline text={user} />”
              </>
            ) : null}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>
                    Table lists
                  </th>
                  <th scope="col" className={TH}>
                    Method
                  </th>
                  <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                    Documented path template
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.operations.map((o) => (
                  <tr key={o.op} data-ghapi-op={o.op} className="border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4">
                      <Code>{o.op}</Code>
                    </td>
                    <td className="py-2 pr-4 text-[var(--muted)]">
                      {o.method ? <Code>{o.method}</Code> : "no method of that name"}
                      {o.match === "case-insensitive" && <span className="block text-xs">same name, different case</span>}
                      {o.match === "endpoint-mapping" && <span className="block text-xs">via Google’s endpoint-mapping table (flagged below)</span>}
                    </td>
                    <td className="py-2">
                      {o.httpMethod && o.path ? <Code>{`${o.httpMethod} ${o.path}`}</Code> : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Every method, and how many of the data types list it:{" "}
            <Link href={`${GHAPI_BASE}#methods`} className={LINK}>
              the methods overview
            </Link>
            .
          </p>
        </section>

        <section id="scopes" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Scopes</h2>
          <p className="mt-2 text-[var(--muted)]">
            The scopes Google’s table lists for {t.dataType}, as full URLs, with the consent text Google’s Scopes page
            gives each.{" "}
            <Link href={GHAPI_PATHS.scopes} className={LINK}>
              Every Google Health API scope
            </Link>
            .
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>
                    Scope
                  </th>
                  <th scope="col" className={TH}>
                    Access
                  </th>
                  <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                    Google’s permission text
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.scopes.map((s) => (
                  <tr key={s.url} className="border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4">
                      <Code>{s.url}</Code>
                      {!s.inDiscoveryV4 && <span className="mt-1 block text-xs text-amber-700 dark:text-amber-400">not in the v4 discovery document</span>}
                    </td>
                    <td className="py-2 pr-4 text-[var(--muted)]">{s.access}</td>
                    <td className="py-2 text-[var(--muted)]">{s.permission ?? "Not on Google’s Scopes page"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {t.schema && (
          <section id="fields" className="mt-14 scroll-mt-24">
            <h2 className={H2}>Fields of {t.name}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              The schema the discovery document gives <Code>{`DataPoint.${t.dataPointProperty}`}</Code>, required fields
              first. Types are as the discovery document states them; the label is the word Google’s description opens
              with. The schemas its fields refer to follow, one level deep.
            </p>
            <SchemaBlock id={t.schema.id} nested={t.schema.nested} idPrefix="field" />
          </section>
        )}

        {(t.rollup || t.dailyRollup) && (
          <section id="rollups" className="mt-14 scroll-mt-24">
            <h2 className={H2}>Rollup fields</h2>
            {[
              { r: t.rollup, union: "RollupDataPoint", method: "rollUp" },
              { r: t.dailyRollup, union: "DailyRollupDataPoint", method: "dailyRollUp" },
            ]
              .filter((x) => x.r)
              .map(({ r, union, method }) => (
                <div key={union} className="mt-6">
                  <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">
                    <Code>{method}</Code> returns <Code>{`${union}.${r!.property}`}</Code>
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    The discovery document: “<Inline text={r!.evidence} />”
                  </p>
                  {r!.schema &&
                    (union === "DailyRollupDataPoint" && t.rollup?.schema?.id === r!.schema.id ? (
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        The same <Code>{r!.schema.id}</Code> as the rollUp result above.
                      </p>
                    ) : (
                      <SchemaBlock id={r!.schema.id} nested={r!.schema.nested} idPrefix={method === "rollUp" ? "rollup" : "daily-rollup"} />
                    ))}
                </div>
              ))}
          </section>
        )}

        <section id="fitbit" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Fitbit Web API predecessor</h2>
          {t.fitbit ? (
            <div className="mt-3 text-[var(--muted)]">
              <p>
                Google’s Fitbit Web API → Google Health API data-type table maps{" "}
                <strong className="text-[var(--fg)]">
                  <Inline text={t.fitbit.fitbitDataType} />
                </strong>{" "}
                to <Code>{t.dataType}</Code>.
                {t.fitbit.description ? (
                  <>
                    {" "}
                    Google’s note: “<Inline text={t.fitbit.description} />”
                  </>
                ) : null}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-[var(--muted)]">
              Google’s Fitbit Web API → Google Health API data-type table has no row for {t.dataType}, so it names no
              Fitbit Web API predecessor.
            </p>
          )}
          {t.fitbitScopes.length > 0 && (
            <p className="mt-3 text-[var(--muted)]">
              Fitbit Web API scopes Google maps to {t.dataType}’s scopes:{" "}
              {t.fitbitScopes.map((s, i) => (
                <span key={s}>
                  {i > 0 ? ", " : ""}
                  <Code>{s}</Code>
                </span>
              ))}
              .
            </p>
          )}
          <p className="mt-3 text-sm">
            <Link href={GHAPI_PATHS.mapping} className={LINK}>
              Google’s full Fitbit Web API mapping tables
            </Link>
            {" · "}
            <Link href="/migrate/fitbit-web-api-to-google-health" className={LINK}>
              the migration playbook
            </Link>
          </p>
        </section>

        {mentions.length > 0 && (
          <section id="guides" className="mt-14 scroll-mt-24">
            <h2 className={H2}>Where Google’s guides name {t.dataType}</h2>
            <ul className="mt-4 space-y-3 text-[var(--muted)]">
              {mentions.map((m, i) => (
                <li key={i} className="border-l-4 border-brand-400/60 pl-4">
                  “<Inline text={m.text} />”
                  <span className="mt-1 block text-xs">
                    {SOURCE_LABEL[m.source]}
                    {m.section ? `, “${m.section}”` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {t.flags.length > 0 && (
          <section id="flags" className="mt-14 scroll-mt-24">
            <h2 className={H2}>Where Google’s pages disagree</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Published as found, with the texts that disagree; nothing here is corrected by us.
            </p>
            <FlagList flags={t.flags} />
          </section>
        )}

        {t.compatibleDevices.length > 0 && (
          <section id="devices" className="mt-14 scroll-mt-24">
            <h2 className={H2}>Compatible devices</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              The {t.compatibleDevices.length} devices Google’s table lists as able to record and sync {t.dataType}.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {t.compatibleDevices.map((d) => (
                <li key={d.name} className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)]">
                  {d.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14">
          <h2 className={H2}>Google’s documentation</h2>
          <ul className="mt-3 space-y-1 text-[var(--muted)]">
            {t.referenceUrl && (
              <li>
                <a href={t.referenceUrl} className={LINK} rel="noopener">
                  {t.name} in the {t.channel} REST reference
                </a>
              </li>
            )}
            {t.guides.map((g) => (
              <li key={g.url}>
                <a href={g.url} className={LINK} rel="noopener">
                  Google’s {g.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Related on this site</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {metric && (
              <li>
                <Link href={metric.href} className={LINK}>
                  {metric.label}
                </Link>{" "}
                <span className="text-[var(--muted)]">— the metric across platforms and vendors</span>
              </li>
            )}
            {t.webhookSupport && (
              <li>
                <Link href={GHAPI_PATHS.webhooks} className={LINK}>
                  Google Health API webhooks
                </Link>
              </li>
            )}
            <li>
              <Link href={GHAPI_PATHS.access} className={LINK}>
                Verification and rate limits
              </Link>
            </li>
            <li>
              <Link href="/fitbit-api-shutdown" className={LINK}>
                The Fitbit Web API turn-off
              </Link>
            </li>
          </ul>
        </section>

        <FaqSection faqs={faqs} />

        {siblings.length > 0 && (
          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Other {familyLabel(family).toLowerCase()} data types
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {siblings.map((o) => (
                <li key={o.dataType}>
                  <Link
                    href={typePath(o)}
                    className="inline-block rounded-full border border-[var(--border)] px-3 py-1 font-mono text-[13px] text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
                  >
                    {o.dataType}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              <Link href={`${GHAPI_BASE}#${familyAnchor(family)}`} className={LINK}>
                All {familyLabel(family).toLowerCase()} data types →
              </Link>
            </p>
          </section>
        )}

        <ClusterCta
          pitch="These pages are generated from Google's own documentation by a script, not typed by hand. Subscribe to hear when a Google Health API data type gains a field, an operation or a scope."
          source="spoke-inline"
          id={`cta-ghapi-${t.dataType}`}
        />

        <SourcesChecked keys={[...sourceKeys]} />

        {(prev || next) && (
          <nav aria-label="More Google Health API data types" className="mt-10 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={typePath(prev)}
                className="group rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-xs uppercase tracking-wider text-[var(--muted)]">← Previous data type</span>
                <span className="mt-1 block break-all font-mono text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">
                  {prev.dataType}
                </span>
              </Link>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={typePath(next)}
                className="group rounded-xl border border-[var(--border)] p-4 text-right transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Next data type →</span>
                <span className="mt-1 block break-all font-mono text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">
                  {next.dataType}
                </span>
              </Link>
            )}
          </nav>
        )}

        <p className="mt-8 text-sm">
          <Link href={GHAPI_BASE} className={LINK}>
            ← All Google Health API data types
          </Link>
        </p>
      </div>
    </Container>
  );
}
