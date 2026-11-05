"use client";

import { useState } from "react";
import { decode, fmt, toHex, type GattDecoded, type GattLayout, type GattUnit } from "@/lib/gattDecode.mjs";

/**
 * One characteristic value, decoded against a layout compiled from the
 * Bluetooth SIG's gss structure: the octets colored by the field they belong
 * to, every field with the condition that made it present or absent, each
 * flags bit with the SIG's own description, and the scale with the line it
 * was read from. Shared by the FTMS lab, the cycling power lab and the GATT
 * explorer.
 */

const PALETTE = [
  "bg-sky-500/15 border-sky-500/60",
  "bg-amber-500/15 border-amber-500/60",
  "bg-emerald-500/15 border-emerald-500/60",
  "bg-rose-500/15 border-rose-500/60",
  "bg-violet-500/15 border-violet-500/60",
  "bg-teal-500/15 border-teal-500/60",
  "bg-orange-500/15 border-orange-500/60",
  "bg-fuchsia-500/15 border-fuchsia-500/60",
];
const FLAGS = "bg-slate-500/15 border-slate-500/60";
const LOOSE = "bg-red-500/10 border-red-500 border-dashed";

function styleFor(layout: GattLayout, field: number) {
  if (field < 0) return LOOSE;
  if (layout.fields[field]?.kind === "bits") return FLAGS;
  return PALETTE[field % PALETTE.length];
}

/**
 * A number and its unit. The unit is the Bluetooth SIG's units.yaml name for
 * the field's unit id, printed as an identifier (code) because it is the SIG's
 * term, quoted as the SIG spells it, not this site's prose.
 */
export function ValueWithUnit({
  value,
  unit,
  fallback,
}: {
  value: number | number[] | string | null;
  unit: GattUnit | null;
  fallback: string | null;
}) {
  const nums = typeof value === "number" ? [value] : Array.isArray(value) ? value : null;
  if (!nums) return <strong>{fallback ?? "—"}</strong>;
  return (
    <>
      <strong>{nums.map((n) => fmt(n)).join(", ")}</strong>
      {unit?.label ? (
        <>
          {" "}
          <code className="font-mono text-xs text-[var(--muted)]">{unit.label}</code>
        </>
      ) : null}
    </>
  );
}

function conditionText(f: GattDecoded["fields"][number]) {
  if (!f.presence) return "always";
  return `bit ${f.presence.bit} of ${f.presence.field} is ${f.presence.value}`;
}

export default function GattValueView({
  layout,
  bytes,
  decoded,
  compact = false,
}: {
  layout: GattLayout;
  bytes: Uint8Array;
  decoded?: GattDecoded;
  compact?: boolean;
}) {
  const d = decoded ?? decode(bytes, layout);
  const [hover, setHover] = useState<number | null>(null);
  const spanAt = (i: number) => d.spans.find((s) => i >= s.start && i < s.end) ?? null;
  const hasRaw = !layout.fields.length;

  return (
    <div className="space-y-4" data-gatt-decoded={layout.uuid}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {layout.name} ({layout.uuid}) · {bytes.length} octet{bytes.length === 1 ? "" : "s"} · little-endian
        </p>
        <div className="mt-2 flex flex-wrap gap-1 font-mono text-sm" aria-label="Octets, colored by field">
          {Array.from(bytes, (b, i) => {
            const s = spanAt(i);
            const field = s ? s.field : -1;
            return (
              <span
                key={i}
                title={`offset ${i}: ${s?.label ?? "not decoded"}`}
                onMouseEnter={() => setHover(field)}
                onMouseLeave={() => setHover(null)}
                className={`rounded border px-1.5 py-0.5 ${styleFor(layout, field)} ${hover === field && field >= 0 ? "ring-2 ring-brand-500" : ""}`}
              >
                {b.toString(16).toUpperCase().padStart(2, "0")}
              </span>
            );
          })}
          {bytes.length === 0 ? <span className="text-[var(--muted)]">(empty)</span> : null}
        </div>
      </div>

      {hasRaw ? (
        <p className="text-sm text-[var(--muted)]">
          Raw only: {layout.unsupported} Hex <code className="font-mono">{toHex(bytes) || "—"}</code>.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-[var(--muted)]">
              <tr>
                <th className="py-1.5 pr-3">Field</th>
                <th className="py-1.5 pr-3">Present when</th>
                <th className="py-1.5 pr-3">Octets</th>
                <th className="py-1.5 pr-3">Raw</th>
                <th className="py-1.5">Value</th>
              </tr>
            </thead>
            <tbody>
              {d.fields.map((f, i) => {
                if (compact && f.status === "absent") return null;
                const lf = layout.fields[i];
                return (
                  <tr
                    key={f.name}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    className={`border-t border-[var(--border)] align-top ${f.status === "present" ? "" : "opacity-55"} ${hover === i ? "bg-brand-500/5" : ""}`}
                  >
                    <td className="py-1.5 pr-3 text-[var(--fg)]">
                      <span className={`mr-1.5 inline-block h-2.5 w-2.5 rounded-sm border ${styleFor(layout, i)}`} aria-hidden />
                      {f.name}
                      <span className="block font-mono text-xs text-[var(--muted)]">{f.type}</span>
                    </td>
                    <td className="py-1.5 pr-3 text-xs text-[var(--muted)]">
                      {conditionText(f)}
                      <span className="block">
                        {f.status === "present" ? "present" : f.status === "absent" ? "absent" : "not decoded"}
                      </span>
                    </td>
                    <td className="py-1.5 pr-3 font-mono text-xs text-[var(--muted)]">
                      {f.offset != null && f.length ? `${f.offset}–${f.offset + f.length - 1}` : "—"}
                    </td>
                    <td className="py-1.5 pr-3 font-mono text-xs">
                      {f.status !== "present" ? "—" : Array.isArray(f.raw) ? f.raw.join(", ") : f.children ? f.children.map((c) => c.raw).join(" / ") : String(f.raw)}
                    </td>
                    <td className="py-1.5 text-[var(--fg)]">
                      {f.status === "present" ? (
                        <>
                          {f.children ? (
                            <ul className="space-y-0.5">
                              {f.children.map((c) => (
                                <li key={c.name}>
                                  {c.name}: <ValueWithUnit value={c.value} unit={c.unit} fallback={c.display} />
                                  {c.scale ? <span className="text-xs text-[var(--muted)]"> (raw {c.raw} × {fmt(c.scale.factor)})</span> : null}
                                </li>
                              ))}
                            </ul>
                          ) : f.bits ? (
                            <span className="font-mono">{f.display}</span>
                          ) : (
                            <ValueWithUnit value={f.valueLabel ? null : f.value} unit={f.unit} fallback={f.display} />
                          )}
                          {f.scale && !f.children ? (
                            <span className="block text-xs text-[var(--muted)]">
                              × {fmt(f.scale.factor)} from <q>{f.scale.evidence}</q>
                              {f.scale.unitIs ? <> beside <q>{f.scale.unitIs}</q></> : null}
                              {f.scale.conflict ? (
                                <strong className="block text-amber-600">
                                  The SIG&rsquo;s two lines disagree: read with the second, the value is{" "}
                                  {fmt((f.raw as number) * (f.scale.unitIsFactor ?? 1))}.
                                </strong>
                              ) : null}
                            </span>
                          ) : null}
                          {lf?.structNote ? <span className="block text-xs text-[var(--muted)]">{lf.structNote}</span> : null}
                          {lf?.prose ? <span className="block text-xs text-[var(--muted)]">The SIG: <q>{lf.prose}</q></span> : null}
                        </>
                      ) : f.note ? (
                        <span className="text-xs text-[var(--muted)]">{f.note}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {d.fields
        .filter((f) => f.bits && f.status === "present")
        .map((f) => (
          <details key={`bits-${f.name}`} open={!compact} className="rounded-lg border border-[var(--border)] p-3">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">
              {f.name} bit by bit <span className="font-mono font-normal text-[var(--muted)]">{f.display}</span>
            </summary>
            <table className="mt-2 w-full text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr>
                  <th className="py-1 pr-3">Bit</th>
                  <th className="py-1 pr-3">Value</th>
                  <th className="py-1">The SIG&rsquo;s description</th>
                </tr>
              </thead>
              <tbody>
                {f.bits!.map((b) => (
                  <tr key={b.label} className={`border-t border-[var(--border)] align-top ${b.set ? "" : "text-[var(--muted)]"}`}>
                    <td className="py-1 pr-3 font-mono">{b.label}</td>
                    <td className={`py-1 pr-3 font-mono ${b.set && b.reserved ? "text-red-600" : b.set ? "font-bold text-[var(--fg)]" : ""}`}>
                      {b.values.length > 1 ? `${b.values.slice().reverse().join("")}b` : b.value}
                    </td>
                    <td className="whitespace-pre-line py-1">{b.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        ))}

      {d.errors.length || d.stopped ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-amber-700 dark:text-amber-400">
          {d.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
          {d.stopped && !hasRaw ? <li>Decoding stopped: {d.stopped}. The remaining octets are shown raw.</li> : null}
        </ul>
      ) : null}
    </div>
  );
}
