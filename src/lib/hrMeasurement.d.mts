export type HrmUnit = { id: string; name: string | null; evidence: string };
export type HrmPresence = { bit: number; value: number; evidence: string };
export type HrmFieldKind = "hr" | "energy" | "rr" | "other";

export type HrmLayoutField = {
  name: string;
  anchor: string;
  type: string;
  size: string;
  width: number;
  repeated: boolean;
  kind: HrmFieldKind;
  presence: HrmPresence;
  unit: HrmUnit | null;
  scale: { divisor: number; label: string; evidence: string } | null;
  countRule: string | null;
};

export type HrmLayout = {
  uuid: string;
  uuidNumber: number;
  id: string;
  name: string;
  file: string;
  flagsName: string;
  flagsAnchor: string;
  bits: { bits: number[]; label: string; description: string; reserved: boolean }[];
  contactDetectedBit: number | null;
  contactSupportedBit: number | null;
  fields: HrmLayoutField[];
  byteOrder: "little-endian";
};

export type BslLayout = {
  uuid: string;
  uuidNumber: number;
  name: string;
  rows: { from: number; to: number; value: string; description: string }[];
};

export type SensorContact = "detected" | "not detected" | "not supported" | "unknown";
export type SpanKind = "flags" | HrmFieldKind | "trailing";

export type HrmDecoded = {
  length: number;
  hex: string;
  flags: number | null;
  bits: { label: string; description: string; reserved: boolean; values: number[] }[];
  reservedSet: number[];
  fields: {
    name: string;
    anchor: string;
    type: string;
    kind: HrmFieldKind;
    unit: HrmUnit | null;
    presence: HrmPresence;
    present: boolean;
    offset: number | null;
    length: number;
    value: number | null;
    values: number[] | null;
  }[];
  spans: { start: number; end: number; kind: SpanKind; label: string }[];
  heartRate: number | null;
  hrFormat: string | null;
  energyExpended: number | null;
  rr: number[];
  rrMs: number[];
  rrPresent: boolean;
  sensorContact: SensorContact;
  trailing: number;
  errors: string[];
};

type Bytes = Uint8Array | DataView | ArrayBuffer | number[];

export const BYTE_ORDER_SOURCE: { url: string; readFrom: string; fetchedOn: string; quote: string; energyComment: string };
export const BATTERY_LEVEL: {
  serviceUuid: number;
  serviceName: string;
  serviceId: string;
  uuid: number;
  name: string;
  id: string;
  type: string;
  size: number;
  unitId: string;
  lines: string[];
  min: number;
  max: number;
  file: string;
  fetchedOn: string;
};
export const SYNTHETIC_PHASES: { from: number; to: number; note: string; hr16: boolean; contact: SensorContact; energy: boolean; rr: boolean }[];

// The characteristic records come from src/data/bluetoothGatt.ts.
export function compileHrmLayout(c: unknown): HrmLayout;
export function compileBodySensorLocation(c: unknown): BslLayout;
export function decodeBodySensorLocation(input: Bytes, bsl: BslLayout): { value: number | null; description: string | null; error: string | null };
export function decodeBatteryLevel(input: Bytes): { value: number | null; inRange: boolean; error: string | null };
export function toBytes(input: Bytes): Uint8Array;
export function toHex(input: Bytes, sep?: string): string;
export function parseHex(text: string): Uint8Array | null;
export function decodeHrm(input: Bytes, layout: HrmLayout): HrmDecoded;
export function encodeHrm(
  layout: HrmLayout,
  opts: { heartRate: number; hr16?: boolean; contact?: SensorContact; energyExpended?: number | null; rr?: number[] | null; reservedBits?: number[] },
): Uint8Array;
export function rmssd(runs: number[][]): { value: number; differences: number } | null;
export function syntheticSession(layout: HrmLayout, opts?: { seconds?: number; seed?: number }): { tMs: number; bytes: Uint8Array; note: string }[];
export function sessionCsv(rows: { tMs: number; at: string; source: string; bytes: Uint8Array }[], layout: HrmLayout): string;
