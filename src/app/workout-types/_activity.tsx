import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import type { WtCrosswalkRow, WtPlatformSlug } from "@/data/workoutTypes";
import {
  PLATFORM_ORDER,
  PLATFORM_REFERENCES,
  WT_BASE,
  WT_FETCHED,
  WT_HC_SEGMENT_TYPES,
  WT_HC_UNIVERSAL_SEGMENTS,
  WT_INT_COMPARISON,
  activityCapsule,
  activityDescription,
  activityFaqs,
  activityH1,
  activityLabel,
  activityPath,
  activityRows,
  constantHref,
  factsOf,
  ghapiValue,
  healthConnectConstant,
  healthkitCase,
  healthkitGroupRow,
  platform,
  platformPath,
  qualified,
  segmentSentence,
  source,
  wearOsConstant,
  type ActivityFact,
} from "@/data/workoutTypePages";
import { absoluteUrl } from "@/lib/site";
import { FaqSection, JsonLd, articleGraph, faqGraph } from "../error-codes/_shared";
import { CAPSULE, Code, H2, LINK, PILL, SourceList, SourceText, TH } from "./_shared";

/**
 * One page per crosswalk row that clears ACTIVITY_RULE (src/data/
 * workoutTypePages.ts): the activity's constant on each platform with the
 * source's own number and wording, and every fact the sources state about it
 * beyond its names, each quoted inside a data-evidence block that qa.mjs
 * reads back (WORKOUT-TYPE-PAGE-RULE).
 */

const FACT_HEADING: Record<ActivityFact["kind"], string> = {
  "hk-discussion": "Apple’s discussion of the HealthKit case",
  "hk-deprecation": "Apple’s deprecation note",
  "hc-segments": "The segment types Health Connect accepts in this session type",
  "hc-description": "Google’s description of the Health Connect constant",
  "hc-platform-deprecation": "The platform API’s deprecation note",
  "hs-description": "Google’s description of the Wear OS constant",
};

const FACT_SOURCE: Record<ActivityFact["kind"], string> = {
  "hk-discussion": "hkCases",
  "hk-deprecation": "hkModule",
  "hc-segments": "hcSegmentSrc",
  "hc-description": "hcSessionRef",
  "hc-platform-deprecation": "hcPlatformRef",
  "hs-description": "hsJavaRef",
};

function Row({ p, name }: { p: WtPlatformSlug; name: string }) {
  if (p === "healthkit") {
    const h = healthkitCase(name);
    if (!h) return null;
    const ios = h.platforms.find((x) => x.name === "iOS");
    const watch = h.platforms.find((x) => x.name === "watchOS");
    return (
      <>
        <td className="py-3 pr-4 tabular-nums text-[var(--muted)]">none printed</td>
        <td className="py-3 pr-4 text-xs leading-relaxed text-[var(--muted)]">
          {h.abstract}
          <span className="mt-1 block">
            {ios ? `iOS ${ios.introducedAt}` : ""}
            {watch ? `, watchOS ${watch.introducedAt}` : ""} · {h.group}
          </span>
        </td>
      </>
    );
  }
  if (p === "health-connect") {
    const c = healthConnectConstant(name);
    if (!c) return null;
    return (
      <>
        <td className="py-3 pr-4 font-mono text-xs tabular-nums text-[var(--fg)]">{c.value}</td>
        <td className="py-3 pr-4 text-xs leading-relaxed text-[var(--muted)]">
          {c.description ? <SourceText text={c.description} /> : "Google’s Jetpack reference gives no description."}
          {c.platform && (
            <span className="mt-1 block">
              Platform API: <code className="font-mono text-[var(--fg)]">{c.platform.name}</code> = {c.platform.value}
              {c.platform.description ? ` · “${c.platform.description}”` : ""} · API level {c.platform.apiLevel}
            </span>
          )}
        </td>
      </>
    );
  }
  if (p === "wear-os") {
    const t = wearOsConstant(name);
    if (!t) return null;
    return (
      <>
        <td className="py-3 pr-4 font-mono text-xs tabular-nums text-[var(--fg)]">{t.id ?? "–"}</td>
        <td className="py-3 pr-4 text-xs leading-relaxed text-[var(--muted)]">
          {t.description ? <SourceText text={t.description} /> : "Google’s ExerciseType reference gives no description."}
        </td>
      </>
    );
  }
  const g = ghapiValue(name);
  if (!g) return null;
  return (
    <>
      <td className="py-3 pr-4 text-xs text-[var(--muted)]">the string itself</td>
      <td className="py-3 pr-4 text-xs text-[var(--muted)]">{g.description ? `“${g.description}”` : "None in the discovery document."}</td>
    </>
  );
}

function Fact({ f }: { f: ActivityFact }) {
  const s = source(FACT_SOURCE[f.kind]);
  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <h3 className="font-semibold text-[var(--fg)]">{FACT_HEADING[f.kind]}</h3>
      <p className="mt-1 text-xs text-[var(--muted)]">
        On <Code>{f.constant}</Code>, from{" "}
        <a href={s.page} rel="nofollow" className={LINK}>
          {s.title}
        </a>
        , read {s.fetchedOn}
      </p>
      <blockquote data-evidence={f.kind} className="mt-3 border-l-4 border-brand-400/60 pl-4 text-sm leading-relaxed text-[var(--fg)]">
        {f.texts.map((t, i) => (
          <p key={i} className={i > 0 ? "mt-2" : undefined}>
            <SourceText text={t} />
          </p>
        ))}
      </blockquote>
      {f.kind === "hc-segments" && (
        <div className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          <p>{segmentSentence(f.constant, f.rule)}</p>
          {f.rule.segments.length > 0 && (
            <ul className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
              {f.rule.segments.map((name) => {
                const seg = WT_HC_SEGMENT_TYPES.find((x) => x.name === name);
                return (
                  <li key={name}>
                    <Link href={`${platformPath("health-connect")}#segment-${name.toLowerCase()}`} className={LINK}>
                      <code className="font-mono">{name}</code>
                    </Link>
                    {seg ? ` = ${seg.value}${seg.description ? ` · ${seg.description}` : ""}` : ""}
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-2 text-xs">
            Every session also accepts {WT_HC_UNIVERSAL_SEGMENTS.segments.map((x) => x.replace(/^EXERCISE_SEGMENT_TYPE_/, "")).join(", ")}.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ActivityPage({ row }: { row: WtCrosswalkRow }) {
  const path = activityPath(row);
  const url = absoluteUrl(path);
  const h1 = activityH1(row);
  const description = activityDescription(row);
  const faqs = activityFaqs(row);
  const facts = factsOf(row);
  const label = activityLabel(row);
  const cmp = WT_INT_COMPARISON.find((x) => x.key === row.key);
  const others = activityRows().filter((r) => r.key !== row.key);
  const hk = row.cells.find((c) => c.platform === "healthkit");
  const hkRow = hk ? healthkitGroupRow(hk.name, healthkitCase(hk.name)?.group ?? "") : null;
  const sourceIds = new Set<string>();
  for (const c of row.cells) for (const id of platform(c.platform).sourceIds) sourceIds.add(id);
  for (const f of facts) sourceIds.add(FACT_SOURCE[f.kind]);

  return (
    <Container className="py-14">
      <JsonLd data={articleGraph({ path, title: h1, description, modified: WT_FETCHED, section: "Health data reference" })} />
      <JsonLd data={faqGraph(path, faqs)} />

      <div className="mx-auto max-w-5xl" data-wt-activity={row.key} data-wt-facts={facts.map((f) => f.kind).join(" ")}>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Workout types", path: WT_BASE },
            { name: label, path },
          ]}
        />

        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl">{h1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {row.cells.length} platforms · {facts.length} facts from the sources beyond the names · read {WT_FETCHED}
          <ContentAge date={WT_FETCHED} />
        </p>

        <p id="answer" className={CAPSULE}>
          {activityCapsule(row)}
        </p>

        <PageActions path={path} url={url} title={h1} updated={WT_FETCHED} markdown={false} />

        <section id="constants" className="mt-12">
          <h2 className={H2}>The constant on each platform</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            These share a row because their names match under the{" "}
            <Link href={`${WT_BASE}#rule`} className={LINK}>
              crosswalk rule
            </Link>
            . None of the Apple and Google pages read for this reference maps them to each other.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className={TH}>Platform</th>
                  <th className={TH}>Constant</th>
                  <th className={TH}>Number</th>
                  <th className="py-2 font-semibold text-[var(--fg)]">What the source says</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORM_ORDER.map((p) => {
                  const c = row.cells.find((x) => x.platform === p);
                  return (
                    <tr key={p} id={`on-${p}`} className="border-b border-[var(--border)] align-top">
                      <td className="py-3 pr-4">
                        <Link href={platformPath(p)} className={LINK}>
                          {platform(p).name}
                        </Link>
                      </td>
                      {c ? (
                        <>
                          <td className="py-3 pr-4">
                            <Link href={constantHref(c)} className={LINK}>
                              <code className="break-all font-mono text-xs">{qualified(c)}</code>
                            </Link>
                          </td>
                          <Row p={p} name={c.name} />
                        </>
                      ) : (
                        <td colSpan={3} className="py-3 pr-4 text-xs text-[var(--muted)]">
                          No constant with this name in {platform(p).enumeration}.
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {cmp && (
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              {cmp.same
                ? `Health Connect’s ${cmp.healthConnect.name} and Wear OS’s ExerciseType.${cmp.wearOs.name} both print ${cmp.healthConnect.value}.`
                : `Health Connect’s ${cmp.healthConnect.name} is ${cmp.healthConnect.value}; Wear OS’s ExerciseType.${cmp.wearOs.name} is ${cmp.wearOs.id}. The names match and the numbers do not.`}{" "}
              <Link href={`${WT_BASE}#numbers`} className={LINK}>
                Every pair that differs
              </Link>
              .
            </p>
          )}
        </section>

        <section id="facts" className="mt-14">
          <h2 className={H2}>What the sources say about {label.toLowerCase()} beyond its names</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Quoted from the sources as read on {WT_FETCHED}. These are what give this row a page of its own under the{" "}
            <Link href={`${WT_BASE}#activities`} className={LINK}>
              page rule
            </Link>
            .
          </p>
          <div className="mt-5 space-y-4">
            {facts.map((f) => (
              <Fact key={`${f.kind}-${f.constant}`} f={f} />
            ))}
          </div>
        </section>

        <section id="on-this-site" className="mt-14">
          <h2 className={H2}>Where each platform’s list lives on this site</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {hkRow && (
              <li>
                <Link href={hkRow} className={LINK}>
                  HKWorkoutActivityType.{hk?.name} on this site’s HealthKit pages
                </Link>
              </li>
            )}
            {row.cells
              .filter((c) => c.platform !== "healthkit")
              .flatMap((c) => PLATFORM_REFERENCES[c.platform].slice(0, 1))
              .map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className={LINK}>
                    {r.label}
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        {others.length > 0 && (
          <section id="other-activities" className="mt-14">
            <h2 className={H2}>Other activities side by side</h2>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm">
              {others.map((r) => (
                <li key={r.key}>
                  <Link href={activityPath(r)} className={PILL}>
                    {activityLabel(r)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={WT_BASE} className={PILL}>
                  All workout types and the crosswalk
                </Link>
              </li>
            </ul>
          </section>
        )}

        <FaqSection faqs={faqs} />

        <SourceList sources={[...sourceIds].map(source)} />
      </div>
    </Container>
  );
}
