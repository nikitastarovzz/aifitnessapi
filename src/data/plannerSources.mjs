/**
 * The quoted rules behind the three planning tools (ops/AUDIENCE-30-2026-11-05.md
 * items 17–20): /tools/build-plan (with its PRD template), /tools/store-submission-checklist
 * and /tools/compliance-wizard.
 *
 * Hand-written, and every rule statement in it is a verbatim `quote` from a
 * primary source with its `url`. The tools add no rule of their own: they
 * decide which quoted rule to show for a reader's answers, and they say which
 * page on this site explains it. The logic that decides is in
 * src/lib/plannerLogic.mjs and is tested by scripts/planner-tools.test.mjs.
 *
 * Where each quote was read:
 *
 *  - Apple's App Review Guidelines and its docs JSON, Google Play's policy
 *    help pages (support.google.com, ?hl=en) and developer.android.com were
 *    fetched directly from the build environment on 2026-11-05.
 *  - HHS, the FTC, the eCFR, legislation.gov.uk, Washington's legislature and
 *    Attorney General and the FDA are blocked from that environment. Their
 *    quotes are reused, word for word, from the evidence files of this site's
 *    /compliance pages (ops/sources/evidence/compliance-*.json), which
 *    .github/workflows/source-quotes.yml re-checks against the live sources
 *    every week. EUR-Lex itself could not be reached; the GDPR text is the
 *    as-adopted Regulation (EU) 2016/679 on legislation.gov.uk, which those
 *    evidence files already cite.
 *
 * qa's PLANNER-QUOTE gate holds every quote here to an evidence file row
 * with the same url and the same passage (ops/sources/evidence/tools-*.json),
 * so the weekly source-quotes run covers these tools too.
 */

/** When each group of sources was read. */
export const PLANNER_READ_ON = "2026-11-05";

/** @type {Record<string, { url: string; title: string; publisher: string; note?: string }>} */
export const PLANNER_SOURCES = {
  appReview: {
    url: "https://developer.apple.com/app-store/review/guidelines/",
    title: "App Review Guidelines",
    publisher: "Apple",
    note: "Last Updated: October 16, 2026",
  },
  hkAuthStatus: {
    url: "https://developer.apple.com/tutorials/data/documentation/healthkit/hkhealthstore/authorizationstatus(for:).json",
    title: "authorizationStatus(for:)",
    publisher: "Apple",
  },
  playHealth: {
    url: "https://support.google.com/googleplay/android-developer/answer/16679511?hl=en",
    title: "Health Content and Services",
    publisher: "Google Play",
  },
  playHealthCategories: {
    url: "https://support.google.com/googleplay/android-developer/answer/13996367?hl=en",
    title: "Health app categories and additional information",
    publisher: "Google Play",
  },
  playPermissions: {
    url: "https://support.google.com/googleplay/android-developer/answer/16558241?hl=en",
    title: "Permissions and APIs that Access Sensitive Information (Health Connect by Android Permissions)",
    publisher: "Google Play",
  },
  playUserData: {
    url: "https://support.google.com/googleplay/android-developer/answer/10144311?hl=en",
    title: "User Data",
    publisher: "Google Play",
  },
  hcPublish: {
    url: "https://developer.android.com/health-and-fitness/health-connect/publish?hl=en",
    title: "Publish your health app on Google Play",
    publisher: "Android Developers",
  },
  hcRead: {
    url: "https://developer.android.com/health-and-fitness/health-connect/read-data?hl=en",
    title: "Read raw data (Health Connect)",
    publisher: "Android Developers",
  },
  hcSync: {
    url: "https://developer.android.com/health-and-fitness/health-connect/sync-data?hl=en",
    title: "Synchronize data (Health Connect)",
    publisher: "Android Developers",
  },
  fitMigration: {
    url: "https://developer.android.com/health-and-fitness/health-connect/migration/fit?hl=en",
    title: "Google Fit migration guide",
    publisher: "Android Developers",
  },
  ftcTool: {
    url: "https://www.ftc.gov/business-guidance/resources/mobile-health-apps-interactive-tool",
    title: "Mobile Health Apps Interactive Tool",
    publisher: "FTC",
  },
  ftcHipaaClaims: {
    url: "https://www.ftc.gov/business-guidance/resources/collecting-using-or-sharing-consumer-health-information-look-hipaa-ftc-act-health-breach",
    title: "Collecting, Using, or Sharing Consumer Health Information? Look to HIPAA, the FTC Act, and the Health Breach Notification Rule",
    publisher: "FTC",
  },
  ftcHbnrGuide: {
    url: "https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0",
    title: "Complying with FTC's Health Breach Notification Rule",
    publisher: "FTC",
  },
  cfr318: {
    url: "https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-16?part=318",
    title: "16 CFR Part 318, Health Breach Notification Rule",
    publisher: "eCFR",
  },
  cfr160: {
    url: "https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-45?part=160&section=160.103",
    title: "45 CFR 160.103, Definitions",
    publisher: "eCFR",
  },
  hhsCovered: {
    url: "https://web.archive.org/web/20261028163611/https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html",
    title: "Covered Entities and Business Associates (archived copy)",
    publisher: "HHS",
  },
  hhsBa: {
    url: "https://web.archive.org/web/20261026014247/https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html",
    title: "Business Associates (archived copy)",
    publisher: "HHS",
  },
  gdprArt9: {
    url: "https://www.legislation.gov.uk/eur/2016/679/article/9/adopted",
    title: "Regulation (EU) 2016/679, Article 9 (as adopted)",
    publisher: "legislation.gov.uk",
  },
  gdprArt4: {
    url: "https://www.legislation.gov.uk/eur/2016/679/article/4/adopted",
    title: "Regulation (EU) 2016/679, Article 4 (as adopted)",
    publisher: "legislation.gov.uk",
  },
  waRcw: {
    url: "https://app.leg.wa.gov/RCW/default.aspx?cite=19.373&full=true",
    title: "RCW 19.373, Washington My Health My Data Act",
    publisher: "Washington State Legislature",
  },
  waAg: {
    url: "https://www.atg.wa.gov/protecting-washingtonians-personal-health-data-and-privacy",
    title: "Protecting Washingtonians' Personal Health Data and Privacy",
    publisher: "Washington State Attorney General",
  },
  fdaWellness: {
    url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices",
    title: "General Wellness: Policy for Low Risk Devices",
    publisher: "FDA",
  },
};

/**
 * Traits a reader's answers switch on. A store item, compliance statement or
 * edge case with `when` shows only when at least one of its traits is on;
 * one without `when` always shows for its store.
 */
export const PLANNER_TRAITS = {
  healthkit: "Reads or writes Apple HealthKit",
  "health-connect": "Reads or writes Android Health Connect",
  accounts: "Lets people create an account",
  medical: "Makes medical claims, or is regulated as a medical device",
  research: "Runs health research with human subjects",
  ads: "Shows ads or shares data with advertising partners",
  camera: "Uses the camera or other device sensors for a health function",
  hardware: "Needs an external device (a wearable, scale or monitor) for its health function",
  "live-coaching": "Sells live coaching sessions",
  kids: "Is aimed at children",
  clinical: "Provides or bills regulated clinical services",
  "third-party-ai": "Sends personal data to a third-party AI service",
};

/**
 * @typedef {{ id: string; store: "apple" | "google"; section: string; title: string; quote: string; source: string; when?: string[]; page?: string }} StoreItem
 */

/**
 * The store-submission checklist. `title` is our one-line imperative; `quote`
 * is the store's own sentence; `section` is where it sits in the source.
 * @type {StoreItem[]}
 */
export const STORE_ITEMS = [
  // ── Apple: App Review Guidelines ──────────────────────────────────────
  {
    id: "apple-privacy-policy-link",
    store: "apple",
    section: "5.1.1(i)",
    title: "Link the privacy policy in App Store Connect and inside the app",
    quote: "All apps must include a link to their privacy policy in the App Store Connect metadata field and within the app in an easily accessible manner.",
    source: "appReview",
    page: "/compliance/app-store-guideline-5-1-1-data-collection-storage",
  },
  {
    id: "apple-privacy-policy-retention",
    store: "apple",
    section: "5.1.1(i)",
    title: "Say in the policy how long you keep data and how users revoke consent or delete it",
    quote: "Explain its data retention/deletion policies and describe how a user can revoke consent and/or request deletion of the user’s data.",
    source: "appReview",
    page: "/compliance/health-data-retention-deletion",
  },
  {
    id: "apple-consent",
    store: "apple",
    section: "5.1.1(ii)",
    title: "Get consent before collecting user or usage data",
    quote: "Apps that collect user or usage data must secure user consent for the collection, even if such data is considered to be anonymous at the time of or immediately following collection.",
    source: "appReview",
    page: "/compliance/health-data-user-consent",
  },
  {
    id: "apple-purpose-strings",
    store: "apple",
    section: "5.1.1(ii)",
    title: "Write purpose strings that describe the whole use of the data",
    quote: "Ensure your purpose strings clearly and completely describe your use of the data.",
    source: "appReview",
    page: "/integrate/healthkit",
  },
  {
    id: "apple-data-minimization",
    store: "apple",
    section: "5.1.1(iii)",
    title: "Request only the data types the core features use",
    quote: "Apps should only request access to data relevant to the core functionality of the app and should only collect and use data that is required to accomplish the relevant task.",
    source: "appReview",
    page: "/compliance/app-store-guideline-5-1-1-data-collection-storage",
  },
  {
    id: "apple-account-deletion",
    store: "apple",
    section: "5.1.1(v)",
    title: "Offer account deletion inside the app",
    quote: "If your app supports account creation, you must also offer account deletion within the app",
    source: "appReview",
    when: ["accounts"],
    page: "/compliance/health-data-retention-deletion",
  },
  {
    id: "apple-legal-entity",
    store: "apple",
    section: "5.1.1(ix)",
    title: "Submit as the legal entity that provides a regulated healthcare service",
    quote: "Apps that provide services in highly regulated fields (such as banking and financial services, healthcare, gambling, legal cannabis use, air travel and crypto exchanges) or that require sensitive user information should be submitted by a legal entity that provides the services, and not by an individual developer.",
    source: "appReview",
    when: ["clinical", "medical"],
    page: "/compliance/app-store-health-data-rules",
  },
  {
    id: "apple-third-party-ai",
    store: "apple",
    section: "5.1.2(i)",
    title: "Disclose and get explicit permission before sharing personal data with a third-party AI",
    quote: "You must clearly disclose where personal data will be shared with third parties, including with third-party AI, and obtain explicit permission before doing so.",
    source: "appReview",
    when: ["third-party-ai"],
    page: "/compliance/app-store-guideline-5-1-2-data-use-sharing",
  },
  {
    id: "apple-healthkit-no-marketing",
    store: "apple",
    section: "5.1.2(vi)",
    title: "Keep HealthKit and camera-derived data out of marketing, advertising and data mining",
    quote: "Data gathered from the HomeKit API, HealthKit, Clinical Health Records API, MovementDisorder APIs, ClassKit or from depth and/or facial mapping tools (such as ARKit, Camera APIs, or Photo APIs) may not be used for marketing, advertising or use-based data mining, including by third parties.",
    source: "appReview",
    when: ["healthkit", "camera"],
    page: "/compliance/app-store-guideline-5-1-2-data-use-sharing",
  },
  {
    id: "apple-health-data-use",
    store: "apple",
    section: "5.1.3(i)",
    title: "Use health and fitness data only to improve health management or for permitted research",
    quote: "Apps may not use or disclose to third parties data gathered in the health, fitness, and medical research context—including from the Clinical Health Records API, HealthKit API, Motion and Fitness, MovementDisorder APIs, or health-related human subject research—for advertising, marketing, or other use-based data mining purposes other than improving health management, or for the purpose of health research, and then only with permission.",
    source: "appReview",
    page: "/compliance/app-store-guideline-5-1-3-health-research",
  },
  {
    id: "apple-disclose-health-data",
    store: "apple",
    section: "5.1.3(i)",
    title: "Disclose the specific health data you collect from the device",
    quote: "You must disclose the specific health data that you are collecting from the device.",
    source: "appReview",
    page: "/compliance/app-store-guideline-5-1-3-health-research",
  },
  {
    id: "apple-no-false-data-icloud",
    store: "apple",
    section: "5.1.3(ii)",
    title: "Never write false data to HealthKit, and keep personal health information out of iCloud",
    quote: "Apps must not write false or inaccurate data into HealthKit or any other medical research or health management apps, and may not store personal health information in iCloud.",
    source: "appReview",
    when: ["healthkit"],
    page: "/compliance/app-store-guideline-5-1-3-health-research",
  },
  {
    id: "apple-research-consent",
    store: "apple",
    section: "5.1.3(iii)",
    title: "Get research consent that covers the five points Apple lists",
    quote: "Apps conducting health-related human subject research must obtain consent from participants or, in the case of minors, their parent or guardian.",
    source: "appReview",
    when: ["research"],
    page: "/compliance/app-store-guideline-5-1-3-health-research",
  },
  {
    id: "apple-research-ethics-board",
    store: "apple",
    section: "5.1.3(iv)",
    title: "Have ethics review board approval ready to show",
    quote: "Apps conducting health-related human subject research must secure approval from an independent ethics review board. Proof of such approval must be provided upon request.",
    source: "appReview",
    when: ["research"],
    page: "/compliance/app-store-guideline-5-1-3-health-research",
  },
  {
    id: "apple-healthkit-purpose",
    store: "apple",
    section: "2.5.1",
    title: "Use HealthKit for health and fitness, integrated with the Health app, and say so in the description",
    quote: "Apps should use APIs and frameworks for their intended purposes and indicate that integration in their app description. For example, the HomeKit framework should provide home automation services; and HealthKit should be used for health and fitness purposes and integrate with the Health app.",
    source: "appReview",
    when: ["healthkit"],
    page: "/compliance/app-store-guideline-2-5-1-healthkit-software-requirements",
  },
  {
    id: "apple-accuracy-claims",
    store: "apple",
    section: "1.4.1",
    title: "Back every health-measurement accuracy claim with data and methodology",
    quote: "Apps must clearly disclose data and methodology to support accuracy claims relating to health measurements, and if the level of accuracy or methodology cannot be validated, we will reject your app.",
    source: "appReview",
    when: ["medical", "camera", "hardware"],
    page: "/compliance/app-store-guideline-1-4-1-physical-harm",
  },
  {
    id: "apple-check-with-doctor",
    store: "apple",
    section: "1.4.1",
    title: "Remind users to check with a doctor before medical decisions",
    quote: "Apps should remind users to check with a doctor in addition to using the app and before making medical decisions.",
    source: "appReview",
    when: ["medical"],
    page: "/compliance/app-store-guideline-1-4-1-physical-harm",
  },
  {
    id: "apple-regulatory-clearance",
    store: "apple",
    section: "1.4.1",
    title: "Attach your regulatory clearance documentation, if you have one",
    quote: "If your medical app has received regulatory clearance, please submit a link to that documentation with your app.",
    source: "appReview",
    when: ["medical"],
    page: "/compliance/fda-fitness-app-regulation",
  },
  {
    id: "apple-no-health-ad-targeting",
    store: "apple",
    section: "2.5.18",
    title: "No targeted or behavioral ads based on health data",
    quote: "may not engage in targeted or behavioral advertising based on sensitive user data such as health/medical data (such as from the HealthKit APIs)",
    source: "appReview",
    when: ["ads"],
    page: "/compliance/app-store-health-data-rules",
  },
  {
    id: "apple-person-to-person",
    store: "apple",
    section: "3.1.3(d)",
    title: "One-to-one live training may skip in-app purchase; group live sessions may not",
    quote: "One-to-few and one-to-many real-time services must use in-app purchase.",
    source: "appReview",
    when: ["live-coaching"],
    page: "/compliance/app-store-guideline-3-1-3-d-person-to-person-fitness",
  },

  // ── Google Play: Health Content and Services, User Data, Health Connect ─
  {
    id: "google-health-declaration",
    store: "google",
    section: "Health apps: Console Declaration",
    title: "Complete the Health apps declaration in Play Console",
    quote: "All developers must complete the Health apps declaration form on the App content page",
    source: "playHealth",
    page: "/compliance/google-play-health-connect-publishing-requirements",
  },
  {
    id: "google-health-scope",
    store: "google",
    section: "Health apps: Privacy Policy and Prominent Disclosure",
    title: "Treat the app as a health app even if health is not its main purpose",
    quote: "If your app is not primarily a health app, but has health-related features and accesses health data, it is still in scope of the Health App policy.",
    source: "playHealth",
    page: "/compliance/google-play-health-data-policy",
  },
  {
    id: "google-privacy-policy",
    store: "google",
    section: "Health apps: Privacy Policy and Prominent Disclosure",
    title: "Put the privacy policy link in Play Console and inside the app",
    quote: "Your app must post a privacy policy link in the designated field within Play Console, and a privacy policy link or text within the app itself.",
    source: "playHealth",
    page: "/compliance/health-app-privacy-policy",
  },
  {
    id: "google-privacy-policy-url",
    store: "google",
    section: "Health apps: Privacy Policy and Prominent Disclosure",
    title: "Host the policy at a public, non-geofenced URL, not a PDF",
    quote: "Please make sure your privacy policy is available on an active, publicly accessible and non-geofenced URL (no PDFs) and is non-editable",
    source: "playHealth",
    page: "/compliance/health-app-privacy-policy",
  },
  {
    id: "google-unused-permissions",
    store: "google",
    section: "Health apps: Privacy Policy and Prominent Disclosure",
    title: "Remove every permission the core function does not need",
    quote: "Permissions that are not required for a health app to perform its core functionality should not be requested and unused permissions must be removed.",
    source: "playHealth",
    page: "/compliance/google-play-health-data-policy",
  },
  {
    id: "google-prominent-disclosure",
    store: "google",
    section: "What permissions are in scope of the health apps policy?",
    title: "Show a prominent disclosure and get affirmative consent for in-scope permissions (activity recognition, body sensors, Bluetooth, camera, location and others)",
    quote: "If your app requires any of these permissions, it must prominently disclose how user data will be used, describe the type of data being accessed, and have the user provide affirmative consent for such use.",
    source: "playHealthCategories",
    page: "/compliance/health-data-user-consent",
  },
  {
    id: "google-external-hardware",
    store: "google",
    section: "Health apps: Health and Medical Functionalities",
    title: "If a medical function needs external hardware, say so in the description",
    quote: "Apps that connect to external hardware or devices (e.g., blood glucose monitors) to perform their medical function, must clearly disclose these external hardware requirements in the app description.",
    source: "playHealth",
    when: ["medical"],
    page: "/compliance/remote-patient-monitoring-device-requirements",
  },
  {
    id: "google-device-compatibility",
    store: "google",
    section: "Health apps: Health and Medical Functionalities",
    title: "List device compatibility for health functions that use the camera or other sensors",
    quote: "Apps that use device sensors (e.g., camera) for health functions must clearly state device compatibility information in the app description.",
    source: "playHealth",
    when: ["camera"],
    page: "/compliance/google-play-health-data-policy",
  },
  {
    id: "google-medical-device",
    store: "google",
    section: "Health apps: Health and Medical Functionalities",
    title: "Declare a regulated medical device, and have proof of clearance ready",
    quote: "Apps that are regulated as a medical device must provide proof of approval, clearance or certification by the relevant authority upon request.",
    source: "playHealth",
    when: ["medical"],
    page: "/compliance/fda-fitness-app-regulation",
  },
  {
    id: "google-not-a-medical-device",
    store: "google",
    section: "Health apps: Health and Medical Functionalities",
    title: "Otherwise, carry the not-a-medical-device disclaimer in the description",
    quote: "Other health and medical apps must include a clear disclaimer in their app description indicating that the app is “not a medical device and does not diagnose, treat, cure, or prevent any medical condition.”",
    source: "playHealth",
    page: "/compliance/fda-fitness-app-regulation",
  },
  {
    id: "google-consult-professional",
    store: "google",
    section: "Health apps: Health and Medical Functionalities",
    title: "Remind users to consult a healthcare professional",
    quote: "Apps must also remind users to consult a healthcare professional for medical advice, diagnosis, or treatment.",
    source: "playHealth",
    page: "/compliance/google-play-health-data-policy",
  },
  {
    id: "google-research-irb",
    store: "google",
    section: "Health apps: Additional requirements",
    title: "Get informed consent and IRB or ethics approval for health research",
    quote: "Health Research apps should also secure approval from an Institutional Review Board (IRB) and/or equivalent independent ethics committee unless otherwise exempt.",
    source: "playHealth",
    when: ["research"],
    page: "/compliance/app-store-guideline-5-1-3-health-research",
  },
  {
    id: "google-clinical-billing",
    store: "google",
    section: "Payments - Clinical Services",
    title: "Do not bill regulated clinical services through Play billing",
    quote: "Transactions involving regulated clinical services should not use Google Play’s billing system.",
    source: "playHealth",
    when: ["clinical"],
    page: "/compliance/remote-patient-monitoring-device-requirements",
  },
  {
    id: "google-no-sale",
    store: "google",
    section: "User Data",
    title: "Never sell personal and sensitive user data",
    quote: "Not sell personal and sensitive user data.",
    source: "playUserData",
    page: "/compliance/google-play-health-data-policy",
  },
  {
    id: "google-account-deletion",
    store: "google",
    section: "User Data",
    title: "Offer a way to delete the account and its data",
    quote: "Additionally, you must offer users a way to delete their accounts and associated data.",
    source: "playUserData",
    when: ["accounts"],
    page: "/compliance/health-data-retention-deletion",
  },
  {
    id: "google-publish-steps",
    store: "google",
    section: "Health Connect: publish guide",
    title: "Complete the required Play Console steps: policies, Data safety, Health apps declaration",
    quote: "To get your health app published on Google Play, you must complete a few required steps in the Play Console.",
    source: "hcPublish",
    when: ["health-connect"],
    page: "/compliance/google-play-health-connect-publishing-requirements",
  },
  {
    id: "google-data-safety",
    store: "google",
    section: "Health Connect: publish guide",
    title: "Fill in the Data safety section",
    quote: "As part of your app publishing process, you must provide information for Google Play's Data safety section",
    source: "hcPublish",
    page: "/compliance/google-play-health-data-policy",
  },
  {
    id: "google-hc-redeclare",
    store: "google",
    section: "Health Connect: publish guide",
    title: "Declare the Health Connect data types again whenever the set changes",
    quote: "This process must be completed for all publishing requests, both for a new app that has not been published yet, or when updating an existing, already published app that now uses a different set of data types.",
    source: "hcPublish",
    when: ["health-connect"],
    page: "/compliance/google-play-health-connect-publishing-requirements",
  },
  {
    id: "google-hc-same-policy",
    store: "google",
    section: "Health Connect: publish guide",
    title: "Use the same privacy policy on the Play listing and in Health Connect",
    quote: "This must be the same privacy policy that is displayed to users when they click the privacy policy link in Health Connect",
    source: "hcPublish",
    when: ["health-connect"],
    page: "/compliance/google-play-health-connect-publishing-requirements",
  },
  {
    id: "google-hc-use-cases",
    store: "google",
    section: "Health Connect: Appropriate Access",
    title: "Fit one of Health Connect's approved use cases",
    quote: "Approved use cases include: fitness and wellness, rewards, fitness coaching, corporate wellness, medical care, health research, and games.",
    source: "playPermissions",
    when: ["health-connect"],
    page: "/compliance/google-play-health-data-policy",
  },
  {
    id: "google-hc-minimum-scope",
    store: "google",
    section: "Health Connect: Minimum Scope",
    title: "Request only the Health Connect permissions your features need",
    quote: "You must only request access to the permissions that are necessary to implementing your product's features or services.",
    source: "playPermissions",
    when: ["health-connect"],
    page: "/compliance/google-play-health-connect-publishing-requirements",
  },
  {
    id: "google-hc-no-ads",
    store: "google",
    section: "Health Connect: Limited Use",
    title: "Never use Health Connect data to serve ads",
    quote: "Transferring, selling, or using user data for serving ads, including personalized or interest-based advertising.",
    source: "playPermissions",
    when: ["health-connect"],
    page: "/compliance/google-play-health-data-policy",
  },
  {
    id: "google-hc-no-brokers",
    store: "google",
    section: "Health Connect: Limited Use",
    title: "Never transfer or sell Health Connect data to ad platforms or data brokers",
    quote: "Transferring or selling user data to third parties like advertising platforms, data brokers, or any information resellers.",
    source: "playPermissions",
    when: ["health-connect"],
    page: "/compliance/google-play-health-data-policy",
  },
  {
    id: "google-hc-no-headless",
    store: "google",
    section: "Health Connect: Appropriate Access",
    title: "No headless apps: the app needs a visible icon",
    quote: "Do not access data obtained through Health Connect using headless apps.",
    source: "playPermissions",
    when: ["health-connect"],
    page: "/compliance/google-play-health-connect-publishing-requirements",
  },
  {
    id: "google-hc-children",
    store: "google",
    section: "Health Connect: Appropriate Access",
    title: "Do not connect Health Connect to features that solely target children",
    quote: "Do not use Health Connect to connect to applications, services, or features that solely target children.",
    source: "playPermissions",
    when: ["kids"],
    page: "/build/kids-fitness-app",
  },
  {
    id: "google-hc-deletion-help",
    store: "google",
    section: "Health Connect: Transparent and Accurate Notice",
    title: "Publish help explaining how users manage and delete their data",
    quote: "User help documentation explaining how users can manage and delete their data from the app, and what happens to the data when an account is deactivated and/or deleted.",
    source: "playPermissions",
    when: ["health-connect"],
    page: "/compliance/health-data-retention-deletion",
  },
  {
    id: "google-hc-secure-transport",
    store: "google",
    section: "Health Connect: Transparent and Accurate Notice",
    title: "Say how you secure data, including HTTPS in transit",
    quote: "Information regarding handling all personal and sensitive user data securely, including transmitting it using modern cryptography (for example, over HTTPS).",
    source: "playPermissions",
    when: ["health-connect"],
    page: "/compliance/store-health-data-securely",
  },
];

/**
 * @typedef {{ quote: string; source: string; page?: string }} RuleQuote
 * @typedef {{ id: string; name: string; page: string; quotes: RuleQuote[] }} Regime
 */

/**
 * The regimes the compliance wizard can name. Which one shows, and as what
 * ("likely applies", "may apply", "likely does not apply"), is decided in
 * src/lib/plannerLogic.mjs from the reader's answers and the quoted tests
 * below; the quotes are the statements the result shows.
 * @type {Regime[]}
 */
export const REGIMES = [
  {
    id: "hipaa-covered-entity",
    name: "HIPAA, as a covered entity",
    page: "/compliance/hipaa-compliance-fitness-app",
    quotes: [
      {
        quote: "Covered entity means: ( 1 ) A health plan. ( 2 ) A health care clearinghouse. ( 3 ) A health care provider who transmits any health information in electronic form in connection with a transaction covered by this subchapter.",
        source: "cfr160",
      },
      {
        quote: "5. Do consumers need a prescription to access your app? Yes HIPAA: You may be a HIPAA covered health care provider and therefore subject to the HIPAA Rules .",
        source: "ftcTool",
      },
    ],
  },
  {
    id: "hipaa-business-associate",
    name: "HIPAA, as a business associate",
    page: "/compliance/hipaa-compliance-fitness-app",
    quotes: [
      {
        quote: "Are you developing, offering, or operating an app on behalf of a HIPAA covered entity (such as a hospital, doctor’s office, health insurer, or health plan’s wellness program)? Or are you acting as a subcontractor to another entity providing services to a covered entity?",
        source: "ftcTool",
      },
      {
        quote: "You likely are a HIPAA business associate , and therefore subject to the HIPAA Security Rule and specific provisions of the HIPAA Privacy and Breach Notification Rules",
        source: "ftcTool",
      },
      {
        quote: "developer that contracts with a covered entity to provide the health care app to the covered entity's patients",
        source: "hhsBa",
      },
    ],
  },
  {
    id: "hipaa-not-covered",
    name: "HIPAA (neither a covered entity nor a business associate)",
    page: "/compliance/is-fitness-data-phi",
    quotes: [
      {
        quote: "If an entity does not meet the definition of a covered entity or business associate, it does not have to comply with the HIPAA Rules.",
        source: "hhsCovered",
      },
      {
        quote: "You likely are not covered by HIPAA. (Other laws, like the FTC Act, may also apply, but we’ll get to that.)",
        source: "ftcTool",
      },
    ],
  },
  {
    id: "ftc-hbnr",
    name: "FTC Health Breach Notification Rule",
    page: "/compliance/ftc-health-breach-notification-rule",
    quotes: [
      {
        quote: "The FTC’s Health Breach Notification Rule applies to most health apps that aren’t covered by HIPAA because most developers of health apps are acting as “health care providers”",
        source: "ftcTool",
      },
      {
        quote: "For example, if you develop a health app that collects information from consumers and can sync with a consumer’s fitness tracker, you’re probably a vendor of personal health records.",
        source: "ftcHbnrGuide",
      },
      {
        quote: "This part does not apply to HIPAA-covered entities, or to any other entity to the extent that it engages in activities as a business associate of a HIPAA-covered entity.",
        source: "cfr318",
      },
      {
        quote: "If your company is a HIPAA business associate that also offers personal health record services to the public, you may be subject to both the HHS and FTC Breach Notification Rules.",
        source: "ftcHbnrGuide",
      },
    ],
  },
  {
    id: "ftc-hbnr-sharing",
    name: "FTC Health Breach Notification Rule: sharing without consent",
    page: "/compliance/ftc-health-breach-notification-rule",
    quotes: [
      {
        quote: "A breach of security includes an unauthorized acquisition of unsecured PHR identifiable health information in a personal health record that occurs as a result of a data breach or an unauthorized disclosure.",
        source: "cfr318",
      },
      {
        quote: "if you disclose consumers’ unsecured, individually identifiable health information without their consent, a breach has occurred.",
        source: "ftcHbnrGuide",
      },
    ],
  },
  {
    id: "ftc-act",
    name: "FTC Act: what you claim about privacy",
    page: "/compliance/hipaa-compliance-fitness-app",
    quotes: [
      {
        quote: "don’t make false or misleading claims that you are “HIPAA Compliant,” “HIPAA Secure,” “HIPAA Certified” or the like.",
        source: "ftcHipaaClaims",
      },
    ],
  },
  {
    id: "gdpr-art9",
    name: "GDPR, Article 9 (data concerning health)",
    page: "/compliance/gdpr-fitness-app",
    quotes: [
      {
        quote: "personal data related to the physical or mental health of a natural person, including the provision of health care services, which reveal information about his or her health status",
        source: "gdprArt4",
      },
      {
        quote: "biometric data for the purpose of uniquely identifying a natural person, data concerning health or data concerning a natural person's sex life or sexual orientation shall be prohibited",
        source: "gdprArt9",
      },
      {
        quote: "the data subject has given explicit consent to the processing of those personal data for one or more specified purposes",
        source: "gdprArt9",
      },
    ],
  },
  {
    id: "gdpr-gym",
    name: "GDPR for a gym or studio: controller and processor",
    page: "/compliance/gym-gdpr-compliance",
    quotes: [
      {
        quote: "alone or jointly with others, determines the purposes and means of the processing of personal data",
        source: "gdprArt4",
      },
      {
        quote: "which processes personal data on behalf of the controller",
        source: "gdprArt4",
      },
    ],
  },
  {
    id: "wa-mhmda",
    name: "Washington My Health My Data Act",
    page: "/compliance/washington-my-health-my-data-act",
    quotes: [
      {
        quote: "\"Regulated entity\" means any legal entity that: (a) Conducts business in Washington, or produces or provides products or services that are targeted to consumers in Washington; and (b) alone or jointly with others, determines the purpose and means of collecting, processing, sharing, or selling of consumer health data.",
        source: "waRcw",
      },
      {
        quote: "\"Consumer health data\" means personal information that is linked or reasonably linkable to a consumer and that identifies the consumer's past, present, or future physical or mental health status.",
        source: "waRcw",
      },
      {
        quote: "For example, while information about the purchase of toilet paper or deodorant is not consumer health data, an app that tracks someone’s digestion or perspiration is collecting consumer health data.",
        source: "waAg",
      },
    ],
  },
  {
    id: "fda-wellness",
    name: "FDA: general wellness or medical device",
    page: "/compliance/fda-fitness-app-regulation",
    quotes: [
      {
        quote: "Section 520(o)(1)(B) of the FD&C Act, states that software that is intended \"for maintaining or encouraging a healthy lifestyle and is unrelated to the diagnosis, cure, mitigation, prevention, or treatment of a disease or condition\" is not a device under section 201(h) of the FD&C Act.",
        source: "fdaWellness",
      },
    ],
  },
  {
    id: "app-store",
    name: "Apple App Review Guidelines",
    page: "/compliance/app-store-health-data-rules",
    quotes: [
      {
        quote: "Apps may not use or disclose to third parties data gathered in the health, fitness, and medical research context—including from the Clinical Health Records API, HealthKit API, Motion and Fitness, MovementDisorder APIs, or health-related human subject research—for advertising, marketing, or other use-based data mining purposes other than improving health management, or for the purpose of health research, and then only with permission.",
        source: "appReview",
      },
    ],
  },
  {
    id: "google-play",
    name: "Google Play Health apps and Health Connect policies",
    page: "/compliance/google-play-health-data-policy",
    quotes: [
      {
        quote: "All developers must complete the Health apps declaration form on the App content page",
        source: "playHealth",
      },
      {
        quote: "Data accessed through Health Connect Permissions is regarded as personal and sensitive user data subject to the User Data policy",
        source: "playPermissions",
      },
    ],
  },
];

/**
 * @typedef {{ id: string; title: string; quote: string; source: string; page: string; when: string[] }} EdgeCase
 */

/**
 * Platform behavior the PRD template writes into its edge-case section, each
 * from the platform's own documentation. `when` uses the same traits.
 * @type {EdgeCase[]}
 */
export const EDGE_CASES = [
  {
    id: "healthkit-read-denial",
    title: "A denied HealthKit read looks exactly like no data",
    quote: "To help prevent possible leaks of sensitive health information, your app cannot determine whether or not a user has granted permission to read data. If you are not given permission, it simply appears as if there is no data of the requested type in the HealthKit store.",
    source: "hkAuthStatus",
    page: "/fix/healthkit-authorization-denied",
    when: ["healthkit"],
  },
  {
    id: "health-connect-30-days",
    title: "Health Connect reads stop at 30 days before the first grant",
    quote: "By default, all applications can read data from Health Connect for up to 30 days prior to when any permission was first granted.",
    source: "hcRead",
    page: "/fix/health-connect-no-data",
    when: ["health-connect"],
  },
  {
    id: "health-connect-history-permission",
    title: "Older history needs its own permission",
    quote: "Otherwise, without this permission, an attempt to read records older than 30 days results in an error.",
    source: "hcRead",
    page: "/architecture/historical-backfill",
    when: ["health-connect"],
  },
  {
    id: "health-connect-token-expiry",
    title: "An unused Health Connect changes token expires",
    quote: "Since an unused Changes token expires within 30 days, you must use a sync strategy that avoids losing information in such a case.",
    source: "hcSync",
    page: "/fix/health-connect-changes-token-expired",
    when: ["health-connect"],
  },
  {
    id: "google-fit-end",
    title: "Google Fit is not a foundation to build on",
    quote: "The Google Fit API (including the REST API) will only be supported until the end of 2026.",
    source: "fitMigration",
    page: "/google-fit-shutdown",
    when: ["health-connect"],
  },
];
