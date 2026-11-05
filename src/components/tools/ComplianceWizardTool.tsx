"use client";

import Link from "next/link";
import type { PlannerSource, Regime } from "@/data/plannerSources.mjs";
import {
  STORES,
  STORE_LABELS,
  STATUS_LABELS,
  WIZARD_DEFAULT,
  WIZARD_QUESTIONS,
  assessCompliance,
  complianceMarkdown,
  decodeWizard,
  encodeChecklist,
  encodeWizard,
  type Status,
  type WizardAnswers,
} from "@/lib/plannerLogic.mjs";
import { Chip, CopyLink, Field, btn, downloadText, toggle, useUrlState } from "./plannerUi";

/**
 * The compliance wizard. Answers route to the regimes in
 * src/data/plannerSources.mjs; each result shows the status, our one-line
 * reason, the rule's own words with its source, and the /compliance page that
 * explains it. Nothing here is a legal conclusion, and the page says so.
 */

const TONE: Record<Status, string> = {
  likely: "border-brand-400 bg-brand-500/10 text-[var(--fg)]",
  possible: "border-amber-400 bg-amber-500/10 text-[var(--fg)]",
  unlikely: "border-[var(--border)] text-[var(--muted)]",
  check: "border-dashed border-[var(--border)] text-[var(--muted)]",
};

export default function ComplianceWizardTool({
  regimes,
  sources,
  pageLabels,
  origin,
}: {
  regimes: Regime[];
  sources: Record<string, PlannerSource>;
  pageLabels: Record<string, string>;
  origin: string;
}) {
  const [a, setA] = useUrlState<WizardAnswers>(WIZARD_DEFAULT, decodeWizard, encodeWizard);
  const result = assessCompliance(a);
  const byId = Object.fromEntries(regimes.map((r) => [r.id, r]));

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
      {WIZARD_QUESTIONS.map((q) => (
        <Field key={q.id} legend={q.label}>
          {q.options.map(([v, l]) => (
            <Chip key={v} on={a[q.id] === v} onClick={() => setA({ ...a, [q.id]: v })}>
              {l}
            </Chip>
          ))}
        </Field>
      ))}
      <Field legend="Which stores will it ship on?">
        {STORES.map((s) => (
          <Chip key={s} on={a.s.includes(s)} onClick={() => setA({ ...a, s: toggle(a.s, s, STORES) })}>
            {STORE_LABELS[s]}
          </Chip>
        ))}
      </Field>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className={btn}
          onClick={() => downloadText("compliance-map.md", complianceMarkdown(result, regimes, sources, { origin, answers: a }))}
        >
          Download as Markdown
        </button>
        <CopyLink path={`/tools/compliance-wizard${encodeWizard(a)}`} />
      </div>

      <div className="mt-8" aria-live="polite" data-wizard-results={result.length}>
        <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">What your answers point to</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Not legal advice. A status is a routing from your answers to a rule, not a conclusion about your company.
        </p>
        <ul className="mt-4 space-y-4">
          {result.map((f) => {
            const g = byId[f.id];
            if (!g) return null;
            return (
              <li key={f.id} className={`rounded-xl border p-4 ${TONE[f.status]}`}>
                <p className="text-sm">
                  <span className="font-semibold text-[var(--fg)]">{g.name}</span>{" "}
                  <span className="ml-1 rounded-full border border-current px-2 py-0.5 text-xs">{STATUS_LABELS[f.status]}</span>
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">{f.reason}</p>
                {g.quotes.map((q, i) => (
                  <blockquote key={i} className="mt-3 border-l-2 border-brand-400 pl-3 text-sm text-[var(--muted)]">
                    {q.quote}{" "}
                    <a href={sources[q.source].url} rel="noopener" className="whitespace-nowrap text-xs font-medium text-brand-600 hover:text-brand-500">
                      ({sources[q.source].publisher})
                    </a>
                  </blockquote>
                ))}
                {pageLabels[g.page] ? (
                  <p className="mt-3 text-sm">
                    <Link href={g.page} className="font-medium text-brand-600 hover:text-brand-500">
                      {pageLabels[g.page]} →
                    </Link>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        {a.s.length > 0 && (
          <p className="mt-4 text-sm text-[var(--muted)]">
            The store rules item by item, with progress you can tick off:{" "}
            <Link href={`/tools/store-submission-checklist${encodeChecklist({ stores: a.s, traits: a.med === "yes" ? ["medical"] : [] })}`} className="font-medium text-brand-600 hover:text-brand-500">
              the store submission checklist
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
