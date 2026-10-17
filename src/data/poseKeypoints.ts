/**
 * Pose-estimation keypoint schemes — every index and name, as each model's own
 * source spells it — and the name-identity crosswalk between them.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-pose-keypoints.mjs
 *
 * Sources (GitHub files on the branch shown; sha256 is of the bytes read):
 *   https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py (branch master)
 *   https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/python/solutions/pose.py (branch master)
 *   https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/constants.ts (branch master)
 *   https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/README.md (branch master)
 *   https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/coco.py (branch main)
 *   https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/halpe26.py (branch main)
 *   https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/coco_wholebody.py (branch main)
 *   https://github.com/open-mmlab/mmpose/blob/main/projects/rtmpose/README.md (branch main)
 *   https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/datasets/coco-pose.yaml (branch main)
 *   https://github.com/ultralytics/ultralytics/blob/main/docs/en/tasks/pose.md (branch main)
 *   https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/src/openpose/pose/poseParameters.cpp (branch master)
 *   https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/doc/02_output.md (branch master)
 *   https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark
 *   https://developers.google.com/ml-kit/vision/pose-detection/android
 *   https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname
 *   https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname
 *   https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest
 *   https://developer.apple.com/documentation/vision/vndetecthumanbodypose3drequest
 *   https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation
 * Fetched: 2026-10-17
 *
 * Names are copied exactly. `key` is the one derived field: the name
 * lowercased with every character outside a-z0-9 removed. A crosswalk row
 * joins points whose keys are identical and nothing else; a point whose key
 * no other scheme shares has an empty `sharedWith` and no row. Each "used
 * by" claim carries the source text it was read from in `evidence`.
 */

/** The date the generator last read its sources (the latest fetch date). */
export const POSE_KEYPOINTS_FETCHED_ON = "2026-10-17";

export type PoseSource = {
  id: string;
  title: string;
  /** The URL the generator read (raw file, docs JSON, or ?hl=en page). */
  url: string;
  /** The human-readable page for the same file. */
  page: string;
  repo: string | null;
  branch: string | null;
  path: string | null;
  fetchedOn: string;
  /** SHA-256 of the bytes as served. */
  sha256: string;
  /** Google's "Last updated" footer stamp, for developers.google.com pages. */
  sourceUpdated: string | null;
};

/** Every source file read, in the order the generator lists them. */
export const POSE_SOURCES: PoseSource[] = [
  {
    "id": "mpTasks",
    "title": "MediaPipe Tasks pose_landmarker.py",
    "url": "https://raw.githubusercontent.com/google-ai-edge/mediapipe/master/mediapipe/tasks/python/vision/pose_landmarker.py",
    "page": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py",
    "repo": "google-ai-edge/mediapipe",
    "branch": "master",
    "path": "mediapipe/tasks/python/vision/pose_landmarker.py",
    "fetchedOn": "2026-10-17",
    "sha256": "bb49f0c12742e982130765720471d7963692f53e0b02c8df44419fb765d1eb79",
    "sourceUpdated": null
  },
  {
    "id": "mpSolution",
    "title": "MediaPipe legacy Pose solution pose.py",
    "url": "https://raw.githubusercontent.com/google-ai-edge/mediapipe/master/mediapipe/python/solutions/pose.py",
    "page": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/python/solutions/pose.py",
    "repo": "google-ai-edge/mediapipe",
    "branch": "master",
    "path": "mediapipe/python/solutions/pose.py",
    "fetchedOn": "2026-10-17",
    "sha256": "dcf9bdcfc1f42c310e16e544cc55d46b0be0157d468383bec7dbe867c9b3aaf4",
    "sourceUpdated": null
  },
  {
    "id": "tfjsConstants",
    "title": "TF.js pose-detection constants.ts",
    "url": "https://raw.githubusercontent.com/tensorflow/tfjs-models/master/pose-detection/src/constants.ts",
    "page": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/constants.ts",
    "repo": "tensorflow/tfjs-models",
    "branch": "master",
    "path": "pose-detection/src/constants.ts",
    "fetchedOn": "2026-10-17",
    "sha256": "2463578c8dd96e195699523949269c3461d0b067f75c0546af1bcb13860f1009",
    "sourceUpdated": null
  },
  {
    "id": "tfjsReadme",
    "title": "TF.js pose-detection README",
    "url": "https://raw.githubusercontent.com/tensorflow/tfjs-models/master/pose-detection/README.md",
    "page": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/README.md",
    "repo": "tensorflow/tfjs-models",
    "branch": "master",
    "path": "pose-detection/README.md",
    "fetchedOn": "2026-10-17",
    "sha256": "805c17684646f8fc26afc7374df723fe38724e3a3a97d78df1bc91d1e14398cb",
    "sourceUpdated": null
  },
  {
    "id": "mmposeCoco",
    "title": "MMPose coco.py dataset meta info",
    "url": "https://raw.githubusercontent.com/open-mmlab/mmpose/main/configs/_base_/datasets/coco.py",
    "page": "https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/coco.py",
    "repo": "open-mmlab/mmpose",
    "branch": "main",
    "path": "configs/_base_/datasets/coco.py",
    "fetchedOn": "2026-10-17",
    "sha256": "e4b3082868495da20c30e8d29974d8228c51c4af6919fdac1e70d54bc4abba16",
    "sourceUpdated": null
  },
  {
    "id": "mmposeHalpe26",
    "title": "MMPose halpe26.py dataset meta info",
    "url": "https://raw.githubusercontent.com/open-mmlab/mmpose/main/configs/_base_/datasets/halpe26.py",
    "page": "https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/halpe26.py",
    "repo": "open-mmlab/mmpose",
    "branch": "main",
    "path": "configs/_base_/datasets/halpe26.py",
    "fetchedOn": "2026-10-17",
    "sha256": "b0115f045ade245b9ca5bff2dcbcc43323bb470882e56146471bded91327229e",
    "sourceUpdated": null
  },
  {
    "id": "mmposeWholebody",
    "title": "MMPose coco_wholebody.py dataset meta info",
    "url": "https://raw.githubusercontent.com/open-mmlab/mmpose/main/configs/_base_/datasets/coco_wholebody.py",
    "page": "https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/coco_wholebody.py",
    "repo": "open-mmlab/mmpose",
    "branch": "main",
    "path": "configs/_base_/datasets/coco_wholebody.py",
    "fetchedOn": "2026-10-17",
    "sha256": "8c73971296517eadef6b7df6de92eb8943119cb467b3f4d488a6e062470cf179",
    "sourceUpdated": null
  },
  {
    "id": "rtmposeReadme",
    "title": "RTMPose README",
    "url": "https://raw.githubusercontent.com/open-mmlab/mmpose/main/projects/rtmpose/README.md",
    "page": "https://github.com/open-mmlab/mmpose/blob/main/projects/rtmpose/README.md",
    "repo": "open-mmlab/mmpose",
    "branch": "main",
    "path": "projects/rtmpose/README.md",
    "fetchedOn": "2026-10-17",
    "sha256": "21a455d285fbe64956f04f248b4a1cde94bff7c7984487c04dd45bf0e504a6ee",
    "sourceUpdated": null
  },
  {
    "id": "ultralyticsYaml",
    "title": "Ultralytics coco-pose.yaml",
    "url": "https://raw.githubusercontent.com/ultralytics/ultralytics/main/ultralytics/cfg/datasets/coco-pose.yaml",
    "page": "https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/datasets/coco-pose.yaml",
    "repo": "ultralytics/ultralytics",
    "branch": "main",
    "path": "ultralytics/cfg/datasets/coco-pose.yaml",
    "fetchedOn": "2026-10-17",
    "sha256": "06a3a4ab8960f4555a9324a7bc0bde1ddac80603d1d2a2015d39336b73d9325f",
    "sourceUpdated": null
  },
  {
    "id": "ultralyticsDocs",
    "title": "Ultralytics pose task docs (pose.md)",
    "url": "https://raw.githubusercontent.com/ultralytics/ultralytics/main/docs/en/tasks/pose.md",
    "page": "https://github.com/ultralytics/ultralytics/blob/main/docs/en/tasks/pose.md",
    "repo": "ultralytics/ultralytics",
    "branch": "main",
    "path": "docs/en/tasks/pose.md",
    "fetchedOn": "2026-10-17",
    "sha256": "5fd4e786153cc558911a6041e94085874db5285df449f03641c0ca64ce471909",
    "sourceUpdated": null
  },
  {
    "id": "openposeParams",
    "title": "OpenPose poseParameters.cpp",
    "url": "https://raw.githubusercontent.com/CMU-Perceptual-Computing-Lab/openpose/master/src/openpose/pose/poseParameters.cpp",
    "page": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/src/openpose/pose/poseParameters.cpp",
    "repo": "CMU-Perceptual-Computing-Lab/openpose",
    "branch": "master",
    "path": "src/openpose/pose/poseParameters.cpp",
    "fetchedOn": "2026-10-17",
    "sha256": "d2e441fa73f9713888f76560317dee75c1a4c880ab9c904530eff9958dd546f8",
    "sourceUpdated": null
  },
  {
    "id": "openposeDoc",
    "title": "OpenPose output format doc (02_output.md)",
    "url": "https://raw.githubusercontent.com/CMU-Perceptual-Computing-Lab/openpose/master/doc/02_output.md",
    "page": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/doc/02_output.md",
    "repo": "CMU-Perceptual-Computing-Lab/openpose",
    "branch": "master",
    "path": "doc/02_output.md",
    "fetchedOn": "2026-10-17",
    "sha256": "a423925737344a07d726996966311ab160356b6d7b55d3c3c2bb9c0864e0ec6d",
    "sourceUpdated": null
  },
  {
    "id": "mlkitLandmark",
    "title": "ML Kit PoseLandmark (Android reference)",
    "url": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark?hl=en",
    "page": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-17",
    "sha256": "211ef8c098c39970957c1b3cd20f4471111d94ff350e09e43082642ae557af24",
    "sourceUpdated": "2024-10-31"
  },
  {
    "id": "mlkitAndroid",
    "title": "Detect poses with ML Kit on Android",
    "url": "https://developers.google.com/ml-kit/vision/pose-detection/android?hl=en",
    "page": "https://developers.google.com/ml-kit/vision/pose-detection/android",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-17",
    "sha256": "dfe15ff2410dc73682a0426651c3fb42bdfce3c05ce966203bf386fd12439da8",
    "sourceUpdated": "2026-10-15"
  },
  {
    "id": "appleJoints2d",
    "title": "VNHumanBodyPoseObservation.JointName",
    "url": "https://developer.apple.com/tutorials/data/documentation/vision/vnhumanbodyposeobservation/jointname.json",
    "page": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-17",
    "sha256": "fe73c7fb2ae244b7a66a4d515e83a970e8a938689dff36bea0965555e20b4bf4",
    "sourceUpdated": null
  },
  {
    "id": "appleJoints3d",
    "title": "VNHumanBodyPose3DObservation.JointName",
    "url": "https://developer.apple.com/tutorials/data/documentation/vision/vnhumanbodypose3dobservation/jointname.json",
    "page": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-17",
    "sha256": "0f03e72204ce352b489c8a14759a13c53ef355f274e071bd6d1fb9fc218797c6",
    "sourceUpdated": null
  },
  {
    "id": "appleRequest2d",
    "title": "VNDetectHumanBodyPoseRequest",
    "url": "https://developer.apple.com/tutorials/data/documentation/vision/vndetecthumanbodyposerequest.json",
    "page": "https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-17",
    "sha256": "8513a041dcf7b744724c3ba55b025eb269cb2fc3cb098edc6db657dbd961d59c",
    "sourceUpdated": null
  },
  {
    "id": "appleRequest3d",
    "title": "VNDetectHumanBodyPose3DRequest",
    "url": "https://developer.apple.com/tutorials/data/documentation/vision/vndetecthumanbodypose3drequest.json",
    "page": "https://developer.apple.com/documentation/vision/vndetecthumanbodypose3drequest",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-17",
    "sha256": "926efd6c2c85c08f4b8300487c3fc08c97f7e106f4267475d100fa13f3ed2578",
    "sourceUpdated": null
  },
  {
    "id": "appleObservation3d",
    "title": "VNHumanBodyPose3DObservation",
    "url": "https://developer.apple.com/tutorials/data/documentation/vision/vnhumanbodypose3dobservation.json",
    "page": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-17",
    "sha256": "8fff13ea23640fdc5e28e00343ed417843e784222a5cf41023105fca77874611",
    "sourceUpdated": null
  }
];

export type PosePoint = {
  /** The integer index the source assigns; null for Apple's named constants. */
  index: number | null;
  /** Position in the source's own listing. */
  order: number;
  /** Exactly as the source spells it. */
  name: string;
  /** Spellings of the same index in the cross-checked sources, where they differ. */
  altNames: { sourceId: string; name: string }[];
  /** The source's own description, verbatim (ML Kit, Apple); null elsewhere. */
  description: string | null;
  /** Apple's topic group; null elsewhere. */
  group: string | null;
  /** MMPose's `swap` field, verbatim; null elsewhere or where it is empty. */
  swap: string | null;
  docUrl: string | null;
  /** DERIVED: name lowercased, characters outside a-z0-9 removed. */
  key: string;
  /** Other schemes with a point of the same key. */
  sharedWith: string[];
};

export type PoseScheme = {
  slug: string;
  name: string;
  shortName: string;
  family: string;
  /** The source the names and indices are copied from. */
  sourceId: string;
  nameSource: string;
  /** false for Apple Vision: joint names are constants with no numeric index. */
  indexed: boolean;
  points: PosePoint[];
  /** Entries the source lists that are not keypoints, and the source's reason. */
  excluded: { index: number; name: string; sourceId: string; reason: string | null }[];
  /** What was checked against the other sources (every check passed). */
  crossChecks: string[];
  /** The sources those checks read. */
  checkSources: string[];
  /** Models documented as producing this scheme, each with the source text that says so. */
  usedBy: { modelId: string; model: string; sourceId: string; evidence: string }[];
  /** Code-facing statements copied from the sources (whitespace collapsed). */
  notes: { sourceId: string; text: string }[];
  /** The dataset paper MMPose's meta info cites; null elsewhere. */
  datasetInfo: { dataset: string | null; title: string | null; year: string | null; homepage: string | null } | null;
  /** Apple's availability for the joint-name type; null elsewhere. */
  platforms: { name: string; introducedAt: string | null }[] | null;
  sourceUpdated?: string | null;
};

/** Every scheme, in a fixed order. */
export const POSE_SCHEMES: PoseScheme[] = [
  {
    "slug": "blazepose-33",
    "name": "BlazePose 33 (MediaPipe pose landmarks)",
    "shortName": "BlazePose 33",
    "family": "MediaPipe",
    "sourceId": "mpTasks",
    "nameSource": "the PoseLandmark enum in MediaPipe's Tasks pose_landmarker.py",
    "indexed": true,
    "points": [
      {
        "index": 0,
        "order": 0,
        "name": "NOSE",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "nose"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "nose",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "openpose-body-25",
          "openpose-coco-18",
          "apple-vision-2d"
        ]
      },
      {
        "index": 1,
        "order": 1,
        "name": "LEFT_EYE_INNER",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_eye_inner"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lefteyeinner",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 2,
        "order": 2,
        "name": "LEFT_EYE",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_eye"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lefteye",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 3,
        "order": 3,
        "name": "LEFT_EYE_OUTER",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_eye_outer"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lefteyeouter",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 4,
        "order": 4,
        "name": "RIGHT_EYE_INNER",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_eye_inner"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "righteyeinner",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 5,
        "order": 5,
        "name": "RIGHT_EYE",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_eye"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "righteye",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 6,
        "order": 6,
        "name": "RIGHT_EYE_OUTER",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_eye_outer"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "righteyeouter",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 7,
        "order": 7,
        "name": "LEFT_EAR",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_ear"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftear",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 8,
        "order": 8,
        "name": "RIGHT_EAR",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_ear"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightear",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 9,
        "order": 9,
        "name": "MOUTH_LEFT",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "mouth_left"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "mouthleft",
        "sharedWith": []
      },
      {
        "index": 10,
        "order": 10,
        "name": "MOUTH_RIGHT",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "mouth_right"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "mouthright",
        "sharedWith": []
      },
      {
        "index": 11,
        "order": 11,
        "name": "LEFT_SHOULDER",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_shoulder"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftshoulder",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 12,
        "order": 12,
        "name": "RIGHT_SHOULDER",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_shoulder"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightshoulder",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 13,
        "order": 13,
        "name": "LEFT_ELBOW",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_elbow"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftelbow",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 14,
        "order": 14,
        "name": "RIGHT_ELBOW",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_elbow"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightelbow",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 15,
        "order": 15,
        "name": "LEFT_WRIST",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_wrist"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftwrist",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 16,
        "order": 16,
        "name": "RIGHT_WRIST",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_wrist"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightwrist",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 17,
        "order": 17,
        "name": "LEFT_PINKY",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_pinky"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftpinky",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 18,
        "order": 18,
        "name": "RIGHT_PINKY",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_pinky"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightpinky",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 19,
        "order": 19,
        "name": "LEFT_INDEX",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_index"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftindex",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 20,
        "order": 20,
        "name": "RIGHT_INDEX",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_index"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightindex",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 21,
        "order": 21,
        "name": "LEFT_THUMB",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_thumb"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftthumb",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 22,
        "order": 22,
        "name": "RIGHT_THUMB",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_thumb"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightthumb",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 23,
        "order": 23,
        "name": "LEFT_HIP",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_hip"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lefthip",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 24,
        "order": 24,
        "name": "RIGHT_HIP",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_hip"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "righthip",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 25,
        "order": 25,
        "name": "LEFT_KNEE",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_knee"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftknee",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 26,
        "order": 26,
        "name": "RIGHT_KNEE",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_knee"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightknee",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 27,
        "order": 27,
        "name": "LEFT_ANKLE",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_ankle"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftankle",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 28,
        "order": 28,
        "name": "RIGHT_ANKLE",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_ankle"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightankle",
        "sharedWith": [
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 29,
        "order": 29,
        "name": "LEFT_HEEL",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_heel"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftheel",
        "sharedWith": [
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133"
        ]
      },
      {
        "index": 30,
        "order": 30,
        "name": "RIGHT_HEEL",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_heel"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightheel",
        "sharedWith": [
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133"
        ]
      },
      {
        "index": 31,
        "order": 31,
        "name": "LEFT_FOOT_INDEX",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "left_foot_index"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leftfootindex",
        "sharedWith": [
          "ml-kit"
        ]
      },
      {
        "index": 32,
        "order": 32,
        "name": "RIGHT_FOOT_INDEX",
        "altNames": [
          {
            "sourceId": "tfjsConstants",
            "name": "right_foot_index"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rightfootindex",
        "sharedWith": [
          "ml-kit"
        ]
      }
    ],
    "excluded": [],
    "crossChecks": [
      "MediaPipe Tasks PoseLandmark values run 0 to N-1 in declaration order",
      "the legacy solutions/pose.py PoseLandmark enum declares the same names at the same values",
      "TF.js BLAZEPOSE_KEYPOINTS lists the same names in the same order (lowercase)",
      "the TF.js README's BlazePose keypoint list agrees for every index the enum defines"
    ],
    "checkSources": [
      "mpSolution",
      "tfjsConstants",
      "tfjsReadme"
    ],
    "usedBy": [
      {
        "modelId": "mediapipe-pose-landmarker",
        "model": "MediaPipe Pose Landmarker (Tasks API)",
        "sourceId": "mpTasks",
        "evidence": "class PoseLandmark(enum.IntEnum): \"\"\"The 33 pose landmarks.\"\"\""
      },
      {
        "modelId": "mediapipe-pose-legacy",
        "model": "MediaPipe Pose (legacy Solutions API)",
        "sourceId": "mpSolution",
        "evidence": "class PoseLandmark(enum.IntEnum): \"\"\"The 33 pose landmarks.\"\"\""
      },
      {
        "modelId": "tfjs-blazepose",
        "model": "BlazePose in TF.js pose-detection",
        "sourceId": "tfjsReadme",
        "evidence": "MediaPipe BlazePose returns 33 keypoints."
      }
    ],
    "notes": [
      {
        "sourceId": "mpTasks",
        "text": "The pose landmarks detection result from PoseLandmarker, where each vector element represents a single pose detected in the image."
      },
      {
        "sourceId": "mpTasks",
        "text": "pose_landmarks: Detected pose landmarks in normalized image coordinates."
      },
      {
        "sourceId": "mpTasks",
        "text": "pose_world_landmarks: Detected pose landmarks in world coordinates."
      },
      {
        "sourceId": "mpTasks",
        "text": "num_poses: The maximum number of poses can be detected by the PoseLandmarker."
      },
      {
        "sourceId": "mpTasks",
        "text": "num_poses: int = 1"
      },
      {
        "sourceId": "mpSolution",
        "text": "\"pose_world_landmarks\" field that contains the pose landmarks in real-world 3D coordinates that are in meters with the origin at the center between hips."
      },
      {
        "sourceId": "tfjsReadme",
        "text": "For the `keypoints`, x and y represent the actual keypoint position in the image."
      },
      {
        "sourceId": "tfjsReadme",
        "text": "For the `keypoints3D`, x, y and z represent absolute distance in meters in a 2 x 2 x 2 meter cubic space. The range for each axis goes from -1 to 1 (therefore 2m total delta). The z is always perpendicular to the xy plane that passes the center of the hip, so the coordinate for the hip center is (0, 0, 0)."
      },
      {
        "sourceId": "tfjsReadme",
        "text": "The README's BlazePose keypoint list continues past 32 with 33: bodyCenter, 34: forehead, 35: leftThumb, 36: leftHand, 37: rightThumb, 38: rightHand; BLAZEPOSE_KEYPOINTS in constants.ts, whose comment says the order \"needs to be consistent with the model keypoint result list\", stops at 32."
      }
    ],
    "datasetInfo": null,
    "platforms": null
  },
  {
    "slug": "ml-kit",
    "name": "ML Kit PoseLandmark (33 landmarks)",
    "shortName": "ML Kit 33",
    "family": "ML Kit",
    "sourceId": "mlkitLandmark",
    "nameSource": "the int constants of com.google.mlkit.vision.pose.PoseLandmark (Android reference)",
    "indexed": true,
    "points": [
      {
        "index": 0,
        "order": 0,
        "name": "NOSE",
        "altNames": [],
        "description": "The landmark which corresponds to the nose.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#NOSE",
        "key": "nose",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "openpose-body-25",
          "openpose-coco-18",
          "apple-vision-2d"
        ]
      },
      {
        "index": 1,
        "order": 1,
        "name": "LEFT_EYE_INNER",
        "altNames": [],
        "description": "The landmark which corresponds to the inner left eye.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_EYE_INNER",
        "key": "lefteyeinner",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 2,
        "order": 2,
        "name": "LEFT_EYE",
        "altNames": [],
        "description": "The landmark which corresponds to the left eye.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_EYE",
        "key": "lefteye",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 3,
        "order": 3,
        "name": "LEFT_EYE_OUTER",
        "altNames": [],
        "description": "The landmark which corresponds to the outer left eye.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_EYE_OUTER",
        "key": "lefteyeouter",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 4,
        "order": 4,
        "name": "RIGHT_EYE_INNER",
        "altNames": [],
        "description": "The landmark which corresponds to the inner left eye.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_EYE_INNER",
        "key": "righteyeinner",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 5,
        "order": 5,
        "name": "RIGHT_EYE",
        "altNames": [],
        "description": "The landmark which corresponds to the left eye.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_EYE",
        "key": "righteye",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 6,
        "order": 6,
        "name": "RIGHT_EYE_OUTER",
        "altNames": [],
        "description": "The landmark which corresponds to the outer left eye.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_EYE_OUTER",
        "key": "righteyeouter",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 7,
        "order": 7,
        "name": "LEFT_EAR",
        "altNames": [],
        "description": "The landmark which corresponds to the left ear.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_EAR",
        "key": "leftear",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 8,
        "order": 8,
        "name": "RIGHT_EAR",
        "altNames": [],
        "description": "The landmark which corresponds to the right ear.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_EAR",
        "key": "rightear",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 9,
        "order": 9,
        "name": "LEFT_MOUTH",
        "altNames": [],
        "description": "The landmark which corresponds to the left mouth.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_MOUTH",
        "key": "leftmouth",
        "sharedWith": []
      },
      {
        "index": 10,
        "order": 10,
        "name": "RIGHT_MOUTH",
        "altNames": [],
        "description": "The landmark which corresponds to the right mouth.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_MOUTH",
        "key": "rightmouth",
        "sharedWith": []
      },
      {
        "index": 11,
        "order": 11,
        "name": "LEFT_SHOULDER",
        "altNames": [],
        "description": "The landmark which corresponds to the left shoulder.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_SHOULDER",
        "key": "leftshoulder",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 12,
        "order": 12,
        "name": "RIGHT_SHOULDER",
        "altNames": [],
        "description": "The landmark which corresponds to the right shoulder.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_SHOULDER",
        "key": "rightshoulder",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 13,
        "order": 13,
        "name": "LEFT_ELBOW",
        "altNames": [],
        "description": "The landmark which corresponds to the left elbow.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_ELBOW",
        "key": "leftelbow",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 14,
        "order": 14,
        "name": "RIGHT_ELBOW",
        "altNames": [],
        "description": "The landmark which corresponds to the right elbow.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_ELBOW",
        "key": "rightelbow",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 15,
        "order": 15,
        "name": "LEFT_WRIST",
        "altNames": [],
        "description": "The landmark which corresponds to the left wrist.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_WRIST",
        "key": "leftwrist",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 16,
        "order": 16,
        "name": "RIGHT_WRIST",
        "altNames": [],
        "description": "The landmark which corresponds to the right wrist.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_WRIST",
        "key": "rightwrist",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 17,
        "order": 17,
        "name": "LEFT_PINKY",
        "altNames": [],
        "description": "The landmark which corresponds to the left pinky.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_PINKY",
        "key": "leftpinky",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 18,
        "order": 18,
        "name": "RIGHT_PINKY",
        "altNames": [],
        "description": "The landmark which corresponds to the right pinky.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_PINKY",
        "key": "rightpinky",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 19,
        "order": 19,
        "name": "LEFT_INDEX",
        "altNames": [],
        "description": "The landmark which corresponds to the left index finger.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_INDEX",
        "key": "leftindex",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 20,
        "order": 20,
        "name": "RIGHT_INDEX",
        "altNames": [],
        "description": "The landmark which corresponds to the right index finger.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_INDEX",
        "key": "rightindex",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 21,
        "order": 21,
        "name": "LEFT_THUMB",
        "altNames": [],
        "description": "The landmark which corresponds to the left thumb.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_THUMB",
        "key": "leftthumb",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 22,
        "order": 22,
        "name": "RIGHT_THUMB",
        "altNames": [],
        "description": "The landmark which corresponds to the right thumb.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_THUMB",
        "key": "rightthumb",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 23,
        "order": 23,
        "name": "LEFT_HIP",
        "altNames": [],
        "description": "The landmark which corresponds to the left hip.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_HIP",
        "key": "lefthip",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 24,
        "order": 24,
        "name": "RIGHT_HIP",
        "altNames": [],
        "description": "The landmark which corresponds to the right hip.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_HIP",
        "key": "righthip",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 25,
        "order": 25,
        "name": "LEFT_KNEE",
        "altNames": [],
        "description": "The landmark which corresponds to the left knee.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_KNEE",
        "key": "leftknee",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 26,
        "order": 26,
        "name": "RIGHT_KNEE",
        "altNames": [],
        "description": "The landmark which corresponds to the right knee.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_KNEE",
        "key": "rightknee",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 27,
        "order": 27,
        "name": "LEFT_ANKLE",
        "altNames": [],
        "description": "The landmark which corresponds to the left ankle.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_ANKLE",
        "key": "leftankle",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 28,
        "order": 28,
        "name": "RIGHT_ANKLE",
        "altNames": [],
        "description": "The landmark which corresponds to the right ankle.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_ANKLE",
        "key": "rightankle",
        "sharedWith": [
          "blazepose-33",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 29,
        "order": 29,
        "name": "LEFT_HEEL",
        "altNames": [],
        "description": "The landmark which corresponds to the left heel.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_HEEL",
        "key": "leftheel",
        "sharedWith": [
          "blazepose-33",
          "halpe-26",
          "coco-wholebody-133"
        ]
      },
      {
        "index": 30,
        "order": 30,
        "name": "RIGHT_HEEL",
        "altNames": [],
        "description": "The landmark which corresponds to the right heel.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_HEEL",
        "key": "rightheel",
        "sharedWith": [
          "blazepose-33",
          "halpe-26",
          "coco-wholebody-133"
        ]
      },
      {
        "index": 31,
        "order": 31,
        "name": "LEFT_FOOT_INDEX",
        "altNames": [],
        "description": "The landmark which corresponds to the left foot index.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#LEFT_FOOT_INDEX",
        "key": "leftfootindex",
        "sharedWith": [
          "blazepose-33"
        ]
      },
      {
        "index": 32,
        "order": 32,
        "name": "RIGHT_FOOT_INDEX",
        "altNames": [],
        "description": "The landmark which corresponds to the right foot index.",
        "group": null,
        "swap": null,
        "docUrl": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark#RIGHT_FOOT_INDEX",
        "key": "rightfootindex",
        "sharedWith": [
          "blazepose-33"
        ]
      }
    ],
    "excluded": [],
    "crossChecks": [
      "the Constant Values run 0 to N-1 with no gaps",
      "31 of the 33 constants have the same name and value as MediaPipe's PoseLandmark"
    ],
    "checkSources": [
      "mpTasks"
    ],
    "usedBy": [
      {
        "modelId": "ml-kit",
        "model": "ML Kit Pose Detection (base and accurate SDKs)",
        "sourceId": "mlkitAndroid",
        "evidence": "the pose detection API returns a Pose object with 33 PoseLandmarks."
      }
    ],
    "notes": [
      {
        "sourceId": "mlkitLandmark",
        "text": "getPosition3D(): The Z value is an experimental feature that returns an extra Z coordinate along with X and Y. Please note that this value is less accurate than the X and Y values."
      },
      {
        "sourceId": "mlkitLandmark",
        "text": "getPosition3D(): The unit of measure for the Z value is the same as X and Y."
      },
      {
        "sourceId": "mlkitLandmark",
        "text": "getPosition3D(): The smaller the Z value, the closer that landmark is to the camera."
      },
      {
        "sourceId": "mlkitLandmark",
        "text": "getPosition3D(): Different from X and Y, Z does not have a fixed origin in the image space. The Z origin is approximately at the center of the subject’s hips. Z value will be negative if the landmark is in front of the Z origin and will be positive if the landmark is behind the Z origin."
      },
      {
        "sourceId": "mlkitLandmark",
        "text": "getPosition3D(): The Z value does not have a fixed lower or upper bound."
      }
    ],
    "datasetInfo": null,
    "platforms": null,
    "sourceUpdated": "2024-10-31"
  },
  {
    "slug": "coco-17",
    "name": "COCO 17 keypoints",
    "shortName": "COCO 17",
    "family": "COCO",
    "sourceId": "mmposeCoco",
    "nameSource": "keypoint_info in MMPose's configs/_base_/datasets/coco.py",
    "indexed": true,
    "points": [
      {
        "index": 0,
        "order": 0,
        "name": "nose",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Nose"
          }
        ],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "nose",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "openpose-body-25",
          "openpose-coco-18",
          "apple-vision-2d"
        ]
      },
      {
        "index": 1,
        "order": 1,
        "name": "left_eye",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Left Eye"
          }
        ],
        "description": null,
        "group": null,
        "swap": "right_eye",
        "docUrl": null,
        "key": "lefteye",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 2,
        "order": 2,
        "name": "right_eye",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Right Eye"
          }
        ],
        "description": null,
        "group": null,
        "swap": "left_eye",
        "docUrl": null,
        "key": "righteye",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 3,
        "order": 3,
        "name": "left_ear",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Left Ear"
          }
        ],
        "description": null,
        "group": null,
        "swap": "right_ear",
        "docUrl": null,
        "key": "leftear",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 4,
        "order": 4,
        "name": "right_ear",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Right Ear"
          }
        ],
        "description": null,
        "group": null,
        "swap": "left_ear",
        "docUrl": null,
        "key": "rightear",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 5,
        "order": 5,
        "name": "left_shoulder",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Left Shoulder"
          }
        ],
        "description": null,
        "group": null,
        "swap": "right_shoulder",
        "docUrl": null,
        "key": "leftshoulder",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 6,
        "order": 6,
        "name": "right_shoulder",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Right Shoulder"
          }
        ],
        "description": null,
        "group": null,
        "swap": "left_shoulder",
        "docUrl": null,
        "key": "rightshoulder",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 7,
        "order": 7,
        "name": "left_elbow",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Left Elbow"
          }
        ],
        "description": null,
        "group": null,
        "swap": "right_elbow",
        "docUrl": null,
        "key": "leftelbow",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 8,
        "order": 8,
        "name": "right_elbow",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Right Elbow"
          }
        ],
        "description": null,
        "group": null,
        "swap": "left_elbow",
        "docUrl": null,
        "key": "rightelbow",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 9,
        "order": 9,
        "name": "left_wrist",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Left Wrist"
          }
        ],
        "description": null,
        "group": null,
        "swap": "right_wrist",
        "docUrl": null,
        "key": "leftwrist",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 10,
        "order": 10,
        "name": "right_wrist",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Right Wrist"
          }
        ],
        "description": null,
        "group": null,
        "swap": "left_wrist",
        "docUrl": null,
        "key": "rightwrist",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 11,
        "order": 11,
        "name": "left_hip",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Left Hip"
          }
        ],
        "description": null,
        "group": null,
        "swap": "right_hip",
        "docUrl": null,
        "key": "lefthip",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 12,
        "order": 12,
        "name": "right_hip",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Right Hip"
          }
        ],
        "description": null,
        "group": null,
        "swap": "left_hip",
        "docUrl": null,
        "key": "righthip",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 13,
        "order": 13,
        "name": "left_knee",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Left Knee"
          }
        ],
        "description": null,
        "group": null,
        "swap": "right_knee",
        "docUrl": null,
        "key": "leftknee",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 14,
        "order": 14,
        "name": "right_knee",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Right Knee"
          }
        ],
        "description": null,
        "group": null,
        "swap": "left_knee",
        "docUrl": null,
        "key": "rightknee",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 15,
        "order": 15,
        "name": "left_ankle",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Left Ankle"
          }
        ],
        "description": null,
        "group": null,
        "swap": "right_ankle",
        "docUrl": null,
        "key": "leftankle",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 16,
        "order": 16,
        "name": "right_ankle",
        "altNames": [
          {
            "sourceId": "ultralyticsDocs",
            "name": "Right Ankle"
          }
        ],
        "description": null,
        "group": null,
        "swap": "left_ankle",
        "docUrl": null,
        "key": "rightankle",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      }
    ],
    "excluded": [],
    "crossChecks": [
      "MMPose keypoint_info ids run 0 to N-1",
      "TF.js COCO_KEYPOINTS spells the same names in the same order",
      "Ultralytics coco-pose.yaml kpt_names spells the same names in the same order",
      "the Ultralytics docs' keypoint index map lists the same points in the same order (title case)",
      "the TF.js README's COCO keypoint list agrees at every index",
      "Ultralytics kpt_shape declares the same keypoint count"
    ],
    "checkSources": [
      "tfjsConstants",
      "ultralyticsYaml",
      "ultralyticsDocs",
      "tfjsReadme"
    ],
    "usedBy": [
      {
        "modelId": "movenet",
        "model": "MoveNet (TF.js pose-detection)",
        "sourceId": "tfjsReadme",
        "evidence": "COCO Keypoints: Used in MoveNet and PoseNet"
      },
      {
        "modelId": "posenet",
        "model": "PoseNet (TF.js pose-detection)",
        "sourceId": "tfjsReadme",
        "evidence": "COCO Keypoints: Used in MoveNet and PoseNet"
      },
      {
        "modelId": "yolo-pose",
        "model": "Ultralytics YOLO26 default pose models",
        "sourceId": "ultralyticsDocs",
        "evidence": "The default YOLO26 Pose models predict the 17 COCO keypoints"
      },
      {
        "modelId": "rtmpose",
        "model": "RTMPose 17-keypoint body models (MMPose)",
        "sourceId": "rtmposeReadme",
        "evidence": "17 Keypoints: Keypoints are defined as COCO. For details please refer to the meta info."
      }
    ],
    "notes": [
      {
        "sourceId": "tfjsConstants",
        "text": "Don't change the order. The order needs to be consistent with the model keypoint result list."
      },
      {
        "sourceId": "ultralyticsYaml",
        "text": "kpt_shape: [17, 3] — number of keypoints, number of dims (2 for x,y or 3 for x,y,visible)"
      },
      {
        "sourceId": "ultralyticsDocs",
        "text": "result.keypoints.data (torch.float32, shape (N,K,2/3)): `x,y` plus optional visibility/confidence."
      },
      {
        "sourceId": "ultralyticsDocs",
        "text": "result.keypoints.xy (torch.float32, shape (N,K,2)): Pixel keypoints."
      },
      {
        "sourceId": "ultralyticsDocs",
        "text": "result.keypoints.xyn (torch.float32, shape (N,K,2)): Normalized keypoints."
      },
      {
        "sourceId": "tfjsReadme",
        "text": "PoseNet and MoveNet both return 17 keypoints."
      }
    ],
    "datasetInfo": {
      "dataset": "coco",
      "title": "Microsoft coco: Common objects in context",
      "year": "2014",
      "homepage": "http://cocodataset.org/"
    },
    "platforms": null
  },
  {
    "slug": "halpe-26",
    "name": "Halpe26 keypoints",
    "shortName": "Halpe26",
    "family": "MMPose",
    "sourceId": "mmposeHalpe26",
    "nameSource": "keypoint_info in MMPose's configs/_base_/datasets/halpe26.py",
    "indexed": true,
    "points": [
      {
        "index": 0,
        "order": 0,
        "name": "nose",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "nose",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "openpose-body-25",
          "openpose-coco-18",
          "apple-vision-2d"
        ]
      },
      {
        "index": 1,
        "order": 1,
        "name": "left_eye",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_eye",
        "docUrl": null,
        "key": "lefteye",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 2,
        "order": 2,
        "name": "right_eye",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_eye",
        "docUrl": null,
        "key": "righteye",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 3,
        "order": 3,
        "name": "left_ear",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_ear",
        "docUrl": null,
        "key": "leftear",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 4,
        "order": 4,
        "name": "right_ear",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_ear",
        "docUrl": null,
        "key": "rightear",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": 5,
        "order": 5,
        "name": "left_shoulder",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_shoulder",
        "docUrl": null,
        "key": "leftshoulder",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 6,
        "order": 6,
        "name": "right_shoulder",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_shoulder",
        "docUrl": null,
        "key": "rightshoulder",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 7,
        "order": 7,
        "name": "left_elbow",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_elbow",
        "docUrl": null,
        "key": "leftelbow",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 8,
        "order": 8,
        "name": "right_elbow",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_elbow",
        "docUrl": null,
        "key": "rightelbow",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 9,
        "order": 9,
        "name": "left_wrist",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_wrist",
        "docUrl": null,
        "key": "leftwrist",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 10,
        "order": 10,
        "name": "right_wrist",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_wrist",
        "docUrl": null,
        "key": "rightwrist",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 11,
        "order": 11,
        "name": "left_hip",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_hip",
        "docUrl": null,
        "key": "lefthip",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 12,
        "order": 12,
        "name": "right_hip",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_hip",
        "docUrl": null,
        "key": "righthip",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 13,
        "order": 13,
        "name": "left_knee",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_knee",
        "docUrl": null,
        "key": "leftknee",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 14,
        "order": 14,
        "name": "right_knee",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_knee",
        "docUrl": null,
        "key": "rightknee",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 15,
        "order": 15,
        "name": "left_ankle",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_ankle",
        "docUrl": null,
        "key": "leftankle",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 16,
        "order": 16,
        "name": "right_ankle",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_ankle",
        "docUrl": null,
        "key": "rightankle",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "coco-wholebody-133",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 17,
        "order": 17,
        "name": "head",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "head",
        "sharedWith": []
      },
      {
        "index": 18,
        "order": 18,
        "name": "neck",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "neck",
        "sharedWith": [
          "openpose-body-25",
          "openpose-coco-18",
          "apple-vision-2d"
        ]
      },
      {
        "index": 19,
        "order": 19,
        "name": "hip",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "hip",
        "sharedWith": []
      },
      {
        "index": 20,
        "order": 20,
        "name": "left_big_toe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_big_toe",
        "docUrl": null,
        "key": "leftbigtoe",
        "sharedWith": [
          "coco-wholebody-133"
        ]
      },
      {
        "index": 21,
        "order": 21,
        "name": "right_big_toe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_big_toe",
        "docUrl": null,
        "key": "rightbigtoe",
        "sharedWith": [
          "coco-wholebody-133"
        ]
      },
      {
        "index": 22,
        "order": 22,
        "name": "left_small_toe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_small_toe",
        "docUrl": null,
        "key": "leftsmalltoe",
        "sharedWith": [
          "coco-wholebody-133"
        ]
      },
      {
        "index": 23,
        "order": 23,
        "name": "right_small_toe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_small_toe",
        "docUrl": null,
        "key": "rightsmalltoe",
        "sharedWith": [
          "coco-wholebody-133"
        ]
      },
      {
        "index": 24,
        "order": 24,
        "name": "left_heel",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_heel",
        "docUrl": null,
        "key": "leftheel",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-wholebody-133"
        ]
      },
      {
        "index": 25,
        "order": 25,
        "name": "right_heel",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_heel",
        "docUrl": null,
        "key": "rightheel",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-wholebody-133"
        ]
      }
    ],
    "excluded": [],
    "crossChecks": [
      "MMPose keypoint_info ids run 0 to N-1",
      "its first 17 names are identical to MMPose's COCO 17, in the same order"
    ],
    "checkSources": [
      "mmposeCoco"
    ],
    "usedBy": [
      {
        "modelId": "rtmpose",
        "model": "RTMPose 26-keypoint body models (MMPose)",
        "sourceId": "rtmposeReadme",
        "evidence": "26 Keypoints: Keypoints are defined as Halpe26. For details please refer to the meta info."
      }
    ],
    "notes": [],
    "datasetInfo": {
      "dataset": "halpe26",
      "title": "PaStaNet: Toward Human Activity Knowledge Engine",
      "year": "2020",
      "homepage": "https://github.com/Fang-Haoshu/Halpe-FullBody/"
    },
    "platforms": null
  },
  {
    "slug": "coco-wholebody-133",
    "name": "COCO-WholeBody 133 keypoints",
    "shortName": "COCO-WholeBody 133",
    "family": "MMPose",
    "sourceId": "mmposeWholebody",
    "nameSource": "keypoint_info in MMPose's configs/_base_/datasets/coco_wholebody.py",
    "indexed": true,
    "points": [
      {
        "index": 0,
        "order": 0,
        "name": "nose",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "nose",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "openpose-body-25",
          "openpose-coco-18",
          "apple-vision-2d"
        ]
      },
      {
        "index": 1,
        "order": 1,
        "name": "left_eye",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_eye",
        "docUrl": null,
        "key": "lefteye",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d"
        ]
      },
      {
        "index": 2,
        "order": 2,
        "name": "right_eye",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_eye",
        "docUrl": null,
        "key": "righteye",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d"
        ]
      },
      {
        "index": 3,
        "order": 3,
        "name": "left_ear",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_ear",
        "docUrl": null,
        "key": "leftear",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d"
        ]
      },
      {
        "index": 4,
        "order": 4,
        "name": "right_ear",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_ear",
        "docUrl": null,
        "key": "rightear",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d"
        ]
      },
      {
        "index": 5,
        "order": 5,
        "name": "left_shoulder",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_shoulder",
        "docUrl": null,
        "key": "leftshoulder",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 6,
        "order": 6,
        "name": "right_shoulder",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_shoulder",
        "docUrl": null,
        "key": "rightshoulder",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 7,
        "order": 7,
        "name": "left_elbow",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_elbow",
        "docUrl": null,
        "key": "leftelbow",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 8,
        "order": 8,
        "name": "right_elbow",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_elbow",
        "docUrl": null,
        "key": "rightelbow",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 9,
        "order": 9,
        "name": "left_wrist",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_wrist",
        "docUrl": null,
        "key": "leftwrist",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 10,
        "order": 10,
        "name": "right_wrist",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_wrist",
        "docUrl": null,
        "key": "rightwrist",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 11,
        "order": 11,
        "name": "left_hip",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_hip",
        "docUrl": null,
        "key": "lefthip",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 12,
        "order": 12,
        "name": "right_hip",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_hip",
        "docUrl": null,
        "key": "righthip",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 13,
        "order": 13,
        "name": "left_knee",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_knee",
        "docUrl": null,
        "key": "leftknee",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 14,
        "order": 14,
        "name": "right_knee",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_knee",
        "docUrl": null,
        "key": "rightknee",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 15,
        "order": 15,
        "name": "left_ankle",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_ankle",
        "docUrl": null,
        "key": "leftankle",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 16,
        "order": 16,
        "name": "right_ankle",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_ankle",
        "docUrl": null,
        "key": "rightankle",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "apple-vision-2d",
          "apple-vision-3d"
        ]
      },
      {
        "index": 17,
        "order": 17,
        "name": "left_big_toe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_big_toe",
        "docUrl": null,
        "key": "leftbigtoe",
        "sharedWith": [
          "halpe-26"
        ]
      },
      {
        "index": 18,
        "order": 18,
        "name": "left_small_toe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_small_toe",
        "docUrl": null,
        "key": "leftsmalltoe",
        "sharedWith": [
          "halpe-26"
        ]
      },
      {
        "index": 19,
        "order": 19,
        "name": "left_heel",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_heel",
        "docUrl": null,
        "key": "leftheel",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26"
        ]
      },
      {
        "index": 20,
        "order": 20,
        "name": "right_big_toe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_big_toe",
        "docUrl": null,
        "key": "rightbigtoe",
        "sharedWith": [
          "halpe-26"
        ]
      },
      {
        "index": 21,
        "order": 21,
        "name": "right_small_toe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_small_toe",
        "docUrl": null,
        "key": "rightsmalltoe",
        "sharedWith": [
          "halpe-26"
        ]
      },
      {
        "index": 22,
        "order": 22,
        "name": "right_heel",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_heel",
        "docUrl": null,
        "key": "rightheel",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "halpe-26"
        ]
      },
      {
        "index": 23,
        "order": 23,
        "name": "face-0",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-16",
        "docUrl": null,
        "key": "face0",
        "sharedWith": []
      },
      {
        "index": 24,
        "order": 24,
        "name": "face-1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-15",
        "docUrl": null,
        "key": "face1",
        "sharedWith": []
      },
      {
        "index": 25,
        "order": 25,
        "name": "face-2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-14",
        "docUrl": null,
        "key": "face2",
        "sharedWith": []
      },
      {
        "index": 26,
        "order": 26,
        "name": "face-3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-13",
        "docUrl": null,
        "key": "face3",
        "sharedWith": []
      },
      {
        "index": 27,
        "order": 27,
        "name": "face-4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-12",
        "docUrl": null,
        "key": "face4",
        "sharedWith": []
      },
      {
        "index": 28,
        "order": 28,
        "name": "face-5",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-11",
        "docUrl": null,
        "key": "face5",
        "sharedWith": []
      },
      {
        "index": 29,
        "order": 29,
        "name": "face-6",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-10",
        "docUrl": null,
        "key": "face6",
        "sharedWith": []
      },
      {
        "index": 30,
        "order": 30,
        "name": "face-7",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-9",
        "docUrl": null,
        "key": "face7",
        "sharedWith": []
      },
      {
        "index": 31,
        "order": 31,
        "name": "face-8",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "face8",
        "sharedWith": []
      },
      {
        "index": 32,
        "order": 32,
        "name": "face-9",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-7",
        "docUrl": null,
        "key": "face9",
        "sharedWith": []
      },
      {
        "index": 33,
        "order": 33,
        "name": "face-10",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-6",
        "docUrl": null,
        "key": "face10",
        "sharedWith": []
      },
      {
        "index": 34,
        "order": 34,
        "name": "face-11",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-5",
        "docUrl": null,
        "key": "face11",
        "sharedWith": []
      },
      {
        "index": 35,
        "order": 35,
        "name": "face-12",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-4",
        "docUrl": null,
        "key": "face12",
        "sharedWith": []
      },
      {
        "index": 36,
        "order": 36,
        "name": "face-13",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-3",
        "docUrl": null,
        "key": "face13",
        "sharedWith": []
      },
      {
        "index": 37,
        "order": 37,
        "name": "face-14",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-2",
        "docUrl": null,
        "key": "face14",
        "sharedWith": []
      },
      {
        "index": 38,
        "order": 38,
        "name": "face-15",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-1",
        "docUrl": null,
        "key": "face15",
        "sharedWith": []
      },
      {
        "index": 39,
        "order": 39,
        "name": "face-16",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-0",
        "docUrl": null,
        "key": "face16",
        "sharedWith": []
      },
      {
        "index": 40,
        "order": 40,
        "name": "face-17",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-26",
        "docUrl": null,
        "key": "face17",
        "sharedWith": []
      },
      {
        "index": 41,
        "order": 41,
        "name": "face-18",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-25",
        "docUrl": null,
        "key": "face18",
        "sharedWith": []
      },
      {
        "index": 42,
        "order": 42,
        "name": "face-19",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-24",
        "docUrl": null,
        "key": "face19",
        "sharedWith": []
      },
      {
        "index": 43,
        "order": 43,
        "name": "face-20",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-23",
        "docUrl": null,
        "key": "face20",
        "sharedWith": []
      },
      {
        "index": 44,
        "order": 44,
        "name": "face-21",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-22",
        "docUrl": null,
        "key": "face21",
        "sharedWith": []
      },
      {
        "index": 45,
        "order": 45,
        "name": "face-22",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-21",
        "docUrl": null,
        "key": "face22",
        "sharedWith": []
      },
      {
        "index": 46,
        "order": 46,
        "name": "face-23",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-20",
        "docUrl": null,
        "key": "face23",
        "sharedWith": []
      },
      {
        "index": 47,
        "order": 47,
        "name": "face-24",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-19",
        "docUrl": null,
        "key": "face24",
        "sharedWith": []
      },
      {
        "index": 48,
        "order": 48,
        "name": "face-25",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-18",
        "docUrl": null,
        "key": "face25",
        "sharedWith": []
      },
      {
        "index": 49,
        "order": 49,
        "name": "face-26",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-17",
        "docUrl": null,
        "key": "face26",
        "sharedWith": []
      },
      {
        "index": 50,
        "order": 50,
        "name": "face-27",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "face27",
        "sharedWith": []
      },
      {
        "index": 51,
        "order": 51,
        "name": "face-28",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "face28",
        "sharedWith": []
      },
      {
        "index": 52,
        "order": 52,
        "name": "face-29",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "face29",
        "sharedWith": []
      },
      {
        "index": 53,
        "order": 53,
        "name": "face-30",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "face30",
        "sharedWith": []
      },
      {
        "index": 54,
        "order": 54,
        "name": "face-31",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-35",
        "docUrl": null,
        "key": "face31",
        "sharedWith": []
      },
      {
        "index": 55,
        "order": 55,
        "name": "face-32",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-34",
        "docUrl": null,
        "key": "face32",
        "sharedWith": []
      },
      {
        "index": 56,
        "order": 56,
        "name": "face-33",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "face33",
        "sharedWith": []
      },
      {
        "index": 57,
        "order": 57,
        "name": "face-34",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-32",
        "docUrl": null,
        "key": "face34",
        "sharedWith": []
      },
      {
        "index": 58,
        "order": 58,
        "name": "face-35",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-31",
        "docUrl": null,
        "key": "face35",
        "sharedWith": []
      },
      {
        "index": 59,
        "order": 59,
        "name": "face-36",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-45",
        "docUrl": null,
        "key": "face36",
        "sharedWith": []
      },
      {
        "index": 60,
        "order": 60,
        "name": "face-37",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-44",
        "docUrl": null,
        "key": "face37",
        "sharedWith": []
      },
      {
        "index": 61,
        "order": 61,
        "name": "face-38",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-43",
        "docUrl": null,
        "key": "face38",
        "sharedWith": []
      },
      {
        "index": 62,
        "order": 62,
        "name": "face-39",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-42",
        "docUrl": null,
        "key": "face39",
        "sharedWith": []
      },
      {
        "index": 63,
        "order": 63,
        "name": "face-40",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-47",
        "docUrl": null,
        "key": "face40",
        "sharedWith": []
      },
      {
        "index": 64,
        "order": 64,
        "name": "face-41",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-46",
        "docUrl": null,
        "key": "face41",
        "sharedWith": []
      },
      {
        "index": 65,
        "order": 65,
        "name": "face-42",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-39",
        "docUrl": null,
        "key": "face42",
        "sharedWith": []
      },
      {
        "index": 66,
        "order": 66,
        "name": "face-43",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-38",
        "docUrl": null,
        "key": "face43",
        "sharedWith": []
      },
      {
        "index": 67,
        "order": 67,
        "name": "face-44",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-37",
        "docUrl": null,
        "key": "face44",
        "sharedWith": []
      },
      {
        "index": 68,
        "order": 68,
        "name": "face-45",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-36",
        "docUrl": null,
        "key": "face45",
        "sharedWith": []
      },
      {
        "index": 69,
        "order": 69,
        "name": "face-46",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-41",
        "docUrl": null,
        "key": "face46",
        "sharedWith": []
      },
      {
        "index": 70,
        "order": 70,
        "name": "face-47",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-40",
        "docUrl": null,
        "key": "face47",
        "sharedWith": []
      },
      {
        "index": 71,
        "order": 71,
        "name": "face-48",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-54",
        "docUrl": null,
        "key": "face48",
        "sharedWith": []
      },
      {
        "index": 72,
        "order": 72,
        "name": "face-49",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-53",
        "docUrl": null,
        "key": "face49",
        "sharedWith": []
      },
      {
        "index": 73,
        "order": 73,
        "name": "face-50",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-52",
        "docUrl": null,
        "key": "face50",
        "sharedWith": []
      },
      {
        "index": 74,
        "order": 74,
        "name": "face-51",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "face51",
        "sharedWith": []
      },
      {
        "index": 75,
        "order": 75,
        "name": "face-52",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-50",
        "docUrl": null,
        "key": "face52",
        "sharedWith": []
      },
      {
        "index": 76,
        "order": 76,
        "name": "face-53",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-49",
        "docUrl": null,
        "key": "face53",
        "sharedWith": []
      },
      {
        "index": 77,
        "order": 77,
        "name": "face-54",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-48",
        "docUrl": null,
        "key": "face54",
        "sharedWith": []
      },
      {
        "index": 78,
        "order": 78,
        "name": "face-55",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-59",
        "docUrl": null,
        "key": "face55",
        "sharedWith": []
      },
      {
        "index": 79,
        "order": 79,
        "name": "face-56",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-58",
        "docUrl": null,
        "key": "face56",
        "sharedWith": []
      },
      {
        "index": 80,
        "order": 80,
        "name": "face-57",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "face57",
        "sharedWith": []
      },
      {
        "index": 81,
        "order": 81,
        "name": "face-58",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-56",
        "docUrl": null,
        "key": "face58",
        "sharedWith": []
      },
      {
        "index": 82,
        "order": 82,
        "name": "face-59",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-55",
        "docUrl": null,
        "key": "face59",
        "sharedWith": []
      },
      {
        "index": 83,
        "order": 83,
        "name": "face-60",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-64",
        "docUrl": null,
        "key": "face60",
        "sharedWith": []
      },
      {
        "index": 84,
        "order": 84,
        "name": "face-61",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-63",
        "docUrl": null,
        "key": "face61",
        "sharedWith": []
      },
      {
        "index": 85,
        "order": 85,
        "name": "face-62",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "face62",
        "sharedWith": []
      },
      {
        "index": 86,
        "order": 86,
        "name": "face-63",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-61",
        "docUrl": null,
        "key": "face63",
        "sharedWith": []
      },
      {
        "index": 87,
        "order": 87,
        "name": "face-64",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-60",
        "docUrl": null,
        "key": "face64",
        "sharedWith": []
      },
      {
        "index": 88,
        "order": 88,
        "name": "face-65",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-67",
        "docUrl": null,
        "key": "face65",
        "sharedWith": []
      },
      {
        "index": 89,
        "order": 89,
        "name": "face-66",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "face66",
        "sharedWith": []
      },
      {
        "index": 90,
        "order": 90,
        "name": "face-67",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "face-65",
        "docUrl": null,
        "key": "face67",
        "sharedWith": []
      },
      {
        "index": 91,
        "order": 91,
        "name": "left_hand_root",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_hand_root",
        "docUrl": null,
        "key": "lefthandroot",
        "sharedWith": []
      },
      {
        "index": 92,
        "order": 92,
        "name": "left_thumb1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_thumb1",
        "docUrl": null,
        "key": "leftthumb1",
        "sharedWith": []
      },
      {
        "index": 93,
        "order": 93,
        "name": "left_thumb2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_thumb2",
        "docUrl": null,
        "key": "leftthumb2",
        "sharedWith": []
      },
      {
        "index": 94,
        "order": 94,
        "name": "left_thumb3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_thumb3",
        "docUrl": null,
        "key": "leftthumb3",
        "sharedWith": []
      },
      {
        "index": 95,
        "order": 95,
        "name": "left_thumb4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_thumb4",
        "docUrl": null,
        "key": "leftthumb4",
        "sharedWith": []
      },
      {
        "index": 96,
        "order": 96,
        "name": "left_forefinger1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_forefinger1",
        "docUrl": null,
        "key": "leftforefinger1",
        "sharedWith": []
      },
      {
        "index": 97,
        "order": 97,
        "name": "left_forefinger2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_forefinger2",
        "docUrl": null,
        "key": "leftforefinger2",
        "sharedWith": []
      },
      {
        "index": 98,
        "order": 98,
        "name": "left_forefinger3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_forefinger3",
        "docUrl": null,
        "key": "leftforefinger3",
        "sharedWith": []
      },
      {
        "index": 99,
        "order": 99,
        "name": "left_forefinger4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_forefinger4",
        "docUrl": null,
        "key": "leftforefinger4",
        "sharedWith": []
      },
      {
        "index": 100,
        "order": 100,
        "name": "left_middle_finger1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_middle_finger1",
        "docUrl": null,
        "key": "leftmiddlefinger1",
        "sharedWith": []
      },
      {
        "index": 101,
        "order": 101,
        "name": "left_middle_finger2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_middle_finger2",
        "docUrl": null,
        "key": "leftmiddlefinger2",
        "sharedWith": []
      },
      {
        "index": 102,
        "order": 102,
        "name": "left_middle_finger3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_middle_finger3",
        "docUrl": null,
        "key": "leftmiddlefinger3",
        "sharedWith": []
      },
      {
        "index": 103,
        "order": 103,
        "name": "left_middle_finger4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_middle_finger4",
        "docUrl": null,
        "key": "leftmiddlefinger4",
        "sharedWith": []
      },
      {
        "index": 104,
        "order": 104,
        "name": "left_ring_finger1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_ring_finger1",
        "docUrl": null,
        "key": "leftringfinger1",
        "sharedWith": []
      },
      {
        "index": 105,
        "order": 105,
        "name": "left_ring_finger2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_ring_finger2",
        "docUrl": null,
        "key": "leftringfinger2",
        "sharedWith": []
      },
      {
        "index": 106,
        "order": 106,
        "name": "left_ring_finger3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_ring_finger3",
        "docUrl": null,
        "key": "leftringfinger3",
        "sharedWith": []
      },
      {
        "index": 107,
        "order": 107,
        "name": "left_ring_finger4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_ring_finger4",
        "docUrl": null,
        "key": "leftringfinger4",
        "sharedWith": []
      },
      {
        "index": 108,
        "order": 108,
        "name": "left_pinky_finger1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_pinky_finger1",
        "docUrl": null,
        "key": "leftpinkyfinger1",
        "sharedWith": []
      },
      {
        "index": 109,
        "order": 109,
        "name": "left_pinky_finger2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_pinky_finger2",
        "docUrl": null,
        "key": "leftpinkyfinger2",
        "sharedWith": []
      },
      {
        "index": 110,
        "order": 110,
        "name": "left_pinky_finger3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_pinky_finger3",
        "docUrl": null,
        "key": "leftpinkyfinger3",
        "sharedWith": []
      },
      {
        "index": 111,
        "order": 111,
        "name": "left_pinky_finger4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "right_pinky_finger4",
        "docUrl": null,
        "key": "leftpinkyfinger4",
        "sharedWith": []
      },
      {
        "index": 112,
        "order": 112,
        "name": "right_hand_root",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_hand_root",
        "docUrl": null,
        "key": "righthandroot",
        "sharedWith": []
      },
      {
        "index": 113,
        "order": 113,
        "name": "right_thumb1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_thumb1",
        "docUrl": null,
        "key": "rightthumb1",
        "sharedWith": []
      },
      {
        "index": 114,
        "order": 114,
        "name": "right_thumb2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_thumb2",
        "docUrl": null,
        "key": "rightthumb2",
        "sharedWith": []
      },
      {
        "index": 115,
        "order": 115,
        "name": "right_thumb3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_thumb3",
        "docUrl": null,
        "key": "rightthumb3",
        "sharedWith": []
      },
      {
        "index": 116,
        "order": 116,
        "name": "right_thumb4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_thumb4",
        "docUrl": null,
        "key": "rightthumb4",
        "sharedWith": []
      },
      {
        "index": 117,
        "order": 117,
        "name": "right_forefinger1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_forefinger1",
        "docUrl": null,
        "key": "rightforefinger1",
        "sharedWith": []
      },
      {
        "index": 118,
        "order": 118,
        "name": "right_forefinger2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_forefinger2",
        "docUrl": null,
        "key": "rightforefinger2",
        "sharedWith": []
      },
      {
        "index": 119,
        "order": 119,
        "name": "right_forefinger3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_forefinger3",
        "docUrl": null,
        "key": "rightforefinger3",
        "sharedWith": []
      },
      {
        "index": 120,
        "order": 120,
        "name": "right_forefinger4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_forefinger4",
        "docUrl": null,
        "key": "rightforefinger4",
        "sharedWith": []
      },
      {
        "index": 121,
        "order": 121,
        "name": "right_middle_finger1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_middle_finger1",
        "docUrl": null,
        "key": "rightmiddlefinger1",
        "sharedWith": []
      },
      {
        "index": 122,
        "order": 122,
        "name": "right_middle_finger2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_middle_finger2",
        "docUrl": null,
        "key": "rightmiddlefinger2",
        "sharedWith": []
      },
      {
        "index": 123,
        "order": 123,
        "name": "right_middle_finger3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_middle_finger3",
        "docUrl": null,
        "key": "rightmiddlefinger3",
        "sharedWith": []
      },
      {
        "index": 124,
        "order": 124,
        "name": "right_middle_finger4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_middle_finger4",
        "docUrl": null,
        "key": "rightmiddlefinger4",
        "sharedWith": []
      },
      {
        "index": 125,
        "order": 125,
        "name": "right_ring_finger1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_ring_finger1",
        "docUrl": null,
        "key": "rightringfinger1",
        "sharedWith": []
      },
      {
        "index": 126,
        "order": 126,
        "name": "right_ring_finger2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_ring_finger2",
        "docUrl": null,
        "key": "rightringfinger2",
        "sharedWith": []
      },
      {
        "index": 127,
        "order": 127,
        "name": "right_ring_finger3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_ring_finger3",
        "docUrl": null,
        "key": "rightringfinger3",
        "sharedWith": []
      },
      {
        "index": 128,
        "order": 128,
        "name": "right_ring_finger4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_ring_finger4",
        "docUrl": null,
        "key": "rightringfinger4",
        "sharedWith": []
      },
      {
        "index": 129,
        "order": 129,
        "name": "right_pinky_finger1",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_pinky_finger1",
        "docUrl": null,
        "key": "rightpinkyfinger1",
        "sharedWith": []
      },
      {
        "index": 130,
        "order": 130,
        "name": "right_pinky_finger2",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_pinky_finger2",
        "docUrl": null,
        "key": "rightpinkyfinger2",
        "sharedWith": []
      },
      {
        "index": 131,
        "order": 131,
        "name": "right_pinky_finger3",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_pinky_finger3",
        "docUrl": null,
        "key": "rightpinkyfinger3",
        "sharedWith": []
      },
      {
        "index": 132,
        "order": 132,
        "name": "right_pinky_finger4",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": "left_pinky_finger4",
        "docUrl": null,
        "key": "rightpinkyfinger4",
        "sharedWith": []
      }
    ],
    "excluded": [],
    "crossChecks": [
      "MMPose keypoint_info ids run 0 to N-1",
      "its first 17 names are identical to MMPose's COCO 17, in the same order"
    ],
    "checkSources": [
      "mmposeCoco"
    ],
    "usedBy": [
      {
        "modelId": "rtmpose",
        "model": "RTMPose WholeBody 2d models (MMPose: RTMPose, RTMW and DWPose-distilled checkpoints)",
        "sourceId": "rtmposeReadme",
        "evidence": "WholeBody 2d (133 Keypoints): Keypoints are defined as COCO-WholeBody. For details please refer to the meta info."
      }
    ],
    "notes": [],
    "datasetInfo": {
      "dataset": "coco_wholebody",
      "title": "Whole-Body Human Pose Estimation in the Wild",
      "year": "2020",
      "homepage": "https://github.com/jin-s13/COCO-WholeBody/"
    },
    "platforms": null
  },
  {
    "slug": "openpose-body-25",
    "name": "OpenPose BODY_25",
    "shortName": "OpenPose BODY_25",
    "family": "OpenPose",
    "sourceId": "openposeParams",
    "nameSource": "POSE_BODY_25_BODY_PARTS in OpenPose's src/openpose/pose/poseParameters.cpp",
    "indexed": true,
    "points": [
      {
        "index": 0,
        "order": 0,
        "name": "Nose",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "nose",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "openpose-coco-18",
          "apple-vision-2d"
        ]
      },
      {
        "index": 1,
        "order": 1,
        "name": "Neck",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "neck",
        "sharedWith": [
          "halpe-26",
          "openpose-coco-18",
          "apple-vision-2d"
        ]
      },
      {
        "index": 2,
        "order": 2,
        "name": "RShoulder",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rshoulder",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 3,
        "order": 3,
        "name": "RElbow",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "relbow",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 4,
        "order": 4,
        "name": "RWrist",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rwrist",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 5,
        "order": 5,
        "name": "LShoulder",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lshoulder",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 6,
        "order": 6,
        "name": "LElbow",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lelbow",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 7,
        "order": 7,
        "name": "LWrist",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lwrist",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 8,
        "order": 8,
        "name": "MidHip",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "midhip",
        "sharedWith": []
      },
      {
        "index": 9,
        "order": 9,
        "name": "RHip",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rhip",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 10,
        "order": 10,
        "name": "RKnee",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rknee",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 11,
        "order": 11,
        "name": "RAnkle",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rankle",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 12,
        "order": 12,
        "name": "LHip",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lhip",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 13,
        "order": 13,
        "name": "LKnee",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lknee",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 14,
        "order": 14,
        "name": "LAnkle",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lankle",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 15,
        "order": 15,
        "name": "REye",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "reye",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 16,
        "order": 16,
        "name": "LEye",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leye",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 17,
        "order": 17,
        "name": "REar",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rear",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 18,
        "order": 18,
        "name": "LEar",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lear",
        "sharedWith": [
          "openpose-coco-18"
        ]
      },
      {
        "index": 19,
        "order": 19,
        "name": "LBigToe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lbigtoe",
        "sharedWith": []
      },
      {
        "index": 20,
        "order": 20,
        "name": "LSmallToe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lsmalltoe",
        "sharedWith": []
      },
      {
        "index": 21,
        "order": 21,
        "name": "LHeel",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lheel",
        "sharedWith": []
      },
      {
        "index": 22,
        "order": 22,
        "name": "RBigToe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rbigtoe",
        "sharedWith": []
      },
      {
        "index": 23,
        "order": 23,
        "name": "RSmallToe",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rsmalltoe",
        "sharedWith": []
      },
      {
        "index": 24,
        "order": 24,
        "name": "RHeel",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rheel",
        "sharedWith": []
      }
    ],
    "excluded": [
      {
        "index": 25,
        "name": "Background",
        "sourceId": "openposeParams",
        "reason": "POSE_NUMBER_BODY_PARTS equivalent to size of std::map POSE_BODY_XX_BODY_PARTS - 1 (removing background)"
      }
    ],
    "crossChecks": [
      "the map's keys run 0 to N-1",
      "the map ends with {25, \"Background\"}, which the source excludes from the body-part count",
      "POSE_NUMBER_BODY_PARTS gives POSE_BODY_25_BODY_PARTS 25 body parts",
      "doc/02_output.md prints the same BODY_25 list"
    ],
    "checkSources": [
      "openposeDoc"
    ],
    "usedBy": [
      {
        "modelId": "openpose",
        "model": "OpenPose BODY_25 model",
        "sourceId": "openposeDoc",
        "evidence": "Pose Output Format (BODY_25)"
      }
    ],
    "notes": [
      {
        "sourceId": "openposeDoc",
        "text": "`pose_keypoints_2d`: Body part locations (`x`, `y`) and detection confidence (`c`) formatted as `x0,y0,c0,x1,y1,c1,...`."
      },
      {
        "sourceId": "openposeDoc",
        "text": "The coordinates `x` and `y` can be normalized to the range [0,1], [-1,1], [0, source size], [0, output size], etc. (see the flag `--keypoint_scale` for more information), while the confidence score (`c`) in the range [0,1]."
      }
    ],
    "datasetInfo": null,
    "platforms": null
  },
  {
    "slug": "openpose-coco-18",
    "name": "OpenPose COCO 18 (PoseModel::COCO_18)",
    "shortName": "OpenPose COCO 18",
    "family": "OpenPose",
    "sourceId": "openposeParams",
    "nameSource": "POSE_COCO_BODY_PARTS in OpenPose's src/openpose/pose/poseParameters.cpp",
    "indexed": true,
    "points": [
      {
        "index": 0,
        "order": 0,
        "name": "Nose",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "nose",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "openpose-body-25",
          "apple-vision-2d"
        ]
      },
      {
        "index": 1,
        "order": 1,
        "name": "Neck",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "neck",
        "sharedWith": [
          "halpe-26",
          "openpose-body-25",
          "apple-vision-2d"
        ]
      },
      {
        "index": 2,
        "order": 2,
        "name": "RShoulder",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rshoulder",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 3,
        "order": 3,
        "name": "RElbow",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "relbow",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 4,
        "order": 4,
        "name": "RWrist",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rwrist",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 5,
        "order": 5,
        "name": "LShoulder",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lshoulder",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 6,
        "order": 6,
        "name": "LElbow",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lelbow",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 7,
        "order": 7,
        "name": "LWrist",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lwrist",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 8,
        "order": 8,
        "name": "RHip",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rhip",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 9,
        "order": 9,
        "name": "RKnee",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rknee",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 10,
        "order": 10,
        "name": "RAnkle",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rankle",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 11,
        "order": 11,
        "name": "LHip",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lhip",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 12,
        "order": 12,
        "name": "LKnee",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lknee",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 13,
        "order": 13,
        "name": "LAnkle",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lankle",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 14,
        "order": 14,
        "name": "REye",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "reye",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 15,
        "order": 15,
        "name": "LEye",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "leye",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 16,
        "order": 16,
        "name": "REar",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "rear",
        "sharedWith": [
          "openpose-body-25"
        ]
      },
      {
        "index": 17,
        "order": 17,
        "name": "LEar",
        "altNames": [],
        "description": null,
        "group": null,
        "swap": null,
        "docUrl": null,
        "key": "lear",
        "sharedWith": [
          "openpose-body-25"
        ]
      }
    ],
    "excluded": [
      {
        "index": 18,
        "name": "Background",
        "sourceId": "openposeParams",
        "reason": "POSE_NUMBER_BODY_PARTS equivalent to size of std::map POSE_BODY_XX_BODY_PARTS - 1 (removing background)"
      }
    ],
    "crossChecks": [
      "the map's keys run 0 to N-1",
      "the map ends with {18, \"Background\"}, which the source excludes from the body-part count",
      "POSE_NUMBER_BODY_PARTS gives POSE_COCO_BODY_PARTS 18 body parts"
    ],
    "checkSources": [],
    "usedBy": [
      {
        "modelId": "openpose",
        "model": "OpenPose COCO model (PoseModel::COCO_18)",
        "sourceId": "openposeDoc",
        "evidence": "Pose Output Format (COCO)"
      }
    ],
    "notes": [
      {
        "sourceId": "openposeDoc",
        "text": "`pose_keypoints_2d`: Body part locations (`x`, `y`) and detection confidence (`c`) formatted as `x0,y0,c0,x1,y1,c1,...`."
      },
      {
        "sourceId": "openposeDoc",
        "text": "The coordinates `x` and `y` can be normalized to the range [0,1], [-1,1], [0, source size], [0, output size], etc. (see the flag `--keypoint_scale` for more information), while the confidence score (`c`) in the range [0,1]."
      }
    ],
    "datasetInfo": null,
    "platforms": null
  },
  {
    "slug": "apple-vision-2d",
    "name": "Apple Vision 2D body pose joints",
    "shortName": "Apple Vision 2D",
    "family": "Apple Vision",
    "sourceId": "appleJoints2d",
    "nameSource": "the static joint-name constants of VNHumanBodyPoseObservation.JointName",
    "indexed": false,
    "points": [
      {
        "index": null,
        "order": 0,
        "name": "leftEar",
        "altNames": [],
        "description": "The left ear.",
        "group": "Head",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/leftear",
        "key": "leftear",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133"
        ]
      },
      {
        "index": null,
        "order": 1,
        "name": "leftEye",
        "altNames": [],
        "description": "The left eye.",
        "group": "Head",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/lefteye",
        "key": "lefteye",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133"
        ]
      },
      {
        "index": null,
        "order": 2,
        "name": "rightEar",
        "altNames": [],
        "description": "The right ear.",
        "group": "Head",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/rightear",
        "key": "rightear",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133"
        ]
      },
      {
        "index": null,
        "order": 3,
        "name": "rightEye",
        "altNames": [],
        "description": "The right eye.",
        "group": "Head",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/righteye",
        "key": "righteye",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133"
        ]
      },
      {
        "index": null,
        "order": 4,
        "name": "neck",
        "altNames": [],
        "description": "The neck.",
        "group": "Head",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/neck",
        "key": "neck",
        "sharedWith": [
          "halpe-26",
          "openpose-body-25",
          "openpose-coco-18"
        ]
      },
      {
        "index": null,
        "order": 5,
        "name": "nose",
        "altNames": [],
        "description": "The nose.",
        "group": "Head",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/nose",
        "key": "nose",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "openpose-body-25",
          "openpose-coco-18"
        ]
      },
      {
        "index": null,
        "order": 6,
        "name": "leftShoulder",
        "altNames": [],
        "description": "The left shoulder.",
        "group": "Arms",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/leftshoulder",
        "key": "leftshoulder",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 7,
        "name": "leftElbow",
        "altNames": [],
        "description": "The left elbow.",
        "group": "Arms",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/leftelbow",
        "key": "leftelbow",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 8,
        "name": "leftWrist",
        "altNames": [],
        "description": "The left wrist.",
        "group": "Arms",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/leftwrist",
        "key": "leftwrist",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 9,
        "name": "rightShoulder",
        "altNames": [],
        "description": "The right shoulder.",
        "group": "Arms",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/rightshoulder",
        "key": "rightshoulder",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 10,
        "name": "rightElbow",
        "altNames": [],
        "description": "The right elbow.",
        "group": "Arms",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/rightelbow",
        "key": "rightelbow",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 11,
        "name": "rightWrist",
        "altNames": [],
        "description": "The right wrist.",
        "group": "Arms",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/rightwrist",
        "key": "rightwrist",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 12,
        "name": "root",
        "altNames": [],
        "description": "The root (waist).",
        "group": "Waist",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/root",
        "key": "root",
        "sharedWith": [
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 13,
        "name": "leftHip",
        "altNames": [],
        "description": "The left hip.",
        "group": "Legs",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/lefthip",
        "key": "lefthip",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 14,
        "name": "leftKnee",
        "altNames": [],
        "description": "The left knee.",
        "group": "Legs",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/leftknee",
        "key": "leftknee",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 15,
        "name": "leftAnkle",
        "altNames": [],
        "description": "The left ankle.",
        "group": "Legs",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/leftankle",
        "key": "leftankle",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 16,
        "name": "rightHip",
        "altNames": [],
        "description": "The right hip.",
        "group": "Legs",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/righthip",
        "key": "righthip",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 17,
        "name": "rightKnee",
        "altNames": [],
        "description": "The right knee.",
        "group": "Legs",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/rightknee",
        "key": "rightknee",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      },
      {
        "index": null,
        "order": 18,
        "name": "rightAnkle",
        "altNames": [],
        "description": "The right ankle.",
        "group": "Legs",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname/rightankle",
        "key": "rightankle",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-3d"
        ]
      }
    ],
    "excluded": [],
    "crossChecks": [
      "no joint constant is marked deprecated",
      "Apple files the constants under 4 topic groups: Head, Arms, Waist, Legs"
    ],
    "checkSources": [],
    "usedBy": [
      {
        "modelId": "apple-vision-2d",
        "model": "Apple Vision VNDetectHumanBodyPoseRequest",
        "sourceId": "appleRequest2d",
        "evidence": "The framework provides the detected body pose as a VNHumanBodyPoseObservation."
      }
    ],
    "notes": [
      {
        "sourceId": "appleJoints2d",
        "text": "VNHumanBodyPoseObservation.JointName: The supported joint names for the body pose."
      }
    ],
    "datasetInfo": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0"
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0"
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0"
      },
      {
        "name": "macOS",
        "introducedAt": "11.0"
      },
      {
        "name": "tvOS",
        "introducedAt": "14.0"
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0"
      }
    ]
  },
  {
    "slug": "apple-vision-3d",
    "name": "Apple Vision 3D body pose joints",
    "shortName": "Apple Vision 3D",
    "family": "Apple Vision",
    "sourceId": "appleJoints3d",
    "nameSource": "the static joint-name constants of VNHumanBodyPose3DObservation.JointName",
    "indexed": false,
    "points": [
      {
        "index": null,
        "order": 0,
        "name": "topHead",
        "altNames": [],
        "description": "A joint name that represents the top of the head.",
        "group": "Getting the Head Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/tophead",
        "key": "tophead",
        "sharedWith": []
      },
      {
        "index": null,
        "order": 1,
        "name": "centerHead",
        "altNames": [],
        "description": "A joint name that represents the center of the head.",
        "group": "Getting the Head Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/centerhead",
        "key": "centerhead",
        "sharedWith": []
      },
      {
        "index": null,
        "order": 2,
        "name": "centerShoulder",
        "altNames": [],
        "description": "A joint name that represents the point between the shoulders.",
        "group": "Getting the Arm Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/centershoulder",
        "key": "centershoulder",
        "sharedWith": []
      },
      {
        "index": null,
        "order": 3,
        "name": "leftShoulder",
        "altNames": [],
        "description": "A joint name that represents the left shoulder.",
        "group": "Getting the Arm Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/leftshoulder",
        "key": "leftshoulder",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 4,
        "name": "rightShoulder",
        "altNames": [],
        "description": "A joint name that represents the right shoulder.",
        "group": "Getting the Arm Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/rightshoulder",
        "key": "rightshoulder",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 5,
        "name": "leftElbow",
        "altNames": [],
        "description": "A joint name that represents the left elbow.",
        "group": "Getting the Arm Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/leftelbow",
        "key": "leftelbow",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 6,
        "name": "rightElbow",
        "altNames": [],
        "description": "A joint name that represents the right elbow.",
        "group": "Getting the Arm Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/rightelbow",
        "key": "rightelbow",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 7,
        "name": "leftWrist",
        "altNames": [],
        "description": "A joint name that represents the left wrist.",
        "group": "Getting the Arm Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/leftwrist",
        "key": "leftwrist",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 8,
        "name": "rightWrist",
        "altNames": [],
        "description": "A joint name that represents the right wrist.",
        "group": "Getting the Arm Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/rightwrist",
        "key": "rightwrist",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 9,
        "name": "leftHip",
        "altNames": [],
        "description": "A joint name that represents the left hip.",
        "group": "Getting the Leg Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/lefthip",
        "key": "lefthip",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 10,
        "name": "rightHip",
        "altNames": [],
        "description": "A joint name that represents the right hip.",
        "group": "Getting the Leg Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/righthip",
        "key": "righthip",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 11,
        "name": "leftKnee",
        "altNames": [],
        "description": "A joint name that represents the left knee.",
        "group": "Getting the Leg Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/leftknee",
        "key": "leftknee",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 12,
        "name": "rightKnee",
        "altNames": [],
        "description": "A joint name that represents the right knee.",
        "group": "Getting the Leg Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/rightknee",
        "key": "rightknee",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 13,
        "name": "leftAnkle",
        "altNames": [],
        "description": "A joint name that represents the left ankle.",
        "group": "Getting the Leg Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/leftankle",
        "key": "leftankle",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 14,
        "name": "rightAnkle",
        "altNames": [],
        "description": "A joint name that represents the right ankle.",
        "group": "Getting the Leg Joint Names",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/rightankle",
        "key": "rightankle",
        "sharedWith": [
          "blazepose-33",
          "ml-kit",
          "coco-17",
          "halpe-26",
          "coco-wholebody-133",
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 15,
        "name": "root",
        "altNames": [],
        "description": "A joint name that represents the point between the left hip and right hip.",
        "group": "Getting the Root Joint Name",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/root",
        "key": "root",
        "sharedWith": [
          "apple-vision-2d"
        ]
      },
      {
        "index": null,
        "order": 16,
        "name": "spine",
        "altNames": [],
        "description": "A joint name that represents the spine.",
        "group": "Getting the Spine",
        "swap": null,
        "docUrl": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname/spine",
        "key": "spine",
        "sharedWith": []
      }
    ],
    "excluded": [],
    "crossChecks": [
      "no joint constant is marked deprecated",
      "Apple files the constants under 5 topic groups: Getting the Head Joint Names, Getting the Arm Joint Names, Getting the Leg Joint Names, Getting the Root Joint Name, Getting the Spine"
    ],
    "checkSources": [],
    "usedBy": [
      {
        "modelId": "apple-vision-3d",
        "model": "Apple Vision VNDetectHumanBodyPose3DRequest",
        "sourceId": "appleRequest3d",
        "evidence": "This request generates a collection of VNHumanBodyPose3DObservation objects that describe the position of each body the request detects."
      }
    ],
    "notes": [
      {
        "sourceId": "appleJoints3d",
        "text": "VNHumanBodyPose3DObservation.JointName: The joint names for a 3D body pose."
      },
      {
        "sourceId": "appleRequest3d",
        "text": "This request generates a collection of VNHumanBodyPose3DObservation objects that describe the position of each body the request detects. If the system allows it, the request uses AVDepthData information to improve the accuracy."
      },
      {
        "sourceId": "appleObservation3d",
        "text": "pointInImage(_:): Returns a 2D point for the joint name you specify, relative to the input image."
      },
      {
        "sourceId": "appleObservation3d",
        "text": "cameraRelativePosition(_:): Returns a position relative to the camera for the body joint you specify."
      },
      {
        "sourceId": "appleObservation3d",
        "text": "bodyHeight: The estimated human body height, in meters."
      },
      {
        "sourceId": "appleObservation3d",
        "text": "cameraOriginMatrix: A transform from the skeleton hip to the camera."
      }
    ],
    "datasetInfo": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0"
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0"
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0"
      },
      {
        "name": "macOS",
        "introducedAt": "14.0"
      },
      {
        "name": "tvOS",
        "introducedAt": "17.0"
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0"
      }
    ]
  }
];

export type PoseCrosswalkRow = {
  /** The shared key (name lowercased, separators removed). */
  key: string;
  /** Display label: the first spelling found in a fixed order of schemes. */
  label: string;
  /** One cell per scheme that has a point with this key. */
  cells: { scheme: string; index: number | null; name: string }[];
};

/** Keys shared by at least two schemes. */
export const POSE_CROSSWALK: PoseCrosswalkRow[] = [
  {
    "key": "nose",
    "label": "nose",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 0,
        "name": "NOSE"
      },
      {
        "scheme": "ml-kit",
        "index": 0,
        "name": "NOSE"
      },
      {
        "scheme": "coco-17",
        "index": 0,
        "name": "nose"
      },
      {
        "scheme": "halpe-26",
        "index": 0,
        "name": "nose"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 0,
        "name": "nose"
      },
      {
        "scheme": "openpose-body-25",
        "index": 0,
        "name": "Nose"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 0,
        "name": "Nose"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "nose"
      }
    ]
  },
  {
    "key": "lefteyeinner",
    "label": "left_eye_inner",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 1,
        "name": "LEFT_EYE_INNER"
      },
      {
        "scheme": "ml-kit",
        "index": 1,
        "name": "LEFT_EYE_INNER"
      }
    ]
  },
  {
    "key": "lefteye",
    "label": "left_eye",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 2,
        "name": "LEFT_EYE"
      },
      {
        "scheme": "ml-kit",
        "index": 2,
        "name": "LEFT_EYE"
      },
      {
        "scheme": "coco-17",
        "index": 1,
        "name": "left_eye"
      },
      {
        "scheme": "halpe-26",
        "index": 1,
        "name": "left_eye"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 1,
        "name": "left_eye"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "leftEye"
      }
    ]
  },
  {
    "key": "lefteyeouter",
    "label": "left_eye_outer",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 3,
        "name": "LEFT_EYE_OUTER"
      },
      {
        "scheme": "ml-kit",
        "index": 3,
        "name": "LEFT_EYE_OUTER"
      }
    ]
  },
  {
    "key": "righteyeinner",
    "label": "right_eye_inner",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 4,
        "name": "RIGHT_EYE_INNER"
      },
      {
        "scheme": "ml-kit",
        "index": 4,
        "name": "RIGHT_EYE_INNER"
      }
    ]
  },
  {
    "key": "righteye",
    "label": "right_eye",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 5,
        "name": "RIGHT_EYE"
      },
      {
        "scheme": "ml-kit",
        "index": 5,
        "name": "RIGHT_EYE"
      },
      {
        "scheme": "coco-17",
        "index": 2,
        "name": "right_eye"
      },
      {
        "scheme": "halpe-26",
        "index": 2,
        "name": "right_eye"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 2,
        "name": "right_eye"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "rightEye"
      }
    ]
  },
  {
    "key": "righteyeouter",
    "label": "right_eye_outer",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 6,
        "name": "RIGHT_EYE_OUTER"
      },
      {
        "scheme": "ml-kit",
        "index": 6,
        "name": "RIGHT_EYE_OUTER"
      }
    ]
  },
  {
    "key": "leftear",
    "label": "left_ear",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 7,
        "name": "LEFT_EAR"
      },
      {
        "scheme": "ml-kit",
        "index": 7,
        "name": "LEFT_EAR"
      },
      {
        "scheme": "coco-17",
        "index": 3,
        "name": "left_ear"
      },
      {
        "scheme": "halpe-26",
        "index": 3,
        "name": "left_ear"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 3,
        "name": "left_ear"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "leftEar"
      }
    ]
  },
  {
    "key": "rightear",
    "label": "right_ear",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 8,
        "name": "RIGHT_EAR"
      },
      {
        "scheme": "ml-kit",
        "index": 8,
        "name": "RIGHT_EAR"
      },
      {
        "scheme": "coco-17",
        "index": 4,
        "name": "right_ear"
      },
      {
        "scheme": "halpe-26",
        "index": 4,
        "name": "right_ear"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 4,
        "name": "right_ear"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "rightEar"
      }
    ]
  },
  {
    "key": "leftshoulder",
    "label": "left_shoulder",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 11,
        "name": "LEFT_SHOULDER"
      },
      {
        "scheme": "ml-kit",
        "index": 11,
        "name": "LEFT_SHOULDER"
      },
      {
        "scheme": "coco-17",
        "index": 5,
        "name": "left_shoulder"
      },
      {
        "scheme": "halpe-26",
        "index": 5,
        "name": "left_shoulder"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 5,
        "name": "left_shoulder"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "leftShoulder"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "leftShoulder"
      }
    ]
  },
  {
    "key": "rightshoulder",
    "label": "right_shoulder",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 12,
        "name": "RIGHT_SHOULDER"
      },
      {
        "scheme": "ml-kit",
        "index": 12,
        "name": "RIGHT_SHOULDER"
      },
      {
        "scheme": "coco-17",
        "index": 6,
        "name": "right_shoulder"
      },
      {
        "scheme": "halpe-26",
        "index": 6,
        "name": "right_shoulder"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 6,
        "name": "right_shoulder"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "rightShoulder"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "rightShoulder"
      }
    ]
  },
  {
    "key": "leftelbow",
    "label": "left_elbow",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 13,
        "name": "LEFT_ELBOW"
      },
      {
        "scheme": "ml-kit",
        "index": 13,
        "name": "LEFT_ELBOW"
      },
      {
        "scheme": "coco-17",
        "index": 7,
        "name": "left_elbow"
      },
      {
        "scheme": "halpe-26",
        "index": 7,
        "name": "left_elbow"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 7,
        "name": "left_elbow"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "leftElbow"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "leftElbow"
      }
    ]
  },
  {
    "key": "rightelbow",
    "label": "right_elbow",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 14,
        "name": "RIGHT_ELBOW"
      },
      {
        "scheme": "ml-kit",
        "index": 14,
        "name": "RIGHT_ELBOW"
      },
      {
        "scheme": "coco-17",
        "index": 8,
        "name": "right_elbow"
      },
      {
        "scheme": "halpe-26",
        "index": 8,
        "name": "right_elbow"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 8,
        "name": "right_elbow"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "rightElbow"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "rightElbow"
      }
    ]
  },
  {
    "key": "leftwrist",
    "label": "left_wrist",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 15,
        "name": "LEFT_WRIST"
      },
      {
        "scheme": "ml-kit",
        "index": 15,
        "name": "LEFT_WRIST"
      },
      {
        "scheme": "coco-17",
        "index": 9,
        "name": "left_wrist"
      },
      {
        "scheme": "halpe-26",
        "index": 9,
        "name": "left_wrist"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 9,
        "name": "left_wrist"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "leftWrist"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "leftWrist"
      }
    ]
  },
  {
    "key": "rightwrist",
    "label": "right_wrist",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 16,
        "name": "RIGHT_WRIST"
      },
      {
        "scheme": "ml-kit",
        "index": 16,
        "name": "RIGHT_WRIST"
      },
      {
        "scheme": "coco-17",
        "index": 10,
        "name": "right_wrist"
      },
      {
        "scheme": "halpe-26",
        "index": 10,
        "name": "right_wrist"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 10,
        "name": "right_wrist"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "rightWrist"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "rightWrist"
      }
    ]
  },
  {
    "key": "leftpinky",
    "label": "left_pinky",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 17,
        "name": "LEFT_PINKY"
      },
      {
        "scheme": "ml-kit",
        "index": 17,
        "name": "LEFT_PINKY"
      }
    ]
  },
  {
    "key": "rightpinky",
    "label": "right_pinky",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 18,
        "name": "RIGHT_PINKY"
      },
      {
        "scheme": "ml-kit",
        "index": 18,
        "name": "RIGHT_PINKY"
      }
    ]
  },
  {
    "key": "leftindex",
    "label": "left_index",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 19,
        "name": "LEFT_INDEX"
      },
      {
        "scheme": "ml-kit",
        "index": 19,
        "name": "LEFT_INDEX"
      }
    ]
  },
  {
    "key": "rightindex",
    "label": "right_index",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 20,
        "name": "RIGHT_INDEX"
      },
      {
        "scheme": "ml-kit",
        "index": 20,
        "name": "RIGHT_INDEX"
      }
    ]
  },
  {
    "key": "leftthumb",
    "label": "left_thumb",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 21,
        "name": "LEFT_THUMB"
      },
      {
        "scheme": "ml-kit",
        "index": 21,
        "name": "LEFT_THUMB"
      }
    ]
  },
  {
    "key": "rightthumb",
    "label": "right_thumb",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 22,
        "name": "RIGHT_THUMB"
      },
      {
        "scheme": "ml-kit",
        "index": 22,
        "name": "RIGHT_THUMB"
      }
    ]
  },
  {
    "key": "lefthip",
    "label": "left_hip",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 23,
        "name": "LEFT_HIP"
      },
      {
        "scheme": "ml-kit",
        "index": 23,
        "name": "LEFT_HIP"
      },
      {
        "scheme": "coco-17",
        "index": 11,
        "name": "left_hip"
      },
      {
        "scheme": "halpe-26",
        "index": 11,
        "name": "left_hip"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 11,
        "name": "left_hip"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "leftHip"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "leftHip"
      }
    ]
  },
  {
    "key": "righthip",
    "label": "right_hip",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 24,
        "name": "RIGHT_HIP"
      },
      {
        "scheme": "ml-kit",
        "index": 24,
        "name": "RIGHT_HIP"
      },
      {
        "scheme": "coco-17",
        "index": 12,
        "name": "right_hip"
      },
      {
        "scheme": "halpe-26",
        "index": 12,
        "name": "right_hip"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 12,
        "name": "right_hip"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "rightHip"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "rightHip"
      }
    ]
  },
  {
    "key": "leftknee",
    "label": "left_knee",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 25,
        "name": "LEFT_KNEE"
      },
      {
        "scheme": "ml-kit",
        "index": 25,
        "name": "LEFT_KNEE"
      },
      {
        "scheme": "coco-17",
        "index": 13,
        "name": "left_knee"
      },
      {
        "scheme": "halpe-26",
        "index": 13,
        "name": "left_knee"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 13,
        "name": "left_knee"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "leftKnee"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "leftKnee"
      }
    ]
  },
  {
    "key": "rightknee",
    "label": "right_knee",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 26,
        "name": "RIGHT_KNEE"
      },
      {
        "scheme": "ml-kit",
        "index": 26,
        "name": "RIGHT_KNEE"
      },
      {
        "scheme": "coco-17",
        "index": 14,
        "name": "right_knee"
      },
      {
        "scheme": "halpe-26",
        "index": 14,
        "name": "right_knee"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 14,
        "name": "right_knee"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "rightKnee"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "rightKnee"
      }
    ]
  },
  {
    "key": "leftankle",
    "label": "left_ankle",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 27,
        "name": "LEFT_ANKLE"
      },
      {
        "scheme": "ml-kit",
        "index": 27,
        "name": "LEFT_ANKLE"
      },
      {
        "scheme": "coco-17",
        "index": 15,
        "name": "left_ankle"
      },
      {
        "scheme": "halpe-26",
        "index": 15,
        "name": "left_ankle"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 15,
        "name": "left_ankle"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "leftAnkle"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "leftAnkle"
      }
    ]
  },
  {
    "key": "rightankle",
    "label": "right_ankle",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 28,
        "name": "RIGHT_ANKLE"
      },
      {
        "scheme": "ml-kit",
        "index": 28,
        "name": "RIGHT_ANKLE"
      },
      {
        "scheme": "coco-17",
        "index": 16,
        "name": "right_ankle"
      },
      {
        "scheme": "halpe-26",
        "index": 16,
        "name": "right_ankle"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 16,
        "name": "right_ankle"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "rightAnkle"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "rightAnkle"
      }
    ]
  },
  {
    "key": "leftheel",
    "label": "left_heel",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 29,
        "name": "LEFT_HEEL"
      },
      {
        "scheme": "ml-kit",
        "index": 29,
        "name": "LEFT_HEEL"
      },
      {
        "scheme": "halpe-26",
        "index": 24,
        "name": "left_heel"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 19,
        "name": "left_heel"
      }
    ]
  },
  {
    "key": "rightheel",
    "label": "right_heel",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 30,
        "name": "RIGHT_HEEL"
      },
      {
        "scheme": "ml-kit",
        "index": 30,
        "name": "RIGHT_HEEL"
      },
      {
        "scheme": "halpe-26",
        "index": 25,
        "name": "right_heel"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 22,
        "name": "right_heel"
      }
    ]
  },
  {
    "key": "leftfootindex",
    "label": "left_foot_index",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 31,
        "name": "LEFT_FOOT_INDEX"
      },
      {
        "scheme": "ml-kit",
        "index": 31,
        "name": "LEFT_FOOT_INDEX"
      }
    ]
  },
  {
    "key": "rightfootindex",
    "label": "right_foot_index",
    "cells": [
      {
        "scheme": "blazepose-33",
        "index": 32,
        "name": "RIGHT_FOOT_INDEX"
      },
      {
        "scheme": "ml-kit",
        "index": 32,
        "name": "RIGHT_FOOT_INDEX"
      }
    ]
  },
  {
    "key": "neck",
    "label": "neck",
    "cells": [
      {
        "scheme": "halpe-26",
        "index": 18,
        "name": "neck"
      },
      {
        "scheme": "openpose-body-25",
        "index": 1,
        "name": "Neck"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 1,
        "name": "Neck"
      },
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "neck"
      }
    ]
  },
  {
    "key": "leftbigtoe",
    "label": "left_big_toe",
    "cells": [
      {
        "scheme": "halpe-26",
        "index": 20,
        "name": "left_big_toe"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 17,
        "name": "left_big_toe"
      }
    ]
  },
  {
    "key": "rightbigtoe",
    "label": "right_big_toe",
    "cells": [
      {
        "scheme": "halpe-26",
        "index": 21,
        "name": "right_big_toe"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 20,
        "name": "right_big_toe"
      }
    ]
  },
  {
    "key": "leftsmalltoe",
    "label": "left_small_toe",
    "cells": [
      {
        "scheme": "halpe-26",
        "index": 22,
        "name": "left_small_toe"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 18,
        "name": "left_small_toe"
      }
    ]
  },
  {
    "key": "rightsmalltoe",
    "label": "right_small_toe",
    "cells": [
      {
        "scheme": "halpe-26",
        "index": 23,
        "name": "right_small_toe"
      },
      {
        "scheme": "coco-wholebody-133",
        "index": 21,
        "name": "right_small_toe"
      }
    ]
  },
  {
    "key": "rshoulder",
    "label": "RShoulder",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 2,
        "name": "RShoulder"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 2,
        "name": "RShoulder"
      }
    ]
  },
  {
    "key": "relbow",
    "label": "RElbow",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 3,
        "name": "RElbow"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 3,
        "name": "RElbow"
      }
    ]
  },
  {
    "key": "rwrist",
    "label": "RWrist",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 4,
        "name": "RWrist"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 4,
        "name": "RWrist"
      }
    ]
  },
  {
    "key": "lshoulder",
    "label": "LShoulder",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 5,
        "name": "LShoulder"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 5,
        "name": "LShoulder"
      }
    ]
  },
  {
    "key": "lelbow",
    "label": "LElbow",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 6,
        "name": "LElbow"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 6,
        "name": "LElbow"
      }
    ]
  },
  {
    "key": "lwrist",
    "label": "LWrist",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 7,
        "name": "LWrist"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 7,
        "name": "LWrist"
      }
    ]
  },
  {
    "key": "rhip",
    "label": "RHip",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 9,
        "name": "RHip"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 8,
        "name": "RHip"
      }
    ]
  },
  {
    "key": "rknee",
    "label": "RKnee",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 10,
        "name": "RKnee"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 9,
        "name": "RKnee"
      }
    ]
  },
  {
    "key": "rankle",
    "label": "RAnkle",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 11,
        "name": "RAnkle"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 10,
        "name": "RAnkle"
      }
    ]
  },
  {
    "key": "lhip",
    "label": "LHip",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 12,
        "name": "LHip"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 11,
        "name": "LHip"
      }
    ]
  },
  {
    "key": "lknee",
    "label": "LKnee",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 13,
        "name": "LKnee"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 12,
        "name": "LKnee"
      }
    ]
  },
  {
    "key": "lankle",
    "label": "LAnkle",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 14,
        "name": "LAnkle"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 13,
        "name": "LAnkle"
      }
    ]
  },
  {
    "key": "reye",
    "label": "REye",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 15,
        "name": "REye"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 14,
        "name": "REye"
      }
    ]
  },
  {
    "key": "leye",
    "label": "LEye",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 16,
        "name": "LEye"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 15,
        "name": "LEye"
      }
    ]
  },
  {
    "key": "rear",
    "label": "REar",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 17,
        "name": "REar"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 16,
        "name": "REar"
      }
    ]
  },
  {
    "key": "lear",
    "label": "LEar",
    "cells": [
      {
        "scheme": "openpose-body-25",
        "index": 18,
        "name": "LEar"
      },
      {
        "scheme": "openpose-coco-18",
        "index": 17,
        "name": "LEar"
      }
    ]
  },
  {
    "key": "root",
    "label": "root",
    "cells": [
      {
        "scheme": "apple-vision-2d",
        "index": null,
        "name": "root"
      },
      {
        "scheme": "apple-vision-3d",
        "index": null,
        "name": "root"
      }
    ]
  }
];
