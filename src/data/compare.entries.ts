import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED "X vs Y" developer comparison pages (originally auto-assembled;
 * since hand-edited — edit here). Article + FAQPage (no HowTo).
 * Framed through the API/developer lens; recommends by use-case, not a single
 * winner; every volatile specific hedged "verify".
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
    "answer": "Pick Fitbit if you want backend-first, cross-platform access - it is a cloud Web API your servers call with OAuth 2.0, without the user's phone present. Pick Apple Watch via HealthKit if you are building an iOS-native app for users already in Apple Health. The single biggest developer difference: Fitbit is a cloud API, while Apple Watch has no cloud endpoint at all - its data lives on-device in HealthKit, so you must ship a native iOS app and sync it yourself. Google's Fit migration guide (updated September 10, 2026) lists the Google Health API as the recommended path for Fitbit Web API integrations, and Google's Google Health API page (read October 12, 2026) puts the legacy API's turn-off on October 30, 2026.",
    "body": "## Fitbit vs Apple Watch: the real difference for developers\n\nThis is not a \"which wristband is nicer\" question. For a developer choosing a data source, Fitbit and Apple Watch sit on opposite sides of the single biggest architectural line in wearable integration: **cloud API vs on-device store**.\n\n**Fitbit** exposes your users' data through a **cloud Web API** — a server-to-server REST interface you reach with OAuth 2.0. Your backend can pull a consented user's data without their phone being present, from any platform. **Apple Watch has no cloud API at all.** Its data lives in **Apple HealthKit**, an on-device framework on the user's iPhone. To read it you must ship a native iOS app, have the user install it and grant HealthKit permission, then sync to your own backend. Pick Fitbit if you want backend-first, cross-platform access; pick Apple Watch via HealthKit if you are building an iOS-native app for users who already live in Apple Health. Everything below follows from that split. All specifics here are as of 2026 — verify against official docs before you build.\n\n## At a glance\n\n| Dimension | Fitbit | Apple Watch (via HealthKit) |\n|---|---|---|\n| How you access data | Cloud Web API, server-to-server REST | On-device framework; **no cloud endpoint** exists |\n| Data exposed | Steps/activity, heart rate incl. HRV, sleep with stages, SpO2, cardio fitness (VO2-max estimate), Active Zone Minutes, body/weight, food/water; intraday time series | Workouts with heart-rate stream, active calories, GPS (where the workout supports it), duration, plus the broad Health data types |\n| Auth model | OAuth 2.0 with granular scopes (`activity`, `heartrate`, `sleep`, `oxygen_saturation`, `cardio_fitness`, etc.) | Per-user on-device HealthKit permission prompt; no server tokens |\n| Platform reach | Cross-platform; reachable from your backend regardless of user's OS once consented | iOS/iPadOS only; requires a native app on the device |\n| User's phone required? | No — backend can pull without the phone in-hand | Yes — data reads happen on-device, in your app |\n| Freshness | Subscriptions/webhooks on the API (verify current model post-migration) | Your app reads locally and syncs on its own schedule; background delivery is app-managed |\n| Big caveat | Legacy Fitbit Web API support ended September 30, 2026 and Google turns it off on **October 30, 2026**; the **Google Health API** is the listed path | No cloud alternative; a \"server-side Apple Watch pipeline\" always means HealthKit + your own app |\n\n## Where Fitbit wins\n\nFitbit is the choice when your architecture is **backend-first or cross-platform**.\n\n- **Server-side reach.** Because it is a real cloud API, your servers pull consented data directly. A web product with no mobile app, a nightly analytics job, or an Android-inclusive user base all work without asking the user to open anything.\n- **Broad, granular data.** Fitbit covers the mainstream metric set and offers **intraday** (high-granularity) time series for heart rate, activity, SpO2 and breathing rate. Note that intraday data for *other* users (Client/Server app types) is granted case-by-case; a developer's own data is available automatically via the \"Personal\" app type. Verify the current approval process.\n- **Standard OAuth onboarding.** Granular scopes let you request exactly the data types your app needs.\n\n**The honest trade-off:** the **Google Health API migration**. The Fitbit Web API is being replaced by the Google Health API (`health.googleapis.com`, Google OAuth). [Google's Google Health API page](https://developers.google.com/health/about) (read October 12, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026 and a full turn-off on October 30, 2026; until then the legacy API keeps running alongside its successor, but without support. [Google's Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit) (updated September 10, 2026) lists the Google Health API as the recommended path for Fitbit Web API integrations. Google's Health API migration guide says existing Fitbit tokens **cannot** be transferred, so users must re-consent via Google OAuth — budget engineering time for the re-integration, and check the [Fitbit API deprecation status](/fitbit-api-shutdown) before you schedule it. See the [Fitbit API integration guide](/integrate/fitbit-api) and, for the successor's cost picture, [Fitbit API pricing](/pricing/fitbit-api-pricing).\n\n## Where Apple Watch (HealthKit) wins\n\nApple Watch is the choice when you are building an **iOS-native experience** and want the richest first-party Apple Watch stream.\n\n- **Deep, first-party workout data.** Through HealthKit you get workouts with the associated heart-rate stream throughout, active calories, GPS where the workout supports it, and duration — plus the broad set of Apple Health data types the user has stored.\n- **You meet the user where they already are.** If your audience already logs everything into Apple Health, HealthKit reads from that single on-device store rather than asking them to connect yet another cloud account.\n- **On-device privacy model.** Health data stays in an encrypted store on the user's device; Apple runs no cloud service that aggregates it. That can be a compliance advantage for the right build.\n\n**The honest trade-off:** the **on-device, iOS-only constraint**. There is no Apple server endpoint, so you cannot pull without the user's active, on-device involvement. You must ship and maintain a native iOS app, the user must install it and grant permission, and *you* own the sync to your backend. It excludes Android users entirely. For the setup, see the [Apple HealthKit integration guide](/integrate/healthkit). If your users are on Android too, the on-device analog there is Health Connect — the trade-offs are laid out in [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect).\n\n## Which should you pick?\n\nDecide by where your app runs and how it needs the data, not by the device itself.\n\n- **Backend-first, cross-platform, or a web product with no iOS app** → **Fitbit (Google Health API).** A real cloud API is the only one of the two your servers can call directly. Just plan for the move to the Google Health API and user re-consent.\n- **iOS-native app, users already in Apple Health, and you want the richest Apple Watch workout and heart-rate stream** → **Apple Watch via HealthKit.** Accept that it is iOS-only and on-device, and that you build the app-plus-sync yourself.\n- **You need both wearable ecosystems from one integration** → neither first-party path alone covers it. A cross-device aggregator normalizes Fitbit's cloud API and HealthKit's on-device SDK behind one interface; see the [wearable data APIs](/fitness-apis/wearable-data-apis) overview. If Fitbit's migration effort is the sticking point, weigh the [Fitbit API alternatives](/alternatives/fitbit-api-alternatives).\n\n## Honest close\n\nThe clean mental model — Fitbit is a cloud API your backend can call, Apple Watch is an on-device store you read through a native iOS app — is the durable part. The volatile part is Fitbit's move to the Google Health API, which rewrites endpoints and auth; Google lists the legacy API's turn-off for October 30, 2026. Re-open the official Fitbit, Google Health, and Apple HealthKit developer docs and confirm the current specifics before you build or budget against them.",
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
        "a": "Yes. The Fitbit Web API is being replaced by the Google Health API (health.googleapis.com, Google OAuth), which Google's Fit migration guide (updated September 10, 2026) lists as the recommended path for Fitbit Web API integrations. Google's Google Health API page (read October 12, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026 and a full turn-off on October 30, 2026, after which it no longer syncs data. Google's Health API migration guide says existing Fitbit tokens cannot be transferred, so users must re-consent via Google OAuth."
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
    "body": "## How to compare Strava and Garmin Connect\n\nThree things decide this head-to-head. Weigh them in this order:\n\n- **Access friction.** Strava is self-serve OAuth you can start today if you hold a Strava subscription; Garmin's Health API access is gated behind approval into its developer program, which since October 2026 starts at Starter Access. This is the single biggest practical difference between them.\n- **Data-model fit.** Strava's edge is its social layer — segments, segment efforts, kudos, and cross-brand activity aggregation. Garmin's edge is depth of first-party device metrics from hardware it makes. Match the API to the data your product actually needs.\n- **Rules and roadmap.** Strava's API Policy, effective June 1, 2026, lets an app show Strava data only to the athlete who provided it and forbids using Strava data in connection with the development, training, evaluation or operation of any AI application — directly relevant if you are building an AI fitness product — and its getting-started guide calls a Strava subscription a prerequisite for creating an app. Garmin's program is approval-gated, and its API pages mark some features, enhanced beat-to-beat interval and ping/pull delivery among them, as supported with Enterprise Access only. Both affect whether you can ship on your timeline.\n\nA note on the approval and policy items throughout this page: they are factual access constraints, not a knock on either product. A tighter gate or usage rule often reflects stricter user-data handling.\n\n## Strava vs Garmin Connect at a glance\n\n| Dimension | Strava API | Garmin Connect Developer Program |\n|---|---|---|\n| Data exposed | Activities (GPS, distance, pace, elevation), segments and segment efforts, athlete profile, social graph, activity streams; aggregates many device brands | First-party device metrics via Activity API (detailed activities, 100+ types) and Health API (heart rate, HRV, sleep, steps, stress, Body Battery, VO2 max, respiration) |\n| API access | Self-serve `OAuth 2.0` once you hold a Strava subscription; new apps start in single-player mode, and more than 10 athletes needs Strava's review | Approval required; full health-data push requires acceptance into the program; Starter or Enterprise Access |\n| User requirement | Any Strava account (users can sync many brands of device into it); Standard Tier apps may require specified end users to hold an active Strava subscription | A Garmin device, bought outright (no recurring membership needed for data) |\n| Freshness | `OAuth`-authorized pulls plus webhook events when an activity is created, updated or deleted and when an athlete revokes access | Server push (ping/notification) to approved partners |\n| Cost model | No charge for API access under Strava's API Agreement, effective June 1, 2026; a Strava subscription is a prerequisite for creating an app | No price published for Starter Access; Enterprise commercial terms are tailored, per Garmin's overview |\n| Watch out | Strava data may be shown only to the athlete who provided it and may not be used in developing, training, evaluating or operating any AI application; default limits of 200 requests per 15 minutes and 2,000 a day | Approval with no stated review time; some features Enterprise-only |\n\n## Where Strava pulls ahead\n\nThe case for Strava over Garmin comes down to time-to-first-call and its social data. You can register an app and start pulling with self-serve `OAuth 2.0` without waiting on anyone — the on-ramp Garmin does not offer. Its API exposes activities with full GPS and route detail, per-activity streams, and the data no first-party device API has: segments, segment efforts, kudos, and the athlete social graph. Because Strava aggregates activities synced from many device brands, one integration reaches users regardless of what watch they wear, rather than a single manufacturer's hardware. The trade-offs that decide it against Garmin: Strava's getting-started guide calls a Strava subscription a prerequisite for creating an app, and its API Policy, effective June 1, 2026, makes Standard Tier apps subject to subscription requirements for the developer or specified end users; the same policy lets you show Strava data only to the athlete who provided it, and — critically for an AI fitness product — forbids using Strava data in connection with the development, training, evaluation or operation of any AI application. If your product is social, route-, or segment-driven and does not depend on training models on the data, Strava is the faster API to build on. See the [Strava API integration guide](/integrate/strava-api) and [Strava API pricing](/pricing/strava-api-pricing) for current specifics.\n\n## Where Garmin pulls ahead\n\nGarmin wins on metric depth and on the owned-device model, not on ease of entry. Its split of an Activity API (detailed activities such as running, cycling and swimming, with GPS and session detail) and a Health API (all-day summaries — heart rate, HRV, sleep, steps, stress, Body Battery, VO2 max, respiration) reaches further into first-party physiology than Strava's activity-and-social layer does. Because it comes straight from hardware Garmin makes, the metric set is broad and the device-level detail is richer than Strava's aggregated view. The user side is simpler too: a Garmin owner buys the device outright, with no recurring membership required for data to flow. The gate is the catch. Full server-side access needs Garmin's approval, not a self-serve credential; since October 2026 Garmin's program FAQ describes Starter and Enterprise Access and no longer states a review time. Garmin's pages state no price for Starter Access and say Enterprise commercial terms are tailored to business and technical requirements. Confirm you can actually get approved before you design around Garmin's data — see the [Garmin API integration guide](/integrate/garmin-api) for what the program involves.\n\n## Which should you pick?\n\nMatch the API to your use-case rather than hunting for a single winner:\n\n- **If you need a fast, self-serve start with social, segment, and route data across many device brands** → pick Strava, but budget for the Strava subscription its getting-started guide requires to create an app, and confirm its display and AI-use rules fit your product.\n- **If you are building an AI or ML fitness product that trains on user activity data** → Strava's API Policy is a direct blocker: it forbids using Strava data in connection with the development, training, evaluation or operation of any AI application. A first-party source with compatible terms may fit better.\n- **If you need the deepest first-party device metrics** (Body Battery, VO2 max, HRV, all-day health) and your users own Garmin hardware → pick Garmin, but confirm first that you can clear Garmin's approval at the access level you need.\n- **If you want to avoid single-vendor access friction entirely** → an aggregator that normalizes many sources behind one integration can spare you separate builds, but it does not sidestep Strava's rules: Strava's API Policy prohibits operating, offering or facilitating an aggregator that re-exposes its API to third parties; see [wearable data APIs](/fitness-apis/wearable-data-apis) and [Garmin API alternatives](/alternatives/garmin-api-alternatives).\n\n## Watch the fine print\n\nAccess models, fees, rate limits, usage rules, and program status in this category shift often. The Strava terms above are as Strava's pages stated them on October 17, 2026, in its API Agreement and API Policy, both effective June 1, 2026; the Garmin terms are as Garmin's reorganised program pages stated them on October 22, 2026. Garmin publishes no developer price at all, so get its terms in writing. Confirm the current fee, usage terms, rate limits, and program availability in each provider's primary developer docs before you build, especially for anything running at scale.",
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
    "answer": "Pick the Fitbit API when you want broad mainstream coverage, a large install base, and high-frequency intraday time series; pick the Oura API when your app centers on sleep architecture, readiness, HRV, and body-temperature trends. Both are cloud REST APIs behind OAuth 2.0, so you pull server-side without the user's phone in hand. The biggest developer difference is breadth versus depth plus the user requirement: a Fitbit device with a large base, versus an Oura ring plus a membership for full data. Two roadmap items: Google's Google Health API page (read October 12, 2026) lists the turn-off of Fitbit's legacy Web API for October 30, 2026, with the Google Health API as the path, and Oura's API spec says personal access tokens were deprecated in December 2025 and are no longer available, leaving OAuth.",
    "body": "## How to compare Fitbit and Oura\n\nThree questions decide this head-to-head. Weigh them in this order:\n\n- **Data-model fit.** Fitbit is broad and mainstream; Oura is narrow but deep on recovery. Match the API to the metric your product actually needs — a mass-market activity app and a sleep-science app want different sources.\n- **User requirement.** A Fitbit user needs a Fitbit device; an Oura user needs a ring, and full Gen3+ data requires an Oura membership. That membership gate means not every ring owner returns complete data.\n- **Roadmap and access.** APIs move. Fitbit's legacy Web API is mid-migration to the Google Health API, with a turn-off Google lists for October 30, 2026, and Oura deprecated personal access tokens in December 2025 in favor of OAuth. Both affect how you integrate this year.\n\n## Fitbit API vs Oura API at a glance\n\n| Dimension | Fitbit | Oura |\n|---|---|---|\n| Data exposed | Broad: steps/activity, HR + HRV, sleep with stages, `SpO2`, VO2-max estimate, Active Zone Minutes, body/weight, food/water; intraday time series | Focused: sleep architecture, readiness, HRV, temperature deviation; plus activity, HR series, workouts, `SpO2` |\n| API access | `OAuth 2.0`, granular scopes; intraday for other users granted case-by-case (verify) | `OAuth 2.0` Authorization Code, scoped Bearer tokens; PATs deprecated December 2025 and no longer available |\n| User requirement | Owns a Fitbit device; large mainstream base; some insights may sit behind Premium (verify) | Owns an Oura ring; full data requires an Oura membership |\n| Freshness / webhooks | Subscriptions API for push notifications | Webhook subscriptions per data type and event (create/update/delete) |\n| Roadmap | Google Health API is the recommended path; legacy Web API support ended Sept 30, 2026 and it turns off Oct 30, 2026; tokens cannot be transferred | Stable v2 API, the only integration point since V1 was sunset; OAuth-only since PATs were deprecated in December 2025 |\n| Cost model | No published per-call API fee found; confirm commercial terms in the developer docs — verify | No published per-call API fee; end-user cost is ring plus membership — verify current pricing |\n\n## Where Fitbit pulls ahead\n\nThe case for Fitbit over Oura is reach and resolution. Its data types span steps and activity, heart rate with HRV, sleep with stages, `SpO2`, a VO2-max estimate, Active Zone Minutes, and body and nutrition logs — the broad surface a general wellness app draws on. For products built on high-frequency signals, Fitbit exposes intraday time series for heart rate, activity, `SpO2`, and breathing rate, which Oura's daily-summary framing does not match for granularity. The device base is broadly mainstream, so you reach more users. The trade-offs that count against it: intraday data for *other* users is unlocked case-by-case rather than by default on the Client/Server app types, and the whole integration surface is changing — the legacy Web API is being replaced by the Google Health API on Google `OAuth 2.0`, and Google's Health API migration guide says existing tokens cannot be transferred, so users re-consent. [Google's Google Health API page](https://developers.google.com/health/about) (read October 12, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026 and a full turn-off on October 30, 2026, and [Google's Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit) (updated September 10, 2026) names the Google Health API as the recommended path — see [Fitbit API deprecation status](/fitbit-api-shutdown). If you can absorb that migration, Fitbit is the broader, higher-volume source. See the [Fitbit API integration guide](/integrate/fitbit-api) for the setup path.\n\n## Where Oura pulls ahead\n\nOura wins on depth in one lane: sleep and recovery. Its v2 API returns sleep with stages, HRV, and respiratory rate; a daily readiness score with contributors like HRV balance, resting-heart-rate trend, and body-temperature deviation; plus heart-rate series, workouts, sessions, and `SpO2`. The body-temperature reading is reported as a nightly deviation from the user's own baseline rather than an absolute value — a strong signal for cycle or illness features that Fitbit's broad set does not frame the same way. [Building a cycle tracking app](/build/cycle-tracking-app) treats a temperature signal like this as an optional input rather than a dependency. Access is clean OAuth 2.0 with scoped Bearer tokens and per-data-type webhooks. The catches are real: users skew premium (a ring plus a membership), so your addressable base is smaller and data completeness varies with who actually subscribes, and Oura's API spec says personal access tokens were deprecated in December 2025 and are no longer available for use, so integrations must use OAuth. The [Oura API integration guide](/integrate/oura-api) covers the OAuth flow. For Python scripts, [oura-ring vs oura](/libraries/compare/oura-ring-vs-oura-python) compares the two third-party clients and their OAuth2 support.\n\n## Which should you pick?\n\nMatch the API to your build rather than hunting for a single winner:\n\n- **If you need broad coverage, a big user base, and intraday high-frequency data** server-side → pick Fitbit, and plan for the Google Health API migration and user re-consent.\n- **If your product is about sleep architecture, readiness, HRV, or temperature trends** → pick Oura, and accept a smaller premium, membership-gated audience in exchange for depth.\n- **If you want the widest addressable install base** → Fitbit's mainstream reach is the stronger fit; Oura's ring-plus-membership requirement narrows who returns complete data.\n- **If you want both breadth and depth without maintaining two integrations** → an aggregator can normalize Fitbit, Oura, and other sources behind one API. See [wearable data APIs](/fitness-apis/wearable-data-apis) for that route.\n\n## Watch the fine print\n\nPricing models, membership and Premium gating, PAT deprecation, and migration dates in this category shift often. Everything volatile above — which fields sit behind Fitbit Premium or an Oura membership — is flagged \"as of 2026, verify.\" Confirm the current terms in each provider's primary developer docs before you build, especially for anything running at scale.",
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
        "a": "Yes. Google's Fit migration guide (updated September 10, 2026) lists the Google Health API, on Google OAuth 2.0, as the recommended path for Fitbit Web API integrations. Google's Google Health API page (read October 12, 2026) lists end of support for the legacy API on September 30, 2026 and a full turn-off on October 30, 2026, after which it no longer syncs data. Google's Health API migration guide says existing tokens cannot be transferred, so users re-consent."
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
        "a": "Garmin does not say. Its program FAQ, read on October 17, 2026, said there were no licensing or maintenance fees for access, with licence fees for some metrics used commercially. The reorganised pages read on October 22 state no price for Starter Access, say Enterprise commercial terms are tailored, and mark enhanced beat-to-beat interval as supported with Enterprise Access only. Get terms in writing."
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
    "metaTitle": "Terra vs ROOK: Which Health Data Aggregator API?",
    "metaDescription": "Terra vs ROOK as of October 2026: credits per connected source vs active-user plans from $399, coverage, own-credential providers, labs and delivery.",
    "updated": "2026-10-17",
    "answer": "Terra and ROOK both connect wearables and phone health stores through one API and both now publish prices, so the decision is about the billing unit and the extras. ROOK's Core plan is $399 a month for up to 750 active users, with Core+ at $999 for 5,000 and Business at $1,999 for 15,000, and it adds medical-device readings, lab-report parsing and a 0 to 100 health score. Terra starts at $399 a month billed annually with 100,000 credits, charges per connected data source and per event past a free allowance, and adds lab ordering in the US and UK plus delivery straight into databases and queues. Both require your own developer accounts for some providers, including WHOOP, Strava and Dexcom; all of this is as of October 17, 2026.",
    "body": "Both are single-integration aggregators, so this is not a \"which has an API\" question; it is which billing unit, delivery model and extras fit your app. Everything below is from Terra's and ROOK's own pages as we read them on October 17, 2026. An earlier version of this page described both vendors' pricing as unpublished, called ROOK wearables-only, and repeated a Latin America positioning and a third-party per-user price estimate; the current pages publish prices, show ROOK selling medical-device and lab-report APIs, and say nothing about Latin America, so those claims are gone.\n\n## At a glance\n\n| Dimension | Terra | ROOK |\n|---|---|---|\n| Coverage claim | \"500+ providers\" on its site; its docs say the Unified API \"supports over 150+ Data Sources\" | \"400+ wearables and health data sources\" in its docs; \"72 data sources and more than 500 devices\" on its integrations page |\n| How sources connect | Cloud APIs from your backend; a mobile SDK for Apple Health, Samsung Health and Health Connect | Direct API integrations for cloud providers; SDKs for Apple Health and Health Connect; 59 of its 72 listed sources are Indirect, reached through those phone stores |\n| Delivery | Signed webhooks, or straight into SQL databases, Supabase, cloud storage, SQS and Kafka, MongoDB or Firestore | Webhooks or API queries |\n| Beyond wearables | Lab test ordering (US and UK), DNA tests, a lab-report parsing API, streaming, planned workouts | Medical Device API, Lab Data API (report parsing), EHR/EMR API on a waitlist, a 0 to 100 health score |\n| Entry price | $399 a month billed annually ($499 monthly), 100,000 credits | Core at $399 a month for up to 750 active users |\n| How the bill grows | 200 credits per connected data source per month; extra credits from $0.005 | Core+ $999 (5,000 users), Business $1,999 (15,000), Enterprise custom |\n| Contract | 30-day money-back guarantee on Quick Start | Standard term 12 months, cancel with 30 days' notice |\n| Your own provider accounts | Its docs name WHOOP, Dexcom, Huawei, Strava and Virtuagym; its integrations table also marks Garmin and Samsung as Required | Dexcom, Samsung Health, Strava and WHOOP |\n\n## Where Terra wins\n\n**Delivery options and lab ordering.** Terra pushes every payload to a destination you choose, and its webhooks are signed: \"Every webhook sent by Terra includes an HMAC-based signature header\". Beyond webhooks it can write straight into \"SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore\". It also orders lab tests (\"Nationwide US, plus the UK\") and DNA tests, which we did not find on ROOK's pages; ROOK parses lab reports your users already have.\n\n**Breadth claims.** Terra's catalog claim is larger, and its FAQ lists Garmin, Fitbit, Apple Watch, Oura Ring, WHOOP, Polar, Samsung Health, Withings, Suunto and Wahoo among sources. Both vendors count differently, so check your users' devices in each live list.\n\n**The trade-off.** Terra's unit is the connected data source, not the person: \"An active authentication is one connected data source for one end user, and costs 200 Unified API credits per month\". A user with a watch and a ring costs twice. See the [Terra integration guide](/integrate/terra-api) for the build.\n\n## Where ROOK wins\n\n**A bill you can read off one table.** ROOK prices by plan and active users, and its pricing page lists each ceiling: Core $399 a month for up to 750 active users, Core+ $999 for up to 5,000, Business $1,999 for up to 15,000. At 1,000 users that is $999 on Core+, against about $899 on Terra by our arithmetic; at 5,000 users ROOK's Core+ is still $999 while Terra is about $4,899, assuming one source per person and annual billing. Past a plan's ceiling, ROOK says \"billing adjusts based on usage\" without a published rate.\n\n**Medical devices and lab reports.** ROOK's Medical Device API delivers \"glucose, blood pressure, oxygen saturation, temperature and ECG readings in one format, with the device that recorded each one\", and its Lab Data API \"turns PDF and image lab reports into structured biomarkers with LOINC codes and FHIR R4 output\". Its EHR/EMR API, a waitlist item on the pricing page, delivers wearable data to clinical systems as FHIR R4.\n\n**A score and an app.** ROOK Score gives \"a simple score, ranging from 0 to 100\", and the ROOK App \"lets end users connect supported sources without embedding the SDKs\", useful for programs without their own mobile app.\n\n**The trade-off.** The standard contract term is 12 months, and add-ons cost extra on Core: Business and Enterprise include every product and add-on, while Core+ includes three.\n\n## What we could not verify\n\n- **ROOK webhook signing.** The ROOK pages we read describe webhook delivery but not a signature scheme; check the docs before you rely on one.\n- **Overage rates.** Neither ROOK's usage rate past a plan's ceiling nor Terra's Enterprise terms are published.\n- **What \"500 devices\" means.** ROOK's own pages give two counts, 400+ sources in the docs and 72 sources with 500+ devices on the integrations page.\n\n## Which should you pick?\n\n- **Many users, mostly one device each, and a budget you want flat:** lean ROOK; its active-user ceilings are easier to plan against than per-source credits at a few thousand users.\n- **Users who connect several sources each, or data pushed straight into your warehouse:** lean Terra for its destinations; model the per-source credits first.\n- **Lab tests ordered for your users:** Terra, which orders them in the US and the UK; ROOK parses reports users upload.\n- **Blood pressure cuffs, CGMs and ECG with the device recorded:** lean ROOK's Medical Device API.\n- **Programs without a mobile app:** ROOK App covers the phone stores for you.\n\nFor the rest of the field, see [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) and [aggregator pricing](/pricing/health-data-aggregator-pricing).\n\n## Bottom line\n\nTerra and ROOK both collapse dozens of wearable integrations into one normalized API. Terra's edge is delivery options and lab ordering; ROOK's is an active-user price sheet that stays flat longer, plus medical-device and lab-report APIs. Re-read both live pricing pages before you commit, because the numbers above are from October 17, 2026.",
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
        "note": "Rook source catalogue"
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
    "metaTitle": "Terra vs Spike Health: Aggregator API Compared",
    "metaDescription": "Terra vs Spike as of October 2026: credits from $399 a month vs a Sandbox from $450, wearables and lab ordering vs IoT, lab OCR, food photos and MCP.",
    "updated": "2026-10-17",
    "answer": "Terra and Spike both sell one API across many wearables, so the split is what else you need and how you learn the price. Pick Terra for a bill you can calculate from its pricing page (from $399 a month billed annually plus credits per connected source), lab ordering in the US and UK, and full payloads pushed into webhooks, databases or queues. Pick Spike if you also want medical IoT readings, lab-report OCR with LOINC codes, food-photo nutrition and an MCP server for LLM apps, with a dedicated implementation engineer from its Sandbox plan, which starts from $450 a month. Spike's site also carries a banner announcing that Raintree Systems acquires Spike Technologies, so ask about roadmap and contract terms; all of this is as of October 17, 2026.",
    "body": "Already chose Terra and need to wire it up? The [Terra API integration guide](/integrate/terra-api) covers authentication, the widget session and webhook delivery.\n\n## Terra vs Spike Health, for developers\n\nBoth Terra and Spike are **health-data aggregators**: one integration, a normalized feed from many sources, instead of a separate OAuth flow and schema per wearable. The difference for a build is what else each one reaches and how you learn the price. Everything here is from the vendors' own pages as we read them on October 17, 2026. An earlier version of this page said neither vendor published pricing, that Spike's own pages disagreed on its device count, and that Spike sold a generative-AI interpretation SDK and a low-code data-pipeline product. Both now publish prices, Spike's current pages agree on 500+ devices (the 200+ figure on its homepage counts customers), and we did not find the SDK or the pipeline product on the pages we read, so those claims are gone.\n\n## At a glance\n\n| Dimension | Terra | Spike |\n|---|---|---|\n| Coverage claim | 500+ providers; its docs say the Unified API \"supports over 150+ Data Sources\" | \"Access 40+ providers and 500+ devices via single SDK\" |\n| Beyond wearables | Lab test ordering (US and UK), DNA tests, lab-report parsing, streaming, planned workouts | Medical IoT devices, lab-report OCR with LOINC codes, food-photo nutrition, EMR and EHR data, voice agents for clinics |\n| AI | An MCP server (its AI Interface) | Spike MCP |\n| Delivery | Full payloads to webhooks, databases, queues or cloud storage | Webhook notifications of what changed, then query the API |\n| Webhook signature | HMAC-SHA256 in a terra-signature header | HMAC-SHA256 in an X-Body-Signature header |\n| Entry price | $399 a month billed annually ($499 monthly), 100,000 credits | Sandbox from $450 a month |\n| Onboarding | Self-serve sign-up; 24/7 engineering support on Enterprise | \"Every organization gets a dedicated implementation engineer from the sandbox level\" |\n| Ownership | No change announced on the pages we read | Its site announces \"Raintree Systems Acquires Spike Technologies\" |\n\n## Where Terra wins\n\n- **A price you can calculate.** Terra's pricing page publishes the subscription, the credit allowance and the rates: \"An active authentication is one connected data source for one end user, and costs 200 Unified API credits per month\", the first 400 events per source are free, and extra credits start at $0.005. Spike publishes a starting price and calls its pricing \"Usage-driven, transparent, and flexible\", but does not itemize how the bill grows.\n- **Full payloads, wherever you want them.** Terra sends normalized data to webhooks or straight into \"SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore\". Spike's webhook event lists the metrics and time range that changed, and you fetch the records with the API.\n- **Lab tests ordered for your users.** Terra's homepage offers blood tests \"through home kits, mobile phlebotomy, or lab walk-ins\", and its lab page says \"Nationwide US, plus the UK\". Spike's lab product parses reports users already have.\n\n## Where Spike wins\n\n- **Reach past the wrist.** Spike's homepage pitches \"normalized, ingestion-ready data from wearables, EMRs, lab tests, IoT devices, and more\", including medical IoT such as glucose monitors, ECGs and blood pressure cuffs, and its integrations page lists CGMs like Dexcom and Freestyle Libre.\n- **Lab reports and food photos.** The Lab Reports API takes \"PDFs, JPEGs, or PNG files up to 10MB\" through OCR and assigns LOINC codes \"making lab test data from any language standardized\". Its Nutrition AI turns \"any food image into complete nutritional data\".\n- **A person on your build.** \"Every organization gets a dedicated implementation engineer from the sandbox level to help with setup and optimization\", which is unusual in a category where onboarding is normally the docs.\n\n**The trade-off.** A banner on Spike's integrations and blog pages reads \"Raintree Systems Acquires Spike Technologies\". We found no further detail on Spike's own pages, so ask about roadmap and contract continuity before you sign.\n\n## Webhooks compared\n\nBoth sign every event with HMAC-SHA256. Terra's header is terra-signature, computed over the timestamp and the raw body; Spike's is X-Body-Signature, computed over the raw request body with a shared key from its admin console. Terra retries a failed delivery \"up to 10 times with exponential backoff\"; Spike will \"retry the request up to 10 times with exponential backoff\" too, then discard the event. Spike's payload is a notification (user, metrics, provider and time range), so plan an API call per event.\n\n## What we could not verify\n\n- How Spike's price grows past the Sandbox starting price.\n- Whether Spike needs your own developer credentials for any provider; its provider docs describe a user consent redirect and say nothing either way.\n- The terms and timing of the Raintree acquisition.\n\n## Which should you pick?\n\n- **Consumer fitness or wellness app reacting to new sleep, workout or recovery data:** lean Terra for the calculable bill and the push-to-destination delivery.\n- **Clinical or medical-adjacent build with lab reports, medical IoT or EMR data, or food logging from photos:** lean Spike, after confirming each capability and the post-acquisition terms.\n- **Lab tests ordered for users in the US or UK:** Terra.\n\nIf you are also weighing Terra against a labs-first option, see [Terra vs Vital (Junction)](/fitness-apis/terra-vs-vital), and for the whole field, [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis).\n\n## Honest close\n\nTerra and Spike are both single-integration aggregators, so neither saves you from the core trade: you pay to remove per-provider integration work. The split that decides it is reach and visibility: Terra publishes a price you can model and pushes full payloads, Spike reaches further into clinical data and puts an engineer on your build, at a price you learn on a call. Re-check both live pricing pages before you build; the [Terra API integration guide](/integrate/terra-api) covers the wearable side.",
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
    "metaTitle": "ExerciseDB vs wger: Which Exercise API? 6 Dimensions",
    "metaDescription": "ExerciseDB is a hosted API (free GIF tier, MP4 video on paid RapidAPI plans); wger is free, self-hosted and AGPL. Compare data, media, licensing and cost.",
    "updated": "2026-10-22",
    "answer": "Pick ExerciseDB when you want a hosted API with demonstration media and are willing to rent it: AscendAPI, its current publisher, serves 1,500 exercises with GIFs free and with no key, and ExerciseDB V2's MP4 videos for 11,000+ exercises on RapidAPI plans, free for a watermarked 200-exercise trial. Pick wger when you want to own the stack with no per-call fee and can run a Django application under AGPL-3.0-or-later, with exercise data licensed Creative Commons per entry. The deciding difference is the delivery model, rented API against self-hosted software, and the licence that comes with each. All of this was checked on October 22, 2026.",
    "body": "## First, which ExerciseDB?\n\nThe exercisedb.dev home page now reads \"Previously ExerciseDB\" above the name AscendAPI, and AscendAPI's documentation names the `ExerciseDB/exercisedb-api` GitHub repository as its own. It sells two exercise products: **ExerciseDB V1**, free with no key at `oss.exercisedb.dev` (1,500 exercises with 180p GIFs) with a paid RapidAPI tier for higher resolutions, and **ExerciseDB V2**, on RapidAPI only, with an MP4 video per exercise. An older ExerciseDB listing on RapidAPI under the publisher justin-WFnsXH_t6 also exists; we could not read it on October 22, 2026, or establish whether it is the same product. On this page, \"ExerciseDB\" means AscendAPI's products.\n\nNone of them is self-hostable. A git clone of [the exercisedb-api repository](https://github.com/ExerciseDB/exercisedb-api) on October 22, 2026 found a README and an AGPL-3.0 LICENSE and no code, so in production ExerciseDB is an API you call under AscendAPI's terms of use.\n\n## How to compare ExerciseDB and wger\n\nThree factors decide this head-to-head, in this order:\n\n- **Delivery model.** ExerciseDB is a hosted API: a key (or none, for V1 free) and you are calling it in minutes. wger is software you deploy, with a REST API you run, or a public instance at wger.de you can read.\n- **Media against ownership.** ExerciseDB's draw is media: GIFs on V1, MP4 video on V2. wger's media is community-contributed still images plus whatever videos you upload, but you own the whole stack.\n- **Licence fit.** Calling a hosted API under its terms is a different situation from deploying AGPL code; wger also splits its licensing between code and data.\n\n## ExerciseDB vs wger at a glance\n\n| Dimension | ExerciseDB (AscendAPI) | wger |\n|---|---|---|\n| Data | V1: 1,500 exercises free, \"over 2,000\" in total; V2: 11,000+ (AscendAPI's figures) | Community exercise database plus routines, nutrition (Open Food Facts) and body weight; live count not readable from our environment |\n| Media | V1: GIFs, 180p free, up to 1080p paid; V2: an MP4 per exercise plus images, watermarked on the free plan | Still images (animation rejected); video files you upload (mp4, mov, webm, ogv, ogg) |\n| Hosting / access | Hosted: V1 free tier with no key, everything else through RapidAPI | Self-host with Docker, or read the public endpoints on wger.de |\n| Cost | Free tiers (V1 keyless; V2 Basic: 2,000 requests a month, 200 exercises); paid plans on RapidAPI, prices not read | No licence or per-call fee; you pay for hosting and operations |\n| Rate limits | Free plans: 1,000 requests per hour per key; paid: \"no strict rate limit\" | Whatever you configure on your own instance |\n| Licensing | AscendAPI's terms of use (not readable from our environment); the repository's AGPL-3.0 file covers no code | Code AGPL-3.0-or-later; exercise data Creative Commons per entry; docs CC-BY-SA-4.0 |\n\nFor what each plan costs, see [exercise database API pricing](/pricing/exercise-database-api-pricing).\n\n## Where ExerciseDB pulls ahead\n\nTime to first call and media. V1's free tier answers without a key, and V2 hands you an MP4 demonstration, multi-resolution images, `overview`, `exerciseTips`, `variations` and `relatedExerciseIds` for each exercise, which wger has no equivalent for. AscendAPI also states a much larger catalog. The trade: you rent the data. Paid prices sit on RapidAPI listings we could not read, the free tiers come with terms we could not read either, and your app depends on someone else's service. For [exercise APIs with video](/fitness-apis/exercise-video-apis), V2 is the hosted option.\n\n## Where wger pulls ahead\n\nOwnership and no usage fees. wger's README calls it \"a free workout and fitness manager\" with a \"REST API for third-party integrations or automations\", and self-hosting \"is basically just a `docker compose up -d` away\". In its code the exercise endpoints are commented \"Everybody can read\", and every exercise, image and video carries its own licence, author and source fields, so attribution travels with the data. The trade-offs: you operate a whole application, its media is lighter than ExerciseDB's, and the licensing needs attention. The code is AGPL-3.0-or-later, the data is \"Creative Commons (see individual entries)\", and new image uploads default to CC-BY-SA 4.\n\n## The AGPL copyleft question (read before you self-host)\n\nThis applies to wger's code. AGPL-3.0 is strong copyleft with a network clause: if you modify AGPL-covered code and let users interact with it over a network, you must offer them the modified source under AGPL.\n\n- **Calling a hosted API over HTTP** does not by itself make your app a derivative work, which is why ExerciseDB, used as a hosted API, raises a terms-of-use question rather than a copyleft one.\n- **Self-hosting and modifying** wger is what can trigger the source-disclosure obligation for a closed-source service. Running it unmodified, or reading its public API, is a different situation.\n- **The data is separate.** wger's Creative Commons data brings attribution and, for CC-BY-SA entries, share-alike, whichever way you get it.\n\nThis is general guidance, not legal advice; have counsel review your setup.\n\n## Which should you pick?\n\n- **You want GIF or video demonstrations fast from a hosted key** → ExerciseDB. Prototype on V1's free tier or V2's Basic plan, then read the paid prices and terms on RapidAPI.\n- **You want full data ownership, no per-call fees and control of the stack**, and can comply with AGPL (code) plus Creative Commons (data) → wger. ExerciseDB offers no self-host path. If wger's AGPL code or share-alike data is the blocker, see the [wger alternatives](/alternatives/wger-alternatives).\n- **You want data you own with no licence strings at all** → neither; free-exercise-db is public domain. See [ExerciseDB vs free-exercise-db](/compare/exercisedb-vs-free-exercise-db).\n\nThe whole category is compared in [exercise database APIs](/fitness-apis/exercise-database-apis), and setup on the hosted path is in the [ExerciseDB integration guide](/integrate/exercisedb-api).\n\n## Watch the fine print\n\nThis page was re-checked on October 22, 2026 against AscendAPI's documentation and home page, and against the wger and exercisedb-api repositories. AscendAPI's paid prices, its terms of use and the older RapidAPI listing could not be read, and wger.de's bot check kept us from counting its live catalog. Confirm the current terms and the licence on the exact data you ship before you build.",
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
        "note": "README, licences, API permissions, licence fields, image and video models"
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
    "metaDescription": "KinesteX vs Sency for AI motion tracking: WebView embed vs native SDK, platforms, licences, prices and what we could verify. KinesteX funds this site.",
    "updated": "2026-10-18",
    "answer": "KinesteX (this site's own product) and Sency are both AI motion tracking SDKs for fitness apps, and the honest difference is architectural, not better-versus-worse: KinesteX embeds a hosted camera experience via WebView or iframe with prebuilt workout content, views and a content API across iOS, Android, React Native, Flutter and the web, while Sency's SMKit is a native no-UI SDK, plus a branded UI kit, for iOS, Android, React Native and Flutter, where you own the camera preview and UI. Pick KinesteX if you need a web surface or want content and gamified experiences shipped in the box; pick Sency if you need native rendering and full UI control with no embedded web experience. Sency lists plans and prices, from a free Starter tier to a Growth plan from $499 a month, while KinesteX publishes no prices; no accuracy claim on either side has been independently benchmarked, so test both against your own movements before committing.",
    "faqs": [
      {
        "q": "Is KinesteX a native SDK like Sency's SMKit?",
        "a": "No, and this is the core difference. KinesteX's public repos describe its SDKs as WebView and iframe wrappers that embed a hosted camera workout experience, communicating via postMessage events plus a content REST API. Sency's README describes its core SMKit as a native no-UI SDK where the developer owns the camera preview and UI in the Custom Kit. Neither shape is wrong — a hosted experience ships faster with content included, while a native SDK gives you full rendering control."
      },
      {
        "q": "Does Sency support web or JavaScript apps?",
        "a": "Not per its own public documentation: Sency's platform table in the smkit-sdk README lists iOS, Android, React Native and Flutter, and marks JavaScript and Unity as NA. KinesteX publishes HTML and JavaScript iframe, PWA and React TypeScript integrations for browser-based products. If your product includes a web surface, that gap currently decides the comparison on its own — but re-check Sency's repos before ruling it out, since platform tables change."
      },
      {
        "q": "How much do KinesteX and Sency cost?",
        "a": "KinesteX publishes no price list, so this page will not guess its number: access goes through a contact form and API key, and its FAQ describes usage-based pricing per active user per month that falls at higher tiers, with possible integration fees. Sency's pricing packages page lists a free Starter plan for up to 100 monthly active users, a Growth plan from $499 a month for up to 3,800 and a Customized plan on request, though its main pricing page describes the first 100 users as a paid tier after a free trial. Get a written quote from both before you budget."
      },
      {
        "q": "Are KinesteX or Sency open source?",
        "a": "Neither product is open source, though the repo licensing differs. Most KinesteX wrapper and demo repos (Swift, Kotlin, React Native, HTML-JS) carry an Apache-2.0 LICENSE, but the hosted experience behind them is a commercial, API-key-gated service, and the Flutter, SwiftUI-kit and PWA repos have no LICENSE file. Sency's repo LICENSE is its own proprietary Terms of Use, which puts commercial use under a separate paid agreement. In both cases you are buying a commercial service; the public repos are integration code, not the product."
      },
      {
        "q": "Which is more accurate, KinesteX or Sency?",
        "a": "Unknown, and be wary of anyone who answers confidently — including us, since KinesteX funds this site. KinesteX's README claims its models consistently exceed 90% accuracy and its FAQ claims 97.2%, which are first-party marketing lines, not independent benchmarks, and they do not agree with each other. Sency publishes no comparable figure in its public repos or on its pricing and FAQ pages, though its FAQ calls its accuracy unmatched. No independent accuracy comparison of the two exists that we could verify, so run both SDKs on your actual exercises, devices and lighting conditions before deciding."
      }
    ],
    "cta": {
      "pitch": "We compare motion tracking SDKs the same way we compare everyone else's APIs — from public repos, with the gaps and our own conflicts labeled — so subscribe and get the next teardown before you sit through a sales demo."
    },
    "body": "**Disclosure: KinesteX is this site's own product.** AIFitnessAPI is funded by KinesteX, so treat this page the way you would treat any first-party comparison — skeptically. To keep it honest, every factual claim below traces to the two vendors' public GitHub repositories, their package registries, or their own published pages as fetched on October 17 and 18, 2026; marketing claims are quoted as marketing; everything we could not verify is called out plainly, including accuracy for both vendors; and Sency's real strengths get their own section, not a token nod. The disclosure is checked at build time too: [the list of automated refusals that run before this site deploys](/gates) includes a check that fails any page linking to the site's funder without one.\n\n## How to compare KinesteX and Sency\n\nBoth products sell the same promise — AI motion tracking for fitness apps through a phone camera, no extra hardware — and both use nearly identical category language (\"AI motion analysis SDK\" for KinesteX, \"AI motion analysis technology\" for Sency). Three things actually separate them, and all are verifiable:\n\n- **Integration architecture.** KinesteX's SDKs embed a hosted web experience: its SwiftUI kit README describes \"a SwiftUI package that embeds KinesteX's AI-powered camera workout experience as a WebView,\" the web integration is an iframe, and the React Native SDK needs `react-native-webview`. Sency's SMKit is the opposite: its version table calls the core iOS kit a \"Native no-UI SDK\" — a native library where, in the Custom Kit, the developer owns the camera preview and all UI.\n- **Platform coverage.** KinesteX publishes SDKs for iOS, Android, React Native, Flutter and the web (HTML and JavaScript, PWA, and a React TypeScript package). Sency's platform table covers iOS, Android, React Native and Flutter — and explicitly marks JavaScript and Unity as \"NA.\"\n- **What ships in the box.** KinesteX bundles content and prebuilt experiences (workout, plan, challenge and leaderboard views plus a content API). Sency's README centers on assessments, progress evaluations and personalized workout plans, delivered either as a white-label Branded Kit (SMKitUI) or a no-UI Custom Kit (SMKit).\n\nEverything on this page comes from places you can audit yourself: the [KinesteX GitHub org](https://github.com/KinesteX) and the [Sency GitHub org (sency-ai)](https://github.com/sency-ai), npm and pub.dev, and each company's own site. Where a fact could not be verified, the table says so instead of guessing.\n\n## KinesteX vs Sency at a glance\n\n| Dimension | KinesteX | Sency | Verified from |\n|---|---|---|---|\n| Integration surface | WebView and iframe wrappers around a hosted camera experience, with postMessage events and a content REST API | Native SDK; core SMKit is a \"Native no-UI SDK\"; SMKitUI adds prebuilt white-label UI | KinesteX AI-Kit, PWA and org READMEs; Sency smkit-sdk README |\n| Platforms | iOS, Android, React Native, Flutter, web (HTML and JS iframe, PWA, React TypeScript) | iOS, Android, React Native, Flutter; JavaScript and Unity marked \"NA\" | KinesteX docs; Sency README platform table |\n| Product tiers | Plug-and-play views (category, plan, workout, challenge, leaderboard, experience) or a custom camera component plus content API | Branded Kit (SMKitUI, \"quick, low-code\") or Custom Kit (SMKit, no predefined UI) | KinesteX docs and Swift-Demo integration docs; Sency smkit-sdk README |\n| Stated features | Real-time reps, mistakes, posture alignment, calories; assessments (TUG, gait speed, sit-to-stand, balance stands and more); white-label theming | Movement and fitness assessments, monthly progress evaluations, personalized workout plans; Body Calibration, Adaptive ROM, Session Lifecycle in the iOS docs | Each vendor's own READMEs — vendor statements, not tested by us |\n| Data events | Per-rep events with reps, calories, a mistakes array and per-rep accuracy; workout summary scores | Session lifecycle, body calibration and result data types documented in the iOS demo | KinesteX org README; Sency smkit-ios-demo README |\n| Where the models come from | Not stated in the repos; KinesteX's security page says its cloud delivers content and AI models and the SDK runs pose estimation on the device | Downloaded from Sency's server at configuration, no bundled fallback; a valid cache can be used offline later; its FAQ says data is analyzed on the user's device and never sent to the cloud | KinesteX security page; Sency iOS and Android demo READMEs and FAQ |\n| iOS floor | iOS 14 (Package.swift and docs) | iOS 16 for the Custom Kit demo Podfile; iOS 15 or later for SMKitUI | Package.swift and KinesteX docs; Sency demo READMEs |\n| Distribution | SPM, JitPack, npm (kinestex-sdk-react-native 1.4.1, 2026-10-09), pub.dev (kinestex_sdk_flutter 1.5.1, 2026-07-04) | CocoaPods and SPM from a Sency Bitbucket repo; Maven; npm (@sency/react-native-smkit-ui 2.4.3, 2026-09-23); pub.dev (flutter_smkit_ui 1.6.0, 2026-09-23) | Public registries, both vendors' repos |\n| Repo license | Apache-2.0 LICENSE in the Swift, Kotlin, React Native, HTML-JS and demo repos; none in the Flutter, SwiftUI-kit and PWA repos; the hosted service itself is commercial (API key required) | Proprietary — the repo LICENSE file is \"Sency Terms of Use\" (2022), and commercial or production use needs a separate paid service agreement. Not open source | Raw LICENSE fetches from both orgs |\n| Repo activity | Pushes through 2026-10-14 (Kotlin) and 2026-10-09 (React Native) | Demo repos pushed through 2026-09-23 | GitHub, both orgs |\n| Pricing | No price list. KinesteX's FAQ describes usage-based plans priced per active user per month that fall as you reach new tiers, and says integration fees may apply; access via contact form and API key | Published, on two pages that differ: a packages page lists Starter free up to 100 monthly active users, Growth from $499 a month up to 3,800 and Customized on request; the main pricing page describes a free trial, then a minimal monthly fee covering up to 100 active users | KinesteX FAQ and docs; Sency's two pricing pages |\n| Accuracy | Not verified. KinesteX claims its models \"consistently exceed 90% accuracy\" (README) and \"97.2% accuracy\" (FAQ) — first-party marketing lines, not independent benchmarks | Not verified. No accuracy figure in Sency's repos or on its pricing pages; its FAQ calls its accuracy \"unmatched\" without a number | Neither vendor's accuracy has been independently tested here |\n\n## What we could not verify — for either vendor\n\nBeing straight about the gaps matters more on a first-party page, so here they are:\n\n- **Prices, for both, in different ways.** KinesteX publishes no price list: its FAQ describes the model — usage-based, per active user per month, lower per-user rates at higher tiers, possible integration fees, no termination penalties — but gives no figure, and access starts with a contact form. Sency does publish plans, but its two pricing pages disagree about the start: its packages page lists a free Starter plan for up to 100 monthly active users and a Growth plan from $499 a month for up to 3,800, while its main pricing page describes a free trial followed by a \"minimal monthly fee\" that includes up to 100 active users. The packages page also does not say how Growth's $499 base and its $0.79 per-active-user rate combine. Budget for a conversation with both.\n- **Accuracy, for both.** No independent accuracy benchmark exists for either SDK that we could verify. KinesteX's two figures — above 90 percent in a README, 97.2 percent in its FAQ — are its own marketing claims, and they do not even agree with each other; Sency makes no comparable public claim. Do not choose between these products on accuracy claims — run both on your own movements and lighting conditions.\n- **On-device processing, for KinesteX.** KinesteX's security page says \"All camera and vision processing stays on-device\", while its SDK READMEs still say \"optional edge processing (no cloud transmission)\". The two statements are not the same promise, so get the behaviour of your configuration in writing.\n- **Sency's Android floor.** Its Android demo app builds with minSdk 24; we found no separate statement of SMKit's own minimum.\n\n## Where KinesteX wins\n\nKinesteX's edge is coverage and content. It is the only one of the two with a web story: its documentation covers HTML and JavaScript through an iframe, a PWA path and a React TypeScript package, where Sency's own platform table marks JavaScript \"NA\" — if your product includes a web or PWA surface, that difference is decisive on its own. Its public repos and docs also document a broader prebuilt layer — our reading of the two sets, since neither vendor publishes a feature matrix: plug-and-play workout, plan, challenge, leaderboard and gamified experience views, a content API for fetching workouts and plans, an assessment spec (timed-up-and-go, gait speed, sit-to-stand variants, balance stands), and per-rep data events. To be fair, assessments are not a KinesteX exclusive — Sency's README leads with movement and fitness assessments and personalized plans; the difference is the content-and-views layer around them. The iOS floor is lower (iOS 14 versus Sency's iOS 15 for SMKitUI and iOS 16 for the Custom Kit demo), and the wrapper code carries an Apache-2.0 license where LICENSE files exist — though be clear-eyed that the hosted experience behind the wrapper is a commercial, API-key-gated service either way, and that the WebView architecture means your workout screen is a hosted web app, not native rendering you control.\n\n## Where Sency wins\n\nSency's edge is architectural, and it is a real one: SMKit is a native SDK, not a WebView. Its version table says it plainly — the core iOS kit is a \"Native no-UI SDK\" — and its iOS demo says the developer owns the camera preview, session lifecycle, exercise UI, skeleton rendering and results. If you are building a polished native experience where the workout screen must match your design system frame-for-frame, integrate with your own rendering pipeline, or avoid embedding a hosted web experience inside your app, Sency's shape is simply the right shape and KinesteX's is not. The iOS demo docs go deeper on native concerns than anything comparable in KinesteX's public repos — Body Calibration, Adaptive ROM and Session Lifecycle are documented as first-class SDK concepts. Sency also offers a genuine two-tier choice within the same native architecture: a low-code Branded Kit when you want speed, and the no-UI Custom Kit when you want control. It is more transparent about price than we are: its packages page lists plans with prices — a free Starter plan for up to 100 monthly active users and a Growth plan from $499 a month for up to 3,800 — where KinesteX publishes no figure at all, even if Sency's main pricing page describes the first 100 users differently. It documents an MCP server that gives AI coding tools its SDK documentation. And its repos are actively maintained, with demo and package releases through September 2026 — this is not an abandoned competitor, and we are not going to pretend otherwise.\n\n## How to choose\n\nBy use-case, not by crowning a winner:\n\n- **Your product has a web or PWA surface** → KinesteX, by elimination: Sency's platform table marks JavaScript \"NA,\" and KinesteX documents iframe integration for exactly this.\n- **You want workouts, plans, challenges and leaderboards without building content systems** → KinesteX's plug-and-play views and content API cover ground Sency's public repos do not document.\n- **You need a native, no-WebView integration where you own the camera preview and UI** → Sency's Custom Kit. That is its architecture's core promise, and KinesteX's WebView approach cannot match it.\n- **You want prebuilt UI but insist on native rendering** → Sency's Branded Kit sits exactly in that gap: white-label prebuilt UI, still a native SDK underneath.\n- **You need a number for a budget before a sales call** → Sency, not KinesteX: Sency's packages page lists Starter and Growth prices, while KinesteX publishes none. QuickPose, a third option, publishes a full per-device price list — see [Sency pricing](/pricing/sency-pricing) and [QuickPose vs Sency](/compare/quickpose-vs-sency).\n- **You are deciding whether to use either SDK or build on a raw pose model** → read [build vs buy for AI motion tracking](/motion/build-vs-buy-ai-motion-tracking) first, and [the pose estimation model comparison](/motion/pose-estimation-models-compared) for what the free model layer actually gives you. The short version: the pose model is free; the exercise logic, feedback content and UX are the product.\n- **You are earlier than a vendor decision** → the [camera pose tracking guide](/guides/camera-pose-tracking) covers the fundamentals, and [Sency alternatives](/alternatives/sency-alternatives) maps the wider field with the same disclosure as this page.\n\n## The fine print\n\nEverything above is a snapshot of two actively developed products, verified on 2026-10-17 and 2026-10-18 from public repos, registries and both vendors' own pages. Versions, platform tables, iOS floors, prices and README claims all move. Before you commit, re-check both GitHub orgs, request demo access from both vendors — KinesteX publishes no price list, and Sency's two pricing pages disagree about the first 100 users — and test each SDK against your own exercises, devices and lighting. That last step matters most: no accuracy claim on either side has been independently verified, including our own.",
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
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-10-17",
        "note": "WebView architecture, iOS 14 package floor, no LICENSE file"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-PWA",
        "checked": "2026-10-17",
        "note": "iframe and postMessage web integration, no LICENSE file"
      },
      {
        "url": "https://github.com/KinesteX/.github",
        "checked": "2026-10-17",
        "note": "postMessage events, assessment data, contact-form access"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-10-17",
        "note": "the 90% accuracy claim"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-10-17",
        "note": "optional edge processing line, Apache-2.0 LICENSE.txt, INTERNET permission"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-10-17",
        "note": "1.4.1 on 2026-10-09; react-native-webview peer dependency"
      },
      {
        "url": "https://pub.dev/packages/kinestex_sdk_flutter",
        "checked": "2026-10-17",
        "note": "1.5.1 on 2026-07-04"
      },
      {
        "url": "https://www.kinestex.com/docs",
        "checked": "2026-10-17",
        "note": "platforms, requirements, contact-form API key (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-10-17",
        "note": "pricing model answers and the 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-10-17",
        "note": "on-device processing statement (snapshot)"
      },
      {
        "url": "https://github.com/sency-ai/smkit-sdk",
        "checked": "2026-10-17",
        "note": "kits, platform and version tables, features, FAQ, Terms of Use LICENSE"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ios-demo",
        "checked": "2026-10-17",
        "note": "iOS 16.0, Bitbucket distribution, server-downloaded models, calibration, adaptive ROM, session lifecycle, MCP server"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ui-ios-demo",
        "checked": "2026-10-17",
        "note": "SMKitUI iOS 15 or later"
      },
      {
        "url": "https://github.com/sency-ai/smkit-android-demo",
        "checked": "2026-10-17",
        "note": "minSdk 24 and server-delivered models"
      },
      {
        "url": "https://www.npmjs.com/package/@sency/react-native-smkit-ui",
        "checked": "2026-10-17",
        "note": "2.4.3 on 2026-09-23"
      },
      {
        "url": "https://pub.dev/packages/flutter_smkit_ui",
        "checked": "2026-10-17",
        "note": "1.6.0 on 2026-09-23"
      },
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-10-18",
        "note": "Starter, Growth and Customized plans, user limits, prices and per-user rate (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/pricing",
        "checked": "2026-10-17",
        "note": "trial, minimal monthly fee for up to 100 active users, pay-as-you-go (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/faq-motion-tracking",
        "checked": "2026-10-18",
        "note": "on-device processing and accuracy wording (read through a text reader; quotes re-checked on the page by CI)"
      }
    ]
  },
  {
    "slug": "kinestex-vs-quickpose",
    "primaryQuery": "kinestex vs quickpose",
    "h1": "KinesteX vs QuickPose: Decide by How Much You Want to Build",
    "metaTitle": "KinesteX vs QuickPose: Different Layers of the Stack",
    "metaDescription": "KinesteX vs QuickPose: a hosted coaching embed vs a MediaPipe toolkit, platforms, published prices and licences, verified. KinesteX funds this site.",
    "updated": "2026-10-17",
    "answer": "These are not the same product wearing different logos. QuickPose is a developer toolkit on top of MediaPipe and BlazePose for iOS, Android and React Native, with counters, range-of-motion measurement and overlays you place inside your own app, and it publishes per-device prices starting with a free tier for 10 devices. KinesteX (this site's own product) is an embedded coaching product whose iOS, Android, Flutter, React Native and web SDKs load a hosted camera workout experience in a WebView or iframe, plus a content API, and it publishes no prices. Lean QuickPose when you will build the experience yourself and want to start without a sales call; lean KinesteX to ship a white-label workout experience, including on the web, across every platform at once.",
    "faqs": [
      {
        "q": "Are KinesteX and QuickPose direct competitors?",
        "a": "Only partially. They meet at camera-based exercise tracking, but they sell different layers: QuickPose provides pose estimation, skeleton tracking, exercise counters and range-of-motion measurement as native building blocks with no workout content or prebuilt coaching UI in its repos, while KinesteX embeds a complete hosted coaching experience, with content, plans, leaderboards and assessments, behind a WebView or iframe. A team choosing between them is really choosing how much product to build versus configure."
      },
      {
        "q": "Is QuickPose open source?",
        "a": "The iOS repository is Apache-2.0 licensed and QuickPose's terms license the SDK under Apache 2.0 subject to the agreement, but the product is not fully open source: the SDK needs a key, the README says usage limits may apply and keys are linked to your bundle ID, and the terms say use may be subject to fees. Its paid plans are billed per monthly active device. The Android repository carries no LICENSE file, and the React Native plugin is published on npm as MIT."
      },
      {
        "q": "Does KinesteX process video on-device?",
        "a": "Its two public statements differ. The SDK READMEs say the platform ensures data security with optional edge processing and no cloud transmission, and the word optional matters; KinesteX's security page says all camera and vision processing stays on-device and that its cloud delivers content and AI models. Its Android integration asks for the INTERNET permission. If on-device processing is a compliance requirement, get the behaviour of your specific configuration from KinesteX in writing."
      },
      {
        "q": "Can I use QuickPose on Android or React Native?",
        "a": "Yes. QuickPose's documentation gives a minimum of Android API 26, with sample code needing API 28 because of CameraX, and the Android SDK is distributed through Maven. The React Native plugin, published on npm as @quickpose/react-native, provides body tracking, rep counting, range-of-motion measurement and skeleton overlays on iOS and Android; its latest version when we checked was 0.7.1, published in August 2026. The Android README's feature table lists joint positions, overlays, range of motion and the exercise counters, but not the iOS table's measuring line, gesture inputs or body-position feedback, so check the features you need on each platform."
      },
      {
        "q": "What do KinesteX and QuickPose cost?",
        "a": "QuickPose publishes its SDK prices per monthly active device: free for up to 10 devices, then from $25 a month for up to 100 devices to $1,000 a month for up to 100,000, with every SDK feature on every plan and services priced separately. KinesteX publishes no figures; its FAQ describes usage-based plans priced per active user per month that fall at higher tiers, with integration fees possible, and access starts with a contact form. Confirm current terms with both before you commit."
      }
    ],
    "cta": {
      "pitch": "Both of these products live in public GitHub repos that moved within weeks of our check — get our developer notes when platform support, licensing, or access models actually change."
    },
    "body": "**Disclosure: KinesteX funds this site. Because of that, this page holds itself to a stricter rule than usual: every claim about either vendor traces to their public GitHub repositories, package registries or their own published pages as checked on October 17, 2026, judgement calls are labelled as judgement calls, and the \"Where QuickPose wins\" section is not decorative.** Both vendors' sites were read through our source-snapshot workflow, and every passage we quote from them is re-tested against the live page by an automated check. One rule is enforced by the build itself: [the automated checks that gate every deploy](/gates) refuse a page that links to this site's funder without a disclosure beside it.\n\nThe first honest thing to say is that these two products mostly sit at different layers of the stack. QuickPose is a developer toolkit: it hands you pose estimation, skeleton tracking, rep counting and range-of-motion measurement as native building blocks, and you build the product. KinesteX is an embeddable product: its SDKs drop a complete, hosted AI coaching experience into your app, and you configure it. They overlap at \"AI watches a user exercise through a phone camera\", which is why people search this comparison, but the real question is how much of the experience you intend to build yourself. If the answer is \"all of it, from a raw model\", neither is your page; start with [build vs buy for AI motion tracking](/motion/build-vs-buy-ai-motion-tracking).\n\n## What each one is, per its own repos and pages\n\n**QuickPose** describes itself in its [iOS SDK README](https://github.com/quickpose/quickpose-ios-sdk) as providing \"developer-oriented cutting edge ML features of MediaPipe and BlazePose, with easy integration and production ready code\", aimed at faster implementation of \"pose estimation, skeleton tracking and fitness counting features into mobile applications\". The README backs that with specifics: joint positions and overlays, range-of-motion measurement for shoulders, hips, knees, back and neck, detection and counting for 20 named exercises (squat, push-up, plank, lunges, biceps curls and more), feedback events for body position and a named limb out of view, a measuring line in beta, and raised-finger and thumbs-up inputs. The Swift package ships MediaPipe lite, full and heavy libraries as modules, and QuickPose's product pages say all inference runs on the device and that no video frames are sent to a server. It runs on iOS 14.0 or later, on Android from API 26 (its sample code needs API 28), and in React Native through the @quickpose/react-native plugin. The SDK key is free to register; the README's words are \"Get your free SDK key on https://dev.quickpose.ai, usage limits may apply\". What you will not find in the repositories is workout content, plans or a prebuilt coaching UI. In our reading, QuickPose is build-assist tooling, not a turnkey experience.\n\n**KinesteX** has 11 public repositories in the [KinesteX GitHub org](https://github.com/KinesteX), covering iOS (an older Swift SDK and a newer SwiftUI kit, which KinesteX's installation docs now point to), Android, Flutter, React Native and two web integration paths, and its docs add a React TypeScript package. The integration surface is consistent and the repos are upfront about it: the SwiftUI kit README calls itself \"a SwiftUI package that embeds KinesteX's AI-powered camera workout experience as a WebView\", the web path is an iframe that communicates over `postMessage`, and the React Native SDK installs alongside `react-native-webview`. So the SDKs are thin native wrappers around one hosted web experience, paired with a content API. What ships inside that experience, per the docs: plug-and-play views for workouts, plans, challenges, leaderboards and gamified experiences (plus a personalized-plan view in beta); a custom camera component with pose analysis and feedback for teams that want only the tracking; real-time monitoring of reps, mistakes, posture alignment and calories; rep, mistake, exercise and workout data events; theming through an admin portal; and a documented set of movement assessments, among them Timed Up and Go, gait speed, sit-to-stand variants, the Functional Reach Test and balance stands, with risk-level outputs.\n\n## Side by side\n\nEverything in this table was checked on October 17, 2026 against the vendors' public repos, npm and pub.dev, and their own pages. Gaps in the public record are marked as gaps rather than filled in from memory.\n\n| Dimension | QuickPose | KinesteX |\n|---|---|---|\n| Layer of the stack | Native pose-estimation toolkit (MediaPipe and BlazePose) you build a product on | Hosted coaching experience embedded via WebView or iframe, plus a content API |\n| Platforms | iOS 14.0+; Android API 26 (samples API 28); React Native plugin; its docs home mentions Wasm SDKs, but we found no public web package | iOS, Android, Flutter, React Native and the web (HTML and JavaScript iframe, PWA, React TypeScript) |\n| Integration model | MediaPipe libraries ship in the SDK modules; your app owns the camera, rendering and UI | A native wrapper loads the hosted experience; events cross a `postMessage` bridge |\n| Fitness features in the box | Range of motion for five joint groups, counters for 20 exercises, feedback events, gesture inputs | Workout, plan, challenge and leaderboard views, rep and mistake events, calorie estimates, assessments, admin-portal theming |\n| Workout content included | None in the repos | Yes, through the views, the content API or the admin portal |\n| Requirements | iOS 14.0+ or Android API 26+, SDK key tied to your bundle ID | iOS 14 and macOS 11 in the Swift packages; camera permission and a motion-sensor usage description on iOS; `CAMERA` and `INTERNET` permissions on Android |\n| Published pricing | Yes, per monthly active device: free for 10, then $25 a month for 100 up to $1,000 a month for 100,000, every feature on every plan | No price list. Its FAQ describes usage-based plans priced per active user per month that fall at higher tiers, and says integration fees may apply |\n| Getting a key | Free registration at dev.quickpose.ai | Contact form for demo access and an API key |\n| Licence | Apache-2.0 LICENSE in the iOS repo; QuickPose's terms license the SDK under Apache 2.0 subject to the agreement and fees; no LICENSE file in the Android repo; the npm plugin is MIT | Apache-2.0 in the Swift, Kotlin, React Native, HTML-JS and demo repos; no LICENSE file in the Flutter, SwiftUI-kit and PWA repos; the hosted service is commercial and needs an API key |\n| Recent activity | iOS SDK pushed 2026-08-26 and Android SDK 2026-08-27; npm plugin 0.7.1 on 2026-08-26; demo apps pushed in September 2026 | Kotlin repo pushed 2026-10-14; npm kinestex-sdk-react-native 1.4.1 on 2026-10-09; pub.dev kinestex_sdk_flutter 1.5.1 on 2026-07-04 |\n| Accuracy | No figure published in the repos | \"Consistently exceed 90% accuracy\" in a README and \"97.2% accuracy\" in its FAQ: vendor claims, not benchmarks |\n\n## Where QuickPose wins\n\nThis section exists because it is earned, not because a checklist demanded it.\n\n**Native integration, all the way down.** QuickPose's modules bundle the MediaPipe libraries and run inside your app process. You own the camera session, the skeleton overlay and every pixel of UI. For a team that cares about exact visual control, transition animations or keeping the camera pipeline in-process, that is the architecturally tighter fit, a judgement but one grounded in what the repos show. KinesteX's repos describe a WebView surface; there is no native-rendering mode in evidence.\n\n**Real fitness primitives without buying an experience.** This is not a bare MediaPipe wrapper. Range-of-motion measurement across five joint groups, counters for 20 named exercises and feedback events for body position and out-of-frame limbs are a meaningful head start for a team that wants to keep its own product identity.\n\n**A published price list and a self-serve start.** QuickPose publishes every SDK plan, device limit and support level, from a free tier for 10 monthly active devices to $1,000 a month for 100,000, and its key is a free signup. KinesteX publishes no figures and starts with a contact form. For a developer who wants to evaluate something this afternoon, or a founder who needs a number in a budget this week, that difference is decisive. [QuickPose pricing](/pricing/quickpose-pricing) sets out the plans, including a second QuickPose page that still carries an older answer about tiers.\n\n**Public traction and worked examples.** The iOS SDK repository had 326 stars when we checked, and the org publishes runnable demo apps, among them FitCount, a squat counter, a push-up rep counter, a biomechanics demo and BikeVision, with new iOS and Android demo apps pushed in September 2026. You can read exactly how the integration feels before committing.\n\n## Where KinesteX wins\n\n**Platform coverage, including the web.** Public repos across iOS, Android, Flutter, React Native and the web, all wrapping the same hosted experience, with current packages on npm and pub.dev. QuickPose now documents Android and React Native as well as iOS, so the gap is narrower than it was, but the browser is the clear difference: KinesteX documents iframe, PWA and React TypeScript integrations, and we found no public QuickPose web package.\n\n**The product in the box.** KinesteX's repos document prebuilt workout, plan, challenge and leaderboard views, a content API, admin-portal theming and rep-level analytics events. A team using QuickPose builds all of that; a team using KinesteX configures it. For a white-label coaching product on a deadline, that is the whole argument.\n\n**An assessment layer.** The documented movement assessments, with risk-level outputs, target health and screening use cases that QuickPose's repos do not address.\n\n**Server-side updates.** Because the experience is hosted, content and experience changes do not require app-store releases on every platform. The flip side is the next section; this is a bet, not a free lunch.\n\n## The trade-off neither vendor states this plainly\n\nJudgement, clearly labelled: native SDK versus WebView embed is the real decision on this page, and each choice costs something. Native (QuickPose) feels tighter because it is tighter, with in-process inference, your rendering and your UX, and in exchange you build and maintain the product per platform. A WebView or iframe surface (KinesteX) ships everywhere at once and evolves without app releases, and in exchange the embedded experience is the vendor's experience: customization runs through their theming, app-to-experience communication crosses a `postMessage` bridge, and the Android integration asks for the `INTERNET` permission.\n\nTwo cautions on claims you will meet. KinesteX's SDK READMEs say \"optional edge processing (no cloud transmission)\", while its security page says \"All camera and vision processing stays on-device\" and that its cloud delivers content and AI models; the two lines are not the same promise, so get the behaviour of your configuration in writing. Symmetrically, do not read QuickPose's Apache-2.0 iOS licence as \"fully open source\": the SDK is keyed, and QuickPose's terms say its use may be subject to fees.\n\n## What we could not verify, for both vendors\n\n- **Accuracy.** No independent accuracy benchmark exists for either. KinesteX's README line (\"consistently exceed 90% accuracy\") and its FAQ figure (\"97.2% accuracy\") are the vendor's own claims, and they do not agree with each other. QuickPose publishes no accuracy figure in its repos.\n- **KinesteX prices.** The FAQ describes the model but no figure is published anywhere we looked.\n- **QuickPose's tier answers.** Its JointTrack pricing page still carries an older SDK answer about when you move to the Launch tier that does not match the SDK pricing page; we go by the SDK pricing page.\n- **QuickPose on the web.** Its docs home mentions Wasm SDKs; we found no public package or documentation for one.\n- **Licence files.** QuickPose's Android repo and KinesteX's Flutter, SwiftUI-kit and PWA repos carry no LICENSE file, and neither vendor's commercial terms for its hosted or keyed service are in the repos.\n\n## Which should you pick?\n\n- **Native integration, your own UX and content, on iOS, Android or React Native** → QuickPose is the honest lean. Pair it with our [iOS workout-tracking build guide](/guides/ai-workout-tracking-ios-swift), and check [Apple's Vision body pose](/motion/apple-vision-body-pose) first so you know what the platform already gives you before paying for a wrapper's conveniences.\n- **A cross-platform white-label coaching experience on a deadline, or a web surface** → KinesteX is the honest lean. One hosted experience across iOS, Android, Flutter, React Native and the web is what its repos demonstrate.\n- **You need a number for a budget before any call** → QuickPose, whose SDK pricing page lists every plan; KinesteX publishes none.\n- **You want neither** → [QuickPose alternatives](/alternatives/quickpose-alternatives) and [KinesteX alternatives](/alternatives/kinestex-alternatives) map the wider field with the same disclosure, and [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) compares the category.\n- **You suspect you should build on raw models instead** → run the numbers in [build vs buy](/motion/build-vs-buy-ai-motion-tracking) first; the pose model is the free part, and both of these products exist because everything above it is not.\n\nWhichever way you lean, re-verify against the repos and the vendors' own pages before you sign anything: both codebases moved within weeks of our check, and this page will age.",
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
        "checked": "2026-10-17",
        "note": "README description, features, modules, iOS 14.0, free SDK key, Apache-2.0, 326 stars, pushed 2026-08-26"
      },
      {
        "url": "https://github.com/quickpose/quickpose-android-sdk",
        "checked": "2026-10-17",
        "note": "README, Android SDK 26, Maven artifacts, no LICENSE file, pushed 2026-08-27"
      },
      {
        "url": "https://www.npmjs.com/package/@quickpose/react-native",
        "checked": "2026-10-17",
        "note": "0.7.1 on 2026-08-26, MIT"
      },
      {
        "url": "https://github.com/quickpose",
        "checked": "2026-10-17",
        "note": "demo app repositories and push dates"
      },
      {
        "url": "https://docs.quickpose.ai/docs/MobileSDK",
        "checked": "2026-10-17",
        "note": "min API 26, samples API 28 (snapshot)"
      },
      {
        "url": "https://docs.quickpose.ai/",
        "checked": "2026-10-17",
        "note": "Wasm SDKs mentioned (snapshot)"
      },
      {
        "url": "https://quickpose.ai/sdk-pricing/",
        "checked": "2026-10-17",
        "note": "plans by monthly active device (snapshot)"
      },
      {
        "url": "https://quickpose.ai/products/android-sdk/",
        "checked": "2026-10-17",
        "note": "on-device inference, no frames sent to a server (snapshot)"
      },
      {
        "url": "https://quickpose.ai/terms-and-conditions/",
        "checked": "2026-10-17",
        "note": "Apache 2.0 licence clause and fees (snapshot)"
      },
      {
        "url": "https://quickpose.ai/products/jointtrack/pricing/",
        "checked": "2026-10-17",
        "note": "older SDK tier answer (snapshot)"
      },
      {
        "url": "https://github.com/KinesteX",
        "checked": "2026-10-17",
        "note": "11 public repositories, licences and push dates"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-10-17",
        "note": "WebView architecture, iOS 14 and macOS 11"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-PWA",
        "checked": "2026-10-17",
        "note": "iframe and postMessage"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-Swift-Demo",
        "checked": "2026-10-17",
        "note": "views, camera component, data events"
      },
      {
        "url": "https://github.com/KinesteX/.github",
        "checked": "2026-10-17",
        "note": "assessments, risk levels, data payloads"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-10-17",
        "note": "features, optional edge processing line, Apache-2.0 LICENSE.txt"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-10-17",
        "note": "the 90% accuracy claim"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-10-17",
        "note": "1.4.1 on 2026-10-09"
      },
      {
        "url": "https://pub.dev/packages/kinestex_sdk_flutter",
        "checked": "2026-10-17",
        "note": "1.5.1 on 2026-07-04"
      },
      {
        "url": "https://www.kinestex.com/docs/installation.md?lang=kotlin",
        "checked": "2026-10-17",
        "note": "SwiftUI kit URL, react-native-webview, React TypeScript package, permissions (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-10-17",
        "note": "pricing model and the 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-10-17",
        "note": "on-device processing and model delivery (snapshot)"
      }
    ]
  },
  {
    "slug": "kinestex-vs-mediapipe",
    "primaryQuery": "kinestex vs mediapipe",
    "h1": "KinesteX vs MediaPipe: Which Layer Do You Want to Own?",
    "metaTitle": "KinesteX vs MediaPipe: Build or Buy the Layer? (2026)",
    "metaDescription": "MediaPipe is free and gives you 33 keypoints; KinesteX sells the layer above them: rep counting, form feedback, content. Which layer should you own?",
    "updated": "2026-10-18",
    "answer": "These two are not peers, and that is the real answer: MediaPipe is a free, Apache-2.0 pose model that outputs 33 landmarks per frame and nothing else, while KinesteX (this site's own product) is a commercial SDK selling the application layer above the keypoints — rep counting, mistake feedback, workout content, and a WebView-embedded cross-platform experience, per its public repos. Build on MediaPipe when motion analysis is your core product and you have the team to own rep logic, content, and per-platform camera pipelines at zero per-user vendor cost. Buy KinesteX when time-to-market, content breadth, and one integration across five platforms matter more than owning the stack. KinesteX publishes no prices, only a per-active-user pricing model in its FAQ, so get figures from the vendor before you commit.",
    "faqs": [
      {
        "q": "Does MediaPipe include rep counting or form feedback?",
        "a": "No. MediaPipe Pose Landmarker outputs 33 landmarks per frame — coordinates, visibility, and presence — and nothing more. Google's model card lists fitness and repetition counting as an intended application domain, but the counting state machines, per-exercise form rules, mistake feedback, and exercise content are all yours to build. That gap between keypoints and a working fitness feature is the entire substance of the KinesteX vs MediaPipe question."
      },
      {
        "q": "Is KinesteX a native SDK or a WebView wrapper?",
        "a": "Per its own public repositories, every KinesteX SDK — Swift, Kotlin, React Native, Flutter, and web — is a thin wrapper that embeds a hosted web experience via WKWebView, Android WebView, react-native-webview, or an iframe, communicating through postMessage events, with internet permission required. That is not a criticism; it is how one vendor implementation serves five platforms at once. But you are integrating an embedded experience, not an in-process inference library, and you should weigh that against MediaPipe's in-process, offline-capable model."
      },
      {
        "q": "How much does KinesteX cost compared to free MediaPipe?",
        "a": "MediaPipe's framework and pose models are Apache-2.0 and cost nothing; you pay in engineering time. KinesteX is commercial — an API key is required and demo access goes through a contact form — and it publishes no prices as of October 2026: its FAQ describes usage-based plans priced per active user per month that fall at higher tiers, with possible integration fees, but gives no figure, so we cannot quote a number and will not guess one. Price the decision as free plus substantial build effort (quarters, in our estimate) versus a vendor fee you must obtain directly from KinesteX in writing."
      },
      {
        "q": "Is KinesteX built on top of MediaPipe?",
        "a": "We could not verify what pose model runs inside KinesteX's hosted experience; its public repositories do not document the underlying model, so do not assume either way. For this decision it barely matters: what KinesteX sells is the interpretation, content, and cross-platform layer above the keypoints, and what MediaPipe gives you free is the keypoints. The comparison is between layers of the stack, not between two pose models."
      },
      {
        "q": "Can I start with KinesteX and migrate to my own MediaPipe pipeline later?",
        "a": "Yes in principle, and it is a sane de-risking path: ship on the vendor layer while you validate the product, then bring tracking in-house if motion analysis becomes your core IP. Plan for a real rewrite rather than a swap, though — KinesteX hands you interpreted events from an embedded experience, while a MediaPipe pipeline means owning camera plumbing, rep logic, and content yourself, so little integration code transfers. The reverse move, from an in-house pipeline to a vendor SDK, is usually the easier migration."
      }
    ],
    "cta": {
      "pitch": "The application layer is where camera fitness products win or lose — get our developer notes when the motion SDKs or the free pose models actually change."
    },
    "body": "*Disclosure: KinesteX funds AIFitnessAPI, and KinesteX is one of the two names on this page. So let us say the most important sentence first, the one a dishonest version of this page would bury: MediaPipe is free. Apache-2.0, no API key, no vendor. If you have the team to build the application layer yourself, you do not need KinesteX. Every KinesteX claim below traces to its public GitHub repos or its own published pages; every MediaPipe claim to Google's model card, repo docs and source, all checked on October 17 and 18, 2026.*\n\n## Not apples-to-apples — and that is the answer\n\n\"KinesteX vs MediaPipe\" reads like a product comparison, but the two things do not sit at the same layer of the stack. MediaPipe Pose Landmarker is a free pose-estimation primitive: it turns camera frames into 33 landmarks per frame, and that is the entire product. KinesteX is a commercial application-layer SDK: it sells what you would otherwise build *on top of* keypoints — rep counting, mistake feedback, workout content, and a cross-platform embed. Pretending these are peers would make this page useless.\n\nSo the real question is not \"which is better\" — it is **which layer do you want to own**. That is the build-vs-buy decision in its most-searched form, and the general version of it (team requirements, cost curves, hybrid paths) lives in our [build vs buy guide for AI motion tracking](/motion/build-vs-buy-ai-motion-tracking). This page is the named-vendor instance.\n\n## What each one actually is\n\n**MediaPipe Pose Landmarker** (BlazePose GHUM, in the [google-ai-edge/mediapipe](https://github.com/google-ai-edge/mediapipe) repo) is Google's on-device pose model. Per its model card and repo docs: 33 landmarks per frame — the 17 COCO keypoints plus face, hand, and foot points — each with x, y, z, visibility, and presence, plus world landmarks documented as meters from a hip-center origin (with the honest caveat that z is \"up to scale\", not metric). Three variants (`pose_landmarker_lite`, `pose_landmarker_full`, `pose_landmarker_heavy`) trade size for accuracy; the card says the models are \"optimized for on-device, real-time fitness applications\" and lists \"fitness and repetition counting\" as an intended domain. Framework and models are Apache-2.0. The card also states the model \"tracks only one person on scene if multiple present\" and lists subjects beyond roughly 4 meters as out of scope — and the served model files were last modified in April 2023, so treat the weights as frozen. The newer Tasks API does expose a `num_poses` option, documented as \"the maximum number of poses can be detected by the PoseLandmarker\" and defaulting to 1, but the card does not evaluate more than one person, so treat raising it as something to test. Variant selection is covered in [the MediaPipe Pose Landmarker model guide](/motion/mediapipe-pose-landmarker-models), and the MediaPipe-vs-MoveNet model decision in [MediaPipe vs MoveNet](/compare/mediapipe-vs-movenet).\n\n**KinesteX** (public repos at [github.com/KinesteX](https://github.com/KinesteX)) is a commercial \"AI motion analysis SDK\" — its own category term. What the repos and KinesteX's own pages verify, as of October 17, 2026:\n\n- **SDKs for five surfaces** — Swift (iOS 14+), Kotlin, React Native, Flutter, and the web (HTML and JavaScript, a PWA path and a React TypeScript package) — with pushes as recent as October 14, 2026 (Kotlin) and October 9, 2026 (React Native). Not every repo is that active: the original Swift SDK repo was last pushed in April 2025, and KinesteX's docs now point Swift users to the newer SwiftUI kit.\n- **Integration surface**: every SDK is a thin wrapper embedding a hosted web experience. The Swift package README says it \"embeds KinesteX's AI-powered camera workout experience as a WebView\" (`WKWebView` on iOS; Android WebView, `react-native-webview`, or an iframe elsewhere), communicating via `postMessage` events. KinesteX's installation docs ask for camera permission plus a motion-sensor usage description on iOS, and the Android manifest they show includes the `INTERNET` permission.\n- **Application features per the READMEs**: real-time monitoring of repetitions, mistakes, posture alignment and calories burned; plug-and-play views for workouts, plans, challenges, leaderboards, and gamified experiences; a custom camera component with pose analysis and feedback; a content API and admin portal for building your own workouts; white-label theming; and a documented assessment suite (Timed Up-and-Go, gait speed, sit-to-stand variants, functional reach, plus gamified assessments) with risk-level outputs.\n- **Data events**: `reps` and `mistake` events fire per repetition and per detected mistake; `exercise_completed` payloads carry reps, calories, a mistakes array and an optional average accuracy; `exercise_overview` items can carry per-rep accuracy scores; and `workout_overview` carries accuracy and efficiency scores.\n- **Commercials**: an API key plus company name is required, and demo access goes through a contact form. Stated plainly: **KinesteX publishes no prices**. Its FAQ describes usage-based plans priced per active user per month that fall as you reach higher tiers, with integration fees possible, but gives no figure. The wrapper code is Apache-2.0 where a LICENSE file exists, but the hosted service itself is commercial.\n\nOne more honesty note: KinesteX's own README claims its movement-recognition models \"consistently exceed 90% accuracy\", and its FAQ says its motion tracking \"achieves 97.2% accuracy\". Those are first-party marketing claims, not independent benchmarks; they do not agree with each other, and we found no third-party verification of either.\n\n## Layer by layer\n\n| Layer | MediaPipe (build) | KinesteX (buy) |\n|---|---|---|\n| Keypoints | 33 landmarks per frame, yours to consume raw | Internal to the hosted experience; the public repos document interpreted events (reps, mistakes, accuracy), not a raw landmark stream |\n| Interpretation (reps, form, mistakes) | You build all of it | Ships: rep counting, mistake detection, posture alignment, calorie estimates, per-rep accuracy events |\n| Content (exercises, plans, assessments) | You build or license it | Ships: workout/plan/challenge/leaderboard views, content API, admin portal, assessment suite |\n| Platforms | You integrate per platform (Android sample floor is SDK 24; you own each pipeline) | Swift, Kotlin, React Native, Flutter, HTML/JS — five wrappers around one hosted web experience |\n| Runtime model | In-process, on-device inference; works offline | WebView/iframe embed of a hosted experience; internet permission required; KinesteX's security page says camera and vision processing stays on the device |\n| Cost structure | Free, Apache-2.0; you pay in engineering time | Commercial API key; no published prices — the FAQ describes per-active-user plans; obtain figures from the vendor |\n| Who owns maintenance | You: camera pipelines, model updates (served model files last modified April 2023), device edge cases | Vendor owns the tracking pipeline and content; you own thin wrapper updates |\n\n## What MediaPipe actually leaves you to build\n\nThis list is our engineering judgement of what \"parity with a fitness SDK\" requires on top of raw keypoints — it is scope, not a knock on the free models, and Google's own model card explicitly targets fitness use:\n\n1. **Exercise definitions and form logic** — per-exercise joint-angle rules, phase detection, hold detection, per camera angle.\n2. **Rep-counting state machines** — debouncing, partial-rep rejection, tempo. The only free starter we found is ML Kit's sample squat/pushup classifier, which is a demo, not a product.\n3. **Mistake detection and feedback content** — mapping deviations to human-readable corrections, audio cues, localization.\n4. **Calibration and framing UX** — person-in-frame checks and distance guidance (the vendors' own cards put usable range at roughly 3–6 ft for MoveNet and under ~4 m for BlazePose), camera selection, orientation.\n5. **Content** — an exercise library, workout and plan structures, progression logic. This is exactly what KinesteX ships as views plus a content API.\n6. **Analytics plumbing** — session summaries, per-rep accuracy, engagement events.\n7. **Cross-device robustness** — variant selection, thermal and frame-rate management, lighting and clothing edge cases, and a separate camera pipeline per platform (our [camera pose tracking guide](/guides/camera-pose-tracking) covers this layer).\n\nNone of this is exotic. All of it is real, ongoing work that a team must staff — which is the entire price of \"free\".\n\n## The WebView question, stated fairly\n\nThe starkest architectural difference deserves a fair reading in both directions. KinesteX's SDKs are WebView/iframe embeds of a hosted experience; a MediaPipe pipeline runs in-process in your app.\n\n**What the embed costs you:** you do not control the camera pipeline, the rendering, or the pixels — customization is white-label theming through the vendor's portal, not arbitrary native UI. The app requires internet permission. And on privacy, KinesteX's two public statements do not match: its SDK READMEs say \"optional edge processing (no cloud transmission)\", while its security page says \"All camera and vision processing stays on-device\" and that its cloud is used to deliver content and AI models. Ask the vendor what your configuration does, and get it in writing, rather than relying on either line.\n\n**What the embed buys you:** one vendor implementation genuinely serving five platforms, which is precisely why \"cross-platform without five codebases\" is credible here, and a tracking pipeline the vendor updates without you shipping releases for it (that last consequence is our inference from the architecture, not a repo quote).\n\n**In-process MediaPipe is the mirror image:** full control of the camera pipeline, true offline operation, no vendor runtime and no per-user dependency — and full ownership of every platform-specific camera stack, model-update decision, and device edge case, forever.\n\n## When building on MediaPipe clearly wins\n\nWe will concede this genuinely, because it is often the right call:\n\n- **Motion analysis is your core IP.** If your differentiation is novel exercise logic, sport-specific analysis, or thresholds you must own and audit, you cannot rent the layer that makes you different.\n- **You have (or are hiring) CV/ML engineers.** The judgement list above is a roadmap, not a wall, for a team that has shipped camera pipelines before.\n- **Zero per-user vendor cost.** At scale, \"free forever, per user, offline\" is a structural advantage no commercial SDK can match.\n- **Full control** of camera, UI, data flow, and privacy posture — including the ability to guarantee frames never leave the device, which an embedded hosted experience cannot let you unilaterally guarantee.\n\nIf most of those describe you, stop here and start with the [Pose Landmarker model guide](/motion/mediapipe-pose-landmarker-models).\n\n## When buying the KinesteX layer wins\n\n- **Time-to-market.** In our judgement — an estimate, not a measured figure — embedding a view and subscribing to `exercise_completed` events is weeks of work, where the seven-item build list is quarters.\n- **Breadth of content.** Workout, plan, challenge, and leaderboard experiences plus a documented assessment suite exist on day one; content is the slowest thing to build well.\n- **Cross-platform reach without five implementations.** iOS, Android, React Native, Flutter, and web from one integration pattern.\n- **No CV team required.** You consume interpreted events instead of building interpretation.\n\n## What we could not verify\n\n- **KinesteX prices.** Its FAQ describes the model, per active user per month with lower rates at higher tiers and possible integration fees, but no figure is published anywhere we looked, and access is by contact form. We will not guess a number, and neither should you — get it in writing before you commit.\n- **What pose model KinesteX runs internally.** Neither the public repos nor KinesteX's security page names it; the security page says only that pose estimation runs on the user's device and that its cloud delivers AI models. Do not assume it is (or is not) MediaPipe.\n- **Edge-processing conditions.** The READMEs say \"optional edge processing\"; the security page says all camera and vision processing stays on-device. Which statement governs your configuration is not documented.\n- **MediaPipe with several people in frame.** The Tasks API's `num_poses` option exists, with a default of 1, but Google's model card describes and evaluates a single person; we found no published evaluation of the model with several people in frame.\n\n## Verdict, by use-case\n\n- **Fitness feature inside a broader app, small team, shipping this quarter** → buy the layer. KinesteX (or another application-layer SDK — the field is compared in [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis)) gets you rep and form events without building interpretation.\n- **Motion analysis is the product, and you have CV engineering** → build on MediaPipe. Own the layer that differentiates you; the primitive is free and fitness-targeted by Google's own card.\n- **Hard requirement that video never leaves the device** → build, or get KinesteX's edge-processing behavior for your configuration in writing first.\n- **Deep custom exercise logic the vendor's content model does not cover** → build. Renting the application layer only pays when the vendor's application matches yours.\n- **Unsure** → buy first, validate the product, and treat a later in-house pipeline as a planned migration, not a failure. The general economics of that path are in the [build vs buy guide](/motion/build-vs-buy-ai-motion-tracking).\n\nThe honest summary: MediaPipe gives you free keypoints and total ownership of everything above them; KinesteX sells the everything-above-them. Decide which layer you want to own, and the vendor question answers itself.",
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
        "href": "/compare/kinestex-vs-quickpose",
        "label": "KinesteX vs QuickPose"
      },
      {
        "href": "/alternatives/mediapipe-alternatives",
        "label": "MediaPipe alternatives"
      },
      {
        "href": "/alternatives/kinestex-alternatives",
        "label": "KinesteX alternatives — the vendor's own list"
      }
    ],
    "firstParty": true,
    "sources": [
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-17",
        "note": "33 landmarks, fitness positioning, single person, 4 m limit, z up to scale, Apache-2.0"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/pose.md",
        "checked": "2026-10-17",
        "note": "world landmarks in meters from the hip centre"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py",
        "checked": "2026-10-17",
        "note": "num_poses option, default 1"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe-samples/tree/main/examples/pose_landmarker",
        "checked": "2026-10-17",
        "note": "lite, full and heavy downloads; Android sample minSdk 24"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
        "checked": "2026-10-18",
        "note": "served files last modified April 2023"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.SinglePose%20Model%20Card.pdf",
        "checked": "2026-10-17",
        "note": "3 to 6 feet working distance"
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection/classifying-poses",
        "checked": "2026-10-18",
        "note": "sample app classifies pushups and squats"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-10-17",
        "note": "WebView architecture, iOS 14"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-10-17",
        "note": "feature list, optional edge processing line, pushed 2026-10-14"
      },
      {
        "url": "https://github.com/KinesteX/.github",
        "checked": "2026-10-17",
        "note": "postMessage events, data payloads, assessment suite with risk levels, contact-form access"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-Swift-Demo",
        "checked": "2026-10-17",
        "note": "views, camera component, per-rep and mistake events, apiKey and companyName"
      },
      {
        "url": "https://github.com/KinesteX/AI-Fitness-SDK",
        "checked": "2026-10-17",
        "note": "the 90% accuracy claim"
      },
      {
        "url": "https://www.kinestex.com/docs/installation.md?lang=kotlin",
        "checked": "2026-10-17",
        "note": "permissions, react-native-webview, React TypeScript package (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-10-17",
        "note": "pricing model and the 97.2% claim (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-10-17",
        "note": "on-device processing and model delivery statements (snapshot)"
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
        "a": "You can, but understand that it is two unrelated builds rather than two API clients: an on-device HealthKit reader inside a native app plus a server-side OAuth and webhook consumer that shares no code, no auth model, and no data-freshness behaviour with it. Teams that want both, plus other wearables, usually reach for a cross-device aggregator that normalizes the on-device and cloud sources behind one interface. Weigh that against maintaining both integrations yourself."
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
    "body": "Already picked WHOOP and need the developer side? The [WHOOP API developer integration guide](/integrate/whoop-api) walks through the membership WHOOP requires, app registration, OAuth scopes, token exchange, webhooks and the member cap. This page compares the two platforms you might build on.\n\n## Two opposite integration architectures\n\nChoosing between these two is really choosing between **a platform you build on** and **a vendor you integrate with**. The wrist hardware matters far less than that split.\n\nBuilding on Apple Watch means you never call Apple. Apple documents HealthKit as \"a central repository for health and fitness data on iPhone and Apple Watch,\" and its privacy guidance says plainly that \"the user's device stores all HealthKit data locally\" and that \"the device encrypts the HealthKit store when the user locks the device.\" There is no endpoint to hit, no client credential to rotate, and no vendor quota to negotiate, because there is no server on Apple's side of the relationship at all. Your code runs on the user's own hardware, inside an app you ship and maintain — and, if you want, on the watch itself: Apple documents HKWorkoutSession as a session that \"fine-tunes Apple Watch's sensors for the specified activity\" and notes that \"all workout sessions generate high-frequency heart rate samples.\" What you inherit in place of an API contract is Apple's platform rulebook — the HealthKit capability, usage-description strings, App Review before anyone can install the thing, and a per-type permission prompt whose outcome you cannot fully inspect.\n\nBuilding on WHOOP is the mirror image: you never touch the device, and every part of the integration is a vendor relationship. You register on the WHOOP Developer Platform, run `OAuth 2.0` authorization-code with scoped tokens, and subscribe to v2 webhooks — sleep, recovery, and workout events — that push into your backend. There is no documented per-call fee, but there are gates. WHOOP requires developers to hold an active membership and a device, every end user needs an active membership for their data to exist for you at all, and every new app starts on WHOOP's Sandbox tier, which allows up to 10 WHOOP members; connecting more needs a reviewed request for each tier above it.\n\nNeither list of constraints is a knock on either company. A platform with no cloud API and a vendor with an approval queue are both making a defensible choice about who holds health data; they just hand you very different engineering problems. To line up the same access questions for any other pair, [the side-by-side API comparison](/compare-apis) shows how each product bills developers, what users must own and what approval stands before launch.\n\n## Apple Watch vs WHOOP at a glance\n\n| Dimension | Apple Watch (via HealthKit) | WHOOP |\n|---|---|---|\n| Integration model | Platform framework on the user's device; no vendor account, no API contract with Apple for the data itself | Vendor cloud API; register an app on the WHOOP Developer Platform |\n| Where your code runs | Inside your iOS app, and optionally a watchOS app on the watch | On your own backend, server-to-server, any language or host |\n| Auth | Per-data-type on-device permission prompt; no tokens to store. Apple: \"your app doesn't know whether someone granted or denied permission to read data from HealthKit\" | `OAuth 2.0` authorization code with scoped tokens; rotating refresh tokens, where each refresh invalidates the prior one |\n| Freshness | Pull model you drive: `HKObserverQuery` plus `enableBackgroundDelivery`, with `HKAnchoredObjectQuery` anchors for incremental sync. Apple documents an hourly maximum frequency for some types, and on watchOS a budget of four updates per hour shared with background refresh | Push model the vendor drives: v2 webhooks for sleep, recovery, and workout events land on your endpoint |\n| End-user cost | Buys an Apple Watch (and an iPhone) once; no recurring fee is required for your app to read the data | Hardware is sold as a recurring membership — every active user is a paying member. Model, not price: verify current terms |\n| Approval gate | App Review before distribution, plus the HealthKit capability and, for background delivery on iOS 15 and watchOS 8 and later, the background-delivery entitlement | Developer Platform registration; the developer needs their own membership and device; a 10-member Sandbox tier until WHOOP approves a request for the next tier |\n| Cross-platform reach | iOS and watchOS only — Apple's setup guidance notes HealthKit is unavailable on iPadOS 16 or earlier and on macOS. No Android, no web | Any platform. Once a user consents, your servers pull without the user's phone in hand |\n| Shape of the data | Whatever the user's Health store holds, written by any app or device — `HKWorkout` summarizes duration, total distance and total energy burned and acts as a container for associated samples; HRV is exposed as `heartRateVariabilitySDNN` | A recovery, strain, and sleep model from one vendor's own sensors, consistent across every member |\n\nNo WHOOP price appears in that table on purpose. WHOOP has restructured its membership recently, so describe the model to your stakeholders and pull the current figure from WHOOP's own pricing page — the [WHOOP API pricing breakdown](/pricing/whoop-api-pricing) explains which costs land on you and which land on your users.\n\n## Where Apple Watch wins\n\n**No vendor sits between you and the data.** There is no key to apply for, no rate limit to design around, no partner queue, and no membership your users must keep paying. If the person owns the watch and taps allow, the samples are there. For a team that has been burned by an API program changing its terms, that absence of a counterparty is the whole pitch.\n\n**You can put code on the device during the workout.** Shipping a watchOS app and driving `HKWorkoutSession` is a capability a cloud API structurally cannot offer. Apple documents the session as fine-tuning the watch's sensors for the chosen activity — an outdoor cycling session generates accurate location data where an indoor one does not — and states that all workout sessions generate high-frequency heart rate samples. Live in-workout coaching, real-time form or pace feedback, and haptics on the wrist all live here, not in a webhook that arrives after the fact.\n\n**You get the whole store, not one brand's metrics.** Because HealthKit is a shared repository, your app also sees what other apps and devices wrote into it. Apple describes observer queries as the way to \"respond to changes made by other apps and devices,\" so a user who logs weight in one app and runs in another still shows up in yours.\n\n**A defensible privacy story.** Local storage, encryption at lock, and Apple's own rules — you \"can't sell information gained through HealthKit to advertising platforms, data brokers, or information resellers,\" and you may not use it for advertising — give a health product something concrete to tell users and reviewers.\n\n**The honest trade-off.** You are signing up to build and ship an app, forever. Reach is iOS and watchOS only. Background reads can fail while the device is locked, because the store is encrypted then. Your app cannot distinguish \"granted\" from \"denied\" on reads — Apple says the only state you can positively identify is limited authorization — so your empty-state UX has to work without knowing why it is empty. Background delivery is metered by the system rather than by you, and on iOS 15 and watchOS 8 or later it needs the background-delivery entitlement or the call fails with an authorization error. And the sync from device to your servers is entirely your code. For the mechanics of permissions, queries, and the sync you will be writing, see the [Apple HealthKit integration guide](/integrate/healthkit).\n\n## Where WHOOP wins\n\n**Your backend can just ask.** This is the decisive advantage. With a consented user's scoped token, your servers pull recovery, strain, and sleep whether or not that user has opened anything today, from any host, in any language. A web dashboard with no mobile app, a nightly cohort job, an Android-first product, a Slack bot for a coaching team — none of those are buildable on Apple Watch data alone, and all of them are ordinary WHOOP integrations.\n\n**Events arrive instead of being fetched.** v2 webhooks for sleep, recovery, and workout events mean \"user finished a night of sleep\" is something WHOOP tells you, not something you poll for. On the Apple side the nearest equivalent is your own app waking under background delivery, subject to the system's frequency limits, then posting to your backend — more moving parts, and it only works while the app stays installed and permitted.\n\n**Every active user has complete data.** Because the hardware is sold as a subscription, an active WHOOP user is by definition a paying member, so the \"this user never subscribed, so half the fields are missing\" failure mode largely disappears. For a coaching product that needs a daily signal per user, that consistency is worth real money.\n\n**One opinionated model, uniformly applied.** Recovery, strain, and sleep come from one vendor's sensors and one pipeline, so cross-user comparisons are apples to apples. A HealthKit store, by contrast, is a pile of samples from whatever devices and apps that individual happens to use, and normalizing that is your problem.\n\n**The honest trade-off.** The membership dependency runs in both directions: you need an active membership and device to build, and each end user needs one for their data to reach you, which caps your addressable audience at current WHOOP subscribers. There is no per-call fee — WHOOP's API Terms of Use, effective October 6, 2026, say access is currently provided at no charge — but there is a tiered approval path: every new app starts on a Sandbox tier of 10 members, and each tier above it (100, 1,000, 5,000, then unlimited) needs a reviewed request. Rotating refresh tokens are the classic operational trap — each refresh invalidates the previous refresh token, so two workers refreshing the same user at once can knock each other out; serialize refreshes per user. The [WHOOP API integration guide](/integrate/whoop-api) covers the auth and webhook wiring, and [Oura vs WHOOP](/compare/oura-vs-whoop) is the better read if your real question is which subscription wearable to build on.\n\n## How to choose\n\nMatch the architecture to the product, not the device to the marketing:\n\n- **An iOS or watchOS app, especially one that coaches during the workout** — Apple Watch. Nothing in a cloud API reaches the sensors mid-session, and your users are already carrying the store you want to read.\n- **A web product, an Android app, or any backend that must work without the user present** — WHOOP. It is the only one of the two your servers can call.\n- **You want new sleep or recovery data to trigger something on your side** — WHOOP webhooks are a push you subscribe to; the Apple equivalent is your own app waking under system-metered background delivery and forwarding the data itself.\n- **Your users should not be paying anyone a monthly fee to use your app** — Apple Watch. The hardware is a one-time purchase; WHOOP's model makes every user of your integration a subscriber.\n- **You need consistent, comparable, complete data for every user** — WHOOP. A HealthKit store's contents depend on which apps and devices that individual uses.\n- **You are launching to more than a handful of users soon** — price in both gates. WHOOP's 10-member Sandbox cap lifts only when WHOOP approves a request for the next tier; an Apple Watch app has to clear App Review, and Apple's own setup guidance warns that App Review may reject apps enabling capabilities they do not actually use.\n- **You want both, plus everything else on the market** — neither first-party route covers it, and building two integrations with nothing in common (an on-device Swift sync and a server-side OAuth consumer) is exactly the work an aggregator exists to remove. [Fitbit vs Apple Watch](/compare/fitbit-vs-apple-watch) walks the same cloud-versus-device split with a different cloud vendor on the other side.\n\n## Watch the fine print\n\nThe Apple specifics above are documented behaviour and change slowly, but they do change: confirm the current background-delivery frequencies, entitlement requirements, platform availability, and type identifiers in Apple's own HealthKit documentation before you design around them. The WHOOP specifics are the volatile half. Membership structure has been restructured recently, so no price appears on this page; the 10-member Sandbox cap, the current webhook event names, and the developer-membership requirement should all be re-checked against WHOOP's own developer documentation. Everything here is as of 2026 — verify."
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
        "a": "You can, but budget for two unrelated builds rather than two API clients. One is an on-device HealthKit reader inside a native iOS app with its own sync code; the other is a server-side OAuth 2.0 PKCE consumer with registered webhook callbacks, sharing no auth model, no delivery behaviour and no code with the first. Garmin also has to approve you before the second exists. Teams that want both, plus other wearables, usually reach for a health-data aggregator that already holds its own Garmin partnership and normalizes the on-device and cloud sources behind one interface."
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
    "body": "## Two gates, and only one of them is yours to clear\n\nBoth of these strap a sensor to a wrist, and both charge the wearer once, up front, with nothing recurring required for the data to exist. Almost none of the engineering decision follows from that. It follows from a different split: **a platform you build on** versus **a partner API you apply for.**\n\nBuilding on Apple Watch means you never call Apple. Apple documents HealthKit as \"a central repository for health and fitness data on iPhone and Apple Watch,\" and its privacy guidance says plainly that \"the user's device stores all HealthKit data locally\" and that \"the device encrypts the HealthKit store when the user locks the device.\" There is no endpoint, no client credential to rotate, and no vendor quota to negotiate, because Apple runs no server on its side of this relationship. Your code runs on the user's own hardware inside an app you ship. What you inherit in place of an API contract is Apple's platform rulebook: the HealthKit capability, the `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` strings (call the authorization API without the matching key and the app crashes instead of showing a sheet), App Review before anyone can install the thing, and a permission prompt whose read outcome you cannot inspect.\n\nGarmin inverts all of it. The Connect Developer Program is **partner-approval-only**: you apply, and Garmin's team must approve a partnership before you receive any credentials. There is no self-serve key and there never was. Once you are in, current docs specify `OAuth 2.0` with PKCE producing a per-user `userAccessToken`, and you do not poll — you register HTTPS callback URLs per summary type and Garmin POSTs when a user's device syncs, either as a **Ping** notification carrying a `callbackURL` you then GET with that user's token, or as a **Push** with the full JSON inline. Good server-side architecture; the gate sits upstream of it. Garmin's program FAQ says that once your request is approved you get the Garmin Developer Portal, and since October 2026 access starts at Starter Access; the FAQ no longer states a review time. Community reports from 2026 that the program was on hold for new applicants could not be verified on Garmin's own pages.\n\nNeither posture is a knock on either company, but they hand you different problems. Apple's gate is on **distribution**, and you can always clear it eventually; Garmin's gate is on **access**, and right now you may not be able to clear it at all.\n\n## Apple Watch vs Garmin at a glance\n\n| Dimension | Apple Watch (via HealthKit) | Garmin (Connect Developer Program) |\n|---|---|---|\n| Integration model | Platform framework on the user's device; no vendor account, no API contract with Apple for the data | Vendor cloud API; an approved partnership is the prerequisite for everything else |\n| Getting access | Enable the HealthKit capability and ship; a paid Apple Developer account is required | Request the program; once Garmin approves you, you start with Starter Access, and Garmin states no review time |\n| Where your code runs | Inside your iOS app, and optionally a watchOS app on the watch | On your own backend, any language or host, once a user has authorized |\n| Auth | On-device permission prompt per data type; no tokens. Apple: \"your app doesn't know whether someone granted or denied permission to read data from HealthKit\" | `OAuth 2.0` with PKCE for a per-user `userAccessToken`. Secondary sources cite a lifetime around three months, refreshable — verify |\n| Delivery | Pull model you drive: `HKObserverQuery` plus `enableBackgroundDelivery`, `HKAnchoredObjectQuery` anchors for incremental sync. Apple documents an hourly maximum for some types, and four updates per hour on watchOS shared with background refresh | Push model Garmin drives: Ping or Push callbacks per summary type. Both retry, so answer fast and deduplicate on the upload time window |\n| Data shape | Whatever the Health store holds, written by any app or device — `HKWorkout` gives duration, total distance and total energy burned; HRV is `heartRateVariabilitySDNN` | First-party device metrics: a Health API for all-day wellness (sleep, stress, Pulse Ox, Body Battery, VO2 max, HRV, respiration, per-minute epochs) and an Activity API for per-activity data such as running, cycling and swimming, with GPS |\n| End-user cost | An Apple Watch and iPhone, bought once; no recurring fee for your app to read the data | A Garmin device bought outright; no separate consumer subscription for basic Garmin Connect use — verify |\n| Developer cost | HealthKit carries no API fees | No price published for Starter Access; Enterprise commercial terms are tailored, per Garmin's overview |\n| Reach | iOS and watchOS only — unavailable on iPadOS 16 or earlier and on macOS | Any platform, once approved. Rate limits are set per partner agreement |\n\nNo Garmin price appears above because Garmin publishes none. Read on October 22, 2026, its pages state no price for Starter Access and say Enterprise options and commercial terms are tailored to business and technical requirements; the program FAQ's earlier sentence that there were no licensing or maintenance fees is gone. Ask for them in writing before you promise one of those metrics.\n\n## Where Apple Watch wins\n\n**There is no counterparty who can say no.** This is the whole argument, and it lands unusually hard against Garmin. You cannot be turned away from HealthKit: if the person owns the watch and taps allow, the samples are there today — no application, no queue, no partner agreement whose terms you cannot read in advance.\n\n**You can run code on the device mid-workout.** Shipping a watchOS app and driving `HKWorkoutSession` is something a push-callback API structurally cannot offer: Apple documents the session as one that \"fine-tunes Apple Watch's sensors for the specified activity\" and notes that \"all workout sessions generate high-frequency heart rate samples.\" Live coaching, real-time pace or form feedback, and haptics on the wrist live here, not in a summary that arrives after the device next syncs.\n\n**You get the whole store — including, sometimes, Garmin's data.** Because HealthKit is a shared repository, your app sees what other apps and devices wrote into it. The consequence for this pair is specific: if a user's Garmin data lands in Apple HealthKit, you can read it on-device without Garmin's API at all. Not a substitute — you get only what synced into that one user's store, on the phone — but a real reason these two are not strictly exclusive.\n\n**The honest trade-off.** You are signing up to build and ship an app, forever, on iOS and watchOS only. Background reads can fail while the device is locked, because the store is encrypted then. Your app cannot tell \"granted\" from \"denied\" on reads, so your empty state must work without knowing why it is empty. Background delivery is metered by the system. And the sync to your servers is entirely your code — the [Apple HealthKit integration guide](/integrate/healthkit) covers the permissions, queries and sync you will write.\n\n## Where Garmin wins\n\n**Breadth of first-party physiology.** The Health and Activity API split reaches further into all-day wellness and serious multisport than most wearable APIs: Body Battery, VO2 max, stress, respiration, per-minute epochs, and per-activity detail with GPS. On the Apple side you get whatever that individual's devices and apps happened to write.\n\n**Your backend receives data without the user present.** A web dashboard with no mobile app, a nightly cohort job, an Android-first product — none are buildable on Apple Watch data alone, and all are ordinary Garmin integrations. Push carries the full payload inline; Ping keeps the POST small and lets you control fetch timing. And nobody has to keep your app installed: with HealthKit your app *is* the pipeline, so uninstalled or unpermitted, it stops.\n\n**The honest trade-off.** All of it is downstream of approval, and approval is the whole game. Nothing here is a stable public contract either: hosts, paths, scopes, summary-type names and token lifetimes sit behind the partner docs and change, so do not hard-code values from any public write-up, this one included. If the gate rather than the data is your blocker, [can't get Garmin API access](/fix/garmin-api-approval) covers the live status check and the aggregator route that runs on somebody else's approved credentials; the [Garmin API integration guide](/integrate/garmin-api) covers the wiring once you are in.\n\n## How to choose\n\n- **An iOS or watchOS app, especially one that coaches during the set** → Apple Watch. Nothing in a callback API reaches the sensors mid-session.\n- **A web product, an Android app, or a backend that runs without the user present** → Garmin, if you can get in. Confirm program status before you plan a roadmap around it.\n- **You want to start this week** → Apple Watch. Garmin's pages no longer state a review time, nothing reaches you before approval, and its FAQ puts a typical integration at one to four weeks.\n- **The deepest first-party physiology on an owned device** → Garmin, with the metric list verified against the partner docs.\n- **Your users must not pay a subscription** → both qualify, which is unusual. This pair ties on user cost; if that axis is what you are weighing, the contrast lives in [Apple Watch vs WHOOP](/compare/apple-watch-vs-whoop), where one side is a membership.\n- **You are really asking cloud-versus-device in general** → [Fitbit vs Apple Watch](/compare/fitbit-vs-apple-watch) walks that split with a self-serve cloud vendor opposite, which is a different question from an approval queue.\n\n## Watch the fine print\n\nThe Apple specifics are documented behaviour and move slowly, but confirm the current background-delivery frequencies, entitlement requirements, platform availability and type identifiers in Apple's own HealthKit documentation. The Garmin specifics are the volatile half, and several are second-hand by necessity: the docs are gated, and most primary pages return errors to anonymous fetches. The reported sign-up pause, the roughly three-month token lifetime, the summary-type names, the metric lists, and any setup fee or premium-metric licensing are all unconfirmed on a Garmin-owned page. Load the developer portal yourself before telling a stakeholder the program is closed. Everything above is as of 2026 — verify."
  },
  {
    "slug": "rook-vs-spike",
    "primaryQuery": "rook vs spike health data api",
    "h1": "Rook vs Spike: Which Health-Data API Fits Your Build?",
    "metaTitle": "Rook vs Spike: Health-Data Aggregators Compared",
    "metaDescription": "Rook vs Spike as of October 2026: both now reach medical devices and lab reports. Compare published prices, EHR features, webhooks and credentials.",
    "updated": "2026-10-17",
    "answer": "Rook and Spike now overlap more than they used to: as of October 17, 2026, both pages describe wearables plus medical devices and lab-report parsing behind one API, so the decision is about pricing visibility and support. Pick Rook when you need a cost you can model today: Core is $399 a month for up to 750 active users, Core+ $999 for 5,000 and Business $1,999 for 15,000, with a Medical Device API that records which device took each reading. Pick Spike when you want a dedicated implementation engineer from its Sandbox plan (from $450 a month), food-photo nutrition, an MCP server and EMR data, and can accept a custom quote. Spike's site also announces an acquisition by Raintree Systems, and ROOK's standard contract runs 12 months.",
    "body": "## Same category, closer than they were\n\nNeither of these is usually the first aggregator a team shortlists; that is more often Terra or Junction. When Rook and Spike end up head-to-head, the old framing was a mobile-first wearable aggregator against an everything-source one. Their current pages, read on October 17, 2026, blur that line: ROOK now sells medical-device, lab-report and EHR/EMR products alongside its wearable API, and both publish prices. An earlier version of this page said Rook did not reach labs, EMRs or medical IoT, that neither vendor's pricing could be verified, and that Spike's own pages disagreed on its device count. Those claims are corrected below.\n\nROOK describes itself as \"the health data aggregation and intelligence platform for digital health, wellness and insurance products\". Its homepage pitch is \"Wearables, medical devices, EHR/EMR and labs\", priced by plan and active users. Spike pitches \"360° Health Data for AI\": wearables and IoT sensors, lab report data, food-photo nutrition and EMR access behind one API, with a dedicated implementation engineer from its entry plan.\n\n## Rook vs Spike at a glance\n\n| Dimension | Rook | Spike |\n|---|---|---|\n| Coverage claim | \"400+ wearables and health data sources\" in its docs; 72 data sources and 500+ devices on its integrations page | \"Access 40+ providers and 500+ devices via single SDK\" |\n| Medical devices | Medical Device API: glucose, blood pressure, SpO2, temperature and ECG, tagged with the recording device | Medical IoT devices such as glucose monitors, ECGs and blood pressure cuffs |\n| Labs | Lab Data API parses PDF and image reports into biomarkers with LOINC codes and FHIR R4 | Lab Reports API parses PDF, JPEG or PNG reports with OCR and LOINC codes |\n| Clinical records | EHR/EMR API (waitlist) sends wearable data to clinical systems as FHIR R4; EHR data into ROOK is coming soon | \"Connect to top providers and access clinical data\" for EMR and EHR |\n| Extras | 0 to 100 health score, health monitoring alerts, ROOK App | Food-photo nutrition, Spike MCP, voice agents for clinics |\n| Entry price | Core $399 a month for up to 750 active users | Sandbox from $450 a month |\n| Higher tiers | Core+ $999 (5,000), Business $1,999 (15,000), Enterprise custom | Enterprise custom |\n| Contract | 12-month standard term, cancel with 30 days' notice | Not published |\n| Your own provider accounts | Dexcom, Samsung Health, Strava and WHOOP | Not stated in the docs we read |\n| Webhook signature | Not described on the pages we read | HMAC-SHA256 in X-Body-Signature |\n| Ownership | No change announced | Banner: \"Raintree Systems Acquires Spike Technologies\" |\n\n## Where Rook wins\n\n**You can price it before the first call.** ROOK's pricing page lists every self-serve ceiling: Core \"$399 USD per month\" for up to 750 active users, Core+ $999 for up to 5,000, Business $1,999 for up to 15,000, and add-ons with listed prices. Spike lists a starting price and a custom Enterprise plan. Past a ROOK plan's limit, \"billing adjusts based on usage\", which is the one number ROOK does not publish.\n\n**Device provenance on every reading.** ROOK's Medical Device API delivers readings \"with the device that recorded each one\", so a remote-monitoring program can tell a cuff from a watch. Spike integrates medical IoT too; the device-metadata detail is what ROOK documents.\n\n**Phone stores without your own app.** The ROOK App \"lets end users connect supported sources without embedding the SDKs\", for programs that have no mobile app of their own.\n\n**The honest trade-off.** The standard contract is 12 months, several products are add-ons on Core, and four popular providers need your own developer accounts, which ROOK says \"can take several weeks\".\n\n## Where Spike wins\n\n**A human on your implementation.** \"Every organization gets a dedicated implementation engineer from the sandbox level to help with setup and optimization.\" That is a checkable differentiator in a category where onboarding is normally the docs.\n\n**Food photos and LLM tooling in the box.** Spike's Nutrition AI converts \"any food image into complete nutritional data\", and Spike MCP \"connects wearables data, medical IoT devices, lab reports, and nutrition logs to your LLM of choice\". ROOK lists neither.\n\n**EMR data today.** Spike's homepage offers EMR and EHR connections now; ROOK's page says bringing EHR and EMR data into ROOK is coming soon.\n\n**The honest trade-off.** Spike publishes less: no tier ceilings, no contract terms, and no word on provider credentials in the docs we read. Its integrations and blog pages carry a banner announcing that Raintree Systems acquires Spike Technologies, with no further detail on its own pages.\n\n## What we could not verify\n\n- **For Rook:** the usage rate past a plan's ceiling, and whether webhooks carry a signature.\n- **For Spike:** how the bill grows past the Sandbox starting price, whether any provider needs your own developer account, and what the acquisition changes.\n- **For both:** coverage counts are each vendor's marketing; check your users' providers on the live lists.\n\n## How to choose\n\n- **A budget you need to model now, at a few thousand users** → Rook. Core+ at $999 a month covers up to 5,000 active users.\n- **Remote-monitoring readings where the device matters** → Rook's Medical Device API.\n- **Implementation help, food logging from photos, or an LLM-facing MCP layer** → Spike.\n- **EMR and EHR data flowing into your product today** → Spike, after confirming the integration you need is live.\n- **You have not compared the category leaders** → do that first: [Terra vs Rook](/compare/terra-vs-rook) and [Terra vs Spike](/compare/terra-vs-spike) take those pairs, and [Terra vs Vital (Junction)](/fitness-apis/terra-vs-vital) covers lab ordering.\n\n## Honest close\n\nNeither vendor saves you from the core aggregator trade: you pay to remove per-provider integration work, and you still own your infrastructure, token handling and health-data compliance. What separates them now is visibility and support: Rook publishes a price sheet you can model and a broader set of clinical-adjacent APIs than it used to, while Spike pairs a wide data reach with an engineer on your build and a price you learn on a call. Re-check both live pages before you commit; for the wider field, see the [health-data aggregator APIs overview](/fitness-apis/health-data-aggregator-apis).",
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
        "note": "Rook source catalogue"
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
    "metaDescription": "Two genuinely free food databases with opposite licences: USDA is public-domain CC0 US reference data, Open Food Facts is ODbL global barcode data.",
    "updated": "2026-08-12",
    "answer": "Pick USDA FoodData Central when you need authoritative US nutrient reference values you can absorb into a closed-source product, because it is public domain under CC0 and imposes no obligations at all; pick Open Food Facts when your core interaction is scanning a barcode on a packaged product anywhere in the world, and accept that its ODbL licence requires attribution and can force you to release a derived database as open data. Both are genuinely free rather than free tiers, so cost is not the deciding axis here — licence philosophy and coverage centre are. Neither offers natural-language meal parsing, so the logging layer is yours to build either way. Verify rate limits and the exact licence variants before you merge either dataset into anything you intend to keep private.",
    "faqs": [
      {
        "q": "Which of these two free food databases does barcode lookup?",
        "a": "Open Food Facts. Barcode lookup is its core call, returning ingredients, nutrition facts, Nutri-Score, allergens, labels, categories, and images for a product code, globally and with no API key. USDA FoodData Central includes GTIN/UPC fields in its Branded Foods dataset, but it is oriented around its own food IDs and is not a consumer barcode-lookup product. If scanning a packet is your primary interaction, Open Food Facts is the one that makes the feature exist on day one."
      },
      {
        "q": "Does the ODbL share-alike obligation force me to open my own food catalogue?",
        "a": "It can. Open Food Facts is licensed under the ODbL, and the share-alike term means a derived database that combines its data with yours may have to be released as open data, with attribution required either way. Commercial use itself is explicitly permitted, and the obligation attaches to the database rather than the application around it. Where a merged catalogue sits on that line is a question for counsel, not a comparison table. This is general guidance, not legal advice."
      },
      {
        "q": "Can I safely combine USDA FoodData Central and Open Food Facts in one product?",
        "a": "Yes, and most food apps end up doing exactly that, but keep the two in separate stores. USDA data is public domain under CC0, so anything you derive from it stays yours with no strings. Open Food Facts data carries ODbL attribution and share-alike, so keep it attributed and unmerged, queried live or cached as its own dataset, rather than folded into a proprietary master catalogue. Deciding this on day one costs nothing; retrofitting it later is a schema migration."
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
      "pitch": "Open food data changes its licence terms and rate limits quietly. Subscribe and we will flag it when a free dataset stops being as free as it looks."
    },
    "body": "## How to compare USDA FoodData Central and Open Food Facts\n\nMost nutrition-API head-to-heads weigh price against coverage. That axis is dead here: neither charges a fee, and neither is a freemium slice a vendor can curtail next quarter. Three questions are left, and they decide the build:\n\n- **Licence philosophy.** USDA FoodData Central is US government data in the public domain under `CC0`: no copyright, no licence fee, attribution requested but not required. Open Food Facts is open data under the `ODbL`, with contents under `DbCL` and images under `CC-BY-SA` — free for any purpose including commercial use, but attribution is required and the share-alike obligation can require you to publish a derived database as open data. These are opposite philosophies, not two shades of the same one.\n- **Where the coverage sits.** USDA is a nutrient reference: Foundation Foods, SR Legacy, Survey (FNDDS) foods as consumed, and a Branded Foods dataset that carries GTIN/UPC fields. Open Food Facts is a global crowdsourced catalogue of packaged products queried by barcode or search, returning ingredients, nutrition facts, Nutri-Score, allergens, labels, categories, and images for a product code.\n- **Who stands behind the numbers.** USDA data is lab-grade and curated by a government agency. Open Food Facts is volunteer-contributed with no accuracy or completeness guarantee, and coverage quality varies by region.\n\nAccess friction barely enters it. USDA needs a free data.gov key — a shared `DEMO_KEY` exists for first exploration — and meters requests at a modest rate, reported around 1,000 per hour as of 2026 (our own pages describe that limit as per key in one place and per IP in another, so verify it). Open Food Facts needs no key to read, only a custom `User-Agent` header identifying your app, and the project has said it intends to keep the API free and add no keys. The licence and coverage points below are integration constraints, not a knock on either project.\n\n## USDA FoodData Central vs Open Food Facts at a glance\n\n| Dimension | USDA FoodData Central | Open Food Facts |\n|---|---|---|\n| Core data | Foundation Foods, SR Legacy, Survey (FNDDS) foods as consumed, Branded Foods with GTIN/UPC fields | Global packaged and branded products keyed by barcode: ingredients, nutrition facts, Nutri-Score, allergens, labels, categories, images |\n| Coverage centre | US reference and lab-grade nutrient values for whole and branded foods | Global packaged goods, crowdsourced; depth varies by region |\n| Licence | Public domain, `CC0 1.0` — attribution requested, not required | `ODbL` database, `DbCL` contents, `CC-BY-SA` images — attribution required, share-alike applies |\n| Obligations on you | Effectively none | Credit the source, and a derived database combining its data may have to be released as open data |\n| Access | Free data.gov API key; shared `DEMO_KEY` for exploration | No key to read; a custom `User-Agent` identifying your app is required |\n| Rate limiting | Modest, reported around 1,000 requests per hour as of 2026 — per key or per IP, verify | No key, so no per-key quota is documented; your `User-Agent` is how the project identifies your traffic |\n| Barcode product | GTIN/UPC fields exist in Branded Foods, but it is not a consumer barcode-lookup product | Barcode lookup is the core call |\n| Natural-language parsing | None | None |\n| Accuracy model | Curated by a government agency | Volunteer-contributed, no accuracy or completeness guarantee |\n| Cost model | Genuinely free, not a free tier | Genuinely free, not a free tier |\n\n## Where USDA FoodData Central pulls ahead\n\nIts edge is authority plus the cleanest licence in the category. When a dietitian or a regulator asks where a nutrient value came from, \"the USDA FoodData Central Foundation Foods dataset\" ends the conversation. Foods-as-consumed entries from the Survey (FNDDS) dataset suit modelling real meals rather than raw ingredients, and SR Legacy remains a workhorse reference for whole foods.\n\nThe licence is the part people underrate. `CC0` means there is no copyright to comply with at all: you can ingest the whole thing, reshape it, blend it with your own proprietary data, ship it inside a closed-source product, and owe nobody anything. USDA requests credit; it does not require it. That is the reason USDA is the safe default for a commercial build that wants to keep its derived catalogue private.\n\nThe trade-off that decides it against Open Food Facts: it is a nutrient-reference database, not a food-logging engine. There is no natural-language meal parsing, no restaurant-menu product, and no consumer barcode-lookup product, so you build the logging experience and fill the coverage gaps yourself. The hourly rate limit is modest enough that a busy client-side integration will feel it, which usually means caching or mirroring the data rather than proxying every request.\n\n## Where Open Food Facts pulls ahead\n\nIts edge is barcode coverage nobody else gives away. Point it at a product code and you get the packaged-goods picture — ingredients, nutrition facts, Nutri-Score, allergens, labels, categories, and images — globally, with no key, no signup, and no quota negotiation. If your product's first interaction is a user holding a phone camera against a packet in a supermarket, this is the dataset that makes that feature exist on day one. It is also what wger uses for its own nutrition data.\n\nThe trade-offs come in two flavours. The first is data quality: entries are volunteer-contributed with no accuracy or completeness guarantee, and regional coverage is uneven, so a barcode that resolves perfectly in one market may miss in another. Design for the miss — a \"product not found, add it yourself\" path is part of the feature, not an error state. The second is the licence, and that one reaches your architecture.\n\n## The licence question: CC0 versus share-alike\n\nThis is the real fork in the road, and worth being precise about, because \"both are free\" hides it completely.\n\n`CC0` imposes no obligations. `ODbL` imposes two that matter to a product team. Attribution: you credit Open Food Facts. Share-alike: a derived database that combines Open Food Facts data with your own may have to be released as open data. That second one is not a payment problem you can solve with a purchase order — it is a design constraint on what your food catalogue is allowed to be.\n\nTwo notes keep this from being a blanket blocker. Commercial use is explicitly fine; ODbL is not a non-commercial licence. And the obligation attaches to the database, not to the application around it — though where your merged catalogue sits on that line is a question for counsel, not for a comparison page. This is general guidance, not legal advice.\n\nThe pattern that avoids the question entirely: keep the two sources in separate stores. USDA-derived tables stay yours because `CC0` says so; Open Food Facts lookups stay attributed and unmerged, queried live or cached as a distinct dataset rather than folded into a proprietary master catalogue. Teams that decide this on day one rarely think about it again.\n\n## Which should you pick?\n\nMatch the dataset to the job rather than hunting for a single winner:\n\n- **If you need authoritative nutrient values you can absorb into a closed-source product** with zero licence obligations, pick USDA FoodData Central and build the logging layer around it.\n- **If your core interaction is scanning a barcode on a packaged product**, especially outside the US, pick Open Food Facts and plan for attribution, share-alike, and missing entries.\n- **If you need both — and most food apps do — run both**, in separate stores so the ODbL obligation never touches your USDA-derived tables. USDA for reference nutrients, Open Food Facts for the packet in the user's hand, covers a surprising amount before you pay anyone. The [nutrition APIs roundup](/fitness-apis/nutrition-apis) shows where that combination still leaves gaps.\n- **If you need natural-language meal logging or restaurant and chain-menu depth**, neither of these has it. That is the commercial pair's territory — see [Nutritionix vs Edamam](/compare/nutritionix-vs-edamam) for that decision and [nutrition API pricing](/pricing/nutrition-api-pricing) for what the category costs.\n- **If you are wiring an LLM in front of either one**, neither parses free text, and that is fine: the durable pattern is to have the model resolve input to a row and let your server do the arithmetic. Both work well as that catalogue — [AI food logging](/ai/ai-nutrition-logging) sets out the shape.\n\nFor how these two sit against the rest of the no-cost landscape, see the [free and open-source fitness APIs](/fitness-apis/free-fitness-apis) roundup.\n\n## Watch the fine print\n\nRate limits, dataset names, endpoint shapes, and the exact licence variants on Open Food Facts images and contents all change. Everything volatile above — the roughly 1,000 requests per hour figure, the current USDA dataset list, and the precise `ODbL`, `DbCL`, and `CC-BY-SA` terms — is flagged \"as of 2026, verify.\" Read the licence text yourself before merging either dataset into anything you intend to keep private, and have counsel settle a share-alike question rather than resolving it from a table."
  },
  {
    "slug": "terra-vs-thryve",
    "primaryQuery": "terra vs thryve",
    "h1": "Terra vs Thryve: Which Wearable Data API for Your App?",
    "metaTitle": "Terra vs Thryve: Wearable API Pricing, BAA and Hosting",
    "metaDescription": "Terra vs Thryve as of October 2026: credits per connected source vs per-user euro plans, a BAA on every plan vs Enterprise, German hosting and webhooks.",
    "updated": "2026-10-17",
    "answer": "Terra and Thryve both connect wearables and phone health stores through one API, so the choice comes down to billing, compliance and plumbing. As of October 17, 2026, Terra starts at $399 a month billed annually with 100,000 credits, charges 200 credits a month per connected data source, lists its BAA on Enterprise, and can deliver to databases, cloud storage and queues as well as webhooks. Thryve's Start Up plan starts at 499 euros a month for 500 end users with 0.50 euros per extra user, includes a BAA on all plans and hosts all data in Germany, but stores data for only 2 weeks on Start Up and embeds its connect widget in an iframe.",
    "body": "Terra and Thryve both turn many wearables and phone health stores into one normalized API, and both publish prices. They differ on the billing unit, where the BAA sits, where the data lives and how the connect flow and webhooks work. Everything below is from Terra's and Thryve's own pages as we read them on October 17, 2026.\n\n## At a glance\n\n| Dimension | Terra | Thryve |\n|---|---|---|\n| Coverage claim | \"500+ providers\" on its site; its docs say the Unified API \"supports over 150+ Data Sources\" | \"500+ Wearables & Health Data Sources\" on its site; the data-sources table in its docs lists 24 sources, two of them marked EOL (our count) |\n| Phone health stores | A mobile SDK for Apple Health, Samsung Health and Health Connect | A native SDK for Apple Health, Samsung Health and Health Connect |\n| Entry price | $399 a month billed annually, or $499 monthly, with 100,000 credits | Start Up from 499 euros a month with 500 end users |\n| Billing unit | 200 credits a month per connected data source, plus events past a free allowance | End users: 0.50 euros per user past the plan's included number |\n| Trying it | 30-day money-back guarantee | 14-day free trial with 25 end users |\n| BAA | Listed on Enterprise | Included on all plans |\n| Where data lives | Enterprise lists a \"Dedicated instance to localised area\" | \"All data processed and stored by Thryve is hosted in Germany\" |\n| Connect flow | Hosted widget session from your backend; no WebView or iframe | Connection Widget embedded in an iframe |\n| Webhooks | Signed with HMAC; up to 10 retries over about 8 hours; 8-second timeout | zstd-compressed; optional HMAC secret; up to 3 retries; respond within 2 seconds |\n| Other destinations | SQL databases, Supabase, cloud storage, SQS and Kafka, MongoDB and Firestore | None named; without webhooks you call its API |\n| Beyond wearables | Blood and DNA test ordering (US and UK), a lab-report API | Analytics and algorithms as value-added services |\n\n## Where Terra wins\n\n**Delivery options.** Terra delivers \"to webhooks, SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore\", and \"Every webhook sent by Terra includes an HMAC-based signature header\". Its retry budget is larger: it \"retries the delivery up to 10 times with exponential backoff\", and \"The cumulative window across all retries is ~8 hours\". Thryve retries \"up to 3 times\", and \"Recurring failed deliveries within a certain timeframe will lead to the automatic disabling of webhooks.\"\n\n**Lab ordering.** Terra can \"Order blood and DNA tests for your users through Terra API\", in the US and the UK. We did not find test ordering on the Thryve pages we read.\n\n**The trade-off.** Terra's unit is the connected data source: \"An active authentication is one connected data source for one end user, and costs 200 Unified API credits per month\", so a user with a watch and a ring costs twice. By our arithmetic the 100,000 included credits cover 500 connected sources before events past the free allowance. Its BAA sits on Enterprise.\n\n## Where Thryve wins\n\n**The BAA on every plan.** Thryve's certifications page says \"Business Associate Agreements and Data Processing Agreements are standard on every plan\". For a HIPAA product that is the biggest difference on the two price sheets.\n\n**German hosting and two ISO certificates.** \"All data processed and stored by Thryve is hosted in Germany\", and its homepage claims compliance with \"GDPR, HIPAA, ISO 9001, 27001 and other international regulations\". Terra states that it is \"HIPAA compliant, GDPR compliant, and SOC 2 Type II certified\" and offers a localised dedicated instance on Enterprise.\n\n**Per-user plans with a startup tier.** Start Up starts at 499 euros a month for 500 users, and Scale Up, \"Special plan for startups with growth-stage needs (less than 10 years of founding)\", starts at 1,000 euros a month for up to 5,000 users. By our arithmetic, 5,000 one-source users cost about $4,899 a month on Terra at annual billing, against 2,749 euros on Thryve's Start Up or 1,000 euros on Scale Up if you qualify. We do not convert currencies; compare them at the rate you pay.\n\n**The trade-off.** Storage is short, 2 weeks on Start Up and 1 month on Scale Up, so keep your own history. The plan cards list custom auth credentials only on Scale Up and Enterprise, while Thryve's docs say that \"When no shared oAuth-client is available, you must bring your own oAuth-client\"; WHOOP, Dexcom and Google Health have none.\n\n## How the connect flow differs\n\nTerra's widget is a hosted page: you \"call POST https://access.tryterra.co/api/widget/session with your dev-id and x-api-key headers\" from your backend, send the user to the URL, and its docs say \"Do not use WebView or iFrame for the authentication flow.\" Thryve's is the opposite: \"The Connection Widget must be embedded in your app using an iframe component\", because \"Opening the URL in a new tab or window will prevent the widget from properly redirecting users back to your web app.\" You first \"create a Thryve user\", then call its widget endpoint with two Basic Auth headers. If your app already opens provider logins in the system browser, Terra's flow fits it as is; Thryve's needs a page that can host the iframe.\n\n## Your own provider credentials\n\n- **Terra** names \"WHOOP Dexcom Huawei Strava Virtuagym\" as providers that \"require special processes\", and its integrations table marks Garmin and Samsung as Required, though its homepage says Garmin data \"flows through Terra today\" through its long-standing partner integration.\n- **Thryve** marks WHOOP, Dexcom, Google Health and FreeStyle Libre (LibreView) without a shared OAuth client, while Garmin and Oura use Thryve's. Its table also marks Fitbit \"Deprecating on Oct 29 2026\".\n\n## What we could not verify\n\n- **Thryve's per-user rate.** The Start Up card says \"Additional users billed at €0.50 each\" in its description and \"€0.50 per additional user\" in its feature list (as we read it on October 22, 2026), and neither names a billing period.\n- **Thryve's webhook signature format.** The docs say an HMAC secret can be configured, but the pages we read do not describe the header or algorithm.\n- **Fitbit on Thryve after October 29.** The docs mark the deprecation without saying how existing connections carry over.\n\n## Which should you pick?\n\n- **A HIPAA product that needs a BAA from the first plan:** lean Thryve, which includes it on all plans; on Terra it is an Enterprise line.\n- **Data that should stay in Germany or the EU by default:** Thryve hosts in Germany; ask Terra about its localised dedicated instance on Enterprise.\n- **Data pushed straight into your warehouse, queue or cloud storage:** lean Terra.\n- **Lab or DNA tests ordered for your users:** Terra.\n- **Users who connect several sources each:** Thryve's plans count end users, while Terra counts each connected source; confirm how Thryve counts a user with several devices.\n\nFor the rest of the field, see [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis), [Thryve API pricing](/pricing/thryve-api-pricing) and the [Terra integration guide](/integrate/terra-api).\n\n## Bottom line\n\nTerra is the broader delivery and diagnostics platform, priced in dollars per connected source. Thryve is the compliance-first choice, priced in euros per end user, with the BAA on every plan and data hosted in Germany, at the cost of short storage windows and an iframe-based connect flow. Re-read both live pricing pages before you commit; these figures are from October 17, 2026.",
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
        "a": "Thryve says all data it processes and stores is hosted in Germany. Terra's Enterprise plan lists a dedicated instance in a localised area; the Terra pages we read on October 17, 2026 do not name a default hosting region, so ask Terra where your data would live."
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
    "body": "This is not two vendors with different price sheets. Terra is a managed API you pay for; Open Wearables is MIT-licensed software from Momentum that you deploy and run yourself, with paid Pro and Enterprise plans on top. Everything below is from Terra's pages, Open Wearables' site, docs and GitHub README as we read them on October 17, 2026, except Terra's pricing page and Open Wearables' pricing, FAQ, comparison and webhooks pages, which we re-read on October 27, 2026 after they changed. Open Wearables gives no date for the change: the Pro plan was not on its pricing page when we read it on October 17, 2026, and its FAQ and webhooks page then still called outbound webhooks in development.\n\n## At a glance\n\n| Dimension | Terra | Open Wearables |\n|---|---|---|\n| What you get | A managed API | MIT-licensed software you host; \"each deployment serves a single organization\" |\n| Price | $399 a month billed annually, or $499 monthly, with 100,000 Unified API credits | Core \"$0 Forever\"; Pro \"From $999 a month, per deployment\"; Enterprise \"Custom\", on an annual agreement |\n| Cloud providers | \"500+ providers\" on its site; its docs say \"over 150+ Data Sources\" | Garmin, Oura, Whoop, Suunto, Polar, Ultrahuman, Strava, Fitbit, Withings and Google Health |\n| Phone health stores | A mobile SDK for Apple Health, Samsung Health and Health Connect | Native SDKs for Apple Health, Samsung Health and Health Connect |\n| Provider credentials | Terra-managed keys for many sources; special processes for WHOOP, Dexcom, Huawei, Strava and Virtuagym | Yours for every cloud provider |\n| Dexcom | Supported, through your own Dexcom developer app | \"Not in the open-source project today\"; continuous glucose is on its roadmap |\n| Delivery | Signed webhooks, SQL databases, Supabase, cloud storage, SQS and Kafka, MongoDB and Firestore | Its API, an MCP server, and signed outbound webhooks with retries |\n| Labs | Blood and DNA test ordering | None listed |\n| Health scores | An add-on, from $499 a month on Quick Start | Part of Pro, computed inside your deployment |\n| BAA | Listed on Enterprise | On Enterprise, where your cloud provider and scope support it |\n| Where data lives | Terra's platform; Enterprise lists a \"Dedicated instance to localised area\" | Your own cloud account, in the region you choose |\n| Maturity | Publishes an OpenAPI spec | \"an early-stage project under active development\"; APIs \"may change before version 1.0\" |\n\n## Where Terra wins\n\n**Nothing to run.** Terra is a hosted service: \"Subscriptions start from $399 per month billed annually, or $499 per month billed monthly.\" Open Wearables' Core is free, but its FAQ says \"There is no hosted version, and that is the design rather than a gap\", so hosting, monitoring, security patches and upgrades are yours unless you pay Momentum: its Deployment service starts at $4,800, one-time, and Enterprise is where \"We run and secure it in your cloud, under an SLA.\"\n\n**Fewer provider applications.** \"Terra manages API Keys of data sources, meaning you can connect users without having to apply for each API Key\", and its homepage says \"Garmin data flows through Terra today\" through a long-standing partner integration, although its integrations table still marks Garmin as Required. Open Wearables' FAQ answers \"Do we need our own developer account with each provider?\" with \"Yes. The app is registered in your name\"; its docs say \"You must apply for Garmin Developer Program\", and provider approval takes \"From days to months, depending on the provider and on what you are building.\"\n\n**Breadth beyond wearables.** Terra supports Dexcom, orders blood and DNA tests, and delivers straight into databases, cloud storage and queues. Open Wearables says Dexcom is \"Not in the open-source project today\", with continuous glucose \"on the roadmap rather than in the product\", and on FHIR: \"It is not a FHIR server, and EHR-ready FHIR output is on the roadmap.\"\n\n**Certifications.** Terra says it \"is HIPAA compliant, GDPR compliant, and SOC 2 Type II certified\". Open Wearables answers \"Do you hold SOC 2 or ISO 27001?\" with \"No. The deployment runs inside your certified environment\".\n\n## Where Open Wearables wins\n\n**No licence fee and no per-user bill.** Its docs put it as \"Self-hosted, MIT license, $0 per user\", and its pricing FAQ answers \"Is the free version really free?\" with \"Yes. MIT license, full source, no trial window.\" Even the paid tier does not grow with users: \"Pro is priced per deployment rather than per user\". Terra's bill grows with every connected data source: \"An active authentication is one connected data source for one end user, and costs 200 Unified API credits per month\".\n\n**Data that never leaves your cloud account.** Open Wearables' FAQ says \"Where you self-host on Core, there is no processing for us to agree to, because we never touch it.\" It does send \"a small anonymous usage ping once a day (plus one on startup)\", which \"contains only aggregate, bucketed counts and configuration flags, never health data, user data or credentials\", and the README documents how to turn it off.\n\n**An MCP server in the free tier.** Core includes an \"Admin panel and MCP server\", and its FAQ says you can \"point the MCP server at your deployment so an assistant can look things up in plain language without you writing the retrieval layer.\" Terra offers an MCP server of its own through its AI Interface. Health scores are a paid extra on both sides: Terra sells them as an add-on, and Open Wearables says \"Health scores come with Pro\", \"computed inside your deployment\".\n\n## Webhooks on both sides\n\nTerra documents signed, retried delivery: \"Every webhook sent by Terra includes an HMAC-based signature header\", and Terra \"retries the delivery up to 10 times with exponential backoff\". Open Wearables now describes outbound webhooks as shipped on every page we read. Its FAQ says \"Yes, in both directions. Incoming webhooks receive provider pushes, and outgoing webhooks notify your systems with full delivery history\", and its webhooks page says it \"pushes each event to your endpoint once it is saved in your deployment, signed, retried if your service was down, with every attempt there to inspect.\" They are \"off by default\"; you \"Set OUTGOING_WEBHOOKS_ENABLED=true in the backend environment and restart.\" Its README adds \"In production, pin the official images to a specific release version\", so check the release you pin.\n\n## On Open Wearables' comparison page\n\nOpen Wearables publishes its own comparison with the hosted APIs. It says \"Coverage and pricing vary\", that for its rivals' prices \"Their pricing is published on their own pages and it changes, so read it there\", and that \"Several of them hold certifications we do not.\" By the two vendors' own pages, the practical gaps today are Dexcom and lab ordering, which Terra has and Open Wearables does not list.\n\n## Compliance\n\nSelf-hosting moves the compliance work to you rather than removing it. Open Wearables' Enterprise plan lists \"GDPR tooling, signed DPA and BAA\", and its FAQ says \"A BAA comes with Enterprise, where your cloud provider and your scope support it.\" Terra lists a signed BAA on Enterprise. Whether you need one depends on your role under HIPAA; our [HIPAA compliance guide for fitness apps](/compliance/hipaa-compliance-fitness-app) explains when that applies. This is general information, not legal advice.\n\n## Which should you pick?\n\n- **Health data must stay on infrastructure you control, and you have the engineers to run it:** Open Wearables.\n- **You want to ship this quarter without registering with every provider:** Terra, after checking its credential list for your providers.\n- **Dexcom, lab tests or delivery into your warehouse:** Terra.\n- **Many users, each a cost on a per-source bill:** model both; Open Wearables' Core has no licence fee and Pro is priced per deployment, but price your own hosting and on-call before calling it cheaper.\n- **A vendor that holds SOC 2 itself:** Terra; Open Wearables holds neither SOC 2 nor ISO 27001.\n\nFor managed alternatives, see [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) and the [Terra integration guide](/integrate/terra-api).\n\n## Bottom line\n\nTerra sells breadth and convenience by the connected source; Open Wearables gives you the code and the responsibility, and now sells health scores and support on top by the deployment. Pick by who should run the stack and hold the provider relationships, then re-check both projects' live pages, because Open Wearables' APIs are still pre-1.0 and both vendors' prices are as of October 27, 2026.",
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
        "note": "Open Wearables licence"
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
    "body": "Terra and Sahha both sit between your app and your users' health data, but they lead with different things. Terra's pitch is breadth: \"One API call returns standardised data from 500+ providers\". Sahha's is interpretation: \"From phones and 800+ devices to biomarkers, scores, archetypes, tags and insights your product can act on.\" Everything below is from the two vendors' own pages as we read them on October 17, 2026.\n\n## At a glance\n\n| Dimension | Terra | Sahha |\n|---|---|---|\n| Lead product | Normalized data from wearables, apps and phone health stores | Biomarkers, scores, archetypes, tags and insights |\n| Coverage claim | \"500+ providers\" on its site; its docs say \"over 150+ Data Sources\" | \"800+ devices across 165 integrations\" |\n| Users without a wearable | Data comes from the sources a user connects | The phone itself is \"a passive sensor for sleep, activity, and behavior\" |\n| Server-side cloud connections | The core of the product, with Terra-managed keys for many sources | \"For select providers\", and those integrations \"are in public beta and are Sandbox only\" |\n| Entry price | $399 a month billed annually, or $499 monthly, with 100,000 credits | Starter at $299 a month billed annually with 1,000 users |\n| Billing unit | 200 credits a month per connected data source, plus events past a free allowance | Users: $0.40 each past 1,000 on Starter, $0.20 each past 10,000 on Pro |\n| Free start | 30-day money-back guarantee; testing environments capped at 50 users | 30-day free trial on every plan (pricing page, October 27, 2026) |\n| Scores | An add-on, from $499 a month on Quick Start | 5 scores on every plan |\n| BAA | Listed on Enterprise | Included from Pro, at $1,499 a month billed annually |\n| Webhooks | HMAC signature header; up to 10 retries over about 8 hours | HMAC-SHA256 signature; up to 5 retries with exponential backoff |\n| Labs | Blood and DNA test ordering, US and UK | None listed |\n\n## Where Terra wins\n\n**Server-side coverage you can use in production.** Terra's model is cloud connections run by Terra: \"Terra manages API Keys of data sources, meaning you can connect users without having to apply for each API Key\", and \"Garmin data flows through Terra today\". Sahha says it \"also connects directly through their cloud API\" for select providers, but its docs say those integrations \"are in public beta and are Sandbox only\", and each one runs on an app you register with the provider. If you need Garmin, Oura or WHOOP data without your users installing your app, Terra is the one that offers it in production today.\n\n**More delivery options and diagnostics.** Terra delivers \"to webhooks, SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore\", and can \"Order blood and DNA tests for your users through Terra API\". Its data types run from \"sleep stages and latency\" to \"per-set strength training\".\n\n**The trade-off.** You pay per connected data source, and scores cost extra: \"Health scores are an add-on for Quick Start plans. Starting from $499 / month\".\n\n## Where Sahha wins\n\n**Users without a wearable.** Sahha's answer to \"do my users need a wearable?\" is \"No. Sahha turns the smartphone itself into a passive sensor for sleep, activity, and behavior.\" For a mass-market app where most users own only a phone, that is a different starting dataset, not just a cheaper one.\n\n**Interpretation included.** Every Sahha plan includes \"Biomarkers 100+ Scores 5 Archetypes 100+ Tags 75+ Insights 100+\". On Terra, scores are a separate add-on.\n\n**A lower, per-user bill.** Starter is $299 a month billed annually with 1,000 users, then \"$0.40/user\"; Pro is $1,499 with 10,000 users, then \"$0.20/user\". By our arithmetic, with one source per person and annual billing:\n\n| Users | Terra | Sahha |\n|---|---|---|\n| 1,000 | About $899 ($399 plus 100,000 extra credits at $0.005) | $299 on Starter |\n| 5,000 | About $4,899 ($399 plus 900,000 extra credits) | $1,499 on Pro, or about $1,899 on Starter |\n\nThose are list-price calculations, not quotes, and Sahha's page does not define a user in the text we fetched.\n\n**A BAA below Enterprise.** \"The DPA is included on every plan. A BAA is included from Pro.\" Terra lists its signed BAA on Enterprise.\n\n**The trade-off.** Sahha's data mostly arrives \"on-device through Apple Health or Health Connect\", so your app with Sahha's SDK has to be on the user's phone, and data retention is 30 days on Starter and 120 on Pro.\n\n## Webhooks and signatures\n\nBoth sign their webhooks. Terra says \"Every webhook sent by Terra includes an HMAC-based signature header\" and \"retries the delivery up to 10 times with exponential backoff\". Sahha tells you to \"Compute an HMAC-SHA256 hash of the raw request body using your secret key, then compare it to the signature in the header\", and says \"Failed deliveries are retried up to 5 times with exponential backoff\". Sahha also batches score and biomarker updates: its webhook interval \"acts as a deduplication window\".\n\n## What we could not verify\n\n- **Sahha's definition of a user.** Its pricing page lists the question \"What counts as a user?\", but the answer did not appear in the text we fetched.\n- **When Sahha's cloud integrations leave beta.** The docs say beta and sandbox only, with no date.\n- **Terra's default hosting region.** The Terra pages we read name a localised dedicated instance on Enterprise but no default region.\n\n## Which should you pick?\n\n- **Most of your users have a phone but no wearable:** lean Sahha.\n- **You want scores and insights without building them:** lean Sahha, where they come with every plan.\n- **You need server-side Garmin, Oura or WHOOP data in production, or many sources per user:** lean Terra.\n- **Lab tests, or data delivered into your own database or queue:** Terra.\n- **A HIPAA product on a mid-size budget:** compare Sahha's Pro, which includes the BAA, with Terra's Enterprise quote.\n\nSee [Sahha API pricing](/pricing/sahha-api-pricing), the [Terra integration guide](/integrate/terra-api) and [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) for the rest of the field.\n\n## Bottom line\n\nTerra is the broader data pipe, billed per connected source; Sahha is the phone-first signal layer, billed per user, with scores and a lower BAA tier included. Pick by where your users' data starts, then re-read both live pricing pages, because these figures are from October 17, 2026.",
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
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that competes with both QuickPose and Sency.** Neither product on this page is ours, and we have no reason to prefer either; KinesteX appears only in the closing section, labelled. Every fact below comes from the two vendors' own GitHub repositories, package registries and published pages as fetched on October 17 and 18, 2026. Sency's pricing and FAQ pages were read through a text reader, because the part of those pages our snapshot tool extracts holds only a contact form; an automated check re-tests every quoted passage against the live pages.\n\n## Two different shapes of the same idea\n\nBoth sell camera-based movement tracking for fitness and health apps, both run as native SDKs inside your app rather than as an embedded web view, and both cover iOS, Android and React Native. The difference is where each stops.\n\n**QuickPose is a toolkit on top of MediaPipe.** Its README describes \"developer-oriented cutting edge ML features of MediaPipe and BlazePose\", and its Swift package ships MediaPipe lite, full and heavy libraries as modules. What it adds is a layer of building blocks: overlays, range-of-motion measurement for shoulders, hips, knees, back and neck, counters for 20 named exercises, body-position feedback and gesture inputs. Your app owns the product around them.\n\n**Sency is a motion product with two front ends.** Its Custom Kit (SMKit) is a \"Native no-UI SDK\" where, per the iOS demo, you own the camera preview, session lifecycle, exercise UI, skeleton rendering and results. Its Branded Kit (SMKitUI) is a white-label UI where the whole experience is ready to use. Around both sit assessments, monthly progress evaluations and personalized workout plans, which is a layer QuickPose's repositories do not have.\n\n## QuickPose vs Sency at a glance\n\n| | QuickPose | Sency |\n| --- | --- | --- |\n| What it is | MediaPipe and BlazePose wrapped with fitness building blocks | Motion SDK with assessments and workouts; no-UI Custom Kit or white-label Branded Kit |\n| Platforms | iOS 14.0+; Android API 26 (sample code API 28); React Native plugin | iOS, Android, React Native, Flutter; JavaScript and Unity marked \"NA\" |\n| iOS floor | iOS 14.0 | iOS 16.0 in the Custom Kit's demo Podfile; iOS 15 or later for SMKitUI |\n| Models | MediaPipe libraries ship inside the SDK modules; product pages describe on-device inference | Downloaded from Sency's server at configuration; no bundled fallback; a valid cache works offline later |\n| Built-in UI | Overlays and SwiftUI camera utilities | None in SMKit; a full white-label experience in SMKitUI |\n| Fitness layer | Exercise counters, range of motion, feedback events, gestures | Assessments, progress evaluations, workout plans, body calibration, adaptive range of motion |\n| Pricing published | Yes: free for 10 monthly active devices, then $25 to $1,000 a month up to 100,000 devices | Yes, on two pages that differ: Starter free up to 100 monthly active users and Growth from $499 a month up to 3,800 on one; a free trial, then a minimal monthly fee covering up to 100 active users, on the other |\n| Billing unit | Monthly active device | Monthly active user |\n| Getting a key | Free signup at dev.quickpose.ai | Key emailed after you subscribe to a plan; sign-up starts from a contact form |\n| Licence | Apache-2.0 on the iOS repo; terms license the SDK under Apache 2.0 with fees; npm plugin MIT | Proprietary: Sency's Terms of Use; commercial or production use needs a separate paid agreement |\n| Distribution | Swift Package Manager or CocoaPods from GitHub, Maven (ai.quickpose), npm @quickpose/react-native | CocoaPods and SPM from Sency's Bitbucket, Maven (com.sency), npm @sency/react-native-smkit and -ui, pub.dev flutter_smkit and flutter_smkit_ui |\n| Recent releases | npm plugin 0.7.1 on 2026-08-26; iOS and Android repos pushed late August 2026 | npm UI package 2.4.3 and Flutter UI 1.6.0 on 2026-09-23 |\n\n## Where QuickPose wins\n\n**A far cheaper first paid step, and you can start today.** QuickPose's paid plans start at $25 a month for up to 100 monthly active devices and rise in small steps, every SDK feature is on every plan, and its SDK key is free to register. Sency's first published paid plan, Growth, starts from $499 a month; its key arrives by email after you subscribe to a plan, and its sign-up path runs through a contact form. For a small team launching on a few hundred phones, that difference is decisive.\n\n**The models are inside your app.** QuickPose's modules bundle MediaPipe, and its product pages describe on-device inference with no frames sent to a server. Sency's FAQ also says data is analyzed on the user's device and never sent to the cloud, but its iOS and Android SDKs fetch their models from Sency's server on first configuration, so a cold first launch with no connection cannot track.\n\n**A lower iOS floor and an open licence on the code.** iOS 14 against Sency's iOS 15 or 16, and Apache-2.0 iOS code under terms that license the SDK under Apache 2.0, against Sency's proprietary Terms of Use.\n\n**Measurement breadth.** Range of motion for five joint groups and counters for 20 exercises are exposed as building blocks you can recombine, which suits biomechanics, physio-style measurement and custom exercise logic.\n\n## Where Sency wins\n\n**Flutter.** Sency ships Flutter packages for both kits; QuickPose's public packages cover iOS, Android and React Native.\n\n**A finished experience if you want one.** SMKitUI is a white-label experience that is ready to use. QuickPose gives you overlays and camera utilities, but the screens, flow and content are yours to build.\n\n**Assessments and plans.** Sency's README leads with movement and fitness assessments, monthly progress evaluations and personalized workout plans, and its pricing page describes an assessment that takes less than 4 minutes. QuickPose has measurement primitives but no assessment or plan layer in its repositories.\n\n**A bigger free allowance, if the packages page applies.** Sency's pricing packages page lists a free Starter plan for up to 100 monthly active users with full access to the SDK, against QuickPose's free tier of 10 devices. Sency's main pricing page instead describes a free trial followed by a minimal monthly fee covering up to 100 active users, so confirm which applies; [Sency pricing](/pricing/sency-pricing) sets out both.\n\n**Billing by person, not device.** Sency counts each active user once a month and says it charges no extra for heavy use. For an audience that trains on several devices, a per-user unit can be simpler than QuickPose's per-device one.\n\n**Tooling for AI-assisted development.** Sency's iOS documentation describes an MCP server that gives AI coding tools its SDK documentation and exercise context.\n\n## Which should you pick?\n\n- **You want building blocks and full control of the product** → QuickPose. Its counters and measurements slot into your own UI, and the models ship with the app.\n- **You want assessments, plans or a ready-made UI** → Sency, Branded Kit for speed, Custom Kit if you want to own the screens but keep Sency's analysis.\n- **You ship Flutter** → Sency, unless you are willing to bridge QuickPose's native SDKs yourself.\n- **Offline from the very first launch, or pinned model files** → QuickPose, or MediaPipe directly.\n- **You need a browser target** → neither, from what is public. Sency marks JavaScript \"NA\", and QuickPose's documentation home mentions Wasm SDKs, but the only QuickPose package we found on npm is its React Native plugin and there is no public web repository. See [MediaPipe alternatives](/alternatives/mediapipe-alternatives) for browser-capable models, and note that KinesteX, which funds this site, embeds its experience in a web page through an iframe; [KinesteX vs Sency](/compare/kinestex-vs-sency) and [KinesteX vs QuickPose](/compare/kinestex-vs-quickpose) cover it with the same disclosure.\n\n## What neither vendor publishes\n\nNeither publishes an independent accuracy benchmark, and we have not measured either. Sency's pricing page mentions a record of 54 minutes from installing the SDK to a working assessment in a partner's app, which is a claim about integration speed, not accuracy. Test both on your own recorded exercises before you choose; [how to evaluate motion SDKs](/guides/evaluate-motion-sdks) sets out a protocol. [QuickPose pricing](/pricing/quickpose-pricing) and [Sency pricing](/pricing/sency-pricing) have the full plan tables, including the second page from each vendor that disagrees with its main price list. Everything above was read on October 17 and 18, 2026; both vendors shipped releases in the six weeks before that, so re-check versions, floors and prices before you commit.",
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
      "pitch": "Both of these SDKs shipped releases in the six weeks before we checked. Subscribe and we will flag it when a platform, model delivery, licence or price changes."
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
        "note": "Apache 2.0 licence clause and fees (snapshot)"
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
  }
,
  {
    "slug": "mediapipe-vs-movenet",
    "primaryQuery": "movenet vs mediapipe",
    "h1": "MediaPipe vs MoveNet: 33 Landmarks in 3D or 17 Keypoints Fast?",
    "metaTitle": "MoveNet vs MediaPipe (2026): Which Pose Model to Ship?",
    "metaDescription": "MoveNet vs MediaPipe BlazePose from Google's own cards and TF.js docs: 17 vs 33 keypoints, 3D world landmarks, browser FPS on the same devices, licences.",
    "updated": "2026-10-22",
    "answer": "Pick MediaPipe Pose Landmarker (BlazePose) when you need geometry: it returns 33 landmarks with hip-centred 3D world coordinates in meters, so joint angles hold up when the user turns. Pick MoveNet when you need speed and simplicity: it returns the 17 COCO keypoints in 2D, and in the TF.js team's own browser benchmark MoveNet Lightning out-ran every BlazePose figure on an iPhone 12 and a Pixel 5. Both are Apache-2.0 Google models aimed at fitness, both are single-person apart from MoveNet MultiPose, and the TF.js pose-detection package serves both behind one API, so you can test each on your own devices before committing.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that sits a layer above pose models like these.** Neither model on this page is ours, both are free Google projects, and we have no reason to prefer either. Every fact below comes from Google's model cards, the google-ai-edge/mediapipe repository and the tensorflow/tfjs-models repository, read on October 22, 2026.\n\nA short version of this decision sits in [the pose models overview](/motion/pose-estimation-models-compared#mediapipe-vs-movenet-head-to-head). This page goes further on the four things that settle it in practice: what each output lets you compute, how fast each runs on the same hardware, how their keypoint numbering differs, and what a switch costs.\n\n## MediaPipe vs MoveNet at a glance\n\n| | MediaPipe Pose Landmarker (BlazePose GHUM) | MoveNet |\n| --- | --- | --- |\n| Keypoints | 33 landmarks | 17 COCO keypoints |\n| Per point | x, y, z, visibility, presence | y, x, confidence |\n| 3D | World landmarks in meters, origin between the hips; the card says z is \"not metric but up to scale\" | None |\n| Variants | Lite, Full, Heavy | SinglePose Lightning (192x192), SinglePose Thunder (256x256), MultiPose Lightning |\n| People | One, per the model card; the Tasks `num_poses` option defaults to 1 | One for SinglePose; up to 6 for MultiPose |\n| Camera distance | People beyond about 14 feet or 4 meters are out of scope | Most suitable 3 to 6 feet from a webcam |\n| Runtimes | MediaPipe Tasks on Android, iOS, web and Python; also the TF.js pose-detection package | TF.js pose-detection in the browser; TF Lite on device |\n| Licence | Apache-2.0 (framework and model card) | Apache-2.0 (tfjs-models code and SinglePose card); no licence line in the MultiPose card text |\n\nBoth are built for this domain. Google's BlazePose GHUM card lists \"Fitness and repetition counting\" among its application domains, and the MoveNet SinglePose card says the model is \"Tuned to be robust on detecting fitness/fast movement with difficult poses and/or motion blur.\"\n\n## What each output lets you compute\n\n**MediaPipe has points MoveNet does not.** Sixteen of its 33 landmarks are outside COCO's 17: the inner and outer eye corners, the mouth corners, the pinky, index and thumb knuckles, the heels and the foot index points. Heel and toe points are the inputs a heel-lift check or an ankle angle needs, and the hand points let you read wrist position.\n\n**It also adds a third axis.** MediaPipe's Pose documentation describes world landmarks as \"Real-world 3D coordinates in meters with the origin at the center between hips\", and the TF.js pose-detection README places BlazePose's `keypoints3D` in a 2 x 2 x 2 meter space with the hip centre at (0, 0, 0). The model card is plain about the limit: the z value comes from synthetic data fitted with the GHUM body model, and is up to scale rather than metric. In our reading that is still enough to keep a knee or hip angle meaningful when the user turns side-on, which a 2D angle from MoveNet cannot do. [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation) covers when the depth axis is worth having.\n\n**MoveNet gives you less, faster.** The SinglePose card describes a float32 output of shape [1, 1, 17, 3]: y and x normalized to the frame, then a confidence score, with a recommended default confidence threshold of 0.3. For counting reps from elbow or knee angles in a well-framed side view, 17 points are enough; [how rep counting works](/motion/how-rep-counting-works) shows the logic.\n\n## Speed: the one like-for-like table\n\nThe model cards do not cross-compare. BlazePose's card reports frames per second on a Pixel 3 through TFLite, and MoveNet's reports milliseconds in desktop Chrome. The TF.js pose-detection package is the exception: its MoveNet and BlazePose READMEs publish frames per second for both models on the same four machines, a 2019 15-inch MacBook Pro, an iPhone 12, a Pixel 5 and a desktop with an Intel i9-10900K and a GTX 1070.\n\n| Model and runtime | MacBook Pro | iPhone 12 | Pixel 5 | Desktop |\n| --- | --- | --- | --- | --- |\n| MoveNet SinglePose Lightning, WebGL | 104 | 51 | 34 | 87 |\n| MoveNet SinglePose Thunder, WebGL | 77 | 43 | 12 | 82 |\n| BlazePose, MediaPipe runtime (WASM and GPU) | 92, 81, 38 | N/A | 32, 22, N/A | 160, 140, 98 |\n| BlazePose, TF.js runtime (WebGL) | 48, 53, 28 | 34, 30, N/A | 12, 11, 5 | 44, 40, 30 |\n\nThe BlazePose README gives three figures per cell, one per model variant, but does not label which is lite, full or heavy; the MoveNet README labels its own order. Read with that caveat, the table says something the cards cannot. MoveNet Lightning is the fastest option on both phones. It is not the fastest everywhere: on the desktop, BlazePose under the MediaPipe runtime reached 160 FPS against Lightning's 87, and on the MacBook and the Pixel 5 BlazePose's best figure beats MoveNet Thunder. These are the TF.js team's browser numbers on its own hardware, so measure on your target devices; [real-time pose estimation](/motion/real-time-pose-estimation) covers the frame-rate budget. Accuracy does not line up either: the cards use different metrics and test sets, and Google's own quality table for BlazePose compares it with AlphaPose and Apple Vision, not MoveNet. [Pose estimation accuracy](/motion/pose-estimation-accuracy) explains the metrics.\n\n## Same names, different numbers\n\nBoth models return COCO's 17 body points, but not at the same indices. MoveNet follows the COCO order, so `left_hip` is index 11. In MediaPipe's `PoseLandmark` enum, `LEFT_HIP` is 23 and index 11 is `LEFT_SHOULDER`. Code that reads keypoints by position will silently read the wrong joint after a switch.\n\nMap by name instead. The TF.js package returns a `name` with every keypoint, and [the keypoint crosswalk](/pose-keypoints#crosswalk) joins all 17 COCO points to their BlazePose counterparts. The full orders are in [the BlazePose 33 keypoint map](/pose-keypoints/blazepose-33) and [the COCO 17 keypoint map](/pose-keypoints/coco-17).\n\n## What a switch costs\n\nIn a browser, little. The pose-detection README serves MoveNet, BlazePose and PoseNet through one `createDetector` call, and every model returns the same pose shape: a score and keypoints with x, y, score and name, with BlazePose adding `keypoints3D` and a segmentation mask. Testing both behind a flag is cheap. Two details can still decide it:\n\n- **React Native.** The BlazePose-MediaPipe README says it \"uses WebAssembly behind the scene and cannot be used with\" tfjs-react-native. MoveNet's `modelUrl` option accepts an `io.IOHandler`, which its README pairs with tfjs-react-native's `bundleResourceIO` to load the model from the app bundle.\n- **Download size.** The BlazePose README lists 10.6 MB, 14 MB and 34.9 MB for the lite, full and heavy models under the MediaPipe runtime. The MoveNet README publishes no equivalent table, so weigh your own build.\n\nNatively, the routes differ more: MediaPipe ships through its Tasks libraries for Android, iOS and Python, while MoveNet's cards name TensorFlow Lite for on-device use. Variant choice within each family is in [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models) and [MoveNet models](/motion/movenet-models).\n\n## Which should you pick?\n\n- **Squat depth, hip hinge, heel lift, or any movement where the user may turn side-on** → MediaPipe. Its world landmarks and foot points are the inputs that math needs.\n- **Live rep counting on low-end phones or in a mobile browser** → MoveNet Lightning, the fastest of the pair on both phones in the TF.js table.\n- **A desktop or laptop browser, such as a kiosk** → test BlazePose under the MediaPipe runtime first; on the TF.js team's desktop it out-ran both MoveNet models.\n- **Two to six people in frame** → MoveNet MultiPose Lightning, the only model in this pair whose card covers several people. Confirm its terms, since the text of its card has no licence line.\n- **A user standing well back from the camera** → MediaPipe. MoveNet's cards call it most suitable 3 to 6 feet away, while BlazePose's card only rules out people further than about 14 feet.\n- **React Native through TF.js** → MoveNet, whose README documents loading from the app bundle.\n\n## What neither gives you\n\nBoth return keypoints and nothing more. Rep counting, form rules, mistake feedback and exercise content are yours to build, or to buy as an SDK; [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) compares the products that sell that layer, and [build vs buy AI motion tracking](/motion/build-vs-buy-ai-motion-tracking) sets out the trade.",
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
        "note": "world landmarks in meters from the hip centre; quality table compared with AlphaPose and Apple Vision"
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
        "note": "up to 6 people; no licence line in the text"
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
    "answer": "Pick MediaPipe Pose Landmarker (BlazePose) for one person in front of a phone camera: 33 landmarks with hip-centred 3D world coordinates, on-device on Android, iOS, web and Python, under Apache-2.0. Pick Ultralytics YOLO26 pose when several people share the frame: one model returns a box and the 17 COCO keypoints for every person it detects, in five sizes, and Ultralytics documents training it on your own keypoints. The licence often decides first, because Ultralytics code is AGPL-3.0 unless you buy its Enterprise License.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that sits a layer above pose models like these.** Neither model on this page is ours, and we have no reason to prefer either. MediaPipe facts come from Google's BlazePose GHUM model card and the google-ai-edge/mediapipe repository; Ultralytics facts come from the docs, README and LICENSE in the ultralytics/ultralytics repository. All were read on October 22, 2026, and every Ultralytics figure is Ultralytics' own.\n\nA note on names, since searches mix them: BlazePose is the model family behind MediaPipe Pose, which Google's documentation says is built on its BlazePose research, and the current packaging is the MediaPipe Pose Landmarker task. On the other side, Ultralytics' pose docs now present YOLO26 as the current generation of YOLO pose models.\n\n## Two models for two different scenes\n\n**MediaPipe is built for one person.** Google's model card describes \"3D full body pose estimation for single-person videos on mobile, desktop and in browser\", says the model \"Tracks only one person on scene if multiple present\", and lists multiple people in an image as out of scope. The Tasks API has a `num_poses` option, but it defaults to 1 and the card does not evaluate more.\n\n**YOLO pose is built for everyone in the frame.** Ultralytics documents one `Results` object per image, with `result.keypoints` shaped (N, K, 2 or 3), N instances of K keypoints, and `result.boxes` for \"the detected instances that those keypoints belong to\". The training config's only class is person, and the default models predict the 17 COCO keypoints for each one.\n\n## MediaPipe vs YOLO pose at a glance\n\n| | MediaPipe Pose Landmarker (BlazePose GHUM) | Ultralytics YOLO26 pose |\n| --- | --- | --- |\n| Keypoints | 33 landmarks | 17 COCO keypoints in the default models |\n| Per point | x, y, z, visibility, presence; world landmarks in meters | x, y, plus optional visibility or confidence |\n| People | One, per the model card | Every detected person, each with a box |\n| Sizes | Lite, Full, Heavy | n, s, m, l, x |\n| Published speed | Frames per second on a Pixel 3 through TFLite | Milliseconds on a CPU with ONNX and on an NVIDIA T4 with TensorRT10 |\n| Deployment | MediaPipe Tasks on Android, iOS, web and Python | Export table of 23 formats, including ONNX, CoreML, LiteRT, NCNN, ExecuTorch and TensorRT |\n| Your own keypoints | Pre-trained models; no pose training recipe in the files we read | Training on your own keypoint datasets is documented |\n| Licence | Apache-2.0 | AGPL-3.0, or a paid Ultralytics Enterprise License |\n\n## Where MediaPipe wins\n\n**Depth and detail on one body.** Of the 33 landmarks, 16 are not in COCO's 17: eye corners, mouth corners, three knuckles per hand, heels and foot index points. MediaPipe's documentation describes world landmarks as \"Real-world 3D coordinates in meters with the origin at the center between hips\". The card is honest that z is \"not metric but up to scale\", but in our reading it still lets a knee or hip angle survive the user turning side-on. Ultralytics' results table documents only 2D coordinates: pixel and normalized x, y, plus an optional visibility or confidence value.\n\n**Phone numbers you can read.** Google's card gives on-device figures: on a Pixel 3, the Lite model runs at about 44 FPS on CPU and 49 FPS on GPU, Full at about 18 and 40, and Heavy at about 4 and 19. Ultralytics' table measures a CPU through ONNX and an NVIDIA T4 through TensorRT10, so nothing in it says how a phone will do.\n\n**A permissive licence.** The MediaPipe repository's LICENSE is Apache-2.0, and the BlazePose GHUM card is \"LICENSED UNDER Apache License, Version 2.0\". No copyleft, no key and no fee.\n\n**A browser path.** MediaPipe Tasks covers web apps. Ultralytics' export table, as we read it, lists no TensorFlow.js target; whether a browser runtime can run one of its other formats is something to test yourself.\n\n## Where YOLO pose wins\n\n**Several people.** Each detected person comes back with a box and 17 keypoints, and the Ultralytics README says its models can track detected objects across video frames. Keeping identities stable is the hard part of group scenes; [multi-person pose tracking](/motion/multi-person-pose-tracking) covers it.\n\n**A size dial with published accuracy.** Ultralytics' table runs from YOLO26n-pose at 57.2 mAP pose 50-95, 2.9 M parameters and 1.8 ms on a T4, to YOLO26x-pose at 71.6 mAP, 57.6 M parameters and 12.2 ms, all at 640 pixels on COCO Keypoints val2017. The same table puts YOLO26n-pose at 40.3 ms on a CPU through ONNX. [Ultralytics YOLO pose models](/motion/yolo-pose-models) has the full table.\n\n**Your own keypoints.** The pose docs show training on your own data, converting COCO keypoint JSON with `convert_coco` and `use_keypoints=True`, and point to datasets such as Tiger-Pose, Hand Keypoints and Dog-Pose. Ultralytics' annotation tool supports \"custom keypoint layouts\". MediaPipe ships \"Pre-trained, ready-to-run models\", and we found no training recipe for the pose landmarker in the files we read.\n\n**Export breadth.** Ultralytics' export table lists 23 formats counting PyTorch itself, from CoreML (`.mlpackage`) and LiteRT (`.tflite`) for phones to TensorRT, OpenVINO and vendor formats such as Qualcomm QNN, Hailo and RKNN.\n\n## The licence often decides first\n\nThe ultralytics/ultralytics LICENSE is the GNU Affero General Public License, version 3. Its section 13 says that if you modify the program, your modified version \"must prominently offer all users interacting with it remotely through a computer network\" an opportunity to receive its source. The Ultralytics README describes its Enterprise License as covering \"business products and services, including internal tools, automated workflows, and production deployments, bypassing the open-source requirements of AGPL-3.0\". In our reading, a closed-source app or service built on YOLO pose needs either full AGPL-3.0 compliance or that paid licence; Ultralytics publishes no price for it in the files we read. This is not legal advice: [pose estimation model licenses](/motion/pose-estimation-model-licenses) reads the terms in full, and a lawyer should read them for your product.\n\nMediaPipe raises no such question. If you need several people and an Apache-2.0 codebase, [RTMPose](/motion/rtmpose-models) is the alternative to weigh, with its checkpoint terms checked separately.\n\n## The accuracy numbers do not cross\n\nGoogle's MediaPipe Pose documentation reports BlazePose GHUM Heavy at 68.1, 73.0 and 74.0 mAP on its own Yoga, Dance and HIIT validation sets, scored on the 17 COCO keypoints with one person 2 to 4 meters from the camera. Ultralytics reports YOLO26x-pose at 71.6 mAP pose 50-95 on COCO Keypoints val2017. Different test sets, different scenes, different hardware: neither vendor benchmarks the other, so the only comparison that means anything is one you run on your own footage. [Pose estimation accuracy](/motion/pose-estimation-accuracy) explains the metrics.\n\n## Moving keypoints between them\n\nYOLO pose returns the 17 points in COCO order, from 0 nose to 16 right ankle. MediaPipe's 33 include the same 17 body points under the same names, at different indices: left hip is 11 in COCO and `LEFT_HIP` is 23 in MediaPipe's `PoseLandmark` enum. Map by name, using [the COCO 17 keypoint map](/pose-keypoints/coco-17), [the BlazePose 33 keypoint map](/pose-keypoints/blazepose-33) and [the crosswalk](/pose-keypoints#crosswalk) that joins them.\n\n## Which should you pick?\n\n- **One user in front of a phone, joint angles for form feedback** → MediaPipe: 33 landmarks, world coordinates and published phone figures, under Apache-2.0.\n- **A group class, a gym floor, or two people in one frame** → YOLO pose, once the licence question is settled.\n- **Keypoints that are not on the human body, or a layout of your own** → YOLO pose, which documents training on custom keypoint datasets.\n- **A closed-source product with no budget for a licence** → MediaPipe for one person; for several, an Apache-2.0 option such as RTMPose.\n- **A web app** → MediaPipe, whose Tasks API covers the web; see also [MediaPipe vs MoveNet](/compare/mediapipe-vs-movenet) for the lighter browser option.\n\nNeither returns reps or form feedback. That layer is yours to build or buy; [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) compares the products that sell it.",
    "faqs": [
      {
        "q": "Can YOLO pose run on a phone like MediaPipe?",
        "a": "It can be exported for one: Ultralytics' export table lists CoreML (.mlpackage) and LiteRT (.tflite) among 23 formats. What Ultralytics does not publish is a phone benchmark; its table measures a CPU through ONNX and an NVIDIA T4 through TensorRT10. Google's BlazePose card, by contrast, reports frames per second on a Pixel 3. Measure YOLO pose on your own target phones before you commit."
      },
      {
        "q": "Does YOLO pose output 3D keypoints?",
        "a": "Not in the results Ultralytics documents. Its pose results table lists keypoints.xy in pixels and keypoints.xyn normalized, both 2D, and keypoints.data as x, y plus an optional visibility or confidence value. MediaPipe Pose Landmarker returns a z value per landmark and world landmarks in meters from the hip centre, though its model card says that depth is up to scale rather than metric."
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
        "label": "Pose model licences, AGPL included"
      },
      {
        "href": "/alternatives/openpose-alternatives",
        "label": "OpenPose alternatives"
      }
    ],
    "cta": {
      "pitch": "Ultralytics renames and re-benchmarks its pose models often, and licence terms move too. Subscribe and we will flag it when either side of this comparison changes."
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
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that sits a layer above pose models like these.** Neither product on this page is ours, and we have no reason to prefer either. Apple facts come from Apple's Vision documentation; MediaPipe facts come from Google's Pose Landmarker guides and the google-ai-edge/mediapipe repository. All were read on October 27, 2026.\n\nThe two names do not sit at quite the same layer. Apple Vision is an operating-system framework: `VNDetectHumanBodyPoseRequest` and its 3D sibling run a pose model Apple ships inside iOS, iPadOS, macOS, tvOS and visionOS. MediaPipe Pose Landmarker is a model bundle plus a cross-platform task library that you add to your app. What Apple documents about its own request, on its own, is in [Apple Vision body pose on iOS](/motion/apple-vision-body-pose); this page puts the two side by side.\n\n## Apple Vision vs MediaPipe at a glance\n\n| | Apple Vision body pose | MediaPipe Pose Landmarker |\n| --- | --- | --- |\n| 2D points | 19 named joints (`VNHumanBodyPoseObservation.JointName`) | 33 landmarks, indexed 0 to 32 |\n| Hands and feet | None in the 19; the iOS 18 `DetectHumanBodyPoseRequest` can add hand observations | Pinky, index and thumb points per hand; heel and foot index per foot |\n| 3D | Separate request from iOS 17 and macOS 14: 17 joints in meters, origin at the root joint between the hips | World landmarks in meters, origin at the centre between the hips, from the same call |\n| People per frame | 2D: one observation per detected pose; 3D: the most prominent person only | Up to `num_poses`, which defaults to 1 |\n| Platforms | Apple only: iOS and iPadOS 14, macOS 11, Mac Catalyst 14, tvOS 14, visionOS 1 for the 2D request | Android, iOS, Python and web |\n| What you ship | Nothing: the model is part of the OS | A `.task` model bundle: lite, full or heavy |\n| Versioning | Request revisions inside the OS | The bundle file you choose and keep |\n| Licence | Part of Apple's SDK | Apache-2.0 |\n\n## What each returns in 2D\n\n**Vision names 19 joints.** Apple's documentation says that starting in iOS 14 and macOS 11, Vision identifies human body poses \"by detecting up to 19 unique body points\". The joint names are grouped as head (nose, eyes, ears, neck), arms (shoulders, elbows, wrists), waist (`root`) and legs (hips, knees, ankles). Each `VNRecognizedPoint` carries x and y in normalized coordinates and a confidence score, and Apple's article says to ignore points with a confidence of 0, \"because they’re invalid\". The same article puts the origin at the bottom-left of the image.\n\n**MediaPipe has 33 landmarks.** Google's Pose Landmarker guide lists them from 0 nose to 32 right foot index, and each landmark carries x, y, z, visibility and presence. Sixteen of the 33 have no Vision counterpart: four eye corners, two mouth corners, three hand points per side and two foot points per side. The heel and foot index points are what an ankle angle or a heel-lift check needs, which the 19 Vision joints cannot supply. Vision has two points MediaPipe does not: `neck` and `root`. In MediaPipe you would derive them, for example as midpoints of the shoulders and of the hips.\n\n**Hands are a recent addition on Apple's side.** `DetectHumanBodyPoseRequest`, the Swift-only request available from iOS 18 and macOS 15, has a `detectsHands` property that Apple describes as \"A Boolean value that detects hands of the body in the results, if they’re visible\", defaulting to true and requiring the request's revision 2. Its observation exposes `leftHand` and `rightHand` as separate hand-pose observations rather than adding points to the body skeleton.\n\n## Several people in frame\n\nApple's 2D article says the request \"returns a unique observation for each detected human body pose\", so one call can return several skeletons. Its accuracy advice also warns that \"Attempting to detect body poses in dense crowd scenes is likely to produce inaccurate results\". MediaPipe's `num_poses` option is \"The maximum number of poses that can be detected by the Pose Landmarker\", default 1, so you raise it explicitly. Neither guide documents keeping each person's identity from frame to frame; [multi-person pose tracking](/motion/multi-person-pose-tracking) covers that layer.\n\n## 3D: two different promises\n\nVision's 3D request is a separate API with a higher floor: iOS 17 and macOS 14. Apple's article says it measures \"17 individual joint locations in 3D space\", in meters, relative to a root joint between the left and right hip. Three details matter for fitness code:\n\n- **One person.** \"The request only supports the detection and results for the most prominent person in the frame, so it generates a single observation.\"\n- **All or nothing.** \"The framework doesn’t return a partial list of joints, so you get all 17 joints or none.\"\n- **Depth helps but is optional.** The request runs without depth data, and Apple says providing it \"improves detection accuracy\". `bodyHeight` is a measured value only when the capture session uses the LiDAR camera; otherwise Apple says it returns \"a reference height of `1.8` meters\".\n\nMediaPipe returns its 3D output from the same call as the 2D landmarks. Google's legacy Pose documentation describes world landmarks as \"Real-world 3D coordinates in meters with the origin at the center between hips\", and the Pose Landmarker guide says the model \"outputs an estimate of 33 3-dimensional pose landmarks\". Its inputs are still images, decoded video frames or a live feed; the guide lists no depth input. Whether you need a third axis at all is the subject of [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation).\n\n## Shipping and keeping it working\n\n**Vision adds no model bytes.** The model ships in the OS, and the request is the API. The flip side is that the implementation updates when Apple updates it. The 2D request documents `VNDetectHumanBodyPoseRequestRevision1`, and the iOS 18 request has a `Revision` type whose listed case is `revision2`; what changes between them, and when, is Apple's to decide.\n\n**MediaPipe adds a file you control.** The iOS guide installs the `MediaPipeTasksVision` library through Swift Package Manager and points `BaseOptions.modelAssetPath` at a `pose_landmarker.task` file in the app bundle; Android uses the `com.google.mediapipe:tasks-vision` library, and the web uses the `@mediapipe/tasks-vision` npm package. When we requested the three bundles from Google's model storage on October 27, 2026, they were 5,777,746 bytes (lite), 9,398,198 bytes (full) and 30,664,242 bytes (heavy). Because the file is yours, an old version stays reproducible in a regression suite. [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models) compares the three.\n\n**Platform reach decides many projects outright.** Every platform Apple lists for Vision is an Apple platform. A team with an Android app either writes a second pose pipeline, with different joints and different failure modes, or uses one model on both, which MediaPipe supports.\n\n## What is published about accuracy\n\nApple's documentation gives guidance rather than figures. For the 2D request it says the subject's height \"should ideally be at least a third of the overall image height\", that a large portion of the body should be in frame, and that \"A subject wearing flowing or robe-like clothing reduces the detection accuracy.\"\n\nThe only side-by-side numbers come from Google. MediaPipe's legacy Pose documentation scores BlazePose GHUM against \"Apple Vision\" on Google's own Yoga, Dance and HIIT validation sets, each image holding one person 2 to 4 meters from the camera, on the 17 COCO keypoints. Apple Vision scored 32.8, 36.4 and 44.5 mAP and 82.7, 91.4 and 88.6 PCK@0.2; BlazePose GHUM Heavy scored 68.1, 73.0 and 74.0 mAP. Read it as a vendor benchmarking a competitor on its own test set, with no Vision version stated. [Pose estimation accuracy](/motion/pose-estimation-accuracy) explains the metrics, and your own footage is the only test that settles it.\n\n## Mapping joints between them\n\nVision identifies joints by name, not by integer index, so code that reads MediaPipe's `landmarks[23]` has no direct equivalent. The 12 limb joints (shoulders, elbows, wrists, hips, knees, ankles) and the five face points (nose, eyes, ears) exist on both sides under matching names, which makes a name-keyed lookup the safe way to share form rules. The full lists are in [the Apple Vision 2D joint map](/pose-keypoints/apple-vision-2d), [the Apple Vision 3D joint map](/pose-keypoints/apple-vision-3d) and [the BlazePose 33 keypoint map](/pose-keypoints/blazepose-33).\n\n## Which should you pick?\n\n- **An iOS-only app that counts reps from elbow, hip or knee angles in 2D** → Apple Vision. No model file, no extra dependency, and a 2D request available back to iOS 14.\n- **An app on iOS and Android, or in a browser** → MediaPipe, so one model and one set of joint rules serve every platform.\n- **Squat depth, heel lift, ankle angles or grip** → MediaPipe, whose heel, foot index and hand points Vision's 19 joints do not include.\n- **3D on Apple hardware with a depth camera** → test Vision's 3D request, which uses depth when it is present and can measure body height with LiDAR; remember it reports one person only.\n- **Golden-clip regression tests that must not move between releases** → MediaPipe, because the model file is pinned in your repository; with Vision, plan to re-run the clips on each OS release.\n\n## What neither gives you\n\nBoth return points, not workouts. Rep counting, form rules and feedback are yours to build or buy: [how rep counting works](/motion/how-rep-counting-works) shows the logic, [AI workout tracking in Swift](/guides/ai-workout-tracking-ios-swift) wires Vision into an iOS app, and [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) compares products that sell the layer above.",
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
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that sits a layer above pose models like these.** Both products on this page are Google's, neither is ours, and we have no reason to prefer either. Every fact below comes from Google's ML Kit guides, reference and terms, Google's MediaPipe Pose Landmarker guides, and the google-ai-edge/mediapipe repository, all read on October 27, 2026.\n\nThese are close relatives rather than rivals. Google's MediaPipe Pose documentation says its BlazePose research \"also powers the ML Kit Pose Detection API\". Both return 33 body landmarks at the same indices. What differs is the packaging around the model: ML Kit is a closed, beta SDK for Android and iOS with no model file to handle, and MediaPipe Pose Landmarker is an open-source task library with a model bundle you ship, on more platforms and with more options. What ML Kit documents about itself is in [ML Kit pose detection](/motion/ml-kit-pose-detection); this page sets the two side by side.\n\n## ML Kit vs MediaPipe at a glance\n\n| | ML Kit Pose Detection | MediaPipe Pose Landmarker |\n| --- | --- | --- |\n| Landmarks | 33, values 0 to 32 | 33, indices 0 to 32 |\n| Per landmark | x, y, an experimental z, in-frame likelihood | x, y, z, visibility, presence; plus world landmarks in meters |\n| People | One per image | Up to `num_poses`, default 1 |\n| Variants | Base SDK and accurate SDK | Lite, full and heavy model bundles |\n| Platforms | Android and iOS | Android, iOS, Python and web |\n| How the model ships | Statically linked into the app at build time | A `.task` file you bundle and load |\n| Extras | None documented | Optional segmentation masks |\n| Status | Beta, with no SLA or deprecation policy | Open source |\n| Terms | ML Kit Terms of Service; usage metrics go to Google | Apache-2.0 |\n\n## Same landmarks, almost the same names\n\nML Kit's Android `PoseLandmark` reference and MediaPipe's `PoseLandmark` enum assign the same numbers to the same body points, from 0 nose to 32 right foot index; `LEFT_HIP` is 23 in both. Only the mouth corners are spelled differently: ML Kit's `LEFT_MOUTH` (9) and `RIGHT_MOUTH` (10) are MediaPipe's `MOUTH_LEFT` and `MOUTH_RIGHT`. Index-based code moves between them unchanged, which makes a later switch cheaper than between most pose models. Both maps are on [the ML Kit landmark page](/pose-keypoints/ml-kit) and [the BlazePose 33 keypoint map](/pose-keypoints/blazepose-33).\n\n## Where they differ in output\n\n**Depth.** ML Kit calls its Z coordinate \"an experimental value\" that is measured in image pixels like X and Y \"but it is not a true 3D value\", with its origin near the centre between the hips and no upper or lower bound. MediaPipe returns two sets of landmarks from one call: normalized image landmarks, whose z uses the hip midpoint as origin and \"roughly the same scale as x\", and world landmarks that Google's documentation describes as \"Real-world 3D coordinates in meters with the origin at the center between hips\". If you need joint angles that survive the user turning side-on, MediaPipe's world landmarks are the documented route; [2D vs 3D pose estimation](/motion/2d-vs-3d-pose-estimation) covers when that matters.\n\n**Per-point scores.** ML Kit's InFrameLikelihood is, in Google's words, \"a measure that indicates the probability that the landmark is within the image frame\", from 0.0 to 1.0. When part of the body is outside the image, ML Kit still returns all 33 points and gives the missing ones coordinates outside the frame. MediaPipe gives two scores per landmark, visibility and presence.\n\n**People and masks.** ML Kit's overview is direct: \"Pose detection can only detect one person in an image.\" With two people, it assigns the landmarks to the person detected with the highest confidence, and Google adds that \"The user's face must be present in order to detect a pose.\" MediaPipe's `num_poses` sets \"The maximum number of poses that can be detected\", defaulting to 1, and its `output_segmentation_masks` option returns a person mask. For groups, start from [multi-person pose tracking](/motion/multi-person-pose-tracking).\n\n## Speed and size, as Google publishes them\n\nML Kit publishes both. Its Android guide lists the base `pose-detection` SDK at about 10.1 MB and about 30 FPS on a Pixel 3XL, and `pose-detection-accurate` at about 13.3 MB and about 23 FPS with CPU or about 30 FPS with GPU. Its iOS guide lists up to 29.6 MB at about 45 FPS for `PoseDetection` and up to 33.2 MB at about 29 FPS for `PoseDetectionAccurate`, both on an iPhone X.\n\nMediaPipe's current Pose Landmarker guides, the overview and the Android, iOS and web pages, publish neither figure. When we requested the three bundles from Google's model storage on October 27, 2026, they were 5,777,746 bytes (lite), 9,398,198 bytes (full) and 30,664,242 bytes (heavy); that is the model file alone, before the task library. For speed, Google's legacy Pose documentation gives BlazePose GHUM latencies on a Pixel 3 with TFLite GPU of 20 ms for lite, 25 ms for full and 53 ms for heavy. Those are different devices and different measures from ML Kit's, so they do not compare; measure on your target phones. [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models) goes deeper on the three variants.\n\n## Platforms and integration\n\nML Kit's pose guides cover Android and iOS only. The Android guide needs API level 23 or above and, on the day we read it, printed the dependencies `com.google.mlkit:pose-detection:18.0.0-beta5` and `com.google.mlkit:pose-detection-accurate:18.0.0-beta5`; the iOS guide printed the pods `GoogleMLKit/PoseDetection` and `GoogleMLKit/PoseDetectionAccurate` at 8.0.0. Google says the Android SDKs' code and assets, and the iOS detectors' assets, are statically linked into the app at build time, so there is no model file to download or version separately. Detection runs in `STREAM_MODE`, which tracks the most prominent person between frames, or `SINGLE_IMAGE_MODE`, and on Android `setPreferredHardwareConfigs` chooses between `CPU` and `CPU_GPU`.\n\nMediaPipe adds Python and the web. Android uses the `com.google.mediapipe:tasks-vision` library, iOS the `MediaPipeTasksVision` package through Swift Package Manager, and the web the `@mediapipe/tasks-vision` npm package; each loads a `.task` model you supply. Running modes are `IMAGE`, `VIDEO` and `LIVE_STREAM`. Shipping the file yourself is extra work, and it is also what lets you pin a model version for regression tests.\n\n## Terms, status and data\n\n**ML Kit is beta.** Google's overview says the API \"is offered in beta, and is not subject to any SLA or deprecation policy\", and that changes \"may be made to this API that break backward compatibility\".\n\n**ML Kit has terms, not a licence file.** The ML Kit Terms of Service, last modified May 14, 2025, say processing of input data \"fully happens on-device\", and also that the APIs \"send metrics about the performance and utilization of the APIs in your app to Google\", which the developer is responsible for telling users about where the law requires it. The terms treat machine learning models as related software and forbid attempts to reverse engineer or extract them.\n\n**MediaPipe is Apache-2.0.** The repository's LICENSE is the Apache License, Version 2.0, and the code is there to read, fork or build from source. [Pose estimation model licenses](/motion/pose-estimation-model-licenses) reads both sets of terms in full; this is not legal advice.\n\n## Which should you pick?\n\n- **An Android and iOS app that wants one person's skeleton with the least setup** → ML Kit. No model file to ship or update, and Google publishes size and frame-rate figures for both SDKs.\n- **A web app, a Python pipeline or a server-side batch job** → MediaPipe; ML Kit's pose guides cover only Android and iOS.\n- **Joint angles in 3D, or a user who turns side-on** → MediaPipe, for world landmarks in meters rather than an experimental pixel-scale Z.\n- **Two or more people, or a segmentation mask** → MediaPipe, by raising `num_poses` or enabling masks; ML Kit detects one person.\n- **A product that cannot sit on a beta API or send usage metrics** → MediaPipe, under Apache-2.0 with a model file you control.\n- **Already on ML Kit and outgrowing it** → the shared landmark indices make MediaPipe the cheapest move; rename the two mouth constants and keep your rules.\n\n## What neither gives you\n\nGoogle's ML Kit overview says pose detection \"does not attach any meaning to the landmarks in a pose or the pose itself\", and the same is true of MediaPipe. Google's [pose classification tips](https://developers.google.com/ml-kit/vision/pose-detection/classifying-poses) show a k-NN approach for exercise classification and rep counting; [how rep counting works](/motion/how-rep-counting-works) covers the logic, and [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis) compares products that sell that layer.",
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
        "label": "Pose model licences and ML Kit's terms"
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
  }
];
