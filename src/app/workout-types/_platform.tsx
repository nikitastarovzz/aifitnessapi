import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import type { WtPlatformSlug } from "@/data/workoutTypes";
import {
  PLATFORM_ORDER,
  PLATFORM_REFERENCES,
  WT_BASE,
  WT_FALLBACKS,
  WT_FETCHED,
  WT_GHAPI_FIELDS,
  WT_GOOGLE_HEALTH_API,
  WT_HC_SEGMENT_RULE,
  WT_HC_SEGMENT_TYPES,
  WT_HC_UNIVERSAL_SEGMENTS,
  WT_HEALTHKIT,
  WT_HEALTH_CONNECT,
  WT_SOURCES,
  WT_WEAR_OS,
  WT_WEAR_OS_INTERNAL,
  activityLabel,
  activityPath,
  activityRows,
  constantId,
  flagsFor,
  healthkitGroupRow,
  intMismatches,
  listOf,
  platform,
  platformCapsule,
  platformDescription,
  platformFaqs,
  platformH1,
  platformPath,
  platformValueMismatches,
  plural,
  source,
  unmatchedOf,
} from "@/data/workoutTypePages";
import { absoluteUrl } from "@/lib/site";
import { FaqSection, JsonLd, articleGraph, faqGraph } from "../error-codes/_shared";
import { CAPSULE, Code, Counterparts, FlagList, H2, LINK, PILL, Qualified, SourceList, SourceText, TH } from "./_shared";

/**
 * One list page per platform: every constant of its enumeration with the
 * source's own name, number and wording, and the constants of the same name
 * on the other three platforms. Generated from src/data/workoutTypes.ts.
 */

const short = (s: string) => s.replace(/^EXERCISE_SEGMENT_TYPE_/, "");

function HealthKitTable() {
  return (
    <table className="w-full min-w-[56rem] border-collapse text-sm">
      <thead>
        <tr className="border-b border-[var(--border)] text-left">
          <th className={TH}>Case</th>
          <th className={TH}>Apple’s words</th>
          <th className={TH}>Available from</th>
          <th className="py-2 font-semibold text-[var(--fg)]">Same name on</th>
        </tr>
      </thead>
      <tbody>
        {WT_HEALTHKIT.map((h) => {
          const ios = h.platforms.find((p) => p.name === "iOS");
          const watch = h.platforms.find((p) => p.name === "watchOS");
          const row = healthkitGroupRow(h.case, h.group);
          return (
            <tr key={h.case} id={constantId(h.case)} className="scroll-mt-24 border-b border-[var(--border)] align-top">
              <td className="py-2 pr-4">
                <a href={h.docUrl} rel="nofollow" className="font-mono text-xs font-semibold text-[var(--fg)] hover:text-brand-600">
                  {h.case}
                </a>
                <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">{h.objc}</span>
                <span className="mt-0.5 block text-[11px] text-[var(--muted)]">{h.group}</span>
                {h.deprecated && (
                  <span className="mt-1 inline-block rounded-full border border-amber-400/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-amber-700 dark:text-amber-300">
                    deprecated
                  </span>
                )}
              </td>
              <td className="py-2 pr-4 text-xs leading-relaxed text-[var(--muted)]">
                <span className="text-[var(--fg)]">{h.abstract}</span>
                {h.discussion.map((d, i) => (
                  <span key={i} className="mt-1 block">
                    <SourceText text={d} />
                  </span>
                ))}
                {h.deprecation?.message && (
                  <span className="mt-1 block text-amber-700 dark:text-amber-300">
                    <SourceText text={h.deprecation.message} />
                  </span>
                )}
                {row && (
                  <Link href={row} className={`${LINK} mt-1 block`}>
                    On this site’s HealthKit pages
                  </Link>
                )}
              </td>
              <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                {ios ? `iOS ${ios.introducedAt ?? "?"}${ios.deprecatedAt ? `, deprecated ${ios.deprecatedAt}` : ""}` : "not on iOS"}
                {watch ? <span className="block">watchOS {watch.introducedAt ?? "?"}</span> : null}
              </td>
              <td className="py-2 text-xs">
                <Counterparts items={h.counterparts} rowKey={h.key} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function segmentCell(rule: (typeof WT_HEALTH_CONNECT)[number]["segments"]) {
  if (rule.rule === "any") return "Any segment type";
  if (rule.rule === "universal-only") return "Universal segments only";
  if (rule.via) return `${rule.segments.length} segment types (${rule.via})`;
  return rule.segments.map(short).join(", ");
}

function HealthConnectTable() {
  return (
    <table className="w-full min-w-[60rem] border-collapse text-sm">
      <thead>
        <tr className="border-b border-[var(--border)] text-left">
          <th className={TH}>Constant</th>
          <th className={TH}>Value</th>
          <th className={TH}>Platform API constant</th>
          <th className={TH}>Segments it accepts</th>
          <th className="py-2 font-semibold text-[var(--fg)]">Same name on</th>
        </tr>
      </thead>
      <tbody>
        {WT_HEALTH_CONNECT.map((c) => (
          <tr key={c.name} id={constantId(c.name)} className="scroll-mt-24 border-b border-[var(--border)] align-top">
            <td className="py-2 pr-4">
              <a href={c.docUrl} rel="nofollow" className="font-mono text-xs font-semibold text-[var(--fg)] hover:text-brand-600">
                {c.name}
              </a>
              {c.description && (
                <span className="mt-1 block text-xs leading-relaxed text-[var(--muted)]">
                  <SourceText text={c.description} />
                </span>
              )}
            </td>
            <td className="py-2 pr-4 font-mono text-xs tabular-nums text-[var(--fg)]">{c.value}</td>
            <td className="py-2 pr-4 text-xs text-[var(--muted)]">
              {c.platform ? (
                <>
                  <code className="break-all font-mono text-[var(--fg)]">{c.platform.name}</code> = {c.platform.value}
                  <span className="block">
                    API level {c.platform.apiLevel}
                    {c.platform.extension ? `, ${c.platform.extension}` : ""}
                  </span>
                  {c.platform.deprecationNote && (
                    <span className="mt-1 block text-amber-700 dark:text-amber-300">
                      <SourceText text={c.platform.deprecationNote} />
                    </span>
                  )}
                </>
              ) : (
                "None in IntDefMappings.kt"
              )}
            </td>
            <td className="py-2 pr-4 text-xs text-[var(--muted)]">{segmentCell(c.segments)}</td>
            <td className="py-2 text-xs">
              <Counterparts items={c.counterparts} rowKey={c.key} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function WearOsTable() {
  return (
    <table className="w-full min-w-[44rem] border-collapse text-sm">
      <thead>
        <tr className="border-b border-[var(--border)] text-left">
          <th className={TH}>Constant</th>
          <th className={TH}>Id</th>
          <th className={TH}>Google’s description</th>
          <th className="py-2 font-semibold text-[var(--fg)]">Same name on</th>
        </tr>
      </thead>
      <tbody>
        {WT_WEAR_OS.map((t) => (
          <tr key={t.name} id={constantId(t.name)} className="scroll-mt-24 border-b border-[var(--border)] align-top">
            <td className="py-2 pr-4">
              <a href={t.docUrl} rel="nofollow" className="font-mono text-xs font-semibold text-[var(--fg)] hover:text-brand-600">
                {t.name}
              </a>
            </td>
            <td className="py-2 pr-4 font-mono text-xs tabular-nums text-[var(--fg)]">{t.id ?? "–"}</td>
            <td className="py-2 pr-4 text-xs leading-relaxed text-[var(--muted)]">
              {t.description ? <SourceText text={t.description} /> : <span>None on the reference</span>}
            </td>
            <td className="py-2 text-xs">
              <Counterparts items={t.counterparts} rowKey={t.key} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GoogleHealthApiTable() {
  return (
    <table className="w-full min-w-[40rem] border-collapse text-sm">
      <thead>
        <tr className="border-b border-[var(--border)] text-left">
          <th className={TH}>Value</th>
          <th className={TH}>Google’s description</th>
          <th className="py-2 font-semibold text-[var(--fg)]">Same name on</th>
        </tr>
      </thead>
      <tbody>
        {WT_GOOGLE_HEALTH_API.map((g) => (
          <tr key={g.value} id={constantId(g.value)} className="scroll-mt-24 border-b border-[var(--border)] align-top">
            <td className="py-2 pr-4">
              <span className="font-mono text-xs font-semibold text-[var(--fg)]">{g.value}</span>
            </td>
            <td className="py-2 pr-4 text-xs text-[var(--muted)]">{g.description ?? "None in the discovery document"}</td>
            <td className="py-2 text-xs">
              <Counterparts items={g.counterparts} rowKey={g.key} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const TABLES: Record<WtPlatformSlug, () => React.ReactElement> = {
  healthkit: HealthKitTable,
  "health-connect": HealthConnectTable,
  "wear-os": WearOsTable,
  "google-health-api": GoogleHealthApiTable,
};

/** Apple's calorie sentences, grouped by exact wording, with the cases that carry each. */
function HealthKitNotes() {
  const groups = new Map<string, string[]>();
  for (const h of WT_HEALTHKIT) for (const d of h.discussion) if (/calori/i.test(d)) groups.set(d, [...(groups.get(d) ?? []), h.case]);
  const deprecated = WT_HEALTHKIT.filter((h) => h.deprecated);
  return (
    <>
      {groups.size > 0 && (
        <section id="calories" className="mt-14">
          <h2 className={H2}>What Apple says about calories, by case</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            {WT_HEALTHKIT.filter((h) => h.discussion.length).length} of the {WT_HEALTHKIT.length} case pages carry a
            discussion. Most of them say how HealthKit counts calories for the activity; these are Apple’s sentences,
            grouped where the wording is identical.
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            {[...groups].map(([text, cases]) => (
              <li key={text} className="rounded-xl border border-[var(--border)] p-4">
                <span className="text-[var(--fg)]">
                  “<SourceText text={text} />”
                </span>
                <span className="mt-1 block text-xs">
                  {plural(cases.length, "case")}:{" "}
                  {cases.map((c, i) => (
                    <span key={c}>
                      {i > 0 ? ", " : ""}
                      <a href={`#${constantId(c)}`} className={LINK}>
                        {c}
                      </a>
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {deprecated.length > 0 && (
        <section id="deprecated" className="mt-14">
          <h2 className={H2}>Deprecated cases ({deprecated.length})</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
            {deprecated.map((h) => (
              <li key={h.case}>
                <a href={`#${constantId(h.case)}`} className={LINK}>
                  {h.case}
                </a>
                : <SourceText text={h.deprecation?.message ?? "Apple marks it deprecated without a note."} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function HealthConnectNotes() {
  const pv = platformValueMismatches();
  const example = WT_HEALTH_CONNECT.find((c) => c.name === "EXERCISE_TYPE_RUNNING") ?? WT_HEALTH_CONNECT[0];
  const groups = new Map<string, string[]>();
  for (const c of WT_HEALTH_CONNECT) if (c.segments.rule === "listed" && c.segments.via) groups.set(c.segments.via, [...(groups.get(c.segments.via) ?? []), c.name]);
  const anySession = WT_HEALTH_CONNECT.filter((c) => c.segments.rule === "any");
  return (
    <>
      <section id="platform-api" className="mt-14">
        <h2 className={H2}>Two numberings for one list</h2>
        <p className="mt-3 leading-relaxed text-[var(--muted)]">
          The values above are the Jetpack library’s ExerciseSessionRecord constants. The platform API that ships in
          Android (android.health.connect.datatypes.ExerciseSessionType) defines its own constants with different
          integers: {pv.length} of the {WT_HEALTH_CONNECT.length} pairs differ
          {example?.platform ? `; ${example.name} is ${example.value} in the library and ${example.platform.name} is ${example.platform.value} on the platform` : ""}. The
          library converts between the two in IntDefMappings.kt, whose rows pair the constants in the table above,
          for example:
        </p>
        {example?.platform && (
          <p className="mt-3">
            <Code>{example.platform.evidence}</Code>
          </p>
        )}
      </section>

      <section id="segments" className="mt-14">
        <h2 className={H2}>Which segment types each session type accepts</h2>
        <p className="mt-3 leading-relaxed text-[var(--muted)]">
          Google’s reference documents ExerciseSegment.isSegmentTypeCompatibleWithSessionType()
          {WT_HC_SEGMENT_RULE.addedIn ? ` (added in ${WT_HC_SEGMENT_RULE.addedIn})` : ""} as “{WT_HC_SEGMENT_RULE.functionDoc}”.
          The table it reads is in the library source: every session accepts the {WT_HC_UNIVERSAL_SEGMENTS.segments.length}{" "}
          universal segment types ({listOf(WT_HC_UNIVERSAL_SEGMENTS.segments.map(short))}),{" "}
          {anySession.length > 0 ? `${listOf(anySession.map((c) => c.name))} accept every segment type, ` : ""}
          and the session types the table names accept their own list on top. The Segments column above shows each
          one.
        </p>
        {[...groups].map(([via, sessions]) => {
          const members = WT_HEALTH_CONNECT.find((c) => c.segments.via === via)?.segments.segments ?? [];
          return (
            <p key={via} className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              <Code>{via}</Code>, used by {listOf(sessions)}: {listOf(members.map(short))}.
            </p>
          );
        })}
        {WT_HC_SEGMENT_RULE.requireLine && (
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            In the source, the ExerciseSessionRecord constructor runs <Code>{WT_HC_SEGMENT_RULE.requireLine}</Code>
            {WT_HC_SEGMENT_RULE.platformBranch ? (
              <>
                {" "}
                in the branch that does not hand the record to the platform API (<Code>{WT_HC_SEGMENT_RULE.platformBranch}</Code>)
              </>
            ) : null}
            .
          </p>
        )}
        <details className="mt-4 rounded-xl border border-[var(--border)] p-4 text-sm">
          <summary className="cursor-pointer font-medium text-[var(--fg)]">
            All {WT_HC_SEGMENT_TYPES.length} ExerciseSegment types
          </summary>
          <ul className="mt-3 grid gap-1 text-xs text-[var(--muted)] sm:grid-cols-2">
            {WT_HC_SEGMENT_TYPES.map((s) => (
              <li key={s.name} id={`segment-${s.name.toLowerCase()}`}>
                <code className="font-mono text-[var(--fg)]">{s.name}</code> = {s.value}
                {s.description ? ` · ${s.description}` : ""}
                {flagsFor("health-connect").some((f) => f.kind === "description-mismatch" && f.subject === s.name) && (
                  <a href="#flags" className="ml-1 text-amber-700 dark:text-amber-300">
                    (reads like the constant before it)
                  </a>
                )}
              </li>
            ))}
          </ul>
        </details>
      </section>
    </>
  );
}

function WearOsNotes() {
  const mism = intMismatches();
  return (
    <>
      <section id="ids" className="mt-14">
        <h2 className={H2}>Where the ids come from</h2>
        <p className="mt-3 leading-relaxed text-[var(--muted)]">
          Google’s ExerciseType reference lists the {WT_WEAR_OS.length} public constants without numbers. The androidx
          source it links as View Source declares each as <Code>ExerciseType(id, name)</Code>, and the ids above are
          read from those declarations. The same file declares {WT_WEAR_OS_INTERNAL.length} more constants internal,
          which an app cannot reference and the reference does not list:
        </p>
        <ul className="mt-3 grid gap-1 text-xs text-[var(--muted)] sm:grid-cols-2">
          {WT_WEAR_OS_INTERNAL.map((t) => (
            <li key={t.name}>
              <code className="font-mono text-[var(--fg)]">{t.name}</code> = {t.id}
            </li>
          ))}
        </ul>
      </section>
      {mism.length > 0 && (
        <section id="numbers" className="mt-14">
          <h2 className={H2}>Ids that differ from Health Connect</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            {mism.length} constants share a name with a Health Connect constant but not its number:{" "}
            {mism.map((m) => `${m.wearOs.name} is ${m.wearOs.id} here and ${m.healthConnect.value} on Health Connect`).join("; ")}.
          </p>
        </section>
      )}
    </>
  );
}

function GoogleHealthApiNotes() {
  return (
    <section id="display-name" className="mt-14">
      <h2 className={H2}>exerciseType decides the display name</h2>
      {WT_GHAPI_FIELDS.exerciseType && (
        <p className="mt-3 leading-relaxed text-[var(--muted)]">
          The discovery document describes exerciseType as “<SourceText text={WT_GHAPI_FIELDS.exerciseType} />”
        </p>
      )}
      {WT_GHAPI_FIELDS.displayName && (
        <p className="mt-3 leading-relaxed text-[var(--muted)]">
          And displayName as “<SourceText text={WT_GHAPI_FIELDS.displayName} />”
        </p>
      )}
    </section>
  );
}

const NOTES: Record<WtPlatformSlug, () => React.ReactElement> = {
  healthkit: HealthKitNotes,
  "health-connect": HealthConnectNotes,
  "wear-os": WearOsNotes,
  "google-health-api": GoogleHealthApiNotes,
};

export default function PlatformPage({ slug }: { slug: WtPlatformSlug }) {
  const p = platform(slug);
  const path = platformPath(slug);
  const url = absoluteUrl(path);
  const h1 = platformH1(slug);
  const description = platformDescription(slug);
  const faqs = platformFaqs(slug);
  const unmatched = unmatchedOf(slug);
  const flags = flagsFor(slug);
  const fallback = WT_FALLBACKS.find((f) => f.platform === slug);
  const Table = TABLES[slug];
  const Notes = NOTES[slug];
  const activities = activityRows().filter((r) => r.cells.some((c) => c.platform === slug));
  const sources = [...new Set([...p.sourceIds, ...(fallback?.statements.map((s) => s.sourceId) ?? [])])].map(source);

  return (
    <Container className="py-14">
      <JsonLd data={articleGraph({ path, title: h1, description, modified: WT_FETCHED, section: "Health data reference" })} />
      <JsonLd data={faqGraph(path, faqs)} />

      <div className="mx-auto max-w-5xl" data-wt-platform={slug}>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Workout types", path: WT_BASE },
            { name: p.name, path },
          ]}
        />

        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl">{h1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {p.count} {p.enumeration} {slug === "google-health-api" ? "values" : slug === "healthkit" ? "cases" : "constants"} · {p.count - unmatched.length}{" "}
          with a same-name counterpart · read {p.readOn}
          <ContentAge date={p.readOn} />
        </p>

        <p id="answer" className={CAPSULE}>
          {platformCapsule(slug)}
        </p>

        <PageActions path={path} url={url} title={h1} updated={WT_FETCHED} markdown={false} />

        <p className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm leading-relaxed text-[var(--muted)]">
          The join rule and the whole crosswalk are on the{" "}
          <Link href={WT_BASE} className={LINK}>
            workout types hub
          </Link>
          . The other lists:{" "}
          {PLATFORM_ORDER.filter((x) => x !== slug).map((x, i) => (
            <span key={x}>
              {i > 0 ? " · " : ""}
              <Link href={platformPath(x)} className={LINK}>
                {platform(x).enumeration}
              </Link>
            </span>
          ))}
          .
        </p>

        <section id="constants" className="mt-12">
          <h2 className={H2}>
            All {p.count} {slug === "google-health-api" ? "values" : slug === "healthkit" ? "cases" : "constants"}
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Names are copied exactly from the source; the last column lists the constants on the other platforms whose
            names match under the{" "}
            <Link href={`${WT_BASE}#rule`} className={LINK}>
              crosswalk rule
            </Link>
            , with their numbers where printed.
          </p>
          <div className="mt-5 overflow-x-auto" data-wt-list={slug}>
            <Table />
          </div>
        </section>

        <Notes />

        <section id="unmatched" className="mt-14">
          <h2 className={H2}>No same-name counterpart ({unmatched.length})</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            No other platform spells these names the same way under the rule. That is a statement about names, not a
            finding that the activity is missing elsewhere.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            {unmatched.map((c, i) => (
              <span key={c.name}>
                {i > 0 ? ", " : ""}
                <a href={`#${constantId(c.name)}`} className={LINK}>
                  {c.name}
                </a>
              </span>
            ))}
          </p>
        </section>

        {fallback && (
          <section id="catch-all" className="mt-14">
            <h2 className={H2}>
              The catch-all: <Qualified c={{ platform: slug, name: fallback.constant }} />
            </h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
              {fallback.statements.map((s, i) => (
                <li key={i} className="border-l-4 border-brand-400/60 pl-4">
                  <span className="text-[var(--fg)]">
                    “<SourceText text={s.text} />”
                  </span>{" "}
                  <span className="text-xs">({source(s.sourceId).title})</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {flags.length > 0 && (
          <section id="flags" className="mt-14">
            <h2 className={H2}>Where the sources disagree ({flags.length})</h2>
            <FlagList flags={flags} />
          </section>
        )}

        {activities.length > 0 && (
          <section id="activities" className="mt-14">
            <h2 className={H2}>Side by side, one activity at a time</h2>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm">
              {activities.map((r) => (
                <li key={r.key}>
                  <Link href={activityPath(r)} className={PILL}>
                    {activityLabel(r)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="on-this-site" className="mt-14">
          <h2 className={H2}>More on {p.name} on this site</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {PLATFORM_REFERENCES[slug].map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={LINK}>
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FaqSection faqs={faqs} />

        <SourceList sources={sources.length ? sources : WT_SOURCES} />
      </div>
    </Container>
  );
}
