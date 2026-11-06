"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  buildCalendar,
  buildOpml,
  buildRss,
  daysBetween,
  fmtStatedDate,
  parseStack,
  stackQuery,
} from "@/lib/stackFeeds.mjs";
import { countdownSnippet } from "@/lib/countdownSnippet";
import ShareCard from "@/components/ShareCard";
import { drawStackCard, type StackCardSpec } from "@/lib/shareCard";
import { stackCardModel } from "@/lib/stackCard.mjs";
import type { StackData, StackVendor } from "@/lib/myStack";
import type { DeadlineItem } from "@/lib/vendorDeadlines";

/**
 * /my-stack (ops/AUDIENCE-30-2026-11-05.md item 24): pick the products your
 * app depends on and see what this site tracks about them.
 *
 * Privacy is the design, not a feature: the choice lives in localStorage
 * under one key and in the page's own URL (?v=<id>,<id>) when the reader
 * shares it. Nothing is sent anywhere, and the downloads (calendar, OPML,
 * RSS snapshot) are built in this tab from data already in the page.
 *
 * Dates and ages are computed after mount on the reader's clock; the server
 * HTML shows the picker with nothing selected and makes no claim about today.
 */

const STORE_KEY = "aifitnessapi:my-stack";
const STALE_DAYS = 90;
const linkCls = "font-medium text-brand-600 hover:text-brand-500";

function readStore(): string | null {
  try {
    return window.localStorage.getItem(STORE_KEY);
  } catch {
    return null;
  }
}
function writeStore(v: string) {
  try {
    if (v) window.localStorage.setItem(STORE_KEY, v);
    else window.localStorage.removeItem(STORE_KEY);
  } catch {
    /* private mode or blocked storage: the URL still carries the stack */
  }
}

function download(name: string, type: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ageLabel(days: number): string {
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function DeadlineRow({ d, today, who }: { d: DeadlineItem; today: string; who?: string }) {
  const n = daysBetween(today, d.target);
  return (
    <li className="rounded-xl border border-[var(--border)] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-[var(--fg)]">{fmtStatedDate(d.date)}</span>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]">{d.grade}</span>
        {n >= 0 ? (
          <span className="rounded-full border border-brand-400/50 bg-brand-500/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-[var(--fg)]">
            {n === 0 ? "today" : `in ${d.exact ? "" : "~"}${n} days`}
          </span>
        ) : (
          <span className="text-xs text-[var(--muted)]">{-n} days ago</span>
        )}
        {who && <span className="text-xs text-[var(--muted)]">· {who}</span>}
      </div>
      <p className="mt-1 text-sm font-medium text-[var(--fg)]">{d.title}</p>
      {!d.exact && (
        <p className="mt-0.5 text-xs text-[var(--muted)]">
          The source gives {fmtStatedDate(d.date)}, no day; counted to its last day.
        </p>
      )}
      <p className="mt-1 text-xs">
        <Link href={d.href} className={linkCls}>
          {d.label} →
        </Link>{" "}
        <span className="text-[var(--muted)]">· checked {fmtStatedDate(d.checkedOn)}</span>
      </p>
    </li>
  );
}

export default function MyStack({ data, origin }: { data: StackData; origin: string }) {
  const ids = useMemo(() => data.vendors.map((v) => v.id), [data]);
  const byId = useMemo(() => new Map(data.vendors.map((v) => [v.id, v])), [data]);
  const [picked, setPicked] = useState<string[]>([]);
  const [today, setToday] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Restore: a ?v= in the address wins (a shared link), else this browser's saved stack.
  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
    const fromUrl = parseStack(new URLSearchParams(window.location.search).get("v"), ids);
    if (fromUrl.length) {
      setPicked(fromUrl);
      setShared(fromUrl.join(",") !== (readStore() ?? ""));
    } else {
      setPicked(parseStack(readStore(), ids));
    }
  }, [ids]);

  function update(next: string[]) {
    const ordered = parseStack(next.join(","), ids);
    setPicked(ordered);
    setShared(false);
    writeStore(ordered.join(","));
    try {
      window.history.replaceState(null, "", `${window.location.pathname}${stackQuery(ordered)}`);
    } catch {
      /* the address is a convenience */
    }
  }
  const toggle = (id: string) => update(picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]);

  const vendors = picked.map((id) => byId.get(id)).filter((v): v is StackVendor => !!v);
  const names = vendors.map((v) => v.short).join(", ");
  const shareUrl = `${origin}/my-stack${stackQuery(picked)}`;

  // Tracker entries naming any picked product, once each, newest first.
  const events = useMemo(() => {
    const idx = [...new Set(vendors.flatMap((v) => v.changes))].sort((a, b) => a - b);
    return idx.map((i) => data.changes[i]);
  }, [vendors, data]);

  const deadlines = useMemo(() => {
    const seen = new Map<string, { d: DeadlineItem; who: string[] }>();
    for (const v of vendors)
      for (const d of v.deadlines) {
        const hit = seen.get(d.key);
        if (hit) hit.who.push(v.short);
        else seen.set(d.key, { d, who: [v.short] });
      }
    return [...seen.values()];
  }, [vendors]);

  const ahead = today ? deadlines.filter((x) => x.d.target >= today).sort((a, b) => (a.d.target < b.d.target ? -1 : 1)) : [];
  const recent = today ? deadlines.filter((x) => x.d.target < today).sort((a, b) => (a.d.target < b.d.target ? 1 : -1)).slice(0, 6) : [];

  const card = today
    ? stackCardModel({
        products: vendors.map((v) => v.short),
        deadlines: deadlines.map((x) => ({ title: x.d.title, target: x.d.target, exact: x.d.exact, who: x.who })),
        today,
      })
    : null;
  const abs = (p: string) => `${origin}${p}`;
  const fileStem = `aifitnessapi-stack-${picked.slice(0, 4).join("-")}${picked.length > 4 ? "-and-more" : ""}`;

  function downloadIcs() {
    download(
      `${fileStem}.ics`,
      "text/calendar;charset=utf-8",
      buildCalendar({
        events,
        absolute: abs,
        name: `AIFitnessAPI — my stack: ${names}`,
        description: `The dated entries of the aifitnessapi.com changes tracker that name ${names}, as of the day this file was saved. Events marked [reported month] or [reported year] have no confirmed day. A saved file does not update: subscribe to ${abs("/changes/calendar.ics")} for every entry as it lands. Rebuild this file at ${shareUrl}`,
        caldesc: `Fitness API deadlines for ${names}. Graded confirmed vs reported.`,
        fallbackDay: today ?? new Date().toISOString().slice(0, 10),
        refresh: false,
      }),
    );
  }
  function downloadRss() {
    download(
      `${fileStem}.xml`,
      "application/rss+xml;charset=utf-8",
      buildRss({
        events,
        absolute: abs,
        title: `AIFitnessAPI — changes for ${names}`,
        link: shareUrl,
        description: `A saved snapshot of the ${events.length} aifitnessapi.com tracker entries that name ${names}, newest first, each graded confirmed or reported. It does not update; the OPML file subscribes to the live per-vendor feeds.`,
      }),
    );
  }
  const feeds = vendors.filter((v) => v.feed);
  const noFeed = vendors.filter((v) => !v.feed);
  function downloadOpml() {
    download(
      `${fileStem}.opml`,
      "text/x-opml;charset=utf-8",
      buildOpml({
        title: `AIFitnessAPI — my stack: ${names}`,
        feeds: [
          ...feeds.map((v) => ({ title: `${v.short} API changes — AIFitnessAPI`, xmlUrl: abs(v.feed!), htmlUrl: abs(v.timeline!) })),
          // A product under the two-entry floor has no feed of its own; its
          // entries reach the reader through the site-wide feed.
          ...(noFeed.length ? [{ title: "Every fitness API change — AIFitnessAPI", xmlUrl: abs("/changes.xml"), htmlUrl: abs("/changes") }] : []),
        ],
      }),
    );
  }
  async function copy(text: string, what: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="mt-8">
      <fieldset className="rounded-2xl border border-[var(--border)] p-4 sm:p-5">
        <legend className="px-1 text-sm font-semibold text-[var(--fg)]">Your stack</legend>
        <div className="space-y-4">
          {data.categories.map((c) => (
            <div key={c.key}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{c.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.vendors
                  .filter((v) => v.category === c.key)
                  .map((v) => {
                    const on = picked.includes(v.id);
                    return (
                      <label
                        key={v.id}
                        className={`cursor-pointer select-none rounded-full border px-3 py-1 text-sm transition-colors ${
                          on
                            ? "border-brand-400 bg-brand-500/10 text-[var(--fg)]"
                            : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400"
                        }`}
                      >
                        <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(v.id)} data-stack-option={v.id} />
                        {v.short}
                      </label>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
        {picked.length > 0 && (
          <button type="button" onClick={() => update([])} className="mt-4 text-xs text-[var(--muted)] underline hover:text-[var(--fg)]">
            Clear the stack
          </button>
        )}
      </fieldset>

      {shared && (
        <p className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/5 p-3 text-sm text-[var(--fg)]">
          You are looking at a stack from a shared link. It is not saved in this browser until you change it.{" "}
          <button type="button" className={linkCls} onClick={() => update(picked)}>
            Save it as mine
          </button>
        </p>
      )}

      {vendors.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--muted)]">
          Pick the products your app depends on. The page then lists their tracked changes and deadlines, the pages
          this site has on each with the date each page declares, and lets you save a calendar of their deadlines.
        </p>
      ) : (
        <>
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5" aria-label="Stack summary and downloads">
            <p className="text-sm text-[var(--fg)]">
              <strong>{vendors.length}</strong> {vendors.length === 1 ? "product" : "products"} ·{" "}
              <strong>{events.length}</strong> tracked {events.length === 1 ? "change" : "changes"} ·{" "}
              <strong>{ahead.length}</strong> dated {ahead.length === 1 ? "item" : "items"} still ahead
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={downloadIcs} disabled={!events.length} className="rounded-full border border-brand-400 px-3 py-1 text-sm font-medium text-[var(--fg)] hover:bg-brand-500/10 disabled:opacity-50" data-stack-download="ics">
                Save calendar (.ics)
              </button>
              <button type="button" onClick={downloadOpml} className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--fg)] hover:border-brand-400" data-stack-download="opml">
                Subscribe in a feed reader (.opml)
              </button>
              <button type="button" onClick={downloadRss} disabled={!events.length} className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--fg)] hover:border-brand-400 disabled:opacity-50" data-stack-download="rss">
                RSS snapshot (.xml)
              </button>
              <button type="button" onClick={() => copy(shareUrl, "link")} className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--fg)] hover:border-brand-400">
                {copied === "link" ? "Link copied" : "Copy share link"}
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
              The calendar and the RSS file are saved copies made in this tab and do not update. To get new entries
              as they land, import the OPML file: it subscribes your reader to{" "}
              {feeds.length ? `the live feed of ${feeds.map((v) => v.short).join(", ")}` : "no per-product feed"}
              {noFeed.length
                ? `${feeds.length ? ", and" : ""} the site-wide feed for ${noFeed.map((v) => v.short).join(", ")}, which ${noFeed.length === 1 ? "has" : "have"} fewer than two tracked entries and no feed of ${noFeed.length === 1 ? "its" : "their"} own`
                : ""}
              . Or subscribe to{" "}
              <a href="/changes/calendar.ics" className={linkCls}>
                the full deadline calendar
              </a>
              .
            </p>
          </section>

          {card && (
            <section className="mt-8" aria-label="Share card" data-stack-card>
              <h2 className="text-xl font-bold tracking-tight text-[var(--fg)]">Share your stack</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                A card of these products and their next deadlines, drawn in this tab. Save it, or post the share link,
                which opens this page with the same products.
              </p>
              <ShareCard<StackCardSpec>
                spec={{ products: card.products, more: card.more, deadlines: card.deadlines, url: "aifitnessapi.com/my-stack", stamp: today ?? undefined }}
                draw={drawStackCard}
                alt={`Share card: my health-data stack, ${card.products.join(", ")}${card.more ? ` and ${card.more} more` : ""}. ${card.deadlines.join(". ") || "No dated item ahead."}`}
                text={card.text}
                filename={`${fileStem}.png`}
                intents={{ place: "my-stack", url: shareUrl, track: false }}
              />
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-xl font-bold tracking-tight text-[var(--fg)]">Deadlines ahead</h2>
            {today === null ? null : ahead.length ? (
              <ul className="mt-4 space-y-3">
                {ahead.map((x) => (
                  <DeadlineRow key={x.d.key} d={x.d} today={today} who={x.who.join(", ")} />
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[var(--muted)]">
                No dated item for these products is still ahead in the tracker or the graveyard.
              </p>
            )}
            {today && recent.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-[var(--muted)]">Recently passed ({recent.length})</summary>
                <ul className="mt-3 space-y-3">
                  {recent.map((x) => (
                    <DeadlineRow key={x.d.key} d={x.d} today={today} who={x.who.join(", ")} />
                  ))}
                </ul>
              </details>
            )}
          </section>

          {vendors.map((v) => {
            const graves = v.graves.map((i) => data.graves[i]);
            const changes = v.changes.map((i) => data.changes[i]);
            const ages = today ? v.pages.filter((p) => p.date).map((p) => daysBetween(p.date!, today)) : [];
            const stale = ages.filter((a) => a > STALE_DAYS).length;
            const checks = changes.map((c) => c.verifiedOn).sort();
            return (
              <section key={v.id} className="mt-10 border-t border-[var(--border)] pt-8" data-stack-vendor={v.id}>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{v.label}</h2>
                {v.firstParty && (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Disclosure: KinesteX funds this site. It is listed here on the same terms as every other product.
                  </p>
                )}
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {v.hub && (
                    <Link href={v.hub} className={linkCls}>
                      Start here →
                    </Link>
                  )}
                  <Link href={v.directory} className={linkCls}>
                    Directory entry →
                  </Link>
                  {v.timeline && (
                    <Link href={v.timeline} className={linkCls}>
                      Change timeline →
                    </Link>
                  )}
                  {v.feed && (
                    <a href={v.feed} className={linkCls}>
                      RSS →
                    </a>
                  )}
                  <Link href={`/alerts?watch=${v.id}`} className={linkCls}>
                    Email alerts →
                  </Link>
                </p>

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Tracked changes ({changes.length})
                </h3>
                {changes.length ? (
                  <ul className="mt-3 space-y-2 text-sm">
                    {changes.map((c) => (
                      <li key={`${c.sortDate}-${c.title}`}>
                        <span className="font-semibold text-[var(--fg)]">{fmtStatedDate(c.date)}</span>{" "}
                        <span className="text-xs text-[var(--muted)]">({c.status})</span> {c.title}.{" "}
                        <Link href={c.page.href} className={linkCls}>
                          {c.page.label} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-[var(--muted)]">No entry in the changes tracker names {v.short}.</p>
                )}
                {checks.length > 0 && (
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    Each entry was last checked between {fmtStatedDate(checks[0])} and {fmtStatedDate(checks.at(-1)!)}.
                  </p>
                )}

                {graves.length > 0 && (
                  <>
                    <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                      In the graveyard ({graves.length})
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm">
                      {graves.map((g) => (
                        <li key={g.id}>
                          <span className="font-semibold text-[var(--fg)]">{g.name}</span>{" "}
                          <span className="text-xs text-[var(--muted)]">
                            ({g.status}; {g.endLabel.toLowerCase()}: {g.end ? fmtStatedDate(g.end) : "no date given"})
                          </span>{" "}
                          <Link href={g.href} className={linkCls}>
                            The stone →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Pages on this site ({v.pages.length})
                </h3>
                {today && ages.length > 0 && (
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {stale
                      ? `${stale} of ${ages.length} dated pages declare a date more than ${STALE_DAYS} days old.`
                      : `Every dated page declares a date within the last ${STALE_DAYS} days.`}{" "}
                    The newest is {ageLabel(Math.min(...ages))}, the oldest {ageLabel(Math.max(...ages))}.
                  </p>
                )}
                <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
                  {v.pages.map((p) => {
                    const age = today && p.date ? daysBetween(p.date, today) : null;
                    return (
                      <li key={p.href}>
                        <Link href={p.href} className={linkCls}>
                          {p.label}
                        </Link>{" "}
                        <span className={`text-xs ${age !== null && age > STALE_DAYS ? "text-amber-600" : "text-[var(--muted)]"}`}>
                          · {p.group}
                          {p.date ? ` · ${fmtStatedDate(p.date)}` : " · no date declared"}
                          {age !== null && age > STALE_DAYS ? " · over 90 days" : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {v.countdown && (
                  <details className="mt-5 text-sm">
                    <summary className="cursor-pointer text-xs text-[var(--muted)]">Embed a countdown to the next {v.short} deadline</summary>
                    <pre className="mt-2 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--fg)]">
                      <code>{countdownSnippet({ id: v.id, name: v.short, kind: "vendor", canonical: v.timeline ?? v.directory })}</code>
                    </pre>
                    <button
                      type="button"
                      className="mt-2 text-xs font-medium text-brand-600 hover:text-brand-500"
                      onClick={() =>
                        copy(countdownSnippet({ id: v.id, name: v.short, kind: "vendor", canonical: v.timeline ?? v.directory }), v.id)
                      }
                    >
                      {copied === v.id ? "Copied" : "Copy embed code"}
                    </button>{" "}
                    <a href={v.countdown} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:text-brand-500">
                      Preview
                    </a>
                  </details>
                )}
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
