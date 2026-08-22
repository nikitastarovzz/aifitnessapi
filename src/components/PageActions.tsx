"use client";

import { useState } from "react";

/**
 * The row of things a reader might want to DO with a page rather than read:
 * take it to an assistant, cite it, or send it to somebody.
 *
 * "Copy for AI" fetches the page's own markdown mirror — the same document
 * the llms.txt convention advertises — so what lands in a chat window is the
 * clean article, not a scrape of the navigation. It is the human-facing door
 * onto a surface this site already publishes for machines.
 */
export default function PageActions({
  path,
  url,
  title,
  updated,
}: {
  /** Site-relative path, e.g. "/watch-apps/wear-os-tiles". */
  path: string;
  /** Absolute canonical URL. */
  url: string;
  title: string;
  /** ISO review date, used in the citation. */
  updated: string;
}) {
  const [state, setState] = useState<"idle" | "copying" | "copied" | "failed">("idle");
  const [showCite, setShowCite] = useState(false);

  const mdPath = `${path}.md`;
  const year = updated.slice(0, 4);
  const citations: { label: string; text: string }[] = [
    {
      label: "Plain",
      text: `AIFitnessAPI. "${title}." Last reviewed ${updated}. ${url}`,
    },
    {
      label: "BibTeX",
      text: `@misc{aifitnessapi-${path.split("/").filter(Boolean).join("-")},\n  author = {{AIFitnessAPI}},\n  title = {${title}},\n  year = {${year}},\n  url = {${url}},\n  note = {Last reviewed ${updated}}\n}`,
    },
  ];

  async function copyMarkdown() {
    setState("copying");
    try {
      const res = await fetch(mdPath, { headers: { accept: "text/markdown" } });
      if (!res.ok) throw new Error(String(res.status));
      await navigator.clipboard.writeText(await res.text());
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("failed");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  const share = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  const btn =
    "inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]";

  return (
    <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
      <button type="button" onClick={copyMarkdown} className={btn}>
        {state === "copied"
          ? "Copied markdown"
          : state === "failed"
            ? "Copy failed — open the .md"
            : state === "copying"
              ? "Copying…"
              : "Copy for AI"}
      </button>
      <a href={mdPath} className={btn}>
        View as Markdown
      </a>
      <button
        type="button"
        onClick={() => setShowCite((s) => !s)}
        aria-expanded={showCite}
        className={btn}
      >
        Cite this page
      </button>
      <span aria-hidden className="mx-0.5 h-4 w-px bg-[var(--border)]" />
      <a
        className={btn}
        href={`https://x.com/intent/tweet?url=${share}&text=${text}`}
        target="_blank"
        rel="noreferrer"
      >
        Post
      </a>
      <a
        className={btn}
        href={`https://news.ycombinator.com/submitlink?u=${share}&t=${text}`}
        target="_blank"
        rel="noreferrer"
      >
        Hacker News
      </a>
      <a
        className={btn}
        href={`https://www.reddit.com/submit?url=${share}&title=${text}`}
        target="_blank"
        rel="noreferrer"
      >
        Reddit
      </a>
      <a
        className={btn}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${share}`}
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn
      </a>

      {showCite && (
        <div className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--muted)]">
            Cite the page, not the site — every page carries its own review date.
          </p>
          <div className="mt-3 space-y-3">
            {citations.map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    {c.label}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-brand-600 hover:text-brand-500"
                    onClick={() => navigator.clipboard.writeText(c.text)}
                  >
                    Copy
                  </button>
                </div>
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-xs text-[var(--fg)]">
                  {c.text}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
