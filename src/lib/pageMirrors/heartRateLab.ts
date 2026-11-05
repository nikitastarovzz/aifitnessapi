import { BT_GATT_SOURCE } from "@/data/bluetoothGatt";
import { BT_COMMIT_SHORT, BT_FETCHED, btById, sigFileUrl } from "@/data/btPages";
import { BATTERY_LEVEL, BYTE_ORDER_SOURCE, compileBodySensorLocation, compileHrmLayout } from "@/lib/hrMeasurement.mjs";
import { site } from "@/lib/site";
import { interactiveNote, link, table, type MirrorDoc } from "./core";

const PATH = "/tools/heart-rate-lab";
const UPDATED = "2026-10-31";

/** /tools/heart-rate-lab.md — mirrors src/app/tools/heart-rate-lab/page.tsx.
 *  The structure table, bit list and quotes come from the same compiled SIG
 *  layout the page renders. */
export function heartRateLabMirror(): MirrorDoc {
  const HRM = btById("org.bluetooth.characteristic.heart_rate_measurement");
  const BSL = btById("org.bluetooth.characteristic.body_sensor_location");
  if (!HRM || !BSL) throw new Error("heart-rate-lab mirror: 0x2A37 or 0x2A38 is missing from src/data/bluetoothGatt.ts");
  const LAYOUT = compileHrmLayout(HRM);
  const BSL_LAYOUT = compileBodySensorLocation(BSL);
  const RR = LAYOUT.fields.find((f) => f.kind === "rr");
  const ENERGY = LAYOUT.fields.find((f) => f.kind === "energy");
  const RR_DEF = HRM.gss?.definitions.find((d) => d.name.toLowerCase() === RR?.name.toLowerCase());
  const RR_FIRST = RR_DEF?.description?.split(/(?<=\.)\s+/)[0] ?? null;
  const bits = LAYOUT.bits.map((b) => `bit ${b.label}, “${b.description.split("\n")[0]}”`).join("; ");
  const hex = (n: number) => `0x${n.toString(16).toUpperCase()}`;
  const rrQuote = [RR_FIRST ? `The SIG defines the field plainly: “${RR_FIRST}”` : "", RR?.scale ? `and “${RR.scale.evidence}”` : ""]
    .filter(Boolean)
    .join(" ");

  return {
    path: PATH,
    title: "Bluetooth heart-rate lab: see every byte your strap sends",
    description:
      "Connect a BLE heart-rate strap in the browser: live BPM, every 0x2A37 byte decoded, and whether it sends the RR intervals HRV needs. Nothing is uploaded.",
    updated: UPDATED,
    type: "tool",
    capsule: `Whether a Bluetooth heart-rate device can give you HRV is written in its bytes: each Heart Rate Measurement (${LAYOUT.uuid}) notification carries RR intervals only when bit ${RR?.presence.bit} of its Flags octet is set, and without RR intervals there is no beat-to-beat timing to compute HRV from. This page connects a strap or a broadcasting watch over Web Bluetooth, decodes every notification against the Bluetooth SIG’s published structure, and tells you which kind your device is. Browsers without Web Bluetooth can replay a synthetic stream instead. The bytes never leave the tab.`,
    body: [
      interactiveNote(PATH, "the Web Bluetooth connection, live decoder and replay"),
      "",
      "## The structure it decodes against",
      "",
      `The decoder has no packet layout of its own. It reads the Bluetooth SIG’s GATT Specification Supplement file for Heart Rate Measurement, ${link(`\`${LAYOUT.file}\``, sigFileUrl(LAYOUT.file))} at commit ${BT_COMMIT_SHORT} of the SIG’s public repository (read ${BT_FETCHED}), from this site’s generated copy, and builds the decoder from it. Every field after Flags is conditional:`,
      "",
      ...table(
        ["Field", "Type", "Size", "Condition", "Unit"],
        [
          [LAYOUT.flagsName, "boolean[8]", 1, "always", "—"],
          ...LAYOUT.fields.map((f) => [f.name, f.type, f.size, f.presence.evidence, f.scale ? f.scale.label : (f.unit?.name ?? "—")]),
        ],
      ),
      `The Flags bits, as the SIG lists them: ${bits}. Bits ${LAYOUT.contactSupportedBit} and ${LAYOUT.contactDetectedBit} carry no field of their own: the lab reads them as “contact not supported” when bit ${LAYOUT.contactSupportedBit} is clear, and otherwise as detected or not detected. The full page for the characteristic, with the SIG’s notice, is ${link("Heart Rate Measurement (0x2A37)", "/bluetooth-fitness/heart-rate-measurement")}; Body Sensor Location (${BSL_LAYOUT.uuid}), which the lab reads once after connecting, is on the ${link("Bluetooth GATT reference", "/bluetooth-fitness#char-body-sensor-location")}.`,
      "",
      "## Why RR intervals decide HRV",
      "",
      `${rrQuote ? `${rrQuote} ` : ""}HRV is a statistic over exactly those beat-to-beat times. A heart-rate value is one number in beats per minute per notification; the timing of the individual beats is not in it, and no amount of processing on the app side puts it back. That is why the verdict above is a yes or a no: a device that never sets bit ${RR?.presence.bit} gives you heart rate, and only heart rate.`,
      "",
      `A notification can carry several RR values or none.${RR?.countRule ? ` The SIG: “${RR.countRule}”` : ""} The lab therefore counts the octets left after the fields the flags announce, two per value, and reports an odd one left over instead of guessing at it.`,
      "",
      `The RMSSD the lab shows is the root mean square of successive differences between RR intervals, computed only within runs of notifications that all carried RR values. It is there so you can see the arithmetic work on your own data, labeled a demo, and it is not a medical or training measurement: there is no artifact or ectopic-beat correction, no minimum recording length and no baseline. What HRV is, and how the platforms store it, is covered in ${link("what is HRV", "/learn/what-is-hrv")}, ${link("how to get HRV data from an API", "/data/hrv-api")} and Health Connect’s ${link("HeartRateVariabilityRmssdRecord", "/health-connect/heart-rate-variability-rmssd-record")}.`,
      "",
      "## Where the decoder reads past the SIG’s file",
      "",
      `- **Byte order.** The structure gives sizes, not byte order. The lab reads multi-octet fields little-endian, as the ${link("Web Bluetooth specification’s heart-rate example", BYTE_ORDER_SOURCE.url)} does (\`${BYTE_ORDER_SOURCE.quote}\`, read ${BYTE_ORDER_SOURCE.fetchedOn}). The default value in the paste box, \`1E 46 EE 02 7A 03 66 03\`, decodes to that example’s published result: 70 bpm, contact detected, Energy Expended 750, RR values 890 and 870.`,
      `- **Energy Expended’s unit.** The SIG’s file gives \`${ENERGY?.unit?.id ?? "no unit"}\`${ENERGY?.unit?.name ? ` (${ENERGY.unit.name})` : ""}, and the lab shows that. The same Web Bluetooth example comments the value as \`${BYTE_ORDER_SOURCE.energyComment.trim()}\`. The two sources disagree by a factor of a thousand; we report the disagreement rather than pick one.`,
      `- **Battery Level (${hex(BATTERY_LEVEL.uuid)}).** Outside this site’s Bluetooth dataset, so it was read on ${BATTERY_LEVEL.fetchedOn} from the SIG’s own ${link(`\`${BATTERY_LEVEL.file}\``, sigFileUrl(BATTERY_LEVEL.file))} at the same commit: one \`${BATTERY_LEVEL.type}\`, “${BATTERY_LEVEL.lines[1]}” The lab asks for the Battery service (${hex(BATTERY_LEVEL.serviceUuid)}) as an optional service and says so when a device does not expose it.`,
      "",
      "## What the lab cannot tell you",
      "",
      "- Whether the RR values are measured. The bytes say a device sent values in the RR field, not how it got them; the lab shows how many distinct values arrived so a suspiciously uniform stream is visible, and leaves the judgment to you.",
      "- Accuracy. Nothing here compares a device with a reference; we publish no accuracy figure for any strap or watch.",
      `- Anything in a browser without Web Bluetooth. The page detects the API and, where it is missing, offers the synthetic replay and the paste box. Which browsers ship it is set out in ${link("Web Bluetooth for fitness devices", "/devices/web-bluetooth-fitness")}. Real Bluetooth cannot be exercised in an automated test either, which is why the decoder is tested on synthetic packets built from the SIG structure (all 32 combinations of the five defined Flags bits).`,
      "",
      `Building this into an app is the subject of ${link("connecting a Bluetooth heart rate monitor", "/devices/bluetooth-heart-rate-monitor")}, with the radio choice in ${link("ANT+ vs Bluetooth", "/devices/ant-plus-vs-bluetooth")}, the watch case in ${link("Apple Watch live heart rate", "/devices/apple-watch-live-heart-rate")}, and CI without a strap in ${link("testing BLE fitness devices", "/devices/testing-ble-fitness-devices")}. Every characteristic the SIG defines for fitness devices is in the ${link("Bluetooth GATT reference", "/bluetooth-fitness")}.`,
      "",
      "## How this works, and what it sends",
      "",
      "Nothing leaves your device. The browser shows its own device chooser; the page can talk only to the device you pick, and only to the Heart Rate service and, if present, the Battery service. Notifications are decoded in this tab and held in memory until you close it. This site has no server code behind the page, stores nothing, and logs no event from it beyond its ordinary page view. The CSV and the share card are made in the tab and go wherever you paste or save them, and nowhere else.",
      "",
      "The synthetic replay is generated by the page, not recorded from a device: its heart rate and RR values are made up, and it switches between the uint8 and uint16 heart-rate formats, the three contact states, Energy Expended and a stretch with no RR intervals so that every part of the decoder runs.",
      "",
      `The structure comes from the Bluetooth SIG’s public repository (${BT_GATT_SOURCE.repository}), read by this site’s generator on ${BT_FETCHED}. The SIG’s text is quoted with attribution: Copyright © Bluetooth SIG, Inc., which describes these files as proprietary to it. This site is not affiliated with Bluetooth SIG.`,
      "",
      `A free tool from ${site.name}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
