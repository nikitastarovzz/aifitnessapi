import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import {
  FORM_RULES,
  FORM_RULE_EXERCISES,
  FORM_RULE_PRESETS,
  FORM_RULE_SOURCES,
  FORM_RULES_FETCHED_ON,
} from "@/data/formRules";
import { formRuleSource as src, formRuleValueText as valueText, formRulesCapsule } from "@/lib/formRulesView";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * The open exercise form-rules dataset, rendered.
 *
 * Every number on this page is read from src/data/formRules.ts, which
 * scripts/fetch-form-rules.mjs generates from the code of licensed
 * open-source exercise trackers: the generator refuses to write unless each
 * row's quote is found in the fetched file, and takes the value out of that
 * quote. Rows no source fills are shown with their null reason rather than
 * hidden, because "nobody we could read states this" is the finding.
 *
 * The page does not rank the sources or say which threshold is right. They
 * disagree (formRuleDisagreement in src/lib/formRulesView.ts names a pair the
 * data holds), and the
 * reader's footage decides; the rep counter playground is linked from every
 * rule set that can drive it.
 */

const PATH = "/tools/exercise-form-rules";
const UPDATED = FORM_RULES_FETCHED_ON;
const DATASET = "exercise-form-rules-2026";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "Exercise Form Rules: Joint-Angle Thresholds";
const DESCRIPTION =
  "Joint-angle rules for squats, push-ups, lunges, planks, curls, presses and deadlifts from open-source trackers, each quoted from its code. JSON and CSV.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "The rep-count and form-check angle thresholds licensed open-source exercise trackers ship, with the line of code each was read from. Nulls where no source says.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function ExerciseFormRulesPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "joint angle thresholds for exercise form and rep counting",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Exercise form rules", path: PATH },
          ]}
        />
        <ClusterHero label="Open Dataset" seed={8} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Exercise form rules: the joint angles open-source trackers use
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {formRulesCapsule()}
        </p>

        <section data-tool="exercise-form-rules" aria-label="Exercise form-rules dataset">
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a href={`/datasets/${DATASET}.json`} className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
              Download JSON
            </a>
            <a href={`/datasets/${DATASET}.csv`} className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
              Download CSV
            </a>
            <Link href="/tools/rep-counter-playground" className="rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-500">
              Try a rule in the rep counter
            </Link>
          </div>

          <nav aria-label="Exercises" className="mt-6 flex flex-wrap gap-2 text-sm">
            {FORM_RULE_EXERCISES.map((e) => (
              <a key={e.id} href={`#${e.id}`} className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] hover:text-[var(--fg)]">
                {e.name} ({FORM_RULES.filter((r) => r.exercise === e.id).length})
              </a>
            ))}
          </nav>

          {FORM_RULE_EXERCISES.map((e) => {
            const rows = FORM_RULES.filter((r) => r.exercise === e.id);
            const presets = FORM_RULE_PRESETS.filter((p) => p.exercise === e.id);
            return (
              <section key={e.id} id={e.id} className="mt-12 scroll-mt-20">
                <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{e.name}</h2>
                {presets.length > 0 ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Load into the rep counter:{" "}
                    {presets.map((p, i) => (
                      <span key={p.id}>
                        {i > 0 ? " · " : ""}
                        <Link href={`/tools/rep-counter-playground?preset=${p.id}`} className={linkCls} data-preset-link>
                          {p.joint} {p.top}°/{p.bottom}° ({src(p.sourceId)?.name})
                        </Link>
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    No source read gives both a top and a bottom angle for counting, so there is no rep-counter
                    preset for this exercise.
                  </p>
                )}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wider text-[var(--muted)]">
                      <tr>
                        <th className="py-2 pr-3">Rule</th>
                        <th className="py-2 pr-3">Measures</th>
                        <th className="py-2 pr-3">Value</th>
                        <th className="py-2">Source and evidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => {
                        const s = src(r.sourceId);
                        return (
                          <tr key={r.id} id={`rule-${r.id}`} className="border-t border-[var(--border)] align-top text-[var(--fg)]">
                            <td className="py-3 pr-3">
                              <span className="block text-xs uppercase tracking-wider text-[var(--muted)]">{r.purpose}</span>
                              {r.meaning}
                            </td>
                            <td className="py-3 pr-3 text-xs">
                              {r.joint ?? "—"}
                              {r.points ? <span className="block text-[var(--muted)]">{r.points.join(" · ")}</span> : null}
                              {r.keypointIndices ? <span className="block text-[var(--muted)]">COCO {r.keypointIndices.join(", ")}</span> : null}
                            </td>
                            <td className="whitespace-nowrap py-3 pr-3 font-mono">{valueText(r)}</td>
                            <td className="py-3 text-xs text-[var(--muted)]">
                              {r.value === null ? (
                                <>
                                  <span className="block text-[var(--fg)]">{r.nullReason}</span>
                                  {r.reasonQuote && r.source ? (
                                    <span className="mt-1 block">
                                      <code className="break-all font-mono">{r.reasonQuote}</code>{" "}
                                      <a href={r.source} className={linkCls} rel="noopener">
                                        {s?.repo}
                                      </a>
                                    </span>
                                  ) : null}
                                </>
                              ) : (
                                <>
                                  <code className="block break-all font-mono text-[var(--fg)]">{r.quote}</code>
                                  <span className="mt-1 block">
                                    applied: <code className="break-all font-mono">{r.usage}</code>
                                  </span>
                                  <span className="mt-1 block">
                                    measured: <code className="break-all font-mono">{r.measureQuote}</code>
                                  </span>
                                  <span className="mt-1 block">
                                    <a href={r.source ?? "#"} className={linkCls} rel="noopener">
                                      {s?.name}
                                    </a>
                                    , {s?.license}
                                  </span>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  How these are detected on camera:{" "}
                  <Link href={e.motion} className={linkCls}>
                    {e.name.toLowerCase()} detection
                  </Link>
                  .
                </p>
              </section>
            );
          })}
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Sources</h2>
          <ul className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
            {FORM_RULE_SOURCES.map((s) => (
              <li key={s.id}>
                <a href={s.repoUrl} className={linkCls} rel="noopener">
                  {s.name}
                </a>{" "}
                ({s.repo}, branch {s.branch}), licensed{" "}
                <a href={s.licenseUrl} className={linkCls} rel="noopener">
                  {s.license}
                </a>
                , built on {s.poseModel}. Angles computed as{" "}
                <code className="break-all font-mono text-xs">{s.angleMethodQuote}</code>.
                {s.caveat ? (
                  <>
                    {" "}
                    Its README warns: <q>{s.caveat}</q>
                  </>
                ) : null}{" "}
                Files read on {s.files[0]?.fetchedOn}: {s.files.map((f) => f.path).join(", ")}.
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How this dataset is built, and its limits</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              Only code under an open-source license whose LICENSE file could be read is used. Repositories
              whose README claims a license but that ship no LICENSE file were left out.
            </li>
            <li>
              A source that disappears is dropped, not kept from an old copy. thphuc05/PythonExcercisePoseEstimation
              (MIT), the source of 11 squat, push-up and plank rules here until November 2026, answered 404 on
              November 14, 2026, while its owner&rsquo;s GitHub account still answered, so its rules were removed,
              and squat rep counting and the plank hold, which only it filled, are null.
            </li>
            <li>
              No number is typed by hand. The generator fetches each file, refuses to write unless the quoted
              line is in it, and captures the value from that line; the line that applies the value and the
              line that computes the angle are stored and checked the same way, and a weekly job re-checks
              every quote against the live file.
            </li>
            <li>
              Peer-reviewed definitions, such as the finite-state exercise definitions cited on{" "}
              <Link href="/motion/deadlift-pose-estimation" className={linkCls}>
                deadlift detection
              </Link>
              , were on hosts the build environment could not reach on {FORM_RULES_FETCHED_ON}. Their numbers
              are not copied until a fetched copy can be quoted, which is why the deadlift rules are null.
            </li>
            <li>
              Every source measures 2D angles in the image, from one model and one camera setup its author
              chose. A threshold that suits a side-on phone at hip height can fail from the front. The values
              are starting points to test, not a standard of correct form, and nothing here is coaching or
              medical advice.
            </li>
            <li>
              Sources count a rep at different points of the movement; the &ldquo;meaning&rdquo; column says
              where, in the source&rsquo;s own terms where they differ from the rep counter&rsquo;s.
            </li>
          </ul>
        </section>

        <p className="mt-8 text-sm text-[var(--muted)]">
          An open dataset from {site.name}, CC BY 4.0, listed with the others on{" "}
          <Link href="/datasets" className={linkCls}>
            open datasets
          </Link>
          . Test a rule with{" "}
          <Link href="/tools/rep-counter-playground" className={linkCls}>
            the rep counter playground
          </Link>
          ; the method behind it is{" "}
          <Link href="/motion/how-form-feedback-works" className={linkCls}>
            how form feedback works
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
