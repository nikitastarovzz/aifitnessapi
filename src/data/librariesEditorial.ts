/**
 * The hand-written half of /libraries.
 *
 * src/data/libraries.ts is GENERATED (scripts/fetch-libraries.mjs) and holds
 * every registry and repository fact. This file holds what a registry cannot:
 * the install commands each README documents, what the package wraps, the
 * caveats its README states, and the questions a developer types about it.
 *
 * Evidence rule. Every note carries the URL it was read from and is phrased
 * as that source's claim ("The README says…"), with short verbatim quotes
 * where the wording matters. Judgement is labelled as ours. Nothing here
 * restates a version, date or count by hand: where a capsule or answer needs
 * one, it is interpolated from the generated data via `lib()`, so the prose
 * and the table cannot disagree after a refresh.
 *
 * Read on 2026-10-03 (VERIFIED_ON): each package's registry entry, the README
 * on its repository's default branch (raw.githubusercontent.com/<repo>/HEAD),
 * pub.dev install pages for the Flutter packages, and Google's Fit migration
 * guide. Re-verify by re-reading those sources — do not move VERIFIED_ON
 * without doing so (CLAUDE.md, Freshness).
 *
 * KinesteX (which funds this site) publishes none of these packages; no
 * first-party disclosure applies, and none of these pages mention it.
 */
import { LIBRARIES, LIBRARIES_FETCHED_ON, type Library, type LibraryGroup } from "@/data/libraries";

export const LIBRARIES_BASE = "/libraries";

/** The date the editorial notes below were checked against their sources. */
export const LIBRARIES_VERIFIED_ON = "2026-10-03";

/** First commit of these pages. datePublished for every /libraries route. */
export const LIBRARIES_PUBLISHED = "2026-10-03";

export type SourcedNote = {
  /** Plain prose; `backticks` render as inline code. Attributed in the text. */
  text: string;
  /** Optional verbatim quote from the source, rendered as a blockquote. */
  quote?: string;
  source: string;
  sourceLabel: string;
};

export type Command = { label: string; command: string; source: string; sourceLabel: string };

export type Faq = { q: string; a: string };

export type NativeLink = { href: string; label: string; why: string };

export type LibraryEditorial = {
  slug: string;
  /** Absolute <title>, ≤ 60 chars, leads with the package name. */
  title: string;
  metaDescription: string;
  h1: string;
  primaryQuery: string;
  /** 2–4 sentence answer capsule. May interpolate generated facts. */
  answer: string;
  wraps: SourcedNote;
  commandsHeading: string;
  /** Empty when the README documents no install command; `noCommandNote` says so. */
  commands: Command[];
  noCommandNote?: string;
  notes: SourcedNote[];
  nativeLinks: NativeLink[];
  faqs: Faq[];
};

export const LIBRARY_GROUPS: { id: LibraryGroup; label: string; blurb: string }[] = [
  {
    id: "react-native",
    label: "React Native",
    blurb:
      "HealthKit and Health Connect are separate stores with separate bridges: a React Native app that ships on both platforms usually installs one package per platform.",
  },
  {
    id: "capacitor-cordova",
    label: "Capacitor and Cordova",
    blurb:
      "Three of these four plugins cover both stores behind one API. The Cordova plugin also documents a manual setup for Capacitor projects.",
  },
  {
    id: "flutter",
    label: "Flutter",
    blurb:
      "Two cross-platform plugins and two single-store ones (one iOS-only, one Android-only); compare the release dates before choosing.",
  },
  {
    id: "python",
    label: "Python",
    blurb:
      "Clients for vendor web APIs rather than on-device stores — for scripts, back ends and personal data exports. Each page says how the client signs in, according to its README.",
  },
];

/** The hub's own questions (rendered on /libraries; exported for llms-full.txt / answers.json). */
export const LIBRARIES_HUB_FAQS: Faq[] = [
  {
    q: "Which React Native library should I use for HealthKit and Health Connect?",
    a: "There is no single React Native package for both stores on this list: the HealthKit bridges (react-native-health, @kingstinct/react-native-healthkit) are iOS only and react-native-health-connect is Android only, so a cross-platform React Native app installs one of each. Capacitor and Flutter, by contrast, each have plugins that cover both stores behind one API.",
  },
  {
    q: "How are the libraries on this page chosen and kept current?",
    a: "Each package was confirmed to exist in its registry and to wrap a health store or a fitness vendor API before it was added; placeholders and empty packages were left out. A script reads npm, pub.dev, PyPI and GitHub weekly and refuses to publish if any package fails to resolve, so a version or a deprecation reaches these pages within about a week of the registry stating it.",
  },
  {
    q: "Why does this page show release dates instead of saying whether a library is maintained?",
    a: "Because a date is a fact and a verdict is an opinion. A HealthKit bridge over a stable API can go a long time between releases and still work; a fast release cadence can mean the API underneath is churning. Where a project says something about its own status — deprecated, inactive, feature-frozen, looking for a maintainer — the package page quotes it.",
  },
];

// ── Generated facts, for interpolation ────────────────────────────────────

const BY_SLUG = new Map(LIBRARIES.map((l) => [l.slug, l]));

/** A generated row by slug. Throws at build time if the generator dropped it,
 *  so an editorial entry can never render against a missing package. */
export function lib(slug: string): Library {
  const l = BY_SLUG.get(slug);
  if (!l) throw new Error(`librariesEditorial: no generated row for "${slug}" — rerun scripts/fetch-libraries.mjs`);
  return l;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "October 2024" from "2024-10-15". */
export function monthYear(iso: string): string {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
const req = (slug: string, key: string) => lib(slug).requires?.[key] ?? null;

// ── Sources ───────────────────────────────────────────────────────────────

const readme = (repo: string, path = "README.md") => `https://github.com/${repo}/blob/HEAD/${path}`;
const README = "README";
const FIT_GUIDE = "https://developer.android.com/health-and-fitness/health-connect/migration/fit";
const FIT_GUIDE_LABEL = "Google's Fit migration guide (last updated 2026-09-10)";
const pubInstall = (name: string) => `https://pub.dev/packages/${name}/install`;

const R = {
  rnHealth: readme("agencyenterprise/react-native-health"),
  kingstinct: readme("kingstinct/react-native-healthkit"),
  rnhc: readme("matinzd/react-native-health-connect"),
  expoHc: readme("matinzd/expo-health-connect"),
  googleFit: readme("StasDoskalenko/react-native-google-fit"),
  capHealth: readme("mley/capacitor-health"),
  capgo: readme("Cap-go/capacitor-health"),
  perfood: readme("perfood/capacitor-healthkit"),
  cordova: readme("dariosalvi78/cordova-plugin-health"),
  flutterHealth: readme("carp-dk/carp-health-flutter"),
  healthConnector: readme("fam-tung-lam/health_connector", "packages/health_connector/README.md"),
  hkReporter: readme("VictorKachalov/health_kit_reporter"),
  flutterHc: readme("duynguyen242/flutter_health_connect"),
  garminconnect: readme("cyberjunky/python-garminconnect"),
  garth: readme("matin/garth"),
  stravalib: readme("stravalib/stravalib"),
  ouraRing: readme("hedgertronic/oura-ring"),
  oura: readme("turing-complet/python-ouraring"),
  fitbit: readme("orcasgit/python-fitbit", "README.rst"),
  withings: readme("vangorra/python_withings_api"),
};

// ── Shared link sets ──────────────────────────────────────────────────────

const HK_LINKS: NativeLink[] = [
  { href: "/integrate/healthkit", label: "HealthKit integration guide", why: "The native API every iOS package here calls into: authorization, queries, background delivery." },
  { href: "/healthkit", label: "HealthKit data types by group", why: "Apple's identifiers grouped the way Apple groups them — check the type you need exists before blaming the bridge." },
  { href: "/healthkit-errors", label: "Every HealthKit error code", why: "What the HKError a bridge passes through actually means." },
];
const HC_LINKS: NativeLink[] = [
  { href: "/integrate/google-health-connect", label: "Health Connect integration guide", why: "The Android API these packages wrap: permissions, records, the 30-day window." },
  { href: "/health-connect", label: "Health Connect record reference", why: "Every record class with Google's fields, permission strings and aggregate metrics — check the type you need exists before blaming the wrapper." },
  { href: "/matrix", label: "HealthKit types vs Health Connect records", why: "Which record a HealthKit type maps to, and the pairs that look equivalent but are not." },
  { href: "/fix/health-connect-no-data", label: "Health Connect returns no data", why: "The usual causes when a read comes back empty, whichever wrapper you use." },
];

// ── Packages ──────────────────────────────────────────────────────────────

export const LIBRARY_EDITORIAL: LibraryEditorial[] = [
  {
    slug: "react-native-health",
    title: "react-native-health: HealthKit Bridge for React Native",
    metaDescription:
      "react-native-health connects React Native apps to Apple HealthKit on iOS. Install steps from its README, release dates, repo activity and the caveats.",
    h1: "react-native-health",
    primaryQuery: "react-native-health",
    answer: `react-native-health is an npm package that bridges React Native apps to Apple HealthKit on iOS; it does not cover Android. Its README asks for the HealthKit capability and two Info.plist usage strings, and says the package is not available in Expo Go. Since August 2023 the README has said its maintainers are focused on a Swift rewrite and holding off on new features, and the latest npm release is ${lib("react-native-health").latestVersion} from ${monthYear(lib("react-native-health").latestPublished)} — so check that the HealthKit types you need are supported before you build on it.`,
    wraps: {
      text: "Apple HealthKit, on iOS only. The README introduces it as a package to interact with Apple HealthKit for iOS, written in Objective-C (its background-delivery setup edits AppDelegate.m).",
      quote: "A React Native package to interact with Apple HealthKit for iOS.",
      source: R.rnHealth,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "Add the package", command: "yarn add react-native-health", source: R.rnHealth, sourceLabel: README },
      { label: "Install the pod (from the ios/ folder)", command: "pod install", source: R.rnHealth, sourceLabel: README },
    ],
    notes: [
      {
        text: "New features are on hold. A README section dated August 2023 says the maintainers are building a Swift version with a new interface, are holding off on new features until then, and welcome pull requests for critical bug fixes and dependency issues.",
        quote: "As we are fully focused in it, we're temporarily holding off on introducing new features.",
        source: R.rnHealth,
        sourceLabel: README,
      },
      {
        text: "No Expo Go. The README says the package cannot run in the Expo Go app and points to custom development clients instead.",
        quote: "This package is not available in the Expo Go app.",
        source: R.rnHealth,
        sourceLabel: README,
      },
      {
        text: "Background delivery is native setup. The README's background section adds `#import \"RCTAppleHealthKit.h\"` and `[[RCTAppleHealthKit new] initializeBackgroundObservers:bridge];` to AppDelegate.m — an Objective-C app delegate, which newer Swift-template projects will need to bridge.",
        source: R.rnHealth,
        sourceLabel: README,
      },
      {
        text: "Two repository names, one repository. The npm metadata still names `agencyenterprise/react-native-healthkit`, while the README and our SDK release tracker use `agencyenterprise/react-native-health`. On 2026-10-03 a git fetch of both addresses returned the same default-branch commit, so they are one repository under an old and a new name.",
        source: "https://registry.npmjs.org/react-native-health",
        sourceLabel: "npm registry metadata and a git fetch of both URLs",
      },
    ],
    nativeLinks: [
      ...HK_LINKS,
      { href: "/blog/react-native-health-stale", label: "Your HealthKit bridge last shipped in 2024", why: "What a long release gap does and does not tell you about this package." },
      { href: "/sdk-releases", label: "Health SDK release tracker", why: "This package's GitHub releases, refreshed daily." },
    ],
    faqs: [
      {
        q: "Does react-native-health work on Android?",
        a: "No. Its README describes it as a package for Apple HealthKit on iOS, and HealthKit does not exist on Android. React Native apps that also ship on Android usually pair it with react-native-health-connect, whose own README lists react-native-health as the iOS counterpart.",
      },
      {
        q: "Can I use react-native-health with Expo?",
        a: "Not in Expo Go. The README says the package is not available in the Expo Go app and points to custom development clients instead, so you need a development build that compiles the native module in.",
      },
      {
        q: "Which Info.plist keys does react-native-health need?",
        a: "The README lists NSHealthShareUsageDescription and NSHealthUpdateUsageDescription, plus NSHealthClinicalHealthRecordsShareUsageDescription only if you request clinical records. It also asks you to add the HealthKit capability to the target in Xcode, and to tick Clinical Health Records there if you use clinical types.",
      },
    ],
  },
  {
    slug: "kingstinct-react-native-healthkit",
    title: "@kingstinct/react-native-healthkit: Setup and Caveats",
    metaDescription:
      "@kingstinct/react-native-healthkit: TypeScript HealthKit bindings for React Native. Install for Expo and bare apps, the crash its README warns of, dates.",
    h1: "@kingstinct/react-native-healthkit",
    primaryQuery: "@kingstinct/react-native-healthkit",
    answer: `@kingstinct/react-native-healthkit is a TypeScript-first React Native binding for Apple HealthKit that keeps HealthKit's own identifier strings, such as HKQuantityTypeIdentifierStepCount. Since version 9 it is built on react-native-nitro-modules, which you install alongside it, and its latest npm release is ${lib("kingstinct-react-native-healthkit").latestVersion}. Its README warns that reading a type before requesting authorization for it crashes the app, and that the package does not run in Expo Go.`,
    wraps: {
      text: "Apple HealthKit, on iOS. The README says the TypeScript mappings are kept as close as possible to HealthKit in naming and serialization, and lists quantity, category, workout, correlation and document types, with clinical records in a separate package, @react-native-healthkit/health-records.",
      quote: "React Native bindings for HealthKit with full TypeScript and Promise support covering about any kind of data.",
      source: R.kingstinct,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      {
        label: "Expo (then add the config plugin to app.json and build a dev client)",
        command: "yarn add @kingstinct/react-native-healthkit react-native-nitro-modules",
        source: R.kingstinct,
        sourceLabel: README,
      },
      {
        label: "Bare React Native",
        command: "yarn add @kingstinct/react-native-healthkit @react-native-healthkit/core react-native-nitro-modules",
        source: R.kingstinct,
        sourceLabel: README,
      },
      { label: "Then install pods", command: "npx pod-install", source: R.kingstinct, sourceLabel: README },
    ],
    notes: [
      {
        text: "Authorize before you read, or the app crashes. The README warns this is easy to miss when a hook fetches data in the same component that requests authorization.",
        quote: "Failing to request authorization, or requesting a permission you haven't requested yet, will result in the app crashing.",
        source: R.kingstinct,
        sourceLabel: README,
      },
      {
        text: "Version 9 renamed things. The README's 9.0.0 migration notes say the library moved to react-native-nitro-modules and dropped most HK prefixes from type names, that `deleteObjects` replaced the older deletion methods, and that workouts are now returned as proxies with functions such as `getWorkoutRoutes()`.",
        quote: "As an example the type previously called HKQuantityTypeIdentifier is now just QuantityTypeIdentifier.",
        source: R.kingstinct,
        sourceLabel: README,
      },
      {
        text: "Anchored queries for sync. The README documents `queryQuantitySamplesWithAnchor`, which returns `samples`, `deletedSamples` and a `newAnchor` to store for the next call — the incremental-sync primitive HealthKit itself exposes.",
        source: R.kingstinct,
        sourceLabel: README,
      },
      {
        text: "Release native objects in loops. The README says workout proxies keep the underlying HKWorkout alive until garbage collection, and recommends calling `dispose()` (after `toJSON()` if you need the data) when processing many workouts.",
        source: R.kingstinct,
        sourceLabel: README,
      },
    ],
    nativeLinks: [
      ...HK_LINKS,
      { href: "/healthkit-identifiers", label: "All HealthKit identifiers", why: "This package takes Apple's identifier strings verbatim, so Apple's list is its type list." },
      { href: "/fix/healthkit-authorization-not-determined", label: "HealthKit authorization not determined", why: "The state your code is in before the request this package insists on." },
    ],
    faqs: [
      {
        q: "Why does @kingstinct/react-native-healthkit crash when I read data?",
        a: "Most likely because the read ran before authorization was requested for that type. The README says that failing to request authorization, or querying a permission you have not requested yet, crashes the app, and gives the example of a hook fetching data in the same component that requests authorization. Request first, and only mount the reading hooks after the request resolves.",
      },
      {
        q: "Does @kingstinct/react-native-healthkit support Expo?",
        a: "Yes, through its config plugin, but not in Expo Go. The README says to add @kingstinct/react-native-healthkit to the plugins array in app.json, optionally overriding the two usage descriptions and enabling background delivery, and then build a new development client.",
      },
      {
        q: "What changed in @kingstinct/react-native-healthkit 9.0.0?",
        a: "The README lists a move to react-native-nitro-modules, type names without most HK prefixes (HKQuantityTypeIdentifier became QuantityTypeIdentifier), fewer required parameters, flexible filters, deleteObjects replacing the earlier deletion methods, workouts returned as proxies with functions, and object identifiers as strictly typed strings rather than enums.",
      },
    ],
  },
  {
    slug: "react-native-health-connect",
    title: "react-native-health-connect: Setup, Expo and Caveats",
    metaDescription:
      "react-native-health-connect wraps Android Health Connect for React Native. Install for bare and Expo apps, the MainActivity delegate, release dates.",
    h1: "react-native-health-connect",
    primaryQuery: "react-native-health-connect",
    answer:
      "react-native-health-connect is the React Native wrapper for Android Health Connect; it is Android only, and its README points to react-native-health and @kingstinct/react-native-healthkit for iOS. Since v4 its Expo config plugin ships inside the package, replacing the separate expo-health-connect. Bare React Native apps must register its permission delegate in MainActivity, and every record type you read needs a permission declared in the manifest.",
    wraps: {
      text: "Android Health Connect. The registry description marks it Android only, and the README introduces it as a wrapper around Health Connect for React Native.",
      quote: "This library is a wrapper around Health Connect for react native.",
      source: R.rnhc,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "React Native CLI", command: "npm install react-native-health-connect", source: R.rnhc, sourceLabel: README },
      {
        label: "Expo: also add expo-build-properties, then list both in app.json plugins",
        command: "npm install expo-build-properties --save-dev",
        source: R.rnhc,
        sourceLabel: README,
      },
    ],
    notes: [
      {
        text: "Bare apps register a permission delegate. For the React Native CLI template, from version 2 on, the README adds `HealthConnectPermissionDelegate.setPermissionDelegate(this)` to `MainActivity.onCreate`. Expo projects skip this: the README says the bundled Expo module registers it.",
        quote: "In order to handle permission contract results, we need to set the permission delegate.",
        source: R.rnhc,
        sourceLabel: README,
      },
      {
        text: "expo-health-connect is now a build error. The README says that leaving the old package installed alongside v4 fails the Android build with a duplicate `expo.modules.healthconnect.HealthConnectPackage` class.",
        source: R.rnhc,
        sourceLabel: README,
      },
      {
        text: "Device requirements. The README says Health Connect must be installed on the user's device, is part of the Android framework from Android 14, and needs `minSdkVersion=26`.",
        source: R.rnhc,
        sourceLabel: README,
      },
      {
        text: "React Native version. The README asks for React Native 0.71 or higher, with the latest patch, for v2 and later, and lists support for both the old and new architectures.",
        source: R.rnhc,
        sourceLabel: README,
      },
    ],
    nativeLinks: [
      ...HC_LINKS,
      { href: "/migrate/google-fit-to-health-connect", label: "Migrate from Google Fit to Health Connect", why: "If this package is replacing react-native-google-fit in your app." },
      { href: "/sdk-releases", label: "Health SDK release tracker", why: "This package's GitHub releases, refreshed daily." },
    ],
    faqs: [
      {
        q: "Does react-native-health-connect work on iOS?",
        a: "No. The registry description marks it Android only, because Health Connect is an Android platform. Its README names @kingstinct/react-native-healthkit and react-native-health as the iOS alternatives, so a cross-platform React Native app installs one of those next to it.",
      },
      {
        q: "Do I still need expo-health-connect with react-native-health-connect?",
        a: "No. Since v4 the Expo config plugin and the Expo module that registers the permission delegate ship inside react-native-health-connect. The README says to uninstall expo-health-connect, replace it with react-native-health-connect in the app.json plugins array and re-run prebuild with --clean; leaving both installed fails the Android build with a duplicate class.",
      },
      {
        q: "What does HealthConnectPermissionDelegate do in react-native-health-connect?",
        a: "It lets the library receive the result of the Health Connect permission request. The README's MainActivity example sets it in onCreate with the comment that it is needed to handle permission contract results. React Native CLI apps add it themselves from version 2 on; Expo apps do not, because the bundled Expo module registers it.",
      },
    ],
  },
  {
    slug: "expo-health-connect",
    title: "expo-health-connect Is Deprecated: How to Remove It",
    metaDescription:
      "expo-health-connect is deprecated and merged into react-native-health-connect v4. The three migration steps and the duplicate-class build error it causes.",
    h1: "expo-health-connect (deprecated)",
    primaryQuery: "expo-health-connect deprecated",
    answer:
      "expo-health-connect is deprecated on npm, and its repository README says the repository is archived. Its config plugin and Expo module were merged into react-native-health-connect v4, so the fix is to uninstall expo-health-connect, put react-native-health-connect in its place in the app.json plugins array, and re-run prebuild with --clean. Leaving both installed breaks the Android build with a duplicate class.",
    wraps: {
      text: "Nothing on its own: it was an Expo config plugin that configured react-native-health-connect at prebuild time. The README says everything it did now ships inside react-native-health-connect as of v4.",
      quote: "This package is deprecated and this repository is archived.",
      source: R.expoHc,
      sourceLabel: README,
    },
    commandsHeading: "Migration commands",
    commands: [
      { label: "1. Remove the package", command: "npm uninstall expo-health-connect", source: R.expoHc, sourceLabel: README },
      {
        label: "2. In app.json plugins, replace \"expo-health-connect\" with \"react-native-health-connect\". 3. Re-run prebuild",
        command: "npx expo prebuild --clean",
        source: R.expoHc,
        sourceLabel: README,
      },
    ],
    notes: [
      {
        text: `The npm deprecation message, verbatim from the registry: "${lib("expo-health-connect").deprecated?.message ?? "none at the last check"}"`,
        source: "https://registry.npmjs.org/expo-health-connect",
        sourceLabel: "npm registry",
      },
      {
        text: "The duplicate-class failure. The README says that with react-native-health-connect v4 installed, keeping this package makes the Android build fail because both contribute the Kotlin class `expo.modules.healthconnect.HealthConnectPackage`. Removing this one resolves it.",
        source: R.expoHc,
        sourceLabel: README,
      },
      {
        text: "Issues go elsewhere now. The README says the repository no longer accepts contributions and asks for issues and pull requests on react-native-health-connect.",
        source: R.expoHc,
        sourceLabel: README,
      },
    ],
    nativeLinks: [
      { href: "/integrate/google-health-connect", label: "Health Connect integration guide", why: "What the merged package configures for you: permissions and the rationale activity." },
      { href: "/fix/health-connect-no-data", label: "Health Connect returns no data", why: "If reads come back empty after the migration." },
    ],
    faqs: [
      {
        q: "How do I fix the duplicate expo.modules.healthconnect.HealthConnectPackage build error?",
        a: "Uninstall expo-health-connect. Both it and react-native-health-connect v4 contribute that same Kotlin class, so the Android build fails while both are installed. The README's steps are: npm uninstall expo-health-connect, replace expo-health-connect with react-native-health-connect in the app.json plugins array, then run npx expo prebuild --clean.",
      },
      {
        q: "Is expo-health-connect still maintained?",
        a: "No. The npm registry marks it deprecated, and the README says the repository is archived and no longer accepts contributions. Its functionality lives on inside react-native-health-connect from v4, where issues should now be filed.",
      },
    ],
  },
  {
    slug: "react-native-google-fit",
    title: "react-native-google-fit and the Google Fit Shutdown",
    metaDescription:
      "react-native-google-fit bridges React Native to the Google Fit Android API, which Google supports only until the end of 2026. Status, dates, alternatives.",
    h1: "react-native-google-fit",
    primaryQuery: "react-native-google-fit",
    answer:
      "react-native-google-fit is a React Native bridge to the Google Fit API on Android. Its README acknowledges that Google has deprecated the Google Fit API in favour of Health Connect and says the maintainers will support the library while the API remains accessible. Google's Fit migration guide says the Google Fit API will only be supported until the end of 2026 and recommends Health Connect for step tracking and mobile-first apps.",
    wraps: {
      text: "The Google Fit API on Android, through Google Play Services and an OAuth 2.0 client configured in Google Cloud Console, according to the README's requirements.",
      quote: "A React Native bridge module for interacting with Google Fit on Android.",
      source: R.googleFit,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "Expo", command: "npx expo install react-native-google-fit", source: R.googleFit, sourceLabel: README },
      { label: "React Native CLI", command: "npm install react-native-google-fit --save", source: R.googleFit, sourceLabel: README },
    ],
    notes: [
      {
        text: "The README's own notice about the platform underneath it.",
        quote:
          "Google has deprecated the Google Fit API and is transitioning to Health Connect. While the Google Fit API remains available, we are committed to maintaining this library and bringing it up to the latest standards.",
        source: R.googleFit,
        sourceLabel: README,
      },
      {
        text: "Google's date. The Fit migration guide says the Google Fit API, including the REST API, will only be supported until the end of 2026, and recommends Health Connect for step tracking and mobile-first apps.",
        quote: "The Google Fit API (including the REST API) will only be supported until the end of 2026.",
        source: FIT_GUIDE,
        sourceLabel: FIT_GUIDE_LABEL,
      },
      {
        text: "\"Authorization Failed\". The README's troubleshooting section says to check that the SHA-1 certificate matches the one in Google Cloud Console, that the package name is correct, and that the test user's email is added to the OAuth consent screen.",
        source: R.googleFit,
        sourceLabel: README,
      },
    ],
    nativeLinks: [
      { href: "/google-fit-shutdown", label: "Google Fit shutdown: dates and what to do", why: "The platform deadline this package inherits." },
      { href: "/migrate/google-fit-to-health-connect", label: "Migrate from Google Fit to Health Connect", why: "The data-model and permission changes the move involves." },
      { href: "/fix/google-fit-api-deprecated", label: "Google Fit API deprecated", why: "What the deprecation means for an app still calling Fit." },
      { href: "/integrate/google-health-connect", label: "Health Connect integration guide", why: "The API Google points Fit apps to." },
    ],
    faqs: [
      {
        q: "Is react-native-google-fit deprecated?",
        a: `The package itself carried ${lib("react-native-google-fit").deprecated ? "a deprecation message" : "no deprecation message"} on npm at our last check, but the API under it is deprecated: its README says Google has deprecated the Google Fit API and is transitioning to Health Connect, and Google's Fit migration guide says the API will only be supported until the end of 2026.`,
      },
      {
        q: "Why does react-native-google-fit return Authorization Failed?",
        a: "The README's troubleshooting section lists three causes: the SHA-1 certificate fingerprint does not match the one registered in Google Cloud Console, the package name is wrong, or the test user's email is missing from the OAuth consent screen.",
      },
      {
        q: "What replaces react-native-google-fit for new Android work?",
        a: "Google's Fit migration guide recommends Health Connect for step tracking and mobile-first apps, and the Google Health API for cloud-based integrations. In React Native, Health Connect is reached through react-native-health-connect or one of the cross-platform Capacitor and Flutter plugins listed on this site.",
      },
    ],
  },
  {
    slug: "capacitor-health",
    title: "capacitor-health: Apple Health + Health Connect Plugin",
    metaDescription:
      "capacitor-health reads Apple Health and Health Connect from one Capacitor API. Install, manifest setup, the daily-bucket limit on Android, release dates.",
    h1: "capacitor-health",
    primaryQuery: "capacitor-health",
    answer:
      "capacitor-health is a Capacitor plugin that queries Apple Health on iOS and Health Connect on Android through one TypeScript API; its README credits cordova-plugin-health for some of its parts and concepts. Its package metadata declares iOS and Android native code. The README documents one limit that shapes chart code: queryAggregated only buckets by day on Android, while hour and week buckets work on iOS only.",
    wraps: {
      text: "Apple HealthKit on iOS and Health Connect on Android. The README asks for the HealthKit entitlement and the two Info.plist usage strings on iOS, and a permissions-rationale activity plus per-type permissions on Android.",
      quote: "Capacitor plugin to query data from Apple Health and Google Health Connect",
      source: R.capHealth,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "Add the plugin", command: "npm install capacitor-health", source: R.capHealth, sourceLabel: README },
      { label: "Sync native projects", command: "npx cap sync", source: R.capHealth, sourceLabel: README },
    ],
    notes: [
      {
        text: "Daily buckets only on Android, for every aggregated type.",
        quote: "`queryAggregated` only supports `bucket: 'day'` on Android; `'hour'` and `'week'` work on iOS only.",
        source: R.capHealth,
        sourceLabel: README,
      },
      {
        text: "Flights vs floors. The README says the plugin exposes one cross-platform permission, `READ_FLIGHTS_CLIMBED`, while the underlying Android permission is `android.permission.health.READ_FLOORS_CLIMBED`, and that Health Connect can report fractional flights where Apple Health reports whole ones.",
        source: R.capHealth,
        sourceLabel: README,
      },
      {
        text: "No writing app name on Android. The README says `sourceName` is iOS only.",
        quote: "Health Connect records carry no app name, so this is omitted on Android.",
        source: R.capHealth,
        sourceLabel: README,
      },
      {
        text: "Declare only what you request. The README warns that Health Connect shows every declared permission on the consent screen.",
        source: R.capHealth,
        sourceLabel: README,
      },
      {
        text: "Thirty days of Android history, no more. The README says that, like every other query in the plugin, its nutrition query does not request `READ_HEALTH_DATA_HISTORY`.",
        quote: "Health Connect only returns data from 30 days before the permission was first granted.",
        source: R.capHealth,
        sourceLabel: README,
      },
    ],
    nativeLinks: [...HC_LINKS.slice(0, 2), HK_LINKS[0], { href: "/matrix", label: "HealthKit ↔ Health Connect type matrix", why: "The cross-platform pairs a unified plugin has to reconcile." }],
    faqs: [
      {
        q: "Why does capacitor-health reject an hourly bucket on Android?",
        a: "Because the README documents that queryAggregated only supports bucket 'day' on Android, with 'hour' and 'week' working on iOS only, and says the limit applies to every aggregated data type. For hourly charts on Android, query raw records and bucket them yourself.",
      },
      {
        q: "Can capacitor-health read Health Connect data older than 30 days?",
        a: "Not according to its README, which says its queries do not request the READ_HEALTH_DATA_HISTORY permission, so Health Connect only returns data from 30 days before the permission was first granted. HealthKit on iOS has no such window.",
      },
      {
        q: "Why is sourceName missing on Android in capacitor-health?",
        a: "The README says sourceName, the name of the writing app, is iOS only because Health Connect records carry no app name, so the field is omitted on Android. Use the source bundle or package identifier the plugin returns instead if you need to tell writers apart.",
      },
    ],
  },
  {
    slug: "capgo-capacitor-health",
    title: "@capgo/capacitor-health: HealthKit and Health Connect",
    metaDescription:
      "@capgo/capacitor-health: Capgo's Capacitor plugin for HealthKit and Health Connect. Version-to-Capacitor mapping, the 30-day read cap, licence, dates.",
    h1: "@capgo/capacitor-health",
    primaryQuery: "@capgo/capacitor-health",
    answer: `@capgo/capacitor-health is Capgo's Capacitor plugin for reading and writing Apple HealthKit on iOS and Health Connect on Android with one set of data types and units. Its major version follows Capacitor's major version, and its README says only the latest major is actively maintained. Its npm metadata lists the licence as ${lib("capgo-capacitor-health").license ?? "unstated"}; the other Capacitor and Cordova health plugins listed here declare ${[...new Set(["capacitor-health", "perfood-capacitor-healthkit", "cordova-plugin-health"].map((x) => lib(x).license ?? "no licence"))].join(" / ")}.`,
    wraps: {
      text: "Apple HealthKit on iOS and Health Connect on Android. The README says the plugin uses Health Connect instead of Google Fit and that its manifest already declares the permissions for the basic data types.",
      quote: "Capacitor plugin to read and write health metrics via Apple HealthKit (iOS) and Health Connect (Android).",
      source: R.capgo,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "Add the plugin", command: "npm install @capgo/capacitor-health", source: R.capgo, sourceLabel: README },
      { label: "Sync native projects", command: "npx cap sync", source: R.capgo, sourceLabel: README },
    ],
    notes: [
      {
        text: "Match the plugin major to Capacitor. The README's compatibility table marks v8 maintained, v7 maintained on demand, and v6 and v5 unmaintained.",
        quote: "Only the latest major version is actively maintained.",
        source: R.capgo,
        sourceLabel: README,
      },
      {
        text: "The 30-day window. The README documents a `requestHistoryAccess` option that also requests `READ_HEALTH_DATA_HISTORY`, which the app must declare in its manifest, and says the permission only exists on sufficiently new Health Connect providers.",
        quote: "Without it, Health Connect caps reads to roughly the last 30 days; granting it lets you read older data.",
        source: R.capgo,
        sourceLabel: README,
      },
      {
        text: "No aggregation for some types. The README says aggregated queries are not supported for sleep, respiratory rate, oxygen saturation, heart rate variability and VO2 max, which should use `readSamples()` instead.",
        source: R.capgo,
        sourceLabel: README,
      },
      {
        text: `A claim to read with the list beside it. The README calls this "the only free, unified health data plugin for Capacitor". capacitor-health (${lib("capacitor-health").license ?? "licence unstated"}) and cordova-plugin-health (${lib("cordova-plugin-health").license ?? "licence unstated"}), both listed here, also cover both stores according to their READMEs and npm metadata.`,
        source: R.capgo,
        sourceLabel: "README and npm metadata",
      },
    ],
    nativeLinks: [...HC_LINKS.slice(0, 2), HK_LINKS[0], { href: "/matrix", label: "HealthKit ↔ Health Connect type matrix", why: "The cross-platform pairs a unified plugin has to reconcile." }],
    faqs: [
      {
        q: "Which @capgo/capacitor-health version matches my Capacitor version?",
        a: "The one with the same major version. The README says the plugin's major version follows Capacitor's, so plugin v8 is for Capacitor 8, and that only the latest major is actively maintained: v7 is maintained on demand and v6 and v5 are not maintained.",
      },
      {
        q: "Why does @capgo/capacitor-health only return 30 days of Android data?",
        a: "The README says Health Connect caps reads to roughly the last 30 days unless the READ_HEALTH_DATA_HISTORY permission is granted. Set requestHistoryAccess on the authorization request and declare the permission in AndroidManifest.xml; on providers too old to support it, the README says the returned status reports historyAccessAvailable as false.",
      },
    ],
  },
  {
    slug: "perfood-capacitor-healthkit",
    title: "@perfood/capacitor-healthkit: Status and Alternatives",
    metaDescription:
      "@perfood/capacitor-healthkit is an iOS-only Capacitor plugin for Apple Health. Its v2 alpha, the Capacitor version it targets, release dates, alternatives.",
    h1: "@perfood/capacitor-healthkit",
    primaryQuery: "@perfood/capacitor-healthkit",
    answer: `@perfood/capacitor-healthkit is an iOS-only Capacitor plugin for reading and writing Apple Health data. Its README says the maintainers are slowly working on a version 2, no longer accept pull requests to the main branch, and publish v2 as an alpha on npm. Its latest stable release declares a peer dependency of @capacitor/core ${req("perfood-capacitor-healthkit", "@capacitor/core") ?? "(unstated)"}, so check that against your Capacitor version before adopting it.`,
    wraps: {
      text: "Apple HealthKit only: its package metadata declares iOS native code and nothing for Android. The README adds that it covers only part of HealthKit for now.",
      quote: "Disclaimer : for now only some of the HK data base, in the future the retrieve base will be bigger !",
      source: R.perfood,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "Add the plugin", command: "npm i --save @perfood/capacitor-healthkit", source: R.perfood, sourceLabel: README },
      { label: "Update native projects", command: "npx cap update", source: R.perfood, sourceLabel: README },
    ],
    notes: [
      {
        text: "Main is frozen; v2 is in alpha.",
        quote:
          "We are slowly working on the next version of this plugin. PRs to the main branch are no longer being accepted, please work with the v2 branch from now on. v2 is already being published as alpha on npm.",
        source: R.perfood,
        sourceLabel: README,
      },
      {
        text: `The registry's dist-tags at our last read: ${Object.entries(lib("perfood-capacitor-healthkit").distTags ?? {})
          .map(([tag, v]) => `\`${tag}\` → ${v}`)
          .join(", ")}.`,
        source: "https://registry.npmjs.org/@perfood%2Fcapacitor-healthkit",
        sourceLabel: "npm registry",
      },
    ],
    nativeLinks: [...HK_LINKS, { href: "/tools/permission-builder", label: "HealthKit permission builder", why: "The Info.plist keys and read/share sets any HealthKit plugin needs." }],
    faqs: [
      {
        q: "Does @perfood/capacitor-healthkit support Android?",
        a: "No. Its package metadata declares iOS native code only, and the README covers Apple Health setup alone. For Health Connect on Android in a Capacitor app, the cross-platform options listed here are capacitor-health, @capgo/capacitor-health and cordova-plugin-health.",
      },
      {
        q: "Is there a newer version of @perfood/capacitor-healthkit?",
        a: `The README says v2 is being published as an alpha on npm and asks contributors to work on the v2 branch. At our last read of the registry the next tag pointed to ${lib("perfood-capacitor-healthkit").distTags?.next ?? "nothing"} while latest pointed to ${lib("perfood-capacitor-healthkit").latestVersion}.`,
      },
    ],
  },
  {
    slug: "cordova-plugin-health",
    title: "cordova-plugin-health: HealthKit + Health Connect",
    metaDescription:
      "cordova-plugin-health abstracts Apple HealthKit and Google Health Connect for Cordova and Capacitor. Install, manifest permissions, the end of Google Fit.",
    h1: "cordova-plugin-health",
    primaryQuery: "cordova-plugin-health",
    answer:
      "cordova-plugin-health is a Cordova plugin that abstracts Apple HealthKit and Google Health Connect behind one API, published on npm since 2016. From version 3 it was rewritten for Health Connect and no longer supports Google Fit; its README points anyone who still needs Fit to version 2.1.1. It does not add Health Connect permissions for you: each data type's permission has to be declared in AndroidManifest.xml, which the README suggests doing through config.xml.",
    wraps: {
      text: "Apple HealthKit on iOS and Google Health Connect on Android. The README says version 3 is a complete rewrite of the Android side for the Health Connect API.",
      quote: "A plugin that abstracts fitness and health repositories like Apple HealthKit or Google Health Connect.",
      source: R.cordova,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      {
        label: "Cordova",
        command:
          "cordova plugin add cordova-plugin-health --variable HEALTH_READ_PERMISSION='App needs read access' --variable HEALTH_WRITE_PERMISSION='App needs write access' --variable HEALTH_CONNECT_CLIENT_VERSION='1.2.0-alpha06'",
        source: R.cordova,
        sourceLabel: README,
      },
      {
        label: "Capacitor (then the README's manual manifest steps)",
        command: "npm install cordova-plugin-health",
        source: R.cordova,
        sourceLabel: README,
      },
    ],
    notes: [
      {
        text: "Permissions are yours to declare. The README says the list is too long to add them all, and that listing every permission may be problematic when submitting to the Play Store.",
        quote: "This plugin will NOT ADD PERMISSIONS for the data types that you need",
        source: R.cordova,
        sourceLabel: README,
      },
      {
        text: "Google Fit is gone from v3. The README says Fit is no longer supported and that anyone who still wants it must use version 2.1.1.",
        source: R.cordova,
        sourceLabel: README,
      },
      {
        text: "A privacy policy page is mandatory on Android. The README says the plugin shows `privacypolicy.html` from the project's `www` folder in a webview with JavaScript disabled when Health Connect asks for it.",
        source: R.cordova,
        sourceLabel: README,
      },
      {
        text: "Screen lock. The README notes that Health Connect requires the user to have a screen lock set with a PIN, pattern or password.",
        source: R.cordova,
        sourceLabel: README,
      },
      {
        text: "Capacitor needs manual edits. The README's Capacitor section, written against plugin v3.1.0 and @capacitor/android 5.5.1, says Capacitor does not apply this plugin's manifest and Gradle changes automatically and lists them step by step.",
        source: R.cordova,
        sourceLabel: README,
      },
    ],
    nativeLinks: [...HC_LINKS.slice(0, 2), HK_LINKS[0], { href: "/migrate/google-fit-to-health-connect", label: "Migrate from Google Fit to Health Connect", why: "What changed for apps that used this plugin's Fit-era version 2." }],
    faqs: [
      {
        q: "Does cordova-plugin-health still support Google Fit?",
        a: "No. The README says version 3 rewrote the Android side for Health Connect and that Google Fit is no longer supported; it points anyone who still needs Fit to version 2.1.1. Google's Fit migration guide says the Fit API will only be supported until the end of 2026.",
      },
      {
        q: "Can I use cordova-plugin-health in a Capacitor app?",
        a: "Yes, with manual steps. The README has a Capacitor section, based on plugin v3.1.0 and @capacitor/android 5.5.1, explaining that Capacitor does not apply the plugin's AndroidManifest.xml and Gradle changes automatically, and listing the privacy-policy activity, the Health Connect package query and the permissions to add by hand.",
      },
      {
        q: "Why does cordova-plugin-health not ask for any Health Connect permissions?",
        a: "Because it declares none for you. The README says the plugin will not add permissions for the data types you need, and that you must add each one to AndroidManifest.xml yourself, preferably through config.xml so that the permissions survive removing and re-adding the Android platform.",
      },
    ],
  },
  {
    slug: "flutter-health",
    title: "Flutter health Package: HealthKit and Health Connect",
    metaDescription:
      "The Flutter health package reads and writes Apple Health and Health Connect. Install, the 30-day Health Connect limit, Google Fit removal, release dates.",
    h1: "health (Flutter package)",
    primaryQuery: "flutter health package",
    answer:
      "health is the pub.dev package, maintained in the carp-dk/carp-health-flutter repository, that reads and writes Apple Health on iOS and Health Connect on Android from Flutter. It removed Google Fit support in version 11.0.0. Its README notes that Health Connect restricts reads to 30 days from when permission was granted, and that older data needs the READ_HEALTH_DATA_HISTORY permission, which the package requests through requestHealthDataHistoryAuthorization.",
    wraps: {
      text: "Apple Health (HealthKit) on iOS and Google Health Connect on Android, per the README and the platforms its pubspec declares.",
      quote: "Enables reading and writing health data from/to Apple Health and Google Health Connect.",
      source: R.flutterHealth,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [{ label: "Add the dependency", command: "flutter pub add health", source: pubInstall("health"), sourceLabel: "pub.dev install page" }],
    notes: [
      {
        text: "No more Google Fit.",
        quote: "this package has removed support for Google Fit as of version 11.0.0 and users are urged to upgrade as soon as possible.",
        source: R.flutterHealth,
        sourceLabel: README,
      },
      {
        text: "The 30-day window, and the way out. The README documents `isHealthDataHistoryAuthorized` and `requestHealthDataHistoryAuthorization`, which require `android.permission.health.READ_HEALTH_DATA_HISTORY` in the manifest.",
        quote: "By default, Health Connect restricts read data to 30 days from when permission has been granted.",
        source: R.flutterHealth,
        sourceLabel: README,
      },
      {
        text: "iOS floor. The README says the iOS side requires iOS 15.0 or later and ships as both a Swift package and a CocoaPods pod.",
        source: R.flutterHealth,
        sourceLabel: README,
      },
      {
        text: "Manual-entry filtering is not reliable on Android. The README calls it an open issue that `getTotalStepsInInterval(includeManualEntries: false)` does not necessarily filter out manual steps there.",
        source: R.flutterHealth,
        sourceLabel: README,
      },
      {
        text: "Routes. The README says Android only surfaces workout routes while the app is in the foreground, and that other apps' routes may come back flagged `ConsentRequired`.",
        source: R.flutterHealth,
        sourceLabel: README,
      },
    ],
    nativeLinks: [...HC_LINKS, HK_LINKS[0], { href: "/matrix", label: "HealthKit ↔ Health Connect type matrix", why: "The types a cross-platform plugin maps between the two stores." }],
    faqs: [
      {
        q: "Does the Flutter health package still support Google Fit?",
        a: "No. Its README says Google Fit support was removed as of version 11.0.0 and urges users to upgrade, citing Google's decision to stop new sign-ups to the Fit API. On Android the package now reads and writes Health Connect.",
      },
      {
        q: "Why does the Flutter health package only return 30 days of Android data?",
        a: "The README says Health Connect restricts reads to 30 days from when permission was granted. To read further back, declare android.permission.health.READ_HEALTH_DATA_HISTORY and request it with requestHealthDataHistoryAuthorization; isHealthDataHistoryAuthorized tells you whether it was granted.",
      },
      {
        q: "Why does getTotalStepsInInterval still count manual steps on Android?",
        a: "The README describes it as an open issue: filtering manual entries depends on the writing app having recorded the entry method, and on Android getTotalStepsInInterval with includeManualEntries false does not necessarily filter out manual steps.",
      },
    ],
  },
  {
    slug: "health-connector",
    title: "health_connector: Flutter HealthKit + Health Connect",
    metaDescription:
      "health_connector is a newer Flutter SDK for HealthKit and Health Connect. Install, minimum Flutter, Dart, iOS and Android versions, release dates.",
    h1: "health_connector",
    primaryQuery: "health_connector flutter",
    answer: `health_connector is a Flutter SDK for Apple HealthKit and Android Health Connect, first published on pub.dev in ${monthYear(lib("health-connector").firstPublished)}. Its README describes typed access to 143 health data types, incremental synchronisation and update operations — the project's own description. It sets higher floors than older plugins: its requirements table lists Flutter 3.38, Dart 3.10, iOS 15 and Android API 26.`,
    wraps: {
      text: "Apple HealthKit on iOS and Android Health Connect. Its app-facing pubspec declares no platforms itself; it depends on separate health_connector_hk_ios and health_connector_hc_android packages, and pub.dev's own analysis tags it for Android and iOS.",
      quote: "Production-grade Flutter health SDK for iOS HealthKit and Android Health Connect.",
      source: R.healthConnector,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "Add the dependency", command: "flutter pub add health_connector", source: pubInstall("health_connector"), sourceLabel: "pub.dev install page" },
    ],
    notes: [
      {
        text: "Requirements, from the README's table: Flutter SDK 3.38.0 or later with Dart 3.10.0; Android API 26+ with Kotlin 2.1.0 and Java 17; iOS 15.0+ with Swift 5.9.",
        source: R.healthConnector,
        sourceLabel: README,
      },
      {
        text: "An Android SDK extension floor. The README says version 3.9.0 requires SDK Extension level 19, because Google's Health Connect SDK 1.2.0-alpha03 requires it.",
        source: R.healthConnector,
        sourceLabel: README,
      },
      {
        text: "History beyond 30 days is a feature permission. The README says Health Connect defaults to 30 days and that older data needs `HealthPlatformFeature.readHealthDataHistory`, with `android.permission.health.READ_HEALTH_DATA_HISTORY` in the manifest; it adds that HealthKit has no such restriction.",
        source: R.healthConnector,
        sourceLabel: README,
      },
      {
        text: "Marketing, labelled. \"Production-grade\" and \"143 typed health data types\" are the README's words. We have not counted the types; the project links a searchable type catalog on its own website.",
        source: R.healthConnector,
        sourceLabel: README,
      },
    ],
    nativeLinks: [...HC_LINKS.slice(0, 2), HK_LINKS[0], HK_LINKS[1]],
    faqs: [
      {
        q: "What are the minimum versions for health_connector?",
        a: "Its README's requirements table lists Flutter SDK 3.38.0 or later with Dart 3.10.0, Android API 26 or later with Kotlin 2.1.0 and Java 17, and iOS 15.0 or later with Swift 5.9. Separately, it says version 3.9.0 needs Android SDK Extension level 19.",
      },
      {
        q: "Is health_connector or the Flutter health package older?",
        a: `The Flutter health package is much older: pub.dev records its first version in ${monthYear(lib("flutter-health").firstPublished)}, against ${monthYear(lib("health-connector").firstPublished)} for health_connector. Both cover HealthKit and Health Connect; our comparison page sets their registry facts side by side.`,
      },
    ],
  },
  {
    slug: "health-kit-reporter",
    title: "health_kit_reporter: iOS-Only HealthKit for Flutter",
    metaDescription:
      "health_kit_reporter is an iOS-only Flutter wrapper around the HealthKitReporter pod. Install, the README vs published-version gap, release dates.",
    h1: "health_kit_reporter",
    primaryQuery: "health_kit_reporter",
    answer: `health_kit_reporter is an iOS-only Flutter plugin that wraps the HealthKitReporter CocoaPods library for reading, writing and observing HealthKit data. Its latest pub.dev release is ${lib("health-kit-reporter").latestVersion}, published ${monthYear(lib("health-kit-reporter").latestPublished)}. When we read it on ${LIBRARIES_VERIFIED_ON}, the README on the repository's default branch documented a 3.1.0 dependency and a temporary Podfile override instead, so follow the README that matches the version you install.`,
    wraps: {
      text: "Apple HealthKit on iOS, through the HealthKitReporter CocoaPods library. Its pubspec declares iOS as the only plugin platform.",
      quote: "iOS only usage, since AppleHealth is not available on Android devices.",
      source: R.hkReporter,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "Add the dependency", command: "flutter pub add health_kit_reporter", source: pubInstall("health_kit_reporter"), sourceLabel: "pub.dev install page" },
    ],
    notes: [
      {
        text: `README and registry disagree. The default-branch README tells you to depend on \`health_kit_reporter: ^3.1.0\` and to point the HealthKitReporter pod at a fork's \`feature_add_clinical_records\` branch until an upstream pull request is merged. pub.dev's latest version at our read was ${lib("health-kit-reporter").latestVersion}, and its package page showed a \`^${lib("health-kit-reporter").latestVersion}\` dependency.`,
        source: R.hkReporter,
        sourceLabel: "README and pub.dev package page",
      },
      {
        text: "Workout routes need location permission. The README asks for the two CoreLocation usage strings if you use workout route series.",
        source: R.hkReporter,
        sourceLabel: README,
      },
    ],
    nativeLinks: [...HK_LINKS, { href: "/tools/permission-builder", label: "HealthKit permission builder", why: "The Info.plist keys and read/share sets any HealthKit plugin needs." }],
    faqs: [
      {
        q: "Does health_kit_reporter work on Android?",
        a: "No. Its README says it is for iOS only because Apple Health is not available on Android devices, and its pubspec declares iOS as the only plugin platform. For Flutter apps that need both stores, the cross-platform packages listed here are health and health_connector.",
      },
      {
        q: "Why does the health_kit_reporter README mention version 3.1.0?",
        a: `Because the README on the repository's default branch is ahead of pub.dev. At our ${LIBRARIES_VERIFIED_ON} read it documented a 3.1.0 dependency and a temporary Podfile override, while the latest version published on pub.dev was ${lib("health-kit-reporter").latestVersion}. The pub.dev page shows the README for the published version.`,
      },
    ],
  },
  {
    slug: "flutter-health-connect",
    title: "flutter_health_connect: Health Connect for Flutter",
    metaDescription:
      "flutter_health_connect is a Health Connect-only Flutter plugin. Install, its Android requirements, its Dart SDK constraint and how recently it shipped.",
    h1: "flutter_health_connect",
    primaryQuery: "flutter_health_connect",
    answer: `flutter_health_connect is a Flutter plugin for Android Health Connect only. Its latest pub.dev release dates from ${monthYear(lib("flutter-health-connect").latestPublished)}, and its pubspec declares a Dart SDK constraint of ${req("flutter-health-connect", "sdk") ?? "(unstated)"}. The cross-platform Flutter packages listed here published their latest releases on ${lib("flutter-health").latestPublished} (health) and ${lib("health-connector").latestPublished} (health_connector) — compare those dates with its own before adding it to a project.`,
    wraps: {
      text: "Android Health Connect. The README documents Android setup only. Its pubspec also registers an iOS plugin class, but the README describes no iOS behaviour and never mentions HealthKit.",
      quote: "Flutter plugin for Google Health Connect integration.",
      source: R.flutterHc,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "Add the dependency", command: "flutter pub add flutter_health_connect", source: pubInstall("flutter_health_connect"), sourceLabel: "pub.dev install page" },
    ],
    notes: [
      {
        text: "Android requirements, from the README: minSdkVersion 26 (28 recommended), compileSdkVersion 34, and Flutter 2.5.0 or higher.",
        source: R.flutterHc,
        sourceLabel: README,
      },
      {
        text: "Every data type needs a manifest permission. The README lists the `android.permission.health.READ_*` and `WRITE_*` declarations and the `com.google.android.apps.healthdata` package query.",
        source: R.flutterHc,
        sourceLabel: README,
      },
    ],
    nativeLinks: HC_LINKS,
    faqs: [
      {
        q: "Does flutter_health_connect work on iOS?",
        a: "Not for health data. Health Connect is an Android platform, and the README documents Android setup only. Its pubspec does register an iOS plugin class, but the README describes no iOS behaviour and does not mention HealthKit; for both stores in Flutter, look at health or health_connector.",
      },
      {
        q: "When was flutter_health_connect last updated?",
        a: `pub.dev records its latest version, ${lib("flutter-health-connect").latestVersion}, as published ${lib("flutter-health-connect").latestPublished}. The last commit on its repository's default branch at our read was ${lib("flutter-health-connect").lastCommitOnDefaultBranch?.date ?? "not readable"}.`,
      },
    ],
  },
  {
    slug: "garminconnect",
    title: "garminconnect: Python Client for Garmin Connect Data",
    metaDescription:
      "garminconnect is an unofficial Python client for Garmin Connect. Install, how its login and token storage work, the garth migration, release dates.",
    h1: "garminconnect (Python)",
    primaryQuery: "garminconnect python",
    answer:
      "garminconnect is an unofficial Python client for Garmin Connect, the web service behind Garmin's consumer app, signed in with the user's own credentials. Its README says it logs in through the same mobile SSO flow as the official Garmin Connect Android app, stores tokens in ~/.garminconnect/garmin_tokens.json, and stopped using garth in version 0.3.0. It requires Python 3.12 or later.",
    wraps: {
      text: "Garmin Connect's web services, signed in as the user with their own credentials. The README describes it as an unofficial client that does not pair with the phone app or connect to a watch.",
      quote: "This is an unofficial client for Garmin's web services; it does not pair with the Garmin Connect phone app or connect directly to a watch.",
      source: R.garminconnect,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "From PyPI", command: "pip install --upgrade garminconnect curl_cffi", source: R.garminconnect, sourceLabel: README },
    ],
    notes: [
      {
        text: "garth sessions do not carry over.",
        quote:
          "Since 0.3.0 this library no longer uses garth, which is deprecated. Sessions saved by older versions (oauth1_token.json/oauth2_token.json, created with garth.save()) cannot be converted",
        source: R.garminconnect,
        sourceLabel: README,
      },
      {
        text: "How sign-in works, per the README: a first login against Garmin's mobile SSO endpoint with an MFA callback (`prompt_mfa`) if needed, then an exchange for an access and refresh token pair that auto-refreshes before each request.",
        source: R.garminconnect,
        sourceLabel: README,
      },
      {
        text: "Treat the token file as a password. The README says the refresh token can provide persistent account access, and that the file is saved with mode 0600 in a 0700 directory.",
        source: R.garminconnect,
        sourceLabel: README,
      },
    ],
    nativeLinks: [
      { href: "/integrate/garmin-api", label: "Garmin API integration guide", why: "Garmin's official developer program — the route for an app serving other people's data." },
      { href: "/fix/garmin-api-approval", label: "Garmin API approval", why: "What the official program's access gate involves." },
    ],
    faqs: [
      {
        q: "Can garminconnect reuse tokens saved by garth?",
        a: "No. The README says that since 0.3.0 the library no longer uses garth, and that sessions saved by older versions with garth.save() cannot be converted. Log in once with username and password; new tokens are saved to garmin_tokens.json in your token store and used for later logins.",
      },
      {
        q: "Is garminconnect an official Garmin API?",
        a: "No. Its README calls it an unofficial client for Garmin's web services that signs in with the user's own credentials. For an app that serves other people's Garmin data, see our Garmin API guide, which covers Garmin's official developer program.",
      },
    ],
  },
  {
    slug: "garth",
    title: "garth Is Deprecated: Garmin Auth for Python",
    metaDescription:
      "garth, the Python Garmin Connect auth library, is deprecated: Garmin changed its auth flow. What still works for existing sessions and what replaced it.",
    h1: "garth (deprecated)",
    primaryQuery: "garth deprecated",
    answer: `garth, a Python library for Garmin Connect authentication, is deprecated: its README says Garmin changed its auth flow, breaking the mobile auth approach garth depended on, and calls the latest release the final one. A saved session with a valid OAuth1 token may keep working until that token expires, but new logins will not. ${lib("garth").registryStatus ? `Its PyPI classifier reads "${lib("garth").registryStatus}", and` : "And"} garminconnect dropped it as a dependency in version 0.3.0.`,
    wraps: {
      text: "Garmin's SSO login and the Garmin Connect API, through the mobile auth approach the README says Garmin's change broke.",
      quote:
        "Garth is deprecated and no longer maintained. Garmin changed their auth flow, breaking the mobile auth approach that Garth depends on.",
      source: R.garth,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [],
    noCommandNote:
      "The README no longer documents an install command. The PyPI distribution is still named garth; installing it now gets you the final release.",
    notes: [
      {
        text: "What still works.",
        quote:
          "If you already have a saved session with a valid OAuth1 token, Garth may continue to work until that token expires (~1 year from when it was issued). New logins will not work.",
        source: R.garth,
        sourceLabel: README,
      },
      {
        text: "Forks are invited. The README says anyone is welcome to fork garth as a starting point for a new library, and keeps its documentation online for reference.",
        source: R.garth,
        sourceLabel: README,
      },
    ],
    nativeLinks: [{ href: "/integrate/garmin-api", label: "Garmin API integration guide", why: "Garmin's official developer program, which does not depend on mobile-app sign-in." }],
    faqs: [
      {
        q: "Why does garth login stop working?",
        a: "Because Garmin changed its authentication flow. The garth README says the change broke the mobile auth approach garth depends on, that the maintainer cannot adapt it, and that new logins will not work. A previously saved session with a valid OAuth1 token may continue until that token expires, roughly a year after it was issued.",
      },
      {
        q: "What should I use instead of garth?",
        a: `garth's README invites forks but names no successor. garminconnect, which used garth until version 0.3.0, now handles its own sign-in according to its README, and published version ${lib("garminconnect").latestVersion} on ${lib("garminconnect").latestPublished}. Its README also says garth-era saved sessions cannot be converted, so expect one fresh login.`,
      },
    ],
  },
  {
    slug: "stravalib",
    title: "stravalib: Python Client for the Strava V3 API",
    metaDescription:
      "stravalib is the Python package for the Strava V3 API: auth, activities, clubs and athlete data. Install, required Python version, release dates.",
    h1: "stravalib",
    primaryQuery: "stravalib",
    answer: `stravalib is a Python package for the Strava V3 API: authenticating, keeping a token current, downloading activity, club and profile data, and changing a user's activities. Its README lists Python 3.11+ with requests, pint, arrow and pydantic 2.x, and it uses Pint for unit-aware quantities. It wraps Strava's API rather than replacing it, so you still register a Strava app first, as its first tutorial explains; its latest PyPI release is ${lib("stravalib").latestVersion}.`,
    wraps: {
      text: "The Strava V3 REST API, through a `stravalib.client.Client` class, per the README.",
      quote:
        "The stravalib Python package provides easy-to-use tools for accessing and downloading Strava data from the Strava V3 API.",
      source: R.stravalib,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [{ label: "From PyPI", command: "pip install stravalib", source: R.stravalib, sourceLabel: README }],
    notes: [
      {
        text: "Units are objects. The README says stravalib supports quantities through the Pint library, so distances and speeds come back unit-aware rather than as bare floats.",
        source: R.stravalib,
        sourceLabel: README,
      },
      {
        text: "Start with the README's tutorials: creating a Strava app, refreshing and auto-refreshing the token, and getting activities and athlete data.",
        source: R.stravalib,
        sourceLabel: README,
      },
    ],
    nativeLinks: [
      { href: "/integrate/strava-api", label: "Strava API integration guide", why: "Strava's OAuth, scopes and webhooks — the API stravalib calls." },
      { href: "/fix/strava-api-401-unauthorized", label: "Strava API 401 Unauthorized", why: "The error an expired or under-scoped token produces, whatever the client." },
      { href: "/fix/strava-webhook-not-firing", label: "Strava webhook not firing", why: "Webhooks sit outside what a polling client like this handles." },
    ],
    faqs: [
      {
        q: "Which Python version does stravalib require?",
        a: `Its README lists Python 3.11+, and its PyPI metadata declares requires_python ${req("stravalib", "python") ?? "(unstated)"}. The README also lists requests, pint, arrow and pydantic 2.x as dependencies that pip installs automatically.`,
      },
      {
        q: "Can stravalib edit Strava activities as well as read them?",
        a: "Yes. The README lists making changes to account activities among the Client class's features, alongside authentication, keeping the token current and downloading activity, club and profile data.",
      },
    ],
  },
  {
    slug: "oura-ring",
    title: "oura-ring: Python Client for the Oura API v2",
    metaDescription:
      "oura-ring is a Python client for the Oura API v2 with an OAuth2 helper. Install, the personal-access-token change, endpoints covered, release dates.",
    h1: "oura-ring (Python)",
    primaryQuery: "oura-ring python",
    answer: `oura-ring is a Python client for the Oura API v2 with an OAuth2 helper, OuraAuth, for the authorization-code flow. Its README notes that Oura deprecated personal access tokens in December 2025, so new integrations must use OAuth2, though OuraClient still accepts a previously issued token. Its PyPI metadata requires Python ${req("oura-ring", "python") ?? "(unstated)"}.`,
    wraps: {
      text: "The Oura API v2. The README's contents cover personal info, daily sleep, SpO2, stress, activity, readiness, resilience, cardiovascular age, VO2 max, heart rate, ring battery and configuration, sessions, tags and workouts.",
      quote: "Python client for the Oura API v2 with OAuth2 support.",
      source: R.ouraRing,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [
      { label: "pip", command: "pip install oura-ring", source: R.ouraRing, sourceLabel: README },
      { label: "uv", command: "uv add oura-ring", source: R.ouraRing, sourceLabel: README },
    ],
    notes: [
      {
        text: "The token change, in the README's words.",
        quote:
          "Personal access tokens were deprecated by Oura in December 2025 — new ones can no longer be created, though previously-issued tokens may still work. New integrations must use OAuth2.",
        source: R.ouraRing,
        sourceLabel: README,
      },
      {
        text: "The OAuth2 flow it wraps: `OuraAuth(client_id, client_secret)`, then `authorize_url(redirect_uri=…, state=…)`, `exchange_code(code, redirect_uri=…)` and `refresh_token(…)`, with the access token passed to `OuraClient`.",
        source: R.ouraRing,
        sourceLabel: README,
      },
    ],
    nativeLinks: [
      { href: "/integrate/oura-api", label: "Oura API integration guide", why: "Oura's OAuth app setup and data model, which this client calls." },
      { href: "/fix/oura-personal-access-token-deprecated", label: "Oura personal access token deprecated", why: "What changed for PAT-based scripts and how to move to OAuth." },
    ],
    faqs: [
      {
        q: "Does oura-ring still work with an Oura personal access token?",
        a: "Only one that was already issued. The README says Oura deprecated personal access tokens in December 2025 so new ones cannot be created, that previously issued tokens may still work, and that OuraClient accepts either an OAuth2 access token or a legacy token. New integrations must use OAuth2.",
      },
      {
        q: "How do I get an OAuth2 token with oura-ring?",
        a: "Create an application in Oura's developer portal for a client ID and secret, then follow the README: build OuraAuth, send the user to authorize_url with your redirect URI and a state value, exchange the returned code with exchange_code, and pass the access token to OuraClient. refresh_token renews it.",
      },
    ],
  },
  {
    slug: "oura-python",
    title: "oura (python-ouraring): Maintenance and API v2 Status",
    metaDescription:
      "oura on PyPI is python-ouraring, an older Oura API client. Its maintainer's handover note, v2 client status, the PAT change, release dates.",
    h1: "oura (python-ouraring)",
    primaryQuery: "python-ouraring",
    answer: `oura is the PyPI name of python-ouraring, an older Python client for the Oura API. Its README says the maintainer cannot commit to the quality and responsiveness users deserve and invites someone to take the project over, and that the v2 clients have not been tested with the OAuth2 flow. Its examples still start from a personal access token, which Oura stopped issuing in December 2025 according to the oura-ring README; its latest PyPI release dates from ${monthYear(lib("oura-python").latestPublished)}.`,
    wraps: {
      text: "The Oura API, with v2 clients under `oura.v2` (`OuraClientV2`, `OuraClientDataFrameV2`) whose methods are named after the URL paths, per the README.",
      source: R.oura,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [{ label: "From PyPI", command: "pip install oura", source: R.oura, sourceLabel: README }],
    notes: [
      {
        text: "A handover request. The README asks anyone interested in taking over maintenance to get in touch or open an issue, or to fork and publish under a new name.",
        quote:
          "I still plan on doing what I can to keep this up to date, but don't feel I can commit to maintaining a level of quality and responsiveness that you all deserve.",
        source: R.oura,
        sourceLabel: README,
      },
      {
        text: "The v2 caveat.",
        quote: "I haven't tested the v2 clients with the OAuth2 flow.",
        source: R.oura,
        sourceLabel: README,
      },
      {
        text: "Personal access tokens. The README's getting-started path is a PAT. The oura-ring README says Oura deprecated PATs in December 2025, so new ones cannot be created.",
        source: R.ouraRing,
        sourceLabel: "oura-ring README",
      },
    ],
    nativeLinks: [
      { href: "/integrate/oura-api", label: "Oura API integration guide", why: "Oura's OAuth app setup and data model." },
      { href: "/fix/oura-personal-access-token-deprecated", label: "Oura personal access token deprecated", why: "Why a PAT-first client needs an OAuth path now." },
    ],
    faqs: [
      {
        q: "Does the oura Python package support the Oura v2 API?",
        a: "It ships v2 clients: the README shows OuraClientV2 and OuraClientDataFrameV2 imported from oura.v2, with methods named after the API's URL paths. The same README says the maintainer has not tested the v2 clients with the OAuth2 flow.",
      },
      {
        q: "Is python-ouraring the same package as oura on PyPI?",
        a: "Yes. The repository is turing-complet/python-ouraring and the README installs it with pip install oura; there is no PyPI distribution called python-ouraring. It is a different project from oura-ring, which is a separate client for the Oura API v2.",
      },
    ],
  },
  {
    slug: "python-fitbit",
    title: "python-fitbit and the Fitbit Web API Retirement",
    metaDescription:
      "python-fitbit (PyPI: fitbit) is a client for the legacy Fitbit Web API. When it last shipped, what its README requires, where Google points Fitbit apps.",
    h1: "python-fitbit (PyPI: fitbit)",
    primaryQuery: "python-fitbit",
    answer: `python-fitbit, published on PyPI as fitbit, is a Python client for the legacy Fitbit Web API built on requests-oauthlib. Its latest release dates from ${monthYear(lib("python-fitbit").latestPublished)} and its README still lists Python 2.7+. Google's Fit migration guide lists the Google Health API as the recommended path for Fitbit Web API integrations, so this client targets an API Google is steering developers away from.`,
    wraps: {
      text: "The legacy Fitbit Web API, using requests-oauthlib and python-dateutil according to the README's requirements.",
      quote: "Fitbit API Python Client Implementation",
      source: R.fitbit,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [],
    noCommandNote:
      "The README documents no pip install line; it installs requirement files from a checkout (sudo pip install -r requirements/base.txt). The PyPI distribution is named fitbit, not python-fitbit.",
    notes: [
      {
        text: "Requirements as the README states them: Python 2.7+, python-dateutil and requests-oauthlib.",
        source: R.fitbit,
        sourceLabel: README,
      },
      {
        text: "Where Google points Fitbit integrations. The Fit migration guide's table lists \"Fitbit Web API\" with \"Google Health API\" as the recommended path, and describes the Google Health API as a web-centric platform for Fitbit and Google device data.",
        source: FIT_GUIDE,
        sourceLabel: FIT_GUIDE_LABEL,
      },
    ],
    nativeLinks: [
      { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown: what is confirmed", why: "What is and is not verified about the legacy API's turndown." },
      { href: "/migrate/fitbit-web-api-to-google-health", label: "Migrate the Fitbit Web API to Google Health", why: "The re-consent and schema work the move involves." },
      { href: "/integrate/fitbit-api", label: "Fitbit API integration guide", why: "The API this client was written for." },
      { href: "/fix/fitbit-error-code-401", label: "Fitbit error code 401", why: "The token errors a legacy client most often hits." },
    ],
    faqs: [
      {
        q: "Does python-fitbit work with the Google Health API?",
        a: "Nothing in its README says so. python-fitbit was written for the legacy Fitbit Web API, its latest PyPI release is from 2019, and Google's Fit migration guide lists the Google Health API as the recommended path for Fitbit Web API integrations — a different API with Google OAuth, which this client does not mention.",
      },
      {
        q: "What is the pip package name for python-fitbit?",
        a: "fitbit. The repository is orcasgit/python-fitbit, but the PyPI distribution is named fitbit, and there is no PyPI project called python-fitbit. The README itself documents installing requirement files from a checkout rather than a pip install line.",
      },
    ],
  },
  {
    slug: "withings-api",
    title: "withings-api: Python Client for the Withings API",
    metaDescription:
      "withings-api is a Python client for the Withings Health API over OAuth 2.0. Install, demo mode for testing, supported Python versions, release dates.",
    h1: "withings-api (Python)",
    primaryQuery: "withings-api python",
    answer: `withings-api is a Python client for the Withings Health API that authenticates with OAuth 2.0, using a client ID and consumer secret from a Withings developer application. Its README shows a demo mode for testing against Withings' demo data. Its latest PyPI release dates from ${monthYear(lib("withings-api").latestPublished)} and declares Python ${req("withings-api", "python") ?? "(unstated)"}, so test it against your Python version before relying on it.`,
    wraps: {
      text: "The Withings Health API over OAuth 2.0, through `WithingsAuth` and `WithingsApi`, per the README.",
      quote: "Python library for the Withings Health API",
      source: R.withings,
      sourceLabel: README,
    },
    commandsHeading: "Install",
    commands: [{ label: "From PyPI", command: "pip install withings-api", source: R.withings, sourceLabel: README }],
    notes: [
      {
        text: "Demo mode. The README's example passes `mode='demo'` to `WithingsAuth` for testing, with a comment to remove it when getting real user data.",
        source: R.withings,
        sourceLabel: README,
      },
      {
        text: "Cached test credentials. The README says its integration test caches credentials in a `.credentials` file, and to delete that file if you get an access-token-expired error.",
        source: R.withings,
        sourceLabel: README,
      },
    ],
    nativeLinks: [
      { href: "/fix/oauth-redirect-uri-mismatch", label: "OAuth redirect URI mismatch", why: "The first error most OAuth clients like this one hit." },
      { href: "/fix/refresh-token-not-working", label: "Refresh token not working", why: "What to check when a stored OAuth credential stops refreshing." },
    ],
    faqs: [
      {
        q: "How do I test withings-api without real user data?",
        a: "The README's example passes mode='demo' to WithingsAuth, which it describes as used for testing against Withings' demo data, and says to remove it when getting real user data. Its integration test script runs against the same demo data.",
      },
      {
        q: "Which Python versions does withings-api support?",
        a: `Its PyPI metadata declares requires_python ${req("withings-api", "python") ?? "(unstated)"}, and its latest release, ${lib("withings-api").latestVersion}, was published ${lib("withings-api").latestPublished}. A version range in metadata is the author's declaration, not a test result, so run your own tests on the interpreter you deploy.`,
      },
    ],
  },
];

// ── Comparisons ───────────────────────────────────────────────────────────

export type LibraryComparison = {
  slug: string;
  a: string;
  b: string;
  title: string;
  metaDescription: string;
  h1: string;
  primaryQuery: string;
  answer: string;
  /** What each side's own README says that bears on the choice. */
  points: { side: "a" | "b"; note: SourcedNote }[];
  /** Decision rules derived from the facts above — labelled as our reading. */
  choose: string[];
  faqs: Faq[];
};

export const LIBRARY_COMPARISONS: LibraryComparison[] = [
  {
    slug: "react-native-health-vs-kingstinct-react-native-healthkit",
    a: "react-native-health",
    b: "kingstinct-react-native-healthkit",
    title: "react-native-health vs @kingstinct/react-native-healthkit",
    metaDescription:
      "react-native-health vs @kingstinct/react-native-healthkit for HealthKit in React Native: release dates, peer dependencies, API style and README caveats.",
    h1: "react-native-health vs @kingstinct/react-native-healthkit",
    primaryQuery: "react-native-health vs react-native-healthkit",
    answer: `Both packages bridge React Native to Apple HealthKit on iOS and neither covers Android. react-native-health is callback-based with its own permission constants, and its README has said since August 2023 that new features are on hold; its latest npm release is from ${monthYear(lib("react-native-health").latestPublished)}. @kingstinct/react-native-healthkit is promise- and hook-based, uses Apple's identifier strings, requires react-native-nitro-modules, and published ${lib("kingstinct-react-native-healthkit").latestVersion} in ${monthYear(lib("kingstinct-react-native-healthkit").latestPublished)}.`,
    points: [
      {
        side: "a",
        note: {
          text: "Permissions use the package's own constants, such as `AppleHealthKit.Constants.Permissions.HeartRate`, passed to `initHealthKit` with a callback.",
          source: R.rnHealth,
          sourceLabel: README,
        },
      },
      {
        side: "a",
        note: {
          text: "Feature freeze since August 2023 while a Swift rewrite is prepared; critical bug-fix and dependency PRs are still welcomed.",
          source: R.rnHealth,
          sourceLabel: README,
        },
      },
      {
        side: "b",
        note: {
          text: "Types are Apple's own identifier strings, such as `HKQuantityTypeIdentifierHeartRate`, with promises and React hooks (`useHealthkitAuthorization`, `useMostRecentQuantitySample`).",
          source: R.kingstinct,
          sourceLabel: README,
        },
      },
      {
        side: "b",
        note: {
          text: "Reading before requesting authorization crashes the app, per the README; anchored queries return deleted samples for sync.",
          source: R.kingstinct,
          sourceLabel: README,
        },
      },
    ],
    choose: [
      `Your app is on an older React Native version: check the Requires row first. @kingstinct/react-native-healthkit's latest release declares react-native ${req("kingstinct-react-native-healthkit", "react-native") ?? "(unstated)"} and react ${req("kingstinct-react-native-healthkit", "react") ?? "(unstated)"}; react-native-health's declares react-native ${req("react-native-health", "react-native") ?? "(unstated)"}.`,
      "You need HealthKit types Apple added recently: the package with the more recent release is the more likely to have them, but confirm the specific identifier in its source rather than inferring from dates.",
      "You want typed identifiers that match Apple's documentation one-to-one: that is @kingstinct/react-native-healthkit's stated design goal.",
      "You already ship react-native-health and it covers your types: its README says bug-fix pull requests are still merged, so a migration is a choice, not an emergency.",
    ],
    faqs: [
      {
        q: "Is @kingstinct/react-native-healthkit a fork of react-native-health?",
        a: `Neither README says so. They are separate projects in separate repositories with different APIs — one callback-based with its own permission constants, one promise-based with Apple's identifier strings — and npm records their first publishes as ${lib("kingstinct-react-native-healthkit").firstPublished} for @kingstinct/react-native-healthkit and ${lib("react-native-health").firstPublished} for react-native-health.`,
      },
      {
        q: "Can I switch from react-native-health to @kingstinct/react-native-healthkit without rewriting queries?",
        a: "No. The APIs differ: react-native-health uses initHealthKit with its own permission constants and callbacks, while @kingstinct/react-native-healthkit uses requestAuthorization with HealthKit identifier strings, promises and hooks. Every call site changes, and the second package also needs react-native-nitro-modules installed.",
      },
    ],
  },
  {
    slug: "capacitor-health-vs-capgo-capacitor-health",
    a: "capacitor-health",
    b: "capgo-capacitor-health",
    title: "capacitor-health vs @capgo/capacitor-health Compared",
    metaDescription:
      "capacitor-health vs @capgo/capacitor-health: two Capacitor plugins for HealthKit and Health Connect. Licences, release dates and README-documented limits.",
    h1: "capacitor-health vs @capgo/capacitor-health",
    primaryQuery: "capacitor-health vs @capgo/capacitor-health",
    answer: `Both are Capacitor plugins that cover Apple HealthKit and Health Connect behind one TypeScript API, and both declare iOS and Android native code. The visible differences are the licence (${lib("capacitor-health").license ?? "unstated"} for capacitor-health, ${lib("capgo-capacitor-health").license ?? "unstated"} for @capgo/capacitor-health, per npm), who publishes it (mley/capacitor-health versus Capgo, whose README also advertises Capgo's app-update and plugin-building services), and the limits each README documents, set out below — including Health Connect history, which only one of them requests.`,
    points: [
      {
        side: "a",
        note: {
          text: "`queryAggregated` buckets by day only on Android; hour and week work on iOS only.",
          source: R.capHealth,
          sourceLabel: README,
        },
      },
      {
        side: "a",
        note: {
          text: "Does not request `READ_HEALTH_DATA_HISTORY`, so Health Connect returns only data from 30 days before the permission was first granted.",
          source: R.capHealth,
          sourceLabel: README,
        },
      },
      {
        side: "b",
        note: {
          text: "Plugin major version follows Capacitor's; only the latest major is actively maintained.",
          source: R.capgo,
          sourceLabel: README,
        },
      },
      {
        side: "b",
        note: {
          text: "No aggregated queries for sleep, respiratory rate, oxygen saturation, HRV or VO2 max; a `requestHistoryAccess` option for reads older than about 30 days.",
          source: R.capgo,
          sourceLabel: README,
        },
      },
    ],
    choose: [
      "Your organisation keeps a licence allow-list: compare the licence row first. Different licences carry different obligations, and that decision belongs to whoever owns your licence policy, not to a feature table.",
      "You chart hourly data on Android: capacitor-health's README documents day-only buckets there, so plan to bucket raw records yourself; @capgo/capacitor-health's README lists the types it cannot aggregate at all.",
      "You need Health Connect history beyond the default window: @capgo/capacitor-health documents a requestHistoryAccess option for it, and capacitor-health's README says its queries do not request that permission.",
      "Check that the plugin's peer dependency matches your Capacitor major before either one.",
    ],
    faqs: [
      {
        q: "Are capacitor-health and @capgo/capacitor-health the same plugin?",
        a: "No. They are separate packages from separate repositories, mley/capacitor-health and Cap-go/capacitor-health, with different licences in their npm metadata and different documented APIs. capacitor-health's README credits cordova-plugin-health for some of its ideas; @capgo/capacitor-health's README does not describe a shared origin.",
      },
      {
        q: "Which Capacitor health plugin can read more than 30 days of Health Connect data?",
        a: "@capgo/capacitor-health, through a requestHistoryAccess option that also requests READ_HEALTH_DATA_HISTORY, which the app must declare in its manifest. capacitor-health's README says the opposite of itself: its queries do not request READ_HEALTH_DATA_HISTORY, so Health Connect only returns data from 30 days before the permission was first granted.",
      },
    ],
  },
  {
    slug: "flutter-health-vs-health-connector",
    a: "flutter-health",
    b: "health-connector",
    title: "Flutter health vs health_connector: Facts Compared",
    metaDescription:
      "Flutter's health package vs health_connector for HealthKit and Health Connect: release history, SDK floors, licences and what each README documents.",
    h1: "Flutter health vs health_connector",
    primaryQuery: "flutter health vs health_connector",
    answer: `Both pub.dev packages read and write Apple HealthKit and Health Connect from Flutter. health has a long release history — first published ${monthYear(lib("flutter-health").firstPublished)}, ${lib("flutter-health").versionCount} versions — and declares Flutter ${req("flutter-health", "flutter") ?? "(unstated)"}. health_connector is newer — first published ${monthYear(lib("health-connector").firstPublished)}, ${lib("health-connector").versionCount} versions — and declares Flutter ${req("health-connector", "flutter") ?? "(unstated)"}, so the deciding fact for many teams is which Flutter version they can run.`,
    points: [
      {
        side: "a",
        note: {
          text: "Google Fit removed in 11.0.0; Health Connect reads limited to 30 days unless READ_HEALTH_DATA_HISTORY is granted via `requestHealthDataHistoryAuthorization`.",
          source: R.flutterHealth,
          sourceLabel: README,
        },
      },
      {
        side: "a",
        note: {
          text: "iOS 15.0 or later; ships as a Swift package and a CocoaPods pod.",
          source: R.flutterHealth,
          sourceLabel: README,
        },
      },
      {
        side: "b",
        note: {
          text: "Requirements table: Flutter 3.38.0+, Dart 3.10.0+, Android API 26+, iOS 15.0+; v3.9.0 needs Android SDK Extension level 19.",
          source: R.healthConnector,
          sourceLabel: README,
        },
      },
      {
        side: "b",
        note: {
          text: "Describes itself as \"production-grade\" with \"143 typed health data types\" — the project's own claims, not counted by us.",
          source: R.healthConnector,
          sourceLabel: README,
        },
      },
    ],
    choose: [
      "You cannot move to a recent Flutter yet: compare the environment rows. health_connector's declared Flutter floor is higher than health's.",
      `You want the package with the longer public track record: health was first published ${lib("flutter-health").firstPublished} and health_connector ${lib("health-connector").firstPublished}, ${daysBetween(lib("health-connector").firstPublished, LIBRARIES_FETCHED_ON)} days before our read.`,
      "Either way, check the specific data types you need in each package's own type list before choosing — both projects publish one.",
    ],
    faqs: [
      {
        q: "Which Flutter health package supports older Flutter versions?",
        a: `health. Its pubspec declares Flutter ${req("flutter-health", "flutter") ?? "(unstated)"}, while health_connector's declares Flutter ${req("health-connector", "flutter") ?? "(unstated)"} and its README lists Dart 3.10.0 or later, as read from pub.dev on ${LIBRARIES_FETCHED_ON}.`,
      },
      {
        q: "Do the Flutter health and health_connector packages both support Health Connect history beyond 30 days?",
        a: "Yes, by different names. The health README documents isHealthDataHistoryAuthorized and requestHealthDataHistoryAuthorization, backed by the READ_HEALTH_DATA_HISTORY permission. The health_connector README says Health Connect defaults to 30 days and tells you to request the HealthPlatformFeature.readHealthDataHistory permission for older data, with the same manifest permission declared.",
      },
    ],
  },
  {
    slug: "garminconnect-vs-garth",
    a: "garminconnect",
    b: "garth",
    title: "garminconnect vs garth: Garmin Connect in Python",
    metaDescription:
      "garminconnect vs garth for Garmin Connect in Python: garth is deprecated and garminconnect dropped it in 0.3.0. Registry dates, status and migration.",
    h1: "garminconnect vs garth",
    primaryQuery: "garminconnect vs garth",
    answer: `This is less a choice than a migration. garth's README says it is deprecated because Garmin changed its auth flow and new logins no longer work${lib("garth").registryStatus ? `, and its PyPI classifier reads "${lib("garth").registryStatus}"` : ""}. garminconnect used garth until version 0.3.0 and now handles sign-in itself, per its README; its latest release is ${lib("garminconnect").latestVersion} from ${lib("garminconnect").latestPublished}. Sessions saved with garth cannot be converted, so plan one fresh login.`,
    points: [
      {
        side: "a",
        note: {
          text: "Since 0.3.0 no longer uses garth; signs in through the same mobile SSO flow as the official Garmin Connect Android app, with an MFA callback.",
          source: R.garminconnect,
          sourceLabel: README,
        },
      },
      {
        side: "a",
        note: {
          text: "Requires Python 3.12 or later; tokens stored in `~/.garminconnect/garmin_tokens.json`.",
          source: R.garminconnect,
          sourceLabel: README,
        },
      },
      {
        side: "b",
        note: {
          text: "Deprecated and no longer maintained; the latest release is described as final.",
          source: R.garth,
          sourceLabel: README,
        },
      },
      {
        side: "b",
        note: {
          text: "A saved session with a valid OAuth1 token may keep working until it expires, about a year after issue; new logins will not work.",
          source: R.garth,
          sourceLabel: README,
        },
      },
    ],
    choose: [
      "Starting fresh: garth's own README says new logins do not work, which settles it.",
      "Running garth today on a saved session: it may keep working until the OAuth1 token expires; schedule the move before then rather than after.",
      "Moving to garminconnect: its README says garth-era token files cannot be converted, so budget for one interactive login (with MFA if the account uses it).",
      "Building for other people's Garmin data rather than your own: both are unofficial clients; Garmin's official developer program is the route for that.",
    ],
    faqs: [
      {
        q: "Does garminconnect still depend on garth?",
        a: "No. garminconnect's README says that since version 0.3.0 the library no longer uses garth, which it describes as deprecated, and that sessions saved by older versions with garth.save() cannot be converted.",
      },
      {
        q: "How do I migrate a Python script from garth to garminconnect?",
        a: "Install garminconnect, then log in once with username and password: its README shows Garmin(email, password) followed by login with a token-store path, after which new tokens are saved to garmin_tokens.json and reused. Old oauth1_token.json and oauth2_token.json files from garth cannot be converted, and the README requires Python 3.12 or later.",
      },
    ],
  },
  {
    slug: "oura-ring-vs-oura-python",
    a: "oura-ring",
    b: "oura-python",
    title: "oura-ring vs oura: Python Clients for the Oura API",
    metaDescription:
      "oura-ring vs oura (python-ouraring) for the Oura API in Python: OAuth2 support, the personal-access-token change, maintenance notes, release dates.",
    h1: "oura-ring vs oura (python-ouraring)",
    primaryQuery: "oura-ring vs python-ouraring",
    answer: `Both are third-party Python clients for the Oura API. oura-ring targets the Oura API v2, ships an OAuth2 helper, and its README tells new integrations to use OAuth2 now that Oura has stopped issuing personal access tokens; its latest release is from ${monthYear(lib("oura-ring").latestPublished)}. oura (repository python-ouraring) has v2 clients its maintainer says are untested with OAuth2, a README asking for someone to take over maintenance, and a latest release from ${monthYear(lib("oura-python").latestPublished)}.`,
    points: [
      {
        side: "a",
        note: {
          text: "`OuraAuth` wraps the authorization-code flow: authorize_url, exchange_code, refresh_token.",
          source: R.ouraRing,
          sourceLabel: README,
        },
      },
      {
        side: "a",
        note: {
          text: "States that personal access tokens were deprecated by Oura in December 2025 and new integrations must use OAuth2.",
          source: R.ouraRing,
          sourceLabel: README,
        },
      },
      {
        side: "b",
        note: {
          text: "v2 clients under `oura.v2`, not tested with the OAuth2 flow according to the maintainer.",
          source: R.oura,
          sourceLabel: README,
        },
      },
      {
        side: "b",
        note: {
          text: "The maintainer invites someone to take over the project or publish a fork under a new name.",
          source: R.oura,
          sourceLabel: README,
        },
      },
    ],
    choose: [
      "New integration: it has to use OAuth2 (no new personal access tokens), and oura-ring is the one whose README documents that flow end to end.",
      "Existing script on oura with a previously issued token: it may keep working, but neither the token nor the client's v2 OAuth path is something to build new work on.",
      "Either way, both wrap the same Oura API, so Oura's app registration and scopes apply identically.",
    ],
    faqs: [
      {
        q: "Which Python Oura client supports OAuth2?",
        a: "oura-ring documents it fully: OuraAuth builds the authorization URL, exchanges the code and refreshes the token, and its README calls OAuth2 the recommended path. The oura package (python-ouraring) has an OAuth2 client too, but its README says the v2 clients were not tested with the OAuth2 flow.",
      },
      {
        q: "Is the oura Python package still maintained?",
        a: `Its README says the maintainer will keep it up to date where possible but cannot commit to the quality and responsiveness users deserve, and asks for someone to take it over. Its latest PyPI release was published ${lib("oura-python").latestPublished}.`,
      },
    ],
  },
];

// ── Joins and dates ───────────────────────────────────────────────────────

export type LibraryPage = { lib: Library; ed: LibraryEditorial };

/** Every package with both halves. A generated row without notes, or notes
 *  without a generated row, is a build error, not a silently missing page. */
export function libraryPages(): LibraryPage[] {
  const eds = new Map(LIBRARY_EDITORIAL.map((e) => [e.slug, e]));
  for (const e of LIBRARY_EDITORIAL) lib(e.slug);
  return LIBRARIES.map((l) => {
    const ed = eds.get(l.slug);
    if (!ed) throw new Error(`librariesEditorial: no editorial entry for generated package "${l.slug}"`);
    return { lib: l, ed };
  });
}

export function getLibraryPage(slug: string): LibraryPage | undefined {
  return libraryPages().find((p) => p.lib.slug === slug);
}

export function getLibraryComparison(slug: string): LibraryComparison | undefined {
  return LIBRARY_COMPARISONS.find((c) => c.slug === slug);
}

/** Comparisons a package appears in, for cross-links. */
export function comparisonsFor(slug: string): LibraryComparison[] {
  return LIBRARY_COMPARISONS.filter((c) => c.a === slug || c.b === slug);
}

/**
 * dateModified for every /libraries route: the later of the registry read and
 * the editorial check, since a page changes when either does. The sitemap
 * must use this same function so lastmod matches the page's JSON-LD.
 */
export function librariesModified(): string {
  return LIBRARIES_FETCHED_ON > LIBRARIES_VERIFIED_ON ? LIBRARIES_FETCHED_ON : LIBRARIES_VERIFIED_ON;
}

/** Whole days from `from` to `to` (YYYY-MM-DD), for "N days before our check". */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

export const ECOSYSTEM_LABEL: Record<Library["ecosystem"], string> = { npm: "npm", pub: "pub.dev", pypi: "PyPI" };
