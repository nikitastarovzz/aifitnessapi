import Link from "next/link";
import { fmt, type GattLayout } from "@/lib/gattDecode.mjs";
import { sigFileUrl } from "@/data/btPages";

/**
 * A compiled layout as a server-rendered table: what the decoder will read,
 * field by field, with the condition and the scale line each comes from. The
 * `data-gatt-layout` / `data-gatt-fields` markers let qa (BLE-LAB-LAYOUT)
 * hold each tool page to the structure in src/data/bluetoothGatt.ts.
 */
export default function GattLayoutTable({ layout, open = false }: { layout: GattLayout; open?: boolean }) {
  const linkCls = "font-medium text-brand-600 hover:text-brand-500";
  const href = layout.hasPage ? `/bluetooth-fitness/${layout.slug}` : `/bluetooth-fitness#char-${layout.slug}`;
  return (
    <details
      open={open}
      className="rounded-xl border border-[var(--border)] p-4"
      data-gatt-layout={layout.uuid}
      data-gatt-fields={layout.fields.length}
    >
      <summary className="cursor-pointer font-semibold text-[var(--fg)]">
        {layout.name} ({layout.uuid}){" "}
        <span className="font-normal text-[var(--muted)]">
          · {layout.fields.length ? `${layout.fields.length} fields` : "no structure: shown raw"}
        </span>
      </summary>
      {layout.fields.length ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-[var(--muted)]">
              <tr>
                <th className="py-1.5 pr-3">Field</th>
                <th className="py-1.5 pr-3">Type</th>
                <th className="py-1.5 pr-3">Size</th>
                <th className="py-1.5 pr-3">Present when</th>
                <th className="py-1.5">Unit and resolution</th>
              </tr>
            </thead>
            <tbody className="text-[var(--muted)]">
              {layout.fields.map((f) => (
                <tr key={f.name} className="border-t border-[var(--border)] align-top">
                  <td className="py-1.5 pr-3 text-[var(--fg)]">
                    {f.name}
                    {f.children ? (
                      <span className="block text-xs text-[var(--muted)]">
                        {f.children.map((c) => `${c.name} (${c.type}${c.scale ? `, × ${fmt(c.scale.factor)}` : ""})`).join("; ")}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-1.5 pr-3 font-mono text-xs">{f.type}</td>
                  <td className="py-1.5 pr-3">{f.size}</td>
                  <td className="py-1.5 pr-3 text-xs">
                    {f.presence ? `bit ${f.presence.bit} of ${f.presence.field} is ${f.presence.value}` : f.sizeKind === "fixed" ? "always" : (f.presenceText ?? "—")}
                  </td>
                  <td className="py-1.5 text-xs">
                    {f.kind === "unsupported" ? (
                      <>not decoded: {f.reason}</>
                    ) : (
                      <>
                        {f.unit?.label ? <code className="font-mono">{f.unit.label}</code> : f.bits ? "flags" : "—"}
                        {f.scale ? (
                          <>
                            , × {fmt(f.scale.factor)} (<q>{f.scale.evidence}</q>)
                            {f.scale.conflict ? <> — the same field also says <q>{f.scale.unitIs}</q></> : null}
                          </>
                        ) : null}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-3 text-sm text-[var(--muted)]">{layout.unsupported} The lab shows its bytes as hex.</p>
      )}
      <p className="mt-3 text-xs text-[var(--muted)]">
        <Link href={href} className={linkCls}>
          {layout.name} on the Bluetooth GATT reference
        </Link>
        {layout.file ? (
          <>
            {" "}
            · the SIG&rsquo;s file{" "}
            <a href={sigFileUrl(layout.file)} className={linkCls} rel="noopener">
              <code className="font-mono">{layout.file}</code>
            </a>
          </>
        ) : null}
      </p>
    </details>
  );
}
