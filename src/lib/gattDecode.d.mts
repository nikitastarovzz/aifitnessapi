export { BYTE_ORDER_SOURCE, parseHex, toBytes, toHex } from "./hrMeasurement.mjs";

export type GattUnit = { id: string; label: string | null; evidence: string };
export type GattScale = {
  M: number;
  d: number;
  b: number;
  factor: number;
  evidence: string;
  unitIs: string | null;
  unitIsFactor: number | null;
  conflict: boolean;
};
export type GattPresence = { field: string; bit: number; value: number; evidence: string };
export type GattBitRow = { bits: number[]; label: string; description: string; reserved: boolean };
export type GattValueRow = { from: number; to: number; value: string; description: string };
export type GattChild = {
  name: string;
  anchor: string;
  type: string;
  kind: "uint" | "sint" | "bits";
  bitWidth: number;
  bitOffset: number;
  unit: GattUnit | null;
  scale: GattScale | null;
};
export type GattFieldKind = "bits" | "uint" | "sint" | "array" | "utf8" | "struct" | "unsupported";
export type GattLayoutField = {
  name: string;
  anchor: string;
  type: string;
  size: string;
  sizeKind: "fixed" | "optional" | "variable";
  kind: GattFieldKind;
  width: number | null;
  signed?: boolean;
  presence: GattPresence | null;
  presenceText: string | null;
  unit: GattUnit | null;
  scale: GattScale | null;
  bits: GattBitRow[] | null;
  values: GattValueRow[] | null;
  children: GattChild[] | null;
  packed: boolean;
  structNote: string | null;
  prose: string | null;
  reason: string | null;
};
export type GattLayout = {
  uuid: string;
  uuidNumber: number;
  id: string;
  name: string;
  slug: string;
  hasPage: boolean;
  file: string | null;
  byteOrder: "little-endian";
  fields: GattLayoutField[];
  unsupported: string | null;
};

export type GattDecodedBit = { label: string; description: string; reserved: boolean; values: number[]; value: number; set: boolean };
export type GattDecodedChild = {
  name: string;
  anchor: string;
  type: string;
  raw: number;
  value: number;
  unit: GattUnit | null;
  scale: GattScale | null;
  display: string;
};
export type GattDecodedField = {
  name: string;
  anchor: string;
  type: string;
  unit: GattUnit | null;
  scale: GattScale | null;
  presence: GattPresence | null;
  status: "present" | "absent" | "unknown";
  offset: number | null;
  length: number;
  raw: number | number[] | string | null;
  value: number | number[] | string | null;
  display: string | null;
  bits: GattDecodedBit[] | null;
  children: GattDecodedChild[] | null;
  valueLabel: string | null;
  note: string | null;
};
export type GattSpan = { start: number; end: number; field: number; label: string };
export type GattDecoded = {
  hex: string;
  length: number;
  fields: GattDecodedField[];
  spans: GattSpan[];
  errors: string[];
  trailing: number;
  stopped: string | null;
};
export type RevolutionRate = { dRevs: number; dTicks: number; dt: number; tick: number; rpm: number | null; reason: string | null };

type BtRecordLike = { uuid: string; id: string; name: string; slug: string; hasPage?: boolean; gss: unknown };

export function unitIsFactor(line: string | null): number | null;
export function readScale(text: string | null | undefined): GattScale | null;
export function compileLayout(c: BtRecordLike, resolve?: ((id: string) => BtRecordLike | undefined | null) | null): GattLayout;
export function fmt(n: number | null | undefined): string;
export function decode(input: Uint8Array | DataView | ArrayBuffer | number[], layout: GattLayout): GattDecoded;
export function fieldOf(decoded: GattDecoded, name: string): GattDecodedField | null;
export function encode(
  layout: GattLayout,
  values: Record<string, number | number[] | string | Record<string, number>>,
  extraBits?: Record<string, number[]>,
): Uint8Array;
export function wrapDelta(prev: number, cur: number, bits: number): number;
export function revolutionRate(prevField: GattDecodedField | null, curField: GattDecodedField | null): RevolutionRate | null;
export function wheelSpeedKmh(rate: RevolutionRate | null, circumferenceMm: number): number | null;
export function wheelDistanceM(dRevs: number, circumferenceMm: number): number;
