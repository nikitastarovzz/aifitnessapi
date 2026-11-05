"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { addDocs, createIndex, docsFromSection, search, snippet, type AnswerIndex } from "@/lib/answerSearch.mjs";

/**
 * /answers-search (ops/AUDIENCE-30-2026-11-05.md item 25): full-text search
 * over the answer files, in the browser.
 *
 * Nothing loads with the page. The first search (or a ?q= in the address)
 * fetches the sections that are ticked, in parallel, and every result list is
 * recomputed as each one arrives; a section ticked later loads then. The page
 * counts the bytes it fetched, so the cost of a search is on screen rather
 * than hidden. The query itself is never sent anywhere: the files are the
 * same static /answers/<section>.json every reader gets.
 */

export type SectionMeta = { id: string; title: string; kind: string; count: number; bytes: number; hub: string };

const DEFAULT_KINDS = new Set(["cluster", "posts", "changes"]);
const KIND_LABEL: Record<string, string> = { answer: "Answer", faq: "FAQ", post: "Blog post", change: "Change" };

const kb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

type Load = { state: "loading" | "done" | "failed"; bytes: number; transfer: number | null };

export default function AnswerSearch({ sections, origin }: { sections: SectionMeta[]; origin: string }) {
  const [q, setQ] = useState("");
  const [on, setOn] = useState<Set<string>>(() => new Set(sections.filter((s) => DEFAULT_KINDS.has(s.kind)).map((s) => s.id)));
  const [started, setStarted] = useState(false);
  const [loads, setLoads] = useState<Record<string, Load>>({});
  const [version, setVersion] = useState(0);
  const [limit, setLimit] = useState(20);
  // One index across every loaded section, so term rarity is judged over
  // everything loaded; unticking a section filters its documents out.
  const index = useRef<AnswerIndex>(createIndex());
  const loadedIds = useRef(new Set<string>());
  const titleOf = useMemo(() => new Map(sections.map((s) => [s.id, s.title])), [sections]);

  // A ?q= in the address searches at once, so a result list can be linked.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) {
      setQ(initial);
      setStarted(true);
    }
  }, []);

  // Fetch every ticked section not yet loaded, once searching has started.
  useEffect(() => {
    if (!started) return;
    for (const id of on) {
      if (loads[id] || loadedIds.current.has(id)) continue;
      setLoads((l) => ({ ...l, [id]: { state: "loading", bytes: 0, transfer: null } }));
      const url = `/answers/${id}.json`;
      fetch(url)
        .then(async (r) => {
          if (!r.ok) throw new Error(String(r.status));
          const text = await r.text();
          const doc = JSON.parse(text);
          addDocs(index.current, docsFromSection(doc, origin).map((d) => ({ ...d, section: id })));
          loadedIds.current.add(id);
          const entry = performance.getEntriesByName(new URL(url, window.location.href).href).at(-1) as PerformanceResourceTiming | undefined;
          const transfer = entry && entry.transferSize > 0 ? entry.transferSize : null;
          setLoads((l) => ({ ...l, [id]: { state: "done", bytes: new TextEncoder().encode(text).length, transfer } }));
          setVersion((v) => v + 1);
        })
        .catch(() => setLoads((l) => ({ ...l, [id]: { state: "failed", bytes: 0, transfer: null } })));
    }
  }, [started, on, loads, origin]);

  // Keep the address in step with the query, without a history entry per key.
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      try {
        const u = new URL(window.location.href);
        if (q.trim()) u.searchParams.set("q", q.trim());
        else u.searchParams.delete("q");
        window.history.replaceState(null, "", `${u.pathname}${u.search}`);
      } catch {
        /* the address is a convenience */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [q, started]);

  const results = useMemo(() => {
    void version;
    if (!q.trim()) return [];
    return search(index.current, q, { limit: 400 })
      .filter((r) => on.has(r.doc.section))
      .slice(0, 80);
  }, [q, on, version]);

  const ticked = sections.filter((s) => on.has(s.id));
  const loaded = ticked.filter((s) => loads[s.id]?.state === "done");
  const pending = ticked.filter((s) => loads[s.id]?.state === "loading").length;
  const failed = ticked.filter((s) => loads[s.id]?.state === "failed").length;
  const bytes = Object.values(loads).reduce((n, l) => n + l.bytes, 0);
  const transfers = Object.values(loads).filter((l) => l.state === "done");
  const transfer = transfers.every((l) => l.transfer !== null) && transfers.length ? transfers.reduce((n, l) => n + (l.transfer ?? 0), 0) : null;
  const tickedBytes = ticked.reduce((n, s) => n + s.bytes, 0);

  const toggle = (id: string) =>
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const groups: [string, SectionMeta[]][] = [
    ["Guides and comparisons", sections.filter((s) => s.kind === "cluster")],
    ["Generated references", sections.filter((s) => s.kind === "reference")],
    ["Blog and changes", sections.filter((s) => s.kind === "posts" || s.kind === "changes")],
  ];

  return (
    <div className="mt-8">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setStarted(true);
        }}
      >
        <label htmlFor="answer-q" className="text-sm font-semibold text-[var(--fg)]">
          Search the full text of every answer
        </label>
        <input
          id="answer-q"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(20);
            if (e.target.value.trim()) setStarted(true);
          }}
          onFocus={() => setStarted(true)}
          placeholder="e.g. refresh token expires, 410 Gone, sleep stages webhook"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-base text-[var(--fg)] outline-none focus:border-brand-400"
          autoComplete="off"
          spellCheck={false}
        />
      </form>

      <p className="mt-3 text-xs text-[var(--muted)]" aria-live="polite" data-answer-search-bytes="">
        {!started
          ? `Nothing loaded yet. Searching fetches the ${ticked.length} ticked sections, about ${kb(tickedBytes)} of JSON before compression.`
          : `Loaded ${loaded.length} of ${ticked.length} ticked sections: ${kb(bytes)} of JSON${transfer !== null ? `, ${kb(transfer)} over the network` : ""}.${pending ? ` ${pending} still loading.` : ""}${failed ? ` ${failed} failed to load.` : ""}`}
      </p>

      <details className="mt-3 rounded-xl border border-[var(--border)] p-3">
        <summary className="cursor-pointer text-sm text-[var(--fg)]">Sections to search ({ticked.length} of {sections.length})</summary>
        <div className="mt-3 space-y-4">
          {groups.map(([label, list]) =>
            list.length ? (
              <fieldset key={label}>
                <legend className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</legend>
                <div className="mt-2 grid gap-1 sm:grid-cols-2">
                  {list.map((s) => (
                    <label key={s.id} className="flex items-baseline gap-2 text-sm text-[var(--fg)]">
                      <input type="checkbox" checked={on.has(s.id)} onChange={() => toggle(s.id)} />
                      <span>
                        {s.title} <span className="text-xs text-[var(--muted)]">({s.count} · {kb(s.bytes)})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null,
          )}
        </div>
      </details>

      {q.trim() && started && (
        <div className="mt-6">
          {results.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              {pending ? "Searching as sections load…" : "No answer in the ticked sections uses those words."}{" "}
              <Link href={`/search?q=${encodeURIComponent(q.trim())}`} className="font-medium text-brand-600 hover:text-brand-500">
                Try the page search
              </Link>
              .
            </p>
          ) : (
            <>
              <p className="text-xs text-[var(--muted)]">
                {results.length >= 80 ? "The 80 best matches" : `${results.length} ${results.length === 1 ? "match" : "matches"}`}, best first.
              </p>
              <ol className="mt-3 space-y-4">
                {results.slice(0, limit).map(({ doc }) => (
                  <li key={`${doc.kind}:${doc.href}:${doc.title}`} className="rounded-xl border border-[var(--border)] p-4">
                    <Link href={doc.href} className="font-semibold text-[var(--fg)] hover:text-brand-600">
                      {doc.title}
                    </Link>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
                      {snippet(doc.text, q).map((s, i) =>
                        s.hit ? (
                          <mark key={i} className="rounded bg-brand-500/20 px-0.5 text-[var(--fg)]">
                            {s.t}
                          </mark>
                        ) : (
                          <span key={i}>{s.t}</span>
                        ),
                      )}
                    </p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {KIND_LABEL[doc.kind]}
                      {doc.kind === "faq" || doc.kind === "answer" ? ` on ${doc.page}` : ""} · {titleOf.get(doc.section) ?? doc.section}
                      {doc.date ? ` · reviewed ${doc.date}` : ""}
                      {doc.firstParty ? " · about KinesteX, which funds this site" : ""}
                    </p>
                  </li>
                ))}
              </ol>
              {results.length > limit && (
                <button type="button" onClick={() => setLimit((n) => n + 20)} className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-500">
                  Show more
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
