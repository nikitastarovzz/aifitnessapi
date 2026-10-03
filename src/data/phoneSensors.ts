import { phoneSensorsEntries } from "./phoneSensors.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

/**
 * Cluster — fitness features from the phone's own motion sensors, no wearable.
 *
 * WHY THIS CLUSTER EXISTS. Search Console shows that exact developer strings —
 * a class name, a sensor constant, a manifest attribute — reach page one for
 * this site when a page is genuinely about that string. The phone in a
 * pocket already counts steps, classifies walking versus driving, measures
 * climbs and, with AirPods in, tracks the head. Each of those is one API with
 * one set of documented rules and one set of traps, so each page here targets
 * exactly one string: CMPedometer, Sensor.TYPE_STEP_COUNTER,
 * foregroundServiceType="health", and so on.
 *
 * BOUNDARY RULES, because four neighbours answer adjacent questions:
 * - /data/step-counting-api owns "which API should give me steps" across
 *   providers. Pages here link to it and never re-rank sources.
 * - /guides/track-workouts-without-wearables owns the camera approach.
 * - /watch-apps owns building the app on the wrist. Watch facts appear here
 *   only where a phone-side API (CMHeadphoneMotionManager,
 *   CMBatchedSensorManager) is documented for watchOS.
 * - Health Connect records belong to the Health Connect pages. The Recording
 *   API page quotes Google's own Recording-API-versus-Health-Connect line and
 *   stops there.
 *
 * EVIDENCE RULES (ops/GEO.md):
 * - Every platform claim traces to Apple's Core Motion documentation JSON or
 *   Google's Android developer pages, fetched 2026-10-03. Introduced-at
 *   versions are copied from Apple's per-symbol platform metadata.
 * - Quote word for word or not at all; attribute in prose ("Apple says…").
 * - Where a source is silent, say so: no sample rates, latencies, battery
 *   figures or device lists that the platform does not publish. Where two
 *   first-party pages disagree (the health FGS prerequisite lists, the
 *   CMHeadphoneMotionManager watchOS story, CMBatchedSensorManager's iOS
 *   stamp), print both and say which we could not reconcile.
 * - developers.google.com was unreachable from the research environment, so
 *   nothing depends on the ActivityTransition or LocalRecordingClient
 *   reference pages.
 */
export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const SENSORS_PATH = "/phone-sensors";
export const SENSORS_CONFIG: ClusterConfig = {
  basePath: SENSORS_PATH,
  hubLabel: "Phone Sensors",
};

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_SENSORS = new Set<string>([
  "cmpedometer",
  "cmmotionactivitymanager",
  "cmaltimeter",
  "cmheadphonemotionmanager",
  "cmbatchedsensormanager",
  "android-step-counter-sensor",
  "android-activity-recognition-transition-api",
  "android-recording-api",
  "foreground-service-type-health",
  "android-16-body-sensors-health-permissions",
]);

export const allPhoneSensors: ClusterEntry[] = phoneSensorsEntries;

export function releasedPhoneSensors(): ClusterEntry[] {
  return allPhoneSensors.filter((e) => RELEASED_SENSORS.has(e.slug));
}

export function getPhoneSensor(slug: string): ClusterEntry | undefined {
  return releasedPhoneSensors().find((e) => e.slug === slug);
}
