import Link from "next/link";
import type { BtCharacteristic, BtDefinition, BtField } from "@/data/bluetoothGatt";
import { bitsOf, controlledBy, offsetText, presenceText, segments, structOf } from "@/data/btPages";

/**
 * Rendering for the Bluetooth GATT reference: the SIG's text with its
 * cross-references resolved, the byte-layout table, and the `fields`
 * definitions as generic tables. Every value shown is the generated data as
 * read; the only computed columns are the offset, "present when" (from the
 * parsed "Present if" line, which the field's text also shows) and, on a flags
 * table, the fields each bit's parsed condition names.
 *
 * Not a route: Next only treats page/layout/route/opengraph-image files as
 * route segments.
 */

export const LINK = "font-medium text-brand-600 hover:text-brand-500";
export const TH = "py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]";

export function Code({ children }: { children: string }) {
  return <code className="font-mono text-[13px] text-[var(--fg)] [overflow-wrap:anywhere]">{children}</code>;
}

/** The SIG's text, line by line, with \autoref and friends rendered. */
export function GssText({
  text,
  self,
  idPrefix = "",
  className = "",
}: {
  text: string;
  self: BtCharacteristic | null;
  idPrefix?: string;
  className?: string;
}) {
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block">
          {segments(line, self, idPrefix).map((s, j) =>
            s.t === "text" ? (
              <span key={j}>{s.v}</span>
            ) : s.href ? (
              <Link key={j} href={s.href} className={LINK}>
                {s.label}
              </Link>
            ) : s.code ? (
              <code key={j} className="font-mono text-[12px] text-[var(--muted)]" title="A reference the SIG's YAML files do not resolve">
                {s.label}
              </code>
            ) : (
              <span key={j}>{s.label}</span>
            ),
          )}
        </span>
      ))}
    </span>
  );
}

function Units({ f }: { f: BtField }) {
  if (!f.units.length) return <span className="text-[var(--muted)]">—</span>;
  return (
    <span className="flex flex-col gap-1">
      {f.units.map((u) => (
        <span key={u.id}>
          {u.name ? <span className="text-[var(--fg)]">{u.name}</span> : <span className="text-amber-700 dark:text-amber-400">not an id in units.yaml</span>}
          <span className="block break-all font-mono text-[11px] text-[var(--muted)]">{u.id}</span>
        </span>
      ))}
    </span>
  );
}

function Present({ f, flagsAnchor }: { f: BtField; flagsAnchor: string | null }) {
  const text = presenceText(f);
  if (f.presence && flagsAnchor) {
    return (
      <a href={`#${flagsAnchor}`} className={LINK}>
        {text}
      </a>
    );
  }
  return <span>{text}</span>;
}

/** The anchor of the bits definition a field's parsed condition names, on this page. */
function flagsAnchorFor(c: BtCharacteristic, f: BtField): string | null {
  if (!f.presence) return null;
  const want = f.presence.field.toLowerCase();
  const walk = (defs: BtDefinition[]): string | null => {
    for (const d of defs) {
      if (d.kind === "bits" && d.name.toLowerCase() === want) return d.anchor;
      const sub = walk(d.subfields);
      if (sub) return sub;
    }
    return null;
  };
  return walk(c.gss?.definitions ?? []);
}

/**
 * The byte layout: one row per structure field, in the SIG's order, with a
 * struct's own rows nested under it (offsets relative to the struct).
 */
export function LayoutTable({ c }: { c: BtCharacteristic }) {
  const fields = c.gss!.structure;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[44rem] border-collapse text-sm" data-bt-layout={c.id}>
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th scope="col" className={TH}>Offset</th>
            <th scope="col" className={TH}>Field</th>
            <th scope="col" className={TH}>Type</th>
            <th scope="col" className={TH}>Size</th>
            <th scope="col" className={TH}>Present when</th>
            <th scope="col" className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Unit</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => {
            const struct = structOf(c, f);
            const inBits = struct?.sizeInBits ?? false;
            return [
              <tr key={f.anchor} id={f.anchor} data-bt-field={f.name} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                <td className="py-2 pr-4 font-mono text-xs tabular-nums text-[var(--fg)]">
                  {f.offset !== null ? f.offset : <span className="font-sans text-[var(--muted)]">{offsetText(fields, f)}</span>}
                </td>
                <td className="py-2 pr-4 font-semibold text-[var(--fg)]">
                  <a href={`#note-${f.anchor}`} className="hover:text-brand-600">
                    {f.name}
                  </a>
                </td>
                <td className="py-2 pr-4">
                  <Code>{f.type}</Code>
                </td>
                <td className="py-2 pr-4 font-mono text-xs text-[var(--fg)]">{f.size}</td>
                <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                  <Present f={f} flagsAnchor={flagsAnchorFor(c, f)} />
                </td>
                <td className="py-2 text-xs">
                  <Units f={f} />
                </td>
              </tr>,
              ...(struct?.layout ?? []).map((s) => (
                <tr key={`${f.anchor}/${s.anchor}`} className="border-b border-[var(--border)] align-top text-[var(--muted)]">
                  <td className="py-1.5 pr-4 pl-3 font-mono text-[11px] tabular-nums">
                    {s.offset !== null ? `+${s.offset}${inBits ? " bits" : ""}` : "varies"}
                  </td>
                  <td className="py-1.5 pr-4 pl-4 text-xs">
                    <a href={`#${s.anchor}`} className="hover:text-brand-600">
                      ↳ {s.name}
                    </a>
                  </td>
                  <td className="py-1.5 pr-4">
                    <code className="font-mono text-[11px]">{s.type}</code>
                  </td>
                  <td className="py-1.5 pr-4 font-mono text-[11px]">
                    {s.size}
                    {inBits ? " bits" : ""}
                  </td>
                  <td className="py-1.5 pr-4 text-[11px]">
                    <Present f={s} flagsAnchor={flagsAnchorFor(c, s)} />
                  </td>
                  <td className="py-1.5 text-[11px]">
                    <Units f={s} />
                  </td>
                </tr>
              )),
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Each structure field's text, verbatim, under the table. */
export function FieldNotes({ c }: { c: BtCharacteristic }) {
  return (
    <dl className="mt-6 space-y-4">
      {c.gss!.structure.map((f) => (
        <div key={f.anchor} id={`note-${f.anchor}`} className="scroll-mt-24 rounded-xl border border-[var(--border)] p-4">
          <dt className="font-semibold text-[var(--fg)]">
            {f.name}{" "}
            <span className="font-mono text-xs font-normal text-[var(--muted)]">
              {f.type} · {f.size}
            </span>
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {f.description ? <GssText text={f.description} self={c} /> : <em>No text in the SIG’s file.</em>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const HEADERS: Record<string, string> = {
  bit: "Bit",
  value: "Value",
  description: "Description",
  field: "Field",
  data_type: "Data type",
  size: "Size",
  op_code_value: "Op code",
  definition: "Definition",
  operand: "Operand",
  operand_data_type: "Operand data type",
  response_code_value: "Response code",
  parameter: "Parameter",
  parameter_type: "Parameter type",
  response_parameter: "Response parameter",
  name: "Name",
  operator: "Operator",
};
const headerOf = (d: BtDefinition, k: string) =>
  (k === "value" && d.valueHeader) || (k === "description" && d.descriptionHeader) || HEADERS[k] || k.replace(/_/g, " ");

/** One `fields` entry: its text, its rows as a table, and its subfields. */
export function Definition({
  c,
  def,
  depth = 0,
  idPrefix = "",
  compact = false,
}: {
  c: BtCharacteristic;
  def: BtDefinition;
  depth?: number;
  /** Prepended to every id (the hub renders several characteristics on one page). */
  idPrefix?: string;
  compact?: boolean;
}) {
  const bits = def.kind === "bits";
  const H = depth === 0 && !compact ? "h3" : "h4";
  return (
    <div id={`${idPrefix}${def.anchor}`} data-bt-definition={def.name} className={`${compact ? "mt-4" : "mt-8"} scroll-mt-24`}>
      <H className={`${compact ? "text-sm" : "text-lg"} font-bold tracking-tight text-[var(--fg)]`}>
        {def.sectionTitle ?? def.name}
        {def.sizeInBits ? <span className="ml-2 text-xs font-normal text-[var(--muted)]">(sizes in bits, as the file marks)</span> : null}
      </H>
      {def.description && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          <GssText text={def.description} self={c} idPrefix={idPrefix} />
        </p>
      )}
      {def.rows.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            {def.tableCaption && <caption className="mb-2 text-left text-xs text-[var(--muted)]">{def.tableCaption}</caption>}
            <thead>
              <tr className="border-b border-[var(--border)]">
                {def.columns.map((k) => (
                  <th key={k} scope="col" className={TH}>
                    {headerOf(def, k)}
                  </th>
                ))}
                {bits && (
                  <th scope="col" className={TH}>
                    Fields its condition names
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {def.rows.map((r, i) => {
                const layoutRow = def.layout?.[i] ?? null;
                const ctl = bits ? controlledBy(c, def, bitsOf(r.bit ?? "") ?? []) : [];
                return (
                  <tr key={i} id={layoutRow ? `${idPrefix}${layoutRow.anchor}` : undefined} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                    {def.columns.map((k) => (
                      <td key={k} className={`py-2 pr-4 ${k === "description" || k === "definition" ? "text-[var(--muted)]" : "font-mono text-xs text-[var(--fg)]"}`}>
                        {r[k] === undefined ? "" : <GssText text={r[k]} self={c} idPrefix={idPrefix} />}
                      </td>
                    ))}
                    {bits && (
                      <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                        {ctl.length
                          ? ctl.map((f) => (
                              <span key={f.anchor} className="block">
                                <a href={`#${idPrefix}${f.anchor}`} className={LINK}>
                                  {f.name}
                                </a>{" "}
                                when {f.presence!.value}
                              </span>
                            ))
                          : "—"}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {def.subfields.map((s) => (
        <Definition key={s.anchor} c={c} def={s} depth={depth + 1} idPrefix={idPrefix} compact={compact} />
      ))}
    </div>
  );
}
