/**
 * The /tools/heart-rate-lab decoder, tested through the module the page
 * imports (src/lib/hrMeasurement.mjs) against the Bluetooth SIG structure in
 * src/data/bluetoothGatt.ts.
 *
 *   node --test scripts/hr-measurement.test.mjs     (npm run test:hr-lab)
 *
 * The packets are synthetic. They are built here by walking the SIG's raw
 * gss structure (not the compiled layout), so the decoder is checked against
 * an encoder that shares none of its code: for every one of the 32
 * combinations of the five defined Flags bits, with zero to three RR values,
 * the decoded fields must be exactly the ones the structure's "Present if"
 * lines announce, at the offsets their sizes imply.
 *
 * A fixed vector pins the byte order to the Web Bluetooth specification's own
 * example ({heartRate: 70, contactDetected: true, energyExpended: 750,
 * rrIntervals: [890, 870]}).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  compileHrmLayout,
  compileBodySensorLocation,
  decodeHrm,
  encodeHrm,
  decodeBodySensorLocation,
  decodeBatteryLevel,
  rmssd,
  syntheticSession,
  sessionCsv,
  parseHex,
  toHex,
} from "../src/lib/hrMeasurement.mjs";

const { BT_CHARACTERISTICS } = await import(new URL("../src/data/bluetoothGatt.ts", import.meta.url).href);
const HRM = BT_CHARACTERISTICS.find((c) => c.uuid === "0x2A37");
const BSL = BT_CHARACTERISTICS.find((c) => c.uuid === "0x2A38");
const layout = compileHrmLayout(HRM);

/** Independent encoder: walk the raw gss structure, little-endian. */
function packetFromStructure(flags, values) {
  const out = [flags];
  for (const f of HRM.gss.structure.slice(1)) {
    const on = ((flags >> f.presence.bit) & 1) === f.presence.value;
    if (!on) continue;
    const w = f.type.startsWith("uint16") ? 2 : f.type.startsWith("uint8") ? 1 : NaN;
    const list = f.type.endsWith("[n]") ? values[f.name] : [values[f.name]];
    for (const v of list) for (let i = 0; i < w; i++) out.push((v >> (8 * i)) & 0xff);
  }
  return Uint8Array.from(out);
}

test("the layout is what the SIG's 0x2A37 structure says", () => {
  assert.equal(layout.uuid, "0x2A37");
  assert.equal(layout.flagsName, "Flags");
  assert.deepEqual(
    layout.fields.map((f) => [f.name, f.type, f.width, f.presence.bit, f.presence.value, f.kind]),
    [
      ["Heart Rate Measurement Value (8 bit resolution)", "uint8", 1, 0, 0, "hr"],
      ["Heart Rate Measurement Value (16 bit resolution)", "uint16", 2, 0, 1, "hr"],
      ["Energy Expended", "uint16", 2, 3, 1, "energy"],
      ["RR-interval", "uint16[n]", 2, 4, 1, "rr"],
    ],
  );
  assert.equal(layout.contactDetectedBit, 1);
  assert.equal(layout.contactSupportedBit, 2);
  assert.deepEqual(layout.bits.filter((b) => b.reserved).flatMap((b) => b.bits), [5, 6, 7]);
  const rr = layout.fields.find((f) => f.kind === "rr");
  assert.equal(rr.scale.divisor, 1024);
  assert.match(rr.scale.evidence, /1\/1024 second as the unit/);
  assert.match(rr.countRule, /overall length of the characteristic/);
  assert.equal(layout.fields[0].unit.id, "org.bluetooth.unit.period.beats_per_minute");
  assert.equal(layout.fields[2].unit.id, "org.bluetooth.unit.energy.joule");
});

test("every combination of the five defined Flags bits decodes as the structure says", () => {
  let checked = 0;
  for (let flags = 0; flags < 32; flags++) {
    for (const nRr of [0, 1, 2, 3]) {
      const hr16 = (flags & 1) === 1;
      const hr = hr16 ? 300 + flags : 60 + flags; // > 255 only reachable in uint16
      const rrVals = [800, 1023, 65535].slice(0, nRr);
      const values = {
        "Heart Rate Measurement Value (8 bit resolution)": hr,
        "Heart Rate Measurement Value (16 bit resolution)": hr,
        "Energy Expended": 0xbeef,
        "RR-interval": rrVals,
      };
      const bytes = packetFromStructure(flags, values);
      const d = decodeHrm(bytes, layout);
      const tag = `flags=0x${flags.toString(16)} rr=${nRr}`;

      assert.equal(d.flags, flags, tag);
      assert.equal(d.heartRate, hr, tag);
      assert.equal(d.hrFormat, hr16 ? "uint16" : "uint8", tag);
      assert.equal(d.energyExpended, flags & 8 ? 0xbeef : null, tag);
      const rrOn = (flags & 16) !== 0;
      assert.equal(d.rrPresent, rrOn, tag);
      assert.deepEqual(d.rr, rrOn ? rrVals : [], tag);
      assert.deepEqual(d.rrMs, rrOn ? rrVals.map((v) => (v * 1000) / 1024) : [], tag);
      const contact = flags & 4 ? (flags & 2 ? "detected" : "not detected") : "not supported";
      assert.equal(d.sensorContact, contact, tag);
      assert.deepEqual(d.reservedSet, [], tag);

      // Offsets follow from the sizes of the fields before.
      const expectSpans = [{ start: 0, end: 1, kind: "flags" }];
      let off = 1;
      expectSpans.push({ start: off, end: off + (hr16 ? 2 : 1), kind: "hr" });
      off += hr16 ? 2 : 1;
      if (flags & 8) {
        expectSpans.push({ start: off, end: off + 2, kind: "energy" });
        off += 2;
      }
      if (rrOn) for (let i = 0; i < nRr; i++, off += 2) expectSpans.push({ start: off, end: off + 2, kind: "rr" });
      assert.deepEqual(d.spans.map(({ start, end, kind }) => ({ start, end, kind })), expectSpans, tag);
      assert.equal(off, bytes.length, tag);

      // Present RR flag with no RR octets is reported; nothing else is an error.
      if (rrOn && nRr === 0) assert.equal(d.errors.length, 1, tag);
      else assert.deepEqual(d.errors, [], tag);

      // The page's own encoder agrees with the independent one wherever both can express the case:
      // it only sets bit 1 together with bit 2, so skip "detected but unsupported".
      if (!((flags & 2) && !(flags & 4)) && !(rrOn && nRr === 0) && !(!rrOn && nRr > 0)) {
        const mine = encodeHrm(layout, {
          heartRate: hr,
          hr16,
          contact,
          energyExpended: flags & 8 ? 0xbeef : null,
          rr: rrOn ? rrVals : null,
        });
        assert.equal(toHex(mine), toHex(bytes), tag);
      }
      checked++;
    }
  }
  assert.equal(checked, 128);
});

test("the Web Bluetooth specification's example value", () => {
  // flags 0x1E: uint8 HR, contact detected and supported, energy, RR.
  const bytes = parseHex("1E 46 EE 02 7A 03 66 03");
  const d = decodeHrm(bytes, layout);
  assert.equal(d.heartRate, 70);
  assert.equal(d.sensorContact, "detected");
  assert.equal(d.energyExpended, 750);
  assert.deepEqual(d.rr, [890, 870]);
  assert.deepEqual(
    encodeHrm(layout, { heartRate: 70, contact: "detected", energyExpended: 750, rr: [890, 870] }),
    bytes,
  );
});

test("malformed values are reported, not thrown", () => {
  assert.match(decodeHrm([], layout).errors[0], /Empty/);
  assert.match(decodeHrm([0x01, 0x46], layout).errors[0], /needs 2 octets/); // uint16 flagged, one byte
  assert.match(decodeHrm([0x08, 0x46, 0x01], layout).errors[0], /Energy Expended/);
  const odd = decodeHrm([0x10, 0x46, 0x7a, 0x03, 0x66], layout);
  assert.deepEqual(odd.rr, [890]);
  assert.equal(odd.trailing, 1);
  const extra = decodeHrm([0x00, 0x46, 0x01], layout);
  assert.equal(extra.trailing, 1);
  const reserved = decodeHrm([0xe0, 0x46], layout);
  assert.deepEqual(reserved.reservedSet, [5, 6, 7]);
  assert.equal(reserved.heartRate, 70);
});

test("RMSSD", () => {
  assert.equal(rmssd([[1000]]), null);
  assert.equal(rmssd([]), null);
  const r = rmssd([[1000, 1010, 990]]); // diffs 10, -20 → sqrt((100+400)/2)
  assert.equal(r.differences, 2);
  assert.ok(Math.abs(r.value - Math.sqrt(250)) < 1e-9);
  // Never differences across runs.
  const s = rmssd([[1000, 1010], [500, 510]]);
  assert.equal(s.differences, 2);
  assert.equal(s.value, 10);
});

test("Body Sensor Location and Battery Level", () => {
  const bsl = compileBodySensorLocation(BSL);
  assert.equal(decodeBodySensorLocation([1], bsl).description, "Chest");
  assert.equal(decodeBodySensorLocation([2], bsl).description, "Wrist");
  assert.equal(decodeBodySensorLocation([0x80], bsl).description, "Reserved for Future Use");
  assert.equal(decodeBatteryLevel([87]).value, 87);
  assert.equal(decodeBatteryLevel([101]).inRange, false);
});

test("the synthetic session exercises every decoder path and decodes cleanly", () => {
  const s = syntheticSession(layout);
  assert.equal(s.length, 90);
  const ds = s.map((p) => decodeHrm(p.bytes, layout));
  assert.ok(ds.every((d) => d.errors.length === 0));
  assert.deepEqual(new Set(ds.map((d) => d.hrFormat)), new Set(["uint8", "uint16"]));
  assert.deepEqual(new Set(ds.map((d) => d.sensorContact)), new Set(["detected", "not detected", "not supported"]));
  assert.ok(ds.some((d) => d.energyExpended != null));
  assert.ok(ds.some((d) => d.rrPresent) && ds.some((d) => !d.rrPresent));
  // Deterministic.
  assert.equal(toHex(syntheticSession(layout)[10].bytes), toHex(s[10].bytes));
});

test("CSV", () => {
  const csv = sessionCsv([{ tMs: 0, at: "2026-10-31T00:00:00.000Z", source: "synthetic", bytes: parseHex("1E 46 EE 02 7A 03 66 03") }], layout);
  const [head, row] = csv.trim().split("\n");
  assert.match(head, /^t_ms,received_at,source,hex,flags/);
  assert.equal(row, "0,2026-10-31T00:00:00.000Z,synthetic,1E 46 EE 02 7A 03 66 03,0x1E,uint8,70,detected,750,890 870,869.1 849.6,");
});

test("parseHex", () => {
  assert.deepEqual(parseHex("1e46"), Uint8Array.from([0x1e, 0x46]));
  assert.deepEqual(parseHex("0x1E, 0x6"), Uint8Array.from([0x1e, 0x06]));
  assert.equal(parseHex("zz"), null);
  assert.equal(parseHex("abc"), null);
});
