"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  COST_ITEMS,
  DEV_COST_LABELS,
  type CostItem,
  type DevCost,
  type EngEffort,
} from "@/data/costModel";

/**
 * Interactive "Fitness API Cost Planner". You pick a stack; it returns the COST
 * STRUCTURE of that stack — what is free, what meters, what needs a quote, what
 * each of your END USERS has to pay for, what gates your launch, and roughly
 * where the engineering time goes.
 *
 * It publishes no dollar figures on purpose. Vendor prices move and most real
 * tiers are contact-sales, so printing numbers would mean printing stale ones.
 * Every row links the page on this site that sources its cost model, and the
 * engineering-effort tally is labelled as this site's rough judgement rather
 * than dressed up as a vendor fact.
 */

type Profile = "solo" | "funded";

const PROFILE_OPTIONS: { value: Profile; label: string; hint: string }[] = [
  { value: "solo", label: "Solo dev / small team", hint: "You are the whole engineering budget" },
  { value: "funded", label: "Funded team", hint: "Dedicated engineers, a roadmap, a quota to hit" },
];

const EFFORT_META: Record<EngEffort, { label: string; span: string }> = {
  low: { label: "Low", span: "days" },
  medium: { label: "Medium", span: "weeks" },
  high: { label: "High", span: "months" },
};

const EFFORT_ORDER: EngEffort[] = ["high", "medium", "low"];

/** Team profile changes only how the effort is framed — never the effort itself. */
const PROFILE_FRAMING: Record<Profile, Record<EngEffort, string>> = {
  solo: {
    high: "Months each, and you are the one doing them. Treat every high item as the roadmap rather than a ticket on it — one is a quarter, two is a year.",
    medium:
      "Weeks each. On a solo build these stack end-to-end, so three medium items is most of a quarter with nothing else shipped.",
    low: "Days each — the part you can genuinely fit around other work.",
  },
  funded: {
    high: "Months of a dedicated engineer each. These parallelise if you have the headcount, but they also carry ongoing maintenance and tuning, not just a build.",
    medium: "Weeks of one engineer each. Schedulable, and they parallelise across a team.",
    low: "Days each. Small enough to absorb into an existing sprint.",
  },
};

const DEV_COST_BADGE: Record<DevCost, string> = {
  free: "border-brand-400 bg-brand-500/10 text-[var(--fg)]",
  "free-tier-then-paid": "border-[var(--border)] bg-[var(--bg)] text-[var(--fg)]",
  "usage-based": "border-[var(--border)] bg-[var(--bg)] text-[var(--fg)]",
  "contact-sales": "border-[var(--border)] bg-[var(--bg)] text-[var(--fg)]",
};

const DEV_COST_MEANING: Record<DevCost, string> = {
  free: "No fee documented for calling it.",
  "free-tier-then-paid": "A real free entry point that runs out.",
  "usage-based": "The bill scales with users, events, or tokens.",
  "contact-sales": "No public price — you have to ask for a quote.",
};

function Badge({ cost }: { cost: DevCost }) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${DEV_COST_BADGE[cost]}`}
    >
      {DEV_COST_LABELS[cost]}
    </span>
  );
}

function SourceLink({ item, event }: { item: CostItem; event: string }) {
  return (
    <Link
      href={item.sourceHref}
      onClick={() => track(event, "cost-planner")}
      className="font-medium text-brand-600 underline underline-offset-2 transition-colors hover:text-[var(--fg)] dark:text-brand-300"
    >
      {item.sourceHref}
    </Link>
  );
}

export default function CostPlanner() {
  const [picked, setPicked] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile>("solo");

  const chosen = useMemo(
    () => COST_ITEMS.filter((i) => picked.includes(i.id)),
    [picked],
  );

  const userPays = chosen.filter((i) => i.userSideCost);
  const gated = chosen.filter((i) => i.approvalGate);
  const quotes = chosen.filter((i) => i.devCost === "contact-sales");

  const tally = useMemo(() => {
    const t: Record<EngEffort, CostItem[]> = { low: [], medium: [], high: [] };
    for (const i of chosen) t[i.engEffort].push(i);
    return t;
  }, [chosen]);

  function toggle(item: CostItem) {
    setPicked((prev) => {
      const next = prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id];
      return next;
    });
    track(`cost-planner-pick-${item.id}`, "cost-planner");
  }

  function reset() {
    setPicked([]);
    track("cost-planner-reset", "cost-planner");
  }

  return (
    <div className="grid gap-6">
      {/* ---------------------------------------------------------------- picker */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Step 1
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--fg)]">Pick your stack</h2>
        <p className="mt-3 text-[var(--muted)]">
          Tick everything you expect to integrate. Each item is here because its cost{" "}
          <em>model</em> is documented on a page of this site — the planner reports structure, not
          prices.
        </p>

        <fieldset className="mt-6">
          <legend className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Team profile
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {PROFILE_OPTIONS.map((o) => {
              const active = profile === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setProfile(o.value);
                    track(`cost-planner-profile-${o.value}`, "cost-planner");
                  }}
                  className={`flex h-full w-full flex-col rounded-xl border p-4 text-left transition-colors ${
                    active
                      ? "border-brand-400 bg-brand-500/10"
                      : "border-[var(--border)] hover:border-brand-400 hover:bg-[var(--bg)]"
                  }`}
                >
                  <span className="font-semibold text-[var(--fg)]">{o.label}</span>
                  <span className="mt-1 text-sm text-[var(--muted)]">{o.hint}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            This changes only how the engineering effort is described. It never changes the effort,
            and it never changes a vendor&rsquo;s cost model.
          </p>
        </fieldset>

        {CATEGORY_ORDER.map((cat) => {
          const items = COST_ITEMS.filter((i) => i.category === cat);
          if (items.length === 0) return null;
          return (
            <fieldset key={cat} className="mt-8">
              <legend className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {CATEGORY_LABELS[cat]}
              </legend>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {items.map((item) => {
                  const active = picked.includes(item.id);
                  return (
                    <li key={item.id}>
                      <label
                        className={`flex h-full w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                          active
                            ? "border-brand-400 bg-brand-500/10"
                            : "border-[var(--border)] hover:border-brand-400 hover:bg-[var(--bg)]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggle(item)}
                          className="mt-1 h-4 w-4 shrink-0 accent-current text-brand-500"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[var(--fg)]">{item.label}</span>
                            <Badge cost={item.devCost} />
                          </span>
                          <span className="mt-1 block text-sm text-[var(--muted)]">
                            {DEV_COST_MEANING[item.devCost]}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------- output */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Step 2
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--fg)]">
          {chosen.length === 0
            ? "Your cost structure will appear here"
            : `Cost structure of ${chosen.length} ${chosen.length === 1 ? "choice" : "choices"}`}
        </h2>

        {chosen.length === 0 ? (
          <p className="mt-3 text-[var(--muted)]">
            Tick something above. You will get four things back: how each vendor bills you, what your
            end users have to pay for before their data can flow, which approvals gate your launch,
            and roughly how much engineering time the stack costs.
          </p>
        ) : (
          <div className="mt-6 grid gap-8">
            {/* per-item rows */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                How each one bills you
              </h3>
              <ul className="mt-3 grid gap-3">
                {chosen.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-[var(--fg)]">{item.label}</span>
                      <Badge cost={item.devCost} />
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{item.notes}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      Source: <SourceLink item={item} event={`cost-planner-source-${item.id}`} />
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* your users pay */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Your users pay
              </h3>
              {userPays.length === 0 ? (
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Nothing in this stack requires your end users to own a device or hold a membership
                  before their data can flow — at least not per the pages we source. That is one
                  fewer cap on who can actually connect.
                </p>
              ) : (
                <>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    These cost you nothing directly. They cap who can connect at all, which is a
                    market-size constraint rather than a line item.
                  </p>
                  <ul className="mt-3 grid gap-3">
                    {userPays.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400"
                      >
                        <span className="font-semibold text-[var(--fg)]">{item.label}</span>
                        <p className="mt-1 text-sm text-[var(--muted)]">{item.userSideCost}</p>
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          Source:{" "}
                          <SourceLink item={item} event={`cost-planner-user-${item.id}`} />
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            {/* approval gates */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Approval gates &amp; lead time
              </h3>
              {gated.length === 0 ? (
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Nothing here gates your launch on someone else&rsquo;s review. Rare, and worth
                  noticing.
                </p>
              ) : (
                <>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    Calendar time is a real cost even when the fee is zero. Start these before you
                    need them.
                  </p>
                  <ul className="mt-3 grid gap-3">
                    {gated.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400"
                      >
                        <span className="font-semibold text-[var(--fg)]">{item.label}</span>
                        <p className="mt-1 text-sm text-[var(--muted)]">{item.approvalGate}</p>
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          Source:{" "}
                          <SourceLink item={item} event={`cost-planner-gate-${item.id}`} />
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            {/* engineering effort */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Engineering effort
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Unlike everything above, this is not sourced from a vendor — it is{" "}
                <strong className="font-semibold text-[var(--fg)]">our rough judgement</strong> of
                integration plus first-year maintenance, on a scale of low ≈ days, medium ≈ weeks,
                high ≈ months. Your team, codebase, and scope will move it.
              </p>
              <ul className="mt-3 grid gap-3">
                {EFFORT_ORDER.filter((e) => tally[e].length > 0).map((effort) => (
                  <li
                    key={effort}
                    className="rounded-xl border border-[var(--border)] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-[var(--fg)]">
                        {EFFORT_META[effort].label} effort &mdash; {EFFORT_META[effort].span} each
                      </span>
                      <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--fg)]">
                        {tally[effort].length} {tally[effort].length === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {tally[effort].map((i) => i.label).join(", ")}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {PROFILE_FRAMING[profile][effort]}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* get real quotes */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Get real quotes
              </h3>
              {quotes.length === 0 ? (
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Nothing in this stack is contact-sales, so you can price it without a sales call.
                  Still verify the metered items against the vendor&rsquo;s live page before you
                  commit a budget.
                </p>
              ) : (
                <>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    These have no public price. The only way to budget them is to ask — read our page
                    first so you know what to ask for.
                  </p>
                  <ul className="mt-3 grid gap-3">
                    {quotes.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.sourceHref}
                          onClick={() => track(`cost-planner-quote-${item.id}`, "cost-planner")}
                          className="flex h-full items-center justify-between gap-2 rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--bg)]"
                        >
                          <span>
                            <span className="mr-1 text-brand-600 dark:text-brand-300">
                              Before you call &rarr;
                            </span>
                            {item.label}
                          </span>
                          <span aria-hidden className="text-[var(--muted)]">
                            &rarr;
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            <button
              type="button"
              onClick={reset}
              className="justify-self-start rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]"
            >
              ↺ Start over
            </button>
          </div>
        )}

        <p className="mt-6 border-t border-[var(--border)] pt-5 text-xs text-[var(--muted)]">
          No dollar figures here on purpose: vendors change prices and most are contact-sales.
          Structure is stable; numbers are not — verify with each vendor.
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Nobody pays for placement here; the site is funded by KinesteX, which appears in this list
          on the same terms as everyone else, and any page featuring it says so up front.
        </p>
      </div>
    </div>
  );
}
