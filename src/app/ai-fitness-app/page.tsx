import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import { Mdx } from "@/components/mdx";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";

/**
 * Flagship hub: the decision map for building an AI fitness app. Targets the
 * "ai workout app development" / "build an ai gym app" query family (GSC:
 * positions 40-90 with no owning page). Content is a synthesis — every factual
 * claim traces to a cluster page; judgement is labelled in-text.
 */

const PAGE_PATH = "/ai-fitness-app";
const UPDATED = "2026-08-11";

const RELATED: { href: string; label: string }[] = [
  {
    "href": "/motion/build-vs-buy-ai-motion-tracking",
    "label": "Build vs buy AI motion tracking"
  },
  {
    "href": "/build/fitness-app-tech-stack",
    "label": "Fitness app tech stack"
  },
  {
    "href": "/fitness-apis",
    "label": "The fitness API landscape"
  },
  {
    "href": "/picker",
    "label": "Which fitness API should I use?"
  }
];

export const metadata: Metadata = {
  title: { absolute: "How to Build an AI Fitness App: Layers, Decisions" },
  description: "The six layers of an AI fitness app — camera, exercise intelligence, content, wearable data, AI, app shell — and the five decisions that pick your stack.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "article",
    title: "How to Build an AI Fitness App",
    description: "The six layers of an AI fitness app — camera, exercise intelligence, content, wearable data, AI, app shell — and the five decisions that pick your stack.",
    url: PAGE_PATH,
    images: ["/opengraph-image"],
  },
};

const ANSWER = "An AI fitness app is six layers stacked: a camera and pose layer, an exercise-intelligence layer that turns keypoints into reps and form cues, an exercise-content layer, a wearable and health-data layer, an AI-features layer built on a language model, and the app shell for each platform you ship. Almost nobody builds all six, and the decision that shapes cost, timeline and team more than any other is which layers you build and which you buy. The economics are counter-intuitive at the top of the stack: pose keypoints are free and commoditized, while the rep logic, form rules and exercise coverage above them are the recurring cost. Decide layer by layer against one test — is this the thing users are paying us for? — build the differentiator, buy the rest, and let the hardest on-device job pick your client framework.";

const FAQS: { q: string; a: string }[] = [
  {
    "q": "What are the layers of an AI fitness app?",
    "a": "Six. A camera and pose layer that outputs joint keypoints per frame; an exercise-intelligence layer that turns those keypoints into reps, range of motion and form cues; an exercise-content layer holding the library users browse and follow; a health-data layer covering steps, heart rate, sleep, HRV and workouts from on-device stores, cloud wearable APIs or an aggregator; an AI-features layer for plan generation, coaching chat and food logging; and the app shell with its client, backend, offline storage, billing and media delivery. Not every app needs all six — a strength logger may skip the camera entirely, while a camera-first coaching app may skip wearables at launch."
  },
  {
    "q": "Which parts of an AI fitness app should I build and which should I buy?",
    "a": "Buy the layers that are commoditized and build the one users are paying you for. Pose estimation is the clearest buy-or-adopt: the mainstream models are free and permissively licensed, so there is no meaningful build option. Exercise content, wearable data and nutrition data are also normally licensed rather than assembled, and the app shell's plumbing — auth, subscriptions, push, analytics — is a solved problem. The genuinely contested layer is exercise intelligence: build the rep and form logic when camera-based motion analysis is your core differentiator and you have computer-vision staff, buy a coaching SDK when it is a feature inside a larger product. Our motion cluster notes most teams end up hybrid, adopting a free on-device pose model and building only the coaching layer above it."
  },
  {
    "q": "Do I need a machine learning team to add camera workout tracking?",
    "a": "Not for the parts most people assume. Pose estimation itself is a solved, downloadable capability — you adopt a model rather than train one. Rep counting is a small state machine over one smoothed joint angle with hysteresis so jitter cannot double-fire, and form feedback compares measured angles against target ranges you define; neither is machine learning. What you do need is engineering capacity to repeat that work per exercise and tune it across body types, camera angles, lighting and low-end devices, plus a test setup that can replay labelled clips. If you have that capacity, build; if you do not, a coaching SDK sells exactly that layer."
  },
  {
    "q": "Can one cross-platform codebase handle camera-based workout tracking?",
    "a": "It depends on whether pose is a feature or the product. For content, logging, coaching, social and nutrition apps, cross-platform is the default and one codebase roughly halves build and maintenance cost. For occasional on-demand inference — scan a photo on a button press — cross-platform is fine too. Our tech-stack page draws the line at continuous every-frame work: if live form feedback during a set is the core loop, budget for native, or accept React Native with native frame processors and the integration work that implies. Bluetooth LE peripherals, high-frequency sensor streaming and deep HealthKit or Health Connect integration push the same way, because cross-platform access to those runs through plugins that trail platform releases."
  },
  {
    "q": "What is the first thing to decide when building an AI fitness app?",
    "a": "Whether the camera earns its place, because that single answer propagates through every other choice. A phone camera measures the movement side directly — reps, range of motion, tempo, form — with no watch, ring or band, but it cannot measure heart rate, HRV or sleep, and camera-based calorie burn is an estimate rather than a measurement. Saying yes raises your platform floor, adds a testing problem ordinary CI cannot solve because simulators and emulators have no live camera feed, and puts raw video into your privacy story. Saying no makes the whole build an ordinary app plus a data integration. Decide it before you choose a framework, not after."
  }
];

const BODY = `
Most teams arrive at this question holding a feature list and leave holding an architecture. An AI fitness app is not one product decision, it is six — one per layer — and the layers have wildly different build-versus-buy economics. Build the wrong layer and you spend a year on something free; buy the wrong layer and you pay rent on your own differentiator.

This page is the map, not the manual. Each layer below gets what it actually produces, the honest build-versus-buy position, and the pages that settle the choice. If you would rather answer questions than read a map, [the interactive picker](/picker) narrows the data-side options and [the fitness API landscape](/fitness-apis) is the category index behind all of it.

## The anatomy: six layers

Read this table top to bottom and you have the shape of the build. The two right-hand columns are engineering judgement, drawn from the build-versus-buy pages linked below; the factual claims underneath are sourced page by page.

| Layer | What it produces | Build it when | Buy it when |
| --- | --- | --- | --- |
| Camera and pose | Joint keypoints per video frame | Almost never — the good models are free | Always: adopt a model, or an SDK that wraps one |
| Exercise intelligence | Reps, range of motion, form cues, mistakes | Motion analysis is the product | Coaching is a feature inside a bigger product |
| Exercise content | The library users browse and follow | Your content is your brand | You need breadth on day one |
| Health data | Steps, heart rate, sleep, HRV, workouts, calories | You can standardize on one or two sources | You need the long tail of devices |
| AI features | Plans, explanations, food logging, adaptation | The deterministic engine is yours regardless | The language layer is a vendor API regardless |
| App shell | Everything the user touches, per platform | Always | Commodity pieces only: auth, billing, push, analytics, media |

### Layer 1 — Camera and pose

Pose estimation locates body keypoints in a camera frame and outputs their coordinates plus a confidence score, per frame, usually on-device and in real time — [what pose estimation is](/learn/what-is-pose-estimation) covers the concept from zero. That is genuinely all it produces. Coordinates. Nothing about exercises, nothing about correctness.

The build-versus-buy reality here is lopsided: **there is no meaningful "build" option and no reason to want one.** The mainstream models are free and permissively licensed. MediaPipe/BlazePose returns 33 landmarks including monocular 3D world landmarks, MoveNet returns the 17 COCO keypoints with a Lightning-versus-Thunder speed dial, and both are Apache-2.0; Apple's Vision framework ships two body-pose requests with no model file to bundle at all. The models that carry real strings are the multi-person ones: Ultralytics YOLO is AGPL-3.0 and OpenPose is non-commercial, so check the license before the benchmark.

- [Pose estimation models compared](/motion/pose-estimation-models-compared) — keypoint counts, licenses, licensing traps.
- [MediaPipe vs MoveNet](/motion/mediapipe-vs-movenet) and [Apple Vision body pose](/motion/apple-vision-body-pose) — the two forks most single-user apps actually face.
- [On-device vs cloud pose estimation](/motion/on-device-vs-cloud-pose-estimation) — why on-device is the consumer default, and the narrow cases where it is not.
- [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation) — an RGB camera gives you both, but monocular depth is estimated rather than measured.
- [Camera pose tracking](/guides/camera-pose-tracking) — the load-a-model, pull-frames, read-landmarks pipeline, and [the whole motion cluster](/motion) behind it.

### Layer 2 — Exercise intelligence

This is the layer that turns coordinates into a product: rep counts, range of motion, tempo, form cues, and named mistakes. It is also where the money and the maintenance live. Our roundup of camera SDKs puts it plainly — the keypoints are the commoditized part, and the recurring cost is everything after them: per-exercise state logic, joint-angle thresholds, tuning across body types, camera angles, lighting and low-end devices, and the QA to stop all of that regressing.

The mechanics are less mysterious than the marketing suggests. Rep counting is a small state machine over one smoothed signal, usually a joint angle, with hysteresis so jitter near a threshold cannot double-fire. Form feedback compares measured angles against target ranges you define and surfaces one directional cue. Neither is machine learning. Both are ordinary engineering repeated for every exercise you support, forever, which is exactly why the buy option exists.

Commercial coaching SDKs sell this layer and nothing below it — our roundup covers Kemtai, KinesteX, QuickPose and Sency, and crowns none of them, because scope fit, platform coverage and access model decide it rather than a leaderboard. KinesteX funds this site — the linked comparison pages carry the full disclosure and were reviewed adversarially.

- [How rep counting works](/motion/how-rep-counting-works) and [how form feedback works](/motion/how-form-feedback-works) — the algorithms, and the limit that form feedback is a coaching aid, not medical or physical-therapy advice.
- [Build vs buy AI motion tracking](/motion/build-vs-buy-ai-motion-tracking) — the decision framed as maintenance ownership rather than features.
- [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) — the SDK roundup, where every vendor accuracy and frames-per-second figure is flagged as vendor-stated rather than independently verified.
- [One SDK head-to-head](/compare/kinestex-vs-sency) — how architectural difference, not quality ranking, usually decides between two coaching SDKs.

### Layer 3 — Exercise content

The library of exercises: names, target muscles, equipment, difficulty, media, substitution rules. Every app type involving a workout needs it, and it is the layer most consistently underestimated because it looks like a spreadsheet.

Build-versus-buy here splits on license and hosting rather than on price. Genuinely free options exist — free-exercise-db is public domain, while wger and exercisedb.dev are open source under AGPL-3.0, a strong copyleft license with a network-use trigger that matters for a closed-source product. Hosted gateways such as the RapidAPI ExerciseDB listing bill per request and hand you ready-made media. Advertised library counts are volatile and version-specific, so verify any headline number against the actual repo or listing.

- [Exercise database APIs](/fitness-apis/exercise-database-apis) — the landscape, sorted by license and media depth.
- [Exercise database API pricing](/pricing/exercise-database-api-pricing) — the AGPL and per-request-overage traps.
- [ExerciseDB vs wger](/compare/exercisedb-vs-wger) and [ExerciseDB alternatives](/alternatives/exercisedb-alternatives) — hosted gateway versus self-hosted ownership.
- [Grounding an LLM in your exercise database](/ai/ground-llm-in-exercise-database) — why the catalogue also becomes your safety boundary once AI plan generation shows up.

### Layer 4 — Health and wearable data

Steps, heart rate, sleep, HRV, workouts and energy, arriving by one of three routes: on-device stores, cloud OAuth APIs, or an aggregator fronting both. [On-device vs cloud health data](/learn/on-device-vs-cloud-health-data) is the primer. Apple HealthKit and Google Health Connect are OS-permission on-device stores with no server endpoint; Fitbit, Strava, Oura, WHOOP and Garmin are OAuth 2.0 cloud services your backend calls; aggregators such as Terra, Junction (formerly Vital), Rook and Spike collapse many providers behind one integration and one normalized schema.

Nobody builds this layer, but "buy" here is a coverage decision rather than one purchase. A cross-platform app implements both on-device stores, because they are not alternatives — they are the same job on two operating systems. Beyond that, each direct integration is its own approval, schema and maintenance, which argues for an aggregator; each aggregator is a recurring bill scaling with your connected users, which argues against.

- [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect), plus the integration guides for [HealthKit](/integrate/healthkit) and [Health Connect](/integrate/google-health-connect).
- [Wearable data APIs](/fitness-apis/wearable-data-apis) and [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) — direct versus one-integration coverage.
- [The data-type matrix](/matrix) and the [metric-by-metric pages](/data/heart-rate-api) — which sources actually expose the field you need.
- [The architecture cluster](/architecture) — sync, dedupe, day boundaries and storage, which is where health-data integrations actually go wrong.

### Layer 5 — AI features

The language-model layer: plan generation, coaching chat, explanations, natural-language food logging, and narration of a user's own numbers. It is the newest layer and the one where this site's advice is most counter-intuitive: the model does not compute anything.

Our AI cluster's position throughout is that most good AI fitness features are a rules engine wearing a language interface. Deterministic code owns anything with a single correct answer — progression, set and rep arithmetic, volume caps, deload timing, equipment substitution, heart-rate zone maths — and the model owns the open-ended jobs, selecting from a candidate set you supplied and writing prose about numbers you handed it. For food logging the same rule appears as: never persist a nutrition number the model emitted; resolve to a food identity, then look the macros up in a vetted database.

One hard constraint is worth pulling forward, because it is a shipping blocker rather than a design preference. Sending a user's health profile to a third-party language-model API is exactly what Apple's App Store Review Guideline 5.1.2(i) covers, so you must clearly disclose it and get explicit permission before the first call.

- [AI workout plan generation](/ai/ai-workout-plan-generation) and [AI vs rules-based coaching](/ai/ai-vs-rules-based-coaching) — where the boundary between code and model belongs.
- [AI nutrition logging](/ai/ai-nutrition-logging) — resolution rather than generation, and why photo logging is much harder than text.
- [Personalizing with wearable data](/ai/personalize-with-wearable-data) — the narrate-my-structured-data pattern, and the 5.1.2(i) disclosure requirement.
- [LLM safety for fitness advice](/ai/llm-safety-fitness-advice) and [evaluating AI fitness features](/ai/evaluating-ai-fitness-features) — the deterministic gate in front of the model, and why no public benchmark exists so you build your own evaluation set. [The AI cluster](/ai) covers model choice and prompting too.

### Layer 6 — The app shell

The client, the backend, and the plumbing: auth, subscriptions, push, analytics, media delivery, offline storage. You build the shell; you buy the commodity services inside it. Our tech-stack page's rule is to pick the client framework by the hardest thing the app does on-device, then buy everything that is not that — managed backends, store-billing wrappers, push and analytics are solved problems in 2026.

Two fitness-specific constraints shape the shell more than general mobile advice does. People train in basements and gyms with no signal, so local-first writes with background sync is a first-class requirement rather than a phase-two nice-to-have. And video, where you have it, is usually both the heaviest cost and the biggest UX lever, which argues for a CDN with adaptive bitrate, offline download and signed URLs.

- [Fitness app tech stack](/build/fitness-app-tech-stack) — client, backend, cross-cutting services, and a default MVP stack with the cases for deliberate deviation.
- [The build cluster](/build) — the same layer map re-cut by app type: [AI coaching](/build/ai-fitness-coaching-app), [rehab](/build/rehab-physical-therapy-app), [strength logging](/build/strength-training-app), [home workouts](/build/home-workout-app), [nutrition tracking](/build/nutrition-tracking-app).
- [Offline-first conflict resolution](/architecture/offline-first-conflict-resolution) — why last-write-wins quietly deletes sets a user deliberately typed.

## Choose your stack in five decisions

Five questions, asked in this order, produce a stack. Each one has a page that settles it.

### Decision 1 — Does the camera earn its place?

Ask what the camera measures that nothing else can. A phone camera measures the movement side directly — reps, range of motion, tempo, form — with no watch, ring or band. It cannot measure heart rate, HRV or sleep, and camera-based calorie burn is an estimate rather than a measurement. If your core loop is logging, content delivery, programming or nutrition, camera features are a later bet: our [home workout](/build/home-workout-app) and [yoga](/build/yoga-app) pages both treat camera feedback as an optional differentiator rather than a launch requirement.

A yes here propagates into every remaining decision. It raises your platform floor, adds a testing problem ordinary CI cannot solve, and puts raw video into your privacy story.

Settles it: [track workouts without wearables](/guides/track-workouts-without-wearables), [build vs buy AI motion tracking](/motion/build-vs-buy-ai-motion-tracking), [fitness API vs build your own](/fitness-apis/fitness-api-vs-build-your-own).

### Decision 2 — Pose model, or a coaching SDK on top of one?

Given a yes on camera, this is the fork. Build on a free pose model when camera-based motion analysis is your core differentiator and you have the computer-vision staff to own rep logic, form rules, exercise coverage and per-platform camera pipelines. Buy a coaching SDK when motion coaching is a feature inside a larger product and cross-platform maintenance matters more than control. Our motion cluster notes that most teams land hybrid: adopt an on-device pose model, then build only the coaching layer above it. If you build, the model choice follows what you compute downstream — 33 landmarks and monocular 3D favour joint-angle form work, 17 keypoints at minimum latency favour a rep counter on modest hardware.

Settles it: [pose estimation models compared](/motion/pose-estimation-models-compared), [MediaPipe Pose Landmarker variants](/motion/mediapipe-pose-landmarker-models), [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis), and — for the build path in code — [add rep counting](/guides/add-rep-counting) and [add form feedback](/guides/add-form-feedback).

### Decision 3 — Native, cross-platform, or both?

Cross-platform fitness app development is the default for content, logging, coaching, social and nutrition apps, where one codebase roughly halves build and maintenance cost and users cannot perceive a difference. It stops being the easy answer when the core loop is every-frame camera work, Bluetooth LE peripherals, high-frequency sensor streaming or deep on-device health-store integration. Our tech-stack page draws the line: if pose is a *feature*, an occasional scan, cross-platform is fine; if pose is *the product*, budget for native, or accept React Native with native frame processors and the integration work that implies.

Settles it: [fitness app tech stack](/build/fitness-app-tech-stack), plus the per-platform camera guides in [the guides cluster](/guides) — [iOS](/guides/ai-workout-tracking-ios-swift), [Android](/guides/ai-workout-tracking-android-kotlin), [React Native](/guides/ai-workout-tracking-react-native), [Flutter](/guides/ai-workout-tracking-flutter), [the web](/guides/ai-workout-tracking-web).

### Decision 4 — Where does health data come from?

Three sub-questions. Which metrics does a feature actually need, as opposed to which look good on a dashboard? Does your backend need the data, or only the app? How many device brands must you support at launch?

If the app is enough and your users are on one platform, the on-device store is the cheapest correct answer. If your backend needs the data, on-device stores alone cannot supply it, because neither HealthKit nor Health Connect has a server endpoint; you either sync from the app yourself or move to cloud APIs. If you need many brands, the direct-integration cost compounds — Garmin's developer program is partner-approval-only with new sign-ups reportedly on hold as of 2026, and Strava's terms changed from 2024 onward — which is the case for an aggregator.

Settles it: [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect), [what is a health-data aggregator](/learn/what-is-a-health-data-aggregator), [aggregator APIs](/fitness-apis/health-data-aggregator-apis), [the picker](/picker), [the data-type matrix](/matrix). On Google Fit today? Start at [the shutdown hub](/google-fit-shutdown).

### Decision 5 — What is your compliance posture?

Decide this before you design the data model, not before launch. Most direct-to-consumer fitness apps are outside HIPAA, which binds covered entities and their business associates — but outside HIPAA is not unregulated, and the FTC Health Breach Notification Rule, GDPR and state consumer-health laws generally apply instead. Fitness and wearable metrics are usually treated as special-category health data under GDPR, so explicit, granular consent is the norm. And an OS permission is not a legal basis: a HealthKit or Health Connect prompt is a device access control, nothing more.

Rehab and clinical positioning is its own fork. Low-risk general-wellness framing typically sits under the FDA's general wellness policy; marketing that your app diagnoses, treats or cures a disease can pull it into device regulation. This is general engineering guidance rather than legal advice — confirm your obligations with qualified counsel.

Settles it: [HIPAA compliance for fitness apps](/compliance/hipaa-compliance-fitness-app), [GDPR for fitness apps](/compliance/gdpr-fitness-app), [health data user consent](/compliance/health-data-user-consent), [FDA regulation of fitness apps](/compliance/fda-fitness-app-regulation), [is fitness data PHI](/compliance/is-fitness-data-phi).

## What it costs: the shape of the bill

No figures here: almost every specific price in this ecosystem is volatile, gated behind contact-sales, or both, and the [pricing cluster](/pricing) carries the dated, hedged specifics. What is stable is the *structure*, and the structure is what you budget against.

**The model layer is free.** Pose estimation is the rare case where the best mainstream options cost nothing per frame and run on hardware the user already owns. Apache-2.0 models plus on-device inference means no per-inference bill at all.

**The commercial SDK layer is a sales conversation.** Coaching SDKs commonly price contact-sales, frequently described as usage-based per active user, and our roundup records that pricing for several vendors could not be verified from public sources. Start that conversation early: it gates unit economics, not engineering.

**Aggregators are where a recurring API bill actually lands.** First-party wearable APIs mostly document no per-request fee. Aggregators do charge, typically on active or connected users, tiered, with an enterprise contact-sales top tier — so the bill scales with the thing you are trying to grow. Most per-user prices are not publicly listed.

**Memberships sit on the user side of the ledger.** They are not your invoice, they are your addressable market. WHOOP is subscription hardware, so every user needs an active membership for data to flow; Oura Gen3 users reportedly need one too; Strava standard-tier developer access reportedly now requires a paid subscription. Verify all three against current vendor terms.

**Content and nutrition split on license, not price.** Genuinely free options exist on both sides — public-domain and open exercise datasets, USDA FoodData Central and Open Food Facts for nutrition — and the cost they carry is hosting and normalizing data yourself, plus copyleft obligations where AGPL applies. Paid gateways invert that: ready-to-call, metered, with overage.

**Language-model cost is arithmetic you can do today.** Tokens in plus tokens out, times the rate, times calls per user per period, times users. Input tokens are the usual surprise, because system prompts, safety rules, tool schemas and retrieved context are re-sent every turn, and chat history is re-sent on top. That is why a weekly plan generator and an always-on chat coach are different businesses.

**Engineering time dominates all of it.** Every layer above has a cheap option whose real price is your team's attention, and the recurring costs that hurt are maintenance-shaped: per-exercise form logic, provider terms that change under you, approval renewals, re-verification. Judgement rather than a sourced claim — but it is the through-line of every build-versus-buy page here.

Start at [how much does a fitness API cost](/pricing/how-much-does-a-fitness-api-cost), [are fitness APIs free](/pricing/are-fitness-apis-free), [aggregator pricing](/pricing/health-data-aggregator-pricing), [nutrition API pricing](/pricing/nutrition-api-pricing), [AI fitness app cost](/ai/ai-fitness-app-cost).

## The mistakes that kill these apps

Six failure modes, each drawn from a page that documents it in detail, ordered roughly by how late they get discovered.

**1. Treating a daily total as a time-range query.** "Today's steps" is a calendar question, not a timestamp question. Store the UTC instant, the UTC offset in effect at that instant, and the civil local date computed from both — UTC alone discards information you cannot recover, and local time alone is ambiguous on the autumn DST transition and impossible on the spring one. See [timezones and day boundaries](/architecture/timezones-and-day-boundaries) and [the live demo](/day-boundaries).

**2. Writing a zero you did not observe.** "The user did nothing" and "we have no data" are different facts about a person, and both mobile platforms hand you the second disguised as the first — Apple documents that a denied read is indistinguishable from an empty store, and Google documents a default read-history window beyond which older data is absent rather than zero. Model every user-metric-day cell as measured-with-a-value or unknown-with-a-reason. See [missing data and gaps](/architecture/missing-data-and-gaps), [HealthKit returns no data](/fix/healthkit-no-data), [Health Connect returns no data](/fix/health-connect-no-data).

**3. Taking a vendor accuracy number as fact.** Published accuracy and frames-per-second figures are vendor-stated marketing claims, and a leaderboard score is measured on a dataset that is not your users. Apple publishes no model card and no accuracy numbers for Vision body pose, so any accuracy claim about it is unverifiable — measure it on your own footage, and apply the same discipline to every SDK trial. See [pose estimation accuracy](/motion/pose-estimation-accuracy) and [Apple Vision body pose](/motion/apple-vision-body-pose).

**4. Losing the rotated refresh token.** The symptom is a refresh that works exactly once and then returns 400 invalid_grant forever. Strava, WHOOP, Oura, Garmin and Fitbit return a *new* refresh token in the refresh response and invalidate the old one immediately, so you must persist it, overwriting the stored value. Its cousin is confusing 401 with 403: refreshing never fixes a missing scope. See [refresh token not working](/fix/refresh-token-not-working) and [fitness API 401 unauthorized](/fix/fitness-api-401-unauthorized).

**5. Shipping without the store-policy work.** Both platforms gate health apps on paperwork, not code. Apple requires a privacy policy in the app and in App Store Connect, bans using health data for advertising or selling it, and requires in-app account deletion if you offer accounts. Google Play requires prominent disclosure plus consent, an accurate Data safety form, deletion paths, and — before a Health Connect integration ships — a Play Console health-data declaration listing every type you read or write. Both revise and renumber often, so verify current text. See [App Store health data rules](/compliance/app-store-health-data-rules) and [Google Play health data policy](/compliance/google-play-health-data-policy).

**6. Underestimating the exercise-content layer.** It looks like a spreadsheet and behaves like a product. Advertised library counts vary by project and version; the free options carry AGPL obligations or push hosting and normalization onto you; paid gateways meter per request with overage above quota. And once AI plan generation arrives, the catalogue becomes your safety boundary — the model may only return identifiers it was given. See [exercise database API pricing](/pricing/exercise-database-api-pricing) and [grounding an LLM in your exercise database](/ai/ground-llm-in-exercise-database).

Plus one that only bites camera apps: **retrofitting the test seam.** Simulators and emulators cannot give you a live camera feed, so a recorded clip is the only frame source CI can drive on both platforms — which forces a day-one decision that every frame enters through an injectable source. Retrofitting that later means re-deriving timestamps, orientation, backpressure and end-of-stream: a rewrite, not a refactor. See [testing camera features without a device](/test/camera-features-without-a-device).

## Ship checklist

Work top to bottom. Anything you cannot tick is a decision you have deferred rather than made.

**Correctness of the data you show**

- Daily rollups group on a stored civil local date, and a DST day is in the fixture set — [day boundaries](/architecture/timezones-and-day-boundaries).
- Absence is stored as absence with a reason, and no code path zero-fills — [missing data and gaps](/architecture/missing-data-and-gaps).
- Overlapping sources resolve interval-wise rather than by summing per-source totals — [deduplicating health data](/architecture/deduplicate-health-data).
- Fixtures are ugly enough to fail: overlaps, clock skew, retro-edits, gaps, denied reads — [mock wearable data](/test/mock-wearable-data).

**Camera pipeline, if you have one**

- Every frame enters through an injectable source, and a recorded clip drives the pipeline in CI — [camera features without a device](/test/camera-features-without-a-device).
- Rep counting is scored per clip against a labelled corpus, not on an aggregate where a miss and a double-count cancel — [testing rep counting](/test/rep-counting).
- Keypoint drift is scored per keypoint against a pinned model revision — [pose detection accuracy](/test/pose-detection-accuracy).
- A thermal soak runs on a physical device and fails the build on drift — [device lab and CI](/test/device-lab-and-ci).
- Capture-side work is done: framing, distance, lighting, camera angle matched to the plane of motion — [improve pose detection accuracy](/guides/improve-pose-detection-accuracy).

**Integrations**

- A 401 triggers exactly one refresh and one retry, and a rotated refresh token is persisted first — [testing OAuth flows](/test/oauth-flows).
- Webhook deliveries are idempotent on the delivery id and the write is a versioned replace — [webhook ingestion](/architecture/webhook-ingestion), [testing webhooks locally](/test/webhooks-locally).
- Backfill is resumable and checkpointed, and rate-limit failures degrade rather than skip windows — [historical backfill](/architecture/historical-backfill), [rate limits and outages](/test/rate-limits-and-outages).
- Freshness is monitored per provider, because a health pipeline's dominant failure mode is silence — [data quality monitoring](/architecture/data-quality-monitoring).

**Compliance and store review**

- Privacy policy in-app and in the listing, accurate against what the app actually does — [health app privacy policy](/compliance/health-app-privacy-policy).
- Account and data deletion reaches derived rollups, caches, logs and the upstream OAuth grant — [retention and deletion](/compliance/health-data-retention-deletion), [data deletion and export](/architecture/data-deletion-and-export), [testing data deletion](/test/data-deletion).
- Play Console health-data declaration filed if you read or write Health Connect — [Google Play health data policy](/compliance/google-play-health-data-policy).
- Explicit disclosure and permission before any health profile reaches a third-party language-model API — [personalizing with wearable data](/ai/personalize-with-wearable-data).
- Data encrypted in transit and at rest, least-privilege access — [storing health data securely](/compliance/store-health-data-securely).

**AI features, if you have them**

- A deterministic gate runs before the model, evaluated against the whole conversation rather than the latest message — [LLM safety for fitness advice](/ai/llm-safety-fitness-advice).
- Every generated plan validates server-side against your catalogue and the user's equipment, injuries and volume caps — [AI workout plan generation](/ai/ai-workout-plan-generation).
- A golden set is frozen before launch and a grader runs without you — [evaluating AI fitness features](/ai/evaluating-ai-fitness-features).
- Per-user token arithmetic is done and fits inside your subscription margin — [AI fitness app cost](/ai/ai-fitness-app-cost).

Every line above routes into a page that goes deeper. Still choosing? [The picker](/picker). Integrating? [The integration guides](/integrate). Already broken? [The fix cluster](/fix).
`;

export default function AiFitnessAppPage() {
  const url = absoluteUrl(PAGE_PATH);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Build an AI Fitness App",
    description: metadata.description,
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <article className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "How to Build an AI Fitness App", path: PAGE_PATH }]} />

        <ClusterHero label="The Map" seed={12} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          How to Build an AI Fitness App
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Updated 11 August 2026</p>

        {/* Answer-first capsule — quotable, speakable. */}
        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {ANSWER}
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left">
          <Mdx source={BODY} />
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Frequently asked questions
          </h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterCta pitch="Mapping your own build? Get our developer notes on where each layer's real cost lands — and which vendor claims to re-verify before you commit." source="pillar-inline" id="cta-ai-fitness-app" />

        <section className="mt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Keep reading
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {RELATED.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="block rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-sm text-[var(--muted)]">
          By {site.name}. Synthesis of our verified cluster pages — every claim links its source; judgement is labelled as judgement.
        </p>
      </article>
    </Container>
  );
}
