import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED "[metric] API" pages (originally auto-assembled; since
 * hand-edited — edit here). Article + FAQPage (no HowTo). Organized by metric;
 * explicit about measured vs estimated; consumer-device data framed as a
 * wellness signal, not a diagnosis.
 */
export const dataEntries: ClusterEntry[] =
[
  {
    "slug": "heart-rate-api",
    "primaryQuery": "heart rate api",
    "h1": "Heart Rate API: How to Get Heart-Rate Data Into Your App",
    "metaTitle": "Heart Rate API: Get HR Data Into Your App",
    "metaDescription": "Get heart-rate data via HealthKit, Health Connect, and wearable cloud APIs. HR is measured and wellness-grade. Compare sources and pick the right one.",
    "updated": "2026-07-24",
    "answer": "Heart rate is a measured signal, read on consumer devices from a PPG optical sensor (chest straps use electrical ECG-style sensing). You get it into an app from on-device stores (Apple HealthKit `HKQuantityTypeIdentifierHeartRate`, Android Health Connect `HeartRateRecord`), from nearly every wearable cloud API (Fitbit, Garmin, Oura, WHOOP, Strava), or from an aggregator that normalizes all of them. HR itself is measured and wellness-grade, not an ECG or diagnostic; resting and walking-average HR are derived aggregates. Best pick: on-device or a chest strap for live in-workout HR, and cloud OAuth or an aggregator for all-day and resting HR across many devices.",
    "body": "## Where you can get it\n\nHeart rate shows up as several distinct shapes — continuous (intraday) samples, a once-daily resting value, spot readings, and per-workout streams. The table below maps the common sources; every field name, scope, and device-coverage claim is volatile, so treat it as \"as of 2026, verify\" against the provider's live data dictionary.\n\n| Source | How you access it | Notes |\n|---|---|---|\n| Apple HealthKit | On-device read (iOS), per-type permission; no cloud pull | `HKQuantityTypeIdentifierHeartRate` (general samples), `HKQuantityTypeIdentifierRestingHeartRate`, `walkingHeartRateAverage`, `heartRateRecoveryOneMinute`; beat-to-beat series via `HKDataTypeIdentifierHeartbeatSeries`. See the [HealthKit integration guide](/integrate/healthkit). |\n| Android Health Connect | On-device read (Android), per-record permission; no cloud pull | `HeartRateRecord` (a series of BPM samples). See [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data). |\n| Fitbit Web API | Cloud OAuth 2.0 | Heart Rate Time Series including resting HR; intraday HR needs Intraday approval — verify. |\n| Garmin Health API | Cloud OAuth 2.0 | HR is part of daily summaries / epochs. |\n| Oura API v2 | Cloud OAuth 2.0 | `heartrate` endpoint (timestamped BPM); `interbeat_interval` (IBI). Verify endpoint names in live docs. |\n| WHOOP API v2 | Cloud OAuth 2.0 | HR contributes to Recovery (resting HR) and cycle/workout data. |\n| Strava API | Cloud OAuth 2.0 | HR only as a per-workout activity **stream** (BPM) — no resting or all-day HR. |\n| Aggregators (Terra, Junction, Rook) | One cloud API + webhooks over many providers | Normalize HR and resting HR across sources. See [health data aggregator APIs](/fitness-apis/health-data-aggregator-apis). |\n\nFor the per-vendor cloud route and how the wearable APIs compare, see [wearable data APIs](/fitness-apis/wearable-data-apis).\n\n## Measured or estimated?\n\nHeart rate is **measured**, not modeled. The caveat is accuracy conditions, not the nature of the metric: optical PPG accuracy degrades with motion, cold, tattoos, and poor sensor fit, so accuracy varies by device and conditions — do not rely on a single published accuracy percentage, and verify any device-specific claim. Resting HR and walking-average HR are **derived aggregates** computed once daily from measured samples, not live readings.\n\nA few sampling and timing gotchas to plan around:\n\n- \"Continuous\" HR is usually **sampled** (every few seconds to minutes at rest, faster in workouts), not truly beat-by-beat, and higher-resolution intraday data can require extra scopes or approval — verify per provider.\n- **Resting HR** is a once-daily aggregate, not something you can poll for a live number.\n- Cloud data is **latent**: it lands only after the user's device syncs to the vendor cloud, so it is not suitable for hard real-time.\n\nOne honest framing to keep: consumer HR is a general wellness signal, not a clinical diagnostic. Apple's ECG and irregular-rhythm notifications are separate, regulated features — do not present ordinary HR samples as arrhythmia detection.\n\n## Which should you pick?\n\nMatch the source to the shape of HR you need:\n\n- **Live in-workout HR (real-time):** read on-device via a HealthKit workout session or Health Connect, or connect directly to a chest strap over the BLE Heart Rate Profile. Cloud APIs are too latent for this.\n- **All-day and resting HR across many devices:** cloud OAuth per provider, or an aggregator so you avoid maintaining N separate integrations.\n- **Activity route plus HR for athletes:** Strava streams — but note they are workout-scoped only, with no resting or continuous all-day HR.\n- **On-device privacy over cloud reach:** HealthKit and Health Connect keep the read on the user's phone with no server-to-server pull; you upload it yourself only if you need it server-side.\n\n## Before you ship\n\nConfirm the current field names, endpoints, scopes, and device coverage in each provider's live data dictionary — these change often and are flagged \"as of 2026, verify.\" And keep the framing honest: heart rate from a consumer wearable is a measured wellness signal, not a medical-grade or diagnostic reading.",
    "faqs": [
      {
        "q": "Is heart rate from a wearable measured or estimated?",
        "a": "Heart rate itself is measured, not modeled. Most consumer devices read it optically with a PPG sensor (green or infrared LEDs at the wrist or finger); chest straps use electrical, ECG-style sensing. What varies is accuracy under conditions: optical PPG degrades with motion, cold, tattoos, and poor fit, so accuracy depends on the device and situation. Resting and walking-average heart rate are derived aggregates computed from measured samples, not live readings. It is a wellness signal, not a clinical diagnostic."
      },
      {
        "q": "How do I get real-time heart rate into an app?",
        "a": "For live, in-workout HR, read on-device through a HealthKit workout session on iOS or Android Health Connect, or connect directly to a chest strap over the Bluetooth Low Energy Heart Rate Profile. Cloud wearable APIs (Fitbit, Garmin, Oura, WHOOP, Strava) are too latent for hard real-time because their data only lands after the user's device syncs to the vendor cloud. Verify current on-device session behavior in each platform's docs."
      },
      {
        "q": "Which data types expose heart rate on HealthKit and Health Connect?",
        "a": "On Apple HealthKit, general samples come from `HKQuantityTypeIdentifierHeartRate`, with `HKQuantityTypeIdentifierRestingHeartRate`, `walkingHeartRateAverage`, and `heartRateRecoveryOneMinute` for derived values, plus the beat-to-beat `HKDataTypeIdentifierHeartbeatSeries`. On Android Health Connect, use `HeartRateRecord`, a series of BPM samples. Both are on-device reads that need per-type user permission and have no cloud pull. Confirm exact identifiers in each platform's live data dictionary."
      },
      {
        "q": "Can I get all-day and resting heart rate from Strava?",
        "a": "No. Strava exposes heart rate only as a per-workout activity stream in BPM, not resting or continuous all-day HR. For resting HR and continuous intraday data across devices, use per-vendor cloud OAuth (Fitbit, Garmin, Oura, WHOOP) or an aggregator that normalizes them. Note that resting HR is a once-daily derived aggregate, not a value you can poll live. Verify each provider's current fields and scopes."
      },
      {
        "q": "Should I use an aggregator or integrate each wearable directly?",
        "a": "Integrate directly when you support one or two sources or need on-device, low-latency reads; that keeps the data path simple. Use an aggregator such as Terra, Junction, or Rook when you want all-day and resting HR from many wearables behind one normalized schema and webhooks, so you avoid building and maintaining a separate OAuth integration per vendor. Verify each aggregator's current source list and normalized fields in its own docs."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Wearable HR fields, scopes, and device coverage shift often across 2026 - subscribe for plain-English updates when HealthKit, Health Connect, or a wearable API changes what heart-rate data you can read."
    }
  },
  {
    "slug": "hrv-api",
    "primaryQuery": "hrv api",
    "h1": "HRV API: How to Get Heart Rate Variability Data",
    "metaTitle": "HRV API: How to Get Heart Rate Variability Data",
    "metaDescription": "Get HRV data from HealthKit, Health Connect, Oura, WHOOP, Garmin and more. Measured, but RMSSD vs SDNN and the timing window matter. Best pick inside.",
    "updated": "2026-07-24",
    "answer": "HRV is a measured metric from the timing between heartbeats. You read it on-device (Apple HealthKit stores SDNN via HKQuantityTypeIdentifierHeartRateVariabilitySDNN; Android Health Connect gives RMSSD via HeartRateVariabilityRmssdRecord) or from cloud wearable APIs (Oura, WHOOP, Garmin, Fitbit) after sync. It reflects parasympathetic activity, so treat it as a wellness signal, not a stress or recovery measurement. Best pick: Oura or WHOOP for ready-made recovery scoring, Health Connect for a raw RMSSD trend on Android, a chest strap for real-time.",
    "body": "For what HRV actually represents, see [what is HRV](/learn/what-is-hrv).\n\n## Where you can get HRV\n\nHRV needs a wearable — a phone alone cannot measure it. All provider-specific fields, statistics, and device coverage change often, so treat this table as a starting point and confirm against each vendor's live data dictionary (as of 2026, verify).\n\n| Source | How you access it | Notes |\n| --- | --- | --- |\n| Apple HealthKit (iOS) | On-device read with per-type permission; no cloud pull | `HKQuantityTypeIdentifierHeartRateVariabilitySDNN`, stored as **SDNN** in ms. Raw beat series via `HKDataTypeIdentifierHeartbeatSeries` |\n| Android Health Connect | On-device read with per-record permission; no cloud pull | `HeartRateVariabilityRmssdRecord` — **RMSSD** in ms |\n| Oura API v2 | Cloud OAuth 2.0 (post-sync) | HRV in sleep data / derivable from `interbeat_interval`; readiness incorporates nighttime HRV |\n| WHOOP API v2 | Cloud OAuth 2.0 (post-sync) | HRV is a component of the Recovery object (nocturnal) |\n| Garmin Health API | Cloud OAuth 2.0 (post-sync) | HRV Summaries collected over the overnight sleep window; limited device coverage — verify the device list |\n| Fitbit Web API | Cloud OAuth 2.0 (post-sync) | HRV endpoint returns daily **RMSSD measured during sleep**; intraday HRV needs approval |\n| Chest straps (e.g. Polar) | Direct BLE / vendor SDK | Expose RR intervals for real-time HRV — verify the specific product/SDK |\n| Aggregators (Terra, Junction, Rook) | One normalized schema over many providers | Terra lists HRV as a supported normalized type; see [wearable data APIs](/fitness-apis/wearable-data-apis) |\n\nStrava does **not** expose HRV.\n\n## Measured or estimated?\n\nHRV is **measured** — the underlying beat-to-beat intervals are real timing data. What must be hedged is the interpretation. RMSSD **reflects parasympathetic (vagal) influence** on heart rate; it is a correlate, not a direct readout of \"vagal tone,\" \"stress,\" or \"recovery.\" Do not present HRV as something that measures your nervous system or diagnoses anything. Readiness and recovery scores built on HRV (Oura, WHOOP, and others) are **proprietary vendor models**, so describe them as estimates, not clinical measures. Consumer HRV is a general wellness signal, not a medical diagnostic.\n\nTwo accuracy and comparability gotchas to design around:\n\n- **RMSSD vs SDNN are different statistics** and are not directly comparable. Apple gives you SDNN; Health Connect, Fitbit, and most others give RMSSD. Label which one you are storing and never mix them in one trend line.\n- **Measurement window matters.** Most consumer platforms compute HRV over a **nocturnal/overnight** window for comparability (Oura, WHOOP, Garmin, Fitbit-during-sleep); some apps instead use a guided **morning spot reading**. Night and morning values are not interchangeable — surface which window a reading came from. And because absolute HRV varies enormously between people, it is meant for **within-person trends**, not cross-person comparison. Verify which statistic and which time window each provider returns before you normalize.\n\n## Which source should you pick?\n\n- **Recovery/readiness scoring out of the box:** Oura or WHOOP — nightly HRV is already baked into their readiness/recovery models, so you consume a score rather than build one.\n- **Raw RMSSD trend across Android devices:** Health Connect `HeartRateVariabilityRmssdRecord`, read on-device for privacy and no post-sync latency.\n- **iOS-native app:** HealthKit `HKQuantityTypeIdentifierHeartRateVariabilitySDNN` — but remember it is SDNN, not RMSSD.\n- **Real-time HRV (biofeedback):** a chest strap's RR intervals over BLE/SDK; cloud wearable data is latent and lands only after the device syncs.\n- **Many brands at once:** an aggregator (Terra, Junction, Rook) hands you one normalized HRV schema instead of N integrations. If you are weighing rings against straps, see [Oura vs WHOOP](/compare/oura-vs-whoop).\n\n## Before you ship\n\nField names, statistics (RMSSD vs SDNN), scopes, and device coverage are volatile — re-verify each against the vendor's current data dictionary as of 2026. Label the statistic and the measurement window on every stored value, and frame HRV as a within-person wellness signal that reflects vagal activity, not a diagnostic or a direct measure of stress or recovery.",
    "faqs": [
      {
        "q": "Is HRV measured or estimated?",
        "a": "The HRV value itself is measured from real beat-to-beat interval timing. What is not a direct measurement is the interpretation: RMSSD reflects parasympathetic (vagal) influence on heart rate, so it is a wellness signal, not a readout of stress, recovery, or nervous-system health. Recovery and readiness scores built on HRV are proprietary vendor models."
      },
      {
        "q": "What is the difference between RMSSD and SDNN in HRV APIs?",
        "a": "They are two different statistics computed from the same interbeat intervals and are not directly comparable. Apple HealthKit stores SDNN; Android Health Connect, Fitbit, and most other sources report RMSSD. Always label which one you store and never mix them in a single trend."
      },
      {
        "q": "Can I get HRV from a phone without a wearable?",
        "a": "No. HRV needs a device that captures beat-to-beat intervals, so it requires a wearable (ring, watch, band) or a chest strap. A phone alone cannot produce it. Verify each provider's device coverage in its live data dictionary, as coverage changes."
      },
      {
        "q": "Why do Oura and WHOOP HRV values differ from a morning app reading?",
        "a": "Most consumer platforms compute HRV over a nocturnal/overnight window for comparability, while some apps use a guided morning spot reading. The two windows are not interchangeable, and absolute HRV varies a lot between people, so HRV is meant for within-person trends. Surface which window each reading came from."
      },
      {
        "q": "Which API is best for HRV?",
        "a": "For recovery or readiness scoring out of the box, Oura or WHOOP, which bake nightly HRV into their models. For a raw RMSSD trend on Android, Health Connect. On iOS, HealthKit (SDNN). For real-time biofeedback, a chest strap's RR intervals over BLE. To combine many brands, an aggregator like Terra or Junction."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-hrv",
        "label": "What is HRV?"
      },
      {
        "href": "/compare/oura-vs-whoop",
        "label": "Oura vs WHOOP"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Want the RMSSD-vs-SDNN and measurement-window gotchas flagged before they bite your roadmap? Get our developer notes on wearable data."
    }
  },
  {
    "slug": "vo2-max-api",
    "primaryQuery": "vo2 max api",
    "h1": "VO2 Max API: How to Get VO2 Max Data",
    "metaTitle": "VO2 Max API: How to Get VO2 Max Data (2026)",
    "metaDescription": "Get VO2 max via API: HealthKit, Health Connect, Garmin, Fitbit, Oura. Consumer VO2 max is estimated, not lab-measured. Sources, accuracy, best pick.",
    "updated": "2026-07-24",
    "answer": "You get VO2 max by reading an on-device store (Apple HealthKit HKQuantityTypeIdentifierVO2Max, Android Health Connect Vo2MaxRecord) or by pulling a cloud wearable API (Garmin User Metrics, Fitbit's Cardio Fitness Score, Oura) over OAuth 2.0. Be honest that consumer VO2 max is estimated, not lab-measured: it is modeled from heart-rate response versus pace or power plus demographics, so it is a fitness-trend signal, not a clinical value. Not every provider exposes it and coverage is device-dependent. Best pick: HealthKit for Apple apps, Garmin or Fitbit for a cross-device trend, and an aggregator when you mix brands.",
    "body": "For what the number actually represents, see [what is VO2 max](/learn/what-is-vo2-max).\n\n## Where you can get VO2 max\n\nVO2 max shows up in two access models: on-device stores you read with the user's permission (no cloud pull), and cloud wearable APIs behind `OAuth 2.0` that deliver data after the user's device syncs. Field names and device coverage change often, so treat everything below as \"as of 2026, verify in the provider's data dictionary.\"\n\n| Source | How you access it | Notes |\n|---|---|---|\n| Apple HealthKit | On-device read of `HKQuantityTypeIdentifierVO2Max` | \"Maximal oxygen consumption during exercise\"; iOS-only, no server-to-server pull |\n| Android Health Connect | On-device read of `Vo2MaxRecord` | Includes a `measurementMethod` field (e.g. metabolic-cart vs. estimated) — verify the exact enum values in the reference |\n| Garmin Health API | Cloud `OAuth 2.0`; VO2 max under User Metrics summaries | Post-sync latency; device-dependent |\n| Fitbit Web API | Cloud `OAuth 2.0`; Cardio Fitness Score endpoint (`cardioscore`) | Labeled \"Cardio Fitness Score (VO2 Max)\" |\n| Oura API v2 | Cloud `OAuth 2.0`; daily VO2 max value | Verify the exact endpoint name in the live docs |\n| WHOOP API | Cloud `OAuth 2.0` | Not a headline field historically — verify against the current v2 data dictionary before claiming it |\n| Strava | — | No VO2 max field; activity data only |\n| Aggregators (Terra, Junction, Rook) | One normalized schema across many providers | Useful to reconcile differently-named \"VO2 max\" / \"Cardio Fitness\" fields |\n\nA key caveat: **not all providers expose VO2 max**, and where they do, estimating it often requires qualifying outdoor activities (GPS runs or walks with heart rate). Verify per provider and per device rather than assuming the field is populated.\n\n## Measured or estimated?\n\nEstimated — on every consumer device. True VO2 max is a lab measurement: a graded exercise test with a metabolic cart measuring the oxygen you actually consume at max effort. What a watch or ring reports is a **model**, derived from your heart-rate response relative to pace or power during activity, combined with profile data like age, weight, and sex. Two things follow from that:\n\n- **Values update infrequently and can go stale.** Many devices only refresh the estimate after qualifying outdoor activities with heart rate and pace or GPS. Indoor-only or low-activity users may see stale or absent values.\n- **Numbers are not comparable across brands.** Vendors label it differently (\"VO2 max,\" \"Cardio Fitness Score,\" \"Cardio Fitness\") and use different estimation models, so the same person can get different values on different devices. Treat it as a within-person trend, not a cross-brand or clinical figure.\n\nFrame it in your UI as a general fitness and wellness signal, not a diagnostic. Do not publish a specific accuracy percentage or imply clinical validity — accuracy varies with device, fitness level, and activity type, and none of these are lab-grade.\n\n## Which should you pick?\n\n- **Apple ecosystem:** read `HKQuantityTypeIdentifierVO2Max` from HealthKit on-device — the least-friction path for an iOS app, and it inherits whatever the Apple Watch estimated.\n- **Cross-device trend:** Garmin User Metrics VO2 max or Fitbit's Cardio Fitness Score, pulled server-side via `OAuth 2.0` after the user's device syncs.\n- **Mixing brands:** normalize through an aggregator so you handle one schema instead of several differently-named fields. See [wearable data APIs](/fitness-apis/wearable-data-apis) for that route.\n- **Android:** read `Vo2MaxRecord` from Health Connect on-device; check its `measurementMethod` so you know whether a given value is estimated or (rarely) from a metabolic cart.\n\nIf you are weighing the on-device stores against each other, [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect) covers how the two permissioned-read models differ.\n\n## Before you ship\n\nConfirm which providers actually expose VO2 max and on which devices — coverage is uneven and volatile. Re-check field names, endpoints, and the Health Connect `measurementMethod` enum against each vendor's current data dictionary before you build. And keep the honest framing front and center: consumer VO2 max is an estimate and a wellness signal, not a lab measurement or a medical diagnostic.",
    "faqs": [
      {
        "q": "Is VO2 max from a watch accurate?",
        "a": "Consumer VO2 max is an estimate, not a lab measurement, so treat it as a fitness-trend signal rather than a precise value. Accuracy varies with device, fitness level, and activity type, and the estimate often only refreshes after qualifying outdoor activities with heart rate and pace or GPS. There is no single accuracy percentage to quote; verify each provider's method in its data dictionary."
      },
      {
        "q": "Which APIs expose VO2 max data?",
        "a": "Apple HealthKit exposes HKQuantityTypeIdentifierVO2Max on-device, Android Health Connect exposes Vo2MaxRecord, and cloud wearable APIs include Garmin (User Metrics), Fitbit (Cardio Fitness Score), and Oura. WHOOP has not historically been a headline field, and Strava has no VO2 max field. Not all providers expose it and coverage is device-dependent, so verify per provider as of 2026."
      },
      {
        "q": "Is consumer VO2 max measured or estimated?",
        "a": "Estimated on every consumer device. True VO2 max comes from a lab graded-exercise test with a metabolic cart. Watches and rings model it from your heart-rate response relative to pace or power during activity plus profile data like age, weight, and sex. Health Connect's Vo2MaxRecord even carries a measurementMethod field distinguishing estimated from metabolic-cart values."
      },
      {
        "q": "Can I compare VO2 max across Garmin, Fitbit, and Apple?",
        "a": "Not directly. Vendors label it differently (VO2 max, Cardio Fitness Score, Cardio Fitness) and use different estimation models, so the same person can get different numbers on different devices. Use it as a within-person trend, and normalize through an aggregator if you need one consistent field across brands."
      },
      {
        "q": "How do I read VO2 max in an iOS or Android app?",
        "a": "On iOS, request permission and read HKQuantityTypeIdentifierVO2Max from HealthKit on-device; there is no Apple cloud pull. On Android, read Vo2MaxRecord from Health Connect with the granted permission. Both are permissioned on-device reads, so verify the current type and field names in Apple's and Google's data dictionaries before you build."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-vo2-max",
        "label": "What is VO2 max?"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "We unpack a fitness or wearable data type every week, measured-versus-estimated caveats and provider gotchas included, so subscribe before you wire up VO2 max."
    }
  },
  {
    "slug": "blood-oxygen-api",
    "primaryQuery": "blood oxygen spo2 api",
    "h1": "Blood Oxygen (SpO2) API: How to Get SpO2 Data",
    "metaTitle": "Blood Oxygen (SpO2) API: Sources & How to Access",
    "metaDescription": "Get SpO2/blood oxygen data from HealthKit, Health Connect, Fitbit, Garmin, Oura, and WHOOP. Measured but wellness-grade, not a medical diagnostic.",
    "updated": "2026-07-24",
    "answer": "Blood oxygen (SpO2) is measured by optical pulse oximetry on wrist wearables and finger rings, but on consumer devices it is a general-wellness signal, not an FDA-cleared diagnostic. You can read it from on-device stores (HealthKit oxygenSaturation, Health Connect OxygenSaturationRecord) or cloud wearable APIs (Fitbit, Garmin, Oura, WHOOP), most of which report an overnight trend rather than continuous daytime readings. Best pick: Oura, Fitbit, or Garmin for overnight trends; HealthKit for an on-demand iOS spot check, subject to Apple Watch US availability caveats.",
    "body": "If you are choosing between sources more broadly, see the [wearable data APIs](/fitness-apis/wearable-data-apis) overview and the [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data) explainer.\n\n## Where you can get blood oxygen data\n\nField names, scopes, and device coverage change often. Treat every row as \"as of 2026, verify in the provider's live data dictionary.\"\n\n| Source | How you access it | Notes |\n| --- | --- | --- |\n| Apple HealthKit (iOS) | On-device read of `HKQuantityTypeIdentifierOxygenSaturation` after user permission | On-device only, no cloud pull. US availability is unsettled — see caveat below. See the [HealthKit integration guide](/integrate/healthkit). |\n| Android Health Connect | On-device read of `OxygenSaturationRecord` (a single SpO2 reading) | On-device datastore other apps write into; you read with granted permission. |\n| Fitbit Web API | Cloud OAuth 2.0; daily SpO2 (intraday with approval) | Commonly an overnight/estimated oxygen variation, not continuous daytime SpO2. |\n| Garmin Health API | Cloud OAuth 2.0; Pulse Ox summaries | Device-dependent; verify coverage per model. |\n| Oura API v2 | Cloud OAuth 2.0; `daily_spo2` (overnight average), `spo2` scope | Overnight average, not spot. |\n| WHOOP API v2 | Cloud OAuth 2.0; SpO2 on supporting hardware | Contributes to Recovery on supporting devices — verify current device and field. |\n| Aggregators (Terra, Junction, Rook) | One normalized schema + webhooks across the above | Normalize SpO2 where the underlying source provides it. See [health data aggregator APIs](/fitness-apis/health-data-aggregator-apis). |\n\nAccess model in one line: HealthKit and Health Connect are on-device permissioned reads with no cloud endpoint; Fitbit, Garmin, Oura, and WHOOP are cloud OAuth where data lands only after the user's device syncs; aggregators sit on top and hand you one schema across many providers.\n\n## Measured or estimated?\n\nSpO2 is **measured** by an optical sensor, not modeled — but two things need honest framing:\n\n- **Wellness signal, not diagnostic.** Consumer SpO2 is a general fitness and wellness signal. These devices are not FDA-cleared diagnostics; Apple, for example, used the general-wellness regulatory pathway. Do not present the data as a way to detect or monitor hypoxemia or disease, and do not treat it as equivalent to a clinical pulse oximeter.\n- **Spot vs overnight.** There are two capture modes: on-demand **spot readings** (the user initiates and must hold still) and **overnight/background** trend sampling. Many sources report an overnight average or oxygen *variation* rather than continuous daytime SpO2 — confirm which a given provider returns before you build UI around it.\n\nAccuracy gotchas: motion, cold hands, fit, and skin factors all affect optical SpO2. Do not publish a fixed accuracy margin — none is sourced, and it varies by device and conditions.\n\n**Apple Watch US availability caveat (verify current status).** Apple Watch's Blood Oxygen feature was disabled on new US units after a 2023 US ITC exclusion order in the Masimo patent dispute, then restored in the US around August 2025 via an iOS/watchOS update using a reworked flow that computes the reading on the paired iPhone. Litigation and ITC action were ongoing into late 2025. As of 2026, availability and behavior differ by watch model, region, and OS version — do **not** assume the HealthKit `HKQuantityTypeIdentifierOxygenSaturation` type is populated on a given US device. Verify current US availability before you rely on it.\n\n## Which source should you pick?\n\n- **Overnight SpO2 trend (sleep or altitude wellness):** Oura `daily_spo2`, Fitbit, or Garmin Pulse Ox — these are built around the overnight window.\n- **On-demand spot check in an iOS app:** HealthKit `HKQuantityTypeIdentifierOxygenSaturation`, subject to the Apple Watch availability caveat above.\n- **Android, single reading:** Health Connect `OxygenSaturationRecord`.\n- **Many devices behind one integration:** an aggregator (Terra, Junction, Rook) to normalize SpO2 across providers and avoid building each OAuth flow yourself.\n\n## Before you ship\n\nRe-verify each provider's device coverage, whether values are spot or overnight, and the exact scope and field names against its current data dictionary — these are volatile. Keep the framing honest: consumer SpO2 is a general-wellness signal, not a medical diagnosis, and the Apple Watch US situation is still moving — check current availability rather than assuming.",
    "faqs": [
      {
        "q": "Is consumer SpO2 data a medical measurement?",
        "a": "No. SpO2 is genuinely measured by an optical sensor, but consumer wearables and rings are marketed as general fitness and wellness devices that are not intended for medical use and are not FDA-cleared diagnostics. Do not treat their SpO2 data as a substitute for a medical pulse oximeter or as a way to detect or monitor disease."
      },
      {
        "q": "Which platform data types expose blood oxygen?",
        "a": "On iOS, Apple HealthKit exposes HKQuantityTypeIdentifierOxygenSaturation as an on-device permissioned read. On Android, Health Connect exposes OxygenSaturationRecord (a single reading). Cloud wearable APIs use OAuth: Oura returns daily_spo2, and Fitbit, Garmin, and WHOOP expose their own SpO2 fields. Verify exact field names and scopes in each provider's current data dictionary."
      },
      {
        "q": "Can I get an Apple Watch blood oxygen reading in the US?",
        "a": "It depends and is unsettled. Apple Watch's Blood Oxygen feature was disabled on new US units after a 2023 ITC order, then restored around August 2025 via a reworked flow that computes the reading on the paired iPhone, with litigation ongoing into late 2025. As of 2026, availability differs by model, region, and OS version, so do not assume the HealthKit oxygenSaturation type is populated. Verify current US availability."
      },
      {
        "q": "Do wearables give continuous SpO2 or just overnight readings?",
        "a": "Both modes exist, but they differ by source. On-demand spot readings require the user to initiate and hold still; overnight or background sampling produces a trend. Many providers report only an overnight average or oxygen variation rather than continuous daytime SpO2, so confirm which mode a given source returns before building around it."
      },
      {
        "q": "What is the easiest way to read SpO2 across many devices?",
        "a": "Use an aggregator such as Terra, Junction, or Rook, which normalize SpO2 across providers behind one schema and webhooks where the underlying source supplies it. This avoids building a separate OAuth integration for each wearable, though coverage still depends on what each device and vendor expose."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Building health features on measured-vs-estimated data? Get our newsletter on wearable APIs, HealthKit, and staying on the wellness-not-diagnostic side of the line."
    }
  },
  {
    "slug": "sleep-tracking-api",
    "primaryQuery": "sleep tracking api",
    "h1": "Sleep Tracking API: How to Get Sleep Data Into Your App",
    "metaTitle": "Sleep Tracking API: How to Get Sleep Data",
    "metaDescription": "Get sleep data via API from Oura, WHOOP, Fitbit, Garmin, HealthKit and Health Connect. Duration is measured, stages are estimated and mapped differently.",
    "updated": "2026-07-24",
    "answer": "Sleep data comes from devices worn overnight (Oura, WHOOP, Fitbit, Garmin, Apple Watch) via on-device stores (HealthKit's HKCategoryTypeIdentifierSleepAnalysis, Health Connect's SleepSessionRecord) or cloud OAuth APIs. Duration is measured reasonably well, but sleep stages are estimated from motion and heart rate and each vendor labels them differently. Best pick: Oura or WHOOP for rich staging plus readiness, or an aggregator to reconcile several brands.",
    "body": "If you want the physiology of the stages themselves, see [what are sleep stages](/learn/what-are-sleep-stages) — this page is about getting the data.\n\n## Where you can get sleep data\n\nSleep needs a device worn overnight. Phones alone typically do not produce reliable staged sleep — treat phone-only \"sleep\" as coarse, and confirm which device actually generated the record. Field names, scopes, and stage enums change often; treat everything below as \"as of 2026, verify\" against each provider's live data dictionary.\n\n| Source | How you access it | Notes |\n| --- | --- | --- |\n| Apple HealthKit (iOS) | On-device read, per-type permission | `HKCategoryTypeIdentifierSleepAnalysis` with `HKCategoryValueSleepAnalysis` values (inBed, awake, asleepUnspecified, and stage-specific asleepCore / asleepDeep / asleepREM on supporting OS versions). No cloud pull — read in-app. Best with an Apple Watch worn to bed. |\n| Android Health Connect | On-device read, per-record permission | `SleepSessionRecord` — a session with start/end and stages (deep, light, REM, awake). On-device datastore other apps write into; no cloud endpoint. |\n| Oura API v2 | Cloud OAuth 2.0 | `/v2/usercollection/sleep` for detailed per-period data including stages and latency, plus `daily_sleep` score and `sleep_time`. Data appears only after an app sync. |\n| WHOOP API v2 | Cloud OAuth 2.0 | Sleep data with Light, REM, and Slow-Wave (Deep) via `v2/cycle/{cycleId}/sleep`. Verify current endpoint and stage fields. |\n| Fitbit Web API | Cloud OAuth 2.0 | Sleep endpoints returning stages (durations in seconds) and sleep type. |\n| Garmin Health API | Cloud OAuth 2.0 | Sleep summaries including sleep stages; coverage is device-dependent. |\n| Aggregators (Terra, Junction, Rook) | One cloud OAuth + normalized schema | Normalize sleep sessions and stages across providers — useful precisely because vendor stage schemas differ. See [wearable data APIs](/fitness-apis/wearable-data-apis). |\n\nNote that Strava exposes no sleep data — it is an activity platform only.\n\n## Measured or estimated?\n\nBe honest about which half you are working with:\n\n- **Duration and time in bed:** measured reasonably well from an overnight-worn device. This is the reliable part.\n- **Sleep stages:** **estimated / modeled** from motion (actigraphy) plus heart rate, HRV, and respiration — not EEG. They are validated against clinical polysomnography only imperfectly. Do not present consumer sleep stages as clinical-grade, and do not use them to diagnose sleep apnea or any sleep disorder. This is a wellness signal, not a diagnostic.\n\nThe headline gotcha for developers is **stage-mapping**. Vendors do not agree on a taxonomy: Apple uses Core / Deep / REM / Awake; others use Light / Deep / REM; WHOOP uses Light / REM / Slow-Wave (Deep). Definitions of \"in bed\" versus \"asleep,\" plus sleep-onset and wake detection, also vary. When you merge sources you must map stages explicitly — you cannot assume a 1:1 equivalence, and you should not claim cross-vendor comparability without documenting that mapping. Do not publish accuracy percentages; none is sourced here, and they vary by device and person. Verify each provider's exact stage enum and field names before shipping any merge logic.\n\nOne more timing note: cloud data is latent. Sleep and readiness values land only after the user opens the vendor app or the device syncs, so this route is not suited to hard real-time.\n\n## Which should you pick?\n\n- **Richest stages plus a readiness or recovery bundle:** Oura or WHOOP, where nightly staging feeds a score out of the box. Compare the two in [Oura vs WHOOP](/compare/oura-vs-whoop).\n- **iOS-native sleep with staging:** HealthKit `HKCategoryTypeIdentifierSleepAnalysis`, with an Apple Watch worn to bed. On-device keeps the data on the user's phone until you choose to upload it.\n- **Android, on-device:** Health Connect `SleepSessionRecord`, inheriting whatever a paired wearable wrote.\n- **Several brands at once:** an [aggregator](/fitness-apis/health-data-aggregator-apis) so you get one normalized schema and can reconcile the differing stage taxonomies in one place instead of N.\n\n## Before you ship\n\nRe-verify each provider's current stage enum, field names, and OAuth scopes against its live data dictionary — these change often. Keep the framing honest with your users: duration is measured, stages are an estimate, and consumer sleep data is a general wellness signal, not a medical diagnostic. If you are combining sources, write down your stage-mapping and surface which device produced each night's record.",
    "faqs": [
      {
        "q": "Are sleep stages from a wearable accurate?",
        "a": "Sleep stages (light, deep, REM, awake) are estimated from movement, heart rate, HRV, and respiration, not from EEG, so they are modeled rather than measured. Duration and time in bed are more reliable. Consumer stages are a wellness signal, not a clinical or diagnostic tool, and accuracy varies by device and person. Verify each provider's method in its data dictionary."
      },
      {
        "q": "Can I get sleep data from a phone without a wearable?",
        "a": "Typically not reliably. Phones alone usually do not produce trustworthy staged sleep, so phone-only sleep should be treated as coarse. Reliable sleep data comes from a wrist wearable or ring worn overnight, such as Oura, WHOOP, Fitbit, Garmin, or Apple Watch. Confirm which device generated any record before using it."
      },
      {
        "q": "Why do sleep stages differ between Oura, WHOOP, and Apple?",
        "a": "Vendors use different stage taxonomies. Apple uses Core, Deep, REM, and Awake; others use Light, Deep, REM; WHOOP uses Light, REM, and Slow-Wave (Deep). Definitions of in-bed versus asleep also vary. If you merge sources you must map stages explicitly and cannot assume a 1:1 match. Verify each provider's stage enum before combining data."
      },
      {
        "q": "How do I access sleep data on iOS and Android?",
        "a": "On iOS, read HealthKit's HKCategoryTypeIdentifierSleepAnalysis on-device with the user's permission. On Android, read Health Connect's SleepSessionRecord, also on-device. Neither is a cloud API. For server-side access across users, use cloud OAuth wearable APIs (Oura, WHOOP, Fitbit, Garmin) or an aggregator. Verify current field names and scopes."
      },
      {
        "q": "Can sleep tracking APIs diagnose sleep disorders?",
        "a": "No. Consumer sleep data is a general wellness signal, not a medical diagnostic. Stages are estimates validated only imperfectly against clinical polysomnography, so they should not be used to diagnose sleep apnea or other disorders. Frame the data as wellness insight and direct users to a clinician for any medical concern."
      }
    ],
    "related": [
      {
        "href": "/learn/what-are-sleep-stages",
        "label": "What are sleep stages?"
      },
      {
        "href": "/compare/oura-vs-whoop",
        "label": "Oura vs WHOOP"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Want the honest breakdown of what wearable APIs actually measure versus estimate? Get our developer newsletter."
    }
  },
  {
    "slug": "step-counting-api",
    "primaryQuery": "step counting api",
    "h1": "Step Counting API: How to Get Step Data",
    "metaTitle": "Step Counting API: How to Get Step Data",
    "metaDescription": "Get step counts from the phone (HealthKit, CMPedometer, Health Connect) or wearables. Handle phone+watch double-counting and pick the right source.",
    "updated": "2026-07-24",
    "answer": "Step counts are widely available because the phone itself can count them - no wearable needed. You get them from an on-device store (Apple HealthKit's stepCount, iOS Core Motion CMPedometer, or Android Health Connect's StepsRecord) or from a cloud wearable API (Garmin, Fitbit, Samsung Health) after the device syncs. Steps are counted, but algorithmically from motion sensors, so treat them as a close estimate rather than exact. Best pick: read the on-device platform store so you inherit the OS's own de-duplication - which matters because a phone plus a paired watch will otherwise double-count.",
    "body": "For how on-device stores differ from cloud APIs, see [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data).\n\n## Where you can get steps\n\nSteps are available from a phone alone (its pedometer) as well as from wearables. Provider-specific field names, records, and device coverage change often, so treat this table as a starting point and confirm against each vendor's live data dictionary (as of 2026, verify).\n\n| Source | How you access it | Notes |\n| --- | --- | --- |\n| Apple HealthKit (iOS) | On-device read with per-type permission; no cloud pull | `HKQuantityTypeIdentifier.stepCount`. HealthKit aggregates and de-duplicates across sources when you query statistics |\n| Core Motion (iOS) | On-device pedometer via `CMPedometer` | Live, low-level phone pedometer, separate from HealthKit; verify exact fields in Apple's Core Motion docs |\n| Android Health Connect | On-device read with per-record permission; no cloud pull | `StepsRecord` (`count`, `startTime`, `endTime`, zone offsets); primary aggregation is `StepsRecord.COUNT_TOTAL` |\n| Garmin Health API | Cloud OAuth 2.0 (post-sync) | Steps listed among daily/interval summary metrics; verify current fields |\n| Fitbit / Samsung Health / Polar / Withings | Cloud OAuth 2.0 (post-sync) | Each exposes daily or interval step summaries via its own API |\n| Aggregators (Terra, Junction, Rook) | One normalized schema over many providers | All normalize steps (Terra day-level summaries include steps); see [wearable data APIs](/fitness-apis/wearable-data-apis) |\n\n## Measured or estimated?\n\nSteps are **counted**, but the count comes from motion-sensor pattern-recognition algorithms interpreting accelerometer data, not from a sensor that registers each literal foot-fall. Treat step counts as algorithmic and close, not exact, and do not attach an accuracy percentage — none is sourced, and figures vary by device, gait, and where the device is carried. This is wellness-grade activity data, not a clinical measurement.\n\nThe headline gotcha is **double-counting across a phone and a paired watch.** When a user carries a phone and wears a watch, both log steps, so a naive sum roughly doubles the total. The platforms provide de-duplication, and you should lean on it rather than summing raw samples yourself:\n\n- **Health Connect:** use `aggregate()` (for example `StepsRecord.COUNT_TOTAL`) rather than summing raw `readRecords()`. Be aware that attribution can span multiple `DataOrigin` package names, and that **on-device step attribution changed in 2026** — legacy readings attributed to the `\"android\"` package versus a newer device Synthetic Package Name. Read and verify the current Health Connect steps guidance before you filter or de-duplicate by origin.\n- **HealthKit:** it de-duplicates across sources when you query statistics rather than raw samples. Verify the current behavior in Apple's HealthKit docs before assuming a given query already merges phone and watch.\n\nBecause both platforms already reconcile multiple sources, the safest design is to read the aggregated total the OS gives you instead of stitching sources together by hand.\n\n## Which source should you pick?\n\n- **Widest reach, least friction:** read the on-device platform store — HealthKit `HKQuantityTypeIdentifier.stepCount` on iOS, Health Connect `StepsRecord` on Android — so you inherit the OS's own multi-source de-duplication and avoid the double-counting trap. See the setup guides for [HealthKit](/integrate/healthkit) and [Google Health Connect](/integrate/google-health-connect).\n- **Live, in-the-moment step count on iOS:** Core Motion's `CMPedometer` gives you low-level pedometer data directly, separate from HealthKit's stored samples.\n- **Server-side without the phone present:** a cloud wearable API (Garmin, Fitbit, Samsung Health, and others) delivers daily or interval step summaries after the device syncs — useful when your backend needs the data and the user's phone is not in the loop.\n- **Many brands at once:** an aggregator (Terra, Junction, Rook) hands you one normalized steps schema instead of N integrations.\n\n## Before you ship\n\nField names, records, aggregation methods, and device coverage are volatile — re-verify each against the vendor's current data dictionary as of 2026. In particular, **confirm the 2026 Health Connect step-attribution change** before shipping any de-duplication logic. Prefer the platform's aggregated total over hand-summed sources to avoid phone-plus-watch double-counting, and frame step counts as an algorithmic wellness signal rather than an exact measurement.",
    "faqs": [
      {
        "q": "Can a phone count steps without a wearable?",
        "a": "Yes. Step counting is one of the few fitness metrics fully available from a phone alone - its accelerometer feeds a pedometer. On iOS you can read stored counts via HealthKit (HKQuantityTypeIdentifier.stepCount) or live data via Core Motion's CMPedometer; on Android you read Health Connect's StepsRecord. A wearable only adds coverage for times the phone is not carried. As of 2026, verify exact fields in each platform's data dictionary."
      },
      {
        "q": "Why do my step counts look doubled?",
        "a": "Because a phone and a paired watch both log steps, so naively summing every source roughly doubles the total. Use the platform's de-duplication instead: on Android, use Health Connect's aggregate() (for example StepsRecord.COUNT_TOTAL) rather than summing raw readRecords(); on iOS, query HealthKit statistics, which de-duplicate across sources. Read the aggregated total the OS provides rather than stitching sources together yourself."
      },
      {
        "q": "Are step counts measured or estimated?",
        "a": "They are counted, but algorithmically - motion-sensor pattern recognition interpreting accelerometer data, not a sensor that registers each literal foot-fall. Treat step counts as a close algorithmic estimate, not ground truth, and do not rely on an exact accuracy figure; accuracy varies by device, gait, and where the device is carried. It is wellness-grade activity data, not a clinical measurement."
      },
      {
        "q": "Did Health Connect change how steps are attributed in 2026?",
        "a": "There is a reported 2026 change to on-device step attribution in Health Connect - legacy readings attributed to the \"android\" package versus a newer device Synthetic Package Name - which affects how you filter or de-duplicate by DataOrigin. Confirm the current Health Connect steps guidance before shipping any de-duplication logic, as this behavior is volatile; verify in the official docs."
      },
      {
        "q": "Which source should I use for step data?",
        "a": "For the widest reach with least friction, read the on-device platform store (HealthKit on iOS, Health Connect on Android) so you inherit the OS's multi-source de-duplication. Use Core Motion's CMPedometer for live counts on iOS. Use a cloud wearable API (Garmin, Fitbit, Samsung Health) when your backend needs data without the user's phone present, or an aggregator to normalize many brands at once."
      }
    ],
    "related": [
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/learn/on-device-vs-cloud-health-data",
        "label": "On-device vs cloud health data"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Step attribution and de-duplication rules keep shifting in 2026 - subscribe for plain-English updates when platform data types and gotchas change."
    }
  },
  {
    "slug": "workout-detection-api",
    "primaryQuery": "workout detection api",
    "h1": "Workout Detection API: Get Recorded Workout Sessions",
    "metaTitle": "Workout Detection API: Get Workout Sessions",
    "metaDescription": "Read workout sessions from HealthKit, Health Connect, Strava and Garmin. Which providers auto-detect vs need a manual start, plus the best pick.",
    "updated": "2026-07-24",
    "answer": "A workout detection API gets you recorded workout sessions with start time, end time, and activity type. You read them on-device (Apple HealthKit HKWorkout on iOS, Android Health Connect ExerciseSessionRecord on Android) or from a cloud activity API (Strava, Garmin, Fitbit) after the device syncs. Some vendors auto-detect activity (Fitbit SmartTrack) while others expect a manual start; duration is measured but activity type is inferred. Best pick: for automatic capture, a wearable that auto-detects; to read what the user already logged, the on-device store.",
    "body": "## Where you can get workout sessions\n\nWhich activity types a source recognizes, and whether it auto-starts, are vendor-specific and change often, so treat this table as a starting point and confirm against each provider's live docs (as of 2026, verify).\n\n| Source | How you access it | Notes |\n| --- | --- | --- |\n| Apple HealthKit (iOS) | On-device read with per-type permission; no cloud pull | `HKWorkout` sessions carry an activity type plus fields like `totalEnergyBurned`. See [the HealthKit integration guide](/integrate/healthkit) |\n| Android Health Connect | On-device read with per-record permission; no cloud pull | `ExerciseSessionRecord` (start time, end time, session type); optional `ExerciseSegment` and `ExerciseLap` sub-intervals |\n| Strava API v3 | Cloud OAuth 2.0 (post-sync) | Activities via the v3 API; see [the Strava integration guide](/integrate/strava-api). Verify current display/usage terms in the Strava API Agreement |\n| Garmin Activity API | Cloud OAuth 2.0 (post-sync) | Exposes captured activities, downloadable as .FIT / GPX / .TCX |\n| Fitbit (SmartTrack) | Cloud OAuth 2.0 (post-sync) | SmartTrack auto-recognizes select activities after sustained movement and logs them without a manual start — verify the current recognized-activity list |\n| Aggregators (Terra, Junction, Rook) | One normalized schema over many providers | Normalize \"workouts/activity\" across sources; see [wearable data APIs](/fitness-apis/wearable-data-apis) |\n\n## Auto-detect vs. manual start\n\nThis is the differentiator to lead with, because it decides whether your app can rely on workouts appearing on their own:\n\n- **Fitbit SmartTrack** auto-recognizes select activities after roughly 15 minutes of movement (a configurable threshold, commonly cited around 10–90 minutes) and logs them with no manual start. Which activity types it recognizes changes — verify the current Fitbit help list rather than hardcoding it.\n- **Apple Watch** generally relies on the user starting and stopping a workout (with reminder prompts to start or end), rather than fully silent logging. Verify current watchOS behavior before claiming auto-detection.\n- **Garmin and Strava** records reflect activities the device or app captured; auto-start behavior varies by device and setting — verify per device.\n\nA second thing to plan around: **activity-type taxonomies differ across sources.** HealthKit's workout activity types, Health Connect's exercise session types, and Strava's and Garmin's activity types are not a 1:1 mapping, so if you merge sources you must map their type enums explicitly rather than assume equivalence. Confirm each taxonomy in the provider's data dictionary.\n\n## Measured or estimated?\n\nA recorded workout mixes measured and modeled parts, and it is worth being explicit about which is which:\n\n- **Duration is measured** — the session's start and end boundaries reflect real elapsed time.\n- **Activity type and session boundaries are algorithmically inferred**, especially for auto-detected workouts. Do not present a detected activity type as certain; SmartTrack classifying a session as \"walk\" vs. \"run\" is a model's guess.\n- **Any derived calories or effort are estimates**, modeled from heart rate, motion, and the user's profile — see how [calorie tracking](/data/calorie-tracking-api) burns are modeled. These disagree across devices, so never publish an accuracy figure.\n\nNote the distinction this page is built on: a **recorded workout session** (what HealthKit, Health Connect, Strava, and Garmin give you) is not the same as **AI camera-based rep or exercise detection**, which classifies movement from a video/pose feed in real time. That is a separate capability covered under [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) — don't conflate the two.\n\n## Which source should you pick?\n\n- **You need workouts captured automatically:** source from a wearable/vendor that does auto-detection (for example Fitbit SmartTrack). Verify each vendor's current capabilities, because auto-detection support and the recognized-activity list change.\n- **You just need to read what the user already logged:** read the on-device platform store — `HKWorkout` on iOS, `ExerciseSessionRecord` on Android — for the broadest coverage and no post-sync latency, since it inherits whatever apps wrote into the OS.\n- **You want route and per-workout detail across many athletes:** Garmin's Activity API delivers standard .FIT/GPX/.TCX files; use Strava only after confirming its display and usage restrictions fit your product.\n- **You want many brands behind one schema:** an aggregator (Terra, Junction, Rook) normalizes workouts across sources so you avoid N integrations.\n\n## Before you ship\n\nAuto-detection availability, the list of recognized activity types, activity-type enums, scopes, and field names are all volatile — re-verify each against the vendor's current docs as of 2026. Map activity-type taxonomies explicitly when merging sources, treat a detected activity type as a model's inference rather than fact, and remember that camera-based rep detection is a different capability entirely.",
    "faqs": [
      {
        "q": "Which providers auto-detect workouts vs. require a manual start?",
        "a": "Fitbit SmartTrack auto-recognizes select activities after sustained movement and logs them with no manual start, while Apple Watch generally relies on the user starting and stopping a workout. Garmin and Strava records reflect whatever the device or app captured, and auto-start varies by device and setting. Which activity types are auto-detected changes, so verify each vendor's current docs rather than hardcoding a list."
      },
      {
        "q": "How do I read workout sessions on iOS and Android?",
        "a": "On iOS, read Apple HealthKit's HKWorkout on-device with per-type permission; each session carries an activity type plus fields like totalEnergyBurned. On Android, read Health Connect's ExerciseSessionRecord (start time, end time, session type), with optional ExerciseSegment and ExerciseLap sub-intervals. Both are on-device stores, so there is no cloud pull and no post-sync latency."
      },
      {
        "q": "Is a detected workout type accurate?",
        "a": "The session's duration is measured, but the activity type and session boundaries are algorithmically inferred, especially for auto-detected workouts, so treat the type as a model's guess rather than certain. Any derived calories or effort are estimates that differ across devices. Do not present a detected activity type as fact, and do not publish accuracy percentages."
      },
      {
        "q": "Is this the same as AI camera-based rep counting?",
        "a": "No. This page covers recorded workout sessions from HealthKit, Health Connect, Strava, and Garmin. AI camera-based rep or exercise detection classifies movement from a video or pose feed in real time and is a separate capability, covered under AI workout tracking APIs."
      },
      {
        "q": "How do I merge workouts from different sources?",
        "a": "Activity-type taxonomies differ across HealthKit, Health Connect, Strava, and Garmin, so their type enums are not a 1:1 mapping. If you combine sources, map the taxonomies explicitly instead of assuming equivalence, and confirm each enum in the provider's data dictionary. An aggregator like Terra, Junction, or Rook can normalize workouts across brands for you."
      }
    ],
    "related": [
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
      },
      {
        "href": "/integrate/strava-api",
        "label": "Integrate the Strava API"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Want the auto-detect-vs-manual and activity-taxonomy gotchas flagged before they hit your roadmap? Get our developer notes on wearable data."
    }
  },
  {
    "slug": "gps-activity-api",
    "primaryQuery": "gps activity route api",
    "h1": "GPS Activity API: How to Get Route Data from Workouts",
    "metaTitle": "GPS Activity Route API: Get Workout Route Data",
    "metaDescription": "Get GPS route data from HealthKit, Health Connect, Strava and Garmin. Coordinates are measured but noisy; watch Strava's display terms. Best pick inside.",
    "updated": "2026-07-24",
    "answer": "GPS route data comes from an on-device store (Apple HealthKit HKWorkoutRoute on iOS, Android Health Connect ExerciseRoute on Android) or a cloud activity API (Strava streams, Garmin Activity API) after the device syncs. The coordinates are measured by the device's GPS/GNSS but are noisy, so filter low-accuracy samples and never quote a positional-accuracy figure. Best pick: on-device routes (HKWorkoutRoute / ExerciseRoute) to show a user their own route; Garmin's Activity API for server-side pulls across users; Strava only after confirming its display and data-combination restrictions.",
    "body": "For workout sessions themselves, see [workout detection](/data/workout-detection-api); for the broader landscape, see [wearable data APIs](/fitness-apis/wearable-data-apis).\n\n## Where you can get GPS route data\n\nRoute data can come from a phone (which has GPS) or a GPS-capable watch or bike computer; a non-GPS wearable relies on the connected phone's location. All provider-specific fields, formats, and terms change often, so treat this table as a starting point and confirm against each vendor's live data dictionary (as of 2026, verify).\n\n| Source | How you access it | Notes |\n| --- | --- | --- |\n| Apple HealthKit (iOS) | On-device read with per-type permission plus OS location permission; no cloud pull | `HKWorkoutRoute` (route attached to a workout), read via `HKWorkoutRouteQuery`, built via `HKWorkoutRouteBuilder` |\n| Android Health Connect | On-device read with per-record permission plus location permission; no cloud pull | `ExerciseRoute` — a sequence of `ExerciseRoute.Location` points tied to an exercise session, not an independent record. Google advises filtering low-accuracy GPS samples and using a foreground service when recording |\n| Strava API | Cloud OAuth 2.0 (post-sync) | **Streams** are the raw time-series for an activity/segment (GPS lat/lng, altitude, and more), documented as 11 stream types, all equal length and index-aligned; Routes can export to GPX/TCX. Display and usage restrictions apply — see below. See [Strava API](/integrate/strava-api) |\n| Garmin Activity API | Cloud OAuth 2.0 (post-sync) | Delivers captured activity files in `.FIT`/`GPX`/`.TCX` with full route detail. See [Garmin API](/integrate/garmin-api) |\n| Aggregators (Terra, Junction, Rook) | One normalized schema over many providers | Terra lists GPS routes among workout data — verify the current source list in its own docs |\n\n## Measured or estimated?\n\nGPS coordinates are **measured** by the device's GNSS receiver — this is real positional data, not a model. But the measurement is noisy: it is subject to accuracy error, drift near buildings or tree cover, and vendor smoothing. That is exactly why Health Connect tells you to **filter low-accuracy samples** before writing a route. Distance and pace derived from a route are computations over those noisy points, so two apps can report slightly different distances for the same activity. Never quote a positional-accuracy number — accuracy varies by device, sky view, and conditions.\n\n## The Strava restriction trap (verify current terms)\n\nStrava is the biggest gotcha on this page, and it is a terms problem, not a technical one:\n\n- **Rate limits and tightening access.** Strava enforces API rate limits and has been narrowing access. For example, the Explore Segments endpoint is documented as moving to an approved \"Extended Access\" tier, per the Strava changelog (effective date around Sept 2026 — verify current status in the [Strava changelog](https://developers.strava.com/docs/changelog/)).\n- **Display and data-combination rules.** Strava's API Agreement restricts how its data may be **displayed** and **combined with other providers' data**. Common designs — such as merging Strava routes with other sources onto one map — can be blocked by these terms.\n\nBecause these terms change and can quietly break a feature after you have built it, treat all Strava display and combination rules as \"verify in the current Strava API Agreement\" before you commit to a design. Confirm the current status of any endpoint tier and the brand/display rules directly with Strava.\n\n## Which source should you pick?\n\n- **Showing a user their own route (least restrictive):** the on-device path — `HKWorkoutRoute` on iOS, `ExerciseRoute` on Android. You read it in-app with location permission, no cloud terms to navigate, and no post-sync latency.\n- **Pulling routes server-side across many users:** Garmin's Activity API is straightforward because it hands you standard file formats (`.FIT`/`GPX`/`.TCX`) with full route detail.\n- **Strava-specific data (segments, athlete activities):** use it only after confirming its display and usage restrictions fit your product; do not assume you can combine it freely with other sources.\n- **Many brands at once:** an aggregator (Terra, Junction, Rook) normalizes GPS routes into one schema across providers — but you inherit each underlying provider's terms, Strava's included.\n\n## Before you ship\n\nRoute fields, export formats, endpoint access tiers, and API terms are volatile — re-verify each against the vendor's current data dictionary and agreement as of 2026. Filter low-accuracy GPS samples before you store or draw a route, never publish a positional-accuracy figure, and treat Strava's display and data-combination rules as the item most likely to block your design. When you need location permission plus on-device stores versus a cloud pull, see [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data).",
    "faqs": [
      {
        "q": "Is GPS route data measured or estimated?",
        "a": "The coordinates are measured by the device's GNSS/GPS receiver, not modeled. But the measurement is noisy: it drifts near buildings or tree cover and is subject to vendor smoothing, which is why Health Connect advises filtering low-accuracy samples before writing a route. Any distance or pace derived from the route is a computation over those imperfect points, so figures can differ slightly between apps. Never publish a positional-accuracy number; accuracy varies by device and conditions."
      },
      {
        "q": "Can I get GPS route data from a phone without a wearable?",
        "a": "Yes. A phone has GPS, so it can record a route on its own, and a GPS-capable watch or bike computer can too. A non-GPS wearable relies on the connected phone's location. On-device recording needs the OS location permission, and Google recommends a foreground service when capturing a route on Android."
      },
      {
        "q": "What are Strava's API restrictions for route data?",
        "a": "Strava enforces rate limits and has been tightening access; for example the Explore Segments endpoint is documented as moving to an approved Extended Access tier per the Strava changelog. Its API Agreement also restricts how Strava data may be displayed and combined with other providers' data, which can block common designs like merging Strava routes with other sources onto one map. These terms change, so verify the current Strava API Agreement before you build."
      },
      {
        "q": "Which API is best for GPS route data?",
        "a": "To show a user their own route, the on-device path is least restrictive: HKWorkoutRoute on iOS, ExerciseRoute on Android. To pull routes server-side across many users, Garmin's Activity API is straightforward because it delivers standard .FIT, GPX, and .TCX files. Use Strava only after confirming its display and data-combination restrictions fit your product. To combine many brands, an aggregator like Terra, Junction, or Rook normalizes routes, but you inherit each provider's terms."
      },
      {
        "q": "How do HealthKit and Health Connect expose route data?",
        "a": "On iOS, HealthKit stores a route as HKWorkoutRoute attached to a workout; you read it with HKWorkoutRouteQuery and build it with HKWorkoutRouteBuilder. On Android, Health Connect exposes ExerciseRoute, a sequence of ExerciseRoute.Location points tied to an exercise session rather than an independent record. Both are on-device reads that require the OS location permission. Verify exact field names in each platform's data dictionary."
      }
    ],
    "related": [
      {
        "href": "/integrate/strava-api",
        "label": "Integrate the Strava API"
      },
      {
        "href": "/integrate/garmin-api",
        "label": "Integrate the Garmin API"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Want Strava's display and data-combination restrictions flagged before they break your route map? Get our developer notes on wearable data."
    }
  },
  {
    "slug": "calorie-tracking-api",
    "primaryQuery": "calorie tracking api",
    "h1": "Calorie Tracking API: How to Get Calorie Data",
    "metaTitle": "Calorie Tracking API: Get Burned & Consumed Data",
    "metaDescription": "Get calorie data from HealthKit, Health Connect and wearables. Burned calories are estimates; consumed needs a nutrition API like Nutritionix.",
    "updated": "2026-07-24",
    "answer": "Calorie tracking is two different problems. Calories burned is a modeled estimate, not a measurement: read it on-device (Apple HealthKit activeEnergyBurned and basalEnergyBurned; Android Health Connect ActiveCaloriesBurnedRecord and TotalCaloriesBurnedRecord) or from cloud wearable APIs after sync. Calories consumed never comes from a wearable and needs a dedicated nutrition API such as Nutritionix or Edamam. Best pick: read the on-device energy types for burn and pair a nutrition API for intake. Both burn figures are estimates that differ across devices.",
    "body": "## Calories burned: where you can get it (and why it's an estimate)\n\nLead with the caveat: **calories burned are modeled estimates, not measurements.** The same workout yields different numbers on different devices because each vendor uses a proprietary algorithm over heart rate, motion, activity type, and user profile (age, weight, sex). Basal/resting energy in particular is a modeled baseline from a BMR formula, not anything sensed live. Never publish an accuracy percentage — none is sourced — and treat every field name below as \"as of 2026, verify\" against the provider's live data dictionary.\n\n| Source | How you access it | Notes |\n| --- | --- | --- |\n| Apple HealthKit (iOS) | On-device read, per-type permission | `activeEnergyBurned` (active/exercise energy) and `basalEnergyBurned` (resting energy); `HKWorkout.totalEnergyBurned` for a single workout. No cloud pull — read in-app. |\n| Android Health Connect | On-device read, per-record permission | `ActiveCaloriesBurnedRecord` (active only) and `TotalCaloriesBurnedRecord` (active + basal/BMR). Apps differ: some write \"total,\" some write \"active,\" so the same activity can appear under different records. |\n| Cloud wearables (Garmin, Fitbit, etc.) | Cloud OAuth 2.0 | Calories exposed in each vendor's API, available after the device syncs. Verify exact fields per provider. |\n| Aggregators (Terra, Junction, Rook) | One cloud OAuth + normalized schema | Normalize burned-calorie data across many sources behind one schema. See [wearable data APIs](/fitness-apis/wearable-data-apis). |\n\nThe developer gotcha here is **active versus total**. On HealthKit, `activeEnergyBurned` and `basalEnergyBurned` are separate — sum them yourself if you want an all-day total, and don't double-count against a workout's `totalEnergyBurned`. On Health Connect, `TotalCaloriesBurnedRecord` already includes basal while `ActiveCaloriesBurnedRecord` does not, so mixing them, or summing across apps that populate them differently, will inflate the number. Verify how each source populates these before you add anything up.\n\n## Calories consumed: this needs a nutrition API, not a wearable\n\nNo wearable, phone sensor, or on-device motion model can tell you what someone ate. Calories consumed comes from **food-logging against a nutrition database**, which means a dedicated REST API:\n\n- **[Nutritionix](/integrate/nutritionix-api)** — a food/nutrition database with natural-language food logging. Verify current endpoints, pricing, and terms in its developer docs.\n- **Edamam** — a Nutrition Analysis API that parses natural-language food (\"1 cup rice, 10 oz chickpeas\") and returns calories plus roughly 28 macro- and micronutrients, with a food-logging nutrition mode. Verify current fields and quotas in its docs.\n\nYou can also store and read logged intake on-device: HealthKit exposes dietary energy (`dietaryEnergyConsumed`) and Health Connect has a `NutritionRecord` — verify exact field names in each platform's data dictionary. But those are stores for intake a user or app already logged, not a source of nutrition facts; the facts still come from a nutrition database. Compare providers in [nutrition APIs](/fitness-apis/nutrition-apis) rather than duplicating that here.\n\n## Measured or estimated?\n\n- **Calories burned:** **estimated / modeled.** Derived from heart rate, motion, activity type, and user profile via proprietary per-vendor algorithms. Numbers disagree across devices for the same activity; basal energy is a formula-based baseline. Say this plainly to your users and never present it as a measurement.\n- **Calories consumed:** as good as the food database and the user's logging. A nutrition API returns database values for the item logged — accurate for the matched food, but dependent on the user picking the right item and portion. It is a lookup, not a measurement of the specific meal.\n\nNeither figure is sensor ground truth. Framing calorie data as a precise readout is misleading; treat both as wellness estimates.\n\n## Which should you pick?\n\n- **Calories burned, widest coverage:** read the on-device platform energy types (active + basal on HealthKit; active + total on Health Connect) so you inherit whatever a paired wearable wrote. Keep on-device data on the user's phone until you choose to upload it.\n- **Calories burned, server-side:** pull from the wearable vendor's cloud API or an [aggregator](/fitness-apis/health-data-aggregator-apis) when you need the data without the user's phone in the loop.\n- **Calories consumed:** a dedicated [nutrition API](/fitness-apis/nutrition-apis) — [Nutritionix](/integrate/nutritionix-api) or Edamam. A wearable API will never give you intake, so this is a separate integration.\n\n## Before you ship\n\nRe-verify each provider's current energy field names, records, and OAuth scopes against its live data dictionary — these change. Distinguish active from total/basal so you don't double-count. Be explicit with users that calories burned are a modeled estimate that varies by device, and that calories consumed depend on a nutrition database plus accurate logging. For the mechanics of the burn estimate itself, hand off to [how fitness apps estimate calories](/learn/how-fitness-apps-estimate-calories).",
    "faqs": [
      {
        "q": "Are calories burned measured or estimated?",
        "a": "Estimated. Calories burned is a model derived from heart rate, motion, activity type, and your profile (age, weight, sex) via a proprietary per-vendor algorithm, so the same workout yields different numbers on different devices. Basal or resting energy is a formula-based baseline, not a live measurement. Present it as a wellness estimate, never as a precise readout."
      },
      {
        "q": "How do I get calories consumed from a fitness API?",
        "a": "You do not get intake from a wearable or phone sensor, because nothing measures what a person eats. Calories consumed comes from food logging against a nutrition database, which means a dedicated nutrition API such as Nutritionix or Edamam. On-device stores (HealthKit dietaryEnergyConsumed, Health Connect NutritionRecord) can hold intake a user already logged, but the nutrition facts still come from the database."
      },
      {
        "q": "What is the difference between active and total calories?",
        "a": "Active energy is exercise/movement calories only; total energy includes basal (resting) energy on top. On HealthKit, activeEnergyBurned and basalEnergyBurned are separate types you sum yourself. On Health Connect, TotalCaloriesBurnedRecord already includes basal while ActiveCaloriesBurnedRecord does not, so mixing them double-counts. Verify how each source populates these before adding anything up."
      },
      {
        "q": "Why do calorie counts differ between my devices?",
        "a": "Because they are estimates, not measurements. Each vendor uses a different proprietary model over heart rate, motion, and user profile, so an Apple Watch, a Garmin, and a Fitbit can report different calories for the same activity. Do not treat any single figure as ground truth, and avoid publishing accuracy percentages, as none are reliably sourced."
      },
      {
        "q": "Which API is best for calorie tracking?",
        "a": "For calories burned with the widest coverage, read the on-device platform energy types (active plus basal on HealthKit, active plus total on Health Connect); use a wearable vendor API or an aggregator when you need it server-side. For calories consumed, use a dedicated nutrition API like Nutritionix or Edamam, since a wearable API will never give you intake."
      }
    ],
    "related": [
      {
        "href": "/learn/how-fitness-apps-estimate-calories",
        "label": "How apps estimate calories"
      },
      {
        "href": "/fitness-apis/nutrition-apis",
        "label": "Best nutrition APIs"
      },
      {
        "href": "/integrate/nutritionix-api",
        "label": "Integrate the Nutritionix API"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Want the active-vs-total and estimate caveats flagged before they skew your app's numbers? Get our developer notes on health data."
    }
  },
  {
    "slug": "body-composition-api",
    "primaryQuery": "body composition api",
    "h1": "Body Composition API: Weight, Body Fat, and Lean Mass Data",
    "metaTitle": "Body Composition API: Weight & Body Fat Data",
    "metaDescription": "Get body composition via API: weight, body fat %, BMI, lean mass from HealthKit, Health Connect, and Withings scales. Most wearables don't measure it.",
    "updated": "2026-07-24",
    "answer": "Body composition (weight, body fat %, BMI, lean mass) mostly does not come from wearables. A wrist band or watch cannot measure body fat or lean mass; those need a smart scale (bioimpedance) or manual entry, and BMI is computed from weight and height. You read the results on-device (Apple HealthKit bodyMass, bodyFatPercentage, bodyMassIndex, leanBodyMass; Android Health Connect WeightRecord, BodyFatRecord) or from a scale vendor's cloud API like Withings or Garmin via OAuth. Best pick: integrate a smart scale such as Withings for a full breakdown, or read whatever a paired scale wrote into HealthKit or Health Connect for a hardware-agnostic path. Weight measured, BMI computed, body fat and lean mass estimated.",
    "body": "## Where you can get body-composition data\n\nThis is the sharpest \"the phone can't do it\" case in health data. Neither a phone nor a typical wrist wearable produces body fat or lean mass — you need dedicated hardware or manual entry. Field names, units, and record types change; treat everything below as \"as of 2026, verify\" against each provider's live data dictionary.\n\n| Source | How you access it | Notes |\n| --- | --- | --- |\n| Apple HealthKit (iOS) | On-device read, per-type permission | `bodyMass` (weight), `bodyFatPercentage`, `bodyMassIndex`, `leanBodyMass`, plus `height` and `waistCircumference` — all `HKQuantityType`. No cloud pull; you read in-app whatever a scale app or the user wrote. See the [HealthKit setup guide](/integrate/healthkit). |\n| Android Health Connect | On-device read, per-record permission | `WeightRecord`, `BodyFatRecord`, plus related body records (lean body mass, height). On-device datastore other apps write into; no cloud endpoint. Verify exact record names in the Health Connect data-type index. |\n| Withings API | Cloud OAuth 2.0 | Smart-scale data: weight, body fat, muscle mass, bone mass, water, visceral fat, and more from BIA / multi-frequency-BIA scales. Common pick for a rich field set — verify current fields and units in Withings' developer docs. |\n| Garmin Health API | Cloud OAuth 2.0 | Lists body composition among its metrics for compatible Garmin scales. Coverage is device-dependent; verify field names. |\n| Aggregators (Terra, Junction, Rook) | One cloud OAuth + normalized schema | Normalize weight and body-composition measurements across scale vendors. Useful if you want one integration across many scales — see [health data aggregator APIs](/fitness-apis/health-data-aggregator-apis) and [wearable data APIs](/fitness-apis/wearable-data-apis). |\n\n## Measured or estimated?\n\nBody composition is a mix of measured, computed, and estimated values, and being explicit about which is which matters here:\n\n- **Weight:** measured (on a scale) or manually entered. This is the reliable part.\n- **BMI:** *computed*, not measured — it is weight divided by height squared. Treat it as a derived number, not a reading.\n- **Body fat percentage and lean mass:** **estimated** via bioelectrical impedance analysis (BIA). A scale sends a small current through the body and infers fat versus fat-free mass from the resistance. BIA is sensitive to hydration, recent food or exercise, time of day, and whether the electrodes are foot-to-foot or hand-to-foot. It is an estimate, not a lab-grade measurement — DEXA and hydrostatic weighing are the reference methods. Never quote a body-fat accuracy percentage; none is sourced, and the numbers move with conditions.\n\nFrame these as general wellness signals for your users, not clinical body-composition results. A single BIA reading can swing simply because someone drank water or worked out beforehand, so trends over consistent conditions are more useful than any one value.\n\n## Which should you pick?\n\n- **Full body-composition breakdown (fat, muscle, water, bone):** integrate a smart-scale source. Withings is the common pick for a rich bioimpedance field set — verify current fields and units in its docs.\n- **Hardware-agnostic path:** read whatever a paired scale wrote into HealthKit (`bodyFatPercentage`, `leanBodyMass`) or Health Connect (`BodyFatRecord`). You inherit the scale's data without integrating each vendor, and on-device keeps values on the user's phone until you upload them.\n- **Weight and BMI only:** the on-device store plus manual entry is enough — you do not need a cloud scale integration at all.\n- **Many scale brands at once:** an [aggregator](/fitness-apis/health-data-aggregator-apis) so you get one normalized schema instead of N vendor integrations.\n\n## Before you ship\n\nRe-verify each provider's current field names, units, and OAuth scopes against its live data dictionary — do not hardcode scale models or field lists that were not taken from the vendor's own docs. Keep the framing honest with users: weight is measured, BMI is computed, and body fat and lean mass are BIA estimates affected by hydration and timing. Above all, set expectations up front that a wearable alone cannot produce these numbers — a smart scale or manual entry is required.",
    "faqs": [
      {
        "q": "Can a fitness watch or band measure body fat?",
        "a": "No. A typical wrist wearable does not measure body fat, lean mass, or BMI. Those come from a smart scale using bioelectrical impedance, a body scanner, or the user entering values manually. This is the sharpest case in health data where a phone or watch alone cannot produce the metric."
      },
      {
        "q": "Is body fat percentage from a smart scale accurate?",
        "a": "It is an estimate, not a lab measurement. Consumer scales use bioelectrical impedance analysis (BIA), which infers fat versus fat-free mass from electrical resistance. BIA is sensitive to hydration, recent food or exercise, time of day, and electrode placement. DEXA and hydrostatic weighing are the reference methods. Treat scale body fat as a wellness signal and track trends under consistent conditions rather than any single reading."
      },
      {
        "q": "How do I get weight and body fat data from HealthKit and Health Connect?",
        "a": "Apple HealthKit exposes bodyMass, bodyFatPercentage, bodyMassIndex, and leanBodyMass as on-device quantity types you read with per-type permission. Android Health Connect exposes WeightRecord and BodyFatRecord, plus related body records, read with per-record permission. Both are on-device only, so you read whatever a paired scale app or the user wrote; there is no cloud pull. Verify exact record and field names in each platform's live data dictionary."
      },
      {
        "q": "Is BMI measured or calculated?",
        "a": "BMI is calculated, not measured. It is weight divided by height squared, so it is only as good as the weight and height behind it. HealthKit exposes it as bodyMassIndex, but treat it as a derived value rather than a sensor reading."
      },
      {
        "q": "Which API is best for body composition?",
        "a": "For a full breakdown of fat, muscle, water, and bone, integrate a smart-scale source; Withings is the common pick for a rich bioimpedance field set. For a hardware-agnostic path, read what a paired scale wrote into HealthKit or Health Connect. If you only need weight and BMI, the on-device store plus manual entry is enough. To combine many scale brands, use an aggregator like Terra or Junction. Verify current fields and units in each provider's docs."
      }
    ],
    "related": [
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Building a body-composition feature and want the measured-vs-estimated caveats flagged before they reach your users? Get our developer notes on wearable and scale data."
    }
  },
  {
    "slug": "menstrual-cycle-api",
    "primaryQuery": "menstrual cycle api",
    "h1": "Menstrual Cycle API: How to Get Cycle Tracking Data",
    "metaTitle": "Menstrual Cycle API: Get Cycle Tracking Data",
    "metaDescription": "Read cycle data via HealthKit Reproductive Health types and Health Connect Cycle Tracking records. Mostly logged, not measured - and highly sensitive.",
    "updated": "2026-08-12",
    "answer": "Menstrual cycle data is almost entirely user-logged rather than sensor-measured, so the real question is where the log lives and who may read it. On iOS you read Apple HealthKit's Reproductive Health category types - HKCategoryTypeIdentifierMenstrualFlow plus cervicalMucusQuality, ovulationTestResult, intermenstrualBleeding and others - and on Android you read Health Connect's Cycle Tracking records such as MenstruationFlowRecord, MenstruationPeriodRecord, CervicalMucusRecord and OvulationTestRecord. Cloud coverage is thin: among the sources documented on our pages, only Terra normalizes a menstruation datatype, so verify any other vendor directly. Best pick: the on-device platform stores, keeping the log on the device wherever the feature allows, because this category carries privacy stakes ordinary fitness metrics do not.",
    "faqs": [
      {
        "q": "Which Health Connect records cover menstrual cycle tracking?",
        "a": "Health Connect groups them under Cycle Tracking: MenstruationFlowRecord (instantaneous, with a flow field taking FLOW_LIGHT, FLOW_MEDIUM, FLOW_HEAVY or FLOW_UNKNOWN), MenstruationPeriodRecord (an interval with startTime and endTime), CervicalMucusRecord, IntermenstrualBleedingRecord, OvulationTestRecord, SexualActivityRecord, and BasalBodyTemperatureRecord. The two menstruation records share one permission pair, android.permission.health.READ_MENSTRUATION and WRITE_MENSTRUATION, while the others have their own. Verify the current record and permission list in Google's data types reference before you build."
      },
      {
        "q": "Does Apple HealthKit predict ovulation, or only store what was logged?",
        "a": "HealthKit stores samples; the prediction lives in Apple's Cycle Tracking feature, not in a type you read. Apple documents that Cycle Tracking uses sleeping wrist temperature data to provide a retrospective estimate of when someone likely ovulated, combined with heart rate and logged cycle data. That is an estimate made after the fact, not a forecast, and the appleSleepingWristTemperature type is read-only, so you can request permission to read it but cannot write samples. Anything your app renders as a future fertile window is your own model's prediction and should be labelled as one."
      },
      {
        "q": "Can a wearable detect a period automatically, or must the user log it?",
        "a": "Flow, spotting, cervical mucus quality, ovulation test results, and sexual activity are all logged by the person or written by another app; there is no sensor that detects them. The genuinely sensor-derived signals are adjacent, not equivalent: overnight wrist temperature, basal body temperature, and resting heart rate are inputs a cycle model consumes rather than the cycle itself. Design your empty states around a log that may simply not exist yet."
      },
      {
        "q": "What extra privacy obligations come with period-tracking data?",
        "a": "Treat it as the most exposed category in consumer health. Google's Health Connect guidance is to request only the permissions and data types that support the specific user-facing features you offer, and to justify each one, with period tracking listed as a declarable health feature in the Play Console. Apple's HealthKit rules prohibit using the data for advertising, disclosing it to a third party without express permission (and even then only to a party that also provides a health or fitness service), and selling it to advertising platforms, data brokers, or information resellers, and require a privacy policy. Keep the log on-device where the feature allows, and make deletion real. This is engineering guidance, not legal advice."
      },
      {
        "q": "Which wearable cloud APIs return menstrual cycle data?",
        "a": "Fewer than you would expect. Among the sources documented on our pages, Terra is the one that normalizes cycle data, with a menstruation payload type and a /v2/menstruation REST endpoint. Menstrual cycle data is not documented on our pages for Fitbit, Garmin, Oura, or WHOOP, nor for the Junction, Rook, or Spike aggregators, so verify with each vendor rather than assuming coverage. Oura's nightly temperature deviation is described on our pages as a useful input to cycle features, which is not the same as an API datatype for the cycle itself."
      }
    ],
    "related": [
      {
        "href": "/compliance/health-data-user-consent",
        "label": "Health-data user consent"
      },
      {
        "href": "/compliance/store-health-data-securely",
        "label": "Store health data securely"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Cycle-tracking types, enum constants, and platform policy for sensitive health data all move faster than the docs suggest - subscribe for plain-English updates when HealthKit or Health Connect changes what you can read."
    },
    "body": "There is no sensor for menstruation. Every other page in this cluster opens with a signal some device picks up; this one opens with a text field. Menstrual flow, spotting, cervical mucus quality, ovulation test strips, and sexual activity are all things a person taps into an app, and the platform health stores exist to hold that log and hand it between apps under permission. A thin layer of genuinely sensor-derived data sits alongside it — overnight wrist temperature, basal body temperature, resting heart rate — but those are inputs a cycle model consumes, not the cycle itself.\n\n## Where you can get cycle data\n\nIdentifier names, enum constants, and permission strings change; each row records where the claim came from and when it was checked, so you can re-verify rather than trust the table.\n\n| Source | How you access it | What it exposes | Verified from |\n| --- | --- | --- | --- |\n| Apple HealthKit (iOS) | On-device read, per-type permission; no cloud pull | Reproductive Health category types: `menstrualFlow`, `intermenstrualBleeding`, `infrequentMenstrualCycles`, `irregularMenstrualCycles`, `persistentIntermenstrualBleeding`, `prolongedMenstrualPeriods`, `cervicalMucusQuality`, `ovulationTestResult`, `progesteroneTestResult`, `sexualActivity`, `contraceptive`, `pregnancy`, `pregnancyTestResult`, `lactation`, `menopausalState`, `bleedingAfterMenopause` | Apple `HKCategoryTypeIdentifier` reference, fetched 2026-08-12 |\n| Apple HealthKit (quantity types) | On-device read, per-type permission | `HKQuantityTypeIdentifierBasalBodyTemperature`; `HKQuantityTypeIdentifierAppleSleepingWristTemperature` (read-only, cannot be written) | Apple `HKQuantityTypeIdentifier` and `appleSleepingWristTemperature` references, fetched 2026-08-12 |\n| Android Health Connect | On-device read, per-record permission; no cloud pull | Cycle Tracking category: `MenstruationFlowRecord`, `MenstruationPeriodRecord`, `CervicalMucusRecord`, `IntermenstrualBleedingRecord`, `OvulationTestRecord`, `SexualActivityRecord`, `BasalBodyTemperatureRecord` | Android Health Connect data types page, fetched 2026-08-12 |\n| Terra | One cloud API plus webhooks over many providers | A `menstruation` payload type and a `/v2/menstruation` REST endpoint; menstrual cycle is listed in its normalized schema | Our [Terra API integration guide](/integrate/terra-api) |\n| Fitbit, Garmin, Oura, WHOOP | Cloud OAuth 2.0 | Menstrual cycle data is not documented on our pages for any of these — verify with the vendor before planning around it | — |\n| Junction, Rook, Spike | One cloud API over many providers | A menstruation datatype is not documented on our pages for these aggregators — verify with the vendor | — |\n\nThe short version of that table: the log lives on the phone. Cloud coverage for cycle data is thin compared with heart rate or sleep, which pushes most builds toward the on-device stores.\n\n## Logged, not measured — and predictions are somebody's model\n\nApple documents `menstrualFlow` samples as taking values from the `HKCategoryValueMenstrualFlow` enum — `unspecified`, `none`, `light`, `medium`, `heavy` — and requires every sample to carry `HKMetadataKeyMenstrualCycleStart` metadata. Two write patterns are documented. Record a whole period as one sample, with the period start as `startDate`, the period end as `endDate`, and the cycle-start metadata set to true. Or write several samples across the period, marking only the first with cycle-start true and the rest false, varying the flow value to capture how it changed.\n\nHealth Connect splits the same idea in two. `MenstruationPeriodRecord` is an interval record carrying `startTime` and `endTime`. `MenstruationFlowRecord` is instantaneous, with a `flow` field taking `FLOW_LIGHT`, `FLOW_MEDIUM`, `FLOW_HEAVY`, or `FLOW_UNKNOWN`. Both sit behind a single permission pair, `android.permission.health.READ_MENSTRUATION` and `android.permission.health.WRITE_MENSTRUATION`.\n\nThe sensor-derived slice is narrower than most product plans assume. Apple documents that Apple Watch Series 8 and Apple Watch Ultra sample wrist temperature every five seconds overnight during sleep and aggregate the night into one `appleSleepingWristTemperature` sample corrected for environmental bias, and that Cycle Tracking uses that data to provide a retrospective estimate of when the person likely ovulated, combined with heart rate and logged cycle data. Read that carefully: retrospective, not a forecast. Apple also documents the type as read-only, so you can request permission to read it but cannot save samples of it, and notes Health needs roughly five nights to build a baseline before it displays wrist temperature, even though the samples are readable from the first night.\n\nSo flow and period boundaries are logged, ovulation timing derived from temperature is estimated after the fact, and any future fertile window your UI draws is a prediction from a model — yours or a vendor's. Label it as one. This is wellness information, not contraception and not a diagnosis.\n\n## Enum mismatches and other traps\n\n- **Flow scales do not line up.** Apple offers five constants including an explicit `none`; Health Connect offers four with `FLOW_UNKNOWN` in place of a \"no flow\" value. Merging the two means deciding what Apple's `none` becomes on Android, and writing that decision down.\n- **Ovulation results line up even less.** Apple's `HKCategoryValueOvulationTestResult` has `negative`, `luteinizingHormoneSurge`, `indeterminate`, `estrogenSurge`, and `positive`. Health Connect's `OvulationTestRecord` has `RESULT_POSITIVE` (documented as peak fertility, the LH surge, with ovulation expected in 10 to 36 hours), `RESULT_HIGH` (documented as a rise in estrogen or luteinizing hormone), `RESULT_NEGATIVE`, and `RESULT_INCONCLUSIVE` — and Google documents that any unknown value comes back as inconclusive. Apple separates an estrogen surge from an LH surge; Google folds both into one high-fertility constant.\n- **Cervical mucus carries an extra dimension on Android.** Apple's enum is `dry`, `sticky`, `creamy`, `watery`, `eggWhite`. Health Connect has the same five appearances plus `APPEARANCE_UNUSUAL`, described as an unusual kind worth attention, and a separate `sensation` field with light, medium, and heavy values. An appearance-to-appearance mapping silently discards sensation.\n- **Mandatory fields differ per record.** Health Connect lists `protectionUsed` among the mandatory fields on `SexualActivityRecord`, while `IntermenstrualBleedingRecord` requires only `metadata` and `time`. Check each record's required set rather than assuming a shared shape.\n- **Coverage is broader than \"period\".** Apple's Reproductive Health list reaches into pregnancy, lactation, contraceptive, and menopausal state. Request only the types your feature actually uses.\n\n## Sensitivity: the part you cannot treat as a normal metric\n\nCycle data is the most exposed category in this cluster. Since the 2022 Dobbs decision in the United States, period and fertility logs have been treated by users, regulators, and journalists as data that can be subpoenaed or sold, and a breach here is materially worse than losing someone's step count. Handle it as an engineering problem with a privacy budget, not a compliance checkbox.\n\nPractical guidance, none of it legal advice:\n\n- **Keep it on-device when you can.** HealthKit and Health Connect are permissioned on-device reads with no server-to-server pull — see [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data). If a feature can be computed on the phone, do not upload the log at all.\n- **Request the narrowest permission set that ships the feature.** Google's Health Connect access guidance is explicit: only request permissions and data types that support the specific, user-facing health features you offer, and justify each one. Google lists period tracking as a declarable health feature in the Play Console.\n- **Design for silent denial.** Apple documents that users grant or deny per data type and that your app is never told a read was denied — from your app's point of view, no data of that type exists. An empty cycle log must not accuse the user of anything.\n- **Respect Apple's HealthKit terms.** Apple states you may not use HealthKit information for advertising or similar services, must not disclose it to a third party without express permission (and even then only to a party that also provides a health or fitness service), cannot sell it to advertising platforms, data brokers, or information resellers, and must provide a privacy policy.\n- **Get consent and storage right.** Our guides on [health-data user consent](/compliance/health-data-user-consent) and [storing health data securely](/compliance/store-health-data-securely) cover the consent record, encryption, and deletion path this data needs.\n\n## Which should you pick?\n\n- **iOS-only cycle logging:** HealthKit's Reproductive Health category types, read and written on-device.\n- **Android:** Health Connect's Cycle Tracking records, behind the per-record permissions above.\n- **Several brands behind one schema:** Terra is the only source documented on our pages that normalizes a menstruation datatype. Verify current coverage in its docs.\n- **Temperature inputs to a cycle model:** `appleSleepingWristTemperature` on iOS, `BasalBodyTemperatureRecord` or `SkinTemperatureRecord` on Android. Our [Oura vs WHOOP comparison](/compare/oura-vs-whoop) describes Oura's nightly temperature deviation from baseline as a useful cycle-tracking input, but our pages do not document an Oura menstrual-cycle datatype — verify with the vendor.\n\n## Before you ship\n\nRe-verify every identifier, enum constant, and permission string against Apple's and Google's live references, because these move. Write down your cross-platform enum mapping instead of leaving it implicit in code. Label predictions as predictions. And decide, deliberately, whether this data ever needs to leave the device — for cycle tracking, the cheapest privacy control is the data you never collected."
  },
  {
    "slug": "blood-glucose-api",
    "primaryQuery": "blood glucose api",
    "h1": "Blood Glucose API: How to Get Glucose Data Into Your App",
    "metaTitle": "Blood Glucose API: How to Get Glucose Data",
    "metaDescription": "Read glucose via HealthKit bloodGlucose and Health Connect BloodGlucoseRecord. Meter and CGM sourced, mg/dL vs mmol/L traps, and the medical-claim line.",
    "updated": "2026-08-12",
    "answer": "Blood glucose reaches your app second-hand: a fingerstick meter or a continuous glucose monitor measures it and its companion app writes it into the platform store, which you then read on-device via Apple HealthKit's HKQuantityTypeIdentifierBloodGlucose or Android Health Connect's BloodGlucoseRecord. The value is genuinely measured, but not all glucose is the same measurement - Health Connect requires a specimenSource field distinguishing interstitial fluid from capillary blood, plasma, serum, tears, or whole blood. The two traps that bite hardest are units, since samples may be in mg/dL or mmol/L by region, and meal context, which Health Connect makes mandatory and Apple exposes only as optional metadata. Best pick: the on-device stores for a single platform, or an aggregator such as Terra, Rook, or Spike server-side - and keep the framing wellness, not medical guidance.",
    "faqs": [
      {
        "q": "Where does blood glucose data in HealthKit and Health Connect come from?",
        "a": "Almost never from a fitness wearable. It comes from a fingerstick meter or a continuous glucose monitor, hardware sold and regulated as a medical device, whose companion app writes the reading into the platform store. Users can also type values in by hand. Manual entries, meter uploads, and CGM streams all land in the same data type, so if the distinction matters to your feature, inspect the sample's source rather than assuming a device produced it."
      },
      {
        "q": "What units do blood glucose samples use, and how do I avoid a unit mix-up?",
        "a": "Apple documents that blood glucose samples may be measured in mg/dL (milligrams per deciliter) or mmol/L (millimoles per liter) depending on the region, and that the Health app lets users pick their preferred units for display and manual entry. Read that preference with preferredUnits(for:completion:) rather than assuming one, and Apple advises alerting the user if your connected meter uses different units. Always store the unit alongside the value. This trap produces plausible wrong numbers rather than empty results, which is what makes it dangerous."
      },
      {
        "q": "Can I read continuous glucose monitor data through a fitness API?",
        "a": "Usually indirectly. On a phone you read whatever the CGM's companion app wrote into HealthKit or Health Connect. Server-side, our pages document Terra as normalizing CGM and glucose, Rook as covering glucose and CGM across a stated 400-plus sources, and Spike as marketing Dexcom among its providers. Note that several popular providers, Dexcom among them, commonly require you to register your own developer or partner credentials regardless of which aggregator you use. Going direct to a CGM manufacturer is a partner relationship with its own approval process."
      },
      {
        "q": "Is a glucose reading measured or estimated?",
        "a": "Measured, not modeled - but glucose names several different measurements that are not interchangeable. Health Connect makes this explicit with a mandatory specimenSource field carrying constants for interstitial fluid, capillary blood, plasma, serum, tears, whole blood, and unknown. A continuous monitor sampling interstitial fluid and a fingerstick meter sampling capillary blood are measuring different compartments with different devices, so do not merge them into one unlabelled trend line. Apple's type has no equivalent required field, so on iOS that context usually has to come from the source app and metadata."
      },
      {
        "q": "What must a wellness app avoid claiming about glucose readings?",
        "a": "Do not compute or display dosing suggestions, do not frame alerts as clinical instructions, and do not describe your app as monitoring or managing diabetes. Glucose data typically originates from a regulated medical device and is used by people managing a chronic condition, but that does not make a general-wellness app a clinical tool, and presenting it as one moves you toward software-as-a-medical-device territory. Treat that line as a deliberate product decision made with counsel rather than something you drift across through copywriting. This is not legal or medical advice."
      }
    ],
    "related": [
      {
        "href": "/compliance/fda-fitness-app-regulation",
        "label": "FDA rules for fitness apps"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Glucose is where wellness apps sit closest to regulated territory, and the platform data types keep shifting - get our developer notes on health-data APIs and where the medical-claim line actually falls."
    },
    "body": "Glucose is the metric where a consumer health app stands closest to a regulated medical device without being one. The reading in the health store almost never came from a fitness wearable — it came from a fingerstick meter or a continuous glucose monitor, hardware that is cleared and sold as a medical device, and it arrived in HealthKit or Health Connect because the manufacturer's companion app wrote it there. Your app is a downstream reader of somebody else's clinical-grade instrument, and both the engineering traps and the product constraints follow from that.\n\n## Where you can get glucose data\n\nIdentifier names, constants, and permission strings change. Each row below records where the claim came from and when it was checked.\n\n| Source | How you access it | What it exposes | Verified from |\n| --- | --- | --- | --- |\n| Apple HealthKit (iOS) | On-device read, per-type permission; no cloud pull | `HKQuantityTypeIdentifierBloodGlucose`, listed under Lab and Test Results. Mass-per-volume units, discrete aggregation. Optional `HKMetadataKeyBloodGlucoseMealTime` metadata | Apple `bloodGlucose` and `HKQuantityTypeIdentifier` references, fetched 2026-08-12 |\n| Apple HealthKit (related) | On-device read, per-type permission | `HKQuantityTypeIdentifierInsulinDelivery` in international units, cumulative aggregation, with `HKMetadataKeyInsulinDeliveryReason` metadata; dietary carbohydrate types under Nutrition | Apple `insulinDelivery` and `HKQuantityTypeIdentifier` references, fetched 2026-08-12 |\n| Android Health Connect | On-device read, per-record permission; no cloud pull | `BloodGlucoseRecord` in the Vitals category, instantaneous. Mandatory fields `level`, `specimenSource`, `mealType`, `relationToMeal`, `metadata`, `time`. Permissions `android.permission.health.READ_BLOOD_GLUCOSE` and `WRITE_BLOOD_GLUCOSE` | Android Health Connect data types page and `BloodGlucoseRecord` reference, fetched 2026-08-12 |\n| Terra | One cloud API plus webhooks over many providers | CGM and glucose are listed in its normalized schema | Our [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) page |\n| Rook | One cloud API plus on-device SDKs | Glucose and CGM across a stated 400-plus sources; Dexcom is among the providers where you bring your own developer credentials | Our [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) page |\n| Spike | One cloud API reaching into medical devices, EMRs, and lab tests | Markets Dexcom among 500-plus wearables and platforms | Our [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) page |\n| Fitbit, Garmin, Oura, WHOOP | Cloud OAuth 2.0 | Blood glucose is not documented on our pages for any of these — verify with the vendor before planning around it | — |\n\nOne access-model note worth internalizing before you design: HealthKit and Health Connect are permissioned on-device reads with no server endpoint to call, while aggregators are server-side and post-sync. See [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data) for how that shapes latency and where the data ends up living.\n\n## Measured — but of what, by what, and when\n\nGlucose is genuinely measured, not modeled. The nuance is that \"glucose\" names several different measurements that are not interchangeable, and Health Connect makes that explicit in its schema: `specimenSource` is a mandatory field with constants for `SPECIMEN_SOURCE_INTERSTITIAL_FLUID`, `SPECIMEN_SOURCE_CAPILLARY_BLOOD`, `SPECIMEN_SOURCE_PLASMA`, `SPECIMEN_SOURCE_SERUM`, `SPECIMEN_SOURCE_TEARS`, `SPECIMEN_SOURCE_WHOLE_BLOOD`, and `SPECIMEN_SOURCE_UNKNOWN`.\n\nTreat that field as load-bearing. A continuous monitor sampling interstitial fluid and a fingerstick meter sampling capillary blood are measuring different compartments with different devices, and dropping both into one trend line without labelling the specimen is how you ship a chart nobody can interpret. Apple's HealthKit type carries no equivalent required field, so on iOS the specimen distinction usually has to come from the sample's source app and metadata instead — plan for that asymmetry if you sync across platforms.\n\nThere is also a provenance point that has nothing to do with sensors. A user can type a number into the Health app by hand. Manual entries, meter uploads, and CGM streams all land in the same type, so if the distinction matters to your feature, inspect the source rather than assuming a device wrote it.\n\n## Units: the trap that produces wrong numbers, not missing ones\n\nMost data-type gotchas produce empty results, which are easy to notice. This one produces plausible, wrong ones.\n\nApple documents that blood glucose samples may be measured in mg/dL (milligrams per deciliter) or mmol/L (millimoles per liter) depending on the region, and that the Health app lets users select their preferred units for both display and manual entry. Apple's documented remedy is to read the user's preference with `preferredUnits(for:completion:)`, and if your app connects to a glucose meter using different units, alert the user — Apple even suggests recommending they change their preferred units to match the meter. Never assume a unit; always read one and always store it next to the value.\n\nApple documents one more constraint that is easy to miss and hard to debug later: do not save samples to HealthKit when the blood glucose meter is processing control solution. Control-solution runs are quality checks on the meter, not readings from the person, and writing them pollutes the user's record permanently.\n\n## Meal context is part of the reading\n\nA glucose value without meal timing is close to meaningless, and both platforms model that, differently.\n\nHealth Connect makes it mandatory. `BloodGlucoseRecord` requires both `mealType` and `relationToMeal`, and the relation constants are `RELATION_TO_MEAL_GENERAL`, `RELATION_TO_MEAL_FASTING`, `RELATION_TO_MEAL_BEFORE_MEAL`, `RELATION_TO_MEAL_AFTER_MEAL`, and `RELATION_TO_MEAL_UNKNOWN`. Apple makes it optional and coarser: `HKMetadataKeyBloodGlucoseMealTime` indicates the timing of a sample relative to a meal, using `HKBloodGlucoseMealTime` values of `preprandial` and `postprandial`.\n\nThat is a five-value required enum on one platform and a two-value optional metadata key on the other. Fasting, in particular, has no direct Apple equivalent — decide how you round-trip it, document the mapping, and expect a lossy conversion in at least one direction.\n\n## Sensitivity: read the data, do not practise medicine\n\nThis is the section to get right before the code. Glucose data usually originates from a device regulated as a medical device, and it is used by people managing a chronic condition, but that does not make your general-wellness app a clinical tool — and presenting it as one is where products get into trouble. Do not compute or display dosing suggestions. Do not generate alerts framed as clinical warnings such as low or high thresholds phrased as instructions. Do not describe your app as monitoring or managing diabetes. Our page on [FDA regulation of fitness apps](/compliance/fda-fitness-app-regulation) covers where general-wellness framing ends and software-as-a-medical-device begins; treat that line as a product decision made deliberately, with counsel, not one you drift across through copywriting.\n\nThe privacy handling is the same discipline as any sensitive health type, and glucose is Apple's own worked example of it: Apple's privacy documentation illustrates HealthKit's per-type granularity by noting that a user could let your app read step count data while preventing it from reading blood glucose levels — and that your app is never told a read was denied, so from its point of view no data of that type exists. Build an empty state that copes with that silently. Beyond permissions, Apple's HealthKit rules prohibit using the data for advertising, disclosing it to third parties without express permission (and even then only to parties that also provide a health or fitness service), and selling it to advertising platforms, data brokers, or information resellers, and require a privacy policy. Storage and retention obligations are covered in our guide to [storing health data securely](/compliance/store-health-data-securely).\n\n## Which should you pick?\n\n- **iOS app reading what a meter or CGM already wrote:** HealthKit `bloodGlucose`, read on-device. See the [HealthKit integration guide](/integrate/healthkit) for setup and permissions.\n- **Android:** Health Connect `BloodGlucoseRecord`, and make use of the mandatory `specimenSource` and `relationToMeal` fields rather than ignoring them.\n- **Server-side across many users and devices:** an aggregator. Terra, Rook, and Spike are the ones our pages document as covering glucose or CGM sources. Note that several popular providers, Dexcom among them, commonly require you to register your own developer or partner credentials regardless of which aggregator you pick.\n- **Direct device integration:** going straight to a CGM manufacturer's API is a partner relationship with its own approval process. Verify terms and availability with the vendor; nothing on our pages substitutes for that.\n\n## Before you ship\n\nConfirm the current identifiers, constants, permission strings, and metadata keys against Apple's and Google's live references. Store the unit alongside every value and read the user's preferred unit rather than guessing. Preserve specimen source and meal relation through your pipeline instead of flattening them. And keep the product framing honest: you are displaying a measurement someone else's regulated device produced, not offering medical guidance about it."
  },
  {
    "slug": "blood-pressure-api",
    "primaryQuery": "blood pressure api",
    "h1": "Blood Pressure API: How to Read BP Data In Your App",
    "metaTitle": "Blood Pressure API: How to Read BP Data",
    "metaDescription": "How blood pressure works in HealthKit and Health Connect: systolic and diastolic as a pair, mandatory cuff-site fields, and why no wearable supplies it.",
    "updated": "2026-08-12",
    "answer": "Blood pressure reaches an app through the two on-device stores, not through a wearable feed. Apple HealthKit splits it into the quantity types bloodPressureSystolic and bloodPressureDiastolic and asks you to combine them into a single correlation, HKCorrelationTypeIdentifier.bloodPressure. Android Health Connect uses one BloodPressureRecord in the Vitals category, where systolic, diastolic, bodyPosition, and measurementLocation are all mandatory fields. It is a real measurement, but the instrument is a cuff outside your app: both platforms also expose a write permission, so a stored value may have come from a monitor's companion app or from a person typing. Our pages document no consumer wearable that measures blood pressure, so verify any device claim against that vendor's own documentation and regulatory record.",
    "faqs": [
      {
        "q": "Which platform data types store a blood pressure reading?",
        "a": "Apple HealthKit uses two quantity sample types, HKQuantityTypeIdentifier.bloodPressureSystolic and HKQuantityTypeIdentifier.bloodPressureDiastolic, both documented from iOS 8.0 and watchOS 2.0, both using pressure units and measuring discrete values. Android Health Connect uses a single BloodPressureRecord in the Vitals category, an instantaneous record in the Pressure unit, gated on android.permission.health.READ_BLOOD_PRESSURE. Re-check both references in the live docs before you build, since identifiers and permission strings change."
      },
      {
        "q": "Why does HealthKit want systolic and diastolic combined into a correlation?",
        "a": "Because on iOS the two halves are separate sample types, and only the correlation ties them together as one reading. Apple documents HKCorrelationTypeIdentifier.bloodPressure as a correlation sample that combines a systolic sample and a diastolic sample into a single blood pressure reading, and its discussion notes say to combine them when recording. If you save them as two unrelated samples, anything reading them back has to guess at pairing by timestamp, which is a heuristic rather than a guarantee."
      },
      {
        "q": "Does Health Connect require body position and cuff site for BP?",
        "a": "Yes. BloodPressureRecord lists systolic, diastolic, bodyPosition, measurementLocation, metadata, and time as mandatory fields. The constants are explicit, covering standing, sitting, lying down, reclining, and unknown positions, and left or right wrist versus left or right upper arm for location. Treat those as part of the reading rather than optional notes: a normalization layer that flattens BP to two integers and a timestamp discards fields the platform itself considers required."
      },
      {
        "q": "Can a smartwatch send blood pressure into my app without a cuff?",
        "a": "Our pages document no consumer wrist wearable that measures blood pressure, so this is a claim to verify with the vendor rather than assume. What the platforms guarantee is only that some app wrote a value: both HealthKit and Health Connect expose a write permission alongside the read permission, so a stored reading may have come from a monitor's companion app or from a person typing a number in. Inspect the record metadata for provenance before you plot anything."
      },
      {
        "q": "Why do Health Connect blood pressure writes throw an exception?",
        "a": "The record validates ranges and throws IllegalArgumentException when a value falls outside them. Health Connect documents systolic as valid from 20-200 mmHg, or 20-300 mmHg for SDK extension 17 or higher, and diastolic as 10-180 mmHg, or 10-300 mmHg for SDK extension 17 or higher. Because the bounds depend on the SDK extension level, the same payload can be accepted on one device and rejected on another, so handle the failure rather than assuming clamping."
      }
    ],
    "related": [
      {
        "href": "/data/heart-rate-api",
        "label": "Heart rate API"
      },
      {
        "href": "/compliance/fda-fitness-app-regulation",
        "label": "FDA rules for fitness apps"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Health Connect"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Vitals data types shift more often than the headline fitness metrics - subscribe for plain-English notes when HealthKit or Health Connect changes what a blood pressure record has to carry."
    },
    "body": "Blood pressure is the metric where the API question and the hardware question stop being separable. Steps, heart rate, and sleep land in a health store because a device the user already wears produced them in the background. A blood pressure pair lands because somebody wrapped a cuff around an arm and inflated it — or because an app wrote down a number a user read off a screen. Both mobile platform stores are built around that fact, and it drives every decision downstream.\n\n## Both platforms model BP as a pair, not a number\n\nOn iOS the reading is split across two quantity sample types. Apple documents `HKQuantityTypeIdentifier.bloodPressureSystolic` as \"A quantity sample type that measures the user's systolic blood pressure\" and `HKQuantityTypeIdentifier.bloodPressureDiastolic` as the diastolic equivalent. Both are listed from iOS 8.0 and watchOS 2.0, both use pressure units, and both measure discrete values rather than cumulative ones.\n\nApple's own discussion note is the part teams miss: when recording blood pressure, combine the systolic and diastolic samples into a single correlation object, `HKCorrelationTypeIdentifier.bloodPressure`, documented as \"A correlation sample that combines a systolic sample and a diastolic sample into a single blood pressure reading.\"\n\nThat has two practical consequences. When writing, you create two quantity samples and save them inside one correlation, not as two independent samples that happen to share a timestamp. When reading, if you query only the systolic type you get a column of numbers with no guaranteed partner — pairing them yourself by timestamp is a heuristic, not a contract.\n\nHealth Connect takes the opposite approach and puts the pair inside one record. `BloodPressureRecord` sits in the Vitals category, is an instantaneous record type, and uses the `Pressure` unit. Its mandatory fields are `systolic`, `diastolic`, `bodyPosition`, `measurementLocation`, `metadata`, and `time`. The Kotlin reference describes the class as capturing \"the blood pressure of a user,\" where \"Each record represents a single instantaneous blood pressure reading,\" and says it throws `IllegalArgumentException` if one of the values is outside the valid range.\n\n## Where you can get it\n\n| Source | What it gives you | How you access it | Verified from |\n|---|---|---|---|\n| Apple HealthKit | `bloodPressureSystolic` and `bloodPressureDiastolic` quantity types, plus the `bloodPressure` correlation | On-device read/write with per-type authorization; no cloud pull | Apple HealthKit developer documentation for each identifier, fetched 2026-08-12 |\n| Android Health Connect | `BloodPressureRecord` — one record carrying both values plus position and cuff site | On-device read/write via the Health Connect client, gated on `android.permission.health.READ_BLOOD_PRESSURE` and `WRITE_BLOOD_PRESSURE` | Health Connect data types page and the `BloodPressureRecord` Kotlin reference, fetched 2026-08-12 |\n| Health Connect aggregates | `SYSTOLIC_AVG`, `SYSTOLIC_MAX`, `SYSTOLIC_MIN`, `DIASTOLIC_AVG`, `DIASTOLIC_MAX`, `DIASTOLIC_MIN` | Aggregate query against the same record type | Health Connect data types page, fetched 2026-08-12 |\n| Wearable cloud APIs (Fitbit, Garmin, Oura, WHOOP, Strava) | No blood pressure field is documented on our pages for any of them | Cloud OAuth where a field exists at all | Not documented on our pages — verify in each vendor's live data dictionary |\n| Cuff and monitor vendors | Vendor SDK, or the vendor's companion app writing into HealthKit or Health Connect | Varies by product | Not documented on our pages — verify |\n| Aggregators (Terra, Junction, Rook) | Whatever the underlying source supplies, under one normalized schema | One cloud API plus webhooks | Not documented on our pages — verify |\n\nThe honest summary of that table: the two on-device stores have a well-specified place to put a blood pressure reading, and nothing on our pages documents a consumer wearable that produces one. Treat a populated BP type as evidence that *some* app wrote a value, not as evidence that a watch measured it.\n\n## The context fields are the honest part\n\nHealth Connect does not let you write a bare pair. `bodyPosition` and `measurementLocation` are mandatory, and the constants are explicit: `BODY_POSITION_UNKNOWN`, `BODY_POSITION_STANDING_UP`, `BODY_POSITION_SITTING_DOWN`, `BODY_POSITION_LYING_DOWN`, and `BODY_POSITION_RECLINING`; `MEASUREMENT_LOCATION_UNKNOWN`, `MEASUREMENT_LOCATION_LEFT_WRIST`, `MEASUREMENT_LOCATION_RIGHT_WRIST`, `MEASUREMENT_LOCATION_LEFT_UPPER_ARM`, and `MEASUREMENT_LOCATION_RIGHT_UPPER_ARM`.\n\nRead that as design intent. The schema treats \"sitting, left upper arm\" and \"standing, right wrist\" as different readings, not the same reading with different notes attached. If your normalization layer flattens BP into two integers and a timestamp, you have thrown away the fields the platform considered mandatory — and you cannot get them back from an average.\n\n## Measured, but by equipment you did not build\n\nBlood pressure is a measurement, unlike a modeled value such as VO2 max. The catch is that the measuring instrument is outside your app and outside the platform's guarantees. Both platforms expose a *write* permission alongside the read permission, so any value you read could have come from a cuff's companion app, a general health-notes app, or a person typing what they saw. `metadata` is where provenance lives, and it is the first thing to inspect before you plot anything.\n\nWrist devices are the specific place to slow down. Our pages do not document any consumer wrist wearable that measures blood pressure, so this page will not claim one exists. What is verifiable is that Health Connect encodes wrist and upper-arm as distinct measurement locations, which is a strong hint that the two are not interchangeable inputs. Anything beyond that — whether a particular device is validated, against which protocol, and in which markets it is cleared to make the claim — has to come from that vendor's own documentation and regulatory record.\n\nUseful questions to put to a device vendor before you integrate:\n\n- Is the reading taken at the upper arm or the wrist, and does the API tell you which?\n- Does the product carry a regulatory clearance for blood pressure measurement in the markets you ship to, and can they point you at the record?\n- Was it validated against a published protocol, and is that validation public?\n- Does the API return the reading the device computed, or a value smoothed or re-derived on their servers?\n- Does it expose body position, or do you have to prompt the user for it yourself?\n\n## Ranges, units, and the rest of the traps\n\n- **Valid-range rejection.** Health Connect documents systolic as valid from 20-200 mmHg, and 20-300 mmHg for SDK extension 17 or higher; diastolic is 10-180 mmHg, and 10-300 mmHg for SDK extension 17 or higher. Out-of-range writes throw rather than silently clamping, and the bounds differ by SDK extension — so the same payload can be accepted on one device and rejected on another.\n- **Aggregates break the pair.** `SYSTOLIC_AVG` and `DIASTOLIC_AVG` are computed independently. Average them over a week and you get a number pair that no single reading ever produced. For anything a user will read as \"my blood pressure,\" aggregate whole readings, not columns.\n- **There is no daily blood pressure.** The record is instantaneous on Android and discrete on iOS. Any notion of a daily or weekly value is yours to define, and you should say in the UI which readings went into it.\n- **Units.** Apple's types use pressure units, so you pick the `HKUnit` on read and write; store the unit alongside the number instead of assuming millimetres of mercury everywhere in your pipeline.\n- **Time zones.** Health Connect records carry `time` and a nullable `zoneOffset`, described as the user's experienced offset — absent, queries fall back to the current system offset. A morning reading taken while travelling can land on the wrong local day if you ignore it. See [heart rate API](/data/heart-rate-api) for how the same problem shows up in a higher-frequency metric.\n- **Background and history are separate permissions.** Reading in the background needs `android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND`, and reading data older than 30 days needs `android.permission.health.READ_HEALTH_DATA_HISTORY`, both declared separately from the data-type permission.\n\n## Where the wellness framing runs out\n\nSteps and sleep sit comfortably in general-wellness territory. Blood pressure is closer to the line, and the line is drawn by what your app *claims*, not by which API you called. Displaying a value a user's own cleared cuff wrote, with no interpretation, is a different product from flagging readings, suggesting thresholds, or telling someone their number looks high. Our [FDA fitness app regulation](/compliance/fda-fitness-app-regulation) page covers how the general-wellness versus medical-device distinction is framed; treat it as the vocabulary for a conversation with counsel, not as a substitute for one. This page gives no medical advice and no legal advice, and neither should your UI copy.\n\n## Before you ship\n\nRe-check both platform references against the live docs — identifiers, mandatory fields, permission strings, and the SDK-extension-dependent ranges all change. On iOS, write through the correlation and read through it too. On Android, carry `bodyPosition` and `measurementLocation` end to end. For any device vendor, get the measurement site and the regulatory position in writing before you display their numbers. If you also need the on-device versus cloud tradeoff spelled out, see [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data), and the platform-by-platform integration details in [integrate Health Connect](/integrate/google-health-connect) and [integrate Apple HealthKit](/integrate/healthkit)."
  },
  {
    "slug": "respiratory-rate-api",
    "primaryQuery": "respiratory rate api",
    "h1": "Respiratory Rate API: How to Get Breathing-Rate Data",
    "metaTitle": "Respiratory Rate API: Get Breathing Rate Data",
    "metaDescription": "Read respiratory rate from HealthKit, Health Connect, and wearable APIs. The schemas hold a number and a timestamp, and never say how it was derived.",
    "updated": "2026-08-12",
    "answer": "Respiratory rate is exposed as a bare number on both mobile platforms. Apple HealthKit defines HKQuantityTypeIdentifier.respiratoryRate as discrete samples in count over time units, and states that the system records them automatically on Apple Watch. Android Health Connect defines RespiratoryRateRecord in the Vitals category with only rate, time, and metadata, where rate is breaths per minute with a valid range of 0 to 1000. Neither type carries a method or provenance field, so the store cannot tell you whether a value came from a wearable algorithm, a medical device, or someone typing. On our pages, Oura returns respiratory rate inside its sleep payload and Fitbit documents a respiratory_rate OAuth scope; other vendors are not documented here, so verify them.",
    "faqs": [
      {
        "q": "What unit does respiratory rate use on HealthKit versus Health Connect?",
        "a": "Health Connect fixes it: RespiratoryRateRecord exposes rate as a Double documented as respiratory rate in breaths per minute, with a valid range of 0 to 1000. Apple leaves it open: HKQuantityTypeIdentifier.respiratoryRate uses count over time units, so you choose the HKUnit on read and on write. Normalizing between the two platforms without pinning the unit on the iOS side is a quiet factor-of-sixty bug, so store the unit alongside every value."
      },
      {
        "q": "Does the API tell me how a breathing-rate value was produced?",
        "a": "No. Neither platform type carries a method or source field. Health Connect's record holds only rate, time, and metadata, and Apple's is a bare quantity sample, so the same record could hold a wearable's derived value, a reading from a dedicated device, or a number a person typed. Compare Vo2MaxRecord, which does carry a measurementMethod field. The only provenance available is the record metadata, so name the source in your UI rather than presenting the figure as a platform fact."
      },
      {
        "q": "Can Health Connect compute a nightly average respiratory rate?",
        "a": "Not for you. The Health Connect data types page lists aggregate metrics for several vitals, such as systolic and diastolic averages for blood pressure and BPM averages for resting heart rate, but lists none for RespiratoryRateRecord. The record is also an instantaneous type, so there is no built-in nightly value at all. If you want an overnight average, read the individual records and compute it yourself, and be able to say which samples went into it."
      },
      {
        "q": "Which wearable APIs return a breathing rate field?",
        "a": "On our pages, Oura API v2 returns respiratory rate as part of its sleep payload alongside sleep stages and HRV, and Fitbit's documented OAuth scope list includes respiratory_rate. Apple HealthKit covers the metric among its data types. WHOOP, Garmin, and Strava are not documented on our pages for this metric, so verify them in each vendor's live data dictionary. Where the value lives in a sleep object, availability depends on the user sleeping with the device on."
      },
      {
        "q": "Does an Apple Watch record breathing rate on its own?",
        "a": "Apple's documentation for the respiratory rate quantity type states that the system automatically records samples on Apple Watch. Your app does not trigger a measurement and cannot request one; you ask for read authorization and see whatever has already been recorded. The docs do not state which sensor signal the value is derived from, so treat it as a within-person wellness trend and avoid comparing values across brands as if they were the same measurement."
      }
    ],
    "related": [
      {
        "href": "/data/sleep-tracking-api",
        "label": "Sleep tracking API"
      },
      {
        "href": "/data/heart-rate-api",
        "label": "Heart rate API"
      },
      {
        "href": "/integrate/oura-api",
        "label": "Integrate the Oura API"
      },
      {
        "href": "/data",
        "label": "All health-data metrics"
      }
    ],
    "cta": {
      "pitch": "Thin vitals schemas hide the interesting caveats - subscribe for developer notes on what wearable and platform health APIs actually guarantee before you build on them."
    },
    "body": "Respiratory rate is one of the quietest fields in a health store. It arrives without the user asking for it, it is a single small number, and both platforms define it in about three lines. That brevity is the problem: the schemas are so thin that they tell you almost nothing about where the number came from, and a breathing-rate chart is very easy to build and very easy to build wrong.\n\n## What the two platform stores actually define\n\nApple documents `HKQuantityTypeIdentifier.respiratoryRate` as \"A quantity sample type that measures the user's respiratory rate,\" available from iOS 8.0 and watchOS 2.0. The discussion is short and worth reading literally: these samples use count/time units, they measure discrete values, and \"The system automatically records samples on Apple Watch.\"\n\nTwo things follow. First, the unit is not fixed for you — count over time means you choose the `HKUnit` when you read and when you write, and reading in counts per second when you expected counts per minute is a factor-of-sixty bug that looks plausible enough to survive review. Second, on Apple Watch the samples appear on their own. Your app does not trigger a measurement and cannot ask for one; you request read authorization and see whatever the system has already recorded.\n\nHealth Connect's `RespiratoryRateRecord` is thinner still. It sits in the Vitals category as an instantaneous record type, with `metadata`, `rate`, and `time` as its mandatory fields, gated on `android.permission.health.READ_RESPIRATORY_RATE` and `android.permission.health.WRITE_RESPIRATORY_RATE`. The Kotlin reference describes it as capturing \"the user's respiratory rate,\" where \"Each record represents a single instantaneous measurement,\" and pins the unit down explicitly: `rate` is a `Double`, \"Respiratory rate in breaths per minute. Required field. Valid range: 0-1000.\" The constructor takes only `time`, `zoneOffset`, `rate`, and `metadata`.\n\nA valid range topping out at 1000 breaths per minute is not a sanity check. The store will happily hold physiologically impossible values, so range filtering is your job, not the platform's.\n\n## Where you can get it\n\n| Source | What it gives you | How you access it | Verified from |\n|---|---|---|---|\n| Apple HealthKit | `HKQuantityTypeIdentifier.respiratoryRate` — discrete samples in count/time units; recorded automatically on Apple Watch | On-device read with per-type authorization; no cloud pull | Apple HealthKit developer documentation for the identifier, fetched 2026-08-12 |\n| Android Health Connect | `RespiratoryRateRecord` — a single instantaneous `rate` in breaths per minute | On-device read/write via the Health Connect client and the respiratory-rate permissions | Health Connect data types page and the `RespiratoryRateRecord` Kotlin reference, fetched 2026-08-12 |\n| Oura API v2 | Respiratory rate as part of the sleep payload, alongside sleep stages and HRV | Cloud OAuth 2.0, after the ring syncs | Documented on our [Oura vs WHOOP](/compare/oura-vs-whoop) comparison |\n| Fitbit Web API | A `respiratory_rate` OAuth scope appears in the documented scope list | Cloud OAuth 2.0 | Documented on our [Fitbit API integration guide](/integrate/fitbit-api) — verify the current scope list and endpoints |\n| WHOOP, Garmin, Strava | Not documented on our pages — verify in each vendor's live data dictionary | Cloud OAuth where a field exists at all | Not documented on our pages |\n| Aggregators (Terra, Junction, Rook) | Whatever the underlying source supplies, under one normalized schema | One cloud API plus webhooks | Not documented on our pages — verify |\n\nNote what the Oura row implies. Where a vendor does expose respiratory rate, it can arrive inside a sleep object rather than as a standalone time series — which means the metric's availability is tied to whether the user slept with the device on, not to whether they wore it that day.\n\n## Nobody tells you where the number came from\n\nThis is the part to get right before you draw anything. Neither platform type carries a method or source field. Health Connect's record has `rate`, `time`, and `metadata` — nothing else. Apple's is a bare quantity sample. Compare that with `Vo2MaxRecord`, which carries a `measurementMethod` field precisely so a consumer can tell an estimate from a metabolic-cart reading (see [VO2 max API](/data/vo2-max-api) for how that plays out). Respiratory rate has no equivalent.\n\nSo the same `RespiratoryRateRecord` could hold a value produced by a wearable's algorithm overnight, a value from a dedicated medical device, or a value a clinician's app or the user themselves typed in. Both platforms expose a write permission, so anything in the store may have been written by another app entirely. The only provenance you get is `metadata`, and the only honest UI is one that names the source rather than presenting \"your breathing rate\" as a platform fact.\n\nNor do the platform docs state how any given wearable derives the number. Apple's page says the system records samples on Apple Watch; it does not say from what signal. That gap is the whole story for accuracy claims. A wrist device has no spirometer and no chest band, so whatever it reports has been worked out from other sensor data by a method the vendor has not published in the platform docs — and none of the sources checked here document that method. Do not tell users what their breathing rate \"means,\" and do not compare a value from one brand against a value from another as though they were the same measurement. Treat it the way our [heart rate API](/data/heart-rate-api) page treats derived aggregates: a within-person trend, framed as a wellness signal.\n\nQuestions worth asking a vendor before you display their numbers:\n\n- Over what window is the value computed — a whole night, a sleep stage, a spot check?\n- Is it produced only during sleep, or also while awake?\n- What sensor signal is it derived from, and has that derivation been validated against anything?\n- Does the API return one value per night, or a series?\n- Which devices in their lineup produce it at all?\n\n## The traps\n\n- **No built-in aggregates.** Health Connect lists aggregate metrics for plenty of vitals — blood pressure has systolic and diastolic averages, minima, and maxima; resting heart rate has BPM averages — but the data types page lists none for `RespiratoryRateRecord`. If you want a nightly average, compute it yourself from the records you read.\n- **Instantaneous, so there is no nightly value.** Both stores hold point-in-time samples. \"Last night's respiratory rate\" is a definition you invent, and you should be able to say which samples went into it.\n- **The unit trap on iOS versus Android.** Health Connect fixes breaths per minute. HealthKit gives you count over time and lets you pick. Normalizing across the two without pinning the unit on the iOS side is a silent data-corruption path.\n- **Time zones.** Health Connect records carry `time` plus a nullable `zoneOffset` describing the user's experienced offset; when it is absent, queries assume the current system offset. For an overnight metric that already straddles midnight, getting this wrong shifts readings onto the wrong day — the same day-boundary problem that bites sleep data.\n- **Background and history need their own permissions.** Reading while your app is in the background requires `android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND`, and reading data older than 30 days requires `android.permission.health.READ_HEALTH_DATA_HISTORY`, declared separately from the data-type permission.\n- **Sparse by nature.** If the value is generated during sleep, a user who naps, travels, or charges their device overnight simply has no record for that day. Design the empty state first.\n\n## Keep the claims small\n\nBreathing rate is a vital sign, and a feature that flags it, sets thresholds on it, or hints at what a change might indicate is a different product from one that shows a trend line. Which side of that line you land on depends on what your app claims, not which API returned the number. Our [FDA fitness app regulation](/compliance/fda-fitness-app-regulation) page sets out how the general-wellness versus medical-device framing is usually drawn — use it as vocabulary for a conversation with counsel, not as a substitute for one. Nothing here is medical or legal advice, and your UI copy should not read like either.\n\n## Before you ship\n\nRe-verify the identifiers, mandatory fields, permission strings, and valid ranges against the live Apple and Google references — these move. Pin the HealthKit unit explicitly. Filter implausible values yourself, because the store will not. Record and display the source of every value, since the schema will not tell you. And for any vendor field, confirm the measurement window and device coverage in that vendor's own data dictionary rather than inferring it from the fact that a number showed up."
  }
];
