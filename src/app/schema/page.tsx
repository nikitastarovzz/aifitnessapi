import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import {
  UNIFIED_RECORDS,
  UNIFIED_SCHEMA_FILES,
  UNIFIED_SCHEMA_ID,
  UNIFIED_SCHEMA_VERSION,
  UNIFIED_SLEEP_STAGE_MAPS,
  UNIFIED_STAGES,
  UNIFIED_TIME_FIELDS,
  UNIFIED_PAGE_READS,
  UNIFIED_SOURCES,
  type UsCell,
  type UsRecord,
} from "@/data/unifiedSchema";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import {
  CONVERTER_PATH,
  SCHEMA_DESCRIPTION,
  SCHEMA_FAQS,
  SCHEMA_PATH,
  SCHEMA_TITLE,
  US_PLATFORMS,
  UNIFIED_READ_ON,
  schemaCapsule,
  schemaCounts,
} from "@/lib/unifiedSchemaView";

/**
 * The unified health-data schema (ops/AUDIENCE-30-2026-11-05.md item 1).
 *
 * Every table on this page is rendered from src/data/unifiedSchema.ts, which
 * scripts/build-unified-schema.mjs generates from this site's HealthKit,
 * Health Connect, Google Health API, Wear OS and workout datasets; the page
 * types no platform name of its own. The downloadable files are the same
 * generator's output in public/schema/v1.
 */

export const metadata: Metadata = {
  title: SCHEMA_TITLE,
  description: SCHEMA_DESCRIPTION,
  alternates: pageMirrorAlternates(SCHEMA_PATH),
  openGraph: {
    type: "website",
    title: SCHEMA_TITLE,
    description: "A vendor-neutral health-data schema with every field mapped to HealthKit, Health Connect, the Google Health API and Wear OS, evidence quoted. CC BY 4.0.",
    url: SCHEMA_PATH,
    images: ["/opengraph-image"],
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const code = "font-mono text-[0.85em]";
const anchor = (id: string) => `record-${id}`;

function Cell({ c }: { c: UsCell }) {
  if (c.status !== "mapped") {
    return (
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">Not mapped</span>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{c.reason}</p>
      </div>
    );
  }
  return (
    <div>
      <code className={`${code} break-words text-[var(--fg)]`}>{c.field}</code>
      {c.platformType && <div className="mt-0.5 text-xs text-[var(--muted)]">{c.platformType}</div>}
      {c.conversion && <div className="mt-1 text-xs font-medium text-[var(--fg)]">{c.conversion}</div>}
      {c.evidence && (
        <details className="mt-1 text-xs text-[var(--muted)]">
          <summary className="cursor-pointer">Source</summary>
          <q className="mt-1 block">{c.evidence.quote}</q>
          <a href={c.evidence.url} className={linkCls} rel="noopener">
            {new URL(c.evidence.url).hostname}
          </a>
        </details>
      )}
    </div>
  );
}

function RecordTable({ r }: { r: UsRecord }) {
  const time = r.shape === "sample" ? UNIFIED_TIME_FIELDS.sample : UNIFIED_TIME_FIELDS.interval;
  const fields = [...time.map((f) => ({ name: f.name, type: f.type, required: f.required, description: f.description, unit: undefined as string | undefined })), ...r.valueFields];
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
        <thead className="bg-[var(--surface)] text-xs uppercase tracking-wide text-[var(--muted)]">
          <tr>
            <th scope="col" className="w-48 p-3">Unified field</th>
            {US_PLATFORMS.map((p) => {
              const t = r.platforms[p.key].type;
              return (
                <th key={p.key} scope="col" className="p-3 align-top normal-case tracking-normal">
                  <div className="text-xs font-semibold uppercase tracking-wide">{p.label}</div>
                  {t.status === "mapped" ? (
                    t.href ? (
                      <Link href={t.href} className={`${linkCls} ${code}`}>
                        {t.type}
                      </Link>
                    ) : (
                      <code className={code}>{t.type}</code>
                    )
                  ) : (
                    <span className="text-xs font-normal text-amber-700 dark:text-amber-400">No type</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.name} className="border-t border-[var(--border)] align-top">
              <th scope="row" className="p-3 font-normal">
                <code className={`${code} font-semibold text-[var(--fg)]`}>{f.name}</code>
                <div className="mt-0.5 text-xs text-[var(--muted)]">
                  {Array.isArray(f.type) ? f.type.join(" | ") : f.type}
                  {f.unit ? ` · ${f.unit}` : ""}
                  {f.required ? "" : " · optional"}
                </div>
              </th>
              {US_PLATFORMS.map((p) => (
                <td key={p.key} className="p-3">
                  <Cell c={r.platforms[p.key].fields[f.name]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SchemaPage() {
  const counts = schemaCounts();
  const url = absoluteUrl(SCHEMA_PATH);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        "@id": `${url}#dataset`,
        name: "Unified health-data schema",
        description: schemaCapsule(),
        url,
        version: UNIFIED_SCHEMA_VERSION,
        license: "https://creativecommons.org/licenses/by/4.0/",
        isAccessibleForFree: true,
        creator: orgRef(),
        publisher: orgRef(),
        dateModified: UNIFIED_READ_ON,
        distribution: [
          { "@type": "DataDownload", encodingFormat: "application/schema+json", contentUrl: absoluteUrl(UNIFIED_SCHEMA_FILES.schema) },
          { "@type": "DataDownload", encodingFormat: "application/typescript", contentUrl: absoluteUrl(UNIFIED_SCHEMA_FILES.types) },
          { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: absoluteUrl(UNIFIED_SCHEMA_FILES.mappings) },
        ],
      },
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: "Unified health-data schema",
        description: SCHEMA_DESCRIPTION,
        url,
        dateModified: UNIFIED_READ_ON,
        author: orgRef(),
        publisher: orgRef(),
        mainEntityOfPage: { "@id": `${url}#webpage` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: SCHEMA_TITLE,
        lastReviewed: UNIFIED_READ_ON,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: SCHEMA_FAQS.map((f, i) => ({
          "@type": "Question",
          name: f.q,
          url: `${url}#faq-${i + 1}`,
          acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
        })),
      },
    ],
  };

  const notMapped = UNIFIED_RECORDS.flatMap((r) =>
    US_PLATFORMS.flatMap((p) =>
      r.platforms[p.key].type.status === "mapped"
        ? []
        : [{ record: r.title, platform: p.label, reason: r.platforms[p.key].type.reason ?? "" }],
    ),
  );
  const conversions = UNIFIED_RECORDS.flatMap((r) =>
    US_PLATFORMS.flatMap((p) =>
      Object.entries(r.platforms[p.key].fields)
        .filter(([, c]) => c.status === "mapped" && c.factor !== null)
        .map(([f, c]) => ({ record: r.title, platform: p.label, field: f, from: c.field, factor: c.factor!, rule: c.conversion, evidence: c.evidence })),
    ),
  );
  const extraUnmapped = UNIFIED_RECORDS.flatMap((r) =>
    US_PLATFORMS.flatMap((p) => (r.platforms[p.key].unmappedFields ?? []).map((u) => ({ record: r.title, platform: p.label, ...u }))),
  );

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Datasets", path: "/datasets" },
            { name: "Unified schema", path: SCHEMA_PATH },
          ]}
        />
        <ClusterHero label="Open Schema" seed={7} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Unified health-data schema: one shape for four platforms
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {schemaCapsule()}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a href={UNIFIED_SCHEMA_FILES.schema} className="rounded-lg border border-[var(--border)] px-3 py-2 font-medium text-[var(--fg)] hover:border-brand-500" data-cta="schema-json">
            JSON Schema (draft 2020-12)
          </a>
          <a href={UNIFIED_SCHEMA_FILES.types} className="rounded-lg border border-[var(--border)] px-3 py-2 font-medium text-[var(--fg)] hover:border-brand-500" data-cta="schema-dts">
            TypeScript types (.d.ts)
          </a>
          <a href={UNIFIED_SCHEMA_FILES.mappings} className="rounded-lg border border-[var(--border)] px-3 py-2 font-medium text-[var(--fg)] hover:border-brand-500" data-cta="schema-mappings">
            Mappings with evidence (JSON)
          </a>
          <Link href={CONVERTER_PATH} className="rounded-lg bg-brand-600 px-3 py-2 font-medium text-white hover:bg-brand-500">
            Try the converter
          </Link>
        </div>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Version {UNIFIED_SCHEMA_VERSION}. <code className={code}>$id</code>: <code className={`${code} break-all`}>{UNIFIED_SCHEMA_ID}</code>. Licensed CC BY 4.0, like the{" "}
          <Link href="/datasets" className={linkCls}>
            open datasets
          </Link>
          : attribute aifitnessapi.com. A later version gets a new path; v1 stays where it is.
        </p>

        <nav aria-label="Records" className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">The {counts.records} records</h2>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            {UNIFIED_RECORDS.map((r) => (
              <li key={r.id}>
                <a href={`#${anchor(r.id)}`} className={linkCls}>
                  {r.title}
                </a>{" "}
                <code className={`${code} text-[var(--muted)]`}>{r.id}</code>
              </li>
            ))}
          </ul>
        </nav>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How to read the tables</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              Every record has a <code className={code}>type</code> and a <code className={code}>source</code> (<code className={code}>platform</code>,{" "}
              <code className={code}>nativeType</code>, optional <code className={code}>sourceName</code>), then its time fields and its values. Instants are RFC
              3339 in UTC; offsets are ±HH:MM or null, never guessed.
            </li>
            <li>
              A mapped cell names the platform field, its declared type, any conversion, and a <em>Source</em> with the platform’s own sentence. A{" "}
              <strong className="text-[var(--fg)]">Not mapped</strong> cell says why. Counts: HealthKit {counts.perPlatform.healthkit.mapped} mapped /{" "}
              {counts.perPlatform.healthkit.notMapped} not; Health Connect {counts.perPlatform["health-connect"].mapped} /{" "}
              {counts.perPlatform["health-connect"].notMapped}; Google Health API {counts.perPlatform["google-health-api"].mapped} /{" "}
              {counts.perPlatform["google-health-api"].notMapped}; Wear OS {counts.perPlatform["wear-os"].mapped} /{" "}
              {counts.perPlatform["wear-os"].notMapped}.
            </li>
            <li>
              HealthKit and Health Connect are native APIs with no JSON wire format. Their columns name API properties; the{" "}
              <Link href={CONVERTER_PATH} className={linkCls}>
                converter
              </Link>{" "}
              reads them in the encodings this site documents (export.xml rows, and{" "}
              <Link href="/tools/sample-data" className={linkCls}>
                the synthetic data generator’s
              </Link>{" "}
              JSON).
            </li>
          </ul>
        </section>

        {UNIFIED_RECORDS.map((r) => (
          <section key={r.id} id={anchor(r.id)} className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              {r.title} <code className={`${code} text-base font-normal text-[var(--muted)]`}>type: &quot;{r.id}&quot;</code>
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              {r.description} Shape: {r.shape === "sample" ? "one instant" : r.shape === "interval" ? "an interval" : "a session (an interval with contents)"}.
            </p>
            <RecordTable r={r} />
            {(r.notes.length > 0 || extraUnmapped.some((u) => u.record === r.title)) && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)]">
                {r.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
                {extraUnmapped
                  .filter((u) => u.record === r.title)
                  .map((u) => (
                    <li key={u.field}>
                      <code className={code}>{u.field}</code> ({u.platform}): {u.reason}
                    </li>
                  ))}
              </ul>
            )}
            {r.id === "sleepSession" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[var(--fg)]">Sleep stages: {UNIFIED_STAGES.length} unified values</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Each platform value maps to exactly one unified stage, with the platform’s own description beside it. The unified vocabulary:{" "}
                  {UNIFIED_STAGES.map((s, i) => (
                    <span key={s}>
                      <code className={code}>{s}</code>
                      {i < UNIFIED_STAGES.length - 1 ? ", " : "."}
                    </span>
                  ))}
                </p>
                <div className="mt-3 grid gap-4 lg:grid-cols-3">
                  {(["healthkit", "health-connect", "google-health-api"] as const).map((p) => (
                    <div key={p} className="overflow-x-auto rounded-xl border border-[var(--border)]">
                      <table className="w-full border-collapse text-left text-xs">
                        <caption className="bg-[var(--surface)] p-2 text-left font-semibold text-[var(--fg)]">{US_PLATFORMS.find((x) => x.key === p)!.label}</caption>
                        <thead className="text-[var(--muted)]">
                          <tr>
                            <th scope="col" className="p-2">Value</th>
                            <th scope="col" className="p-2">Unified</th>
                            <th scope="col" className="p-2">Platform says</th>
                          </tr>
                        </thead>
                        <tbody>
                          {UNIFIED_SLEEP_STAGE_MAPS[p].map((s) => (
                            <tr key={String(s.value)} className="border-t border-[var(--border)] align-top">
                              <td className="p-2">
                                <code className={`${code} break-all`}>{s.name ? `${s.name} (${s.value})` : String(s.value)}</code>
                              </td>
                              <td className="p-2">
                                <code className={code}>{s.unified}</code>
                              </td>
                              <td className="p-2 text-[var(--muted)]">
                                <q>{s.evidence}</q>
                                {s.note && <div className="mt-1 font-medium text-[var(--fg)]">{s.note}</div>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Unit conversions, each with its source</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            A factor appears only where a source states it, or where the platform’s field name states its unit and the factor is an SI prefix. Every
            other mapped value is already in the unified unit.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface)] text-xs uppercase tracking-wide text-[var(--muted)]">
                <tr>
                  <th scope="col" className="p-3">Record · platform</th>
                  <th scope="col" className="p-3">From</th>
                  <th scope="col" className="p-3">To</th>
                  <th scope="col" className="p-3">Factor and source</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((c) => (
                  <tr key={`${c.record}-${c.platform}-${c.field}`} className="border-t border-[var(--border)] align-top">
                    <td className="p-3 text-[var(--fg)]">
                      {c.record} · {c.platform}
                    </td>
                    <td className="p-3">
                      <code className={`${code} break-all`}>{c.from}</code>
                    </td>
                    <td className="p-3">
                      <code className={code}>{c.field}</code>
                    </td>
                    <td className="p-3 text-[var(--muted)]">
                      × {c.factor} — {c.rule}
                      {c.evidence && (
                        <div className="mt-1 text-xs">
                          <q>{c.evidence.quote}</q>{" "}
                          <a href={c.evidence.url} className={linkCls} rel="noopener">
                            source
                          </a>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Time: Health Connect writes offsets as a ZoneOffset (+HH:MM), the Google Health API as a google-duration in seconds (“7200s” is +02:00),
            and HealthKit samples carry no offset field at all. The converter also reads pounds and inches by the factors Google’s migration guide prints
            (453.59237 g, 25.4 mm), and refuses a unit it has no sourced factor for rather than assume one.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What is not mapped, and why</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            {notMapped.map((n) => (
              <li key={`${n.record}-${n.platform}`}>
                <strong className="text-[var(--fg)]">
                  {n.record} on {n.platform}.
                </strong>{" "}
                {n.reason}
              </li>
            ))}
            <li>
              <strong className="text-[var(--fg)]">Records outside v1.</strong> Resting heart rate, active energy, distance, nutrition and the rest of each
              platform’s catalog are not in this version; the converter reports them as unmapped instead of dropping them silently.
            </li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How it is generated</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The record shapes are this site’s design. Every platform name in a mapping is looked up in a generated dataset, and the generator stops when
            one is missing, so a renamed field fails the build instead of shipping a stale mapping. The datasets:{" "}
            {Object.values(UNIFIED_SOURCES).map((s, i, a) => (
              <span key={s.name}>
                {s.name} (read {s.readOn}){i < a.length - 1 ? ", " : "."}
              </span>
            ))}{" "}
            Facts the datasets do not hold were read from the vendors’ reference pages: {UNIFIED_PAGE_READS.length} pages, including Health
            Connect’s HeartRateRecord.Sample and SleepSessionRecord.Stage and Apple’s HKCategoryValueSleepAnalysis and HKUnit.percent()
            (read {UNIFIED_PAGE_READS[0]?.readOn}). The workout activity type uses the{" "}
            <Link href="/workout-types" className={linkCls}>
              workout-type crosswalk
            </Link>
            ’s key, and a shared key is a shared name, not a claim that two platforms mean the same activity.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-[var(--border)]">
            {SCHEMA_FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <h3 className="text-base font-semibold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-sm text-[var(--muted)]">
          From {site.name}. Related: the{" "}
          <Link href="/matrix" className={linkCls}>
            HealthKit ↔ Health Connect type reference
          </Link>
          ,{" "}
          <Link href="/architecture/normalize-wearable-data" className={linkCls}>
            normalizing wearable data
          </Link>
          ,{" "}
          <Link href="/tools/fitbit-to-google-health" className={linkCls}>
            Fitbit Web API → Google Health API map
          </Link>{" "}
          and the{" "}
          <Link href="/datasets" className={linkCls}>
            open datasets
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
