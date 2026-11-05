import { BT_GATT_SOURCE } from "@/data/bluetoothGatt";
import { BT_COMMIT_SHORT, BT_FETCHED } from "@/data/btPages";
import { FTMS_DATA_UUIDS, FTMS_RANGE_UUIDS, FTMS_RAW_UUIDS, ftmsLayouts } from "@/lib/bleTools";
import { ftmsFacts } from "@/lib/bleLabFacts";
import { BLE_BROWSER_SUPPORT } from "@/lib/bleBrowserSupport";
import { BYTE_ORDER_SOURCE } from "@/lib/gattDecode.mjs";
import { site } from "@/lib/site";
import { interactiveNote, link, type MirrorDoc } from "./core";
import { gattLayoutSection } from "./gatt";

const PATH = "/tools/ftms-lab";
const UPDATED = "2026-11-05";

/** /tools/ftms-lab.md — mirrors src/app/tools/ftms-lab/page.tsx. Structures,
 *  bits, scales and the scale-check counts come from the same compiled SIG
 *  layouts the page renders (src/lib/bleLabFacts.ts). */
export function ftmsLabMirror(): MirrorDoc {
  const LAYOUTS = ftmsLayouts();
  const { TREADMILL, MORE_DATA, SPEED, RESISTANCE, CADENCE, SCALES, RESISTANCE_CONFLICTS, rawNames } = ftmsFacts(LAYOUTS);
  const layout = (u: string) => {
    const l = LAYOUTS.find((x) => x.uuid === u);
    if (!l) throw new Error(`ftms-lab mirror: no layout for ${u}`);
    return l;
  };

  return {
    path: PATH,
    title: "FTMS lab: decode treadmill, bike and rower Bluetooth data",
    description:
      "Decode Bluetooth FTMS Treadmill, Indoor Bike, Rower and Cross Trainer Data in the browser: each flag bit and field, live from a machine or from pasted hex.",
    updated: UPDATED,
    type: "tool",
    capsule: `An FTMS machine data value is a Flags field followed only by the fields its bits announce, so the same characteristic arrives in different lengths and you cannot read it at fixed offsets. In Treadmill Data (${TREADMILL.uuid}), Instantaneous Speed is present when bit ${SPEED.presence.bit} (“${MORE_DATA.description}”) is ${SPEED.presence.value}, every other field when its own bit is 1, and the Bluetooth SIG’s structure gives each field’s size and resolution: speed in 1/100 km/h, Indoor Bike cadence in 1/2 rpm. This lab connects a treadmill, indoor bike, rower or cross trainer over Web Bluetooth and decodes every value against that structure, or decodes hex you paste, with no machine at all.`,
    body: [
      interactiveNote(PATH, "the Web Bluetooth connection, live decoder, paste box and synthetic replays"),
      "",
      "## The structures it decodes against",
      "",
      `Each table is the layout the lab compiled from the Bluetooth SIG’s GATT Specification Supplement files at commit ${BT_COMMIT_SHORT} of the SIG’s public repository (read ${BT_FETCHED}), through this site’s generated copy. The machine data characteristics, then the Supported Range characteristics the lab reads once after connecting:`,
      "",
      ...[...FTMS_DATA_UUIDS, ...FTMS_RANGE_UUIDS, ...FTMS_RAW_UUIDS].flatMap((u) => gattLayoutSection(layout(u))),
      "## How to read an FTMS value",
      "",
      "1. **Flags first.** Treadmill, Indoor Bike and Rower Data open with a two-octet Flags field (`boolean[16]`); Cross Trainer Data’s is three octets (`boolean[24]`). Read it as a little-endian number.",
      `2. **Walk the fields in order.** For each field, its “Present if” line names one bit and the value that makes it present. Present: read its size and move on. Absent: it takes no octets. Several fields can share one bit (Total Energy, Energy Per Hour and Energy Per Minute all hang on one), and bit 0 is the odd one out: “${SPEED.presence.evidence}”.`,
      `3. **Scale each value.** The SIG gives a “Represented values: M = …, d = …, b = …” line where the raw number is not the unit, and the lab multiplies by M × 10^d × 2^b. Instantaneous Speed: “${SPEED.scale.evidence}”, beside “${SPEED.scale.unitIs}”. Instantaneous Cadence: “${CADENCE.scale.evidence}”, beside “${CADENCE.scale.unitIs}”.`,
      `4. **Merge across notifications.** A machine with more to say than fits in one value can set bit 0 (“${MORE_DATA.description}”), which drops Instantaneous Speed from that value. The lab’s “Latest values” panel keeps the newest reading of each field from whichever notification carried it; the treadmill replay sends such a split packet every fifth second.`,
      "",
      "## Where the decoder reads past the SIG’s file",
      "",
      `- **Byte order.** The YAML gives sizes, not byte order. The lab reads little-endian, as the ${link("Web Bluetooth specification’s heart-rate example", BYTE_ORDER_SOURCE.url)} does (\`${BYTE_ORDER_SOURCE.quote}\`, read ${BYTE_ORDER_SOURCE.fetchedOn}).`,
      `- **The scale formula.** The files do not spell out how M, d and b combine. The lab uses M × 10^d × 2^b, and its test suite checks that product against every “Unit is” sentence in the dataset it can parse (b = −10 beside “1/1024 second”, M = 5 and d = −3 beside “0.005 kilogram”, and so on): ${SCALES.checked} lines, all agreeing except ${SCALES.conflicts.length}.`,
      `- **Resistance Level.** ${RESISTANCE_CONFLICTS} of those ${SCALES.conflicts.length} are FTMS resistance fields, where the SIG’s own lines disagree: “${RESISTANCE.scale.evidence}” (a factor of ${RESISTANCE.scale.factor}) sits beside “${RESISTANCE.scale.unitIs}”. The lab shows the value both ways and picks neither.`,
      `- **No structure, no decoding.** At this commit the SIG’s repository has no gss file for ${rawNames.join(", ")}. The lab shows their bytes as hex and does not decode them from memory. That is also why it has no control panel: setting a target speed or power means writing op codes to the Control Point, and the layout of those op codes is not in the files this site reads. The lab never writes to the machine.`,
      "",
      "## Which browsers can connect",
      "",
      BLE_BROWSER_SUPPORT.sentence,
      "",
      `Source: ${link("MDN browser-compat-data, api/Bluetooth.json", BLE_BROWSER_SUPPORT.url)}, read ${BLE_BROWSER_SUPPORT.readOn}. Elsewhere the paste box and replays still work.`,
      "",
      "## What the lab cannot tell you",
      "",
      "- Accuracy. The bytes say what the machine reports, not whether its belt speed or power reading is right.",
      "- Which fields a model supports before it sends them. Fitness Machine Feature declares that, and it is one of the characteristics shown raw here.",
      `- Anything about a machine that does not advertise the Fitness Machine service: the browser’s chooser only lists devices that do. For any other device, use the ${link("BLE GATT explorer", "/tools/ble-gatt-explorer")}.`,
      "",
      `The integration side is in ${link("what FTMS is", "/devices/ftms-fitness-machine-service")}, ${link("treadmill app integration", "/devices/treadmill-app-integration")}, ${link("indoor bike trainer integration", "/devices/indoor-bike-trainer-integration")} and ${link("rowing machine data", "/devices/rowing-machine-data")}; the radio question in ${link("ANT+ vs Bluetooth", "/devices/ant-plus-vs-bluetooth")}. Power meters and cadence sensors have their own ${link("cycling power and cadence lab", "/tools/cycling-power-lab")}.`,
      "",
      "## How this works, and what it sends",
      "",
      "Nothing leaves your device. The browser shows its own device chooser, and the page can reach only the machine you pick and only its Fitness Machine service. It subscribes to the characteristics that notify (except the Control Point), reads the Supported Range and Feature characteristics once, and writes nothing. Values are decoded in this tab and held in memory until you close it; this site has no server code behind the page and stores nothing.",
      "",
      "The samples and replays are generated, not recorded from a machine: their numbers are made up, and they are built by the same module that decodes them, from the field names in the SIG’s structure.",
      "",
      `The structures come from the Bluetooth SIG’s public repository (${BT_GATT_SOURCE.repository}), read by this site’s generator on ${BT_FETCHED}. The SIG’s text is quoted with attribution: Copyright © Bluetooth SIG, Inc., which describes these files as proprietary to it. This site is not affiliated with Bluetooth SIG.`,
      "",
      `A free tool from ${site.name}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
