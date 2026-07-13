import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED concept explainers (do not hand-edit; regenerate via
 * scratchpad/assemble6.mjs). Definitional Article + FAQPage pages (no HowTo).
 */
export const learnEntries: ClusterEntry[] =
[
  {
    "slug": "what-is-a-fitness-api",
    "primaryQuery": "what is a fitness API",
    "h1": "What Is a Fitness API?",
    "metaTitle": "What Is a Fitness API? Definition and Categories",
    "metaDescription": "A fitness API is a service that exposes fitness or health data or capability to your app over HTTP, or on-device via the OS. Categories and uses explained.",
    "updated": "2026-07-09",
    "answer": "A fitness API is a service that lets your application programmatically retrieve fitness or health data, or invoke a fitness capability, without building the underlying data pipeline yourself. Most are HTTP/REST web services you call over the network; a key exception is on-device health stores like Apple HealthKit and Google Health Connect, which you reach through the phone's operating system rather than a remote server. It is a category, not a single product: exercise-content databases, wearable-metric APIs, nutrition APIs, AI-motion SDKs, and aggregators are all fitness APIs, each solving a different job.",
    "body": "A **fitness API** is a service that lets your application programmatically retrieve fitness or health data — or invoke a fitness capability — without building the underlying data pipeline yourself. Most fitness APIs are HTTP/REST web services you call over the network; a key exception is on-device health stores, which you reach through the operating system on the phone rather than a remote server. \"Fitness API\" is a **category**, not a single product: Fitbit's API, Terra, and Apple HealthKit are all fitness APIs, but each is one implementation of the idea.\n\n## What \"fitness API\" actually means\n\nAn API (Application Programming Interface) is a defined contract for one program to ask another for data or an action. A fitness API applies that contract to movement and health: your app sends a request and gets back structured data — steps, heart rate, a list of exercises, a food's macros, or the coordinates of a person's joints in a camera frame.\n\nMechanically, most fitness APIs work the same way: your app sends an HTTPS request carrying an authentication token, the provider's server responds with structured data (almost always JSON), and the provider publishes reference docs describing its endpoints, data schemas, auth model, and rate limits. The important nuance is that \"the API\" is not always a remote server. For on-device stores like Apple HealthKit and Google Health Connect, the API is an OS-level SDK that reads a local, permissioned data store on the phone — there is no vendor server to call with a token. That distinction (cloud-served versus on-device) is covered in depth in [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data).\n\n## The categories of fitness API\n\nThe single most useful thing to know as a builder is that \"fitness API\" spans several different kinds of service. Picking the right *category* first is the main architectural decision — it matters far more than which specific vendor you land on.\n\n| Category | What it exposes | Typical examples |\n|---|---|---|\n| **Exercise / workout content** | Libraries of exercises, images and video, muscle groups, instructions, and workout plans you render in-app | Exercise-content databases |\n| **Wearable / activity metrics** | Steps, heart rate, HRV, sleep, calories, and workouts from devices and platforms | Fitbit, Garmin, Oura, Whoop, Strava, Apple Health, Google/Samsung |\n| **Nutrition** | Food databases, barcode lookup, macros and calorie logging | Nutrition and food-database APIs |\n| **AI motion / computer vision** | Camera-based pose estimation, rep counting, and form feedback — usually on-device SDKs, not cloud endpoints | Pose-estimation SDKs |\n| **Aggregators** | A single integration that unifies many of the above behind one normalized API | Terra, Junction, Rook, Spike |\n\n- **Exercise / workout content APIs** give you the *stuff you show* — an exercise library so you don't build and maintain your own catalog of demos and instructions. See [exercise database APIs](/fitness-apis/exercise-database-apis).\n- **Wearable / activity-metric APIs** give you the *numbers a device recorded* — the biometric and activity data a user's watch, ring, or phone collected. See [wearable data APIs](/fitness-apis/wearable-data-apis).\n- **Nutrition APIs** give you *food data* — a searchable database and barcode lookup so users can log meals. See [nutrition APIs](/fitness-apis/nutrition-apis).\n- **AI motion APIs and SDKs** *generate* movement data rather than syncing it: a phone camera watches the user and produces reps, form checks, and coaching. These typically run on-device in real time. See [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis).\n- **Aggregators** are meta-APIs: one integration that fronts many wearable and cloud providers and returns their data in a single normalized schema. That pattern has its own explainer — see [what is a health-data aggregator](/learn/what-is-a-health-data-aggregator).\n\n## How a builder uses one\n\nThe reason fitness APIs exist is leverage. They let you ship features — device sync, an exercise library, calorie logging, camera coaching — without building the hardware integrations, data pipelines, or machine-learning models underneath them from scratch. You integrate against a documented contract instead of reverse-engineering a wearable's firmware or training a pose model.\n\nThe general flow is consistent across cloud fitness APIs:\n\n1. **Register** a developer app with the provider to get credentials.\n2. **Authorize** the user. Cloud APIs use OAuth 2.0, where the user consents and your app receives scoped access and refresh tokens — see [what is OAuth for health data](/learn/what-is-oauth-for-health-data). On-device stores instead use OS-level permissions, with no tokens at all.\n3. **Request data** with the token (or read the local store, on-device) and handle the structured response.\n4. **Stay in sync.** Many providers push new data to your server via [webhooks](/learn/what-are-webhooks) so you don't have to poll.\n\nThe hands-on mechanics of connecting to a specific provider live in the [integration guides](/integrate) — this page defines the concept; those pages walk the setup.\n\n## Category, not product: why the distinction matters\n\nBecause \"fitness API\" is a category, a sentence like \"which fitness API should I use?\" usually has to be answered in two steps. First decide the *category* — do you need workout content, wearable metrics, nutrition data, camera-based motion, or a many-source aggregator? Only then do you compare *providers within* that category. Mixing the two levels is where architecture decisions go wrong; an exercise-content API and a wearable-metrics API are not competitors, they solve different problems.\n\nA concrete example makes the layering obvious. A single workout app might:\n\n- pull exercise demos and instructions from an **exercise-content API**,\n- sync the user's resting heart rate and sleep from a **wearable API** (or an aggregator that fronts several), and\n- run an on-device **pose-estimation SDK** to count squats from the phone camera.\n\nThat is three different \"fitness APIs\" from three different categories, doing three unrelated jobs inside one app.\n\n## Where this fits\n\nThis page is the umbrella definition. The deeper pages do the hands-on work:\n\n- To survey the actual providers and pick between them, see the [fitness API landscape](/fitness-apis) and [how to choose a fitness API](/blog/how-to-choose-a-fitness-api).\n- To connect to a specific one, see the [integration guides](/integrate).\n- To understand the \"one integration for many wearables\" pattern, see [what is a health-data aggregator](/learn/what-is-a-health-data-aggregator).\n- To understand where the data physically lives, see [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data).",
    "faqs": [
      {
        "q": "What is a fitness API in simple terms?",
        "a": "It is a documented way for your app to get fitness or health data, or trigger a fitness feature, from another service. Your app sends a request and receives structured data back, usually JSON. Most fitness APIs are web services you call over HTTPS with an auth token; on-device stores such as Apple HealthKit and Google Health Connect are an exception, read through the phone's operating system with no remote server to call."
      },
      {
        "q": "What are the main types of fitness API?",
        "a": "There are roughly five categories: exercise and workout content APIs (libraries of exercises, demos, and plans), wearable and activity-metric APIs (steps, heart rate, sleep, calories from devices), nutrition APIs (food databases and macro logging), AI-motion or computer-vision SDKs (camera-based pose estimation, rep counting, and form feedback), and aggregators that unify many sources behind one normalized API. Choosing the right category is usually the main architectural decision."
      },
      {
        "q": "Is a fitness API the same as Fitbit's API or HealthKit?",
        "a": "No. 'Fitness API' is the general category; Fitbit's API, Terra, and Apple HealthKit are specific implementations of it. Answering 'which fitness API should I use?' usually means first choosing a category (content, wearable metrics, nutrition, AI motion, or aggregator), then comparing the individual providers within that category."
      },
      {
        "q": "How do I connect my app to a fitness API?",
        "a": "For cloud APIs, you register a developer app for credentials, have the user authorize your app via OAuth 2.0 to get scoped tokens, call the endpoints with those tokens, and often receive updates through webhooks. For on-device stores you request OS-level permissions instead of using OAuth, and read a local data store on the phone. The exact steps per provider are covered in the integration guides."
      },
      {
        "q": "Why use a fitness API instead of building it yourself?",
        "a": "A fitness API gives you leverage: you ship features like device sync, an exercise library, calorie logging, or camera coaching without building the hardware integrations, data pipelines, or machine-learning models underneath them. You integrate against a documented contract rather than reverse-engineering a wearable or training a pose model from scratch."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-a-health-data-aggregator",
        "label": "What is a health-data aggregator?"
      },
      {
        "href": "/fitness-apis",
        "label": "The fitness API landscape"
      },
      {
        "href": "/integrate",
        "label": "Integration guides"
      },
      {
        "href": "/learn",
        "label": "All fitness & health API concepts"
      }
    ],
    "cta": {
      "pitch": "We break down a different corner of the fitness and wearable API landscape every week — subscribe to get the next explainer before you start your integration."
    }
  },
  {
    "slug": "what-is-a-health-data-aggregator",
    "primaryQuery": "what is a health data aggregator",
    "h1": "What Is a Health-Data Aggregator?",
    "metaTitle": "What Is a Health-Data Aggregator?",
    "metaDescription": "A health-data aggregator is one integration and one webhook that normalizes many wearables — Terra, Junction, Rook, Spike. How it works and the trade-offs.",
    "updated": "2026-07-09",
    "answer": "A health-data aggregator is a single third-party service that connects to many wearables and health providers on your behalf and returns their data in one standardized schema, delivered to a webhook. You integrate once instead of building a separate integration for Fitbit, Garmin, Oura, Whoop, and every other source. The main options as of 2026 are Terra, Junction (formerly Vital), Rook, and Spike.",
    "body": "A health-data aggregator is a single third-party service that connects to many wearables and health providers on your behalf and returns all of their data in one standardized (normalized) schema, delivered to a webhook. You integrate once — with the aggregator — instead of building and maintaining a separate integration for Fitbit, Garmin, Oura, Whoop, Strava, and every other source your product needs. The names to know as of 2026 are Terra, Junction (formerly Vital), Rook, and Spike.\n\n## What it actually is\n\nThink of an aggregator as a translation-and-delivery layer that sits between your app and the wearable ecosystem. Each device brand has its own API, its own authentication, its own data format, and its own quirks and version changes. An aggregator absorbs all of that. It maintains the individual connections to each source, maps every provider's data into one consistent JSON shape — one \"sleep\" object, one \"activity\" object, regardless of which device it came from — and pushes new data to a single endpoint you control.\n\nCrucially, an aggregator spans both routes that health data can travel. Its servers pull from cloud/OAuth providers (Fitbit, Garmin, Oura, Whoop, Strava), and its mobile SDKs read from on-device stores like Apple HealthKit and Google Health Connect. So it is not an either/or layer — it unifies the platform SDKs *and* the cloud accounts behind one contract. (For the distinction between those two routes, see [on-device vs cloud health data](/learn/on-device-vs-cloud-health-data).)\n\n## Why it exists: the \"N integrations\" problem\n\nWithout an aggregator, supporting five wearables means building five integrations — five OAuth setups, five data formats to parse and normalize yourself, five sets of rate limits, and five sources of breaking changes to keep watching indefinitely. That cost does not end at launch; it is ongoing maintenance that grows with every provider you add.\n\nAn aggregator collapses that into one integration and one schema. Add a sixth or a twelfth device, and in most cases it is a configuration change rather than a new engineering project. Coverage is commonly advertised as \"500+ wearables and apps\" (Terra and Spike market 500+, Junction cites hundreds of devices, Rook cites 400+), though exact counts move constantly — verify against the vendor's live integrations page before you rely on a number.\n\n## How it works\n\nThe flow is the same in shape across vendors:\n\n1. **You integrate once** with the aggregator's API and register a webhook endpoint.\n2. **The user connects a device** through the aggregator's widget or connect flow — a hosted screen where they pick their device and authorize it. The aggregator orchestrates the underlying OAuth (or the on-device permission prompt) for you.\n3. **New data arrives by webhook.** When the user's device syncs, the aggregator normalizes the payload and POSTs it to your endpoint in its standard schema. You verify the signature, store it, and update your app — no polling loop to maintain.\n\nThat webhook delivery is what makes recovery scores and activity feeds feel current. (Webhooks and the OAuth consent step each have their own explainer: [what are webhooks](/learn/what-are-webhooks) and [OAuth for health data](/learn/what-is-oauth-for-health-data).)\n\n## Trade-offs to weigh\n\nAn aggregator buys you speed and lower maintenance, but it is not free of cost or caveats.\n\n- **Cost.** Aggregators charge a recurring vendor fee, typically per connected user or by usage tier, on top of whatever the underlying providers require. Model your connected-user growth before committing, because the bill scales with it.\n- **You often still need provider credentials.** For several popular sources — commonly Garmin and a few others — you (or the aggregator on your behalf) must still register a developer app and get approved. The aggregator simplifies per-provider onboarding but does not always eliminate it. Verify which providers on your list require it.\n- **Abstraction limits.** The normalized schema may not expose every provider-specific field, and you inherit the aggregator's coverage, latency, and any downtime. You are trading some control for convenience.\n- **Data and compliance posture.** Health data now flows through a third party, so HIPAA and SOC 2 posture and a signed BAA matter. Terra, for example, states HIPAA compliance and SOC 2 — verify the current status of any vendor you name.\n\n## A concrete example\n\nA coaching app wants sleep and recovery data from Oura, Whoop, and Garmin. The direct path is three separate integrations, three OAuth setups, three schemas to reconcile. With an aggregator, the app integrates once; a user authorizes their device a single time through the aggregator's connect flow; and the app receives normalized recovery data for all three at one webhook — in the same shape whether it originated from an Oura ring or a Garmin watch.\n\n## Where this fits\n\nThis page defines the concept. When you are ready to go deeper:\n\n- To choose a vendor, see the side-by-side comparison of [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) (Terra, Junction/Vital, Rook, Spike) on coverage, access friction, and pricing.\n- To implement one, see the hands-on [Terra API integration guide](/integrate/terra-api).\n- For the bigger picture of where aggregators sit among content, wearable, and motion APIs, start with [what is a fitness API](/learn/what-is-a-fitness-api).\n\n*Product and pricing details above are current as of 2026 and change often — verify provider rosters, coverage counts, and compliance status on each vendor's live documentation before you build against them.*",
    "faqs": [
      {
        "q": "What is a health-data aggregator?",
        "a": "It is a single third-party integration that connects to many wearables and health providers, normalizes their data into one consistent schema, and delivers new data to your webhook. It saves you from building and maintaining a separate integration for each device. Terra, Junction (formerly Vital), Rook, and Spike are the main providers as of 2026."
      },
      {
        "q": "Why use a health-data aggregator instead of integrating each provider directly?",
        "a": "To avoid the 'N integrations' problem. Supporting five wearables directly means five OAuth setups, five data formats, five sets of rate limits, and five sources of breaking changes to maintain forever. An aggregator collapses that into one integration and one schema, so adding another device is usually a config change rather than a new project."
      },
      {
        "q": "How does a health-data aggregator work?",
        "a": "You integrate once and register a webhook endpoint. The user connects their device through the aggregator's widget or connect flow, which orchestrates the underlying OAuth or on-device permission for you. When the device syncs, the aggregator normalizes the data and POSTs it to your endpoint in its standard schema, so you get fresh data without polling."
      },
      {
        "q": "What are the trade-offs of using an aggregator?",
        "a": "You pay a recurring vendor fee (often per connected user) on top of the providers themselves. For several sources such as Garmin you may still need to register your own developer app and get approved. The normalized schema may not expose every provider-specific field, and health data now flows through a third party, so HIPAA and SOC 2 posture and a BAA matter. Verify per-provider requirements and vendor compliance status."
      },
      {
        "q": "Does an aggregator cover both cloud APIs and on-device data like Apple HealthKit?",
        "a": "Yes. An aggregator's servers pull from cloud/OAuth providers (Fitbit, Garmin, Oura, Whoop, Strava), and its mobile SDKs read from on-device stores like Apple HealthKit and Google Health Connect. It unifies both routes behind one integration rather than being an either/or layer."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-a-fitness-api",
        "label": "What is a fitness API?"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/integrate/terra-api",
        "label": "How to integrate Terra"
      },
      {
        "href": "/learn",
        "label": "All fitness & health API concepts"
      }
    ],
    "cta": {
      "pitch": "We break down a new wearable and health-data API every week, including the aggregator provider-credential gotchas and pricing-model traps — subscribe and skip the surprises."
    }
  },
  {
    "slug": "on-device-vs-cloud-health-data",
    "primaryQuery": "on-device vs cloud health data",
    "h1": "On-Device vs Cloud Health Data: What's the Difference?",
    "metaTitle": "On-Device vs Cloud Health Data Explained",
    "metaDescription": "On-device stores (HealthKit, Health Connect) keep data on the phone; cloud/OAuth APIs (Fitbit, Strava) serve it from the provider. When to use each.",
    "updated": "2026-07-09",
    "answer": "Health and fitness data reaches your app by one of three routes. On-device stores like Apple HealthKit and Google Health Connect hold data on the user's phone under an OS-granted permission, with no vendor server to query. Cloud or OAuth APIs like Fitbit, Strava, and Oura keep data on the provider's servers, and your backend fetches it server-to-server using OAuth tokens. Aggregators like Terra and Junction are a single integration that fronts both. On-device is privacy-forward but platform-locked and device-bound; cloud/OAuth gives always-on server access across platforms; aggregators buy reach across both for a recurring fee.",
    "body": "Health and fitness data reaches your app by one of three routes, and picking among them is an architecture decision you make early. **On-device stores** (Apple HealthKit, Google Health Connect) keep data on the user's phone under an OS-granted permission — there is no vendor server you can query with a token. **Cloud / OAuth APIs** (Fitbit, Strava, Oura, Whoop, Garmin) keep data on the provider's servers, and your backend fetches it server-to-server using OAuth tokens. **Aggregators** (Terra, Junction, Rook, Spike) are a single integration that fronts both of the above.\n\nThe trade-off in one line: on-device is privacy-forward and rich in first-party phone data but device-bound and platform-locked; cloud/OAuth gives you always-on server access across platforms but only for data the provider holds; aggregators buy you reach across both at the cost of a recurring fee and a third party in the data path.\n\n## The three shapes, in more depth\n\n### On-device platform stores\n\nApple HealthKit (iOS) and Google Health Connect (Android) are the two OS-level health stores. The operating system holds an encrypted local database on the phone. Your app requests permission per data type, and the user grants or denies it in a system dialog. You then read the data **on the device**. If you need it server-side, *your own app* uploads it to your backend — the platform runs no cloud aggregation service and exposes no server endpoint that returns a user's data in exchange for a token.\n\nThree defining traits:\n\n- **OS permission, not OAuth** — the user authorizes in a system dialog, per data type. There is no token, no refresh cycle, and no server to present a token to. (HealthKit permissions are also privacy-preserving: an app can be told nothing about *read* denials, and users can revoke individual data types silently.)\n- **Platform-locked** — HealthKit is Apple-only; Health Connect is Android-only. There is no cross-platform version of either.\n- **No server** — access requires your app to be installed and running on that specific device.\n\nOne note on the Android side: **Google Health Connect is now the Android standard**, and from Android 14 it ships as part of the OS. It stores data on-device, unlike the older cloud-based Google Fit, whose REST/Android APIs stopped new signups on 1 May 2024 and are being wound down toward end-of-service in late 2026 *(verify the exact dates)*.\n\n### Cloud / OAuth APIs\n\nFitbit, Strava, Oura, Whoop, and Garmin store the user's data on their own servers. The user authorizes your app through OAuth — a consent flow where they log in at the provider and approve specific scopes, and your backend receives access and refresh tokens. Your server then calls the provider's REST API with the access token and can keep syncing (via polling or webhooks) **even when the phone app is not open**. Because the data and the auth both live in the cloud, this route is inherently cross-platform and always-on.\n\n### Aggregators\n\nAn aggregator is one integration that connects to many of the above sources on your behalf and returns their data in one normalized schema. It orchestrates the OAuth flows for cloud providers and, via mobile SDKs, can also read the on-device stores — then delivers everything to a single webhook. You trade a recurring vendor fee (and a third party in your data path, which raises HIPAA/BAA questions) for skipping the per-provider maintenance burden.\n\n## When each route applies\n\n- **Use on-device** when you want the richest first-party phone data — Apple Watch metrics that only surface in HealthKit, for example — you have a native app on that platform, and you are comfortable that access is device-bound and per-platform.\n- **Use cloud / OAuth** when you need server-side, always-on access independent of any one phone, or when the data simply lives in a provider's cloud (Strava activities, Fitbit account history).\n- **Use an aggregator** when you want many sources — on-device and cloud, across brands — through one normalized integration and you would rather pay than build and maintain N connections.\n\n## Comparison at a glance\n\n| | On-device stores | Cloud / OAuth APIs | Aggregators |\n|---|---|---|---|\n| Examples | Apple HealthKit, Google Health Connect | Fitbit, Strava, Oura, Whoop, Garmin | Terra, Junction, Rook, Spike |\n| Where data lives | On the user's phone | Provider's servers | Fronts both |\n| How user authorizes | OS permission dialog (per data type) | OAuth tokens (scopes) | Aggregator flow (runs OAuth for you) |\n| Server access without the phone | No — app must run on the device | Yes — server-to-server | Yes |\n| Platform reach | Locked (iOS *or* Android) | Cross-platform | Cross-platform, many brands |\n| Privacy posture | Data stays local; privacy-forward | Data flows through provider cloud | Third party in the data path |\n| Cost | Free (platform SDK) | Free tier plus provider limits | Recurring vendor fee |\n\n## A concrete example\n\nAn iOS app reads today's workouts straight from HealthKit on the phone, with no server involved. A web dashboard that must show a user's runs whether or not their phone is nearby uses Strava's cloud OAuth API instead. An app that wants both — first-party phone metrics *and* cloud activity, across brands — reaches for an aggregator so it maintains one integration rather than many.\n\n## Where this fits\n\nThis page defines the three routes. To go deeper on the on-device pair, compare [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect), and to actually wire up the Apple side, follow the [HealthKit integration guide](/integrate/healthkit). The cloud route runs on tokens — see [what OAuth for health data is](/learn/what-is-oauth-for-health-data) — and the aggregator route is covered in [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis).\n\n*This is general product and engineering information, not medical advice.*",
    "faqs": [
      {
        "q": "What is the difference between on-device and cloud health data?",
        "a": "On-device health data lives in an encrypted store on the user's phone (Apple HealthKit on iOS, Google Health Connect on Android), and your app reads it locally after the user grants an OS permission. Cloud health data lives on a provider's servers (Fitbit, Strava, Oura), and your backend fetches it server-to-server using OAuth tokens. The key practical difference is that cloud APIs give you always-on server access without the phone, while on-device access requires your app to be installed and running on that specific device."
      },
      {
        "q": "Do Apple HealthKit and Google Health Connect use OAuth?",
        "a": "No. Both use OS-level permissions rather than OAuth. The user grants access per data type in a system dialog, there is no access or refresh token, and there is no server to present a token to. OAuth is used by cloud providers such as Fitbit, Strava, and Garmin, whose data lives on their own servers."
      },
      {
        "q": "When should I use a cloud API instead of an on-device store?",
        "a": "Use a cloud/OAuth API when you need server-side, always-on access that does not depend on a specific phone being present, or when the data simply lives in the provider's cloud, such as Strava activities or Fitbit account history. Use an on-device store when you want the richest first-party phone data, you have a native app on that platform, and you are comfortable that access is device-bound and per-platform."
      },
      {
        "q": "Can I get both on-device and cloud data through one integration?",
        "a": "Yes, that is what an aggregator like Terra, Junction, Rook, or Spike does. It orchestrates OAuth for cloud providers and, via mobile SDKs, can read on-device stores, then returns everything in one normalized schema. The trade-offs are a recurring vendor fee and a third party in your data path, which raises HIPAA and business-associate-agreement considerations to verify per vendor."
      },
      {
        "q": "Is on-device health data more private than cloud data?",
        "a": "Generally yes, in the sense that on-device data stays on the phone and never touches a vendor's cloud unless your own app uploads it. HealthKit permissions are also privacy-preserving, since an app can be told nothing about read denials and users can revoke individual data types silently. Cloud data, by contrast, flows through the provider's servers, so its handling and your own storage of it carry more privacy and compliance weight."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-a-fitness-api",
        "label": "What is a fitness API?"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/integrate/healthkit",
        "label": "How to integrate Apple HealthKit"
      },
      {
        "href": "/learn",
        "label": "All fitness & health API concepts"
      }
    ],
    "cta": {
      "pitch": "Deciding between on-device stores, cloud OAuth APIs, and aggregators for your next build? Get our plain-English fitness and health API breakdowns in your inbox."
    }
  },
  {
    "slug": "what-is-oauth-for-health-data",
    "primaryQuery": "OAuth for health data",
    "h1": "What Is OAuth 2.0 (and How Health APIs Use It)?",
    "metaTitle": "What Is OAuth 2.0 for Health Data?",
    "metaDescription": "OAuth 2.0 lets users grant your app scoped, revocable access to their health data without a password. Learn the auth-code flow and on-device exception.",
    "updated": "2026-07-09",
    "answer": "OAuth 2.0 is the industry-standard authorization framework that lets a user grant your app limited access to their data on another service without sharing their password. Cloud health APIs like Fitbit, Strava, Oura, and Garmin use its authorization-code flow: the user consents on the provider's screen, your app receives an access token (scoped to specific data) plus a refresh token to renew it, and the user can revoke access at any time. Health APIs use it because health data is user-owned and sensitive, so consent must be explicit, granular, and revocable. The key exception is on-device stores — Apple HealthKit and Google Health Connect use OS-level permissions, not OAuth, with no tokens at all.",
    "body": "**OAuth 2.0** is the industry-standard authorization framework that lets a user grant your app limited access to their data on another service without ever handing over their password. When you integrate a cloud health provider — Fitbit, Strava, Oura, Garmin, Whoop — this is almost always how the user says \"yes, my app may read my heart rate.\" The user consents on the provider's own screen, your app receives tokens scoped to just the data you asked for, and the user can revoke that access at any time.\n\nThis page defines the concept. For the hands-on version — registering an app, wiring the redirect, storing tokens — see the per-provider walkthroughs under [/integrate](/integrate). When auth breaks in production, jump to [Why is my fitness API returning 401 Unauthorized?](/fix/fitness-api-401-unauthorized).\n\n## The authorization-code flow, in plain terms\n\nHealth APIs use OAuth's **authorization-code flow**. It has four moving parts, and the order matters:\n\n1. **Redirect to consent.** Your app sends the user to the provider's consent screen, listing the **scopes** (specific permissions, e.g. read heart rate, read sleep) you are requesting.\n2. **User approves at the provider.** The user logs in on the provider's site — not in your app — and approves. The provider redirects back to your **redirect URI** with a short-lived **authorization code**.\n3. **Exchange the code for tokens.** Your backend swaps that code, plus your client credentials, for an **access token** and a **refresh token**.\n4. **Call the API, then refresh.** Your app calls the API with the access token. When it expires, you use the refresh token to mint a new one — no need to re-prompt the user.\n\nThe key idea is that your app never sees the user's password. It only ever holds tokens, and those tokens are deliberately limited.\n\n### Scopes: least privilege\n\n**Scopes** bind what a token can do. A token granted only the sleep scope cannot read location or write workouts. The rule of thumb is least privilege: request only the scopes your features actually use. Asking for more makes the consent screen scarier and widens the blast radius if a token leaks. Scope names differ per provider, so verify each provider's exact scope strings.\n\n### Access tokens vs. refresh tokens\n\nThese two tokens do different jobs, and confusing them is a common source of bugs:\n\n| Token | Lifetime | Purpose |\n| --- | --- | --- |\n| Access token | Short (often an hour) | Sent on every API call to authenticate the request |\n| Refresh token | Long-lived | Exchanged for a new access token when the old one expires |\n\nWhen an access token expires you get a `401`, refresh silently, and retry. When a refresh token itself stops working — revoked, rotated, or expired — the user has to re-authorize.\n\n### PKCE and state\n\nMany health providers require two hardening additions: **PKCE** (Proof Key for Code Exchange), which stops an intercepted authorization code from being redeemed by an attacker, and a **state** parameter, which guards against cross-site request forgery on the redirect. Treat both as expected, not optional, and verify each provider's requirements.\n\nA tiny illustrative shape of what step 3 returns:\n\n```json\n{\n  \"access_token\": \"…\",\n  \"refresh_token\": \"…\",\n  \"expires_in\": 3600,\n  \"scope\": \"sleep heartrate\",\n  \"token_type\": \"Bearer\"\n}\n```\n\nYou store the `refresh_token` securely on your server and use the `access_token` on the `Authorization: Bearer …` header of each request until it expires.\n\n## Why health APIs use OAuth\n\nHealth data is **user-owned and sensitive**, and OAuth's design maps cleanly onto that:\n\n- **Explicit, granular consent.** The user sees exactly which data types your app is asking for and approves them by name.\n- **No password sharing.** Credentials stay with the provider; a token leak never exposes the user's login.\n- **Revocable at any time.** The user can withdraw access from the provider's settings, and your tokens simply stop working.\n- **Limited blast radius.** Scopes cap what a token can touch, and short-lived access tokens shrink the window in which a stolen one is useful.\n\nThat combination — consent, revocability, least privilege, expiry — is why it became the norm for personal health data rather than shipping around API keys or passwords.\n\n## The on-device exception\n\nHere is the part that trips people up: **on-device health stores do not use OAuth at all.** Apple **HealthKit** (iOS) and Google **Health Connect** (Android) use **OS-level permissions** instead. The user grants access per data type in a system dialog; there is no authorization code, no access or refresh token, and no server to present a token to — the data lives on the phone and your app reads it locally.\n\nSo \"how does the user authorize my app?\" has two answers depending on the route:\n\n| Route | Authorization mechanism | Where the data lives |\n| --- | --- | --- |\n| Cloud APIs (Fitbit, Strava, Oura, Garmin, Whoop) | OAuth 2.0 tokens | Provider's servers |\n| On-device stores (HealthKit, Health Connect) | OS permission dialog | The user's phone |\n\nOne subtlety worth knowing: HealthKit permissions are privacy-preserving and asymmetric — an app is told nothing about *read* denials (so you can't tell \"no data\" from \"access denied\"), and users can silently revoke individual data types. That's a very different failure mode from an OAuth `401`. For the fuller comparison, see [On-device vs. cloud health data](/learn/on-device-vs-cloud-health-data) and [Apple HealthKit vs. Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect).\n\n## A concrete example\n\nTo show a user's sleep from **Fitbit**: your app sends them to Fitbit's consent screen requesting the sleep scope. They log in at Fitbit and approve. Your server exchanges the returned code for tokens, stores the refresh token, and syncs each night — refreshing the access token whenever it expires. That's OAuth end to end.\n\nTo show sleep from an **Apple Watch** instead: there is no OAuth anywhere. Your iOS app asks for HealthKit sleep permission in a system dialog, the user taps allow, and you read the samples straight off the device.\n\nSame feature, two completely different authorization models — which is exactly why it helps to know which route a given provider uses before you start wiring anything up.\n\n## Where this fits\n\nThis page defines OAuth for health data. To actually implement it, the per-provider guides under [/integrate](/integrate) walk through registering your app, handling the redirect, and storing tokens. When the flow breaks, two fixes cover the most common failures: [fitness API 401 Unauthorized](/fix/fitness-api-401-unauthorized) for expired or rejected tokens, and [refresh token not working](/fix/refresh-token-not-working) when re-authorization is the only way out. If you're weighing whether to run all this yourself, a [health-data aggregator](/learn/what-is-a-health-data-aggregator) can orchestrate OAuth for many providers behind one integration.",
    "faqs": [
      {
        "q": "What is OAuth 2.0 in simple terms?",
        "a": "OAuth 2.0 is an authorization framework that lets a user grant one app limited access to their data on another service without sharing their password. Your app never sees the user's login; it receives a token scoped to only the data the user approved, and the user can revoke that token whenever they want."
      },
      {
        "q": "How does the OAuth authorization-code flow work?",
        "a": "Your app redirects the user to the provider's consent screen listing the scopes you request. The user logs in at the provider and approves, and the provider redirects back with a short-lived authorization code. Your backend exchanges that code for an access token and a refresh token, then calls the API with the access token and uses the refresh token to renew it when it expires."
      },
      {
        "q": "What is the difference between an access token and a refresh token?",
        "a": "An access token is short-lived (often about an hour) and is sent on every API call to authenticate the request. A refresh token is long-lived and is exchanged for a new access token when the old one expires, so the user does not have to re-approve. When a refresh token itself stops working, the user must re-authorize."
      },
      {
        "q": "Why do health APIs use OAuth instead of API keys?",
        "a": "Health data is user-owned and sensitive, so authorization must be tied to the individual user's explicit consent. OAuth gives the user granular, revocable, per-scope permission, keeps their password with the provider, and limits the blast radius through scopes and expiring tokens. A shared API key or password offers none of that."
      },
      {
        "q": "Do HealthKit and Health Connect use OAuth?",
        "a": "No. Apple HealthKit and Google Health Connect are on-device stores that use OS-level permissions instead of OAuth. The user grants access per data type in a system dialog, there is no access or refresh token, and there is no server to present a token to. OAuth applies to cloud providers whose data lives on their servers, such as Fitbit, Strava, Oura, and Garmin."
      }
    ],
    "related": [
      {
        "href": "/learn/what-are-webhooks",
        "label": "What are webhooks?"
      },
      {
        "href": "/integrate",
        "label": "Integration guides"
      },
      {
        "href": "/fix/fitness-api-401-unauthorized",
        "label": "Fix: fitness API 401 unauthorized"
      },
      {
        "href": "/learn",
        "label": "All fitness & health API concepts"
      }
    ],
    "cta": {
      "pitch": "Get practical fitness and wearable API tips, including OAuth scopes, token refresh, and the on-device permission gotchas, in your inbox."
    }
  },
  {
    "slug": "what-are-webhooks",
    "primaryQuery": "what are webhooks",
    "h1": "What Are Webhooks (and Why Fitness APIs Use Them)?",
    "metaTitle": "What Are Webhooks? A Guide for Fitness APIs",
    "metaDescription": "A webhook is a server-to-server push: the provider POSTs to your callback URL when new data arrives, so you skip polling. Why wearable APIs rely on them.",
    "updated": "2026-07-09",
    "answer": "A webhook is a server-to-server push notification: instead of your app repeatedly polling a provider for new data, the provider sends an HTTP POST to a callback URL you register the moment a relevant event happens, such as a wearable syncing a new workout. Webhooks are secured with a validation handshake (you prove you own the endpoint) and signature verification (you check each payload was really sent by the provider). Fitness APIs favor them because wearable data arrives unpredictably, and webhooks deliver it near-real-time instead of leaving you to poll too often (hitting rate limits) or too rarely (showing stale data).",
    "body": "A webhook is a server-to-server push notification: instead of your app repeatedly asking a provider \"any new data yet?\" (polling), the provider sends an HTTP `POST` to a URL you registered — your callback endpoint — the moment a relevant event happens, such as a user's wearable syncing a fresh workout. In other words, polling is your server pulling on a timer; a webhook is the provider's server pushing to you on an event. For fitness and health apps, that difference is what makes a recovery score or an activity feed feel current instead of minutes stale.\n\n## A bit more depth: what \"the provider POSTs to your callback URL\" means\n\nEvery webhook has two sides. You own an HTTPS endpoint — a route on your backend like `/webhooks/strava` — that sits and waits. The provider owns a subscription: a record that says \"when event X happens for this app, POST to that URL.\" When the event fires (a new activity, a synced night of sleep, a deauthorization), the provider's servers open a connection to your endpoint and deliver a small JSON payload describing what changed. Your job is to accept it, acknowledge it fast, and process it.\n\nOne important nuance: many webhooks are *thin*. The payload often tells you *that* something changed and gives you an ID, not the full data. You then call the provider's regular API with that ID to fetch the details. So a webhook is frequently a doorbell, not a delivery — it tells you to go pick something up.\n\n## How it works\n\nThere are three moving parts to a working webhook integration.\n\n**1. Registration.** You tell the provider one public HTTPS URL to notify, usually once, either in a developer dashboard or by calling a subscription endpoint.\n\n**2. The validation handshake.** Before sending real events, most providers verify that you actually control the endpoint — commonly by sending a challenge value your endpoint must echo back. If the handshake fails, the subscription never activates.\n\n**3. Signature verification.** Because your endpoint is public, providers sign each payload — commonly an HMAC hash in a request header — with a secret only you share. You recompute the signature over the raw body and reject anything that doesn't match.\n\nThe registration calls, exact handshake shape, and signature scheme differ per provider; the [Strava integration guide](/integrate/strava-api) walks a real one end to end. Conceptually, the payload a provider delivers is usually *thin* — it looks roughly like this:\n\n```json\n{\n  \"object_type\": \"activity\",\n  \"object_id\": 1234567890,\n  \"aspect_type\": \"create\",\n  \"owner_id\": 9876543,\n  \"event_time\": 1752345600\n}\n```\n\nNotice there are no heart-rate samples or GPS points in that payload — just enough to know a new activity exists and whose it is. Your server acknowledges with a `200`, then fetches the full activity by its `object_id`. The golden rule: respond quickly (a `2xx` within a few seconds) and do the heavy processing *after* you've acknowledged, because providers treat a slow or failed response as a delivery failure and may retry or disable your subscription.\n\n## Polling vs. webhooks: the trade-off\n\nBefore webhooks, the only option was polling — calling the API on a schedule to check for changes. Polling is simple and needs no public endpoint, but it forces a bad choice:\n\n| | Polling | Webhooks |\n|---|---|---|\n| Freshness | As stale as your interval (poll every 15 min, data can be 15 min old) | Near-real-time; delivered when the event happens |\n| Efficiency | Wasteful — most calls return \"nothing new\" | Only fires when there's actually something new |\n| Rate limits | Poll often enough to feel live and you burn your quota | Far fewer calls, so quota goes further |\n| Setup | Just a scheduled job | Public HTTPS endpoint, handshake, signature checks |\n| Reliability | You control the schedule; nothing to miss | Must handle retries, duplicates, and missed deliveries |\n\nThe honest summary: polling is easier to stand up but scales badly on both freshness and rate limits; webhooks are more work to build correctly but are the right tool when data arrives unpredictably. Many robust integrations use webhooks as the primary path and a periodic poll as a backstop for anything a webhook delivery missed.\n\n## Why this matters for fresh wearable data\n\nWearable data does not arrive on a schedule — it arrives whenever a device syncs, which might be right after a run or hours later when the phone reconnects. That sporadic timing is exactly the case polling handles poorly: poll too often and you hit [rate limits](/fix/fitbit-api-429-rate-limit) while mostly getting nothing back; poll too rarely and your app shows stale numbers. Webhooks sidestep the dilemma by delivering data the instant the provider has it. That is what lets recovery scores, live activity feeds, and timely coaching nudges feel current rather than lagging. Health-data aggregators and cloud providers commonly deliver data via webhooks for this reason (some also offer streaming or polling).\n\n## A concrete example in a fitness app\n\nA user finishes a run. Their watch syncs to Strava's cloud. Strava's servers `POST` a thin event to your `/webhooks/strava` endpoint saying \"activity 1234567890 created for user 9876543.\" Your endpoint verifies the signature, immediately returns `200`, and hands the event to a background job. That job calls Strava's API for activity `1234567890`, pulls the distance, pace, and heart-rate stream, stores it, and updates the user's dashboard — all within seconds of the run finishing, with no polling loop running in the background. Once [OAuth](/learn/what-is-oauth-for-health-data) has authorized the connection, the webhook is what keeps it live.\n\n## Where this fits\n\nThis page defines the concept. When you're ready to wire one up, the hands-on guides go deeper:\n\n- **Setting one up for real:** [Integrating the Strava API](/integrate/strava-api) walks through registering a subscription, answering the validation handshake, and verifying signatures end to end.\n- **When it breaks:** [Strava webhook not firing](/fix/strava-webhook-not-firing) covers the usual culprits — a failed handshake, an unreachable URL, or a subscription that never activated — and [wearable data delayed](/fix/wearable-data-delayed) covers when events arrive but late.\n- **The bigger picture:** webhooks are the delivery half of most [health-data aggregators](/fitness-apis/health-data-aggregator-apis), which push normalized data from many devices to a single endpoint you own.",
    "faqs": [
      {
        "q": "What is a webhook in simple terms?",
        "a": "It is a way for one server to notify another automatically. Instead of your app asking a provider 'any new data?' on a timer (polling), the provider sends an HTTP POST to a URL you gave it whenever an event happens. Think of it as a doorbell: the provider rings your endpoint when there is something new, rather than you checking the door repeatedly."
      },
      {
        "q": "What is the difference between webhooks and polling?",
        "a": "Polling is your server pulling data on a schedule; a webhook is the provider's server pushing data to you when an event occurs. Polling is simpler to set up but wasteful and either laggy or rate-limit-hungry. Webhooks are more work to build correctly (public endpoint, handshake, signature checks) but deliver fresh data near-real-time and use far fewer API calls."
      },
      {
        "q": "How do you verify a webhook is legitimate?",
        "a": "Two mechanisms. First, a validation handshake at setup, where the provider sends a challenge value your endpoint must echo back before webhooks activate. Second, signature verification on every event: the provider signs the payload (commonly an HMAC in a header) with a shared secret, and you recompute that signature over the raw body and reject any request that does not match. Always use HTTPS."
      },
      {
        "q": "Does a webhook payload contain all the data?",
        "a": "Often no. Many webhooks are 'thin' notifications that tell you something changed and give you an ID (for example, a new activity ID), not the full record. You then call the provider's regular API with that ID to fetch the details. So a webhook is frequently a signal to go retrieve data, not the data delivery itself."
      },
      {
        "q": "Why do fitness and wearable APIs use webhooks?",
        "a": "Wearable data arrives sporadically, whenever a device syncs, so there is no good polling interval. Poll too often and you burn through rate limits getting mostly empty responses; poll too rarely and your app shows stale numbers. Webhooks deliver data the instant the provider has it, which is what makes recovery scores, live activity feeds, and timely coaching feel current."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-oauth-for-health-data",
        "label": "What is OAuth for health data?"
      },
      {
        "href": "/fix/strava-webhook-not-firing",
        "label": "Fix: Strava webhook not firing"
      },
      {
        "href": "/integrate/strava-api",
        "label": "How to integrate the Strava API"
      },
      {
        "href": "/learn",
        "label": "All fitness & health API concepts"
      }
    ],
    "cta": {
      "pitch": "We break down one wearable and health-data API integration every week — webhook handshakes, signature gotchas, and rate-limit traps included — so subscribe and skip the surprises."
    }
  },
  {
    "slug": "what-is-pose-estimation",
    "primaryQuery": "what is pose estimation",
    "h1": "What Is Pose Estimation (for Fitness Apps)?",
    "metaTitle": "What Is Pose Estimation for Fitness Apps?",
    "metaDescription": "Pose estimation is computer vision that locates body joints in camera frames — the basis for camera-based rep counting and form feedback in fitness apps.",
    "updated": "2026-07-09",
    "answer": "Pose estimation is a computer-vision technique that locates body keypoints (joints such as shoulders, elbows, hips, and knees) in a camera image or video frame and outputs their coordinates plus a confidence score. A trained model returns those keypoints per frame, in 2D or rough 3D. In fitness apps it is the foundation for camera-based rep counting and form feedback: your app turns the keypoints into joint angles and motion over time. It typically runs on-device and in real time, so camera frames stay on the phone.",
    "body": "Pose estimation is the computer-vision technique that lets a phone camera \"see\" a body and pinpoint where the joints are. Instead of a wearable strapped to the wrist, the camera feed is the sensor: a model looks at each frame and returns the coordinates of a fixed set of body keypoints — shoulders, elbows, hips, knees, ankles, and more. Those keypoints are the raw material for camera-based rep counting and exercise form feedback, which is why pose estimation sits underneath most \"AI workout tracking\" features.\n\n## What pose estimation actually outputs\n\nA pose-estimation model takes an image or video frame and predicts, per frame, the position of a fixed set of **landmarks** (also called keypoints or joints). For each landmark you typically get:\n\n- an **x, y** pixel position (and, in some models, a **z / depth** value for a rough 3D pose),\n- a **confidence score** (how sure the model is that the landmark is where it says), and\n- a **name** (e.g. `left_knee`, `right_shoulder`).\n\nDifferent models track a different number of landmarks. Two that are widely cited in fitness contexts:\n\n| Model | Keypoints | Notable traits |\n|-------|-----------|----------------|\n| MediaPipe BlazePose | 33 | The 17 standard COCO body points plus extra face, hand, and foot landmarks; provides 3D keypoints and a segmentation mask; built for demanding domains like yoga, fitness, and dance |\n| TensorFlow MoveNet | 17 | Optimized for speed; reported at 50+ fps on modern phones and laptops |\n\nMore points is not automatically \"better\" — it is a trade-off. BlazePose's extra foot and 3D landmarks help with movements where depth and foot placement matter; MoveNet's leaner 17-point output is tuned for raw speed. (Keypoint counts and model specs evolve across versions, so verify against current model docs before you commit — as of 2026.)\n\n## How it works, at a high level\n\nYou do not have to write the vision model yourself. In practice pose estimation is an embedded SDK or library — MediaPipe, TensorFlow's MoveNet, or a vendor SDK — and your app does roughly this each frame:\n\n1. Grab a camera frame.\n2. Run the pose model on it, getting back the keypoint list described above.\n3. Turn those keypoints into meaning with your own logic.\n\nThat third step is where the product lives. Common transforms:\n\n- **Joint angles** — e.g. the knee angle (hip-knee-ankle) to judge squat depth.\n- **Motion over time** — tracking a keypoint or angle across frames to detect the up/down cycle of a rep and count it.\n- **Alignment / form checks** — comparing angles or the relative position of keypoints to a reference to flag issues like knees caving inward.\n\nThe model gives you geometry; your app decides what good form and a completed rep look like.\n\n## Why it matters for fitness apps\n\nPose estimation lets a plain phone camera replace motion sensors. That enables features that would otherwise need a wearable or specialized hardware:\n\n- **Rep counting** without a strap or watch.\n- **Form feedback** — real-time corrective cues (\"go lower,\" \"knees out\").\n- **Gamification and coaching** driven by how the user actually moves.\n\nTwo properties make this practical, and they are the traits worth internalizing:\n\n- **On-device.** The model runs locally on the phone. Camera frames do not need to leave the device, which is a meaningful privacy posture — you are not shipping video of someone's living room to a server.\n- **Real-time.** Because inference happens per frame on the device, feedback can be effectively instant. Live corrective coaching only works if the loop from movement to on-screen cue is fast, and on-device execution is what keeps that latency low.\n\nFor a builder, the takeaway is that pose estimation is usually an SDK you embed, not a cloud endpoint you call — a different integration shape from wearable-data or aggregator APIs.\n\n## A concrete example\n\nDuring a squat set, the app runs BlazePose on the live camera feed. Each frame it computes the hip and knee angles. It counts a rep every time the user descends past a depth threshold and stands back up, and it flags \"knees caving in\" when the knee-to-ankle alignment drifts. All of that happens locally, in real time, with no wearable involved — the camera is the only sensor.\n\n## The limits — framing, lighting, occlusion\n\nPose estimation is powerful but not magic, and the honest failure modes are physical, not exotic:\n\n- **Framing.** If part of the body is out of frame, or the user is too close or too far, keypoints get lost or jitter. The camera has to actually see the joints it is estimating.\n- **Lighting.** Low light, strong backlight, or heavy shadows reduce confidence and accuracy.\n- **Occlusion.** When one body part hides another (a leg behind a leg, an arm across the torso), the model has to guess the hidden landmark, and confidence drops.\n- **Confidence is a signal, not a guarantee.** Low-confidence keypoints should be treated as uncertain — building on a noisy landmark as if it were exact is a common source of bad rep counts and false form flags.\n\nNone of these are dealbreakers; they are design constraints. Good camera-tracking products coach the user into a workable setup (frame your whole body, decent light) and lean on confidence scores rather than trusting every keypoint blindly.\n\n## Where this fits\n\nThis page defines the concept. To actually build with it:\n\n- For the hands-on how-to of wiring a camera and a pose model into your app, see the guide on [camera pose tracking](/guides/camera-pose-tracking).\n- For the products and SDKs that package pose estimation (plus rep counting and form feedback) so you do not build the pipeline from scratch, see [AI workout tracking APIs](/fitness-apis/ai-workout-tracking-apis).\n- Pose estimation is the \"AI motion\" category of the broader [fitness API](/learn/what-is-a-fitness-api) landscape — distinct from wearable-data APIs because it *generates* movement data from the camera rather than syncing it from a device.",
    "faqs": [
      {
        "q": "What is pose estimation in simple terms?",
        "a": "It is computer vision that finds where a person's joints are in a camera frame. A model looks at each frame and returns coordinates for a fixed set of body keypoints — shoulders, elbows, hips, knees, ankles, and so on — usually with a confidence score for each. Those keypoints are the raw data behind camera-based rep counting and form feedback."
      },
      {
        "q": "How does pose estimation work?",
        "a": "A trained model takes a camera frame and predicts the pixel position (and sometimes a depth value) of each landmark, plus a confidence score. Your app then turns those keypoints into meaning: joint angles to judge depth, motion over time to count reps, and alignment checks to flag form issues. The model provides geometry; your app decides what a good rep and good form look like."
      },
      {
        "q": "How many keypoints does pose estimation track?",
        "a": "It depends on the model. MediaPipe BlazePose tracks 33 keypoints (the 17 standard COCO body points plus extra face, hand, and foot landmarks, with 3D output), while TensorFlow MoveNet tracks 17 and is optimized for speed. More points is a trade-off, not automatically better. Verify keypoint counts against current model docs, since specs change across versions."
      },
      {
        "q": "Does pose estimation run on-device or in the cloud?",
        "a": "For fitness use it typically runs on-device and in real time as an embedded SDK or library, not a cloud endpoint. Running locally keeps camera frames on the phone (a privacy benefit) and keeps latency low enough for live corrective feedback."
      },
      {
        "q": "What are the limits of pose estimation?",
        "a": "Accuracy depends on physical conditions. Poor framing (body out of frame, too close or too far), bad lighting, and occlusion (one body part hiding another) all reduce confidence and can cause jitter or wrong keypoints. Treat low-confidence keypoints as uncertain rather than exact, and coach users into a good setup — full body in frame, decent light."
      }
    ],
    "related": [
      {
        "href": "/guides/camera-pose-tracking",
        "label": "Camera pose tracking, explained"
      },
      {
        "href": "/fitness-apis/ai-workout-tracking-apis",
        "label": "Best AI workout tracking APIs"
      },
      {
        "href": "/build/ai-fitness-coaching-app",
        "label": "How to build an AI fitness coaching app"
      },
      {
        "href": "/learn",
        "label": "All fitness & health API concepts"
      }
    ],
    "cta": {
      "pitch": "We break down the tech behind camera-based fitness — pose models, rep counting, form feedback — one clear explainer a week, so subscribe and skip the guesswork."
    }
  },
  {
    "slug": "what-is-hrv",
    "primaryQuery": "what is HRV",
    "h1": "What Is HRV (Heart Rate Variability)?",
    "metaTitle": "What Is HRV (Heart Rate Variability)?",
    "metaDescription": "HRV is the variation in time between heartbeats (RMSSD/SDNN), used as a general recovery and stress signal. Compare to your own baseline, not others.",
    "updated": "2026-07-09",
    "answer": "Heart rate variability (HRV) is the variation in time between consecutive heartbeats. Wearables derive it from the inter-beat intervals captured by an optical (PPG) or electrical (ECG) sensor, usually averaged over an overnight window, and typically report the time-domain metric RMSSD in milliseconds (SDNN, the overall variability, is classically a 24-hour clinical measure). It is used as a general recovery and stress-balance signal, not a diagnosis. HRV is highly individual, so it should be compared against a person's own baseline, never across people or between brands.",
    "body": "**Heart rate variability (HRV) is the variation in time between consecutive heartbeats** — the tiny, constantly changing gaps between one beat and the next. A healthy heart is not a metronome: even at a steady pulse, the interval between beats fluctuates from beat to beat, largely under the control of your autonomic nervous system. HRV summarizes how much that timing varies, and it is widely used as a **general recovery and stress-balance signal**.\n\n> **General information, not medical advice.** HRV from a consumer wearable is a wellness signal, not a clinical measurement or a diagnosis. Nothing here describes a medical condition or a treatment. Treat any HRV number as a trend to watch against a person's own baseline, not a verdict about their health, and point users to a professional for anything health-related.\n\n## What HRV actually measures\n\nThe raw ingredient is the **inter-beat interval (IBI)** — also called the RR or NN interval — the time in milliseconds between one heartbeat and the next. If your heart beats roughly once per second, those intervals are never exactly 1000 ms; they might read 980, 1010, 995, 1030, and so on. HRV is a statistic that captures the spread of those numbers.\n\nTwo time-domain metrics dominate:\n\n- **RMSSD** (root mean square of successive differences) — the square root of the average of the squared differences between adjacent intervals. It reflects short-term, beat-to-beat changes driven mainly by the parasympathetic (\"rest and digest\") branch of the nervous system. It can be computed from short windows, which is why **most consumer wearables report RMSSD**, usually averaged over an overnight window for stability.\n- **SDNN** (standard deviation of NN intervals) — the standard deviation of all the intervals, capturing overall variability (both short- and long-term). It is classically measured over a full 24-hour period.\n\nBoth are expressed in **milliseconds (ms)**. Higher variability generally reflects more parasympathetic (\"rest and digest\") influence; lower variability reflects less. RMSSD is primarily a marker of that parasympathetic (vagal) activity, not a clean measure of sympathetic \"fight or flight\" tone.\n\n## How a wearable measures it\n\nWearables derive HRV from the same inter-beat intervals, captured one of two ways:\n\n- **PPG (photoplethysmography)** — the optical method used by most wrist and ring devices. Green LEDs shine into the skin and a photodiode reads the pulsatile change in blood volume with each beat. The device detects each pulse and times the gaps between them.\n- **ECG (electrocardiography)** — the electrical method used by chest straps and ECG-capable watches. It reads the heart's electrical signal directly and is more precise for beat timing.\n\nBecause a single reading is noisy — motion, loose fit, ambient light, and poor skin contact all degrade optical beat detection — devices typically compute HRV over a **consistent overnight window** while you are still. That averaging is what turns a jittery signal into something trend-worthy.\n\n## Why it matters when you build\n\nIf you surface wearable data, HRV is one of the metrics users care most about, because it is commonly framed as a **recovery, stress, and training-readiness signal**. An overnight HRV that sits below a person's own recent average *can* accompany fatigue, stress, illness, alcohol, or incomplete recovery; a higher value *can* accompany good recovery. That is directional wellness information only — never present it as a diagnosis.\n\nThe critical thing to get right in your product is the **framing**, covered below. Get that wrong and you will mislead users or invite unfair cross-device comparisons.\n\n## The critical framing: HRV is intensely individual\n\nThis is the single most important rule when you display HRV:\n\n- **Compare to the person's own baseline, never across people.** Population \"normal\" HRV bands are extremely wide and strongly age-dependent, so an absolute number tells you little in isolation. What carries signal is how today compares to *this user's* own rolling average (for example, \"your overnight RMSSD is below your 30-day average\"), not how they compare to anyone else.\n- **Values are not interchangeable across brands.** Different sensors (PPG vs. ECG), different aggregation windows (a single nightly average vs. continuous), and proprietary algorithms mean the \"same\" HRV differs between Apple, Garmin, Fitbit, Oura, Whoop, and others. Do not imply that a number from one device is portable to another or comparable against a chart.\n- **Trends over a consistent window beat single readings.** PPG-derived HRV is noisier than ECG. One reading can be an artifact; a multi-day trend measured the same way each night is what you should surface.\n\nA safe pattern for UI copy is directional and personal: \"lower than your baseline,\" not \"your HRV is bad.\"\n\n## How HRV appears in a wearable API\n\nIn most fitness and wearable APIs, HRV arrives as a **daily (usually nightly) value** attached to a sleep or daily-summary object — a single number per day rather than a raw stream. Field shapes vary by vendor, but you will commonly see something like:\n\n```json\n{\n  \"date\": \"2026-07-12\",\n  \"average_hrv\": 48,\n  \"hrv_rmssd\": 48\n}\n```\n\nCommon field names include `hrv_rmssd`, `rmssd`, `average_hrv`, and sometimes `hrv_sdnn`. Some APIs also expose the raw `rr_intervals` or `ibi` arrays (in ms) so you can compute your own metric. The **aggregation window matters and differs by vendor** — a nightly average is not the same as a spot reading — so always confirm the exact field name, unit, and window in the specific API docs you integrate.\n\n## Measured vs. estimated (be honest with users)\n\nHRV sits in an unusual spot: it is **measured, but noisy**. The device really does time your heartbeats — it is not a pure model like an estimated VO2 max or calorie burn. But PPG beat detection is imperfect, especially for the high-frequency components HRV depends on, so consumer HRV is best treated as a **reliable-enough trend, not a precise clinical figure**. State that plainly wherever you show it, and keep all copy in general-wellness, non-diagnostic language.\n\n## Where this fits\n\nThis page defines HRV. When you are ready to actually pull it into a product:\n\n- See [wearable data APIs](/fitness-apis/wearable-data-apis) for how devices like Oura, Whoop, Garmin, and Fitbit expose HRV and other recovery metrics, and how aggregators normalize them.\n- See the [Oura API integration guide](/integrate/oura-api) for a concrete example of reading nightly HRV from a ring-based device.\n- For a related estimated metric with very different honesty caveats, see [what is VO2 max](/learn/what-is-vo2-max).",
    "faqs": [
      {
        "q": "What does HRV measure?",
        "a": "It measures how much the time between consecutive heartbeats varies. The raw input is the inter-beat interval (the RR or NN interval, in milliseconds), and HRV summarizes the spread of those intervals with metrics like RMSSD (short-term, parasympathetic variability), which most wearables report; SDNN (overall variability) is classically a 24-hour clinical measure. Higher variability generally reflects more 'rest and digest' influence. It is a general wellness signal, not a clinical diagnosis."
      },
      {
        "q": "How do wearables measure HRV?",
        "a": "They time the gaps between heartbeats. Most wrist and ring devices use optical PPG sensors (green LEDs reading blood-volume pulses), while chest straps and ECG watches read the heart's electrical signal directly, which is more precise. Because single readings are noisy, devices usually compute HRV over a consistent overnight window while you are still, then report an averaged daily value."
      },
      {
        "q": "What is a good HRV number?",
        "a": "There is no universal 'good' number, and comparing your HRV to someone else's or to a chart is misleading. Population ranges are very wide and strongly age-dependent, so an absolute value means little on its own. What matters is the trend against your own rolling baseline, measured the same way each night. Treat lower-than-your-baseline HRV as directional wellness information, not a diagnosis."
      },
      {
        "q": "Can I compare HRV across different devices or brands?",
        "a": "Not reliably. Different sensors (PPG vs. ECG), different aggregation windows, and proprietary algorithms mean the same person's HRV will differ between Apple, Garmin, Fitbit, Oura, Whoop, and others. HRV values are not interchangeable across brands, so keep a user on one device for trend tracking and avoid implying a number is portable."
      },
      {
        "q": "How does HRV appear in a wearable API?",
        "a": "Usually as a single daily (typically nightly) value on a sleep or daily-summary object, with field names like hrv_rmssd, rmssd, average_hrv, or sometimes hrv_sdnn, expressed in milliseconds. Some APIs also expose raw rr_intervals or ibi arrays so you can compute your own metric. The aggregation window differs by vendor, so confirm the exact field, unit, and window in the specific API docs."
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
        "href": "/integrate/oura-api",
        "label": "How to integrate the Oura API"
      },
      {
        "href": "/learn",
        "label": "All fitness & health API concepts"
      }
    ],
    "cta": {
      "pitch": "We break down how each wearable API exposes HRV and other recovery metrics, and how aggregators normalize them, in our weekly rundown for health-app builders."
    }
  },
  {
    "slug": "what-is-vo2-max",
    "primaryQuery": "what is VO2 max",
    "h1": "What Is VO2 Max (and How Do Wearables Estimate It)?",
    "metaTitle": "What Is VO2 Max? A Builder's Guide",
    "metaDescription": "VO2 max is the body's maximum rate of oxygen use, a cardiorespiratory-fitness proxy. See how wearables estimate it from heart rate and pace, not lab tests.",
    "updated": "2026-07-09",
    "answer": "VO2 max is the maximum rate at which the body can consume oxygen during intense exercise, measured in milliliters of oxygen per kilogram per minute (mL/kg/min), and it is a widely used proxy for aerobic fitness. On a wearable or fitness API it is almost always an estimate, not a measurement: the device models it from your heart rate and pace during activity rather than the lab gas-analysis test that produces a true VO2 max. Treat the number as a fitness trend to watch over time, not a precise clinical value. This is general wellness information, not medical advice.",
    "body": "## What is VO2 max?\n\nVO2 max is the maximum rate at which the body can consume oxygen during intense exercise, expressed in milliliters of oxygen per kilogram of body mass per minute (mL/kg/min). It is one of the most widely used proxies for aerobic, or cardiorespiratory, fitness: a higher VO2 max generally reflects a cardiovascular and respiratory system that can deliver and use more oxygen under load.\n\nThe critical thing for a builder to understand is that the VO2 max shown on a watch, ring, or fitness API is almost always an **estimate**, not a measurement. A true VO2 max comes from a lab test; the number in your data feed is a modeled value inferred from heart rate and pace. Treat it as a fitness trend to watch over time, not a precise clinical figure.\n\n> **General information, not medical advice.** VO2 max on a consumer wearable is a general wellness signal, not a diagnosis or a clinical assessment of cardiovascular health. Nothing here is medical advice.\n\n## A bit more depth\n\nPhysiologically, VO2 max represents the ceiling of aerobic energy production — the point where oxygen consumption plateaus even as exercise intensity keeps rising. It is shaped by how much oxygen-rich blood the heart can pump, how well the lungs and blood transport oxygen, and how effectively working muscles extract and use it.\n\nVO2 max tends to rise with consistent endurance training and declines gradually with age, so it is often surfaced alongside a \"fitness age\" or a fitness-level category. Because it summarizes aerobic capacity in a single number, it is popular in running and endurance apps as a long-run progress marker.\n\n## How wearables ESTIMATE it (this is the key point)\n\nWearables do not measure oxygen uptake. The gold-standard VO2 max is obtained from a **graded exercise test in a lab**, where you exercise to exhaustion while breathing through a mask that analyzes the oxygen and carbon dioxide in your exhaled air (a method called indirect calorimetry). No consumer device does this.\n\nInstead, wearables **model** VO2 max from the relationship between **heart rate and pace or speed** during activity, usually a GPS-tracked run or walk. The core idea: at a given pace, a lower heart rate implies better fitness. The algorithm combines that heart-rate-to-effort relationship with your demographic inputs (age, sex, weight) to output an estimate.\n\n- **Garmin** uses Firstbeat Analytics to derive its estimate from HR-versus-pace data during runs.\n- **Apple** combines heart-rate-response modeling with machine learning, using signals such as walking heart rate, speed, and heart-rate recovery.\n\nEither way, the result is an **estimate produced by a model**, not a value read off a sensor. That distinction is the single most important thing to communicate when you display it.\n\n## Why it matters to a builder\n\nIf you integrate a running or wearable data source, VO2 max is one of the most requested \"fitness level\" fields — but it is easy to misrepresent. Presenting an estimate as if it were a clinical measurement can mislead users and invites health-claim risk (this is health-adjacent, YMYL territory).\n\nTwo practical consequences shape your UI and copy:\n\n1. **It is a trend, not an absolute.** The most useful thing you can do with VO2 max is show its direction over weeks and months for the same person on the same device — not compare a user's number to other people or to a \"normal\" chart.\n2. **Values are not portable across brands.** Because each vendor uses its own model and inputs, the \"same\" user can get different VO2 max numbers from Apple, Garmin, and others. Don't imply the figures are interchangeable.\n\n## How it shows up in a fitness API\n\nVO2 max is typically a single scalar on a user-summary or activity-summary object, updated after a qualifying GPS-tracked run or walk, rather than a per-second time series. A simplified shape often looks like this:\n\n```json\n{\n  \"user_id\": \"abc123\",\n  \"vo2_max\": 47.2,\n  \"unit\": \"mL/kg/min\",\n  \"fitness_age\": 34,\n  \"updated_at\": \"2026-07-12T08:15:00Z\",\n  \"source\": \"garmin\"\n}\n```\n\nCommon field names include `vo2_max` or `vo2Max`, sometimes accompanied by a `fitness_age` or a category label. Aggregators such as Terra or Vital normalize these across providers, but the underlying value is still each vendor's estimate — confirm the exact field name, unit, and update cadence in the specific API docs you integrate.\n\n## Measured vs estimated, and individual variation (honest caveat)\n\nVO2 max from a wearable is a **modeled estimate**, and its accuracy depends heavily on how it is collected:\n\n- A meta-analysis (INTERLIVE) found near-zero average bias when the estimate came from an actual workout (about -0.09 mL/kg/min) but meaningful overestimation (about +2.17 mL/kg/min) when estimated at rest. The **method** mattered more than the brand.\n- A validation study of Apple Watch reported a mean absolute percentage error around **13%** (mean absolute error roughly 6.9 mL/kg/min).\n- Firstbeat's own validation reports high correlation (about r = 0.97, roughly 3.5% typical error) under good conditions.\n\nThe takeaway: individual estimates can be off by several points, and the same person can see different numbers across devices. Use VO2 max as a **ballpark and a trend, not a precise number** — and verify any vendor-specific error figures against current docs before you cite them. It is a general fitness signal, never a clinical or diagnostic value.\n\n## Where this fits\n\nThis page defines VO2 max. When you are ready to integrate it, the hands-on guides go deeper:\n\n- **[Wearable data APIs](/fitness-apis/wearable-data-apis)** — how VO2 max and other modeled metrics arrive through wearable and aggregator APIs, and how to normalize them.\n- **[Build a running app](/build/running-app)** — where a VO2 max trend fits into a running product alongside pace, GPS, and heart rate.\n\nFor related metrics and their measured-vs-estimated framing, see [what is HRV](/learn/what-is-hrv) and [how fitness apps estimate calories](/learn/how-fitness-apps-estimate-calories).",
    "faqs": [
      {
        "q": "Is wearable VO2 max measured or estimated?",
        "a": "Estimated. A true VO2 max comes from a lab graded-exercise test where you breathe through a gas-analysis mask (indirect calorimetry). Wearables do not measure oxygen uptake at all; they model VO2 max from the relationship between your heart rate and pace or speed during activity, usually a GPS-tracked run or walk."
      },
      {
        "q": "How accurate is VO2 max from a smartwatch?",
        "a": "It varies. Accuracy depends more on method than brand: estimates from an actual workout tend to have low average bias, while resting estimates can overestimate. One Apple Watch validation study reported roughly 13% mean absolute percentage error (as of 2026, verify against the current study). Individual numbers can be off by several points, so use VO2 max as a trend and a ballpark rather than a precise figure."
      },
      {
        "q": "What is a good VO2 max?",
        "a": "VO2 max is expressed in mL/kg/min, often in the 30s to 50s for many recreational adults and higher for trained endurance athletes, declining gradually with age (directional ranges only — verify against a current source, don't use as cutoffs). Because values are directional and vary by person, age, and device, the most useful comparison is against your own trend over time rather than a fixed target. This is general information, not medical advice."
      },
      {
        "q": "How does VO2 max appear in a fitness API?",
        "a": "Usually as a single scalar field such as vo2_max or vo2Max in mL/kg/min on a user-summary or activity-summary object, sometimes with a fitness_age or category label. It updates after a qualifying GPS-tracked run or walk rather than as a continuous time series. Confirm the exact field name, unit, and update cadence in the specific vendor or aggregator docs."
      },
      {
        "q": "Why do Apple and Garmin show different VO2 max numbers?",
        "a": "Each vendor uses its own model and inputs. Garmin relies on Firstbeat Analytics from heart-rate-versus-pace data, while Apple combines heart-rate-response modeling with machine learning using signals like walking heart rate and heart-rate recovery. Because the estimates come from different algorithms, the same person can get different values, and the numbers are not interchangeable across brands."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-hrv",
        "label": "What is HRV?"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/build/running-app",
        "label": "How to build a running app"
      },
      {
        "href": "/learn",
        "label": "All fitness & health API concepts"
      }
    ],
    "cta": {
      "pitch": "Building with wearable fitness data? Get our plain-English breakdowns of metrics like VO2 max and HRV in your inbox."
    }
  },
  {
    "slug": "what-are-sleep-stages",
    "primaryQuery": "what are sleep stages",
    "h1": "What Are Sleep Stages (Awake, Light, Deep, REM)?",
    "metaTitle": "What Are Sleep Stages? Awake, Light, Deep, REM",
    "metaDescription": "Sleep stages are the phases of sleep: awake, light, deep, REM. How wearables estimate them from movement and heart rate, and their accuracy limits.",
    "updated": "2026-07-09",
    "answer": "Sleep stages are the distinct phases the body cycles through during sleep, commonly grouped as awake, light, deep, and REM. Clinically they are defined by brain activity (EEG) in a sleep lab, but consumer wearables estimate them from movement and heart-rate patterns rather than measuring brainwaves. They are a directional wellness signal, useful for trends across nights, not clinical fact for any single night. This is general information for developers, not medical advice.",
    "body": "Sleep stages are the distinct phases the body cycles through during a night's sleep — commonly grouped as awake, light sleep, deep sleep, and REM. In a clinical sleep lab these stages are defined by brain activity (EEG) alongside eye movement and muscle tone, but the sleep stages you see in a consumer wearable are **estimated** from movement and heart-rate patterns, not measured from brainwaves. Treat them as a directional wellness signal — useful for spotting trends across nights, not as clinical fact for any single night.\n\n*General information for developers, not medical advice. Nothing here is a diagnosis or a clinical measurement.*\n\n## The four stages, defined\n\nClinically, sleep is scored into stages that repeat in roughly 90-minute cycles through the night:\n\n- **Awake.** Periods of wakefulness, including brief arousals after you first fall asleep.\n- **Light sleep (clinically N1 and N2).** The transitional and predominant stages; the largest share of a typical night. Heart rate and breathing slow, and you are relatively easy to wake.\n- **Deep sleep (N3, slow-wave sleep).** Often described as the most physically restorative stage, marked by slow brainwaves. Hardest to wake from; tends to concentrate earlier in the night.\n- **REM (rapid eye movement).** Associated with vivid dreaming, rapid eye movements, and relative muscle atonia. REM periods generally lengthen toward the morning.\n\nStage proportions vary by person, age, and night, so there is no single \"correct\" distribution to target.\n\n## How wearables estimate stages (the key point)\n\nA clinical sleep study — **polysomnography (PSG)** — is the gold standard. It reads brainwaves (EEG), eye movement (EOG), and muscle tone (EMG) with electrodes and a trained technician scores the night.\n\nConsumer wearables do **not** read brainwaves. They **infer** stages from proxy signals:\n\n- **Movement** from an accelerometer (actigraphy).\n- **Heart rate and heart-rate variability (HRV)** patterns.\n- On some devices, **respiration, skin temperature, or blood-oxygen (SpO2)** as additional inputs.\n\nA proprietary algorithm maps those signals to a probable stage minute by minute. That makes every stage label a **model estimate/inference**, not an EEG measurement — a distinction that matters when you present the number to a user.\n\n## Accuracy vs. a clinical sleep study — hedge this\n\nThis is the honest part that developers most need to internalize. Validation research comparing wearables to PSG finds a consistent pattern:\n\n- **Sleep vs. wake detection is fairly good** — often around 90% or better at simply telling asleep from awake.\n- **Four-stage classification is much weaker** — studies commonly report roughly **60–70% overall agreement** with PSG when distinguishing light, deep, and REM.\n- **REM is often underestimated,** and light-vs-deep is frequently misclassified (some devices overestimate light and underestimate deep).\n\nBecause of this, stage-level numbers are best read as **rough directional trends over many nights**, not per-night clinical truth. Accuracy also differs substantially between vendors and even between firmware versions of the same device, so the same night's sleep can be scored differently by two brands. Verify current per-device validation figures against a primary source before you publish any specific accuracy claim — they shift with study, population, and firmware.\n\n## Why this matters to a builder\n\nIf your app surfaces sleep stages, the framing you choose is a product and trust decision:\n\n- **Present stages as trends, not verdicts.** \"Your deep sleep has trended lower this week\" is defensible; \"You didn't get enough deep sleep last night\" overstates what the data supports.\n- **Don't compare across brands.** Different sensors, windows, and algorithms mean an Oura \"deep sleep\" minute is not interchangeable with a Fitbit one. Avoid implying portability of exact figures.\n- **Keep language non-diagnostic.** Sleep-stage estimates are a general wellness signal, not a screen for any sleep disorder. Avoid clinical or prescriptive copy, and add a \"general information, not medical advice\" note wherever you show the numbers.\n\n## How sleep data appears in a wearable API\n\nMost wearable and aggregator APIs return a nightly sleep object with two things: **per-stage totals** and a **timeline of stage segments**. The exact field names and units differ by vendor (seconds vs. minutes, `snake_case` vs. `camelCase`), so always confirm against the specific docs — but the shape is broadly consistent:\n\n```json\n{\n  \"date\": \"2026-07-12\",\n  \"time_in_bed\": 28800,\n  \"total_sleep\": 26400,\n  \"awake_duration\": 2400,\n  \"light_sleep_duration\": 14100,\n  \"deep_sleep_duration\": 5400,\n  \"rem_sleep_duration\": 6900,\n  \"sleep_score\": 78,\n  \"stages\": [\n    { \"stage\": \"awake\", \"start\": \"2026-07-12T23:10:00Z\", \"end\": \"2026-07-12T23:22:00Z\" },\n    { \"stage\": \"light\", \"start\": \"2026-07-12T23:22:00Z\", \"end\": \"2026-07-12T23:58:00Z\" },\n    { \"stage\": \"deep\",  \"start\": \"2026-07-12T23:58:00Z\", \"end\": \"2026-07-13T00:41:00Z\" },\n    { \"stage\": \"rem\",   \"start\": \"2026-07-13T00:41:00Z\", \"end\": \"2026-07-13T01:19:00Z\" }\n  ]\n}\n```\n\nDurations (here in seconds) let you show a summary; the `stages` array (sometimes called `levels`) gives you the hypnogram-style timeline of `{stage, start, end}` segments. Many APIs also include a summary `sleep_score` or `efficiency`. Field names, units, and aggregation windows vary — confirm them per API.\n\n## Measured vs. estimated, and individual variation\n\nTo be explicit: sleep stages are an **estimate**, produced by a model from movement and heart-rate signals — not a measurement of brain activity. They are directionally useful for tracking a person's own patterns over time (total sleep, consistency, rough time in deep and REM as trends), and far less reliable as a precise, per-night stage breakdown. Individual physiology, age, and night-to-night variation all move the numbers, so compare a person to their own history rather than to a population \"ideal.\"\n\n## Where this fits\n\nThis page defines the concept. When you are ready to work with the data:\n\n- To understand the APIs that deliver sleep and other wearable metrics, see [wearable data APIs](/fitness-apis/wearable-data-apis).\n- For a hands-on integration that returns sleep stages, see the [Oura API integration guide](/integrate/oura-api) — Oura is a multi-sensor sleep tracker whose API exposes exactly the per-stage, timestamped structure described above.\n\n*General information for developers, not medical advice. Consumer sleep-stage estimates are a general wellness signal, not a clinical measurement or a diagnosis. Accuracy figures and field names above are illustrative and change with firmware and vendor — verify against current primary sources and API docs before you rely on them.*",
    "faqs": [
      {
        "q": "What are the four sleep stages?",
        "a": "Awake (periods of wakefulness and brief arousals), light sleep (clinically N1 and N2, the largest share of a typical night), deep sleep (N3 or slow-wave sleep, often described as the most physically restorative and the hardest to wake from), and REM (rapid eye movement, associated with vivid dreaming). They repeat in roughly 90-minute cycles, and stage proportions vary by person, age, and night."
      },
      {
        "q": "How do wearables measure sleep stages?",
        "a": "They do not read brainwaves. Consumer wearables estimate stages by inferring them from movement (an accelerometer) combined with heart rate and heart-rate variability, and on some devices respiration, temperature, or blood oxygen. A proprietary algorithm maps those signals to a probable stage. That makes every stage label a model estimate, not the EEG measurement used in a clinical sleep study."
      },
      {
        "q": "How accurate is sleep-stage tracking on a wearable?",
        "a": "Directionally useful but limited for exact stages. Validation studies find wearables are fairly good at telling sleep from wake (often around 90% or better) but much weaker at four-stage classification, commonly reporting roughly 60 to 70 percent agreement with a clinical sleep study (polysomnography). REM is often underestimated and light-versus-deep is frequently misclassified. Accuracy varies by vendor and firmware, so treat stage numbers as trends, not per-night truth, and verify current figures against a primary source."
      },
      {
        "q": "How do sleep stages appear in a wearable API?",
        "a": "Usually as a nightly sleep object with per-stage durations (for example light, deep, REM, and awake in seconds or minutes) plus totals like time in bed and total sleep, and a stages or levels array of timestamped segments each with a stage, start, and end. Many APIs also include a summary sleep score or efficiency. Field names, units, and aggregation windows differ by vendor, so confirm them in the specific API docs."
      },
      {
        "q": "Can I use wearable sleep stages for medical decisions?",
        "a": "No. Consumer sleep-stage estimates are a general wellness signal, not a clinical measurement or a diagnosis of any sleep disorder. They are best used to track a person's own patterns over time against their own baseline. Keep any copy non-diagnostic, and direct users to a healthcare professional for medical concerns. This is general information for developers, not medical advice."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-hrv",
        "label": "What is HRV?"
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
        "href": "/learn",
        "label": "All fitness & health API concepts"
      }
    ],
    "cta": {
      "pitch": "We break down a new wearable and health-data API every week, including how each vendor reports sleep stages and where their accuracy claims hold up — subscribe to stay current."
    }
  },
  {
    "slug": "how-fitness-apps-estimate-calories",
    "primaryQuery": "how fitness apps estimate calories",
    "h1": "How Do Fitness Apps Estimate Calories Burned?",
    "metaTitle": "How Fitness Apps Estimate Calories Burned",
    "metaDescription": "Fitness apps model calorie burn from METs, heart rate, movement, and your profile — they don't measure it. Why estimates can be off by ~27% to ~93%.",
    "updated": "2026-07-09",
    "answer": "Fitness apps do not measure calories burned; they estimate them with a model. The device feeds signals it can sense (movement and heart rate) plus your profile (age, sex, height, weight) into formulas — MET-based, heart-rate-based, and accelerometer-based — that output a calorie number. Independent testing shows that estimate can be far off: a 2017 Stanford study found the most accurate of seven wrist devices was still about 27% off for energy expenditure and the worst about 93% off, even though the same devices read heart rate to within about 5%. Treat calorie burn as a relative activity signal and trend, not a precise measurement.",
    "body": "Fitness apps do not measure the calories you burn — they *estimate* them with a model. The device feeds signals it can actually sense (your movement, your heart rate) plus your personal profile (age, sex, height, weight) into a formula that outputs a calorie number. That number is a model's best guess at your energy expenditure, not a direct reading, and independent testing shows the guess can be off by a lot.\n\nThis page is general information for developers, not medical or nutrition advice. Treat calorie figures as a relative activity-effort signal, not a precise clinical or dietary value.\n\n## What \"calories burned\" actually is\n\nThe value your app shows is **energy expenditure** — how much energy your body spent — reported in kilocalories (kcal). Platforms usually split it into two parts:\n\n- **Active energy** — the extra energy burned by movement and exercise, above resting.\n- **Basal (or resting) energy** — what your body would burn at rest just to stay alive.\n\n\"Total calories\" is active plus basal. In most fitness contexts the number people care about — and the one most APIs surface per workout — is **active energy**.\n\nThe critical thing to internalize: none of these are measured. A true energy-expenditure measurement requires lab methods — indirect calorimetry (a gas-analysis mask) or doubly labeled water. A wrist device has none of that. It has an accelerometer, usually an optical heart-rate sensor, and the profile you typed in. Everything else is inference.\n\n## How the estimate is built: the four inputs\n\nDifferent devices and platforms blend these methods, but a calorie estimate is almost always assembled from some combination of the following.\n\n### 1. MET-based estimation (activity type and duration)\n\nA **MET** (metabolic equivalent of task) is a standardized ratio of energy cost: 1 MET is roughly your resting metabolic rate, and an activity assigned, say, 8 METs is estimated to cost about eight times your resting energy. Multiply the activity's MET value by your body weight and the duration, and you get a calorie estimate. This is the simplest and oldest approach: pick the activity, look up its MET value from a standardized table, apply your weight and time. It is entirely a lookup-and-multiply model — it knows nothing about how hard *you* specifically worked.\n\n### 2. Heart-rate-based models\n\nHeart rate correlates with exercise intensity, so many devices fit a regression that maps your heart rate (relative to your resting and maximum) to an energy-burn rate, personalized with your profile. This tends to capture effort better than a MET table for cardio work, because it responds to how hard your heart is actually working rather than assuming a fixed intensity for the activity label.\n\n### 3. Movement and accelerometer data\n\nThe accelerometer counts and characterizes motion — steps, cadence, arm swing, intensity of movement. Models translate that motion into an energy estimate, on its own or fused with heart rate. This is what drives all-day passive calorie counts and step-based burn.\n\n### 4. Your personal profile\n\nAge, biological sex, height, and weight feed almost every method above. Two people doing the identical workout get different estimates because their profiles differ — and if the profile you entered is wrong or stale, every estimate downstream is skewed.\n\n## Why it is an estimate, not a measurement — the honest accuracy data\n\nThis is the part to be careful and honest about. Because the calorie number is a modeled output several inferential steps removed from anything the device directly senses, its error can be large.\n\nThe clearest evidence comes from a 2017 Stanford study (Shcherbina et al., *Journal of Personalized Medicine*) that tested seven wrist-worn consumer devices against lab reference measurements. The finding is striking:\n\n- The **most accurate** device was still off by about **27%** on average for energy expenditure.\n- The **worst** was off by about **93%**.\n- Yet the *same devices* measured **heart rate to within about 5%**.\n\nThat contrast is the whole story. These devices are genuinely good at the thing they physically sense (heart rate), and unreliable at the thing they *model* on top of it (calories). Measuring a signal and estimating energy from it are different problems, and the modeling step is where the error enters.\n\nA few practical patterns from the research worth knowing:\n\n- Accuracy is generally **best at light-to-moderate intensity** and degrades at very light and very high intensities.\n- Activities with **little wrist movement but high effort** (cycling) or with **elevation changes** (stair climbing) are especially hard to estimate.\n- Two different brands will produce **different calorie numbers for the exact same workout**, because each uses its own proprietary model and inputs.\n\n## Why this matters when you are building\n\nIf you surface calories in a product, how you frame the number is a design and trust decision.\n\n- **Use it as a relative or trend signal, not a truth.** It is useful for comparing a user's *own* days or workouts *on the same device* — \"today was a bigger effort than yesterday.\" It is not reliable as an absolute figure to base a precise nutrition plan on.\n- **Do not present it as a measurement.** Avoid copy like \"you burned exactly 612 calories.\" Prefer directional, honestly hedged framing.\n- **Do not compare calorie numbers across brands.** An Apple Watch and a Garmin will disagree for the same session; neither is \"correct.\"\n- **Be especially careful in YMYL contexts.** If your app touches weight, diet, or medical concerns, an overconfident calorie figure can drive real decisions. Keep it directional and add a general \"estimate, not a clinical measurement\" note.\n\n## How active energy appears in an API\n\nWhen you pull calorie data from a wearable or aggregator API, it typically arrives as a few numeric fields — kilocalories on daily summaries and on each workout. Common shapes (field names are illustrative and vary by vendor):\n\n```json\n{\n  \"date\": \"2026-07-13\",\n  \"active_energy\": 540,      // kcal burned above resting (movement/exercise)\n  \"basal_energy\": 1620,      // kcal resting energy\n  \"total_calories\": 2160     // active + basal\n}\n```\n\nPer workout, you'll usually see a single `calories` (or `active_energy`) scalar on the activity object, and some APIs expose an intraday time series. Always confirm exact field names, units (kcal), and whether a value is active-only or total in the specific vendor or aggregator docs you integrate — HealthKit, Health Connect, Terra, Garmin, Fitbit, Oura, and others each label and split this differently.\n\n## Measured vs estimated, and individual variation\n\nTo be explicit, since this is the crux:\n\n| | What it is |\n|---|---|\n| **Measured** | Heart rate, movement, steps — signals the sensor directly captures (with their own smaller error). |\n| **Estimated (modeled)** | Calorie / energy expenditure — a formula's output computed *from* those signals plus your profile. |\n\nCalorie burn sits firmly in the estimated column. It varies by person (metabolism, fitness, body composition — none fully captured by an age/weight/sex profile), by activity type, and by device and algorithm version. That is why the same person, same workout, two watches, gives two different numbers.\n\n## Where this fits\n\nThis page defines how the estimate is built and how accurate it is. When you're ready to build with it:\n\n- To turn energy and food data into a product, see the guide to [building a nutrition-tracking app](/build/nutrition-tracking-app).\n- To pull active-energy and other metrics from devices, see the overview of [wearable-data APIs](/fitness-apis/wearable-data-apis).\n- For the related \"measured vs estimated\" caveat on other metrics, see [what is VO2 max](/learn/what-is-vo2-max) and [what are sleep stages](/learn/what-are-sleep-stages).\n\n*General information for developers, not medical or nutrition advice. Calorie-burn figures from consumer devices are model estimates that vary by person, activity, and device; accuracy figures cited above are from published studies and shift with device generation — verify against current sources before relying on specific numbers.*",
    "faqs": [
      {
        "q": "How do fitness apps calculate calories burned?",
        "a": "They estimate it with a model rather than measuring it. A calorie figure is assembled from some combination of METs (an activity's standardized energy cost applied to your weight and duration), heart-rate-based regression models, and accelerometer/movement data, all personalized with your age, sex, height, and weight. The output is a best-guess of energy expenditure, not a direct reading."
      },
      {
        "q": "Are fitness app calorie counts accurate?",
        "a": "Not very, in absolute terms. A 2017 Stanford study of seven wrist devices found the most accurate was still off by about 27% on average for energy expenditure and the worst by about 93% — while the same devices measured heart rate to within about 5%. Calorie burn is best used as a relative or trend signal for the same person on the same device, not as a precise number."
      },
      {
        "q": "Why is calorie burn an estimate and not a measurement?",
        "a": "Because a device has no way to directly measure energy expenditure. A true measurement needs lab methods like indirect calorimetry (a gas-analysis mask) or doubly labeled water. A wearable only has an accelerometer, usually an optical heart-rate sensor, and the profile you entered, so it must infer calories with a formula. Everything beyond the raw sensor signals is modeled."
      },
      {
        "q": "Why do two devices show different calories for the same workout?",
        "a": "Each device uses its own proprietary model, its own mix of METs, heart-rate, and movement inputs, and the profile data you gave it. Because calorie burn is a modeled estimate rather than a measurement, those differences produce different numbers for the identical session, and neither is definitively correct. Don't compare calorie figures across brands."
      },
      {
        "q": "How does calorie data appear in a fitness API?",
        "a": "Usually as kilocalorie (kcal) fields on daily summaries and per workout — commonly an active_energy value (energy above resting from movement), a basal_energy value (resting energy), and a total. Each activity object typically carries a single calories scalar, and some APIs expose an intraday time series. Field names, units, and whether a value is active-only or total vary by vendor, so confirm in the specific API docs."
      }
    ],
    "related": [
      {
        "href": "/learn/what-is-vo2-max",
        "label": "What is VO2 max?"
      },
      {
        "href": "/build/nutrition-tracking-app",
        "label": "How to build a nutrition tracking app"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/learn",
        "label": "All fitness & health API concepts"
      }
    ],
    "cta": {
      "pitch": "We break down a wearable and health-data metric every week — including which numbers are measured and which, like calorie burn, are just estimates — subscribe to build with the honest version."
    }
  }
];
