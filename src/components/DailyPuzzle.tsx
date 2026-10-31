"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  KIND_LABEL,
  QUESTIONS_PER_DAY,
  addDays,
  puzzleFor,
  puzzleNumber,
  score,
  shareText,
  streak,
  utcDate,
  type DailyBank,
  type Puzzle,
  type Question,
} from "@/lib/dailyPuzzle";

/**
 * The /daily game. Everything is computed in the browser from the bank the
 * page passes in: the UTC date picks the puzzle (src/lib/dailyPuzzle.ts), and
 * the only state is the reader's own picks, kept in localStorage. Storage can
 * be missing or throw (private windows, blocked site data), so every access is
 * wrapped and the game still plays — it just forgets on reload.
 */

const STORE_KEY = "aifitnessapi:daily:v1";
const KEEP_DAYS = 120;

type Picks = (number | null)[];
type Store = { v: 1; days: Record<string, Picks> };

function readStore(): Store {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return { v: 1, days: {} };
    const parsed = JSON.parse(raw) as Store;
    if (parsed && parsed.v === 1 && parsed.days && typeof parsed.days === "object") return parsed;
  } catch {
    /* unreadable or blocked: start empty */
  }
  return { v: 1, days: {} };
}

function writeStore(s: Store, today: string) {
  try {
    const cutoff = addDays(today, -KEEP_DAYS);
    const days = Object.fromEntries(Object.entries(s.days).filter(([d]) => d >= cutoff));
    window.localStorage.setItem(STORE_KEY, JSON.stringify({ v: 1, days }));
  } catch {
    /* storage full or blocked: the round still plays */
  }
}

const isDone = (p: Picks | undefined) =>
  !!p && p.length === QUESTIONS_PER_DAY && p.every((x) => typeof x === "number");

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function untilNext(now: Date): string {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  const mins = Math.max(0, Math.ceil((next - now.getTime()) / 60_000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

const LINK = "font-medium text-brand-600 hover:text-brand-500";

function Subject({ q }: { q: Question }) {
  return q.subjectIsQuote ? (
    <blockquote className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-base leading-relaxed text-[var(--fg)]">
      &ldquo;{q.subject}&rdquo;
    </blockquote>
  ) : (
    <p className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <code className="break-all font-mono text-sm text-[var(--fg)]">{q.subject}</code>
    </p>
  );
}

function AnswerList({ puzzle, picks, testId }: { puzzle: Puzzle; picks?: Picks; testId: string }) {
  return (
    <ol className="mt-4 space-y-4" data-testid={testId}>
      {puzzle.questions.map((q, i) => {
        const pick = picks?.[i];
        const right = pick === q.correct;
        return (
          <li key={q.id} className="rounded-xl border border-[var(--border)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {i + 1}. {KIND_LABEL[q.kind]}
              {typeof pick === "number" && (
                <span className={right ? "ml-2 text-emerald-600" : "ml-2 text-rose-600"}>
                  {right ? "· you got it" : `· you picked ${q.options[pick]}`}
                </span>
              )}
            </p>
            <p className="mt-2 text-sm text-[var(--fg)]">
              {q.subjectIsQuote ? <>&ldquo;{q.subject}&rdquo;</> : <code className="break-all font-mono text-[13px]">{q.subject}</code>}
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--fg)]">
              Answer: <span className="font-mono text-[13px]">{q.answer}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              <span className="font-medium text-[var(--fg)]">{q.evidenceBy}:</span>{" "}
              {q.evidenceIsQuote ? <q className="italic">{q.evidence}</q> : q.evidence}
            </p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href={q.href} className={LINK}>
                {q.hrefLabel} →
              </Link>
              {q.sourceUrl && (
                <a href={q.sourceUrl} rel="nofollow" className="text-[var(--muted)] hover:text-[var(--fg)]">
                  Vendor source
                </a>
              )}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export default function DailyPuzzle({ bank, url }: { bank: DailyBank; url: string }) {
  const [today, setToday] = useState<string | null>(null);
  const [store, setStore] = useState<Store>({ v: 1, days: {} });
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");
  const [showYesterday, setShowYesterday] = useState(false);
  const [clock, setClock] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    const d = utcDate(now);
    const s = readStore();
    setToday(d);
    setStore(s);
    setClock(now);
    const p = s.days[d];
    const firstOpen = p ? p.findIndex((x) => typeof x !== "number") : 0;
    setCurrent(firstOpen === -1 ? QUESTIONS_PER_DAY : Math.max(0, firstOpen));
    const t = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const puzzle = useMemo(() => (today ? puzzleFor(today, bank) : null), [today, bank]);
  const yesterday = useMemo(() => {
    if (!today) return null;
    const y = addDays(today, -1);
    return puzzleNumber(y) >= 1 ? puzzleFor(y, bank) : null;
  }, [today, bank]);

  if (!today || !puzzle) {
    return (
      <div data-daily-state="loading" className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
        Loading today&rsquo;s puzzle… It is chosen in your browser from the UTC date, so it needs
        JavaScript.
      </div>
    );
  }

  const picks: Picks = store.days[today] ?? Array(QUESTIONS_PER_DAY).fill(null);
  const done = isDone(picks);
  const completed = Object.keys(store.days).filter((d) => isDone(store.days[d]));
  const run = streak(completed, today);
  const text = shareText(puzzle, picks, url);

  function choose(i: number, option: number) {
    if (!today || typeof picks[i] === "number") return;
    const next = [...picks];
    next[i] = option;
    const s: Store = { v: 1, days: { ...store.days, [today]: next } };
    setStore(s);
    writeStore(s, today);
  }

  const q = puzzle.questions[Math.min(current, QUESTIONS_PER_DAY - 1)];
  const pick = picks[current];
  const answered = typeof pick === "number";

  return (
    <div className="mt-8" data-daily-state={done ? "done" : "playing"} data-daily-number={puzzle.number}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--fg)]">
          Puzzle #{puzzle.number} · {today} (UTC)
        </p>
        <p className="text-sm text-[var(--muted)]" data-testid="daily-streak">
          Streak: {run} {run === 1 ? "day" : "days"}
        </p>
      </div>

      <ol className="mt-3 flex gap-1.5" aria-label="Progress">
        {puzzle.questions.map((x, i) => {
          const p = picks[i];
          const state = typeof p !== "number" ? "open" : p === x.correct ? "right" : "wrong";
          return (
            <li
              key={x.id}
              aria-label={`Question ${i + 1}: ${state === "open" ? "not answered" : state}`}
              className={`h-2 flex-1 rounded-full ${
                state === "right" ? "bg-emerald-500" : state === "wrong" ? "bg-rose-500" : i === current ? "bg-brand-400" : "bg-[var(--border)]"
              }`}
            />
          );
        })}
      </ol>

      {current < QUESTIONS_PER_DAY && (
          <section
            data-testid="daily-question"
            data-question-index={current}
            className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Question {current + 1} of {QUESTIONS_PER_DAY} · {KIND_LABEL[q.kind]}
            </p>
            <h2 className="mt-2 text-lg font-bold leading-snug tracking-tight text-[var(--fg)]">{q.prompt}</h2>
            <Subject q={q} />
            <div className="mt-4 grid gap-2" role="group" aria-label="Options">
              {q.options.map((o, k) => {
                const isPick = pick === k;
                const isRight = k === q.correct;
                const tone = !answered
                  ? "border-[var(--border)] hover:border-brand-400 hover:bg-brand-500/5"
                  : isRight
                    ? "border-emerald-500 bg-emerald-500/10"
                    : isPick
                      ? "border-rose-500 bg-rose-500/10"
                      : "border-[var(--border)] opacity-60";
                return (
                  <button
                    key={o}
                    type="button"
                    data-testid="daily-option"
                    disabled={answered}
                    aria-pressed={isPick}
                    onClick={() => choose(current, k)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm text-[var(--fg)] transition-colors ${tone} ${
                      q.kind === "translate" || q.kind === "keypoint" ? "font-mono text-[13px]" : "font-medium"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            <div aria-live="polite" className="mt-4 min-h-6">
              {answered && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className={`text-sm font-semibold ${pick === q.correct ? "text-emerald-600" : "text-rose-600"}`}>
                    {pick === q.correct ? "Right." : "Not this time."}{" "}
                    <span className="font-normal text-[var(--muted)]">
                      Answer: <span className="font-mono text-[13px]">{q.answer}</span>
                    </span>
                  </p>
                  <button
                    type="button"
                    data-testid="daily-next"
                    onClick={() => setCurrent((c) => c + 1)}
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                  >
                    {current + 1 < QUESTIONS_PER_DAY ? "Next question" : "See your result"}
                  </button>
                </div>
              )}
            </div>
          </section>
      )}

      {done && current >= QUESTIONS_PER_DAY && (
        <section data-testid="daily-result" className="mt-6 rounded-2xl border border-brand-400/40 bg-brand-500/5 p-5 sm:p-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            {score(puzzle, picks)} / {QUESTIONS_PER_DAY}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Streak: {run} {run === 1 ? "day" : "days"} · next puzzle in {clock ? untilNext(clock) : "—"} (00:00 UTC)
          </p>
          <pre
            data-testid="daily-share"
            aria-label="Shareable result"
            className="mt-4 whitespace-pre-wrap break-all rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm leading-relaxed text-[var(--fg)]"
          >
            {text}
          </pre>
          <button
            type="button"
            data-testid="daily-copy"
            onClick={async () => {
              setCopied((await copyText(text)) ? "copied" : "failed");
              window.setTimeout(() => setCopied("idle"), 2500);
            }}
            className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
          >
            {copied === "copied" ? "Copied" : copied === "failed" ? "Copy failed: select the text above" : "Copy result"}
          </button>
          <p className="mt-2 text-xs text-[var(--muted)]">The grid shows right and wrong only, so it spoils nothing.</p>

          <h3 className="mt-8 text-lg font-bold tracking-tight text-[var(--fg)]">Today&rsquo;s answers and their sources</h3>
          <AnswerList puzzle={puzzle} picks={picks} testId="daily-answers" />
          <button
            type="button"
            onClick={() => setCurrent(0)}
            className="mt-4 text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)]"
          >
            Review the questions again
          </button>
        </section>
      )}

      {done && current < QUESTIONS_PER_DAY && (
        <p className="mt-4 text-sm">
          <button type="button" onClick={() => setCurrent(QUESTIONS_PER_DAY)} className={LINK}>
            Back to your result →
          </button>
        </p>
      )}

      <section className="mt-10">
        <button
          type="button"
          data-testid="daily-yesterday-toggle"
          aria-expanded={showYesterday}
          onClick={() => setShowYesterday((v) => !v)}
          className="text-sm font-semibold text-brand-600 hover:text-brand-500"
        >
          {showYesterday ? "Hide" : "Show"} yesterday&rsquo;s answers{yesterday ? ` (#${yesterday.number})` : ""}
        </button>
        {showYesterday &&
          (yesterday ? (
            <AnswerList puzzle={yesterday} picks={store.days[yesterday.date]} testId="daily-yesterday" />
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]" data-testid="daily-yesterday">
              Puzzle #1 was the first, so there is no yesterday yet.
            </p>
          ))}
      </section>
    </div>
  );
}
