/**
 * The privacy label helper on /tools/store-submission-checklist: which Apple
 * App Privacy data types and which Google Play Data safety data types a
 * health or fitness app declares, from what it collects and how.
 *
 * Every rule and every data-type definition is a platform's own sentence,
 * read on 2026-11-24 from Apple's "App privacy details on the App Store"
 * page and Google's "Provide information for Google Play's Data safety
 * section" help article, both fetched directly. Each source carries `ev`,
 * the evidence file that holds the same url and quote
 * (ops/sources/evidence/tools-store-submission-checklist.json, re-checked
 * against the live pages by .github/workflows/source-quotes.yml);
 * scripts/privacy-labels.test.mjs fails if one is missing. Where a platform's
 * list has no type for a kind of data, the gap is stated, never filled.
 *
 * Plain ESM, imported by the client component and the test. Nothing the
 * reader ticks leaves the browser.
 */

const EV = "ops/sources/evidence/tools-store-submission-checklist.json";
export const PRIVACY_HEADING = "Privacy label helper: what to declare in App Privacy and Data safety";
export const PRIVACY_MAP_HEADING = "Every data type the helper maps";
export const APPLE_URL = "https://developer.apple.com/app-store/app-privacy-details/";
export const GOOGLE_URL = "https://support.google.com/googleplay/android-developer/answer/10787469?hl=en";
const a = (claim, quote) => ({ claim, url: APPLE_URL, quote, ev: EV });
const g = (claim, quote) => ({ claim, url: GOOGLE_URL, quote, ev: EV });

export const PRIVACY_SOURCES = {
  // Apple: what counts, and the rules.
  appleCollect: a(
    "Privacy label helper, Apple: what \"collect\" means.",
    "“Collect” refers to transmitting data off the device in a way that allows you and/or your third-party partners to access it for a period longer than what is necessary to service the transmitted request in real time.",
  ),
  applePartners: a(
    "Privacy label helper, Apple: third-party partners include SDKs.",
    "“Third-party partners” refers to analytics tools, advertising networks, third-party SDKs, or other external vendors whose code you’ve added to your app.",
  ),
  appleIdentifyAll: a(
    "Privacy label helper, Apple: identify all data you or your partners collect.",
    "You need to identify all of the data you or your third-party partners collect, unless the data meets all of the criteria for optional disclosure listed below.",
  ),
  appleOptionalAll: a(
    "Privacy label helper, Apple: optional disclosure needs every criterion.",
    "Data types must meet all criteria in order to be considered optional for disclosure. If a data type collected by your app meets some, but not all, of the above criteria, it must be disclosed in App Store Connect.",
  ),
  appleOptionalInfrequent: a(
    "Privacy label helper, Apple: one optional-disclosure criterion is infrequent, optional collection.",
    "Collection of the data occurs only in infrequent cases that are not part of your app’s primary functionality, and which are optional for the user.",
  ),
  appleOngoing: a(
    "Privacy label helper, Apple: ongoing collection after a permission request must be disclosed.",
    "For the purpose of clarity, data collected on an ongoing basis after an initial request for permission must be disclosed.",
  ),
  appleOnDevice: a(
    "Privacy label helper, Apple: data processed only on device is not collected.",
    "Data that is processed only on device is not “collected” and does not need to be disclosed in your answers. If you derive anything from that data and send it off device, the resulting data should be considered separately.",
  ),
  appleNotRetained: a(
    "Privacy label helper, Apple: data sent to service a request and not retained need not be disclosed.",
    "For example, if an authentication token or IP address is sent on a server call and not retained, or if data is sent to your servers then immediately discarded after servicing the request, you do not need to disclose this in your answers in App Store Connect.",
  ),
  appleLinked: a(
    "Privacy label helper, Apple: say whether each data type is linked to the user's identity.",
    "You’ll need to identify whether each data type is linked to the user’s identity (via their account, device, or other details) by you and/or your third-party partners.",
  ),
  appleLinkedDefault: a(
    "Privacy label helper, Apple: data is often linked unless de-identified before collection.",
    "Data collected from an app is often linked to the user’s identity, unless specific privacy protections are put in place before collection to de-identify or anonymize it",
  ),
  applePersonalData: a(
    "Privacy label helper, Apple: personal data under privacy laws counts as linked.",
    "Note: “Personal Information” and “Personal Data”, as defined under relevant privacy laws, are considered linked to the user.",
  ),
  appleTracking: a(
    "Privacy label helper, Apple: what tracking means.",
    "“Tracking” refers to linking data collected from your app about a particular end-user or device, such as a user ID, device ID, or profile, with Third-Party Data for targeted advertising or advertising measurement purposes, or sharing data collected from your app about a particular end-user or device with a data broker.",
  ),
  // Apple: data types.
  appleHealth: a(
    "Privacy label helper, Apple data type Health & Fitness › Health.",
    "Health and medical data, including but not limited to data from the Clinical Health Records API, HealthKit API, Movement Disorder API, or health-related human subject research or any other user provided health or medical data",
  ),
  appleFitness: a("Privacy label helper, Apple data type Health & Fitness › Fitness.", "Fitness and exercise data, including but not limited to the Motion and Fitness API"),
  appleSensitive: a(
    "Privacy label helper, Apple data type Sensitive Info.",
    "Such as racial or ethnic data, sexual orientation, pregnancy or childbirth information, disability, religious or philosophical beliefs, trade union membership, political opinion, genetic information, or biometric data",
  ),
  applePrecise: a(
    "Privacy label helper, Apple data type Location › Precise Location.",
    "Information that describes the location of a user or device with the same or greater resolution as a latitude and longitude with three or more decimal places",
  ),
  appleCoarse: a(
    "Privacy label helper, Apple data type Location › Coarse Location.",
    "Information that describes the location of a user or device with lower resolution than a latitude and longitude with three or more decimal places, such as Approximate Location Services",
  ),
  appleName: a("Privacy label helper, Apple data type Contact Info › Name.", "Such as first or last name"),
  appleEmail: a("Privacy label helper, Apple data type Contact Info › Email Address.", "Including but not limited to a hashed email address"),
  appleUserId: a(
    "Privacy label helper, Apple data type Identifiers › User ID.",
    "Such as screen name, handle, account ID, assigned user ID, customer number, or other user- or account-level ID that can be used to identify a particular user or account",
  ),
  appleDeviceId: a("Privacy label helper, Apple data type Identifiers › Device ID.", "Such as the device’s advertising identifier, or other device-level ID"),
  applePhotos: a("Privacy label helper, Apple data type User Content › Photos or Videos.", "The user’s photos or videos"),
  appleAudio: a("Privacy label helper, Apple data type User Content › Audio Data.", "The user’s voice or sound recordings"),
  appleMessages: a(
    "Privacy label helper, Apple: in-app private messaging is declared as Emails or Text Messages.",
    "Declare emails or text messages on your label. Text messages refer to both SMS and non-SMS messages.",
  ),
  appleOtherContent: a("Privacy label helper, Apple data type User Content › Other User Content.", "Any other user-generated content"),
  appleFreeText: a(
    "Privacy label helper, Apple: free-form text fields are Other User Content.",
    'Mark "Other User Content" to represent generic free form text fields and "Audio Data" for voice recordings.',
  ),
  appleInteraction: a(
    "Privacy label helper, Apple data type Usage Data › Product Interaction.",
    "Such as app launches, taps, clicks, scrolling information, music listening data, video views, saved place in a game, video, or song, or other information about how the user interacts with the app",
  ),
  appleCrash: a("Privacy label helper, Apple data type Diagnostics › Crash Data.", "Such as crash logs"),
  applePerformance: a("Privacy label helper, Apple data type Diagnostics › Performance Data.", "Such as launch time, hang rate, or energy use"),
  appleOtherData: a("Privacy label helper, Apple data type Other Data › Other Data Types.", "Any other data types not mentioned"),
  applePurchases: a("Privacy label helper, Apple data type Purchases › Purchase History.", "An account’s or individual’s purchases or purchase tendencies"),
  // Apple: purposes.
  applePurposeThirdPartyAds: a(
    "Privacy label helper, Apple purpose Third-Party Advertising.",
    "Such as displaying third-party ads in your app, or sharing data with entities who display third-party ads",
  ),
  applePurposeOwnAds: a(
    "Privacy label helper, Apple purpose Developer’s Advertising or Marketing.",
    "Such as displaying first-party ads in your app, sending marketing communications directly to your users, or sharing data with entities who will display your ads",
  ),
  applePurposeAnalytics: a(
    "Privacy label helper, Apple purpose Analytics.",
    "Using data to evaluate user behavior, including to understand the effectiveness of existing product features, plan new features, or measure audience size or characteristics",
  ),
  applePurposePersonalization: a(
    "Privacy label helper, Apple purpose Product Personalization.",
    "Customizing what the user sees, such as a list of recommended products, posts, or suggestions",
  ),
  applePurposeFunctionality: a(
    "Privacy label helper, Apple purpose App Functionality.",
    "Such as to authenticate the user, enable features, prevent fraud, implement security measures, ensure server up-time, minimize app crashes, improve scalability and performance, or perform customer support",
  ),
  applePurposeOther: a("Privacy label helper, Apple purpose Other Purposes.", "Any other purposes not listed"),

  // Google: what counts, and the rules.
  googleCollect: g("Privacy label helper, Google: what \"collect\" means.", '"Collect" means transmitting data from your app off a user’s device.'),
  googleSdks: g(
    "Privacy label helper, Google: collection includes libraries and SDKs.",
    "Libraries and SDKs: This includes user data transmitted off device from your app by libraries and/or SDKs used in your app, irrespective of whether data is transmitted to you or a third-party server.",
  ),
  googleSdkDeclare: g(
    "Privacy label helper, Google: the declaration covers third-party libraries and SDKs.",
    "This includes data collected and handled through any third-party libraries or SDKs used in their apps.",
  ),
  googleNoData: g(
    "Privacy label helper, Google: apps that collect nothing still complete the form.",
    "Even developers with apps that do not collect any user data must complete this form and provide a link to their privacy policy.",
  ),
  googleOnDevice: g(
    "Privacy label helper, Google: on-device processing is not collection.",
    "On-device access/processing: User data accessed by your app that is only processed locally on the user’s device and not sent off device does not need to be disclosed.",
  ),
  googleEphemeral: g(
    "Privacy label helper, Google: ephemeral processing is in the form but not shown on the listing.",
    "Ephemeral processing: User data transmitted off device that is processed ephemerally needs to be included in your form response, but if it meets the standard below, it will not be disclosed in your app’s Data safety section on Google Play.",
  ),
  googleEphemeralDef: g(
    "Privacy label helper, Google: what ephemeral means.",
    'Processing data "ephemerally" means accessing and using it while the data is only stored in memory and retained for no longer than necessary to service the specific request in real-time.',
  ),
  googleEphemeralLimit: g(
    "Privacy label helper, Google: building profiles is never ephemeral.",
    "However, using data to build advertising profiles or other user profiles cannot be treated as ephemeral and must be declared as collection or sharing for the relevant purposes.",
  ),
  googlePseudonymous: g(
    "Privacy label helper, Google: pseudonymous data must be disclosed.",
    "Pseudonymous data: User data collected pseudonymously must be disclosed. For example, data that can reasonably be re-associated with a user must be disclosed.",
  ),
  googleSharing: g("Privacy label helper, Google: what \"sharing\" means.", '"Sharing" refers to transferring user data collected from your app to a third party.'),
  googleSdkSharing: g(
    "Privacy label helper, Google: SDK transfers to third parties are sharing.",
    "From your app libraries and SDKs. Transferring data collected from your app off a user’s device directly to a third party via libraries and/or SDKs included in your app.",
  ),
  googleServiceProviders: g(
    "Privacy label helper, Google: transfers to service providers are not sharing.",
    'Service providers. Transferring user data to a "service provider" that processes it on behalf of the developer.',
  ),
  googleUserInitiated: g(
    "Privacy label helper, Google: user-initiated or consented transfers are not sharing.",
    "User-initiated action or prominent disclosure and user consent. Transferring user data to a third party based on a specific user-initiated action, where the user reasonably expects the data to be shared, or based on a prominent in-app disclosure and consent that meets the requirements described in our User Data policy",
  ),
  googleOptional: g(
    "Privacy label helper, Google: each data type is optional or required.",
    'You can also disclose whether each data type collected by your app is "optional" or "required." "Optional" includes the ability to opt into or opt out of data collection.',
  ),
  googleOptionalAll: g(
    "Privacy label helper, Google: optional only if every user can choose.",
    "You can declare that your app collects certain data optionally only if all users – regardless of device or region – can either optionally provide information, opt-out, or opt-in to have the data collected.",
  ),
  googleRequired: g(
    "Privacy label helper, Google: data the primary functionality needs is required.",
    'If your app’s primary functionality requires the data type, you should declare that data as "required."',
  ),
  // Google: data types.
  googleHealth: g("Privacy label helper, Google data type Health and fitness › Health info.", "Information about a user's health, such as medical records or symptoms."),
  googleFitness: g("Privacy label helper, Google data type Health and fitness › Fitness info.", "Information about a user's fitness, such as exercise or other physical activity."),
  googlePrecise: g(
    "Privacy label helper, Google data type Location › Precise location.",
    "User or device physical location within an area less than 3 square kilometers, such as location provided by Android’s ACCESS_FINE_LOCATION permission.",
  ),
  googleApproximate: g(
    "Privacy label helper, Google data type Location › Approximate location.",
    "User or device physical location to an area greater than or equal to 3 square kilometers, such as the city a user is in, or location provided by Android’s ACCESS_COARSE_LOCATION permission.",
  ),
  googleName: g("Privacy label helper, Google data type Personal info › Name.", "How a user refers to themselves, such as their first or last name, or nickname."),
  googleEmail: g("Privacy label helper, Google data type Personal info › Email address.", "A user’s email address."),
  googleUserIds: g(
    "Privacy label helper, Google data type Personal info › User IDs.",
    "Identifiers that relate to an identifiable person. For example, an account ID, account number, or account name.",
  ),
  googleOtherInfo: g(
    "Privacy label helper, Google data type Personal info › Other info.",
    "Any other personal information such as date of birth, gender identity, veteran status, etc.",
  ),
  googleDeviceIds: g(
    "Privacy label helper, Google data type Device or other IDs.",
    "Identifiers that relate to an individual device, browser or app. For example, an IMEI number, MAC address, Widevine Device ID, Firebase installation ID, or advertising identifier.",
  ),
  googlePhotos: g("Privacy label helper, Google data type Photos and videos › Photos.", "A user’s photos."),
  googleVideos: g("Privacy label helper, Google data type Photos and videos › Videos.", "A user’s videos."),
  googleVoice: g("Privacy label helper, Google data type Audio files › Voice or sound recordings.", "A user’s voice such as a voicemail or a sound recording."),
  googleMessages: g("Privacy label helper, Google data type Messages › Other in-app messages.", "Any other types of messages. For example, instant messages or chat content."),
  googleOtherUgc: g(
    "Privacy label helper, Google data type App activity › Other user-generated content.",
    "Any other user-generated content not listed here, or in any other section. For example, user bios, notes, or open-ended responses.",
  ),
  googleInteractions: g(
    "Privacy label helper, Google data type App activity › App interactions.",
    "Information about how a user interacts with the app. For example, the number of times they visit a page, screenshots taken, or sections they tap on.",
  ),
  googleCrash: g(
    "Privacy label helper, Google data type App info and performance › Crash logs.",
    "Crash log data from your app. For example, the number of times your app has crashed, stack traces, or other information directly related to a crash.",
  ),
  googleDiagnostics: g(
    "Privacy label helper, Google data type App info and performance › Diagnostics.",
    "Information about the performance of your app. For example battery life, loading time, latency, framerate, or any technical diagnostics.",
  ),
  googlePurchases: g("Privacy label helper, Google data type Financial info › Purchase history.", "Information about purchases or transactions a user has made."),
  // Google: purposes.
  googlePurposeFunctionality: g("Privacy label helper, Google purpose App functionality.", "Used for features that are available in the app"),
  googlePurposeAnalytics: g("Privacy label helper, Google purpose Analytics.", "Used to collect data about how users use the app or how it performs"),
  googlePurposeComms: g("Privacy label helper, Google purpose Developer communications.", "Used to send news or notifications about the app or the developer."),
  googlePurposeAds: g(
    "Privacy label helper, Google purpose Advertising or marketing.",
    "Used to display or target ads or marketing communications, or measuring ad performance",
  ),
  googlePurposeFraud: g("Privacy label helper, Google purpose Fraud prevention, security, and compliance.", "Used for fraud prevention, security, or compliance with laws."),
  googlePurposePersonalization: g(
    "Privacy label helper, Google purpose Personalization.",
    "Used to customize your app, such as showing recommended content or suggestions.",
  ),
  googlePurposeAccount: g("Privacy label helper, Google purpose Account management.", "Used for the setup or management of a user’s account with the developer."),
};

const S = PRIVACY_SOURCES;

/**
 * What a reader can tick. `apple` and `google` are the data type each
 * platform's list gives for it, quoted; an array where the platform splits
 * it in two, null with `gap` where its list names no such type.
 */
export const PRIVACY_ITEMS = [
  {
    id: "health",
    label: "Health or medical data",
    hint: "Symptoms, conditions, medical records, or health data read from HealthKit or Health Connect",
    apple: [{ category: "Health & Fitness", type: "Health", src: S.appleHealth }],
    google: [{ category: "Health and fitness", type: "Health info", src: S.googleHealth }],
  },
  {
    id: "fitness",
    label: "Fitness and exercise data",
    hint: "Workouts, steps, activity, reps counted from the camera",
    apple: [{ category: "Health & Fitness", type: "Fitness", src: S.appleFitness }],
    google: [{ category: "Health and fitness", type: "Fitness info", src: S.googleFitness }],
    appleNote: { text: "Apple's Health definition names the HealthKit API, so fitness data your app reads through HealthKit may belong under Health as well.", src: S.appleHealth },
  },
  {
    id: "sensitive",
    label: "Pregnancy, genetic or biometric data",
    hint: "Cycle and pregnancy tracking, DNA results, biometric data",
    apple: [{ category: "Sensitive Info", type: "Sensitive Info", src: S.appleSensitive }],
    google: null,
    gap: {
      text: "Google's Data safety list, as we read it, names no data type for pregnancy, genetic or biometric data; its Health info type is described in the quote below. Choose the type yourself and record why.",
      src: S.googleHealth,
    },
  },
  {
    id: "precise-location",
    label: "Precise location",
    hint: "GPS routes for runs and rides",
    apple: [{ category: "Location", type: "Precise Location", src: S.applePrecise }],
    google: [{ category: "Location", type: "Precise location", src: S.googlePrecise }],
  },
  {
    id: "coarse-location",
    label: "Approximate location",
    hint: "City or region, for example to pick a gym or a time zone",
    apple: [{ category: "Location", type: "Coarse Location", src: S.appleCoarse }],
    google: [{ category: "Location", type: "Approximate location", src: S.googleApproximate }],
  },
  {
    id: "name",
    label: "Name",
    hint: "First or last name on the profile",
    apple: [{ category: "Contact Info", type: "Name", src: S.appleName }],
    google: [{ category: "Personal info", type: "Name", src: S.googleName }],
  },
  {
    id: "email",
    label: "Email address",
    hint: "Sign-in or receipts",
    apple: [{ category: "Contact Info", type: "Email Address", src: S.appleEmail }],
    google: [{ category: "Personal info", type: "Email address", src: S.googleEmail }],
  },
  {
    id: "user-id",
    label: "Account or user ID",
    hint: "Your own user ID, or a wearable vendor's user ID stored against it",
    apple: [{ category: "Identifiers", type: "User ID", src: S.appleUserId }],
    google: [{ category: "Personal info", type: "User IDs", src: S.googleUserIds }],
  },
  {
    id: "device-id",
    label: "Device or advertising ID",
    hint: "Advertising identifier, an analytics SDK's installation ID",
    apple: [{ category: "Identifiers", type: "Device ID", src: S.appleDeviceId }],
    google: [{ category: "Device or other IDs", type: "Device or other IDs", src: S.googleDeviceIds }],
  },
  {
    id: "profile",
    label: "Date of birth or gender",
    hint: "Profile fields used for calorie or heart-rate zone math",
    apple: null,
    gap: {
      text: "Apple's list, as we read it, names no data type for date of birth or gender. Its catch-all is Other Data › Other Data Types; choose the type yourself and record why.",
      src: S.appleOtherData,
    },
    google: [{ category: "Personal info", type: "Other info", src: S.googleOtherInfo }],
  },
  {
    id: "photos",
    label: "Photos or videos",
    hint: "Progress photos, uploaded form-check videos",
    apple: [{ category: "User Content", type: "Photos or Videos", src: S.applePhotos }],
    google: [
      { category: "Photos and videos", type: "Photos", src: S.googlePhotos },
      { category: "Photos and videos", type: "Videos", src: S.googleVideos },
    ],
  },
  {
    id: "voice",
    label: "Voice recordings",
    hint: "Voice notes, spoken commands sent to a server",
    apple: [{ category: "User Content", type: "Audio Data", src: S.appleAudio }],
    google: [{ category: "Audio files", type: "Voice or sound recordings", src: S.googleVoice }],
  },
  {
    id: "messages",
    label: "In-app messages",
    hint: "Chat with a coach or other users",
    apple: [{ category: "User Content", type: "Emails or Text Messages", src: S.appleMessages }],
    google: [{ category: "Messages", type: "Other in-app messages", src: S.googleMessages }],
  },
  {
    id: "notes",
    label: "Free-text notes or journal entries",
    hint: "Workout notes, a food diary in the user's own words",
    apple: [{ category: "User Content", type: "Other User Content", src: S.appleFreeText }],
    google: [{ category: "App activity", type: "Other user-generated content", src: S.googleOtherUgc }],
  },
  {
    id: "interactions",
    label: "App usage analytics",
    hint: "Screens viewed, taps, feature use",
    apple: [{ category: "Usage Data", type: "Product Interaction", src: S.appleInteraction }],
    google: [{ category: "App activity", type: "App interactions", src: S.googleInteractions }],
  },
  {
    id: "crashes",
    label: "Crash logs",
    hint: "A crash reporter SDK",
    apple: [{ category: "Diagnostics", type: "Crash Data", src: S.appleCrash }],
    google: [{ category: "App info and performance", type: "Crash logs", src: S.googleCrash }],
  },
  {
    id: "performance",
    label: "Performance diagnostics",
    hint: "Launch time, latency, battery use",
    apple: [{ category: "Diagnostics", type: "Performance Data", src: S.applePerformance }],
    google: [{ category: "App info and performance", type: "Diagnostics", src: S.googleDiagnostics }],
  },
  {
    id: "purchases",
    label: "Purchase history",
    hint: "Subscriptions and in-app purchases you store",
    apple: [{ category: "Purchases", type: "Purchase History", src: S.applePurchases }],
    google: [{ category: "Financial info", type: "Purchase history", src: S.googlePurchases }],
  },
];

/** Where the data goes. Only "stored" asks the four questions below. */
export const WHERE = [
  { id: "stored", label: "Sent off the device and kept (your server, a cloud, an SDK)" },
  { id: "ephemeral", label: "Sent off the device only to answer a request, then discarded" },
  { id: "device", label: "Never leaves the device" },
];

export const FLAGS = [
  { id: "linked", label: "Linked to the user's identity (account, device or other details)" },
  { id: "tracking", label: "Used for tracking: combined with other companies' data for ads, or given to a data broker" },
  { id: "shared", label: "Shared with a third party that is not your service provider" },
  { id: "optional", label: "Optional: users can use the app without it" },
];

export const PURPOSES = {
  apple: [
    { name: "Third-Party Advertising", src: S.applePurposeThirdPartyAds },
    { name: "Developer’s Advertising or Marketing", src: S.applePurposeOwnAds },
    { name: "Analytics", src: S.applePurposeAnalytics },
    { name: "Product Personalization", src: S.applePurposePersonalization },
    { name: "App Functionality", src: S.applePurposeFunctionality },
    { name: "Other Purposes", src: S.applePurposeOther },
  ],
  google: [
    { name: "App functionality", src: S.googlePurposeFunctionality },
    { name: "Analytics", src: S.googlePurposeAnalytics },
    { name: "Developer communications", src: S.googlePurposeComms },
    { name: "Advertising or marketing", src: S.googlePurposeAds },
    { name: "Fraud prevention, security, and compliance", src: S.googlePurposeFraud },
    { name: "Personalization", src: S.googlePurposePersonalization },
    { name: "Account management", src: S.googlePurposeAccount },
  ],
};

/** Rules shown whatever is ticked: SDKs count, and an app that collects nothing still answers. */
export const ALWAYS = {
  apple: [S.appleIdentifyAll, S.applePartners, S.appleCollect],
  google: [S.googleSdkDeclare, S.googleSdks, S.googleNoData],
};

export const DEFAULT_ANSWER = { where: "stored", linked: true, tracking: false, shared: false, optional: false };

/**
 * The answers for a selection { [itemId]: { where, linked, tracking, shared, optional } }.
 * Returns, per platform, the items to declare (with flags and the rules
 * behind them) and the items left off (with the rule that leaves them off).
 */
export function privacyAnswers(selection) {
  const apple = { declare: [], omit: [], gaps: [] };
  const google = { declare: [], omit: [], gaps: [] };
  for (const item of PRIVACY_ITEMS) {
    const ans = selection?.[item.id];
    if (!ans) continue;
    const where = WHERE.some((w) => w.id === ans.where) ? ans.where : "stored";
    const stored = where === "stored";
    const f = stored ? ans : { linked: false, tracking: false, shared: false, optional: false };

    // Apple
    if (where === "device") apple.omit.push({ item, why: S.appleOnDevice });
    else if (where === "ephemeral") apple.omit.push({ item, why: S.appleNotRetained });
    else if (!item.apple) apple.gaps.push({ item, gap: item.gap });
    else {
      const flags = [
        f.linked ? { label: "Linked to the user's identity", src: S.appleLinked } : { label: "Not linked to the user's identity", src: S.appleLinkedDefault },
      ];
      if (f.tracking) flags.push({ label: "Used for tracking", src: S.appleTracking });
      const rules = [];
      if (!f.linked) rules.push(S.applePersonalData);
      if (f.optional) rules.push(S.appleOptionalAll, S.appleOptionalInfrequent);
      if (f.shared) rules.push(S.appleIdentifyAll);
      rules.push(S.appleOngoing);
      apple.declare.push({ item, types: item.apple, flags, rules, note: item.appleNote });
    }

    // Google
    if (where === "device") google.omit.push({ item, why: S.googleOnDevice });
    else if (!item.google) google.gaps.push({ item, gap: item.gap });
    else {
      const flags = [{ label: "Collected", src: S.googleCollect }];
      if (f.shared) flags.push({ label: "Shared", src: S.googleSharing });
      if (where === "ephemeral") flags.push({ label: "Processed ephemerally", src: S.googleEphemeral });
      else flags.push(f.optional ? { label: "Optional", src: S.googleOptional } : { label: "Required", src: S.googleRequired });
      const rules = [];
      if (where === "ephemeral") rules.push(S.googleEphemeralDef, S.googleEphemeralLimit);
      if (f.shared) rules.push(S.googleServiceProviders, S.googleUserInitiated, S.googleSdkSharing);
      if (f.optional) rules.push(S.googleOptionalAll);
      if (stored && !f.linked) rules.push(S.googlePseudonymous);
      if (f.tracking) rules.push(S.googlePurposeAds);
      google.declare.push({ item, types: item.google, flags, rules, ephemeral: where === "ephemeral" });
    }
  }
  return { apple, google };
}

/** "health:stored:l,t;fitness:device" ⇄ selection, for the share link. */
export function encodeSelection(selection) {
  const parts = [];
  for (const item of PRIVACY_ITEMS) {
    const s = selection?.[item.id];
    if (!s) continue;
    const flags = FLAGS.filter((fl) => s[fl.id]).map((fl) => fl.id[0]).join("");
    parts.push(`${item.id}:${s.where}${s.where === "stored" && flags ? `:${flags}` : ""}`);
  }
  return parts.join(";");
}

export function decodeSelection(text) {
  const out = {};
  for (const part of String(text ?? "").split(";")) {
    const [id, where, flags = ""] = part.split(":");
    if (!PRIVACY_ITEMS.some((i) => i.id === id) || !WHERE.some((w) => w.id === where)) continue;
    const has = (c) => where === "stored" && flags.includes(c);
    out[id] = { where, linked: has("l"), tracking: has("t"), shared: has("s"), optional: has("o") };
  }
  return out;
}
