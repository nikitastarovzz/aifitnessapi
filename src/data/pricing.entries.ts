import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED fitness/health API pricing pages (do not hand-edit; regenerate
 * via scratchpad/assemble10.mjs). Article + FAQPage (no HowTo). Every figure is
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
    "body": "## What the Fitbit API costs\n\nThe short answer: the **Fitbit Web API is free to call**. There has never been a documented per-request fee to access it, and registering a developer app on the Fitbit developer portal costs nothing. What actually costs money is different — the approval and OAuth setup effort, your own server and storage infrastructure, and the fact that each of your users must **own a Fitbit device and hold a Fitbit (now Google) account** for any data to exist. One big caveat looms over all of this: the Fitbit Web API is being **migrated to the Google Health API** during 2026, and the successor's pricing model is not clearly published yet. Treat every specific number here as \"as of 2026 — verify current pricing\" before you rely on it.\n\n## What it actually costs\n\nThe honest way to read Fitbit's cost is to split it into three separate buckets that people constantly conflate. The API being free to call does not mean the product is free to *use*.\n\n| Cost bucket | Who pays | Notes (as of 2026 — verify) |\n|---|---|---|\n| Fitbit Web API access | You (the developer) | No documented per-call fee. Free developer app registration. Rate limit reported at 150 requests/hour per consented user — verify, may change post-migration. |\n| Your own infrastructure | You (the developer) | Servers, data storage, OAuth token refresh, webhook handling, monitoring, maintenance. Fitbit does not host your integration. |\n| Device + account | Your end user | The user must own a Fitbit and have a Fitbit/Google account for data to flow. This is $0 to you but gates who can use your app. |\n| Fitbit Premium | Your end user (optional) | A consumer subscription. It is **not** an API access fee — do not conflate it with API cost. |\n\nThe line that matters most: \"free to call\" is not the same as \"free to use.\" You pay nothing to Fitbit for API requests, but your integration is worthless unless your users already own the hardware.\n\n## The catch — what to budget for\n\nThe real spend on a Fitbit integration is engineering time and infrastructure, not an API bill.\n\n- **Approval and setup effort.** You register a developer app and wire up OAuth 2.0. That is time, not dollars, but it is a real cost on a roadmap.\n- **Your infrastructure and storage.** Wearable data (per-minute heart rate, sleep, activity) accumulates quickly. Storing history, refreshing tokens, and handling retries is an ongoing cost that dwarfs the (zero) API fee.\n- **The 2026 migration — the biggest budget item.** Fitbit is moving developers to the **Google Health API**. Reported timeline (corroborated across third-party transition guides; confirm on Fitbit/Google's own pages): new integrations target the Google Health API by around end of May 2026, with the legacy Fitbit Web API endpoints scheduled for deprecation around September 30, 2026 and the two running side by side in between. Migration reportedly requires registering a project in Google Cloud Console and mandatory per-user re-consent (no silent migration). Budget engineering time for a re-integration.\n- **Successor pricing is unconfirmed.** The consumer **Google Health API** (the Fitbit replacement, documented at developers.google.com/health) is **not** the same product as the enterprise **Google Cloud Healthcare API**, which has its own published per-request FHIR/DICOM pricing. Do not assume the Cloud Healthcare API's figures describe the cost of the Fitbit replacement. As of this writing the consumer Google Health API's own pricing and quota model is not clearly public — verify before you commit.\n\n## How it compares and cheaper paths\n\nIf you only ever need Fitbit data, calling the API directly is the low-fee path — you pay in integration and maintenance effort, not per request. Where it gets expensive is scale and breadth: supporting many wearables means either N separate first-party integrations or paying a cross-device aggregator on a per-connected-user or per-MAU model.\n\n- To wire up Fitbit specifically, see the [Fitbit API integration guide](/integrate/fitbit-api).\n- If Fitbit's approval effort or the Google Health API migration pushes you toward other options, compare the [Fitbit API alternatives](/alternatives/fitbit-api-alternatives).\n- Choosing between the two most common first-party wearable APIs? See [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api).\n- For the broader \"is any of this free\" picture, see [free fitness APIs](/fitness-apis/free-fitness-apis) and the [wider fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost).\n\n## Honest close\n\nThe Fitbit Web API is free to call today, but pricing and access terms for health data change often — and the Google Health API migration is actively rewriting the rules during 2026. Do not treat any figure on this page as final. Re-open Fitbit's and Google's own developer pages, and read the current terms, before you build or budget against them.",
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
        "a": "Fitbit is migrating developers to the Google Health API during 2026, with new integrations reportedly targeting it by around end of May 2026 and legacy endpoints scheduled for deprecation around September 30, 2026 - confirm dates on Fitbit and Google's own pages. The successor consumer Google Health API's pricing and quota model is not clearly public yet. Note it is a different product from the enterprise Google Cloud Healthcare API, whose published pricing does not describe the Fitbit replacement. Verify before committing."
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
    "metaTitle": "Garmin API Pricing: What Does It Actually Cost?",
    "metaDescription": "Garmin's developer API is partner-approval-only with no public price list. What it costs, the setup-fee question, and cheaper paths. Verify with Garmin.",
    "updated": "2026-07-23",
    "answer": "Garmin does not publish pricing for its developer APIs. Access to the Health API and Activity API runs through the Garmin Connect Developer Program, which is partner-approval-only rather than self-serve, so commercial terms are settled privately in a partnership conversation rather than shown on a price list. The cost that reliably bites is user-side (your users must own a Garmin device) plus your own approval time and infrastructure. Some third-party reports mention a setup fee, but Garmin does not list pricing publicly, so verify any figure directly with Garmin.",
    "body": "Garmin does not publish pricing for its developer APIs, so the honest answer to \"what does the Garmin API cost?\" is: nobody outside a signed partner agreement can quote you a firm number. Garmin's Health API and Activity API sit inside the Garmin Connect Developer Program, which is **partner-approval-only** rather than a self-serve, sign-up-and-get-a-key product. There is no per-call price list to point at, so the real cost is settled in a partnership conversation with Garmin. The cost that reliably bites is on the user side — your users must own a Garmin device for any data to exist — plus your own approval time and infrastructure. Treat every figure below as a model to verify directly with Garmin, not a quote.\n\n## What it actually costs\n\nThe useful way to think about Garmin API cost is in three separate buckets: what Garmin charges you for access, what your users pay, and what you spend building and running the integration. Only the first is genuinely unknown, and that is the point — Garmin keeps commercial terms private and settles them per partner.\n\n| Cost | Who pays | Notes (verify with Garmin) |\n| --- | --- | --- |\n| API access / program terms | You (the developer) | Not publicly listed. Access is gated behind partner approval; any fee or licensing is negotiated in a partner agreement — verify directly with Garmin |\n| Setup / administrative fee | You (the developer) | Some third-party reports mention a setup fee; Garmin does not list pricing publicly. Do not treat any circulating figure as confirmed — verify with Garmin |\n| Premium / commercial data licensing | You (the developer) | Third parties suggest certain metrics may carry separate licensing terms; unconfirmed on any Garmin page — verify |\n| Owning a Garmin device | Your end user | A one-time hardware purchase. No separate consumer subscription is required for basic Garmin Connect use — verify current terms |\n| Your infrastructure | You (the developer) | Servers, storage of historical data, OAuth token handling, webhook processing, monitoring, and ongoing maintenance. Garmin does not host your integration |\n| Approval / time-to-market | You (the developer) | Application review takes calendar time — reported anywhere from a few business days to weeks depending on queue and application completeness. Verify current turnaround |\n\nThe one distinction to keep straight: there is no evidence of a published per-request API fee the way a metered API would charge, and there is also no confirmation the program is \"free.\" Garmin simply does not disclose the model publicly. The defensible statement is that commercial terms exist but are settled privately with approved partners — anything more specific has to come from Garmin.\n\n## The catch: approval-gated, and the terms live behind a sales conversation\n\nThe real friction with Garmin is not a sticker price you can see and reject — it is that you cannot see it at all until you are far enough into the partner process to be quoted. That has a few practical consequences worth budgeting for.\n\nFirst, **access is not guaranteed.** You apply to the Garmin Connect Developer Program, and Garmin vets your use case, company, and data-handling practices before granting access. Multiple third-party sources have reported the program being on hold or paused for new sign-ups at various times, with existing partners continuing to work. Whether it is open right now is exactly the kind of thing that changes — confirm live status directly with Garmin before you plan around it.\n\nSecond, **the setup-fee question is genuinely unresolved.** Third-party integrator blogs reference a one-time administrative or setup fee, and some mention separate licensing for certain premium metrics. None of this appears on a Garmin-owned page we could confirm. So the correct posture is: assume there may be a fee and possible licensing terms, but get the actual numbers from Garmin in writing. Do not budget against a figure you read in a third-party guide.\n\nThird, **the calendar cost is real even if the dollar cost turns out to be modest.** Partner review is time you cannot compress, and it lands on your roadmap whether or not money changes hands. If time-to-market matters, factor the approval queue in from the start.\n\nFor the mechanics of applying and wiring up the integration once you are approved, see [/integrate/garmin-api](/integrate/garmin-api).\n\n## How it compares and cheaper paths\n\nIf Garmin's opacity is a dealbreaker — you cannot get pricing without entering a partner process, and you cannot even confirm the program is open — there are two directions worth weighing before you commit.\n\nOne is to compare Garmin head-to-head with another first-party wearable API whose access model is more predictable. [/fitness-apis/fitbit-api-vs-garmin-api](/fitness-apis/fitbit-api-vs-garmin-api) lays out that trade-off; note that Fitbit's API is migrating to the Google Health API during 2026, and that successor's pricing model is itself not clearly listed, so \"more predictable\" is relative.\n\nThe other is to reach Garmin data through a health-data aggregator instead of integrating directly. Aggregators typically price on active or connected users and remove the per-provider approval work, trading Garmin's private-terms uncertainty for a recurring, quotable per-user fee. That is a classic build-versus-buy decision — see [/alternatives/garmin-api-alternatives](/alternatives/garmin-api-alternatives) for the options, and [/fitness-apis/wearable-data-apis](/fitness-apis/wearable-data-apis) for how the aggregator layer works. Aggregator pricing is its own topic; the point here is only that it is often a way to sidestep Garmin's approval gate.\n\n## Bottom line\n\nGarmin's developer API cost is not something you can look up — it is a partner-program arrangement whose commercial terms are set privately with approved developers, and Garmin does not list them publicly. The only cost that is certain is user-side (owning a Garmin device) and your own build-and-run overhead plus the approval wait. Some third-party sources mention a setup fee and possible premium-metric licensing, but none is confirmed on a Garmin page, so do not plan against any specific number. Pricing, program status, and terms all change, so verify everything directly with Garmin or through a partner agreement before you build a budget around it.",
    "faqs": [
      {
        "q": "Is the Garmin API free?",
        "a": "Unconfirmed. Garmin does not publicly list its developer API terms, so there is no evidence it is free and no confirmation of a fee either. Access is gated behind partner approval, and commercial terms are negotiated in a partner agreement. Verify directly with Garmin rather than assuming it is free or paid."
      },
      {
        "q": "Does Garmin charge a setup fee for API access?",
        "a": "Possibly, but it is unconfirmed. Some third-party integrator guides mention a one-time setup or administrative fee, and some mention separate licensing for certain premium metrics. None of this appears on a Garmin-owned page we could confirm, so do not budget against any circulating number. Get the actual terms from Garmin in writing."
      },
      {
        "q": "How do I get pricing for the Garmin API?",
        "a": "By applying to the Garmin Connect Developer Program and going through partner approval, where Garmin vets your use case, company, and data handling before terms are settled. There is no public price list; pricing comes from a sales or partnership conversation. Confirm the program is currently open before planning around it, as it has reportedly paused new sign-ups at times."
      },
      {
        "q": "What does the Garmin API cost my users?",
        "a": "Your end users must own a Garmin device for their data to exist and flow through the API. That is a one-time hardware purchase; no separate consumer subscription is required for basic Garmin Connect use as of 2026. Verify current terms, since device and account requirements can change."
      },
      {
        "q": "Is there a cheaper or more predictable alternative to Garmin's direct API?",
        "a": "Reaching Garmin data through a health-data aggregator can trade Garmin's private-terms uncertainty and approval gate for a recurring, quotable per-user fee. That is a build-versus-buy decision. See the alternatives and wearable-data-API pages to weigh it, and verify each vendor's current pricing directly."
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
      "pitch": "Get a heads-up when Garmin and other fitness APIs change their access rules, program status, or partner terms before it affects your budget."
    }
  },
  {
    "slug": "strava-api-pricing",
    "primaryQuery": "strava api pricing",
    "h1": "Strava API Pricing: What Does It Actually Cost?",
    "metaTitle": "Strava API Pricing: Is It Free? (2026)",
    "metaDescription": "The Strava API has no per-call fee, but Standard-tier developers now reportedly need a paid Strava subscription. Costs explained — verify current terms.",
    "updated": "2026-07-23",
    "answer": "The Strava API has no per-call developer fee — you register an app and call it without paying Strava a usage bill. The nuance for 2026: Standard-tier developers now reportedly must hold a paid Strava subscription (reported around $11.99/mo in the US, varies by country) to keep API access, so a membership cost effectively gates Standard access. That developer subscription, plus the 2024-onward display and AI-use restrictions, is the real cost to budget. Verify every figure and date against Strava's current developer agreement and API Policy — the terms changed recently and vary by geography.",
    "body": "If you are pricing out a Strava integration, the honest answer is that the API has no per-call fee, but \"free\" is no longer the whole story. You register a developer app and call the API without paying Strava a usage bill. What changed is the gate: as reported for 2026, Standard-tier developers must now hold a paid Strava subscription to keep using the API, so there is effectively a membership cost sitting in front of Standard access. The single biggest thing to budget for is that developer subscription plus the display and data-use restrictions Strava tightened from 2024 onward — and every dollar figure below should be verified against Strava's current developer agreement and API Policy, because the terms moved recently and vary by country.\n\n## What the Strava API actually costs\n\nKeep three costs separate: what you pay Strava to access the API, what your end user pays for their Strava account, and what you spend on your own build. They are not the same line item, and conflating them is the most common pricing mistake.\n\nThe API itself has historically been free to call — there is no documented per-request developer fee. The new twist reported for 2026 is a subscription requirement on the developer side for the Standard tier, not a per-call surcharge. Treat the numbers here as volatile.\n\n| Cost | Who pays | Notes (as of 2026, verify) |\n| --- | --- | --- |\n| API access / per-call fee | Developer | No per-request fee documented for calling the API |\n| Standard-tier developer subscription | Developer | Reported now required; equals a normal paid Strava membership |\n| Strava membership price | Developer (Standard tier) and/or user | Reported around $11.99/mo in the US, varies by country — verify |\n| Strava account | End user | A free or paid Strava account; the user's data must exist to flow |\n| Your own infrastructure | You | Servers, OAuth token storage and refresh, webhooks, monitoring |\n\nOn the reported 2026 change: new Standard-tier developers were said to need the subscription immediately as of June 1, 2026, existing Standard-tier developers a little later, and Extended Access developers reportedly not affected. Strava framed it as the existing consumer membership rather than a stacked developer-only fee. The primary announcement and the current API Agreement could not be machine-read during research (the pages blocked automated access), so confirm the effective dates, the affected tiers, and the price on Strava's own pages before you commit a budget. Do not assume one global price — the membership figure is US-specific and geography-dependent.\n\n## The catch: what to budget for\n\nThe subscription is only part of the real cost. Since a Nov 2024 agreement update, still reported in force, Strava restricts how you may use the data: a given athlete's data may generally only be displayed back to that same athlete (not to other users), using Strava data to train AI or ML models is prohibited, and third-party apps must not replicate Strava's core design and functionality. These are architectural constraints, not just fine print — they can rule out product ideas regardless of what you pay.\n\nThere are also rate limits per application and Developer Program display rules (the \"Connect with Strava\" branding, screenshots of every surface where Strava data appears). This page will not quote specific rate-limit numbers because the current values could not be verified from a primary source — check developers.strava.com for the live limits and design around them rather than hardcoding a figure from memory. If your terms or architecture changed, the practical steps to bring a live integration back into compliance live in [/migrate/adapt-to-strava-api-changes](/migrate/adapt-to-strava-api-changes).\n\nThen there is your own side of the ledger, which the API fee never captures: server and storage costs, OAuth token management, webhook handling, and the engineering time to keep pace as Strava's terms shift. Budget maintenance as a recurring line, not a one-time setup. For the setup mechanics themselves, see [/integrate/strava-api](/integrate/strava-api).\n\n## How it compares and cheaper paths\n\nWhether Strava's model is worth it depends on your product. If the developer-subscription requirement, the display-back-to-owner rule, or the AI-training ban conflict with what you are building, it may be cheaper overall to reach the same athletes another way — a cross-device aggregator (priced per connected user or per monthly active user) removes the per-provider integration work but adds a recurring fee, and other first-party wearable APIs carry their own gates. Weigh those trade-offs in [/alternatives/strava-api-alternatives](/alternatives/strava-api-alternatives), and see how the broader landscape prices in [/fitness-apis/wearable-data-apis](/fitness-apis/wearable-data-apis). If you only need workout or exercise content rather than a specific athlete's Strava history, [/fitness-apis/free-fitness-apis](/fitness-apis/free-fitness-apis) covers genuinely free and open options.\n\n## The honest close\n\nThe Strava API is free to call but no longer unconditionally free to use: Standard-tier access now reportedly requires a paid Strava subscription, and the 2024-onward display and AI-use rules constrain what you can build. Every specific here — the roughly $11.99/mo US membership figure, the effective dates, the affected tiers, the rate limits — should be checked against Strava's live developer agreement and API Policy before you plan a budget, because those pages changed recently and were not machine-verifiable during research.",
    "faqs": [
      {
        "q": "Is the Strava API free?",
        "a": "It is free to call — there is no documented per-request fee to access the API. But it is no longer unconditionally free to use: as reported for 2026, Standard-tier developers must hold a paid Strava subscription to keep API access. So there is effectively a membership cost in front of Standard access even though the API calls themselves are not metered. Verify the current requirement on Strava's own developer pages."
      },
      {
        "q": "How much is the Strava developer subscription?",
        "a": "It is reported to be the normal Strava membership rather than a separate developer-only fee — cited around $11.99 per month in the US, but the price varies by country. This figure is US-specific and geography-dependent, and the primary announcement could not be machine-verified during research. Treat it as 'as of 2026, verify' and confirm the current price on Strava's own pricing page before budgeting."
      },
      {
        "q": "Who has to pay — the developer or the end user?",
        "a": "Keep them separate. The end user needs a Strava account (free or paid) for their data to exist. The new 2026 twist is on the developer side: Standard-tier developers reportedly now also need a paid subscription for API access. New Standard-tier developers were said to need it from June 1, 2026, existing ones a little later, and Extended Access developers reportedly were not affected. Verify which tier and dates apply to you."
      },
      {
        "q": "Are there Strava API rate limits or usage restrictions?",
        "a": "Yes. Strava documents per-application rate limits, and a 2024 agreement update reportedly restricts displaying an athlete's data to that same athlete, bans using Strava data to train AI or ML models, and forbids replicating Strava's core functionality. This page does not quote specific rate-limit numbers because they could not be verified from a primary source — check developers.strava.com for current values rather than hardcoding a figure."
      },
      {
        "q": "Is there a cheaper way to get the same data?",
        "a": "It depends on your product. If the developer-subscription requirement or the display and AI-use rules conflict with what you are building, a cross-device aggregator (priced per connected user or per monthly active user) or a different first-party API may fit better, each with its own trade-offs. Compare options before committing to Strava's model."
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
      "pitch": "Get a heads-up when Strava and other fitness APIs change their pricing, access rules, or terms before it hits your budget."
    }
  },
  {
    "slug": "oura-api-pricing",
    "primaryQuery": "oura api pricing",
    "h1": "Oura API pricing: what it actually costs",
    "metaTitle": "Oura API Pricing: Is It Free? (2026)",
    "metaDescription": "The Oura API is free to call with no developer fee, but Gen3 data reportedly needs an active Oura Membership. Honest breakdown; verify terms.",
    "updated": "2026-07-23",
    "answer": "The Oura API is free to call: there is no publicly listed developer or per-request fee, and you register an app and authenticate over OAuth 2.0 for free. The cost that actually bites is user-side: your users must own an Oura Ring, and as of 2026 Gen3 ring users reportedly need an active Oura Membership for their data to flow through the API. Treat the membership rule and any price as 'verify current terms' before you build against them.",
    "body": "## What the Oura API costs\n\nThe short answer: the **Oura API is free to call**. There is no publicly listed developer or per-request fee — you create an app in Oura's developer portal for free and authenticate over OAuth 2.0. The cost that actually bites is **user-side**: as of 2026, Gen3 Oura Ring users reportedly need an **active Oura Membership** for their data to flow through the API, and every user obviously has to own a ring first. Treat the membership rule and any dollar figure here as \"as of 2026 — verify current terms\" before you build against them.\n\n## What it actually costs\n\nThe honest way to read Oura's cost is to split it into separate buckets that are easy to conflate. \"Free to call\" is not the same as \"free to use\" — you pay Oura nothing for API requests, but your integration is useless unless your users own a ring and (for Gen3) keep a membership active.\n\n| Cost bucket | Who pays | Notes (as of 2026 — verify) |\n|---|---|---|\n| Oura API access | You (the developer) | No documented developer or per-call fee. Free app registration; OAuth 2.0 auth. |\n| Your own infrastructure | You (the developer) | Servers, data storage, OAuth token refresh, monitoring, maintenance. Oura does not host your integration. |\n| Oura Ring hardware | Your end user | A one-time purchase. No ring, no data — $0 to you, but it gates who can use your app. |\n| Oura Membership | Your end user | Reportedly required for **Gen3** ring data via the API; **Gen2** users are said to be unaffected. Verify current terms. A monthly/annual subscription — do not treat it as an API fee. |\n\nThe line that matters most: you owe Oura nothing for API calls, but your addressable users are only those who own a ring and, for Gen3, pay for a membership.\n\n## The catch — what to budget for\n\nThe real spend on an Oura integration is engineering time, infrastructure, and the membership dependency on your users' side — not an API bill.\n\n- **The membership dependency is the big one.** Per Oura's own guidance, \"Gen3 Oura Ring users without active Oura Membership will no longer be able to access their data through the Oura API.\" Gen2 users are reportedly not affected. This is a cost your *users* carry, but it shrinks your addressable audience to paying members. A membership price commonly cited is around a few dollars a month or roughly seventy dollars a year — but do **not** publish a hard figure; verify the current price on Oura's own pricing page.\n- **Personal-access tokens vs the partner/cloud path.** Oura historically issued direct Personal Access Tokens (PATs) for single-account use; **PATs have been deprecated** in favor of OAuth 2.0, though previously issued tokens may keep working during a transition — verify. For anything beyond your own account, you use the Cloud API with OAuth.\n- **The 10-user cap and app review.** A freshly registered app can connect only a small number of Oura users (reported around 10) until you submit it for Oura's review and approval — the \"Oura for Organizations\" partner path. That is approval effort and calendar time, not a listed fee. Any enterprise or commercial terms beyond this are not publicly listed — verify with Oura.\n- **Your infrastructure and storage.** Sleep, heart rate, workout, and SpO2 data accumulate continuously. Storing history, refreshing tokens, and handling retries is an ongoing cost that dwarfs the (zero) API fee.\n\n## How it compares and cheaper paths\n\nIf you only ever need Oura data, calling the API directly is the low-fee path — you pay in integration effort and your users' membership, not per request. Where it gets expensive is breadth: supporting many wearables means either separate first-party integrations or paying a cross-device aggregator on a per-connected-user or per-MAU model.\n\n- To wire up Oura specifically, see the [Oura API integration guide](/integrate/oura-api).\n- If the membership requirement or the 10-user cap pushes you toward other options, compare the [Oura API alternatives](/alternatives/oura-api-alternatives).\n- WHOOP has a similar membership-gated model worth weighing against Oura — see [WHOOP API pricing](/pricing/whoop-api-pricing).\n- For the broader \"is any of this free\" picture, see [free fitness APIs](/fitness-apis/free-fitness-apis).\n\n## Honest close\n\nThe Oura API is free to call today, but the membership requirement for Gen3 data and the exact subscription price change over time, and Oura's partner terms are not publicly listed. Do not treat any figure or rule on this page as final. Re-open Oura's own developer docs and current pricing page, and confirm the membership requirement, before you build or budget against them.",
    "faqs": [
      {
        "q": "Is the Oura API free?",
        "a": "The Oura API is free to call: no developer or per-request fee is publicly listed. You create an app and authenticate over OAuth 2.0 at no cost. The real costs are your own infrastructure and the user-side requirement to own a ring and, for Gen3, hold a membership. Verify current terms with Oura."
      },
      {
        "q": "Do users need an Oura Membership to use the API?",
        "a": "As of 2026, Oura's guidance indicates Gen3 Oura Ring users without an active Oura Membership can no longer access their data through the API, while Gen2 users are reportedly unaffected. This is a subscription your users pay, not an API fee. Confirm the current requirement and price on Oura's own pages before relying on it."
      },
      {
        "q": "What is the difference between a personal-access token and the partner API?",
        "a": "Oura historically issued Personal Access Tokens (PATs) for single-account use, but PATs have been deprecated in favor of OAuth 2.0 (older tokens may still work during a transition). A new app can connect only a small number of users, reported around 10, until you pass Oura's review for the partner or 'Oura for Organizations' path. Verify the current cap and process."
      },
      {
        "q": "How much does an Oura Membership cost?",
        "a": "Oura Membership is a recurring subscription commonly cited at a few dollars a month or roughly seventy dollars a year, with the ring a separate one-time purchase. Prices change and vary, so we do not quote a hard figure here: check Oura's current pricing page to confirm."
      },
      {
        "q": "Are there commercial or enterprise pricing tiers for the Oura API?",
        "a": "Beyond the free small-app path, broader or commercial use goes through Oura's review and the 'Oura for Organizations' partner track. Any enterprise or commercial terms are not publicly listed, so plan to verify them directly with Oura."
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
      "pitch": "Oura's membership requirement and partner terms shift over time, so join the newsletter for plain-English updates when wearable API pricing and access rules change."
    }
  },
  {
    "slug": "whoop-api-pricing",
    "primaryQuery": "whoop api pricing",
    "h1": "WHOOP API Pricing: What Does It Actually Cost?",
    "metaTitle": "WHOOP API Pricing: Is It Free? What It Costs",
    "metaDescription": "The WHOOP API is free to call but gated behind approval and a paid WHOOP membership. Here is what actually costs money, and why. Verify current terms.",
    "updated": "2026-07-23",
    "answer": "The WHOOP API is free to call — there is no documented per-request fee — but developer access is gated by registration on the Developer Platform, and WHOOP requires developers to hold a membership. The cost that actually bites is user-side: WHOOP is subscription hardware, so every end user needs an active WHOOP membership for their data to flow through the API. WHOOP has changed its membership structure recently, so verify current terms before you budget.",
    "body": "## What the WHOOP API costs\n\nThe short answer: the **WHOOP API is free to call** — there is no documented per-request fee to access the WHOOP Developer Platform. But \"free\" comes with two catches that matter more than any price tag. First, developer access is **gated**: you register on the Developer Platform, and WHOOP requires developers to hold an active WHOOP membership and device to build against it. Second, and more importantly, WHOOP is **subscription hardware** — the real cost sits with your end users, each of whom must pay for an active WHOOP membership for their data to exist and flow through the API at all. WHOOP has changed its membership structure recently, so treat every specific figure as \"as of 2026 — verify current terms\" before you rely on it.\n\n## What it actually costs\n\nThe honest way to read WHOOP's cost is to separate the developer API from the user-side membership. These are two different things that get conflated constantly. The API is free to *call*; it is not free to *use*.\n\n| Cost bucket | Who pays | Notes (as of 2026 — verify current terms) |\n|---|---|---|\n| WHOOP Developer Platform / API access | You (the developer) | No documented per-call fee. Access is free but **gated** — registration on the Developer Platform, plus WHOOP requires developers to hold an active membership and device. |\n| Your own infrastructure | You (the developer) | Servers, data storage, OAuth token refresh, webhook handling, monitoring, maintenance. WHOOP does not host your integration. |\n| WHOOP membership | Your end user | This is the dominant real cost. WHOOP's model bundles the hardware into a **recurring membership** — no membership, no data. Every user of your integration must pay it. Exact tiers and prices change — verify. |\n\nThe line that matters most: the API costs you nothing per request, but your integration is worthless unless your users are paying WHOOP members. Because WHOOP is subscription-based rather than a one-time device purchase, that membership is a recurring dependency, not a one-off.\n\n## The catch — what to budget for\n\nThe real spend on a WHOOP integration is developer effort and a membership dependency, not an API bill.\n\n- **The membership gate.** Unlike a device you buy once, WHOOP's model is a recurring subscription that bundles the hardware. To build on the Developer Platform you generally need to be a paying member yourself, and every end user needs an active membership for their data to be accessible. That shrinks your addressable market to current WHOOP subscribers.\n- **Verify the membership terms — do not assume a price.** WHOOP has restructured its membership and upgrade model recently and drawn press coverage for it. A free trial (roughly a month, with hardware and band) has been offered at various points. Because the structure has moved, do not print a specific tier price from memory — check WHOOP's current pricing page.\n- **Approval and setup effort.** Registering on the Developer Platform and wiring up OAuth is time, not dollars, but it is a real cost on a roadmap.\n- **Your infrastructure and storage.** WHOOP data (continuous heart rate, strain, recovery, sleep) accumulates quickly. Storing history, refreshing tokens, and handling retries is an ongoing cost that dwarfs the (zero) API fee.\n\n## How it compares and cheaper paths\n\nIf you only ever need WHOOP data, calling the API directly is the low-fee path — you pay in integration effort and the membership dependency, not per request. Where it gets expensive or limiting is breadth: supporting many wearables means either N separate first-party integrations or paying a cross-device aggregator on a per-connected-user or per-MAU model.\n\n- To wire up WHOOP specifically, see the [WHOOP API integration guide](/integrate/whoop-api).\n- If the membership gate or the approval effort pushes you to look elsewhere, compare the [WHOOP API alternatives](/alternatives/whoop-api-alternatives).\n- WHOOP and Oura share the same \"device data needs a paid membership\" trap — see [Oura API pricing](/pricing/oura-api-pricing) for the closest comparison.\n- For the broader \"is any of this free\" picture, see [free fitness APIs](/fitness-apis/free-fitness-apis) and the [wider fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost).\n\n## Honest close\n\nThe WHOOP API is free to call today, but access is gated behind an approval and a paid membership, and the membership structure has been changing. Do not treat any figure on this page as final. Re-open WHOOP's own developer and pricing pages, and read the current terms, before you build or budget against them.",
    "faqs": [
      {
        "q": "Is the WHOOP API free?",
        "a": "The API is free to call — no documented per-request fee to access the WHOOP Developer Platform. But it is gated: you register on the platform and WHOOP requires developers to hold an active membership and device. Free to call is not the same as free to use, because your users must be paying members for their data to exist."
      },
      {
        "q": "What is the real cost of building on WHOOP?",
        "a": "For the developer it is approval and setup effort plus your own infrastructure (servers, storage, OAuth token refresh, webhooks), not an API fee. The dominant real cost is user-side: WHOOP's subscription-hardware model means every end user pays a recurring WHOOP membership, which limits your addressable users to current subscribers."
      },
      {
        "q": "Do I need a WHOOP membership to use the API?",
        "a": "Reportedly yes. WHOOP requires developers on the Developer Platform to have a WHOOP device and active membership to build an app, and every end user needs an active membership for their data. Confirm the current requirement on WHOOP's own developer docs, as terms change."
      },
      {
        "q": "How much is a WHOOP membership?",
        "a": "WHOOP has restructured its membership and upgrade model recently and drawn press coverage for it, so we do not publish a specific tier price here. A free trial with hardware has been offered at times. Verify the current membership tiers and prices on WHOOP's own pricing page before you rely on any figure."
      },
      {
        "q": "Is there a cheaper way to get WHOOP-style data?",
        "a": "If you only need WHOOP data, calling the API directly is the low-fee path. If you need many wearables, a cross-device aggregator priced per connected user or per MAU can replace several first-party integrations. See the WHOOP API alternatives and the wider fitness API cost breakdown to compare."
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
      "pitch": "We track how wearable APIs price and gate access — membership requirements, approval hurdles, and the terms that change without notice — so you know what a WHOOP integration really costs before you build it."
    }
  },
  {
    "slug": "health-data-aggregator-pricing",
    "primaryQuery": "health data aggregator api pricing",
    "h1": "Health data aggregator API pricing: how Terra, Junction, Rook, and Spike charge",
    "metaTitle": "Health Data Aggregator API Pricing Models",
    "metaDescription": "How health data aggregators like Terra, Junction (formerly Vital), Rook, and Spike price API access: per-MAU and tiered models. Prices vary; verify.",
    "updated": "2026-07-23",
    "answer": "Unlike most first-party wearable APIs, health-data aggregators are where a recurring API bill actually lands. Terra, Junction (formerly Vital), Rook, and Spike almost all price on active or connected users (per-MAU), usually tiered by user count with an enterprise 'contact sales' top tier, and sometimes a credit or event layer on top. The biggest cost driver is that your bill scales directly with your connected-user base. Specific per-MAU prices are mostly not publicly listed, and several vendor pricing pages could not be verified, so treat the model as reliable and every number as 'as of 2026, verify with the vendor.'",
    "body": "## What health-data aggregators cost\n\nThe short answer: unlike most first-party wearable APIs, a health-data aggregator is where you actually pay a recurring API bill. Aggregators like Terra, Junction (formerly Vital), Rook, and Spike almost universally price on **active or connected users** — variously called per-connected-user or per-monthly-active-user (per-MAU) — usually layered into **tiered plans by user count** with an **enterprise \"contact sales\"** top tier, and sometimes an extra **credit or event** dimension on top. The catch for budgeting is that almost none of these vendors publish self-serve dollar figures: most pricing pages sit behind a sales conversation, and several could not even be loaded during research. So treat the *model* below as the reliable part and every specific number as \"not publicly listed — verify with the vendor.\"\n\n## What it actually costs\n\nThe honest way to read aggregator pricing is to separate the **model** (how they charge) from the **numbers** (what they charge), because the numbers are the part nobody publishes cleanly.\n\n| Vendor | Pricing model | What's public (as of 2026 — verify) |\n|---|---|---|\n| Terra | Usage-based on active connected users (\"active authentications\"), often with a credit/event allowance on top | Model is clear; specific figures are **not primary-verified** — verify on Terra's pricing page or with sales. |\n| Junction (formerly Vital) | Tiered by user count, plus a contact-sales Enterprise tier | Tiering exists (a smaller-user tier, a larger-user tier, Enterprise); **specific prices are not publicly listed** — verify. |\n| Rook | Usage-based, \"pay only for what you use,\" named tiers by active-user ceiling | Tier structure reported (Core / Business / Enterprise); **no per-user dollar figure sourced** — verify. |\n| Spike | Markets \"transparent, usage-driven, flexible\" pricing that scales with the business | **Specific tiers and figures were not retrievable** — verify with the vendor. |\n\nA few honest notes on that table. \"Active user\" or \"MAU\" is the near-universal unit — you generally pay for each end user whose wearable or app is connected and syncing in a given month, not per API call. **Tiering by user count** is the common wrapper: as your connected-user base grows you move up bands, and the largest band is almost always \"contact sales.\" Terra is the one that most visibly adds a **credit or event layer** on top of the user count, so its bill has two dimensions rather than one. None of these is inherently \"cheap\" or \"expensive\" — the right frame is whether the per-user model fits how your product grows.\n\nCritically: no per-MAU or per-connection dollar rate for any of these aggregators was verifiable during research, and several vendor pricing pages returned errors to automated fetching. Do not budget against a specific number you read secondhand — open the live pricing page or talk to sales before you commit.\n\n## The catch — what to budget for\n\nThe sticker (per-MAU or per-tier) is only part of the real cost. A few things bite:\n\n- **Your bill scales with your user base, by design.** Per-MAU pricing is predictable to model but it grows directly with adoption. A pricing tier that looks fine at launch is a different number at 50,000 connected users — and that upper band is usually the \"contact sales\" one you can't self-check.\n- **Credits and events can be a second meter.** Where a vendor (Terra, notably) layers a credit or event allowance on top of the user count, a data-heavy integration — high-frequency heart rate, sleep, workouts — can consume the allowance faster than user count alone suggests. Confirm how events are counted before you assume the base plan covers your volume.\n- **\"Contact sales\" means your real price is negotiated.** For anything past the self-serve tiers, the number that matters comes out of a sales conversation, not a public page. Budget lead time for that, and expect annual commitments at the enterprise end.\n- **The aggregator fee doesn't replace your own costs.** You still pay for your infrastructure, storage of high-volume wearable history, token and webhook handling, and health-data compliance (HIPAA/GDPR, encryption, BAAs). The aggregator removes integration labor, not your platform costs.\n\n## Why it costs money but can still save you money\n\nFirst-party wearable APIs are mostly free to call, so why pay an aggregator at all? Because the aggregator is a **build-vs-buy** trade. Supporting many wearables directly means N separate first-party integrations — each with its own OAuth flow, its own approval process, its own schema, and its own ongoing maintenance as that provider changes. An aggregator collapses that into one integration and one normalized data stream, and charges you a recurring per-user fee for doing so.\n\nThe rough heuristic: few devices, engineering to spare, and willingness to do each approval favors going direct (low API fee, high integration and maintenance cost). Many devices, a desire for one integration, and a predictable per-MAU budget favors an aggregator (a real recurring fee, much lower maintenance). Most teams end up mixing. What you're buying is the removal of per-provider integration and upkeep work — whether that's worth the per-user price depends on how many providers you'd otherwise build and maintain yourself.\n\n## How it compares and cheaper paths\n\n- For which aggregators exist and how they differ on coverage and features, see the [health-data aggregator APIs overview](/fitness-apis/health-data-aggregator-apis).\n- Weighing the two most-compared options head to head? See [Terra vs Vital (Junction)](/fitness-apis/terra-vs-vital).\n- To wire up a specific one, the [Terra API integration guide](/integrate/terra-api) walks through setup.\n- If you only need one or two wearables, going direct may be the lower-fee path — first-party APIs are mostly [free to call](/pricing/are-fitness-apis-free), and the [wider fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost) covers the full build-vs-buy math.\n\n## Honest close\n\nAggregators are the part of the fitness-data landscape where recurring API spend genuinely accrues — but the exact numbers are the hardest to pin down, because most vendors keep them behind \"contact sales\" and their pricing pages frequently can't be read from the outside. The models above (per-MAU, tiered by user count, sometimes a credit layer, enterprise contact-sales) are stable enough to plan around. The prices are not. Re-open each vendor's live pricing page, or get a quote, before you budget against any figure — pricing here changes, and the public record is thin on purpose.",
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
    "body": "## What a nutrition API costs\n\nThe short answer: it depends entirely on which kind of nutrition API you pick, and the split is stark. Commercial food APIs — **Nutritionix**, **Edamam**, and **Spoonacular** — are paid products built on freemium or free-tier-then-paid models, usually with an enterprise \"contact sales\" tier where the real money lives. Two options are genuinely **free**: **USDA FoodData Central** (U.S. government, public domain) and **Open Food Facts** (crowdsourced, open-licensed) cost nothing to call. The biggest cost that actually bites is not always the sticker price — it is the licensing and usage restrictions attached to the \"cheap\" tiers, and the integration work the free datasets push onto you. Every specific figure below is volatile; treat each as \"as of 2026 — verify current pricing\" before you rely on it.\n\n## The free/open vs paid split\n\nThe cleanest way to think about nutrition data pricing is to separate the two worlds first, then look at the model inside each. A vendor's \"free tier\" is not the same thing as a free/open dataset — free tiers are limited, can be curtailed, and are designed to lead you into paid tiers, while open datasets are licensed to be free but shift work and obligations onto you.\n\n| Option | Model | What to watch (as of 2026 — verify) |\n|---|---|---|\n| USDA FoodData Central | **Genuinely free**, public domain (CC0) | Free data.gov API key, signup in minutes. Rate limit reported around 1,000 requests/hour per IP. Lab/reference-oriented data, not restaurant/branded-menu complete. No SLA or support. |\n| Open Food Facts | **Genuinely free**, open data (ODbL) | No key, no signup to read. Crowdsourced, so coverage and quality vary by region. Attribution and share-alike obligations apply — a real constraint for commercial use. |\n| Nutritionix | Paid: free-then-paid + enterprise contact-sales | Reported to have curtailed its open free tier; upgrading reportedly requires scheduling a call. Annual billing on higher tiers. Specific prices not publicly confirmable — verify. |\n| Edamam | Paid: free developer tier then paid Enterprise tiers | Priced per product line (Nutrition Analysis, Food Database, Meal Planner). Terms reportedly restrict calls to end-user-driven requests and prohibit scraping — verify. |\n| Spoonacular | Paid: freemium **daily points** | Each call spends points from a daily quota; free plan hard-caps (returns HTTP 402) instead of billing overages. Paid tiers raise the daily point budget. Point costs and tier prices not sourced here — verify. |\n\nThe line that matters most: \"free tier of a paid API\" and \"free/open dataset\" are different in both licensing and longevity. Do not conflate them when you budget.\n\n## How the paid models actually work\n\nEach of the three commercial vendors prices differently, so the model matters more than any single number.\n\n- **Nutritionix** uses tiered paid plans with an enterprise \"contact sales\" top tier and annual billing on larger commitments. Reports indicate it pulled back its open free-access tier because of trial abuse and now offers limited, use-case-specific trial accounts, with a sales call required to upgrade. Specific tier dollar figures are not confirmable on a primary page — do not quote a number without checking the live pricing page.\n- **Edamam** starts with a free Developer tier for low volume and moves up to paid Enterprise tiers, priced separately per product line (Nutrition Analysis API, Food Database API, Meal Planner API). Beyond price, Edamam's terms reportedly restrict requests to human/end-user-driven calls and prohibit scraping or bulk saving — that is an architectural constraint, not just a cost. Verify the current terms.\n- **Spoonacular** runs a freemium **points** system. Each plan carries a daily points quota, and every call spends points (with more complex calls costing more). The free plan requires no credit card and hard-caps rather than charging overages — when the daily quota is exhausted it returns HTTP 402 and resets the next day. Paid tiers raise the daily point budget and unlock features. It is also mirrored on the RapidAPI marketplace. Verify current point costs and tier prices on the live page.\n\n## The catch — what to budget for\n\nThe trap in nutrition pricing is assuming the free options are cost-free and the paid tiers are simple. Neither is quite true.\n\n- **Free does not mean effort-free.** USDA FoodData Central and Open Food Facts cost nothing to call, but you self-integrate, normalize, and maintain everything. USDA data is reference and lab oriented rather than a complete branded-restaurant catalog, and Open Food Facts quality varies by region because it is crowdsourced.\n- **Licensing is a real cost.** Open Food Facts is ODbL — attribution and share-alike obligations that can force architecture or legal work. Edamam and Nutritionix reportedly restrict usage to end-user-driven requests and ban scraping. These constraints can matter more than the monthly fee.\n- **Freemium tiers get you hooked, then scale.** Spoonacular's daily points and per-call costs can spike as you grow; Nutritionix and Edamam funnel serious volume into contact-sales enterprise deals. Model your real request volume, not the demo.\n- **Free tiers can disappear.** Nutritionix reportedly curtailed its open free tier. A free tier is a business decision the vendor can reverse; an open dataset's license is far more durable. Weigh longevity, not just today's price.\n\n## Cheaper paths and how to compare\n\nIf cost is the deciding factor, start with the two genuinely free datasets and only move to a paid vendor when you need coverage they lack — comprehensive branded-restaurant menus, natural-language food logging, or recipe/meal-planning features that USDA and Open Food Facts do not provide.\n\n- For the full landscape of what each vendor offers (not just price), see the [nutrition APIs roundup](/fitness-apis/nutrition-apis).\n- If Nutritionix's pricing or curtailed free tier is pushing you to look elsewhere, compare the [Nutritionix alternatives](/alternatives/nutritionix-alternatives).\n- Ready to wire one up? See the [Nutritionix API integration guide](/integrate/nutritionix-api).\n- For the broader \"is any of this free\" picture across fitness data, see [free fitness APIs](/fitness-apis/free-fitness-apis) and the [wider fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost).\n\n## Honest close\n\nNutrition API pricing changes often, and most vendor pricing pages are gated or behind a sales conversation, so the specific tiers and point costs above could not all be confirmed against primary sources. Treat nothing here as final. Re-open each vendor's own pricing and terms pages — and read the license on the free datasets — before you build or budget against them.",
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
    "metaDescription": "ExerciseDB and API Ninjas bill per request; wger, exercisedb.dev and free-exercise-db self-host free. Compare the paid vs open split and the AGPL catch.",
    "updated": "2026-07-23",
    "answer": "It depends on which kind you pick. Paid gateways like ExerciseDB (via RapidAPI) and API Ninjas use a freemium, per-request model - a limited free tier, then paid tiers metered by request volume with overage charges. Free and open options like wger, exercisedb.dev, and free-exercise-db cost $0 for the software or data - you pay only your own hosting. The catch on the free side is licensing: two of the three are AGPL copyleft, which matters for closed-source products. Treat every specific quota or price as 'as of 2026 - verify on the live listing.'",
    "body": "## What an exercise database API costs\n\nThe short answer: it depends entirely on which kind you pick, and the split is stark. **Paid gateways** like ExerciseDB (sold through the RapidAPI marketplace) and API Ninjas run a **freemium, per-request model** — a limited free tier, then paid tiers metered by request volume, with overage charges once you exceed your quota. **Free and open options** like wger, exercisedb.dev, and free-exercise-db cost $0 for the software or data — you pay only your own hosting. The catch on the free side is licensing: two of the three are **AGPL** (copyleft), which has real implications for closed-source commercial products. Treat every specific quota or price below as \"as of 2026 — verify on the live listing,\" since marketplace pricing changes often.\n\n## What it actually costs\n\nThe honest way to read this market is a two-column split: are you renting access to a hosted API, or self-hosting an open dataset? The costs are completely different in kind.\n\n| Option | Pricing model | Watch out (as of 2026 — verify) |\n|---|---|---|\n| ExerciseDB (via RapidAPI) | Freemium / tiered, per-request billing through the RapidAPI marketplace | Free BASIC tier has a hard monthly request cap; paid tiers add quota; overage is charged per request above quota. Exact caps and prices live on the RapidAPI listing and change — verify. |\n| API Ninjas (Exercises API) | Freemium — free API key, paid tiers for higher volume | Commercial use is not permitted on the free tier. Specific tier prices are not publicly retrievable — verify on the vendor page. |\n| wger | Free, open source (AGPL-3.0), self-hosted | $0 software cost; you pay your own infra. AGPL copyleft applies if you distribute a modified version. |\n| exercisedb.dev | Free, open source (AGPL v3), self-hosted | $0 software cost; one-click deploy options exist; you pay your own infra. AGPL copyleft — matters for closed-source products. |\n| free-exercise-db | Free, public domain (Unlicense) | $0, no key, no signup, no attribution required. It is a static dataset, not a live hosted API — you serve it yourself. |\n\nThe line that matters most: a paid gateway hands you a hosted, ready-to-call API and bills you for requests; a free/open project hands you data or code for nothing and shifts the hosting, serving, and maintenance onto you. Neither is \"cheaper\" in the abstract — it depends on your volume, your engineering capacity, and your license tolerance.\n\n## The catch — AGPL, quotas, and hidden costs\n\nThe two things most likely to bite are the licensing on the free options and the metered billing on the paid ones.\n\n- **AGPL copyleft (wger and exercisedb.dev).** Both are licensed under the GNU AGPL. AGPL is a strong copyleft license with a network-use trigger: if you run a modified version as a network service, you can be obligated to release your modifications under the same license. For a closed-source commercial product this is a genuine architectural and legal consideration, not just a footnote — get it reviewed before you build on it. By contrast, **free-exercise-db is public domain (the Unlicense)** with no obligations at all, which makes it the most unrestricted free option — at the cost of being a static dataset with no live API or SLA.\n- **Per-request overages on the paid gateways.** RapidAPI-style billing typically caps the free tier hard, then charges per request above your paid quota; RapidAPI emails as you approach your limit. Costs can climb unexpectedly as your usage grows. Do not assume a specific free-tier quota — the numbers reported around ExerciseDB's free tier vary and are set per-API on the marketplace. Verify on the live listing before you budget.\n- **Commercial-use restrictions.** API Ninjas' free tier excludes commercial use — a limitation on what you can ship, separate from the price.\n- **Your own infrastructure.** \"Free\" self-hosting (wger, exercisedb.dev, free-exercise-db) still costs servers, bandwidth, uptime, and the engineering time to parse, normalize, and keep the dataset updated.\n- **Exercise counts vary — do not over-index.** Different projects and versions advertise different library sizes; treat any headline count as version-specific and verify against the actual repo or listing.\n\n## How it compares and cheaper paths\n\nIf you need a hosted API and low volume, a freemium gateway gets you started for nothing — just watch the quota. If you want zero recurring cost and can run infrastructure, the open options are genuinely free; the deciding factor is usually the license, not the price.\n\n- For the full landscape of what is available and how the options stack up, see the [exercise database APIs comparison](/fitness-apis/exercise-database-apis).\n- Weighing free/open replacements for the RapidAPI-hosted ExerciseDB? See [ExerciseDB alternatives](/alternatives/exercisedb-alternatives).\n- Ready to wire one up? The [ExerciseDB API integration guide](/integrate/exercisedb-api) walks through it.\n- For the wider \"is any of this free\" picture, see [free fitness APIs](/fitness-apis/free-fitness-apis) and the [overall fitness API cost breakdown](/pricing/how-much-does-a-fitness-api-cost).\n\n## Honest close\n\nExercise-content pricing is volatile on the paid side and license-gated on the free side. RapidAPI marketplace quotas and prices change without notice, and AGPL obligations depend on how you deploy. Do not treat any quota, tier, or license summary here as final — re-open the live RapidAPI listing, the vendor's pricing page, and the project's own LICENSE file before you build or budget against them.",
    "faqs": [
      {
        "q": "Is there a free exercise database API?",
        "a": "Yes, several. wger (AGPL, self-hosted), exercisedb.dev (AGPL, self-hosted), and free-exercise-db (public domain / Unlicense) are genuinely free for the software or data - you pay only your own hosting. Paid gateways like ExerciseDB on RapidAPI and API Ninjas also offer limited free tiers, but those are freemium hooks that lead to paid, metered plans. Note free-exercise-db is a static dataset, not a live API."
      },
      {
        "q": "How much does ExerciseDB cost?",
        "a": "ExerciseDB is sold through the RapidAPI marketplace on a freemium, tiered model: a free BASIC tier with a hard monthly request cap, then paid tiers, with overage charged per request above quota. The exact caps and prices are set per-API on the RapidAPI listing and change often - as of 2026, verify on the live RapidAPI page rather than relying on any figure quoted elsewhere."
      },
      {
        "q": "What is the AGPL licensing implication for exercise APIs?",
        "a": "wger and exercisedb.dev are licensed under the GNU AGPL, a strong copyleft license with a network-use trigger: running a modified version as a network service can obligate you to release your modifications under the same license. For a closed-source commercial product this is a real architectural and legal consideration. free-exercise-db, by contrast, is public domain (Unlicense) with no obligations. Get any AGPL dependency reviewed before you build on it."
      },
      {
        "q": "Can I use these exercise APIs for a commercial product?",
        "a": "It varies by option and is separate from price. API Ninjas' free tier excludes commercial use - you would need a paid tier. The public-domain free-exercise-db has no restrictions. wger and exercisedb.dev are free to use commercially but carry AGPL copyleft obligations if you distribute or run modified versions. Always check the specific license and terms before shipping."
      },
      {
        "q": "Are the free exercise databases really free?",
        "a": "The software and data are $0, but self-hosting still costs servers, bandwidth, uptime, and the engineering time to parse, normalize, and keep the dataset updated. And AGPL options (wger, exercisedb.dev) carry copyleft obligations. 'Free' here means no license or data fee - not zero total cost. Verify the current license and terms on each project's own repository."
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
    "body": "Are fitness APIs free? The honest answer is: many are — but \"free\" hides three different meanings, and confusing them is how teams blow a budget. The single most useful distinction is between an API that is free to call (no per-request fee paid to the provider), a cost the user carries (they must own the device or hold a membership for their data to exist), and your own cost (infrastructure, storage, approval time). Most first-party wearable APIs — Fitbit, Oura, WHOOP — are free to call. Aggregators are genuinely paid. Nutrition and exercise content APIs are mixed, and a handful are truly free and open. Every specific figure below is volatile as of 2026 — verify current pricing on the provider's own page before you plan around it.\n\n## The three kinds of \"free\"\n\nBefore the categories, fix the vocabulary, because it settles most arguments:\n\n- **Free to call** — you register a developer app and hit the API with no per-request fee to the provider. Fitbit, Oura, and WHOOP work this way.\n- **User-side cost** — the data only exists if your end user owns the device and, increasingly, pays a membership (Oura Membership, WHOOP subscription). For you the developer this is $0; for your product it caps who can actually connect.\n- **Your-side cost** — servers, storage of high-volume wearable history, OAuth token refresh, webhook handling, monitoring, and the engineering time to survive approval queues and API migrations. This is real money even when the API sticker says free.\n\nA \"free to call\" API can still be expensive to ship. Keep these three columns separate on every vendor you evaluate.\n\n## Are fitness APIs free? By category\n\nFitness APIs are not one market. They split into four buckets that price completely differently.\n\n| Category | Free to call? | The catch (as of 2026, verify) |\n| --- | --- | --- |\n| First-party wearable APIs (Fitbit, Oura, WHOOP) | Generally yes — no per-call fee | Gated by approval and/or the user's device/membership; not open self-serve |\n| First-party exceptions (Strava, Garmin) | Not unconditionally | Strava reportedly requires a paid subscription for Standard-tier developers (2026); Garmin is partner-approval-only with terms not publicly listed |\n| Aggregators (Terra, Junction, Rook, Spike) | No — paid | Priced per connected user / per monthly active user (MAU), tiered, enterprise contact-sales |\n| Nutrition / exercise content APIs | Mixed | Freemium/tiered (Nutritionix, Edamam, Spoonacular, ExerciseDB) alongside genuinely free/open options (USDA, Open Food Facts, wger, free-exercise-db) |\n\n### First-party wearable APIs: free to call, but gated\n\nFitbit's Web API has historically been free to call, Oura's Cloud API lists no developer fee, and WHOOP's developer platform has no documented per-call charge. What gates them is not a usage bill but approval and membership. Oura caps a freshly registered app at roughly 10 connected users until you pass its review; WHOOP requires developers to hold a WHOOP membership to build at all; Fitbit is mid-migration to the Google Health API during 2026, and the successor's pricing model is not clearly public yet — verify. Note the Google Health API is a different product from the paid Google Cloud Healthcare API, so don't read the latter's per-request pricing as the former's.\n\n### The first-party exceptions\n\nTwo providers break the \"free to call\" pattern, so don't blanket-state that all wearable APIs are free. Strava reportedly now requires Standard-tier developers to hold a paid Strava subscription (the normal membership, around $11.99/mo in the US and varying by country — verify), effective in mid-2026. Garmin does not publicly list its Health API terms at all; access is partner-approval-only, and third parties report a setup fee and possible commercial licensing that could not be confirmed on a Garmin-owned page — treat as unverified and do not label Garmin \"free.\"\n\n### Aggregators: genuinely paid\n\nIf you want one integration across many devices instead of building each provider yourself, aggregators like Terra, Junction (formerly Vital), Rook, and Spike are where recurring API spend actually accrues. The model is consistent even where the numbers aren't public: you pay per connected user or per MAU, tiered by user count, often with a credit/event layer and an enterprise \"contact sales\" top tier. Specific per-user dollar rates are rarely listed publicly — verify with the vendor. This is the classic build-vs-buy trade: a real recurring fee in exchange for skipping N separate first-party integrations.\n\n### Nutrition and exercise content: mixed, with real free options\n\nContent APIs are the most varied bucket. The commercial ones are freemium or tiered — Nutritionix, Edamam, and Spoonacular for nutrition; ExerciseDB (via RapidAPI) and API Ninjas for exercises — typically a limited free tier that scales into paid plans by volume or features, with metered overages. But genuinely free and open options exist and are worth naming plainly: USDA FoodData Central (public domain, free API key), Open Food Facts (open, no key, ODbL attribution), wger (AGPL, self-host), and free-exercise-db (public domain, static dataset). These cost $0 for the data but shift integration, hosting, and license-compliance work onto you.\n\n## The catch: what to budget for even when it's free\n\nThe provider's price tag is usually the smallest number. What actually adds up:\n\n- **User membership dependency** — if your product relies on Oura or WHOOP data, your addressable market is only users already paying that provider. Free for you, but it shrinks who can connect.\n- **Approval and time-to-market** — Garmin's partner review, Oura's partner tier, and WHOOP's gating cost calendar time, which is a real cost for a roadmap even at $0.\n- **Maintenance and migrations** — APIs deprecate and move. Fitbit's 2026 shift to the Google Health API forces a re-integration; Strava's 2024–2026 changes altered display rules and access economics. Budget engineering time for this every year.\n- **Your infrastructure and storage** — wearable data is continuous and high-volume; storing and re-syncing history is an ongoing bill.\n- **License obligations** — the \"free\" open datasets carry terms: public domain has none, ODbL adds attribution/share-alike, AGPL adds copyleft. These can force architecture or legal work, not just payment.\n- **Compliance** — health data carries privacy and security obligations (consent, deletion, sometimes HIPAA-adjacent scope) regardless of API price.\n\n## Cheaper paths and how it compares\n\nWhich path is cheapest depends on your shape. Few devices, willing to do approvals, engineering to spare → direct first-party APIs (near-zero API fee, high integration and maintenance cost). Many devices, want one integration and a predictable per-MAU budget → an aggregator (real recurring fee, less maintenance). Most teams end up mixing. If you only need workout or food content rather than a specific person's wearable history, the genuinely free and open options often cover it. For the full roundup of no-cost and open choices, see [/fitness-apis/free-fitness-apis](/fitness-apis/free-fitness-apis) — this page won't reproduce it. To compare the landscape and decide which provider fits, see [/fitness-apis](/fitness-apis), and for a structured breakdown of what a build actually runs, see [/pricing/how-much-does-a-fitness-api-cost](/pricing/how-much-does-a-fitness-api-cost).\n\n## The honest close\n\nSo, are fitness APIs free? Many are free to call — most first-party wearable APIs charge no per-request fee — and a few nutrition and exercise datasets are genuinely free and open. But Strava and Garmin break the pattern, aggregators are paid by design, and the costs that actually bite (user memberships, approval time, maintenance, your own infrastructure) sit outside the API sticker. Pricing and access rules for this category changed noticeably in 2026 and vary by country, so verify every specific against the provider's live docs — or a sales conversation — before you build a budget on it.",
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
    "body": "## How much does a fitness API cost?\n\nThere is no single price. The honest answer is that a fitness API's cost is driven by two things: **which pricing model you land in**, and the **hidden costs that usually dwarf the sticker**. Many first-party wearable APIs (Fitbit, Oura, WHOOP) are free to *call* — you pay no per-request fee — while cross-device aggregators charge a recurring per-user fee, and some nutrition and exercise content APIs are freemium or tiered. The cost that most often bites is not the API line item at all: it is your own infrastructure, the engineering time to keep integrations working as providers change, and approval time before you can ship. This page gives you the cost *structure*, not a price list. Every specific figure in this space is volatile — treat anything you read as \"as of 2026, verify current pricing\" and re-open the vendor's own page before you budget against it.\n\n## The four pricing models you will encounter\n\nAlmost every fitness or health-data API fits one of four cost models. Knowing which one you are in tells you far more about your real budget than any single quoted price.\n\n| Pricing model | Typical examples | How the cost works |\n|---|---|---|\n| Free-to-call, approval-gated first-party | Fitbit, Oura, WHOOP (Strava partly) | No per-request API fee. You \"pay\" in approval time, membership gating, and separate per-provider integration work. Each provider is its own build. |\n| First-party with a subscription or licensing wrinkle | Strava (2026 developer-subscription requirement), Garmin (unlisted partner terms) | Cost is conditional and changes — read the current agreement. Some report setup fees or commercial licensing; not publicly listed, so verify directly. |\n| Per-MAU / per-connected-user aggregators | Cross-device aggregators | Priced on active or connected users, tiered by user count, often with a credit or event layer. Enterprise tiers are \"contact sales.\" Predictable to model; scales with your user base. |\n| Tiered / freemium content APIs | Nutrition and exercise-database APIs | A free tier hooks you, then paid tiers scale by request volume or feature. Watch for metered per-request overages and daily quota caps. |\n\nThere is also a genuine fifth option: **free and open self-host**. Public datasets and open-source projects (for example USDA FoodData Central, Open Food Facts, wger, and free-exercise-db) cost nothing for the data or software itself. The trade is that you self-host, self-integrate, and take on licensing obligations that range from none (public domain) through attribution and share-alike (ODbL) to copyleft (AGPL). \"$0 for the data\" still means you pay for the infrastructure and the labor. For a fuller picture of what is truly free, see [are fitness APIs free?](/pricing/are-fitness-apis-free) and the roundup of [free fitness APIs](/fitness-apis/free-fitness-apis).\n\n## The hidden costs that usually exceed the API fee\n\nThe quoted price — even when it is $0 — is rarely the biggest number in your budget. These are the cost drivers that tend to dominate a real health-data product.\n\n| Cost driver | What it depends on |\n|---|---|\n| Infrastructure and hosting | Servers, bandwidth, uptime, and scaling — you pay these even with a \"free\" self-hosted API. |\n| Storage and data volume | Wearable data (per-minute heart rate, sleep, workouts) accumulates fast. Storage, egress, and database cost grow with every monthly active user. |\n| Maintenance and breakage | APIs deprecate and migrate. A provider changing terms or endpoints forces a re-integration — budget engineering time for this every year. |\n| Approval and time-to-market | Partner review, data-use agreements, and compliance sign-off cost calendar time even when the dollar cost is zero. |\n| Metered-overage surprises | Per-request overages and points-based quotas can spike unexpectedly at scale; freemium tiers get you started cheap, then cost climbs with growth. |\n| Licensing and compliance | Attribution and share-alike (ODbL), copyleft with a network-use trigger (AGPL), and usage restrictions (end-user-driven only, no scraping) can force architecture or legal work — not just payment. |\n| Per-user membership dependency | If your product relies on a device whose data requires the user to hold a paid membership, your addressable market is only those paying users. That is a market-size cost, not a line item. |\n| Health-data compliance overhead | Consent, deletion, encryption, and privacy obligations (GDPR, and sometimes HIPAA-adjacent scope) add engineering and legal cost regardless of the API's price. |\n\nThe pattern to internalize: a \"free\" API shifts cost onto your side of the ledger, and a paid API buys some of that cost back. Neither is automatically cheaper — it depends on how many providers you need and how much engineering time you have.\n\n## Build vs buy: the framing that decides your budget\n\nThe core budgeting decision in this space is build-vs-buy, and it comes down to one trade-off: an aggregator's **recurring per-user fee** versus the **labor of building and maintaining N separate first-party integrations** yourself.\n\n- **Direct first-party (build).** Low or zero API fee, but every provider is a separate integration with its own OAuth, approval, and quirks — and every provider change is your maintenance burden. This makes sense when you need only a few devices, are willing to go through approvals, and have engineering time to spare.\n- **Aggregator (buy).** A real recurring fee, priced per connected user or per monthly active user, in exchange for one integration that covers many devices and far lower maintenance. This makes sense when you need broad device coverage, want a single integration, and can model a predictable per-MAU budget.\n\nMost teams end up **mixing** — an aggregator for breadth, plus one or two direct integrations where the economics or data depth justify the extra work. To work through this decision in depth, see [fitness API vs build your own](/fitness-apis/fitness-api-vs-build-your-own), and to understand how the recurring-fee side is priced, see [health data aggregator APIs](/fitness-apis/health-data-aggregator-apis).\n\n## Honest close\n\nThere is no headline number for \"a fitness API,\" and anyone who quotes you one is skipping the parts that actually move your budget: infrastructure, maintenance, approval time, and compliance. Pricing and access terms in this space change often — first-party providers have added subscription requirements and forced migrations within a single year. Model the cost *structure* for your situation, then re-open each vendor's live pricing and terms before you commit real money against them.",
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
  }
];
