# Fitness API Selection Checklist
From aifitnessapi.com — the five decisions, as a working checklist.
Companion pages: aifitnessapi.com/ai-fitness-app · /picker · /cost-planner

## 1. Does the camera earn its place?
- [ ] What does the camera measure that nothing else can, for OUR product?
- [ ] Are we prepared for: higher platform floor, CI without a live camera,
      raw video in the privacy story?
- [ ] If no: strike the motion-SDK rows from this checklist entirely.

## 2. Pose model or coaching SDK?
- [ ] Is motion analysis our differentiator (build) or a feature (buy)?
- [ ] Do we have CV/ML staff to own rep logic + form rules per exercise, forever?
- [ ] If buying: run the bake-off protocol (aifitnessapi.com/guides/evaluate-motion-sdks)
      before any contract. Same corpus, same devices, every vendor.

## 3. Native, cross-platform, or both?
- [ ] Is pose/BLE/sensor streaming the CORE loop (native) or occasional (cross-platform)?
- [ ] Have we priced the plugin lag for health-store access on our framework?

## 4. Where does health data come from?
- [ ] Which metrics does the feature actually need (list them — not "all")?
- [ ] Does the BACKEND need the data, or only the app? (On-device stores have
      no server endpoint.)
- [ ] How many device brands at launch? 1-2 → direct. Many → aggregator.
- [ ] For each direct provider: approval gate? user-side device/membership cost?
      refresh-token rotation? webhook or poll?
- [ ] For each aggregator: billing unit? monthly minimum? bring-your-own
      credentials for which providers?

## 5. Compliance posture — decided BEFORE the data model
- [ ] HIPAA-covered path, or consumer path (FTC HBNR / GDPR / state laws)?
- [ ] Special-category consent flow designed (an OS permission is not a legal basis)?
- [ ] Store paperwork listed: App Store health strings, Play Console health
      declaration, privacy policy, in-app deletion?
- [ ] General-wellness framing confirmed against what our UI copy CLAIMS?

Every unchecked box is a decision deferred, not made.
(C) aifitnessapi.com — CC BY 4.0
