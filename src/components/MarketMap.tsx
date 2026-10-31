"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MapItem } from "@/lib/ecosystemSignals";

/**
 * The market map: every directory product as a tile, grouped by the cost
 * model's categories, with filters over fields the data actually has.
 *
 * Server-rendered with every filter off, so the prerendered HTML is the full
 * crawlable list; the filters only hide tiles in the browser. Nothing here
 * orders products by merit — within a category, tiles keep the directory's
 * own order (the cost model's source order), and the funder's tile has the
 * same shape as everyone else's with one extra marker.
 */

export type MapFilterOption = { id: string; label: string };

const DOT: Record<string, string> = {
  free: "bg-emerald-500",
  "free-tier-then-paid": "bg-sky-500",
  "usage-based": "bg-violet-500",
  "contact-sales": "bg-amber-500",
};

type Gate = "any" | "gated" | "none";

function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        pressed
          ? "border-brand-500 bg-brand-500/15 text-[var(--fg)]"
          : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400 hover:text-[var(--fg)]"
      }`}
    >
      {children}
    </button>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 w-full text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] sm:w-28">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function MarketMap({
  items,
  categories,
  devCosts,
  groups,
}: {
  items: MapItem[];
  categories: MapFilterOption[];
  devCosts: MapFilterOption[];
  groups: MapFilterOption[];
}) {
  const [cats, setCats] = useState<string[]>([]);
  const [costs, setCosts] = useState<string[]>([]);
  const [gate, setGate] = useState<Gate>("any");
  const [group, setGroup] = useState<string>("any");

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const shown = useMemo(
    () =>
      items.filter(
        (i) =>
          (cats.length === 0 || cats.includes(i.category)) &&
          (costs.length === 0 || costs.includes(i.devCost)) &&
          (gate === "any" || (gate === "gated" ? i.gated : !i.gated)) &&
          (group === "any" || i.groups.includes(group as MapItem["groups"][number])),
      ),
    [items, cats, costs, gate, group],
  );
  const shownIds = new Set(shown.map((i) => i.id));
  const filtered = cats.length > 0 || costs.length > 0 || gate !== "any" || group !== "any";

  return (
    <div data-market-map>
      <div
        role="group"
        aria-label="Filter the market map"
        className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <FilterRow label="Category">
          {categories.map((c) => (
            <Chip key={c.id} pressed={cats.includes(c.id)} onClick={() => toggle(cats, setCats, c.id)}>
              {c.label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Billing model">
          {devCosts.map((c) => (
            <Chip key={c.id} pressed={costs.includes(c.id)} onClick={() => toggle(costs, setCosts, c.id)}>
              <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${DOT[c.id]}`} aria-hidden="true" />
              {c.label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Approval gate">
          <Chip pressed={gate === "any"} onClick={() => setGate("any")}>Any</Chip>
          <Chip pressed={gate === "gated"} onClick={() => setGate("gated")}>Gated</Chip>
          <Chip pressed={gate === "none"} onClick={() => setGate("none")}>None documented</Chip>
        </FilterRow>
        <FilterRow label="Tracked library">
          <Chip pressed={group === "any"} onClick={() => setGroup("any")}>Any</Chip>
          {groups.map((g) => (
            <Chip key={g.id} pressed={group === g.id} onClick={() => setGroup(group === g.id ? "any" : g.id)}>
              {g.label}
            </Chip>
          ))}
        </FilterRow>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)]" aria-live="polite">
          <span>
            Showing <strong className="text-[var(--fg)]">{shown.length}</strong> of {items.length} products
          </span>
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setCats([]);
                setCosts([]);
                setGate("any");
                setGroup("any");
              }}
              className="font-medium text-brand-600 hover:text-brand-500"
            >
              Clear filters
            </button>
          )}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => {
          const all = items.filter((i) => i.category === c.id);
          const visible = all.filter((i) => shownIds.has(i.id));
          if (visible.length === 0) return null;
          return (
            <section
              key={c.id}
              aria-labelledby={`map-${c.id}`}
              className="min-w-0 rounded-2xl border border-[var(--border)] p-4"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 id={`map-${c.id}`} className="text-sm font-bold tracking-tight text-[var(--fg)]">
                  {c.label}
                </h3>
                <span className="text-xs text-[var(--muted)]">{all.length}</span>
              </div>
              {/* Billing mix of the whole category, one segment per product. */}
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full" aria-hidden="true">
                {all.map((i) => (
                  <span key={i.id} className={`h-full flex-1 ${DOT[i.devCost]} ${shownIds.has(i.id) ? "" : "opacity-25"}`} />
                ))}
              </div>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                {visible.map((i) => (
                  <li
                    key={i.id}
                    data-map-tile={i.id}
                    {...(i.firstParty ? { "data-first-party": "" } : {})}
                    className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 transition-colors hover:border-brand-400"
                  >
                    <Link href={i.href} className="block break-words text-sm font-semibold leading-snug text-[var(--fg)] hover:text-brand-600">
                      {i.label}
                    </Link>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px] text-[var(--muted)]">
                      <span className="inline-flex items-center gap-1">
                        <span className={`inline-block h-2 w-2 rounded-full ${DOT[i.devCost]}`} aria-hidden="true" />
                        {i.devCostLabel}
                      </span>
                      {i.gated && (
                        <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-1.5 text-[var(--fg)]">
                          gate
                        </span>
                      )}
                      {i.userSideCost && (
                        <span className="rounded-full border border-[var(--border)] px-1.5">user cost</span>
                      )}
                      {i.firstParty && (
                        <span className="rounded-full border border-[var(--border)] px-1.5 italic">
                          funds this site
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--muted)]">
        {devCosts.map((c) => (
          <span key={c.id} className="inline-flex items-center gap-1">
            <span className={`inline-block h-2 w-2 rounded-full ${DOT[c.id]}`} aria-hidden="true" />
            {c.label}
          </span>
        ))}
        <span>
          <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-1.5 text-[var(--fg)]">gate</span>{" "}
          approval gate documented
        </span>
        <span>
          <span className="rounded-full border border-[var(--border)] px-1.5">user cost</span> end user must own or pay
          for something
        </span>
      </p>
    </div>
  );
}
