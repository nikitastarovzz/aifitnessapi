import { BT_GATT_SOURCE } from "@/data/bluetoothGatt";
import { BT_COMMIT_SHORT, BT_FETCHED } from "@/data/btPages";
import { EXPLORER_LAYOUTS_PATH, explorerServices } from "@/lib/bleTools";
import { explorerDecodeGroups, gattLayoutHref } from "@/lib/bleLabFacts";
import { BLE_BROWSER_SUPPORT, WEB_BLUETOOTH_SERVICES_RULE } from "@/lib/bleBrowserSupport";
import { BYTE_ORDER_SOURCE } from "@/lib/gattDecode.mjs";
import { site } from "@/lib/site";
import { interactiveNote, link, type MirrorDoc } from "./core";

const PATH = "/tools/ble-gatt-explorer";
const UPDATED = "2026-11-05";

/** /tools/ble-gatt-explorer.md — mirrors src/app/tools/ble-gatt-explorer/page.tsx.
 *  The service list and the three decode groups come from the same compiled
 *  layouts the page renders (src/lib/bleLabFacts.ts). */
export function bleGattExplorerMirror(): MirrorDoc {
  const SERVICES = explorerServices();
  const { full: FULL, partial: PARTIAL, noStructure: NO_STRUCTURE, fullHref } = explorerDecodeGroups();

  return {
    path: PATH,
    title: "BLE GATT explorer: see what any Bluetooth device exposes",
    description:
      "Connect any Bluetooth LE device in the browser, list its services and characteristics by SIG name, read or subscribe, and decode values the SIG defines.",
    updated: UPDATED,
    type: "tool",
    capsule: `A web page can use a Bluetooth LE device’s services only if it named them before connecting. The Web Bluetooth specification puts it plainly: “${WEB_BLUETOOTH_SERVICES_RULE.quote}” This explorer asks for all ${SERVICES.length} services in this site’s Bluetooth dataset (plus any UUID you add), connects to any device you pick, lists its characteristics by their Bluetooth SIG names, and reads or subscribes on request. ${FULL.length} characteristics decode field by field against the SIG’s published structures, ${PARTIAL.length} more up to the first field the structures cannot describe, and everything else shows as raw hex.`,
    body: [
      interactiveNote(PATH, "the Web Bluetooth connection, service list, reads, notifications and paste box"),
      "",
      "## The services it asks for",
      "",
      `Every service in this site’s Bluetooth dataset (from the SIG’s assigned numbers at commit ${BT_COMMIT_SHORT}, read ${BT_FETCHED}) and Battery, read from the SIG’s file for the ${link("heart-rate lab", "/tools/heart-rate-lab")}. A service outside this list (a vendor’s own 128-bit service, or another SIG service) is invisible to the page unless you type its UUID in the box before connecting. The rule quoted above is from the ${link("Web Bluetooth specification, Device Discovery", WEB_BLUETOOTH_SERVICES_RULE.url)}, read ${WEB_BLUETOOTH_SERVICES_RULE.readOn}.`,
      "",
      ...SERVICES.map((s) => `- \`${s.uuid}\` ${s.name}`),
      "",
      "## What it can decode",
      "",
      `The decoder compiles each characteristic’s structure from the SIG’s GATT Specification Supplement file: field order and sizes, the Flags bit each optional field depends on, struct members, value tables, units, and the “Represented values” line that sets each field’s resolution. It reads multi-octet fields little-endian, as the ${link("Web Bluetooth specification’s heart-rate example", BYTE_ORDER_SOURCE.url)} does (\`${BYTE_ORDER_SOURCE.quote}\`). It stops, and shows the rest as hex, at a \`medfloat16\` or \`medfloat32\` field (their encoding is not in the SIG’s YAML files), at a condition that is not a Flags bit, and at a field whose length the value does not state.`,
      "",
      `### Decoded field by field (${FULL.length})`,
      "",
      ...FULL.map((l) => `- ${link(l.name, fullHref(l))} \`${l.uuid}\``),
      "",
      `### Decoded up to a field it cannot read (${PARTIAL.length})`,
      "",
      ...PARTIAL.map((l) => `- ${link(l.name, gattLayoutHref(l))} \`${l.uuid}\`: ${l.unsupported}`),
      "",
      `### Named, but hex only (${NO_STRUCTURE.length})`,
      "",
      `The SIG’s repository has no gss structure for these at this commit: ${NO_STRUCTURE.map((c) => `${c.name} (${c.uuid})`).join(", ")}.`,
      "",
      "## Which browsers can connect",
      "",
      BLE_BROWSER_SUPPORT.sentence,
      "",
      `Source: ${link("MDN browser-compat-data, api/Bluetooth.json", BLE_BROWSER_SUPPORT.url)}, read ${BLE_BROWSER_SUPPORT.readOn}. The paste box works in any browser.`,
      "",
      "## What the explorer cannot tell you",
      "",
      "- What a vendor’s own characteristics mean. Their bytes show as hex; nothing on this site documents a private protocol.",
      "- Whether a device is standard-conforming. A characteristic that decodes cleanly matches the SIG’s layout; it does not prove the values are right.",
      "- Anything the browser withholds. A service the page did not name, or one the browser refuses to expose, does not appear in the list.",
      "",
      `For the common fitness devices there are focused labs: the ${link("heart-rate lab", "/tools/heart-rate-lab")}, the ${link("FTMS lab", "/tools/ftms-lab")} for treadmills, bikes and rowers, and the ${link("cycling power and cadence lab", "/tools/cycling-power-lab")}. Every characteristic is documented in the ${link("Bluetooth GATT reference", "/bluetooth-fitness")}; building against them is covered in ${link("Web Bluetooth for fitness apps", "/devices/web-bluetooth-fitness")} and ${link("testing BLE fitness devices", "/devices/testing-ble-fitness-devices")}.`,
      "",
      "## How this works, and what it sends",
      "",
      `Nothing leaves your device. The browser’s chooser lists nearby devices; the page can reach only the one you pick and only the services it named. It reads a characteristic or turns on its notifications only when you press the button, and it never writes a value. The decoders load from ${link("a static JSON file", EXPLORER_LAYOUTS_PATH)} built with the site; no device data is sent anywhere, and nothing is stored.`,
      "",
      "The value in the paste box when the page loads is synthetic: an RSC Measurement built by the decoder’s own encoder from the SIG’s field names, not recorded from a device.",
      "",
      `The names and structures come from the Bluetooth SIG’s public repository (${BT_GATT_SOURCE.repository}), read by this site’s generator on ${BT_FETCHED}. The SIG’s text is quoted with attribution: Copyright © Bluetooth SIG, Inc., which describes these files as proprietary to it. This site is not affiliated with Bluetooth SIG.`,
      "",
      `A free tool from ${site.name}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
