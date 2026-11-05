/**
 * ble-heart-rate-parser.mjs — decode a Bluetooth Heart Rate Measurement
 * (0x2A37) notification into beats per minute, sensor contact, energy and
 * RR intervals, refusing a malformed value instead of guessing.
 *
 * WHAT THIS IMPLEMENTS
 *   `parseHeartRateMeasurement(bytes)` for a Uint8Array, Buffer, DataView or
 *   ArrayBuffer — what Web Bluetooth's characteristicvaluechanged, a native
 *   BLE library or a captured log hands you. The layout is the Bluetooth
 *   SIG's GATT Specification Supplement structure, as the site's generated
 *   copy holds it (src/data/bluetoothGatt.ts):
 *     octet 0       Flags
 *       bit 0       0 = Heart Rate Value Format uint8, 1 = uint16
 *       bit 1       Sensor Contact detected
 *       bit 2       Sensor Contact Supported
 *       bit 3       Energy Expended present (uint16; SIG unit: joule)
 *       bit 4       RR-Interval present (uint16 each, "1/1024 second as the
 *                   unit"; as many as fit after the fields before them)
 *       bits 5-7    Reserved for Future Use
 *   Multi-octet fields are little-endian, as the Web Bluetooth
 *   specification's own heart-rate example reads them.
 *
 *   Sensor contact is three-valued on purpose: when bit 2 is clear the
 *   device does not report contact, which is not the same as "no contact".
 *   RR intervals come back raw and in milliseconds; HRV needs them, and a
 *   device that never sets bit 4 cannot give you HRV at all.
 *
 *   The Energy Expended value is returned raw with the SIG's unit (joule).
 *   The Web Bluetooth example's comment reads its 750 as "750kJ"; this file
 *   does not pick between the two, it reports what the structure says.
 *
 * PAGES THIS SUPPORTS
 *   https://aifitnessapi.com/tools/heart-rate-lab (the same structure, live)
 *   https://aifitnessapi.com/bluetooth-fitness
 *
 * No dependencies. Node 20+ or any browser.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

export const HEART_RATE_MEASUREMENT_UUID = 0x2a37;
export const RR_UNITS_PER_SECOND = 1024;

export class HeartRateParseError extends Error {
  constructor(message, bytes) {
    super(message);
    this.name = "HeartRateParseError";
    this.bytes = bytes;
  }
}

function asBytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  if (Array.isArray(input)) return Uint8Array.from(input);
  throw new TypeError("expected bytes: Uint8Array, Buffer, DataView, ArrayBuffer or number[]");
}

const u16 = (b, i) => b[i] | (b[i + 1] << 8);

/**
 * @returns {{ heartRate: number, format: "uint8"|"uint16",
 *            sensorContact: "detected"|"not detected"|"not supported",
 *            energyExpended: number|null, energyUnit: "joule (SIG unit)"|null,
 *            rrIntervals: number[], rrMs: number[], rrPresent: boolean,
 *            reservedBits: number[] }}
 */
export function parseHeartRateMeasurement(input) {
  const b = asBytes(input);
  if (b.length < 2) throw new HeartRateParseError(`a 0x2A37 value is at least 2 octets; got ${b.length}`, b);
  const flags = b[0];
  const hr16 = (flags & 0x01) !== 0;
  const contactDetected = (flags & 0x02) !== 0;
  const contactSupported = (flags & 0x04) !== 0;
  const energyPresent = (flags & 0x08) !== 0;
  const rrPresent = (flags & 0x10) !== 0;
  const reservedBits = [5, 6, 7].filter((bit) => (flags >> bit) & 1);

  let off = 1;
  const need = (n, what) => {
    if (off + n > b.length) throw new HeartRateParseError(`${what} is flagged present but the value ends at octet ${b.length}`, b);
  };
  need(hr16 ? 2 : 1, "the heart-rate value");
  const heartRate = hr16 ? u16(b, off) : b[off];
  off += hr16 ? 2 : 1;

  let energyExpended = null;
  if (energyPresent) {
    need(2, "Energy Expended");
    energyExpended = u16(b, off);
    off += 2;
  }

  const rrIntervals = [];
  if (rrPresent) {
    const remaining = b.length - off;
    if (remaining < 2) throw new HeartRateParseError("RR-Interval is flagged present but no RR octets follow", b);
    if (remaining % 2 !== 0) throw new HeartRateParseError("an odd number of octets follows: RR intervals are uint16", b);
    for (; off < b.length; off += 2) rrIntervals.push(u16(b, off));
  } else if (off !== b.length) {
    throw new HeartRateParseError(`${b.length - off} octet(s) left over after the fields the flags announce`, b);
  }

  return {
    heartRate,
    format: hr16 ? "uint16" : "uint8",
    sensorContact: contactSupported ? (contactDetected ? "detected" : "not detected") : "not supported",
    energyExpended,
    energyUnit: energyPresent ? "joule (SIG unit)" : null,
    rrIntervals,
    rrMs: rrIntervals.map((v) => (v * 1000) / RR_UNITS_PER_SECOND),
    rrPresent,
    reservedBits,
  };
}

/** Wire it to Web Bluetooth: `characteristic.addEventListener("characteristicvaluechanged", onHeartRate(cb))`. */
export function onHeartRate(callback, onError = () => {}) {
  return (event) => {
    try {
      callback(parseHeartRateMeasurement(event.target.value));
    } catch (err) {
      onError(err);
    }
  };
}
