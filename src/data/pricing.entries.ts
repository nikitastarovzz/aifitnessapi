import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED fitness/health API pricing pages (originally auto-assembled;
 * since hand-edited — edit here). Article + FAQPage (no HowTo). Every figure is
 * hedged "verify current pricing"; the honest through-line is that most
 * first-party wearable APIs are free to call.
 */
export const pricingEntries: ClusterEntry[] =
[
  {
    "slug": "fitbit-api-pricing",
    "primaryQuery": "fitbit api pricing",
    "h1": "Fitbit API Pricing: What Does It Actually Cost?",
    "metaTitle": "Fitbit API Pricing: Is It Free? (2026 Guide)",
    "metaDescription": "The Fitbit Web API is free to call - no per-request fee. Learn the real costs, the 2026 Google Health API migration, and what to verify.",
    "updated": "2026-07-23",
    "answer": "The Fitbit Web API is free to call - there is no documented per-request fee, and developer app registration is free. The costs that actually bite are the approval and OAuth setup effort, your own server and storage infrastructure, and the fact that each user must own a Fitbit device and account. Note that Fitbit is migrating to the Google Health API during 2026 and the successor's pricing model is not clearly public - verify current pricing before you build.",
    "body": "## What it actually costs\n\nThe honest way to read Fitbit's cost is to split it into three separate buckets that people constantly conflate. The API being free to call does not mean the product is free to *use*.\n\nThe [Fitbit API overview](/apis/fitbit) sums up how Fitbit bills developers, what each user needs and what gates your launch; the [Fitbit API deprecation status](/fitbit-api-shutdown) page tracks what is confirmed and what is only reported about the legacy Web API's turndown.\n\n| Cost bucket | Who pays | Notes (as of 2026 — verify) |\n|---|---|---|\n| Fitbit Web API access | You (the developer) | No documented per-call fee. Free developer app registration. Rate limit reported at 150 requests/hour per consented user — verify, may change post-migration. |\n| Your own infrastructure | You (the developer) | Servers, data storage, OAuth token refresh, webhook handling, monitoring, maintenance. Fitbit does not host your integration. |\n| Device + account | Your end user | The user must own a Fitbit and have a Fitbit/Google account for data to flow. This is $0 to you but gates who can use your app. |\n| Fitbit Premium | Your end user (optional) | A consumer subscription. It is **not** an API access fee — do not conflate it with API cost. |\n\nThe line that matters most: \"free to call\" is not the same as \"free to use.\" You pay nothing to Fitbit for API requests, but your integration is worthless unless your users already own the hardware.\n\n## The catch — what to budget for\n\nThe real spend on a Fitbit integration is engineering time and infrastructure, not an API bill.\n\n- **Approval and setup effort.** You register a developer app and wire up OAuth 2.0. That is time, not dollars, but it is a real cost on a roadmap.\n- **Your infrastructure and storage.** Wearable data (per-minute heart rate, sleep, activity) accumulates quickly. Storing history, refreshing tokens, and handling retries is an ongoing cost that dwarfs the (zero) API fee.\n- **The 2026 migration — the biggest budget item.** Fitbit is moving developers to the **Google Health API**. [Google's Google Health API page](https://developers.google.com/health/about) (read October 12, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026, the date third-party guides had reported as the shutoff, and a full turn-off on October 30, 2026, with the legacy API running unsupported until then. New integrations were reportedly expected to target the Google Health API by around end of May 2026. Google's Fit migration guide (updated September 10, 2026) lists the Google Health API as the recommended path for Fitbit Web API integrations. Migration reportedly requires registering a project in Google Cloud Console, and Google's Health API migration guide says existing tokens cannot be transferred, so every user must re-consent. Budget engineering time for a re-integration.\n- **Successor pricing is unconfirmed.** The consumer **Google Health API** (the Fitbit replacement, documented at developers.google.com/health) is **not** the same product as the enterprise **Google Cloud Healthcare API**, which has its own published per-request FHIR/DICOM pricing. Do not assume the Cloud Healthcare API's figures describe the cost of the Fitbit replacement. We could not verify a price for the consumer Google Health API: none of the twelve Google Health API documentation pages we read on October 17, 2026 states one, so verify before you commit. Its default quotas are published: [Google's Quotas and Rate Limits page](https://developers.google.com/health/rate-limits) (last updated May 18, 2026, read October 17, 2026) allows 86.4M requests a day and 120,000 a minute per project and 300 a minute per user, caps an unverified app at 100 users, and says to request an increase through the Google Cloud Console. [Google Health API access and limits](/google-health-api/access-and-limits) carries the full table, and [the Google Health API reference](/google-health-api) lists every data type on Google's data-types page.\n\n## How it compares and cheaper paths\n\nIf you only ever need Fitbit data, calling the API directly is the low-fee path — you pay in integration and maintenance effort, not per request. Where it gets expensive is scale and breadth: supporting many wearables means either N separate first-party integrations or paying a cross-device aggregator on a per-connected-user or per-MAU model.\n\n- To wire up Fitbit specifically, see the [Fitbit API integration guide](/integrate/fitbit-api).\n- If Fitbit's approval effort or the Google Health API migration pushes you toward other options, compare the [Fitbit API alternatives](/alternatives/fitbit-api-alternatives).\n- Choosing between the two most common first-party wearable APIs? See [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api).\n- For the broader \"is any of this free\" picture, see [free fitness APIs](/fitness-apis/free-fitness-apis) and the [wider fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost).\n\n## Honest close\n\nThe Fitbit Web API has had no documented per-call fee, but pricing and access terms for health data change often — and the move to the Google Health API has been rewriting the rules during 2026. Do not treat any figure on this page as final. Re-open Fitbit's and Google's own developer pages, and read the current terms, before you build or budget against them.",
    "faqs": [
      {
        "q": "Is the Fitbit API free?",
        "a": "Yes - the Fitbit Web API is free to call. There is no documented per-request fee to access it, and registering a developer app on the Fitbit developer portal costs nothing. 'Free to call' is not the same as 'free to use', though: your end users must own a Fitbit device and hold a Fitbit or Google account, and you pay for your own infrastructure. As of 2026, verify current pricing before you rely on it."
      },
      {
        "q": "What do you actually pay for with a Fitbit integration?",
        "a": "Not the API calls themselves. You pay in engineering time (developer app approval, OAuth 2.0 setup) and in your own infrastructure - servers, data storage, token refresh, webhook handling, and maintenance. Fitbit does not host your integration. The user-side dependency is that your users must already own a Fitbit."
      },
      {
        "q": "Is there a rate limit on the Fitbit API?",
        "a": "The Fitbit Web API has historically been reported at 150 requests per hour per consented user, resetting near the top of each hour, with no separate per-call fee. This number may change with the Google Health API migration - verify the current limit on Fitbit's own developer documentation."
      },
      {
        "q": "How does the Google Health API migration affect Fitbit pricing?",
        "a": "Fitbit is moving developers to the Google Health API during 2026. New integrations were reportedly expected to target it by around end of May 2026. Google's Google Health API page (read October 12, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026, the date third-party guides had reported as the shutoff, and a full turn-off on October 30, 2026. Google's Fit migration guide (updated September 10, 2026) lists the Google Health API as the recommended path for Fitbit Web API integrations. Google publishes the successor's default quotas on its Quotas and Rate Limits page (last updated May 18, 2026, read October 17, 2026): 86.4M requests a day and 120,000 a minute per project, and 300 a minute per user. None of the Google Health API documentation pages we read that day states a price, so we could not verify its pricing. Note it is a different product from the enterprise Google Cloud Healthcare API, whose published pricing does not describe the Fitbit replacement. Verify before committing."
      },
      {
        "q": "Is Fitbit Premium the same as paying for the API?",
        "a": "No. Fitbit Premium is an optional consumer subscription for end users; it is not an API access fee. Do not conflate the two when budgeting - the API itself carries no documented per-call charge."
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
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Fitbit's move to the Google Health API is rewriting access and pricing rules during 2026 - subscribe for plain-English updates when the details change."
    }
  },
  {
    "slug": "garmin-api-pricing",
    "primaryQuery": "garmin api pricing",
    "h1": "Garmin API Pricing: What Does It Actually Cost?",
    "metaTitle": "Garmin API Pricing (2026): No Program Fee, Business Only",
    "metaDescription": "Garmin's Connect Developer Program has no licensing or maintenance fees, but it is business-only and some metrics need a license fee or a device order.",
    "updated": "2026-10-17",
    "answer": "Garmin's Connect Developer Program has no licensing or maintenance fees, according to Garmin's own program FAQ, but it is only for business use, and access to some metrics may require a license fee payment or a minimum device order quantity for commercial use. On the Health API page, enhanced beat-to-beat interval is marked as needing a license fee for commercial use. Garmin does not publish those fee amounts, so get them in writing. The visible costs are time, with a decision within two business days and a typical integration of one to four weeks, and your own infrastructure.",
    "body": "## What it actually costs\n\nGarmin answers the price question on its own program FAQ, which this page last read on October 17, 2026: \"There are no licensing or maintenance fees for access to the Garmin Connect Developer Program, but it is only for business use.\" The same answer adds the exception that matters: \"Access to some metrics may require a license fee payment or minimum device order quantity for commercial use.\"\n\nThe [Garmin API overview](/apis/garmin) sums up how Garmin bills developers, what each user needs and what gates your launch, alongside every page we have on Garmin.\n\n| Cost | Who pays | What Garmin's pages say |\n| --- | --- | --- |\n| Program access | You (the developer) | No licensing or maintenance fees; business use only |\n| Some metrics, commercially | You (the developer) | May require a license fee payment or a minimum device order quantity |\n| Enhanced beat-to-beat interval | You (the developer) | Marked on the Health API page: \"Commercial use requires a license fee payment.\" |\n| Garmin devices | Your end users, or you | Users sync their own Garmin devices; if you want to supply wearables, Garmin asks for the number of devices when you request the program |\n| Approval and integration time | You (the developer) | A decision within two business days; a typical integration takes 1 to 4 weeks |\n| Your infrastructure | You (the developer) | Servers, storage, OAuth token handling, data ingestion, monitoring |\n\nGarmin does not publish the license fee amounts or the minimum device order quantities on its public pages, so this page does not quote any. Ask for them in writing during the integration call, before you promise a metric to a customer.\n\n## The catch: business only, and fees by metric\n\nThe real cost questions with Garmin are eligibility and which metrics you need, not a per-request bill.\n\n- **It is only for business use.** Garmin's FAQ says the program is available for enterprise use and only for business use, so there is no individual developer path.\n- **Know your metrics before you sign.** The Health API lists steps, intensity minutes, sleep, calories, heart rate, stress, Pulse Ox, Body Battery, body composition, respiration, blood pressure and enhanced beat-to-beat interval, and only the last carries an explicit license-fee note. The FAQ's wider wording (\"some metrics\") means you should confirm terms for every metric you plan to sell on.\n- **Time is the visible cost.** Garmin confirms an application's status within two business days and puts a typical integration at one to four weeks, with an integration call along the way.\n- **Status can change.** Every program page carried a \"Stay tuned for more updates on the program\" banner on October 17, 2026. Earlier versions of this page repeated third-party reports of a pause and of setup fees; Garmin's own pages mention neither.\n\nFor the mechanics of requesting access and wiring up the APIs, see the [Garmin API integration guide](/integrate/garmin-api).\n\n## How it compares and cheaper paths\n\nWith no program fee, the direct route is cheap in money and expensive in eligibility: you need a business, Garmin's approval and, for some metrics, a commercial license. Two alternatives are worth weighing before you commit.\n\nOne is to compare Garmin head-to-head with another first-party wearable API whose access model suits you better. [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api) lays out that trade-off.\n\nThe other is to reach Garmin data through a health-data aggregator instead of integrating directly. Aggregators usually price per active or connected user and take on the per-provider approval work, a classic build-versus-buy decision. See the [Garmin API alternatives](/alternatives/garmin-api-alternatives) for the options and the [wearable data APIs overview](/fitness-apis/wearable-data-apis) for how the aggregator layer works.\n\n## Bottom line\n\nGarmin's Connect Developer Program has no licensing or maintenance fees, by Garmin's own FAQ, but it is only for business use, and some metrics need a license fee or a minimum device order for commercial use. The fee amounts are not public, so get them in writing for the metrics you need, and budget for one to four weeks of integration after a decision that Garmin says takes two business days.",
    "faqs": [
      {
        "q": "Is the Garmin API free?",
        "a": "For access, yes: Garmin's FAQ says there are no licensing or maintenance fees for the Garmin Connect Developer Program. It is only for business use, though, and access to some metrics may require a license fee payment or a minimum device order quantity for commercial use, so the total depends on the metrics you need."
      },
      {
        "q": "Which Garmin metrics need a license fee?",
        "a": "Garmin's Health API page marks enhanced beat-to-beat interval with the note that commercial use requires a license fee payment. The FAQ says access to some metrics may need a license fee or a minimum device order, without listing them all or publishing amounts, so confirm terms for every metric you plan to use commercially."
      },
      {
        "q": "Does Garmin charge a setup fee for API access?",
        "a": "Garmin's pages mention no setup fee. Its FAQ says there are no licensing or maintenance fees for the program, with exceptions only for some metrics used commercially. Earlier versions of this page repeated third-party reports of a setup fee; Garmin's own pages, read on October 17, 2026, do not support them."
      },
      {
        "q": "When does Garmin answer an API application?",
        "a": "Garmin's FAQ says it confirms the status of an application within two business days of your request. If approved you get access to the Garmin Developer Portal, an invitation to an integration call, and Garmin puts a typical integration at between one and four weeks."
      },
      {
        "q": "Is there a cheaper or more predictable alternative to Garmin's direct API?",
        "a": "If you are not a business, or the metric licenses do not fit your budget, a health-data aggregator can deliver Garmin data through one integration, usually priced per active or connected user. That is a build-versus-buy decision. Compare the alternatives and the wearable data API pages, and verify each vendor's pricing directly."
      }
    ],
    "related": [
      {
        "href": "/integrate/garmin-api",
        "label": "Integrate the Garmin API"
      },
      {
        "href": "/alternatives/garmin-api-alternatives",
        "label": "Garmin API alternatives"
      },
      {
        "href": "/fitness-apis/fitbit-api-vs-garmin-api",
        "label": "Fitbit API vs Garmin API"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Get a heads-up when Garmin and other fitness APIs change their access rules, program status or license terms before it affects your budget."
    },
    "sources": [
      {
        "url": "https://developer.garmin.com/gc-developer-program/program-faq/",
        "checked": "2026-10-17",
        "note": "no licensing or maintenance fees, business use only, license fee or minimum device order for some metrics, two business days, 1 to 4 weeks, device orders"
      },
      {
        "url": "https://developer.garmin.com/gc-developer-program/health-api/",
        "checked": "2026-10-17",
        "note": "Health API metrics and the license-fee note on enhanced beat-to-beat interval"
      },
      {
        "url": "https://developer.garmin.com/gc-developer-program/overview/",
        "checked": "2026-10-17",
        "note": "status banner"
      }
    ]
  },
  {
    "slug": "strava-api-pricing",
    "primaryQuery": "strava api pricing",
    "h1": "Strava API Pricing: What Does It Actually Cost?",
    "metaTitle": "Strava API Pricing (2026): Free to Call, Subscription Gated",
    "metaDescription": "Strava's API has no per-call fee, but its 2026 docs make a Strava subscription a prerequisite for creating an app. Tiers, rules and real costs.",
    "updated": "2026-10-17",
    "answer": "The Strava API has no per-call fee: Strava's 2026 API Agreement says access is currently provided at no charge. The cost that gates it is a subscription, which Strava's getting-started guide calls a prerequisite for creating an app, and its API Policy makes Standard Tier apps subject to subscription requirements for the developer or specified end users, while the Extended Access Tier for apps generally serving 10,000 or more users is exempt. The bigger costs are architectural: data may be shown only to the athlete it belongs to, AI use is banned and caches expire after seven days.",
    "body": "## What the Strava API actually costs\n\nKeep three costs separate: what Strava charges you for API access, what a Strava subscription costs and who has to hold one, and what you spend on your own build. They are different line items, and conflating them is the most common pricing mistake. The [Strava API overview](/apis/strava) sums up how Strava bills developers, what each user needs and what gates your launch, and [the API comparison tool](/compare-apis) puts those same fields beside any other API in the directory.\n\nStrava's API Agreement (2026), effective June 1, 2026, says access to and use of the API materials \"are currently provided at no charge\", and that Strava reserves the right to start charging later, with notice. There is no per-call fee. What there is, since 2026, is a subscription requirement, and Strava now documents it on its own pages rather than leaving it to reports.\n\n| Cost | Who pays | What Strava's pages say (read October 17, 2026) |\n| --- | --- | --- |\n| API access, per call | Developer | No charge \"currently\"; Strava may introduce charges with notice |\n| Strava subscription to create an app | Developer | The getting-started guide calls a subscription \"a prerequisite for creating an app\" |\n| Subscription for Standard Tier apps | Developer or specified end users | The API Policy makes Standard Tier apps \"subject to subscription requirements\", including \"that the developer or specified end users maintain an active Strava subscription\" |\n| Extended Access Tier | Developer | Apps generally serving 10,000 or more users, approved case by case, \"not subject to subscription requirements\" unless Strava publishes otherwise |\n| A Strava account | End user | The athlete's data has to exist on Strava, and they authorize your app themselves |\n| Your own infrastructure | You | Servers, OAuth token storage and refresh, webhook handling, monitoring |\n\nThe subscription price is not on the developer pages we read, so check Strava's own subscription page for your country before you budget; we do not print a figure we could not source.\n\n## Tiers decide the bill more than the price does\n\nStrava's API Policy sorts apps into access tiers, and the tier decides whether the subscription requirement applies at all:\n\n- **Standard Tier, up to 10 users.** Strava describes this level as \"generally intended for hobbyists, side projects, and early development\". New apps also start in single-player mode, where only your own account can connect, and the self-service upgrade raises the athlete capacity to 10.\n- **Standard Tier, up to 9,999 users.** For \"growing apps with a substantial user base\". To connect more than 10 athletes, Strava's getting-started guide says to submit your app for review.\n- **Extended Access Tier.** Generally 10,000 users or more, admitted case by case, outside the subscription requirement.\n\nSo a side project pays for one subscription and stays small; a growing consumer app may need its developer, or the end users Strava specifies, to hold subscriptions; a large partner negotiates Extended Access. Strava does not commit to a review-time service level for admissions or capacity increases, so the calendar is a cost too.\n\n## The catch: rules that cost more than any fee\n\nThe 2026 terms restrict what you may build, which can rule out a product idea whatever you pay:\n\n- **Display only to the athlete who owns the data.** Strava Data from one user may be shown only to that user, even if it is public on Strava.\n- **No AI use at all.** The API Policy forbids using Strava data in the development, training, evaluation or operation of any AI application, down to embeddings, retrieval and context windows.\n- **No end-user charges for Strava itself.** You may not charge users for access to the API or to Strava functionality, though you may charge for functionality Strava does not provide.\n- **Seven-day cache, 48-hour deletions.** Strava Data may not sit in a cache longer than seven days, and deletions must reach your app within 48 hours.\n- **No competing or replicating apps**, and no proxies, aggregators or MCP servers that re-expose Strava data.\n\nRate limits are the other ceiling. Strava documents a default of 200 requests per 15 minutes and 2,000 per day overall, with a tighter non-upload limit of 100 and 1,000; the self-service upgrade lifts them to 400 and 4,000 overall and 200 and 2,000 for reads. Higher limits are at Strava's discretion. The integration side, including the headers to watch, is in the [Strava API integration guide](/integrate/strava-api), and bringing an existing integration in line with the new terms is covered in [adapting to Strava's API changes](/migrate/adapt-to-strava-api-changes).\n\n## How it compares and cheaper paths\n\nWhether Strava's model is worth it depends on the product. If the subscription requirement, the display rule or the AI ban conflicts with what you are building, it may be cheaper overall to reach the same athletes another way. A cross-device aggregator removes per-provider integration work but adds a recurring fee and a middle layer; note that Strava's policy prohibits aggregators that re-expose its API, so check how any aggregator reaches Strava data before you rely on it. Other first-party wearable APIs carry their own gates. Weigh those trade-offs in the [Strava API alternatives](/alternatives/strava-api-alternatives), and see the wider landscape in the [wearable data APIs overview](/fitness-apis/wearable-data-apis). If you only need workout or exercise content rather than a specific athlete's history, the [free fitness APIs roundup](/fitness-apis/free-fitness-apis) covers open options.\n\n## The honest close\n\nThe Strava API is free to call but not free to use: Strava's own pages now make a subscription a prerequisite for creating an app and tie Standard Tier apps to subscription requirements, while the 2026 terms constrain display, AI use, caching and resale. Every specific here was read on Strava's pages on October 17, 2026; the subscription price itself is not on those pages, so confirm it on Strava's subscription page for your market.",
    "faqs": [
      {
        "q": "Is the Strava API free?",
        "a": "Free to call, not free to use. Strava's API Agreement (2026) says access is currently provided at no charge and that Strava may start charging later with notice, but its getting-started guide calls a Strava subscription a prerequisite for creating an app. There is no per-request fee; the subscription is the gate."
      },
      {
        "q": "Who needs a Strava subscription to use the API?",
        "a": "The developer, to create an app, per Strava's getting-started guide. Strava's API Policy also makes Standard Tier apps, those limited to 10 or to 9,999 registered users, subject to subscription requirements that can cover the developer or specified end users, while Extended Access Tier apps are not subject to them unless Strava publishes otherwise."
      },
      {
        "q": "Can I charge users for a Strava-powered app?",
        "a": "Only for what Strava does not provide. Strava's API Policy says you may not charge end users for access to the Strava API or to Strava's own functionality, and may not resell or syndicate API access, but it does not prohibit charging for functionality your app provides that is not substantially duplicative of Strava's."
      },
      {
        "q": "Can I use Strava API data with AI or machine learning?",
        "a": "No. Strava's API Policy (2026) prohibits using Strava API materials or data in the development, training, evaluation or operation of any AI application, including fine-tuning, embeddings, retrieval-augmented generation and putting the data in a context window. The only exception it names is Strava's own MCP for a subscriber's personal use of their own data."
      },
      {
        "q": "How much does the Strava subscription cost for developers?",
        "a": "Strava's developer pages do not state the price, so this page does not quote one. Check Strava's subscription page for your country, and remember that the tier your app sits in, not the price, decides whether the requirement applies beyond the developer."
      }
    ],
    "related": [
      {
        "href": "/integrate/strava-api",
        "label": "Integrate the Strava API"
      },
      {
        "href": "/alternatives/strava-api-alternatives",
        "label": "Strava API alternatives"
      },
      {
        "href": "/migrate/adapt-to-strava-api-changes",
        "label": "Adapt to Strava API changes"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Get a heads-up when Strava and other fitness APIs change their pricing, access tiers or terms before it hits your budget."
    },
    "sources": [
      {
        "url": "https://www.strava.com/legal/api",
        "checked": "2026-10-17",
        "note": "API Agreement (2026): no charge currently, right to charge with notice, display and no-replication highlights"
      },
      {
        "url": "https://www.strava.com/legal/api_policy",
        "checked": "2026-10-17",
        "note": "API Policy (2026): access tiers, subscription requirements, end-user charges, AI, cache, deletion, proxy rules"
      },
      {
        "url": "https://developers.strava.com/docs/getting-started/",
        "checked": "2026-10-17",
        "note": "subscription prerequisite, single-player mode, self-service upgrade, review beyond 10 athletes"
      },
      {
        "url": "https://developers.strava.com/docs/rate-limits/",
        "checked": "2026-10-17",
        "note": "default and upgraded rate limits"
      }
    ]
  },
  {
    "slug": "oura-api-pricing",
    "primaryQuery": "oura api pricing",
    "h1": "Oura API pricing: what it actually costs",
    "metaTitle": "Oura API Pricing (2026): Free API, $5.99 Membership",
    "metaDescription": "Oura says its API is free for personal and commercial apps. Your users need a ring and a membership, $5.99 a month in the US, or calls return 403.",
    "updated": "2026-10-17",
    "answer": "The Oura API is free: Oura's own API FAQ says it is free to use for both personal and commercial applications, and that apps accessing more than 10 users need Oura's approval. The cost sits with your users: they need an Oura Ring and an active Oura Membership, because Oura's API returns 403 when a user's subscription has expired. Oura lists the membership at $5.99 USD a month or $69.99 USD a year before tax in the US, with the first month free for new members.",
    "body": "## What it actually costs\n\nOura's cost splits into buckets that are easy to conflate. The API itself is free, Oura says so in its own documentation, but nothing flows unless your users own a ring, and Oura's API answers 403 when a user's Oura subscription has expired.\n\nThe [Oura API overview](/apis/oura) sums up how Oura bills developers, what each user needs and what gates your launch, alongside every page we have on Oura.\n\n| Cost bucket | Who pays | What Oura's pages say (read October 17, 2026) |\n|---|---|---|\n| API access | You (the developer) | Oura's API FAQ: \"the Oura API is free to use for both personal and commercial applications\" |\n| Going past 10 users | You (the developer) | No fee, but \"API applications accessing more than 10 users require approval from Oura\" |\n| Oura Ring | Your end user | Oura's membership FAQ says purchasing, activating and wearing a ring is the only way to unlock the membership's insights |\n| Oura Membership | Your end user | $5.99 USD a month or $69.99 USD a year before tax for US members, with the first month free for new members |\n| Your own infrastructure | You (the developer) | Servers, storage, OAuth token refresh, webhook handling, monitoring |\n\nMembership prices on Oura's membership page by region, as listed on October 17, 2026:\n\n| Region | Monthly | Annual | Tax |\n|---|---|---|---|\n| United States | $5.99 USD | $69.99 USD | before tax |\n| European Union | €5.99 | €69.99 | after tax |\n| United Kingdom | £5.99 | £69.99 | after tax |\n| Canada | CA$7.99 CAD | CA$89.99 CAD | before tax |\n| Australia | A$9.99 AUD | A$109.99 AUD | after tax |\n| Rest of world | $6.99 USD | $79.00 USD | after tax |\n\nThe page also lists Japan and Switzerland. Prices change, so check the page for your users' market before you quote one in your own product.\n\n## The catch: the membership on your users' side\n\nThe real spend on an Oura integration is engineering time and the membership dependency, not an API bill.\n\n- **A lapsed membership shows up as a 403.** Oura's API spec says a 403 means the requested resource requires additional permissions or the user's Oura subscription has expired. Build a clear \"your Oura membership has ended\" state into your app rather than treating it as a broken connection.\n- **Without a membership, Oura's own app is limited too.** Oura says the ring and app still work without a membership, but the insights, personal health data and benefits are \"much more limited\". Expect your audience to be paying members.\n- **The 10-user limit is time, not money.** A new API application is limited to 10 users until Oura approves it, and there is no limit once it is approved. Submit for review from the application's page before launch.\n- **Rate limits are free, and generous with webhooks.** Oura's FAQ and error-handling page give 5,000 requests per 5-minute period, and Oura says customers who implement webhooks properly have not hit rate limits. Ask Oura's API support if you expect to need more.\n- **Personal access tokens are gone.** Oura's spec says they were deprecated in December 2025 and are no longer available for use, so even a single-account script now goes through OAuth. For Python, [oura-ring vs oura](/libraries/compare/oura-ring-vs-oura-python) compares the two third-party clients' OAuth2 support.\n\nThe mechanics, from PKCE to signed webhooks, are in the [Oura API integration guide](/integrate/oura-api).\n\n## How it compares and cheaper paths\n\nIf you only ever need Oura data, calling the API directly is the low-fee path: you pay in integration effort and your users pay for their membership, not you per request. Where it gets expensive is breadth: supporting many wearables means several first-party integrations or a cross-device aggregator with its own fees.\n\n- If the membership dependency or the approval step pushes you toward other options, compare the [Oura API alternatives](/alternatives/oura-api-alternatives).\n- WHOOP has a similar model, free to call with a paid membership on the user's side: see [WHOOP API pricing](/pricing/whoop-api-pricing).\n- For the broader \"is any of this free\" picture, see [free fitness APIs](/fitness-apis/free-fitness-apis).\n\n## Honest close\n\nThe Oura API is free for personal and commercial apps by Oura's own account, and approval past 10 users costs time rather than money. What your users pay is the ring and a membership, $5.99 a month or $69.99 a year in the US on October 17, 2026, and when that membership lapses your API calls return 403. Re-check the membership page for current prices before you budget around them.",
    "faqs": [
      {
        "q": "Is the Oura API free?",
        "a": "Yes. Oura's API FAQ says the Oura API is free to use for both personal and commercial applications. The one gate is approval: API applications accessing more than 10 users require approval from Oura, which costs review time rather than a fee. Your own servers, storage and token handling are the developer-side costs."
      },
      {
        "q": "Do users need an Oura Membership for the API to work?",
        "a": "Plan on it. Oura's API spec says a 403 means the requested resource requires additional permissions or the user's Oura subscription has expired, so a lapsed membership shows up as failed calls. Oura's membership page adds that without a membership the ring and app still work, but insights and personal health data are much more limited."
      },
      {
        "q": "How much does an Oura Membership cost?",
        "a": "Oura's membership page listed $5.99 USD a month or $69.99 USD a year before tax for US members on October 17, 2026, with the first month free for new members. EU members pay €5.99 a month or €69.99 a year and UK members £5.99 or £69.99, both after tax. The ring is a separate purchase."
      },
      {
        "q": "Can I still use an Oura personal access token for free?",
        "a": "No. Oura's API spec says personal access tokens were deprecated in December 2025 and are no longer available for use. Every integration, including a script for your own ring, now goes through OAuth 2.0 with a registered API application, which is also free."
      },
      {
        "q": "Does Oura charge for higher rate limits?",
        "a": "Oura publishes no fee for them. Its FAQ and error-handling page give 5,000 requests per 5-minute period, and the spec says to contact Oura's API support if you expect to need higher limits. Oura says customers who implement webhooks properly have not hit rate limits, so use webhooks before you ask."
      }
    ],
    "related": [
      {
        "href": "/integrate/oura-api",
        "label": "Integrate the Oura API"
      },
      {
        "href": "/alternatives/oura-api-alternatives",
        "label": "Oura API alternatives"
      },
      {
        "href": "/pricing/whoop-api-pricing",
        "label": "WHOOP API pricing"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Oura's membership prices and API rules change, so join the newsletter for plain-English updates when wearable API pricing and access rules move."
    },
    "sources": [
      {
        "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.42.json",
        "checked": "2026-10-17",
        "note": "API V2 spec FAQ: free for personal and commercial use, approval past 10 users, 403 on expired subscription, rate limits, personal access tokens"
      },
      {
        "url": "https://cloud.ouraring.com/docs/",
        "checked": "2026-10-17",
        "note": "ten-user default limit and review"
      },
      {
        "url": "https://cloud.ouraring.com/docs/error-handling",
        "checked": "2026-10-17",
        "note": "5,000 requests per 5-minute period"
      },
      {
        "url": "https://ouraring.com/membership",
        "checked": "2026-10-17",
        "note": "membership prices by region, first month free, ring required, limits without a membership"
      }
    ]
  },
  {
    "slug": "whoop-api-pricing",
    "primaryQuery": "whoop api pricing",
    "h1": "WHOOP API Pricing: What Does It Actually Cost?",
    "metaTitle": "WHOOP API Pricing: Is It Free? What It Costs",
    "metaDescription": "WHOOP's API is free to call under its October 2026 terms, but you need a membership to build and your users need one too. Member tiers, limits, real costs.",
    "updated": "2026-10-17",
    "answer": "The WHOOP API is free to call: WHOOP's API Terms of Use, effective October 6, 2026, say access is currently provided at no charge, with notice before that changes. The costs that bite are memberships and tiers: WHOOP says you must have a WHOOP membership to develop an app, your users connect with their own WHOOP accounts, and a new app reaches only 10 members until WHOOP reviews it up through tiers of 100, 1,000, 5,000 and unlimited. WHOOP's developer site does not publish the membership price.",
    "body": "## What it actually costs\n\nThe honest way to read WHOOP's cost is to separate the developer API from the membership. They get conflated constantly: the API is free to call, but nothing flows without a membership on both sides of the integration.\n\nThe [WHOOP API overview](/apis/whoop) sums up how WHOOP bills developers, what each user needs and what gates your launch, alongside every page we have on WHOOP.\n\n| Cost bucket | Who pays | What WHOOP's pages say (read October 17, 2026) |\n|---|---|---|\n| API access | You (the developer) | WHOOP's API Terms of Use, effective October 6, 2026, say access \"is currently provided at no charge\", with prior notice if that changes |\n| WHOOP membership to build | You (the developer) | \"You must have a WHOOP membership to develop an app on the Developer Platform\" |\n| WHOOP membership to have data | Your end users | Your users authorize your app with their own WHOOP accounts, so they are WHOOP members already |\n| Usage beyond WHOOP's limits | You (the developer) | The terms let WHOOP decline, or attach \"additional terms and/or charges\" to, use beyond the API limits |\n| Your own infrastructure | You (the developer) | Servers, storage, OAuth token refresh, webhook handling, monitoring |\n\nThe membership price is not published on the developer site, so this page does not quote one; check WHOOP's own membership pages for your market. What the developer site does show is a trial offer: \"Try WHOOP free for 1 month\", with a Peak membership, 5.0 hardware, an Onyx SuperKnit band and a battery pack, which is a cheap way to get a developer account running.\n\n## The catch: tiers, not invoices\n\nThe real spend on a WHOOP integration is review time and the membership dependency, not an API bill.\n\n- **Member tiers cap your growth.** Every new app starts on the Sandbox tier with up to 10 members. WHOOP's tiers then run Build (100), Growth (1,000), Scale (5,000) and Production (unlimited), requested one at a time from the Developer Dashboard. From Build onward you need at least half of your current tier's member limit connected before you can ask for the next, and each request is reviewed by hand.\n- **Rate limits are generous but finite.** The default is 100 requests per minute and 10,000 per day per client; WHOOP raises them on request, and its terms reserve the right to attach charges to use beyond its limits.\n- **Your market is WHOOP members.** The membership is a recurring dependency on the user's side, so your addressable audience is people who already pay for WHOOP.\n- **Some uses are off the table.** The terms forbid using WHOOP data to train or improve any machine-learning or AI model, and caching data longer than the cache header allows.\n\nThe mechanics of each gate, from scopes to signed webhooks, are in the [WHOOP API integration guide](/integrate/whoop-api).\n\n## How it compares and cheaper paths\n\nIf you only ever need WHOOP data, calling the API directly is the low-fee path: you pay in integration effort and the membership dependency, not per request. Where it gets limiting is breadth: supporting many wearables means several first-party integrations or a cross-device aggregator with its own fees.\n\n- If the membership requirement or the tier ladder pushes you to look elsewhere, compare the [WHOOP API alternatives](/alternatives/whoop-api-alternatives).\n- Oura has a similar model: free to call, with a paid membership on the user's side. See [Oura API pricing](/pricing/oura-api-pricing) for the closest comparison.\n- For the broader \"is any of this free\" picture, see [free fitness APIs](/fitness-apis/free-fitness-apis) and the [wider fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost).\n\n## Honest close\n\nWHOOP's API is free to call under terms that took effect on October 6, 2026, but you need a membership to build, your users need one to have data, and your app's reach grows only as fast as WHOOP's tier reviews allow. The membership price is not on the developer site; confirm it on WHOOP's own pages before you budget.",
    "faqs": [
      {
        "q": "Is the WHOOP API free?",
        "a": "Free to call. WHOOP's API Terms of Use, effective October 6, 2026, say access to and use of the APIs is currently provided at no charge and that WHOOP will give prior notice if it starts charging. It is not free to use in practice, because you need a WHOOP membership to develop an app and your users need WHOOP accounts for their data to exist."
      },
      {
        "q": "What does the WHOOP member tier system mean for cost?",
        "a": "It caps growth rather than adding a bill. WHOOP's app approval page lists Sandbox at 10 members, then Build at 100, Growth at 1,000, Scale at 5,000 and Production unlimited. You request each tier from the Developer Dashboard, and from Build onward you need half of your current limit connected first, so plan review time into a launch."
      },
      {
        "q": "Do I need a WHOOP membership to use the API?",
        "a": "Yes. WHOOP's developer overview says you must have a WHOOP membership to develop an app on the Developer Platform, and your WHOOP account is also your developer login. The developer site also advertises a one-month free trial that includes a Peak membership and 5.0 hardware."
      },
      {
        "q": "How much is a WHOOP membership?",
        "a": "WHOOP's developer site does not publish membership prices, so we do not quote one here. Check WHOOP's own membership pages for your country before you rely on any figure; the developer site's trial offer of one free month is the only price-related statement we could source on October 17, 2026."
      },
      {
        "q": "Can WHOOP charge for heavy API use?",
        "a": "Its terms leave the door open. WHOOP may set limits on requests and on the number of users you serve, and if you want to go beyond them it may decline or attach additional terms or charges. The default rate limit is 100 requests per minute and 10,000 per day per client."
      }
    ],
    "related": [
      {
        "href": "/integrate/whoop-api",
        "label": "Integrate the WHOOP API"
      },
      {
        "href": "/alternatives/whoop-api-alternatives",
        "label": "WHOOP API alternatives"
      },
      {
        "href": "/pricing/oura-api-pricing",
        "label": "Oura API pricing"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "We track how wearable APIs price and gate access, from membership requirements to tier reviews and terms that change, so you know what a WHOOP integration costs before you build it."
    },
    "sources": [
      {
        "url": "https://developer.whoop.com/api-terms-of-use/",
        "checked": "2026-10-17",
        "note": "no charge currently, notice before charging, charges for use beyond limits, AI and caching restrictions"
      },
      {
        "url": "https://developer.whoop.com/docs/developing/overview/",
        "checked": "2026-10-17",
        "note": "membership required to develop"
      },
      {
        "url": "https://developer.whoop.com/docs/developing/app-approval/",
        "checked": "2026-10-17",
        "note": "member tiers and request rules"
      },
      {
        "url": "https://developer.whoop.com/docs/developing/rate-limiting/",
        "checked": "2026-10-17",
        "note": "default rate limits and increases"
      },
      {
        "url": "https://developer.whoop.com/",
        "checked": "2026-10-17",
        "note": "one-month free trial offer"
      }
    ]
  },
  {
    "slug": "health-data-aggregator-pricing",
    "primaryQuery": "health data aggregator api pricing",
    "h1": "Health data aggregator API pricing: how Terra, Junction, Rook, and Spike charge",
    "metaTitle": "Health Data Aggregator API Pricing Models",
    "metaDescription": "How health data aggregators like Terra, Junction (formerly Vital), Rook, and Spike price API access: per-MAU and tiered models. Prices vary; verify.",
    "updated": "2026-07-23",
    "answer": "Unlike most first-party wearable APIs, health-data aggregators are where a recurring API bill actually lands. Terra, Junction (formerly Vital), Rook, and Spike almost all price on active or connected users (per-MAU), usually tiered by user count with an enterprise 'contact sales' top tier, and sometimes a credit or event layer on top. The biggest cost driver is that your bill scales directly with your connected-user base. Specific per-MAU prices are mostly not publicly listed, and several vendor pricing pages could not be verified, so treat the model as reliable and every number as 'as of 2026, verify with the vendor.'",
    "body": "## What it actually costs\n\nThe honest way to read aggregator pricing is to separate the **model** (how they charge) from the **numbers** (what they charge), because the numbers are the part nobody publishes cleanly.\n\n| Vendor | Pricing model | What's public (as of 2026 — verify) |\n|---|---|---|\n| Terra | Usage-based on active connected users (\"active authentications\"), often with a credit/event allowance on top | Model is clear; specific figures are **not primary-verified** — verify on Terra's pricing page or with sales. |\n| Junction (formerly Vital) | Tiered by user count, plus a contact-sales Enterprise tier | Tiering exists (a smaller-user tier, a larger-user tier, Enterprise); **specific prices are not publicly listed** — verify. |\n| Rook | Usage-based, \"pay only for what you use,\" named tiers by active-user ceiling | Tier structure reported (Core / Business / Enterprise); **no per-user dollar figure sourced** — verify. |\n| Spike | Markets \"transparent, usage-driven, flexible\" pricing that scales with the business | **Specific tiers and figures were not retrievable** — verify with the vendor. |\n\nA few honest notes on that table. \"Active user\" or \"MAU\" is the near-universal unit — you generally pay for each end user whose wearable or app is connected and syncing in a given month, not per API call. **Tiering by user count** is the common wrapper: as your connected-user base grows you move up bands, and the largest band is almost always \"contact sales.\" Terra is the one that most visibly adds a **credit or event layer** on top of the user count, so its bill has two dimensions rather than one. None of these is inherently \"cheap\" or \"expensive\" — the right frame is whether the per-user model fits how your product grows.\n\nCritically: no per-MAU or per-connection dollar rate for any of these aggregators was verifiable during research, and several vendor pricing pages returned errors to automated fetching. Do not budget against a specific number you read secondhand — open the live pricing page or talk to sales before you commit.\n\n## The catch — what to budget for\n\nThe sticker (per-MAU or per-tier) is only part of the real cost. A few things bite:\n\n- **Your bill scales with your user base, by design.** Per-MAU pricing is predictable to model but it grows directly with adoption. A pricing tier that looks fine at launch is a different number at 50,000 connected users — and that upper band is usually the \"contact sales\" one you can't self-check.\n- **Credits and events can be a second meter.** Where a vendor (Terra, notably) layers a credit or event allowance on top of the user count, a data-heavy integration — high-frequency heart rate, sleep, workouts — can consume the allowance faster than user count alone suggests. Confirm how events are counted before you assume the base plan covers your volume.\n- **\"Contact sales\" means your real price is negotiated.** For anything past the self-serve tiers, the number that matters comes out of a sales conversation, not a public page. Budget lead time for that, and expect annual commitments at the enterprise end.\n- **The aggregator fee doesn't replace your own costs.** You still pay for your infrastructure, storage of high-volume wearable history, token and webhook handling, and health-data compliance (HIPAA/GDPR, encryption, BAAs). The aggregator removes integration labor, not your platform costs.\n\n## Why it costs money but can still save you money\n\nFirst-party wearable APIs are mostly free to call, so why pay an aggregator at all? Because the aggregator is a **build-vs-buy** trade. Supporting many wearables directly means N separate first-party integrations — each with its own OAuth flow, its own approval process, its own schema, and its own ongoing maintenance as that provider changes. An aggregator collapses that into one integration and one normalized data stream, and charges you a recurring per-user fee for doing so.\n\nThe rough heuristic: few devices, engineering to spare, and willingness to do each approval favors going direct (low API fee, high integration and maintenance cost). Many devices, a desire for one integration, and a predictable per-MAU budget favors an aggregator (a real recurring fee, much lower maintenance). Most teams end up mixing. What you're buying is the removal of per-provider integration and upkeep work — whether that's worth the per-user price depends on how many providers you'd otherwise build and maintain yourself.\n\n## How it compares and cheaper paths\n\n- For which aggregators exist and how they differ on coverage and features, see the [health-data aggregator APIs overview](/fitness-apis/health-data-aggregator-apis).\n- Weighing the two most-compared options head to head? See [Terra vs Vital (Junction)](/fitness-apis/terra-vs-vital).\n- To wire up a specific one, the [Terra API integration guide](/integrate/terra-api) walks through setup.\n- If you only need one or two wearables, going direct may be the lower-fee path — first-party APIs are mostly [free to call](/pricing/are-fitness-apis-free), and the [wider fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost) covers the full build-vs-buy math.\n\n## Honest close\n\nAggregators are the part of the fitness-data landscape where recurring API spend genuinely accrues — but the exact numbers are the hardest to pin down, because most vendors keep them behind \"contact sales\" and their pricing pages frequently can't be read from the outside. The models above (per-MAU, tiered by user count, sometimes a credit layer, enterprise contact-sales) are stable enough to plan around. The prices are not. Re-open each vendor's live pricing page, or get a quote, before you budget against any figure — pricing here changes, and the public record is thin on purpose.",
    "faqs": [
      {
        "q": "How do health data aggregators charge for API access?",
        "a": "Most price on active or connected users (per monthly active user, or per-MAU), usually organized into tiers by user count with an enterprise 'contact sales' tier at the top. Some, notably Terra, add a credit or event allowance on top of the user count. You generally pay per connected end user per month rather than per API call. Specific figures are mostly not publicly listed, so verify current pricing with each vendor."
      },
      {
        "q": "How much does Terra, Junction, Rook, or Spike cost per user?",
        "a": "No reliable per-MAU or per-connection dollar figure is publicly listed for any of them, and several of their pricing pages could not be verified during research. Terra is usage-based on active connected users with a credit layer; Junction (formerly Vital) tiers by user count plus enterprise; Rook uses named active-user tiers; Spike markets usage-based pricing. Get a live quote or open the vendor's pricing page before budgeting a number."
      },
      {
        "q": "Why pay an aggregator when first-party wearable APIs are free to call?",
        "a": "It is a build-vs-buy trade. Supporting many wearables directly means a separate integration, OAuth flow, approval, and schema for each provider, plus ongoing maintenance as they change. An aggregator collapses that into one integration and one normalized data stream and charges a recurring per-user fee for it. You are paying to remove per-provider integration and upkeep work, not per API call."
      },
      {
        "q": "Is aggregator pricing predictable?",
        "a": "The per-MAU model is predictable to model, but it scales directly with your user base by design, so a tier that fits at launch is a different number at scale. Credit or event layers can add a second meter for data-heavy integrations, and anything past the self-serve tiers is negotiated through sales. Model the growth curve, not just the launch price, and verify current tiers."
      },
      {
        "q": "Does the aggregator fee replace my other costs?",
        "a": "No. It removes integration labor, not your platform costs. You still pay for your own infrastructure, storage of high-volume wearable history, token and webhook handling, and health-data compliance such as HIPAA or GDPR handling, encryption, and BAAs. Budget the aggregator fee as one layer on top of those, not a replacement for them."
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
        "href": "/integrate/terra-api",
        "label": "Integrate Terra"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Get a heads-up when aggregator pricing tiers, per-MAU terms, and wearable API access rules change, so your budget isn't the last to hear about it."
    }
  },
  {
    "slug": "nutrition-api-pricing",
    "primaryQuery": "nutrition api pricing",
    "h1": "What does a nutrition API cost?",
    "metaTitle": "Nutrition API Pricing: Free vs Paid (2026)",
    "metaDescription": "What nutrition APIs cost: Nutritionix, Edamam, and Spoonacular are paid; USDA and Open Food Facts are free. Compare the models. Verify current pricing.",
    "updated": "2026-07-23",
    "answer": "It depends which kind you pick. Commercial food APIs (Nutritionix, Edamam, Spoonacular) are paid, built on freemium or free-tier-then-paid models with an enterprise contact-sales tier. Two options are genuinely free: USDA FoodData Central (public domain) and Open Food Facts (open data) cost nothing to call. The cost that actually bites is often not the sticker price but the licensing and usage restrictions on the cheaper tiers, and the integration work the free datasets push onto you. Pricing changes often and most vendor pricing pages are gated, so treat every specific figure as 'as of 2026, verify current pricing.'",
    "body": "## The free/open vs paid split\n\nThe cleanest way to think about nutrition data pricing is to separate the two worlds first, then look at the model inside each. A vendor's \"free tier\" is not the same thing as a free/open dataset — free tiers are limited, can be curtailed, and are designed to lead you into paid tiers, while open datasets are licensed to be free but shift work and obligations onto you.\n\n| Option | Model | What to watch (as of 2026 — verify) |\n|---|---|---|\n| USDA FoodData Central | **Genuinely free**, public domain (CC0) | Free data.gov API key, signup in minutes. Rate limit reported around 1,000 requests/hour per IP. Lab/reference-oriented data, not restaurant/branded-menu complete. No SLA or support. |\n| Open Food Facts | **Genuinely free**, open data (ODbL) | No key, no signup to read. Crowdsourced, so coverage and quality vary by region. Attribution and share-alike obligations apply — a real constraint for commercial use. |\n| Nutritionix | Paid: free-then-paid + enterprise contact-sales | Reported to have curtailed its open free tier; upgrading reportedly requires scheduling a call. Annual billing on higher tiers. Specific prices not publicly confirmable — verify. |\n| Edamam | Paid: free developer tier then paid Enterprise tiers | Priced per product line (Nutrition Analysis, Food Database, Meal Planner). Terms reportedly restrict calls to end-user-driven requests and prohibit scraping — verify. |\n| Spoonacular | Paid: freemium **daily points** | Each call spends points from a daily quota; free plan hard-caps (returns HTTP 402) instead of billing overages. Paid tiers raise the daily point budget. Point costs and tier prices not sourced here — verify. |\n\nThe line that matters most: \"free tier of a paid API\" and \"free/open dataset\" are different in both licensing and longevity. Do not conflate them when you budget.\n\n## How the paid models actually work\n\nEach of the three commercial vendors prices differently, so the model matters more than any single number.\n\n- **Nutritionix** uses tiered paid plans with an enterprise \"contact sales\" top tier and annual billing on larger commitments. Reports indicate it pulled back its open free-access tier because of trial abuse and now offers limited, use-case-specific trial accounts, with a sales call required to upgrade. Specific tier dollar figures are not confirmable on a primary page — do not quote a number without checking the live pricing page.\n- **Edamam** starts with a free Developer tier for low volume and moves up to paid Enterprise tiers, priced separately per product line (Nutrition Analysis API, Food Database API, Meal Planner API). Beyond price, Edamam's terms reportedly restrict requests to human/end-user-driven calls and prohibit scraping or bulk saving — that is an architectural constraint, not just a cost. Verify the current terms.\n- **Spoonacular** runs a freemium **points** system. Each plan carries a daily points quota, and every call spends points (with more complex calls costing more). The free plan requires no credit card and hard-caps rather than charging overages — when the daily quota is exhausted it returns HTTP 402 and resets the next day. Paid tiers raise the daily point budget and unlock features. It is also mirrored on the RapidAPI marketplace. Verify current point costs and tier prices on the live page.\n\n## The catch — what to budget for\n\nThe trap in nutrition pricing is assuming the free options are cost-free and the paid tiers are simple. Neither is quite true.\n\n- **Free does not mean effort-free.** USDA FoodData Central and Open Food Facts cost nothing to call, but you self-integrate, normalize, and maintain everything. USDA data is reference and lab oriented rather than a complete branded-restaurant catalog, and Open Food Facts quality varies by region because it is crowdsourced.\n- **Licensing is a real cost.** Open Food Facts is ODbL — attribution and share-alike obligations that can force architecture or legal work. Edamam and Nutritionix reportedly restrict usage to end-user-driven requests and ban scraping. These constraints can matter more than the monthly fee.\n- **Freemium tiers get you hooked, then scale.** Spoonacular's daily points and per-call costs can spike as you grow; Nutritionix and Edamam funnel serious volume into contact-sales enterprise deals. Model your real request volume, not the demo.\n- **Free tiers can disappear.** Nutritionix reportedly curtailed its open free tier. A free tier is a business decision the vendor can reverse; an open dataset's license is far more durable. Weigh longevity, not just today's price.\n\n## Cheaper paths and how to compare\n\nIf cost is the deciding factor, start with the two genuinely free datasets and only move to a paid vendor when you need coverage they lack — comprehensive branded-restaurant menus, natural-language food logging, or recipe/meal-planning features that USDA and Open Food Facts do not provide.\n\n- For the full landscape of what each vendor offers (not just price), see the [nutrition APIs roundup](/fitness-apis/nutrition-apis).\n- If Nutritionix's pricing or curtailed free tier is pushing you to look elsewhere, compare the [Nutritionix alternatives](/alternatives/nutritionix-alternatives).\n- Ready to wire one up? See the [Nutritionix API integration guide](/integrate/nutritionix-api).\n- For the broader \"is any of this free\" picture across fitness data, see [free fitness APIs](/fitness-apis/free-fitness-apis) and the [wider fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost).\n\n## Honest close\n\nNutrition API pricing changes often, and most vendor pricing pages are gated or behind a sales conversation, so the specific tiers and point costs above could not all be confirmed against primary sources. Treat nothing here as final. Re-open each vendor's own pricing and terms pages — and read the license on the free datasets — before you build or budget against them.",
    "faqs": [
      {
        "q": "Is there a free nutrition API?",
        "a": "Yes. USDA FoodData Central is free and public domain (CC0) with a free data.gov API key, and Open Food Facts is free open data (ODbL) with no key needed to read. Both cost nothing to call, but you self-integrate and maintain everything, and Open Food Facts carries attribution and share-alike obligations. These are different from a paid API's free tier, which is limited and can be curtailed. Verify current terms and rate limits."
      },
      {
        "q": "How much does Nutritionix cost?",
        "a": "Nutritionix uses tiered paid plans with an enterprise contact-sales top tier and annual billing on larger commitments. Reports indicate it curtailed its open free tier and now requires a sales call to upgrade. Specific tier dollar figures are not confirmable on a primary page, so do not rely on any quoted number without checking the live Nutritionix pricing page."
      },
      {
        "q": "How does Spoonacular pricing work?",
        "a": "Spoonacular uses a freemium points model. Each plan has a daily points quota and every call spends points, with more complex calls costing more. The free plan requires no credit card and hard-caps rather than billing overages, returning HTTP 402 when the daily quota is exhausted and resetting the next day. Paid tiers raise the daily point budget. Verify current point costs and tier prices, as they were not sourced here."
      },
      {
        "q": "Is a free tier the same as a free dataset?",
        "a": "No, and conflating them is a common budgeting mistake. A paid API's free tier (Edamam Developer, Spoonacular free plan, Nutritionix historically) is limited, funnels you toward paid tiers, and can be reduced or removed at the vendor's discretion. A free/open dataset (USDA FoodData Central, Open Food Facts) is licensed to be free and is far more durable, though it shifts integration work and license obligations onto you."
      },
      {
        "q": "What is the biggest hidden cost of a nutrition API?",
        "a": "Usually the licensing and usage restrictions, not the monthly fee. Open Food Facts is ODbL with attribution and share-alike duties; Edamam and Nutritionix reportedly restrict calls to end-user-driven requests and prohibit scraping. On the free datasets, the hidden cost is self-integration, normalization, and coverage gaps. Model these against your real request volume and verify each vendor's current terms."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/nutrition-apis",
        "label": "Best nutrition APIs"
      },
      {
        "href": "/alternatives/nutritionix-alternatives",
        "label": "Nutritionix alternatives"
      },
      {
        "href": "/integrate/nutritionix-api",
        "label": "Integrate the Nutritionix API"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Get a heads-up when nutrition and fitness APIs change their pricing, free tiers, or usage terms before it hits your budget."
    }
  },
  {
    "slug": "exercise-database-api-pricing",
    "primaryQuery": "exercise database api pricing",
    "h1": "Exercise Database API Pricing: What Does It Cost?",
    "metaTitle": "Exercise Database API Pricing: Free vs Paid",
    "metaDescription": "ExerciseDB on RapidAPI and API Ninjas bill per request; exercisedb.dev advertises paid plans; wger and free-exercise-db self-host free. The AGPL catch.",
    "updated": "2026-07-23",
    "answer": "It depends on which kind you pick: paid gateways like ExerciseDB on RapidAPI and API Ninjas use a freemium, per-request model with a limited free tier, then paid tiers metered by request volume. wger and free-exercise-db cost $0 for the software or data, so you pay only your own hosting, while the separate exercisedb.dev API points production use to paid plans and has no code in its repository to self-host. On the free side the catch is licensing, because wger's AGPL copyleft matters for closed-source products. Treat every specific quota or price as 'as of 2026 - verify on the live listing.'",
    "body": "## What it actually costs\n\nThe honest way to read this market is a two-column split: are you renting access to a hosted API, or self-hosting an open dataset? The costs are completely different in kind.\n\n| Option | Pricing model | Watch out (as of 2026 — verify) |\n|---|---|---|\n| ExerciseDB (via RapidAPI) | Freemium / tiered, per-request billing through the RapidAPI marketplace | Free BASIC tier has a hard monthly request cap; paid tiers add quota; overage is charged per request above quota. Exact caps and prices live on the RapidAPI listing and change — verify. |\n| API Ninjas (Exercises API) | Freemium — free API key, paid tiers for higher volume | Commercial use is not permitted on the free tier. Specific tier prices are not publicly retrievable — verify on the vendor page. |\n| wger | Free, open source (AGPL-3.0), self-hosted | $0 software cost; you pay your own infra. AGPL copyleft applies if you distribute a modified version. |\n| exercisedb.dev | Hosted API with advertised paid plans; its repository has an AGPL-3.0 license file but no code | As of October 12, 2026 its README links pricing plans and separate terms of use and offers a playground that is not for production. Plan prices and limits could not be verified. |\n| free-exercise-db | Free, public domain (Unlicense) | $0, no key, no signup, no attribution required. It is a static dataset, not a live hosted API — you serve it yourself. |\n\nThe line that matters most: a paid gateway hands you a hosted, ready-to-call API and bills you for requests; a free/open project hands you data or code for nothing and shifts the hosting, serving, and maintenance onto you. Neither is \"cheaper\" in the abstract — it depends on your volume, your engineering capacity, and your license tolerance.\n\n## ExerciseDB plans, free tier and rate limits: what we could verify\n\nSearchers ask four things about ExerciseDB: whether it is completely free, what the free tier allows, what RapidAPI charges, and what the rate limits are. Here is what the primary sources said when we checked on October 12, 2026, and what they did not.\n\n- **There are two ExerciseDBs, priced differently.** The RapidAPI listing is the freemium, per-request gateway in the table above. exercisedb.dev is a separate project whose GitHub repository carries an AGPL-3.0 LICENSE file.\n- **exercisedb.dev advertises paid plans.** Its README links \"Pricing Plans\", full documentation and separate \"Terms Of Use\" through short links we could not open from our environment, so we cannot quote a price, a quota or a plan name.\n- **The free way in is a playground, not a production tier.** The README offers a v2 playground and labels its endpoints \"for exploration only and not recommended for production integration — strict rate limits and potential instability may apply.\" That warning is the only rate-limit statement we could read; it gives no number, and we will not guess one.\n- **There is nothing to self-host.** When we cloned the repository on October 12, 2026 it held exactly two files, the README and the LICENSE, in a history that starts on November 25, 2025: no API code and no setup or deployment instructions.\n- **RapidAPI's current caps and prices could not be re-checked**, because RapidAPI is unreachable from our environment. The model in the table (a capped free tier, paid tiers, per-request overage) is from our July review.\n\nSo is ExerciseDB completely free? Not for production use, on the evidence we could read: the RapidAPI listing is freemium, and exercisedb.dev points production use to paid plans. The options with no plan to buy are wger and free-exercise-db, with the trade-offs in the table. The project's own README is the [primary source for the exercisedb.dev claims above](https://github.com/ExerciseDB/exercisedb-api).\n\n## The catch — AGPL, quotas, and hidden costs\n\nThe two things most likely to bite are the licensing on the free options and the metered billing on the paid ones.\n\n- **AGPL copyleft (wger).** wger's software is licensed under the GNU AGPL; exercisedb.dev's repository carries the same license file but no code, so you meet it as a hosted API under its terms of use instead. AGPL is a strong copyleft license with a network-use trigger: if you run a modified version as a network service, you can be obligated to release your modifications under the same license. For a closed-source commercial product this is a genuine architectural and legal consideration, not just a footnote — get it reviewed before you build on it. By contrast, **free-exercise-db is public domain (the Unlicense)** with no obligations at all, which makes it the most unrestricted free option — at the cost of being a static dataset with no live API or SLA.\n- **Per-request overages on the paid gateways.** RapidAPI-style billing typically caps the free tier hard, then charges per request above your paid quota; RapidAPI emails as you approach your limit. Costs can climb unexpectedly as your usage grows. Do not assume a specific free-tier quota — the numbers reported around ExerciseDB's free tier vary and are set per-API on the marketplace. Verify on the live listing before you budget.\n- **Commercial-use restrictions.** API Ninjas' free tier excludes commercial use — a limitation on what you can ship, separate from the price.\n- **Your own infrastructure.** \"Free\" self-hosting (wger, free-exercise-db) still costs servers, bandwidth, uptime, and the engineering time to parse, normalize, and keep the dataset updated.\n- **Exercise counts vary — do not over-index.** Different projects and versions advertise different library sizes; treat any headline count as version-specific and verify against the actual repo or listing.\n\n## How it compares and cheaper paths\n\nIf you need a hosted API and low volume, a freemium gateway gets you started for nothing — just watch the quota. If you want zero recurring cost and can run infrastructure, the open options are genuinely free; the deciding factor is usually the license, not the price.\n\n- For the full landscape of what is available and how the options stack up, see the [exercise database APIs comparison](/fitness-apis/exercise-database-apis).\n- Weighing free/open replacements for the RapidAPI-hosted ExerciseDB? See [ExerciseDB alternatives](/alternatives/exercisedb-alternatives).\n- Ready to wire one up? The [ExerciseDB API integration guide](/integrate/exercisedb-api) walks through it.\n- For the wider \"is any of this free\" picture, see [free fitness APIs](/fitness-apis/free-fitness-apis) and the [overall fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost).\n\n## Honest close\n\nExercise-content pricing is volatile on the paid side and license-gated on the free side. RapidAPI marketplace quotas and prices change without notice, and AGPL obligations depend on how you deploy. Do not treat any quota, tier, or license summary here as final — re-open the live RapidAPI listing, the vendor's pricing page, and the project's own LICENSE file before you build or budget against them.",
    "faqs": [
      {
        "q": "Is there a free exercise database API?",
        "a": "Yes. wger (AGPL, self-hosted) and free-exercise-db (public domain / Unlicense) are genuinely free for the software or data - you pay only your own hosting, and free-exercise-db is a static dataset rather than a live API. exercisedb.dev is not one of them: as of October 12, 2026 its repository holds only a README and an AGPL-3.0 license file, and its README points production use to paid plans and offers only a playground that is not meant for production. Paid gateways like ExerciseDB on RapidAPI and API Ninjas also offer limited free tiers, but those are freemium hooks that lead to paid, metered plans."
      },
      {
        "q": "How much does ExerciseDB cost?",
        "a": "The RapidAPI ExerciseDB is sold on a freemium, tiered model: a free BASIC tier with a hard monthly request cap, then paid tiers, with overage charged per request above quota. The exact caps and prices are set on the RapidAPI listing and change often, so verify them there rather than relying on any figure quoted elsewhere. The separate exercisedb.dev project advertises its own paid plans, whose prices and limits we could not read as of October 12, 2026."
      },
      {
        "q": "What is the AGPL licensing implication for exercise APIs?",
        "a": "wger's software is licensed under the GNU AGPL, a strong copyleft license with a network-use trigger: running a modified version as a network service can obligate you to release your modifications under the same license. For a closed-source commercial product this is a real architectural and legal consideration. free-exercise-db, by contrast, is public domain (Unlicense) with no obligations. Get any AGPL dependency reviewed before you build on it."
      },
      {
        "q": "Can I use these exercise APIs for a commercial product?",
        "a": "It varies by option and is separate from price. API Ninjas' free tier excludes commercial use - you would need a paid tier. The public-domain free-exercise-db has no restrictions. wger is free to use commercially but carries AGPL copyleft obligations if you distribute or run modified versions, and exercisedb.dev's hosted API has its own terms of use, which we could not read. Always check the specific license and terms before shipping."
      },
      {
        "q": "Are the free exercise databases really free?",
        "a": "The software and data are $0, but self-hosting still costs servers, bandwidth, uptime, and the engineering time to parse, normalize, and keep the dataset updated. And wger's AGPL license carries copyleft obligations. 'Free' here means no license or data fee - not zero total cost. Verify the current license and terms on each project's own repository."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/alternatives/exercisedb-alternatives",
        "label": "ExerciseDB alternatives"
      },
      {
        "href": "/integrate/exercisedb-api",
        "label": "Integrate ExerciseDB"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "RapidAPI quotas shift and AGPL terms are easy to miss - subscribe for plain-English updates when exercise API pricing and licensing change."
    }
  },
  {
    "slug": "are-fitness-apis-free",
    "primaryQuery": "are fitness apis free",
    "h1": "Are Fitness APIs Free? An Honest Overview",
    "metaTitle": "Are Fitness APIs Free? Honest 2026 Breakdown",
    "metaDescription": "Many fitness APIs are free to call - Fitbit, Oura, WHOOP - but aggregators are paid and content APIs are mixed. The honest 2026 breakdown by category.",
    "updated": "2026-07-23",
    "answer": "Many fitness APIs are free to call - most first-party wearable APIs (Fitbit, Oura, WHOOP) charge no per-request fee, and a few nutrition and exercise datasets are genuinely free and open. But 'free to call' is not 'free to use': aggregators are paid per connected user, Strava and Garmin break the pattern, and the biggest costs (user memberships, approval time, your own infrastructure) sit outside the API sticker. Pricing changed in 2026 and varies by country, so verify current pricing on each provider's own page.",
    "body": "## The three kinds of \"free\"\n\nBefore the categories, fix the vocabulary, because it settles most arguments:\n\n- **Free to call** — you register a developer app and hit the API with no per-request fee to the provider. Fitbit, Oura, and WHOOP work this way.\n- **User-side cost** — the data only exists if your end user owns the device and, increasingly, pays a membership (Oura Membership, WHOOP subscription). For you the developer this is $0; for your product it caps who can actually connect.\n- **Your-side cost** — servers, storage of high-volume wearable history, OAuth token refresh, webhook handling, monitoring, and the engineering time to survive approval queues and API migrations. This is real money even when the API sticker says free.\n\nA \"free to call\" API can still be expensive to ship. Keep these three columns separate on every vendor you evaluate.\n\n## Are fitness APIs free? By category\n\nFitness APIs are not one market. They split into four buckets that price completely differently.\n\n| Category | Free to call? | The catch (as of 2026, verify) |\n| --- | --- | --- |\n| First-party wearable APIs (Fitbit, Oura, WHOOP) | Generally yes — no per-call fee | Gated by approval and/or the user's device/membership; not open self-serve |\n| First-party exceptions (Strava, Garmin) | Not unconditionally | Strava reportedly requires a paid subscription for Standard-tier developers (2026); Garmin is partner-approval-only with terms not publicly listed |\n| Aggregators (Terra, Junction, Rook, Spike) | No — paid | Priced per connected user / per monthly active user (MAU), tiered, enterprise contact-sales |\n| Nutrition / exercise content APIs | Mixed | Freemium/tiered (Nutritionix, Edamam, Spoonacular, ExerciseDB) alongside genuinely free/open options (USDA, Open Food Facts, wger, free-exercise-db) |\n\n### First-party wearable APIs: free to call, but gated\n\nFitbit's Web API has historically been free to call, Oura's Cloud API lists no developer fee, and WHOOP's developer platform has no documented per-call charge. What gates them is not a usage bill but approval and membership. Oura caps a freshly registered app at roughly 10 connected users until you pass its review; WHOOP requires developers to hold a WHOOP membership to build at all; Fitbit is mid-migration to the Google Health API during 2026, and the successor's pricing model is not clearly public yet — verify. Note the Google Health API is a different product from the paid Google Cloud Healthcare API, so don't read the latter's per-request pricing as the former's.\n\n### The first-party exceptions\n\nTwo providers break the \"free to call\" pattern, so don't blanket-state that all wearable APIs are free. Strava reportedly now requires Standard-tier developers to hold a paid Strava subscription (the normal membership, around $11.99/mo in the US and varying by country — verify), effective in mid-2026. Garmin does not publicly list its Health API terms at all; access is partner-approval-only, and third parties report a setup fee and possible commercial licensing that could not be confirmed on a Garmin-owned page — treat as unverified and do not label Garmin \"free.\"\n\n### Aggregators: genuinely paid\n\nIf you want one integration across many devices instead of building each provider yourself, aggregators like Terra, Junction (formerly Vital), Rook, and Spike are where recurring API spend actually accrues. The model is consistent even where the numbers aren't public: you pay per connected user or per MAU, tiered by user count, often with a credit/event layer and an enterprise \"contact sales\" top tier. Specific per-user dollar rates are rarely listed publicly — verify with the vendor. This is the classic build-vs-buy trade: a real recurring fee in exchange for skipping N separate first-party integrations.\n\n### Nutrition and exercise content: mixed, with real free options\n\nContent APIs are the most varied bucket. The commercial ones are freemium or tiered — Nutritionix, Edamam, and Spoonacular for nutrition; ExerciseDB (via RapidAPI) and API Ninjas for exercises — typically a limited free tier that scales into paid plans by volume or features, with metered overages. But genuinely free and open options exist and are worth naming plainly: USDA FoodData Central (public domain, free API key), Open Food Facts (open, no key, ODbL attribution), wger (AGPL, self-host), and free-exercise-db (public domain, static dataset). These cost $0 for the data but shift integration, hosting, and license-compliance work onto you.\n\n## The catch: what to budget for even when it's free\n\nThe provider's price tag is usually the smallest number. What actually adds up:\n\n- **User membership dependency** — if your product relies on Oura or WHOOP data, your addressable market is only users already paying that provider. Free for you, but it shrinks who can connect.\n- **Approval and time-to-market** — Garmin's partner review, Oura's partner tier, and WHOOP's gating cost calendar time, which is a real cost for a roadmap even at $0.\n- **Maintenance and migrations** — APIs deprecate and move. Fitbit's 2026 shift to the Google Health API forces a re-integration; Strava's 2024–2026 changes altered display rules and access economics. Budget engineering time for this every year.\n- **Your infrastructure and storage** — wearable data is continuous and high-volume; storing and re-syncing history is an ongoing bill.\n- **License obligations** — the \"free\" open datasets carry terms: public domain has none, ODbL adds attribution/share-alike, AGPL adds copyleft. These can force architecture or legal work, not just payment.\n- **Compliance** — health data carries privacy and security obligations (consent, deletion, sometimes HIPAA-adjacent scope) regardless of API price.\n\n## Free to license, expensive to integrate\n\nThe licence price and the engineering bill often run in opposite directions. When we counted this site's [API directory](/apis) on September 1, 2026, 12 of its 24 products carried a developer cost of free, and four of those were also rated high engineering effort, which is our rough judgement rather than a vendor fact: wger, MediaPipe, MoveNet and Apple Vision body pose. Of the five products rated high effort, four were free; the fifth, Garmin, was contact-sales. Money buys you someone else's engineering time, and declining to spend it means spending your own.\n\nThree of the four are pose models, where the cost moves from the invoice to the device: frame handling, thermal limits, battery, and an accuracy question that only real users on real hardware can answer. None of the four states an approval gate, so the hardest integrations in the free group are the ones you can start this afternoon, which is why teams underestimate them. Our [build versus buy guide for motion tracking](/motion/build-vs-buy-ai-motion-tracking) walks that trade.\n\n## Cheaper paths and how it compares\n\nWhich path is cheapest depends on your shape. Few devices, willing to do approvals, engineering to spare → direct first-party APIs (near-zero API fee, high integration and maintenance cost). Many devices, want one integration and a predictable per-MAU budget → an aggregator (real recurring fee, less maintenance). Most teams end up mixing. If you only need workout or food content rather than a specific person's wearable history, the genuinely free and open options often cover it. For the full roundup of no-cost and open choices, see the [free fitness APIs roundup](/fitness-apis/free-fitness-apis) — this page won't reproduce it. To compare the landscape and decide which provider fits, see the [fitness API hub](/fitness-apis), and for a structured breakdown of what a build actually runs, see [how much a fitness API costs](/pricing/how-much-does-a-fitness-api-cost).\n\n## The honest close\n\nSo, are fitness APIs free? Many are free to call — most first-party wearable APIs charge no per-request fee — and a few nutrition and exercise datasets are genuinely free and open. But Strava and Garmin break the pattern, aggregators are paid by design, and the costs that actually bite (user memberships, approval time, maintenance, your own infrastructure) sit outside the API sticker. Pricing and access rules for this category changed noticeably in 2026 and vary by country, so verify every specific against the provider's live docs — or a sales conversation — before you build a budget on it.",
    "faqs": [
      {
        "q": "Are fitness APIs free?",
        "a": "Many are free to call - most first-party wearable APIs, including Fitbit, Oura, and WHOOP, charge no per-request fee, and some nutrition and exercise datasets are genuinely free and open. But it is not universal: aggregators like Terra and Junction are paid per connected user, and Strava and Garmin have their own gates. 'Free to call' also is not 'free to use', because your users must own the device and often pay a membership. As of 2026, verify current pricing per provider."
      },
      {
        "q": "Which fitness APIs are genuinely free and open?",
        "a": "For data you can use at $0, the clearest options are USDA FoodData Central (public domain nutrition data, free API key), Open Food Facts (open food database, no key, with ODbL attribution terms), wger (open-source workout and nutrition API, AGPL, self-host), and free-exercise-db (public-domain exercise dataset). These are truly free but shift integration, hosting, and license-compliance work onto you. Our roundup at /fitness-apis/free-fitness-apis covers them in detail."
      },
      {
        "q": "If the API is free to call, what actually costs money?",
        "a": "The provider's price tag is usually the smallest number. The real costs are your users owning the device or paying a membership (Oura Membership, WHOOP subscription), the calendar time to pass partner approval (Garmin, Oura partner tier, WHOOP), maintenance as APIs migrate (Fitbit's 2026 move to the Google Health API forces a rebuild), and your own infrastructure - servers, storage of high-volume history, token refresh, and monitoring."
      },
      {
        "q": "Which fitness APIs are not free?",
        "a": "Cross-device aggregators (Terra, Junction formerly Vital, Rook, Spike) are paid by design, typically per connected user or per monthly active user, tiered, with enterprise contact-sales; specific rates are rarely public - verify. Among first-party APIs, Strava reportedly now requires Standard-tier developers to hold a paid Strava subscription (2026), and Garmin is partner-approval-only with terms not publicly listed. Do not label Garmin free. Commercial nutrition and exercise content APIs (Nutritionix, Edamam, Spoonacular, ExerciseDB) are freemium or tiered."
      },
      {
        "q": "Is a free tier the same as a free and open API?",
        "a": "No. A freemium free tier is a limited slice of a paid product - it can be capped, curtailed, or removed (Nutritionix reportedly narrowed its open free tier), and it exists to lead into paid plans. A free and open dataset like USDA FoodData Central or free-exercise-db is licensed to be free and used freely, though open licenses (public domain, ODbL, AGPL) carry different obligations. Keep the two distinct when you plan for the long term."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/free-fitness-apis",
        "label": "Free & open-source fitness APIs"
      },
      {
        "href": "/fitness-apis",
        "label": "The fitness & health API landscape"
      },
      {
        "href": "/pricing/how-much-does-a-fitness-api-cost",
        "label": "How much does a fitness API cost?"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Fitness API pricing and access rules shifted across 2026 - subscribe for plain-English updates when a provider changes what is free and what is gated."
    }
  },
  {
    "slug": "how-much-does-a-fitness-api-cost",
    "primaryQuery": "how much does a fitness api cost",
    "h1": "How Much Does a Fitness API Cost?",
    "metaTitle": "How Much Does a Fitness API Cost? (2026)",
    "metaDescription": "Fitness API cost depends on the pricing model - free-to-call, per-MAU aggregator, or freemium - plus hidden infra, maintenance and approval costs.",
    "updated": "2026-07-23",
    "answer": "There is no single fitness API price. Cost is driven by which pricing model you land in - free-to-call first-party APIs, per-MAU or per-connection aggregators, tiered freemium content APIs, or free self-host - and by hidden costs that usually dwarf the sticker. The cost that bites most is rarely the API fee itself: it is your own infrastructure, the maintenance time as providers change their terms, and the approval time before you can ship. Every specific figure in this space is volatile, so verify current pricing on the vendor's own page before you budget.",
    "body": "## The four pricing models you will encounter\n\nAlmost every fitness or health-data API fits one of four cost models. Knowing which one you are in tells you far more about your real budget than any single quoted price.\n\n| Pricing model | Typical examples | How the cost works |\n|---|---|---|\n| Free-to-call, approval-gated first-party | Fitbit, Oura, WHOOP (Strava partly) | No per-request API fee. You \"pay\" in approval time, membership gating, and separate per-provider integration work. Each provider is its own build. |\n| First-party with a subscription or licensing wrinkle | Strava (2026 developer-subscription requirement), Garmin (unlisted partner terms) | Cost is conditional and changes — read the current agreement. Some report setup fees or commercial licensing; not publicly listed, so verify directly. |\n| Per-MAU / per-connected-user aggregators | Cross-device aggregators | Priced on active or connected users, tiered by user count, often with a credit or event layer. Enterprise tiers are \"contact sales.\" Predictable to model; scales with your user base. |\n| Tiered / freemium content APIs | Nutrition and exercise-database APIs | A free tier hooks you, then paid tiers scale by request volume or feature. Watch for metered per-request overages and daily quota caps. |\n\nThere is also a genuine fifth option: **free and open self-host**. Public datasets and open-source projects (for example USDA FoodData Central, Open Food Facts, wger, and free-exercise-db) cost nothing for the data or software itself. The trade is that you self-host, self-integrate, and take on licensing obligations that range from none (public domain) through attribution and share-alike (ODbL) to copyleft (AGPL). \"$0 for the data\" still means you pay for the infrastructure and the labor. For a fuller picture of what is truly free, see [are fitness APIs free?](/pricing/are-fitness-apis-free) and the roundup of [free fitness APIs](/fitness-apis/free-fitness-apis).\n\n## The hidden costs that usually exceed the API fee\n\nThe quoted price — even when it is $0 — is rarely the biggest number in your budget. These are the cost drivers that tend to dominate a real health-data product.\n\n| Cost driver | What it depends on |\n|---|---|\n| Infrastructure and hosting | Servers, bandwidth, uptime, and scaling — you pay these even with a \"free\" self-hosted API. |\n| Storage and data volume | Wearable data (per-minute heart rate, sleep, workouts) accumulates fast. Storage, egress, and database cost grow with every monthly active user. |\n| Maintenance and breakage | APIs deprecate and migrate. A provider changing terms or endpoints forces a re-integration — budget engineering time for this every year. |\n| Approval and time-to-market | Partner review, data-use agreements, and compliance sign-off cost calendar time even when the dollar cost is zero. |\n| Metered-overage surprises | Per-request overages and points-based quotas can spike unexpectedly at scale; freemium tiers get you started cheap, then cost climbs with growth. |\n| Licensing and compliance | Attribution and share-alike (ODbL), copyleft with a network-use trigger (AGPL), and usage restrictions (end-user-driven only, no scraping) can force architecture or legal work — not just payment. |\n| Per-user membership dependency | If your product relies on a device whose data requires the user to hold a paid membership, your addressable market is only those paying users. That is a market-size cost, not a line item. |\n| Health-data compliance overhead | Consent, deletion, encryption, and privacy obligations (GDPR, and sometimes HIPAA-adjacent scope) add engineering and legal cost regardless of the API's price. |\n\nThe pattern to internalize: a \"free\" API shifts cost onto your side of the ledger, and a paid API buys some of that cost back. Neither is automatically cheaper — it depends on how many providers you need and how much engineering time you have.\n\n## Build vs buy: the framing that decides your budget\n\nThe core budgeting decision in this space is build-vs-buy, and it comes down to one trade-off: an aggregator's **recurring per-user fee** versus the **labor of building and maintaining N separate first-party integrations** yourself.\n\n- **Direct first-party (build).** Low or zero API fee, but every provider is a separate integration with its own OAuth, approval, and quirks — and every provider change is your maintenance burden. This makes sense when you need only a few devices, are willing to go through approvals, and have engineering time to spare.\n- **Aggregator (buy).** A real recurring fee, priced per connected user or per monthly active user, in exchange for one integration that covers many devices and far lower maintenance. This makes sense when you need broad device coverage, want a single integration, and can model a predictable per-MAU budget.\n\nMost teams end up **mixing** — an aggregator for breadth, plus one or two direct integrations where the economics or data depth justify the extra work. To work through this decision in depth, see [fitness API vs build your own](/fitness-apis/fitness-api-vs-build-your-own), and to understand how the recurring-fee side is priced, see [health data aggregator APIs](/fitness-apis/health-data-aggregator-apis).\n\n## Honest close\n\nThere is no headline number for \"a fitness API,\" and anyone who quotes you one is skipping the parts that actually move your budget: infrastructure, maintenance, approval time, and compliance. Pricing and access terms in this space change often — first-party providers have added subscription requirements and forced migrations within a single year. Model the cost *structure* for your situation, then re-open each vendor's live pricing and terms before you commit real money against them.",
    "faqs": [
      {
        "q": "How much does a fitness API cost?",
        "a": "It depends entirely on the pricing model. Many first-party wearable APIs are free to call, cross-device aggregators charge a recurring fee per connected user or per monthly active user, and some nutrition and exercise content APIs are freemium or tiered by request volume. Genuinely free open-source and public-dataset options also exist if you self-host. There is no single headline price, and the biggest cost is usually your own infrastructure and maintenance rather than the API fee. As of 2026, verify current pricing directly with each vendor."
      },
      {
        "q": "What actually drives the cost of a fitness API integration?",
        "a": "Four things dominate: the pricing model of the API itself, your own infrastructure and data-storage costs, the ongoing maintenance labor as providers deprecate or migrate their APIs, and the approval or compliance time before you can ship. Health-data licensing and privacy obligations add further engineering and legal cost. In most real products these hidden costs exceed the quoted API fee - even when that fee is zero."
      },
      {
        "q": "Is it cheaper to build direct integrations or buy an aggregator?",
        "a": "It is a trade-off, not a fixed answer. Building direct first-party integrations means low or zero API fees but separate engineering work per provider and ongoing maintenance as each one changes. Buying an aggregator means a real recurring per-user fee in exchange for one integration covering many devices and much lower maintenance. Few devices plus engineering time favors building; broad device coverage plus a predictable per-user budget favors buying. Most teams mix both."
      },
      {
        "q": "What are the hidden costs of a fitness API?",
        "a": "The ones people forget: infrastructure and hosting, storage of high-volume wearable data that grows with your user base, maintenance when a provider changes or migrates its API, approval and time-to-market for partner review, metered-overage surprises on freemium tiers, and licensing or compliance obligations such as attribution, copyleft, or HIPAA and GDPR handling. These recurring costs usually outweigh the API's sticker price."
      },
      {
        "q": "Are any fitness APIs genuinely free?",
        "a": "Yes, some are free to call with no per-request fee, and a few open-source projects and public datasets are genuinely free to use if you self-host. But free to call is not the same as free to use: you still pay for infrastructure, storage, and maintenance, and open datasets carry licensing obligations ranging from none to copyleft. See the dedicated breakdown of which fitness APIs are actually free before assuming zero cost."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/fitness-api-vs-build-your-own",
        "label": "Fitness API vs build your own"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/pricing/are-fitness-apis-free",
        "label": "Are fitness APIs free?"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Fitness API pricing and access terms change often - subscribe for plain-English updates when providers add fees, migrate APIs, or shift their cost models."
    }
  },
  {
    "slug": "fitness-api-free-tiers-compared",
    "primaryQuery": "fitness api free tier comparison",
    "h1": "Fitness API Free Tiers Compared: What Free Actually Includes",
    "metaTitle": "Fitness API Free Tiers Compared (2026): 12 of 25 Free",
    "metaDescription": "Free means four different things across fitness APIs. Compare the 12 free-to-call items and the 5 free tiers, with the catch on each. Structure, no prices.",
    "updated": "2026-08-12",
    "answer": "Across the 25 items in this site's own State of Fitness APIs 2026 dataset, free means four different things: free to call with no per-request fee (12 items), a free tier that runs out (5 items), free open-source code or models where your engineering time is the bill, and free data whose licence obligations constrain what you can ship. Those categories behave completely differently over time, so comparing them as one thing is the mistake that wrecks a budget. Of the 12 free-to-call items only five carry no approval gate and no user-side cost, and every one of those five is a dataset or a model rather than a live personal-data feed. This page carries no dollar figures on purpose: prices are volatile, structures are stable, and the structure is what you design against.",
    "faqs": [
      {
        "q": "What are the four different things vendors mean by free?",
        "a": "Free to call: no per-request fee documented, with the constraint arriving as an approval, a user-side dependency, or a scope restriction. A free tier that runs out: a real entry point into a paid product, which the vendor can narrow or withdraw. Free code or open models: nothing to obtain, but everything they do not do becomes your engineering bill. Free data with licence obligations: no money changes hands, but attribution, share-alike, or copyleft terms constrain what you can ship. Only the first two look alike on a pricing page."
      },
      {
        "q": "Which free-to-call fitness APIs carry no approval gate and no user-side cost?",
        "a": "Five of the twelve free-to-call items in the 2026 dataset have both fields null: Polar Open AccessLink, USDA FoodData Central, MediaPipe Pose Landmarker, TensorFlow MoveNet, and Apple Vision body pose. Note what they have in common — each is a dataset, a model, or a self-serve feed rather than an API returning a named person's health history. Open Food Facts and wger also record no gate, but both carry licence obligations instead. A null field means not documented on our pages, never proof that no catch exists."
      },
      {
        "q": "Where does each fitness API free tier stop?",
        "a": "In five different places, and only two of them are a request quota. Strava stops on permitted use, since athlete data may generally only be shown back to that athlete and AI or ML training is prohibited. Edamam stops on request provenance, with terms reportedly restricting calls to end-user-driven requests. ExerciseDB stops on commercial use plus a hard request cap. Nutritionix stops at a Syndigo sales conversation. QuickPose stops above a monthly-active-device threshold. Verify each against the provider's live terms."
      },
      {
        "q": "Which free-tier fitness APIs restrict commercial use or how you use the data?",
        "a": "Three of the five, in different ways. The ExerciseDB free tier on RapidAPI is often non-commercial outright. Edamam requires attribution on lower plans and reportedly restricts calls to end-user-driven requests while prohibiting scraping or bulk saving, which rules out pre-fetching a catalogue. Strava permits commercial products but restricts what you may display and prohibits using athlete data to train AI or ML models. Among the free-to-call items, Open Food Facts allows commercial use under ODbL share-alike, and wger's code is AGPL-3.0 copyleft."
      },
      {
        "q": "Why does this comparison list no dollar figures?",
        "a": "Because the dataset behind it has none by design, and its methodology states why: prices are volatile, structures are stable. A vendor can reprice twice a year without changing the fact that its API sits behind a partner review or that its data only exists for people who already bought hardware. There is a practical reason too — serious tiers in this market are contact-sales, and most figures circulating in third-party posts were stale on publication. Structure is what you design against; price is what you negotiate later."
      }
    ],
    "related": [
      {
        "href": "/pricing/are-fitness-apis-free",
        "label": "Are fitness APIs free?"
      },
      {
        "href": "/fitness-apis/free-fitness-apis",
        "label": "Free & open-source fitness APIs"
      },
      {
        "href": "/cost-planner",
        "label": "Fitness API Cost Planner"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Free tiers are the first thing a vendor tightens. Subscribe and we will tell you when one of these gates, caps, or licences moves."
    },
    "body": "## Four different things vendors call \"free\"\n\nThe word does four jobs in this market, and a comparison that does not separate them is useless. Every item below is one of these:\n\n1. **Free to call.** No per-request fee documented for the developer. The vendor is not billing you; the constraint arrives as an approval, a user-side dependency, or a scope restriction instead.\n2. **A free tier that runs out.** A real entry point into a paid product, sized so a prototype fits and production does not. Access you borrow, and the vendor can narrow or withdraw it.\n3. **Free code, paid service — or paid nothing, if you run it yourself.** Open-source software and open models cost nothing to obtain, and everything they do not do is your engineering bill. wger and the pose models sit here.\n4. **Free data with licence obligations.** No money changes hands, but attribution, share-alike, or copyleft terms constrain what you can ship. The invoice arrives as legal review.\n\nWhether fitness APIs are free at all is a separate question — [are fitness APIs free?](/pricing/are-fitness-apis-free) works through it by category. This page assumes the answer is \"some of them, conditionally,\" and compares those conditions side by side across the whole stack.\n\n## The 12 free-to-call items and what each one costs instead\n\nThese figures come from this site's published survey, [The State of Fitness APIs 2026](/state-of-fitness-apis-2026), and the open dataset behind it: 12 of 25 surveyed items (48%) are free to call. The catch column quotes the dataset's `approvalGate` and `userSideCost` fields verbatim, so you can check every cell against [fitness-apis-2026.json](/datasets/fitness-apis-2026.json).\n\n| Item | Layer | What \"free to call\" does not cover (verbatim from the dataset) |\n|---|---|---|\n| Fitbit Web API (Google) | Wearable direct | Approval gate: \"Developer app registration; access to other users' intraday data is case-by-case (verify).\" User-side cost: \"Each user must own a Fitbit device and account.\" |\n| Oura Cloud API | Wearable direct | Approval gate: \"A fresh app connects only a small number of users (reported around 10) until Oura's review — the 'Oura for Organizations' partner path.\" User-side cost: \"User must own an Oura Ring; Gen3 users reportedly need an active Oura Membership (verify).\" |\n| WHOOP Developer Platform | Wearable direct | Approval gate: \"Hard 10-member cap until production approval, and WHOOP requires developers to hold a membership.\" User-side cost: \"Every end user needs an active WHOOP membership for their data to flow.\" |\n| Polar Open AccessLink | Wearable direct | Both fields null: no gate, no user-side cost documented |\n| Apple HealthKit | Platform store | Approval gate: \"App Store review checks that your health usage-description strings match what you actually do.\" No user-side cost |\n| Google Health Connect | Platform store | Approval gate: \"Play Console health-data declaration and review before you can publish.\" No user-side cost |\n| USDA FoodData Central | Nutrition | Both fields null; licence is public domain (CC0), so no obligation either |\n| Open Food Facts | Nutrition | Both fields null; the catch is the licence: ODbL share-alike can require opening a derived database |\n| wger (self-hosted) | Exercise content | Both fields null; the catch is the licence: AGPL-3.0 code, Creative Commons data |\n| MediaPipe Pose Landmarker | Pose model | Both fields null; Apache-2.0, ungated |\n| TensorFlow MoveNet | Pose model | Both fields null; Apache-2.0, ungated |\n| Apple Vision body pose | Pose model | Both fields null; bundled with the Apple SDK, ungated |\n\nRead down that column and the shape is obvious. The free layer and the gated layer overlap heavily but are not the same set: five of these twelve put an approval on your critical path, three make your end user pay someone else first, and two swap money for licence obligations. Only five — Polar, USDA, and the three pose models — are free in the flat, unqualified sense, and every one of those five is a dataset or a model rather than a live personal-data feed. Not a coincidence: the moment an API returns a specific human's health history, somebody wants to review your app first.\n\n## The five free tiers, and where each one stops\n\nThe dataset classes five items as `free-tier-then-paid`: a genuine free entry point that ends somewhere. Where it ends is the only thing worth comparing, stated only as our own verified pages state it.\n\n- **Strava** — no per-call developer fee, but Standard-tier developers reportedly must hold a paid Strava subscription (2026, verify). The harder limit is architectural: an athlete's data may generally only be displayed back to that athlete, and using it to train AI or ML models is prohibited. A free tier that forbids your core feature is not a pricing question.\n- **Nutritionix** — freemium into tiered paid plans with an enterprise contact-sales top tier and annual billing on larger commitments. Higher tiers are gated through a Syndigo sales contact rather than a self-serve checkout. Reports conflict on whether the open free tier still exists at all, so verify before designing around it.\n- **Edamam** — a self-serve free Developer tier for low volume, then paid Enterprise tiers priced per product line. Two catches beyond volume: lower plans carry attribution requirements, and the terms reportedly restrict calls to end-user-driven requests and prohibit scraping or bulk saving. That rules out pre-fetching a catalogue — an architecture decision, not a budget line.\n- **ExerciseDB (via RapidAPI)** — a hard-capped free tier, then paid tiers metered by request volume with overage above quota. The free tier is often non-commercial, which is the part that catches people. Do not assume a specific quota; reported numbers vary and marketplace listings change without notice.\n- **QuickPose** — the one motion SDK you can start on today without a sales call: a fully-featured self-serve free tier with no watermark, moving to paid above a monthly-active-device threshold. Its public repos publish no tiers, so confirm the threshold directly.\n\nNotice how differently these five run out: Strava on permitted use, Edamam on request provenance and volume, ExerciseDB on commercial use and a hard cap, Nutritionix at a sales conversation, QuickPose on a device count. Only two end mainly at a request quota, so \"what is the limit?\" is the wrong first question to ask a vendor here.\n\n## Why there are no dollar figures anywhere on this page\n\nBecause the dataset behind it has none, by design. Its methodology note puts the reason plainly: prices are volatile; structures are stable. A vendor can reprice twice a year without changing the fact that its API sits behind a partner review, or that its data only exists for users who bought hardware.\n\nThere is a second, less principled reason. Serious tiers here are contact-sales, and many of the figures circulating in posts about fitness APIs are third-party guesses that were stale on publication. Printing one would make this page look more useful and be less true.\n\nSo the comparison is structural: who bills you, who gates you, who has to be paying someone else before your feature works, and what the licence makes you do. Those four columns survive a repricing. To turn structure into a number, the [fitness API cost planner](/cost-planner) walks the same dataset item by item.\n\n## The rule that makes this comparison usable\n\nRank the four meanings by how durable they are rather than by what they cost today, because that ordering is stable and prices are not.\n\nFree data under a permissive licence is the most durable: public domain and CC0 sources cannot be withdrawn, repriced, or gated, and USDA FoodData Central is the clearest example here. Open models come next — Apache-2.0 weights you have already downloaded do not stop working. Free-to-call APIs are durable in price but not in access, since the approval gate and the user-side membership are outside your control and both have tightened recently. A vendor free tier is the least durable: it is a business decision the vendor can reverse, and Nutritionix reportedly narrowing its open free tier is the worked example.\n\nCopyleft and share-alike sit awkwardly across that ranking. AGPL and ODbL data is as durable as public domain — nobody can take it back — but it constrains what you ship, and that constraint does not soften as you grow. Treat it as a permanent architectural fact, not a cost you can pay off later.\n\nFor the roundup of the open-source options themselves, with licence detail on each, see [free and open-source fitness APIs](/fitness-apis/free-fitness-apis). This page does not reproduce it.\n\n## Watch the fine print\n\nEvery gate, threshold, and restriction above is quoted from pages verified during 2026, and vendors change all of them. The dataset records what could be verified and leaves a null where it could not, so a blank cell means \"not documented on our pages,\" never \"no catch exists.\" Re-open each provider's live terms before you commit, and treat the free-tier five as the most volatile rows here — a free tier is the first thing a vendor tightens."
  }
];
