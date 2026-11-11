import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED "X vs Y" developer comparison pages (originally auto-assembled;
 * since hand-edited — edit here). Article + FAQPage (no HowTo).
 * Framed through the API/developer lens; recommends by use-case (the KinesteX
 * pages close with a verdict on stated criteria, ops/GEO.md 2026-11-09); every
 * volatile specific hedged "verify".
 */
export const compareEntries: ClusterEntry[] =
[
  {
    "slug": "oura-vs-whoop",
    "primaryQuery": "oura vs whoop api",
    "h1": "Oura vs WHOOP: Which API for Your App?",
    "metaTitle": "Oura vs WHOOP API (2026): Which for Your App?",
    "metaDescription": "Oura API vs WHOOP API for developers: sleep stages, HRV, recovery, temperature, OAuth, webhooks, and which end users must pay.",
    "updated": "2026-07-23",
    "answer": "Pick the Oura API when your app is built on sleep architecture, HRV, and nightly body-temperature deviation from users who often own their ring outright; pick the WHOOP API when you want a Recovery-and-strain framing from a base where the hardware is a subscription, so every active user is a paying member with full data. Both are cloud REST APIs on OAuth 2.0 with scoped tokens and webhooks. The biggest developer differences: Oura's personal access tokens were deprecated in December 2025 and are no longer available, full Oura Gen3+ data needs a membership so completeness varies, and WHOOP uses rotating refresh tokens that can trip up multi-worker backends.",
    "body": "## How to compare Oura and WHOOP\n\nThree things decide this head-to-head. Weigh them in this order:\n\n- **Data-model fit.** Oura centers on sleep stages, HRV, a Readiness Score, and nightly body-temperature *deviation from baseline*; WHOOP centers on a Recovery percentage, daily strain (cycles), and sleep with a per-session stage timeline. Match the API to the metric your product is actually built around.\n- **Who has full data.** With Oura, the user needs a ring and, for full Gen3+ readiness and insights, an Oura membership — not every ring owner subscribes, so completeness varies. With WHOOP, the hardware *is* the subscription, so every active user is a paying member and \"does this user have full data?\" is effectively always yes.\n- **Auth and freshness.** Both are OAuth with webhooks, but the operational details differ: Oura's PAT deprecation changes how new integrations authenticate, and WHOOP uses rotating refresh tokens that can bite multi-worker backends. Plan for these before you design.\n\nAccess and roadmap items on this page are factual integration constraints, not a knock on either product.\n\n## Oura API vs WHOOP API at a glance\n\n| Dimension | Oura API v2 | WHOOP API v2 |\n|---|---|---|\n| Data exposed | Sleep with stages, HRV, respiratory rate, Readiness Score (HRV balance, resting-HR trend, temperature deviation), activity, heart-rate series, workouts, sessions, SpO2 | Recovery % (0–100), resting HR, HRV, daily strain (cycles), sleep with per-session stage timeline, workouts, body measurement; SpO2 and skin temperature for 4.0 members (verify) |\n| Temperature | Nightly deviation from personal baseline, not an absolute reading | Skin temperature for 4.0 members (verify which bands are gated) |\n| API access | `OAuth 2.0` Authorization Code, scoped Bearer tokens; PATs deprecated December 2025 and no longer available | `OAuth 2.0` Authorization Code, scoped tokens, rotating refresh tokens (each refresh invalidates the prior one) |\n| User requirement | Owns an Oura ring; full Gen3+ data needs an Oura membership | Hardware is a subscription — every active user is a paying member |\n| Freshness / webhooks | Webhook subscriptions per data_type (sleep, readiness, activity, workout, etc.) with create/update/delete events | v2 webhooks (sleep.updated, recovery.updated, workout.updated/deleted); v1 webhooks removed |\n| Cost model | Ring purchase plus membership on the user side; verify API commercial terms and any membership price | Recurring member subscription on the user side; verify API commercial terms and any subscription price |\n\nPrices for the ring, the Oura membership, and the WHOOP subscription are not listed here — see [Oura API pricing](/pricing/oura-api-pricing) and confirm current figures on each vendor's own pages.\n\n## Where Oura pulls ahead\n\nOura's edge is depth on sleep and recovery science. Its Readiness Score is built from named contributors — HRV balance, resting-heart-rate trend, prior-day activity, and body-temperature deviation — and that temperature signal, reported as a nightly deviation from the user's own baseline rather than an absolute number, is a genuinely useful input for cycle-tracking or early illness signals. On the business side, many Oura users bought their hardware outright, which fits products aimed at owners rather than subscribers. The trade-off that decides it against WHOOP: full Gen3+ data depends on an active Oura membership, so a ring owner who let their subscription lapse can return thinner data, and you have to design for that variance. There is also the auth change — Oura's API spec says personal access tokens were deprecated in December 2025 and are no longer available for use, so every integration must use `OAuth 2.0`.\n\n## Where WHOOP pulls ahead\n\nWHOOP's edge is a clean recovery-and-strain model on top of a base where data completeness is reliable. Because the hardware is sold as a subscription, every active user is a paying member, so you rarely face the \"this user has partial data\" problem — a real advantage for a coaching product that needs consistent daily signals. The API frames the day around a Recovery percentage (0–100) generated after a sleep cycle completes, daily strain via physiological cycles, and sleep with a per-session stage timeline, which maps cleanly onto readiness or training-load features. The catches to plan for: WHOOP uses rotating refresh tokens, where each refresh invalidates the prior refresh token — a concurrency gotcha if multiple workers refresh at once — and v1 webhooks have been removed, so build against v2 (sleep.updated, recovery.updated, workout events). Some metrics such as SpO2 and skin temperature are gated to 4.0 members (verify which bands).\n\n## Which should you pick?\n\nMatch the API to your use-case rather than hunting for a single winner:\n\n- **If your product is built on sleep architecture, HRV, and temperature trends** (cycle tracking, illness signals, deep sleep coaching) → pick Oura, and design for membership-driven data variance across users. For the cycle case, [building a cycle tracking app](/build/cycle-tracking-app) covers the record schema, the prediction and the storage decision around it.\n- **If you want guaranteed always-subscribed users and a tight recovery/strain framing** → pick WHOOP, where every active member returns full data and Recovery/strain are first-class.\n- **If you want users who own their hardware outright** rather than paying a recurring fee → Oura fits that audience; WHOOP has no one-time-purchase path.\n- **If you are supporting many wearables at once** and would rather not maintain two OAuth integrations, consider a health-data aggregator instead — see the [wearable data APIs](/fitness-apis/wearable-data-apis) overview. For setup on either source directly, read the [Oura API integration guide](/integrate/oura-api) or the [WHOOP API integration guide](/integrate/whoop-api).\n\n## Watch the fine print\n\nAuth models, gated metrics, and membership or subscription prices in this category shift often. Everything volatile above — which WHOOP metrics are gated to 4.0 or newer bands, and every price — is flagged \"as of 2026, verify.\" The Oura PAT deprecation is settled: Oura's spec says personal access tokens were deprecated in December 2025 and are no longer available for use. Confirm the current scopes, webhook event names, and commercial terms in each provider's primary developer docs before you build.",
    "faqs": [
      {
        "q": "What data does the Oura API expose that WHOOP does not?",
        "a": "Oura's API v2 centers on sleep with stages, HRV, respiratory rate, a Readiness Score with named contributors, and nightly body-temperature deviation from the user's personal baseline. WHOOP reports skin temperature for 4.0 members but frames the day around a Recovery percentage and daily strain rather than a readiness-contributor breakdown. Verify the current metric lists and which are gated to specific bands in each provider's docs."
      },
      {
        "q": "Do PATs still work for the Oura API?",
        "a": "No. Oura's API spec says personal access tokens were deprecated in December 2025 and are no longer available for use, so new and existing integrations alike must use the OAuth 2.0 Authorization Code flow with scoped Bearer tokens."
      },
      {
        "q": "Does every WHOOP user have full API data, unlike Oura?",
        "a": "Effectively yes for active WHOOP members: WHOOP's hardware is sold as a subscription, so every active user is a paying member and data completeness is reliable. Oura is different — a user needs a ring, and full Gen3+ readiness and insights require an Oura membership, so a ring owner without an active subscription can return thinner data. Design for that variance if you integrate Oura."
      },
      {
        "q": "Do Oura and WHOOP both support webhooks?",
        "a": "Yes. Oura offers webhook subscriptions per data_type (sleep, readiness, activity, workout, and more) with create, update, and delete events. WHOOP offers v2 webhooks such as sleep.updated, recovery.updated, and workout.updated or deleted; note that v1 webhooks have been removed, so build against v2. Verify current event names and payloads in each provider's webhook docs."
      },
      {
        "q": "Should I integrate Oura and WHOOP directly or use an aggregator?",
        "a": "Integrate directly when you need only one or two sources and want the deepest native fields and control. If you plan to support many wearables at once, a health-data aggregator lets you code one integration instead of maintaining separate OAuth flows and webhook handlers per provider. See our wearable data APIs overview to weigh the trade-off, and verify each aggregator's coverage and pricing model."
      }
    ],
    "related": [
      {
        "href": "/integrate/oura-api",
        "label": "Integrate the Oura API"
      },
      {
        "href": "/integrate/whoop-api",
        "label": "Integrate the WHOOP API"
      },
      {
        "href": "/pricing/oura-api-pricing",
        "label": "Oura API pricing"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "We break down a new wearable and fitness API every week — OAuth quirks, gated metrics, and webhook gotchas included — so subscribe and skip the surprises."
    }
  },
  {
    "slug": "fitbit-vs-apple-watch",
    "primaryQuery": "fitbit vs apple watch api",
    "h1": "Fitbit vs Apple Watch: Which for Your App?",
    "metaTitle": "Fitbit vs Apple Watch API: Cloud vs On-Device",
    "metaDescription": "Fitbit exposes a cloud Web API (OAuth); Apple Watch data is read on-device via HealthKit. Compare data, access, and platform reach for your build.",
    "updated": "2026-07-23",
    "answer": "Pick Fitbit if you want backend-first, cross-platform access - it is a cloud Web API your servers call with OAuth 2.0, without the user's phone present. Pick Apple Watch via HealthKit if you are building an iOS-native app for users already in Apple Health. The single biggest developer difference: Fitbit is a cloud API, while Apple Watch has no cloud endpoint at all - its data lives on-device in HealthKit, so you must ship a native iOS app and sync it yourself. Google's Fit migration guide (updated September 10, 2026) lists the Google Health API as the recommended path for Fitbit Web API integrations, and Google's Google Health API page (read October 31, 2026) puts the legacy API's turn-off on November 2, 2026.",
    "body": "## Fitbit vs Apple Watch: the real difference for developers\n\nThis is not a \"which wristband is nicer\" question. For a developer choosing a data source, Fitbit and Apple Watch sit on opposite sides of the single biggest architectural line in wearable integration: **cloud API vs on-device store**.\n\n**Fitbit** exposes your users' data through a **cloud Web API** — a server-to-server REST interface you reach with OAuth 2.0. Your backend can pull a consented user's data without their phone being present, from any platform. **Apple Watch has no cloud API at all.** Its data lives in **Apple HealthKit**, an on-device framework on the user's iPhone. To read it you must ship a native iOS app, have the user install it and grant HealthKit permission, then sync to your own backend. Pick Fitbit if you want backend-first, cross-platform access; pick Apple Watch via HealthKit if you are building an iOS-native app for users who already live in Apple Health. Everything below follows from that split. All specifics here are as of 2026 — verify against official docs before you build.\n\n## At a glance\n\n| Dimension | Fitbit | Apple Watch (via HealthKit) |\n|---|---|---|\n| How you access data | Cloud Web API, server-to-server REST | On-device framework; **no cloud endpoint** exists |\n| Data exposed | Steps/activity, heart rate incl. HRV, sleep with stages, SpO2, cardio fitness (VO2-max estimate), Active Zone Minutes, body/weight, food/water; intraday time series | Workouts with heart-rate stream, active calories, GPS (where the workout supports it), duration, plus the broad Health data types |\n| Auth model | OAuth 2.0 with granular scopes (`activity`, `heartrate`, `sleep`, `oxygen_saturation`, `cardio_fitness`, etc.) | Per-user on-device HealthKit permission prompt; no server tokens |\n| Platform reach | Cross-platform; reachable from your backend regardless of user's OS once consented | iOS/iPadOS only; requires a native app on the device |\n| User's phone required? | No — backend can pull without the phone in-hand | Yes — data reads happen on-device, in your app |\n| Freshness | Subscriptions/webhooks on the API (verify current model post-migration) | Your app reads locally and syncs on its own schedule; background delivery is app-managed |\n| Big caveat | Legacy Fitbit Web API support ended September 30, 2026 and Google turns it off on **November 2, 2026**; the **Google Health API** is the listed path | No cloud alternative; a \"server-side Apple Watch pipeline\" always means HealthKit + your own app |\n\n## Where Fitbit wins\n\nFitbit is the choice when your architecture is **backend-first or cross-platform**.\n\n- **Server-side reach.** Because it is a real cloud API, your servers pull consented data directly. A web product with no mobile app, a nightly analytics job, or an Android-inclusive user base all work without asking the user to open anything.\n- **Broad, granular data.** Fitbit covers the mainstream metric set and offers **intraday** (high-granularity) time series for heart rate, activity, SpO2 and breathing rate. Note that intraday data for *other* users (Client/Server app types) is granted case-by-case; a developer's own data is available automatically via the \"Personal\" app type. Verify the current approval process.\n- **Standard OAuth onboarding.** Granular scopes let you request exactly the data types your app needs.\n\n**The honest trade-off:** the **Google Health API migration**. The Fitbit Web API is being replaced by the Google Health API (`health.googleapis.com`, Google OAuth). [Google's Google Health API page](https://developers.google.com/health/about) (read October 31, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026 and a full turn-off on November 2, 2026; until then the legacy API keeps running alongside its successor, but without support. [Google's Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit) (updated September 10, 2026) lists the Google Health API as the recommended path for Fitbit Web API integrations. Google's Health API migration guide says existing Fitbit tokens **cannot** be transferred, so users must re-consent via Google OAuth — budget engineering time for the re-integration, and check the [Fitbit API deprecation status](/fitbit-api-shutdown) before you schedule it. See the [Fitbit API integration guide](/integrate/fitbit-api) and, for the successor's cost picture, [Fitbit API pricing](/pricing/fitbit-api-pricing).\n\n## Where Apple Watch (HealthKit) wins\n\nApple Watch is the choice when you are building an **iOS-native experience** and want the richest first-party Apple Watch stream.\n\n- **Deep, first-party workout data.** Through HealthKit you get workouts with the associated heart-rate stream throughout, active calories, GPS where the workout supports it, and duration — plus the broad set of Apple Health data types the user has stored.\n- **You meet the user where they already are.** If your audience already logs everything into Apple Health, HealthKit reads from that single on-device store rather than asking them to connect yet another cloud account.\n- **On-device privacy model.** Health data stays in an encrypted store on the user's device; Apple runs no cloud service that aggregates it. That can be a compliance advantage for the right build.\n\n**The honest trade-off:** the **on-device, iOS-only constraint**. There is no Apple server endpoint, so you cannot pull without the user's active, on-device involvement. You must ship and maintain a native iOS app, the user must install it and grant permission, and *you* own the sync to your backend. It excludes Android users entirely. For the setup, see the [Apple HealthKit integration guide](/integrate/healthkit). If your users are on Android too, the on-device analog there is Health Connect — the trade-offs are laid out in [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect).\n\n## Which should you pick?\n\nDecide by where your app runs and how it needs the data, not by the device itself.\n\n- **Backend-first, cross-platform, or a web product with no iOS app** → **Fitbit (Google Health API).** A real cloud API is the only one of the two your servers can call directly. Just plan for the move to the Google Health API and user re-consent.\n- **iOS-native app, users already in Apple Health, and you want the richest Apple Watch workout and heart-rate stream** → **Apple Watch via HealthKit.** Accept that it is iOS-only and on-device, and that you build the app-plus-sync yourself.\n- **You need both wearable ecosystems from one integration** → neither first-party path alone covers it. A cross-device aggregator normalizes Fitbit's cloud API and HealthKit's on-device SDK behind one interface; see the [wearable data APIs](/fitness-apis/wearable-data-apis) overview. If Fitbit's migration effort is the sticking point, weigh the [Fitbit API alternatives](/alternatives/fitbit-api-alternatives).\n\n## Honest close\n\nThe clean mental model — Fitbit is a cloud API your backend can call, Apple Watch is an on-device store you read through a native iOS app — is the durable part. The volatile part is Fitbit's move to the Google Health API, which rewrites endpoints and auth; Google lists the legacy API's turn-off for November 2, 2026. Re-open the official Fitbit, Google Health, and Apple HealthKit developer docs and confirm the current specifics before you build or budget against them.",
    "faqs": [
      {
        "q": "Does Apple Watch have a cloud API like Fitbit?",
        "a": "No. There is no Apple server endpoint for Apple Watch data. HealthKit is an on-device framework - the data lives in an encrypted store on the user's iPhone and Apple runs no cloud service that aggregates it. To use Apple Watch data you must ship a native iOS app, have the user grant HealthKit permission, read locally, and sync to your own backend. Fitbit, by contrast, is a server-to-server cloud Web API your backend can call directly. As of 2026, verify against the official docs."
      },
      {
        "q": "Can my backend pull Apple Watch data without the user's phone?",
        "a": "No. Because HealthKit is on-device and iOS-only, reads happen inside your native app on the user's device with their active involvement; you cannot pull server-side without it. Fitbit is the opposite - once a user consents via OAuth, your backend can pull their data cross-platform without the phone in-hand. This is the core architectural reason to choose one over the other."
      },
      {
        "q": "What data does each expose to developers?",
        "a": "Fitbit's cloud API covers steps/activity, heart rate including HRV, sleep with stages, SpO2, cardio fitness (a VO2-max estimate), Active Zone Minutes, body/weight, and food/water, with intraday time series for some metrics. Apple Watch via HealthKit exposes workouts with the associated heart-rate stream, active calories, GPS where the workout supports it, and duration, plus the broad Health data types the user has stored. As of 2026, verify exact fields and granularity."
      },
      {
        "q": "Is the Fitbit API changing in 2026?",
        "a": "Yes. The Fitbit Web API is being replaced by the Google Health API (health.googleapis.com, Google OAuth), which Google's Fit migration guide (updated September 10, 2026) lists as the recommended path for Fitbit Web API integrations. Google's Google Health API page (read October 31, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026 and a full turn-off on November 2, 2026, after which it no longer syncs data. Google's Health API migration guide says existing Fitbit tokens cannot be transferred, so users must re-consent via Google OAuth."
      },
      {
        "q": "Which should I choose for a cross-platform app?",
        "a": "Fitbit, because it is a real cloud API your backend can call regardless of the user's OS once they consent. Apple Watch via HealthKit is iOS-only and on-device, so it cannot serve Android users or a phone-less server pipeline. If you need both ecosystems from one integration, neither first-party path alone covers it - a cross-device aggregator normalizes Fitbit's cloud API and HealthKit's on-device SDK behind one interface."
      }
    ],
    "related": [
      {
        "href": "/integrate/fitbit-api",
        "label": "Integrate the Fitbit API"
      },
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Fitbit's move to the Google Health API is rewriting cloud access and auth throughout 2026 - subscribe for plain-English updates when the details change."
    }
  },
  {
    "slug": "strava-vs-garmin-connect",
    "primaryQuery": "strava vs garmin api",
    "h1": "Strava vs Garmin: Which API for Your App?",
    "metaTitle": "Strava vs Garmin API: Which for Your App? (2026)",
    "metaDescription": "Strava vs Garmin API for developers: self-serve OAuth vs partner approval, social segments vs first-party device metrics, plus 2026 access changes.",
    "updated": "2026-07-23",
    "answer": "Pick the Strava API when you want fast, self-serve OAuth access to activities, routes, and its signature segment and social data across many device brands; pick Garmin's developer program when you need first-party device metrics like Body Battery, VO2 max, HRV, and all-day health and you can clear partner approval. Both are activity- and GPS-centric cloud APIs, but Strava is self-serve once you hold a Strava subscription, while Garmin's full server-side access requires approval into its Connect Developer Program, now offered as Starter and Enterprise Access. The other decider is recent change: Strava tightened its program in 2024, its getting-started guide calls a Strava subscription a prerequisite for creating an app, and its API Policy, effective June 1, 2026, forbids using Strava data in connection with the development, training, evaluation or operation of any AI application.",
    "body": "## How to compare Strava and Garmin Connect\n\nThree things decide this head-to-head. Weigh them in this order:\n\n- **Access friction.** Strava is self-serve OAuth you can start today if you hold a Strava subscription; Garmin's Health API access is gated behind approval into its developer program, which since October 2026 starts at Starter Access. This is the single biggest practical difference between them.\n- **Data-model fit.** Strava's edge is its social layer — segments, segment efforts, kudos, and cross-brand activity aggregation. Garmin's edge is depth of first-party device metrics from hardware it makes. Match the API to the data your product actually needs.\n- **Rules and roadmap.** Strava's API Policy, effective June 1, 2026, lets an app show Strava data only to the athlete who provided it and forbids using Strava data in connection with the development, training, evaluation or operation of any AI application — directly relevant if you are building an AI fitness product — and its getting-started guide calls a Strava subscription a prerequisite for creating an app. Garmin's program is approval-gated, and its API pages mark some features, enhanced beat-to-beat interval and ping/pull delivery among them, as supported with Enterprise Access only. Both affect whether you can ship on your timeline.\n\nA note on the approval and policy items throughout this page: they are factual access constraints, not a knock on either product. A tighter gate or usage rule often reflects stricter user-data handling.\n\n## Strava vs Garmin Connect at a glance\n\n| Dimension | Strava API | Garmin Connect Developer Program |\n|---|---|---|\n| Data exposed | Activities (GPS, distance, pace, elevation), segments and segment efforts, athlete profile, social graph, activity streams; aggregates many device brands | First-party device metrics via Activity API (detailed activities, 100+ types) and Health API (heart rate, HRV, sleep, steps, stress, Body Battery, VO2 max, respiration) |\n| API access | Self-serve `OAuth 2.0` once you hold a Strava subscription; new apps start in single-player mode, and more than 10 athletes needs Strava's review | Approval required; full health-data push requires acceptance into the program; Starter or Enterprise Access |\n| User requirement | Any Strava account (users can sync many brands of device into it); Standard Tier apps may require specified end users to hold an active Strava subscription | A Garmin device, bought outright (no recurring membership needed for data) |\n| Freshness | `OAuth`-authorized pulls plus webhook events when an activity is created, updated or deleted and when an athlete revokes access | Server push (ping/notification) to approved partners |\n| Cost model | No charge for API access under Strava's API Agreement, effective June 1, 2026; a Strava subscription is a prerequisite for creating an app | No price published for Starter Access; Enterprise commercial terms are tailored, per Garmin's overview |\n| Watch out | Strava data may be shown only to the athlete who provided it and may not be used in developing, training, evaluating or operating any AI application; default limits of 200 requests per 15 minutes and 2,000 a day | Approval with no stated review time; some features Enterprise-only |\n\n## Where Strava pulls ahead\n\nThe case for Strava over Garmin comes down to time-to-first-call and its social data. You can register an app and start pulling with self-serve `OAuth 2.0` without waiting on anyone — the on-ramp Garmin does not offer. Its API exposes activities with full GPS and route detail, per-activity streams, and the data no first-party device API has: segments, segment efforts, kudos, and the athlete social graph. Because Strava aggregates activities synced from many device brands, one integration reaches users regardless of what watch they wear, rather than a single manufacturer's hardware. The trade-offs that decide it against Garmin: Strava's getting-started guide calls a Strava subscription a prerequisite for creating an app, and its API Policy, effective June 1, 2026, makes Standard Tier apps subject to subscription requirements for the developer or specified end users; the same policy lets you show Strava data only to the athlete who provided it, and — critically for an AI fitness product — forbids using Strava data in connection with the development, training, evaluation or operation of any AI application. If your product is social, route-, or segment-driven and does not depend on training models on the data, Strava is the faster API to build on. See the [Strava API integration guide](/integrate/strava-api) and [Strava API pricing](/pricing/strava-api-pricing) for current specifics.\n\n## Where Garmin pulls ahead\n\nGarmin wins on metric depth and on the owned-device model, not on ease of entry. Its split of an Activity API (detailed activities such as running, cycling and swimming, with GPS and session detail) and a Health API (all-day summaries — heart rate, HRV, sleep, steps, stress, Body Battery, VO2 max, respiration) reaches further into first-party physiology than Strava's activity-and-social layer does. Because it comes straight from hardware Garmin makes, the metric set is broad and the device-level detail is richer than Strava's aggregated view. The user side is simpler too: a Garmin owner buys the device outright, with no recurring membership required for data to flow. The gate is the catch. Full server-side access needs Garmin's approval, not a self-serve credential; since October 2026 Garmin's program FAQ describes Starter and Enterprise Access and no longer states a review time. Garmin's pages state no price for Starter Access and say Enterprise commercial terms are tailored to business and technical requirements. Confirm you can actually get approved before you design around Garmin's data — see the [Garmin API integration guide](/integrate/garmin-api) for what the program involves.\n\n## Which should you pick?\n\nMatch the API to your use-case rather than hunting for a single winner:\n\n- **If you need a fast, self-serve start with social, segment, and route data across many device brands** → pick Strava, but budget for the Strava subscription its getting-started guide requires to create an app, and confirm its display and AI-use rules fit your product.\n- **If you are building an AI or ML fitness product that trains on user activity data** → Strava's API Policy is a direct blocker: it forbids using Strava data in connection with the development, training, evaluation or operation of any AI application. A first-party source with compatible terms may fit better.\n- **If you need the deepest first-party device metrics** (Body Battery, VO2 max, HRV, all-day health) and your users own Garmin hardware → pick Garmin, but confirm first that you can clear Garmin's approval at the access level you need.\n- **If you want to avoid single-vendor access friction entirely** → an aggregator that normalizes many sources behind one integration can spare you separate builds, but it does not sidestep Strava's rules: Strava's API Policy prohibits operating, offering or facilitating an aggregator that re-exposes its API to third parties; see [wearable data APIs](/fitness-apis/wearable-data-apis) and [Garmin API alternatives](/alternatives/garmin-api-alternatives).\n\n## Watch the fine print\n\nAccess models, fees, rate limits, usage rules, and program status in this category shift often. The Strava terms above are as Strava's pages stated them on October 17, 2026, in its API Agreement and API Policy, both effective June 1, 2026; the Garmin terms are as Garmin's reorganized program pages stated them on October 22, 2026. Garmin publishes no developer price at all, so get its terms in writing. Confirm the current fee, usage terms, rate limits, and program availability in each provider's primary developer docs before you build, especially for anything running at scale.",
    "faqs": [
      {
        "q": "Is the Strava API free to use?",
        "a": "Strava's API Agreement, effective June 1, 2026, says access to the API is currently provided at no charge, with notice promised if Strava decides to start charging. There is a subscription gate, though: Strava's getting-started guide calls a Strava subscription a prerequisite for creating an app, and its API Policy makes Standard Tier apps subject to subscription requirements for the developer or specified end users. The subscription price is not on the Strava developer pages we read, so confirm it on Strava's own site."
      },
      {
        "q": "Can I sign up for Garmin's developer program directly?",
        "a": "Garmin's full server-side access is partner-approval-only rather than a self-serve credential: you request the program, and Garmin's FAQ says that once your request is approved you get the Garmin Developer Portal, starting with Starter Access. Garmin's pages state no price for Starter Access and say Enterprise commercial terms are tailored. Third-party reports from 2026 that new sign-ups were paused could not be verified on Garmin's own pages. Confirm you can get approved before designing around Garmin's data."
      },
      {
        "q": "Can I use Strava data to train an AI or ML model?",
        "a": "No. Strava's API Policy, effective June 1, 2026, says you may not use the Strava API Materials or Strava Data, directly or indirectly, in connection with the development, training, evaluation, or operation of any AI application, and it spells out embeddings, retrieval-augmented generation and context windows. The only exception it names is Strava's own MCP, which subscribers may use with their own data. The same policy lets you show an athlete's data only to that athlete. This is directly relevant if you are building an AI fitness product."
      },
      {
        "q": "Which has richer health metrics, Strava or Garmin?",
        "a": "Garmin exposes deeper first-party device metrics: its Health API covers heart rate, HRV, sleep, steps, stress, Body Battery, VO2 max, and respiration, and its Activity API covers per-activity data such as running, cycling and swimming, with GPS and session detail. Strava's strength is its social layer — segments, segment efforts, and cross-brand activity aggregation — rather than owned-device physiology."
      },
      {
        "q": "Do end users need to buy anything to share their data?",
        "a": "For Strava, a user needs a Strava account, into which they can sync activities from many device brands, and Strava's API Policy says Standard Tier apps may require the developer or specified end users to maintain an active Strava subscription. For Garmin, the user needs a Garmin device, bought outright, with no recurring membership required for data to flow. The bigger cost question sits on the developer side: Strava calls a Strava subscription a prerequisite for creating an app, and Garmin says Enterprise commercial terms are tailored to business and technical requirements."
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
        "href": "/pricing/strava-api-pricing",
        "label": "Strava API pricing"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness and wearable API every week — the OAuth gates, partner-approval hurdles, and usage-rule gotchas included, so subscribe and skip the surprises."
    }
  },
  {
    "slug": "fitbit-vs-oura",
    "primaryQuery": "fitbit vs oura api",
    "h1": "Fitbit vs Oura API: Which for Your App?",
    "metaTitle": "Fitbit vs Oura API: Which to Integrate? (2026)",
    "metaDescription": "Fitbit vs Oura API for developers: broad mainstream metrics and intraday data vs deep sleep, HRV, and readiness. Compare access, cost, and best fit.",
    "updated": "2026-07-23",
    "answer": "Pick the Fitbit API when you want broad mainstream coverage, a large install base, and high-frequency intraday time series; pick the Oura API when your app centers on sleep architecture, readiness, HRV, and body-temperature trends. Both are cloud REST APIs behind OAuth 2.0, so you pull server-side without the user's phone in hand. The biggest developer difference is breadth versus depth plus the user requirement: a Fitbit device with a large base, versus an Oura ring plus a membership for full data. Two roadmap items: Google's Google Health API page (read October 31, 2026) lists the turn-off of Fitbit's legacy Web API for November 2, 2026, with the Google Health API as the path, and Oura's API spec says personal access tokens were deprecated in December 2025 and are no longer available, leaving OAuth.",
    "body": "## How to compare Fitbit and Oura\n\nThree questions decide this head-to-head. Weigh them in this order:\n\n- **Data-model fit.** Fitbit is broad and mainstream; Oura is narrow but deep on recovery. Match the API to the metric your product actually needs — a mass-market activity app and a sleep-science app want different sources.\n- **User requirement.** A Fitbit user needs a Fitbit device; an Oura user needs a ring, and full Gen3+ data requires an Oura membership. That membership gate means not every ring owner returns complete data.\n- **Roadmap and access.** APIs move. Fitbit's legacy Web API is mid-migration to the Google Health API, with a turn-off Google lists for November 2, 2026, and Oura deprecated personal access tokens in December 2025 in favor of OAuth. Both affect how you integrate this year.\n\n## Fitbit API vs Oura API at a glance\n\n| Dimension | Fitbit | Oura |\n|---|---|---|\n| Data exposed | Broad: steps/activity, HR + HRV, sleep with stages, `SpO2`, VO2-max estimate, Active Zone Minutes, body/weight, food/water; intraday time series | Focused: sleep architecture, readiness, HRV, temperature deviation; plus activity, HR series, workouts, `SpO2` |\n| API access | `OAuth 2.0`, granular scopes; intraday for other users granted case-by-case (verify) | `OAuth 2.0` Authorization Code, scoped Bearer tokens; PATs deprecated December 2025 and no longer available |\n| User requirement | Owns a Fitbit device; large mainstream base; some insights may sit behind Premium (verify) | Owns an Oura ring; full data requires an Oura membership |\n| Freshness / webhooks | Subscriptions API for push notifications | Webhook subscriptions per data type and event (create/update/delete) |\n| Roadmap | Google Health API is the recommended path; legacy Web API support ended Sept 30, 2026 and it turns off Nov 2, 2026; tokens cannot be transferred | Stable v2 API, the only integration point since V1 was sunset; OAuth-only since PATs were deprecated in December 2025 |\n| Cost model | No published per-call API fee found; confirm commercial terms in the developer docs — verify | No published per-call API fee; end-user cost is ring plus membership — verify current pricing |\n\n## Where Fitbit pulls ahead\n\nThe case for Fitbit over Oura is reach and resolution. Its data types span steps and activity, heart rate with HRV, sleep with stages, `SpO2`, a VO2-max estimate, Active Zone Minutes, and body and nutrition logs — the broad surface a general wellness app draws on. For products built on high-frequency signals, Fitbit exposes intraday time series for heart rate, activity, `SpO2`, and breathing rate, which Oura's daily-summary framing does not match for granularity. The device base is broadly mainstream, so you reach more users. The trade-offs that count against it: intraday data for *other* users is unlocked case-by-case rather than by default on the Client/Server app types, and the whole integration surface is changing — the legacy Web API is being replaced by the Google Health API on Google `OAuth 2.0`, and Google's Health API migration guide says existing tokens cannot be transferred, so users re-consent. [Google's Google Health API page](https://developers.google.com/health/about) (read October 31, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026 and a full turn-off on November 2, 2026, and [Google's Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit) (updated September 10, 2026) names the Google Health API as the recommended path — see [Fitbit API deprecation status](/fitbit-api-shutdown). If you can absorb that migration, Fitbit is the broader, higher-volume source. See the [Fitbit API integration guide](/integrate/fitbit-api) for the setup path.\n\n## Where Oura pulls ahead\n\nOura wins on depth in one lane: sleep and recovery. Its v2 API returns sleep with stages, HRV, and respiratory rate; a daily readiness score with contributors like HRV balance, resting-heart-rate trend, and body-temperature deviation; plus heart-rate series, workouts, sessions, and `SpO2`. The body-temperature reading is reported as a nightly deviation from the user's own baseline rather than an absolute value — a strong signal for cycle or illness features that Fitbit's broad set does not frame the same way. [Building a cycle tracking app](/build/cycle-tracking-app) treats a temperature signal like this as an optional input rather than a dependency. Access is clean OAuth 2.0 with scoped Bearer tokens and per-data-type webhooks. The catches are real: users skew premium (a ring plus a membership), so your addressable base is smaller and data completeness varies with who actually subscribes, and Oura's API spec says personal access tokens were deprecated in December 2025 and are no longer available for use, so integrations must use OAuth. The [Oura API integration guide](/integrate/oura-api) covers the OAuth flow. For Python scripts, [oura-ring vs oura](/libraries/compare/oura-ring-vs-oura-python) compares the two third-party clients and their OAuth2 support.\n\n## Which should you pick?\n\nMatch the API to your build rather than hunting for a single winner:\n\n- **If you need broad coverage, a big user base, and intraday high-frequency data** server-side → pick Fitbit, and plan for the Google Health API migration and user re-consent.\n- **If your product is about sleep architecture, readiness, HRV, or temperature trends** → pick Oura, and accept a smaller premium, membership-gated audience in exchange for depth.\n- **If you want the widest addressable install base** → Fitbit's mainstream reach is the stronger fit; Oura's ring-plus-membership requirement narrows who returns complete data.\n- **If you want both breadth and depth without maintaining two integrations** → an aggregator can normalize Fitbit, Oura, and other sources behind one API. See [wearable data APIs](/fitness-apis/wearable-data-apis) for that route.\n\n## Watch the fine print\n\nPricing models, membership and Premium gating, PAT deprecation, and migration dates in this category shift often. Everything volatile above — which fields sit behind Fitbit Premium or an Oura membership — is flagged \"as of 2026, verify.\" Confirm the current terms in each provider's primary developer docs before you build, especially for anything running at scale.",
    "faqs": [
      {
        "q": "What is the main difference between the Fitbit and Oura APIs?",
        "a": "Breadth versus depth. Fitbit exposes a broad mainstream set (steps, heart rate and HRV, sleep with stages, SpO2, VO2-max estimate, Active Zone Minutes, body and nutrition) plus intraday time series. Oura is narrower but deeper on recovery: sleep architecture, a readiness score, HRV, and nightly body-temperature deviation. Both are cloud REST APIs using OAuth 2.0."
      },
      {
        "q": "Does a user need a paid membership to get Oura data through the API?",
        "a": "The user needs an Oura ring, and full Gen3+ data requires an Oura membership, so not every ring owner returns complete data. Fitbit only requires the user own a Fitbit device, though some insights may sit behind Fitbit Premium. Verify which specific fields are gated for each before building."
      },
      {
        "q": "Is the Fitbit Web API being replaced?",
        "a": "Yes. Google's Fit migration guide (updated September 10, 2026) lists the Google Health API, on Google OAuth 2.0, as the recommended path for Fitbit Web API integrations. Google's Google Health API page (read October 31, 2026) lists end of support for the legacy API on September 30, 2026 and a full turn-off on November 2, 2026, after which it no longer syncs data. Google's Health API migration guide says existing tokens cannot be transferred, so users re-consent."
      },
      {
        "q": "Can I still use a Personal Access Token with the Oura API?",
        "a": "No. Oura's API spec says personal access tokens were deprecated in December 2025 and are no longer available for use, so integrations must use OAuth 2.0 Authorization Code with scoped Bearer tokens."
      },
      {
        "q": "Which API is better for intraday, high-frequency data?",
        "a": "Fitbit is the stronger option for intraday time series, exposing high-granularity data for heart rate, activity, SpO2, and breathing rate, though intraday access for other users is granted case-by-case on the Client/Server app types. Oura's API is framed around daily summaries and nightly metrics rather than the same intraday granularity."
      }
    ],
    "related": [
      {
        "href": "/integrate/fitbit-api",
        "label": "Integrate the Fitbit API"
      },
      {
        "href": "/integrate/oura-api",
        "label": "Integrate the Oura API"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness and wearable API every week, OAuth gates, membership requirements, and migration gotchas included, so subscribe and skip the surprises."
    }
  },
  {
    "slug": "whoop-vs-garmin",
    "primaryQuery": "whoop vs garmin api",
    "h1": "WHOOP vs Garmin: Which for Your App?",
    "metaTitle": "WHOOP vs Garmin API: Which to Integrate?",
    "metaDescription": "WHOOP vs Garmin as developer data sources: OAuth vs partner approval, membership vs one-time device, recovery focus vs broad metrics. Pick by use-case.",
    "updated": "2026-07-23",
    "answer": "Pick WHOOP when you want recovery and strain framing from guaranteed-subscribed users reachable through a clean self-serve OAuth API. Pick Garmin when you need the broadest owned-device metric set, like Body Battery, VO2 max, and all-day health, and you can clear partner approval. The single biggest developer difference is the access model: WHOOP is self-serve OAuth 2.0 you can start building against, while Garmin's Health API needs Garmin's approval, now as Starter or Enterprise Access. Both return data only for consenting users, not as a bulk feed.",
    "body": "## How to compare WHOOP and Garmin\n\nThree things decide this head-to-head. Weigh them in this order for your build:\n\n- **Access friction.** WHOOP gives you a documented `OAuth 2.0` flow with scoped tokens and webhooks you can wire up yourself. Garmin gates full server-side health-data push behind approval into its Connect Developer Program, which since October 2026 starts at Starter Access. This is the sharpest practical split between them.\n- **What your user has to have.** With WHOOP the hardware *is* a subscription — every active user is a paying member, so \"does this user have full data\" is effectively always yes. With Garmin the user buys the device once, outright, and needs no recurring membership for the data to flow.\n- **Metric breadth vs recovery focus.** WHOOP is tightly built around recovery, strain, and sleep. Garmin spans an unusually wide range of activity types and health metrics. Match the API to the signal your product actually needs.\n\nA note on the access and program constraints throughout this page: they are factual integration facts, not a knock on either product. A stricter partner gate often reflects tighter handling of first-party device data.\n\n## WHOOP vs Garmin at a glance\n\n| Dimension | WHOOP | Garmin |\n|---|---|---|\n| Data exposed | Recovery % (RHR, HRV; SpO2 + skin temp on 4.0), daily strain, sleep stages, workouts, body measurement | Broad: per-activity data such as running, cycling and swimming, GPS, HR, HRV, sleep, Body Battery, stress, VO2 max, respiration, all-day summaries (verify) |\n| API access | Self-serve `OAuth 2.0`, scoped tokens, rotating refresh tokens | Approval required; Health API + Activity API; Starter or Enterprise Access, with no published price |\n| User requirement | A WHOOP membership — hardware is a subscription, so every active user pays | A Garmin device bought outright — one-time purchase, no membership for data |\n| User cost model | Ongoing recurring membership (do not assume a price — verify) | One-time device purchase; no recurring fee for data |\n| Freshness / webhooks | v2 webhooks for sleep, recovery, workout events (v1 removed) | Server push (ping/notification) to approved partners |\n| Best fit | Recovery/strain coaching, guaranteed-subscribed users, quick OAuth start | Widest owned-device metric set, if you can clear partner approval |\n\nDo not read a developer price into Garmin's model from this table: Garmin's pages state no price for Starter Access and say Enterprise commercial terms are tailored, and Garmin publishes no amounts. Likewise, WHOOP's membership price is not stated here — describe the model, verify the number.\n\n## Where WHOOP pulls ahead\n\nWHOOP wins on time-to-first-call and on data reliability per user. You get a documented `OAuth 2.0` Authorization Code flow with scoped tokens and v2 webhooks (`sleep.updated`, `recovery.updated`, `workout.updated`) you can subscribe to yourself, so you build an event consumer without waiting on a partner review. Its data model is opinionated in a useful way for coaching products: Recovery % on a 0 to 100 scale, daily strain via physiological cycles, sleep with a per-session stage timeline, and workout strain — with SpO2 and skin temperature added for 4.0 members (verify which metrics are gated to which band). The business model is the quiet advantage: because the band is sold as a subscription, every active WHOOP user is a paying member, so you rarely hit the \"this user never subscribed, so half the data is missing\" problem. One integration gotcha to plan for: WHOOP uses rotating refresh tokens — each refresh invalidates the prior one, which can bite a multi-worker backend that refreshes concurrently. If recovery and strain are your product's spine, WHOOP is the faster, more predictable API to build on.\n\n## Where Garmin pulls ahead\n\nGarmin wins on metric breadth and on the owned-device cost model, not on ease of entry. Its split of a Health API (all-day metrics like Body Battery, VO2 max, HRV, stress, respiration, sleep) and an Activity API (per-activity data such as running, cycling and swimming, with GPS) reaches further into serious multisport and physiology than WHOOP's recovery-first frame does (verify the current metric list against the developer docs). And because a Garmin device is a one-time purchase rather than a recurring membership, you can reach users who own hardware outright and pay nothing ongoing — a different, and for some audiences larger, user pool. The catch is access. Full server-side health-data push requires approval into Garmin's developer program; since October 2026 Garmin's FAQ describes Starter and Enterprise Access and no longer states a review time. Confirm you can actually get approved before you design around Garmin's data — that gate, not the data, is the real constraint.\n\n## Which should you pick?\n\nMatch the API to your use-case rather than hunting for a single winner:\n\n- **If you are building recovery or strain coaching and want guaranteed-subscribed users** → pick WHOOP. The self-serve OAuth path lets you start today, and the subscription hardware model keeps per-user data completeness high. See the [WHOOP API integration guide](/integrate/whoop-api) to wire up auth and webhooks.\n- **If you need the broadest owned-device metric set** (Body Battery, VO2 max, stress, all-day health) → pick Garmin, but confirm you can clear Garmin's approval first, at the access level your features need. Start with the [Garmin API integration guide](/integrate/garmin-api).\n- **If you are shipping soon and cannot wait on a review gate** → WHOOP's self-serve OAuth wins on time-to-integration; Garmin depends on approval, and Garmin's pages no longer state how long a review takes.\n- **If your users should not have to pay a recurring membership** → Garmin's one-time-device model fits, whereas WHOOP's subscription hardware means every user carries an ongoing cost.\n\nWeighing the user-cost side of WHOOP for your own model? The [WHOOP API pricing overview](/pricing/whoop-api-pricing) breaks down the membership-based access model.\n\n## Watch the fine print\n\nProgram status, the metric lists, which sensors are gated to which WHOOP band, and both providers' cost specifics shift often. Everything volatile above — the exact WHOOP scope and gated-metric list, and both cost models — is flagged \"as of 2026, verify.\" Do not print a Garmin developer fee: Garmin publishes none, and it says Enterprise commercial terms are tailored. Confirm current program availability, scopes, and terms in each provider's primary developer docs before you build.",
    "faqs": [
      {
        "q": "How do developers access WHOOP vs Garmin data?",
        "a": "WHOOP offers a documented OAuth 2.0 Authorization Code flow with scoped tokens and v2 webhooks you can wire up yourself, so it is effectively self-serve to start. Garmin's Health API is partner-approval-only: full server-side health-data push requires acceptance into its Connect Developer Program, which since October 2026 starts at Starter Access, and Garmin's pages no longer state a review time. Confirm you are approved before designing around Garmin."
      },
      {
        "q": "Does the end user pay for WHOOP or Garmin?",
        "a": "The models differ. WHOOP hardware is sold as a subscription, so every active WHOOP user is a paying member and per-user data completeness stays reliably high. A Garmin device is a one-time purchase the user owns outright, with no recurring membership required for the data to flow. Do not assume a specific WHOOP membership price here; on the developer side, Garmin's pages state no price for Starter Access and say Enterprise commercial terms are tailored."
      },
      {
        "q": "Which exposes more health metrics, WHOOP or Garmin?",
        "a": "Garmin is broader. Its Health and Activity APIs span per-activity data such as running, cycling and swimming, GPS, HRV, sleep, Body Battery, stress, VO2 max, respiration, and all-day summaries. WHOOP is tighter and recovery-focused: Recovery percentage, daily strain, sleep stages, workouts, and body measurement, with SpO2 and skin temperature for 4.0 members. Verify the current metric lists and which sensors are gated to which WHOOP band in each provider's docs."
      },
      {
        "q": "Is there a Garmin API fee?",
        "a": "Garmin does not say. Its program FAQ, read on October 17, 2026, said there were no licensing or maintenance fees for access, with license fees for some metrics used commercially. The reorganized pages read on October 22 state no price for Starter Access, say Enterprise commercial terms are tailored, and mark enhanced beat-to-beat interval as supported with Enterprise Access only. Get terms in writing."
      },
      {
        "q": "Which should I pick for a recovery coaching app?",
        "a": "For recovery or strain coaching, WHOOP is usually the better fit: its data model is built around Recovery percentage and daily strain, the OAuth flow is self-serve so you can start quickly, and the subscription hardware model means users are reliably paying members with complete data. Choose Garmin instead if you specifically need its broader owned-device metrics and can clear partner approval."
      }
    ],
    "related": [
      {
        "href": "/integrate/whoop-api",
        "label": "Integrate the WHOOP API"
      },
      {
        "href": "/integrate/garmin-api",
        "label": "Integrate the Garmin API"
      },
      {
        "href": "/pricing/whoop-api-pricing",
        "label": "WHOOP API pricing"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness and wearable API every week, access gates, cost models, and integration gotchas included, so subscribe and skip the surprises."
    }
  },
  {
    "slug": "terra-vs-rook",
    "primaryQuery": "terra vs rook",
    "h1": "Terra vs ROOK: Which Aggregator API for Your App?",
    "metaTitle": "Terra vs ROOK: Evaluating ROOK's Health Data API (2026)",
    "metaDescription": "Evaluating ROOK? Core is $399/mo for 750 active users; Terra's $399 buys credits per connected source. Normalization, own-credential providers, labs.",
    "updated": "2026-10-17",
    "answer": "Terra and ROOK both connect wearables and phone health stores through one API and both now publish prices, so the decision is about the billing unit and the extras. ROOK's Core plan is $399 a month for up to 750 active users, with Core+ at $999 for 5,000 and Business at $1,999 for 15,000, and it adds medical-device readings, lab-report parsing and a 0 to 100 health score. Terra starts at $399 a month billed annually with 100,000 credits, charges per connected data source and per event past a free allowance, and adds lab ordering in the US and UK plus delivery straight into databases and queues. Both require your own developer accounts for some providers, including WHOOP, Strava and Dexcom; all of this is as of October 17, 2026.",
    "body": "Both are single-integration aggregators, so this is not a \"which has an API\" question; it is which billing unit, delivery model and extras fit your app. Everything below is from Terra's and ROOK's own pages as we read them on October 17, 2026. An earlier version of this page described both vendors' pricing as unpublished, called ROOK wearables-only, and repeated a Latin America positioning and a third-party per-user price estimate; the current pages publish prices, show ROOK selling medical-device and lab-report APIs, and say nothing about Latin America, so those claims are gone.\n\n## At a glance\n\n| Dimension | Terra | ROOK |\n|---|---|---|\n| Coverage claim | \"500+ providers\" on its site; its docs say the Unified API \"supports over 150+ Data Sources\" | \"400+ wearables and health data sources\" in its docs; \"72 data sources and more than 500 devices\" on its integrations page |\n| How sources connect | Cloud APIs from your backend; a mobile SDK for Apple Health, Samsung Health and Health Connect | Direct API integrations for cloud providers; SDKs for Apple Health and Health Connect; 59 of its 72 listed sources are Indirect, reached through those phone stores |\n| Delivery | Signed webhooks, or straight into SQL databases, Supabase, cloud storage, SQS and Kafka, MongoDB or Firestore | Webhooks or API queries |\n| Beyond wearables | Lab test ordering (US and UK), DNA tests, a lab-report parsing API, streaming, planned workouts | Medical Device API, Lab Data API (report parsing), EHR/EMR API on a waitlist, a 0 to 100 health score |\n| Entry price | $399 a month billed annually ($499 monthly), 100,000 credits | Core at $399 a month for up to 750 active users |\n| How the bill grows | 200 credits per connected data source per month; extra credits from $0.005 | Core+ $999 (5,000 users), Business $1,999 (15,000), Enterprise custom |\n| Contract | 30-day money-back guarantee on Quick Start | Standard term 12 months, cancel with 30 days' notice |\n| Your own provider accounts | Its docs name WHOOP, Dexcom, Huawei, Strava and Virtuagym; its integrations table also marks Garmin and Samsung as Required | Dexcom, Samsung Health, Strava and WHOOP |\n\n## Where Terra wins\n\n**Delivery options and lab ordering.** Terra pushes every payload to a destination you choose, and its webhooks are signed: \"Every webhook sent by Terra includes an HMAC-based signature header\". Beyond webhooks it can write straight into \"SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore\". It also orders lab tests (\"Nationwide US, plus the UK\") and DNA tests, which we did not find on ROOK's pages; ROOK parses lab reports your users already have.\n\n**Breadth claims.** Terra's catalog claim is larger, and its FAQ lists Garmin, Fitbit, Apple Watch, Oura Ring, WHOOP, Polar, Samsung Health, Withings, Suunto and Wahoo among sources, though its supported-integrations page, read November 6, 2026, says \"Fitbit has been retired\" since Google turned off the Fitbit Web API on November 2, 2026. Both vendors count differently, so check your users' devices in each live list.\n\n**The trade-off.** Terra's unit is the connected data source, not the person: \"An active authentication is one connected data source for one end user, and costs 200 Unified API credits per month\". A user with a watch and a ring costs twice. See the [Terra integration guide](/integrate/terra-api) for the build.\n\n## Where ROOK wins\n\n**A bill you can read off one table.** ROOK prices by plan and active users, and its pricing page lists each ceiling: Core $399 a month for up to 750 active users, Core+ $999 for up to 5,000, Business $1,999 for up to 15,000. At 1,000 users that is $999 on Core+, against about $899 on Terra by our arithmetic; at 5,000 users ROOK's Core+ is still $999 while Terra is about $4,899, assuming one source per person and annual billing. Past a plan's ceiling, ROOK says \"billing adjusts based on usage\" without a published rate.\n\n**Medical devices and lab reports.** ROOK's Medical Device API delivers \"glucose, blood pressure, oxygen saturation, temperature and ECG readings in one format, with the device that recorded each one\", and its Lab Data API \"turns PDF and image lab reports into structured biomarkers with LOINC codes and FHIR R4 output\". Its EHR/EMR API, a waitlist item on the pricing page, delivers wearable data to clinical systems as FHIR R4.\n\n**A score and an app.** ROOK Score gives \"a simple score, ranging from 0 to 100\", and the ROOK App \"lets end users connect supported sources without embedding the SDKs\", useful for programs without their own mobile app.\n\n**The trade-off.** The standard contract term is 12 months, and add-ons cost extra on Core: Business and Enterprise include every product and add-on, while Core+ includes three.\n\n## Evaluating ROOK as a health data API\n\nIf ROOK is the API you are evaluating for developers, check four things against your own app before the head-to-head below:\n\n- **Price at your active-user count.** Core, Core+ and Business stop at 750, 5,000 and 15,000 active users, on a standard 12-month term.\n- **Coverage you can confirm.** Its docs claim 400+ sources; its integrations page lists 72, and 59 of those reach ROOK through Apple Health or Health Connect.\n- **Your own developer accounts.** Dexcom, Samsung Health, Strava and WHOOP need them, which ROOK says can take several weeks.\n- **Normalization and delivery.** Data arrives in ROOK's own data model, with a 0 to 100 health score, by webhook or API query. Mapping it to your schema is your work, and the pages we read describe no webhook signature scheme.\n\n### What ROOK's documentation commits to\n\nIf you are evaluating ROOK on its own, these are the points its documentation commits to, as we read it on November 2, 2026, and the ones worth testing in its sandbox.\n\n- **What \"normalized\" means there.** ROOK's [definitions page](https://docs.tryrook.io/docs/definitions/) names four kinds of processed data: harmonized data is \"adjusted to consistent units and formats\" (its example is converting miles to kilometers), standardized data is \"formatted uniformly across different providers\", clean data is \"free from duplicates or inconsistencies\", and normalized data is \"adjusted to consistent scales for comparability\". Structured data is data that \"has undergone harmonization, standardization, cleansing, and normalization\". Raw payloads are a separate add-on: the pricing page lists Proprietary & Unstructured Data for the Wearable API at $149 a month on Core.\n- **The data model.** The [ROOK Connect introduction](https://docs.tryrook.io/docs/rookconnect/introduction/) sorts everything into three pillars, Physical, Body and Sleep Health, each delivered as daily summaries and as events, which it calls \"Granular data points representing specific activities or punctual measurements with exact timestamps\". It tells your backend to \"always validate the document_version and datetime fields\" so that an update replaces a record instead of duplicating it.\n- **Two devices, one user.** ROOK's Wearable API FAQ says it \"applies cleaning, prioritization, and deduplication rules to reduce duplicate or inconsistent data\" and that \"The exact rule depends on the data type and source.\" Test it with a user who wears a watch and a ring.\n- **Delivery and environments.** ROOK \"Prioritizes real-time asynchronous delivery via webhooks, keeping the REST API available for on-demand queries.\" Its [API reference](https://docs.tryrook.io/api/), version 2.0.1 with a downloadable OpenAPI specification, lists a production server at `api.rook-connect.com` and a sandbox at `api.rook-connect.review`, plus demo credentials that return default responses.\n- **History.** ROOK's FAQ gives, as a reference, up to seven previous days from API-based sources and up to 29 days from SDK-based ones when a user connects.\n- **Production authorization.** ROOK's Connections Page \"is designed exclusively for the sandbox environment\"; in production your own front end calls the per-source authorization endpoint.\n\n## What we could not verify\n\n- **ROOK webhook signing.** The ROOK pages we read describe webhook delivery but not a signature scheme; check the docs before you rely on one.\n- **Overage rates.** Neither ROOK's usage rate past a plan's ceiling nor Terra's Enterprise terms are published.\n- **What \"500 devices\" means.** ROOK's own pages give two counts, 400+ sources in the docs and 72 sources with 500+ devices on the integrations page.\n\n## Which should you pick?\n\n- **Many users, mostly one device each, and a budget you want flat:** lean ROOK; its active-user ceilings are easier to plan against than per-source credits at a few thousand users.\n- **Users who connect several sources each, or data pushed straight into your warehouse:** lean Terra for its destinations; model the per-source credits first.\n- **Lab tests ordered for your users:** Terra, which orders them in the US and the UK; ROOK parses reports users upload.\n- **Blood pressure cuffs, CGMs and ECG with the device recorded:** lean ROOK's Medical Device API.\n- **Programs without a mobile app:** ROOK App covers the phone stores for you.\n\nFor the rest of the field, see [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) and [aggregator pricing](/pricing/health-data-aggregator-pricing); if ROOK is the vendor you are leaving, [ROOK alternatives](/alternatives/rook-alternatives) compares six options.\n\n## Bottom line\n\nTerra and ROOK both collapse dozens of wearable integrations into one normalized API. Terra's edge is delivery options and lab ordering; ROOK's is an active-user price sheet that stays flat longer, plus medical-device and lab-report APIs. Re-read both live pricing pages before you commit, because the numbers above are from October 17, 2026.",
    "faqs": [
      {
        "q": "Do Terra and ROOK both give one integration for many devices?",
        "a": "Yes. Both are single-integration aggregators that normalize data from many providers such as Garmin, Fitbit, Oura and WHOOP, plus Apple Health and Health Connect through mobile SDKs. As of October 17, 2026, Terra's site claims 500+ providers and ROOK's docs claim 400+ wearables and health data sources, while ROOK's integrations page lists 72 sources, so check your users' devices against each live list."
      },
      {
        "q": "How do their normalization models differ?",
        "a": "Terra returns one schema for every source and pushes it to a destination you configure, from webhooks to SQL databases and queues. ROOK classifies sources into direct API integrations for cloud providers and SDK-based integrations for phone stores, delivers through webhooks or API queries, and adds a 0 to 100 health score. Both normalize into their own data models, so mapping to your schema is still your work."
      },
      {
        "q": "What are Terra and ROOK pricing models?",
        "a": "Both are published as of October 17, 2026. Terra starts at $399 a month billed annually or $499 monthly, includes 100,000 credits, and charges 200 credits a month per connected data source plus credits for events past a free allowance. ROOK prices by plan and active users: Core $399 a month up to 750 active users, Core+ $999 up to 5,000, Business $1,999 up to 15,000, and custom Enterprise, on a standard 12-month contract."
      },
      {
        "q": "Which providers need my own developer account with Terra or ROOK?",
        "a": "As of October 17, 2026, ROOK names Dexcom, Samsung Health, Strava and WHOOP and says setting them up can take several weeks. Terra's docs name WHOOP, Dexcom, Huawei, Strava and Virtuagym as needing special processes, and its integrations table also marks Garmin and Samsung as Required, though its homepage says Garmin data flows through Terra's own partner integration. Ask both vendors about your exact provider list."
      },
      {
        "q": "Which should I pick for a mobile app versus a backend service?",
        "a": "Both ship mobile SDKs for Apple Health and Health Connect, so either works for a mobile app; ROOK also offers a ready-made ROOK App for programs without their own. For a backend-first product that wants data pushed into its own database, queue or cloud storage, Terra's destinations do more of the plumbing. Price the two at your expected user count before choosing."
      },
      {
        "q": "How should developers evaluate ROOK's health data API?",
        "a": "Check four things on ROOK's own pages, as we read them on October 17, 2026. Price at your active-user count: Core $399 a month up to 750, Core+ $999 up to 5,000, Business $1,999 up to 15,000, on a standard 12-month contract. Coverage: 400+ sources in its docs against 72 on its integrations page. Credentials: Dexcom, Samsung Health, Strava and WHOOP need your own developer accounts. Normalization: data arrives in ROOK's own model with a 0 to 100 health score, and the pages we read describe no webhook signature scheme."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/integrate/terra-api",
        "label": "Integrate Terra"
      },
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Aggregator pricing compared"
      },
      {
        "href": "/compare/rook-vs-spike",
        "label": "Rook vs Spike"
      },
      {
        "href": "/alternatives/rook-alternatives",
        "label": "ROOK alternatives"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Comparing health-data aggregators for your build? Get our developer newsletter for the pricing and credential changes on Terra, ROOK and the rest, as we find them."
    },
    "sources": [
      {
        "url": "https://tryrook.io/rookconnect/medical-device-api/",
        "checked": "2026-10-17",
        "note": "Rook Medical Device API"
      },
      {
        "url": "https://tryrook.io/rookconnect/lab-data-api/",
        "checked": "2026-10-17",
        "note": "Rook Lab Data API"
      },
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-sources",
        "checked": "2026-10-17",
        "note": "Terra data source count and providers with special setup"
      },
      {
        "url": "https://docs.tryrook.io/data-sources/",
        "checked": "2026-10-17",
        "note": "Rook data sources and own developer accounts"
      },
      {
        "url": "https://tryrook.io/wearable-api-sdk/integrations/",
        "checked": "2026-10-17",
        "note": "Rook source catalog"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/getting-started",
        "checked": "2026-10-17",
        "note": "Terra mobile-only sources, signed webhooks, rate limits"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-destinations/webhooks",
        "checked": "2026-10-17",
        "note": "Terra webhook signing, retries and timeout"
      },
      {
        "url": "https://tryrook.io/rookconnect/wearable-api/",
        "checked": "2026-10-17",
        "note": "Rook wearable API, SDKs and delivery"
      },
      {
        "url": "https://tryterra.co/products/lab-testing",
        "checked": "2026-10-17",
        "note": "Terra lab testing geography and collection methods"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-27",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://tryrook.io/pricing/",
        "checked": "2026-10-17",
        "note": "Rook plans, add-ons and contract terms"
      },
      {
        "url": "https://docs.tryrook.io/",
        "checked": "2026-10-17",
        "note": "Rook health score"
      },
      {
        "url": "https://docs.tryterra.co/reference/health-and-fitness-api/supported-integrations",
        "checked": "2026-10-17",
        "note": "Terra integration credential requirements"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/pricing",
        "checked": "2026-10-17",
        "note": "Terra credit tiers"
      },
      {
        "url": "https://tryrook.io/rookconnect/ehr-emr-api/",
        "checked": "2026-10-17",
        "note": "Rook EHR/EMR API"
      }
    ]
  },
  {
    "slug": "terra-vs-spike",
    "primaryQuery": "terra vs spike health",
    "h1": "Terra vs Spike Health: Which Aggregator for Your App?",
    "metaTitle": "Terra vs Spike API: $399 a Month vs a $450 Sandbox",
    "metaDescription": "Terra vs Spike API as of October 2026: Terra from $399 a month billed annually plus credits, Spike's Sandbox from $450; wearables and labs vs IoT, lab OCR.",
    "updated": "2026-10-17",
    "answer": "Terra and Spike both sell one API across many wearables, so the split is what else you need and how you learn the price. Pick Terra for a bill you can calculate from its pricing page (from $399 a month billed annually plus credits per connected source), lab ordering in the US and UK, and full payloads pushed into webhooks, databases or queues. Pick Spike if you also want medical IoT readings, lab-report OCR with LOINC codes, food-photo nutrition and an MCP server for LLM apps, with a dedicated implementation engineer from its Sandbox plan, which starts from $450 a month. Spike's site also carries a banner announcing that Raintree Systems acquires Spike Technologies, so ask about roadmap and contract terms; all of this is as of October 17, 2026.",
    "body": "Already chose Terra and need to wire it up? The [Terra API integration guide](/integrate/terra-api) covers authentication, the widget session and webhook delivery. Still choosing the best aggregator for wearable and sensor integrations across the whole field? The [wearable health data aggregator APIs comparison](/fitness-apis/health-data-aggregator-apis) sets Terra and Spike beside six others.\n\n## Terra vs Spike Health, for developers\n\nBoth Terra and Spike are **health-data aggregators**: one integration, a normalized feed from many sources, instead of a separate OAuth flow and schema per wearable. The difference for a build is what else each one reaches and how you learn the price. Everything here is from the vendors' own pages as we read them on October 17, 2026. An earlier version of this page said neither vendor published pricing, that Spike's own pages disagreed on its device count, and that Spike sold a generative-AI interpretation SDK and a low-code data-pipeline product. Both now publish prices, Spike's current pages agree on 500+ devices (the 200+ figure on its homepage counts customers), and we did not find the SDK or the pipeline product on the pages we read, so those claims are gone.\n\n## At a glance\n\n| Dimension | Terra | Spike |\n|---|---|---|\n| Coverage claim | 500+ providers; its docs say the Unified API \"supports over 150+ Data Sources\" | \"Access 40+ providers and 500+ devices via single SDK\" |\n| Beyond wearables | Lab test ordering (US and UK), DNA tests, lab-report parsing, streaming, planned workouts | Medical IoT devices, lab-report OCR with LOINC codes, food-photo nutrition, EMR and EHR data, voice agents for clinics |\n| AI | An MCP server (its AI Interface) | Spike MCP |\n| Delivery | Full payloads to webhooks, databases, queues or cloud storage | Webhook notifications of what changed, then query the API |\n| Webhook signature | HMAC-SHA256 in a terra-signature header | HMAC-SHA256 in an X-Body-Signature header |\n| Entry price | $399 a month billed annually ($499 monthly), 100,000 credits | Sandbox from $450 a month |\n| Onboarding | Self-serve sign-up; 24/7 engineering support on Enterprise | \"Every organization gets a dedicated implementation engineer from the sandbox level\" |\n| Ownership | No change announced on the pages we read | Its site announces \"Raintree Systems Acquires Spike Technologies\" |\n\n## Where Terra wins\n\n- **A price you can calculate.** Terra's pricing page publishes the subscription, the credit allowance and the rates: \"An active authentication is one connected data source for one end user, and costs 200 Unified API credits per month\", the first 400 events per source are free, and extra credits start at $0.005. Spike publishes a starting price and calls its pricing \"Usage-driven, transparent, and flexible\", but does not itemize how the bill grows.\n- **Full payloads, wherever you want them.** Terra sends normalized data to webhooks or straight into \"SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore\". Spike's webhook event lists the metrics and time range that changed, and you fetch the records with the API.\n- **Lab tests ordered for your users.** Terra's homepage offers blood tests \"through home kits, mobile phlebotomy, or lab walk-ins\", and its lab page says \"Nationwide US, plus the UK\". Spike's lab product parses reports users already have.\n\n## Where Spike wins\n\n- **Reach past the wrist.** Spike's homepage pitches \"normalized, ingestion-ready data from wearables, EMRs, lab tests, IoT devices, and more\", including medical IoT such as glucose monitors, ECGs and blood pressure cuffs, and its integrations page lists CGMs like Dexcom and Freestyle Libre.\n- **Lab reports and food photos.** The Lab Reports API takes \"PDFs, JPEGs, or PNG files up to 10MB\" through OCR and assigns LOINC codes \"making lab test data from any language standardized\". Its Nutrition AI turns \"any food image into complete nutritional data\".\n- **A person on your build.** \"Every organization gets a dedicated implementation engineer from the sandbox level to help with setup and optimization\", which is unusual in a category where onboarding is normally the docs.\n\n**The trade-off.** A banner on Spike's integrations and blog pages reads \"Raintree Systems Acquires Spike Technologies\". We found no further detail on Spike's own pages, so ask about roadmap and contract continuity before you sign.\n\n## Webhooks compared\n\nBoth sign every event with HMAC-SHA256. Terra's header is terra-signature, computed over the timestamp and the raw body; Spike's is X-Body-Signature, computed over the raw request body with a shared key from its admin console. Terra retries a failed delivery \"with exponential backoff for several hours\" and commits to no count, saying \"The exact number and timing of retries may change without notice\"; Spike will \"retry the request up to 10 times with exponential backoff\", then discard the event. Spike's payload is a notification (user, metrics, provider and time range), so plan an API call per event.\n\n## What we could not verify\n\n- How Spike's price grows past the Sandbox starting price.\n- Whether Spike needs your own developer credentials for any provider; its provider docs describe a user consent redirect and say nothing either way.\n- The terms and timing of the Raintree acquisition.\n\n## Which should you pick?\n\n- **Consumer fitness or wellness app reacting to new sleep, workout or recovery data:** lean Terra for the calculable bill and the push-to-destination delivery.\n- **Clinical or medical-adjacent build with lab reports, medical IoT or EMR data, or food logging from photos:** lean Spike, after confirming each capability and the post-acquisition terms.\n- **Lab tests ordered for users in the US or UK:** Terra.\n\nIf you are also weighing Terra against a labs-first option, see [Terra vs Vital (Junction)](/fitness-apis/terra-vs-vital), and for the whole field, [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis).\n\n## Honest close\n\nTerra and Spike are both single-integration aggregators, so neither saves you from the core trade: you pay to remove per-provider integration work. The split that decides it is reach and visibility: Terra publishes a price you can model and pushes full payloads, Spike reaches further into clinical data and puts an engineer on your build, at a price you learn on a call. Re-check both live pricing pages before you build; the [Terra API integration guide](/integrate/terra-api) covers the wearable side.",
    "faqs": [
      {
        "q": "What's the core difference between Terra and Spike Health?",
        "a": "Reach and pricing visibility. Both are single-integration aggregators, but as of October 17, 2026, Terra publishes a credit-based price sheet, orders lab tests in the US and UK, and pushes full payloads to webhooks, databases and queues. Spike reaches into medical IoT, lab-report OCR, food-photo nutrition and EMR data, assigns a dedicated implementation engineer, and publishes only a starting price for its Sandbox plan."
      },
      {
        "q": "How much do Terra and Spike cost?",
        "a": "As of October 17, 2026, Terra starts at $399 a month billed annually or $499 monthly with 100,000 credits, then charges 200 credits a month per connected data source and credits for events past a free allowance, from $0.005 each. Spike's Sandbox plan starts from $450 a month and its Enterprise plan is custom; it describes pricing as usage-driven but does not itemize how it grows. Get a quote at your expected volume."
      },
      {
        "q": "Does Spike really support 500+ devices?",
        "a": "That is Spike's own figure, and its current pages agree on it: the pricing page says 40+ providers and 500+ devices, and the homepage says 500+ wearables and IoT sensors. The 200+ on its homepage counts customers, not devices, which an earlier version of this page misread. Treat both vendors' counts as marketing and check your users' devices on the live integrations lists."
      },
      {
        "q": "Which is better for a clinical or medical app?",
        "a": "Lean Spike if the clinical data is medical IoT, lab reports or EMR records: its pages describe all three, plus LOINC coding of lab results. Lean Terra if the clinical piece is ordering lab tests for users in the US or UK, which its lab product does through home kits, mobile phlebotomy or lab walk-ins. As of October 17, 2026; confirm production readiness and, for Spike, the terms after its announced acquisition."
      },
      {
        "q": "Do Terra and Spike offer webhooks?",
        "a": "Yes, both signed with HMAC-SHA256. Terra pushes full normalized payloads with a terra-signature header and retries failed deliveries up to 10 times. Spike sends a notification with the user, metrics, provider and time range in an X-Body-Signature-signed request, retries up to 10 times, then discards the event, and you fetch the records with its API."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/fitness-apis/terra-vs-vital",
        "label": "Terra vs Vital (Junction)"
      },
      {
        "href": "/compare/rook-vs-spike",
        "label": "Rook vs Spike"
      },
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Aggregator pricing compared"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Aggregator pricing, coverage and owners change quietly. Get a heads-up when Terra, Spike and the other health-data APIs change terms, before your integration does."
    },
    "sources": [
      {
        "url": "https://www.spikeapi.com/pricing",
        "checked": "2026-10-17",
        "note": "Spike Sandbox and Enterprise plans"
      },
      {
        "url": "https://www.spikeapi.com/",
        "checked": "2026-10-17",
        "note": "Spike scope, implementation engineer and customers"
      },
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-sources",
        "checked": "2026-10-17",
        "note": "Terra data source count and providers with special setup"
      },
      {
        "url": "https://tryterra.co/products/lab-testing",
        "checked": "2026-10-17",
        "note": "Terra lab testing geography and collection methods"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-27",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://www.spikeapi.com/lab-reports",
        "checked": "2026-10-17",
        "note": "Spike Lab Reports API"
      },
      {
        "url": "https://www.spikeapi.com/mcp-health-ai-integration",
        "checked": "2026-10-17",
        "note": "Spike MCP"
      },
      {
        "url": "https://docs.spikeapi.com/api-docs/webhooks",
        "checked": "2026-10-17",
        "note": "Spike webhook signing and retries"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-destinations/webhooks",
        "checked": "2026-10-17",
        "note": "Terra webhook signing, retries and timeout"
      },
      {
        "url": "https://docs.tryterra.co/introduction/account-setup-and-api-keys",
        "checked": "2026-10-17",
        "note": "Terra API key handling"
      },
      {
        "url": "https://www.spikeapi.com/integrations",
        "checked": "2026-10-17",
        "note": "Spike integrations and acquisition banner"
      },
      {
        "url": "https://www.spikeapi.com/blog",
        "checked": "2026-10-17",
        "note": "Spike acquisition banner"
      },
      {
        "url": "https://docs.spikeapi.com/api-docs/provider_integration",
        "checked": "2026-10-17",
        "note": "Spike provider consent flow"
      }
    ]
  },
  {
    "slug": "nutritionix-vs-edamam",
    "primaryQuery": "nutritionix vs edamam",
    "h1": "Nutritionix vs Edamam: Which Nutrition API to Use?",
    "metaTitle": "Nutritionix vs Edamam: Nutrition APIs Compared",
    "metaDescription": "Nutritionix vs Edamam for developers: compare food-data coverage, natural-language meal logging, and pricing models to pick the right nutrition API.",
    "updated": "2026-07-23",
    "answer": "Pick Nutritionix if your app centers on US branded and restaurant/chain foods with plain-text meal logging, and pick Edamam if you need recipe and ingredient-list nutrition analysis backed by a generic-food database with a self-serve free plan. Both parse free text into nutrients, but Nutritionix leans into food-service coverage while Edamam splits into three separate APIs, each with its own credentials. The biggest developer difference is access: Nutritionix is freemium-to-paid with enterprise via contact-sales, while Edamam is self-serve tiered freemium signed up per API. Verify current pricing and coverage on each vendor's pages before committing.",
    "body": "## How to compare Nutritionix and Edamam\n\nThree things decide this head-to-head. Weigh them in this order:\n\n- **Data-coverage fit.** Nutritionix is strongest on US branded/packaged products and restaurant/chain menu items; Edamam pairs generic foods and packaged/UPC items (Food Database API) with a large recipe corpus (Recipe Search API). Match the API to the foods your users will actually log or search.\n- **NLP logging strength.** Both parse free text, but for different jobs: Nutritionix's natural-language endpoint is tuned toward meal logging of restaurant and food-service items (\"1 cup rice, 2 eggs\"), while Edamam's Nutrition Analysis API is built to parse ingredient lists and full recipes into detailed nutrition. Pick the one whose parsing matches your input.\n- **Access and credentials.** Nutritionix is freemium with paid tiers gated through a Syndigo sales contact; Edamam is self-serve tiered freemium, but its three APIs use separate app_id/app_key pairs that are not interchangeable — a real integration gotcha to plan for.\n\nAccess models and coverage claims on this page are factual integration constraints, not a knock on either product.\n\n## Nutritionix API vs Edamam API at a glance\n\n| Dimension | Nutritionix API | Edamam API |\n|---|---|---|\n| Core data | US branded/packaged CPG products and restaurant/chain menu items; large item database (count is a vendor claim, verify) | Generic foods plus packaged/UPC foods (Food Database API); recipe data (Recipe Search API). Item and recipe counts are vendor/third-party claims, verify |\n| NLP food logging | Natural-language endpoint (`/v2/natural/nutrients`) turns plain-text meals into nutrients; `/v2/search/instant` powers autocomplete search. Tuned toward restaurant/food-service items | Nutrition Analysis API parses free-text ingredient lists and recipes into detailed nutrition; strong for user-submitted recipes |\n| API structure | Single API surface (search, item lookup, natural-language endpoints) | Three separate APIs (Food Database, Nutrition Analysis, Recipe Search), each with its own app_id/app_key pair — credentials do not carry across |\n| Access model | Freemium to paid; free/attribution tier exists, higher tiers quota-based and sales-gated (Syndigo). Now under Syndigo | Self-serve tiered freemium; a free application plan plus paid monthly tiers, selected per API at registration |\n| Cost model | Freemium then quota-based paid; enterprise via contact-sales. No confirmed public tier prices — verify | Tiered freemium, per-API. No confirmed public tier prices — verify |\n| Licensing | Free tier requires attribution to Nutritionix (verify current terms) | Plan and attribution terms vary by tier and API — verify on the official pricing page |\n\nNeither vendor's specific tier prices are printed here — third-party figures conflict badly. See [nutrition API pricing](/pricing/nutrition-api-pricing) and confirm current numbers on each vendor's own page.\n\n## Where Nutritionix pulls ahead\n\nNutritionix's edge is US food-service depth plus meal-logging ergonomics. Its coverage is strongest on US branded/packaged CPG products and restaurant/chain menu items, which is exactly what a calorie-tracking or diet app needs when users eat out or log packaged goods. The natural-language layer is the other draw: the `/v2/natural/nutrients` endpoint turns a plain-text meal like \"1 cup rice, 2 eggs\" into a full nutrient breakdown, and `/v2/search/instant` gives you an autocomplete food-search UI out of the box — both tuned toward the restaurant and food-service items people actually type. The trade-off that decides it against Edamam: pricing is freemium-to-paid with higher tiers gated behind a Syndigo sales contact rather than a fully self-serve checkout, so you cannot always read a public price and swipe a card to scale. The free tier also requires attribution to Nutritionix, so verify current terms before you rely on it.\n\n## Where Edamam pulls ahead\n\nEdamam's edge is recipe and ingredient-list analysis with a self-serve on-ramp. Its Nutrition Analysis API is built to parse free-text ingredient lists and full recipes into detailed nutrition, which fits a recipe app or meal-planner far better than logging single restaurant items. The Food Database API adds generic foods alongside packaged/UPC items, and the whole thing starts on a self-serve free application plan you can register for without a sales call. The catch to design around: Edamam is really three separate APIs — Food Database, Nutrition Analysis, and Recipe Search — and each has its own app_id/app_key pair that does not carry across the others, so a build that touches food lookup and recipe search means managing multiple credentials. If recipe discovery is your real need, also weigh [Edamam vs Spoonacular](/compare/edamam-vs-spoonacular) before committing.\n\n## Which should you pick?\n\nMatch the API to your use-case rather than hunting for a single winner:\n\n- **If your product is a calorie tracker or diet app centered on US restaurant, chain, and packaged foods** with plain-text meal logging → pick Nutritionix, and plan for sales-gated scaling and free-tier attribution.\n- **If your product analyzes recipes or user-submitted ingredient lists** and you want a generic-food database with a self-serve free start → pick Edamam, and design for its per-API separate-credentials model.\n- **If you need barcode/UPC packaged-food coverage**, both reach packaged items — weigh Nutritionix's US branded/restaurant depth against Edamam's generic-plus-UPC Food Database.\n- **If you are still scoping the category** or want to see other nutrition data sources, read the [nutrition APIs](/fitness-apis/nutrition-apis) overview. When you are ready to build on Nutritionix, follow the [Nutritionix integration guide](/integrate/nutritionix-api).\n\n## Watch the fine print\n\nCoverage counts, tier prices, and free-plan terms in the nutrition-API category shift often, and official pricing pages sometimes block automated checks. Everything volatile above — every food/UPC/recipe count, both vendors' tier prices, and current attribution terms — is flagged \"as of 2026, verify.\" Confirm the live endpoints, credential rules, and commercial terms in each provider's primary developer docs before you build.",
    "faqs": [
      {
        "q": "What is the main difference between Nutritionix and Edamam?",
        "a": "Nutritionix is strongest on US branded/packaged and restaurant/chain foods with natural-language meal logging. Edamam splits into three APIs (Food Database, Nutrition Analysis, Recipe Search) and is built for recipe and ingredient-list analysis backed by a generic-food database. Verify coverage claims as of 2026."
      },
      {
        "q": "Which has better natural-language food logging?",
        "a": "Both parse free text, but for different jobs. Nutritionix's natural-language endpoint is tuned toward logging restaurant and food-service meals like '1 cup rice, 2 eggs'. Edamam's Nutrition Analysis API is built to parse ingredient lists and full recipes into detailed nutrition. Match the parser to your input."
      },
      {
        "q": "How do Nutritionix and Edamam pricing models compare?",
        "a": "Nutritionix is freemium to paid, with a free/attribution tier and higher quota-based tiers gated through a Syndigo sales contact. Edamam is self-serve tiered freemium with a free application plan plus paid monthly tiers chosen per API. Neither vendor's specific tier prices are confirmed here; third-party figures conflict, so verify official pricing."
      },
      {
        "q": "Do Edamam's three APIs share one API key?",
        "a": "No. Edamam's Food Database, Nutrition Analysis, and Recipe Search APIs each use their own app_id/app_key pair, and credentials do not carry across the three. A build that touches food lookup and recipe search means managing multiple credential sets. Verify the current registration flow in Edamam's docs."
      },
      {
        "q": "Which is better for barcode and packaged-food coverage?",
        "a": "Both reach packaged/UPC items. Nutritionix is strongest on US branded and restaurant/chain foods, while Edamam's Food Database API pairs generic foods with packaged/UPC items. Choose based on whether US food-service depth or generic-plus-UPC breadth matters more for your users. Verify current coverage as of 2026."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/nutrition-apis",
        "label": "Best nutrition APIs"
      },
      {
        "href": "/integrate/nutritionix-api",
        "label": "Integrate the Nutritionix API"
      },
      {
        "href": "/pricing/nutrition-api-pricing",
        "label": "Nutrition API pricing"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness and nutrition API every week — coverage, pricing models, and integration gotchas included — so you can pick the right one before writing a line of code."
    }
  },
  {
    "slug": "edamam-vs-spoonacular",
    "primaryQuery": "edamam vs spoonacular",
    "h1": "Edamam vs Spoonacular: Which Nutrition API?",
    "metaTitle": "Edamam vs Spoonacular: Which Nutrition API?",
    "metaDescription": "Edamam is nutrition-first with three tiered APIs; Spoonacular is all-in-one recipes/meal planning on a points model. Which fits your app? Verify pricing.",
    "updated": "2026-07-23",
    "answer": "Pick Edamam when precise nutrition analysis of arbitrary ingredient lists and recipes is your core need, and pick Spoonacular when you want an all-in-one API for recipe discovery, meal-plan generation, grocery products, and nutrition behind one key. The biggest developer difference is shape and cost model: Edamam is three separate nutrition APIs, each with its own credentials, on tiered freemium plans; Spoonacular is a single API metered by a daily points budget that every call draws down. Tier prices, point costs, and coverage counts shift often, so verify current figures on each vendor's own pages.",
    "body": "## How to compare Edamam and Spoonacular\n\nThree things decide this head-to-head. Weigh them in this order:\n\n- **Data focus.** Edamam is built around nutrition: a Food Database API, a Nutrition Analysis API that parses free-text ingredient lists and recipes into detailed nutrient breakdowns, and a Recipe Search API. Spoonacular is built around recipes and meal planning: it markets recipe search, meal-plan generation, grocery product and menu-item data, and nutrition, all in one API. Match the product to what your app is actually built around.\n- **Integration shape.** Edamam splits into three APIs, each with its own `app_id` and `app_key` pair — credentials are not interchangeable across the three, which is a real integration gotcha to plan for. Spoonacular is a single API and key covering recipe, product, and nutrition calls.\n- **Cost model.** Edamam uses tiered freemium plans selected per-API at registration. Spoonacular uses a freemium points model: each plan grants a daily quota of points and each call spends points; the free plan returns `HTTP 402` once the daily quota is exhausted. These are two different mental models for budgeting, covered below.\n\nAccess and pricing items on this page are integration constraints, not a knock on either product.\n\n## Edamam vs Spoonacular at a glance\n\n| Dimension | Edamam | Spoonacular |\n|---|---|---|\n| Data focus | Nutrition-first: Food Database, Nutrition Analysis, Recipe Search | Recipe-first, all-in-one: recipes, meal planning, grocery products, menu items, nutrition |\n| Core strength | Raw-ingredient and recipe text parsed into detailed nutrition | Recipe discovery plus meal-plan generation from one key |\n| API structure | Three separate APIs, each with its own app_id/app_key (not interchangeable) | Single API and key across all endpoints |\n| Coverage claims | Generic foods, packaged/UPC foods, recipe data (vendor counts, as of 2026, verify) | Large recipe corpus plus products and menu items (vendor counts, as of 2026, verify) |\n| Cost model | Tiered freemium — free application plan plus paid monthly tiers, selected per-API | Freemium points — daily points quota; each call spends points (documented ~1 point/request + ~0.01/result, endpoint-dependent, verify) |\n| Quota-exhausted behavior | Tier/quota limits per plan (verify current limits) | Free plan returns HTTP 402 when the daily point quota runs out |\n| Licensing | Verify attribution and commercial-use terms per API | Verify attribution and commercial-use terms |\n\nExact tier prices, point costs, daily quotas, and food or recipe counts are not printed here — third-party figures conflict badly. Confirm current numbers on each vendor's own pricing pages, and see [nutrition API pricing](/pricing/nutrition-api-pricing) for how these models compare across the category.\n\n## Where Edamam pulls ahead\n\nEdamam's edge is precise nutrition analysis of text you did not pre-structure. Its Nutrition Analysis API takes a free-text ingredient list or a full recipe and returns a detailed nutrient breakdown, which is exactly what you want when users submit their own recipes or paste an ingredient list and you need calories and macros back. The Food Database API adds generic foods plus packaged and UPC items, so barcode and generic-food lookups sit alongside the analysis. The tiered freemium model is easy to reason about: you pick a plan per API and know your ceiling. The trade-off that decides it against Spoonacular: those three APIs are genuinely separate products with separate credentials, so a build that needs food lookup, nutrition analysis, and recipe search is managing three `app_id`/`app_key` pairs and three plans, not one. If your core need is meal-plan generation or broad recipe discovery, Edamam is not the natural center of that build.\n\n## Where Spoonacular pulls ahead\n\nSpoonacular's edge is breadth behind a single key. One API covers recipe search, meal-plan generation, grocery products, menu items, and nutrition, so a build that needs \"find recipes, plan a week, and show nutrition\" does not stitch together multiple products. The meal-planning and semantic recipe search are the clearest differentiators versus a pure nutrition database. The points model is the thing to understand before you commit: rather than a per-endpoint price list, each plan grants a daily points budget and every call spends points — documented as roughly 1 point per request plus about 0.01 point per result returned, endpoint-dependent (verify current values). On the free plan, once the daily budget is spent the API returns `HTTP 402` until it resets, so you size your plan by expected daily points, not by counting calls. The trade-off: if your only real need is accurate nutrition from arbitrary ingredient text, the all-in-one surface and points accounting are more than the job requires.\n\n## Which should you pick?\n\nMatch the API to your use-case rather than hunting for a single winner:\n\n- **If your core need is precise nutrition analysis of arbitrary ingredient lists or user-submitted recipes** → pick Edamam, and plan for its three-APIs, three-credentials structure.\n- **If you need recipe discovery plus meal-plan generation plus grocery/product data behind one key** → pick Spoonacular, and budget by daily points rather than per-call.\n- **If you want a self-serve tiered start with a free plan and nutrition as the anchor** → Edamam's per-API freemium tiers fit that shape.\n- **If a points-budget mental model and an all-in-one food platform suit your team** → Spoonacular consolidates recipe, product, and nutrition into a single integration.\n\nFor the wider landscape, see the [nutrition APIs overview](/fitness-apis/nutrition-apis), and if you are also weighing branded/restaurant and barcode data, compare [Nutritionix vs Edamam](/compare/nutritionix-vs-edamam).\n\n## Watch the fine print\n\nTier prices, point costs per endpoint, daily point quotas, and food or recipe counts in this category shift often and third-party figures disagree. Everything volatile above — every price, the exact points-per-call values, the daily quotas, and all coverage counts — is flagged \"as of 2026, verify.\" The points model and the `HTTP 402` quota-exhausted behavior are documented, but confirm the current values, plan limits, and licensing terms in each provider's primary developer docs before you build.",
    "faqs": [
      {
        "q": "What is the main difference between Edamam and Spoonacular?",
        "a": "Data focus and structure. Edamam is nutrition-first: a Food Database API, a Nutrition Analysis API that parses free-text ingredients and recipes into detailed nutrients, and a Recipe Search API, offered as three separate products each with its own app_id and app_key. Spoonacular is recipe-first and all-in-one: recipe search, meal-plan generation, grocery products, menu items, and nutrition behind a single API and key. Pick Edamam for precise nutrition analysis, Spoonacular for recipe and meal-planning breadth."
      },
      {
        "q": "How does Spoonacular's pricing model work?",
        "a": "Spoonacular uses a freemium points model rather than a per-call price list. Each plan grants a daily quota of points, and every request spends points - documented as roughly 1 point per request plus about 0.01 point per result returned, endpoint-dependent. On the free plan, once the daily points quota is exhausted the API returns HTTP 402 until it resets, and paid tiers raise the daily quota. Do not treat any dollar figure as fixed; as of 2026, verify current point costs and tier prices on Spoonacular's official pricing page."
      },
      {
        "q": "How is Edamam's pricing structured?",
        "a": "Edamam uses tiered freemium plans selected per API at registration - a free application plan plus paid monthly tiers. Because the Food Database, Nutrition Analysis, and Recipe Search APIs are separate products with separate credentials, you choose a plan for each one you use rather than a single combined plan. Third-party dollar figures for Edamam tiers conflict badly, so as of 2026, verify current tier prices and limits on Edamam's official pricing page."
      },
      {
        "q": "Can I use one set of credentials across Edamam's APIs?",
        "a": "No. Edamam's Food Database API, Nutrition Analysis API, and Recipe Search API each have their own app_id and app_key pair, and the credentials are not interchangeable across the three. A build that needs food lookup, nutrition analysis, and recipe search manages three credential pairs and three plans. This is a real integration detail to plan for; verify current terms in Edamam's developer docs."
      },
      {
        "q": "Which should I choose for a recipe and meal-planning app?",
        "a": "For recipe discovery plus meal-plan generation plus grocery and product data behind one key, Spoonacular is the more natural fit, since it consolidates those into a single all-in-one API. If your core need is instead precise nutrition analysis of arbitrary ingredient lists or user-submitted recipes, Edamam's Nutrition Analysis API is the stronger anchor. Our nutrition APIs overview weighs the wider category."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/nutrition-apis",
        "label": "Best nutrition APIs"
      },
      {
        "href": "/pricing/nutrition-api-pricing",
        "label": "Nutrition API pricing"
      },
      {
        "href": "/compare/nutritionix-vs-edamam",
        "label": "Nutritionix vs Edamam"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Nutrition and recipe API pricing and points rules shifted across 2026 - subscribe for plain-English updates when Edamam or Spoonacular changes a tier or quota."
    }
  },
  {
    "slug": "exercisedb-vs-wger",
    "primaryQuery": "exercisedb vs wger",
    "h1": "ExerciseDB vs wger: Which Exercise API for Your App?",
    "metaTitle": "ExerciseDB vs wger: Hosted GIF API or Free AGPL Self-Host?",
    "metaDescription": "ExerciseDB: hosted, 1,500 exercises with free GIFs, MP4 video on RapidAPI. wger: self-hosted AGPL, no fee, per-entry image licenses (CC-BY-SA 4 default).",
    "updated": "2026-10-22",
    "answer": "Pick ExerciseDB when you want a hosted API with demonstration media and are willing to rent it: AscendAPI, its current publisher, serves 1,500 exercises with GIFs free and with no key, and ExerciseDB V2's MP4 videos for 11,000+ exercises on RapidAPI plans, free for a watermarked 200-exercise trial. Pick wger when you want to own the stack with no per-call fee and can run a Django application under AGPL-3.0-or-later, with exercise data licensed Creative Commons per entry. The deciding difference is the delivery model, rented API against self-hosted software, and the license that comes with each. All of this was checked on October 22, 2026.",
    "body": "## First, which ExerciseDB?\n\nThe exercisedb.dev home page now reads \"Previously ExerciseDB\" above the name AscendAPI, and AscendAPI's documentation names the `ExerciseDB/exercisedb-api` GitHub repository as its own. It sells two exercise products: **ExerciseDB V1**, free with no key at `oss.exercisedb.dev` (1,500 exercises with 180p GIFs) with a paid RapidAPI tier for higher resolutions, and **ExerciseDB V2**, on RapidAPI only, with an MP4 video per exercise. An older ExerciseDB listing on RapidAPI under the publisher justin-WFnsXH_t6 also exists; we could not read it on October 22, 2026, or establish whether it is the same product. On this page, \"ExerciseDB\" means AscendAPI's products.\n\nNone of them is self-hostable. A git clone of [the exercisedb-api repository](https://github.com/ExerciseDB/exercisedb-api) on October 22, 2026 found a README and an AGPL-3.0 LICENSE and no code, so in production ExerciseDB is an API you call under AscendAPI's terms of use.\n\n## How to compare ExerciseDB and wger\n\nThree factors decide this head-to-head, in this order:\n\n- **Delivery model.** ExerciseDB is a hosted API: a key (or none, for V1 free) and you are calling it in minutes. wger is software you deploy, with a REST API you run, or a public instance at wger.de you can read.\n- **Media against ownership.** ExerciseDB's draw is media: GIFs on V1, MP4 video on V2. wger's media is community-contributed still images plus whatever videos you upload, but you own the whole stack.\n- **License fit.** Calling a hosted API under its terms is a different situation from deploying AGPL code; wger also splits its licensing between code and data.\n\n## ExerciseDB vs wger at a glance\n\n| Dimension | ExerciseDB (AscendAPI) | wger |\n|---|---|---|\n| Data | V1: 1,500 exercises free, \"over 2,000\" in total; V2: 11,000+ (AscendAPI's figures) | Community exercise database plus routines, nutrition (Open Food Facts) and body weight; live count not readable from our environment |\n| Media | V1: GIFs, 180p free, up to 1080p paid; V2: an MP4 per exercise plus images, watermarked on the free plan | Still images (animation rejected); video files you upload (mp4, mov, webm, ogv, ogg) |\n| Hosting / access | Hosted: V1 free tier with no key, everything else through RapidAPI | Self-host with Docker, or read the public endpoints on wger.de |\n| Cost | Free tiers (V1 keyless; V2 Basic: 2,000 requests a month, 200 exercises); paid plans on RapidAPI, prices not read | No license or per-call fee; you pay for hosting and operations |\n| Rate limits | Free plans: 1,000 requests per hour per key; paid: \"no strict rate limit\" | Whatever you configure on your own instance |\n| Licensing | AscendAPI's terms of use (not readable from our environment); the repository's AGPL-3.0 file covers no code | Code AGPL-3.0-or-later; exercise data Creative Commons per entry; docs CC-BY-SA-4.0 |\n\nFor what each plan costs, see [exercise database API pricing](/pricing/exercise-database-api-pricing).\n\n## Where ExerciseDB pulls ahead\n\nTime to first call and media. V1's free tier answers without a key, and V2 hands you an MP4 demonstration, multi-resolution images, `overview`, `exerciseTips`, `variations` and `relatedExerciseIds` for each exercise, which wger has no equivalent for. AscendAPI also states a much larger catalog. The trade: you rent the data. Paid prices sit on RapidAPI listings we could not read, the free tiers come with terms we could not read either, and your app depends on someone else's service. For [exercise APIs with video](/fitness-apis/exercise-video-apis), V2 is the hosted option.\n\n## Where wger pulls ahead\n\nOwnership and no usage fees. wger's README calls it \"a free workout and fitness manager\" with a \"REST API for third-party integrations or automations\", and self-hosting \"is basically just a `docker compose up -d` away\". In its code the exercise endpoints are commented \"Everybody can read\", and every exercise, image and video carries its own license, author and source fields, so attribution travels with the data. The trade-offs: you operate a whole application, its media is lighter than ExerciseDB's, and the licensing needs attention. The code is AGPL-3.0-or-later, the data is \"Creative Commons (see individual entries)\", and new image uploads default to CC-BY-SA 4.\n\n## The AGPL copyleft question (read before you self-host)\n\nThis applies to wger's code. AGPL-3.0 is strong copyleft with a network clause: if you modify AGPL-covered code and let users interact with it over a network, you must offer them the modified source under AGPL.\n\n- **Calling a hosted API over HTTP** does not by itself make your app a derivative work, which is why ExerciseDB, used as a hosted API, raises a terms-of-use question rather than a copyleft one.\n- **Self-hosting and modifying** wger is what can trigger the source-disclosure obligation for a closed-source service. Running it unmodified, or reading its public API, is a different situation.\n- **The data is separate.** wger's Creative Commons data brings attribution and, for CC-BY-SA entries, share-alike, whichever way you get it.\n\nThis is general guidance, not legal advice; have counsel review your setup.\n\n## Which should you pick?\n\n- **You want GIF or video demonstrations fast from a hosted key** → ExerciseDB. Prototype on V1's free tier or V2's Basic plan, then read the paid prices and terms on RapidAPI.\n- **You want full data ownership, no per-call fees and control of the stack**, and can comply with AGPL (code) plus Creative Commons (data) → wger. ExerciseDB offers no self-host path. If wger's AGPL code or share-alike data is the blocker, see the [wger alternatives](/alternatives/wger-alternatives).\n- **You want data you own with no license strings at all** → neither; free-exercise-db is public domain. See [ExerciseDB vs free-exercise-db](/compare/exercisedb-vs-free-exercise-db).\n\nThe whole category is compared in [exercise database APIs](/fitness-apis/exercise-database-apis), and setup on the hosted path is in the [ExerciseDB integration guide](/integrate/exercisedb-api).\n\n## Watch the fine print\n\nThis page was re-checked on October 22, 2026 against AscendAPI's documentation and home page, and against the wger and exercisedb-api repositories. AscendAPI's paid prices, its terms of use and the older RapidAPI listing could not be read, and wger.de's bot check kept us from counting its live catalog. Confirm the current terms and the license on the exact data you ship before you build.",
    "faqs": [
      {
        "q": "Are ExerciseDB and exercisedb.dev the same thing?",
        "a": "exercisedb.dev is where ExerciseDB now lives: its home page presents AscendAPI, previously ExerciseDB, which sells ExerciseDB V1 (free with no key at oss.exercisedb.dev, plus a paid RapidAPI tier) and ExerciseDB V2 (on RapidAPI). An older ExerciseDB listing on RapidAPI under the publisher justin-WFnsXH_t6 also exists, and as of October 22, 2026 we could not establish whether it is the same product. Neither is self-hostable."
      },
      {
        "q": "Is wger really free?",
        "a": "The software and data carry no license or usage fee: wger's code is AGPL-3.0-or-later and its exercise data is Creative Commons, set per entry. But self-hosting still costs servers, bandwidth, uptime, and engineering time to run and update it, and the AGPL code carries copyleft obligations if you modify and deploy it. 'Free' here means no per-call fee, not zero total cost."
      },
      {
        "q": "Does the AGPL license affect my closed-source app?",
        "a": "It can if you self-host and modify the code. AGPL-3.0 has a network clause: modifying AGPL-covered code and letting users interact with it over a network can obligate you to release your modified source under AGPL. Merely calling a hosted API over HTTP does not by itself make your app a derivative work. A hosted or commercially licensed API path sidesteps this; self-hosting AGPL code warrants legal review. This is general guidance, not legal advice."
      },
      {
        "q": "Which has more exercises and media, ExerciseDB or wger?",
        "a": "ExerciseDB, by its publisher's figures: AscendAPI states 11,000+ exercises, 15,000+ videos and 20,000+ images for ExerciseDB V2 and 1,500 exercises with GIFs on its free V1 tier. wger's media is community-contributed still images plus videos you upload; we could not count its live catalog on wger.de on October 22, 2026, so we give no number for it."
      },
      {
        "q": "What does it actually take to run wger yourself?",
        "a": "More than a first deploy, though that is the easy part: wger's README says hosting your own instance is basically a docker compose up away, and wger.de is its public live system. Running it yourself means you own the hosting bill, upgrades, backups, and uptime for a service your app now depends on, plus whatever auth and rate limiting you put in front of the REST API. That ongoing ops load is the real trade for no per-call fee and full ownership of the data."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/compare/exercisedb-vs-free-exercise-db",
        "label": "ExerciseDB vs free-exercise-db"
      },
      {
        "href": "/alternatives/wger-alternatives",
        "label": "wger alternatives"
      },
      {
        "href": "/fitness-apis/free-fitness-apis",
        "label": "Free & open-source fitness APIs"
      },
      {
        "href": "/pricing/exercise-database-api-pricing",
        "label": "Exercise database API pricing"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "RapidAPI plans shift and AGPL terms are easy to miss - subscribe for plain-English updates when exercise API pricing and licensing change."
    },
    "sources": [
      {
        "url": "https://exercisedb.dev/",
        "checked": "2026-10-22",
        "note": "AscendAPI, previously ExerciseDB; free V1 (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v1/overview",
        "checked": "2026-10-22",
        "note": "V1 free and paid tiers (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v2/overview",
        "checked": "2026-10-22",
        "note": "V2 catalog, fields, MP4, watermark (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/quickstart/overview",
        "checked": "2026-10-22",
        "note": "free Basic plan (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/guides/ratelimiting",
        "checked": "2026-10-22",
        "note": "rate limits (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/llms.txt",
        "checked": "2026-10-22",
        "note": "GitHub repository link (snapshot)"
      },
      {
        "url": "https://github.com/ExerciseDB/exercisedb-api",
        "checked": "2026-10-22",
        "note": "README and AGPL LICENSE only (git clone)"
      },
      {
        "url": "https://github.com/wger-project/wger",
        "checked": "2026-10-22",
        "note": "README, licenses, API permissions, license fields, image and video models"
      }
    ]
  },
  {
    "slug": "exercisedb-vs-free-exercise-db",
    "primaryQuery": "exercisedb vs free-exercise-db",
    "h1": "ExerciseDB vs free-exercise-db: Hosted API or Open Dataset?",
    "metaTitle": "ExerciseDB vs free-exercise-db: Paid API or Free Dataset?",
    "metaDescription": "ExerciseDB is a hosted API (1,500 GIF exercises free, MP4 video on RapidAPI plans); free-exercise-db is 876 public-domain exercises as JSON with images.",
    "updated": "2026-10-22",
    "answer": "Pick ExerciseDB when you need animated GIFs or video from a hosted API; pick free-exercise-db when you want exercise data you own outright, with no key, no fee and no license obligations. ExerciseDB, now sold by AscendAPI, serves 1,500 exercises with GIFs free and without a key, and its V2 adds an MP4 video per exercise on RapidAPI plans, free for a watermarked 200-exercise trial. free-exercise-db is a public-domain (Unlicense) dataset on GitHub: 876 exercises and 1,746 JPEG images when we counted its combined JSON on October 22, 2026, served as static files rather than a live API.",
    "body": "## First, which ExerciseDB?\n\nThe exercisedb.dev home page now reads \"Previously ExerciseDB\" above the name AscendAPI, and AscendAPI's documentation, read on October 22, 2026, describes two products:\n\n- **ExerciseDB V1.** A free hosted tier of \"1,500 exercises with 180p GIFs. No authentication required\", at `oss.exercisedb.dev/api/v1/exercises`, plus a paid RapidAPI tier with 360p to 1080p images and GIFs. Records carry `bodyParts`, `targetMuscles`, `equipments` and a `gifUrl`.\n- **ExerciseDB V2.** On RapidAPI only, with an MP4 video per exercise and a stated 11,000+ exercises. Its free Basic plan gives 2,000 requests a month and 200 exercises, with watermarked media.\n\nAn older ExerciseDB listing on RapidAPI, published by justin-WFnsXH_t6 and covered by the [ExerciseDB integration guide](/integrate/exercisedb-api), also exists; we could not read it today or establish whether it is the same product. AscendAPI's paid prices and terms of use were out of reach too, and none of it is self-hostable: when we cloned [its GitHub repository](https://github.com/ExerciseDB/exercisedb-api) on October 22, 2026 it held only a README and an AGPL-3.0 LICENSE.\n\nSo ExerciseDB is an API you call, free to start, with the full catalogs on paid plans. free-exercise-db is the opposite model: files you download and own.\n\n## ExerciseDB vs free-exercise-db at a glance\n\n| Dimension | ExerciseDB (AscendAPI) | free-exercise-db |\n|---|---|---|\n| What it is | A hosted API: V1 free and keyless, V1 paid and V2 through RapidAPI | A static dataset on GitHub, JSON plus images |\n| Catalog | 1,500 free on V1, \"over 2,000\" in V1, 11,000+ in V2 (AscendAPI's figures) | 876 exercises in `dist/exercises.json`, counted October 22, 2026 (README says 800+) |\n| Media | GIFs on V1 (180p free, up to 1080p paid); an MP4 per exercise plus images on V2, watermarked on the free plan | 1,746 JPEG images, two per exercise for 873 exercises and none for 3; no GIFs or video |\n| Access | No key for V1 free; a RapidAPI key for everything else | No key, no signup: clone the repo or fetch raw GitHub URLs |\n| License | AscendAPI's terms of use, not readable from our environment | The Unlicense: public domain, no attribution required |\n| Cost | Free tiers; paid plans on RapidAPI, prices not read | $0 for the data; you pay for wherever you serve it |\n| Rate limits | Free plans 1,000 requests per hour per key; V2 Basic 2,000 a month | None: the files are yours |\n\nFor the cost side across the whole category, see [exercise database API pricing](/pricing/exercise-database-api-pricing).\n\n## What is actually in free-exercise-db\n\nWe downloaded the combined file the README points to and counted it on October 22, 2026, rather than repeating the README's \"800+\". Every record has `id`, `name`, `force`, `level`, `mechanic`, `equipment`, `primaryMuscles`, `secondaryMuscles`, `instructions`, `category` and `images`, validated against a JSON Schema in the repository.\n\n| Category | Exercises |\n|---|---|\n| strength | 584 |\n| stretching | 123 |\n| plyometrics | 61 |\n| powerlifting | 38 |\n| olympic weightlifting | 35 |\n| strongman | 21 |\n| cardio | 14 |\n\nBy level, 525 are beginner, 294 intermediate and 57 expert. The gaps are documented: the README lists `force`, `mechanic` and `equipment` as incomplete in some files, and in our count those fields were null in 30, 87 and 77 records respectively. Five records have an empty instructions list, and the README notes \"a small number of duplicate images\". Muscles come from a fixed list of 17 values (`biceps`, `lats`, `quadriceps` and so on), and IDs are strings built from the name, such as `Alternate_Incline_Dumbbell_Curl`.\n\nServing it takes no backend. The README's documented shortcut is to fetch the combined JSON from raw.githubusercontent.com and prefix each image path with the repository's `exercises/` raw URL:\n\n```bash\ncurl -O https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json\n# an image path such as Air_Bike/0.jpg becomes:\n# https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Air_Bike/0.jpg\n```\n\nFor production, copy the files to your own storage or CDN rather than hot-linking GitHub. The repository also has Makefile tasks to rebuild the combined file and to emit newline-delimited JSON for a PostgreSQL import, and a searchable Vue front end at yuhonas.github.io/free-exercise-db for browsing.\n\nOn provenance, the README says the data was restructured from wrkout/exercises.json, and that upstream repository's LICENSE.md is also the Unlicense. Neither README we read names who made the original photographs; if image provenance matters to your legal review, that is the question to ask.\n\n## Where ExerciseDB pulls ahead\n\nMedia and scale. If your UX depends on a moving demonstration, ExerciseDB is the only one of the two that serves it: animated GIFs on V1, free at 180p, and on V2 a record with a `videoUrl` pointing at an `.mp4`, plus `overview`, `exerciseTips`, `variations`, `keywords` and `relatedExerciseIds` that free-exercise-db has no equivalent for. V2 also names muscles anatomically (\"Pectoralis Major Clavicular Head\" in its sample) and tags a `gender` for its demonstrations. And it is a live service: someone else hosts it, adds exercises and fixes data, and V1's free tier lets you try that without a key.\n\n## Where free-exercise-db pulls ahead\n\nOwnership and zero obligations. The Unlicense dedicates the work to the public domain, so you can ship the data and images in a closed-source commercial app with no attribution, no share-alike and no copyleft. There is no key to leak, no quota to hit, no per-request bill, and no terms of use that can change under you. Because the whole dataset is about a megabyte of JSON, you can bundle it into an app and search it offline. The cost is that you own everything a service would do: hosting, search, fixes, and filling the null fields.\n\n## Which should you pick?\n\n- **You need GIF or video demonstrations:** ExerciseDB. V1 for GIFs, free at 180p, or V2 for MP4 video on RapidAPI plans; read the terms that govern the media files before you ship them.\n- **You need data you can own, with no license strings:** free-exercise-db. It is the most permissive exercise source this site has reviewed.\n- **You are prototyping:** either works for free. free-exercise-db works offline and has no terms to read; ExerciseDB V1's free tier needs no key but comes with terms we could not read. Move to a paid plan once you know whether motion is worth paying for.\n- **You want an open catalog with an API and translations instead:** neither; look at wger, with its AGPL code and per-entry Creative Commons data. The [wger alternatives](/alternatives/wger-alternatives) page compares it against both of these.\n\n## Moving between them\n\nIt is a field-by-field re-map, not a swap. free-exercise-db's `primaryMuscles` uses 17 broad group names; ExerciseDB V1 uses `targetMuscles` arrays such as `pectorals`, and V2 anatomical names; the older RapidAPI listing used a single `target` in our July review. Equipment labels differ in vocabulary and case (`body only` and `e-z curl bar` in free-exercise-db against `LEVERAGE MACHINE` in the V2 README sample). IDs share nothing, so keep a mapping table keyed by your own IDs. Media is the expensive part: going from ExerciseDB to free-exercise-db means two still images per exercise where you had motion, and going the other way means checking that the exercises your users already logged exist in the new catalog. For other ways out of either product, see [ExerciseDB alternatives](/alternatives/exercisedb-alternatives).\n\n## Watch the fine print\n\nOur counts describe free-exercise-db's main branch as we downloaded it on October 22, 2026; a later commit can change them. ExerciseDB's catalog and media figures are AscendAPI's own, its free tiers are as its documentation described them that day, and its paid prices and terms sit on pages we could not read from our environment, so verify them before you budget.",
    "faqs": [
      {
        "q": "How many exercises are in free-exercise-db?",
        "a": "876, when we counted the combined dist/exercises.json on its main branch on October 22, 2026; the README rounds this to 800+. The same file references 1,746 JPEG images, two for each of 873 exercises and none for three. Recount after pulling, since community commits can change the total."
      },
      {
        "q": "Is free-exercise-db an API?",
        "a": "No. It is a static dataset: individual JSON files plus a combined exercises.json and an images folder in a GitHub repository. You can clone it, or fetch the JSON and images from raw GitHub URLs as its README describes, but there are no endpoints, search or filters; you build those yourself or load the data into your own database."
      },
      {
        "q": "Can free-exercise-db images be used in a commercial app?",
        "a": "Its repository's LICENSE.md is the Unlicense, which places the work in the public domain for any purpose, commercial or not, with no attribution required, and the README presents the images as part of the dataset. The upstream project it was restructured from carries the same license. Neither README names who made the original photos, so ask that question if your legal review needs provenance. This is not legal advice."
      },
      {
        "q": "Does free-exercise-db have GIFs or exercise videos?",
        "a": "No. Every image path in the dataset is a still JPEG, two per exercise for all but three exercises, which have none. If you need motion, AscendAPI's ExerciseDB V1 serves animated GIFs, free at 180p with no key, and its ExerciseDB V2 gives each exercise an MP4 video through RapidAPI, watermarked on the free plan."
      }
    ],
    "related": [
      {
        "href": "/compare/exercisedb-vs-wger",
        "label": "ExerciseDB vs wger"
      },
      {
        "href": "/alternatives/exercisedb-alternatives",
        "label": "ExerciseDB alternatives"
      },
      {
        "href": "/alternatives/wger-alternatives",
        "label": "wger alternatives"
      },
      {
        "href": "/fitness-apis/exercise-video-apis",
        "label": "Exercise video APIs"
      },
      {
        "href": "/pricing/exercise-database-api-pricing",
        "label": "Exercise database API pricing"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Exercise API quotas shift and dataset counts drift - subscribe for plain-English updates when exercise data pricing and licensing change."
    },
    "sources": [
      {
        "url": "https://github.com/yuhonas/free-exercise-db/blob/main/README.md",
        "checked": "2026-10-22",
        "note": "dataset description, raw-URL hosting, Makefile tasks, incomplete fields, duplicate images, provenance"
      },
      {
        "url": "https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE.md",
        "checked": "2026-10-22",
        "note": "Unlicense"
      },
      {
        "url": "https://github.com/yuhonas/free-exercise-db/blob/main/schema.json",
        "checked": "2026-10-22",
        "note": "fields, 17 muscle values, category and level enums"
      },
      {
        "url": "https://github.com/yuhonas/free-exercise-db/blob/main/dist/exercises.json",
        "checked": "2026-10-22",
        "note": "counted: 876 exercises, categories, levels, null fields, 1,746 JPEG image paths"
      },
      {
        "url": "https://github.com/wrkout/exercises.json/blob/master/LICENSE.md",
        "checked": "2026-10-22",
        "note": "upstream dataset is also the Unlicense"
      },
      {
        "url": "https://github.com/ExerciseDB/exercisedb-api",
        "checked": "2026-10-22",
        "note": "README claims, v2 sample record, playground warning; repository still README + LICENSE only"
      },
      {
        "url": "https://github.com/ExerciseDB/exercisedb-api/blob/main/LICENSE",
        "checked": "2026-10-22",
        "note": "AGPL-3.0 license file"
      },
      {
        "url": "https://exercisedb.dev/",
        "checked": "2026-10-22",
        "note": "AscendAPI, previously ExerciseDB (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v1/overview",
        "checked": "2026-10-22",
        "note": "V1 free and paid tiers, fields (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v2/overview",
        "checked": "2026-10-22",
        "note": "V2 catalog, MP4, watermark (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/quickstart/overview",
        "checked": "2026-10-22",
        "note": "free Basic plan (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/guides/ratelimiting",
        "checked": "2026-10-22",
        "note": "free-plan rate limit (snapshot)"
      }
    ]
  },
  {
    "slug": "kinestex-vs-sency",
    "primaryQuery": "kinestex vs sency",
    "h1": "KinesteX vs Sency: Which Motion Tracking SDK?",
    "metaTitle": "KinesteX vs Sency (2026): Motion Tracking SDKs Compared",
    "metaDescription": "KinesteX vs Sency for AI motion tracking: WebView embed vs native SDK, platforms, licenses, prices and what we could verify. KinesteX funds this site.",
    "updated": "2026-11-09",
    "answer": "KinesteX (this site's own product; KinesteX funds this site) is our overall pick over Sency on stated criteria: more ships in the box, from an AI Trainer Chat and ready-made views to content APIs and an admin workout editor, and it covers the web as well as Swift, Kotlin, React Native and Flutter, where Sency's own platform table marks JavaScript NA. The difference is architectural: KinesteX embeds a hosted camera experience in a WebView or iframe, while Sency's SMKit is a native SDK, with an optional branded UI kit, where you own the camera preview and UI. Pick Sency instead if you need an in-process native kit with no prebuilt UI, a free tier for up to 100 monthly active users (if its packages page governs) or its published prices, which run below the $1.50 per MAU and $1,500 monthly minimum in KinesteX's seed deck, or Sency's MCP server and assessments inside your own UI. No accuracy claim on either side has been independently benchmarked.",
    "faqs": [
      {
        "q": "Is KinesteX a native SDK like Sency's SMKit?",
        "a": "No, and this is the core difference. KinesteX's public repos describe its SDKs as WebView and iframe wrappers that embed a hosted camera workout experience, communicating via postMessage events, plus REST content APIs; even its Camera Component, which can stream pose landmarks, comes through the same WebView kit. Sency's README describes its core SMKit as a native no-UI SDK where the developer owns the camera preview and UI in the Custom Kit. A hosted experience ships faster with content included; a native SDK gives you full rendering control."
      },
      {
        "q": "Does Sency support web or JavaScript apps?",
        "a": "Not per its own public documentation: Sency's platform table in the smkit-sdk README lists iOS, Android, React Native and Flutter, and marks JavaScript and Unity as NA. KinesteX's Getting Started page lists a React (TypeScript) SDK and a plain HTML and JavaScript iframe integration for any web page or PWA. If your product includes a web surface, that gap decides the comparison on its own, but re-check Sency's repos before ruling it out, since platform tables change."
      },
      {
        "q": "How much do KinesteX and Sency cost?",
        "a": "KinesteX publishes no price list on its website; its public seed pitch deck states $1.50 per monthly active user with a $1,500 monthly minimum, and its FAQ adds that integration fees may apply, so confirm with KinesteX. Sency's packages page lists a free Starter plan for up to 100 monthly active users and Growth from $499 a month up to 3,800, while its pricing page lists $99.99 fixed for the first 100 users after a free trial. On those figures Sency is cheaper. Get written quotes from both."
      },
      {
        "q": "Are KinesteX or Sency open source?",
        "a": "Neither product is open source, though the repo licensing differs. Most KinesteX wrapper and demo repos (Swift, Kotlin, React Native, HTML-JS) carry an Apache-2.0 LICENSE, but the hosted experience behind them is a commercial, API-key-gated service, and the Flutter, SwiftUI-kit and PWA repos have no LICENSE file. Sency's repo LICENSE is its own proprietary Terms of Use, which puts commercial use under a separate paid agreement. In both cases you are buying a commercial service; the public repos are integration code."
      },
      {
        "q": "Which is more accurate, KinesteX or Sency?",
        "a": "Unknown, and be wary of anyone who answers confidently, including us, since KinesteX funds this site. KinesteX's README claims its models consistently exceed 90% accuracy and its FAQ claims 97.2%: first-party marketing lines, not independent benchmarks, and they do not agree with each other. Sency publishes no comparable figure, though its FAQ calls its accuracy unmatched. No independent comparison of the two exists that we could verify, so run both SDKs on your exercises, devices and lighting."
      }
    ],
    "cta": {
      "pitch": "We compare motion tracking SDKs the same way we compare everyone else's APIs, from public repos and vendor pages with the gaps and our own conflicts labeled, so subscribe and get the next teardown before you sit through a sales demo."
    },
    "body": "**Disclosure: KinesteX funds this site. KinesteX is this site's own product, and this page is written by the company behind it.** Treat it the way you would treat any first-party comparison: skeptically. Every factual claim below traces to the vendors' public repos, package registries, their own pages or, for one KinesteX price, its public seed pitch deck, all as read on November 9, 2026. Marketing claims are quoted as marketing, gaps are called out, including accuracy for both, and Sency's strengths get their own section. The disclosure is checked at build time too: [the list of automated refusals that run before this site deploys](/gates) includes a check that fails any page linking to the site's funder without one.\n\n## How to compare KinesteX and Sency\n\nBoth products sell the same promise, AI motion tracking for fitness apps through a phone camera with no extra hardware, and both use nearly identical category language (\"AI motion analysis SDK\" for KinesteX, \"AI motion analysis technology\" for Sency). Four things actually separate them, and all are verifiable:\n\n- **Integration architecture.** KinesteX's SDKs embed a hosted web experience: its SwiftUI kit README describes \"a SwiftUI package that embeds KinesteX's AI-powered camera workout experience as a WebView,\" the web integration is an iframe, and the React Native SDK installs alongside `react-native-webview`. Sency's SMKit is the opposite: its version table calls the core iOS kit a \"Native no-UI SDK\", a native library where, in the Custom Kit, the developer owns the camera preview and all UI.\n- **Platform coverage.** KinesteX's Getting Started page lists SDKs for Swift, Kotlin, Flutter, React Native and React (TypeScript), plus a plain HTML and JavaScript iframe integration for any web page or PWA. Sency's platform table covers iOS, Android, React Native and Flutter, and explicitly marks JavaScript and Unity as \"NA.\"\n- **What ships in the box.** KinesteX's docs now recommend AI Trainer Chat, a white-labeled AI personal trainer, as \"the recommended starting point for new integrations\", and list plan, workout, challenge and leaderboard views, three motion games, an embedded Admin Workout Editor, a Camera Component and REST content APIs. Sency's README centers on assessments, progress evaluations and personalized workout plans, delivered either as a white-label Branded Kit (SMKitUI) or a no-UI Custom Kit (SMKit).\n- **Price.** Sency publishes plans with prices, on two pages that disagree about the first 100 users. KinesteX publishes no price list on kinestex.com; the only public figure is in its seed pitch deck.\n\nYou can audit all of it: the [KinesteX GitHub org](https://github.com/KinesteX), [Sency's smkit-sdk repository](https://github.com/sency-ai/smkit-sdk) and demo repos, npm, pub.dev and each company's site.\n\n## KinesteX vs Sency at a glance\n\n| Dimension | KinesteX | Sency | Verified from |\n|---|---|---|---|\n| Integration surface | WebView and iframe wrappers around a hosted camera experience, with postMessage events and REST content APIs | Native SDK; core SMKit is a \"Native no-UI SDK\"; SMKitUI adds prebuilt white-label UI | KinesteX AI-Kit and PWA READMEs; Sency smkit-sdk README |\n| Platforms | Swift, Kotlin, Flutter, React Native, React (TypeScript), and an HTML and JavaScript iframe for any web page or PWA | iOS, Android, React Native, Flutter; JavaScript and Unity marked \"NA\" | KinesteX Getting Started; Sency README platform table |\n| Product tiers | Plug-and-play: AI Trainer Chat (recommended), Plan, Workout, Challenge and Leaderboard views, AI Experiences, Admin Workout Editor. Custom: Custom Workout, Camera Component, content APIs. Complete UX (Main) and Personalized Plan View are marked \"Sunset\" | Branded Kit (SMKitUI, \"quick, low-code\") or Custom Kit (SMKit, no predefined UI) | KinesteX docs; Sency smkit-sdk README |\n| Stated features | Reps, mistakes, posture alignment, calories; assessments (TUG, gait speed, sit-to-stand, balance stands); 19 languages per its FAQ; admin-panel theming | Fitness assessments, monthly progress evaluations, personalized plans; Body Calibration, Adaptive ROM, Session Lifecycle; 4-step fitness, low back pain and 8 mobility assessments | Vendor statements, not tested by us |\n| Data events | Per-rep accuracy and mistakes, workout scores; the Camera Component adds pose landmarks on request; \"300+ data points per workout session\" per its FAQ | Session lifecycle, body calibration and result data types in the iOS demo | KinesteX docs and FAQ; Sency iOS demo |\n| Where the models come from | Security page: the cloud delivers content and AI models; pose estimation runs on the device | Downloaded from Sency's server, no bundled fallback; a valid cache works offline later; FAQ: data never sent to the cloud | KinesteX security page; Sency demos and FAQ |\n| OS floors | iOS 14.0+ (Xcode 16.3+); Android 9+ (API 28) | iOS 16 in the Custom Kit demo Podfile, iOS 15 or later for SMKitUI; Android demo builds with minSdk 24 | KinesteX Getting Started; Sency demo READMEs |\n| Distribution | SPM; JitPack (Kotlin SDK 2.5.0); npm (kinestex-sdk-react-native 1.5.0, 2026-10-19); pub.dev (kinestex_sdk_flutter 1.5.1, 2026-07-04) | CocoaPods and SPM from Bitbucket (SMKit 2.3.6); Maven (SMKit 1.9.6); npm (@sency/react-native-smkit-ui 2.4.4, 2026-10-21); pub.dev (flutter_smkit_ui 1.6.1, 2026-10-21) | Install docs, demo READMEs, registries |\n| Repo license | Apache-2.0 in the Swift, Kotlin, React Native and HTML-JS repos; none in the Flutter, SwiftUI-kit and PWA repos; the hosted service is commercial | Proprietary \"Sency Terms of Use\" (2022); commercial use needs a separate paid agreement | Raw LICENSE files |\n| Repo activity | KinesteX-AI-Kit, KinesteX-SDK-Kotlin and KinesteX-SDK-Swift updated November 5, 2026; React Native repo October 9, 2026 | React Native and Flutter UI packages both published October 21, 2026 | KinesteX GitHub org listing; npm and pub.dev |\n| Pricing | No price list on kinestex.com. Its seed deck states \"$1.50 per MAU. $1,500 monthly minimum.\" The FAQ says per-user rates fall with tiers and integration fees may apply. Confirm with the vendor | Packages page: Starter free up to 100 monthly active users; Growth from $499 a month (101-500 users, $0.99 each) to $3,000 (3,001-3,800, $0.79); Customized on request. Pricing page: free trial, then $99.99 fixed for up to 100 users, $5,500 for 5,001-10,000, \"Up to $0.1 per active user\" above 10,000 | KinesteX deck and FAQ; Sency's two pricing pages |\n| Accuracy | Not verified: \"consistently exceed 90% accuracy\" (README) and \"97.2% accuracy\" (FAQ) are vendor claims | Not verified: its FAQ calls its accuracy \"unmatched\" without a number | No independent benchmark |\n\n## What we could not verify, for either vendor\n\n- **Prices, for both, in different ways.** KinesteX's FAQ describes the model (usage-based, per active user per month, possible integration fees, no termination penalties) but kinestex.com gives no figure. The one public number is in its seed pitch deck, an investor document rather than a rate card, so confirm it with the vendor. Sency's two pages still disagree about the start: free for up to 100 monthly active users on the packages page, $99.99 fixed after a free trial on the pricing page, whose FAQ calls it a \"minimal monthly fee\". The pricing page also skips from 3,800 to 5,001 users, and neither page says how a band's monthly fee and per-user price combine.\n- **Accuracy, for both.** No independent benchmark compares these products. KinesteX's two figures, above 90 percent in a README and 97.2 percent in its FAQ, are its own claims and do not agree with each other; Sency publishes no figure. Run both on your own movements and lighting.\n- **On-device processing, for KinesteX.** KinesteX's security page says \"All camera and vision processing stays on-device\", and its SDK integration page says \"The camera video never leaves it and is not stored\", while its SDK READMEs still say \"optional edge processing (no cloud transmission)\". Those are not the same promise, and the integration page adds that the AI Personal Trainer chat needs internet, so get your configuration's behavior in writing.\n- **Sency's version table.** The smkit-sdk README's version table still lists iOS SMKit 2.0.7 and Android smkit 1.7.1, while the iOS demo installs SMKit 2.3.6 and the Android demo SMKit 1.9.6. Go by the demos and the registries, and ask Sency which is current.\n- **Sency's Android floor.** Its Android demo app builds with minSdk 24; we found no separate statement of SMKit's own minimum.\n- **KinesteX's own numbers.** Its home page says 500+ AI exercises and 19 languages; its seed deck says \"550+ exercises built in\" and, on its competition slide, 17 languages. We report both and cannot say which count is current.\n\n## Where Sency wins\n\nSency's edge is architectural, and it is a real one: SMKit is a native SDK, not a WebView. Its version table says it plainly, calling the core iOS kit a \"Native no-UI SDK\", and its iOS demo says the developer owns the camera preview, session lifecycle, exercise UI, skeleton rendering and results. If the workout screen must match your design system frame for frame, plug into your own rendering pipeline, or avoid a hosted web experience inside your app, Sency's shape is the right one and KinesteX's is not. Its iOS docs treat Body Calibration, Adaptive ROM and Session Lifecycle as first-class SDK concepts, deeper on native concerns than KinesteX's public repos, and it offers a low-code Branded Kit and a no-UI Custom Kit on the same native core.\n\nIt reaches older Android phones: its Android demo builds with minSdk 24, where KinesteX's docs require Android 9 (API 28). Its assessments are productized: the Motion SDK page lists a 4-step onboarding assessment, a low back pain injury-risk assessment and 8 shoulder-to-ankle mobility tests, and its pricing FAQ claims a record of 54 minutes from installing the SDK to a working fitness assessment in a partner's app, a vendor claim we have not tested.\n\nIt is also more transparent about price than we are, and cheaper on the published figures. Its packages page lists a free Starter plan for up to 100 monthly active users and Growth bands from $499 a month for 101-500 users to $3,000 for 3,001-3,800, at $0.79 per active user in the top band. Against the $1.50 per MAU and $1,500 monthly minimum in KinesteX's seed deck, every Sency band up to 1,700 users costs less than KinesteX's minimum, and Sency's top Growth rate is about half KinesteX's per-user figure. It documents an MCP server that gives AI coding tools its SDK documentation. And it is actively maintained, with its React Native and Flutter UI packages both published on October 21, 2026: this is not an abandoned competitor, and we are not going to pretend otherwise.\n\n## Where KinesteX wins\n\nKinesteX's edge is coverage and what ships in the box. It is the only one of the two with a web story: its Getting Started page covers a plain HTML and JavaScript iframe for any web page or PWA and a React (TypeScript) SDK, where Sency's own platform table marks JavaScript \"NA\". If your product includes a web or PWA surface, that difference is decisive on its own.\n\nIts docs also describe a broader prebuilt layer, in our reading of the two sets: AI Trainer Chat, which runs onboarding, an optional camera fitness assessment, a generated workout, a check-in and next-session scheduling; plan, workout, challenge and leaderboard views; the Balloon Pop, Color Chase and Alien Squat Shooter games; an Admin Workout Editor; content APIs for exercises, workouts and plans at data.kinestex.com; an assessment spec; and 19 languages. KinesteX's SDK integration page sets out three ways in, from ready-made experiences in \"1 week or less\" to building every screen in about a month, and its FAQ says integration \"typically takes under a day\". To be fair, assessments are not a KinesteX exclusive, since Sency's README leads with movement and fitness assessments and personalized plans; the difference is the content, chat and views layer around them.\n\nThe iOS floor is lower (iOS 14 versus Sency's iOS 15 for SMKitUI and iOS 16 for the Custom Kit demo), though the Android floor is higher, and the wrapper code carries an Apache-2.0 license where LICENSE files exist. The hosted experience behind the wrapper is a commercial, API-key-gated service, and your workout screen is a hosted web app, not native rendering you control.\n\n## Verdict\n\nOur verdict, written by the company behind KinesteX: KinesteX is the overall pick in this comparison on four stated criteria, and it does not win all four.\n\n- **What ships in the box and time to integrate: KinesteX.** A trainer chat, ready-made views, games, an admin editor, content APIs, assessments and 19 languages, with integration put at under a day. Sency documents assessments and a branded UI kit, but no chat trainer, content API or admin editor on the pages we read.\n- **Platform breadth: KinesteX.** Six paths including the web, against four with JavaScript marked \"NA\".\n- **Price: Sency.** Sency publishes its plans, and they are lower than the $1.50 per MAU and $1,500 monthly minimum in KinesteX's seed deck at every volume both name.\n- **Maintenance: even.** KinesteX's AI-Kit, Kotlin and Swift repos were updated on November 5, 2026 and kinestex-sdk-react-native 1.5.0 shipped on October 19; Sency's React Native and Flutter UI packages shipped on October 21. Both are active.\n\nThe verdict flips to Sency when you need an in-process native kit with no WebView and no prebuilt UI, a free tier for up to 100 monthly active users (if its packages page governs rather than its pricing page) or the lower published price at your volume, or Sency's MCP server and its assessments inside your own UI.\n\n## How to choose\n\nBy use case:\n\n- **Your product has a web or PWA surface** → KinesteX, by elimination: Sency's platform table marks JavaScript \"NA,\" and KinesteX documents iframe and React (TypeScript) integration for exactly this.\n- **You want a trainer, workouts, plans, challenges and leaderboards without building content systems** → KinesteX's AI Trainer Chat, plug-and-play views and content APIs cover ground Sency's public repos do not document.\n- **You need a native, no-WebView integration where you own the camera preview and UI** → Sency's Custom Kit. That is its architecture's core promise, and KinesteX's WebView approach cannot match it.\n- **You want prebuilt UI but insist on native rendering** → Sency's Branded Kit sits exactly in that gap: white-label prebuilt UI, still a native SDK underneath.\n- **You need a budget number before a sales call** → Sency publishes two price pages; KinesteX's only figure is in its deck. See [Sency pricing](/pricing/sency-pricing) and, for a per-device price list, [QuickPose vs Sency](/compare/quickpose-vs-sency).\n- **You might build on a raw pose model instead** → read [build vs buy for AI motion tracking](/motion/build-vs-buy-ai-motion-tracking) and [the pose estimation model comparison](/motion/pose-estimation-models-compared): the pose model is free; the exercise logic, feedback and UX are the product.\n- **You are earlier than a vendor decision** → the [camera pose tracking guide](/guides/camera-pose-tracking) covers the fundamentals, and [Sency alternatives](/alternatives/sency-alternatives) maps the wider field with the same disclosure as this page.\n\n## The fine print\n\nEverything above is a snapshot of two actively developed products, verified on November 9, 2026. Versions, platform tables, OS floors, prices and README claims all move. Before you commit, re-check both GitHub orgs, get written prices from both vendors and test each SDK against your own exercises, devices and lighting. That last step matters most: no accuracy claim on either side has been independently verified, including our own.",
    "related": [
      {
        "href": "/compare/kinestex-vs-quickpose",
        "label": "KinesteX vs QuickPose"
      },
      {
        "href": "/alternatives/sency-alternatives",
        "label": "Sency alternatives"
      },
      {
        "href": "/pricing/sency-pricing",
        "label": "Sency pricing"
      },
      {
        "href": "/alternatives/kinestex-alternatives",
        "label": "KinesteX alternatives — the vendor's own list"
      },
      {
        "href": "/fitness-apis/ai-workout-tracking-apis",
        "label": "Best AI workout tracking APIs"
      }
    ],
    "firstParty": true,
    "sources": [
      {
        "url": "https://github.com/KinesteX",
        "checked": "2026-11-09",
        "note": "12 public repositories; AI-Kit, Kotlin and Swift updated Nov 5, 2026, React Native Oct 9, 2026 (snapshot of the org repository listing)"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-11-09",
        "note": "WebView architecture, iOS 14 package floor, no LICENSE file"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-PWA",
        "checked": "2026-11-09",
        "note": "iframe and postMessage web integration, no LICENSE file"
      },
      {
        "url": "https://github.com/KinesteX/.github",
        "checked": "2026-11-09",
        "note": "postMessage events, assessment data"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-Swift-Demo",
        "checked": "2026-11-09",
        "note": "integration options, iOS 14 minimum"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-11-09",
        "note": "the 90% accuracy claim"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-11-09",
        "note": "optional edge processing line, admin portal, Apache-2.0 LICENSE.txt"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-11-09",
        "note": "1.5.0 on 2026-10-19, Apache-2.0"
      },
      {
        "url": "https://pub.dev/packages/kinestex_sdk_flutter",
        "checked": "2026-11-09",
        "note": "1.5.1 on 2026-07-04"
      },
      {
        "url": "https://www.kinestex.com/docs/getting-started",
        "checked": "2026-11-09",
        "note": "SDK list, AI Trainer Chat recommended, plug-and-play and custom integrations, requirements, contact-form API key (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/installation",
        "checked": "2026-11-09",
        "note": "KinesteXAIKit, Kotlin SDK 2.5.0 and minSdk 28 via JitPack, react-native-webview, React TypeScript package (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/ai-trainer-chat",
        "checked": "2026-11-09",
        "note": "AI Trainer Chat flow; Complete UX (Main) and Personalized Plan View marked Sunset (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/content-api-v2",
        "checked": "2026-11-09",
        "note": "content APIs at data.kinestex.com (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-11-09",
        "note": "integration time, 300+ data points, 19 languages, pricing model and the 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/sdk-integration",
        "checked": "2026-11-09",
        "note": "three ways in with timelines, camera video statement, trainer chat needs internet (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/",
        "checked": "2026-11-09",
        "note": "500+ AI exercises and 19 languages (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-11-09",
        "note": "on-device processing statement (snapshot)"
      },
      {
        "url": "https://kinestex-pitch.vercel.app/",
        "checked": "2026-11-09",
        "note": "KinesteX's public seed pitch deck: $1.50 per MAU, $1,500 monthly minimum, 550+ exercises, 17 languages (rendered in a browser)"
      },
      {
        "url": "https://github.com/sency-ai/smkit-sdk",
        "checked": "2026-11-09",
        "note": "kits, platform and version tables, features, FAQ, Terms of Use LICENSE"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ios-demo",
        "checked": "2026-11-09",
        "note": "iOS 16.0, Bitbucket distribution, SMKit 2.3.6, server-downloaded models, calibration, adaptive ROM, session lifecycle, MCP server"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ui-ios-demo",
        "checked": "2026-11-09",
        "note": "SMKitUI iOS 15 or later"
      },
      {
        "url": "https://github.com/sency-ai/smkit-android-demo",
        "checked": "2026-11-09",
        "note": "SMKit 1.9.6, minSdk 24 and server-delivered models"
      },
      {
        "url": "https://www.npmjs.com/package/@sency/react-native-smkit-ui",
        "checked": "2026-11-09",
        "note": "2.4.4 on 2026-10-21"
      },
      {
        "url": "https://pub.dev/packages/flutter_smkit_ui",
        "checked": "2026-11-09",
        "note": "1.6.1 on 2026-10-21"
      },
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-11-09",
        "note": "Starter, Growth and Customized plans, Growth tier table (snapshot)"
      },
      {
        "url": "https://www.sency.ai/pricing",
        "checked": "2026-11-09",
        "note": "free trial, $99.99 fixed for up to 100 users, tier table to 10,000+, 54-minute record claim (snapshot)"
      },
      {
        "url": "https://www.sency.ai/faq-motion-tracking",
        "checked": "2026-11-09",
        "note": "on-device processing and accuracy wording (snapshot)"
      },
      {
        "url": "https://www.sency.ai/motion-sdk",
        "checked": "2026-11-09",
        "note": "assessments: 4-step fitness, low back pain, 8 mobility tests (snapshot)"
      }
    ]
  },
  {
    "slug": "kinestex-vs-quickpose",
    "primaryQuery": "kinestex vs quickpose",
    "h1": "KinesteX vs QuickPose: Decide by How Much You Want to Build",
    "metaTitle": "KinesteX vs QuickPose: Different Layers of the Stack",
    "metaDescription": "KinesteX vs QuickPose: a hosted coaching embed vs a MediaPipe toolkit, platforms, published prices and licenses, verified. KinesteX funds this site.",
    "updated": "2026-11-09",
    "answer": "KinesteX (this site's own product; KinesteX funds this site) is our overall pick over QuickPose on stated criteria: it ships a complete hosted coaching layer, including AI Trainer Chat, ready-made views, content APIs and an admin workout editor, and it covers Flutter and the web as well as Swift, Kotlin and React Native. The two sit at different layers: KinesteX embeds a hosted experience in a WebView or iframe, while QuickPose is a MediaPipe and BlazePose toolkit that runs in your app and leaves the UI and content to you. Pick QuickPose instead if you want building blocks inside your own UI on iOS, Android or React Native, a start at $25 a month (free for up to 10 devices) rather than the $1,500 monthly minimum in KinesteX's seed deck, or in-process MediaPipe with a free key today.",
    "faqs": [
      {
        "q": "Are KinesteX and QuickPose direct competitors?",
        "a": "Only partially. They meet at camera-based exercise tracking, but they sell different layers: QuickPose provides pose estimation, skeleton tracking, exercise counters and range-of-motion measurement as native building blocks with no workout content or prebuilt coaching UI in its repos, while KinesteX embeds a complete hosted coaching experience, with an AI trainer chat, content, plans, leaderboards and assessments, behind a WebView or iframe. A team choosing between them is really choosing how much product to build versus configure."
      },
      {
        "q": "Is QuickPose open source?",
        "a": "The iOS repository is Apache-2.0 licensed and QuickPose's terms license the SDK under Apache 2.0 subject to the agreement, but the product is not fully open source: the SDK needs a key, the README says usage limits may apply and keys are linked to your bundle ID, and the terms say use may be subject to fees. Its paid plans are billed per monthly active device. The Android repository carries no LICENSE file, and the React Native plugin is published on npm as MIT."
      },
      {
        "q": "Does KinesteX process video on-device?",
        "a": "Its public statements differ. The SDK READMEs say the platform ensures data security with optional edge processing and no cloud transmission, and the word optional matters; KinesteX's security page says all camera and vision processing stays on-device and that its cloud delivers content and AI models, and its SDK integration page says camera video never leaves the device but the AI trainer chat needs internet. If on-device processing is a compliance requirement, get your configuration's behavior from KinesteX in writing."
      },
      {
        "q": "Can I use QuickPose on Android or React Native?",
        "a": "Yes. QuickPose's documentation gives a minimum of Android API 26, with sample code needing API 28 because of CameraX, and the Android SDK is distributed through Maven. The React Native plugin, published on npm as @quickpose/react-native, provides body tracking, rep counting, range-of-motion measurement and skeleton overlays on iOS and Android; its latest version when we checked was 0.7.2, published November 2, 2026. The Android README's feature table omits the iOS table's measuring line, gesture inputs and body-position feedback, so check each platform."
      },
      {
        "q": "What do KinesteX and QuickPose cost?",
        "a": "QuickPose publishes its SDK prices per monthly active device: free for up to 10 devices, then from $25 a month for up to 100 devices to $1,000 a month for up to 100,000, with every SDK feature on every plan and services priced separately. KinesteX publishes no price list on its website; its public seed pitch deck states $1.50 per monthly active user with a $1,500 monthly minimum, and its FAQ says integration fees may apply. Confirm current terms with both before you commit."
      }
    ],
    "cta": {
      "pitch": "Both of these products live in public GitHub repos that moved within days of our check, so get our developer notes when platform support, licensing, pricing or access models actually change."
    },
    "body": "**Disclosure: KinesteX funds this site. KinesteX is this site's own product and this page is written by the company behind it, so it holds itself to a stricter rule than usual: every claim about either vendor traces to their public GitHub repositories, package registries, their own published pages or, for one KinesteX price figure, its public seed pitch deck, as checked on November 9, 2026, judgment calls are labeled as judgment calls, and the \"Where QuickPose wins\" section is not decorative.** Every passage we quote from either vendor's site is re-tested against the live page by an automated check, and [the automated checks that gate every deploy](/gates) refuse a page that links to this site's funder without a disclosure beside it.\n\nThe first honest thing to say is that these two products mostly sit at different layers of the stack. QuickPose is a developer toolkit: it hands you pose estimation, skeleton tracking, rep counting and range-of-motion measurement as native building blocks, and you build the product. KinesteX is an embeddable product: its SDKs drop a complete, hosted AI coaching experience into your app, and you configure it. They overlap at \"AI watches a user exercise through a phone camera\", which is why people search this comparison, but the real question is how much of the experience you intend to build yourself. If the answer is \"all of it, from a raw model\", neither is your page; start with [build vs buy for AI motion tracking](/motion/build-vs-buy-ai-motion-tracking).\n\n## What each one is, per its own repos and pages\n\n**QuickPose** describes itself in its [iOS SDK README](https://github.com/quickpose/quickpose-ios-sdk) as providing \"developer-oriented cutting edge ML features of MediaPipe and BlazePose, with easy integration and production ready code\", aimed at faster implementation of \"pose estimation, skeleton tracking and fitness counting features into mobile applications\". The README backs that with specifics: joint positions and overlays, range-of-motion measurement for shoulders, hips, knees, back and neck, detection and counting for 20 named exercises (squat, push-up, plank, lunges, biceps curls and more), feedback events for body position and a named limb out of view, a measuring line in beta, and raised-finger and thumbs-up inputs. The Swift package ships MediaPipe lite, full and heavy libraries as modules, and QuickPose's product pages say all inference runs on the device and that no video frames are sent to a server. It runs on iOS 14.0 or later, on Android from API 26 (its sample code needs API 28), and in React Native through the @quickpose/react-native plugin. The SDK key is free to register; the README's words are \"Get your free SDK key on https://dev.quickpose.ai, usage limits may apply\". What you will not find in the repositories is workout content, plans or a prebuilt coaching UI. In our reading, QuickPose is build-assist tooling, not a turnkey experience.\n\n**KinesteX** lists 12 public repositories in the [KinesteX GitHub org](https://github.com/KinesteX), covering iOS (an older Swift SDK and the newer KinesteXAIKit, which its docs now name for Swift), Android, Flutter, React Native and two web integration paths, and its Getting Started page lists SDKs for Swift, Kotlin, Flutter, React Native and React (TypeScript), \"plus a plain HTML/JavaScript iframe integration for any web page or PWA\". The integration surface is consistent and the repos are upfront about it: the SwiftUI kit README calls itself \"a SwiftUI package that embeds KinesteX's AI-powered camera workout experience as a WebView\", the web path is an iframe that communicates over `postMessage`, and the React Native SDK installs alongside `react-native-webview`. So the SDKs are thin native wrappers around one hosted web experience, paired with REST content APIs.\n\nWhat ships inside that experience, per the docs as read on November 9, 2026: AI Trainer Chat, which the docs call \"the recommended starting point for new integrations\", a white-labeled trainer that runs onboarding, an optional camera fitness assessment, a generated workout, a post-workout check-in and next-session scheduling; plan, workout, challenge and leaderboard views; AI Experiences (the Balloon Pop, Color Chase and Alien Squat Shooter games); and an embedded Admin Workout Editor. For teams that want only the tracking there is a Custom Workout option and a Camera Component that streams reps, holds, form feedback and presence, and pose landmarks on request, plus content APIs for exercises, workouts and plans at data.kinestex.com. The older Complete UX (Main) and Personalized Plan View integrations are marked \"Sunset\" in the docs. Around that sit rep, mistake and workout data events, admin-panel theming, 19 languages per its FAQ, and documented movement assessments (Timed Up and Go, gait speed, sit-to-stand variants, the Functional Reach Test, balance stands) with risk-level outputs.\n\n## Side by side\n\nChecked on November 9, 2026; gaps in the public record are marked as gaps rather than filled in from memory.\n\n| Dimension | QuickPose | KinesteX |\n|---|---|---|\n| Layer of the stack | Native pose-estimation toolkit (MediaPipe and BlazePose) you build a product on | Hosted coaching experience embedded via WebView or iframe, plus REST content APIs |\n| Platforms | iOS 14.0+; Android API 26 (samples API 28); React Native plugin; we found no public web package | Swift, Kotlin, Flutter, React Native, React (TypeScript) and an HTML and JavaScript iframe for the web |\n| Integration model | MediaPipe libraries ship in the SDK modules; your app owns the camera, rendering and UI | A native wrapper loads the hosted experience; events cross a `postMessage` bridge |\n| Fitness features in the box | Range of motion for five joint groups, counters for 20 exercises, feedback events, gesture inputs | AI Trainer Chat; workout, plan, challenge and leaderboard views; games; rep and mistake events; calorie estimates; assessments; an Admin Workout Editor |\n| Workout content included | None in the repos | Yes, through the views, the content APIs or the admin panel |\n| Requirements | iOS 14.0+ or Android API 26+, SDK key tied to your bundle ID | iOS 14.0+ with Xcode 16.3+; Android 9+ (API 28; the Kotlin SDK needs minSdk 28); camera permission and a motion-sensor usage description on iOS; `CAMERA` and `INTERNET` permissions on Android; an internet connection |\n| Published pricing | Yes, per monthly active device: free for 10, then $25 a month for 100 up to $1,000 a month for 100,000, every feature on every plan | No price list on kinestex.com. Its seed deck states \"$1.50 per MAU. $1,500 monthly minimum.\"; its FAQ says per-user rates fall at higher tiers and integration fees may apply. Confirm with the vendor |\n| Getting a key | Free registration at dev.quickpose.ai | Contact form or a booked call for demo access and an API key |\n| License | Apache-2.0 LICENSE in the iOS repo; QuickPose's terms license the SDK under Apache 2.0 subject to the agreement and fees; no LICENSE file in the Android repo; the npm plugin is MIT | Apache-2.0 in the Swift, Kotlin, React Native and HTML-JS repos; no LICENSE file in the Flutter, SwiftUI-kit and PWA repos; the hosted service is commercial and needs an API key |\n| Recent activity | iOS, Android and React Native repos updated November 2, 2026; npm plugin 0.7.2 on 2026-11-02; demo apps updated in September 2026 | KinesteX-AI-Kit, Kotlin and Swift repos updated November 5, 2026; npm kinestex-sdk-react-native 1.5.0 on 2026-10-19; pub.dev kinestex_sdk_flutter 1.5.1 on 2026-07-04 |\n| Accuracy | No figure published in the repos | \"Consistently exceed 90% accuracy\" in a README and \"97.2% accuracy\" in its FAQ: vendor claims, not benchmarks |\n\n## Where QuickPose wins\n\nThis section exists because it is earned, not because a checklist demanded it.\n\n**Native integration, all the way down.** QuickPose's modules bundle the MediaPipe libraries and run inside your app process. You own the camera session, the skeleton overlay and every pixel of UI. For exact visual control or an in-process camera pipeline, that is the tighter fit, a judgment grounded in what the repos show. KinesteX's Camera Component lets you build your own UI around its tracking, but on iOS it is a `createCameraView` call on the same kit that embeds the experience as a WebView; there is no in-process native mode in evidence.\n\n**Real fitness primitives without buying an experience.** This is not a bare MediaPipe wrapper. Range-of-motion measurement across five joint groups, counters for 20 named exercises and feedback events for body position and out-of-frame limbs are a meaningful head start for a team that wants to keep its own product identity. It also reaches slightly older Android phones: API 26 for the SDK, against KinesteX's Android 9 (API 28).\n\n**A published price list, a lower price and a self-serve start.** QuickPose publishes every SDK plan, device limit and support level, from a free tier for 10 monthly active devices and $25 a month for 100 to $1,000 a month for 100,000, and its key is a free signup. KinesteX publishes no figures on its website, and the $1,500 monthly minimum in its seed deck is 60 times QuickPose's Builder plan. The units differ (devices against users) and QuickPose leaves the product to you, so it is not like for like, but for a developer evaluating this afternoon or a founder budgeting this week, it is decisive. [QuickPose pricing](/pricing/quickpose-pricing) sets out the plans.\n\n**Public traction and worked examples.** The iOS SDK repository had 327 stars when we checked, and the org publishes runnable demo apps, among them FitCount, a squat counter, a push-up rep counter, a biomechanics demo and BikeVision, with new iOS and Android demo apps updated in September 2026. You can read exactly how the integration feels before committing.\n\n## Where KinesteX wins\n\n**Platform coverage, including the web.** Public repos and SDKs across Swift, Kotlin, Flutter, React Native, React (TypeScript) and an HTML and JavaScript iframe, all wrapping the same hosted experience, with current packages on npm and pub.dev. QuickPose's SDK pages list iOS, Android and React Native, and we found no public QuickPose Flutter or web package.\n\n**The product in the box.** KinesteX's docs document AI Trainer Chat, prebuilt workout, plan, challenge and leaderboard views, motion games, an Admin Workout Editor, content APIs and rep-level analytics events, in 19 languages per its FAQ. A team using QuickPose builds all of that; a team using KinesteX configures it. KinesteX's SDK integration page puts the ready-made route at \"1 week or less\" with one developer, and its FAQ says integration \"typically takes under a day\". For a white-label coaching product on a deadline, that is the whole argument.\n\n**An assessment layer.** The documented movement assessments, with risk-level outputs, target health and screening use cases that QuickPose's repos do not address.\n\n**Server-side updates.** Because the experience is hosted, content and experience changes do not require app-store releases on every platform. The flip side is the next section; this is a bet, not a free lunch.\n\n## The trade-off neither vendor states this plainly\n\nJudgment, clearly labeled: native SDK versus WebView embed is the real decision on this page, and each choice costs something. Native (QuickPose) feels tighter because it is tighter, with in-process inference, your rendering and your UX, and in exchange you build and maintain the product per platform. A WebView or iframe surface (KinesteX) ships everywhere at once and evolves without app releases, and in exchange the embedded experience is the vendor's experience: customization runs through their theming, app-to-experience communication crosses a `postMessage` bridge, and the Android integration asks for the `INTERNET` permission.\n\nTwo cautions on claims you will meet. KinesteX's SDK READMEs say \"optional edge processing (no cloud transmission)\", while its security page says \"All camera and vision processing stays on-device\" and that its cloud delivers content and AI models, and its SDK integration page adds that the AI Personal Trainer chat needs internet; the lines are not the same promise, so get the behavior of your configuration in writing. Symmetrically, do not read QuickPose's Apache-2.0 iOS license as \"fully open source\": the SDK is keyed, and QuickPose's terms say its use may be subject to fees.\n\n## What we could not verify, for both vendors\n\n- **Accuracy.** No independent accuracy benchmark compares these products. KinesteX's README line (\"consistently exceed 90% accuracy\") and its FAQ figure (\"97.2% accuracy\") are the vendor's own claims, and they do not agree with each other. QuickPose publishes no accuracy figure in its repos.\n- **KinesteX prices.** The FAQ describes the model but kinestex.com publishes no figure; the $1.50 per MAU and $1,500 monthly minimum come from an investor deck, not a rate card, so confirm them with KinesteX.\n- **QuickPose on the web.** Its GitHub org and SDK pages list iOS, Android and React Native SDKs; we found no public web package or documentation for one.\n- **KinesteX's own counts.** Its home page says 500+ AI exercises and 19 languages; its seed deck says 550+ exercises and 17 languages.\n- **License files.** QuickPose's Android repo and KinesteX's Flutter, SwiftUI-kit and PWA repos carry no LICENSE file, and neither vendor's commercial terms for its hosted or keyed service are in the repos.\n\n## Verdict\n\nOur verdict, from the company behind KinesteX: KinesteX is the overall pick in this comparison on four stated criteria, and QuickPose takes one of them outright.\n\n- **What ships in the box and time to a working integration: KinesteX.** AI Trainer Chat, ready-made views, games, an Admin Workout Editor, content APIs, assessments and 19 languages, with integration put at under a day. QuickPose ships primitives and leaves the product to you.\n- **Platform breadth: KinesteX.** Six integration paths including Flutter and the web, against iOS, Android and React Native.\n- **Price: QuickPose.** Both name a number, and QuickPose's published plans, free for 10 devices and $25 a month for 100, sit far below the $1,500 monthly minimum in KinesteX's seed deck.\n- **Maintenance: even.** QuickPose's three SDK repos and its React Native plugin 0.7.2 moved on November 2, 2026; KinesteX's AI-Kit, Kotlin and Swift repos on November 5 and kinestex-sdk-react-native 1.5.0 on October 19.\n\nThe verdict flips to QuickPose when you want building blocks inside your own UI on iOS, Android or React Native, a start at $25 a month (or free for up to 10 devices), or in-process MediaPipe with a free key today.\n\n## Which should you pick?\n\n- **Native integration, your own UX and content, on iOS, Android or React Native** → QuickPose is the honest lean. Pair it with our guides to [adding rep counting](/guides/add-rep-counting) and [form feedback](/guides/add-form-feedback), and check [Apple's Vision body pose](/motion/apple-vision-body-pose) first so you know what the platform already gives you before paying for a wrapper's conveniences.\n- **A cross-platform white-label coaching experience on a deadline, or a web surface** → KinesteX. One hosted experience across Swift, Kotlin, Flutter, React Native, React and the web is what its docs and repos demonstrate.\n- **You need the smallest possible number in a budget before any call** → QuickPose, whose SDK pricing page lists every plan; KinesteX's only figure is the deck's.\n- **You want neither** → [QuickPose alternatives](/alternatives/quickpose-alternatives) and [KinesteX alternatives](/alternatives/kinestex-alternatives) map the wider field with the same disclosure, and [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) compares the category.\n- **You suspect you should build on raw models instead** → run the numbers in [build vs buy](/motion/build-vs-buy-ai-motion-tracking) first; the pose model is the free part, and both of these products exist because everything above it is not.\n\nWhichever way you lean, re-verify against the repos and the vendors' own pages before you sign anything: both codebases moved within days of our check, and this page will age.",
    "related": [
      {
        "href": "/compare/kinestex-vs-sency",
        "label": "KinesteX vs Sency"
      },
      {
        "href": "/compare/kinestex-vs-mediapipe",
        "label": "KinesteX vs MediaPipe"
      },
      {
        "href": "/pricing/quickpose-pricing",
        "label": "QuickPose pricing"
      },
      {
        "href": "/alternatives/quickpose-alternatives",
        "label": "QuickPose alternatives"
      },
      {
        "href": "/alternatives/kinestex-alternatives",
        "label": "KinesteX alternatives — the vendor's own list"
      }
    ],
    "firstParty": true,
    "sources": [
      {
        "url": "https://github.com/quickpose/quickpose-ios-sdk",
        "checked": "2026-11-09",
        "note": "README description, features, modules, iOS 14.0, free SDK key, Apache-2.0"
      },
      {
        "url": "https://github.com/quickpose/quickpose-android-sdk",
        "checked": "2026-11-09",
        "note": "README, Android SDK 26, Maven artifacts, no LICENSE file"
      },
      {
        "url": "https://github.com/quickpose/quickpose-react-native-pose-estimation",
        "checked": "2026-11-09",
        "note": "React Native plugin README"
      },
      {
        "url": "https://www.npmjs.com/package/@quickpose/react-native",
        "checked": "2026-11-09",
        "note": "0.7.2 on 2026-11-02, MIT"
      },
      {
        "url": "https://github.com/quickpose",
        "checked": "2026-11-09",
        "note": "327 stars on the iOS SDK; iOS, Android and React Native repos updated Nov 2, 2026; demo apps (snapshot)"
      },
      {
        "url": "https://docs.quickpose.ai/docs/MobileSDK",
        "checked": "2026-11-09",
        "note": "min API 26, samples API 28 (snapshot)"
      },
      {
        "url": "https://quickpose.ai/sdk-pricing/",
        "checked": "2026-11-09",
        "note": "plans by monthly active device (snapshot)"
      },
      {
        "url": "https://quickpose.ai/products/android-sdk/",
        "checked": "2026-11-09",
        "note": "on-device inference, no frames sent to a server (snapshot)"
      },
      {
        "url": "https://quickpose.ai/products/ios-sdk/",
        "checked": "2026-11-09",
        "note": "on-device inference (snapshot)"
      },
      {
        "url": "https://quickpose.ai/terms-and-conditions/",
        "checked": "2026-11-09",
        "note": "Apache 2.0 license clause and fees (snapshot)"
      },
      {
        "url": "https://github.com/KinesteX",
        "checked": "2026-11-09",
        "note": "12 public repositories; AI-Kit, Kotlin and Swift updated Nov 5, 2026 (snapshot of the org repository listing)"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-11-09",
        "note": "WebView architecture"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-PWA",
        "checked": "2026-11-09",
        "note": "iframe and postMessage"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-Swift-Demo",
        "checked": "2026-11-09",
        "note": "camera component, data events"
      },
      {
        "url": "https://github.com/KinesteX/.github",
        "checked": "2026-11-09",
        "note": "assessments, risk levels, data payloads"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-11-09",
        "note": "features, optional edge processing line, Apache-2.0 LICENSE.txt"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-11-09",
        "note": "the 90% accuracy claim"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-11-09",
        "note": "1.5.0 on 2026-10-19"
      },
      {
        "url": "https://pub.dev/packages/kinestex_sdk_flutter",
        "checked": "2026-11-09",
        "note": "1.5.1 on 2026-07-04"
      },
      {
        "url": "https://www.kinestex.com/docs/getting-started",
        "checked": "2026-11-09",
        "note": "SDK list, AI Trainer Chat recommended, integrations, requirements, contact-form API key (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/installation",
        "checked": "2026-11-09",
        "note": "Kotlin SDK 2.5.0 and minSdk 28, react-native-webview, React TypeScript package, permissions (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/ai-trainer-chat",
        "checked": "2026-11-09",
        "note": "AI Trainer Chat flow; Sunset integrations (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/content-api-v2",
        "checked": "2026-11-09",
        "note": "content APIs at data.kinestex.com (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-11-09",
        "note": "integration time, 19 languages, pricing model and the 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/sdk-integration",
        "checked": "2026-11-09",
        "note": "timelines, API key on a booked call, camera and internet requirements (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/",
        "checked": "2026-11-09",
        "note": "500+ AI exercises and 19 languages (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-11-09",
        "note": "on-device processing and model delivery (snapshot)"
      },
      {
        "url": "https://kinestex-pitch.vercel.app/",
        "checked": "2026-11-09",
        "note": "KinesteX's public seed pitch deck: $1.50 per MAU, $1,500 monthly minimum, 550+ exercises, 17 languages (rendered in a browser)"
      }
    ]
  },
  {
    "slug": "kinestex-vs-mediapipe",
    "primaryQuery": "kinestex vs mediapipe",
    "h1": "KinesteX vs MediaPipe: Which Layer Do You Want to Own?",
    "metaTitle": "KinesteX vs MediaPipe: Build or Buy the Layer? (2026)",
    "metaDescription": "MediaPipe gives free keypoints; KinesteX sells the layer above. Our verdict, its criteria, and when to build instead. KinesteX funds this site.",
    "updated": "2026-11-09",
    "answer": "MediaPipe is a free, Apache-2.0 pose model that returns 33 landmarks per frame; KinesteX (this site's own product) sells the layer above them: an AI trainer, rep counting, form feedback, workout content and one integration for iOS, Android, React Native, Flutter and the web. For a team shipping a fitness or rehab feature, our verdict is KinesteX, on what ships in the box, time to integrate, platform breadth, a stated entry price ($1.50 per monthly active user with a $1,500 monthly minimum, from its seed deck; confirm with the vendor) and vendor maintenance. Build on MediaPipe instead when motion analysis is your core IP, you have computer-vision engineers, frames must never leave your own process, or you need exercise logic KinesteX's library does not cover.",
    "faqs": [
      {
        "q": "Does MediaPipe include rep counting or form feedback?",
        "a": "No. Pose Landmarker returns landmarks: 33 per frame, in image coordinates and in 3D world coordinates, each with visibility and presence. Google's model card lists fitness and repetition counting as an intended use, but the counting state machines, per-exercise form rules, feedback content and exercise library are yours to build. That gap between keypoints and a working fitness feature is what the KinesteX vs MediaPipe question is really about."
      },
      {
        "q": "Is KinesteX a native SDK or a WebView wrapper?",
        "a": "A wrapper around an embedded experience. KinesteX's SwiftUI kit README says it embeds the camera workout experience \"as a WebView\", the React Native SDK installs with react-native-webview, and the web integration is an iframe; events cross a postMessage bridge and an internet connection is required. That is how one implementation serves iOS, Android, React Native, Flutter and the web. You still get structured data: the Camera Component streams reps, holds and form events and, on request, pose landmarks."
      },
      {
        "q": "How much does KinesteX cost compared to free MediaPipe?",
        "a": "MediaPipe's framework and models are Apache-2.0 and free; you pay in engineering time. KinesteX's public seed deck states \"$1.50 per MAU. $1,500 monthly minimum.\" kinestex.com publishes no price list on the pages we read on November 9, 2026: its FAQ describes usage-based pricing per active user per month that falls as you scale, with integration fees that may apply. Treat the deck figure as an entry price to confirm with KinesteX in writing."
      },
      {
        "q": "Is KinesteX built on top of MediaPipe?",
        "a": "We could not verify it. Neither KinesteX's repositories nor its security page name the pose model inside its experience; the security page says only that pose estimation runs on the user's device and that its cloud delivers content and AI models. For this decision it matters little: KinesteX sells the interpretation, content and cross-platform layer, and MediaPipe gives you the keypoints."
      },
      {
        "q": "Can I start with KinesteX and migrate to my own MediaPipe pipeline later?",
        "a": "Yes, and it is a sane de-risking path: ship on the vendor layer while you validate the product, then bring tracking in-house if motion analysis becomes your core IP. Plan for a rewrite rather than a swap. KinesteX hands you events from an embedded experience, while a MediaPipe pipeline means owning camera plumbing, rep logic and content yourself, so little integration code carries over. The reverse move, from an in-house pipeline to a vendor SDK, is usually easier."
      }
    ],
    "cta": {
      "pitch": "The application layer is where camera fitness products win or lose. Get our developer notes when the motion SDKs or the free pose models actually change."
    },
    "body": "**KinesteX funds this site, and this page is written by the company behind KinesteX, one of the two names in its title.** So the sentence a dishonest version of this page would bury comes first: MediaPipe is free. Apache-2.0, no API key, no vendor. If motion analysis is your product and you have the team to build the application layer, you do not need KinesteX. Every KinesteX claim traces to its GitHub repositories, package registries, web pages and, for the one published price, its public seed deck; every MediaPipe claim to Google's Pose Landmarker page, model cards and repository docs. All of it was re-read on November 9, 2026. The verdict names this site's own product as the overall pick, on stated criteria, and names the cases where building on MediaPipe wins.\n\n## Not apples-to-apples, and that is the answer\n\nThe two sit at different layers of the stack. MediaPipe Pose Landmarker is a free pose-estimation primitive: Google's page describes a task to \"Track 33 3D full-body skeletal landmarks in image, video, or camera streams\", and landmarks are what it returns. KinesteX is a commercial application layer: it sells what you would otherwise build on top of keypoints.\n\nSo the useful question is which layer you want to own. The general version of that decision lives in our [build vs buy guide for AI motion tracking](/motion/build-vs-buy-ai-motion-tracking); this page is the named-vendor instance.\n\n## What each one actually is\n\n**MediaPipe Pose Landmarker** (BlazePose GHUM) is Google's on-device pose model. Its page says the task \"outputs body pose landmarks in image coordinates and in 3-dimensional world coordinates\", and its quickstart covers four targets: the web through the npm package `@mediapipe/tasks-vision` (its quickstart loads a WebAssembly build), Android through Gradle, iOS through Swift Package Manager, and Python through pip. The model card gives the rest: Lite (3 MB), Full (6 MB) and Heavy (26 MB) models, \"Optimized for on-device, real-time fitness applications\"; an output of 33 points, each with x, y, z, visibility and presence, where \"Z is not metric but up to scale\"; \"Fitness and repetition counting\" listed as an intended use; and the Apache License, Version 2.0. It also states the limits: the model \"Tracks only one person on scene if multiple present\", and people further than 14 feet or 4 meters from the camera are out of scope. The legacy pose doc adds world landmarks in meters, with the origin at the center between the hips. The Tasks API takes a `numPoses` option, set to 1 in every quickstart snippet on Google's page. Variant choice is in [the Pose Landmarker model guide](/motion/mediapipe-pose-landmarker-models), and MediaPipe against MoveNet in [pose estimation models compared](/motion/pose-estimation-models-compared).\n\n**KinesteX** (public repositories at [github.com/KinesteX](https://github.com/KinesteX)) calls itself a \"plug-and-play and custom AI motion analysis SDK\". What its pages and repositories show as of November 9, 2026:\n\n- **Platforms.** The docs' Getting Started page lists \"SDKs for Swift, Kotlin, Flutter, React Native and React (TypeScript), plus a plain HTML/JavaScript iframe integration for any web page or PWA\". Requirements: iOS 14.0+ with Xcode 16.3+, Android 9+ (API 28) and an internet connection. The install docs pin the Kotlin SDK at 2.5.0 from JitPack and say it \"needs minSdk 28 or higher\"; npm shows kinestex-sdk-react-native 1.5.0 published on October 19, 2026, and pub.dev shows kinestex_sdk_flutter 1.5.1 from July 4, 2026. The GitHub org listing shows the KinesteX-AI-Kit, KinesteX-SDK-Kotlin and KinesteX-SDK-Swift repositories updated on November 5, 2026, and the React Native repository on October 9, 2026.\n- **Integration surface.** The SwiftUI kit's README says it \"embeds KinesteX's AI-powered camera workout experience as a WebView\" (a `WKWebView` under the hood). React Native installs with `react-native-webview` as a peer dependency, the web integration is an iframe pointed at ai.kinestex.com, and the Android manifest in the install docs includes the `INTERNET` permission.\n- **What ships.** The docs recommend AI Trainer Chat for new integrations: \"a white-labeled AI personal trainer with onboarding, a camera fitness assessment, a workout generated for every session and next-session scheduling\". Beside it sit Plan, Workout, Challenge and Leaderboard views, AI Experiences (Balloon Pop, Color Chase and Alien Squat Shooter) and an embedded Admin Workout Editor. The older Complete UX (Main) and Personalized Plan View integrations are marked \"Sunset\" in the docs sidebar. The FAQ lists 19 languages, the home page counts \"500+\" AI exercises, and movement tests such as Timed Up and Go, sit-to-stand and functional reach return a low, moderate or high risk level for balance and reach.\n- **Build-your-own pieces.** A Custom Workout, which can also run as a scored assessment; a Camera Component that \"streams real-time motion events (reps, holds, form feedback, presence, activity, plus opt-in form state and framing hints) and, on request, pose landmarks\"; and Content APIs at `data.kinestex.com` for exercises, workouts and plans, authenticated with an `x-api-key` header. The data-points docs say a typical 10-exercise workout sends about 30 events carrying 300 or more data values.\n- **Commercials.** An API key is required. The docs say to get demo access and a key through the contact form, and the SDK-integration page says the key comes when you book a call. kinestex.com publishes no price list on the pages we read: its FAQ describes \"usage-based plans\", a per-active-user-per-month price that falls as you scale, and integration fees that \"may apply\". The one published figure, priced per monthly active user (MAU), is in KinesteX's public seed deck: \"$1.50 per MAU. $1,500 monthly minimum.\" Treat it as a stated entry price to confirm with the vendor in writing.\n\nOne honesty note on accuracy. KinesteX's FAQ and home page claim 97.2% accuracy, and an older README says its models \"consistently exceed 90% accuracy\". Those are first-party marketing claims, they do not agree with each other, and no independent benchmark compares KinesteX with MediaPipe. Neither number plays any part in the verdict.\n\n## Layer by layer\n\n| Layer | MediaPipe (build) | KinesteX (buy) |\n|---|---|---|\n| Keypoints | 33 landmarks per frame, yours to consume raw | Inside the embed; the Camera Component streams interpreted events and, on request, pose landmarks |\n| Interpretation (reps, form, mistakes) | You build all of it | Ships: reps, holds, named mistakes, per-rep accuracy, calories, scores |\n| Content and experiences | You build or license it | Ships: AI Trainer Chat, plan, workout, challenge and leaderboard views, games, movement tests, Content API, admin panel |\n| Platforms | Web, Android, iOS and Python packages; you build each app's camera pipeline | Swift, Kotlin, React Native, Flutter, React TypeScript and an HTML/JS iframe, around one hosted experience |\n| Runtime | In-process, on-device inference | WebView or iframe with an internet connection; the security page says camera and vision processing stays on-device |\n| Cost | Free, Apache-2.0; you pay in engineering time | Seed deck: $1.50 per monthly active user, $1,500 monthly minimum; no price list on kinestex.com |\n| Maintenance | You: camera pipelines, model choice, device edge cases | Vendor: \"We maintain everything we build\"; you update a thin wrapper |\n\n## What MediaPipe actually leaves you to build\n\nOur engineering judgment of what parity with a fitness SDK requires on top of raw keypoints; it is scope, not a knock on the free model:\n\n1. **Exercise definitions and form logic**: per-exercise joint-angle rules, phase and hold detection, per camera angle.\n2. **Rep-counting state machines**: debouncing, partial-rep rejection, tempo.\n3. **Mistake detection and feedback content**: mapping deviations to corrections, audio cues, translations.\n4. **Calibration and framing UX**: person-in-frame checks and distance guidance (the BlazePose card puts people beyond 4 meters out of scope), camera selection, orientation.\n5. **Content**: an exercise library, workout and plan structures, progression. This is what KinesteX ships as views plus a Content API.\n6. **Analytics plumbing**: session summaries, per-rep accuracy, engagement events.\n7. **Cross-device robustness**: variant selection, thermals and frame rate, lighting and clothing edge cases, and a camera pipeline per platform (our [camera pose tracking guide](/guides/camera-pose-tracking) covers this layer).\n\nNone of this is exotic; all of it is ongoing work a team must staff, which is the real price of \"free\".\n\n## The WebView question, stated fairly\n\nKinesteX's SDKs embed a hosted experience in a WebView or iframe; a MediaPipe pipeline runs in your own process.\n\n**What the embed costs you.** You do not control the camera pipeline or the rendering: customization is white-label theming in KinesteX's admin panel, or your own screens around the Camera Component. The app needs an internet connection; the getting-started requirements list one, and the SDK-integration page says \"The AI Personal Trainer chat needs internet\". New exercises are not self-serve: \"New exercises are added together with our team, because each movement needs its own tracking.\" And KinesteX's own privacy wording is not uniform. The Kotlin, Flutter and React Native READMEs say \"optional edge processing (no cloud transmission)\", while the security page says \"All camera and vision processing stays on-device\" and the SDK-integration page says the camera video \"never leaves it and is not stored\". Get your configuration's behavior in writing.\n\n**What the embed buys you.** One vendor implementation serving six integration targets, the web included, which is why \"cross-platform without six codebases\" is credible here. And a tracking pipeline and exercise library the vendor maintains (its integration page lists \"Maintains the technology: tracking, the exercise library and updates\" as KinesteX's job) without you shipping app releases for each change.\n\n**In-process MediaPipe is the mirror image**: full control of the camera, frames that never leave your process and no per-user fee, plus ownership of every platform's camera stack for as long as the product lives.\n\n## When building on MediaPipe clearly wins\n\nThis is often the right call, and we mean it:\n\n- **Motion analysis is your core IP.** If your edge is novel exercise logic or thresholds you must own and audit, you cannot rent the layer that makes you different.\n- **You have computer-vision engineers.** The build list above is a roadmap, not a wall, for a team that has shipped camera pipelines before.\n- **Frames must never leave your own process.** An embed is a vendor's code running inside your app; with MediaPipe you can show where every frame goes.\n- **You need exercise logic the vendor's library does not cover.** KinesteX adds new movements with its own team. If your catalog is unusual, building may be faster.\n- **Zero per-user cost at scale.** A structural advantage no commercial SDK can match, if you count the engineering cost honestly.\n\nIf most of those describe you, start with the [Pose Landmarker model guide](/motion/mediapipe-pose-landmarker-models).\n\n## When buying the KinesteX layer wins\n\n- **Time to a working integration.** KinesteX's FAQ says integration \"typically takes under a day\", and its SDK-integration page puts the whole project at 1 week or less for Ready-made Experiences, 2 to 3 weeks for the Guided Workout Experience and about a month when you build every screen. Those are the vendor's figures; the build list above is quarters of work, in our judgment.\n- **What ships in the box.** An AI trainer, plans, challenges, leaderboards, games, movement tests with risk levels, a Content API, an admin panel and 19 languages exist on day one. Content is the slowest thing to build well.\n- **No computer-vision team required.** You consume interpreted events, and landmarks when you ask for them, on iOS, Android, React Native, Flutter and the web.\n\n## What we could not verify\n\n- **The deck price as a contract term.** The $1.50 per monthly active user and $1,500 monthly minimum come from a fundraising deck, not a price list; kinestex.com publishes none on the pages we read, and its FAQ says integration fees may apply. Confirm with the vendor.\n- **Exercise and language counts.** KinesteX's site says 500+ exercises and 19 languages; its deck says \"550+ exercises built in\" and, on its competition slide, 17 languages. We report both.\n- **What pose model KinesteX runs internally.** Neither the repositories nor the security page name it. Do not assume it is, or is not, MediaPipe.\n- **MediaPipe with several people in frame.** The `numPoses` option exists, but Google's card describes and evaluates one person.\n\n## Verdict\n\nFor a team shipping a fitness or rehab feature inside its own app, our verdict is KinesteX, this site's own product, on four criteria the page sources. **What ships and how fast:** AI Trainer Chat, plan, workout, challenge and leaderboard views, movement tests, a Content API and an admin panel come ready-made, and KinesteX's own pages put integration at under a day and a ready-made launch at a week or less, where MediaPipe gives you landmarks and the seven-item build list above. **Platform breadth:** one integration covers Swift, Kotlin, React Native, Flutter, React TypeScript and the web through an iframe; MediaPipe ships separate web, Android, iOS and Python packages, and each app's camera pipeline is yours to write. **Price:** MediaPipe's license costs nothing and its cost is engineering time; KinesteX states an entry price in its seed deck, $1.50 per monthly active user with a $1,500 monthly minimum, which you can weigh against the salaries the build list implies (confirm the figure with KinesteX). **Maintenance:** KinesteX says \"We maintain everything we build\", its Kotlin, Swift and SwiftUI-kit repositories were updated on November 5, 2026, and React Native 1.5.0 shipped on October 19, 2026.\n\nIt flips to building on MediaPipe when motion analysis is your core IP, when you have computer-vision engineers to own it, when frames must never leave your own process, or when you need custom exercise logic KinesteX's library does not cover. If you are unsure, buying first and planning a later in-house pipeline is a sane path; the economics are in the [build vs buy guide](/motion/build-vs-buy-ai-motion-tracking), and the wider field is in [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) and [KinesteX vs competitors](/compare/kinestex-vs-competitors).",
    "related": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "MediaPipe vs MoveNet, head to head"
      },
      {
        "href": "/motion/build-vs-buy-ai-motion-tracking",
        "label": "Build vs buy AI motion tracking"
      },
      {
        "href": "/compare/kinestex-vs-competitors",
        "label": "KinesteX vs competitors"
      },
      {
        "href": "/compare/kinestex-vs-quickpose",
        "label": "KinesteX vs QuickPose"
      },
      {
        "href": "/alternatives/mediapipe-alternatives",
        "label": "MediaPipe alternatives"
      },
      {
        "href": "/alternatives/kinestex-alternatives",
        "label": "KinesteX alternatives, the vendor's own list"
      }
    ],
    "firstParty": true,
    "sources": [
      {
        "url": "https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker",
        "checked": "2026-11-09",
        "note": "33 3D landmarks, image and world coordinates, web npm, Android, iOS and Python quickstarts, numPoses 1"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-11-09",
        "note": "model sizes, 33x5 output, z up to scale, fitness use, one person, 4 m limit, Apache-2.0"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/pose.md",
        "checked": "2026-11-09",
        "note": "world landmarks in meters from the hip center; legacy solution upgraded May 2023"
      },
      {
        "url": "https://www.kinestex.com/docs/getting-started",
        "checked": "2026-11-09",
        "note": "platforms, AI Trainer Chat recommended, views, Camera Component landmarks on request, requirements, contact-form key"
      },
      {
        "url": "https://www.kinestex.com/docs/installation",
        "checked": "2026-11-09",
        "note": "Kotlin 2.5.0 minSdk 28, react-native-webview peer, iframe, permissions, INTERNET"
      },
      {
        "url": "https://www.kinestex.com/docs/ai-trainer-chat",
        "checked": "2026-11-09",
        "note": "Complete UX (Main) and Personalized Plan View marked Sunset; trainer requirements"
      },
      {
        "url": "https://www.kinestex.com/docs/content-api-v2",
        "checked": "2026-11-09",
        "note": "Content API at data.kinestex.com, x-api-key"
      },
      {
        "url": "https://www.kinestex.com/docs/data-points",
        "checked": "2026-11-09",
        "note": "about 30 events and 300+ data values per workout; assessment types"
      },
      {
        "url": "https://www.kinestex.com/",
        "checked": "2026-11-09",
        "note": "500+ exercises, 19 languages, movement tests and risk levels, 97.2% claim"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-11-09",
        "note": "integration under a day, 19 languages, pricing model, 97.2% claim"
      },
      {
        "url": "https://www.kinestex.com/product/sdk-integration",
        "checked": "2026-11-09",
        "note": "three ways in and timelines, API key on a call, maintenance, internet for the trainer, new exercises with KinesteX's team"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-11-09",
        "note": "on-device processing, cloud delivers content and AI models"
      },
      {
        "url": "https://kinestex-pitch.vercel.app/",
        "checked": "2026-11-09",
        "note": "seed deck: $1.50 per MAU, $1,500 monthly minimum; 550+ exercises; 17 languages on the competition slide"
      },
      {
        "url": "https://github.com/orgs/KinesteX/repositories",
        "checked": "2026-11-09",
        "note": "AI Kit, Kotlin and Swift updated Nov 5, 2026; React Native Oct 9, 2026"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-11-09",
        "note": "WebView architecture, WKWebView"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-11-09",
        "note": "category term, optional edge processing line"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-PWA",
        "checked": "2026-11-09",
        "note": "postMessage communication"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-11-09",
        "note": "the 90% accuracy claim"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-11-09",
        "note": "1.5.0 on 2026-10-19, Apache-2.0"
      },
      {
        "url": "https://pub.dev/packages/kinestex_sdk_flutter",
        "checked": "2026-11-09",
        "note": "1.5.1 on 2026-07-04"
      }
    ]
  },
  {
    "slug": "apple-watch-vs-whoop",
    "primaryQuery": "apple watch vs whoop api",
    "h1": "Apple Watch vs WHOOP: Which for Your App?",
    "metaTitle": "Apple Watch vs WHOOP API: On-Device HealthKit vs Cloud OAuth",
    "metaDescription": "Apple Watch data is read on-device through HealthKit in your own app; WHOOP is a cloud OAuth API with webhooks and a 10-member Sandbox. Which fits?",
    "updated": "2026-08-11",
    "answer": "Pick Apple Watch when your product is an iOS or watchOS app: Apple documents HealthKit as a store the user's own device holds locally, so you read it inside an app you ship and sync it to your backend yourself, with no vendor account, no quota, and no approval queue for the data. Pick WHOOP when your backend needs to reach a consenting user on any platform without their phone in hand, using OAuth 2.0 with scoped tokens and v2 webhooks that push sleep, recovery, and workout events to you. These are opposite architectures rather than competing products: Apple gives you sensor-level access and no counterparty but iOS-only reach, an App Store review, and a sync you build; WHOOP gives you server-side reach and event push but a paid-membership dependency on both the developer and every end user, plus a Sandbox tier that caps a new app at 10 members until WHOOP approves the next tier. As of 2026, verify both sides against the current docs.",
    "faqs": [
      {
        "q": "Do I need to build a watchOS app to use Apple Watch data?",
        "a": "Not always. An iPhone app alone can read what the watch has already written into HealthKit, since Apple describes HealthKit as a central repository shared across iPhone and Apple Watch. You need your own watchOS app when you want to act during the activity — Apple documents HKWorkoutSession as fine-tuning the watch's sensors for the chosen activity and generating high-frequency heart rate samples, which is what live coaching or in-workout haptics require. Either way you are shipping an app, which is the structural difference from WHOOP's server-to-server API."
      },
      {
        "q": "How does HealthKit background delivery compare with WHOOP webhooks?",
        "a": "They point in opposite directions. WHOOP pushes v2 webhook events for sleep, recovery, and workouts straight to an endpoint you control, so your backend learns about new data without asking. On Apple, nothing is pushed to your servers: your app observes the local store with HKObserverQuery and enableBackgroundDelivery, then forwards data itself, and Apple documents system limits including an hourly maximum frequency for some types and, on watchOS, four updates per hour shared with background refresh. Verify the current limits in Apple's docs."
      },
      {
        "q": "Which is harder to clear, App Review or WHOOP app approval?",
        "a": "They gate different things, so budget for both rather than ranking them. WHOOP's cap is on users: every new app starts on a Sandbox tier of up to 10 WHOOP members, where you can build and test without submitting a request, so the gate blocks scale rather than development; each tier above it needs a reviewed request. Apple's gate is on distribution: nothing reaches users until the app passes App Review, and Apple's own HealthKit setup guidance warns that App Review may reject apps that enable capabilities they do not actually use. Apple's gate is earlier; WHOOP's is the one that stops growth."
      },
      {
        "q": "What does each option cost the person wearing the device?",
        "a": "An Apple Watch is a one-time hardware purchase, and no recurring payment to Apple is required for your app to read the data the watch records. WHOOP sells the hardware as a recurring membership, so every end user of your integration is an ongoing subscriber and their data only flows while that membership is active. No figure is printed here because WHOOP has restructured its membership recently — confirm the current terms on WHOOP's own pricing page before you model your addressable market."
      },
      {
        "q": "Should I support Apple Watch and WHOOP at the same time?",
        "a": "You can, but understand that it is two unrelated builds rather than two API clients: an on-device HealthKit reader inside a native app plus a server-side OAuth and webhook consumer that shares no code, no auth model, and no data-freshness behavior with it. Teams that want both, plus other wearables, usually reach for a cross-device aggregator that normalizes the on-device and cloud sources behind one interface. Weigh that against maintaining both integrations yourself."
      }
    ],
    "related": [
      {
        "href": "/compare/oura-vs-whoop",
        "label": "Oura vs WHOOP"
      },
      {
        "href": "/compare/fitbit-vs-apple-watch",
        "label": "Fitbit vs Apple Watch"
      },
      {
        "href": "/integrate/whoop-api",
        "label": "WHOOP API integration guide"
      },
      {
        "href": "/pricing/whoop-api-pricing",
        "label": "WHOOP API pricing"
      }
    ],
    "cta": {
      "pitch": "On-device platforms and vendor cloud APIs break in completely different ways — we track entitlement changes, approval caps, and membership terms across the wearable APIs so your integration is not the last to find out."
    },
    "body": "Already picked WHOOP and need the developer side? The [WHOOP API developer integration guide](/integrate/whoop-api) walks through the membership WHOOP requires, app registration, OAuth scopes, token exchange, webhooks and the member cap. This page compares the two platforms you might build on.\n\n## Two opposite integration architectures\n\nChoosing between these two is really choosing between **a platform you build on** and **a vendor you integrate with**. The wrist hardware matters far less than that split.\n\nBuilding on Apple Watch means you never call Apple. Apple documents HealthKit as \"a central repository for health and fitness data on iPhone and Apple Watch,\" and its privacy guidance says plainly that \"the user's device stores all HealthKit data locally\" and that \"the device encrypts the HealthKit store when the user locks the device.\" There is no endpoint to hit, no client credential to rotate, and no vendor quota to negotiate, because there is no server on Apple's side of the relationship at all. Your code runs on the user's own hardware, inside an app you ship and maintain — and, if you want, on the watch itself: Apple documents HKWorkoutSession as a session that \"fine-tunes Apple Watch's sensors for the specified activity\" and notes that \"all workout sessions generate high-frequency heart rate samples.\" What you inherit in place of an API contract is Apple's platform rulebook — the HealthKit capability, usage-description strings, App Review before anyone can install the thing, and a per-type permission prompt whose outcome you cannot fully inspect.\n\nBuilding on WHOOP is the mirror image: you never touch the device, and every part of the integration is a vendor relationship. You register on the WHOOP Developer Platform, run `OAuth 2.0` authorization-code with scoped tokens, and subscribe to v2 webhooks — sleep, recovery, and workout events — that push into your backend. There is no documented per-call fee, but there are gates. WHOOP requires developers to hold an active membership and a device, every end user needs an active membership for their data to exist for you at all, and every new app starts on WHOOP's Sandbox tier, which allows up to 10 WHOOP members; connecting more needs a reviewed request for each tier above it.\n\nNeither list of constraints is a knock on either company. A platform with no cloud API and a vendor with an approval queue are both making a defensible choice about who holds health data; they just hand you very different engineering problems. To line up the same access questions for any other pair, [the side-by-side API comparison](/compare-apis) shows how each product bills developers, what users must own and what approval stands before launch.\n\n## Apple Watch vs WHOOP at a glance\n\n| Dimension | Apple Watch (via HealthKit) | WHOOP |\n|---|---|---|\n| Integration model | Platform framework on the user's device; no vendor account, no API contract with Apple for the data itself | Vendor cloud API; register an app on the WHOOP Developer Platform |\n| Where your code runs | Inside your iOS app, and optionally a watchOS app on the watch | On your own backend, server-to-server, any language or host |\n| Auth | Per-data-type on-device permission prompt; no tokens to store. Apple: \"your app doesn't know whether someone granted or denied permission to read data from HealthKit\" | `OAuth 2.0` authorization code with scoped tokens; rotating refresh tokens, where each refresh invalidates the prior one |\n| Freshness | Pull model you drive: `HKObserverQuery` plus `enableBackgroundDelivery`, with `HKAnchoredObjectQuery` anchors for incremental sync. Apple documents an hourly maximum frequency for some types, and on watchOS a budget of four updates per hour shared with background refresh | Push model the vendor drives: v2 webhooks for sleep, recovery, and workout events land on your endpoint |\n| End-user cost | Buys an Apple Watch (and an iPhone) once; no recurring fee is required for your app to read the data | Hardware is sold as a recurring membership — every active user is a paying member. Model, not price: verify current terms |\n| Approval gate | App Review before distribution, plus the HealthKit capability and, for background delivery on iOS 15 and watchOS 8 and later, the background-delivery entitlement | Developer Platform registration; the developer needs their own membership and device; a 10-member Sandbox tier until WHOOP approves a request for the next tier |\n| Cross-platform reach | iOS and watchOS only — Apple's setup guidance notes HealthKit is unavailable on iPadOS 16 or earlier and on macOS. No Android, no web | Any platform. Once a user consents, your servers pull without the user's phone in hand |\n| Shape of the data | Whatever the user's Health store holds, written by any app or device — `HKWorkout` summarizes duration, total distance and total energy burned and acts as a container for associated samples; HRV is exposed as `heartRateVariabilitySDNN` | A recovery, strain, and sleep model from one vendor's own sensors, consistent across every member |\n\nNo WHOOP price appears in that table on purpose. WHOOP has restructured its membership recently, so describe the model to your stakeholders and pull the current figure from WHOOP's own pricing page — the [WHOOP API pricing breakdown](/pricing/whoop-api-pricing) explains which costs land on you and which land on your users.\n\n## Where Apple Watch wins\n\n**No vendor sits between you and the data.** There is no key to apply for, no rate limit to design around, no partner queue, and no membership your users must keep paying. If the person owns the watch and taps allow, the samples are there. For a team that has been burned by an API program changing its terms, that absence of a counterparty is the whole pitch.\n\n**You can put code on the device during the workout.** Shipping a watchOS app and driving `HKWorkoutSession` is a capability a cloud API structurally cannot offer. Apple documents the session as fine-tuning the watch's sensors for the chosen activity — an outdoor cycling session generates accurate location data where an indoor one does not — and states that all workout sessions generate high-frequency heart rate samples. Live in-workout coaching, real-time form or pace feedback, and haptics on the wrist all live here, not in a webhook that arrives after the fact.\n\n**You get the whole store, not one brand's metrics.** Because HealthKit is a shared repository, your app also sees what other apps and devices wrote into it. Apple describes observer queries as the way to \"respond to changes made by other apps and devices,\" so a user who logs weight in one app and runs in another still shows up in yours.\n\n**A defensible privacy story.** Local storage, encryption at lock, and Apple's own rules — you \"can't sell information gained through HealthKit to advertising platforms, data brokers, or information resellers,\" and you may not use it for advertising — give a health product something concrete to tell users and reviewers.\n\n**The honest trade-off.** You are signing up to build and ship an app, forever. Reach is iOS and watchOS only. Background reads can fail while the device is locked, because the store is encrypted then. Your app cannot distinguish \"granted\" from \"denied\" on reads — Apple says the only state you can positively identify is limited authorization — so your empty-state UX has to work without knowing why it is empty. Background delivery is metered by the system rather than by you, and on iOS 15 and watchOS 8 or later it needs the background-delivery entitlement or the call fails with an authorization error. And the sync from device to your servers is entirely your code. For the mechanics of permissions, queries, and the sync you will be writing, see the [Apple HealthKit integration guide](/integrate/healthkit).\n\n## Where WHOOP wins\n\n**Your backend can just ask.** This is the decisive advantage. With a consented user's scoped token, your servers pull recovery, strain, and sleep whether or not that user has opened anything today, from any host, in any language. A web dashboard with no mobile app, a nightly cohort job, an Android-first product, a Slack bot for a coaching team — none of those are buildable on Apple Watch data alone, and all of them are ordinary WHOOP integrations.\n\n**Events arrive instead of being fetched.** v2 webhooks for sleep, recovery, and workout events mean \"user finished a night of sleep\" is something WHOOP tells you, not something you poll for. On the Apple side the nearest equivalent is your own app waking under background delivery, subject to the system's frequency limits, then posting to your backend — more moving parts, and it only works while the app stays installed and permitted.\n\n**Every active user has complete data.** Because the hardware is sold as a subscription, an active WHOOP user is by definition a paying member, so the \"this user never subscribed, so half the fields are missing\" failure mode largely disappears. For a coaching product that needs a daily signal per user, that consistency is worth real money.\n\n**One opinionated model, uniformly applied.** Recovery, strain, and sleep come from one vendor's sensors and one pipeline, so cross-user comparisons are apples to apples. A HealthKit store, by contrast, is a pile of samples from whatever devices and apps that individual happens to use, and normalizing that is your problem.\n\n**The honest trade-off.** The membership dependency runs in both directions: you need an active membership and device to build, and each end user needs one for their data to reach you, which caps your addressable audience at current WHOOP subscribers. There is no per-call fee — WHOOP's API Terms of Use, effective October 6, 2026, say access is currently provided at no charge — but there is a tiered approval path: every new app starts on a Sandbox tier of 10 members, and each tier above it (100, 1,000, 5,000, then unlimited) needs a reviewed request. Rotating refresh tokens are the classic operational trap — each refresh invalidates the previous refresh token, so two workers refreshing the same user at once can knock each other out; serialize refreshes per user. The [WHOOP API integration guide](/integrate/whoop-api) covers the auth and webhook wiring, and [Oura vs WHOOP](/compare/oura-vs-whoop) is the better read if your real question is which subscription wearable to build on.\n\n## How to choose\n\nMatch the architecture to the product, not the device to the marketing:\n\n- **An iOS or watchOS app, especially one that coaches during the workout** — Apple Watch. Nothing in a cloud API reaches the sensors mid-session, and your users are already carrying the store you want to read.\n- **A web product, an Android app, or any backend that must work without the user present** — WHOOP. It is the only one of the two your servers can call.\n- **You want new sleep or recovery data to trigger something on your side** — WHOOP webhooks are a push you subscribe to; the Apple equivalent is your own app waking under system-metered background delivery and forwarding the data itself.\n- **Your users should not be paying anyone a monthly fee to use your app** — Apple Watch. The hardware is a one-time purchase; WHOOP's model makes every user of your integration a subscriber.\n- **You need consistent, comparable, complete data for every user** — WHOOP. A HealthKit store's contents depend on which apps and devices that individual uses.\n- **You are launching to more than a handful of users soon** — price in both gates. WHOOP's 10-member Sandbox cap lifts only when WHOOP approves a request for the next tier; an Apple Watch app has to clear App Review, and Apple's own setup guidance warns that App Review may reject apps enabling capabilities they do not actually use.\n- **You want both, plus everything else on the market** — neither first-party route covers it, and building two integrations with nothing in common (an on-device Swift sync and a server-side OAuth consumer) is exactly the work an aggregator exists to remove. [Fitbit vs Apple Watch](/compare/fitbit-vs-apple-watch) walks the same cloud-versus-device split with a different cloud vendor on the other side.\n\n## Watch the fine print\n\nThe Apple specifics above are documented behavior and change slowly, but they do change: confirm the current background-delivery frequencies, entitlement requirements, platform availability, and type identifiers in Apple's own HealthKit documentation before you design around them. The WHOOP specifics are the volatile half. Membership structure has been restructured recently, so no price appears on this page; the 10-member Sandbox cap, the current webhook event names, and the developer-membership requirement should all be re-checked against WHOOP's own developer documentation. Everything here is as of 2026 — verify."
  },
  {
    "slug": "apple-watch-vs-garmin",
    "primaryQuery": "apple watch vs garmin api",
    "h1": "Apple Watch vs Garmin: Which Should You Build On?",
    "metaTitle": "Apple Watch vs Garmin: On-Device vs Partner API",
    "metaDescription": "Apple Watch means HealthKit on-device with no vendor account; Garmin means an approval-gated partner API pushing to your server. Which fits your build?",
    "updated": "2026-08-12",
    "answer": "Pick Apple Watch when you can ship an iOS or watchOS app: Apple documents HealthKit as a repository the user's own device stores locally, so you read it inside your app with no vendor account, no credential to rotate and no approval queue for the data itself. Pick Garmin when your backend must receive data server-side without the user present, through the Connect Developer Program's Health and Activity APIs, which push summaries to callback URLs you register instead of letting you poll. The catch is getting in: Garmin's program needs Garmin's approval, which since October 2026 comes as Starter and Enterprise Access. Unusually for this category, the user-cost axis is a tie here, since both are one-time hardware purchases with no membership required for the data to flow; the real split is that Apple gates distribution through App Review while Garmin gates access itself. Verify both against current docs.",
    "faqs": [
      {
        "q": "Can I read Garmin data through Apple HealthKit instead of Garmin's API?",
        "a": "Sometimes, and it is a genuine workaround while the Garmin program is gated. HealthKit is a shared repository, so if a user's Garmin data has synced into Apple Health on their iPhone, your app can read it on-device without any Garmin credential. It is not equivalent to the partner API: you get only what reached that one user's store, only on iOS, and only while your app stays installed and permitted. Garmin activities that re-sync into Strava, and user-uploaded FIT files, are the other indirect routes."
      },
      {
        "q": "Does building for Apple Watch need any vendor approval the way Garmin does?",
        "a": "Both have a gate, but they block different things. Apple gates distribution: you need a paid Apple Developer account to enable the HealthKit capability, and nothing reaches users until the app passes App Review, which scrutinizes whether your usage-description strings are honest and whether you actually use the data you request. Garmin gates access itself, through a review of your application with no self-serve key, and its FAQ now describes that access as Starter or Enterprise Access. Apple's gate turns on how honestly you use the data; Garmin's turns on whether you qualify for the program at all."
      },
      {
        "q": "Which reaches my backend sooner, a Garmin push callback or a HealthKit sync?",
        "a": "Garmin, structurally. Once a user's device syncs, Garmin POSTs to callback URLs you registered per summary type, either as a Ping notification carrying a callbackURL you then fetch or as a Push with the full JSON inline. On Apple nothing is pushed to your servers at all: your app observes the local store with HKObserverQuery and enableBackgroundDelivery and forwards the data itself, subject to system limits that Apple documents as an hourly maximum for some types and four updates per hour on watchOS shared with background refresh. Verify the current limits in Apple's docs."
      },
      {
        "q": "Do Apple Watch and Garmin owners pay a recurring fee for their data?",
        "a": "No on both sides, which makes this pair unusual. An Apple Watch and iPhone are one-time hardware purchases and no recurring payment to Apple is required for your app to read what the watch records. A Garmin device is likewise bought outright, with no separate consumer subscription required for basic Garmin Connect use as of 2026 (verify current terms). The recurring-cost question in this comparison lands on the developer side instead, where Garmin's pages state no price for Starter Access and say Enterprise commercial terms are tailored, and Apple charges no API fee at all."
      },
      {
        "q": "Should I support both Apple Watch and Garmin in a single app?",
        "a": "You can, but budget for two unrelated builds rather than two API clients. One is an on-device HealthKit reader inside a native iOS app with its own sync code; the other is a server-side OAuth 2.0 PKCE consumer with registered webhook callbacks, sharing no auth model, no delivery behavior and no code with the first. Garmin also has to approve you before the second exists. Teams that want both, plus other wearables, usually reach for a health-data aggregator that already holds its own Garmin partnership and normalizes the on-device and cloud sources behind one interface."
      }
    ],
    "related": [
      {
        "href": "/compare/whoop-vs-garmin",
        "label": "WHOOP vs Garmin"
      },
      {
        "href": "/compare/strava-vs-garmin-connect",
        "label": "Strava vs Garmin"
      },
      {
        "href": "/fitness-apis/fitbit-api-vs-garmin-api",
        "label": "Fitbit API vs Garmin API"
      },
      {
        "href": "/pricing/garmin-api-pricing",
        "label": "Garmin API pricing"
      }
    ],
    "cta": {
      "pitch": "A partner program can close overnight and an on-device framework can retune its background budget — we track approval status, entitlement changes and delivery limits across the wearable APIs so your integration is not the last to find out."
    },
    "body": "## Two gates, and only one of them is yours to clear\n\nBoth of these strap a sensor to a wrist, and both charge the wearer once, up front, with nothing recurring required for the data to exist. Almost none of the engineering decision follows from that. It follows from a different split: **a platform you build on** versus **a partner API you apply for.**\n\nBuilding on Apple Watch means you never call Apple. Apple documents HealthKit as \"a central repository for health and fitness data on iPhone and Apple Watch,\" and its privacy guidance says plainly that \"the user's device stores all HealthKit data locally\" and that \"the device encrypts the HealthKit store when the user locks the device.\" There is no endpoint, no client credential to rotate, and no vendor quota to negotiate, because Apple runs no server on its side of this relationship. Your code runs on the user's own hardware inside an app you ship. What you inherit in place of an API contract is Apple's platform rulebook: the HealthKit capability, the `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` strings (call the authorization API without the matching key and the app crashes instead of showing a sheet), App Review before anyone can install the thing, and a permission prompt whose read outcome you cannot inspect.\n\nGarmin inverts all of it. The Connect Developer Program is **partner-approval-only**: you apply, and Garmin's team must approve a partnership before you receive any credentials. There is no self-serve key and there never was. Once you are in, current docs specify `OAuth 2.0` with PKCE producing a per-user `userAccessToken`, and you do not poll — you register HTTPS callback URLs per summary type and Garmin POSTs when a user's device syncs, either as a **Ping** notification carrying a `callbackURL` you then GET with that user's token, or as a **Push** with the full JSON inline. Good server-side architecture; the gate sits upstream of it. Garmin's program FAQ says that once your request is approved you get the Garmin Developer Portal, and since October 2026 access starts at Starter Access; the FAQ no longer states a review time. Community reports from 2026 that the program was on hold for new applicants could not be verified on Garmin's own pages.\n\nNeither posture is a knock on either company, but they hand you different problems. Apple's gate is on **distribution**, and you can always clear it eventually; Garmin's gate is on **access**, and right now you may not be able to clear it at all.\n\n## Apple Watch vs Garmin at a glance\n\n| Dimension | Apple Watch (via HealthKit) | Garmin (Connect Developer Program) |\n|---|---|---|\n| Integration model | Platform framework on the user's device; no vendor account, no API contract with Apple for the data | Vendor cloud API; an approved partnership is the prerequisite for everything else |\n| Getting access | Enable the HealthKit capability and ship; a paid Apple Developer account is required | Request the program; once Garmin approves you, you start with Starter Access, and Garmin states no review time |\n| Where your code runs | Inside your iOS app, and optionally a watchOS app on the watch | On your own backend, any language or host, once a user has authorized |\n| Auth | On-device permission prompt per data type; no tokens. Apple: \"your app doesn't know whether someone granted or denied permission to read data from HealthKit\" | `OAuth 2.0` with PKCE for a per-user `userAccessToken`. Secondary sources cite a lifetime around three months, refreshable — verify |\n| Delivery | Pull model you drive: `HKObserverQuery` plus `enableBackgroundDelivery`, `HKAnchoredObjectQuery` anchors for incremental sync. Apple documents an hourly maximum for some types, and four updates per hour on watchOS shared with background refresh | Push model Garmin drives: Ping or Push callbacks per summary type. Both retry, so answer fast and deduplicate on the upload time window |\n| Data shape | Whatever the Health store holds, written by any app or device — `HKWorkout` gives duration, total distance and total energy burned; HRV is `heartRateVariabilitySDNN` | First-party device metrics: a Health API for all-day wellness (sleep, stress, Pulse Ox, Body Battery, VO2 max, HRV, respiration, per-minute epochs) and an Activity API for per-activity data such as running, cycling and swimming, with GPS |\n| End-user cost | An Apple Watch and iPhone, bought once; no recurring fee for your app to read the data | A Garmin device bought outright; no separate consumer subscription for basic Garmin Connect use — verify |\n| Developer cost | HealthKit carries no API fees | No price published for Starter Access; Enterprise commercial terms are tailored, per Garmin's overview |\n| Reach | iOS and watchOS only — unavailable on iPadOS 16 or earlier and on macOS | Any platform, once approved. Rate limits are set per partner agreement |\n\nNo Garmin price appears above because Garmin publishes none. Read on October 22, 2026, its pages state no price for Starter Access and say Enterprise options and commercial terms are tailored to business and technical requirements; the program FAQ's earlier sentence that there were no licensing or maintenance fees is gone. Ask for them in writing before you promise one of those metrics.\n\n## Where Apple Watch wins\n\n**There is no counterparty who can say no.** This is the whole argument, and it lands unusually hard against Garmin. You cannot be turned away from HealthKit: if the person owns the watch and taps allow, the samples are there today — no application, no queue, no partner agreement whose terms you cannot read in advance.\n\n**You can run code on the device mid-workout.** Shipping a watchOS app and driving `HKWorkoutSession` is something a push-callback API structurally cannot offer: Apple documents the session as one that \"fine-tunes Apple Watch's sensors for the specified activity\" and notes that \"all workout sessions generate high-frequency heart rate samples.\" Live coaching, real-time pace or form feedback, and haptics on the wrist live here, not in a summary that arrives after the device next syncs.\n\n**You get the whole store — including, sometimes, Garmin's data.** Because HealthKit is a shared repository, your app sees what other apps and devices wrote into it. The consequence for this pair is specific: if a user's Garmin data lands in Apple HealthKit, you can read it on-device without Garmin's API at all. Not a substitute — you get only what synced into that one user's store, on the phone — but a real reason these two are not strictly exclusive.\n\n**The honest trade-off.** You are signing up to build and ship an app, forever, on iOS and watchOS only. Background reads can fail while the device is locked, because the store is encrypted then. Your app cannot tell \"granted\" from \"denied\" on reads, so your empty state must work without knowing why it is empty. Background delivery is metered by the system. And the sync to your servers is entirely your code — the [Apple HealthKit integration guide](/integrate/healthkit) covers the permissions, queries and sync you will write.\n\n## Where Garmin wins\n\n**Breadth of first-party physiology.** The Health and Activity API split reaches further into all-day wellness and serious multisport than most wearable APIs: Body Battery, VO2 max, stress, respiration, per-minute epochs, and per-activity detail with GPS. On the Apple side you get whatever that individual's devices and apps happened to write.\n\n**Your backend receives data without the user present.** A web dashboard with no mobile app, a nightly cohort job, an Android-first product — none are buildable on Apple Watch data alone, and all are ordinary Garmin integrations. Push carries the full payload inline; Ping keeps the POST small and lets you control fetch timing. And nobody has to keep your app installed: with HealthKit your app *is* the pipeline, so uninstalled or unpermitted, it stops.\n\n**The honest trade-off.** All of it is downstream of approval, and approval is the whole game. Nothing here is a stable public contract either: hosts, paths, scopes, summary-type names and token lifetimes sit behind the partner docs and change, so do not hard-code values from any public write-up, this one included. If the gate rather than the data is your blocker, [can't get Garmin API access](/fix/garmin-api-approval) covers the live status check and the aggregator route that runs on somebody else's approved credentials; the [Garmin API integration guide](/integrate/garmin-api) covers the wiring once you are in.\n\n## How to choose\n\n- **An iOS or watchOS app, especially one that coaches during the set** → Apple Watch. Nothing in a callback API reaches the sensors mid-session.\n- **A web product, an Android app, or a backend that runs without the user present** → Garmin, if you can get in. Confirm program status before you plan a roadmap around it.\n- **You want to start this week** → Apple Watch. Garmin's pages no longer state a review time, nothing reaches you before approval, and its FAQ puts a typical integration at one to four weeks.\n- **The deepest first-party physiology on an owned device** → Garmin, with the metric list verified against the partner docs.\n- **Your users must not pay a subscription** → both qualify, which is unusual. This pair ties on user cost; if that axis is what you are weighing, the contrast lives in [Apple Watch vs WHOOP](/compare/apple-watch-vs-whoop), where one side is a membership.\n- **You are really asking cloud-versus-device in general** → [Fitbit vs Apple Watch](/compare/fitbit-vs-apple-watch) walks that split with a self-serve cloud vendor opposite, which is a different question from an approval queue.\n\n## Watch the fine print\n\nThe Apple specifics are documented behavior and move slowly, but confirm the current background-delivery frequencies, entitlement requirements, platform availability and type identifiers in Apple's own HealthKit documentation. The Garmin specifics are the volatile half, and several are second-hand by necessity: the docs are gated, and most primary pages return errors to anonymous fetches. The reported sign-up pause, the roughly three-month token lifetime, the summary-type names, the metric lists, and any setup fee or premium-metric licensing are all unconfirmed on a Garmin-owned page. Load the developer portal yourself before telling a stakeholder the program is closed. Everything above is as of 2026 — verify."
  },
  {
    "slug": "rook-vs-spike",
    "primaryQuery": "rook vs spike health data api",
    "h1": "Rook vs Spike: Which Health-Data API Fits Your Build?",
    "metaTitle": "Rook vs Spike API: $399 Core vs $450 Sandbox, Compared",
    "metaDescription": "Rook vs Spike as of October 2026: Rook Core is $399 a month for 750 active users; Spike's Sandbox starts at $450. Medical devices, lab reports, EHR.",
    "updated": "2026-10-17",
    "answer": "Rook and Spike now overlap more than they used to: as of October 17, 2026, both pages describe wearables plus medical devices and lab-report parsing behind one API, so the decision is about pricing visibility and support. Pick Rook when you need a cost you can model today: Core is $399 a month for up to 750 active users, Core+ $999 for 5,000 and Business $1,999 for 15,000, with a Medical Device API that records which device took each reading. Pick Spike when you want a dedicated implementation engineer from its Sandbox plan (from $450 a month), food-photo nutrition, an MCP server and EMR data, and can accept a custom quote. Spike's site also announces an acquisition by Raintree Systems, and ROOK's standard contract runs 12 months.",
    "body": "## Same category, closer than they were\n\nNeither of these is usually the first aggregator a team shortlists; that is more often Terra or Junction. When Rook and Spike end up head-to-head, the old framing was a mobile-first wearable aggregator against an everything-source one. Their current pages, read on October 17, 2026, blur that line: ROOK now sells medical-device, lab-report and EHR/EMR products alongside its wearable API, and both publish prices. An earlier version of this page said Rook did not reach labs, EMRs or medical IoT, that neither vendor's pricing could be verified, and that Spike's own pages disagreed on its device count. Those claims are corrected below.\n\nROOK describes itself as \"the health data aggregation and intelligence platform for digital health, wellness and insurance products\". Its homepage pitch is \"Wearables, medical devices, EHR/EMR and labs\", priced by plan and active users. Spike pitches \"360° Health Data for AI\": wearables and IoT sensors, lab report data, food-photo nutrition and EMR access behind one API, with a dedicated implementation engineer from its entry plan.\n\n## Rook vs Spike at a glance\n\n| Dimension | Rook | Spike |\n|---|---|---|\n| Coverage claim | \"400+ wearables and health data sources\" in its docs; 72 data sources and 500+ devices on its integrations page | \"Access 40+ providers and 500+ devices via single SDK\" |\n| Medical devices | Medical Device API: glucose, blood pressure, SpO2, temperature and ECG, tagged with the recording device | Medical IoT devices such as glucose monitors, ECGs and blood pressure cuffs |\n| Labs | Lab Data API parses PDF and image reports into biomarkers with LOINC codes and FHIR R4 | Lab Reports API parses PDF, JPEG or PNG reports with OCR and LOINC codes |\n| Clinical records | EHR/EMR API (waitlist) sends wearable data to clinical systems as FHIR R4; EHR data into ROOK is coming soon | \"Connect to top providers and access clinical data\" for EMR and EHR |\n| Extras | 0 to 100 health score, a Health Monitor (ROOK Signals), ROOK App | Food-photo nutrition, Spike MCP, voice agents for clinics |\n| Entry price | Core $399 a month for up to 750 active users | Sandbox from $450 a month |\n| Higher tiers | Core+ $999 (5,000), Business $1,999 (15,000), Enterprise custom | Enterprise custom |\n| Contract | 12-month standard term, cancel with 30 days' notice | Not published |\n| Your own provider accounts | Dexcom, Samsung Health, Strava and WHOOP | Not stated in the docs we read |\n| Webhook signature | Not described on the pages we read | HMAC-SHA256 in X-Body-Signature |\n| Ownership | No change announced | Banner: \"Raintree Systems Acquires Spike Technologies\" |\n\n## Where Rook wins\n\n**You can price it before the first call.** ROOK's pricing page lists every self-serve ceiling: Core \"$399 USD per month\" for up to 750 active users, Core+ $999 for up to 5,000, Business $1,999 for up to 15,000, and add-ons with listed prices. Spike lists a starting price and a custom Enterprise plan. Past a ROOK plan's limit, \"billing adjusts based on usage\", which is the one number ROOK does not publish.\n\n**Device provenance on every reading.** ROOK's Medical Device API delivers readings \"with the device that recorded each one\", so a remote-monitoring program can tell a cuff from a watch. Spike integrates medical IoT too; the device-metadata detail is what ROOK documents.\n\n**Phone stores without your own app.** The ROOK App \"lets end users connect supported sources without embedding the SDKs\", for programs that have no mobile app of their own.\n\n**The honest trade-off.** The standard contract is 12 months, several products are add-ons on Core, and four popular providers need your own developer accounts, which ROOK says \"can take several weeks\".\n\n## Where Spike wins\n\n**A human on your implementation.** \"Every organization gets a dedicated implementation engineer from the sandbox level to help with setup and optimization.\" That is a checkable differentiator in a category where onboarding is normally the docs.\n\n**Food photos and LLM tooling in the box.** Spike's Nutrition AI converts \"any food image into complete nutritional data\", and Spike MCP \"connects wearables data, medical IoT devices, lab reports, and nutrition logs to your LLM of choice\". ROOK lists neither.\n\n**EMR data today.** Spike's homepage offers EMR and EHR connections now; ROOK's page says bringing EHR and EMR data into ROOK is coming soon.\n\n**The honest trade-off.** Spike publishes less: no tier ceilings, no contract terms, and no word on provider credentials in the docs we read. Its integrations and blog pages carry a banner announcing that Raintree Systems acquires Spike Technologies, with no further detail on its own pages.\n\n## What we could not verify\n\n- **For Rook:** the usage rate past a plan's ceiling, and whether webhooks carry a signature.\n- **For Spike:** how the bill grows past the Sandbox starting price, whether any provider needs your own developer account, and what the acquisition changes.\n- **For both:** coverage counts are each vendor's marketing; check your users' providers on the live lists.\n\n## How to choose\n\n- **A budget you need to model now, at a few thousand users** → Rook. Core+ at $999 a month covers up to 5,000 active users.\n- **Remote-monitoring readings where the device matters** → Rook's Medical Device API.\n- **Implementation help, food logging from photos, or an LLM-facing MCP layer** → Spike.\n- **EMR and EHR data flowing into your product today** → Spike, after confirming the integration you need is live.\n- **You have not compared the category leaders** → do that first: [Terra vs Rook](/compare/terra-vs-rook) and [Terra vs Spike](/compare/terra-vs-spike) take those pairs, and [Terra vs Vital (Junction)](/fitness-apis/terra-vs-vital) covers lab ordering.\n\n## Honest close\n\nNeither vendor saves you from the core aggregator trade: you pay to remove per-provider integration work, and you still own your infrastructure, token handling and health-data compliance. What separates them now is visibility and support: Rook publishes a price sheet you can model and a broader set of clinical-adjacent APIs than it used to, while Spike pairs a wide data reach with an engineer on your build and a price you learn on a call. Re-check both live pages before you commit; for the wider field, see the [health-data aggregator APIs overview](/fitness-apis/health-data-aggregator-apis), and for options beyond Spike, [ROOK alternatives](/alternatives/rook-alternatives).",
    "faqs": [
      {
        "q": "How do Rook and Spike differ on pricing transparency?",
        "a": "Rook publishes more. As of October 17, 2026, ROOK's pricing page lists Core at $399 a month for up to 750 active users, Core+ at $999 for 5,000, Business at $1,999 for 15,000, add-on prices and a 12-month standard contract. Spike lists a Sandbox plan that starts from $450 a month and a custom Enterprise plan, and calls its pricing usage-driven without itemizing it. Get a quote from Spike at your expected volume."
      },
      {
        "q": "Does Rook reach lab, EMR, or IoT sources the way Spike markets?",
        "a": "Partly, and more than an earlier version of this page said. As of October 17, 2026, ROOK sells a Medical Device API for glucose, blood pressure, SpO2, temperature and ECG readings and a Lab Data API that parses lab reports into LOINC-coded biomarkers. Its EHR/EMR API sends wearable data to clinical systems as FHIR R4, while bringing EHR and EMR records into ROOK is still coming soon. Spike offers EMR and EHR connections, medical IoT and lab-report OCR today."
      },
      {
        "q": "Which handles on-device Apple Health and Health Connect extraction better, Rook or Spike?",
        "a": "Both use mobile SDKs, because those stores keep data on the phone. ROOK's SDKs integrate with Apple Health and Health Connect, it adds Samsung Health, and its ROOK App connects them for programs without their own app; 59 of the 72 sources on its integrations page arrive indirectly through those stores. Spike's docs point to its SDK for Apple Health, Health Connect and Samsung Health. We have not tested either."
      },
      {
        "q": "Will I need my own provider credentials with Rook or Spike?",
        "a": "With Rook, yes for Dexcom, Samsung Health, Strava and WHOOP: its docs say clients must create their own developer accounts with those providers, which can take several weeks. Spike's provider docs, as of October 17, 2026, describe a consent redirect for providers such as Garmin and Fitbit and say nothing about customer-held credentials, so ask Spike about the providers on your list."
      },
      {
        "q": "Is Spike being acquired a risk next to Rook?",
        "a": "It is a factor to weigh, not a disqualifier. As of October 17, 2026, banners on Spike's integrations and blog pages read Raintree Systems Acquires Spike Technologies, and we found no further detail on Spike's own pages. Ask about roadmap, support and contract continuity before you sign; ROOK announced no ownership change on the pages we read."
      }
    ],
    "related": [
      {
        "href": "/compare/terra-vs-rook",
        "label": "Terra vs ROOK"
      },
      {
        "href": "/compare/terra-vs-spike",
        "label": "Terra vs Spike Health"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Aggregator pricing compared"
      }
    ],
    "cta": {
      "pitch": "Aggregator tiers, coverage counts and owners move quietly. Get a heads-up when Rook, Spike and the rest change what they charge or what they reach."
    },
    "sources": [
      {
        "url": "https://tryrook.io/rookconnect/medical-device-api/",
        "checked": "2026-10-17",
        "note": "Rook Medical Device API"
      },
      {
        "url": "https://tryrook.io/rookconnect/lab-data-api/",
        "checked": "2026-10-17",
        "note": "Rook Lab Data API"
      },
      {
        "url": "https://tryrook.io/rookconnect/ehr-emr-api/",
        "checked": "2026-10-17",
        "note": "Rook EHR/EMR API"
      },
      {
        "url": "https://tryrook.io/pricing/",
        "checked": "2026-10-17",
        "note": "Rook plans, add-ons and contract terms"
      },
      {
        "url": "https://www.spikeapi.com/pricing",
        "checked": "2026-10-17",
        "note": "Spike Sandbox and Enterprise plans"
      },
      {
        "url": "https://tryrook.io/about-us/",
        "checked": "2026-10-17",
        "note": "Rook company description"
      },
      {
        "url": "https://tryrook.io/",
        "checked": "2026-10-17",
        "note": "Rook product scope"
      },
      {
        "url": "https://www.spikeapi.com/",
        "checked": "2026-10-17",
        "note": "Spike scope, implementation engineer and customers"
      },
      {
        "url": "https://docs.tryrook.io/data-sources/",
        "checked": "2026-10-17",
        "note": "Rook data sources and own developer accounts"
      },
      {
        "url": "https://tryrook.io/wearable-api-sdk/integrations/",
        "checked": "2026-10-17",
        "note": "Rook source catalog"
      },
      {
        "url": "https://www.spikeapi.com/lab-reports",
        "checked": "2026-10-17",
        "note": "Spike Lab Reports API"
      },
      {
        "url": "https://docs.tryrook.io/",
        "checked": "2026-10-17",
        "note": "Rook health score"
      },
      {
        "url": "https://tryrook.io/rookconnect/wearable-api/",
        "checked": "2026-10-17",
        "note": "Rook wearable API, SDKs and delivery"
      },
      {
        "url": "https://www.spikeapi.com/mcp-health-ai-integration",
        "checked": "2026-10-17",
        "note": "Spike MCP"
      },
      {
        "url": "https://docs.spikeapi.com/api-docs/webhooks",
        "checked": "2026-10-17",
        "note": "Spike webhook signing and retries"
      },
      {
        "url": "https://www.spikeapi.com/integrations",
        "checked": "2026-10-17",
        "note": "Spike integrations and acquisition banner"
      },
      {
        "url": "https://www.spikeapi.com/blog",
        "checked": "2026-10-17",
        "note": "Spike acquisition banner"
      },
      {
        "url": "https://docs.spikeapi.com/api-docs/provider_integration",
        "checked": "2026-10-17",
        "note": "Spike provider consent flow"
      }
    ]
  },
  {
    "slug": "usda-fooddata-central-vs-open-food-facts",
    "primaryQuery": "usda fooddata central vs open food facts",
    "h1": "USDA FoodData Central vs Open Food Facts: Which Free Food Data?",
    "metaTitle": "USDA FoodData Central vs Open Food Facts (2026)",
    "metaDescription": "Two genuinely free food databases with opposite licenses: USDA is public-domain CC0 US reference data, Open Food Facts is ODbL global barcode data.",
    "updated": "2026-08-12",
    "answer": "Pick USDA FoodData Central when you need authoritative US nutrient reference values you can absorb into a closed-source product, because it is public domain under CC0 and imposes no obligations at all; pick Open Food Facts when your core interaction is scanning a barcode on a packaged product anywhere in the world, and accept that its ODbL license requires attribution and can force you to release a derived database as open data. Both are genuinely free rather than free tiers, so cost is not the deciding axis here — license philosophy and coverage center are. Neither offers natural-language meal parsing, so the logging layer is yours to build either way. Verify rate limits and the exact license variants before you merge either dataset into anything you intend to keep private.",
    "faqs": [
      {
        "q": "Which of these two free food databases does barcode lookup?",
        "a": "Open Food Facts. Barcode lookup is its core call, returning ingredients, nutrition facts, Nutri-Score, allergens, labels, categories, and images for a product code, globally and with no API key. USDA FoodData Central includes GTIN/UPC fields in its Branded Foods dataset, but it is oriented around its own food IDs and is not a consumer barcode-lookup product. If scanning a packet is your primary interaction, Open Food Facts is the one that makes the feature exist on day one."
      },
      {
        "q": "Does the ODbL share-alike obligation force me to open my own food catalog?",
        "a": "It can. Open Food Facts is licensed under the ODbL, and the share-alike term means a derived database that combines its data with yours may have to be released as open data, with attribution required either way. Commercial use itself is explicitly permitted, and the obligation attaches to the database rather than the application around it. Where a merged catalog sits on that line is a question for counsel, not a comparison table. This is general guidance, not legal advice."
      },
      {
        "q": "Can I safely combine USDA FoodData Central and Open Food Facts in one product?",
        "a": "Yes, and most food apps end up doing exactly that, but keep the two in separate stores. USDA data is public domain under CC0, so anything you derive from it stays yours with no strings. Open Food Facts data carries ODbL attribution and share-alike, so keep it attributed and unmerged, queried live or cached as its own dataset, rather than folded into a proprietary master catalog. Deciding this on day one costs nothing; retrofitting it later is a schema migration."
      },
      {
        "q": "Why does Open Food Facts require a custom User-Agent header?",
        "a": "Open Food Facts issues no API keys for read access, so the User-Agent string identifying your app is how the project attributes traffic and contacts you if your calls cause a problem. Sending a generic library default is the most common reason an integration gets treated as anonymous scraping. The project has said it intends to keep the API free and add no keys, so the header is the whole of your identity on the wire. Verify the current header format in the project's documentation."
      },
      {
        "q": "How hard is USDA FoodData Central rate limited?",
        "a": "It is metered per API key at a modest rate, reported around 1,000 requests per hour as of 2026 — verify the current figure, since it changes. That is comfortable for a server-side integration with caching and uncomfortable for anything that proxies every user keystroke straight through. The usual pattern is to mirror or cache the datasets you actually use rather than calling live. Signup is a free data.gov key, and a shared DEMO_KEY exists for first exploration only."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/nutrition-apis",
        "label": "Best nutrition APIs"
      },
      {
        "href": "/pricing/nutrition-api-pricing",
        "label": "Nutrition API pricing"
      },
      {
        "href": "/fitness-apis/free-fitness-apis",
        "label": "Free & open-source fitness APIs"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Open food data changes its license terms and rate limits quietly. Subscribe and we will flag it when a free dataset stops being as free as it looks."
    },
    "body": "## How to compare USDA FoodData Central and Open Food Facts\n\nMost nutrition-API head-to-heads weigh price against coverage. That axis is dead here: neither charges a fee, and neither is a freemium slice a vendor can curtail next quarter. Three questions are left, and they decide the build:\n\n- **License philosophy.** USDA FoodData Central is US government data in the public domain under `CC0`: no copyright, no license fee, attribution requested but not required. Open Food Facts is open data under the `ODbL`, with contents under `DbCL` and images under `CC-BY-SA` — free for any purpose including commercial use, but attribution is required and the share-alike obligation can require you to publish a derived database as open data. These are opposite philosophies, not two shades of the same one.\n- **Where the coverage sits.** USDA is a nutrient reference: Foundation Foods, SR Legacy, Survey (FNDDS) foods as consumed, and a Branded Foods dataset that carries GTIN/UPC fields. Open Food Facts is a global crowdsourced catalog of packaged products queried by barcode or search, returning ingredients, nutrition facts, Nutri-Score, allergens, labels, categories, and images for a product code.\n- **Who stands behind the numbers.** USDA data is lab-grade and curated by a government agency. Open Food Facts is volunteer-contributed with no accuracy or completeness guarantee, and coverage quality varies by region.\n\nAccess friction barely enters it. USDA needs a free data.gov key — a shared `DEMO_KEY` exists for first exploration — and meters requests at a modest rate, reported around 1,000 per hour as of 2026 (our own pages describe that limit as per key in one place and per IP in another, so verify it). Open Food Facts needs no key to read, only a custom `User-Agent` header identifying your app, and the project has said it intends to keep the API free and add no keys. The license and coverage points below are integration constraints, not a knock on either project.\n\n## USDA FoodData Central vs Open Food Facts at a glance\n\n| Dimension | USDA FoodData Central | Open Food Facts |\n|---|---|---|\n| Core data | Foundation Foods, SR Legacy, Survey (FNDDS) foods as consumed, Branded Foods with GTIN/UPC fields | Global packaged and branded products keyed by barcode: ingredients, nutrition facts, Nutri-Score, allergens, labels, categories, images |\n| Coverage center | US reference and lab-grade nutrient values for whole and branded foods | Global packaged goods, crowdsourced; depth varies by region |\n| License | Public domain, `CC0 1.0` — attribution requested, not required | `ODbL` database, `DbCL` contents, `CC-BY-SA` images — attribution required, share-alike applies |\n| Obligations on you | Effectively none | Credit the source, and a derived database combining its data may have to be released as open data |\n| Access | Free data.gov API key; shared `DEMO_KEY` for exploration | No key to read; a custom `User-Agent` identifying your app is required |\n| Rate limiting | Modest, reported around 1,000 requests per hour as of 2026 — per key or per IP, verify | No key, so no per-key quota is documented; your `User-Agent` is how the project identifies your traffic |\n| Barcode product | GTIN/UPC fields exist in Branded Foods, but it is not a consumer barcode-lookup product | Barcode lookup is the core call |\n| Natural-language parsing | None | None |\n| Accuracy model | Curated by a government agency | Volunteer-contributed, no accuracy or completeness guarantee |\n| Cost model | Genuinely free, not a free tier | Genuinely free, not a free tier |\n\n## Where USDA FoodData Central pulls ahead\n\nIts edge is authority plus the cleanest license in the category. When a dietitian or a regulator asks where a nutrient value came from, \"the USDA FoodData Central Foundation Foods dataset\" ends the conversation. Foods-as-consumed entries from the Survey (FNDDS) dataset suit modeling real meals rather than raw ingredients, and SR Legacy remains a workhorse reference for whole foods.\n\nThe license is the part people underrate. `CC0` means there is no copyright to comply with at all: you can ingest the whole thing, reshape it, blend it with your own proprietary data, ship it inside a closed-source product, and owe nobody anything. USDA requests credit; it does not require it. That is the reason USDA is the safe default for a commercial build that wants to keep its derived catalog private.\n\nThe trade-off that decides it against Open Food Facts: it is a nutrient-reference database, not a food-logging engine. There is no natural-language meal parsing, no restaurant-menu product, and no consumer barcode-lookup product, so you build the logging experience and fill the coverage gaps yourself. The hourly rate limit is modest enough that a busy client-side integration will feel it, which usually means caching or mirroring the data rather than proxying every request.\n\n## Where Open Food Facts pulls ahead\n\nIts edge is barcode coverage nobody else gives away. Point it at a product code and you get the packaged-goods picture — ingredients, nutrition facts, Nutri-Score, allergens, labels, categories, and images — globally, with no key, no signup, and no quota negotiation. If your product's first interaction is a user holding a phone camera against a packet in a supermarket, this is the dataset that makes that feature exist on day one. It is also what wger uses for its own nutrition data.\n\nThe trade-offs come in two flavors. The first is data quality: entries are volunteer-contributed with no accuracy or completeness guarantee, and regional coverage is uneven, so a barcode that resolves perfectly in one market may miss in another. Design for the miss — a \"product not found, add it yourself\" path is part of the feature, not an error state. The second is the license, and that one reaches your architecture.\n\n## The license question: CC0 versus share-alike\n\nThis is the real fork in the road, and worth being precise about, because \"both are free\" hides it completely.\n\n`CC0` imposes no obligations. `ODbL` imposes two that matter to a product team. Attribution: you credit Open Food Facts. Share-alike: a derived database that combines Open Food Facts data with your own may have to be released as open data. That second one is not a payment problem you can solve with a purchase order — it is a design constraint on what your food catalog is allowed to be.\n\nTwo notes keep this from being a blanket blocker. Commercial use is explicitly fine; ODbL is not a non-commercial license. And the obligation attaches to the database, not to the application around it — though where your merged catalog sits on that line is a question for counsel, not for a comparison page. This is general guidance, not legal advice.\n\nThe pattern that avoids the question entirely: keep the two sources in separate stores. USDA-derived tables stay yours because `CC0` says so; Open Food Facts lookups stay attributed and unmerged, queried live or cached as a distinct dataset rather than folded into a proprietary master catalog. Teams that decide this on day one rarely think about it again.\n\n## Which should you pick?\n\nMatch the dataset to the job rather than hunting for a single winner:\n\n- **If you need authoritative nutrient values you can absorb into a closed-source product** with zero license obligations, pick USDA FoodData Central and build the logging layer around it.\n- **If your core interaction is scanning a barcode on a packaged product**, especially outside the US, pick Open Food Facts and plan for attribution, share-alike, and missing entries.\n- **If you need both — and most food apps do — run both**, in separate stores so the ODbL obligation never touches your USDA-derived tables. USDA for reference nutrients, Open Food Facts for the packet in the user's hand, covers a surprising amount before you pay anyone. The [nutrition APIs roundup](/fitness-apis/nutrition-apis) shows where that combination still leaves gaps.\n- **If you need natural-language meal logging or restaurant and chain-menu depth**, neither of these has it. That is the commercial pair's territory — see [Nutritionix vs Edamam](/compare/nutritionix-vs-edamam) for that decision and [nutrition API pricing](/pricing/nutrition-api-pricing) for what the category costs.\n- **If you are wiring an LLM in front of either one**, neither parses free text, and that is fine: the durable pattern is to have the model resolve input to a row and let your server do the arithmetic. Both work well as that catalog — [AI food logging](/ai/ai-nutrition-logging) sets out the shape.\n\nFor how these two sit against the rest of the no-cost landscape, see the [free and open-source fitness APIs](/fitness-apis/free-fitness-apis) roundup.\n\n## Watch the fine print\n\nRate limits, dataset names, endpoint shapes, and the exact license variants on Open Food Facts images and contents all change. Everything volatile above — the roughly 1,000 requests per hour figure, the current USDA dataset list, and the precise `ODbL`, `DbCL`, and `CC-BY-SA` terms — is flagged \"as of 2026, verify.\" Read the license text yourself before merging either dataset into anything you intend to keep private, and have counsel settle a share-alike question rather than resolving it from a table."
  },
  {
    "slug": "terra-vs-thryve",
    "primaryQuery": "terra vs thryve",
    "h1": "Terra vs Thryve: Which Wearable Data API for Your App?",
    "metaTitle": "Terra vs Thryve: Wearable API Pricing, BAA and Hosting",
    "metaDescription": "Terra vs Thryve as of October 2026: credits per connected source vs per-user euro plans, a BAA on every plan vs Enterprise, German hosting and webhooks.",
    "updated": "2026-10-17",
    "answer": "Terra and Thryve both connect wearables and phone health stores through one API, so the choice comes down to billing, compliance and plumbing. As of October 17, 2026, Terra starts at $399 a month billed annually with 100,000 credits, charges 200 credits a month per connected data source, lists its BAA on Enterprise, and can deliver to databases, cloud storage and queues as well as webhooks. Thryve's Start Up plan starts at 499 euros a month for 500 end users with 0.50 euros per extra user, includes a BAA on all plans and hosts all data in Germany, but stores data for only 2 weeks on Start Up and embeds its connect widget in an iframe.",
    "body": "Terra and Thryve both turn many wearables and phone health stores into one normalized API, and both publish prices. They differ on the billing unit, where the BAA sits, where the data lives and how the connect flow and webhooks work. Everything below is from Terra's and Thryve's own pages as we read them on October 17, 2026.\n\n## At a glance\n\n| Dimension | Terra | Thryve |\n|---|---|---|\n| Coverage claim | \"500+ providers\" on its site; its docs say the Unified API \"supports over 150+ Data Sources\" | \"500+ Wearables & Health Data Sources\" on its site; the data-sources table in its docs lists 24 sources, two of them marked EOL (our count) |\n| Phone health stores | A mobile SDK for Apple Health, Samsung Health and Health Connect | A native SDK for Apple Health, Samsung Health and Health Connect |\n| Entry price | $399 a month billed annually, or $499 monthly, with 100,000 credits | Start Up from 499 euros a month with 500 end users |\n| Billing unit | 200 credits a month per connected data source, plus events past a free allowance | End users: 0.50 euros per user past the plan's included number |\n| Trying it | 30-day money-back guarantee | 14-day free trial with 25 end users |\n| BAA | Listed on Enterprise | Included on all plans |\n| Where data lives | Enterprise lists a \"Dedicated instance to localised area\" | \"All data processed and stored by Thryve is hosted in Germany\" |\n| Connect flow | Hosted widget session from your backend; no WebView or iframe | Connection Widget embedded in an iframe |\n| Webhooks | Signed with HMAC; retries with exponential backoff for several hours; 8-second timeout | zstd-compressed; optional HMAC secret; up to 3 retries; respond within 2 seconds |\n| Other destinations | SQL databases, Supabase, cloud storage, SQS and Kafka, MongoDB and Firestore | None named; without webhooks you call its API |\n| Beyond wearables | Blood and DNA test ordering (US and UK), a lab-report API | Analytics and algorithms as value-added services |\n\n## Where Terra wins\n\n**Delivery options.** Terra delivers \"to webhooks, SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore\", and \"Every webhook sent by Terra includes an HMAC-based signature header\". It \"retries the delivery automatically with exponential backoff for several hours\", and says \"The exact number and timing of retries may change without notice\". Thryve retries \"up to 3 times\", and \"Recurring failed deliveries within a certain timeframe will lead to the automatic disabling of webhooks.\"\n\n**Lab ordering.** Terra can \"Order blood and DNA tests for your users through Terra API\", in the US and the UK. We did not find test ordering on the Thryve pages we read.\n\n**The trade-off.** Terra's unit is the connected data source: \"An active authentication is one connected data source for one end user, and costs 200 Unified API credits per month\", so a user with a watch and a ring costs twice. By our arithmetic the 100,000 included credits cover 500 connected sources before events past the free allowance. Its BAA sits on Enterprise.\n\n## Where Thryve wins\n\n**The BAA on every plan.** Thryve's certifications page says \"Business Associate Agreements and Data Processing Agreements are standard on every plan\". For a HIPAA product that is the biggest difference on the two price sheets.\n\n**German hosting and two ISO certificates.** \"All data processed and stored by Thryve is hosted in Germany\", and its homepage claims compliance with \"GDPR, HIPAA, ISO 9001, 27001 and other international regulations\". Terra states that it is \"HIPAA compliant, GDPR compliant, and SOC 2 Type II certified\" and offers a localized dedicated instance on Enterprise.\n\n**Per-user plans with a startup tier.** Start Up starts at 499 euros a month for 500 users, and Scale Up, \"Special plan for startups with growth-stage needs (less than 10 years of founding)\", starts at 1,000 euros a month for up to 5,000 users. By our arithmetic, 5,000 one-source users cost about $4,899 a month on Terra at annual billing, against 2,749 euros on Thryve's Start Up or 1,000 euros on Scale Up if you qualify. We do not convert currencies; compare them at the rate you pay.\n\n**The trade-off.** Storage is short, 2 weeks on Start Up and 1 month on Scale Up, so keep your own history. The plan cards list custom auth credentials only on Scale Up and Enterprise, while Thryve's docs say that \"When no shared oAuth-client is available, you must bring your own oAuth-client\"; WHOOP, Dexcom and Google Health have none.\n\n## How the connect flow differs\n\nTerra's widget is a hosted page: you \"call POST https://access.tryterra.co/api/widget/session with your dev-id and x-api-key headers\" from your backend, send the user to the URL, and its docs say \"Do not use WebView or iFrame for the authentication flow.\" Thryve's is the opposite: \"The Connection Widget must be embedded in your app using an iframe component\", because \"Opening the URL in a new tab or window will prevent the widget from properly redirecting users back to your web app.\" You first \"create a Thryve user\", then call its widget endpoint with two Basic Auth headers. If your app already opens provider logins in the system browser, Terra's flow fits it as is; Thryve's needs a page that can host the iframe.\n\n## Your own provider credentials\n\n- **Terra** names \"WHOOP Dexcom Huawei Strava Virtuagym\" as providers that \"require special processes\", and its integrations table marks Garmin and Samsung as Required, though its homepage says Garmin data \"flows through Terra today\" through its long-standing partner integration.\n- **Thryve** marks WHOOP, Dexcom, Google Health and FreeStyle Libre (LibreView) without a shared OAuth client, while Garmin and Oura use Thryve's. Its table, which earlier marked Fitbit \"Deprecating on Oct 29 2026\", lists \"Fitbit (Deprecated)\" as of November 2, 2026.\n\n## What we could not verify\n\n- **Thryve's per-user rate.** The Start Up card says \"Additional users billed at €0.50 each\" in its description and \"€0.50 per additional user\" in its feature list (as we read it on October 22, 2026), and neither names a billing period.\n- **Thryve's webhook signature format.** The docs say an HMAC secret can be configured, but the pages we read do not describe the header or algorithm.\n- **Fitbit on Thryve now.** As of November 2, 2026 the docs mark Fitbit deprecated without saying how existing connections carry over.\n\n## Which should you pick?\n\n- **A HIPAA product that needs a BAA from the first plan:** lean Thryve, which includes it on all plans; on Terra it is an Enterprise line.\n- **Data that should stay in Germany or the EU by default:** Thryve hosts in Germany; ask Terra about its localized dedicated instance on Enterprise.\n- **Data pushed straight into your warehouse, queue or cloud storage:** lean Terra.\n- **Lab or DNA tests ordered for your users:** Terra.\n- **Users who connect several sources each:** Thryve's plans count end users, while Terra counts each connected source; confirm how Thryve counts a user with several devices.\n\nFor the rest of the field, see [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis), [Thryve API pricing](/pricing/thryve-api-pricing) and the [Terra integration guide](/integrate/terra-api).\n\n## Bottom line\n\nTerra is the broader delivery and diagnostics platform, priced in dollars per connected source. Thryve is the compliance-first choice, priced in euros per end user, with the BAA on every plan and data hosted in Germany, at the cost of short storage windows and an iframe-based connect flow. Re-read both live pricing pages before you commit; these figures are from October 17, 2026.",
    "faqs": [
      {
        "q": "Is Terra or Thryve cheaper?",
        "a": "It depends on your user count and how many sources each user connects. As of October 17, 2026, Terra starts at $399 a month billed annually and charges 200 credits per connected data source per month, while Thryve's Start Up starts at 499 euros a month for 500 end users plus 0.50 euros per extra user. By our arithmetic, 5,000 one-source users cost about $4,899 a month on Terra, against 2,749 euros on Thryve's Start Up or 1,000 euros on its startup-only Scale Up plan."
      },
      {
        "q": "Do Terra and Thryve sign a BAA?",
        "a": "Both offer one, on different plans. As of October 17, 2026, Terra's pricing page lists a signed BAA on its Enterprise plan, and Thryve's certifications page says BAA agreements are included on all plans with no enterprise upgrade required. Whether you need a BAA depends on your role under HIPAA."
      },
      {
        "q": "Where do Terra and Thryve host health data?",
        "a": "Thryve says all data it processes and stores is hosted in Germany. Terra's Enterprise plan lists a dedicated instance in a localized area; the Terra pages we read on October 17, 2026 do not name a default hosting region, so ask Terra where your data would live."
      },
      {
        "q": "Can I embed the Terra or Thryve connect widget in an iframe?",
        "a": "Only Thryve's. Thryve's docs say its Connection Widget must be embedded in an iframe, because opening it in a new tab breaks the redirect back to your app. Terra's docs say not to use a WebView or iframe for its authentication flow, and to open the hosted widget URL from a session your backend creates."
      },
      {
        "q": "Which providers need my own developer credentials with Terra or Thryve?",
        "a": "As of October 17, 2026, Terra's docs name WHOOP, Dexcom, Huawei, Strava and Virtuagym as needing special processes, and its integrations table also marks Garmin and Samsung as Required. Thryve's data-sources table shows no shared OAuth client for WHOOP, Dexcom, Google Health or FreeStyle Libre, so you bring your own; Garmin and Oura use Thryve's shared client. Check your exact provider list with each vendor."
      }
    ],
    "related": [
      {
        "href": "/pricing/thryve-api-pricing",
        "label": "Thryve API pricing"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/integrate/terra-api",
        "label": "Integrate Terra"
      },
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Aggregator pricing compared"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Comparing health-data aggregators for your build? Get our developer newsletter for the pricing and credential changes on Terra, Thryve and the rest, as we find them."
    },
    "sources": [
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-sources",
        "checked": "2026-10-17",
        "note": "Terra data source count and providers with special setup"
      },
      {
        "url": "https://www.thryve.health/",
        "checked": "2026-10-17",
        "note": "Thryve coverage and hosting"
      },
      {
        "url": "https://docs.thryve.health/thryve-data-sources/overview",
        "checked": "2026-10-17",
        "note": "Thryve data sources and OAuth clients"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/getting-started",
        "checked": "2026-10-17",
        "note": "Terra mobile-only sources, signed webhooks, rate limits"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-27",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://www.thryve.health/pricing",
        "checked": "2026-10-17",
        "note": "Thryve plans, storage and hosting"
      },
      {
        "url": "https://www.thryve.health/certifications-compliance",
        "checked": "2026-10-27",
        "note": "Thryve certifications and BAA"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/user-authentication/implementation-terra-widget",
        "checked": "2026-10-17",
        "note": "Terra widget session endpoint and legacy deprecation"
      },
      {
        "url": "https://docs.thryve.health/connect-data-sources",
        "checked": "2026-10-17",
        "note": "Thryve connection widget"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-destinations/webhooks",
        "checked": "2026-10-17",
        "note": "Terra webhook signing, retries and timeout"
      },
      {
        "url": "https://docs.thryve.health/receive-updates-via-webhooks/data-push",
        "checked": "2026-10-17",
        "note": "Thryve webhooks"
      },
      {
        "url": "https://tryterra.co/products/lab-testing",
        "checked": "2026-10-17",
        "note": "Terra lab testing geography and collection methods"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/pricing",
        "checked": "2026-10-17",
        "note": "Terra credit tiers"
      },
      {
        "url": "https://docs.tryterra.co/reference/health-and-fitness-api/supported-integrations",
        "checked": "2026-10-17",
        "note": "Terra integration credential requirements"
      }
    ]
  },
  {
    "slug": "terra-vs-open-wearables",
    "primaryQuery": "terra vs open wearables",
    "h1": "Terra vs Open Wearables: Managed API or Self-Hosted Open Source?",
    "metaTitle": "Terra vs Open Wearables: Managed API or Self-Hosted?",
    "metaDescription": "Terra vs Open Wearables as of October 2026: a managed API from $399 a month vs free MIT-licensed software you host, provider credentials, Dexcom, BAA.",
    "updated": "2026-10-17",
    "answer": "Terra is a managed health-data API; Open Wearables is MIT-licensed software you host yourself. As of October 27, 2026, Terra starts at $399 a month billed annually with 100,000 Unified API credits, manages API keys for many sources and adds Dexcom, lab ordering and delivery into databases and queues. Open Wearables' Core is free with no per-user fee, keeps data in your own cloud account and ships an MCP server and signed outbound webhooks, with health scores in a Pro plan from $999 a month per deployment; but you register with every cloud provider, run and secure the stack yourself, and its APIs may change before version 1.0.",
    "body": "This is not two vendors with different price sheets. Terra is a managed API you pay for; Open Wearables is MIT-licensed software from Momentum that you deploy and run yourself, with paid Pro and Enterprise plans on top. Everything below is from Terra's pages, Open Wearables' site, docs and GitHub README as we read them on October 17, 2026, except Terra's pricing page and Open Wearables' pricing, FAQ, comparison and webhooks pages, which we re-read on October 27, 2026 after they changed. Open Wearables gives no date for the change: the Pro plan was not on its pricing page when we read it on October 17, 2026, and its FAQ and webhooks page then still called outbound webhooks in development.\n\n## At a glance\n\n| Dimension | Terra | Open Wearables |\n|---|---|---|\n| What you get | A managed API | MIT-licensed software you host; \"each deployment serves a single organization\" |\n| Price | $399 a month billed annually, or $499 monthly, with 100,000 Unified API credits | Core \"$0 Forever\"; Pro \"From $999 a month, per deployment\"; Enterprise \"Custom\", on an annual agreement |\n| Cloud providers | \"500+ providers\" on its site; its docs say \"over 150+ Data Sources\" | Garmin, Oura, Whoop, Polar, Suunto, Strava, Withings, Ultrahuman, SensorBio and Google Health, with Fitbit marked deprecated |\n| Phone health stores | A mobile SDK for Apple Health, Samsung Health and Health Connect | Native SDKs for Apple Health, Samsung Health and Health Connect |\n| Provider credentials | Terra-managed keys for many sources; special processes for WHOOP, Dexcom, Huawei, Strava and Virtuagym | Yours for every cloud provider |\n| Dexcom | Supported, through your own Dexcom developer app | \"Not in the open-source project today\"; continuous glucose is on its roadmap |\n| Delivery | Signed webhooks, SQL databases, Supabase, cloud storage, SQS and Kafka, MongoDB and Firestore | Its API, an MCP server, and signed outbound webhooks with retries |\n| Labs | Blood and DNA test ordering | None listed |\n| Health scores | An add-on, from $499 a month on Quick Start | Part of Pro, computed inside your deployment |\n| BAA | Listed on Enterprise | On Enterprise, where your cloud provider and scope support it |\n| Where data lives | Terra's platform; Enterprise lists a \"Dedicated instance to localised area\" | Your own cloud account, in the region you choose |\n| Maturity | Publishes an OpenAPI spec | Pre-1.0: version 0.11.0 as of November 2, 2026; the README says to read the release notes before upgrading |\n\n## Where Terra wins\n\n**Nothing to run.** Terra is a hosted service: \"Subscriptions start from $399 per month billed annually, or $499 per month billed monthly.\" Open Wearables' Core is free, but its FAQ says \"There is no hosted version, and that is the design rather than a gap\", so hosting, monitoring, security patches and upgrades are yours unless you pay Momentum: its Deployment service starts at $4,800, one-time, and Enterprise is where \"We run and secure it in your cloud, under an SLA.\"\n\n**Fewer provider applications.** \"Terra manages API Keys of data sources, meaning you can connect users without having to apply for each API Key\", and its homepage says \"Garmin data flows through Terra today\" through a long-standing partner integration, although its integrations table still marks Garmin as Required. Open Wearables' FAQ answers \"Do we need our own developer account with each provider?\" with \"Yes. The app is registered in your name\"; its docs say \"You must apply for Garmin Developer Program\", and provider approval takes \"From days to months, depending on the provider and on what you are building.\"\n\n**Breadth beyond wearables.** Terra supports Dexcom, orders blood and DNA tests, and delivers straight into databases, cloud storage and queues. Open Wearables says Dexcom is \"Not in the open-source project today\", with continuous glucose \"on the roadmap rather than in the product\", and on FHIR: \"It is not a FHIR server, and EHR-ready FHIR output is on the roadmap.\"\n\n**Certifications.** Terra says it \"is HIPAA compliant, GDPR compliant, and SOC 2 Type II certified\". Open Wearables answers \"Do you hold SOC 2 or ISO 27001?\" with \"No. The deployment runs inside your certified environment\".\n\n## Where Open Wearables wins\n\n**No license fee and no per-user bill.** Its docs put it as \"Self-hosted, MIT license, $0 per user\", and its pricing FAQ answers \"Is the free version really free?\" with \"Yes. MIT license, full source, no trial window.\" Even the paid tier does not grow with users: \"Pro is priced per deployment rather than per user\". Terra's bill grows with every connected data source: \"An active authentication is one connected data source for one end user, and costs 200 Unified API credits per month\".\n\n**Data that never leaves your cloud account.** Open Wearables' FAQ says \"Where you self-host on Core, there is no processing for us to agree to, because we never touch it.\" It does send \"a small anonymous usage ping once a day, plus one on startup\", which carries a random instance identifier, version numbers and \"aggregate, bucketed counts and configuration flags\" and \"never contains health data, user data or credentials\", and the README documents how to turn it off.\n\n**An MCP server in the free tier.** Core includes an \"Admin panel and MCP server\", and its FAQ says you can \"point the MCP server at your deployment so an assistant can look things up in plain language without you writing the retrieval layer.\" Terra offers an MCP server of its own through its AI Interface. Health scores are a paid extra on both sides: Terra sells them as an add-on, and Open Wearables says \"Health scores come with Pro\", \"computed inside your deployment\".\n\n## Webhooks on both sides\n\nTerra documents signed, retried delivery: \"Every webhook sent by Terra includes an HMAC-based signature header\", and Terra \"retries the delivery automatically with exponential backoff for several hours\". Open Wearables now describes outbound webhooks as shipped on every page we read. Its FAQ says \"Yes, in both directions. Incoming webhooks receive provider pushes, and outgoing webhooks notify your systems with full delivery history\", and its webhooks page says it \"pushes each event to your endpoint once it is saved in your deployment, signed, retried if your service was down, with every attempt there to inspect.\" They are \"off by default\"; you \"Set OUTGOING_WEBHOOKS_ENABLED=true in the backend environment and restart.\" Its README adds \"In production, run the official images pinned to a release tag\", not a nightly build or a build of main, so check the release you pin.\n\n## On Open Wearables' comparison page\n\nOpen Wearables publishes its own comparison with the hosted APIs. It says \"Coverage and pricing vary\", that for its rivals' prices \"Their pricing is published on their own pages and it changes, so read it there\", and that \"Several of them hold certifications we do not.\" By the two vendors' own pages, the practical gaps today are Dexcom and lab ordering, which Terra has and Open Wearables does not list.\n\n## Compliance\n\nSelf-hosting moves the compliance work to you rather than removing it. Open Wearables' Enterprise plan lists \"GDPR tooling, signed DPA and BAA\", and its FAQ says \"A BAA comes with Enterprise, where your cloud provider and your scope support it.\" Terra lists a signed BAA on Enterprise. Whether you need one depends on your role under HIPAA; our [HIPAA compliance guide for fitness apps](/compliance/hipaa-compliance-fitness-app) explains when that applies. This is general information, not legal advice.\n\n## Which should you pick?\n\n- **Health data must stay on infrastructure you control, and you have the engineers to run it:** Open Wearables.\n- **You want to ship this quarter without registering with every provider:** Terra, after checking its credential list for your providers.\n- **Dexcom, lab tests or delivery into your warehouse:** Terra.\n- **Many users, each a cost on a per-source bill:** model both; Open Wearables' Core has no license fee and Pro is priced per deployment, but price your own hosting and on-call before calling it cheaper.\n- **A vendor that holds SOC 2 itself:** Terra; Open Wearables holds neither SOC 2 nor ISO 27001.\n\nFor managed alternatives, see [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) and the [Terra integration guide](/integrate/terra-api).\n\n## Bottom line\n\nTerra sells breadth and convenience by the connected source; Open Wearables gives you the code and the responsibility, and now sells health scores and support on top by the deployment. Pick by who should run the stack and hold the provider relationships, then re-check both projects' live pages, because Open Wearables' APIs are still pre-1.0 and both vendors' prices are as of October 27, 2026.",
    "faqs": [
      {
        "q": "Is Open Wearables a free alternative to Terra?",
        "a": "The software is free: Open Wearables' core platform is MIT-licensed, and its docs describe it as self-hosted at $0 per user. Hosting, security, upgrades and provider registrations are your costs. As of October 27, 2026, its Pro plan, which adds health scores and other licensed modules, starts at $999 a month per deployment, and Enterprise, with a BAA, is custom-priced. Terra starts at $399 a month billed annually and runs the infrastructure for you."
      },
      {
        "q": "Does Open Wearables need my own Garmin developer account?",
        "a": "Yes. As of October 17, 2026, Open Wearables' docs say you must apply for the Garmin Developer Program, and the same holds for Suunto and Polar; every cloud provider needs your own registered app. Terra says Garmin data flows through its own partner integration, though its integrations table marks Garmin as Required, so ask Terra too."
      },
      {
        "q": "Does Open Wearables support Dexcom?",
        "a": "Not yet. As of October 27, 2026, Open Wearables' FAQ says Dexcom support is not in the open-source project today and that continuous glucose is on the roadmap rather than in the product. Terra supports Dexcom, connected through your own app on the Dexcom developer portal."
      },
      {
        "q": "Is there a hosted version of Open Wearables?",
        "a": "No. Its FAQ says \"There is no hosted version\"; it runs in your own cloud account, deployed with Docker Compose to start and infrastructure as code for production. Momentum, which maintains it, sells a one-time Deployment service from $4,800 and an Enterprise agreement under which it runs and secures the deployment in your cloud."
      },
      {
        "q": "Do Terra and Open Wearables offer a BAA?",
        "a": "Both, on their top tiers. As of October 27, 2026, Terra's pricing page lists a signed BAA on Enterprise, and Open Wearables says a BAA comes with Enterprise where your cloud provider and your scope support it. On Open Wearables' free Core you run the stack, so the safeguards are yours. Whether you need a BAA depends on your role under HIPAA."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/alternatives/terra-alternatives",
        "label": "Terra alternatives"
      },
      {
        "href": "/integrate/terra-api",
        "label": "Integrate Terra"
      },
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Aggregator pricing compared"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Weighing a managed aggregator against running your own? Get our developer newsletter for pricing, credential and release changes on Terra, Open Wearables and the rest."
    },
    "sources": [
      {
        "url": "https://github.com/the-momentum/open-wearables/blob/main/LICENSE",
        "checked": "2026-10-17",
        "note": "Open Wearables license"
      },
      {
        "url": "https://github.com/the-momentum/open-wearables",
        "checked": "2026-10-17",
        "note": "Open Wearables README"
      },
      {
        "url": "https://openwearables.io/pricing",
        "checked": "2026-10-27",
        "note": "Open Wearables plans: Core, Pro, Enterprise and services"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-27",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-sources",
        "checked": "2026-10-17",
        "note": "Terra data source count and providers with special setup"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/getting-started",
        "checked": "2026-10-17",
        "note": "Terra mobile-only sources, signed webhooks, rate limits"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/dedicated-data-source-api-keys",
        "checked": "2026-10-17",
        "note": "Terra managed and dedicated provider keys"
      },
      {
        "url": "https://openwearables.io/faq",
        "checked": "2026-10-27",
        "note": "Open Wearables FAQ"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/dexcom",
        "checked": "2026-10-17",
        "note": "Terra Dexcom setup"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-destinations/webhooks",
        "checked": "2026-10-17",
        "note": "Terra webhook signing, retries and timeout"
      },
      {
        "url": "https://github.com/tryterra/openapi/blob/master/dist/core/v2-bundled.yaml",
        "checked": "2026-10-17",
        "note": "Terra OpenAPI spec: base URL and legacy widget endpoint"
      },
      {
        "url": "https://docs.tryterra.co/reference/health-and-fitness-api/supported-integrations",
        "checked": "2026-10-17",
        "note": "Terra integration credential requirements"
      },
      {
        "url": "https://openwearables.io/docs/providers/supported",
        "checked": "2026-10-17",
        "note": "Open Wearables provider setup"
      },
      {
        "url": "https://openwearables.io/docs",
        "checked": "2026-10-17",
        "note": "Open Wearables docs"
      },
      {
        "url": "https://openwearables.io/webhooks",
        "checked": "2026-10-27",
        "note": "Open Wearables webhook status"
      },
      {
        "url": "https://openwearables.io/compare",
        "checked": "2026-10-27",
        "note": "Open Wearables' own comparison with managed aggregators"
      }
    ]
  },
  {
    "slug": "terra-vs-sahha",
    "primaryQuery": "terra vs sahha",
    "h1": "Terra vs Sahha: Which Health Data API for Your App?",
    "metaTitle": "Terra vs Sahha: Wearable Data API or Phone-First Scores?",
    "metaDescription": "Terra vs Sahha as of October 2026: credits per connected source from $399 vs per-user plans from $299, phone-first scores, cloud coverage, BAA, webhooks.",
    "updated": "2026-10-17",
    "answer": "Terra and Sahha solve different halves of the problem. As of October 17, 2026, Terra is a broad data pipe that normalizes data from 500+ providers through managed cloud connections and mobile SDKs, starting at $399 a month billed annually with credits per connected data source, and it sells scores as an add-on. Sahha turns the phone itself into a sensor and returns biomarkers, scores and insights on every plan, from $299 a month billed annually for 1,000 users, with a BAA from its Pro plan, but its direct cloud integrations are in public beta and sandbox only. Pick Terra for server-side wearable coverage and delivery options, and Sahha for users who may not own a wearable.",
    "body": "Terra and Sahha both sit between your app and your users' health data, but they lead with different things. Terra's pitch is breadth: \"One API call returns standardised data from 500+ providers\". Sahha's is interpretation: \"From phones and 800+ devices to biomarkers, scores, archetypes, tags and insights your product can act on.\" Everything below is from the two vendors' own pages as we read them on October 17, 2026.\n\n## At a glance\n\n| Dimension | Terra | Sahha |\n|---|---|---|\n| Lead product | Normalized data from wearables, apps and phone health stores | Biomarkers, scores, archetypes, tags and insights |\n| Coverage claim | \"500+ providers\" on its site; its docs say \"over 150+ Data Sources\" | \"800+ devices across 165 integrations\" |\n| Users without a wearable | Data comes from the sources a user connects | The phone itself is \"a passive sensor for sleep, activity, and behavior\" |\n| Server-side cloud connections | The core of the product, with Terra-managed keys for many sources | \"For select providers\", and those integrations \"are in public beta and are Sandbox only\" |\n| Entry price | $399 a month billed annually, or $499 monthly, with 100,000 credits | Starter at $299 a month billed annually with 1,000 users |\n| Billing unit | 200 credits a month per connected data source, plus events past a free allowance | Users: $0.40 each past 1,000 on Starter, $0.20 each past 10,000 on Pro |\n| Free start | 30-day money-back guarantee; testing environments capped at 50 users | 30-day free trial on every plan (pricing page, October 27, 2026) |\n| Scores | An add-on, from $499 a month on Quick Start | 5 scores on every plan |\n| BAA | Listed on Enterprise | Included from Pro, at $1,499 a month billed annually |\n| Webhooks | HMAC signature header; retries with exponential backoff for several hours | HMAC-SHA256 signature; up to 5 retries with exponential backoff |\n| Labs | Blood and DNA test ordering, US and UK | None listed |\n\n## Where Terra wins\n\n**Server-side coverage you can use in production.** Terra's model is cloud connections run by Terra: \"Terra manages API Keys of data sources, meaning you can connect users without having to apply for each API Key\", and \"Garmin data flows through Terra today\". Sahha says it \"also connects directly through their cloud API\" for select providers, but its docs say those integrations \"are in public beta and are Sandbox only\", and each one runs on an app you register with the provider. If you need Garmin, Oura or WHOOP data without your users installing your app, Terra is the one that offers it in production today.\n\n**More delivery options and diagnostics.** Terra delivers \"to webhooks, SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore\", and can \"Order blood and DNA tests for your users through Terra API\". Its data types run from \"sleep stages and latency\" to \"per-set strength training\".\n\n**The trade-off.** You pay per connected data source, and scores cost extra: \"Health scores are an add-on for Quick Start plans. Starting from $499 / month\".\n\n## Where Sahha wins\n\n**Users without a wearable.** Sahha's answer to \"do my users need a wearable?\" is \"No. Sahha turns the smartphone itself into a passive sensor for sleep, activity, and behavior.\" For a mass-market app where most users own only a phone, that is a different starting dataset, not just a cheaper one.\n\n**Interpretation included.** Every Sahha plan includes \"Biomarkers 100+ Scores 5 Archetypes 100+ Tags 75+ Insights 100+\". On Terra, scores are a separate add-on.\n\n**A lower, per-user bill.** Starter is $299 a month billed annually with 1,000 users, then \"$0.40/user\"; Pro is $1,499 with 10,000 users, then \"$0.20/user\". By our arithmetic, with one source per person and annual billing:\n\n| Users | Terra | Sahha |\n|---|---|---|\n| 1,000 | About $899 ($399 plus 100,000 extra credits at $0.005) | $299 on Starter |\n| 5,000 | About $4,899 ($399 plus 900,000 extra credits) | $1,499 on Pro, or about $1,899 on Starter |\n\nThose are list-price calculations, not quotes, and Sahha's page does not define a user in the text we fetched.\n\n**A BAA below Enterprise.** \"The DPA is included on every plan. A BAA is included from Pro.\" Terra lists its signed BAA on Enterprise.\n\n**The trade-off.** Sahha's data mostly arrives \"on-device through Apple Health or Health Connect\", so your app with Sahha's SDK has to be on the user's phone, and data retention is 30 days on Starter and 120 on Pro.\n\n## Webhooks and signatures\n\nBoth sign their webhooks. Terra says \"Every webhook sent by Terra includes an HMAC-based signature header\" and \"retries the delivery automatically with exponential backoff for several hours\". Sahha tells you to \"Compute an HMAC-SHA256 hash of the raw request body using your secret key, then compare it to the signature in the header\", and says \"Failed deliveries are retried up to 5 times with exponential backoff\". Sahha also batches score and biomarker updates: its webhook interval \"acts as a deduplication window\".\n\n## What we could not verify\n\n- **Sahha's definition of a user.** Its pricing page lists the question \"What counts as a user?\", but the answer did not appear in the text we fetched.\n- **When Sahha's cloud integrations leave beta.** The docs say beta and sandbox only, with no date.\n- **Terra's default hosting region.** The Terra pages we read name a localized dedicated instance on Enterprise but no default region.\n\n## Which should you pick?\n\n- **Most of your users have a phone but no wearable:** lean Sahha.\n- **You want scores and insights without building them:** lean Sahha, where they come with every plan.\n- **You need server-side Garmin, Oura or WHOOP data in production, or many sources per user:** lean Terra.\n- **Lab tests, or data delivered into your own database or queue:** Terra.\n- **A HIPAA product on a mid-size budget:** compare Sahha's Pro, which includes the BAA, with Terra's Enterprise quote.\n\nSee [Sahha API pricing](/pricing/sahha-api-pricing), the [Terra integration guide](/integrate/terra-api) and [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) for the rest of the field.\n\n## Bottom line\n\nTerra is the broader data pipe, billed per connected source; Sahha is the phone-first signal layer, billed per user, with scores and a lower BAA tier included. Pick by where your users' data starts, then re-read both live pricing pages, because these figures are from October 17, 2026.",
    "faqs": [
      {
        "q": "Is Terra or Sahha cheaper?",
        "a": "On list prices, Sahha. As of October 17, 2026, Sahha's Starter is $299 a month billed annually for 1,000 users and Pro is $1,499 for 10,000, while Terra starts at $399 a month billed annually and charges 200 credits per connected data source per month. By our arithmetic, 5,000 one-source users cost about $4,899 a month on Terra and $1,499 on Sahha's Pro. The products differ, so price what you need, not just the user count."
      },
      {
        "q": "Does Sahha work if my users do not have a wearable?",
        "a": "Yes. Sahha's homepage says users do not need a wearable because Sahha turns the smartphone itself into a passive sensor for sleep, activity and behavior. Terra works from the sources a user connects, such as a watch, ring or phone health store. As of October 17, 2026, that is the clearest difference between the two."
      },
      {
        "q": "Can Sahha pull Garmin data from the cloud like Terra?",
        "a": "Only in beta. As of October 17, 2026, Sahha's docs say its direct cloud integrations are in public beta and sandbox only, and Garmin's needs Garmin's approval of your own app. Terra's homepage says Garmin data flows through Terra's own partner integration today, though its integrations table marks Garmin as Required, so confirm the credential setup with Terra."
      },
      {
        "q": "Which Terra and Sahha plans include a BAA?",
        "a": "As of October 17, 2026, Sahha includes a BAA from its Pro plan, $1,499 a month billed annually, and its DPA on every plan. Terra lists a signed BAA on its Enterprise plan, which is priced by quote. Whether you need a BAA depends on your role under HIPAA."
      },
      {
        "q": "Do Terra and Sahha sign their webhooks?",
        "a": "Both do. Terra includes an HMAC-based signature header on every webhook and retries failed deliveries up to 10 times with exponential backoff. Sahha signs with HMAC-SHA256 over the raw request body and retries failed deliveries up to 5 times. Verify against the raw body in both cases, before any JSON parsing."
      }
    ],
    "related": [
      {
        "href": "/pricing/sahha-api-pricing",
        "label": "Sahha API pricing"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/integrate/terra-api",
        "label": "Integrate Terra"
      },
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Aggregator pricing compared"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Comparing health-data APIs for your build? Get our developer newsletter for pricing, coverage and beta-status changes on Terra, Sahha and the rest."
    },
    "sources": [
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://sahha.ai/",
        "checked": "2026-10-17",
        "note": "Sahha coverage, pricing FAQ and compliance"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-sources",
        "checked": "2026-10-17",
        "note": "Terra data source count and providers with special setup"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/dedicated-data-source-api-keys",
        "checked": "2026-10-17",
        "note": "Terra managed and dedicated provider keys"
      },
      {
        "url": "https://sahha.ai/integrations/",
        "checked": "2026-10-17",
        "note": "Sahha integrations"
      },
      {
        "url": "https://docs.sahha.ai/docs/connect/integrations",
        "checked": "2026-10-17",
        "note": "Sahha cloud integrations beta"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-27",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://sahha.ai/pricing/",
        "checked": "2026-10-27",
        "note": "Sahha plans"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/understanding-terra-environments",
        "checked": "2026-10-17",
        "note": "Terra environments and test user limit"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-destinations/webhooks",
        "checked": "2026-10-17",
        "note": "Terra webhook signing, retries and timeout"
      },
      {
        "url": "https://docs.sahha.ai/docs/connect/webhooks",
        "checked": "2026-10-17",
        "note": "Sahha webhooks"
      },
      {
        "url": "https://tryterra.co/products/lab-testing",
        "checked": "2026-10-17",
        "note": "Terra lab testing geography and collection methods"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/pricing",
        "checked": "2026-10-17",
        "note": "Terra credit tiers"
      },
      {
        "url": "https://docs.tryterra.co/reference/health-and-fitness-api/supported-integrations",
        "checked": "2026-10-17",
        "note": "Terra integration credential requirements"
      }
    ]
  },
  {
    "slug": "quickpose-vs-sency",
    "primaryQuery": "quickpose vs sency",
    "h1": "QuickPose vs Sency: Pose Toolkit or Motion Product?",
    "metaTitle": "QuickPose vs Sency (2026): Motion Tracking SDKs Compared",
    "metaDescription": "QuickPose vs Sency from their own repos and pages: MediaPipe toolkit vs assessment SDK, bundled vs downloaded models, per-device vs per-user prices.",
    "updated": "2026-10-18",
    "answer": "QuickPose and Sency both put camera-based movement tracking inside a native mobile app, but QuickPose is a toolkit of building blocks on top of MediaPipe while Sency is a motion product with assessments, workout plans and an optional ready-made UI. Pick QuickPose when you want counters and range-of-motion measurement inside your own product, paid plans from $25 a month, and models that ship with the app; pick Sency when you want assessments, plans or a white-label experience, or you need Flutter, and budget from $499 a month for its first published paid plan. Neither supports a web target from its public packages, and neither publishes an independent accuracy benchmark.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that competes with both QuickPose and Sency.** Neither product on this page is ours, and we have no reason to prefer either; KinesteX appears only in the closing section, labeled. Every fact below comes from the two vendors' own GitHub repositories, package registries and published pages as fetched on October 17 and 18, 2026. Sency's pricing and FAQ pages were read through a text reader, because the part of those pages our snapshot tool extracts holds only a contact form; an automated check re-tests every quoted passage against the live pages.\n\n## Two different shapes of the same idea\n\nBoth sell camera-based movement tracking for fitness and health apps, both run as native SDKs inside your app rather than as an embedded web view, and both cover iOS, Android and React Native. The difference is where each stops.\n\n**QuickPose is a toolkit on top of MediaPipe.** Its README describes \"developer-oriented cutting edge ML features of MediaPipe and BlazePose\", and its Swift package ships MediaPipe lite, full and heavy libraries as modules. What it adds is a layer of building blocks: overlays, range-of-motion measurement for shoulders, hips, knees, back and neck, counters for 20 named exercises, body-position feedback and gesture inputs. Your app owns the product around them.\n\n**Sency is a motion product with two front ends.** Its Custom Kit (SMKit) is a \"Native no-UI SDK\" where, per the iOS demo, you own the camera preview, session lifecycle, exercise UI, skeleton rendering and results. Its Branded Kit (SMKitUI) is a white-label UI where the whole experience is ready to use. Around both sit assessments, monthly progress evaluations and personalized workout plans, which is a layer QuickPose's repositories do not have.\n\n## QuickPose vs Sency at a glance\n\n| | QuickPose | Sency |\n| --- | --- | --- |\n| What it is | MediaPipe and BlazePose wrapped with fitness building blocks | Motion SDK with assessments and workouts; no-UI Custom Kit or white-label Branded Kit |\n| Platforms | iOS 14.0+; Android API 26 (sample code API 28); React Native plugin | iOS, Android, React Native, Flutter; JavaScript and Unity marked \"NA\" |\n| iOS floor | iOS 14.0 | iOS 16.0 in the Custom Kit's demo Podfile; iOS 15 or later for SMKitUI |\n| Models | MediaPipe libraries ship inside the SDK modules; product pages describe on-device inference | Downloaded from Sency's server at configuration; no bundled fallback; a valid cache works offline later |\n| Built-in UI | Overlays and SwiftUI camera utilities | None in SMKit; a full white-label experience in SMKitUI |\n| Fitness layer | Exercise counters, range of motion, feedback events, gestures | Assessments, progress evaluations, workout plans, body calibration, adaptive range of motion |\n| Pricing published | Yes: free for 10 monthly active devices, then $25 to $1,000 a month up to 100,000 devices | Yes, on two pages that differ: Starter free up to 100 monthly active users and Growth from $499 a month up to 3,800 on one; a free trial, then a minimal monthly fee covering up to 100 active users, on the other |\n| Billing unit | Monthly active device | Monthly active user |\n| Getting a key | Free signup at dev.quickpose.ai | Key emailed after you subscribe to a plan; sign-up starts from a contact form |\n| License | Apache-2.0 on the iOS repo; terms license the SDK under Apache 2.0 with fees; npm plugin MIT | Proprietary: Sency's Terms of Use; commercial or production use needs a separate paid agreement |\n| Distribution | Swift Package Manager or CocoaPods from GitHub, Maven (ai.quickpose), npm @quickpose/react-native | CocoaPods and SPM from Sency's Bitbucket, Maven (com.sency), npm @sency/react-native-smkit and -ui, pub.dev flutter_smkit and flutter_smkit_ui |\n| Recent releases | npm plugin 0.7.1 on 2026-08-26; iOS and Android repos pushed late August 2026 | npm UI package 2.4.3 and Flutter UI 1.6.0 on 2026-09-23 |\n\n## Where QuickPose wins\n\n**A far cheaper first paid step, and you can start today.** QuickPose's paid plans start at $25 a month for up to 100 monthly active devices and rise in small steps, every SDK feature is on every plan, and its SDK key is free to register. Sency's first published paid plan, Growth, starts from $499 a month; its key arrives by email after you subscribe to a plan, and its sign-up path runs through a contact form. For a small team launching on a few hundred phones, that difference is decisive.\n\n**The models are inside your app.** QuickPose's modules bundle MediaPipe, and its product pages describe on-device inference with no frames sent to a server. Sency's FAQ also says data is analyzed on the user's device and never sent to the cloud, but its iOS and Android SDKs fetch their models from Sency's server on first configuration, so a cold first launch with no connection cannot track.\n\n**A lower iOS floor and an open license on the code.** iOS 14 against Sency's iOS 15 or 16, and Apache-2.0 iOS code under terms that license the SDK under Apache 2.0, against Sency's proprietary Terms of Use.\n\n**Measurement breadth.** Range of motion for five joint groups and counters for 20 exercises are exposed as building blocks you can recombine, which suits biomechanics, physio-style measurement and custom exercise logic.\n\n## Where Sency wins\n\n**Flutter.** Sency ships Flutter packages for both kits; QuickPose's public packages cover iOS, Android and React Native.\n\n**A finished experience if you want one.** SMKitUI is a white-label experience that is ready to use. QuickPose gives you overlays and camera utilities, but the screens, flow and content are yours to build.\n\n**Assessments and plans.** Sency's README leads with movement and fitness assessments, monthly progress evaluations and personalized workout plans, and its pricing page describes an assessment that takes less than 4 minutes. QuickPose has measurement primitives but no assessment or plan layer in its repositories.\n\n**A bigger free allowance, if the packages page applies.** Sency's pricing packages page lists a free Starter plan for up to 100 monthly active users with full access to the SDK, against QuickPose's free tier of 10 devices. Sency's main pricing page instead describes a free trial followed by a minimal monthly fee covering up to 100 active users, so confirm which applies; [Sency pricing](/pricing/sency-pricing) sets out both.\n\n**Billing by person, not device.** Sency counts each active user once a month and says it charges no extra for heavy use. For an audience that trains on several devices, a per-user unit can be simpler than QuickPose's per-device one.\n\n**Tooling for AI-assisted development.** Sency's iOS documentation describes an MCP server that gives AI coding tools its SDK documentation and exercise context.\n\n## Which should you pick?\n\n- **You want building blocks and full control of the product** → QuickPose. Its counters and measurements slot into your own UI, and the models ship with the app.\n- **You want assessments, plans or a ready-made UI** → Sency, Branded Kit for speed, Custom Kit if you want to own the screens but keep Sency's analysis.\n- **You ship Flutter** → Sency, unless you are willing to bridge QuickPose's native SDKs yourself.\n- **Offline from the very first launch, or pinned model files** → QuickPose, or MediaPipe directly.\n- **You need a browser target** → neither, from what is public. Sency marks JavaScript \"NA\", and QuickPose's documentation home mentions Wasm SDKs, but the only QuickPose package we found on npm is its React Native plugin and there is no public web repository. See [MediaPipe alternatives](/alternatives/mediapipe-alternatives) for browser-capable models, and note that KinesteX, which funds this site, embeds its experience in a web page through an iframe; [KinesteX vs Sency](/compare/kinestex-vs-sency) and [KinesteX vs QuickPose](/compare/kinestex-vs-quickpose) cover it with the same disclosure.\n\n## What neither vendor publishes\n\nNeither publishes an independent accuracy benchmark, and we have not measured either. Sency's pricing page mentions a record of 54 minutes from installing the SDK to a working assessment in a partner's app, which is a claim about integration speed, not accuracy. Test both on your own recorded exercises before you choose; [how to evaluate motion SDKs](/guides/evaluate-motion-sdks) sets out a protocol. [QuickPose pricing](/pricing/quickpose-pricing) and [Sency pricing](/pricing/sency-pricing) have the full plan tables, including the second page from each vendor that disagrees with its main price list. Everything above was read on October 17 and 18, 2026; both vendors shipped releases in the six weeks before that, so re-check versions, floors and prices before you commit.",
    "faqs": [
      {
        "q": "Is QuickPose or Sency cheaper?",
        "a": "QuickPose is far cheaper to start paying for: its SDK pricing page lists plans from $25 a month for up to 100 monthly active devices, while Sency's pricing packages page lists its Growth plan from $499 a month for up to 3,800 monthly active users. Sency's free allowance may be larger, a Starter plan for up to 100 users against QuickPose's 10 devices, but its main pricing page describes those 100 as a paid tier after a free trial. The units also differ, devices against users, so model both on your own numbers."
      },
      {
        "q": "Do QuickPose and Sency run their pose models on the device?",
        "a": "Both say the analysis happens on the device. QuickPose bundles MediaPipe libraries in its SDK modules, and its Android page says inference runs on the device and the SDK does not collect, store or transmit video or image data. Sency's FAQ says data is analyzed directly on the user's device and never sent to the cloud, but its iOS and Android documentation says the SDKs download their models and required assets from Sency's server during configuration, with no bundled fallback, and can use a valid cached copy offline afterwards."
      },
      {
        "q": "Does QuickPose or Sency support Flutter?",
        "a": "Sency does: its README lists flutter_smkit_ui for the Branded Kit and flutter_smkit for the Custom Kit, both published on pub.dev. QuickPose's public packages cover iOS, Android and a React Native plugin, and we found no Flutter package for it. A Flutter team choosing QuickPose would bridge its native SDKs itself."
      },
      {
        "q": "Which has a ready-made user interface, QuickPose or Sency?",
        "a": "Sency, through its Branded Kit, SMKitUI, which its README describes as a white-label deployment where the entire user interface and experience are ready to use. Sency's Custom Kit has no UI at all. QuickPose provides overlays and SwiftUI camera utilities, but the screens, flow and content around them are yours to build."
      }
    ],
    "related": [
      {
        "href": "/pricing/quickpose-pricing",
        "label": "QuickPose pricing"
      },
      {
        "href": "/pricing/sency-pricing",
        "label": "Sency pricing"
      },
      {
        "href": "/alternatives/sency-alternatives",
        "label": "Sency alternatives"
      },
      {
        "href": "/alternatives/quickpose-alternatives",
        "label": "QuickPose alternatives"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Both of these SDKs shipped releases in the six weeks before we checked. Subscribe and we will flag it when a platform, model delivery, license or price changes."
    },
    "sources": [
      {
        "url": "https://github.com/quickpose/quickpose-ios-sdk",
        "checked": "2026-10-17",
        "note": "description, MediaPipe modules, features, iOS 14.0+, SDK key, Apache-2.0"
      },
      {
        "url": "https://github.com/quickpose/quickpose-android-sdk",
        "checked": "2026-10-17",
        "note": "feature table, Android SDK 26, Maven artifacts"
      },
      {
        "url": "https://www.npmjs.com/package/@quickpose/react-native",
        "checked": "2026-10-17",
        "note": "0.7.1 published 2026-08-26, MIT"
      },
      {
        "url": "https://docs.quickpose.ai/docs/MobileSDK",
        "checked": "2026-10-17",
        "note": "min API 26, samples API 28 (snapshot)"
      },
      {
        "url": "https://docs.quickpose.ai/",
        "checked": "2026-10-17",
        "note": "Wasm SDKs mentioned on the docs home (snapshot)"
      },
      {
        "url": "https://quickpose.ai/sdk-pricing/",
        "checked": "2026-10-17",
        "note": "plans, device limits, prices, every feature on every plan (snapshot)"
      },
      {
        "url": "https://quickpose.ai/products/android-sdk/",
        "checked": "2026-10-17",
        "note": "on-device inference (snapshot)"
      },
      {
        "url": "https://quickpose.ai/terms-and-conditions/",
        "checked": "2026-10-17",
        "note": "Apache 2.0 license clause and fees (snapshot)"
      },
      {
        "url": "https://github.com/sency-ai/smkit-sdk",
        "checked": "2026-10-17",
        "note": "kits, platform and version tables, features, FAQ, Terms of Use LICENSE"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ios-demo",
        "checked": "2026-10-17",
        "note": "iOS 16.0, Bitbucket distribution, server-downloaded models, calibration, adaptive ROM, MCP server"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ui-ios-demo",
        "checked": "2026-10-17",
        "note": "SMKitUI iOS 15 or later, server-downloaded models"
      },
      {
        "url": "https://github.com/sency-ai/smkit-android-demo",
        "checked": "2026-10-17",
        "note": "com.sency Maven artifacts and server-delivered models"
      },
      {
        "url": "https://www.npmjs.com/package/@sency/react-native-smkit-ui",
        "checked": "2026-10-17",
        "note": "2.4.3 published 2026-09-23"
      },
      {
        "url": "https://pub.dev/packages/flutter_smkit_ui",
        "checked": "2026-10-17",
        "note": "1.6.0 published 2026-09-23"
      },
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-10-18",
        "note": "Starter and Growth plans, user limits and prices (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/pricing",
        "checked": "2026-10-17",
        "note": "trial, monthly fee, active-user billing, assessment length, integration record (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/faq-motion-tracking",
        "checked": "2026-10-18",
        "note": "on-device processing claim (read through a text reader; quotes re-checked on the page by CI)"
      }
    ],
    "firstParty": true
  },
  {
    "slug": "mediapipe-vs-movenet",
    "primaryQuery": "movenet vs mediapipe",
    "h1": "MediaPipe vs MoveNet: 33 Landmarks in 3D or 17 Keypoints Fast?",
    "metaTitle": "MoveNet vs MediaPipe (2026): Which Pose Model to Ship?",
    "metaDescription": "MoveNet vs MediaPipe BlazePose from Google's own cards and TF.js docs: 17 vs 33 keypoints, 3D world landmarks, browser FPS on the same devices, licenses.",
    "updated": "2026-10-22",
    "answer": "Pick MediaPipe Pose Landmarker (BlazePose) when you need geometry: it returns 33 landmarks with hip-centered 3D world coordinates in meters, so joint angles hold up when the user turns. Pick MoveNet when you need speed and simplicity: it returns the 17 COCO keypoints in 2D, and in the TF.js team's own browser benchmark MoveNet Lightning out-ran every BlazePose figure on an iPhone 12 and a Pixel 5. Both are Apache-2.0 Google models aimed at fitness, both are single-person apart from MoveNet MultiPose, and the TF.js pose-detection package serves both behind one API, so you can test each on your own devices before committing.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that sits a layer above pose models like these.** Neither model on this page is ours, both are free Google projects, and we have no reason to prefer either. Every fact below comes from Google's model cards, the google-ai-edge/mediapipe repository and the tensorflow/tfjs-models repository, read on October 22, 2026.\n\nA short version of this decision sits in [the pose models overview](/motion/pose-estimation-models-compared#mediapipe-vs-movenet-head-to-head). This page goes further on the four things that settle it in practice: what each output lets you compute, how fast each runs on the same hardware, how their keypoint numbering differs, and what a switch costs.\n\n## MediaPipe vs MoveNet at a glance\n\n| | MediaPipe Pose Landmarker (BlazePose GHUM) | MoveNet |\n| --- | --- | --- |\n| Keypoints | 33 landmarks | 17 COCO keypoints |\n| Per point | x, y, z, visibility, presence | y, x, confidence |\n| 3D | World landmarks in meters, origin between the hips; the card says z is \"not metric but up to scale\" | None |\n| Variants | Lite, Full, Heavy | SinglePose Lightning (192x192), SinglePose Thunder (256x256), MultiPose Lightning |\n| People | One, per the model card; the Tasks `num_poses` option defaults to 1 | One for SinglePose; up to 6 for MultiPose |\n| Camera distance | People beyond about 14 feet or 4 meters are out of scope | Most suitable 3 to 6 feet from a webcam |\n| Runtimes | MediaPipe Tasks on Android, iOS, web and Python; also the TF.js pose-detection package | TF.js pose-detection in the browser; TF Lite on device |\n| License | Apache-2.0 (framework and model card) | Apache-2.0 (tfjs-models code and SinglePose card); no license line in the MultiPose card text |\n\nBoth are built for this domain. Google's BlazePose GHUM card lists \"Fitness and repetition counting\" among its application domains, and the MoveNet SinglePose card says the model is \"Tuned to be robust on detecting fitness/fast movement with difficult poses and/or motion blur.\"\n\n## What each output lets you compute\n\n**MediaPipe has points MoveNet does not.** Sixteen of its 33 landmarks are outside COCO's 17: the inner and outer eye corners, the mouth corners, the pinky, index and thumb knuckles, the heels and the foot index points. Heel and toe points are the inputs a heel-lift check or an ankle angle needs, and the hand points let you read wrist position.\n\n**It also adds a third axis.** MediaPipe's Pose documentation describes world landmarks as \"Real-world 3D coordinates in meters with the origin at the center between hips\", and the TF.js pose-detection README places BlazePose's `keypoints3D` in a 2 x 2 x 2 meter space with the hip center at (0, 0, 0). The model card is plain about the limit: the z value comes from synthetic data fitted with the GHUM body model, and is up to scale rather than metric. In our reading that is still enough to keep a knee or hip angle meaningful when the user turns side-on, which a 2D angle from MoveNet cannot do. [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation) covers when the depth axis is worth having.\n\n**MoveNet gives you less, faster.** The SinglePose card describes a float32 output of shape [1, 1, 17, 3]: y and x normalized to the frame, then a confidence score, with a recommended default confidence threshold of 0.3. For counting reps from elbow or knee angles in a well-framed side view, 17 points are enough; [how rep counting works](/motion/how-rep-counting-works) shows the logic.\n\n## Speed: the one like-for-like table\n\nThe model cards do not cross-compare. BlazePose's card reports frames per second on a Pixel 3 through TFLite, and MoveNet's reports milliseconds in desktop Chrome. The TF.js pose-detection package is the exception: its MoveNet and BlazePose READMEs publish frames per second for both models on the same four machines, a 2019 15-inch MacBook Pro, an iPhone 12, a Pixel 5 and a desktop with an Intel i9-10900K and a GTX 1070.\n\n| Model and runtime | MacBook Pro | iPhone 12 | Pixel 5 | Desktop |\n| --- | --- | --- | --- | --- |\n| MoveNet SinglePose Lightning, WebGL | 104 | 51 | 34 | 87 |\n| MoveNet SinglePose Thunder, WebGL | 77 | 43 | 12 | 82 |\n| BlazePose, MediaPipe runtime (WASM and GPU) | 92, 81, 38 | N/A | 32, 22, N/A | 160, 140, 98 |\n| BlazePose, TF.js runtime (WebGL) | 48, 53, 28 | 34, 30, N/A | 12, 11, 5 | 44, 40, 30 |\n\nThe BlazePose README gives three figures per cell, one per model variant, but does not label which is lite, full or heavy; the MoveNet README labels its own order. Read with that caveat, the table says something the cards cannot. MoveNet Lightning is the fastest option on both phones. It is not the fastest everywhere: on the desktop, BlazePose under the MediaPipe runtime reached 160 FPS against Lightning's 87, and on the MacBook and the Pixel 5 BlazePose's best figure beats MoveNet Thunder. These are the TF.js team's browser numbers on its own hardware, so measure on your target devices; [real-time pose estimation](/motion/real-time-pose-estimation) covers the frame-rate budget. Accuracy does not line up either: the cards use different metrics and test sets, and Google's own quality table for BlazePose compares it with AlphaPose and Apple Vision, not MoveNet. [Pose estimation accuracy](/motion/pose-estimation-accuracy) explains the metrics.\n\n## Same names, different numbers\n\nBoth models return COCO's 17 body points, but not at the same indices. MoveNet follows the COCO order, so `left_hip` is index 11. In MediaPipe's `PoseLandmark` enum, `LEFT_HIP` is 23 and index 11 is `LEFT_SHOULDER`. Code that reads keypoints by position will silently read the wrong joint after a switch.\n\nMap by name instead. The TF.js package returns a `name` with every keypoint, and [the keypoint crosswalk](/pose-keypoints#crosswalk) joins all 17 COCO points to their BlazePose counterparts. The full orders are in [the BlazePose 33 keypoint map](/pose-keypoints/blazepose-33) and [the COCO 17 keypoint map](/pose-keypoints/coco-17).\n\n## What a switch costs\n\nIn a browser, little. The pose-detection README serves MoveNet, BlazePose and PoseNet through one `createDetector` call, and every model returns the same pose shape: a score and keypoints with x, y, score and name, with BlazePose adding `keypoints3D` and a segmentation mask. Testing both behind a flag is cheap. Two details can still decide it:\n\n- **React Native.** The BlazePose-MediaPipe README says it \"uses WebAssembly behind the scene and cannot be used with\" tfjs-react-native. MoveNet's `modelUrl` option accepts an `io.IOHandler`, which its README pairs with tfjs-react-native's `bundleResourceIO` to load the model from the app bundle.\n- **Download size.** The BlazePose README lists 10.6 MB, 14 MB and 34.9 MB for the lite, full and heavy models under the MediaPipe runtime. The MoveNet README publishes no equivalent table, so weigh your own build.\n\nNatively, the routes differ more: MediaPipe ships through its Tasks libraries for Android, iOS and Python, while MoveNet's cards name TensorFlow Lite for on-device use. Variant choice within each family is in [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models) and [MoveNet models](/motion/movenet-models).\n\n## Which should you pick?\n\n- **Squat depth, hip hinge, heel lift, or any movement where the user may turn side-on** → MediaPipe. Its world landmarks and foot points are the inputs that math needs.\n- **Live rep counting on low-end phones or in a mobile browser** → MoveNet Lightning, the fastest of the pair on both phones in the TF.js table.\n- **A desktop or laptop browser, such as a kiosk** → test BlazePose under the MediaPipe runtime first; on the TF.js team's desktop it out-ran both MoveNet models.\n- **Two to six people in frame** → MoveNet MultiPose Lightning, the only model in this pair whose card covers several people. Confirm its terms, since the text of its card has no license line.\n- **A user standing well back from the camera** → MediaPipe. MoveNet's cards call it most suitable 3 to 6 feet away, while BlazePose's card only rules out people further than about 14 feet.\n- **React Native through TF.js** → MoveNet, whose README documents loading from the app bundle.\n\n## What neither gives you\n\nBoth return keypoints and nothing more. Rep counting, form rules, mistake feedback and exercise content are yours to build, or to buy as an SDK; [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) compares the products that sell that layer, and [build vs buy AI motion tracking](/motion/build-vs-buy-ai-motion-tracking) sets out the trade.",
    "faqs": [
      {
        "q": "Is MoveNet faster than MediaPipe BlazePose?",
        "a": "On phones, in the TF.js team's own browser benchmark, yes: MoveNet SinglePose Lightning ran at 51 FPS on an iPhone 12 and 34 FPS on a Pixel 5, above every BlazePose figure published for those devices. Not everywhere, though: on the same team's Intel i9-10900K desktop with a GTX 1070, BlazePose under the MediaPipe runtime reached 160 FPS against Lightning's 87. Measure on your own hardware before choosing."
      },
      {
        "q": "Does MoveNet output 3D keypoints like MediaPipe's world landmarks?",
        "a": "No. MoveNet's SinglePose card describes a [1, 1, 17, 3] output holding y, x and a confidence score per keypoint, all in normalized 2D image coordinates. MediaPipe Pose adds world landmarks in meters with the origin between the hips, and through TF.js BlazePose returns keypoints3D alongside its 2D keypoints. BlazePose's depth is estimated from one camera and, per its model card, up to scale rather than metric."
      },
      {
        "q": "Why do my joint indices break when I switch from MoveNet to BlazePose?",
        "a": "Because the shared joints sit at different positions. MoveNet uses the COCO order, where left_hip is index 11; MediaPipe's PoseLandmark enum puts LEFT_HIP at 23 and LEFT_SHOULDER at 11. Look keypoints up by name rather than index: the TF.js pose-detection package returns a name with every keypoint, and both models use the same names for the 17 COCO body points."
      },
      {
        "q": "Can MoveNet or MediaPipe track several people at once?",
        "a": "MoveNet can, through MultiPose Lightning, which its README describes as a multi-pose detector that detects up to 6 poses, with optional tracking IDs across frames. MediaPipe's BlazePose GHUM card says the model tracks only one person on scene if multiple are present, and the Tasks num_poses option defaults to 1. MoveNet's SinglePose models also track one person, the one closest to the image center."
      },
      {
        "q": "Which works in React Native, MoveNet or BlazePose?",
        "a": "MoveNet has the documented path. Its TF.js README says the modelUrl option accepts an io.IOHandler, used with tfjs-react-native's bundleResourceIO to load the model from the app bundle. The BlazePose-MediaPipe README says that runtime uses WebAssembly and cannot be used with tfjs-react-native. The files we read do not document BlazePose's TF.js runtime under React Native either way, so test it before relying on it."
      }
    ],
    "related": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "Pose estimation models compared"
      },
      {
        "href": "/compare/mediapipe-vs-yolo-pose",
        "label": "MediaPipe vs YOLO pose"
      },
      {
        "href": "/motion/movenet-models",
        "label": "MoveNet Lightning, Thunder and MultiPose"
      },
      {
        "href": "/motion/mediapipe-pose-landmarker-models",
        "label": "MediaPipe Pose Landmarker models"
      },
      {
        "href": "/alternatives/mediapipe-alternatives",
        "label": "MediaPipe alternatives"
      }
    ],
    "cta": {
      "pitch": "Google's pose models change quietly, through a card, a README or a package. Subscribe and we will flag it when MediaPipe Pose or MoveNet changes."
    },
    "sources": [
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-22",
        "note": "33 keypoints, fitness and repetition counting, one person, 14 feet / 4 m out of scope, z up to scale, Pixel 3 TFLite figures, Apache-2.0"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/pose.md",
        "checked": "2026-10-22",
        "note": "world landmarks in meters from the hip center; quality table compared with AlphaPose and Apple Vision"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py",
        "checked": "2026-10-22",
        "note": "PoseLandmark enum indices; num_poses default 1"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/components/containers/landmark.py",
        "checked": "2026-10-22",
        "note": "visibility and presence fields"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/README.md",
        "checked": "2026-10-22",
        "note": "Android, iOS, Python and web"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE",
        "checked": "2026-10-22",
        "note": "Apache-2.0"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.SinglePose%20Model%20Card.pdf",
        "checked": "2026-10-22",
        "note": "inputs, [1, 1, 17, 3] output, fitness tuning, 3 to 6 feet, closest person, 0.3 threshold, Chrome benchmark, Apache-2.0 line"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.MultiPose%20Model%20Card.pdf",
        "checked": "2026-10-22",
        "note": "up to 6 people; no license line in the text"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/movenet/README.md",
        "checked": "2026-10-22",
        "note": "model types, modelUrl and bundleResourceIO, MultiPose tracking, FPS table"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/README.md",
        "checked": "2026-10-22",
        "note": "three models behind createDetector, keypoint fields, keypoints3D space"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/blazepose_tfjs/README.md",
        "checked": "2026-10-22",
        "note": "BlazePose FPS on the same four machines, bundle sizes"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/blazepose_mediapipe/README.md",
        "checked": "2026-10-22",
        "note": "cannot be used with tfjs-react-native"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/constants.ts",
        "checked": "2026-10-22",
        "note": "COCO_KEYPOINTS and BLAZEPOSE_KEYPOINTS orders"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/LICENSE",
        "checked": "2026-10-22",
        "note": "Apache-2.0"
      }
    ],
    "firstParty": true
  },
  {
    "slug": "mediapipe-vs-yolo-pose",
    "primaryQuery": "mediapipe vs yolo pose",
    "h1": "MediaPipe vs YOLO Pose: One Person in 3D or Everyone in 2D?",
    "metaTitle": "MediaPipe vs YOLO Pose (2026): BlazePose or YOLO26?",
    "metaDescription": "MediaPipe BlazePose vs Ultralytics YOLO26 pose: 33 vs 17 keypoints, one person vs everyone in frame, phone vs GPU benchmarks, Apache-2.0 vs AGPL-3.0.",
    "updated": "2026-10-22",
    "answer": "Pick MediaPipe Pose Landmarker (BlazePose) for one person in front of a phone camera: 33 landmarks with hip-centered 3D world coordinates, on-device on Android, iOS, web and Python, under Apache-2.0. Pick Ultralytics YOLO26 pose when several people share the frame: one model returns a box and the 17 COCO keypoints for every person it detects, in five sizes, and Ultralytics documents training it on your own keypoints. The license often decides first, because Ultralytics code is AGPL-3.0 unless you buy its Enterprise License.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that sits a layer above pose models like these.** Neither model on this page is ours, and we have no reason to prefer either. MediaPipe facts come from Google's BlazePose GHUM model card and the google-ai-edge/mediapipe repository; Ultralytics facts come from the docs, README and LICENSE in the ultralytics/ultralytics repository. All were read on October 22, 2026, and every Ultralytics figure is Ultralytics' own.\n\nA note on names, since searches mix them: BlazePose is the model family behind MediaPipe Pose, which Google's documentation says is built on its BlazePose research, and the current packaging is the MediaPipe Pose Landmarker task. On the other side, Ultralytics' pose docs now present YOLO26 as the current generation of YOLO pose models.\n\n## Two models for two different scenes\n\n**MediaPipe is built for one person.** Google's model card describes \"3D full body pose estimation for single-person videos on mobile, desktop and in browser\", says the model \"Tracks only one person on scene if multiple present\", and lists multiple people in an image as out of scope. The Tasks API has a `num_poses` option, but it defaults to 1 and the card does not evaluate more.\n\n**YOLO pose is built for everyone in the frame.** Ultralytics documents one `Results` object per image, with `result.keypoints` shaped (N, K, 2 or 3), N instances of K keypoints, and `result.boxes` for \"the detected instances that those keypoints belong to\". The training config's only class is person, and the default models predict the 17 COCO keypoints for each one.\n\n## MediaPipe vs YOLO pose at a glance\n\n| | MediaPipe Pose Landmarker (BlazePose GHUM) | Ultralytics YOLO26 pose |\n| --- | --- | --- |\n| Keypoints | 33 landmarks | 17 COCO keypoints in the default models |\n| Per point | x, y, z, visibility, presence; world landmarks in meters | x, y, plus optional visibility or confidence |\n| People | One, per the model card | Every detected person, each with a box |\n| Sizes | Lite, Full, Heavy | n, s, m, l, x |\n| Published speed | Frames per second on a Pixel 3 through TFLite | Milliseconds on a CPU with ONNX and on an NVIDIA T4 with TensorRT10 |\n| Deployment | MediaPipe Tasks on Android, iOS, web and Python | Export table of 23 formats, including ONNX, CoreML, LiteRT, NCNN, ExecuTorch and TensorRT |\n| Your own keypoints | Pre-trained models; no pose training recipe in the files we read | Training on your own keypoint datasets is documented |\n| License | Apache-2.0 | AGPL-3.0, or a paid Ultralytics Enterprise License |\n\n## Where MediaPipe wins\n\n**Depth and detail on one body.** Of the 33 landmarks, 16 are not in COCO's 17: eye corners, mouth corners, three knuckles per hand, heels and foot index points. MediaPipe's documentation describes world landmarks as \"Real-world 3D coordinates in meters with the origin at the center between hips\". The card is honest that z is \"not metric but up to scale\", but in our reading it still lets a knee or hip angle survive the user turning side-on. Ultralytics' results table documents only 2D coordinates: pixel and normalized x, y, plus an optional visibility or confidence value.\n\n**Phone numbers you can read.** Google's card gives on-device figures: on a Pixel 3, the Lite model runs at about 44 FPS on CPU and 49 FPS on GPU, Full at about 18 and 40, and Heavy at about 4 and 19. Ultralytics' table measures a CPU through ONNX and an NVIDIA T4 through TensorRT10, so nothing in it says how a phone will do.\n\n**A permissive license.** The MediaPipe repository's LICENSE is Apache-2.0, and the BlazePose GHUM card is \"LICENSED UNDER Apache License, Version 2.0\". No copyleft, no key and no fee.\n\n**A browser path.** MediaPipe Tasks covers web apps. Ultralytics' export table, as we read it, lists no TensorFlow.js target; whether a browser runtime can run one of its other formats is something to test yourself.\n\n## Where YOLO pose wins\n\n**Several people.** Each detected person comes back with a box and 17 keypoints, and the Ultralytics README says its models can track detected objects across video frames. Keeping identities stable is the hard part of group scenes; [multi-person pose tracking](/motion/multi-person-pose-tracking) covers it.\n\n**A size dial with published accuracy.** Ultralytics' table runs from YOLO26n-pose at 57.2 mAP pose 50-95, 2.9 M parameters and 1.8 ms on a T4, to YOLO26x-pose at 71.6 mAP, 57.6 M parameters and 12.2 ms, all at 640 pixels on COCO Keypoints val2017. The same table puts YOLO26n-pose at 40.3 ms on a CPU through ONNX. [Ultralytics YOLO pose models](/motion/yolo-pose-models) has the full table.\n\n**Your own keypoints.** The pose docs show training on your own data, converting COCO keypoint JSON with `convert_coco` and `use_keypoints=True`, and point to datasets such as Tiger-Pose, Hand Keypoints and Dog-Pose. Ultralytics' annotation tool supports \"custom keypoint layouts\". MediaPipe ships \"Pre-trained, ready-to-run models\", and we found no training recipe for the pose landmarker in the files we read.\n\n**Export breadth.** Ultralytics' export table lists 23 formats counting PyTorch itself, from CoreML (`.mlpackage`) and LiteRT (`.tflite`) for phones to TensorRT, OpenVINO and vendor formats such as Qualcomm QNN, Hailo and RKNN.\n\n## The license often decides first\n\nThe ultralytics/ultralytics LICENSE is the GNU Affero General Public License, version 3. Its section 13 says that if you modify the program, your modified version \"must prominently offer all users interacting with it remotely through a computer network\" an opportunity to receive its source. The Ultralytics README describes its Enterprise License as covering \"business products and services, including internal tools, automated workflows, and production deployments, bypassing the open-source requirements of AGPL-3.0\". In our reading, a closed-source app or service built on YOLO pose needs either full AGPL-3.0 compliance or that paid license; Ultralytics publishes no price for it in the files we read. This is not legal advice: [pose estimation model licenses](/motion/pose-estimation-model-licenses) reads the terms in full, and a lawyer should read them for your product.\n\nMediaPipe raises no such question. If you need several people and an Apache-2.0 codebase, [RTMPose](/motion/rtmpose-models) is the alternative to weigh, with its checkpoint terms checked separately.\n\n## The accuracy numbers do not cross\n\nGoogle's MediaPipe Pose documentation reports BlazePose GHUM Heavy at 68.1, 73.0 and 74.0 mAP on its own Yoga, Dance and HIIT validation sets, scored on the 17 COCO keypoints with one person 2 to 4 meters from the camera. Ultralytics reports YOLO26x-pose at 71.6 mAP pose 50-95 on COCO Keypoints val2017. Different test sets, different scenes, different hardware: neither vendor benchmarks the other, so the only comparison that means anything is one you run on your own footage. [Pose estimation accuracy](/motion/pose-estimation-accuracy) explains the metrics.\n\n## Moving keypoints between them\n\nYOLO pose returns the 17 points in COCO order, from 0 nose to 16 right ankle. MediaPipe's 33 include the same 17 body points under the same names, at different indices: left hip is 11 in COCO and `LEFT_HIP` is 23 in MediaPipe's `PoseLandmark` enum. Map by name, using [the COCO 17 keypoint map](/pose-keypoints/coco-17), [the BlazePose 33 keypoint map](/pose-keypoints/blazepose-33) and [the crosswalk](/pose-keypoints#crosswalk) that joins them.\n\n## Which should you pick?\n\n- **One user in front of a phone, joint angles for form feedback** → MediaPipe: 33 landmarks, world coordinates and published phone figures, under Apache-2.0.\n- **A group class, a gym floor, or two people in one frame** → YOLO pose, once the license question is settled.\n- **Keypoints that are not on the human body, or a layout of your own** → YOLO pose, which documents training on custom keypoint datasets.\n- **A closed-source product with no budget for a license** → MediaPipe for one person; for several, an Apache-2.0 option such as RTMPose.\n- **A web app** → MediaPipe, whose Tasks API covers the web; see also [MediaPipe vs MoveNet](/compare/mediapipe-vs-movenet) for the lighter browser option.\n\nNeither returns reps or form feedback. That layer is yours to build or buy; [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) compares the products that sell it.",
    "faqs": [
      {
        "q": "Can YOLO pose run on a phone like MediaPipe?",
        "a": "It can be exported for one: Ultralytics' export table lists CoreML (.mlpackage) and LiteRT (.tflite) among 23 formats. What Ultralytics does not publish is a phone benchmark; its table measures a CPU through ONNX and an NVIDIA T4 through TensorRT10. Google's BlazePose card, by contrast, reports frames per second on a Pixel 3. Measure YOLO pose on your own target phones before you commit."
      },
      {
        "q": "Does YOLO pose output 3D keypoints?",
        "a": "Not in the results Ultralytics documents. Its pose results table lists keypoints.xy in pixels and keypoints.xyn normalized, both 2D, and keypoints.data as x, y plus an optional visibility or confidence value. MediaPipe Pose Landmarker returns a z value per landmark and world landmarks in meters from the hip center, though its model card says that depth is up to scale rather than metric."
      },
      {
        "q": "Is YOLO pose more accurate than MediaPipe?",
        "a": "The published numbers cannot answer that. Ultralytics reports YOLO26x-pose at 71.6 mAP pose 50-95 on COCO Keypoints val2017; Google reports BlazePose GHUM Heavy at 68.1 to 74.0 mAP on its own Yoga, Dance and HIIT sets with one person in frame. Different datasets and scenes mean the figures do not compare, so test both on footage of your own exercises."
      },
      {
        "q": "Do I need an Ultralytics Enterprise License to ship a YOLO pose app?",
        "a": "If you cannot meet AGPL-3.0, in our reading yes. Ultralytics' code is licensed under the GNU AGPL version 3, and its README describes the Enterprise License as covering business products, internal tools and production deployments, bypassing the open-source requirements of AGPL-3.0. Ultralytics publishes no price for it in the files we read. Have a lawyer read the terms for your product."
      },
      {
        "q": "Can I train YOLO pose on my own keypoints?",
        "a": "Yes. Ultralytics' pose docs walk through training YOLO26n-pose, converting existing COCO keypoint JSON with convert_coco and use_keypoints=True, and point to keypoint datasets such as Tiger-Pose, Hand Keypoints and Dog-Pose. Its annotation tool supports custom keypoint layouts. MediaPipe ships pre-trained pose models, and we found no training recipe for its pose landmarker in the files we read."
      }
    ],
    "related": [
      {
        "href": "/motion/yolo-pose-models",
        "label": "Ultralytics YOLO pose models"
      },
      {
        "href": "/motion/mediapipe-pose-landmarker-models",
        "label": "MediaPipe Pose Landmarker models"
      },
      {
        "href": "/compare/mediapipe-vs-movenet",
        "label": "MediaPipe vs MoveNet"
      },
      {
        "href": "/motion/pose-estimation-model-licenses",
        "label": "Pose model licenses, AGPL included"
      },
      {
        "href": "/alternatives/openpose-alternatives",
        "label": "OpenPose alternatives"
      }
    ],
    "cta": {
      "pitch": "Ultralytics renames and re-benchmarks its pose models often, and license terms move too. Subscribe and we will flag it when either side of this comparison changes."
    },
    "sources": [
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-22",
        "note": "single-person scope, Pixel 3 FPS per variant, z up to scale, Apache-2.0"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/pose.md",
        "checked": "2026-10-22",
        "note": "BlazePose research, world landmarks, Yoga/Dance/HIIT quality table"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py",
        "checked": "2026-10-22",
        "note": "num_poses default 1; PoseLandmark indices"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/README.md",
        "checked": "2026-10-22",
        "note": "Android, iOS, Python and web apps; pre-trained, ready-to-run models"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE",
        "checked": "2026-10-22",
        "note": "Apache-2.0"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/docs/en/tasks/pose.md",
        "checked": "2026-10-22",
        "note": "YOLO26 pose, Results fields, COCO keypoint order, training and custom datasets, benchmark conditions"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/docs/macros/yolo-pose-perf.md",
        "checked": "2026-10-22",
        "note": "five-size table"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/docs/macros/export-table.md",
        "checked": "2026-10-22",
        "note": "23 export formats; no TensorFlow.js row"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/datasets/coco-pose.yaml",
        "checked": "2026-10-22",
        "note": "kpt_shape and the single person class"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/README.md",
        "checked": "2026-10-22",
        "note": "tracking across frames; AGPL-3.0 and Enterprise License"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/LICENSE",
        "checked": "2026-10-22",
        "note": "GNU AGPL version 3, section 13"
      }
    ],
    "firstParty": true
  },
  {
    "slug": "apple-vision-vs-mediapipe",
    "primaryQuery": "apple vision vs mediapipe",
    "h1": "Apple Vision vs MediaPipe: Native iOS Body Pose or a Cross-Platform Model?",
    "metaTitle": "Apple Vision vs MediaPipe (2026): Body Pose on iOS",
    "metaDescription": "Apple Vision body pose vs MediaPipe Pose Landmarker, from Apple's and Google's docs: 19 vs 33 points, 3D in meters, people per frame, platforms.",
    "updated": "2026-10-27",
    "answer": "Pick Apple Vision when the app only runs on Apple devices: VNDetectHumanBodyPoseRequest ships inside the OS from iOS 14, returns 19 named 2D joints for each person it detects, and adds no model file to your app. Pick MediaPipe Pose Landmarker when you also need Android or the web, hand and foot points, or a model version you can pin: it returns 33 landmarks plus world coordinates in meters from a .task bundle you ship, under Apache-2.0. For 3D on Apple hardware, Vision's separate iOS 17 request returns 17 joints in meters, for the most prominent person only.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that sits a layer above pose models like these.** Neither product on this page is ours, and we have no reason to prefer either. Apple facts come from Apple's Vision documentation; MediaPipe facts come from Google's Pose Landmarker guides and the google-ai-edge/mediapipe repository. All were read on October 27, 2026.\n\nThe two names do not sit at quite the same layer. Apple Vision is an operating-system framework: `VNDetectHumanBodyPoseRequest` and its 3D sibling run a pose model Apple ships inside iOS, iPadOS, macOS, tvOS and visionOS. MediaPipe Pose Landmarker is a model bundle plus a cross-platform task library that you add to your app. What Apple documents about its own request, on its own, is in [Apple Vision body pose on iOS](/motion/apple-vision-body-pose); this page puts the two side by side.\n\n## Apple Vision vs MediaPipe at a glance\n\n| | Apple Vision body pose | MediaPipe Pose Landmarker |\n| --- | --- | --- |\n| 2D points | 19 named joints (`VNHumanBodyPoseObservation.JointName`) | 33 landmarks, indexed 0 to 32 |\n| Hands and feet | None in the 19; the iOS 18 `DetectHumanBodyPoseRequest` can add hand observations | Pinky, index and thumb points per hand; heel and foot index per foot |\n| 3D | Separate request from iOS 17 and macOS 14: 17 joints in meters, origin at the root joint between the hips | World landmarks in meters, origin at the center between the hips, from the same call |\n| People per frame | 2D: one observation per detected pose; 3D: the most prominent person only | Up to `num_poses`, which defaults to 1 |\n| Platforms | Apple only: iOS and iPadOS 14, macOS 11, Mac Catalyst 14, tvOS 14, visionOS 1 for the 2D request | Android, iOS, Python and web |\n| What you ship | Nothing: the model is part of the OS | A `.task` model bundle: lite, full or heavy |\n| Versioning | Request revisions inside the OS | The bundle file you choose and keep |\n| License | Part of Apple's SDK | Apache-2.0 |\n\n## What each returns in 2D\n\n**Vision names 19 joints.** Apple's documentation says that starting in iOS 14 and macOS 11, Vision identifies human body poses \"by detecting up to 19 unique body points\". The joint names are grouped as head (nose, eyes, ears, neck), arms (shoulders, elbows, wrists), waist (`root`) and legs (hips, knees, ankles). Each `VNRecognizedPoint` carries x and y in normalized coordinates and a confidence score, and Apple's article says to ignore points with a confidence of 0, \"because they’re invalid\". The same article puts the origin at the bottom-left of the image.\n\n**MediaPipe has 33 landmarks.** Google's Pose Landmarker guide lists them from 0 nose to 32 right foot index, and each landmark carries x, y, z, visibility and presence. Sixteen of the 33 have no Vision counterpart: four eye corners, two mouth corners, three hand points per side and two foot points per side. The heel and foot index points are what an ankle angle or a heel-lift check needs, which the 19 Vision joints cannot supply. Vision has two points MediaPipe does not: `neck` and `root`. In MediaPipe you would derive them, for example as midpoints of the shoulders and of the hips.\n\n**Hands are a recent addition on Apple's side.** `DetectHumanBodyPoseRequest`, the Swift-only request available from iOS 18 and macOS 15, has a `detectsHands` property that Apple describes as \"A Boolean value that detects hands of the body in the results, if they’re visible\", defaulting to true and requiring the request's revision 2. Its observation exposes `leftHand` and `rightHand` as separate hand-pose observations rather than adding points to the body skeleton.\n\n## Several people in frame\n\nApple's 2D article says the request \"returns a unique observation for each detected human body pose\", so one call can return several skeletons. Its accuracy advice also warns that \"Attempting to detect body poses in dense crowd scenes is likely to produce inaccurate results\". MediaPipe's `num_poses` option is \"The maximum number of poses detected by the Pose Landmarker\", default 1, so you raise it explicitly. Neither guide documents keeping each person's identity from frame to frame; [multi-person pose tracking](/motion/multi-person-pose-tracking) covers that layer.\n\n## 3D: two different promises\n\nVision's 3D request is a separate API with a higher floor: iOS 17 and macOS 14. Apple's article says it measures \"17 individual joint locations in 3D space\", in meters, relative to a root joint between the left and right hip. Three details matter for fitness code:\n\n- **One person.** \"The request only supports the detection and results for the most prominent person in the frame, so it generates a single observation.\"\n- **All or nothing.** \"The framework doesn’t return a partial list of joints, so you get all 17 joints or none.\"\n- **Depth helps but is optional.** The request runs without depth data, and Apple says providing it \"improves detection accuracy\". `bodyHeight` is a measured value only when the capture session uses the LiDAR camera; otherwise Apple says it returns \"a reference height of `1.8` meters\".\n\nMediaPipe returns its 3D output from the same call as the 2D landmarks. Google's legacy Pose documentation describes world landmarks as \"Real-world 3D coordinates in meters with the origin at the center between hips\", and the Pose Landmarker guide says the model \"outputs an estimate of 33 3-dimensional pose landmarks\". Its inputs are still images, decoded video frames or a live feed; the guide lists no depth input. Whether you need a third axis at all is the subject of [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation).\n\n## Shipping and keeping it working\n\n**Vision adds no model bytes.** The model ships in the OS, and the request is the API. The flip side is that the implementation updates when Apple updates it. The 2D request documents `VNDetectHumanBodyPoseRequestRevision1`, and the iOS 18 request has a `Revision` type whose listed case is `revision2`; what changes between them, and when, is Apple's to decide.\n\n**MediaPipe adds a file you control.** The iOS guide installs the `MediaPipeTasksVision` library through Swift Package Manager and points `BaseOptions.modelAssetPath` at a `pose_landmarker.task` file in the app bundle; Android uses the `com.google.mediapipe:tasks-vision` library, and the web uses the `@mediapipe/tasks-vision` npm package. When we requested the three bundles from Google's model storage on October 27, 2026, they were 5,777,746 bytes (lite), 9,398,198 bytes (full) and 30,664,242 bytes (heavy). Because the file is yours, an old version stays reproducible in a regression suite. [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models) compares the three.\n\n**Platform reach decides many projects outright.** Every platform Apple lists for Vision is an Apple platform. A team with an Android app either writes a second pose pipeline, with different joints and different failure modes, or uses one model on both, which MediaPipe supports.\n\n## What is published about accuracy\n\nApple's documentation gives guidance rather than figures. For the 2D request it says the subject's height \"should ideally be at least a third of the overall image height\", that a large portion of the body should be in frame, and that \"A subject wearing flowing or robe-like clothing reduces the detection accuracy.\"\n\nThe only side-by-side numbers come from Google. MediaPipe's legacy Pose documentation scores BlazePose GHUM against \"Apple Vision\" on Google's own Yoga, Dance and HIIT validation sets, each image holding one person 2 to 4 meters from the camera, on the 17 COCO keypoints. Apple Vision scored 32.8, 36.4 and 44.5 mAP and 82.7, 91.4 and 88.6 PCK@0.2; BlazePose GHUM Heavy scored 68.1, 73.0 and 74.0 mAP. Read it as a vendor benchmarking a competitor on its own test set, with no Vision version stated. [Pose estimation accuracy](/motion/pose-estimation-accuracy) explains the metrics, and your own footage is the only test that settles it.\n\n## Mapping joints between them\n\nVision identifies joints by name, not by integer index, so code that reads MediaPipe's `landmarks[23]` has no direct equivalent. The 12 limb joints (shoulders, elbows, wrists, hips, knees, ankles) and the five face points (nose, eyes, ears) exist on both sides under matching names, which makes a name-keyed lookup the safe way to share form rules. The full lists are in [the Apple Vision 2D joint map](/pose-keypoints/apple-vision-2d), [the Apple Vision 3D joint map](/pose-keypoints/apple-vision-3d) and [the BlazePose 33 keypoint map](/pose-keypoints/blazepose-33).\n\n## Which should you pick?\n\n- **An iOS-only app that counts reps from elbow, hip or knee angles in 2D** → Apple Vision. No model file, no extra dependency, and a 2D request available back to iOS 14.\n- **An app on iOS and Android, or in a browser** → MediaPipe, so one model and one set of joint rules serve every platform.\n- **Squat depth, heel lift, ankle angles or grip** → MediaPipe, whose heel, foot index and hand points Vision's 19 joints do not include.\n- **3D on Apple hardware with a depth camera** → test Vision's 3D request, which uses depth when it is present and can measure body height with LiDAR; remember it reports one person only.\n- **Golden-clip regression tests that must not move between releases** → MediaPipe, because the model file is pinned in your repository; with Vision, plan to re-run the clips on each OS release.\n\n## What neither gives you\n\nBoth return points, not workouts. Rep counting, form rules and feedback are yours to build or buy: [how rep counting works](/motion/how-rep-counting-works) shows the logic, [AI workout tracking in Swift](/guides/ai-workout-tracking-ios-swift) wires Vision into an iOS app, and [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) compares products that sell the layer above.",
    "faqs": [
      {
        "q": "How many joints does Apple Vision detect compared with MediaPipe?",
        "a": "Apple's 2D request, VNDetectHumanBodyPoseRequest, detects up to 19 named body points: nose, eyes, ears, neck, shoulders, elbows, wrists, a root point at the waist, hips, knees and ankles. Its 3D request returns 17 joints. MediaPipe Pose Landmarker returns 33 landmarks, including eye and mouth corners, three points on each hand, and a heel and foot index on each foot, which Vision's 19 do not include."
      },
      {
        "q": "Can Apple Vision body pose run on Android?",
        "a": "No. Every platform Apple lists for VNDetectHumanBodyPoseRequest is an Apple one: iOS, iPadOS, Mac Catalyst, macOS, tvOS and visionOS. An Android version of the same app needs a different pose model. MediaPipe Pose Landmarker documents Android, iOS, Python and web, so teams shipping on both phones often use it everywhere and keep one set of joint rules."
      },
      {
        "q": "Does Apple Vision detect more than one person, unlike MediaPipe's default?",
        "a": "The 2D request does: Apple's article says it returns a unique observation for each detected human body pose, though it warns that dense crowd scenes are likely to produce inaccurate results. The 3D request supports only the most prominent person in the frame. MediaPipe Pose Landmarker detects up to num_poses people, an option that defaults to 1, so you raise it to track more."
      },
      {
        "q": "Is Apple Vision less accurate than MediaPipe BlazePose?",
        "a": "Apple publishes no accuracy figures to answer that. The only side-by-side numbers come from Google: MediaPipe's legacy Pose documentation scores Apple Vision at 32.8 to 44.5 mAP on Google's own Yoga, Dance and HIIT sets, against 68.1 to 74.0 for BlazePose GHUM Heavy. That is a vendor benchmarking a competitor on its own test set with no Vision version stated, so test both on your own footage."
      },
      {
        "q": "Does Apple Vision body pose need a depth camera for 3D?",
        "a": "No. Apple says VNDetectHumanBodyPose3DRequest runs without depth data, uses it when available, and that providing depth improves detection accuracy. Body height is measured only when the capture session uses the LiDAR camera; otherwise bodyHeight returns a reference height of 1.8 meters. MediaPipe's world landmarks come from ordinary image or video input, with no depth input in its guide."
      }
    ],
    "related": [
      {
        "href": "/motion/apple-vision-body-pose",
        "label": "Apple Vision body pose on iOS"
      },
      {
        "href": "/compare/ml-kit-vs-mediapipe",
        "label": "ML Kit vs MediaPipe"
      },
      {
        "href": "/compare/mediapipe-vs-movenet",
        "label": "MediaPipe vs MoveNet"
      },
      {
        "href": "/motion/mediapipe-pose-landmarker-models",
        "label": "MediaPipe Pose Landmarker models"
      },
      {
        "href": "/pose-keypoints/apple-vision-2d",
        "label": "All 19 Vision 2D joint names"
      },
      {
        "href": "/alternatives/mediapipe-alternatives",
        "label": "MediaPipe alternatives"
      }
    ],
    "cta": {
      "pitch": "Apple revises Vision with each OS release and Google moves MediaPipe's guides quietly. Subscribe and we will flag it when either side of this comparison changes."
    },
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest",
        "checked": "2026-10-27",
        "note": "platforms from iOS 14 and macOS 11; revision 1"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/detecting-human-body-poses-in-images",
        "checked": "2026-10-27",
        "note": "19 body points, one observation per detected pose, normalized points with a lower-left origin, confidence 0 invalid, accuracy guidance"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname",
        "checked": "2026-10-27",
        "note": "the 19 joint names by group"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vndetecthumanbodypose3drequest",
        "checked": "2026-10-27",
        "note": "3D request from iOS 17 and macOS 14; depth data improves accuracy"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/identifying-3d-human-body-poses-in-images",
        "checked": "2026-10-27",
        "note": "17 joints in meters, most prominent person only, all 17 or none, root origin, 1.8 m reference height, LiDAR"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/detecthumanbodyposerequest",
        "checked": "2026-10-27",
        "note": "Swift request from iOS 18 and macOS 15"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/detecthumanbodyposerequest/detectshands",
        "checked": "2026-10-27",
        "note": "detectsHands, default true, needs revision 2"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/humanbodyposeobservation",
        "checked": "2026-10-27",
        "note": "leftHand and rightHand observations"
      },
      {
        "url": "https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker",
        "checked": "2026-10-27",
        "note": "33 landmarks, image and world coordinates, segmentation mask, num_poses default 1, running modes, lite/full/heavy bundles"
      },
      {
        "url": "https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/ios",
        "checked": "2026-10-27",
        "note": "MediaPipeTasksVision via Swift Package Manager; modelAssetPath"
      },
      {
        "url": "https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/android",
        "checked": "2026-10-27",
        "note": "com.google.mediapipe:tasks-vision"
      },
      {
        "url": "https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js",
        "checked": "2026-10-27",
        "note": "@mediapipe/tasks-vision on npm"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/pose.md",
        "checked": "2026-10-27",
        "note": "world landmarks in meters; quality table including Apple Vision"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/components/containers/landmark.py",
        "checked": "2026-10-27",
        "note": "visibility and presence fields"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE",
        "checked": "2026-10-27",
        "note": "Apache-2.0"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
        "checked": "2026-10-27",
        "note": "bundle sizes from the Content-Length of the lite, full and heavy files"
      }
    ],
    "firstParty": true
  },
  {
    "slug": "ml-kit-vs-mediapipe",
    "primaryQuery": "ml kit vs mediapipe pose",
    "h1": "ML Kit vs MediaPipe Pose: Same 33 Landmarks, Different Packaging",
    "metaTitle": "ML Kit vs MediaPipe Pose (2026): Which to Use?",
    "metaDescription": "ML Kit Pose Detection vs MediaPipe Pose Landmarker from Google's docs: same 33 landmarks, beta SDK vs Apache-2.0, platforms, 3D, people, sizes and speed.",
    "updated": "2026-10-27",
    "answer": "ML Kit Pose Detection and MediaPipe Pose Landmarker come from the same Google research and return the same 33 landmarks at the same indices; the choice is about packaging. Pick ML Kit for an Android and iOS app that wants one person's skeleton with no model file to manage, and can accept a beta API that Google says has no SLA or deprecation policy. Pick MediaPipe for the web or Python, world landmarks in meters, more than one person, segmentation masks, or an Apache-2.0 model you ship and pin yourself.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that sits a layer above pose models like these.** Both products on this page are Google's, neither is ours, and we have no reason to prefer either. Every fact below comes from Google's ML Kit guides, reference and terms, Google's MediaPipe Pose Landmarker guides, and the google-ai-edge/mediapipe repository, all read on October 27, 2026.\n\nThese are close relatives rather than rivals. Google's MediaPipe Pose documentation says its BlazePose research \"also powers the ML Kit Pose Detection API\". Both return 33 body landmarks at the same indices. What differs is the packaging around the model: ML Kit is a closed, beta SDK for Android and iOS with no model file to handle, and MediaPipe Pose Landmarker is an open-source task library with a model bundle you ship, on more platforms and with more options. What ML Kit documents about itself is in [ML Kit pose detection](/motion/ml-kit-pose-detection); this page sets the two side by side.\n\n## ML Kit vs MediaPipe at a glance\n\n| | ML Kit Pose Detection | MediaPipe Pose Landmarker |\n| --- | --- | --- |\n| Landmarks | 33, values 0 to 32 | 33, indices 0 to 32 |\n| Per landmark | x, y, an experimental z, in-frame likelihood | x, y, z, visibility, presence; plus world landmarks in meters |\n| People | One per image | Up to `num_poses`, default 1 |\n| Variants | Base SDK and accurate SDK | Lite, full and heavy model bundles |\n| Platforms | Android and iOS | Android, iOS, Python and web |\n| How the model ships | Statically linked into the app at build time | A `.task` file you bundle and load |\n| Extras | None documented | Optional segmentation masks |\n| Status | Beta, with no SLA or deprecation policy | Open source |\n| Terms | ML Kit Terms of Service; usage metrics go to Google | Apache-2.0 |\n\n## Same landmarks, almost the same names\n\nML Kit's Android `PoseLandmark` reference and MediaPipe's `PoseLandmark` enum assign the same numbers to the same body points, from 0 nose to 32 right foot index; `LEFT_HIP` is 23 in both. Only the mouth corners are spelled differently: ML Kit's `LEFT_MOUTH` (9) and `RIGHT_MOUTH` (10) are MediaPipe's `MOUTH_LEFT` and `MOUTH_RIGHT`. Index-based code moves between them unchanged, which makes a later switch cheaper than between most pose models. Both maps are on [the ML Kit landmark page](/pose-keypoints/ml-kit) and [the BlazePose 33 keypoint map](/pose-keypoints/blazepose-33).\n\n## Where they differ in output\n\n**Depth.** ML Kit calls its Z coordinate \"an experimental value\" that is measured in image pixels like X and Y \"but it is not a true 3D value\", with its origin near the center between the hips and no upper or lower bound. MediaPipe returns two sets of landmarks from one call: normalized image landmarks, whose z uses the hip midpoint as origin and \"roughly the same scale as x\", and world landmarks that Google's documentation describes as \"Real-world 3D coordinates in meters with the origin at the center between hips\". If you need joint angles that survive the user turning side-on, MediaPipe's world landmarks are the documented route; [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation) covers when that matters.\n\n**Per-point scores.** ML Kit's InFrameLikelihood is, in Google's words, \"a measure that indicates the probability that the landmark is within the image frame\", from 0.0 to 1.0. When part of the body is outside the image, ML Kit still returns all 33 points and gives the missing ones coordinates outside the frame. MediaPipe gives two scores per landmark, visibility and presence.\n\n**People and masks.** ML Kit's overview is direct: \"Pose detection can only detect one person in an image.\" With two people, it assigns the landmarks to the person detected with the highest confidence, and Google adds that \"The user's face must be present in order to detect a pose.\" MediaPipe's `num_poses` sets \"The maximum number of poses detected by the Pose Landmarker\", defaulting to 1, and its `output_segmentation_masks` option returns a person mask. For groups, start from [multi-person pose tracking](/motion/multi-person-pose-tracking).\n\n## Speed and size, as Google publishes them\n\nML Kit publishes both. Its Android guide lists the base `pose-detection` SDK at about 10.1 MB and about 30 FPS on a Pixel 3XL, and `pose-detection-accurate` at about 13.3 MB and about 23 FPS with CPU or about 30 FPS with GPU. Its iOS guide lists up to 29.6 MB at about 45 FPS for `PoseDetection` and up to 33.2 MB at about 29 FPS for `PoseDetectionAccurate`, both on an iPhone X.\n\nMediaPipe's current Pose Landmarker guides, the overview and the Android, iOS and web pages, publish neither figure. When we requested the three bundles from Google's model storage on October 27, 2026, they were 5,777,746 bytes (lite), 9,398,198 bytes (full) and 30,664,242 bytes (heavy); that is the model file alone, before the task library. For speed, Google's legacy Pose documentation gives BlazePose GHUM latencies on a Pixel 3 with TFLite GPU of 20 ms for lite, 25 ms for full and 53 ms for heavy. Those are different devices and different measures from ML Kit's, so they do not compare; measure on your target phones. [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models) goes deeper on the three variants.\n\n## Platforms and integration\n\nML Kit's pose guides cover Android and iOS only. The Android guide needs API level 23 or above and, on the day we read it, printed the dependencies `com.google.mlkit:pose-detection:18.0.0-beta5` and `com.google.mlkit:pose-detection-accurate:18.0.0-beta5`; the iOS guide printed the pods `GoogleMLKit/PoseDetection` and `GoogleMLKit/PoseDetectionAccurate` at 8.0.0. Google says the Android SDKs' code and assets, and the iOS detectors' assets, are statically linked into the app at build time, so there is no model file to download or version separately. Detection runs in `STREAM_MODE`, which tracks the most prominent person between frames, or `SINGLE_IMAGE_MODE`, and on Android `setPreferredHardwareConfigs` chooses between `CPU` and `CPU_GPU`.\n\nMediaPipe adds Python and the web. Android uses the `com.google.mediapipe:tasks-vision` library, iOS the `MediaPipeTasksVision` package through Swift Package Manager, and the web the `@mediapipe/tasks-vision` npm package; each loads a `.task` model you supply. Running modes are `IMAGE`, `VIDEO` and `LIVE_STREAM` on Android, iOS and Python; for the web the guide lists only `IMAGE` and `VIDEO`. Shipping the file yourself is extra work, and it is also what lets you pin a model version for regression tests.\n\n## Terms, status and data\n\n**ML Kit is beta.** Google's overview says the API \"is offered in beta, and is not subject to any SLA or deprecation policy\", and that changes \"may be made to this API that break backward compatibility\".\n\n**ML Kit has terms, not a license file.** The ML Kit Terms of Service, last modified May 14, 2025, say processing of input data \"fully happens on-device\", and also that the APIs \"send metrics about the performance and utilization of the APIs in your app to Google\", which the developer is responsible for telling users about where the law requires it. The terms treat machine learning models as related software and forbid attempts to reverse engineer or extract them.\n\n**MediaPipe is Apache-2.0.** The repository's LICENSE is the Apache License, Version 2.0, and the code is there to read, fork or build from source. [Pose estimation model licenses](/motion/pose-estimation-model-licenses) reads both sets of terms in full; this is not legal advice.\n\n## Which should you pick?\n\n- **An Android and iOS app that wants one person's skeleton with the least setup** → ML Kit. No model file to ship or update, and Google publishes size and frame-rate figures for both SDKs.\n- **A web app, a Python pipeline or a server-side batch job** → MediaPipe; ML Kit's pose guides cover only Android and iOS.\n- **Joint angles in 3D, or a user who turns side-on** → MediaPipe, for world landmarks in meters rather than an experimental pixel-scale Z.\n- **Two or more people, or a segmentation mask** → MediaPipe, by raising `num_poses` or enabling masks; ML Kit detects one person.\n- **A product that cannot sit on a beta API or send usage metrics** → MediaPipe, under Apache-2.0 with a model file you control.\n- **Already on ML Kit and outgrowing it** → the shared landmark indices make MediaPipe the cheapest move; rename the two mouth constants and keep your rules.\n\n## What neither gives you\n\nGoogle's ML Kit overview says pose detection \"does not attach any meaning to the landmarks in a pose or the pose itself\", and the same is true of MediaPipe. Google's [pose classification tips](https://developers.google.com/ml-kit/vision/pose-detection/classifying-poses) show a k-NN approach for exercise classification and rep counting; [how rep counting works](/motion/how-rep-counting-works) covers the logic, and [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) compares products that sell that layer.",
    "faqs": [
      {
        "q": "Is ML Kit pose detection built on MediaPipe?",
        "a": "On the same research, by Google's account. MediaPipe's Pose documentation says its BlazePose research also powers the ML Kit Pose Detection API, and both return 33 landmarks with the same numbering, from 0 nose to 32 right foot index. The products differ: ML Kit is a beta SDK for Android and iOS with its model linked into the app, and MediaPipe is an open-source task library with a model bundle you load."
      },
      {
        "q": "Can I switch from ML Kit to MediaPipe without rewriting my pose code?",
        "a": "Mostly. ML Kit's PoseLandmark constants and MediaPipe's PoseLandmark enum give the same index to the same point, so rules written against landmark numbers carry over. Only the mouth corners are named differently, LEFT_MOUTH and RIGHT_MOUTH in ML Kit against MOUTH_LEFT and MOUTH_RIGHT in MediaPipe. The output objects, scores and setup code still change: in-frame likelihood becomes visibility and presence."
      },
      {
        "q": "Does ML Kit or MediaPipe run in a web browser?",
        "a": "MediaPipe does: Google documents a web guide that loads Pose Landmarker from the @mediapipe/tasks-vision npm package or a CDN, alongside Android, iOS and Python guides. ML Kit's pose detection guides cover Android and iOS only, so a web or desktop build needs MediaPipe or another model."
      },
      {
        "q": "Which is safer for a production app, ML Kit or MediaPipe?",
        "a": "It depends on which risk you weigh. ML Kit pose detection is offered in beta and, per Google, is not subject to any SLA or deprecation policy, and its terms say the APIs send performance and usage metrics to Google. MediaPipe is Apache-2.0 open source with a model file you control, but you ship, size and update that file yourself. Neither gives you rep counting or form feedback."
      }
    ],
    "related": [
      {
        "href": "/motion/ml-kit-pose-detection",
        "label": "ML Kit pose detection"
      },
      {
        "href": "/compare/apple-vision-vs-mediapipe",
        "label": "Apple Vision vs MediaPipe"
      },
      {
        "href": "/compare/mediapipe-vs-movenet",
        "label": "MediaPipe vs MoveNet"
      },
      {
        "href": "/pose-keypoints/ml-kit",
        "label": "ML Kit's 33 landmark constants"
      },
      {
        "href": "/motion/pose-estimation-model-licenses",
        "label": "Pose model licenses and ML Kit's terms"
      },
      {
        "href": "/alternatives/mediapipe-alternatives",
        "label": "MediaPipe alternatives"
      }
    ],
    "cta": {
      "pitch": "ML Kit's pose API is beta and MediaPipe's guides change without notice. Subscribe and we will flag it when either moves."
    },
    "sources": [
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection",
        "checked": "2026-10-27",
        "note": "beta status, 33 landmarks, one person, face required, in-frame likelihood, base vs accurate SDK, experimental Z, no meaning attached"
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection/android",
        "checked": "2026-10-27",
        "note": "SDK sizes and Pixel 3XL speeds, API level 23, 18.0.0-beta5, detection modes, hardware configs"
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection/ios",
        "checked": "2026-10-27",
        "note": "SDK sizes and iPhone X speeds, pods at 8.0.0, statically linked assets"
      },
      {
        "url": "https://developers.google.com/android/reference/com/google/mlkit/vision/pose/PoseLandmark",
        "checked": "2026-10-27",
        "note": "constant values, LEFT_MOUTH 9, LEFT_HIP 23"
      },
      {
        "url": "https://developers.google.com/ml-kit/terms",
        "checked": "2026-10-27",
        "note": "last modified May 14, 2025: on-device processing, metrics to Google, models as related software"
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection/classifying-poses",
        "checked": "2026-10-27",
        "note": "k-NN classification and rep counting tips"
      },
      {
        "url": "https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker",
        "checked": "2026-10-27",
        "note": "33 landmarks, world coordinates, segmentation mask, num_poses, running modes, bundles"
      },
      {
        "url": "https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/android",
        "checked": "2026-10-27",
        "note": "tasks-vision library"
      },
      {
        "url": "https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/ios",
        "checked": "2026-10-27",
        "note": "MediaPipeTasksVision via Swift Package Manager"
      },
      {
        "url": "https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js",
        "checked": "2026-10-27",
        "note": "@mediapipe/tasks-vision on npm"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/pose.md",
        "checked": "2026-10-27",
        "note": "BlazePose also powers ML Kit; world landmarks; Pixel 3 latencies"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py",
        "checked": "2026-10-27",
        "note": "PoseLandmark enum, MOUTH_LEFT and MOUTH_RIGHT"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/components/containers/landmark.py",
        "checked": "2026-10-27",
        "note": "visibility and presence fields"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE",
        "checked": "2026-10-27",
        "note": "Apache-2.0"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
        "checked": "2026-10-27",
        "note": "bundle sizes from the Content-Length of the lite, full and heavy files"
      }
    ],
    "firstParty": true
  },
  {
    "slug": "exercisedb-vs-api-ninjas",
    "primaryQuery": "exercisedb vs api ninjas",
    "h1": "ExerciseDB vs API Ninjas: GIFs and Video or a Simple Exercise Lookup?",
    "metaTitle": "ExerciseDB vs API Ninjas (2026): Exercise API Compared",
    "metaDescription": "ExerciseDB (AscendAPI) vs API Ninjas Exercises: GIFs and MP4 video vs start and finish photos, free tiers, commercial terms, storage and call limits.",
    "updated": "2026-10-27",
    "answer": "Pick ExerciseDB, now sold by AscendAPI, when your app needs demonstration media: its V1 serves 1,500 exercises with GIFs free and with no key, and its V2 on RapidAPI gives each exercise an MP4 video, watermarked on the free 200-exercise plan. Pick API Ninjas Exercises when text metadata and a start and finish photo are enough and you want terms you can read: commercial use starts at $59 a month, or $39 billed yearly, and storing the data needs the Business plan. Both were checked on October 27, 2026.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK for fitness apps.** Neither API on this page is ours, and we have no reason to prefer either. AscendAPI and API Ninjas facts come from their own documentation, home and pricing pages, read through a source snapshot on October 27, 2026; every count below is the vendor's own figure.\n\n## First, which ExerciseDB?\n\nThe exercisedb.dev home page now reads \"Previously ExerciseDB\" above the name AscendAPI, and it sells two exercise products. **ExerciseDB V1** is free with no key at `oss.exercisedb.dev`, 1,500 exercises with 180p GIFs, with a paid tier on RapidAPI. **ExerciseDB V2** is on RapidAPI only, with an MP4 video per exercise. On this page \"ExerciseDB\" means those two. [ExerciseDB vs wger](/compare/exercisedb-vs-wger) covers the older RapidAPI listing under the same name.\n\nAPI Ninjas is a catalog of small APIs sold under one key, and its Exercises API is one of them. The two meet on the same question, \"give my app an exercise list\", but they sell different things: ExerciseDB sells media, and API Ninjas sells a simple lookup.\n\n## ExerciseDB vs API Ninjas at a glance\n\n| | ExerciseDB (AscendAPI) | API Ninjas Exercises |\n| --- | --- | --- |\n| Catalog, vendor's figure | V1: 1,500 free, \"over 2,000\" in total; V2: 11,000+ | \"over 3000 exercises\" |\n| Media | V1: one 180p GIF free, images and GIFs at 360p to 1080p paid; V2: MP4 video and images, watermarked on the free plan | `images`: start and finish photos, premium plans only; no GIF or video |\n| Muscles | `bodyParts`, `targetMuscles` and `secondaryMuscles` arrays | One `muscle` per exercise, from 16 values |\n| Per call | Paginated REST endpoints, per AscendAPI | `/v1/exercises` returns up to 5; paging with `offset` is premium |\n| Free tier | V1: no sign-up, no key; V2 Basic: 2,000 requests a month, 200 exercises | 3,000 calls a month, 100 an hour, evaluation and demo only |\n| Commercial use | Terms not stated on the pages we read | Paid plans only, from $59 a month or $39 billed yearly |\n| Storing data | Not stated on the pages we read | Business plan and above |\n| Auth | None for V1 free; `X-RapidAPI-Key` for everything else | `X-Api-Key` |\n\nPrices for every plan are in [exercise database API pricing](/pricing/exercise-database-api-pricing).\n\n## Where ExerciseDB wins\n\n**Demonstration media.** AscendAPI's V2 overview says \"Each exercise includes an MP4 demonstration video for in-app playback\", alongside images at 360p, 480p, 720p and 1080p, and it states 11,000+ exercises, 15,000+ videos and 20,000+ images. V1's paid tier serves images and GIFs at the same four sizes, and its free tier one 180p GIF per exercise. API Ninjas returns photos only, and only on premium plans. For a workout player, that difference usually decides it; [exercise APIs with video](/fitness-apis/exercise-video-apis) compares every source of demo video.\n\n**Richer records.** A V1 record carries arrays of body parts, target muscles, secondary muscles and equipment, plus step-by-step instructions. V2 adds an `overview`, `exerciseTips`, `variations`, `keywords` and `relatedExerciseIds`. API Ninjas returns one primary muscle per exercise.\n\n**A free path you can ship a prototype on.** V1's free tier needs no sign-up and no key, and AscendAPI's rate-limit guide gives free plans \"a limit of 1,000 requests per hour per API key\". V2's Basic plan, per AscendAPI's quickstart, is free with 2,000 requests a month, 200 exercises, images and videos, and no credit card.\n\n## Where API Ninjas wins\n\n**Terms you can read before you build.** API Ninjas' pricing page puts commercial use, data storage, rate limits, attribution and uptime in one table. The Free plan is \"Evaluation and demo purposes only\", with attribution required and no commercial use; Developer adds commercial use with 100,000 calls a month and a 99% uptime SLA; Business adds \"Data caching/storing allowed\" with 1,000,000 calls and a 99.95% SLA. AscendAPI's pages we read state rate limits but not its terms on commercial use or on keeping a copy of the data, and its paid prices sit on RapidAPI listings our snapshot did not read.\n\n**One key, no marketplace.** API Ninjas keys come from its own site and go in an `X-Api-Key` header; ExerciseDB's paid tiers and all of V2 go through RapidAPI, with its own account, subscription and `X-RapidAPI-Key`. If your app already calls other API Ninjas endpoints, such as its Calories Burned API, one plan covers them all.\n\n**Simple filters and safety cues.** `/v1/exercises` filters by `name` (partial matches), `type` (seven values from cardio to strongman), `muscle`, `difficulty` (beginner, intermediate or expert) and `equipments`, and each result carries `instructions` and `safety_info`. API Ninjas' FAQ also promises that over-quota requests \"will simply be denied\", so a traffic spike never bills you beyond your plan.\n\n## The catches on each side\n\n**ExerciseDB.** Free V2 media is watermarked; AscendAPI says paid plans serve \"clean, watermark-free assets\". Some fields in its schema tables are still marked \"Next Update\" or \"Coming Soon\", among them muscle activation images on both versions and a difficulty level on V2, so check the field you need is \"Available\" before designing around it.\n\n**API Ninjas.** `/v1/exercises` \"Returns up to 5 exercises\", and the `offset` parameter that pages past them is premium. The full list of exercise names for a muscle group, `/v1/allexercises`, is for \"Business tier and above, or any annual plan\". The Developer plan does not allow caching or storing data, so an app that keeps a local copy of the catalog needs Business.\n\n## Which should you pick?\n\n- **Video or animated demos in the app** → ExerciseDB: V2 for MP4 video, V1 for GIFs.\n- **A free prototype that may become a product** → ExerciseDB V1 free or the V2 Basic plan to build, then read AscendAPI's paid plans and terms on RapidAPI before launch.\n- **Text metadata and a still photo, under terms you can cite** → API Ninjas on a paid plan; Business if you store the data.\n- **Filtering by difficulty or equipment on a budget** → API Ninjas' Developer plan covers both filters, while ExerciseDB V1 lists `difficulty` only in its paid-tier schema.\n- **Data you own outright, with no API at all** → neither: free-exercise-db is public domain. See [ExerciseDB vs free-exercise-db](/compare/exercisedb-vs-free-exercise-db).\n\nThe wider field, wger included, is in [exercise database APIs compared](/fitness-apis/exercise-database-apis) and [ExerciseDB alternatives](/alternatives/exercisedb-alternatives).",
    "faqs": [
      {
        "q": "Does API Ninjas have exercise GIFs or videos like ExerciseDB?",
        "a": "No. API Ninjas' Exercises API documents an images field, premium only, with image URLs in movement order, usually the start and finish positions, and no GIF or video. ExerciseDB serves animated GIFs on its V1, a 180p GIF free and 360p to 1080p on the paid tier, and an MP4 demonstration video per exercise on its V2, watermarked on the free plan."
      },
      {
        "q": "Which has more exercises, ExerciseDB or API Ninjas?",
        "a": "By the vendors' own figures, ExerciseDB V2: AscendAPI states 11,000+ exercises with 15,000+ videos and 20,000+ images. ExerciseDB V1 states over 2,000, 1,500 of them on the free tier, and API Ninjas says its Exercises API covers over 3000. We did not count either catalog, and API Ninjas returns at most five exercises per search call."
      },
      {
        "q": "Can I use ExerciseDB or API Ninjas for free in a commercial app?",
        "a": "Not API Ninjas: its pricing page calls the Free plan evaluation and demo purposes only, and its FAQ says commercial use of the Exercises API is not permitted on the free tier. AscendAPI's documentation describes free tiers for ExerciseDB V1 and V2 but, on the pages we read on October 27, 2026, does not state its commercial-use terms, so read them on RapidAPI or ask AscendAPI before launch."
      },
      {
        "q": "Do I need a RapidAPI account for ExerciseDB but not for API Ninjas?",
        "a": "Mostly, yes. ExerciseDB's V1 free tier needs no sign-up or key, but its paid V1 tier and every V2 plan are subscribed on RapidAPI and called with an X-RapidAPI-Key header. API Ninjas issues its own key from its website, passed in an X-Api-Key header, and one plan covers its other APIs too."
      }
    ],
    "related": [
      {
        "href": "/pricing/exercise-database-api-pricing",
        "label": "Exercise database API pricing"
      },
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/alternatives/exercisedb-alternatives",
        "label": "ExerciseDB alternatives"
      },
      {
        "href": "/compare/exercisedb-vs-wger",
        "label": "ExerciseDB vs wger"
      },
      {
        "href": "/fitness-apis/exercise-video-apis",
        "label": "Exercise APIs with video"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Exercise API plans, watermarks and terms move often. Subscribe and we will flag it when ExerciseDB or API Ninjas changes what you get for free."
    },
    "sources": [
      {
        "url": "https://exercisedb.dev/",
        "checked": "2026-10-27",
        "note": "AscendAPI, previously ExerciseDB; free V1 with no sign-up or key (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v1/overview",
        "checked": "2026-10-27",
        "note": "V1 catalog, free 180p GIFs, paid multi-resolution media, schema (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v2/overview",
        "checked": "2026-10-27",
        "note": "V2 catalog, MP4 video, watermark, schema (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/quickstart/overview",
        "checked": "2026-10-27",
        "note": "free Basic plan on RapidAPI (snapshot)"
      },
      {
        "url": "https://docs.ascendapi.com/guides/ratelimiting",
        "checked": "2026-10-27",
        "note": "free and paid rate limits (snapshot)"
      },
      {
        "url": "https://api-ninjas.com/api/exercises",
        "checked": "2026-10-27",
        "note": "endpoints, parameters, fields, premium images and offset, FAQ (snapshot)"
      },
      {
        "url": "https://api-ninjas.com/pricing",
        "checked": "2026-10-27",
        "note": "plans, calls, commercial use, storage, rate limit, SLA (snapshot)"
      }
    ],
    "firstParty": true
  },
  {
    "slug": "cliniko-vs-healthkit",
    "primaryQuery": "cliniko vs healthkit",
    "h1": "Cliniko vs HealthKit: Getting a Patient's Apple Health Data into Cliniko",
    "metaTitle": "Cliniko vs HealthKit: Apple Health Data in a Clinic",
    "metaDescription": "Cliniko is clinic software with an API; HealthKit is the patient's on-device health store. Does Cliniko work with Apple Health, and how to connect them?",
    "updated": "2026-11-04",
    "answer": "Cliniko and HealthKit are not alternatives to each other. Cliniko is practice management software for healthcare practitioners with a REST API, and HealthKit is Apple's store of health and fitness data on the patient's own iPhone and Apple Watch. The question behind the search is usually whether a clinic can bring a patient's Apple Health data into Cliniko, and as of November 4, 2026 we found no built-in way: none of the apps in Cliniko's connected-apps directory (96 when we re-counted on November 5) is listed for Apple Health, and its help center has no article on it. The route that works is an iPhone app the patient installs, which reads HealthKit with their permission and sends the data to your server, which then writes it to the patient's record through Cliniko's API, for example as a file attachment.",
    "body": "## Two different things with the same patient in them\n\n| | Cliniko | Apple HealthKit |\n| --- | --- | --- |\n| What it is | \"a practice management system for healthcare practitioners\", in its API docs' words | \"a central repository for health and fitness data on iPhone and Apple Watch\", in Apple's |\n| Who uses it | The clinic: appointments, treatment notes, invoices, reports | The patient, and the apps they allow to read or write their data |\n| Where the data lives | Cliniko's servers; accounts created in Europe, it says, are stored in Ireland | On the device: Apple says \"The user's device stores all HealthKit data locally\" |\n| How software gets in | A REST API that returns JSON, authenticated with a Cliniko user's API key | An app on the patient's iPhone or Apple Watch, with the patient's permission for each data type |\n| What it holds | Patients, appointments, treatment notes, attachments, invoices and more | Steps, heart rate, workouts, sleep and the other types Apple defines, from any app or device the patient connects |\n\nSo \"Cliniko vs HealthKit\" is not a choice between two products. A clinic that wants a patient's wearable data needs both: HealthKit is where the data is, and Cliniko is where the clinic wants it to end up.\n\n## Does Cliniko integrate with Apple Health?\n\nNot that we could find, as of November 4, 2026. Cliniko's connected-apps directory lists 96 apps when we re-counted on November 5, 2026, which it says were mostly \"developed by third parties\", in categories from booking to \"Patient care & monitoring\". None of their listings mentions Apple Health or HealthKit. A search of Cliniko's help center for \"apple health\" returns articles on the Apple calendar, Apple Pay and the Apple Pencil, and none on health data.\n\nSome listed apps do move patient measurements into Cliniko. SST Trainer describes heart-rate-based rehabilitation whose clearance letters and insurer reports \"are generated from session data and filed to the Cliniko record\", and Vively Health a continuous glucose monitoring program where \"All patient data syncs to your dashboard\". We did not verify whether any of them reads Apple Health; ask the vendor before you assume it.\n\n## Why a clinic system cannot read HealthKit directly\n\nHealthKit has no server to call. Apple documents that with the user's permission \"apps communicate with the HealthKit store\" on the device, and that \"the device encrypts the HealthKit store when the user locks the device\", so even an installed app \"may not be able to read data from the store when it runs in the background\". A web-based practice system like Cliniko has nothing to connect to. Apple adds that on iPadOS 16 and earlier and on macOS 13 and later the devices \"don't have a copy of the HealthKit store\", so a Mac on the front desk cannot read it either.\n\nPermission is per patient and per type. Apple says \"Users can grant or deny permission separately for each type of data\", and that \"an app isn't aware when the user denies permission to read data\". A clinic app has to treat an empty heart-rate history as possibly denied, not as a patient who never wore a watch. Reading the store is covered in the [Apple HealthKit integration guide](/integrate/healthkit).\n\n## The route that works: patient app, your server, Cliniko's API\n\n1. **A patient app on iPhone.** It asks for read access to the types the clinic needs, reads them with HealthKit queries while the app can, and uploads them to your backend.\n2. **Your server matches the patient.** Cliniko identifies patients by its own IDs, so your system needs a mapping from your app's user to the Cliniko patient.\n3. **Your server writes to Cliniko.** The documented path for a file is the patient attachment flow: request a presigned upload URL for the patient, POST the file to Cliniko's S3 bucket, then create the attachment record, after which \"Cliniko will process the file\". A weekly PDF or CSV summary of a patient's activity fits this shape.\n4. **Practitioners open your view from Cliniko.** Cliniko's custom patient buttons add a button to a patient's page that sends the practitioner's browser to your URL with the patient's Cliniko ID, so they can see the charts in your app. Cliniko has to approve the URL first.\n\nWhat the API docs set out for that server:\n\n- **Authentication.** HTTP Basic with a Cliniko API key as the username. \"Each Cliniko user will have their own API key(s)\", and \"The API key will have the same permissions as the user it belongs to\". Our recommendation is a dedicated Cliniko user for the integration, with only the permissions it needs.\n- **Identify yourself.** Every request needs a User-Agent with your app's name and a contact email; \"If your requests do not include a User-Agent that contains a name and valid contact email, future requests may be automatically blocked.\"\n- **Limits.** \"API requests are rate limited to 200 per minute per user\", over which you get a 429 with an X-RateLimit-Reset header. Lists are paginated, 50 items by default and up to 100 with per_page.\n- **Accounts live on shards.** The base URL depends on the account; the docs' example is the au1 shard, api.au1.cliniko.com.\n\nTwo things we could not verify. The API reference lists a treatment-note resource, but the rendered pages we read did not show which operations it supports, so check whether your integration can write notes or only read them. And we found no webhook resource in the reference's list, so plan to poll with an updated_at filter, which the docs describe, if you need to know when a patient record changes. If the system on the other end is an EHR rather than Cliniko, the standard shape for a wearable reading is a FHIR Observation, covered in [wearable data into health records with FHIR](/fitness-apis/wearable-data-to-ehr-fhir).\n\n## The rules that come with patient health data\n\n**Apple's rules for your app.** Apple's privacy guidance says \"You must not disclose any information gained through HealthKit to a third party without express permission from the user\", and that even with permission you may share it only with a third party that also provides \"a health or fitness service to the user\". In our reading a clinic treating the patient is that kind of service, but ask the patient explicitly and say in your privacy policy that data goes to their clinic. Apple also requires a privacy policy for every HealthKit app.\n\n**HIPAA, for a US clinic.** HHS lists clinics, chiropractors and psychologists among health care providers that are covered entities \"only if they transmit any information in an electronic form in connection with a transaction for which HHS has adopted a standard\". HHS's business associate guidance names as a business associate an app developer \"that contracts with a covered entity to provide the health care app to the covered entity's patients\", including for \"monitoring of patients' food and exercise\". Cliniko says it will set up a Business Associate Agreement on request, and warns in its help center that \"some integrators may not be HIPAA-compliant\". The wider test is in [does a fitness app need to be HIPAA compliant](/compliance/hipaa-compliance-fitness-app).\n\n**GDPR, for a clinic with patients in Europe or the UK.** Health data is special category data, and the UK regulator, the ICO, lists data from fitness trackers as health data. Cliniko offers a Data Processing Addendum; your patient app and server need the same treatment. See [GDPR for fitness apps](/compliance/gdpr-fitness-app).\n\n**The API key is the keys to the practice.** Cliniko's security page says connected apps \"often require your API key in order to link with your Cliniko account\" and to share it only with parties you trust. Keep it on your server, never in the patient app.\n\n## Which one do you actually need?\n\n- **You run or build for a clinic and want patients' step, heart-rate or workout data in their record** → both: a HealthKit-reading iPhone app for the patient, and Cliniko's API on your server.\n- **You are building a patient app with no clinic system involved** → HealthKit only, plus [Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect) if your patients also use Android.\n- **You want to automate the clinic's own data, such as bookings, invoices or recalls** → Cliniko's API only; HealthKit has nothing to do with it.\n- **You want patients' data from many wearables without writing a phone app per platform** → a health-data aggregator can collect it for you, compared in [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis); you would still write it into Cliniko yourself.\n- **You want records to flow the other way, from the health system to the patient's phone** → HealthKit can read clinical records downloaded from supported institutions, covered in [the HealthKit clinical records API](/data/clinical-records-api).\n\n## Sources and limits\n\nCliniko's API documentation, features, security and connected-apps pages and its help center were read through a source snapshot on November 4, 2026; Apple's HealthKit documentation was read directly the same day. HHS's pages refuse our fetches, so its guidance was read from Internet Archive captures of October 2026. Cliniko's directory changes as vendors join it, so search it again before you build.",
    "faqs": [
      {
        "q": "Does Cliniko integrate with Apple Health?",
        "a": "Not directly, as far as we could find on November 4, 2026. None of the apps in Cliniko's connected-apps directory, 96 when we re-counted on November 5, is listed for Apple Health or HealthKit, and a search of its help center for apple health returns calendar, Apple Pay and Apple Pencil articles only. Getting a patient's Apple Health data into Cliniko takes an iPhone app that reads HealthKit with the patient's permission and a server that writes the data through Cliniko's API."
      },
      {
        "q": "Can a clinic read a patient's HealthKit data from its practice software?",
        "a": "No. Apple documents that the user's device stores all HealthKit data locally and that apps read it on the device with the user's permission, so there is no Apple server a web-based practice system could query. Apple also says Macs and iPads running iPadOS 16 or earlier have no copy of the HealthKit store. The data has to be read by an app on the patient's iPhone or Apple Watch and sent on."
      },
      {
        "q": "How do I add a patient's wearable data to their record through the Cliniko API?",
        "a": "Cliniko documents a three-step patient attachment upload: request a presigned URL for the patient, POST the file to Cliniko's S3 bucket with the returned fields, then create the patient attachment record with the upload URL, after which Cliniko processes the file. A PDF or CSV summary of the patient's activity fits that flow. We could not confirm from the rendered reference whether the API can also write treatment notes."
      },
      {
        "q": "How does the Cliniko API authenticate, and what is its rate limit?",
        "a": "Cliniko uses HTTP Basic authentication with a Cliniko user's API key as the username and no password, and the key has the same permissions as the user it belongs to. Requests must carry a User-Agent with an app name and contact email or they may be blocked. Cliniko's docs set the rate limit at 200 requests per minute per user, answered with a 429 and an X-RateLimit-Reset header when exceeded."
      },
      {
        "q": "Can my app share a patient's HealthKit data with their clinic?",
        "a": "Only with the patient's express permission, under Apple's rules. Apple's privacy guidance says you must not disclose information gained through HealthKit to a third party without express permission from the user, and that even then you may share it only with a third party that also provides a health or fitness service to the user. In our reading a treating clinic qualifies, but ask explicitly and say so in your privacy policy."
      }
    ],
    "related": [
      {
        "href": "/integrate/healthkit",
        "label": "Apple HealthKit integration guide"
      },
      {
        "href": "/fitness-apis/wearable-data-to-ehr-fhir",
        "label": "Wearable data into health records with FHIR"
      },
      {
        "href": "/compliance/hipaa-compliance-fitness-app",
        "label": "Does your fitness app need HIPAA?"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "Apple HealthKit vs Google Health Connect"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Clinic software directories and Apple's HealthKit rules both change. Subscribe and we will flag it when a route for patient wearable data into practice software opens or closes."
    },
    "sources": [
      {
        "url": "https://docs.api.cliniko.com/",
        "checked": "2026-11-04",
        "note": "What Cliniko is, Basic auth with per-user API keys, User-Agent rule, 200 requests a minute, pagination, shards, the resource list (snapshot)."
      },
      {
        "url": "https://docs.api.cliniko.com/guides/uploading_patient_attachments",
        "checked": "2026-11-04",
        "note": "The presigned-URL patient attachment upload (snapshot)."
      },
      {
        "url": "https://docs.api.cliniko.com/guides/custom_patient_button",
        "checked": "2026-11-04",
        "note": "Custom patient buttons and Cliniko's approval of the URL (snapshot)."
      },
      {
        "url": "https://www.cliniko.com/connected-apps/",
        "checked": "2026-11-05",
        "note": "96 connected apps on November 5 (95 on November 4), categories, SST Trainer and Vively listings (snapshot)."
      },
      {
        "url": "https://www.cliniko.com/security/",
        "checked": "2026-11-04",
        "note": "Data regions, API key sharing warning, BAA on request (snapshot)."
      },
      {
        "url": "https://help.cliniko.com/en/?q=apple%20health",
        "checked": "2026-11-04",
        "note": "Help-center search for apple health: no health-data article (snapshot)."
      },
      {
        "url": "https://help.cliniko.com/en/articles/3266884-how-cliniko-helps-you-with-hipaa-compliance",
        "checked": "2026-11-04",
        "note": "Integrators may not be HIPAA-compliant (snapshot)."
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit",
        "checked": "2026-11-04",
        "note": "HealthKit as a central repository on iPhone and Apple Watch."
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/protecting-user-privacy",
        "checked": "2026-11-04",
        "note": "Local storage, per-type permission, encryption when locked, third-party disclosure rule, privacy policy."
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/about-the-healthkit-framework",
        "checked": "2026-11-04",
        "note": "Devices without a HealthKit store."
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/accessing-health-records",
        "checked": "2026-11-04",
        "note": "FHIR clinical records downloaded from supported institutions."
      },
      {
        "url": "https://web.archive.org/web/20261017232808/https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-is-special-category-data/",
        "checked": "2026-11-04",
        "note": "ICO: data from fitness trackers is health data (Internet Archive capture of Oct 17, 2026)."
      },
      {
        "url": "https://web.archive.org/web/20261028163611/https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html",
        "checked": "2026-11-04",
        "note": "HHS covered-entity list (Internet Archive capture of Oct 28, 2026)."
      },
      {
        "url": "https://web.archive.org/web/20261026014247/https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html",
        "checked": "2026-11-04",
        "note": "HHS business associate examples, including the health care app developer (capture of Oct 26, 2026)."
      }
    ]
  },
  {
    "slug": "kinestex-vs-competitors",
    "primaryQuery": "kinestex competitors",
    "h1": "KinesteX vs Competitors: Every Motion Tracking SDK Compared (2026)",
    "metaTitle": "KinesteX vs Competitors (2026): Motion SDKs Compared",
    "metaDescription": "KinesteX vs Kemtai, Asensei, Sency, QuickPose, Exer AI, PoseTracker and free models: platforms, prices, compliance. KinesteX funds this site.",
    "updated": "2026-11-09",
    "answer": "KinesteX (this site's own product) competes with full-experience SDKs from Sency and Kemtai, headless toolkits from Asensei, QuickPose and PoseTracker, clinical platforms such as Kemtai CARE and Exer AI, and free models like MediaPipe and MoveNet. On what ships in the box, platform breadth including the web, a stated entry price ($1.50 per monthly active user with a $1,500 monthly minimum, per its seed deck) and recent releases, KinesteX is our overall pick as read on November 9, 2026. The exception: choose Kemtai or Exer AI if you need a regulated clinical device, Asensei, Sency's Custom Kit or QuickPose for native in-process rendering, and QuickPose, PoseTracker or a free model for the smallest budget.",
    "body": "**Disclosure: KinesteX funds this site, and this page is written by the company behind KinesteX, so it compares this site's own product with the companies it competes against.** Every claim below traces to a vendor's own page, README, package registry or KinesteX's public seed deck as read on November 9, 2026, and quoted passages are re-tested against the live pages by [the checks that gate every deploy](/gates). Each competitor gets a genuine \"where it wins\" paragraph; [our methodology](/methodology) explains the sourcing.\n\n## Who is actually in this market\n\n\"AI motion tracking SDK\" covers four different things.\n\n- **Full-experience SDKs**, where your users get finished screens. KinesteX embeds a hosted coaching experience; Sency's Branded Kit offers \"the entire user interface and experience\" ready to use; Kemtai's APIs and Embeddables page offers an \"Embeddable Exercise Player\" plus patient and protocol management components.\n- **Headless and toolkit SDKs**, where you get data and build the product. Asensei calls itself \"a headless SDK\"; QuickPose packages MediaPipe and BlazePose for native apps; PoseTracker returns MoveNet keypoints and sells an exercise engine on top; Sency's Custom Kit \"does not include any predefined UI\".\n- **Clinical platforms sold to providers.** Kemtai CARE is a standalone clinician platform; Exer AI sells clinician and patient apps.\n- **Free models.** MediaPipe, MoveNet, Apple Vision and ML Kit give you keypoints and nothing above them.\n\n## The comparison table\n\nEvery cell comes from the vendor's own pages or repositories as read on November 9, 2026.\n\n| Vendor | What you get in the box | Platforms | Integration surface | Published entry price (as of Nov 9, 2026) | Regulatory / privacy statements | Library size (vendor-stated) | Access |\n|---|---|---|---|---|---|---|---|\n| KinesteX | AI Trainer Chat, plan, workout, challenge and leaderboard views, AI games, assessments, admin panel, content API, camera component | iOS 14+, Android 9+; Swift, Kotlin, Flutter, React Native, React TS, HTML/JS iframe; main browsers | Hosted experience in a WebView or iframe, plus REST APIs | $1.50 per monthly active user (MAU), $1,500 monthly minimum (seed deck); no price list on kinestex.com | \"KinesteX is HIPAA compliant\", BAA with Google Cloud; video processed on the device | 500+ (website), 550+ (deck) | Demo access and API key after a booked call |\n| Kemtai | Embeddable Exercise Player, management components, data and management APIs; Kemtai CARE clinician web app | Any device with a camera; web app; SDK platform list not published | Embeddable UI components plus data APIs | Not published on the pages we read | FDA-listed and CE-marked (MDR 2017/745) medical device; ISO 13485, 27799, 27001; HIPAA and GDPR | 2,000+ exercises and variations | Email form for API docs; demo |\n| Asensei | Headless movement recognition; Coach IQ content tools; Cloud Coach containers | Native iOS and Android, Web, Ionic, React, Unity (vendor-stated) | Headless on-device SDK; cloud deployment for sport and broadcast | Not published on the pages we read | None beyond on-device processing | Not published on the pages we read | \"Request SDK Access\"; contact sales |\n| Sency | Branded Kit (full UI) or Custom Kit (no UI); assessments; MCP server | iOS (SMKit demo 16.0, SMKitUI iOS 15), Android minSdk 24, React Native, Flutter; JavaScript and Unity listed \"NA\" | Native SDK; models downloaded from Sency's server | Starter free up to 100 MAU, Growth from $499/month (pricing-packages); $99.99 fixed up to 100 users (/pricing) | \"fully compliant with both HIPAA and GDPR\"; edge computing | Not published on the pages we read | Free registration; key by email after subscribing |\n| QuickPose | MediaPipe and BlazePose toolkit: overlays, range of motion, exercise counters | iOS 14.0+, Android API 26 (samples API 28), React Native; no web package found | Native, in-process SDK | Free up to 10 monthly active devices; Builder $25/month for 100; up to $1,000/month for 100,000 | \"100% on-device\"; no video frames sent to a server | Not published as a count on the pages we read | Free SDK key, \"usage limits may apply\" |\n| Exer AI | Exer Scan for clinicians, Exer Health for patients; no developer SDK found | Phones, tablets and webcams (vendor-stated) | Buy the product; APIs for EHR integration and billing | Not published on the pages we read | \"FDA Class II Medical Device (software), validated.\"; HIPAA compliant | Not published on the pages we read | Demo request |\n| PoseTracker | Free 17 MoveNet keypoints; paid engine for reps, angles, form score | React Native (Expo Go), iOS, Android, web; no first-party Flutter SDK | npm SDKs or iframe API | Freemium €0 (200 calls, non-commercial); Developer €50/month; Business from €150/month | Keypoints on-device, no video upload; \"It is not a medical device\" | Not published as a count on the pages we read | No key for keypoints; key for the engine |\n| Free pose models | Keypoints only: BlazePose 33, MoveNet 17, ML Kit 33, Apple Vision body pose | MediaPipe: web and Android documented; ML Kit: Android and iOS | Libraries inside your app | Free; BlazePose and MoveNet cards say Apache 2.0 | Yours to establish | None; you build reps and form | Download |\n\n## Criteria, and how each vendor does\n\n### Time to integration and what ships\n\nKinesteX's SDK integration page says \"A developer connects our SDK to your iOS, Android or web app in about a day\"; the whole project takes \"1 week or less\" with Ready-made Experiences and about a month if you build every screen. It ships the widest set of finished screens here: AI Trainer Chat, plan, workout, challenge and leaderboard views, three AI games, an admin panel, assessments and a content API, in 19 languages per its FAQ. Sency claims a record of \"54 minutes from installing the SDK to having a full fitness assessment working\". QuickPose, PoseTracker and Asensei hand you data, so the screens are your work. Exer is deployed, not integrated.\n\n### Platform breadth, including the web\n\nOn paper Asensei names the widest list, including Unity and Ionic, but publishes no packages we could check. Among SDKs with public docs, KinesteX covers the most: Swift, Kotlin, Flutter, React Native, React TypeScript and an HTML/JavaScript iframe. PoseTracker covers React Native and the web but lists \"Flutter-only (no first-party Flutter SDK)\" as a reason not to use it. Sency's own README marks JavaScript and Unity \"NA\". QuickPose covers iOS, Android and React Native, and we found no web package. Kemtai is a web app with embeddables.\n\n### Published entry price\n\nQuickPose has the cheapest published paid tier: Builder at $25 a month for 100 monthly active devices, with 10 devices free. PoseTracker's Developer plan is €50 a month, and its Freemium plan is non-commercial. Sency's pricing-packages page starts Growth at $499 a month. KinesteX's seed deck states \"$1.50 per MAU. $1,500 monthly minimum.\", and its FAQ adds that \"Integration fees may apply\". Kemtai, Asensei and Exer publish no price on the pages we read. KinesteX is the only full-experience vendor with a stated price, and its floor sits above every toolkit's entry tier.\n\n### Maintenance record\n\nKinesteX published React Native 1.5.0 on October 19, 2026 and Flutter 1.5.1 on July 4, 2026; its main repositories show updates on November 5, 2026. Sency's React Native UI package 2.4.4 and Flutter UI plugin 1.6.1 both shipped on October 21, 2026. QuickPose's React Native plugin 0.7.2 shipped on November 2, 2026, the day its repositories were last updated. PoseTracker's npm packages reached 0.3.8 on October 16, 2026. Asensei's public trail is its demo app, ASENSEI Spark, at 1.3.1 on October 21. Kemtai and Exer publish no SDK packages.\n\n### Accuracy: nobody has an independent number\n\nEvery figure is the vendor's own claim, no independent benchmark compares these products, and accuracy plays no part in our verdict. KinesteX's FAQ claims \"97.2% accuracy\" and an older README says its models \"consistently exceed 90% accuracy\". Kemtai cites a validation study against \"a gold-standard motion lab that used 10 3D cameras and body sensors\", footnoted as \"Kemtai data on file\". Exer's blog reports an ICC of 0.96 in a Duke tremor study. Sency's FAQ says clients choose it for \"unmatched accuracy\". PoseTracker's comparison page says it plainly: \"No independent lab ranks these SDKs on a shared accuracy set.\"\n\n## Where each competitor wins\n\n**Kemtai** wins any project that needs a regulated device. Its FAQ says it is \"FDA-listed as a medical device, CE‑marked (MDR 2017/745) as a medical device, ISO‑certified (13485, 27799, 27001)\", its library claims 2,000+ exercises and variations, and Kemtai CARE serves clinicians with \"no development needed\". See [KinesteX vs Kemtai](/compare/kinestex-vs-kemtai).\n\n**Asensei** wins for teams that want a headless native SDK, including Unity and Ionic, with on-device and cloud deployment options. Its showcase names connected-fitness hardware such as Tonal. See [KinesteX vs Asensei](/compare/kinestex-vs-asensei).\n\n**Sency** wins for a native, no-UI kit with assessments, a free Starter tier for up to 100 MAU on its pricing-packages page, and an MCP server for AI coding tools. See [KinesteX vs Sency](/compare/kinestex-vs-sency).\n\n**QuickPose** wins on cost to start: a free key today, 10 devices free, $25 a month for 100, and MediaPipe running in-process with every feature on every plan. See [KinesteX vs QuickPose](/compare/kinestex-vs-quickpose).\n\n**Exer AI** wins where a provider wants a finished clinical product: it states \"FDA Class II Medical Device (software), validated.\", publishes validation studies, and offers \"APIs to streamline integrations and billing\". See [KinesteX vs Exer AI](/compare/kinestex-vs-exer-ai).\n\n**PoseTracker** wins for hobby and early projects: free keypoints with no key, a €50 Developer plan, web and React Native npm packages, and a public assistant that writes the snippet. See [KinesteX vs PoseTracker](/compare/kinestex-vs-posetracker).\n\n**Free models** win on license cost and ownership: the BlazePose and MoveNet cards both say Apache 2.0, and you own everything above the keypoints. See [KinesteX vs MediaPipe](/compare/kinestex-vs-mediapipe) and [build vs buy](/motion/build-vs-buy-ai-motion-tracking).\n\n## Where KinesteX wins\n\nKinesteX wins when you want a finished experience on every platform at once. Its docs list SDKs for Swift, Kotlin, Flutter, React Native and React (TypeScript), \"plus a plain HTML/JavaScript iframe integration for any web page or PWA\". The ready-made layer includes an AI Trainer Chat with a camera fitness assessment and next-session scheduling, movement assessments such as Timed Up and Go, and a content API at data.kinestex.com. Its AI Kit, Kotlin and Swift repositories were updated four days before our check. The cost: the SwiftUI kit README says it \"embeds KinesteX's AI-powered camera workout experience as a WebView\", so the UI is KinesteX's, themed in its admin panel.\n\n## Verdict\n\nKinesteX is our overall pick, on these criteria only. It ships the most in the box (AI Trainer Chat, ready-made views, content API, admin panel, assessments, 19 languages), connected in about a day per its SDK page. It has the broadest platform coverage with public docs, web included. It states an entry price, $1.50 per MAU with a $1,500 monthly minimum, where Kemtai, Asensei and Exer publish none. Its packages and repositories show releases within weeks of our check.\n\nThe pick flips in four cases. If you need a regulated clinical device, choose Kemtai or Exer AI. If you need native in-process rendering or Unity, choose Asensei, Sency's Custom Kit or QuickPose. For the smallest budget or a hobby project, QuickPose, PoseTracker or the free models cost far less. An iOS-only team should look at QuickPose or Apple Vision.\n\n## Not on the list, and why\n\n- **VAY.** vay.ai did not resolve on November 9, 2026, so we found no product to buy.\n- **Uplift Capture.** Its App Store listing says it is \"for organizations that currently use the Uplift platform\" and uses two iOS devices: sports biomechanics, not an SDK.\n- **Hinge Health.** It sells a care program \"covered by employers and health plans\" with its own TrueMotion technology, not a developer product.\n- **Sword Health.** Its site returned HTTP 429 to our fetcher, so we could not read it.\n- **Zing Coach.** A consumer coaching app, not a developer product, on the pages we could read. Its methodology page describes \"a science-based approach to changing your behavior, with the help of personalized virtual coaching\" and says the product \"is built on the most advanced AI technology and expertise of world-class fitness and wellness specialists\". Its root domain, zing.coach, redirected to partner.zing.coach, which served no readable text, so if a partner program or API lives there we could not read it. We found no SDK, API or developer documentation on Zing Coach's pages.\n- **Fitify.** A consumer workout app (Fitify Workouts s.r.o.) with a corporate-wellness offer. Its business page says \"Your employees will get an unlimited access to Fitify to use it as much as they want\" and describes \"900+ exercises, including yoga, meditation and breathing routines\", with onboarding that \"usually takes about 2-3 weeks\". None of its pages mention camera-based tracking or an SDK.\n- **Consumer apps and services firms.** Workout apps are products, not components, and agencies that build custom tracking sell a contract, not an SDK.\n\n## What we could not verify\n\n- **Competitor prices.** Kemtai, Asensei and Exer AI publish none on the pages we read. A Hyperhuman post describes tiered pricing for its Asensei-powered module; that is Hyperhuman's offer, not Asensei's.\n- **Accuracy.** No independent benchmark covers any product here.\n- **Which Sency page governs.** Its pricing-packages page lists Starter as free up to 100 MAU; its /pricing page lists $99.99 fixed for up to 100 users and a free trial.\n- **QuickPose's free tier.** The pricing page says 10 devices are free; its iOS and Android product pages say the first 100 devices per month are free.\n- **Kemtai's point count.** Its home page says 111 data points; its EU digital-health page says 113-Point Tracking.\n- **KinesteX's own numbers.** The website says 500+ exercises and the deck says 550+; the FAQ lists 19 languages and the deck's competition slide says 17.\n- **KinesteX's on-device statements.** The Kotlin, Flutter and React Native READMEs say \"optional edge processing (no cloud transmission)\"; the security page says \"All camera and vision processing stays on-device\". Ask which applies to your configuration.\n\nFor one-on-one detail, read [KinesteX vs Kemtai](/compare/kinestex-vs-kemtai), [KinesteX vs Asensei](/compare/kinestex-vs-asensei), [KinesteX vs Sency](/compare/kinestex-vs-sency), [KinesteX vs QuickPose](/compare/kinestex-vs-quickpose), [KinesteX vs Exer AI](/compare/kinestex-vs-exer-ai), [KinesteX vs PoseTracker](/compare/kinestex-vs-posetracker) and [KinesteX vs MediaPipe](/compare/kinestex-vs-mediapipe), or the wider [KinesteX alternatives](/alternatives/kinestex-alternatives) list.\n",
    "faqs": [
      {
        "q": "Which KinesteX competitors are clinical platforms rather than developer SDKs?",
        "a": "Exer AI and, in part, Kemtai. Exer sells Exer Scan for clinicians and the Exer Health patient app, with APIs for EHR integration and billing, and we found no developer SDK on its pages. Kemtai sells both: embeddable components and APIs for digital health apps, and Kemtai CARE, a standalone clinician platform for organizations that do not integrate its API. Hinge Health also uses motion technology, but inside its own care program, not as a product for developers."
      },
      {
        "q": "Which KinesteX competitor publishes the lowest paid entry price?",
        "a": "QuickPose, as read on November 9, 2026: its Builder plan is $25 a month for up to 100 monthly active devices, and up to 10 devices are free. PoseTracker's Developer plan is €50 a month, and Sency's pricing-packages page starts Growth at $499 a month after a free Starter tier for up to 100 users. KinesteX's seed deck states $1.50 per monthly active user with a $1,500 monthly minimum. Kemtai, Asensei and Exer AI publish no prices on the pages we read."
      },
      {
        "q": "Does any camera motion tracking vendor here hold an FDA listing or registration?",
        "a": "Two say so on their own pages. Kemtai's FAQ says it is FDA-listed as a medical device and CE-marked under MDR 2017/745, with ISO 13485, 27799 and 27001 certification. Exer AI's pages say FDA Registered and FDA Class II Medical Device (software), validated. KinesteX, Sency, QuickPose, Asensei and PoseTracker make no FDA claim on the pages we read, and PoseTracker says it is not a medical device."
      },
      {
        "q": "Which motion SDK vendors cover web apps as well as iOS and Android?",
        "a": "KinesteX documents React TypeScript and a plain HTML/JavaScript iframe beside its Swift, Kotlin, Flutter and React Native SDKs. PoseTracker ships web npm packages and an iframe API alongside React Native. Asensei's pages list Web among its platforms, but we found no public package to check. Kemtai runs as a web app. Sency's README marks JavaScript as NA, and we found no QuickPose web package. MediaPipe's Pose Landmarker documents a web install."
      },
      {
        "q": "Can I trust the accuracy percentages that motion tracking vendors publish?",
        "a": "Treat them as claims. KinesteX's FAQ says 97.2% and an older README says above 90%; Kemtai cites its own validation study, labeled Kemtai data on file; Exer reports conference studies such as an ICC of 0.96 for tremor; Sency claims unmatched accuracy without a figure. No independent benchmark tests these products on the same movements, so test your own exercises on your target devices before you sign."
      }
    ],
    "related": [
      {
        "href": "/alternatives/kinestex-alternatives",
        "label": "KinesteX alternatives"
      },
      {
        "href": "/guides/evaluate-motion-sdks",
        "label": "How to evaluate motion SDKs"
      },
      {
        "href": "/motion/build-vs-buy-ai-motion-tracking",
        "label": "Build vs buy AI motion tracking"
      },
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "Pose estimation models compared"
      },
      {
        "href": "/fitness-apis/ai-workout-tracking-apis",
        "label": "AI workout tracking APIs"
      },
      {
        "href": "/apis/kinestex",
        "label": "KinesteX API profile"
      }
    ],
    "cta": {
      "pitch": "Seven vendors, three pricing pages that disagree with themselves, and packages that moved within weeks of our check: get our developer notes when a price, platform or certification actually changes."
    },
    "firstParty": true,
    "sources": [
      {
        "url": "https://kinestex-pitch.vercel.app/",
        "checked": "2026-11-09",
        "note": "seed deck: $1.50 per MAU, $1,500 monthly minimum; 550+ exercises; 17 languages on the competition slide (competitor figures there not used)"
      },
      {
        "url": "https://www.kinestex.com/",
        "checked": "2026-11-09",
        "note": "500+ AI exercises, 300+ data points, platforms, movement tests"
      },
      {
        "url": "https://www.kinestex.com/product/sdk-integration",
        "checked": "2026-11-09",
        "note": "about a day to connect, three ways in, iOS 14+ and Android 9+, browsers, API key on a call, camera video stays on device, trainer chat needs internet"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-11-09",
        "note": "under a day, 19 languages, 97.2% accuracy claim, usage-based pricing, integration fees"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-11-09",
        "note": "on-device camera and vision processing"
      },
      {
        "url": "https://www.kinestex.com/product/hipaa",
        "checked": "2026-11-09",
        "note": "HIPAA compliance statement, BAA with Google Cloud"
      },
      {
        "url": "https://www.kinestex.com/docs/getting-started",
        "checked": "2026-11-09",
        "note": "SDK list, plug-and-play views, custom integration, requirements"
      },
      {
        "url": "https://www.kinestex.com/docs/ai-trainer-chat",
        "checked": "2026-11-09",
        "note": "AI Trainer Chat requirements; Complete UX and Personalized Plan View marked Sunset"
      },
      {
        "url": "https://www.kinestex.com/docs/content-api-v2",
        "checked": "2026-11-09",
        "note": "Content API at data.kinestex.com"
      },
      {
        "url": "https://www.kinestex.com/docs/installation",
        "checked": "2026-11-09",
        "note": "Kotlin SDK 2.5.0 via JitPack, minSdk 28"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-11-09",
        "note": "SwiftUI WebView embed; updated Nov 5, 2026"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-11-09",
        "note": "optional edge processing wording; Apache-2.0"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-11-09",
        "note": "older 90% accuracy claim"
      },
      {
        "url": "https://github.com/orgs/KinesteX/repositories",
        "checked": "2026-11-09",
        "note": "repository update dates"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-11-09",
        "note": "1.5.0 on 2026-10-19"
      },
      {
        "url": "https://pub.dev/packages/kinestex_sdk_flutter",
        "checked": "2026-11-09",
        "note": "1.5.1 on 2026-07-04"
      },
      {
        "url": "https://kemtai.com/",
        "checked": "2026-11-09",
        "note": "2,000+ exercises, 111 data points, FDA-listed and CE-marked, accuracy study footnote, API docs gated by email"
      },
      {
        "url": "https://kemtai.com/kemtai-api-and-embeddables/",
        "checked": "2026-11-09",
        "note": "Embeddable Exercise Player, management components, data and management APIs"
      },
      {
        "url": "https://kemtai.com/faqs",
        "checked": "2026-11-09",
        "note": "regulatory statement, web app, Kemtai CARE"
      },
      {
        "url": "https://eu.kemtai.com/digital-health-platforms/",
        "checked": "2026-11-09",
        "note": "113-Point Tracking"
      },
      {
        "url": "https://asensei.ai/",
        "checked": "2026-11-09",
        "note": "SDK positioning, showcase"
      },
      {
        "url": "https://asensei.ai/ai",
        "checked": "2026-11-09",
        "note": "platforms, headless, on-device and cloud deployment"
      },
      {
        "url": "https://asensei.ai/cloud-coach",
        "checked": "2026-11-09",
        "note": "container deployment"
      },
      {
        "url": "https://apps.apple.com/us/app/asensei-spark/id6450310525",
        "checked": "2026-11-09",
        "note": "ASENSEI Spark 1.3.1"
      },
      {
        "url": "https://blog.hyperhuman.cc/ai-movement-recognition-white-label-fitness-app/",
        "checked": "2026-11-09",
        "note": "Hyperhuman's own pricing for its Asensei-powered module"
      },
      {
        "url": "https://github.com/sency-ai/smkit-sdk",
        "checked": "2026-11-09",
        "note": "Branded vs Custom Kit, platform table"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ios-demo",
        "checked": "2026-11-09",
        "note": "iOS 16.0, server-downloaded models, MCP server"
      },
      {
        "url": "https://github.com/sency-ai/smkit-android-demo",
        "checked": "2026-11-09",
        "note": "minSdk 24"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ui-ios-demo",
        "checked": "2026-11-09",
        "note": "iOS 15 or later"
      },
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-11-09",
        "note": "Starter free up to 100 MAU, Growth from $499/month"
      },
      {
        "url": "https://www.sency.ai/pricing",
        "checked": "2026-11-09",
        "note": "$99.99 fixed up to 100 users, free trial, 54-minute record claim"
      },
      {
        "url": "https://www.sency.ai/faq-motion-tracking",
        "checked": "2026-11-09",
        "note": "HIPAA and GDPR claim, edge computing, accuracy claim"
      },
      {
        "url": "https://www.npmjs.com/package/@sency/react-native-smkit-ui",
        "checked": "2026-11-09",
        "note": "2.4.4 on 2026-10-21"
      },
      {
        "url": "https://pub.dev/packages/flutter_smkit_ui",
        "checked": "2026-11-09",
        "note": "1.6.1 on 2026-10-21"
      },
      {
        "url": "https://github.com/quickpose/quickpose-ios-sdk",
        "checked": "2026-11-09",
        "note": "MediaPipe and BlazePose toolkit, iOS 14.0+, free SDK key"
      },
      {
        "url": "https://github.com/quickpose",
        "checked": "2026-11-09",
        "note": "repositories updated Nov 2, 2026"
      },
      {
        "url": "https://docs.quickpose.ai/docs/MobileSDK",
        "checked": "2026-11-09",
        "note": "Android min API 26, samples API 28"
      },
      {
        "url": "https://quickpose.ai/sdk-pricing/",
        "checked": "2026-11-09",
        "note": "10 devices free, Builder $25/month to Agency $1,000/month"
      },
      {
        "url": "https://quickpose.ai/products/ios-sdk/",
        "checked": "2026-11-09",
        "note": "on-device inference; first 100 devices free wording"
      },
      {
        "url": "https://www.npmjs.com/package/@quickpose/react-native",
        "checked": "2026-11-09",
        "note": "0.7.2 on 2026-11-02"
      },
      {
        "url": "https://www.exer.ai/",
        "checked": "2026-11-09",
        "note": "FDA Class II statement, HIPAA, APIs for integrations and billing"
      },
      {
        "url": "https://www.exer.ai/product/scan",
        "checked": "2026-11-09",
        "note": "Exer Scan for clinicians"
      },
      {
        "url": "https://www.exer.ai/product/health",
        "checked": "2026-11-09",
        "note": "Exer Health patient app"
      },
      {
        "url": "https://www.exer.ai/posts/exer-ai-clinical-validation-studies-presented-at-assh-and-cns-in-oct-2025",
        "checked": "2026-11-09",
        "note": "validation studies, vendor-reported"
      },
      {
        "url": "https://www.posetracker.com/",
        "checked": "2026-11-09",
        "note": "MoveNet on device, free keypoints, prices, not a medical device"
      },
      {
        "url": "https://docs.posetracker.com/reference/features-plans",
        "checked": "2026-11-09",
        "note": "plan gating and quotas"
      },
      {
        "url": "https://www.posetracker.com/compare/pose-estimation-sdks",
        "checked": "2026-11-09",
        "note": "no first-party Flutter SDK; no independent accuracy ranking"
      },
      {
        "url": "https://www.npmjs.com/package/@pose-tracker/react-native-pose-estimation",
        "checked": "2026-11-09",
        "note": "0.3.8 on 2026-10-16"
      },
      {
        "url": "https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker",
        "checked": "2026-11-09",
        "note": "33 3D landmarks, web install"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-11-09",
        "note": "33 keypoints, Apache License 2.0, fitness and repetition counting as an intended use"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.SinglePose%20Model%20Card.pdf",
        "checked": "2026-11-09",
        "note": "17 keypoints, Apache License 2.0"
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection",
        "checked": "2026-11-09",
        "note": "33-point skeleton, Android and iOS"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/detecting-human-body-poses-in-images",
        "checked": "2026-11-09",
        "note": "Apple Vision body pose documentation"
      },
      {
        "url": "https://apps.apple.com/us/app/uplift-capture/id1501907981",
        "checked": "2026-11-09",
        "note": "for existing Uplift organizations, two iOS devices"
      },
      {
        "url": "https://www.hingehealth.com/",
        "checked": "2026-11-09",
        "note": "care program covered by employers and health plans, TrueMotion"
      },
      {
        "url": "https://www.zing.coach/methodology",
        "checked": "2026-11-09",
        "note": "consumer coaching methodology; no SDK or API on the pages read; root domain redirected to partner.zing.coach with no readable text"
      },
      {
        "url": "https://gofitify.com/business",
        "checked": "2026-11-09",
        "note": "corporate-wellness offer, 900+ exercises, 2-3 week onboarding; no camera tracking or SDK mentioned"
      }
    ]
  },
  {
    "slug": "kinestex-vs-kemtai",
    "primaryQuery": "kinestex vs kemtai",
    "h1": "KinesteX vs Kemtai: Fitness SDK or Clinical Rehab Platform?",
    "metaTitle": "KinesteX vs Kemtai: Fitness SDK or Clinical Rehab Platform",
    "metaDescription": "KinesteX vs Kemtai: white-label SDK vs FDA-listed rehab platform, compared on platforms, price, clinician tools. KinesteX funds this site.",
    "updated": "2026-11-09",
    "answer": "Kemtai is a digital physical therapy platform: FDA-listed and CE-marked as a medical device per its own pages, with a 2,000-plus exercise library, a clinician web app called Kemtai CARE, embeddable components and APIs, and no published prices. KinesteX (this site's own product) is a white-label SDK that embeds ready-made coaching experiences, including an AI trainer chat and movement assessments, across iOS, Android, Flutter, React Native and the web, with a deck price of $1.50 per monthly active user and a $1,500 monthly minimum. On integration time, platform breadth, a stated price and a public release record, KinesteX is our pick. Choose Kemtai instead if your product is a regulated medical device, bills Remote Therapeutic Monitoring, or needs clinician protocol management and a 2,000-exercise rehab library.",
    "body": "**Disclosure: KinesteX funds this site, and this page was written by the company behind KinesteX, so it compares Kemtai with this site's own product.** To keep that honest, every claim about either vendor comes from their own public pages, KinesteX's READMEs and package registries, or KinesteX's public seed deck, all read on November 9, 2026. Accuracy figures are reported as each vendor's own claims and play no part in the verdict, and the \"Where Kemtai wins\" section comes before ours. The [automated checks that gate every deploy](/gates) refuse a page that links to this site's funder without a disclosure beside it.\n\nThese two products overlap at camera-guided exercise with real-time feedback, but they start from opposite ends. Kemtai sells a digital physical therapy platform to providers, digital health platforms and life-sciences companies, and it describes itself as a listed medical device with a clinician app of its own. KinesteX sells a white-label SDK that drops a finished coaching experience into fitness, wellness and rehab apps. The real question is whether your product is a clinical rehab service or an app that needs exercise features, rehab included.\n\n## What each one is, per its own pages\n\n**Kemtai** puts \"Digital Physical Therapy Platform\" at the top of its [home page](https://kemtai.com/), and its [product page](https://kemtai.com/product) says the technology provides real-time feedback \"for physical therapy and rehabilitation\". It sells three ways in. **Kemtai CARE** is a standalone clinician app: the home page lists managing clinicians and patients in one place, assigning exercise protocols, ROM assessments, questionnaires and education, adherence tracking, nudges, in-app messaging and white-labeling, under the line \"Web app. No downloads. No installations\". Its [FAQ](https://kemtai.com/faqs) adds that Kemtai CARE is for organizations \"that don't implement Kemtai using its API\". The [APIs and Embeddables page](https://kemtai.com/kemtai-api-and-embeddables/) describes an Embeddable Exercise Player (set-up instructions, real-time tracking, live corrective guidance, rep counting and performance results), Patient and Protocol Management Components, Rich Data APIs that run in both directions, and Management APIs that create patients and staff, generate protocols and assign care plans. Kemtai's EU [API integration page](https://eu.kemtai.com/api-integration/) sums it up as \"two main levels of the API\": embedded UX components and patient-data transfer.\n\nThe rest of the profile, per the same pages: a library of more than 2,000 exercises \"ranging from physiotherapy & MSK, neuro & chronic-care, to pilates, easy stretching and high-intensity professional exercises\"; regulatory status stated in the FAQ as \"FDA-listed as a medical device, CE‑marked (MDR 2017/745) as a medical device, ISO‑certified (13485, 27799, 27001)\", plus HIPAA and GDPR compliance; works \"on any device with a camera (laptops, tablets, mobile phones)\", as a web app; processing \"done on the edge device, and video is not recorded\". Its menu lists Musculoskeletal Care, Weight Management, Neurological Rehabilitation and Remote Therapeutic Monitoring (RTM) as solutions. Its FAQ says it is used by \"healthcare systems, payers, rehabilitation clinics and medical device providers\" on 5 continents. Access to its API documentation goes through a form: \"Please enter your email address to receive access to Kemtai's API docs\". No page we read lists a price.\n\n**KinesteX** describes itself on its [home page](https://www.kinestex.com/) as \"a white-label SDK that coaches every rep through your users' own camera, inside your app\". Its [Getting Started docs](https://www.kinestex.com/docs/getting-started) list SDKs for Swift, Kotlin, Flutter, React Native and React (TypeScript), \"plus a plain HTML/JavaScript iframe integration for any web page or PWA\", on iOS 14.0+ (Xcode 16.3+) and Android 9+ (API 28). The native SDKs embed a hosted experience; the [SwiftUI kit README](https://github.com/KinesteX/KinesteX-AI-Kit) calls itself \"a SwiftUI package that embeds KinesteX's AI-powered camera workout experience as a WebView\". The plug-and-play views are AI Trainer Chat (the recommended start), Plan, Workout, Challenge and Leaderboard views, AI Experiences (Balloon Pop, Color Chase and Alien Squat Shooter) and an Admin Workout Editor. For teams building their own screens there is a Camera Component that streams reps, holds, form feedback and presence (and, on request, pose landmarks) and a [Content API](https://www.kinestex.com/docs/content-api-v2) at data.kinestex.com for exercises, workouts and plans. Its [data-points docs](https://www.kinestex.com/docs/data-points) define assessments including Timed Up and Go, Single Leg Stand, 30-Second Sit-to-Stand and shoulder range of motion. The home page counts 500+ AI exercises (the seed deck says \"550+ exercises built in\") and 19 languages. Its [FAQ](https://www.kinestex.com/product/faqs) says integration \"typically takes under a day\". KinesteX's public [seed deck](https://kinestex-pitch.vercel.app/) states \"$1.50 per MAU. $1,500 monthly minimum.\"; kinestex.com itself publishes no price list.\n\n## Side by side\n\nEverything here was read on November 9, 2026. Where a vendor does not publish something, the cell says so.\n\n| Dimension | Kemtai | KinesteX |\n|---|---|---|\n| What it is | Digital physical therapy platform: clinician web app, embeddable components and APIs | White-label SDK that embeds a hosted coaching experience, plus a content API |\n| Primary buyers named | Health systems, clinics, payers, digital health platforms, medical-device and pharma companies | Fitness apps, physical therapy and rehab, corporate wellness, insurers and health plans |\n| Regulatory status, per vendor | \"FDA-listed as a medical device\", CE-marked under MDR 2017/745, ISO 13485, 27799 and 27001 | HIPAA compliance page; home page says test results \"are not a diagnosis\"; no medical-device listing on the pages we read |\n| Ways in | Kemtai CARE clinician app; Embeddable Exercise Player; patient and protocol management components; data and management APIs | Plug-and-play views (AI Trainer Chat, plan, workout, challenge, leaderboard, AI games, admin editor); custom workout; camera component; Content API |\n| Platforms | Web app on laptops, tablets and phones with a camera; no SDK package list on the pages we read | Swift, Kotlin, Flutter, React Native, React (TypeScript), HTML/JavaScript iframe; iOS 14.0+, Android 9+ |\n| Exercise library | 2,000+ exercises and variations | 500+ AI exercises (site); \"550+ exercises built in\" (deck) |\n| Assessments | ROM assessments and digital assessments assigned by clinicians | Timed Up and Go, Single Leg Stand, 30-Second Sit-to-Stand, shoulder ROM and more, with risk levels on balance tests |\n| Clinician workflow | Protocol prescription, care plans, adherence down to the rep, messaging | Admin panel for design, workouts and usage statistics; progress dashboards for clinicians on its PT page |\n| Languages | Not published on the pages we read | 19 (FAQ and home page); the deck's competition slide says 17 |\n| Video handling, per vendor | \"Processing is done on the edge device, and video is not recorded\" | \"The camera video never leaves it and is not stored\"; the AI trainer chat needs internet |\n| Published price | None on the pages we read | Deck: $1.50 per monthly active user (MAU), $1,500 monthly minimum; FAQ: usage-based, integration fees may apply |\n| Developer docs | By email request | Public docs and public GitHub repos |\n| Public release record | None found on the pages we read | npm kinestex-sdk-react-native 1.5.0 (2026-10-19); pub.dev kinestex_sdk_flutter 1.5.1 (2026-07-04); Kotlin SDK 2.5.0 in the install docs; Swift, Kotlin and SwiftUI-kit repos updated Nov 5, 2026 |\n| Accuracy | Validation study against a 10-camera motion lab (vendor claim, \"Kemtai data on file\") | \"97.2% accuracy\" (vendor claim) |\n\n## Where Kemtai wins\n\n**Regulatory status.** Kemtai's FAQ states \"FDA-listed as a medical device\", CE marking under MDR 2017/745 and three ISO certifications, and the home page repeats \"FDA-listed and CE-marked medical device\". None of the KinesteX pages we read claim a medical-device listing; its home page says its test results \"support clinical judgment; they are not a diagnosis\". For a regulated care pathway, that is decisive.\n\n**Rehab library depth.** More than 2,000 exercises and variations, spread across physiotherapy, MSK, neuro and chronic care, against KinesteX's 500+ on its site. For a clinic prescribing protocol-specific variants, that breadth matters.\n\n**Clinician workflow and RTM positioning.** Kemtai CARE lets staff \"register patients, create templates of protocols and assessments, prescribe AI-guided home exercise protocols, and track granular adherence and performance data\", and its management APIs automate patient creation and care-plan assignment. Remote Therapeutic Monitoring sits in its solutions menu. KinesteX has an admin panel and clinician progress dashboards, but no equivalent protocol-management app is described on the pages we read.\n\n**A validation study, as a claim.** Kemtai says its accuracy \"was scientifically validated in a study comparing it to a gold-standard motion lab that used 10 3D cameras and body sensors\", footnoted \"Kemtai data on file. Kemtai Accuracy Study, ALYN. March 2025.\" Its FAQ calls it \"a peer-reviewed study\" against a Vicon system. We could not read the study itself (the report is behind an email form), but a named lab comparison is more than KinesteX's single percentage offers.\n\n**A web app with no install.** Kemtai CARE runs as a web app with \"No downloads. No installations\", so a clinic can start without building anything.\n\n## Where KinesteX wins\n\n**Time to integrate and what ships in the box.** KinesteX's FAQ says integration \"typically takes under a day\", and its SDK-integration page puts a full Ready-made Experiences project at \"1 week or less\". What arrives is finished: AI Trainer Chat with onboarding, a camera fitness assessment and per-session workouts; plan, workout, challenge and leaderboard views; three motion games; assessments; an admin panel; and a Content API. Kemtai's EU digital-health page promises launch \"in weeks instead of years\", and its API docs are only available by email request, so we could not see what integration involves.\n\n**Platform breadth.** KinesteX documents six integration paths, including React Native, Flutter and a plain iframe for any web page or PWA. Kemtai describes APIs, embeddables and a web app, and the pages we read name no SDK packages or platforms beyond \"any device with a camera\".\n\n**A published entry price.** KinesteX's seed deck states \"$1.50 per MAU. $1,500 monthly minimum.\" Kemtai publishes no price on any page we read. A published floor lets a team budget before the first call.\n\n**Languages.** KinesteX's FAQ lists 19 languages, with right-to-left support for Arabic, Hebrew and Urdu. Kemtai does not publish a language list on the pages we read.\n\n**Maintenance record you can check.** KinesteX's releases are public: kinestex-sdk-react-native 1.5.0 on npm on October 19, 2026, kinestex_sdk_flutter 1.5.1 on pub.dev on July 4, 2026, and its Swift, Kotlin and SwiftUI-kit repositories updated November 5, 2026. Kemtai's product is not public in that way, so there is no release history to inspect.\n\n## Verdict\n\nKinesteX wins this comparison on the criteria we apply to every page. It is faster to a working integration (\"typically takes under a day\") with more in the box (ready-made views, AI Trainer Chat, Content API, admin panel, assessments, 19 languages). It covers more platforms, from Swift and Kotlin to React Native, Flutter, React TypeScript and an HTML/JavaScript iframe. It has a stated entry price ($1.50 per MAU, $1,500 monthly minimum) where Kemtai publishes none, and a public maintenance record with releases in October and November 2026.\n\nThe verdict flips to Kemtai when your product is itself a regulated medical device, bills Remote Therapeutic Monitoring codes, or needs clinician protocol management and a 2,000-exercise rehab library. Kemtai's FDA listing, CE marking and Kemtai CARE are built for that buyer, and KinesteX does not claim them.\n\n## What we could not verify\n\n- **Accuracy, for both.** No independent benchmark compares these products. Kemtai's validation study is described as \"data on file\" on its home page and as peer-reviewed in its FAQ, and the report sits behind an email form. KinesteX's \"97.2% accuracy\" is its own figure, and a KinesteX README says \"consistently exceed 90% accuracy\". Neither figure is used in the verdict.\n- **Kemtai's body-point count.** The home page and FAQ say 111 points; the EU digital-health page says \"113-Point Tracking\".\n- **Kemtai prices.** None published; no page we read lists one.\n- **Kemtai's FDA pathway.** The pages say \"FDA-listed\"; none names a clearance, a class or a 510(k) number.\n- **Kemtai's RTM billing support.** RTM appears in its menu and blog titles; we did not read the RTM page itself.\n- **KinesteX's processing wording.** Its security page says \"All camera and vision processing stays on-device\", while its Kotlin, Flutter and React Native READMEs say \"optional edge processing (no cloud transmission)\". Get your configuration's behavior in writing.\n- **KinesteX's numbers between documents.** The site says 500+ exercises and 19 languages; the deck says 550+ and 17.\n\n## Which should you pick?\n\n- **You are building a regulated rehab product, a provider service that bills RTM, or a clinic workflow** → Kemtai. Ask for its API docs and its regulatory documentation.\n- **You run a clinic and want something staff can use tomorrow without developers** → Kemtai CARE, the web app.\n- **You run a fitness, wellness, corporate-wellness or insurer app and want camera coaching under your brand this month** → KinesteX, starting with the ready-made experiences.\n- **You need rehab-style tests (Timed Up and Go, sit-to-stand, balance) inside a consumer app** → KinesteX's assessments cover that, with the caveat on its own home page that results support clinical judgment and are not a diagnosis.\n- **You want to build the experience yourself on raw pose models** → read [build vs buy](/motion/build-vs-buy-ai-motion-tracking) and [the pose model comparison](/motion/pose-estimation-models-compared) first.\n- **You want the wider field** → [KinesteX alternatives](/alternatives/kinestex-alternatives) and [KinesteX vs competitors](/compare/kinestex-vs-competitors), written under the same disclosure.",
    "faqs": [
      {
        "q": "Is Kemtai FDA cleared or FDA listed?",
        "a": "Kemtai's own wording is listed. Its FAQ says it is \"FDA-listed as a medical device\", CE-marked under MDR 2017/745 as a medical device and ISO-certified (13485, 27799, 27001), and its home page says \"FDA-listed and CE-marked medical device\". None of the pages we read on November 9, 2026 says cleared or cites a 510(k) number or device class, so use Kemtai's term and ask the company for its regulatory documentation and intended-use statement before relying on it."
      },
      {
        "q": "Does Kemtai publish prices?",
        "a": "No. None of the Kemtai pages we read on November 9, 2026 lists a price, and access to its API documentation goes through an email form. KinesteX's public seed deck states $1.50 per monthly active user with a $1,500 monthly minimum, while kinestex.com itself describes usage-based plans and says integration fees may apply. Ask Kemtai directly for a quote that covers the CARE app or the API path you need."
      },
      {
        "q": "Can I use Kemtai for consumer fitness rather than physical therapy?",
        "a": "Partly. Kemtai names digital health platforms and health and wellness apps among its buyers, lists weight management as a solution, and its FAQ says the library runs from physiotherapy to pilates, easy stretching and high-intensity exercises. But every page we read frames the product around rehab: its tagline is a digital physical therapy platform, and even its computer-vision-fitness address redirects to a computer-vision-rehab page. For a fitness-first app, expect clinical framing in the product."
      },
      {
        "q": "Does KinesteX offer physical therapy assessments like Kemtai?",
        "a": "It offers movement tests, though not as a medical device. KinesteX's data-points docs define Timed Up and Go, Single Leg Stand, 30-Second Sit-to-Stand and shoulder range-of-motion assessments, and its home page says at-home balance tests are scored as low, moderate or high fall risk. The same page says results support clinical judgment and are not a diagnosis. It describes no protocol-prescription app like Kemtai CARE and claims no FDA listing."
      },
      {
        "q": "Which is faster to integrate, KinesteX or Kemtai?",
        "a": "On the published record, KinesteX. Its FAQ says integration typically takes under a day, and its SDK-integration page puts a ready-made experience project at one week or less with one developer. Kemtai's EU digital-health page promises launch in weeks instead of years through its SDK and APIs, but its API docs are only available by email, so we could not check the steps. Kemtai CARE, its clinician web app, needs no integration at all."
      }
    ],
    "related": [
      {
        "href": "/compare/kinestex-vs-exer-ai",
        "label": "KinesteX vs Exer AI"
      },
      {
        "href": "/compare/kinestex-vs-asensei",
        "label": "KinesteX vs Asensei"
      },
      {
        "href": "/compare/kinestex-vs-competitors",
        "label": "KinesteX vs competitors"
      },
      {
        "href": "/alternatives/kinestex-alternatives",
        "label": "KinesteX alternatives, the vendor's own list"
      },
      {
        "href": "/guides/evaluate-motion-sdks",
        "label": "How to evaluate a motion SDK"
      },
      {
        "href": "/motion/build-vs-buy-ai-motion-tracking",
        "label": "Build vs buy AI motion tracking"
      }
    ],
    "cta": {
      "pitch": "Regulatory claims, library sizes and prices move quietly on vendor pages. Get our developer notes when a rehab or motion SDK vendor changes what it publishes."
    },
    "firstParty": true,
    "sources": [
      {
        "url": "https://kemtai.com/",
        "checked": "2026-11-09",
        "note": "positioning, FDA-listed and CE-marked line, 2,000+ exercises, 111 points, CARE features, validation study claim, API docs by email (snapshot)"
      },
      {
        "url": "https://kemtai.com/kemtai-api-and-embeddables/",
        "checked": "2026-11-09",
        "note": "Embeddable Exercise Player, management components, data and management APIs (snapshot)"
      },
      {
        "url": "https://kemtai.com/faqs",
        "checked": "2026-11-09",
        "note": "regulatory wording, web app, Kemtai CARE, library range, peer-reviewed study claim (snapshot)"
      },
      {
        "url": "https://kemtai.com/product",
        "checked": "2026-11-09",
        "note": "physical therapy and rehabilitation positioning (snapshot)"
      },
      {
        "url": "https://kemtai.com/product/computer-vision-rehab/",
        "checked": "2026-11-09",
        "note": "B2B physical therapy platform; redirect from computer-vision-fitness (snapshot)"
      },
      {
        "url": "https://eu.kemtai.com/api-integration/",
        "checked": "2026-11-09",
        "note": "two main levels of the API (snapshot)"
      },
      {
        "url": "https://eu.kemtai.com/digital-health-platforms/",
        "checked": "2026-11-09",
        "note": "113-point tracking, launch in weeks (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/data-points",
        "checked": "2026-11-09",
        "note": "TUG, SLS, STS and shoulder ROM assessments (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/solutions/physical-therapy",
        "checked": "2026-11-09",
        "note": "clinician progress dashboards (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/hipaa",
        "checked": "2026-11-09",
        "note": "HIPAA statement (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/",
        "checked": "2026-11-09",
        "note": "home page: positioning, 500+ exercises, 19 languages, movement tests, not-a-diagnosis line, 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/getting-started",
        "checked": "2026-11-09",
        "note": "SDK list, requirements, plug-and-play views, camera component, API key (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/ai-trainer-chat",
        "checked": "2026-11-09",
        "note": "AI Trainer Chat; Complete UX and Personalized Plan View marked Sunset (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/content-api-v2",
        "checked": "2026-11-09",
        "note": "Content API at data.kinestex.com (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/installation",
        "checked": "2026-11-09",
        "note": "install steps, Kotlin 2.5.0, iframe embed (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-11-09",
        "note": "under a day, 19 languages, pricing model, 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/sdk-integration",
        "checked": "2026-11-09",
        "note": "three ways in, timelines, requirements, video handling (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-11-09",
        "note": "on-device processing statement (snapshot)"
      },
      {
        "url": "https://github.com/KinesteX",
        "checked": "2026-11-09",
        "note": "12 public repositories, licenses, update dates"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-11-09",
        "note": "WebView architecture"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-11-09",
        "note": "optional edge processing wording, Apache-2.0"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-ReactNative",
        "checked": "2026-11-09",
        "note": "optional edge processing wording"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-11-09",
        "note": "the 90% accuracy claim"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-11-09",
        "note": "1.5.0 on 2026-10-19, Apache-2.0"
      },
      {
        "url": "https://pub.dev/packages/kinestex_sdk_flutter",
        "checked": "2026-11-09",
        "note": "1.5.1 on 2026-07-04"
      },
      {
        "url": "https://kinestex-pitch.vercel.app/",
        "checked": "2026-11-09",
        "note": "seed deck: $1.50 per MAU, $1,500 monthly minimum, 550+ exercises, 17 languages, 23 paying customers"
      }
    ]
  },
  {
    "slug": "kinestex-vs-asensei",
    "primaryQuery": "kinestex vs asensei",
    "h1": "KinesteX vs Asensei: Plug-and-Play or Headless SDK?",
    "metaTitle": "KinesteX vs Asensei: Plug-and-Play SDK or Headless SDK",
    "metaDescription": "KinesteX vs Asensei: ready-made coaching views vs a headless SDK, compared on platforms, price, access and docs. KinesteX funds this site.",
    "updated": "2026-11-09",
    "answer": "Asensei is a headless, cross-platform movement-recognition SDK for native iOS and Android, web, Ionic, React and Unity that runs on device, with an optional cloud deployment for broadcast, Coach IQ tools for content teams, a showcase that includes Tonal, Centr and NHS Lothian, SDK access by request and no prices on its site. KinesteX (this site's own product) ships finished, white-label experiences, including an AI trainer chat, workouts, challenges and assessments, plus a camera component and content API, with public docs and a deck price of $1.50 per monthly active user and a $1,500 monthly minimum. On integration time, what ships in the box, a stated price and a public release record, KinesteX is our pick. Choose Asensei instead for connected-fitness hardware or a Unity or VR product, for a team that wants to own every pixel and supply its own coaching content, or if you already run on Hyperhuman.",
    "body": "**Disclosure: KinesteX funds this site, and this page was written by the company behind KinesteX, so it compares Asensei with this site's own product.** Every claim about either vendor comes from their own public pages, Asensei's App Store listing, a partner's blog, KinesteX's READMEs and package registries, or KinesteX's public seed deck, all read on November 9, 2026. Accuracy is left out of the verdict because neither side publishes an independent benchmark, and the \"Where Asensei wins\" section comes before ours. The [automated checks that gate every deploy](/gates) refuse a page that links to this site's funder without a disclosure beside it.\n\nBoth companies sell camera-based movement recognition to other businesses, and both use the word SDK. They hand you different things. Asensei describes a headless SDK: it streams what it sees and leaves every screen, every word of coaching content and the voice of your coach to you. KinesteX ships finished experiences (an AI trainer chat, workouts, challenges, games, assessments) that open inside your app under your brand, with a camera component for teams that want only the tracking. The choice is how much product you intend to build.\n\n## What each one is, per its own pages\n\n**Asensei** calls itself, on its [home page](https://asensei.ai/), \"the leading software development kit (SDK) for computer vision-based movement recognition and coaching intelligence\", and the easiest way to add movement recognition and AI coaching \"to any hardware or software product\". It says it provides computer vision, \"specialized large language models (LLM) and conversational AI\" running on device, while \"You bring your expertise - what to teach, how to teach it, and the style and voice of your coaches.\" Its [ASENSEI AI page](https://asensei.ai/ai) gives the architecture in three sentences: \"ASENSEI is a cross-platform SDK supporting both native IOS and Android, Web, as well as platforms including Ionic, React, and Unity.\"; \"ASENSEI is a headless SDK , providing the real-time information streams to power user-experiences without imposing them.\"; and it is \"optimized to run on-device , from low-power connected fitness hardware to the latest smartphone\", with \"a cloud-based deployment for sport and broadcast solutions that demand it.\"\n\nAround that SDK sit more products. [Cloud Coach](https://asensei.ai/cloud-coach) deploys Asensei \"in a container environment\" for application endpoints, heavier vision models or \"terabytes of multi-camera game footage\". [Coach IQ](https://asensei.ai/coach-iq) offers \"tools for your content and coaching teams\", including \"Dynamic Audio using your Coach's voice\". The menu also lists ASENSEI XR and a Spatial Computing (VR/AR) industry. The showcase names 22 customers and partners, among them Tonal, Centr, NHS Lothian, Kinaxa, AMP Health, British Rowing, PowerBlock, Qualcomm and Hyperhuman, and a home-page headline says Tonal partners with Asensei for 3D human motion analysis, tied to Tonal 2's Smart View.\n\nTo try it, there is [ASENSEI Spark](https://apps.apple.com/us/app/asensei-spark/id6450310525), a free iPhone and iPad demo app, version 1.3.1 of October 21, which describes Asensei as \"powered by 3D Computer Vision, Spatial Computing, and Equipment Recognition\". To build with it, the developer links start with \"Request SDK Access\", and the [contact form](https://asensei.ai/contact) has an enquiry type \"Inquire about ASENSEI SDK\". No page we read on asensei.ai lists a price. One partner does describe a commercial structure: [Hyperhuman's blog](https://blog.hyperhuman.cc/ai-movement-recognition-white-label-fitness-app/) says its own Movement Recognition Module, \"powered by ASENSEI's movement recognition SDK\", is billed as a one-time setup, a monthly module subscription and a per-active-member fee with \"starting bands for up to 10k, 10–50k, 50k+ members\". That is Hyperhuman's pricing for Hyperhuman's module, not an Asensei price list, and it gives no figures.\n\n**KinesteX** describes itself on its [home page](https://www.kinestex.com/) as \"a white-label SDK that coaches every rep through your users' own camera, inside your app\". Its [Getting Started docs](https://www.kinestex.com/docs/getting-started) list SDKs for Swift, Kotlin, Flutter, React Native and React (TypeScript), \"plus a plain HTML/JavaScript iframe integration for any web page or PWA\", on iOS 14.0+ (Xcode 16.3+) and Android 9+ (API 28). The native SDKs wrap a hosted experience: the [SwiftUI kit README](https://github.com/KinesteX/KinesteX-AI-Kit) calls itself \"a SwiftUI package that embeds KinesteX's AI-powered camera workout experience as a WebView\". The plug-and-play views are AI Trainer Chat (recommended for new integrations), Plan, Workout, Challenge and Leaderboard views, AI Experiences (Balloon Pop, Color Chase and Alien Squat Shooter) and an Admin Workout Editor. For custom builds there is a Camera Component that streams reps, holds, form feedback and presence and, on request, pose landmarks, and a [Content API](https://www.kinestex.com/docs/content-api-v2) at data.kinestex.com serving exercises, workouts and plans. The site counts 500+ AI exercises (the deck says \"550+ exercises built in\") and 19 languages. Its [FAQ](https://www.kinestex.com/product/faqs) says integration \"typically takes under a day\", and KinesteX's public [seed deck](https://kinestex-pitch.vercel.app/) states \"$1.50 per MAU. $1,500 monthly minimum.\"; kinestex.com publishes no price list.\n\n## Side by side\n\nRead on November 9, 2026. Gaps are marked as gaps.\n\n| Dimension | Asensei | KinesteX |\n|---|---|---|\n| What you get | Headless SDK: real-time information streams, no imposed UI | Finished, white-label experiences in a WebView or iframe, plus a camera component and Content API |\n| Platforms named | Native iOS and Android, Web, Ionic, React, Unity | Swift, Kotlin, Flutter, React Native, React (TypeScript), HTML/JavaScript iframe |\n| Where it runs | On-device, \"from low-power connected fitness hardware to the latest smartphone\"; cloud deployment for sport and broadcast (Cloud Coach) | On the user's device per its security page; the AI trainer chat needs internet |\n| Ready-made screens | None stated; you build the experience | AI Trainer Chat, plan, workout, challenge, leaderboard, three motion games, assessments, admin editor |\n| Content tools | Coach IQ for your content and coaching teams, including your coach's voice | Content API (exercises, workouts, plans) and an admin panel; 500+ exercises in its library |\n| Exercise library count | Not published on the pages we read | 500+ (site); \"550+ exercises built in\" (deck) |\n| Languages | Not published on asensei.ai; the Spark demo lists English | 19 (FAQ and home page); 17 on the deck's competition slide |\n| Showcase | Tonal, Centr, NHS Lothian, Kinaxa, AMP Health, Qualcomm and 16 more | Not compared here; KinesteX's deck says \"23 Paying customers\" and \"40+ apps, 11 countries\" |\n| How to start | \"Request SDK Access\" and a contact form; free Spark demo app on the App Store | Public docs and repos; API key when you book a call or fill the contact form |\n| Published price | None on asensei.ai; Hyperhuman describes per-member tiers for its own Asensei-powered module, without figures | Deck: $1.50 per monthly active user (MAU), $1,500 monthly minimum; FAQ: usage-based, integration fees may apply |\n| Public release record | Spark app 1.3.1, October 21; no public SDK packages or repositories found on the pages we read | npm kinestex-sdk-react-native 1.5.0 (2026-10-19); pub.dev kinestex_sdk_flutter 1.5.1 (2026-07-04); repos updated Nov 5, 2026 |\n| Accuracy | No figure on the pages we read | \"97.2% accuracy\" (vendor claim) |\n\n## Where Asensei wins\n\n**Headless, native information streams.** Asensei's own words are that it powers user experiences \"without imposing them\". A team that wants every pixel of the workout screen in its own native code, its own rendering and its own transitions gets that by design. KinesteX's ready-made path is a hosted web experience inside a WebView, and its custom path still runs through the camera component it provides.\n\n**Unity and connected-fitness hardware.** Asensei lists Unity among its platforms and says it runs on \"low-power connected fitness hardware\", and its menu carries ASENSEI XR and Spatial Computing (VR/AR). The Spark listing says it supports Apple Vision on visionOS 1.0 or later. KinesteX documents no Unity SDK. For a strength machine, a rower or a VR title, Asensei is the one claiming that ground.\n\n**Equipment recognition and 3D, as claims.** The Spark listing describes \"3D Computer Vision, Spatial Computing, and Equipment Recognition\", and Tonal's partnership is described as 3D human motion analysis. We have not tested any of this, and no independent benchmark exists, but KinesteX does not make an equipment-recognition claim on the pages we read.\n\n**Cloud deployment for broadcast.** Cloud Coach processes multi-camera game footage in containers and exposes \"API Endpoints for Near Real-Time Applications\". KinesteX describes no comparable broadcast product.\n\n**Your coaches, your voice.** Coach IQ is built for content teams to \"Teach ASENSEI how to train like your trainers\", with dynamic audio in your coach's voice. If your brand is its coaches, that is the right shape.\n\n**A big-brand showcase.** Tonal, Centr and NHS Lothian are names procurement teams recognize, and AMP's chief executive is quoted on the home page calling the integration \"one of the smoothest technical collaborations I've experienced\".\n\n## Where KinesteX wins\n\n**Ready-made experiences and an AI trainer.** KinesteX's docs recommend AI Trainer Chat, \"Conversational AI personal trainer with in-app fitness assessment, personalized workout generation, post-workout check-ins, and next-session scheduling\", and its SDK-integration page puts a Ready-made Experiences project at \"1 week or less\" with one developer. Asensei's headless design means your team builds the equivalent screens.\n\n**A drop-in web path.** Both list the web. KinesteX's web integration is an iframe that opens finished screens on any page or PWA, documented step by step alongside a React TypeScript package; its docs name Chrome, Safari, Firefox and Edge.\n\n**A published entry price.** KinesteX's deck states \"$1.50 per MAU. $1,500 monthly minimum.\" Asensei publishes no price on asensei.ai, and the only structure we found is Hyperhuman's description of its own module.\n\n**Content API and admin panel.** KinesteX ships a catalog (500+ exercises on its site) and serves it through a REST Content API at data.kinestex.com, with an admin panel for design, workouts and usage statistics. Asensei gives your content team tools, but the content is yours to supply.\n\n**Documentation and code you can read before any call.** KinesteX's docs are public and its GitHub organization lists 12 repositories, with an Apache-2.0 license in the Kotlin, Swift and HTML-JS SDK repos (none at the root of the SwiftUI-kit, PWA and Flutter repos). Asensei's developer path starts at \"Request SDK Access\"; AMP's CEO calls its documentation \"top-notch\", but we could not read it.\n\n**A maintenance record.** kinestex-sdk-react-native 1.5.0 on npm on October 19, 2026, kinestex_sdk_flutter 1.5.1 on pub.dev on July 4, 2026, and Swift, Kotlin and SwiftUI-kit repositories updated November 5, 2026. For Asensei, the public record we could read is the Spark demo app's version history.\n\n## Verdict\n\nKinesteX wins this comparison on the criteria we apply to every page. It is faster to a working integration (\"typically takes under a day\") with more in the box (ready-made views, AI Trainer Chat, Content API, admin panel, assessments, 19 languages). It covers native and web, from Swift and Kotlin to React Native, Flutter, React TypeScript and an HTML/JavaScript iframe. It has a stated entry price ($1.50 per MAU, $1,500 monthly minimum) where Asensei publishes none, and a public maintenance record with releases in October and November 2026.\n\nThe verdict flips to Asensei for a connected-fitness hardware product or a Unity or VR title, for a team that wants to own every pixel and feed in its own coaching content and coach's voice, and for a company already running on Hyperhuman, whose white-label app offers an Asensei-powered module.\n\n## What we could not verify\n\n- **Accuracy, for both.** No independent benchmark compares these products. KinesteX's \"97.2% accuracy\" is its own claim; Asensei publishes no figure on the pages we read. Neither enters the verdict.\n- **Asensei prices.** None on asensei.ai. Hyperhuman's tiers apply to Hyperhuman's module and carry no figures.\n- **Asensei's SDK documentation, packages and minimum OS versions.** Access is by request, so we could not read them. The Spark demo requires iOS 14.0 or later.\n- **Asensei's exercise coverage and languages.** Not published on the pages we read.\n- **Asensei's data handling in production.** Its site says processing runs on device; the Spark demo's App Store privacy label, as declared by the developer, lists Photos or Videos among data that may be collected. That label covers the demo app, not necessarily an SDK integration.\n- **KinesteX's processing wording.** Its security page says \"All camera and vision processing stays on-device\", while its Kotlin, Flutter and React Native READMEs say \"optional edge processing (no cloud transmission)\". Get your configuration's behavior in writing.\n- **KinesteX's numbers between documents.** The site says 500+ exercises and 19 languages; the deck says 550+ and 17.\n\n## Which should you pick?\n\n- **Connected-fitness hardware, Unity, or VR** → Asensei. Request SDK access and ask for the platform list for your device.\n- **A native app where your designers own every screen and your coaches' voices are the product** → Asensei's headless SDK and Coach IQ.\n- **You already run a Hyperhuman white-label app** → its Asensei-powered module is the shortest route.\n- **A mobile or web app that needs camera coaching under its brand within weeks** → KinesteX, starting with AI Trainer Chat or the ready-made experiences.\n- **You want to own the UI but not the content** → KinesteX's camera component and Content API, as a middle path.\n- **You are unsure whether to buy at all** → [build vs buy](/motion/build-vs-buy-ai-motion-tracking) and [the pose model comparison](/motion/pose-estimation-models-compared) set out what raw models leave you to build, and [KinesteX alternatives](/alternatives/kinestex-alternatives) maps the field under the same disclosure.",
    "faqs": [
      {
        "q": "Does Asensei publish SDK pricing?",
        "a": "Not on asensei.ai as read on November 9, 2026; its pages lead to contact sales, a demo booking and an SDK access request. The only commercial structure we found is from Hyperhuman, a partner, which says its own Asensei-powered module is billed as a setup fee, a monthly module subscription and per-active-member tiers with bands up to 10k, 10 to 50k and 50k-plus members, without figures. KinesteX's seed deck states $1.50 per monthly active user with a $1,500 monthly minimum."
      },
      {
        "q": "Does Asensei support Unity or VR?",
        "a": "Asensei lists Unity among its supported platforms, alongside native iOS and Android, Web, Ionic and React. Its menu includes an ASENSEI XR product and a Spatial Computing (VR/AR) industry page, and the App Store listing for its Spark demo app says it runs on Apple Vision with visionOS 1.0 or later. We did not read the XR page itself. KinesteX documents no Unity SDK."
      },
      {
        "q": "Is the Asensei SDK headless?",
        "a": "Yes, by its own description: \"ASENSEI is a headless SDK\", providing real-time information streams to power user experiences without imposing them. In practice your team designs and builds the workout screens, coaching cues and content, with Coach IQ tools to shape the coaching. KinesteX takes the other route: its plug-and-play views ship finished screens, and its camera component is the option for teams that want only the tracking events."
      },
      {
        "q": "Is there a free Asensei demo app I can try?",
        "a": "Yes. ASENSEI Spark is free on the App Store for iPhone and iPad, requires iOS 14.0 or later, and was at version 1.3.1, dated October 21, when we checked on November 9, 2026. Asensei describes it as built for partners evaluating its SDK, with mobile and kiosk modes and a set of pre-built movement assessments. The SDK itself is not self-serve: the developer path starts with a request for SDK access."
      },
      {
        "q": "Does Asensei process video on the device or in the cloud?",
        "a": "Both options are described. Asensei says its SDK is optimized to run on device, from low-power connected fitness hardware to smartphones, and offers a cloud deployment, Cloud Coach, for sport and broadcast work such as multi-camera game footage. The App Store privacy label for its Spark demo, as declared by the developer, lists photos or videos among data that may be collected. Confirm the behavior of your own integration in writing."
      }
    ],
    "related": [
      {
        "href": "/compare/kinestex-vs-kemtai",
        "label": "KinesteX vs Kemtai"
      },
      {
        "href": "/compare/kinestex-vs-sency",
        "label": "KinesteX vs Sency"
      },
      {
        "href": "/compare/kinestex-vs-quickpose",
        "label": "KinesteX vs QuickPose"
      },
      {
        "href": "/alternatives/kinestex-alternatives",
        "label": "KinesteX alternatives, the vendor's own list"
      },
      {
        "href": "/fitness-apis/ai-workout-tracking-apis",
        "label": "AI workout tracking APIs"
      },
      {
        "href": "/guides/camera-pose-tracking",
        "label": "Camera pose tracking guide"
      }
    ],
    "cta": {
      "pitch": "Request-only SDKs change without a changelog you can read. Get our developer notes when a motion SDK vendor opens its docs, publishes a price or adds a platform."
    },
    "firstParty": true,
    "sources": [
      {
        "url": "https://asensei.ai/",
        "checked": "2026-11-09",
        "note": "positioning, on-device LLM and vision claim, showcase, Tonal and NHS stories, AMP quote, Request SDK Access (snapshot)"
      },
      {
        "url": "https://www.asensei.ai/",
        "checked": "2026-11-09",
        "note": "same home page on the www host (snapshot)"
      },
      {
        "url": "https://asensei.ai/ai",
        "checked": "2026-11-09",
        "note": "platforms, headless SDK, on-device, cloud deployment (snapshot)"
      },
      {
        "url": "https://asensei.ai/cloud-coach",
        "checked": "2026-11-09",
        "note": "container deployment, game footage, API endpoints (snapshot)"
      },
      {
        "url": "https://asensei.ai/coach-iq",
        "checked": "2026-11-09",
        "note": "tools for content teams, coach's voice (snapshot)"
      },
      {
        "url": "https://asensei.ai/contact",
        "checked": "2026-11-09",
        "note": "SDK enquiry type on the contact form (snapshot)"
      },
      {
        "url": "https://apps.apple.com/us/app/asensei-spark/id6450310525",
        "checked": "2026-11-09",
        "note": "Spark demo app: free, 1.3.1 Oct 21, iOS 14.0, visionOS 1.0, 3D and equipment recognition claims, privacy label (snapshot)"
      },
      {
        "url": "https://blog.hyperhuman.cc/ai-movement-recognition-white-label-fitness-app/",
        "checked": "2026-11-09",
        "note": "Hyperhuman's Asensei-powered module and its indicative pricing structure; Hyperhuman, not Asensei (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/",
        "checked": "2026-11-09",
        "note": "home page: positioning, 500+ exercises, 19 languages, movement tests, not-a-diagnosis line, 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/getting-started",
        "checked": "2026-11-09",
        "note": "SDK list, requirements, plug-and-play views, camera component, API key (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/ai-trainer-chat",
        "checked": "2026-11-09",
        "note": "AI Trainer Chat; Complete UX and Personalized Plan View marked Sunset (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/content-api-v2",
        "checked": "2026-11-09",
        "note": "Content API at data.kinestex.com (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/installation",
        "checked": "2026-11-09",
        "note": "install steps, Kotlin 2.5.0, iframe embed (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-11-09",
        "note": "under a day, 19 languages, pricing model, 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/sdk-integration",
        "checked": "2026-11-09",
        "note": "three ways in, timelines, requirements, video handling (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-11-09",
        "note": "on-device processing statement (snapshot)"
      },
      {
        "url": "https://github.com/KinesteX",
        "checked": "2026-11-09",
        "note": "12 public repositories, licenses, update dates"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-11-09",
        "note": "WebView architecture"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-11-09",
        "note": "optional edge processing wording, Apache-2.0"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-ReactNative",
        "checked": "2026-11-09",
        "note": "optional edge processing wording"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-11-09",
        "note": "the 90% accuracy claim"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-11-09",
        "note": "1.5.0 on 2026-10-19, Apache-2.0"
      },
      {
        "url": "https://pub.dev/packages/kinestex_sdk_flutter",
        "checked": "2026-11-09",
        "note": "1.5.1 on 2026-07-04"
      },
      {
        "url": "https://kinestex-pitch.vercel.app/",
        "checked": "2026-11-09",
        "note": "seed deck: $1.50 per MAU, $1,500 monthly minimum, 550+ exercises, 17 languages, 23 paying customers"
      }
    ]
  },
  {
    "slug": "kinestex-vs-exer-ai",
    "primaryQuery": "kinestex vs exer ai",
    "h1": "KinesteX vs Exer AI: Developer SDK or Clinical Platform?",
    "metaTitle": "KinesteX vs Exer AI: SDK or Clinical Platform?",
    "metaDescription": "KinesteX vs Exer AI: a white-label SDK vs an FDA Class II clinical platform, platforms, prices and validation, checked. KinesteX funds this site.",
    "updated": "2026-11-09",
    "answer": "Exer AI and KinesteX (this site's own product) sell different things: Exer AI sells a clinical motion platform to healthcare providers, with a clinician scan app, a patient app from the app store and a hand and wrist module, and describes itself as an FDA Class II medical device (software), while KinesteX is a white-label SDK a developer embeds in their own iOS, Android, Flutter, React Native or web app. KinesteX is our overall pick for anyone building an app, on what ships in the box, platform breadth including the web, a stated entry price in its seed deck ($1.50 per monthly active user with a $1,500 monthly minimum) where Exer publishes none, and public packages updated in October and November 2026. The verdict flips to Exer AI if you are a provider buying a finished clinical tool rather than building one, or if you need a product its maker describes as a registered Class II medical device.",
    "body": "**Disclosure: KinesteX funds this site, and this page is written by the company behind KinesteX, so read it as a first-party comparison.** KinesteX is this site's own product. Every claim about either company traces to its own public pages, its GitHub READMEs, a package registry or, for KinesteX's price, its public seed deck, as read on November 9, 2026, and quoted passages are re-tested against the live pages by an automated check. [The automated checks that gate every deploy](/gates) also refuse any page that links to this site's funder without a disclosure beside it.\n\nThe first honest thing to say is that these two companies do not sell the same kind of product. Exer AI sells a clinical AI platform to healthcare providers: apps for clinicians and patients, a data portal, billing reports and a regulatory status. KinesteX sells a white-label SDK that a developer puts inside an app they own. They meet at \"AI measures movement through an ordinary camera\", but the real question is whether you are building an app or buying a clinical tool. Answer that first and most of the comparison answers itself.\n\n## What each one is, per its own pages\n\n**Exer AI** (the footer reads \"Exer Labs, Inc\", with an address in Denver) describes itself on its [home page](https://www.exer.ai/) as a \"Clinical AI platform\" that \"turns motion into actionable insights for precision care - without the need for wearables or sensors.\" It sells three named products. [Exer Scan](https://www.exer.ai/product/scan) is \"a mobile-first solution that allows clinicians to capture and analyze objective motion data in real time\", built to run on tablets already in the clinic. [Exer Health](https://www.exer.ai/product/health) is the at-home side, where \"Your patients can start right away using an app downloaded from the app store\", with reminders, streaks and AI form correction. Exer Hands targets \"dozens of acute and chronic hand and wrist disorders like rheumatoid arthritis and carpal tunnel syndrome.\" Solution pages cover orthopedics, senior care, neurology, primary care, rehab and health plans.\n\nThe workflow list on the home page is a provider's list, not a developer's: an at-home patient app, an in-clinic scan app, a real-time data portal backend, automated billing reports, standardized outcome measures, customizable templates and daily engagement tools. The trust block on every product page claims \"HIPAA Compliant\", \"FDA Registered\" with the line \"FDA Class II Medical Device (software), validated.\", \"Proprietary AI\" built on neural networks Exer trains itself, and \"EHR Friendly\", described as \"Barcode into charts in clinic, APIs to streamline integrations and billing.\" Its [tech page](https://www.exer.ai/tech) says \"Everything runs \"on the edge\" - on common laptops, phones and tablets.\" A separate [RTM page](https://www.exer.ai/product/rtm) is built around Remote Therapeutic Monitoring billing codes. The way in is a demo request. On the pages we read there is no developer documentation, no SDK, no package and no price.\n\n**KinesteX** describes itself on its [home page](https://www.kinestex.com/) as \"A white-label SDK that coaches every rep through your users' own camera, inside your app.\" Its [Getting Started docs](https://www.kinestex.com/docs/getting-started) list SDKs for Swift, Kotlin, Flutter, React Native and React (TypeScript), \"plus a plain HTML/JavaScript iframe integration for any web page or PWA\". The architecture is consistent and stated plainly: the [SwiftUI kit README](https://github.com/KinesteX/KinesteX-AI-Kit) calls it \"A SwiftUI package that embeds KinesteX's AI-powered camera workout experience as a WebView.\" The docs list ready-made views (AI Trainer Chat, which they recommend for new integrations, plus Plan, Workout, Challenge and Leaderboard views, AI Experiences such as Balloon Pop, Color Chase and Alien Squat Shooter, and an Admin Workout Editor), and custom options: a Custom Workout, a Camera Component that streams reps, holds, form feedback and presence and, on request, pose landmarks, and REST Content APIs at data.kinestex.com. Two older views, Complete UX (Main) and Personalized Plan View, are marked \"Sunset\" in the docs sidebar.\n\nOn the clinical side, KinesteX's home page lists mobility tests, balance and fall risk, range of motion and home programs for patients, names Timed Up and Go, sit-to-stand and balance tests and shoulder range of motion, and says at-home balance tests are scored as low, moderate or high fall risk; its GitHub organization README adds gait speed and the Functional Reach Test to the assessment list. The same page adds: \"Test results support clinical judgment; they are not a diagnosis.\" Its [HIPAA page](https://www.kinestex.com/product/hipaa) says \"KinesteX is HIPAA compliant.\" The requirements are iOS 14.0+ (Xcode 16.3+) and Android 9+ (API 28) plus the main browsers. KinesteX's [FAQ](https://www.kinestex.com/product/faqs) lists 19 languages and says integration \"typically takes under a day\". kinestex.com publishes no price list; the only figure is in KinesteX's public seed deck, which prices per monthly active user (MAU): \"$1.50 per MAU. $1,500 monthly minimum.\"\n\n## Side by side\n\nEverything in this table was checked on November 9, 2026 against each company's own pages, KinesteX's READMEs and registries, and KinesteX's seed deck. Gaps are marked as gaps.\n\n| Dimension | Exer AI | KinesteX |\n|---|---|---|\n| What it is | Clinical AI platform for providers: Exer Scan, Exer Health, Exer Hands | White-label SDK embedded in your app, plus REST content APIs |\n| Who it is sold to | Clinicians, clinics, senior care, health plans | App developers and the companies behind fitness, rehab, wellness and insurer apps |\n| How you start | Request a demo | Book a call or fill out the contact form for demo access and an API key |\n| Platforms | Clinician app on tablets, patient app from the app store; \"any mobile device (phone, tablet, webcam)\" | Swift, Kotlin, Flutter, React Native, React (TypeScript), HTML/JS iframe; iOS 14+, Android 9+, Chrome, Safari, Firefox, Edge |\n| Regulatory status | \"FDA Class II Medical Device (software), validated.\" (Exer's claim) | No FDA registration claim on the pages we read; \"not a diagnosis\" |\n| Privacy claims | HIPAA compliant; runs \"on the edge\"; no \"cloud-stored patient videos\" | HIPAA compliant, BAA with Google Cloud; camera processing on-device (wording varies, see below) |\n| Integrations | EHR barcode charting and \"APIs to streamline integrations and billing\" | SDK events in your app, content API, AI Trainer API |\n| What ships in the box | Provider workflow: scan app, data portal, billing reports, outcome measures, templates | AI Trainer Chat, workouts, plans, challenges, leaderboards, games, assessments, admin panel, 19 languages |\n| Billing support | RTM codes 98975, 98977, 98980, 98981 explained | None |\n| Validation published | Two conference studies summarized on its blog (ICC figures) | 97.2% accuracy claim, no study described on the pages we read |\n| Published price | Not published on the pages we read | Seed deck: $1.50 per monthly active user, $1,500 monthly minimum |\n| Developer docs and packages | None found on the pages we read | Public docs; npm kinestex-sdk-react-native 1.5.0 (2026-10-19); pub.dev kinestex_sdk_flutter 1.5.1 (2026-07-04) |\n\n## Where Exer AI wins\n\n**A regulatory class KinesteX does not claim.** Exer's product pages say \"FDA Class II Medical Device (software), validated.\" KinesteX makes no FDA registration claim on the pages we read and says its test results are not a diagnosis. If your organization needs a registered medical device, that one line settles the comparison. It matters for billing too: Exer's RTM page notes that \"RTM codes still require the device used to meet the FDA’s definition of a medical device\".\n\n**Clinical validation it publishes in detail.** Exer's [validation post](https://www.exer.ai/posts/exer-ai-clinical-validation-studies-presented-at-assh-and-cns-in-oct-2025) summarizes two studies presented in October 2025. In a Duke Health tremor study, \"The AI model achieved exceptional inter-rater reliability ( ICC = 0.96 ), matching clinician consistency ( ICC = 0.94 ).\" In a hand, wrist and forearm study presented at ASSH, Exer reports ICC above 0.9 against manual goniometry for 96% of motions and measurements \"within ± 5° of manual goniometry across all motions.\" These are Exer's summaries of its own studies, and we do not use them to rank either product, but they are a kind of evidence KinesteX's pages do not offer: KinesteX publishes a single \"97.2% accuracy\" figure with no study described.\n\n**Provider workflows.** A data portal backend, automated billing reports, standardized outcome measures and an in-clinic scan app are built for a clinic's day. With KinesteX, the clinical workflow around its events is yours to build.\n\n**RTM and EHR.** Exer's RTM page walks through four CPT codes and how often each can be billed, and its EHR line covers charting and integration APIs. KinesteX's pages have nothing comparable.\n\n**Hand and wrist depth.** Exer Hands and the Mayo Clinic hand and wrist module announced on its home page go deeper into one clinical area than anything KinesteX lists.\n\n## Where KinesteX wins\n\n**It is an SDK you can embed at all.** We found no Exer SDK, package or developer documentation on the pages we read; the only \"APIs\" Exer mentions sit in an EHR and billing context. If the product you are shipping is your own app, Exer is not a component you can put inside it on the evidence available, and KinesteX is built for exactly that.\n\n**Platform breadth, including the web.** Swift, Kotlin, Flutter, React Native, React (TypeScript) and a plain iframe, with browser support for Chrome, Safari, Firefox and Edge. Exer describes apps for phones, tablets and webcams, but not packages a developer can install.\n\n**Ready-made experiences and an AI trainer.** AI Trainer Chat (\"Conversational AI personal trainer with in-app fitness assessment, personalized workout generation, post-workout check-ins, and next-session scheduling\"), workout, plan, challenge and leaderboard views, three motion games, movement assessments and an admin panel for design and workouts. KinesteX's home page counts 500+ AI exercises; its seed deck says \"550+ exercises built in\". Its [SDK integration page](https://www.kinestex.com/product/sdk-integration) puts the ready-made route at \"1 week or less\" with one developer.\n\n**A published entry price.** KinesteX's seed deck states $1.50 per monthly active user with a $1,500 monthly minimum, and its FAQ says integration fees may apply. Exer publishes no price on the pages we read.\n\n**Open docs and public repositories.** KinesteX's docs are public, its Kotlin, Swift and HTML-JS repositories carry an Apache-2.0 license, and the [GitHub org listing](https://github.com/orgs/KinesteX/repositories) showed KinesteX-AI-Kit, KinesteX-SDK-Kotlin and KinesteX-SDK-Swift updated on November 5, 2026. You can read how the integration works before any call.\n\n## Verdict\n\nKinesteX wins this comparison for anyone building their own app, and our verdict rests on four criteria, each tied to a sourced fact. First, what ships in the box and how fast: AI Trainer Chat, ready-made views, a content API, an admin panel, movement assessments and 19 languages, with a stated \"1 week or less\" for the ready-made route, against no developer integration at all on Exer's pages. Second, platform breadth: six documented integration paths including the web, against apps you deploy rather than embed. Third, price: KinesteX's deck states an entry price of $1.50 per monthly active user with a $1,500 monthly minimum, and Exer publishes none. Fourth, maintenance record: kinestex-sdk-react-native 1.5.0 on October 19, 2026 and three repositories pushed on November 5, 2026, against no public packages from Exer to judge.\n\nThe verdict flips to Exer AI when you are a provider, such as a clinic, hospital system or senior-living operator, buying a finished clinical tool for your clinicians and patients rather than building an app, or when you need a product its maker describes as an FDA Class II medical device. In both cases Exer is the right call and KinesteX does not claim to be that product.\n\n## What we could not verify\n\n- **Exer's FDA status in detail.** The Class II line is Exer's own claim; we did not check FDA's databases, and the pages do not say which product or indication it covers.\n- **Exer prices.** None on the pages we read; the dollar figures on its RTM page are reimbursement amounts it says \"vary by geographic regions, payors and plans\", not Exer's prices.\n- **A developer route at Exer.** The pages mention \"APIs\" only for EHR integrations and billing. Whether Exer licenses its engine to developers is not stated.\n- **Accuracy.** No independent benchmark compares these products. Exer's ICC figures are its own summaries of conference presentations, which we did not read in full. KinesteX's FAQ says \"97.2% accuracy\" while an older README says its models \"consistently exceed 90% accuracy\"; both are vendor claims.\n- **KinesteX's on-device wording.** Its security page says \"All camera and vision processing stays on-device\", while its Kotlin, Flutter and React Native READMEs say \"optional edge processing (no cloud transmission)\". The AI Trainer chat needs internet, per the SDK integration page.\n- **KinesteX's own numbers.** The FAQ lists 19 languages and the deck's competition slide says 17; the website says 500+ exercises and the deck 550+.\n\n## Which should you pick?\n\n- **You are building a fitness, wellness or rehab app and want camera coaching inside it** → KinesteX. Exer offers no embeddable component on the pages we read.\n- **You run a clinic or health system and want a tool your clinicians and patients use tomorrow** → Exer AI, which is built and sold for that.\n- **You need an FDA-registered device or RTM billing support** → Exer AI.\n- **You want to compare clinical-leaning options that do have developer access** → see [KinesteX vs Kemtai](/compare/kinestex-vs-kemtai) and the wider field in [KinesteX alternatives](/alternatives/kinestex-alternatives).\n- **You are unsure whether to build on raw pose models instead** → read [build vs buy for AI motion tracking](/motion/build-vs-buy-ai-motion-tracking) first.\n\nRe-check both companies' pages before you sign: product lines and regulatory claims move, and this page will age.\n",
    "faqs": [
      {
        "q": "Does Exer AI offer an SDK or API for developers?",
        "a": "Not on the pages we read on November 9, 2026. Exer AI's site describes apps for clinicians and patients and a provider portal, and the only mention of APIs is its EHR line: \"Barcode into charts in clinic, APIs to streamline integrations and billing.\" We found no SDK, package, developer documentation or self-serve key. If you need an engine inside your own app, ask Exer directly; KinesteX documents SDKs for Swift, Kotlin, Flutter, React Native, React and an HTML iframe."
      },
      {
        "q": "Is Exer AI an FDA-registered medical device?",
        "a": "Exer AI says so. Its product pages carry the line \"FDA Class II Medical Device (software), validated.\" under an \"FDA Registered\" heading. We did not check FDA's own databases, and the pages do not say which product or indication the registration covers, so confirm the details with Exer before relying on it. KinesteX makes no FDA claim on the pages we read and says its test results support clinical judgment and are not a diagnosis."
      },
      {
        "q": "Can a fitness app use Exer AI?",
        "a": "Not as a component, on the evidence we have. Exer AI markets its platform to providers in orthopedics, senior care, neurology, primary care, rehab and health plans, and its patient app is something patients download from the app store. Nothing on the pages we read describes embedding Exer's tracking in a third-party fitness app. A fitness app that wants camera coaching under its own brand is the case KinesteX's white-label SDK is built for."
      },
      {
        "q": "Does KinesteX have clinical validation like Exer AI?",
        "a": "Not of the same kind, on the pages we read. Exer AI's blog summarizes two conference studies with ICC figures, including ICC = 0.96 in a Duke tremor study. KinesteX publishes a 97.2% accuracy figure without describing a study, and an older README says its models \"consistently exceed 90% accuracy\". All of these are vendor claims; no independent benchmark compares the two products."
      },
      {
        "q": "Where does Exer AI process patient video?",
        "a": "On the device, per its own pages. Exer AI's tech page says \"Everything runs \"on the edge\" - on common laptops, phones and tablets\", and its Exer Health page promises monitoring without \"cloud-stored patient videos\". KinesteX's security page says all camera and vision processing stays on-device, though its SDK READMEs describe \"optional edge processing\", and its AI Trainer chat needs internet. Get the behavior of your configuration in writing from either vendor."
      }
    ],
    "related": [
      {
        "href": "/compare/kinestex-vs-kemtai",
        "label": "KinesteX vs Kemtai"
      },
      {
        "href": "/compare/kinestex-vs-competitors",
        "label": "KinesteX vs competitors"
      },
      {
        "href": "/alternatives/kinestex-alternatives",
        "label": "KinesteX alternatives, the vendor's own list"
      },
      {
        "href": "/compare/kinestex-vs-posetracker",
        "label": "KinesteX vs PoseTracker"
      },
      {
        "href": "/motion/build-vs-buy-ai-motion-tracking",
        "label": "Build vs buy AI motion tracking"
      },
      {
        "href": "/apis/kinestex",
        "label": "KinesteX API profile"
      }
    ],
    "cta": {
      "pitch": "We track motion-tracking vendors from their own pages, registries and repos, with our conflict labeled; get our developer notes when a product line, price or regulatory claim changes."
    },
    "firstParty": true,
    "sources": [
      {
        "url": "https://www.exer.ai/",
        "checked": "2026-11-09",
        "note": "Clinical AI platform, three products, workflow list, HIPAA, FDA Class II claim, EHR APIs, demo request (snapshot)"
      },
      {
        "url": "https://www.exer.ai/product/scan",
        "checked": "2026-11-09",
        "note": "Exer Scan for clinicians, runs on tablets (snapshot)"
      },
      {
        "url": "https://www.exer.ai/product/health",
        "checked": "2026-11-09",
        "note": "Exer Health patient app from the app store, no cloud-stored videos (snapshot)"
      },
      {
        "url": "https://www.exer.ai/product/rtm",
        "checked": "2026-11-09",
        "note": "RTM billing codes and the medical-device requirement (snapshot)"
      },
      {
        "url": "https://www.exer.ai/tech",
        "checked": "2026-11-09",
        "note": "proprietary engine, runs on the edge (snapshot)"
      },
      {
        "url": "https://www.exer.ai/posts/exer-ai-clinical-validation-studies-presented-at-assh-and-cns-in-oct-2025",
        "checked": "2026-11-09",
        "note": "Duke tremor and ASSH hand/wrist validation summaries (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/",
        "checked": "2026-11-09",
        "note": "white-label SDK, 500+ exercises, 19 languages, assessments, not a diagnosis (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/workouts",
        "checked": "2026-11-09",
        "note": "500+ exercises (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/getting-started",
        "checked": "2026-11-09",
        "note": "SDK list, views, custom integration, requirements (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/installation",
        "checked": "2026-11-09",
        "note": "Kotlin 2.5.0, minSdk 28, Xcode 16.3 (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/ai-trainer-chat",
        "checked": "2026-11-09",
        "note": "AI Trainer Chat, Sunset labels (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/content-api-v2",
        "checked": "2026-11-09",
        "note": "Content API base URL data.kinestex.com (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-11-09",
        "note": "integration time, 19 languages, pricing model, 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/sdk-integration",
        "checked": "2026-11-09",
        "note": "three ways in and timelines, requirements, AI trainer needs internet (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-11-09",
        "note": "on-device camera processing statement (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/hipaa",
        "checked": "2026-11-09",
        "note": "HIPAA compliance and Google Cloud BAA (snapshot)"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-11-09",
        "note": "WebView architecture"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-11-09",
        "note": "optional edge processing wording, Apache-2.0"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-11-09",
        "note": "the 90% accuracy claim"
      },
      {
        "url": "https://github.com/orgs/KinesteX/repositories",
        "checked": "2026-11-09",
        "note": "repository update dates and licenses (snapshot)"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-11-09",
        "note": "1.5.0 published 2026-10-19, Apache-2.0"
      },
      {
        "url": "https://pub.dev/packages/kinestex_sdk_flutter",
        "checked": "2026-11-09",
        "note": "1.5.1 published 2026-07-04"
      },
      {
        "url": "https://kinestex-pitch.vercel.app/",
        "checked": "2026-11-09",
        "note": "public seed deck: $1.50 per MAU, $1,500 monthly minimum, 550+ exercises, 17 languages"
      }
    ]
  },
  {
    "slug": "kinestex-vs-posetracker",
    "primaryQuery": "kinestex vs posetracker",
    "h1": "KinesteX vs PoseTracker: Coaching Experience or MoveNet Blocks?",
    "metaTitle": "KinesteX vs PoseTracker: Coaching SDK or MoveNet Kit?",
    "metaDescription": "KinesteX vs PoseTracker: finished coaching SDK vs on-device MoveNet with per-call pricing, platforms and prices checked. KinesteX funds this site.",
    "updated": "2026-11-09",
    "answer": "PoseTracker, a service of Movelytics SAS, is a MoveNet building block: 17 on-device keypoints free without an API key, React Native and web npm packages plus a WebView or iframe API, and a paid exercise engine for reps, angles and a form score, metered per tracking call from €50 a month. KinesteX (this site's own product) ships finished white-label coaching experiences, content, assessments, an admin panel and 19 languages across Flutter, Swift, Kotlin, React Native and the web, and its seed deck states $1.50 per monthly active user with a $1,500 monthly minimum. KinesteX is our overall pick on what ships in the box and platform breadth, but the verdict flips to PoseTracker for a developer who wants raw keypoints or has a €50 budget, a React Native or web team that will own its UI, or a prototype that has to run today without a sales call.",
    "body": "**Disclosure: KinesteX funds this site, and this page is written by the company behind KinesteX, so read it as a first-party comparison.** KinesteX is this site's own product. Every claim about either company traces to its own public pages, docs, READMEs and package registries or, for KinesteX's price, its public seed deck, as read on November 9, 2026, and quoted passages are re-tested against the live pages by an automated check. [The automated checks that gate every deploy](/gates) also refuse any page that links to this site's funder without a disclosure beside it. PoseTracker publishes its own comparison that includes KinesteX; we quote it where it describes us, so you can weigh both views.\n\nThese two products sit at different heights of the same stack. PoseTracker gives you a pose model on the device and an exercise engine on top, and you build the coaching product. KinesteX gives you the coaching product, with screens, content and an AI trainer, and you configure it. Which one fits depends far more on how much your team wants to build than on any model detail.\n\n## What each one is, per its own pages\n\n**PoseTracker** is \"a service developed by Movelytics SAS\", per its [terms of use](https://www.posetracker.com/terms-of-use). Its [home page](https://www.posetracker.com/) states the core plainly: \"PoseTracker runs MoveNet on the phone, so the app gets keypoints, then reps, angles and a form score.\" It advertises \"17 COCO keypoints, on-device, no video upload\" and names Flexifit, Kobi, How2Jump and MoveBreak as production apps. There are three ways in: a developer SDK for React Native (Expo Go) and the web, the \"classic\" WebView or iframe API, and built-in tools such as a back flexibility test, a flexibility analysis tool and a pose comparison system. Its [SDK announcement](https://www.posetracker.com/news/posetracker-sdk-react-native-web) says the same MoveNet engine \"is also available as native npm packages\". On npm the current packages are @pose-tracker/react-native-pose-estimation, a -light variant and @pose-tracker/pose-estimation-web, all at 0.3.8, published October 16, 2026, under a proprietary Movelytics license.\n\nThe pricing model is the clearest on either side. Keypoints are free and need no key; the [quickstart](https://docs.posetracker.com/quickstart) says \"Keypoints are free. Pass apiToken only for the movement engine.\" The paid key unlocks the engine. The home page lists Freemium at €0 (up to 200 tracking API calls a month, \"Only non-commercial use\", with a \"Powered by PoseTracker\" link on the camera), Developer at €50 a month with 1,000 calls, and Business from €150 a month with 100k, 500k or 1M calls per 12-month period. Its [features and plans reference](https://docs.posetracker.com/reference/features-plans) defines the unit: \"One call = one open session, not one exercise.\" On paid plans the limit is soft: extra calls go through and are either covered by an upgrade or invoiced at €0.01 excluding VAT per call. With a key, \"internet is required to authenticate and meter\".\n\n**KinesteX** describes itself on its [home page](https://www.kinestex.com/) as \"A white-label SDK that coaches every rep through your users' own camera, inside your app.\" Its [Getting Started docs](https://www.kinestex.com/docs/getting-started) list SDKs for Swift, Kotlin, Flutter, React Native and React (TypeScript), plus a plain HTML/JavaScript iframe. The [SwiftUI kit README](https://github.com/KinesteX/KinesteX-AI-Kit) is explicit about the architecture: \"A SwiftUI package that embeds KinesteX's AI-powered camera workout experience as a WebView.\" The docs list ready-made views (AI Trainer Chat, recommended for new integrations, plus Plan, Workout, Challenge and Leaderboard views, three AI games and an Admin Workout Editor) and custom options: a Custom Workout, a Camera Component that streams reps, holds, form feedback and presence and, on request, pose landmarks, and REST Content APIs at data.kinestex.com. Complete UX (Main) and Personalized Plan View are marked \"Sunset\". Requirements are iOS 14.0+ (Xcode 16.3+) and Android 9+ (API 28). KinesteX's [FAQ](https://www.kinestex.com/product/faqs) lists 19 languages and says integration \"typically takes under a day\". kinestex.com publishes no price list; KinesteX's public seed deck prices per monthly active user (MAU) and states \"$1.50 per MAU. $1,500 monthly minimum.\"\n\n## Side by side\n\nChecked on November 9, 2026 against both companies' pages and docs, npm and pub.dev, and KinesteX's seed deck.\n\n| Dimension | PoseTracker | KinesteX |\n|---|---|---|\n| What it is | On-device MoveNet SDK plus a metered exercise engine | White-label coaching experience embedded via WebView or iframe, plus content APIs |\n| Company | Movelytics SAS | KinesteX |\n| Pose model | MoveNet, 17 COCO keypoints; BlazePose selectable on the light and web packages | Not named on the pages we read; pose landmarks available on request from the Camera Component |\n| Platforms | React Native (Expo Go) and web npm packages; WebView or iframe API; no first-party Flutter SDK | Swift, Kotlin, Flutter, React Native, React (TypeScript), HTML/JS iframe |\n| Free without a key | Keypoints | Nothing; an API key comes with demo access |\n| Paid features | Reps, angles, form score, recommendations | Bundled in the experience: reps, mistakes, calories, scores, assessments |\n| Published price | €0 Freemium (200 calls, non-commercial), €50 a month Developer (1,000 calls), Business from €150 a month | Seed deck: $1.50 per monthly active user, $1,500 monthly minimum; integration fees may apply |\n| Billing unit | Tracking call, one per open camera session | Monthly active user |\n| Above the quota | Free: strict, refused; paid: soft, €0.01 per extra call or an upgrade | Not stated |\n| UI and content | Built-in tools; your app builds the coaching screens | AI Trainer Chat, workouts, plans, challenges, leaderboards, games, admin panel, 500+ exercises (550+ in the deck) |\n| Languages | Not stated | 19 per the FAQ (17 on the deck's competition slide) |\n| Getting started | Self-serve signup; Business and managed plans by quote | Book a call or contact form |\n| License | Proprietary, Movelytics SAS | Apache-2.0 in the Kotlin, Swift and HTML-JS repos; commercial hosted service |\n| Recent releases | npm 0.3.8 on 2026-10-16; features doc modified November 2, 2026 | npm kinestex-sdk-react-native 1.5.0 on 2026-10-19; pub.dev 1.5.1 on 2026-07-04; three repos pushed November 5, 2026 |\n| Accuracy | No figure; its comparison page says no independent lab ranks these SDKs | \"97.2% accuracy\" claim in its FAQ |\n\n## Where PoseTracker wins\n\n**Free keypoints without a key.** Install a package, mount a view and 17 keypoints arrive on the device, with no account and no token. KinesteX has no free tier on its pages.\n\n**The cheapest published paid plan.** PoseTracker's Developer plan is €50 a month for 1,000 tracking calls with commercial use. KinesteX's only published figure has a $1,500 monthly minimum. For a small app or a side project, that gap decides it.\n\n**Self-serve today.** Freemium and Developer start from a \"Get started\" button, and its terms describe a \"self-serve Developer checkout\". KinesteX starts with a call or a contact form. PoseTracker's own comparison page puts it this way: \"KinesteX / Sency often sales-led.\"\n\n**npm packages for web and React Native, including offline.** The offline React Native package bundles MoveNet so inference needs no network; the web SDK runs in the browser over TensorFlow.js from a script tag, an ESM import or a React wrapper.\n\n**Your own camera and your own UI.** Besides its own camera view, the SDK can take external frames (\"startExercise() again while processFrame keeps running\"), so a team with an existing camera pipeline keeps it. Every screen is yours.\n\n**Public pricing with a soft limit.** Paid plans do not cut users off at the quota; the terms say \"PoseTracker does not cut the service when the included calls are reached\". That is a predictable rule, written down.\n\n## Where KinesteX wins\n\n**A complete experience and a content library.** KinesteX ships the screens: workouts, plans, challenges with leaderboards and games, run on a library its site counts at 500+ exercises, served through a content API. PoseTracker gives you reps and a form score and leaves the product to you. Its own comparison page describes the KinesteX approach as a \"Hosted camera / content embed\" and says it suits teams that want \"their workout UI more than you want to own the camera\".\n\n**An AI trainer and assessments.** AI Trainer Chat handles onboarding, a camera fitness assessment, a workout per session and next-session scheduling. KinesteX also documents standardized movement tests such as Timed Up and Go, gait speed, sit-to-stand, balance stands, functional reach and shoulder range of motion. PoseTracker offers flexibility and pose-comparison tools and, in its own words, \"is not a medical device\".\n\n**Flutter and native Swift and Kotlin packages.** PoseTracker lists \"Flutter-only (no first-party Flutter SDK)\" under when not to use it, and its native coverage comes through React Native. KinesteX publishes kinestex_sdk_flutter on pub.dev, a Swift package and a Kotlin SDK (2.5.0 in its install docs).\n\n**A white-label admin panel.** Colors, fonts, light or dark themes, workouts and usage statistics are managed in one panel, and the FAQ promises no KinesteX logos.\n\n**Languages.** The guided experience runs in 19 languages, with right-to-left support for Arabic, Hebrew and Urdu, per the FAQ.\n\n**No per-call metering.** KinesteX bills per monthly active user per its deck. PoseTracker counts every open camera session, which is simple to reason about but grows with how often each user trains.\n\n## Verdict\n\nKinesteX wins this comparison overall, and our verdict rests on four criteria, each tied to a sourced fact. First, what ships in the box: AI Trainer Chat, ready-made views, a content API, an admin panel, assessments and 19 languages, against an engine that returns reps, angles and a form score for screens you build; KinesteX's SDK integration page puts its ready-made route at \"1 week or less\" with one developer. Second, platform breadth: Swift, Kotlin, Flutter, React Native, React and an iframe, against React Native and web packages with no first-party Flutter SDK. Third, price, where PoseTracker is ahead at entry and we say so: €50 a month against a $1,500 monthly minimum, though KinesteX's figure buys the finished experience, not keypoints. Fourth, maintenance: both are active, with PoseTracker's packages at 0.3.8 on October 16, 2026 and KinesteX's React Native SDK at 1.5.0 on October 19, 2026 and three repos pushed on November 5, 2026.\n\nThe verdict flips to PoseTracker for a developer who wants raw keypoints or has a €50 budget, for a React Native or web-only team that will own its UI, or for a prototype that has to run today without a sales call.\n\n## What we could not verify\n\n- **Accuracy.** No independent benchmark compares the two. PoseTracker's comparison page says \"No independent lab ranks these SDKs on a shared accuracy set.\" KinesteX's 97.2% figure is its own claim, and an older README says \"consistently exceed 90% accuracy\".\n- **Cost at scale.** Tracking calls and monthly active users are different units, and neither side publishes how many sessions a typical user opens, so we do not convert one into the other.\n- **KinesteX's prices beyond the deck.** kinestex.com publishes no price list; the FAQ says integration fees may apply.\n- **PoseTracker's docs versions.** The quickstart's note for language models still names 0.3.0 and the SDK announcement's web snippet pins 0.2.0, while npm shows 0.3.8.\n- **KinesteX's on-device wording.** Its security page says \"All camera and vision processing stays on-device\"; its SDK READMEs say \"optional edge processing (no cloud transmission)\".\n- **KinesteX's own numbers.** 19 languages in the FAQ, 17 in the deck; 500+ exercises on the site, 550+ in the deck.\n\n## Which should you pick?\n\n- **You want keypoints, reps and a form score inside screens you design, on React Native or the web** → PoseTracker. Read [MoveNet models](/motion/movenet-models) to know what the 17 points give you.\n- **You need a finished, white-label coaching experience, an AI trainer or assessments, on any platform including Flutter** → KinesteX.\n- **You have €50, not $1,500, or need to ship this week without a call** → PoseTracker's Developer or Freemium plan.\n- **You are weighing other toolkits** → [KinesteX vs QuickPose](/compare/kinestex-vs-quickpose), [KinesteX vs MediaPipe](/compare/kinestex-vs-mediapipe) and [how to evaluate motion SDKs](/guides/evaluate-motion-sdks).\n\nRe-check both vendors' pages before you sign: PoseTracker's docs changed in November 2026 and KinesteX's repos the same month, and this page will age.\n",
    "faqs": [
      {
        "q": "Is PoseTracker free?",
        "a": "Partly. PoseTracker's keypoints are free and need no API key: its quickstart says \"Keypoints are free.\" The exercise engine, with reps, angles and a form score, is metered. The Freemium plan is €0 for up to 200 tracking calls a month, non-commercial only, with a \"Powered by PoseTracker\" link on the camera. Commercial use starts with the Developer plan at €50 a month, as listed on its home page on November 9, 2026."
      },
      {
        "q": "What is the difference between PoseTracker's tracking calls and KinesteX's monthly active users?",
        "a": "They count different things. PoseTracker counts a tracking call each time a camera session opens: \"One call = one open session, not one exercise.\" KinesteX's seed deck prices per monthly active user, $1.50 each with a $1,500 monthly minimum, so a user who trains every day counts once a month. Neither vendor publishes sessions per user, so test your own usage before comparing bills."
      },
      {
        "q": "Does PoseTracker support Flutter?",
        "a": "Not with a first-party package. PoseTracker's own comparison page lists \"Flutter-only (no first-party Flutter SDK)\" under when not to use it. Its packages target React Native (including Expo Go) and the web, and its WebView or iframe API can be embedded in any app that shows a web view. KinesteX publishes a Flutter package, kinestex_sdk_flutter, at 1.5.1 on pub.dev as of July 4, 2026."
      },
      {
        "q": "Does PoseTracker use MediaPipe or MoveNet?",
        "a": "MoveNet by default. PoseTracker's home page says it \"runs MoveNet on the phone\" and returns 17 COCO keypoints. Its features reference adds that BlazePose can be selected with options.model on the light and web packages, and its npm README says native MediaPipe is not in the SDK. If you need 33 landmarks or 3D, PoseTracker's own pages point to MediaPipe."
      },
      {
        "q": "Can I buy PoseTracker's Developer plan without a quote?",
        "a": "Yes, per its pages on November 9, 2026. Freemium and Developer start from a \"Get started\" button, and its terms describe a \"self-serve Developer checkout\". Business plans and managed plans go through a quote or email agreed with Movelytics SAS. KinesteX has no self-serve checkout: you book a call or fill out a contact form for demo access and an API key."
      }
    ],
    "related": [
      {
        "href": "/compare/kinestex-vs-quickpose",
        "label": "KinesteX vs QuickPose"
      },
      {
        "href": "/compare/kinestex-vs-mediapipe",
        "label": "KinesteX vs MediaPipe"
      },
      {
        "href": "/motion/movenet-models",
        "label": "MoveNet models"
      },
      {
        "href": "/compare/kinestex-vs-exer-ai",
        "label": "KinesteX vs Exer AI"
      },
      {
        "href": "/alternatives/kinestex-alternatives",
        "label": "KinesteX alternatives, the vendor's own list"
      },
      {
        "href": "/guides/evaluate-motion-sdks",
        "label": "How to evaluate motion SDKs"
      }
    ],
    "cta": {
      "pitch": "Both of these vendors changed their docs or repos in November 2026; get our developer notes when platforms, plans or metering rules actually change."
    },
    "firstParty": true,
    "sources": [
      {
        "url": "https://www.posetracker.com/",
        "checked": "2026-11-09",
        "note": "MoveNet on-device, 17 keypoints, three integration paths, prices and plan limits, production apps (snapshot)"
      },
      {
        "url": "https://docs.posetracker.com/quickstart",
        "checked": "2026-11-09",
        "note": "free keypoints without a key, RN packages run MoveNet in a WebView (snapshot)"
      },
      {
        "url": "https://docs.posetracker.com/reference/features-plans",
        "checked": "2026-11-09",
        "note": "one call per open session, quotas, soft limit, external frames, BlazePose option, watermark (snapshot)"
      },
      {
        "url": "https://www.posetracker.com/compare/pose-estimation-sdks",
        "checked": "2026-11-09",
        "note": "PoseTracker's comparison: KinesteX-style hosted embed, sales-led, no first-party Flutter SDK (snapshot)"
      },
      {
        "url": "https://www.posetracker.com/news/posetracker-sdk-react-native-web",
        "checked": "2026-11-09",
        "note": "native npm packages alongside the WebView/iframe API (snapshot)"
      },
      {
        "url": "https://www.posetracker.com/terms-of-use",
        "checked": "2026-11-09",
        "note": "Movelytics SAS, plan terms, self-serve checkout, extra calls (snapshot)"
      },
      {
        "url": "https://www.npmjs.com/package/@pose-tracker/react-native-pose-estimation",
        "checked": "2026-11-09",
        "note": "0.3.8 published 2026-10-16, proprietary license, native MediaPipe not in the SDK"
      },
      {
        "url": "https://www.npmjs.com/package/@pose-tracker/pose-estimation-web",
        "checked": "2026-11-09",
        "note": "0.3.8 published 2026-10-16"
      },
      {
        "url": "https://www.kinestex.com/",
        "checked": "2026-11-09",
        "note": "white-label SDK (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/getting-started",
        "checked": "2026-11-09",
        "note": "SDK list, views, Camera Component, requirements (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/installation",
        "checked": "2026-11-09",
        "note": "Kotlin 2.5.0, Flutter package, React TS package (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/workouts",
        "checked": "2026-11-09",
        "note": "500+ exercises (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-11-09",
        "note": "19 languages, white-label, pricing model, 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/sdk-integration",
        "checked": "2026-11-09",
        "note": "ready-made route timeline, API key on booking a call (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-11-09",
        "note": "on-device camera processing statement (snapshot)"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-11-09",
        "note": "WebView architecture"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-ReactNative",
        "checked": "2026-11-09",
        "note": "optional edge processing wording"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-11-09",
        "note": "the 90% accuracy claim"
      },
      {
        "url": "https://github.com/orgs/KinesteX/repositories",
        "checked": "2026-11-09",
        "note": "repository update dates and licenses (snapshot)"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-11-09",
        "note": "1.5.0 published 2026-10-19, Apache-2.0"
      },
      {
        "url": "https://pub.dev/packages/kinestex_sdk_flutter",
        "checked": "2026-11-09",
        "note": "1.5.1 published 2026-07-04"
      },
      {
        "url": "https://kinestex-pitch.vercel.app/",
        "checked": "2026-11-09",
        "note": "public seed deck: $1.50 per MAU, $1,500 monthly minimum, 550+ exercises, 17 languages"
      }
    ]
  },
  {
    "slug": "your-move-vs-exercisedb",
    "primaryQuery": "your move vs exercisedb",
    "h1": "Your Move vs ExerciseDB: Filmed HD Video or the Bigger Free Catalog?",
    "metaTitle": "Your Move vs ExerciseDB (2026): Exercise Video APIs",
    "metaDescription": "Your Move vs ExerciseDB (AscendAPI): HLS and MP4 video vs GIFs and MP4, free tiers, the $19 to $299 price list, exercise caps, licenses and field mapping.",
    "updated": "2026-11-11",
    "answer": "Pick Your Move (ymove.app) when your app needs filmed HD video with HLS streaming, a published price list from $19 a month with a 7-day trial, and workouts and programs generated on the same key. Pick ExerciseDB, now sold by AscendAPI, when you want to start free, since V1 serves 1,500 exercises with GIFs and no key and V2's free Basic plan includes video, or when you need the larger catalog, 11,000+ exercises by AscendAPI's figure. Both were read on November 11, 2026.",
    "body": "Your Move (ymove.app) sells an exercise API from Your Move B.V., a Dutch company that also makes a white-label fitness app builder. Its pitch is filmed video: its README promises \"2,005+ exercises and 2,600+ HD videos\", \"filmed with trainers and physiotherapists\", with \"No AI-generated clips, no GIFs\". ExerciseDB is the best-known name in exercise APIs, and the company that sells it now trades as AscendAPI. Everything below was read on November 11, 2026 from each vendor's own docs, pricing pages and repositories, and every count is the vendor's own figure; we did not count either catalog.\n\nThe short version: ExerciseDB is the bigger and cheaper way in, with two free tiers, and Your Move is the one with a published price list, HLS streaming and workout generation on the same key. The full Your Move walkthrough is in [how to integrate the Your Move Exercise API](/integrate/your-move-exercise-api), its directory entry is [Your Move](/apis/your-move), and the ExerciseDB walkthrough is [how to integrate ExerciseDB](/integrate/exercisedb-api).\n\n## First, which ExerciseDB?\n\nThe exercisedb.dev home page now reads \"Previously ExerciseDB\" above the name AscendAPI. AscendAPI's docs describe two exercise products under the ExerciseDB name, and they behave very differently:\n\n- **ExerciseDB V1, free.** The V1 overview offers \"1,500 exercises with 180p GIFs. No authentication required\", called at `oss.exercisedb.dev`. The live endpoint answered on November 11 with `\"total\":1500` and a `gifUrl` per exercise.\n- **ExerciseDB V1, paid.** The same overview calls V1 \"over 2,000 structured exercises\" in total, with a paid tier on RapidAPI that adds difficulty, exercise types, an overview text and images and GIFs at 360p to 1080p.\n- **ExerciseDB V2.** On RapidAPI only, free and paid. AscendAPI's V2 overview says it holds \"11,000+ exercises, 15,000+ videos, and 20,000+ images\", and \"Each exercise includes an MP4 demonstration video for in-app playback.\"\n\nThere is also a public GitHub repository, ExerciseDB/exercisedb-api, under an AGPL-3.0 license with 761 stars, which describes the API and links to its plans. The AGPL covers that repository; nothing on the pages we read says it licenses the API's data. On this page \"ExerciseDB\" means V1 and V2 as AscendAPI documents them.\n\n## Your Move vs ExerciseDB at a glance\n\n| | Your Move (ymove.app) | ExerciseDB (AscendAPI) |\n| --- | --- | --- |\n| What you get | Exercises with video, plus workout and program generation, form analysis, nutrition and recipes on one key | V1: exercises with GIFs and images; V2: exercises with MP4 video and images |\n| Catalog, vendor's figure | 2,005+ (README, OpenAPI) or 2,200+ (product page) exercises; 2,600+ HD videos | V1: 1,500 free, \"over 2,000\" in total; V2: 11,000+ exercises, 15,000+ videos |\n| Media | HD video as HLS and MP4, mostly portrait; static thumbnails in five framings | V1 free: one 180p GIF; V1 paid: images and GIFs at four sizes; V2: one MP4 and images at four sizes |\n| Free entry point | No permanent free tier: a 7-day trial capped at 100 exercises with video | V1 free, no key; V2 Basic plan, 2,000 requests a month and 200 exercises |\n| Price | Starter $19, Pro $29, Scale $79, Enterprise $299 a month | Paid prices sit on RapidAPI listings we did not read |\n| License and terms | API Terms with a Brand License per registered brand; videos licensed only while subscribed | Commercial terms not stated on the pages we read |\n| Hosting | Streamed from Your Move's CDN; self-hosting is a separate license | Hosted by AscendAPI; no data download on the pages we read |\n| Caps and limits | Video minutes a month, plus 250 or 350 distinct exercises with video per 30 days on monthly Starter and Pro | Free: 1,000 requests an hour; paid: \"no strict rate limit\" |\n| SDK and docs | One docs page, an OpenAPI document, MIT TypeScript SDK and MCP server | Mintlify docs, OpenAPI specs for V1 and V2 listed in its llms.txt |\n| Auth | `X-API-Key` header or `?api_key=` | None for V1 free; `X-RapidAPI-Key` for the rest |\n\nEvery plan's price is in [exercise database API pricing](/pricing/exercise-database-api-pricing).\n\n## Where Your Move pulls ahead\n\n**Streaming video, not a single file.** Your Move's README says every exercise ships with \"an HD video (HLS + MP4)\", and its OpenAPI schema carries both a `videoUrl` and a `videoHlsUrl`, a \"Pre-signed CDN URL for HLS playlist\". ExerciseDB V2 has video too, one MP4 per exercise per its overview, so this is a smaller gap than Your Move's own comparison page suggests (more on that below). What AscendAPI's pages do not mention is an HLS stream. The product page says Your Move clips are filmed with male and female models on a white studio background.\n\n**A price list you can read.** Your Move's pricing page lists Starter at $19 a month with watermarked video, Pro at $29 with clean video, Scale at $79 with an on-device offline cache and three brand licenses, and Enterprise at $299 with ten. \"Every paid plan starts with a 7-day free trial.\" AscendAPI's docs point to RapidAPI for paid plans, and our read of its pages found no paid prices.\n\n**More on the same key.** Your Move's docs list `/workouts/generate` and `/programs/generate` beside the exercise endpoints, plus `POST /posture/analyze` for AI form analysis from a video (beta, up to 100MB), and food, recipe and meal-plan endpoints. AscendAPI's docs pair ExerciseDB with a separate Muscle Visualizer; Your Move draws the muscles worked at `/exercises/{id}/body-map`, as an SVG.\n\n**Thumbnails you may keep.** Every Your Move exercise and video carries a `thumbnails` object with \"five framings of the same frame\": default 3:4 up to 600x800, square, portrait 9:16, landscape 16:9 and the original. The docs say thumbnail URLs \"are static, carry no token, and are safe to cache or store\". ExerciseDB V2 serves four image sizes, 360p to 1080p, but the pages we read do not say whether you may store them.\n\n**Tooling.** Your Move publishes an OpenAPI document, an MIT-licensed TypeScript SDK (`ymove-exercise-api`) and an MIT-licensed MCP server (`ymove-exercise-mcp`) with tools such as `search_exercises` and `generate_workout`. AscendAPI's llms.txt lists OpenAPI specs for both ExerciseDB versions but no SDK.\n\n## Where ExerciseDB pulls ahead\n\n**It is free to start, twice.** This is the biggest gap. ExerciseDB V1 serves 1,500 exercises with no sign-up and no key. V2's Basic plan, per AscendAPI's quickstart, costs nothing: \"2,000 requests / month\", \"200 exercises in library\", images and videos, \"No credit card required\". Your Move has no permanent free tier: the 7-day trial reaches 100 distinct exercises with video and turns into a paid plan unless you cancel.\n\n**A much larger stated catalog.** AscendAPI states 11,000+ exercises and 15,000+ videos for V2. Your Move states 2,005+ or 2,200+ exercises depending on the page, and 2,600+ videos.\n\n**No per-exercise cap.** On monthly Starter and Pro, Your Move caps how many different exercises you can pull with video in a rolling 30 days, 250 and 350, and over the cap it strips the video fields from new exercises. AscendAPI's rate-limit guide gives free plans \"1,000 requests per hour per API key\" and says \"Paid plans have no strict rate limit\", with media served through its CDN and \"generally unlimited\". Beyond the free V2 plan's 200-exercise library, its pages state no cap on distinct exercises.\n\n**Richer text per exercise on V2.** A V2 record carries `overview`, `exerciseTips`, `variations`, `keywords` and `relatedExerciseIds`, and its `targetMuscles` name muscles down to the head, such as \"PECTORALIS MAJOR STERNAL HEAD\". Your Move's `muscleGroups` is comparably detailed (its docs say about nine muscles per exercise across 83 distinct muscles) but it has no variations or related-exercise field in its schema.\n\n## The catches on each side\n\n**Your Move.**\n\n- Video URLs are pre-signed and \"will stop working after 48 hours\". The docs say never store them, fetch fresh data before playing, and \"Always call the YMove API from your backend and proxy the video URLs to your frontend.\" Plan a backend and a re-fetch path.\n- Keys created on or after July 7, 2026 default to `includeVideos=false` on `/exercises` and the generators, per the v2.5.0 changelog, so a first list call returns no video until you ask for it.\n- The counts disagree: 2,005+ in the README and OpenAPI, 2,200+ on the product page; 15 muscle groups everywhere, but \"31 equipment types\" in one product FAQ and 37 elsewhere. The schema also has a `hasVideo` flag and filter, so check video coverage for the exercises you need.\n- The watermark line differs between pages. The pricing page says Starter is watermarked and \"Pro and above\" clean; the docs say \"Trial and Starter plans receive watermarked videos. Pro and Enterprise plans receive clean, unwatermarked videos.\"\n- The OpenAPI document reports version 2.5.0 while the docs page header and changelog are at 2.8.0, dated October 30, 2026. The main repository showed 3 stars on November 11, a small open-source footprint.\n\n**ExerciseDB.**\n\n- Free V2 media is watermarked; AscendAPI says paid plans serve \"clean, watermark-free assets\".\n- Several schema fields are marked \"Next Update\" or \"Coming Soon\": muscle activation images on both versions, and on V2 `difficultyLevel`, `caloriesBurned` and `movementType`. V2 has no difficulty field yet, which Your Move has.\n- The rate-limit guide says that on paid plans \"response times may be gradually increased\" for a key whose usage its AI system flags as unusual. That is a soft limit you cannot see in advance.\n- We could not read AscendAPI's paid prices or its terms of use, so we cannot say what commercial use or storage is allowed.\n\n## Which should you pick?\n\n- **You want to prototype for free, today** → ExerciseDB: V1 needs no key, and V2 Basic is free with video.\n- **You need the largest stated catalog** → ExerciseDB V2, at 11,000+ by AscendAPI's figure.\n- **You want filmed video with HLS, a price you can budget, and workouts or programs generated on the same key** → Your Move, starting with the 7-day trial and its 25 free sample clips.\n- **You will serve many distinct exercises a month on a small budget** → price Your Move's yearly plans or Scale, which have no exercise cap, against ExerciseDB V2's paid plans on RapidAPI.\n- **You want to own the data outright** → neither; see [Your Move vs free-exercise-db](/compare/your-move-vs-free-exercise-db) and [Your Move vs wger](/compare/your-move-vs-wger).\n\nThe wider field is in [exercise database APIs compared](/fitness-apis/exercise-database-apis), [exercise APIs with video](/fitness-apis/exercise-video-apis) and [ExerciseDB alternatives](/alternatives/exercisedb-alternatives).\n\n## Moving between them\n\nBoth return JSON exercise records over REST, so a move is mostly renaming fields. Names are from AscendAPI's schema tables and Your Move's OpenAPI `Exercise` schema.\n\n| Your Move | ExerciseDB V1 | ExerciseDB V2 | Notes |\n| --- | --- | --- | --- |\n| `id` (UUID), `slug` | `exerciseId` | `exerciseId` | Your Move's `/exercises/{id}` takes either ID or slug |\n| `title` | `name` | `name` | |\n| `muscleGroup` | `bodyParts`, `targetMuscles` | `bodyParts`, `targetMuscles` | One of 15 coarse groups in Your Move |\n| `muscleGroups`, `secondaryMuscles` | `secondaryMuscles` | `secondaryMuscles` | Your Move's `muscleGroups` lists every muscle worked |\n| `equipment` (string) | `equipments` (array) | `equipments` (array) | V2 values are upper case, such as `BARBELL` |\n| `instructions` | `instructions` | `instructions` | V1 steps start with \"Step:1\" |\n| `description`, `importantPoints` | `overview` (paid) | `overview`, `exerciseTips` | |\n| `difficulty` | `difficulty` (paid) | not yet | Your Move: beginner, intermediate, advanced |\n| `exerciseType` (array) | `exerciseTypes` (paid) | `exerciseType` (string) | |\n| `videoUrl`, `videoHlsUrl` | `gifUrl`, `gifUrls` | `videoUrl` | Your Move's expire after 48 hours |\n| `thumbnails`, `thumbnailUrl` | `imageUrls` (paid) | `imageUrl`, `imageUrls` | |\n\nTwo things change in your code when you move to Your Move: video URLs must be refetched rather than stored, and you add `includeVideos=true` (or call `/exercises/{id}`) where you want video. Pagination is `page` and `pageSize` up to 50; AscendAPI's endpoints use cursor-based pagination.\n\n## Watch the fine print\n\n**Your Move's commercial terms run through a brand license.** Its API Terms say \"Every API subscription includes a Brand License that limits API content use to the Brands you register\", and \"Each Brand covers one website and one mobile application under the same brand name.\" The general terms below them, \"Last updated August 07, 2025\", grant content \"for your personal, non-commercial use or internal business purpose only\", which the API Terms supplement. Videos are licensed \"only while your subscription is active\", and cached or downloaded files must be deleted when it ends. Self-hosting is \"a separate self-hosting license\"; you \"cannot redistribute, sub-license, or resell the video content\"; and training or motion-tracking models on the videos \"needs a separate data license\". Get the Brand License document, which the terms say is \"issued via email at sign-up\", before you ship. This is not legal advice.\n\n**Your Move's trial wording conflicts.** The signup page and API Terms say a 7-day trial that converts to the paid plan unless canceled; the docs' `POST /upgrade` section says \"Subscriptions start immediately (no trial period)\" for upgrades started through the API.\n\n**Your Move's own comparison is out of date on video.** Its compare page says \"ExerciseDB serves animated GIFs, not video\", and that ExerciseDB's free tier \"stays GIF-only\". AscendAPI's V2 overview documents an MP4 per exercise, and its quickstart lists images and videos on the free Basic plan. Read the vendor's page as its framing.\n\n**ExerciseDB's terms are elsewhere.** Its README links a terms-of-use page we did not read, and its paid plans are priced on RapidAPI. Read both before launch, including whether you may keep copies of media.",
    "faqs": [
      {
        "q": "Can I move from ExerciseDB to Your Move?",
        "a": "Yes, and most of the work is renaming fields: ExerciseDB's exerciseId becomes Your Move's id or slug, name becomes title, the equipments array becomes a single equipment string, targetMuscles and bodyParts map to muscleGroup and muscleGroups, and gifUrl or videoUrl map to videoUrl and videoHlsUrl. Two things change in your code: Your Move video URLs expire after 48 hours, so fetch them fresh through your backend, and keys created on or after July 7, 2026 need includeVideos=true on /exercises to get video at all."
      },
      {
        "q": "Does ExerciseDB have real video, or only the GIFs Your Move describes?",
        "a": "Both, depending on the version. AscendAPI's V2 overview says each exercise includes an MP4 demonstration video, while V1 serves GIFs, a 180p GIF free and 360p to 1080p on its paid tier. Your Move's comparison page says ExerciseDB serves animated GIFs, not video, which does not match AscendAPI's V2 docs as we read them on November 11, 2026. What Your Move adds is an HLS stream beside the MP4."
      },
      {
        "q": "Which has more exercises, Your Move or ExerciseDB?",
        "a": "ExerciseDB, by the vendors' own figures. AscendAPI states 11,000+ exercises and 15,000+ videos for V2, and 1,500 free and over 2,000 in total for V1. Your Move states 2,005+ exercises in its README and OpenAPI description and 2,200+ on its product page, with 2,600+ HD videos. We did not count either catalog."
      },
      {
        "q": "Is Your Move or ExerciseDB cheaper to start with?",
        "a": "ExerciseDB: its V1 tier is free with no key, and AscendAPI's quickstart describes a free V2 Basic plan with 2,000 requests a month, 200 exercises and video, with no credit card. Your Move has no permanent free tier; plans run from $19 a month (watermarked) and $29 (clean) to $299, each with a 7-day trial. ExerciseDB's paid prices sit on RapidAPI listings we did not read, so compare the paid plans yourself."
      },
      {
        "q": "Do Your Move and ExerciseDB watermark their videos?",
        "a": "Both do on their cheapest option. AscendAPI says ExerciseDB V2 free-tier media is watermarked and paid tiers are clean. Your Move's pricing page says Starter videos carry a small watermark and Pro and above are clean; its docs say Trial and Starter are watermarked and Pro and Enterprise clean, without naming Scale."
      },
      {
        "q": "Can I keep copies of Your Move or ExerciseDB media on my own servers?",
        "a": "For Your Move, only the thumbnails: its docs say thumbnail URLs are static and safe to cache or store, while video URLs must never be stored. Scale and Enterprise allow an on-device cache for offline workouts, running the files on your own servers needs a separate self-hosting license, and cached video files must be deleted when the subscription ends. AscendAPI's pages that we read do not state whether ExerciseDB media may be stored."
      }
    ],
    "related": [
      {
        "href": "/integrate/exercisedb-api",
        "label": "How to integrate ExerciseDB"
      },
      {
        "href": "/alternatives/exercisedb-alternatives",
        "label": "ExerciseDB alternatives"
      },
      {
        "href": "/compare/exercisedb-vs-api-ninjas",
        "label": "ExerciseDB vs API Ninjas"
      },
      {
        "href": "/integrate/your-move-exercise-api",
        "label": "How to integrate the Your Move Exercise API"
      },
      {
        "href": "/apis/your-move",
        "label": "Your Move"
      },
      {
        "href": "/pricing/exercise-database-api-pricing",
        "label": "Exercise database API pricing"
      },
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/fitness-apis/exercise-video-apis",
        "label": "Exercise APIs with video"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Exercise API plans, caps and watermarks change often. Subscribe and we will flag it when Your Move or ExerciseDB changes what you get."
    },
    "sources": [
      {
        "url": "https://raw.githubusercontent.com/ymove-app/exercise-api/main/README.md",
        "checked": "2026-11-11",
        "note": "Your Move README: 2,005+ exercises, 2,600+ videos, HLS and MP4, 37 equipment types"
      },
      {
        "url": "https://ymove.app/exercise-api",
        "checked": "2026-11-11",
        "note": "Your Move product page: 2,200+ exercises, 31 equipment types in its FAQ"
      },
      {
        "url": "https://exercise-api.ymove.app/api/v2/openapi.json",
        "checked": "2026-11-11",
        "note": "Your Move OpenAPI 2.5.0: Exercise schema, parameters, 429 response"
      },
      {
        "url": "https://ymove.app/exercise-api/docs",
        "checked": "2026-11-11",
        "note": "Your Move docs v2.8.0: auth, 48-hour video URLs, thumbnails, exercise caps, watermark, upgrade, changelog"
      },
      {
        "url": "https://ymove.app/exercise-api/pricing",
        "checked": "2026-11-11",
        "note": "Your Move plans, minutes, exercise cap FAQ, watermark, self-hosting, resale, data license"
      },
      {
        "url": "https://ymove.app/terms-and-conditions",
        "checked": "2026-11-11",
        "note": "Your Move API Terms (Brand License, active subscription, trial, limits) and general terms"
      },
      {
        "url": "https://github.com/ymove-app/exercise-api",
        "checked": "2026-11-11",
        "note": "Your Move repository, 3 stars"
      },
      {
        "url": "https://ymove.app/exercise-api/top-exercise-apis",
        "checked": "2026-11-11",
        "note": "Your Move's own roundup, used for plan prices quoted with their features"
      },
      {
        "url": "https://exercisedb.dev/",
        "checked": "2026-11-11",
        "note": "AscendAPI, previously ExerciseDB; free V1"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v1/overview",
        "checked": "2026-11-11",
        "note": "V1 free and paid tiers, GIFs, schema"
      },
      {
        "url": "https://oss.exercisedb.dev/api/v1/exercises",
        "checked": "2026-11-11",
        "note": "Live V1 endpoint, total 1,500"
      },
      {
        "url": "https://docs.ascendapi.com/products/edb-v2/overview",
        "checked": "2026-11-11",
        "note": "V2 catalog figures, MP4 video, watermark, schema"
      },
      {
        "url": "https://docs.ascendapi.com/quickstart/overview",
        "checked": "2026-11-11",
        "note": "Free V2 Basic plan on RapidAPI"
      },
      {
        "url": "https://docs.ascendapi.com/guides/ratelimiting",
        "checked": "2026-11-11",
        "note": "Free and paid rate limits, media calls"
      },
      {
        "url": "https://github.com/ExerciseDB/exercisedb-api",
        "checked": "2026-11-11",
        "note": "ExerciseDB repository, AGPL-3.0, 761 stars"
      },
      {
        "url": "https://ymove.app/exercise-api/compare",
        "checked": "2026-11-11",
        "note": "Your Move's own ExerciseDB comparison, cited as vendor framing"
      }
    ]
  },
  {
    "slug": "your-move-vs-wger",
    "primaryQuery": "your move vs wger",
    "h1": "Your Move vs wger: Rent Filmed Video or Self-Host Open Data?",
    "metaTitle": "Your Move vs wger: Paid Video API or Free Self-Host?",
    "metaDescription": "Your Move streams filmed HD exercise video from $19/mo after a 7-day trial. wger is a free AGPL workout manager you self-host, with a REST API.",
    "updated": "2026-11-11",
    "answer": "Pick Your Move when you want filmed HD exercise video, as MP4 and HLS, from a hosted API and can pay from $19 a month after a 7-day trial, under a brand license rather than an open one. Pick wger when you want software and data you run yourself with no license fee: its README describes a free workout manager under AGPL-3.0-or-later with a REST API, self-hosted with Docker, and exercise data under Creative Commons set per entry. Both were read on November 11, 2026.",
    "body": "Your Move (ymove.app) is Your Move B.V., registered in the Netherlands at an Amsterdam address, that started as a white-label fitness app builder and now sells an Exercise API: a hosted library of filmed exercise videos with workout and program generation on the same key. wger is the opposite kind of project. Its README calls it \"a free workout and fitness manager\": open-source software you deploy yourself, with a REST API among its features. Everything below was read on November 11, 2026, from Your Move's product, pricing, documentation and terms pages, its OpenAPI document and GitHub repositories, and from wger's README, LICENSE.txt and GitHub repository page.\n\nOne gap first. wger's API documentation page at wger.readthedocs.io/en/latest/api.html answered 404 when we requested it that day, so this page names no wger endpoint, authentication scheme or field. wger's facts here come from its README and repository page only. For its API, read the documentation of the wger version you deploy.\n\nFor the setup side of each, see [how to integrate the Your Move Exercise API](/integrate/your-move-exercise-api), [the Your Move directory entry](/apis/your-move) and [wger alternatives](/alternatives/wger-alternatives); [ExerciseDB vs wger](/compare/exercisedb-vs-wger) compares wger with the other hosted option.\n\n## Your Move vs wger at a glance\n\n| | Your Move Exercise API | wger |\n|---|---|---|\n| What you get | A hosted exercise API: 2,005+ exercises per its README, 2,200+ per its product page, 2,600+ HD videos; workouts, programs, form analysis, nutrition and recipes on the same key | A whole workout manager: routines with weight progression, diet and body-weight tracking, a food database from Open Food Facts, progress photos, an exercise wiki, basic gym management, and a REST API |\n| Media | Filmed HD video as MP4 and HLS, mostly portrait; static thumbnails in five framings; a body-map SVG per exercise | Not described in the README or repository page we read |\n| Free entry point | A 7-day free trial on every paid plan, plus 25 free sample clips; no permanent free tier | The software is free; a live system runs at wger.de |\n| Price | Starter $19 a month (watermarked), Pro $29, Scale $79, Enterprise $299 | No license fee; you pay for hosting and operations |\n| License and terms | A Brand License per registered brand (one website and one mobile app); videos licensed only while you subscribe; no resale | Code AGPL-3.0-or-later; exercise and ingredient data Creative Commons, set per entry; documentation CC-BY-SA-4.0 |\n| Hosting | Your Move's API and Bunny CDN; self-hosting is a separate license; on-device offline cache on Scale and Enterprise | Self-host with Docker, or use wger.de |\n| Caps and limits | Video minutes per month (10,000 to 100,000); monthly Starter and Pro plans cap distinct exercises with video at 250 and 350 per rolling 30 days | Whatever you configure on your own instance; wger.de's limits not read |\n| SDK and docs | One documentation page, an OpenAPI document, an MIT TypeScript SDK and MCP server | Documentation at wger.readthedocs.io (API page unreadable on November 11, 2026); apps on Android, iOS, F-Droid and Flathub |\n\nThe full price list for the category is in [exercise database API pricing](/pricing/exercise-database-api-pricing).\n\n## Where Your Move pulls ahead\n\n**Filmed video on the exercise record.** Your Move's README says every exercise \"ships with an HD video (HLS + MP4)\", filmed with trainers and physiotherapists, \"No AI-generated clips, no GIFs\". The product page names Movement Based Therapy, a sports physiotherapy practice, and the gym Elite Fitness among the people it films with, and shows male and female models on a white studio background; it also says a few gym-machine exercises exist only with a gym background for now. The Exercise schema carries a `hasVideo` boolean and the docs' own code example filters on `hasVideo=true`, so check that flag rather than assume every row plays. wger's README and repository page, as we read them, say nothing about its media; Your Move's own ranking page describes wger's demonstrations as \"Images, a few user videos\", a competitor's figure we could not check against wger.\n\n**Media you can lay out without editing.** Every exercise and video carries a `thumbnails` object with five framings of one frame (default 3:4, square, portrait 9:16, landscape 16:9 and the original), static and safe to cache, and `GET /exercises/{id}/body-map` returns the muscles worked as an SVG. The docs say `muscleGroups` lists \"about nine muscles per exercise across 83 distinct muscles\", against one coarse `muscleGroup` from 15 used for filtering.\n\n**Nothing to operate.** Your Move is a base URL (`https://exercise-api.ymove.app/api/v2`) and an `X-API-Key` header; the pricing FAQ says videos come through Bunny CDN. With wger you run a Django application, its database and its uploads.\n\n**Generated sessions on the same key.** `GET /workouts/generate` builds a structured workout, with a `structure` parameter for supersets, circuits or an automatic choice, and `GET /programs/generate` a multi-week program. wger has routines with \"automatic weight progression rules\", but as an app feature a user builds, not, as far as the README says, a generator your backend calls.\n\n**Developer tooling.** A published OpenAPI document, an MIT TypeScript SDK (`ymove-exercise-api`) and an MIT MCP server (`ymove-exercise-mcp`), plus a price list with a 7-day trial on every paid plan and 25 free sample clips.\n\n## Where wger pulls ahead\n\n**It costs nothing to license, and Your Move has no free tier.** wger's README says \"100% Free & Open Source\", licensed AGPL-3.0 or later. Your Move's pricing page opens with \"Start free, scale as you grow\", but the free part is a 7-day trial that converts to a paid plan unless canceled; the docs cap a trial at 100 distinct exercises with video.\n\n**You own the stack and the data.** Self-hosting \"is basically just a `docker compose up -d` away\", per the README, and nothing stops working if you stop paying anyone. Your Move's API Terms say \"Videos are licensed to you only while your subscription is active\", and that you must delete cached or downloaded video files when it ends. Every Your Move plan lists \"No self-hosting (separate license)\".\n\n**Licenses you can read in advance.** wger states three: AGPL-3.0-or-later for code, \"Creative Commons (see individual entries)\" for exercise and ingredient data, and CC-BY-SA-4.0 for documentation. Your Move's arrangement takes more reading: API Terms that \"supplement the general Terms and Conditions\", general terms last updated August 07, 2025 that grant content \"for your personal, non-commercial use or internal business purpose only\", and a Brand License, issued by email at sign-up, that permits use for the brands you register.\n\n**More than an exercise list.** wger is a complete app: diet plans and calorie logging, body weight and measurements, a progress gallery, multi-user support, community translation through Weblate, and released apps on four stores. If you need a tracker, not just content, wger already is one.\n\n**No caps you did not set.** Your Move's monthly Starter and Pro plans cap distinct exercises pulled with video per rolling 30 days, at 250 and 350; past the cap the API removes the video fields from exercises you have not accessed and adds a `_warning`. A wger instance answers as far as your hardware does.\n\n**A much larger open-source footprint.** wger's repository showed 7.3k stars, 1.1k forks and 9,835 commits. Your Move's exercise-api repository showed 3 stars and 6 commits, its SDK repository 0 stars and its MCP repository 1.\n\n## The AGPL copyleft question\n\nThis is about wger's code, not its data. Section 13 of the GNU Affero General Public License in wger's LICENSE.txt says that if you modify the program, \"your modified version must prominently offer all users interacting with it remotely through a computer network\" a way to receive its source.\n\n- **Running wger unmodified**, and calling its REST API from your own app, is a different situation from changing wger's code and serving it to users.\n- **Modifying wger and serving it** to users over a network is what brings the source-offer obligation into play.\n- **The data is licensed separately**, per entry under Creative Commons, so attribution (and, for share-alike entries, share-alike) follows the exercises wherever you take them.\n\nYour Move has no copyleft at all. Its constraints are contractual: content limited to the brands you register, an active subscription, no resale or sub-licensing of the videos, no product \"whose primary purpose is to compete with Your Move by redistributing our exercise library\", and no training of models on the content without a separate agreement. The pricing FAQ adds that training, fine-tuning or motion-tracking models on the videos, or bulk downloading them, \"needs a separate data license\". Ask for the Brand License document before you ship. None of this is legal advice.\n\n## Which should you pick?\n\n- **Your app's core screen is a demonstration video**, and you would rather pay than film: Your Move. Start the trial on a monthly plan to see the cap in practice, and move to yearly or Scale if 250 or 350 distinct exercises a month is too few.\n- **You want a free, self-hosted tracker you control end to end**: wger, if your team can run a Django service and work within AGPL for code changes and Creative Commons for data.\n- **You want both**: run wger for logging and routines, and fetch Your Move video for the exercises you show, from your backend. Check the Brand License covers that app.\n- **You need no license strings at all**: neither; the public-domain option is compared in [Your Move vs free-exercise-db](/compare/your-move-vs-free-exercise-db).\n\nHosted alternatives are compared in [Your Move vs ExerciseDB](/compare/your-move-vs-exercisedb) and [Your Move vs API Ninjas](/compare/your-move-vs-api-ninjas), and the whole field in [exercise database APIs](/fitness-apis/exercise-database-apis) and [exercise video APIs](/fitness-apis/exercise-video-apis).\n\n## Moving between them\n\nYour Move's Exercise schema, from its OpenAPI document, carries `id` (a UUID), `slug`, `title`, `description`, `instructions` (an array), `importantPoints`, `muscleGroup` (one coarse value), `muscleGroups` and `secondaryMuscles`, `equipment`, `category`, `difficulty`, `exerciseType` (an array), `videoUrl`, `videoHlsUrl`, `thumbnailUrl`, `thumbnails` and a `videos` array whose items each have a stable `id`. We cannot give you the wger side of the table: its API page did not load, so read its field names from the documentation of the version you run rather than from us.\n\nWhat we can say about the move:\n\n- **Match on names, keep your own IDs.** Neither project shares identifiers with the other, so keep a mapping table keyed by your own exercise IDs. On the Your Move side, store the exercise `id` or `slug`, or a `videos[].id`, never `videoUrl`: the docs say video URLs are pre-signed, \"will stop working after 48 hours\", and must not be stored.\n- **Filter vocabulary.** Your Move's 15 muscle groups are `chest`, `back`, `shoulders`, `biceps`, `triceps`, `forearms`, `quads`, `hamstrings`, `glutes`, `calves`, `legs`, `core`, `neck`, `full_body` and `cardio`, and its equipment filter treats hyphens, underscores and spaces alike.\n- **Browse mode.** Keys created on or after 2026-07-07 default to `includeVideos=false` on `/exercises`, so a catalog crawl for mapping costs nothing against the cap; ask for video only on the exercises you render.\n\n```bash\ncurl -H \"X-API-Key: your_api_key\" \\\n  \"https://exercise-api.ymove.app/api/v2/exercises?muscleGroup=chest&equipment=dumbbell&pageSize=5\"\n```\n\n`pageSize` tops out at 50 per the OpenAPI document. Going from Your Move to wger costs you the video: Your Move's files cannot come with you, because the license ends with the subscription and redistribution is barred, so a wger deployment shows whatever media its entries carry or you upload. Going from wger to Your Move, your users' logged history stays in your wger database; only the exercise content changes.\n\n## Watch the fine print\n\n- **Counts disagree on Your Move's own pages.** 2,005+ exercises in the README and OpenAPI description, 2,200+ on the product and pricing pages; 31 equipment types in the product FAQ, 37 in its stats block and docs.\n- **The OpenAPI document lags the docs.** It reads version 2.5.0; the docs header reads v 2.8.0 of 30 October 2026.\n- **Two trial stories.** The signup page and terms describe a 7-day free trial that converts automatically; the docs say a subscription started through `POST /upgrade` begins \"immediately (no trial period)\".\n- **Watermark wording.** The pricing page says Starter is watermarked and \"Pro and above\" are clean; the docs say Trial and Starter are watermarked and Pro and Enterprise clean.\n- **Rate limits.** `/usage` reports a `rateLimit` in requests per minute \"allowed for your plan\"; we found no figure published.\n- **The vendor's own framing.** Your Move's ranking page, which says \"We run Your Move\" up front, lists its own commercial use as \"All paid plans\"; the terms put it through the Brand License, so read that document.\n- **wger.** Its API documentation answered 404 and we did not read wger.de's terms or limits on November 11, 2026. Confirm the license on each exercise entry you ship.",
    "faqs": [
      {
        "q": "Does wger have exercise videos?",
        "a": "wger's README and GitHub page, as read on November 11, 2026, do not describe its media, and its API documentation page answered 404 that day, so we cannot say from wger's own pages. Your Move's ranking page describes wger as having images and a few user videos, but that is a competitor's description we could not verify. Your Move's README says every exercise ships with an HD video as HLS and MP4."
      },
      {
        "q": "Is it cheaper to self-host wger than to pay for Your Move?",
        "a": "In license fees, yes: wger is free under AGPL-3.0-or-later, and Your Move's plans run $19, $29, $79 and $299 a month after a 7-day trial. But a wger instance still costs servers, backups, upgrades and someone's time, and it does not come with filmed video. Price the hosting and the media you would need before deciding."
      },
      {
        "q": "Does Your Move's license have copyleft like wger's AGPL?",
        "a": "No. Your Move's obligations are contractual, not copyleft: a Brand License per registered brand, videos licensed only while you subscribe, no resale or sub-licensing, and no model training without a separate agreement. wger's AGPL applies to its code if you modify it and serve it over a network, and its exercise data is Creative Commons per entry. Not legal advice."
      },
      {
        "q": "Can I use wger for tracking and Your Move for exercise videos in one app?",
        "a": "Nothing on the pages we read forbids it. Fetch Your Move exercises from your backend, as its docs require, and keep your own mapping between wger exercises and Your Move IDs or slugs. Check that the app sits under a brand registered on your Your Move license, and that you honor the Creative Commons terms on each wger entry you show."
      },
      {
        "q": "Can I move my exercise catalog from wger to Your Move?",
        "a": "Only by mapping, since the two share no identifiers. Your Move's exercises carry title, slug, muscleGroup, equipment, difficulty and instructions, so match on names and keep your own ID table; we could not read wger's API field names on November 11, 2026. Your users' workout history stays in your wger database."
      },
      {
        "q": "Does Your Move have anything like wger's self-hosting?",
        "a": "Not on its standard plans: every plan lists no self-hosting, with a separate self-hosting license offered on request. Scale and Enterprise allow an on-device cache for offline workouts, and the API Terms say cached files must be deleted when the subscription ends. wger, by contrast, is self-hosted with Docker by design."
      }
    ],
    "related": [
      {
        "href": "/integrate/your-move-exercise-api",
        "label": "How to integrate the Your Move Exercise API"
      },
      {
        "href": "/apis/your-move",
        "label": "Your Move directory entry"
      },
      {
        "href": "/compare/exercisedb-vs-wger",
        "label": "ExerciseDB vs wger"
      },
      {
        "href": "/alternatives/wger-alternatives",
        "label": "wger alternatives"
      },
      {
        "href": "/pricing/exercise-database-api-pricing",
        "label": "Exercise database API pricing"
      },
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Exercise database APIs"
      },
      {
        "href": "/fitness-apis/exercise-video-apis",
        "label": "Exercise video APIs"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Exercise API prices and open-source licenses both move - subscribe for plain-English updates when Your Move or wger changes terms."
    },
    "sources": [
      {
        "url": "https://ymove.app/exercise-api",
        "checked": "2026-11-11",
        "note": "catalog figures, filming partners, models, FAQ"
      },
      {
        "url": "https://ymove.app/exercise-api/pricing",
        "checked": "2026-11-11",
        "note": "plans, trial, caps, Bunny CDN, self-hosting, resale, data license"
      },
      {
        "url": "https://ymove.app/exercise-api/docs",
        "checked": "2026-11-11",
        "note": "auth, 48-hour URLs, thumbnails, muscles, caps, watermark, upgrade, changelog"
      },
      {
        "url": "https://exercise-api.ymove.app/api/v2/openapi.json",
        "checked": "2026-11-11",
        "note": "Exercise schema, version 2.5.0, rateLimit, pageSize"
      },
      {
        "url": "https://ymove.app/terms-and-conditions",
        "checked": "2026-11-11",
        "note": "API Terms: Brand License, active subscription, acceptable use; general terms"
      },
      {
        "url": "https://ymove.app/exercise-api/signup",
        "checked": "2026-11-11",
        "note": "7-day trial wording"
      },
      {
        "url": "https://ymove.app/exercise-api/top-exercise-apis",
        "checked": "2026-11-11",
        "note": "vendor's own ranking, quoted as its framing only"
      },
      {
        "url": "https://raw.githubusercontent.com/ymove-app/exercise-api/main/README.md",
        "checked": "2026-11-11",
        "note": "README counts, HLS + MP4, quickstart curl"
      },
      {
        "url": "https://raw.githubusercontent.com/ymove-app/exercise-api/main/free-videos/README.md",
        "checked": "2026-11-11",
        "note": "25 free sample clips"
      },
      {
        "url": "https://github.com/ymove-app/exercise-api",
        "checked": "2026-11-11",
        "note": "3 stars, 6 commits"
      },
      {
        "url": "https://github.com/ymove-app/exercise-api-sdk",
        "checked": "2026-11-11",
        "note": "MIT SDK, 0 stars"
      },
      {
        "url": "https://github.com/ymove-app/exercise-api-mcp",
        "checked": "2026-11-11",
        "note": "MIT MCP server, 1 star"
      },
      {
        "url": "https://raw.githubusercontent.com/wger-project/wger/master/README.md",
        "checked": "2026-11-11",
        "note": "features, REST API, Docker self-hosting, licenses"
      },
      {
        "url": "https://raw.githubusercontent.com/wger-project/wger/master/LICENSE.txt",
        "checked": "2026-11-11",
        "note": "AGPL-3.0 text, section 13"
      },
      {
        "url": "https://github.com/wger-project/wger",
        "checked": "2026-11-11",
        "note": "stars, forks, commits, topics"
      }
    ]
  },
  {
    "slug": "your-move-vs-api-ninjas",
    "primaryQuery": "your move vs api ninjas",
    "h1": "Your Move vs API Ninjas: Exercise Video or a Simple Text Lookup?",
    "metaTitle": "Your Move vs API Ninjas (2026): Exercise APIs Compared",
    "metaDescription": "Your Move vs API Ninjas Exercises: HD video vs start and finish photos, $19 vs $59 entry plans, free tiers, storage rules, caps and field mapping.",
    "updated": "2026-11-11",
    "answer": "Pick Your Move (ymove.app) when your app needs demonstration video: its exercises ship HD video as HLS and MP4, and plans start at $19 a month with a 7-day trial. Pick API Ninjas Exercises when text, safety notes and a premium start and finish photo are enough and you want a free evaluation plan and terms in one table; commercial use there starts at $59 a month, or $39 billed yearly. Both were read on November 11, 2026.",
    "body": "Your Move (ymove.app) sells an exercise API from Your Move B.V., a Dutch company that also makes a white-label fitness app builder, and its case rests on filmed video: its README promises \"2,005+ exercises and 2,600+ HD videos\", \"filmed with trainers and physiotherapists\". API Ninjas sells a catalog of small APIs under one account, and its Exercises API is a text lookup with, on paid plans, a start and finish photo. Everything below was read on November 11, 2026 from each vendor's own docs and pricing pages, and every count is the vendor's own figure; we did not count either catalog.\n\nThey answer different questions. API Ninjas tells your app which biceps exercises exist and how to do them, in a few lines of JSON, with a free plan for trying it and terms in one table. Your Move shows your user the movement, with a video for the exercise and a generated workout around it, at a lower paid entry price but with no free tier and more rules. The full Your Move walkthrough is [how to integrate the Your Move Exercise API](/integrate/your-move-exercise-api), and its directory entry is [Your Move](/apis/your-move).\n\n## Your Move vs API Ninjas at a glance\n\n| | Your Move (ymove.app) | API Ninjas Exercises |\n| --- | --- | --- |\n| What you get | Exercises with video, plus workout and program generation, form analysis, nutrition and recipes on one key | Exercise name, type, muscle, difficulty, instructions, equipment and safety notes |\n| Catalog, vendor's figure | 2,005+ (README, OpenAPI) or 2,200+ (product page) exercises; 2,600+ HD videos | \"over 3000 exercises\" |\n| Media | HD video as HLS and MP4; static thumbnails in five framings | `images`, premium only: photos \"usually the start and finish positions\"; no video |\n| Free entry point | No permanent free tier: a 7-day trial capped at 100 exercises with video | Free plan: 3,000 calls a month, 100 an hour, evaluation and demo only |\n| Price | Starter $19, Pro $29, Scale $79, Enterprise $299 a month | Developer $59 a month, or $39 billed yearly; Business $149 or $99; Professional $299 or $199 |\n| License and terms | API Terms with a Brand License per registered brand; videos licensed only while subscribed | Commercial use on every paid plan; attribution required on Free |\n| Storing data | Thumbnails may be stored; video URLs may not; on-device video cache on Scale and up | \"Data caching/storing allowed\" from Business up |\n| Caps and limits | Video minutes a month, plus 250 or 350 distinct exercises with video per 30 days on monthly Starter and Pro | Calls a month: 100,000 on Developer, 1,000,000 on Business |\n| Results per call | `pageSize` up to 50 | `/v1/exercises` \"Returns up to 5 exercises\"; `offset` is premium only |\n| Uptime | No SLA stated | 99% on Developer, 99.95% on Business |\n| SDK and docs | One docs page, an OpenAPI document, MIT TypeScript SDK and MCP server | One reference page with code samples in many languages |\n| Auth | `X-API-Key` header or `?api_key=` | `X-Api-Key` header |\n\nEvery plan's price is in [exercise database API pricing](/pricing/exercise-database-api-pricing).\n\n## Where Your Move pulls ahead\n\n**Video.** This is the whole difference for a workout player. Your Move's README says every exercise ships with \"an HD video (HLS + MP4)\", and its schema has `videoUrl` and `videoHlsUrl` on each record, plus a `videos` array whose items carry a stable `id`. API Ninjas documents no video at all: its `images` field is \"Array of image URLs showing the exercise, in movement order\", and only on premium plans.\n\n**A lower price for a commercial launch.** API Ninjas' pricing page puts commercial use at the Developer plan, $59 a month or $39 billed yearly. Your Move's Starter is $19 and Pro $29, and \"Every paid plan starts with a 7-day free trial\". The cheap plan has a catch: Your Move's pricing page says Starter videos \"include a small Your Move watermark\", so a clean app starts at $29.\n\n**More per call.** `/v1/exercises` \"Returns up to 5 exercises that satisfy the given parameters\", and paging past them with `offset` is premium only. The list of every exercise name for a muscle, `/v1/allexercises`, is for \"Business tier and above, or any annual plan\". Your Move's `/exercises` pages with `page` and `pageSize`, up to 50 a page, and filters by muscle group, equipment, difficulty, exercise type, video and title search.\n\n**Workouts and programs on the same key.** Your Move's docs list `/workouts/generate`, which builds a session with warmup and cooldown blocks, and `/programs/generate` for multi-week plans, plus `POST /posture/analyze` for AI form analysis from a video (beta). API Ninjas' exercise page suggests pairing its exercises with its separate Calories Burned API; it generates no workouts.\n\n**Thumbnails and tooling.** Every Your Move exercise with a video carries \"five framings of the same frame\", from a 3:4 default up to 600x800 to a 16:9 landscape, and the docs say thumbnail URLs are static and safe to cache or store. Your Move also publishes an OpenAPI document, an MIT-licensed TypeScript SDK and an MIT-licensed MCP server.\n\n## Where API Ninjas pulls ahead\n\n**A free plan.** This is Your Move's clearest loss. API Ninjas' Free plan gives 3,000 calls a month with \"no payment information required\", and its exercise page has a live demo that needs no key. It is \"Evaluation and demo purposes only\", with attribution required and no commercial use, but you can build against it for as long as you like. Your Move's 7-day trial reaches 100 distinct exercises with video and converts to a paid plan unless you cancel.\n\n**A larger stated catalog.** API Ninjas states \"over 3000 exercises targeting every major muscle group\". Your Move states 2,005+ in its README and OpenAPI description and 2,200+ on its product page.\n\n**Terms in one table.** API Ninjas' pricing page puts commercial use, data caching, rate limiting, attribution and uptime SLA side by side for every plan: Developer allows commercial use but not storing data, and Business adds \"Data caching/storing allowed\". Your Move's rules are real but spread across the pricing page, docs, API Terms and general terms, and two of them disagree (see the fine print).\n\n**Predictable failure.** API Ninjas' FAQ says that at your monthly quota \"Your API requests will simply be denied\", and \"you will never be charged more than the plan you signed up for\". Your Move's pricing FAQ says \"We never block requests\" when you pass your video minutes and that it will contact you about a plan that fits, while its API Terms say \"We may throttle, degrade, or suspend access that exceeds these limits\". The exercise cap is enforced in the response: video fields disappear from new exercises.\n\n**A published SLA.** Developer carries a 99% uptime SLA and Business 99.95%. The Your Move pages we read state neither an uptime figure nor a rate limit, though its OpenAPI document defines a 429 \"Rate limit exceeded\" response.\n\n## The catches on each side\n\n**Your Move.**\n\n- Monthly Starter and Pro cap distinct exercises pulled with video in a rolling 30 days, at 250 and 350; Scale, Enterprise and every yearly plan are uncapped. Over the cap, the docs say video properties \"are removed entirely (not set to null)\" from new exercises and a `_warning` with reason `monthly_exercise_cap` is added, so handle missing keys.\n- Video URLs \"will stop working after 48 hours\". Never store them, re-fetch on error, and call the API from your backend: the docs say \"Never expose your API key in client-side code.\"\n- Keys created on or after July 7, 2026 default to `includeVideos=false` on `/exercises`, per the v2.5.0 changelog; add `includeVideos=true` when you want video.\n- The counts disagree across its own pages (2,005+ and 2,200+ exercises; 31 and 37 equipment types), and the OpenAPI document says version 2.5.0 while the docs are at 2.8.0, dated October 30, 2026.\n\n**API Ninjas.**\n\n- Photos are premium only, and they are stills: start and finish, no motion.\n- Five results per search call on every plan, with `offset` paging premium only, and the full per-muscle list needs Business or an annual plan.\n- The Developer plan forbids caching or storing data, so an app that keeps a local copy of the catalog needs Business at $149 a month, or $99 billed yearly.\n- Each exercise has one `muscle`, from 16 values; there is no secondary-muscle field in the documented response.\n\n## Which should you pick?\n\n- **You need demonstration video in the app** → Your Move. API Ninjas has none.\n- **You want to try an exercise API with no card and no deadline** → API Ninjas' Free plan, within its evaluation-only terms.\n- **Text and a still photo are enough, and you want terms you can cite in one table** → API Ninjas on a paid plan; Business if you store the data.\n- **A commercial launch on the smallest monthly bill** → Your Move Starter at $19 if a watermark is acceptable, Pro at $29 if not, against API Ninjas Developer at $39 a month billed yearly.\n- **Generated workouts or multi-week programs** → Your Move.\n- **No API at all, data you own** → see [Your Move vs free-exercise-db](/compare/your-move-vs-free-exercise-db), [Your Move vs wger](/compare/your-move-vs-wger) and [ExerciseDB vs API Ninjas](/compare/exercisedb-vs-api-ninjas).\n\nThe wider field is in [exercise database APIs compared](/fitness-apis/exercise-database-apis) and [exercise APIs with video](/fitness-apis/exercise-video-apis).\n\n## Moving between them\n\nThe field names below are from API Ninjas' response reference and Your Move's OpenAPI `Exercise` schema.\n\n| API Ninjas | Your Move | Notes |\n| --- | --- | --- |\n| `name` | `title`, `slug` | Your Move also has a UUID `id`; `/exercises/{id}` takes ID or slug |\n| `type` | `exerciseType` (array) | API Ninjas' olympic_weightlifting, powerlifting and strongman have no matching Your Move type; plyometrics maps to plyometric |\n| `muscle` | `muscleGroup` | 16 values against 15; abdominals maps to core, lats and middle_back to back |\n| (none) | `muscleGroups`, `secondaryMuscles` | Your Move lists every muscle worked |\n| `difficulty` | `difficulty` | expert maps to advanced |\n| `instructions` (string) | `instructions` (array) | Split into steps or join them |\n| `equipments` (array) | `equipment` (string) | One equipment value per Your Move record |\n| `safety_info` | `importantPoints` | Closest match; check the content |\n| `images` (premium) | `thumbnails`, `videoUrl`, `videoHlsUrl` | |\n\nYour Move's `muscleGroup` filter accepts aliases such as `quadriceps`, and its docs say detail muscle names sent to that filter roll up to their group, so a query written for API Ninjas' `muscle=quadriceps` needs little change. The bigger change is in your backend: store Your Move exercise IDs and thumbnails, never video URLs.\n\n## Watch the fine print\n\n**Your Move's commercial terms run through a brand license.** Its API Terms say \"Every API subscription includes a Brand License that limits API content use to the Brands you register\", and \"Each Brand covers one website and one mobile application under the same brand name.\" Starter and Pro include one, Scale three, Enterprise ten. The general terms below, \"Last updated August 07, 2025\", grant content \"for your personal, non-commercial use or internal business purpose only\", which the API Terms supplement. The API Terms define \"Videos\" to include \"any associated thumbnails, transcripts, or metadata returned through the API\", and Videos are licensed \"only while your subscription is active\". Self-hosting needs a separate license, and the pricing page says you \"cannot redistribute, sub-license, or resell the video content\". Get the Brand License document, \"issued via email at sign-up\", before you ship. This is not legal advice.\n\n**Your Move's trial wording conflicts.** The signup page and API Terms describe a 7-day trial that converts to the paid plan unless canceled; the docs' `POST /upgrade` section says \"Subscriptions start immediately (no trial period)\" for subscriptions started through the API.\n\n**Your Move's watermark wording differs.** The pricing page says Starter is watermarked and \"Pro and above\" are clean; the docs say \"Trial and Starter plans receive watermarked videos. Pro and Enterprise plans receive clean, unwatermarked videos.\"\n\n**API Ninjas' Free plan is not a launch plan.** Its FAQ says \"Commercial use of the Exercises API is not permitted on the free tier\", and the Free plan requires attribution. Budget the Developer plan from day one of a commercial app.\n\nYour Move also gives away 25 royalty-free HD sample clips, \"Free for commercial use\" with \"Do not resell\", which is enough to test a player before you start the trial.",
    "faqs": [
      {
        "q": "Is Your Move cheaper than API Ninjas?",
        "a": "At the paid entry point, yes. Your Move's Starter plan is $19 a month with watermarked video and Pro is $29 with clean video. API Ninjas puts commercial use on its Developer plan at $59 a month, or $39 billed yearly. API Ninjas has a free plan for evaluation and demos, which Your Move does not, and if you store data API Ninjas needs its Business plan at $149, or $99 billed yearly."
      },
      {
        "q": "Does API Ninjas return exercise video the way Your Move does?",
        "a": "No. API Ninjas documents an images field, premium only, holding image URLs in movement order, usually the start and finish positions, and no video. Your Move's README says every exercise ships with an HD video as HLS and MP4, and its schema carries videoUrl and videoHlsUrl on each record, as pre-signed URLs that expire after 48 hours."
      },
      {
        "q": "Which has a free tier, Your Move or API Ninjas?",
        "a": "API Ninjas. Its Free plan gives 3,000 calls a month and 100 an hour with no payment information, for evaluation and demo purposes only, with attribution required and no commercial use. Your Move has no permanent free tier: every paid plan starts with a 7-day trial, capped at 100 distinct exercises with video, which converts to the paid plan unless you cancel."
      },
      {
        "q": "Can I store API Ninjas or Your Move exercise data in my app?",
        "a": "On API Ninjas, from the Business plan up: its pricing table marks data caching and storing as not allowed on Free and Developer. On Your Move, thumbnails may be cached and stored but video URLs may not, Scale and Enterprise allow an on-device video cache for offline workouts, and its API Terms say videos, defined to include associated thumbnails and metadata, are licensed only while your subscription is active."
      },
      {
        "q": "What happens when I go over my limit on Your Move or API Ninjas?",
        "a": "API Ninjas says requests are simply denied once you hit your monthly quota and you are never charged more than your plan. Your Move says it never blocks requests when you pass your video minutes and will contact you about a plan that fits, though its API Terms reserve the right to throttle or suspend. Past the monthly exercise cap on Starter or Pro, Your Move strips the video fields from exercises you have not accessed in the window and adds a _warning."
      },
      {
        "q": "How do API Ninjas exercise fields map to Your Move?",
        "a": "name maps to title, type to exerciseType, muscle to muscleGroup, difficulty to difficulty with expert becoming advanced, the instructions string to an instructions array, the equipments array to a single equipment string, safety_info roughly to importantPoints, and images to thumbnails and the video URLs. Your Move's muscleGroup filter accepts aliases such as quadriceps, and its muscleGroups field adds the full list of muscles worked, which API Ninjas does not return."
      }
    ],
    "related": [
      {
        "href": "/compare/exercisedb-vs-api-ninjas",
        "label": "ExerciseDB vs API Ninjas"
      },
      {
        "href": "/integrate/your-move-exercise-api",
        "label": "How to integrate the Your Move Exercise API"
      },
      {
        "href": "/apis/your-move",
        "label": "Your Move"
      },
      {
        "href": "/pricing/exercise-database-api-pricing",
        "label": "Exercise database API pricing"
      },
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/fitness-apis/exercise-video-apis",
        "label": "Exercise APIs with video"
      },
      {
        "href": "/alternatives/exercisedb-alternatives",
        "label": "ExerciseDB alternatives"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Exercise API prices, free plans and storage rules move often. Subscribe and we will flag it when Your Move or API Ninjas changes its terms."
    },
    "sources": [
      {
        "url": "https://raw.githubusercontent.com/ymove-app/exercise-api/main/README.md",
        "checked": "2026-11-11",
        "note": "Your Move README: 2,005+ exercises, 2,600+ videos, HLS and MP4, 37 equipment types"
      },
      {
        "url": "https://ymove.app/exercise-api",
        "checked": "2026-11-11",
        "note": "Your Move product page: 2,200+ exercises, 31 equipment types in its FAQ"
      },
      {
        "url": "https://exercise-api.ymove.app/api/v2/openapi.json",
        "checked": "2026-11-11",
        "note": "Your Move OpenAPI 2.5.0: Exercise schema, parameters, 429 response"
      },
      {
        "url": "https://ymove.app/exercise-api/docs",
        "checked": "2026-11-11",
        "note": "Your Move docs v2.8.0: auth, 48-hour video URLs, thumbnails, exercise caps, watermark, upgrade, changelog"
      },
      {
        "url": "https://ymove.app/exercise-api/pricing",
        "checked": "2026-11-11",
        "note": "Your Move plans, minutes, exercise cap FAQ, watermark, self-hosting, resale, data license"
      },
      {
        "url": "https://ymove.app/terms-and-conditions",
        "checked": "2026-11-11",
        "note": "Your Move API Terms (Brand License, active subscription, trial, limits) and general terms"
      },
      {
        "url": "https://raw.githubusercontent.com/ymove-app/exercise-api/main/free-videos/README.md",
        "checked": "2026-11-11",
        "note": "25 free sample clips and their license"
      },
      {
        "url": "https://ymove.app/exercise-api/top-exercise-apis",
        "checked": "2026-11-11",
        "note": "Your Move's own roundup, used for plan prices quoted with their features"
      },
      {
        "url": "https://api-ninjas.com/api/exercises",
        "checked": "2026-11-11",
        "note": "Exercises API endpoints, parameters, fields, premium images and offset, FAQ"
      },
      {
        "url": "https://api-ninjas.com/pricing",
        "checked": "2026-11-11",
        "note": "API Ninjas plans, calls, commercial use, storage, rate limit, SLA"
      }
    ]
  },
  {
    "slug": "your-move-vs-free-exercise-db",
    "primaryQuery": "your move vs free-exercise-db",
    "h1": "Your Move vs free-exercise-db: Paid Video API or Free Public-Domain Dataset?",
    "metaTitle": "Your Move vs free-exercise-db: Video API or Free JSON?",
    "metaDescription": "Your Move streams filmed HD exercise video from $19/mo after a 7-day trial; free-exercise-db is 876 public-domain exercises as JSON with 1,746 JPEGs.",
    "updated": "2026-11-11",
    "answer": "Pick Your Move when your app needs filmed HD exercise video, as MP4 and HLS, from a hosted API and you can pay from $19 a month after a 7-day trial, under a brand license that lasts only while you subscribe. Pick free-exercise-db when you want exercise data you own outright: a public-domain (Unlicense) JSON dataset on GitHub with no key, fee or API, which held 876 exercises and 1,746 still JPEG images when we counted it on November 11, 2026.",
    "body": "Your Move (ymove.app), the Amsterdam-based Your Move B.V., sells a hosted Exercise API: filmed HD exercise video, thumbnails and muscle data behind an API key, with workout and program generation on the same key. free-exercise-db is a GitHub repository its README calls an \"Open Public Domain Exercise Dataset in `JSON` format\": files you download and own, with still photos and no API at all. The question between them is less \"which API\" than \"rent media, or own data\". Everything below was read on November 11, 2026, from Your Move's product, pricing, documentation and terms pages, its OpenAPI document and GitHub repositories, and from free-exercise-db's README, LICENSE.md, schema.json, combined `dist/exercises.json` and repository page. The counts are our own, from that day's `dist/exercises.json`.\n\nSetup for each is covered in [how to integrate the Your Move Exercise API](/integrate/your-move-exercise-api) and [ExerciseDB vs free-exercise-db](/compare/exercisedb-vs-free-exercise-db); the [Your Move directory entry](/apis/your-move) has the vendor summary.\n\n## Your Move vs free-exercise-db at a glance\n\n| | Your Move Exercise API | free-exercise-db |\n|---|---|---|\n| What you get | A hosted API: 2,005+ exercises per its README, 2,200+ per its product page, 2,600+ HD videos; workouts, programs, form analysis, nutrition and recipes on the same key | A static dataset: 876 exercises in `dist/exercises.json` (the README says 800+), one JSON file per exercise plus a combined file |\n| Media | Filmed HD video as MP4 and HLS, mostly portrait; static thumbnails in five framings; a body-map SVG | 1,746 JPEG image paths: two each for 873 exercises, none for 3; no video or GIF |\n| Free entry point | A 7-day free trial on every paid plan, plus 25 free sample clips; no permanent free tier | Everything, at $0, with no key or sign-up |\n| Price | Starter $19 a month (watermarked), Pro $29, Scale $79, Enterprise $299 | $0; you pay for wherever you host the files |\n| License and terms | A Brand License per registered brand (one website and one mobile app); videos licensed only while you subscribe; no resale; no model training without a data license | The Unlicense: public domain, \"for any purpose, commercial or non-commercial\" |\n| Hosting | Your Move's API and Bunny CDN; self-hosting is a separate license; on-device offline cache on Scale and Enterprise | Yours: clone the repository, or fetch raw GitHub URLs as the README describes |\n| Caps and limits | Video minutes per month (10,000 to 100,000); monthly Starter and Pro plans cap distinct exercises with video at 250 and 350 per rolling 30 days | None: the files are yours |\n| SDK and docs | One documentation page, an OpenAPI document, an MIT TypeScript SDK and MCP server | README, a JSON Schema, Makefile tasks and a browsable Vue front end |\n\nFor what every exercise data option costs, see [exercise database API pricing](/pricing/exercise-database-api-pricing).\n\n## Where Your Move pulls ahead\n\n**Motion.** free-exercise-db has none: every image path in its combined file ends in `.jpg`. Your Move's README says every exercise \"ships with an HD video (HLS + MP4)\", filmed with trainers and physiotherapists, \"No AI-generated clips, no GIFs\". The product page names Movement Based Therapy, a sports physiotherapy practice, and the gym Elite Fitness among the people it films with, and says a few gym-machine exercises exist only with a gym background for now. Its Exercise schema carries a `hasVideo` boolean and the docs' own example filters on `hasVideo=true`, so check that flag per row. If your screen is a looping demonstration, this decides it; [exercise video APIs](/fitness-apis/exercise-video-apis) lists every source of demo video.\n\n**A larger, richer record.** Even at the lower of its two counts, Your Move states more than twice free-exercise-db's 876 exercises. Its `muscleGroups` field averages \"about nine muscles per exercise across 83 distinct muscles\", per the docs, where free-exercise-db's `primaryMuscles` and `secondaryMuscles` draw from 17 broad values. Records add `description`, `importantPoints` (coaching points), `exerciseType` as an array, and five static thumbnail framings: default 3:4, square, portrait 9:16, landscape 16:9 and the original frame. `GET /exercises/{id}/body-map` returns the muscles as an SVG.\n\n**Something maintained and generated for you.** The docs' changelog runs from v 2.3.0 in April to v 2.8.0 on 30 October 2026, the last adding treadmill, rower and bike equipment filmed in October. `GET /workouts/generate` and `GET /programs/generate` build sessions and multi-week programs from the catalog. With free-exercise-db, any search, filtering or generation is code you write.\n\n**Developer tooling.** An OpenAPI document, an MIT TypeScript SDK (`ymove-exercise-api`), an MIT MCP server (`ymove-exercise-mcp`), and a published price list with a 7-day trial on every paid plan.\n\n## Where free-exercise-db pulls ahead\n\n**It is free, permanently, and Your Move is not.** free-exercise-db costs nothing and asks for nothing. Your Move's pricing page opens with \"Start free, scale as you grow\", but the free part is a 7-day trial that converts to a paid plan unless canceled; its docs cap a trial at 100 distinct exercises with video. Its 25 free sample clips, free for commercial use but not for resale, are what you can keep without a subscription.\n\n**Public domain against a licensed rental.** free-exercise-db's LICENSE.md is the Unlicense: \"Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial\". Your Move's API Terms limit content to \"the Brands you register\", one website and one mobile application each; its general terms, last updated August 07, 2025, grant content \"for your personal, non-commercial use or internal business purpose only\", which the Brand License supplements; resale and sub-licensing are barred; and training models on the videos \"needs a separate data license\".\n\n**You keep it.** Your Move's terms say \"Videos are licensed to you only while your subscription is active\", and cached or downloaded files must be deleted when it ends. Every plan lists \"No self-hosting (separate license)\", and on-device offline caching is a Scale and Enterprise feature. free-exercise-db's combined JSON is about a megabyte, so you can ship it inside an app and search it offline on any budget.\n\n**No meter.** Your Move counts video minutes and, on monthly Starter and Pro, distinct exercises with video per rolling 30 days (250 and 350); past the cap the API strips video fields from exercises you have not accessed. A JSON file has no quota, no key to leak and no backend proxy to run.\n\n**A bigger open community.** The repository showed 2.1k stars and 535 forks. Your Move's exercise-api repository showed 3 stars and 6 commits.\n\n## What is actually in free-exercise-db\n\nWe counted `dist/exercises.json` ourselves rather than repeat the README's \"800+\". It held 876 records, each with `id`, `name`, `force`, `level`, `mechanic`, `equipment`, `primaryMuscles`, `secondaryMuscles`, `instructions`, `category` and `images`, the fields in its JSON Schema.\n\n| Category | Exercises |\n|---|---|\n| strength | 584 |\n| stretching | 123 |\n| plyometrics | 61 |\n| powerlifting | 38 |\n| olympic weightlifting | 35 |\n| strongman | 21 |\n| cardio | 14 |\n\nBy level, 525 are beginner, 294 intermediate and 57 expert. The README warns that `force`, `mechanic` and `equipment` are \"incomplete in _some_ `JSON` files\"; in our count they were null in 30, 87 and 77 records. Five records have an empty instruction list, and the README notes \"a small number of duplicate images\" (25 duplicate files in 22 sets, in its own scan). Equipment comes from 12 values plus null, among them `body only`, `kettlebells`, `bands`, `foam roll` and `e-z curl bar`.\n\nHosting is up to you. The README's shortcut is to fetch the combined file and \"prefix any of image path's contained in the `JSON` with `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/`\"; for production, copy the files to your own storage. On provenance, the README says the data was restructured from wrkout/exercises.json, credited to Ollie Jennings. We did not read that upstream repository's license on November 11, 2026, and neither README we read names who took the photographs; if that matters to your legal review, ask.\n\n## Which should you pick?\n\n- **Your users watch the movement before they do it**: Your Move. free-exercise-db's two stills per exercise cannot show tempo or range.\n- **You need data you can own, ship and modify with no strings**: free-exercise-db. No license on this page is more permissive.\n- **You are prototyping on no budget**: free-exercise-db, or Your Move's 25 free clips for a demo; the Your Move trial lasts 7 days and caps at 100 exercises.\n- **You want both**: use free-exercise-db as your catalog and fetch Your Move video only for the exercises you render. A few hundred featured movements fits the monthly caps; check the Brand License covers your app.\n- **You want an open catalog with a running API instead**: see [Your Move vs wger](/compare/your-move-vs-wger).\n\nOther hosted options are in [Your Move vs ExerciseDB](/compare/your-move-vs-exercisedb) and [Your Move vs API Ninjas](/compare/your-move-vs-api-ninjas), and the field in [exercise database APIs](/fitness-apis/exercise-database-apis).\n\n## Moving between them\n\nThe field names are close; the vocabularies are not.\n\n| free-exercise-db | Your Move | Notes |\n|---|---|---|\n| `id` (e.g. `Alternate_Incline_Dumbbell_Curl`) | `id` (UUID) and `slug` | No shared identifiers: keep a mapping table |\n| `name` | `title` | Match on names, then check by hand |\n| `primaryMuscles` (array of 17 values) | `muscleGroup` (one of 15) and `muscleGroups` | `quadriceps` against `quads`; `abdominals` against `core`; `lats` and `middle back` roll up to `back` |\n| `secondaryMuscles` | `secondaryMuscles` | Same name, different vocabulary |\n| `equipment` (one string or null) | `equipment` | `body only` against `bodyweight`, `kettlebells` against `kettlebell`, `bands` against `band` |\n| `level` | `difficulty` | free-exercise-db: beginner, intermediate, expert |\n| `category` | `exerciseType` (array) and `category` | Your Move allows several types per exercise |\n| `instructions` (array) | `instructions` (array) | Your Move adds `importantPoints` |\n| `images` (two JPEG paths) | `thumbnails`, `videoUrl`, `videoHlsUrl`, `videos[]` | Store a `videos[].id`, never a video URL |\n\nThe vocabulary pairs above are our reading of the two published lists, free-exercise-db's schema.json and Your Move's muscle and equipment references, not a mapping either project publishes. Your Move's equipment filter treats hyphens, underscores and spaces alike, and the docs show a barbell row's `muscleGroups` including `lats` and `middle_back`.\n\nTwo rules matter on the Your Move side. Video URLs are pre-signed and \"will stop working after 48 hours\", so store the exercise `id` or `slug` and re-fetch. And keys created on or after 2026-07-07 default to `includeVideos=false` on `/exercises`, so a full crawl to build the mapping costs nothing against the cap:\n\n```bash\ncurl -O https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json\ncurl -H \"X-API-Key: your_api_key\" \\\n  \"https://exercise-api.ymove.app/api/v2/exercises?muscleGroup=chest&equipment=dumbbell&pageSize=5\"\n```\n\nLeaving Your Move for free-exercise-db means losing the video, since the license ends with the subscription. Leaving free-exercise-db for Your Move means checking that the exercises your users logged exist in the new catalog.\n\n## Watch the fine print\n\n- **Your Move's counts disagree.** 2,005+ exercises in the README and OpenAPI description, 2,200+ on the product and pricing pages; 31 equipment types in the product FAQ, 37 in its stats block and docs.\n- **The OpenAPI document lags.** It reads version 2.5.0; the docs header reads v 2.8.0 of 30 October 2026.\n- **Two trial stories.** The signup page and terms describe a 7-day trial that converts automatically; the docs say a subscription started through `POST /upgrade` begins \"immediately (no trial period)\".\n- **Watermarks.** The pricing page says Starter is watermarked and \"Pro and above\" are clean; the docs say Trial and Starter are watermarked and Pro and Enterprise clean.\n- **Rate limits.** `/usage` reports a per-minute `rateLimit`; we found no figure published.\n- **free-exercise-db moves too.** Our counts describe the main branch on November 11, 2026; recount after you pull. This is not legal advice on either license.",
    "faqs": [
      {
        "q": "Is free-exercise-db really free for commercial use?",
        "a": "Its LICENSE.md is the Unlicense, which says anyone may copy, modify, publish, use, sell or distribute the work for any purpose, commercial or non-commercial, and dedicates it to the public domain. As read on November 11, 2026, neither its README nor the upstream credit names who took the photographs, so ask that question if your legal review needs provenance. Not legal advice."
      },
      {
        "q": "Can I add Your Move videos to free-exercise-db exercises?",
        "a": "Yes, by mapping: the two share no IDs, so match free-exercise-db names to Your Move titles or slugs and keep a table. Fetch Your Move from your backend, store the exercise ID or a videos[].id rather than the video URL, which expires after 48 hours, and watch the monthly cap of 250 or 350 distinct exercises on monthly Starter and Pro."
      },
      {
        "q": "Can I download and keep Your Move's exercise data the way I can with free-exercise-db?",
        "a": "No. Your Move's API Terms license videos only while your subscription is active and require you to delete cached or downloaded files when it ends; self-hosting is a separate license, and bulk downloading or training models on the videos needs a separate data license. free-exercise-db is public domain, so a copy is yours to keep."
      },
      {
        "q": "How big is free-exercise-db compared with Your Move's catalog?",
        "a": "We counted 876 exercises and 1,746 JPEG image paths in free-exercise-db's dist/exercises.json on November 11, 2026. Your Move states 2,005+ exercises in its README and 2,200+ on its product page, with 2,600+ HD videos; those are the vendor's own figures, and they disagree with each other."
      },
      {
        "q": "Can a free-exercise-db app work offline, and can Your Move?",
        "a": "free-exercise-db's combined JSON is about a megabyte, so you can bundle it and its images in the app. Your Move allows an on-device cache for offline workouts only on Scale ($79 a month) and Enterprise, and the cached files must be deleted if the subscription ends."
      },
      {
        "q": "Why pay for Your Move when free-exercise-db costs nothing?",
        "a": "For motion and upkeep: free-exercise-db has two still photos per exercise and changes only when someone commits, while Your Move serves filmed HD video as MP4 and HLS, five thumbnail framings, detailed muscle data and generated workouts. If stills are enough for your app, free-exercise-db is the better deal."
      }
    ],
    "related": [
      {
        "href": "/integrate/your-move-exercise-api",
        "label": "How to integrate the Your Move Exercise API"
      },
      {
        "href": "/apis/your-move",
        "label": "Your Move directory entry"
      },
      {
        "href": "/compare/exercisedb-vs-free-exercise-db",
        "label": "ExerciseDB vs free-exercise-db"
      },
      {
        "href": "/alternatives/exercisedb-alternatives",
        "label": "ExerciseDB alternatives"
      },
      {
        "href": "/pricing/exercise-database-api-pricing",
        "label": "Exercise database API pricing"
      },
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Exercise database APIs"
      },
      {
        "href": "/fitness-apis/exercise-video-apis",
        "label": "Exercise video APIs"
      },
      {
        "href": "/compare",
        "label": "All API comparisons"
      }
    ],
    "cta": {
      "pitch": "Exercise video prices shift and open datasets drift - subscribe for plain-English updates when Your Move or free-exercise-db changes."
    },
    "sources": [
      {
        "url": "https://ymove.app/exercise-api",
        "checked": "2026-11-11",
        "note": "catalog figures, filming partners, FAQ"
      },
      {
        "url": "https://ymove.app/exercise-api/pricing",
        "checked": "2026-11-11",
        "note": "plans, trial, caps, self-hosting, data license"
      },
      {
        "url": "https://ymove.app/exercise-api/docs",
        "checked": "2026-11-11",
        "note": "48-hour URLs, thumbnails, muscles, caps, watermark, upgrade, changelog"
      },
      {
        "url": "https://exercise-api.ymove.app/api/v2/openapi.json",
        "checked": "2026-11-11",
        "note": "Exercise schema, version 2.5.0"
      },
      {
        "url": "https://ymove.app/terms-and-conditions",
        "checked": "2026-11-11",
        "note": "API Terms: Brand License, active subscription; general terms"
      },
      {
        "url": "https://ymove.app/exercise-api/signup",
        "checked": "2026-11-11",
        "note": "7-day trial wording"
      },
      {
        "url": "https://ymove.app/exercise-api/top-exercise-apis",
        "checked": "2026-11-11",
        "note": "vendor's own ranking, quoted for prices only"
      },
      {
        "url": "https://raw.githubusercontent.com/ymove-app/exercise-api/main/README.md",
        "checked": "2026-11-11",
        "note": "README counts, HLS + MP4, quickstart curl"
      },
      {
        "url": "https://raw.githubusercontent.com/ymove-app/exercise-api/main/free-videos/README.md",
        "checked": "2026-11-11",
        "note": "25 free sample clips"
      },
      {
        "url": "https://github.com/ymove-app/exercise-api",
        "checked": "2026-11-11",
        "note": "3 stars, 6 commits"
      },
      {
        "url": "https://github.com/ymove-app/exercise-api-sdk",
        "checked": "2026-11-11",
        "note": "MIT SDK"
      },
      {
        "url": "https://github.com/ymove-app/exercise-api-mcp",
        "checked": "2026-11-11",
        "note": "MIT MCP server"
      },
      {
        "url": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/README.md",
        "checked": "2026-11-11",
        "note": "dataset description, raw-URL hosting, incomplete fields, duplicates, provenance"
      },
      {
        "url": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/LICENSE.md",
        "checked": "2026-11-11",
        "note": "Unlicense"
      },
      {
        "url": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/schema.json",
        "checked": "2026-11-11",
        "note": "fields, muscle, equipment, category and level enums"
      },
      {
        "url": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json",
        "checked": "2026-11-11",
        "note": "counted: 876 exercises, 1,746 JPEG paths, categories, levels, null fields"
      },
      {
        "url": "https://github.com/yuhonas/free-exercise-db",
        "checked": "2026-11-11",
        "note": "stars, forks, commits"
      }
    ]
  }
];
