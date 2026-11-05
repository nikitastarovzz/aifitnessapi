/**
 * The values the three BLE tool pages (/tools/ftms-lab,
 * /tools/cycling-power-lab, /tools/ble-gatt-explorer) state in their prose,
 * derived once from the compiled SIG layouts (src/lib/bleTools.ts) so the
 * page and its markdown mirror (src/lib/pageMirrors) read the same numbers.
 * A structure that no longer has what a page explains fails the build.
 */
import { explorerCharacteristics, explorerLayouts, layoutOf, scaleCheck, FTMS_RAW_UUIDS } from "@/lib/bleTools";
import { fmt, type GattLayout, type GattLayoutField } from "@/lib/gattDecode.mjs";

function must<T>(v: T | null | undefined, what: string): T {
  if (v == null) throw new Error(`bleLabFacts: the SIG structure no longer has ${what}, which a BLE tool page explains`);
  return v;
}

/* ── GattLayoutTable (src/components/tools/GattLayoutTable.tsx) ───────── */

/** Where a layout's own entry is on the Bluetooth GATT reference. */
export const gattLayoutHref = (l: GattLayout) => (l.hasPage ? `/bluetooth-fitness/${l.slug}` : `/bluetooth-fitness#char-${l.slug}`);

/** The "Present when" cell. */
export const gattPresenceText = (f: GattLayoutField) =>
  f.presence ? `bit ${f.presence.bit} of ${f.presence.field} is ${f.presence.value}` : f.sizeKind === "fixed" ? "always" : (f.presenceText ?? "—");

/** The struct members under a field's name. */
export const gattChildrenText = (f: GattLayoutField) =>
  f.children ? f.children.map((c) => `${c.name} (${c.type}${c.scale ? `, × ${fmt(c.scale.factor)}` : ""})`).join("; ") : null;

/** The summary's count. */
export const gattFieldCount = (l: GattLayout) => (l.fields.length ? `${l.fields.length} fields` : "no structure: shown raw");

/* ── /tools/ble-gatt-explorer ──────────────────────────────────────────── */

export function explorerDecodeGroups() {
  const layouts = explorerLayouts();
  const full = layouts.filter((l) => !l.unsupported);
  const partial = layouts.filter((l) => l.unsupported);
  const noStructure = explorerCharacteristics().filter((c) => !layouts.some((l) => l.uuid === c.uuid));
  /** A fully decoded layout links its reference entry; Battery Level, outside the dataset, links the heart-rate lab. */
  const fullHref = (l: GattLayout) => (l.hasPage ? gattLayoutHref(l) : l.slug === "battery-level" ? "/tools/heart-rate-lab" : gattLayoutHref(l));
  return { layouts, full, partial, noStructure, fullHref };
}

/* ── /tools/cycling-power-lab ──────────────────────────────────────────── */

export function cyclingFacts() {
  const CP = layoutOf("0x2A63");
  const CSC = layoutOf("0x2A5B");
  const revData = (l: GattLayout, name: string) => {
    const f = l.fields.find((x) => x.name === name);
    const revs = f?.children?.find((c) => /^Cumulative .* Revolutions$/.test(c.name));
    const time = f?.children?.find((c) => /^Last .* Event Time$/.test(c.name));
    if (!f?.presence || !revs || !time?.scale) throw new Error(`cycling-power-lab: ${l.name} ${name} lost its structure`);
    return { field: f, presence: f.presence, revs, time, scale: time.scale };
  };
  return {
    CP,
    CSC,
    CSC_WHEEL: revData(CSC, "Wheel Revolution Data"),
    CSC_CRANK: revData(CSC, "Crank Revolution Data"),
    CP_WHEEL: revData(CP, "Wheel Revolution Data"),
    CP_CRANK: revData(CP, "Crank Revolution Data"),
  };
}
export const tick = (f: number) => `1/${Math.round(1 / f)} s`;
export const wrapSeconds = (bits: number, f: number) => fmt(Number((2 ** bits * f).toFixed(3)));
export const bitsOf = (type: string) => Number(/(\d+)$/.exec(type)?.[1]);

/* ── /tools/ftms-lab ───────────────────────────────────────────────────── */

export function ftmsFacts(layouts: GattLayout[]) {
  const TREADMILL = layoutOf("0x2ACD");
  const BIKE = layoutOf("0x2AD2");
  const MORE_DATA = must(TREADMILL.fields[0].bits?.find((b) => b.bits.length === 1 && b.bits[0] === 0), "Treadmill Data Flags bit 0");
  const SPEED_FIELD = must(TREADMILL.fields.find((f) => f.name === "Instantaneous Speed"), "Treadmill Instantaneous Speed");
  const SPEED = { presence: must(SPEED_FIELD.presence, "a speed condition"), scale: must(SPEED_FIELD.scale, "a speed scale") };
  const RESISTANCE = { scale: must(BIKE.fields.find((f) => f.name === "Resistance Level")?.scale, "Indoor Bike Resistance Level") };
  const CADENCE = { scale: must(BIKE.fields.find((f) => f.name === "Instantaneous Cadence")?.scale, "Indoor Bike Instantaneous Cadence") };
  const SCALES = scaleCheck();
  const RESISTANCE_CONFLICTS = SCALES.conflicts.filter((c) => /Resistance Level|^Minimum Increment$/.test(c.name) && /^0x2A(CE|D1|D2|D6)$/.test(c.uuid)).length;
  const rawNames = FTMS_RAW_UUIDS.map((u) => must(layouts.find((l) => l.uuid === u), `the layout for ${u}`)).map((l) => `${l.name} (${l.uuid})`);
  return { TREADMILL, BIKE, MORE_DATA, SPEED, RESISTANCE, CADENCE, SCALES, RESISTANCE_CONFLICTS, rawNames };
}
