"use client";

import { useEffect, useState } from "react";
import { PREFLIGHT_TOPICS, type VendorPreflight } from "@/data/accessPreflight";

/**
 * "Before you apply": the requirements a gated vendor's own pages state for
 * its access program, grouped by topic, from src/data/accessPreflight.ts.
 * Each item quotes its source; a topic the vendor says nothing about reads
 * "Not stated on the pages read". The checkboxes are the reader's own notes:
 * they are kept in this browser's localStorage under one key per vendor and
 * sent nowhere (no analytics event either). It makes no claim about what
 * gets an application approved, and says so.
 *
 * Rendered by ClusterPage on the vendor's English /fix/...-approval or
 * /integrate page only, never on a translation.
 */

const storeKey = (vendor: string) => `access-preflight:${vendor}`;
const linkCls = "font-medium text-brand-600 hover:text-brand-500";
/** The snapshot keeps a space where a link ended ("App Name , Contact"); the quote reads better without it. */
const tidy = (q: string) => q.replace(/ ([,.;:])/g, "$1");
const host = (u: string) => new URL(u).hostname;

export default function AccessPreflight({ p }: { p: VendorPreflight }) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [stored, setStored] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storeKey(p.vendor));
      const ids = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(ids)) setDone(new Set(ids.filter((x): x is string => typeof x === "string")));
    } catch {
      setStored(false);
    }
  }, [p.vendor]);

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(storeKey(p.vendor), JSON.stringify([...next]));
      } catch {
        setStored(false);
      }
      return next;
    });
  }

  const todo = p.items.filter((i) => i.kind === "do");
  const ticked = todo.filter((i) => done.has(i.id)).length;

  return (
    <section
      id="before-you-apply"
      data-access-preflight={p.vendor}
      className="mt-12 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
    >
      <h2 className="text-lg font-bold tracking-tight text-[var(--fg)]">{`Before you apply: what ${p.name} says it requires`}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        {`For ${p.program}: each line is something ${p.name}'s own developer pages state, quoted, read on ${p.checkedOn}. ` +
          `A topic they say nothing about is marked "not stated" rather than filled in from elsewhere. ` +
          `This is a list of what the vendor asks for, not advice on getting approved: nothing here says that meeting an item changes the outcome.`}
      </p>
      <p className="mt-2 text-xs text-[var(--muted)]">
        {`Checkboxes are your own notes, kept in this browser only and sent nowhere. ${ticked} of ${todo.length} ticked.`}
        {!stored && " This browser is not keeping them, so they reset when you leave."}
      </p>

      <div className="mt-5 space-y-5">
        {PREFLIGHT_TOPICS.map((t) => {
          const items = p.items.filter((i) => i.topic === t.id);
          return (
            <div key={t.id} data-preflight-topic={`${p.vendor}:${t.id}:${items.length ? "stated" : "not-stated"}`}>
              <h3 className="text-sm font-semibold text-[var(--fg)]">{t.label}</h3>
              {items.length === 0 ? (
                <p className="mt-1 text-sm text-[var(--muted)]">Not stated on the pages read.</p>
              ) : (
                <ul className="mt-2 space-y-3">
                  {items.map((i) => {
                    const id = `preflight-${p.vendor}-${i.id}`;
                    return (
                      <li key={i.id} data-preflight-item={`${p.vendor}:${i.id}:${i.kind}`} className="flex gap-3 text-sm">
                        {i.kind === "do" ? (
                          <input
                            id={id}
                            type="checkbox"
                            checked={done.has(i.id)}
                            onChange={() => toggle(i.id)}
                            className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
                          />
                        ) : (
                          <span aria-hidden="true" className="mt-0.5 w-4 shrink-0 text-center text-[var(--muted)]">
                            •
                          </span>
                        )}
                        <div>
                          {i.kind === "do" ? (
                            <label htmlFor={id} className="text-[var(--fg)]">
                              {i.text}
                            </label>
                          ) : (
                            <span className="text-[var(--fg)]">{i.text}</span>
                          )}
                          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                            {`${p.name}: “${tidy(i.quote)}” `}
                            <a href={i.url} className={linkCls} rel="noopener">
                              {host(i.url)}
                            </a>
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-xs text-[var(--muted)]">
        {`Read through a source snapshot (run ${p.snapshotRun}) because the vendor's hosts are blocked from where this site is written; every quote is a row of the site's evidence file, which a scheduled job re-checks against the live page. Requirements change: confirm on the vendor's page before you apply.`}
      </p>
    </section>
  );
}
