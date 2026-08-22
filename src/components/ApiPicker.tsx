"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";
import {
  recommend,
  JOB_OPTIONS,
  PLATFORM_OPTIONS,
  PRIORITY_OPTIONS,
  type Job,
  type Platform,
  type Priority,
} from "@/lib/picker";

/**
 * Interactive "which fitness API should I use?" picker. Three questions (the job,
 * the platform, the top priority) produce a tailored recommendation that links
 * into the site's comparison, integration, pricing, and compliance content. It's
 * a navigation/decision layer over the whole hub — honest and independent, it
 * routes to guidance rather than pushing any product. Renders on the server for
 * the first step (SEO) and hydrates for interactivity.
 */

const STEPS = ["What are you building?", "Which platform?", "What matters most?"] as const;

/** Query-string keys for a shareable answer. Short on purpose: the URL is
 *  meant to be pasted into a thread. */
const JOBS = new Set(JOB_OPTIONS.map((o) => o.value as string));
const PLATFORMS = new Set(PLATFORM_OPTIONS.map((o) => o.value as string));
const PRIORITIES = new Set(PRIORITY_OPTIONS.map((o) => o.value as string));

export default function ApiPicker() {
  const [step, setStep] = useState(0);
  const [job, setJob] = useState<Job | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [copied, setCopied] = useState(false);

  // A recommendation somebody wants to argue with is a recommendation they
  // want to send to a colleague, so the answer lives in the URL. Read from
  // window rather than useSearchParams: this is a client-only concern and it
  // keeps the page statically rendered.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const j = q.get("j");
    const p = q.get("p");
    const pr = q.get("pr");
    if (j && JOBS.has(j)) setJob(j as Job);
    if (p && PLATFORMS.has(p)) setPlatform(p as Platform);
    if (pr && PRIORITIES.has(pr)) setPriority(pr as Priority);
  }, []);

  const result = job && platform && priority ? recommend(job, platform, priority) : null;

  const query =
    job && platform && priority ? `j=${job}&p=${platform}&pr=${priority}` : "";

  // Keep the address bar in step with the answer on screen, without adding a
  // history entry per click.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    if (window.location.pathname + window.location.search !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [query]);

  function restart() {
    setCopied(false);
    setStep(0);
    setJob(null);
    setPlatform(null);
    setPriority(null);
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Our suggestion
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--fg)]">{result.title}</h2>
        <p className="mt-3 text-[var(--muted)]">{result.body}</p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {result.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => track("picker-result", "spoke-inline")}
                className={`flex h-full items-center justify-between gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                  l.primary
                    ? "border-brand-400 bg-brand-500/10 text-[var(--fg)] hover:bg-brand-500/20"
                    : "border-[var(--border)] text-[var(--fg)] hover:border-brand-400 hover:bg-[var(--bg)]"
                }`}
              >
                <span>
                  {l.primary && <span className="mr-1 text-brand-600 dark:text-brand-300">Start here →</span>}
                  {l.label}
                </span>
                {!l.primary && <span aria-hidden className="text-[var(--muted)]">→</span>}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs text-[var(--muted)]">
          A starting point, not a verdict — every project is different. Nobody pays for placement here;
          the site is funded by KinesteX, and any page featuring it says so up front.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={restart}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]"
          >
            ↺ Start over
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                .writeText(`${window.location.origin}/picker?${query}`)
                .then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                })
                .catch(() => setCopied(false));
            }}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]"
          >
            {copied ? "Link copied" : "Copy link to this answer"}
          </button>
          <a
            href={`/s?t=picker&${query}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]"
          >
            Share card
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        {STEPS.map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-500" : "bg-[var(--border)]"}`}
          />
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Step {step + 1} of {STEPS.length}
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">{STEPS[step]}</h2>

      {step === 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {JOB_OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  setJob(o.value);
                  setStep(1);
                }}
                className="flex h-full w-full flex-col rounded-xl border border-[var(--border)] p-4 text-left transition-colors hover:border-brand-400 hover:bg-[var(--bg)]"
              >
                <span className="font-semibold text-[var(--fg)]">{o.label}</span>
                <span className="mt-1 text-sm text-[var(--muted)]">{o.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {step === 1 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {PLATFORM_OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  setPlatform(o.value);
                  setStep(2);
                }}
                className="flex h-full w-full items-center rounded-xl border border-[var(--border)] p-4 text-left font-semibold text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--bg)]"
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {step === 2 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {PRIORITY_OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => setPriority(o.value)}
                className="flex h-full w-full flex-col rounded-xl border border-[var(--border)] p-4 text-left transition-colors hover:border-brand-400 hover:bg-[var(--bg)]"
              >
                <span className="font-semibold text-[var(--fg)]">{o.label}</span>
                <span className="mt-1 text-sm text-[var(--muted)]">{o.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="mt-6 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
