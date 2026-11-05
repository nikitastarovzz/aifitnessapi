import { BT_GATT_SOURCE } from "@/data/bluetoothGatt";
import { BT_COMMIT_SHORT, BT_FETCHED } from "@/data/btPages";
import { CYCLING_MEASUREMENT_UUIDS, CYCLING_READ_UUIDS, cyclingLayouts } from "@/lib/bleTools";
import { bitsOf, cyclingFacts, tick, wrapSeconds } from "@/lib/bleLabFacts";
import { BLE_BROWSER_SUPPORT } from "@/lib/bleBrowserSupport";
import { BYTE_ORDER_SOURCE } from "@/lib/gattDecode.mjs";
import { site } from "@/lib/site";
import { interactiveNote, link, type MirrorDoc } from "./core";
import { gattLayoutSection } from "./gatt";

const PATH = "/tools/cycling-power-lab";
const UPDATED = "2026-11-05";

/** /tools/cycling-power-lab.md — mirrors src/app/tools/cycling-power-lab/page.tsx.
 *  Structures, bits, ticks and wrap times come from the same compiled SIG
 *  layouts the page renders (src/lib/bleLabFacts.ts). */
export function cyclingPowerLabMirror(): MirrorDoc {
  const LAYOUTS = cyclingLayouts();
  const { CP, CSC, CSC_WHEEL, CSC_CRANK, CP_WHEEL, CP_CRANK } = cyclingFacts();
  const layout = (u: string) => {
    const l = LAYOUTS.find((x) => x.uuid === u);
    if (!l) throw new Error(`cycling-power-lab mirror: no layout for ${u}`);
    return l;
  };

  return {
    path: PATH,
    title: "Cycling power and cadence lab: from revolution counts to rpm",
    description:
      "Decode Bluetooth Cycling Power (0x2A63) and CSC (0x2A5B) in the browser, and turn wheel and crank revolution counts into cadence and speed, live or pasted.",
    updated: UPDATED,
    type: "tool",
    capsule: `Neither ${CP.name} (${CP.uuid}) nor ${CSC.name} (${CSC.uuid}) sends cadence or speed. Each sends a cumulative revolution count and the time of the last revolution event, so cadence is the change in crank revolutions divided by the change in event time between two notifications, and speed is the change in wheel revolutions times your wheel’s circumference over the same interval. The Bluetooth SIG’s structures give the tick: ${tick(CSC_CRANK.scale.factor)} for both CSC event times, but ${tick(CP_WHEEL.scale.factor)} for the Cycling Power wheel and ${tick(CP_CRANK.scale.factor)} for its crank. This lab connects a power meter or speed/cadence sensor over Web Bluetooth and does that arithmetic in the open, or on two hex values you paste.`,
    body: [
      interactiveNote(PATH, "the Web Bluetooth connection, live cadence and speed, paste boxes and synthetic ride"),
      "",
      "## The structures it decodes against",
      "",
      `Compiled from the Bluetooth SIG’s GATT Specification Supplement files at commit ${BT_COMMIT_SHORT} of the SIG’s public repository (read ${BT_FETCHED}), through this site’s generated copy. The two measurements, then the characteristics the lab reads once after connecting:`,
      "",
      ...[...CYCLING_MEASUREMENT_UUIDS, ...CYCLING_READ_UUIDS].flatMap((u) => gattLayoutSection(layout(u))),
      "## The arithmetic, step by step",
      "",
      `1. **Find the struct.** In CSC Measurement, Wheel Revolution Data is present when bit ${CSC_WHEEL.presence.bit} of Flags is ${CSC_WHEEL.presence.value} and Crank Revolution Data when bit ${CSC_CRANK.presence.bit} is ${CSC_CRANK.presence.value}. In Cycling Power Measurement they hang on bits ${CP_WHEEL.presence.bit} and ${CP_CRANK.presence.bit} of a two-octet Flags field, after Instantaneous Power, which is always there.`,
      `2. **Difference two readings, with the wrap.** ${CSC_CRANK.revs.name} is a \`${CSC_CRANK.revs.type}\` and every event time a \`${CSC_CRANK.time.type}\`, so they roll over: a later reading smaller than the earlier one means the counter wrapped, and the step is the difference modulo 2^${bitsOf(CSC_CRANK.time.type)}. At ${tick(CSC_CRANK.scale.factor)} the event time wraps every ${wrapSeconds(bitsOf(CSC_CRANK.time.type), CSC_CRANK.scale.factor)} s; the Cycling Power wheel’s, at ${tick(CP_WHEEL.scale.factor)}, every ${wrapSeconds(bitsOf(CP_WHEEL.time.type), CP_WHEEL.scale.factor)} s. The synthetic ride wraps both.`,
      `3. **Scale the time.** CSC’s wheel event time: “${CSC_WHEEL.scale.evidence}”, beside “${CSC_WHEEL.scale.unitIs}”. Cycling Power’s: “${CP_WHEEL.scale.evidence}”, beside “${CP_WHEEL.scale.unitIs}”. The lab multiplies by M × 10^d × 2^b; a parser that assumes one tick for both reads Cycling Power wheel speed at half or double its value.`,
      "4. **Divide.** Cadence in rpm is Δcrank revolutions ÷ Δt × 60. Wheel speed is Δwheel revolutions × circumference ÷ Δt; the lab shows km/h (× 3.6 from m/s). The circumference is not in either characteristic, which is why the lab asks for it.",
      "5. **Treat an unchanged event time as no new event.** Two notifications with the same event time mean no revolution finished between them (coasting, or a notification interval shorter than one revolution). The lab reports “no new event” and keeps the last cadence on screen labeled as such, rather than dividing by zero or showing 0 rpm.",
      "",
      "## Where the decoder reads past the SIG’s file",
      "",
      `- **Byte order.** Little-endian, as the ${link("Web Bluetooth specification’s heart-rate example", BYTE_ORDER_SOURCE.url)} reads every multi-octet field (\`${BYTE_ORDER_SOURCE.quote}\`, read ${BYTE_ORDER_SOURCE.fetchedOn}); the YAML gives sizes only.`,
      "- **Extreme Angles.** Two 12-bit members packed into three octets. The SIG’s file gives the example itself (Maximum Angle 0xABC and Minimum Angle 0x123 make 0x123ABC), and the test suite decodes exactly that example.",
      "- **Control points.** Cycling Power Control Point and SC Control Point have no member layout for their Parameter in the files this site reads, so the lab neither decodes nor writes them. It writes nothing to a sensor.",
      "",
      "## Which browsers can connect",
      "",
      BLE_BROWSER_SUPPORT.sentence,
      "",
      `Source: ${link("MDN browser-compat-data, api/Bluetooth.json", BLE_BROWSER_SUPPORT.url)}, read ${BLE_BROWSER_SUPPORT.readOn}. Elsewhere the paste boxes and the replay still work.`,
      "",
      "## What the lab cannot tell you",
      "",
      "- Accuracy. Nothing here compares a power meter or sensor with a reference.",
      `- Which source to trust when a trainer, a power meter and a cadence sensor all report the same pedal stroke. The lab shows each characteristic separately and never merges them; picking one source per metric is covered in ${link("reading cycling power, cadence and speed sensors", "/devices/cycling-sensors-power-cadence")}.`,
      `- Smart-trainer data that arrives as FTMS Indoor Bike Data instead: that has its own ${link("FTMS lab", "/tools/ftms-lab")}, and the trainer side is in ${link("indoor bike trainer integration", "/devices/indoor-bike-trainer-integration")}.`,
      "",
      `The radio choice is in ${link("ANT+ vs Bluetooth", "/devices/ant-plus-vs-bluetooth")}, CI without a sensor in ${link("testing BLE fitness devices", "/devices/testing-ble-fitness-devices")}, and any other characteristic in the ${link("BLE GATT explorer", "/tools/ble-gatt-explorer")}.`,
      "",
      "## How this works, and what it sends",
      "",
      "Nothing leaves your device. The browser’s own chooser lists devices advertising the Cycling Power or Cycling Speed and Cadence service; the page can reach only the one you pick and only those services. It subscribes to the two measurements, reads Cycling Power Feature, CSC Feature and Sensor Location once where present, and writes nothing. Values stay in this tab’s memory; this site has no server code behind the page and stores nothing.",
      "",
      "The synthetic ride and the sample pairs are generated, not recorded from a sensor: the numbers are made up, encoded by the same module that decodes them, with a coasting stretch where the crank event time stops.",
      "",
      `The structures come from the Bluetooth SIG’s public repository (${BT_GATT_SOURCE.repository}), read by this site’s generator on ${BT_FETCHED}. The SIG’s text is quoted with attribution: Copyright © Bluetooth SIG, Inc., which describes these files as proprietary to it. This site is not affiliated with Bluetooth SIG.`,
      "",
      `A free tool from ${site.name}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
