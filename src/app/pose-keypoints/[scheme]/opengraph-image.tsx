import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { POSE_KEYPOINTS_FETCHED_ON, POSE_SCHEMES } from "@/data/poseKeypoints";
import { getScheme, schemeUnit } from "@/data/poseKeypointPages";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Pose keypoint scheme";

export function generateStaticParams() {
  return POSE_SCHEMES.map((s) => ({ scheme: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ scheme: string }> }) {
  const { scheme } = await params;
  const s = getScheme(scheme);
  return new ImageResponse(
    ogCard({
      eyebrow: "Pose keypoint maps",
      title: s ? s.shortName : "Pose keypoint maps",
      line: s ? `${s.points.length} ${schemeUnit(s)} · ${s.usedBy.map((u) => u.model.replace(/ \(.*\)$/, "")).join(", ")} · read ${POSE_KEYPOINTS_FETCHED_ON}` : undefined,
    }),
    { ...OG_SIZE },
  );
}
