/**
 * Landing pages for the /libraries groups: one page per framework or
 * language a reader arrives with (ops/EXPANSION-3-2026-10-17.md 4.6, which
 * settles ops/SERP-30-2026-10-12.md #16 and #17).
 *
 * Built only from data the site already holds: the generated registry rows
 * (src/data/libraries.ts), the hand-written package and comparison notes
 * (src/data/librariesEditorial.ts), and links to the pages on this site that
 * already state the platform facts a wrapper inherits. Nothing here is a new
 * fact. Each sentence restates a README note, a registry field or one of those
 * pages; every version, date, count and licence is interpolated from the
 * generated rows, so a refresh cannot leave the prose behind the table. Where
 * a sentence depends on a property of the data ("none of these covers both
 * stores"), the module asserts that property when it loads, and the build
 * fails rather than publish a sentence the data no longer supports.
 *
 * Routes. A landing lives at /libraries/<slug>, beside the package pages at
 * /libraries/<package-slug>, and a package slug equal to a landing slug would
 * shadow the package page — so the module refuses one, and
 * scripts/fetch-libraries.mjs reserves the slugs. qa (LIBS-LANDING-ROWS) reads
 * each entry's `slug:` and `groups:` lines as text: keep them the first two
 * lines of every entry.
 *
 * Capacitor and Cordova have a page of their own rather than a section of the
 * React Native page: the group holds as many packages, package notes and
 * comparisons as Flutter, and none of its plugins runs in a React Native app.
 *
 * KinesteX (which funds this site) publishes none of these packages; no
 * first-party disclosure applies.
 */
import { LIBRARIES, LIBRARIES_FETCHED_ON, type Library, type LibraryGroup } from "@/data/libraries";
import {
  ECOSYSTEM_LABEL,
  LIBRARIES_BASE,
  LIBRARIES_VERIFIED_ON,
  LIBRARY_COMPARISONS,
  lib,
  libraryPages,
  monthYear,
  type Faq,
  type LibraryComparison,
  type LibraryPage,
  type NativeLink,
} from "@/data/librariesEditorial";
import { GHAPI_FETCHED_ON, GHAPI_TIMELINE } from "@/data/googleHealthApi";
import { clampDescription, clampTitle } from "@/lib/cluster";

export type LandingLink = { href: string; label: string };

/** One block of "how to choose": our reading of the package notes. */
export type LandingChoice = {
  /** What the reader is choosing for: a store, a vendor API, a situation. */
  heading: string;
  /** The packages the block is about; each renders as a link to its page. */
  slugs: string[];
  /** Restatements of README notes and registry facts on the package pages. */
  points: string[];
  /** The comparison page the block draws on, when there is one. */
  compare?: string;
};

/** A platform rule the packages inherit, with the on-site pages that state it. */
export type LandingConstraint = { text: string; links: LandingLink[] };

export type LibraryLanding = {
  /** URL segment under /libraries. Never a package slug. */
  slug: string;
  /** The generated groups this page covers: every package in them gets a row. */
  groups: LibraryGroup[];
  /** Short name, for breadcrumbs and menus. */
  label: string;
  /** Absolute <title>, at most 60 characters. */
  title: string;
  /** At most 155 characters. */
  metaDescription: string;
  h1: string;
  primaryQuery: string;
  /** 2–4 sentence answer capsule. */
  answer: string;
  choose: LandingChoice[];
  constraints: LandingConstraint[];
  faqs: Faq[];
};

// ── Helpers ───────────────────────────────────────────────────────────────

const HK = "Apple HealthKit";
const HC = "Health Connect";

function check(ok: unknown, what: string): void {
  if (!ok) {
    throw new Error(`librariesLandings: ${what} — the landing text no longer matches src/data/libraries.ts; update the landing.`);
  }
}

const groupRows = (groups: LibraryGroup[]) => LIBRARIES.filter((l) => groups.includes(l.group));
const wrapsOnly = (l: Library, ...stores: string[]) =>
  (l.wraps ?? []).length === stores.length && stores.every((s) => l.wraps?.includes(s));
const coversBoth = (l: Library) => Boolean(l.wraps?.includes(HK) && l.wraps?.includes(HC));
const req = (slug: string, key: string) => lib(slug).requires?.[key] ?? "(not stated)";

/** "a", "a and b", "a, b and c". */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const comparison = (slug: string): LibraryComparison => {
  const c = LIBRARY_COMPARISONS.find((x) => x.slug === slug);
  if (!c) throw new Error(`librariesLandings: no comparison "${slug}" in src/data/librariesEditorial.ts`);
  return c;
};

/** A comparison's "how to choose" points that stand on their own. A point that
 *  sends the reader to a row of the comparison's table ("check the Requires
 *  row first") would point at nothing on a landing, so it is left out here and
 *  restated by the landing with the facts it refers to. */
const standalonePoints = (slug: string): string[] => comparison(slug).choose.filter((p) => !/\brows?\b/i.test(p));

const NUMBER_WORD = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const countWord = (n: number) => NUMBER_WORD[n] ?? String(n);

/** How the registry names a vendor API, as it reads inside a sentence. */
const API_PROSE: Record<string, string> = {
  "Strava API": "the Strava API",
  "Oura API": "the Oura API",
  "Fitbit Web API": "the Fitbit Web API",
  "Withings API": "the Withings API",
};
const apiProse = (w: string) => API_PROSE[w] ?? w;

// ── Platform facts stated elsewhere on the site ─────────────────────────────

const HK_GUIDE: LandingLink = { href: "/integrate/healthkit", label: "HealthKit integration guide" };
const HC_GUIDE: LandingLink = { href: "/integrate/google-health-connect", label: "Health Connect integration guide" };

/** The rules of the two on-device stores, as /integrate/healthkit and
 *  /integrate/google-health-connect state them. */
const STORE_RULES: LandingConstraint[] = [
  {
    text: "HealthKit data lives only on Apple devices and is read by app code on the device: Apple's setup has no tokens and no server endpoint. On Android, an app integrates Health Connect separately.",
    links: [HK_GUIDE],
  },
  {
    text: "HealthKit never tells an app whether the user granted read access: a denied read looks exactly like no data, whichever wrapper makes the query.",
    links: [HK_GUIDE],
  },
  {
    text: "Health Connect is Android-only and on-device, not an OAuth cloud API. It is part of the platform from Android 14; on Android 13 and lower it is a separate app the user installs from the Play Store.",
    links: [HC_GUIDE],
  },
  {
    text: "By default an app can read Health Connect data from up to 30 days before its first permission grant; reading further back needs the history permission.",
    links: [HC_GUIDE],
  },
  {
    text: "Shipping on Google Play needs the Play Console Health apps declaration, listing every data type the app reads or writes.",
    links: [HC_GUIDE],
  },
];

const GOOGLE_FIT_RULE: LandingConstraint = {
  text: "Google documents the Google Fit APIs as supported only until the end of 2026, with no switch-off date announced.",
  links: [{ href: "/google-fit-shutdown", label: "Google Fit shutdown: dates and what to do" }],
};

/** Read from Google's own timeline (src/data/googleHealthApi.ts), which
 *  /google-health-api renders; null if Google's page stops listing it. */
const FITBIT_TURN_OFF = GHAPI_TIMELINE.find((t) => /turn-off/i.test(t.label)) ?? null;

// ── React Native ──────────────────────────────────────────────────────────

const RN = groupRows(["react-native"]);
check(RN.length >= 3, "React Native has fewer than three packages");
check(!RN.some(coversBoth), "a React Native package now covers both stores");
check(wrapsOnly(lib("react-native-health"), HK) && wrapsOnly(lib("kingstinct-react-native-healthkit"), HK), "the React Native HealthKit bridges changed what they wrap");
check(wrapsOnly(lib("react-native-health-connect"), HC), "react-native-health-connect changed what it wraps");
check(lib("expo-health-connect").deprecated, "expo-health-connect is no longer deprecated in the registry");
check(wrapsOnly(lib("react-native-google-fit"), "Google Fit"), "react-native-google-fit changed what it wraps");
const rnFit = lib("react-native-google-fit");

// ── Capacitor and Cordova ─────────────────────────────────────────────────

const CAP = groupRows(["capacitor-cordova"]);
const CAP_BOTH = ["capacitor-health", "capgo-capacitor-health", "cordova-plugin-health"];
check(CAP.length >= 3, "Capacitor and Cordova have fewer than three packages");
check(
  CAP.filter(coversBoth).map((l) => l.slug).sort().join() === [...CAP_BOTH].sort().join(),
  "the Capacitor and Cordova plugins covering both stores changed",
);
check(
  wrapsOnly(lib("perfood-capacitor-healthkit"), HK) && lib("perfood-capacitor-healthkit").platforms?.join() === "ios",
  "@perfood/capacitor-healthkit is no longer iOS-only",
);
const capLicences = (() => {
  const by = new Map<string, string[]>();
  for (const s of CAP_BOTH) {
    const l = lib(s);
    const key = l.license ?? "no licence stated";
    by.set(key, [...(by.get(key) ?? []), l.name]);
  }
  return [...by.entries()];
})();
const capLicenceSentence =
  capLicences.length === 1
    ? `Their npm metadata declares the same licence, ${capLicences[0][0]}, for all three`
    : `Their npm metadata declares different licences — ${capLicences.map(([lic, names]) => `${lic} for ${listJoin(names)}`).join("; ")} —`;

// ── Flutter ───────────────────────────────────────────────────────────────

const FL = groupRows(["flutter"]);
check(FL.length >= 3, "Flutter has fewer than three packages");
check(
  FL.filter(coversBoth).map((l) => l.slug).sort().join() === ["flutter-health", "health-connector"].join(),
  "the Flutter packages covering both stores changed",
);
check(wrapsOnly(lib("health-kit-reporter"), HK) && lib("health-kit-reporter").platforms?.join() === "ios", "health_kit_reporter is no longer iOS-only");
check(wrapsOnly(lib("flutter-health-connect"), HC), "flutter_health_connect changed what it wraps");
const PLATFORM_NAME: Record<string, string> = { android: "Android", ios: "iOS", web: "web" };
check(
  FL.every((l) => (l.platforms ?? []).every((p) => p === "android" || p === "ios")),
  "a Flutter package now declares a platform other than Android and iOS",
);
const flPlatforms = FL.map((l) => {
  const where = l.platformsEvidence?.startsWith("pub.dev platform tags") ? "pub.dev's platform tags" : "its pubspec plugin platforms";
  const names = (l.platforms ?? []).map((p) => PLATFORM_NAME[p] ?? p);
  return names.length ? `${l.name}, ${listJoin(names)}, per ${where}` : `${l.name}, none stated in its registry metadata`;
});

// ── Python ────────────────────────────────────────────────────────────────

const PY = groupRows(["python"]);
check(PY.length >= 3, "Python has fewer than three packages");
check(PY.every((l) => l.wraps?.length === 1), "a Python package no longer names exactly one API it wraps");
check(!PY.some((l) => l.wraps?.includes(HK) || l.wraps?.includes(HC)), "a Python package now wraps an on-device store");
const pyApis = [...new Set(PY.flatMap((l) => l.wraps ?? []))];
const pyApiList = listJoin(pyApis.map(apiProse));
const pyByApi = listJoin(
  pyApis.map((w) => `${apiProse(w)} (${listJoin(PY.filter((l) => l.wraps?.includes(w)).map((l) => l.name))})`),
);
const garth = lib("garth");
const fitbit = lib("python-fitbit");
const withings = lib("withings-api");

// ── The landings ──────────────────────────────────────────────────────────

export const LIBRARY_LANDINGS: LibraryLanding[] = [
  {
    slug: "react-native",
    groups: ["react-native"],
    label: "React Native",
    title: "React Native Health Data Libraries for iOS and Android",
    metaDescription:
      "React Native libraries for Apple HealthKit, Health Connect and Google Fit: which to install per platform, Expo support, versions, dates and licences.",
    h1: "React Native health data libraries",
    primaryQuery: "react native health data library",
    answer: `None of the ${RN.length} React Native packages this site tracks covers both health stores: react-native-health and @kingstinct/react-native-healthkit bridge Apple HealthKit on iOS, and react-native-health-connect wraps Health Connect on Android, so an app that ships on both platforms usually installs one of each. react-native-health-connect has carried its own Expo config plugin since v4, which is why expo-health-connect is deprecated on npm and its README says to remove it. react-native-google-fit bridges the Google Fit API, which Google's Fit migration guide says will only be supported until the end of 2026.`,
    choose: [
      {
        heading: "HealthKit on iOS",
        slugs: ["react-native-health", "kingstinct-react-native-healthkit"],
        compare: "react-native-health-vs-kingstinct-react-native-healthkit",
        points: [
          `react-native-health's README has said since August 2023 that new features are on hold while its maintainers build a Swift version; its latest npm release is ${lib("react-native-health").latestVersion}, from ${monthYear(lib("react-native-health").latestPublished)}. @kingstinct/react-native-healthkit is built on react-native-nitro-modules, which you install alongside it, and its README warns that reading a type before requesting authorization for it crashes the app.`,
          `Your app is on an older React Native version: @kingstinct/react-native-healthkit's latest release declares react-native ${req("kingstinct-react-native-healthkit", "react-native")} and react ${req("kingstinct-react-native-healthkit", "react")}; react-native-health's declares react-native ${req("react-native-health", "react-native")}.`,
          ...standalonePoints("react-native-health-vs-kingstinct-react-native-healthkit"),
        ],
      },
      {
        heading: "Health Connect on Android",
        slugs: ["react-native-health-connect"],
        points: [
          "react-native-health-connect is the Android half: its README points to react-native-health and @kingstinct/react-native-healthkit for iOS.",
          "React Native CLI apps register its permission delegate in MainActivity; Expo projects get it from the Expo module the package has bundled since v4. Every record type you read also needs a permission declared in the manifest.",
          "Its README asks for React Native 0.71 or higher for v2 and later, and minSdkVersion 26, and says Health Connect must be installed on the user's device; from Android 14 it is part of the Android framework.",
        ],
      },
      {
        heading: "Expo projects",
        slugs: ["react-native-health", "kingstinct-react-native-healthkit", "react-native-health-connect", "expo-health-connect"],
        points: [
          "Neither HealthKit bridge runs in Expo Go. react-native-health's README says the package is not available in the Expo Go app; @kingstinct/react-native-healthkit's says to add its config plugin to app.json and build a development client.",
          "For Health Connect, react-native-health-connect's README adds expo-build-properties and lists both in the app.json plugins array.",
          "Still have expo-health-connect? Its README says to uninstall it, put react-native-health-connect in its place in the plugins array and re-run prebuild with --clean: leaving both installed fails the Android build with a duplicate class.",
        ],
      },
      {
        heading: "Apps still on Google Fit",
        slugs: ["react-native-google-fit"],
        points: [
          `react-native-google-fit ${rnFit.deprecated ? "is deprecated on npm" : "carries no deprecation on npm"}; its README says Google has deprecated the Google Fit API and that the maintainers will keep the library up to date while the API remains available.`,
          "Google's Fit migration guide says the Google Fit API will only be supported until the end of 2026 and recommends Health Connect for step tracking and mobile-first apps; in React Native that means react-native-health-connect.",
        ],
      },
    ],
    constraints: [...STORE_RULES, GOOGLE_FIT_RULE],
    faqs: [
      {
        q: "Do React Native health libraries work in Expo Go?",
        a: "The two HealthKit bridges say they do not: react-native-health's README says it is not available in the Expo Go app, and @kingstinct/react-native-healthkit's README says it does not run in Expo Go and asks for its config plugin and a development client instead. For Health Connect, react-native-health-connect has shipped its own Expo config plugin since v4, which replaced the separate expo-health-connect package.",
      },
      {
        q: "Which React Native health packages are deprecated or on hold?",
        a: `expo-health-connect is deprecated on npm and merged into react-native-health-connect v4. react-native-health's README has said since August 2023 that new features are on hold while its maintainers build a Swift version, though pull requests for critical bug fixes are still welcome. react-native-google-fit ${rnFit.deprecated ? "is deprecated on npm" : "carried no deprecation on npm at our last registry read"}, but it bridges the Google Fit API, which Google's Fit migration guide says will only be supported until the end of 2026.`,
      },
      {
        q: "What native setup do React Native health libraries still need?",
        a: "On iOS, react-native-health's README asks for the HealthKit capability in Xcode and the NSHealthShareUsageDescription and NSHealthUpdateUsageDescription usage strings. On Android, react-native-health-connect needs a permission declared in the manifest for every record type you read, and React Native CLI apps register its permission delegate in MainActivity, which Expo projects get from the bundled module. Publishing on Google Play also needs the Play Console Health apps declaration, as this site's Health Connect integration guide explains.",
      },
    ],
  },
  {
    slug: "capacitor-cordova",
    groups: ["capacitor-cordova"],
    label: "Capacitor and Cordova",
    title: "Capacitor and Cordova Health Plugins for iOS and Android",
    metaDescription:
      "Capacitor and Cordova plugins for Apple HealthKit and Health Connect: which cover both stores, licences, Health Connect limits, versions and release dates.",
    h1: "Capacitor and Cordova health plugins",
    primaryQuery: "capacitor health plugin",
    answer: `Three of the ${CAP.length} Capacitor and Cordova plugins this site tracks cover both Apple HealthKit and Android Health Connect behind one API: capacitor-health and @capgo/capacitor-health for Capacitor, and cordova-plugin-health, a Cordova plugin whose README also documents a manual setup for Capacitor. ${capLicenceSentence} and their READMEs document different Health Connect limits: @capgo/capacitor-health has an option to request history older than about 30 days, which capacitor-health's README says its queries do not request. @perfood/capacitor-healthkit is iOS-only, and its README says its main branch no longer accepts pull requests while a v2 is published as an alpha.`,
    choose: [
      {
        heading: "capacitor-health or @capgo/capacitor-health",
        slugs: ["capacitor-health", "capgo-capacitor-health"],
        compare: "capacitor-health-vs-capgo-capacitor-health",
        points: [
          "Your organisation keeps a licence allow-list: compare the Licence column above first. Different licences carry different obligations, and that decision belongs to whoever owns your licence policy, not to a feature table.",
          ...standalonePoints("capacitor-health-vs-capgo-capacitor-health"),
        ],
      },
      {
        heading: "Cordova, or Capacitor with manual steps",
        slugs: ["cordova-plugin-health"],
        points: [
          "cordova-plugin-health installs with cordova plugin add. Its README's Capacitor section, written against plugin v3.1.0 and @capacitor/android 5.5.1, lists the manifest and Gradle changes Capacitor does not apply for you.",
          "It adds no Health Connect permissions: declare each data type's permission in AndroidManifest.xml yourself, preferably through config.xml, and add the privacypolicy.html page the plugin shows when Health Connect asks for one.",
          "Version 3 rewrote the Android side for Health Connect and dropped Google Fit; the README points anyone who still needs Fit to version 2.1.1.",
        ],
      },
      {
        heading: "iOS only",
        slugs: ["perfood-capacitor-healthkit"],
        points: [
          `@perfood/capacitor-healthkit covers Apple Health on iOS only. Its latest stable release declares a peer dependency of @capacitor/core ${req("perfood-capacitor-healthkit", "@capacitor/core")}, so check that against your Capacitor version before adopting it.`,
          "Its README says pull requests to the main branch are no longer accepted and that v2 is published as an alpha on npm.",
        ],
      },
    ],
    constraints: STORE_RULES,
    faqs: [
      {
        q: "Which Capacitor plugins read both HealthKit and Health Connect?",
        a: "capacitor-health and @capgo/capacitor-health, whose package metadata declares iOS and Android native code, and cordova-plugin-health, a Cordova plugin whose README documents manual steps for Capacitor projects. @perfood/capacitor-healthkit covers Apple Health on iOS only.",
      },
      {
        q: "Do Capacitor health plugins declare the Health Connect permissions for you?",
        a: "It depends on the plugin. cordova-plugin-health's README says it will not add permissions for the data types you need, so each one is declared by hand. @capgo/capacitor-health's README says its manifest already declares the permissions for the basic data types. capacitor-health's README warns that Health Connect shows every declared permission on the consent screen, so declare only what you request.",
      },
      {
        q: "Which licences do the Capacitor and Cordova health plugins use?",
        a: `As each package's npm metadata states it: ${CAP.map((l) => `${l.name} ${l.license ?? "states none"}`).join(", ")}. Different licences carry different obligations, and that decision belongs to whoever owns your licence policy.`,
      },
    ],
  },
  {
    slug: "flutter",
    groups: ["flutter"],
    label: "Flutter",
    title: "Flutter Health Data Packages for iOS and Android",
    metaDescription:
      "Flutter packages for Apple HealthKit and Health Connect on pub.dev: which cover both stores, minimum Flutter versions, release dates and README caveats.",
    h1: "Flutter health data packages",
    primaryQuery: "flutter health packages",
    answer: `Two of the ${FL.length} Flutter packages this site tracks read and write both Apple HealthKit and Android Health Connect: health, first published on pub.dev in ${monthYear(lib("flutter-health").firstPublished)}, and health_connector, first published in ${monthYear(lib("health-connector").firstPublished)}. Between those two, the deciding fact for many teams is which Flutter version they can run: health declares Flutter ${req("flutter-health", "flutter")} and health_connector ${req("health-connector", "flutter")}. The other two cover one store each — health_kit_reporter is iOS-only and flutter_health_connect covers Health Connect alone — and flutter_health_connect's latest release dates from ${monthYear(lib("flutter-health-connect").latestPublished)}.`,
    choose: [
      {
        heading: "Both stores from one package",
        slugs: ["flutter-health", "health-connector"],
        compare: "flutter-health-vs-health-connector",
        points: [
          `You cannot move to a recent Flutter yet: health_connector declares Flutter ${req("health-connector", "flutter")}, and health declares ${req("flutter-health", "flutter")}.`,
          ...standalonePoints("flutter-health-vs-health-connector"),
          "health removed Google Fit support in version 11.0.0; on Android it reads and writes Health Connect.",
          "Both document a route to Health Connect history older than 30 days: health through requestHealthDataHistoryAuthorization, health_connector through its HealthPlatformFeature.readHealthDataHistory permission, each with READ_HEALTH_DATA_HISTORY declared in the manifest.",
        ],
      },
      {
        heading: "iOS only",
        slugs: ["health-kit-reporter"],
        points: [
          "health_kit_reporter wraps the HealthKitReporter library and declares iOS as its only plugin platform.",
          `When we checked it on ${LIBRARIES_VERIFIED_ON}, the README on its repository's default branch was ahead of the version on pub.dev, so follow the README that matches the version you install.`,
        ],
      },
      {
        heading: "Health Connect only",
        slugs: ["flutter-health-connect"],
        points: [
          `flutter_health_connect documents Android setup only. Its latest pub.dev release dates from ${monthYear(lib("flutter-health-connect").latestPublished)}, and its pubspec declares a Dart SDK constraint of ${req("flutter-health-connect", "sdk")}.`,
          "Its README lists minSdkVersion 26 (28 recommended), compileSdkVersion 34 and Flutter 2.5.0 or higher.",
        ],
      },
    ],
    constraints: STORE_RULES,
    faqs: [
      {
        q: "Which Flutter packages read both HealthKit and Health Connect?",
        a: `Two of the ${FL.length} this site tracks: health, maintained in the carp-dk/carp-health-flutter repository, and health_connector. health_kit_reporter covers HealthKit on iOS only, and flutter_health_connect covers Health Connect only; its README documents Android setup alone.`,
      },
      {
        q: "What minimum Flutter and Dart versions do the Flutter health packages need?",
        a: `As each pubspec's environment declares them on pub.dev: ${FL.map((l) => `${l.name} — Dart SDK ${l.requires?.sdk ?? "not stated"}, Flutter ${l.requires?.flutter ?? "not stated"}`).join("; ")}. A declared range is the author's statement, not a test result, so build against the versions you ship.`,
      },
      {
        q: "Which platforms do the Flutter health packages declare?",
        a: `Android and iOS at most: ${flPlatforms.join("; ")}. None declares web or desktop. flutter_health_connect's README documents Android setup only, although its pubspec also registers an iOS plugin class.`,
      },
    ],
  },
  {
    slug: "python",
    groups: ["python"],
    label: "Python",
    title: "Python Libraries for Fitness APIs: Garmin, Strava, Oura",
    metaDescription:
      "Python clients for the Garmin Connect, Strava, Oura, Fitbit and Withings APIs: PyPI versions, release dates, licences, how each signs in, README caveats.",
    h1: "Python libraries for fitness APIs",
    primaryQuery: "fitness api python",
    answer: `The ${PY.length} Python packages this site tracks are clients for fitness vendors' web APIs — ${pyApiList} — for scripts, back ends and personal data exports; none of them reads Apple HealthKit or Android Health Connect, which apps read on the device. For Garmin Connect, garminconnect has handled sign-in itself since version 0.3.0, and garth, which it used before, says in its README that it is deprecated because Garmin changed its auth flow and new logins no longer work. oura-ring documents the OAuth2 flow new Oura integrations need, and python-fitbit's latest release dates from ${monthYear(fitbit.latestPublished)}, for the Fitbit Web API that Google is retiring in favour of the Google Health API.`,
    choose: [
      {
        heading: "Garmin Connect",
        slugs: ["garminconnect", "garth"],
        compare: "garminconnect-vs-garth",
        points: standalonePoints("garminconnect-vs-garth"),
      },
      {
        heading: "Strava",
        slugs: ["stravalib"],
        points: [
          "stravalib wraps the Strava V3 API rather than replacing it, so you still register a Strava app first; its README's tutorials start there, then cover refreshing the token and reading activities and athlete data.",
          `Its README lists Python 3.11 or later, and its PyPI metadata declares requires_python ${req("stravalib", "python")}.`,
        ],
      },
      {
        heading: "Oura",
        slugs: ["oura-ring", "oura-python"],
        compare: "oura-ring-vs-oura-python",
        points: standalonePoints("oura-ring-vs-oura-python"),
      },
      {
        heading: "Fitbit",
        slugs: ["python-fitbit"],
        points: [
          `python-fitbit, published on PyPI as fitbit, was written for the legacy Fitbit Web API. Its latest release dates from ${monthYear(fitbit.latestPublished)}, and its README still lists Python 2.7+.`,
          "Google's Fit migration guide lists the Google Health API as the recommended path for Fitbit Web API integrations, and nothing in python-fitbit's README mentions it.",
        ],
      },
      {
        heading: "Withings",
        slugs: ["withings-api"],
        points: [
          "withings-api authenticates with OAuth 2.0 using a client ID and consumer secret from a Withings developer application, and its README shows a demo mode for testing against Withings' demo data.",
          `Its latest release, ${withings.latestVersion}, dates from ${monthYear(withings.latestPublished)}, and its PyPI metadata declares Python ${req("withings-api", "python")}: an author's declaration rather than a test result, so test it on the interpreter you deploy.`,
        ],
      },
    ],
    constraints: [
      {
        text: "Neither on-device store has a web API for a Python client to call: HealthKit's setup has no tokens or server endpoint, and Health Connect is not an OAuth cloud API. Apps read both on the device.",
        links: [HK_GUIDE, HC_GUIDE],
      },
      {
        text: "garminconnect and garth are unofficial clients that sign in as the user; Garmin's official developer program is the route for an app that serves other people's Garmin data.",
        links: [{ href: "/integrate/garmin-api", label: "Garmin API integration guide" }],
      },
      {
        text: "stravalib wraps the Strava V3 API rather than replacing it, so Strava's OAuth, scopes and webhooks still apply.",
        links: [{ href: "/integrate/strava-api", label: "Strava API integration guide" }],
      },
      {
        text: "New Oura integrations use OAuth2: the oura-ring README says Oura deprecated personal access tokens in December 2025, so new ones can no longer be created.",
        links: [{ href: "/fix/oura-personal-access-token-deprecated", label: "Oura personal access token deprecated" }],
      },
      {
        text: FITBIT_TURN_OFF
          ? `Google gives ${FITBIT_TURN_OFF.dateText} as the Fitbit Web API's turn-off date, after which it no longer functions or syncs data (Google's Google Health API documentation, read ${GHAPI_FETCHED_ON}). python-fitbit was written for that API.`
          : "Google is retiring the Fitbit Web API, the API python-fitbit was written for, in favour of the Google Health API.",
        links: [
          { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown: what is confirmed" },
          { href: "/google-health-api", label: "Google Health API reference" },
        ],
      },
    ],
    faqs: [
      {
        q: "Which fitness APIs have a Python client on this site's list?",
        a: `${countWord(pyApis.length)}: ${pyByApi}. Each package wraps one vendor's web API, according to its registry description, and none reads Apple HealthKit or Android Health Connect.`,
      },
      {
        q: "Can I read Apple Health or Health Connect data from Python?",
        a: `Not through a web API. HealthKit data lives only on Apple devices and Apple's setup has no tokens or server endpoint, and Health Connect is an on-device Android store, not an OAuth cloud API, so neither offers an endpoint for a Python client to call. The Python packages this site tracks call vendor web APIs instead: ${pyApiList}.`,
      },
      {
        q: "Which Python fitness API clients are deprecated or looking for a maintainer?",
        a: `garth: its README says it is deprecated and no longer maintained${garth.registryStatus ? `, and its PyPI classifier reads "${garth.registryStatus}"` : ""}. oura, the python-ouraring project: its README asks for someone to take over maintenance. Two more had published nothing newer at our registry read: fitbit (python-fitbit), last released in ${monthYear(fitbit.latestPublished)}, and withings-api, in ${monthYear(withings.latestPublished)}.`,
      },
      {
        q: "How do the Python fitness API clients sign in?",
        a: "Each in its vendor's way, according to its README. garminconnect logs in with the user's own Garmin credentials through Garmin's mobile sign-in flow, with an MFA callback, and stores the tokens locally. stravalib authenticates against a Strava app you register and keeps the token current. oura-ring wraps Oura's OAuth2 authorization-code flow, while the older oura client's examples start from a personal access token. withings-api uses OAuth 2.0 with a client ID and consumer secret from a Withings developer application, and python-fitbit is built on requests-oauthlib. garth's README says new logins no longer work.",
      },
    ],
  },
];

// ── Guards and joins ──────────────────────────────────────────────────────

const PACKAGE_SLUGS = new Set(LIBRARIES.map((l) => l.slug));
{
  const seen = new Set<string>();
  const covered = new Set<string>();
  for (const l of LIBRARY_LANDINGS) {
    if (l.slug === "compare" || PACKAGE_SLUGS.has(l.slug)) {
      throw new Error(`librariesLandings: "${l.slug}" is a package slug or the comparison route; a landing there would shadow it.`);
    }
    if (seen.has(l.slug)) throw new Error(`librariesLandings: duplicate landing "${l.slug}"`);
    seen.add(l.slug);
    if (l.title.length > 60) throw new Error(`librariesLandings: ${l.slug} title is ${l.title.length} characters (60 max)`);
    for (const g of l.groups) {
      if (covered.has(g)) throw new Error(`librariesLandings: the ${g} group is on two landings`);
      covered.add(g);
    }
    for (const c of l.choose) {
      for (const s of c.slugs) {
        if (!l.groups.includes(lib(s).group)) throw new Error(`librariesLandings: ${l.slug} names ${s}, which is not in its groups`);
      }
      if (c.compare) comparison(c.compare);
    }
  }
  // One landing per group with three or more packages (qa holds the built
  // pages to the same rule).
  const counts = new Map<string, number>();
  for (const l of LIBRARIES) counts.set(l.group, (counts.get(l.group) ?? 0) + 1);
  for (const [g, n] of counts) {
    if (n >= 3 && !covered.has(g)) throw new Error(`librariesLandings: the ${g} group has ${n} packages and no landing`);
  }
}

export const landingPath = (l: LibraryLanding) => `${LIBRARIES_BASE}/${l.slug}`;

export function getLibraryLanding(slug: string): LibraryLanding {
  const l = LIBRARY_LANDINGS.find((x) => x.slug === slug);
  if (!l) throw new Error(`librariesLandings: no landing "${slug}"`);
  return l;
}

/** The landing a package group belongs to, if it has one. */
export function landingForGroup(group: LibraryGroup): LibraryLanding | undefined {
  return LIBRARY_LANDINGS.find((l) => l.groups.includes(group));
}

/** Every package on a landing, in the generated order, with its notes. */
export function landingPackages(l: LibraryLanding): LibraryPage[] {
  return libraryPages().filter((p) => l.groups.includes(p.lib.group));
}

/** The comparisons whose two packages are both on the landing. */
export function landingComparisons(l: LibraryLanding): LibraryComparison[] {
  return LIBRARY_COMPARISONS.filter((c) => l.groups.includes(lib(c.a).group) && l.groups.includes(lib(c.b).group));
}

/** The native and vendor pages the landing's packages link, once each, in
 *  package order. Labels only: each note's `why` is written for one package. */
export function landingNativeLinks(l: LibraryLanding): Pick<NativeLink, "href" | "label">[] {
  const seen = new Set<string>();
  const out: Pick<NativeLink, "href" | "label">[] = [];
  for (const { ed } of landingPackages(l)) {
    for (const n of ed.nativeLinks) {
      if (seen.has(n.href)) continue;
      seen.add(n.href);
      out.push({ href: n.href, label: n.label });
    }
  }
  return out;
}

export const landingTitle = (l: LibraryLanding) => clampTitle(l.title);
export const landingDescription = (l: LibraryLanding) => clampDescription(l.metaDescription);

/** The supporting line of a landing's OG card. */
export function landingOgLine(l: LibraryLanding): string {
  const pkgs = landingPackages(l);
  const ecos = [...new Set(pkgs.map((p) => ECOSYSTEM_LABEL[p.lib.ecosystem]))];
  return `${pkgs.length} packages from ${listJoin(ecos)}, read ${LIBRARIES_FETCHED_ON}`;
}
