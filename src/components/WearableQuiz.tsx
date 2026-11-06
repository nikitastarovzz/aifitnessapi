"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ShareRow from "@/components/ShareRow";
import { QUESTIONS, decide, decodeAnswers, encodeAnswers, isComplete, type QuizAnswers } from "@/lib/wearableQuiz.mjs";

/**
 * The quiz itself (/quiz/which-wearable-api). Eight questions, one at a time;
 * the decision is src/lib/wearableQuiz.mjs, run in the browser. The answers
 * live only in the address (?a=<eight digits>), so a copied link reproduces
 * the result; the share buttons send the result's own static page, which has
 * its own card.
 *
 * The server renders the first question; without JavaScript the page still
 * lists every result page below the quiz.
 */

type Summary = { slug: string; label: string; verdict: string; share: string };

export default function WearableQuiz({ outcomes, origin }: { outcomes: Summary[]; origin: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  useEffect(() => {
    const shared = decodeAnswers(window.location.search);
    if (shared) {
      setAnswers(shared);
      setStep(QUESTIONS.length);
    }
  }, []);

  useEffect(() => {
    const q = isComplete(answers) ? encodeAnswers(answers) : "";
    const next = `${window.location.pathname}${q}`;
    if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", next);
  }, [answers]);

  const done = isComplete(answers);
  const result = done ? decide(answers) : null;
  const byslug = new Map(outcomes.map((o) => [o.slug, o]));

  function answer(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
    setStep((s) => s + 1);
  }
  function restart() {
    setAnswers({});
    setStep(0);
  }

  const box = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8";

  if (result) {
    const o = byslug.get(result.outcome)!;
    const runner = result.runnerUp ? byslug.get(result.runnerUp) : null;
    const resultUrl = `${origin}/quiz/which-wearable-api/${o.slug}`;
    return (
      <div className={box} data-quiz-result={o.slug}>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">Your result</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--fg)]">{o.label}</h2>
        <p className="mt-3 text-[var(--muted)]">{o.verdict}</p>
        <h3 className="mt-5 text-sm font-semibold text-[var(--fg)]">Why, from your answers (our judgment)</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          {result.reasons.map((r) => (
            <li key={r}>{r}.</li>
          ))}
        </ul>
        {runner && (
          <p className="mt-4 text-sm text-[var(--muted)]">
            Runner-up:{" "}
            <Link href={`/quiz/which-wearable-api/${runner.slug}`} className="font-medium text-brand-600 hover:text-brand-500">
              {runner.label}
            </Link>{" "}
            (scores: platform stores {result.scores.store}, direct APIs {result.scores.direct}, aggregator {result.scores.aggregator}).
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={`/quiz/which-wearable-api/${o.slug}`}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
            data-cta="quiz-result-page"
            data-cta-source="quiz"
          >
            Open the full result, with sources →
          </Link>
          <button
            type="button"
            onClick={restart}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:border-brand-400"
          >
            Start over
          </button>
        </div>
        <ShareRow place="quiz" url={resultUrl} text={o.share} label="Share your result" />
      </div>
    );
  }

  const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  return (
    <div className={box} data-quiz-step={step + 1}>
      <div className="flex items-center gap-1.5" aria-hidden>
        {QUESTIONS.map((x, i) => (
          <span key={x.id} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-500" : "bg-[var(--border)]"}`} />
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Question {step + 1} of {QUESTIONS.length}
      </p>
      <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--fg)] sm:text-2xl">{q.label}</h2>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {q.options.map(([value, label]) => (
          <li key={value}>
            <button
              type="button"
              onClick={() => answer(q.id, value)}
              aria-pressed={answers[q.id] === value}
              data-quiz-option={`${q.id}:${value}`}
              className={`flex h-full w-full items-center rounded-xl border p-3 text-left text-sm font-medium transition-colors ${
                answers[q.id] === value
                  ? "border-brand-400 bg-brand-500/10 text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--fg)] hover:border-brand-400 hover:bg-[var(--bg)]"
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
      {step > 0 && (
        <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-5 text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)]">
          ← Back
        </button>
      )}
    </div>
  );
}
