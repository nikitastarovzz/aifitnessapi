/**
 * A disclosed link to KinesteX, on the pages where it is genuinely the
 * subject, and on the pages whose reader faces a build-vs-buy decision for
 * camera-based motion tracking.
 *
 * ops/GEO.md binds this file. Two rules it exists to satisfy:
 *
 *  - NEVER CROWN OUR OWN PRODUCT. The copy below points at documentation and
 *    says what the product is; it does not claim it is the best option, and
 *    on the comparison pages it deliberately points back at the neutral
 *    comparison rather than around it.
 *  - DISCLOSE. Every instance renders the funder relationship inline. A
 *    reader who sees only this box still knows who pays for the site.
 *
 * Placement is an explicit map, not a keyword rule, for the same reason
 * ReferenceCallout uses one: matching on "KinesteX" appearing anywhere would
 * attach this to pages that mention it once in a list, which is how a
 * disclosed editorial link turns into a site-wide ad. A path belongs here for
 * one of two reasons, and only these:
 *
 *  1. The page already discusses the product in its own prose — the link is
 *     where the reader was already being sent, made clickable.
 *  2. (Widened 2026-10-31.) The page's reader is plausibly deciding whether
 *     to build camera-based motion tracking themselves: pose-model and
 *     keypoint references, rep-counting and exercise-detection pages, the
 *     on-device / real-time / accuracy / hardware trade-off pages, camera
 *     coaching and form-feedback guides, and the pose comparisons and
 *     alternatives. On these the note is phrased as an option ("if you would
 *     rather not build X yourself"), never as a claim of superiority,
 *     accuracy, coverage or price, and where the page is about a specific
 *     exercise it tells the reader to check coverage rather than implying it.
 *
 * Never on wearable, HealthKit, Health Connect, compliance, error-code or
 * other vendors' pricing pages, and not on multi-person tracking, where the
 * note would imply a capability nobody here has verified. A path outside
 * both reasons is spam with a disclosure on it, which is still spam.
 *
 * Sitewide, the footer carries one quiet funding line (Footer.tsx); this
 * component is the contextual layer and is not a substitute for it.
 *
 * Anchor text is varied on purpose. Fifteen identical exact-match anchors is
 * the pattern search engines treat as manipulation; fifteen natural phrases
 * describing the same destination is just writing.
 */

type Note = { anchor: string; lead: string };

const MAP: Record<string, Note> = {
  // ── Pages where KinesteX is the subject (already firstParty-disclosed) ──
  "/compare/kinestex-vs-sency": {
    anchor: "KinesteX's own SDK documentation",
    lead: "This comparison is written by the company that makes one of the two products. Check the claims yourself:",
  },
  "/compare/kinestex-vs-mediapipe": {
    anchor: "the KinesteX SDK docs",
    lead: "One side of this comparison funds this site. Read its documentation directly rather than taking our summary of it:",
  },
  "/compare/kinestex-vs-quickpose": {
    anchor: "KinesteX",
    lead: "We make one of these two products, so verify our description of it against the source:",
  },
  "/alternatives/kinestex-alternatives": {
    anchor: "what KinesteX actually does",
    lead: "This page lists alternatives to our own product. If you have not yet ruled it in or out, start with",
  },
  "/guides/evaluate-motion-sdks": {
    anchor: "KinesteX",
    lead: "Run this protocol against every vendor including ours. The product this site is funded by is",
  },
  "/engagement/camera-coaching-engagement": {
    anchor: "KinesteX's camera-coaching SDK",
    lead: "Disclosure applies throughout this page. The first-party product it describes is",
  },

  // ── Pages where it is one option among several ──
  "/fitness-apis/ai-workout-tracking-apis": {
    anchor: "KinesteX",
    lead: "One of the vendors listed above,",
  },
  "/fitness-apis/fitness-api-vs-build-your-own": {
    anchor: "a commercial motion SDK such as KinesteX",
    lead: "If the build column loses on your numbers, the buy column starts with",
  },
  "/engagement/engagement-sdks-compared": {
    anchor: "KinesteX",
    lead: "Among the SDKs compared here, the one that funds this site is",
  },

  // ── Implementation guides, where the reader wants a next step ──
  "/guides/ai-workout-tracking-react-native": {
    anchor: "the KinesteX React Native SDK",
    lead: "If you would rather integrate a hosted camera experience than wire a pose model yourself, see",
  },
  "/guides/ai-workout-tracking-flutter": {
    anchor: "KinesteX's Flutter SDK",
    lead: "The managed alternative to the pipeline above is",
  },
  "/guides/ai-workout-tracking-android-kotlin": {
    anchor: "the KinesteX Android SDK",
    lead: "For the buy path rather than the build path, there is",
  },
  "/guides/add-form-feedback": {
    anchor: "KinesteX",
    lead: "Form feedback is the hardest part to build well. A vendor that ships it, and the one behind this site, is",
  },

  // ── Build-vs-buy for camera motion tracking (widened 2026-10-31) ──
  // Phrased as an option, never a verdict. No accuracy, coverage or price
  // claim; the exercise pages send the reader to check coverage.
  "/motion/pose-estimation-models-compared": {
    anchor: "KinesteX",
    lead: "If you would rather not pick, tune and maintain one of these models yourself, a managed motion SDK is the other route. The one that funds this site is",
  },
  "/motion/2d-vs-3d-pose-estimation": {
    anchor: "KinesteX's motion SDK",
    lead: "Whichever dimensionality you settle on, building the pipeline yourself is optional. One packaged alternative, from the company that funds this site, is",
  },
  "/motion/pose-estimation-accuracy": {
    anchor: "KinesteX's SDK",
    lead: "This page vouches for no vendor's accuracy, including the one that funds it. If you would rather test a packaged SDK than tune a model yourself, one to put through your own evaluation is",
  },
  "/motion/on-device-vs-cloud-pose-estimation": {
    anchor: "the KinesteX SDK",
    lead: "If you would rather not run either inference path yourself, a third option is to integrate a commercial motion SDK, such as",
  },
  "/motion/real-time-pose-estimation": {
    anchor: "KinesteX's camera pipeline",
    lead: "If you would rather not own the frame-budget work yourself, you can integrate a finished camera pipeline instead. One vendor of that, and this site's funder, documents",
  },
  "/motion/pose-estimation-hardware-requirements": {
    anchor: "KinesteX's SDK documentation",
    lead: "If you would rather hand device support to a vendor, check any SDK's stated requirements against this page, for example in",
  },
  "/motion/how-rep-counting-works": {
    anchor: "a rep-counting SDK such as KinesteX",
    lead: "If you would rather not write and tune the state machine above yourself, the buy path is",
  },
  "/motion/how-form-feedback-works": {
    anchor: "KinesteX's form-feedback SDK",
    lead: "If you would rather integrate form feedback than build the angle rules and cue timing yourself, see",
  },
  "/motion/build-vs-buy-ai-motion-tracking": {
    anchor: "KinesteX",
    lead: "If your numbers point to buy, one of the vendors on that side of the ledger, and the one behind this site, is",
  },
  "/motion/mediapipe-pose-landmarker-models": {
    anchor: "KinesteX's SDK documentation",
    lead: "If you would rather not ship and update a Pose Landmarker model yourself, a managed SDK is the alternative. For one of them, see",
  },
  "/motion/apple-vision-body-pose": {
    anchor: "the KinesteX iOS SDK",
    lead: "If you would rather not build rep and form logic on top of Vision yourself, one off-the-shelf iOS option is",
  },
  "/motion/pose-estimation-model-licenses": {
    anchor: "KinesteX, this site's funder",
    lead: "If you would rather not carry a model licence decision at all, a commercial SDK swaps it for a vendor agreement you read instead. One such vendor is",
  },
  "/motion/movenet-models": {
    anchor: "KinesteX's packaged SDK",
    lead: "If you would rather not build counting and feedback on MoveNet keypoints yourself, the buy-side option from this site's funder is",
  },
  "/motion/ml-kit-pose-detection": {
    anchor: "KinesteX's mobile SDKs",
    lead: "If you would rather not turn ML Kit landmarks into reps and cues yourself, one commercial alternative is",
  },
  "/motion/yolo-pose-models": {
    anchor: "KinesteX's SDK, from this site's funder",
    lead: "If you would rather not build on YOLO and work through its licence terms yourself, one commercial motion SDK to compare is",
  },
  "/motion/rtmpose-models": {
    anchor: "KinesteX's hosted camera experience",
    lead: "If you would rather not own an MMPose deployment yourself, one alternative is",
  },
  "/motion/openpose-models": {
    anchor: "the KinesteX motion-tracking SDK",
    lead: "If OpenPose's licence rules it out and you would rather not assemble a replacement yourself, one commercial option is",
  },
  "/motion/squat-detection-pose-estimation": {
    anchor: "KinesteX's documentation",
    lead: "If you would rather not hand-tune squat depth and rep logic yourself, check whether a packaged motion SDK covers the movement. One to check is described in",
  },
  "/motion/push-up-counter-computer-vision": {
    anchor: "the KinesteX SDK",
    lead: "If you would rather not build a push-up counter yourself, a commercial camera SDK may already cover it; confirm its exercise list first. One such SDK is",
  },
  "/motion/lunge-detection-pose-estimation": {
    anchor: "KinesteX's motion SDK",
    lead: "If you would rather not write lunge detection yourself, see whether a packaged SDK covers it before you start. One option to check is",
  },
  "/motion/plank-detection-pose-estimation": {
    anchor: "the KinesteX docs",
    lead: "If you would rather not build hold timing and posture checks yourself, check a commercial SDK's exercise coverage; for one of them, see",
  },
  "/motion/deadlift-pose-estimation": {
    anchor: "KinesteX's camera SDK",
    lead: "If you would rather not tune hinge detection yourself, check whether a packaged SDK lists the deadlift. One to check is",
  },
  "/motion/bicep-curl-counter-pose-estimation": {
    anchor: "KinesteX's developer documentation",
    lead: "If you would rather not build the curl counter yourself, a commercial motion SDK is the alternative; verify it covers curls in",
  },
  "/motion/jumping-jack-counter-pose-estimation": {
    anchor: "KinesteX",
    lead: "If you would rather not write jumping-jack rep logic yourself, check the exercise list of a packaged camera SDK such as",
  },
  "/motion/sit-up-counter-pose-estimation": {
    anchor: "the KinesteX SDK reference",
    lead: "If you would rather not build sit-up counting from a floor-level camera yourself, check a commercial SDK's coverage first, for example in",
  },
  "/motion/pull-up-counter-computer-vision": {
    anchor: "what KinesteX covers",
    lead: "If you would rather not write pull-up counting yourself, a packaged camera SDK may be the shorter path; check",
  },
  "/motion/overhead-press-pose-estimation": {
    anchor: "KinesteX's integration docs",
    lead: "If you would rather not build overhead-press rep logic yourself, confirm a commercial SDK's exercise coverage before you buy; one is documented in",
  },
  "/learn/what-is-pose-estimation": {
    anchor: "KinesteX's AI motion-tracking SDK",
    lead: "If you would rather use pose estimation in your app than build on a raw model, the company that funds this site offers",
  },
  "/guides/camera-pose-tracking": {
    anchor: "KinesteX's camera SDK",
    lead: "If you would rather integrate a finished camera pipeline than assemble this one yourself, one option is",
  },
  "/guides/add-rep-counting": {
    anchor: "KinesteX's rep-counting SDK",
    lead: "If you would rather not build and tune rep counting yourself, an SDK that ships it, from the company that funds this site, is",
  },
  "/guides/track-workouts-without-wearables": {
    anchor: "a camera-only SDK such as KinesteX",
    lead: "If you would rather not build camera tracking from scratch, the buy path is",
  },
  "/guides/ai-workout-tracking-ios-swift": {
    anchor: "KinesteX's iOS SDK",
    lead: "If you would rather integrate than build the pipeline above in Swift, see",
  },
  "/guides/ai-workout-tracking-web": {
    anchor: "KinesteX's web integration",
    lead: "If you would rather embed a hosted camera experience than run the model in the browser yourself, see",
  },
  "/guides/improve-pose-detection-accuracy": {
    anchor: "KinesteX",
    lead: "If you would rather not do this tuning yourself, a packaged SDK is an option, though no vendor's accuracy, ours included, is vouched for here. One is",
  },
  "/build/ai-fitness-coaching-app": {
    anchor: "the KinesteX coaching SDK",
    lead: "If you would rather not build camera rep counting and form feedback yourself, one SDK to evaluate is",
  },
  "/build/yoga-app": {
    anchor: "KinesteX",
    lead: "If you would rather evaluate a packaged pose SDK than build one, test it on the floor poses above before committing. One such SDK is",
  },
  "/compare/mediapipe-vs-movenet": {
    anchor: "KinesteX",
    lead: "Both of these are models you build on. If you would rather integrate a finished motion SDK, one is",
  },
  "/compare/mediapipe-vs-yolo-pose": {
    anchor: "KinesteX's SDK docs",
    lead: "Neither side of this comparison is a finished product. If you would rather buy one than build on a model, see",
  },
  "/compare/apple-vision-vs-mediapipe": {
    anchor: "KinesteX",
    lead: "If you would rather skip both and integrate a packaged camera SDK, one option is",
  },
  "/compare/ml-kit-vs-mediapipe": {
    anchor: "a packaged SDK such as KinesteX",
    lead: "Both give you landmarks and leave the rest to you. If you would rather not build the rest yourself, look at",
  },
  "/compare/quickpose-vs-sency": {
    anchor: "KinesteX",
    lead: "Neither product compared here funds this site. The one that does, a third option if neither fits, is",
  },
  "/alternatives/mediapipe-alternatives": {
    anchor: "KinesteX's SDK",
    lead: "If the reason you are leaving MediaPipe is that you would rather not build on a model at all, one commercial option, from the company behind this site, is",
  },
  "/alternatives/openpose-alternatives": {
    anchor: "KinesteX's motion SDK",
    lead: "If you would rather replace OpenPose with a finished SDK than with another model, one option is",
  },
  "/alternatives/quickpose-alternatives": {
    anchor: "KinesteX",
    lead: "One of the alternatives a QuickPose user might weigh is the product that funds this site:",
  },
  "/alternatives/sency-alternatives": {
    anchor: "KinesteX",
    lead: "Among the options for leaving Sency is the product that funds this site. Check it against your reason for leaving:",
  },
  "/ai-fitness-app": {
    anchor: "KinesteX's coaching SDK",
    lead: "If you would rather integrate the camera-coaching layer than build it, one of the SDKs our roundup covers is",
  },
  "/no-code-fitness-app": {
    anchor: "KinesteX's developer site",
    lead: "The embedded camera-coaching example used on this page is documented at",
  },
  // ── Tools ──
  "/tools/pose-benchmark": {
    anchor: "KinesteX",
    lead: "If you would rather ship a hosted camera experience than tune a pose pipeline, see",
  },
  "/tools/keypoint-playground": {
    anchor: "KinesteX",
    lead: "If you would rather not map keypoints between models at all, a packaged motion SDK hands you reps and form events instead. One, from the company that funds this site, is",
  },
  // ── Games (ops/VIRAL-30-2026-10-31.md item 3) ──
  "/challenge": {
    anchor: "KinesteX",
    lead: "This counter is a few dozen lines of angle rules. If you want rep counting and form feedback in your own app without tuning them yourself, see",
  },
};

/** Paths this component covers, for the qa gate. */
export const KINESTEX_NOTE_PATHS = Object.keys(MAP);

export default function KinestexNote({ path }: { path: string }) {
  const note = MAP[path];
  if (!note) return null;

  return (
    <aside
      data-kinestex-note
      className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
    >
      <p className="text-[var(--muted)]">
        {note.lead}{" "}
        <a
          href="https://kinestex.com"
          className="font-semibold text-brand-600 hover:text-brand-500"
        >
          {note.anchor}
        </a>
        .
      </p>
      <p className="mt-2 text-xs text-[var(--muted)]">
        <strong className="font-semibold text-[var(--fg)]">Disclosure:</strong> KinesteX makes the
        product linked above and funds this site. That is why the link is labelled rather than
        dropped into the prose, and why nothing here ranks KinesteX first on our own say-so.
      </p>
    </aside>
  );
}
