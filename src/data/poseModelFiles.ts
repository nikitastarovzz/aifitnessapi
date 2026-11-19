/**
 * MediaPipe Pose Landmarker .task files as served by Google's mediapipe-models
 * storage bucket, measured by downloading each file in full.
 *
 * GENERATED — do not hand-edit; regenerate with
 * NODE_USE_ENV_PROXY=1 node scripts/fetch-pose-model-files.mjs
 *
 * bytes, sha256 and md5 are computed from the bytes received; lastModified,
 * etag and contentType are the response headers, verbatim (null when the
 * server sent none); identicalToV1 compares the two SHA-256 values. Rendered
 * on /motion/mediapipe-pose-landmarker-models (src/components/PoseModelFiles.tsx).
 */

export type PoseModelFile = {
  variant: "lite" | "full" | "heavy";
  version: "latest" | "1";
  url: string;
  bytes: number;
  sha256: string;
  md5: string;
  /** true when the bucket's x-goog-hash md5 was sent and equals ours; null when not sent. */
  md5MatchesServer: true | null;
  lastModified: string | null;
  etag: string | null;
  contentType: string | null;
  /** The bundle's zip members; crc32 recomputed from the member's bytes. modified is the stored DOS time (no zone). */
  members: { name: string; bytes: number; crc32: string; sha256: string; modified: string }[];
};

export type PoseModelVariant = {
  variant: "lite" | "full" | "heavy";
  file: string;
  latest: PoseModelFile;
  v1: PoseModelFile;
  /** The latest file's SHA-256 equals the /1/ file's, on POSE_MODEL_FILES_FETCHED_ON. */
  identicalToV1: boolean;
  /** How many byte positions differ between the two files; null when their lengths differ. */
  differingBytes: number | null;
  /** Both bundles list the same members, in order, with the same SHA-256 (zip timestamps not compared). */
  sameMembers: boolean;
};

/** The day every file below was downloaded and measured. */
export const POSE_MODEL_FILES_FETCHED_ON = "2026-11-19";

/** The URL pattern the files were read from; one per variant and version. */
export const POSE_MODEL_FILES_URL_PATTERN = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_<variant>/float16/<latest|1>/pose_landmarker_<variant>.task";

export const POSE_MODEL_FILES: PoseModelVariant[] = [
  {
    "variant": "lite",
    "file": "pose_landmarker_lite.task",
    "latest": {
      "variant": "lite",
      "version": "latest",
      "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
      "bytes": 5777746,
      "sha256": "59929e1d1ee95287735ddd833b19cf4ac46d29bc7afddbbf6753c459690d574a",
      "md5": "04a75ddf7c811ac7a1a4523266dd7d88",
      "md5MatchesServer": true,
      "lastModified": "Thu, 27 Apr 2023 19:45:38 GMT",
      "etag": "\"04a75ddf7c811ac7a1a4523266dd7d88\"",
      "contentType": "application/octet-stream",
      "members": [
        {
          "name": "pose_detector.tflite",
          "bytes": 2959078,
          "crc32": "6123cc70",
          "sha256": "46837eb883e6ec75b52c5f5ff6a9b78bd35e66c13f95e8c3566c582d146cb1d9",
          "modified": "2023-04-27 18:38:56"
        },
        {
          "name": "pose_landmarks_detector.tflite",
          "bytes": 2818390,
          "crc32": "840821f7",
          "sha256": "ad6cfd3c903eb31a4ee788b809e45ecf9fa69923b69b9f3f2d9ae616ff433e58",
          "modified": "2023-04-27 18:38:56"
        }
      ]
    },
    "v1": {
      "variant": "lite",
      "version": "1",
      "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      "bytes": 5777746,
      "sha256": "59929e1d1ee95287735ddd833b19cf4ac46d29bc7afddbbf6753c459690d574a",
      "md5": "04a75ddf7c811ac7a1a4523266dd7d88",
      "md5MatchesServer": true,
      "lastModified": "Thu, 27 Apr 2023 19:45:36 GMT",
      "etag": "\"04a75ddf7c811ac7a1a4523266dd7d88\"",
      "contentType": "application/octet-stream",
      "members": [
        {
          "name": "pose_detector.tflite",
          "bytes": 2959078,
          "crc32": "6123cc70",
          "sha256": "46837eb883e6ec75b52c5f5ff6a9b78bd35e66c13f95e8c3566c582d146cb1d9",
          "modified": "2023-04-27 18:38:56"
        },
        {
          "name": "pose_landmarks_detector.tflite",
          "bytes": 2818390,
          "crc32": "840821f7",
          "sha256": "ad6cfd3c903eb31a4ee788b809e45ecf9fa69923b69b9f3f2d9ae616ff433e58",
          "modified": "2023-04-27 18:38:56"
        }
      ]
    },
    "identicalToV1": true,
    "differingBytes": 0,
    "sameMembers": true
  },
  {
    "variant": "full",
    "file": "pose_landmarker_full.task",
    "latest": {
      "variant": "full",
      "version": "latest",
      "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
      "bytes": 9398198,
      "sha256": "4eaa5eb7a98365221087693fcc286334cf0858e2eb6e15b506aa4a7ecdcec4ad",
      "md5": "5a9ad88919b2231d02b1fdf4a54090ec",
      "md5MatchesServer": true,
      "lastModified": "Fri, 28 Apr 2023 00:46:27 GMT",
      "etag": "\"5a9ad88919b2231d02b1fdf4a54090ec\"",
      "contentType": "application/octet-stream",
      "members": [
        {
          "name": "pose_detector.tflite",
          "bytes": 2959046,
          "crc32": "5a302155",
          "sha256": "04f5a96483f8ce5913f8730ad2aa0c4c999c80a4b75653bc0e4712de18e104b2",
          "modified": "2023-04-28 00:45:16"
        },
        {
          "name": "pose_landmarks_detector.tflite",
          "bytes": 6438874,
          "crc32": "7c5aff55",
          "sha256": "82be6d591b9dad7d29fe21dc9fd892bf8b9602c458fb05209283de8282a0c488",
          "modified": "2023-04-28 00:45:16"
        }
      ]
    },
    "v1": {
      "variant": "full",
      "version": "1",
      "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
      "bytes": 9398198,
      "sha256": "5134a3aad27a58b93da0088d431f366da362b44e3ccfbe3462b3827a839011b1",
      "md5": "83879689d373d143be094c972355e48e",
      "md5MatchesServer": true,
      "lastModified": "Fri, 28 Apr 2023 00:46:25 GMT",
      "etag": "\"83879689d373d143be094c972355e48e\"",
      "contentType": "application/octet-stream",
      "members": [
        {
          "name": "pose_detector.tflite",
          "bytes": 2959046,
          "crc32": "5a302155",
          "sha256": "04f5a96483f8ce5913f8730ad2aa0c4c999c80a4b75653bc0e4712de18e104b2",
          "modified": "2023-04-28 00:45:14"
        },
        {
          "name": "pose_landmarks_detector.tflite",
          "bytes": 6438874,
          "crc32": "7c5aff55",
          "sha256": "82be6d591b9dad7d29fe21dc9fd892bf8b9602c458fb05209283de8282a0c488",
          "modified": "2023-04-28 00:45:14"
        }
      ]
    },
    "identicalToV1": false,
    "differingBytes": 4,
    "sameMembers": true
  },
  {
    "variant": "heavy",
    "file": "pose_landmarker_heavy.task",
    "latest": {
      "variant": "heavy",
      "version": "latest",
      "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task",
      "bytes": 30664242,
      "sha256": "64437af838a65d18e5ba7a0d39b465540069bc8aae8308de3e318aad31fcbc7b",
      "md5": "453dec4d02ccc4d3ce812b6de84fa516",
      "md5MatchesServer": true,
      "lastModified": "Fri, 28 Apr 2023 00:46:25 GMT",
      "etag": "\"453dec4d02ccc4d3ce812b6de84fa516\"",
      "contentType": "application/octet-stream",
      "members": [
        {
          "name": "pose_detector.tflite",
          "bytes": 2959046,
          "crc32": "5a302155",
          "sha256": "04f5a96483f8ce5913f8730ad2aa0c4c999c80a4b75653bc0e4712de18e104b2",
          "modified": "2023-04-28 00:45:14"
        },
        {
          "name": "pose_landmarks_detector.tflite",
          "bytes": 27704918,
          "crc32": "32bc0a11",
          "sha256": "a0fe0e6cbaeb36b6075fe520cfca38b0e212b258b6c4c6caf407c7ef5e3ff55c",
          "modified": "2023-04-28 00:45:14"
        }
      ]
    },
    "v1": {
      "variant": "heavy",
      "version": "1",
      "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task",
      "bytes": 30664242,
      "sha256": "64437af838a65d18e5ba7a0d39b465540069bc8aae8308de3e318aad31fcbc7b",
      "md5": "453dec4d02ccc4d3ce812b6de84fa516",
      "md5MatchesServer": true,
      "lastModified": "Fri, 28 Apr 2023 00:46:25 GMT",
      "etag": "\"453dec4d02ccc4d3ce812b6de84fa516\"",
      "contentType": "application/octet-stream",
      "members": [
        {
          "name": "pose_detector.tflite",
          "bytes": 2959046,
          "crc32": "5a302155",
          "sha256": "04f5a96483f8ce5913f8730ad2aa0c4c999c80a4b75653bc0e4712de18e104b2",
          "modified": "2023-04-28 00:45:14"
        },
        {
          "name": "pose_landmarks_detector.tflite",
          "bytes": 27704918,
          "crc32": "32bc0a11",
          "sha256": "a0fe0e6cbaeb36b6075fe520cfca38b0e212b258b6c4c6caf407c7ef5e3ff55c",
          "modified": "2023-04-28 00:45:14"
        }
      ]
    },
    "identicalToV1": true,
    "differingBytes": 0,
    "sameMembers": true
  }
];
