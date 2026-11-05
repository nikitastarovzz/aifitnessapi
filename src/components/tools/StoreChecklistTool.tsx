"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { PlannerSource, StoreItem } from "@/data/plannerSources.mjs";
import {
  CHECKLIST_DEFAULT,
  STORES,
  STORE_LABELS,
  TRAIT_ORDER,
  applicableStoreItems,
  checklistMarkdown,
  checklistProgress,
  decodeChecklist,
  encodeChecklist,
  type ChecklistState,
} from "@/lib/plannerLogic.mjs";
import { Chip, CopyLink, Field, btn, downloadText, toggle, useUrlState } from "./plannerUi";

/**
 * The App Store / Google Play submission checklist. Every item is a store's
 * own sentence (src/data/plannerSources.mjs); the answers only decide which
 * items are on the list. Ticks are kept in this browser's localStorage and
 * nowhere else; the answers are kept in the address, so a link reproduces the
 * list but not anyone's progress.
 */

const STORAGE_KEY = "aifitnessapi.store-checklist.v1";

function readDone(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default function StoreChecklistTool({
  items,
  sources,
  traitLabels,
  pageLabels,
  origin,
}: {
  items: StoreItem[];
  sources: Record<string, PlannerSource>;
  traitLabels: Record<string, string>;
  pageLabels: Record<string, string>;
  origin: string;
}) {
  const [state, setState] = useUrlState<ChecklistState>(CHECKLIST_DEFAULT, decodeChecklist, encodeChecklist);
  const [done, setDone] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDone(readDone());
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      /* private mode: progress lives for this tab only */
    }
  }, [done, loaded]);

  const applicable = useMemo(() => applicableStoreItems(items, state.stores, state.traits), [items, state]);
  const onList = new Set(applicable.map((i) => i.id));
  const progress = checklistProgress(applicable, done);
  const doneSet = new Set(done);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
      <Field legend="Which stores are you submitting to?">
        {STORES.map((s) => (
          <Chip key={s} on={state.stores.includes(s)} onClick={() => setState({ ...state, stores: toggle(state.stores, s, STORES) })}>
            {STORE_LABELS[s]}
          </Chip>
        ))}
      </Field>
      <Field legend="What does the app do? (pick all that apply)">
        {TRAIT_ORDER.map((t) => (
          <Chip key={t} on={state.traits.includes(t)} onClick={() => setState({ ...state, traits: toggle(state.traits, t, TRAIT_ORDER) })}>
            {traitLabels[t]}
          </Chip>
        ))}
      </Field>

      <div className="mt-6" aria-live="polite">
        <p className="text-sm font-semibold text-[var(--fg)]" data-checklist-count={applicable.length}>
          {progress.done} of {progress.total} items done ({progress.percent}%)
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--border)]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent} aria-label="Checklist progress">
          <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">Ticks are saved in this browser only. The share link carries your answers, not your ticks.</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={btn}
          onClick={() =>
            downloadText(
              "store-submission-checklist.md",
              checklistMarkdown(applicable, sources, { done, origin, traitLabels, traits: state.traits, stores: state.stores }),
            )
          }
        >
          Download as Markdown
        </button>
        <CopyLink path={`/tools/store-submission-checklist${encodeChecklist(state)}`} />
        <button type="button" className={btn} onClick={() => setDone([])}>
          Clear ticks
        </button>
      </div>

      {STORES.map((store) => {
        const mine = items.filter((i) => i.store === store);
        const listed = mine.filter((i) => onList.has(i.id));
        const rest = mine.filter((i) => !onList.has(i.id));
        return (
          <section key={store} className="mt-8" data-checklist-store={store}>
            <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">
              {STORE_LABELS[store]}{" "}
              <span className="text-sm font-normal text-[var(--muted)]">
                {state.stores.includes(store)
                  ? `${listed.filter((i) => doneSet.has(i.id)).length} of ${listed.length} done`
                  : "not selected"}
              </span>
            </h3>
            <ul className="mt-3 space-y-3">
              {listed.map((i) => (
                <Item key={i.id} item={i} source={sources[i.source]} done={doneSet.has(i.id)} pageLabels={pageLabels} onToggle={() => setDone(toggle(done, i.id, items.map((x) => x.id)))} />
              ))}
            </ul>
            {rest.length > 0 && (
              <details className="mt-3 rounded-xl border border-dashed border-[var(--border)] p-3">
                <summary className="cursor-pointer text-sm text-[var(--muted)]">
                  {rest.length} more {STORE_LABELS[store]} items that your answers do not trigger
                </summary>
                <ul className="mt-3 space-y-3">
                  {rest.map((i) => (
                    <Item key={i.id} item={i} source={sources[i.source]} done={false} pageLabels={pageLabels} traitLabels={traitLabels} />
                  ))}
                </ul>
              </details>
            )}
          </section>
        );
      })}
    </div>
  );
}

function Item({
  item,
  source,
  done,
  onToggle,
  pageLabels,
  traitLabels,
}: {
  item: StoreItem;
  source: PlannerSource;
  done: boolean;
  onToggle?: () => void;
  pageLabels: Record<string, string>;
  traitLabels?: Record<string, string>;
}) {
  return (
    <li id={`item-${item.id}`} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <div className="flex items-start gap-3">
        {onToggle ? (
          <input
            type="checkbox"
            checked={done}
            onChange={onToggle}
            aria-label={`Done: ${item.title}`}
            className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
          />
        ) : null}
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${done ? "text-[var(--muted)] line-through" : "text-[var(--fg)]"}`}>
            {item.title} <span className="font-normal text-[var(--muted)]">({item.section})</span>
          </p>
          <blockquote className="mt-2 border-l-2 border-brand-400 pl-3 text-sm text-[var(--muted)]">{item.quote}</blockquote>
          <p className="mt-2 text-xs text-[var(--muted)]">
            <a href={source.url} rel="noopener" className="font-medium text-brand-600 hover:text-brand-500">
              {source.publisher}, {source.title}
            </a>
            {item.page && pageLabels[item.page] ? (
              <>
                {" · "}
                <Link href={item.page} className="font-medium text-brand-600 hover:text-brand-500">
                  {pageLabels[item.page]}
                </Link>
              </>
            ) : null}
            {traitLabels && item.when ? <> · Applies when: {item.when.map((w) => traitLabels[w]).join(" or ")}</> : null}
          </p>
        </div>
      </div>
    </li>
  );
}
