import { Fragment } from "react";
import Link from "next/link";
import { hubGlance, hubQa, type HubPath, type Seg } from "@/data/hubGlance";

/**
 * The "at a glance" table and direct-answer block on a section hub
 * (ops/SEO-10-2026-10-27.md #9). Everything rendered here comes from
 * src/data/hubGlance.ts, which reads the cost model and released capsules;
 * the `data-glance` keys are what scripts/qa.mjs holds to those sources.
 */
function Segs({ segs, links = true }: { segs: Seg[]; links?: boolean }) {
  return (
    <>
      {segs.map((s, i) => {
        if (s.href && links) {
          return (
            <Link key={i} href={s.href} data-glance={s.source} className="text-brand-600 hover:text-brand-500">
              {s.text}
            </Link>
          );
        }
        if (s.source) {
          return (
            <span key={i} data-glance={s.source}>
              {s.text}
            </span>
          );
        }
        return <Fragment key={i}>{s.text}</Fragment>;
      })}
    </>
  );
}

export function HubGlanceTable({ hub }: { hub: HubPath }) {
  const g = hubGlance(hub);
  const groupAt = new Map((g.groups ?? []).map((x) => [x.at, x.label]));
  return (
    <section id="at-a-glance" data-hub-glance={hub} className="mt-14">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{g.heading}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{g.intro}</p>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <thead className="bg-[var(--surface)]">
            <tr>
              {g.columns.map((c) => (
                <th key={c} scope="col" className="px-3 py-2 font-semibold text-[var(--fg)]">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {g.rows.map((r, i) => (
              <Fragment key={r.id}>
                {groupAt.has(i) && (
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={g.columns.length}
                      className="border-t border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
                    >
                      {groupAt.get(i)}
                    </th>
                  </tr>
                )}
                <tr id={r.id} data-glance-row="" className="scroll-mt-24 border-t border-[var(--border)] align-top">
                  {r.cells.map((cell, j) => (
                    <td key={j} className={`px-3 py-2 ${j === 0 ? "font-medium text-[var(--fg)]" : "text-[var(--muted)]"}`}>
                      <Segs segs={cell} />
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">{g.footnote}</p>
    </section>
  );
}

export function HubDirectAnswers({ hub }: { hub: HubPath }) {
  const qa = hubQa(hub);
  return (
    <section id="direct-answers" className="mt-14">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Direct answers</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Questions worded after what developers search for. Every sentence is quoted from the linked page or this
        site&rsquo;s cost model; a question another page owns points there instead.
      </p>
      <div className="mt-6 divide-y divide-[var(--border)]">
        {qa.map((q) => (
          <div key={q.id} id={q.id} data-hub-qa={q.kind} className="scroll-mt-24 py-5">
            <h3 className="font-semibold text-[var(--fg)]">{q.q}</h3>
            {q.kind === "route" && <p className="mt-2 text-sm text-[var(--muted)]">Answered on its own page:</p>}
            <ul className="mt-2 list-disc space-y-2 pl-5 text-[var(--muted)]">
              {q.parts.map((p, i) => (
                <li key={i} data-qa-part={p.href}>
                  <Segs segs={p.segs} links={false} />{" "}
                  <Link href={p.href} className="text-sm text-brand-600 hover:text-brand-500">
                    ({p.label})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
