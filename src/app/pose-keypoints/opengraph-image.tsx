import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { POSE_KEYPOINTS_FETCHED_ON } from "@/data/poseKeypoints";
import { hubTotals } from "@/data/poseKeypointPages";

/** The counts and date are read from the generated data at build time. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Pose estimation keypoint maps";

export default function Image() {
  const t = hubTotals();
  return new ImageResponse(
    ogCard({
      eyebrow: "Reference · AI Motion",
      title: "Pose Estimation Keypoint Maps",
      line: `${t.schemes} schemes · ${t.points} points · ${t.rows} crosswalk rows · read ${POSE_KEYPOINTS_FETCHED_ON}`,
    }),
    { ...OG_SIZE },
  );
}
