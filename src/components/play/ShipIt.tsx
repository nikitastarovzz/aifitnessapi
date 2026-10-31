"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { track } from "@/lib/track";
import {
  ENDINGS,
  INITIAL,
  KICKOFF,
  MAX_STACKS,
  PLANNED_LAUNCH,
  PRODUCTS,
  RULES,
  RUNWAY_WEEKS,
  STACKS,
  START_USERS,
  currentEvent,
  eventById,
  keptShare,
  reduce,
  shareText,
  shipDate,
  totalUsers,
  type ChoiceId,
  type ShipEvent,
  type StackId,
  type State,
} from "@/lib/shipIt";

/**
 * The playable half of /play/ship-it. All logic is the pure reducer in
 * src/lib/shipIt.ts; this file only renders its states, draws the share card
 * on a canvas and copies the share text. Nothing leaves the browser.
 */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-11-02" → "November 2, 2026"; "2026-10" → "October 2026". */
function human(d: string): string {
  const [y, m, day] = d.split("-");
  if (!m) return y;
  const month = MONTHS[Number(m) - 1];
  return day ? `${month} ${Number(day)}, ${y}` : `${month} ${y}`;
}

const shell = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7";
const small =
  "rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]";
const primary =
  "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50";
const linkCls = "font-medium text-brand-600 hover:text-brand-500";

const CHOICE_ORDER: ChoiceId[] = ["act", "hedge", "ignore"];
const stackName = (id: StackId) => STACKS.find((s) => s.id === id)?.name ?? id;
const fmt = (n: number) => n.toLocaleString("en-US");

function Meter({ s }: { s: State }) {
  const users = totalUsers(s);
  return (
    <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3" data-ship-it-meter>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
        <dt className="text-xs text-[var(--muted)]">Slip used (game weeks)</dt>
        <dd className="mt-1 font-semibold text-[var(--fg)]">
          {s.weeks} of {RUNWAY_WEEKS}
        </dd>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
        <dt className="text-xs text-[var(--muted)]">Users connected (game)</dt>
        <dd className="mt-1 font-semibold text-[var(--fg)]">
          {fmt(users)} of {fmt(START_USERS)}
        </dd>
      </div>
      <div className="col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 sm:col-span-1">
        <dt className="text-xs text-[var(--muted)]">By stack</dt>
        <dd className="mt-1 text-xs text-[var(--fg)]">
          {s.stacks.map((id) => (
            <span key={id} className="mr-2 inline-block">
              {stackName(id)} {fmt(s.users[id] ?? 0)}
            </span>
          ))}
        </dd>
      </div>
    </dl>
  );
}

function EventCard({ e }: { e: ShipEvent }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
        <time dateTime={e.sortDate}>{human(e.date)}</time> · {e.dateNote}
      </p>
      <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--fg)] sm:text-2xl">{e.title}</h3>
      <p className="mt-1 text-xs text-[var(--muted)]">Hits: {e.stacks.map(stackName).join(", ")}</p>
      <blockquote className="mt-4 border-l-2 border-brand-400/50 pl-3 text-[var(--fg)]">
        <p className="italic">&ldquo;{e.quote}&rdquo;</p>
        <footer className="mt-1 text-xs not-italic text-[var(--muted)]">
          {e.quoteBy === "vendor" ? "" : "Not the vendor's words: "}
          {e.speaker}. Sourced on{" "}
          <Link href={e.source.href} className={linkCls}>
            {e.source.label}
          </Link>
          .
        </footer>
      </blockquote>
    </div>
  );
}

/** Draw the 1200×630 result card. Squares are drawn, not emoji, so every OS renders them the same. */
function drawCard(canvas: HTMLCanvasElement, s: State) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = 1200;
  const H = 630;
  canvas.width = W;
  canvas.height = H;
  ctx.fillStyle = "#0b0d12";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#10b981";
  ctx.fillRect(0, 0, W, 10);
  const end = s.ending ? ENDINGS[s.ending] : null;
  const product = PRODUCTS.find((p) => p.id === s.product)?.name ?? "Fitness app";
  ctx.fillStyle = "#6ee7b7";
  ctx.font = "600 30px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("SHIP IT · a fitness-app survival game", 64, 84);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 84px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(end?.title ?? "", 64, 190);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "500 34px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(`${product} on ${s.stacks.map(stackName).join(" + ")}`, 64, 250);
  const kept = Math.round(keptShare(s) * 100);
  const shipped = s.ending === "shipped" || s.ending === "limped";
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 46px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(`${kept}% of users kept`, 64, 340);
  ctx.fillText(shipped ? `Launched ${human(shipDate(s))}` : `${s.weeks} weeks of slip`, 64, 405);
  const size = 46;
  const gap = 12;
  s.log.forEach((l, i) => {
    const color = l.choice === "handled" ? "#e5e7eb" : l.wiped ? "#ef4444" : Object.values(l.lost).some((n) => (n ?? 0) > 0) ? "#facc15" : "#22c55e";
    ctx.fillStyle = color;
    ctx.fillRect(64 + i * (size + gap), 445, size, size);
  });
  ctx.fillStyle = "#94a3b8";
  ctx.font = "400 24px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("Every event is sourced and dated; weeks and users are game rules.", 64, 545);
  ctx.fillStyle = "#6ee7b7";
  ctx.font = "600 30px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("aifitnessapi.com/play/ship-it", 64, 592);
}

export default function ShipIt() {
  const [s, setS] = useState<State>(INITIAL);
  const [picked, setPicked] = useState<StackId[]>([]);
  const [outcome, setOutcome] = useState<{ before: State; after: State; choice: ChoiceId } | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [png, setPng] = useState<string | null>(null);

  const go = (next: State) => {
    setS(next);
    setOutcome(null);
    headRef.current?.scrollIntoView({ block: "nearest" });
  };

  useEffect(() => {
    if (s.phase !== "end" || !canvasRef.current) return;
    drawCard(canvasRef.current, s);
    try {
      setPng(canvasRef.current.toDataURL("image/png"));
    } catch {
      setPng(null);
    }
  }, [s]);

  const restart = () => {
    setPicked([]);
    setCopied(false);
    setPng(null);
    go(reduce(s, { type: "restart" }));
  };

  let body: ReactNode;

  if (outcome) {
    const e = currentEvent(outcome.before);
    const entry = outcome.after.log[outcome.before.log.length];
    const lost = Object.values(entry?.lost ?? {}).reduce((n, x) => n + (x ?? 0), 0);
    const skipped = outcome.after.log.slice(outcome.before.log.length + 1).filter((l) => l.choice === "handled");
    body = (
      <div className={shell} data-ship-it="outcome" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Your call</p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--fg)]">{e?.choices[outcome.choice]}</h3>
        <p className="mt-3 text-[var(--fg)]">
          {entry?.weeks ? `${entry.weeks} game week${entry.weeks === 1 ? "" : "s"} of slip` : "No slip"}
          {", "}
          {lost ? `${fmt(lost)} users lost${entry?.wiped ? ": that stack is gone" : ""}` : "no users lost"}.
        </p>
        {skipped.length > 0 && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            Already handled by this move:{" "}
            {skipped.map((l) => eventById(l.eventId)?.title).join(", ")}.
          </p>
        )}
        <p className="mt-2 text-xs text-[var(--muted)]">
          Game rule for a {e?.kind.replace(/-/g, " ")}: {RULES[e?.kind ?? "limit"][outcome.choice].weeks} weeks,{" "}
          {Math.round(RULES[e?.kind ?? "limit"][outcome.choice].lose * 100)}% of that stack&rsquo;s users. Not an estimate.
        </p>
        <div className="mt-5">
          <button type="button" className={primary} data-ship-it-next onClick={() => go(outcome.after)}>
            {outcome.after.phase === "end" ? "See how it ended" : "Next event"}
          </button>
        </div>
      </div>
    );
  } else if (s.phase === "product") {
    body = (
      <div className={shell} data-ship-it="product">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Step 1 of 2</p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--fg)]">What is your team building?</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Kickoff is {human(KICKOFF)}. Launch is planned for {human(PLANNED_LAUNCH)}.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                data-ship-it-product={p.id}
                onClick={() => {
                  track("ship-it-start", p.id);
                  setPicked(p.suggested);
                  go(reduce(s, { type: "product", id: p.id }));
                }}
                className="block h-full w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-left transition-colors hover:border-brand-400"
              >
                <span className="block font-semibold text-[var(--fg)]">{p.name}</span>
                <span className="mt-1 block text-sm text-[var(--muted)]">{p.blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (s.phase === "stacks") {
    const toggle = (id: StackId) =>
      setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= MAX_STACKS ? cur : [...cur, id]));
    body = (
      <div className={shell} data-ship-it="stacks">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Step 2 of 2</p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--fg)]">Pick up to {MAX_STACKS} data stacks</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {fmt(START_USERS)} users connect, split evenly across what you pick. More stacks, more exposure.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {STACKS.map((st) => {
            const on = picked.includes(st.id);
            const full = !on && picked.length >= MAX_STACKS;
            return (
              <li key={st.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  disabled={full}
                  data-ship-it-stack={st.id}
                  onClick={() => toggle(st.id)}
                  className={`block h-full w-full rounded-xl border p-3 text-left transition-colors disabled:opacity-40 ${
                    on ? "border-brand-500 bg-brand-500/10" : "border-[var(--border)] bg-[var(--bg)] hover:border-brand-400"
                  }`}
                >
                  <span className="block font-semibold text-[var(--fg)]">
                    {on ? "✓ " : ""}
                    {st.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">{st.blurb}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className={primary}
            disabled={picked.length === 0}
            data-ship-it-go
            onClick={() => go(reduce(s, { type: "stacks", ids: picked }))}
          >
            Start the clock
          </button>
          <button type="button" className={small} onClick={restart}>
            Back
          </button>
        </div>
      </div>
    );
  } else if (s.phase === "event") {
    const e = currentEvent(s);
    body = e ? (
      <div className={shell} data-ship-it="event" data-ship-it-current={e.id} aria-live="polite">
        <div className="flex items-center gap-1.5" aria-hidden>
          {s.queue.map((id, i) => (
            <span key={id} className={`h-1.5 flex-1 rounded-full ${i <= s.index ? "bg-brand-500" : "bg-[var(--border)]"}`} />
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Event {s.index + 1} of {s.queue.length}
        </p>
        <div className="mt-4">
          <Meter s={s} />
        </div>
        <div className="mt-5">
          <EventCard e={e} />
        </div>
        <p className="mt-5 text-sm font-semibold text-[var(--fg)]">Your move:</p>
        <ul className="mt-2 grid gap-2">
          {CHOICE_ORDER.map((c) => (
            <li key={c}>
              <button
                type="button"
                data-choice={c}
                onClick={() => setOutcome({ before: s, after: reduce(s, { type: "choose", choice: c }), choice: c })}
                className="block w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-left text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400"
              >
                {e.choices[c]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    ) : null;
  } else {
    const end = s.ending ? ENDINGS[s.ending] : null;
    const shipped = s.ending === "shipped" || s.ending === "limped";
    const text = shareText(s, typeof window === "undefined" ? undefined : window.location.origin);
    body = (
      <div className={shell} data-ship-it="end" data-ship-it-ending={s.ending ?? ""}>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          {end?.survived ? "Survived" : "Did not survive"}
        </p>
        <h3 className="mt-2 text-3xl font-bold tracking-tight text-[var(--fg)]">{end?.title}</h3>
        <p className="mt-2 text-[var(--muted)]">{end?.line}</p>
        <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
            <dt className="text-xs text-[var(--muted)]">Launch</dt>
            <dd className="mt-1 font-semibold text-[var(--fg)]">{shipped ? human(shipDate(s)) : "Never"}</dd>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
            <dt className="text-xs text-[var(--muted)]">Users kept</dt>
            <dd className="mt-1 font-semibold text-[var(--fg)]">
              {fmt(totalUsers(s))} ({Math.round(keptShare(s) * 100)}%)
            </dd>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
            <dt className="text-xs text-[var(--muted)]">Slip</dt>
            <dd className="mt-1 font-semibold text-[var(--fg)]">
              {s.weeks} of {RUNWAY_WEEKS} game weeks
            </dd>
          </div>
        </dl>

        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Your timeline</h4>
        <ol className="mt-2 space-y-2 text-sm">
          {s.log.map((l) => {
            const e = eventById(l.eventId);
            if (!e) return null;
            const lost = Object.values(l.lost).reduce((n, x) => n + (x ?? 0), 0);
            return (
              <li key={l.eventId} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
                <span className="text-xs text-[var(--muted)]">{human(e.date)}</span>{" "}
                <Link href={e.source.href} className={linkCls}>
                  {e.title}
                </Link>
                <span className="block text-[var(--fg)]">
                  {l.choice === "handled" ? "Already handled" : e.choices[l.choice]}
                  <span className="text-[var(--muted)]">
                    {" "}
                    · {l.weeks} wk · {fmt(lost)} users lost
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Share it</h4>
        <canvas
          ref={canvasRef}
          className="mt-2 h-auto w-full rounded-xl border border-[var(--border)]"
          width={1200}
          height={630}
          aria-label="Your Ship It result card"
          data-ship-it-card
        />
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--fg)]" data-ship-it-share>
          {text}
        </pre>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={primary}
            data-ship-it-copy
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                track("ship-it-copy", s.ending ?? "");
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? "Copied" : "Copy result"}
          </button>
          {png && (
            <a
              href={png}
              download="ship-it.png"
              className={small}
              data-ship-it-download
              onClick={() => track("ship-it-download", s.ending ?? "")}
            >
              Download card (PNG)
            </a>
          )}
          <button type="button" className={small} data-ship-it-restart onClick={restart}>
            Play again
          </button>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          The text and the card show squares, not events, so they do not spoil anyone&rsquo;s run. Green kept every
          user, yellow lost some, red lost a whole stack, white was already handled.
        </p>
      </div>
    );
  }

  return (
    <div ref={headRef} className="mt-8 scroll-mt-24">
      {body}
    </div>
  );
}
