"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";
import {
  API_OPTIONS,
  DATA_OPTIONS,
  DESTINATION_LABELS,
  FETCHED_ON,
  MODE_OPTIONS,
  RUNTIME_OPTIONS,
  SOURCES,
  fromQuery,
  isComplete,
  resolve,
  toQuery,
  type Api,
  type DataKind,
  type PartialAnswers,
  type Quote,
} from "@/lib/migrationWizard";

/**
 * "Where does my Google Fit / Fitbit integration migrate to?" — four
 * questions, one answer, every rule quoted from Google with its source and
 * read date (logic and quotes: src/lib/migrationWizard.ts). Client-only, no
 * network calls. The answer lives in the query string so a PM can paste it
 * into a thread; read from window rather than useSearchParams so the host
 * page stays statically rendered.
 */

const QUESTIONS = [
  "Which API do you use today?",
  "Where does that code run?",
  "Which data types?",
  "Do you write data, or only read it?",
] as const;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function firstOpenStep(a: PartialAnswers): number {
  if (!a.api) return 0;
  if (!a.runtime) return 1;
  if (!a.data || !a.data.length) return 2;
  return 3;
}

function Cite({ q }: { q: Quote }) {
  const s = SOURCES[q.source];
  return (
    <blockquote className="mt-2 border-l-2 border-brand-400/50 pl-3 text-sm italic text-[var(--muted)]">
      &ldquo;{q.text}&rdquo;{" "}
      <a href={s.url} rel="nofollow noreferrer" target="_blank" className="not-italic underline hover:text-[var(--fg)]">
        {s.title.replace(/ \(.*\)$/, "")}
      </a>
    </blockquote>
  );
}

const btn =
  "flex h-full w-full flex-col rounded-xl border p-4 text-left transition-colors hover:border-brand-400 hover:bg-[var(--bg)]";
const small =
  "rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]";

export default function MigrationWizard({ first, currentPath }: { first?: Api; currentPath: string }) {
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const a = fromQuery(window.location.search);
    if (a.api || a.runtime || a.data || a.mode) {
      setAnswers(a);
      setStep(firstOpenStep(a));
    }
  }, []);

  const query = toQuery(answers);
  useEffect(() => {
    const next = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    if (window.location.pathname + window.location.search !== next) {
      window.history.replaceState(null, "", next + window.location.hash);
    }
  }, [query]);

  const apiOptions = first
    ? [...API_OPTIONS.filter((o) => o.value === first), ...API_OPTIONS.filter((o) => o.value !== first)]
    : API_OPTIONS;

  const set = (patch: PartialAnswers, nextStep?: number) => {
    setCopied(false);
    setAnswers((a) => ({ ...a, ...patch }));
    if (nextStep !== undefined) setStep(nextStep);
  };

  const toggleData = (d: DataKind) => {
    const cur = answers.data ?? [];
    set({ data: cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d] });
  };

  const restart = () => {
    setCopied(false);
    setAnswers({});
    setStep(0);
  };

  const shell = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7";

  if (isComplete(answers)) {
    const r = resolve(answers);
    const reading = r.reading.filter((l) => l.href !== currentPath);
    return (
      <div className={shell} data-wizard="result">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Your migration path
        </p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-[var(--fg)]" data-wizard-destination>
          {r.destinations.map((d) => DESTINATION_LABELS[d]).join(" + ")}
        </h3>
        <p className="mt-2 text-[var(--muted)]">{r.summary}</p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          For: {API_OPTIONS.find((o) => o.value === answers.api)?.label} ·{" "}
          {RUNTIME_OPTIONS.find((o) => o.value === answers.runtime)?.label} ·{" "}
          {answers.data.map((d) => DATA_OPTIONS.find((o) => o.value === d)?.label).join(", ")} ·{" "}
          {MODE_OPTIONS.find((o) => o.value === answers.mode)?.label}
        </p>

        <div className="mt-5 rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm font-semibold text-[var(--fg)]">Deadline: {r.deadline.label}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{r.deadline.detail}</p>
          {r.deadline.quote && <Cite q={r.deadline.quote} />}
        </div>

        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">What Google says</h4>
        {r.rule.map((q) => (
          <Cite key={q.text} q={q} />
        ))}

        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Steps</h4>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-[var(--fg)]">
          {r.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        {r.notes.length > 0 && (
          <>
            <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Check before you start</h4>
            <ul className="mt-2 space-y-3 text-sm text-[var(--fg)]">
              {r.notes.map((n) => (
                <li key={n.text + (n.quote?.text ?? "")}>
                  {n.text}
                  {n.quote && <Cite q={n.quote} />}
                </li>
              ))}
            </ul>
          </>
        )}

        {reading.length > 0 && (
          <>
            <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Read next</h4>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {reading.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => track("migration-wizard-result", "spoke-inline")}
                    className="block h-full rounded-xl border border-[var(--border)] p-3 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--bg)]"
                  >
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-6 text-xs leading-relaxed text-[var(--muted)]">
          <p className="font-semibold">Sources, read {longDate(FETCHED_ON)}:</p>
          <ul className="mt-1 space-y-1">
            {r.sources.map((k) => (
              <li key={k}>
                <a href={SOURCES[k].url} rel="nofollow noreferrer" target="_blank" className="underline hover:text-[var(--fg)]">
                  {SOURCES[k].title}
                </a>{" "}
                (last updated {longDate(SOURCES[k].lastUpdated)}) — {SOURCES[k].url}
              </li>
            ))}
          </ul>
          <p className="mt-2">
            Where Google&rsquo;s pages don&rsquo;t cover a case, this says so instead of guessing. Check the current pages
            before you commit a schedule.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={restart} className={small}>
            ↺ Start over
          </button>
          <button type="button" onClick={() => set({ mode: undefined }, 3)} className={small}>
            ← Change answers
          </button>
          <button
            type="button"
            data-wizard-copy
            onClick={() => {
              const url = `${window.location.origin}${window.location.pathname}?${query}`;
              navigator.clipboard
                .writeText(url)
                .then(() => setCopied(true))
                .catch(() => setCopied(false));
            }}
            className={small}
          >
            {copied ? "Link copied" : "Copy link to this answer"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={shell} data-wizard="question">
      <div className="flex items-center gap-2">
        {QUESTIONS.map((_, i) => (
          <span key={i} aria-hidden className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-500" : "bg-[var(--border)]"}`} />
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Question {step + 1} of {QUESTIONS.length}
      </p>
      <h3 className="mt-1 text-xl font-bold tracking-tight text-[var(--fg)]">{QUESTIONS[step]}</h3>

      {step === 0 && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {apiOptions.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                data-option={o.value}
                onClick={() => set({ api: o.value }, 1)}
                className={`${btn} ${answers.api === o.value ? "border-brand-400" : "border-[var(--border)]"}`}
              >
                <span className="font-semibold text-[var(--fg)]">{o.label}</span>
                <span className="mt-1 text-sm text-[var(--muted)]">{o.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {step === 1 && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {RUNTIME_OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                data-option={o.value}
                onClick={() => set({ runtime: o.value }, 2)}
                className={`${btn} font-semibold text-[var(--fg)] ${answers.runtime === o.value ? "border-brand-400" : "border-[var(--border)]"}`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {step === 2 && (
        <>
          <p className="mt-1 text-sm text-[var(--muted)]">Pick all that apply.</p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {DATA_OPTIONS.map((o) => {
              const on = (answers.data ?? []).includes(o.value);
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    data-option={o.value}
                    aria-pressed={on}
                    onClick={() => toggleData(o.value)}
                    className={`${btn} font-semibold text-[var(--fg)] ${on ? "border-brand-400 bg-brand-500/10" : "border-[var(--border)]"}`}
                  >
                    {on ? "✓ " : ""}
                    {o.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            data-wizard-next
            disabled={!(answers.data ?? []).length}
            onClick={() => setStep(3)}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue →
          </button>
        </>
      )}

      {step === 3 && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {MODE_OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                data-option={o.value}
                onClick={() => set({ mode: o.value })}
                className={`${btn} border-[var(--border)] font-semibold text-[var(--fg)]`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="mt-5 block text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
        >
          ← Back
        </button>
      )}
      <p className="mt-5 text-xs text-[var(--muted)]">
        Runs in your browser; nothing is sent anywhere. Every answer quotes Google&rsquo;s migration pages, read{" "}
        {longDate(FETCHED_ON)}.
      </p>
    </div>
  );
}
