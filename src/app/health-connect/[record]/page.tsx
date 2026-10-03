import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import ContentAge from "@/components/ContentAge";
import CodeBlock from "@/components/CodeBlock";
import {
  HC_DATA_TYPES_URL,
  HC_FETCHED_ON,
  HC_FW_PERMISSIONS_URL,
  HC_FRAMEWORK_PERMISSIONS,
  HC_JETPACK_PERMISSION_CONSTANTS,
  type HcRecord,
} from "@/data/healthConnectRecords";
import {
  HC_BASE,
  HC_PERMISSIONS_PATH,
  HC_AGGREGATES_PATH,
  HC_PUBLISHED,
  hcModified,
  orderedRecords,
  recordsInCategory,
  getRecord,
  recordPath,
  recordTitle,
  recordH1,
  recordDescription,
  recordCapsule,
  readSnippet,
  aggregateSnippet,
  manifestSnippet,
  permissionHelperSnippet,
  hkCounterpart,
  sharedPermissionDetail,
  recordFaqs,
  shortPermission,
  shortAvailability,
  aggregateAnchor,
  permissionAnchor,
  categorySlug,
  GUIDE_QUOTES,
  READ_DATA_GUIDE,
} from "@/data/hcPages";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";

/**
 * One page per Health Connect record class — the query is the class name
 * ("StepsRecord", "SleepSessionRecord"), so the class name leads the title,
 * the H1 and the capsule.
 *
 * Every table on the page is the generated dataset (healthConnectRecords.ts)
 * rendered as-is: Google's description and field text quoted verbatim, the
 * permission strings exactly as Google's data-types table prints them, and a
 * visible flag where that table and the permission reference disagree. The
 * HealthKit counterpart comes only from the verified matrix; no pairing is
 * inferred from names.
 *
 * No markdown mirror exists for this section, so no text/markdown alternate.
 */

export const dynamicParams = false;

type Params = { record: string };

const PROSE =
  "prose prose-neutral max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500";

export function generateStaticParams(): Params[] {
  return orderedRecords().map((r) => ({ record: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { record } = await params;
  const r = getRecord(record);
  if (!r) return {};
  const canonical = recordPath(r);
  const title = recordTitle(r);
  const description = recordDescription(r);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      publishedTime: HC_PUBLISHED,
      modifiedTime: hcModified(),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Strings the permission references DO define that differ from an
 *  unresolved one by a trailing S — read from the data, not assumed. */
function near(permission: string): { value: string; where: string | null }[] {
  const out: { value: string; where: string | null }[] = [];
  for (const cand of [`${permission}S`, permission.replace(/S$/, "")]) {
    if (cand === permission) continue;
    const fw = HC_FRAMEWORK_PERMISSIONS.find((p) => p.value === cand);
    const jp = HC_JETPACK_PERMISSION_CONSTANTS.find((c) => c.value === cand);
    if (fw || jp) {
      out.push({
        value: cand,
        where: [fw ? `framework ${fw.constant}` : null, jp ? `Jetpack ${jp.constant}` : null].filter(Boolean).join("; ") || null,
      });
    }
  }
  return out;
}

function Code({ children }: { children: string }) {
  return <code className="break-all font-mono text-[13px] text-[var(--fg)]">{children}</code>;
}

function Snippet({ code, label }: { code: string; label: string }) {
  return (
    <figure className="mt-4">
      <figcaption className="mb-2 text-xs uppercase tracking-wide text-[var(--muted)]">{label}</figcaption>
      <CodeBlock raw={code}>
        <pre className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[13px] leading-relaxed">
          <code>{code}</code>
        </pre>
      </CodeBlock>
    </figure>
  );
}

function Facts({ r }: { r: HcRecord }) {
  const rows: [string, React.ReactNode][] = [
    ["Class", <Code key="c">{r.qualifiedName}</Code>],
    ["Google's category", r.category ?? "not stated"],
    ["Record type", r.recordShape ?? "not stated"],
    [
      "Unit class",
      r.unitClass ? <Code key="u">{`androidx.health.connect.client.units.${r.unitClass}`}</Code> : "none named in Google's table",
    ],
    [
      "Mandatory fields",
      <span key="m" className="flex flex-wrap gap-1.5">
        {r.mandatoryFields.map((f) => (
          <Code key={f}>{f}</Code>
        ))}
      </span>,
    ],
    ["Added in (Jetpack)", r.addedIn ? <Code key="a">{r.addedIn}</Code> : "not stated"],
  ];
  if (r.featureFlag) rows.push(["Feature flag", <Code key="f">{r.featureFlag}</Code>]);
  if (r.sharedRowWith.length)
    rows.push([
      "Same table row as",
      <span key="s" className="flex flex-wrap gap-2">
        {r.sharedRowWith.map((c) => {
          const o = orderedRecords().find((x) => x.className === c);
          return o ? (
            <Link key={c} href={recordPath(o)} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">
              {c}
            </Link>
          ) : (
            <Code key={c}>{c}</Code>
          );
        })}
      </span>,
    ]);
  return (
    <dl className="mt-4 grid gap-x-6 gap-y-3 rounded-2xl border border-[var(--border)] p-5 text-sm sm:grid-cols-[12rem_1fr]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-semibold text-[var(--fg)]">{k}</dt>
          <dd className="text-[var(--muted)]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function HcRecordPage({ params }: { params: Promise<Params> }) {
  const { record } = await params;
  const r = getRecord(record);
  if (!r) notFound();

  const path = recordPath(r);
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  const articleId = `${url}#article`;
  const h1 = recordH1(r);
  const title = recordTitle(r);
  const description = recordDescription(r);
  const capsule = recordCapsule(r);
  const faqs = recordFaqs(r);
  const faqId = (i: number) => `faq-${i + 1}`;
  const hk = hkCounterpart(r);
  const shared = sharedPermissionDetail(r);
  const unresolved = r.permissionCheck.filter((c) => !c.inFrameworkReference && !c.inJetpackConstants);
  const related = recordsInCategory(r.category ?? "").filter((o) => o.className !== r.className);
  const all = orderedRecords();
  const at = all.findIndex((o) => o.className === r.className);
  const prev = at > 0 ? all[at - 1] : null;
  const next = at >= 0 ? (all[at + 1] ?? null) : null;
  const agg = aggregateSnippet(r);

  const sources = [
    { name: `Google — ${r.className} (Jetpack reference)`, url: r.sourceUrl, note: r.sourceUpdated ? `last updated ${r.sourceUpdated}` : null },
    { name: "Google — Health Connect data types", url: HC_DATA_TYPES_URL, note: null },
    { name: "Google — HealthPermissions (framework reference)", url: HC_FW_PERMISSIONS_URL, note: null },
    { name: "Google — Read raw data (Health Connect guide)", url: READ_DATA_GUIDE, note: null },
  ];

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": articleId,
        headline: h1,
        alternativeHeadline: r.className,
        description,
        datePublished: HC_PUBLISHED,
        dateModified: hcModified(),
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "Health Connect reference",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        about: { "@type": "Thing", name: r.qualifiedName, sameAs: r.sourceUrl },
        citation: sources.map((s) => ({ "@type": "TechArticle", url: s.url, name: s.name })),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: HC_FETCHED_ON,
        reviewedBy: orgRef(),
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#${faqId(i)}`,
      url: `${url}#${faqId(i)}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#${faqId(i)}` },
    })),
  };

  const toc: [string, string][] = [
    ["#google", "Google's description"],
    ["#permissions", "Permissions"],
    ["#fields", "Fields"],
    ...(r.aggregateMetrics.length ? ([["#aggregate", "Aggregate metrics"]] as [string, string][]) : []),
    ...(r.constants.length ? ([["#constants", "Constants"]] as [string, string][]) : []),
    ["#kotlin", "Kotlin"],
    ["#healthkit", "HealthKit"],
    ["#faq", "Questions"],
  ];

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-4xl" data-hc-record={r.className}>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Health Connect", path: HC_BASE },
            { name: r.className, path },
          ]}
        />

        <ClusterHero label="Health Connect reference" seed={stringSeed(r.slug)} />

        <h1 className="break-words text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {h1}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Read from Google&rsquo;s documentation on {HC_FETCHED_ON}
          <ContentAge date={HC_FETCHED_ON} />
          {r.sourceUpdated && <> · Google&rsquo;s reference page last updated {r.sourceUpdated}</>}
        </p>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
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

        <section id="google" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What Google says {r.className} is</h2>
          <blockquote className="mt-4 border-l-4 border-brand-400/60 pl-5 text-[var(--fg)]">
            {r.description.map((p, i) => (
              <p key={i} className="mt-2 leading-relaxed first:mt-0">
                {p}
              </p>
            ))}
          </blockquote>
          {r.googleExample && r.description.some((p) => p.trim().endsWith(":")) && (
            <p className="mt-2 text-sm text-[var(--muted)]">
              Google&rsquo;s example is reproduced under{" "}
              <a href="#google-example" className="text-brand-600 hover:text-brand-500">
                Read {r.className} in Kotlin
              </a>
              .
            </p>
          )}
          <p className="mt-3 text-sm text-[var(--muted)]">
            Quoted from Google&rsquo;s{" "}
            <a href={r.sourceUrl} className="font-medium text-brand-600 hover:text-brand-500" rel="noopener">
              {r.className} Jetpack reference
            </a>
            {r.sourceUpdated ? <>, last updated {r.sourceUpdated}</> : null}, read {HC_FETCHED_ON}.
          </p>
          <Facts r={r} />
        </section>

        <section id="permissions" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Permissions</h2>
          <p className="mt-2 text-[var(--muted)]">
            The exact strings Google&rsquo;s data-types table declares for {r.className}. Google&rsquo;s page:
            &ldquo;{GUIDE_QUOTES.declareFirst.text}&rdquo;
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th scope="col" className="py-2 pr-4 font-semibold">Access</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Permission string</th>
                  <th scope="col" className="py-2 font-semibold">Framework reference</th>
                </tr>
              </thead>
              <tbody>
                {r.permissionCheck.map((c) => (
                  <tr key={c.permission} className="border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4 text-[var(--muted)]">{/\.READ_/.test(c.permission) ? "Read" : "Write"}</td>
                    <td className="py-2 pr-4">
                      <Link
                        href={`${HC_PERMISSIONS_PATH}#${permissionAnchor(c.permission)}`}
                        className="break-all font-mono text-[13px] text-brand-600 hover:text-brand-500"
                      >
                        {c.permission}
                      </Link>
                    </td>
                    <td className="py-2 text-xs text-[var(--muted)]">
                      {c.inFrameworkReference
                        ? (shortAvailability(c.frameworkAdded) ?? "defined")
                        : "not defined in the reference — see below"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {unresolved.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm text-[var(--fg)]">
              <p className="font-semibold">Google&rsquo;s pages disagree on a string here.</p>
              {unresolved.map((u) => (
                <p key={u.permission} className="mt-1">
                  The data-types table prints <Code>{u.permission}</Code>, but neither the framework{" "}
                  <Code>HealthPermissions</Code> reference nor a Jetpack <Code>HealthPermission</Code> constant defines
                  that string.
                  {near(u.permission).length > 0 && (
                    <>
                      {" "}
                      The references define{" "}
                      {near(u.permission).map((n, i) => (
                        <span key={n.value}>
                          {i > 0 ? " and " : ""}
                          <Code>{n.value}</Code>
                          {n.where ? ` (${n.where})` : ""}
                        </span>
                      ))}{" "}
                      instead. Copy the string the permission references define.
                    </>
                  )}
                </p>
              ))}
            </div>
          )}
          {shared.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-[var(--muted)]">
              {shared.map((x) => (
                <li key={x.record.className}>
                  {x.strings.map((p, i) => (
                    <span key={p}>
                      {i > 0 ? " and " : ""}
                      <Code>{shortPermission(p)}</Code>
                    </span>
                  ))}{" "}
                  {x.strings.length > 1 ? "are" : "is"} also declared for{" "}
                  <Link href={recordPath(x.record)} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">
                    {x.record.className}
                  </Link>{" "}
                  in Google&rsquo;s table.
                </li>
              ))}
            </ul>
          )}
          <Snippet code={manifestSnippet(r)} label="AndroidManifest.xml" />
          <Snippet code={permissionHelperSnippet(r)} label="Kotlin — the same strings from the Jetpack helper" />
        </section>

        <section id="fields" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            The {r.properties.length} fields of {r.className}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Types and descriptions as Google&rsquo;s reference prints them. The range column quotes Google&rsquo;s own
            range annotation or sentence; a dash means Google states none, which is not the same as no validation.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th scope="col" className="py-2 pr-4 font-semibold">Field</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Type</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Allowed range</th>
                  <th scope="col" className="py-2 font-semibold">Google&rsquo;s description</th>
                </tr>
              </thead>
              <tbody>
                {r.properties.map((p) => (
                  <tr key={p.name} id={`field-${p.name.toLowerCase()}`} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4">
                      <Code>{p.name}</Code>
                      {r.mandatoryFields.includes(p.name) && (
                        <span className="ml-2 rounded-full border border-[var(--border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                          mandatory
                        </span>
                      )}
                      {p.constructorDefault && (
                        <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">= {p.constructorDefault}</span>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      <Code>{p.type}</Code>
                    </td>
                    <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                      {p.range ? <Code>{p.range.annotation}</Code> : null}
                      {p.rangeStatement ? <span className={p.range ? "mt-1 block" : ""}>{p.rangeStatement}</span> : null}
                      {!p.range && !p.rangeStatement ? "—" : null}
                    </td>
                    <td className="py-2 text-[var(--muted)]">
                      {p.description ?? <em>Google gives no description.</em>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {r.nestedTypes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">Nested types</h3>
              <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
                {r.nestedTypes.map((n) => (
                  <li key={n.name}>
                    <Code>{n.name}</Code>
                    {n.description ? <> — {n.description}</> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {r.aggregateMetrics.length > 0 && (
          <section id="aggregate" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Aggregate metrics</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              The <Code>AggregateMetric</Code> constants Google defines on {r.className}. The value type is the{" "}
              <Code>T</Code> in Google&rsquo;s <Code>{"AggregateMetric<T>"}</Code> signature.{" "}
              <Link href={HC_AGGREGATES_PATH} className="font-medium text-brand-600 hover:text-brand-500">
                Every aggregate metric across all records
              </Link>
              .
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                    <th scope="col" className="py-2 pr-4 font-semibold">Metric</th>
                    <th scope="col" className="py-2 pr-4 font-semibold">Value type</th>
                    <th scope="col" className="py-2 font-semibold">Google&rsquo;s description</th>
                  </tr>
                </thead>
                <tbody>
                  {r.aggregateMetrics.map((a) => (
                    <tr key={a.name} className="border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4">
                        <Link
                          href={`${HC_AGGREGATES_PATH}#${aggregateAnchor(r.className, a.name)}`}
                          className="break-all font-mono text-[13px] text-brand-600 hover:text-brand-500"
                        >
                          {r.className}.{a.name}
                        </Link>
                      </td>
                      <td className="py-2 pr-4">
                        <Code>{a.valueType}</Code>
                      </td>
                      <td className="py-2 text-[var(--muted)]">{a.description ?? <em>Google gives no description.</em>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Google&rsquo;s read-data guide: &ldquo;{GUIDE_QUOTES.aggregateOverRead.text}&rdquo; and &ldquo;
              {GUIDE_QUOTES.dedup.text}&rdquo;
            </p>
          </section>
        )}

        {r.constants.length > 0 && (
          <section id="constants" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Constants</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              The {r.constants.length} <Code>const val</Code> values Google&rsquo;s reference lists on {r.className}, with
              the integer each maps to.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                    <th scope="col" className="py-2 pr-4 font-semibold">Constant</th>
                    <th scope="col" className="py-2 pr-4 font-semibold">Value</th>
                    <th scope="col" className="py-2 font-semibold">Google&rsquo;s description</th>
                  </tr>
                </thead>
                <tbody>
                  {r.constants.map((c) => (
                    <tr key={c.name} className="border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4">
                        <Code>{`${r.className}.${c.name}`}</Code>
                      </td>
                      <td className="py-2 pr-4 tabular-nums">
                        <Code>{c.value ?? "—"}</Code>
                      </td>
                      <td className="py-2 text-[var(--muted)]">{c.description ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section id="kotlin" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Read {r.className} in Kotlin</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            The shape of Google&rsquo;s own read example, with {r.className} and its names filled in. Get the client with{" "}
            <Code>HealthConnectClient.getOrCreate(context)</Code> after checking <Code>getSdkStatus</Code>.
          </p>
          <Snippet code={readSnippet(r)} label="readRecords" />
          {agg && <Snippet code={agg} label="aggregate" />}
          {r.googleExample && (
            <div id="google-example" className="scroll-mt-24">
              <Snippet code={r.googleExample} label={`Google's example from the ${r.className} reference`} />
              <p className="mt-2 text-xs text-[var(--muted)]">
                Reproduced from{" "}
                <a href={r.sourceUrl} className="text-brand-600 hover:text-brand-500" rel="noopener">
                  Google&rsquo;s reference page
                </a>{" "}
, whose footer states its content and code samples are subject to the licenses described in Google&rsquo;s Content
                License.
              </p>
            </div>
          )}
          <p className="mt-4 text-sm text-[var(--muted)]">
            Setting up the client, the permission flow and Play Console declaration:{" "}
            <Link href="/integrate/google-health-connect" className="font-medium text-brand-600 hover:text-brand-500">
              integrating Health Connect step by step
            </Link>
            .
          </p>
        </section>

        <section id="healthkit" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">HealthKit counterpart</h2>
          {hk ? (
            <div className="mt-3 text-[var(--muted)]">
              <p>
                {hk.oneToOne ? (
                  <>
                    The{" "}
                    <Link href="/matrix" className="font-medium text-brand-600 hover:text-brand-500">
                      verified cross-platform matrix
                    </Link>{" "}
                    pairs {r.className} with <Code>{hk.row.apple}</Code> in its{" "}
                    <strong className="text-[var(--fg)]">{hk.row.label}</strong> row.
                  </>
                ) : (
                  <>
                    {r.className} sits in the{" "}
                    <Link href="/matrix" className="font-medium text-brand-600 hover:text-brand-500">
                      verified cross-platform matrix
                    </Link>
                    &rsquo;s <strong className="text-[var(--fg)]">{hk.row.label}</strong> row, which groups{" "}
                    <Code>{hk.row.apple}</Code> on Apple with <Code>{hk.row.android}</Code> on Android. The row groups the
                    metric; it does not pair each Android record with one Apple type.
                  </>
                )}
              </p>
              {hk.identifiers.length > 0 && (
                <p className="mt-2">
                  {hk.oneToOne ? "On the HealthKit reference: " : "The Apple types in that row on the HealthKit reference: "}
                  {hk.identifiers.map((id, i) => (
                    <span key={id.case}>
                      {i > 0 ? ", " : ""}
                      <Link href={id.href} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">
                        {id.case}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              )}
              {hk.row.watchOut && (
                <p className="mt-3 rounded-xl border border-[var(--border)] p-4 text-sm">
                  <strong className="text-[var(--fg)]">Watch out:</strong> {hk.row.watchOut}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-[var(--muted)]">
              No verified HealthKit counterpart. The{" "}
              <Link href="/matrix" className="font-medium text-brand-600 hover:text-brand-500">
                cross-platform matrix
              </Link>{" "}
              only pairs metrics checked against both Apple&rsquo;s and Google&rsquo;s documentation, and {r.className} is not
              among them yet. A similarly named Apple type may exist on the{" "}
              <Link href="/healthkit" className="font-medium text-brand-600 hover:text-brand-500">
                HealthKit reference
              </Link>
              , but a name match is not a verified mapping.
            </p>
          )}
        </section>

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {faqs.map((f, i) => (
              <div key={f.q} id={faqId(i)} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Other {r.category} records
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {related.map((o) => (
                <li key={o.className}>
                  <Link
                    href={recordPath(o)}
                    className="inline-block rounded-full border border-[var(--border)] px-3 py-1 font-mono text-[13px] text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
                  >
                    {o.className}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              <Link href={`${HC_BASE}#${categorySlug(r.category ?? "")}`} className="text-brand-600 hover:text-brand-500">
                All {r.category} records →
              </Link>
            </p>
          </section>
        )}

        <ClusterCta
          pitch="These pages are generated from Google's reference, which carries its own last-updated date per class. Subscribe to hear when a record gains a field, a permission or an aggregate metric."
          source="spoke-inline"
          id={`cta-hc-${r.slug}`}
        />

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Sources checked</h2>
          <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} className="text-brand-600 hover:text-brand-500" rel="noopener">
                  {s.name}
                </a>
                {s.note ? ` — ${s.note}` : ""} · read {HC_FETCHED_ON}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Google&rsquo;s descriptions are quoted for identification; the page layout, the capsule and the cross-platform
            pairing are {site.name}&rsquo;s. Generated from Google&rsquo;s pages by a script, not typed by hand — the same data
            is behind every page in the{" "}
            <Link href={HC_BASE} className="font-medium text-brand-600 hover:text-brand-500">
              Health Connect reference
            </Link>
            .
          </p>
        </section>

        {(prev || next) && (
          <nav aria-label="More Health Connect records" className="mt-10 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={recordPath(prev)}
                className="group rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-xs uppercase tracking-wider text-[var(--muted)]">← Previous record</span>
                <span className="mt-1 block break-all font-mono text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">
                  {prev.className}
                </span>
              </Link>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={recordPath(next)}
                className="group rounded-xl border border-[var(--border)] p-4 text-right transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Next record →</span>
                <span className="mt-1 block break-all font-mono text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">
                  {next.className}
                </span>
              </Link>
            )}
          </nav>
        )}

        <p className="mt-8 text-sm">
          <Link href={HC_BASE} className="text-brand-600 hover:text-brand-500">
            ← All Health Connect records
          </Link>
          {" · "}
          <Link href={HC_PERMISSIONS_PATH} className="text-brand-600 hover:text-brand-500">
            Every permission string
          </Link>
        </p>
      </div>
    </Container>
  );
}
