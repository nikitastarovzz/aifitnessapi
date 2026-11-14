/**
 * The openness index behind /openness-index (ops/VIRAL-20-2026-11-06.md
 * item 4): for each wearable and aggregator API the site has read the
 * developer documentation of, eight developer basics and whether that
 * vendor's own pages document each one.
 *
 * Plain ESM with no imports. The page, the badges, the markdown mirror,
 * scripts/openness-index.test.mjs and qa's OPENNESS-* gates all call
 * `deriveOpenness(sources)` with the same source modules, so the test and the
 * gate re-derive exactly what a reader sees.
 *
 * Where the cells come from:
 *   - PKCE and refresh tokens: src/data/oauthVendors.ts (the OAuth
 *     playground's facts, held to ops/sources/evidence/tools-oauth-playground.json).
 *   - Published rate limits: src/lib/rateLimitCalc.mjs (the calculator's
 *     limits and its not-documented list) and, for the Google Health API, the
 *     generated src/data/googleHealthApi.ts.
 *   - Signed webhooks: src/data/webhookPayloads.ts (the webhook library's
 *     signature facts, held to ops/sources/evidence/webhooks.json) and the
 *     check kinds in src/lib/webhookVerifier.mjs.
 *   - Self-serve access, sandbox, public pricing and a disconnect or deletion
 *     call: CURATED below, each a quote copied verbatim from an evidence file
 *     the site already holds (an integration guide's, a pricing page's, the
 *     OAuth playground's) or from the generated Google Health API module.
 *     No new fact is introduced here.
 *   - For a vendor a structured module does not cover (Garmin, COROS,
 *     Concept2 and Terra are not in the OAuth playground; Garmin, COROS,
 *     Dexcom and Concept2 are not in the webhook library), CURATED supplies
 *     the cell, again only from an existing quote. CURATED may not supply a
 *     cell a structured module covers: derive throws, so the build fails.
 *
 * States, and the rule this file keeps:
 *   documented      the vendor's page states the basic is there; counted.
 *   absent          the vendor's page states something else (access needs an
 *                   approval; a shared token instead of a signature). Not
 *                   counted, and shown with the vendor's words.
 *   not-documented  the pages read do not say. Never shown as "no": it is a
 *                   statement about what this site read.
 *   n/a             the basic does not apply to how the API authenticates
 *                   (Terra's server credentials are an API key, not an OAuth
 *                   client). Left out of that vendor's denominator.
 * The score is the plain count of documented cells over applicable ones. No
 * weighting, no rank, no "best".
 */

/** @typedef {{ url: string; quote: string; ev: string }} Src */

export const OPENNESS_PATH = "/openness-index";

export const OPENNESS_CHECKS = [
  {
    id: "self-serve",
    label: "Self-serve start",
    question: "Can a developer create credentials and start building without an application being approved first?",
    rule: "Documented when the vendor's page says you can register an app or client yourself, or that a new app works for a small number of users before review. Absent when the page says access starts with a request the vendor approves.",
    from: "curated",
  },
  {
    id: "sandbox",
    label: "Sandbox or test mode",
    question: "Is there a sandbox, demo user, test environment or development tier?",
    rule: "Documented when the vendor's page names a sandbox, demo user, test or development environment, or a development-only tier.",
    from: "curated",
  },
  {
    id: "pricing",
    label: "Public pricing",
    question: "Does the vendor state on a public page what API access costs, including that it is free?",
    rule: "Documented when a vendor page states a price or states that access is free or at no charge. A page that says terms are tailored, with no number, is not counted.",
    from: "curated",
  },
  {
    id: "rate-limits",
    label: "Published rate limits",
    question: "Does the vendor publish its request limits, or state that there are none?",
    rule: "Read from the rate-limit calculator: documented when it lists at least one limit with its number, or the vendor's statement that the API is not rate limited; not documented when the calculator lists the vendor as publishing no number.",
    from: "rateLimitCalc",
  },
  {
    id: "signed-webhooks",
    label: "Signed webhooks",
    question: "Are webhook requests cryptographically signed, so a receiver can verify the body?",
    rule: "Read from the webhook library: documented when the vendor's scheme is an HMAC the verifier recomputes, or its page says the payload is signed. Absent when the vendor documents a shared token instead, which proves the sender knows a secret but not that the body is untouched.",
    from: "webhookPayloads",
  },
  {
    id: "pkce",
    label: "PKCE",
    question: "Does the OAuth documentation describe PKCE (code_challenge and code_verifier)?",
    rule: "Read from the OAuth playground: documented when PKCE is recommended or supported on the vendor's page.",
    from: "oauthVendors",
  },
  {
    id: "refresh",
    label: "Refresh tokens",
    question: "Is the refresh-token flow documented?",
    rule: "Read from the OAuth playground: documented when the vendor's page describes refreshing (the call, or that refresh tokens rotate). Not applicable when the vendor says access tokens do not expire.",
    from: "oauthVendors",
  },
  {
    id: "disconnect",
    label: "Disconnect or deletion call",
    question: "Is there a documented API call that disconnects a user (revoke, deauthorize, deregister) or deletes their data?",
    rule: "Documented when the vendor's page names an endpoint or API method that revokes a user's authorization, deregisters the user, or deletes their data. A setting the user changes on the vendor's site is not counted.",
    from: "curated",
  },
];

/**
 * A mechanical floor under the curated quotes: a documented cell's quote must
 * contain one of these words, so a quote pasted into the wrong check fails
 * the test and the gate. It does not replace reading the quote.
 */
export const CHECK_WORDS = {
  "self-serve": /\b(creat|register|registration|set up|limit|without|default|cap of|prerequisites|request|approv|appl|review)/i,
  sandbox: /\b(sandbox|demo|test|development|evaluation|single-player|log-dev)/i,
  pricing: /(\$\d|free|no charge|charge|price|pricing)/i,
  "rate-limits": /(limit|requests|calls)/i,
  "signed-webhooks": /(hmac|sign)/i,
  pkce: /(pkce|sha256|code_challenge|verifier)/i,
  refresh: /(refresh)/i,
  disconnect: /(revok|deauthori[sz]e|de-?register|delete|permissions)/i,
};

const EV = {
  oura: "ops/sources/evidence/integrate-oura-api.json",
  ouraPricing: "ops/sources/evidence/pricing-oura-api-pricing.json",
  whoop: "ops/sources/evidence/integrate-whoop-api.json",
  whoopPricing: "ops/sources/evidence/pricing-whoop-api-pricing.json",
  garmin: "ops/sources/evidence/integrate-garmin-api.json",
  garminPricing: "ops/sources/evidence/pricing-garmin-api-pricing.json",
  polar: "ops/sources/evidence/integrate-polar-api.json",
  polarPricing: "ops/sources/evidence/pricing-polar-api-pricing.json",
  withings: "ops/sources/evidence/integrate-withings-api.json",
  withingsPricing: "ops/sources/evidence/pricing-withings-api-pricing.json",
  strava: "ops/sources/evidence/integrate-strava-api.json",
  stravaPricing: "ops/sources/evidence/pricing-strava-api-pricing.json",
  suunto: "ops/sources/evidence/integrate-suunto-api.json",
  suuntoPricing: "ops/sources/evidence/pricing-suunto-api-pricing.json",
  coros: "ops/sources/evidence/integrate-coros-api.json",
  wahoo: "ops/sources/evidence/integrate-wahoo-api.json",
  wahooPricing: "ops/sources/evidence/pricing-wahoo-api-pricing.json",
  dexcom: "ops/sources/evidence/integrate-dexcom-api.json",
  concept2: "ops/sources/evidence/integrate-concept2-api.json",
  terra: "ops/sources/evidence/integrate-terra-api.json",
  oauth: "ops/sources/evidence/tools-oauth-playground.json",
  webhooks: "ops/sources/evidence/webhooks.json",
  ghapi: "src/data/googleHealthApi.ts",
  /* Facts read directly (not through a snapshot) have no evidence file; the
     module that states them is where the quote is checked. */
  oauthModule: "src/data/oauthVendors.ts",
  webhooksModule: "src/data/webhookPayloads.ts",
};

const COROS_ARTICLES = "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json";

/**
 * The vendors, in display order (alphabetical, so the order carries no
 * judgement). `id` matches the vendor's id in the OAuth playground, the
 * webhook library and the rate-limit calculator.
 */
export const OPENNESS_VENDORS = [
  { id: "concept2", name: "Concept2 Logbook", guide: "/integrate/concept2-api", kind: "cloud" },
  { id: "coros", name: "COROS", guide: "/integrate/coros-api", kind: "cloud" },
  { id: "dexcom", name: "Dexcom", guide: "/integrate/dexcom-api", kind: "cloud" },
  { id: "garmin", name: "Garmin", guide: "/integrate/garmin-api", kind: "cloud" },
  { id: "google-health", name: "Google Health API", guide: "/google-health-api", kind: "cloud" },
  { id: "oura", name: "Oura", guide: "/integrate/oura-api", kind: "cloud" },
  { id: "polar", name: "Polar AccessLink", guide: "/integrate/polar-api", kind: "cloud" },
  { id: "strava", name: "Strava", guide: "/integrate/strava-api", kind: "cloud" },
  { id: "suunto", name: "Suunto", guide: "/integrate/suunto-api", kind: "cloud" },
  { id: "terra", name: "Terra", guide: "/integrate/terra-api", kind: "aggregator" },
  { id: "wahoo", name: "Wahoo", guide: "/integrate/wahoo-api", kind: "cloud" },
  { id: "whoop", name: "WHOOP", guide: "/integrate/whoop-api", kind: "cloud" },
  { id: "withings", name: "Withings", guide: "/integrate/withings-api", kind: "cloud" },
];

/** APIs the site covers that are not scored, and why. */
export const OPENNESS_NOT_SCORED = [
  {
    name: "Apple HealthKit, Health Connect and the Samsung Health Data SDK",
    href: "/integrate",
    reason: "On-device frameworks: there is no developer account, request limit, webhook or OAuth client to check.",
  },
  {
    name: "Fitbit Web API",
    href: "/fitbit-api-shutdown",
    reason: "Google set its turn-off for November 2, 2026; its successor, the Google Health API, is scored.",
  },
  {
    name: "ROOK, Junction, Spike, Thryve, Sahha and Open Wearables",
    href: "/pricing/health-data-aggregator-pricing",
    reason: "The site has read their pricing pages but not their developer documentation in the depth the other eight checks need, so a score would measure our reading, not their docs.",
  },
];

/** @type {Record<string, Record<string, { status: string; note: string; src?: Src; caveat?: { text: string; src: Src } }>>} */
export const CURATED = {
  concept2: {
    "self-serve": {
      status: "documented",
      note: "You set up and manage your own client on the API Keys page.",
      src: {
        url: "https://log.concept2.com/developers/home",
        quote: "To use it, you’ll need to set up an API key on the \"API Keys\" page. There, you can set up and manage your own client and get the client information needed to authenticate users using OAuth.",
        ev: EV.concept2,
      },
      caveat: {
        text: "Apps that write data develop on log-dev and need Concept2's approval for the live API.",
        src: {
          url: "https://log.concept2.com/developers/documentation/",
          quote: "If you are writing data to the Logbook, before using the live API, you must first develop against the development server and database on https://log-dev.concept2.com . When ready, please contact Concept2 for approval for the live API.",
          ev: EV.concept2,
        },
      },
    },
    sandbox: {
      status: "documented",
      note: "A development server and database at log-dev.concept2.com.",
      src: {
        url: "https://log.concept2.com/developers/home",
        quote: "Applications requesting write permissions should be set up on log-dev.concept2.com .",
        ev: EV.concept2,
      },
    },
    pricing: { status: "not-documented", note: "The developer pages read state no price." },
    disconnect: {
      status: "documented",
      note: "DELETE on a result deletes that workout.",
      src: { url: "https://log.concept2.com/developers/documentation/", quote: "DELETE api/users/me/results/123 will delete a specific workout", ev: EV.concept2 },
    },
    pkce: { status: "not-documented", note: "Not mentioned on the Logbook API pages read." },
    refresh: {
      status: "documented",
      note: "Every application gets the authorization-code and refresh grants.",
      src: { url: "https://log.concept2.com/developers/documentation/", quote: "All applications have access to the Authorization Code and Refresh grant types.", ev: EV.concept2 },
    },
    "signed-webhooks": {
      status: "not-documented",
      note: "Concept2 has a webhook for results added, updated or deleted; the pages read describe no signature.",
      src: {
        url: "https://log.concept2.com/developers/documentation/",
        quote: "Through your self-service developer portal, you can register and manage a webhook that will fire when a relevant result is added, updated, or deleted.",
        ev: EV.concept2,
      },
    },
  },
  coros: {
    "self-serve": {
      status: "absent",
      note: "Partner API access is by application: a form and an email to COROS.",
      src: { url: COROS_ARTICLES, quote: "To apply, submit your platform details using the form below and email", ev: EV.coros },
      caveat: { text: "COROS lists a registered company among the requirements.", src: { url: COROS_ARTICLES, quote: "Registered company with authorized technical representative", ev: EV.coros } },
    },
    sandbox: { status: "not-documented", note: "The help-center articles read name no sandbox or test environment." },
    pricing: { status: "not-documented", note: "The help-center articles read state no price." },
    disconnect: {
      status: "documented",
      note: "The Partner API lists a deauthorize call.",
      src: { url: COROS_ARTICLES, quote: "OAuth 2.0 (authorize, access token, refresh, deauthorize, bind state)", ev: EV.coros },
    },
    pkce: { status: "not-documented", note: "Not mentioned in the help-center articles read." },
    refresh: {
      status: "documented",
      note: "The Partner API's OAuth 2.0 list includes refresh.",
      src: { url: COROS_ARTICLES, quote: "OAuth 2.0 (authorize, access token, refresh, deauthorize, bind state)", ev: EV.coros },
    },
    "signed-webhooks": { status: "not-documented", note: "COROS lists webhook push in its Partner API but the articles read show no payload or signature." },
  },
  dexcom: {
    "self-serve": {
      status: "documented",
      note: "Registration is free and gives you app credentials.",
      src: { url: "https://developer.dexcom.com/docs/dexcom/scopes-access", quote: "Registration is simple and free, however, and provides access to app credentials and Support Requests .", ev: EV.dexcom },
      caveat: {
        text: "Limited Access covers up to 5 users for testing with real data; more needs Dexcom's review.",
        src: { url: "https://developer.dexcom.com/docs/dexcom/getting-started", quote: "Limited access allows you to authenticate up to 5 users for testing with real data.", ev: EV.dexcom },
      },
    },
    sandbox: {
      status: "documented",
      note: "A sandbox environment at sandbox-api.dexcom.com with sandbox users.",
      src: { url: "https://developer.dexcom.com/docs/dexcom/sandbox-data", quote: "To target the sandbox environment, use https://sandbox-api.dexcom.com as the base URL for requests.", ev: EV.dexcom },
    },
    pricing: {
      status: "not-documented",
      note: "Registration is free; the pages read state no price for full access, which follows a technical and commercial review.",
      src: { url: "https://developer.dexcom.com/docs/dexcom/scopes-access", quote: "Once application is complete, Dexcom will setup a technical and commercial review of your app.", ev: EV.dexcom },
    },
    disconnect: {
      status: "not-documented",
      note: "Users can revoke access on Dexcom.com; the pages read name no API call for it.",
      src: {
        url: "https://developer.dexcom.com/docs/dexcom/authentication",
        quote: "Users can revoke their authorization at any time at Dexcom.com by signing in to their account and changing their authorizations in Permissions.",
        ev: EV.dexcom,
      },
    },
    "signed-webhooks": { status: "not-documented", note: "Dexcom's webhook documentation was not among the pages read." },
  },
  garmin: {
    "self-serve": {
      status: "absent",
      note: "Access starts with a request Garmin approves.",
      src: {
        url: "https://developer.garmin.com/gc-developer-program/enterprise/program-faq/",
        quote: "After you request access to the Garmin Connect Developer Program and your request has been approved, you will be granted access to the Garmin Developer Portal and can get started on your integration right away.",
        ev: EV.garmin,
      },
    },
    sandbox: {
      status: "documented",
      note: "An evaluation environment for testing, after approval.",
      src: {
        url: "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
        quote: "After approval, you will have access to an evaluation environment to test the Garmin Connect Health API.",
        ev: EV.garmin,
      },
    },
    pricing: {
      status: "not-documented",
      note: "Enterprise terms are tailored; the current program pages read state no Starter price.",
      src: {
        url: "https://developer.garmin.com/gc-developer-program/overview/",
        quote: "Designed for companies operating at scale requiring capabilities beyond Starter Access. Available options and commercial terms are tailored based on business and technical requirements.",
        ev: EV.garminPricing,
      },
    },
    disconnect: { status: "not-documented", note: "The program pages read name no deregistration or deletion call." },
    pkce: { status: "not-documented", note: "Garmin's OAuth reference was not among the pages read; the program FAQ says only that the APIs use OAuth 2.0." },
    refresh: { status: "not-documented", note: "Garmin's OAuth reference was not among the pages read." },
    "signed-webhooks": { status: "not-documented", note: "No public Garmin page read shows a push payload or how it is signed." },
  },
  "google-health": {
    "self-serve": {
      status: "documented",
      note: "A new OAuth client works unverified, capped at 100 users.",
      src: {
        url: "https://developers.google.com/health/setup",
        quote: "By default, newly created OAuth clients are in an unverified state with a cap of 100 users for both testing and production purposes.",
        ev: EV.oauthModule,
      },
    },
    sandbox: { status: "not-documented", note: "The unverified state is the same for testing and production; the pages read name no separate sandbox." },
    pricing: { status: "not-documented", note: "The pages read state no price for the API." },
    disconnect: {
      status: "documented",
      note: "batchDelete deletes a user's data points.",
      src: { url: "https://developers.google.com/health/endpoints", quote: "Use the `batchDelete` method to delete an array of a user's Fitbit app data.", ev: EV.ghapi },
    },
  },
  oura: {
    "self-serve": {
      status: "documented",
      note: "A new app works for up to 10 users; Oura's approval is needed beyond that.",
      src: {
        url: "https://cloud.ouraring.com/docs/",
        quote: "By default, API Applications have a ten user limit. If you want to release your application to a wider audience, your application needs to be approved.",
        ev: EV.oura,
      },
    },
    sandbox: {
      status: "documented",
      note: "A sandbox endpoint with fake data for every data type.",
      src: {
        url: "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
        quote: "Fake user data that you can access without an Oura account. There is a corresponding sandbox endpoint to each available data type.",
        ev: EV.oura,
      },
    },
    pricing: {
      status: "documented",
      note: "Free for personal and commercial applications.",
      src: { url: "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json", quote: "Yes, the Oura API is free to use for both personal and commercial applications.", ev: EV.ouraPricing },
    },
    disconnect: {
      status: "documented",
      note: "A token revocation endpoint.",
      src: { url: "https://cloud.ouraring.com/docs/authentication", quote: "https://api.ouraring.com/oauth/revoke?access_token={access_token}", ev: EV.oura },
    },
  },
  polar: {
    "self-serve": {
      status: "documented",
      note: "Any registered Polar Flow user can create an API client.",
      src: {
        url: "https://www.polar.com/accesslink-api/",
        quote: "Any registered Polar Flow user can create API client to AccessLink by filling application details at https://admin.polaraccesslink.com",
        ev: EV.polar,
      },
    },
    sandbox: { status: "not-documented", note: "The AccessLink reference read names no sandbox or test environment." },
    pricing: {
      status: "documented",
      note: "Free of charge at the moment; Polar reserves the right to charge.",
      src: { url: "https://www.polar.com/en/legal/polar-api-agreement", quote: "At the moment Polar offers the use and activation of Polar API's free of charge.", ev: EV.polarPricing },
    },
    disconnect: {
      status: "documented",
      note: "Deregistering a user revokes the token.",
      src: {
        url: "https://www.polar.com/accesslink-api/swagger.yaml",
        quote: "When partner wishes no longer to receive user data, user can be de-registered. This will revoke the access token authorized by user.",
        ev: EV.polar,
      },
    },
  },
  strava: {
    "self-serve": {
      status: "documented",
      note: "Any registered Strava user can create an application.",
      src: {
        url: "https://developers.strava.com/docs/",
        quote: "Any registered Strava user can obtain an access_token by first creating an application at https://www.strava.com/settings/api .",
        ev: EV.strava,
      },
      caveat: {
        text: "Strava calls a Strava subscription a prerequisite for creating an app.",
        src: { url: "https://developers.strava.com/docs/getting-started/", quote: "A Strava subscription is a prerequisite for creating an app.", ev: EV.strava },
      },
    },
    sandbox: {
      status: "documented",
      note: "New apps start in single-player mode, to build and test against your own data.",
      src: {
        url: "https://developers.strava.com/docs/getting-started/",
        quote: "All new applications start in single-player mode. This is the default state where only your own Strava account can authenticate with the app, which lets you build and test your integration against your own data.",
        ev: EV.strava,
      },
    },
    pricing: {
      status: "documented",
      note: "Currently at no charge.",
      src: { url: "https://www.strava.com/legal/api", quote: "Access to and use of the Strava API Materials and the Strava Platform are currently provided at no charge.", ev: EV.stravaPricing },
    },
    disconnect: {
      status: "documented",
      note: "Deauthorizing invalidates every token the app holds for the athlete.",
      src: {
        url: "https://developers.strava.com/docs/authentication/",
        quote: "Applications can revoke access to an athlete’s data. This will invalidate all refresh tokens and access tokens that the application has for the athlete",
        ev: EV.strava,
      },
    },
  },
  suunto: {
    "self-serve": {
      status: "absent",
      note: "Applications are reviewed weekly; the wait is up to two weeks.",
      src: {
        url: "https://apizone.suunto.com/",
        quote: "The applications are reviewed on weekly bases, so you have to wait few days prior getting the acceptance. There is maximum two week waiting period.",
        ev: EV.suunto,
      },
    },
    sandbox: {
      status: "documented",
      note: "A Development API with every endpoint and smaller request limits.",
      src: { url: "https://apizone.suunto.com/", quote: "The Development API includes all the endpoints but has smaller request limits.", ev: EV.suuntoPricing },
    },
    pricing: {
      status: "documented",
      note: "Suunto does not charge for the API.",
      src: { url: "https://apizone.suunto.com/", quote: "We do not charge from the use of the API.", ev: EV.suuntoPricing },
    },
    disconnect: { status: "not-documented", note: "The API Zone pages read name no deauthorization or deletion call." },
  },
  terra: {
    "self-serve": { status: "not-documented", note: "The pages read describe the dashboard's credentials but not whether a new account is reviewed." },
    sandbox: {
      status: "documented",
      note: "Testing and staging environments, each capped at 50 users.",
      src: {
        url: "https://docs.tryterra.co/unified-api/understanding-terra-environments",
        quote: "Testing and staging each have a limit of 50 users.",
        ev: EV.terra,
      },
    },
    pricing: {
      status: "documented",
      note: "Published plans from $399 a month billed annually.",
      src: {
        url: "https://tryterra.co/pricing",
        quote: "Subscriptions start from $399 per month billed annually, or $499 per month billed monthly. That includes 100,000 Unified API credits each month, and you only pay extra if your usage goes beyond them.",
        ev: EV.terra,
      },
    },
    disconnect: {
      status: "not-documented",
      note: "Terra sends a deauth event when a user disconnects; the pages read name no call your app makes for it.",
      src: { url: "https://docs.tryterra.co/reference/health-and-fitness-api/event-types", quote: "deauth Occurs when a user deauthenticates through Terra", ev: EV.terra },
    },
    pkce: {
      status: "n/a",
      note: "Your server calls Terra with a dev-id and an API key; the pages read describe no OAuth client on your side.",
      src: { url: "https://docs.tryterra.co/reference", quote: "For the data APIs, send your developer ID and API key as headers on every request from your server:", ev: EV.terra },
    },
    refresh: {
      status: "n/a",
      note: "Your server calls Terra with a dev-id and an API key; the pages read describe no OAuth client on your side.",
      src: { url: "https://docs.tryterra.co/reference", quote: "For the data APIs, send your developer ID and API key as headers on every request from your server:", ev: EV.terra },
    },
  },
  wahoo: {
    "self-serve": {
      status: "absent",
      note: "Wahoo limits the API to those who request it.",
      src: {
        url: "https://developers.wahooligan.com/cloud",
        quote: "Wahoo Fitness is currently limiting use of the API to those who request it, as well as provide more information about the scopes involved and the purpose of the application.",
        ev: EV.wahoo,
      },
    },
    sandbox: {
      status: "documented",
      note: "Sandbox and Production are separate applications.",
      src: { url: "https://developers.wahooligan.com/cloud", quote: "Sandbox and Production are separate applications. A Sandbox app cannot later be converted into a Production app.", ev: EV.wahoo },
    },
    pricing: {
      status: "documented",
      note: "Currently at no charge; Wahoo reserves the right to charge.",
      src: { url: "https://www.wahoofitness.com/wahoo-api-agreement", quote: "Access to and use of the Wahoo API Materials and Wahoo Platform are currently provided at no charge.", ev: EV.wahooPricing },
    },
    disconnect: {
      status: "documented",
      note: "DELETE /v1/permissions deauthorizes the user.",
      src: { url: "https://cloud-api.wahooligan.com/", quote: "DELETE https://api.wahooligan.com/v1/permissions", ev: EV.wahoo },
    },
  },
  whoop: {
    "self-serve": {
      status: "documented",
      note: "Build and test on the 10-member Sandbox tier without a request.",
      src: {
        url: "https://developer.whoop.com/docs/developing/app-approval/",
        quote: "Every new app starts on the Sandbox tier, which allows up to 10 WHOOP members to connect. You can build and test on Sandbox without submitting a request. When you need more members, request the next tier from the Developer Dashboard .",
        ev: EV.whoop,
      },
      caveat: {
        text: "A WHOOP membership is required to develop an app.",
        src: {
          url: "https://developer.whoop.com/docs/developing/overview/",
          quote: "You must have a WHOOP membership to develop an app on the Developer Platform. Your WHOOP account is also your WHOOP developer login.",
          ev: EV.whoopPricing,
        },
      },
    },
    sandbox: {
      status: "documented",
      note: "Every new app starts on the Sandbox tier.",
      src: { url: "https://developer.whoop.com/docs/developing/app-approval/", quote: "Every new app starts on the Sandbox tier, which allows up to 10 WHOOP members to connect.", ev: EV.whoopPricing },
    },
    pricing: {
      status: "documented",
      note: "Currently at no charge, with notice before that changes.",
      src: {
        url: "https://developer.whoop.com/api-terms-of-use/",
        quote: "Access to and use of the APIs is currently provided at no charge. In the event WHOOP decides to start charging for use of the APIs in the future, WHOOP will provide Company with prior notice.",
        ev: EV.whoopPricing,
      },
    },
    disconnect: {
      status: "documented",
      note: "The revokeUserOauthAccess endpoint.",
      src: { url: "https://developer.whoop.com/docs/developing/oauth/", quote: "To revoke an access token, you can use the revokeUserOauthAccess API endpoint.", ev: EV.whoop },
    },
  },
  withings: {
    "self-serve": {
      status: "documented",
      note: "No prerequisites to get access.",
      src: {
        url: "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/developer-account/create-your-accesses-no-medical-cloud/",
        quote: "There are no prerequisites, and free access is provided.",
        ev: EV.withingsPricing,
      },
    },
    sandbox: {
      status: "documented",
      note: "mode=demo signs in a demo user.",
      src: {
        url: "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/get-access/oauth-authorization-url/",
        quote: "you can use the optional parameter mode with the value demo . You will be redirected to the authorisation page and automatically logged in as a demo user.",
        ev: EV.withings,
      },
    },
    pricing: {
      status: "documented",
      note: "Free access on the public API.",
      src: {
        url: "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/developer-account/create-your-accesses-no-medical-cloud/",
        quote: "There are no prerequisites, and free access is provided.",
        ev: EV.withingsPricing,
      },
      caveat: {
        text: "Withings' developer site, as captured on October 16, 2026, said Withings+ becomes required on the free plan from October 12, 2026.",
        src: {
          url: "https://web.archive.org/web/20261016222934id_/https://developer.withings.com/",
          quote: "Withings+ becomes required on the Start for Free API plan from October 12, 2026.",
          ev: EV.withingsPricing,
        },
      },
    },
    disconnect: { status: "not-documented", note: "The developer-guide pages read name no revoke or deletion call." },
  },
};

/* ---------------------------------------------------------------------- *
 * Derivation
 * ---------------------------------------------------------------------- */

function cell(status, note, src, caveat) {
  const c = { status, note };
  if (src) c.src = src;
  if (caveat) c.caveat = caveat;
  return c;
}

function fmt(n) {
  return n.toLocaleString("en-US");
}

/** Rate limits from the calculator's data (and Google's generated table). */
function rateCell(id, { rateLimits, rateNotDocumented, ghapi }) {
  if (id === "google-health") {
    const row = ghapi.rateLimits.find((r) => r.metric === "Per user (minutely)");
    const url = ghapi.sources.find((s) => s.key === "rateLimits")?.url;
    if (!row || !url) throw new Error("opennessIndex: Google's rate-limit table or its source is gone");
    const parts = ghapi.rateLimits.map((r) => `${r.metric.toLowerCase()}: ${r.defaultLimit}`);
    return cell("documented", `Default quotas, ${parts.join("; ")}.`, { url, quote: row.defaultLimit, ev: EV.ghapi });
  }
  const v = rateLimits.find((x) => x.id === id);
  if (v && v.tiers.length) {
    const first = v.tiers[0];
    const text = first.limits.map((l) => `${fmt(l.max)}${l.perUser ? ` + ${fmt(l.perUser)} per user` : ""} ${l.label}`).join("; ");
    const tiers = v.tiers.length > 1 ? ` (${first.label}; ${v.tiers.length} tiers published)` : "";
    return cell("documented", `${text}${tiers}.`, first.limits[0].src);
  }
  if (v && v.unlimited) return cell("documented", v.unlimited.text, v.unlimited.src);
  const nd = rateNotDocumented.find((x) => x.id === id);
  if (nd) return cell("not-documented", nd.reason, nd.src);
  return null;
}

/** Signed webhooks from the webhook library and the verifier's check kinds. */
function webhookCell(id, { webhooks, webhookSources, verifierKinds }) {
  const w = webhooks.find((x) => x.id === id);
  if (!w) return null;
  const sig = w.signature;
  const s = webhookSources[sig.source];
  const src = { url: s.url, quote: sig.quote, ev: s.via === "direct" ? EV.webhooksModule : EV.webhooks };
  const kind = verifierKinds[id] ?? null;
  if (kind === "hmac" || /\bsign(ed|s|ature)?\b/i.test(sig.quote)) return cell("documented", sig.text, src);
  if (kind === "token") return cell("absent", sig.text, src);
  return cell("not-documented", sig.text, src);
}

/** The OAuth playground's notes say "this tool"; here that is another page. */
const ownWords = (t) => t.replace(/\bthis tool\b/g, "the OAuth playground");

function oauthSrc(oauthSources, source, quote) {
  const s = oauthSources[source];
  return { url: s.url, quote, ev: s.via === "direct" ? EV.oauthModule : EV.oauth };
}

function pkceCell(id, { oauth, oauthSources }) {
  const v = oauth.find((x) => x.id === id);
  if (!v) return null;
  const p = v.pkce;
  if ((p.status === "recommended" || p.status === "supported") && p.quote && p.source) {
    return cell("documented", ownWords(p.text), oauthSrc(oauthSources, p.source, p.quote));
  }
  return cell("not-documented", ownWords(p.text));
}

function refreshCell(id, { oauth, oauthSources }) {
  const v = oauth.find((x) => x.id === id);
  if (!v) return null;
  const r = v.refresh;
  const src = oauthSrc(oauthSources, r.source, r.quote);
  const text = ownWords(r.text);
  if (r.curl || r.rotates !== null) return cell("documented", text, src);
  if (/\bnot expire\b/i.test(r.quote)) return cell("n/a", text, src);
  return cell("not-documented", text, src);
}

const DERIVED = {
  "rate-limits": rateCell,
  "signed-webhooks": webhookCell,
  pkce: pkceCell,
  refresh: refreshCell,
};

/**
 * Every vendor with its eight cells and score.
 *
 * @param {{
 *   oauth: any[]; oauthSources: Record<string, { url: string }>;
 *   webhooks: any[]; webhookSources: Record<string, { url: string }>;
 *   verifierKinds: Record<string, string>;
 *   rateLimits: any[]; rateNotDocumented: any[];
 *   ghapi: { rateLimits: { metric: string; defaultLimit: string }[]; sources: { key: string; url: string }[] };
 * }} sources
 */
export function deriveOpenness(sources) {
  return OPENNESS_VENDORS.map((v) => {
    const curated = CURATED[v.id] ?? {};
    const cells = {};
    for (const c of OPENNESS_CHECKS) {
      const derive = DERIVED[c.id];
      const derived = derive ? derive(v.id, sources) : null;
      if (derived && curated[c.id]) {
        throw new Error(`opennessIndex: ${v.id} × ${c.id} is covered by ${c.from}; remove the curated cell`);
      }
      cells[c.id] = derived ?? curated[c.id] ?? cell("not-documented", "Not stated on the pages read.");
    }
    for (const k of Object.keys(curated)) {
      if (!OPENNESS_CHECKS.some((c) => c.id === k)) throw new Error(`opennessIndex: ${v.id} has a curated cell for unknown check ${k}`);
    }
    const score = opennessScore(cells);
    return { ...v, cells, ...score };
  });
}

/** The plain count: documented cells over the cells that apply. */
export function opennessScore(cells) {
  const all = Object.values(cells);
  const applicable = all.filter((c) => c.status !== "n/a").length;
  const documented = all.filter((c) => c.status === "documented").length;
  return { documented, applicable };
}

/** "6/8 documented" — the exact text the badge and the page show. */
export function scoreText({ documented, applicable }) {
  return `${documented}/${applicable} documented`;
}

export const STATUS_LABEL = {
  documented: "Documented",
  absent: "The docs say otherwise",
  "not-documented": "Not documented in the pages read",
  "n/a": "Not applicable",
};

/** Every { url, quote, ev } a derived index cites, with where it sits. */
export function opennessSources(vendors) {
  const out = [];
  for (const v of vendors)
    for (const [k, c] of Object.entries(v.cells)) {
      if (c.src) out.push({ at: `${v.id}.${k}`, src: c.src, status: c.status, check: k });
      if (c.caveat) out.push({ at: `${v.id}.${k}.caveat`, src: c.caveat.src, status: "caveat", check: k });
    }
  return out;
}

/** The anchor of a vendor's section and of one of its cells. */
export const vendorAnchor = (id) => `openness-${id}`;
export const cellAnchor = (id, check) => `openness-${id}-${check}`;
