import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED migration playbooks (do not hand-edit; regenerate via
 * scratchpad/assemble9.mjs). Article + HowTo (procedural steps) + FAQPage.
 * Each page links to the /alternatives decision, /fix deprecation, and
 * /integrate target guide rather than duplicating them.
 */
export const migrateEntries: ClusterEntry[] =
[
  {
    "slug": "google-fit-to-health-connect",
    "primaryQuery": "migrate google fit to health connect",
    "h1": "How to migrate from Google Fit to Health Connect",
    "metaTitle": "Google Fit to Health Connect: Migration Playbook",
    "metaDescription": "Move off the deprecating Google Fit REST and Android APIs to on-device Health Connect: architecture shift, data mapping, re-consent, cut-over.",
    "updated": "2026-07-20",
    "answer": "Google is winding down the Google Fit REST and Android APIs, and the Android successor is Health Connect. The fundamental shift: Google Fit was cloud/REST so a backend could read it server-to-server, but Health Connect is an on-device store with no server endpoint. If you read Fit from your backend, you must re-architect to read on-device in the app and sync to your server yourself, or use an aggregator. This is a real re-integration, not a config swap: new OS permission model, field-by-field data re-mapping, and users must reconnect. Fit reportedly froze new sign-ups in May 2024 and is stated to be supported only through the end of 2026 (verify).",
    "body": "Google is winding down the Google Fit developer platform — both the **Google Fit REST API** and the **Android Fitness (Google Fit Android) APIs** — and the Android successor is **Health Connect**. The single most important thing to understand up front: Google Fit was cloud/account-centric, so a backend could read a user's data server-to-server over REST; **Health Connect is an on-device store with no server endpoint**. If you previously pulled Fit data from your backend, you cannot just re-point a URL — you read on the device inside your app and sync to your own backend yourself, or use an aggregator. This is a real re-integration: new permission model, field-by-field data re-mapping, and users must reconnect. Every date below is \"as of 2026, verify\" against Google's live migration docs.\n\n## Why you're doing this now\n\nGoogle stopped accepting new sign-ups for the Google Fit REST and Android APIs (reported as May 1, 2024), and the Fit APIs are stated to be supported only through the **end of 2026** before shutdown — the exact day within 2026 is not published, so **verify**. If your app or backend still depends on Fit, you are on a clock. For the symptom side of this — deprecation warnings, 403s, and shutdown notices — see [Google Fit API deprecated](/fix/google-fit-api-deprecated). If you are still weighing targets rather than committed to Health Connect, the [Google Fit API alternatives](/alternatives/google-fit-api-alternatives) page covers the decision; this page assumes you are making the move.\n\n## What actually changes\n\nThe hardest part is not the code, it is the architecture. Google Fit's REST API has **no direct on-device replacement** — Google's own FAQ says REST users must choose a different path entirely.\n\n| Google Fit (old) | Health Connect (new) | What it means for you |\n| --- | --- | --- |\n| Cloud store, readable via REST from your server | On-device store, no server endpoint | You read in the mobile app and sync to your backend yourself (or use an aggregator) |\n| OAuth 2.0 scopes, account-centric consent | OS-level permissions declared in the Android manifest, granted per data type | New permission model; Fit consent does not carry over, users must re-grant |\n| Datasources and datatypes (Fit schema) | Record types like `StepsRecord`, `HeartRateRecord`, `SleepSessionRecord`, `ExerciseSessionRecord` | Field-by-field re-mapping; coverage is broad but not 1:1 |\n| Cloud history tied to the account | On-device data only; history permission-gated | No full backfill of a user's Fit cloud history — expect gaps |\n\nTwo things worth calling out. First, there is a separate, newer **cloud Google Health API** (the same platform Fitbit is moving onto) for server-side use cases — it is a different product from Health Connect, so do not conflate the two. Second, Health Connect's **Recording API** offers step-only, account-free, battery-efficient step counting on Android, but that is a narrow subset, not a full replacement. For the on-device concept in general, see [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data). This page is the move, not the setup — the full Health Connect wiring lives in the [Health Connect integration guide](/integrate/google-health-connect).\n\n## The migration, step by step\n\n1. **Inventory your Fit usage.** List every REST endpoint and Android Fitness API call, the exact data types and datasources, and whether each read happens on-device or server-side. This map is what the rest of the migration runs on.\n2. **Split each read by architecture.** For every read, decide its new home: on-device Health Connect (mobile reads, you sync to backend), the cloud Google Health API, or an aggregator. Server-to-server reads are the ones that change most.\n3. **Register for the successor.** Set up Health Connect — the Play Console health-apps declaration plus manifest permissions — and/or the Google Health API console. Note that no new Google Fit sign-ups are possible.\n4. **Map data types field by field.** Build an explicit table from each Fit datatype/datasource to its Health Connect record type (for example steps → `StepsRecord`, sleep → `SleepSessionRecord`, workouts → `ExerciseSessionRecord`). Flag anything with no equivalent.\n5. **Build the on-device read plus sync layer.** Add the Health Connect client, request paired READ permissions, and add `READ_HEALTH_DATA_HISTORY` (for older data) or `READ_HEALTH_DATA_IN_BACKGROUND` if you need them. Because there is no server endpoint, push the results to your backend yourself.\n6. **Run old and new in parallel, then re-consent users.** Keep Fit live through its 2026 support window while the new path runs alongside, and compare values to validate the mapping. Surface the new Health Connect connection in-app, explain the benefit, and capture the OS permission grant — do not force-disconnect Fit yet.\n7. **Backfill within limits and test.** Pull whatever history the history permission allows, and accept that deep Fit cloud history may not exist on-device — document the gap for users. Test with the Health Connect Toolbox across granted, partially-granted, and denied permission states.\n8. **Cut over in waves, then decommission Fit.** Migrate cohorts with monitoring, keep a rollback path until confidence is high, and turn off the Fit path before end-of-2026.\n\n## Gotchas and how to keep users connected\n\n- **Tokens and consent do not transfer.** There is no silent migration of Fit consent to Health Connect. Every user must re-grant through the OS permission flow, so design the reconnect UX from day one and migrate in cohorts, not a big-bang cutover. The cross-cutting version of this lives in [keep users connected during migration](/migrate/keep-users-connected-during-migration).\n- **Historical data is the silent gap.** Health Connect only holds what is on that device or written by connected apps — it is not a backfill of a user's entire Google Fit cloud history. Reading data older than the default window (documented as roughly 30 days — **verify current window**) requires `READ_HEALTH_DATA_HISTORY`. Be honest with users about what history survives.\n- **No server API means sync is your job.** Do not architect as if Health Connect gives you a backend endpoint. If server-side reads are core to your product, that is exactly where the cloud Google Health API or a [health-data aggregator](/fitness-apis/health-data-aggregator-apis) — which runs an on-device SDK and forwards normalized data to your server — earns its place.\n- **Coverage is broad but not 1:1.** Health Connect spans Activity, Vitals (including HRV and resting heart rate), Sleep with stages, Body Measurement, Nutrition/Hydration, Cycle Tracking, and Wellness — but names, units, and granularity differ from Fit. Verify each type before promising parity.\n\n## How much work is this, really\n\nTreat this as a re-integration measured in weeks, not a flag flip — the effort is concentrated in the architecture split (step 2) and the on-device sync layer (step 5), not in the mapping table. The safest path is parallel-run with a rollback path and a wave cutover well before the end-of-2026 sunset. Because Google's dates have moved before and the exact shutdown day is unpublished, confirm the current timeline and history window in Google's official migration docs before you commit a schedule.",
    "steps": [
      {
        "name": "Inventory your Fit usage",
        "text": "List every Google Fit REST endpoint and Android Fitness API call, the exact data types and datasources, and whether each read happens on-device or server-side. This map drives the rest of the migration."
      },
      {
        "name": "Split each read by architecture",
        "text": "For every read, decide its new home: on-device Health Connect (mobile reads plus your own sync), the cloud Google Health API, or an aggregator. Server-to-server REST reads are the ones that change most, since Health Connect has no server endpoint."
      },
      {
        "name": "Register for the successor",
        "text": "Set up Health Connect via the Play Console health-apps declaration and manifest permissions, and/or the Google Health API console for cloud use cases. No new Google Fit sign-ups are possible."
      },
      {
        "name": "Map data types field by field",
        "text": "Build an explicit table from each Fit datatype to its Health Connect record type, for example steps to StepsRecord, sleep to SleepSessionRecord, workouts to ExerciseSessionRecord. Flag anything with no equivalent; coverage is broad but not one-to-one."
      },
      {
        "name": "Build the on-device read and sync layer",
        "text": "Add the Health Connect client, request paired READ permissions, and add READ_HEALTH_DATA_HISTORY or READ_HEALTH_DATA_IN_BACKGROUND if needed. Because there is no server endpoint, push results to your backend yourself."
      },
      {
        "name": "Run in parallel and re-consent users",
        "text": "Keep Fit live through its 2026 support window while the new path runs alongside, and compare values to validate the mapping. Surface the new Health Connect connection in-app, explain the benefit, and capture the OS permission grant without force-disconnecting Fit."
      },
      {
        "name": "Backfill within limits and test",
        "text": "Pull whatever history the history permission allows, and accept that deep Fit cloud history may not exist on-device (document the gap). Test with the Health Connect Toolbox across granted, partially-granted, and denied permission states."
      },
      {
        "name": "Cut over in waves, then decommission Fit",
        "text": "Migrate cohorts with monitoring, keep a rollback path until confidence is high, and turn off the Fit path before the end-of-2026 sunset (verify the exact date)."
      }
    ],
    "faqs": [
      {
        "q": "Can I just re-point my backend from the Fit REST API to Health Connect?",
        "a": "No. Health Connect is an on-device store with no server endpoint, so there is no URL for your backend to call. If you read Fit server-to-server, you must re-architect to read on-device inside your Android app and sync to your backend yourself, use the separate cloud Google Health API, or use an aggregator that runs an on-device SDK and forwards normalized data."
      },
      {
        "q": "When are the Google Fit APIs actually shutting down?",
        "a": "Google reportedly stopped new sign-ups for the Fit REST and Android APIs on May 1, 2024, and states the APIs are supported only through the end of 2026 before deprecation. The exact shutdown day within 2026 is not published, and Google's dates have moved before, so verify the current timeline in the official migration docs before committing a schedule."
      },
      {
        "q": "Will my users' Google Fit history transfer to Health Connect?",
        "a": "Not fully. Health Connect only holds data that is on that device or written by connected apps; it is not a backfill of a user's entire Google Fit cloud history. Reading data older than the default window (documented as roughly 30 days, verify) needs the READ_HEALTH_DATA_HISTORY permission, and deep cloud history may simply not be available on-device. Plan for gaps and tell users."
      },
      {
        "q": "Do users have to reconnect, or does Fit consent carry over?",
        "a": "Users must reconnect. There is no silent migration of Google Fit consent to Health Connect; Health Connect uses an OS-level permission model granted per data type, and access tokens and Fit scopes do not carry over. Design a clear in-app re-consent flow, run old and new in parallel, and migrate users in waves rather than forcing a disconnect."
      },
      {
        "q": "Is the Google Health API the same as Health Connect?",
        "a": "No, they are different products. Health Connect is the on-device Android store with no server endpoint. The Google Health API is a separate, newer cloud REST platform (the same one Fitbit is moving onto) for server-side use cases. Do not conflate them; choose based on whether each read needs to happen on-device or on your server."
      }
    ],
    "related": [
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/fix/google-fit-api-deprecated",
        "label": "Google Fit API deprecated: what to use"
      },
      {
        "href": "/alternatives/google-fit-api-alternatives",
        "label": "Google Fit API alternatives"
      },
      {
        "href": "/migrate",
        "label": "All migration guides"
      }
    ],
    "cta": {
      "pitch": "Google Fit's shutdown date has slipped before and the history window keeps changing, so subscribe and we'll flag the deprecation deadlines and Health Connect API changes before they break your build."
    }
  },
  {
    "slug": "fitbit-web-api-to-google-health",
    "primaryQuery": "fitbit web api google migration",
    "h1": "Migrating from the Fitbit Web API to the Google Health API",
    "metaTitle": "Migrate Fitbit Web API to Google Health API",
    "metaDescription": "How to move a Fitbit Web API integration to Google Health API: new OAuth, mandatory re-auth, endpoint mapping, and a parallel-run plan. Verify dates.",
    "updated": "2026-07-20",
    "answer": "As Fitbit and Google accounts consolidate, the legacy Fitbit Web API is being retired in favor of the new Google Health API, a cloud REST API that uses Google OAuth 2.0 with a new console, schema, and response format. Treat it as a real re-integration: the biggest gotcha is that your existing Fitbit tokens almost certainly do not transfer, so every user must re-sign-in with a Google Account and re-grant permissions. This migration is announced and in progress as of 2026, and the specific dates come from vendor and community notices, so verify everything against current Fitbit and Google developer notices before you plan a cutover.",
    "body": "Following the consolidation of Fitbit and Google accounts, the legacy **Fitbit Web API** is being retired in favor of the new **Google Health API** — a Google-built cloud REST API for querying Fitbit user data over Google OAuth 2.0. Treat this as a real re-integration, not a flag flip: it is reported to bring a new developer console, a new OAuth provider, a new endpoint schema, and a new response format. The single biggest gotcha is that **your existing Fitbit access and refresh tokens almost certainly do not transfer** — every user is expected to re-sign-in with a Google Account and re-grant permissions. This migration is announced and in progress as of 2026, and the specific dates below come from vendor and community notices, so verify everything against current Fitbit and Google developer notices before you plan around it.\n\n## Why this is happening\n\nFitbit accounts are being folded into Google accounts, and the developer platform is moving with them. The legacy Fitbit Web API — reported to expose 120+ individual endpoints — is being replaced by the Google Health API, described as built from the ground up with bundled data types rather than the old per-endpoint model. If you have a working Fitbit integration today, none of this is a URL swap: you re-map endpoints to a new schema, adopt Google OAuth 2.0, and put your users through a fresh consent flow.\n\nThis page is the *move*. For how the Fitbit integration itself is built, see the [Fitbit API integration guide](/integrate/fitbit-api). If the retirement is prompting you to reconsider the provider entirely, weigh the options in [Fitbit API alternatives](/alternatives/fitbit-api-alternatives) and the [Fitbit API vs Garmin API comparison](/fitness-apis/fitbit-api-vs-garmin-api).\n\n## What actually changes\n\n| Legacy Fitbit Web API | New Google Health API | What it means for you |\n| --- | --- | --- |\n| Fitbit developer console + Fitbit OAuth 2.0 | New Google developer console + **Google OAuth 2.0** | New app registration and credentials; a different OAuth library and provider — see [what OAuth means for health data](/learn/what-is-oauth-for-health-data). |\n| Existing Fitbit access/refresh tokens | Not portable (reported as a Google security requirement) | Every user must re-authenticate with a Google Account. Plan mandatory re-consent; do not assume a migration tool moves tokens. |\n| Fitbit login (including legacy Fitbit-only accounts) | Requires a consolidated **Google Account** | Users on un-consolidated Fitbit-only logins reportedly cannot use the new API until they migrate their login. Verify current gating. |\n| ~120+ individual endpoints | Bundled data types, new response format | Re-map each endpoint to the new schema and adapt your parsing. Data-type coverage is still evolving — verify parity per type. |\n\nBecause the two OAuth libraries differ, the recommended pattern is to run both in your codebase during the transition and put an **abstraction layer** over your health-data service, so the rest of your app does not care which path is live. That same insulation is what an aggregator can provide wholesale.\n\n### Dates: hedge hard, verify everything\n\nFrom vendor and community notices (Fitbit Community, Google Health support threads, and aggregator blogs), the reported shape of the timeline is: users migrate their Fitbit login to a Google Account before roughly **mid-May 2026**; a side-by-side window runs into **late September 2026**; and the legacy Fitbit Web API is turned down (stops syncing) around **September 2026**. Do not present any of these as settled fact. They come from third-party notices and have room to move — confirm the current dates in the official Fitbit and Google Health developer notices before committing a cutover plan.\n\n## The migration, step by step\n\n1. **Audit your current Fitbit usage.** List every Web API endpoint, scope, and data type you consume, your user volume, and where refresh tokens live.\n2. **Watch the official notices.** Subscribe to the Fitbit developer/community and Google Health API notices, and treat every date as provisional until confirmed there.\n3. **Register on the Google Health API console** and set up Google OAuth 2.0 credentials for the new app.\n4. **Map endpoints and schema.** Build an old-endpoint → new-bundled-data-type table and adapt to the new response format; flag any data type without a confirmed equivalent.\n5. **Add an abstraction layer** over your health-data service so the legacy Fitbit path and the Google Health path can coexist during the bridge window.\n6. **Plan mandatory re-auth.** Design a re-consent flow that has every user sign in with Google and re-grant permissions — you cannot reuse Fitbit tokens. Communicate the account-consolidation step, since un-consolidated accounts reportedly cannot use the new API.\n7. **Run both paths in parallel** during the side-by-side window; migrate users in cohorts and monitor for data gaps and auth failures.\n8. **Cut over before the legacy turndown, then decommission.** Move remaining users before the reported September 2026 shutoff, keep a rollback path until you are confident, then retire the Fitbit Web API code.\n\n## Gotchas and how to keep users connected\n\n- **Tokens do not carry over.** The change of OAuth provider means a hard re-consent for every user. Design the reconnect UX early and expect a long tail of users who need reminding — see [keeping users connected during a migration](/migrate/keep-users-connected-during-migration).\n- **Account consolidation is a gate, not a detail.** If a user has not migrated their Fitbit login to a Google Account, they may be locked out of the new API entirely. Surface that step in your messaging.\n- **Data-type parity is not guaranteed.** The new API's coverage versus the old Web API is still evolving; verify each data type you depend on before promising it will still be there.\n- **Do not hard-cut.** Run legacy and new in parallel, keep a rollback path, and let existing data keep flowing until each user reconnects.\n- **Consider an aggregator as insulation.** A health-data aggregator that already supports both the legacy Fitbit Web API and the Google Health API can absorb the OAuth and schema change for you, so you keep a single integration instead of rebuilding. Vendors reported to be preparing for this include Terra, Validic, Thryve/Sahha, Fitabase, and Rook — verify each one's current support status before relying on it.\n\n## A note on effort and uncertainty\n\nBudget for this as a re-integration: new credentials, a new schema mapping, a new OAuth flow, and a user-facing re-consent campaign — not an afternoon of config. The engineering is tractable, but the timeline is the risky part, because the dates here are drawn from third-party notices and can shift. Build the abstraction layer, run in parallel, and confirm the current cutover and account-consolidation dates against the official Fitbit and Google Health developer notices before you schedule anything. This is general engineering guidance; verify the live docs at publish time.",
    "steps": [
      {
        "name": "Audit your Fitbit usage",
        "text": "List every Fitbit Web API endpoint, scope, and data type you consume, plus your user volume and where refresh tokens are stored."
      },
      {
        "name": "Watch the official notices",
        "text": "Subscribe to the Fitbit developer/community and Google Health API notices, and treat every reported date as provisional until confirmed there."
      },
      {
        "name": "Register on the Google Health API console",
        "text": "Create the new app and set up Google OAuth 2.0 credentials for the successor API."
      },
      {
        "name": "Map endpoints and schema",
        "text": "Build an old-endpoint to new-bundled-data-type table and adapt to the new response format. Flag any data type without a confirmed equivalent, since coverage is still evolving."
      },
      {
        "name": "Add an abstraction layer",
        "text": "Put a layer over your health-data service so the legacy Fitbit path and the Google Health path can coexist during the bridge window."
      },
      {
        "name": "Plan mandatory re-auth",
        "text": "Design a re-consent flow where every user signs in with Google and re-grants permissions; you cannot reuse Fitbit tokens. Communicate the Google Account consolidation step, since un-consolidated accounts reportedly cannot use the new API."
      },
      {
        "name": "Run both paths in parallel",
        "text": "Operate legacy and new side by side during the transition window, migrate users in cohorts, and monitor for data gaps and auth failures."
      },
      {
        "name": "Cut over, then decommission",
        "text": "Move remaining users before the reported legacy turndown (around September 2026, verify), keep a rollback path until confident, then retire the Fitbit Web API code."
      }
    ],
    "faqs": [
      {
        "q": "Will my existing Fitbit access and refresh tokens work with the Google Health API?",
        "a": "Almost certainly not. Because the OAuth provider changes to Google OAuth 2.0, existing Fitbit tokens are reported to be non-portable, and every user must re-sign-in with a Google Account and re-grant permissions. Plan for mandatory re-consent from day one, and do not assume any migration tool moves tokens for you. Verify the current wording in the official Fitbit and Google notices."
      },
      {
        "q": "When exactly is the legacy Fitbit Web API being shut down?",
        "a": "The dates are not settled. Vendor and community notices report a side-by-side window running into late September 2026 with the legacy Web API turned down around September 2026, and a requirement to migrate your Fitbit login to a Google Account before roughly mid-May 2026. Treat all of these as provisional and confirm them against current Fitbit and Google developer notices before you schedule a cutover."
      },
      {
        "q": "Do users need a Google Account to keep their Fitbit connection?",
        "a": "Reportedly yes. Users on legacy Fitbit-only logins are reported to be unable to use the Google Health API until they consolidate their login into a Google Account. Because this can lock out un-consolidated users, surface the account-migration step clearly in your reconnect messaging. Verify the current gating in the official notices."
      },
      {
        "q": "Can an aggregator handle this migration for me?",
        "a": "Potentially. A health-data aggregator that already supports both the legacy Fitbit Web API and the new Google Health API can absorb the OAuth and schema change so you keep a single integration instead of rebuilding. Vendors reported to be preparing for this include Terra, Validic, Thryve/Sahha, Fitabase, and Rook, but coverage and readiness vary, so verify each one's current support before relying on it."
      },
      {
        "q": "Is the Google Health API the same as Health Connect?",
        "a": "No. The Google Health API is a cloud REST API (the Fitbit Web API successor) that your backend calls over Google OAuth 2.0. Health Connect is a separate, on-device Android store with an OS-level permission model and no server endpoint. Do not conflate them when planning your architecture."
      }
    ],
    "related": [
      {
        "href": "/integrate/fitbit-api",
        "label": "Integrate the Fitbit API"
      },
      {
        "href": "/alternatives/fitbit-api-alternatives",
        "label": "Fitbit API alternatives"
      },
      {
        "href": "/fitness-apis/fitbit-api-vs-garmin-api",
        "label": "Fitbit API vs Garmin API"
      },
      {
        "href": "/migrate",
        "label": "All migration guides"
      }
    ],
    "cta": {
      "pitch": "The Fitbit-to-Google Health cutover dates keep shifting — subscribe and we'll flag the confirmed deadlines and re-auth requirements before they break your integration."
    }
  },
  {
    "slug": "add-android-to-healthkit-app",
    "primaryQuery": "add android support healthkit app",
    "h1": "Adding Android to a HealthKit app",
    "metaTitle": "Add Android to a HealthKit App: Migration Guide",
    "metaDescription": "Add Android to an iOS HealthKit app: map to Health Connect, choose native vs aggregator, and normalize both on-device stores. Step-by-step playbook.",
    "updated": "2026-07-20",
    "answer": "HealthKit is iOS-only and on-device, so there is no cloud API to extend to Android; the Android counterpart is Health Connect, also on-device, and there is no single official cross-platform SDK that speaks both. Adding Android is a real second integration: you either build two native paths behind your own normalization layer or adopt an aggregator that abstracts both. The biggest gotcha is that the platforms are not equivalent, so 'support both' always means a mapping layer for differing data types, units, and permission models, not a flag flip.",
    "body": "## Adding Android to a HealthKit app\n\nYou built on Apple HealthKit, and now you need Android coverage. Here is the move: HealthKit is iOS-only and lives on-device, so there is no cloud API to point at Android. The Android counterpart is [Health Connect](/integrate/google-health-connect) — also an on-device store with its own permission model — and there is **no single official cross-platform SDK** that speaks both. So this is a real re-integration: you either build two native integrations behind your own normalization layer, or adopt an aggregator that abstracts both. The single biggest gotcha is that the two platforms are not equivalent — different data-type names, units, permission models, and background-sync behavior — so \"support both\" always means a mapping layer, not a flag flip.\n\n## What actually changes\n\nBoth stores are on-device, which is the one thing that stays the same. Everything around the data shape and permissions differs. Read the platform-by-platform breakdown in [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect); the table below is just the migration-relevant delta.\n\n| iOS (HealthKit) | Android (Health Connect) | What it means for you |\n| --- | --- | --- |\n| On-device store, no cloud API | On-device store, no server endpoint | Both: read in-app and sync to your own backend yourself |\n| Per-type permission sheet; user grants some/all/none | Paired READ/WRITE permissions declared in the manifest | Two different consent flows to build and test |\n| Denied read returns empty data, not an error | Extra permissions for history and background reads | You cannot detect a denied read on iOS; verify per platform |\n| `HKObserverQuery` for background delivery | Background-read permission for background sync | Background sync is implemented separately on each side |\n| HealthKit type names and units | Health Connect record types (e.g. `StepsRecord`, `HeartRateRecord`) | Field-by-field re-map; names, units, granularity differ |\n\nA note on that denied-read behavior: HealthKit returns empty data rather than an authorization error, so you cannot infer a user's health status from permission state, and empty results do not necessarily mean \"no permission.\" Verify the current behavior in Apple's docs before you build logic around it.\n\n### Data-type parity and gaps\n\nCore types overlap and map reasonably: steps, distance, heart rate, active/total calories, sleep sessions, weight, and workouts/exercise all have a counterpart on each platform. The edges are where you get hurt — naming, units, granularity, and which types each platform even defines diverge. Do not promise field-for-field parity to yourself or your users; build an explicit mapping table and flag every type that does not cleanly correspond. Verify each data type, unit, and granularity against the live docs, because these lists change.\n\n### The architecture decision: native vs aggregator\n\nThis is the call to make up front, because it shapes everything after it.\n\n- **Per-platform native** — most control, no third-party dependency or recurring cost, but you build and maintain two integrations, two permission flows, two sync paths, and your own normalization schema.\n- **Aggregator / cross-platform layer** — one integration; the provider runs an on-device SDK covering both HealthKit and Health Connect, normalizes the data, handles background sync, and delivers to your backend via API/webhooks. Trade-offs are cost, trusting a third party with the data flow, and coverage limits. Good fit when you want one backend contract.\n\nThere is no first-party Apple/Google product that does this. Community wrappers exist (for example Flutter and Kotlin Multiplatform libraries), but none is an official cross-platform SDK, and community libraries can lag OS changes — verify maintenance status before you depend on one. For the shortlist of managed options, see [HealthKit alternatives](/alternatives/healthkit-alternatives).\n\n## The migration, step by step\n\n1. **Inventory your HealthKit usage.** List every read/write type, its units, and everywhere you rely on background delivery via `HKObserverQuery`. This inventory is the map for everything below.\n2. **Decide native vs aggregator.** Choose based on control versus speed and maintenance, and on whether you want one unified backend contract. This decision determines how much of the next steps you build yourself.\n3. **Map HealthKit types to Health Connect record types.** Build a field-by-field table, normalizing names and units, and flag every non-parity type. Verify each mapping against the current Health Connect data-types docs.\n4. **Implement the Android read/sync path.** Add the Health Connect client, declare paired READ/WRITE manifest permissions, and add history/background-read permissions if you need them. Remember Health Connect has no server endpoint — you sync results to your backend yourself.\n5. **Build a normalization layer.** Have both platforms feed one internal schema so the rest of your app does not care which OS the data came from — or let the aggregator own this layer for you.\n6. **Implement both permission flows.** Wire HealthKit's per-type sheet (with the \"denied equals empty, not error\" caveat) and Health Connect's paired READ/WRITE grants, plus background sync on each side.\n7. **Test the permission matrices on both platforms.** Exercise granted, partial, and denied states, and validate unit and timezone consistency across platforms. Then ship Android alongside iOS, monitor parity, and iterate on the mapping.\n\n## Gotchas and how to keep users connected\n\n- **Neither store is a backend API.** For both HealthKit and Health Connect, you read on the device and sync to your own server. There is no server-to-server read on either platform.\n- **Permissions do not carry over — there is nothing to carry.** These are separate OS-level grants on separate devices. Android users grant Health Connect permissions fresh; that is expected, not a regression.\n- **The denied-read trap on iOS.** Because HealthKit returns empty data instead of an error, absent data can mean \"no permission\" or \"no data.\" Handle both, and do not build health inferences on permission state.\n- **Background sync is per-platform.** `HKObserverQuery` on iOS and Health Connect's background-read permission on Android are two separate implementations to build and monitor.\n- **Community libraries lag.** A cross-platform wrapper can fall behind OS changes; verify its maintenance status before depending on it.\n\n## Honest close\n\nAdding Android is a genuine second integration plus a normalization layer, not a port — budget for two permission flows, two sync paths, and an ongoing mapping table you will revisit as both platforms evolve. Going native gives you control and no recurring cost at the price of maintenance; an aggregator trades cost and data-flow trust for one integration. Whichever you pick, verify current HealthKit and Health Connect docs before you build, since data types, permissions, and library support all shift over time.",
    "steps": [
      {
        "name": "Inventory your HealthKit usage",
        "text": "List every read/write data type, its units, and everywhere you rely on background delivery via HKObserverQuery. This inventory becomes the map for the rest of the migration."
      },
      {
        "name": "Decide native vs aggregator",
        "text": "Choose based on control versus speed and maintenance, and whether you want one unified backend contract. Per-platform native means two integrations you own; an aggregator gives one integration at the cost of price, coverage limits, and data-flow trust."
      },
      {
        "name": "Map HealthKit types to Health Connect record types",
        "text": "Build a field-by-field table, normalizing names and units, and flag every type with no clean equivalent. Verify each mapping against the current Health Connect data-types docs."
      },
      {
        "name": "Implement the Android read/sync path",
        "text": "Add the Health Connect client, declare paired READ/WRITE manifest permissions, and add history or background-read permissions if needed. Health Connect has no server endpoint, so you sync results to your own backend yourself."
      },
      {
        "name": "Build a normalization layer",
        "text": "Have both platforms feed one internal schema so the rest of your app does not care which OS produced the data. If you chose an aggregator, it owns this layer instead."
      },
      {
        "name": "Implement both permission flows",
        "text": "Wire HealthKit's per-type consent sheet, remembering that a denied read returns empty data rather than an error, alongside Health Connect's paired READ/WRITE grants and background-sync permission."
      },
      {
        "name": "Test permission matrices and ship",
        "text": "Exercise granted, partial, and denied states on both platforms and validate unit and timezone consistency across them. Then ship Android alongside iOS, monitor parity, and iterate on the mapping."
      }
    ],
    "faqs": [
      {
        "q": "Is there an official cross-platform SDK for HealthKit and Health Connect?",
        "a": "No. There is no first-party Apple or Google product that speaks both. You either build two native integrations with your own normalization layer, or use a third-party aggregator that runs an on-device SDK covering both and forwards normalized data. Community wrappers exist, but verify their maintenance status before depending on one, as they can lag OS changes."
      },
      {
        "q": "Can I read HealthKit or Health Connect data from my server?",
        "a": "No. Both are on-device stores with no server endpoint. You read the data inside the app on the device and sync it to your own backend yourself. This is true for both iOS and Android, so plan an on-device read plus self-sync path either way."
      },
      {
        "q": "Do HealthKit data types map one-to-one to Health Connect?",
        "a": "Core types like steps, distance, heart rate, calories, sleep sessions, weight, and workouts map reasonably, but names, units, granularity, and which types each platform defines can differ. Do not assume field-for-field parity; build an explicit mapping table and verify each data type and unit against the live docs."
      },
      {
        "q": "Why does HealthKit return empty data instead of a permission error?",
        "a": "By design, HealthKit does not tell you a read was denied; it returns empty data instead, so you cannot infer a user's health status from permission state. That means absent data can mean either no permission or no data, and you should handle both cases. Verify the current behavior in Apple's documentation before building logic around it."
      },
      {
        "q": "Should I go native on both platforms or use an aggregator?",
        "a": "Per-platform native gives the most control and no recurring cost, but you build and maintain two integrations, two permission flows, two sync paths, and your own schema. An aggregator gives one integration and one backend contract at the cost of price, coverage limits, and trusting a third party with the data flow. Pick based on your control-versus-maintenance priorities."
      }
    ],
    "related": [
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/alternatives/healthkit-alternatives",
        "label": "Apple HealthKit alternatives"
      },
      {
        "href": "/migrate",
        "label": "All migration guides"
      }
    ],
    "cta": {
      "pitch": "Platform stores and vendor APIs shift constantly, from Health Connect permissions to SDK support windows; get deprecations and API changes in your inbox before they break your build."
    }
  },
  {
    "slug": "consolidate-wearables-with-aggregator",
    "primaryQuery": "replace direct integrations with aggregator",
    "h1": "Consolidate wearables: replace direct integrations with one aggregator",
    "metaTitle": "Consolidate Wearables Behind One Aggregator",
    "metaDescription": "Move from per-vendor Fitbit, Garmin, and Oura integrations to one aggregator: map your schema, run in parallel, re-consent users, and cut over safely.",
    "updated": "2026-07-20",
    "answer": "Consolidating several per-vendor integrations (Fitbit, Garmin, Oura, WHOOP) behind one aggregator like Terra, Junction (formerly Vital), Rook, or Spike collapses many auth flows and schemas into one integration and one normalized webhook stream. It is a real re-integration, not a flag flip: you re-map fields, some providers still need your own approved credentials, and every user must re-authorize through the aggregator's connect flow. Run the aggregator in parallel with your existing integrations, back-fill within each provider's cap, and cut over provider-by-provider with a rollback path.",
    "body": "## Replace direct integrations with an aggregator\n\nYou are maintaining several per-vendor integrations — Fitbit, Garmin, Oura, WHOOP, Strava — and each one is its own auth flow, its own schema, and its own webhook handler. Consolidating them behind one aggregator (Terra, Junction (formerly Vital), Rook, or Spike) collapses that into a single integration and a single normalized webhook stream. The move is real: you re-map fields to the aggregator's schema, some providers still need your own developer credentials, and every user has to re-authorize through the aggregator's connect flow. Run the aggregator in parallel with your existing integrations, back-fill within each provider's cap, and cut over provider-by-provider — this is a re-integration, not a flag flip.\n\nFor the concept itself, see [what a health-data aggregator is](/learn/what-is-a-health-data-aggregator) and the [aggregator category overview](/fitness-apis/health-data-aggregator-apis). This page is the move.\n\n## What actually changes\n\n| Old (direct integrations) | New (one aggregator) | What it means for you |\n| --- | --- | --- |\n| Per-vendor OAuth apps and token refresh | One aggregator integration; user connects via the aggregator's widget | You re-consent every user onto the new connect flow — grants and refresh tokens do not transfer |\n| A different schema per provider | One normalized schema across providers | You map your internal model to the aggregator's schema; provider-specific fields may be flattened or dropped |\n| A webhook handler per vendor | One normalized webhook stream | You verify one signature scheme (e.g. Terra's `terra-signature` HMAC header) instead of many |\n| You own every provider's dev app | Aggregator fronts most providers | Some providers still require your own approved developer credentials (Garmin, WHOOP, Fitbit — verify per provider) |\n| Maintenance cost is your engineering time | Recurring platform fee | Predictable per-connection / per-MAU / tiered cost (verify current pricing per vendor, as of 2026) |\n\nThe value is concentration: aggregators advertise coverage of hundreds of sources normalized into one schema, typically spanning activity, sleep, heart rate, HRV, and body metrics (verify current coverage per vendor). You retire per-vendor schema drift and per-vendor webhook handling, which is the bulk of the ongoing maintenance.\n\nThe honest trade-offs:\n\n- **Recurring cost.** Aggregators are paid platforms. At high volume this can exceed what your in-house maintenance costs, so model it against your provider count and user base (verify current pricing, as of 2026).\n- **Some providers still need your own credentials.** \"One integration\" is marketing shorthand. Providers like Garmin, WHOOP, and Fitbit may still require you to register and get approved for your own developer app behind the aggregator. Junction documents that using your own OAuth app means the provider rate-limits you independently of the aggregator's default app (verify per provider).\n- **The normalized schema can hide fields.** A unified schema drops or flattens fields that only exist on one provider. If you depend on a raw provider field, confirm the aggregator exposes a raw/passthrough payload before you commit (verify).\n- **You inherit a new dependency.** The aggregator's reliability, latency, and support become yours to live with.\n\nIf your reasons point the other way — cost at scale, or needing raw provider fields the normalized schema drops — the reverse move is documented in [aggregator to direct integration](/migrate/aggregator-to-direct-integration).\n\n## The migration, step by step\n\nThe ordered sequence is below. It follows the same parallel-run discipline as every migration: stand the new path up alongside the old, validate, then decommission.\n\n1. **Inventory your direct integrations.** List every provider you run, the exact fields and endpoints you actually consume, and which webhooks fire. This map is what you validate the aggregator against.\n2. **Pick the aggregator and confirm coverage.** Verify it covers all your live providers and the specific fields you depend on — including raw passthrough if you rely on provider-specific data. Setup for the target lives in the [Terra integration guide](/integrate/terra-api).\n3. **Map your model to theirs.** Map your internal/normalized model to the aggregator's normalized schema and list the gaps — fields the aggregator drops or renames.\n4. **Register any provider apps the aggregator still requires.** Submit developer-app approvals for providers that gate access (Garmin, WHOOP, Fitbit) early — allow lead time, as approvals are not instant (verify current terms per provider).\n5. **Stand up the aggregator webhook in parallel.** Run the aggregator's endpoint alongside your existing integrations. Verify its signature scheme, and pass your user ID as the aggregator's reference id (e.g. Terra's `reference_id`) so events map back to your users.\n6. **Re-consent users onto the connect flow.** Users must re-authorize through the aggregator's connect/widget flow — old grants do not carry over. Migrate in waves and track per-user connection state so you can chase non-reconnected users.\n7. **Back-fill within each provider's cap.** Pull historical data for migrated users, accepting that how far back you can go is set by each underlying provider, not the aggregator, and large ranges arrive asynchronously (verify current caps).\n8. **Compare, then cut over and decommission.** Dual-read old vs new for a validation window, then cut over provider-by-provider and retire each direct integration once its replacement is proven.\n\n## Gotchas and how to keep users connected\n\n- **Connections do not transfer.** OAuth grants and refresh tokens are bound to your old per-vendor apps. Every user re-authorizes on the new path, so design the re-consent UX from day one and keep old-path data flowing until each user reconnects. The cross-cutting playbook is [keep users connected during migration](/migrate/keep-users-connected-during-migration).\n- **Back-fill is provider-capped, not aggregator-capped.** Historical depth is set by each provider regardless of the aggregator. Document the gap for users rather than promising full history (verify current per-provider caps).\n- **Watch for silently dropped fields.** If a provider-specific field matters to your product, confirm raw passthrough exists before you decommission the direct integration that still returns it.\n- **Don't hard-cut.** Keep both paths live and a rollback available until each provider's replacement is validated per cohort.\n\n## How much effort is this really\n\nBudget for a real re-integration: schema mapping, any provider approvals, a re-consent campaign, a back-fill pass, and a parallel-run validation window before you retire anything. The payoff is one integration and one webhook stream to maintain instead of many. Before you commit, verify current pricing, provider coverage, and back-fill caps directly with the aggregator, as of 2026 — those specifics move.",
    "steps": [
      {
        "name": "Inventory your direct integrations",
        "text": "List every provider you run, the exact fields and endpoints you actually consume, and which webhooks fire. This map is what you validate the aggregator against."
      },
      {
        "name": "Pick the aggregator and confirm coverage",
        "text": "Verify the aggregator covers all your live providers and the specific fields you depend on, including raw passthrough if you rely on provider-specific data. Verify current coverage per vendor, as of 2026."
      },
      {
        "name": "Map your model to their schema",
        "text": "Map your internal or normalized model to the aggregator's normalized schema and list the gaps, meaning fields the aggregator drops or renames."
      },
      {
        "name": "Register any provider apps still required",
        "text": "Some providers (Garmin, WHOOP, Fitbit) may still require your own approved developer app behind the aggregator. Submit approvals early and allow lead time; verify current terms per provider."
      },
      {
        "name": "Stand up the aggregator webhook in parallel",
        "text": "Run the aggregator's endpoint alongside your existing integrations. Verify its signature scheme (e.g. Terra's terra-signature HMAC header) and pass your user ID as the aggregator's reference id so events map back to your users."
      },
      {
        "name": "Re-consent users onto the connect flow",
        "text": "Users must re-authorize through the aggregator's connect flow because old grants and refresh tokens do not transfer. Migrate in waves and track per-user connection state to chase non-reconnected users."
      },
      {
        "name": "Back-fill within each provider's cap",
        "text": "Pull historical data for migrated users, accepting that how far back you can go is set by each underlying provider, not the aggregator, and large ranges arrive asynchronously. Verify current caps per provider."
      },
      {
        "name": "Compare, cut over, and decommission",
        "text": "Dual-read old versus new for a validation window, then cut over provider-by-provider and retire each direct integration once its replacement is proven, keeping a rollback path until each cohort is validated."
      }
    ],
    "faqs": [
      {
        "q": "Do users have to reconnect when I move to an aggregator?",
        "a": "Yes. OAuth grants and refresh tokens are bound to your old per-vendor apps and do not transfer. Every user must re-authorize through the aggregator's connect flow, so plan a re-consent campaign and keep old-path data flowing until each user reconnects."
      },
      {
        "q": "If I use one aggregator, do I still need my own developer credentials?",
        "a": "Often yes. 'One integration' is shorthand: providers such as Garmin, WHOOP, and Fitbit may still require you to register and get approved for your own developer app behind the aggregator, and using your own OAuth app can mean the provider rate-limits you independently. Verify per provider, as of 2026."
      },
      {
        "q": "Will the normalized schema drop provider-specific fields?",
        "a": "It can. A unified schema flattens or drops fields that only exist on one provider. If you depend on a raw provider field, confirm the aggregator exposes a raw or passthrough payload before you decommission the direct integration that returns it. Verify availability per aggregator."
      },
      {
        "q": "How far back can I back-fill historical data?",
        "a": "Back-fill depth is set by each underlying provider, not the aggregator, and it is capped and often permission-gated. Large ranges are delivered asynchronously in chunks. Document the gap for users rather than promising full history, and verify current per-provider caps."
      },
      {
        "q": "Should I hard-cut or run both in parallel?",
        "a": "Run both in parallel. Stand up the aggregator alongside your existing integrations, dual-read and compare for a validation window, migrate users in waves, and cut over provider-by-provider while keeping a rollback path until each cohort is proven."
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
        "href": "/migrate/aggregator-to-direct-integration",
        "label": "Aggregator → direct integration"
      },
      {
        "href": "/migrate",
        "label": "All migration guides"
      }
    ],
    "cta": {
      "pitch": "Get deprecation notices and wearable API changes in your inbox so the next provider migration starts from a heads-up, not a broken build."
    }
  },
  {
    "slug": "aggregator-to-direct-integration",
    "primaryQuery": "move from aggregator to direct api",
    "h1": "Migrate from an aggregator to direct provider integrations",
    "metaTitle": "Aggregator to Direct API Integration Migration",
    "metaDescription": "Move wearable providers off a health-data aggregator to direct APIs: re-register apps, re-map raw schemas, re-consent users, and the upkeep you re-own.",
    "updated": "2026-07-20",
    "answer": "Leaving an aggregator means integrating each provider directly: you register your own developer apps, re-map from the aggregator's normalized schema back to each provider's raw schema, and every user must re-consent onto your own OAuth. The biggest gotcha is that you take back all the maintenance the aggregator absorbed - per-provider auth, token refresh, schema drift, webhooks, and approval renewals - for each provider you bring in-house. It is a real re-integration, so go provider-by-provider, run both paths in parallel, and keep the aggregator as rollback.",
    "body": "## Move from an aggregator to direct provider integrations\n\nYou are taking one or more wearable providers off a health-data aggregator (Terra, Junction (formerly Vital), Rook, Spike) and integrating them directly with each provider's own API. The move is a real re-integration, not a config flip: you re-register your own developer apps, re-map from the aggregator's normalized schema back to each provider's raw schema, and every user must re-consent onto your own OAuth. The single biggest gotcha is that you take back all the maintenance the aggregator was absorbing — per-provider auth, token refresh, schema drift, webhook handling, and approval renewals — for every provider you bring in-house. Go provider-by-provider, run direct and aggregator paths in parallel, and keep the aggregator as your rollback path.\n\n### Why teams leave the aggregator\n\nThese are trade-offs, not universal wins. Weigh them per provider, not for your whole integration at once.\n\n- **Cost at scale.** Per-connection or per-MAU aggregator fees can, for a high-volume provider, exceed what it costs to run that integration yourself. (Pricing is volatile — verify current terms with each vendor, as of 2026.)\n- **Data fidelity.** A unified normalized schema drops or flattens fields that only exist on one provider. If you depend on a raw provider field that the aggregator does not pass through, direct access restores it. Confirm the provider still exposes that field before you migrate for it.\n- **Control and latency.** Direct provider webhooks remove a hop, and you own retry and replay behavior instead of inheriting the aggregator's.\n- **Compliance and data residency.** Some teams want the provider relationship and the data path in-house.\n\nIf you are still deciding whether direct is worth it versus staying consolidated, the aggregator concept and its trade-offs are covered in [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis), and the reverse move is [consolidate wearables with an aggregator](/migrate/consolidate-wearables-with-aggregator).\n\n### What actually changes\n\n| Old (via aggregator) | New (direct) | What it means for you |\n| --- | --- | --- |\n| One integration, one webhook stream | One integration per provider | You re-own auth, ingestion, and webhooks for each provider you bring in-house |\n| Aggregator's normalized JSON schema | Each provider's raw schema | New field-by-field mapping per provider — not a reversal of your old setup |\n| Aggregator's OAuth app / connect widget | Your own OAuth app per provider | Users must re-authorize; grants held by the aggregator do not transfer |\n| Aggregator absorbs provider approvals | You apply directly | Several providers gate access behind review (see below) |\n| Aggregator handles schema drift and renewals | You handle them | Ongoing maintenance returns to your team |\n\nSome providers are not self-serve even when you go direct. As of 2026, Garmin's Health API runs through a partner-program application that reviews your use case and data handling, and some premium metrics may carry license fees — verify current terms. WHOOP and Fitbit have their own app registration and review steps. Allow lead time in weeks, not days, and verify each provider's current developer terms before you commit a timeline. Fitbit's own direct setup is covered in [integrate the Fitbit API](/integrate/fitbit-api).\n\n### The migration, step by step\n\n1. **Prioritize which providers to bring in-house.** Usually the highest-volume providers (where cost bites) or the ones where you need raw fields (where fidelity bites) go first. Leave the long tail on the aggregator — you do not have to migrate everything.\n2. **Register direct developer apps and apply for approval early.** Create your own developer app per provider and submit any required applications up front. Garmin, WHOOP, and Fitbit gate access behind review — verify current terms and allow weeks of lead time, as of 2026.\n3. **Re-map normalized to raw schemas.** Map the aggregator's normalized model back to each provider's raw schema, field by field. This is fresh mapping work; confirm each provider still offers the specific fields you are migrating for.\n4. **Re-own ingestion, token storage, and refresh.** Build per-provider webhook or polling ingestion, secure token storage, and refresh handling — the plumbing the aggregator used to run for you.\n5. **Re-consent users onto your own OAuth.** For each migrated provider, users must re-authorize through your OAuth flow. Grants and refresh tokens held by the aggregator do not transfer, so plan a reconnect flow from the start.\n6. **Run direct and aggregator in parallel.** Dual-read from both paths and compare values across a validation window before trusting the direct path.\n7. **Back-fill history directly from the provider.** Pull historical data from each provider within its own cap. How far back you can go is set by the provider, not by you — verify current per-provider limits.\n8. **Cut over provider-by-provider.** Migrate one provider at a time, keep the aggregator live for not-yet-migrated providers, and hold it as a rollback path until each direct integration is validated.\n\n### Gotchas and how to keep users connected\n\n- **Connections do not transfer.** OAuth grants and refresh tokens are bound to the aggregator's app; your direct app needs a fresh user authorization. Design a clear in-app reconnect prompt and reconcile each provider user ID back to your own user. More on this in [keep users connected during migration](/migrate/keep-users-connected-during-migration).\n- **You inherit approval renewals.** Provider approvals can require periodic re-review or updated data-handling attestations. That upkeep is now yours — verify each provider's renewal terms.\n- **Raw fields may not survive the round trip.** Confirm the provider still exposes the field you left the aggregator to get; do not assume a raw field exists just because the aggregator once flattened it.\n- **Back-fill is provider-capped.** History depth is limited per provider, and large ranges may arrive asynchronously. Reconcile gaps against the aggregator path before you decommission it.\n- **Migrate in waves with monitoring.** Track per-user connection state (aggregator-connected / reconnected / failed) so you can target reminders and never big-bang the cutover.\n\n### Honest close\n\nThis is a real re-integration with an ongoing cost: for every provider you bring in-house you take back the exact maintenance burden the aggregator removed — auth, token refresh, schema drift, webhook handling, and approval renewals. That can still be the right call for high-volume or high-fidelity providers, but treat it as a per-provider decision, not an all-or-nothing exit. Approval timelines, fees, rate limits, and back-fill caps all shift — verify current developer terms per provider before you plan the move.",
    "steps": [
      {
        "name": "Prioritize which providers to bring in-house",
        "text": "Start with the highest-volume providers (where cost bites) or the ones where you need raw fields the normalized schema drops (where fidelity bites). Leave the long tail on the aggregator; you do not have to migrate everything."
      },
      {
        "name": "Register direct developer apps and apply for approval early",
        "text": "Create your own developer app per provider and submit required applications up front. Garmin, WHOOP, and Fitbit gate access behind review - verify current terms and allow weeks of lead time, as of 2026."
      },
      {
        "name": "Re-map normalized to raw provider schemas",
        "text": "Map the aggregator's normalized model back to each provider's raw schema, field by field. This is fresh mapping work; confirm each provider still exposes the specific fields you are migrating for."
      },
      {
        "name": "Re-own ingestion, token storage, and refresh",
        "text": "Build per-provider webhook or polling ingestion, secure token storage, and token refresh - the plumbing the aggregator used to run for you."
      },
      {
        "name": "Re-consent users onto your own OAuth",
        "text": "For each migrated provider, users must re-authorize through your OAuth flow. Grants and refresh tokens held by the aggregator do not transfer, so design a clear reconnect flow from the start."
      },
      {
        "name": "Run direct and aggregator in parallel",
        "text": "Dual-read from both paths and compare values across a validation window before trusting the direct path over the aggregator."
      },
      {
        "name": "Back-fill history directly from the provider",
        "text": "Pull historical data from each provider within its own cap. How far back you can go is set by the provider, not by you - verify current per-provider limits, and expect large ranges to arrive asynchronously."
      },
      {
        "name": "Cut over provider-by-provider",
        "text": "Migrate one provider at a time, keep the aggregator live for not-yet-migrated providers, and hold it as a rollback path until each direct integration is validated."
      }
    ],
    "faqs": [
      {
        "q": "Do user connections transfer from the aggregator to my direct integration?",
        "a": "No. OAuth grants and refresh tokens are bound to the aggregator's app and do not transfer to your own app. Every user must re-authorize through your OAuth flow, so plan a reconnect flow and identity reconciliation from day one."
      },
      {
        "q": "Which providers require their own approval when I go direct?",
        "a": "Several gate access behind review even when you integrate directly. As of 2026, Garmin's Health API runs through a partner-program application reviewing your use case and data handling (some premium metrics may carry license fees), and WHOOP and Fitbit have their own app registration and review. Verify each provider's current developer terms and allow weeks of lead time."
      },
      {
        "q": "Will I get the raw provider fields the aggregator's normalized schema dropped?",
        "a": "Often yes - direct access to a provider's raw schema is a common reason to leave. But confirm the provider still exposes that specific field before migrating for it; do not assume a field survives just because the aggregator once flattened or dropped it. Verify per provider."
      },
      {
        "q": "How far back can I back-fill history after going direct?",
        "a": "Back-fill depth is capped by each provider, not by you or the aggregator, and large ranges are often delivered asynchronously. Verify current per-provider limits, and reconcile any gaps against the aggregator path before decommissioning it."
      },
      {
        "q": "Is going direct actually cheaper?",
        "a": "It can be for high-volume providers where per-connection or per-MAU aggregator fees exceed in-house cost, but it is not pure savings. You take back per-provider auth, token refresh, schema drift, webhook handling, and approval renewals. Treat it as a per-provider trade-off and verify current pricing, as of 2026."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/integrate/fitbit-api",
        "label": "Integrate the Fitbit API"
      },
      {
        "href": "/migrate/consolidate-wearables-with-aggregator",
        "label": "Consolidate wearables with an aggregator"
      },
      {
        "href": "/migrate",
        "label": "All migration guides"
      }
    ],
    "cta": {
      "pitch": "Provider approval terms, rate limits, and back-fill caps shift without notice - get deprecation and API-change alerts in your inbox before they break your integration."
    }
  },
  {
    "slug": "between-health-data-aggregators",
    "primaryQuery": "switch health data aggregator",
    "h1": "How to switch from one health data aggregator to another",
    "metaTitle": "Switch Health Data Aggregators: Migration Guide",
    "metaDescription": "Moving between health data aggregators (Terra, Junction, Rook, Spike)? Re-map schemas, rewire webhooks, and get users to reconnect. Step-by-step.",
    "updated": "2026-07-20",
    "answer": "Switching aggregators (for example Terra to Junction (formerly Vital), Rook, or Spike) is a real re-integration, not a config swap. Each aggregator has its own normalized schema, connect flow, and webhook signatures, so you re-map fields and rewire your handler. The biggest gotcha: grants and refresh tokens do not transfer, so every user must reconnect. Run both in parallel and migrate in waves.",
    "body": "## Switching from one health data aggregator to another\n\nYou're moving your integration from one aggregator to another — say Terra to Junction (formerly Vital), Rook, or Spike, or any pairing among them. Here's the honest version up front: this is a real re-integration, not a config swap. Each aggregator has its own normalized schema, its own connect/widget flow, and its own webhook signatures, so you re-map fields, rewire your webhook handler, and — the biggest gotcha — your users must reconnect, because the grants and refresh tokens held by the old aggregator do not transfer to the new one. Plan to run both in parallel and migrate users in waves.\n\nIf you're still deciding which aggregator to land on, that comparison lives in [Terra vs Vital](/fitness-apis/terra-vs-vital) and [Terra alternatives](/alternatives/terra-alternatives) — this page assumes you've picked the destination and covers the move itself.\n\n## Why teams switch aggregators\n\nThe trigger is usually one of these, and all of them shift over time — treat any specific claim as \"as of 2026, verify current docs\":\n\n- **Pricing / cost structure at scale.** Per-connection or per-MAU costs differ between vendors, and what's cheapest at 1,000 users may not be at 100,000. Verify current pricing with each vendor directly.\n- **Provider and device coverage.** Which wearables and which data types each aggregator supports differs. Coverage parity is per-provider *and* per-field — confirm both before committing.\n- **Reliability, latency, normalization quality, and support.** Webhook latency, how cleanly each vendor normalizes data, and how responsive their support is all vary. Do not treat any vendor ranking as settled fact; these shift.\n\n## What actually changes\n\nThe move is real engineering work because the two aggregators are genuinely different products behind their \"one API\" marketing.\n\n| Old aggregator | New aggregator | What it means for you |\n| --- | --- | --- |\n| Its normalized schema | A different normalized schema | Re-map field-by-field; some fields are renamed or dropped |\n| Its connect/widget flow | A different connect flow | New reconnect UX; users re-authorize from scratch |\n| Its user-identity/reference convention | A different reference-id convention | Re-wire how events map back to your users |\n| Its webhook signatures/events (e.g. Terra's `terra-signature` HMAC) | A different signing scheme + event model | New signature verification and handler logic |\n| Grants + refresh tokens held there | Nothing transfers | Every user must reconnect |\n\nBack-fill depth is worth calling out separately: how far back you can pull historical data is set by each underlying *provider*, not by the aggregator you choose. Terra, for example, documents different per-provider caps (Garmin, Polar, and Coros each differ) — verify current limits. Switching aggregators does not raise those caps.\n\nFor the target's setup mechanics, see the [Terra API integration guide](/integrate/terra-api); for the concept itself, [what is a health data aggregator](/learn/what-is-a-health-data-aggregator).\n\n## The migration, step by step\n\n1. **Confirm coverage parity.** Verify the new aggregator covers every provider AND every specific data field you currently consume. Check per-provider and per-field — do not assume \"supports Garmin\" means the exact metric you rely on survives normalization.\n2. **Map the schemas.** Build a field-by-field table from the old aggregator's normalized schema to the new one. Flag every dropped or renamed field, and confirm raw/passthrough availability if you depend on a provider-specific field.\n3. **Register any provider apps the new aggregator requires you to own.** Some providers (e.g. Garmin, WHOOP, Fitbit) may still need your own developer credentials and approval even behind an aggregator. Submit these early — approvals take lead time. Verify per provider.\n4. **Stand up the new webhook endpoint in parallel.** Deploy the new aggregator's endpoint alongside the old one and implement its signature verification and event model. Do not decommission the old path yet.\n5. **Wire user-identity reconciliation.** Map the new aggregator's reference-id convention back to your user IDs so incoming events resolve to the right user.\n6. **Re-consent users in waves.** Ship a reconnect prompt that deep-links into the new connect flow, explain why reconnection is needed, and migrate cohorts rather than doing a big-bang cutover. Track per-user state (old-connected / reconnected / failed) to target reminders.\n7. **Back-fill history on the new path.** Pull historical data through the new aggregator within each provider's cap. Expect large ranges to arrive asynchronously in chunks; reconcile against the old path.\n8. **Dual-run, validate, then decommission.** Compare old vs new data over a validation window, keep rollback available per cohort, and only turn down the old aggregator once reconnection rate and data continuity are confirmed.\n\n## Gotchas and how to keep users connected\n\n- **Connections do not transfer.** This is the number-one way to silently lose users. OAuth grants and refresh tokens are bound to the old aggregator's app; the new path needs a fresh authorization from each user. Plan re-consent from day one — see [keep users connected during a migration](/migrate/keep-users-connected-during-migration).\n- **Data gaps during the wave.** Until a user reconnects, keep the old path flowing so their data doesn't stop. Dual-read both sources and reconcile.\n- **Dropped fields hide in the normalized schema.** A unified schema can flatten or omit provider-specific fields. If your product logic reads one, confirm the new aggregator exposes it (raw passthrough if needed) before you cut over.\n- **Back-fill won't be deeper than the provider allows.** Set expectations: you cannot restore more history than each provider permits, regardless of which aggregator you use.\n\n## How much effort is this, really\n\nBudget for it as a full re-integration of your ingestion layer plus a user-facing reconnect campaign — not a weekend swap. The engineering (schema mapping, new webhook handling, identity reconciliation) is bounded and predictable; the reconnect rate is the variable that determines your timeline. Always confirm the destination aggregator's current schema, connect flow, webhook scheme, and per-provider back-fill caps against its live documentation before you commit, since all of these shift.",
    "steps": [
      {
        "name": "Confirm coverage parity",
        "text": "Verify the new aggregator covers every provider AND every data field you currently use. Check per-provider and per-field; do not assume support for a device means the exact metric you rely on survives normalization."
      },
      {
        "name": "Map old schema to new schema",
        "text": "Build a field-by-field table from the old aggregator's normalized schema to the new one. Flag dropped or renamed fields, and confirm raw passthrough for any provider-specific field you depend on."
      },
      {
        "name": "Register provider apps you must own",
        "text": "Some providers (e.g. Garmin, WHOOP, Fitbit) may still require your own developer credentials and approval behind the new aggregator. Submit these early since approvals take lead time. Verify per provider."
      },
      {
        "name": "Stand up the new webhook in parallel",
        "text": "Deploy the new aggregator's webhook endpoint alongside the old one and implement its signature verification and event model. Keep the old path live."
      },
      {
        "name": "Wire user-identity reconciliation",
        "text": "Map the new aggregator's reference-id convention back to your own user IDs so incoming events resolve to the correct user."
      },
      {
        "name": "Re-consent users in waves",
        "text": "Ship a reconnect prompt that deep-links into the new connect flow and explains why reconnection is needed. Migrate cohorts, not everyone at once, and track per-user connection state."
      },
      {
        "name": "Back-fill history within provider caps",
        "text": "Pull historical data through the new aggregator within each provider's cap. Expect large ranges to arrive asynchronously in chunks and reconcile against the old path."
      },
      {
        "name": "Dual-run, validate, then decommission",
        "text": "Compare old versus new data over a validation window and keep rollback available per cohort. Turn down the old aggregator only once reconnection rate and data continuity are confirmed."
      }
    ],
    "faqs": [
      {
        "q": "Do my users have to reconnect when I switch aggregators?",
        "a": "Yes, in almost all cases. OAuth grants and refresh tokens are bound to the old aggregator's app and do not transfer to the new one, so each user must re-authorize through the new connect flow. Plan a reconnect campaign from the start."
      },
      {
        "q": "Can I just re-point my webhook to the new aggregator?",
        "a": "No. Aggregators use different webhook signatures and event models (for example Terra's terra-signature HMAC versus another vendor's scheme), so you rewrite your signature verification and handler. It is a real re-integration, not a URL change."
      },
      {
        "q": "Will switching aggregators let me back-fill more history?",
        "a": "No. Back-fill depth is set by each underlying provider, not by the aggregator you use. Terra documents different per-provider caps, and switching vendors does not raise them. Verify current per-provider limits."
      },
      {
        "q": "Is coverage the same across aggregators?",
        "a": "Not necessarily. Coverage differs by aggregator and shifts over time, and parity is per-provider and per-field. Confirm the new aggregator supports both every provider and the specific data fields you consume before committing. As of 2026, verify current docs."
      },
      {
        "q": "How long should I run both aggregators in parallel?",
        "a": "Long enough to migrate users in waves, validate data continuity per cohort, and confirm reconnection rates. Keep the old path live and a rollback available until the new source is proven; do not hard-cut."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/terra-vs-vital",
        "label": "Terra vs Vital (Junction)"
      },
      {
        "href": "/integrate/terra-api",
        "label": "Integrate Terra"
      },
      {
        "href": "/alternatives/terra-alternatives",
        "label": "Terra alternatives"
      },
      {
        "href": "/migrate",
        "label": "All migration guides"
      }
    ],
    "cta": {
      "pitch": "Aggregator pricing, coverage, and webhook schemes change often — subscribe for plain-English alerts when a health data API shifts under you."
    }
  },
  {
    "slug": "polling-to-webhooks",
    "primaryQuery": "migrate polling to webhooks fitness api",
    "h1": "Migrate from polling to webhooks for a fitness API",
    "metaTitle": "Migrate Polling to Webhooks (Fitness API)",
    "metaDescription": "Move a fitness integration from scheduled polling to webhooks: verify the endpoint, handle notification payloads, add idempotency, keep a fallback poll.",
    "updated": "2026-07-20",
    "answer": "Moving from polling to webhooks means the provider pushes an event when data changes instead of your backend polling on a timer. The biggest gotcha: many providers send a notification with an object id, not the full data, so you still fetch the record. It is a real re-integration - a secured HTTPS endpoint, signature verification, a queue, idempotency, ordering guards, and a fallback poll - not a flag flip. Run polling and webhooks in parallel and keep a low-frequency poll as a permanent safety net.",
    "body": "## Migrate from polling to webhooks\n\nYou are moving an existing fitness integration from scheduled polling to webhook-driven updates: instead of your backend asking the provider \"anything new?\" on a timer, the provider pushes an event the moment data changes. The single biggest gotcha is that many providers send a *notification, not the data* — the webhook says \"new activity, id=X\" and you still have to fetch the full record. This is a real re-integration with new plumbing (an HTTPS endpoint, signature verification, a queue, idempotency, and a reconciliation fallback), not a flag you flip. Plan to run polling and webhooks in parallel and keep a low-frequency poll as a permanent safety net.\n\n### Why make the move\n\n- **Freshness.** Push delivers new data near-real-time, instead of waiting for the next scheduled poll to come around.\n- **Rate-limit pressure.** Polling burns request budget on unchanged data; webhooks fire only when something actually changes. As an example, Strava's documented defaults are around 200 requests per 15 minutes and roughly 2,000 per day overall (with a lower non-upload limit) — treat those as illustrative and verify current numbers in the provider docs.\n- **Cost and efficiency.** Fewer wasted calls means less compute and less throttling risk at scale.\n\nIf you are new to the mechanics, see [what are webhooks](/learn/what-are-webhooks) — this page does not re-explain the concept, it covers the migration.\n\n### What actually changes\n\n| Old (polling) | New (webhooks) | What it means for you |\n| --- | --- | --- |\n| You call the API on a timer | Provider calls your endpoint on change | You must stand up and secure a public HTTPS endpoint |\n| You already have the response body | Payload is often just a notification with an object id | You may still fetch the full record after the event |\n| Requests are ordered and pulled by you | Delivery is at-least-once, unordered, best-effort | You need idempotency, ordering guards, and retry tolerance |\n| Missing data = next poll catches it | A dropped delivery or endpoint downtime = a silent gap | You keep a reconciliation poll as a fallback |\n\nA key nuance: **not all providers send the same payload shape.** Strava's webhook events carry object and aspect ids rather than the full activity, so you fetch afterward. Terra can deliver normalized data in the webhook itself but sends large historical ranges (documented as over 28 days) asynchronously in chunks. Design for both shapes and verify per provider.\n\n### The migration, step by step\n\n1. **Stand up an HTTPS endpoint and implement the verification handshake.** Most providers validate your endpoint with a challenge/response before they will deliver events; return the expected token to prove you own it.\n2. **Verify signatures on every request.** Providers typically sign the raw body with an HMAC secret. Compute over the raw bytes, use a constant-time compare, require HTTPS, support secret rotation, and reject stale timestamps to blunt replay.\n3. **Register the webhook subscription** — and mind per-app subscription caps. Some providers limit how many subscriptions an app can hold; Strava is documented as one push subscription per application (verify current limits).\n4. **Acknowledge fast, process async.** On receipt: verify, return a `2xx` immediately, and enqueue the event for a worker. Doing heavy work synchronously causes timeouts, which trigger provider retries and duplicate deliveries.\n5. **In the worker, dedupe then fetch.** Dedupe on the provider's unique event id (keep the dedupe store longer than the provider's retry window), then fetch the full record if the payload was only a notification.\n6. **Guard ordering and handle retries.** Delivery is unordered and at-least-once — use timestamps or version numbers so a stale event never overwrites newer state, and dead-letter poison events for later inspection.\n7. **Keep a scheduled reconciliation poll as a fallback and gap back-fill.** Webhooks miss during endpoint downtime or dropped deliveries; a low-frequency poll catches what the push stream drops.\n8. **Ramp webhook traffic while polling runs in parallel.** Once webhook coverage is verified against the poll, reduce polling to the low-frequency safety net rather than removing it.\n\n### Gotchas and how to keep the data flowing\n\n- **Do not assume the payload contains the data.** Check each provider — some push the record, some push only an id you must fetch. Building for one shape and getting the other silently loses data.\n- **At-least-once means duplicates are normal.** Without idempotency keyed on the event id, retries double-process events. Without an ordering guard, an out-of-order delivery can roll back good state.\n- **Webhooks are best-effort, not guaranteed.** There is no built-in catch-up for an outage on your side, which is why the reconciliation poll stays in place permanently, not just during cutover.\n- **Subscription caps constrain architecture.** If a provider allows only one subscription per app, you cannot spin up a separate subscription per environment casually — plan routing accordingly and verify the cap.\n\nIf your webhook stops arriving after setup, the symptom-level checklist lives in [Strava webhook not firing](/fix/strava-webhook-not-firing). If you would rather one integration normalize many providers' webhook streams into a single schema, that trade-off is covered under [health data aggregator APIs](/fitness-apis/health-data-aggregator-apis).\n\n### How much effort is this really\n\nBudget for it as a genuine re-integration: a secured endpoint, a queue and worker, idempotency and ordering logic, and a fallback poll — plus a parallel-run window to prove coverage before you dial polling down. None of the specifics here (rate limits, retry counts, timeout windows, subscription caps) are safe to hardcode; they shift, so verify the current provider docs as of 2026 before you build against any number.",
    "steps": [
      {
        "name": "Stand up an HTTPS endpoint with the verification handshake",
        "text": "Expose a public HTTPS endpoint and implement the provider's challenge/response verification, returning the expected token to prove you own the endpoint before deliveries begin."
      },
      {
        "name": "Verify signatures and reject replays",
        "text": "Validate the provider's HMAC signature over the raw request body with a constant-time compare, require HTTPS, support secret rotation, and reject stale timestamps to blunt replay attacks."
      },
      {
        "name": "Register the subscription, minding per-app caps",
        "text": "Register the webhook subscription and check per-app subscription limits. Some providers cap them - Strava is documented as one push subscription per application (verify current limits)."
      },
      {
        "name": "Acknowledge fast, process asynchronously",
        "text": "On receipt, verify the event, return a 2xx immediately, and enqueue it for a worker. Synchronous heavy work causes timeouts, which trigger provider retries and duplicate deliveries."
      },
      {
        "name": "Dedupe by event id, then fetch full data",
        "text": "In the worker, dedupe on the provider's unique event id (keep the dedupe store longer than the retry window), then fetch the full record if the payload was only a notification."
      },
      {
        "name": "Guard ordering and handle retries",
        "text": "Delivery is at-least-once and unordered - use timestamps or version numbers so a stale event never overwrites newer state, and dead-letter poison events for later inspection."
      },
      {
        "name": "Keep a reconciliation poll as fallback",
        "text": "Run a low-frequency scheduled poll to back-fill gaps, because webhooks miss during endpoint downtime or dropped deliveries and are best-effort, not guaranteed."
      },
      {
        "name": "Ramp webhooks while polling in parallel",
        "text": "Increase webhook traffic while polling continues, compare coverage, and only once webhooks are verified reduce polling to the low-frequency safety net rather than removing it."
      }
    ],
    "faqs": [
      {
        "q": "Does the webhook payload contain the full activity data?",
        "a": "Often not. Many providers send a notification with an object id (Strava webhook events carry object and aspect ids, not the full activity) and you fetch the record afterward. Others, like Terra, can deliver normalized data in the payload but send large historical ranges asynchronously in chunks. Design for both shapes and verify per provider."
      },
      {
        "q": "Can I stop polling once webhooks are live?",
        "a": "Not entirely. Webhooks are best-effort and can be missed during endpoint downtime or dropped deliveries, with no built-in catch-up. Keep a low-frequency reconciliation poll as a permanent fallback and gap back-fill rather than removing polling completely."
      },
      {
        "q": "Why do I need idempotency and ordering guards?",
        "a": "Webhook delivery is at-least-once and not ordered, so the same event can arrive more than once and out of sequence. Dedupe on a unique event id, and use timestamps or version numbers so a stale event does not overwrite newer state."
      },
      {
        "q": "How many webhook subscriptions can I create?",
        "a": "It depends on the provider. Some cap subscriptions per app - Strava is documented as one push subscription per application. Do not hardcode this; verify the current limit in the provider's webhook docs as of 2026."
      },
      {
        "q": "Will webhooks lower my rate-limit usage?",
        "a": "Generally yes, because you stop spending request budget polling for unchanged data and only act when an event fires. Actual limits vary and change - verify current provider numbers rather than relying on any quoted figure."
      }
    ],
    "related": [
      {
        "href": "/learn/what-are-webhooks",
        "label": "What are webhooks?"
      },
      {
        "href": "/fix/strava-webhook-not-firing",
        "label": "Fix: Strava webhook not firing"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/migrate",
        "label": "All migration guides"
      }
    ],
    "cta": {
      "pitch": "Provider rate limits, webhook rules, and subscription caps change often - get our newsletter on fitness API deprecations and breaking changes so a webhook shift never blindsides your integration."
    }
  },
  {
    "slug": "adapt-to-strava-api-changes",
    "primaryQuery": "strava api changes 2024 migration",
    "h1": "Adapting Your Integration to Strava's API Changes",
    "metaTitle": "Adapt to Strava API Changes (2024): Migration Guide",
    "metaDescription": "Strava tightened its API and developer program since 2024. How to audit fields, re-consent athletes, and adapt. Verify current terms.",
    "updated": "2026-07-20",
    "answer": "Strava has tightened its API and Developer Program in changes rolling out from 2024 onward, so a live integration needs to be brought back into compliance rather than left as-is. Re-read the current developer agreement, re-audit every field you store or display, confirm athlete consent shows in your UI, and re-check rate limits and the one-subscription-per-app webhook constraint. The biggest gotcha: routing Strava data through third-party intermediary platforms may no longer be supported, so an aggregator-mediated setup can require a direct rebuild. Treat it as a real re-integration and verify every specific against the current Strava developer agreement and API Policy.",
    "body": "Strava has tightened its API and Developer Program in a series of changes rolling out from 2024 onward, and if you have a live Strava integration you need to bring it back into compliance rather than flip a switch. The short version: re-read the current developer agreement, re-audit every place you store or display Strava data, confirm athlete consent is reflected in your UI, and re-check your rate-limit and webhook architecture. The single biggest gotcha is that routing Strava data through third-party intermediary platforms (including some aggregators) may no longer be supported, so an aggregator-mediated setup can need a direct rebuild. Treat this as a real re-integration effort, and verify every specific below against the current Strava developer agreement and API Policy — the terms have changed repeatedly since 2024.\n\n## What actually changes\n\nThe changes are less about new endpoints and more about program terms, display rules, and how third-party data can be used. As of 2026, the high-level shifts are below — verify each against the live agreement before acting, because Strava's docs and terms move.\n\n| Old assumption | What changed (verify current terms) | What it means for you |\n| --- | --- | --- |\n| Open-ish access, self-serve | Formal developer tiers (Standard default, Extended Access by review); Standard serves a limited number of athletes | Large athlete reach may require Extended Access review |\n| Display data fairly freely | Program review + display/branding rules; screenshots of every Strava-data surface and the \"Connect with Strava\" button required | You may no longer store or display some fields the same way |\n| Route data through any partner | Intermediary-platform routing reportedly no longer supported | Aggregator-mediated Strava paths may be disallowed |\n| API access included | A Strava subscription is being required for Standard Tier access (effective date rolling in) | Budget/enroll before the effective date — verify the date |\n| Fixed rate limits | Documented default limits still exist (overall vs non-upload, per-window and per-day) | Do not hardcode numbers — verify current values |\n| Many webhook subscriptions | One push subscription per application (verify) | Design your webhook architecture around a single subscription |\n\nThe practical impact concentrates in a few places. Athlete permission and consent are required and must be visible in your UI. Data display and retention are constrained by the current terms, so a field you store or render today may need to be reformatted or dropped. And if Strava data currently flows through an aggregator or intermediary, that path may not comply — a consequential risk for anyone who reaches Strava indirectly. For target-integration setup details see [/integrate/strava-api](/integrate/strava-api), and if you decide the terms no longer fit your product, weigh [/alternatives/strava-api-alternatives](/alternatives/strava-api-alternatives).\n\n## The migration, step by step\n\nThis is an adaptation of an existing integration, so the sequence is audit-first, then reconcile architecture, then re-enroll. Run your current integration in parallel while you validate the changes.\n\n1. **Re-read the current agreement.** Open the live Strava API Agreement, Developer Program terms, and API Policy — they supersede any summary, including this page.\n2. **Refresh the Developer Program form.** Complete or update it with current screenshots of every surface where Strava data appears, plus the \"Connect with Strava\" button.\n3. **Audit stored and displayed fields.** Check every Strava field you store or render against current terms; remove or reformat anything non-compliant and fix attribution and branding.\n4. **Confirm athlete consent.** Verify your permission and consent UX meets the current athlete-permission requirements and is reflected in the UI.\n5. **Check the intermediary/aggregator path.** If Strava data flows through an aggregator or intermediary platform, verify that path is still permitted; plan a direct integration if it is not.\n6. **Re-check rate limits and webhooks.** Reconcile your rate-limit handling and the one-subscription-per-app webhook constraint against your architecture — see [/fix/strava-webhook-not-firing](/fix/strava-webhook-not-firing) if events stop arriving.\n7. **Confirm the subscription requirement.** Check whether a Strava subscription is now required for your tier and budget or enroll before the effective date.\n8. **Choose your tier.** Decide Standard vs Extended Access based on athlete reach, and apply for Extended Access if you need it.\n\n## Gotchas and how to keep users connected\n\nThe intermediary-platform restriction is the one that can force real rework: if you reach Strava through an aggregator, confirm the wording of the current terms before assuming your path survives, and plan a direct rebuild if it does not. Athlete grants and consent are not something you can silently carry over — if you change how you collect consent, plan for athletes to re-authorize. The one-subscription-per-app webhook limit means you cannot spin up parallel subscriptions freely, so coordinate any migration around that single channel. And because tier caps, fees, effective dates, and rate limits have all shifted since 2024, do not build against any specific number from memory.\n\nKeep your existing integration live while you reconcile these items, and cut over only once you have confirmed compliance against the current agreement. Realistically this is a compliance-and-architecture pass, not a rewrite of your core data flow — but the intermediary and subscription changes can escalate it into a direct re-integration, so scope it after you have read the live terms. When in doubt, verify the current Strava developer agreement and API Policy.",
    "steps": [
      {
        "name": "Re-read the current agreement",
        "text": "Open the live Strava API Agreement, Developer Program terms, and API Policy. They supersede any summary, and the specifics have changed repeatedly since 2024."
      },
      {
        "name": "Refresh the Developer Program form",
        "text": "Complete or update the form with current screenshots of every surface where Strava data appears, plus the Connect with Strava button."
      },
      {
        "name": "Audit stored and displayed fields",
        "text": "Check every Strava field you store or render against current terms. Remove or reformat anything non-compliant and fix attribution and branding."
      },
      {
        "name": "Confirm athlete consent",
        "text": "Verify your permission and consent UX meets current athlete-permission requirements and is reflected in the UI. Athletes may need to re-authorize."
      },
      {
        "name": "Check the intermediary/aggregator path",
        "text": "If Strava data flows through an aggregator or intermediary platform, verify that path is still permitted and plan a direct integration if it is not."
      },
      {
        "name": "Re-check rate limits and webhooks",
        "text": "Reconcile your rate-limit handling and the one-subscription-per-app webhook constraint against your architecture. Do not hardcode limit numbers."
      },
      {
        "name": "Confirm the subscription requirement",
        "text": "Check whether a Strava subscription is now required for your tier and budget or enroll before the effective date. Verify the current date."
      },
      {
        "name": "Choose Standard vs Extended Access",
        "text": "Decide your tier based on athlete reach, since Standard serves a limited number of athletes. Apply for Extended Access review if you need broader reach."
      }
    ],
    "faqs": [
      {
        "q": "What changed in Strava's API since 2024?",
        "a": "At a high level, and rolling out over time: formal developer tiers (Standard and Extended Access), a Developer Program review with display and branding rules, restrictions on routing data through intermediary platforms, athlete-permission requirements, documented rate limits, one webhook subscription per app, and a subscription being required for Standard Tier access. Exact numbers, fees, and dates change often, so verify the current Strava developer agreement and API Policy."
      },
      {
        "q": "Can I still use an aggregator for Strava data?",
        "a": "Maybe not. Strava has reportedly stopped supporting apps that route its data through third-party intermediary platforms, which can include some aggregator setups. Check whether your aggregator's Strava path still complies under the current terms, and plan a direct integration if it does not. Confirm the current wording before rebuilding."
      },
      {
        "q": "Do I have to reformat or remove data I already store?",
        "a": "Possibly. How athlete data can be displayed and retained is constrained by the current terms, so a field you store or render today may need to be reformatted or dropped. Audit every Strava field against the live agreement rather than assuming your existing handling still complies."
      },
      {
        "q": "Will my athletes have to reconnect?",
        "a": "Athlete permission and consent are required and must be visible in your UI. If you change how you collect consent to meet current requirements, plan for athletes to re-authorize rather than assuming existing grants carry over silently."
      },
      {
        "q": "What are the current rate limits and tier caps?",
        "a": "Strava documents default limits (overall vs non-upload, per-window and per-day) and a limited athlete cap on the Standard tier, but the exact numbers, caps, fees, and effective dates change. Do not build against any specific value from memory; verify the current Strava developer agreement and API Policy."
      }
    ],
    "related": [
      {
        "href": "/integrate/strava-api",
        "label": "Integrate the Strava API"
      },
      {
        "href": "/fix/strava-webhook-not-firing",
        "label": "Fix: Strava webhook not firing"
      },
      {
        "href": "/alternatives/strava-api-alternatives",
        "label": "Strava API alternatives"
      },
      {
        "href": "/migrate",
        "label": "All migration guides"
      }
    ],
    "cta": {
      "pitch": "Get a heads-up when Strava and other fitness APIs change their terms, rate limits, or access rules before they break your integration."
    }
  },
  {
    "slug": "keep-users-connected-during-migration",
    "primaryQuery": "migrate fitness api without losing users",
    "h1": "Keep Users Connected During a Fitness API Migration",
    "metaTitle": "Migrate a Fitness API Without Losing Users",
    "metaDescription": "Vendor-neutral playbook to keep users connected during a fitness API migration: run old and new in parallel, re-consent, migrate in waves.",
    "updated": "2026-07-20",
    "answer": "Moving a fitness or health integration to a new source is a real re-integration, not a flag flip. The biggest gotcha is that connections do not transfer: OAuth grants and refresh tokens are bound to your old app or aggregator, so every user must re-authorize the new one. Keep users connected by running old and new in parallel, shipping a re-consent flow, migrating in waves, and holding rollback until continuity is proven.",
    "body": "## Keep users connected during a fitness API migration\n\nYou are moving an existing fitness or health integration to a new source — a new provider, a new aggregator, or a new platform store — and the one thing you cannot afford is a wall of users whose data silently stops flowing. Here is the reality up front: connections do not transfer. OAuth grants and refresh tokens are bound to your old app or aggregator, so the new path needs a fresh user authorization no matter how clean the swap looks in your backend. This is a real re-integration, not a flag flip, and the single biggest gotcha is assuming users come along automatically. They do not — you have to run old and new in parallel, get each user to re-consent, and only then decommission the old path.\n\nThis page is the cross-cutting continuity playbook. It is vendor-neutral and applies on top of any specific move (consolidating onto an aggregator, leaving one, switching aggregators, or migrating off a deprecated API — see [migrate off a deprecated fitness API](/migrate/migrate-off-a-deprecated-fitness-api)).\n\n## What actually changes\n\n| Old path | New path | What it means for you |\n| --- | --- | --- |\n| Existing OAuth grants + refresh tokens | Fresh authorization required | Tokens rarely transfer; every user re-consents. See [refresh token not working](/fix/refresh-token-not-working). |\n| One live data source | Two sources running in parallel | Dual-read and compare before you trust the new one. |\n| Whatever history the old source held | Provider-capped back-fill on the new source | How far back you can restore is set by each underlying provider, not by you. |\n| Old user-identity mapping | New reference-id / user-mapping convention | Reconcile identity so new events map back to the right user. |\n\nThe recurring truth: re-consent is almost always required because refresh tokens and provider grants are not portable between your old and new plumbing. If you are shaky on why, [what is OAuth for health data](/learn/what-is-oauth-for-health-data) covers the grant model.\n\n## The migration, step by step\n\nThe sequence below keeps users connected while you move. Adapt it to your specific move, but do not skip the parallel-run or the re-consent step.\n\n1. **Stand up the new integration alongside the old one.** Run both paths at once (dual-read) so nothing stops flowing while users migrate. Never hard-cut.\n2. **Instrument both paths.** Add per-user connection status and data-freshness dashboards on the old and new source so you can see, per cohort, who is connected and whether data is actually arriving.\n3. **Design and ship the re-consent UX.** Build a clear in-app prompt that explains why reconnection is needed and deep-links into the new connect flow, and wire identity reconciliation so the new source's user id maps back to your user. Keep it non-blocking where possible — let old-path data keep flowing until the user reconnects.\n4. **Communicate ahead of time.** Tell users what is changing, what they must do, and when, via email and in-app, before you start moving cohorts.\n5. **Migrate in waves.** Move users in cohorts, not a big-bang cutover, and watch reconnection rate and data continuity per cohort before expanding.\n6. **Back-fill within provider caps, then reconcile gaps.** Pull whatever history the new source and its permissions allow, then compare against the old path to find and document gaps. Back-fill depth is provider-dependent and capped — as of 2026, verify current per-provider limits before promising any history depth.\n7. **Keep rollback available.** Do not decommission anything until each cohort is validated; keep the ability to fall back to the old source.\n8. **Chase stragglers, then decommission.** Send reminders to users who have not reconnected, and only retire the old path once reconnection and data continuity are confirmed across cohorts.\n\n## Gotchas and how to keep users connected\n\n**Tokens do not carry over.** The most common way to lose users is to assume the migration moves their authorization. It does not — grants and refresh tokens live with the old app or aggregator, and the new path needs a fresh grant. Plan for mandatory re-consent from day one, not as a cleanup step.\n\n**Back-fill is provider-capped, not something you control.** How far back you can restore history is set by each underlying provider regardless of who your integration partner is. Terra, for example, documents caps that differ sharply by provider (reported as roughly 5 years for Garmin, about 30 days for Polar, around 3 months for Coros — as of 2026, verify current caps), and large ranges are delivered asynchronously in chunks. Expect a history gap somewhere and tell users about it rather than letting them discover it.\n\n**Silent data gaps.** Because the two paths can disagree, reconcile the new source against the old during the validation window and document any gap before you cut over. This is why the dashboards in step 2 matter.\n\n**Non-reconnected users.** Some users will never see the prompt. Track per-user connection state (old-connected, reconnected, failed) so reminders target only the people who still need to act, and keep the old path alive for them until they reconnect.\n\n**Do not decommission early.** Keep rollback until each cohort is proven. The old source is your safety net, not dead weight, until continuity is confirmed.\n\n## Honest close\n\nContinuity work is mostly discipline, not cleverness: run both sources, get real re-consent, migrate in cohorts, and hold rollback until the numbers say the new path is solid. Do not promise yourself or your users a seamless, zero-touch migration — re-consent is almost always required, and back-fill depth is capped by each provider. Before you commit to any timeline or history-depth claim, verify the current per-provider limits and the current docs for whichever source you are moving to.",
    "steps": [
      {
        "name": "Run old and new in parallel",
        "text": "Stand up the new integration alongside the old one and dual-read so nothing stops flowing while users migrate. Never hard-cut."
      },
      {
        "name": "Instrument both paths",
        "text": "Add per-user connection status and data-freshness dashboards on both sources so you can see, per cohort, who is connected and whether data is arriving."
      },
      {
        "name": "Ship the re-consent UX",
        "text": "Build a clear in-app prompt explaining why reconnection is needed, deep-link into the new connect flow, and reconcile identity so the new source maps back to your user. Keep it non-blocking where possible."
      },
      {
        "name": "Communicate ahead of time",
        "text": "Tell users what is changing, what they must do, and when, via email and in-app, before you start moving cohorts."
      },
      {
        "name": "Migrate in waves",
        "text": "Move users in cohorts, not a big-bang cutover, and watch reconnection rate and data continuity per cohort before expanding."
      },
      {
        "name": "Back-fill within caps and reconcile gaps",
        "text": "Pull whatever history the new source and its permissions allow, then compare against the old path to find and document gaps. Back-fill depth is provider-capped; as of 2026, verify current per-provider limits."
      },
      {
        "name": "Keep rollback available",
        "text": "Do not decommission anything until each cohort is validated; keep the ability to fall back to the old source."
      },
      {
        "name": "Chase stragglers, then decommission",
        "text": "Remind users who have not reconnected, and retire the old path only once reconnection and data continuity are confirmed across cohorts."
      }
    ],
    "faqs": [
      {
        "q": "Do OAuth tokens transfer to the new integration?",
        "a": "Almost never. Refresh tokens and provider grants are bound to your old app or aggregator, so the new path needs a fresh user authorization. Plan for mandatory re-consent from day one rather than treating it as cleanup."
      },
      {
        "q": "Can I back-fill a user's full history on the new source?",
        "a": "Usually only partially. How far back you can restore is capped by each underlying provider, not by you or your integration partner, and large ranges are often delivered asynchronously in chunks. As of 2026, verify current per-provider caps and expect a gap somewhere."
      },
      {
        "q": "How do I avoid losing users who never reconnect?",
        "a": "Track per-user connection state (old-connected, reconnected, failed) so reminders target only those who still need to act, and keep the old path live for them until they reconnect. Do not decommission until continuity is confirmed."
      },
      {
        "q": "Should I cut everyone over at once?",
        "a": "No. Migrate in waves with monitoring on both paths, and hold a rollback option until each cohort is validated. A big-bang cutover with no fallback is how continuity fails at scale."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-oauth-for-health-data",
        "label": "What is OAuth for health data?"
      },
      {
        "href": "/fix/refresh-token-not-working",
        "label": "Fix: refresh token not working"
      },
      {
        "href": "/migrate/migrate-off-a-deprecated-fitness-api",
        "label": "Migrate off a deprecated fitness API"
      },
      {
        "href": "/migrate",
        "label": "All migration guides"
      }
    ],
    "cta": {
      "pitch": "Get a heads-up when a fitness provider announces a deprecation or forced re-consent, so you can plan the migration before users drop off."
    }
  },
  {
    "slug": "migrate-off-a-deprecated-fitness-api",
    "primaryQuery": "migrate off deprecated fitness api",
    "h1": "Migrate off a deprecated fitness API",
    "metaTitle": "Migrate Off a Deprecated Fitness API: Playbook",
    "metaDescription": "Move off any deprecated fitness or health API: inventory, map data and auth, run the successor in parallel, re-consent users, then cut over in waves.",
    "updated": "2026-07-20",
    "answer": "Migrating off a deprecated fitness or health API is a real re-integration, not a config swap: you adopt a successor with a new data schema and usually a new auth model, and most users must reconnect because tokens do not carry over. The biggest silent gap is historical data, which is provider-capped and often not fully recoverable. Run the successor in parallel with a rollback path, migrate users in waves, and decommission only after the new path is validated. Verify the vendor's current timeline and data-type coverage before you cut over.",
    "body": "## Migrate off a deprecated fitness API\n\nA fitness or health provider has announced it is sunsetting the API you depend on, and you need to move before the hard turndown. The move is a real re-integration, not a config swap: you adopt a successor product with a new data schema and — almost always — a new auth model, and in most cases every user has to reconnect because access tokens do not carry over. The single biggest silent gap is historical data, since a successor store often holds only recent or on-device data and back-fill is limited. This page is the reusable playbook for any deprecation; the two live examples below (Google Fit, Fitbit Web API) each have their own detailed guide.\n\nDeprecations tend to follow the same shape: the vendor freezes new sign-ups, announces a successor plus a timeline, opens a parallel-run window, then hard-turns-down the old API. Google Fit froze new sign-ups on May 1, 2024 and is stated to be supported only through the end of 2026 (verify the exact date); the legacy Fitbit Web API is being retired in favor of a Google-built cloud API during a 2026 side-by-side window (verify current Fitbit/Google developer notices). Your job is to run the successor in parallel with a rollback path and move users in waves before the old door closes.\n\nIf your specific trigger is Google Fit, start with the symptom page [/fix/google-fit-api-deprecated](/fix/google-fit-api-deprecated) and the full move in [/migrate/google-fit-to-health-connect](/migrate/google-fit-to-health-connect); the sequence below generalizes those to any provider.\n\n## What actually changes\n\nThe successor is rarely a drop-in. Expect changes on three axes — architecture, auth, and data shape — plus a history gap. State each fairly for your specific move.\n\n| Old (deprecated) | New (successor) | What it means for you |\n| --- | --- | --- |\n| Cloud REST, server-readable | Sometimes an on-device store (Health Connect, HealthKit) | On-device stores have no server endpoint — you read in the app and sync to your own backend yourself, or use an aggregator |\n| Old OAuth provider / scopes | New OAuth provider/library, or OS-level permissions | Tokens generally do not transfer; users must re-authorize the new connection |\n| Provider-shaped fields/endpoints | New record types / bundled data types | Field-by-field re-mapping; some data types may have no 1:1 equivalent — flag them |\n| Full cloud history | Recent / permission-gated history | Deep history often cannot be recovered; document the gap for users |\n\nTwo recurring truths worth repeating: on-device successors (Health Connect on Android, HealthKit on iOS) are on-device stores with no cloud endpoint, so a backend that read data server-to-server must re-architect; and how far back you can back-fill is set by each underlying provider, not by you. For the concept behind that architecture shift, see [/learn/on-device-vs-cloud-health-data](/learn/on-device-vs-cloud-health-data).\n\n## The migration, step by step\n\nAdapt the sequence to your specific move, but keep the order — parallel-run and rollback are what keep users connected.\n\n1. **Inventory what you use.** Enumerate every endpoint, data type, and scope, whether each read/write happens on the client or server, and your user count per integration. This map is what turns the next migration into a lookup instead of a scavenger hunt.\n2. **Find the official successor and migration notice.** Go to the vendor's primary developer docs — not blogs — for the successor product, the migration guide, and the freeze/parallel/turndown timeline. Record every date and mark it \"verify,\" because vendor timelines move.\n3. **Map data and auth models.** Build a field-by-field data mapping (old data type → new record type/field) and an old-auth → new-auth mapping side by side. Flag any missing data types and any architecture shift, such as cloud → on-device.\n4. **Stand up the new integration in parallel.** Build the successor path alongside the old one and keep the old path live through its support window. Put an abstraction layer over your health-data service so the rest of the app does not hard-depend on either provider, and dual-read to compare values.\n5. **Back-fill historical data within limits.** Pull whatever history the new source and its permissions allow (on-device stores often gate history behind a dedicated permission and a short default window — verify). Accept and document that deep history may not be recoverable.\n6. **Run a user re-consent / reconnect flow.** Design clear UX for re-authorization — new OAuth sign-in or OS permission grant — and reconcile the new provider user id back to your user. Do not force-disconnect the old source prematurely; let old-path data keep flowing until each user reconnects.\n7. **Migrate in waves with a rollback path, and monitor.** Move users in cohorts, not a big-bang cutover. Watch auth-failure, sync-gap, and permission-denied rates, compare old vs new values per cohort, and keep the ability to fall back until confidence is high.\n8. **Decommission the old integration.** Only after the wave migration is validated — and before the vendor's hard turndown — retire the old path. Chase non-reconnected users with reminders first.\n\n## Gotchas and how to keep users connected\n\nThe continuity risks are predictable, so plan for them from day one:\n\n- **Lost connections.** OAuth grants and refresh tokens are bound to the old app or aggregator; the new path always needs a fresh authorization. Assume mandatory re-consent — never promise a zero-touch migration. For the reconnect-UX details, see the companion playbook [/migrate/keep-users-connected-during-migration](/migrate/keep-users-connected-during-migration).\n- **Data gaps.** If you hard-cut, data stops while users are mid-reconnect. Dual-read old and new in parallel and reconcile gaps against the old path.\n- **Tokens that do not transfer.** Because the OAuth provider or library changes, there is no silent migration of consent. Design the re-auth prompt as a first-class flow, not an afterthought.\n- **Historical-data limits.** Back-fill depth is provider-capped and, on on-device stores, permission-gated. Verify each provider's current cap and set user expectations rather than promising full history.\n\n## Aggregator as insulation, and reducing future exposure\n\nIf you would rather not absorb the re-integration yourself — or want to avoid the next one — a health-data aggregator covers many providers behind one API or SDK. When an upstream provider deprecates, the aggregator absorbs the change and you keep a single contract. The trade-offs are honest ones: recurring cost, trusting a third party in your data path, and coverage or field-normalization limits (a unified schema can drop provider-specific fields — verify raw passthrough if you need them). Vendor examples such as Terra, Validic, Junction (formerly Vital), Rook, Spike, and Thryve/Sahha are illustrative, not endorsements — verify current provider coverage. See [/fitness-apis/health-data-aggregator-apis](/fitness-apis/health-data-aggregator-apis) for how the category works.\n\nTo reduce future deprecation exposure regardless of which path you pick: put an abstraction layer between your app and any provider so swaps stay localized; normalize to your own internal schema instead of storing vendor-shaped data; keep provider-specific quirks out of business logic; subscribe to each provider's deprecation and developer notices; prefer OS-blessed on-device stores where they fit; and keep the inventory doc from step 1 current so the next migration starts from a map.\n\n## Bottom line\n\nBudget a deprecation migration as a real re-integration: new schema, new auth, mandatory re-consent, a parallel-run window, and a partial history back-fill — not a URL swap. Move in waves with rollback, and decommission only after the successor is validated. Because vendor timelines and data-type coverage shift, verify every date and every mapping against the provider's current primary docs before you cut over.",
    "steps": [
      {
        "name": "Inventory what you use",
        "text": "Enumerate every endpoint, data type, and scope, whether each read/write is client- or server-side, and your user count per integration. This map turns the next migration into a lookup instead of a scavenger hunt."
      },
      {
        "name": "Find the official successor and migration notice",
        "text": "Use the vendor's primary developer docs, not blogs, for the successor product, migration guide, and freeze/parallel/turndown timeline. Record every date and mark it verify, since vendor timelines move."
      },
      {
        "name": "Map data and auth models",
        "text": "Build a field-by-field data mapping (old type to new record type/field) and an old-auth to new-auth mapping side by side. Flag missing data types and any architecture shift such as cloud to on-device."
      },
      {
        "name": "Stand up the new integration in parallel",
        "text": "Build the successor path alongside the old one and keep the old path live through its support window. Put an abstraction layer over your health-data service and dual-read to compare values."
      },
      {
        "name": "Back-fill historical data within limits",
        "text": "Pull whatever history the new source and its permissions allow; on-device stores often gate history behind a dedicated permission and a short default window (verify). Document any deep history that cannot be recovered."
      },
      {
        "name": "Run a user re-consent / reconnect flow",
        "text": "Design clear UX for re-authorization (new OAuth sign-in or OS permission grant) and reconcile the new provider user id to your user. Do not force-disconnect the old source until each user reconnects."
      },
      {
        "name": "Migrate in waves with a rollback path, and monitor",
        "text": "Move users in cohorts, not a big-bang cutover. Watch auth-failure, sync-gap, and permission-denied rates, compare old vs new values, and keep the ability to fall back until confidence is high."
      },
      {
        "name": "Decommission the old integration",
        "text": "Only after the wave migration is validated, and before the vendor's hard turndown, retire the old path. Chase non-reconnected users with reminders first."
      }
    ],
    "faqs": [
      {
        "q": "Can I keep my users' existing connections and tokens?",
        "a": "Generally no. Because the successor changes the OAuth provider/library or moves from OAuth scopes to OS-level permissions, access and refresh tokens do not transfer. Plan for mandatory re-consent from day one; there is no silent migration of consent. Verify the specific move's re-auth requirements."
      },
      {
        "q": "Will I get all my historical data on the new API?",
        "a": "Usually not fully. Back-fill depth is set by each underlying provider, not by you, and on-device successors often gate history behind a dedicated permission and a short default window. Pull what the new source allows, document the gap, and verify each provider's current cap before promising history."
      },
      {
        "q": "Do I have to re-architect if the successor is on-device?",
        "a": "If you previously read data server-to-server and the successor is an on-device store (Health Connect or HealthKit), yes. On-device stores have no cloud endpoint, so you read in the app and sync to your own backend yourself, or use an aggregator that runs an on-device SDK and forwards data. Verify the successor's architecture."
      },
      {
        "q": "Can an aggregator remove the need to migrate at all?",
        "a": "It can shift the burden. An aggregator that already supports both the old and successor APIs can absorb the cutover so you keep one integration. Trade-offs are recurring cost, third-party data-path trust, and coverage limits. Verify the aggregator's current support for your providers before relying on it."
      }
    ],
    "related": [
      {
        "href": "/fix/google-fit-api-deprecated",
        "label": "Google Fit API deprecated: what to use"
      },
      {
        "href": "/migrate/google-fit-to-health-connect",
        "label": "Google Fit → Health Connect"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/migrate",
        "label": "All migration guides"
      }
    ],
    "cta": {
      "pitch": "Get a heads-up on fitness and health API deprecations before the turndown date catches your integration off guard."
    }
  }
];
