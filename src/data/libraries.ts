/**
 * Registry facts for open-source health and fitness packages.
 *
 * GENERATED — do not hand-edit. Produced by scripts/fetch-libraries.mjs from
 * the npm registry, pub.dev, PyPI, the GitHub REST API and a depth-1 git
 * fetch; refreshed weekly by .github/workflows/libraries.yml. Hand-written
 * notes per package live in src/data/librariesEditorial.ts.
 *
 * Every derived field carries the metadata it was read from (`*Evidence`,
 * `requiresSource`) and is null where the registry does not state it.
 * `repoStats` and `lastCommitOnDefaultBranch` carry their own check date,
 * because they can be older than LIBRARIES_FETCHED_ON when GitHub was not
 * reachable from the run that wrote this file.
 */

export type LibraryEcosystem = "npm" | "pub" | "pypi";
export type LibraryGroup = "react-native" | "capacitor-cordova" | "flutter" | "python";

export type Library = {
  slug: string;
  ecosystem: LibraryEcosystem;
  /** The exact registry name — what goes after npm install / pub add / pip install. */
  name: string;
  group: LibraryGroup;
  /** Why the package is on this list (curated in the generator). */
  why: string;
  registryUrl: string;
  description: string | null;
  latestVersion: string;
  /** YYYY-MM-DD the latest version was published (npm time, pub published, PyPI upload). */
  latestPublished: string;
  firstPublished: string;
  versionCount: number;
  license: string | null;
  licenseEvidence: string | null;
  repositoryUrl: string | null;
  homepage: string | null;
  platforms: string[] | null;
  platformsEvidence: string | null;
  /** Peer/runtime constraints exactly as the registry states them. */
  requires: Record<string, string> | null;
  requiresSource: string | null;
  deprecated: { source: string; message: string } | null;
  /** PyPI "Development Status" classifier, verbatim. */
  registryStatus: string | null;
  distTags: Record<string, string> | null;
  /** Stores / vendor APIs the registry description names. */
  wraps: string[] | null;
  wrapsEvidence: string | null;
  /** owner/repo as the registry metadata names it. */
  repo: string | null;
  /** owner/repo as GitHub reports it (differs after a rename). */
  repoFullName: string | null;
  repoStats: {
    stars: number | null;
    openIssues: number | null;
    /** GitHub pushed_at: a push to ANY branch or tag. */
    pushedAt: string | null;
    archived: boolean;
    checkedOn: string;
  } | null;
  lastCommitOnDefaultBranch: { date: string | null; sha: string; checkedOn: string } | null;
};

/** The date this file was last written from a successful run. */
export const LIBRARIES_FETCHED_ON = "2026-10-03";

/** Rows the generator expects; it refuses to write fewer. */
export const LIBRARIES_EXPECTED_ROWS = 20;

export const LIBRARIES: Library[] = [
  {
    "slug": "react-native-health",
    "ecosystem": "npm",
    "name": "react-native-health",
    "group": "react-native",
    "why": "The long-standing React Native bridge to Apple HealthKit, and the one this site's SDK release tracker follows.",
    "registryUrl": "https://www.npmjs.com/package/react-native-health",
    "description": "A React Native package to interact with Apple HealthKit",
    "latestVersion": "1.19.0",
    "latestPublished": "2024-10-15",
    "firstPublished": "2020-09-21",
    "versionCount": 40,
    "license": "MIT",
    "licenseEvidence": "package.json license",
    "repositoryUrl": "git+https://github.com/agencyenterprise/react-native-healthkit.git",
    "homepage": "https://github.com/agencyenterprise/react-native-healthkit#readme",
    "platforms": null,
    "platformsEvidence": null,
    "requires": {
      "react-native": ">=0.67.3"
    },
    "requiresSource": "package.json peerDependencies",
    "deprecated": null,
    "registryStatus": null,
    "distTags": {
      "latest": "1.19.0"
    },
    "wraps": [
      "Apple HealthKit"
    ],
    "wrapsEvidence": "registry description: \"A React Native package to interact with Apple HealthKit\"",
    "repo": "agencyenterprise/react-native-healthkit",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2024-10-15",
      "sha": "84d946aad6f2",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "kingstinct-react-native-healthkit",
    "ecosystem": "npm",
    "name": "@kingstinct/react-native-healthkit",
    "group": "react-native",
    "why": "The other React Native HealthKit binding, typed close to Apple's own identifiers — the usual alternative to react-native-health.",
    "registryUrl": "https://www.npmjs.com/package/@kingstinct/react-native-healthkit",
    "description": "React Native bindings for HealthKit",
    "latestVersion": "16.0.0",
    "latestPublished": "2026-09-18",
    "firstPublished": "2019-02-19",
    "versionCount": 101,
    "license": "MIT",
    "licenseEvidence": "package.json license",
    "repositoryUrl": "git+https://github.com/kingstinct/react-native-healthkit.git",
    "homepage": "https://github.com/kingstinct/react-native-healthkit#readme",
    "platforms": null,
    "platformsEvidence": null,
    "requires": {
      "react": ">=19",
      "react-native": ">=0.79",
      "react-native-nitro-modules": ">=0.35"
    },
    "requiresSource": "package.json peerDependencies",
    "deprecated": null,
    "registryStatus": null,
    "distTags": {
      "latest": "16.0.0"
    },
    "wraps": [
      "Apple HealthKit"
    ],
    "wrapsEvidence": "registry description: \"React Native bindings for HealthKit\"",
    "repo": "kingstinct/react-native-healthkit",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-10-02",
      "sha": "0a72f7c5159c",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "react-native-health-connect",
    "ecosystem": "npm",
    "name": "react-native-health-connect",
    "group": "react-native",
    "why": "The React Native wrapper for Android Health Connect; since v4 it also carries the Expo config plugin.",
    "registryUrl": "https://www.npmjs.com/package/react-native-health-connect",
    "description": "React native library for health connect (Android only)",
    "latestVersion": "4.1.3",
    "latestPublished": "2026-08-06",
    "firstPublished": "2022-05-11",
    "versionCount": 46,
    "license": "MIT",
    "licenseEvidence": "package.json license",
    "repositoryUrl": "git+https://github.com/matinzd/react-native-health-connect.git",
    "homepage": "https://github.com/matinzd/react-native-health-connect#readme",
    "platforms": [
      "android"
    ],
    "platformsEvidence": "registry description: \"React native library for health connect (Android only)\"",
    "requires": {
      "@expo/config-plugins": ">= 6.0.2",
      "expo": "*",
      "react": "*",
      "react-native": "*"
    },
    "requiresSource": "package.json peerDependencies",
    "deprecated": null,
    "registryStatus": null,
    "distTags": {
      "alpha": "0.1.0-alpha.8",
      "latest": "4.1.3"
    },
    "wraps": [
      "Health Connect"
    ],
    "wrapsEvidence": "registry description: \"React native library for health connect (Android only)\"",
    "repo": "matinzd/react-native-health-connect",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-08-26",
      "sha": "8d72b6a07743",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "expo-health-connect",
    "ecosystem": "npm",
    "name": "expo-health-connect",
    "group": "react-native",
    "why": "Still in many Expo app.json files. Deprecated in the registry and merged into react-native-health-connect v4 — the page exists to say how to remove it.",
    "registryUrl": "https://www.npmjs.com/package/expo-health-connect",
    "description": "Expo config plugin for react-native-health-connect",
    "latestVersion": "0.1.1",
    "latestPublished": "2024-07-31",
    "firstPublished": "2024-06-30",
    "versionCount": 2,
    "license": "MIT",
    "licenseEvidence": "package.json license",
    "repositoryUrl": "git+https://github.com/matinzd/expo-health-connect.git",
    "homepage": "https://github.com/matinzd/expo-health-connect#readme",
    "platforms": null,
    "platformsEvidence": null,
    "requires": {
      "expo": "*",
      "react": "*",
      "react-native": "*"
    },
    "requiresSource": "package.json peerDependencies",
    "deprecated": {
      "source": "npm deprecation message on the latest version",
      "message": "Merged into react-native-health-connect v4 — remove this package, replace the expo-health-connect entry in your app.json plugins array with react-native-health-connect, then re-run expo prebuild --clean. See https://github.com/matinzd/react-native-health-connect"
    },
    "registryStatus": null,
    "distTags": {
      "latest": "0.1.1"
    },
    "wraps": null,
    "wrapsEvidence": null,
    "repo": "matinzd/expo-health-connect",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-08-01",
      "sha": "36856dff8cfc",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "react-native-google-fit",
    "ecosystem": "npm",
    "name": "react-native-google-fit",
    "group": "react-native",
    "why": "The React Native bridge to the Google Fit Android API, which Google has deprecated in favour of Health Connect.",
    "registryUrl": "https://www.npmjs.com/package/react-native-google-fit",
    "description": "A React Native bridge module for interacting with Google Fit",
    "latestVersion": "0.22.1",
    "latestPublished": "2025-10-08",
    "firstPublished": "2017-01-12",
    "versionCount": 72,
    "license": "MIT",
    "licenseEvidence": "package.json license",
    "repositoryUrl": "git+https://github.com/StasDoskalenko/react-native-google-fit.git",
    "homepage": "https://github.com/StasDoskalenko/react-native-google-fit#readme",
    "platforms": null,
    "platformsEvidence": null,
    "requires": {
      "expo": "*",
      "react-native": ">=0.60.0"
    },
    "requiresSource": "package.json peerDependencies",
    "deprecated": null,
    "registryStatus": null,
    "distTags": {
      "latest": "0.22.1"
    },
    "wraps": [
      "Google Fit"
    ],
    "wrapsEvidence": "registry description: \"A React Native bridge module for interacting with Google Fit\"",
    "repo": "StasDoskalenko/react-native-google-fit",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-10-02",
      "sha": "bf3dcb0e7635",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "capacitor-health",
    "ecosystem": "npm",
    "name": "capacitor-health",
    "group": "capacitor-cordova",
    "why": "A Capacitor plugin over both Apple Health and Health Connect, derived in part from cordova-plugin-health.",
    "registryUrl": "https://www.npmjs.com/package/capacitor-health",
    "description": "Capacitor plugin for Apple Health and Google Health Connect",
    "latestVersion": "8.4.0",
    "latestPublished": "2026-09-23",
    "firstPublished": "2024-10-02",
    "versionCount": 23,
    "license": "MIT",
    "licenseEvidence": "package.json license",
    "repositoryUrl": "git+https://github.com/mley/capacitor-health.git",
    "homepage": "https://github.com/mley/capacitor-health#readme",
    "platforms": [
      "ios",
      "android"
    ],
    "platformsEvidence": "package.json \"capacitor\" keys: ios, android",
    "requires": {
      "@capacitor/core": ">=8.0.0"
    },
    "requiresSource": "package.json peerDependencies",
    "deprecated": null,
    "registryStatus": null,
    "distTags": {
      "latest": "8.4.0"
    },
    "wraps": [
      "Apple HealthKit",
      "Health Connect"
    ],
    "wrapsEvidence": "registry description: \"Capacitor plugin for Apple Health and Google Health Connect\"",
    "repo": "mley/capacitor-health",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-09-23",
      "sha": "7666a54bf3a2",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "capgo-capacitor-health",
    "ecosystem": "npm",
    "name": "@capgo/capacitor-health",
    "group": "capacitor-cordova",
    "why": "Capgo's Capacitor plugin over HealthKit and Health Connect — the other cross-platform choice for Capacitor apps.",
    "registryUrl": "https://www.npmjs.com/package/@capgo/capacitor-health",
    "description": "Capacitor plugin to interact with data from Apple HealthKit and Health Connect",
    "latestVersion": "8.11.4",
    "latestPublished": "2026-09-22",
    "firstPublished": "2025-09-24",
    "versionCount": 99,
    "license": "MPL-2.0",
    "licenseEvidence": "package.json license",
    "repositoryUrl": "git+https://github.com/Cap-go/capacitor-health.git",
    "homepage": "https://capgo.app/docs/plugins/health/",
    "platforms": [
      "ios",
      "android"
    ],
    "platformsEvidence": "package.json \"capacitor\" keys: ios, android",
    "requires": {
      "@capacitor/core": ">=8.0.0"
    },
    "requiresSource": "package.json peerDependencies",
    "deprecated": null,
    "registryStatus": null,
    "distTags": {
      "latest": "8.11.4"
    },
    "wraps": [
      "Apple HealthKit",
      "Health Connect"
    ],
    "wrapsEvidence": "registry description: \"Capacitor plugin to interact with data from Apple HealthKit and Health Connect\"",
    "repo": "Cap-go/capacitor-health",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-09-22",
      "sha": "d4b4dbb7f237",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "perfood-capacitor-healthkit",
    "ecosystem": "npm",
    "name": "@perfood/capacitor-healthkit",
    "group": "capacitor-cordova",
    "why": "An iOS-only Capacitor plugin for HealthKit, still found in older Ionic projects.",
    "registryUrl": "https://www.npmjs.com/package/@perfood/capacitor-healthkit",
    "description": "Capacitor plugin to read data from and write data to Apple Health",
    "latestVersion": "1.3.2",
    "latestPublished": "2025-02-13",
    "firstPublished": "2022-05-02",
    "versionCount": 14,
    "license": "MIT",
    "licenseEvidence": "package.json license",
    "repositoryUrl": "git+https://github.com/perfood/capacitor-healthkit.git",
    "homepage": "https://github.com/perfood/capacitor-healthkit#readme",
    "platforms": [
      "ios"
    ],
    "platformsEvidence": "package.json \"capacitor\" keys: ios",
    "requires": {
      "@capacitor/core": "^4.0.0"
    },
    "requiresSource": "package.json peerDependencies",
    "deprecated": null,
    "registryStatus": null,
    "distTags": {
      "beta": "1.1.0-2",
      "next": "2.0.0-alpha.2",
      "latest": "1.3.2"
    },
    "wraps": [
      "Apple HealthKit"
    ],
    "wrapsEvidence": "registry description: \"Capacitor plugin to read data from and write data to Apple Health\"",
    "repo": "perfood/capacitor-healthkit",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2025-02-13",
      "sha": "59a6dedd4158",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "cordova-plugin-health",
    "ecosystem": "npm",
    "name": "cordova-plugin-health",
    "group": "capacitor-cordova",
    "why": "The Cordova plugin over HealthKit and Health Connect, published since 2016 and documented for manual use under Capacitor.",
    "registryUrl": "https://www.npmjs.com/package/cordova-plugin-health",
    "description": "A plugin that abstracts fitness and health repositories like Apple HealthKit or Google Health Connect",
    "latestVersion": "3.3.0",
    "latestPublished": "2026-09-26",
    "firstPublished": "2016-01-12",
    "versionCount": 50,
    "license": "MIT",
    "licenseEvidence": "package.json license",
    "repositoryUrl": "git+https://github.com/dariosalvi78/cordova-plugin-health.git",
    "homepage": "https://github.com/dariosalvi78/cordova-plugin-health",
    "platforms": [
      "android",
      "ios"
    ],
    "platformsEvidence": "package.json engines.cordovaDependencies names cordova-android, cordova-ios",
    "requires": {
      "cordova": ">12.0.0",
      "cordova-ios": ">7.0.0",
      "cordova-android": ">12.0.0"
    },
    "requiresSource": "package.json engines.cordovaDependencies[\"3.0.0\"]",
    "deprecated": null,
    "registryStatus": null,
    "distTags": {
      "latest": "3.3.0"
    },
    "wraps": [
      "Apple HealthKit",
      "Health Connect"
    ],
    "wrapsEvidence": "registry description: \"A plugin that abstracts fitness and health repositories like Apple HealthKit or Google Health Connect\"",
    "repo": "dariosalvi78/cordova-plugin-health",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-10-03",
      "sha": "ed339de45bee",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "flutter-health",
    "ecosystem": "pub",
    "name": "health",
    "group": "flutter",
    "why": "The Flutter plugin over HealthKit and Health Connect most Flutter health apps start from.",
    "registryUrl": "https://pub.dev/packages/health",
    "description": "Wrapper for Apple's HealthKit on iOS and Google's Health Connect on Android.",
    "latestVersion": "13.3.2",
    "latestPublished": "2026-08-14",
    "firstPublished": "2019-11-08",
    "versionCount": 91,
    "license": "MIT",
    "licenseEvidence": "pub.dev tags: license:mit",
    "repositoryUrl": "https://github.com/carp-dk/carp-health-flutter",
    "homepage": "https://github.com/carp-dk/carp-health-flutter",
    "platforms": [
      "android",
      "ios"
    ],
    "platformsEvidence": "pubspec flutter.plugin.platforms: android, ios",
    "requires": {
      "sdk": ">=3.8.0 <4.0.0",
      "flutter": ">=3.6.0"
    },
    "requiresSource": "pubspec environment",
    "deprecated": null,
    "registryStatus": null,
    "distTags": null,
    "wraps": [
      "Apple HealthKit",
      "Health Connect"
    ],
    "wrapsEvidence": "registry description: \"Wrapper for Apple's HealthKit on iOS and Google's Health Connect on Android.\"",
    "repo": "carp-dk/carp-health-flutter",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-08-14",
      "sha": "d90dbb717f04",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "health-connector",
    "ecosystem": "pub",
    "name": "health_connector",
    "group": "flutter",
    "why": "A newer Flutter SDK over HealthKit and Health Connect, first published in November 2025 — the alternative to `health`.",
    "registryUrl": "https://pub.dev/packages/health_connector",
    "description": "The most comprehensive Flutter health SDK for seamless iOS HealthKit and Android Health Connect integration.",
    "latestVersion": "3.11.1",
    "latestPublished": "2026-09-16",
    "firstPublished": "2025-11-23",
    "versionCount": 38,
    "license": "MIT",
    "licenseEvidence": "pub.dev tags: license:mit",
    "repositoryUrl": "https://github.com/fam-tung-lam/health_connector/tree/main/packages/health_connector",
    "homepage": "https://github.com/fam-tung-lam/health_connector",
    "platforms": [
      "android",
      "ios"
    ],
    "platformsEvidence": "pub.dev platform tags: platform:android, platform:ios",
    "requires": {
      "sdk": "^3.10.0",
      "flutter": ">=3.38.0"
    },
    "requiresSource": "pubspec environment",
    "deprecated": null,
    "registryStatus": null,
    "distTags": null,
    "wraps": [
      "Apple HealthKit",
      "Health Connect"
    ],
    "wrapsEvidence": "registry description: \"The most comprehensive Flutter health SDK for seamless iOS HealthKit and Android Health Connect integration.\"",
    "repo": "fam-tung-lam/health_connector",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-09-16",
      "sha": "1c26b1a922a3",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "health-kit-reporter",
    "ecosystem": "pub",
    "name": "health_kit_reporter",
    "group": "flutter",
    "why": "An iOS-only Flutter wrapper around the HealthKitReporter CocoaPods library.",
    "registryUrl": "https://pub.dev/packages/health_kit_reporter",
    "description": "Helps to write or read data from Apple Health via HealthKit framework.",
    "latestVersion": "2.3.1",
    "latestPublished": "2024-12-12",
    "firstPublished": "2020-11-20",
    "versionCount": 30,
    "license": "MIT",
    "licenseEvidence": "pub.dev tags: license:mit",
    "repositoryUrl": "https://github.com/VictorKachalov/health_kit_reporter",
    "homepage": "https://github.com/VictorKachalov/health_kit_reporter",
    "platforms": [
      "ios"
    ],
    "platformsEvidence": "pubspec flutter.plugin.platforms: ios",
    "requires": {
      "sdk": ">=2.12.0 <4.0.0",
      "flutter": ">=1.20.0"
    },
    "requiresSource": "pubspec environment",
    "deprecated": null,
    "registryStatus": null,
    "distTags": null,
    "wraps": [
      "Apple HealthKit"
    ],
    "wrapsEvidence": "registry description: \"Helps to write or read data from Apple Health via HealthKit framework.\"",
    "repo": "VictorKachalov/health_kit_reporter",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2024-12-12",
      "sha": "af945db4a10a",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "flutter-health-connect",
    "ecosystem": "pub",
    "name": "flutter_health_connect",
    "group": "flutter",
    "why": "A Health Connect-only Flutter plugin that still turns up in search results and older projects.",
    "registryUrl": "https://pub.dev/packages/flutter_health_connect",
    "description": "Flutter plugin for Google Health Connect integration. Health Connect gives you a simple way to store and connect the data between your health and fitness apps.",
    "latestVersion": "1.2.3",
    "latestPublished": "2023-03-08",
    "firstPublished": "2023-01-20",
    "versionCount": 15,
    "license": "MIT",
    "licenseEvidence": "pub.dev tags: license:mit",
    "repositoryUrl": "https://github.com/duynguyen242/flutter_health_connect",
    "homepage": "https://github.com/duynguyen242/flutter_health_connect",
    "platforms": [
      "android",
      "ios"
    ],
    "platformsEvidence": "pubspec flutter.plugin.platforms: android, ios",
    "requires": {
      "sdk": ">=2.17.0 <3.0.0",
      "flutter": ">=2.5.0"
    },
    "requiresSource": "pubspec environment",
    "deprecated": null,
    "registryStatus": null,
    "distTags": null,
    "wraps": [
      "Health Connect"
    ],
    "wrapsEvidence": "registry description: \"Flutter plugin for Google Health Connect integration. Health Connect gives you a simple way to store and connect the data between your health and fitness apps.\"",
    "repo": "duynguyen242/flutter_health_connect",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2023-07-04",
      "sha": "d35ff4c4b0d6",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "garminconnect",
    "ecosystem": "pypi",
    "name": "garminconnect",
    "group": "python",
    "why": "The Python client most people reach for to read their own Garmin Connect data.",
    "registryUrl": "https://pypi.org/project/garminconnect/",
    "description": "Python 3 API wrapper for Garmin Connect",
    "latestVersion": "0.3.17",
    "latestPublished": "2026-09-29",
    "firstPublished": "2020-01-04",
    "versionCount": 110,
    "license": "MIT",
    "licenseEvidence": "PyPI license field",
    "repositoryUrl": "https://github.com/cyberjunky/python-garminconnect",
    "homepage": "https://github.com/cyberjunky/python-garminconnect",
    "platforms": null,
    "platformsEvidence": null,
    "requires": {
      "python": ">=3.12"
    },
    "requiresSource": "PyPI requires_python",
    "deprecated": null,
    "registryStatus": "Development Status :: 5 - Production/Stable",
    "distTags": null,
    "wraps": [
      "Garmin Connect"
    ],
    "wrapsEvidence": "registry description: \"Python 3 API wrapper for Garmin Connect\"",
    "repo": "cyberjunky/python-garminconnect",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-09-29",
      "sha": "218e72ca5459",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "garth",
    "ecosystem": "pypi",
    "name": "garth",
    "group": "python",
    "why": "The Garmin auth library garminconnect used to depend on; its README now declares it deprecated.",
    "registryUrl": "https://pypi.org/project/garth/",
    "description": "Garmin SSO auth + Connect client",
    "latestVersion": "0.8.0",
    "latestPublished": "2026-03-28",
    "firstPublished": "2023-07-05",
    "versionCount": 125,
    "license": "MIT",
    "licenseEvidence": "PyPI license field",
    "repositoryUrl": "https://github.com/matin/garth",
    "homepage": "https://github.com/matin/garth",
    "platforms": null,
    "platformsEvidence": null,
    "requires": {
      "python": ">=3.10"
    },
    "requiresSource": "PyPI requires_python",
    "deprecated": null,
    "registryStatus": "Development Status :: 7 - Inactive",
    "distTags": null,
    "wraps": [
      "Garmin Connect"
    ],
    "wrapsEvidence": "registry description: \"Garmin SSO auth + Connect client\"",
    "repo": "matin/garth",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-03-28",
      "sha": "f99159a15c4c",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "stravalib",
    "ecosystem": "pypi",
    "name": "stravalib",
    "group": "python",
    "why": "The Python client for the Strava V3 API.",
    "registryUrl": "https://pypi.org/project/stravalib/",
    "description": "A Python package that makes it easy to access and download data from the Strava V3 REST API.",
    "latestVersion": "2.6.0",
    "latestPublished": "2026-08-27",
    "firstPublished": "2013-04-06",
    "versionCount": 45,
    "license": "Apache-2.0",
    "licenseEvidence": "PyPI license_expression",
    "repositoryUrl": "https://github.com/stravalib/stravalib",
    "homepage": null,
    "platforms": null,
    "platformsEvidence": null,
    "requires": {
      "python": ">=3.11"
    },
    "requiresSource": "PyPI requires_python",
    "deprecated": null,
    "registryStatus": "Development Status :: 5 - Production/Stable",
    "distTags": null,
    "wraps": [
      "Strava API"
    ],
    "wrapsEvidence": "registry description: \"A Python package that makes it easy to access and download data from the Strava V3 REST API.\"",
    "repo": "stravalib/stravalib",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-09-22",
      "sha": "1951f26e01b9",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "oura-ring",
    "ecosystem": "pypi",
    "name": "oura-ring",
    "group": "python",
    "why": "A Python client for the Oura API v2 with an OAuth2 helper.",
    "registryUrl": "https://pypi.org/project/oura-ring/",
    "description": "Python client for the Oura API v2 with OAuth2 support.",
    "latestVersion": "1.0.1",
    "latestPublished": "2026-06-22",
    "firstPublished": "2022-09-02",
    "versionCount": 5,
    "license": "MIT",
    "licenseEvidence": "PyPI license field",
    "repositoryUrl": "https://github.com/hedgertronic/oura-ring",
    "homepage": "https://github.com/hedgertronic/oura-ring",
    "platforms": null,
    "platformsEvidence": null,
    "requires": {
      "python": ">=3.12"
    },
    "requiresSource": "PyPI requires_python",
    "deprecated": null,
    "registryStatus": "Development Status :: 5 - Production/Stable",
    "distTags": null,
    "wraps": [
      "Oura API"
    ],
    "wrapsEvidence": "registry description: \"Python client for the Oura API v2 with OAuth2 support.\"",
    "repo": "hedgertronic/oura-ring",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2026-07-07",
      "sha": "691dc2e75e97",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "oura-python",
    "ecosystem": "pypi",
    "name": "oura",
    "group": "python",
    "why": "The older Python Oura client (repository python-ouraring), whose maintainer is asking for someone to take it over.",
    "registryUrl": "https://pypi.org/project/oura/",
    "description": "Oura API client",
    "latestVersion": "1.3.0",
    "latestPublished": "2024-04-23",
    "firstPublished": "2019-01-08",
    "versionCount": 5,
    "license": "MIT License",
    "licenseEvidence": "PyPI classifier \"License :: OSI Approved :: MIT License\"",
    "repositoryUrl": "https://github.com/turing-complet/python-ouraring",
    "homepage": "https://github.com/turing-complet/python-ouraring",
    "platforms": null,
    "platformsEvidence": null,
    "requires": {
      "python": ">=3.8"
    },
    "requiresSource": "PyPI requires_python",
    "deprecated": null,
    "registryStatus": null,
    "distTags": null,
    "wraps": [
      "Oura API"
    ],
    "wrapsEvidence": "registry description: \"Oura API client\"",
    "repo": "turing-complet/python-ouraring",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2024-04-23",
      "sha": "35fd39c1b1ad",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "python-fitbit",
    "ecosystem": "pypi",
    "name": "fitbit",
    "group": "python",
    "why": "The python-fitbit client for the legacy Fitbit Web API, which Google is retiring in favour of the Google Health API.",
    "registryUrl": "https://pypi.org/project/fitbit/",
    "description": "Fitbit API Wrapper.",
    "latestVersion": "0.3.1",
    "latestPublished": "2019-05-24",
    "firstPublished": "2012-10-15",
    "versionCount": 14,
    "license": "Apache 2.0",
    "licenseEvidence": "PyPI license field",
    "repositoryUrl": "https://github.com/orcasgit/python-fitbit",
    "homepage": "https://github.com/orcasgit/python-fitbit",
    "platforms": null,
    "platformsEvidence": null,
    "requires": null,
    "requiresSource": null,
    "deprecated": null,
    "registryStatus": null,
    "distTags": null,
    "wraps": [
      "Fitbit Web API"
    ],
    "wrapsEvidence": "registry description: \"Fitbit API Wrapper.\"",
    "repo": "orcasgit/python-fitbit",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2019-08-12",
      "sha": "6a0a7cba26c2",
      "checkedOn": "2026-10-03"
    }
  },
  {
    "slug": "withings-api",
    "ecosystem": "pypi",
    "name": "withings-api",
    "group": "python",
    "why": "A Python client for the Withings Health API using OAuth 2.0.",
    "registryUrl": "https://pypi.org/project/withings-api/",
    "description": "Library for the Withings API",
    "latestVersion": "2.4.0",
    "latestPublished": "2022-02-08",
    "firstPublished": "2019-10-06",
    "versionCount": 27,
    "license": "MIT",
    "licenseEvidence": "PyPI license field",
    "repositoryUrl": "https://github.com/vangorra/python_withings_api",
    "homepage": "https://github.com/vangorra/python_withings_api",
    "platforms": null,
    "platformsEvidence": null,
    "requires": {
      "python": ">=3.6,<4.0"
    },
    "requiresSource": "PyPI requires_python",
    "deprecated": null,
    "registryStatus": null,
    "distTags": null,
    "wraps": [
      "Withings API"
    ],
    "wrapsEvidence": "registry description: \"Library for the Withings API\"",
    "repo": "vangorra/python_withings_api",
    "repoFullName": null,
    "repoStats": null,
    "lastCommitOnDefaultBranch": {
      "date": "2022-03-05",
      "sha": "69c21c32449b",
      "checkedOn": "2026-10-03"
    }
  }
];
