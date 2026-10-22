import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED "[product] alternatives" pages (originally auto-assembled;
 * since hand-edited — edit here). Article + FAQPage (no HowTo). Anchor triggers
 * stated factually; alternatives framed nominatively.
 */
export const alternativesEntries: ClusterEntry[] =
[
  {
    "slug": "fitbit-api-alternatives",
    "primaryQuery": "Fitbit API alternatives",
    "h1": "The Best Fitbit API Alternatives (2026)",
    "metaTitle": "The Best Fitbit API Alternatives (2026): 4 Compared",
    "metaDescription": "Fitbit's Web API is moving to Google's Health API. Compare the top alternatives — Google Health API, Terra, Junction, Garmin, Oura — and pick by use case.",
    "updated": "2026-07-09",
    "answer": "The main alternatives to the Fitbit Web API are the Google Health API (the first-party successor the legacy API is being consolidated into), health-data aggregators like Terra, Junction (formerly Vital), and Rook that cover Fitbit plus many devices through one integration, other single wearables like Garmin, Oura, or WHOOP, and on-device access via Apple HealthKit and Google Health Connect. Pick the Google Health API to stay on Fitbit data, an aggregator to support many devices without re-doing migration work, or a single-device API if you can standardize on one wearable.",
    "body": "For what this site has verified about Fitbit access in one place, see the [Fitbit API overview](/apis/fitbit).\n\n## Why teams look for a Fitbit API alternative\n\nThe Fitbit Web API has been a dependable, broadly adopted way to read steps, heart rate, sleep, and activity from a large consumer install base. The reason it is being reassessed right now is a platform change, not a quality problem: Google is consolidating the legacy Fitbit Web API into the new **Google Health API**. The practical consequences that matter to a builder are:\n\n- **Tokens do not transfer.** Existing access and refresh tokens cannot be migrated to the new integration, so every user has to re-authenticate through Google OAuth — a re-consent step that some products lose users at.\n- **New console, schema, and shape.** The roughly 100-plus legacy endpoints are being collapsed into streamlined data-type bundles with a new developer console, schema, and response format, so integration code needs rework rather than a version bump.\n- **Confirmed end dates.** [Google's Google Health API page](https://developers.google.com/health/about) (read October 12, 2026) lists end of support for the legacy Web API on September 30, 2026 and a full turn-off on October 30, 2026, after which it no longer syncs data. Reported dates put the new Google Health API cloud integration at around May 2026, with a separate requirement that Fitbit users move to a Google Account to keep syncing. [Google's Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit) (updated September 10, 2026) lists the Google Health API as the recommended path for Fitbit Web API integrations. The [Fitbit API deprecation status](/fitbit-api-shutdown) page grades each date as confirmed or reported.\n\nNone of that makes Fitbit a bad choice; the data and reach are still there. It just means anyone consuming the legacy Web API is facing a re-integration on someone else's schedule, which is a reasonable moment to ask whether the successor path, an aggregator, or a different source fits better.\n\n## The alternatives\n\n### Google Health API (the successor path)\n\n**What it is.** Google's first-party API that the legacy Fitbit Web API is being folded into — the intended forward path for reading Fitbit user data via Google.\n\n**Best for.** Teams already standardized on Fitbit who want to stay on the official successor and keep first-party access to the same underlying data.\n\n**Watch out.** It is not a drop-in replacement. You get a new OAuth flow (user re-consent required), a new schema, and a legacy API that Google turns off on October 30, 2026, so expect real migration work rather than a config swap. [The Google Health API reference](/google-health-api) lists every data type on Google's data-types page with the operations and scopes Google documents for it, and [its Fitbit Web API mapping](/google-health-api/fitbit-web-api-mapping) carries Google's own tables from Fitbit data types, scopes and endpoints to their replacements.\n\n### Health-data aggregators — Terra, Junction (formerly Vital), Rook\n\n**What it is.** A single integration that connects to Fitbit plus hundreds of other wearables and health sources and returns everything in one normalized schema, delivered by webhook.\n\n**Best for.** Products that support many devices, or that want to insulate themselves from first-party migrations like this one — Fitbit becomes one source behind a stable interface, so Google's timeline stops being your problem.\n\n**Watch out.** A recurring per-connected-user cost and a third party in your data path (check HIPAA/SOC 2 and a BAA), and for some providers you may still register your own developer app. The normalized schema may not surface every Fitbit-specific field.\n\n### Other wearables — Garmin, Oura, WHOOP\n\n**What it is.** Direct, single-vendor APIs for a different device ecosystem.\n\n**Best for.** Teams that would rather standardize on one wearable they control end to end than absorb the Fitbit-to-Google transition — Garmin for multi-sport and rich activity data, Oura and WHOOP for recovery, sleep, and readiness.\n\n**Watch out.** Each carries its own gate: Garmin is partner-approval-only and, by its own FAQ, for business use only, while Oura limits a new app to 10 users until Oura approves it and WHOOP starts every app on a Sandbox tier of 10 members and requires developers to hold a WHOOP membership. You are also trading Fitbit's broad, low-cost install base for a narrower one.\n\n### Apple HealthKit / Google Health Connect (on-device)\n\n**What it is.** The platform data layers on iOS and Android that expose health data locally on the device, including Fitbit data the user has synced into them.\n\n**Best for.** Mobile-first apps that can read data on-device and do not need server-side access when the phone is offline.\n\n**Watch out.** On-device only and platform-split — you implement both HealthKit (iOS) and Health Connect (Android), and there is no first-party server-side or cross-platform access without additional plumbing.\n\n| Alternative | Best for | Watch out |\n|---|---|---|\n| Google Health API | Staying on Fitbit data via the official successor | Not a drop-in — new OAuth, new schema; legacy API turns off October 30, 2026 |\n| Terra / Junction / Rook | Many devices; surviving the migration behind one schema | Recurring per-user cost; third party in the data path; some providers still need your own app |\n| Garmin / Oura / WHOOP | Standardizing on one alternative device | Approval gates, user caps, or paid membership; narrower install base |\n| HealthKit / Health Connect | On-device, mobile-first apps | On-device only; implement both platforms; no server-side access |\n\n## Which should you pick?\n\nThere is no single winner — it depends on what you are optimizing for:\n\n- **You mainly want to keep Fitbit's data with the least conceptual change** → the **Google Health API**. It is the first-party successor; you will still pay for a re-integration, but you keep direct access to the same data.\n- **You support (or plan to support) more than one wearable** → a **health-data aggregator** (Terra, Junction, or Rook). One integration covers Fitbit plus the rest, and you stop re-doing OAuth and schema work every time a provider changes its platform.\n- **You are happy to standardize on one device** → the **direct API for that device**. Garmin for detailed activity, Oura or WHOOP for recovery and sleep — accepting each one's access gate.\n- **You are a mobile-first app that can read data locally** → **HealthKit and Health Connect** on-device, adding a cloud source only if you need server-side data.\n\nIf you are specifically weighing Fitbit against Garmin as your single device, the [Fitbit API vs Garmin API comparison](/fitness-apis/fitbit-api-vs-garmin-api) breaks down data coverage and access friction side by side.\n\n## Is switching easy?\n\nHonestly, no — for any of these, moving off the legacy Fitbit Web API is a real re-integration, not a find-and-replace. Expect a new OAuth client and consent flow, a field re-mapping exercise as you translate the old schema into the new one, and — the part that hurts most — every existing user has to reconnect, since tokens do not carry over. Budget for the reconnection churn, not just the code.\n\nThe one place that gets meaningfully easier is coverage breadth: an aggregator lets you re-map fields once and reach Fitbit plus many other sources through a single normalized schema, so you are not repeating the exercise per provider or per future migration. It does not erase the user-reconnect step, but it caps the engineering to one integration.\n\nIf you decide the Google successor path is right and want to keep working directly with Fitbit data, the [Fitbit API integration guide](/integrate/fitbit-api) walks through the current OAuth flow and endpoints. For the wider set of cloud device options behind one interface, see the [wearable data APIs](/fitness-apis/wearable-data-apis) overview.\n\n*Migration dates, access gates, and user caps above are current as of 2026 and are actively changing — verify the Fitbit-to-Google Health timeline and each provider's current terms against their live documentation before you commit.*",
    "faqs": [
      {
        "q": "Why is everyone looking for a Fitbit API alternative in 2026?",
        "a": "Google is consolidating the legacy Fitbit Web API into the new Google Health API. Existing access and refresh tokens do not transfer, so users must re-authenticate, and the endpoints, console, and schema change, which means real integration work. Google's Google Health API page (read October 12, 2026) lists end of support for the legacy API on September 30, 2026 and a full turn-off on October 30, 2026, after which it no longer syncs data."
      },
      {
        "q": "Is the Google Health API a drop-in replacement for the Fitbit Web API?",
        "a": "No. It is the first-party successor path, but it uses a new OAuth flow that requires every user to re-consent, a new schema and response format, and a new developer console. You keep access to the same underlying Fitbit data, but you should budget for a re-integration rather than a version bump."
      },
      {
        "q": "Should I use an aggregator like Terra or Junction instead of migrating to Google?",
        "a": "An aggregator makes sense if you support many wearables or want to avoid re-doing OAuth and schema work on Google's timeline — Fitbit becomes one normalized source behind a single integration. The trade-offs are a recurring per-connected-user cost, a third party in your data path (check HIPAA/SOC 2 and a BAA), and that some providers still require your own developer app."
      },
      {
        "q": "Can I read Fitbit data on-device with HealthKit or Health Connect?",
        "a": "Yes, if the user has synced Fitbit data into Apple Health or Google Health Connect, a mobile app can read it locally. This works well for mobile-first products, but it is on-device only and platform-split — you implement both HealthKit on iOS and Health Connect on Android, with no first-party server-side access."
      },
      {
        "q": "Will I have to make users reconnect if I switch?",
        "a": "In almost all cases, yes. Tokens do not transfer from the legacy Fitbit Web API, so users re-authenticate regardless of which alternative you choose. An aggregator can reduce the engineering to one integration and one field re-mapping, but it does not remove the user-reconnect step. Plan for reconnection churn, not just code changes."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/fitbit-api-vs-garmin-api",
        "label": "Fitbit API vs Garmin API"
      },
      {
        "href": "/integrate/fitbit-api",
        "label": "How to integrate the Fitbit API"
      },
      {
        "href": "/alternatives/garmin-api-alternatives",
        "label": "Garmin API alternatives"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "We track wearable API migrations like Fitbit-to-Google Health every week — the shifting dates, the token gotchas, and what actually breaks — subscribe and switch on your terms, not by surprise."
    }
  },
  {
    "slug": "google-fit-api-alternatives",
    "primaryQuery": "Google Fit API alternatives",
    "h1": "Google Fit API Alternatives (It's Deprecated) (2026)",
    "metaTitle": "Google Fit API Alternatives (Deprecated) 2026",
    "metaDescription": "Google Fit's APIs are deprecated (end 2026), no drop-in replacement. Alternatives by use-case: Health Connect, Google Health API, HealthKit, aggregators.",
    "updated": "2026-07-09",
    "answer": "Google Fit's REST and Android APIs are deprecated (no new signups since 1 May 2024; Google's Fit migration guide, updated September 10, 2026, says they will only be supported until the end of 2026), and there is no drop-in 1:1 replacement, so migrating is a re-architecture. Pick by how you used Fit: for Android on-device data move to Google Health Connect; for cloud/account data you fetched server-side, use the Google Health API, which Google recommends for cloud-based integrations; for the Fit API on Wear OS, use Health Services; for the iOS side of a cross-platform app use Apple HealthKit; and if you support many devices, use an aggregator (Terra, Junction, or Rook) to migrate once behind one schema.",
    "body": "If you built on the Google Fit REST or Android APIs, you are here because the platform is going away, not because you want to switch. Google stopped accepting new developer signups for the Google Fit APIs on **1 May 2024**, and [Google's Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit) (updated September 10, 2026) says the Google Fit API, including the REST API, \"will only be supported until the end of 2026\" — an end-of-support date; the guide names no switch-off day. The hard part: there is **no drop-in, 1:1 replacement**. Google Fit stored data in the cloud and served it over REST; the successor Google recommends for step tracking and mobile-first apps — **Health Connect** — is an *on-device* store, not a cloud API, and cloud-based integrations go to the separate **Google Health API** instead. So this is a re-architecture, not a library swap, and your right answer depends on how you were using Fit.\n\nThe short version: for Android on-device data, move to **Google Health Connect**; for cloud/account data you used to fetch server-side, move to the **Google Health API**; for the Fit API on Wear OS, move to **Health Services**; for the iOS side of a cross-platform app, use **Apple HealthKit**; and if you support many devices or want one integration to ride out this migration, use an **aggregator** (Terra, Junction, or Rook).\n\n## Why teams look for a Google Fit alternative\n\nThere is really one trigger here, and it is forced: **Google Fit is deprecated.** To be fair, Fit did a genuinely useful job for years — a single cloud REST endpoint that returned steps, activity, and aggregated fitness data across Android devices, without you touching each OEM's SDK. Nothing about it was broken. It is simply being wound down.\n\nWhat makes the migration non-trivial:\n\n- **No new signups since 1 May 2024** — if you do not already have a Fit project, you cannot start one.\n- **Support only through end of 2026.** Google's guide states an end of support, not a switch-off date, so do not plan around a shutdown day that has not been published.\n- **No 1:1 REST replacement.** Fit was a cloud service; Health Connect is an on-device data layer. The shapes are different, so the data path, permission model, and where-the-data-lives all change.\n- **Data does not transfer automatically.** Existing Google Fit history does not silently migrate into Health Connect; plan for a re-consent and re-sync of your users.\n\nThat last point is the one that surprises teams: you are not just changing an SDK, you are changing the *architecture* of how health data reaches your app. (For the specifics of the deprecation timeline and the migration decision, see [Google Fit API deprecated: what to use](/fix/google-fit-api-deprecated).)\n\n## The alternatives\n\nEach option below covers a different slice of what Fit used to do. Most teams end up using more than one.\n\n### Google Health Connect — the Android on-device successor\n\nHealth Connect is the path Google's migration guide recommends for step tracking and mobile-first Android apps. It is an on-device store that other apps read and write under an OS-granted permission, similar to Apple HealthKit on iOS. If your Fit usage was \"read the user's steps, workouts, and activity on their Android phone,\" this is the closest thing to a home. Trade-off: it is **on-device and Android-only** — there is no server endpoint, so if your backend needs the data you upload it yourself, and it does nothing for iOS or web. Start with the [Health Connect integration guide](/integrate/google-health-connect).\n\n### Google Health API / Fitbit path — the cloud successor\n\nIf you leaned on Fit's *cloud* model — fetching a user's account data server-side, without their phone being present — Google's migration guide recommends its newer **Google Health API** for cloud-based integrations and lists it, as available, for the Fit History and Session APIs (it is also the listed path for Fitbit Web API integrations). Best for teams that need always-on, server-to-server access to account-level data. Trade-off: it is a **different API with its own console, schema, and OAuth**, so you are signing up for a re-integration, not a drop-in.\n\n### Apple HealthKit — the iOS counterpart\n\nIf you are cross-platform, Fit only ever covered Android; the iOS equivalent is Apple HealthKit, and Google's own guidance points iOS use cases there. Best for the iPhone side of an app that will use Health Connect on Android. Trade-off: **iOS-only and on-device**, so you now maintain *two* platform stores instead of one cloud API. See [HealthKit vs Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect) for how the pair lines up.\n\n### Terra / Junction / Rook — one aggregator across everything\n\nAn aggregator is a single integration that fronts Health Connect, HealthKit, and cloud wearable APIs (Fitbit, Garmin, Oura, Whoop, Strava, and more) behind one normalized schema. Best for teams that support many devices or platforms and would rather not stitch Health Connect + HealthKit + cloud APIs together by hand — especially attractive because it insulates you from *this* migration and the next one. Trade-off: a **recurring vendor fee and a third party in your data path** (raising HIPAA/BAA questions to verify per vendor). Junction is the product formerly known as Vital.\n\n### Comparison\n\n| Alternative | Best for | Watch out |\n|---|---|---|\n| Google Health Connect | Android on-device steps/activity/workouts | Android-only, on-device — no server endpoint; iOS not covered |\n| Google Health API | Cloud, server-side account data (Fit History and Session APIs) | New API, console, and OAuth; a re-integration, not a drop-in |\n| Apple HealthKit | The iOS side of a cross-platform app | iOS-only, on-device; now you maintain two platform stores |\n| Terra / Junction / Rook | Many devices/platforms behind one schema | Recurring fee; third party in the data path (HIPAA/BAA to verify) |\n\n## Which should you pick?\n\nThere is no single winner — pick by what your Fit integration actually did:\n\n- **You read on-device Android fitness data** (steps, activity, workouts on the phone) → **Health Connect**. It is the direct successor and the lowest-friction path for Android-native apps.\n- **You fetched cloud/account data server-side** → the **Google Health API**, Google's recommended path for cloud-based integrations, accepting that it is a new API with its own OAuth.\n- **You used the Fit API on Wear OS** → **Health Services**, the path Google's guide lists for Wear.\n- **You used the Fit Goals API** → there is no successor API: the guide says \"No replacement API available\" on both phone and Wear, so goal tracking moves into your own app logic.\n- **You are cross-platform (iOS + Android)** → **Health Connect on Android and HealthKit on iOS**, together — that is the standard on-device pairing.\n- **You support many devices, or want to migrate once and not again** → an **aggregator** (Terra, Junction, or Rook), so Fit's wind-down and future first-party changes sit behind a stable interface. Compare options in [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis).\n\n## Is switching easy?\n\nHonestly, no — this is a real re-integration, more so than a typical vendor swap, because the *architecture* changes. Cloud REST (Fit) to on-device store (Health Connect) means a new permission model, a new schema to re-map your fields onto, and a **user re-consent and re-sync** — Fit history does not carry over automatically. If you go the cloud route instead, you are onto a new API with its own OAuth and console. In every direction, plan for field re-mapping and asking users to reconnect.\n\nThe one path that collapses this work is an **aggregator**: it covers Health Connect, HealthKit, and cloud wearables through a single integration and normalized schema, so you re-map fields once and let the vendor absorb provider-side churn. That is the trade of a recurring fee against not re-engineering every time a platform like Fit is retired. If you are weighing it, the [wearable data APIs](/fitness-apis/wearable-data-apis) overview lays out the direct-versus-aggregator decision.\n\n*This is general product and engineering information, not medical or legal advice; verify current deprecation dates and API availability against Google's official docs before you plan a migration.*",
    "faqs": [
      {
        "q": "Is the Google Fit API being shut down?",
        "a": "Its support is ending. Google stopped accepting new developer signups for the Google Fit REST and Android APIs on 1 May 2024, and its Fit migration guide (updated September 10, 2026) says the Google Fit API, including the REST API, will only be supported until the end of 2026. That is an end-of-support date: the guide does not name a day when calls stop working, so plan to finish migrating before support ends. No new projects can be created."
      },
      {
        "q": "What is the direct replacement for the Google Fit API?",
        "a": "There is no drop-in 1:1 replacement. Google's Fit migration guide maps each use to a different successor: Health Connect for step tracking and mobile-first apps (an on-device data store rather than a cloud REST API), the Google Health API for cloud-based integrations such as the Fit History and Session APIs, and Health Services for the Fit API on Wear OS. The Fit Goals API has no replacement API at all. Which one fits depends on whether you read on-device data or fetched account data from the cloud."
      },
      {
        "q": "Is Health Connect the same as Google Fit?",
        "a": "No. Google Fit was a cloud service that served data over REST; Health Connect is an on-device store on the Android phone that apps read and write under an OS permission, similar to Apple HealthKit on iOS. Because it is on-device and Android-only, there is no server endpoint to query, and existing Google Fit history does not transfer into Health Connect automatically."
      },
      {
        "q": "How do I handle cross-platform (iOS and Android) after Google Fit?",
        "a": "Google Fit only ever covered Android. The standard cross-platform pattern is to use Health Connect on Android and Apple HealthKit on iOS, implementing both on-device stores. If maintaining two platform stores plus any cloud wearables is too much, an aggregator such as Terra, Junction, or Rook fronts all of them behind one normalized API for a recurring fee."
      },
      {
        "q": "Will my Google Fit data migrate automatically?",
        "a": "No. Existing Google Fit data does not silently move into Health Connect or any other successor. Plan for a user re-consent and a re-sync, plus re-mapping your fields onto the new schema. This is one reason the switch is a real re-integration rather than a simple library swap."
      }
    ],
    "related": [
      {
        "href": "/fix/google-fit-api-deprecated",
        "label": "Google Fit API deprecated: what to use"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "How to integrate Google Health Connect"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "Migrating off Google Fit and weighing Health Connect, the Google Health API, and aggregators? Get our plain-English fitness and health API breakdowns in your inbox."
    }
  },
  {
    "slug": "garmin-api-alternatives",
    "primaryQuery": "Garmin API alternatives",
    "h1": "Garmin API Alternatives for Private Use and Production (2026)",
    "metaTitle": "Garmin API Alternatives for Private Use and Production",
    "metaDescription": "No Garmin approval? For your own data, the unofficial garminconnect Python client; for an app serving users: Terra, Strava, Fitbit, on-device and more.",
    "updated": "2026-07-09",
    "answer": "If you can't get into Garmin's business-only, approval-gated developer program, the practical alternatives are an aggregator that may broker Garmin if you bring your own credentials (Terra), a different accessible wearable (Fitbit, Oura, WHOOP), Strava for activities and GPS, and on-device HealthKit or Health Connect, which can surface Garmin data a user has already synced to their phone. Pick an aggregator to remove the single-vendor gate, Strava if you mainly need runs and rides, Fitbit for broad consumer reach, or on-device APIs if your app lives on the phone and the user already syncs Garmin there.",
    "body": "Garmin builds a deep first-party health and activity dataset, and its devices are well regarded for GPS and multi-sport tracking. The reason you are reading an alternatives page is almost never the data quality. It is access. (For what this site has verified about Garmin access in one place, see the [Garmin API overview](/apis/garmin).)\n\n## Just want your own Garmin data? Personal and private projects\n\nGarmin's developer program is only for business use, which is why a personal dashboard or a script over your own runs cannot get in. Three routes need no approval:\n\n- **An unofficial client for your own account.** [garminconnect](/libraries/garminconnect), a Python package, signs in to Garmin Connect's web services with your own username and password. Its README calls it \"an unofficial client for Garmin's web services; it does not pair with the Garmin Connect phone app or connect directly to a watch\", and says it logs in through the same mobile sign-in flow as the official Garmin Connect Android app and stores tokens in a local file (treat it like a password). Unofficial means nothing guarantees it keeps working: garth, the library it used to rely on, was deprecated after Garmin changed its auth flow. Our [Garmin approval page](/fix/garmin-api-approval) also records that Garmin blocks third-party clients and that using them breaks its terms of service, so read Garmin's terms before relying on one even for your own account, and never build a product for other people on it. [garminconnect vs garth](/libraries/compare/garminconnect-vs-garth) sets out garth's deprecation and the one fresh login the move to garminconnect needs.\n- **Your phone's health store.** If your watch syncs to your phone, the data often lands in Apple Health or Health Connect, where an app you write can read it on-device (details in the list below).\n- **Code on the watch itself.** Connect IQ apps run on the device rather than reading Garmin's cloud; [Connect IQ vs the Health and Activity APIs](/fitness-apis/garmin-connect-iq-vs-health-api) explains where that route fits.\n\nIf you are building a product for other people, skip to the alternatives below: those are the routes that hold up in production.\n\n## Why teams look for a Garmin API alternative\n\nGarmin's Health and Activity APIs are reachable only through the Garmin Connect Developer Program, which Garmin's FAQ says is only for business use. You request access, and Garmin says it confirms an application's status within two business days; there are no licensing or maintenance fees, but some metrics need a license fee or a minimum device order for commercial use. Earlier versions of this page repeated community reports that new sign-ups were on hold; Garmin's own pages, read on October 17, 2026, do not say that, though every program page carries a \"Stay tuned for more updates on the program\" banner. If you cannot get approved, the API's depth does not help you.\n\nThis is an access gate, not a knock on the product. A partner-review model often reflects stricter handling of user health data, and approved teams get a genuinely rich push-based feed. But if the gate is what is blocking you, these are the routes around it. (If you have not yet exhausted the direct path, our note on the [Garmin API approval gate](/fix/garmin-api-approval) covers what to try before switching.)\n\n## The alternatives\n\n**Terra (aggregator).** A health-data aggregator that normalizes many providers behind one schema and may reach Garmin data through its own integration access — though some flows are bring-your-own-credentials, so confirm current Garmin brokering terms (verify). Best for: removing the single-vendor gate and getting Garmin-where-available plus fallbacks behind one integration. Trade-off: you add a middle-layer dependency and cost, and Garmin coverage still depends on Garmin's partner terms.\n\n**Strava.** Activity- and social-focused, and many Garmin users auto-sync their activities into Strava. Best for: runs, rides, and other workouts with GPS when that is the data you actually need. Trade-off: health metrics like sleep, HRV, and recovery are not there, and Strava has its own limits (one webhook subscription per app, published rate limits).\n\n**Fitbit / Google Health API.** A broad consumer install base without Garmin's approval gate. Best for: mainstream reach and intraday heart-rate and sleep data. Trade-off: Google's Google Health API page (read October 12, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026 and a full turn-off on October 30, 2026, and says every integration must move to the Google Health API as soon as possible. See [Fitbit API deprecation status](/fitbit-api-shutdown), and plan for user re-consent and new OAuth.\n\n**Oura / WHOOP.** Recovery-, sleep-, and readiness-centric devices if a different wearable is acceptable to your users. Best for: HRV and recovery use cases. Trade-off: each is single-vendor with its own approval step (Oura limits a new app to 10 users until it approves the app; WHOOP starts new apps at 10 members and raises the cap one reviewed tier at a time), and WHOOP requires a paid membership.\n\n**HealthKit / Health Connect (on-device).** If a user has synced their Garmin to their phone, the Garmin data often lands in Apple Health (iOS) or Health Connect (Android), where your app can read it locally — no Garmin developer approval required. Best for: mobile apps where the phone is online and the user already syncs Garmin. Trade-off: it is on-device and per-platform (you implement both), depends on the user's own sync being set up, and gives you no server-side access on its own.\n\n| Alternative | Best for | Watch out |\n|---|---|---|\n| Terra (aggregator) | Removing the single-vendor gate; Garmin-where-available plus fallbacks | Garmin flows may be bring-your-own-credentials; confirm brokering terms (verify) |\n| Strava | Activities, runs, rides, GPS | No sleep/HRV/recovery; one webhook per app; rate limits |\n| Fitbit / Google Health API | Broad consumer reach, intraday HR and sleep | Legacy Web API unsupported since Sept 30, 2026, off Oct 30, 2026; re-consent |\n| Oura / WHOOP | Recovery, sleep, HRV; different device acceptable | Single-vendor; 10 users (Oura) or 10 members (WHOOP's first tier) until reviewed; WHOOP needs paid membership |\n| HealthKit / Health Connect | On-device apps; user already syncs Garmin to phone | On-device only, per-platform, depends on the user's own sync |\n\n## Which should you pick?\n\nMatch the route to your use-case rather than looking for one winner:\n\n- **You want Garmin data specifically and the gate is the only blocker** → try an aggregator like Terra, which may broker Garmin so you skip your own partner approval; verify its current Garmin terms and whether it is bring-your-own-credentials.\n- **You mainly need activities, runs, rides, and GPS** → Strava is the lightest path, since Garmin activities already flow there — just accept it is thin on sleep and recovery.\n- **You need broad consumer reach or intraday HR and sleep, and Garmin is not essential** → Fitbit via the Google Health API, planning for the migration.\n- **Your use-case is recovery and readiness** → Oura or WHOOP, if asking users to wear a different device is acceptable.\n- **Your app runs on the phone and users already sync Garmin there** → read it on-device through HealthKit or Health Connect and skip the developer gate entirely.\n\nFor the head-to-head data-depth comparison behind these picks, see [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api), and for the full category see our [fitness API comparison](/fitness-apis).\n\n## Is switching easy?\n\nUsually it is a real re-integration, not a config change. Moving off Garmin means new OAuth flows, re-mapping fields to a different provider's schema, and — for anything user-facing — asking your users to reconnect their accounts. Strava, Fitbit, Oura, and WHOOP each have their own consent model and data shape, and on-device HealthKit and Health Connect are a different architecture again.\n\nThe one place you re-integrate once instead of per-vendor is an aggregator: a single normalized schema covers many sources, so Garmin-where-available plus fallbacks sit behind one interface. If you go that way, our [Terra integration guide](/integrate/terra-api) walks through the connection, and you should still confirm each aggregator's current Garmin brokering terms before you commit (verify).",
    "faqs": [
      {
        "q": "Why can't I get access to the Garmin API?",
        "a": "Garmin's Health and Activity APIs are reachable only through the Garmin Connect Developer Program, which Garmin says is only for business use. You request access and Garmin says it confirms the status of an application within two business days, so a personal project or an unregistered business will not get in. Garmin's pages carry a banner promising more updates on the program; check the program overview before planning around a date."
      },
      {
        "q": "Can I get Garmin data through an aggregator like Terra?",
        "a": "Possibly. Aggregators such as Terra normalize many providers behind one schema and may reach Garmin through their own integration access, which can let you skip your own partner approval. As of 2026 some flows are reportedly bring-your-own-credentials (verify), and Garmin coverage still depends on Garmin's partner terms. Confirm each aggregator's current Garmin brokering terms before you commit."
      },
      {
        "q": "Can I get Garmin data from HealthKit or Health Connect?",
        "a": "Often, yes. If a user has synced their Garmin device to their phone, the data usually lands in Apple Health on iOS or Health Connect on Android, where your app can read it on-device without Garmin developer approval. The catch is that it is on-device and per-platform, gives no server-side access on its own, and depends on the user having that sync set up."
      },
      {
        "q": "Is Strava a good substitute for the Garmin API?",
        "a": "For activities, often yes. Many Garmin users auto-sync their workouts into Strava, so runs, rides, and GPS are reachable there. But Strava is activity- and social-focused, so device health metrics like sleep, HRV, and recovery are not available, and it has its own limits such as one webhook subscription per app and published rate limits."
      },
      {
        "q": "How do I get my own Garmin data for a personal project?",
        "a": "Without developer approval, people commonly use an unofficial client such as garminconnect, a Python package that signs in to Garmin Connect's web services with your own credentials; its README calls it unofficial and says it does not pair with the phone app or connect to a watch. It can break when Garmin changes its sign-in flow, as happened to the older garth library, and this site's Garmin approval page notes that Garmin blocks third-party clients and that they break its terms, so check those terms first. If your watch syncs to your phone, reading Apple Health or Health Connect on-device is the no-approval path that stays within the platforms' rules."
      }
    ],
    "related": [
      {
        "href": "/fix/garmin-api-approval",
        "label": "Fix: Garmin API access & approval"
      },
      {
        "href": "/fitness-apis/fitbit-api-vs-garmin-api",
        "label": "Fitbit API vs Garmin API"
      },
      {
        "href": "/alternatives/fitbit-api-alternatives",
        "label": "Fitbit API alternatives"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "We break down a fitness or wearable API every week — the approval gates, aggregator brokering terms, and migration gotchas included, so subscribe and skip the surprises."
    }
  },
  {
    "slug": "strava-api-alternatives",
    "primaryQuery": "Strava API alternatives",
    "h1": "The Best Strava API Alternatives (2026)",
    "metaTitle": "The Best Strava API Alternatives (2026): 6 Compared",
    "metaDescription": "Strava is great for activities and social, thin on health metrics. Compare Garmin, Fitbit, Terra/Junction, HealthKit and Health Connect by use case.",
    "updated": "2026-07-09",
    "answer": "The main Strava API alternatives are Garmin and Fitbit for device-level health metrics like sleep and heart rate, aggregators such as Terra, Junction (formerly Vital), and Rook to normalize many devices behind one schema, and Apple HealthKit or Google Health Connect for on-device workouts. Pick by the gap you're filling: a device API when you need health metrics Strava lacks, an aggregator when you need workouts and many devices behind one interface, and an on-device store when the workout already lives on the user's phone. Strava itself stays the best fit for activities, segments, and social.",
    "body": "If you're integrated with the Strava API and hitting its edges — no sleep, HRV, or recovery data; published rate limits; effectively one webhook subscription per application — you're probably weighing what else to pull in. The short answer: **Garmin** and **Fitbit** for device-level health metrics, an aggregator like **Terra**, **Junction (formerly Vital)**, or **Rook** to normalize Strava alongside many devices at once, and **Apple HealthKit** or **Google Health Connect** for on-device workouts captured by the phone or watch. Pick by what you're missing: reach for a device API when you need health metrics, an aggregator when you need many sources behind one schema, and an on-device store when the workout already lives on the user's device.\n\nThis is not a knock on Strava. It's the best place in the ecosystem for runs, rides, segments, kudos, and the social graph around activities — if that's your product, stay. This page is about the cases where builders need something Strava was never designed to give. For what this site has verified about Strava access in one place, see the [Strava API overview](/apis/strava).\n\n## Why teams look for a Strava API alternative\n\nStrava is **activity- and social-focused**, not a full health-metrics platform. A few concrete things push teams to look elsewhere:\n\n- **It's thin on health metrics.** Strava models activities — runs, rides, swims — not sleep stages, HRV, resting heart rate, or recovery/readiness scores. If your app needs those, they aren't there to fetch.\n- **Rate limits.** The API has published rate limits, so high-volume or many-athlete workloads can bump into ceilings you have to design around.\n- **One webhook subscription per application.** Strava's push model is effectively one subscription per app, which constrains how you fan out real-time updates.\n- **Athlete-permission model.** Access is per-user OAuth (each athlete authorizes your app), so you only ever see data for athletes who have connected — fine for a social product, limiting if you wanted broader device coverage.\n- **Access tiers and a subscription.** Strava's getting-started guide makes a Strava subscription a prerequisite for creating an app, and every new app starts in single-player mode, where only your own account can connect. Its API Policy, effective June 1, 2026, keeps Standard Tier apps subject to subscription requirements and admits apps to its Extended Access Tier, generally for 10,000 users or more, case by case.\n\nNone of these make Strava a poor choice. They're the reasons a team building around **device health data** or **higher volume** starts looking at other sources — often *in addition to* Strava, not instead of it.\n\n## The alternatives\n\n### Garmin and Fitbit — device-level health data\n\n**What they are:** first-party wearable APIs that expose device metrics — sleep, heart rate, steps, and (for Garmin) rich activity detail — beyond what a social activity feed carries.\n\n**Best for:** teams that need the health metrics Strava doesn't model, especially when many of your users already wear one of these devices.\n\n**Watch out:** Garmin's Connect Developer Program is only for business use and needs Garmin's approval (Garmin's FAQ says it confirms an application's status within two business days), and some metrics carry a license fee for commercial use, so access can be a real gate. Fitbit's legacy Web API is being consolidated into the new Google Health API, and Google lists the legacy API's turn-off for October 30, 2026. Google's Health API migration guide says existing tokens cannot be transferred, so every user re-consents. See the [Fitbit API vs Garmin API comparison](/fitness-apis/fitbit-api-vs-garmin-api) for how they differ.\n\n### Terra, Junction (formerly Vital), and Rook — aggregate many devices at once\n\n**What they are:** aggregators that normalize hundreds of providers — Garmin, Fitbit, Apple Health, Health Connect, Oura, Whoop, Strava itself, Polar, Withings, and more — behind one schema and one webhook.\n\n**Best for:** getting **workouts and health metrics together**, or supporting many athletes and devices behind a consistent interface without wiring each provider yourself. An aggregator also lifts the per-app webhook and rate-limit friction onto the vendor's infrastructure.\n\n**Watch out:** it's a recurring cost and a third party in your data path (worth checking HIPAA/BAA terms per vendor). Some aggregators broker Garmin on bring-your-own-credentials terms (*verify current terms*). Strava's API Policy, effective June 1, 2026, prohibits pass-through proxies and aggregators that re-expose its API, so confirm an aggregator still offers a Strava connection before you count on one. To wire one up, the [Terra integration guide](/integrate/terra-api) is the starting point, and [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) covers the category.\n\n### Apple HealthKit and Google Health Connect — on-device workouts\n\n**What they are:** the OS-level health stores on iOS and Android. The phone or watch captures the workout, and your app reads it locally under an OS permission — no cloud API, no per-app rate limit.\n\n**Best for:** on-device workout data captured by the user's own device, without Strava's app-level webhook and rate ceilings.\n\n**Watch out:** each is platform-locked (HealthKit is iOS-only, Health Connect is Android-only), so a cross-platform app implements both, and access is device-bound with no server-side endpoint. See [wearable data APIs](/fitness-apis/wearable-data-apis) for how the on-device stores sit alongside cloud device APIs.\n\n### Comparison table\n\n| Alternative | Best for | Watch out |\n|---|---|---|\n| Garmin | Rich device + activity metrics | Business-only approval; some metrics need a commercial license fee |\n| Fitbit | Broad consumer install base, device health data | Legacy Web API consolidating into Google Health API; turn-off Oct 30, 2026 |\n| Terra / Junction / Rook | Many devices + workouts behind one schema | Recurring cost; third party in the data path; Garmin brokering terms vary (*verify*) |\n| Apple HealthKit | On-device iOS workouts | iOS-only; device-bound; no server endpoint |\n| Google Health Connect | On-device Android workouts | Android-only; device-bound; no server endpoint |\n| Oura / Whoop | Recovery/readiness signals Strava lacks | Single-vendor; user must own the device (and, for Whoop, a paid membership) |\n\n## Which should you pick?\n\nThere isn't one winner — it depends on the gap you're filling:\n\n- **You need sleep, HRV, or recovery data →** a device API (Garmin, Fitbit) or a recovery-focused wearable (Oura, Whoop). Strava simply doesn't carry these.\n- **You need workouts *and* health metrics across many devices →** an aggregator (Terra, Junction, Rook). One integration covers Strava plus the device sources.\n- **The workout already lives on the user's phone →** HealthKit (iOS) or Health Connect (Android) reads it on-device, with no cloud rate limit.\n- **You're building a social/segment/activity product and just hit rate limits →** you may not need to leave Strava at all. Tune your polling and webhook use first; it's still the strongest fit for that job.\n\n## Is switching easy?\n\nBe honest with yourself: adding or moving to a new source is usually a **real re-integration**, not a config change. Expect a new OAuth flow (or an OS permission model for the on-device stores), a fresh field mapping because every provider's schema differs from Strava's, and — for existing users — a reconnect prompt to authorize the new source.\n\nThe one place that gets easier is an **aggregator**: instead of integrating Garmin, Fitbit, Oura, and Health Connect one at a time, you integrate the aggregator once and it fronts all of them (Strava included) behind a single schema and webhook. That's the trade — a recurring fee and a middle layer in exchange for not maintaining N connections yourself.\n\nIf you're staying on Strava for the social and activity side and adding a source alongside it, the [Strava integration guide](/integrate/strava-api) covers the direct path, and [wearable data APIs](/fitness-apis/wearable-data-apis) lays out how the device options compare.\n\n*This is general product and engineering information. Third-party access terms, rate limits, and migration timelines change — verify against each provider's current docs before you build.*",
    "faqs": [
      {
        "q": "Why would I need an alternative to the Strava API?",
        "a": "Strava is activity- and social-focused, so it models runs, rides, and segments but not full health metrics like sleep stages, HRV, resting heart rate, or recovery scores. It also has published rate limits, effectively one webhook subscription per application, an athlete-permission (per-user OAuth) model, and a subscription prerequisite for creating an app, which then starts in single-player mode. Teams that need device health data or higher volume usually add another source alongside Strava rather than replacing it."
      },
      {
        "q": "What is the best Strava API alternative for health metrics like sleep and HRV?",
        "a": "Device-level wearable APIs. Garmin and Fitbit expose sleep, heart rate, and steps that Strava does not carry, and Oura or Whoop add recovery and readiness signals. Note that Garmin's program is only for business use and needs Garmin's approval, and Fitbit's legacy Web API is consolidating into the Google Health API, so verify current access terms before committing."
      },
      {
        "q": "Should I use an aggregator instead of Strava?",
        "a": "Use an aggregator like Terra, Junction (formerly Vital), or Rook when you want Strava's activities plus device health metrics across many providers behind a single schema and webhook. It also lifts the per-app rate-limit and webhook friction onto the vendor. The trade-off is a recurring cost and a third party in your data path, so check HIPAA and BAA terms per vendor."
      },
      {
        "q": "Can I get workout data without the Strava API at all?",
        "a": "Yes. If the workout is captured on the user's phone or watch, Apple HealthKit on iOS and Google Health Connect on Android let your app read it on-device under an OS permission, with no cloud rate limit. The trade-off is that each is platform-locked and device-bound, so a cross-platform app implements both and has no server-side endpoint to query."
      },
      {
        "q": "What is Strava's API actually best at?",
        "a": "Activities and the social layer around them: runs, rides, swims, segments, leaderboards, kudos, and the athlete graph. If your product is built on that, Strava remains the strongest fit and you may just need to tune polling and webhook use rather than switch. It is the missing health metrics and volume ceilings that push teams to add other sources."
      }
    ],
    "related": [
      {
        "href": "/integrate/strava-api",
        "label": "How to integrate the Strava API"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/alternatives/fitbit-api-alternatives",
        "label": "Fitbit API alternatives"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "Figuring out which fitness and health data sources to combine with Strava? Get our plain-English API breakdowns in your inbox."
    }
  },
  {
    "slug": "oura-api-alternatives",
    "primaryQuery": "Oura API alternatives",
    "h1": "The Best Oura API Alternatives (2026)",
    "metaTitle": "Oura API Alternatives (2026): Top Picks Compared",
    "metaDescription": "The top Oura API alternatives for developers: WHOOP, the Terra and Junction aggregators, and Fitbit or Garmin. Compared by use-case, with the trade-offs.",
    "updated": "2026-07-09",
    "answer": "The top Oura API alternatives are WHOOP (the closest recovery-and-readiness peer), the aggregators Terra and Junction (formerly Vital), which cover Oura plus many other wearables through one integration, and Fitbit or Garmin for a broader, cheaper install base. Pick by use-case: WHOOP to stay in the sleep-and-readiness niche, an aggregator to cover many devices at once, or Fitbit/Garmin to reach more users. Oura itself is still excellent at sleep and readiness quality, so teams switch mainly when they need a broader user base or multi-device coverage that a single ring vendor cannot provide.",
    "body": "For the full landscape of device and platform options, see the [wearable data APIs comparison](/fitness-apis/wearable-data-apis). If you decide to stay with Oura, the [Oura API integration guide](/integrate/oura-api) covers the OAuth setup and endpoints, and the [Oura API overview](/apis/oura) collects what this site has verified about Oura access in one place. If you work in Python, [oura-ring vs oura](/libraries/compare/oura-ring-vs-oura-python) compares the two third-party clients for the Oura API.\n\n## Why teams look for an Oura API alternative\n\nNothing here is a defect — these are structural facts about how the Oura developer platform works, and they push some teams to look wider:\n\n- **It is single-vendor.** Every user has to own an Oura ring before your app can read anything, and Oura's API returns 403 when a user's Oura subscription has expired. If your audience is broad or you cannot assume everyone owns the same device, that is a hard coverage ceiling.\n- **The 10-user cap until approval.** Oura's API documentation limits an application to **10 users** before requiring approval from Oura, with no limit once approved. That is fine for a prototype but means a real launch depends on clearing Oura's review first.\n- **OAuth2 only.** Personal Access Tokens have been deprecated in favor of `OAuth2`, so quick single-user token flows are no longer the path; plan for a full per-user consent flow.\n\nNone of this makes Oura a poor choice. Where Oura genuinely shines is sleep-stage and readiness quality — if that specific signal is your product, Oura is often the right pick and the alternatives below are worse, not better, at it. Teams look elsewhere mainly when they need a **broader user base** or **multi-device coverage** that a single ring vendor cannot give them.\n\n## The alternatives\n\n**WHOOP** — the nearest peer in the same recovery, readiness, and sleep niche, delivered via a strap instead of a ring. Best for keeping the same product concept while reaching a different device base. The trade-off: it carries its own single-vendor constraints — a required **paid WHOOP membership** and member tiers that start a new app at 10 members and rise only through WHOOP's reviews — so you are swapping one gated single vendor for another, not escaping the pattern.\n\n**Terra** — an aggregator that normalizes Oura plus 400–500 other sources (Garmin, Fitbit, Apple Health, Health Connect, WHOOP, Polar, Withings, and more) behind one schema. Best for covering many rings and wearables at once without wiring up each vendor and its approval gates yourself. The trade-off: you take on a middle-layer dependency and its cost, and you may not see every Oura-specific field the raw API exposes.\n\n**Junction (formerly Vital)** — the same aggregator model, normalizing many wearables through one API, with lab-ordering bundled in after its 2025 rebrand and raise. Best for teams that want wearable data *and* diagnostic/lab data behind a single integration. The trade-off: like any aggregator, it is a layer between you and the device, so confirm it surfaces the exact Oura metrics you need.\n\n**Fitbit / Google Health API** — a broader, more mainstream consumer install base at a lower device price point than a ring. Best for reaching a large number of everyday users rather than the readiness-focused ring crowd. The trade-off: Fitbit's legacy Web API is mid-migration to the Google Health API (tokens do not transfer, users re-consent), so you are stepping into a moving integration, and Google lists the legacy API's turn-off for October 30, 2026.\n\n**Garmin** — multi-sport watches that also surface ring-like sleep and recovery metrics. Best for athletic users who want GPS and workout depth alongside recovery data. The trade-off: Garmin's Connect Developer Program is only for business use and needs Garmin's approval, and some metrics carry a license fee for commercial use, so confirm you can onboard before designing around it.\n\n| Alternative | Best for | Watch out |\n|---|---|---|\n| WHOOP | Same recovery/readiness niche, different device | Requires paid membership; member tiers start at 10 until reviewed |\n| Terra | Covering Oura + many wearables via one schema | Middle-layer cost; may not expose every Oura-specific field |\n| Junction (formerly Vital) | Wearables plus lab/diagnostic data in one API | Aggregator layer; confirm exact Oura metrics are surfaced |\n| Fitbit / Google Health | Broad, lower-cost consumer install base | Mid-migration to Google Health API; legacy API off Oct 30, 2026; users must re-consent |\n| Garmin | Multi-sport users wanting sleep/recovery from a watch | Business-only approval; some metrics need a license fee |\n\n## Which should you pick?\n\nMatch the alternative to what actually triggered your search, not to a single winner:\n\n- **You want the same readiness/recovery product, just off the ring** → WHOOP. Closest data-model peer, but plan for its membership requirement and approval cap.\n- **You need many devices covered without per-vendor gates** → an aggregator (Terra or Junction). One integration spans Oura, WHOOP, Garmin, Fitbit, Apple Health, and more, and you skip managing Oura's 10-user cap yourself.\n- **You also need labs or diagnostics** → Junction (formerly Vital), which bundles lab ordering with wearable data.\n- **You want the broadest, cheapest user base** → Fitbit / Google Health, accepting the ongoing Google migration.\n- **Your users are athletes who want GPS plus recovery** → Garmin, if you can clear partner approval.\n- **Sleep-stage and readiness quality is the whole point of your product** → reconsider staying on Oura. Its strength is exactly this signal, and the alternatives trade it away.\n\n## Is switching easy?\n\nUsually not trivially. Moving off Oura is a real re-integration, not a config change: a new `OAuth` client and consent flow, re-mapping fields to a different schema, and — because health-data authorization is per-user — every user has to reconnect their account under the new provider. Budget for that reconnect churn, since you cannot silently migrate existing user grants.\n\nThe one place this gets easier is an aggregator. If you route through Terra or Junction, you integrate once and reach Oura *plus* many other wearables behind a stable interface — and if you later add or drop a vendor, you avoid redoing OAuth and schema work each time. That is the main reason multi-device teams reach for an aggregator instead of stacking direct integrations. If you are only ever going to support one device, a direct integration stays simpler and avoids the middle-layer cost. Compare the two paths in the [wearable data APIs guide](/fitness-apis/wearable-data-apis).",
    "faqs": [
      {
        "q": "Why do developers look for an Oura API alternative?",
        "a": "Mainly because Oura is single-vendor: every user must own an Oura ring, and Oura's API returns 403 when a user's Oura subscription has expired. Oura also limits an application to 10 users until it approves the app, and its spec says personal access tokens were deprecated in December 2025 and are no longer available, leaving OAuth2 only. Teams wanting a broader user base or multi-device coverage look wider."
      },
      {
        "q": "What is the closest alternative to the Oura API?",
        "a": "WHOOP is the nearest peer, covering the same recovery, readiness, and sleep niche via a strap instead of a ring. The trade-off is that it carries similar single-vendor constraints, including a required paid WHOOP membership and member tiers that start a new app at 10 members until WHOOP reviews it. It is a like-for-like data-model swap, not an escape from the gated single-vendor pattern."
      },
      {
        "q": "Can an aggregator replace the Oura API?",
        "a": "Yes, for coverage. Terra and Junction (formerly Vital) normalize Oura alongside many other rings and wearables behind one schema, so a single integration reaches Oura plus WHOOP, Garmin, Fitbit, Apple Health, and more. The trade-off is a middle-layer dependency and cost, and you may not see every Oura-specific field the raw API exposes. Confirm each aggregator surfaces the exact metrics you need."
      },
      {
        "q": "What is Oura actually best at?",
        "a": "Sleep-stage and readiness data quality. That specific signal is a major reason developers build on Oura, and the common alternatives trade it away rather than improve on it. If readiness and sleep quality are the core of your product, staying on Oura is often the right call, and the alternatives are worse at it, not better."
      },
      {
        "q": "Is switching from the Oura API easy?",
        "a": "It is usually a real re-integration, not a config change: a new OAuth client and consent flow, field re-mapping to a different schema, and, because health-data authorization is per-user, every user has to reconnect their account. Routing through an aggregator like Terra or Junction makes it easier because you integrate once and reach many wearables behind a stable interface."
      }
    ],
    "related": [
      {
        "href": "/alternatives/whoop-api-alternatives",
        "label": "WHOOP API alternatives"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/integrate/oura-api",
        "label": "How to integrate the Oura API"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness and wearable API every week, approval gates, user caps, and migration gotchas included, so subscribe and switch with your eyes open."
    }
  },
  {
    "slug": "whoop-api-alternatives",
    "primaryQuery": "WHOOP API alternatives",
    "h1": "The Best WHOOP API Alternatives (2026)",
    "metaTitle": "Best WHOOP API Alternatives (2026): 4 Compared",
    "metaDescription": "The top WHOOP API alternatives for 2026: Oura for recovery, aggregators like Terra and Junction for many devices, and Fitbit or Garmin for broader reach.",
    "updated": "2026-07-09",
    "answer": "The top alternatives to the WHOOP API are Oura (the closest recovery and sleep peer), health-data aggregators like Terra and Junction (formerly Vital) that cover WHOOP plus many other wearables through one integration, and broader-base devices like Fitbit and Garmin. Pick by what is blocking you: Oura for a like-for-like recovery signal without the strap, an aggregator when you need many devices behind one integration, and Fitbit or Garmin for reach without a mandatory paid membership. WHOOP itself remains strong at recovery and strain for its committed, subscribed users.",
    "body": "If you are building on the WHOOP API and running into the paid-membership requirement, the member tiers that start new apps at 10 members, or the fact that it is a single-vendor feed, the alternatives worth a look are Oura (the closest recovery peer), aggregators like Terra and Junction (formerly Vital) that cover WHOOP plus many other wearables at once, and broader-base devices like Fitbit and Garmin. Pick by what is blocking you: Oura for a like-for-like recovery signal without the strap, an aggregator when you need many devices behind one integration, and Fitbit or Garmin when you want reach without a mandatory subscription.\n\nWHOOP is genuinely good at what it does — for committed users who wear the strap daily, its recovery and strain metrics are a strong, opinionated signal. The question on this page is not whether WHOOP is good, but when a different data source fits your product better. For what this site has verified about WHOOP access in one place, see the [WHOOP API overview](/apis/whoop).\n\n## Why teams look for a WHOOP API alternative\n\nThree factual constraints send builders looking:\n\n- **It requires a paid WHOOP membership.** To produce data at all, each user needs an active WHOOP membership — the device plus a subscription. If your audience does not already own and pay for WHOOP, that is a hard prerequisite you cannot integrate around.\n- **Member tiers cap your reach.** Every new app starts on WHOOP's Sandbox tier of 10 members, then moves up one reviewed tier at a time through 100, 1,000 and 5,000 members to unlimited Production, and from the 100-member tier onward you need half your current limit connected before you can ask for the next. Each request needs testing with at least one real member, complete app details and adherence to WHOOP's brand guidelines. That is a reasonable gate, but it is a gate — you cannot ship to an unbounded audience on day one.\n- **It is single-vendor.** The WHOOP API gives you WHOOP data and only WHOOP data. If your users are on a mix of rings, watches, and straps, one direct WHOOP integration covers a slice of them.\n\nNone of these make WHOOP a poor API. They are simply the reasons a team whose users are not all WHOOP subscribers, or who needs broader device coverage, starts evaluating other sources.\n\n## The alternatives\n\n**Oura.** A finger-worn ring in the same recovery, readiness, and sleep niche as WHOOP. Best for: teams that want a like-for-like recovery signal from a device some users may prefer over a strap. The trade-off: Oura is also single-vendor and requires each user to own the ring, and its developer API has its own 10-user cap until Oura approves your app — so you are swapping one committed-hardware dependency for another, not escaping the pattern.\n\n**Terra / Junction (formerly Vital) / Rook.** Health-data aggregators that connect to WHOOP plus hundreds of other wearables and normalize everything into one schema behind a single integration. Best for: covering WHOOP as one of several recovery sources — and sidestepping WHOOP's member tiers on your own app — without building a separate integration per device. The trade-off: you pay a recurring vendor fee (often per connected user), and the normalized schema may not surface every WHOOP-specific field you would get from the raw API.\n\n**Fitbit / Garmin.** Broad-install-base wearables that reach far more users than WHOOP and do not require a separate paid membership tier the way WHOOP does. Best for: maximizing the share of your users who already own a compatible device. The trade-off: each has its own friction — Fitbit's legacy Web API is being consolidated into the Google Health API (with user re-consent required and a turn-off Google lists for October 30, 2026), and Garmin's developer program is partner-approval-only and, by Garmin's own FAQ, for business use only.\n\n| Alternative | Best for | Watch out |\n|---|---|---|\n| Oura | Like-for-like recovery/sleep from a ring | Single-vendor too; users must own the ring; its own 10-user cap until approval |\n| Terra / Junction / Rook | Many wearables (incl. WHOOP) behind one integration | Recurring per-user fee; schema may omit WHOOP-specific fields |\n| Fitbit | Broad consumer install base, no separate membership | Legacy Web API consolidating into Google Health API; turn-off Oct 30, 2026; re-consent |\n| Garmin | Multi-sport users, broad device base | Business-only approval; some metrics need a license fee |\n\n## Which should you pick?\n\nThere is no single winner — it depends on why you left WHOOP:\n\n- **You need the same recovery/readiness signal, strap not required.** Oura is the closest peer. Expect a similar single-vendor, committed-hardware model, just with a ring.\n- **Your users are on many different devices.** An aggregator (Terra, Junction, or Rook) is the right call. You integrate once, WHOOP becomes one connectable source among many, and WHOOP's member tiers on your own direct app stop being the constraint.\n- **You want the widest reach and no mandatory subscription.** Fitbit or Garmin give you a much larger install base — accepting Fitbit's Google migration or Garmin's approval gate as the cost.\n- **You want to keep WHOOP but reach more of your users.** Keep the direct integration for your WHOOP subscribers and add an aggregator or a second device for everyone else. These are not mutually exclusive.\n\nFor the full side-by-side of device APIs and aggregators on coverage, access friction, and data depth, see the [wearable data APIs comparison](/fitness-apis/wearable-data-apis). If you decide WHOOP still fits and you just needed the lay of the land, the [WHOOP API integration guide](/integrate/whoop-api) walks through the direct build; the [Oura API guide](/integrate/oura-api) covers the closest peer.\n\n## Is switching easy?\n\nUsually not trivial — plan for a real re-integration, not a config flip. Moving off WHOOP means a new OAuth setup with the new provider, re-mapping fields (a WHOOP recovery score is not shaped the same as an Oura readiness score or a Fitbit metric), and — the part teams underestimate — asking every user to reconnect their device through the new flow. User reconnect is churn; budget for it. If what you want is a score you control rather than a vendor's, [building a recovery app](/build/recovery-app) covers computing one from HRV and resting heart rate against each user's own baseline.\n\nThe one place you avoid doing this repeatedly is an aggregator. Integrate once with Terra, Junction, or Rook and additional devices become connect-flow options rather than fresh engineering projects each time — which is exactly why teams supporting a mix of wearables tend to land there instead of stitching direct integrations one by one.\n\n*Product details, caps, and migration timelines above are current as of 2026 and change often — verify each provider's requirements against its live developer docs before you build.*",
    "faqs": [
      {
        "q": "Why do teams look for a WHOOP API alternative?",
        "a": "Three constraints, as of 2026: the WHOOP API requires each user to have an active paid WHOOP membership (device plus subscription); new apps start on a 10-member Sandbox tier and grow only through WHOOP's reviewed tiers; and it is single-vendor, returning WHOOP data only. Teams whose users are not all WHOOP subscribers, or who need broader device coverage, evaluate other sources. Verify current requirements against WHOOP's developer docs."
      },
      {
        "q": "What is the closest alternative to WHOOP for recovery data?",
        "a": "Oura is the closest peer, covering the same recovery, readiness, and sleep niche from a finger-worn ring instead of a strap. Note that Oura is also single-vendor, requires each user to own the ring, and has its own 10-user development cap until Oura approves your app, so you are swapping one committed-hardware dependency for another rather than escaping the pattern."
      },
      {
        "q": "Can an aggregator get me WHOOP data without the 10-member cap?",
        "a": "Aggregators like Terra, Junction (formerly Vital), and Rook connect to WHOOP plus many other wearables and normalize the data into one schema, so WHOOP becomes one connectable source among many and WHOOP's member tiers on your own direct app stop being the constraint. The trade-offs are a recurring per-connected-user fee and a normalized schema that may not surface every WHOOP-specific field."
      },
      {
        "q": "Is WHOOP still a good choice for some apps?",
        "a": "Yes. For products whose users are committed WHOOP members wearing the strap daily, WHOOP's recovery and strain metrics are a strong, opinionated signal, and a direct integration gives you the raw fields. The alternatives matter when your audience is not all WHOOP subscribers or you need to cover many device types."
      },
      {
        "q": "Is switching off WHOOP easy?",
        "a": "Usually it is a real re-integration, not a config change: a new OAuth setup with the new provider, re-mapping fields (a WHOOP recovery score is shaped differently from an Oura readiness score or a Fitbit metric), and asking every user to reconnect their device through the new flow. An aggregator is the main way to avoid repeating that work, since additional devices become connect-flow options rather than fresh integrations."
      }
    ],
    "related": [
      {
        "href": "/alternatives/oura-api-alternatives",
        "label": "Oura API alternatives"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/integrate/whoop-api",
        "label": "How to integrate the WHOOP API"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "We break down a wearable or health-data API every week — including WHOOP's approval gate, aggregator pricing traps, and which device actually fits your users. Subscribe and skip the surprises."
    }
  },
  {
    "slug": "healthkit-alternatives",
    "primaryQuery": "HealthKit alternatives",
    "h1": "Apple HealthKit Alternatives (2026)",
    "metaTitle": "Apple HealthKit Alternatives (2026): 3 Compared",
    "metaDescription": "HealthKit is iOS-only and on-device. Compare Google Health Connect, aggregators (Terra, Junction, Rook), and cloud wearable APIs, and pick by use case.",
    "updated": "2026-07-09",
    "answer": "HealthKit is iOS-only and on-device with no server-side or cross-platform access, so it is usually complemented rather than replaced. The main alternatives are Google Health Connect (the Android counterpart you implement alongside HealthKit), health-data aggregators like Terra, Junction (formerly Vital), and Rook (server-side, cross-platform, one integration), and cloud wearable APIs like Fitbit, Garmin, Oura, and Whoop. Pick Health Connect for native Android on-device data, an aggregator when you need cross-platform data on your server from a single integration, and a cloud wearable API when your product is built around a specific device.",
    "body": "You reached for Apple HealthKit and hit its edges: it is iOS-only, it lives on the device, and there is no first-party server-side or cross-platform access. The moment you need Android users, data on your backend, or a single integration that covers more than one platform, you need something alongside it. This page names the practical alternatives and helps you pick by what you are actually blocked on.\n\nWorth saying up front: HealthKit is excellent at what it does. On iOS it is the canonical, permissioned, on-device store for health and workout data, and for an iPhone-only app it is hard to beat. The reason builders land here is not that HealthKit is weak — it is that its scope stops at the iOS device boundary, so for reach you usually **complement** it rather than replace it. For what this site has verified about HealthKit access in one place, see the [HealthKit API overview](/apis/healthkit).\n\n## Why teams look for a HealthKit alternative\n\nThe triggers are almost always about scope, not quality:\n\n- **You need Android coverage.** HealthKit does not exist on Android. There is no version of it to ship there, so an Android audience needs a separate data layer.\n- **You need the data server-side.** HealthKit exposes data locally on the device. Reading it on your backend means building your own plumbing to pull it off the phone and sync it up — HealthKit does not hand you a server API.\n- **You want one integration, not several.** A truly cross-platform app that leans only on device stores ends up maintaining HealthKit on iOS, a separate Android store, and possibly cloud wearable APIs on top — three code paths for one feature.\n\nNone of these are HealthKit failing; they are HealthKit's on-device, iOS-only design meeting a cross-platform or server-side requirement.\n\n## The alternatives\n\n### Google Health Connect — the Android counterpart\n\nHealth Connect is the on-device health data layer for Android, and it is the natural other half of a HealthKit integration. If you like the HealthKit model (permissioned, on-device, first-party) and simply need Android too, you implement **both**: HealthKit on iOS, Health Connect on Android. See the side-by-side in [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect).\n\n- **Best for:** cross-platform apps that want native on-device data on each OS.\n- **Watch out:** it does not remove the two-platform problem — it is a second integration to build and maintain, with its own permissions model, and it is still on-device (no server API by itself).\n\n### Health-data aggregators (Terra, Junction, Rook) — server-side, cross-platform, one integration\n\nAggregators sit in the cloud and normalize many sources — Apple Health, Health Connect, and cloud wearables like Garmin, Fitbit, Oura, and Whoop — behind a single schema. Instead of stitching HealthKit plus Health Connect plus per-vendor APIs yourself, you integrate once and receive data server-side across platforms. Junction is **Junction (formerly Vital)** after its 2025 rebrand. The category is covered in [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) and head-to-head in [Terra vs Vital (Junction)](/fitness-apis/terra-vs-vital).\n\n- **Best for:** teams that want cross-platform, server-side data from one integration rather than building three.\n- **Watch out:** it is a paid middle layer and an added dependency; vendor-specific fields you could read directly may not all surface through the normalized schema.\n\n### Cloud wearable APIs (Fitbit, Garmin, Oura, Whoop) — server-reachable device data\n\nIf your users are on a specific wearable, that vendor's cloud API gives you server-accessible data without depending on an iPhone being online to relay it. This is a good complement when a device brand matters to your product.\n\n- **Best for:** server-side access to one device ecosystem you have standardized on.\n- **Watch out:** each is single-vendor and comes with its own gate — approval steps, user caps, or a required paid membership depending on the vendor — so covering several means several integrations.\n\n| Alternative | Best for | Watch out |\n|---|---|---|\n| **Google Health Connect** | The Android half of a cross-platform on-device app | Second integration to build; still on-device (no server API alone) |\n| **Terra / Junction (formerly Vital) / Rook** | Server-side, cross-platform data from one integration | Paid middle layer; some vendor-specific fields may not surface |\n| **Cloud wearable APIs (Fitbit / Garmin / Oura / Whoop)** | Server-reachable data for a specific device you standardized on | Single-vendor; per-vendor gates, caps, or paid membership |\n\n## Which should you pick?\n\n- **Cross-platform app, keep it native and on-device:** pair HealthKit with **Google Health Connect**. You build both, but you get first-party data on each OS.\n- **You need data on your server, across iOS and Android, from one integration:** use an **aggregator (Terra, Junction, or Rook)**. One schema, cross-platform, server-side.\n- **Your product is built around a specific wearable:** add that vendor's **cloud API** (Fitbit, Garmin, Oura, or Whoop) for server-reachable device data.\n- **iPhone-only, on-device is fine:** you may not need an alternative at all — HealthKit alone is the right tool. Our [HealthKit integration guide](/integrate/healthkit) covers that path.\n\nRemember these are complements more than swaps: most real apps end up with HealthKit **and** one of the above, chosen by whether the gap is Android, the server, or a device brand.\n\n## Is switching easy?\n\nAdding coverage beyond HealthKit is a real integration effort, not a config flag. Health Connect means a separate Android permissions flow and field mapping to your data model. A cloud wearable API means new OAuth, user reconnection, and per-vendor schema work. The one place you consolidate that effort is an aggregator: you do one OAuth and one field mapping, and it fans out to Apple Health, Health Connect, and the cloud wearables behind a single normalized API — which is exactly why teams facing \"iOS + Android + server\" reach for one instead of building each path themselves. For the broader landscape, see the [fitness API comparison](/fitness-apis).",
    "faqs": [
      {
        "q": "Can HealthKit be replaced entirely?",
        "a": "Usually not. On iOS, HealthKit is the canonical on-device store for health and workout data, so for iPhone-only apps it is hard to beat. Teams add alternatives to gain Android coverage, server-side data, or a single cross-platform integration, so in practice HealthKit is complemented rather than replaced."
      },
      {
        "q": "What is the Android equivalent of HealthKit?",
        "a": "Google Health Connect is the on-device health data layer for Android and is the natural counterpart to HealthKit. Cross-platform apps typically implement both: HealthKit on iOS and Health Connect on Android. Like HealthKit, Health Connect is on-device and does not provide a server API by itself."
      },
      {
        "q": "How do I get HealthKit data on my server?",
        "a": "HealthKit exposes data locally on the device, so reaching it server-side means either building your own sync from the app to your backend, or using a health-data aggregator (Terra, Junction, or Rook) that normalizes Apple Health and other sources into a server-side API through one integration."
      },
      {
        "q": "Do I still need HealthKit if I use an aggregator like Terra or Junction?",
        "a": "On iOS, aggregators generally read from Apple Health, which is populated via HealthKit, so HealthKit remains the underlying data source on the device. The aggregator handles the cross-platform, server-side normalization so you do not build HealthKit plus Health Connect plus per-vendor cloud APIs separately."
      },
      {
        "q": "Is moving beyond HealthKit a lot of work?",
        "a": "It is a real integration each time. Health Connect adds a separate Android permissions flow and field mapping; a cloud wearable API adds new OAuth, user reconnection, and its own schema. An aggregator consolidates that into one OAuth and one field mapping across Apple Health, Health Connect, and cloud wearables."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/integrate/healthkit",
        "label": "How to integrate Apple HealthKit"
      },
      {
        "href": "/alternatives/terra-alternatives",
        "label": "Terra alternatives"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "Deciding between building both platforms yourself and using one aggregator? Get our concise breakdowns of health API trade-offs in your inbox."
    }
  },
  {
    "slug": "terra-alternatives",
    "primaryQuery": "Terra alternatives",
    "h1": "The Best Terra (tryterra.co) Alternatives (2026)",
    "metaTitle": "Terra API Alternatives (2026): 9 Health-Data Options",
    "metaDescription": "Terra (tryterra.co) alternatives as of October 2026: Junction, Rook, Spike, Thryve, Sahha, Validic, Open Wearables, direct APIs or on-device stores.",
    "updated": "2026-10-17",
    "answer": "The main Terra (tryterra.co) alternatives, from their own pages on October 17, 2026, are Junction (formerly Vital) for US lab ordering and a flat $300 a month up to 500 users, Rook for active-user tiers from $399 a month, Spike for medical IoT, lab-report OCR and food-photo nutrition, Thryve for EU hosting in Germany, Sahha for phone-first data and scores, Validic for enterprise remote monitoring, and Open Wearables if you want MIT-licensed software you host yourself. You can also drop the aggregator for direct per-provider integrations or on-device HealthKit and Health Connect. Pick by what is pushing you off Terra: its per-connected-source credits, hosting, or a data source it does not fit; lab testing alone is no longer a reason, since Terra now sells it in the US and UK.",
    "body": "Terra is a strong aggregator: broad provider coverage, a rich normalized schema, many delivery destinations and, now, lab testing. Most teams that shop around are not unhappy with the product; they have hit a billing unit, a hosting requirement or a data source that another vendor fits better. Everything below is from the vendors' own pages as we read them on October 17, 2026. For what this site has verified about Terra access in one place, see the [Terra API overview](/apis/terra).\n\n## Why teams look for a Terra alternative\n\nTerra prices on **credits**. Its pricing page says subscriptions \"start from $399 per month billed annually, or $499 per month billed monthly\", including 100,000 credits a month; \"An active authentication is one connected data source for one end user, and costs 200 credits per month\", the first 400 events per active authentication each month are free, and unused credits do not roll over. By our arithmetic that is about $899 a month at 1,000 connected sources on annual billing, and the bill grows with every source a user connects, not with every person.\n\nThat model is fine at steady scale, but three things send teams looking:\n\n- **The unit.** If your users connect several devices each, a per-person price can come out lower than a per-source one.\n- **Where the data lives.** Some buyers need EU hosting or need health data never to leave their own servers.\n- **What else they need.** Phone-only users with no wearable, remote-monitoring programs inside an EHR, or a contract with fixed tiers.\n\nLabs used to be on that list. They are not any more for most teams: Terra's homepage now offers blood tests \"through home kits, mobile phlebotomy, or lab walk-ins\", and its lab page says \"Nationwide US, plus the UK\".\n\n## The alternatives\n\n**Junction (formerly Vital).** Wearables plus lab ordering across all 50 US states, through \"a nationwide network of labs (NY, NJ, and RI included)\". Its Launch plan is \"a flat $300 a month\" for up to 500 connected users; labs, unlimited users and the signed BAA are on custom Enterprise. *Trade-off:* the lab side is US-only on the pages we read, and past 500 users you need a quote. See [Terra vs Vital (Junction)](/fitness-apis/terra-vs-vital).\n\n**Rook (tryrook.io).** Active-user plans with published ceilings: Core $399 a month for up to 750 active users, Core+ $999 for 5,000, Business $1,999 for 15,000. It now adds a Medical Device API and a Lab Data API that parses lab reports. *Trade-off:* a 12-month standard contract, and Dexcom, Samsung Health, Strava and WHOOP need your own developer accounts. See [Terra vs ROOK](/compare/terra-vs-rook).\n\n**Spike (spikeapi.com).** Wearables plus medical IoT, lab-report OCR with LOINC codes, food-photo nutrition and an MCP server, with a dedicated implementation engineer from the Sandbox plan, which \"Starts from $450 /month\". *Trade-off:* pricing past the starting point is not itemized, and its site announces \"Raintree Systems Acquires Spike Technologies\". See [Terra vs Spike](/compare/terra-vs-spike).\n\n**Thryve (thryve.health).** \"Developed and hosted entirely in Europe\", with data \"hosted in Germany\"; Start Up starts at 499 euros a month for 500 users plus 0.50 euros per extra user, and its certifications page says \"BAA agreements included on all plans\". *Trade-off:* Start Up stores data for two weeks, and providers without a shared OAuth client, such as Dexcom and WHOOP, need your own. See [Terra vs Thryve](/compare/terra-vs-thryve).\n\n**Sahha (sahha.ai).** Phone-first: it \"turns the smartphone itself into a passive sensor\", reads Apple Health and Health Connect, and returns biomarkers, scores and archetypes. Starter is $299 a month billed annually with 1,000 users included. *Trade-off:* direct cloud integrations for Garmin, Oura and WHOOP \"are in public beta and are Sandbox only\". See [Terra vs Sahha](/compare/terra-vs-sahha).\n\n**Validic (validic.com).** The enterprise remote-monitoring option, now owned by ChartSpan, with \"700+ devices\" and programs that write into the EHR; its Inform API has a free Developer plan for 5 users. *Trade-off:* production use means a negotiated Enterprise contract, and its device list shows some vendors closed to new applications.\n\n**Open Wearables (openwearables.io).** MIT-licensed, self-hosted, \"Free forever\" for the open-source core, from Momentum. *Trade-off:* you register with every provider yourself (\"You must apply for Garmin Developer Program\"), and its README calls it \"an early-stage project\". See [Terra vs Open Wearables](/compare/terra-vs-open-wearables).\n\n**Direct per-provider integrations** (Garmin, Oura, WHOOP, Strava, Polar, the Google Health API). Best for owning the pipeline and paying no aggregator fee. *Trade-off:* you build and maintain every connector, OAuth flow and token refresh yourself, and clear each provider's approval.\n\n**On-device stores via SDK: HealthKit (iOS) and Health Connect (Android).** Best for reading data already on the user's phone with no per-user API cost. *Trade-off:* no server-side pull, one platform each. See [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect).\n\n| Alternative | Best for | Watch out |\n| --- | --- | --- |\n| Junction (formerly Vital) | US lab ordering in all 50 states; flat price up to 500 users | Labs and BAA are Enterprise-only |\n| Rook | Active-user tiers that stay flat to 5,000 or 15,000 users | 12-month standard contract |\n| Spike | Medical IoT, lab-report OCR, food photos, MCP | Unitemized pricing; announced acquisition |\n| Thryve | EU hosting and a BAA on every plan | Two weeks of storage on Start Up |\n| Sahha | Users without wearables; scores out of the box | Cloud integrations still beta |\n| Validic | Enterprise RPM inside the EHR | Negotiated contracts for production |\n| Open Wearables | Data that never leaves your servers | You hold every provider registration |\n| Direct integrations | Owning the pipe, no aggregator fee | You build every connector |\n| HealthKit / Health Connect | Mobile-first, no per-user cost | No server-side pull |\n\n## Which should you pick?\n\n- **Labs for US users across every state** → Junction; for UK users too, Terra itself already does it.\n- **Many users, one device each, and a flat tiered bill** → Rook or Sahha.\n- **EU hosting** → Thryve.\n- **Medical IoT, lab reports and food photos in one contract** → Spike.\n- **Hospital or payer remote-monitoring programs** → Validic.\n- **Self-hosting or open source** → Open Wearables.\n- **One or two providers only** → go direct and own the pipe.\n\nIf you are still deciding between aggregators in general, the [health-data aggregator API comparison](/fitness-apis/health-data-aggregator-apis) covers the whole field, and [aggregator pricing](/pricing/health-data-aggregator-pricing) runs the same user counts through each price sheet.\n\n## Is switching easy?\n\nUsually it is a real re-integration, not a config flip: new app registrations with the new vendor (and with any provider that needs your own credentials), re-mapping fields to a different normalized schema, and having **every existing user reconnect** through the new vendor's flow. Budget for the reconnect campaign, not just the code.\n\nSwitching between aggregators is still one re-integration rather than many, because each new vendor covers many providers behind one API. If you land on staying with an aggregator, the [Terra API integration guide](/integrate/terra-api) shows the shape of the work you would be re-doing against whichever vendor you pick.\n\n*Prices, plans and coverage above are from October 17, 2026 and change often; re-verify each vendor's live pricing and integrations pages before you commit.*",
    "faqs": [
      {
        "q": "Why do teams look for a Terra alternative?",
        "a": "Mostly the billing unit. As of October 17, 2026, Terra starts at $399 a month billed annually with 100,000 credits and charges 200 credits a month per connected data source, so a user with two devices costs twice. Others need EU hosting, data that stays on their own servers, users without wearables, or enterprise remote-monitoring programs. Terra itself remains strong on coverage, delivery destinations and, now, lab testing."
      },
      {
        "q": "What is the best Terra alternative if I also need lab data?",
        "a": "It depends on where your users are. As of October 17, 2026, Junction orders lab tests across all 50 US states through a nationwide lab network on its Enterprise plan. Terra itself now orders lab tests in the US and the UK, so labs alone are no longer a reason to switch. If you only need to read lab reports users already have, Rook's Lab Data API and Spike's Lab Reports API parse them into LOINC-coded results."
      },
      {
        "q": "How do Rook and Spike differ from Terra?",
        "a": "Rook prices by active users on published tiers, from Core at $399 a month for up to 750 users, and adds medical-device and lab-report APIs, on a standard 12-month contract. Spike reaches into medical IoT, lab-report OCR, food-photo nutrition and EMR data, assigns a dedicated implementation engineer, and starts from $450 a month without itemizing how the bill grows. Both figures are from October 17, 2026."
      },
      {
        "q": "Can I replace Terra without an aggregator at all?",
        "a": "Yes, three ways. Build direct per-provider integrations and own the pipeline, at the cost of every connector, OAuth flow and approval. Read on-device data through HealthKit and Health Connect, with no server-side pull. Or self-host Open Wearables, MIT-licensed software from Momentum that is free to run but needs your own developer registration with each provider, which its docs say for Garmin, Suunto and Polar."
      },
      {
        "q": "Is switching away from Terra easy?",
        "a": "It is usually a real re-integration, not a config change. Expect new app registration with the new vendor and with any provider that needs your own credentials, re-mapping fields to a different normalized schema, and having every existing user reconnect their device through the new connect flow. Switching between aggregators is one re-integration that still covers many providers; going fully direct trades the aggregator fee for maintaining each connector yourself."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/terra-vs-vital",
        "label": "Terra vs Vital (Junction)"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/compare/terra-vs-open-wearables",
        "label": "Terra vs Open Wearables"
      },
      {
        "href": "/integrate/terra-api",
        "label": "How to integrate Terra"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "We track aggregator prices, coverage and the reconnect gotchas of switching vendors. Subscribe and migrate with your eyes open."
    },
    "sources": [
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-17",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://tryterra.co/products/lab-testing",
        "checked": "2026-10-17",
        "note": "Terra lab testing geography and collection methods"
      },
      {
        "url": "https://www.junction.com/",
        "checked": "2026-10-17",
        "note": "Junction devices and lab network"
      },
      {
        "url": "https://www.junction.com/pricing",
        "checked": "2026-10-17",
        "note": "Junction Launch and Enterprise plans"
      },
      {
        "url": "https://tryrook.io/pricing/",
        "checked": "2026-10-17",
        "note": "Rook plans, add-ons and contract terms"
      },
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
        "url": "https://docs.tryrook.io/data-sources/",
        "checked": "2026-10-17",
        "note": "Rook data sources and own developer accounts"
      },
      {
        "url": "https://www.spikeapi.com/",
        "checked": "2026-10-17",
        "note": "Spike scope, implementation engineer and customers"
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
        "url": "https://www.spikeapi.com/pricing",
        "checked": "2026-10-17",
        "note": "Spike Sandbox and Enterprise plans"
      },
      {
        "url": "https://www.spikeapi.com/integrations",
        "checked": "2026-10-17",
        "note": "Spike integrations and acquisition banner"
      },
      {
        "url": "https://www.thryve.health/",
        "checked": "2026-10-17",
        "note": "Thryve coverage and hosting"
      },
      {
        "url": "https://www.thryve.health/pricing",
        "checked": "2026-10-17",
        "note": "Thryve plans, storage and hosting"
      },
      {
        "url": "https://www.thryve.health/certifications-compliance",
        "checked": "2026-10-17",
        "note": "Thryve certifications and BAA"
      },
      {
        "url": "https://docs.thryve.health/thryve-data-sources/overview",
        "checked": "2026-10-17",
        "note": "Thryve data sources and OAuth clients"
      },
      {
        "url": "https://sahha.ai/",
        "checked": "2026-10-17",
        "note": "Sahha coverage, pricing FAQ and compliance"
      },
      {
        "url": "https://sahha.ai/integrations/",
        "checked": "2026-10-17",
        "note": "Sahha integrations"
      },
      {
        "url": "https://sahha.ai/pricing/",
        "checked": "2026-10-17",
        "note": "Sahha plans"
      },
      {
        "url": "https://docs.sahha.ai/docs/connect/integrations",
        "checked": "2026-10-17",
        "note": "Sahha cloud integrations beta"
      },
      {
        "url": "https://validic.com/news/chartspan/",
        "checked": "2026-10-17",
        "note": "ChartSpan acquisition of Validic"
      },
      {
        "url": "https://validic.com/",
        "checked": "2026-10-17",
        "note": "Validic devices and EHR programs"
      },
      {
        "url": "https://validic.com/inform-signup/",
        "checked": "2026-10-17",
        "note": "Validic Inform plans"
      },
      {
        "url": "https://validic.com/blog/Validic-Inform-Is-Now-Free/",
        "checked": "2026-10-17",
        "note": "Validic Inform free tier"
      },
      {
        "url": "https://validic.com/features/supported-devices/",
        "checked": "2026-10-17",
        "note": "Validic restricted devices"
      },
      {
        "url": "https://openwearables.io/pricing",
        "checked": "2026-10-17",
        "note": "Open Wearables licence and Enterprise"
      },
      {
        "url": "https://github.com/the-momentum/open-wearables/blob/main/LICENSE",
        "checked": "2026-10-17",
        "note": "Open Wearables licence"
      },
      {
        "url": "https://openwearables.io/docs/providers/supported",
        "checked": "2026-10-17",
        "note": "Open Wearables provider setup"
      },
      {
        "url": "https://github.com/the-momentum/open-wearables",
        "checked": "2026-10-17",
        "note": "Open Wearables README"
      }
    ]
  },
  {
    "slug": "nutritionix-alternatives",
    "primaryQuery": "Nutritionix alternatives",
    "h1": "The Best Nutritionix Alternatives (2026)",
    "metaTitle": "Best Nutritionix Alternatives (2026): 4 Compared",
    "metaDescription": "Compare the top Nutritionix alternatives in 2026 — Edamam, USDA FoodData Central, Open Food Facts, and Spoonacular — and pick the right one by use-case.",
    "updated": "2026-07-09",
    "answer": "The top Nutritionix alternatives are Edamam (the closest natural-language match, plus recipes), USDA FoodData Central (genuinely free, public domain), Open Food Facts (genuinely free open data, barcode-first), and Spoonacular (recipe-oriented freemium). Pick by use-case: Edamam for free-text meal logging, USDA for authoritative generic-food data, Open Food Facts for packaged-product barcodes, and Spoonacular for recipes and meal planning. Nutritionix itself is still strongest for US restaurant menus and natural-language food logging; verify all pricing and free-tier terms before committing.",
    "body": "If you are shopping around because Nutritionix sits at the premium end and its free-tier terms are hard to pin down for production, the main alternatives are: **Edamam** (the closest natural-language match, plus recipes), **USDA FoodData Central** (genuinely free, US-government, public domain), **Open Food Facts** (genuinely free open data, barcode-first), and **Spoonacular** (recipe-oriented freemium). Pick by what you actually need: authoritative generic-food data points to USDA, packaged-product barcodes to Open Food Facts, natural-language meal logging to Edamam, and recipe or meal-planning features to Spoonacular — but know that Nutritionix is still the strongest for US restaurant-menu coverage and free-text food logging. For what this site has verified about Nutritionix access in one place, see the [Nutritionix API overview](/apis/nutritionix).\n\n## Why teams look for a Nutritionix alternative\n\nNutritionix is a capable, widely used food and nutrition API, and it is genuinely best-in-class at two things: **US restaurant-menu coverage** and **natural-language food logging** (turning \"1 cup rice and two eggs\" into structured nutrients). If those are your core requirements, it is hard to beat. The reasons builders start looking around are usually about cost and data model rather than quality:\n\n- **Premium entry pricing.** Third-party comparisons cite entry pricing around **$1,850/mo** for the full UPC and restaurant-menu database (600k+ items). **This figure is volatile — verify current pricing directly with Nutritionix before you plan around it.** For a small team or an early-stage product, that can be the whole reason to shop around.\n- **Free-tier ambiguity.** The terms of the free or trial tier are frequently described as unclear for production use, so it is hard to know what you can ship on without a paid plan. Confirm the current access terms before you build on the free tier. A reported curtailment of that free tier is one of the tracked changes in [the monthly digest](/digest).\n- **Closed, non-redistributable data.** Nutritionix is a proprietary database. Teams that want **open, redistributable data** they can cache, self-host, or reuse without per-call licensing look elsewhere by design.\n- **Coverage fit.** Non-US foods and unbranded generic items may be thinner than a US-government nutrient database, depending on your market.\n\nNone of that makes Nutritionix a bad choice — it just means the price point, tier ambiguity, or the closed-data model can be a mismatch for a given team, which is a reasonable moment to compare.\n\n## The alternatives\n\n### Edamam — the closest natural-language match\n\n**What it is.** A food and nutrition API with natural-language meal analysis plus recipe analysis, offered on a free-to-start tier that scales to paid and enterprise plans (cited up to ~$999/mo, verify).\n\n**Best for.** Teams that want Nutritionix-style **free-text meal parsing and nutrition analysis**, and value having recipe analysis in the same API.\n\n**Watch out.** It is freemium-to-paid, not open data, and Edamam has shifted toward paid and enterprise access over time — verify current tiers and quotas. Restaurant-menu depth is not its focus the way it is for Nutritionix.\n\n### USDA FoodData Central — genuinely free and open\n\n**What it is.** The US government's food and nutrient database, exposed as a free API and released into the **public domain**.\n\n**Best for.** Authoritative **generic and unbranded food** and nutrient data, where accuracy and free, redistributable data matter most.\n\n**Watch out.** There is **no natural-language parser and no restaurant-menu data** — you build the text parsing and any menu coverage yourself. It is a data source, not a logging product.\n\n### Open Food Facts — free, open, barcode-first\n\n**What it is.** A crowd-sourced, openly licensed food database (2.5M+ products) built around barcode lookup, free to use with no API key.\n\n**Best for.** **Packaged-product and barcode** lookup in a scanning-based app, where open data and zero API cost are priorities.\n\n**Watch out.** Because it is crowd-sourced, **data quality and coverage vary** by product and region, and it carries a share-alike open-data license with attribution — check the obligations if you combine it into your own database.\n\n### Spoonacular — recipe-oriented\n\n**What it is.** A recipe-centric API (recipe search, meal planning, ingredient parsing) on a freemium points model.\n\n**Best for.** Apps whose core is **recipes, meal planning, and ingredients** rather than raw restaurant or barcode logging.\n\n**Watch out.** The points system can get **expensive at scale**, and it is less about restaurant menus and free-text food logging than Nutritionix or Edamam.\n\n| Alternative | Best for | Watch out |\n|---|---|---|\n| Edamam | Natural-language meal parsing + recipes | Freemium-to-paid, not open; less restaurant depth (verify tiers) |\n| USDA FoodData Central | Authoritative generic-food data, free & public domain | No NLP, no restaurant menus — you build parsing |\n| Open Food Facts | Barcode / packaged-product lookup, free open data | Crowd-sourced quality varies; share-alike license |\n| Spoonacular | Recipe search, meal planning, ingredients | Points model gets pricey at scale; not restaurant-focused |\n\nFor the fuller side-by-side of these and Nutritionix itself, see the [nutrition and food database APIs](/fitness-apis/nutrition-apis) comparison.\n\n## Which should you pick?\n\nThere is no single winner — it depends on what you are optimizing for:\n\n- **You need natural-language meal logging** (the thing people usually want Nutritionix for) → **Edamam** is the closest functional match, and adds recipe analysis. If US restaurant menus are essential, though, Nutritionix may still be the better fit.\n- **You want authoritative, free, redistributable nutrient data** → **USDA FoodData Central**. Accept that you build the text parsing and any menu coverage yourself.\n- **You are building a barcode scanner** for packaged products → **Open Food Facts**, with USDA as a fallback for nutrients where crowd-sourced data is thin.\n- **Your app is really about recipes and meal planning** → **Spoonacular**, watching the points cost as you grow.\n\nA common pattern is to combine the two genuinely free/open sources — USDA for generic-food nutrients, Open Food Facts for barcodes — and only pay for an NLP or restaurant layer (Edamam or Nutritionix) if your product actually needs it. Of the four, **USDA FoodData Central and Open Food Facts are the genuinely free and open options**; Edamam and Spoonacular are freemium-to-paid.\n\n## Is switching easy?\n\nFor a nutrition API, switching is more tractable than migrating a wearable OAuth integration — there is usually no per-user reconnect, since these are server-side data lookups rather than user-authorized accounts. But it is still a real re-integration, not a find-and-replace. Expect a **new API key and auth scheme**, a **field re-mapping** exercise (nutrient names, serving-size units, and food IDs differ across every database), and gaps to backfill — most notably, if you move off Nutritionix you lose its natural-language parser and restaurant menus and have to replace or drop those features.\n\nThe honest note on coverage: no single alternative reproduces everything Nutritionix does at once. Combining sources (USDA plus Open Food Facts, with an NLP layer on top) can match most of it, but that means integrating and maintaining more than one API. Budget for the mapping and coverage work, not just swapping a base URL.\n\nIf Nutritionix still fits and you would rather integrate it directly, the [Nutritionix API integration guide](/integrate/nutritionix-api) covers its endpoints and auth. For the wider landscape and how these sources compare on licensing and coverage, start with the [nutrition APIs](/fitness-apis/nutrition-apis) overview.\n\n*Pricing, free-tier terms, and quotas above are current as of 2026 and change often — verify Nutritionix's entry price and free-tier terms, and each alternative's current tiers, against their live documentation before you commit.*",
    "faqs": [
      {
        "q": "What are the best free Nutritionix alternatives?",
        "a": "USDA FoodData Central and Open Food Facts are the genuinely free and open options. USDA FoodData Central is US-government data in the public domain (free API key) and is best for authoritative generic-food nutrients; Open Food Facts is crowd-sourced open data with no key, built around barcode lookup. Edamam and Spoonacular are freemium-to-paid rather than free."
      },
      {
        "q": "Which Nutritionix alternative supports natural-language meal logging?",
        "a": "Edamam is the closest match — it parses free-text meal descriptions into structured nutrients, much like Nutritionix. USDA FoodData Central and Open Food Facts do not offer natural-language parsing (you build that yourself), and Spoonacular is oriented around recipes and ingredients rather than free-text food logging."
      },
      {
        "q": "Why is Nutritionix so expensive?",
        "a": "Nutritionix is a proprietary premium database whose value is US restaurant-menu coverage and natural-language logging. Third-party comparisons cite entry pricing around $1,850/mo for its full UPC and restaurant-menu database, but this figure is volatile and its free-tier terms are often described as ambiguous — verify current pricing and access terms directly with Nutritionix."
      },
      {
        "q": "What does Nutritionix do that the free alternatives cannot?",
        "a": "Its two standout strengths are US restaurant-menu coverage and natural-language food logging. USDA FoodData Central and Open Food Facts have neither, and matching Nutritionix usually means combining several sources — for example USDA plus Open Food Facts for data, with Edamam layered on for natural-language parsing."
      },
      {
        "q": "Which alternative is best for barcode scanning?",
        "a": "Open Food Facts is barcode-first and free, with millions of packaged products and no API key required, making it a strong fit for a scanner app. Because it is crowd-sourced, coverage and quality vary by product and region, so many teams fall back to USDA FoodData Central for nutrients where a barcode entry is thin."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/nutrition-apis",
        "label": "Best nutrition APIs"
      },
      {
        "href": "/integrate/nutritionix-api",
        "label": "How to integrate the Nutritionix API"
      },
      {
        "href": "/fitness-apis/free-fitness-apis",
        "label": "Free & open-source fitness APIs"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "We break down a new health and fitness API every week — the licensing traps, free-tier gotchas, and pricing surprises included. Subscribe to get the next one."
    }
  },
  {
    "slug": "exercisedb-alternatives",
    "primaryQuery": "ExerciseDB alternatives",
    "h1": "The Best ExerciseDB Alternatives (2026)",
    "metaTitle": "Best ExerciseDB Alternatives (2026): 4 Compared",
    "metaDescription": "Top ExerciseDB alternatives: wger, exercisedb.dev, API Ninjas and free-exercise-db, compared by license, hosting and media, and which you can self-host.",
    "updated": "2026-07-09",
    "answer": "The top alternatives to the RapidAPI ExerciseDB are wger, the separate exercisedb.dev API, API Ninjas Exercises, and free-exercise-db. Pick by need: wger to self-host and own the data (AGPL-3.0), free-exercise-db for a public-domain dataset with images and no licensing friction, exercisedb.dev for a large hosted catalog with video on its own paid plans, and API Ninjas if lightweight text metadata is enough; as of October 12, 2026 the exercisedb.dev repository holds only a README and a license file, so it is not a self-hosting option. License (AGPL vs public domain) and media (GIF/video vs images vs none) are the real differentiators.",
    "body": "If you've been building against ExerciseDB, you probably landed here for one of three reasons: the RapidAPI rate limits or billing are pinching, you got confused by two very different things sharing the \"ExerciseDB\" name, or you'd rather host the data yourself than depend on a gateway. This page names the honest alternatives, what each is genuinely best for, and the one trade-off to know — with license and media (GIF/video vs images vs none) as the real deciding factors. For what this site has verified about the RapidAPI-distributed ExerciseDB in one place, see the [ExerciseDB API overview](/apis/exercisedb).\n\n## Why teams look for an ExerciseDB alternative\n\nTo be clear about what ExerciseDB does well: the most-cited version ships a large, structured exercise catalog with GIF demonstrations through RapidAPI, which makes it fast to prototype against. The frictions that push builders to shop around are specific and factual, not a knock on the data:\n\n- **Cost and rate limits via RapidAPI.** The commonly-referenced ExerciseDB is distributed exclusively through RapidAPI, where the free tier is rate-limited (frequently cited around ~10 requests/min with monthly caps) and paid access runs through RapidAPI's billing *(verify — RapidAPI limits and pricing change)*. If your traffic outgrows the free tier, the cost model becomes a factor.\n- **Name ambiguity.** \"ExerciseDB\" refers to at least two distinct things: the commercial RapidAPI listing, and **exercisedb.dev**, a separate hosted API whose GitHub repository carries an AGPL-3.0 license file but, as of October 12, 2026, no code. They are not the same product, and people frequently conflate them.\n- **You want to self-host and own the data.** Depending on a third-party gateway means inheriting its rate limits, uptime, and pricing. Some teams simply want the exercise data and media sitting on their own infrastructure.\n\nNone of these mean ExerciseDB is a bad choice — they mean a switch makes sense when licensing, ownership, or cost stops fitting. For the wider category view, see the [exercise database APIs comparison](/fitness-apis/exercise-database-apis).\n\n## The alternatives\n\nRead the license line as carefully as the feature line. AGPL is copyleft and carries real obligations if you embed it in a closed product; public domain has essentially none.\n\n### wger\n\nA fully self-hostable, free/libre platform (workout, nutrition, and weight tracking) that exposes a REST API. It ships on the order of 500+ exercises with images and is licensed **AGPL-3.0**. Best for teams that want a complete, self-hosted open-source platform they fully control rather than just a dataset. Trade-off: it's a whole application to host and operate, and the exercise media is images rather than GIF/video.\n\n### exercisedb.dev (the other ExerciseDB)\n\nThis is the separate project that shares the ExerciseDB name, and it is a hosted API rather than something you can run yourself. When we read [its GitHub repository](https://github.com/ExerciseDB/exercisedb-api) on October 12, 2026, it held exactly two files, a README and an AGPL-3.0 LICENSE, in a history that starts on November 25, 2025, so there is no API code in it to self-host. The README advertises 11,000+ exercises with 15,000+ videos, 20,000+ images and 5,000+ GIFs (marketing figures), links pricing plans and separate terms of use, and labels its v2 playground \"for exploration only and not recommended for production integration\". Best for teams that want a large, media-heavy catalog from a hosted API and will buy a plan. Trade-off: we could not read its pricing or terms, which sit behind links our environment cannot reach, and you rent the data rather than own it.\n\n### API Ninjas Exercises\n\nA simple hosted API returning exercise metadata — name, type, target muscle, equipment, and instructions. Best for lightweight lookups where structured text is all you need. Trade-off: it's **metadata-only** — no GIFs, video, or images — so it won't power a UI that shows movement demonstrations.\n\n### free-exercise-db\n\nA static, **public-domain** dataset of 800+ exercises as JSON with images, servable straight from GitHub raw URLs. Best for when you want zero licensing friction and don't need a live API or video — you can vendor the data directly into your app. Trade-off: it's a static dataset, not a maintained live service, and the media is images (no video/GIF).\n\n### Comparison\n\n| Alternative | Best for | Watch out |\n| --- | --- | --- |\n| wger | Self-hosting a full open-source platform (workouts + nutrition) | AGPL-3.0 copyleft; images only; you host the app |\n| exercisedb.dev (hosted API) | A large hosted catalog with video, on its own paid plans | Prices and terms not verified; the repository has no code to self-host |\n| API Ninjas Exercises | Lightweight hosted metadata lookups | Metadata only — no GIF/video/images |\n| free-exercise-db | Public-domain dataset with images, zero licensing friction | Static dataset, not a live API; images only |\n\n## Which should you pick?\n\nThere's no single winner — it depends on license tolerance, whether you need media, and whether you want to host anything:\n\n- **You need movement demos (GIF/video):** **exercisedb.dev** has the closest media to what you had, as a hosted API on its own paid plans; there is no code in its repository to self-host. If owning the data matters more, wger's open-source code supports exercise videos that you supply and license yourself.\n- **You want a complete open-source platform, not just a dataset:** **wger** gives you workouts, nutrition, and weight tracking behind one self-hosted API (also AGPL-3.0).\n- **You want zero licensing friction and images are enough:** **free-exercise-db** (public domain) is the most permissive option here — vendor the JSON and images directly.\n- **You only need structured text and no media:** **API Ninjas Exercises** is a hosted, low-effort choice.\n- **You want to stay on the hosted ExerciseDB but integrate it cleanly:** see the [ExerciseDB API integration guide](/integrate/exercisedb-api).\n\n## Is switching easy?\n\nUsually less \"swap the base URL\" and more a real re-integration. The catalogs differ in schema (field names, muscle taxonomies, equipment labels), so you'll re-map fields and likely reconcile IDs. Media is the bigger lift: if you're moving to a source with different or no media, you may need to host GIFs/images yourself or adjust the UI to what's available. And with wger you're taking on hosting the whole app, plus an AGPL license review if your product is closed-source.\n\nThe upside of self-hosting is that once the data lives on your infrastructure, you're no longer exposed to a gateway's rate limits, pricing changes, or downtime. Budget the migration as a genuine project — field mapping, media handling, and a license check — rather than a one-line change.",
    "faqs": [
      {
        "q": "Is exercisedb.dev the same as the ExerciseDB on RapidAPI?",
        "a": "No. They share a name but are different things. The most-cited 'ExerciseDB' is a commercial listing distributed through RapidAPI, while exercisedb.dev is a separate hosted API with its own paid plans; its GitHub repository carries an AGPL-3.0 license file but, as of October 12, 2026, no code to self-host. The name overlap is a common source of confusion, so confirm which one a tutorial or SDK is referring to before you integrate."
      },
      {
        "q": "What is the best free and open ExerciseDB alternative?",
        "a": "It depends on your license and media needs. free-exercise-db is public domain (the most permissive here) with 800+ exercises as JSON and images, but it is a static dataset, not a live API. wger is free and self-hostable but AGPL-3.0, which is copyleft and carries obligations if you embed it in a closed-source product. exercisedb.dev is not a free self-hosted option: as of October 12, 2026 its repository holds only a README and a license file, and production use runs on its paid plans."
      },
      {
        "q": "Which ExerciseDB alternative has exercise GIFs or video?",
        "a": "exercisedb.dev advertises a large catalog with GIFs, images and video, served from its hosted API on paid plans, which makes it the closest match to the RapidAPI version's media. free-exercise-db provides images rather than GIF or video, and API Ninjas Exercises is metadata-only with no media at all. wger's open-source code supports exercise videos with a license on each one if you self-host, but as of October 12, 2026 we could not check how many videos its public instance carries. Verify current media availability at the source before relying on it."
      },
      {
        "q": "Can I self-host exercise data instead of using RapidAPI?",
        "a": "Yes, with wger or free-exercise-db. wger is a self-hostable open-source platform with a REST API (AGPL-3.0), and free-exercise-db lets you vendor a public-domain JSON dataset and images directly into your app. exercisedb.dev is not a self-host option: as of October 12, 2026 its repository contains only a README and a license file. Self-hosting removes gateway rate limits and pricing exposure but means you host and maintain the data yourself."
      },
      {
        "q": "Do I need to worry about the AGPL license?",
        "a": "If you embed AGPL-3.0 code or a modified AGPL service in a product you distribute or offer over a network, the copyleft terms can require you to make source available. wger is AGPL-3.0, so review the obligations for your specific use before shipping; exercisedb.dev is used as a hosted API under its own terms of use, which we could not read. free-exercise-db (public domain) avoids this entirely, and API Ninjas is a hosted service with its own terms. This is not legal advice — verify with counsel."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/integrate/exercisedb-api",
        "label": "How to integrate ExerciseDB"
      },
      {
        "href": "/fitness-apis/free-fitness-apis",
        "label": "Free & open-source fitness APIs"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "We break down a fitness or exercise-data API every week — licensing gotchas, media coverage, and self-hosting trade-offs included — so subscribe and skip the surprises."
    }
  },
  {
    "slug": "kinestex-alternatives",
    "primaryQuery": "kinestex alternatives",
    "h1": "KinesteX Alternatives, From the Team Behind KinesteX (2026)",
    "metaTitle": "KinesteX Alternatives (2026): The Vendor's Own Honest List",
    "metaDescription": "KinesteX funds this site; this page lists its alternatives anyway: Sency, QuickPose, Kemtai and free pose models, each tied to a verified reason to switch.",
    "updated": "2026-10-18",
    "answer": "The verifiable alternatives to KinesteX (this site's own product) are Sency, a native SDK with a no-UI kit and a branded UI kit for iOS, Android, React Native and Flutter; QuickPose, a MediaPipe-based toolkit with exercise counters, range-of-motion measurement and a published per-device price list; Kemtai for clinical rehab, which describes an FDA listing and CE marking; and free pose models such as MediaPipe, MoveNet, Apple Vision or ML Kit if you want to own the whole stack. Route by your reason to switch: an in-process native SDK points to Sency or QuickPose, a price you can read before a call to QuickPose or Sency, owning the computer-vision layer to the pose models, and clinical scope to Kemtai.",
    "faqs": [
      {
        "q": "Why would a KinesteX-funded site publish a KinesteX alternatives page?",
        "a": "Because the alternative is worse: pretending no alternatives exist, which no developer believes. This site is run by the team behind KinesteX and says so in the first line. The page earns its keep by being method-bound: every claim, including claims about KinesteX itself, is limited to what public repositories, package registries, model documentation and the vendors' own pages show, and anything we could not verify is labelled as unverified rather than described from search snippets."
      },
      {
        "q": "What is the most direct competitor to KinesteX?",
        "a": "Sency, based on what is publicly verifiable. Its repositories document a similar two-tier shape, a white-label branded UI kit plus a no-UI custom kit, across iOS, Android, React Native and Flutter, with assessments and workout plans. The key architectural difference is the integration surface: Sency's SMKit is a native no-UI SDK that runs in your process, while KinesteX's repositories describe WebView and iframe wrappers around a hosted experience. Sency has no web target and a proprietary licence, downloads its models from its server at configuration, and publishes per-user prices on two pages that disagree about the first 100 users."
      },
      {
        "q": "Which KinesteX alternative can I try without talking to sales?",
        "a": "QuickPose is the self-serve option: its README says to get a free SDK key at dev.quickpose.ai, with usage limits that may apply, and its pricing page lists every plan from a free tier for 10 monthly active devices upward. Sency's packages page lists a free Starter plan, but its README says the API key arrives by email after you subscribe to a plan, and its sign-up path runs through a contact form. KinesteX starts with a contact form. The fully gate-free path is Apple Vision or the open pose models, which need no key at all."
      },
      {
        "q": "If I leave KinesteX for raw pose models, what am I signing up to build?",
        "a": "A pose model gives you per-frame keypoints and nothing else. To match a commercial fitness SDK you build per-exercise form rules and phase detection, rep-counting state machines, mistake-to-feedback content, calibration and framing UX, an exercise library with plans and progression, analytics events, and cross-device robustness across lighting, thermals, and model variants. The models themselves are free and fitness-targeted by Google's own documentation; the exercise intelligence and content are the real product you are taking on."
      },
      {
        "q": "Is Kemtai a verified alternative to KinesteX for physio and rehab?",
        "a": "Its offering is now verifiable from its own site, which describes embeddable exercise and patient-management components, data APIs, a library of more than 2,000 exercises, processing on the device with no video recorded, and an FDA listing and CE marking as a medical device. Its accuracy claim rests on a validation study it describes but we have not read, its API documentation is behind an email request, and it publishes no prices. If your product is clinical, verify the regulatory status and the study with Kemtai directly."
      }
    ],
    "cta": {
      "pitch": "We publish what the repos actually show — for our own product and everyone else's. Get the update when a vendor in this category changes its SDK, license, or access model."
    },
    "body": "**Disclosure: this site is run by the team behind KinesteX, and KinesteX funds this site. You are reading a \"KinesteX alternatives\" page written by the vendor it lists alternatives to. Every claim below is restricted to what we could verify from public GitHub repositories, package registries, model documentation and each vendor's own published pages — including the claims about our own product — and the things we could not verify are labelled as such.** The disclosure is also checked mechanically: [the automated checks this site runs before every deploy](/gates) refuse any page that links to the site's funder without one.\n\nNobody expects a vendor-funded site to publish this page, so here is the deal that makes it worth your time: we name the real, verifiable reasons a team would decide against KinesteX, and we route each reason to the alternative that actually fits it. The sections below are organized by your reason for switching, not by who we would prefer you pick. For what this site has verified about KinesteX access in one place, see the [KinesteX API overview](/apis/kinestex).\n\n## The verified reasons people switch away from KinesteX\n\nThese are not hypothetical objections. Each one traces to KinesteX's own repositories or pages, so you can check them yourself at [github.com/KinesteX](https://github.com/KinesteX) and kinestex.com.\n\n**The integration surface is a WebView, not an in-process native library.** The KinesteX AI Kit README describes itself as \"a SwiftUI package that embeds KinesteX's AI-powered camera workout experience as a WebView\". The React Native SDK installs alongside `react-native-webview`, the web integration is an iframe communicating over `postMessage`, and the Android installation docs ask for the `INTERNET` permission. That architecture is what makes the SDK thin and cross-platform, but if your requirement is in-process inference, with direct access to camera frames, your own rendering pipeline and no hosted web surface inside your app, it is a structural mismatch, not something a version bump will change.\n\n**You want to own the computer-vision layer outright.** KinesteX's custom tier is its camera component plus `postMessage` events: reps, mistakes, accuracy and workout summaries. If motion analysis is your core IP and you want the raw keypoints, your own exercise logic and eventually your own models, you are shopping in a different layer of the stack, and the honest answer is a pose-estimation model, not any commercial fitness SDK.\n\n**No published prices, and access starts with a contact form.** KinesteX's FAQ describes usage-based plans priced per active user per month, with lower rates at higher tiers and integration fees that may apply, but gives no figure, and demo access and an API key come through a contact form. Two direct competitors now publish prices, QuickPose per monthly active device and Sency per monthly active user, so if you need a number before a call, that alone is a valid reason to look elsewhere.\n\n**Our on-device statements do not match each other.** The SDK READMEs say KinesteX \"ensures data security with optional edge processing (no cloud transmission)\", while KinesteX's security page says \"All camera and vision processing stays on-device\" and that its cloud delivers content and AI models. If your compliance posture needs an unconditional on-device guarantee, get the behaviour of your configuration from KinesteX in writing, or use a stack where inference verifiably runs in your own process.\n\n**You ship one platform.** KinesteX's breadth (iOS, Android, React Native, Flutter and the web) is a cost, not a benefit, if you ship one platform. An iOS-first team can get closer to the metal with QuickPose or Apple's own Vision framework.\n\nFor balance, the verified reasons people stay: the same sources show broad platform coverage including the web, plug-and-play workout, plan, challenge and leaderboard views, a content API, a documented set of movement assessments with risk-level outputs (Timed Up and Go, gait speed, sit-to-stand variants, the Functional Reach Test and balance stands), white-label theming, and active maintenance, with the Kotlin repository pushed on October 14, 2026 and kinestex-sdk-react-native 1.4.1 published on October 9, 2026. If none of the switch reasons above apply to you, the switching cost may not buy you anything.\n\n## The alternatives, by reason to switch\n\n### You want a native, in-process SDK with assessments and plans → Sency\n\nSency is the strongest verifiable direct competitor. Its [public repositories](https://github.com/sency-ai) document two kits: SMKitUI, a white-label Branded Kit where \"the entire user interface and experience are ready to use\", and SMKit, which its version table calls a \"Native no-UI SDK\", where you own the camera preview and UI. The README leads with movement and fitness assessments, monthly progress evaluations and personalized workout plans, across iOS, Android, React Native and Flutter, with JavaScript and Unity marked \"NA\". The Custom Kit's iOS demo pins iOS 16.0 and SMKitUI needs iOS 15 or later. Its iOS and Android SDKs download their models from Sency's server during configuration, with no bundled fallback, though Sency's FAQ says data is analyzed on the user's device and never sent to the cloud. The licence is Sency's own Terms of Use, which puts commercial or production use under a separate paid agreement. Sency publishes prices per monthly active user, though on two pages that disagree about the first 100 users: one lists a free Starter plan and a Growth plan from $499 a month, the other a free trial followed by a minimal monthly fee.\n\nTrade-offs against KinesteX: no web target (KinesteX has one), a higher iOS floor, a proprietary licence, and models fetched at first configuration. The full head-to-head is at [KinesteX vs Sency](/compare/kinestex-vs-sency), the plans are in [Sency pricing](/pricing/sency-pricing), and [Sency alternatives](/alternatives/sency-alternatives) maps the field from Sency's side.\n\n### You want pose building blocks with a published price list → QuickPose\n\nQuickPose sits one layer down the stack. Its [iOS SDK repository](https://github.com/quickpose/quickpose-ios-sdk) describes \"developer-oriented cutting edge ML features of MediaPipe and BlazePose\" for \"pose estimation, skeleton tracking and fitness counting\", and its Swift package ships MediaPipe lite, full and heavy libraries as modules; its product pages say all inference runs on the device. The README documents joint overlays, range-of-motion measurement for shoulders, hips, knees, back and neck, and counters for 20 named exercises, on iOS 14.0 or later; its docs add Android from API 26, and a React Native plugin covers both. The key is free to register (\"usage limits may apply\"), and QuickPose publishes its SDK plans per monthly active device, free for 10 and then $25 to $1,000 a month up to 100,000, with every feature on every plan. The iOS repository is Apache-2.0, and QuickPose's terms license the SDK under Apache 2.0 subject to the agreement and its fees, so treat it as a keyed commercial SDK with open wrapper code, not as open source.\n\nWhat QuickPose does not give you: workout content, plans, prebuilt coaching UX or assessments. Everything above the keypoint-and-counter layer is yours to build, which makes it the middle path between buying a full experience and building from raw models. Details in [KinesteX vs QuickPose](/compare/kinestex-vs-quickpose) and [QuickPose pricing](/pricing/quickpose-pricing).\n\n### You want to own the whole stack → MediaPipe, MoveNet, Apple Vision or ML Kit\n\nIf the WebView objection is really an ownership objection, skip commercial SDKs entirely and build on a free pose model:\n\n- **MediaPipe Pose Landmarker (BlazePose GHUM)** — 33 landmarks with estimated 3D world landmarks in meters, three model sizes (lite, full and heavy), Apache-2.0, and Google's model card names \"fitness and repetition counting\" as an intended domain. The strongest choice when form feedback needs joint angles that survive viewpoint changes. See [KinesteX vs MediaPipe](/compare/kinestex-vs-mediapipe) and [MediaPipe alternatives](/alternatives/mediapipe-alternatives).\n- **MoveNet** — 17 COCO keypoints in 2D, tuned per its model card for fitness and fast movement, with a MultiPose variant documented to detect up to 6 people. Apache 2.0 on the SinglePose card. The lean choice for rep counting; see [MoveNet models](/motion/movenet-models).\n- **Apple Vision body pose** — an OS framework with no SDK key and no vendor: 19 2D joints from iOS 14, 3D joints from iOS 17. The natural pick for the iOS-only team that wants no third-party dependency; see [Apple Vision body pose](/motion/apple-vision-body-pose).\n- **ML Kit Pose Detection** — 33 landmarks on Android and iOS for one person, offered in beta without an SLA; see [ML Kit pose detection](/motion/ml-kit-pose-detection).\n\nThe honest cost: a pose model outputs per-frame keypoints and nothing else. To reach parity with what KinesteX or Sency ship, you build per-exercise form rules and phase detection, rep-counting state machines, mistake-to-feedback mapping, calibration and framing UX, an exercise and content library, analytics plumbing, and cross-device robustness. The pose model is free; the exercise intelligence, content and UX are the product. Work through [build vs buy for AI motion tracking](/motion/build-vs-buy-ai-motion-tracking) before committing, then the implementation set: [camera pose tracking](/guides/camera-pose-tracking), [rep counting](/guides/add-rep-counting) and [form feedback](/guides/add-form-feedback).\n\n### You need a clinical or physiotherapy focus → Kemtai, and a look at Exer AI\n\n**Kemtai** positions itself for regulated rehab work, and its own site, read on October 17, 2026, describes embeddable exercise and patient-management components, data APIs that return exercise scores and range-of-motion results, a library of more than 2,000 exercises, processing on the device with no video recorded, and an FDA listing and CE marking as a medical device. It says its accuracy was validated in a study against a gold-standard motion lab that used 10 3D cameras and body sensors, which is a vendor statement about a study to ask to see. Two of its own pages disagree on how many body points it tracks, 111 on its home page and 113 on its computer-vision page. Its API documentation is behind an email request, it publishes no prices, and the pages we read route buyers to a demo request.\n\n**Exer AI** is a clinical platform rather than a developer SDK, on the pages we read: Exer Scan, Exer Health and Exer Hands for providers in orthopedics, senior care, neurology and rehab, a technology page saying everything runs on the edge on common laptops, phones and tablets, and a demo request. If you are building a clinical product of your own rather than buying one, it may not fit; if you are a provider, it may fit better than any SDK here.\n\nOther names circulate in listicles for this category. We list only vendors whose own pages or repositories we could read in this pass.\n\n## What we verified, and where\n\nThis table is the page's spine. Anything not in the \"verified\" column is something we are not claiming.\n\n| Vendor | What we verified | From where | What we could not verify |\n| --- | --- | --- | --- |\n| KinesteX | WebView and iframe surface; iOS, Android, React Native, Flutter and web; rep, mistake and accuracy events; assessment suite; Apache-2.0 on repos that carry a LICENSE file; per-active-user pricing model with no figures; two different on-device statements | [github.com/KinesteX](https://github.com/KinesteX), npm, pub.dev, kinestex.com | Prices; which on-device statement governs a given configuration; accuracy |\n| Sency | No-UI kit and branded UI kit; iOS, Android, React Native and Flutter (JavaScript and Unity \"NA\"); iOS 16 and 15 floors; server-downloaded models; Terms of Use licence; per-user plans on two pages | [github.com/sency-ai](https://github.com/sency-ai), npm, pub.dev, sency.ai | Which pricing page applies to the first 100 users; how the Growth base and per-user rate combine; accuracy |\n| QuickPose | MediaPipe and BlazePose toolkit; iOS 14, Android API 26, React Native; range of motion and 20 exercise counters; free key; per-device plans; Apache-2.0 iOS repo under fee-bearing terms | [github.com/quickpose](https://github.com/quickpose), npm, docs.quickpose.ai, quickpose.ai | The Wasm SDK its docs home mentions; accuracy |\n| MediaPipe and MoveNet | Landmark counts, variants, licences, fitness positioning, MoveNet MultiPose's 6-person limit | Google's model cards and repositories ([mediapipe](https://github.com/google-ai-edge/mediapipe), [tfjs-models](https://github.com/tensorflow/tfjs-models)) | Behaviour on your exercises |\n| Apple Vision | 19 2D joints from iOS 14, 3D joints from iOS 17 | Apple developer documentation | Accuracy figures (none published in the pages we read) |\n| ML Kit | 33 landmarks, one person, beta without an SLA | Google's ML Kit guide | Accuracy figures |\n| Kemtai | Embeddables, data APIs, 2,000+ exercises, edge processing, FDA listing and CE marking, a validation study claim | kemtai.com | API docs (email-gated); prices; the study itself |\n| Exer AI | Clinical products for providers; edge processing; demo request | exer.ai | Any developer SDK or API |\n\n## Routing by reason\n\n- **In-process native SDK, assessments and plans, willing to buy** → Sency.\n- **Keypoints plus counters and measurements, a price you can read today, self-serve key** → QuickPose.\n- **Motion analysis is your IP, or you need on-device processing you control** → MediaPipe, MoveNet, Apple Vision or ML Kit, plus the build cost above.\n- **Clinical or PT product** → Kemtai, with every regulatory and accuracy claim verified first-hand, and compare against building on MediaPipe with clinical logic you own.\n- **None of the switch reasons apply** → staying is a legitimate answer; the [AI workout tracking APIs overview](/fitness-apis/ai-workout-tracking-apis) maps the whole category if you want the wider view before deciding.\n\n## Is switching easy?\n\nCode-wise, leaving KinesteX is unusually cheap: the integration is a thin WebView or iframe wrapper plus event handlers, so there is little SDK surface to rip out. What is not cheap is replacing what the hosted experience did for you: the workout content, coaching UI, feedback logic and assessments all lived on KinesteX's side of the WebView. Moving to Sency means re-integrating a native SDK and, on its Custom Kit, owning the UI; moving to QuickPose or raw pose models means owning everything above the keypoints. Budget for rebuilding the experience, not for deleting the wrapper.\n\n*Everything above reflects public repositories, registries and vendor pages as read on October 17 and 18, 2026. Vendors change pages, prices and repositories without notice, so confirm current terms with each vendor before you commit.*",
    "related": [
      {
        "href": "/compare/kinestex-vs-sency",
        "label": "KinesteX vs Sency"
      },
      {
        "href": "/compare/kinestex-vs-quickpose",
        "label": "KinesteX vs QuickPose"
      },
      {
        "href": "/compare/kinestex-vs-mediapipe",
        "label": "KinesteX vs MediaPipe"
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
        "href": "/fitness-apis/ai-workout-tracking-apis",
        "label": "Best AI workout tracking APIs"
      }
    ],
    "firstParty": true,
    "sources": [
      {
        "url": "https://github.com/KinesteX",
        "checked": "2026-10-17",
        "note": "repositories, licences, push dates"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-AI-Kit",
        "checked": "2026-10-17",
        "note": "WebView architecture"
      },
      {
        "url": "https://github.com/KinesteX/.github",
        "checked": "2026-10-17",
        "note": "events, assessments with risk levels"
      },
      {
        "url": "https://github.com/KinesteX/KinesteX-SDK-Kotlin",
        "checked": "2026-10-17",
        "note": "optional edge processing line; pushed 2026-10-14"
      },
      {
        "url": "https://www.npmjs.com/package/kinestex-sdk-react-native",
        "checked": "2026-10-17",
        "note": "1.4.1 on 2026-10-09"
      },
      {
        "url": "https://www.kinestex.com/docs",
        "checked": "2026-10-17",
        "note": "platforms, contact-form access (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs/installation.md?lang=kotlin",
        "checked": "2026-10-17",
        "note": "react-native-webview, INTERNET permission (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-10-17",
        "note": "pricing model (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/security",
        "checked": "2026-10-17",
        "note": "on-device statement, model delivery (snapshot)"
      },
      {
        "url": "https://github.com/sency-ai/smkit-sdk",
        "checked": "2026-10-17",
        "note": "kits, platform table, features, key by email, Terms of Use LICENSE"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ios-demo",
        "checked": "2026-10-17",
        "note": "iOS 16.0, server-downloaded models"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ui-ios-demo",
        "checked": "2026-10-17",
        "note": "SMKitUI iOS 15 or later"
      },
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-10-18",
        "note": "Starter and Growth plans (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/pricing",
        "checked": "2026-10-17",
        "note": "trial and minimal monthly fee (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/faq-motion-tracking",
        "checked": "2026-10-18",
        "note": "on-device processing claim (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://github.com/quickpose/quickpose-ios-sdk",
        "checked": "2026-10-17",
        "note": "description, modules, features, iOS 14.0, free key, Apache-2.0"
      },
      {
        "url": "https://docs.quickpose.ai/docs/MobileSDK",
        "checked": "2026-10-17",
        "note": "Android API 26 (snapshot)"
      },
      {
        "url": "https://quickpose.ai/sdk-pricing/",
        "checked": "2026-10-17",
        "note": "plans by monthly active device (snapshot)"
      },
      {
        "url": "https://quickpose.ai/products/android-sdk/",
        "checked": "2026-10-17",
        "note": "on-device inference (snapshot)"
      },
      {
        "url": "https://quickpose.ai/terms-and-conditions/",
        "checked": "2026-10-17",
        "note": "Apache 2.0 clause and fees (snapshot)"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-17",
        "note": "33 landmarks, fitness domain, Apache-2.0"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.SinglePose%20Model%20Card.pdf",
        "checked": "2026-10-17",
        "note": "fitness and fast movement, Apache 2.0"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.MultiPose%20Model%20Card.pdf",
        "checked": "2026-10-17",
        "note": "up to 6 people"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vnhumanbodyposeobservation/jointname",
        "checked": "2026-10-18",
        "note": "19 2D joints; the 3D request from iOS 17"
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection",
        "checked": "2026-10-17",
        "note": "one person, 33 landmarks, beta, no SLA"
      },
      {
        "url": "https://kemtai.com/",
        "checked": "2026-10-17",
        "note": "exercises, edge processing, regulatory and validation claims, 111 points, API docs by email (snapshot)"
      },
      {
        "url": "https://kemtai.com/kemtai-api-and-embeddables/",
        "checked": "2026-10-17",
        "note": "embeddables and data APIs (snapshot)"
      },
      {
        "url": "https://kemtai.com/our-computer-vision/",
        "checked": "2026-10-17",
        "note": "113 body points (snapshot)"
      },
      {
        "url": "https://www.exer.ai/",
        "checked": "2026-10-17",
        "note": "clinical products, demo request (snapshot)"
      },
      {
        "url": "https://www.exer.ai/tech",
        "checked": "2026-10-17",
        "note": "edge processing (snapshot)"
      }
    ]
  },
  {
    "slug": "human-api-alternatives",
    "primaryQuery": "Human API alternatives",
    "h1": "Human API Alternatives for Wearable, Lab and Medical-Record Data (2026)",
    "metaTitle": "Human API Alternatives (2026): Wearable and EHR Data APIs",
    "metaDescription": "Human API is now a LexisNexis product with no public price. Alternatives as of October 2026 for wearable data, medical records and lab results.",
    "updated": "2026-10-17",
    "answer": "Human API is now sold under the LexisNexis name: as of October 17, 2026, humanapi.co redirects to LexisNexis Health Intelligence, an EHR platform for life insurance underwriting described as formerly Human API Health Intelligence, and LexisNexis Human API is offered to healthcare and life science organizations through a contact form, with no public price. For wearable and app data, the alternatives with public pages are aggregators such as Terra, Junction, Rook, Spike, Thryve, Sahha and Validic, or self-hosted Open Wearables. For medical records, Metriport serves covered entities requesting for treatment, and Spike says it accesses clinical data; for labs, Junction and Terra order tests while Rook and Spike parse existing reports.",
    "body": "If you are looking for Human API as a developer API you can sign up for and price online, the first thing to know is what it has become. As we read the pages on October 17, 2026, humanapi.co redirects to a LexisNexis product page, and neither that page nor the LexisNexis Human API page shows a price or a self-serve sign-up. The alternatives below are the vendors with public developer pages, grouped by the data you were using Human API for. Everything is from their own pages as of that date.\n\n## What Human API is now\n\nTwo LexisNexis products carry the name:\n\n- **LexisNexis Health Intelligence**, where humanapi.co now lands, is for life insurers: \"Fast-track underwriting decisions with the EHR for life insurance platform built for adoption at scale\". The page calls it \"Health Intelligence, formerly Human API Health Intelligence\", and says that when an EHR is not available, \"Our solution automatically fulfills the request for an APS through our affiliate, Human API, Inc.\"\n- **LexisNexis Human API** is pitched to healthcare and life science organizations. Its page says \"LexisNexis® Human API™ combines a vast consumer-permission health data network\" with \"a vast data network of over 30,000 data connections including medical records, labs, fitness wearables and apps\", aimed at uses such as clinical research: \"Clinical trial sites can conduct more efficient patient screening to improve site confidence in referrals\". The call to action is \"Contact Us For More Information\".\n\nHuman API's developer reference describes a \"Health Intelligence Platform\" that \"converts data into actionable intelligence to accelerate underwriting and create better customer and distribution experiences.\" If you are an insurer or a research sponsor, that may be exactly what you need. If you built a consumer or digital health product on Human API, read on.\n\n## Pick by the data you need\n\n### Wearable and fitness-app data\n\nThis is the most crowded part of the market, and most vendors now publish an entry price:\n\n- **Terra** says \"One API call returns standardised data from 500+ providers\" and starts at $399 a month billed annually, with credits per connected data source.\n- **Junction** (formerly Vital) has a Launch plan for \"a flat $300 a month\" covering up to 500 connected users.\n- **Rook** prices by active users, from Core at $399 a month for up to 750.\n- **Spike** connects \"500+ wearables & IoT sensors\"; its Sandbox \"Starts from $450 /month\".\n- **Thryve** starts at 499 euros a month for 500 users, and \"All data processed and stored by Thryve is hosted in Germany\".\n- **Sahha** is phone-first (\"turns the smartphone itself into a passive sensor for sleep, activity, and behavior\"), from $299 a month billed annually.\n- **Validic**, now owned by ChartSpan, \"normalizes 700+ devices into a single standard\" and has a free Inform Developer plan for 5 users.\n- **Open Wearables** is MIT-licensed software you host yourself, \"Free forever\" for the open-source core.\n\nOur [health-data aggregator comparison](/fitness-apis/health-data-aggregator-apis) covers coverage, credentials and delivery for each, and [aggregator pricing](/pricing/health-data-aggregator-pricing) runs the same user counts through their price sheets.\n\n### Medical records\n\nFewer options have public pages, and the legal basis matters:\n\n- **Metriport** offers \"Healthcare data infrastructure for next generation care delivery\", with \"750K+ providers across every network that matters — one integration, not dozens\", records \"Extracted, normalized, deduplicated, and enriched into consistent FHIR\", and a codebase \"Distributed under the AGPLv3 License\". Its README says it \"is HITRUST r2 certified, SOC 2 Type 2 certified, and HIPAA compliant.\" The catch for a consumer product: \"Access to our Medical API will require you to make requests on behalf of a covered entity with an NPI number for a valid Treatment purpose of use.\" Human API's network is described as consumer-permission; Metriport's access is for treatment by a covered entity.\n- **Spike** says it delivers \"normalized, ingestion-ready data from wearables, EMRs, lab tests, IoT devices, and more\", and to \"Connect to top providers and access clinical data\". Its pages do not itemize EMR pricing.\n- **Rook** sends data the other way today: its EHR/EMR API \"delivers each user's health data as FHIR R4, with LOINC codes and UCUM units, ready to integrate into clinical systems\", while \"Bringing data from EHRs, EMRs, patient portals, and health networks into ROOK is coming soon.\"\n- **Validic** runs \"Managed remote care programs that write directly to Epic, Cerner, and other EHRs.\"\n\n### Lab results\n\n- **Order tests:** Junction can \"build your own lab testing experience spanning all 50 states\", with \"Lab testing is part of Enterprise\"; Terra can \"Order blood and DNA tests for your users through Terra API\", in the US and the UK.\n- **Read reports users already have:** Rook's Lab Data API \"turns PDF and image lab reports into structured biomarkers with LOINC codes and FHIR R4 output\", and Spike's Lab Reports API \"processes lab reports from PDFs, JPEGs, or PNG files up to 10MB\".\n\n## At a glance\n\n| Alternative | Data | Published entry price | Watch out |\n| --- | --- | --- | --- |\n| Terra | Wearables, apps, lab ordering | $399 a month billed annually | Credits per connected source |\n| Junction | Wearables, US lab ordering | $300 a month flat, up to 500 users | Labs and BAA on Enterprise |\n| Rook | Wearables, medical devices, lab reports | $399 a month for 750 active users | 12-month standard contract |\n| Spike | Wearables, IoT, EMR, lab reports, nutrition | From $450 a month | Announced acquisition by Raintree Systems |\n| Thryve | Wearables, hosted in Germany | From 499 euros a month | 2 weeks of storage on Start Up |\n| Sahha | Phone-first signals and scores | $299 a month billed annually | Cloud integrations in beta |\n| Validic | Remote-monitoring devices into the EHR | Free developer plan for 5 users | Negotiated Enterprise for production |\n| Open Wearables | Self-hosted wearable data | Free, MIT licence | You register with every provider |\n| Metriport | Medical records | Not published; book an intro call | A covered entity with an NPI, for treatment |\n\n## Migrating off Human API\n\nPlan for three things. Every user re-consents through the new vendor's connect flow, because their authorizations were granted to Human API. Records data may change legal basis, from a consumer-permission network to treatment access through a covered entity, which is a question for your counsel rather than your engineers. And every vendor normalizes into its own schema, so budget for re-mapping fields.\n\n## What we could not verify\n\n- **Developer access to LexisNexis Human API.** Its page lists \"fitness wearables and apps\" in its network but shows no developer sign-up or price; ask LexisNexis whether a non-insurance, non-research product can buy it.\n- **Prices behind a sales call:** Human API, Metriport, Spike past its Sandbox start, and every vendor's Enterprise plan.\n\n*Prices, plans and products above are from October 17, 2026 and change often; re-check each vendor's live pages before you commit.*",
    "faqs": [
      {
        "q": "What happened to Human API?",
        "a": "It now sits under LexisNexis. As of October 17, 2026, humanapi.co redirects to LexisNexis Health Intelligence, which the page calls formerly Human API Health Intelligence, an EHR platform for life insurance underwriting, and that page refers to Human API, Inc. as an affiliate. LexisNexis also sells LexisNexis Human API, a consumer-permission health data network, to healthcare and life science organizations. Neither page shows a price or a self-serve sign-up."
      },
      {
        "q": "What is the best Human API alternative for wearable data?",
        "a": "It depends on your billing unit, hosting and sources. As of October 17, 2026, Junction's Launch plan is a flat $300 a month for up to 500 connected users, Sahha's Starter is $299 a month billed annually for 1,000 users, Terra and Rook start at $399 a month, Spike from $450, and Thryve from 499 euros with hosting in Germany. Validic has a free developer plan and Open Wearables is free software you host. Compare them at your own user count."
      },
      {
        "q": "Can a consumer health app use Metriport instead of Human API for medical records?",
        "a": "Not on its own. Metriport's docs say access to its Medical API requires making requests on behalf of a covered entity with an NPI number for a valid treatment purpose of use, and production access starts with an intro call. Human API's network is described as consumer-permission. If you are not a covered entity, you would need one as a partner, and that is a question for counsel. This reflects the pages we read on October 17, 2026."
      },
      {
        "q": "Which Human API alternatives handle lab results?",
        "a": "As of October 17, 2026, Junction orders lab tests across all 50 US states on its Enterprise plan and Terra orders blood and DNA tests in the US and the UK. To read reports users already have, Rook's Lab Data API turns PDF and image lab reports into LOINC-coded biomarkers with FHIR R4 output, and Spike's Lab Reports API reads PDFs, JPEGs and PNGs up to 10MB."
      },
      {
        "q": "What should I plan for when migrating off Human API?",
        "a": "Three things: every user re-consents through the new vendor's connect flow, because their authorizations were granted to Human API; medical-record access may move from a consumer-permission basis to treatment access through a covered entity, which needs legal review; and each vendor normalizes into its own schema, so fields need re-mapping. Budget for the re-consent campaign as much as for the code."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Health-data aggregator pricing compared"
      },
      {
        "href": "/alternatives/terra-alternatives",
        "label": "Terra alternatives"
      },
      {
        "href": "/compliance/hipaa-compliance-fitness-app",
        "label": "HIPAA compliance for fitness apps"
      },
      {
        "href": "/alternatives",
        "label": "All fitness & health API alternatives"
      }
    ],
    "cta": {
      "pitch": "We track health-data APIs as they change hands and prices. Subscribe for the next acquisition, rebrand or price change before it breaks your integration."
    },
    "sources": [
      {
        "url": "https://www.humanapi.co/",
        "checked": "2026-10-17",
        "note": "humanapi.co redirects to LexisNexis Health Intelligence"
      },
      {
        "url": "https://risk.lexisnexis.com/products/humanapi",
        "checked": "2026-10-17",
        "note": "LexisNexis Human API"
      },
      {
        "url": "https://reference.humanapi.co/docs/overview",
        "checked": "2026-10-17",
        "note": "Human API developer reference"
      },
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-17",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://www.junction.com/pricing",
        "checked": "2026-10-17",
        "note": "Junction Launch and Enterprise plans"
      },
      {
        "url": "https://www.junction.com/post/series-a",
        "checked": "2026-10-17",
        "note": "Junction rebrand from Vital and Series A"
      },
      {
        "url": "https://tryrook.io/pricing/",
        "checked": "2026-10-17",
        "note": "Rook plans, add-ons and contract terms"
      },
      {
        "url": "https://www.spikeapi.com/",
        "checked": "2026-10-17",
        "note": "Spike scope, implementation engineer and customers"
      },
      {
        "url": "https://www.spikeapi.com/pricing",
        "checked": "2026-10-17",
        "note": "Spike Sandbox and Enterprise plans"
      },
      {
        "url": "https://www.thryve.health/pricing",
        "checked": "2026-10-17",
        "note": "Thryve plans, storage and hosting"
      },
      {
        "url": "https://sahha.ai/",
        "checked": "2026-10-17",
        "note": "Sahha coverage, pricing FAQ and compliance"
      },
      {
        "url": "https://validic.com/news/chartspan/",
        "checked": "2026-10-17",
        "note": "ChartSpan acquisition of Validic"
      },
      {
        "url": "https://validic.com/",
        "checked": "2026-10-17",
        "note": "Validic devices and EHR programs"
      },
      {
        "url": "https://validic.com/inform-signup/",
        "checked": "2026-10-17",
        "note": "Validic Inform plans"
      },
      {
        "url": "https://validic.com/blog/Validic-Inform-Is-Now-Free/",
        "checked": "2026-10-17",
        "note": "Validic Inform free tier"
      },
      {
        "url": "https://openwearables.io/pricing",
        "checked": "2026-10-17",
        "note": "Open Wearables licence and Enterprise"
      },
      {
        "url": "https://github.com/the-momentum/open-wearables",
        "checked": "2026-10-17",
        "note": "Open Wearables README"
      },
      {
        "url": "https://www.metriport.com/",
        "checked": "2026-10-17",
        "note": "Metriport"
      },
      {
        "url": "https://github.com/metriport/metriport",
        "checked": "2026-10-17",
        "note": "Metriport README and licence"
      },
      {
        "url": "https://docs.metriport.com/medical-api/getting-started/quickstart",
        "checked": "2026-10-17",
        "note": "Metriport Medical API access"
      },
      {
        "url": "https://tryrook.io/rookconnect/ehr-emr-api/",
        "checked": "2026-10-17",
        "note": "Rook EHR/EMR API"
      },
      {
        "url": "https://www.junction.com/",
        "checked": "2026-10-17",
        "note": "Junction devices and lab network"
      },
      {
        "url": "https://tryterra.co/products/lab-testing",
        "checked": "2026-10-17",
        "note": "Terra lab testing geography and collection methods"
      },
      {
        "url": "https://tryrook.io/rookconnect/lab-data-api/",
        "checked": "2026-10-17",
        "note": "Rook Lab Data API"
      },
      {
        "url": "https://www.spikeapi.com/lab-reports",
        "checked": "2026-10-17",
        "note": "Spike Lab Reports API"
      },
      {
        "url": "https://www.spikeapi.com/integrations",
        "checked": "2026-10-17",
        "note": "Spike integrations and acquisition banner"
      },
      {
        "url": "https://docs.sahha.ai/docs/connect/integrations",
        "checked": "2026-10-17",
        "note": "Sahha cloud integrations beta"
      },
      {
        "url": "https://openwearables.io/docs/providers/supported",
        "checked": "2026-10-17",
        "note": "Open Wearables provider setup"
      }
    ]
  },
  {
    "slug": "mediapipe-alternatives",
    "primaryQuery": "mediapipe alternatives",
    "h1": "MediaPipe Pose Alternatives, Matched to the Reason You Need One",
    "metaTitle": "MediaPipe Pose Alternatives (2026): Models and SDKs",
    "metaDescription": "Alternatives to MediaPipe Pose Landmarker by reason: MoveNet for fast 2D, Apple Vision, ML Kit, YOLO26 or OpenPose for groups, or an SDK with rep logic.",
    "updated": "2026-10-18",
    "answer": "The best MediaPipe Pose Landmarker alternative depends on what MediaPipe does not do for you. For faster 2D tracking use MoveNet, for an iOS-native API Apple Vision, for a Google-maintained mobile SDK ML Kit Pose Detection, and for several people in one frame Ultralytics YOLO pose (AGPL-3.0), MoveNet MultiPose, RTMPose or OpenPose (noncommercial only), since Google's model card scopes MediaPipe's pose model to one person. If you want rep counting and feedback built for you, commercial SDKs such as QuickPose, which is itself built on MediaPipe, add that layer.",
    "body": "MediaPipe Pose Landmarker is a strong default, so most teams that look for an alternative have one specific reason. This page names the reasons the primary sources support and routes each to the model or product that fits. Model facts come from each project's own repository, model card or documentation as read on October 17, 2026. **Disclosure: this site is funded by KinesteX, which sells a commercial motion SDK; it appears once below, in the commercial group, labelled as ours.**\n\n## What MediaPipe gives you\n\n- **33 landmarks per person**, each with x, y, z, visibility and presence, plus world landmarks that MediaPipe's documentation describes as \"real-world 3D coordinates in meters with the origin at the center between hips\".\n- **Three model sizes**, lite, full and heavy, as `.task` bundles from Google's model bucket, the same 33-point output from each; [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models) covers the trade.\n- **The Tasks API on Android, iOS, web and Python**, running on the device.\n- **Apache-2.0** for the framework and, per Google's BlazePose GHUM model card, the models. No key and no fee.\n\n## Why teams look elsewhere\n\n- **More than one person in frame.** Google's model card says the model \"tracks only one person on scene if multiple present\" and lists multiple people as out of scope. The Tasks API does have a `num_poses` option, documented as \"the maximum number of poses can be detected by the PoseLandmarker\" with a default of 1, but the model card does not evaluate several people, so treat a raised value as something to test, not a supported mode.\n- **Distance and depth.** The card lists people further than about 14 feet or 4 meters as out of scope, and says z \"is not metric but up to scale\". Apps that need metric depth or a subject far from the camera have to look elsewhere.\n- **Frozen weights.** The three `.task` files Google serves were last modified in April 2023, and the older MediaPipe Pose solution was retired in favour of the Tasks version on May 10, 2023. Stability is a virtue, but nothing suggests the model will improve.\n- **Lighter 2D on weak hardware or in a browser**, where MoveNet's single-person models are smaller targets.\n- **Keypoints are not a product.** Rep counting, form feedback, calibration and exercise content are all yours to build on top. Some teams would rather buy that layer.\n\n## The alternatives, by reason\n\n### Faster 2D tracking: MoveNet\n\nMoveNet SinglePose Lightning (192x192 input) is tuned for latency and Thunder (256x256) for accuracy, both outputting the 17 COCO keypoints; Google's card targets the browser through TensorFlow.js and devices through TensorFlow Lite, for one person 3 to 6 feet from the camera. The SinglePose card says \"Licensed Under Apache License, Version 2.0\". You lose MediaPipe's 3D world landmarks and the extra face, hand and foot points. See [MoveNet models](/motion/movenet-models) and the [MediaPipe vs MoveNet head-to-head](/compare/mediapipe-vs-movenet).\n\n### An iOS-native API: Apple Vision\n\n`VNDetectHumanBodyPoseRequest` returns 19 named 2D joints from iOS 14, and `VNDetectHumanBodyPose3DRequest` returns 3D joints relative to the camera from iOS 17, with no model file to ship and nothing to license. Apple publishes no model card or accuracy figures. See [Apple Vision body pose](/motion/apple-vision-body-pose).\n\n### A Google-maintained mobile SDK: ML Kit Pose Detection\n\nML Kit returns 33 landmarks on Android and iOS from a bundled library, in a base and an accurate SDK. Google's guide says \"Pose detection can only detect one person in an image\" and that the API \"is offered in beta, and is not subject to any SLA or deprecation policy\". It is governed by Google's terms rather than an open-source licence. See [ML Kit pose detection](/motion/ml-kit-pose-detection).\n\n### Several people at once\n\n- **Ultralytics YOLO pose.** Ultralytics' pose docs now present YOLO26 pose models in five sizes, n to x, pretrained on COCO keypoints and returning 17 keypoints for each detected person. The code is AGPL-3.0 unless you buy Ultralytics' Enterprise License. See [Ultralytics YOLO pose models](/motion/yolo-pose-models) and [MediaPipe vs YOLO pose](/compare/mediapipe-vs-yolo-pose).\n- **MoveNet MultiPose Lightning** detects up to 6 people; the text of its model card carries no licence line, so confirm its terms.\n- **RTMPose** from OpenMMLab's MMPose pairs a person detector with a pose model, in 17, 26 and 133 keypoint sets, under an Apache-2.0 codebase. See [RTMPose models](/motion/rtmpose-models).\n- **OpenPose** is a real-time multi-person system built on Part Affinity Fields, licensed for academic or non-profit noncommercial research only. See [OpenPose models](/motion/openpose-models) and [OpenPose alternatives](/alternatives/openpose-alternatives).\n\n[Multi-person pose tracking](/motion/multi-person-pose-tracking) explains the tracking layer every one of these still needs.\n\n### Buy the fitness layer instead of building it\n\n- **QuickPose** is built on MediaPipe itself: its README describes \"developer-oriented cutting edge ML features of MediaPipe and BlazePose\", with counters, range-of-motion measurement and feedback on iOS, Android and React Native, and a published price list starting with a free tier for 10 monthly active devices. See [QuickPose pricing](/pricing/quickpose-pricing).\n- **Sency** ships assessments, progress evaluations and workout plans in a no-UI kit or a white-label UI kit, with models downloaded from Sency's server at configuration, and a pricing packages page that lists a free Starter plan for up to 100 monthly active users and a Growth plan from $499 a month. See [Sency pricing](/pricing/sency-pricing) and [QuickPose vs Sency](/compare/quickpose-vs-sency).\n- **Kemtai** targets clinical rehab, with embeddable components and an FDA listing and CE marking described on its site.\n- **KinesteX**, which funds this site, embeds a hosted workout experience through a WebView or iframe; its public repositories do not say which pose model runs inside it. See [KinesteX vs MediaPipe](/compare/kinestex-vs-mediapipe).\n\n## At a glance\n\n| Option | Keypoints | People | Licence | Runs on |\n| --- | --- | --- | --- | --- |\n| MediaPipe Pose Landmarker | 33, with world landmarks | One per the model card; `num_poses` option, default 1 | Apache-2.0 | Android, iOS, web, Python |\n| MoveNet SinglePose | 17 | One | Apache-2.0 | TensorFlow.js, TensorFlow Lite |\n| MoveNet MultiPose | 17 | Up to 6 | No licence line in the card text | TensorFlow.js, TensorFlow Lite |\n| Apple Vision | 19 (2D), 17 (3D) | One observation per detected body; Apple warns dense crowds are likely to be inaccurate | Ships with the OS | iOS 14+ (2D), iOS 17+ (3D) |\n| ML Kit Pose Detection | 33 | One | Google's terms, beta | Android, iOS |\n| Ultralytics YOLO26 pose | 17 | Every detected person | AGPL-3.0 or Enterprise | Exports including ONNX, CoreML and TensorRT |\n| RTMPose | 17, 26 or 133 | With a person detector | Apache-2.0 code | ONNX Runtime, TensorRT, ncnn and more |\n| OpenPose | 25 or 18 body | Many | Noncommercial research only | CUDA, OpenCL or CPU builds |\n\n## When to stay with MediaPipe\n\nIf your app tracks one person close to a phone camera and you want joint angles that survive changes of viewpoint, MediaPipe is still the default the others are measured against: free, on-device, three sizes with one output contract, and the only option here with hip-centred world landmarks on every platform. The usual reason to leave is a hard requirement it does not meet, more people, metric depth, a browser on weak hardware, or a wish to buy the fitness layer, so name yours before you switch.",
    "faqs": [
      {
        "q": "Can MediaPipe Pose Landmarker track more than one person?",
        "a": "The Tasks API has a num_poses option, documented as the maximum number of poses the PoseLandmarker can detect, with a default of 1. Google's BlazePose GHUM model card, however, says the model tracks only one person on scene if multiple are present and lists multiple people as out of scope. So the option exists, but multi-person use is not what the model was evaluated for; test it on your own scenes or choose a multi-person model."
      },
      {
        "q": "What is the best free alternative to MediaPipe for multi-person pose estimation?",
        "a": "It depends on your licence constraints. MoveNet MultiPose Lightning detects up to 6 people but the text of its model card carries no licence line, RTMPose's MMPose codebase is Apache-2.0 and pairs a person detector with the pose model, Ultralytics YOLO pose is AGPL-3.0 unless you buy an Enterprise License, and OpenPose is limited to noncommercial research. Read each licence before you build a commercial product on it."
      },
      {
        "q": "Is MoveNet or Apple Vision a better MediaPipe alternative on iPhone?",
        "a": "For an iOS-only app, Apple Vision avoids shipping any model: its 2D body pose request works from iOS 14 and its 3D request from iOS 17, with nothing to license, though Apple publishes no accuracy figures. MoveNet is the better fit when the same model must also run on Android or in a browser, through TensorFlow Lite or TensorFlow.js. Neither gives you MediaPipe's 33 points with hip-centred world landmarks."
      },
      {
        "q": "Is there a paid SDK built on MediaPipe?",
        "a": "Yes. QuickPose's README describes it as providing developer-oriented features of MediaPipe and BlazePose, and its Swift package ships MediaPipe lite, full and heavy libraries as modules, with exercise counters, range-of-motion measurement and feedback on top. It publishes plans by monthly active device, starting with a free tier for 10 devices."
      }
    ],
    "related": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "label": "Pose estimation models compared"
      },
      {
        "href": "/motion/mediapipe-pose-landmarker-models",
        "label": "MediaPipe Pose Landmarker models"
      },
      {
        "href": "/alternatives/quickpose-alternatives",
        "label": "QuickPose alternatives"
      },
      {
        "href": "/compare/kinestex-vs-mediapipe",
        "label": "KinesteX vs MediaPipe"
      }
    ],
    "cta": {
      "pitch": "Pose models get renamed, re-benchmarked and relicensed. Subscribe and we will flag it when one of the options here changes its model, platforms or terms."
    },
    "sources": [
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py",
        "checked": "2026-10-17",
        "note": "num_poses, its default of 1 and its docstring"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/pose.md",
        "checked": "2026-10-17",
        "note": "world landmarks in meters from the hip centre; the May 10, 2023 upgrade notice"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/README.md",
        "checked": "2026-10-17",
        "note": "Android, iOS, web and Python"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE",
        "checked": "2026-10-17",
        "note": "Apache-2.0"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-17",
        "note": "single person, out-of-scope list, z up to scale, Apache-2.0"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
        "checked": "2026-10-17",
        "note": "served files last modified April 2023 (all three variants)"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.SinglePose%20Model%20Card.pdf",
        "checked": "2026-10-17",
        "note": "inputs, 17 keypoints, 3 to 6 feet, Apache-2.0"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.MultiPose%20Model%20Card.pdf",
        "checked": "2026-10-17",
        "note": "up to 6 people; no licence line in the text"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest",
        "checked": "2026-10-17",
        "note": "iOS 14.0; the 3D request from iOS 17.0"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/detecting-human-body-poses-in-images",
        "checked": "2026-10-18",
        "note": "one observation per detected body pose; dense crowds likely inaccurate"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation/jointname",
        "checked": "2026-10-18",
        "note": "17 3D joint names; 19 2D joint names on VNHumanBodyPoseObservation.JointName"
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose",
        "checked": "2026-10-18",
        "note": "17, 26 and 133 keypoint models, RTMDet person-detector pairing, deployment backends"
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/blob/main/LICENSE",
        "checked": "2026-10-18",
        "note": "Apache-2.0"
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection",
        "checked": "2026-10-17",
        "note": "one person, 33 landmarks, beta, no SLA"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/docs/en/tasks/pose.md",
        "checked": "2026-10-17",
        "note": "YOLO26 pose models, COCO keypoints"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/README.md",
        "checked": "2026-10-17",
        "note": "AGPL-3.0 and the Enterprise License"
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/LICENSE",
        "checked": "2026-10-17",
        "note": "noncommercial research use only"
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose",
        "checked": "2026-10-17",
        "note": "README: Part Affinity Fields, CUDA, OpenCL and CPU-only builds"
      },
      {
        "url": "https://github.com/quickpose/quickpose-ios-sdk",
        "checked": "2026-10-17",
        "note": "MediaPipe and BlazePose description and modules"
      },
      {
        "url": "https://quickpose.ai/sdk-pricing/",
        "checked": "2026-10-17",
        "note": "free tier for 10 monthly active devices (snapshot)"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ios-demo",
        "checked": "2026-10-17",
        "note": "server-downloaded models"
      },
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-10-18",
        "note": "Starter and Growth plans (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://kemtai.com/",
        "checked": "2026-10-17",
        "note": "embeddables and regulatory claims (snapshot)"
      }
    ],
    "firstParty": true
  },
  {
    "slug": "quickpose-alternatives",
    "primaryQuery": "quickpose alternatives",
    "h1": "QuickPose Alternatives, Routed by Why You Are Leaving",
    "metaTitle": "QuickPose Alternatives (2026): SDKs and Free Pose Models",
    "metaDescription": "Alternatives to QuickPose by reason for leaving: MediaPipe directly, Apple Vision, ML Kit, Sency, Kemtai and more, checked against their own docs.",
    "updated": "2026-10-18",
    "answer": "The closest alternative to QuickPose is the model it wraps: QuickPose describes itself as packaging MediaPipe and BlazePose, so a team willing to write its own counting and range-of-motion logic can call MediaPipe Pose Landmarker directly, under Apache-2.0, with no key or fee. For an iOS-only app Apple's Vision body pose needs no SDK at all, and an Android-only app can use Google's ML Kit Pose Detection. Teams that want more packaged than QuickPose rather than less look at Sency's assessment and workout kits, Kemtai for regulated rehab, or KinesteX, which funds this site.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that competes with QuickPose.** KinesteX appears below once, in the group where it genuinely fits, after the third-party options and labelled as ours. Every fact about every vendor, KinesteX included, comes from that vendor's own repositories, package registries or published pages as fetched on October 17, 2026; where we could not verify something, the page says so.\n\n## What you would be replacing\n\nQuickPose's iOS SDK README describes it as providing \"developer-oriented cutting edge ML features of MediaPipe and BlazePose, with easy integration and production ready code\". That is an accurate summary of the shape: the SDK modules bundle MediaPipe libraries (the README lists `QuickPoseMP-lite`, `QuickPoseMP-full` and `QuickPoseMP-heavy`), and QuickPose adds the fitness layer on top. Verified from its repositories and pages:\n\n- **Platforms.** iOS 14.0 or later; Android, where its docs give a minimum of API 26 and note that the sample code needs API 28 because of CameraX; and a React Native plugin, `@quickpose/react-native`, for iOS and Android.\n- **Features.** Overlays, range-of-motion measurement for shoulders, hips, knees, back and neck, detection and counting for 20 named exercises (22 entries in the README's table, two of them repeated), body-position and limb-not-visible feedback, and raised-finger and thumbs-up inputs.\n- **Runtime.** On-device. Its iOS and Android product pages describe a 33-point skeleton and on-device inference, with no video frames sent to a server.\n- **Price.** A free key, then plans by monthly active device: free for 10 devices, then $25 to $1,000 a month up to 100,000 devices. The full table is in [QuickPose pricing](/pricing/quickpose-pricing).\n\n## Why teams look elsewhere\n\nThese are the reasons the sources support, not guesses about QuickPose's customers:\n\n- **The price unit.** QuickPose bills per monthly active device. A free tier of 10 devices covers development and a pilot, not a launch. If your app has many occasional users, a per-device bill grows with reach rather than with engagement.\n- **No public web package.** QuickPose's docs home mentions Wasm SDKs, but the only QuickPose package we found on npm is the React Native plugin, and there is no public web repository. A product with a browser surface needs a plan for it.\n- **Building blocks, not content.** The repositories ship counters, measurements and overlays. They contain no exercise library, workout plans or coaching UI, so a team that wanted a finished experience still has to build one.\n- **Owning the model layer.** QuickPose sits between you and MediaPipe. A team that wants to pin a model version, swap variants on its own schedule or read every line of the pipeline may prefer to call MediaPipe itself.\n- **Mixed licence signals.** The iOS repository is Apache-2.0 and QuickPose's terms license the SDK under Apache 2.0, yet the same terms say use \"may be subject to fees\"; the Android repository has no LICENSE file and the npm plugin is MIT. In our reading this is permissive code in front of a keyed, metered service, which is fine, but procurement teams ask about it.\n\n## The alternatives, by reason for leaving\n\n### You want to drop the wrapper: MediaPipe Pose Landmarker\n\nThe most direct alternative is the model QuickPose wraps. MediaPipe Pose Landmarker returns 33 landmarks per person with world coordinates in meters, ships as lite, full and heavy `.task` files, runs on Android, iOS, web and Python through the MediaPipe Tasks API, and is Apache-2.0 for both the framework and, per Google's model card, the models. There is no key and no fee. What you give up is exactly what QuickPose adds: exercise counters, range-of-motion measurement, feedback events and camera plumbing become your code. [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models) covers the variants, and [MediaPipe alternatives](/alternatives/mediapipe-alternatives) maps the field from the other side.\n\n### You ship on iOS only: Apple Vision body pose\n\nApple's Vision framework has two body pose requests with no model file to ship: `VNDetectHumanBodyPoseRequest` for 2D, available from iOS 14, and `VNDetectHumanBodyPose3DRequest` for 3D, from iOS 17. No SDK key, no third party, no bill; the trade is that Apple publishes no model card or accuracy figures. Details in [Apple Vision body pose](/motion/apple-vision-body-pose).\n\n### You ship on Android only: ML Kit Pose Detection\n\nGoogle's ML Kit Pose Detection returns 33 landmarks for one person on device, in a base and an accurate SDK, under Google's service terms rather than an open-source licence; Google labels the API beta. See [ML Kit pose detection](/motion/ml-kit-pose-detection).\n\n### You need a browser: MediaPipe Tasks for web or MoveNet\n\nBoth run client-side in the browser. MediaPipe's Pose Landmarker has a web Tasks API, and MoveNet runs through TensorFlow.js with SinglePose Lightning, Thunder and a MultiPose model for up to 6 people. [AI workout tracking on the web](/guides/ai-workout-tracking-web) walks through the browser path.\n\n### You want more packaged than QuickPose, not less\n\n- **Sency** ships two kits on iOS, Android, React Native and Flutter: a branded kit whose \"entire user interface and experience are ready to use\", and a custom kit with no predefined UI. Its README leads with movement and fitness assessments, monthly progress evaluations and personalized workout plans. Sency's iOS kits download their models from Sency's server at configuration, so the first run needs a connection. It bills per monthly active user: its packages page lists a free Starter plan for up to 100 and a Growth plan from $499 a month, though its main pricing page describes the first 100 users as a paid tier after a trial; see [Sency pricing](/pricing/sency-pricing). The head-to-head is [QuickPose vs Sency](/compare/quickpose-vs-sency).\n- **Kemtai** is the option for regulated rehab work. Its site describes embeddable exercise and patient-management components plus data APIs, a library of more than 2,000 exercises, processing on the device with no video recorded, and an FDA listing and CE marking as a medical device. Its API docs are behind an email request, and we found no public SDK repository.\n- **KinesteX**, which funds this site, embeds a hosted camera workout experience through a WebView or iframe on iOS, Android, React Native, Flutter and the web, with workout, plan, challenge and assessment views and a content API. It publishes no prices; access starts with a contact form. The disclosed comparison is [KinesteX vs QuickPose](/compare/kinestex-vs-quickpose).\n\n### Several people in one frame\n\nQuickPose's repositories describe single-subject features. For group scenes, [multi-person pose tracking](/motion/multi-person-pose-tracking) compares the approaches, and the model pages cover [MoveNet MultiPose](/motion/movenet-models), [Ultralytics YOLO pose](/motion/yolo-pose-models), which is AGPL-3.0 unless you buy Ultralytics' Enterprise License, and [RTMPose](/motion/rtmpose-models).\n\n## What we verified, and where\n\n| Option | Verified | From | Not verified |\n| --- | --- | --- | --- |\n| QuickPose | MediaPipe-based modules, platforms, features, on-device claim, device-based plans | Its GitHub repos, npm, docs, pricing and product pages | Accuracy; the Wasm SDK mentioned in its docs |\n| MediaPipe | 33 landmarks, variants, Tasks platforms, Apache-2.0 | google-ai-edge/mediapipe and Google's model card | Behaviour on your exercises |\n| Apple Vision | 2D from iOS 14, 3D from iOS 17 | Apple's documentation | Accuracy, which Apple does not publish |\n| ML Kit | 33 landmarks, one person, beta, base and accurate SDKs | Google's ML Kit guides | Google's future plans for the beta |\n| Sency | Kits, platforms, server-downloaded models, published plans | Its GitHub repos and pricing pages | How its Growth rates combine; accuracy |\n| Kemtai | Embeddables, data APIs, 2,000+ exercises, regulatory claims | Its website | API docs (email-gated); pricing |\n| KinesteX | WebView and iframe architecture, platforms, contact-form access | Its GitHub repos and website | Pricing (not published); accuracy |\n\n## Is switching easy?\n\nFrom QuickPose to MediaPipe directly, the model is the same family, so the landmark set carries over; the work is rebuilding the counters, measurements and feedback QuickPose gave you. From QuickPose to Sency or KinesteX, the work runs the other way: you adopt their session model and, with KinesteX, a hosted web experience, and you drop code you wrote around QuickPose's building blocks. Either way, run the candidate on your own recorded exercises before you commit; [how to evaluate motion SDKs](/guides/evaluate-motion-sdks) is a protocol for doing that fairly.",
    "faqs": [
      {
        "q": "Is QuickPose built on MediaPipe?",
        "a": "Yes, by its own description. QuickPose's iOS SDK README says it provides features of MediaPipe and BlazePose with easy integration, its Swift package lists MediaPipe lite, full and heavy library modules, and its product pages say it is built on MediaPipe. What QuickPose adds is the layer above the landmarks: exercise counters, range-of-motion measurement, feedback events, overlays and camera utilities."
      },
      {
        "q": "What is a free alternative to the QuickPose SDK?",
        "a": "MediaPipe Pose Landmarker, the model family QuickPose wraps, is Apache-2.0 with no key or fee and runs on Android, iOS, web and Python. Apple's Vision body pose is free on iOS 14 and later, Google's ML Kit Pose Detection is free on Android and iOS under Google's terms, and MoveNet's single-person models are Apache-2.0. All of them stop at keypoints, so the counting and feedback logic becomes your work."
      },
      {
        "q": "Which QuickPose alternative runs in a web browser?",
        "a": "MediaPipe Pose Landmarker through its web Tasks API, or MoveNet through TensorFlow.js, both client-side. QuickPose's docs home mentions Wasm SDKs, but the only QuickPose package we found on npm is its React Native plugin and there is no public web repository. KinesteX, which funds this site, embeds its experience in a web page through an iframe."
      },
      {
        "q": "Which QuickPose alternatives include workouts or assessments, not just pose tracking?",
        "a": "Sency's README leads with movement and fitness assessments, progress evaluations and personalized workout plans, in a branded kit or a no-UI custom kit. Kemtai's site describes an embeddable exercise player and a library of more than 2,000 exercises for rehab. KinesteX, which funds this site, ships workout, plan, challenge and assessment views. QuickPose's own repositories contain counters and measurements but no exercise library."
      }
    ],
    "related": [
      {
        "href": "/pricing/quickpose-pricing",
        "label": "QuickPose pricing"
      },
      {
        "href": "/compare/quickpose-vs-sency",
        "label": "QuickPose vs Sency"
      },
      {
        "href": "/alternatives/mediapipe-alternatives",
        "label": "MediaPipe alternatives"
      },
      {
        "href": "/compare/kinestex-vs-quickpose",
        "label": "KinesteX vs QuickPose"
      }
    ],
    "cta": {
      "pitch": "Motion SDKs change platforms, pricing units and licences between releases. Subscribe and we will tell you when one of the options on this page changes in a way that matters."
    },
    "sources": [
      {
        "url": "https://github.com/quickpose/quickpose-ios-sdk",
        "checked": "2026-10-17",
        "note": "README description, MediaPipe modules, features, iOS 14.0+, SDK key, Apache-2.0 LICENSE"
      },
      {
        "url": "https://github.com/quickpose/quickpose-android-sdk",
        "checked": "2026-10-17",
        "note": "feature table, Android SDK 26, no LICENSE file"
      },
      {
        "url": "https://github.com/quickpose/quickpose-react-native-pose-estimation",
        "checked": "2026-10-17",
        "note": "React Native plugin for iOS and Android; MIT on npm"
      },
      {
        "url": "https://docs.quickpose.ai/docs/MobileSDK",
        "checked": "2026-10-17",
        "note": "min API 26, samples API 28; Wasm SDKs on the docs home (snapshot)"
      },
      {
        "url": "https://quickpose.ai/products/android-sdk/",
        "checked": "2026-10-17",
        "note": "on-device inference, 33-point skeleton, built on MediaPipe (snapshot)"
      },
      {
        "url": "https://quickpose.ai/terms-and-conditions/",
        "checked": "2026-10-17",
        "note": "Apache 2.0 licence clause and fees (snapshot)"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe",
        "checked": "2026-10-17",
        "note": "Pose Landmarker Tasks API and Apache-2.0"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-17",
        "note": "model licence and single-person scope"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest",
        "checked": "2026-10-17",
        "note": "iOS 14.0 availability; the 3D request from iOS 17.0"
      },
      {
        "url": "https://github.com/sency-ai/smkit-sdk",
        "checked": "2026-10-17",
        "note": "kits, platforms, features"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ios-demo",
        "checked": "2026-10-17",
        "note": "server-downloaded models"
      },
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-10-18",
        "note": "Starter and Growth plans (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/pricing",
        "checked": "2026-10-17",
        "note": "trial and paid monthly fee for the first 100 active users (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://kemtai.com/",
        "checked": "2026-10-17",
        "note": "embeddables, exercises, edge processing, regulatory claims (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs",
        "checked": "2026-10-17",
        "note": "platforms and contact-form access (snapshot)"
      }
    ],
    "firstParty": true
  },
  {
    "slug": "sency-alternatives",
    "primaryQuery": "sency alternatives",
    "h1": "Sency Alternatives, Routed by Why You Are Leaving",
    "metaTitle": "Sency Alternatives (2026): Motion SDKs and Pose Models",
    "metaDescription": "Alternatives to Sency's SMKit by reason for leaving: web support, a cheaper paid plan, offline models, clinical scope or open licences. Checked, disclosed.",
    "updated": "2026-10-18",
    "answer": "The right Sency alternative depends on why you are leaving. Sency's own platform table marks JavaScript as not available, so web products turn to MediaPipe's web Tasks API, MoveNet or KinesteX, which funds this site; teams wanting a cheaper first paid plan look at QuickPose; and teams that need models inside the app from the first launch use MediaPipe, Apple Vision or ML Kit, since Sency's iOS kits download their models from Sency's server. Clinical teams look at Kemtai, which describes an FDA listing and CE marking.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that competes with Sency.** KinesteX appears below in the groups where it genuinely fits, after the third-party options and labelled as ours. Every fact about every vendor comes from its own repositories, package registries or published pages as fetched on October 17, 2026; anything we could not verify is marked.\n\n## What you would be replacing\n\nSency's SDK README describes \"AI motion analysis technology that understands and enhances human movement through just a smartphone camera—no extra hardware needed\". In practice that is two products sharing one engine:\n\n- **The Custom Kit (SMKit)**, which Sency's version table calls a \"Native no-UI SDK\". Its iOS demo states the division of labour plainly: you own the camera preview, session lifecycle, exercise UI, skeleton rendering and result presentation.\n- **The Branded Kit (SMKitUI)**, where \"the entire user interface and experience are ready to use\" as a white label.\n\nBoth kits cover iOS, Android, React Native and Flutter; Sency's own platform table marks JavaScript and Unity as not available. The README leads with initial movement and fitness assessments, monthly progress evaluations and personalized workout plans, and the iOS demo documents body calibration, adaptive range of motion and a session lifecycle. Sency also documents an MCP server for AI coding tools that need its SDK documentation, and its FAQ says data is \"analyzed directly on the user's device, never sent to the cloud\". Pricing is per monthly active user, counted once a month: its packages page lists a free Starter plan for up to 100 and a Growth plan from $499 a month for up to 3,800, while its main pricing page describes the first 100 as a paid tier after a free trial. [Sency pricing](/pricing/sency-pricing) sets out both.\n\n## Why teams look elsewhere\n\nThese are the reasons the sources support:\n\n- **No web target.** The platform table marks JavaScript \"NA\". A product with a browser or PWA surface needs something else for it.\n- **Models arrive from Sency's server.** The iOS SMKit README says version 2.3.6 \"downloads models and required SDK assets from the server\" and \"does not include bundled fallback models\", so the first configuration needs a connection; a valid cache can be used offline later. The Android demo describes the same for its 1.9.4 release candidate. If a cold first launch must work offline, or you must pin model files in your own app, that is a structural mismatch.\n- **Commercial terms are a separate agreement.** The LICENSE file in Sency's repositories is its Terms of Use, last updated in September 2022, and it says any commercial or production use is governed by a separate paid service agreement. It is not an open-source licence.\n- **A big first paid step, and two pages that disagree.** Above the free Starter plan, Sency's packages page lists Growth from $499 a month, and its main pricing page describes the first 100 users as a paid tier instead. Sign-up runs through a contact form that leads to a call. Teams that want a cheaper first paid plan or one unambiguous price list look elsewhere.\n- **Platform floors.** The Custom Kit's iOS demo pins iOS 16.0, and SMKitUI states iOS 15 or later. Teams still supporting older devices should check this first.\n\n## The alternatives, by reason for leaving\n\n### You need a web or PWA surface\n\n- **MediaPipe Pose Landmarker** has a web Tasks API that runs in the browser, under Apache-2.0, with no key. You build the exercise logic. See [MediaPipe Pose Landmarker models](/motion/mediapipe-pose-landmarker-models).\n- **MoveNet** runs through TensorFlow.js; its SinglePose models are Apache-2.0. See [MoveNet models](/motion/movenet-models).\n- **KinesteX**, which funds this site, has HTML and JavaScript and PWA integrations that load its hosted experience in an iframe, alongside iOS, Android, React Native and Flutter SDKs that wrap the same experience in a WebView. See [KinesteX vs Sency](/compare/kinestex-vs-sency), written to the same disclosure standard as this page.\n\n### You want a cheaper first paid plan\n\n**QuickPose** publishes plans from $25 a month for up to 100 monthly active devices to $1,000 a month for up to 100,000, every SDK feature on every plan, with a free tier for 10 devices and a free SDK key. Units differ, devices against users, so model your own numbers. It is a MediaPipe-based toolkit of counters, range-of-motion measurement and overlays rather than an assessment and workout product, so compare scope as well as price: [QuickPose vs Sency](/compare/quickpose-vs-sency) and [QuickPose pricing](/pricing/quickpose-pricing).\n\n### Models must ship inside your app and work offline from the first launch\n\n- **MediaPipe Pose Landmarker** loads a `.task` file you can bundle and pin, which Google's own Android sample does with a versioned download URL.\n- **Apple Vision** body pose runs from the operating system on iOS 14 and later (3D from iOS 17), with no model file at all. See [Apple Vision body pose](/motion/apple-vision-body-pose).\n- **ML Kit Pose Detection** runs on Android and iOS under Google's terms; its Android guide says the API \"uses a bundled library that increases your app size\". Google labels it beta and says it detects one person. See [ML Kit pose detection](/motion/ml-kit-pose-detection).\n- **QuickPose** bundles MediaPipe libraries in its SDK modules and describes on-device inference.\n\n### Your product is clinical or regulated rehab\n\n**Kemtai** positions itself for that work: embeddable exercise and patient-management components, data APIs that pull exercise scores and range-of-motion results back into your system, a library of more than 2,000 exercises, processing on the device with no video recorded, and an FDA listing and CE marking as a medical device. Its API documentation is behind an email request and it publishes no prices, so expect a sales process.\n\n### You want an open-source licence end to end\n\nMediaPipe's framework and Pose Landmarker models are Apache-2.0, and MoveNet's SinglePose code and model card are Apache-2.0. The text of the MoveNet MultiPose card carries no licence line, Ultralytics YOLO is AGPL-3.0 unless you buy an Enterprise License, and OpenPose is for noncommercial research only. [Pose estimation model licenses](/motion/pose-estimation-model-licenses) reads each one.\n\n## What we verified, and where\n\n| Option | Verified | From | Not verified |\n| --- | --- | --- | --- |\n| Sency | Kits, platforms (JS and Unity NA), server-downloaded models, iOS floors, Terms of Use, published plans | Its GitHub repos and pricing pages | How its Growth rates combine; accuracy; the Exploration Kit's contents |\n| QuickPose | Published plans, MediaPipe-based modules, platforms, on-device claim | Its pricing page, GitHub repos and product pages | Accuracy |\n| MediaPipe | Web, Android, iOS and Python Tasks; Apache-2.0; pinned sample URLs | google-ai-edge repositories and Google's model card | Behaviour on your exercises |\n| Apple Vision | 2D from iOS 14, 3D from iOS 17 | Apple's documentation | Accuracy, which Apple does not publish |\n| ML Kit | 33 landmarks, one person, beta, Android and iOS | Google's ML Kit guide | Google's plans for the beta |\n| Kemtai | Embeddables, data APIs, exercise library, edge processing, regulatory claims | Its website | API docs (email-gated); pricing |\n| KinesteX | Iframe and WebView architecture, platforms, contact-form access | Its GitHub repos and website | Pricing (not published); accuracy |\n\n## Is switching easy?\n\nLeaving Sency's Branded Kit means replacing a whole UI as well as the tracking. Leaving the Custom Kit is closer to a model swap, because your app already owns the camera, rendering and results, but assessments, feedback and plans that Sency computed become your code unless the new vendor supplies them. Run any candidate on your own recorded exercises first; [how to evaluate motion SDKs](/guides/evaluate-motion-sdks) sets out a fair protocol.",
    "faqs": [
      {
        "q": "Does Sency's SMKit work offline?",
        "a": "After the first setup, partly. Sency's iOS SMKit README says the SDK downloads its models and required assets from Sency's server, includes no bundled fallback models, and needs the device online for the first configuration, after which a valid previously downloaded cache can be used offline. Its Android demo describes the same pattern. If a first launch must work with no connection, a model you bundle yourself, such as MediaPipe's, is the safer shape."
      },
      {
        "q": "Is there a Sency alternative for web apps?",
        "a": "Yes, several. Sency's platform table marks JavaScript as not available. MediaPipe Pose Landmarker has a web Tasks API that runs in the browser, MoveNet runs through TensorFlow.js, and KinesteX, which funds this site, loads its hosted experience in an iframe for HTML, JavaScript and PWA products. The free models stop at keypoints, so the counting and feedback logic becomes your work."
      },
      {
        "q": "Is Sency's SDK open source?",
        "a": "No. The LICENSE file in Sency's GitHub repositories is Sency's Terms of Use, last updated in September 2022, and it says commercial or production use is governed by a separate paid service agreement. The repositories are demos and documentation for a proprietary SDK. If you need an open-source licence end to end, MediaPipe and MoveNet's single-person models are Apache-2.0."
      },
      {
        "q": "Which Sency alternative suits clinical rehab products?",
        "a": "Kemtai positions itself for that work. Its site describes embeddable exercise and patient-management components, data APIs that return exercise scores and range-of-motion results, a library of more than 2,000 exercises, processing on the device with no video recorded, and an FDA listing and CE marking as a medical device. Its API documentation is behind an email request and it publishes no prices, so expect a sales process."
      }
    ],
    "related": [
      {
        "href": "/compare/quickpose-vs-sency",
        "label": "QuickPose vs Sency"
      },
      {
        "href": "/compare/kinestex-vs-sency",
        "label": "KinesteX vs Sency"
      },
      {
        "href": "/alternatives/quickpose-alternatives",
        "label": "QuickPose alternatives"
      },
      {
        "href": "/alternatives/mediapipe-alternatives",
        "label": "MediaPipe alternatives"
      }
    ],
    "cta": {
      "pitch": "Motion SDK vendors change platforms, pricing and licence terms between releases. Subscribe and we will flag it when an option on this page changes in a way that affects a build decision."
    },
    "sources": [
      {
        "url": "https://github.com/sency-ai/smkit-sdk",
        "checked": "2026-10-17",
        "note": "description, kits, platform table, version table, FAQ and Terms of Use LICENSE"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ios-demo",
        "checked": "2026-10-17",
        "note": "iOS 16.0 Podfile, server-downloaded models, session lifecycle, calibration, adaptive ROM, MCP server"
      },
      {
        "url": "https://github.com/sency-ai/smkit-ui-ios-demo",
        "checked": "2026-10-17",
        "note": "SMKitUI iOS 15 or later"
      },
      {
        "url": "https://github.com/sency-ai/smkit-android-demo",
        "checked": "2026-10-17",
        "note": "server-delivered models in the 1.9.4 release candidate"
      },
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-10-18",
        "note": "Starter and Growth plans (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/pricing",
        "checked": "2026-10-17",
        "note": "trial, paid monthly fee for the first 100, contact form (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/faq-motion-tracking",
        "checked": "2026-10-18",
        "note": "on-device processing claim (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://quickpose.ai/sdk-pricing/",
        "checked": "2026-10-17",
        "note": "published plans (snapshot)"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe",
        "checked": "2026-10-17",
        "note": "Tasks platforms and Apache-2.0"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe-samples",
        "checked": "2026-10-17",
        "note": "the Android sample's versioned model URLs"
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection",
        "checked": "2026-10-17",
        "note": "beta status, one person, 33 landmarks"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest",
        "checked": "2026-10-17",
        "note": "iOS 14.0; the 3D request from iOS 17.0"
      },
      {
        "url": "https://kemtai.com/",
        "checked": "2026-10-17",
        "note": "embeddables, data APIs, exercises, edge processing, regulatory claims (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/docs",
        "checked": "2026-10-17",
        "note": "platforms (snapshot)"
      }
    ],
    "firstParty": true
  }
,
  {
    "slug": "openpose-alternatives",
    "primaryQuery": "openpose alternatives",
    "h1": "OpenPose Alternatives, Matched to the Reason You Are Leaving",
    "metaTitle": "OpenPose Alternatives (2026): Commercial-Use Pose Models",
    "metaDescription": "OpenPose alternatives by reason: an Apache-2.0 licence, BODY_25-style foot points, phones and browsers. AlphaPose shares OpenPose's noncommercial licence.",
    "updated": "2026-10-22",
    "answer": "Most teams leave OpenPose because its licence allows only noncommercial research use, because it has no phone build, or because its release notes end at version 1.7.0 from November 2020. For several people under a licence you can ship, RTMPose from OpenMMLab's Apache-2.0 MMPose is the closest match, and its 26-keypoint Halpe26 models carry the neck, hip and foot points BODY_25 users rely on; Ultralytics YOLO26 pose works if AGPL-3.0 or its paid Enterprise License suits you. For one person on a phone or in a browser, MediaPipe Pose Landmarker and MoveNet are Apache-2.0. AlphaPose, often named next to OpenPose, carries the same kind of noncommercial licence.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a commercial motion-tracking SDK; it does not appear in the list below, and none of the models here is ours.** Every fact comes from each project's own repository, model card or documentation, read on October 22, 2026. What OpenPose itself outputs is covered in [OpenPose models](/motion/openpose-models).\n\n## Why teams look for an OpenPose alternative\n\n- **The licence.** OpenPose's LICENSE is headed \"ACADEMIC OR NON-PROFIT ORGANIZATION NONCOMMERCIAL RESEARCH USE ONLY\" and grants a licence \"to use the Software for noncommercial research purposes\". It also says that derivatives and modifications you make \"will be owned by Licensor\". The README sends anyone wanting a commercial licence to a CMU FlintBox page. A paid app needs that separate deal or a different model.\n- **Its age.** The last release in OpenPose's release notes is 1.7.0, dated November 15, 2020; the section after it is headed \"Current version - Future OpenPose 1.7.1\".\n- **Where it runs.** The README lists Ubuntu, Windows, Mac OSX and the Nvidia TX2, with CUDA, OpenCL and CPU-only builds. It lists no Android or iOS build, so a phone app needs another model.\n\n## What OpenPose still does well\n\nBe fair to it before leaving. The README says body runtime is \"invariant to number of detected people\", it detects body, 2x21 hand and 70 face keypoints from one system, it offers BODY_25 with six foot points, and it documents single-person 3D by triangulating multiple camera views. For research, or for a pipeline built around BODY_25, it can still be the right tool.\n\n## The alternatives, by reason\n\n### Several people under a licence you can ship: RTMPose\n\nRTMPose is the real-time project in OpenMMLab's MMPose, whose LICENSE is the Apache License, Version 2.0. Its README offers body models in a 17-keypoint COCO set, a 26-keypoint Halpe26 set and a 133-keypoint COCO-WholeBody set, and its pipeline table pairs each pose model with an RTMDet person detector. It deploys through ONNX Runtime, TensorRT, ncnn and OpenVINO, with Android examples on ncnn, and the rtmlib package \"does not require Pytorch or MMCV\". MMPose also publishes RTMO, which its README calls \"a state-of-the-art real-time method for multi-person pose estimation\". We found no separate terms for the pretrained checkpoints, so check those before shipping. See [RTMPose models](/motion/rtmpose-models).\n\n### Several people, if AGPL-3.0 works for you: Ultralytics YOLO26 pose\n\nUltralytics' default pose models predict the 17 COCO keypoints for every person detected, each with a box, in five sizes from n to x, and its export table covers CoreML and LiteRT for phones. The code is AGPL-3.0; the README sells an Enterprise License for products that cannot meet it. See [Ultralytics YOLO pose models](/motion/yolo-pose-models) and [MediaPipe vs YOLO pose](/compare/mediapipe-vs-yolo-pose).\n\n### Up to six people in a browser: MoveNet MultiPose\n\nMoveNet's TF.js README describes `MULTIPOSE_LIGHTNING` as a \"Multi-pose detector that detects up to 6 poses\", with optional tracking IDs across frames. The tfjs-models code is Apache-2.0, but the text of the MultiPose model card carries no licence line, so confirm its terms. See [MoveNet models](/motion/movenet-models).\n\n### One person on a phone or in a browser: MediaPipe, MoveNet, ML Kit, Apple Vision\n\n- **MediaPipe Pose Landmarker** returns 33 landmarks with 3D world coordinates, on Android, iOS, web and Python, under Apache-2.0; its model card scopes it to one person.\n- **MoveNet SinglePose** returns the 17 COCO keypoints, Lightning for speed and Thunder for accuracy, with an Apache-2.0 SinglePose card. [MediaPipe vs MoveNet](/compare/mediapipe-vs-movenet) decides between the two.\n- **ML Kit Pose Detection** returns 33 landmarks on Android and iOS, but Google's guide says it \"can only detect one person in an image\" and that the API \"is offered in beta, and is not subject to any SLA or deprecation policy\". See [ML Kit pose detection](/motion/ml-kit-pose-detection).\n- **Apple Vision** runs body pose with no model file to ship: Apple's documentation gives iOS 14 and macOS 11 as the first versions of its 2D body pose request. See [Apple Vision body pose](/motion/apple-vision-body-pose).\n\n### Not an escape: AlphaPose\n\nAlphaPose is one of the systems OpenPose's README compares its runtime against, and it supports COCO 17, Halpe 26 and Halpe 136 keypoint sets with tracking. Its licence is the same kind as OpenPose's: the LICENSE is headed \"ACADEMIC OR NON-PROFIT ORGANIZATION NONCOMMERCIAL RESEARCH USE ONLY\", with Shanghai Jiao Tong University as licensor, and the README says it is \"freely available for free non-commercial use\". Swapping OpenPose for AlphaPose does not fix a commercial licensing problem.\n\n## If you depend on BODY_25\n\nBODY_25 is OpenPose's 25-point body model: every point of its 18-point COCO model, Neck included, plus MidHip and six foot points (LBigToe, LSmallToe, LHeel and their right-side counterparts). No alternative here emits it as-is, so compare the points you use:\n\n| BODY_25 point | Halpe26 (RTMPose, AlphaPose) | BlazePose 33 (MediaPipe) | COCO 17 (MoveNet, YOLO) |\n| --- | --- | --- | --- |\n| Neck | `neck` | None | None |\n| MidHip | `hip`, a single unpaired point | None | None |\n| BigToe, SmallToe | `left_big_toe`, `left_small_toe` and right-side pairs | `LEFT_FOOT_INDEX` and `RIGHT_FOOT_INDEX`, one toe point per foot | None |\n| Heel | `left_heel`, `right_heel` | `LEFT_HEEL`, `RIGHT_HEEL` | None |\n\nIn our reading, Halpe26 has a counterpart for every BODY_25 point, which makes RTMPose's 26-keypoint models the closest commercial-friendly match; MMPose's Halpe26 config also adds a `head` point. Names and order differ throughout, so remap by hand rather than by index. Every index is in [the BODY_25 keypoint map](/pose-keypoints/openpose-body-25) and [the Halpe26 keypoint map](/pose-keypoints/halpe-26).\n\n## At a glance\n\n| Option | Body keypoints | People | Licence | Runs on |\n| --- | --- | --- | --- | --- |\n| OpenPose | BODY_25 or COCO 18, among others | Many | Noncommercial research only | CUDA, OpenCL or CPU builds; Ubuntu, Windows, Mac OSX, Nvidia TX2 |\n| RTMPose (MMPose) | 17, 26 or 133 | Many, with a person detector | Apache-2.0 code; checkpoint terms not found | ONNX Runtime, TensorRT, ncnn, OpenVINO |\n| Ultralytics YOLO26 pose | 17 | Every detected person | AGPL-3.0 or Enterprise License | PyTorch plus 22 export formats |\n| MoveNet MultiPose | 17 | Up to 6 | No licence line in the card text | TF.js, TF Lite |\n| MediaPipe Pose Landmarker | 33 | One | Apache-2.0 | Android, iOS, web, Python |\n| ML Kit Pose Detection | 33 | One | Beta, no SLA | Android, iOS |\n| AlphaPose | 17, 26 or 136 | Many | Noncommercial research only | Linux, Windows |\n\n## Which should you pick?\n\n- **A commercial product with several people in frame** → RTMPose for an Apache-2.0 codebase, or YOLO26 pose with the AGPL-3.0 question settled.\n- **A pipeline that consumes BODY_25 foot points** → RTMPose's Halpe26 models, remapped by name.\n- **One user on a phone** → MediaPipe Pose Landmarker or MoveNet; native iOS apps can also use Apple Vision.\n- **Research only, and you need body, hands and face from one system** → OpenPose's licence covers you, or RTMPose's 133-point wholebody models.\n\nEach licence is read in full in [pose estimation model licenses](/motion/pose-estimation-model-licenses), and the tracking layer every multi-person option still needs is in [multi-person pose tracking](/motion/multi-person-pose-tracking).",
    "faqs": [
      {
        "q": "What is a commercially usable alternative to OpenPose?",
        "a": "For several people in frame, RTMPose from OpenMMLab's MMPose is the closest: the MMPose code is Apache-2.0, and it ships 17, 26 and 133-keypoint body models with ONNX Runtime, TensorRT and ncnn deployment. Check its pretrained checkpoints' terms separately. Ultralytics YOLO26 pose is AGPL-3.0 unless you buy an Enterprise License. For a single person, MediaPipe Pose Landmarker and MoveNet SinglePose are Apache-2.0."
      },
      {
        "q": "Which OpenPose alternative outputs foot keypoints like BODY_25?",
        "a": "Models trained on Halpe26, such as RTMPose's 26-keypoint models, output a big toe, small toe and heel on each foot, plus neck and a single hip point, which in our reading covers every BODY_25 point under different names and indices. MediaPipe's 33 landmarks include a heel and one foot index point per foot. The 17-keypoint COCO models, MoveNet and YOLO pose included, stop at the ankles."
      },
      {
        "q": "Is AlphaPose a commercial-friendly replacement for OpenPose?",
        "a": "No. AlphaPose's LICENSE is headed academic or non-profit organization noncommercial research use only, with Shanghai Jiao Tong University as licensor, and its README says it is freely available for free non-commercial use, with commercial queries handled by email. Moving from OpenPose to AlphaPose changes the model but not the licensing problem."
      },
      {
        "q": "Is OpenPose still maintained?",
        "a": "Its release notes list version 1.7.0, dated November 15, 2020, as the last release, followed by a section headed Current version - Future OpenPose 1.7.1. We could not read the repository's commit history from our environment, so we cannot say whether code has landed since. For a new commercial product, the licence usually rules it out before maintenance does."
      }
    ],
    "related": [
      {
        "href": "/motion/openpose-models",
        "label": "OpenPose models: BODY_25 vs COCO"
      },
      {
        "href": "/motion/rtmpose-models",
        "label": "RTMPose models"
      },
      {
        "href": "/motion/pose-estimation-model-licenses",
        "label": "Pose model licences"
      },
      {
        "href": "/compare/mediapipe-vs-yolo-pose",
        "label": "MediaPipe vs YOLO pose"
      },
      {
        "href": "/alternatives/mediapipe-alternatives",
        "label": "MediaPipe alternatives"
      }
    ],
    "cta": {
      "pitch": "Pose model licences and releases change without much notice. Subscribe and we will flag it when OpenPose or one of its alternatives changes its terms or ships a new model."
    },
    "sources": [
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/LICENSE",
        "checked": "2026-10-22",
        "note": "noncommercial research heading and grant; derivatives owned by licensor"
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/README.md",
        "checked": "2026-10-22",
        "note": "FlintBox commercial licensing, OS and hardware list, runtime invariance, hand and face keypoints, 3D triangulation, AlphaPose comparison"
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/doc/08_release_notes.md",
        "checked": "2026-10-22",
        "note": "1.7.0 on November 15, 2020; Future OpenPose 1.7.1"
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/doc/02_output.md",
        "checked": "2026-10-22",
        "note": "BODY_25 and COCO formats"
      },
      {
        "url": "https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/src/openpose/pose/poseParameters.cpp",
        "checked": "2026-10-22",
        "note": "BODY_25 part names"
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/blob/main/projects/rtmpose/README.md",
        "checked": "2026-10-22",
        "note": "keypoint sets, RTMDet pipeline, deployment backends, rtmlib"
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/blob/main/README.md",
        "checked": "2026-10-22",
        "note": "RTMO"
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/blob/main/configs/_base_/datasets/halpe26.py",
        "checked": "2026-10-22",
        "note": "Halpe26 names: head, neck, hip, toes and heels"
      },
      {
        "url": "https://github.com/open-mmlab/mmpose/blob/main/LICENSE",
        "checked": "2026-10-22",
        "note": "Apache-2.0"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/docs/en/tasks/pose.md",
        "checked": "2026-10-22",
        "note": "17 COCO keypoints, boxes per instance"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/docs/macros/export-table.md",
        "checked": "2026-10-22",
        "note": "export formats including CoreML and LiteRT"
      },
      {
        "url": "https://github.com/ultralytics/ultralytics/blob/main/README.md",
        "checked": "2026-10-22",
        "note": "AGPL-3.0 and the Enterprise License"
      },
      {
        "url": "https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/movenet/README.md",
        "checked": "2026-10-22",
        "note": "MultiPose up to 6, tracking"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.MultiPose%20Model%20Card.pdf",
        "checked": "2026-10-22",
        "note": "no licence line in the text"
      },
      {
        "url": "https://storage.googleapis.com/movenet/MoveNet.SinglePose%20Model%20Card.pdf",
        "checked": "2026-10-22",
        "note": "Apache-2.0 line"
      },
      {
        "url": "https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/python/vision/pose_landmarker.py",
        "checked": "2026-10-22",
        "note": "PoseLandmark heel and foot index names"
      },
      {
        "url": "https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf",
        "checked": "2026-10-22",
        "note": "single-person scope, Apache-2.0"
      },
      {
        "url": "https://developers.google.com/ml-kit/vision/pose-detection",
        "checked": "2026-10-22",
        "note": "one person, 33 landmarks, Android and iOS, beta with no SLA"
      },
      {
        "url": "https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest",
        "checked": "2026-10-22",
        "note": "iOS 14.0 and macOS 11.0"
      },
      {
        "url": "https://github.com/MVIG-SJTU/AlphaPose/blob/master/LICENSE",
        "checked": "2026-10-22",
        "note": "noncommercial research heading; Shanghai Jiao Tong University"
      },
      {
        "url": "https://github.com/MVIG-SJTU/AlphaPose/blob/master/README.md",
        "checked": "2026-10-22",
        "note": "COCO 17, Halpe 26 and 136 keypoints, tracking, non-commercial use"
      }
    ],
    "firstParty": true
  }
];
