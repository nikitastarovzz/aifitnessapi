/**
 * Cluster 13 — AI motion & pose estimation (technical / decision). The tech
 * layer behind camera-based fitness: which pose model, 2D vs 3D, on-device vs
 * cloud inference, accuracy, and how rep-counting and form-scoring actually
 * work. Links to /guides (how to implement) and /learn (the basic concept)
 * rather than duplicating them. Reuses the shared cluster template; Article +
 * FAQPage (no `steps`, no HowTo).
 */
import { motionEntries } from "./motion.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const MOTION_PATH = "/motion";
export const MOTION_CONFIG = { basePath: MOTION_PATH, hubLabel: "AI Motion" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_MOTION = new Set<string>([
  "pose-estimation-models-compared",
  "2d-vs-3d-pose-estimation",
  "pose-estimation-accuracy",
  "multi-person-pose-tracking",
  "on-device-vs-cloud-pose-estimation",
  "real-time-pose-estimation",
  "pose-estimation-hardware-requirements",
  "how-rep-counting-works",
  "how-form-feedback-works",
  "build-vs-buy-ai-motion-tracking",
  "mediapipe-vs-movenet",
  "mediapipe-pose-landmarker-models",
  "apple-vision-body-pose",
]);

export const allMotion: ClusterEntry[] = motionEntries;

export function releasedMotion(): ClusterEntry[] {
  return allMotion.filter((e) => RELEASED_MOTION.has(e.slug));
}

export function getMotion(slug: string): ClusterEntry | undefined {
  return releasedMotion().find((e) => e.slug === slug);
}
