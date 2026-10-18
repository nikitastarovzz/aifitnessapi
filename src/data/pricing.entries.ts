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
    "h1": "Health data aggregator API pricing: what Terra, Junction, Rook, Spike and four more charge",
    "metaTitle": "Health Data Aggregator API Pricing Compared (2026)",
    "metaDescription": "Published prices for Terra, Junction, Rook, Spike, Sahha, Thryve, Validic and Open Wearables as of October 2026, and what each counts as a billable user.",
    "updated": "2026-10-17",
    "answer": "As of October 17, 2026, eight health-data aggregators publish an entry price on their own pages: Validic's Inform developer tier and the open-source Open Wearables are free, Junction's Launch plan is a flat $300 a month for up to 500 connected users, Sahha's Starter is $299 a month billed annually with 1,000 users, Terra starts at $399 a month billed annually and Rook at $399 a month for 750 active users, Spike's Sandbox starts from $450 a month, and Thryve's Start Up starts at 499 euros a month for 500 users. The units differ: Terra bills credits per connected data source and per event past an allowance, Rook bills active users, Sahha and Thryve charge per user above an included number, and every vendor moves you to a custom contract at scale. LexisNexis Human API and Metriport publish no prices.",
    "body": "## What each aggregator publishes\n\nUntil this revision, this page said aggregator prices were mostly not public. That is no longer true: when we read the vendors' pricing pages on October 17, 2026, eight of them showed an entry price.\n\n| Vendor | Entry plan and list price | What it includes | How the bill grows |\n|---|---|---|---|\n| Terra | Quick Start: $399 a month billed annually, or $499 billed monthly | 100,000 credits a month, all integrations and data types | 200 credits per connected data source per month; events past 400 per source cost 0.5 credits; extra credits from $0.005, $0.003 past 1,000,000 |\n| Junction | Launch: a flat $300 a month, billed monthly | 1 to 500 connected users, 300+ device integrations, the Link widget | Enterprise (custom, billed annually) for unlimited users, lab testing and a signed BAA |\n| Rook | Core: $399 a month | Up to 750 active users, all Wearable API integrations | Core+ $999 (5,000 users), Business $1,999 (15,000), Enterprise custom; past a plan's limit, \"billing adjusts based on usage\" |\n| Spike | Sandbox: \"Starts from $450 /month\" | 40+ providers and 500+ devices, a dedicated implementation engineer | Enterprise is custom; scaling is not itemized |\n| Sahha | Starter: $299 a month billed annually | 1,000 users, every product | $0.40 per extra user; Pro at $1,499 a month billed annually includes 10,000 users, then $0.20 each |\n| Thryve | Start Up: from 499 euros a month | 500 users, one app connection | 0.50 euros per extra user; Scale Up from 1,000 euros a month for startups under ten years old (up to 5,000 users, then 999 euros per 10,000) |\n| Validic | Inform Developer: free | 5 users, 5 cloud integrations, 90-day retention | Enterprise is negotiated; a Business plan is listed as coming soon |\n| Open Wearables | Open source: free | MIT-licensed software you host | Enterprise support is scoped per project |\n\nTwo more vendors that show up in aggregator shortlists publish no price: LexisNexis Human API offers a contact form, and Metriport asks you to book an intro call before production access. Read every figure as \"list price as of October 17, 2026\", before taxes, add-ons and negotiated discounts.\n\n## What each vendor counts as a user\n\nThe unit matters as much as the rate:\n\n- **Terra** bills \"active authentications\". Its pricing FAQ says \"An active authentication is one connected data source for one end user, and costs 200 credits per month\", so one person with a watch and a ring is two.\n- **Rook** prices \"based on the plan and the number of active users\".\n- **Sahha** and **Thryve** include a number of users and charge per extra user. Sahha's pricing page has an FAQ titled \"What counts as a user?\" whose answer did not appear in the page text we fetched, so confirm the definition with Sahha.\n- **Junction**'s Launch plan \"covers 1-500 connected users\" at a flat rate.\n\n## Our arithmetic: the same user counts on each price sheet\n\nThese are our own calculations from the list prices above, not vendor quotes. They assume one connected data source per person, annual billing where it is offered, Terra events within the free allowance (Terra says 95% of customers are never charged for events), and no add-ons.\n\n| Connected users | Terra | Rook | Sahha | Thryve | Junction |\n|---|---|---|---|---|---|\n| 1,000 | About $899 a month ($399 plus 100,000 extra credits at $0.005) | $999 on Core+ (Core stops at 750) | $299 on Starter | About 749 euros on Start Up | Enterprise (custom) |\n| 5,000 | About $4,899 a month ($399 plus 900,000 extra credits) | $999 on Core+ | $1,499 on Pro (Starter would be about $1,899) | About 2,749 euros on Start Up, or 1,000 euros on Scale Up if eligible | Enterprise (custom) |\n\nSpike, Validic past its free tier, and every vendor's Enterprise plan need a quote. Open Wearables has no licence fee, but the hosting, security and provider registrations are yours. If your users connect more than one source each, Terra's column grows with them while the per-user columns do not.\n\n## Where the BAA and the contract terms sit\n\nFor a HIPAA product the plan that carries the Business Associate Agreement can matter more than the entry price:\n\n- **Terra** lists a \"Signed BAA (data protection agreement)\" on Enterprise.\n- **Junction** puts \"The signed Business Associate Agreement, our SOC 2 Type 2 and ISO 27001 reports, and customer-managed encryption keys\" in Enterprise.\n- **Rook** signs one \"when the customer is a Covered Entity or Business Associate and a BAA applies\", reviewed during contracting, and its \"standard contract term is 12 months, with the flexibility to cancel with 30 days' prior notice\".\n- **Sahha**: \"A BAA is included from Pro.\"\n- **Thryve** says \"BAA agreements included on all plans\".\n- **Validic** offers a BAA \"for Enterprise customers\".\n- **Open Wearables**: \"BAA is available on the Enterprise plan\".\n\nThis is general information, not legal advice; whether you need a BAA depends on your role under HIPAA, which our [HIPAA compliance guide for fitness apps](/compliance/hipaa-compliance-fitness-app) explains.\n\n## Add-ons and second meters\n\n- Terra prices \"Add-ons such as the Streaming API and Planned Workouts\" separately, and its Health Scores add-on starts from $499 a month on Quick Start.\n- Rook's Business and Enterprise plans include every add-on, Core+ includes three, and Core pays per add-on; its Lab Data API is \"billed by the files processed each month, on every plan\", from $249 a month for up to 300 files.\n- Spike lists its Nutrition Scanner AI as a separate Sandbox plan.\n\n## The catch: what the aggregator fee does not cover\n\n- **Your own provider registrations.** Several providers need your own developer account behind any aggregator; Rook says that \"can take several weeks\". See the credential column in our [aggregator comparison](/fitness-apis/health-data-aggregator-apis).\n- **Retention.** Short retention windows (two weeks on Thryve's Start Up, 30 days on Sahha's Starter) mean you store history yourself.\n- **Your platform costs.** Infrastructure, storage of high-volume history, token and webhook handling and compliance work stay with you. The aggregator removes integration labor, not your platform.\n\n## Why it costs money but can still save you money\n\nFirst-party wearable APIs are mostly [free to call](/pricing/are-fitness-apis-free), so an aggregator is a build-vs-buy trade: one integration and one normalized stream instead of a separate OAuth flow, approval, schema and maintenance burden per provider. In our experience the trade favors going direct when you need one or two providers and favors an aggregator when you need many. The [wider fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost) covers the full math.\n\n## Honest close\n\nThe category moved from contact-sales to published price sheets, which makes it possible to budget before a sales call. The sheets are not comparable at a glance, because the vendors bill different units, so run your own user count through each one, and re-open the live pricing pages before you commit: two of the vendors here changed owners in 2026.",
    "faqs": [
      {
        "q": "How do health data aggregators charge for API access?",
        "a": "By connected users or connected sources, in tiers, with a custom contract at the top. As of October 17, 2026, Terra bills credits for each connected data source plus events past a free allowance, Rook prices by plan and active users, Sahha and Thryve include a number of users and charge per extra user, and Junction's Launch plan is flat for up to 500 connected users. You generally pay per connection per month, not per API call."
      },
      {
        "q": "How much does a health data aggregator cost for 1,000 users?",
        "a": "By our arithmetic from the list prices on October 17, 2026, with one data source per person and annual billing: about $899 a month on Terra, $999 on Rook's Core+ plan, $299 on Sahha's Starter, about 749 euros on Thryve's Start Up, and a custom Enterprise quote on Junction, whose Launch plan stops at 500 connected users. Spike's scaling is not published. These are our calculations, not vendor quotes."
      },
      {
        "q": "Which aggregator plans include a HIPAA BAA?",
        "a": "It varies by plan. As of October 17, 2026, Thryve says BAAs are included on all plans, Sahha includes one from its Pro plan, Rook signs one when a BAA applies to the relationship, and Terra, Junction, Validic and Open Wearables list it on their Enterprise plans. Whether you need one depends on your role under HIPAA, so check that first."
      },
      {
        "q": "Is there a free health data aggregator API?",
        "a": "Two free routes exist as of October 17, 2026. Validic's Inform Developer plan is free with no contract or credit card, covering 5 users and 5 cloud integrations, and Open Wearables is MIT-licensed software you can self-host at no licence cost, though you register with each provider and run it yourself. Paid aggregators offer sandboxes or trials: Sahha's free plan lasts 30 days, Thryve offers a 14-day trial and Junction's sandbox is free."
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
        "href": "/pricing/sahha-api-pricing",
        "label": "Sahha API pricing"
      },
      {
        "href": "/pricing/thryve-api-pricing",
        "label": "Thryve API pricing"
      },
      {
        "href": "/fitness-apis/terra-vs-vital",
        "label": "Terra vs Vital (Junction)"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Get a heads-up when an aggregator changes a plan, a per-user price or the plan its BAA sits on, so your budget isn't the last to hear about it."
    },
    "sources": [
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-17",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/pricing",
        "checked": "2026-10-17",
        "note": "Terra credit tiers"
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
        "url": "https://sahha.ai/",
        "checked": "2026-10-17",
        "note": "Sahha coverage, pricing FAQ and compliance"
      },
      {
        "url": "https://sahha.ai/pricing/",
        "checked": "2026-10-17",
        "note": "Sahha plans"
      },
      {
        "url": "https://www.thryve.health/pricing",
        "checked": "2026-10-17",
        "note": "Thryve plans, storage and hosting"
      },
      {
        "url": "https://validic.com/blog/Validic-Inform-Is-Now-Free/",
        "checked": "2026-10-17",
        "note": "Validic Inform free tier"
      },
      {
        "url": "https://validic.com/inform-signup/",
        "checked": "2026-10-17",
        "note": "Validic Inform plans"
      },
      {
        "url": "https://openwearables.io/pricing",
        "checked": "2026-10-17",
        "note": "Open Wearables licence and Enterprise"
      },
      {
        "url": "https://risk.lexisnexis.com/products/humanapi",
        "checked": "2026-10-17",
        "note": "LexisNexis Human API"
      },
      {
        "url": "https://docs.metriport.com/medical-api/getting-started/quickstart",
        "checked": "2026-10-17",
        "note": "Metriport Medical API access"
      },
      {
        "url": "https://www.thryve.health/certifications-compliance",
        "checked": "2026-10-17",
        "note": "Thryve certifications and BAA"
      },
      {
        "url": "https://docs.tryrook.io/data-sources/",
        "checked": "2026-10-17",
        "note": "Rook data sources and own developer accounts"
      },
      {
        "url": "https://validic.com/news/chartspan/",
        "checked": "2026-10-17",
        "note": "ChartSpan acquisition of Validic"
      },
      {
        "url": "https://www.spikeapi.com/integrations",
        "checked": "2026-10-17",
        "note": "Spike integrations and acquisition banner"
      },
      {
        "url": "https://openwearables.io/docs",
        "checked": "2026-10-17",
        "note": "Open Wearables docs"
      },
      {
        "url": "https://openwearables.io/docs/providers/supported",
        "checked": "2026-10-17",
        "note": "Open Wearables provider setup"
      }
    ]
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
    "answer": "Many fitness APIs are free to call - most first-party wearable APIs (Fitbit, Oura, WHOOP, Garmin, Strava) charge no per-request fee, and a few nutrition and exercise datasets are genuinely free and open. But 'free to call' is not 'free to use': aggregators are paid per connected user, Garmin is for business use only and may require a licence fee for some metrics used commercially, Strava requires a Strava subscription to create an app, and the biggest costs (user memberships, approval time, your own infrastructure) sit outside the API sticker. Pricing changed in 2026 and varies by country, so verify current pricing on each provider's own page.",
    "body": "## The three kinds of \"free\"\n\nBefore the categories, fix the vocabulary, because it settles most arguments:\n\n- **Free to call** — you register a developer app and hit the API with no per-request fee to the provider. Fitbit, Oura, and WHOOP work this way.\n- **User-side cost** — the data only exists if your end user owns the device and, increasingly, pays a membership (Oura Membership, WHOOP subscription). For you the developer this is $0; for your product it caps who can actually connect.\n- **Your-side cost** — servers, storage of high-volume wearable history, OAuth token refresh, webhook handling, monitoring, and the engineering time to survive approval queues and API migrations. This is real money even when the API sticker says free.\n\nA \"free to call\" API can still be expensive to ship. Keep these three columns separate on every vendor you evaluate.\n\n## Are fitness APIs free? By category\n\nFitness APIs are not one market. They split into four buckets that price completely differently.\n\n| Category | Free to call? | The catch (as of 2026, verify) |\n| --- | --- | --- |\n| First-party wearable APIs (Fitbit, Oura, WHOOP) | Generally yes — no per-call fee | Gated by approval and/or the user's device/membership; not open self-serve |\n| First-party with extra conditions (Strava, Garmin) | Yes — no per-call fee | Strava's getting-started guide calls a Strava subscription a prerequisite for creating an app; Garmin's program is for business use only, and some metrics may need a licence fee or a minimum device order for commercial use |\n| Aggregators (Terra, Junction, Rook, Spike) | No — paid | Priced per connected user / per monthly active user (MAU), tiered, enterprise contact-sales |\n| Nutrition / exercise content APIs | Mixed | Freemium/tiered (Nutritionix, Edamam, Spoonacular, ExerciseDB) alongside genuinely free/open options (USDA, Open Food Facts, wger, free-exercise-db) |\n\n### First-party wearable APIs: free to call, but gated\n\nFitbit's Web API has historically been free to call, Oura's API FAQ says the Oura API is free to use for both personal and commercial applications, and WHOOP's API Terms of Use, effective October 6, 2026, say access is currently provided at no charge. What gates them is not a usage bill but approval and membership. Oura limits a new API application to 10 users until Oura approves it; WHOOP requires developers to hold a WHOOP membership to build at all, and a new app starts on a Sandbox tier of 10 members, moving up one tier at a time through WHOOP's review; Fitbit is mid-migration to the Google Health API during 2026, and the successor's pricing model is not clearly public yet — verify. Note the Google Health API is a different product from the paid Google Cloud Healthcare API, so don't read the latter's per-request pricing as the former's.\n\n### Strava and Garmin: free to call, with extra conditions\n\nTwo more providers charge nothing for API access but add conditions of their own, so don't blanket-state that all wearable APIs are free to use. Strava's API Agreement, effective June 1, 2026, says access to its API is currently provided at no charge, but its getting-started guide calls a Strava subscription a prerequisite for creating an app, and its API Policy makes Standard Tier apps subject to subscription requirements for the developer or specified end users. Garmin's program FAQ says there are no licensing or maintenance fees for access to the Garmin Connect Developer Program, but that it is only for business use and that access to some metrics may require a licence fee or a minimum device order for commercial use; Garmin does not publish those amounts, so get them in writing.\n\n### Aggregators: genuinely paid\n\nIf you want one integration across many devices instead of building each provider yourself, aggregators like Terra, Junction (formerly Vital), Rook, and Spike are where recurring API spend actually accrues. The model is consistent even where the numbers aren't public: you pay per connected user or per MAU, tiered by user count, often with a credit/event layer and an enterprise \"contact sales\" top tier. Specific per-user dollar rates are rarely listed publicly — verify with the vendor. This is the classic build-vs-buy trade: a real recurring fee in exchange for skipping N separate first-party integrations.\n\n### Nutrition and exercise content: mixed, with real free options\n\nContent APIs are the most varied bucket. The commercial ones are freemium or tiered — Nutritionix, Edamam, and Spoonacular for nutrition; ExerciseDB (via RapidAPI) and API Ninjas for exercises — typically a limited free tier that scales into paid plans by volume or features, with metered overages. But genuinely free and open options exist and are worth naming plainly: USDA FoodData Central (public domain, free API key), Open Food Facts (open, no key, ODbL attribution), wger (AGPL, self-host), and free-exercise-db (public domain, static dataset). These cost $0 for the data but shift integration, hosting, and license-compliance work onto you.\n\n## The catch: what to budget for even when it's free\n\nThe provider's price tag is usually the smallest number. What actually adds up:\n\n- **User membership dependency** — if your product relies on Oura or WHOOP data, your addressable market is only users already paying that provider. Free for you, but it shrinks who can connect.\n- **Approval and time-to-market** — Garmin's application review, Oura's approval for apps past 10 users, and WHOOP's reviewed member tiers cost calendar time, which is a real cost for a roadmap even at $0.\n- **Maintenance and migrations** — APIs deprecate and move. Fitbit's 2026 shift to the Google Health API forces a re-integration; Strava's 2024–2026 changes altered display rules and access economics. Budget engineering time for this every year.\n- **Your infrastructure and storage** — wearable data is continuous and high-volume; storing and re-syncing history is an ongoing bill.\n- **License obligations** — the \"free\" open datasets carry terms: public domain has none, ODbL adds attribution/share-alike, AGPL adds copyleft. These can force architecture or legal work, not just payment.\n- **Compliance** — health data carries privacy and security obligations (consent, deletion, sometimes HIPAA-adjacent scope) regardless of API price.\n\n## Free to license, expensive to integrate\n\nThe licence price and the engineering bill often run in opposite directions. When we counted this site's [API directory](/apis) on October 18, 2026, 14 of its 24 products carried a developer cost of free, and five of those were also rated high engineering effort, which is our rough judgement rather than a vendor fact: wger, MediaPipe, MoveNet, Apple Vision body pose and Garmin. That is every product in the directory rated high effort. Money buys you someone else's engineering time, and declining to spend it means spending your own.\n\nThree of the five are pose models, where the cost moves from the invoice to the device: frame handling, thermal limits, battery, and an accuracy question that only real users on real hardware can answer. Of the five, only Garmin states an approval gate, an application to a program that is for business use only, so most of the hardest integrations in the free group are ones you can start this afternoon, which is why teams underestimate them. Our [build versus buy guide for motion tracking](/motion/build-vs-buy-ai-motion-tracking) walks that trade.\n\n## Cheaper paths and how it compares\n\nWhich path is cheapest depends on your shape. Few devices, willing to do approvals, engineering to spare → direct first-party APIs (near-zero API fee, high integration and maintenance cost). Many devices, want one integration and a predictable per-MAU budget → an aggregator (real recurring fee, less maintenance). Most teams end up mixing. If you only need workout or food content rather than a specific person's wearable history, the genuinely free and open options often cover it. For the full roundup of no-cost and open choices, see the [free fitness APIs roundup](/fitness-apis/free-fitness-apis) — this page won't reproduce it. To compare the landscape and decide which provider fits, see the [fitness API hub](/fitness-apis), and for a structured breakdown of what a build actually runs, see [how much a fitness API costs](/pricing/how-much-does-a-fitness-api-cost).\n\n## The honest close\n\nSo, are fitness APIs free? Many are free to call — most first-party wearable APIs charge no per-request fee — and a few nutrition and exercise datasets are genuinely free and open. But Strava requires a Strava subscription to create an app, Garmin is for business use only and may require a licence fee for some metrics used commercially, aggregators are paid by design, and the costs that actually bite (user memberships, approval time, maintenance, your own infrastructure) sit outside the API sticker. Pricing and access rules for this category changed noticeably in 2026 and vary by country, so verify every specific against the provider's live docs — or a sales conversation — before you build a budget on it.",
    "faqs": [
      {
        "q": "Are fitness APIs free?",
        "a": "Many are free to call - most first-party wearable APIs, including Fitbit, Oura, WHOOP, Garmin and Strava, charge no per-request fee, and some nutrition and exercise datasets are genuinely free and open. But it is not universal: aggregators like Terra and Junction are paid per connected user. 'Free to call' also is not 'free to use', because your users must own the device and often pay a membership, Strava requires a Strava subscription to create an app, and Garmin's program is for business use only. As of 2026, verify current pricing per provider."
      },
      {
        "q": "Which fitness APIs are genuinely free and open?",
        "a": "For data you can use at $0, the clearest options are USDA FoodData Central (public domain nutrition data, free API key), Open Food Facts (open food database, no key, with ODbL attribution terms), wger (open-source workout and nutrition API, AGPL, self-host), and free-exercise-db (public-domain exercise dataset). These are truly free but shift integration, hosting, and license-compliance work onto you. Our roundup at /fitness-apis/free-fitness-apis covers them in detail."
      },
      {
        "q": "If the API is free to call, what actually costs money?",
        "a": "The provider's price tag is usually the smallest number. The real costs are your users owning the device or paying a membership (Oura Membership, WHOOP subscription), the calendar time to clear approval (Garmin's application review, Oura's approval past 10 users, WHOOP's member tiers), maintenance as APIs migrate (Fitbit's 2026 move to the Google Health API forces a rebuild), and your own infrastructure - servers, storage of high-volume history, token refresh, and monitoring."
      },
      {
        "q": "Which fitness APIs are not free?",
        "a": "Cross-device aggregators (Terra, Junction formerly Vital, Rook, Spike) are paid by design, typically per connected user or per monthly active user, tiered, with enterprise contact-sales; specific rates are rarely public - verify. Among first-party wearable APIs, Strava and Garmin charge nothing for API access but attach costs: Strava's getting-started guide calls a Strava subscription a prerequisite for creating an app, and Garmin's program FAQ says access to some metrics may require a licence fee or a minimum device order for commercial use. Commercial nutrition and exercise content APIs (Nutritionix, Edamam, Spoonacular, ExerciseDB) are freemium or tiered."
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
  },
  {
    "slug": "sahha-api-pricing",
    "primaryQuery": "sahha pricing",
    "h1": "Sahha API pricing: plans, per-user costs and what each tier includes",
    "metaTitle": "Sahha API Pricing (2026): Plans, Per-User Costs, BAA",
    "metaDescription": "Sahha's published plans as of October 2026: a free 30-day sandbox, Starter at $299 a month with 1,000 users, Pro at $1,499 with 10,000, and the BAA tier.",
    "updated": "2026-10-17",
    "answer": "As of October 17, 2026, Sahha's pricing page lists four plans: Free at $0 for 30 days with 25 development users in sandbox only, Starter at $299 a month billed annually with 1,000 users included and $0.40 per extra user, Pro at $1,499 a month billed annually with 10,000 users included and $0.20 per extra user, and custom Enterprise. Every plan unlocks every product (biomarkers, scores, archetypes, tags and insights), and the BAA for HIPAA starts at Pro. By our arithmetic, Pro is cheaper than Starter above 4,000 users; annual billing is the discounted option, as the page's billing toggle marks Annual at 25% off.",
    "body": "## What it costs\n\nSahha publishes its full price sheet. As we read it on October 17, 2026:\n\n| Plan | List price | Users included | Each extra user | Data retention | Webhook deliveries a day |\n|---|---|---|---|---|---|\n| Free | $0 for 30 days, sandbox only | 25 development users | n/a | 30 days | 10K |\n| Starter | $299 a month, billed annually | 1,000 | $0.40 | 30 days | 100K |\n| Pro | $1,499 a month, billed annually | 10,000 | $0.20 | 120 days | 1M |\n| Enterprise | Custom | Custom | Volume pricing | Custom | Custom |\n\nThe prices shown are for annual billing; the page's billing toggle reads \"Monthly Annual −25%\", so monthly billing costs more. Pro also adds custom tags, up to 5 projects or workspaces and an elevated API rate limit; Enterprise adds unlimited projects, SLAs, custom contracting and a dedicated CS engineer.\n\n## What every plan includes\n\nThe pricing page's headline is \"All products included from day one\", and the list under \"Included on every plan\" is the same on Free as on Enterprise: 100+ biomarkers, 5 scores, 100+ archetypes, 75+ tags and 100+ insights, plus platform integrations, mobile SDKs, the REST API and webhooks, 30 days of historical data on day one, and multi-device deduplication. Its homepage says the 165 integrations cover \"800+ devices\", including Apple Health, Health Connect, Garmin, Fitbit, Oura, WHOOP and Samsung Health.\n\n## Our arithmetic at different user counts\n\nThese are our calculations from the list prices above, at annual billing, not a quote from Sahha:\n\n| Users | Starter | Pro |\n|---|---|---|\n| 1,000 | $299 | $1,499 |\n| 4,000 | $1,499 ($299 plus 3,000 extra users at $0.40) | $1,499 |\n| 10,000 | $3,899 | $1,499 |\n| 20,000 | $7,899 | $3,499 ($1,499 plus 10,000 extra users at $0.20) |\n\nOn price alone the two plans cross at 4,000 users: below that Starter is cheaper, above it Pro is, before counting Pro's BAA and longer retention. Three caveats. We assume the per-user rates are monthly like the base fee; the page says \"then $0.40/user\" without naming a period. Sahha's pricing page lists an FAQ titled \"What counts as a user?\" whose answer did not appear in the page text we fetched, so confirm both points before you model growth. And Enterprise, where volume pricing applies, is a quote.\n\n## What the price buys, and what it does not\n\n**Phone-first data.** Sahha's pitch is that it \"turns the smartphone itself into a passive sensor for sleep, activity, and behavior\", so users without a wearable still produce data. Its integrations page says sources \"arrive on-device through Apple Health or Health Connect\", with \"no per-brand work required\", so for those sources the data path runs through your app with Sahha's SDK on the user's phone.\n\n**Cloud integrations are still beta.** For select providers Sahha \"also connects directly through their cloud API\", but its docs say these integrations \"are in public beta and are Sandbox only\". Each uses an app you register with the provider (\"Create an app with the provider\"), Garmin's needs Garmin's approval, and Oura and WHOOP are self sign-up. If server-side Garmin data is the core of your product, that is the line to test first.\n\n**Retention is short on Starter.** Data retention is 30 days on Free and Starter and 120 days on Pro, so plan to keep your own history if you need longer baselines.\n\n**Delivery limits.** Webhook deliveries are capped per day by plan: 10K on Free, 100K on Starter, 1M on Pro. Sahha's docs describe the webhook interval you set in the dashboard as \"a deduplication window\": when the same score or biomarker updates several times inside it, \"only the final value is sent when the interval ends\", so a longer interval means fewer deliveries against the cap.\n\n## Compliance\n\nSahha's homepage says it is \"SOC 2 Type II audited, HIPAA and GDPR compliant\", with \"No names, emails, phones, or other identifiers\" required: you pass your own external ID. Its pricing FAQ adds: \"The DPA is included on every plan. A BAA is included from Pro.\" If you are a HIPAA covered entity or business associate, that makes Pro the realistic floor; our [HIPAA compliance guide for fitness apps](/compliance/hipaa-compliance-fitness-app) explains when that applies. This is general information, not legal advice.\n\n## How it compares\n\nAt $299 a month billed annually, Sahha's Starter sits next to Junction's flat $300-a-month Launch plan at the bottom of the paid entry prices we track, and the per-user model is easy to forecast. Terra bills credits per connected data source instead, and in our [aggregator pricing arithmetic](/pricing/health-data-aggregator-pricing) Sahha comes out cheaper at both user counts we modeled. It is a different product, though: Sahha's data is phone-first and arrives as ready-made scores, while its direct cloud integrations are still in beta. See [Terra vs Sahha](/compare/terra-vs-sahha) for that trade.",
    "faqs": [
      {
        "q": "How much does Sahha cost per user?",
        "a": "As of October 17, 2026, Sahha's Starter plan includes 1,000 users for $299 a month billed annually and charges $0.40 per additional user; Pro includes 10,000 users for $1,499 a month billed annually and charges $0.20 per additional user; Enterprise uses volume pricing. By our arithmetic, the two plans cost the same at 4,000 users and Pro is cheaper above that. Confirm Sahha's definition of a user, and that the per-user rate is monthly, before modeling: the pricing page text we read states neither."
      },
      {
        "q": "Does Sahha have a free plan?",
        "a": "Yes, for building, not production. As of October 17, 2026, the Free plan is $0 for 30 days with 25 development users, every product unlocked, the sandbox environment and the Slack community. Production starts on Starter at $299 a month billed annually."
      },
      {
        "q": "Which Sahha plan includes a HIPAA BAA?",
        "a": "Pro and Enterprise. Sahha's pricing FAQ says the DPA is included on every plan and a BAA is included from Pro, and the plan table lists HIPAA (BAA) under Pro. Starter does not include one, as of October 17, 2026. Whether you need a BAA depends on your role under HIPAA."
      },
      {
        "q": "Does Sahha need my own Garmin, Oura or WHOOP developer app?",
        "a": "For its direct cloud integrations, yes. As of October 17, 2026, Sahha's docs say you create an app with the provider and add its OAuth credentials in the Sahha dashboard; Garmin requires Garmin's approval, while Oura and WHOOP are self sign-up. These cloud integrations are in public beta and sandbox only; outside them, Sahha's sources arrive on-device through Apple Health or Health Connect."
      },
      {
        "q": "How long does Sahha keep user data on each plan?",
        "a": "Per its pricing page on October 17, 2026: 30 days on Free and Starter, 120 days on Pro, and custom retention on Enterprise. Sahha also backfills up to 30 days of history when a user connects. If your product needs longer baselines than your plan keeps, store the data you receive yourself."
      }
    ],
    "related": [
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Health-data aggregator pricing compared"
      },
      {
        "href": "/compare/terra-vs-sahha",
        "label": "Terra vs Sahha"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Sahha's plans, like every aggregator's, change. Subscribe and we'll tell you when a price, an included-user count or the BAA tier moves."
    },
    "sources": [
      {
        "url": "https://sahha.ai/pricing/",
        "checked": "2026-10-17",
        "note": "Sahha plans"
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
        "url": "https://docs.sahha.ai/docs/connect/integrations",
        "checked": "2026-10-17",
        "note": "Sahha cloud integrations beta"
      },
      {
        "url": "https://docs.sahha.ai/docs/connect/webhooks",
        "checked": "2026-10-17",
        "note": "Sahha webhooks"
      },
      {
        "url": "https://www.junction.com/pricing",
        "checked": "2026-10-17",
        "note": "Junction Launch and Enterprise plans"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-17",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      }
    ]
  },
  {
    "slug": "thryve-api-pricing",
    "primaryQuery": "thryve pricing",
    "h1": "Thryve API pricing: Start Up, Scale Up and what each plan includes",
    "metaTitle": "Thryve API Pricing (2026): Plans, Euro Prices, BAA",
    "metaDescription": "Thryve's plans as of October 2026: a 14-day trial, Start Up from 499 euros a month with 500 users, Scale Up from 1,000 euros, and a BAA on every plan.",
    "updated": "2026-10-17",
    "answer": "As of October 17, 2026, Thryve's pricing page lists a 14-day free trial with 25 end users, Start Up from 499 euros a month with 500 users and 0.50 euros per additional user, Scale Up from 1,000 euros a month for startups under ten years old with up to 5,000 users, and bespoke Enterprise. Data storage is 2 weeks on Start Up and 1 month on Scale Up, and Thryve says BAAs are included on all plans. By our arithmetic, an eligible startup pays less on Scale Up than on Start Up from roughly 1,500 end users.",
    "body": "## What it costs\n\nThryve publishes a free trial and three plans. As we read its pricing page on October 17, 2026:\n\n| Plan | List price | End users included | Extra users | Apps | Data storage | Historical fetch |\n|---|---|---|---|---|---|---|\n| Free trial | Free for 14 days | 25 | n/a | 1 | 1 day | Not stated |\n| Start Up | Starts at 499 euros a month | 500 | 0.50 euros each | 1 | 2 weeks | Not stated |\n| Scale Up | Starts at 1,000 euros a month, for startups under ten years old | Up to 5,000 | 999 euros per 10,000 | 1 | 1 month | Up to 14 days |\n| Enterprise | Bespoke | Flexible | Tailored on request | Multiple | Flexible | Flexible |\n\nThe plan table gives no historical-fetch figure for the trial or Start Up, and lists one Thryve dashboard account on each of those, two on Scale Up and multiple on Enterprise. Prices are in euros, and both paid figures are \"Starts at\" floors; the page does not say whether VAT is included.\n\nScale Up is a \"Special plan for startups with growth-stage needs (less than 10 years of founding)\" that \"Includes custom authentication, extended data storage, concierge support, and more.\" Enterprise is \"For organizations needing high-volume access, multiple app connections, advanced analytics, and dedicated support.\"\n\nOne inconsistency to confirm before you budget: the Start Up card's description says \"Additional users billed at €0.50 each\", while its feature list reads \"0,50ct per additional user\". We use the description's 0.50 euros, as does our arithmetic below.\n\n## How you buy it\n\nStart Up is self-serve. Thryve's docs say: \"Visit Thryve Health Pricing to choose a suitable plan. You'll be directed to Stripe checkout for payment.\" Scale Up and Enterprise go through a \"Contact Us\" button, and the pricing FAQ says that \"To change your plan at any time, please contact our sales team\".\n\nAfter payment you get a welcome email, set up the account with two-factor authentication, and Thryve automatically creates two app environments, one for staging and one for live. One operational detail to plan for: \"All credentials are displayed only once and expire 24 hours after email delivery.\"\n\n## Our arithmetic: Start Up against Scale Up\n\nThese are our calculations from the list prices above, not a Thryve quote. They assume the per-user charge is monthly like the base fee, which the page does not state.\n\n| End users | Start Up | Scale Up, if you qualify |\n|---|---|---|\n| 500 | 499 euros | 1,000 euros |\n| 1,000 | 749 euros | 1,000 euros |\n| 2,000 | 1,249 euros | 1,000 euros |\n| 5,000 | 2,749 euros | 1,000 euros |\n\nOn these floors, an eligible startup pays less on Scale Up from roughly 1,500 end users. Past 5,000 the page says to \"Scale your user base with additional €999 per 10,000 users\"; we read that as 999 euros for each further block of 10,000, so 15,000 users would come to about 1,999 euros a month. Confirm the reading in writing.\n\n## What the plan does not cover\n\n**Your own OAuth clients for some sources.** Thryve's data-sources table has a \"Shared oAuth-client\" column, and its docs say that \"When no shared oAuth-client is available, you must bring your own oAuth-client\". The table marks WHOOP, Dexcom, Google Health and FreeStyle Libre (LibreView) \"no\"; Garmin and Oura are shared. The plan cards list \"Own data source tenant / Custom Auth credentials\" on Scale Up and Enterprise but not on Start Up, so if you need WHOOP or Dexcom, ask whether Start Up can carry your own client before you choose it.\n\n**Fitbit.** The same table marks Fitbit \"Deprecating on Oct 29 2026\" and lists Google Health as a separate source with no shared OAuth client. If Fitbit users matter to you, ask Thryve how those connections carry over and whose credentials they will need; our [Fitbit API shutdown center](/fitbit-api-shutdown) has Google's own timeline.\n\n**History you keep yourself.** Data storage is two weeks on Start Up and a month on Scale Up, so store what you need for longer baselines. The table also shows no historic data for Polar.\n\n**Phone-side sources.** Apple Health, Samsung Health and Health Connect are \"Native\" sources read through Thryve's SDK, so they need your mobile app.\n\n## Compliance and hosting\n\nThryve's certifications page says \"BAA agreements included on all plans — no enterprise upgrade required\" and that \"Business Associate Agreements and Data Processing Agreements are standard on every plan\". Its pricing FAQ says \"All data processed and stored by Thryve is hosted in Germany\", and its homepage claims compliance with \"GDPR, HIPAA, ISO 9001, 27001 and other international regulations\". Whether you need a BAA depends on your role under HIPAA; our [HIPAA compliance guide for fitness apps](/compliance/hipaa-compliance-fitness-app) explains when that applies. This is general information, not legal advice.\n\n## How it compares\n\nThe BAA is where Thryve's price sheet differs most: it is on every plan, where Sahha's starts at Pro and Terra's and Junction's sit in Enterprise. Against Terra's credits per connected data source, Thryve charges per end user, and its short storage windows leave long-term history to you. See [Terra vs Thryve](/compare/terra-vs-thryve) for the head-to-head and [health-data aggregator pricing](/pricing/health-data-aggregator-pricing) for every vendor's price sheet side by side.",
    "faqs": [
      {
        "q": "How much does Thryve cost?",
        "a": "As of October 17, 2026, Thryve's Start Up plan starts at 499 euros a month for 500 users, with additional users billed at 0.50 euros each; Scale Up starts at 1,000 euros a month for up to 5,000 users and is limited to startups less than ten years old; Enterprise is bespoke. A 14-day free trial covers 25 end users. Both paid prices are 'starts at' figures in euros."
      },
      {
        "q": "Does Thryve include a BAA on every plan?",
        "a": "Thryve says so. As of October 17, 2026, its certifications page states that BAA agreements are included on all plans with no enterprise upgrade required, and that Business Associate Agreements and Data Processing Agreements are standard on every plan. Whether you need a BAA depends on your role under HIPAA."
      },
      {
        "q": "Who qualifies for Thryve's Scale Up plan?",
        "a": "Startups. Thryve's pricing page describes Scale Up as a special plan for startups with growth-stage needs, less than ten years after founding. As of October 17, 2026, it starts at 1,000 euros a month for up to 5,000 users and adds custom authentication credentials, 14 days of historical fetching and one month of data storage. You request it through Thryve's sales contact rather than self-serve checkout."
      },
      {
        "q": "How long does Thryve store data on each plan?",
        "a": "Per Thryve's plan table on October 17, 2026: 1 day on the free trial, 2 weeks on Start Up, 1 month on Scale Up and flexible on Enterprise. Keep your own copy of anything you need for longer trends."
      },
      {
        "q": "Do I need my own WHOOP or Dexcom credentials with Thryve?",
        "a": "Yes, per Thryve's docs on October 17, 2026. Its data-sources table shows no shared OAuth client for WHOOP, Dexcom, Google Health or FreeStyle Libre, and the docs say that where no shared client exists you must bring your own. Garmin and Oura use Thryve's shared client. The plan cards list custom auth credentials on Scale Up and Enterprise, so confirm Start Up support first."
      }
    ],
    "related": [
      {
        "href": "/pricing/health-data-aggregator-pricing",
        "label": "Health-data aggregator pricing compared"
      },
      {
        "href": "/compare/terra-vs-thryve",
        "label": "Terra vs Thryve"
      },
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/pricing/sahha-api-pricing",
        "label": "Sahha API pricing"
      }
    ],
    "cta": {
      "pitch": "Thryve's plans, like every aggregator's, change. Subscribe and we'll tell you when a price, a storage window or a source's status moves."
    },
    "sources": [
      {
        "url": "https://www.thryve.health/pricing",
        "checked": "2026-10-17",
        "note": "Thryve plans, storage and hosting"
      },
      {
        "url": "https://docs.thryve.health/getting-started/get-your-api-keys",
        "checked": "2026-10-17",
        "note": "Thryve sign-up"
      },
      {
        "url": "https://docs.thryve.health/thryve-data-sources/overview",
        "checked": "2026-10-17",
        "note": "Thryve data sources and OAuth clients"
      },
      {
        "url": "https://www.thryve.health/certifications-compliance",
        "checked": "2026-10-17",
        "note": "Thryve certifications and BAA"
      },
      {
        "url": "https://www.thryve.health/",
        "checked": "2026-10-17",
        "note": "Thryve coverage and hosting"
      },
      {
        "url": "https://sahha.ai/",
        "checked": "2026-10-17",
        "note": "Sahha coverage, pricing FAQ and compliance"
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
      }
    ]
  },
  {
    "slug": "mindbody-api-pricing",
    "primaryQuery": "mindbody api pricing",
    "h1": "Mindbody API Pricing: What Each Call Costs",
    "metaTitle": "Mindbody API Pricing: 1,000 Calls a Day, Then Per Call",
    "metaDescription": "Mindbody's developer FAQ prices API calls past 1,000 a day at a third of a cent each. What its API terms add on billing, call limits and fee changes.",
    "updated": "2026-10-17",
    "answer": "As of October 17, 2026, Mindbody's developer FAQ says there is a 1,000-call daily limit on the API and that each call beyond it is charged at one third of a cent, that you are charged only for use with live clients, and that sandbox testing is free but restricted to 1,000 calls a day. Mindbody's API Terms of Use add that fees are billed monthly starting 30 days after you first receive access to a business's data, that Mindbody sets each developer's call limits and may charge for excess calls, and that fee changes take effect 30 days after posting. The FAQ still describes the API as SOAP and XML web services, so treat the per-call price as Mindbody's published statement and confirm the current schedule before you budget.",
    "body": "## What Mindbody publishes\n\nMindbody is the one gym and studio platform we checked that prints a per-call API price. It sits in the developer FAQ rather than on a pricing page: the address `/Resources/Pricing` on Mindbody's developer portal returned an error page on October 17, 2026. Here is everything about API fees that we could read on Mindbody's own pages that day.\n\n| Item | What Mindbody says | Where it says it |\n|---|---|---|\n| Daily allowance | A limit of 1,000 calls per day when using the API | Developer FAQ |\n| Calls beyond it | One third of a cent for every call | Developer FAQ |\n| When you are charged | Only for use with live clients | Developer FAQ |\n| Sandbox | Free, but restricted to 1,000 calls a day | Developer FAQ |\n| Billing cycle | Monthly, starting 30 days after you first receive access to Subscriber data; usage fees invoiced monthly for the previous calendar month | API Terms of Use, section 10 |\n| Your call limits | Set by Mindbody based on how your applications may be used and their anticipated volume | API Terms of Use, section 6 |\n| Going over | Mindbody may charge for excess calls or terminate access | API Terms of Use, section 6 |\n| Unused calls | Never roll over to the next day or month | API Terms of Use, section 6 |\n| Fee changes | Take effect 30 days after Mindbody posts them | API Terms of Use, section 10 |\n| Taxes | You pay any taxes on the fees | API Terms of Use, section 10 |\n\nThe FAQ does not say whether the 1,000-call allowance counts per developer account or per business, and we found no page that does. Ask Mindbody before you model a multi-studio integration.\n\n## What the numbers mean in practice\n\nAt the FAQ's rate, every 1,000 calls above the daily allowance costs about $3.33 (1,000 times one third of a cent). That is arithmetic on Mindbody's published figure, not a quote.\n\nIn our experience the bill is set by sync design more than by user count, because every poll is a call. Two things from Mindbody's own documentation pull in opposite directions:\n\n- **Webhooks cut polling.** Mindbody pitches its Webhooks API as a way to show near real-time updates to a business's data \"without having to long-poll the Public API\". Every event you receive is a poll you did not make.\n- **Daily re-syncs add calls.** The same documentation tells you to re-sync cached data through the Public API every 24 hours, and an event carries only some fields, so follow-up reads cost calls too.\n\nOur recommendation: subscribe to webhooks for anything that changes during the day, keep the daily re-sync to what you actually display, and meter your own call count per business from the first week.\n\n## Why to confirm the price before you budget\n\nThree things make the FAQ figure a starting point rather than a contract:\n\n- **The FAQ looks dated.** It describes the API as built on \"XML web services, SOAP, WSDL\", while Mindbody's documentation says developer accounts created on or after February 19, 2020 can only use V6.0 of the Public API. A page that old may not reflect today's fee schedule.\n- **The terms point elsewhere.** Section 10 of the API Terms of Use says fees are \"more fully described at https://developers.mindbodyonline.com\". That address is a JavaScript application that returned no readable text to our fetch.\n- **Fees can change on notice.** The same section says changes take effect 30 days after they are posted.\n\nSo treat one third of a cent per call as Mindbody's published statement as of October 17, 2026, and confirm the current schedule in your developer account, or with Mindbody, before you put it in a budget.\n\n## Costs that sit with the studio\n\nThe API fee is the developer's bill. A business that uses your integration is a Mindbody subscriber in its own right: Mindbody's webhook reference describes a site as created when \"a new business subscribes to Mindbody's services\", and each business activates your access to its data. If your product takes card payments through the API, Mindbody's FAQ says the studio needs an active Mindbody merchant account with a supported processor. We have not reviewed Mindbody's business software pricing, so this page makes no claim about it.\n\nFor the integration itself (access, keys, webhooks and limits), see the [Mindbody API integration guide](/integrate/mindbody-api). To compare Mindbody with other studio platforms, including those that charge nothing extra for API access, see [gym and studio management software APIs](/fitness-apis/gym-management-software-apis). For the wider picture, [how much a fitness API costs](/pricing/how-much-does-a-fitness-api-cost) breaks down where the money goes across the categories this site covers.",
    "faqs": [
      {
        "q": "Is the Mindbody API free to use?",
        "a": "Partly. As of October 17, 2026, Mindbody's developer FAQ says there is a 1,000-call daily limit and that each call after it costs one third of a cent, charged only for use with live clients. Testing in the sandbox is free but restricted to 1,000 calls a day. The FAQ looks dated, so confirm the current fee schedule with Mindbody before you rely on it."
      },
      {
        "q": "When does Mindbody start billing API fees?",
        "a": "Mindbody's API Terms of Use say fees are calculated and billed monthly, starting 30 days from the date you first receive access to Subscriber data, and that usage fees are invoiced monthly for the previous calendar month's activity. You also pay any taxes on those fees."
      },
      {
        "q": "Can Mindbody change its API fees or call limits?",
        "a": "Yes. The API Terms of Use say fee changes take effect 30 days after Mindbody posts them, and that Mindbody determines each developer's call limits based on how the applications may be used and their anticipated volume. If you exceed your limits, Mindbody may charge for the excess calls or terminate your access."
      },
      {
        "q": "Do unused Mindbody API calls roll over?",
        "a": "No. Mindbody's API Terms of Use say unused API calls never roll over to the next day or month. A quiet day does not buy you headroom for a busy one, so size webhook subscriptions and daily re-syncs to stay under the allowance every day."
      }
    ],
    "related": [
      {
        "href": "/integrate/mindbody-api",
        "label": "Integrate the Mindbody API"
      },
      {
        "href": "/fitness-apis/gym-management-software-apis",
        "label": "Gym and studio management software APIs"
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
      "pitch": "Mindbody can change its API fees 30 days after posting them. Subscribe and we will tell you when its published pricing, limits or terms change."
    },
    "sources": [
      {
        "url": "https://developers.mindbodyonline.com/resources/faqs",
        "checked": "2026-10-17",
        "note": "The 1,000-call daily limit, one third of a cent per call beyond it, charges only with live clients, free sandbox restricted to 1,000 calls a day, and the SOAP/XML description."
      },
      {
        "url": "https://developers.mindbodyonline.com/Resources/DeveloperAgreement",
        "checked": "2026-10-17",
        "note": "API Terms of Use sections 6 and 10: call limits, excess-call charges, no rollover, monthly billing from 30 days after access to Subscriber data, 30-day notice of fee changes, taxes."
      },
      {
        "url": "https://developers.mindbodyonline.com/Resources/Pricing",
        "checked": "2026-10-17",
        "note": "Returned Mindbody's error page; there is no separate API pricing page at this address."
      },
      {
        "url": "https://developers.mindbodyonline.com/WebhooksDocumentation",
        "checked": "2026-10-17",
        "note": "Webhooks as an alternative to long-polling, the 24-hour re-sync advice, and the site.created event for businesses subscribing to Mindbody."
      },
      {
        "url": "https://developers.mindbodyonline.com/PublicDocumentation/GettingStarted",
        "checked": "2026-10-17",
        "note": "Accounts created on or after February 19, 2020 can only access V6.0 of the Public API."
      }
    ]
  },
  {
    "slug": "quickpose-pricing",
    "primaryQuery": "quickpose pricing",
    "h1": "QuickPose Pricing: SDK Plans by Monthly Active Device",
    "metaTitle": "QuickPose Pricing (2026): SDK Plans by Active Device",
    "metaDescription": "QuickPose's published SDK prices: free for 10 monthly active devices, then $25 to $1,000 a month up to 100,000 devices. What counts and what costs extra.",
    "updated": "2026-10-18",
    "answer": "QuickPose publishes its SDK pricing by monthly active device: the free Personal tier covers 10 devices with no card required, and paid plans run from Builder at $25 a month for up to 100 devices to Agency at $1,000 a month for up to 100,000, with custom pricing above that. Its pricing page says every SDK feature is on every plan, so the tiers differ only in device limits and support. Billing is monthly through Stripe for the previous month's usage, and integration support and code audits cost extra. Prices are as QuickPose's SDK pricing page showed them on October 17, 2026.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that competes with QuickPose.** So every figure below is copied from QuickPose's own pages as they stood on October 17, 2026, the comparison section holds KinesteX to the same \"what is actually published\" test as everyone else, and nothing here ranks KinesteX first. Where QuickPose is the cheaper or simpler choice, the page says so.\n\n## What QuickPose charges for\n\nQuickPose prices its pose-estimation SDK by **monthly active device**. Its pricing page defines one as \"any unique device that uses QuickPose features at least once in a calendar month\", counted once per month however many sessions it runs, and devices that do not use QuickPose that month are not counted. There is no per-user, per-session or per-frame fee on top. That unit matters more than the headline number: a device-based bill tracks how many phones open your camera feature, not how many accounts you have.\n\n## The SDK plans\n\nAs published on QuickPose's [SDK pricing page](https://quickpose.ai/sdk-pricing/) on October 17, 2026:\n\n| Plan | Price | Monthly active devices | Support listed |\n| --- | --- | --- | --- |\n| Personal | Free, no card required | Up to 10 | Community and developer docs, 72 hr response |\n| Builder | $25 a month | Up to 100 | Email support, 72 hr response |\n| Starter | $50 a month | Up to 1,000 | Email and ticket, 48 hr response |\n| Launch | $100 a month | Up to 2,000 | Email and ticket, 48 hr response |\n| Scale | $200 a month | Up to 5,000 | Chat, email and ticket, 48 hr response |\n| Growth | $400 a month | Up to 10,000 | Chat, email and ticket, 24 hr response |\n| Agency | $1,000 a month | Up to 100,000 | Phone, chat, email and ticket, 24 hr response |\n| Custom | Quoted | Over 100,000 | Custom SLA and contract, dedicated account manager, NDA available |\n\nThe page states that all SDK capabilities, \"including rep counting, yoga pose detection, range of motion, joint angle tracking, and sports biomechanics\", are on every plan including the free Personal tier, and that \"the plans differ only in device limits and support level\". Its plan comparison table also marks on-device processing on every plan it lists. In other words, you are not buying features by tier; you are buying headroom and response times.\n\n## Billing and what happens at the limit\n\n- **Billing** runs monthly through Stripe. QuickPose says you are charged on the 1st of each month for the previous month's usage, with \"no setup fees or long-term contracts on standard plans\".\n- **Going over** does not switch the SDK off. The page says QuickPose \"will continue working in your app\" and that you receive an invoice at the end of the month with your final device numbers.\n- **Changing or cancelling** is allowed at any time from the account dashboard; cancellations take effect at the end of the current billing period.\n- **Charging your own users** is allowed. QuickPose's answer to that question is that you are free to monetise your app however you choose.\n\n## What costs extra\n\nThe plans cover the SDK. Services are priced separately on the same page:\n\n| Service | Price as published |\n| --- | --- |\n| Integration Support (QuickPose's engineers integrate the SDK into your iOS or Android app) | On request, minimum 4 hours |\n| Code Audit of an existing integration | $150 an hour, minimum 2 hours |\n| Custom Exercise Development (a movement not in the standard library) | On request, scoped individually |\n\nAbove that sits an enterprise track with its own commercial models. QuickPose's enterprise page describes a fixed-fee proof of concept \"typically 4–8 weeks\", project-based development, monthly support retainers, NDAs on request, and containerised deployment inside your own Azure tenancy or private cloud. No prices are published for that track.\n\n## Getting a key, and what free really means\n\nThe SDK key is free to register: the iOS SDK README says \"Get your free SDK key on https://dev.quickpose.ai, usage limits may apply\", and that keys are linked to your app's bundle ID. The Android README says the same for the Play Store. In our reading, a 10-device free tier is a development and pilot allowance rather than a launch plan: a soft launch on a few hundred phones lands you on Starter. For a funded team that is small money next to the engineering QuickPose saves, and the device unit keeps the bill predictable.\n\n## Two QuickPose pages that disagree\n\nThe address quickpose.ai/pricing/ redirects to the pricing page of **JointTrack**, a separate QuickPose image-annotation API with its own per-image plans. That page still carries an older SDK FAQ which says you \"move to the Launch tier if your app has more than 100 monthly active devices\", and that education, non-profit, charity and volume pricing is available. The SDK pricing page's own table puts the free tier at 10 devices and Launch at up to 2,000 devices for $100 a month. We go by the SDK pricing page, which is the one QuickPose's navigation labels SDK Pricing, and suggest you ask QuickPose about the discount line before relying on it.\n\n## Licence and terms\n\nQuickPose's terms say the \"QuickPose AI SDK and JointTrack API are licensed to the User under the Apache 2.0 license, subject to the terms of this agreement\", and in the same section that their use \"may be subject to fees\". The iOS SDK repository carries an Apache-2.0 LICENSE file; the Android SDK repository has none, and the React Native plugin is published on npm as MIT. The terms name Sliced Backhand Ltd as QuickPose's owner and the laws of the United Kingdom as governing. Our reading: permissively licensed code in front of a keyed service that is metered by device, which is how the free key can coexist with paid plans.\n\n## How it compares with other motion SDKs\n\nOf the commercial motion SDKs we cover, only QuickPose and Sency publish prices. As each vendor's own pages stood when we read them:\n\n- **Sency** bills per monthly active user. Its pricing packages page, read on October 18, 2026, lists a free Starter plan for up to 100 monthly active users and a Growth plan from $499 a month for up to 3,800, at $0.79 per active user; its main pricing page describes a free trial and then a paid monthly fee for the first 100 instead. QuickPose's first paid plan, $25 a month, sits far below Sency's Growth plan, while Sency's free plan, if it applies, covers more users than QuickPose's. See [Sency pricing](/pricing/sency-pricing) and [QuickPose vs Sency](/compare/quickpose-vs-sency).\n- **Kemtai** publishes no prices on the pages we fetched; its site routes buyers to a demo request.\n- **KinesteX**, which funds this site, publishes no prices either. Its FAQ describes usage-based plans priced per active user per month that fall as you reach new tiers, says integration fees may apply, and access starts with a contact form. We hold it to the same standard: no number, so no number here.\n- **Free pose models** cost nothing to license: MediaPipe and MoveNet are Apache-2.0 and Apple's Vision body pose ships with the OS. What you pay instead is the engineering QuickPose packages, which [build vs buy for AI motion tracking](/motion/build-vs-buy-ai-motion-tracking) puts a shape on.\n\nIf QuickPose's per-device unit or its iOS and Android scope does not fit, the realistic options are mapped in [QuickPose alternatives](/alternatives/quickpose-alternatives).\n\n## Before you budget\n\nModel your bill on monthly active devices, not users or sessions, and check two things with QuickPose in writing: the current plan table, since the two pages above already disagree once, and whether your expected peak month crosses a tier boundary. Every price here is as published on October 17, 2026; vendors change price lists without notice, so re-open the [SDK pricing page](https://quickpose.ai/sdk-pricing/) before you commit. For what the SDK itself does, see [KinesteX vs QuickPose](/compare/kinestex-vs-quickpose), which also carries this site's disclosure.",
    "faqs": [
      {
        "q": "Is QuickPose free to use?",
        "a": "For development and very small apps, yes. QuickPose's SDK pricing page lists a free Personal tier for up to 10 monthly active devices with no card required, and says every SDK feature is available on it. Beyond 10 devices the paid plans start with Builder at $25 a month for up to 100 devices. The SDK key itself is free to register at dev.quickpose.ai, and the README notes that usage limits may apply."
      },
      {
        "q": "What counts as a monthly active device for QuickPose billing?",
        "a": "Any unique device that uses QuickPose features at least once in a calendar month. QuickPose counts a device once per month regardless of how many sessions or interactions it has, and a device that does not use QuickPose that month is not counted. Plan your tier on how many phones open the camera feature in your busiest month, not on total accounts."
      },
      {
        "q": "What happens if an app goes over its QuickPose device limit?",
        "a": "The SDK keeps working. QuickPose's pricing FAQ says it will continue working in your app, usage is calculated monthly, and you receive an invoice at the end of the month with your final device numbers. Billing runs through Stripe on the 1st of each month for the previous month, with no setup fees or long-term contracts on standard plans."
      },
      {
        "q": "Do QuickPose's higher plans unlock more features?",
        "a": "No, according to QuickPose. Its pricing page says rep counting, yoga pose detection, range of motion, joint angle tracking and sports biomechanics are available on every plan including the free tier, and that the plans differ only in device limits and support level. Higher plans buy device headroom and faster response times; integration help, code audits and custom exercises are priced as separate services."
      },
      {
        "q": "Can I charge my own users for features built on QuickPose?",
        "a": "Yes. QuickPose's pricing FAQ says you are free to monetise your app however you choose, whether through subscriptions, one-time purchases or freemium. Your QuickPose bill still depends only on monthly active devices, so a paid feature used by many devices moves you up the tiers like a free one would."
      }
    ],
    "related": [
      {
        "href": "/compare/quickpose-vs-sency",
        "label": "QuickPose vs Sency"
      },
      {
        "href": "/alternatives/quickpose-alternatives",
        "label": "QuickPose alternatives"
      },
      {
        "href": "/pricing/sency-pricing",
        "label": "Sency pricing"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Motion SDK price lists change without notice and two of QuickPose's own pages already disagree. Subscribe and we will flag it when a published tier, unit or limit moves."
    },
    "sources": [
      {
        "url": "https://quickpose.ai/sdk-pricing/",
        "checked": "2026-10-17",
        "note": "plans, device limits, prices, support levels, billing, overage, cancellation and services (snapshot)"
      },
      {
        "url": "https://quickpose.ai/products/jointtrack/pricing/",
        "checked": "2026-10-17",
        "note": "the redirect target of quickpose.ai/pricing/ and its older SDK FAQ (snapshot)"
      },
      {
        "url": "https://quickpose.ai/services/enterprise/",
        "checked": "2026-10-17",
        "note": "enterprise proof of concept, engagement models and deployment (snapshot)"
      },
      {
        "url": "https://quickpose.ai/terms-and-conditions/",
        "checked": "2026-10-17",
        "note": "Apache 2.0 licence clause, fees, owner and governing law (snapshot)"
      },
      {
        "url": "https://github.com/quickpose/quickpose-ios-sdk",
        "checked": "2026-10-17",
        "note": "free SDK key line, bundle ID binding and the Apache-2.0 LICENSE"
      },
      {
        "url": "https://github.com/quickpose/quickpose-android-sdk",
        "checked": "2026-10-17",
        "note": "SDK key line for the Play Store; no LICENSE file"
      },
      {
        "url": "https://www.npmjs.com/package/@quickpose/react-native",
        "checked": "2026-10-17",
        "note": "MIT licence on the npm package"
      },
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-10-18",
        "note": "Sency's Starter and Growth plans (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/pricing",
        "checked": "2026-10-17",
        "note": "Sency's trial and paid monthly fee for the first 100 active users (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-10-17",
        "note": "KinesteX pricing model answers (snapshot)"
      }
    ],
    "firstParty": true
  },
  {
    "slug": "sency-pricing",
    "primaryQuery": "sency pricing",
    "h1": "Sency Pricing: SencyMotion Plans by Monthly Active User",
    "metaTitle": "Sency Pricing (2026): SencyMotion Plans per Active User",
    "metaDescription": "Sency's SDK plans as published: Starter free for up to 100 monthly active users, Growth from $499 a month for up to 3,800, and where its two pages differ.",
    "updated": "2026-10-18",
    "answer": "Sency prices its SencyMotion SDK by monthly active user, counted once a month with unlimited activities. Its pricing packages page lists a free Starter plan for up to 100 monthly active users, a Growth plan from $499 a month for up to 3,800 at $0.79 per active user with the branded UI included, and a Customized plan priced on request. Its main pricing page describes the start differently, as a free trial followed by a minimal monthly fee that covers up to 100 active users, so confirm which applies before you budget.",
    "body": "**Disclosure: this site is funded by KinesteX, which sells a motion-tracking SDK that competes with Sency.** So every figure below is copied from Sency's own pages and repositories, the comparison section holds KinesteX to the same test as everyone else, and nothing here ranks KinesteX first. Sency's pricing pages were read on October 17 and 18, 2026 through a text reader, because the part of the page our snapshot tool extracts holds only a contact form; every quoted passage is re-checked against Sency's live page by an automated quote check.\n\n## What Sency charges for\n\nSency prices its SencyMotion SDK by **monthly active user**. Its pricing pages define one as \"one of your users who actively uses Sency's SDK\", with an example: a platform with 10,000 users of whom 2,000 use the SDK in a month is charged for 2,000. Each unique user is counted once per month however often they use it, and Sency says it does not charge \"any additional fees for heavy usage per user\". Every plan lists unlimited monthly activities.\n\n## The plans\n\nAs listed on Sency's [pricing packages page](https://www.sency.ai/pricing-packages) on October 18, 2026:\n\n| Plan | Price | Monthly active users | What the plan lists |\n| --- | --- | --- | --- |\n| Starter (\"Build & Launch\") | Free | Up to 100 | $0 per active user, unlimited monthly activities, full access to the SencyMotion SDK, standard customer support |\n| Growth (\"Publish & Monetize\") | From $499 a month | Up to 3,800 | $0.79 per active user, unlimited monthly activities, full SDK access, premium customer support, branded UI |\n| Customized (\"A Solution for All\") | On request (\"Let's Discuss\") | Unlimited | An optimized price per active user, a dedicated support team, a tailored solution |\n\nOne thing the page does not explain is how the Growth figures combine: it shows \"From $499 / month\", \"Up to 3,800 monthly active users\" and \"$0.79 per active user\" side by side without saying whether the per-user rate is charged on top of the base, counts against it, or applies above some number of users. Ask before you model a bill.\n\n## Two Sency pages that describe the start differently\n\nSency's main [pricing page](https://www.sency.ai/pricing), read on October 17, describes the entry path in a different way. It says you can integrate \"at no cost during the free trial\", that \"after that, you'll start paying a minimal monthly fee to continue building and testing, which includes access for up to 100 active users\", and that above 100 unique active users usage is billed \"on a pay-as-you-go basis according to the rates listed on our pricing page\". The packages page calls the first 100 active users free; the main page calls them a paid tier after a trial. Both pages agree on the unit and on unlimited activities. We cannot tell from the pages which one is current, so get the answer in writing before you rely on the free tier for a launch.\n\n## Branded UI, kits and keys\n\n- **Branded UI.** Sency's FAQ says branded UI, the ability to customize, adjust or remove its default interface, \"is available for every Kit except the Exploration Kit\". The Growth plan lists \"Branded UI for your business\"; the Starter plan does not list it. Neither page says which plan the Exploration Kit belongs to.\n- **Getting a key.** The SDK README says to register \"a new client for free\" for demo access and an API client key, and that the key arrives \"automatically in a response email after you subscribe to one of our plans\". The pricing pages' contact form says Sency then invites you to schedule a call.\n- **Licence.** The LICENSE file in Sency's repositories is its Terms of Use, last updated in September 2022, which says any commercial or production use is governed by a separate paid service agreement. Plan in a contract, not just a checkout.\n- **Integration help.** The main pricing page lists free integration guidance and says integrating the SDK is the partner's responsibility, with Sency sharing best practices; it also cites a record of 54 minutes from installing the SDK to a working assessment in a partner's app, which is a speed claim, not a price.\n\n## How it compares with other motion SDKs\n\nUnits differ, so compare on your own numbers rather than on headline prices:\n\n- **QuickPose** bills per monthly active device: free for 10 devices, then $25 a month for up to 100 devices rising to $1,000 a month for up to 100,000, every SDK feature on every plan. Its paid entry is far cheaper than Sency's Growth plan; Sency's free Starter covers more users than QuickPose's free tier, if the packages page is the one that applies. See [QuickPose pricing](/pricing/quickpose-pricing) and [QuickPose vs Sency](/compare/quickpose-vs-sency).\n- **Kemtai** publishes no prices on the pages we fetched and routes buyers to a demo request.\n- **KinesteX**, which funds this site, publishes no prices either. Its FAQ describes usage-based plans priced per active user per month that fall as you reach new tiers, and says integration fees may apply.\n- **Free pose models** such as MediaPipe and MoveNet cost nothing to license; you pay in the engineering Sency packages. [Build vs buy for AI motion tracking](/motion/build-vs-buy-ai-motion-tracking) sets out that trade.\n\nIf the unit, the two-page ambiguity or the separate service agreement rules Sency out, the realistic options are in [Sency alternatives](/alternatives/sency-alternatives).\n\n## Before you budget\n\nModel the bill on monthly active users of the SDK, not total accounts. Then ask Sency three things in writing: whether the first 100 active users are free or covered by a paid monthly fee, how the Growth plan's $499 base and $0.79 per-user rate combine, and what the separate service agreement adds. Every figure here is as Sency's pages showed it on October 17 and 18, 2026; re-open both pages before you commit. For how Sency's SDK compares with ours, see [KinesteX vs Sency](/compare/kinestex-vs-sency), which carries this site's disclosure.",
    "faqs": [
      {
        "q": "Is Sency free to use?",
        "a": "It depends on which of Sency's pages applies. Its pricing packages page lists a free Starter plan for up to 100 monthly active users with full access to the SencyMotion SDK. Its main pricing page instead describes a free trial, after which a minimal monthly fee covers up to 100 active users and usage above that is pay-as-you-go. Ask Sency which one is current before you plan a launch on the free tier."
      },
      {
        "q": "What counts as an active user in Sency's pricing?",
        "a": "One of your users who actually uses Sency's SDK in the month. Sency's example is a platform with 10,000 users of whom 2,000 use the SDK, which is charged for 2,000. Each unique user is counted once per month regardless of how many times they use it, and Sency says it charges no extra fees for heavy usage per user."
      },
      {
        "q": "How much does Sency's Growth plan cost?",
        "a": "Sency's pricing packages page lists Growth from $499 a month for up to 3,800 monthly active users, with $0.79 per active user, premium customer support and the branded UI. The page shows those figures side by side without saying how the base price and the per-user rate combine, so get a written quote for your expected user count."
      },
      {
        "q": "Does Sency's free plan include the branded UI?",
        "a": "The Starter plan does not list it; the Growth plan lists branded UI for your business. Sency's FAQ says branded UI is available for every kit except the Exploration Kit, but neither pricing page says which plan the Exploration Kit belongs to, so confirm what your plan includes with Sency."
      }
    ],
    "related": [
      {
        "href": "/compare/quickpose-vs-sency",
        "label": "QuickPose vs Sency"
      },
      {
        "href": "/alternatives/sency-alternatives",
        "label": "Sency alternatives"
      },
      {
        "href": "/pricing/quickpose-pricing",
        "label": "QuickPose pricing"
      },
      {
        "href": "/pricing",
        "label": "All fitness & health API pricing"
      }
    ],
    "cta": {
      "pitch": "Sency's two pricing pages already disagree about the first 100 users. Subscribe and we will flag it when a motion SDK changes a plan, a unit or a free tier."
    },
    "sources": [
      {
        "url": "https://www.sency.ai/pricing-packages",
        "checked": "2026-10-18",
        "note": "plans, user limits, prices, per-user rate, support levels, active-user and branded UI answers (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://www.sency.ai/pricing",
        "checked": "2026-10-17",
        "note": "trial, minimal monthly fee for up to 100 active users, pay-as-you-go, integration notes (read through a text reader; quotes re-checked on the page by CI)"
      },
      {
        "url": "https://github.com/sency-ai/smkit-sdk",
        "checked": "2026-10-17",
        "note": "free client registration, API key by email after subscribing, Terms of Use LICENSE"
      },
      {
        "url": "https://quickpose.ai/sdk-pricing/",
        "checked": "2026-10-17",
        "note": "QuickPose plans for comparison (snapshot)"
      },
      {
        "url": "https://www.kinestex.com/product/faqs",
        "checked": "2026-10-17",
        "note": "KinesteX pricing model answers (snapshot)"
      },
      {
        "url": "https://kemtai.com/",
        "checked": "2026-10-17",
        "note": "demo request (snapshot)"
      }
    ],
    "firstParty": true
  }
];
