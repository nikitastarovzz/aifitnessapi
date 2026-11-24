---
applyTo: "**"
---

# Pose keypoints rules for AI coding assistants

> Generated 2026-11-24 by https://aifitnessapi.com from its pose keypoint dataset, read from each model's own source on 2026-10-17 (https://aifitnessapi.com/pose-keypoints). Every name below is copied from the vendors' documentation or source; regenerate or re-download from https://aifitnessapi.com/kit/ai-rules/ (listed at https://aifitnessapi.com/developers#ai-rules). Quoted sentences are the vendors' own words.

Use these rules whenever you write or review code that reads body keypoints from a pose-estimation model (MediaPipe, ML Kit, MoveNet, YOLO pose, RTMPose, OpenPose, Apple Vision), for rep counting, form checks or any joint angle.

## Rules

- A keypoint index means something only inside its own scheme. The same joint has different indices in different schemes: `LEFT_SHOULDER` is 11 in BlazePose 33, while `left_shoulder` is 5 in COCO 17. Never reuse an index from one model with another model's output.
- Write the scheme next to every index constant you define, and look indices up in the lists below rather than from memory.
- To move between schemes, join by joint name using the crosswalk table below. A joint missing from a scheme is missing: do not substitute a neighbor.
- Apple Vision 2D and Apple Vision 3D name joints with constants, not integer indices; use the constant names listed.
- Coordinate spaces differ by model and by output. The statements under each scheme are copied from its source; follow the one for the model you use.

## Schemes

### BlazePose 33 (MediaPipe pose landmarks)

Used by: MediaPipe Pose Landmarker (Tasks API); MediaPipe Pose (legacy Solutions API); BlazePose in TF.js pose-detection. Names from the PoseLandmark enum in MediaPipe's Tasks pose_landmarker.py (https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py).

33 keypoints: 0 `NOSE` · 1 `LEFT_EYE_INNER` · 2 `LEFT_EYE` · 3 `LEFT_EYE_OUTER` · 4 `RIGHT_EYE_INNER` · 5 `RIGHT_EYE` · 6 `RIGHT_EYE_OUTER` · 7 `LEFT_EAR` · 8 `RIGHT_EAR` · 9 `MOUTH_LEFT` · 10 `MOUTH_RIGHT` · 11 `LEFT_SHOULDER` · 12 `RIGHT_SHOULDER` · 13 `LEFT_ELBOW` · 14 `RIGHT_ELBOW` · 15 `LEFT_WRIST` · 16 `RIGHT_WRIST` · 17 `LEFT_PINKY` · 18 `RIGHT_PINKY` · 19 `LEFT_INDEX` · 20 `RIGHT_INDEX` · 21 `LEFT_THUMB` · 22 `RIGHT_THUMB` · 23 `LEFT_HIP` · 24 `RIGHT_HIP` · 25 `LEFT_KNEE` · 26 `RIGHT_KNEE` · 27 `LEFT_ANKLE` · 28 `RIGHT_ANKLE` · 29 `LEFT_HEEL` · 30 `RIGHT_HEEL` · 31 `LEFT_FOOT_INDEX` · 32 `RIGHT_FOOT_INDEX`

- The pose landmarks detection result from PoseLandmarker, where each vector element represents a single pose detected in the image.
- pose_landmarks: Detected pose landmarks in normalized image coordinates.
- pose_world_landmarks: Detected pose landmarks in world coordinates.
- num_poses: The maximum number of poses can be detected by the PoseLandmarker.
- num_poses: int = 1
- "pose_world_landmarks" field that contains the pose landmarks in real-world 3D coordinates that are in meters with the origin at the center between hips.
- For the `keypoints`, x and y represent the actual keypoint position in the image.
- For the `keypoints3D`, x, y and z represent absolute distance in meters in a 2 x 2 x 2 meter cubic space. The range for each axis goes from -1 to 1 (therefore 2m total delta). The z is always perpendicular to the xy plane that passes the center of the hip, so the coordinate for the hip center is (0, 0, 0).
- The README's BlazePose keypoint list continues past 32 with 33: bodyCenter, 34: forehead, 35: leftThumb, 36: leftHand, 37: rightThumb, 38: rightHand; BLAZEPOSE_KEYPOINTS in constants.ts, whose comment says the order "needs to be consistent with the model keypoint result list", stops at 32.

### ML Kit PoseLandmark (33 landmarks)

Used by: ML Kit Pose Detection (base and accurate SDKs). Names from the int constants of com.google.mlkit.vision.pose.PoseLandmark (Android reference) (https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark).

33 keypoints: 0 `NOSE` · 1 `LEFT_EYE_INNER` · 2 `LEFT_EYE` · 3 `LEFT_EYE_OUTER` · 4 `RIGHT_EYE_INNER` · 5 `RIGHT_EYE` · 6 `RIGHT_EYE_OUTER` · 7 `LEFT_EAR` · 8 `RIGHT_EAR` · 9 `LEFT_MOUTH` · 10 `RIGHT_MOUTH` · 11 `LEFT_SHOULDER` · 12 `RIGHT_SHOULDER` · 13 `LEFT_ELBOW` · 14 `RIGHT_ELBOW` · 15 `LEFT_WRIST` · 16 `RIGHT_WRIST` · 17 `LEFT_PINKY` · 18 `RIGHT_PINKY` · 19 `LEFT_INDEX` · 20 `RIGHT_INDEX` · 21 `LEFT_THUMB` · 22 `RIGHT_THUMB` · 23 `LEFT_HIP` · 24 `RIGHT_HIP` · 25 `LEFT_KNEE` · 26 `RIGHT_KNEE` · 27 `LEFT_ANKLE` · 28 `RIGHT_ANKLE` · 29 `LEFT_HEEL` · 30 `RIGHT_HEEL` · 31 `LEFT_FOOT_INDEX` · 32 `RIGHT_FOOT_INDEX`

- getPosition3D(): The Z value is an experimental feature that returns an extra Z coordinate along with X and Y. Please note that this value is less accurate than the X and Y values.
- getPosition3D(): The unit of measure for the Z value is the same as X and Y.
- getPosition3D(): The smaller the Z value, the closer that landmark is to the camera.
- getPosition3D(): Different from X and Y, Z does not have a fixed origin in the image space. The Z origin is approximately at the center of the subject’s hips. Z value will be negative if the landmark is in front of the Z origin and will be positive if the landmark is behind the Z origin.
- getPosition3D(): The Z value does not have a fixed lower or upper bound.

### COCO 17 keypoints

Used by: MoveNet (TF.js pose-detection); PoseNet (TF.js pose-detection); Ultralytics YOLO26 default pose models; RTMPose 17-keypoint body models (MMPose). Names from keypoint_info in MMPose's configs/_base_/datasets/coco.py (https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/coco.py).

17 keypoints: 0 `nose` · 1 `left_eye` · 2 `right_eye` · 3 `left_ear` · 4 `right_ear` · 5 `left_shoulder` · 6 `right_shoulder` · 7 `left_elbow` · 8 `right_elbow` · 9 `left_wrist` · 10 `right_wrist` · 11 `left_hip` · 12 `right_hip` · 13 `left_knee` · 14 `right_knee` · 15 `left_ankle` · 16 `right_ankle`

- Don't change the order. The order needs to be consistent with the model keypoint result list.
- kpt_shape: [17, 3] — number of keypoints, number of dims (2 for x,y or 3 for x,y,visible)
- result.keypoints.data (torch.float32, shape (N,K,2/3)): `x,y` plus optional visibility/confidence.
- result.keypoints.xy (torch.float32, shape (N,K,2)): Pixel keypoints.
- result.keypoints.xyn (torch.float32, shape (N,K,2)): Normalized keypoints.
- PoseNet and MoveNet both return 17 keypoints.

### Halpe26 keypoints

Used by: RTMPose 26-keypoint body models (MMPose). Names from keypoint_info in MMPose's configs/_base_/datasets/halpe26.py (https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/halpe26.py).

26 keypoints: 0 `nose` · 1 `left_eye` · 2 `right_eye` · 3 `left_ear` · 4 `right_ear` · 5 `left_shoulder` · 6 `right_shoulder` · 7 `left_elbow` · 8 `right_elbow` · 9 `left_wrist` · 10 `right_wrist` · 11 `left_hip` · 12 `right_hip` · 13 `left_knee` · 14 `right_knee` · 15 `left_ankle` · 16 `right_ankle` · 17 `head` · 18 `neck` · 19 `hip` · 20 `left_big_toe` · 21 `right_big_toe` · 22 `left_small_toe` · 23 `right_small_toe` · 24 `left_heel` · 25 `right_heel`

### COCO-WholeBody 133 keypoints

Used by: RTMPose WholeBody 2d models (MMPose: RTMPose, RTMW and DWPose-distilled checkpoints). Names from keypoint_info in MMPose's configs/_base_/datasets/coco_wholebody.py (https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/coco_wholebody.py).

133 keypoints: 0 `nose` · 1 `left_eye` · 2 `right_eye` · 3 `left_ear` · 4 `right_ear` · 5 `left_shoulder` · 6 `right_shoulder` · 7 `left_elbow` · 8 `right_elbow` · 9 `left_wrist` · 10 `right_wrist` · 11 `left_hip` · 12 `right_hip` · 13 `left_knee` · 14 `right_knee` · 15 `left_ankle` · 16 `right_ankle` · 17 `left_big_toe` · 18 `left_small_toe` · 19 `left_heel` · 20 `right_big_toe` · 21 `right_small_toe` · 22 `right_heel` · 23 `face-0` · 24 `face-1` · 25 `face-2` · 26 `face-3` · 27 `face-4` · 28 `face-5` · 29 `face-6` · 30 `face-7` · 31 `face-8` · 32 `face-9` · 33 `face-10` · 34 `face-11` · 35 `face-12` · 36 `face-13` · 37 `face-14` · 38 `face-15` · 39 `face-16` · 40 `face-17` · 41 `face-18` · 42 `face-19` · 43 `face-20` · 44 `face-21` · 45 `face-22` · 46 `face-23` · 47 `face-24` · 48 `face-25` · 49 `face-26` · 50 `face-27` · 51 `face-28` · 52 `face-29` · 53 `face-30` · 54 `face-31` · 55 `face-32` · 56 `face-33` · 57 `face-34` · 58 `face-35` · 59 `face-36` · 60 `face-37` · 61 `face-38` · 62 `face-39` · 63 `face-40` · 64 `face-41` · 65 `face-42` · 66 `face-43` · 67 `face-44` · 68 `face-45` · 69 `face-46` · 70 `face-47` · 71 `face-48` · 72 `face-49` · 73 `face-50` · 74 `face-51` · 75 `face-52` · 76 `face-53` · 77 `face-54` · 78 `face-55` · 79 `face-56` · 80 `face-57` · 81 `face-58` · 82 `face-59` · 83 `face-60` · 84 `face-61` · 85 `face-62` · 86 `face-63` · 87 `face-64` · 88 `face-65` · 89 `face-66` · 90 `face-67` · 91 `left_hand_root` · 92 `left_thumb1` · 93 `left_thumb2` · 94 `left_thumb3` · 95 `left_thumb4` · 96 `left_forefinger1` · 97 `left_forefinger2` · 98 `left_forefinger3` · 99 `left_forefinger4` · 100 `left_middle_finger1` · 101 `left_middle_finger2` · 102 `left_middle_finger3` · 103 `left_middle_finger4` · 104 `left_ring_finger1` · 105 `left_ring_finger2` · 106 `left_ring_finger3` · 107 `left_ring_finger4` · 108 `left_pinky_finger1` · 109 `left_pinky_finger2` · 110 `left_pinky_finger3` · 111 `left_pinky_finger4` · 112 `right_hand_root` · 113 `right_thumb1` · 114 `right_thumb2` · 115 `right_thumb3` · 116 `right_thumb4` · 117 `right_forefinger1` · 118 `right_forefinger2` · 119 `right_forefinger3` · 120 `right_forefinger4` · 121 `right_middle_finger1` · 122 `right_middle_finger2` · 123 `right_middle_finger3` · 124 `right_middle_finger4` · 125 `right_ring_finger1` · 126 `right_ring_finger2` · 127 `right_ring_finger3` · 128 `right_ring_finger4` · 129 `right_pinky_finger1` · 130 `right_pinky_finger2` · 131 `right_pinky_finger3` · 132 `right_pinky_finger4`

### OpenPose BODY_25

Used by: OpenPose BODY_25 model. Names from POSE_BODY_25_BODY_PARTS in OpenPose's src/openpose/pose/poseParameters.cpp (https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/src/openpose/pose/poseParameters.cpp).

25 keypoints: 0 `Nose` · 1 `Neck` · 2 `RShoulder` · 3 `RElbow` · 4 `RWrist` · 5 `LShoulder` · 6 `LElbow` · 7 `LWrist` · 8 `MidHip` · 9 `RHip` · 10 `RKnee` · 11 `RAnkle` · 12 `LHip` · 13 `LKnee` · 14 `LAnkle` · 15 `REye` · 16 `LEye` · 17 `REar` · 18 `LEar` · 19 `LBigToe` · 20 `LSmallToe` · 21 `LHeel` · 22 `RBigToe` · 23 `RSmallToe` · 24 `RHeel`

- `pose_keypoints_2d`: Body part locations (`x`, `y`) and detection confidence (`c`) formatted as `x0,y0,c0,x1,y1,c1,...`.
- The coordinates `x` and `y` can be normalized to the range [0,1], [-1,1], [0, source size], [0, output size], etc. (see the flag `--keypoint_scale` for more information), while the confidence score (`c`) in the range [0,1].

### OpenPose COCO 18 (PoseModel::COCO_18)

Used by: OpenPose COCO model (PoseModel::COCO_18). Names from POSE_COCO_BODY_PARTS in OpenPose's src/openpose/pose/poseParameters.cpp (https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/src/openpose/pose/poseParameters.cpp).

18 keypoints: 0 `Nose` · 1 `Neck` · 2 `RShoulder` · 3 `RElbow` · 4 `RWrist` · 5 `LShoulder` · 6 `LElbow` · 7 `LWrist` · 8 `RHip` · 9 `RKnee` · 10 `RAnkle` · 11 `LHip` · 12 `LKnee` · 13 `LAnkle` · 14 `REye` · 15 `LEye` · 16 `REar` · 17 `LEar`

- `pose_keypoints_2d`: Body part locations (`x`, `y`) and detection confidence (`c`) formatted as `x0,y0,c0,x1,y1,c1,...`.
- The coordinates `x` and `y` can be normalized to the range [0,1], [-1,1], [0, source size], [0, output size], etc. (see the flag `--keypoint_scale` for more information), while the confidence score (`c`) in the range [0,1].

### Apple Vision 2D body pose joints

Used by: Apple Vision VNDetectHumanBodyPoseRequest. Names from the static joint-name constants of VNHumanBodyPoseObservation.JointName (https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname).

19 joints: `leftEar` · `leftEye` · `rightEar` · `rightEye` · `neck` · `nose` · `leftShoulder` · `leftElbow` · `leftWrist` · `rightShoulder` · `rightElbow` · `rightWrist` · `root` · `leftHip` · `leftKnee` · `leftAnkle` · `rightHip` · `rightKnee` · `rightAnkle`

- VNHumanBodyPoseObservation.JointName: The supported joint names for the body pose.

### Apple Vision 3D body pose joints

Used by: Apple Vision VNDetectHumanBodyPose3DRequest. Names from the static joint-name constants of VNHumanBodyPose3DObservation.JointName (https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname).

17 joints: `topHead` · `centerHead` · `centerShoulder` · `leftShoulder` · `rightShoulder` · `leftElbow` · `rightElbow` · `leftWrist` · `rightWrist` · `leftHip` · `rightHip` · `leftKnee` · `rightKnee` · `leftAnkle` · `rightAnkle` · `root` · `spine`

- VNHumanBodyPose3DObservation.JointName: The joint names for a 3D body pose.
- This request generates a collection of VNHumanBodyPose3DObservation objects that describe the position of each body the request detects. If the system allows it, the request uses AVDepthData information to improve the accuracy.
- pointInImage(_:): Returns a 2D point for the joint name you specify, relative to the input image.
- cameraRelativePosition(_:): Returns a position relative to the camera for the body joint you specify.
- bodyHeight: The estimated human body height, in meters.
- cameraOriginMatrix: A transform from the skeleton hip to the camera.

## Crosswalk: the same joint across schemes

Rows join points whose names are identical once lowercased with separators removed; a dash means the scheme has no point by that name.

| Joint | BlazePose 33 | ML Kit 33 | COCO 17 | Halpe26 | COCO-WholeBody 133 | OpenPose BODY_25 | OpenPose COCO 18 | Apple Vision 2D | Apple Vision 3D |
|---|---|---|---|---|---|---|---|---|---|
| nose | 0 | 0 | 0 | 0 | 0 | 0 | 0 | `nose` | — |
| left_eye | 2 | 2 | 1 | 1 | 1 | — | — | `leftEye` | — |
| right_eye | 5 | 5 | 2 | 2 | 2 | — | — | `rightEye` | — |
| left_ear | 7 | 7 | 3 | 3 | 3 | — | — | `leftEar` | — |
| right_ear | 8 | 8 | 4 | 4 | 4 | — | — | `rightEar` | — |
| left_shoulder | 11 | 11 | 5 | 5 | 5 | — | — | `leftShoulder` | `leftShoulder` |
| right_shoulder | 12 | 12 | 6 | 6 | 6 | — | — | `rightShoulder` | `rightShoulder` |
| left_elbow | 13 | 13 | 7 | 7 | 7 | — | — | `leftElbow` | `leftElbow` |
| right_elbow | 14 | 14 | 8 | 8 | 8 | — | — | `rightElbow` | `rightElbow` |
| left_wrist | 15 | 15 | 9 | 9 | 9 | — | — | `leftWrist` | `leftWrist` |
| right_wrist | 16 | 16 | 10 | 10 | 10 | — | — | `rightWrist` | `rightWrist` |
| left_hip | 23 | 23 | 11 | 11 | 11 | — | — | `leftHip` | `leftHip` |
| right_hip | 24 | 24 | 12 | 12 | 12 | — | — | `rightHip` | `rightHip` |
| left_knee | 25 | 25 | 13 | 13 | 13 | — | — | `leftKnee` | `leftKnee` |
| right_knee | 26 | 26 | 14 | 14 | 14 | — | — | `rightKnee` | `rightKnee` |
| left_ankle | 27 | 27 | 15 | 15 | 15 | — | — | `leftAnkle` | `leftAnkle` |
| right_ankle | 28 | 28 | 16 | 16 | 16 | — | — | `rightAnkle` | `rightAnkle` |
| left_heel | 29 | 29 | — | 24 | 19 | — | — | — | — |
| right_heel | 30 | 30 | — | 25 | 22 | — | — | — | — |
| neck | — | — | — | 18 | — | 1 | 1 | `neck` | — |

Every scheme and the full crosswalk, including joints fewer schemes share: [pose keypoint reference](https://aifitnessapi.com/pose-keypoints); map one scheme onto another in the [keypoint playground](https://aifitnessapi.com/tools/keypoint-playground).
