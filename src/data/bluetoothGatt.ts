/**
 * Bluetooth GATT services and characteristics for fitness and health devices,
 * with each characteristic's structure as the Bluetooth SIG's GATT
 * Specification Supplement (gss) YAML publishes it.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-bluetooth-gatt.mjs
 *
 * Source: https://bitbucket.org/bluetooth-SIG/public (branch main)
 *   commit 408f4a0305d87ea75d9f700e3c8f85aa1d3a74fd (committed 2026-10-14), read as https://bitbucket.org/bluetooth-SIG/public/get/408f4a0305d87ea75d9f700e3c8f85aa1d3a74fd.tar.gz
 *   assigned_numbers/uuids/service_uuids.yaml, assigned_numbers/uuids/characteristic_uuids.yaml, assigned_numbers/uuids/units.yaml,
 *   assigned_numbers/profiles_and_services/<x>/<x>_permitted_characteristics.yaml, gss/*.yaml
 * Fetched: 2026-10-17
 *
 * Terms. The repository has no README or licence file. Every file read
 * (285) carries the same notice, kept verbatim in BT_GATT_TERMS. It says:
 *   "This document is proprietary to Bluetooth SIG."
 *   "The furnishing of this document does not grant any license to any intellectual property of Bluetooth SIG or its members."
 *   "This document is subject to change without notice."
 *   "Copyright © 2020–2026 by Bluetooth SIG, Inc."
 * So the SIG's text is quoted on the pages with that attribution, and this
 * site does not relicense it. This site is not affiliated with Bluetooth SIG.
 *
 * Scope is an allow-list in the generator, not a mapping: no file in the
 * repository says which characteristics a service contains, except the
 * permitted-characteristics lists, so `services` is set only from those.
 * Derived values keep their evidence: each unit carries the line it was read
 * from, each parsed presence condition its "Present if" line, and an offset is
 * a number only where every earlier size is a plain number.
 */

/** The date the generator last read the repository. */
export const BT_GATT_FETCHED_ON = "2026-10-17";

/** Where this file was read from: repository, branch, the commit at its head, and the archive. */
export const BT_GATT_SOURCE = {
  "repository": "https://bitbucket.org/bluetooth-SIG/public",
  "branch": "main",
  "commit": "408f4a0305d87ea75d9f700e3c8f85aa1d3a74fd",
  "commitDate": "2026-10-14",
  "archive": "https://bitbucket.org/bluetooth-SIG/public/get/408f4a0305d87ea75d9f700e3c8f85aa1d3a74fd.tar.gz",
  "description": "Public YAML files for Bluetooth SIG Assigned Numbers, GATT Specification Supplement, and Device Properties",
  "files": {
    "serviceUuids": "assigned_numbers/uuids/service_uuids.yaml",
    "characteristicUuids": "assigned_numbers/uuids/characteristic_uuids.yaml",
    "units": "assigned_numbers/uuids/units.yaml",
    "gssFolder": "gss/"
  }
} as const;

/** The notice at the top of every file read (all 285 identical), verbatim. */
export const BT_GATT_TERMS = "This document, regardless of its title or content, is not a Bluetooth\nSpecification as defined in the Bluetooth Patent/Copyright License Agreement\n(“PCLA”) and Bluetooth Trademark License Agreement. Use of this document by\nmembers of Bluetooth SIG is governed by the membership and other related\nagreements between Bluetooth SIG Inc. (“Bluetooth SIG”) and its members,\nincluding the PCLA and other agreements posted on Bluetooth SIG’s website\nlocated at www.bluetooth.com.\n\nTHIS DOCUMENT IS PROVIDED “AS IS” AND BLUETOOTH SIG, ITS MEMBERS, AND THEIR\nAFFILIATES MAKE NO REPRESENTATIONS OR WARRANTIES AND DISCLAIM ALL WARRANTIES,\nEXPRESS OR IMPLIED, INCLUDING ANY WARRANTY OF MERCHANTABILITY, TITLE,\nNON-INFRINGEMENT, FITNESS FOR ANY PARTICULAR PURPOSE, THAT THE CONTENT OF THIS\nDOCUMENT IS FREE OF ERRORS.\n\nTO THE EXTENT NOT PROHIBITED BY LAW, BLUETOOTH SIG, ITS MEMBERS, AND THEIR\nAFFILIATES DISCLAIM ALL LIABILITY ARISING OUT OF OR RELATING TO USE OF THIS\nDOCUMENT AND ANY INFORMATION CONTAINED IN THIS DOCUMENT, INCLUDING LOST REVENUE,\nPROFITS, DATA OR PROGRAMS, OR BUSINESS INTERRUPTION, OR FOR SPECIAL, INDIRECT,\nCONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS OF\nTHE THEORY OF LIABILITY, AND EVEN IF BLUETOOTH SIG, ITS MEMBERS, OR THEIR\nAFFILIATES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n\nThis document is proprietary to Bluetooth SIG. This document may contain or\ncover subject matter that is intellectual property of Bluetooth SIG and its\nmembers. The furnishing of this document does not grant any license to any\nintellectual property of Bluetooth SIG or its members.\n\nThis document is subject to change without notice.\n\nCopyright © 2020–2026 by Bluetooth SIG, Inc. The Bluetooth word mark and logos\nare owned by Bluetooth SIG, Inc. Other third-party brands and names are the\nproperty of their respective owners.";

/** Totals across the whole repository at this commit, for context. */
export const BT_GATT_TOTALS = {
  "serviceUuids": 76,
  "characteristicUuids": 512,
  "units": 127,
  "gssFiles": 278,
  "permittedFiles": 4,
  "filesRead": 285
};

/** The js-yaml version the files were parsed with. */
export const BT_GATT_PARSER = "js-yaml 3.15.0";

/** Every permitted-characteristics list in the repository — the only files that tie characteristics to a service. */
export const BT_GATT_PERMITTED_LISTS: { service: string; name: string | null; uuid: string | null; characteristics: number; source: string }[] = [
  {
    "service": "org.bluetooth.service.cookware",
    "name": "Cookware",
    "uuid": "0x185D",
    "characteristics": 3,
    "source": "assigned_numbers/profiles_and_services/cws/cws_permitted_characteristics.yaml"
  },
  {
    "service": "org.bluetooth.service.environmental_sensing",
    "name": "Environmental Sensing",
    "uuid": "0x181A",
    "characteristics": 31,
    "source": "assigned_numbers/profiles_and_services/ess/ess_permitted_characteristics.yaml"
  },
  {
    "service": "org.bluetooth.service.industrial_measurement_device",
    "name": "Industrial Measurement Device",
    "uuid": "0x185A",
    "characteristics": 7,
    "source": "assigned_numbers/profiles_and_services/imds/imds_permitted_characteristics.yaml"
  },
  {
    "service": "org.bluetooth.service.user_data",
    "name": "User Data",
    "uuid": "0x181C",
    "characteristics": 39,
    "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
  }
];

export type BtUnit = {
  /** The unit id as the gss text writes it, e.g. "org.bluetooth.unit.period.beats_per_minute". */
  id: string;
  /** units.yaml's name for exactly that id; null where units.yaml has no such id. */
  name: string | null;
  /** The line of the description the id was read from. */
  evidence: string;
};

export type BtPresence = {
  bit: number;
  /** The flags field the line names, e.g. "Flags". */
  field: string;
  value: number;
  /** The "Present if bit N of … field is set to V" line, verbatim. */
  evidence: string;
};

export type BtField = {
  name: string;
  /** The row id on the characteristic's page (structure fields and struct rows). */
  anchor: string;
  /** The gss type (structure) or data_type (struct rows), verbatim. */
  type: string;
  /** The size as published, verbatim: "1", "0 or 2", "variable", "0–18"… (octets, or bits where the struct says size_in_bits). */
  size: string;
  /** "fixed" for a plain number, "optional" for "0 or N", "variable" for anything else. */
  sizeKind: "fixed" | "optional" | "variable";
  /** N for a fixed or "0 or N" size; null otherwise. */
  sizeN: number | null;
  /** Present on structure fields: the gss description, verbatim (macros such as \autoref kept). */
  description?: string;
  units: BtUnit[];
  /** Every "Present if …" line, verbatim; null where there is none. */
  presenceText: string | null;
  /** The condition, parsed only when it is one "Present if bit N of … field is set to V" line. */
  presence: BtPresence | null;
  /** Offset from the start of the value (structure) or of the struct (struct rows); null where an earlier size is not a plain number. */
  offset: number | null;
  /** The earlier fields whose size is "0 or N" or variable, when offset is null. */
  offsetVariesWith: string[];
};

export type BtDefinition = {
  /** The `fields` entry's name, verbatim. */
  name: string;
  /** The key an \autoref{sec:<id>/field/<key>} uses for it. */
  key: string;
  /** The row id on the characteristic's page. */
  anchor: string;
  description: string | null;
  sectionTitle: string | null;
  tableCaption: string | null;
  valueHeader: string | null;
  descriptionHeader: string | null;
  sizeInBits: boolean;
  /** "bits" (a flags-style table), "struct" (field/data_type/size rows), "values" (value tables) or "table" (op codes and the like). */
  kind: "bits" | "struct" | "values" | "table";
  /** The keys used across its rows, in first-seen order. */
  columns: string[];
  /** Its rows, every value verbatim. */
  rows: Record<string, string>[];
  /** For a struct: its rows with sizes, offsets, units and presence computed as for a structure. */
  layout: BtField[] | null;
  subfields: BtDefinition[];
};

export type BtCharacteristic = {
  /** e.g. "org.bluetooth.characteristic.heart_rate_measurement". */
  id: string;
  /** The 16-bit UUID as characteristic_uuids.yaml writes it, e.g. "0x2A37". */
  uuid: string;
  name: string;
  /** The page slug: the id's last part with hyphens. */
  slug: string;
  /** Why it is in scope: chosen for a device category, referenced by an in-scope structure, or on the SIG's User Data list. */
  scopeReason: "device" | "referenced" | "user-data";
  /** Services a permitted-characteristics file lists it under; empty where no file does. */
  services: { id: string; name: string | null; uuid: string | null; source: string }[];
  /** In-scope characteristics whose gss text references this one. */
  referencedBy: string[];
  /** Thin-page rule: a page only with a structure of at least two fields, or a flags field. */
  hasPage: boolean;
  pageReason: "fields" | "flags" | null;
  /** The gss structure; null where the repository has no gss file for this characteristic. */
  gss: {
    file: string;
    description: string;
    structure: BtField[];
    definitions: BtDefinition[];
    /** Flags fields found, as "Field" or "Struct › Field". */
    flagsFields: string[];
    /** Same-file \autoref targets that match no `fields` entry, shown as text. */
    unresolvedRefs: string[];
  } | null;
};

export type BtService = {
  uuid: string;
  name: string;
  id: string;
  /** The characteristics a permitted-characteristics file lists for it; null where no such file exists. */
  permittedCharacteristics: string[] | null;
  permittedSource: string | null;
};

/** The in-scope services, in UUID order. */
export const BT_SERVICES: BtService[] = [
  {
    "uuid": "0x1808",
    "name": "Glucose",
    "id": "org.bluetooth.service.glucose",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x1809",
    "name": "Health Thermometer",
    "id": "org.bluetooth.service.health_thermometer",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x180D",
    "name": "Heart Rate",
    "id": "org.bluetooth.service.heart_rate",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x1810",
    "name": "Blood Pressure",
    "id": "org.bluetooth.service.blood_pressure",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x1814",
    "name": "Running Speed and Cadence",
    "id": "org.bluetooth.service.running_speed_and_cadence",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x1816",
    "name": "Cycling Speed and Cadence",
    "id": "org.bluetooth.service.cycling_speed_and_cadence",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x1818",
    "name": "Cycling Power",
    "id": "org.bluetooth.service.cycling_power",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x181B",
    "name": "Body Composition",
    "id": "org.bluetooth.service.body_composition",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x181C",
    "name": "User Data",
    "id": "org.bluetooth.service.user_data",
    "permittedCharacteristics": [
      "org.bluetooth.characteristic.activity_goal",
      "org.bluetooth.characteristic.aerobic_heart_rate_lower_limit",
      "org.bluetooth.characteristic.aerobic_heart_rate_upper_limit",
      "org.bluetooth.characteristic.aerobic_threshold",
      "org.bluetooth.characteristic.age",
      "org.bluetooth.characteristic.anaerobic_heart_rate_lower_limit",
      "org.bluetooth.characteristic.anaerobic_heart_rate_upper_limit",
      "org.bluetooth.characteristic.anaerobic_threshold",
      "org.bluetooth.characteristic.caloric_intake",
      "org.bluetooth.characteristic.date_of_birth",
      "org.bluetooth.characteristic.date_of_threshold_assessment",
      "org.bluetooth.characteristic.device_wearing_position",
      "org.bluetooth.characteristic.email_address",
      "org.bluetooth.characteristic.fat_burn_heart_rate_lower_limit",
      "org.bluetooth.characteristic.fat_burn_heart_rate_upper_limit",
      "org.bluetooth.characteristic.first_name",
      "org.bluetooth.characteristic.five_zone_heart_rate_limits",
      "org.bluetooth.characteristic.four_zone_heart_rate_limits",
      "org.bluetooth.characteristic.gender",
      "org.bluetooth.characteristic.handedness",
      "org.bluetooth.characteristic.heart_rate_max",
      "org.bluetooth.characteristic.height",
      "org.bluetooth.characteristic.high_intensity_exercise_threshold",
      "org.bluetooth.characteristic.high_resolution_height",
      "org.bluetooth.characteristic.hip_circumference",
      "org.bluetooth.characteristic.language",
      "org.bluetooth.characteristic.last_name",
      "org.bluetooth.characteristic.maximum_recommended_heart_rate",
      "org.bluetooth.characteristic.middle_name",
      "org.bluetooth.characteristic.preferred_units",
      "org.bluetooth.characteristic.resting_heart_rate",
      "org.bluetooth.characteristic.sedentary_interval_notification",
      "org.bluetooth.characteristic.sport_type_for_aerobic_and_anaerobic_thresholds",
      "org.bluetooth.characteristic.stride_length",
      "org.bluetooth.characteristic.three_zone_heart_rate_limits",
      "org.bluetooth.characteristic.two_zone_heart_rate_limits",
      "org.bluetooth.characteristic.vo2_max",
      "org.bluetooth.characteristic.waist_circumference",
      "org.bluetooth.characteristic.weight"
    ],
    "permittedSource": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
  },
  {
    "uuid": "0x181D",
    "name": "Weight Scale",
    "id": "org.bluetooth.service.weight_scale",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x181F",
    "name": "Continuous Glucose Monitoring",
    "id": "org.bluetooth.service.continuous_glucose_monitoring",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x1822",
    "name": "Pulse Oximeter",
    "id": "org.bluetooth.service.pulse_oximeter",
    "permittedCharacteristics": null,
    "permittedSource": null
  },
  {
    "uuid": "0x1826",
    "name": "Fitness Machine",
    "id": "org.bluetooth.service.fitness_machine",
    "permittedCharacteristics": null,
    "permittedSource": null
  }
];

/** The in-scope characteristics, in UUID order. */
export const BT_CHARACTERISTICS: BtCharacteristic[] = [
  {
    "id": "org.bluetooth.characteristic.date_time",
    "uuid": "0x2A08",
    "name": "Date Time",
    "slug": "date-time",
    "scopeReason": "referenced",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.weight_measurement",
      "org.bluetooth.characteristic.body_composition_measurement",
      "org.bluetooth.characteristic.glucose_measurement",
      "org.bluetooth.characteristic.cgm_session_start_time",
      "org.bluetooth.characteristic.blood_pressure_measurement",
      "org.bluetooth.characteristic.intermediate_cuff_pressure",
      "org.bluetooth.characteristic.temperature_measurement",
      "org.bluetooth.characteristic.intermediate_temperature"
    ],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.date_time.yaml",
      "description": "The Date Time characteristic is used to represent date and time.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Year",
          "anchor": "field-year",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Year as defined by the Gregorian calendar. Valid range 1582 to 9999. A value of 0 means that the year is not known. All other values are Reserved for Future Use.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Month",
          "anchor": "field-month",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Month of the year as defined by the Gregorian calendar. Valid range 1 (January) to 12 (December). A value of 0 means that the month is not known. All other values are Reserved for Future Use.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Day",
          "anchor": "field-day",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Day of the month as defined by the Gregorian calendar. Valid range 1 to 31. A value of 0 means that the day of month is not known. All other values are Reserved for Future Use.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 3,
          "offsetVariesWith": []
        },
        {
          "name": "Hours",
          "anchor": "field-hours",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Number of hours past midnight. Valid range 0 to 23. All other values are Reserved for Future Use.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 4,
          "offsetVariesWith": []
        },
        {
          "name": "Minutes",
          "anchor": "field-minutes",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Number of minutes since the start of the hour. Valid range 0 to 59. All other values are Reserved for Future Use.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 5,
          "offsetVariesWith": []
        },
        {
          "name": "Seconds",
          "anchor": "field-seconds",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Number of seconds since the start of the minute. Valid range 0 to 59. All other values are Reserved for Future Use.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 6,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.dst_offset",
    "uuid": "0x2A0D",
    "name": "DST Offset",
    "slug": "dst-offset",
    "scopeReason": "referenced",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.cgm_session_start_time"
    ],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.dst_offset.yaml",
      "description": "The DST Offset characteristic is used to represent daylight saving time information associated with time.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "DST Offset",
          "anchor": "field-dst-offset",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "0: Standard Time\n2: Half an hour Daylight Time (+ 0.5h)\n4: Daylight Time (+ 1h)\n8: Double Daylight Time (+ 2h)\n255: DST offset unknown\nAll other values: Reserved for Future Use",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.time_zone",
    "uuid": "0x2A0E",
    "name": "Time Zone",
    "slug": "time-zone",
    "scopeReason": "referenced",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.cgm_session_start_time"
    ],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.time_zone.yaml",
      "description": "The Time Zone characteristic is used to represent the time difference in 15-minute increments between local standard time and UTC.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Time Zone",
          "anchor": "field-time-zone",
          "type": "sint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "This field represents the offset from UTC in number of 15-minute increments.\nValid range from -48 to +56.\nA value of -128 means that the time zone offset is not known.\nAll other values are Reserved for Future Use.\nThe offset defined in this characteristic is constant regardless of whether daylight savings is in effect.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.glucose_measurement",
    "uuid": "0x2A18",
    "name": "Glucose Measurement",
    "slug": "glucose-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.glucose_measurement.yaml",
      "description": "The Glucose Measurement characteristic is used to represent data related to a glucose measurement record.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_measurement/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Sequence Number",
          "anchor": "field-sequence-number",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Contains a sequence number of the record. It is used to number a sequence of measurements as defined by the service.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Base Time",
          "anchor": "field-base-time",
          "type": "struct",
          "size": "7",
          "sizeKind": "fixed",
          "sizeN": 7,
          "description": "Refer to Date Time characteristic in \\autoref{sec:org.bluetooth.characteristic.date_time}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 3,
          "offsetVariesWith": []
        },
        {
          "name": "Time Offset",
          "anchor": "field-time-offset",
          "type": "int16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Specifies the time difference from the value of the Base Time field.\nSee \\autoref{sec:org.bluetooth.characteristic.glucose_measurement/field/time_offset}\nunit: org.bluetooth.unit.time.minute\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.minute",
              "name": "time (minute)",
              "evidence": "unit: org.bluetooth.unit.time.minute"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": 10,
          "offsetVariesWith": []
        },
        {
          "name": "Glucose Concentration",
          "anchor": "field-glucose-concentration",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "If bit 2 of Flags field is set to 0,\nunit: org.bluetooth.unit.mass_density.kilogram_per_liter\nIf bit 2 of Flags field is set to 1,\nunit: org.bluetooth.unit.mass_density.mole_per_litre\nPresent if bit 1 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.mass_density.kilogram_per_liter",
              "name": null,
              "evidence": "unit: org.bluetooth.unit.mass_density.kilogram_per_liter"
            },
            {
              "id": "org.bluetooth.unit.mass_density.mole_per_litre",
              "name": null,
              "evidence": "unit: org.bluetooth.unit.mass_density.mole_per_litre"
            }
          ],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Offset"
          ]
        },
        {
          "name": "Type-Sample Location",
          "anchor": "field-type-sample-location",
          "type": "struct",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_measurement/field/type-sample_location}\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Offset",
            "Glucose Concentration"
          ]
        },
        {
          "name": "Sensor Status Annunciation",
          "anchor": "field-sensor-status-annunciation",
          "type": "boolean[16]",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_measurement/field/sensor_status_annunciation}\nPresent if bit 3 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Offset",
            "Glucose Concentration",
            "Type-Sample Location"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Time Offset Flag:\n0 = Time Offset field not present\n1 = Time Offset field present"
            },
            {
              "bit": "1",
              "description": "Glucose Concentration and Type-Sample Location Flag:\n0 = Glucose Concentration and Type-Sample Location fields not present\n1 = Glucose Concentration and Type-Sample Location fields present"
            },
            {
              "bit": "2",
              "description": "Glucose Units Flag:\n0 = Glucose concentration in units of mg/dL\n1 = Glucose concentration in units of mmol/L"
            },
            {
              "bit": "3",
              "description": "Sensor Status Annunciation Flag:\n0 = Sensor Status Annunciation field not present\n1 = Sensor Status Annunciation field present"
            },
            {
              "bit": "4",
              "description": "Context Information Flag:\n0 = This record does not include context information\n1 = This record includes context information"
            },
            {
              "bit": "5–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Time Offset",
          "key": "time_offset",
          "anchor": "def-time-offset",
          "description": "The values of this field are defined below",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x0000–0xFFFF",
              "description": "Time offset in minutes"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Type-Sample Location",
          "key": "type-sample_location",
          "anchor": "def-type-sample-location",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": true,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Type",
              "data_type": "uint4",
              "size": "4",
              "description": "Unit: org.bluetooth.unit.unitless\nSee \\autoref{sec:org.bluetooth.characteristic.glucose_measurement/subfield/type}"
            },
            {
              "field": "Sample Location",
              "data_type": "uint4",
              "size": "4",
              "description": "Unit: org.bluetooth.unit.unitless\nSee \\autoref{sec:org.bluetooth.characteristic.glucose_measurement/subfield/sample_location}"
            }
          ],
          "layout": [
            {
              "name": "Type",
              "anchor": "def-type-sample-location--type",
              "type": "uint4",
              "size": "4",
              "sizeKind": "fixed",
              "sizeN": 4,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Sample Location",
              "anchor": "def-type-sample-location--sample-location",
              "type": "uint4",
              "size": "4",
              "sizeKind": "fixed",
              "sizeN": 4,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 4,
              "offsetVariesWith": []
            }
          ],
          "subfields": [
            {
              "name": "Type",
              "key": "type",
              "anchor": "def-type",
              "description": "The values of this field are defined below.",
              "sectionTitle": null,
              "tableCaption": null,
              "valueHeader": null,
              "descriptionHeader": null,
              "sizeInBits": false,
              "kind": "values",
              "columns": [
                "value",
                "description"
              ],
              "rows": [
                {
                  "value": "0x0",
                  "description": "Reserved for Future Use"
                },
                {
                  "value": "0x1",
                  "description": "Capillary Whole blood"
                },
                {
                  "value": "0x2",
                  "description": "Capillary Plasma"
                },
                {
                  "value": "0x3",
                  "description": "Venous Whole blood"
                },
                {
                  "value": "0x4",
                  "description": "Venous Plasma"
                },
                {
                  "value": "0x5",
                  "description": "Arterial Whole blood"
                },
                {
                  "value": "0x6",
                  "description": "Arterial Plasma"
                },
                {
                  "value": "0x7",
                  "description": "Undetermined Whole blood"
                },
                {
                  "value": "0x8",
                  "description": "Undetermined Plasma"
                },
                {
                  "value": "0x9",
                  "description": "Interstitial Fluid (ISF)"
                },
                {
                  "value": "0xA",
                  "description": "Control Solution"
                },
                {
                  "value": "0xB–0xF",
                  "description": "Reserved for Future Use"
                }
              ],
              "layout": null,
              "subfields": []
            },
            {
              "name": "Sample Location",
              "key": "sample_location",
              "anchor": "def-sample-location",
              "description": "The values of this field are defined below",
              "sectionTitle": null,
              "tableCaption": null,
              "valueHeader": null,
              "descriptionHeader": null,
              "sizeInBits": false,
              "kind": "values",
              "columns": [
                "value",
                "description"
              ],
              "rows": [
                {
                  "value": "0x0",
                  "description": "Reserved for Future Use"
                },
                {
                  "value": "0x1",
                  "description": "Finger"
                },
                {
                  "value": "0x2",
                  "description": "Alternate Site Test (AST)"
                },
                {
                  "value": "0x3",
                  "description": "Earlobe"
                },
                {
                  "value": "0x4",
                  "description": "Control solution"
                },
                {
                  "value": "0x5–0xE",
                  "description": "Reserved for Future Use"
                },
                {
                  "value": "0xF",
                  "description": "Sample Location value not available"
                }
              ],
              "layout": null,
              "subfields": []
            }
          ]
        },
        {
          "name": "Sensor Status Annunciation",
          "key": "sensor_status_annunciation",
          "anchor": "def-sensor-status-annunciation",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Device battery low:\n0 = The battery was not low at the time of measurement.\n1 = The battery was low at the time of measurement."
            },
            {
              "bit": "1",
              "description": "Sensor malfunction:\n0 = The sensor was not malfunctioning or faulting at the time of measurement.\n1 = The sensor was malfunctioning or faulting at the time of measurement."
            },
            {
              "bit": "2",
              "description": "Sample size insufficient:\n0 = There was enough blood or control solution on the strip during the measurement.\n1 = There was not enough blood or control solution on the strip during the measurement."
            },
            {
              "bit": "3",
              "description": "Strip insertion error:\n0 = The strip was inserted correctly.\n1 = The strip was not inserted correctly."
            },
            {
              "bit": "4",
              "description": "Strip type incorrect:\n0 = The strip was the right type for the device.\n1 = The strip was not the right type for the device."
            },
            {
              "bit": "5",
              "description": "Sensor result too high:\n0 = The reading or value was not higher than the device can process.\n1 = The reading or value was higher than the device can process."
            },
            {
              "bit": "6",
              "description": "Sensor result too low:\n0 = The reading or value was not lower than the device can process.\n1 = The reading or value was lower than the device can process."
            },
            {
              "bit": "7",
              "description": "Sensor temperature too high:\n0 = The ambient temperature was not too high for a valid test/result at the time of measurement.\n1 = The ambient temperature was too high for a valid test/result at the time of measurement."
            },
            {
              "bit": "8",
              "description": "Sensor temperature too low:\n0 = The ambient temperature was not too low for a valid test/result at the time of measurement.\n1 = The ambient temperature was too low for a valid test/result at the time of measurement."
            },
            {
              "bit": "9",
              "description": "Sensor read interrupted:\n0 = The reading was not interrupted and the strip was not pulled too soon during the measurement.\n1 = The reading was interrupted or the strip was pulled too soon during the measurement."
            },
            {
              "bit": "10",
              "description": "General device fault:\n0 = A general device fault has not occurred in the sensor device.\n1 = A general device fault has occurred in the sensor device."
            },
            {
              "bit": "11",
              "description": "Time fault:\n0 = A time fault has not occurred in the sensor device.\n1 = A time fault has occurred in the sensor device and the time is inaccurate."
            },
            {
              "bit": "12–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.temperature_measurement",
    "uuid": "0x2A1C",
    "name": "Temperature Measurement",
    "slug": "temperature-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.intermediate_temperature"
    ],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.temperature_measurement.yaml",
      "description": "The Temperature Measurement characteristic is used to represent data related to a temperature measurement.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.temperature_measurement/field/flags}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Temperature Measurement Value (Celsius)",
          "anchor": "field-temperature-measurement-value-celsius",
          "type": "medfloat32",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "This field contains a measurement value.\nUnit: org.bluetooth.unit.thermodynamic_temperature.degree_celsius.\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.thermodynamic_temperature.degree_celsius",
              "name": "Celsius temperature (degree Celsius)",
              "evidence": "Unit: org.bluetooth.unit.thermodynamic_temperature.degree_celsius."
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Temperature Measurement Value (Fahrenheit)",
          "anchor": "field-temperature-measurement-value-fahrenheit",
          "type": "medfloat32",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "This field contains a measurement value.\nUnit: org.bluetooth.unit.thermodynamic_temperature.degree_fahrenheit.\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.thermodynamic_temperature.degree_fahrenheit",
              "name": "thermodynamic temperature (degree Fahrenheit)",
              "evidence": "Unit: org.bluetooth.unit.thermodynamic_temperature.degree_fahrenheit."
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Temperature Measurement Value (Celsius)"
          ]
        },
        {
          "name": "Time Stamp",
          "anchor": "field-time-stamp",
          "type": "struct",
          "size": "0 or 7",
          "sizeKind": "optional",
          "sizeN": 7,
          "description": "Refer to Date Time characteristic in \\autoref{sec:org.bluetooth.characteristic.date_time}.\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Temperature Measurement Value (Celsius)",
            "Temperature Measurement Value (Fahrenheit)"
          ]
        },
        {
          "name": "Temperature Type",
          "anchor": "field-temperature-type",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "The format of this field is the same as the format of the Temperature Type characteristic in \\autoref{sec:org.bluetooth.characteristic.temperature_type}.\nPresent if bit 2 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Temperature Measurement Value (Celsius)",
            "Temperature Measurement Value (Fahrenheit)",
            "Time Stamp"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Temperature Units Flag\n0 = Temperature Measurement Value in units of Celsius\n1 = Temperature Measurement Value in units of Fahrenheit"
            },
            {
              "bit": "1",
              "description": "Time Stamp Flag\n0 = Time Stamp field not present\n1 = Time Stamp field present"
            },
            {
              "bit": "2",
              "description": "Temperature Type Flag\n0 = Temperature Type field not present\n1 = Temperature Type field present"
            },
            {
              "bit": "3–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.temperature_type",
    "uuid": "0x2A1D",
    "name": "Temperature Type",
    "slug": "temperature-type",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.temperature_measurement",
      "org.bluetooth.characteristic.intermediate_temperature"
    ],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.temperature_type.yaml",
      "description": "The Temperature Type characteristic is used to represent the location of a temperature measurement. These values correspond to the Temperature Type descriptions used in IEEE 11073-10408-2008 \\RefRef{ieee_11073_10408}.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Temperature Type Description",
          "anchor": "field-temperature-type-description",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.temperature_type/field/temperature_text_description}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Temperature Type Description",
          "key": "temperature_type_description",
          "anchor": "def-temperature-type-description",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0",
              "description": "Reserved for Future Use"
            },
            {
              "value": "1",
              "description": "Armpit"
            },
            {
              "value": "2",
              "description": "Body (general)"
            },
            {
              "value": "3",
              "description": "Ear (usually earlobe)"
            },
            {
              "value": "4",
              "description": "Finger"
            },
            {
              "value": "5",
              "description": "Gastrointestinal Tract"
            },
            {
              "value": "6",
              "description": "Mouth"
            },
            {
              "value": "7",
              "description": "Rectum"
            },
            {
              "value": "8",
              "description": "Toe"
            },
            {
              "value": "9",
              "description": "Tympanum (ear drum)"
            },
            {
              "value": "10–255",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": [
        "org.bluetooth.characteristic.temperature_type/field/temperature_text_description"
      ]
    }
  },
  {
    "id": "org.bluetooth.characteristic.intermediate_temperature",
    "uuid": "0x2A1E",
    "name": "Intermediate Temperature",
    "slug": "intermediate-temperature",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.intermediate_temperature.yaml",
      "description": "The Intermediate Temperature characteristic is used to send intermediate temperature values to a device for display purposes while a measurement is in progress. The Intermediate Temperature characteristic has the same format as the Temperature Measurement characteristic in \\autoref{sec:org.bluetooth.characteristic.temperature_measurement} except that, due to a different context, the Measurement Value field is referred to as the Intermediate Temperature field.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.intermediate_temperature/field/flags}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Intermediate Temperature (Celsius)",
          "anchor": "field-intermediate-temperature-celsius",
          "type": "medfloat32",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "This field contains a measurement value.\nUnit: org.bluetooth.unit.thermodynamic_temperature.degree_celsius.\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.thermodynamic_temperature.degree_celsius",
              "name": "Celsius temperature (degree Celsius)",
              "evidence": "Unit: org.bluetooth.unit.thermodynamic_temperature.degree_celsius."
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Intermediate Temperature (Fahrenheit)",
          "anchor": "field-intermediate-temperature-fahrenheit",
          "type": "medfloat32",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "This field contains a measurement value.\nUnit: org.bluetooth.unit.thermodynamic_temperature.degree_fahrenheit.\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.thermodynamic_temperature.degree_fahrenheit",
              "name": "thermodynamic temperature (degree Fahrenheit)",
              "evidence": "Unit: org.bluetooth.unit.thermodynamic_temperature.degree_fahrenheit."
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Intermediate Temperature (Celsius)"
          ]
        },
        {
          "name": "Time Stamp",
          "anchor": "field-time-stamp",
          "type": "struct",
          "size": "0 or 7",
          "sizeKind": "optional",
          "sizeN": 7,
          "description": "Refer to Date Time characteristic in \\autoref{sec:org.bluetooth.characteristic.date_time}.\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Intermediate Temperature (Celsius)",
            "Intermediate Temperature (Fahrenheit)"
          ]
        },
        {
          "name": "Temperature Type",
          "anchor": "field-temperature-type",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "The format of this field is the same as the format of the Temperature Type characteristic in \\autoref{sec:org.bluetooth.characteristic.temperature_type}.\nPresent if bit 2 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Intermediate Temperature (Celsius)",
            "Intermediate Temperature (Fahrenheit)",
            "Time Stamp"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Temperature Units Flag\n0 = Intermediate Temperature in units of Celsius\n1 = Intermediate Temperature in units of Fahrenheit"
            },
            {
              "bit": "1",
              "description": "Time Stamp Flag\n0 = Time Stamp field not present\n1 = Time Stamp field present"
            },
            {
              "bit": "2",
              "description": "Temperature Type Flag\n0 = Temperature Type field not present\n1 = Temperature Type field present"
            },
            {
              "bit": "3–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.measurement_interval",
    "uuid": "0x2A21",
    "name": "Measurement Interval",
    "slug": "measurement-interval",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.measurement_interval.yaml",
      "description": "The Measurement Interval characteristic is used to represent the time between measurements.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Measurement Interval",
          "anchor": "field-measurement-interval",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.measurement_interval/field/measurement_interval}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Measurement Interval",
          "key": "measurement_interval",
          "anchor": "def-measurement-interval",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0",
              "description": "No periodic measurement"
            },
            {
              "value": "1–65535",
              "description": "Duration of measurement interval. 65535 seconds is equal to 18 hours, 12 minutes, and 15 seconds.\nUnit: org.bluetooth.unit.time.second"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.glucose_measurement_context",
    "uuid": "0x2A34",
    "name": "Glucose Measurement Context",
    "slug": "glucose-measurement-context",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.glucose_measurement_context.yaml",
      "description": "The Glucose Measurement Context characteristic is used to represent context information associated with a glucose measurement record.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_measurement_context/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Sequence Number",
          "anchor": "field-sequence-number",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Contains the sequence number of the corresponding Glucose Measurement as defined by the service.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Extended Flags",
          "anchor": "field-extended-flags",
          "type": "boolean[8]",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_measurement_context/field/extended_flags}\nPresent if bit 7 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": 3,
          "offsetVariesWith": []
        },
        {
          "name": "Carbohydrate ID",
          "anchor": "field-carbohydrate-id",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_measurement_context/field/carbohydrate_id}\nPresent if bit 0 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Extended Flags"
          ]
        },
        {
          "name": "Carbohydrate",
          "anchor": "field-carbohydrate",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.mass.kilogram\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.mass.kilogram",
              "name": "mass (kilogram)",
              "evidence": "Unit: org.bluetooth.unit.mass.kilogram"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Extended Flags",
            "Carbohydrate ID"
          ]
        },
        {
          "name": "Meal",
          "anchor": "field-meal",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_measurement_context/field/meal}\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Extended Flags",
            "Carbohydrate ID",
            "Carbohydrate"
          ]
        },
        {
          "name": "Tester-Health",
          "anchor": "field-tester-health",
          "type": "struct",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_measurement_context/field/tester-health}\nPresent if bit 2 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Extended Flags",
            "Carbohydrate ID",
            "Carbohydrate",
            "Meal"
          ]
        },
        {
          "name": "Exercise Duration",
          "anchor": "field-exercise-duration",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_measurement_context/field/exercise_duration}\nUnit: org.bluetooth.unit.time.second\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Extended Flags",
            "Carbohydrate ID",
            "Carbohydrate",
            "Meal",
            "Tester-Health"
          ]
        },
        {
          "name": "Exercise Intensity",
          "anchor": "field-exercise-intensity",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.percentage\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Extended Flags",
            "Carbohydrate ID",
            "Carbohydrate",
            "Meal",
            "Tester-Health",
            "Exercise Duration"
          ]
        },
        {
          "name": "Medication ID",
          "anchor": "field-medication-id",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_measurement_context/field/medication_id}\nPresent if bit 4 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Extended Flags",
            "Carbohydrate ID",
            "Carbohydrate",
            "Meal",
            "Tester-Health",
            "Exercise Duration",
            "Exercise Intensity"
          ]
        },
        {
          "name": "Medication",
          "anchor": "field-medication",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "If bit 5 of Flags field is set to 0,\nUnit: org.bluetooth.unit.mass.kilogram\nIf bit 5 of Flags field is set to 1,\nUnit: org.bluetooth.unit.volume.litre\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.mass.kilogram",
              "name": "mass (kilogram)",
              "evidence": "Unit: org.bluetooth.unit.mass.kilogram"
            },
            {
              "id": "org.bluetooth.unit.volume.litre",
              "name": "volume (litre)",
              "evidence": "Unit: org.bluetooth.unit.volume.litre"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Extended Flags",
            "Carbohydrate ID",
            "Carbohydrate",
            "Meal",
            "Tester-Health",
            "Exercise Duration",
            "Exercise Intensity",
            "Medication ID"
          ]
        },
        {
          "name": "HbA1c",
          "anchor": "field-hba1c",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.percentage\nPresent if bit 6 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": "Present if bit 6 of Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Extended Flags",
            "Carbohydrate ID",
            "Carbohydrate",
            "Meal",
            "Tester-Health",
            "Exercise Duration",
            "Exercise Intensity",
            "Medication ID",
            "Medication"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Carbohydrates Flag:\n0 = Carbohydrate ID and Carbohydrate fields not present\n1 = Carbohydrate ID and Carbohydrate fields present"
            },
            {
              "bit": "1",
              "description": "Meal Flag:\n0 = Meal field not present\n1 = Meal field present"
            },
            {
              "bit": "2",
              "description": "Tester-Health Flag:\n0 = Tester-Health field not present\n1 = Tester-Health field present"
            },
            {
              "bit": "3",
              "description": "Exercise Flag:\n0 = Exercise Duration and Exercise Intensity fields not present\n1 = Exercise Duration and Exercise Intensity fields present"
            },
            {
              "bit": "4",
              "description": "Medication Flag:\n0 = Medication ID and Medication fields not present\n1 = Medication ID and Medication fields present"
            },
            {
              "bit": "5",
              "description": "Medication Units Flag:\n0 = Medication value in units of milligrams\n1 = Medication value in units of milliliters"
            },
            {
              "bit": "6",
              "description": "HbA1c Flag:\n0 = HbA1c field not present\n1 = HbA1c field present"
            },
            {
              "bit": "7",
              "description": "Extended Flags:\n0 = Extended Flags field not present\n1 = Extended Flags field present"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Extended Flags",
          "key": "extended_flags",
          "anchor": "def-extended-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Carbohydrate ID",
          "key": "carbohydrate_id",
          "anchor": "def-carbohydrate-id",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x00",
              "description": "Reserved for Future Use"
            },
            {
              "value": "0x01",
              "description": "Breakfast"
            },
            {
              "value": "0x02",
              "description": "Lunch"
            },
            {
              "value": "0x03",
              "description": "Dinner"
            },
            {
              "value": "0x04",
              "description": "Snack"
            },
            {
              "value": "0x05",
              "description": "Drink"
            },
            {
              "value": "0x06",
              "description": "Supper"
            },
            {
              "value": "0x07",
              "description": "Brunch"
            },
            {
              "value": "0x08–0xFF",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Meal",
          "key": "meal",
          "anchor": "def-meal",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x00",
              "description": "Reserved for Future Use"
            },
            {
              "value": "0x01",
              "description": "Preprandial (before meal)"
            },
            {
              "value": "0x02",
              "description": "Postprandial (after meal)"
            },
            {
              "value": "0x03",
              "description": "Fasting"
            },
            {
              "value": "0x04",
              "description": "Casual (snacks, drinks, etc.)"
            },
            {
              "value": "0x05",
              "description": "Bedtime"
            },
            {
              "value": "0x06–0xFF",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Tester-Health",
          "key": "tester-health",
          "anchor": "def-tester-health",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": true,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Tester",
              "data_type": "uint4",
              "size": "4",
              "description": "Unit: org.bluetooth.unit.unitless\nSee \\autoref{sec:org.bluetooth.characteristic.glucose_measurement_context/subfield/tester}"
            },
            {
              "field": "Health",
              "data_type": "uint4",
              "size": "4",
              "description": "Unit: org.bluetooth.unit.unitless\nSee \\autoref{sec:org.bluetooth.characteristic.glucose_measurement_context/subfield/health}"
            }
          ],
          "layout": [
            {
              "name": "Tester",
              "anchor": "def-tester-health--tester",
              "type": "uint4",
              "size": "4",
              "sizeKind": "fixed",
              "sizeN": 4,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Health",
              "anchor": "def-tester-health--health",
              "type": "uint4",
              "size": "4",
              "sizeKind": "fixed",
              "sizeN": 4,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 4,
              "offsetVariesWith": []
            }
          ],
          "subfields": [
            {
              "name": "Tester",
              "key": "tester",
              "anchor": "def-tester",
              "description": "The values of this field are defined below.",
              "sectionTitle": null,
              "tableCaption": null,
              "valueHeader": null,
              "descriptionHeader": null,
              "sizeInBits": false,
              "kind": "values",
              "columns": [
                "value",
                "description"
              ],
              "rows": [
                {
                  "value": "0x0",
                  "description": "Reserved for Future Use"
                },
                {
                  "value": "0x1",
                  "description": "Self"
                },
                {
                  "value": "0x2",
                  "description": "Health Care Professional"
                },
                {
                  "value": "0x3",
                  "description": "Lab test"
                },
                {
                  "value": "0x4–0xE",
                  "description": "Reserved for Future Use"
                },
                {
                  "value": "0xF",
                  "description": "Tester value not available"
                }
              ],
              "layout": null,
              "subfields": []
            },
            {
              "name": "Health",
              "key": "health",
              "anchor": "def-health",
              "description": "The values of this field are defined below.",
              "sectionTitle": null,
              "tableCaption": null,
              "valueHeader": null,
              "descriptionHeader": null,
              "sizeInBits": false,
              "kind": "values",
              "columns": [
                "value",
                "description"
              ],
              "rows": [
                {
                  "value": "0x0",
                  "description": "Reserved for Future Use"
                },
                {
                  "value": "0x1",
                  "description": "Minor health issues"
                },
                {
                  "value": "0x2",
                  "description": "Major health issues"
                },
                {
                  "value": "0x3",
                  "description": "During menses"
                },
                {
                  "value": "0x4",
                  "description": "Under stress"
                },
                {
                  "value": "0x5",
                  "description": "No health issues"
                },
                {
                  "value": "0x6–0xE",
                  "description": "Reserved for Future Use"
                },
                {
                  "value": "0xF",
                  "description": "Health value not available"
                }
              ],
              "layout": null,
              "subfields": []
            }
          ]
        },
        {
          "name": "Exercise Duration",
          "key": "exercise_duration",
          "anchor": "def-exercise-duration",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x0000–0xFFFE",
              "description": "Exercise Duration in seconds"
            },
            {
              "value": "0xFFFF",
              "description": "Overrun"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Medication ID",
          "key": "medication_id",
          "anchor": "def-medication-id",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x00",
              "description": "Reserved for Future Use"
            },
            {
              "value": "0x01",
              "description": "Rapid acting insulin"
            },
            {
              "value": "0x02",
              "description": "Short acting insulin"
            },
            {
              "value": "0x03",
              "description": "Intermediate acting insulin"
            },
            {
              "value": "0x04",
              "description": "Long acting insulin"
            },
            {
              "value": "0x05",
              "description": "Pre-mixed insulin"
            },
            {
              "value": "0x06–0xFF",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags",
        "Extended Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.blood_pressure_measurement",
    "uuid": "0x2A35",
    "name": "Blood Pressure Measurement",
    "slug": "blood-pressure-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.intermediate_cuff_pressure",
      "org.bluetooth.characteristic.enhanced_blood_pressure_measurement",
      "org.bluetooth.characteristic.enhanced_intermediate_cuff_pressure"
    ],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.blood_pressure_measurement.yaml",
      "description": "The Blood Pressure Measurement characteristic is used to represent blood pressure measurement data.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.blood_pressure_measurement/field/flags}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Blood Pressure Measurement Compound Value - Systolic (mmHg)",
          "anchor": "field-blood-pressure-measurement-compound-value-systolic-mmhg",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.pressure.millimetre_of_mercury",
              "name": "pressure (millimetre of mercury)",
              "evidence": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Blood Pressure Measurement Compound Value - Diastolic (mmHg)",
          "anchor": "field-blood-pressure-measurement-compound-value-diastolic-mmhg",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.pressure.millimetre_of_mercury",
              "name": "pressure (millimetre of mercury)",
              "evidence": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value - Systolic (mmHg)"
          ]
        },
        {
          "name": "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (mmHg)",
          "anchor": "field-blood-pressure-measurement-compound-value-mean-arterial-pressure-mmhg",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.pressure.millimetre_of_mercury",
              "name": "pressure (millimetre of mercury)",
              "evidence": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value - Systolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Diastolic (mmHg)"
          ]
        },
        {
          "name": "Blood Pressure Measurement Compound Value - Systolic (kPa)",
          "anchor": "field-blood-pressure-measurement-compound-value-systolic-kpa",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.pressure.pascal;\nM = 1, d = 3, and b = 0\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.pressure.pascal",
              "name": "pressure (pascal)",
              "evidence": "Base Unit: org.bluetooth.unit.pressure.pascal;"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value - Systolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Diastolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (mmHg)"
          ]
        },
        {
          "name": "Blood Pressure Measurement Compound Value - Diastolic (kPa)",
          "anchor": "field-blood-pressure-measurement-compound-value-diastolic-kpa",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.pressure.pascal;\nM = 1, d = 3, and b = 0\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.pressure.pascal",
              "name": "pressure (pascal)",
              "evidence": "Base Unit: org.bluetooth.unit.pressure.pascal;"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value - Systolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Diastolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (mmHg)",
            "Blood Pressure Measurement Compound Value - Systolic (kPa)"
          ]
        },
        {
          "name": "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (kPa)",
          "anchor": "field-blood-pressure-measurement-compound-value-mean-arterial-pressure-kpa",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.pressure.pascal;\nM = 1, d = 3, and b = 0\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.pressure.pascal",
              "name": "pressure (pascal)",
              "evidence": "Base Unit: org.bluetooth.unit.pressure.pascal;"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value - Systolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Diastolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (mmHg)",
            "Blood Pressure Measurement Compound Value - Systolic (kPa)",
            "Blood Pressure Measurement Compound Value - Diastolic (kPa)"
          ]
        },
        {
          "name": "Time Stamp",
          "anchor": "field-time-stamp",
          "type": "struct",
          "size": "0 or 7",
          "sizeKind": "optional",
          "sizeN": 7,
          "description": "Refer to Date Time characteristic in \\autoref{sec:org.bluetooth.characteristic.date_time}.\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value - Systolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Diastolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (mmHg)",
            "Blood Pressure Measurement Compound Value - Systolic (kPa)",
            "Blood Pressure Measurement Compound Value - Diastolic (kPa)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (kPa)"
          ]
        },
        {
          "name": "Pulse Rate",
          "anchor": "field-pulse-rate",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value - Systolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Diastolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (mmHg)",
            "Blood Pressure Measurement Compound Value - Systolic (kPa)",
            "Blood Pressure Measurement Compound Value - Diastolic (kPa)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (kPa)",
            "Time Stamp"
          ]
        },
        {
          "name": "User ID",
          "anchor": "field-user-id",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.blood_pressure_measurement/field/user_id}.\nPresent if bit 3 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value - Systolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Diastolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (mmHg)",
            "Blood Pressure Measurement Compound Value - Systolic (kPa)",
            "Blood Pressure Measurement Compound Value - Diastolic (kPa)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (kPa)",
            "Time Stamp",
            "Pulse Rate"
          ]
        },
        {
          "name": "Measurement Status",
          "anchor": "field-measurement-status",
          "type": "boolean[16]",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.blood_pressure_measurement/field/measurement_status}.\nPresent if bit 4 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value - Systolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Diastolic (mmHg)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (mmHg)",
            "Blood Pressure Measurement Compound Value - Systolic (kPa)",
            "Blood Pressure Measurement Compound Value - Diastolic (kPa)",
            "Blood Pressure Measurement Compound Value - Mean Arterial Pressure (kPa)",
            "Time Stamp",
            "Pulse Rate",
            "User ID"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "These flags define which data fields are present in the characteristic value.\nThe bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Blood Pressure Units Flag\n0 = Blood pressure for Systolic, Diastolic and MAP in units of mmHg\n1 = Blood pressure for Systolic, Diastolic and MAP in units of kPa"
            },
            {
              "bit": "1",
              "description": "Time Stamp Flag\n0 = Time Stamp not present\n1 = Time Stamp present"
            },
            {
              "bit": "2",
              "description": "Pulse Rate Flag\n0 = Pulse Rate not present\n1 = Pulse Rate present"
            },
            {
              "bit": "3",
              "description": "User ID Flag\n0 = User ID not present\n1 = User ID present"
            },
            {
              "bit": "4",
              "description": "Measurement Status Flag\n0 = Measurement Status not present\n1 = Measurement Status present"
            },
            {
              "bit": "5–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "User ID",
          "key": "user_id",
          "anchor": "def-user-id",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x00–0xFE",
              "description": "Defined by the service specification"
            },
            {
              "value": "0xFF",
              "description": "Unknown User"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Measurement Status",
          "key": "measurement_status",
          "anchor": "def-measurement-status",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Body Movement Detection Flag\n0 = No body movement\n1 = Body movement detected during measurement"
            },
            {
              "bit": "1",
              "description": "Cuff Fit Detection Flag\n0 = Cuff fits properly\n1 = Cuff too loose"
            },
            {
              "bit": "2",
              "description": "Irregular Pulse Detection Flag\n0 = No irregular pulse detected\n1 = Irregular pulse detected"
            },
            {
              "bit": "3–4",
              "description": "Pulse Rate Range Detection Flags\n0b00 = Pulse rate is within the range\n0b01 = Pulse rate exceeds upper limit\n0b10 = Pulse rate is less than lower limit\n0b11 = Reserved for Future Use"
            },
            {
              "bit": "5",
              "description": "Measurement Position Detection Flag\n0 = Proper measurement position\n1 = Improper measurement position"
            },
            {
              "bit": "6–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.intermediate_cuff_pressure",
    "uuid": "0x2A36",
    "name": "Intermediate Cuff Pressure",
    "slug": "intermediate-cuff-pressure",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.intermediate_cuff_pressure.yaml",
      "description": "The Intermediate Cuff Pressure characteristic is used to send intermediate Cuff Pressure values to a device for display purposes while a measurement is in progress. The Intermediate Cuff Pressure characteristic has the same format as the Blood Pressure Measurement characteristic in \\autoref{sec:org.bluetooth.characteristic.blood_pressure_measurement}. However, due to a different context, the Blood Pressure Measurement Compound Value field is used for the Intermediate Cuff Pressure Compound Value field and the Systolic sub-field is used for the Current Cuff Pressure sub-field. The Diastolic and Mean Arterial Pressure fields are unused.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.intermediate_cuff_pressure/field/flags}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (mmHg)",
          "anchor": "field-intermediate-cuff-pressure-compound-value-current-cuff-pressure-mmhg",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.pressure.millimetre_of_mercury",
              "name": "pressure (millimetre of mercury)",
              "evidence": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (kPa)",
          "anchor": "field-intermediate-cuff-pressure-compound-value-current-cuff-pressure-kpa",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.pressure.pascal;\nM = 1, d = 3, and b = 0\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.pressure.pascal",
              "name": "pressure (pascal)",
              "evidence": "Base Unit: org.bluetooth.unit.pressure.pascal;"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (mmHg)"
          ]
        },
        {
          "name": "Intermediate Cuff Pressure Compound Value - Diastolic (unused)",
          "anchor": "field-intermediate-cuff-pressure-compound-value-diastolic-unused",
          "type": "medfloat16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "This subfield is not used and is set to the special value NaN.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": null,
          "offsetVariesWith": [
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (mmHg)",
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (kPa)"
          ]
        },
        {
          "name": "Intermediate Cuff Pressure Compound Value - Mean Arterial Pressure (unused)",
          "anchor": "field-intermediate-cuff-pressure-compound-value-mean-arterial-pressure-unused",
          "type": "medfloat16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "This subfield is not used and is set to the special value NaN.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": null,
          "offsetVariesWith": [
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (mmHg)",
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (kPa)"
          ]
        },
        {
          "name": "Time Stamp",
          "anchor": "field-time-stamp",
          "type": "struct",
          "size": "0 or 7",
          "sizeKind": "optional",
          "sizeN": 7,
          "description": "Refer to Date Time characteristic in \\autoref{sec:org.bluetooth.characteristic.date_time}\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (mmHg)",
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (kPa)"
          ]
        },
        {
          "name": "Pulse Rate",
          "anchor": "field-pulse-rate",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (mmHg)",
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (kPa)",
            "Time Stamp"
          ]
        },
        {
          "name": "User ID",
          "anchor": "field-user-id",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.intermediate_cuff_pressure/field/user_id}.\nPresent if bit 3 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (mmHg)",
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (kPa)",
            "Time Stamp",
            "Pulse Rate"
          ]
        },
        {
          "name": "Measurement Status",
          "anchor": "field-measurement-status",
          "type": "boolean[16]",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.intermediate_cuff_pressure/field/measurement_status}.\nPresent if bit 4 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (mmHg)",
            "Intermediate Cuff Pressure Compound Value - Current Cuff Pressure (kPa)",
            "Time Stamp",
            "Pulse Rate",
            "User ID"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "These flags define which data fields are present in the characteristic value.\nThe bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Intermediate Cuff Pressure Units Flag\n0 = Intermediate Cuff pressure for Systolic, Diastolic and MAP in units of mmHg\n1 = Intermediate Cuff pressure for Systolic, Diastolic and MAP in units of kPa"
            },
            {
              "bit": "1",
              "description": "Time Stamp Flag\n0 = Time Stamp not present\n1 = Time Stamp present"
            },
            {
              "bit": "2",
              "description": "Pulse Rate Flag\n0 = Pulse Rate not present\n1 = Pulse Rate present"
            },
            {
              "bit": "3",
              "description": "User ID Flag\n0 = User ID not present\n1 = User ID present"
            },
            {
              "bit": "4",
              "description": "Measurement Status Flag\n0 = Measurement Status not present\n1 = Measurement Status present"
            },
            {
              "bit": "5–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "User ID",
          "key": "user_id",
          "anchor": "def-user-id",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x00–0xFE",
              "description": "Defined by the service specification"
            },
            {
              "value": "0xFF",
              "description": "Unknown User"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Measurement Status",
          "key": "measurement_status",
          "anchor": "def-measurement-status",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Body Movement Detection Flag\n0 = No body movement\n1 = Body movement detected during measurement"
            },
            {
              "bit": "1",
              "description": "Cuff Fit Detection Flag\n0 = Cuff fits properly\n1 = Cuff too loose"
            },
            {
              "bit": "2",
              "description": "Irregular Pulse Detection Flag\n0 = No irregular pulse detected\n1 = Irregular pulse detected"
            },
            {
              "bit": "3–4",
              "description": "Pulse Rate Range Detection Flags\n0b00 = Pulse rate is within the range\n0b01 = Pulse rate exceeds upper limit\n0b10 = Pulse rate is less than lower limit\n0b11 = Reserved for Future Use"
            },
            {
              "bit": "5",
              "description": "Measurement Position Detection Flag\n0 = Proper measurement position\n1 = Improper measurement position"
            },
            {
              "bit": "6–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.heart_rate_measurement",
    "uuid": "0x2A37",
    "name": "Heart Rate Measurement",
    "slug": "heart-rate-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.heart_rate_measurement.yaml",
      "description": "The Heart Rate Measurement characteristic is used to represent data related to a heart rate measurement.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.heart_rate_measurement/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Heart Rate Measurement Value (8 bit resolution)",
          "anchor": "field-heart-rate-measurement-value-8-bit-resolution",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Heart Rate Measurement Value (16 bit resolution)",
          "anchor": "field-heart-rate-measurement-value-16-bit-resolution",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Heart Rate Measurement Value (8 bit resolution)"
          ]
        },
        {
          "name": "Energy Expended",
          "anchor": "field-energy-expended",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.joule\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.joule",
              "name": "energy (joule)",
              "evidence": "Unit: org.bluetooth.unit.energy.joule"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Heart Rate Measurement Value (8 bit resolution)",
            "Heart Rate Measurement Value (16 bit resolution)"
          ]
        },
        {
          "name": "RR-interval",
          "anchor": "field-rr-interval",
          "type": "uint16[n]",
          "size": "0 or n*2",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.heart_rate_measurement/field/rr-interval}\nPresent if bit 4 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Heart Rate Measurement Value (8 bit resolution)",
            "Heart Rate Measurement Value (16 bit resolution)",
            "Energy Expended"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Heart Rate Value Format:\n0 = Heart Rate Value Format is set to uint8\n1 = Heart Rate Value Format is set to uint16"
            },
            {
              "bit": "1",
              "description": "Sensor Contact detected"
            },
            {
              "bit": "2",
              "description": "Sensor Contact Supported"
            },
            {
              "bit": "3",
              "description": "Energy Expended present"
            },
            {
              "bit": "4",
              "description": "RR-Interval present"
            },
            {
              "bit": "5–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "RR-Interval",
          "key": "rr-interval",
          "anchor": "def-rr-interval",
          "description": "The RR-Interval value represents the time between two R-Wave detections. Each RR-Interval value is represented by a uint16 with 1/1024 second as the unit. Because it is possible to measure several RR-Intervals between transmissions of the Heart Rate Measurement characteristic, multiple RR-Interval sub-fields can be present in the characteristic. The number of RR-Interval sub-fields present is determined by a combination of the overall length of the characteristic and whether or not the characteristic contains the Energy Expended field.\nWhere there are multiple RR-Interval values transmitted in the Heart Rate Measurement characteristic, the structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": "RR-Interval Field",
          "descriptionHeader": "Description",
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "RR-Interval Value 0",
              "description": "Oldest RR-Interval value"
            },
            {
              "value": "RR-Interval Value 1",
              "description": ""
            },
            {
              "value": "RR-Interval Value 2",
              "description": ""
            },
            {
              "value": "\\textellipsis",
              "description": ""
            },
            {
              "value": "RR-Interval Value n",
              "description": "Newest RR-Interval value"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.body_sensor_location",
    "uuid": "0x2A38",
    "name": "Body Sensor Location",
    "slug": "body-sensor-location",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.body_sensor_location.yaml",
      "description": "The Body Sensor Location characteristic is used to represent the location of a sensor on a human body.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Body Sensor Location",
          "anchor": "field-body-sensor-location",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.body_sensor_location/field/body_sensor_location}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Body Sensor Location",
          "key": "body_sensor_location",
          "anchor": "def-body-sensor-location",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x00",
              "description": "Other"
            },
            {
              "value": "0x01",
              "description": "Chest"
            },
            {
              "value": "0x02",
              "description": "Wrist"
            },
            {
              "value": "0x03",
              "description": "Finger"
            },
            {
              "value": "0x04",
              "description": "Hand"
            },
            {
              "value": "0x05",
              "description": "Ear Lobe"
            },
            {
              "value": "0x06",
              "description": "Foot"
            },
            {
              "value": "0x07–0xFF",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.heart_rate_control_point",
    "uuid": "0x2A39",
    "name": "Heart Rate Control Point",
    "slug": "heart-rate-control-point",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.heart_rate_control_point.yaml",
      "description": "The Heart Rate Control Point characteristic is used to enable device-specific procedures related to a heart rate sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Heart Rate Control Point",
          "anchor": "field-heart-rate-control-point",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.heart_rate_control_point/field/heart_rate_control_point}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Heart Rate Control Point",
          "key": "heart_rate_control_point",
          "anchor": "def-heart-rate-control-point",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x00",
              "description": "Reserved for Future Use"
            },
            {
              "value": "0x01",
              "description": "Reset Energy Expended\nResets the value of the Energy Expended field in the Heart Rate Measurement characteristic to 0"
            },
            {
              "value": "0x02–0xFF",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.blood_pressure_feature",
    "uuid": "0x2A49",
    "name": "Blood Pressure Feature",
    "slug": "blood-pressure-feature",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.blood_pressure_feature.yaml",
      "description": "The Blood Pressure Feature characteristic is used to represent the supported features of a blood pressure sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Blood Pressure Feature",
          "anchor": "field-blood-pressure-feature",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.blood_pressure_feature/field/blood_pressure_feature}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Blood Pressure Feature",
          "key": "blood_pressure_feature",
          "anchor": "def-blood-pressure-feature",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Body Movement Detection Support\n0 = Body Movement Detection feature not supported\n1 = Body Movement Detection feature supported"
            },
            {
              "bit": "1",
              "description": "Cuff Fit Detection Support\n0 = Cuff Fit Detection feature not supported\n1 = Cuff Fit Detection feature supported"
            },
            {
              "bit": "2",
              "description": "Irregular Pulse Detection Support\n0 = Irregular Pulse Detection feature not supported\n1 = Irregular Pulse Detection feature supported"
            },
            {
              "bit": "3",
              "description": "Pulse Rate Range Detection Support\n0 = Pulse Rate Range Detection feature not supported\n1 = Pulse Rate Range Detection feature supported"
            },
            {
              "bit": "4",
              "description": "Measurement Position Detection Support\n0 = Measurement Position Detection feature not supported\n1 = Measurement Position Detection feature supported"
            },
            {
              "bit": "5",
              "description": "Multiple Bond Support\n0 = Multiple Bonds not supported\n1 = Multiple Bonds supported"
            },
            {
              "bit": "6",
              "description": "E2E-CRC Support\n0 = E2E-CRC not supported\n1 = E2E-CRC supported"
            },
            {
              "bit": "7",
              "description": "User Data Service Support\n0 = User Data Service not supported\n1 = User Data Service supported"
            },
            {
              "bit": "8",
              "description": "User Facing Time Support\n0 = User Facing Time not supported\n1 = User Facing Time supported"
            },
            {
              "bit": "9–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.glucose_feature",
    "uuid": "0x2A51",
    "name": "Glucose Feature",
    "slug": "glucose-feature",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.glucose_feature.yaml",
      "description": "The Glucose Feature characteristic is used to represent the supported features of a glucose sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Glucose Feature",
          "anchor": "field-glucose-feature",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.glucose_feature/field/glucose_feature}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Glucose Feature",
          "key": "glucose_feature",
          "anchor": "def-glucose-feature",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Low Battery Detection During Measurement support bit:\n0 = Low Battery Detection During Measurement feature not supported\n1 = Low Battery Detection During Measurement feature supported"
            },
            {
              "bit": "1",
              "description": "Sensor Malfunction Detection support bit:\n0 = Sensor Malfunction Detection feature not supported\n1 = Sensor Malfunction Detection feature supported"
            },
            {
              "bit": "2",
              "description": "Sensor Sample Size support bit:\n0 = Sensor Sample Size feature not supported\n1 = Sensor Sample Size feature supported"
            },
            {
              "bit": "3",
              "description": "Sensor Strip Insertion Error Detection support bit:\n0 = Sensor Strip Insertion Error Detection feature not supported\n1 = Sensor Strip Insertion Error Detection feature supported"
            },
            {
              "bit": "4",
              "description": "Sensor Strip Type Error Detection support bit:\n0 = Sensor Strip Type Error Detection not supported\n1 = Sensor Strip Type Error Detection supported"
            },
            {
              "bit": "5",
              "description": "Sensor Result High-Low Detection support bit:\n0 = Sensor Result High-Low Detection not supported\n1 = Sensor Result High-Low Detection supported"
            },
            {
              "bit": "6",
              "description": "Sensor Temperature High-Low Detection support bit:\n0 = Sensor Temperature High-Low Detection not supported\n1 = Sensor Temperature High-Low Detection supported"
            },
            {
              "bit": "7",
              "description": "Sensor Read Interrupt Detection support bit:\n0 = Sensor Read Interrupt Detection not supported\n1 = Sensor Read Interrupt Detection supported"
            },
            {
              "bit": "8",
              "description": "General Device Fault support bit:\n0 = General Device Fault not supported\n1 = General Device Fault supported"
            },
            {
              "bit": "9",
              "description": "Time Fault support bit:\n0 = Time Fault not supported\n1 = Time Fault supported"
            },
            {
              "bit": "10",
              "description": "Multiple Bond support bit:\n0 = Multiple Bonds not supported\n1 = Multiple Bonds supported"
            },
            {
              "bit": "11–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.record_access_control_point",
    "uuid": "0x2A52",
    "name": "Record Access Control Point",
    "slug": "record-access-control-point",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.record_access_control_point.yaml",
      "description": "The Record Access Control Point is used to enable service-specific procedures for management of a set of data records.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Op Code",
          "anchor": "field-op-code",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.record_access_control_point/field/op_code}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Operator",
          "anchor": "field-operator",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.record_access_control_point/field/op_code} and \\autoref{sec:org.bluetooth.characteristic.record_access_control_point/field/operator}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Operand",
          "anchor": "field-operand",
          "type": "struct",
          "size": "0-18",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.record_access_control_point/field/op_code}, \\autoref{sec:org.bluetooth.characteristic.record_access_control_point/field/operator}, and \\autoref{sec:org.bluetooth.characteristic.record_access_control_point/field/operand}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Op Code",
          "key": "op_code",
          "anchor": "def-op-code",
          "description": "The Op Code values and associated Operator and Operand values are defined below.",
          "sectionTitle": null,
          "tableCaption": "Record Access Control Point Op Code Values",
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [
            "op_code_value",
            "definition",
            "operator",
            "operand",
            "description"
          ],
          "rows": [
            {
              "op_code_value": "0x00",
              "definition": "Reserved for Future Use",
              "operator": "N/A",
              "operand": "N/A",
              "description": "N/A"
            },
            {
              "op_code_value": "0x01",
              "definition": "Report stored records",
              "operator": "Value from Operator table",
              "operand": "Filter parameters (as appropriate to Operator and Service)",
              "description": "Following record transmission, the response to this control point is Op Code 0x06."
            },
            {
              "op_code_value": "0x02",
              "definition": "Delete stored records",
              "operator": "Value from Operator table",
              "operand": "Filter parameters (as appropriate to Operator and Service)",
              "description": "The response to this control point is Op Code 0x06."
            },
            {
              "op_code_value": "0x03",
              "definition": "Abort operation",
              "operator": "Null",
              "operand": "Not included",
              "description": "The response to this control point is Op Code 0x06."
            },
            {
              "op_code_value": "0x04",
              "definition": "Report number of stored records",
              "operator": "Value from Operator table",
              "operand": "Filter parameters (as appropriate to Operator and Service)",
              "description": "The normal response to this control point is Op Code 0x05. For error conditions, the response is Op Code 0x06."
            },
            {
              "op_code_value": "0x05",
              "definition": "Number of stored records response",
              "operator": "Null",
              "operand": "Number of Records (Field size defined by Service)",
              "description": "This is the normal response to Op Code 0x04. For error conditions, the response is Op Code 0x06."
            },
            {
              "op_code_value": "0x06",
              "definition": "Response Code",
              "operator": "Null",
              "operand": "Request Op Code followed by Response Code Value",
              "description": "Response to Op Codes when there is no response parameter; also used for error responses for all Op Codes (see \\autoref{sec:org.bluetooth.characteristic.record_access_control_point/field/response_code_values})."
            },
            {
              "op_code_value": "0x07",
              "definition": "Combined Report",
              "operator": "Value from Operator table",
              "operand": "Filter parameters (as appropriate to Operator and Service)",
              "description": "Following record transmission, the normal response to this control point is Op Code 0x08. For error conditions, the response is Op Code 0x06."
            },
            {
              "op_code_value": "0x08",
              "definition": "Combined Report Response",
              "operator": "Null",
              "operand": "Number of Records (Field size defined by Service)",
              "description": "This is the normal response to Op Code 0x07."
            },
            {
              "op_code_value": "0x09-0xFF",
              "definition": "Reserved for Future Use",
              "operator": "N/A",
              "operand": "N/A",
              "description": "N/A"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Operator",
          "key": "operator",
          "anchor": "def-operator",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": "Record Access Control Point Operator Values",
          "valueHeader": "Operator Value",
          "descriptionHeader": "Operand Notes",
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "definition",
            "description"
          ],
          "rows": [
            {
              "value": "0x00",
              "definition": "Null",
              "description": "Varies by Op Code"
            },
            {
              "value": "0x01",
              "definition": "All records",
              "description": "No Operand used"
            },
            {
              "value": "0x02",
              "definition": "Less than or equal to",
              "description": "Operand contains at least a maximum value"
            },
            {
              "value": "0x03",
              "definition": "Greater than or equal to",
              "description": "Operand contains at least a minimum value"
            },
            {
              "value": "0x04",
              "definition": "Within range of (inclusive)",
              "description": "Operand contains at least a minimum value, maximum value pair"
            },
            {
              "value": "0x05",
              "definition": "First record (i.e., oldest record)",
              "description": "No Operand used"
            },
            {
              "value": "0x06",
              "definition": "Last record (i.e., most recent record)",
              "description": "No Operand used"
            },
            {
              "value": "0x07-0xFF",
              "definition": "Reserved for Future Use",
              "description": "N/A"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Operand",
          "key": "operand",
          "anchor": "def-operand",
          "description": "The format and content of the Operand field is defined by the service using the Record Access Control Point.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Response Code Values",
          "key": "response_code_values",
          "anchor": "def-response-code-values",
          "description": "The Response Code Values associated with Op Code 0x06 are defined below.",
          "sectionTitle": "Response Code Values",
          "tableCaption": "Response Code Values",
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [
            "response_code_value",
            "definition",
            "description"
          ],
          "rows": [
            {
              "response_code_value": "0x00",
              "definition": "Reserved for Future Use",
              "description": "N/A"
            },
            {
              "response_code_value": "0x01",
              "definition": "Success",
              "description": "Normal response for successful operation."
            },
            {
              "response_code_value": "0x02",
              "definition": "Op Code not supported",
              "description": "Error response if unsupported Op Code is received."
            },
            {
              "response_code_value": "0x03",
              "definition": "Invalid Operator",
              "description": "Error response if Operator received does not meet the requirements of the service (e.g., Null was expected)."
            },
            {
              "response_code_value": "0x04",
              "definition": "Operator not supported",
              "description": "Error response if unsupported Operator is received."
            },
            {
              "response_code_value": "0x05",
              "definition": "Invalid Operand",
              "description": "Error response if Operand received does not meet the requirements of the service."
            },
            {
              "response_code_value": "0x06",
              "definition": "No records found",
              "description": "Error response if a request for reporting records resulted in no records meeting the criteria. When using Op Code 0x04 (Report number of stored records), Op Code 0x05 (Number of stored records response) is used with 0 as the Operand to report that zero records are found."
            },
            {
              "response_code_value": "0x07",
              "definition": "Abort unsuccessful",
              "description": "Error response if request for Abort is unsuccessful."
            },
            {
              "response_code_value": "0x08",
              "definition": "Procedure not completed",
              "description": "Error response if procedure cannot be completed for any reason."
            },
            {
              "response_code_value": "0x09",
              "definition": "Operand not supported",
              "description": "Error response if unsupported Operand is received."
            },
            {
              "response_code_value": "0x0A",
              "definition": "Server Busy",
              "description": "Error response if the server cannot process a requested function because it is busy."
            },
            {
              "response_code_value": "0x0B-0xFF",
              "definition": "Reserved for Future Use",
              "description": "N/A"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.rsc_measurement",
    "uuid": "0x2A53",
    "name": "RSC Measurement",
    "slug": "rsc-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.rsc_measurement.yaml",
      "description": "The RSC Measurement characteristic is used to represent data related to a running speed and cadence (RSC) measurement.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.rsc_measurement/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Instantaneous Speed",
          "anchor": "field-instantaneous-speed",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.velocity.metres_per_second\nRepresented values: M = 1, d = 0, b = -8\nUnit is 1/256th of a m/s",
          "units": [
            {
              "id": "org.bluetooth.unit.velocity.metres_per_second",
              "name": "velocity (metres per second)",
              "evidence": "Base Unit: org.bluetooth.unit.velocity.metres_per_second"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Instantaneous Cadence",
          "anchor": "field-instantaneous-cadence",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit is 1/min",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 3,
          "offsetVariesWith": []
        },
        {
          "name": "Instantaneous Stride Length",
          "anchor": "field-instantaneous-stride-length",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.length.metre\nRepresented values: M = 1, d = -2, b = 0\nUnit is Centimeter\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Base Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": 4,
          "offsetVariesWith": []
        },
        {
          "name": "Total Distance",
          "anchor": "field-total-distance",
          "type": "uint32",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "Base Unit: org.bluetooth.unit.length.metre\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 m\nPresent if bit 1 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Base Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Stride Length"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Instantaneous Stride Length Present"
            },
            {
              "bit": "1",
              "description": "Total Distance Present"
            },
            {
              "bit": "2",
              "description": "Walking or Running Status:\n0 = Walking\n1 = Running"
            },
            {
              "bit": "3–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.rsc_feature",
    "uuid": "0x2A54",
    "name": "RSC Feature",
    "slug": "rsc-feature",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.rsc_feature.yaml",
      "description": "The RSC Feature characteristic is used to represent the supported features of a running speed and cadence (RSC) sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "RSC Feature",
          "anchor": "field-rsc-feature",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.rsc_feature/field/rsc_feature}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "RSC Feature",
          "key": "rsc_feature",
          "anchor": "def-rsc-feature",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Instantaneous Stride Length Measurement Supported"
            },
            {
              "bit": "1",
              "description": "Total Distance Measurement Supported"
            },
            {
              "bit": "2",
              "description": "Walking or Running Status Supported"
            },
            {
              "bit": "3",
              "description": "Calibration Procedure Supported"
            },
            {
              "bit": "4",
              "description": "Multiple Sensor Locations Supported"
            },
            {
              "bit": "5–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.sc_control_point",
    "uuid": "0x2A55",
    "name": "SC Control Point",
    "slug": "sc-control-point",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.sc_control_point.yaml",
      "description": "The SC Control Point characteristic is used to enable device-specific procedures related to a speed and cadence (SC) sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Op Code",
          "anchor": "field-op-code",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.sc_control_point/field/op_code_and_parameter}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Parameter",
          "anchor": "field-parameter",
          "type": "struct",
          "size": "0–18",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.sc_control_point/field/op_code_and_parameter}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Op Code and Parameter",
          "key": "op_code_and_parameter",
          "anchor": "def-op-code-and-parameter",
          "description": "The values of these fields are defined below.",
          "sectionTitle": "Op Code and Parameter fields",
          "tableCaption": "Op Code and Parameter fields",
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [
            "op_code_value",
            "definition",
            "parameter",
            "parameter_type",
            "description"
          ],
          "rows": [
            {
              "op_code_value": "0x00",
              "definition": "Reserved for Future Use",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "N/A"
            },
            {
              "op_code_value": "0x01",
              "definition": "Set Cumulative Value",
              "parameter": "Cumulative Value as defined per service",
              "parameter_type": "Defined per service",
              "description": "Initiate the procedure to set a cumulative value. The new value is sent as parameter following op code (parameter defined per service).\nThe response to this control point is Op Code 0x10 followed by the appropriate Response Value."
            },
            {
              "op_code_value": "0x02",
              "definition": "Start Sensor Calibration",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Starts the calibration of the sensor.\nThe response to this control point is Op Code 0x10 followed by the appropriate Response Value."
            },
            {
              "op_code_value": "0x03",
              "definition": "Update Sensor Location",
              "parameter": "Sensor Location Value (See \\autoref{sec:org.bluetooth.characteristic.sensor_location/field/sensor_location})",
              "parameter_type": "uint8",
              "description": "Update to the location of the sensor with the value sent as parameter to this op code.\nThe response to this control point is Op Code 0x10 followed by the appropriate Response Value."
            },
            {
              "op_code_value": "0x04",
              "definition": "Request Supported Sensor Locations",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Request a list of supported locations for sensor attachment.\nThe response to this control point is Op Code 0x10 followed by the appropriate Response Value, including a list of supported sensor locations (See \\autoref{sec:org.bluetooth.characteristic.sensor_location}) in the Response Parameter."
            },
            {
              "op_code_value": "0x05–0x0F",
              "definition": "Reserved for Future Use",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "N/A"
            },
            {
              "op_code_value": "0x10",
              "definition": "Response Code",
              "parameter": "Request Op Code, Response Code Value",
              "parameter_type": "N/A",
              "description": "See \\autoref{sec:org.bluetooth.characteristic.sc_control_point/field/response_code_values}"
            },
            {
              "op_code_value": "0x11–0xFF",
              "definition": "Reserved for Future Use",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "N/A"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Response Code Values",
          "key": "response_code_values",
          "anchor": "def-response-code-values",
          "description": "The Response Code Values associated with the SC Control Point are defined below.",
          "sectionTitle": "Response Code Values",
          "tableCaption": "Response Code Values",
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [
            "response_code_value",
            "definition",
            "response_parameter",
            "description"
          ],
          "rows": [
            {
              "response_code_value": "0x00",
              "definition": "Reserved For Future Use",
              "response_parameter": "N/A",
              "description": "N/A"
            },
            {
              "response_code_value": "0x01",
              "definition": "Success",
              "response_parameter": "Defined per service",
              "description": "Normal response for successful operation."
            },
            {
              "response_code_value": "0x02",
              "definition": "Op Code not supported",
              "response_parameter": "N/A",
              "description": "Response if unsupported Op Code is received"
            },
            {
              "response_code_value": "0x03",
              "definition": "Invalid Operand",
              "response_parameter": "N/A",
              "description": "Response if Parameter received does not meet the requirements of the service."
            },
            {
              "response_code_value": "0x04",
              "definition": "Operation Failed",
              "response_parameter": "N/A",
              "description": "Response if the requested procedure failed."
            },
            {
              "response_code_value": "0x05–0xFF",
              "definition": "Reserved for Future Use",
              "response_parameter": "N/A",
              "description": "N/A"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.csc_measurement",
    "uuid": "0x2A5B",
    "name": "CSC Measurement",
    "slug": "csc-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.csc_measurement.yaml",
      "description": "The CSC Measurement characteristic is used to represent data related to a cycling speed and cadence (CSC) sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.csc_measurement/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Wheel Revolution Data",
          "anchor": "field-wheel-revolution-data",
          "type": "struct",
          "size": "0 or 6",
          "sizeKind": "optional",
          "sizeN": 6,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.csc_measurement/field/wheel_revolution_data}\nPresent if bit 0 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Crank Revolution Data",
          "anchor": "field-crank-revolution-data",
          "type": "struct",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.csc_measurement/field/crank_revolution_data}\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Wheel Revolution Data"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Wheel Revolution Data Present"
            },
            {
              "bit": "1",
              "description": "Crank Revolution Data Present"
            },
            {
              "bit": "2–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Wheel Revolution Data",
          "key": "wheel_revolution_data",
          "anchor": "def-wheel-revolution-data",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Cumulative Wheel Revolutions",
              "data_type": "uint32",
              "size": "4",
              "description": "Unit: org.bluetooth.unitless"
            },
            {
              "field": "Last Wheel Event Time",
              "data_type": "uint16",
              "size": "2",
              "description": "Base Unit: org.bluetooth.unit.time.second\nRepresented values: M = 1, d = 0, b = -10\nUnit is 1/1024th of a second"
            }
          ],
          "layout": [
            {
              "name": "Cumulative Wheel Revolutions",
              "anchor": "def-wheel-revolution-data--cumulative-wheel-revolutions",
              "type": "uint32",
              "size": "4",
              "sizeKind": "fixed",
              "sizeN": 4,
              "units": [
                {
                  "id": "org.bluetooth.unitless",
                  "name": null,
                  "evidence": "Unit: org.bluetooth.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Last Wheel Event Time",
              "anchor": "def-wheel-revolution-data--last-wheel-event-time",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.time.second",
                  "name": "time (second)",
                  "evidence": "Base Unit: org.bluetooth.unit.time.second"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 4,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        },
        {
          "name": "Crank Revolution Data",
          "key": "crank_revolution_data",
          "anchor": "def-crank-revolution-data",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Cumulative Crank Revolutions",
              "data_type": "uint16",
              "size": "2",
              "description": "Unit: org.bluetooth.unitless"
            },
            {
              "field": "Last Crank Event Time",
              "data_type": "uint16",
              "size": "2",
              "description": "Base Unit: org.bluetooth.unit.time.second\nRepresented values: M = 1, d = 0, b = -10\nUnit is 1/1024 second"
            }
          ],
          "layout": [
            {
              "name": "Cumulative Crank Revolutions",
              "anchor": "def-crank-revolution-data--cumulative-crank-revolutions",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unitless",
                  "name": null,
                  "evidence": "Unit: org.bluetooth.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Last Crank Event Time",
              "anchor": "def-crank-revolution-data--last-crank-event-time",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.time.second",
                  "name": "time (second)",
                  "evidence": "Base Unit: org.bluetooth.unit.time.second"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 2,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.csc_feature",
    "uuid": "0x2A5C",
    "name": "CSC Feature",
    "slug": "csc-feature",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.csc_feature.yaml",
      "description": "The CSC Feature characteristic is used to represent the supported features of a cycling speed and cadence (CSC) sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "CSC Feature",
          "anchor": "field-csc-feature",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.csc_feature/field/csc_feature}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "CSC Feature",
          "key": "csc_feature",
          "anchor": "def-csc-feature",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Wheel Revolution Data Supported"
            },
            {
              "bit": "1",
              "description": "Crank Revolution Data Supported"
            },
            {
              "bit": "2",
              "description": "Multiple Sensor Locations Supported"
            },
            {
              "bit": "3–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.sensor_location",
    "uuid": "0x2A5D",
    "name": "Sensor Location",
    "slug": "sensor-location",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.sc_control_point"
    ],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.sensor_location.yaml",
      "description": "The Sensor Location characteristic is used to represent the location of the sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Sensor Location",
          "anchor": "field-sensor-location",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.sensor_location/field/sensor_location}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Sensor Location",
          "key": "sensor_location",
          "anchor": "def-sensor-location",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0",
              "description": "Other"
            },
            {
              "value": "1",
              "description": "Top of shoe"
            },
            {
              "value": "2",
              "description": "In shoe"
            },
            {
              "value": "3",
              "description": "Hip"
            },
            {
              "value": "4",
              "description": "Front Wheel"
            },
            {
              "value": "5",
              "description": "Left Crank"
            },
            {
              "value": "6",
              "description": "Right Crank"
            },
            {
              "value": "7",
              "description": "Left Pedal"
            },
            {
              "value": "8",
              "description": "Right Pedal"
            },
            {
              "value": "9",
              "description": "Front Hub"
            },
            {
              "value": "10",
              "description": "Rear Dropout"
            },
            {
              "value": "11",
              "description": "Chainstay"
            },
            {
              "value": "12",
              "description": "Rear Wheel"
            },
            {
              "value": "13",
              "description": "Rear Hub"
            },
            {
              "value": "14",
              "description": "Chest"
            },
            {
              "value": "15",
              "description": "Spider"
            },
            {
              "value": "16",
              "description": "Chain Ring"
            },
            {
              "value": "17–255",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.plx_spot_check_measurement",
    "uuid": "0x2A5E",
    "name": "PLX Spot-Check Measurement",
    "slug": "plx-spot-check-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": null
  },
  {
    "id": "org.bluetooth.characteristic.plx_continuous_measurement",
    "uuid": "0x2A5F",
    "name": "PLX Continuous Measurement",
    "slug": "plx-continuous-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": null
  },
  {
    "id": "org.bluetooth.characteristic.plx_features",
    "uuid": "0x2A60",
    "name": "PLX Features",
    "slug": "plx-features",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": null
  },
  {
    "id": "org.bluetooth.characteristic.cycling_power_measurement",
    "uuid": "0x2A63",
    "name": "Cycling Power Measurement",
    "slug": "cycling-power-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cycling_power_measurement.yaml",
      "description": "The Cycling Power Measurement characteristic is used to represent data related to a cycling power sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_measurement/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Instantaneous Power",
          "anchor": "field-instantaneous-power",
          "type": "sint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Pedal Power Balance",
          "anchor": "field-pedal-power-balance",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.percentage\nRepresented values: M = 1, d = 0, b = -1\nUnit is 1/2 of a percent\nPresent if bit 0 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Base Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": 4,
          "offsetVariesWith": []
        },
        {
          "name": "Accumulated Torque",
          "anchor": "field-accumulated-torque",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.moment_of_force.newton_metre\nRepresented values: M = 1, d = 0, b = -5\nUnit is 1/32 Newton meter\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.moment_of_force.newton_metre",
              "name": "moment of force (newton metre)",
              "evidence": "Base Unit: org.bluetooth.unit.moment_of_force.newton_metre"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Pedal Power Balance"
          ]
        },
        {
          "name": "Wheel Revolution Data",
          "anchor": "field-wheel-revolution-data",
          "type": "struct",
          "size": "0 or 6",
          "sizeKind": "optional",
          "sizeN": 6,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_measurement/field/wheel_revolution_data}\nPresent if bit 4 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Pedal Power Balance",
            "Accumulated Torque"
          ]
        },
        {
          "name": "Crank Revolution Data",
          "anchor": "field-crank-revolution-data",
          "type": "struct",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_measurement/field/crank_revolution_data}\nPresent if bit 5 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Pedal Power Balance",
            "Accumulated Torque",
            "Wheel Revolution Data"
          ]
        },
        {
          "name": "Extreme Force Magnitudes",
          "anchor": "field-extreme-force-magnitudes",
          "type": "struct",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_measurement/field/extreme_force_magnitudes}\nPresent if bit 6 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 6 of Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Pedal Power Balance",
            "Accumulated Torque",
            "Wheel Revolution Data",
            "Crank Revolution Data"
          ]
        },
        {
          "name": "Extreme Torque Magnitudes",
          "anchor": "field-extreme-torque-magnitudes",
          "type": "struct",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_measurement/field/extreme_torque_magnitudes}\nPresent if bit 7 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Pedal Power Balance",
            "Accumulated Torque",
            "Wheel Revolution Data",
            "Crank Revolution Data",
            "Extreme Force Magnitudes"
          ]
        },
        {
          "name": "Extreme Angles",
          "anchor": "field-extreme-angles",
          "type": "struct",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_measurement/field/extreme_angles}\nPresent if bit 8 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Pedal Power Balance",
            "Accumulated Torque",
            "Wheel Revolution Data",
            "Crank Revolution Data",
            "Extreme Force Magnitudes",
            "Extreme Torque Magnitudes"
          ]
        },
        {
          "name": "Top Dead Spot Angle",
          "anchor": "field-top-dead-spot-angle",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_measurement/field/top_and_bottom_dead_spot_angles}\nUnit: org.bluetooth.unit.plane_angle.degree\nPresent if bit 9 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.plane_angle.degree",
              "name": "plane angle (degree)",
              "evidence": "Unit: org.bluetooth.unit.plane_angle.degree"
            }
          ],
          "presenceText": "Present if bit 9 of Flags field is set to 1",
          "presence": {
            "bit": 9,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 9 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Pedal Power Balance",
            "Accumulated Torque",
            "Wheel Revolution Data",
            "Crank Revolution Data",
            "Extreme Force Magnitudes",
            "Extreme Torque Magnitudes",
            "Extreme Angles"
          ]
        },
        {
          "name": "Bottom Dead Spot Angle",
          "anchor": "field-bottom-dead-spot-angle",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_measurement/field/top_and_bottom_dead_spot_angles}\nUnit: org.bluetooth.unit.plane_angle.degree\nPresent if bit 10 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.plane_angle.degree",
              "name": "plane angle (degree)",
              "evidence": "Unit: org.bluetooth.unit.plane_angle.degree"
            }
          ],
          "presenceText": "Present if bit 10 of Flags field is set to 1",
          "presence": {
            "bit": 10,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 10 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Pedal Power Balance",
            "Accumulated Torque",
            "Wheel Revolution Data",
            "Crank Revolution Data",
            "Extreme Force Magnitudes",
            "Extreme Torque Magnitudes",
            "Extreme Angles",
            "Top Dead Spot Angle"
          ]
        },
        {
          "name": "Accumulated Energy",
          "anchor": "field-accumulated-energy",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.energy.joule\nRepresented values: M = 1, d = 3, b = 0\nUnit is kilojoule\nPresent if bit 11 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.joule",
              "name": "energy (joule)",
              "evidence": "Base Unit: org.bluetooth.unit.energy.joule"
            }
          ],
          "presenceText": "Present if bit 11 of Flags field is set to 1",
          "presence": {
            "bit": 11,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 11 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Pedal Power Balance",
            "Accumulated Torque",
            "Wheel Revolution Data",
            "Crank Revolution Data",
            "Extreme Force Magnitudes",
            "Extreme Torque Magnitudes",
            "Extreme Angles",
            "Top Dead Spot Angle",
            "Bottom Dead Spot Angle"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Pedal Power Balance Present"
            },
            {
              "bit": "1",
              "description": "Pedal Power Balance Reference\n0 = Unknown\n1 = Left"
            },
            {
              "bit": "2",
              "description": "Accumulated Torque Present"
            },
            {
              "bit": "3",
              "description": "Accumulated Torque Source\n0 = Wheel based\n1 = Crank based"
            },
            {
              "bit": "4",
              "description": "Wheel Revolution Data Present"
            },
            {
              "bit": "5",
              "description": "Crank Revolution Data Present"
            },
            {
              "bit": "6",
              "description": "Extreme Force Magnitudes Present"
            },
            {
              "bit": "7",
              "description": "Extreme Torque Magnitudes Present"
            },
            {
              "bit": "8",
              "description": "Extreme Angles Present"
            },
            {
              "bit": "9",
              "description": "Top Dead Spot Angle Present"
            },
            {
              "bit": "10",
              "description": "Bottom Dead Spot Angle Present"
            },
            {
              "bit": "11",
              "description": "Accumulated Energy Present"
            },
            {
              "bit": "12",
              "description": "Offset Compensation Indicator\n0 = False\n1 = True"
            },
            {
              "bit": "13–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Wheel Revolution Data",
          "key": "wheel_revolution_data",
          "anchor": "def-wheel-revolution-data",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Cumulative Wheel Revolutions",
              "data_type": "uint32",
              "size": "4",
              "description": "Unit: org.bluetooth.unit.unitless"
            },
            {
              "field": "Last Wheel Event Time",
              "data_type": "uint16",
              "size": "2",
              "description": "Base Unit: org.bluetooth.unit.time.second\nRepresented values: M = 1, d = 0, b = -11\nUnit is 1/2048 second"
            }
          ],
          "layout": [
            {
              "name": "Cumulative Wheel Revolutions",
              "anchor": "def-wheel-revolution-data--cumulative-wheel-revolutions",
              "type": "uint32",
              "size": "4",
              "sizeKind": "fixed",
              "sizeN": 4,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Last Wheel Event Time",
              "anchor": "def-wheel-revolution-data--last-wheel-event-time",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.time.second",
                  "name": "time (second)",
                  "evidence": "Base Unit: org.bluetooth.unit.time.second"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 4,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        },
        {
          "name": "Crank Revolution Data",
          "key": "crank_revolution_data",
          "anchor": "def-crank-revolution-data",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Cumulative Crank Revolutions",
              "data_type": "uint16",
              "size": "2",
              "description": "Unit: org.bluetooth.unit.unitless"
            },
            {
              "field": "Last Crank Event Time",
              "data_type": "uint16",
              "size": "2",
              "description": "Base Unit: org.bluetooth.unit.time.second\nRepresented values: M = 1, d = 0, b = -10\nUnit is 1/1024 second"
            }
          ],
          "layout": [
            {
              "name": "Cumulative Crank Revolutions",
              "anchor": "def-crank-revolution-data--cumulative-crank-revolutions",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Last Crank Event Time",
              "anchor": "def-crank-revolution-data--last-crank-event-time",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.time.second",
                  "name": "time (second)",
                  "evidence": "Base Unit: org.bluetooth.unit.time.second"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 2,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        },
        {
          "name": "Extreme Force Magnitudes",
          "key": "extreme_force_magnitudes",
          "anchor": "def-extreme-force-magnitudes",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Maximum Force Magnitude",
              "data_type": "sint16",
              "size": "2",
              "description": "Unit: org.bluetooth.unit.force.newton"
            },
            {
              "field": "Minimum Force Magnitude",
              "data_type": "sint16",
              "size": "2",
              "description": "Unit: org.bluetooth.unit.force.newton"
            }
          ],
          "layout": [
            {
              "name": "Maximum Force Magnitude",
              "anchor": "def-extreme-force-magnitudes--maximum-force-magnitude",
              "type": "sint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.force.newton",
                  "name": "force (newton)",
                  "evidence": "Unit: org.bluetooth.unit.force.newton"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Minimum Force Magnitude",
              "anchor": "def-extreme-force-magnitudes--minimum-force-magnitude",
              "type": "sint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.force.newton",
                  "name": "force (newton)",
                  "evidence": "Unit: org.bluetooth.unit.force.newton"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 2,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        },
        {
          "name": "Extreme Torque Magnitudes",
          "key": "extreme_torque_magnitudes",
          "anchor": "def-extreme-torque-magnitudes",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Maximum Torque Magnitude",
              "data_type": "sint16",
              "size": "2",
              "description": "Base Unit: org.bluetooth.unit.moment_of_force.newton_metre\nRepresented values: M = 1, d = 0, b = -5\nUnit is 1/32 Newton meter"
            },
            {
              "field": "Minimum Torque Magnitude",
              "data_type": "sint16",
              "size": "2",
              "description": "Base Unit: org.bluetooth.unit.moment_of_force.newton_metre\nRepresented values: M = 1, d = 0, b = -5\nUnit is 1/32 Newton meter"
            }
          ],
          "layout": [
            {
              "name": "Maximum Torque Magnitude",
              "anchor": "def-extreme-torque-magnitudes--maximum-torque-magnitude",
              "type": "sint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.moment_of_force.newton_metre",
                  "name": "moment of force (newton metre)",
                  "evidence": "Base Unit: org.bluetooth.unit.moment_of_force.newton_metre"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Minimum Torque Magnitude",
              "anchor": "def-extreme-torque-magnitudes--minimum-torque-magnitude",
              "type": "sint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.moment_of_force.newton_metre",
                  "name": "moment of force (newton metre)",
                  "evidence": "Base Unit: org.bluetooth.unit.moment_of_force.newton_metre"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 2,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        },
        {
          "name": "Extreme Angles",
          "key": "extreme_angles",
          "anchor": "def-extreme-angles",
          "description": "When observed with the front wheel to the right of the pedals, a value of 0 degrees represents the angle when the crank is in the 12 o'clock position and a value of 90 degrees represents the angle, measured clockwise, when the crank points towards the front wheel in the 3 o'clock position. The left crank sensor (if fitted) detects 0 degrees when the crank it is attached to is in the 12 o'clock position, and the right sensor (if fitted) detects 0 degrees when the crank it is attached to is in the 12 o'clock position; thus, there is a constant 180-degree difference between the right crank and the left crank position signals.\nWhen present, both subfields \"Extreme Angles - Minimum Angle\" and \"Extreme Angles - Maximum Angle\" are always present as a pair and are concatenated into a uint24 value (3 octets). As an example, if the Maximum Angle is 0xABC and the Minimum Angle is 0x123, the field value is represented as 0x123ABC.\nThe structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": true,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Maximum Angle",
              "data_type": "uint12",
              "size": "12",
              "description": "Unit: org.bluetooth.unit.plane_angle.degree"
            },
            {
              "field": "Minimum Angle",
              "data_type": "uint12",
              "size": "12",
              "description": "Unit: org.bluetooth.unit.plane_angle.degree"
            }
          ],
          "layout": [
            {
              "name": "Maximum Angle",
              "anchor": "def-extreme-angles--maximum-angle",
              "type": "uint12",
              "size": "12",
              "sizeKind": "fixed",
              "sizeN": 12,
              "units": [
                {
                  "id": "org.bluetooth.unit.plane_angle.degree",
                  "name": "plane angle (degree)",
                  "evidence": "Unit: org.bluetooth.unit.plane_angle.degree"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Minimum Angle",
              "anchor": "def-extreme-angles--minimum-angle",
              "type": "uint12",
              "size": "12",
              "sizeKind": "fixed",
              "sizeN": 12,
              "units": [
                {
                  "id": "org.bluetooth.unit.plane_angle.degree",
                  "name": "plane angle (degree)",
                  "evidence": "Unit: org.bluetooth.unit.plane_angle.degree"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 12,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        },
        {
          "name": "Top and Bottom Dead Spot Angles",
          "key": "top_and_bottom_dead_spot_angles",
          "anchor": "def-top-and-bottom-dead-spot-angles",
          "description": "When observed with the front wheel to the right of the pedals, a value of 0 degrees represents the angle when the crank is in the 12 o'clock position and a value of 90 degrees represents the angle, measured clockwise, when the crank points towards the front wheel in the 3 o'clock position. The left crank sensor (if fitted) detects 0 degrees when the crank it is attached to is in the 12 o'clock position, and the right sensor (if fitted) detects 0 degrees when the crank it is attached to is in the 12 o'clock position; thus, there is a constant 180-degree difference between the right crank and the left crank position signals.",
          "sectionTitle": "Top and Bottom Dead Spot Angles fields",
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.cycling_power_vector",
    "uuid": "0x2A64",
    "name": "Cycling Power Vector",
    "slug": "cycling-power-vector",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cycling_power_vector.yaml",
      "description": "The Cycling Power Vector characteristic is used to represent power vector data related to a cycling power sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_vector/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Crank Revolution Data",
          "anchor": "field-crank-revolution-data",
          "type": "struct",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_vector/field/crank_revolution_data}\nPresent if bit 0 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "First Crank Measurement Angle",
          "anchor": "field-first-crank-measurement-angle",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_vector/field/first_crank_measurement_angle}\nUnit: org.bluetooth.unit.plane_angle.degree\nPresent if bit 1 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.plane_angle.degree",
              "name": "plane angle (degree)",
              "evidence": "Unit: org.bluetooth.unit.plane_angle.degree"
            }
          ],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Crank Revolution Data"
          ]
        },
        {
          "name": "Instantaneous Force Magnitude Array",
          "anchor": "field-instantaneous-force-magnitude-array",
          "type": "sint16 [0–9]",
          "size": "0–18",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "Unit: org.bluetooth.unit.force.newton\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.force.newton",
              "name": "force (newton)",
              "evidence": "Unit: org.bluetooth.unit.force.newton"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Crank Revolution Data",
            "First Crank Measurement Angle"
          ]
        },
        {
          "name": "Instantaneous Torque Magnitude Array",
          "anchor": "field-instantaneous-torque-magnitude-array",
          "type": "sint16 [0–9]",
          "size": "0–18",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "Base Unit: org.bluetooth.unit.moment_of_force.newton_metre\nRepresented values: M = 1, d = 0, b = -5\nUnit is 1/32 Newton meter\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.moment_of_force.newton_metre",
              "name": "moment of force (newton metre)",
              "evidence": "Base Unit: org.bluetooth.unit.moment_of_force.newton_metre"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Crank Revolution Data",
            "First Crank Measurement Angle",
            "Instantaneous Force Magnitude Array"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Crank Revolution Data Present"
            },
            {
              "bit": "1",
              "description": "First Crank Measurement Angle Present"
            },
            {
              "bit": "2",
              "description": "Instantaneous Force Magnitude Array Present"
            },
            {
              "bit": "3",
              "description": "Instantaneous Torque Magnitude Array Present"
            },
            {
              "bit": "4–5",
              "description": "Instantaneous Measurement Direction\n0b00 = Unknown\n0b01 = Tangential Component\n0b10 = Radial Component\n0b11 = Lateral Component"
            },
            {
              "bit": "6–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Crank Revolution Data",
          "key": "crank_revolution_data",
          "anchor": "def-crank-revolution-data",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Cumulative Crank Revolutions",
              "data_type": "uint16",
              "size": "2",
              "description": "Unit: org.bluetooth.unit.unitless"
            },
            {
              "field": "Last Crank Event Time",
              "data_type": "uint16",
              "size": "2",
              "description": "Base Unit: org.bluetooth.unit.time.second\nRepresented values: M = 1, d = 0, b = -10\nUnit is 1/1024 second"
            }
          ],
          "layout": [
            {
              "name": "Cumulative Crank Revolutions",
              "anchor": "def-crank-revolution-data--cumulative-crank-revolutions",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Last Crank Event Time",
              "anchor": "def-crank-revolution-data--last-crank-event-time",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.time.second",
                  "name": "time (second)",
                  "evidence": "Base Unit: org.bluetooth.unit.time.second"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 2,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        },
        {
          "name": "First Crank Measurement Angle",
          "key": "first_crank_measurement_angle",
          "anchor": "def-first-crank-measurement-angle",
          "description": "When observed with the front wheel to the right of the pedals, a value of 0 degrees represents the angle when the crank is in the 12 o'clock position and a value of 90 degrees represents the angle, measured clockwise, when the crank points towards the front wheel in a 3 o'clock position. The left crank sensor (if fitted) detects the 0° when the crank it is attached to is in the 12 o'clock position and the right sensor (if fitted) detects the 0° when the crank it is attached to is in its 12 o'clock position; thus, there is a constant 180° difference between the right crank and the left crank position signals.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.cycling_power_feature",
    "uuid": "0x2A65",
    "name": "Cycling Power Feature",
    "slug": "cycling-power-feature",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cycling_power_feature.yaml",
      "description": "The Cycling Power Feature characteristic is used to represent the supported features of a cycling power sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Cycling Power Feature",
          "anchor": "field-cycling-power-feature",
          "type": "boolean[32]",
          "size": "4",
          "sizeKind": "fixed",
          "sizeN": 4,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_feature/field/cycling_power_feature}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Cycling Power Feature",
          "key": "cycling_power_feature",
          "anchor": "def-cycling-power-feature",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Pedal Power Balance Supported"
            },
            {
              "bit": "1",
              "description": "Accumulated Torque Supported"
            },
            {
              "bit": "2",
              "description": "Wheel Revolution Data Supported"
            },
            {
              "bit": "3",
              "description": "Crank Revolution Data Supported"
            },
            {
              "bit": "4",
              "description": "Extreme Magnitudes Supported"
            },
            {
              "bit": "5",
              "description": "Extreme Angles Supported"
            },
            {
              "bit": "6",
              "description": "Top and Bottom Dead Spot Angles Supported"
            },
            {
              "bit": "7",
              "description": "Accumulated Energy Supported"
            },
            {
              "bit": "8",
              "description": "Offset Compensation Indicator Supported"
            },
            {
              "bit": "9",
              "description": "Offset Compensation Supported"
            },
            {
              "bit": "10",
              "description": "Cycling Power Measurement Characteristic Content Masking Supported"
            },
            {
              "bit": "11",
              "description": "Multiple Sensor Locations Supported"
            },
            {
              "bit": "12",
              "description": "Crank Length Adjustment Supported"
            },
            {
              "bit": "13",
              "description": "Chain Length Adjustment Supported"
            },
            {
              "bit": "14",
              "description": "Chain Weight Adjustment Supported"
            },
            {
              "bit": "15",
              "description": "Span Length Adjustment Supported"
            },
            {
              "bit": "16",
              "description": "Sensor Measurement Context\n0 = Force based\n1 = Torque based"
            },
            {
              "bit": "17",
              "description": "Instantaneous Measurement Direction Supported"
            },
            {
              "bit": "18",
              "description": "Factory Calibration Date Supported"
            },
            {
              "bit": "19",
              "description": "Enhanced Offset Compensation Procedure Supported"
            },
            {
              "bit": "20–21",
              "description": "Distributed System Support\n0b00 = Unspecified (Legacy Sensor)\n0b01 = Not for use in a distributed system\n0b10 = For use in a distributed system\n0b11 = Reserved for Future Use"
            },
            {
              "bit": "22–31",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.cycling_power_control_point",
    "uuid": "0x2A66",
    "name": "Cycling Power Control Point",
    "slug": "cycling-power-control-point",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cycling_power_control_point.yaml",
      "description": "The Cycling Power Control Point characteristic is used to enable device-specific procedures related to a cycling power sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Op Code",
          "anchor": "field-op-code",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_control_point/field/op_code_and_parameter}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Parameter",
          "anchor": "field-parameter",
          "type": "struct",
          "size": "0–18",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_control_point/field/op_code_and_parameter}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Op Code and Parameter",
          "key": "op_code_and_parameter",
          "anchor": "def-op-code-and-parameter",
          "description": "The values of these fields are defined below.",
          "sectionTitle": "Op Code and Parameter fields",
          "tableCaption": "Op Code and Parameter fields",
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [
            "op_code_value",
            "definition",
            "parameter",
            "parameter_type",
            "description"
          ],
          "rows": [
            {
              "op_code_value": "0x00",
              "definition": "Reserved for Future Use",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "N/A"
            },
            {
              "op_code_value": "0x01",
              "definition": "Set Cumulative Value",
              "parameter": "Cumulative Value (defined per service)",
              "parameter_type": "Defined per service",
              "description": "Initiate the procedure to set a cumulative value. The new value is sent as parameter following op code (parameter defined per service).\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value."
            },
            {
              "op_code_value": "0x02",
              "definition": "Update Sensor Location",
              "parameter": "Sensor Location Value (defined per service)",
              "parameter_type": "uint8",
              "description": "Update to the location of the sensor with the value sent as parameter to this op code.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value."
            },
            {
              "op_code_value": "0x03",
              "definition": "Request Supported Sensor Locations",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Request a list of supported locations for sensor attachment.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value, including a list of supported sensor locations in the Response Parameter."
            },
            {
              "op_code_value": "0x04",
              "definition": "Set Crank Length",
              "parameter": "Crank Length Value (defined per service)",
              "parameter_type": "Defined per service",
              "description": "Initiate the procedure to set the crank length value to Sensor. The new value is sent as a parameter with preceding Op Code 0x04 operand.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value."
            },
            {
              "op_code_value": "0x05",
              "definition": "Request Crank Length",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Request the current crank length value set in the Sensor.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value, including the value of the crank length in the Response Parameter."
            },
            {
              "op_code_value": "0x06",
              "definition": "Set Chain Length",
              "parameter": "Chain Length Value (defined per service)",
              "parameter_type": "Defined per service",
              "description": "Initiate the procedure to set the chain length value to Sensor. The new value is sent as a parameter with preceding Op Code 0x06 operand.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value."
            },
            {
              "op_code_value": "0x07",
              "definition": "Request Chain Length",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Request the current chain length value set in the Sensor.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value, including the value of the chain length in the Response Parameter."
            },
            {
              "op_code_value": "0x08",
              "definition": "Set Chain Weight",
              "parameter": "Chain Weight Value (defined per service)",
              "parameter_type": "Defined per service",
              "description": "Initiate the procedure to set the chain weight value to Sensor. The new value is sent as a parameter with preceding Op Code 0x08 operand.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value."
            },
            {
              "op_code_value": "0x09",
              "definition": "Request Chain Weight",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Request the current chain weight value set in the Sensor.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value, including the value of the chain weight in the Response Parameter."
            },
            {
              "op_code_value": "0x0A",
              "definition": "Set Span Length",
              "parameter": "Span Length Value (defined per service)",
              "parameter_type": "Defined per service",
              "description": "Initiate the procedure to set the span length value to Sensor. The new value is sent as a parameter with preceding Op Code 0x0A operand.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value."
            },
            {
              "op_code_value": "0x0B",
              "definition": "Request Span Length",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Request the current span length value set in the Sensor.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value, including the value of the span length in the Response Parameter."
            },
            {
              "op_code_value": "0x0C",
              "definition": "Start Offset Compensation",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Starts the offset compensation process of the Sensor.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value, including the value of the raw force or a raw torque in the Response Parameter (defined per service)."
            },
            {
              "op_code_value": "0x0D",
              "definition": "Mask Cycling Power Measurement Characteristic Content",
              "parameter": "Content Mask (defined per service)",
              "parameter_type": "Defined per service",
              "description": "Initiate the procedure to set the content of the Cycling Power Measurement characteristic.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value."
            },
            {
              "op_code_value": "0x0E",
              "definition": "Request Sampling Rate",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Request the sampling rate value set in the Sensor.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value, including the value of the sampling rate in the Response Parameter."
            },
            {
              "op_code_value": "0x0F",
              "definition": "Request Factory Calibration Date",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Request the Factory calibration date set in the Sensor.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value, including the value of the Factory calibration date in the Response Parameter."
            },
            {
              "op_code_value": "0x10",
              "definition": "Start Enhanced Offset Compensation",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "Starts the offset compensation process of the Sensor.\nThe response to this control point is Op Code 0x20 followed by the appropriate Response Value, including the value of the raw force or a raw torque in the Response Parameter and an option for a manufacturer specific value (defined per service)."
            },
            {
              "op_code_value": "0x11–0x1F",
              "definition": "Reserved for Future Use",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "N/A"
            },
            {
              "op_code_value": "0x20",
              "definition": "Response Code",
              "parameter": "Request Op Code, Response Code Value, Response Parameter",
              "parameter_type": "N/A",
              "description": "See \\autoref{sec:org.bluetooth.characteristic.cycling_power_control_point/field/response_code_values}"
            },
            {
              "op_code_value": "0x21–0xFF",
              "definition": "Reserved for Future Use",
              "parameter": "N/A",
              "parameter_type": "N/A",
              "description": "N/A"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Response Code Values",
          "key": "response_code_values",
          "anchor": "def-response-code-values",
          "description": "The Response Code Values associated with the Cycling Power Control Point are defined below.",
          "sectionTitle": "Response Code Values",
          "tableCaption": "Response Code Values",
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [
            "response_code_value",
            "definition",
            "response_parameter",
            "description"
          ],
          "rows": [
            {
              "response_code_value": "0x00",
              "definition": "Reserved For Future Use",
              "response_parameter": "N/A",
              "description": "N/A"
            },
            {
              "response_code_value": "0x01",
              "definition": "Success",
              "response_parameter": "Defined per service",
              "description": "Normal response for successful operation."
            },
            {
              "response_code_value": "0x02",
              "definition": "Op Code not supported",
              "response_parameter": "N/A",
              "description": "Response if unsupported Op Code is received"
            },
            {
              "response_code_value": "0x03",
              "definition": "Invalid Operand",
              "response_parameter": "N/A",
              "description": "Response if Parameter received does not meet the requirements of the service."
            },
            {
              "response_code_value": "0x04",
              "definition": "Operation Failed",
              "response_parameter": "Defined per service",
              "description": "Response if the requested procedure failed."
            },
            {
              "response_code_value": "0x05–0xFF",
              "definition": "Reserved for Future Use",
              "response_parameter": "N/A",
              "description": "N/A"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.aerobic_heart_rate_lower_limit",
    "uuid": "0x2A7E",
    "name": "Aerobic Heart Rate Lower Limit",
    "slug": "aerobic-heart-rate-lower-limit",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.aerobic_heart_rate_lower_limit.yaml",
      "description": "The Aerobic Heart Rate Lower Limit characteristic is used to represent the desired lower limit of the heart rate, where a user enhances his or her endurance while exercising.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Aerobic Heart Rate Lower Limit",
          "anchor": "field-aerobic-heart-rate-lower-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.aerobic_threshold",
    "uuid": "0x2A7F",
    "name": "Aerobic Threshold",
    "slug": "aerobic-threshold",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.aerobic_threshold.yaml",
      "description": "The Aerobic Threshold characteristic is used to represent the aerobic threshold of a user. Aerobic Threshold and Anaerobic Threshold characteristics together with the Sport Type For Aerobic And Anaerobic Thresholds characteristic describe the metabolic thresholds of the user. The Sport Type For Aerobic And Anaerobic Thresholds characteristic value identifies how the measurement was performed.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Aerobic Threshold",
          "anchor": "field-aerobic-threshold",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.age",
    "uuid": "0x2A80",
    "name": "Age",
    "slug": "age",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.age.yaml",
      "description": "The Age characteristic is used to represent the age of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Age",
          "anchor": "field-age",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.time.year",
          "units": [
            {
              "id": "org.bluetooth.unit.time.year",
              "name": "time (year)",
              "evidence": "Unit: org.bluetooth.unit.time.year"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.anaerobic_heart_rate_lower_limit",
    "uuid": "0x2A81",
    "name": "Anaerobic Heart Rate Lower Limit",
    "slug": "anaerobic-heart-rate-lower-limit",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.anaerobic_heart_rate_lower_limit.yaml",
      "description": "The Anaerobic Heart Rate Lower Limit characteristic is used to represent the desired lower limit of the heart rate, where a user enhances his or her anaerobic tolerance while exercising.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Anaerobic Heart Rate Lower Limit",
          "anchor": "field-anaerobic-heart-rate-lower-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.anaerobic_heart_rate_upper_limit",
    "uuid": "0x2A82",
    "name": "Anaerobic Heart Rate Upper Limit",
    "slug": "anaerobic-heart-rate-upper-limit",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.anaerobic_heart_rate_upper_limit.yaml",
      "description": "The Anaerobic Heart Rate Upper Limit characteristic is used to represent the desired upper limit of the heart rate, where a user enhances his or her anaerobic tolerance while exercising.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Anaerobic Heart Rate Upper Limit",
          "anchor": "field-anaerobic-heart-rate-upper-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.anaerobic_threshold",
    "uuid": "0x2A83",
    "name": "Anaerobic Threshold",
    "slug": "anaerobic-threshold",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.anaerobic_threshold.yaml",
      "description": "The Anaerobic Threshold characteristic is used to represent the anaerobic threshold of a user. The Aerobic Threshold and Anaerobic Threshold characteristics together with the Sport Type For Aerobic And Anaerobic Thresholds characteristic describe the metabolic thresholds of the user. The Sport Type For Aerobic And Anaerobic Thresholds characteristic value identifies how the measurement was performed.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Anaerobic Threshold",
          "anchor": "field-anaerobic-threshold",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.aerobic_heart_rate_upper_limit",
    "uuid": "0x2A84",
    "name": "Aerobic Heart Rate Upper Limit",
    "slug": "aerobic-heart-rate-upper-limit",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.aerobic_heart_rate_upper_limit.yaml",
      "description": "The Aerobic Heart Rate Upper Limit characteristic is used to represent the desired upper limit of the heart rate, where a user enhances his or her endurance while exercising.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Aerobic Heart Rate Upper Limit",
          "anchor": "field-aerobic-heart-rate-upper-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.date_of_birth",
    "uuid": "0x2A85",
    "name": "Date of Birth",
    "slug": "date-of-birth",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.date_of_birth.yaml",
      "description": "The Date of Birth characteristic is used to represent the date of birth of a user as defined by the Gregorian calendar.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Year",
          "anchor": "field-year",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.year \nThe Year is an integer value. \nMinimum value: 1582 \nMaximum value: 9999 \nIn addition to the above range, a special value is defined: 0 = Year is not known",
          "units": [
            {
              "id": "org.bluetooth.unit.time.year",
              "name": "time (year)",
              "evidence": "Unit: org.bluetooth.unit.time.year"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Month",
          "anchor": "field-month",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.date_of_birth/field/month}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Day",
          "anchor": "field-day",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.time.day  \nThe Day is an integer value.  \nMinimum value: 1 \nMaximum value: 31  \nIn addition to the above range, a special value is defined: 0 = Day of Month is not known",
          "units": [
            {
              "id": "org.bluetooth.unit.time.day",
              "name": "time (day)",
              "evidence": "Unit: org.bluetooth.unit.time.day"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 3,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Month",
          "key": "month",
          "anchor": "def-month",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0",
              "description": "Month is not known"
            },
            {
              "value": "1",
              "description": "January"
            },
            {
              "value": "2",
              "description": "February"
            },
            {
              "value": "3",
              "description": "March"
            },
            {
              "value": "4",
              "description": "April"
            },
            {
              "value": "5",
              "description": "May"
            },
            {
              "value": "6",
              "description": "June"
            },
            {
              "value": "7",
              "description": "July"
            },
            {
              "value": "8",
              "description": "August"
            },
            {
              "value": "9",
              "description": "September"
            },
            {
              "value": "10",
              "description": "October"
            },
            {
              "value": "11",
              "description": "November"
            },
            {
              "value": "12",
              "description": "December"
            },
            {
              "value": "13–255",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.date_of_threshold_assessment",
    "uuid": "0x2A86",
    "name": "Date of Threshold Assessment",
    "slug": "date-of-threshold-assessment",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.date_of_threshold_assessment.yaml",
      "description": "The Date of Threshold Assessment characteristic is used to represent the date of threshold assessment of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Year",
          "anchor": "field-year",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Year as defined by the Gregorian calendar.\nUnit; org.bluetooth.unit.time.year\nThe Year is an integer value.\nMinimum value: 1582\nMaximum value: 9999\nIn addition to the above range, a special value is defined: 0 = Year is not known",
          "units": [
            {
              "id": "org.bluetooth.unit.time.year",
              "name": "time (year)",
              "evidence": "Unit; org.bluetooth.unit.time.year"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Month",
          "anchor": "field-month",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.date_of_threshold_assessment/field/month}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Day",
          "anchor": "field-day",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.time.day \nThe Day is an integer value. \nMinimum value: 1 \nMaximum value: 31 \nIn addition to the above range, a special value is defined: 0 = Day of Month is not known",
          "units": [
            {
              "id": "org.bluetooth.unit.time.day",
              "name": "time (day)",
              "evidence": "Unit: org.bluetooth.unit.time.day"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 3,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Month",
          "key": "month",
          "anchor": "def-month",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0",
              "description": "Month is not known"
            },
            {
              "value": "1",
              "description": "January"
            },
            {
              "value": "2",
              "description": "February"
            },
            {
              "value": "3",
              "description": "March"
            },
            {
              "value": "4",
              "description": "April"
            },
            {
              "value": "5",
              "description": "May"
            },
            {
              "value": "6",
              "description": "June"
            },
            {
              "value": "7",
              "description": "July"
            },
            {
              "value": "8",
              "description": "August"
            },
            {
              "value": "9",
              "description": "September"
            },
            {
              "value": "10",
              "description": "October"
            },
            {
              "value": "11",
              "description": "November"
            },
            {
              "value": "12",
              "description": "December"
            },
            {
              "value": "13–255",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.email_address",
    "uuid": "0x2A87",
    "name": "Email Address",
    "slug": "email-address",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.email_address.yaml",
      "description": "The Email Address characteristic is used to represent the email address of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Email Address",
          "anchor": "field-email-address",
          "type": "utf8s",
          "size": "variable",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "UTF-8 string",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.fat_burn_heart_rate_lower_limit",
    "uuid": "0x2A88",
    "name": "Fat Burn Heart Rate Lower Limit",
    "slug": "fat-burn-heart-rate-lower-limit",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.fat_burn_heart_rate_lower_limit.yaml",
      "description": "The Fat Burn Heart Rate Lower Limit characteristic is used to represent the desired lower limit of the heart rate, where a user maximizes the fat burn while exercising.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Fat Burn Heart Rate Lower Limit",
          "anchor": "field-fat-burn-heart-rate-lower-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.fat_burn_heart_rate_upper_limit",
    "uuid": "0x2A89",
    "name": "Fat Burn Heart Rate Upper Limit",
    "slug": "fat-burn-heart-rate-upper-limit",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.fat_burn_heart_rate_upper_limit.yaml",
      "description": "The Fat Burn Heart Rate Upper Limit characteristic is used to represent the desired upper limit of the heart rate, where a user maximizes the fat burn while exercising.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Fat Burn Heart Rate Upper Limit",
          "anchor": "field-fat-burn-heart-rate-upper-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.first_name",
    "uuid": "0x2A8A",
    "name": "First Name",
    "slug": "first-name",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.first_name.yaml",
      "description": "The First Name characteristic is used to represent the first name of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "First Name",
          "anchor": "field-first-name",
          "type": "utf8s",
          "size": "variable",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "UTF-8 string",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.five_zone_heart_rate_limits",
    "uuid": "0x2A8B",
    "name": "Five Zone Heart Rate Limits",
    "slug": "five-zone-heart-rate-limits",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.five_zone_heart_rate_limits.yaml",
      "description": "The Five Zone Heart Rate Limits characteristic is used to represent the limits between the heart rate zones for the five-zone heart rate definition (Maximum, Hard, Moderate, Light, and Very Light) of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Five Zone Heart Rate Limits - Very Light / Light Limit",
          "anchor": "field-five-zone-heart-rate-limits-very-light-light-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Five Zone Heart Rate Limits - Light / Moderate Limit",
          "anchor": "field-five-zone-heart-rate-limits-light-moderate-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Five Zone Heart Rate Limits - Moderate / Hard Limit",
          "anchor": "field-five-zone-heart-rate-limits-moderate-hard-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Five Zone Heart Rate Limits - Hard / Maximum Limit",
          "anchor": "field-five-zone-heart-rate-limits-hard-maximum-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 3,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.gender",
    "uuid": "0x2A8C",
    "name": "Gender",
    "slug": "gender",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.gender.yaml",
      "description": "The Gender characteristic is used to represent the gender of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Gender",
          "anchor": "field-gender",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "0: Male\n1: Female\n2: Unspecified\n3–255: Reserved for Future Use",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.heart_rate_max",
    "uuid": "0x2A8D",
    "name": "Heart Rate Max",
    "slug": "heart-rate-max",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.heart_rate_max.yaml",
      "description": "The Heart Rate Max characteristic is used to represent the maximum heart rate of a user which the user intends not to exceed.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Heart Rate Max",
          "anchor": "field-heart-rate-max",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.height",
    "uuid": "0x2A8E",
    "name": "Height",
    "slug": "height",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.height.yaml",
      "description": "The Height characteristic is used to represent the height of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Height",
          "anchor": "field-height",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.length.meter\nRepresented values: M = 1, d = -2, b = 0\nUnit is 0.01 meter.",
          "units": [
            {
              "id": "org.bluetooth.unit.length.meter",
              "name": null,
              "evidence": "Base Unit: org.bluetooth.unit.length.meter"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.hip_circumference",
    "uuid": "0x2A8F",
    "name": "Hip Circumference",
    "slug": "hip-circumference",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.hip_circumference.yaml",
      "description": "The Hip Circumference characteristic is used to represent the hip circumference measurement of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Hip Circumference",
          "anchor": "field-hip-circumference",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.length.meter\nRepresented values: M = 1, d = -2, b = 0\nUnit is 0.01 meter.",
          "units": [
            {
              "id": "org.bluetooth.unit.length.meter",
              "name": null,
              "evidence": "Base Unit: org.bluetooth.unit.length.meter"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.last_name",
    "uuid": "0x2A90",
    "name": "Last Name",
    "slug": "last-name",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.last_name.yaml",
      "description": "The Last Name characteristic is used to represent the last name of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Last Name",
          "anchor": "field-last-name",
          "type": "utf8s",
          "size": "variable",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "UTF-8 string",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.maximum_recommended_heart_rate",
    "uuid": "0x2A91",
    "name": "Maximum Recommended Heart Rate",
    "slug": "maximum-recommended-heart-rate",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.maximum_recommended_heart_rate.yaml",
      "description": "The Maximum Recommended Heart Rate characteristic is used to represent the maximum recommended heart rate of a user. Maximum recommended heart rate is a threshold that is intended to be set to limit exertion. The maximum recommended heart rate is less than or equal to the maximum heart rate recommended for a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Maximum Recommended Heart Rate",
          "anchor": "field-maximum-recommended-heart-rate",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.resting_heart_rate",
    "uuid": "0x2A92",
    "name": "Resting Heart Rate",
    "slug": "resting-heart-rate",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.resting_heart_rate.yaml",
      "description": "The Resting Heart Rate characteristic is used to represent the resting heart rate of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Resting Heart Rate",
          "anchor": "field-resting-heart-rate",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.sport_type_for_aerobic_and_anaerobic_thresholds",
    "uuid": "0x2A93",
    "name": "Sport Type for Aerobic and Anaerobic Thresholds",
    "slug": "sport-type-for-aerobic-and-anaerobic-thresholds",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.sport_type_for_aerobic_and_anaerobic_thresholds.yaml",
      "description": "The Sport Type for Aerobic and Anaerobic Thresholds characteristic is used to represent the sport type applicable to aerobic and anaerobic thresholds for a user. The value identifies how the measurement(s) were performed. The Aerobic Threshold and Anaerobic Threshold characteristics together with the Sport Type For Aerobic And Anaerobic Thresholds characteristic describe the metabolic thresholds of the user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Sport Type for Aerobic and Anaerobic Thresholds",
          "anchor": "field-sport-type-for-aerobic-and-anaerobic-thresholds",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.sport_type_for_aerobic_and_anaerobic_thresholds/field/sport_type_for_aerobic_and_anaerobic_thresholds}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Sport Type for Aerobic and Anaerobic Thresholds",
          "key": "sport_type_for_aerobic_and_anaerobic_thresholds",
          "anchor": "def-sport-type-for-aerobic-and-anaerobic-thresholds",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0",
              "description": "Unspecified"
            },
            {
              "value": "1",
              "description": "Running (Treadmill)"
            },
            {
              "value": "2",
              "description": "Cycling (Ergometer)"
            },
            {
              "value": "3",
              "description": "Rowing (Ergometer)"
            },
            {
              "value": "4",
              "description": "Cross Training (Elliptical)"
            },
            {
              "value": "5",
              "description": "Climbing"
            },
            {
              "value": "6",
              "description": "Skiing"
            },
            {
              "value": "7",
              "description": "Skating"
            },
            {
              "value": "8",
              "description": "Arm exercising"
            },
            {
              "value": "9",
              "description": "Lower body exercising"
            },
            {
              "value": "10",
              "description": "Upper body exercising"
            },
            {
              "value": "11",
              "description": "Whole body exercising"
            },
            {
              "value": "12–255",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.three_zone_heart_rate_limits",
    "uuid": "0x2A94",
    "name": "Three Zone Heart Rate Limits",
    "slug": "three-zone-heart-rate-limits",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.three_zone_heart_rate_limits.yaml",
      "description": "The Three Zone Heart Rate Limits characteristic is used to represent the limits between the heart rate zones for the three-zone heart rate definition (Hard, Moderate, and Light) of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Three Zone Heart Rate Limits - Light (Fat burn) / Moderate (Aerobic) Limit",
          "anchor": "field-three-zone-heart-rate-limits-light-fat-burn-moderate-aerobic-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Three Zone Heart Rate Limits - Moderate (Aerobic) / Hard (Anaerobic) Limit",
          "anchor": "field-three-zone-heart-rate-limits-moderate-aerobic-hard-anaerobic-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.two_zone_heart_rate_limits",
    "uuid": "0x2A95",
    "name": "Two Zone Heart Rate Limits",
    "slug": "two-zone-heart-rate-limits",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.two_zone_heart_rate_limits.yaml",
      "description": "The Two Zone Heart Rate Limits characteristic is used to represent the heart rate limit between the heart rate zones for the two-zone heart rate definition (Fitness and Fat Burn) of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Two Zone Heart Rate Limit - Fat Burn / Fitness Limit",
          "anchor": "field-two-zone-heart-rate-limit-fat-burn-fitness-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.vo2_max",
    "uuid": "0x2A96",
    "name": "VO2 Max",
    "slug": "vo2-max",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.vo2_max.yaml",
      "description": "The VO2 Max characteristic is used to represent the maximal oxygen uptake of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "VO2 Max",
          "anchor": "field-vo2-max",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.transfer_rate.milliliter_per_kilogram_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.transfer_rate.milliliter_per_kilogram_per_minute",
              "name": "milliliter (per kilogram per minute)",
              "evidence": "Unit: org.bluetooth.unit.transfer_rate.milliliter_per_kilogram_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.waist_circumference",
    "uuid": "0x2A97",
    "name": "Waist Circumference",
    "slug": "waist-circumference",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.waist_circumference.yaml",
      "description": "The Waist Circumference characteristic is used to represent the waist measurement of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Waist Circumference",
          "anchor": "field-waist-circumference",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.length.meter\nRepresented values: M = 1, d = -2, b = 0\nUnit is 0.01 meter.",
          "units": [
            {
              "id": "org.bluetooth.unit.length.meter",
              "name": null,
              "evidence": "Base Unit: org.bluetooth.unit.length.meter"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.weight",
    "uuid": "0x2A98",
    "name": "Weight",
    "slug": "weight",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.weight.yaml",
      "description": "The Weight characteristic is used to represent the weight of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Weight",
          "anchor": "field-weight",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.mass.kilogram\nRepresented values: M = 5, d = -3, b = 0\nUnit is 0.005 kilogram.",
          "units": [
            {
              "id": "org.bluetooth.unit.mass.kilogram",
              "name": "mass (kilogram)",
              "evidence": "Base Unit: org.bluetooth.unit.mass.kilogram"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.body_composition_feature",
    "uuid": "0x2A9B",
    "name": "Body Composition Feature",
    "slug": "body-composition-feature",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.body_composition_feature.yaml",
      "description": "The Body Composition Feature characteristic is used to represent the supported features of a body composition sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Body Composition Feature",
          "anchor": "field-body-composition-feature",
          "type": "boolean[32]",
          "size": "4",
          "sizeKind": "fixed",
          "sizeN": 4,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.body_composition_feature/field/body_composition_feature}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Body Composition Feature",
          "key": "body_composition_feature",
          "anchor": "def-body-composition-feature",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Time Stamp Supported"
            },
            {
              "bit": "1",
              "description": "Multiple Users Supported"
            },
            {
              "bit": "2",
              "description": "Basal Metabolism Supported"
            },
            {
              "bit": "3",
              "description": "Muscle Percentage Supported"
            },
            {
              "bit": "4",
              "description": "Muscle Mass Supported"
            },
            {
              "bit": "5",
              "description": "Fat Free Mass Supported"
            },
            {
              "bit": "6",
              "description": "Soft Lean Mass Supported"
            },
            {
              "bit": "7",
              "description": "Body Water Mass Supported"
            },
            {
              "bit": "8",
              "description": "Impedance Supported"
            },
            {
              "bit": "9",
              "description": "Weight Supported"
            },
            {
              "bit": "10",
              "description": "Height Supported"
            },
            {
              "bit": "11–14",
              "description": "Weight Measurement Resolution\n0b0000 = Not specified\n0b0001 = Resolution of 0.5 kg or 1 lb.\n0b0010 = Resolution of 0.2 kg or 0.5 lb.\n0b0011 = Resolution of 0.1 kg or 0.2 lb.\n0b0100 = Resolution of 0.05 kg or 0.1 lb.\n0b0101 = Resolution of 0.02 kg or 0.05 lb.\n0b0110 = Resolution of 0.01 kg or 0.02 lb.\n0b0111 = Resolution of 0.005 kg or 0.01 lb.\nAll other values = Reserved for Future Use"
            },
            {
              "bit": "15–17",
              "description": "Height Measurement Resolution\n0b000 = Not specified\n0b001 = Resolution of 0.01 meter or 1 inch\n0b010 = Resolution of 0.005 meter or 0.5 inch\n0b011 = Resolution of 0.001 meter or 0.1 inch\nAll other values = Reserved for Future Use"
            },
            {
              "bit": "18–31",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.body_composition_measurement",
    "uuid": "0x2A9C",
    "name": "Body Composition Measurement",
    "slug": "body-composition-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.body_composition_measurement.yaml",
      "description": "The Body Composition Measurement characteristic is used to represent data related to a body composition measurement.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.body_composition_measurement/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Body Fat Percentage",
          "anchor": "field-body-fat-percentage",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.percentage\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a percent",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Base Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Time Stamp",
          "anchor": "field-time-stamp",
          "type": "struct",
          "size": "0 or 7",
          "sizeKind": "optional",
          "sizeN": 7,
          "description": "Refer to the Date Time characteristic in \\autoref{sec:org.bluetooth.characteristic.date_time}\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": 4,
          "offsetVariesWith": []
        },
        {
          "name": "User ID",
          "anchor": "field-user-id",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.body_composition_measurement/field/user_id}\nPresent if bit 2 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp"
          ]
        },
        {
          "name": "Basal Metabolism",
          "anchor": "field-basal-metabolism",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.energy.joule\nRepresented values: M = 1, d = 3, b = 0\nUnit is kilojoules\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.joule",
              "name": "energy (joule)",
              "evidence": "Base Unit: org.bluetooth.unit.energy.joule"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID"
          ]
        },
        {
          "name": "Muscle Percentage",
          "anchor": "field-muscle-percentage",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.percentage\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a percent\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Base Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID",
            "Basal Metabolism"
          ]
        },
        {
          "name": "Muscle Mass",
          "anchor": "field-muscle-mass",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.body_composition_measurement/field/muscle_mass}\nPresent if bit 5 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID",
            "Basal Metabolism",
            "Muscle Percentage"
          ]
        },
        {
          "name": "Fat Free Mass",
          "anchor": "field-fat-free-mass",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.body_composition_measurement/field/fat_free_mass}\nPresent if bit 6 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 6 of Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID",
            "Basal Metabolism",
            "Muscle Percentage",
            "Muscle Mass"
          ]
        },
        {
          "name": "Soft Lean Mass",
          "anchor": "field-soft-lean-mass",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.body_composition_measurement/field/soft_lean_mass}\nPresent if bit 7 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID",
            "Basal Metabolism",
            "Muscle Percentage",
            "Muscle Mass",
            "Fat Free Mass"
          ]
        },
        {
          "name": "Body Water Mass",
          "anchor": "field-body-water-mass",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.body_composition_measurement/field/body_water_mass}\nPresent if bit 8 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID",
            "Basal Metabolism",
            "Muscle Percentage",
            "Muscle Mass",
            "Fat Free Mass",
            "Soft Lean Mass"
          ]
        },
        {
          "name": "Impedance",
          "anchor": "field-impedance",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.electric_resistance.ohm\nRepresented values: M = 1, d = -2, b = 0\nUnit is 1/10 of an Ohm\nPresent if bit 9 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.electric_resistance.ohm",
              "name": "electric resistance (ohm)",
              "evidence": "Base Unit: org.bluetooth.unit.electric_resistance.ohm"
            }
          ],
          "presenceText": "Present if bit 9 of Flags field is set to 1",
          "presence": {
            "bit": 9,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 9 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID",
            "Basal Metabolism",
            "Muscle Percentage",
            "Muscle Mass",
            "Fat Free Mass",
            "Soft Lean Mass",
            "Body Water Mass"
          ]
        },
        {
          "name": "Weight",
          "anchor": "field-weight",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.body_composition_measurement/field/weight}\nPresent if bit 10 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 10 of Flags field is set to 1",
          "presence": {
            "bit": 10,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 10 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID",
            "Basal Metabolism",
            "Muscle Percentage",
            "Muscle Mass",
            "Fat Free Mass",
            "Soft Lean Mass",
            "Body Water Mass",
            "Impedance"
          ]
        },
        {
          "name": "Height",
          "anchor": "field-height",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.body_composition_measurement/field/height}\nPresent if bit 11 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 11 of Flags field is set to 1",
          "presence": {
            "bit": 11,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 11 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID",
            "Basal Metabolism",
            "Muscle Percentage",
            "Muscle Mass",
            "Fat Free Mass",
            "Soft Lean Mass",
            "Body Water Mass",
            "Impedance",
            "Weight"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Measurement Units:\n0 = SI (Weight and Mass in units of kilogram (kg) and Height in units of meter)\n1 = Imperial (Weight and Mass in units of pound (lb) and Height in units of inch (in))"
            },
            {
              "bit": "1",
              "description": "Time Stamp present"
            },
            {
              "bit": "2",
              "description": "User ID present"
            },
            {
              "bit": "3",
              "description": "Basal Metabolism present"
            },
            {
              "bit": "4",
              "description": "Muscle Percentage present"
            },
            {
              "bit": "5",
              "description": "Muscle Mass present"
            },
            {
              "bit": "6",
              "description": "Fat Free Mass present"
            },
            {
              "bit": "7",
              "description": "Soft Lean Mass present"
            },
            {
              "bit": "8",
              "description": "Body Water Mass present"
            },
            {
              "bit": "9",
              "description": "Impedance present"
            },
            {
              "bit": "10",
              "description": "Weight present"
            },
            {
              "bit": "11",
              "description": "Height present"
            },
            {
              "bit": "12",
              "description": "Multiple Packet Measurement"
            },
            {
              "bit": "13–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "User ID",
          "key": "user_id",
          "anchor": "def-user-id",
          "description": "The special value of 0xFF for User ID represents \"unknown user\".",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Muscle Mass",
          "key": "muscle_mass",
          "anchor": "def-muscle-mass",
          "description": "This field is in kilograms with resolution 0.005 if the bit 0 of the Flag field is 0 or in pounds with a resolution of 0.01 if the bit 0 of the Flag field is 1.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Fat Free Mass",
          "key": "fat_free_mass",
          "anchor": "def-fat-free-mass",
          "description": "This field is in kilograms with resolution 0.005 if the bit 0 of the Flag field is 0 or in pounds with a resolution of 0.01 if the bit 0 of the Flag field is 1.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Soft Lean Mass",
          "key": "soft_lean_mass",
          "anchor": "def-soft-lean-mass",
          "description": "This field is in kilograms with resolution 0.005 if the bit 0 of the Flag field is 0 or in pounds with a resolution of 0.01 if the bit 0 of the Flag field is 1.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Body Water Mass",
          "key": "body_water_mass",
          "anchor": "def-body-water-mass",
          "description": "This field is in kilograms with resolution 0.005 if the bit 0 of the Flag field is 0 or in pounds with a resolution of 0.01 if the bit 0 of the Flag field is 1.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Weight",
          "key": "weight",
          "anchor": "def-weight",
          "description": "This field is in kilograms with resolution 0.005 if the bit 0 of the Flag field is 0 or in pounds with a resolution of 0.01 if the bit 0 of the Flag field is 1.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Height",
          "key": "height",
          "anchor": "def-height",
          "description": "This field is in meters with a resolution of 0.001 if the bit 0 of the Flag field is 0 or in inches with a resolution of 0.1 if the bit 0 of the Flag field is 1.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.weight_measurement",
    "uuid": "0x2A9D",
    "name": "Weight Measurement",
    "slug": "weight-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.weight_measurement.yaml",
      "description": "The Weight Measurement characteristic is used to represent data related to a weight measurement.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.weight_measurement/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Weight",
          "anchor": "field-weight",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "This field is in kilograms with resolution 0.005 if the bit 0 of the Flag field is 0 or in pounds with a resolution of 0.01 if the bit 0 of the Flag field is 1.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Time Stamp",
          "anchor": "field-time-stamp",
          "type": "struct",
          "size": "0 or 7",
          "sizeKind": "optional",
          "sizeN": 7,
          "description": "Refer to Date Time characteristic in \\autoref{sec:org.bluetooth.characteristic.date_time}\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": 3,
          "offsetVariesWith": []
        },
        {
          "name": "User ID",
          "anchor": "field-user-id",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "The special value of 0xFF for User ID represents \"unknown user\".\nPresent if bit 2 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp"
          ]
        },
        {
          "name": "BMI",
          "anchor": "field-bmi",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit is 0.1 kg/m2 or org.bluetooth.unit.kilogram_per_square_metre\nRepresented values: M = 1, d = -1, b = 0.\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.kilogram_per_square_metre",
              "name": null,
              "evidence": "Unit is 0.1 kg/m2 or org.bluetooth.unit.kilogram_per_square_metre"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID"
          ]
        },
        {
          "name": "Height",
          "anchor": "field-height",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "This field is in meters with a resolution of 0.001 if the bit 0 of the Flag field is 0 or in inches with a resolution of 0.1 if the bit 0 of the Flag field is 1.\nPresent if bit 3 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "User ID",
            "BMI"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Measurement Units:\n0 = SI (Weight and Mass in units of kilogram (kg) and Height in units of meter)\n1 = Imperial (Weight and Mass in units of pound (lb) and Height in units of inch (in))"
            },
            {
              "bit": "1",
              "description": "Time Stamp present"
            },
            {
              "bit": "2",
              "description": "User ID present"
            },
            {
              "bit": "3",
              "description": "BMI and Height present"
            },
            {
              "bit": "4–7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.weight_scale_feature",
    "uuid": "0x2A9E",
    "name": "Weight Scale Feature",
    "slug": "weight-scale-feature",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.weight_scale_feature.yaml",
      "description": "The Weight Scale Feature characteristic is used to represent the supported features of a weight scale.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Weight Scale Feature",
          "anchor": "field-weight-scale-feature",
          "type": "boolean[32]",
          "size": "4",
          "sizeKind": "fixed",
          "sizeN": 4,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.weight_scale_feature/field/weight_scale_feature}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Weight Scale Feature",
          "key": "weight_scale_feature",
          "anchor": "def-weight-scale-feature",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Time Stamp Supported"
            },
            {
              "bit": "1",
              "description": "Multiple Users Supported"
            },
            {
              "bit": "2",
              "description": "BMI Supported"
            },
            {
              "bit": "3–6",
              "description": "Weight Measurement Resolution\n0b0000 = Not specified\n0b0001 = Resolution of 0.5 kg or 1 lb\n0b0010 = Resolution of 0.2 kg or 0.5 lb\n0b0011 = Resolution of 0.1 kg or 0.2 lb\n0b0100 = Resolution of 0.05 kg or 0.1 lb\n0b0101 = Resolution of 0.02 kg or 0.05 lb\n0b0110 = Resolution of 0.01 kg or 0.02 lb\n0b0111 = Resolution of 0.005 kg or 0.01 lb\n0b1000–0b1111 = Reserved for Future Use"
            },
            {
              "bit": "7–9",
              "description": "Height Measurement Resolution\n0b000 = Not specified\n0b001 = Resolution of 0.01 meter or 1 inch\n0b010 = Resolution of 0.005 meter or 0.5 inch\n0b011 = Resolution of 0.001 meter or 0.1 inch\n0b100–0b111 = Reserved for Future Use"
            },
            {
              "bit": "10–31",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.language",
    "uuid": "0x2AA2",
    "name": "Language",
    "slug": "language",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.language.yaml",
      "description": "The Language characteristic is used to represent the preferred language of a user.\nThe Language definition is based on ISO 639-1 \\RefRef{iso_639_1}.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Language",
          "anchor": "field-language",
          "type": "utf8s",
          "size": "variable",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "UTF-8 string",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.cgm_measurement",
    "uuid": "0x2AA7",
    "name": "CGM Measurement",
    "slug": "cgm-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.cgm_status"
    ],
    "hasPage": true,
    "pageReason": "flags",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cgm_measurement.yaml",
      "description": "The CGM Measurement characteristic is used to represent one or more CGM Measurement Records.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "CGM Measurement Record(s)",
          "anchor": "field-cgm-measurement-record-s",
          "type": "struct",
          "size": "variable",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "A sequence of one or more CGM Measurement Records, concatenated as defined by the service.\nThe structure of a CGM Measurement Record is defined in \\autoref{sec:org.bluetooth.characteristic.cgm_measurement/field/cgm_measurement_record}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "CGM Measurement Record",
          "key": "cgm_measurement_record",
          "anchor": "def-cgm-measurement-record",
          "description": "The structure of a CGM Measurement Record is defined below.",
          "sectionTitle": "CGM Measurement Record",
          "tableCaption": "CGM Measurement Record",
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Size",
              "data_type": "uint8",
              "size": "1",
              "description": "Size of the CGM Measurement Record including this field."
            },
            {
              "field": "Flags",
              "data_type": "boolean[8]",
              "size": "1",
              "description": "See \\autoref{sec:org.bluetooth.characteristic.cgm_measurement/field/flags}"
            },
            {
              "field": "CGM Glucose Concentration",
              "data_type": "medfloat16",
              "size": "2",
              "description": "Glucose concentration.\nUnit: org.bluetooth.unit.mass_density.milligram_per_decilitre"
            },
            {
              "field": "Time Offset",
              "data_type": "uint16",
              "size": "2",
              "description": "Minutes since the Session Start Time for the stored glucose concentration value. See \\autoref{sec:org.bluetooth.characteristic.cgm_measurement/field/time_offset}.\nUnit: org.bluetooth.unit.time.minute"
            },
            {
              "field": "Sensor Status Annunciation",
              "data_type": "boolean[8][3]",
              "size": "0 to 3",
              "description": "See \\autoref{sec:org.bluetooth.characteristic.cgm_measurement/field/sensor_status_annunciation}"
            },
            {
              "field": "CGM Trend Information",
              "data_type": "medfloat16",
              "size": "0 or 2",
              "description": "Glucose trend rate since previous measurement.\nUnit:\norg.bluetooth.unit.milligram_per_decilitre_per_minute\nPresent if bit 0 of Flags field is set to 1"
            },
            {
              "field": "CGM Quality",
              "data_type": "medfloat16",
              "size": "0 or 2",
              "description": "CGM Quality information in percentage.\nUnit:\norg.bluetooth.unit.percentage\nPresent if bit 1 of Flags field is set to 1"
            },
            {
              "field": "E2E-CRC",
              "data_type": "uint16",
              "size": "0 or 2",
              "description": "CRC calculated over all fields except the E2E-CRC field itself.\nPresent if E2E-CRC Supported bit in CGM Feature characteristic is set to 1"
            }
          ],
          "layout": [
            {
              "name": "Size",
              "anchor": "def-cgm-measurement-record--size",
              "type": "uint8",
              "size": "1",
              "sizeKind": "fixed",
              "sizeN": 1,
              "units": [],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Flags",
              "anchor": "def-cgm-measurement-record--flags",
              "type": "boolean[8]",
              "size": "1",
              "sizeKind": "fixed",
              "sizeN": 1,
              "units": [],
              "presenceText": null,
              "presence": null,
              "offset": 1,
              "offsetVariesWith": []
            },
            {
              "name": "CGM Glucose Concentration",
              "anchor": "def-cgm-measurement-record--cgm-glucose-concentration",
              "type": "medfloat16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.mass_density.milligram_per_decilitre",
                  "name": "mass density (milligram per decilitre)",
                  "evidence": "Unit: org.bluetooth.unit.mass_density.milligram_per_decilitre"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 2,
              "offsetVariesWith": []
            },
            {
              "name": "Time Offset",
              "anchor": "def-cgm-measurement-record--time-offset",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.time.minute",
                  "name": "time (minute)",
                  "evidence": "Unit: org.bluetooth.unit.time.minute"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 4,
              "offsetVariesWith": []
            },
            {
              "name": "Sensor Status Annunciation",
              "anchor": "def-cgm-measurement-record--sensor-status-annunciation",
              "type": "boolean[8][3]",
              "size": "0 to 3",
              "sizeKind": "variable",
              "sizeN": null,
              "units": [],
              "presenceText": null,
              "presence": null,
              "offset": 6,
              "offsetVariesWith": []
            },
            {
              "name": "CGM Trend Information",
              "anchor": "def-cgm-measurement-record--cgm-trend-information",
              "type": "medfloat16",
              "size": "0 or 2",
              "sizeKind": "optional",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.milligram_per_decilitre_per_minute",
                  "name": null,
                  "evidence": "Unit: org.bluetooth.unit.milligram_per_decilitre_per_minute"
                }
              ],
              "presenceText": "Present if bit 0 of Flags field is set to 1",
              "presence": {
                "bit": 0,
                "field": "Flags",
                "value": 1,
                "evidence": "Present if bit 0 of Flags field is set to 1"
              },
              "offset": null,
              "offsetVariesWith": [
                "Sensor Status Annunciation"
              ]
            },
            {
              "name": "CGM Quality",
              "anchor": "def-cgm-measurement-record--cgm-quality",
              "type": "medfloat16",
              "size": "0 or 2",
              "sizeKind": "optional",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.percentage",
                  "name": "percentage",
                  "evidence": "Unit: org.bluetooth.unit.percentage"
                }
              ],
              "presenceText": "Present if bit 1 of Flags field is set to 1",
              "presence": {
                "bit": 1,
                "field": "Flags",
                "value": 1,
                "evidence": "Present if bit 1 of Flags field is set to 1"
              },
              "offset": null,
              "offsetVariesWith": [
                "Sensor Status Annunciation",
                "CGM Trend Information"
              ]
            },
            {
              "name": "E2E-CRC",
              "anchor": "def-cgm-measurement-record--e2e-crc",
              "type": "uint16",
              "size": "0 or 2",
              "sizeKind": "optional",
              "sizeN": 2,
              "units": [],
              "presenceText": "Present if E2E-CRC Supported bit in CGM Feature characteristic is set to 1",
              "presence": null,
              "offset": null,
              "offsetVariesWith": [
                "Sensor Status Annunciation",
                "CGM Trend Information",
                "CGM Quality"
              ]
            }
          ],
          "subfields": []
        },
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "CGM Trend Information present"
            },
            {
              "bit": "1",
              "description": "CGM Quality present"
            },
            {
              "bit": "2",
              "description": "Reserved for Future Use"
            },
            {
              "bit": "3",
              "description": "Reserved for Future Use"
            },
            {
              "bit": "4",
              "description": "Reserved for Future Use"
            },
            {
              "bit": "5",
              "description": "Sensor Status Annunciation field, Warning-Octet present"
            },
            {
              "bit": "6",
              "description": "Sensor Status Annunciation field, Cal/Temp-Octet present"
            },
            {
              "bit": "7",
              "description": "Sensor Status Annunciation field, Status-Octet present"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Time Offset",
          "key": "time_offset",
          "anchor": "def-time-offset",
          "description": "The values of this field specify the relative time difference of the single CGM values to the Session Start Time.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x0000–0xFFFF",
              "description": "Time offset in minutes since the Session Start Time (see \\autoref{sec:org.bluetooth.characteristic.cgm_session_start_time})"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Sensor Status Annunciation",
          "key": "sensor_status_annunciation",
          "anchor": "def-sensor-status-annunciation",
          "description": "The Sensor Status Annunciation field is composed of up to three octets: one for Status, one for Cal/Temp and one for Warning. An octet is only present if one or more bits are set to \"1\". The presence of each annunciation octet is indicated by the corresponding Flags field (see \\autoref{sec:org.bluetooth.characteristic.cgm_measurement/field/flags}). The Sensor Status Annunciation field is present for every CGM Measurement Record to which the status applies.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Status",
              "data_type": "boolean[8]",
              "size": "0 or 1",
              "description": "See \\autoref{sec:org.bluetooth.characteristic.cgm_measurement/subfield/status}\nPresent if bit 7 of Flags field is set to 1"
            },
            {
              "field": "Cal/Temp",
              "data_type": "boolean[8]",
              "size": "0 or 1",
              "description": "See \\autoref{sec:org.bluetooth.characteristic.cgm_measurement/subfield/cal_temp}\nPresent if bit 6 of Flags field is set to 1"
            },
            {
              "field": "Warning",
              "data_type": "boolean[8]",
              "size": "0 or 1",
              "description": "See \\autoref{sec:org.bluetooth.characteristic.cgm_measurement/subfield/warning}\nPresent if bit 5 of Flags field is set to 1"
            }
          ],
          "layout": [
            {
              "name": "Status",
              "anchor": "def-sensor-status-annunciation--status",
              "type": "boolean[8]",
              "size": "0 or 1",
              "sizeKind": "optional",
              "sizeN": 1,
              "units": [],
              "presenceText": "Present if bit 7 of Flags field is set to 1",
              "presence": {
                "bit": 7,
                "field": "Flags",
                "value": 1,
                "evidence": "Present if bit 7 of Flags field is set to 1"
              },
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Cal/Temp",
              "anchor": "def-sensor-status-annunciation--cal-temp",
              "type": "boolean[8]",
              "size": "0 or 1",
              "sizeKind": "optional",
              "sizeN": 1,
              "units": [],
              "presenceText": "Present if bit 6 of Flags field is set to 1",
              "presence": {
                "bit": 6,
                "field": "Flags",
                "value": 1,
                "evidence": "Present if bit 6 of Flags field is set to 1"
              },
              "offset": null,
              "offsetVariesWith": [
                "Status"
              ]
            },
            {
              "name": "Warning",
              "anchor": "def-sensor-status-annunciation--warning",
              "type": "boolean[8]",
              "size": "0 or 1",
              "sizeKind": "optional",
              "sizeN": 1,
              "units": [],
              "presenceText": "Present if bit 5 of Flags field is set to 1",
              "presence": {
                "bit": 5,
                "field": "Flags",
                "value": 1,
                "evidence": "Present if bit 5 of Flags field is set to 1"
              },
              "offset": null,
              "offsetVariesWith": [
                "Status",
                "Cal/Temp"
              ]
            }
          ],
          "subfields": [
            {
              "name": "Status",
              "key": "status",
              "anchor": "def-status",
              "description": "The bits of this field are defined below.",
              "sectionTitle": null,
              "tableCaption": null,
              "valueHeader": null,
              "descriptionHeader": null,
              "sizeInBits": false,
              "kind": "bits",
              "columns": [
                "bit",
                "description"
              ],
              "rows": [
                {
                  "bit": "0",
                  "description": "Session stopped"
                },
                {
                  "bit": "1",
                  "description": "Device battery low"
                },
                {
                  "bit": "2",
                  "description": "Sensor type incorrect for device"
                },
                {
                  "bit": "3",
                  "description": "Sensor malfunction"
                },
                {
                  "bit": "4",
                  "description": "Device Specific Alert"
                },
                {
                  "bit": "5",
                  "description": "General device fault has occurred in the sensor"
                },
                {
                  "bit": "6",
                  "description": "Reserved for Future Use"
                },
                {
                  "bit": "7",
                  "description": "Reserved for Future Use"
                }
              ],
              "layout": null,
              "subfields": []
            },
            {
              "name": "Cal/Temp",
              "key": "cal_temp",
              "anchor": "def-cal-temp",
              "description": "The bits of this field are defined below.",
              "sectionTitle": null,
              "tableCaption": null,
              "valueHeader": null,
              "descriptionHeader": null,
              "sizeInBits": false,
              "kind": "bits",
              "columns": [
                "bit",
                "description"
              ],
              "rows": [
                {
                  "bit": "8",
                  "description": "Time synchronization between sensor and collector required"
                },
                {
                  "bit": "9",
                  "description": "Calibration not allowed"
                },
                {
                  "bit": "10",
                  "description": "Calibration recommended"
                },
                {
                  "bit": "11",
                  "description": "Calibration required"
                },
                {
                  "bit": "12",
                  "description": "Sensor temperature too high for valid test/result at time of measurement"
                },
                {
                  "bit": "13",
                  "description": "Sensor temperature too low for valid test/result at time of measurement"
                },
                {
                  "bit": "14",
                  "description": "Calibration Process Pending"
                },
                {
                  "bit": "15",
                  "description": "Reserved for Future Use"
                }
              ],
              "layout": null,
              "subfields": []
            },
            {
              "name": "Warning",
              "key": "warning",
              "anchor": "def-warning",
              "description": "The bits of this field are defined below.",
              "sectionTitle": null,
              "tableCaption": null,
              "valueHeader": null,
              "descriptionHeader": null,
              "sizeInBits": false,
              "kind": "bits",
              "columns": [
                "bit",
                "description"
              ],
              "rows": [
                {
                  "bit": "16",
                  "description": "Sensor result lower than the Patient Low level"
                },
                {
                  "bit": "17",
                  "description": "Sensor result higher than the Patient High level"
                },
                {
                  "bit": "18",
                  "description": "Sensor result lower than the Hypo level"
                },
                {
                  "bit": "19",
                  "description": "Sensor result higher than the Hyper level"
                },
                {
                  "bit": "20",
                  "description": "Sensor Rate of Decrease exceeded"
                },
                {
                  "bit": "21",
                  "description": "Sensor Rate of Increase exceeded"
                },
                {
                  "bit": "22",
                  "description": "Sensor result lower than the device can process"
                },
                {
                  "bit": "23",
                  "description": "Sensor result higher than the device can process"
                }
              ],
              "layout": null,
              "subfields": []
            }
          ]
        }
      ],
      "flagsFields": [
        "CGM Measurement Record › Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.cgm_feature",
    "uuid": "0x2AA8",
    "name": "CGM Feature",
    "slug": "cgm-feature",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.cgm_specific_ops_control_point"
    ],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cgm_feature.yaml",
      "description": "The CGM Feature characteristic is used to represent the supported features of a continuous glucose monitor (CGM).\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "CGM Feature",
          "anchor": "field-cgm-feature",
          "type": "boolean[24]",
          "size": "3",
          "sizeKind": "fixed",
          "sizeN": 3,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cgm_feature/field/cgm_feature}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "CGM Type-Sample Location",
          "anchor": "field-cgm-type-sample-location",
          "type": "struct",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cgm_feature/field/cgm_type-sample_location}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 3,
          "offsetVariesWith": []
        },
        {
          "name": "E2E-CRC",
          "anchor": "field-e2e-crc",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "CRC calculated over all data except the E2E-CRC field itself. See \\autoref{sec:crc_calculation} for details.\nIf the service containing this characteristic does not support the E2E-CRC, this field typically has a value defined by the service such as 0xFFFF or any other value.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 4,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "CGM Feature",
          "key": "cgm_feature",
          "anchor": "def-cgm-feature",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Calibration supported"
            },
            {
              "bit": "1",
              "description": "Patient High/Low Alerts supported"
            },
            {
              "bit": "2",
              "description": "Hypo Alerts supported"
            },
            {
              "bit": "3",
              "description": "Hyper Alerts supported"
            },
            {
              "bit": "4",
              "description": "Rate of Increase/Decrease Alerts supported"
            },
            {
              "bit": "5",
              "description": "Device Specific Alert supported"
            },
            {
              "bit": "6",
              "description": "Sensor Malfunction Detection supported"
            },
            {
              "bit": "7",
              "description": "Sensor Temperature High-Low Detection supported"
            },
            {
              "bit": "8",
              "description": "Sensor Result High-Low Detection supported"
            },
            {
              "bit": "9",
              "description": "Low Battery Detection supported"
            },
            {
              "bit": "10",
              "description": "Sensor Type Error Detection supported"
            },
            {
              "bit": "11",
              "description": "General Device Fault supported"
            },
            {
              "bit": "12",
              "description": "E2E-CRC supported"
            },
            {
              "bit": "13",
              "description": "Multiple Bond supported"
            },
            {
              "bit": "14",
              "description": "Multiple Sessions supported"
            },
            {
              "bit": "15",
              "description": "CGM Trend Information supported"
            },
            {
              "bit": "16",
              "description": "CGM Quality supported"
            },
            {
              "bit": "17–23",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "CGM Type-Sample Location",
          "key": "cgm_type-sample_location",
          "anchor": "def-cgm-type-sample-location",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": true,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Type",
              "data_type": "uint4",
              "size": "4",
              "description": "Unit: org.bluetooth.unit.unitless\nSee \\autoref{sec:org.bluetooth.characteristic.cgm_feature/subfield/type}"
            },
            {
              "field": "Sample Location",
              "data_type": "uint4",
              "size": "4",
              "description": "Unit: org.bluetooth.unit.unitless\nSee \\autoref{sec:org.bluetooth.characteristic.cgm_feature/subfield/sample_location}"
            }
          ],
          "layout": [
            {
              "name": "Type",
              "anchor": "def-cgm-type-sample-location--type",
              "type": "uint4",
              "size": "4",
              "sizeKind": "fixed",
              "sizeN": 4,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Sample Location",
              "anchor": "def-cgm-type-sample-location--sample-location",
              "type": "uint4",
              "size": "4",
              "sizeKind": "fixed",
              "sizeN": 4,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 4,
              "offsetVariesWith": []
            }
          ],
          "subfields": [
            {
              "name": "Type",
              "key": "type",
              "anchor": "def-type",
              "description": "The values of this field are defined below.",
              "sectionTitle": null,
              "tableCaption": null,
              "valueHeader": null,
              "descriptionHeader": null,
              "sizeInBits": false,
              "kind": "values",
              "columns": [
                "value",
                "description"
              ],
              "rows": [
                {
                  "value": "0x0",
                  "description": "Reserved for Future Use"
                },
                {
                  "value": "0x1",
                  "description": "Capillary Whole blood"
                },
                {
                  "value": "0x2",
                  "description": "Capillary Plasma"
                },
                {
                  "value": "0x3",
                  "description": "Venous Whole blood"
                },
                {
                  "value": "0x4",
                  "description": "Venous Plasma"
                },
                {
                  "value": "0x5",
                  "description": "Arterial Whole blood"
                },
                {
                  "value": "0x6",
                  "description": "Arterial Plasma"
                },
                {
                  "value": "0x7",
                  "description": "Undetermined Whole blood"
                },
                {
                  "value": "0x8",
                  "description": "Undetermined Plasma"
                },
                {
                  "value": "0x9",
                  "description": "Interstitial Fluid (ISF)"
                },
                {
                  "value": "0xA",
                  "description": "Control Solution"
                },
                {
                  "value": "0xB–0xF",
                  "description": "Reserved for Future Use"
                }
              ],
              "layout": null,
              "subfields": []
            },
            {
              "name": "Sample Location",
              "key": "sample_location",
              "anchor": "def-sample-location",
              "description": "The values of this field are defined below.",
              "sectionTitle": null,
              "tableCaption": null,
              "valueHeader": null,
              "descriptionHeader": null,
              "sizeInBits": false,
              "kind": "values",
              "columns": [
                "value",
                "description"
              ],
              "rows": [
                {
                  "value": "0x0",
                  "description": "Reserved for Future Use"
                },
                {
                  "value": "0x1",
                  "description": "Finger"
                },
                {
                  "value": "0x2",
                  "description": "Alternate Site Test (AST)"
                },
                {
                  "value": "0x3",
                  "description": "Earlobe"
                },
                {
                  "value": "0x4",
                  "description": "Control solution"
                },
                {
                  "value": "0x5",
                  "description": "Subcutaneous tissue"
                },
                {
                  "value": "0x6–0xE",
                  "description": "Reserved for Future Use"
                },
                {
                  "value": "0xF",
                  "description": "Sample Location value not available"
                }
              ],
              "layout": null,
              "subfields": []
            }
          ]
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.cgm_status",
    "uuid": "0x2AA9",
    "name": "CGM Status",
    "slug": "cgm-status",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cgm_status.yaml",
      "description": "The CGM Status characteristic is used to represent the current status of a continuous glucose monitor (CGM) sensor.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Time Offset",
          "anchor": "field-time-offset",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "The Time Offset field specifies the time since the Session Start Time (see \\autoref{sec:org.bluetooth.characteristic.cgm_session_start_time}).",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "CGM Status",
          "anchor": "field-cgm-status",
          "type": "boolean[24]",
          "size": "3",
          "sizeKind": "fixed",
          "sizeN": 3,
          "description": "The structure of this field is identical to the structure of the combined Status fields as defined in \\autoref{sec:org.bluetooth.characteristic.cgm_measurement/field/sensor_status_annunciation}, but it always consists of three octets regardless of the value.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "E2E-CRC",
          "anchor": "field-e2e-crc",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "CRC calculated over all fields except the E2E-CRC field itself. See \\autoref{sec:crc_calculation} for details.\nPresent if E2E-CRC Supported bit in CGM Feature characteristic is set to 1",
          "units": [],
          "presenceText": "Present if E2E-CRC Supported bit in CGM Feature characteristic is set to 1",
          "presence": null,
          "offset": 5,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.cgm_session_start_time",
    "uuid": "0x2AAA",
    "name": "CGM Session Start Time",
    "slug": "cgm-session-start-time",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.cgm_measurement",
      "org.bluetooth.characteristic.cgm_status",
      "org.bluetooth.characteristic.cgm_specific_ops_control_point"
    ],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cgm_session_start_time.yaml",
      "description": "The CGM Session Start Time characteristic is used to represent the time the continuous glucose monitor (CGM) session is started.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Session Start Time",
          "anchor": "field-session-start-time",
          "type": "struct",
          "size": "7",
          "sizeKind": "fixed",
          "sizeN": 7,
          "description": "Refer to the Date Time characteristic in \\autoref{sec:org.bluetooth.characteristic.date_time}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Time Zone",
          "anchor": "field-time-zone",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Refer to the Time Zone characteristic in \\autoref{sec:org.bluetooth.characteristic.time_zone}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 7,
          "offsetVariesWith": []
        },
        {
          "name": "DST Offset",
          "anchor": "field-dst-offset",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Refer to the DST Offset characteristic in \\autoref{sec:org.bluetooth.characteristic.dst_offset}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 8,
          "offsetVariesWith": []
        },
        {
          "name": "E2E-CRC",
          "anchor": "field-e2e-crc",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "CRC calculated over all fields. See \\autoref{sec:crc_calculation} for details.\nPresent if E2E-CRC Supported bit in CGM Feature characteristic is set to 1",
          "units": [],
          "presenceText": "Present if E2E-CRC Supported bit in CGM Feature characteristic is set to 1",
          "presence": null,
          "offset": 9,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.cgm_session_run_time",
    "uuid": "0x2AAB",
    "name": "CGM Session Run Time",
    "slug": "cgm-session-run-time",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cgm_session_run_time.yaml",
      "description": "The CGM Session Run Time characteristic is used to represent the expected run time of the continuous glucose monitor (CGM) session.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "CGM Session Run Time",
          "anchor": "field-cgm-session-run-time",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "The expected run time of the CGM session in hours.\nUnit: org.bluetooth.unit.time.hour",
          "units": [
            {
              "id": "org.bluetooth.unit.time.hour",
              "name": "time (hour)",
              "evidence": "Unit: org.bluetooth.unit.time.hour"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "E2E-CRC",
          "anchor": "field-e2e-crc",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "CRC calculated over all fields. See \\autoref{sec:crc_calculation} for details.\nPresent if E2E-CRC Supported bit in CGM Feature characteristic is set to 1",
          "units": [],
          "presenceText": "Present if E2E-CRC Supported bit in CGM Feature characteristic is set to 1",
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.cgm_specific_ops_control_point",
    "uuid": "0x2AAC",
    "name": "CGM Specific Ops Control Point",
    "slug": "cgm-specific-ops-control-point",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cgm_specific_ops_control_point.yaml",
      "description": "The CGM Specific Ops Control Point characteristic is used to enable procedures related to a continuous glucose monitor (CGM).\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Op Code",
          "anchor": "field-op-code",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cgm_specific_ops_control_point/field/op_code_and_operand}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Operand",
          "anchor": "field-operand",
          "type": "struct",
          "size": "0 … 17",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cgm_specific_ops_control_point/field/op_code_and_operand}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "E2E-CRC",
          "anchor": "field-e2e-crc",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "CRC calculated over all fields except the E2E-CRC field itself. See \\autoref{sec:crc_calculation} for details.\nPresent if E2E-CRC Supported bit in CGM Feature characteristic is set to 1",
          "units": [],
          "presenceText": "Present if E2E-CRC Supported bit in CGM Feature characteristic is set to 1",
          "presence": null,
          "offset": null,
          "offsetVariesWith": [
            "Operand"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Op Code and Operand",
          "key": "op_code_and_operand",
          "anchor": "def-op-code-and-operand",
          "description": "The values of these fields are defined below.",
          "sectionTitle": "Op Code and Operand fields",
          "tableCaption": "Op Code and Operand fields",
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [
            "op_code_value",
            "definition",
            "operand",
            "operand_data_type",
            "description"
          ],
          "rows": [
            {
              "op_code_value": "0x00",
              "definition": "Reserved for Future Use",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "N/A"
            },
            {
              "op_code_value": "0x01",
              "definition": "Set CGM Communication Interval",
              "operand": "Communication interval in minutes",
              "operand_data_type": "uint8",
              "description": "The response to this control point is Response Code (Op Code 0x0F)."
            },
            {
              "op_code_value": "0x02",
              "definition": "Get CGM Communication Interval",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "The normal response to this control point is Op Code 0x03. For error conditions, the response is Response Code. as defined in \\autoref{sec:org.bluetooth.characteristic.cgm_specific_ops_control_point/field/response_code_values}."
            },
            {
              "op_code_value": "0x03",
              "definition": "CGM Communication Interval response",
              "operand": "Communication Interval in minutes",
              "operand_data_type": "uint16",
              "description": "This is the normal response to Op Code 0x02."
            },
            {
              "op_code_value": "0x04",
              "definition": "Set Glucose Calibration value",
              "operand": "Operand as defined below. (See \\autoref{sec:org.bluetooth.characteristic.cgm_specific_ops_control_point/field/calibration_value})",
              "operand_data_type": "See \\autoref{sec:org.bluetooth.characteristic.cgm_specific_ops_control_point/field/calibration_value}",
              "description": "The response to this control point is Response Code."
            },
            {
              "op_code_value": "0x05",
              "definition": "Get Glucose Calibration Value",
              "operand": "Calibration Data Record Number",
              "operand_data_type": "uint16",
              "description": "The normal response to this control point is Op Code 0x06. For error conditions, the response is Response Code."
            },
            {
              "op_code_value": "0x06",
              "definition": "Glucose Calibration Value response",
              "operand": "Calibration Data",
              "operand_data_type": "See \\autoref{sec:org.bluetooth.characteristic.cgm_specific_ops_control_point/field/calibration_value}",
              "description": "This is the normal response to Op Code 0x05."
            },
            {
              "op_code_value": "0x07",
              "definition": "Set Patient High Alert Level",
              "operand": "Patient High bG value in mg/dL",
              "operand_data_type": "medfloat16",
              "description": "The response to this control point is Response Code."
            },
            {
              "op_code_value": "0x08",
              "definition": "Get Patient High Alert Level",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "The normal response to this control point is Op Code 0x09. For error conditions, the response is Response Code."
            },
            {
              "op_code_value": "0x09",
              "definition": "Patient High Alert Level Response",
              "operand": "Patient High bG value in mg/dL",
              "operand_data_type": "medfloat16",
              "description": "This is the normal response to Op Code 0x08."
            },
            {
              "op_code_value": "0x0A",
              "definition": "Set Patient Low Alert Level",
              "operand": "Patient Low bG value in mg/dL",
              "operand_data_type": "medfloat16",
              "description": "The response to this control point is Response Code."
            },
            {
              "op_code_value": "0x0B",
              "definition": "Get Patient Low Alert Level",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "The normal response to this control point is Op Code 0x0C. For error conditions, the response is Response Code."
            },
            {
              "op_code_value": "0x0C",
              "definition": "Patient Low Alert Level Response",
              "operand": "Patient Low bG value in mg/dL",
              "operand_data_type": "medfloat16",
              "description": "This is the normal response to Op Code 0x0B."
            },
            {
              "op_code_value": "0x0D",
              "definition": "Set Hypo Alert Level",
              "operand": "Hypo Alert Level value in mg/dL",
              "operand_data_type": "medfloat16",
              "description": "The response to this control point is Response Code."
            },
            {
              "op_code_value": "0x0E",
              "definition": "Get Hypo Alert Level",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "The normal response to this control point is Op Code 0x0F. For error conditions, the response is Response Code."
            },
            {
              "op_code_value": "0x0F",
              "definition": "Hypo Alert Level Response",
              "operand": "Hypo Alert Level value in mg/dL",
              "operand_data_type": "medfloat16",
              "description": "This is the normal response to Op Code 0x0E."
            },
            {
              "op_code_value": "0x10",
              "definition": "Set Hyper Alert Level",
              "operand": "Hyper Alert Level value in mg/dL",
              "operand_data_type": "medfloat16",
              "description": "The response to this control point is Response Code."
            },
            {
              "op_code_value": "0x11",
              "definition": "Get Hyper Alert Level",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "The normal response to this control point is Op Code 0x12. For error conditions, the response is Response Code."
            },
            {
              "op_code_value": "0x12",
              "definition": "Hyper Alert Level Response",
              "operand": "Hyper Alert Level value in mg/dL",
              "operand_data_type": "medfloat16",
              "description": "This is the normal response to Op Code 0x11."
            },
            {
              "op_code_value": "0x13",
              "definition": "Set Rate of Decrease Alert Level",
              "operand": "Rate of Decrease Alert Level value in mg/dL/min",
              "operand_data_type": "medfloat16",
              "description": "The response to this control point is Response Code."
            },
            {
              "op_code_value": "0x14",
              "definition": "Get Rate of Decrease Alert Level",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "The normal response to this control point is Op Code 0x15. For error conditions, the response is Response Code."
            },
            {
              "op_code_value": "0x15",
              "definition": "Rate of Decrease Alert Level Response",
              "operand": "Rate of Decrease Alert Level value in mg/dL/min",
              "operand_data_type": "medfloat16",
              "description": "This is the normal response to Op Code 0x14."
            },
            {
              "op_code_value": "0x16",
              "definition": "Set Rate of Increase Alert Level",
              "operand": "Rate of Increase Alert Level value in mg/dL/min",
              "operand_data_type": "medfloat16",
              "description": "The response to this control point is Response Code."
            },
            {
              "op_code_value": "0x17",
              "definition": "Get Rate of Increase Alert Level",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "The normal response to this control point is Op Code 0x18. For error conditions, the response is Response Code."
            },
            {
              "op_code_value": "0x18",
              "definition": "Rate of Increase Alert Level Response",
              "operand": "Rate of Increase Alert Level value in mg/dL/min",
              "operand_data_type": "medfloat16",
              "description": "This is the normal response to Op Code 0x17."
            },
            {
              "op_code_value": "0x19",
              "definition": "Reset Device Specific Alert",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "The response to this control point is Response Code."
            },
            {
              "op_code_value": "0x1A",
              "definition": "Start the Session",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "The response to this control point is Response Code."
            },
            {
              "op_code_value": "0x1B",
              "definition": "Stop the Session",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "The response to this control point is Response Code."
            },
            {
              "op_code_value": "0x1C",
              "definition": "Response Code",
              "operand": "Request Op Code, Response Code Value",
              "operand_data_type": "N/A",
              "description": "See \\autoref{sec:org.bluetooth.characteristic.cgm_specific_ops_control_point/field/response_code_values}."
            },
            {
              "op_code_value": "0x1D–0xFF",
              "definition": "Reserved for Future Use",
              "operand": "N/A",
              "operand_data_type": "N/A",
              "description": "N/A"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Response Code Values",
          "key": "response_code_values",
          "anchor": "def-response-code-values",
          "description": "The Response Code Values associated with the CGM Specific Ops Control Point are defined below.",
          "sectionTitle": "Response Code Values",
          "tableCaption": "Response Code Values",
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [
            "response_code_value",
            "definition",
            "description"
          ],
          "rows": [
            {
              "response_code_value": "0x00",
              "definition": "Reserved For Future Use",
              "description": "N/A"
            },
            {
              "response_code_value": "0x01",
              "definition": "Success",
              "description": "Normal response for successful operation."
            },
            {
              "response_code_value": "0x02",
              "definition": "Op Code not supported",
              "description": "Normal response if unsupported Op Code is received."
            },
            {
              "response_code_value": "0x03",
              "definition": "Invalid Operand",
              "description": "Normal response if Operand received does not meet the requirements of the service."
            },
            {
              "response_code_value": "0x04",
              "definition": "Procedure not completed",
              "description": "Normal response if unable to complete a procedure for any reason."
            },
            {
              "response_code_value": "0x05",
              "definition": "Parameter out of range",
              "description": "Normal response if Operand received does not meet the range requirements"
            },
            {
              "response_code_value": "0x06–0xFF",
              "definition": "Reserved for Future Use",
              "description": "N/A"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Calibration Value",
          "key": "calibration_value",
          "anchor": "def-calibration-value",
          "description": "The Operand which is used for setting and getting the calibration value is defined below.",
          "sectionTitle": "Calibration Value",
          "tableCaption": "Calibration Value Operand",
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Glucose Concentration of Calibration",
              "data_type": "medfloat16",
              "size": "2",
              "description": "Glucose value of the calibration.\nUnit: org.bluetooth.unit.mass_density.milligram_per_decilitre"
            },
            {
              "field": "Calibration Time",
              "data_type": "uint16",
              "size": "2",
              "description": "Minutes since the Session Start Time (see \\autoref{sec:org.bluetooth.characteristic.cgm_session_start_time}) of the reported Glucose Concentration of Calibration value.\nUnit: org.bluetooth.unit.time.minute"
            },
            {
              "field": "Calibration Type-Sample Location",
              "data_type": "uint4[2]",
              "size": "1",
              "description": "Definition and field value are the same as CGM Type-Sample Location as described in the CGM Features characteristic (see \\autoref{sec:org.bluetooth.characteristic.cgm_feature/field/cgm_type-sample_location}).\nUnit: org.bluetooth.unit.unitless"
            },
            {
              "field": "Next Calibration Time",
              "data_type": "uint16",
              "size": "2",
              "description": "The next calibration measurement time in minutes since the Session Start Time (see \\autoref{sec:org.bluetooth.characteristic.cgm_session_start_time}).\nUnit: org.bluetooth.unit.time.minute"
            },
            {
              "field": "Calibration Data Record Number",
              "data_type": "uint16",
              "size": "2",
              "description": "Sequence number for the stored calibration record.\nUnit: org.bluetooth.unit.unitless"
            },
            {
              "field": "Calibration Status",
              "data_type": "boolean[8]",
              "size": "1",
              "description": "The result of the calibration procedure of the sensor.\nUnit: org.bluetooth.unit.unitless\n0: Calibration Data rejected (Calibration failed)\n1: Calibration Data out of range\n2: Calibration Process Pending\n3–7: Reserved for Future Use"
            }
          ],
          "layout": [
            {
              "name": "Glucose Concentration of Calibration",
              "anchor": "def-calibration-value--glucose-concentration-of-calibration",
              "type": "medfloat16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.mass_density.milligram_per_decilitre",
                  "name": "mass density (milligram per decilitre)",
                  "evidence": "Unit: org.bluetooth.unit.mass_density.milligram_per_decilitre"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Calibration Time",
              "anchor": "def-calibration-value--calibration-time",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.time.minute",
                  "name": "time (minute)",
                  "evidence": "Unit: org.bluetooth.unit.time.minute"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 2,
              "offsetVariesWith": []
            },
            {
              "name": "Calibration Type-Sample Location",
              "anchor": "def-calibration-value--calibration-type-sample-location",
              "type": "uint4[2]",
              "size": "1",
              "sizeKind": "fixed",
              "sizeN": 1,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 4,
              "offsetVariesWith": []
            },
            {
              "name": "Next Calibration Time",
              "anchor": "def-calibration-value--next-calibration-time",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.time.minute",
                  "name": "time (minute)",
                  "evidence": "Unit: org.bluetooth.unit.time.minute"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 5,
              "offsetVariesWith": []
            },
            {
              "name": "Calibration Data Record Number",
              "anchor": "def-calibration-value--calibration-data-record-number",
              "type": "uint16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 7,
              "offsetVariesWith": []
            },
            {
              "name": "Calibration Status",
              "anchor": "def-calibration-value--calibration-status",
              "type": "boolean[8]",
              "size": "1",
              "sizeKind": "fixed",
              "sizeN": 1,
              "units": [
                {
                  "id": "org.bluetooth.unit.unitless",
                  "name": "unitless",
                  "evidence": "Unit: org.bluetooth.unit.unitless"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 9,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.fitness_machine_feature",
    "uuid": "0x2ACC",
    "name": "Fitness Machine Feature",
    "slug": "fitness-machine-feature",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": null
  },
  {
    "id": "org.bluetooth.characteristic.treadmill_data",
    "uuid": "0x2ACD",
    "name": "Treadmill Data",
    "slug": "treadmill-data",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.treadmill_data.yaml",
      "description": "The Treadmill Data characteristic is used to represent data related to a treadmill.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.treadmill_data/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Instantaneous Speed",
          "anchor": "field-instantaneous-speed",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour\nRepresented values: M = 1, d = -2, b = 0\nUnit is 1/100 of a kilometer per hour\nThe Instantaneous Speed field represents the instantaneous speed of the belt of the treadmill.\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.velocity.kilometre_per_hour",
              "name": "velocity (kilometre per hour)",
              "evidence": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Average Speed",
          "anchor": "field-average-speed",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour\nRepresented values: M = 1, d = -2, b = 0\nUnit is 1/100 of a kilometer per hour\nThe Average Speed field represents the average speed since the beginning of the training session.\nPresent if bit 1 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.velocity.kilometre_per_hour",
              "name": "velocity (kilometre per hour)",
              "evidence": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour"
            }
          ],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed"
          ]
        },
        {
          "name": "Total Distance",
          "anchor": "field-total-distance",
          "type": "uint24",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "Unit: org.bluetooth.unit.length.metre\nThe Total Distance field represents the total distance reported by the Server since the beginning of the training session.\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed"
          ]
        },
        {
          "name": "Inclination",
          "anchor": "field-inclination",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.percentage\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a percent\nThe Inclination field represents the current inclination of the Server. A positive value means that the user feels as if they are going uphill and a negative value means that the user feels as if they are going downhill.\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Base Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance"
          ]
        },
        {
          "name": "Ramp Angle Setting",
          "anchor": "field-ramp-angle-setting",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.plane_angle.degree\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a degree\nThe Ramp Angle Setting field represents the current setting of the ramp angle of the Server.\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.plane_angle.degree",
              "name": "plane angle (degree)",
              "evidence": "Base Unit: org.bluetooth.unit.plane_angle.degree"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination"
          ]
        },
        {
          "name": "Positive Elevation Gain",
          "anchor": "field-positive-elevation-gain",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.length.metre\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a meter\nThe Positive Elevation Gain field represents the positive elevation gain since the training session has started.\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Base Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting"
          ]
        },
        {
          "name": "Negative Elevation Gain",
          "anchor": "field-negative-elevation-gain",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.length.metre\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a meter\nThe Negative Elevation Gain field represents the negative elevation gain since the training session has started.\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Base Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain"
          ]
        },
        {
          "name": "Instantaneous Pace (Time per 500 meters)",
          "anchor": "field-instantaneous-pace-time-per-500-meters",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Instantaneous Pace field represents the instantaneous pace of a user while exercising. This value is directly related to the instantaneous speed of the treadmill but is presented with different units.\nPresent if bit 5 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain"
          ]
        },
        {
          "name": "Average Pace (Time per 500 meters)",
          "anchor": "field-average-pace-time-per-500-meters",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Average Pace field represents the average pace of a user since the beginning of the training session. This value is directly related to the average speed of the treadmill but is presented with different units.\nPresent if bit 6 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 6 of Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Instantaneous Pace (Time per 500 meters)"
          ]
        },
        {
          "name": "Total Energy",
          "anchor": "field-total-energy",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Total Energy field represents the total expended energy of a user since the training session has started.\nPresent if bit 7 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)"
          ]
        },
        {
          "name": "Energy Per Hour",
          "anchor": "field-energy-per-hour",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Hour field represents the average expended energy of a user during a period of one hour.\nPresent if bit 7 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Total Energy"
          ]
        },
        {
          "name": "Energy Per Minute",
          "anchor": "field-energy-per-minute",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Minute field represents the average expended energy of a user during a period of one minute.\nPresent if bit 7 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Total Energy",
            "Energy Per Hour"
          ]
        },
        {
          "name": "Heart Rate",
          "anchor": "field-heart-rate",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nThe Heart Rate field represents the current heart rate value of the user (e.g., measured via the contact heart rate or any other means).\nPresent if bit 8 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute"
          ]
        },
        {
          "name": "Metabolic Equivalent",
          "anchor": "field-metabolic-equivalent",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.metabolic_equivalent\nThe Metabolic Equivalent field represents the metabolic equivalent of the user.\nPresent if bit 9 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.metabolic_equivalent",
              "name": "metabolic equivalent",
              "evidence": "Unit: org.bluetooth.unit.metabolic_equivalent"
            }
          ],
          "presenceText": "Present if bit 9 of Flags field is set to 1",
          "presence": {
            "bit": 9,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 9 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate"
          ]
        },
        {
          "name": "Elapsed Time",
          "anchor": "field-elapsed-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Elapsed Time field represents the elapsed time of a training session since the training session has started.\nPresent if bit 10 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 10 of Flags field is set to 1",
          "presence": {
            "bit": 10,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 10 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent"
          ]
        },
        {
          "name": "Remaining Time",
          "anchor": "field-remaining-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Remaining Time field represents the remaining time of a training session that has been selected.\nPresent if bit 11 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 11 of Flags field is set to 1",
          "presence": {
            "bit": 11,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 11 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent",
            "Elapsed Time"
          ]
        },
        {
          "name": "Force On Belt",
          "anchor": "field-force-on-belt",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.force.newton\nThe Force on Belt field represents the force being applied to the treadmill belt by the user’s steps. A positive value means that the user is accelerating the belt and a negative value means that the user is slowing down the belt\nPresent if bit 12 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.force.newton",
              "name": "force (newton)",
              "evidence": "Unit: org.bluetooth.unit.force.newton"
            }
          ],
          "presenceText": "Present if bit 12 of Flags field is set to 1",
          "presence": {
            "bit": 12,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 12 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent",
            "Elapsed Time",
            "Remaining Time"
          ]
        },
        {
          "name": "Power Output",
          "anchor": "field-power-output",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt\nThe Power Output field represents the power being applied to the treadmill by the user’s steps. A positive value means that the user is accelerating the belt and a negative value means that the user is slowing down the belt.\nPresent if bit 12 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": "Present if bit 12 of Flags field is set to 1",
          "presence": {
            "bit": 12,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 12 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Inclination",
            "Ramp Angle Setting",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent",
            "Elapsed Time",
            "Remaining Time",
            "Force On Belt"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "More Data"
            },
            {
              "bit": "1",
              "description": "Average Speed present"
            },
            {
              "bit": "2",
              "description": "Total Distance present"
            },
            {
              "bit": "3",
              "description": "Inclination and Ramp Angle Setting present"
            },
            {
              "bit": "4",
              "description": "Elevation Gain present"
            },
            {
              "bit": "5",
              "description": "Instantaneous Pace present"
            },
            {
              "bit": "6",
              "description": "Average Pace present"
            },
            {
              "bit": "7",
              "description": "Expended Energy present"
            },
            {
              "bit": "8",
              "description": "Heart Rate present"
            },
            {
              "bit": "9",
              "description": "Metabolic Equivalent present"
            },
            {
              "bit": "10",
              "description": "Elapsed Time present"
            },
            {
              "bit": "11",
              "description": "Remaining Time present"
            },
            {
              "bit": "12",
              "description": "Force On Belt and Power Output present"
            },
            {
              "bit": "13–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.cross_trainer_data",
    "uuid": "0x2ACE",
    "name": "Cross Trainer Data",
    "slug": "cross-trainer-data",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.cross_trainer_data.yaml",
      "description": "The Cross Trainer Data characteristic is used to represent data related to cross trainer activity.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[24]",
          "size": "3",
          "sizeKind": "fixed",
          "sizeN": 3,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.cross_trainer_data/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Instantaneous Speed",
          "anchor": "field-instantaneous-speed",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour\nRepresented values: M = 1, d = -2, b = 0\nUnit is 1/100 of a kilometer per hour\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.velocity.kilometre_per_hour",
              "name": "velocity (kilometre per hour)",
              "evidence": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 3,
          "offsetVariesWith": []
        },
        {
          "name": "Average Speed",
          "anchor": "field-average-speed",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour\nRepresented values: M = 1, d = -2, b = 0\nUnit is 1/100 of a kilometer per hour\nThe Average Speed field represents the average speed since the beginning of the training session.\nPresent if bit 1 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.velocity.kilometre_per_hour",
              "name": "velocity (kilometre per hour)",
              "evidence": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour"
            }
          ],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed"
          ]
        },
        {
          "name": "Total Distance",
          "anchor": "field-total-distance",
          "type": "uint24",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "Unit: org.bluetooth.unit.length.metre\nThe Total Distance field represents the total distance reported by the Server since the beginning of the training session.\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed"
          ]
        },
        {
          "name": "Steps Per Minute",
          "anchor": "field-steps-per-minute",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.step_per_minute\nThe Step per Minute Rate field represents the average step rate of a user during a period of one minute.\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.step_per_minute",
              "name": "step (per minute)",
              "evidence": "Unit: org.bluetooth.unit.step_per_minute"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance"
          ]
        },
        {
          "name": "Average Step Rate",
          "anchor": "field-average-step-rate",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.step_per_minute\nThe Average Step Rate field represents the average step rate since the beginning of the training session.\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.step_per_minute",
              "name": "step (per minute)",
              "evidence": "Unit: org.bluetooth.unit.step_per_minute"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute"
          ]
        },
        {
          "name": "Stride Count",
          "anchor": "field-stride-count",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.unitless\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10\nA stride is a pair of steps\nThe Stride Count field represents the total number of strides since the beginning of the training session.\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Base Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate"
          ]
        },
        {
          "name": "Positive Elevation Gain",
          "anchor": "field-positive-elevation-gain",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.length.metre\nThe Positive Elevation Gain field represents the positive elevation gain since the training session has started.\nPresent if bit 5 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count"
          ]
        },
        {
          "name": "Negative Elevation Gain",
          "anchor": "field-negative-elevation-gain",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.length.metre\nThe Negative Elevation Gain field represents the negative elevation gain since the training session has started.\nPresent if bit 5 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain"
          ]
        },
        {
          "name": "Inclination",
          "anchor": "field-inclination",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.percentage\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a percent\nThe Inclination field represents the current inclination of the Server. A positive value means that the user feels as if they are going uphill and a negative value means that the user feels as if they are going downhill.\nPresent if bit 6 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Base Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": "Present if bit 6 of Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain"
          ]
        },
        {
          "name": "Ramp Setting",
          "anchor": "field-ramp-setting",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.plane_angle.degree\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a degree\nThe Ramp Angle Setting field represents the current setting of the ramp angle of the Server.\nPresent if bit 6 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.plane_angle.degree",
              "name": "plane angle (degree)",
              "evidence": "Base Unit: org.bluetooth.unit.plane_angle.degree"
            }
          ],
          "presenceText": "Present if bit 6 of Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination"
          ]
        },
        {
          "name": "Resistance Level",
          "anchor": "field-resistance-level",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.unitless\nRepresented values: M = 1, d = 1, b = 0\nUnit is 1\nThe Resistance Level field represents the value of the current value of the resistance level of the Server.\nPresent if bit 7 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Base Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination",
            "Ramp Setting"
          ]
        },
        {
          "name": "Instantaneous Power",
          "anchor": "field-instantaneous-power",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt\nThe Instantaneous Power field represents the value of the instantaneous power measured by the Server.\nPresent if bit 8 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination",
            "Ramp Setting",
            "Resistance Level"
          ]
        },
        {
          "name": "Average Power",
          "anchor": "field-average-power",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt\nThe Average Power field represents the value of the average power measured by the Server since the beginning of the training session.\nPresent if bit 9 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": "Present if bit 9 of Flags field is set to 1",
          "presence": {
            "bit": 9,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 9 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination",
            "Ramp Setting",
            "Resistance Level",
            "Instantaneous Power"
          ]
        },
        {
          "name": "Total Energy",
          "anchor": "field-total-energy",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Total Energy field represents the total expended energy of a user since the training session has started.\nPresent if bit 10 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 10 of Flags field is set to 1",
          "presence": {
            "bit": 10,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 10 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination",
            "Ramp Setting",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power"
          ]
        },
        {
          "name": "Energy Per Hour",
          "anchor": "field-energy-per-hour",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Hour field represents the average expended energy of a user during a period of one hour.\nPresent if bit 10 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 10 of Flags field is set to 1",
          "presence": {
            "bit": 10,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 10 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination",
            "Ramp Setting",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy"
          ]
        },
        {
          "name": "Energy Per Minute",
          "anchor": "field-energy-per-minute",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Minute field represents the average expended energy of a user during a period of one minute.\nPresent if bit 10 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 10 of Flags field is set to 1",
          "presence": {
            "bit": 10,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 10 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination",
            "Ramp Setting",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy",
            "Energy Per Hour"
          ]
        },
        {
          "name": "Heart Rate",
          "anchor": "field-heart-rate",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nThe Heart Rate field represents the current heart rate value of the user (e.g., measured via the contact heart rate or any other means).\nPresent if bit 11 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 11 of Flags field is set to 1",
          "presence": {
            "bit": 11,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 11 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination",
            "Ramp Setting",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute"
          ]
        },
        {
          "name": "Metabolic Equivalent",
          "anchor": "field-metabolic-equivalent",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.metabolic_equivalent\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 metabolic equivalent\nThe Metabolic Equivalent field represents the metabolic equivalent of the user.\nPresent if bit 12 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.metabolic_equivalent",
              "name": "metabolic equivalent",
              "evidence": "Base Unit: org.bluetooth.unit.metabolic_equivalent"
            }
          ],
          "presenceText": "Present if bit 12 of Flags field is set to 1",
          "presence": {
            "bit": 12,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 12 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination",
            "Ramp Setting",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate"
          ]
        },
        {
          "name": "Elapsed Time",
          "anchor": "field-elapsed-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Elapsed Time field represents the elapsed time of a training session since the training session has started.\nPresent if bit 13 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 13 of Flags field is set to 1",
          "presence": {
            "bit": 13,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 13 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination",
            "Ramp Setting",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent"
          ]
        },
        {
          "name": "Remaining Time",
          "anchor": "field-remaining-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Remaining Time field represents the remaining time of a training session that has been selected.\nPresent if bit 14 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 14 of Flags field is set to 1",
          "presence": {
            "bit": 14,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 14 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Total Distance",
            "Steps Per Minute",
            "Average Step Rate",
            "Stride Count",
            "Positive Elevation Gain",
            "Negative Elevation Gain",
            "Inclination",
            "Ramp Setting",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent",
            "Elapsed Time"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "More Data"
            },
            {
              "bit": "1",
              "description": "Average Speed present"
            },
            {
              "bit": "2",
              "description": "Total Distance present"
            },
            {
              "bit": "3",
              "description": "Step Count present"
            },
            {
              "bit": "4",
              "description": "Stride Count present"
            },
            {
              "bit": "5",
              "description": "Elevation Gain present"
            },
            {
              "bit": "6",
              "description": "Inclination and Ramp Angle Setting present"
            },
            {
              "bit": "7",
              "description": "Resistance Level present"
            },
            {
              "bit": "8",
              "description": "Instantaneous Power present"
            },
            {
              "bit": "9",
              "description": "Average Power present"
            },
            {
              "bit": "10",
              "description": "Expended Energy present"
            },
            {
              "bit": "11",
              "description": "Heart Rate present"
            },
            {
              "bit": "12",
              "description": "Metabolic Equivalent present"
            },
            {
              "bit": "13",
              "description": "Elapsed Time present"
            },
            {
              "bit": "14",
              "description": "Remaining Time present"
            },
            {
              "bit": "15",
              "description": "Movement Direction:\n0 = Forward\n1 = Backward"
            },
            {
              "bit": "16–23",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.step_climber_data",
    "uuid": "0x2ACF",
    "name": "Step Climber Data",
    "slug": "step-climber-data",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.step_climber_data.yaml",
      "description": "The Step Climber Data characteristic is used to represent data related to a step climber device.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.step_climber_data/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Floors",
          "anchor": "field-floors",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.unitless\nThe Floors field represents the total number of floors counted by the Server since the beginning of the training session.\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Step Count",
          "anchor": "field-step-count",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.unitless\nThe Step Count field represents the total number of steps counted by the Server since the beginning of the training session\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors"
          ]
        },
        {
          "name": "Steps Per Minute",
          "anchor": "field-steps-per-minute",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.step_per_minute\nThe Step per Minute Rate field represents the average step rate of a user during a period of one minute.\nPresent if bit 1 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.step_per_minute",
              "name": "step (per minute)",
              "evidence": "Unit: org.bluetooth.unit.step_per_minute"
            }
          ],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Step Count"
          ]
        },
        {
          "name": "Average Step Rate",
          "anchor": "field-average-step-rate",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.step_per_minute\nThe Average Step Rate field represents the average step rate since the beginning of the training session.\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.step_per_minute",
              "name": "step (per minute)",
              "evidence": "Unit: org.bluetooth.unit.step_per_minute"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Step Count",
            "Steps Per Minute"
          ]
        },
        {
          "name": "Positive Elevation Gain",
          "anchor": "field-positive-elevation-gain",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.length.metre\nThe Positive Elevation Gain field represents the positive elevation gain since the beginning of the training session.\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Step Count",
            "Steps Per Minute",
            "Average Step Rate"
          ]
        },
        {
          "name": "Total Energy",
          "anchor": "field-total-energy",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Total Energy field represents the total expended energy of a user since the training session has started.\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Step Count",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain"
          ]
        },
        {
          "name": "Energy Per Hour",
          "anchor": "field-energy-per-hour",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Hour field represents the average expended energy of a user during a period of one hour.\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Step Count",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Total Energy"
          ]
        },
        {
          "name": "Energy Per Minute",
          "anchor": "field-energy-per-minute",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Minute field represents the average expended energy of a user during a period of one minute.\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Step Count",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Total Energy",
            "Energy Per Hour"
          ]
        },
        {
          "name": "Heart Rate",
          "anchor": "field-heart-rate",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nThe Heart Rate field represents the current heart rate value of the user (e.g., measured via the contact heart rate or any other means).\nPresent if bit 5 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Step Count",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute"
          ]
        },
        {
          "name": "Metabolic Equivalent",
          "anchor": "field-metabolic-equivalent",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.metabolic_equivalent\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 metabolic equivalent\nThe Metabolic Equivalent field represents the metabolic equivalent of the user.\nPresent if bit 6 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.metabolic_equivalent",
              "name": "metabolic equivalent",
              "evidence": "Base Unit: org.bluetooth.unit.metabolic_equivalent"
            }
          ],
          "presenceText": "Present if bit 6 of Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Step Count",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate"
          ]
        },
        {
          "name": "Elapsed Time",
          "anchor": "field-elapsed-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Elapsed Time field represents the elapsed time of a training session since the training session has started.\nPresent if bit 7 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Step Count",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent"
          ]
        },
        {
          "name": "Remaining Time",
          "anchor": "field-remaining-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Remaining Time field represents the remaining time of a selected training session.\nPresent if bit 8 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Step Count",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent",
            "Elapsed Time"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "More Data"
            },
            {
              "bit": "1",
              "description": "Steps Per Minute present"
            },
            {
              "bit": "2",
              "description": "Average Step Rate present"
            },
            {
              "bit": "3",
              "description": "Positive Elevation Gain present"
            },
            {
              "bit": "4",
              "description": "Expended Energy present"
            },
            {
              "bit": "5",
              "description": "Heart Rate present:"
            },
            {
              "bit": "6",
              "description": "Metabolic Equivalent present"
            },
            {
              "bit": "7",
              "description": "Elapsed Time present"
            },
            {
              "bit": "8",
              "description": "Remaining Time present"
            },
            {
              "bit": "9–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.stair_climber_data",
    "uuid": "0x2AD0",
    "name": "Stair Climber Data",
    "slug": "stair-climber-data",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.stair_climber_data.yaml",
      "description": "The Stair Climber Data characteristic is used to represent data related to a stair climber device.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.stair_climber_data/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Floors",
          "anchor": "field-floors",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.unitless\nThe Floors field represents the total number of floors counted by the Server since the beginning of the training session.\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Steps Per Minute",
          "anchor": "field-steps-per-minute",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.step_per_minute\nThe Step per Minute Rate field represents the average step rate of a user during a period of one minute.\nPresent if bit 1 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.step_per_minute",
              "name": "step (per minute)",
              "evidence": "Unit: org.bluetooth.unit.step_per_minute"
            }
          ],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors"
          ]
        },
        {
          "name": "Average Step Rate",
          "anchor": "field-average-step-rate",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.step_per_minute\nThe Average Step Rate field represents the average step rate since the beginning of the training session.\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.step_per_minute",
              "name": "step (per minute)",
              "evidence": "Unit: org.bluetooth.unit.step_per_minute"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Steps Per Minute"
          ]
        },
        {
          "name": "Positive Elevation Gain",
          "anchor": "field-positive-elevation-gain",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.length.metre\nThe Positive Elevation Gain field represents the positive elevation gain since the beginning of the training session.\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Steps Per Minute",
            "Average Step Rate"
          ]
        },
        {
          "name": "Stride Count",
          "anchor": "field-stride-count",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.unitless\nA stride is a pair of steps.\nThe Stride Count field represents the total number of strides since the beginning of the training session.\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain"
          ]
        },
        {
          "name": "Total Energy",
          "anchor": "field-total-energy",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Total Energy field represents the total expended energy of a user since the training session has started.\nPresent if bit 5 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Stride Count"
          ]
        },
        {
          "name": "Energy Per Hour",
          "anchor": "field-energy-per-hour",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Hour field represents the average expended energy of a user during a period of one hour.\nPresent if bit 5 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Stride Count",
            "Total Energy"
          ]
        },
        {
          "name": "Energy Per Minute",
          "anchor": "field-energy-per-minute",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Minute field represents the average expended energy of a user during a period of one minute.\nPresent if bit 5 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Stride Count",
            "Total Energy",
            "Energy Per Hour"
          ]
        },
        {
          "name": "Heart Rate",
          "anchor": "field-heart-rate",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nThe Heart Rate field represents the current heart rate value of the user (e.g., measured via the contact heart rate or any other means).\nPresent if bit 6 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 6 of Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Stride Count",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute"
          ]
        },
        {
          "name": "Metabolic Equivalent",
          "anchor": "field-metabolic-equivalent",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.metabolic_equivalent\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 metabolic equivalent\nThe Metabolic Equivalent field represents the metabolic equivalent of the user.\nPresent if bit 7 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.metabolic_equivalent",
              "name": "metabolic equivalent",
              "evidence": "Base Unit: org.bluetooth.unit.metabolic_equivalent"
            }
          ],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Stride Count",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate"
          ]
        },
        {
          "name": "Elapsed Time",
          "anchor": "field-elapsed-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Elapsed Time field represents the elapsed time of a training session since the training session has started.\nPresent if bit 8 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Stride Count",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent"
          ]
        },
        {
          "name": "Remaining Time",
          "anchor": "field-remaining-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Remaining Time field represents the remaining time of a training session that has been selected.\nPresent if bit 9 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 9 of Flags field is set to 1",
          "presence": {
            "bit": 9,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 9 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Floors",
            "Steps Per Minute",
            "Average Step Rate",
            "Positive Elevation Gain",
            "Stride Count",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent",
            "Elapsed Time"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "More Data"
            },
            {
              "bit": "1",
              "description": "Steps Per Minute present"
            },
            {
              "bit": "2",
              "description": "Average Step Rate present"
            },
            {
              "bit": "3",
              "description": "Positive Elevation Gain present"
            },
            {
              "bit": "4",
              "description": "Stride Count present"
            },
            {
              "bit": "5",
              "description": "Expended Energy present"
            },
            {
              "bit": "6",
              "description": "Heart Rate present"
            },
            {
              "bit": "7",
              "description": "Metabolic Equivalent present"
            },
            {
              "bit": "8",
              "description": "Elapsed Time present"
            },
            {
              "bit": "9",
              "description": "Remaining Time present"
            },
            {
              "bit": "10–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.rower_data",
    "uuid": "0x2AD1",
    "name": "Rower Data",
    "slug": "rower-data",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.rower_data.yaml",
      "description": "The Rower Data characteristic is used to represent data related to a rowing device.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.rower_data/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Stroke Rate",
          "anchor": "field-stroke-rate",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.stroke_per_minute\nRepresented values: M = 1, d = 0, b = -1\nUnit is 1/2 of a stroke per minute\nThe Stroke Rate field represents the instantaneous stroke rate measured by the Server.\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.stroke_per_minute",
              "name": "stroke (per minute)",
              "evidence": "Base Unit: org.bluetooth.unit.stroke_per_minute"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Stroke Count",
          "anchor": "field-stroke-count",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.unitless\nThe Stroke Count field represents the total number of strokes since the beginning of the training session.\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate"
          ]
        },
        {
          "name": "Average Stroke Rate",
          "anchor": "field-average-stroke-rate",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.stroke_per_minute\nRepresented values: M = 1, d = 0, b = -1\nUnit is 1/2 of a stroke per minute\nThe Average Stroke Rate field represents the average speed since the beginning of the training session\nPresent if bit 1 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.stroke_per_minute",
              "name": "stroke (per minute)",
              "evidence": "Base Unit: org.bluetooth.unit.stroke_per_minute"
            }
          ],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count"
          ]
        },
        {
          "name": "Total Distance",
          "anchor": "field-total-distance",
          "type": "uint24",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "Unit: org.bluetooth.unit.length.metre\nThe Total Distance field represents the total distance reported by the Server since the beginning of the training session.\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate"
          ]
        },
        {
          "name": "Instantaneous Pace (Time per 500 meters)",
          "anchor": "field-instantaneous-pace-time-per-500-meters",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Instantaneous Pace field represents the value of the pace (time per 500 meters) of the user while exercising.\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance"
          ]
        },
        {
          "name": "Average Pace (Time per 500 meters)",
          "anchor": "field-average-pace-time-per-500-meters",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Average Pace field represents the value of the average pace (time per 500 meters) since the beginning of the training session.\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)"
          ]
        },
        {
          "name": "Instantaneous Power",
          "anchor": "field-instantaneous-power",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt\nThe Instantaneous Power field represents the value of the instantaneous power measured by the Server.\nPresent if bit 5 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)"
          ]
        },
        {
          "name": "Average Power",
          "anchor": "field-average-power",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt\nThe Average Power field represents the value of the average power measured by the Server since the beginning of the training session.\nPresent if bit 6 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": "Present if bit 6 of Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Instantaneous Power"
          ]
        },
        {
          "name": "Resistance Level",
          "anchor": "field-resistance-level",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.unitless\nRepresented values: M = 1, d = 1, b = 0\nUnit is 1\nThe Resistance Level field represents the value of the current value of the resistance level of the Server.\nPresent if bit 7 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Base Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Instantaneous Power",
            "Average Power"
          ]
        },
        {
          "name": "Total Energy",
          "anchor": "field-total-energy",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Total Energy field represents the total expended energy of a user since the training session has started.\nPresent if bit 8 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Instantaneous Power",
            "Average Power",
            "Resistance Level"
          ]
        },
        {
          "name": "Energy Per Hour",
          "anchor": "field-energy-per-hour",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Hour field represents the average expended energy of a user during a period of one hour.\nPresent if bit 8 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Instantaneous Power",
            "Average Power",
            "Resistance Level",
            "Total Energy"
          ]
        },
        {
          "name": "Energy Per Minute",
          "anchor": "field-energy-per-minute",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Minute field represents the average expended energy of a user during a period of one minute.\nPresent if bit 8 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Instantaneous Power",
            "Average Power",
            "Resistance Level",
            "Total Energy",
            "Energy Per Hour"
          ]
        },
        {
          "name": "Heart Rate",
          "anchor": "field-heart-rate",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nThe Heart Rate field represents the current heart rate value of the user (e.g., measured via the contact heart rate or any other means).\nPresent if bit 9 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 9 of Flags field is set to 1",
          "presence": {
            "bit": 9,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 9 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Instantaneous Power",
            "Average Power",
            "Resistance Level",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute"
          ]
        },
        {
          "name": "Metabolic Equivalent",
          "anchor": "field-metabolic-equivalent",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.metabolic_equivalent\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 metabolic equivalent\nThe Metabolic Equivalent field represents the metabolic equivalent of the user.\nPresent if bit 10 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.metabolic_equivalent",
              "name": "metabolic equivalent",
              "evidence": "Base Unit: org.bluetooth.unit.metabolic_equivalent"
            }
          ],
          "presenceText": "Present if bit 10 of Flags field is set to 1",
          "presence": {
            "bit": 10,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 10 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Instantaneous Power",
            "Average Power",
            "Resistance Level",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate"
          ]
        },
        {
          "name": "Elapsed Time",
          "anchor": "field-elapsed-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Elapsed Time field represents the elapsed time of a training session since the training session has started.\nPresent if bit 11 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 11 of Flags field is set to 1",
          "presence": {
            "bit": 11,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 11 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Instantaneous Power",
            "Average Power",
            "Resistance Level",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent"
          ]
        },
        {
          "name": "Remaining Time",
          "anchor": "field-remaining-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Remaining Time field represents the remaining time of a selected training session.\nPresent if bit 12 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 12 of Flags field is set to 1",
          "presence": {
            "bit": 12,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 12 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Stroke Rate",
            "Stroke Count",
            "Average Stroke Rate",
            "Total Distance",
            "Instantaneous Pace (Time per 500 meters)",
            "Average Pace (Time per 500 meters)",
            "Instantaneous Power",
            "Average Power",
            "Resistance Level",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent",
            "Elapsed Time"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "More Data"
            },
            {
              "bit": "1",
              "description": "Average Stroke rate present"
            },
            {
              "bit": "2",
              "description": "Total Distance present"
            },
            {
              "bit": "3",
              "description": "Instantaneous Pace present"
            },
            {
              "bit": "4",
              "description": "Average Pace present"
            },
            {
              "bit": "5",
              "description": "Instantaneous Power present"
            },
            {
              "bit": "6",
              "description": "Average Power present"
            },
            {
              "bit": "7",
              "description": "Resistance Level present"
            },
            {
              "bit": "8",
              "description": "Expended Energy present"
            },
            {
              "bit": "9",
              "description": "Heart Rate present"
            },
            {
              "bit": "10",
              "description": "Metabolic Equivalent present"
            },
            {
              "bit": "11",
              "description": "Elapsed Time present"
            },
            {
              "bit": "12",
              "description": "Remaining Time present"
            },
            {
              "bit": "13–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.indoor_bike_data",
    "uuid": "0x2AD2",
    "name": "Indoor Bike Data",
    "slug": "indoor-bike-data",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.indoor_bike_data.yaml",
      "description": "The Indoor Bike Data characteristic is used to represent data related to the use of an indoor bike.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[16]",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.indoor_bike_data/field/flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Instantaneous Speed",
          "anchor": "field-instantaneous-speed",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour\nRepresented values: M = 1, d = -2, b = 0\nUnit is 1/100 of a kilometer per hour\nThe Instantaneous Speed field represents the instantaneous speed of the user.\nPresent if bit 0 of Flags field is set to 0",
          "units": [
            {
              "id": "org.bluetooth.unit.velocity.kilometre_per_hour",
              "name": "velocity (kilometre per hour)",
              "evidence": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour"
            }
          ],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Average Speed",
          "anchor": "field-average-speed",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour\nRepresented values: M = 1, d = -2, b = 0\nUnit is 1/100 of a kilometer per hour\nThe Average Speed field represents the average speed since the beginning of the training session.\nPresent if bit 1 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.velocity.kilometre_per_hour",
              "name": "velocity (kilometre per hour)",
              "evidence": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour"
            }
          ],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed"
          ]
        },
        {
          "name": "Instantaneous Cadence",
          "anchor": "field-instantaneous-cadence",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.angular_velocity.revolution_per_minute\nRepresented values: M = 1, d = 0, b = -1\nUnit is 1/2 of a revolution per minute\nThe Instantaneous Cadence field represents the instantaneous cadence of the user.\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.angular_velocity.revolution_per_minute",
              "name": "angular velocity (revolution per minute)",
              "evidence": "Base Unit: org.bluetooth.unit.angular_velocity.revolution_per_minute"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed"
          ]
        },
        {
          "name": "Average Cadence",
          "anchor": "field-average-cadence",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.angular_velocity.revolution_per_minute\nRepresented values: M = 1, d = 0, b = -1\nUnit is 1/2 of a revolution per minute\nThe Average Speed field represents the average cadence since the beginning of the training session.\nPresent if bit 3 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.angular_velocity.revolution_per_minute",
              "name": "angular velocity (revolution per minute)",
              "evidence": "Base Unit: org.bluetooth.unit.angular_velocity.revolution_per_minute"
            }
          ],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence"
          ]
        },
        {
          "name": "Total Distance",
          "anchor": "field-total-distance",
          "type": "uint24",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "Unit: org.bluetooth.unit.length.metre\nThe Total Distance field represents the total distance reported by the Server since the beginning of the training session.\nPresent if bit 4 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence"
          ]
        },
        {
          "name": "Resistance Level",
          "anchor": "field-resistance-level",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.unitless\nRepresented values: M = 1, d = 1, b = 0\nUnit is 1\nThe Resistance Level field represents the value of the current value of the resistance level of the Server.\nPresent if bit 5 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Base Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence",
            "Total Distance"
          ]
        },
        {
          "name": "Instantaneous Power",
          "anchor": "field-instantaneous-power",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt\nThe Instantaneous Power field represents the value of the instantaneous power measured by the Server.\nPresent if bit 6 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": "Present if bit 6 of Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence",
            "Total Distance",
            "Resistance Level"
          ]
        },
        {
          "name": "Average Power",
          "anchor": "field-average-power",
          "type": "sint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt\nThe Average Power field represents the value of the average power measured by the Server since the beginning of the training session.\nPresent if bit 7 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": "Present if bit 7 of Flags field is set to 1",
          "presence": {
            "bit": 7,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 7 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence",
            "Total Distance",
            "Resistance Level",
            "Instantaneous Power"
          ]
        },
        {
          "name": "Total Energy",
          "anchor": "field-total-energy",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Total Energy field represents the total expended energy of a user since the training session has started.\nPresent if bit 8 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence",
            "Total Distance",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power"
          ]
        },
        {
          "name": "Energy Per Hour",
          "anchor": "field-energy-per-hour",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Hour field represents the average expended energy of a user during a period of one hour.\nPresent if bit 8 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence",
            "Total Distance",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy"
          ]
        },
        {
          "name": "Energy Per Minute",
          "anchor": "field-energy-per-minute",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie\nThe Energy per Minute field represents the average expended energy of a user during a period of one minute.\nPresent if bit 8 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": "Present if bit 8 of Flags field is set to 1",
          "presence": {
            "bit": 8,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 8 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence",
            "Total Distance",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy",
            "Energy Per Hour"
          ]
        },
        {
          "name": "Heart Rate",
          "anchor": "field-heart-rate",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nThe Heart Rate field represents the current heart rate value of the user (e.g., measured via the contact heart rate or any other means).\nPresent if bit 9 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 9 of Flags field is set to 1",
          "presence": {
            "bit": 9,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 9 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence",
            "Total Distance",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute"
          ]
        },
        {
          "name": "Metabolic Equivalent",
          "anchor": "field-metabolic-equivalent",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.metabolic_equivalent\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 metabolic equivalent\nThe Metabolic Equivalent field represents the metabolic equivalent of the user.\nPresent if bit 10 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.metabolic_equivalent",
              "name": "metabolic equivalent",
              "evidence": "Base Unit: org.bluetooth.unit.metabolic_equivalent"
            }
          ],
          "presenceText": "Present if bit 10 of Flags field is set to 1",
          "presence": {
            "bit": 10,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 10 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence",
            "Total Distance",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate"
          ]
        },
        {
          "name": "Elapsed Time",
          "anchor": "field-elapsed-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Elapsed Time field represents the elapsed time of a training session since the training session has started.\nPresent if bit 11 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 11 of Flags field is set to 1",
          "presence": {
            "bit": 11,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 11 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence",
            "Total Distance",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent"
          ]
        },
        {
          "name": "Remaining Time",
          "anchor": "field-remaining-time",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nThe Remaining Time field represents the remaining time of a selected training session.\nPresent if bit 12 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 12 of Flags field is set to 1",
          "presence": {
            "bit": 12,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 12 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Instantaneous Speed",
            "Average Speed",
            "Instantaneous Cadence",
            "Average Cadence",
            "Total Distance",
            "Resistance Level",
            "Instantaneous Power",
            "Average Power",
            "Total Energy",
            "Energy Per Hour",
            "Energy Per Minute",
            "Heart Rate",
            "Metabolic Equivalent",
            "Elapsed Time"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "More Data"
            },
            {
              "bit": "1",
              "description": "Average Speed present"
            },
            {
              "bit": "2",
              "description": "Instantaneous Cadence present"
            },
            {
              "bit": "3",
              "description": "Average Cadence present"
            },
            {
              "bit": "4",
              "description": "Total Distance present"
            },
            {
              "bit": "5",
              "description": "Resistance Level present"
            },
            {
              "bit": "6",
              "description": "Instantaneous Power present"
            },
            {
              "bit": "7",
              "description": "Average Power present"
            },
            {
              "bit": "8",
              "description": "Expended Energy present"
            },
            {
              "bit": "9",
              "description": "Heart Rate present"
            },
            {
              "bit": "10",
              "description": "Metabolic Equivalent present"
            },
            {
              "bit": "11",
              "description": "Elapsed Time present"
            },
            {
              "bit": "12",
              "description": "Remaining Time present"
            },
            {
              "bit": "13–15",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.training_status",
    "uuid": "0x2AD3",
    "name": "Training Status",
    "slug": "training-status",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": null
  },
  {
    "id": "org.bluetooth.characteristic.supported_speed_range",
    "uuid": "0x2AD4",
    "name": "Supported Speed Range",
    "slug": "supported-speed-range",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.supported_speed_range.yaml",
      "description": "The Supported Speed Range characteristic is used to represent the speed range supported by a fitness machine.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Minimum Speed",
          "anchor": "field-minimum-speed",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour\nRepresented values: M = 1, d = -2, b = 0\nUnit is 1/100 of a kilometer per hour",
          "units": [
            {
              "id": "org.bluetooth.unit.velocity.kilometre_per_hour",
              "name": "velocity (kilometre per hour)",
              "evidence": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Maximum Speed",
          "anchor": "field-maximum-speed",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour\nRepresented values: M = 1, d = -2, b = 0\nUnit is 1/100 of a kilometer per hour",
          "units": [
            {
              "id": "org.bluetooth.unit.velocity.kilometre_per_hour",
              "name": "velocity (kilometre per hour)",
              "evidence": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Minimum Increment",
          "anchor": "field-minimum-increment",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour\nRepresented values: M = 1, d = -2, b = 0\nUnit is 1/100 of a kilometer per hour",
          "units": [
            {
              "id": "org.bluetooth.unit.velocity.kilometre_per_hour",
              "name": "velocity (kilometre per hour)",
              "evidence": "Base Unit: org.bluetooth.unit.velocity.kilometre_per_hour"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 4,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.supported_inclination_range",
    "uuid": "0x2AD5",
    "name": "Supported Inclination Range",
    "slug": "supported-inclination-range",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.supported_inclination_range.yaml",
      "description": "The Supported Inclination Range characteristic is used to represent the inclination range supported by a fitness machine.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Minimum Inclination",
          "anchor": "field-minimum-inclination",
          "type": "sint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.percentage\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a percent",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Base Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Maximum Inclination",
          "anchor": "field-maximum-inclination",
          "type": "sint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.percentage\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a percent",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Base Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Minimum Increment",
          "anchor": "field-minimum-increment",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.percentage\nRepresented values: M = 1, d = -1, b = 0\nUnit is 1/10 of a percent",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Base Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 4,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.supported_resistance_level_range",
    "uuid": "0x2AD6",
    "name": "Supported Resistance Level Range",
    "slug": "supported-resistance-level-range",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.supported_resistance_level_range.yaml",
      "description": "The Supported Resistance Level Range characteristic is used to represent the resistance level range supported by a fitness machine.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Minimum Resistance Level",
          "anchor": "field-minimum-resistance-level",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.unitless\nRepresented values: M = 1, d = 1, b = 0\nUnit is 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Base Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Maximum Resistance Level",
          "anchor": "field-maximum-resistance-level",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.unitless\nRepresented values: M = 1, d = 1, b = 0\nUnit is 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Base Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Minimum Increment",
          "anchor": "field-minimum-increment",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.unitless\nRepresented values: M = 1, d = 1, b = 0\nUnit is 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Base Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.supported_heart_rate_range",
    "uuid": "0x2AD7",
    "name": "Supported Heart Rate Range",
    "slug": "supported-heart-rate-range",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.supported_heart_rate_range.yaml",
      "description": "The Supported Heart Rate Range characteristic is used to represent the heart rate range supported by a fitness machine.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Minimum Heart Rate",
          "anchor": "field-minimum-heart-rate",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Maximum Heart Rate",
          "anchor": "field-maximum-heart-rate",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Minimum Increment",
          "anchor": "field-minimum-increment",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.supported_power_range",
    "uuid": "0x2AD8",
    "name": "Supported Power Range",
    "slug": "supported-power-range",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.supported_power_range.yaml",
      "description": "The Supported Power Range characteristic is used to represent the power range supported by a fitness machine.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Minimum Power",
          "anchor": "field-minimum-power",
          "type": "sint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Maximum Power",
          "anchor": "field-maximum-power",
          "type": "sint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        },
        {
          "name": "Minimum Increment",
          "anchor": "field-minimum-increment",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.power.watt",
          "units": [
            {
              "id": "org.bluetooth.unit.power.watt",
              "name": "power (watt)",
              "evidence": "Unit: org.bluetooth.unit.power.watt"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 4,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.fitness_machine_control_point",
    "uuid": "0x2AD9",
    "name": "Fitness Machine Control Point",
    "slug": "fitness-machine-control-point",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": null
  },
  {
    "id": "org.bluetooth.characteristic.fitness_machine_status",
    "uuid": "0x2ADA",
    "name": "Fitness Machine Status",
    "slug": "fitness-machine-status",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": null
  },
  {
    "id": "org.bluetooth.characteristic.enhanced_blood_pressure_measurement",
    "uuid": "0x2B34",
    "name": "Enhanced Blood Pressure Measurement",
    "slug": "enhanced-blood-pressure-measurement",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [
      "org.bluetooth.characteristic.enhanced_intermediate_cuff_pressure"
    ],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.enhanced_blood_pressure_measurement.yaml",
      "description": "The Enhanced Blood Pressure Measurement characteristic is used to represent data related to a blood pressure measurement that includes a UTC time stamp and a user facing time.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.enhanced_blood_pressure_measurement/field/flags}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Blood Pressure Measurement Compound Value (mmHg)",
          "anchor": "field-blood-pressure-measurement-compound-value-mmhg",
          "type": "struct",
          "size": "0 or 6",
          "sizeKind": "optional",
          "sizeN": 6,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.enhanced_blood_pressure_measurement/field/blood_pressure_measurement_compound_value_(mmhg)}.\nPresent if bit 0 of Flags field is set to 0",
          "units": [],
          "presenceText": "Present if bit 0 of Flags field is set to 0",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 0,
            "evidence": "Present if bit 0 of Flags field is set to 0"
          },
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Blood Pressure Measurement Compound Value (kPa)",
          "anchor": "field-blood-pressure-measurement-compound-value-kpa",
          "type": "struct",
          "size": "0 or 6",
          "sizeKind": "optional",
          "sizeN": 6,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.enhanced_blood_pressure_measurement/field/blood_pressure_measurement_compound_value_(kpa)}.\nPresent if bit 0 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 0 of Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value (mmHg)"
          ]
        },
        {
          "name": "Time Stamp",
          "anchor": "field-time-stamp",
          "type": "uint32",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "Unit: Seconds, since Epoch Start\nSee \\autoref{sec:org.bluetooth.characteristic.enhanced_blood_pressure_measurement/field/time_stamp}.\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value (mmHg)",
            "Blood Pressure Measurement Compound Value (kPa)"
          ]
        },
        {
          "name": "Pulse Rate",
          "anchor": "field-pulse-rate",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value (mmHg)",
            "Blood Pressure Measurement Compound Value (kPa)",
            "Time Stamp"
          ]
        },
        {
          "name": "User ID",
          "anchor": "field-user-id",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.blood_pressure_measurement/field/user_id}.\nPresent if bit 3 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value (mmHg)",
            "Blood Pressure Measurement Compound Value (kPa)",
            "Time Stamp",
            "Pulse Rate"
          ]
        },
        {
          "name": "Measurement Status",
          "anchor": "field-measurement-status",
          "type": "boolean[16]",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.blood_pressure_measurement/field/measurement_status}.\nPresent if bit 4 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value (mmHg)",
            "Blood Pressure Measurement Compound Value (kPa)",
            "Time Stamp",
            "Pulse Rate",
            "User ID"
          ]
        },
        {
          "name": "User Facing Time",
          "anchor": "field-user-facing-time",
          "type": "uint32",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "Unit: Seconds, since Epoch Start\nSee \\autoref{sec:org.bluetooth.characteristic.enhanced_blood_pressure_measurement/field/user_facing_time}.\nPresent if bit 5 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Blood Pressure Measurement Compound Value (mmHg)",
            "Blood Pressure Measurement Compound Value (kPa)",
            "Time Stamp",
            "Pulse Rate",
            "User ID",
            "Measurement Status"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Blood Pressure Measurement Units Flag\n0 = Blood pressure for Systolic, Diastolic and MAP in units of mmHg\n1 = Blood pressure for Systolic, Diastolic and MAP in units of kPa"
            },
            {
              "bit": "1",
              "description": "Time Stamp Flag\n0 = Time Stamp not present\n1 = Time Stamp present"
            },
            {
              "bit": "2",
              "description": "Pulse Rate Flag\n0 = Pulse Rate not present\n1 = Pulse Rate present"
            },
            {
              "bit": "3",
              "description": "User ID Flag\n0 = User ID not present\n1 = User ID present"
            },
            {
              "bit": "4",
              "description": "Measurement Status Flag\n0 = Measurement Status not present\n1 = Measurement Status present"
            },
            {
              "bit": "5",
              "description": "User Facing Time Flag\n0 = User Facing Time not present\n1 = User Facing Time present"
            },
            {
              "bit": "6",
              "description": "Epoch Start 2000 Flag\n0 = Epoch start is January 1, 1900 (00:00:00)\n1 = Epoch start is January 1, 2000 (00:00:00)"
            },
            {
              "bit": "7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Blood Pressure Measurement Compound Value (mmHg)",
          "key": "blood_pressure_measurement_compound_value_(mmhg)",
          "anchor": "def-blood-pressure-measurement-compound-value-mmhg",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Systolic (mmHg)",
              "data_type": "medfloat16",
              "size": "2",
              "description": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
            },
            {
              "field": "Diastolic (mmHg)",
              "data_type": "medfloat16",
              "size": "2",
              "description": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
            },
            {
              "field": "Mean Arterial Pressure (mmHg)",
              "data_type": "medfloat16",
              "size": "2",
              "description": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
            }
          ],
          "layout": [
            {
              "name": "Systolic (mmHg)",
              "anchor": "def-blood-pressure-measurement-compound-value-mmhg--systolic-mmhg",
              "type": "medfloat16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.pressure.millimetre_of_mercury",
                  "name": "pressure (millimetre of mercury)",
                  "evidence": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Diastolic (mmHg)",
              "anchor": "def-blood-pressure-measurement-compound-value-mmhg--diastolic-mmhg",
              "type": "medfloat16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.pressure.millimetre_of_mercury",
                  "name": "pressure (millimetre of mercury)",
                  "evidence": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 2,
              "offsetVariesWith": []
            },
            {
              "name": "Mean Arterial Pressure (mmHg)",
              "anchor": "def-blood-pressure-measurement-compound-value-mmhg--mean-arterial-pressure-mmhg",
              "type": "medfloat16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.pressure.millimetre_of_mercury",
                  "name": "pressure (millimetre of mercury)",
                  "evidence": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 4,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        },
        {
          "name": "Blood Pressure Measurement Compound Value (kPa)",
          "key": "blood_pressure_measurement_compound_value_(kpa)",
          "anchor": "def-blood-pressure-measurement-compound-value-kpa",
          "description": "The structure of this field is defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "struct",
          "columns": [
            "field",
            "data_type",
            "size",
            "description"
          ],
          "rows": [
            {
              "field": "Systolic (kPa)",
              "data_type": "medfloat16",
              "size": "2",
              "description": "Base Unit: org.bluetooth.unit.pressure.pascal;\nM = 1, d = 3, and b = 0"
            },
            {
              "field": "Diastolic (kPa)",
              "data_type": "medfloat16",
              "size": "2",
              "description": "Base Unit: org.bluetooth.unit.pressure.pascal;\nM = 1, d = 3, and b = 0"
            },
            {
              "field": "Mean Arterial Pressure (kPa)",
              "data_type": "medfloat16",
              "size": "2",
              "description": "Base Unit: org.bluetooth.unit.pressure.pascal;\nM = 1, d = 3, and b = 0"
            }
          ],
          "layout": [
            {
              "name": "Systolic (kPa)",
              "anchor": "def-blood-pressure-measurement-compound-value-kpa--systolic-kpa",
              "type": "medfloat16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.pressure.pascal",
                  "name": "pressure (pascal)",
                  "evidence": "Base Unit: org.bluetooth.unit.pressure.pascal;"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 0,
              "offsetVariesWith": []
            },
            {
              "name": "Diastolic (kPa)",
              "anchor": "def-blood-pressure-measurement-compound-value-kpa--diastolic-kpa",
              "type": "medfloat16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.pressure.pascal",
                  "name": "pressure (pascal)",
                  "evidence": "Base Unit: org.bluetooth.unit.pressure.pascal;"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 2,
              "offsetVariesWith": []
            },
            {
              "name": "Mean Arterial Pressure (kPa)",
              "anchor": "def-blood-pressure-measurement-compound-value-kpa--mean-arterial-pressure-kpa",
              "type": "medfloat16",
              "size": "2",
              "sizeKind": "fixed",
              "sizeN": 2,
              "units": [
                {
                  "id": "org.bluetooth.unit.pressure.pascal",
                  "name": "pressure (pascal)",
                  "evidence": "Base Unit: org.bluetooth.unit.pressure.pascal;"
                }
              ],
              "presenceText": null,
              "presence": null,
              "offset": 4,
              "offsetVariesWith": []
            }
          ],
          "subfields": []
        },
        {
          "name": "Time Stamp",
          "key": "time_stamp",
          "anchor": "def-time-stamp",
          "description": "This field represents the Sensor time in seconds since the epoch start time. The epoch start is on January 1 of 1900, or 2000 at 00:00:00, depending on the value of the Epoch Start 2000 Flag.\nWhen both the Time Stamp field and the User Facing Time field are present, the Time Stamp field represents the base time (possibly UTC aligned) and does not take into account time zone, DST adjustments or manual adjustments of the time displayed to a user.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "User Facing Time",
          "key": "user_facing_time",
          "anchor": "def-user-facing-time",
          "description": "This field represents the user facing time in seconds since the epoch start time. The epoch start is on January 1 of 1900, or 2000 at 00:00:00, depending on the value of the Epoch Start 2000 Flag.\nUser facing time takes into account time zone, DST adjustments and manual adjustments of the time displayed to a user.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.enhanced_intermediate_cuff_pressure",
    "uuid": "0x2B35",
    "name": "Enhanced Intermediate Cuff Pressure",
    "slug": "enhanced-intermediate-cuff-pressure",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.enhanced_intermediate_cuff_pressure.yaml",
      "description": "The Enhanced Intermediate Cuff Pressure characteristic is used to represent enhanced intermediate Cuff Pressure values for display purposes while a measurement is in progress and includes a UTC time stamp and a user facing time.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Flags",
          "anchor": "field-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.enhanced_intermediate_cuff_pressure/field/flags}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Intermediate Cuff Pressure Value",
          "anchor": "field-intermediate-cuff-pressure-value",
          "type": "medfloat16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury\nor\nBase Unit: org.bluetooth.unit.pressure.pascal;\nM = 1, d = 3, and b = 0\nIf bit 0 of the Flags field is set to 0, units are mmHG, else units are kPa.",
          "units": [
            {
              "id": "org.bluetooth.unit.pressure.millimetre_of_mercury",
              "name": "pressure (millimetre of mercury)",
              "evidence": "Unit: org.bluetooth.unit.pressure.millimetre_of_mercury"
            },
            {
              "id": "org.bluetooth.unit.pressure.pascal",
              "name": "pressure (pascal)",
              "evidence": "Base Unit: org.bluetooth.unit.pressure.pascal;"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Time Stamp",
          "anchor": "field-time-stamp",
          "type": "uint32",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "Unit: Seconds since Epoch Start\nSee \\autoref{sec:org.bluetooth.characteristic.enhanced_blood_pressure_measurement/field/time_stamp}.\nPresent if bit 1 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 1 of Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Flags field is set to 1"
          },
          "offset": 3,
          "offsetVariesWith": []
        },
        {
          "name": "Pulse Rate",
          "anchor": "field-pulse-rate",
          "type": "medfloat16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nPresent if bit 2 of Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if bit 2 of Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp"
          ]
        },
        {
          "name": "User ID",
          "anchor": "field-user-id",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.blood_pressure_measurement/field/user_id}.\nPresent if bit 3 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 3 of Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "Pulse Rate"
          ]
        },
        {
          "name": "Measurement Status",
          "anchor": "field-measurement-status",
          "type": "boolean[16]",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.blood_pressure_measurement/field/measurement_status}.\nPresent if bit 4 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 4 of Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "Pulse Rate",
            "User ID"
          ]
        },
        {
          "name": "User Facing Time",
          "anchor": "field-user-facing-time",
          "type": "uint32",
          "size": "0 or 4",
          "sizeKind": "optional",
          "sizeN": 4,
          "description": "Unit: Seconds since Epoch Start\nSee \\autoref{sec:org.bluetooth.characteristic.enhanced_blood_pressure_measurement/field/user_facing_time}.\nPresent if bit 5 of Flags field is set to 1",
          "units": [],
          "presenceText": "Present if bit 5 of Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Time Stamp",
            "Pulse Rate",
            "User ID",
            "Measurement Status"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Flags",
          "key": "flags",
          "anchor": "def-flags",
          "description": "The bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Intermediate Cuff Pressure Measurement Units Flag\n0 = Intermediate Cuff Pressure in units of mmHg\n1 = Intermediate Cuff Pressure in units of kPa"
            },
            {
              "bit": "1",
              "description": "Time Stamp Flag\n0 = Time Stamp not present\n1 = Time Stamp present"
            },
            {
              "bit": "2",
              "description": "Pulse Rate Flag\n0 = Pulse Rate not present\n1 = Pulse Rate present"
            },
            {
              "bit": "3",
              "description": "User ID Flag\n0 = User ID not present\n1 = User ID present"
            },
            {
              "bit": "4",
              "description": "Measurement Status Flag\n0 = Measurement Status not present\n1 = Measurement Status present"
            },
            {
              "bit": "5",
              "description": "User Facing Time Flag\n0 = User Facing Time not present\n1 = User Facing Time present"
            },
            {
              "bit": "6",
              "description": "Epoch Start 2000 Flag\n0 = Epoch start is January 1, 1900 (00:00:00)\n1 = Epoch start is January 1, 2000 (00:00:00)"
            },
            {
              "bit": "7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.blood_pressure_record",
    "uuid": "0x2B36",
    "name": "Blood Pressure Record",
    "slug": "blood-pressure-record",
    "scopeReason": "device",
    "services": [],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.blood_pressure_record.yaml",
      "description": "The Blood Pressure Record characteristic is a container that represents a stored value of a blood pressure measurement or of any other characteristic as specified by the service using the characteristic.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Segmentation Header",
          "anchor": "field-segmentation-header",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.blood_pressure_record/field/segmentation_header}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Sequence Number",
          "anchor": "field-sequence-number",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Contains a sequence number of the record. The sequence number starts at 0 and loops back to 0 after 65536 records (per user).\nSee \\autoref{sec:org.bluetooth.characteristic.blood_pressure_record/field/sequence_number}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "UUID",
          "anchor": "field-uuid",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Contains the UUID of the contained characteristic value.\nSee \\autoref{sec:org.bluetooth.characteristic.blood_pressure_record/field/uuid}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 3,
          "offsetVariesWith": []
        },
        {
          "name": "Recorded Characteristic",
          "anchor": "field-recorded-characteristic",
          "type": "Determined by UUID",
          "size": "Variable",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "Contains a part of or a complete characteristic value.\nSee \\autoref{sec:org.bluetooth.characteristic.blood_pressure_record/field/recorded_characteristic}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 5,
          "offsetVariesWith": []
        },
        {
          "name": "E2E-CRC",
          "anchor": "field-e2e-crc",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Contains the CRC over all the data of a complete single or multi-message record.\nSee \\autoref{sec:org.bluetooth.characteristic.blood_pressure_record/field/e2e-crc}.\nThe presence of this field is defined by the service using this characteristic.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": null,
          "offsetVariesWith": [
            "Recorded Characteristic"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Segmentation Header",
          "key": "segmentation_header",
          "anchor": "def-segmentation-header",
          "description": "The Segmentation Header field provides information about which segments to concatenate to get a complete Blood Pressure Record value.\nThe bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "First Segment: the characteristic contains the first segment of a record\n0 = False\n1 = True"
            },
            {
              "bit": "1",
              "description": "Last Segment: The characteristic contains the last segment of a record\n0 = False\n1 = True"
            },
            {
              "bit": "2–7",
              "description": "Rolling Segment Counter: 0 to 63\nIf the Rolling Segment Counter is equal to 63, it rolls over to 0 when it is next incremented."
            }
          ],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Sequence Number",
          "key": "sequence_number",
          "anchor": "def-sequence-number",
          "description": "The sequence number field contains the sequence number of a record. The sequence number starts at 0 and loops back to 0 after 65536 records and is used to number a sequence of records as defined by the service.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "UUID",
          "key": "uuid",
          "anchor": "def-uuid",
          "description": "The UUID field contains the 16-bit Bluetooth SIG assigned number for a Bluetooth SIG defined characteristic. Supported values are typically constrained by the service. See \\RefRef{assigned_numbers} for the list of SIG Assigned Numbers for GATT characteristic UUIDs.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "Recorded Characteristic",
          "key": "recorded_characteristic",
          "anchor": "def-recorded-characteristic",
          "description": "The Recorded Characteristic field contains a partial or a complete characteristic value. The characteristic value is identified by the UUID field. For most UUID values, the definition of the corresponding characteristic value is included in this document.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        },
        {
          "name": "E2E-CRC",
          "key": "e2e-crc",
          "anchor": "def-e2e-crc",
          "description": "If the service using the Blood Pressure Record characteristic supports E2E-CRC, the status of the recorded characteristic is secured by a CRC calculated over all fields of all parts of a multi-message record not including the E2E-CRC-field itself. See \\autoref{sec:crc_calculation} for further information about the CRC calculation.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.preferred_units",
    "uuid": "0x2B46",
    "name": "Preferred Units",
    "slug": "preferred-units",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.preferred_units.yaml",
      "description": "The Preferred Units characteristic is the list of units the user prefers.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Units",
          "anchor": "field-units",
          "type": "uint16 [1-256]",
          "size": "2–512",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.preferred_units/field/units}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Units",
          "key": "units",
          "anchor": "def-units",
          "description": "This field is an array of 16-bit UUIDs from the available units defined in the Bluetooth SIG Assigned Numbers \\RefRef{assigned_numbers}.\nIf there are multiple entries for the same physical quantity in the array, the order of the units defines the preference (the first unit is the most preferred; the last unit is the least preferred).",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.high_resolution_height",
    "uuid": "0x2B47",
    "name": "High Resolution Height",
    "slug": "high-resolution-height",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.high_resolution_height.yaml",
      "description": "The High Resolution Height characteristic is used to represent the height of a user and is used when a resolution of 0.1 mm is required.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Height",
          "anchor": "field-height",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.length.meter\nRepresented values: M = 1, d = -4, b = 0\nUnit is meter with 0.0001 m (e.g., 0.1 mm)",
          "units": [
            {
              "id": "org.bluetooth.unit.length.meter",
              "name": null,
              "evidence": "Base Unit: org.bluetooth.unit.length.meter"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.middle_name",
    "uuid": "0x2B48",
    "name": "Middle Name",
    "slug": "middle-name",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.middle_name.yaml",
      "description": "The Middle Name characteristic is used to represent the middle name of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Middle Name",
          "anchor": "field-middle-name",
          "type": "utf8s",
          "size": "variable",
          "sizeKind": "variable",
          "sizeN": null,
          "description": "UTF-8 string",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.stride_length",
    "uuid": "0x2B49",
    "name": "Stride Length",
    "slug": "stride-length",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.stride_length.yaml",
      "description": "The Stride Length characteristic is used to represent the stride length of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Stride Length",
          "anchor": "field-stride-length",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.length.metre\nRepresented values: M = 1, d = -3, b = 0\nUnit is meter with a resolution of 0.001 m (e.g., 1 mm)",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Base Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.handedness",
    "uuid": "0x2B4A",
    "name": "Handedness",
    "slug": "handedness",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.handedness.yaml",
      "description": "The Handedness characteristic is used to represent the handedness of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Handedness",
          "anchor": "field-handedness",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.handedness/field/handedness}.",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Handedness",
          "key": "handedness",
          "anchor": "def-handedness",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x00",
              "description": "Left handed"
            },
            {
              "value": "0x01",
              "description": "Right handed"
            },
            {
              "value": "0x02",
              "description": "Ambidextrous"
            },
            {
              "value": "0x03",
              "description": "Unspecified"
            },
            {
              "value": "0x04–0xFF",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.device_wearing_position",
    "uuid": "0x2B4B",
    "name": "Device Wearing Position",
    "slug": "device-wearing-position",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.device_wearing_position.yaml",
      "description": "The Device Wearing Position characteristic is used to represent the position where a user is wearing the device.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Device Wearing Position",
          "anchor": "field-device-wearing-position",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.device_wearing_position/field/device_wearing_position}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Device Wearing Position",
          "key": "device_wearing_position",
          "anchor": "def-device-wearing-position",
          "description": "The values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0x00",
              "description": "Other"
            },
            {
              "value": "0x01",
              "description": "Head"
            },
            {
              "value": "0x02",
              "description": "Head_Ear"
            },
            {
              "value": "0x03",
              "description": "Head_Ear_Right"
            },
            {
              "value": "0x04",
              "description": "Head_Ear_Left"
            },
            {
              "value": "0x05",
              "description": "Head_Neck"
            },
            {
              "value": "0x06",
              "description": "Trunk"
            },
            {
              "value": "0x07",
              "description": "Trunk_Pelvis"
            },
            {
              "value": "0x08",
              "description": "Trunk_Pelvis_Right"
            },
            {
              "value": "0x09",
              "description": "Trunk_Pelvis_Left"
            },
            {
              "value": "0x0A",
              "description": "Trunk_Thorax"
            },
            {
              "value": "0x0B",
              "description": "Trunk_Thorax_Right"
            },
            {
              "value": "0x0C",
              "description": "Trunk_Thorax_Left"
            },
            {
              "value": "0x0D",
              "description": "Trunk_Back"
            },
            {
              "value": "0x0E",
              "description": "UpperExtremity"
            },
            {
              "value": "0x0F",
              "description": "UpperExtremity_Right"
            },
            {
              "value": "0x10",
              "description": "UpperExtremity_Left"
            },
            {
              "value": "0x11",
              "description": "UpperExtremity_Wrist"
            },
            {
              "value": "0x12",
              "description": "UpperExtremity_Wrist_Right"
            },
            {
              "value": "0x13",
              "description": "UpperExtremity_Wrist_Left"
            },
            {
              "value": "0x14",
              "description": "UpperExtremity_Finger"
            },
            {
              "value": "0x15",
              "description": "UpperExtremity_Finger_Right"
            },
            {
              "value": "0x16",
              "description": "UpperExtremity_Finger_Left"
            },
            {
              "value": "0x17",
              "description": "UpperExtremity_Hand"
            },
            {
              "value": "0x18",
              "description": "UpperExtremity_Hand_Right"
            },
            {
              "value": "0x19",
              "description": "UpperExtremity_Hand_Left"
            },
            {
              "value": "0x1A",
              "description": "LowerExtremity"
            },
            {
              "value": "0x1B",
              "description": "LowerExtremity_Right"
            },
            {
              "value": "0x1C",
              "description": "LowerExtremity_Left"
            },
            {
              "value": "0x1D",
              "description": "LowerExtremity_Ankle"
            },
            {
              "value": "0x1E",
              "description": "LowerExtremity_Ankle_Right"
            },
            {
              "value": "0x1F",
              "description": "LowerExtremity_Ankle_Left"
            },
            {
              "value": "0x20",
              "description": "LowerExtremity_Foot"
            },
            {
              "value": "0x21",
              "description": "LowerExtremity_Foot_Right"
            },
            {
              "value": "0x22",
              "description": "LowerExtremity_Foot_Left"
            },
            {
              "value": "0x23",
              "description": "Pants_Pocket"
            },
            {
              "value": "0x24",
              "description": "Pants_Pocket_Right"
            },
            {
              "value": "0x25",
              "description": "Pants_Pocket_Left"
            },
            {
              "value": "0x26",
              "description": "Chest_Pocket"
            },
            {
              "value": "0x27",
              "description": "Chest_Pocket_Right"
            },
            {
              "value": "0x28",
              "description": "Chest_Pocket_Left"
            },
            {
              "value": "0x29–0xFF",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.four_zone_heart_rate_limits",
    "uuid": "0x2B4C",
    "name": "Four Zone Heart Rate Limits",
    "slug": "four-zone-heart-rate-limits",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.four_zone_heart_rate_limits.yaml",
      "description": "The Four Zone Heart Rate Limits characteristic is used to represent the limits between the heart rate zones for the four-zone heart rate definition (Maximum, Hard, Moderate, and Light) of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Four Zone Heart Rate Limits - Light / Moderate Limit",
          "anchor": "field-four-zone-heart-rate-limits-light-moderate-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Four Zone Heart Rate Limits - Moderate / Hard Limit",
          "anchor": "field-four-zone-heart-rate-limits-moderate-hard-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Four Zone Heart Rate Limits - Hard / Maximum Limit",
          "anchor": "field-four-zone-heart-rate-limits-hard-maximum-limit",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 2,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.high_intensity_exercise_threshold",
    "uuid": "0x2B4D",
    "name": "High Intensity Exercise Threshold",
    "slug": "high-intensity-exercise-threshold",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.high_intensity_exercise_threshold.yaml",
      "description": "The High Intensity Exercise Threshold characteristic is used to represent the high intensity exercise threshold of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Field Selector",
          "anchor": "field-field-selector",
          "type": "uint8",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.high_intensity_exercise_threshold/field/field_selector}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Threshold as Energy Expenditure per Hour",
          "anchor": "field-threshold-as-energy-expenditure-per-hour",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.energy.joule\nRepresented values: M = 1, d = 3, b = 0\nUnit is joule with a resolution of 1000 joules\nPresent if value of Field Selector field is 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.joule",
              "name": "energy (joule)",
              "evidence": "Base Unit: org.bluetooth.unit.energy.joule"
            }
          ],
          "presenceText": "Present if value of Field Selector field is 1",
          "presence": null,
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Threshold as Metabolic Equivalent",
          "anchor": "field-threshold-as-metabolic-equivalent",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Base Unit: org.bluetooth.unit.metabolic_equivalent\nRepresented values: M = 1, d = -1, b = 0\nUnit is MET with a resolution of 0.1 MET (i.e., kcal/kg/hour)\nPresent if value of Field Selector field is 2",
          "units": [
            {
              "id": "org.bluetooth.unit.metabolic_equivalent",
              "name": "metabolic equivalent",
              "evidence": "Base Unit: org.bluetooth.unit.metabolic_equivalent"
            }
          ],
          "presenceText": "Present if value of Field Selector field is 2",
          "presence": null,
          "offset": null,
          "offsetVariesWith": [
            "Threshold as Energy Expenditure per Hour"
          ]
        },
        {
          "name": "Threshold as Percentage of Maximum Heart Rate",
          "anchor": "field-threshold-as-percentage-of-maximum-heart-rate",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.percentage\nPresent if value of Field Selector field is 3",
          "units": [
            {
              "id": "org.bluetooth.unit.percentage",
              "name": "percentage",
              "evidence": "Unit: org.bluetooth.unit.percentage"
            }
          ],
          "presenceText": "Present if value of Field Selector field is 3",
          "presence": null,
          "offset": null,
          "offsetVariesWith": [
            "Threshold as Energy Expenditure per Hour",
            "Threshold as Metabolic Equivalent"
          ]
        },
        {
          "name": "Threshold as Heart Rate",
          "anchor": "field-threshold-as-heart-rate",
          "type": "uint8",
          "size": "0 or 1",
          "sizeKind": "optional",
          "sizeN": 1,
          "description": "Unit: org.bluetooth.unit.period.beats_per_minute\nPresent if value of Field Selector field is 4",
          "units": [
            {
              "id": "org.bluetooth.unit.period.beats_per_minute",
              "name": "period (beats per minute)",
              "evidence": "Unit: org.bluetooth.unit.period.beats_per_minute"
            }
          ],
          "presenceText": "Present if value of Field Selector field is 4",
          "presence": null,
          "offset": null,
          "offsetVariesWith": [
            "Threshold as Energy Expenditure per Hour",
            "Threshold as Metabolic Equivalent",
            "Threshold as Percentage of Maximum Heart Rate"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Field Selector",
          "key": "field_selector",
          "anchor": "def-field-selector",
          "description": "The Field Selector field determines the High Intensity Exercise Threshold characteristic field selected to express the high intensity threshold. The selected field is present in the High Intensity Exercise Threshold characteristic, whereas the remaining fields are not present.\nThe values of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "values",
          "columns": [
            "value",
            "description"
          ],
          "rows": [
            {
              "value": "0",
              "description": "No field is selected"
            },
            {
              "value": "1",
              "description": "The Threshold as Energy Expenditure per Hour field is selected"
            },
            {
              "value": "2",
              "description": "The Threshold as Metabolic Equivalent field is selected"
            },
            {
              "value": "3",
              "description": "The Threshold as Percentage of Maximum Heart Rate field is selected"
            },
            {
              "value": "4",
              "description": "The Threshold as Heart Rate field is selected"
            },
            {
              "value": "5–255",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.activity_goal",
    "uuid": "0x2B4E",
    "name": "Activity Goal",
    "slug": "activity-goal",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": true,
    "pageReason": "fields",
    "gss": {
      "file": "gss/org.bluetooth.characteristic.activity_goal.yaml",
      "description": "The Activity Goal characteristic is used to represent the goal or target of a user, such as number of steps or total energy expenditure, related to a physical activity session.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Presence Flags",
          "anchor": "field-presence-flags",
          "type": "boolean[8]",
          "size": "1",
          "sizeKind": "fixed",
          "sizeN": 1,
          "description": "See \\autoref{sec:org.bluetooth.characteristic.activity_goal/field/presence_flags}",
          "units": [],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        },
        {
          "name": "Total Energy Expenditure",
          "anchor": "field-total-energy-expenditure",
          "type": "uint16",
          "size": "0 or 2",
          "sizeKind": "optional",
          "sizeN": 2,
          "description": "Base Unit: org.bluetooth.unit.energy.joule\nRepresented values: M = 1, d = 3, b = 0\nUnit is joule with a resolution of 1000 J.\nPresent if bit 0 of Presence Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.joule",
              "name": "energy (joule)",
              "evidence": "Base Unit: org.bluetooth.unit.energy.joule"
            }
          ],
          "presenceText": "Present if bit 0 of Presence Flags field is set to 1",
          "presence": {
            "bit": 0,
            "field": "Presence Flags",
            "value": 1,
            "evidence": "Present if bit 0 of Presence Flags field is set to 1"
          },
          "offset": 1,
          "offsetVariesWith": []
        },
        {
          "name": "Normal Walking Steps",
          "anchor": "field-normal-walking-steps",
          "type": "uint24",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "Unit: org.bluetooth.unit.unitless\nPresent if bit 1 of Presence Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 1 of Presence Flags field is set to 1",
          "presence": {
            "bit": 1,
            "field": "Presence Flags",
            "value": 1,
            "evidence": "Present if bit 1 of Presence Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Total Energy Expenditure"
          ]
        },
        {
          "name": "Intensity Steps",
          "anchor": "field-intensity-steps",
          "type": "uint24",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "Unit: org.bluetooth.unit.unitless\nPresent if bit 2 of Presence Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 2 of Presence Flags field is set to 1",
          "presence": {
            "bit": 2,
            "field": "Presence Flags",
            "value": 1,
            "evidence": "Present if bit 2 of Presence Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Total Energy Expenditure",
            "Normal Walking Steps"
          ]
        },
        {
          "name": "Floor Steps",
          "anchor": "field-floor-steps",
          "type": "uint24",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "Unit: org.bluetooth.unit.unitless\nPresent if bit 3 of Presence Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.unitless",
              "name": "unitless",
              "evidence": "Unit: org.bluetooth.unit.unitless"
            }
          ],
          "presenceText": "Present if bit 3 of Presence Flags field is set to 1",
          "presence": {
            "bit": 3,
            "field": "Presence Flags",
            "value": 1,
            "evidence": "Present if bit 3 of Presence Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Total Energy Expenditure",
            "Normal Walking Steps",
            "Intensity Steps"
          ]
        },
        {
          "name": "Distance",
          "anchor": "field-distance",
          "type": "uint24",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "Base Unit: org.bluetooth.unit.length.metre\nRepresented values: M = 1, d = 1, b = 0\nUnit is meter with a resolution of 1 m.\nPresent if bit 4 of Presence Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.length.metre",
              "name": "length (metre)",
              "evidence": "Base Unit: org.bluetooth.unit.length.metre"
            }
          ],
          "presenceText": "Present if bit 4 of Presence Flags field is set to 1",
          "presence": {
            "bit": 4,
            "field": "Presence Flags",
            "value": 1,
            "evidence": "Present if bit 4 of Presence Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Total Energy Expenditure",
            "Normal Walking Steps",
            "Intensity Steps",
            "Floor Steps"
          ]
        },
        {
          "name": "Duration of Normal Walking",
          "anchor": "field-duration-of-normal-walking",
          "type": "uint24",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "Unit: org.bluetooth.unit.time.second\nPresent if bit 5 of Presence Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 5 of Presence Flags field is set to 1",
          "presence": {
            "bit": 5,
            "field": "Presence Flags",
            "value": 1,
            "evidence": "Present if bit 5 of Presence Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Total Energy Expenditure",
            "Normal Walking Steps",
            "Intensity Steps",
            "Floor Steps",
            "Distance"
          ]
        },
        {
          "name": "Duration of Intensity Walking",
          "anchor": "field-duration-of-intensity-walking",
          "type": "uint24",
          "size": "0 or 3",
          "sizeKind": "optional",
          "sizeN": 3,
          "description": "Unit: org.bluetooth.unit.time.second\nPresent if bit 6 of Presence Flags field is set to 1",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": "Present if bit 6 of Presence Flags field is set to 1",
          "presence": {
            "bit": 6,
            "field": "Presence Flags",
            "value": 1,
            "evidence": "Present if bit 6 of Presence Flags field is set to 1"
          },
          "offset": null,
          "offsetVariesWith": [
            "Total Energy Expenditure",
            "Normal Walking Steps",
            "Intensity Steps",
            "Floor Steps",
            "Distance",
            "Duration of Normal Walking"
          ]
        }
      ],
      "definitions": [
        {
          "name": "Presence Flags",
          "key": "presence_flags",
          "anchor": "def-presence-flags",
          "description": "The presence of a conditional field of the Activity Goal characteristic is dependent on the Presence Flags field value. When the respective Presence Flags field bit is set to 1, the field is present.\nThe bits of this field are defined below.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "bits",
          "columns": [
            "bit",
            "description"
          ],
          "rows": [
            {
              "bit": "0",
              "description": "Total Energy Expenditure Present"
            },
            {
              "bit": "1",
              "description": "Normal Walking Steps Present"
            },
            {
              "bit": "2",
              "description": "Intensity Steps Present"
            },
            {
              "bit": "3",
              "description": "Floor Steps Present"
            },
            {
              "bit": "4",
              "description": "Distance Present"
            },
            {
              "bit": "5",
              "description": "Duration of Normal Walking Present"
            },
            {
              "bit": "6",
              "description": "Duration of Intensity Walking Present"
            },
            {
              "bit": "7",
              "description": "Reserved for Future Use"
            }
          ],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [
        "Presence Flags"
      ],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.sedentary_interval_notification",
    "uuid": "0x2B4F",
    "name": "Sedentary Interval Notification",
    "slug": "sedentary-interval-notification",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.sedentary_interval_notification.yaml",
      "description": "The Sedentary Interval Notification characteristic is used to represent the sedentary interval notification of a user. The sedentary interval notification is the sedentary time interval after which a user wants to be notified.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Sedentary Interval Notification",
          "anchor": "field-sedentary-interval-notification",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.time.second\nSee \\autoref{sec:org.bluetooth.characteristic.sedentary_interval_notification/field/sedentary_interval_notification}",
          "units": [
            {
              "id": "org.bluetooth.unit.time.second",
              "name": "time (second)",
              "evidence": "Unit: org.bluetooth.unit.time.second"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [
        {
          "name": "Sedentary Interval Notification",
          "key": "sedentary_interval_notification",
          "anchor": "def-sedentary-interval-notification",
          "description": "A value of 0x0000 in the Sedentary Interval Notification field represents that the user does not want to be notified about sedentary intervals.",
          "sectionTitle": null,
          "tableCaption": null,
          "valueHeader": null,
          "descriptionHeader": null,
          "sizeInBits": false,
          "kind": "table",
          "columns": [],
          "rows": [],
          "layout": null,
          "subfields": []
        }
      ],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  },
  {
    "id": "org.bluetooth.characteristic.caloric_intake",
    "uuid": "0x2B50",
    "name": "Caloric Intake",
    "slug": "caloric-intake",
    "scopeReason": "user-data",
    "services": [
      {
        "id": "org.bluetooth.service.user_data",
        "name": "User Data",
        "uuid": "0x181C",
        "source": "assigned_numbers/profiles_and_services/uds/uds_permitted_characteristics.yaml"
      }
    ],
    "referencedBy": [],
    "hasPage": false,
    "pageReason": null,
    "gss": {
      "file": "gss/org.bluetooth.characteristic.caloric_intake.yaml",
      "description": "The Caloric Intake characteristic is used to represent the calorie intake per day of a user.\nThe structure of this characteristic is defined below.",
      "structure": [
        {
          "name": "Caloric Intake",
          "anchor": "field-caloric-intake",
          "type": "uint16",
          "size": "2",
          "sizeKind": "fixed",
          "sizeN": 2,
          "description": "Unit: org.bluetooth.unit.energy.kilogram_calorie",
          "units": [
            {
              "id": "org.bluetooth.unit.energy.kilogram_calorie",
              "name": "energy (kilogram calorie)",
              "evidence": "Unit: org.bluetooth.unit.energy.kilogram_calorie"
            }
          ],
          "presenceText": null,
          "presence": null,
          "offset": 0,
          "offsetVariesWith": []
        }
      ],
      "definitions": [],
      "flagsFields": [],
      "unresolvedRefs": []
    }
  }
];
