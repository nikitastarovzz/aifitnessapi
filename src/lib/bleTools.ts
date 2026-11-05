/**
 * Server-side half of the three BLE tools (/tools/ftms-lab,
 * /tools/cycling-power-lab, /tools/ble-gatt-explorer).
 *
 * Every layout is compiled here from src/data/bluetoothGatt.ts (generated
 * from the Bluetooth SIG's public repository) by src/lib/gattDecode.mjs and
 * handed to the client components as JSON, so the 600 KB data module never
 * reaches the browser. The samples are synthetic: built by the same module's
 * encoder from field names the SIG's structure uses, labeled synthetic on the
 * pages, and never presented as a recording of a device. A field name the
 * structure does not have fails the build instead of silently vanishing from
 * a sample.
 */
import { BT_CHARACTERISTICS, BT_SERVICES, type BtCharacteristic } from "@/data/bluetoothGatt";
import { compileLayout, encode, readScale, toHex, type GattLayout } from "@/lib/gattDecode.mjs";
import { BATTERY_LEVEL } from "@/lib/hrMeasurement.mjs";

const byUuid = (u: string): BtCharacteristic => {
  const c = BT_CHARACTERISTICS.find((x) => x.uuid === u);
  if (!c) throw new Error(`bleTools: ${u} is not in src/data/bluetoothGatt.ts`);
  return c;
};
const resolve = (id: string) => BT_CHARACTERISTICS.find((x) => x.id === id) ?? null;

export const layoutOf = (u: string): GattLayout => compileLayout(byUuid(u), resolve);

export type Sample = { label: string; uuid: string; hex: string; note: string };

function sample(layout: GattLayout, label: string, note: string, values: Record<string, number | number[] | Record<string, number>>, extra: Record<string, number[]> = {}): Sample {
  for (const k of Object.keys(values)) {
    if (!layout.fields.some((f) => f.name === k)) throw new Error(`bleTools: ${layout.name} has no field "${k}" in the SIG's structure`);
  }
  return { label, uuid: layout.uuid, hex: toHex(encode(layout, values, extra)), note };
}

/**
 * Every "Represented values" line in the dataset checked against the "Unit is"
 * sentence beside it (the same check scripts/gatt-decode.test.mjs pins), so a
 * page can state the count instead of a number typed from memory.
 */
export function scaleCheck(): { checked: number; conflicts: { uuid: string; name: string }[] } {
  let checked = 0;
  const conflicts: { uuid: string; name: string }[] = [];
  const check = (uuid: string, name: string, text: string | null | undefined) => {
    const s = readScale(text);
    if (!s || s.unitIsFactor == null) return;
    checked++;
    if (s.conflict) conflicts.push({ uuid, name });
  };
  type Def = { name: string; rows: Record<string, string>[]; subfields: Def[] };
  for (const c of BT_CHARACTERISTICS) {
    for (const f of c.gss?.structure ?? []) check(c.uuid, f.name, f.description);
    const walk = (ds: Def[]) => ds.forEach((d) => (d.rows.forEach((r) => check(c.uuid, `${d.name} › ${r.field}`, r.description)), walk(d.subfields)));
    walk((c.gss?.definitions ?? []) as Def[]);
  }
  return { checked, conflicts };
}

/* ── FTMS ─────────────────────────────────────────────────────────────── */

export const FTMS_SERVICE = (() => {
  const s = BT_SERVICES.find((x) => x.id === "org.bluetooth.service.fitness_machine");
  if (!s) throw new Error("bleTools: Fitness Machine service missing from src/data/bluetoothGatt.ts");
  return s;
})();

/** The machine data characteristics the lab decodes (each has a gss structure). */
export const FTMS_DATA_UUIDS = ["0x2ACD", "0x2ACE", "0x2ACF", "0x2AD0", "0x2AD1", "0x2AD2"];
/** Read once on connect where present: the Supported … Range characteristics. */
export const FTMS_RANGE_UUIDS = ["0x2AD4", "0x2AD5", "0x2AD6", "0x2AD7", "0x2AD8"];
/** FTMS characteristics the SIG's public repository has no gss file for: shown raw. */
export const FTMS_RAW_UUIDS = ["0x2ACC", "0x2AD3", "0x2AD9", "0x2ADA"];

export function ftmsLayouts(): GattLayout[] {
  return [...FTMS_DATA_UUIDS, ...FTMS_RANGE_UUIDS, ...FTMS_RAW_UUIDS].map(layoutOf);
}

export function ftmsSamples(): Sample[] {
  const tm = layoutOf("0x2ACD");
  const ct = layoutOf("0x2ACE");
  const rw = layoutOf("0x2AD1");
  const ib = layoutOf("0x2AD2");
  const sr = layoutOf("0x2AD4");
  return [
    sample(tm, "Treadmill: speed, distance, incline, time", "Instantaneous Speed 1050 (×0.01 km/h), Total Distance 1234 m, Inclination 15 and Ramp Angle 9 (×0.1), Elapsed Time 600 s.", {
      "Instantaneous Speed": 1050,
      "Total Distance": 1234,
      Inclination: 15,
      "Ramp Angle Setting": 9,
      "Elapsed Time": 600,
    }),
    sample(tm, "Treadmill: More Data set (no speed in this packet)", "Bit 0 set means Instantaneous Speed is absent; this packet carries Total Distance and Heart Rate only.", {
      "Total Distance": 2500,
      "Heart Rate": 142,
    }),
    sample(ib, "Indoor bike: speed, cadence, power, heart rate", "Speed 2700 (27 km/h), Instantaneous Cadence 180 (×0.5 rpm), Instantaneous Power 250 W, Heart Rate 138.", {
      "Instantaneous Speed": 2700,
      "Instantaneous Cadence": 180,
      "Instantaneous Power": 250,
      "Heart Rate": 138,
    }),
    sample(ib, "Indoor bike: Resistance Level (the SIG's two readings)", "Resistance Level raw 7: the field says M = 1, d = 1 and also \"Unit is 1\"; the decoder shows both.", {
      "Instantaneous Speed": 0,
      "Resistance Level": 7,
    }),
    sample(rw, "Rower: stroke rate, count, distance, pace, power", "Stroke Rate 56 (×0.5 spm), Stroke Count 312, Total Distance 1500 m, Instantaneous Pace 120 s, Instantaneous Power 180 W.", {
      "Stroke Rate": 56,
      "Stroke Count": 312,
      "Total Distance": 1500,
      "Instantaneous Pace (Time per 500 meters)": 120,
      "Instantaneous Power": 180,
    }),
    sample(ct, "Cross trainer: three-octet Flags, moving backward", "Speed 850 (8.5 km/h), Steps Per Minute 120 with Average Step Rate 118, Instantaneous Power 150 W, Movement Direction bit (15) set.", {
      "Instantaneous Speed": 850,
      "Steps Per Minute": 120,
      "Average Step Rate": 118,
      "Instantaneous Power": 150,
    }, { Flags: [15] }),
    sample(sr, "Supported Speed Range (read once)", "Minimum 100, maximum 2000, increment 10 (each ×0.01 km/h).", {
      "Minimum Speed": 100,
      "Maximum Speed": 2000,
      "Minimum Increment": 10,
    }),
  ];
}

export type ReplayPacket = { tMs: number; uuid: string; hex: string };
export type Replay = { id: string; label: string; packets: ReplayPacket[] };

const wave = (t: number, period: number) => Math.sin((2 * Math.PI * t) / period);

/**
 * Synthetic two-minute sessions, one packet a second (plus a split packet
 * every fifth second on the treadmill, to show More Data). The numbers are
 * made up; the field names and flags come from the SIG's structure through
 * `sample`, so a renamed field fails the build.
 */
export function ftmsReplays(seconds = 120): Replay[] {
  const tm = layoutOf("0x2ACD");
  const ib = layoutOf("0x2AD2");
  const rw = layoutOf("0x2AD1");
  const ct = layoutOf("0x2ACE");
  const hexOf = (l: GattLayout, v: Record<string, number>, extra: Record<string, number[]> = {}) => sample(l, "replay", "", v, extra).hex;
  const out: Replay[] = [
    { id: "treadmill", label: "Treadmill", packets: [] },
    { id: "bike", label: "Indoor bike", packets: [] },
    { id: "rower", label: "Rower", packets: [] },
    { id: "cross-trainer", label: "Cross trainer", packets: [] },
  ];
  let dist = 0;
  let bikeDist = 0;
  let strokes = 0;
  let rowDist = 0;
  let ctDist = 0;
  for (let s = 0; s < seconds; s++) {
    const tMs = s * 1000;
    const speed = Math.round(800 + (400 * s) / seconds + 30 * wave(s, 17)); // 0.01 km/h
    dist += (speed / 100) / 3.6;
    out[0].packets.push({
      tMs,
      uuid: tm.uuid,
      hex: hexOf(tm, { "Instantaneous Speed": speed, "Total Distance": Math.round(dist), Inclination: s < 60 ? 10 : 25, "Ramp Angle Setting": s < 60 ? 6 : 14, "Elapsed Time": s }),
    });
    if (s % 5 === 4) out[0].packets.push({ tMs: tMs + 500, uuid: tm.uuid, hex: hexOf(tm, { "Heart Rate": Math.round(120 + (30 * s) / seconds), "Elapsed Time": s }) });

    const cadence = Math.round(2 * (88 + 5 * wave(s, 13))); // 0.5 rpm
    const power = Math.round(220 + 35 * wave(s, 23));
    const bikeSpeed = Math.round(2600 + 200 * wave(s, 23));
    bikeDist += (bikeSpeed / 100) / 3.6;
    out[1].packets.push({
      tMs,
      uuid: ib.uuid,
      hex: hexOf(ib, { "Instantaneous Speed": bikeSpeed, "Instantaneous Cadence": cadence, "Total Distance": Math.round(bikeDist), "Instantaneous Power": power, "Elapsed Time": s }),
    });

    const rate = Math.round(2 * (27 + 2 * wave(s, 19))); // 0.5 spm
    strokes += rate / 2 / 60;
    rowDist += 4.1;
    out[2].packets.push({
      tMs,
      uuid: rw.uuid,
      hex: hexOf(rw, { "Stroke Rate": rate, "Stroke Count": Math.floor(strokes), "Total Distance": Math.round(rowDist), "Instantaneous Pace (Time per 500 meters)": Math.round(500 / 4.1), "Instantaneous Power": Math.round(170 + 20 * wave(s, 19)) }),
    });

    const ctSpeed = Math.round(850 + 60 * wave(s, 29));
    ctDist += (ctSpeed / 100) / 3.6;
    out[3].packets.push({
      tMs,
      uuid: ct.uuid,
      hex: hexOf(ct, { "Instantaneous Speed": ctSpeed, "Total Distance": Math.round(ctDist), "Steps Per Minute": 120, "Average Step Rate": 118, "Instantaneous Power": Math.round(150 + 15 * wave(s, 11)) }, s >= 90 ? { Flags: [15] } : {}),
    });
  }
  return out;
}

/* ── Cycling power and speed/cadence ──────────────────────────────────── */

export const CYCLING_SERVICES = ["org.bluetooth.service.cycling_power", "org.bluetooth.service.cycling_speed_and_cadence"].map((id) => {
  const s = BT_SERVICES.find((x) => x.id === id);
  if (!s) throw new Error(`bleTools: ${id} missing from src/data/bluetoothGatt.ts`);
  return s;
});
export const CYCLING_MEASUREMENT_UUIDS = ["0x2A63", "0x2A5B"];
/** Read once on connect where present. */
export const CYCLING_READ_UUIDS = ["0x2A65", "0x2A5C", "0x2A5D"];

export function cyclingLayouts(): GattLayout[] {
  return [...CYCLING_MEASUREMENT_UUIDS, ...CYCLING_READ_UUIDS].map(layoutOf);
}

/** Pairs of notifications, so the delta arithmetic has something to work on. */
export function cyclingSamplePairs(): { label: string; uuid: string; prev: string; cur: string; note: string }[] {
  const csc = layoutOf("0x2A5B");
  const cp = layoutOf("0x2A63");
  const pair = (layout: GattLayout, label: string, note: string, a: Record<string, number | Record<string, number>>, b: Record<string, number | Record<string, number>>) => ({
    label,
    uuid: layout.uuid,
    prev: sample(layout, label, note, a).hex,
    cur: sample(layout, label, note, b).hex,
    note,
  });
  return [
    pair(
      csc,
      "CSC: wheel and crank, crank counters wrap",
      "Crank revolutions go 65535 → 1 and the crank event time 0xFC00 → 0x0400: both uint16 counters wrapped, and the step is still 2 revolutions in 2048 ticks.",
      { "Wheel Revolution Data": { "Cumulative Wheel Revolutions": 1000, "Last Wheel Event Time": 0x0400 }, "Crank Revolution Data": { "Cumulative Crank Revolutions": 0xffff, "Last Crank Event Time": 0xfc00 } },
      { "Wheel Revolution Data": { "Cumulative Wheel Revolutions": 1004, "Last Wheel Event Time": 0x0c00 }, "Crank Revolution Data": { "Cumulative Crank Revolutions": 1, "Last Crank Event Time": 0x0400 } },
    ),
    pair(
      csc,
      "CSC: crank only, no new event",
      "The same crank count and event time twice: no revolution happened between the two notifications, so there is no new cadence, rather than a cadence of zero.",
      { "Crank Revolution Data": { "Cumulative Crank Revolutions": 5, "Last Crank Event Time": 0x1000 } },
      { "Crank Revolution Data": { "Cumulative Crank Revolutions": 5, "Last Crank Event Time": 0x1000 } },
    ),
    pair(
      cp,
      "Cycling Power: power with wheel and crank data",
      "Instantaneous Power 200 W; wheel 10 → 12 revolutions over 2048 ticks, crank 20 → 21 over 1024 ticks. The structure gives this wheel's event time a different tick from the crank's.",
      { "Instantaneous Power": 200, "Wheel Revolution Data": { "Cumulative Wheel Revolutions": 10, "Last Wheel Event Time": 0 }, "Crank Revolution Data": { "Cumulative Crank Revolutions": 20, "Last Crank Event Time": 0 } },
      { "Instantaneous Power": 200, "Wheel Revolution Data": { "Cumulative Wheel Revolutions": 12, "Last Wheel Event Time": 2048 }, "Crank Revolution Data": { "Cumulative Crank Revolutions": 21, "Last Crank Event Time": 1024 } },
    ),
    pair(
      cp,
      "Cycling Power: balance, torque, energy",
      "Pedal Power Balance 100 (×0.5 %), Accumulated Torque 640 (×1/32 N·m), Accumulated Energy 3 (×1000 J); crank data as the cadence source.",
      { "Instantaneous Power": 180, "Pedal Power Balance": 100, "Accumulated Torque": 640, "Crank Revolution Data": { "Cumulative Crank Revolutions": 300, "Last Crank Event Time": 60000 }, "Accumulated Energy": 3 },
      { "Instantaneous Power": 185, "Pedal Power Balance": 98, "Accumulated Torque": 700, "Crank Revolution Data": { "Cumulative Crank Revolutions": 301, "Last Crank Event Time": 60000 + 683 }, "Accumulated Energy": 3 },
    ),
  ];
}

/**
 * A synthetic three-minute ride from both sensor kinds: a CSC sensor and a
 * power meter, each sending once a second with the event times their own
 * structures give (CSC 1/1024 s for both counters, Cycling Power 1/2048 s
 * for the wheel), so the uint16 event times wrap during the ride. Seconds
 * 100–109 are a coast: the crank event time stops moving.
 */
export function cyclingReplay(seconds = 180, circumferenceMm = 2100): Replay {
  const csc = layoutOf("0x2A5B");
  const cp = layoutOf("0x2A63");
  const tick = (l: GattLayout, field: string) => {
    const f = l.fields.find((x) => x.name === field);
    const ch = f?.children?.find((c) => /Event Time$/.test(c.name));
    if (!ch?.scale) throw new Error(`bleTools: ${l.name} ${field} has no event-time scale`);
    return ch.scale.factor;
  };
  const cscWheelTick = tick(csc, "Wheel Revolution Data");
  const cscCrankTick = tick(csc, "Crank Revolution Data");
  const cpWheelTick = tick(cp, "Wheel Revolution Data");
  const cpCrankTick = tick(cp, "Crank Revolution Data");
  const packets: ReplayPacket[] = [];
  let wheelRevs = 0;
  let crankRevs = 0;
  let lastCrankT = 0;
  let lastWheelT = 0;
  for (let s = 1; s <= seconds; s++) {
    const coasting = s >= 100 && s < 110;
    const kmh = coasting ? 30 - (s - 100) : 30 + 4 * wave(s, 31);
    const rpm = 88 + 6 * wave(s, 17);
    // Whole revolutions this second and the time of the last one.
    const wheelPerSec = kmh / 3.6 / (circumferenceMm / 1000);
    const newWheel = Math.floor(wheelRevs + wheelPerSec) - Math.floor(wheelRevs);
    wheelRevs += wheelPerSec;
    if (newWheel > 0) lastWheelT = s - (wheelRevs % 1) / wheelPerSec;
    if (!coasting) {
      const before = Math.floor(crankRevs);
      crankRevs += rpm / 60;
      if (Math.floor(crankRevs) > before) lastCrankT = s - (crankRevs % 1) / (rpm / 60);
    }
    const watts = coasting ? 0 : Math.round(230 + 40 * wave(s, 23));
    const ev = (t: number, k: number) => Math.round(t / k) % 65536;
    packets.push({
      tMs: s * 1000,
      uuid: csc.uuid,
      hex: sample(csc, "replay", "", {
        "Wheel Revolution Data": { "Cumulative Wheel Revolutions": Math.floor(wheelRevs), "Last Wheel Event Time": ev(lastWheelT, cscWheelTick) },
        "Crank Revolution Data": { "Cumulative Crank Revolutions": Math.floor(crankRevs) % 65536, "Last Crank Event Time": ev(lastCrankT, cscCrankTick) },
      }).hex,
    });
    packets.push({
      tMs: s * 1000 + 250,
      uuid: cp.uuid,
      hex: sample(cp, "replay", "", {
        "Instantaneous Power": watts,
        "Wheel Revolution Data": { "Cumulative Wheel Revolutions": Math.floor(wheelRevs), "Last Wheel Event Time": ev(lastWheelT, cpWheelTick) },
        "Crank Revolution Data": { "Cumulative Crank Revolutions": Math.floor(crankRevs) % 65536, "Last Crank Event Time": ev(lastCrankT, cpCrankTick) },
      }).hex,
    });
  }
  return { id: "ride", label: "Synthetic ride", packets };
}

/* ── The explorer ─────────────────────────────────────────────────────── */

export type NamedUuid = { uuid: string; uuidNumber: number; name: string; id: string; href: string | null };

/**
 * The services the explorer asks the browser for. Web Bluetooth lets a page
 * use only services it named in optionalServices, so these are every service
 * in this site's Bluetooth dataset plus Battery (read from the SIG's file for
 * /tools/heart-rate-lab). The reader can add any other UUID on the page.
 */
export function explorerServices(): NamedUuid[] {
  const fromData = BT_SERVICES.map((s) => ({ uuid: s.uuid, uuidNumber: parseInt(s.uuid, 16), name: s.name, id: s.id, href: null }));
  const battery = {
    uuid: `0x${BATTERY_LEVEL.serviceUuid.toString(16).toUpperCase()}`,
    uuidNumber: BATTERY_LEVEL.serviceUuid,
    name: BATTERY_LEVEL.serviceName,
    id: BATTERY_LEVEL.serviceId,
    href: null,
  };
  return [...fromData, battery].sort((a, b) => a.uuidNumber - b.uuidNumber);
}

export function explorerCharacteristics(): NamedUuid[] {
  const fromData = BT_CHARACTERISTICS.map((c) => ({
    uuid: c.uuid,
    uuidNumber: parseInt(c.uuid, 16),
    name: c.name,
    id: c.id,
    href: c.hasPage ? `/bluetooth-fitness/${c.slug}` : `/bluetooth-fitness#char-${c.slug}`,
  }));
  const battery = {
    uuid: `0x${BATTERY_LEVEL.uuid.toString(16).toUpperCase()}`,
    uuidNumber: BATTERY_LEVEL.uuid,
    name: BATTERY_LEVEL.name,
    id: BATTERY_LEVEL.id,
    href: null,
  };
  return [...fromData, battery].sort((a, b) => a.uuidNumber - b.uuidNumber);
}

/**
 * Battery Level, outside the generated dataset, as a one-field structure
 * built from the SIG's own gss file as /tools/heart-rate-lab records it
 * (BATTERY_LEVEL in src/lib/hrMeasurement.mjs: type, size, unit and lines,
 * read 2026-10-31 at the dataset's commit).
 */
function batteryLayout(): GattLayout {
  return compileLayout({
    uuid: `0x${BATTERY_LEVEL.uuid.toString(16).toUpperCase()}`,
    id: BATTERY_LEVEL.id,
    name: BATTERY_LEVEL.name,
    slug: "battery-level",
    hasPage: false,
    gss: {
      file: BATTERY_LEVEL.file,
      description: "",
      structure: [
        {
          name: BATTERY_LEVEL.name,
          anchor: "battery-level",
          type: BATTERY_LEVEL.type,
          size: String(BATTERY_LEVEL.size),
          sizeKind: "fixed",
          sizeN: BATTERY_LEVEL.size,
          description: BATTERY_LEVEL.lines.join("\n"),
          units: [{ id: BATTERY_LEVEL.unitId, name: "percentage", evidence: BATTERY_LEVEL.lines[0] }],
          presenceText: null,
          presence: null,
          offset: 0,
          offsetVariesWith: [],
        },
      ],
      definitions: [],
      flagsFields: [],
      unresolvedRefs: [],
    },
  });
}

/** Every characteristic in the dataset with a gss structure, compiled, plus Battery Level. Served as JSON to the explorer. */
export function explorerLayouts(): GattLayout[] {
  return [...BT_CHARACTERISTICS.filter((c) => c.gss?.structure?.length).map((c) => compileLayout(c, resolve)), batteryLayout()].sort(
    (a, b) => a.uuidNumber - b.uuidNumber,
  );
}

export const EXPLORER_LAYOUTS_PATH = "/tools/ble-gatt-explorer/layouts.json";
