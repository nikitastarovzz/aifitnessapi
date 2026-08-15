/**
 * Cluster 18 — connected fitness devices. The live-hardware layer: /integrate
 * covers cloud APIs and on-device stores, /motion covers the camera — this
 * cluster covers the strap, the machine, the sensor, and the watch as a live
 * data source, over the protocols they actually speak (BLE GATT, FTMS).
 *
 * Boundary rule: every page is anchored in a device or protocol a builder
 * pairs live, and spec-level identifiers (service/characteristic UUIDs) are
 * quoted only where verified against the Bluetooth SIG's published assigned
 * numbers. Byte-level packet formats stay out — we link the spec by name
 * instead of paraphrasing what we have not read.
 */
import { devicesEntries } from "./devices.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const DEVICES_PATH = "/devices";
export const DEVICES_CONFIG: ClusterConfig = { basePath: DEVICES_PATH, hubLabel: "Connected Devices" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_DEVICES = new Set<string>([
  "bluetooth-heart-rate-monitor",
  "cycling-sensors-power-cadence",
  "ftms-fitness-machine-service",
  "treadmill-app-integration",
  "indoor-bike-trainer-integration",
  "rowing-machine-data",
  "apple-watch-live-heart-rate",
  "wear-os-health-services",
  "ant-plus-vs-bluetooth",
  "web-bluetooth-fitness",
  "ios-ble-fitness-devices",
  "testing-ble-fitness-devices",
]);

export const allDevices: ClusterEntry[] = devicesEntries;

export function releasedDevices(): ClusterEntry[] {
  return allDevices.filter((e) => RELEASED_DEVICES.has(e.slug));
}

export function getDevice(slug: string): ClusterEntry | undefined {
  return releasedDevices().find((e) => e.slug === slug);
}
