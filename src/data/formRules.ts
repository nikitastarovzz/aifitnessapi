/**
 * Open exercise form-rules dataset: the joint-angle thresholds that licensed
 * open-source exercise trackers ship, per exercise, each with the verbatim
 * line it was read from.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-form-rules.mjs
 * (then `npm run datasets`). Fetched: 2026-11-14
 *
 * Every `value` was captured from `quote` after the generator found `quote`
 * in the fetched file; `usage` is the line that applies it and
 * `measureQuote` the line that computes what it is compared with. A null
 * value carries `nullReason`. These are the projects' own choices for their
 * own setups, not biomechanical standards.
 */

/** The date the generator last read its sources. */
export const FORM_RULES_FETCHED_ON = "2026-11-14";

export type FormRuleSource = {
  id: string;
  name: string;
  repo: string;
  repoUrl: string;
  branch: string;
  license: string;
  licenseUrl: string;
  /** The LICENSE file's opening words, checked against the fetched file. */
  licenseQuote: string;
  licenseSha256: string | null;
  poseModel: string;
  /** The line that computes the source's angles. */
  angleMethodQuote: string | null;
  angleMethodSource: string | null;
  /** A warning the project's own README gives, verbatim; null when none. */
  caveat: string | null;
  files: { key: string; url: string; page: string; path: string; fetchedOn: string | null; sha256: string | null }[];
};

export const FORM_RULE_SOURCES: FormRuleSource[] = [
  {
    "id": "ultralytics",
    "name": "Ultralytics AIGym (workouts monitoring solution)",
    "repo": "ultralytics/ultralytics",
    "repoUrl": "https://github.com/ultralytics/ultralytics",
    "branch": "main",
    "license": "AGPL-3.0",
    "licenseUrl": "https://github.com/ultralytics/ultralytics/blob/main/LICENSE",
    "licenseQuote": "GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007",
    "licenseSha256": "0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0",
    "poseModel": "Ultralytics YOLO pose (COCO 17 keypoints)",
    "angleMethodQuote": "radians = math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])",
    "angleMethodSource": "https://github.com/ultralytics/ultralytics/blob/main/ultralytics/solutions/solutions.py#L474",
    "caveat": null,
    "files": [
      {
        "key": "config",
        "url": "https://raw.githubusercontent.com/ultralytics/ultralytics/main/ultralytics/solutions/config.py",
        "page": "https://github.com/ultralytics/ultralytics/blob/main/ultralytics/solutions/config.py",
        "path": "ultralytics/solutions/config.py",
        "fetchedOn": "2026-11-14",
        "sha256": "dfa8a452eba394235deb0ac73908c0992147bf20e9449d48c0048574cb71d316"
      },
      {
        "key": "gym",
        "url": "https://raw.githubusercontent.com/ultralytics/ultralytics/main/ultralytics/solutions/ai_gym.py",
        "page": "https://github.com/ultralytics/ultralytics/blob/main/ultralytics/solutions/ai_gym.py",
        "path": "ultralytics/solutions/ai_gym.py",
        "fetchedOn": "2026-11-14",
        "sha256": "3c08d9a730e6c888f121f6cea284eb166367640b6126420c345f9c98e1f4477b"
      },
      {
        "key": "angle",
        "url": "https://raw.githubusercontent.com/ultralytics/ultralytics/main/ultralytics/solutions/solutions.py",
        "page": "https://github.com/ultralytics/ultralytics/blob/main/ultralytics/solutions/solutions.py",
        "path": "ultralytics/solutions/solutions.py",
        "fetchedOn": "2026-11-14",
        "sha256": "24b8bb8df7409c0ffdfc0ca2b65c4029133c7f2d67b0efe2490fba508ac809f3"
      },
      {
        "key": "docs",
        "url": "https://raw.githubusercontent.com/ultralytics/ultralytics/main/docs/en/guides/workouts-monitoring.md",
        "page": "https://github.com/ultralytics/ultralytics/blob/main/docs/en/guides/workouts-monitoring.md",
        "path": "docs/en/guides/workouts-monitoring.md",
        "fetchedOn": "2026-11-14",
        "sha256": "c924d2ceeca2d93d417a8db7b9166a9f0f07ba102f6ccb369b78743a05557513"
      }
    ]
  },
  {
    "id": "poseTrainer",
    "name": "Pose Trainer (Steven Chen and Richard Yang)",
    "repo": "stevenzchen/pose-trainer",
    "repoUrl": "https://github.com/stevenzchen/pose-trainer",
    "branch": "master",
    "license": "GPL-3.0",
    "licenseUrl": "https://github.com/stevenzchen/pose-trainer/blob/master/LICENSE",
    "licenseQuote": "GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007",
    "licenseSha256": "3972dc9744f6499f0f9b2dbf76696f2ae7ad8af9b23dde66d6af86c9dfb36986",
    "poseModel": "OpenPose",
    "angleMethodQuote": "upper_arm_forearm_angles = np.degrees(np.arccos(np.clip(np.sum(np.multiply(upper_arm_vecs, forearm_vecs), axis=1), -1.0, 1.0)))",
    "angleMethodSource": "https://github.com/stevenzchen/pose-trainer/blob/master/evaluate.py#L60",
    "caveat": "WARNING: This code is experimental, and is no longer maintained or supported. It is not expected to work.",
    "files": [
      {
        "key": "evaluate",
        "url": "https://raw.githubusercontent.com/stevenzchen/pose-trainer/master/evaluate.py",
        "page": "https://github.com/stevenzchen/pose-trainer/blob/master/evaluate.py",
        "path": "evaluate.py",
        "fetchedOn": "2026-11-14",
        "sha256": "aac62d08f8eea7883e5eb47ebd8e3de53d700a3982cb3d4cc7463e4f79382a7a"
      },
      {
        "key": "readme",
        "url": "https://raw.githubusercontent.com/stevenzchen/pose-trainer/master/README.md",
        "page": "https://github.com/stevenzchen/pose-trainer/blob/master/README.md",
        "path": "README.md",
        "fetchedOn": "2026-11-14",
        "sha256": "0c361a1152f7a85786180980a6aa6f212ae8654ed4778ccedfbe0a51ce7d39fe"
      }
    ]
  },
  {
    "id": "exerciseCorrection",
    "name": "Exercise-Correction (Ngô Hồng Quốc Bảo)",
    "repo": "NgoQuocBao1010/Exercise-Correction",
    "repoUrl": "https://github.com/NgoQuocBao1010/Exercise-Correction",
    "branch": "main",
    "license": "MIT",
    "licenseUrl": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/LICENSE",
    "licenseQuote": "MIT License",
    "licenseSha256": "49305f2ad4dab9219652844c771a3a8fd3032c030e31f9151b52f117467a538e",
    "poseModel": "MediaPipe Pose (BlazePose 33 landmarks)",
    "angleMethodQuote": "angleInDeg = angleInDeg if angleInDeg <= 180 else 360 - angleInDeg",
    "angleMethodSource": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/utils.py#L35",
    "caveat": null,
    "files": [
      {
        "key": "curl",
        "url": "https://raw.githubusercontent.com/NgoQuocBao1010/Exercise-Correction/main/web/server/detection/bicep_curl.py",
        "page": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/bicep_curl.py",
        "path": "web/server/detection/bicep_curl.py",
        "fetchedOn": "2026-11-14",
        "sha256": "f5d9ff84da762c692407dc136240e98612c3e1434f4add2da2dc75386ec1fa23"
      },
      {
        "key": "lunge",
        "url": "https://raw.githubusercontent.com/NgoQuocBao1010/Exercise-Correction/main/web/server/detection/lunge.py",
        "page": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/lunge.py",
        "path": "web/server/detection/lunge.py",
        "fetchedOn": "2026-11-14",
        "sha256": "e390497ba7571a85f51ec4eca6216d218ce201b313a84916f028ae480b372101"
      },
      {
        "key": "squat",
        "url": "https://raw.githubusercontent.com/NgoQuocBao1010/Exercise-Correction/main/web/server/detection/squat.py",
        "page": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/squat.py",
        "path": "web/server/detection/squat.py",
        "fetchedOn": "2026-11-14",
        "sha256": "89eefc3ed9dc29f0b12bc2b34ebdb800395663b5aa64fe7e50b3437d97b72d40"
      },
      {
        "key": "plank",
        "url": "https://raw.githubusercontent.com/NgoQuocBao1010/Exercise-Correction/main/web/server/detection/plank.py",
        "page": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/plank.py",
        "path": "web/server/detection/plank.py",
        "fetchedOn": "2026-11-14",
        "sha256": "f7278e9829d2fcedf81c9555f8b55497d2996f30fff8f5e2395b846af5a5f55d"
      },
      {
        "key": "utils",
        "url": "https://raw.githubusercontent.com/NgoQuocBao1010/Exercise-Correction/main/web/server/detection/utils.py",
        "page": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/utils.py",
        "path": "web/server/detection/utils.py",
        "fetchedOn": "2026-11-14",
        "sha256": "509b0bce7e7b76339d95033088187154af303e45e2655c2e54cdc0b17a0b222f"
      }
    ]
  }
];

export type FormRuleExercise = { id: string; name: string; motion: string };

export const FORM_RULE_EXERCISES: FormRuleExercise[] = [
  {
    "id": "squat",
    "name": "Squat",
    "motion": "/motion/squat-detection-pose-estimation"
  },
  {
    "id": "push-up",
    "name": "Push-up",
    "motion": "/motion/push-up-counter-computer-vision"
  },
  {
    "id": "lunge",
    "name": "Lunge",
    "motion": "/motion/lunge-detection-pose-estimation"
  },
  {
    "id": "plank",
    "name": "Plank",
    "motion": "/motion/plank-detection-pose-estimation"
  },
  {
    "id": "bicep-curl",
    "name": "Bicep curl",
    "motion": "/motion/bicep-curl-counter-pose-estimation"
  },
  {
    "id": "shoulder-press",
    "name": "Shoulder press",
    "motion": "/motion/overhead-press-pose-estimation"
  },
  {
    "id": "deadlift",
    "name": "Deadlift",
    "motion": "/motion/deadlift-pose-estimation"
  }
];

export type FormRule = {
  id: string;
  exercise: string;
  exerciseName: string;
  /** rep-count: a phase boundary; form-check: an error rule; hold: an isometric rule. */
  purpose: "rep-count" | "form-check" | "hold";
  role: string;
  measure: "joint-angle" | "segment-angle" | "range-of-motion" | "ratio" | "frames";
  joint: string | null;
  /** The points as the source names them, vertex in the middle for a three-point angle. */
  points: string[] | null;
  /** COCO 17 indices, where the source names indices rather than points. */
  keypointIndices: number[] | null;
  comparison: ">" | "<" | ">=" | "<=" | "within" | null;
  unit: "degrees" | "ratio" | "frames";
  /** What crossing the value does in the source, in our words; the usage quote is the evidence. */
  meaning: string;
  sourceId: string | null;
  value: number | null;
  /** The upper bound of a "within" range. */
  value2: number | null;
  /** The source file and line. */
  source: string | null;
  quote: string | null;
  usage: string | null;
  measureQuote: string | null;
  /** For a null row: the source line that shows why it states no number. */
  reasonQuote: string | null;
  nullReason: string | null;
};

export const FORM_RULES: FormRule[] = [
  {
    "id": "squat-rep-count-null",
    "exercise": "squat",
    "exerciseName": "Squat",
    "purpose": "rep-count",
    "role": "top-and-bottom",
    "measure": "joint-angle",
    "joint": "knee",
    "points": [
      "hip",
      "knee",
      "ankle"
    ],
    "keypointIndices": null,
    "comparison": null,
    "unit": "degrees",
    "meaning": "Top and bottom knee angles for counting squat reps.",
    "sourceId": "exerciseCorrection",
    "value": null,
    "value2": null,
    "source": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/squat.py#L158",
    "quote": null,
    "usage": null,
    "measureQuote": null,
    "reasonQuote": "ML_MODEL_PATH = get_static_file_url(\"model/squat_model.pkl\")",
    "nullReason": "The one licensed squat source read counts squat stages with a trained classifier, not an angle threshold, so it states no top or bottom knee angle. The project that gave the squat angles here until November 2026 (thphuc05/PythonExcercisePoseEstimation) answered 404 on 2026-11-14 and was dropped."
  },
  {
    "id": "squat-stance-ratio-exercise-correction",
    "exercise": "squat",
    "exerciseName": "Squat",
    "purpose": "form-check",
    "role": "range",
    "measure": "ratio",
    "joint": "stance",
    "points": null,
    "keypointIndices": null,
    "comparison": "within",
    "unit": "ratio",
    "meaning": "Foot placement: foot width divided by shoulder width must fall within this range.",
    "sourceId": "exerciseCorrection",
    "value": 1.2,
    "value2": 2.8,
    "source": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/squat.py#L162",
    "quote": "FOOT_SHOULDER_RATIO_THRESHOLDS = [1.2, 2.8]",
    "usage": "if min_ratio_foot_shoulder <= foot_shoulder_ratio <= max_ratio_foot_shoulder:",
    "measureQuote": "foot_shoulder_ratio = round(foot_width / shoulder_width, 1)",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "push-up-elbow-top-ultralytics",
    "exercise": "push-up",
    "exerciseName": "Push-up",
    "purpose": "rep-count",
    "role": "top",
    "measure": "joint-angle",
    "joint": "elbow",
    "points": [
      "right_shoulder",
      "right_elbow",
      "right_wrist"
    ],
    "keypointIndices": [
      6,
      8,
      10
    ],
    "comparison": ">",
    "unit": "degrees",
    "meaning": "Up: angle above this sets the stage to up. The documented default keypoints are for push-ups.",
    "sourceId": "ultralytics",
    "value": 145,
    "value2": null,
    "source": "https://github.com/ultralytics/ultralytics/blob/main/ultralytics/solutions/config.py#L82",
    "quote": "up_angle: float = 145.0",
    "usage": "elif state[\"angle\"] > self.up_angle:",
    "measureQuote": "kpts=[6, 8, 10],  # keypoints for monitoring specific exercise, by default it's for pushup",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "push-up-elbow-bottom-ultralytics",
    "exercise": "push-up",
    "exerciseName": "Push-up",
    "purpose": "rep-count",
    "role": "bottom",
    "measure": "joint-angle",
    "joint": "elbow",
    "points": [
      "right_shoulder",
      "right_elbow",
      "right_wrist"
    ],
    "keypointIndices": [
      6,
      8,
      10
    ],
    "comparison": "<",
    "unit": "degrees",
    "meaning": "Down: angle below this sets the stage to down, and counts a rep if the stage was up (the source counts on reaching the bottom, not on the return).",
    "sourceId": "ultralytics",
    "value": 90,
    "value2": null,
    "source": "https://github.com/ultralytics/ultralytics/blob/main/ultralytics/solutions/config.py#L83",
    "quote": "down_angle: float = 90.0",
    "usage": "if state[\"angle\"] < self.down_angle: if state[\"stage\"] == \"up\": state[\"count\"] += 1",
    "measureQuote": "kpts=[6, 8, 10],  # keypoints for monitoring specific exercise, by default it's for pushup",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "lunge-knee-bottom-range-exercise-correction",
    "exercise": "lunge",
    "exerciseName": "Lunge",
    "purpose": "form-check",
    "role": "range",
    "measure": "joint-angle",
    "joint": "knee",
    "points": [
      "hip",
      "knee",
      "ankle"
    ],
    "keypointIndices": null,
    "comparison": "within",
    "unit": "degrees",
    "meaning": "At the bottom (the source's down stage): each knee angle must fall within this range, or the rep is flagged with a knee-angle error.",
    "sourceId": "exerciseCorrection",
    "value": 60,
    "value2": 125,
    "source": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/lunge.py#L183",
    "quote": "KNEE_ANGLE_THRESHOLD = [60, 125]",
    "usage": "if angle_thresholds[0] <= results[\"right\"][\"angle\"] <= angle_thresholds[1]:",
    "measureQuote": "results[\"right\"][\"angle\"] = calculate_angle(right_hip, right_knee, right_ankle)",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "lunge-rep-count-null",
    "exercise": "lunge",
    "exerciseName": "Lunge",
    "purpose": "rep-count",
    "role": "top-and-bottom",
    "measure": "joint-angle",
    "joint": "knee",
    "points": [
      "hip",
      "knee",
      "ankle"
    ],
    "keypointIndices": null,
    "comparison": null,
    "unit": "degrees",
    "meaning": "Top and bottom knee angles for counting lunge reps.",
    "sourceId": "exerciseCorrection",
    "value": null,
    "value2": null,
    "source": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/lunge.py#L178",
    "quote": null,
    "usage": null,
    "measureQuote": null,
    "reasonQuote": "STAGE_ML_MODEL_PATH = get_static_file_url(\"model/lunge_stage_model.pkl\")",
    "nullReason": "The one licensed lunge source read counts lunge stages with a trained classifier, not an angle threshold, so it states no top or bottom angle. The peer-reviewed state-machine definition cited on /motion/lunge-detection-pose-estimation is on a host the build environment could not reach on the fetch date."
  },
  {
    "id": "plank-hold-null",
    "exercise": "plank",
    "exerciseName": "Plank",
    "purpose": "hold",
    "role": "minimum",
    "measure": "joint-angle",
    "joint": "hip",
    "points": [
      "knee",
      "hip",
      "shoulder"
    ],
    "keypointIndices": null,
    "comparison": null,
    "unit": "degrees",
    "meaning": "The hip angle a plank must hold, and how long before the hold counts.",
    "sourceId": "exerciseCorrection",
    "value": null,
    "value2": null,
    "source": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/plank.py#L14",
    "quote": null,
    "usage": null,
    "measureQuote": null,
    "reasonQuote": "ML_MODEL_PATH = get_static_file_url(\"model/plank_model.pkl\")",
    "nullReason": "The one licensed plank source read judges plank form with a trained classifier, not an angle threshold, so it states no hip angle and no hold time. The project that gave both here until November 2026 (thphuc05/PythonExcercisePoseEstimation) answered 404 on 2026-11-14 and was dropped."
  },
  {
    "id": "bicep-curl-elbow-top-exercise-correction",
    "exercise": "bicep-curl",
    "exerciseName": "Bicep curl",
    "purpose": "rep-count",
    "role": "top",
    "measure": "joint-angle",
    "joint": "elbow",
    "points": [
      "shoulder",
      "elbow",
      "wrist"
    ],
    "keypointIndices": null,
    "comparison": ">",
    "unit": "degrees",
    "meaning": "Arm extended (the source's down stage): elbow angle above this.",
    "sourceId": "exerciseCorrection",
    "value": 120,
    "value2": null,
    "source": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/bicep_curl.py#L244",
    "quote": "STAGE_DOWN_THRESHOLD = 120",
    "usage": "if bicep_curl_angle > self.stage_down_threshold:",
    "measureQuote": "bicep_curl_angle = int(calculate_angle(self.shoulder, self.elbow, self.wrist))",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "bicep-curl-elbow-bottom-exercise-correction",
    "exercise": "bicep-curl",
    "exerciseName": "Bicep curl",
    "purpose": "rep-count",
    "role": "bottom",
    "measure": "joint-angle",
    "joint": "elbow",
    "points": [
      "shoulder",
      "elbow",
      "wrist"
    ],
    "keypointIndices": null,
    "comparison": "<",
    "unit": "degrees",
    "meaning": "Curled (the source's up stage): elbow angle below this, after the arm was extended, counts a rep (the source counts on reaching the curl, not on the return).",
    "sourceId": "exerciseCorrection",
    "value": 100,
    "value2": null,
    "source": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/bicep_curl.py#L243",
    "quote": "STAGE_UP_THRESHOLD = 100",
    "usage": "elif bicep_curl_angle < self.stage_up_threshold and self.stage == \"down\":",
    "measureQuote": "bicep_curl_angle = int(calculate_angle(self.shoulder, self.elbow, self.wrist))",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "bicep-curl-peak-exercise-correction",
    "exercise": "bicep-curl",
    "exerciseName": "Bicep curl",
    "purpose": "form-check",
    "role": "depth",
    "measure": "joint-angle",
    "joint": "elbow",
    "points": [
      "shoulder",
      "elbow",
      "wrist"
    ],
    "keypointIndices": null,
    "comparison": "<",
    "unit": "degrees",
    "meaning": "Full range: a rep whose smallest elbow angle is this or more is flagged as a peak-contraction error.",
    "sourceId": "exerciseCorrection",
    "value": 60,
    "value2": null,
    "source": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/bicep_curl.py#L247",
    "quote": "PEAK_CONTRACTION_THRESHOLD = 60",
    "usage": "and self.peak_contraction_angle >= self.peak_contraction_threshold",
    "measureQuote": "bicep_curl_angle = int(calculate_angle(self.shoulder, self.elbow, self.wrist))",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "bicep-curl-upper-arm-exercise-correction",
    "exercise": "bicep-curl",
    "exerciseName": "Bicep curl",
    "purpose": "form-check",
    "role": "maximum",
    "measure": "segment-angle",
    "joint": "upper-arm-vertical",
    "points": [
      "elbow",
      "shoulder",
      "vertical"
    ],
    "keypointIndices": null,
    "comparison": "<=",
    "unit": "degrees",
    "meaning": "Loose upper arm: an angle between the upper arm and the vertical above this is flagged as an error.",
    "sourceId": "exerciseCorrection",
    "value": 40,
    "value2": null,
    "source": "https://github.com/NgoQuocBao1010/Exercise-Correction/blob/main/web/server/detection/bicep_curl.py#L251",
    "quote": "LOOSE_UPPER_ARM_ANGLE_THRESHOLD = 40",
    "usage": "if ground_upper_arm_angle > self.loose_upper_arm_angle_threshold:",
    "measureQuote": "calculate_angle(self.elbow, self.shoulder, shoulder_projection)",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "bicep-curl-elbow-peak-pose-trainer",
    "exercise": "bicep-curl",
    "exerciseName": "Bicep curl",
    "purpose": "form-check",
    "role": "depth",
    "measure": "joint-angle",
    "joint": "elbow",
    "points": [
      "shoulder",
      "elbow",
      "wrist"
    ],
    "keypointIndices": null,
    "comparison": "<=",
    "unit": "degrees",
    "meaning": "Full range: if the smallest elbow angle over the set is above this, the set is flagged as not curled all the way up.",
    "sourceId": "poseTrainer",
    "value": 70,
    "value2": null,
    "source": "https://github.com/stevenzchen/pose-trainer/blob/master/evaluate.py#L77",
    "quote": "if upper_arm_forearm_min > 70.0:",
    "usage": "You are not curling the weight all the way to the top, up to your shoulders.",
    "measureQuote": "upper_arm_forearm_angles = np.degrees(np.arccos(np.clip(np.sum(np.multiply(upper_arm_vecs, forearm_vecs), axis=1), -1.0, 1.0)))",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "bicep-curl-upper-arm-range-pose-trainer",
    "exercise": "bicep-curl",
    "exerciseName": "Bicep curl",
    "purpose": "form-check",
    "role": "maximum",
    "measure": "range-of-motion",
    "joint": "upper-arm-torso",
    "points": [
      "shoulder",
      "elbow",
      "hip",
      "neck"
    ],
    "keypointIndices": null,
    "comparison": "<=",
    "unit": "degrees",
    "meaning": "Upper arm still: if the upper-arm-to-torso angle varies by more than this over the set, the set is flagged for shoulder rotation.",
    "sourceId": "poseTrainer",
    "value": 35,
    "value2": null,
    "source": "https://github.com/stevenzchen/pose-trainer/blob/master/evaluate.py#L72",
    "quote": "if upper_arm_torso_range > 35.0:",
    "usage": "Your upper arm shows significant rotation around the shoulder when curling.",
    "measureQuote": "upper_arm_torso_range = np.max(upper_arm_torso_angles) - np.min(upper_arm_torso_angles)",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "shoulder-press-lockout-pose-trainer",
    "exercise": "shoulder-press",
    "exerciseName": "Shoulder press",
    "purpose": "form-check",
    "role": "lockout",
    "measure": "joint-angle",
    "joint": "elbow",
    "points": [
      "shoulder",
      "elbow",
      "wrist"
    ],
    "keypointIndices": null,
    "comparison": ">=",
    "unit": "degrees",
    "meaning": "Lockout: if the largest elbow angle over the set is below this, the set is flagged as not pressed all the way up.",
    "sourceId": "poseTrainer",
    "value": 178,
    "value2": null,
    "source": "https://github.com/stevenzchen/pose-trainer/blob/master/evaluate.py#L257",
    "quote": "if upper_forearm_angle < 178:",
    "usage": "You are not lifting the weight all the way up. Extend your arms through the full range of motion.",
    "measureQuote": "print(\"Max upper arm and forearm angle: \", np.max(upper_arm_forearm_angles))",
    "reasonQuote": null,
    "nullReason": null
  },
  {
    "id": "shoulder-press-rep-count-null",
    "exercise": "shoulder-press",
    "exerciseName": "Shoulder press",
    "purpose": "rep-count",
    "role": "top-and-bottom",
    "measure": "joint-angle",
    "joint": "elbow",
    "points": [
      "shoulder",
      "elbow",
      "wrist"
    ],
    "keypointIndices": null,
    "comparison": null,
    "unit": "degrees",
    "meaning": "Top and bottom elbow angles for counting shoulder-press reps.",
    "sourceId": "poseTrainer",
    "value": null,
    "value2": null,
    "source": "https://github.com/stevenzchen/pose-trainer/blob/master/evaluate.py#L244",
    "quote": null,
    "usage": null,
    "measureQuote": null,
    "reasonQuote": "print(\"Max upper arm and forearm angle: \", np.max(upper_arm_forearm_angles))",
    "nullReason": "The one licensed shoulder-press source read judges a whole recorded set by its largest elbow angle and counts no reps, so it states no bottom position and no per-rep top. No other licensed source read gives one."
  },
  {
    "id": "deadlift-rep-count-null",
    "exercise": "deadlift",
    "exerciseName": "Deadlift",
    "purpose": "rep-count",
    "role": "top-and-bottom",
    "measure": "joint-angle",
    "joint": "hip",
    "points": [
      "shoulder",
      "hip",
      "knee"
    ],
    "keypointIndices": null,
    "comparison": null,
    "unit": "degrees",
    "meaning": "Top and bottom hip angles for counting deadlift reps.",
    "sourceId": null,
    "value": null,
    "value2": null,
    "source": null,
    "quote": null,
    "usage": null,
    "measureQuote": null,
    "reasonQuote": null,
    "nullReason": "No licensed open-source deadlift rule could be read: the two deadlift repositories found ship no LICENSE file. The peer-reviewed state-machine definition cited on /motion/deadlift-pose-estimation is on a host the build environment could not reach on the fetch date, so its thresholds are not copied; it is listed in ops/sources/form-rules.txt for a snapshot run."
  }
];

/** DERIVED: one rep-counter starting config per source and joint where that
 *  source gives both a top and a bottom value. */
export type FormRulePreset = {
  id: string;
  exercise: string;
  exerciseName: string;
  sourceId: string;
  joint: string;
  side: "left" | "right" | "either" | "best";
  startAt: "high" | "low";
  top: number;
  bottom: number;
  topRuleId: string;
  bottomRuleId: string;
  /** Other rep-count rules of the same source the single-angle counter does not apply. */
  others: string[];
};

export const FORM_RULE_PRESETS: FormRulePreset[] = [
  {
    "id": "push-up-elbow-ultralytics",
    "exercise": "push-up",
    "exerciseName": "Push-up",
    "sourceId": "ultralytics",
    "joint": "elbow",
    "side": "right",
    "startAt": "high",
    "top": 145,
    "bottom": 90,
    "topRuleId": "push-up-elbow-top-ultralytics",
    "bottomRuleId": "push-up-elbow-bottom-ultralytics",
    "others": []
  },
  {
    "id": "bicep-curl-elbow-exercise-correction",
    "exercise": "bicep-curl",
    "exerciseName": "Bicep curl",
    "sourceId": "exerciseCorrection",
    "joint": "elbow",
    "side": "left",
    "startAt": "high",
    "top": 120,
    "bottom": 100,
    "topRuleId": "bicep-curl-elbow-top-exercise-correction",
    "bottomRuleId": "bicep-curl-elbow-bottom-exercise-correction",
    "others": []
  }
];
