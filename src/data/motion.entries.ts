import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED AI-motion / pose-estimation pages (originally auto-assembled;
 * since hand-edited — edit here). Article + FAQPage (no HowTo). The technical/
 * decision layer; benchmarks attributed or hedged; monocular 3D framed as
 * estimated; form feedback framed as a coaching aid, not medical/PT advice.
 */
export const motionEntries: ClusterEntry[] =
[
  {
    "slug": "pose-estimation-models-compared",
    "primaryQuery": "pose estimation models compared",
    "h1": "Pose Estimation Models Compared: MediaPipe, MoveNet, YOLO and More",
    "metaTitle": "MediaPipe vs MoveNet vs YOLO: Pose Models Compared",
    "metaDescription": "MediaPipe/BlazePose (33 kp), MoveNet, YOLO-pose and OpenPose compared: keypoints, on-device, multi-person, and the AGPL/non-commercial license traps.",
    "updated": "2026-10-18",
    "answer": "For a single-user on-device fitness app, MediaPipe/BlazePose (33 keypoints, with monocular 3D world landmarks) is the usual starting point. MoveNet (17 keypoints) gives a speed-vs-accuracy dial for lightweight 2D tracking (Lightning for speed, Thunder for accuracy), while YOLO-pose and OpenPose handle multi-person scenes. The decisive trade-off is single-person on-device (private, cheap, simpler) vs multi-person (heavier, with real licensing strings). Check the license first: OpenPose is non-commercial and Ultralytics YOLO is AGPL-3.0.",
    "body": "New to the concept itself? Start with [what pose estimation is](/learn/what-is-pose-estimation); this page is about choosing among the actual models. For the whole job in order, from the concept to a shipped rep counter and form cue, follow [the camera-coaching reading path](/paths).\n\n## The models you actually choose among\n\nKeypoint counts below are stable facts you can rely on. Everything about *speed* is described as positioning, not a number — fps and accuracy vary wildly by device, resolution, and delegate, so any benchmark must be verified on your own target hardware (as of 2026, verify).\n\n- **`MediaPipe` / `BlazePose` (Google).** Predicts **33 landmarks** (a superset of the 17 COCO keypoints, adding face, hand, and foot points). It is designed for on-device, real-time use and outputs both 2D image-coordinate landmarks and 3D world landmarks in meters, plus per-landmark visibility. It is single-person focused: the model card says it tracks one person, and while the Tasks API has a `num_poses` setting, it defaults to 1 and the card does not evaluate more. License: Apache-2.0 for the framework and, per Google's model card, the models.\n- **`MoveNet` — `Lightning` vs `Thunder` (TensorFlow / Google).** Detects **17 keypoints**. Shipped in two variants: `Lightning` is tuned for latency-critical/speed use, `Thunder` for higher accuracy. Single-person oriented; commonly used for browser/web and lightweight mobile. License: Apache-2.0.\n- **`YOLO`-pose / Ultralytics (`YOLO26`-pose).** Ultralytics' pose docs now present YOLO26 as the current generation. The default models predict the **17 COCO keypoints**, and the COCO-Pose dataset config stores each one as (x, y, visible). It is multi-person capable, detecting people and their keypoints in one pass. Five sizes (n/s/m/l/x) trade speed for accuracy. License: **AGPL-3.0** (strong copyleft) with a paid Enterprise License to bypass it — see the licensing note below.\n- **`PoseNet` (legacy, TensorFlow.js).** **17 keypoints** per pose, and it can detect multiple poses. Its standalone `posenet` package is deprecated in favor of the `pose-detection` package, which serves `MoveNet`, `BlazePose` and `PoseNet` itself. **Prefer `MoveNet` or `BlazePose` for new projects.** License: Apache-2.0.\n- **`OpenPose` (CMU, research).** A real-time multi-person system built on Part Affinity Fields. Its output document names the `BODY_25`, `COCO_18`, `MPI_15` and `BODY_25B` body models, with output diagrams for `BODY_25` and the 18-point COCO set. Heavy and GPU-oriented, strong for research and multi-person, less suited to lightweight on-device. License: **academic or non-profit noncommercial research only** from CMU — commercial use needs a separate license.\n\nEach model has its own page with the detail this overview leaves out: [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models), [MoveNet models](/motion/movenet-models), [ML Kit pose detection](/motion/ml-kit-pose-detection), [Ultralytics YOLO pose models](/motion/yolo-pose-models), [RTMPose models](/motion/rtmpose-models) and [OpenPose models](/motion/openpose-models). Every keypoint index, scheme by scheme, is in [the pose keypoint maps](/pose-keypoints).\n\n### Comparison table\n\nPositioning, not fabricated benchmarks. Confirm licenses and any speed claim before you ship.\n\n| Model | Keypoints | On-device? | Multi-person? | License | Best for |\n| --- | --- | --- | --- | --- | --- |\n| `MediaPipe` / `BlazePose` | 33 (superset of COCO 17) | Yes (mobile CPU/GPU) | Single-person focus | Apache-2.0 | On-device single-user coaching; 2D + monocular 3D |\n| `MoveNet` `Lightning` | 17 | Yes | Single-person | Apache-2.0 | Speed-first web/mobile 2D |\n| `MoveNet` `Thunder` | 17 | Yes | Single-person | Apache-2.0 | Accuracy-leaning single-user 2D |\n| `YOLO26`-pose | 17 | Edge-GPU / server (sizes vary) | Yes | AGPL-3.0 / Enterprise | Multi-person gyms/classes |\n| `PoseNet` (legacy) | 17 | Yes | Yes (multiple poses) | Apache-2.0 | Nothing new — deprecated |\n| `OpenPose` | BODY_25 or COCO 18, among others | Heavy / GPU | Yes | Noncommercial research only | Research, multi-person |\n\n## The licensing trap (read before you commit)\n\nTwo of these models carry license terms that can block a commercial product, and they are easy to miss because the code is free to download:\n\n- **Ultralytics `YOLO` is AGPL-3.0.** AGPL is a strong *reciprocal* (copyleft) license: if you distribute or even offer a network service built on AGPL code, its terms can require you to release your own source under the same license. Ultralytics sells a paid Enterprise License specifically to lift that obligation. Treat \"which license\" as a real legal decision, not a footnote — verify the current terms and talk to counsel before building a closed-source product on it.\n- **`OpenPose` is noncommercial research only.** CMU's license grants academic or non-profit noncommercial research use, and its README points anyone interested in a commercial license to a separate licensing page. Do not ship it in a paid or commercial app without clearing licensing first.\n\nThe Apache-2.0 options (`MediaPipe`/`BlazePose`, `MoveNet`, `PoseNet`) are the most permissive here. One gap to close: the MoveNet SinglePose model card states Apache 2.0, but the text of the MultiPose card carries no licence line of its own, so confirm its terms before you ship it. For what each license file and model card actually says, model by model, see [pose estimation model licenses](/motion/pose-estimation-model-licenses).\n\n## How to decide — by use case\n\nThere is no single winner; the right model follows your scene and constraints:\n\n- **Single user, on-device, needs joint angles (and optionally 3D):** `MediaPipe`/`BlazePose`. The 33 landmarks and monocular 3D world landmarks make it the default for a private, phone-based rep-counting or form-feedback app.\n- **Single user, pure speed, browser or lightweight mobile, 2D only:** `MoveNet` — `Lightning` when responsiveness beats precision, `Thunder` when you can afford more compute for a cleaner pose. If it comes down to these two, [the head-to-head below](#mediapipe-vs-movenet-head-to-head) decides it by what you compute from the keypoints.\n- **Multiple people at once (group class, gym floor, sports scene):** `YOLO`-pose (mind AGPL-3.0) or `OpenPose` (mind the non-commercial license). Multi-person also needs a separate cross-frame tracking layer to keep identities stable.\n- **New build:** avoid `PoseNet` — it is legacy; pick `MoveNet` or `BlazePose` instead.\n\nIf you would rather not choose and maintain a model at all, a managed motion SDK bundles pose plus rep/form logic — see [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) for the buy option.\n\n## MediaPipe vs MoveNet, head to head\n\nMost single-user fitness builds come down to these two Google models, and the choice settles on what you will compute from the keypoints, not on a benchmark screenshot. Both vendors name fitness as the target domain in their own model cards. Everything in this section was checked against those cards and Google's docs on October 17 and 18, 2026.\n\n- **MediaPipe Pose (BlazePose GHUM) gives you geometry.** It predicts 33 landmarks (the 17 COCO keypoints plus face, hands and feet, including heels and `FOOT_INDEX` toe-line points), each with x, y, z, visibility and presence, plus world landmarks Google documents as \"real-world 3D coordinates in meters with the origin at the center between hips\". The depth is estimated from one camera, and the model card says per-landmark z \"is not metric but up to scale\". Hip-origin world coordinates are what let you compute a knee or hip-hinge angle in space rather than in the camera plane.\n- **MoveNet gives you speed and simplicity.** It predicts the 17 COCO keypoints as (y, x, confidence) triplets in normalized 2D image coordinates, and nothing else. Lightning takes 192x192 input and is positioned for latency-critical use; Thunder takes 256x256 for higher prediction quality.\n\n| | MediaPipe Pose (BlazePose GHUM) | MoveNet |\n| --- | --- | --- |\n| Keypoints | 33 landmarks | 17 COCO keypoints |\n| Output | x, y, z, visibility and presence per landmark; world landmarks in meters (hip origin); optional segmentation mask | (y, x, confidence) in normalized 2D coordinates |\n| Depth | Estimated, \"up to scale\", not metric | None |\n| Variants | Lite, Full, Heavy (`.task` bundles) | Lightning (192x192), Thunder (256x256), MultiPose Lightning |\n| Multi-person | Model card: \"tracks only one person on scene if multiple present\"; the Tasks `num_poses` setting defaults to 1 | MultiPose Lightning: up to 6 people, per its card |\n| Camera distance | Out of scope beyond 14 feet / 4 m | \"3ft ~ 6ft\" from a device webcam, per the cards |\n\n**The published numbers do not cross-compare.** BlazePose's 2021 model card reports frames per second on a Pixel 3 via TFLite (Lite about 44 on CPU and 49 on GPU); MoveNet's cards report milliseconds in desktop Chrome via TF.js (Lightning 39 ms and Thunder 64 ms on an Intel UHD 620). Different hardware, runtimes, accuracy metrics (PCK@0.2 versus keypoint mAP) and datasets, so the only cross-model number that means anything is one you measure on your own target devices; [pose estimation accuracy](/motion/pose-estimation-accuracy) covers which metrics to use.\n\n**Both are effectively frozen.** The MediaPipe pose `.task` bundles on Google's storage bucket were last modified in April 2023, and the legacy Pose solution was retired in favour of the Tasks Pose Landmarker on May 10, 2023. The last commit touching pose-detection in tensorflow/tfjs-models was a May 2024 documentation fix, and tfhub.dev links have redirected to Kaggle Models since November 15, 2023. Expect no fixes: if either model struggles on your key exercise, test that exercise first. Both observations are tracked changes, listed under the month we verified them in [the monthly digest](/digest).\n\n**Choosing between the two:**\n\n- Joint angles that must survive viewpoint changes (squat depth, hip hinge, heel lift): MediaPipe, whose 33 landmarks and hip-origin world coordinates are the inputs that math needs.\n- Rep counting at the lowest latency on the widest range of hardware, or in a browser: MoveNet Lightning.\n- More than one person in frame: MoveNet MultiPose, the only model in this pair whose card covers several people. MediaPipe's `num_poses` setting exists, but its card does not evaluate it, so test it on your own footage before relying on it.\n- Plain single-user 2D accuracy: MoveNet Thunder and MediaPipe Full are both plausible, so benchmark both on your target devices before committing.\n\nLicensing for both, layer by layer, is in [pose estimation model licenses](/motion/pose-estimation-model-licenses).\n\n## The honest limits\n\n- **A normal RGB phone camera is enough.** No depth sensor or LiDAR is required for 2D or monocular 3D pose.\n- **Monocular 3D depth is estimated, not measured.** `BlazePose` world landmarks are hip-relative and inferred from a single camera; depth is unreliable for occluded or extremity joints and degrades on out-of-plane movement. It is not sensor-grade — treat the depth axis as lower-confidence than x/y, smooth it, and validate. More reliable 3D needs multi-camera rigs or depth sensors.\n- **Benchmarks are condition-dependent.** Leaderboard fps and accuracy assume specific hardware, lighting, and framing. Do not present a lab number as your app's real-world result; test on your own cameras, lighting, distances, and exercises.\n- **Form feedback is a coaching aid, not medical or physical-therapy advice.** Monocular angle error, occlusion, and depth ambiguity mean it can be wrong; it cannot judge pain or injury. Recommend a professional for anything injury-related.\n- **Streaming raw video to a server is privacy-sensitive.** Keeping inference on-device (video never leaves the phone) is the strongest privacy posture.\n\n## Before you ship\n\nPick by use case, then verify: confirm the current license (especially `OpenPose` non-commercial and `YOLO` AGPL-3.0), re-check any fps/accuracy claim on your own target hardware, and validate monocular 3D on real users rather than trusting a lab figure. When you are ready to wire it into a camera feed, see the [camera pose tracking guide](/guides/camera-pose-tracking) for implementation.",
    "faqs": [
      {
        "q": "How many keypoints does each model detect?",
        "a": "MediaPipe/BlazePose predicts 33 body landmarks, a superset of the 17 COCO keypoints that adds face, hand, and foot points. MoveNet, YOLO-pose, and PoseNet each use the 17 COCO keypoints. OpenPose's body models include BODY_25 and an 18-point COCO set, chosen per build. Keypoint counts are stable, but any speed or accuracy number is device-dependent and should be verified on your own hardware."
      },
      {
        "q": "Which model should I use for a single-user fitness app?",
        "a": "For a single user on-device, MediaPipe/BlazePose is the common default: its 33 landmarks and monocular 3D world landmarks suit joint-angle and form work on a normal phone. If you only need lightweight 2D and want a speed dial, MoveNet works well (Lightning for speed, Thunder for accuracy). Avoid PoseNet for new builds since it is deprecated in favor of MoveNet and BlazePose."
      },
      {
        "q": "Are these pose models free to use commercially?",
        "a": "Not all of them. MediaPipe/BlazePose, MoveNet, and PoseNet are Apache-2.0, the most permissive here, though the MoveNet MultiPose model card carries no licence line of its own, so confirm its terms. Ultralytics YOLO is AGPL-3.0, a strong copyleft license that can require you to release your own source unless you buy its Enterprise License. OpenPose's license allows academic or non-profit noncommercial research use only, and commercial use needs a separate license from CMU. Confirm current terms and consult counsel before shipping."
      },
      {
        "q": "Which of these models output 3D landmarks?",
        "a": "Among the common on-device options, only MediaPipe/BlazePose: alongside its 2D image-coordinate landmarks it returns 3D world landmarks in meters, hip-relative and inferred from a single camera. MoveNet and PoseNet return 2D keypoints only, and YOLO-pose stores an extra visibility value per point rather than depth. OpenPose has configurable keypoint sets but is a heavy, GPU-oriented multi-person system rather than an on-device 3D source. Treat monocular depth as a lower-confidence axis than x and y — it is estimated, not measured — and validate it on real users before building a feature on it."
      },
      {
        "q": "Which models handle multiple people at once?",
        "a": "YOLO-pose detects multiple people and their keypoints in one pass, and OpenPose is a bottom-up multi-person system. MediaPipe/BlazePose is documented for one person, though its Tasks API has a num_poses setting that defaults to 1, and MoveNet's SinglePose models are single-person, while MoveNet MultiPose Lightning detects up to 6 people per its model card. Multi-person also needs a separate cross-frame tracking layer to keep identities stable, and remember YOLO is AGPL-3.0 and OpenPose is non-commercial."
      },
      {
        "q": "Should I pick MoveNet or MediaPipe for a fitness app?",
        "a": "They sit at different points on the same trade-off. MediaPipe Pose (BlazePose) returns 33 keypoints including monocular 3D world landmarks, which helps for form feedback where joint angles in space matter. MoveNet returns the 17 COCO keypoints in 2D, with Lightning tuned for speed and Thunder for accuracy, and is a common choice when rep counting on modest hardware is the job. Both run on-device on a normal phone camera. Our recommendation: choose by what you compute downstream — 3D landmarks and more joints favor MediaPipe, minimal latency on old devices favors MoveNet Lightning — and verify current performance on your own target hardware rather than trusting anyone's benchmark."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-pose-estimation",
        "label": "What is pose estimation?"
      },
      {
        "href": "/guides/camera-pose-tracking",
        "label": "Add camera pose tracking"
      },
      {
        "href": "/fitness-apis/ai-workout-tracking-apis",
        "label": "Best AI workout tracking APIs"
      },
      {
        "href": "/pose-keypoints",
        "label": "Every keypoint index, scheme by scheme"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Want the licensing and monocular-3D gotchas flagged before you commit to a model? Get our developer notes on AI motion tracking."
    },
    "sources": [
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-17",
        "note": "33 keypoints, single person, distance limit, z up to scale, Pixel 3 speeds, PDJ, Apache-2.0"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/pose.md",
        "checked": "2026-10-17",
        "note": "world landmarks in meters, May 10, 2023 upgrade notice"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py",
        "checked": "2026-10-17",
        "note": "num_poses option, default 1"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/components/containers/landmark.py",
        "checked": "2026-10-18",
        "note": "visibility and presence per landmark"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.SinglePose%20Model%20Card.pdf",
        "checked": "2026-10-17",
        "note": "17 keypoints, yx and confidence output, 192 and 256 inputs, 3 to 6 feet, Chrome TF.js timings, Apache 2.0"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.MultiPose%20Model%20Card.pdf",
        "checked": "2026-10-17",
        "note": "up to 6 people; no licence line in the card text"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/docs/en/tasks/pose.md",
        "checked": "2026-10-17",
        "note": "YOLO26 pose models, 17 COCO keypoints"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/datasets/coco-pose.yaml",
        "checked": "2026-10-17",
        "note": "kpt_shape 17 by 3, x, y, visible"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics",
        "checked": "2026-10-17",
        "note": "AGPL-3.0 and Enterprise License"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/tree/master/pose-detection",
        "checked": "2026-10-17",
        "note": "MoveNet, BlazePose and PoseNet in one package; PoseNet detects multiple poses"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/tree/master/posenet",
        "checked": "2026-10-17",
        "note": "standalone package deprecated"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/commits/master/pose-detection",
        "checked": "2026-10-18",
        "note": "last pose-detection commit, a documentation typo fix on 2024-05-21 (snapshot)"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/LICENSE",
        "checked": "2026-10-18",
        "note": "Apache 2.0"
      },
      {
        "url": "https://github.com/tensorflow/hub",
        "checked": "2026-10-17",
        "note": "tfhub.dev redirects to Kaggle Models from November 15, 2023"
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose",
        "checked": "2026-10-17",
        "note": "README, LICENSE and doc/02_output.md: multi-person PAF system, body models, noncommercial licence, commercial licence route"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
        "checked": "2026-10-18",
        "note": "Last-Modified April 2023 for all three .task files"
      }
    ]
  },
  {
    "slug": "2d-vs-3d-pose-estimation",
    "primaryQuery": "2d vs 3d pose estimation",
    "h1": "2D vs 3D Pose Estimation for Fitness Apps",
    "metaTitle": "2D vs 3D Pose Estimation for Fitness Apps",
    "metaDescription": "2D keypoints are x,y in the image; 3D adds estimated depth. See when out-of-plane angles need 3D, when 2D is enough, and why no depth sensor is needed.",
    "updated": "2026-07-24",
    "answer": "2D pose estimation returns each keypoint as an (x, y) position in the image; 3D adds a depth axis (z) so joints sit in space. A normal RGB camera can output both, but its 3D depth is estimated from a single view (monocular), not measured, so it is less reliable than a multi-camera rig or depth sensor and weakest on occluded, out-of-plane, and extremity joints. Default to 2D for well-framed, in-plane form checks; add monocular 3D only when the movement leaves the camera plane, and treat depth as a lower-confidence axis you smooth and verify.",
    "body": "If you are new to the concept, start with [what is pose estimation](/learn/what-is-pose-estimation).\n\n## 2D vs 3D at a glance\n\nBoth come from an ordinary phone camera. No LiDAR or depth sensor is required for either 2D or monocular 3D — a point worth stating plainly because it shapes how many devices your app can reach. What changes between them is what each coordinate means and how much you can trust it.\n\n| | 2D keypoints | 3D / world landmarks |\n|---|---|---|\n| What a point is | (x, y) in the image, in pixels | (x, y, z) in metric space; BlazePose world landmarks are in meters, origin at the midpoint between the hips |\n| How depth is obtained | None — flat, camera-plane only | Estimated from a single view (monocular); z is hip-relative, not absolute distance to the camera |\n| Reliability | High on the axis you can actually measure | x and y are solid; z is a noisy, estimated axis — weakest on occluded, out-of-plane, and extremity joints |\n| Hardware | Normal RGB camera | Same RGB camera for monocular 3D; a multi-camera rig or depth sensor for high-accuracy 3D |\n| Good for | In-plane angle checks, rep counting from a good angle | Out-of-plane angles, twisting, depth of a squat or lunge, orientation robust to viewing angle |\n\nBlazePose returns both at once: image-coordinate landmarks (the 3D pose projected back onto the picture) and world landmarks (the pose itself in metric space). The 33-keypoint model is the same whether you read the 2D or 3D output.\n\n## When 3D actually matters — and when 2D is enough\n\nThe honest default for most single-camera fitness apps is **2D plus good camera placement**. If you position the camera so the joint angle you care about lives in the image plane, 2D measures it cleanly and cheaply, with no depth guesswork. Many fitness angle checks — an elbow angle for a curl filmed side-on, a knee angle for a squat filmed from the side — are fundamentally 2D problems.\n\nReach for **3D (monocular world landmarks)** when the movement goes *out of the plane*: rotation toward or away from the camera, the depth of a lunge, a twist, or any angle that projects into the depth axis. 3D also helps when you want orientation that holds up as the viewing angle shifts. The trade-off is that you are adding an estimated, noisier axis — so temporal smoothing becomes more important, and you should validate the result rather than trust it.\n\nReserve **multi-camera or depth-sensor 3D** for high-accuracy biomechanics work where estimated depth is not good enough. That path buys real metric depth at the cost of hardware, setup, and complexity — rarely justified for a consumer fitness app.\n\nA quick way to decide:\n\n- **Single user, well-framed, in-plane angles?** 2D. Simpler, cheaper, less noisy.\n- **Angles that rotate toward/away from the camera, or depth-of-motion cues?** Monocular 3D — but treat z as an estimate.\n- **Research-grade or clinical biomechanics?** Multi-camera / depth sensor, not a single phone.\n\nFor how these choices affect real-world accuracy, and for the metrics people use to compare models, see [pose estimation accuracy](/motion/pose-estimation-accuracy).\n\n## The honest limits of monocular 3D\n\nPredicting true depth from one image is inherently hard: it requires understanding perspective and accurate camera intrinsics that a single camera does not directly supply, so getting true metric scale without extra reference points or sensors is a real challenge. Do not present monocular 3D as sensor-grade. Specifically:\n\n- **Depth is estimated, not measured**, and it is *hip-relative* — for BlazePose, negative z means a keypoint is between the hips and the camera, positive means behind the hips. It is not absolute distance from the lens.\n- **Occluded joints have no reliable depth.** If a limb is hidden behind the body or an object, its z is a guess.\n- **Extremity joints (wrists, ankles, feet) drift more** than torso and hip joints, and inferred depth can be biomechanically implausible without post-processing.\n- **Any depth-accuracy number you find is condition- and dataset-specific.** As of 2026, verify it on your own camera, distances, and exercises rather than trusting a lab figure.\n\nTwo nuances that ride along with this. First, camera-based form feedback built on these angles is a coaching aid, not medical or physical-therapy advice — monocular depth error, occlusion, and lighting mean it can be wrong, so avoid framing it as injury assessment or clinical measurement, and point users to a professional for pain or injury. Second, if you ever move inference off-device, streaming raw workout video to a server is privacy-sensitive; the strongest posture is keeping pose estimation on the phone and sending only landmark coordinates if you need anything server-side.\n\n## Before you ship\n\nPick 2D by default, add monocular 3D only where out-of-plane motion demands it, and smooth the depth axis before you derive angles from it. Verify any accuracy or depth claim on your target hardware and real users — lab numbers rarely survive contact with messy lighting, baggy clothing, and oblique camera angles. When you are ready to wire it up, the [camera pose tracking guide](/guides/camera-pose-tracking) covers the implementation, and [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) cover the buy option if you would rather not build the pipeline yourself.",
    "faqs": [
      {
        "q": "Do I need a depth camera or LiDAR for 3D pose?",
        "a": "No. A normal RGB phone camera is enough for both 2D pose and monocular 3D world landmarks — models like BlazePose infer depth from a single view, so no depth sensor or LiDAR is required. A dedicated depth sensor or multi-camera rig only becomes worthwhile for high-accuracy biomechanics, at the cost of hardware and setup. For most consumer fitness apps, the plain camera is the right target because it maximizes device reach."
      },
      {
        "q": "How reliable is monocular 3D depth?",
        "a": "Less reliable than the x and y axes, and less reliable than multi-camera or depth-sensor 3D. Predicting true depth from one image is inherently hard, so monocular z is an estimate — hip-relative rather than absolute distance to the camera. It degrades most on occluded joints (which have no measurable depth), on extremities like wrists and ankles, and on angles that project into the depth axis. Treat it as a lower-confidence signal, smooth it over time, and validate on your own footage rather than trusting a published number."
      },
      {
        "q": "When is 2D enough and when do I need 3D?",
        "a": "2D is enough when the joint angle you measure stays in the camera plane — for example an elbow angle filmed side-on or a knee angle filmed from the side. It is cheaper and less noisy on the axis you can actually measure. Use 3D when the movement goes out of the plane: rotation toward or away from the camera, the depth of a lunge or squat, or a twist, where you need orientation that holds up as the viewing angle changes. Many fitness angle checks work fine in 2D, so add 3D only where you need it."
      },
      {
        "q": "Is 3D form feedback accurate enough for injury or medical advice?",
        "a": "No. Camera-based form feedback, whether 2D or monocular 3D, is a coaching aid, not medical or physical-therapy advice. Monocular depth error, occlusion, lighting, and clothing all introduce mistakes, so it cannot judge pain, injury history, or individual biomechanics. Keep the framing as general guidance and point users to a qualified professional for pain or injury. Any accuracy or depth-error figure you find should be verified on your own hardware and users, as of 2026."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-pose-estimation",
        "label": "What is pose estimation?"
      },
      {
        "href": "/motion/pose-estimation-accuracy",
        "label": "Pose estimation accuracy"
      },
      {
        "href": "/guides/camera-pose-tracking",
        "label": "Add camera pose tracking"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Pose-model behavior and depth accuracy shift across 2026 — subscribe for plain-English updates on when 2D is enough and when 3D earns its keep."
    }
  },
  {
    "slug": "pose-estimation-accuracy",
    "primaryQuery": "pose estimation accuracy",
    "h1": "Pose Estimation Accuracy: What It Means and What Drives It",
    "metaTitle": "Pose Estimation Accuracy: Metrics & What Drives It",
    "metaDescription": "What pose estimation accuracy means (PCK, OKS, MPJPE), what degrades it, and how to evaluate it on your own camera, lighting, and exercises.",
    "updated": "2026-07-24",
    "answer": "Pose estimation accuracy is not one number. It is a set of metrics measured on a specific dataset: PCK and OKS for 2D keypoints, MPJPE for 3D joints. Real-world accuracy is driven down by lighting, occlusion, camera angle, distance, loose clothing, fast motion, and multiple people, and it is recovered with per-keypoint confidence gating and temporal smoothing like the One-Euro filter. The key takeaway: a leaderboard score is not your app's accuracy, so the only number that matters is the one you measure on your own footage.",
    "body": "## What \"accuracy\" actually measures\n\nAccuracy metrics compare a model's predicted keypoints against human-labeled ground truth. Three matter for fitness work, and each answers a different question. Do not treat any published figure as fact — the numbers below are described conceptually because they shift with dataset, model version, and hardware (as of 2026, verify against the original benchmark).\n\n| Metric | What it measures | Higher or lower is better | Where it applies |\n| --- | --- | --- | --- |\n| PCK (Percentage of Correct Keypoints) | Fraction of predicted keypoints within a distance threshold of ground truth; `PCKh` normalizes that threshold by head size (the MPII convention) | Higher is better | 2D keypoints |\n| OKS (Object Keypoint Similarity) | The COCO keypoint metric; scales each keypoint's error by person size and a per-keypoint constant, then averages precision over a range of OKS thresholds (a lenient one and a strict one) | Higher is better | 2D keypoints |\n| MPJPE (Mean Per Joint Position Error) | Mean Euclidean distance in millimeters between predicted and true joints; the Procrustes-aligned variant `P-MPJPE` isolates joint structure from global rotation and scale error | Lower is better | 3D joints |\n\nThe practical point: pick the metric that mirrors your feature. If you compute in-plane joint angles for rep counting or form checks, a 2D metric like PCK or OKS is what tracks your quality. If you rely on out-of-plane depth (see [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation)), MPJPE is the relevant lens — and remember that monocular 3D depth is estimated, not measured, so its error is inherently larger than for the x/y axes you can actually see.\n\n## What degrades accuracy in the real world\n\nBenchmark scores are collected under favorable conditions — good lighting, a plain background, tight clothing, one clearly visible person. Real users are messier, and every one of these factors pushes accuracy down:\n\n- **Lighting** — low light, backlighting, and harsh shadows all reduce keypoint reliability.\n- **Occlusion** — limbs hidden behind the body or objects; a hidden joint has no visual evidence, and depth is simply unavailable for it.\n- **Camera angle** — extreme or oblique views distort the apparent joint geometry.\n- **Distance and framing** — a small subject in the frame gives the model fewer pixels to work with; the exercised body segment must be in view.\n- **Loose or baggy clothing** — hides the true joint location under fabric.\n- **Fast motion** — motion blur smears the keypoints the model is trying to lock onto.\n- **Multiple people vs. a single subject** — extra people introduce association errors (which keypoint belongs to whom); most single-person fitness models expect one primary subject.\n\nA consistent pattern across all of these: **extremities are less reliable than the torso.** Wrists, ankles, and feet tend to jitter and drift more than hips and shoulders, so angle calculations that depend on an extremity are the first to suffer.\n\n## Confidence and visibility scores are your safety rail\n\nPose models do not just emit coordinates — they emit a per-keypoint **confidence** or **visibility** score, and some (like MediaPipe/BlazePose) add a separate **presence** score. Visibility trends toward its high end when a landmark is clearly in view and toward its low end when the joint is occluded or off-frame.\n\nGate your logic on these scores. Before you compute a joint angle or count a rep, drop or down-weight low-visibility keypoints rather than trusting a coordinate the model itself is unsure about. A rep counter that blindly reads an occluded ankle will miscount; one that checks visibility first can hold its state until the joint reappears. This is the cheapest accuracy win available, and it costs nothing but a threshold check.\n\n## Jitter and temporal smoothing\n\nEven with good keypoints, frame-to-frame **jitter** is one of the biggest practical accuracy problems. Per-frame estimation treats each frame independently, so a joint that is genuinely still can wobble by a few pixels every frame, and that noise propagates straight into angle and rep calculations.\n\nThe standard, low-cost fix is the **One-Euro filter**, a first-order low-pass filter with an *adaptive* cutoff: it filters aggressively at low speed to kill jitter during a static hold, and relaxes at high speed to avoid adding lag during fast movement. It exposes two tunable parameters — `minCutoff` (raise to reduce lag, lower to reduce jitter) and `beta` (raise to cut lag on fast motion). It is widely used for real-time pose smoothing precisely because it balances the jitter-versus-lag trade-off without much compute. Kalman filters and learned temporal refiners like SmoothNet are alternatives or complements, but for most live fitness pipelines a well-tuned One-Euro filter on the keypoints (before you derive angles) is the pragmatic default.\n\n## How to evaluate accuracy for your own use case\n\nDo not trust a leaderboard AP alone. A model tuned to top a public benchmark can still be the wrong choice for your camera and your exercises. A grounded evaluation:\n\n- **Test on your real conditions** — your camera hardware, your users' lighting, the distances and angles they actually stand at, the clothing they wear, and the specific exercises you support. Record footage that looks like production, not a lab.\n- **Match the metric to the feature** — 2D angle and rep work maps to PCK/OKS; depth-dependent 3D work maps to MPJPE. Measuring the wrong metric tells you nothing useful.\n- **Measure jitter, not just static accuracy** — hold a static pose and look at the variance of each keypoint across frames. A model with a great average score but heavy jitter will feel worse than a steadier, slightly-less-accurate one.\n- **Measure latency too** — accuracy is meaningless if feedback lags the movement; check end-to-end latency on your target devices, especially older ones.\n- **Validate the full pipeline** — test visibility gating and smoothing end to end, on the actual angle thresholds and rep logic your app uses, not on raw keypoints in isolation.\n\n## The honest limits\n\nA few things to be candid about with yourself and your users. First, a published accuracy figure is a lab result under favorable conditions — never present it as your app's real-world accuracy, and never fabricate a percentage of your own; describe capability, then measure. Second, monocular single-camera estimation carries real error, and it degrades most on exactly the depth-dependent and occluded joints — camera-based form feedback is a coaching aid, not medical, physical-therapy, or injury assessment. Third, if you want a step-by-step fix list rather than this conceptual overview, that is a different page: [improve pose detection accuracy](/guides/improve-pose-detection-accuracy) is the how-to-fix, while this page is the what-and-why. For the underlying concept, start at [what is pose estimation](/learn/what-is-pose-estimation).\n\nBottom line: prioritize stable, low-jitter tracking with visibility gating and One-Euro smoothing over chasing a headline benchmark, choose the metric that mirrors your feature, and verify everything on your own hardware and footage before you trust it.",
    "faqs": [
      {
        "q": "What do PCK, OKS, and MPJPE measure?",
        "a": "PCK (Percentage of Correct Keypoints) is the fraction of 2D keypoints within a distance threshold of ground truth, with the PCKh variant normalizing by head size. OKS (Object Keypoint Similarity) is the COCO 2D metric that scales each keypoint's error by person size and a per-keypoint constant. MPJPE (Mean Per Joint Position Error) is the 3D metric, the mean distance in millimeters between predicted and true joints. Higher PCK and OKS are better; lower MPJPE is better. Treat any published figure as dataset- and version-dependent and verify it against the original benchmark."
      },
      {
        "q": "What degrades pose estimation accuracy the most?",
        "a": "Low or backlit lighting, occlusion of joints behind the body or objects, extreme camera angles, too much distance from the camera, loose or baggy clothing, and fast motion (motion blur) all reduce accuracy. Multiple people in frame add association errors. Extremities like wrists and ankles are typically less reliable than the torso and hips. Benchmark scores are collected under favorable lab conditions, so real-world accuracy is generally lower than a published number suggests."
      },
      {
        "q": "How do confidence and visibility scores help?",
        "a": "Pose models emit a per-keypoint confidence or visibility score (some, like BlazePose, add a presence score) that indicates how sure the model is about each joint. Gate your logic on these: drop or down-weight low-visibility keypoints before you compute a joint angle or count a rep, rather than trusting a coordinate the model itself is uncertain about. It is the cheapest accuracy win available, costing only a threshold check."
      },
      {
        "q": "What is the One-Euro filter and why is it used?",
        "a": "The One-Euro filter is a low-pass filter with an adaptive cutoff used to reduce frame-to-frame jitter in real-time pose tracking. It filters aggressively at low speed to steady static holds and relaxes at high speed to avoid adding lag during fast movement, tuned with two parameters (minCutoff and beta). Apply it to keypoints before deriving angles or reps. Kalman filters and learned refiners like SmoothNet are alternatives, but One-Euro is a common low-cost default."
      },
      {
        "q": "How do I evaluate accuracy for my own app?",
        "a": "Do not trust a leaderboard score alone. Record footage that matches production (your camera, your users' lighting, distances, angles, clothing, and exercises) and measure there. Match the metric to your feature: PCK or OKS for 2D angle and rep work, MPJPE for depth-dependent 3D. Also measure jitter (keypoint variance on a static hold) and end-to-end latency, not just static accuracy, and validate visibility gating and smoothing across the full pipeline. Never present a lab figure as your app's real-world accuracy."
      }
    ],
    "related": [
      {
        "href": "/guides/improve-pose-detection-accuracy",
        "label": "Improve pose detection accuracy"
      },
      {
        "href": "/motion/2d-vs-3d-pose-estimation",
        "label": "2D vs 3D pose estimation"
      },
      {
        "href": "/learn/what-is-pose-estimation",
        "label": "What is pose estimation?"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Want the accuracy metrics and degradation gotchas flagged before they surprise you in production? Get our developer notes on camera-based motion tracking."
    }
  },
  {
    "slug": "multi-person-pose-tracking",
    "primaryQuery": "multi person pose tracking",
    "h1": "Multi-Person Pose Tracking: Top-Down vs Bottom-Up",
    "metaTitle": "Multi-Person Pose Tracking: Top-Down vs Bottom-Up",
    "metaDescription": "Multi-person pose tracking explained: top-down vs bottom-up, which models do which (YOLO-pose, OpenPose), tracking IDs, and when a fitness app needs it.",
    "updated": "2026-07-24",
    "answer": "Multi-person pose tracking estimates several people's skeletons in one frame and keeps each identity stable across frames. Two paradigms exist: top-down detects each person then runs pose per box (accurate per person, but cost grows with the number of people), and bottom-up finds all keypoints then groups them (cost stays roughly constant, but grouping is harder and less accurate). Most fitness apps are single-user, where single-person models like MediaPipe or MoveNet are simpler and more accurate. Pick multi-person (YOLO-pose top-down or OpenPose bottom-up, plus a cross-frame tracking layer) only for group classes, gyms, or two-person sessions.",
    "body": "For the fuller picture of which model to use, see [pose estimation models compared](/motion/pose-estimation-models-compared), and for implementation the [camera pose tracking guide](/guides/camera-pose-tracking). Concepts start at [what is pose estimation](/learn/what-is-pose-estimation).\n\n## Top-down vs bottom-up\n\nThe two paradigms differ in the order of operations, and that order drives the cost and accuracy trade-off.\n\n- **Top-down** first runs a person detector, then estimates pose *per detected person* (one person per cropped box). Each person gets a clean, well-framed crop, so per-person accuracy is generally higher — but you run the pose model once per person, so **inference cost grows with the number of people** in the frame.\n- **Bottom-up** detects *all keypoints in the whole image at once*, then groups them into individuals — for example `OpenPose`'s Part Affinity Fields, which learn the association between joints. **Cost is roughly constant** regardless of how many people are present, but the association step (deciding which elbow belongs to which shoulder) is harder, and accuracy is typically lower than top-down.\n\n| | Top-down | Bottom-up |\n| --- | --- | --- |\n| Order of work | Detect each person, then pose per box | All keypoints first, then group into people |\n| Per-person accuracy | Higher (clean crop per person) | Typically lower (association can err) |\n| Cost as crowd grows | Grows with number of people | Roughly constant |\n| Hard part | Extra detection pass per person | Grouping keypoints correctly |\n| Example models | `YOLO-pose` (detection + keypoints in one pass) | `OpenPose` (Part Affinity Fields) |\n\nRule of thumb: top-down favors **accuracy in modest crowds**, bottom-up favors **predictable cost in large crowds**. Neither is a universal winner — verify the behavior on your own scene and hardware.\n\n## Which models do which\n\n- **`OpenPose` (CMU)** — bottom-up, the classic multi-person system, using Part Affinity Fields to associate keypoints into people. It is heavy and GPU-oriented, and its license is **non-commercial / academic research** — a separate license is required for commercial use, so verify terms before you ship anything commercial. See [OpenPose models](/motion/openpose-models).\n- **`YOLO-pose` / Ultralytics (`YOLO26-pose`, the current generation in Ultralytics' pose docs)** — detection-driven multi-person: it produces person boxes and 17 keypoints in one pass (top-down style). It is capable in crowded scenes but is licensed **AGPL-3.0** (strong copyleft) with a paid Enterprise License to bypass AGPL — treat the license as a real legal decision point for a commercial app. See [Ultralytics YOLO pose models](/motion/yolo-pose-models).\n- **`RTMPose` (OpenMMLab MMPose)** — top-down: its published pipelines pair an RTMDet person detector with the pose model, in 17, 26 and 133 keypoint sets, under an Apache-2.0 codebase. See [RTMPose models](/motion/rtmpose-models).\n- **`MediaPipe` / `BlazePose` (Google)** — **single-person focused**: its model card says it tracks one person and lists multiple people as out of scope. The Tasks API does have a `num_poses` setting, but it defaults to 1 and the card does not evaluate more, so treat a raised value as something to test. It predicts 33 landmarks (a superset of the 17 COCO keypoints) and is optimized for on-device real-time use.\n- **`MoveNet` / `PoseNet`** — 17 keypoints each. MoveNet's SinglePose models are single-person, while MoveNet MultiPose Lightning detects up to 6 people, per its model card; see [MoveNet models](/motion/movenet-models). `PoseNet` can detect multiple poses but is legacy — prefer `MoveNet` or `BlazePose` for new work.\n\nIf you only ever have one person in frame, none of the multi-person machinery above is worth its complexity — a single-person on-device model is the better default.\n\n## Tracking IDs across frames\n\nEstimating poses in a single frame is only half the job for multi-person work. You also need **identity association across frames** — keeping person A labeled as person A from one frame to the next. This is a **separate tracking layer** on top of per-frame pose estimation:\n\n- Common approaches include box/IoU tracking, ByteTrack-style trackers, or pose-based association.\n- Bottom-up grouping only handles association *within* a single frame; cross-frame ID persistence is added on top.\n- Track IDs can be **lost or swapped** when people occlude each other or cross paths — a real failure mode in group scenes. Verify how your chosen tracker behaves on your camera angle and crowd density.\n\n## When a fitness app actually needs this\n\n- **Single-user (the common case):** one person in front of one camera — a home rep-counting or form-feedback app. Use a single-person model (`MediaPipe`/`BlazePose` or `MoveNet`); skip multi-person and the tracking-ID layer entirely.\n- **Group classes, gyms, team or two-person sessions, overhead studio cameras:** several people tracked at once. Here you need a multi-person model plus a cross-frame ID tracker.\n\nFor the multi-person case, choose by crowd size and where per-person accuracy matters:\n\n- **Top-down (`YOLO-pose`)** when per-person accuracy matters and the crowd is modest — mind the AGPL-3.0 license.\n- **Bottom-up (`OpenPose`)** when the crowd is large and you want cost that does not scale with the number of people — mind the non-commercial license.\n- **Add a dedicated tracking-ID layer** for any multi-person case.\n\n## The honest limits\n\nMulti-person adds failure modes on top of the usual pose-estimation caveats:\n\n- **Association errors.** Bottom-up grouping and cross-frame tracking can both mislabel or swap people, especially under occlusion or when paths cross.\n- **Cost.** Top-down inference cost grows with the number of people; a busy frame can blow your latency budget on lower-end hardware.\n- **The usual degraders still apply.** Lighting, occlusion, oblique camera angles, small/distant subjects, baggy clothing, and motion blur all reduce accuracy — and multiple overlapping people make occlusion worse.\n- **Hardware.** A normal RGB camera is enough (no depth sensor or LiDAR needed), but multi-person top-down and heavier bottom-up models are GPU-oriented, which often pushes you toward edge-GPU or [server-side deployment](/motion/on-device-vs-cloud-pose-estimation) — with the privacy and cost trade-offs that streaming video implies.\n- **Not medical advice.** Any form feedback layered on top of pose tracking is a coaching aid, not medical or physical-therapy advice.\n\nDo not build around specific per-person latency or crowd-scaling frame-rate figures you read anywhere, including here — those numbers vary wildly by device and scene. Test on your own hardware.\n\n## Before you ship\n\nConfirm you actually need multi-person — if you are single-user, a single-person on-device model is simpler and more accurate. If you do need it, decide top-down vs bottom-up by crowd size and per-person accuracy, add a cross-frame tracking-ID layer, and **re-verify the licenses** (`OpenPose` non-commercial, Ultralytics `YOLO` AGPL-3.0) and current multipose support before committing. Then measure latency and ID stability on your target hardware. When you would rather buy the tracking layer than build it, see [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis).",
    "faqs": [
      {
        "q": "What is the difference between top-down and bottom-up pose estimation?",
        "a": "Top-down first detects each person, then runs a pose model on each cropped box, so per-person accuracy is generally higher but inference cost grows with the number of people. Bottom-up detects all keypoints in the image at once and then groups them into individuals, so cost stays roughly constant regardless of crowd size, but the grouping step is harder and accuracy is typically lower. Verify the trade-off on your own scene and hardware."
      },
      {
        "q": "Does my fitness app need multi-person pose tracking?",
        "a": "Usually not. Most fitness apps are single-user, with one person in front of one camera, and single-person models such as MediaPipe/BlazePose or MoveNet are simpler, cheaper, and more accurate for that case. You need multi-person tracking only when several people are in frame at once, such as group classes, gyms, team or two-person sessions, or overhead studio cameras."
      },
      {
        "q": "Which models support multi-person pose?",
        "a": "OpenPose is the classic bottom-up multi-person system using Part Affinity Fields to group keypoints. YOLO-pose (Ultralytics) is detection-driven, producing person boxes and keypoints in one pass (top-down style). MediaPipe/BlazePose and MoveNet's SinglePose models are single-person oriented. MoveNet MultiPose Lightning detects up to 6 people per its model card, and PoseNet can detect multiple poses but is legacy."
      },
      {
        "q": "How are people tracked across frames?",
        "a": "Per-frame pose estimation does not by itself keep identities stable, so multi-person work adds a separate tracking layer that associates the same person from frame to frame, using approaches like box/IoU tracking, ByteTrack-style trackers, or pose-based association. Track IDs can be lost or swapped when people occlude each other or cross paths, so verify how your tracker behaves on your camera angle and crowd density."
      },
      {
        "q": "Are there licensing concerns with multi-person models?",
        "a": "Yes, and they are a real decision point. OpenPose ships under a non-commercial/academic research license, so commercial use requires a separate license. Ultralytics YOLO (including YOLO-pose) is AGPL-3.0, a strong copyleft license, with a paid Enterprise License to bypass AGPL. Verify current license terms before shipping a commercial product."
      }
    ],
    "related": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "Pose estimation models compared"
      },
      {
        "href": "/guides/camera-pose-tracking",
        "label": "Add camera pose tracking"
      },
      {
        "href": "/fitness-apis/ai-workout-tracking-apis",
        "label": "Best AI workout tracking APIs"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Deciding between single-user and multi-person tracking? Get our newsletter on pose estimation, model choice, and the licensing gotchas that bite fitness apps."
    }
  },
  {
    "slug": "on-device-vs-cloud-pose-estimation",
    "primaryQuery": "on device vs cloud pose estimation",
    "h1": "On-Device vs Cloud Pose Estimation: Which to Choose",
    "metaTitle": "On-Device vs Cloud Pose Estimation: 7 Factors",
    "metaDescription": "On-device pose estimation is private, low-latency, offline, and free per frame - the fitness default. Cloud wins for heavier models. How to decide.",
    "updated": "2026-07-24",
    "answer": "The choice is where the pose model runs: on the phone or on a server. For consumer fitness, on-device is almost always the right default - toolkits like ML Kit Pose, MediaPipe/BlazePose, TensorFlow Lite/LiteRT, and Core ML or Vision run inference locally, so it is private, works offline, has no network round-trip, and costs nothing per frame. Cloud lets you run a heavier or custom model with results consistent across every device, but you pay in latency, bandwidth, per-frame cost, and the privacy weight of streaming raw workout video. Pick on-device for real-time coaching and privacy; reach for cloud only when a model will not fit on the phone or you need identical output across many devices.",
    "body": "## On-device vs cloud, side by side\n\nOn-device means the frames never leave the phone: the model runs on the device CPU, GPU, or neural accelerator and emits keypoints locally. Cloud means you send frames (or a video stream) to a server that runs the model and returns keypoints. The table below lays out the trade-off. Any latency or cost figure is vendor-, region-, and model-specific, so treat those as \"verify with your provider,\" not fixed numbers.\n\n| Factor | On-device | Cloud |\n|---|---|---|\n| Latency | No network round-trip; well suited to live coaching | Adds network latency per frame — verify against your provider |\n| Privacy | Frames stay on the phone; strongest posture | Raw workout video leaves the device — sensitive biometric exposure |\n| Offline | Works with no signal (gym basement, plane) | Needs a live connection |\n| Per-frame cost | None — no server bill per inference | Recurring per-frame/per-minute GPU cost — verify pricing |\n| Model size | Bounded by the device; use a mobile-optimized model | Can run heavier or custom models |\n| Consistency | Varies with device hardware and accelerator | Identical results regardless of the user's device |\n| Toolkits | ML Kit Pose, MediaPipe/BlazePose, LiteRT, Core ML and Vision | Your own model served on GPU infrastructure |\n\nToolkit note: Google ML Kit Pose Detection is an on-device API that tracks 33 body landmarks and is marketed for real-time fitness; MediaPipe/BlazePose is explicitly optimized for on-device, real-time fitness use; LiteRT (formerly TensorFlow Lite) is Google's on-device runtime with GPU and NPU acceleration; on Apple platforms, Core ML and the Vision framework run pose locally on the Neural Engine with no network and no per-call cost. For how real-time budgets and frame rates actually work once you pick a side, see [real-time pose estimation](/motion/real-time-pose-estimation).\n\n## The privacy weight of streaming video\n\nThis is the factor that usually decides it. A workout video is not neutral data — it is raw footage of a person's body, face, and home, which is sensitive personal and biometric information. When you transmit frames to a server for processing, you inevitably share far more than a rep count: facial features and other identifying traits ride along in every frame. That raises the compliance stakes. Body and biometric data can trigger regimes like the EU's GDPR (cross-border transfer safeguards, data processing agreements) and US biometric laws such as Illinois BIPA (written retention and destruction schedules, with statutory damages) — treat the specific figures and retention windows as \"verify, and consult counsel,\" because this is a concept for a developer to plan around, not legal advice.\n\nThe architecture that sidesteps most of this is privacy-by-design: run pose detection **on the edge device** and, if you need anything server-side, transmit only the text-based landmark coordinates rather than the raw video. Keeping inference on-device and never transmitting frames is simply the strongest privacy posture available. For the broader trade-off, see [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data), and for handling whatever data you do keep, [store health data securely](/compliance/store-health-data-securely).\n\n## Which should you pick?\n\nThere is no universal winner, but for fitness the default leans hard one way. Match the choice to your use case:\n\n- **Consumer fitness app (rep counting, form feedback, live coaching):** on-device. You get real-time responsiveness, offline use in a poor-signal gym, video that never leaves the phone, and zero per-frame server cost. This is the default for most fitness apps.\n- **A model too heavy or too custom to fit on the phone:** cloud — if you accept the latency, bandwidth, per-frame cost, and the compliance burden of processing video server-side.\n- **Guaranteed identical results across a huge device range,** or centralized post-hoc analytics on many users: cloud can standardize behavior that on-device inference lets vary with hardware.\n- **Best of both (hybrid):** run pose on-device and send only anonymized landmark streams — never raw video — to the server for analytics or logging. You keep the frames local and still get server-side aggregation.\n\nIf you would rather not build and maintain either path yourself, a managed motion-tracking layer can carry it; see [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis).\n\n## The honest limits\n\nA few caveats worth stating plainly. On-device performance depends on the phone: older or low-end devices without a strong GPU or NPU may run a heavier model slowly, which is why you target a mobile-optimized model and, where needed, a lighter variant or a lower frame rate. Cloud does not remove work either — it moves it to GPU infrastructure you now run and pay for at frame rate, plus the video-handling compliance obligations above. And whichever side runs the model, camera-based form feedback from a single RGB camera is a coaching aid, not medical or physical-therapy advice; monocular estimates carry real error and should not be presented as clinical measurement.\n\n## Before you ship\n\nDecide based on your product, not a benchmark: for consumer fitness, on-device is the privacy-preserving, low-latency, zero-per-frame-cost default, and cloud earns its place only for heavier models or cross-device consistency you cannot get otherwise. Verify latency and pricing with your actual provider and on your target hardware, and treat any compliance figure as \"verify, consult counsel.\" When you are ready to wire up the camera pipeline, the [camera pose tracking guide](/guides/camera-pose-tracking) walks through implementation, and [what is pose estimation](/learn/what-is-pose-estimation) covers the underlying concept.",
    "faqs": [
      {
        "q": "Is on-device or cloud pose estimation better for a fitness app?",
        "a": "For most consumer fitness apps, on-device is the better default. Running the model on the phone with a toolkit like ML Kit Pose, MediaPipe/BlazePose, LiteRT, or Core ML and Vision gives you real-time responsiveness with no network round-trip, offline use in a poor-signal gym, video that never leaves the device, and no per-frame server cost. Cloud is worth it mainly when a model is too heavy or custom to run on the phone, or you need identical results across a huge range of devices - and you can accept the latency, cost, and video-handling compliance burden. Verify latency and pricing with your own provider and hardware."
      },
      {
        "q": "Why is streaming workout video to a server a privacy concern?",
        "a": "A workout video is raw footage of a person's body, face, and home - sensitive personal and biometric data, not a neutral rep count. When you transmit frames to a server, identifying traits like facial features ride along in every frame. That can trigger compliance regimes such as the EU's GDPR and US biometric laws like Illinois BIPA, which govern retention, consent, and cross-border transfer. Treat the specific figures and rules as verify and consult counsel. The strongest privacy posture is keeping inference on-device so frames never leave the phone."
      },
      {
        "q": "Can I keep video private but still use a server?",
        "a": "Yes, with a hybrid architecture. Run pose detection on the edge device, then transmit only the text-based landmark coordinates - not the raw video - to your server for analytics or logging. Keeping the frames local while sending anonymized landmark streams preserves most of the privacy benefit of on-device while still giving you server-side aggregation. This privacy-by-design pattern avoids exposing the sensitive footage that streaming full video would."
      },
      {
        "q": "Does cloud pose estimation cost more than on-device?",
        "a": "Generally yes, in a recurring way. On-device inference runs on hardware the user already owns, so there is no per-frame server bill. Cloud pose inference typically needs GPU infrastructure running at frame rate, which is a recurring per-frame or per-minute cost, plus bandwidth for streaming frames. Exact pricing is vendor-, region-, and model-specific, so verify it with your provider rather than relying on a fixed figure. Cloud does not remove work - it moves it to infrastructure you run and pay for."
      },
      {
        "q": "Does on-device pose estimation work on older phones?",
        "a": "It can, but performance depends on the device. Phones with a strong GPU or neural accelerator run pose models smoothly, while older or low-end devices may run a heavy model slowly. The usual fix is to target a mobile-optimized model and, where needed, a lighter variant or a lower frame rate. A normal RGB camera is enough - no depth sensor or LiDAR is required. Verify frame rate on your actual target hardware, since it varies widely across devices."
      }
    ],
    "related": [
      {
        "href": "/learn/on-device-vs-cloud-health-data",
        "label": "On-device vs cloud health data"
      },
      {
        "href": "/compliance/store-health-data-securely",
        "label": "Store health data securely"
      },
      {
        "href": "/motion/real-time-pose-estimation",
        "label": "Real-time pose estimation"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "On-device toolkits, accelerators, and biometric-privacy rules keep shifting through 2026 - subscribe for plain-English updates when the pose-estimation and compliance landscape changes."
    }
  },
  {
    "slug": "real-time-pose-estimation",
    "primaryQuery": "real time pose estimation",
    "h1": "Real-Time Pose Estimation: Frame Rate, Latency, and Model Trade-offs",
    "metaTitle": "Real-Time Pose Estimation: The Trade-offs",
    "metaDescription": "What real-time pose estimation needs: frame-rate and latency budget, model size vs speed, frame dropping, smoothing, and battery. Pick by use case.",
    "updated": "2026-07-24",
    "answer": "Real-time pose estimation means the pipeline keeps up with the live camera stream so feedback feels immediate. It is a budget problem: a frame-rate and latency target balanced against model size, battery, and thermals. The central lever is model size vs speed. Pick a smaller, faster model (MoveNet Lightning or a fast SDK mode) for live rep counting and low-end devices; pick a larger, more accurate one (MoveNet Thunder or an accurate mode) for detailed form scoring where you can process fewer frames. Treat every fps and latency figure as device-dependent and verify on your target hardware.",
    "body": "Treat every frame-rate and latency figure as something to [verify on your target hardware](/motion/pose-estimation-hardware-requirements), because it depends on the device, the accelerator, and the input resolution. This page assumes you already know [what pose estimation is](/learn/what-is-pose-estimation).\n\n## What \"real-time\" actually requires\n\nTwo numbers define the budget, and they are not the same thing:\n\n- **Frame rate** — how many frames per second you can process. Interactive, smooth tracking is commonly framed around 30 fps, but usable coaching can work at lower rates. Treat any single number as a target to verify per device, not a guarantee — older and budget phones may fall short of a vendor's \"modern device\" claim.\n- **End-to-end latency** — the delay from a movement happening to feedback appearing on screen. Even at a healthy frame rate, a long processing or smoothing pipeline can make feedback feel laggy. Both have to fit for the experience to feel immediate.\n\nEverything else is a lever you pull to fit those two numbers on your hardware.\n\n## The levers you can pull\n\nYou rarely change just the model. These are the knobs that trade accuracy, responsiveness, and battery against each other:\n\n| Lever | What it does | The trade-off |\n| --- | --- | --- |\n| Model size / variant | Smaller model (`MoveNet Lightning`, `BlazePose Lite`, \"fast\" SDK mode) runs faster; larger (`Thunder`, `Heavy`, \"accurate\" mode) is more precise | Speed vs. accuracy. `Thunder` has roughly 1.75x more compute than `Lightning`; positioning is documented, exact fps is not — verify |\n| Input resolution | Downscaling the frame before inference cuts compute | Lower resolution is faster and lighter but loses keypoint precision, especially on small or distant subjects |\n| Frame dropping | If inference can't keep up, skip frames instead of queuing them | Keeps tracking current rather than falling behind; you lose some frames but avoid growing lag |\n| Hardware acceleration | Run on GPU / NPU / Neural Engine instead of CPU | Faster inference and less energy per frame — but availability and speedup vary by device (see [hardware requirements](/motion/pose-estimation-hardware-requirements)) |\n| Temporal smoothing | Filter noisy per-frame keypoints before deriving angles or reps | Removes jitter, but a heavier filter adds latency; a One Euro filter is a common low-cost, low-lag default |\n| Processing every Nth frame | Deliberately inferring on a subset of frames | Cuts load and battery draw, but coarser tracking — fine for slow movements, risky for fast reps |\n\n### Run on the stream, and be willing to drop frames\n\nProcess the live camera feed directly, and if inference falls behind, **drop frames rather than queue them**. A queue that grows means your feedback drifts further and further behind the user's real movement; skipping stale frames keeps tracking anchored to the present. This is usually the single most important design choice for making a pipeline feel real-time on mid-range hardware.\n\n### Smooth the signal before you trust it\n\nPer-frame pose estimation jitters — the keypoints wobble even when the subject holds still. Raw keypoints are too noisy to derive clean joint angles or rep counts, so apply **temporal smoothing** first. The **One Euro filter** is a common choice: its adaptive cutoff kills jitter when the subject is slow while limiting lag when they move fast, and it is cheap to run. Kalman filters and learned refiners like SmoothNet are alternatives when you need more. Smooth the keypoints, then derive angles and reps from the smoothed signal — see the [camera pose tracking guide](/guides/camera-pose-tracking) for wiring this up.\n\n### Battery and thermals are part of the budget\n\nA continuous camera plus continuous inference is a **sustained load**, not a one-off. Over a full workout it drains battery and heats the device, and a hot device can throttle — quietly lowering your effective frame rate mid-session. Hardware acceleration (GPU/NPU) helps twice: it runs inference faster *and* uses less energy per frame than CPU. A lighter model, lower resolution, or processing fewer frames all reduce the sustained draw. Test for thermal throttling over a realistic session length, not just a ten-second demo.\n\n## Which model should you pick?\n\nThere is no universal winner — match the model to the job:\n\n- **Live rep counting and real-time overlays:** pick a **`Lightning`-class or \"fast\" model**. Responsiveness beats millimeter precision when the user needs an immediate rep count or a moving skeleton overlay.\n- **Low-end and older devices:** go lighter still — a small model, lower input resolution, and aggressive frame dropping. These devices lack a strong NPU, so the model has to fit the CPU/GPU budget you actually have.\n- **Detailed form scoring or post-session review:** a **`Thunder`-class or \"accurate\" model** earns its cost here, especially if you can process fewer frames or run the analysis after the set rather than live.\n- **Consistency across a wide device range:** if per-device tuning is impractical, that pressure often pushes toward [cloud vs. on-device](/motion/on-device-vs-cloud-pose-estimation) trade-offs — heavier server models give uniform results but add latency, bandwidth, cost, and privacy exposure.\n\nIf you would rather not tune this pipeline yourself, a maintained motion SDK bundles the model, smoothing, and rep logic — see [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis).\n\n## The honest limits\n\n- **Do not trust a headline fps number.** A vendor's \"runs faster than real time on modern devices\" is a claim about *their* reference hardware. Your fps depends on the device, the accelerator (delegate), the resolution, and the model's input size. Measure it yourself.\n- **Smoothing trades lag for stability.** Over-smoothing makes tracking feel sluggish; under-smoothing leaves jitter that corrupts angles and double-counts reps. It is a dial to tune per exercise, not a fixed setting.\n- **Thermal throttling is real.** A device that hits your frame-rate target for thirty seconds may not hold it for a thirty-minute session once it heats up.\n- **Form feedback derived from this is a coaching aid, not medical advice.** Real-time angles from a single camera carry error and cannot judge pain, injury, or individual biomechanics.\n\n## Before you ship\n\nFix your frame-rate and latency targets first, then pick the lightest model that hits them on your **lowest-end target device** — not your development phone. Drop frames instead of queuing them, smooth before you derive angles or reps, and verify battery and thermal behavior over a full session. Every performance number here is device-dependent, so as of 2026, verify on your target hardware. When you are ready to build the pipeline, the [camera pose tracking guide](/guides/camera-pose-tracking) walks through the implementation.",
    "faqs": [
      {
        "q": "What frame rate do I need for real-time pose estimation?",
        "a": "Smooth, interactive tracking is commonly framed around 30 fps, but usable coaching can work at lower rates, so treat any single number as a target rather than a hard requirement. Your achievable frame rate depends on the device, the accelerator, the input resolution, and the model, and older or budget phones may fall short of a vendor's modern-device claim. Measure it on your lowest-end target device rather than trusting a headline figure."
      },
      {
        "q": "Should I use MoveNet Lightning or Thunder?",
        "a": "Lightning is tuned for speed with a smaller model and lower input resolution, so it suits live rep counting, real-time overlays, and low-end devices. Thunder is larger and more accurate, which fits detailed form scoring or post-session review where you can afford more compute or process fewer frames. The positioning is documented but the exact fps is device-dependent, so verify on your target hardware before committing."
      },
      {
        "q": "What should I do if inference can't keep up with the camera?",
        "a": "Drop frames rather than queue them. If you queue frames the model can't process in time, feedback drifts further and further behind the user's real movement, whereas skipping stale frames keeps tracking anchored to the present. You can also downscale the input resolution, switch to a lighter model, or run inference on the GPU or NPU instead of the CPU to free up budget."
      },
      {
        "q": "Why is temporal smoothing needed?",
        "a": "Per-frame pose estimation jitters, so the keypoints wobble even when the subject holds still, and raw keypoints are too noisy to derive clean joint angles or rep counts. A temporal filter such as the One Euro filter removes that jitter cheaply, using an adaptive cutoff that limits lag when the subject moves fast. Smooth the keypoints first, then derive angles and reps, but tune the filter per exercise because over-smoothing makes tracking feel sluggish."
      },
      {
        "q": "Does continuous pose estimation drain the battery?",
        "a": "Yes. A continuous camera plus continuous inference is a sustained load that drains battery and heats the device over a full workout, and a hot device can throttle and quietly lower your frame rate mid-session. Hardware acceleration on the GPU or NPU runs inference faster and uses less energy per frame than the CPU, and a lighter model, lower resolution, or processing fewer frames all reduce the draw. Test for thermal throttling over a realistic session length, not a short demo."
      }
    ],
    "related": [
      {
        "href": "/motion/on-device-vs-cloud-pose-estimation",
        "label": "On-device vs cloud pose estimation"
      },
      {
        "href": "/motion/pose-estimation-hardware-requirements",
        "label": "Pose estimation hardware requirements"
      },
      {
        "href": "/guides/camera-pose-tracking",
        "label": "Add camera pose tracking"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Want the frame-rate, smoothing, and thermal gotchas flagged before they hit your build? Get our developer notes on real-time motion tracking."
    }
  },
  {
    "slug": "pose-estimation-hardware-requirements",
    "primaryQuery": "pose estimation hardware requirements",
    "h1": "Pose Estimation Hardware Requirements: What You Actually Need",
    "metaTitle": "Pose Estimation Hardware Requirements: No LiDAR Needed",
    "metaDescription": "A normal RGB phone camera is enough for 2D and monocular 3D pose - no depth sensor or LiDAR. GPU/NPU acceleration helps; old devices need a lighter model.",
    "updated": "2026-07-24",
    "answer": "A normal RGB smartphone camera is enough for both 2D pose and monocular (single-camera) 3D pose - no depth sensor or LiDAR is required. What matters is hardware acceleration: a GPU or NPU/Neural Engine keeps inference fast and battery-friendly, while older and low-end devices with weaker chips run slower and may need a lighter model, lower resolution, or frame dropping. Lighting and full-body framing affect accuracy as much as silicon does. Best pick for reach: target the RGB camera plus a GPU delegate so mid-range and older phones work, and opt into NPU/Neural Engine for headroom where it exists. Going cloud instead adds a server GPU as a recurring cost.",
    "body": "New to the concept? Start with [what pose estimation is](/learn/what-is-pose-estimation); this page is about the hardware you actually need to run it.\n\n## What you need — and what you can skip\n\nThe good news is that the demanding-sounding parts (depth cameras, dedicated sensors) are optional. 2D pose runs from a single RGB frame — `BlazePose`, for example, infers 33 body landmarks from one image. Even Apple's *3D* body-pose request works from RGB and \"uses depth data when the device exposes it to improve accuracy, but does not require a LiDAR Scanner\" (per Apple's Vision documentation — verify current behavior). Depth hardware helps 3D only marginally and shrinks your addressable devices, so for 2D fitness use it rarely earns its keep.\n\nThe parts that *do* matter are the camera you already have, hardware acceleration, and the conditions you film in.\n\n| Requirement | Why | Notes |\n| --- | --- | --- |\n| RGB camera (any modern phone) | 2D and monocular 3D pose both run from a single RGB frame; no depth channel is needed | Depth sensor / LiDAR is optional and only marginally improves 3D — do not require it |\n| GPU or NPU / Neural Engine acceleration | Speeds inference and cuts energy per frame versus CPU, which sustains real-time frame rates | Apple auto-dispatches Neural Engine then GPU then CPU; Android uses the LiteRT GPU delegate (nearly universal) or an NPU delegate on supported SoCs |\n| Enough CPU/GPU headroom | Older / low-end devices without an NPU and with weaker GPUs hit lower frame rates | Fall back to a lighter model, lower input resolution, or frame dropping to stay responsive |\n| Good lighting | Accuracy degrades in low light, backlight, and harsh shadows | Lab results assume good lighting and a plain background; real rooms are worse — verify on real users |\n| Full-body (or full-segment) framing | The exercised joints must be in frame and unoccluded to be tracked | Cluttered backgrounds, occlusion, and oblique camera angles all reduce accuracy |\n| Server GPU (cloud path only) | Heavier server-side models need GPU hardware to run at frame rate | A recurring per-frame or per-minute cost you avoid entirely with on-device inference |\n\n### About those acceleration speedups\n\nVendors publish eye-catching multipliers — Apple's Core ML delegate has cited up to roughly 14x speedups for some models on devices with an A12 SoC or later (older iPhones are steered to the GPU delegate), and Google has cited \"up to 100x over CPU and 10x over GPU\" for an NPU delegate on a Snapdragon 8 Elite. Treat these as attributed vendor benchmarks on specific models and chips: they do **not** translate directly to your pose model, so verify on your own target hardware (as of 2026, verify).\n\n## How to decide — by use case\n\nThere is no single hardware spec; match it to the devices you need to reach:\n\n- **Maximum reach (support old and mid-range phones):** target the RGB camera plus the GPU delegate as your baseline, and ship a **lighter model** (or lower resolution / frame dropping) so under-powered devices stay real-time. Opt into NPU/Neural Engine where present for extra headroom rather than requiring it.\n- **Newer devices only, richer features:** lean on the NPU/Neural Engine to run a heavier, more accurate model at higher frame rates with better battery life.\n- **On-device (default for consumer fitness):** the phone does everything — private, offline-capable, zero per-frame server cost. See [real-time pose estimation](/motion/real-time-pose-estimation) for how to hit a smooth live frame budget.\n- **Cloud path:** only when you need a heavier or custom model that will not fit on-device, or identical results across a huge device range — and you can fund a **server GPU** plus the latency, bandwidth, and privacy burden of streaming video.\n\nIf you would rather not choose and maintain models and per-device tuning at all, a managed motion SDK bundles pose plus rep/form logic — see [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) for the buy option.\n\n## The honest limits\n\n- **A regular phone camera is sufficient; depth is optional.** No LiDAR or depth sensor is needed for 2D or monocular 3D. Requiring one only shrinks your addressable devices.\n- **Monocular 3D depth is estimated, not measured.** Single-camera depth is inferred and unreliable for occluded and extremity joints, and it degrades on out-of-plane movement. More reliable 3D needs multi-camera rigs or depth sensors.\n- **Older and low-end devices genuinely struggle.** Without an NPU and with a weaker GPU, frame rates drop; plan a lighter-model fallback rather than assuming every phone matches a flagship.\n- **Conditions matter as much as silicon.** Poor lighting, cluttered backgrounds, occlusion, and bad camera angles all reduce accuracy regardless of how fast your chip is.\n- **Form feedback is a coaching aid, not medical or physical-therapy advice.** Monocular angle error and occlusion mean it can be wrong; it cannot judge pain or injury. Recommend a professional for anything injury-related.\n- **Streaming raw video to a server is privacy-sensitive.** Keeping inference on-device (video never leaves the phone) is both the cheapest and the strongest-privacy posture.\n\n## Before you ship\n\nDo not gate on depth hardware — build for the RGB camera plus GPU delegate, and treat NPU/Neural Engine as a bonus. Then verify: re-check any speedup or frame-rate claim on your *own* target hardware (especially the oldest device you promise to support), confirm your lighter-model fallback stays real-time there, and validate accuracy on real users in real rooms rather than trusting a lab figure. When you are ready to wire it into a camera feed, see the [camera pose tracking guide](/guides/camera-pose-tracking) for implementation.",
    "faqs": [
      {
        "q": "Do I need a depth camera or LiDAR for pose estimation?",
        "a": "No. A normal RGB smartphone camera is enough for 2D pose and for monocular (single-camera) 3D pose - both run from a single RGB frame. Depth hardware is optional and only marginally improves 3D accuracy, and requiring it shrinks the range of devices you can support. Even Apple's 3D body-pose request works from RGB and does not require a LiDAR Scanner, using depth only if the device exposes it (verify current behavior in the docs). For 2D fitness use, skip depth hardware."
      },
      {
        "q": "Does pose estimation need a GPU or a special AI chip?",
        "a": "It runs faster and uses less battery with one, but it is not strictly required. Hardware acceleration - a mobile GPU, or an NPU/Neural Engine - speeds inference and cuts energy per frame versus CPU. Apple's Core ML auto-dispatches to the Neural Engine, then GPU, then CPU; Android uses the LiteRT GPU delegate (present on nearly every phone) or an NPU delegate on supported chips. On devices without acceleration you can still run pose estimation, just at lower frame rates - use a lighter model to compensate."
      },
      {
        "q": "Will pose estimation work on older or low-end phones?",
        "a": "Often yes, but expect lower frame rates. Older and budget devices lack an NPU and have weaker GPUs and CPUs, so heavier models can drop below a smooth live rate. The fix is to ship a lighter model, lower the input resolution, or drop frames rather than queue them so tracking stays current. If broad device reach matters, design for the RGB-camera-plus-GPU-delegate baseline and treat NPU acceleration as a bonus, not a requirement. Always verify on the oldest device you promise to support."
      },
      {
        "q": "What hardware do I need to run pose estimation in the cloud?",
        "a": "Server-side pose inference typically needs GPU hardware to run heavier models at frame rate, which is a recurring per-frame or per-minute cost that on-device inference avoids. Cloud makes sense when you need a heavier or custom model that will not fit on a phone, or identical results across a huge device range - and you can accept the added latency, bandwidth, and the privacy burden of streaming video. For most consumer fitness apps, on-device inference on the phone is cheaper and more private."
      },
      {
        "q": "Do lighting and camera position affect the hardware I need?",
        "a": "They affect accuracy more than they change the hardware, but they matter a lot. Accuracy degrades in low light, backlight, and harsh shadows, and with cluttered backgrounds, occlusion, or oblique camera angles - the exercised joints must be in frame and unoccluded. Lab accuracy assumes good lighting, a plain background, and one visible person, so real rooms perform worse. No amount of GPU power fixes a poorly lit or badly framed shot, so plan for good conditions and verify with real users."
      }
    ],
    "related": [
      {
        "href": "/motion/real-time-pose-estimation",
        "label": "Real-time pose estimation"
      },
      {
        "href": "/guides/camera-pose-tracking",
        "label": "Add camera pose tracking"
      },
      {
        "href": "/learn/what-is-pose-estimation",
        "label": "What is pose estimation?"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Device capabilities, delegates, and acceleration options shift fast across 2026 - subscribe for plain-English updates on what hardware camera-based fitness actually needs."
    }
  },
  {
    "slug": "how-rep-counting-works",
    "primaryQuery": "how does rep counting work",
    "h1": "How Rep Counting Works: The Algorithm Explained",
    "metaTitle": "How Rep Counting Works: The Algorithm and Hysteresis",
    "metaDescription": "How camera rep counting works: track a joint angle over time, then count cycles with a state machine plus hysteresis to avoid double-counting jitter.",
    "updated": "2026-07-24",
    "answer": "Rep counting reduces a pose to one signal over time — usually a joint angle like the elbow (shoulder-elbow-wrist) for a curl — and counts a rep each time that signal completes a full up-down cycle. Two approaches dominate: peak/valley detection on the angle trajectory, or a finite state machine that models up/down phases with thresholds. The key to not double-counting jitter is hysteresis: separate entry thresholds for the up and down phases so noise near one boundary cannot re-fire. A state machine with hysteresis, run on a smoothed signal, is the robust default; pure peak detection is simpler but needs smoothing and a minimum-amplitude gate.",
    "body": "This page explains the algorithm — the concept. To wire it into a real camera feed, see the [add rep counting guide](/guides/add-rep-counting) for implementation. New to the underlying tech? Start with [what pose estimation is](/learn/what-is-pose-estimation).\n\n## The signal: from keypoints to one number over time\n\nA pose model gives you a set of keypoints per frame — coordinates, each with a confidence or visibility score. Rep counting does not use all of them at once. Instead you reduce the pose to **one scalar that oscillates as the rep happens**:\n\n- **Joint angle.** Take three keypoints that define a joint and compute the angle between the two bones. A bicep curl is the elbow angle (shoulder-elbow-wrist); a squat is the knee or hip angle. The angle swings between a \"down\" extreme and an \"up\" extreme once per rep. This is the most common and most robust choice because an angle is invariant to where the person stands in frame and how far they are from the camera.\n- **Keypoint position.** For some movements a single coordinate works — the vertical position of the wrists in a jumping jack, or the hip height in a squat. Positions are simpler but sensitive to camera distance and framing, so they usually need normalization first.\n\nWhichever you pick, the result is a one-dimensional signal that rises and falls once per repetition. Everything after this is signal processing on that curve.\n\n## Two ways to count a cycle\n\nOnce you have the signal, you need to decide when a rep has happened. There are two established approaches.\n\n| Approach | How it works | Trade-off |\n| --- | --- | --- |\n| Peak/valley detection | Find local maxima and minima in the angle (or position) trajectory. A peak marks the midpoint of a rep; the valley that follows marks the start/end of the next cycle. Count one rep per completed peak-to-valley cycle. | Simple to implement, but sensitive to noise — messy form can produce multiple small peaks per rep, and jitter near an extreme can register phantom cycles. Needs smoothing plus a minimum-amplitude and minimum-time gate. |\n| Finite state machine | Model the exercise as phases (for example `down` and `up`). The angle crossing a threshold drives a state transition; completing the full phase cycle increments the counter. | More robust to jitter and partial motion because state only changes on a deliberate threshold crossing. Slightly more logic per exercise, but far fewer false counts. This is the usual default. |\n\nBoth operate on the same underlying angle curve. In practice many production counters are state machines because the phase model maps cleanly onto how a rep actually feels — you go down, you come up, that is one.\n\n## Walking through the state machine\n\nHere is the logic in prose for a bicep curl, tracking the elbow angle. A straight arm is a large angle (near 180 degrees); a fully curled arm is a small angle.\n\nStart in the `down` state (arm extended). When the elbow angle drops below a **low threshold** — say the arm has curled past a certain point — transition to the `up` state. Then wait: only when the angle climbs back above a **high threshold** (arm re-extended) do you transition back to `down` and **increment the rep count by one**. The rep is counted on the completed cycle, not on either single crossing.\n\nThe critical detail is that the two thresholds are **different values with a gap between them**. That gap is **hysteresis**. If you used a single threshold, an angle hovering right at that value — which is exactly what noisy keypoints do at the top or bottom of a rep — would flip the state back and forth and count several reps for one. By requiring the signal to travel from a low threshold all the way past a separate high threshold before it can count again, small jitters near either boundary are ignored. The same pattern generalizes to any exercise: pick the joint, pick the two thresholds, define the phase cycle.\n\n## Per-exercise logic\n\nRep logic is **exercise-specific**. The joint, the angle, and the thresholds all differ by movement:\n\n- **[Squat](/motion/squat-detection-pose-estimation)** — knee and/or hip angle; \"down\" is deep flexion, \"up\" is standing.\n- **[Push-up](/motion/push-up-counter-computer-vision)** — elbow angle, similar to a curl but body-oriented.\n- **[Bicep curl](/motion/bicep-curl-counter-pose-estimation)** — elbow angle, arm hanging as the reference.\n- **[Jumping jack](/motion/jumping-jack-counter-pose-estimation)** — often keypoint positions (wrist height, ankle spread) rather than a single joint angle.\n\nPer-exercise pages built from published studies also cover the [lunge](/motion/lunge-detection-pose-estimation), [plank](/motion/plank-detection-pose-estimation), [deadlift](/motion/deadlift-pose-estimation), [sit-up](/motion/sit-up-counter-pose-estimation), [pull-up](/motion/pull-up-counter-computer-vision) and [overhead press](/motion/overhead-press-pose-estimation).\n\nBecause each movement needs its own joints and thresholds, a practical counter is built as a **library of small, reusable per-exercise definitions** rather than one universal detector. Adding a new exercise means specifying which joints to watch and where the phase thresholds sit — real, ongoing engineering work, not a one-time build.\n\n## Handling noise and false reps\n\nRaw per-frame keypoints jitter, and that jitter is the enemy of an accurate count. Several layers help:\n\n- **Smooth the signal first.** Apply a temporal filter to the keypoints or the derived angle before you do any peak or threshold logic. A One Euro filter is a common low-cost choice; the point is that you should never run detection on raw, unsmoothed keypoints. See [pose estimation accuracy](/motion/pose-estimation-accuracy) for why jitter and smoothing matter.\n- **Use hysteresis, not a single threshold.** As above — separate up and down thresholds prevent double-counting when the signal lingers near a boundary.\n- **Gate on amplitude and time.** Require the signal to travel a minimum range (a real rep, not a twitch) and to take a minimum plausible time, so partial motions and jitter spikes do not count.\n- **Gate on confidence.** Pose models emit per-keypoint visibility or confidence. If the joints you depend on are occluded or low-confidence, down-weight or skip those frames rather than compute a garbage angle.\n\nA known failure mode is worth naming: depending on the exercise and the person's form, the angle signal can show **multiple peaks per repetition** or vary in peak shape and amplitude, which trips up naive peak detection. This is exactly why smoothing plus a state machine (or a gated peak detector) beats reading raw extremes.\n\n## Calibration and orientation\n\nTwo more real-world factors decide whether your thresholds actually fire correctly:\n\n- **Calibration to the user.** Range of motion varies by body, mobility, and how deep someone actually goes. Fixed thresholds that work for one person may never trigger for another. A common fix is to capture a **reference rep** at the start (or use adaptive thresholds that learn each user's range) so \"down\" and \"up\" are defined relative to that person rather than an absolute angle.\n- **Camera orientation and framing.** The joints you measure must be **in frame and roughly in the camera plane**. An angle that projects into depth (the limb moving toward or away from the camera) is the least reliable, because monocular single-camera depth is estimated, not measured. Keep the user side-on or front-on to the movement axis you are counting, with the whole relevant segment visible. Poor lighting, baggy clothing, occlusion, and oblique angles all degrade the keypoints and, downstream, the count.\n\n## The honest limits\n\n- **A normal RGB phone camera is enough.** No depth sensor or LiDAR is needed to count reps — you are tracking 2D angles that stay in the camera plane.\n- **Miscounts are real.** Partial reps, very fast reps, occluded joints, and bad camera angles all cause the signal to miss a threshold or fire a spurious one. Per-exercise threshold tuning is genuine engineering, not a solved default.\n- **Do not publish an accuracy percentage as fact.** Rep-counting accuracy is dataset-, exercise-, and form-dependent; any figure you cite should be attributed to its source and hedged, and re-verified on your own users and hardware (as of 2026, verify).\n- **Rep counting is not form judgment.** A counter tells you *that* a rep happened, not whether it was done safely. Form scoring is a separate feature — see [how form feedback works](/motion/how-form-feedback-works) — and neither is medical or physical-therapy advice.\n\n## Before you build\n\nReduce the pose to one signal (usually a joint angle), smooth it, then drive a per-exercise state machine with hysteresis and amplitude/time gates — that combination is the robust default. Calibrate thresholds to each user, keep the measured joints in frame and in the camera plane, and verify counting accuracy on your own exercises and devices rather than trusting a lab figure. When you are ready to implement it against a live camera feed, follow the [add rep counting guide](/guides/add-rep-counting).",
    "faqs": [
      {
        "q": "What signal does a rep counter actually track?",
        "a": "It reduces the pose to one number that oscillates once per rep. Most commonly that is a joint angle from three keypoints (elbow angle for a curl, knee or hip angle for a squat), because an angle is invariant to where the person stands or how far they are from the camera. Some movements use a keypoint position instead (wrist height, hip height), but positions need normalization first. Everything after that is signal processing on that one curve."
      },
      {
        "q": "What is hysteresis and why does it stop double-counting?",
        "a": "Hysteresis means using two different thresholds with a gap between them instead of one. To count a rep you must cross a low threshold into the down phase and then travel all the way past a separate high threshold into the up phase. With a single threshold, noisy keypoints hovering right at that value would flip the state back and forth and count several reps for one. The gap forces the signal to make a full, deliberate swing before it can count again."
      },
      {
        "q": "How do you handle noise and false reps?",
        "a": "Smooth the keypoints or the derived angle before any detection (a One Euro filter is a common low-cost choice), use hysteresis rather than a single threshold, and gate on minimum amplitude and minimum time so twitches and partial motions do not count. Also gate on the model's per-keypoint confidence or visibility and skip frames where the joints you depend on are occluded. Naive peak detection on a raw signal is the main source of miscounts."
      },
      {
        "q": "Do I need a depth camera to count reps?",
        "a": "No. A normal RGB phone camera is enough. Rep counting tracks 2D joint angles that stay in the camera plane, so no depth sensor or LiDAR is required. What matters more is orientation and framing: keep the measured joints in frame and roughly in the camera plane, since an angle projecting toward or away from the camera relies on estimated depth and is the least reliable."
      },
      {
        "q": "How accurate is camera-based rep counting?",
        "a": "It varies by exercise, dataset, and the user's form, so there is no single number to quote. Partial reps, very fast reps, occlusion, and oblique camera angles all cause miscounts, and thresholds often need per-user calibration. Treat any accuracy figure you see as attributed and hedged, and verify it on your own exercises and hardware rather than trusting a lab result. Rep counting also is not form judgment and is not medical advice."
      }
    ],
    "related": [
      {
        "href": "/guides/add-rep-counting",
        "label": "Add rep counting"
      },
      {
        "href": "/motion/pose-estimation-accuracy",
        "label": "Pose estimation accuracy"
      },
      {
        "href": "/learn/what-is-pose-estimation",
        "label": "What is pose estimation?"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Building a rep counter and want the threshold-tuning and calibration gotchas flagged early? Get our developer notes on AI motion tracking."
    }
  },
  {
    "slug": "how-form-feedback-works",
    "primaryQuery": "how does form feedback work",
    "h1": "How Camera-Based Form Feedback Works",
    "metaTitle": "How Camera Form Feedback Works (and Its Limits)",
    "metaDescription": "How camera form feedback works: joint angles, range of motion, tolerance bands, and cues. Plus the honest limits. A coaching aid, not medical advice.",
    "updated": "2026-07-24",
    "answer": "Camera-based form feedback computes the angle at a joint from three tracked keypoints, watches that angle across a rep to capture range of motion, and compares it against a reference or target. When the user drifts outside a tolerance band, the app cues which way to correct. It runs from an ordinary phone camera with no depth sensor, but the pose underneath is a monocular estimate, so it is a coaching aid, not medical or physical-therapy advice.",
    "body": "If you are new to the underlying tech, start with [what is pose estimation](/learn/what-is-pose-estimation); when you are ready to build it, the [add form feedback guide](/guides/add-form-feedback) covers implementation.\n\n## From keypoints to a judgment about form\n\nForm feedback sits on top of a pose model that outputs keypoints — coordinates for the shoulders, elbows, hips, knees, and so on — plus a confidence or visibility score per point. The feedback layer is the interpretation you build on those coordinates. It runs in four conceptual stages.\n\n| Stage | What happens | Why it matters |\n|---|---|---|\n| Joint angle | Take three keypoints that meet at a joint (for a squat, hip-knee-ankle) and compute the angle between the two limb segments | The angle is the measurable proxy for the position of a body part |\n| Range of motion | Track that angle across the whole rep, from the top of the movement to the bottom and back | Depth of a squat or lockout of a press shows up as the min and max of the angle |\n| Compare to a reference | Measure the deviation between the user's angle (or overall pose) and an ideal angle, an instructor's pose, or a template | Deviation is what you actually flag; a raw angle on its own means nothing |\n| Cue | If the deviation exceeds a tolerance, tell the user which direction to move and by roughly how much | This is the coaching — direction plus magnitude, not just \"wrong\" |\n\nA joint angle is just trigonometry on three points, so it costs almost nothing to compute per frame. Range of motion falls out of watching that angle over time — the same signal a rep counter keys on, which is why form scoring and [rep counting](/motion/how-rep-counting-works) usually share a pipeline.\n\nThe comparison step is where design choices live. You define a target — a single ideal angle, a range, or a full reference pose — and measure how far the user is from it. Research systems raise a correction when the distance between the current and reference pose exceeds a predefined threshold; some use a tight tolerance of only a few degrees for alignment-critical work, though that is one paper's design choice, not a universal spec. The important principle is the **tolerance band**: a window around the target inside which the movement is treated as acceptable. Too tight and you nag the user on normal variation; too loose and you miss real faults.\n\nCrucially, tolerances should be customizable rather than one-size-fits-all. A user's age, mobility, or a limited range of motion changes what \"good\" looks like for them, so a fixed reference angle borrowed from an athletic template can be both wrong and discouraging. Per-user or per-population tolerances are the honest way to handle this.\n\nCues then translate a deviation into instruction. Good cues carry two things: **direction** (which way to move the joint) and **magnitude** (how far off it is). Visual systems encode this directly — an arrow pointing toward the corrected keypoint for direction, line thickness or color for magnitude — while audio or text cues say the same thing in words.\n\n## Where camera form feedback works well — and where it does not\n\nThe single biggest lever on quality is choosing *what* to measure and *from which angle*, not which pose model you pick. Camera-based feedback is strong when the angle you care about lives in the camera plane and the joints are visible; it degrades fast when the movement runs toward or away from the lens or hides joints behind the body.\n\nIt works well for:\n\n- **In-plane angles filmed from the matching side.** An elbow angle for a curl shot side-on, or a knee angle for a squat shot from the side, are essentially flat geometry the camera can read cleanly.\n- **A small set of well-conditioned joints.** Fewer, clearer angles beat a dense full-body score built partly on joints the camera can barely see.\n- **Gross-movement coaching.** \"Go deeper,\" \"straighten up,\" \"slow down\" — directional nudges where being roughly right is genuinely useful.\n\nIt works poorly for:\n\n- **Out-of-plane motion.** Any angle that rotates toward or away from the camera projects into the depth axis, which is exactly where a single camera is least reliable.\n- **Occluded joints.** A limb hidden behind the torso or another body part has no trustworthy position, so any angle built on it is a guess.\n- **Precise, degree-level or clinical claims.** A single RGB camera cannot honestly promise millimeter or medical-grade accuracy.\n\nA practical rule: pick the camera orientation that keeps the measured angle *out* of the depth axis, measure a few unobstructed joints, apply per-user tolerances, and give simple directional cues. For the metrics behind why some setups track cleanly and others jitter, see [pose estimation accuracy](/motion/pose-estimation-accuracy). For the camera placements and failure modes the studies report exercise by exercise, see the pages on the [squat](/motion/squat-detection-pose-estimation), [push-up](/motion/push-up-counter-computer-vision), [lunge](/motion/lunge-detection-pose-estimation), [plank](/motion/plank-detection-pose-estimation), [deadlift](/motion/deadlift-pose-estimation), [bicep curl](/motion/bicep-curl-counter-pose-estimation), [jumping jack](/motion/jumping-jack-counter-pose-estimation), [sit-up](/motion/sit-up-counter-pose-estimation), [pull-up](/motion/pull-up-counter-computer-vision) and [overhead press](/motion/overhead-press-pose-estimation).\n\n## The honest limits\n\nForm feedback inherits every limitation of the monocular pose estimate underneath it, and a few of its own. Be upfront about these on any page or in any product that gives form cues.\n\n- **2D angle error.** Monocular human pose estimation is, in the words of clinical reviewers, not accurate enough for clinically relevant measurements in its current state. It is fine for general feedback and useless as a diagnostic figure. Do not surface a computed angle as if it were a validated clinical number.\n- **Depth is the weak point.** The biggest limitation of a single-camera estimator is depth. Angles that project toward or away from the camera are the least reliable, which is why the fix is almost always to re-orient the camera rather than trust the depth axis.\n- **Occlusion.** Partially hidden joints produce bad angles. The best mitigation is not to measure occluded joints at all, and to gate your logic on the model's per-joint visibility score so low-confidence points do not drive a cue.\n- **The lab-to-living-room gap.** Published accuracy assumes good lighting, a plain background, tight clothing, and one clearly visible person. Real users have dim rooms, cluttered frames, baggy hoodies, and pets walking through — all of which degrade the estimate.\n- **It is a coaching aid, not medical or physical-therapy advice.** This is the one to weave in wherever form feedback touches rehab or injury. A phone cannot judge pain, injury history, or an individual's biomechanics, and monocular error, occlusion, and depth ambiguity mean it can simply be wrong. Never frame camera feedback as diagnosis, injury prevention, or a substitute for a clinician or physical therapist. For anyone recovering from an injury or in pain, the responsible cue is to see a professional — not to trust an angle from a webcam.\n\nIf you also move inference off the device, note that streaming raw workout video to a server is privacy-sensitive; the stronger posture is running pose estimation on the phone and sending only landmark coordinates if you need anything server-side.\n\n## Before you ship\n\nMeasure a few well-conditioned angles, keep them in the camera plane, set per-user tolerance bands, and phrase cues as direction plus magnitude. Treat every accuracy or tolerance figure as something to verify on your own cameras, lighting, clothing, and exercises — as of 2026, lab numbers rarely survive contact with real users, so validate end-to-end rather than trusting a published value. And keep the framing honest: this is coaching, not care. When you are ready to implement, the [add form feedback guide](/guides/add-form-feedback) walks through it, and [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) cover the buy option if you would rather not build the interpretation layer yourself.",
    "faqs": [
      {
        "q": "How does a form checker actually measure my form?",
        "a": "It takes three keypoints that meet at a joint (for a squat, hip, knee, and ankle), computes the angle between the two limb segments, and tracks that angle across the rep to capture range of motion. It then compares your angle to a reference or target and flags the deviation if it exceeds a tolerance band, cueing which direction to move."
      },
      {
        "q": "Do I need a depth camera or special sensor for form feedback?",
        "a": "No. A normal RGB phone camera is enough to track keypoints and compute joint angles. No LiDAR or depth sensor is required. The catch is that a single camera estimates depth rather than measuring it, so angles that rotate toward or away from the lens are the least reliable part of the signal."
      },
      {
        "q": "Can I use camera form feedback for injury rehab or physical therapy?",
        "a": "Treat it only as general coaching, never as medical or physical-therapy advice. Monocular pose estimation is not accurate enough for clinically relevant measurement, and it cannot judge pain, injury history, or individual biomechanics. For anyone in pain or recovering from an injury, the responsible step is to consult a clinician or physical therapist rather than trust an angle from a camera."
      },
      {
        "q": "Why does form feedback get worse from some camera angles?",
        "a": "Any joint angle that projects toward or away from the camera falls into the depth axis, which is exactly where a single-camera estimate is weakest. Occluded joints hidden behind the body also produce bad angles. The fix is usually to re-orient the camera so the measured angle stays in the camera plane and the joints stay visible, rather than trusting depth."
      },
      {
        "q": "How accurate is camera-based form feedback?",
        "a": "Good enough for gross-movement coaching, not for degree-level or clinical claims. Accuracy depends on lighting, clothing, camera angle, occlusion, and the exercise, and published lab numbers assume ideal conditions real users rarely match. As of 2026, verify any accuracy or tolerance figure on your own cameras and users rather than trusting a headline value."
      }
    ],
    "related": [
      {
        "href": "/guides/add-form-feedback",
        "label": "Add form feedback"
      },
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/motion/pose-estimation-accuracy",
        "label": "Pose estimation accuracy"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Building camera-based coaching and want to keep it on the honest side of the medical line? Get our newsletter on pose estimation, form scoring, and AI motion tracking."
    }
  },
  {
    "slug": "build-vs-buy-ai-motion-tracking",
    "primaryQuery": "build vs buy motion tracking",
    "h1": "Build vs Buy: AI Motion Tracking",
    "metaTitle": "Build vs Buy AI Motion Tracking: How to Decide",
    "metaDescription": "Build your own pose pipeline or buy a motion-tracking SDK? An honest, independent trade-off by team size, timeline, and how much control you need.",
    "updated": "2026-07-24",
    "answer": "Building your own AI motion pipeline means picking a pose model, integrating it natively per platform, and writing all the rep-counting, form-scoring, and exercise-library logic yourself, since keypoints are only coordinates. Buying a motion-tracking SDK bundles pose plus pre-built fitness logic, vendor-maintained, so you ship faster at a recurring per-user cost and with less control. Build when camera-based tracking is your core differentiator and you have CV/ML staff; buy when time-to-market and cross-platform maintenance matter more. Most teams go hybrid: adopt an on-device pose model, build the coaching layer on top.",
    "body": "This page is the AI-motion-specific companion to the general [fitness API vs build-your-own](/fitness-apis/fitness-api-vs-build-your-own) decision; here the focus is the pose/motion pipeline itself.\n\n## What \"build\" actually involves\n\nThe trap is thinking the hard part is choosing a model. Picking `MediaPipe`/`BlazePose`, `MoveNet`, or Apple's `Vision` framework is the easy first step. The real, ongoing engineering is everything after the keypoints arrive:\n\n- **Pick a model and accept its trade-offs.** Speed-vs-accuracy, single- vs multi-person, and licensing all become your problem. Two popular models carry commercial strings: Ultralytics `YOLO`-pose is AGPL-3.0 (strong copyleft) and `OpenPose` is non-commercial — verify licenses before shipping. See [pose estimation models compared](/motion/pose-estimation-models-compared) for the full breakdown.\n- **Integrate per platform, natively.** iOS and Android have different runtimes and accelerators — `Core ML`/`Vision` with the Neural Engine on iOS, `LiteRT` with GPU/NPU delegates on Android. You build, tune, and test each side separately, plus any web target.\n- **Build the interpretation layer yourself.** Pose output is just coordinates. A widely cited gap: many frameworks capture keypoints, but there is no framework that analyzes that data and tells the user how to improve. Rep logic (joint-angle state machines with hysteresis), form scoring (angles vs per-user tolerances), and cues are all on you. See [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works).\n- **Tune accuracy and maintain an exercise library.** Each exercise needs its own joints, thresholds, smoothing, and calibration — and the catalog only grows. This is per-exercise engineering, not a one-time setup.\n- **Maintain it forever.** Models get renamed and deprecated (TensorFlow Lite became `LiteRT`; `PoseNet` is legacy), operating systems and devices change, and new phones need re-testing. Camera-based tracking is a moving target, not a ship-once feature.\n\nNone of this is exotic, but it is real, sustained work that needs someone comfortable with computer vision on staff.\n\n## What \"buy\" actually gets you\n\nA motion-tracking SDK or API bundles the pose model with pre-built fitness logic and maintains it for you, so your team focuses on the app instead of the pipeline:\n\n- **Faster time-to-market.** Pose detection, rep counting, and form logic arrive working, rather than as coordinates you have to interpret.\n- **A ready exercise library.** Vendors typically ship a catalog of exercises (and sometimes yoga, range-of-motion, or joint-angle tracking) so you are not building and tuning each movement from scratch.\n- **Maintained across platforms.** Model upkeep, OS changes, and device support are the vendor's job, which is where a lot of the hidden build cost lives.\n\nThe costs are equally real: a recurring per-user or per-device fee, less control over the underlying model, and you inherit the vendor's accuracy limits and roadmap. Pricing (free tiers and paid plans both exist) changes often — treat any quoted figure as \"verify current pricing per vendor.\" See [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) for what this option looks like in practice.\n\n## Build vs buy at a glance\n\n| Dimension | Build (your own pipeline) | Buy (motion SDK / API) |\n| --- | --- | --- |\n| Time to first working feature | Slow — model integration plus interpretation layer | Fast — pose and fitness logic ship together |\n| Per-platform native work | You build and tune iOS, Android, web separately | Vendor maintains platform SDKs |\n| Rep / form logic | You write and tune it (state machines, tolerances) | Included, pre-built |\n| Exercise library | You build and grow it per exercise | Bundled catalog (verify coverage) |\n| Accuracy tuning | Fully yours to optimize | Bounded by the vendor's model |\n| Control over the model | Full — swap, fine-tune, customize | Limited — vendor's model and roadmap |\n| Cost shape | Engineering time; no license fee (mind AGPL/non-commercial models) | Recurring per-user/device fee (verify pricing) |\n| Ongoing maintenance | You own model deprecations, OS and device changes | Vendor's responsibility |\n| Best when | Motion tracking is your differentiator | Motion tracking is a feature, not the product |\n\n## How to decide — by team, timeline, and differentiation\n\nThere is no universal winner. Weigh it against three things:\n\n- **Build** when camera-based motion is your core differentiator, you have CV/ML engineers, you need offline and zero per-user license cost at scale, or you require a custom exercise set no vendor covers — and you can fund ongoing accuracy tuning and per-platform maintenance.\n- **Buy** when time-to-market, cross-platform maintenance, and a ready exercise library matter more than full control, and a recurring per-user cost is acceptable. This fits most teams shipping a fitness app where tracking is one feature among many.\n- **Hybrid (the common middle)** — adopt an on-device pose model (an SDK, or `MediaPipe`/`MoveNet`) for the detection layer, and build your own rep/form/coaching logic on top where you want differentiation. You get maintained pose detection without giving up control of the experience that makes your app distinct.\n\nA rough rule: a small team on a tight timeline, or one where motion tracking is a supporting feature, is usually better served buying. A team with CV/ML depth building tracking *as* the product is the one where building pays off.\n\n## The honest limits either way\n\nThe model choice does not remove the physics of monocular vision, whether you build or buy:\n\n- **A normal RGB phone camera is enough.** No depth sensor or LiDAR is required for 2D or monocular 3D pose — neither path needs special hardware.\n- **Monocular 3D depth is estimated, not measured.** Single-camera depth is inferred and unreliable for occluded or extremity joints; treat it as a lower-confidence axis regardless of vendor.\n- **Form feedback is a coaching aid, not medical or physical-therapy advice.** Angle error, occlusion, and depth ambiguity mean it can be wrong; it cannot judge pain or injury. Recommend a professional for anything injury-related.\n- **Streaming raw video to a server is privacy-sensitive.** Keeping inference on-device (video never leaves the phone) is the strongest privacy posture, and applies to both build and buy — check where a vendor runs its inference.\n- **Benchmarks are condition-dependent.** Any accuracy or fps claim, from your own model or a vendor's marketing, assumes specific hardware and framing. Verify on your target devices, not a datasheet.\n\n## Before you commit\n\nMap the decision to your team and timeline, not to a feature checklist: if motion tracking is the product, budget for the build; if it is a feature, buying or a hybrid usually wins. Either way, verify the specifics — model licenses (especially AGPL and non-commercial), any vendor pricing, and real accuracy on your own cameras and users rather than a lab number. When you are ready to implement, the [how-to guides](/guides) walk through wiring pose tracking, rep counting, and form feedback into a camera feed. Motion tracking covers two of the six layers in [the AI fitness app build map](/ai-fitness-app), which gives every layer its own build-versus-buy position.",
    "faqs": [
      {
        "q": "Isn't the hard part just picking a pose model?",
        "a": "No. Choosing MediaPipe, MoveNet, or Apple Vision is the easy first step. The real, ongoing work is everything after the keypoints arrive: native per-platform integration, rep-counting and form-scoring logic, an exercise library, accuracy tuning, and maintenance as models and devices change. Keypoints are just coordinates; the interpretation layer is yours to build."
      },
      {
        "q": "When does building your own pipeline make sense?",
        "a": "Build when camera-based motion tracking is your core differentiator, you have computer-vision/ML engineers, you need offline use and zero per-user license cost at scale, or you require a custom exercise set no vendor covers, and you can fund ongoing accuracy tuning and per-platform maintenance. If tracking is a supporting feature rather than the product, buying usually wins."
      },
      {
        "q": "What does buying a motion-tracking SDK cost?",
        "a": "A recurring per-user or per-device fee, plus less control over the underlying model and its roadmap. Free tiers and paid plans both exist, but pricing changes often, so verify current figures with each vendor rather than treating any quoted price as permanent. In exchange you skip model upkeep and get a maintained, cross-platform pipeline."
      },
      {
        "q": "Can I mix building and buying?",
        "a": "Yes, and most teams do. The common hybrid is to adopt an on-device pose model or SDK for detection, then build your own rep, form, and coaching logic on top where you want to stand out. You get maintained pose detection without giving up control of the experience that differentiates your app."
      },
      {
        "q": "Do I need a depth camera either way?",
        "a": "No. A normal RGB phone camera is enough for both 2D and monocular 3D pose, whether you build or buy. Monocular 3D depth is estimated rather than measured, so it is less reliable for occluded or extremity joints. Form feedback from a single camera is a coaching aid, not medical or physical-therapy advice."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/fitness-api-vs-build-your-own",
        "label": "Fitness API vs build your own"
      },
      {
        "href": "/fitness-apis/ai-workout-tracking-apis",
        "label": "Best AI workout tracking APIs"
      },
      {
        "href": "/guides",
        "label": "AI workout tracking guides"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Weighing build vs buy for camera-based tracking? Get our developer notes on pose pipelines, accuracy, and shipping AI fitness features."
    }
  },
  {
    "slug": "mediapipe-pose-landmarker-models",
    "primaryQuery": "pose landmarker lite vs full vs heavy",
    "h1": "MediaPipe Pose Landmarker Models: Lite vs Full vs Heavy",
    "metaTitle": "MediaPipe Pose Landmarker: Lite vs Full vs Heavy",
    "metaDescription": "Pose Landmarker lite vs full vs heavy: model-card size, speed, and accuracy, what the float16/latest .task URL means, and which variant to pick.",
    "updated": "2026-10-18",
    "answer": "MediaPipe Pose Landmarker ships as three .task bundles - lite, full, and heavy - that share the same 33-landmark output and API, so the variant is a swappable config value, not an architecture decision. What differs is the size-speed-accuracy trade: Google's model card positions lite as the only variant near real-time on a modest CPU, heavy as the most accurate at a fraction of the frame rate, with full in between. Start with full for form feedback and lite for live rep counting, then verify on your own hardware - the published numbers come from a 2021 model card measured on a Pixel 3.",
    "body": "If you have already decided on MediaPipe over the alternatives — that decision lives at [MediaPipe vs MoveNet](/motion/pose-estimation-models-compared#mediapipe-vs-movenet-head-to-head), and the wider field at [pose estimation models compared](/motion/pose-estimation-models-compared) — one choice remains: which of the three model files to load. `pose_landmarker_lite`, `pose_landmarker_full`, and `pose_landmarker_heavy` share one output format and one API surface, so this is a swappable, low-regret decision. What differs is the size-speed-accuracy trade, and that is the whole of this page.\n\n## Where the `.task` files come from, and what the URL means\n\nThe three variants are distributed as `.task` bundles from Google's public `mediapipe-models` storage bucket. These are the official download URLs — they appear verbatim in Google's own sample code (the `download_models.sh` script in the `google-ai-edge/mediapipe-samples` repository):\n\n```text\nhttps://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task\nhttps://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task\nhttps://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task\n```\n\nReading the path as a pattern — `pose_landmarker/<variant>/<precision>/<version>/<variant>.task` — three segments matter:\n\n- **The variant segment** (`pose_landmarker_lite` / `_full` / `_heavy`) picks the model. It appears twice: as a directory and as the filename.\n- **`float16`** names the numeric precision of the bundled weights — half-precision. It is the build Google's own sample scripts download; we have not verified whether other precision builds are published, so check the current MediaPipe docs before assuming one exists.\n- **`/latest/`** occupies the version slot. It is a pointer, not a frozen artifact. When we checked all three URLs on October 18, 2026, they returned HTTP 200 and the served files carried Last-Modified dates of April 27 and 28, 2023 — so `latest` has been stable for years, but nothing guarantees it stays that way. Google's own Android sample already does the safer thing: its `download_tasks.gradle` fetches the same three files from a `/1/` path in the version slot instead of `/latest/`, and on the day we checked, each `/1/` file had exactly the same byte size as its `latest` counterpart. In our judgement you should download once, pin the file, and serve it from your own storage rather than hotlinking `latest` from a production app: a silent model swap under a fixed URL is exactly the kind of change that shifts landmark behavior without a code change on your side.\n\nOne naming note that trips people up: the `.task` format belongs to the current MediaPipe *Tasks* API. The older \"MediaPipe Pose\" solution was superseded on May 10, 2023, per MediaPipe's own docs — which is why pre-2023 tutorials never mention `.task` files. If a guide you are following loads models a different way, it is teaching the legacy API.\n\n### Bundle size is not model size\n\nGoogle's model card lists the models at 3 MB (lite), 6 MB (full), and 26 MB (heavy). The `.task` files you actually download are larger — 5,777,746, 9,398,198 and 30,664,242 bytes, roughly 5.5, 9.0, and 29.2 MiB, as served on October 18, 2026. The pipeline MediaPipe describes is a two-step detector-plus-landmarker design, so the bundle packages more than the landmark model alone; we have not verified the exact bundle contents. For download-size budgeting, use the served `.task` figures, not the card's numbers.\n\n## What actually differs: lite vs full vs heavy\n\nThe authoritative positioning is Google's own BlazePose GHUM 3D model card (dated April 16, 2021), which frames the family as \"Optimized for on-device, real-time fitness applications\" and publishes per-variant speeds on a Pixel 3: lite at roughly 44 FPS on CPU (XNNPack) and 49 FPS on GPU, full at roughly 18 and 40 FPS, heavy at roughly 4 and 19 FPS. The same card reports accuracy as PDJ (equivalent to PCK@0.2) averaged across its geographical evaluation sets: 87.0% for lite, 91.8% for full, 94.2% for heavy.\n\n| Variant | Model size (model card) | `.task` bundle as served (2026-10-18) | Pixel 3 speed, CPU / GPU (model card, 2021) | Accuracy, PDJ (model card) |\n| --- | --- | --- | --- | --- |\n| `pose_landmarker_lite` | 3 MB | ~5.5 MiB | ~44 / ~49 FPS | 87.0% |\n| `pose_landmarker_full` | 6 MB | ~9.0 MiB | ~18 / ~40 FPS | 91.8% |\n| `pose_landmarker_heavy` | 26 MB | ~29.2 MiB | ~4 / ~19 FPS | 94.2% |\n\nMediaPipe's legacy docs add a fitness-specific quality table (17 COCO keypoints, single person 2–4 m from the camera): on yoga footage, PCK@0.2 of 96.4 for heavy, 95.5 for full, 90.2 for lite; on HIIT, 97.5 / 95.7 / 93.5. Their latency table for Pixel 3 with TFLite GPU puts lite at 20 ms, full at 25 ms, heavy at 53 ms.\n\nTwo things to take from those numbers, and one thing not to. Take the *ordering* — heavy is consistently more accurate, lite is consistently faster, and the gap between full and heavy in accuracy is smaller than the gap in cost. Take the *shape* of the trade — lite-to-full buys a meaningful accuracy jump at a tolerable speed cost, while full-to-heavy buys a smaller jump at a steep one. Do **not** take the absolute figures as predictions for your app: they were measured on a 2021-era Pixel 3 under Google's own conditions. Run your candidate variants through your own harness — see [test pose detection accuracy](/test/pose-detection-accuracy) — on your lowest-end target device before committing.\n\n## What every variant shares\n\nThe variant changes none of the following, which is why swapping is cheap:\n\n- **33 landmarks** — the 17 COCO keypoints plus additional face, hand, and foot points (eye inner/center/outer, ears, mouth corners, knuckles, heels, foot index). Every variant outputs the same topology.\n- **Per-landmark values** of x, y, z plus visibility and presence scores. The model card is explicit that z \"is not metric but up to scale\" — treat depth as an estimated, lower-confidence axis.\n- **Two coordinate spaces**: normalized image-space landmarks, and world landmarks in meters with the origin at the midpoint between the hips.\n- **An optional segmentation mask** with per-pixel values from 0.0 to 1.0.\n- **Single-person by documentation, with one setting to know about.** The model card states it \"Tracks only one person on scene if multiple present\", and lists multiple people, subjects further than about 14 feet / 4 meters, and a hidden head as out of scope. The current Tasks API does have a `num_poses` option, which MediaPipe's source documents as \"The maximum number of poses can be detected by the PoseLandmarker\" and which defaults to 1 (`num_poses: int = 1` in the Python options). The model card has not been updated to evaluate several people, so treat a raised value as something to test on your own footage, not as a supported multi-person mode. If multi-person is a hard requirement, start from [multi-person pose tracking](/motion/multi-person-pose-tracking) or [MediaPipe alternatives](/alternatives/mediapipe-alternatives) instead of this family.\n- **Apache-2.0 licensing**, for both the MediaPipe framework and the BlazePose GHUM models per the model card — no copyleft or non-commercial strings on any variant.\n\nBecause the output contract is identical, the variant is effectively a configuration value: the same landmark indices, the same downstream angle math, the same smoothing. What changes when you swap is timing — a slower model shifts your frame budget, so re-test frame dropping and filter tuning after a swap even though the code compiles unchanged.\n\n## Which variant for which job\n\nOur recommendation pattern, hedged the way it deserves:\n\n- **Live rep counting** — start with `lite`. Rep detection rides on landmark *trajectories*, which survive moderate accuracy loss, and the model card's own positioning puts lite as the only variant near real-time on a modest CPU. Move up to `full` only if your accuracy testing shows lite missing the joints your counter depends on.\n- **Form feedback and joint angles** — start with `full`. Angle work punishes landmark error harder than rep counting does, and full's accuracy sits much closer to heavy than to lite in both the model card and the fitness quality table. Reserve `heavy` for cases that tolerate its cost: post-session analysis of recorded video, or devices you have verified can carry it live.\n- **Multi-person scenes** — none of the three as documented. The model card covers one person, and `num_poses` applies to every variant equally, so heavy is not a multi-person build. See [multi-person pose tracking](/motion/multi-person-pose-tracking) for the models designed for groups.\n- **Unsure** — ship `full` behind a config flag and A/B lite on your low-end device tier. The swap costs you a file, not a rewrite.\n\nAll of this is positioning, not measurement. The only speed and accuracy numbers that matter are the ones from your camera, your exercises, and your worst supported phone.\n\n## Before you ship\n\nPin the model file instead of hotlinking `/latest/`, budget downloads against the served bundle sizes rather than the card's model sizes, and verify your chosen variant on real hardware. When you are ready to wire the model into a live camera feed, the [camera pose tracking guide](/guides/camera-pose-tracking) covers the pipeline, and [AI workout tracking on the web](/guides/ai-workout-tracking-web) walks through the browser path specifically — this page's job was only the choice.",
    "faqs": [
      {
        "q": "Can I swap Pose Landmarker variants without changing code?",
        "a": "Mostly yes, and that is the point of the family. All three variants emit the same 33 landmarks with the same per-landmark values (x, y, z, visibility, presence), the same normalized and world coordinate spaces, and the same optional segmentation mask, so your indices, angle math, and rep logic carry over unchanged - you swap the .task file path and keep the code. What does change is timing: a slower variant shifts your frame budget, so re-test frame dropping, smoothing, and any latency-sensitive thresholds after a swap even though nothing else breaks."
      },
      {
        "q": "What does the /latest/ segment in the Pose Landmarker model URL mean?",
        "a": "It is the version slot in the download path on Google's mediapipe-models storage bucket - a pointer to the newest published build rather than a frozen artifact. When we checked all three URLs in October 2026 they returned HTTP 200 and the served files were last modified on April 27 and 28, 2023, so latest has been stable for years, but nothing guarantees it stays that way. Google's own Android sample downloads the same files from a version-1 path instead. For a production app, download the file once, pin it, and serve it from your own storage instead of hotlinking latest, so a silent model update cannot change landmark behavior under you."
      },
      {
        "q": "Why is the pose_landmarker .task file bigger than the model size in the model card?",
        "a": "The model card's figures - 3 MB lite, 6 MB full, 26 MB heavy - describe the landmark models alone, while the .task downloads are bundles that served at roughly 5.5, 9.0, and 29.2 MiB when we checked. MediaPipe describes the pipeline as a two-step detector-plus-landmarker design, so the bundle packages more than the landmark model by itself, though the exact bundle contents are not documented in the sources we verified. Budget your app's download size against the served .task figures, not the card's model sizes."
      },
      {
        "q": "What does float16 mean in the Pose Landmarker download path?",
        "a": "It is the precision segment of the path - it names the numeric precision of the bundled model weights, in this case half-precision floating point. The float16 build is what Google's own sample download scripts fetch for all three variants. We have not verified whether builds at other precisions are published for Pose Landmarker, so if you need a different one, check the current MediaPipe documentation rather than guessing at a URL."
      },
      {
        "q": "Does pose_landmarker_heavy add extra landmarks or multi-person tracking?",
        "a": "No. Heavy outputs the same 33 landmarks as lite and full, and the model card states the model tracks only one person on scene if multiple are present, with multiple people explicitly out of scope. The Tasks API's num_poses setting, which defaults to 1, applies to all three variants alike. What heavy buys is accuracy - the model card reports 94.2 percent PDJ versus 91.8 for full and 87.0 for lite - at a steep speed cost, around 4 FPS on a Pixel 3 CPU in the card's 2021 measurements. If you need multi-person tracking, this family is the wrong starting point regardless of variant."
      }
    ],
    "related": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "MediaPipe vs MoveNet, head to head"
      },
      {
        "href": "/alternatives/mediapipe-alternatives",
        "label": "MediaPipe alternatives"
      },
      {
        "href": "/guides/ai-workout-tracking-web",
        "label": "AI workout tracking on the web"
      },
      {
        "href": "/pose-keypoints/blazepose-33",
        "label": "All 33 Pose Landmarker indices"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Model files behind /latest/ URLs can change without notice - subscribe and we will flag it when Google ships new Pose Landmarker builds or the download paths move."
    },
    "sources": [
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-17",
        "note": "model sizes, Pixel 3 speeds, PDJ accuracy, keypoint list, single person, out-of-scope uses, Apache-2.0, dated April 16, 2021"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/pose.md",
        "checked": "2026-10-17",
        "note": "May 10, 2023 upgrade notice, two-step pipeline, yoga and HIIT quality table, latency table, world landmarks, segmentation mask"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py",
        "checked": "2026-10-17",
        "note": "num_poses option and its default of 1, presence confidence, segmentation masks option"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/components/containers/landmark.py",
        "checked": "2026-10-18",
        "note": "visibility and presence per landmark"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe-samples/tree/main/examples/pose_landmarker",
        "checked": "2026-10-17",
        "note": "iOS download script with the three latest URLs; Android sample pinned to version 1"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
        "checked": "2026-10-18",
        "note": "HTTP 200, Last-Modified and size for all three variants, latest and version 1 paths"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE",
        "checked": "2026-10-17",
        "note": "Apache-2.0 framework licence"
      }
    ]
  },
  {
    "slug": "apple-vision-body-pose",
    "primaryQuery": "apple vision framework body pose",
    "h1": "VNDetectHumanBodyPoseRequest: Apple Vision Body Pose on iOS",
    "metaTitle": "VNDetectHumanBodyPoseRequest: Apple Vision Body Pose",
    "metaDescription": "VNDetectHumanBodyPoseRequest (2D, 19 joints) and the 3D request (17 joints): when Apple's native path beats bundling MediaPipe or MoveNet.",
    "updated": "2026-08-02",
    "answer": "Apple's Vision framework gives you two body pose requests with no model file to ship: VNDetectHumanBodyPoseRequest (2D, 19 named joints, iOS 14+) and VNDetectHumanBodyPose3DRequest (3D, 17 named joints with camera-relative positions and a metric body-height estimate, iOS 17+). Choose Vision for an iOS-only app that wants zero model bytes, OS-maintained inference, and built-in offline video via VNVideoProcessor; choose a bundled model like MediaPipe or MoveNet when an Android sibling app exists or you need to pin a model version for regression testing. The catch to weigh honestly: Apple publishes no model card and no accuracy numbers, so any accuracy claim about Vision is unverifiable — measure it on your own footage, not from a spec sheet.",
    "body": "Nobody benchmarks the iOS-native option, and there is a structural reason why: Apple gives you nothing to benchmark against. Vision's body pose requests ship with no model card, no accuracy figures, no distance guidance, and no fitness positioning — just an API reference. That makes them easy to skip in a model comparison and easy to underrate in an actual product decision, because the things Vision is good at (zero model bytes in your app, OS-level maintenance, built-in offline video processing) are exactly the things a benchmark table never shows. This page covers what Apple actually documents, and when the native path beats bundling a model.\n\n## What Apple actually documents\n\nVision offers two separate body pose requests, and they are not the same skeleton.\n\n### The 2D request: `VNDetectHumanBodyPoseRequest`\n\nApple documents `VNDetectHumanBodyPoseRequest` as \"a request that detects a human body pose,\" returning results as `VNHumanBodyPoseObservation`. Availability is iOS 14.0+, iPadOS 14.0+, macOS 11.0+, Mac Catalyst 14.0+, tvOS 14.0+, and visionOS 1.0+ — so the 2D request reaches essentially any modern Apple device.\n\nThe observation exposes **19 named joint constants** on `VNHumanBodyPoseObservation.JointName`:\n\n- Head: `nose`, `leftEye`, `rightEye`, `leftEar`, `rightEar`, `neck`\n- Arms: left and right `shoulder`, `elbow`, `wrist`\n- Torso: `root` (the waist)\n- Legs: left and right `hip`, `knee`, `ankle`\n\nNotice what is missing: no fingers, no heels, no foot-index points. MediaPipe's 33-landmark topology includes hand knuckles, heels, and foot tips; Vision's 2D skeleton stops at the wrists and ankles. If your form logic needs foot orientation or grip cues, that difference decides the choice before anything else does — see [pose estimation models compared](/motion/pose-estimation-models-compared) for the full topology rundown.\n\nThe request documents one revision constant, `VNDetectHumanBodyPoseRequestRevision1`. Keep that in mind for the version-pinning discussion below.\n\n**The Swift-native version.** Apple also documents `DetectHumanBodyPoseRequest`, a Swift struct with the same one-line description (\"A request that detects a human body pose\"), available from iOS 18.0, macOS 15.0, tvOS 18.0 and visionOS 2.0. It adds a `detectsHands` option, which Apple describes as \"a Boolean value that detects hands of the body in the results, if they're visible.\" If your deployment target is iOS 18 or later it is the newer API surface for the same job; below that, `VNDetectHumanBodyPoseRequest` is the one that runs. (Checked against Apple's documentation on October 12, 2026.)\n\n### The 3D request: `VNDetectHumanBodyPose3DRequest`\n\nThe 3D request is newer and narrower: iOS 17.0+, iPadOS 17.0+, macOS 14.0+, Mac Catalyst 17.0+, tvOS 17.0+, visionOS 1.0+. Apple describes it as detecting \"points on human bodies in 3D space, relative to the camera,\" and documents that \"if the system allows it, the request uses AVDepthData information to improve the accuracy\" — depth hardware is used opportunistically, not required.\n\nIt returns **17 named joint constants** on `VNHumanBodyPose3DObservation.JointName`, and the skeleton is rebalanced versus the 2D one: the face detail (eyes, ears) is gone, replaced by structural points — `topHead`, `centerHead`, `centerShoulder`, `spine`, `root`, plus left and right `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`.\n\nThe observation itself is where the 3D request gets interesting for fitness work. Apple documents:\n\n- `bodyHeight` — \"the estimated human body height, in meters,\" with a companion `heightEstimation` property describing the technique used\n- `cameraOriginMatrix` — a `simd_float4x4` transform \"from the skeleton hip to the camera\"\n- `cameraRelativePosition(_:)` — a joint's position relative to the camera\n- `pointInImage(_:)` — the 2D projection of a 3D joint back into the image\n\nCamera-relative positions plus a metric height estimate is a different 3D promise than MediaPipe's hip-relative world landmarks. Whether you need 3D at all is its own decision — [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation) covers that — but if you do, note the iOS 17 floor: three OS versions above the 2D request's iOS 14.\n\nOne honest gap: the reference pages we can verify do not document a person-count limit for either request, in either direction. Do not assume single-person or multi-person behavior from the docs — test it on your own scenes.\n\n## `VNVideoProcessor`: offline video is built in\n\nVision ships an offline analysis path that bundled models make you build yourself. `VNVideoProcessor` — \"an object that performs offline analysis of video content,\" iOS 14.0+/macOS 11.0+ — takes a video asset via `init(url:)`, accepts requests through `addRequest(_:processingOptions:)`, and runs them over a time range with `analyze(_:)`, with `cancel()` to stop. (The older `analyze(with:)` and `VNVideoProcessingOption` are deprecated; use the current forms.)\n\nFor a fitness app this is quietly one of Vision's best arguments. Point it at recorded workout clips and you get pose output with no capture session, no camera, and no device rig — which is exactly the shape a pose regression suite wants. Since Apple gives you no accuracy numbers (next section) and no model artifact to pin, a library of golden clips you re-run per OS release is your accuracy story. [Testing camera features without a device](/test/camera-features-without-a-device) covers how to build that harness.\n\n## Vision vs a bundled model: the actual trade-offs\n\nThese are decision dimensions, not benchmarks — nobody has published a neutral accuracy comparison, and Apple has published no numbers at all.\n\n| Dimension | Vision (native) | Bundled model (MediaPipe / MoveNet) |\n| --- | --- | --- |\n| Distribution | Ships inside the OS; zero model bytes in your app | You ship the file — MediaPipe's `.task` bundles download at roughly 5.5 to 29.2 MiB depending on variant |\n| Model updates | Arrive with OS updates, on Apple's schedule | You decide when to swap the file; old versions stay reproducible |\n| Version pinning | No model artifact to pin; the 2D request documents a revision constant, but the implementation lives in the OS | Pin the exact file in your repo; regression tests stay stable |\n| Platform reach | Apple platforms only (iOS, iPadOS, macOS, tvOS, visionOS) | Android, iOS, and web from one model |\n| Documentation | API reference only — no model card, no accuracy figures, no distance guidance | Published model cards with accuracy numbers, speed figures, and stated limits |\n| Topology | 19 named 2D joints; 17 named 3D joints; no hand or foot detail | MediaPipe: 33 landmarks incl. heels and foot tips; MoveNet: 17 COCO keypoints |\n| 3D output | Separate iOS 17+ request; camera-relative joints, metric `bodyHeight` | MediaPipe: hip-relative world landmarks (z estimated); MoveNet: 2D only |\n| Offline video | `VNVideoProcessor` built in | You write the frame-extraction loop |\n| Fitness positioning | None documented by Apple | Both vendors explicitly target fitness in their model cards |\n| License to track | None — OS framework, not a distributed model | Apache-2.0 (verify bundled asset terms) |\n\n## When the native path wins\n\n- **You are iOS-only, by choice.** No second implementation looming, so lock-in costs nothing. Vision's 2D request runs back to iOS 14 — a wider floor than most teams need.\n- **App size and update logistics matter.** A bundled MediaPipe `.task` file adds megabytes to your binary and makes model updates *your* release problem. Vision adds zero bytes and Apple maintains the implementation.\n- **Your pipeline already lives in Apple's media stack.** If frames come from AVFoundation capture or an ARKit session, keeping pose inference in an OS framework avoids bridging pixel buffers into a third-party runtime — in our judgement the integration friction saved here is real, though it is not something Apple quantifies.\n- **You want offline video analysis without building it.** `VNVideoProcessor` is a shipping API, not a weekend project.\n\n## When it loses\n\n- **An Android sibling app exists or is planned.** Vision does not run on Android, full stop. You would write and validate a second pose implementation with different joints, different coordinates, and different failure modes — which is why cross-platform teams usually bundle one model and run it everywhere. If that is you, start at [MediaPipe vs MoveNet](/motion/pose-estimation-models-compared#mediapipe-vs-movenet-head-to-head) instead.\n- **You need model-version pinning.** With a bundled model, the artifact in your repo is the model, forever. With Vision, the implementation ships in the OS and there is no file to pin — so, in our judgement, you should assume your golden-clip outputs can shift when users update iOS, and design your regression suite to detect that rather than prevent it.\n- **Your feature needs feet or hands.** 19 points without heel or foot-index landmarks rules out some squat-depth and stance heuristics that MediaPipe's 33-point topology supports.\n- **You need accuracy claims you can cite.** See below.\n\n## The accuracy claim you cannot make\n\nApple publishes an API reference, not a model card. Concretely, the documentation contains no accuracy figures, no evaluation dataset, no distance-from-camera guidance, and no statement of intended use cases. Compare the bundled options: MoveNet's card states fitness targeting, a 3 to 6 foot working distance, and mAP figures; the BlazePose card publishes PCK numbers and a stated degradation range. Against those, any sentence you write that ranks Vision's accuracy is unverifiable from primary sources.\n\nThe closest thing to a published number comes from Google's legacy MediaPipe docs, whose quality table lists \"Apple Vision\" at PCK@0.2 scores of 82.7 (yoga), 91.4 (dance), and 88.6 (HIIT) — below all three BlazePose variants. Treat that with the obvious caveat: it is a competitor benchmarking a rival on Google's own evaluation set, with no stated Vision version or configuration. It is a data point, not a verdict.\n\nThis is a real decision factor, not a technicality. If your product, your investors, or your compliance story needs a citable accuracy basis, a model with a published card gives you one and Vision does not. If you can substitute your own measurement — and `VNVideoProcessor` over a labeled clip library makes that cheap — the gap closes. Either way, the number that matters is the one you measure on your own footage.\n\n## Before you ship\n\nThe decision compresses well: iOS-only product, standard joints, tolerance for Apple's update cadence — take Vision and enjoy shipping zero model bytes. Android on the roadmap, version pinning required, or hand/foot landmarks needed — bundle a model. In both cases, build the recorded-clip regression suite first, because with Vision it is your only accuracy instrument and with a bundled model it is how you validate upgrades. For wiring the capture session, request handling, and joint processing into a working iOS app, see the [AI workout tracking in iOS with Swift guide](/guides/ai-workout-tracking-ios-swift).",
    "faqs": [
      {
        "q": "Why do Apple's 2D and 3D body pose requests return different joint counts?",
        "a": "They use different skeletons. VNDetectHumanBodyPoseRequest exposes 19 named joint constants including face detail (nose, eyes, ears) plus neck, shoulders, elbows, wrists, root, hips, knees, and ankles. VNDetectHumanBodyPose3DRequest exposes 17 named joints that drop the eyes and ears in favor of structural points: topHead, centerHead, centerShoulder, spine, and root, plus the arm and leg joints. Neither includes hand or foot detail, so code written against one skeleton does not map one-to-one onto the other."
      },
      {
        "q": "Does Apple publish a model card or accuracy numbers for Vision body pose?",
        "a": "No. Apple's documentation is an API reference: it contains no model card, no accuracy figures, no evaluation dataset, no distance-from-camera guidance, and no stated intended use cases. That contrasts with MediaPipe BlazePose and MoveNet, whose model cards publish accuracy numbers and working-distance limits. The only published figures naming Apple Vision come from Google's own MediaPipe comparison table, which is a competitor's benchmark and should be treated with that caveat. If you need a citable accuracy basis, measure Vision yourself on labeled footage."
      },
      {
        "q": "What OS versions do the Vision body pose requests require?",
        "a": "Apple documents VNDetectHumanBodyPoseRequest (2D) as available from iOS 14.0, iPadOS 14.0, macOS 11.0, Mac Catalyst 14.0, tvOS 14.0, and visionOS 1.0. VNDetectHumanBodyPose3DRequest (3D) requires iOS 17.0, iPadOS 17.0, macOS 14.0, Mac Catalyst 17.0, tvOS 17.0, or visionOS 1.0. VNVideoProcessor for offline video matches the 2D floor at iOS 14.0 and macOS 11.0. The three-version gap between the 2D and 3D floors matters if your feature depends on 3D output."
      },
      {
        "q": "Can Vision run body pose on recorded video instead of a live camera?",
        "a": "Yes. VNVideoProcessor is Apple's documented object for offline analysis of video content: create it with init(url:) pointing at a video asset, attach requests with addRequest(_:processingOptions:), and run analyze(_:) over a time range, with cancel() to stop. The older analyze(with:) and VNVideoProcessingOption are deprecated. This is useful for fitness work because a library of recorded workout clips becomes a pose regression suite that needs no capture session or physical device camera."
      },
      {
        "q": "Should a cross-platform fitness app use Apple Vision for pose estimation?",
        "a": "Usually not as its only pose layer. Vision runs on Apple platforms only, so an Android sibling app needs a second implementation with a different skeleton, different coordinates, and different failure modes, all validated separately. Cross-platform teams therefore usually bundle one model, such as MediaPipe Pose Landmarker or MoveNet, and run the same artifact on both platforms. Vision still earns a place in an iOS-only product, or as a deliberate per-platform choice made with eyes open about maintaining two pipelines."
      }
    ],
    "related": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "MediaPipe vs MoveNet, head to head"
      },
      {
        "href": "/guides/ai-workout-tracking-ios-swift",
        "label": "AI workout tracking in Swift"
      },
      {
        "href": "/test/camera-features-without-a-device",
        "label": "Test camera features without a device"
      },
      {
        "href": "/pose-keypoints/apple-vision-2d",
        "label": "All 19 Vision 2D joint names"
      },
      {
        "href": "/pose-keypoints/apple-vision-3d",
        "label": "All 17 Vision 3D joint names"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Choosing between the iOS-native path and a bundled pose model? Get our developer notes on the trade-offs Apple never documents."
    }
  },
  {
    "slug": "pose-estimation-model-licenses",
    "primaryQuery": "pose estimation model license commercial use",
    "h1": "Pose Estimation Model Licenses: Which Can You Ship Commercially?",
    "metaTitle": "Pose Model Licenses: MediaPipe, MoveNet, YOLO, OpenPose",
    "metaDescription": "What pose model licenses allow commercially: MediaPipe and MoveNet SinglePose are Apache-2.0, Ultralytics YOLO is AGPL-3.0, OpenPose is noncommercial.",
    "updated": "2026-10-12",
    "answer": "A pose model can carry up to three sets of terms (the code's license, the terms on the weights, and an SDK's service terms), and the one that matters is the one covering what you actually ship. MediaPipe/BlazePose and MoveNet SinglePose are Apache-2.0 on both code and model card, a royalty-free grant that still requires you to pass on the license and keep notices when you redistribute, while the text of the MoveNet MultiPose card shows no license line. Ultralytics YOLO is AGPL-3.0 unless you take its Enterprise License, and OpenPose is licensed for noncommercial research only. ML Kit Pose Detection is governed by Google's service terms instead of an open license, and Apple Vision ships inside the operating system with no model file or open-source license to read.",
    "body": "Choosing a model is the job of our [pose model roundup](/motion/pose-estimation-models-compared). This page reads the paperwork: the LICENSE files, model cards and SDK terms as they stood on 2026-10-12, and what each lets a commercial fitness product do. It is not legal advice; confirm with counsel before you ship.\n\n## Three sets of terms, and the one you ship under\n\nA pose model can come with up to three separate sets of terms:\n\n1. **Code license:** the LICENSE file in the repository.\n2. **Weights terms:** the model card, or wherever the weights are hosted.\n3. **Service terms:** for an SDK, its terms of service.\n\nThey can differ, and the one you need is the one covering what you actually ship: a bundled model file brings its card's terms, a closed SDK its service terms.\n\n## The layers, model by model\n\nThe last column is our reading, not the vendor's.\n\n| Model | Code license or SDK terms | Weights terms | Our reading |\n| --- | --- | --- | --- |\n| MediaPipe / BlazePose GHUM 3D | Apache-2.0 | Apache-2.0 (model card) | Apache-2.0 on both layers |\n| MoveNet SinglePose | Apache-2.0 | Apache-2.0 (model card) | Apache-2.0 on both layers |\n| MoveNet MultiPose | Apache-2.0 | No license line in the extracted card text | Confirm before shipping |\n| Ultralytics YOLO pose | AGPL-3.0, or an Enterprise License | Not verified separately | Comply with AGPL-3.0 or take an Enterprise License |\n| OpenPose | Noncommercial research only | Not verified separately | Needs a separate commercial license |\n| MMPose / RTMPose | Apache-2.0 | Not verified | Confirm the weights |\n| ML Kit Pose Detection | ML Kit Terms of Service | Models are \"related software\" | Service terms; metrics disclosure duty |\n| Apple Vision body pose | Apple's developer agreements | No model file | Not reviewed for this page |\n\n## MediaPipe and BlazePose GHUM 3D\n\nThe `google-ai-edge/mediapipe` [LICENSE file](https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE) is the Apache License, Version 2.0, and the [BlazePose GHUM 3D model card](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf), dated April 16, 2021, says \"LICENSED UNDER Apache License, Version 2.0\". Code and weights agree.\n\nThe card's intended use is \"3D full body pose estimation for single-person videos on mobile, desktop and in browser\", and its domains include \"Fitness and repetition counting\" and \"3D pose measurements (angles / distances)\". Out of scope, it lists:\n\n- multiple people in an image;\n- people \"further than 14 feet/4 meters\" from the camera;\n- a head that is not visible;\n- \"Applications requiring metric accurate depth\";\n- \"Any form of surveillance or identity recognition is explicitly out of scope and not enabled by this technology\".\n\nIts ethical considerations add: \"The model is not intended for human life-critical decisions. The primary intended application is entertainment.\"\n\nThese are model-card statements, not Apache license terms, and we are not saying whether they bind you. A fitness product should read them anyway: in our reading, angle-based form feedback sits inside the card's domains, and a feature needing metric-accurate depth does not.\n\n## MoveNet\n\nMoveNet is served through the `pose-detection` package, which lives in the `tensorflow/tfjs-models` repository; that repository's [LICENSE file](https://github.com/tensorflow/tfjs-models/blob/master/LICENSE) is the Apache License, Version 2.0. The weights have their own cards, and they differ:\n\n- The [MoveNet.SinglePose card](https://storage.googleapis.com/movenet/MoveNet.SinglePose%20Model%20Card.pdf) covers Lightning and Thunder (17 keypoints), says \"Licensed Under Apache License, Version 2.0\", and puts multi-person use out of scope: \"not intended for detecting poses of multiple people in the image\".\n- The [MoveNet.MultiPose card](https://storage.googleapis.com/movenet/MoveNet.MultiPose%20Model%20Card.pdf) covers up to 6 people, but the text we extracted from it has no license line.\n\nThat makes the package's `MULTIPOSE_LIGHTNING` type (up to 6 poses, per its README) the plainest layer problem on this page: Apache-2.0 code, and no license line in the extracted text of its card. Confirm MultiPose terms before you ship it commercially; our [MediaPipe vs MoveNet head-to-head](/motion/pose-estimation-models-compared#mediapipe-vs-movenet-head-to-head) flags the same gap. The tfjs-models README links the weights on tfhub.dev, a host we could not reach, so we could not read any terms shown there.\n\n## Ultralytics YOLO pose\n\nThe `ultralytics/ultralytics` [LICENSE file](https://github.com/ultralytics/ultralytics/blob/main/LICENSE) is the GNU Affero General Public License, Version 3 (AGPL-3.0). The [README](https://github.com/ultralytics/ultralytics/blob/main/README.md) calls AGPL-3.0 \"perfect for students, researchers, and enthusiasts\" and describes the Ultralytics Enterprise License as \"For development and production use\", covering \"business products and services, including internal tools, automated workflows, and production deployments, bypassing the open-source requirements of AGPL-3.0.\" That includes internal tools, not only apps you ship.\n\nThe license text addresses networked use too. Section 13, \"Remote Network Interaction\": \"if you modify the Program, your modified version must prominently offer all users interacting with it remotely through a computer network (if your version supports such interaction) an opportunity to receive the Corresponding Source of your version by providing access to the Corresponding Source from a network server at no charge\".\n\nIn our reading, keeping YOLO pose on your own server does not by itself take you outside AGPL-3.0; whether your pipeline counts as a modified version is a question for counsel. The README's Enterprise paragraph names \"Ultralytics software and AI models\" together, and we did not verify separate terms for the pretrained pose weights, so our recommendation is to treat code and weights as one licensing decision. We did not review Ultralytics' licensing page and have no price to report.\n\n## OpenPose\n\nThe `CMU-Perceptual-Computing-Lab/openpose` [LICENSE](https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/LICENSE) is headed \"ACADEMIC OR NON-PROFIT ORGANIZATION NONCOMMERCIAL RESEARCH USE ONLY\" and grants \"a personal, non-exclusive, non-transferable license to use the Software for noncommercial research purposes, without the right to sublicense\". It defines \"Software\" to include \"all or any derivatives and/or modifications created or made by You\". In our reading, a modified fork stays under the same noncommercial grant.\n\nThe README says \"OpenPose is freely available for free non-commercial use\" and points commercial users to a FlintBox link, CMU's licensing portal; no price is published in the repository. In our reading, a commercial fitness product needs that separate license.\n\n## MMPose and RTMPose\n\nThe `open-mmlab/mmpose` [LICENSE](https://github.com/open-mmlab/mmpose/blob/main/LICENSE) opens \"Copyright 2018-2020 Open-MMLab. All rights reserved.\" and continues with the Apache License, Version 2.0. RTMPose lives in the same repository, under `projects/rtmpose`. We did not verify the terms for pretrained weights downloaded from OpenMMLab's hosts, so check them before you ship a checkpoint.\n\n## ML Kit Pose Detection: service terms, not a license\n\nWhere MediaPipe gives you Apache-2.0 code and a model card, ML Kit Pose Detection is a closed SDK under service terms, and Google's [Pose Detection page](https://developers.google.com/ml-kit/vision/pose-detection) says: \"This API is offered in beta, and is not subject to any SLA or deprecation policy.\" The [ML Kit Terms of Service](https://developers.google.com/ml-kit/terms), last modified May 14, 2025, \"incorporate and are subject to the Google APIs Terms of Service\", and three parts matter for a fitness app:\n\n- **Models count as related software.** The terms say \"machine learning models will be considered related software\" and \"you may not reverse engineer or attempt to extract the source code or any related software\". In our reading, the pose model is not yours to pull out and reuse.\n- **Input is processed on the device.** Processing \"fully happens on-device, and ML Kit does not send that data and the resultant outputs to Google servers\".\n- **Usage metrics go to Google.** The APIs \"send metrics about the performance and utilization of the APIs in your app to Google\", and \"You are responsible for informing users of your app about Google's processing of ML Kit metrics data as required by applicable law.\"\n\nOur recommendation: cover that disclosure duty in your [fitness app privacy policy](/compliance/health-app-privacy-policy).\n\n## Apple Vision: no model file, no open-source license\n\nApple's [documentation](https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest) lists `VNDetectHumanBodyPoseRequest` from iOS 14.0, macOS 11.0, tvOS 14.0 and visionOS 1.0, and `VNDetectHumanBodyPose3DRequest` from iOS 17.0 and macOS 14.0. The model ships inside the operating system, so there is no model file or open-source license to read; its use is governed by Apple's developer agreements, which we did not review for this page. API details are in [Apple Vision body pose](/motion/apple-vision-body-pose).\n\n## Apache-2.0 still has conditions\n\nApache-2.0's section 2 grants \"a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work\". Section 4 attaches conditions to redistribution: give recipients a copy of the License; put prominent notices on files you modified; keep the copyright, patent, trademark and attribution notices; and if the Work includes a NOTICE file, include its attribution notices in a NOTICE file, the documentation, or a display such as an about screen.\n\nIn our reading, an app that bundles the library or a model file redistributes it, so ship a licenses screen with the license text and any NOTICE attributions.\n\n## Our recommendation\n\n- **One user, on device:** MediaPipe/BlazePose or MoveNet SinglePose, the two options here verified Apache-2.0 on both layers.\n- **Several people in frame:** none of the multi-person models in our roundup (MoveNet MultiPose, YOLO pose, OpenPose) is verified Apache-2.0 on both layers, so settle the license before the architecture. [Multi-person pose tracking](/motion/multi-person-pose-tracking) covers the engineering.\n- **Inference on your server:** not distributing a binary does not settle AGPL-3.0. [On-device vs cloud pose estimation](/motion/on-device-vs-cloud-pose-estimation) covers the wider trade-off.",
    "faqs": [
      {
        "q": "Is MoveNet licensed under Apache 2.0?",
        "a": "For the single-person models, yes: the MoveNet.SinglePose model card, which covers Lightning and Thunder, says \"Licensed Under Apache License, Version 2.0\", and the tensorflow/tfjs-models repository that serves MoveNet is Apache-2.0 too. The MoveNet.MultiPose card is the exception, because the text we extracted from it has no license line, so confirm MultiPose terms before shipping it commercially. The tfjs-models README links the MoveNet weights on tfhub.dev, which we could not reach, so we could not read any terms shown there."
      },
      {
        "q": "Is MediaPipe free for commercial use?",
        "a": "In our reading, yes, with conditions. The google-ai-edge/mediapipe LICENSE file and the BlazePose GHUM 3D model card both state Apache License, Version 2.0, whose section 2 grant is no-charge and royalty-free, and section 4 requires you, when you redistribute, to give recipients a copy of the license, mark files you modified, keep existing notices, and carry any NOTICE file attributions. The card also lists out-of-scope uses, including applications requiring metric accurate depth and any form of surveillance or identity recognition, which a fitness product should read."
      },
      {
        "q": "Does the AGPL apply if YOLO pose only runs on my server?",
        "a": "In our reading, server-only use does not by itself put Ultralytics YOLO outside AGPL-3.0. Section 13 of the license says a modified version must offer all users interacting with it remotely through a computer network an opportunity to receive its Corresponding Source, and the Ultralytics README describes its Enterprise License as covering internal tools and production deployments, not only distributed apps. Whether your pipeline counts as a modified version is a question to put to counsel."
      },
      {
        "q": "Can I use OpenPose in a commercial fitness app?",
        "a": "Not under the license in its repository. CMU's LICENSE is headed \"ACADEMIC OR NON-PROFIT ORGANIZATION NONCOMMERCIAL RESEARCH USE ONLY\" and grants a personal, non-transferable license for noncommercial research purposes, with derivatives and modifications counted as part of the Software. The README points commercial users to a FlintBox link, CMU's licensing portal, and the repository publishes no price, so in our reading a commercial product needs that separate license."
      },
      {
        "q": "How do ML Kit's pose detection terms differ from MediaPipe's license?",
        "a": "MediaPipe gives you Apache-2.0 code and a model card you can read, while ML Kit Pose Detection is a closed SDK under the ML Kit Terms of Service, which incorporate the Google APIs Terms of Service. Those terms count machine learning models as related software, say you may not reverse engineer or attempt to extract the source code or any related software, and make you responsible for informing your users about Google's processing of ML Kit metrics data as required by applicable law. Google also documents the pose API as beta, with no SLA or deprecation policy."
      }
    ],
    "related": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "Pose estimation models compared"
      },
      {
        "href": "/motion/mediapipe-pose-landmarker-models",
        "label": "MediaPipe Pose Landmarker: Lite vs Full vs Heavy"
      },
      {
        "href": "/motion/build-vs-buy-ai-motion-tracking",
        "label": "Build vs buy AI motion tracking"
      },
      {
        "href": "/guides/camera-pose-tracking",
        "label": "Add camera pose tracking"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Get our developer notes on AI motion tracking, including when a pose model's license file, model card or SDK terms change."
    },
    "sources": [
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE",
        "checked": "2026-10-12",
        "note": "MediaPipe code license (Apache License, Version 2.0), and the Apache-2.0 section 2 grant and section 4 redistribution conditions quoted on this page."
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-12",
        "note": "BlazePose GHUM 3D model card dated April 16, 2021: Apache-2.0 license line, intended use and domains, out-of-scope applications, ethical considerations."
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/LICENSE",
        "checked": "2026-10-12",
        "note": "Code license of the tensorflow/tfjs-models repository, home of the pose-detection package that serves MoveNet: Apache License, Version 2.0."
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.SinglePose%20Model%20Card.pdf",
        "checked": "2026-10-12",
        "note": "MoveNet.SinglePose card: Apache-2.0 license line, Lightning and Thunder variants, 17 keypoints, multi-person detection out of scope."
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.MultiPose%20Model%20Card.pdf",
        "checked": "2026-10-12",
        "note": "MoveNet.MultiPose card: up to 6 people; no license line in the extracted text."
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/LICENSE",
        "checked": "2026-10-12",
        "note": "Ultralytics code license: AGPL-3.0, including the section 13 Remote Network Interaction text quoted here."
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/README.md",
        "checked": "2026-10-12",
        "note": "README descriptions of the AGPL-3.0 route and the Ultralytics Enterprise License."
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/LICENSE",
        "checked": "2026-10-12",
        "note": "OpenPose license: noncommercial research heading, the grant, and the definition of Software including derivatives and modifications."
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/blob/main/LICENSE",
        "checked": "2026-10-12",
        "note": "MMPose copyright line followed by the Apache License, Version 2.0."
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection",
        "checked": "2026-10-12",
        "note": "ML Kit Pose Detection: offered in beta and not subject to any SLA or deprecation policy."
      },
      {
        "url": "https://developers.google.com/ml-kit/terms",
        "checked": "2026-10-12",
        "note": "ML Kit Terms of Service (last modified May 14, 2025): Google APIs Terms incorporated, models as related software, no reverse engineering or extraction, on-device processing, usage metrics and the user-disclosure duty."
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest",
        "checked": "2026-10-12",
        "note": "VNDetectHumanBodyPoseRequest availability: iOS 14.0, macOS 11.0, tvOS 14.0, visionOS 1.0."
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/movenet/README.md",
        "checked": "2026-10-12",
        "note": "MoveNet model types SINGLEPOSE_LIGHTNING, SINGLEPOSE_THUNDER and MULTIPOSE_LIGHTNING (up to 6 poses); the Lightning and Thunder weights are linked on tfhub.dev."
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/README.md",
        "checked": "2026-10-12",
        "note": "OpenPose is freely available for free non-commercial use; commercial licensing through CMU's FlintBox link; no price published."
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose",
        "checked": "2026-10-12",
        "note": "RTMPose lives in the mmpose repository under projects/rtmpose."
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vndetecthumanbodypose3drequest",
        "checked": "2026-10-12",
        "note": "VNDetectHumanBodyPose3DRequest availability from iOS 17.0 and macOS 14.0."
      }
    ]
  },
  {
    "slug": "movenet-models",
    "primaryQuery": "movenet model",
    "h1": "MoveNet Lightning, Thunder and MultiPose: Inputs, Outputs and Licence",
    "metaTitle": "MoveNet Lightning vs Thunder vs MultiPose: Model Guide",
    "metaDescription": "MoveNet's three models side by side: input sizes, the 17-keypoint output tensor, TF.js and TF Lite runtimes, published speeds and what each card licenses.",
    "updated": "2026-10-17",
    "answer": "MoveNet comes as three models that all output the 17 COCO keypoints: SinglePose Lightning (192x192 input, the TF.js default and the fastest), SinglePose Thunder (256x256, more accurate but slower) and MultiPose Lightning (up to 6 people, input sized at run time). Google's model cards target the browser through TensorFlow.js and on-device use through TensorFlow Lite, and the SinglePose card describes one person 3 to 6 feet from a webcam. The tensorflow/tfjs-models code and the SinglePose card are Apache-2.0, while the text of the MultiPose card carries no license line, so confirm its terms before shipping it.",
    "body": "This page is about MoveNet alone. The choice between it and MediaPipe is made in [MediaPipe vs MoveNet, head to head](/motion/pose-estimation-models-compared#mediapipe-vs-movenet-head-to-head), and the licence layers are read in full in [pose estimation model licenses](/motion/pose-estimation-model-licenses). Everything below was read from Google's two MoveNet model cards and the tensorflow/tfjs-models repository on October 17, 2026.\n\n## The three models\n\n| Model | `modelType` in TF.js | Input | People | How the source describes it |\n| --- | --- | --- | --- | --- |\n| SinglePose Lightning | `SINGLEPOSE_LIGHTNING` (the default) | 192x192x3, int32, RGB 0 to 255 | 1 | \"intended for latency-critical applications\" |\n| SinglePose Thunder | `SINGLEPOSE_THUNDER` | 256x256x3, int32, RGB 0 to 255 | 1 | \"intended for applications that require high accuracy\" |\n| MultiPose Lightning | `MULTIPOSE_LIGHTNING` | 1xHxWx3, H and W multiples of 32 set at run time | Up to 6 | \"detects up to 6 poses\" |\n\nThe SinglePose card describes both single-person models as a MobileNetV2 feature extractor with a Feature Pyramid Network decoder and CenterNet prediction heads, Lightning at depth multiplier 1.0 and Thunder at 1.75. The MultiPose card gives the same architecture at depth multiplier 1.5 and recommends resizing the image so its larger side is 256 pixels, keeping the aspect ratio. In the TF.js package that size is `multiPoseMaxDimension`: a multiple of 32, 256 by default, with 128 to 512 recommended.\n\n## What comes out\n\nRead the coordinate order before writing any code. Per the SinglePose card, the raw model returns a float32 tensor of shape `[1, 1, 17, 3]`: for each keypoint, y and x normalized to the image frame (0.0 to 1.0), then a confidence score. The MultiPose card's output is `[1, 6, 56]`: six instance slots, each holding 17 groups of y, x and score, then a bounding box (ymin, xmin, ymax, xmax) in normalized coordinates and an instance score.\n\nThe TF.js `pose-detection` package converts this for you. Its README says each keypoint \"contains x, y, score and name\", that x and y \"represent the actual keypoint position in the image\", and that `poseDetection.calculators.keypointsToNormalizedKeypoints` converts them to the 0 to 1 range. With MultiPose, each returned pose also carries a `box`, and an `id` when tracking is on.\n\nThe 17 keypoints follow the COCO order, from 0 nose to 16 right_ankle. The full table, and the other models that share it, are in [the COCO 17 keypoint map](/pose-keypoints/coco-17).\n\n## Confidence thresholds\n\nThe SinglePose card says the model \"predicts 17 human keypoints of the full body even when they are occluded\", gives keypoints outside the frame low confidence scores, and recommends a default threshold of 0.3 to filter them. The TF.js package has a separate, pose-level threshold: `minPoseScore`, which falls back to `DEFAULT_MIN_POSE_SCORE`, 0.25 in the MoveNet constants file, when you do not set it.\n\n## Runtimes and where the weights come from\n\nIn the browser, the MoveNet README pairs the package with a TF.js backend: WebGL, or WebAssembly, which it calls \"the typical backend for devices with lower-end or no GPUs\". By default the package loads weights from tfhub.dev, and the constants file names the three model URLs:\n\n```text\nhttps://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4\nhttps://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4\nhttps://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1\n```\n\nThe `modelUrl` option points the package at your own copy instead; the README calls it useful \"for area/countries that don't have access to the model hosted on tf.hub\", and it also accepts an `io.IOHandler` such as tfjs-react-native's `bundleResourceIO` to load from an app bundle. Outside the browser, both cards name TensorFlow Lite for on-device use, and the MultiPose card gives its input as int32 for TF.js and uint8 for TF Lite.\n\n## The published speed numbers\n\nThe MoveNet README publishes frames per second for its three models, in the order SinglePose Lightning, SinglePose Thunder, MultiPose Lightning:\n\n| Backend | MacBook Pro 15-inch 2019 | iPhone 12 | Pixel 5 | Desktop, i9-10900K with GTX 1070 |\n| --- | --- | --- | --- | --- |\n| WebGL | 104, 77, 54 | 51, 43, 24 | 34, 12, 8 | 87, 82, 62 |\n| WASM with SIMD and multithreading | 42, 21, N/A | N/A | N/A | 71, 30, N/A |\n\nThese are the TF.js team's figures on its own hardware. The README adds that for MultiPose \"the number of detected persons does not impact inference speed and the accuracy of detections is similar to that of SinglePose Lightning\". The cards' millisecond benchmarks are set against MediaPipe's on [the comparison page](/motion/pose-estimation-models-compared#mediapipe-vs-movenet-head-to-head); measure on your own target devices before you choose.\n\n## Licence\n\nThe tensorflow/tfjs-models LICENSE is the Apache License, Version 2.0, and the SinglePose card says \"Licensed Under Apache License, Version 2.0\". The text of the MultiPose card has no license line. That gap, and what Apache-2.0 asks of you when you ship, are covered in [pose estimation model licenses](/motion/pose-estimation-model-licenses).\n\n## Two statements that disagree\n\nThe pose-detection package README still says \"Currently, only PoseNet supports multi-pose estimation.\" The MoveNet README in the same repository documents `MULTIPOSE_LIGHTNING`, and the MoveNet constants file lists it among the valid models. We go by the MoveNet README and the code.\n\n## Which one to load\n\nOur reading of Google's own descriptions: SinglePose Lightning for live rep counting where latency matters most, Thunder when you can spend more compute for a cleaner pose, and MultiPose Lightning only when more than one person must be tracked. The SinglePose card is explicit that it focuses \"on detecting the pose of the person who is closest to the image center\" and ignores the rest. What you then compute from the keypoints is covered in [how rep counting works](/motion/how-rep-counting-works).",
    "faqs": [
      {
        "q": "What input size do MoveNet Lightning and Thunder expect?",
        "a": "Google's MoveNet.SinglePose card gives an int32 tensor of 192x192x3 for Lightning and 256x256x3 for Thunder, RGB with values from 0 to 255, and the TF.js MoveNet constants file uses the same 192 and 256 resolutions. MultiPose Lightning differs: its input is 1xHxWx3 with H and W multiples of 32 chosen at run time, and its card recommends resizing so the larger side is 256 pixels."
      },
      {
        "q": "In what order does MoveNet's output tensor store coordinates?",
        "a": "y first, then x, then the score. The SinglePose card describes a 1x1x17x3 float32 tensor whose last dimension holds the yx coordinates normalized to the image frame followed by the confidence, and the MultiPose card lays out each person as y, x and score for all 17 keypoints followed by a bounding box and an instance score. The TF.js pose-detection package converts this into keypoints with x, y, score and name, with x and y in image pixels."
      },
      {
        "q": "How many people can MoveNet MultiPose track?",
        "a": "Up to 6. The MoveNet README describes MULTIPOSE_LIGHTNING as a multi-pose detector that detects up to 6 poses, the MultiPose card says the same, and each returned pose carries a bounding box. Setting enableTracking gives each pose an id that identifies the person across frames. The README also says the number of detected people does not change inference speed and that accuracy is similar to SinglePose Lightning's."
      },
      {
        "q": "Where does the TF.js pose-detection package load MoveNet weights from?",
        "a": "From tfhub.dev by default: the MoveNet constants file points at movenet/singlepose/lightning/4, movenet/singlepose/thunder/4 and movenet/multipose/lightning/1 under tfhub.dev/google/tfjs-model. The modelUrl option loads your own copy instead and also accepts an io.IOHandler, which the README pairs with tfjs-react-native's bundleResourceIO to load a model from the app bundle."
      },
      {
        "q": "What confidence threshold does Google suggest for MoveNet keypoints?",
        "a": "0.3. The MoveNet.SinglePose card says the model predicts all 17 keypoints even when they are occluded, gives keypoints outside the frame low confidence scores, and recommends a default threshold of 0.3 to filter out unconfident predictions. That is per keypoint; the TF.js package's minPoseScore is a separate threshold on the whole pose, which defaults to 0.25."
      }
    ],
    "related": [
      {
        "href": "/pose-keypoints/coco-17",
        "label": "The COCO 17 keypoint order"
      },
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "MediaPipe vs MoveNet, head to head"
      },
      {
        "href": "/motion/pose-estimation-model-licenses",
        "label": "Pose model licences"
      },
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Get our developer notes on pose models, including when Google changes MoveNet's weights, cards or TF.js package."
    },
    "sources": [
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/movenet/README.md",
        "checked": "2026-10-17",
        "note": "The three model types and their descriptions, detector options, the WebGL and WASM backends, the FPS table and the MultiPose speed and accuracy note."
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/movenet/constants.ts",
        "checked": "2026-10-17",
        "note": "192 and 256 input resolutions, the MultiPose default maximum dimension of 256, the tfhub.dev URLs, the valid models and DEFAULT_MIN_POSE_SCORE 0.25."
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/movenet/detector.ts",
        "checked": "2026-10-17",
        "note": "minPoseScore falls back to DEFAULT_MIN_POSE_SCORE when it is not set."
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/README.md",
        "checked": "2026-10-17",
        "note": "Keypoint fields x, y, score and name in image coordinates, keypointsToNormalizedKeypoints, and the sentence that only PoseNet supports multi-pose estimation."
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.SinglePose%20Model%20Card.pdf",
        "checked": "2026-10-17",
        "note": "Architecture and depth multipliers, 192x192 and 256x256 int32 inputs, the 1x1x17x3 yx output, TF.js and TF Lite, 3 to 6 feet, the person closest to the image center, the 0.3 threshold and the Apache-2.0 license line."
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.MultiPose%20Model%20Card.pdf",
        "checked": "2026-10-17",
        "note": "Up to 6 people, depth multiplier 1.5, dynamic input in multiples of 32 with 256 recommended, int32 for TF.js and uint8 for TF Lite, the 1x6x56 output; no license line in the extracted text."
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/LICENSE",
        "checked": "2026-10-17",
        "note": "Apache License, Version 2.0."
      }
    ]
  },
  {
    "slug": "ml-kit-pose-detection",
    "primaryQuery": "ml kit pose detection",
    "h1": "ML Kit Pose Detection: Base vs Accurate SDK, Landmarks and Limits",
    "metaTitle": "ML Kit Pose Detection: Base vs Accurate SDK and Limits",
    "metaDescription": "Google's ML Kit pose API on Android and iOS: base vs accurate SDK sizes and speeds, the 33 landmarks, the experimental Z value and the one-person limit.",
    "updated": "2026-10-17",
    "answer": "ML Kit Pose Detection is Google's on-device pose API for Android and iOS: it returns 33 landmarks for one person, each with an in-frame likelihood and an experimental Z value measured from the hips. It ships as a base SDK, which Google describes as real time on phones like the Pixel 4 and iPhone X, and an accurate SDK that is slower but returns more accurate coordinates; Google's guides put the added app size between about 10 MB and 33 MB depending on SDK and platform. Google states the API is in beta with no SLA or deprecation policy, detects only one person, and needs the user's face in view.",
    "body": "Choosing between ML Kit, MediaPipe and the rest happens in [pose estimation models compared](/motion/pose-estimation-models-compared). ML Kit is governed by service terms rather than an open-source licence, read in [pose estimation model licenses](/motion/pose-estimation-model-licenses). This page covers what Google's ML Kit guides and API reference say about the pose API, as read on October 17, 2026.\n\n## Base vs accurate SDK\n\n| Platform | SDK | App size, per Google | Speed, per Google |\n| --- | --- | --- | --- |\n| Android | `pose-detection` | About 10.1 MB | Pixel 3XL: about 30 FPS |\n| Android | `pose-detection-accurate` | About 13.3 MB | Pixel 3XL: about 23 FPS on CPU, about 30 FPS on GPU |\n| iOS | `PoseDetection` | Up to 29.6 MB | iPhone X: about 45 FPS |\n| iOS | `PoseDetectionAccurate` | Up to 33.2 MB | iPhone X: about 29 FPS |\n\nGoogle's overview says the base SDK \"runs in real time on modern phones like the Pixel 4 and iPhone X\" while \"the precision of the landmark coordinates may vary\", and that the accurate SDK \"returns results at a slower framerate, but produces more accurate coordinate values\". On Android the code and assets are statically linked into the app at build time, and the guide requires API level 23 or above; on iOS the detector's assets are statically linked. The guides printed these dependency versions on the day we read them:\n\n```text\ncom.google.mlkit:pose-detection:18.0.0-beta5\ncom.google.mlkit:pose-detection-accurate:18.0.0-beta5\npod 'GoogleMLKit/PoseDetection', '8.0.0'\npod 'GoogleMLKit/PoseDetectionAccurate', '8.0.0'\n```\n\nThe iOS guide asks for Xcode 13.2.1 or higher.\n\n## What it returns\n\nWhen a person is detected, the Android guide says the API returns a `Pose` with 33 `PoseLandmark` objects, and an empty list when nobody is. Each landmark has a type, a 2D position, a 3D position and an in-frame likelihood from 0.0 to 1.0. When part of the body is outside the image, Google says the missing landmarks get coordinates outside the frame and low in-frame values.\n\nThe 33 types are listed with their integer values in [the ML Kit landmark map](/pose-keypoints/ml-kit). They use the same 33 values as MediaPipe's `PoseLandmark` enum, and every name matches except the mouth corners: ML Kit's `LEFT_MOUTH` and `RIGHT_MOUTH` against MediaPipe's `MOUTH_LEFT` and `MOUTH_RIGHT`. One quirk of Google's Android reference: it describes `RIGHT_EYE`, `RIGHT_EYE_INNER` and `RIGHT_EYE_OUTER` with the word \"left\".\n\nGoogle's overview adds that \"Pose Detection does not attach any meaning to the landmarks in a pose or the pose itself\". Classifying a pose or counting a rep is your code's job, which [how rep counting works](/motion/how-rep-counting-works) covers.\n\n## The Z value\n\nGoogle calls Z \"an experimental value\". The overview says it is measured in image pixels like X and Y but \"is not a true 3D value\", that its origin is approximately the center point between the hips, that negative values are toward the camera, and that it has no upper or lower bound. The Android reference adds that Z is less accurate than X and Y.\n\nTwo of Google's pages differ on one point. The overview says the Z coordinate \"is calculated for every landmark\"; the iOS Swift reference says \"z-values for facial landmarks are not calculated, so please disregard them\". Treat facial Z as unusable either way. For depth you can lean on, see [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation).\n\n## Detection modes and inputs\n\n`STREAM_MODE`, the default, detects the most prominent person, then tracks them and re-runs person detection only when they are obscured or lost; Google recommends it for video. `SINGLE_IMAGE_MODE` runs person detection on every image, with higher latency and no tracking, for static images. On Android, `setPreferredHardwareConfigs` chooses between `CPU` and `CPU_GPU`, and ML Kit falls back to CPU when no preferred configuration works.\n\nGoogle asks for input images of at least 480x360 pixels and says the person should be represented by at least 256x256 pixels for best performance. For real-time use it recommends the base SDK with `STREAM_MODE`.\n\n## The limits Google states\n\n- **One person.** \"Pose detection can only detect one person in an image.\" With two people, the landmarks go to the person detected with the highest confidence.\n- **The face must be visible.** \"The user's face must be present in order to detect a pose.\"\n- **Beta.** The API \"is offered in beta, and is not subject to any SLA or deprecation policy\", and Google warns that changes may break backward compatibility.\n\nThe ML Kit Terms of Service, last modified May 14, 2025, say processing of the input data \"fully happens on-device\", and that the APIs \"send metrics about the performance and utilization of the APIs in your app to Google\". For more than one person in frame, start from [multi-person pose tracking](/motion/multi-person-pose-tracking).\n\n## When it fits\n\nOur reading: ML Kit suits an Android and iOS app that wants one person's skeleton without shipping and versioning a model file, and that can accept beta terms. If you need the model file itself or an open-source licence, MediaPipe Pose Landmarker outputs 33 landmarks at the same indices; its variants are compared in [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models).",
    "faqs": [
      {
        "q": "What is the difference between ML Kit's base and accurate pose detection SDKs?",
        "a": "Speed against coordinate accuracy, and size. Google's Android guide lists pose-detection at about 10.1 MB and about 30 FPS on a Pixel 3XL, and pose-detection-accurate at about 13.3 MB and about 23 FPS on CPU or 30 FPS on GPU. On iOS, PoseDetection is up to 29.6 MB at about 45 FPS on an iPhone X and PoseDetectionAccurate up to 33.2 MB at about 29 FPS. Google says the accurate SDK produces more accurate coordinate values at a slower frame rate."
      },
      {
        "q": "Can ML Kit pose detection track more than one person?",
        "a": "No. Google's overview says pose detection can only detect one person in an image, and that with two people in frame the model assigns landmarks to the person detected with the highest confidence. In STREAM_MODE it tracks the most prominent person across frames. For group scenes you need a multi-person model instead."
      },
      {
        "q": "Is the Z coordinate from ML Kit pose detection real depth?",
        "a": "No. Google calls it an experimental value measured in image pixels like X and Y that is not a true 3D value, with its origin approximately at the center between the hips, negative toward the camera and no fixed bound. The Android reference says it is less accurate than X and Y, and the iOS Swift reference says Z values for facial landmarks are not calculated and should be disregarded."
      },
      {
        "q": "What image resolution does ML Kit pose detection need?",
        "a": "Google's Android guide asks for images of at least 480x360 pixels and says the person should be represented by at least 256x256 pixels for best performance. For real-time use it suggests capturing at a lower resolution to cut latency while keeping to those minimums, and using the base SDK with STREAM_MODE."
      },
      {
        "q": "Why does ML Kit return pose landmarks outside the image?",
        "a": "Because it always returns all 33. When the person is not completely inside the image, Google's Android guide says the model assigns the missing landmarks coordinates outside the frame and gives them low in-frame likelihood values. Check getInFrameLikelihood, which runs from 0.0 to 1.0, before using a landmark."
      }
    ],
    "related": [
      {
        "href": "/pose-keypoints/ml-kit",
        "label": "ML Kit's 33 landmark constants"
      },
      {
        "href": "/motion/mediapipe-pose-landmarker-models",
        "label": "MediaPipe Pose Landmarker: Lite vs Full vs Heavy"
      },
      {
        "href": "/motion/pose-estimation-model-licenses",
        "label": "Pose model licences and ML Kit's terms"
      },
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "Pose estimation models compared"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "ML Kit's pose API is beta and can change without a deprecation policy. Subscribe and we will flag it when Google's guides or SDK versions move."
    },
    "sources": [
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection",
        "checked": "2026-10-17",
        "note": "Beta status, 33 landmarks, face required, one person, in-frame likelihood, base vs accurate SDK, the Z coordinate, and no meaning attached to landmarks."
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection/android",
        "checked": "2026-10-17",
        "note": "SDK names, sizes and Pixel 3XL speeds, API level 23, the 18.0.0-beta5 dependencies, detection modes, hardware configs, 480x360 and 256x256 guidance, and out-of-frame landmarks."
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection/ios",
        "checked": "2026-10-17",
        "note": "PoseDetection and PoseDetectionAccurate sizes and iPhone X speeds, pods at 8.0.0, Xcode 13.2.1, stream and singleImage modes."
      },
      {
        "url": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark",
        "checked": "2026-10-17",
        "note": "The 33 constants and their values, the in-frame likelihood range, the getPosition3D Z notes, and the RIGHT_EYE descriptions that say left."
      },
      {
        "url": "https://developers.google.com/ml-kit/reference/swift/mlkitposedetectioncommon/api/reference/Classes/PoseLandmark",
        "checked": "2026-10-17",
        "note": "Z values are less accurate than x and y, and facial landmark z-values are not calculated."
      },
      {
        "url": "https://developers.google.com/ml-kit/terms",
        "checked": "2026-10-17",
        "note": "Last modified May 14, 2025: input processing fully on-device, and the performance and utilization metrics the APIs send to Google."
      }
    ]
  },
  {
    "slug": "yolo-pose-models",
    "primaryQuery": "yolo pose models",
    "h1": "Ultralytics YOLO Pose Models: Sizes, Keypoint Output and Licence",
    "metaTitle": "Ultralytics YOLO Pose Models: Sizes, Output, AGPL",
    "metaDescription": "Ultralytics YOLO26 pose models n to x as Ultralytics publishes them: COCO keypoint mAP, speed and size, the keypoint tensor, export formats and AGPL-3.0.",
    "updated": "2026-10-17",
    "answer": "Ultralytics' pose task docs, read on October 17, 2026, present YOLO26 pose models in five sizes, n, s, m, l and x, pretrained on COCO keypoints at 640 pixels and predicting the 17 COCO keypoints for each person they detect. Ultralytics' own table runs from YOLO26n-pose at 57.2 mAP pose 50-95 with 2.9 M parameters to YOLO26x-pose at 71.6 with 57.6 M parameters. The code is AGPL-3.0, and Ultralytics sells an Enterprise License for products that cannot meet AGPL-3.0's open-source requirements.",
    "body": "Read [pose estimation model licenses](/motion/pose-estimation-model-licenses) alongside this page: in our reading, the AGPL-3.0 question settles more YOLO pose decisions than accuracy does; the multi-person engineering is in [multi-person pose tracking](/motion/multi-person-pose-tracking). What follows is what Ultralytics' repository says about its pose models, read on October 17, 2026. Every figure is Ultralytics' own.\n\n## The five sizes\n\n| Model | Input | mAP pose 50-95 (e2e) | mAP pose 50 (e2e) | CPU ONNX, ms | T4 TensorRT10, ms | Params, M | FLOPs, B |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| YOLO26n-pose | 640 | 57.2 | 83.3 | 40.3 ± 0.5 | 1.8 ± 0.0 | 2.9 | 7.6 |\n| YOLO26s-pose | 640 | 63.0 | 86.6 | 85.3 ± 0.9 | 2.7 ± 0.0 | 10.4 | 24.1 |\n| YOLO26m-pose | 640 | 68.8 | 89.6 | 218.0 ± 1.5 | 5.0 ± 0.1 | 21.5 | 73.3 |\n| YOLO26l-pose | 640 | 70.4 | 90.5 | 275.4 ± 2.4 | 6.5 ± 0.1 | 25.9 | 91.7 |\n| YOLO26x-pose | 640 | 71.6 | 91.6 | 565.4 ± 3.0 | 12.2 ± 0.2 | 57.6 | 202.3 |\n\nUltralytics says the mAP values are single-model, single-scale on COCO Keypoints val2017; that speed is averaged over COCO val images with ONNX on CPU and TensorRT10 on an NVIDIA T4 GPU; and that parameter and FLOP counts are for fused models with the unused detection branch removed, so pretrained checkpoints may show higher counts. None of these is a phone measurement. The pose models carry a `-pose` suffix, as in `yolo26n-pose.pt`, and the weights download automatically from Ultralytics' latest release on first use.\n\n## What a prediction returns\n\nEach image gives one `Results` object. Ultralytics' results table lists `result.keypoints.xy` as pixel keypoints and `result.keypoints.xyn` as normalized keypoints, both shaped (N, K, 2), and `result.keypoints.data` as \"x,y plus optional visibility/confidence\", shaped (N, K, 2 or 3). `result.boxes` holds the instance boxes those keypoints belong to. The training config `coco-pose.yaml` declares `kpt_shape: [17, 3]`, which its comment explains as the number of keypoints and the number of dimensions, \"2 for x,y or 3 for x,y,visible\".\n\nThe default models predict the 17 COCO keypoints, so index k is the COCO point at k, from 0 nose to 16 right_ankle. Ultralytics' docs list the order in title case (\"Left Eye\") and `coco-pose.yaml` in snake case (`left_eye`). The full table, and the other models that share it, are in [the COCO 17 keypoint map](/pose-keypoints/coco-17).\n\n## Export targets\n\nUltralytics' export table lists 23 formats, PyTorch included. For mobile and edge apps the relevant ones include ONNX, Core ML (`.mlpackage`), LiteRT (`.tflite`), NCNN, ExecuTorch, OpenVINO and TensorRT. The table notes that IMX500 export \"is currently only supported for YOLOv8n, YOLO11n models\".\n\n## Training on your own keypoints\n\nThe docs train YOLO26n-pose on the small COCO8-pose dataset as their example, convert existing COCO keypoint JSON with the `convert_coco` function and `use_keypoints=True`, and point to other keypoint datasets such as Tiger-Pose, Hand Keypoints and Dog-Pose. `coco-pose.yaml` shows what a dataset file declares: `kpt_shape`, a `flip_idx` list and `kpt_names`.\n\n## Licence\n\nThe ultralytics/ultralytics LICENSE is the GNU Affero General Public License, version 3. The README describes the Ultralytics Enterprise License as \"for development and production use\", covering \"business products and services, including internal tools, automated workflows, and production deployments, bypassing the open-source requirements of AGPL-3.0\". Section 13 of the AGPL and what it means for server-side inference are read in [pose estimation model licenses](/motion/pose-estimation-model-licenses).\n\n## When it fits\n\nOur reading: YOLO pose returns keypoints for every person it detects, in five sizes that trade speed for accuracy, which suits gym floors and group classes. Settle the AGPL-3.0 question before writing code, not after.",
    "faqs": [
      {
        "q": "What do the n, s, m, l and x YOLO pose model sizes trade off?",
        "a": "Accuracy against speed and size, on Ultralytics' own benchmark. Its table runs from YOLO26n-pose at 57.2 mAP pose 50-95, 40.3 ms on CPU with ONNX and 2.9 M parameters, to YOLO26x-pose at 71.6 mAP, 565.4 ms and 57.6 M parameters, all at 640 pixels on COCO Keypoints val2017. On an NVIDIA T4 with TensorRT10 the range is 1.8 to 12.2 ms. None of these figures was measured on a phone."
      },
      {
        "q": "Does Ultralytics YOLO pose return keypoints for every person in the image?",
        "a": "Yes, one set per detected instance. Ultralytics documents result.keypoints with the shape (N, K, 2 or 3), N instances of K keypoints, alongside result.boxes, the instance boxes those keypoints belong to. The training config's only class is person, so each instance is a person with 17 COCO keypoints in the default models."
      },
      {
        "q": "What is the third value in a YOLO pose keypoint?",
        "a": "Visibility or confidence, where the model provides it. coco-pose.yaml declares kpt_shape as 17 keypoints by 3 dimensions and explains the second number as 2 for x,y or 3 for x,y,visible, and Ultralytics' results table describes keypoints.data as x,y plus optional visibility/confidence. keypoints.xy and keypoints.xyn carry only the two coordinates, in pixels and normalized."
      },
      {
        "q": "Can a YOLO pose model be exported to Core ML or TensorFlow Lite?",
        "a": "Yes, according to Ultralytics' export table: format coreml writes a .mlpackage and format litert writes a .tflite file, alongside ONNX, NCNN, ExecuTorch, OpenVINO, TensorRT and others, 23 formats counting PyTorch itself. Exporting does not change the licence; AGPL-3.0 or an Enterprise License still applies to what you ship."
      }
    ],
    "related": [
      {
        "href": "/pose-keypoints/coco-17",
        "label": "The COCO 17 keypoint order"
      },
      {
        "href": "/motion/pose-estimation-model-licenses",
        "label": "Pose model licences, AGPL included"
      },
      {
        "href": "/motion/multi-person-pose-tracking",
        "label": "Multi-person pose tracking"
      },
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "Pose estimation models compared"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Ultralytics renames and re-benchmarks its pose models often. Subscribe and we will flag it when the published table or licence terms change."
    },
    "sources": [
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/docs/en/tasks/pose.md",
        "checked": "2026-10-17",
        "note": "YOLO26 pose models, the -pose suffix, COCO keypoints pretraining, benchmark conditions, automatic download, Results fields, the keypoint index map, training and COCO conversion."
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/docs/macros/yolo-pose-perf.md",
        "checked": "2026-10-17",
        "note": "The five-model table: input size, mAP, CPU ONNX and T4 TensorRT10 speed, parameters and FLOPs."
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/docs/macros/export-table.md",
        "checked": "2026-10-17",
        "note": "The 23 export formats and the IMX500 note."
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/datasets/coco-pose.yaml",
        "checked": "2026-10-17",
        "note": "kpt_shape [17, 3] and its comment, flip_idx, the person class and kpt_names."
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/LICENSE",
        "checked": "2026-10-17",
        "note": "GNU Affero General Public License, version 3."
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/README.md",
        "checked": "2026-10-17",
        "note": "The AGPL-3.0 route and the Ultralytics Enterprise License."
      }
    ]
  },
  {
    "slug": "rtmpose-models",
    "primaryQuery": "rtmpose",
    "h1": "RTMPose (MMPose): Model Sizes, Keypoint Sets and Deployment",
    "metaTitle": "RTMPose Models: Sizes, Keypoint Sets and Deployment",
    "metaDescription": "RTMPose from OpenMMLab's MMPose: t to x sizes and speeds as its README reports them, the 17, 26 and 133-keypoint sets, ONNX, TensorRT and ncnn, Apache-2.0.",
    "updated": "2026-10-17",
    "answer": "RTMPose is the real-time pose estimation project in OpenMMLab's MMPose repository, released in March 2023, with body models in sizes from t to x. Its README reports RTMPose-m at 75.8% AP on COCO with 90+ FPS on an Intel i7-11700 CPU and 430+ FPS on a GTX 1660 Ti, and RTMPose-s at 72.2% AP with 70+ FPS on a Snapdragon 865, all its own measurements. Models come in 17-keypoint COCO, 26-keypoint Halpe26 and 133-keypoint COCO-WholeBody sets and deploy through ONNX, TensorRT, ncnn and OpenVINO; the MMPose code is Apache-2.0, and the files we read state no separate terms for the pretrained weights.",
    "body": "RTMPose ships one model family in several keypoint sets, with its own deployment toolchain. Model choice in general is in [pose estimation models compared](/motion/pose-estimation-models-compared) and licences in [pose estimation model licenses](/motion/pose-estimation-model-licenses). Everything below is from the RTMPose README and MMPose's dataset files, read on October 17, 2026; the speed and accuracy figures are the README's own.\n\n## Sizes and the README's figures\n\n| Model | AP on COCO | CPU FPS | GPU FPS |\n| --- | --- | --- | --- |\n| RTMPose-t | 68.5 | 300+ | 940+ |\n| RTMPose-s | 72.2 | 200+ | 710+ |\n| RTMPose-m | 75.8 | 90+ | 430+ |\n| RTMPose-l | 76.5 | 50+ | 280+ |\n| RTMPose-l at 384 | 78.3 | Not given | 160+ |\n\nThe README's abstract names the hardware behind the RTMPose-m figures, an Intel i7-11700 CPU and an NVIDIA GTX 1660 Ti GPU, and reports RTMPose-s at 72.2% AP with 70+ FPS \"on a Snapdragon 865 chip\" after deploying to a mobile device. Its model zoo notes add a caution worth repeating: because the models are trained on multi-domain combined datasets, \"results are not suitable for academic comparison\". A larger RTMPose-x appears in the model zoo tables too.\n\n## Keypoint sets\n\n- **17 keypoints**, which the README says \"are defined as COCO\": the same order MoveNet and YOLO pose use. See [the COCO 17 keypoint map](/pose-keypoints/coco-17).\n- **26 keypoints**, defined as Halpe26: COCO's 17 names plus head, neck, hip and six foot points. See [the Halpe26 keypoint map](/pose-keypoints/halpe-26).\n- **133 keypoints**, defined as COCO-WholeBody: body, feet, 68 face points and both hands, the set behind the README's RTMPose, RTMW and DWPose-distilled wholebody models. See [the COCO-WholeBody keypoint map](/pose-keypoints/coco-wholebody-133).\n\nThe README also lists face (106 keypoints, LaPa), hand (21 keypoints) and animal (17 keypoints, AP-10K) models, outside this site's scope.\n\n## How it runs\n\nThe README pairs each pose model with a person detector, RTMDet, in its pipeline table, and its PyTorch demo script is `topdown_demo_with_mmdet.py`, so a full pipeline is a detector plus a pose model. It lists several ways to run it:\n\n- **rtmlib**, which supports OpenCV, ONNX Runtime and OpenVINO inference, \"does not require Pytorch or MMCV\", runs on CPU or GPU, downloads ONNX models from the OpenMMLab model zoo, and supports RTMPose, DWPose, RTMO and RTMW.\n- **ONNX Runtime examples** in Python, without MMCV.\n- **The pre-compiled MMDeploy SDK**, which the README recommends as \"6-10 times faster\", with exported ONNX, TensorRT and ncnn models, a pipeline API for Python, C++, C# and Java, and Android examples on the ncnn backend.\n\nThe README notes that PyTorch inference \"can not reach the maximum speed of RTMPose, just for verification\". Its abstract lists the platforms MMDeploy covers as CPU, GPU, NVIDIA Jetson and mobile devices.\n\n## Licence\n\nThe open-mmlab/mmpose LICENSE opens \"Copyright 2018-2020 Open-MMLab. All rights reserved.\" and continues with the Apache License, Version 2.0. The README links checkpoints on download.openmmlab.com, and we found no separate terms for those weights in the files we read, so check before shipping a checkpoint. What Apache-2.0 asks of you is in [pose estimation model licenses](/motion/pose-estimation-model-licenses).\n\n## When it fits\n\nOur reading: RTMPose suits a team that wants an Apache-2.0 codebase, needs foot or hand points beyond COCO's 17, or deploys to its own server or edge hardware through ONNX, TensorRT or ncnn, and is willing to run a person detector alongside the pose model.",
    "faqs": [
      {
        "q": "Which keypoint sets do RTMPose models come in?",
        "a": "Three body sets, per the RTMPose README: 17 keypoints defined as COCO, 26 keypoints defined as Halpe26, and 133 keypoints defined as COCO-WholeBody, which covers the RTMPose, RTMW and DWPose-distilled wholebody models. Each section points to its MMPose meta info file: coco.py, halpe26.py and coco_wholebody.py. The README also lists face, hand and animal models with their own keypoint sets."
      },
      {
        "q": "Does RTMPose need a separate person detector?",
        "a": "In the pipelines its README documents, yes. The pipeline performance table pairs each RTMPose model with an RTMDet person detector, and the PyTorch demo is topdown_demo_with_mmdet.py, which takes a detector config and a pose config. The README's notes say pipeline latency was tested with person detection run every 5 frames by default."
      },
      {
        "q": "Can RTMPose run without PyTorch?",
        "a": "Yes. The RTMPose README lists rtmlib, which runs RTMPose, DWPose, RTMO and RTMW models with OpenCV, ONNX Runtime or OpenVINO and does not require PyTorch or MMCV, plus Python ONNX Runtime examples without MMCV and the pre-compiled MMDeploy SDK with exported ONNX, TensorRT and ncnn models. The README says PyTorch inference is for verification and cannot reach RTMPose's maximum speed."
      },
      {
        "q": "How fast is RTMPose on a mobile chip?",
        "a": "The RTMPose README reports RTMPose-s at 72.2% AP on COCO with 70+ FPS on a Snapdragon 865 chip, measured by the project itself after deploying to a mobile device, and its body model tables list ncnn FP16 latency on the same chip. Treat these as the authors' figures and measure on your own target phones."
      }
    ],
    "related": [
      {
        "href": "/pose-keypoints/halpe-26",
        "label": "The Halpe26 keypoint order"
      },
      {
        "href": "/pose-keypoints/coco-wholebody-133",
        "label": "All 133 COCO-WholeBody keypoints"
      },
      {
        "href": "/motion/pose-estimation-model-licenses",
        "label": "Pose model licences"
      },
      {
        "href": "/motion/on-device-vs-cloud-pose-estimation",
        "label": "On-device vs cloud pose estimation"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Get our developer notes on open pose models, including new RTMPose releases and changes to OpenMMLab's checkpoints."
    },
    "sources": [
      {
        "url": "https://github.com/open-mmlab/mmpose/blob/main/projects/rtmpose/README.md",
        "checked": "2026-10-17",
        "note": "Release date, the abstract's speed and accuracy figures, model sizes, keypoint sets, the model zoo caveat, the RTMDet pipeline, rtmlib, the MMDeploy SDK, backends, platforms and SDK languages."
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/halpe26.py",
        "checked": "2026-10-17",
        "note": "Halpe26's 26 keypoint names in order."
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/coco_wholebody.py",
        "checked": "2026-10-17",
        "note": "COCO-WholeBody's 133 keypoint names in order."
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/blob/main/LICENSE",
        "checked": "2026-10-17",
        "note": "The Open-MMLab copyright line and the Apache License, Version 2.0."
      }
    ]
  },
  {
    "slug": "openpose-models",
    "primaryQuery": "openpose model",
    "h1": "OpenPose Models: BODY_25 vs COCO, Output Format and Licence",
    "metaTitle": "OpenPose Models: BODY_25 vs COCO, Output and Licence",
    "metaDescription": "CMU's OpenPose: the BODY_25 and COCO body models, hand and face keypoints, the JSON output layout, CPU and GPU builds, and its noncommercial licence.",
    "updated": "2026-10-17",
    "answer": "OpenPose is Carnegie Mellon University's real-time multi-person keypoint detector; its README describes body and foot estimation with 15, 18 or 25 keypoints, 2x21 hand keypoints and 70 face keypoints. Its output document describes two body formats, BODY_25 and COCO, and the source lists their 25 and 18 body parts, BODY_25 adding a mid-hip and six foot points to COCO's names. It runs as CUDA, OpenCL or CPU-only builds on Ubuntu, Windows and macOS, and its licence allows noncommercial research use only.",
    "body": "This page covers what CMU's OpenPose repository says about its models and output, read on October 17, 2026. The licence is read in full in [pose estimation model licenses](/motion/pose-estimation-model-licenses), and the multi-person alternatives are in [multi-person pose tracking](/motion/multi-person-pose-tracking).\n\n## Body models\n\nOpenPose's output document shows how to read the body-part order of any model from its C++ API, naming `BODY_25`, `COCO_18`, `MPI_15`, `BODY_25B` and `BODY_135`. Two have output-format diagrams in that document, and their orders, read from `poseParameters.cpp`, are:\n\n- **BODY_25**: 25 body parts, from 0 Nose to 24 RHeel. See [the BODY_25 keypoint map](/pose-keypoints/openpose-body-25).\n- **COCO** (`PoseModel::COCO_18`): 18 body parts, from 0 Nose to 17 LEar. See [the OpenPose COCO 18 keypoint map](/pose-keypoints/openpose-coco-18).\n\nBODY_25 contains every COCO 18 name plus MidHip and six foot points (LBigToe, LSmallToe, LHeel, RBigToe, RSmallToe, RHeel), and the shared names sit at different indices after index 7: RHip is 9 in BODY_25 and 8 in COCO 18. Each map ends with a Background entry, which the source excludes from the part count. OpenPose's COCO 18 is not the 17-keypoint COCO order MoveNet and YOLO pose use: it adds Neck at index 1 and spells sides as R and L, so [the crosswalk](/pose-keypoints#crosswalk) does not join its points to COCO 17's.\n\nThe README's headline figure is 135 keypoints in total for body, hand, face and foot together, and the C++ API names a BODY_135 model.\n\n## Output format\n\nWith `--write_json`, OpenPose writes one JSON file per frame with a `people` array. Each person's `pose_keypoints_2d` holds body part locations and detection confidence \"formatted as x0,y0,c0,x1,y1,c1,...\", in the model's body-part order. The `--keypoint_scale` flag sets the coordinate range, for example 0 to 1, -1 to 1, or source or output pixels, and the confidence runs from 0 to 1. Face and hand keypoints come in matching `face_keypoints_2d`, `hand_left_keypoints_2d` and `hand_right_keypoints_2d` arrays, and the 3D fields stay empty unless `--3d` is enabled.\n\n## Platforms\n\nThe README lists Ubuntu 20, 18, 16 and 14, Windows 10 and 8, Mac OSX and the Nvidia TX2, with CUDA (Nvidia GPU), OpenCL (AMD GPU) and CPU-only builds, a command-line demo, C++ and Python APIs, and a portable Windows demo. It documents single-person 3D keypoint detection by triangulation from multiple views with Flir cameras, and says body runtime is invariant to the number of people detected while hand and face runtime depends on it.\n\n## Licence\n\nThe LICENSE is headed \"ACADEMIC OR NON-PROFIT ORGANIZATION NONCOMMERCIAL RESEARCH USE ONLY\" and grants a license \"to use the Software for noncommercial research purposes\". The README says OpenPose \"is freely available for free non-commercial use\" and points commercial users to a FlintBox link. In our reading, a commercial fitness app needs that separate licence; the details are in [pose estimation model licenses](/motion/pose-estimation-model-licenses).\n\n## When it fits\n\nOur reading: OpenPose fits research and prototypes that want body, hands and face from one system, or that must emit BODY_25 for tools that expect it. For a commercial product the licence usually decides against it before the engineering does; [multi-person pose tracking](/motion/multi-person-pose-tracking) covers the alternatives.",
    "faqs": [
      {
        "q": "What is the difference between OpenPose's BODY_25 and COCO body models?",
        "a": "Seven points and the numbering. OpenPose's poseParameters.cpp lists 25 body parts for BODY_25 and 18 for COCO; BODY_25 has every COCO name plus MidHip at index 8 and six foot points at 19 to 24. Indices 0 to 7 match, from Nose to LWrist, but the rest shift: RHip is 9 in BODY_25 and 8 in COCO. Both maps end with a Background entry that is not counted as a body part."
      },
      {
        "q": "How is OpenPose's JSON keypoint output laid out?",
        "a": "One file per frame with a people array, per OpenPose's output document. Each person's pose_keypoints_2d is a flat list of x, y and confidence for every body part in the model's order, so body part i starts at position 3i. The --keypoint_scale flag chooses the coordinate range, the confidence runs from 0 to 1, and face and hands have their own arrays."
      },
      {
        "q": "Does OpenPose need an NVIDIA GPU?",
        "a": "No. The OpenPose README lists CUDA builds for Nvidia GPUs, OpenCL builds for AMD GPUs and non-GPU, CPU-only builds, on Ubuntu, Windows, Mac OSX and the Nvidia TX2. The README does not give speed figures for each build in the files we read, so measure the one you plan to ship on."
      },
      {
        "q": "Can OpenPose estimate 3D poses?",
        "a": "Only in a multi-camera setup. The OpenPose README documents 3D real-time single-person keypoint detection by triangulation from multiple single views, with synchronization of Flir cameras handled; its 3D JSON fields stay empty unless the --3d flag is enabled. From one ordinary camera it outputs 2D keypoints."
      }
    ],
    "related": [
      {
        "href": "/pose-keypoints/openpose-body-25",
        "label": "OpenPose BODY_25 keypoint order"
      },
      {
        "href": "/pose-keypoints/openpose-coco-18",
        "label": "OpenPose COCO 18 keypoint order"
      },
      {
        "href": "/motion/pose-estimation-model-licenses",
        "label": "Pose model licences, OpenPose included"
      },
      {
        "href": "/motion/multi-person-pose-tracking",
        "label": "Multi-person pose tracking"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Get our developer notes on pose models and their licences, including any change to OpenPose's terms or repository."
    },
    "sources": [
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/README.md",
        "checked": "2026-10-17",
        "note": "Body/foot, hand and face keypoint counts, the 135-keypoint headline, 3D triangulation, OS and hardware support, APIs, and the non-commercial and FlintBox licensing text."
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/doc/02_output.md",
        "checked": "2026-10-17",
        "note": "BODY_25 and COCO output formats, the JSON layout and --keypoint_scale, the 3D fields, and the PoseModel names."
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/src/openpose/pose/poseParameters.cpp",
        "checked": "2026-10-17",
        "note": "POSE_BODY_25_BODY_PARTS and POSE_COCO_BODY_PARTS, the Background entries and POSE_NUMBER_BODY_PARTS."
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/LICENSE",
        "checked": "2026-10-17",
        "note": "The noncommercial research heading and grant."
      }
    ]
  },
  {
    "slug": "squat-detection-pose-estimation",
    "primaryQuery": "squat detection pose estimation",
    "h1": "Squat Detection With Pose Estimation: Landmarks, Camera, Rep Logic",
    "metaTitle": "Squat Detection with Pose Estimation: Camera and Reps",
    "metaDescription": "Squat counting from a camera, by the studies: knee and hip landmarks, phone placement that worked, rep thresholds to calibrate, and the accuracy measured.",
    "updated": "2026-10-18",
    "answer": "A camera squat counter reads the knee angle from the hip, knee and ankle landmarks, usually alongside the hip angle, and counts a repetition when that angle drops past a bottom threshold and climbs back past a top one. Placement matters as much as the model: in a 2026 study that filmed 22 adults from 12 phone positions, one phone pipeline counted 95.5% of squat repetitions correctly from a diagonal view at 200 cm and none from the side at 90 cm. Treat every threshold here as a study's starting point, to calibrate for your own camera, model and users.",
    "body": "This page is the squat-specific layer under [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works): which landmarks to read, where the camera went in the studies, how to structure the rep logic, and what the studies measured. We read them on October 18, 2026. Each number is one study's result under that study's conditions, so use it as a starting point to calibrate for your camera, model and users. This is engineering guidance for building a tracker, not exercise or medical advice.\n\n## The studies behind this page\n\n- **Oliosi and colleagues** (JMIR mHealth and uHealth, 2026) filmed 22 healthy university students doing squats from 12 phone positions and scored the repetition counts of a pipeline built for the Dotmoovs mobile platform against two raters.\n- **Sousa and colleagues** (Journal of Functional Morphology and Kinesiology, 2026) counted repetitions of 12 exercises, squats among them, with angle-threshold state machines on [MediaPipe](/motion/mediapipe-pose-landmarker-models)'s 33 landmarks.\n- **Iizuka and colleagues** (Frontiers in Sports and Active Living, 2026) compared hip and knee angles from [MoveNet](/motion/movenet-models) Lightning, running in a web browser, against a six-camera marker system in 30 healthy adult males.\n- **Gu and colleagues** (Sensors, 2026) recorded 10 participants doing push-ups, sit-ups and squats from the side, the front and behind, and report how often their camera branch recognised each exercise from each view.\n\n## Landmarks and angles\n\nTwo angles carry a squat: the knee angle, at the knee between the hip and the ankle, and the hip angle, at the hip between the shoulder and the knee. Every keypoint scheme on this site has those six points, so any common pose model can produce the counting signal. Sousa and colleagues compute each angle from three MediaPipe landmarks, and they describe the results as approximate kinematic indicators rather than precise biomechanical measurements.\n\nThe schemes differ at the foot. [BlazePose 33](/pose-keypoints/blazepose-33), the MediaPipe Pose Landmarker's map, and [ML Kit's 33 landmarks](/pose-keypoints/ml-kit) include a heel and a foot-index point on each side; [Halpe26](/pose-keypoints/halpe-26) and [OpenPose BODY_25](/pose-keypoints/openpose-body-25) include heels and toes; [COCO 17](/pose-keypoints/coco-17), the output of MoveNet and YOLO pose, and [Apple Vision's 2D joints](/pose-keypoints/apple-vision-2d) stop at the ankle. A heel-lift check or an ankle angle needs one of the first four.\n\nAngle conventions differ as well. Iizuka and colleagues express depth as flexion: their on-screen target was 120° of hip and knee flexion. Sousa and colleagues' example squat starts with the knee angle above 160, which in our reading only works if a straight leg reads near 180. Check which convention a number uses before you copy it. Iizuka and colleagues also computed angles with the four-quadrant arctangent (atan2) instead of an inverse cosine, to keep the angle continuous near full extension.\n\n## Where to put the camera\n\nOliosi and colleagues recorded 1080p video at 30 frames per second with the phone on the floor at 0° (front), 45° (diagonal) or 90° (side) to the participant, and 90, 180, 200 or 360 cm away. For squats, diagonal and front views beat side views at every distance. The best squat setup was diagonal at 200 cm, with 95.5% of repetitions counted correctly and a mean absolute error of 0.05 repetitions; the worst was side-on at 90 cm, with 0% and an error of 5 repetitions. Their summary is that diagonal and frontal views at mid-range distances of 180 to 200 cm gave the highest detection accuracy and counting precision.\n\nIizuka and colleagues, who measured angles rather than counts, did the opposite: a laptop webcam 2.00 m to the participant's right for a sagittal view, at about 0.975 m, the average height of the greater trochanter, to limit perspective distortion at the hip and knee. Participants kept their arms crossed over the chest so the arms would not hide keypoints.\n\nIn our reading the two results do not conflict. A side view keeps the hip and knee angles in the image plane, which an angle measurement needs, while counting in Oliosi and colleagues' pipeline worked better from the diagonal and the front. Decide which job your feature does, then test both placements with your own users.\n\n## A rep state machine for squats\n\nBoth counting studies count state changes rather than raw peaks. Oliosi and colleagues' pipeline labels every frame with a movement state such as squat-down, squat-up or other, and a Markov-chain step counts a repetition when it sees a set sequence such as up, down, up. Sousa and colleagues model the squat as standing, descending and ascending phases. Their example definition, with every value marked as an adjustable default, starts at `knee_angle > 160` and `hip_angle > 160` and enters the descent at `knee_angle < 100` and `hip_angle < 150`.\n\nThe gap between the top threshold and the bottom one is the hysteresis described in [how rep counting works](/motion/how-rep-counting-works): an angle jittering around either boundary cannot complete a cycle by itself. Sousa and colleagues also hold the last valid phase for a few frames, typically 3 to 5, when no phase matches, so a dropped or noisy frame does not reset the cycle; they report that this removed nearly all spurious resets. Gu and colleagues cut the camera's vote when mean keypoint confidence fell below 0.45, and call that a fixed engineering setting rather than an optimised value. A minimum phase duration is the same idea from the other side: in our view, require each phase to hold for a few frames before the machine accepts it, and tune the frame count on your own recordings.\n\n## Failure modes the studies report\n\n- **Bending hides landmarks.** Sousa and colleagues saw key body parts occluded particularly in squats and deadlifts, more so at greater distances. Their squat error table lists one cause, missed bottom positions, 26 times, against 572 annotated squat repetitions.\n- **Clothing that blends in.** In the same study, dark clothing against a similar background caused joint misalignment and pose errors.\n- **Projection in 2D.** Iizuka and colleagues measured a systematic underestimate from the side-view webcam, −11.2° at the hip and −10.6° at the knee against the marker system, and explain it with the pinhole camera model: a thigh rotating out of the image plane is foreshortened, so the knee angle is underestimated more as the squat gets deeper. [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation) covers what estimated depth can and cannot recover.\n- **Viewpoint and self-occlusion.** Gu and colleagues' camera branch recognised squat frames 99.2% of the time from the side, 86.6% from the front and 66.2% from behind. From behind, most failures were frames the pipeline rejected rather than frames given the wrong exercise. Recognising which exercise is under way is a different task from counting it, which is one reason this side-view result does not contradict Oliosi and colleagues' counts.\n\nThe general versions of these problems, from lighting to loose clothing, are covered in [pose estimation accuracy](/motion/pose-estimation-accuracy).\n\n## What was measured, and why it will not transfer\n\n- Across all 12 setups, Oliosi and colleagues' squat counts reached a mean detection rate of 61.5% with a mean absolute error of 1.11 repetitions. The reference was two trained raters, an exercise physiologist and a physical therapist; the participants were healthy university students in a laboratory with standardised lighting, and the authors caution that the findings may not generalise to other pose models, populations or unstructured settings.\n- Sousa and colleagues report 95% accuracy for squats (95% confidence interval 92.7 to 97.4%), comparing automated counts with manually annotated repetitions from their own recordings, public pose datasets and competition footage.\n- Iizuka and colleagues' linear correction, validated leave-one-subject-out, cut root mean square error from 11.6° to 4.0° at the hip and from 10.9° to 3.9° at the knee, and the authors tie that result to a standardised camera distance and orientation.\n\nNone of these numbers carries over by itself: each describes one pipeline, one camera geometry and one group of people. Re-measure with your own model, phones and users; [testing a rep counting algorithm](/test/rep-counting) covers how to build that test set.",
    "faqs": [
      {
        "q": "Where should the phone go to count squats?",
        "a": "In Oliosi and colleagues' 2026 study, diagonal (45°) and front views beat side views at every distance, and the best squat result came from a diagonal view at 200 cm. Side-on at 90 cm, the pipeline counted no repetitions correctly. If you need clean hip and knee angles rather than counts, Iizuka and colleagues filmed from the side at 2.00 m with the camera near hip height, so test both placements for your own feature."
      },
      {
        "q": "Which pose landmarks does a squat counter need?",
        "a": "Hip, knee and ankle for the knee angle, and shoulder, hip and knee for the hip angle; every keypoint scheme on this site has all of them. Heel and toe points exist only in some schemes, including BlazePose 33, ML Kit, Halpe26 and OpenPose BODY_25, so a heel-lift check needs one of those, while COCO 17 models such as MoveNet and YOLO pose stop at the ankle."
      },
      {
        "q": "What knee angle should count as the bottom of a squat?",
        "a": "No study we read gives a universal number. Sousa and colleagues' example squat enters the descent below a knee angle of 100 and a hip angle of 150, after a standing phase above 160, and marks each value as an adjustable default. Start there, calibrate per camera, model and user, and check whether a paper reports included angles or flexion angles before you copy its numbers."
      },
      {
        "q": "How accurate is camera-based squat counting?",
        "a": "It depends on the setup. One phone pipeline averaged a 61.5% detection rate across 12 phone positions and reached 95.5% from its best one; a MediaPipe state-machine counter scored 95% against manually annotated squats. Neither figure transfers to another model, camera or population until you measure it there."
      }
    ],
    "related": [
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/pose-keypoints/blazepose-33",
        "label": "BlazePose 33 keypoint map"
      },
      {
        "href": "/motion/push-up-counter-computer-vision",
        "label": "Push-up counting from a camera"
      },
      {
        "href": "/motion/deadlift-pose-estimation",
        "label": "Deadlift tracking from a camera"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Building a squat counter? Get our developer notes on camera rep counting, with the studies behind every threshold."
    },
    "sources": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12978916/",
        "checked": "2026-10-18",
        "note": "Oliosi et al., JMIR mHealth and uHealth 2026: phone placement, the counting pipeline, detection rate and error for squats (full text read as Europe PMC's XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13204307/",
        "checked": "2026-10-18",
        "note": "Sousa et al., J Funct Morphol Kinesiol 2026: squat states, default thresholds, phase persistence, accuracy and error causes (read as Europe PMC's XML)."
      },
      {
        "url": "https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2026.1831625/full",
        "checked": "2026-10-18",
        "note": "Iizuka et al., Front Sports Act Living 2026: side-view webcam setup, angle bias and corrected error."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13611031/",
        "checked": "2026-10-18",
        "note": "Gu et al., Sensors 2026: recognition by camera view and the 0.45 confidence gate (read as NCBI's efetch XML)."
      }
    ]
  },
  {
    "slug": "push-up-counter-computer-vision",
    "primaryQuery": "push up counter computer vision",
    "h1": "Push-Up Counter With Computer Vision: Landmarks, Camera, Rep Logic",
    "metaTitle": "Push-Up Counter with Computer Vision: Camera and Reps",
    "metaDescription": "Counting push-ups from a camera, per the studies: elbow and body-line landmarks, the phone angle that worked, rep thresholds to calibrate and accuracy.",
    "updated": "2026-10-18",
    "answer": "A camera push-up counter tracks the elbow angle from the shoulder, elbow and wrist landmarks, checks that the body stays in a straight line, and counts a repetition when the elbow bends past a low threshold and straightens past a high one. Camera angle matters: in a 2026 study that filmed 22 adults from 12 phone positions, one phone pipeline counted up to 85.7% of push-ups correctly from a diagonal view at 90 to 180 cm and 20% from the front at 360 cm. Thresholds from studies, such as a 140-degree elbow angle for the top position, are starting points to calibrate for your camera, model and users.",
    "body": "This page is the push-up layer under [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works): the landmarks, camera placement, rep logic and measured accuracy that the studies we read on October 18, 2026 report. Each number is one study's result under that study's conditions, so use it as a starting point to calibrate for your camera, model and users. This is engineering guidance for building a tracker, not exercise or medical advice.\n\n## The studies behind this page\n\n- **Oliosi and colleagues** (JMIR mHealth and uHealth, 2026) filmed 22 healthy university students doing push-ups from 12 phone positions and scored the counts of a pipeline built for the Dotmoovs mobile platform against two raters. Men did push-ups in a standard plank position and women could use a knee-supported variation.\n- **Lei and colleagues** (Sensors, 2025) built a fixed-camera assessment system on [MediaPipe](/motion/mediapipe-pose-landmarker-models)'s BlazePose landmarks with state machines for pull-ups, push-ups and sit-ups, and tested its counts against human assessors.\n- **Sousa and colleagues** (Journal of Functional Morphology and Kinesiology, 2026) counted push-ups among 12 exercises with angle-threshold state machines on MediaPipe landmarks.\n- **Gu and colleagues** (Sensors, 2026) recorded push-ups, sit-ups and squats from the side, the front and behind, and report how often their camera branch recognised each exercise from each view.\n\n## Landmarks and angles\n\nThe counting signal is the elbow angle, at the elbow between the shoulder and the hand. Lei and colleagues define three angles: the elbow angle from shoulder, elbow and hand; a hip angle from foot, hip and shoulder, to keep the body straight; and a torso angle from shoulder, foot and hand, for how low the body is. They add one height test: entering the bottom position requires the mouth to drop below the minimum shoulder height seen during the set. Sousa and colleagues likewise verify that the body remains extended in a horizontal alignment throughout the movement.\n\nEvery scheme on this site has shoulders, elbows, wrists, hips and ankles. Hand and foot points beyond the wrist and ankle are another matter: [BlazePose 33](/pose-keypoints/blazepose-33) and [ML Kit](/pose-keypoints/ml-kit) have pinky, index, thumb, heel and foot-index points, while [COCO 17](/pose-keypoints/coco-17) models such as [MoveNet](/motion/movenet-models) and [YOLO pose](/motion/yolo-pose-models) end at the wrist and ankle. In our reading, a COCO 17 build would use the wrist and ankle in their place and should expect slightly different angles, so re-tune any threshold you borrow.\n\n## Where to put the camera\n\nIn Oliosi and colleagues' study the best push-up views were diagonal at 90 to 180 cm, with up to 85.7% of repetitions counted correctly and a mean absolute error of 0.28, and the worst was frontal at 360 cm, at 20% and 2.70. Their conclusion for push-ups is that diagonal views are preferred, and they put the difference from squats down to posture, horizontal for push-ups and upright for squats. They chose push-ups partly for their typical self-occlusion, the torso hiding the limbs.\n\nGu and colleagues' camera branch recognised push-up frames 100.0% of the time from the side and 93.2% from the front, but from behind it rejected all 1000 push-up frames, which the authors attribute to keypoints occluded by the trunk or the ground. Lei and colleagues dedicate one camera to each person and recommend one camera per person when several people are tested at once.\n\n## A rep state machine for push-ups\n\nLei and colleagues' push-up machine has a high support state, a low support state, transition states between them and a misaligned state. A repetition counts only when the machine passes from the low position through the transition to the high position, and any non-compliant posture sends it to the misaligned state. Their thresholds, each described as an empirical or adjustable setting, were an elbow angle of 140 degrees for the high position, a maximum torso-to-ground angle of 15 degrees in the low position, and a waist angle of 140 degrees to keep the body straight.\n\nSousa and colleagues' push-up has three phases: a plank start with the elbows extended, lowering as the elbows bend past a threshold, and pushing as they re-extend. As with any two-threshold design, the gap between the bend and the re-extension threshold is the hysteresis described in [how rep counting works](/motion/how-rep-counting-works).\n\nLei and colleagues also clean the keypoints before the state machine sees them. Sudden jumps, which they call flying points, are corrected when a keypoint moves more than 1/30 of the frame width or height between frames, and coordinates are then smoothed over a 10-frame window. Both values were chosen from their own tests, so treat them as a starting point. Sousa and colleagues hold the last valid phase for typically 3 to 5 frames when no phase matches, which in our view is also a cheap minimum-duration rule.\n\n## Failure modes the studies report\n\n- **Floor-level poses are hard for pose models.** Oliosi and colleagues note that floor-based exercises such as push-ups stayed challenging even after training on several public datasets. In a 2026 benchmark of 19 monocular 3D reconstruction methods on three test subjects, Fieraru and Goedemé found the hardest exercises were dynamic, ground-level and inverted poses with heavy self-occlusion, with mean errors of 118 to 155 mm against about 67 mm for upright exercises such as standing dumbbell curls.\n- **The chest and arms.** Sousa and colleagues' push-up errors were three chest-proximity failures and one arm occlusion.\n- **Flying points under occlusion or poor light.** Lei and colleagues saw keypoints jump when occlusion occurred or lighting was poor, which is what their correction step targets.\n- **A camera behind the person.** Gu and colleagues' posterior view rejected every push-up frame.\n- **Moving the camera.** Lei and colleagues say their calibration-free 2D design is potentially vulnerable to large changes in viewing perspective or camera position.\n\nThe general causes, from lighting to clothing, are in [pose estimation accuracy](/motion/pose-estimation-accuracy).\n\n## What was measured, and why it will not transfer\n\n- Across all 12 setups, Oliosi and colleagues' push-up counts reached a mean detection rate of 61.1% with a mean absolute error of 1.08 repetitions, against two raters, with healthy university students in a laboratory with standardised lighting.\n- Lei and colleagues report 97.4% accuracy for push-ups, defined as correctly recognised repetitions over the actual repetitions recorded by human assessors, from five test groups who performed freely to their maximum.\n- Sousa and colleagues' per-exercise counting accuracies ranged from 95 to 100% across their 12 exercises.\n\nEach figure describes one pipeline, camera setup and group of people, and the studies define accuracy differently, so none of them predicts your app's accuracy. Measure your own; [testing a rep counting algorithm](/test/rep-counting) covers how.",
    "faqs": [
      {
        "q": "Where should the camera go to count push-ups?",
        "a": "In Oliosi and colleagues' 2026 study, diagonal views at 90 to 180 cm counted push-ups best and a frontal view at 360 cm worst, and the authors conclude that diagonal views are preferred for push-ups. Gu and colleagues found a camera behind the person failed completely, because the trunk and floor hide the keypoints. Test a diagonal and a side placement with your own users before you fix one in the app."
      },
      {
        "q": "What elbow angle marks the top of a push-up?",
        "a": "Lei and colleagues used 140 degrees as an empirical, adjustable elbow-angle threshold for the high position, with a maximum torso-to-ground angle of 15 degrees for the low position and a 140-degree waist angle to keep the body straight. Use those as starting points and calibrate them for your camera, model and users."
      },
      {
        "q": "Why does a push-up counter miss repetitions?",
        "a": "The studies we read point to self-occlusion by the torso, floor-level poses that pose models handle badly, what one study logged as chest-proximity failures, and keypoints that jump between frames under occlusion or poor light. A camera placed behind the person was the worst case, with every frame rejected in one study."
      },
      {
        "q": "How accurate is camera-based push-up counting?",
        "a": "One phone pipeline averaged a 61.1% detection rate across 12 phone positions and reached up to 85.7% from its best diagonal views, while a fixed-camera state-machine system reported 97.4% against human assessors. The studies define accuracy differently, so measure your own pipeline rather than quoting either figure."
      }
    ],
    "related": [
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/motion/squat-detection-pose-estimation",
        "label": "Squat detection from a camera"
      },
      {
        "href": "/motion/plank-detection-pose-estimation",
        "label": "Plank detection from a camera"
      },
      {
        "href": "/pose-keypoints/blazepose-33",
        "label": "BlazePose 33 keypoint map"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Counting push-ups from a camera? Get our developer notes on rep logic, camera placement and the studies behind them."
    },
    "sources": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12978916/",
        "checked": "2026-10-18",
        "note": "Oliosi et al., JMIR mHealth and uHealth 2026: push-up protocol, phone placement, detection rate and error (full text read as Europe PMC's XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12610833/",
        "checked": "2026-10-18",
        "note": "Lei et al., Sensors 2025: push-up angles, thresholds, state machine, keypoint correction and accuracy (read as Europe PMC's XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13204307/",
        "checked": "2026-10-18",
        "note": "Sousa et al., J Funct Morphol Kinesiol 2026: push-up phases, error causes and accuracy range (read as Europe PMC's XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13611031/",
        "checked": "2026-10-18",
        "note": "Gu et al., Sensors 2026: push-up recognition by camera view (read as NCBI's efetch XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13413046/",
        "checked": "2026-10-18",
        "note": "Fieraru and Goedemé, J Imaging 2026: monocular 3D error by exercise type (read as Europe PMC's XML)."
      }
    ]
  },
  {
    "slug": "lunge-detection-pose-estimation",
    "primaryQuery": "lunge detection pose estimation",
    "h1": "Lunge Detection With Pose Estimation: Landmarks, Camera, Rep Logic",
    "metaTitle": "Lunge Detection with Pose Estimation: Camera and Reps",
    "metaDescription": "Lunge counting from a camera, per the studies: both knee angles, how the camera view shifted OpenPose's joint angles, the rep phases and measured accuracy.",
    "updated": "2026-10-18",
    "answer": "A camera lunge counter follows both knee angles, front and rear, from the hip, knee and ankle landmarks. In one study's design, a repetition starts upright with both knee angles above a threshold, both drop below a second threshold as the person steps into the lunge, and the cycle closes when they extend again. The camera view moves the numbers a lot: in a 2025 study that filmed lunges from four cameras 45 degrees apart, OpenPose's knee-angle error against marker-based capture ranged from 15.50 to 29.44 degrees RMSE by view, and one participant's knee angle at the same instant read anywhere from 51.5 to 99.3 degrees depending on the camera.",
    "body": "This page is the lunge layer under [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works): landmarks, camera placement, rep logic and what the two studies we read on October 18, 2026 measured. Each number is one study's result under that study's conditions, so use it as a starting point to calibrate for your camera, model and users. This is engineering guidance for building a tracker, not exercise or medical advice.\n\n## The studies behind this page\n\n- **Baldinger and colleagues** (Sensors, 2025) had 20 healthy adults perform six front lunges each while four iPads, placed at 45° intervals around them, filmed them and a laboratory with 12 Vicon cameras measured them. Data from 16 participants were analysed, comparing knee, hip, elbow and shoulder angles from [OpenPose](/motion/openpose-models)'s 25-keypoint model with the marker-based angles.\n- **Sousa and colleagues** (Journal of Functional Morphology and Kinesiology, 2026) counted lunges among 12 exercises with angle-threshold state machines on [MediaPipe](/motion/mediapipe-pose-landmarker-models) landmarks.\n\n## Landmarks and angles\n\nSousa and colleagues' lunge module reads the front and the rear knee angle together. Baldinger and colleagues computed the knee angle from OpenPose's RHip, RKnee and RAnkle keypoints, and the hip angle between the line from RHip to RKnee and the line from MHip to Neck.\n\nEvery keypoint scheme on this site has hips, knees and ankles, so the knee angles are available from any model. The hip definition above needs a mid-hip and a neck point: [OpenPose BODY_25](/pose-keypoints/openpose-body-25) has MidHip and Neck, while [COCO 17](/pose-keypoints/coco-17) and [BlazePose 33](/pose-keypoints/blazepose-33) have neither, so in our reading you would average the two hips and the two shoulders instead and re-tune any threshold.\n\n## Where to put the camera\n\nBaldinger and colleagues put their cameras between the frontal and sagittal views on purpose, to represent people training at home or in rehabilitation who may have only one smartphone camera. Agreement (ICC) for the knee angle was excellent from all but the front-left camera, which reached only good agreement, and the authors' overall reading is that back-viewing cameras performed best and gave the lowest percentage deviations. Where a sagittal or frontal view will not capture the full range of motion, they suggest a back-viewing camera rather than a front-viewing one, and they conclude that each movement needs a detailed examination before anyone recommends a camera angle for it.\n\nThe view changed the measurement itself. For one participant at the same instant, the turning point of the lunge, the knee angle read 56.9° from the front right, 51.5° from the front left, 99.3° from the back left and 68.2° from the back right. The authors found no keypoint estimation errors behind this, only the perspective of 2D joint angles. They also note that occlusions of the lower body are rare in perfect sagittal or frontal views, and that the front-left camera had the worst view of the right leg.\n\nSousa and colleagues, counting rather than measuring, note that their pose model's performance can degrade when camera angles deviate from frontal or lateral views.\n\n## A rep state machine for lunges\n\nSousa and colleagues' lunge has three phases: standing upright with the front and rear knee angles above one threshold, stepping into the lunge as both knee angles drop below a second, and returning as they extend again. Requiring both knees is, in our reading, what stops one bent knee during a step or a stumble from completing a cycle, and the gap between the two thresholds is the hysteresis from [how rep counting works](/motion/how-rep-counting-works).\n\nBaldinger and colleagues' protocol alternates legs: the front leg pushes back to the start, then the exercise resumes with the contralateral movement. Decide whether your product counts one lunge per leg or per pair before you write the state machine. They smoothed their joint angles with a Savitzky–Golay filter, third order with a window length of 15, chosen because it removes keypoint noise while preserving the peaks and valleys of the signal; their video ran at a mean of 43 fps. They also propose biomechanical constraints, restricting joint angles to anatomical limits and penalising unrealistic angles or large jumps between consecutive frames.\n\nWhen no phase matches, Sousa and colleagues keep the last valid phase for a short window, typically 3 to 5 frames, instead of immediately falling back to no phase.\n\n## Failure modes the studies report\n\n- **Perspective at full depth.** Baldinger and colleagues' largest deviations came at the peaks of the movement, when the joints are at their full range of motion, which is exactly where a bottom threshold sits.\n- **The wrong view.** The front-left view gave the weakest agreement, and the shoulder angle agreed only poorly to moderately with the marker-based system from almost every view.\n- **Views off the frontal or lateral axis.** Sousa and colleagues note that small landmark errors there lead to incorrect or delayed state transitions.\n\n[Pose estimation accuracy](/motion/pose-estimation-accuracy) covers the general causes and [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation) what estimated depth can add.\n\n## What was measured, and why it will not transfer\n\n- Baldinger and colleagues' OpenPose knee-angle RMSE ranged from 15.50° to 29.44° by camera view and the hip angle from 15.20° to 25.25°, while knee-angle agreement (ICC) stayed good to excellent, at 0.86 to 0.96. The authors read high correlation as similar waveforms and trends, so in our reading the shape of the knee-angle curve survives a change of view better than its absolute values do.\n- Across all joints and views, the average deviation from the marker-based angles ranged from 15.2° to 36.48°.\n- They recorded in a laboratory with constant artificial light and the blinds closed, at 1194 × 834 pixels, with participants in close-fitting clothes.\n- Sousa and colleagues' counter detected every lunge repetition in their test set, which held 21 lunge videos: 3 they recorded and 18 from competition and online footage. Perfect scores on a set that small say little about a new population.\n\nNone of this transfers on its own to another model, camera position or group of users. [Testing a rep counting algorithm](/test/rep-counting) covers building your own test set.",
    "faqs": [
      {
        "q": "Which camera angle works best for tracking lunges?",
        "a": "In Baldinger and colleagues' 2025 study with four cameras between the frontal and sagittal views, back-viewing cameras performed best and the front-left view was weakest, and the authors advise examining each movement before recommending a camera angle. Sousa and colleagues note that their pose model can degrade when the camera deviates from frontal or lateral views, so test the placement you plan to ship."
      },
      {
        "q": "Should a lunge counter track one knee or both?",
        "a": "Both. Sousa and colleagues' lunge module requires both the front and rear knee angles to drop below a threshold to enter the lunge and to extend above one again on the return, which in our reading keeps a single bent knee from completing a cycle. Your counter also has to decide whether one rep is one leg or a left-right pair, because a protocol like Baldinger and colleagues' alternates legs."
      },
      {
        "q": "How accurate are 2D knee angles during a lunge?",
        "a": "Not very, unless the view is controlled. Baldinger and colleagues measured OpenPose knee-angle RMSE of 15.50 to 29.44 degrees against marker-based capture depending on the camera, with the largest deviations at the bottom of the lunge. That is enough to move a bottom threshold, so calibrate thresholds per camera placement."
      }
    ],
    "related": [
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/motion/squat-detection-pose-estimation",
        "label": "Squat detection from a camera"
      },
      {
        "href": "/pose-keypoints/openpose-body-25",
        "label": "OpenPose BODY_25 keypoint map"
      },
      {
        "href": "/motion/2d-vs-3d-pose-estimation",
        "label": "2D vs 3D pose estimation"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Tracking lunges or other two-leg movements from a camera? Get our developer notes on camera placement and rep logic."
    },
    "sources": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11819822/",
        "checked": "2026-10-18",
        "note": "Baldinger et al., Sensors 2025: four-view OpenPose lunge angles against Vicon, set-up, smoothing and errors (full text read as Europe PMC's XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13204307/",
        "checked": "2026-10-18",
        "note": "Sousa et al., J Funct Morphol Kinesiol 2026: lunge phases, phase persistence, view sensitivity and lunge results (read as Europe PMC's XML)."
      }
    ]
  },
  {
    "slug": "plank-detection-pose-estimation",
    "primaryQuery": "plank detection pose estimation",
    "h1": "Plank Detection With Pose Estimation: Landmarks, Camera, Hold Logic",
    "metaTitle": "Plank Detection with Pose Estimation: Hold Timer Logic",
    "metaDescription": "Plank tracking from a camera, per the studies: alignment checks, a hold timer that stops on bad posture, a ready-posture gate, and what was measured.",
    "updated": "2026-10-18",
    "answer": "A camera plank tracker is a timer, not a counter: in a 2026 school study, holding a proper plank posture started the timer, and an incorrect posture stopped it and triggered feedback. A 2026 rule-based study modelled the plank as one holding state with torso angle thresholds and a check that the body stays extended in a horizontal alignment, and it detected every plank in a test class of nine. Neither study benchmarked plank tracking at scale, so treat any threshold or result as a starting point to calibrate for your camera, model and users.",
    "body": "This page is the plank layer under [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works): landmarks, camera placement, hold logic and what the two studies we read on October 18, 2026 report. Each number is one study's result under that study's conditions, so use it as a starting point to calibrate for your camera, model and users. This is engineering guidance for building a tracker, not exercise or medical advice.\n\n## The studies behind this page\n\n- **Sousa and colleagues** (Journal of Functional Morphology and Kinesiology, 2026) counted 12 exercises, planks among them, with angle-threshold state machines on [MediaPipe](/motion/mediapipe-pose-landmarker-models) landmarks, and tested them on videos from public pose datasets, competition footage and their own recordings.\n- **Kim and colleagues** (Frontiers in Public Health, 2026) built a browser-based MediaPipe Pose program with five PE teachers and five 9th-grade students over about three months at one public middle school, and report how its plank rule changed in classroom use. It is a qualitative case study, and the authors did not formally benchmark pose-estimation accuracy.\n\n## Landmarks and angles\n\nSousa and colleagues model the plank as isometric exercise: a single holding state defined by torso angle thresholds, with an extra check that the body stays extended in a horizontal alignment throughout. Kim and colleagues' rules connect subsets of MediaPipe's 33 landmarks to conditions such as joint-angle ranges, alignment of body segments and temporal thresholds.\n\nNeither paper names, in the text we read, the landmarks its plank rule uses. In our reading, a horizontal-alignment check needs points along the whole body line, such as the shoulders, hips and ankles, which every keypoint scheme on this site has. Foot points beyond the ankle depend on the scheme: [BlazePose 33](/pose-keypoints/blazepose-33) and [ML Kit](/pose-keypoints/ml-kit) have heels and foot-index points, while [COCO 17](/pose-keypoints/coco-17) models stop at the ankle.\n\n## Where to put the camera\n\nNo study we read tested camera placement for planks. Sousa and colleagues note that their pose model's performance can degrade when the subject is partially occluded or when camera angles deviate from frontal or lateral views. Kim and colleagues note that webcam-based 2D recognition can produce errors depending on camera angle, lighting conditions and body occlusion. The closest posture with placement data is the plank start of a push-up, and the [push-up page](/motion/push-up-counter-computer-vision) covers which phone positions worked there.\n\n## A hold state machine for planks\n\nA plank has no repetitions to count, so the state machine tracks time. Kim and colleagues' teachers noted that activities such as planks emphasise sustained posture rather than repeated movements, and the team redesigned the plank rule from a simple hold condition into time-based tracking with continuous alignment checks. Maintaining a proper plank posture starts the timer, and an incorrect posture stops it and triggers feedback such as \"Keep your back straight\".\n\nThey also gate the start. Recognition that begins as soon as the program opens can misfire while learners are adjusting devices or moving into position, so their program shows guidance for a ready posture with recognition disabled, displays a progress indicator while the learner holds it, and starts tracking only once the posture is recognised with sufficient stability. In our reading that is a minimum-duration rule on entry, and the same idea on exit stops one noisy frame from pausing the timer. Sousa and colleagues use a related rule for dropped frames, keeping the last valid phase for typically 3 to 5 frames when no phase matches.\n\nHow long a posture must be wrong before the timer stops, and how far the torso may drift, are values neither study publishes for the plank, so set them from your own recordings. Kim and colleagues constrained their editable parameters to ranges derived from the pose-estimation model and the teachers' domain expertise.\n\n## Failure modes the studies report\n\n- **Starting too early.** Kim and colleagues saw misrecognition when recognition began while learners were adjusting devices or moving into position, which their ready-posture gate addresses.\n- **Off-axis views, occlusion and fast movement.** Sousa and colleagues list these as conditions in which their pose model's performance can degrade, leading to incorrect or delayed state transitions.\n- **Camera angle, lighting and body occlusion.** Kim and colleagues name these as sources of error for webcam-based 2D recognition, which they consider unlikely to match the precision of 3D motion capture.\n\n[Pose estimation accuracy](/motion/pose-estimation-accuracy) covers the general causes in more depth.\n\n## What was measured, and why it will not transfer\n\n- Sousa and colleagues report 100% for planks, a minority class of n = 9 in their data, with a 95% confidence interval of 69.2 to 100%, and they describe results for such small classes as preliminary rule validation rather than definitive generalization.\n- Their plank videos were 2 they recorded and 7 from public pose datasets.\n- Kim and colleagues did not benchmark accuracy with precision, recall or related metrics, and did not retrain or benchmark the MediaPipe Pose model against ground-truth datasets.\n\nNeither result tells you how a hold timer will behave with your camera, model and users, so record your own planks and check that the timer starts, stops and resumes when it should. [Testing a rep counting algorithm](/test/rep-counting) covers building a test set.",
    "faqs": [
      {
        "q": "How does a camera app time a plank?",
        "a": "In Kim and colleagues' 2026 school study, a proper plank posture started a timer and an incorrect posture stopped it and triggered feedback, with alignment checked continuously, and tracking began only after a stable ready posture. Sousa and colleagues model the plank as one holding state with torso angle thresholds and a horizontal-alignment check."
      },
      {
        "q": "Which landmarks does a plank tracker need?",
        "a": "Neither study we read names the landmarks of its plank rule. A horizontal-alignment check needs points along the body line, such as shoulders, hips and ankles, which every common keypoint scheme provides; foot points beyond the ankle depend on the scheme, so check the keypoint map of the model you use."
      },
      {
        "q": "How accurate is camera-based plank detection?",
        "a": "Sousa and colleagues report 100% for a class of nine planks, with a 95% confidence interval of 69.2 to 100%, and treat it as preliminary rule validation. Kim and colleagues did not benchmark accuracy. Neither figure predicts your app's accuracy, so test the timer with your own users."
      }
    ],
    "related": [
      {
        "href": "/motion/how-form-feedback-works",
        "label": "How form feedback works"
      },
      {
        "href": "/motion/push-up-counter-computer-vision",
        "label": "Push-up counter from a camera"
      },
      {
        "href": "/motion/mediapipe-pose-landmarker-models",
        "label": "MediaPipe Pose Landmarker models"
      },
      {
        "href": "/pose-keypoints/blazepose-33",
        "label": "BlazePose 33 keypoint map"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Timing planks or other holds from a camera? Get our developer notes on hold logic and the studies behind it."
    },
    "sources": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13204307/",
        "checked": "2026-10-18",
        "note": "Sousa et al., J Funct Morphol Kinesiol 2026: plank holding state, alignment check, phase persistence and plank results (read as Europe PMC's XML)."
      },
      {
        "url": "https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2026.1786427/full",
        "checked": "2026-10-18",
        "note": "Kim et al., Front Public Health 2026: time-based plank rule, ready-posture gate and stated limits of a classroom MediaPipe program."
      }
    ]
  },
  {
    "slug": "deadlift-pose-estimation",
    "primaryQuery": "deadlift pose estimation",
    "h1": "Deadlift Pose Estimation: Landmarks, Camera, Rep Logic",
    "metaTitle": "Deadlift Pose Estimation: Landmarks, Camera and Reps",
    "metaDescription": "Deadlift tracking from a camera, per the studies: torso and elbow angles, why 2D keypoints miss spinal curvature, camera set-ups, rep logic and accuracy.",
    "updated": "2026-10-18",
    "answer": "A camera deadlift counter can run on a torso angle and the elbows: in one 2026 study's state machine, the start has the torso leaning forward below one threshold with the elbows straight, and the lift registers when the torso extends above a higher threshold with the elbows still straight. Common skeletons have a single point at each hip and none on the spine, and a 2026 deadlift study states that 2D keypoints cannot directly recover spinal curvature or the 3D bar path. Reported accuracy depends on the task and the people: 95% of deadlift repetitions counted in one study, and 89.5% good-or-bad form classification in another, which fell to about 50 to 74% when a lifter was held out of training.",
    "body": "This page is the deadlift layer under [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works): landmarks, camera placement, rep logic and what the three studies we read on October 18, 2026 measured. Each number is one study's result under that study's conditions, so use it as a starting point to calibrate for your camera, model and users. This is engineering guidance for building a tracker, not exercise or medical advice.\n\n## The studies behind this page\n\n- **Sousa and colleagues** (Journal of Functional Morphology and Kinesiology, 2026) counted deadlifts among 12 exercises with angle-threshold state machines on [MediaPipe](/motion/mediapipe-pose-landmarker-models) landmarks. Their test set held 231 deadlift videos: 160 they recorded, 47 from public pose datasets and 24 from competition and online footage.\n- **Mercadal-Baudart and colleagues** (Heliyon, 2024) recorded four female and four male athletes doing squats, deadlifts and jumps in a marker-based motion-capture lab, with phones placed around them, plus four male athletes in a second collection. They trained a monocular 3D model to turn 17 detected 2D keypoints into a 33-point skeleton that includes the spine and pelvis.\n- **Shoaib and colleagues** (Scientific Reports, 2026) classified deadlift form as good or bad from 377 single-repetition clips of three male lifters aged 19 to 25, filmed with two smartphones from five angles, using [YOLOv11-Pose](/motion/yolo-pose-models) keypoints and graph neural networks. A certified trainer labelled each clip.\n\n## Landmarks and angles\n\nSousa and colleagues' deadlift runs on two signals: a torso angle, leaning forward at the start and extended in the lift, and the elbow angle, which must stay straight in both states. Their pipeline computes knee, hip, elbow, shoulder and torso angles from MediaPipe's 33 landmarks.\n\nThe hip is the hard part. Mercadal-Baudart and colleagues point out that common skeletons such as OpenPose's have a single keypoint at each hip, which is insufficient for clinically meaningful hip joint angles because those depend on the orientation of the pelvis and femur, and that simplified torsos are inadequate for pelvic angle and flexion at different levels of the spine. Their skeleton adds the toes, pelvis points (left and right PSIS and iliac crest), four spinal points (L2, T10, T4 and C7), the sternum and the clavicle. They define hip flexion as the angle between the lower spine (L2 to hip) and the thigh, with knee and hip flexion set to 0° in quiet standing. In our reading, that is the opposite convention to a three-point interior angle that reads near 180° for a straight leg, so check which convention a borrowed threshold assumes.\n\nShoaib and colleagues used the 17 keypoints of the COCO standard and state that projected 2D keypoints cannot directly recover depth-sensitive quantities such as the 3D bar path or spinal curvature. On this site's keypoint maps, [COCO 17](/pose-keypoints/coco-17) and [BlazePose 33](/pose-keypoints/blazepose-33) have no spine or mid-hip point, [OpenPose BODY_25](/pose-keypoints/openpose-body-25) and [Halpe26](/pose-keypoints/halpe-26) add a hip centre and a neck, and [Apple Vision 3D](/pose-keypoints/apple-vision-3d) has a single spine joint and a root.\n\n## Where to put the camera\n\nMercadal-Baudart and colleagues recorded with phones placed around the athlete at a radius of about 3 m, both on the floor and on tripods at about 1.5 m height, to simulate where physiotherapists and coaches would record. Their model was trained with virtual cameras that projected the motion-capture data into 2D from a range of possible camera positions, and they call for real-world testing of lighting, clothing and camera positioning.\n\nShoaib and colleagues filmed one sagittal or side view and four frontal or diagonal views, four indoors and one outdoors, to add viewpoint, lighting and background variability rather than to prescribe a set-up. They did not standardise camera height or lifter-to-camera distance, which they list as a limitation.\n\nSousa and colleagues noticed occlusion of key body parts particularly in bending exercises such as squats and deadlifts, more pronounced at greater distances. No study we read compared deadlift accuracy by camera view, so test the placements your users will actually use.\n\n## A rep state machine for deadlifts\n\nSousa and colleagues divide the deadlift into two states: a starting position with the torso leaning forward below one threshold and the elbows straight, and a lifting state triggered when the torso extends above a higher threshold with the elbows still straight. Their counter increases on completion of a cycle. In our reading, requiring the torso to drop back below the lower threshold before the next lift can count is the hysteresis described in [how rep counting works](/motion/how-rep-counting-works), and the straight-elbow condition keeps an arm movement from passing as a lift.\n\nShoaib and colleagues describe the deadlift as predictable phases, setup, eccentric lowering, concentric pull and lockout, with the setup and lockout relatively static and the concentric pull carrying the dynamic moments. Their trainer marked six checkpoints by bar position: bar on the ground, below the knees, at knee level, above the knees, mid-femur and final standing. A pose model does not see the bar; in our reading, the wrists, which hold it, are the nearest proxy, so wrist height against the knees marks the knee passage.\n\nFor dropped frames, Sousa and colleagues keep the last valid phase for typically 3 to 5 frames. Mercadal-Baudart and colleagues chose their 3D model partly because its temporal components help smooth jittery movement between frames.\n\n## Failure modes the studies report\n\n- **Missed bottoms and thresholds.** Sousa and colleagues' deadlift errors were seven angle-threshold failures and twelve missed bottom positions. Errors mostly meant missed repetitions rather than false positives, particularly in squat and deadlift videos recorded in uncontrolled environments.\n- **Occlusion at a distance.** Key body parts were occluded in bending exercises, more so at greater distances.\n- **What 2D cannot see.** Spinal curvature and the 3D bar path are not recoverable from projected 2D keypoints, and a single hip point cannot give pelvis orientation.\n- **New people and new conditions.** Shoaib and colleagues list sensitivity to pose-estimation noise and viewpoint or occlusion effects, and with their frame selection, four of their six models lost accuracy significantly on an expanded test set that added 54 repetitions from 16 outside lifters.\n\n[Pose estimation accuracy](/motion/pose-estimation-accuracy) covers the general causes and [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation) what estimated depth can add.\n\n## What was measured, and why it will not transfer\n\n- Sousa and colleagues counted deadlifts with 95% accuracy, slightly below most exercises, which they attribute to pose estimation noise affecting the angle calculations.\n- Mercadal-Baudart and colleagues' root mean square angle errors were within 10° for all exercises for shin angle, knee varus/valgus and flexion, hip flexion and pelvic tilt, trunk angle, spinal flexion and rib flare, with larger errors, still within 15°, for shoulder flexion and ASIS asymmetry in some exercises. They attribute the high accuracy to training on ground truth that contained these same exercises, and found that prediction accuracy reduces quickly for movements the model was not validated on.\n- Shoaib and colleagues' proposed model reached 89.5% accuracy on held-out videos of their three lifters. With a lifter held out entirely, accuracy ranged from about 50 to 74%, so the authors read their main result as subject-dependent rather than full cross-person generalization. The full pipeline took about 0.8 s per repetition on a desktop GPU, not a phone.\n\nNone of this transfers on its own to another model, camera position or group of users. Shoaib and colleagues describe their system as 2D projection-based form screening rather than 3D biomechanical measurement. [Testing a rep counting algorithm](/test/rep-counting) covers building your own test set.",
    "faqs": [
      {
        "q": "Can a 2D pose model see a rounded back during a deadlift?",
        "a": "Not directly. Shoaib and colleagues state that projected 2D keypoints cannot recover depth-sensitive quantities such as spinal curvature or the 3D bar path, and common skeletons have no spine points. Mercadal-Baudart and colleagues added spinal and pelvic points to a 3D model trained on their own motion-capture data to estimate spinal flexion."
      },
      {
        "q": "Which signal should a deadlift rep counter use?",
        "a": "Sousa and colleagues' state machine uses a torso angle, forward-leaning at the start and extended in the lift, with a check that the elbows stay straight in both states. Shoaib and colleagues describe the setup and lockout as relatively static and the pull as the dynamic phase, which in our reading makes the lockout a natural point to count."
      },
      {
        "q": "Where should the camera go for deadlift tracking?",
        "a": "Mercadal-Baudart and colleagues placed phones about 3 m from the athlete, on the floor and at about 1.5 m height, and Shoaib and colleagues filmed from one side view and four frontal or diagonal views without standardising height or distance. No study we read compared deadlift accuracy by camera view, so test the placements your users will use."
      },
      {
        "q": "How accurate is camera-based deadlift analysis?",
        "a": "Sousa and colleagues counted deadlifts with 95% accuracy. Shoaib and colleagues' form classifier reached 89.5% on new videos of its three training lifters but about 50 to 74% on a lifter held out of training. Results depend on the task and the people, so measure your own pipeline."
      }
    ],
    "related": [
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/motion/squat-detection-pose-estimation",
        "label": "Squat detection from a camera"
      },
      {
        "href": "/pose-keypoints/coco-17",
        "label": "COCO 17 keypoint map"
      },
      {
        "href": "/motion/2d-vs-3d-pose-estimation",
        "label": "2D vs 3D pose estimation"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Tracking deadlifts or other hinge movements from a camera? Get our developer notes on rep logic and the studies behind it."
    },
    "sources": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13204307/",
        "checked": "2026-10-18",
        "note": "Sousa et al., J Funct Morphol Kinesiol 2026: deadlift states, dataset, error causes and accuracy (read as Europe PMC's XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10951609/",
        "checked": "2026-10-18",
        "note": "Mercadal-Baudart et al., Heliyon 2024: extended 33-point skeleton, metric definitions, camera placement and angle errors (read as NCBI's efetch XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13569836/",
        "checked": "2026-10-18",
        "note": "Shoaib et al., Sci Rep 2026: deadlift dataset, viewpoints, 2D limits, phases, accuracy and generalization tests (read as Europe PMC's XML)."
      }
    ]
  },
  {
    "slug": "bicep-curl-counter-pose-estimation",
    "primaryQuery": "bicep curl counter pose estimation",
    "h1": "Bicep Curl Counter With Pose Estimation: Landmarks, Camera, Rep Logic",
    "metaTitle": "Bicep Curl Counter with Pose Estimation: Camera and Reps",
    "metaDescription": "Counting bicep curls from a camera, per the studies: elbow angle or hand height, camera set-ups, equipment hiding the wrist, rep logic and accuracy.",
    "updated": "2026-10-18",
    "answer": "A camera curl counter follows either the elbow angle, from the shoulder, elbow and wrist landmarks, or the hand's vertical position: a 2022 study set its joint of interest at the elbow for curls, and a 2023 study counted curls from the periodicity of the hand's height. Curls are not the easy case they look: that 2023 study counted biceps curls with larger errors than presses and rows, and the 2022 study found the wrist blocked by the equipment. Treat any threshold or filter setting as a starting point to calibrate for your camera, model and users.",
    "body": "This page is the curl layer under [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works): landmarks, camera placement, rep logic and what the studies we read on October 18, 2026 measured. Each number is one study's result under that study's conditions, so use it as a starting point to calibrate for your camera, model and users. This is engineering guidance for building a tracker, not exercise or medical advice.\n\n## The studies behind this page\n\n- **Chen and colleagues** (Sensors, 2022) detected 12 exercises, biceps curls among them, from videos of 20 users, using an object detector to recognise the exercise and [MediaPipe](/motion/mediapipe-pose-landmarker-models) landmarks to measure a joint angle per exercise.\n- **Hwang and colleagues** (Sensors, 2023) had 30 healthy adults with less than three months of exercise experience do five seated upper-body exercises, biceps curls among them, with dumbbells and resistance bands, and counted repetitions from [OpenPose](/motion/openpose-models) BODY_25 keypoints.\n- **Noteboom and colleagues** (Frontiers in Sports and Active Living, 2022) filmed five young male athletes doing biceps curls and lateral flies with one camera, estimated 3D joint centres with a deep-learning model, and compared the muscle forces this produced with a marker-based system.\n- **Peres and colleagues** (Journal of Functional Morphology and Kinesiology, 2025) filmed ten men doing barbell curls under three loads and tracked a marker on the bar rather than body landmarks.\n- **Fieraru and Goedemé** (Journal of Imaging, 2026) benchmarked 19 monocular 3D reconstruction methods on fitness motions.\n\n## Landmarks and angles\n\nChen and colleagues compute the angle at a node of interest from two other nodes, and for the biceps curl they place that node at the elbow; in our reading, the other two are the shoulder and the wrist. They then turn the angle into a completion value between the joint's initial angle when the exercise is ready and its final bending angle when it is completed. Hwang and colleagues skip the angle: they count from the periodicity of the left hand's position, using its vertical coordinate for curls, after dividing all coordinates by the length of the torso to remove the effect of distance and body size.\n\nEvery keypoint scheme on this site has shoulders, elbows and wrists. Points beyond the wrist differ: [BlazePose 33](/pose-keypoints/blazepose-33) and [ML Kit](/pose-keypoints/ml-kit) add pinky, index and thumb points, while [COCO 17](/pose-keypoints/coco-17) and [OpenPose BODY_25](/pose-keypoints/openpose-body-25) end at the wrist. In our reading that matters for curls, because the hand holding the dumbbell is where the occlusion happens.\n\n## Where to put the camera\n\nThe studies placed the camera in front or to the side. Hwang and colleagues put theirs 1.5 m in front of the seated participant at a height of 1.2 m, and Noteboom and colleagues 1.5 m in front at a height of 1.5 m, angled 15 degrees downwards. Peres and colleagues set the camera's optical axis perpendicular to the sagittal plane, a side view, and note that 2D analyses are prone to parallax and perspective errors.\n\nNoteboom and colleagues point out that the curl moves mainly in the sagittal plane and that occlusion of the upper arm can be expected. In our reading, a front camera therefore sees the forearm swing towards the lens, which foreshortens the 2D elbow angle, while the hand's height still changes clearly; a side camera sees the elbow angle in its plane but, as Chen and colleagues found, detects only about half of the body's nodes.\n\n## A rep state machine for curls\n\nChen and colleagues define a complete repetition by its completion signal: it rises from 0% to 100% and drops back to 0%, changing steadily and slowly. A signal that does not reach 100% or return to 0%, and changes unsteadily and fast, is an incomplete one, and a signal with almost no change is no movement. In our reading, that maps onto a two-threshold counter with a minimum time per phase, with the gap between the thresholds as the hysteresis described in [how rep counting works](/motion/how-rep-counting-works).\n\nHwang and colleagues count the zero-crossings of the filtered hand height. Before counting, they pass the keypoints through a 15-sample moving median filter, which they use to cope with occlusions shorter than about 0.25 s, and remove the signal's average. Chen and colleagues apply a similar rule to the exercise label: it changes only after 15 frames, 0.5 s, of a different detection.\n\n## Failure modes the studies report\n\n- **The equipment hides the wrist.** Chen and colleagues found the wrist blocked by the fitness equipment, causing node errors, and saw only half of the body's nodes detected when filming from the side.\n- **Short or uneven sets.** Hwang and colleagues counted correctly in long sets, where the periodicity was constant, but in sets with few repetitions the timing of each flexion varied and the count tended to be overestimated. Their method also produces high-frequency noise when the hand is occluded and is vulnerable to non-repeating, nonlinear movements with heavy weights.\n- **Someone else in the frame.** Noteboom and colleagues lost three trials, 2%, because a second person was visible in the background, which produced impossible skeletons.\n\n[Pose estimation accuracy](/motion/pose-estimation-accuracy) covers the general causes, and [multi-person pose tracking](/motion/multi-person-pose-tracking) covers keeping the right person.\n\n## What was measured, and why it will not transfer\n\n- Hwang and colleagues counted biceps curls and overhead triceps extensions with larger errors than chest presses, shoulder presses and seated rows; across the five exercises, the mean absolute counting error ranged from 0.88 to 3.21 repetitions.\n- Chen and colleagues classified movements as complete, incomplete or no movement with 92.84% accuracy across all 12 exercises, and found complete and incomplete repetitions hard to tell apart because participants were not specifically asked to perform them.\n- Noteboom and colleagues cite their earlier work, in which upper-limb joint angles from the camera method differed from a marker-based model by about 4 to 8 degrees RMSD on average.\n- Fieraru and Goedemé found upright exercises such as standing dumbbell curls among the easiest for monocular 3D methods, at about 67 mm mean error, against 118 to 155 mm for the hardest ground-level poses.\n\nNone of these figures describes your app. Seated participants, front cameras and novices in one study, five young athletes in another: measure your own counter with your own users, as [testing a rep counting algorithm](/test/rep-counting) describes.",
    "faqs": [
      {
        "q": "Should a curl counter use the elbow angle or the hand position?",
        "a": "Both appear in the studies. Chen and colleagues measured the angle at the elbow for curls, and Hwang and colleagues counted from the periodicity of the hand's vertical position after normalising by torso length. In our reading, the hand's height holds up better with a front camera, where the elbow angle is foreshortened, and the elbow angle suits a side view."
      },
      {
        "q": "Where should the camera go to count bicep curls?",
        "a": "Hwang and colleagues filmed from 1.5 m in front at 1.2 m height, Noteboom and colleagues from 1.5 m in front at 1.5 m height angled 15 degrees down, and Peres and colleagues from the side. Chen and colleagues found that a side view detected only about half of the body's nodes, so test the placement you plan to ship."
      },
      {
        "q": "Why does a curl counter overcount or miss reps?",
        "a": "In the studies we read, the equipment blocked the wrist, a second person in the background broke the skeleton, and short or uneven sets made a periodicity-based counter overestimate. Hwang and colleagues used a moving median filter to ride out occlusions of up to about 0.25 s."
      },
      {
        "q": "How accurate is camera-based bicep curl counting?",
        "a": "Hwang and colleagues counted biceps curls with larger errors than presses and rows, with mean absolute errors across their five exercises from 0.88 to 3.21 repetitions. No study we read reports curl counting accuracy across many users and cameras, so measure your own."
      }
    ],
    "related": [
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/motion/overhead-press-pose-estimation",
        "label": "Overhead press tracking from a camera"
      },
      {
        "href": "/pose-keypoints/blazepose-33",
        "label": "BlazePose 33 keypoint map"
      },
      {
        "href": "/motion/multi-person-pose-tracking",
        "label": "Multi-person pose tracking"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Counting curls or other arm exercises from a camera? Get our developer notes on rep logic and the studies behind it."
    },
    "sources": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9371130/",
        "checked": "2026-10-18",
        "note": "Chen et al., Sensors 2022: node of interest at the elbow for curls, completion categories, side-view and equipment occlusion, label buffer and accuracy (read as NCBI's efetch XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9862694/",
        "checked": "2026-10-18",
        "note": "Hwang et al., Sensors 2023: camera placement, hand-position counting, filtering, limitations and counting errors (read as NCBI's efetch XML)."
      },
      {
        "url": "https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2022.994221/full",
        "checked": "2026-10-18",
        "note": "Noteboom et al., Front Sports Act Living 2022: curl plane and occlusion, camera placement, background-person failures."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11942819/",
        "checked": "2026-10-18",
        "note": "Peres et al., J Funct Morphol Kinesiol 2025: side-on camera for barbell curls and 2D limits (read as Europe PMC's XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13413046/",
        "checked": "2026-10-18",
        "note": "Fieraru and Goedemé, J Imaging 2026: monocular 3D error by exercise type (read as Europe PMC's XML)."
      }
    ]
  },
  {
    "slug": "jumping-jack-counter-pose-estimation",
    "primaryQuery": "jumping jack counter pose estimation",
    "h1": "Jumping Jack Counter With Pose Estimation: Landmarks, Camera, Rep Logic",
    "metaTitle": "Jumping Jack Counter with Pose Estimation: Camera, Reps",
    "metaDescription": "Counting jumping jacks from a camera, per the studies: hand and feet distance cycles, wrist and ankle measures, the depth-camera set-ups and their limits.",
    "updated": "2026-10-18",
    "answer": "A camera jumping jack counter can follow two cycles: the distance between the hands and the distance between the feet, each running from its maximum through its minimum to the next maximum, as a 2022 study defined them. The two studies we found that measured jumping jacks with a camera used a Kinect depth sensor placed in front of the person, and neither reports counting accuracy, so this page has no measured accuracy figure to quote. Treat any threshold as a starting point to calibrate for your camera, model and users.",
    "body": "This page is the jumping jack layer under [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works): landmarks, camera placement, rep logic and what the two studies we read on October 18, 2026 report. Each number is one study's result under that study's conditions, so use it as a starting point to calibrate for your camera, model and users. This is engineering guidance for building a tracker, not exercise or medical advice.\n\nBoth studies come from clinical motor research and both used a Kinect, a 3D infrared camera that reports joints in three dimensions, rather than a 2D model running on a phone's RGB video. We use them only for how they set up the camera and defined the movement's signals.\n\n## The studies behind this page\n\n- **Cho and colleagues** (Scientific Reports, 2022) filmed 82 adults aged 18 to 65, 37 with autism and 45 controls, with a Kinect depth camera during nine movement tasks, one of which was 10 continuous jumping jacks.\n- **Hocking and colleagues** (Journal of NeuroEngineering and Rehabilitation, 2022) tracked ten children and adolescents with autism, aged 10 to 17, with a Kinect V2 during six virtual-reality training sessions, recognised jumping jacks with a neural network, and measured each one.\n\n## Landmarks and angles\n\nIn our reading, a jumping jack moves in the frontal plane: Hocking and colleagues define it as jumping from standing to a position with legs spread and arms raised, then back. Cho and colleagues measure it as two cycles, the hand cycle from maximal hand distance over minimal hand distance to the next maximal hand distance, and the matching feet cycle. Hocking and colleagues measure the highest wrist position as the maximum difference between wrist and shoulder heights divided by body height, and the widest leg split as the widest distance between the ankles divided by height.\n\nThose signals need wrists, shoulders and ankles, which every keypoint scheme on this site has, from [COCO 17](/pose-keypoints/coco-17) to [BlazePose 33](/pose-keypoints/blazepose-33). The Kinect V2 skeleton Hocking and colleagues recorded has 25 joints and is not one of the maps on this site. In our reading, dividing by body height, as they did, is what lets one threshold work for people of different sizes and at different distances from the camera.\n\n## Where to put the camera\n\nCho and colleagues mounted their sensor on a tripod at 1.4 m height with a vertical angle of −8°, with participants standing 2.5 m away. Hocking and colleagues placed theirs directly in front of the testing area, about 1 m away. Both set-ups face the person, which in our reading suits a frontal-plane movement: from the side, the hands and feet would move towards and away from the camera instead of across the image.\n\nCho and colleagues also controlled the scene: light, silhouette-fitting clothing, comfortable footwear, and an evenly lit environment free of distracting objects. One participant was excluded from their analysis for not meeting those filming conditions.\n\n## A rep state machine for jumping jacks\n\nIn our reading, Cho and colleagues' cycle definition is a ready-made state machine: count one repetition each time the normalised hand distance passes a high threshold, drops below a low one and rises past the high one again, with the gap between the two as the hysteresis described in [how rep counting works](/motion/how-rep-counting-works). Requiring the feet cycle to agree with the hand cycle would, in our reading, guard against arm swings without a jump. Cho and colleagues also report arrhythmicity, the absolute ratio between the standard deviation and the average of the cycle time, which a counter could use to flag irregular sets.\n\nHocking and colleagues recognised movements with a neural network over a sliding window of 60 frames, updating the result every 15 frames of new data, 0.5 s. Because they needed accurate start and finish times for each jumping jack, they checked every movement the network labelled as one and manually corrected the start or finish frames where they were wrong. They low-pass filtered the joint data at 12 Hz, shifted the coordinates so the pelvic joint sat at the origin, and cleaned each jumping jack's signals with a zero-lag Butterworth filter at a 3 Hz cut-off.\n\n## Failure modes the studies report\n\n- **Boundaries.** Hocking and colleagues' network found the movements, but its start and finish frames were not accurate enough for their analysis without manual correction.\n- **Noise.** Hocking and colleagues filtered the joint data twice, the second time to remove high-frequency parts of the signals that the participants could not physically have produced and that came from the noisy extraction process.\n- **Filming conditions.** Cho and colleagues' protocol depends on controlled light, clothing and background, and excluded a participant who did not meet it.\n\n[Pose estimation accuracy](/motion/pose-estimation-accuracy) covers the general causes in more depth.\n\n## What was measured, and why it will not transfer\n\nIn the text we read, neither study reports how accurately jumping jacks were counted or recognised, and no other study we read measured jumping jacks with a camera. Cho and colleagues cite an earlier technical validation of their protocol in healthy subjects, which we did not read. Hocking and colleagues describe their sample as very small.\n\nThe gap between these set-ups and a phone app is large: a depth sensor instead of an RGB camera, controlled clinical filming instead of a living room, and participant groups chosen for motor research. Build your own test set before you trust a jumping jack counter; [testing a rep counting algorithm](/test/rep-counting) covers how.",
    "faqs": [
      {
        "q": "What signal should a jumping jack counter use?",
        "a": "Cho and colleagues defined a jumping jack by two cycles, the distance between the hands and the distance between the feet, each from its maximum through its minimum to the next maximum. Hocking and colleagues normalised wrist height above the shoulders and ankle spread by body height. Either gives a periodic signal to threshold."
      },
      {
        "q": "Where should the camera go to count jumping jacks?",
        "a": "Both studies we read placed a Kinect depth camera in front of the person: on a tripod at 1.4 m height with a vertical angle of −8° and the person 2.5 m away in one, and about 1 m from the testing area in the other. In our reading, a jumping jack moves across the frontal plane, so a front view keeps the hands and feet moving across the image."
      },
      {
        "q": "How accurate is camera-based jumping jack counting?",
        "a": "No study we read reports it. The two studies that measured jumping jacks with a camera used a depth sensor and analysed cycle timing in one and range, synchrony and symmetry in the other, not counts, so test any counter on your own users and cameras."
      }
    ],
    "related": [
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/motion/real-time-pose-estimation",
        "label": "Real-time pose estimation"
      },
      {
        "href": "/pose-keypoints/coco-17",
        "label": "COCO 17 keypoint map"
      },
      {
        "href": "/motion/2d-vs-3d-pose-estimation",
        "label": "2D vs 3D pose estimation"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Counting jumping jacks or other cardio moves from a camera? Get our developer notes on rep logic and test sets."
    },
    "sources": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9090847/",
        "checked": "2026-10-18",
        "note": "Cho et al., Sci Rep 2022: depth-camera set-up, filming conditions and the hand and feet cycle definitions for jumping jacks (read as NCBI's efetch XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8742363/",
        "checked": "2026-10-18",
        "note": "Hocking et al., J NeuroEng Rehabil 2022: camera placement, filtering, sliding-window recognition, boundary correction and jumping jack measures (read as NCBI's efetch XML)."
      }
    ]
  },
  {
    "slug": "sit-up-counter-pose-estimation",
    "primaryQuery": "sit up counter pose estimation",
    "h1": "Sit-Up Counter With Pose Estimation: Landmarks, Camera, Rep Logic",
    "metaTitle": "Sit-Up Counter with Pose Estimation: Camera and Reps",
    "metaDescription": "Counting sit-ups from a camera, per the studies: elbow-to-knee distance and body angle, why the camera view decides recognition, rep logic and limits.",
    "updated": "2026-10-18",
    "answer": "A camera sit-up counter in one 2025 study used two signals: the distance between elbow and knee, which falls below a threshold when the person sits up, and the angle between the body and the horizontal, which falls below another threshold when they lie back down. Camera angle decides whether a pose model can see the movement at all: in a 2026 study, a camera branch recognised sit-up frames 95.0% of the time from the side, 88.5% from the front and 25.7% from behind. The 2025 study describes its thresholds as adjustable, so calibrate them for your camera, model and users.",
    "body": "This page is the sit-up layer under [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works): landmarks, camera placement, rep logic and what the two studies we read on October 18, 2026 report. Each number is one study's result under that study's conditions, so use it as a starting point to calibrate for your camera, model and users. This is engineering guidance for building a tracker, not exercise or medical advice.\n\n## The studies behind this page\n\n- **Lei and colleagues** (Sensors, 2025) built a fixed-camera assessment system on [MediaPipe](/motion/mediapipe-pose-landmarker-models)'s BlazePose landmarks with state machines for pull-ups, push-ups and sit-ups. Their sit-up result is a demonstration with one test-taker rather than an accuracy study.\n- **Gu and colleagues** (Sensors, 2026) recorded 10 participants, 6 men and 4 women, doing 30 repetitions each of push-ups, sit-ups and squats from the side, the front and behind, and report how often their camera branch recognised each exercise from each view. They fused the camera with a nine-axis inertial sensor; this page uses only the camera results.\n\n## Landmarks and angles\n\nLei and colleagues define the top of the sit-up by distance and the bottom by angle: when leaning up, the distance between the elbow and the knee is less than a sit-up threshold, and when lying down, the angle between the body and the horizontal line is less than a sit-down threshold. Gu and colleagues kept 17 of MediaPipe's 33 keypoints, the shoulders, elbows, wrists, hips, knees and ankles plus head and foot reference points, and expressed them relative to the hip centre to reduce the influence of body size and camera distance.\n\nEvery keypoint scheme on this site has elbows, knees, shoulders and hips, from [COCO 17](/pose-keypoints/coco-17) to [BlazePose 33](/pose-keypoints/blazepose-33). In our reading, an elbow-to-knee distance in pixels changes with the person's size and distance from the camera, so normalise it, for example by torso length, before you compare it with a threshold.\n\n## Where to put the camera\n\nGu and colleagues' camera branch recognised sit-up frames 95.0% of the time from the side, 88.5% from the front and 25.7% from behind. From behind, 675 of 1000 sit-up frames went unrecognised and 68 more were assigned to the wrong exercise; the authors attribute the posterior decline, for push-ups and sit-ups in particular, to core keypoints occluded by the trunk or the ground.\n\nLei and colleagues dedicate one camera to each person and recommend one camera per person when several people are tested at once. They add that their calibration-free 2D design is potentially vulnerable to large changes in viewing perspective or camera position, so in our reading a side camera, fixed once, is the set-up to start from.\n\n## A rep state machine for sit-ups\n\nLei and colleagues' sit-up machine has a sitting-up state, a lying-down state, transition states between them and a misaligned state, and they say its transitions follow the same principle as their pull-up machine, where each counted repetition is one pass from State4 through State3 to State1. Lei and colleagues describe their thresholds as empirical values set from assessment standards or from each individual's performance, and say the sit-up threshold can be adjusted for actual conditions. In our reading, using a distance at the top and an angle at the bottom gives the two-threshold hysteresis described in [how rep counting works](/motion/how-rep-counting-works) without having to tune one signal for both ends.\n\nThe same system cleans keypoints before the state machine sees them, correcting sudden jumps they call flying points and smoothing over a 10-frame window. Gu and colleagues gate the camera on confidence instead: when the mean keypoint confidence in a window falls below 0.45, the visual contribution is switched off, a value they describe as a fixed engineering setting rather than an optimised one.\n\nFor form feedback, Gu and colleagues list partial sit-up completion as an example of insufficient movement amplitude, which in our reading is a repetition that leaves the lying-down state but never satisfies the sitting-up threshold.\n\n## Failure modes the studies report\n\n- **A camera behind the person.** Gu and colleagues' posterior view lost most sit-up frames, and the only posterior frames assigned to the wrong exercise, 68 of them, all came from the sit-up subset.\n- **Occlusion and poor light.** Lei and colleagues saw keypoints jump when occlusion occurred or lighting was poor, which is what their correction step targets.\n- **A moved camera.** Lei and colleagues' calibration-free design is potentially vulnerable to large changes in viewing perspective or camera position.\n\n[Pose estimation accuracy](/motion/pose-estimation-accuracy) covers the general causes in more depth.\n\n## What was measured, and why it will not transfer\n\n- Gu and colleagues' frame-level figures measure whether the camera branch recognised the exercise, not whether repetitions were counted. Across the three exercises, the micro-averaged accuracy was 98.1% from the side, 89.4% from the front and 30.6% from behind.\n- Lei and colleagues report counting accuracy for push-ups and pull-ups but, in the text we read, not for sit-ups; their sit-up experiment concludes that one test-taker performed 7 standard sit-ups.\n\nNo study we read reports sit-up counting accuracy across a group of users, so treat a sit-up counter as unvalidated until you have tested it yourself; [testing a rep counting algorithm](/test/rep-counting) covers how.",
    "faqs": [
      {
        "q": "Which landmarks does a sit-up counter use?",
        "a": "Lei and colleagues used the distance between elbow and knee for the sitting-up position and the angle between the body and the horizontal for the lying-down position. Every common keypoint scheme has elbows, knees, shoulders and hips, so the signals are available from any model; normalise the distance before you threshold it."
      },
      {
        "q": "Where should the camera go to count sit-ups?",
        "a": "To the side, on the evidence we read: Gu and colleagues' camera branch recognised sit-up frames 95.0% of the time from the side, 88.5% from the front and 25.7% from behind, where the trunk and the ground hid core keypoints. Keep the camera fixed, since Lei and colleagues note their calibration-free design is vulnerable to large camera moves."
      },
      {
        "q": "How accurate is camera-based sit-up counting?",
        "a": "No study we read reports it across a group of users. Gu and colleagues measured exercise recognition rather than counting, and Lei and colleagues demonstrated their sit-up counter on one test-taker, so measure your own counter before relying on it."
      }
    ],
    "related": [
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/motion/push-up-counter-computer-vision",
        "label": "Push-up counter from a camera"
      },
      {
        "href": "/motion/pull-up-counter-computer-vision",
        "label": "Pull-up counter from a camera"
      },
      {
        "href": "/pose-keypoints/blazepose-33",
        "label": "BlazePose 33 keypoint map"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Counting sit-ups or other floor exercises from a camera? Get our developer notes on camera placement and rep logic."
    },
    "sources": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12610833/",
        "checked": "2026-10-18",
        "note": "Lei et al., Sensors 2025: sit-up states and thresholds, keypoint correction, camera specification and the sit-up demonstration (read as Europe PMC's XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13611031/",
        "checked": "2026-10-18",
        "note": "Gu et al., Sensors 2026: sit-up recognition by camera view, keypoint selection, confidence gate and feedback labels (read as NCBI's efetch XML)."
      }
    ]
  },
  {
    "slug": "pull-up-counter-computer-vision",
    "primaryQuery": "pull up counter computer vision",
    "h1": "Pull-Up Counter With Computer Vision: Landmarks, Camera, Rep Logic",
    "metaTitle": "Pull-Up Counter with Computer Vision: Bar and Reps",
    "metaDescription": "Counting pull-ups from a camera, per the studies: finding the bar from the hands, mouth or chin over the bar, elbow thresholds, rep logic and accuracy.",
    "updated": "2026-10-18",
    "answer": "A camera pull-up counter has to find the bar as well as the body: in a 2025 study, the system estimated the bar's height from the hands, which hold still once they grip it, and counted a repetition when the mouth rose above that height after a low position with the elbows extended past a 150-degree threshold. That system counted 96.6% of pull-ups correctly against human assessors, and a 2026 rule-based study counted every pull-up in its test set. Treat both studies' thresholds as starting points to calibrate for your camera, model and users.",
    "body": "This page is the pull-up layer under [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works): landmarks, camera placement, rep logic and what the two studies we read on October 18, 2026 measured. Each number is one study's result under that study's conditions, so use it as a starting point to calibrate for your camera, model and users. This is engineering guidance for building a tracker, not exercise or medical advice.\n\n## The studies behind this page\n\n- **Lei and colleagues** (Sensors, 2025) built a fixed-camera assessment system on [MediaPipe](/motion/mediapipe-pose-landmarker-models)'s BlazePose landmarks with state machines for pull-ups, push-ups and sit-ups, and compared its pull-up counts with repetitions recorded by experienced human assessors.\n- **Sousa and colleagues** (Journal of Functional Morphology and Kinesiology, 2026) counted pull-ups among 12 exercises with angle-threshold state machines on MediaPipe landmarks. Their pull-up videos were 4 they recorded and 26 from public pose datasets.\n\n## Landmarks and angles\n\nLei and colleagues judge the pull-up from heights as well as an angle: the mouth against the height of the bar for the top, and the eyes plus the elbow angle for the bottom. Sousa and colleagues use the elbow and torso angles and require the chin to move above the bar, and they also check that the body moves up and down along a consistent vertical axis.\n\nEvery keypoint scheme on this site has shoulders, elbows and wrists. The face is where they differ: [BlazePose 33](/pose-keypoints/blazepose-33) has mouth corners and eyes, while [COCO 17](/pose-keypoints/coco-17) has the nose, eyes and ears but no mouth, and neither has a chin point. In our reading, a chin-over-bar test therefore needs a proxy, such as the mouth points Lei and colleagues used or the nose on a COCO 17 model, and a threshold re-tuned for it.\n\n## Where to put the camera\n\nNo study we read specifies a camera position for pull-ups. Lei and colleagues dedicate one camera to each person and recommend one camera per person when several people are tested at once, and their calibration-free system estimates the bar's height from the video rather than from a measured set-up. They add that the design is potentially vulnerable to large changes in viewing perspective or camera position. In our reading, the frame has to hold the hands on the bar at the top and the fully extended arms at the bottom, so frame the person's full reach before anything else.\n\n## A rep state machine for pull-ups\n\nLei and colleagues find the bar first. Once the test-taker grips it, the height of the hands stays constant, so they compute the variance of hand height in sliding windows, keep the windows below a variance threshold, and take the one with the highest average height as the bar. They derive the eye-height threshold the same way, from the stable height after the test-taker mounts the bar.\n\nTheir state machine has a high state, a low state and two transition states. The judgment function returns up when the mouth is above the bar height, and down when the eyes are low enough, below the elbows in their pseudocode and below the eye-height threshold in their figures, and the elbow angle is above its threshold, set at 150 degrees as an empirical value to encourage fully extended elbows at the bottom. Each counted repetition is one pass from State4 through State3 to State1, so a pull that never brings the mouth over the bar, or a descent that stops short, does not count. Before any of this, they correct keypoints that jump between frames and smooth them over a 10-frame window.\n\nSousa and colleagues' pull-up has three phases: a start with the arms fully extended, the elbow angle above a threshold and the torso upright; pulling, with the elbows flexed below a lower threshold, the chin above the bar and the torso allowed to lean slightly; and lowering, with the elbows re-extended and the torso upright again. The gap between the extension and flexion thresholds is the hysteresis described in [how rep counting works](/motion/how-rep-counting-works), and their phase persistence keeps the last valid phase for typically 3 to 5 frames when no phase matches.\n\n## Failure modes the studies report\n\n- **Different people.** Lei and colleagues found accuracy relatively high among test-takers with high physical fitness levels and slightly lower among ordinary college students and teachers.\n- **Incomplete repetitions.** In a non-standard pull-up test, their system scored 4 because the mouth did not exceed the bar on the way up and the eyes did not drop below the threshold on the way down.\n- **Flying points.** Keypoints jumped when occlusion occurred or lighting was poor, which their correction step targets.\n- **A moved camera.** Their calibration-free design is potentially vulnerable to large changes in viewing perspective or camera position.\n\nThe general causes are in [pose estimation accuracy](/motion/pose-estimation-accuracy).\n\n## What was measured, and why it will not transfer\n\n- Lei and colleagues report an overall pull-up counting accuracy of 96.6%, defined as correctly recognised repetitions over the actual repetitions recorded by human assessors.\n- Sousa and colleagues report perfect detection (100%) for pull-ups on their 30 pull-up videos.\n\nBoth results come from small test sets, and each depends on its own thresholds and camera. Neither predicts your app's accuracy; [testing a rep counting algorithm](/test/rep-counting) covers how to measure it.",
    "faqs": [
      {
        "q": "How does a pull-up counter know where the bar is?",
        "a": "In Lei and colleagues' 2025 system, it does not need to be told. Once the hands grip the bar, their height stays constant, so the system looks for sliding windows with low variance in hand height and takes the stable window with the highest average height as the bar."
      },
      {
        "q": "What counts as the top of a pull-up for a camera counter?",
        "a": "Lei and colleagues count the top when the mouth rises above the estimated bar height, and Sousa and colleagues require the elbows to flex below a threshold with the chin above the bar. Neither BlazePose 33 nor COCO 17 has a chin point, so a chin test needs a proxy such as the mouth or nose."
      },
      {
        "q": "How accurate is camera-based pull-up counting?",
        "a": "Lei and colleagues counted 96.6% of pull-ups correctly against human assessors, with lower accuracy for ordinary students and teachers than for very fit test-takers, and Sousa and colleagues counted every pull-up in 30 videos. Both are small samples, so measure your own counter."
      }
    ],
    "related": [
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/motion/push-up-counter-computer-vision",
        "label": "Push-up counter from a camera"
      },
      {
        "href": "/motion/sit-up-counter-pose-estimation",
        "label": "Sit-up counter from a camera"
      },
      {
        "href": "/pose-keypoints/blazepose-33",
        "label": "BlazePose 33 keypoint map"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Counting pull-ups or other bar exercises from a camera? Get our developer notes on rep logic and the studies behind it."
    },
    "sources": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12610833/",
        "checked": "2026-10-18",
        "note": "Lei et al., Sensors 2025: bar-height estimation, pull-up states and thresholds, keypoint correction and pull-up accuracy (read as Europe PMC's XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13204307/",
        "checked": "2026-10-18",
        "note": "Sousa et al., J Funct Morphol Kinesiol 2026: pull-up phases, vertical-axis check, phase persistence and pull-up results (read as Europe PMC's XML)."
      }
    ]
  },
  {
    "slug": "overhead-press-pose-estimation",
    "primaryQuery": "overhead press pose estimation",
    "h1": "Overhead Press Pose Estimation: Landmarks, Camera, Rep Logic",
    "metaTitle": "Overhead Press Pose Estimation: Landmarks, Camera, Reps",
    "metaDescription": "Tracking the overhead press from a camera, per the studies: elbow and shoulder angles, hands above the head, hand-height counting, camera set-up, limits.",
    "updated": "2026-10-18",
    "answer": "A camera overhead press counter can follow the elbow and shoulder angles: one 2026 study starts the press with the weights at shoulder level and both angles below one threshold, registers the press when they extend above a higher one, and checks that the hands and elbows rise above the head. A 2023 study instead counted seated shoulder presses from the periodicity of the hand's height, and counted them accurately, with small average errors. Treat any threshold as a starting point to calibrate for your camera, model and users.",
    "body": "This page is the overhead press layer under [how rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works): landmarks, camera placement, rep logic and what the studies we read on October 18, 2026 measured. Each number is one study's result under that study's conditions, so use it as a starting point to calibrate for your camera, model and users. This is engineering guidance for building a tracker, not exercise or medical advice.\n\n## The studies behind this page\n\n- **Sousa and colleagues** (Journal of Functional Morphology and Kinesiology, 2026) counted shoulder presses among 12 exercises with angle-threshold state machines on [MediaPipe](/motion/mediapipe-pose-landmarker-models) landmarks. Their test set held 254 shoulder press videos: 160 they recorded, 45 from public pose datasets and 49 from competition and online footage.\n- **Hwang and colleagues** (Sensors, 2023) had 30 healthy adults with less than three months of exercise experience do five seated upper-body exercises, shoulder presses among them, with dumbbells and resistance bands, and counted repetitions from [OpenPose](/motion/openpose-models) BODY_25 keypoints.\n\n## Landmarks and angles\n\nSousa and colleagues define the shoulder press with the elbow and shoulder angles: a starting position with the weights at shoulder level and both angles generally below a threshold, a pressing phase in which the arms extend upward and both angles rise above a higher threshold, and a lowering phase in which the angles return below. During the pressing phase their system also checks, from the relative position of keypoints, that the hands and elbows rise above the head. Hwang and colleagues count from the vertical position of the left hand instead, after dividing coordinates by torso length to remove the effect of camera distance and body size.\n\nEvery keypoint scheme on this site has shoulders, elbows and wrists. For the hands-above-the-head check you also need a head reference: [COCO 17](/pose-keypoints/coco-17) and [BlazePose 33](/pose-keypoints/blazepose-33) have the nose, eyes and ears, and [Apple Vision 3D](/pose-keypoints/apple-vision-3d) has a top-of-head joint. In our reading, the shoulder angle is the weaker of the two signals: in a lunge study we read, OpenPose's shoulder flexion angle agreed only poorly to moderately with marker-based capture from almost every camera view, so give a shoulder-angle threshold more margin than an elbow one.\n\n## Where to put the camera\n\nHwang and colleagues placed their camera 1.5 m in front of the seated participant at a height of 1.2 m. Sousa and colleagues did not fix one position: part of their test set came from home environments, commercial gyms and competition venues with different lighting, backgrounds and camera angles, and they note that their pose model's performance can degrade when camera angles deviate from frontal or lateral views. In our reading, a front view is the natural start for a press, because the hands-above-the-head check needs both arms and the head in the image.\n\n## A rep state machine for the overhead press\n\nSousa and colleagues' three states give the counter its hysteresis: the angles must fall below the lower threshold before another press above the higher one can count, as described in [how rep counting works](/motion/how-rep-counting-works). Their phase persistence keeps the last valid phase for typically 3 to 5 frames when no phase matches. The same module composes into other exercises: a thruster is a squat module followed by a shoulder press module, and an overhead squat combines a squat with the shoulder press's second phase, the arms extended.\n\nHwang and colleagues count the zero-crossings of the hand-height signal after a 15-sample moving median filter, which they use to cope with occlusions shorter than about 0.25 s, and after removing the signal's average.\n\n## Failure modes the studies report\n\n- **Hands behind the head.** In a related overhead movement, the overhead triceps extension, Hwang and colleagues found the hand usually behind the head, causing an obstruction their median filter could not fully resolve, and counting accuracy was low.\n- **Short or uneven sets.** Their periodicity-based count tended to be overestimated in sets with few repetitions, where the timing of each repetition varied, and the method is vulnerable to non-repeating, nonlinear movements with heavy weights.\n- **Occlusion and fast transitions.** Sousa and colleagues attribute their errors mainly to temporary occlusions, rapid transitions and suboptimal camera viewpoints, which mostly produced missed repetitions rather than false positives.\n\n[Pose estimation accuracy](/motion/pose-estimation-accuracy) covers the general causes in more depth.\n\n## What was measured, and why it will not transfer\n\n- Hwang and colleagues counted shoulder presses, chest presses and seated rows accurately, with small average absolute errors, while biceps curls and overhead triceps extensions had larger errors; across the five exercises, the mean absolute counting error ranged from 0.88 to 3.21 repetitions.\n- Sousa and colleagues' per-exercise counting accuracies ranged from 95 to 100% across their 12 exercises, and thrusters, a squat followed by a shoulder press, reached perfect detection (100%).\n\nThe presses in these studies were seated in one and filmed in mixed settings in the other, and neither population is yours. Measure your own counter before you rely on it; [testing a rep counting algorithm](/test/rep-counting) covers how.",
    "faqs": [
      {
        "q": "Which angles does an overhead press counter use?",
        "a": "Sousa and colleagues used the elbow and shoulder angles: below a threshold with the weights at shoulder level, above a higher threshold at the top, plus a check that the hands and elbows rise above the head. Hwang and colleagues skipped angles and counted from the periodicity of the hand's height."
      },
      {
        "q": "Where should the camera go to track an overhead press?",
        "a": "Hwang and colleagues filmed seated presses from 1.5 m in front at a height of 1.2 m, and Sousa and colleagues worked with videos from mixed settings, noting that their pose model can degrade when the camera is off the frontal or lateral axis. A front view keeps both arms and the head in frame for a hands-above-head check."
      },
      {
        "q": "How accurate is camera-based overhead press counting?",
        "a": "Hwang and colleagues counted seated shoulder presses accurately, with small average absolute errors, and Sousa and colleagues counted thrusters, a squat plus a shoulder press, with perfect detection in their test set. Neither result predicts your app's accuracy, so measure your own."
      }
    ],
    "related": [
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/motion/bicep-curl-counter-pose-estimation",
        "label": "Bicep curl counter from a camera"
      },
      {
        "href": "/motion/squat-detection-pose-estimation",
        "label": "Squat detection from a camera"
      },
      {
        "href": "/pose-keypoints/blazepose-33",
        "label": "BlazePose 33 keypoint map"
      },
      {
        "href": "/motion",
        "label": "All AI motion topics"
      }
    ],
    "cta": {
      "pitch": "Tracking presses or other overhead movements from a camera? Get our developer notes on rep logic and the studies behind it."
    },
    "sources": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13204307/",
        "checked": "2026-10-18",
        "note": "Sousa et al., J Funct Morphol Kinesiol 2026: shoulder press states, hands-above-head check, composition into thrusters and overhead squats, dataset and results (read as Europe PMC's XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9862694/",
        "checked": "2026-10-18",
        "note": "Hwang et al., Sensors 2023: camera placement, hand-height counting, filtering, limitations and counting errors (read as NCBI's efetch XML)."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11819822/",
        "checked": "2026-10-18",
        "note": "Baldinger et al., Sensors 2025: agreement of OpenPose's shoulder angle with marker-based capture (read as Europe PMC's XML)."
      }
    ]
  }
];
