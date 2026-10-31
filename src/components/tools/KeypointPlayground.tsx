"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  jointAcross,
  label,
  mappingBetween,
  parseState,
  snippet,
  type KRow,
  type KScheme,
} from "@/lib/keypointMapping.mjs";
import { FIGURE, LAYOUT, VIEW_H, VIEW_W } from "@/lib/keypointLayout.mjs";

/**
 * The interactive half of /tools/keypoint-playground.
 *
 * Everything it says about a point comes from the generated keypoint dataset
 * through src/lib/keypointMapping.mjs, the same module
 * scripts/keypoint-mapping.test.mjs checks. The figure and the dot positions
 * come from src/lib/keypointLayout.mjs and are a drawing only.
 *
 * State lives in ?from=&to=&joint= so a link restores the view. As on
 * /compare-apis it is read from window.location on the client (reading
 * searchParams on the server would make the route dynamic) and written with
 * router.replace, and the canonical stays the bare path.
 */

export const DEFAULTS = { from: "coco-17", to: "blazepose-33", joint: "leftknee" };

type Props = {
  schemes: KScheme[];
  crosswalk: KRow[];
  fetchedOn: string;
  rule: string;
  schemeHref: Record<string, string>;
  canonical: string;
};

const LAYOUT_XY = LAYOUT as Record<string, [number, number]>;

export default function KeypointPlayground({ schemes, crosswalk, fetchedOn, rule, schemeHref, canonical }: Props) {
  const [from, setFrom] = useState(DEFAULTS.from);
  const [to, setTo] = useState(DEFAULTS.to);
  const [joint, setJoint] = useState(DEFAULTS.joint);
  const [lang, setLang] = useState<"ts" | "py">("ts");
  const [copied, setCopied] = useState<"" | "code" | "link" | "failed">("");
  // The URL is written only after it has been read once, or the defaults of
  // the first render would overwrite a shared link before it is applied.
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const readUrl = useCallback(() => {
    const s = parseState(schemes, window.location.search, DEFAULTS);
    setFrom(s.from);
    setTo(s.to);
    setJoint(s.joint);
    setReady(true);
  }, [schemes]);

  useEffect(() => {
    readUrl();
    window.addEventListener("popstate", readUrl);
    return () => window.removeEventListener("popstate", readUrl);
  }, [readUrl]);

  useEffect(() => {
    if (!ready) return;
    const next = `${pathname}?from=${from}&to=${to}&joint=${encodeURIComponent(joint)}`;
    if (window.location.pathname + window.location.search !== next) router.replace(next, { scroll: false });
  }, [ready, from, to, joint, pathname, router]);

  const fromScheme = schemes.find((s) => s.slug === from)!;
  const toScheme = schemes.find((s) => s.slug === to)!;

  // Keep the selected joint valid when the scheme changes: same key if this
  // scheme has it, else the scheme's first point.
  const pickFrom = (slug: string) => {
    const s = schemes.find((x) => x.slug === slug);
    if (!s) return;
    setFrom(slug);
    if (slug === to) setTo(from);
    if (!s.points.some((p) => p.key === joint)) setJoint(s.points[0]?.key ?? "");
  };
  const pickTo = (slug: string) => {
    if (slug === from) {
      pickFrom(to);
      setTo(from);
      return;
    }
    setTo(slug);
  };
  const swap = () => {
    const f = from;
    pickFrom(to);
    setTo(f);
  };

  const across = useMemo(() => jointAcross(schemes, crosswalk, from, joint), [schemes, crosswalk, from, joint]);
  const mapping = useMemo(() => mappingBetween(schemes, crosswalk, from, to), [schemes, crosswalk, from, to]);
  const shareUrl = `${canonical}?from=${from}&to=${to}&joint=${encodeURIComponent(joint)}`;
  const code = useMemo(
    () => snippet(mapping, lang, { fetchedOn, url: `${canonical}?from=${from}&to=${to}` }),
    [mapping, lang, fetchedOn, canonical, from, to],
  );

  const drawn = fromScheme.points.filter((p) => LAYOUT_XY[p.key]);
  const undrawn = fromScheme.points.filter((p) => !LAYOUT_XY[p.key]);
  // Every position some scheme uses, faint, so the empty spots of a small
  // scheme are visible. Deduplicated by coordinate; never clickable.
  const ghostSpots = useMemo(() => {
    const seen = new Set<string>();
    const keys = new Set(schemes.flatMap((s) => s.points.map((p) => p.key)));
    const out: [number, number][] = [];
    for (const [k, xy] of Object.entries(LAYOUT_XY)) {
      if (!keys.has(k)) continue;
      const id = xy.join(",");
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(xy);
    }
    return out;
  }, [schemes]);

  const copy = async (text: string, what: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
    } catch {
      setCopied("failed");
    }
    setTimeout(() => setCopied(""), 2000);
  };

  const selectCls =
    "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] focus:border-brand-400 focus:outline-none";
  const btnCls =
    "rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--fg)] transition-colors hover:border-brand-400";
  const sel = across?.point;
  const selXY = sel ? LAYOUT_XY[sel.key] : undefined;

  return (
    <div className="mt-8" data-keypoint-playground>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <label className="block text-sm font-semibold text-[var(--fg)]">
          Scheme on the body
          <select value={from} onChange={(e) => pickFrom(e.target.value)} className={selectCls} data-kp-from>
            {schemes.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.shortName} ({s.points.length})
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={swap} className={`${btnCls} h-10`} aria-label="Swap the two schemes">
          ⇄ Swap
        </button>
        <label className="block text-sm font-semibold text-[var(--fg)]">
          Map it to
          <select value={to} onChange={(e) => pickTo(e.target.value)} className={selectCls} data-kp-to>
            {schemes.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.shortName} ({s.points.length})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <figure className="mx-auto w-full max-w-[22rem]">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full"
            role="group"
            aria-label={`${fromScheme.shortName} points drawn on a figure (positions are illustrative)`}
            data-kp-svg
          >
            <g aria-hidden="true" fill="none" stroke="var(--border)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round">
              <ellipse {...FIGURE.head} strokeWidth={4} />
              <path d={FIGURE.torso} strokeWidth={4} />
              {FIGURE.limbs.map((d) => (
                <path key={d} d={d} strokeWidth={14} opacity={0.6} />
              ))}
              {FIGURE.feet.map((d) => (
                <path key={d} d={d} strokeWidth={4} />
              ))}
              {FIGURE.hands.map((h) => (
                <circle key={h.cx} {...h} strokeWidth={4} />
              ))}
            </g>
            <g aria-hidden="true">
              {ghostSpots.map(([x, y]) => (
                <circle key={`${x},${y}`} cx={x} cy={y} r={3} fill="var(--muted)" opacity={0.35} />
              ))}
            </g>
            {drawn.map((p) => {
              const [x, y] = LAYOUT_XY[p.key];
              const on = p.key === joint;
              const right = x >= VIEW_W / 2;
              return (
                <g
                  key={p.key}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={label(p)}
                  data-kp-joint={p.key}
                  onClick={() => setJoint(p.key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setJoint(p.key);
                    }
                  }}
                  className="cursor-pointer focus:outline-none [&:focus-visible>circle.ring]:stroke-brand-400"
                >
                  <title>{label(p)}</title>
                  <circle cx={x} cy={y} r={13} fill="transparent" />
                  <circle
                    className="ring"
                    cx={x}
                    cy={y}
                    r={on ? 9 : 6}
                    fill={on ? "var(--color-brand-500)" : "var(--color-brand-600)"}
                    stroke={on ? "var(--fg)" : "var(--bg)"}
                    strokeWidth={on ? 3 : 1.5}
                  />
                  {p.index !== null && (
                    <text
                      x={right ? x + 10 : x - 10}
                      y={y - 6}
                      textAnchor={right ? "start" : "end"}
                      fontSize={on ? 15 : 11}
                      fontWeight={on ? 700 : 500}
                      fill="var(--fg)"
                      style={{ pointerEvents: "none" }}
                    >
                      {p.index}
                    </text>
                  )}
                </g>
              );
            })}
            {sel && selXY && (
              <text
                x={Math.min(Math.max(selXY[0], 70), VIEW_W - 70)}
                y={selXY[1] + 26}
                textAnchor="middle"
                fontSize={14}
                fontWeight={700}
                fill="var(--fg)"
                stroke="var(--bg)"
                strokeWidth={4}
                paintOrder="stroke"
                style={{ pointerEvents: "none" }}
              >
                {sel.name}
              </text>
            )}
          </svg>
          <figcaption className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
            The figure and every dot position are a drawing, not data: they place each point by the words
            in its name so you can click it. No model output or measurement is shown, and two points drawn
            in one spot are not thereby the same point. No lines join the dots because the dataset records
            names and indices, not skeleton connections. Faint dots are positions other schemes use.
          </figcaption>
        </figure>

        <div className="min-w-0">
          <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]" data-kp-selected>
            {sel ? (
              <>
                {fromScheme.shortName}: <span className="font-mono">{label(sel)}</span>
              </>
            ) : (
              "Pick a point"
            )}
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">The same name in every scheme the dataset holds.</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm" data-kp-across>
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="py-2 pr-3 font-semibold text-[var(--fg)]">Scheme</th>
                  <th className="py-2 pr-3 font-semibold text-[var(--fg)]">Index</th>
                  <th className="py-2 font-semibold text-[var(--fg)]">Name</th>
                </tr>
              </thead>
              <tbody>
                {across?.cells.map((c) => {
                  const s = schemes.find((x) => x.slug === c.scheme)!;
                  const here = c.scheme === from;
                  return (
                    <tr
                      key={c.scheme}
                      className={`border-b border-[var(--border)] align-top ${here ? "bg-[var(--surface)]" : ""}`}
                      data-kp-cell={c.scheme}
                    >
                      <td className="py-2 pr-3">
                        <a href={schemeHref[c.scheme]} className="font-medium text-brand-600 hover:text-brand-500">
                          {s.shortName}
                        </a>
                      </td>
                      {c.point ? (
                        <>
                          <td className="py-2 pr-3 font-mono text-[var(--fg)]">{c.point.index ?? "no index"}</td>
                          <td className="break-all py-2 font-mono text-xs text-[var(--fg)]">{c.point.name}</td>
                        </>
                      ) : (
                        <td colSpan={2} className="py-2 text-xs text-[var(--muted)]">
                          not in this scheme
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
            {across && !across.row
              ? "No other scheme here spells this name the same way, so nothing is matched to it. "
              : ""}
            “Not in this scheme” means no point with this name: {rule} It is a statement about names,
            not anatomy. Apple Vision joints are named constants with no numeric index.
          </p>

          <h4 className="mt-6 text-sm font-semibold text-[var(--fg)]">
            All {fromScheme.points.length} points of {fromScheme.shortName}
          </h4>
          <ul className="mt-2 flex flex-wrap gap-1.5" data-kp-chips>
            {fromScheme.points.map((p) => (
              <li key={p.key}>
                <button
                  type="button"
                  onClick={() => setJoint(p.key)}
                  aria-pressed={p.key === joint}
                  className={`rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors ${
                    p.key === joint
                      ? "border-brand-500 bg-brand-600 text-white"
                      : "border-[var(--border)] text-[var(--fg)] hover:border-brand-400"
                  }`}
                >
                  {label(p)}
                </button>
              </li>
            ))}
          </ul>
          {undrawn.length > 0 && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              {undrawn.length} of these have no drawn position: their names (such as {undrawn[0].name}) do not say
              where on the body they sit, so they are listed here only.
            </p>
          )}
        </div>
      </div>

      <section className="mt-12" aria-label="Index mapping snippet" data-kp-mapping>
        <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">
          {fromScheme.shortName} → {toScheme.shortName} as code
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {mapping
            ? mapping.pairs.length === 0
              ? `The dataset has no name equivalence between ${fromScheme.shortName} and ${toScheme.shortName}, so the snippet maps nothing.`
              : `${mapping.pairs.length} of ${fromScheme.points.length} ${fromScheme.shortName} points have a name match in ${toScheme.shortName}; the other ${mapping.unmappedFrom.length} are listed in a comment, not mapped.`
            : ""}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Language">
          {(["ts", "py"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`${btnCls} ${lang === l ? "border-brand-500 bg-brand-600 text-white hover:border-brand-500" : ""}`}
            >
              {l === "ts" ? "TypeScript" : "Python"}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-[var(--border)]" aria-hidden="true" />
          <button type="button" onClick={() => copy(code, "code")} className={btnCls}>
            {copied === "code" ? "Copied" : "Copy snippet"}
          </button>
          <button type="button" onClick={() => copy(shareUrl, "link")} className={btnCls}>
            {copied === "link" ? "Link copied" : "Copy link to this view"}
          </button>
          {copied === "failed" && <span className="text-xs text-[var(--muted)]">Copy failed — select the text by hand.</span>}
        </div>
        <pre
          className="mt-3 max-h-[28rem] overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs leading-relaxed text-[var(--fg)]"
          data-kp-code
        >
          <code>{code}</code>
        </pre>
      </section>
    </div>
  );
}
