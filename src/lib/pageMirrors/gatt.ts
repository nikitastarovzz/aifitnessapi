import { sigFileUrl } from "@/data/btPages";
import { gattChildrenText, gattFieldCount, gattLayoutHref, gattPresenceText } from "@/lib/bleLabFacts";
import { fmt, type GattLayout } from "@/lib/gattDecode.mjs";
import { link, table } from "./core";

/**
 * A compiled GATT layout as markdown: the same rows, cells and links
 * src/components/tools/GattLayoutTable.tsx renders on the BLE tool pages,
 * through the same text helpers (src/lib/bleLabFacts.ts).
 */
export function gattLayoutSection(layout: GattLayout): string[] {
  const out = [`### ${layout.name} (${layout.uuid}) · ${gattFieldCount(layout)}`, ""];
  if (layout.fields.length) {
    out.push(
      ...table(
        ["Field", "Type", "Size", "Present when", "Unit and resolution"],
        layout.fields.map((f) => {
          const children = gattChildrenText(f);
          const unit =
            f.kind === "unsupported"
              ? `not decoded: ${f.reason}`
              : `${f.unit?.label ? `\`${f.unit.label}\`` : f.bits ? "flags" : "—"}${
                  f.scale ? `, × ${fmt(f.scale.factor)} (“${f.scale.evidence}”)${f.scale.conflict ? ` — the same field also says “${f.scale.unitIs}”` : ""}` : ""
                }`;
          return [children ? `${f.name}: ${children}` : f.name, `\`${f.type}\``, f.size, gattPresenceText(f), unit];
        }),
      ),
    );
  } else {
    out.push(`${layout.unsupported} The lab shows its bytes as hex.`, "");
  }
  out.push(
    `${link(`${layout.name} on the Bluetooth GATT reference`, gattLayoutHref(layout))}${
      layout.file ? ` · the SIG’s file ${link(`\`${layout.file}\``, sigFileUrl(layout.file))}` : ""
    }`,
    "",
  );
  return out;
}
