/**
 * Pre-flight checklists for gated wearable API programs: what each vendor's
 * own pages say it requires before it grants access, and nothing else.
 * Rendered by components/AccessPreflight on the vendor's /fix/...-approval
 * page where one exists (Garmin), else on its English /integrate page.
 *
 * Hand-sourced, not generated. Every item is a verbatim quote from a vendor
 * page read through a source snapshot on 2026-11-24 (the dev environment
 * cannot reach these hosts): .github/workflows/source-snapshot.yml runs
 * 45496175241 (list "access-preflight") and 45498396105 ("access-preflight-2",
 * the Samsung partnership page and Garmin's page data, which added nothing).
 * Each (url, quote) pair is a row of ops/sources/evidence/tools-access-preflight.json,
 * which source-quotes.yml re-checks against the live page, and
 * scripts/access-preflight.test.mjs fails when an item has no row.
 *
 * Rules:
 *   - Only what the vendor states. A topic with no item renders "Not stated
 *     on the pages read", never a guess, and never what developers report
 *     (that is components/AccessReports).
 *   - `do` is something the vendor says to have or do before or while
 *     applying (a checkbox); `know` is how the vendor says the process works
 *     (no checkbox).
 *   - Nothing here, and nothing the component says, claims that meeting an
 *     item makes approval more likely. Vendor sentences that make that kind of
 *     promise are not quoted.
 */

export type PreflightTopic = "who" | "register" | "describe" | "privacy" | "build" | "agreement" | "process" | "time";

export const PREFLIGHT_TOPICS: { id: PreflightTopic; label: string }[] = [
  { id: "who", label: "Who may apply" },
  { id: "register", label: "Account, app and details to have ready" },
  { id: "describe", label: "What to describe" },
  { id: "privacy", label: "Privacy policy and data protection" },
  { id: "build", label: "What must be built or tested first" },
  { id: "agreement", label: "Agreements and guidelines" },
  { id: "process", label: "How the review works" },
  { id: "time", label: "Stated review time" },
];

export type PreflightItem = {
  /** Stable within the vendor: the key the reader's checkbox is stored under. */
  id: string;
  topic: PreflightTopic;
  kind: "do" | "know";
  /** Our short wording of the requirement. */
  text: string;
  /** Verbatim from `url` (a row of the evidence file). */
  quote: string;
  url: string;
};

export type VendorPreflight = {
  /** The vendor slug used by the access reports (src/lib/accessReportSubmission.mjs). */
  vendor: string;
  name: string;
  /** The program or step the checklist is about. */
  program: string;
  /** The one English page that renders it. */
  page: string;
  checkedOn: string;
  snapshotRun: string;
  items: PreflightItem[];
};

export const PREFLIGHT_CHECKED_ON = "2026-11-24";
const RUN = "45496175241";

const GARMIN_FAQ = "https://developer.garmin.com/gc-developer-program/enterprise/program-faq/";
const GARMIN_OVERVIEW = "https://developer.garmin.com/gc-developer-program/overview/";
const GARMIN_HEALTH = "https://developer.garmin.com/gc-developer-program/enterprise/health-api/";
const WHOOP_APPROVAL = "https://developer.whoop.com/docs/developing/app-approval/";
const WHOOP_START = "https://developer.whoop.com/docs/developing/getting-started/";
const DEXCOM_ACCESS = "https://developer.dexcom.com/docs/dexcom/scopes-access";
const DEXCOM_START = "https://developer.dexcom.com/docs/dexcom/getting-started";
const SAMSUNG_PROCESS = "https://developer.samsung.com/health/data/process.html";
const SAMSUNG_FAQ = "https://developer.samsung.com/health/data/faq.html";
const OURA_DOCS = "https://cloud.ouraring.com/docs/";
const STRAVA_LIMITS = "https://developers.strava.com/docs/rate-limits/";
const STRAVA_START = "https://developers.strava.com/docs/getting-started/";
const STRAVA_POLICY = "https://www.strava.com/legal/api_policy";
const SUUNTO_ZONE = "https://apizone.suunto.com/";
const SUUNTO_FAQ = "https://apizone.suunto.com/faq";
const WAHOO_CLOUD = "https://developers.wahooligan.com/cloud";
const COROS_HELP = "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json";

const vendor = (v: Omit<VendorPreflight, "checkedOn" | "snapshotRun">): VendorPreflight => ({ ...v, checkedOn: PREFLIGHT_CHECKED_ON, snapshotRun: RUN });

export const ACCESS_PREFLIGHT: VendorPreflight[] = [
  vendor({
    vendor: "garmin",
    name: "Garmin",
    program: "the Garmin Connect Developer Program (business access: Starter, then Enterprise)",
    page: "/fix/garmin-api-approval",
    items: [
      {
        id: "who-organizations",
        topic: "who",
        kind: "know",
        text: "Garmin says the program is open to organizations of every size, from individual developers and startups up.",
        quote: "The Garmin Connect Developer Program supports a broad range of organizations, from individual developers and startups to companies operating at significant scale.",
        url: GARMIN_FAQ,
      },
      {
        id: "who-personal",
        topic: "who",
        kind: "know",
        text: "For your own account's data only, Garmin points to the Personal API, set up from the Garmin Connect website, not to this program.",
        quote: "Log in to the Garmin Connect website to retrieve your personal API key and generate access tokens for Garmin Connect API requests.",
        url: GARMIN_OVERVIEW,
      },
      {
        id: "register-apply",
        topic: "register",
        kind: "do",
        text: "Request access to the program, then create an app with Starter Access; Enterprise Access is requested later, from the Developer Portal.",
        quote: "Apply for the Garmin Connect Developer Program and create an app with Starter Access. As your business and integration needs evolve, you can request Enterprise Access through Garmin Developer Portal.",
        url: GARMIN_OVERVIEW,
      },
      {
        id: "build-after-approval",
        topic: "build",
        kind: "know",
        text: "Nothing has to be built first: the evaluation environment for testing the Health API comes after approval.",
        quote: "After approval, you will have access to an evaluation environment to test the Garmin Connect Health API.",
        url: GARMIN_HEALTH,
      },
      {
        id: "process-portal",
        topic: "process",
        kind: "know",
        text: "Once the request is approved, Garmin grants access to the Developer Portal, where the technical documentation is.",
        quote: "After you request access to the Garmin Connect Developer Program and your request has been approved, you will be granted access to the Garmin Developer Portal and can get started on your integration right away.",
        url: GARMIN_FAQ,
      },
      {
        id: "process-integration-time",
        topic: "process",
        kind: "know",
        text: "Garmin gives a time for the integration after approval (one to four weeks), not for the approval itself.",
        quote: "A typical integration takes between 1 and 4 weeks.",
        url: GARMIN_FAQ,
      },
    ],
  }),
  vendor({
    vendor: "whoop",
    name: "WHOOP",
    program: "a higher member tier for a WHOOP app (beyond the 10-member Sandbox)",
    page: "/integrate/whoop-api",
    items: [
      {
        id: "register-team-app",
        topic: "register",
        kind: "do",
        text: "Create a Team and an App in the WHOOP Developer Dashboard.",
        quote: "To create your first App, head to the App creation flow in the Developer Dashboard. You will be prompted to create a Team if you have not yet done so.",
        url: WHOOP_START,
      },
      {
        id: "register-sandbox",
        topic: "register",
        kind: "know",
        text: "Every app starts on Sandbox (up to 10 members), which needs no request.",
        quote: "Every new app starts on the Sandbox tier, which allows up to 10 WHOOP members to connect. You can build and test on Sandbox without submitting a request.",
        url: WHOOP_APPROVAL,
      },
      {
        id: "describe-designs",
        topic: "describe",
        kind: "do",
        text: "Include designs and other context about the app in the request.",
        quote: "Include designs and any other context that helps us understand your app.",
        url: WHOOP_APPROVAL,
      },
      {
        id: "describe-detail",
        topic: "describe",
        kind: "know",
        text: "WHOOP says requests without specific, detailed answers are rejected.",
        quote: "Requests without specific, detailed answers will be rejected.",
        url: WHOOP_APPROVAL,
      },
      {
        id: "privacy-url",
        topic: "privacy",
        kind: "do",
        text: "App name, contact emails and privacy policy URL filled in and accurate in the Developer Dashboard.",
        quote: "make sure your App Name , Contact Email(s) , and Privacy Policy URL are filled in and accurate",
        url: WHOOP_APPROVAL,
      },
      {
        id: "build-tested",
        topic: "build",
        kind: "do",
        text: "The app tested with at least one WHOOP member.",
        quote: "Ensure that you have tested your app with at least one WHOOP member.",
        url: WHOOP_APPROVAL,
      },
      {
        id: "build-half-connected",
        topic: "build",
        kind: "know",
        text: "From Build onward, half of the current tier's member limit must be connected before the next tier can be requested.",
        quote: "From Build onward, moving up requires at least 50% of your current tier's member limit to be connected.",
        url: WHOOP_APPROVAL,
      },
      {
        id: "agreement-terms",
        topic: "agreement",
        kind: "do",
        text: "Read and follow the WHOOP API Terms of Use.",
        quote: "Ensure that you have read, are familiar with, and are abiding by the WHOOP API Terms of Use",
        url: WHOOP_APPROVAL,
      },
      {
        id: "agreement-brand",
        topic: "agreement",
        kind: "do",
        text: "The app follows the WHOOP Design and Brand Guidelines.",
        quote: "Verify your app adheres to the WHOOP Design and Brand Guidelines",
        url: WHOOP_APPROVAL,
      },
      {
        id: "process-one-tier",
        topic: "process",
        kind: "know",
        text: "Tiers are requested one at a time, from the Developer Dashboard.",
        quote: "Tiers are earned one at a time. You can only request the tier directly above your current one.",
        url: WHOOP_APPROVAL,
      },
      {
        id: "process-manual",
        topic: "process",
        kind: "know",
        text: "Requests are reviewed by hand, in the order received.",
        quote: "Requests are reviewed manually, in the order they are received.",
        url: WHOOP_APPROVAL,
      },
      {
        id: "process-no-side-channel",
        topic: "process",
        kind: "know",
        text: "Contacting WHOOP staff about a request outside the Developer Dashboard is prohibited.",
        quote: "Contacting WHOOP employees about your request by personal email, social, or any other channel outside the Developer Dashboard is strictly prohibited and may result in your app being disabled.",
        url: WHOOP_APPROVAL,
      },
    ],
  }),
  vendor({
    vendor: "dexcom",
    name: "Dexcom",
    program: "Limited Access, then Full Access, for a Dexcom API app",
    page: "/integrate/dexcom-api",
    items: [
      {
        id: "who-individual",
        topic: "who",
        kind: "know",
        text: "Individual developers apply for Limited Access from the app's profile.",
        quote: "Individual developer — Apply for Limited Access Upgrade within your app’s profile.",
        url: DEXCOM_ACCESS,
      },
      {
        id: "who-commercial",
        topic: "who",
        kind: "know",
        text: "A commercial app needs a commercial partnership request for production data.",
        quote: "If you have completed testing with Sandbox data, and would like to access production data, you must submit a request for a commercial partnership.",
        url: DEXCOM_ACCESS,
      },
      {
        id: "who-research",
        topic: "who",
        kind: "know",
        text: "Research use goes through Dexcom's research portal instead.",
        quote: "If you are looking to access the Dexcom Web API for research purposes, clinical studies, etc., please visit our research portal",
        url: DEXCOM_ACCESS,
      },
      {
        id: "register-developer",
        topic: "register",
        kind: "do",
        text: "Register as a Dexcom developer (name, email, username, password).",
        quote: "Developer information is collected during the registration process, including name, email, username, password, and acceptance of the Registered Developer Agreement",
        url: DEXCOM_ACCESS,
      },
      {
        id: "describe-app",
        topic: "describe",
        kind: "do",
        text: "A description of the app, written when you create it.",
        quote: "You will need to write a description of your app, and you will have the ability to change that at a later date.",
        url: DEXCOM_START,
      },
      {
        id: "describe-use-case",
        topic: "describe",
        kind: "do",
        text: "A partnership request based on the app's intended use case.",
        quote: "Follow the provided instructions to complete and submit a partnership request based on your application’s intended use case.",
        url: DEXCOM_ACCESS,
      },
      {
        id: "build-sandbox",
        topic: "build",
        kind: "do",
        text: "Testing with sandbox data finished before applying for Limited Access.",
        quote: "When your testing with Sandbox data is completed and your app is ready to test with Dexcom users, apply for Limited Access Upgrade within your app’s profile.",
        url: DEXCOM_ACCESS,
      },
      {
        id: "build-limited-users",
        topic: "build",
        kind: "know",
        text: "Limited Access allows up to 5 authorized users in production.",
        quote: "For the production environment, an app with Limited Access can have up to 5 authorized users.",
        url: DEXCOM_ACCESS,
      },
      {
        id: "build-full-questionnaire",
        topic: "build",
        kind: "do",
        text: "For Full Access, when ready to commercialize: the Full Access Questionnaire.",
        quote: "Complete and submit the Full Access Questionnaire.",
        url: DEXCOM_ACCESS,
      },
      {
        id: "agreement-developer",
        topic: "agreement",
        kind: "do",
        text: "Accept the Registered Developer Agreement at registration.",
        quote: "acceptance of the Registered Developer Agreement",
        url: DEXCOM_ACCESS,
      },
      {
        id: "agreement-data-licensing",
        topic: "agreement",
        kind: "know",
        text: "If authorized, Dexcom sends a standard, non-negotiable Data Licensing Agreement to accept.",
        quote: "If the team decides to authorize your request, you will be sent a standard, non-negotiable Data Licensing Agreement.",
        url: DEXCOM_ACCESS,
      },
      {
        id: "agreement-regulations",
        topic: "agreement",
        kind: "know",
        text: "Regulatory compliance is the developer's responsibility.",
        quote: "Developers are responsible for ensuring that their apps comply with all applicable regulations.",
        url: DEXCOM_ACCESS,
      },
      {
        id: "process-partnerships",
        topic: "process",
        kind: "know",
        text: "Dexcom's Strategic Partnerships team reviews the application.",
        quote: "Dexcom Strategic Partnerships team will review your application and determine if Dexcom would like to proceed with a Digital Health Partnership.",
        url: DEXCOM_ACCESS,
      },
      {
        id: "process-technical-commercial",
        topic: "process",
        kind: "know",
        text: "Full Access adds a technical and commercial review of the app.",
        quote: "Once application is complete, Dexcom will setup a technical and commercial review of your app.",
        url: DEXCOM_ACCESS,
      },
      {
        id: "process-per-app",
        topic: "process",
        kind: "know",
        text: "Each app goes through its own upgrade application.",
        quote: "Each app must undergo its own upgrade application, and each upgrade application is considered independently of any other app owned by that developer.",
        url: DEXCOM_ACCESS,
      },
    ],
  }),
  vendor({
    vendor: "samsung-health",
    name: "Samsung Health",
    program: "a Samsung Health Data SDK partnership request (to distribute an app, or to write data)",
    page: "/integrate/samsung-health-api",
    items: [
      {
        id: "register-package-signature",
        topic: "register",
        kind: "do",
        text: "The app's package name and SHA-256 signing signature, for the partner request.",
        quote: "you must register your app by submitting a partner request and providing the correct package name and SHA-256 signature.",
        url: SAMSUNG_FAQ,
      },
      {
        id: "register-write-code",
        topic: "register",
        kind: "know",
        text: "Writing data to Samsung Health needs an access code, issued after a partnership approval.",
        quote: "To write health data to Samsung Health from an app, the access code is required. You can request partnership and receive the access code after an approval.",
        url: SAMSUNG_PROCESS,
      },
      {
        id: "build-developer-mode",
        topic: "build",
        kind: "know",
        text: "During development the SDK works without registration, in developer mode.",
        quote: "During development, you can use the SDK without registration by enabling the developer mode.",
        url: SAMSUNG_FAQ,
      },
      {
        id: "build-before-distribution",
        topic: "build",
        kind: "do",
        text: "Submit the partner request before distributing the app.",
        quote: "Please submit partner request before your app distribution.",
        url: SAMSUNG_PROCESS,
      },
      {
        id: "process-registered",
        topic: "process",
        kind: "know",
        text: "After approval, Samsung registers the app's package name and signature in its system.",
        quote: "Your app's information including the app package name and signature (SHA-256) will be registered in the Samsung Health's system after an approval.",
        url: SAMSUNG_PROCESS,
      },
    ],
  }),
  vendor({
    vendor: "oura",
    name: "Oura",
    program: "approval of an Oura API application beyond its ten-user limit",
    page: "/integrate/oura-api",
    items: [
      {
        id: "register-account",
        topic: "register",
        kind: "do",
        text: "An Oura account, created in the Oura app, and an API application.",
        quote: "To use the Oura API, you need an Oura account and an API application",
        url: OURA_DOCS,
      },
      {
        id: "describe-name-website",
        topic: "describe",
        kind: "do",
        text: "An application name and a website that describes the integration.",
        quote: "Give your application a name and website that describes your integration.",
        url: OURA_DOCS,
      },
      {
        id: "build-finished",
        topic: "build",
        kind: "do",
        text: "The application finished before it is submitted for review, from its page.",
        quote: "Once you have finished developing your application, you can submit it for review from the application's page.",
        url: OURA_DOCS,
      },
      {
        id: "process-ten-users",
        topic: "process",
        kind: "know",
        text: "Applications are limited to ten users until approved.",
        quote: "By default, API Applications have a ten user limit. If you want to release your application to a wider audience, your application needs to be approved.",
        url: OURA_DOCS,
      },
    ],
  }),
  vendor({
    vendor: "strava",
    name: "Strava",
    program: "the Strava Developer Program review (beyond 10 connected athletes)",
    page: "/integrate/strava-api",
    items: [
      {
        id: "register-subscription",
        topic: "register",
        kind: "do",
        text: "A Strava subscription, which Strava requires to create an app.",
        quote: "A Strava subscription is a prerequisite for creating an app.",
        url: STRAVA_START,
      },
      {
        id: "register-standard-tier",
        topic: "register",
        kind: "know",
        text: "Standard Tier apps keep a subscription requirement (the developer or specified end users).",
        quote: "including a requirement that the developer or specified end users maintain an active Strava subscription",
        url: STRAVA_POLICY,
      },
      {
        id: "describe-screenshots",
        topic: "describe",
        kind: "do",
        text: "The Developer Program form, with screenshots of every place Strava data is shown and of the Connect with Strava button.",
        quote: "Please complete our Developer Program form for review and be sure to include screenshots of all the places Strava data is shown",
        url: STRAVA_LIMITS,
      },
      {
        id: "build-single-player",
        topic: "build",
        kind: "know",
        text: "A new app starts in single-player mode (your own account), then can be raised to 10 athletes from the API Settings Dashboard.",
        quote: "All new applications start in single-player mode. This is the default state where only your own Strava account can authenticate with the app, which lets you build and test your integration against your own data.",
        url: STRAVA_START,
      },
      {
        id: "agreement-api",
        topic: "agreement",
        kind: "do",
        text: "Review the API Agreement (last updated June 1, 2026).",
        quote: "Our API Agreement was last updated June 1, 2026. Please be sure to review this before building your app.",
        url: STRAVA_LIMITS,
      },
      {
        id: "agreement-brand",
        topic: "agreement",
        kind: "do",
        text: "The app complies with Strava's brand guidelines.",
        quote: "All apps have to be in compliance with Strava brand guidelines",
        url: STRAVA_LIMITS,
      },
      {
        id: "process-review",
        topic: "process",
        kind: "know",
        text: "More than 10 connected athletes requires a review.",
        quote: "If you want to scale beyond 10 connected athletes you’ll need to submit your app for review",
        url: STRAVA_LIMITS,
      },
      {
        id: "process-discretion",
        topic: "process",
        kind: "know",
        text: "Admission is at Strava's discretion.",
        quote: "Admission to the Strava Developer Program is at Strava's discretion and is not guaranteed.",
        url: STRAVA_POLICY,
      },
      {
        id: "time-no-sla",
        topic: "time",
        kind: "know",
        text: "Strava commits to no fixed review time.",
        quote: "Strava does not commit to a fixed review-time service-level agreement; you will hear from Strava if you are admitted, or if Strava requires additional information.",
        url: STRAVA_POLICY,
      },
    ],
  }),
  vendor({
    vendor: "suunto",
    name: "Suunto",
    program: "the Suunto API partner program",
    page: "/integrate/suunto-api",
    items: [
      {
        id: "who-companies",
        topic: "who",
        kind: "know",
        text: "Companies and organizations building tools, apps or services for the public; not personal use.",
        quote: "The API will be provided to companies, organizations who are providing tools / apps / services for public audience. We currently don't offer the API access for personal use.",
        url: SUUNTO_ZONE,
      },
      {
        id: "who-client-company",
        topic: "who",
        kind: "know",
        text: "A software agency building for a client: the client company applies and signs the API Agreement.",
        quote: "Please ask your client company to submit the partner program application, so that they can sign the API Agreement.",
        url: SUUNTO_FAQ,
      },
      {
        id: "register-developers",
        topic: "register",
        kind: "do",
        text: "Every developer who needs access listed on the application webform.",
        quote: "Remember to provide all the developers on the webform, as they will be invited to get the access to APIZone.",
        url: SUUNTO_ZONE,
      },
      {
        id: "describe-commercial",
        topic: "describe",
        kind: "do",
        text: "Any marketing or commercial collaboration interests, stated in the application.",
        quote: "Highlight your interests regarding marketing and commercial collaboration as well.",
        url: SUUNTO_ZONE,
      },
      {
        id: "build-production-info",
        topic: "build",
        kind: "do",
        text: "For production: application information submitted on your profile page, then a production API subscription.",
        quote: "When you are ready you need to submit your application information in your profile page. Then subscribe to the production API.",
        url: SUUNTO_ZONE,
      },
      {
        id: "agreement-api",
        topic: "agreement",
        kind: "do",
        text: "Accept the API agreement with the application.",
        quote: "When submitting your application you need to accept the API agreement.",
        url: SUUNTO_ZONE,
      },
      {
        id: "process-criteria",
        topic: "process",
        kind: "know",
        text: "Suunto names examples of what it reviews applicants on: fit to its brand, interest from its customers, innovation.",
        quote: "We are reviewing the applicants based on for example the fit to our brand, interest from our customers and illustration of the innovation mindset",
        url: SUUNTO_ZONE,
      },
      {
        id: "time-weekly",
        topic: "time",
        kind: "know",
        text: "Applications are reviewed weekly, with at most a two-week wait.",
        quote: "The applications are reviewed on weekly bases, so you have to wait few days prior getting the acceptance. There is maximum two week waiting period.",
        url: SUUNTO_ZONE,
      },
    ],
  }),
  vendor({
    vendor: "wahoo",
    name: "Wahoo",
    program: "a Wahoo Cloud API application request",
    page: "/integrate/wahoo-api",
    items: [
      {
        id: "register-two-apps",
        topic: "register",
        kind: "do",
        text: "One application per environment: Sandbox and Production are separate, and a Sandbox app cannot become a Production app.",
        quote: "Sandbox and Production are separate applications. A Sandbox app cannot later be converted into a Production app.",
        url: WAHOO_CLOUD,
      },
      {
        id: "describe-scopes-purpose",
        topic: "describe",
        kind: "do",
        text: "The scopes involved and the purpose of the application.",
        quote: "Wahoo Fitness is currently limiting use of the API to those who request it, as well as provide more information about the scopes involved and the purpose of the application.",
        url: WAHOO_CLOUD,
      },
      {
        id: "process-pending",
        topic: "process",
        kind: "know",
        text: "A submitted request shows as pending approval in the Developer Portal.",
        quote: "When you submit an application request to Wahoo, it will show up on your Developer Portal as pending approval.",
        url: WAHOO_CLOUD,
      },
    ],
  }),
  vendor({
    vendor: "coros",
    name: "COROS",
    program: "COROS Partner API access (multi-user credentials and webhooks)",
    page: "/integrate/coros-api",
    items: [
      {
        id: "who-established",
        topic: "who",
        kind: "do",
        text: "An established platform with a demonstrated user base.",
        quote: "Established platform with demonstrated user base",
        url: COROS_HELP,
      },
      {
        id: "who-company",
        topic: "who",
        kind: "do",
        text: "A registered company, with an authorized technical representative.",
        quote: "Registered company with authorized technical representative",
        url: COROS_HELP,
      },
      {
        id: "who-mcp",
        topic: "who",
        kind: "know",
        text: "A single-user app built on the COROS MCP needs no application.",
        quote: "No application or approval required.",
        url: COROS_HELP,
      },
      {
        id: "register-details",
        topic: "register",
        kind: "do",
        text: "Company details, technical contacts and OAuth 2.0 redirect URIs, sent with the application form.",
        quote: "company details, technical contacts, and OAuth 2.0 redirect URIs",
        url: COROS_HELP,
      },
      {
        id: "privacy-compliance",
        topic: "privacy",
        kind: "do",
        text: "Standard security and data privacy compliance.",
        quote: "Standard security and data privacy compliance",
        url: COROS_HELP,
      },
      {
        id: "agreement-terms",
        topic: "agreement",
        kind: "do",
        text: "Agree to the COROS API Terms of Use.",
        quote: "Agreement to COROS API Terms of Use",
        url: COROS_HELP,
      },
      {
        id: "process-verified",
        topic: "process",
        kind: "know",
        text: "Credentials are issued once identity and security specifications are verified.",
        quote: "Once your identity and security specifications are verified, our team will issue your API Client ID and Secret",
        url: COROS_HELP,
      },
    ],
  }),
];

export const preflightFor = (path: string): VendorPreflight | undefined => ACCESS_PREFLIGHT.find((v) => v.page === path);
