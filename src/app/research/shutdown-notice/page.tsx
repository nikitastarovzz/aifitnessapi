import type { Metadata } from "next";
import Link from "next/link";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import ResearchStudy from "@/components/ResearchStudy";
import ResearchTable from "@/components/ResearchTable";
import { HBarChart } from "@/components/ResearchCharts";
import { NOTICE_ROWS } from "@/data/researchStudies";
import { NOTICE_PATH, noticeFindings, noticeStudy } from "@/lib/researchPages";

/**
 * /research/shutdown-notice — days from a vendor's dated announcement to the
 * end it announced, per graveyard entry (ops/VIRAL-20-2026-11-06.md item 2).
 * Rows: src/data/researchStudies.ts (scripts/build-research.mjs, from
 * src/data/graveyard.ts, src/data/changes.ts and
 * ops/research/shutdown-announcements.json); figures: src/lib/researchStats.mjs.
 */

const study = noticeStudy();

export const metadata: Metadata = {
  title: { absolute: study.metaTitle },
  description: study.description,
  alternates: pageMirrorAlternates(NOTICE_PATH),
  openGraph: { type: "article", title: study.h1, description: study.description, url: NOTICE_PATH },
};

export default function ShutdownNoticePage() {
  const f = noticeFindings();
  const h2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";
  const p = "mt-3 leading-relaxed text-[var(--muted)]";
  const link = "font-medium text-brand-600 hover:text-brand-500";
  return (
    <ResearchStudy study={study} rows={NOTICE_ROWS.length}>
      <section className="mt-12" id="measured">
        <h2 className={h2}>Notice measured</h2>
        <p className={p}>{f.measuredIntro}</p>
        <figure className="mt-5">
          <HBarChart
            id="notice-days"
            title="Days of notice per measured graveyard entry"
            rows={f.measured.map((r) => ({ label: r.name, value: r.noticeDays as number, display: `${r.noticeDays} days` }))}
          />
        </figure>
        <ResearchTable
          caption="Measured notice periods"
          head={["Entry", "Vendor", "Announced", "End", "Notice", "How the announcement is dated"]}
          rows={f.measured.map((r) => [
            <Link key="n" href={r.page} className={link}>
              {r.name}
            </Link>,
            r.vendor,
            r.announcedLabel,
            r.endDateLabel,
            `${r.noticeDays} days`,
            r.announcementUrl ? (
              <a key="h" href={r.announcementUrl} className={link}>
                {r.how}
              </a>
            ) : (
              r.how
            ),
          ])}
        />
      </section>

      <section className="mt-12" id="excluded">
        <h2 className={h2}>Entries left out</h2>
        <p className={p}>{f.excludedIntro}</p>
        <ResearchTable
          caption="Graveyard entries without a measurable notice period"
          head={["Entry", "Vendor", "End", "Reason", "What the pages say"]}
          rows={f.excluded.map((r) => [
            <Link key="n" href={r.page} className={link}>
              {r.name}
            </Link>,
            r.vendor,
            r.endDateLabel,
            r.exclusion,
            r.note,
          ])}
        />
      </section>
    </ResearchStudy>
  );
}
