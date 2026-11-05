/**
 * The decoder behind /tools/ftms-lab, /tools/cycling-power-lab and
 * /tools/ble-gatt-explorer, tested through the module those pages import
 * (src/lib/gattDecode.mjs) against the Bluetooth SIG structures in
 * src/data/bluetoothGatt.ts.
 *
 *   node --test scripts/gatt-decode.test.mjs     (npm run test:ble)
 *
 * Every packet here is synthetic. The fixed vectors are written out byte by
 * byte from the SIG's structure as the dataset holds it (field order, sizes,
 * "Present if" lines, "Represented values" lines), little-endian; the
 * property tests build packets with an encoder in this file that walks the
 * raw gss structure and shares no code with the decoder.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  compileLayout,
  decode,
  encode,
  fieldOf,
  readScale,
  unitIsFactor,
  revolutionRate,
  wheelSpeedKmh,
  wrapDelta,
  parseHex,
} from "../src/lib/gattDecode.mjs";

const { BT_CHARACTERISTICS } = await import(new URL("../src/data/bluetoothGatt.ts", import.meta.url).href);
const byUuid = (u) => BT_CHARACTERISTICS.find((c) => c.uuid === u);
const resolve = (id) => BT_CHARACTERISTICS.find((c) => c.id === id);
const L = (u) => compileLayout(byUuid(u), resolve);
const hex = (s) => parseHex(s);
const val = (d, name) => fieldOf(d, name);

/* ── Resolution: M × 10^d × 2^b against the SIG's own "Unit is" lines ── */

test("M × 10^d × 2^b matches every parseable 'Unit is' line, except the SIG's own disagreements", () => {
  const conflicts = [];
  let checked = 0;
  const check = (where, text) => {
    const s = readScale(text);
    if (!s || s.unitIsFactor == null) return;
    checked++;
    if (s.conflict) conflicts.push(where);
  };
  for (const c of BT_CHARACTERISTICS) {
    for (const f of c.gss?.structure ?? []) check(`${c.uuid} ${f.name}`, f.description);
    const walk = (ds) => ds.forEach((d) => (d.rows.forEach((r) => check(`${c.uuid} ${d.name} › ${r.field}`, r.description)), walk(d.subfields)));
    walk(c.gss?.definitions ?? []);
  }
  assert.ok(checked >= 50, `only ${checked} lines checked`);
  // Each of these says d = 1 (or d = -2) beside a "Unit is" sentence that
  // states a different number. The decoder reports both; this pins the list
  // so a new disagreement is noticed.
  assert.deepEqual(conflicts.sort(), [
    "0x2A9C Impedance",
    "0x2ACE Resistance Level",
    "0x2AD1 Resistance Level",
    "0x2AD2 Resistance Level",
    "0x2AD6 Maximum Resistance Level",
    "0x2AD6 Minimum Increment",
    "0x2AD6 Minimum Resistance Level",
    "0x2B4E Distance",
  ]);
});

test("unitIsFactor reads the sentence forms the SIG uses", () => {
  assert.equal(unitIsFactor("Unit is 1/100 of a kilometer per hour"), 0.01);
  assert.equal(unitIsFactor("Unit is 1/1024th of a second"), 1 / 1024);
  assert.equal(unitIsFactor("Unit is 0.005 kilogram."), 0.005);
  assert.equal(unitIsFactor("Unit is joule with a resolution of 1000 J."), 1000);
  assert.equal(unitIsFactor("Unit is meter with 0.0001 m (e.g., 0.1 mm)"), 0.0001);
  assert.equal(unitIsFactor("Unit is 1"), 1);
  assert.equal(unitIsFactor("Unit is kilojoule"), null);
});

/* ── Independent encoder over the raw gss structure ───────────────────── */

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Walk the raw structure: flags first, then every field whose "Present if" line holds. */
function packetFromStructure(c, flags, pick) {
  const out = [];
  const [first, ...rest] = c.gss.structure;
  const fw = Number(/boolean\[(\d+)\]/.exec(first.type)[1]) / 8;
  for (let i = 0; i < fw; i++) out.push(Math.floor(flags / 2 ** (8 * i)) % 256);
  const expect = {};
  for (const f of rest) {
    const on = Math.floor(flags / 2 ** f.presence.bit) % 2 === f.presence.value;
    if (!on) {
      expect[f.name] = null;
      continue;
    }
    const m = /^(u|s)int(\d+)$/.exec(f.type);
    const bits = Number(m[2]);
    let raw = Math.floor(pick() * 2 ** bits);
    for (let i = 0; i < bits / 8; i++) out.push(Math.floor(raw / 2 ** (8 * i)) % 256);
    if (m[1] === "s" && raw >= 2 ** (bits - 1)) raw -= 2 ** bits;
    expect[f.name] = raw;
  }
  return { bytes: Uint8Array.from(out), expect };
}

for (const uuid of ["0x2ACD", "0x2ACE", "0x2ACF", "0x2AD0", "0x2AD1", "0x2AD2"]) {
  const c = byUuid(uuid);
  test(`${c.name} (${uuid}): 300 random flag combinations decode as the structure says`, () => {
    const layout = L(uuid);
    assert.equal(layout.unsupported, null);
    assert.equal(layout.fields.length, c.gss.structure.length);
    const flagBits = Number(/boolean\[(\d+)\]/.exec(c.gss.structure[0].type)[1]);
    const pick = rng(Number(uuid));
    for (let n = 0; n < 300; n++) {
      // Only the bits the SIG defines; reserved bits get their own test.
      const defined = layout.fields[0].bits.filter((b) => !b.reserved).flatMap((b) => b.bits);
      let flags = 0;
      for (const b of defined) if (pick() < 0.5) flags += 2 ** b;
      const { bytes, expect } = packetFromStructure(c, flags, pick);
      const d = decode(bytes, layout);
      assert.deepEqual(d.errors, [], `flags 0x${flags.toString(16)}`);
      assert.equal(d.trailing, 0);
      assert.equal(val(d, "Flags").raw, flags);
      for (const [name, raw] of Object.entries(expect)) {
        const f = val(d, name);
        assert.equal(f.status, raw == null ? "absent" : "present", `${name} @ flags 0x${flags.toString(16)}`);
        if (raw == null) continue;
        assert.equal(f.raw, raw, name);
        const s = c.gss.structure.find((x) => x.name === name);
        const rep = /Represented values:\s*M\s*=\s*(-?\d+),\s*d\s*=\s*(-?\d+),\s*b\s*=\s*(-?\d+)/.exec(s.description);
        const factor = rep ? Number(rep[1]) * 10 ** Number(rep[2]) * 2 ** Number(rep[3]) : 1;
        assert.ok(Math.abs(f.value - raw * factor) < 1e-9 * Math.max(1, Math.abs(raw * factor)), `${name} scaled`);
      }
      // The encoder in the module agrees with this file's encoder.
      const values = {};
      for (const [name, raw] of Object.entries(expect)) if (raw != null) values[name] = raw;
      const extra = layout.fields[0].bits.flatMap((b) => b.bits).filter((b) => Math.floor(flags / 2 ** b) % 2 && !layout.fields.some((f) => f.presence?.bit === b));
      assert.deepEqual([...encode(layout, values, { Flags: extra })], [...bytes]);
    }
  });
}

/* ── Fixed FTMS vectors, written out from the structure ───────────────── */

test("Treadmill Data: bit 0 clear means Instantaneous Speed is there", () => {
  const d = decode(hex("00 00 E8 03"), L("0x2ACD"));
  assert.equal(val(d, "Instantaneous Speed").raw, 1000);
  assert.equal(val(d, "Instantaneous Speed").value, 10);
  assert.equal(val(d, "Instantaneous Speed").unit.id, "org.bluetooth.unit.velocity.kilometre_per_hour");
  assert.equal(val(d, "Average Speed").status, "absent");
  assert.equal(val(d, "Flags").bits.find((b) => b.label === "0").set, false);
});

test("Treadmill Data: More Data set drops the speed; Total Distance is a uint24", () => {
  const d = decode(hex("05 00 39 30 00"), L("0x2ACD"));
  assert.equal(val(d, "Instantaneous Speed").status, "absent");
  assert.equal(val(d, "Total Distance").raw, 12345);
  assert.deepEqual(d.errors, []);
});

test("Treadmill Data: Inclination and Ramp Angle Setting are signed tenths", () => {
  const d = decode(hex("08 00 E8 03 E7 FF 0A 00"), L("0x2ACD"));
  assert.equal(val(d, "Inclination").raw, -25);
  assert.equal(val(d, "Inclination").value, -2.5);
  assert.equal(val(d, "Ramp Angle Setting").value, 1);
});

test("Indoor Bike Data: speed, cadence in half-rpm, power", () => {
  const d = decode(hex("44 00 8C 0A B4 00 FA 00"), L("0x2AD2"));
  assert.equal(val(d, "Instantaneous Speed").value, 27);
  assert.equal(val(d, "Instantaneous Cadence").raw, 180);
  assert.equal(val(d, "Instantaneous Cadence").value, 90);
  assert.equal(val(d, "Instantaneous Power").value, 250);
  assert.equal(val(d, "Instantaneous Power").unit.id, "org.bluetooth.unit.power.watt");
});

test("Indoor Bike Data: Resistance Level carries both of the SIG's readings", () => {
  const d = decode(hex("20 00 00 00 07"), L("0x2AD2"));
  const r = val(d, "Resistance Level");
  assert.equal(r.raw, 7);
  assert.equal(r.scale.factor, 10);
  assert.equal(r.scale.unitIs, "Unit is 1");
  assert.equal(r.scale.conflict, true);
});

test("Rower Data: bit 0 clear gives Stroke Rate (half strokes) and Stroke Count", () => {
  const d = decode(hex("00 00 3C 2A 00"), L("0x2AD1"));
  assert.equal(val(d, "Stroke Rate").value, 30);
  assert.equal(val(d, "Stroke Count").raw, 42);
});

test("Cross Trainer Data: three-octet Flags with Movement Direction", () => {
  const d = decode(hex("00 81 00 E8 03 96 00"), L("0x2ACE"));
  assert.equal(val(d, "Flags").raw, 0x8100);
  assert.equal(val(d, "Instantaneous Speed").value, 10);
  assert.equal(val(d, "Instantaneous Power").value, 150);
  assert.equal(val(d, "Flags").bits.find((b) => b.label === "15").value, 1);
});

test("Supported Speed Range: three fixed fields, no flags", () => {
  const d = decode(hex("64 00 B0 04 0A 00"), L("0x2AD4"));
  assert.deepEqual(d.fields.map((f) => f.value), [1, 12, 0.1]);
});

test("Fitness Machine Feature and Status have no structure in the SIG's repository: raw only", () => {
  for (const u of ["0x2ACC", "0x2ADA", "0x2AD9", "0x2AD3"]) {
    const l = L(u);
    assert.equal(l.fields.length, 0, u);
    const d = decode(hex("01 02 03"), l);
    assert.ok(d.stopped);
    assert.deepEqual(d.spans, [{ start: 0, end: 3, field: -1, label: "No structure to decode against" }]);
  }
});

test("problems are reported, not thrown", () => {
  const short = decode(hex("44 00 8C"), L("0x2AD2"));
  assert.match(short.errors[0], /Instantaneous Speed is present and needs 2 octets/);
  assert.equal(val(short, "Instantaneous Cadence").status, "unknown");
  const long = decode(hex("00 00 E8 03 FF"), L("0x2ACD"));
  assert.equal(long.trailing, 1);
  const reserved = decode(hex("00 80 E8 03"), L("0x2ACD"));
  assert.match(reserved.errors.join(" "), /reserved bit 13–15 set/);
  assert.equal(decode(new Uint8Array(0), L("0x2ACD")).stopped, "the value ends inside Flags");
});

/* ── Cycling: CSC and Cycling Power ───────────────────────────────────── */

const CSC = () => L("0x2A5B");
const CP = () => L("0x2A63");

test("CSC Measurement: struct members come from the SIG's struct definitions", () => {
  const l = CSC();
  const wheel = l.fields.find((f) => f.name === "Wheel Revolution Data");
  assert.deepEqual(
    wheel.children.map((c) => [c.name, c.type, c.bitWidth, c.bitOffset]),
    [
      ["Cumulative Wheel Revolutions", "uint32", 32, 0],
      ["Last Wheel Event Time", "uint16", 16, 32],
    ],
  );
  assert.equal(wheel.children[1].scale.factor, 1 / 1024);
  assert.equal(l.fields.find((f) => f.name === "Crank Revolution Data").children[1].scale.factor, 1 / 1024);
});

test("CSC Measurement: cadence and speed from two notifications, across a wrap", () => {
  const l = CSC();
  // Wheel 1000 revs @ 0x0400, crank 0xFFFF revs @ 0xFC00 …
  const a = decode(hex("03 E8 03 00 00 00 04 FF FF 00 FC"), l);
  // … then wheel 1004 @ 0x0C00, crank 0x0001 @ 0x0400 (both crank counters wrapped).
  const b = decode(hex("03 EC 03 00 00 00 0C 01 00 00 04"), l);
  assert.deepEqual(a.errors, []);
  const crank = revolutionRate(val(a, "Crank Revolution Data"), val(b, "Crank Revolution Data"));
  assert.equal(crank.dRevs, 2);
  assert.equal(crank.dTicks, 0x0800);
  assert.equal(crank.dt, 2);
  assert.equal(crank.rpm, 60);
  const wheel = revolutionRate(val(a, "Wheel Revolution Data"), val(b, "Wheel Revolution Data"));
  assert.equal(wheel.dRevs, 4);
  assert.equal(wheel.dt, 2);
  assert.ok(Math.abs(wheelSpeedKmh(wheel, 2100) - 15.12) < 1e-9);
});

test("CSC Measurement: an unchanged event time is no new event, not zero cadence", () => {
  const l = CSC();
  const a = decode(hex("02 05 00 00 10"), l);
  const b = decode(hex("02 05 00 00 10"), l);
  const r = revolutionRate(val(a, "Crank Revolution Data"), val(b, "Crank Revolution Data"));
  assert.equal(r.rpm, null);
  assert.equal(r.reason, "no new event since the previous notification");
});

test("Cycling Power Measurement: wheel time is 1/2048 s here, crank time 1/1024 s", () => {
  const l = CP();
  const wheelDef = l.fields.find((f) => f.name === "Wheel Revolution Data");
  assert.equal(wheelDef.children[1].scale.factor, 1 / 2048);
  // Flags bits 4 and 5; power 200 W; wheel 10 revs @ 0; crank 20 revs @ 0.
  const a = decode(hex("30 00 C8 00 0A 00 00 00 00 00 14 00 00 00"), l);
  // Wheel 12 revs @ 2048 (1 s); crank 21 revs @ 1024 (1 s).
  const b = decode(hex("30 00 C8 00 0C 00 00 00 00 08 15 00 00 04"), l);
  assert.equal(val(a, "Instantaneous Power").value, 200);
  const w = revolutionRate(val(a, "Wheel Revolution Data"), val(b, "Wheel Revolution Data"));
  assert.equal(w.dt, 1);
  assert.equal(w.rpm, 120);
  const c = revolutionRate(val(a, "Crank Revolution Data"), val(b, "Crank Revolution Data"));
  assert.equal(c.dt, 1);
  assert.equal(c.rpm, 60);
});

test("Cycling Power Measurement: Instantaneous Power is signed and always present", () => {
  const d = decode(hex("00 00 FB FF"), CP());
  assert.equal(val(d, "Instantaneous Power").value, -5);
  assert.equal(val(d, "Instantaneous Power").presence, null);
});

test("Cycling Power Measurement: Pedal Power Balance in half percent, Accumulated Energy in kJ", () => {
  // Bits 0 and 11: balance 100 (50 %), energy 3 (3000 J).
  const d = decode(hex("01 08 64 00 64 03 00"), CP());
  assert.equal(val(d, "Pedal Power Balance").value, 50);
  assert.equal(val(d, "Accumulated Energy").raw, 3);
  assert.equal(val(d, "Accumulated Energy").value, 3000);
  assert.equal(val(d, "Accumulated Energy").scale.unitIs, "Unit is kilojoule");
});

test("Cycling Power Measurement: Extreme Angles decode as the SIG's own example says", () => {
  const def = byUuid("0x2A63").gss.definitions.find((d) => d.name === "Extreme Angles");
  const ex = /Maximum Angle is (0x[0-9A-F]+) and the Minimum Angle is (0x[0-9A-F]+), the field value is represented as (0x[0-9A-F]+)/.exec(def.description);
  assert.ok(ex, "the example sentence is in the SIG's text");
  const [, max, min, whole] = ex.map((x) => (x?.startsWith("0x") ? parseInt(x, 16) : x));
  const le = [whole % 256, (whole >> 8) % 256, whole >> 16];
  const d = decode(Uint8Array.from([0x00, 0x01, 0x00, 0x00, ...le]), CP());
  const f = val(d, "Extreme Angles");
  assert.equal(f.children.find((c) => c.name === "Maximum Angle").raw, max);
  assert.equal(f.children.find((c) => c.name === "Minimum Angle").raw, min);
  assert.deepEqual(d.errors, []);
});

test("wrapDelta handles the counters' wrap at their own width", () => {
  assert.equal(wrapDelta(0xfffe, 0x0001, 16), 3);
  assert.equal(wrapDelta(5, 5, 16), 0);
  assert.equal(wrapDelta(0xffffffff, 0, 32), 1);
});

/* ── The explorer's generic cases ─────────────────────────────────────── */

test("Weight Measurement: Time Stamp takes the Date Time structure it refers to", () => {
  const l = L("0x2A9D");
  const ts = l.fields.find((f) => f.name === "Time Stamp");
  assert.equal(ts.kind, "struct");
  assert.deepEqual(ts.children.map((c) => c.name), ["Year", "Month", "Day", "Hours", "Minutes", "Seconds"]);
  // Flags bit 1; weight raw 14000; 2026-11-05 07:30:00.
  const d = decode(hex("02 B0 36 EA 07 0B 05 07 1E 00"), l);
  // Its resolution depends on Flags bit 0 in prose, not a "Represented values"
  // line, so the decoder leaves it raw rather than pick one.
  assert.equal(val(d, "Weight").raw, 14000);
  assert.equal(val(d, "Weight").scale, null);
  // … and the SIG's sentence travels with the field instead.
  assert.match(l.fields.find((f) => f.name === "Weight").prose, /kilograms with resolution 0\.005 if the bit 0/);
  assert.deepEqual(val(d, "Time Stamp").children.map((c) => c.raw), [2026, 11, 5, 7, 30, 0]);
});

test("Sensor Location: a value table names the value", () => {
  const d = decode(hex("05"), L("0x2A5D"));
  assert.equal(d.fields[0].valueLabel, "Left Crank");
  assert.equal(decode(hex("20"), L("0x2A5D")).fields[0].valueLabel, "Reserved for Future Use");
});

test("medfloat16 stops the decoder rather than guessing", () => {
  const d = decode(hex("00 00 00 00 00 00 00"), L("0x2A35"));
  assert.match(d.stopped, /medfloat16/);
  assert.equal(d.fields[0].status, "present");
});

test("every layout without an unsupported field round-trips through encode and decode", () => {
  const pick = rng(7);
  let layouts = 0;
  for (const c of BT_CHARACTERISTICS) {
    const l = compileLayout(c, resolve);
    if (!l.fields.length || l.unsupported) continue;
    // Variable-length fields are exercised alone above; skip layouts whose
    // only variable field would need a later absent field to be readable.
    layouts++;
    for (let n = 0; n < 40; n++) {
      const flags = {};
      for (const f of l.fields) if (f.kind === "bits") flags[f.name] = Math.floor(pick() * 2 ** (f.width * 8));
      const values = {};
      for (const f of l.fields) {
        if (f.kind === "bits") continue;
        const on = f.presence ? Math.floor(flags[f.presence.field] / 2 ** f.presence.bit) % 2 === f.presence.value : true;
        if (!on) continue;
        const r = (bits, signed) => {
          const v = Math.floor(pick() * 2 ** bits);
          return signed && v >= 2 ** (bits - 1) ? v - 2 ** bits : v;
        };
        if (f.kind === "uint" || f.kind === "sint") values[f.name] = r(f.width * 8, f.kind === "sint");
        else if (f.kind === "struct") values[f.name] = Object.fromEntries(f.children.map((ch) => [ch.name, r(ch.bitWidth, ch.kind === "sint" && !f.packed)]));
        else if (f.kind === "array") values[f.name] = [r(f.width * 8, f.signed), r(f.width * 8, f.signed)];
        else if (f.kind === "utf8") values[f.name] = "Ada";
      }
      // Bits no field reads keep their random value; the rest follow the fields.
      const bytes = encode(l, { ...flags, ...values });
      const d = decode(bytes, l);
      // Two variable-length fields in one value (Cycling Power Vector's force
      // and torque arrays) cannot be split from the bytes: that must stop.
      const present = l.fields.filter((f) => f.name in values);
      const varAt = present.findIndex((f) => f.kind === "array" || f.kind === "utf8");
      if (varAt >= 0 && varAt < present.length - 1) {
        assert.match(d.stopped, /no stated length/, c.name);
        continue;
      }
      assert.equal(d.stopped, null, `${c.name}: ${d.stopped}`);
      assert.equal(d.trailing, 0, c.name);
      for (const [name, v] of Object.entries(values)) {
        const f = val(d, name);
        assert.equal(f.status, "present", `${c.name} ${name}`);
        if (f.children) assert.deepEqual(Object.fromEntries(f.children.map((ch) => [ch.name, ch.raw])), v, `${c.name} ${name}`);
        else assert.deepEqual(f.raw, v, `${c.name} ${name}`);
      }
    }
  }
  assert.ok(layouts >= 60, `only ${layouts} layouts`);
});
