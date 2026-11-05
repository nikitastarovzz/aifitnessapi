import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ToolNextStep from "@/components/ToolNextStep";
import TaxonomyTable from "@/components/tools/TaxonomyTable";
import { ET_DATABASES, ET_EXERCISE_MATCHES, ET_FETCHED_ON, ET_RULE, ET_SOURCES } from "@/data/exerciseTaxonomy";
import {
  TAXONOMY_DATASET,
  TAXONOMY_DESCRIPTION,
  TAXONOMY_H1,
  TAXONOMY_PATH,
  TAXONOMY_TITLE,
  constantLinks,
  taxonomyCapsule,
  taxonomyLimits,
  taxonomyRows,
  taxonomyCounts,
} from "@/lib/audienceTools";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { toolGraph } from "@/lib/schema";

/**
 * /tools/exercise-taxonomy-crosswalk — ops/AUDIENCE-30-2026-11-05.md item 27.
 * Everything here is read from src/data/exerciseTaxonomy.ts, which
 * scripts/fetch-exercise-taxonomy.mjs generates; the match rule is ET_RULE and
 * nothing is joined by meaning.
 */

export const metadata: Metadata = {
  title: { absolute: TAXONOMY_TITLE },
  description: TAXONOMY_DESCRIPTION,
  alternates: pageMirrorAlternates(TAXONOMY_PATH),
  openGraph: { type: "website", title: TAXONOMY_TITLE, description: TAXONOMY_DESCRIPTION, url: TAXONOMY_PATH, images: ["/opengraph-image"] },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const H2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";

export default function ExerciseTaxonomyCrosswalkPage() {
  const jsonLd = toolGraph({
    path: TAXONOMY_PATH,
    name: TAXONOMY_TITLE,
    alternativeHeadline: "ExerciseDB wger free-exercise-db to HealthKit and Health Connect mapping",
    description: TAXONOMY_DESCRIPTION,
    datePublished: ET_FETCHED_ON,
    dateModified: ET_FETCHED_ON,
    webPage: { lastReviewed: ET_FETCHED_ON },
  });
  const c = taxonomyCounts();

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Exercise taxonomy crosswalk", path: TAXONOMY_PATH },
          ]}
        />
        <ClusterHero label="Open Dataset" seed={8} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{TAXONOMY_H1}</h1>
        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {taxonomyCapsule()}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a href={`/datasets/${TAXONOMY_DATASET}.json`} className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
            Download JSON
          </a>
          <a href={`/datasets/${TAXONOMY_DATASET}.csv`} className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
            Download CSV
          </a>
          <Link href="/workout-types" className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
            Workout types on four platforms
          </Link>
        </div>

        <section data-tool="exercise-taxonomy-crosswalk" aria-label="Exercise taxonomy terms">
          <TaxonomyTable rows={taxonomyRows()} />
        </section>

        <section id="exercises" className="mt-14 scroll-mt-20">
          <h2 className={H2}>Exercise names that match a workout or segment type</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Of free-exercise-db&rsquo;s {c.exercisesRead} exercise names, {c.exercises} have exactly the same normalized name as a
            HealthKit or Health Connect constant.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-3">Exercise</th>
                  <th className="py-2 pr-3">Its category and equipment</th>
                  <th className="py-2">Same name</th>
                </tr>
              </thead>
              <tbody>
                {ET_EXERCISE_MATCHES.map((e) => (
                  <tr key={e.exerciseId} className="border-t border-[var(--border)] align-top text-[var(--fg)]">
                    <td className="py-2 pr-3 font-medium">{e.name}</td>
                    <td className="py-2 pr-3 text-xs">{[e.category, e.equipment].filter(Boolean).join(" · ")}</td>
                    <td className="py-2 text-xs">
                      {constantLinks(e).map((l) => (
                        <span key={l.href} className="block">
                          <a href={l.href} className="break-all font-mono text-brand-600 hover:text-brand-500">
                            {l.name}
                          </a>{" "}
                          <span className="text-[var(--muted)]">({l.label})</span>
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14">
          <h2 className={H2}>The three databases and their licenses</h2>
          <ul className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
            {ET_DATABASES.map((d) => (
              <li key={d.id}>
                <a href={d.home} className={linkCls} rel="noopener">
                  {d.name}
                </a>
                : {d.license}. Its license file or README says: <q>{d.licenseQuote}</q> {d.read}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className={H2}>How the crosswalk is built, and its limits</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>{ET_RULE}</li>
            {taxonomyLimits().map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <h3 className="mt-6 text-lg font-semibold text-[var(--fg)]">Sources read</h3>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {ET_SOURCES.map((s) => (
              <li key={s.id}>
                {s.url ? (
                  <a href={s.page} className={linkCls} rel="noopener">
                    {s.title}
                  </a>
                ) : (
                  <Link href={s.page} className={linkCls}>
                    {s.title}
                  </Link>
                )}
                , read {s.fetchedOn}
                {s.via.startsWith("source-snapshot") ? ` through ${s.via}` : ""}
              </li>
            ))}
          </ul>
        </section>

        <ToolNextStep path={TAXONOMY_PATH} />
      </div>
    </Container>
  );
}
