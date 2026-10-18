import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import {
  ACTIVITY_RULE,
  HUB_H1,
  HUB_TITLE,
  PLATFORM_ORDER,
  WT_BASE,
  WT_CROSSWALK,
  WT_DATASET,
  WT_FALLBACKS,
  WT_FETCHED,
  WT_FLAGS,
  WT_HC_STRING_MAP,
  WT_HEALTH_CONNECT,
  WT_INT_COMPARISON,
  WT_MAPPING_SEARCH,
  WT_NORMALISATION,
  WT_PLATFORMS,
  WT_SOURCES,
  WT_STATED_MAPPINGS,
  activityH1,
  activityLabel,
  activityPath,
  activityRows,
  apartExamples,
  constantHref,
  constantId,
  crosswalkId,
  factsOf,
  hubCapsule,
  hubDescription,
  hubFaqs,
  hubTotals,
  intMismatches,
  listOf,
  platform,
  platformH1,
  platformPath,
  platformValueMismatches,
  plural,
  printedNumber,
  qualified,
  source,
  unmatchedOf,
} from "@/data/workoutTypePages";
import { absoluteUrl } from "@/lib/site";
import { FaqSection, JsonLd, articleGraph, faqGraph, site } from "../error-codes/_shared";
import { CAPSULE, Code, FlagList, H2, LINK, Qualified, SourceList, SourceText, TH } from "./_shared";

/**
 * Hub for the generated workout-type reference: the four enumerations, the
 * name-identity crosswalk between them, where the numbers disagree, what each
 * platform does with a type it has no constant for, and the disagreements
 * between Google's own pages. Generated from src/data/workoutTypes.ts
 * (scripts/fetch-workout-types.mjs) through src/data/workoutTypePages.ts;
 * every number in the copy is computed from the data.
 */

const PATH = WT_BASE;
const T = hubTotals();
const DESCRIPTION = hubDescription();

export const metadata: Metadata = {
  title: { absolute: HUB_TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", title: HUB_TITLE, description: DESCRIPTION, url: PATH, modifiedTime: WT_FETCHED },
  twitter: { card: "summary_large_image", title: HUB_TITLE, description: DESCRIPTION },
};

const FAQS = hubFaqs();
const ACTIVITIES = activityRows();
const MISMATCH = intMismatches();
const PLATFORM_DIFF = platformValueMismatches();
const APART = apartExamples();

export default function WorkoutTypesHub() {
  const url = absoluteUrl(PATH);
  return (
    <Container className="py-14">
      <JsonLd
        data={articleGraph({
          path: PATH,
          title: HUB_H1,
          description: DESCRIPTION,
          modified: WT_FETCHED,
          section: "Health data reference",
          pageType: "CollectionPage",
          parts: [
            ...PLATFORM_ORDER.map((p) => ({ name: platformH1(p), path: platformPath(p) })),
            ...ACTIVITIES.map((r) => ({ name: activityH1(r), path: activityPath(r) })),
          ],
        })}
      />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-5xl" data-wt-hub>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Workout types", path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{HUB_H1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {plural(T.constants, "constant")} on 4 platforms · {plural(T.rows, "crosswalk row")} · {plural(T.flags, "source conflict")} · read from the sources on {WT_FETCHED}
          <ContentAge date={WT_FETCHED} />
        </p>

        <p id="answer" className={CAPSULE}>
          {hubCapsule()}
        </p>

        <PageActions path={PATH} url={url} title={HUB_H1} updated={WT_FETCHED} markdown={false} />

        <section id="platforms" className="mt-12">
          <h2 className={H2}>The four enumerations</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Each platform names the kind of workout with its own list, read here from that platform’s own pages. Each
            list page shows every constant with the source’s wording and the constants of the same name elsewhere.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className={TH}>Platform</th>
                  <th className={TH}>Enumeration</th>
                  <th className={TH}>Constants</th>
                  <th className={TH}>Share a name</th>
                  <th className="py-2 font-semibold text-[var(--fg)]">Numbers</th>
                </tr>
              </thead>
              <tbody>
                {WT_PLATFORMS.map((p) => (
                  <tr key={p.slug} id={`platform-${p.slug}`} className="border-b border-[var(--border)] align-top">
                    <td className="py-3 pr-4">
                      <Link href={platformPath(p.slug)} className={LINK}>
                        {p.name}
                      </Link>
                      <span className="mt-0.5 block text-xs text-[var(--muted)]">read {p.readOn}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <Code>{p.enumeration}</Code>
                      <span className="mt-0.5 block text-xs text-[var(--muted)]">
                        <SourceText text={p.kind} />
                      </span>
                    </td>
                    <td className="py-3 pr-4 tabular-nums text-[var(--fg)]">{p.count}</td>
                    <td className="py-3 pr-4 tabular-nums text-[var(--muted)]">{p.count - unmatchedOf(p.slug).length}</td>
                    <td className="py-3 text-xs leading-relaxed text-[var(--muted)]">{p.valueNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="rule" className="mt-14">
          <h2 className={H2}>How two constants end up on the same row</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">{WT_NORMALISATION}</p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            That is the only join. No row is made by meaning, so a row says the names match and nothing more: it does
            not say the platforms define the activity the same way, record the same metrics for it, or estimate its
            calories alike.
            {APART.length > 0 && (
              <>
                {" "}
                The rule leaves {listOf(APART.map((x) => `${qualified(x.a)} and ${qualified(x.b)}`))} on separate rows,
                because their names differ.
              </>
            )}
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            A second kind of row would hold mappings a source states, with the source’s own row as evidence. The pages
            read on {WT_FETCHED} state {T.stated === 0 ? "none" : plural(T.stated, "mapping")}; the{" "}
            <a href="#stated" className={LINK}>
              search
            </a>{" "}
            is listed below.
          </p>
        </section>

        <section id="crosswalk" className="mt-14">
          <h2 className={H2}>Crosswalk: the same name on two or more platforms ({T.rows})</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            {T.onAll} rows join all four platforms, {T.onThree} join three and {T.onTwo} join two. Each cell links to the
            constant’s row on its platform page; numbers are shown where the platform prints one.
          </p>
          <div className="mt-5 overflow-x-auto" data-wt-crosswalk>
            <table className="w-full min-w-[56rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className={TH}>Name</th>
                  {PLATFORM_ORDER.map((p) => (
                    <th key={p} data-platform={p} className={TH}>
                      <Link href={platformPath(p)} className={LINK}>
                        {platform(p).short}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WT_CROSSWALK.map((r) => {
                  const page = ACTIVITIES.find((a) => a.key === r.key);
                  return (
                    <tr key={r.key} id={crosswalkId(r.key)} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4 text-xs font-semibold text-[var(--fg)]">
                        {page ? (
                          <Link href={activityPath(page)} className={LINK}>
                            {activityLabel(r)}
                          </Link>
                        ) : (
                          <span className="font-mono">{r.label}</span>
                        )}
                      </td>
                      {PLATFORM_ORDER.map((p) => {
                        const c = r.cells.find((x) => x.platform === p);
                        if (!c) {
                          return (
                            <td key={p} className="py-2 pr-4 text-xs text-[var(--muted)]">
                              –
                            </td>
                          );
                        }
                        const n = printedNumber(c);
                        return (
                          <td key={p} className="py-2 pr-4 text-xs">
                            <Link href={constantHref(c)} className={LINK}>
                              <code className="break-all font-mono">{c.name}</code>
                            </Link>
                            {n !== null && <span className="text-[var(--muted)]"> {n}</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {MISMATCH.length > 0 && (
          <section id="numbers" className="mt-14">
            <h2 className={H2}>Same name, different number</h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              Health Connect and Wear OS Health Services both identify a type by an integer. {WT_INT_COMPARISON.length}{" "}
              constants have the same name on both, and {MISMATCH.length} of them carry different integers. Neither
              Google page says the two numberings are interchangeable.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm" data-wt-int-mismatch>
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className={TH}>Health Connect (Jetpack value)</th>
                    <th className="py-2 font-semibold text-[var(--fg)]">Wear OS (ExerciseType id)</th>
                  </tr>
                </thead>
                <tbody>
                  {MISMATCH.map((m) => (
                    <tr key={m.key} className="border-b border-[var(--border)]">
                      <td className="py-2 pr-4 text-xs">
                        <Link href={constantHref({ platform: "health-connect", name: m.healthConnect.name })} className={LINK}>
                          <code className="font-mono">{m.healthConnect.name}</code>
                        </Link>{" "}
                        = {m.healthConnect.value}
                      </td>
                      <td className="py-2 text-xs">
                        <Link href={constantHref({ platform: "wear-os", name: m.wearOs.name })} className={LINK}>
                          <code className="font-mono">{m.wearOs.name}</code>
                        </Link>{" "}
                        = {m.wearOs.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {PLATFORM_DIFF.length > 0 && (
              <p className="mt-4 leading-relaxed text-[var(--muted)]">
                Health Connect also numbers its own types twice. The platform API (android.health.connect, API level
                34) gives {PLATFORM_DIFF.length} of the {WT_HEALTH_CONNECT.length} types a different integer from the
                Jetpack library’s ExerciseSessionRecord constants, and the library converts between the two; the{" "}
                <Link href={`${platformPath("health-connect")}#platform-api`} className={LINK}>
                  Health Connect page
                </Link>{" "}
                lists both numbers for every type.
              </p>
            )}
          </section>
        )}

        <section id="unmatched" className="mt-14">
          <h2 className={H2}>Constants with no same-name counterpart</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            A constant is unmatched when no other platform spells its name the same way under the rule. That is a fact
            about names, not a finding that the activity has no equivalent.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {PLATFORM_ORDER.map((p) => {
              const un = unmatchedOf(p);
              return (
                <li key={p}>
                  <Link href={`${platformPath(p)}#unmatched`} className={LINK}>
                    {platform(p).name}
                  </Link>
                  : {un.length} of {platform(p).count}
                  {un.length > 0 && un.length <= 6 ? ` (${un.map((c) => c.name).join(", ")})` : ""}
                </li>
              );
            })}
          </ul>
        </section>

        <section id="no-counterpart" className="mt-14">
          <h2 className={H2}>What each platform says about a type it has no constant for</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Each platform has a catch-all. These are the sources’ own words about it, quoted; nothing here is our
            advice.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {WT_FALLBACKS.map((f) => (
              <div key={f.platform} className="rounded-xl border border-[var(--border)] p-4 text-sm">
                <p className="font-semibold text-[var(--fg)]">
                  {platform(f.platform).name}: <Qualified c={{ platform: f.platform, name: f.constant }} />
                </p>
                <ul className="mt-2 space-y-2 leading-relaxed text-[var(--muted)]">
                  {f.statements.map((s, i) => (
                    <li key={i} className="border-l-4 border-brand-400/60 pl-3">
                      “<SourceText text={s.text} />”{" "}
                      <span className="text-xs">({source(s.sourceId).title})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="stated" className="mt-14">
          <h2 className={H2}>Mappings the sources state</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            {WT_STATED_MAPPINGS.length === 0
              ? `None between two of the four enumerations. These ${WT_MAPPING_SEARCH.length} pages were read on ${WT_FETCHED} looking for one; the generator refuses to publish if any of them grows a table row or list item that names constants of two enumerations, so a mapping published later is read by a person instead of missed.`
              : `${plural(WT_STATED_MAPPINGS.length, "mapping")} between two of the four enumerations, each with the source's own row.`}
          </p>
          <ul className="mt-4 space-y-1 text-sm text-[var(--muted)]">
            {WT_MAPPING_SEARCH.map((m) => {
              const s = source(m.sourceId);
              return (
                <li key={m.sourceId}>
                  <a href={s.page} rel="nofollow" className={LINK}>
                    {s.title}
                  </a>{" "}
                  · read {s.fetchedOn}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            In the Health Connect library source, two tables translate exercise types, and neither joins two of the
            four lists. IntDefMappings.kt converts each Jetpack constant to the platform API’s constant of the same
            type; that is Health Connect mapped to itself, shown per constant on the{" "}
            <Link href={`${platformPath("health-connect")}#platform-api`} className={LINK}>
              Health Connect page
            </Link>
            . ExerciseSessionRecord.kt also keeps EXERCISE_TYPE_STRING_TO_INT_MAP, {WT_HC_STRING_MAP.entries.length}{" "}
            lowercase names mapped to EXERCISE_TYPE_ constants
            {WT_HC_STRING_MAP.restrictedToLibrary ? ", marked @RestrictTo(RestrictTo.Scope.LIBRARY), so not an API an app may call" : ""}
            . One line reads{" "}
            {WT_HC_STRING_MAP.comment && <Code>{WT_HC_STRING_MAP.comment}</Code>}. Neither Google’s reference pages nor
            the source document the table as a mapping from Wear OS ExerciseType, so this reference joins nothing by
            it.
          </p>
        </section>

        {WT_FLAGS.length > 0 && (
          <section id="flags" className="mt-14">
            <h2 className={H2}>Where Google’s pages disagree, with each other or with themselves ({WT_FLAGS.length})</h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              Found by checking the sources against each other, and each constant’s description against its name, while
              generating this reference. Each is published as found, with the texts concerned; none is corrected here.
            </p>
            <FlagList flags={WT_FLAGS} />
          </section>
        )}

        <section id="activities" className="mt-14">
          <h2 className={H2}>Activities with a page of their own ({ACTIVITIES.length})</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">{ACTIVITY_RULE}</p>
          {ACTIVITIES.length > 0 ? (
            <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {ACTIVITIES.map((r) => (
                <li key={r.key}>
                  <Link
                    href={activityPath(r)}
                    className="block rounded-xl border border-[var(--border)] p-4 font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                  >
                    {activityLabel(r)}
                    <span className="mt-1 block text-xs font-normal text-[var(--muted)]">
                      {r.cells.length} platforms · {plural(factsOf(r).length, "fact")} from the sources
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">No row clears the rule on this read.</p>
          )}
        </section>

        <section id="download" className="mt-14">
          <h2 className={H2}>Download the crosswalk</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            One row per constant on each platform, with its number where printed, the source’s description, the
            crosswalk key and the same-name constants elsewhere, under CC BY 4.0:{" "}
            <a href={`/datasets/${WT_DATASET}.json`} className={LINK}>
              {WT_DATASET}.json
            </a>{" "}
            and{" "}
            <a href={`/datasets/${WT_DATASET}.csv`} className={LINK}>
              {WT_DATASET}.csv
            </a>
            , listed with the other{" "}
            <Link href="/datasets" className={LINK}>
              open datasets
            </Link>
            .
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            The platform pages:{" "}
            {PLATFORM_ORDER.map((p, i) => (
              <span key={p}>
                {i > 0 ? " · " : ""}
                <Link href={platformPath(p)} className={LINK}>
                  {platform(p).enumeration}
                </Link>
              </span>
            ))}
            . Row anchors follow one pattern, so <Code>{`${platformPath("health-connect")}#${constantId("EXERCISE_TYPE_RUNNING")}`}</Code>{" "}
            lands on a constant.
          </p>
        </section>

        <FaqSection faqs={FAQS} />

        <SourceList
          sources={WT_SOURCES}
          note="Read by scripts/fetch-workout-types.mjs, which refuses to publish when a count differs from the last verified read or a normalisation would put two constants of one platform on one row. GitHub files are read on the branch shown; the hash is SHA-256 of the bytes served."
        />

        <p className="mt-12 text-sm text-[var(--muted)]">
          Compiled by {site.name} from Apple’s and Google’s own documentation and source. The sources remain the
          authority.
        </p>
      </div>
    </Container>
  );
}
