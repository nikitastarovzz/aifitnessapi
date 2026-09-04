"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * The matcher behind /tools/error-diagnoser.
 *
 * It diagnoses nothing on its own. Every sentence it renders is either
 * Apple's own wording for an HKError.Code case or the metaDescription of one
 * of this site's troubleshooting guides — both handed in from the server so
 * the 530 KB of source data stays out of the browser bundle. There is no
 * network call, no model, and no authored "likely cause" text: the tool
 * ranks, the datasets speak.
 *
 * When nothing scores above the floor it says so and points at the full
 * references rather than returning the least-bad guess.
 */

export type ErrorHint = {
  /** HKError.Code case name. */
  c: string;
  /** Apple's abstract, verbatim. */
  a: string;
  /** Apple's discussion, verbatim; null where Apple offers none. */
  d: string | null;
  /** Anchor rendered by /healthkit-errors for this case. */
  anchor: string;
  /** Apple's own documentation URL. */
  doc: string;
  /** Distinctive words from Apple's wording, normalised (server-computed). */
  kw: string[];
};

export type FixHint = {
  slug: string;
  h1: string;
  /** The guide's own metaDescription — the only prose shown for a fix. */
  desc: string;
  updated: string;
  /** Normalised keyword phrases that route an error string to this guide. */
  kw: string[];
};

type Match =
  | { kind: "error"; score: number; hint: ErrorHint }
  | { kind: "fix"; score: number; hint: FixHint };

/** Lowercase, strip punctuation, collapse whitespace. Mirrors the server. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** "errorAuthorizationDenied" -> "error authorization denied" */
function spaceCase(s: string): string {
  return normalize(s.replace(/([a-z0-9])([A-Z])/g, "$1 $2"));
}

const SAMPLES = [
  "HKError.Code.errorAuthorizationDenied",
  "HTTP/1.1 401 Unauthorized invalid_token",
  "429 Too Many Requests",
  "HKObserverQuery never fires in the background",
];

export default function ErrorDiagnoser({
  errors,
  fixes,
  fetchedOn,
}: {
  errors: ErrorHint[];
  fixes: FixHint[];
  fetchedOn: string;
}) {
  const [text, setText] = useState("");

  const matches = useMemo<Match[] | null>(() => {
    const norm = normalize(text);
    if (norm.length < 2) return null;
    const pad = ` ${norm} `;
    const out: Match[] = [];

    for (const hint of errors) {
      let score = 0;
      const lower = hint.c.toLowerCase();
      if (norm.includes(lower)) {
        // The case name pasted verbatim — the strongest signal there is.
        score += 100;
      } else {
        const spaced = spaceCase(hint.c);
        const tail = spaced.startsWith("error ") ? spaced.slice(6) : spaced;
        if (pad.includes(` ${spaced} `)) score += 80;
        else if (tail.includes(" ") && pad.includes(` ${tail} `)) score += 70;
      }
      let hits = 0;
      for (const w of hint.kw) if (pad.includes(` ${w} `)) hits += 1;
      score += hits * 8;
      if (score >= 24) out.push({ kind: "error", score, hint });
    }

    for (const hint of fixes) {
      let score = 0;
      for (const k of hint.kw) if (pad.includes(` ${k} `)) score += k.includes(" ") ? 26 : 18;
      if (score >= 18) out.push({ kind: "fix", score, hint });
    }

    return out.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [text, errors, fixes]);

  return (
    <div className="mt-8">
      <label htmlFor="err-input" className="block text-sm font-semibold text-[var(--fg)]">
        Paste the error
      </label>
      <textarea
        id="err-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        spellCheck={false}
        placeholder="Paste an NSError description, an HTTP status line, a log excerpt…"
        className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-[var(--fg)] placeholder:font-sans placeholder:text-[var(--muted)]"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-[var(--muted)]">Try:</span>
        {SAMPLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setText(s)}
            className="rounded-full border border-[var(--border)] px-3 py-1 font-mono text-[11px] text-[var(--fg)] hover:border-brand-400"
          >
            {s}
          </button>
        ))}
        {text && (
          <button
            type="button"
            onClick={() => setText("")}
            className="rounded-full px-2 py-1 text-xs text-[var(--muted)] underline hover:text-[var(--fg)]"
          >
            Clear
          </button>
        )}
      </div>

      <div aria-live="polite" className="mt-6">
        {matches === null ? (
          <p className="text-sm text-[var(--muted)]">
            Nothing to match yet. The matcher runs over {errors.length} HKError.Code cases read from
            Apple&rsquo;s documentation on {fetchedOn} and {fixes.length} troubleshooting guides on
            this site.
          </p>
        ) : matches.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-base font-bold text-[var(--fg)]">No match</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Nothing in the dataset matches that text, and this tool will not invent a diagnosis
              for it. Two references are worth reading by hand:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>
                <Link href="/healthkit-errors" className="font-medium text-brand-600 hover:text-brand-500">
                  Every HealthKit error code
                </Link>{" "}
                <span className="text-[var(--muted)]">
                  — all {errors.length} HKError.Code cases with Apple&rsquo;s own description.
                </span>
              </li>
              <li>
                <Link href="/fix" className="font-medium text-brand-600 hover:text-brand-500">
                  Fitness &amp; health API troubleshooting
                </Link>{" "}
                <span className="text-[var(--muted)]">
                  — symptom-to-fix for the API errors builders actually hit.
                </span>
              </li>
            </ul>
            <p className="mt-3 text-xs text-[var(--muted)]">
              One known gap: Apple does not publish the numeric raw values for HKError.Code, so a
              bare <code className="font-mono">Code=5</code> cannot be matched to a name from
              anything Apple states publicly.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[var(--muted)]">
              {matches.length} ranked {matches.length === 1 ? "match" : "matches"}, best first.
            </p>
            <div className="mt-4 space-y-4">
              {matches.map((m) =>
                m.kind === "error" ? (
                  <article
                    key={`e-${m.hint.c}`}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="font-mono text-sm font-bold text-[var(--fg)]">{m.hint.c}</code>
                      <span className="rounded-full border border-brand-400/60 bg-brand-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--fg)]">
                        HKError.Code
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--fg)]">
                      <span className="font-semibold text-[var(--muted)]">Apple&rsquo;s wording: </span>
                      <q>{m.hint.a}</q>
                    </p>
                    {m.hint.d && (
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                        <span className="font-semibold">Apple&rsquo;s discussion: </span>
                        <q>{m.hint.d}</q>
                      </p>
                    )}
                    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <Link
                        href={`/healthkit-errors#${m.hint.anchor}`}
                        className="font-medium text-brand-600 hover:text-brand-500"
                      >
                        This case on the error reference
                      </Link>
                      <a
                        href={m.hint.doc}
                        rel="nofollow"
                        className="text-[var(--muted)] hover:text-[var(--fg)]"
                      >
                        Apple docs
                      </a>
                    </p>
                  </article>
                ) : (
                  <article
                    key={`f-${m.hint.slug}`}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                        Troubleshooting guide
                      </span>
                      <span className="text-xs text-[var(--muted)]">updated {m.hint.updated}</span>
                    </div>
                    <h3 className="mt-2 text-base font-bold text-[var(--fg)]">
                      <Link href={`/fix/${m.hint.slug}`} className="text-brand-600 hover:text-brand-500">
                        {m.hint.h1}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{m.hint.desc}</p>
                  </article>
                ),
              )}
            </div>
            <p className="mt-4 text-xs text-[var(--muted)]">
              Ranked by string overlap with Apple&rsquo;s wording and with each guide&rsquo;s
              subject — not by a model&rsquo;s opinion of your stack trace. Read the top card before
              you trust the order.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
