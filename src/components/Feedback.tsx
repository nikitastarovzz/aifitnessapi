"use client";

import { useState } from "react";
import { CONTRIBUTORS_PATH, correctionIssueUrl } from "@/lib/correctionReport.mjs";

/**
 * Two questions at the end of a page: was this useful, and is anything wrong.
 *
 * The vote is one anonymous row (page, verdict, optional note) — no cookies,
 * no identifier, nothing that could re-identify a reader. The correction link
 * opens a pre-filled GitHub issue instead of a form, because a correction
 * worth making is worth having in public with a thread attached to it.
 */
export default function Feedback({
  path,
  title,
  repo,
}: {
  path: string;
  title: string;
  /** Repository base URL; the correction link is disabled without one. */
  repo?: string;
}) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [note, setNote] = useState("");
  const [sentNote, setSentNote] = useState(false);

  const send = (verdict: "up" | "down", body?: string) => {
    setVote(verdict);
    void fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path, verdict, note: body ?? "" }),
    }).catch(() => {
      /* feedback is best-effort; never interrupt the reader */
    });
  };

  // The issue asks whether the reporter wants credit on /contributors
  // (src/lib/correctionReport.mjs, the same body as the issue template).
  const issueUrl = repo && correctionIssueUrl({ path, title, repoUrl: repo });

  const btn =
    "rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]";

  return (
    <section className="defer-paint not-prose mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--fg)]">
          {vote === null ? "Was this page useful?" : "Thanks — noted."}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {vote === null ? (
            <>
              <button type="button" className={btn} onClick={() => send("up")}>
                Yes
              </button>
              <button type="button" className={btn} onClick={() => send("down")}>
                Not really
              </button>
            </>
          ) : null}
          {issueUrl && (
            <a className={btn} href={issueUrl} target="_blank" rel="noreferrer">
              Suggest a correction
            </a>
          )}
        </div>
      </div>

      {issueUrl && (
        <p className="mt-2 text-xs text-[var(--muted)]">
          Corrections that change a page are logged, and credited by name if you ask:{" "}
          <a href={CONTRIBUTORS_PATH} className="text-brand-600 hover:text-brand-500">
            contributors
          </a>
          .
        </p>
      )}

      {vote === "down" && !sentNote && (
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (note.trim()) send("down", note.trim());
            setSentNote(true);
          }}
        >
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={300}
            placeholder="What were you looking for? (optional)"
            className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-brand-400 focus:outline-none"
          />
          <button type="submit" className={btn}>
            Send
          </button>
        </form>
      )}
      {sentNote && (
        <p className="mt-2 text-xs text-[var(--muted)]">
          Sent. If it needs a fix, it gets one — see how we verify.
        </p>
      )}
    </section>
  );
}
