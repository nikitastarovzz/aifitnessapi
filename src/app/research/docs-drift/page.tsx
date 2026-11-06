import type { Metadata } from "next";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import ResearchStudy from "@/components/ResearchStudy";
import ResearchTable from "@/components/ResearchTable";
import { HBarChart } from "@/components/ResearchCharts";
import { DRIFT_GROUPS } from "@/data/researchStudies";
import { DRIFT_PATH, driftFindings, driftStudy } from "@/lib/researchPages";

/**
 * /research/docs-drift — how often the vendor pages behind this site's quotes
 * changed (ops/VIRAL-20-2026-11-06.md item 1). Rows: src/data/researchStudies.ts
 * (scripts/build-research.mjs, from the git history of ops/sources/evidence);
 * figures: src/lib/researchStats.mjs; words: src/lib/researchPages.ts.
 */

const study = driftStudy();

export const metadata: Metadata = {
  title: { absolute: study.metaTitle },
  description: study.description,
  alternates: pageMirrorAlternates(DRIFT_PATH),
  openGraph: { type: "article", title: study.h1, description: study.description, url: DRIFT_PATH },
};

export default function DocsDriftPage() {
  const f = driftFindings();
  const h2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";
  const p = "mt-3 leading-relaxed text-[var(--muted)]";
  return (
    <ResearchStudy study={study} rows={DRIFT_GROUPS.length}>
      <section className="mt-12" id="by-date">
        <h2 className={h2}>Source changes by commit</h2>
        <p className={p}>{f.endedText}</p>
        <p className={p}>{f.byDateIntro}</p>
        <figure className="mt-5">
          <HBarChart
            id="drift-by-date"
            title="Hosts with a recorded source change, per commit"
            rows={f.byDate.map((d) => ({ label: `${d.date} (${d.commit})`, value: d.hosts, display: `${d.hosts} ${d.hosts === 1 ? "host" : "hosts"}, ${d.rows} rows` }))}
          />
        </figure>
        <ResearchTable
          caption="Source changes per commit"
          head={["Date", "Commit", "Hosts", "Rows replaced"]}
          rows={f.byDate.map((d) => [d.date, <code key="c">{d.commit}</code>, d.hosts, d.rows])}
        />
      </section>

      <section className="mt-12" id="by-host">
        <h2 className={h2}>Hosts whose sources changed</h2>
        <p className={p}>{f.hostsIntro}</p>
        <ResearchTable
          caption="Hosts with source changes"
          head={["Host", "Source changes", "Rows replaced", "Rows written"]}
          rows={f.bySource.map((s) => [<code key="h">{s.source}</code>, s.driftEvents, s.driftRows, s.rows])}
        />
      </section>

      <section className="mt-12" id="kinds">
        <h2 className={h2}>Fact or wording</h2>
        <p className={p}>{f.kindsText}</p>
        <ResearchTable
          caption="Every recorded source change"
          head={["Date", "Commit", "Host", "Kind", "Rows"]}
          rows={f.events.map((e) => [e.dateLabel, <code key="c">{e.commit}</code>, <code key="h">{e.source}</code>, e.kindLabel, e.rows])}
        />
      </section>
    </ResearchStudy>
  );
}
