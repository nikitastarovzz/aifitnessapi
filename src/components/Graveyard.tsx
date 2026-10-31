"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  endOfPeriod,
  fmtGraveDate,
  graveShareText,
  graveYear,
  isExactDay,
  STATUS_LABEL,
  type GraveEntry,
  type GraveStatus,
} from "@/data/graveyard";

/**
 * The Fitness API Graveyard grid: one headstone per entry, with filters
 * (vendor, year, status), a sort, and a share panel per stone.
 *
 * Server-rendered with every filter off and the default sort, so the
 * prerendered HTML holds every entry for crawlers and for qa's GRAVEYARD-ROWS;
 * filters only hide stones in the browser. Countdowns are computed in the
 * browser for the same reason /changes computes them there: a static build
 * would freeze "N days left" at deploy time.
 *
 * Sharing never leaves the tab: the text is copied to the clipboard and the
 * PNG card is drawn on a <canvas> and handed to the browser as a download.
 */

type Sort = "end-desc" | "end-asc" | "name" | "vendor";

const SORTS: { id: Sort; label: string }[] = [
  { id: "end-desc", label: "End date, newest first" },
  { id: "end-asc", label: "End date, oldest first" },
  { id: "name", label: "Name, A to Z" },
  { id: "vendor", label: "Vendor, A to Z" },
];

const STATUS_STYLE: Record<GraveStatus, string> = {
  dead: "border-zinc-400/60 bg-zinc-500/15 text-[var(--fg)]",
  dying: "border-amber-500/60 bg-amber-500/15 text-[var(--fg)]",
  deprecated: "border-sky-500/50 bg-sky-500/10 text-[var(--fg)]",
};

const STATUSES: GraveStatus[] = ["dead", "dying", "deprecated"];

function endKey(e: GraveEntry): string {
  return e.end ? endOfPeriod(e.end) : "";
}

function sortEntries(list: GraveEntry[], sort: Sort): GraveEntry[] {
  const out = [...list];
  const byEnd = (a: GraveEntry, b: GraveEntry, dir: 1 | -1) => {
    const ka = endKey(a);
    const kb = endKey(b);
    if (!ka && !kb) return a.name.localeCompare(b.name);
    if (!ka) return 1; // undated last either way
    if (!kb) return -1;
    return ka === kb ? a.name.localeCompare(b.name) : ka < kb ? -dir : dir;
  };
  if (sort === "end-desc") out.sort((a, b) => byEnd(a, b, -1));
  else if (sort === "end-asc") out.sort((a, b) => byEnd(a, b, 1));
  else if (sort === "name") out.sort((a, b) => a.name.localeCompare(b.name));
  else out.sort((a, b) => a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name));
  return out;
}

/** Days from today (UTC) to the end of the entry's period; null before mount. */
function useDaysLeft(end: string | null): number | null {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    if (!end) return;
    const target = Date.parse(`${endOfPeriod(end)}T00:00:00Z`);
    if (Number.isNaN(target)) return;
    const now = new Date();
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    setDays(Math.round((target - today) / 86_400_000));
  }, [end]);
  return days;
}

function DyingCountdown({ end }: { end: string }) {
  const days = useDaysLeft(end);
  if (days === null) return null;
  const exact = isExactDay(end);
  if (days < 0) {
    return (
      <span data-countdown className="text-xs font-semibold text-amber-700 dark:text-amber-300">
        Date passed: this stone is due for a re-check
      </span>
    );
  }
  const label =
    days === 0
      ? "today"
      : exact
        ? `${days} day${days === 1 ? "" : "s"} left`
        : `~${days} days to the end of ${fmtGraveDate(end)}`;
  return (
    <span
      data-countdown
      className="rounded-full border border-amber-500/60 bg-amber-500/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-[var(--fg)]"
      title={exact ? undefined : "The vendor names a period, not a day; counted to its last day"}
    >
      {label}
    </span>
  );
}

// ── The PNG card ─────────────────────────────────────────────────────────

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
      continue;
    }
    if (line) lines.push(line);
    line = words[i];
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line) lines.push(line);
  const used = lines.join(" ").split(/\s+/).length;
  if (used < words.length && lines.length) {
    let last = lines[lines.length - 1];
    while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.split(" ").slice(0, -1).join(" ");
    lines[lines.length - 1] = `${last}…`;
  }
  return lines.slice(0, maxLines);
}

const CARD_FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/** Draws one entry as a 1200×630 card. Pure canvas, no network. */
export function drawGraveCard(canvas: HTMLCanvasElement, e: GraveEntry): void {
  const W = 1200;
  const H = 630;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0b1412");
  bg.addColorStop(1, "#050807");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Ground.
  ctx.fillStyle = "#13201c";
  ctx.fillRect(0, 560, W, H - 560);
  ctx.strokeStyle = "#1f3a32";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 560);
  ctx.lineTo(W, 560);
  ctx.stroke();

  // The stone: an arch-topped slab.
  const sx = 230;
  const sw = 740;
  const top = 48;
  const r = 150;
  ctx.beginPath();
  ctx.moveTo(sx, 575);
  ctx.lineTo(sx, top + r);
  ctx.arcTo(sx, top, sx + r, top, r);
  ctx.lineTo(sx + sw - r, top);
  ctx.arcTo(sx + sw, top, sx + sw, top + r, r);
  ctx.lineTo(sx + sw, 575);
  ctx.closePath();
  const stone = ctx.createLinearGradient(sx, top, sx + sw, 575);
  stone.addColorStop(0, "#26302d");
  stone.addColorStop(1, "#1a2220");
  ctx.fillStyle = stone;
  ctx.fill();
  ctx.strokeStyle = "#3d4b47";
  ctx.lineWidth = 3;
  ctx.stroke();

  const cx = W / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const statusColor: Record<GraveStatus, string> = { dead: "#a1a1aa", dying: "#fbbf24", deprecated: "#7dd3fc" };
  ctx.fillStyle = statusColor[e.status];
  ctx.font = `600 22px ${CARD_FONT}`;
  ctx.fillText(STATUS_LABEL[e.status].toUpperCase().split("").join(" "), cx, top + 62);

  ctx.fillStyle = "#f4f4f5";
  ctx.font = `700 44px ${CARD_FONT}`;
  const nameLines = wrap(ctx, e.name, sw - 120, 2);
  let y = top + 122;
  for (const l of nameLines) {
    ctx.fillText(l, cx, y);
    y += 52;
  }

  ctx.fillStyle = "#a1a1aa";
  ctx.font = `500 26px ${CARD_FONT}`;
  ctx.fillText(e.vendor, cx, y + 2);
  y += 52;

  const from = e.launched ? e.launched.date.slice(0, 4) : "?";
  const to = e.end ? fmtGraveDate(e.end) : "undated";
  ctx.fillStyle = "#e4e4e7";
  ctx.font = `600 32px ${CARD_FONT}`;
  ctx.fillText(`${from}  –  ${to}`, cx, y);
  ctx.fillStyle = "#71717a";
  ctx.font = `400 20px ${CARD_FONT}`;
  ctx.fillText(e.endLabel, cx, y + 30);
  y += 76;

  ctx.fillStyle = "#d4d4d8";
  ctx.font = `italic 400 23px ${CARD_FONT}`;
  for (const l of wrap(ctx, `“${e.source.quote}”`, sw - 120, 3)) {
    ctx.fillText(l, cx, y);
    y += 31;
  }
  ctx.fillStyle = "#71717a";
  ctx.font = `400 18px ${CARD_FONT}`;
  ctx.fillText(`— ${e.source.publisher}`, cx, Math.min(y + 4, 548));

  ctx.textAlign = "left";
  ctx.fillStyle = "#34d399";
  ctx.font = `600 24px ${CARD_FONT}`;
  ctx.fillText("aifitnessapi.com/graveyard", 48, 608);
  ctx.textAlign = "right";
  ctx.fillStyle = "#a1a1aa";
  ctx.font = `400 20px ${CARD_FONT}`;
  ctx.fillText("The Fitness API Graveyard", W - 48, 608);
}

function SharePanel({ e, pageUrl }: { e: GraveEntry; pageUrl: string }) {
  const [msg, setMsg] = useState("");
  const link = `${pageUrl}#${e.id}`;
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };
  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(`${what} copied`);
    } catch {
      flash("Copy failed: your browser blocked the clipboard");
    }
  };
  const download = () => {
    const canvas = document.createElement("canvas");
    drawGraveCard(canvas, e);
    canvas.toBlob((blob) => {
      if (!blob) return flash("Could not draw the card");
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `fitness-api-graveyard-${e.id}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
      flash("Card downloaded");
    }, "image/png");
  };
  const btn =
    "rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--fg)] transition-colors hover:border-brand-400";
  return (
    <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-left" data-share-panel={e.id}>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => copy(graveShareText(e, link), "Text")}>
          Copy text
        </button>
        <button type="button" className={btn} onClick={() => copy(link, "Link")}>
          Copy link
        </button>
        <button type="button" className={btn} onClick={download} data-download-card={e.id}>
          Download card (PNG)
        </button>
      </div>
      <p className="mt-2 min-h-[1rem] text-[11px] text-[var(--muted)]" aria-live="polite">
        {msg || "The card is drawn in your browser; nothing is uploaded."}
      </p>
    </div>
  );
}

function Stone({ e, pageUrl, hidden }: { e: GraveEntry; pageUrl: string; hidden: boolean }) {
  const [open, setOpen] = useState(false);
  const from = e.launched ? e.launched.date.slice(0, 4) : "?";
  const to = e.end ? (isExactDay(e.end) || /^\d{4}-\d{2}$/.test(e.end) ? e.end.slice(0, 4) : e.end) : "…";
  return (
    <li
      id={e.id}
      data-grave={e.id}
      data-status={e.status}
      hidden={hidden}
      className={`${hidden ? "hidden" : "flex"} scroll-mt-24 min-w-0 flex-col rounded-b-xl rounded-t-[5.5rem] border border-[var(--border)] bg-[var(--surface)] px-4 pb-4 pt-8 shadow-sm sm:px-5`}
    >
      <div className="text-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLE[e.status]}`}>
            {STATUS_LABEL[e.status]}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">{e.kind}</span>
        </div>
        <h3 className="mt-2 break-words text-lg font-bold leading-snug text-[var(--fg)]">{e.name}</h3>
        <p className="text-sm text-[var(--muted)]">{e.vendor}</p>
        <p className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight text-[var(--fg)]" aria-label={`${e.launched ? `Launched ${e.launched.date.slice(0, 4)}` : "Launch date not sourced"}, ${e.endLabel.toLowerCase()} ${fmtGraveDate(e.end)}`}>
          {from} – {to}
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {e.endLabel}: <span className="font-semibold text-[var(--fg)]">{fmtGraveDate(e.end)}</span>
        </p>
        {e.status === "dying" && e.end && (
          <p className="mt-1.5">
            <DyingCountdown end={e.end} />
          </p>
        )}
      </div>

      <blockquote className="mt-4 border-l-2 border-[var(--border)] pl-3 text-sm italic leading-relaxed text-[var(--fg)]">
        &ldquo;{e.source.quote}&rdquo;
        <footer className="mt-1 text-xs not-italic text-[var(--muted)]">
          —{" "}
          <a href={e.source.url} rel="noopener" className="underline decoration-dotted hover:text-[var(--fg)]">
            {e.source.publisher}
          </a>
          {e.source.capturedOn && <>, captured {fmtGraveDate(e.source.capturedOn)}</>}
        </footer>
      </blockquote>

      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{e.summary}</p>

      {e.milestones && e.milestones.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
          {e.milestones.map((m) => (
            <li key={m.date + m.label}>
              <span className="font-semibold text-[var(--fg)]">{fmtGraveDate(m.date)}</span> · {m.label}:{" "}
              <a href={m.url} rel="noopener" className="italic underline decoration-dotted hover:text-[var(--fg)]">
                &ldquo;{m.quote}&rdquo;
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-sm">
        <span className="font-semibold text-[var(--fg)]">Replaced by: </span>
        {e.replacedBy.length === 0 ? (
          <span className="text-[var(--muted)]">no replacement named by the vendor</span>
        ) : (
          e.replacedBy.map((r, i) => (
            <span key={r.label}>
              {i > 0 && "; "}
              {r.href ? (
                <Link href={r.href} className="font-medium text-brand-600 hover:text-brand-500">
                  {r.label}
                </Link>
              ) : (
                <span className="text-[var(--fg)]">{r.label}</span>
              )}
            </span>
          ))
        )}
      </p>
      {e.launched && (
        <p className="mt-1 text-xs text-[var(--muted)]">
          Launch: {fmtGraveDate(e.launched.date)},{" "}
          <a href={e.launched.url} rel="noopener" className="underline decoration-dotted hover:text-[var(--fg)]">
            {e.launched.label}
          </a>
        </p>
      )}

      <div className="mt-auto pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-xs text-[var(--muted)]">
          <span>
            Checked {fmtGraveDate(e.source.checkedOn)}
            {e.page && (
              <>
                {" · "}
                <Link href={e.page.href} className="font-medium text-brand-600 hover:text-brand-500">
                  {e.page.label}
                </Link>
              </>
            )}
          </span>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg border border-[var(--border)] px-2.5 py-1 font-semibold text-[var(--fg)] transition-colors hover:border-brand-400"
            data-share-toggle={e.id}
          >
            {open ? "Close" : "Share"}
          </button>
        </div>
        {open && <SharePanel e={e} pageUrl={pageUrl} />}
      </div>
    </li>
  );
}

export default function Graveyard({
  entries,
  vendors,
  pageUrl,
}: {
  entries: GraveEntry[];
  vendors: string[];
  pageUrl: string;
}) {
  const [vendor, setVendor] = useState("any");
  const [year, setYear] = useState("any");
  const [statuses, setStatuses] = useState<GraveStatus[]>([]);
  const [sort, setSort] = useState<Sort>("end-desc");

  const years = useMemo(() => {
    const ys = [...new Set(entries.map(graveYear).filter((y): y is string => !!y))].sort().reverse();
    return entries.some((e) => !e.end) ? [...ys, "undated"] : ys;
  }, [entries]);

  const sorted = useMemo(() => sortEntries(entries, sort), [entries, sort]);
  const visible = (e: GraveEntry) =>
    (vendor === "any" || e.vendor === vendor) &&
    (year === "any" || (year === "undated" ? !e.end : graveYear(e) === year)) &&
    (statuses.length === 0 || statuses.includes(e.status));
  const shown = sorted.filter(visible).length;
  const filtered = vendor !== "any" || year !== "any" || statuses.length > 0;
  const count = (s: GraveStatus) => entries.filter((e) => e.status === s).length;

  const select =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-sm text-[var(--fg)] sm:w-auto";

  return (
    <div data-graveyard>
      <div
        role="group"
        aria-label="Filter and sort the graveyard"
        className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end"
      >
        <div className="flex flex-col gap-1 sm:col-span-2 lg:mr-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Status</span>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => {
              const pressed = statuses.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={pressed}
                  data-filter-status={s}
                  onClick={() => setStatuses(pressed ? statuses.filter((x) => x !== s) : [...statuses, s])}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    pressed
                      ? "border-brand-500 bg-brand-500/15 text-[var(--fg)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400 hover:text-[var(--fg)]"
                  }`}
                >
                  {STATUS_LABEL[s]} <span className="tabular-nums">({count(s)})</span>
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Vendor
          <select className={select} value={vendor} onChange={(ev) => setVendor(ev.target.value)} data-filter-vendor>
            <option value="any">All vendors</option>
            {vendors.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Year it ended
          <select className={select} value={year} onChange={(ev) => setYear(ev.target.value)} data-filter-year>
            <option value="any">Any year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y === "undated" ? "No date given" : y}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Sort
          <select className={select} value={sort} onChange={(ev) => setSort(ev.target.value as Sort)} data-sort>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)] sm:col-span-2 lg:ml-auto" aria-live="polite">
          <span>
            Showing <strong className="text-[var(--fg)]" data-shown-count>{shown}</strong> of {entries.length}
          </span>
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setVendor("any");
                setYear("any");
                setStatuses([]);
              }}
              className="font-semibold text-brand-600 hover:text-brand-500"
            >
              Clear filters
            </button>
          )}
        </p>
      </div>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((e) => (
          <Stone key={e.id} e={e} pageUrl={pageUrl} hidden={!visible(e)} />
        ))}
      </ul>
      {shown === 0 && (
        <p className="mt-6 text-center text-sm text-[var(--muted)]">No entry matches those filters.</p>
      )}
    </div>
  );
}
