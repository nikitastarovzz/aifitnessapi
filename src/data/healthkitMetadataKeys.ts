/**
 * HealthKit metadata keys (HKMetadataKey… constants), read from Apple's own
 * documentation JSON.
 *
 * GENERATED — do not hand-edit; regenerate with node scripts/fetch-healthkit-metadata-keys.mjs
 *
 * Source: https://developer.apple.com/documentation/healthkit/metadata-keys (and its Workout Metadata Keys sub-collection, and each
 * key's own page)
 * Fetched: 2026-10-04
 *
 * The one derived field is `valueType`, copied from Apple's sentence that
 * names what the key's value is; that sentence is stored beside it in
 * `valueTypeEvidence`. Both are null where Apple does not say.
 */

/** The date the generator last read the sources (the index's fetch date). */
export const HK_METADATA_KEYS_FETCHED_ON = "2026-10-04";

/** The page this file was read from. */
export const HK_METADATA_KEYS_SOURCE = "https://developer.apple.com/documentation/healthkit/metadata-keys";

/** Apple's abstract for the Metadata Keys collection, verbatim. */
export const HK_METADATA_KEYS_ABSTRACT = "Constants used to add metadata to objects stored in HealthKit.";

/** Apple's topic groups, in Apple's order. */
export const HK_METADATA_KEY_GROUPS: string[] = [
  "General Keys",
  "Estimate Keys",
  "Device Information Keys",
  "Sync Keys",
  "Lab Keys",
  "Weather Keys",
  "Workout Keys",
  "Cardio Fitness Keys",
  "Motion Keys",
  "Nutrition Keys",
  "Vitals Sensors Keys",
  "Audio Event Keys",
  "Blood Glucose Keys",
  "Reproductive Health Keys",
  "Algorithm Keys"
];

export type HkMetadataKeyPlatform = {
  name: string;
  introducedAt: string | null;
  deprecated: boolean;
  /** The evidence for `deprecated`; null where Apple gives none. */
  deprecatedAt: string | null;
  beta: boolean;
};

export type HkMetadataKey = {
  /** The Swift name, e.g. "HKMetadataKeyExternalUUID". */
  swiftName: string;
  /** The Objective-C name from Apple's occ variant. */
  objcName: string | null;
  /** Apple's topic group on the Metadata Keys page. */
  group: string;
  /** The section inside a sub-collection (Workout Keys only); else null. */
  subgroup: string | null;
  /** Other groups Apple also files the key under. */
  alsoIn: string[];
  /** Apple's role heading ("Global Variable"). */
  roleHeading: string | null;
  /** Apple's abstract, verbatim; null when Apple publishes none. */
  abstract: string | null;
  /** Apple's discussion, symbol links resolved to names; null when none. */
  discussion: string | null;
  /** Derived: the value type `valueTypeEvidence` names. Null when unstated. */
  valueType: string | null;
  /** Apple's sentence `valueType` was read from, verbatim. */
  valueTypeEvidence: string | null;
  platforms: HkMetadataKeyPlatform[];
  deprecated: boolean;
  deprecation: { message: string | null } | null;
  /** Declarations as Apple prints them ("swift", "occ"). */
  declarations: { language: string; text: string }[];
  docUrl: string;
};

/** Every HKMetadataKey constant, in Apple's topic order. */
export const HK_METADATA_KEYS: HkMetadataKey[] = [
  {
    "swiftName": "HKMetadataKeyExternalUUID",
    "objcName": "HKMetadataKeyExternalUUID",
    "group": "General Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A unique identifier for an HKObject that is set by its source.",
    "discussion": "This key takes a string value. This value is independent of the UUID assigned to the object by the HealthKit store. You can assign your own UUID to any HealthKit objects you create. Use these IDs to uniquely identify objects in your application. You typically use the UUID from the corresponding data entry on your server. This lets you create multiple copies of that data across multiple devices. Each copy shares the same external UUID.",
    "valueType": "NSString",
    "valueTypeEvidence": "This key takes a string value.",
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
        "text": "let HKMetadataKeyExternalUUID: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyExternalUUID;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyexternaluuid"
  },
  {
    "swiftName": "HKMetadataKeyTimeZone",
    "objcName": "HKMetadataKeyTimeZone",
    "group": "General Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The user’s time zone when the HealthKit object was created.",
    "discussion": "This key takes a string value compatible with the NSTimeZone class’s timeZoneWithName: method. For best results when analyzing sleep samples, it’s recommended that you store time zone metadata with your sleep sample data.",
    "valueType": "NSString",
    "valueTypeEvidence": "This key takes a string value compatible with the NSTimeZone class’s timeZoneWithName: method.",
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
        "text": "let HKMetadataKeyTimeZone: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyTimeZone;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeytimezone"
  },
  {
    "swiftName": "HKMetadataKeyWasUserEntered",
    "objcName": "HKMetadataKeyWasUserEntered",
    "group": "General Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates whether the sample was entered by the user.",
    "discussion": "Set this key’s value to true if the sample was entered by the user; otherwise, set it to false.",
    "valueType": "Boolean",
    "valueTypeEvidence": "Set this key’s value to true if the sample was entered by the user; otherwise, set it to false.",
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
        "text": "let HKMetadataKeyWasUserEntered: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyWasUserEntered;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeywasuserentered"
  },
  {
    "swiftName": "HKMetadataKeyQuantityClampedToLowerBound",
    "objcName": "HKMetadataKeyQuantityClampedToLowerBound",
    "group": "General Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
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
        "introducedAt": "9.0",
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
        "text": "let HKMetadataKeyQuantityClampedToLowerBound: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyQuantityClampedToLowerBound;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyquantityclampedtolowerbound"
  },
  {
    "swiftName": "HKMetadataKeyQuantityClampedToUpperBound",
    "objcName": "HKMetadataKeyQuantityClampedToUpperBound",
    "group": "General Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
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
        "introducedAt": "9.0",
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
        "text": "let HKMetadataKeyQuantityClampedToUpperBound: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyQuantityClampedToUpperBound;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyquantityclampedtoupperbound"
  },
  {
    "swiftName": "HKMetadataKeyDateOfEarliestDataUsedForEstimate",
    "objcName": "HKMetadataKeyDateOfEarliestDataUsedForEstimate",
    "group": "Estimate Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The earliest date of data used to calculate the sample’s estimated value.",
    "discussion": "This key takes a Date value, indicating the earliest date from the data used by HealthKit to calculate the sample’s value.",
    "valueType": "NSDate",
    "valueTypeEvidence": "This key takes a Date value, indicating the earliest date from the data used by HealthKit to calculate the sample’s value.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "15.0",
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
        "introducedAt": "8.0",
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
        "text": "let HKMetadataKeyDateOfEarliestDataUsedForEstimate: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyDateOfEarliestDataUsedForEstimate;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeydateofearliestdatausedforestimate"
  },
  {
    "swiftName": "HKMetadataKeySessionEstimate",
    "objcName": "HKMetadataKeySessionEstimate",
    "group": "Estimate Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
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
        "introducedAt": "9.0",
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
        "text": "let HKMetadataKeySessionEstimate: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeySessionEstimate;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeysessionestimate"
  },
  {
    "swiftName": "HKMetadataKeyDeviceSerialNumber",
    "objcName": "HKMetadataKeyDeviceSerialNumber",
    "group": "Device Information Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The key for the serial number of the device that generated the data.",
    "discussion": "This key takes a string value.",
    "valueType": "NSString",
    "valueTypeEvidence": "This key takes a string value.",
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
        "text": "let HKMetadataKeyDeviceSerialNumber: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyDeviceSerialNumber;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeydeviceserialnumber"
  },
  {
    "swiftName": "HKMetadataKeyUDIDeviceIdentifier",
    "objcName": "HKMetadataKeyUDIDeviceIdentifier",
    "group": "Device Information Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The device identifier portion of a device’s UDI (unique device identifier).",
    "discussion": "The device identifier can be used to reference the GUDID (Globally Unique Device Identification Database). This key takes a string value. Note: In iOS 9.0 and later, the use of this key is discouraged. Use the HKDevice class instead.",
    "valueType": "NSString",
    "valueTypeEvidence": "This key takes a string value.",
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
        "text": "let HKMetadataKeyUDIDeviceIdentifier: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyUDIDeviceIdentifier;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyudideviceidentifier"
  },
  {
    "swiftName": "HKMetadataKeyUDIProductionIdentifier",
    "objcName": "HKMetadataKeyUDIProductionIdentifier",
    "group": "Device Information Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The production identifier portion of a device’s UDI (unique device identifier).",
    "discussion": "Although the production identifier is part of a device’s UDI, it is not saved in the FDA’s GUDID (Globally Unique Device Identifier Database), and its use in HealthKit is now discouraged to protect user privacy. Apps that need this information should store it outside the HealthKit store.",
    "valueType": null,
    "valueTypeEvidence": null,
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
        "text": "let HKMetadataKeyUDIProductionIdentifier: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyUDIProductionIdentifier;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyudiproductionidentifier"
  },
  {
    "swiftName": "HKMetadataKeyDigitalSignature",
    "objcName": "HKMetadataKeyDigitalSignature",
    "group": "Device Information Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A digital signature that can be used to validate the origin of the HealthKit object.",
    "discussion": "The digital signature is intended to provide data integrity for sample data produced by trusted (tamper resistant) measuring devices. Use the Cryptographic Message Syntax (CMS) to sign data returned by your device (such as timestamps, values, and so forth) using ASN.1 encoding with Distinguished Encoding Rules (DER). The entire signature should be further encoded using base64. Recommended digest is SHA256, and recommended cipher is FIPS PUB 186-4 Digital Signature Standard Elliptic Curve P-256. CMS is specified in IETF RFC 5652. For more information, see Adding Digital Signatures in HealthKit.",
    "valueType": null,
    "valueTypeEvidence": null,
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
        "text": "let HKMetadataKeyDigitalSignature: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyDigitalSignature;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeydigitalsignature"
  },
  {
    "swiftName": "HKMetadataKeyDeviceName",
    "objcName": "HKMetadataKeyDeviceName",
    "group": "Device Information Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The name of the device that took this reading.",
    "discussion": "This key takes a string value. Note: In iOS 9.0 and later, the use of this key is discouraged. Use the HKDevice class instead.",
    "valueType": "NSString",
    "valueTypeEvidence": "This key takes a string value.",
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
        "text": "let HKMetadataKeyDeviceName: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyDeviceName;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeydevicename"
  },
  {
    "swiftName": "HKMetadataKeyDeviceManufacturerName",
    "objcName": "HKMetadataKeyDeviceManufacturerName",
    "group": "Device Information Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The name of the manufacturer of the device that took this reading.",
    "discussion": "This key takes a string value. Note: In iOS 9.0 and later, the use of this key is discouraged. Use the HKDevice class instead.",
    "valueType": "NSString",
    "valueTypeEvidence": "This key takes a string value.",
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
        "text": "let HKMetadataKeyDeviceManufacturerName: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyDeviceManufacturerName;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeydevicemanufacturername"
  },
  {
    "swiftName": "HKMetadataKeyDevicePlacementSide",
    "objcName": "HKMetadataKeyDevicePlacementSide",
    "group": "Device Information Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The key for metadata indicating the placement of the device that measured a sample.",
    "discussion": "This key takes an NSNumber that contains a value from HKDevicePlacementSide. For mobility samples, like walkingSpeed or walkingDoubleSupportPercentage, this metadata key records the placement of the device as determined by the system.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "This key takes an NSNumber that contains a value from HKDevicePlacementSide.",
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
        "text": "let HKMetadataKeyDevicePlacementSide: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyDevicePlacementSide;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeydeviceplacementside"
  },
  {
    "swiftName": "HKMetadataKeyAppleDeviceCalibrated",
    "objcName": "HKMetadataKeyAppleDeviceCalibrated",
    "group": "Device Information Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The key for metadata indicating whether the system had data from a sufficient amount of calibrated sensors when recording the sample.",
    "discussion": "This key takes a Boolean value. If it’s true, the system has enough high-quality data to make an accurate estimate. If it’s false, the system provides an estimate based on data that may be less accurate. The key is read-only.",
    "valueType": "Boolean",
    "valueTypeEvidence": "This key takes a Boolean value.",
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
        "text": "let HKMetadataKeyAppleDeviceCalibrated: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyAppleDeviceCalibrated;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyappledevicecalibrated"
  },
  {
    "swiftName": "HKMetadataKeySyncIdentifier",
    "objcName": "HKMetadataKeySyncIdentifier",
    "group": "Sync Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A unique string that identifies a piece of data so it can be updated and synced.",
    "discussion": "This key takes a string value. If you add this key to an object’s metadata, you must also add the HKMetadataKeySyncVersion key. When you save an HKObject with a sync identifier, the system looks for any existing objects with the same sync identifier. If it finds a match, the system compares the objects’ HKMetadataKeySyncVersion values. If the new object has a greater sync version, the system replaces the old object with the new one. If the old object is associated with a workout or part of a correlation, the system also replaces the old object in the workout or correlation.",
    "valueType": "NSString",
    "valueTypeEvidence": "This key takes a string value.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
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
        "introducedAt": "4.0",
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
        "text": "let HKMetadataKeySyncIdentifier: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeySyncIdentifier;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeysyncidentifier"
  },
  {
    "swiftName": "HKMetadataKeySyncVersion",
    "objcName": "HKMetadataKeySyncVersion",
    "group": "Sync Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The version number for a piece of data, used when updating or syncing.",
    "discussion": "This key takes an NSNumber as its value. When you save an object to the HealthKit store, the new object replaces any matching objects (existing objects with a matching HKMetadataKeySyncIdentifier value) with a lower sync version. For more information, see HKMetadataKeySyncIdentifier.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "This key takes an NSNumber as its value.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
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
        "introducedAt": "4.0",
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
        "text": "let HKMetadataKeySyncVersion: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeySyncVersion;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeysyncversion"
  },
  {
    "swiftName": "HKMetadataKeyWasTakenInLab",
    "objcName": "HKMetadataKeyWasTakenInLab",
    "group": "Lab Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates whether the sample was taken in a lab.",
    "discussion": "Set this key’s value to true if the sample was taken by a lab; otherwise, set it to false.",
    "valueType": "Boolean",
    "valueTypeEvidence": "Set this key’s value to true if the sample was taken by a lab; otherwise, set it to false.",
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
        "text": "let HKMetadataKeyWasTakenInLab: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyWasTakenInLab;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeywastakeninlab"
  },
  {
    "swiftName": "HKMetadataKeyReferenceRangeLowerLimit",
    "objcName": "HKMetadataKeyReferenceRangeLowerLimit",
    "group": "Lab Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the lower limit of the reference range for a lab result.",
    "discussion": "This key takes an NSNumber value.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "This key takes an NSNumber value.",
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
        "text": "let HKMetadataKeyReferenceRangeLowerLimit: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyReferenceRangeLowerLimit;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyreferencerangelowerlimit"
  },
  {
    "swiftName": "HKMetadataKeyReferenceRangeUpperLimit",
    "objcName": "HKMetadataKeyReferenceRangeUpperLimit",
    "group": "Lab Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the upper limit of the reference range for a lab result.",
    "discussion": "This key takes an NSNumber value.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "This key takes an NSNumber value.",
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
        "text": "let HKMetadataKeyReferenceRangeUpperLimit: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyReferenceRangeUpperLimit;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyreferencerangeupperlimit"
  },
  {
    "swiftName": "HKMetadataKeyBarometricPressure",
    "objcName": "HKMetadataKeyBarometricPressure",
    "group": "Weather Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The metadata key for the barometric pressure associated with a sample.",
    "discussion": "This key takes an HKQuantity value that measures the barometric pressure in units of pressure, such as atmosphere(), pascal(), or millimeterOfMercury().",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "This key takes an HKQuantity value that measures the barometric pressure in units of pressure, such as atmosphere(), pascal(), or millimeterOfMercury().",
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
        "text": "let HKMetadataKeyBarometricPressure: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyBarometricPressure;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeybarometricpressure"
  },
  {
    "swiftName": "HKMetadataKeyWeatherCondition",
    "objcName": "HKMetadataKeyWeatherCondition",
    "group": "Weather Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that represents the weather condition during the sample.",
    "discussion": "This key takes an an NSNumber value that contains an HKWeatherCondition value. Set this key on an HKWorkout object to represent the overall weather condition during the workout.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "This key takes an an NSNumber value that contains an HKWeatherCondition value.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
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
        "introducedAt": "3.0",
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
        "text": "let HKMetadataKeyWeatherCondition: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyWeatherCondition;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyweathercondition"
  },
  {
    "swiftName": "HKMetadataKeyWeatherHumidity",
    "objcName": "HKMetadataKeyWeatherHumidity",
    "group": "Weather Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that represents the weather humidity during the sample.",
    "discussion": "This key takes an HKQuantity value expressed as a percentage. Set this key on an HKWorkout object to represent the overall humidity during the workout.",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "This key takes an HKQuantity value expressed as a percentage.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
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
        "introducedAt": "3.0",
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
        "text": "let HKMetadataKeyWeatherHumidity: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyWeatherHumidity;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyweatherhumidity"
  },
  {
    "swiftName": "HKMetadataKeyWeatherTemperature",
    "objcName": "HKMetadataKeyWeatherTemperature",
    "group": "Weather Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that represents the weather temperature during the sample.",
    "discussion": "This key takes an HKQuantity value expressed in a unit of temperature. Set this key on an HKWorkout object to represent the overall temperature during the workout.",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "This key takes an HKQuantity value expressed in a unit of temperature.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
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
        "introducedAt": "3.0",
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
        "text": "let HKMetadataKeyWeatherTemperature: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyWeatherTemperature;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyweathertemperature"
  },
  {
    "swiftName": "HKMetadataKeyActivityType",
    "objcName": "HKMetadataKeyActivityType",
    "group": "Workout Keys",
    "subgroup": "Workout Type",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
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
        "text": "let HKMetadataKeyActivityType: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyActivityType;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyactivitytype"
  },
  {
    "swiftName": "HKMetadataKeyAppleFitnessPlusSession",
    "objcName": "HKMetadataKeyAppleFitnessPlusSession",
    "group": "Workout Keys",
    "subgroup": "Workout Type",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
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
        "text": "let HKMetadataKeyAppleFitnessPlusSession: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyAppleFitnessPlusSession;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyapplefitnessplussession"
  },
  {
    "swiftName": "HKMetadataKeyCoachedWorkout",
    "objcName": "HKMetadataKeyCoachedWorkout",
    "group": "Workout Keys",
    "subgroup": "Workout Type",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates whether the workout was performed with a coach or personal trainer.",
    "discussion": "Set this key’s value to true if the workout was performed with a coach or personal trainer; otherwise, set it to false.",
    "valueType": "Boolean",
    "valueTypeEvidence": "Set this key’s value to true if the workout was performed with a coach or personal trainer; otherwise, set it to false.",
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
        "text": "let HKMetadataKeyCoachedWorkout: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyCoachedWorkout;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeycoachedworkout"
  },
  {
    "swiftName": "HKMetadataKeyGroupFitness",
    "objcName": "HKMetadataKeyGroupFitness",
    "group": "Workout Keys",
    "subgroup": "Workout Type",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates whether the workout was performed as part of a group fitness class.",
    "discussion": "Set this key’s value to true if the workout was part of a group fitness class; otherwise, set it tofalse.",
    "valueType": "Boolean",
    "valueTypeEvidence": "Set this key’s value to true if the workout was part of a group fitness class; otherwise, set it tofalse.",
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
        "text": "let HKMetadataKeyGroupFitness: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyGroupFitness;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeygroupfitness"
  },
  {
    "swiftName": "HKMetadataKeyIndoorWorkout",
    "objcName": "HKMetadataKeyIndoorWorkout",
    "group": "Workout Keys",
    "subgroup": "Workout Type",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates whether the workout was performed indoors.",
    "discussion": "Set this key’s value to true if the workout was performed indoors; otherwise, set it to false.",
    "valueType": "Boolean",
    "valueTypeEvidence": "Set this key’s value to true if the workout was performed indoors; otherwise, set it to false.",
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
        "text": "let HKMetadataKeyIndoorWorkout: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyIndoorWorkout;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyindoorworkout"
  },
  {
    "swiftName": "HKMetadataKeyWorkoutBrandName",
    "objcName": "HKMetadataKeyWorkoutBrandName",
    "group": "Workout Keys",
    "subgroup": "Workout Type",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The brand name of a particular workout.",
    "discussion": "This key takes a string value.",
    "valueType": "NSString",
    "valueTypeEvidence": "This key takes a string value.",
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
        "text": "let HKMetadataKeyWorkoutBrandName: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyWorkoutBrandName;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyworkoutbrandname"
  },
  {
    "swiftName": "HKMetadataKeyCyclingFunctionalThresholdPowerTestType",
    "objcName": "HKMetadataKeyCyclingFunctionalThresholdPowerTestType",
    "group": "Workout Keys",
    "subgroup": "Cycling",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
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
        "text": "let HKMetadataKeyCyclingFunctionalThresholdPowerTestType: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyCyclingFunctionalThresholdPowerTestType;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeycyclingfunctionalthresholdpowertesttype"
  },
  {
    "swiftName": "HKMetadataKeyFitnessMachineDuration",
    "objcName": "HKMetadataKeyFitnessMachineDuration",
    "group": "Workout Keys",
    "subgroup": "GymKit Fitness Equipment",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The workout duration displayed by a connected GymKit fitness machine.",
    "discussion": "Set this key on a workout sample representing exercise on a GymKit fitness machine. Set its value to an HKQuantity object with a time unit.",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "Set its value to an HKQuantity object with a time unit.",
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
        "text": "let HKMetadataKeyFitnessMachineDuration: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyFitnessMachineDuration;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyfitnessmachineduration"
  },
  {
    "swiftName": "HKMetadataKeyCrossTrainerDistance",
    "objcName": "HKMetadataKeyCrossTrainerDistance",
    "group": "Workout Keys",
    "subgroup": "GymKit Fitness Equipment",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The workout distance displayed by a connected GymKit cross-trainer machine.",
    "discussion": "Set this key on a workout sample representing exercise on a GymKit cross-trainer machine (such as an elliptical cross-trainer). Set its value to an HKQuantity object with a length unit.",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "Set its value to an HKQuantity object with a length unit.",
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
        "text": "let HKMetadataKeyCrossTrainerDistance: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyCrossTrainerDistance;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeycrosstrainerdistance"
  },
  {
    "swiftName": "HKMetadataKeyIndoorBikeDistance",
    "objcName": "HKMetadataKeyIndoorBikeDistance",
    "group": "Workout Keys",
    "subgroup": "GymKit Fitness Equipment",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The workout distance displayed by a connected GymKit exercise bike.",
    "discussion": "Set this key on a workout sample representing exercise on a GymKit exercise bike. Set its value to an HKQuantity object with a length unit.",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "Set its value to an HKQuantity object with a length unit.",
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
        "text": "let HKMetadataKeyIndoorBikeDistance: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyIndoorBikeDistance;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyindoorbikedistance"
  },
  {
    "swiftName": "HKMetadataKeyAverageMETs",
    "objcName": "HKMetadataKeyAverageMETs",
    "group": "Workout Keys",
    "subgroup": "Intensity",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the average Metabolic Equivalent of Task (METs) during a workout.",
    "discussion": "Set this key on a workout. Set its value to an HKQuantity object with a METs unit (for example, kcal/(kg*hr)). For more information on creating complex units, see HKUnit. The value represents the average intensity over the entire workout’s duration.",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "Set its value to an HKQuantity object with a METs unit (for example, kcal/(kg*hr)).",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
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
        "introducedAt": "6.0",
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
        "text": "let HKMetadataKeyAverageMETs: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyAverageMETs;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyaveragemets"
  },
  {
    "swiftName": "HKMetadataKeyPhysicalEffortEstimationType",
    "objcName": "HKMetadataKeyPhysicalEffortEstimationType",
    "group": "Workout Keys",
    "subgroup": "Intensity",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
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
        "text": "let HKMetadataKeyPhysicalEffortEstimationType: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyPhysicalEffortEstimationType;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyphysicaleffortestimationtype"
  },
  {
    "swiftName": "HKMetadataKeyAlpineSlopeGrade",
    "objcName": "HKMetadataKeyAlpineSlopeGrade",
    "group": "Workout Keys",
    "subgroup": "Skiing and Snowboarding",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the percent slope of a ski run.",
    "discussion": "Set this key on quantity samples that represent distance, or on workout segments. Set its value to an HKQuantity object with a percent unit, where 100% indicates a 45 degree slope. HealthKit assigns this metadata key to the segments it automatically creates for HKWorkoutActivityType.downhillSkiing and HKWorkoutActivityType.snowboarding workout sessions (Apple Watch Series 3 only).",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "Set its value to an HKQuantity object with a percent unit, where 100% indicates a 45 degree slope.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.2",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.2",
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
        "introducedAt": "4.2",
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
        "text": "let HKMetadataKeyAlpineSlopeGrade: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyAlpineSlopeGrade;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyalpineslopegrade"
  },
  {
    "swiftName": "HKMetadataKeyElevationAscended",
    "objcName": "HKMetadataKeyElevationAscended",
    "group": "Workout Keys",
    "subgroup": "Skiing and Snowboarding",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the cumulative elevation ascended during a workout.",
    "discussion": "Set this key on a workout, workout segment, or a quantity sample that represents distance. Set its value to an HKQuantity object with a length unit. HealthKit assigns this metadata key to the segments it automatically creates for HKWorkoutActivityType.downhillSkiing and HKWorkoutActivityType.snowboarding workout sessions (Apple Watch Series 3 only).",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "Set its value to an HKQuantity object with a length unit.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.2",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.2",
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
        "introducedAt": "4.2",
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
        "text": "let HKMetadataKeyElevationAscended: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyElevationAscended;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyelevationascended"
  },
  {
    "swiftName": "HKMetadataKeyElevationDescended",
    "objcName": "HKMetadataKeyElevationDescended",
    "group": "Workout Keys",
    "subgroup": "Skiing and Snowboarding",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the cumulative elevation descended during a workout.",
    "discussion": "Set this key on a workout, workout segment, or a quantity sample that represents distance. Set its value to an HKQuantity object with a length unit. HealthKit assigns this metadata key to the segments it automatically creates for HKWorkoutActivityType.downhillSkiing and HKWorkoutActivityType.snowboarding workout sessions (Apple Watch Series 3 only).",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "Set its value to an HKQuantity object with a length unit.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.2",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.2",
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
        "introducedAt": "4.2",
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
        "text": "let HKMetadataKeyElevationDescended: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyElevationDescended;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyelevationdescended"
  },
  {
    "swiftName": "HKMetadataKeyAverageSpeed",
    "objcName": "HKMetadataKeyAverageSpeed",
    "group": "Workout Keys",
    "subgroup": "Speed",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the average speed during a workout.",
    "discussion": "Set this key on a workout, workout segment, or a quantity sample that represents distance. Set its value to an HKQuantity object with a length/time unit (for example, m/s). For more information on creating complex units, see Performing unit math. HealthKit assigns this metadata key to the segments it automatically creates for HKWorkoutActivityType.downhillSkiing and HKWorkoutActivityType.snowboarding workout sessions (Apple Watch Series 3 only). Note: This value represents the average speed while moving. It may not be the same as the value you get when dividing a distance sample’s distance by its duration.",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "Set its value to an HKQuantity object with a length/time unit (for example, m/s).",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.2",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.2",
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
        "introducedAt": "4.2",
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
        "text": "let HKMetadataKeyAverageSpeed: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyAverageSpeed;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyaveragespeed"
  },
  {
    "swiftName": "HKMetadataKeyMaximumSpeed",
    "objcName": "HKMetadataKeyMaximumSpeed",
    "group": "Workout Keys",
    "subgroup": "Speed",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the maximum speed during a workout.",
    "discussion": "Set this key on a workout, workout segment, or a quantity sample that represents distance. Set its value to an HKQuantity object with a length/time unit (for example, m/s). For more information on creating complex units, see Performing unit math. HealthKit assigns this metadata key to the segments it automatically creates for HKWorkoutActivityType.downhillSkiing and HKWorkoutActivityType.snowboarding workout sessions (Apple Watch Series 3 only).",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "Set its value to an HKQuantity object with a length/time unit (for example, m/s).",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.2",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.2",
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
        "introducedAt": "4.2",
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
        "text": "let HKMetadataKeyMaximumSpeed: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyMaximumSpeed;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeymaximumspeed"
  },
  {
    "swiftName": "HKMetadataKeySwimmingLocationType",
    "objcName": "HKMetadataKeySwimmingLocationType",
    "group": "Workout Keys",
    "subgroup": "Swimming",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the location for a swimming workout.",
    "discussion": "Set this key on a workout object that represents swimming. Set its value to an NSNumber object that contains a valid value from the HKWorkoutSwimmingLocationType enumeration.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "Set its value to an NSNumber object that contains a valid value from the HKWorkoutSwimmingLocationType enumeration.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
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
        "introducedAt": "3.0",
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
        "text": "let HKMetadataKeySwimmingLocationType: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeySwimmingLocationType;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyswimminglocationtype"
  },
  {
    "swiftName": "HKMetadataKeySwimmingStrokeStyle",
    "objcName": "HKMetadataKeySwimmingStrokeStyle",
    "group": "Workout Keys",
    "subgroup": "Swimming",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the predominant stroke style for a lap of swimming.",
    "discussion": "Set this key on workout lap events. Set its value to an NSNumber object that contains a valid value from the HKSwimmingStrokeStyle enumeration.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "Set its value to an NSNumber object that contains a valid value from the HKSwimmingStrokeStyle enumeration.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
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
        "introducedAt": "3.0",
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
        "text": "let HKMetadataKeySwimmingStrokeStyle: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeySwimmingStrokeStyle;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyswimmingstrokestyle"
  },
  {
    "swiftName": "HKMetadataKeyLapLength",
    "objcName": "HKMetadataKeyLapLength",
    "group": "Workout Keys",
    "subgroup": "Swimming",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the length of a lap during a workout.",
    "discussion": "Set this key on a workout, workout segment, or a quantity sample that represents distance. Set its value to an HKQuantity object that uses length units (described in HKUnit).",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "Set its value to an HKQuantity object that uses length units (described in HKUnit).",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
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
        "introducedAt": "3.0",
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
        "text": "let HKMetadataKeyLapLength: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyLapLength;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeylaplength"
  },
  {
    "swiftName": "HKMetadataKeySWOLFScore",
    "objcName": "HKMetadataKeySWOLFScore",
    "group": "Workout Keys",
    "subgroup": "Swimming",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
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
        "introducedAt": "9.0",
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
        "text": "let HKMetadataKeySWOLFScore: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeySWOLFScore;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyswolfscore"
  },
  {
    "swiftName": "HKMetadataKeyWaterSalinity",
    "objcName": "HKMetadataKeyWaterSalinity",
    "group": "Workout Keys",
    "subgroup": "Swimming",
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
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
        "text": "let HKMetadataKeyWaterSalinity: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyWaterSalinity;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeywatersalinity"
  },
  {
    "swiftName": "HKMetadataKeyVO2MaxValue",
    "objcName": "HKMetadataKeyVO2MaxValue",
    "group": "Cardio Fitness Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The maximum oxygen consumption rate during exercise of increasing intensity.",
    "discussion": "The system sets this key on lowCardioFitnessEvent samples. It contains the value of the VO2 max measurement that triggered the event. The value of this key is an HKQuantity object with a unit of ml/kg/min. For more information on working with complex units, see unitMultiplied(by:), unitDivided(by:), and init(from:).",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "The value of this key is an HKQuantity object with a unit of ml/kg/min.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.3",
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
        "introducedAt": "7.2",
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
        "text": "let HKMetadataKeyVO2MaxValue: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyVO2MaxValue;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyvo2maxvalue"
  },
  {
    "swiftName": "HKMetadataKeyLowCardioFitnessEventThreshold",
    "objcName": "HKMetadataKeyLowCardioFitnessEventThreshold",
    "group": "Cardio Fitness Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The VO2 max threshold used to categorize low-level cardio fitness events.",
    "discussion": "The system sets this key on lowCardioFitnessEvent samples. It contains the threshold value for the user’s VO2 max measurements. The threshold value varies depending on certain parameters and physical characteristics, such as the user’s age. A low-cardio fitness event indicates a period of time when the user’s VO2 max measurements consistently fall below the defined value. The system triggers this event approximately once every four months. The value of this key is an HKQuantity object with a unit of ml/kg/min. For more information on working with complex units, see unitMultiplied(by:), unitDivided(by:), and init(from:).",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "The value of this key is an HKQuantity object with a unit of ml/kg/min.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.3",
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
        "introducedAt": "7.2",
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
        "text": "let HKMetadataKeyLowCardioFitnessEventThreshold: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyLowCardioFitnessEventThreshold;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeylowcardiofitnesseventthreshold"
  },
  {
    "swiftName": "HKMetadataKeyUserMotionContext",
    "objcName": "HKMetadataKeyUserMotionContext",
    "group": "Motion Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The person’s motion during the sample’s time period.",
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
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
        "introducedAt": "9.0",
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
        "text": "let HKMetadataKeyUserMotionContext: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyUserMotionContext;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyusermotioncontext"
  },
  {
    "swiftName": "HKMetadataKeyFoodType",
    "objcName": "HKMetadataKeyFoodType",
    "group": "Nutrition Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The type of food that the HealthKit object represents.",
    "discussion": "This key takes a string value. Food objects are usually food samples containing any number of Nutrition Identifiers samples.",
    "valueType": "NSString",
    "valueTypeEvidence": "This key takes a string value.",
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
        "text": "let HKMetadataKeyFoodType: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyFoodType;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyfoodtype"
  },
  {
    "swiftName": "HKMetadataKeyBodyTemperatureSensorLocation",
    "objcName": "HKMetadataKeyBodyTemperatureSensorLocation",
    "group": "Vitals Sensors Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The location where a specific body temperature reading was taken.",
    "discussion": "This key takes an NSNumber object whose value is HKBodyTemperatureSensorLocation.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "This key takes an NSNumber object whose value is HKBodyTemperatureSensorLocation.",
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
        "text": "let HKMetadataKeyBodyTemperatureSensorLocation: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyBodyTemperatureSensorLocation;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeybodytemperaturesensorlocation"
  },
  {
    "swiftName": "HKMetadataKeyHeartRateSensorLocation",
    "objcName": "HKMetadataKeyHeartRateSensorLocation",
    "group": "Vitals Sensors Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The location where a specific heart rate reading was taken.",
    "discussion": "This key takes an NSNumber containing an HKHeartRateSensorLocation as its value.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "This key takes an NSNumber containing an HKHeartRateSensorLocation as its value.",
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
        "text": "let HKMetadataKeyHeartRateSensorLocation: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyHeartRateSensorLocation;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyheartratesensorlocation"
  },
  {
    "swiftName": "HKMetadataKeyHeartRateMotionContext",
    "objcName": "HKMetadataKeyHeartRateMotionContext",
    "group": "Vitals Sensors Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The user’s activity level when the heart rate sample was measured.",
    "discussion": "This key takes an NSNumber containing an HKHeartRateMotionContext as its value.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "This key takes an NSNumber containing an HKHeartRateMotionContext as its value.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
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
        "introducedAt": "4.0",
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
        "text": "let HKMetadataKeyHeartRateMotionContext: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyHeartRateMotionContext;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyheartratemotioncontext"
  },
  {
    "swiftName": "HKMetadataKeyHeartRateRecoveryActivityDuration",
    "objcName": "HKMetadataKeyHeartRateRecoveryActivityDuration",
    "group": "Vitals Sensors Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
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
        "introducedAt": "9.0",
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
        "text": "let HKMetadataKeyHeartRateRecoveryActivityDuration: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyHeartRateRecoveryActivityDuration;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyheartraterecoveryactivityduration"
  },
  {
    "swiftName": "HKMetadataKeyHeartRateRecoveryActivityType",
    "objcName": "HKMetadataKeyHeartRateRecoveryActivityType",
    "group": "Vitals Sensors Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
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
        "introducedAt": "9.0",
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
        "text": "let HKMetadataKeyHeartRateRecoveryActivityType: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyHeartRateRecoveryActivityType;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyheartraterecoveryactivitytype"
  },
  {
    "swiftName": "HKMetadataKeyHeartRateRecoveryMaxObservedRecoveryHeartRate",
    "objcName": "HKMetadataKeyHeartRateRecoveryMaxObservedRecoveryHeartRate",
    "group": "Vitals Sensors Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
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
        "introducedAt": "9.0",
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
        "text": "let HKMetadataKeyHeartRateRecoveryMaxObservedRecoveryHeartRate: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyHeartRateRecoveryMaxObservedRecoveryHeartRate;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyheartraterecoverymaxobservedrecoveryheartrate"
  },
  {
    "swiftName": "HKMetadataKeyHeartRateRecoveryTestType",
    "objcName": "HKMetadataKeyHeartRateRecoveryTestType",
    "group": "Vitals Sensors Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The type of test that the source used to calculate a person’s heart-rate recovery.",
    "discussion": "Use this metadata key to identify the type of test that the HKSource used to calculate the value for a heartRateRecoveryOneMinute sample.",
    "valueType": null,
    "valueTypeEvidence": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
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
        "introducedAt": "9.0",
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
        "text": "let HKMetadataKeyHeartRateRecoveryTestType: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyHeartRateRecoveryTestType;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyheartraterecoverytesttype"
  },
  {
    "swiftName": "HKMetadataKeyVO2MaxTestType",
    "objcName": "HKMetadataKeyVO2MaxTestType",
    "group": "Vitals Sensors Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The method used to calculate the user’s VO2 max rate.",
    "discussion": "This key takes an NSNumber object containing a HKVO2MaxTestType value.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "This key takes an NSNumber object containing a HKVO2MaxTestType value.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
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
        "introducedAt": "4.0",
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
        "text": "let HKMetadataKeyVO2MaxTestType: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyVO2MaxTestType;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyvo2maxtesttype"
  },
  {
    "swiftName": "HKMetadataKeyAudioExposureLevel",
    "objcName": "HKMetadataKeyAudioExposureLevel",
    "group": "Audio Event Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The audio level associated with an audio event.",
    "discussion": "Use this key on audio exposure events. It takes an HKQuantity containing the audio level measured in decibelAWeightedSoundPressureLevel() units.",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "It takes an HKQuantity containing the audio level measured in decibelAWeightedSoundPressureLevel() units.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
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
        "introducedAt": "6.0",
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
        "text": "let HKMetadataKeyAudioExposureLevel: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyAudioExposureLevel;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyaudioexposurelevel"
  },
  {
    "swiftName": "HKMetadataKeyAudioExposureDuration",
    "objcName": "HKMetadataKeyAudioExposureDuration",
    "group": "Audio Event Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The audio exposure event’s duration.",
    "discussion": "Use this key on headphone audio exposure events. It takes an HKQuantity containing the audio level measured in units of time.",
    "valueType": "HKQuantity",
    "valueTypeEvidence": "It takes an HKQuantity containing the audio level measured in units of time.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.2",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.2",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.2",
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
        "introducedAt": "7.1",
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
        "text": "let HKMetadataKeyAudioExposureDuration: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyAudioExposureDuration;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyaudioexposureduration"
  },
  {
    "swiftName": "HKMetadataKeyHeadphoneGain",
    "objcName": "HKMetadataKeyHeadphoneGain",
    "group": "Audio Event Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": null,
    "discussion": null,
    "valueType": null,
    "valueTypeEvidence": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.4",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.4",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.4",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.3",
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
        "introducedAt": "9.4",
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
        "text": "let HKMetadataKeyHeadphoneGain: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyHeadphoneGain;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyheadphonegain"
  },
  {
    "swiftName": "HKMetadataKeyBloodGlucoseMealTime",
    "objcName": "HKMetadataKeyBloodGlucoseMealTime",
    "group": "Blood Glucose Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the relative timing of a blood glucose reading to a meal.",
    "discussion": "Set this key on a bloodGlucose sample. Set it’s value to an NSNumber object containing a HKBloodGlucoseMealTime value.Medical professionals can use the relative meal time to help determine the acceptable range for a blood glucose reading. If your app requires more precise timing or additional information about the meal’s composition, create samples to record those details (for example, a dietaryCarbohydrates sample with the exact meal time).",
    "valueType": "NSNumber",
    "valueTypeEvidence": "Set it’s value to an NSNumber object containing a HKBloodGlucoseMealTime value.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
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
        "introducedAt": "4.0",
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
        "text": "let HKMetadataKeyBloodGlucoseMealTime: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyBloodGlucoseMealTime;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeybloodglucosemealtime"
  },
  {
    "swiftName": "HKMetadataKeyInsulinDeliveryReason",
    "objcName": "HKMetadataKeyInsulinDeliveryReason",
    "group": "Blood Glucose Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "The medical reason for administering insulin.",
    "discussion": "This key is required for insulinDelivery samples. It takes an NSNumber object containing a HKInsulinDeliveryReason value.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "It takes an NSNumber object containing a HKInsulinDeliveryReason value.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
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
        "introducedAt": "4.0",
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
        "text": "let HKMetadataKeyInsulinDeliveryReason: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyInsulinDeliveryReason;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyinsulindeliveryreason"
  },
  {
    "swiftName": "HKMetadataKeyMenstrualCycleStart",
    "objcName": "HKMetadataKeyMenstrualCycleStart",
    "group": "Reproductive Health Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates whether the sample represents the start of a menstrual cycle. This metadata key is required for menstrualFlow category samples.",
    "discussion": "Set this key’s value to true if the sample represents the start of a menstrual cycle; otherwise, set it to false.",
    "valueType": "Boolean",
    "valueTypeEvidence": "Set this key’s value to true if the sample represents the start of a menstrual cycle; otherwise, set it to false.",
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
        "text": "let HKMetadataKeyMenstrualCycleStart: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyMenstrualCycleStart;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeymenstrualcyclestart"
  },
  {
    "swiftName": "HKMetadataKeySexualActivityProtectionUsed",
    "objcName": "HKMetadataKeySexualActivityProtectionUsed",
    "group": "Reproductive Health Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates whether protection was used during sexual activity. This metadata key can be used with sexualActivity category samples.",
    "discussion": "Set this key’s value to true if protection was used during sexual activity; otherwise, set it to false.",
    "valueType": "Boolean",
    "valueTypeEvidence": "Set this key’s value to true if protection was used during sexual activity; otherwise, set it to false.",
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
        "text": "let HKMetadataKeySexualActivityProtectionUsed: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeySexualActivityProtectionUsed;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeysexualactivityprotectionused"
  },
  {
    "swiftName": "HKMetadataKeyAlgorithmVersion",
    "objcName": "HKMetadataKeyAlgorithmVersion",
    "group": "Algorithm Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key that indicates the version number of the algorithm used to calculate the sample’s value.",
    "discussion": "This key takes an NSNumber containing an NSInteger. Note: In watchOS 8, the system uses this key for heartRateVariabilitySDNN and HKHeartbeatSeriesSample samples generated by Apple Watch.",
    "valueType": "NSNumber",
    "valueTypeEvidence": "This key takes an NSNumber containing an NSInteger.",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "deprecatedAt": null,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "15.0",
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
        "introducedAt": "8.0",
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
        "text": "let HKMetadataKeyAlgorithmVersion: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyAlgorithmVersion;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyalgorithmversion"
  },
  {
    "swiftName": "HKMetadataKeyAppleECGAlgorithmVersion",
    "objcName": "HKMetadataKeyAppleECGAlgorithmVersion",
    "group": "Algorithm Keys",
    "subgroup": null,
    "alsoIn": [],
    "roleHeading": "Global Variable",
    "abstract": "A key for metadata indicating the version number of the algorithm Apple Watch uses to generate an ECG reading.",
    "discussion": "Apple Watch sets this key on the HKElectrocardiogram samples it creates. The key is read-only.",
    "valueType": null,
    "valueTypeEvidence": null,
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
        "text": "let HKMetadataKeyAppleECGAlgorithmVersion: String"
      },
      {
        "language": "occ",
        "text": "extern NSString * const HKMetadataKeyAppleECGAlgorithmVersion;"
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkmetadatakeyappleecgalgorithmversion"
  }
];

/** Symbols Apple files on the same pages that are not HKMetadataKey
 *  constants (enums, predicate key paths). Not rows; listed for the count. */
export const HK_METADATA_OTHER_SYMBOLS: { name: string; group: string; subgroup: string | null; url: string }[] = [
  {
    "name": "HKDevicePlacementSide",
    "group": "Device Information Keys",
    "subgroup": null,
    "url": "https://developer.apple.com/documentation/healthkit/hkdeviceplacementside"
  },
  {
    "name": "HKPredicateKeyPathAverageHeartRate",
    "group": "Vitals Sensors Keys",
    "subgroup": null,
    "url": "https://developer.apple.com/documentation/healthkit/hkpredicatekeypathaverageheartrate"
  },
  {
    "name": "HKAppleECGAlgorithmVersion",
    "group": "Algorithm Keys",
    "subgroup": null,
    "url": "https://developer.apple.com/documentation/healthkit/hkappleecgalgorithmversion"
  },
  {
    "name": "HKPredicateKeyPathECGClassification",
    "group": "Algorithm Keys",
    "subgroup": null,
    "url": "https://developer.apple.com/documentation/healthkit/hkpredicatekeypathecgclassification"
  },
  {
    "name": "HKPredicateKeyPathECGSymptomsStatus",
    "group": "Algorithm Keys",
    "subgroup": null,
    "url": "https://developer.apple.com/documentation/healthkit/hkpredicatekeypathecgsymptomsstatus"
  }
];
