/**
 * Platform error codes for HealthKit and Health Connect, read from Apple's
 * and Google's own reference documentation.
 *
 * GENERATED — do not hand-edit; regenerate with node scripts/fetch-error-codes.mjs
 *
 * Sources:
 *   https://developer.apple.com/documentation/healthkit/hkerror/code (and each case's page)
 *   https://developer.android.com/reference/android/health/connect/HealthConnectException
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient
 * Fetched: 2026-10-03
 *
 * Apple publishes no raw integer values for HKError.Code, so HK rows carry
 * none. Google prints a value for every HealthConnectException constant, so
 * those rows do.
 *
 * The one derived field is Health Connect's `similarTo`, copied from
 * Google's "This error may be considered similar to X" sentence, which is
 * stored beside it in `similarToEvidence`. Null where Google says nothing.
 *
 * Which fix page a code links to is editorial, not generated: see
 * src/data/errorCodesEditorial.ts.
 */

/** The date the generator last read the sources. */
export const ERROR_CODES_FETCHED_ON = "2026-10-03";

/** The reference pages this file was read from. */
export const ERROR_CODES_SOURCES = {
  "hkErrorCode": "https://developer.apple.com/documentation/healthkit/hkerror/code",
  "healthConnectException": "https://developer.android.com/reference/android/health/connect/HealthConnectException",
  "healthConnectClient": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient"
} as const;

/**
 * Whether the Jetpack HealthConnectClient reference names the framework's
 * HealthConnectException anywhere on the page (it was absent on the
 * 2026-10-03 read: the Jetpack Throws tables name only the exceptions in
 * HC_CLIENT_EXCEPTIONS). A literal substring check of the page.
 */
export const HC_CLIENT_NAMES_HEALTHCONNECTEXCEPTION = false;

/** Google's "Last updated" footer stamp on each Android page at read time. */
export const ERROR_CODES_SOURCE_UPDATED = {
  "healthConnectException": "2026-08-03",
  "healthConnectClient": "2026-08-26"
};

export type HkErrorCodePlatform = {
  name: string;
  introducedAt: string | null;
  /** True when Apple gives this platform a deprecatedAt version (or sets the
   *  deprecated boolean, which it in practice leaves false). */
  deprecated: boolean;
  /** The evidence for `deprecated`. Null where Apple gives none. */
  deprecatedAt: string | null;
  beta: boolean;
};

export type HkErrorCode = {
  /** Swift case on HKError.Code, e.g. "errorAuthorizationDenied". */
  case: string;
  /** Objective-C constant from Apple's navigator title, e.g.
   *  "HKErrorAuthorizationDenied". Null when Apple gives none. */
  objc: string | null;
  /** Apple's role heading for the symbol ("Case", "Type Property"). */
  kind: string | null;
  /** Apple's topic group on the HKError.Code page. */
  group: string;
  /** Apple's one-line abstract, verbatim; null when Apple publishes none. */
  abstract: string | null;
  /** Apple's discussion, symbol links resolved to their names; null when none. */
  discussion: string | null;
  /** True when Apple ships the case with neither abstract nor discussion. */
  undocumented: boolean;
  platforms: HkErrorCodePlatform[];
  deprecated: boolean;
  /** Apple's own words on the deprecation; null when not deprecated. */
  deprecation: { message: string | null; renamedTo: string | null } | null;
  /** The declarations as Apple prints them, per language ("swift", "occ"). */
  declarations: { language: string; text: string }[];
  /** Apple's reference page for the case — the page this row was read from. */
  docUrl: string;
};

/** Every HKError.Code case, in Apple's topic order. */
export const HK_ERROR_CODES: HkErrorCode[] = [
  {
    "case": "errorHealthDataUnavailable",
    "objc": "HKErrorHealthDataUnavailable",
    "kind": "Case",
    "group": "Errors",
    "abstract": "HealthKit accessed on an unsupported device, such as an iPad.",
    "discussion": "Because iOS apps can run on devices that don’t support HealthKit (for example, on an iPad), always verify that the current device supports HealthKit by calling isHealthDataAvailable() before calling any other HealthKit methods. If HealthKit isn’t available on the device, other HealthKit methods fail with an errorHealthDataUnavailable error.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorHealthDataUnavailable"
      },
      {
        "language": "occ",
        "text": "HKErrorHealthDataUnavailable"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errorhealthdataunavailable"
  },
  {
    "case": "errorHealthDataRestricted",
    "objc": "HKErrorHealthDataRestricted",
    "kind": "Case",
    "group": "Errors",
    "abstract": "A Mobile Device Management (MDM) profile restricts the use of HealthKit on this device.",
    "discussion": "Because an MDM profile can disable HealthKit on a managed device, always verify that the current device supports HealthKit by calling isHealthDataAvailable() before calling any other HealthKit methods. If HealthKit is restricted (for example, in an enterprise environment), the methods fail with an errorHealthDataRestricted error.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorHealthDataRestricted"
      },
      {
        "language": "occ",
        "text": "HKErrorHealthDataRestricted"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errorhealthdatarestricted"
  },
  {
    "case": "errorInvalidArgument",
    "objc": "HKErrorInvalidArgument",
    "kind": "Case",
    "group": "Errors",
    "abstract": "The app passed an invalid argument to the HealthKit API.",
    "discussion": null,
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorInvalidArgument"
      },
      {
        "language": "occ",
        "text": "HKErrorInvalidArgument"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errorinvalidargument"
  },
  {
    "case": "errorAuthorizationDenied",
    "objc": "HKErrorAuthorizationDenied",
    "kind": "Case",
    "group": "Errors",
    "abstract": "The user hasn’t given the app permission to save data.",
    "discussion": "This error occurs only when your app attempts to save data. If your app isn’t authorized to query data, it receives only the data that the app has saved into HealthKit. For more information on setting up HealthKit, see HealthKit.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorAuthorizationDenied"
      },
      {
        "language": "occ",
        "text": "HKErrorAuthorizationDenied"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errorauthorizationdenied"
  },
  {
    "case": "errorAuthorizationNotDetermined",
    "objc": "HKErrorAuthorizationNotDetermined",
    "kind": "Case",
    "group": "Errors",
    "abstract": "The app hasn’t yet asked the user for the authorization required to complete the task.",
    "discussion": "This error occurs when your app doesn’t request proper authorization before calling any other HealthKit methods. For more information on setting up HealthKit, see HealthKit.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorAuthorizationNotDetermined"
      },
      {
        "language": "occ",
        "text": "HKErrorAuthorizationNotDetermined"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errorauthorizationnotdetermined"
  },
  {
    "case": "errorRequiredAuthorizationDenied",
    "objc": "HKErrorRequiredAuthorizationDenied",
    "kind": "Case",
    "group": "Errors",
    "abstract": "The user hasn’t granted the application authorization to access all the required clinical record types.",
    "discussion": "You can specify required clinical record types using the NSHealthRequiredReadAuthorizationTypeIdentifiers Info.plist key.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "12.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "12.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "5.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorRequiredAuthorizationDenied"
      },
      {
        "language": "occ",
        "text": "HKErrorRequiredAuthorizationDenied"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errorrequiredauthorizationdenied"
  },
  {
    "case": "errorDatabaseInaccessible",
    "objc": "HKErrorDatabaseInaccessible",
    "kind": "Case",
    "group": "Errors",
    "abstract": "The HealthKit data is unavailable because it’s protected and the device is locked.",
    "discussion": "This error occurs when your app queries for HealthKit data while the device is locked. You can, however, still save data. This data is saved into a temporary file, which is merged with HealthKit’s data when the user unlocks their device.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorDatabaseInaccessible"
      },
      {
        "language": "occ",
        "text": "HKErrorDatabaseInaccessible"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errordatabaseinaccessible"
  },
  {
    "case": "errorUserCanceled",
    "objc": "HKErrorUserCanceled",
    "kind": "Case",
    "group": "Errors",
    "abstract": "The user canceled the operation.",
    "discussion": null,
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorUserCanceled"
      },
      {
        "language": "occ",
        "text": "HKErrorUserCanceled"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errorusercanceled"
  },
  {
    "case": "errorAnotherWorkoutSessionStarted",
    "objc": "HKErrorAnotherWorkoutSessionStarted",
    "kind": "Case",
    "group": "Errors",
    "abstract": "Another app started a workout session.",
    "discussion": "This error occurs whenever a second workout session is started. Apple Watch only runs one workout session at a time. If the user begins a second workout session in a different app, the original session receives this error message and then ends. The second session then starts.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorAnotherWorkoutSessionStarted"
      },
      {
        "language": "occ",
        "text": "HKErrorAnotherWorkoutSessionStarted"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/erroranotherworkoutsessionstarted"
  },
  {
    "case": "errorUserExitedWorkoutSession",
    "objc": "HKErrorUserExitedWorkoutSession",
    "kind": "Case",
    "group": "Errors",
    "abstract": "The user exited your application while a workout session was running.",
    "discussion": "Workout sessions end when the app goes into the background.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorUserExitedWorkoutSession"
      },
      {
        "language": "occ",
        "text": "HKErrorUserExitedWorkoutSession"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/erroruserexitedworkoutsession"
  },
  {
    "case": "errorNoData",
    "objc": "HKErrorNoData",
    "kind": "Case",
    "group": "Errors",
    "abstract": "Data is unavailable for the requested query and predicate.",
    "discussion": "This error indicates that no data exists that corresponds to a particular query, so the system can’t calculate the query’s result. HKStatisticsQuery queries return this error when HealthKit can’t return the data needed to calculate the statistics.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorNoData"
      },
      {
        "language": "occ",
        "text": "HKErrorNoData"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errornodata"
  },
  {
    "case": "errorBackgroundWorkoutSessionNotAllowed",
    "objc": "HKErrorBackgroundWorkoutSessionNotAllowed",
    "kind": "Case",
    "group": "Enumeration Cases",
    "abstract": null,
    "discussion": null,
    "undocumented": true,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorBackgroundWorkoutSessionNotAllowed"
      },
      {
        "language": "occ",
        "text": "HKErrorBackgroundWorkoutSessionNotAllowed"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errorbackgroundworkoutsessionnotallowed"
  },
  {
    "case": "errorDataSizeExceeded",
    "objc": "HKErrorDataSizeExceeded",
    "kind": "Case",
    "group": "Enumeration Cases",
    "abstract": null,
    "discussion": null,
    "undocumented": true,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorDataSizeExceeded"
      },
      {
        "language": "occ",
        "text": "HKErrorDataSizeExceeded"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errordatasizeexceeded"
  },
  {
    "case": "errorNotPermissibleForGuestUserMode",
    "objc": "HKErrorNotPermissibleForGuestUserMode",
    "kind": "Case",
    "group": "Enumeration Cases",
    "abstract": "The app attempted to write HealthKit data while in a Guest User session in visionOS.",
    "discussion": null,
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorNotPermissibleForGuestUserMode"
      },
      {
        "language": "occ",
        "text": "HKErrorNotPermissibleForGuestUserMode"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errornotpermissibleforguestusermode"
  },
  {
    "case": "errorWorkoutActivityNotAllowed",
    "objc": "HKErrorWorkoutActivityNotAllowed",
    "kind": "Case",
    "group": "Enumeration Cases",
    "abstract": null,
    "discussion": null,
    "undocumented": true,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case errorWorkoutActivityNotAllowed"
      },
      {
        "language": "occ",
        "text": "HKErrorWorkoutActivityNotAllowed"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/errorworkoutactivitynotallowed"
  },
  {
    "case": "unknownError",
    "objc": "HKUnknownError",
    "kind": "Case",
    "group": "Enumeration Cases",
    "abstract": null,
    "discussion": null,
    "undocumented": true,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "declarations": [
      {
        "language": "swift",
        "text": "case unknownError"
      },
      {
        "language": "occ",
        "text": "HKUnknownError"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/unknownerror"
  },
  {
    "case": "noError",
    "objc": null,
    "kind": "Type Property",
    "group": "Type Properties",
    "abstract": null,
    "discussion": null,
    "undocumented": true,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": true,
        "deprecatedAt": "27.2",
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": true,
        "deprecatedAt": "27.2",
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.1",
        "deprecated": true,
        "deprecatedAt": "27.2",
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": true,
        "deprecatedAt": "27.2",
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": true,
        "deprecatedAt": "27.2",
        "beta": false
      }
    ],
    "deprecated": true,
    "deprecation": {
      "message": null,
      "renamedTo": "HKError.unknownError"
    },
    "declarations": [
      {
        "language": "swift",
        "text": "static var noError: HKError.Code { get }"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/code/noerror"
  }
];

export type HcErrorConstant = {
  /** Constant name on android.health.connect.HealthConnectException. */
  name: string;
  /** Value printed under "Constant Value:". */
  value: number | null;
  hex: string | null;
  /** Google's first description paragraph, verbatim. */
  description: string | null;
  /** Google's further paragraphs, joined; null when none. */
  detail: string | null;
  /** Derived: the class named in `similarToEvidence`. Null when unstated. */
  similarTo: string | null;
  /** Google's sentence `similarTo` was copied from. */
  similarToEvidence: string | null;
  /** From the block's data-version-added, cross-checked against the text. */
  apiLevel: number;
  /** The printed availability line, e.g. "Added in API level 34 Also in U Extensions 7". */
  apiLevelEvidence: string | null;
  /** The SDK extension line, e.g. "U Extensions 7"; null when none printed. */
  extension: string | null;
  deprecated: boolean;
  deprecationNote: string | null;
  docUrl: string;
};

/** The API level HealthConnectException itself was added in, as printed. */
export const HC_EXCEPTION_API_LEVEL: number | null = 34;

/** Every ERROR_* constant on HealthConnectException, by value. */
export const HC_ERROR_CONSTANTS: HcErrorConstant[] = [
  {
    "name": "ERROR_UNKNOWN",
    "value": 1,
    "hex": "0x00000001",
    "description": "An unknown error occurred while processing the call.",
    "detail": null,
    "similarTo": null,
    "similarToEvidence": null,
    "apiLevel": 34,
    "apiLevelEvidence": "Added in API level 34Also in U Extensions 7",
    "extension": "U Extensions 7",
    "deprecated": false,
    "deprecationNote": null,
    "docUrl": "https://developer.android.com/reference/android/health/connect/HealthConnectException#ERROR_UNKNOWN"
  },
  {
    "name": "ERROR_INTERNAL",
    "value": 2,
    "hex": "0x00000002",
    "description": "An internal error occurred which the caller cannot address.",
    "detail": "This error may be considered similar to IllegalStateException",
    "similarTo": "IllegalStateException",
    "similarToEvidence": "This error may be considered similar to IllegalStateException",
    "apiLevel": 34,
    "apiLevelEvidence": "Added in API level 34Also in U Extensions 7",
    "extension": "U Extensions 7",
    "deprecated": false,
    "deprecationNote": null,
    "docUrl": "https://developer.android.com/reference/android/health/connect/HealthConnectException#ERROR_INTERNAL"
  },
  {
    "name": "ERROR_INVALID_ARGUMENT",
    "value": 3,
    "hex": "0x00000003",
    "description": "The caller supplied invalid arguments to the call.",
    "detail": "This error may be considered similar to IllegalArgumentException.",
    "similarTo": "IllegalArgumentException",
    "similarToEvidence": "This error may be considered similar to IllegalArgumentException.",
    "apiLevel": 34,
    "apiLevelEvidence": "Added in API level 34Also in U Extensions 7",
    "extension": "U Extensions 7",
    "deprecated": false,
    "deprecationNote": null,
    "docUrl": "https://developer.android.com/reference/android/health/connect/HealthConnectException#ERROR_INVALID_ARGUMENT"
  },
  {
    "name": "ERROR_IO",
    "value": 4,
    "hex": "0x00000004",
    "description": "An issue occurred reading or writing to storage. The call might succeed if repeated.",
    "detail": "This error may be considered similar to IOException.",
    "similarTo": "IOException",
    "similarToEvidence": "This error may be considered similar to IOException.",
    "apiLevel": 34,
    "apiLevelEvidence": "Added in API level 34Also in U Extensions 7",
    "extension": "U Extensions 7",
    "deprecated": false,
    "deprecationNote": null,
    "docUrl": "https://developer.android.com/reference/android/health/connect/HealthConnectException#ERROR_IO"
  },
  {
    "name": "ERROR_SECURITY",
    "value": 5,
    "hex": "0x00000005",
    "description": "The caller doesn't have the correct permissions for this call.",
    "detail": "This error may be considered similar to SecurityException.",
    "similarTo": "SecurityException",
    "similarToEvidence": "This error may be considered similar to SecurityException.",
    "apiLevel": 34,
    "apiLevelEvidence": "Added in API level 34Also in U Extensions 7",
    "extension": "U Extensions 7",
    "deprecated": false,
    "deprecationNote": null,
    "docUrl": "https://developer.android.com/reference/android/health/connect/HealthConnectException#ERROR_SECURITY"
  },
  {
    "name": "ERROR_REMOTE",
    "value": 6,
    "hex": "0x00000006",
    "description": "An IPC related error occurred.",
    "detail": "This error may be considered similar to RemoteException.",
    "similarTo": "RemoteException",
    "similarToEvidence": "This error may be considered similar to RemoteException.",
    "apiLevel": 34,
    "apiLevelEvidence": "Added in API level 34Also in U Extensions 7",
    "extension": "U Extensions 7",
    "deprecated": false,
    "deprecationNote": null,
    "docUrl": "https://developer.android.com/reference/android/health/connect/HealthConnectException#ERROR_REMOTE"
  },
  {
    "name": "ERROR_RATE_LIMIT_EXCEEDED",
    "value": 7,
    "hex": "0x00000007",
    "description": "The caller exhausted the allotted rate limit.",
    "detail": null,
    "similarTo": null,
    "similarToEvidence": null,
    "apiLevel": 34,
    "apiLevelEvidence": "Added in API level 34Also in U Extensions 7",
    "extension": "U Extensions 7",
    "deprecated": false,
    "deprecationNote": null,
    "docUrl": "https://developer.android.com/reference/android/health/connect/HealthConnectException#ERROR_RATE_LIMIT_EXCEEDED"
  },
  {
    "name": "ERROR_DATA_SYNC_IN_PROGRESS",
    "value": 8,
    "hex": "0x00000008",
    "description": "Data sync is in progress. Data read and writes are blocked.",
    "detail": "Caller should try this api call again later.",
    "similarTo": null,
    "similarToEvidence": null,
    "apiLevel": 34,
    "apiLevelEvidence": "Added in API level 34Also in U Extensions 7",
    "extension": "U Extensions 7",
    "deprecated": false,
    "deprecationNote": null,
    "docUrl": "https://developer.android.com/reference/android/health/connect/HealthConnectException#ERROR_DATA_SYNC_IN_PROGRESS"
  },
  {
    "name": "ERROR_UNSUPPORTED_OPERATION",
    "value": 9,
    "hex": "0x00000009",
    "description": "This operation is currently not supported by the platform.",
    "detail": "Caller may try this api call again later.",
    "similarTo": null,
    "similarToEvidence": null,
    "apiLevel": 34,
    "apiLevelEvidence": "Added in API level 34Also in U Extensions 7",
    "extension": "U Extensions 7",
    "deprecated": false,
    "deprecationNote": null,
    "docUrl": "https://developer.android.com/reference/android/health/connect/HealthConnectException#ERROR_UNSUPPORTED_OPERATION"
  }
];

export type HcClientException = {
  /** Simple class name, e.g. "SecurityException". */
  exception: string;
  /** Every spelling the reference uses for it, e.g. "android.os.RemoteException". */
  writtenAs: string[];
  /** Each distinct wording Google uses, verbatim, with the methods it is on. */
  wordings: { text: string; methods: string[] }[];
  /** Distinct methods documenting this exception, across wordings. */
  methodCount: number;
};

/** Exceptions documented in HealthConnectClient's Throws tables. */
export const HC_CLIENT_EXCEPTIONS: HcClientException[] = [
  {
    "exception": "SecurityException",
    "writtenAs": [
      "SecurityException"
    ],
    "wordings": [
      {
        "text": "For requests with unpermitted access.",
        "methods": [
          "aggregate",
          "aggregateGroupByDuration",
          "aggregateGroupByPeriod",
          "deleteRecords",
          "getChanges",
          "getChangesToken",
          "insertRecords",
          "readRecord",
          "readRecords",
          "updateRecords",
          "HealthConnectClient.deleteRecords",
          "HealthConnectClient.readRecord"
        ]
      },
      {
        "text": "if caller does not hold PERMISSION_WRITE_MEDICAL_DATA.",
        "methods": [
          "createMedicalDataSource",
          "deleteMedicalResources",
          "upsertMedicalResources"
        ]
      }
    ],
    "methodCount": 15
  },
  {
    "exception": "RemoteException",
    "writtenAs": [
      "android.os.RemoteException",
      "RemoteException"
    ],
    "wordings": [
      {
        "text": "For any IPC transportation failures.",
        "methods": [
          "aggregate",
          "aggregateGroupByDuration",
          "aggregateGroupByPeriod",
          "deleteRecords",
          "getChanges",
          "getChangesToken",
          "insertRecords",
          "readRecords",
          "HealthConnectClient.deleteRecords"
        ]
      },
      {
        "text": "For any IPC transportation failures. Deleting by invalid identifiers such as a non-existing identifier or deleting the same record multiple times will result in IPC failure.",
        "methods": [
          "deleteRecords",
          "HealthConnectClient.deleteRecords"
        ]
      },
      {
        "text": "For any IPC transportation failures. Update with invalid identifiers will result in IPC failure.",
        "methods": [
          "readRecord",
          "updateRecords",
          "HealthConnectClient.readRecord"
        ]
      }
    ],
    "methodCount": 12
  },
  {
    "exception": "IOException",
    "writtenAs": [
      "java.io.IOException",
      "IOException"
    ],
    "wordings": [
      {
        "text": "For any disk I/O issues.",
        "methods": [
          "aggregate",
          "aggregateGroupByDuration",
          "aggregateGroupByPeriod",
          "deleteRecords",
          "insertRecords",
          "readRecord",
          "readRecords",
          "updateRecords",
          "HealthConnectClient.deleteRecords",
          "HealthConnectClient.readRecord"
        ]
      }
    ],
    "methodCount": 10
  },
  {
    "exception": "IllegalArgumentException",
    "writtenAs": [
      "IllegalArgumentException"
    ],
    "wordings": [
      {
        "text": "if id is invalid, does not exist, or owned by another app.",
        "methods": [
          "deleteMedicalDataSourceWithData"
        ]
      },
      {
        "text": "if the size of ids is too large or any ID is deemed as invalid.",
        "methods": [
          "readMedicalResources"
        ]
      },
      {
        "text": "if any request is failed to be processed for any reason such as invalid UpsertMedicalResourceRequest.dataSourceId",
        "methods": [
          "upsertMedicalResources"
        ]
      }
    ],
    "methodCount": 3
  },
  {
    "exception": "IllegalStateException",
    "writtenAs": [
      "IllegalStateException"
    ],
    "wordings": [
      {
        "text": "if the SDK is not available",
        "methods": [
          "getOrCreate"
        ]
      },
      {
        "text": "If service is not available.",
        "methods": [
          "HealthConnectClient.deleteRecords",
          "HealthConnectClient.readRecord"
        ]
      }
    ],
    "methodCount": 3
  },
  {
    "exception": "UnsupportedOperationException",
    "writtenAs": [
      "UnsupportedOperationException"
    ],
    "wordings": [
      {
        "text": "if service not available due to SDK version too low or running in a profile",
        "methods": [
          "getOrCreate"
        ]
      },
      {
        "text": "if the feature is not available.",
        "methods": [
          "checkIfMatchmakingIsPossible",
          "createMatchmakingIntent"
        ]
      }
    ],
    "methodCount": 3
  }
];
