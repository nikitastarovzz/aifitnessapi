import Link from "next/link";
import CameraAngleSimulator from "@/components/CameraAngleSimulator";
import { POSE_SCHEMES } from "@/data/poseKeypoints";
import { schemePath } from "@/data/poseKeypointPages";
import { EXERCISES as COUNTER_EXERCISES } from "@/lib/repCounter.mjs";
import { EXERCISES, KEYPOINTS, THRESHOLDS } from "@/lib/cameraAngleSim.mjs";

/**
 * "Camera-angle simulator" on /guides/improve-pose-detection-accuracy, the
 * page whose step 2 and FAQ answer where to put the camera. Geometry only:
 * src/lib/cameraAngleSim.mjs draws a stick figure and a pinhole phone and
 * reports self-occlusion and foreshortening; it says nothing about how any
 * pose model behaves, and the section says so.
 *
 * The keypoints are COCO 17, held to the generated keypoint dataset here:
 * a renamed or reordered point fails the build instead of labeling the wrong
 * joint. The squat counter line uses the /challenge counter's thresholds
 * (src/lib/repCounter.mjs), which are Sousa and colleagues' example defaults
 * as quoted on /motion/squat-detection-pose-estimation.
 *
 * English only: ClusterPage renders it behind `!tr`, outside the entry body,
 * so it does not move any translation hash.
 */

export const CAMERA_SIM_PATH = "/guides/improve-pose-detection-accuracy";

const COCO = POSE_SCHEMES.find((s) => s.slug === "coco-17");
if (!COCO) throw new Error("camera-angle simulator: coco-17 missing from the keypoint dataset");
KEYPOINTS.forEach((key: string, i: number) => {
  const p = COCO.points[i];
  if (!p || p.key !== key || p.index !== i) {
    throw new Error(`camera-angle simulator: COCO 17 point ${i} is ${p?.key ?? "absent"} in the dataset, not ${key}`);
  }
});
const NAMES = Object.fromEntries(COCO.points.map((p) => [p.key, { index: p.index as number, name: p.name }]));

const SQUAT = COUNTER_EXERCISES.squat;
const COUNTER = { top: SQUAT.rest.above as number, bottom: SQUAT.active.below as number, exercise: "squat" };

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const labels = Object.values(EXERCISES).map((e) => e.label.toLowerCase());
const exerciseList = `${labels.slice(0, -1).join(", ")} or ${labels[labels.length - 1]}`;

export default function CameraAngleSection({ path }: { path: string }) {
  if (path !== CAMERA_SIM_PATH) return null;
  return (
    <section id="camera-angle-simulator" data-camera-angle-simulator className="mt-12 scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Camera-angle simulator: what the phone sees</h2>
      <p className="mt-3 leading-relaxed text-[var(--muted)]">
        Step 2 says to match the camera to the plane of motion. This simulator shows why with geometry alone. A
        stick figure with the {KEYPOINTS.length}{" "}
        <Link href={schemePath(COCO!)} className={linkCls}>
          COCO keypoints
        </Link>{" "}
        does a scripted {exerciseList}, and you move a virtual phone around it to see the picture the phone gets.
        A keypoint whose line of sight passes through the figure&rsquo;s own body is ringed in red, and the angle a
        rep counter for that exercise reads (the knee or the elbow) is compared with the true 3D angle: when the
        picture is more than {THRESHOLDS.FORESHORTEN_DEG}&deg; off, it is flagged as foreshortened.
      </p>
      <CameraAngleSimulator names={NAMES} counter={COUNTER} />
      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
        This is geometry, not a model benchmark. The figure&rsquo;s proportions and movements are this page&rsquo;s
        drawing, the phone is an ideal pinhole camera, and nothing here says how MediaPipe, MoveNet or any other
        model treats a hidden joint: a model may still place one it cannot see, or lose one this drawing shows. The
        squat&rsquo;s counter line uses {COUNTER.top}&deg; and {COUNTER.bottom}&deg;, the example knee-angle defaults
        that{" "}
        <Link href="/motion/squat-detection-pose-estimation" className={linkCls}>
          squat detection with pose estimation
        </Link>{" "}
        quotes from Sousa and colleagues, who mark them as adjustable; that page also has repetition counts
        measured on people filmed from different phone positions. To time real models on your own device, use{" "}
        <Link href="/tools/pose-benchmark" className={linkCls}>
          the pose benchmark
        </Link>
        .
      </p>
    </section>
  );
}
