"use client";

/**
 * The few Web Bluetooth members the BLE tools use, declared locally because
 * lib.dom has no Web Bluetooth types, plus support detection shared by
 * /tools/ftms-lab, /tools/cycling-power-lab and /tools/ble-gatt-explorer.
 *
 * Nothing here talks to a server. A device is reached only after the reader
 * picks it in the browser's own chooser.
 */
import { useEffect, useState } from "react";

export type GattProps = {
  read: boolean;
  write: boolean;
  writeWithoutResponse: boolean;
  notify: boolean;
  indicate: boolean;
};
export type GattChar = EventTarget & {
  uuid: string;
  value?: DataView;
  properties: GattProps;
  service?: GattService;
  readValue(): Promise<DataView>;
  startNotifications(): Promise<GattChar>;
  stopNotifications(): Promise<GattChar>;
};
export type GattService = {
  uuid: string;
  isPrimary?: boolean;
  getCharacteristic(uuid: number | string): Promise<GattChar>;
  getCharacteristics(): Promise<GattChar[]>;
};
export type GattServer = {
  connected: boolean;
  connect(): Promise<GattServer>;
  disconnect(): void;
  getPrimaryService(uuid: number | string): Promise<GattService>;
  getPrimaryServices(): Promise<GattService[]>;
};
export type BtDevice = EventTarget & { id?: string; name?: string; gatt?: GattServer };
export type RequestOptions =
  | { filters: { services: (string | number)[] }[]; optionalServices?: (string | number)[] }
  | { acceptAllDevices: true; optionalServices?: (string | number)[] };
export type WebBluetooth = {
  getAvailability?: () => Promise<boolean>;
  requestDevice(opts: RequestOptions): Promise<BtDevice>;
};

export type Support = "checking" | "ok" | "no-api" | "insecure" | "unavailable";

export function bluetooth(): WebBluetooth | null {
  if (typeof navigator === "undefined") return null;
  return (navigator as unknown as { bluetooth?: WebBluetooth }).bluetooth ?? null;
}

/** Whether this browser exposes Web Bluetooth and says an adapter is available. */
export function useBluetoothSupport(): Support {
  const [support, setSupport] = useState<Support>("checking");
  useEffect(() => {
    const bt = bluetooth();
    if (!bt) {
      setSupport(typeof window !== "undefined" && !window.isSecureContext ? "insecure" : "no-api");
      return;
    }
    if (!bt.getAvailability) {
      setSupport("ok");
      return;
    }
    bt.getAvailability()
      .then((ok) => setSupport(ok ? "ok" : "unavailable"))
      .catch(() => setSupport("ok"));
  }, []);
  return support;
}

/**
 * The 128-bit form of a 16-bit SIG alias, from the browser's own
 * BluetoothUUID.canonicalUUID (part of the Web Bluetooth API), so this site
 * hard-codes no base UUID. Null where the API is missing.
 */
export function canonical(alias: number): string | null {
  const g = globalThis as unknown as { BluetoothUUID?: { canonicalUUID(n: number): string } };
  try {
    return g.BluetoothUUID ? g.BluetoothUUID.canonicalUUID(alias).toLowerCase() : null;
  } catch {
    return null;
  }
}

/** A map from 128-bit UUID string to the 16-bit alias, for the aliases given. */
export function aliasMap(aliases: number[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const a of aliases) {
    const u = canonical(a);
    if (u) m.set(u, a);
  }
  return m;
}

export const bytesOf = (v: DataView) => new Uint8Array(v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength));

export const hex4 = (n: number) => `0x${n.toString(16).toUpperCase().padStart(4, "0")}`;

export function errorText(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  const name = (err as { name?: string })?.name;
  if (/cancel/i.test(msg) || name === "NotFoundError") return "No device chosen.";
  return `Could not connect: ${msg}`;
}

/** The sentence each tool shows above its Connect button. */
export function supportText(s: Support): string | null {
  switch (s) {
    case "no-api":
      return "This browser has no Web Bluetooth, so it cannot connect to a device. The paste box and the synthetic replay below still work.";
    case "insecure":
      return "Web Bluetooth needs a secure (https) page, and this one is not. The paste box and the synthetic replay below still work.";
    case "unavailable":
      return "The browser reports no Bluetooth adapter available (off, missing, or blocked by the system). The paste box and the synthetic replay below still work.";
    default:
      return null;
  }
}
