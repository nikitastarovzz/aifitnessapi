/**
 * ble-heart-rate-parser.test.mjs
 *
 * The contract for ble-heart-rate-parser.mjs. The hard-coded bit positions
 * are checked against the Bluetooth SIG structure in the site's generated
 * src/data/bluetoothGatt.ts, and the parser is run against the site's
 * structure-driven decoder (src/lib/hrMeasurement.mjs, behind
 * /tools/heart-rate-lab) for every combination of the five defined Flags
 * bits with zero to three RR values: the two must agree on every field.
 * One fixed vector is the Web Bluetooth specification's example reading.
 *
 * Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";

import { HeartRateParseError, onHeartRate, parseHeartRateMeasurement } from "./ble-heart-rate-parser.mjs";
import { compileHrmLayout, decodeHrm, encodeHrm } from "../src/lib/hrMeasurement.mjs";

const { BT_CHARACTERISTICS } = await import(new URL("../src/data/bluetoothGatt.ts", import.meta.url).href);
const HRM = BT_CHARACTERISTICS.find((c) => c.uuid === "0x2A37");
const layout = compileHrmLayout(HRM);

test("the bit positions this file hard-codes are the SIG structure's", () => {
  const byKind = Object.fromEntries(layout.fields.map((f) => [`${f.kind}${f.width}`, f.presence]));
  assert.deepEqual([byKind.hr1.bit, byKind.hr1.value, byKind.hr2.bit, byKind.hr2.value], [0, 0, 0, 1]);
  assert.deepEqual([byKind.energy2.bit, byKind.rr2.bit], [3, 4]);
  assert.equal(layout.contactDetectedBit, 1);
  assert.equal(layout.contactSupportedBit, 2);
  const rr = layout.fields.find((f) => f.kind === "rr");
  assert.equal(rr.scale.divisor, 1024);
  assert.equal(layout.fields.find((f) => f.kind === "energy").unit.id, "org.bluetooth.unit.energy.joule");
});

test("the Web Bluetooth example: 70 bpm, contact, 750 energy, RR 890 and 870", () => {
  const r = parseHeartRateMeasurement(Uint8Array.from([0x1e, 0x46, 0xee, 0x02, 0x7a, 0x03, 0x66, 0x03]));
  assert.equal(r.heartRate, 70);
  assert.equal(r.sensorContact, "detected");
  assert.equal(r.energyExpended, 750);
  assert.deepEqual(r.rrIntervals, [890, 870]);
  assert.deepEqual(r.rrMs, [(890 * 1000) / 1024, (870 * 1000) / 1024]);
});

test("agrees with the site's structure-driven decoder on every flag combination", () => {
  let cases = 0;
  for (const hr16 of [false, true]) {
    for (const contact of ["not supported", "not detected", "detected"]) {
      for (const energy of [null, 1234]) {
        for (const rr of [null, [1000], [1000, 980], [1000, 980, 1010]]) {
          const heartRate = hr16 ? 300 : 72;
          const bytes = encodeHrm(layout, { heartRate, hr16, contact, energyExpended: energy, rr });
          const site = decodeHrm(bytes, layout);
          const mine = parseHeartRateMeasurement(bytes);
          assert.deepEqual(site.errors, []);
          assert.equal(mine.heartRate, site.heartRate);
          assert.equal(mine.format, site.hrFormat);
          assert.equal(mine.sensorContact, site.sensorContact);
          assert.equal(mine.energyExpended, site.energyExpended);
          assert.deepEqual(mine.rrIntervals, site.rr);
          assert.deepEqual(mine.rrMs, site.rrMs);
          cases++;
        }
      }
    }
  }
  assert.equal(cases, 48);
});

test("contact not supported is not the same as no contact", () => {
  assert.equal(parseHeartRateMeasurement([0x00, 60]).sensorContact, "not supported");
  assert.equal(parseHeartRateMeasurement([0x04, 60]).sensorContact, "not detected");
  assert.equal(parseHeartRateMeasurement([0x06, 60]).sensorContact, "detected");
  // Detected without supported: the supported bit governs.
  assert.equal(parseHeartRateMeasurement([0x02, 60]).sensorContact, "not supported");
});

test("16-bit heart rate is little-endian", () => {
  assert.equal(parseHeartRateMeasurement([0x01, 0x2c, 0x01]).heartRate, 300);
});

test("reserved bits are reported, not silently dropped", () => {
  assert.deepEqual(parseHeartRateMeasurement([0xe0, 60]).reservedBits, [5, 6, 7]);
});

test("truncated or padded values throw instead of mis-decoding", () => {
  assert.throws(() => parseHeartRateMeasurement([0x00]), HeartRateParseError);
  assert.throws(() => parseHeartRateMeasurement([0x01, 0x2c]), /heart-rate value/);
  assert.throws(() => parseHeartRateMeasurement([0x08, 60, 0x01]), /Energy Expended/);
  assert.throws(() => parseHeartRateMeasurement([0x10, 60]), /no RR octets/);
  assert.throws(() => parseHeartRateMeasurement([0x10, 60, 0x00, 0x04, 0x01]), /odd number/);
  assert.throws(() => parseHeartRateMeasurement([0x00, 60, 0x00]), /left over/);
});

test("DataView, ArrayBuffer and Buffer inputs all parse", () => {
  const raw = Uint8Array.from([0x10, 61, 0x00, 0x04]);
  const viaView = parseHeartRateMeasurement(new DataView(raw.buffer));
  assert.equal(parseHeartRateMeasurement(raw.buffer).heartRate, 61);
  assert.equal(parseHeartRateMeasurement(Buffer.from(raw)).heartRate, 61);
  assert.deepEqual(viaView.rrIntervals, [1024]);
  assert.deepEqual(viaView.rrMs, [1000]);
});

test("the Web Bluetooth listener hands parsed values or errors to its callbacks", () => {
  const got = [];
  const errs = [];
  const listener = onHeartRate((r) => got.push(r.heartRate), (e) => errs.push(e.name));
  listener({ target: { value: new DataView(Uint8Array.from([0x00, 88]).buffer) } });
  listener({ target: { value: new DataView(Uint8Array.from([0x00]).buffer) } });
  assert.deepEqual(got, [88]);
  assert.deepEqual(errs, ["HeartRateParseError"]);
});
